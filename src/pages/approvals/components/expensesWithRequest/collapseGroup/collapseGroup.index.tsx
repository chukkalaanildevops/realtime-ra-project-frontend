import React, { ReactElement, useState } from 'react';
import { Collapse, Table, Button } from 'antd';
import ApprovalsSubGroupHeader from '../approvalsSubGroupHeader/approvalsSubGroupHeader.index';
import ApprovalsGroupHeader from '../approvalsGroupHeader/approvalsGroupHeader.index';

import { IApprovalResponseData } from '../../../approvals.model';
import { SingleItemResponseButton } from '../../approvalResponseButton/approvalResponseButton.index';
import {
  Remarks,
  Amount,
  ViolationDetails,
} from '../../../../../shared/components';
import DocumentsViewer from '../../../../../shared/components/documentsViewer/documentsViewer.index';
import { ColumnsType } from 'antd/lib/table';
import { Trans } from '@lingui/macro';
import WarningIconWithTooltip from '../../warningIconWithTooltip/warningIconWithTooltip.index';

const createReceiptElementOrBlank = (
  receipt: { [key: string]: any } | null,
  claimNumber: string,
  supportingDocuments: [],
) => {
  return (
    <DocumentsViewer
      itemType='expense'
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
        remarkCount={0}
        itemId={itemId}
        itemType='expense-claims'
        item_no={item_no}
      />
    );
  }

  return (
    <Remarks
      remarkCount={totalComments}
      itemId={itemId}
      itemType='expense-claims'
      item_no={item_no}
    />
  );
};

