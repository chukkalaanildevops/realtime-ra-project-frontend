import React, { ReactElement } from 'react';
import { Collapse, Table, Button } from 'antd';
import ApprovalsSubGroupHeader from '../approvalsSubGroupHeader/approvalsSubGroupHeader.index';
import ApprovalsGroupHeader from '../approvalsGroupHeader/approvalsGroupHeader.index';

import { IApprovalResponseData } from '../../../approvals.model';
import { SingleItemResponseButton } from '../../approvalResponseButton/approvalResponseButton.index';
import { DocumentsViewer, Remarks } from '../../../../../shared/components';
import { ColumnsType } from 'antd/lib/table';
import { Trans } from '@lingui/macro';

const createRemarkElementOrBlank = (
  itemId: number,
  totalComments: any,
  item_no: string,
) => {
  if (totalComments === undefined) {
    return (
      <Remarks
        itemId={itemId}
        itemType='requests'
        item_no={item_no}
        remarkCount={0}
      />
    );
  }

  return (
    <Remarks
      itemId={itemId}
      itemType='requests'
      item_no={item_no}
      remarkCount={totalComments}
    />
  );
};

const RequestCollapseGroup = (props: any) => {
  const {
    data,
    selectedRows,
    toggleGroupHeaderCheckbox,
    respondToApprovalItems,
    respondToBulkApprovalItems,
    openDetailsDrawer,
    openGroupKeys,
    setOpenGroupKeys,
    openSubgroupKeys,
    setOpenSubgroupKeys,
    isPendingStatus,
    isLoading,
  } = props;

  let groups: ReactElement[] = [];

  let columns: ColumnsType<any> = [
    {
      title: <Trans>Request ID#</Trans>,
      key: 'request_no',
      dataIndex: 'request_no',
      fixed: 'left',
      width: 170,
      render: (_text: string, _record: any) => (
        <Button
          type='link'
          onClick={() =>
            openDetailsDrawer(
              _record.id,
              _record.request_no,
              'request',
              _record.workflow_status,
              _record,
            )
          }
          className='no-pad _lr'
        >
          {_text}
        </Button>
      ),
    },
    {
      title: <Trans>Start Date</Trans>,
      key: 'start_date',
      dataIndex: 'start_date',
    },
    {
      title: <Trans>End Date</Trans>,
      key: 'end_date',
      dataIndex: 'end_date',
    },
    {
      title: <Trans>Request Type</Trans>,
      key: 'request_type_legal_entity',
      dataIndex: 'request_type',
      render: (_text: string, _record: any, _index: number) => (
        <>{_record.request_type_legal_entity.title}</>
      ),
    },
    {
      title: <Trans>Category</Trans>,
      key: 'request_type_legal_entity',
      dataIndex: 'category',
      render: (_text: string, _record: any, _index: number) => (
        <>
          {_record.request_type_legal_entity.is_travel_type
            ? 'Travel'
            : 'General'}
        </>
      ),
    },
    {
      title: () => <Trans>Receipt/s</Trans>,
      align: 'center' as 'center',
      render: (_text: string, _record: any, _index: number) => (
        <DocumentsViewer
          itemType='request'
          itemNumber={_record.request_no}
          receipt={null}
          documents={_record.attachments}
        />
      ),
    },
    {
      title: <Trans>Remarks</Trans>,
      key: 'purpose',
      dataIndex: 'purpose',
      align: 'center',
      render: (_text: string, _record: any, _index: number) =>
        createRemarkElementOrBlank(
          _record.id,
          _record.total_comments,
          _record.request_no,
        ),
    },
    {
      title: <Trans>Action</Trans>,
      align: 'center',
      width: 100,
      render: (_record: any) => (
        <>
          <div className='item-approval-buttons'>
            <SingleItemResponseButton
              item='request'
              action='approve'
              disabled={selectedRows
                .map((item: any) => {
                  return item.employee;
                })
                .includes(_record.employee.id)}
              responseData={{
                item: 'request',
                action: 'approve',
                employee_ids: [_record.employee.id],
                request_ids: [_record.id],
                is_bulk: false,
              }}
              onConfirmOk={(data: IApprovalResponseData) =>
                respondToApprovalItems(data)
              }
            />
            <SingleItemResponseButton
              item='request'
              action='reject'
              disabled={selectedRows
                .map((item: any) => {
                  return item.employee;
                })
                .includes(_record.employee.id)}
              responseData={{
                item: 'request',
                action: 'reject',
                employee_ids: [_record.employee.id],
                request_ids: [_record.id],
                is_bulk: false,
              }}
              onConfirmOk={(data: IApprovalResponseData) =>
                respondToApprovalItems(data)
              }
            />
          </div>
        </>
      ),
    },
  ];

  try {
    data.forEach((item: any, index: number) => {
      const allItems: any[] = [];
      let totalNumberOfRequests = 0;
      let subgroups: ReactElement[] = [];
      let employeeRequestIds: number[] = [];

      item.subgroups.forEach((subgroup: any, idx: number) => {
        let requestIds: number[] = subgroup.requests.map((request: any) => {
          return request.id;
        });
        employeeRequestIds = employeeRequestIds.concat(requestIds);

        allItems.push(...subgroup.requests);
        let subgroupHeaders = {
          type: subgroup.type,
          count: subgroup.requests.length,
          employeeId: item.employee.id,
          requestIds: requestIds,
          respondToBulkApprovalItems: respondToBulkApprovalItems,
          allItemsInfo: subgroup.requests,
          disabled: selectedRows
            .map((selectedRow: any) => {
              return selectedRow.employee;
            })
            .includes(item.employee.id),
        };

        totalNumberOfRequests += subgroup.requests.length;

        subgroups.push(
          <Collapse.Panel
            key={`${subgroup.type}-${item.employee.id}-${subgroup.request_id}`}
            className='subgroup'
            header={<ApprovalsSubGroupHeader {...subgroupHeaders} />}
          >
            <Table
              bordered={true}
              columns={columns}
              pagination={false}
              // scroll={{ x: 1549 }}
              className='requests-table'
              dataSource={subgroup.requests}
              rowKey='id'
              size='middle'
            />
          </Collapse.Panel>,
        );
      });

      let groupHeaderProps = {
        employeeId: item.employee.id,
        employeeName: item?.employee?.legal_name || item.employee.name,
        profilePictureUrl: item.employee.profile_picture_url,
        designation: item.employee.designation,
        numberOfRequests: totalNumberOfRequests,
        selectedRows: selectedRows,
        toggleGroupHeaderCheckbox: toggleGroupHeaderCheckbox,
        requestIds: employeeRequestIds,
        respondToBulkApprovalItems: respondToBulkApprovalItems,
        allItemsInfo: allItems,
        disabled: selectedRows
          .map((selectedRow: any) => {
            return selectedRow.employee;
          })
          .includes(item.employee.id),
        isPendingStatus: isPendingStatus,
        isLoading: isLoading,
      };

      const CollapsePanel = (
        <Collapse.Panel
          key={index}
          className='group'
          header={<ApprovalsGroupHeader {...groupHeaderProps} />}
        >
          <Collapse
            bordered={false}
            className='subgroups'
            activeKey={openSubgroupKeys}
            onChange={key => setOpenSubgroupKeys(key)}
          >
            {subgroups}
          </Collapse>
        </Collapse.Panel>
      );

      groups.push(CollapsePanel);
    });
  } catch (error) {
    return <></>;
  }

  return (
    <Collapse
      bordered={false}
      className='groups'
      activeKey={openGroupKeys}
      onChange={key => setOpenGroupKeys(key)}
    >
      {groups}
    </Collapse>
  );
};

export default RequestCollapseGroup;
