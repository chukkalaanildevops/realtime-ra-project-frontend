import React, { ReactElement } from 'react';
import { Collapse, Table, Button } from 'antd';
import ApprovalsSubGroupHeader from '../approvalsSubGroupHeader/approvalsSubGroupHeader.index';
import ApprovalsGroupHeader from '../approvalsGroupHeader/approvalsGroupHeader.index';

import { IApprovalResponseData } from '../../../approvals.model';
import { SingleItemResponseButton } from '../../approvalResponseButton/approvalResponseButton.index';
import {
  Remarks,
  Amount,
  DocumentsViewer,
} from '../../../../../shared/components';
import { ColumnsType } from 'antd/lib/table';
import { Trans } from '@lingui/macro';

const createReceiptElementOrBlank = (
  receipt: { [key: string]: any } | null,
  claimNumber: string,
  supportingDocuments: [],
) => {
  return (
    <DocumentsViewer
      itemType='benefit'
      itemNumber={claimNumber}
      receipt={receipt}
      documents={supportingDocuments}
    />
  );
};

const createRemarkElementOrBlank = (
  itemId: number,
  totalComments: any,
  item_no: string,
) => {
  if (totalComments === undefined) {
    return (
      <Remarks
        itemId={itemId}
        itemType='benefit-claim'
        item_no={item_no}
        remarkCount={0}
      />
    );
  }

  return (
    <Remarks
      itemId={itemId}
      itemType='benefit-claim'
      item_no={item_no}
      remarkCount={totalComments}
    />
  );
};

const BenefitCollapseGroup = (props: any) => {
  const {
    data,
    selectedRows,
    toggleGroupHeaderCheckbox,
    respondToApprovalItems,
    respondToBulkApprovalItems,
    openDetailsDrawer,
    openGroupKeys,
    tenantConfig,
    setOpenGroupKeys,
    openSubgroupKeys,
    setOpenSubgroupKeys,
    isPendingStatus,
    isLoading,
  } = props;

  let groups: ReactElement[] = [];

  let columns: ColumnsType<any> = [
    {
      title: <Trans>Benefit ID#</Trans>,
      key: 'claim_number',
      dataIndex: 'claim_number',
      fixed: 'left',
      width: 170,
      render: (_text: string, _record: any) => (
        <Button
          type='link'
          onClick={() =>
            openDetailsDrawer(
              _record.id,
              _record.claim_number,
              'benefit',
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
      title: <Trans>Date</Trans>,
      key: 'date',
      dataIndex: 'date',
    },
    {
      title: <Trans>Benefit Type</Trans>,
      key: 'benefit_type_legal_entity',
      dataIndex: 'benefit_type',
      render: (_text: string, _record: any, _index: number) => (
        <>{_record.benefit_type_legal_entity.benefit_type.title}</>
      ),
    },
    {
      title: <Trans>Receipt/s</Trans>,
      key: 'receipt',
      dataIndex: 'receipt',
      align: 'center',
      render: (_text: string, _record: any, _index: number) =>
        createReceiptElementOrBlank(
          _record.receipt,
          _record.claim_number,
          _record.supporting_documents,
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
          _record.claim_number,
        ),
    },
    {
      title: <Trans>Amount</Trans>,
      key: 'converted_amount',
      dataIndex: 'converted_amount',
      align: 'center',
      render: (_text: string, _record: any, _index: number) => (
        <Amount
          align='center'
          currency={_record.converted_currency}
          amount={_record.amount}
        />
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
              item='benefit'
              action='approve'
              disabled={selectedRows
                .map((selectedRow: any) => {
                  return selectedRow.employee;
                })
                .includes(_record.employee.id)}
              responseData={{
                item: 'benefit',
                action: 'approve',
                employee_ids: [_record.employee.id],
                benefit_claim_ids: [_record.id],
                is_bulk: false,
              }}
              onConfirmOk={(data: IApprovalResponseData) =>
                respondToApprovalItems(data)
              }
            />
            <SingleItemResponseButton
              item='benefit'
              action='reject'
              disabled={selectedRows
                .map((selectedRow: any) => {
                  return selectedRow.employee;
                })
                .includes(_record.employee.id)}
              responseData={{
                item: 'benefit',
                action: 'reject',
                employee_ids: [_record.employee.id],
                benefit_claim_ids: [_record.id],
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
      let totalNumberOfBenefit = 0;
      let subgroups: ReactElement[] = [];
      let employeeBenefitClaimIds: number[] = [];

      item.subgroups.forEach((subgroup: any) => {
        let benefitClaimIds: number[] = subgroup.claims.map((claim: any) => {
          return claim.id;
        });
        employeeBenefitClaimIds = employeeBenefitClaimIds.concat(
          benefitClaimIds,
        );

        allItems.push(...subgroup.claims);

        let subgroupHeaders = {
          type: subgroup.type,
          total: subgroup.total,
          count: subgroup.claims.length,
          typeFlag: subgroup.type_flags,
          currency: item.currency,
          employeeId: item.employee.id,
          benefitClaimIds: benefitClaimIds,
          tenantConfig: tenantConfig,
          respondToBulkApprovalItems: respondToBulkApprovalItems,
          allItemsInfo: subgroup.claims,
          disabled: selectedRows
            .map((selectedRow: any) => {
              return selectedRow.employee;
            })
            .includes(item.employee.id),
        };

        totalNumberOfBenefit += subgroup.claims.length;

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
              className='benefit-claims-table'
              dataSource={subgroup.claims}
              rowKey='id'
              size='middle'
              rowClassName={(record, rowIndex) => {
                if (tenantConfig[0]?.is_enabled_traffic_lights) {
                  if (record.flag_color === 'ORANGE') {
                    return 'row-background-orange';
                  } else if (record.flag_color === 'RED') {
                    return 'row-background-red';
                  } else {
                    return '';
                  }
                } else {
                  return '';
                }
              }}
            />
          </Collapse.Panel>,
        );
      });

      let groupHeaderProps = {
        tenantConfig: tenantConfig,
        employeeId: item.employee.id,
        employeeName: item?.employee?.legal_name || item.employee.name,
        profilePictureUrl: item.employee.profile_picture_url,
        designation: item.employee.designation,
        employeeFlag: item.employee_flags,
        currency: item.currency,
        totalAmount: item.total_amount,
        numberOfBenefit: totalNumberOfBenefit,
        selectedRows: selectedRows,
        toggleGroupHeaderCheckbox: toggleGroupHeaderCheckbox,
        benefitClaimIds: employeeBenefitClaimIds,
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

      // const groupClass =
      //   tenantConfig[0]?.is_enabled_traffic_lights &&
      //   process.env.REACT_APP_ENVIRONMENT &&
      //   ['DEVELOPMENT', 'SAP_STAGING'].includes(
      //     process.env.REACT_APP_ENVIRONMENT,
      //   )
      //     ? (groupHeaderProps.employeeFlag.is_orange &&
      //         groupHeaderProps.employeeFlag.is_red) ||
      //       groupHeaderProps.employeeFlag.is_red
      //       ? ' group border-red'
      //       : groupHeaderProps.employeeFlag.is_orange
      //       ? ' group border-orange'
      //       : 'group'
      //     : 'group';

      const CollapsePanel = (
        <Collapse.Panel
          key={index}
          className={'group'}
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

export default BenefitCollapseGroup;