const ExpensesWithRequestCollapseGroup = (props: any) => {
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
    isEnableTrafficLightFeatureForTenantFeatures,
  } = props;

  let groups: ReactElement[] = [];
  const [isViolationModal, setIsViolationModal] = useState<{
    visibility: boolean;
    item: null | any;
  }>({
    visibility: false,
    item: null,
  });
  const getViolationTitleWithIcons = (record: any) => {
    return (
      <small className='violationIcon-container'>
        {['ORA', 'RED'].includes(record?.flag_color_v2) && (
          <Trans>Policy Violations -</Trans>
        )}
        {record?.flag_color_v2 === 'ORA' && (
          <WarningIconWithTooltip
            filled={false}
            color='ORANGE'
            id={record.id}
            onIconClick={() => {
              setIsViolationModal({
                visibility: true,
                item: record,
              });
            }}
          />
        )}
        {record?.flag_color_v2 === 'RED' && (
          <WarningIconWithTooltip
            filled={false}
            color='RED'
            id={record.id}
            onIconClick={() => {
              setIsViolationModal({ visibility: true, item: record });
            }}
          />
        )}
      </small>
    );
  };

  const onClose = () => {
    setIsViolationModal({ visibility: false, item: null });
  };

  let columns: ColumnsType<any> = [
    {
      title: <Trans>Expense ID#</Trans>,
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
              'expense',
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
      title: <Trans>Expense Type</Trans>,
      key: 'expense_type_legal_entity',
      dataIndex: 'expense_type',
      render: (_text: string, _record: any, _index: number) => (
        <>
          {_record.expense_type_legal_entity.expense_type.title}
          {tenantConfig[0]?.is_enabled_traffic_lights &&
            isEnableTrafficLightFeatureForTenantFeatures &&
            getViolationTitleWithIcons(_record)}
        </>
      ),
    },
    {
      title: <Trans>Category</Trans>,
      key: 'expense_type_legal_entity',
      dataIndex: 'category',
      align: 'center',
      render: (_text: string, _record: any, _index: number) => (
        <>{_record.expense_type_legal_entity.expense_type.category.title}</>
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
          amount={_record.converted_amount}
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
              item='expenses_with_request'
              action='approve'
              disabled={selectedRows
                .map((selectedRow: any) => {
                  return selectedRow.employee;
                })
                .includes(_record.employee.id)}
              responseData={{
                item: 'expenses_with_request',
                action: 'approve',
                employee_ids: [_record.employee.id],
                expense_claim_ids: [_record.id],
                is_bulk: false,
                isApprovalPage: true,
                flag_color_v2: _record.flag_color_v2,
              }}
              onConfirmOk={(data: IApprovalResponseData) =>
                respondToApprovalItems(data)
              }
            />
            <SingleItemResponseButton
              item='expenses_with_request'
              action='reject'
              disabled={selectedRows
                .map((selectedRow: any) => {
                  return selectedRow.employee;
                })
                .includes(_record.employee.id)}
              responseData={{
                item: 'expenses_with_request',
                action: 'reject',
                employee_ids: [_record.employee.id],
                expense_claim_ids: [_record.id],
                is_bulk: false,
                isApprovalPage: true,
                flag_color_v2: _record.flag_color_v2,
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
      let totalNumberOfExpenses = 0;
      let subgroups: ReactElement[] = [];
      let employeeExpenseClaimIds: number[] = [];

      item.subgroups.forEach((subgroup: any, idx: number) => {
        let expenseClaimIds: number[] = subgroup.claims.map((claim: any) => {
          return claim.id;
        });
        employeeExpenseClaimIds = employeeExpenseClaimIds.concat(
          expenseClaimIds,
        );

        allItems.push(...subgroup.claims);
        let subgroupHeaders = {
          type: subgroup.type,
          total: subgroup.total,
          count: subgroup.claims.length,
          typeFlag: subgroup.type_flags,
          currency: item.currency,
          requestId: subgroup.request_id,
          workflow_status: subgroup.request_workflow_status,
          requestNumber: subgroup.request_no,
          employeeId: item.employee.id,
          expenseClaimIds: expenseClaimIds,
          tenantConfig: tenantConfig,

          respondToBulkApprovalItems: respondToBulkApprovalItems,
          allItemsInfo: subgroup.claims,
          disabled: selectedRows
            .map((selectedRow: any) => {
              return selectedRow.employee;
            })
            .includes(item.employee.id),
          openDetailsDrawer,
          isEnableTrafficLightFeatureForTenantFeatures,
          typeFlagV2: subgroup.type_flags_v2,
        };

        totalNumberOfExpenses += subgroup.claims.length;

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
              dataSource={subgroup.claims}
              rowKey='id'
              className='expense-claims-table'
              size='middle'
              rowClassName={(record, rowIndex) => {
                if (tenantConfig[0]?.is_enabled_traffic_lights) {
                  if (isEnableTrafficLightFeatureForTenantFeatures) {
                    return record.flag_color_v2 === 'ORA'
                      ? 'row-background-orange'
                      : record.flag_color_v2 === 'RED'
                      ? 'row-background-red'
                      : '';
                  } else {
                    return record.flag_color === 'ORANGE'
                      ? 'row-background-orange'
                      : record.flag_color === 'RED'
                      ? 'row-background-red'
                      : '';
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
        employeeId: item.employee.id,
        employeeName: item?.employee?.legal_name || item.employee.name,
        profilePictureUrl: item.employee.profile_picture_url,
        designation: item.employee.designation,
        currency: item.currency,
        totalAmount: item.total_amount,
        employeeFlag: item.employee_flags,
        numberOfExpenses: totalNumberOfExpenses,
        selectedRows: selectedRows,
        toggleGroupHeaderCheckbox: toggleGroupHeaderCheckbox,
        tenantConfig: tenantConfig,
        expenseClaimIds: employeeExpenseClaimIds,
        respondToBulkApprovalItems: respondToBulkApprovalItems,
        allItemsInfo: allItems,
        isLoading: isLoading,

        disabled: selectedRows
          .map((selectedRow: any) => {
            return selectedRow.employee;
          })
          .includes(item.employee.id),
        isPendingStatus: isPendingStatus,
        isEnableTrafficLightFeatureForTenantFeatures,
        employeeFlagV2: item.employee_flags_v2,
      };
      const groupClass =
        tenantConfig[0]?.is_enabled_traffic_lights &&
        !isEnableTrafficLightFeatureForTenantFeatures
          ? (groupHeaderProps.employeeFlag.is_orange &&
              groupHeaderProps.employeeFlag.is_red) ||
            groupHeaderProps.employeeFlag.is_red
            ? ' group border-red'
            : groupHeaderProps.employeeFlag.is_orange
            ? ' group border-orange'
            : 'group'
          : tenantConfig[0]?.is_enabled_traffic_lights &&
            isEnableTrafficLightFeatureForTenantFeatures
          ? (groupHeaderProps.employeeFlagV2.is_orange &&
              groupHeaderProps.employeeFlagV2.is_red) ||
            groupHeaderProps.employeeFlagV2.is_red
            ? ' group border-red'
            : groupHeaderProps.employeeFlagV2.is_orange
            ? ' group border-orange'
            : 'group'
          : 'group';

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
          className={groupClass}
          header={<ApprovalsGroupHeader {...groupHeaderProps} />}
        >
          <Collapse
            bordered={false}
            className='subgroups'
            activeKey={openSubgroupKeys}
            onChange={key => {
              setOpenSubgroupKeys(key);
            }}
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
    <>
      <Collapse
        bordered={false}
        className='groups'
        activeKey={openGroupKeys}
        onChange={key => setOpenGroupKeys(key)}
      >
        {groups}
      </Collapse>
      {isViolationModal?.visibility && (
        <ViolationDetails
          visibility={isViolationModal?.visibility}
          item={isViolationModal?.item}
          isApprovalPage={true}
          onClose={onClose}
        />
      )}
    </>
  );
};

export { ExpensesWithRequestCollapseGroup };
