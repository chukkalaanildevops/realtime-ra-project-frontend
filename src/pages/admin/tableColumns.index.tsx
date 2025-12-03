import React, { ReactNode } from 'react';
import { Button } from 'antd';
import { ColumnsType, ColumnType } from 'antd/lib/table';
import {
  Amount,
  StatusTag,
  Remarks,
  DocumentsViewer,
  DotMenu,
} from '../../shared/components';
import {
  EditOutlined,
  CloseOutlined,
  CheckOutlined,
  MoreOutlined,
  EllipsisOutlined,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  EyeOutlined,
} from '@ant-design/icons';
import { IAdminItemTypes } from './admin.models';
import { IItemTypes } from '../approvals/approvals.model';
import { IWorkflowStatus } from '../../shared/model';
import { Trans } from '@lingui/macro';
import { ButtonProps } from 'antd/lib/button';
import { useTableFilters } from '../../shared/hooks';
import Store from '../../shared/redux/store/store.index';

const { getPaginatedSortFilterProps } = useTableFilters();

const getAggregatedExpensesColumns = () => {
  let columns: ColumnsType<any> = [
    {
      title: <Trans>Number Of Expenses</Trans>,
      key: 'total_claims',
      dataIndex: 'total_claims',
      align: 'center',
    },
    {
      title: <Trans>Total Amount</Trans>,
      key: 'total_amount',
      dataIndex: 'total_amount',
      align: 'center',
      render: (_text: string, _record: any) => (
        <Amount
          align='right'
          amount={_record.total_amount}
          currency={_record.currency}
        />
      ),
      sorter: (a, b) => a.total_amount - b.total_amount,
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: <Trans>Tax Amount</Trans>,
      key: 'tax_amount',
      dataIndex: 'tax_amount',
      align: 'center',
      render: (_text: string, _record: any, _index: number) => (
        <Amount
          align='right'
          amount={_record.tax_amount}
          currency={_record.currency}
        />
      ),
    },
    {
      title: <Trans>Amount Before Taxes</Trans>,
      key: 'amount_before_taxes',
      dataIndex: 'amount_before_taxes',
      align: 'center',
      render: (_text: string, _record: any) => (
        <Amount
          align='right'
          amount={_record.amount_before_taxes}
          currency={_record.currency}
        />
      ),
    },
  ];

  return columns;
};

const getAggregatedBenefitsColumns = () => {
  let columns: ColumnsType<any> = [
    {
      title: <Trans>Number Of Benefits</Trans>,
      key: 'total_claims',
      dataIndex: 'total_claims',
      align: 'center',
    },
    {
      title: <Trans>Total Amount</Trans>,
      key: 'total_amount',
      dataIndex: 'total_amount',
      align: 'center',
      render: (_text: string, _record: any) => (
        <Amount
          align='right'
          amount={_record.total_amount}
          currency={_record.currency}
        />
      ),
      sorter: (a, b) => a.total_amount - b.total_amount,
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: <Trans>Tax Amount</Trans>,
      key: 'tax_amount',
      dataIndex: 'tax_amount',
      align: 'center',
      render: (_text: string, _record: any, _index: number) => (
        <Amount
          align='right'
          amount={_record.tax_amount}
          currency={_record.currency}
        />
      ),
    },
    {
      title: <Trans>Amount Before Taxes</Trans>,
      key: 'amount_before_taxes',
      dataIndex: 'amount_before_taxes',
      align: 'center',
      render: (_text: string, _record: any) => (
        <Amount
          align='right'
          amount={_record.amount_before_taxes}
          currency={_record.currency}
        />
      ),
    },
  ];

  return columns;
};

const getAggregatedBenefitEntitlementsColumns = () => {
  let columns: ColumnsType<any> = [
    {
      title: <Trans>Number Of Benefits</Trans>,
      key: 'total_benefits',
      dataIndex: 'total_benefits',
      align: 'center',
    },
  ];

  return columns;
};
const getAggregatedExpenseEntitlementsColumns = () => {
  let columns: ColumnsType<any> = [
    {
      title: <Trans>Number Of Expense Entitled</Trans>,
      key: 'total_expense',
      dataIndex: 'total_expense',
      align: 'center',
    },
  ];

  return columns;
};
const getAggregatedRequestsColumns = () => {
  let columns: ColumnsType<any> = [
    {
      title: <Trans>Number Of Requests</Trans>,
      key: 'total_requests',
      dataIndex: 'total_requests',
      align: 'center',
      sorter: (a, b) => a.total_requests - b.total_requests,
      sortDirections: ['descend', 'ascend'],
    },
  ];

  return columns;
};

const getAggregatedCashAdvanceRequestsColumns = () => {
  let columns: ColumnsType<any> = [
    {
      title: <Trans>Number Of Requests</Trans>,
      key: 'total_cash_advance_requests',
      dataIndex: 'total_cash_advance_requests',
      align: 'center',
    },
    {
      title: <Trans>Amount Requested</Trans>,
      key: 'total_amount_requested',
      dataIndex: 'total_amount_requested',
      align: 'center',
      sorter: (a, b) => a.total_amount_requested - b.total_amount_requested,
      sortDirections: ['descend', 'ascend'],
      render: (_text: string, _record: any) => (
        <Amount
          align='right'
          currency={_record.currency}
          amount={_record.total_amount_requested}
        />
      ),
    },
    {
      title: <Trans>Amount Disbursed Till Date</Trans>,
      key: 'total_amount_disbursed',
      dataIndex: 'total_amount_disbursed',
      align: 'center',
      sorter: (a, b) => a.total_amount_disbursed - b.total_amount_disbursed,
      sortDirections: ['descend', 'ascend'],
      render: (_text: string, _record: any) => (
        <Amount
          align='right'
          currency={_record.currency}
          amount={
            _record.total_amount_disbursed !== null
              ? _record.total_amount_disbursed
              : 0
          }
        />
      ),
    },
  ];

  return columns;
};
const getBenefitSettlementDataViewColumns = (
  openDetailsDrawer: (
    id: number,
    itemNumber: string,
    itemType: IAdminItemTypes,
    itemSubType: any,
    workflowStatus: IWorkflowStatus,
  ) => void,
  handleStatusTagClicked: (
    id: number,
    isActionVisible: boolean,
    itemType: IItemTypes,
    showAttachedWorkflow: boolean,
    onWorkflowAttachedFn?: () => void,
  ) => void,
  isActionAllowed: (permissionCode: string) => boolean,
  attachExpenseWorkflowApiCall: (id: number) => void,
  isSettlementStatusCompleted: boolean = false,
  settlementSelected: any[] = [],
  sortByEmployeeName: any,
  order: any,
) => {
  let columns: ColumnsType<any> = [
    {
      title: <Trans>Benefit ID#</Trans>,
      key: 'claim_number',
      dataIndex: 'claim_number',
      fixed: 'left',
      width: 170,
      render: (_text: string, _record: any) =>
        isActionAllowed('VIEW_ADMIN_BENEFIT_DETAILS') ? (
          <Button
            type='link'
            onClick={() =>
              openDetailsDrawer(
                _record.id,
                _record.claim_number,
                'benefit',
                'benefit settlement',
                _record.workflow_status,
              )
            }
            className='no-pad _lr'
          >
            {_text}
          </Button>
        ) : (
          <>{_text}</>
        ),
    },
    {
      title: <Trans>Employee</Trans>,
      key: 'employee',
      dataIndex: 'employee',
      render: (_text: { [x: string]: any }, _record: any) =>
        _text?.legal_name || _text?.name || '',
      ...getPaginatedSortFilterProps(sortByEmployeeName, order),
    },
    {
      title: <Trans>Receipt Date</Trans>,
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
      title: <Trans>Amount</Trans>,
      key: 'converted_amount',
      dataIndex: 'converted_amount',
      align: 'center',
      render: (_text: string, _record: any, _index: number) => (
        <Amount
          align='right'
          currency={
            _record?.converted_amount_currency || _record?.currency || ''
          }
          amount={_record.converted_amount}
        />
      ),
    },
    {
      title: <Trans>Status</Trans>,
      key: 'workflow_status',
      dataIndex: 'workflow_status',
      width: 150,
      align: 'center',
      render: (_text: string, _record: any) => {
        const condition = !(
          !isSettlementStatusCompleted &&
          settlementSelected.includes(_record.id)
        );

        const statusVal = condition
          ? _record.workflow_status
          : {
              code: 'PRCSNG',
              title: 'Processing',
            };

        const onStatusClickFn = (_event: any) => {
          if (condition) {
            handleStatusTagClicked(
              _record.id,
              true,
              'benefit',
              _record.workflow_status.code === 'STALED' &&
                _record?.benefit_type_legal_entity?.benefit_type
                  ?.has_approval_rule &&
                _record.workflow_steps_count === 0,
              attachExpenseWorkflowApiCall.bind(null, _record.id),
            );
          }
        };

        const btnPropsVal: ButtonProps | undefined = condition
          ? undefined
          : {
              loading: true,
              disabled: true,
            };

        const statusBtn = (
          <StatusTag
            status={statusVal}
            onStatusClick={onStatusClickFn}
            btnProps={btnPropsVal}
          />
        );

        return condition ? (
          statusBtn
        ) : (
          <span className='settlement-processing'>{statusBtn}</span>
        );
      },
    },
  ];

  return columns;
};
const getExpenseSettlementDataViewColumns = (
  openDetailsDrawer: (
    id: number,
    itemNumber: string,
    itemType: IAdminItemTypes,
    itemSubType: any,
    workflowStatus: IWorkflowStatus,
  ) => void,
  handleStatusTagClicked: (
    id: number,
    isActionVisible: boolean,
    itemType: IItemTypes,
    showAttachedWorkflow: boolean,
    onWorkflowAttachedFn?: () => void,
  ) => void,
  isActionAllowed: (permissionCode: string) => boolean,
  attachExpenseWorkflowApiCall: (id: number) => void,
  isSettlementStatusCompleted: boolean = false,
  settlementSelected: any[] = [],
  sortByEmployeeName: any,
  order: any,
  getViolationTitleWithIcons?: (record: any) => ReactNode | void,
) => {
  let columns: ColumnsType<any> = [
    {
      title: <Trans>Expense ID#</Trans>,
      key: 'claim_number',
      dataIndex: 'claim_number',
      fixed: 'left',
      width: 170,
      render: (_text: string, _record: any) =>
        isActionAllowed('VIEW_ADMIN_EXPENSE_DETAILS') ? (
          <Button
            type='link'
            onClick={() =>
              openDetailsDrawer(
                _record.id,
                _record.claim_number,
                'expense',
                'expense settlement',
                _record.workflow_status,
              )
            }
            className='no-pad _lr'
          >
            {_text}
          </Button>
        ) : (
          <>{_text}</>
        ),
    },
    {
      title: <Trans>Employee</Trans>,
      key: 'employee',
      dataIndex: 'employee',
      render: (_text: { [x: string]: any }, _record: any) =>
        _text?.legal_name || _text?.name || '',
      ...getPaginatedSortFilterProps(sortByEmployeeName, order),
    },
    {
      title: <Trans>Receipt Date</Trans>,
      key: 'date',
      dataIndex: 'date',
    },
    {
      title: <Trans>Expense Type</Trans>,
      key: 'expense_type_legal_entity',
      dataIndex: 'expense_type',
      width: 170,
      render: (_text: string, _record: any, _index: number) => (
        <>
          {_record.expense_type_legal_entity.expense_type.title}
          {Store.getState().configuration?.tenantConfig[0]
            ?.is_enabled_traffic_lights &&
            Store.getState().configuration
              ?.isEnableTrafficLightFeatureForTenantFeatures &&
            getViolationTitleWithIcons &&
            getViolationTitleWithIcons(_record)}
        </>
      ),
    },
    {
      title: <Trans>Amount</Trans>,
      key: 'converted_amount',
      dataIndex: 'converted_amount',
      align: 'center',
      render: (_text: string, _record: any, _index: number) => (
        <Amount
          align='right'
          currency={
            _record?.converted_amount_currency || _record?.currency || ''
          }
          amount={_record.converted_amount}
        />
      ),
    },
    {
      title: <Trans>Category</Trans>,
      key: 'expense_type_legal_entity',
      dataIndex: 'category',
      render: (_text: string, _record: any, _index: number) => (
        <>{_record.expense_type_legal_entity.expense_type.category.title}</>
      ),
    },
    {
      title: <Trans>Status</Trans>,
      key: 'workflow_status',
      dataIndex: 'workflow_status',
      width: 150,
      align: 'center',
      render: (_text: string, _record: any) => {
        const condition = !(
          !isSettlementStatusCompleted &&
          settlementSelected.includes(_record.id)
        );

        const statusVal = condition
          ? _record.workflow_status
          : {
              code: 'PRCSNG',
              title: 'Processing',
            };

        const onStatusClickFn = (_event: any) => {
          if (condition) {
            handleStatusTagClicked(
              _record.id,
              true,
              'expense',
              _record.workflow_status.code === 'STALED' &&
                _record?.expense_type_legal_entity?.expense_type
                  ?.has_approval_rule &&
                _record.workflow_steps_count === 0,
              attachExpenseWorkflowApiCall.bind(null, _record.id),
            );
          }
        };

        const btnPropsVal: ButtonProps | undefined = condition
          ? undefined
          : {
              loading: true,
              disabled: true,
            };

        const statusBtn = (
          <StatusTag
            status={statusVal}
            onStatusClick={onStatusClickFn}
            btnProps={btnPropsVal}
          />
        );

        return condition ? (
          statusBtn
        ) : (
          <span className='settlement-processing'>{statusBtn}</span>
        );
      },
    },
  ];

  return columns;
};

const getRequestClosureDataViewColumns = (
  openDetailsDrawer: (
    id: number,
    itemNumber: string,
    itemType: IAdminItemTypes,
    itemSubType: any,
    workflowStatus: IWorkflowStatus,
  ) => void,
  handleStatusTagClicked: (
    id: number,
    isActionVisible: boolean,
    itemType: IItemTypes,
    showAttachedWorkflow: boolean,
    onWorkflowAttachedFn?: () => void,
  ) => void,
  isActionAllowed: (permissionCode: string) => boolean,
  attachRequestWorkflowApiCall: (id: number) => void,
) => {
  let columns: ColumnsType<any> = [
    {
      title: <Trans>Request ID#</Trans>,
      key: 'request_no',
      dataIndex: 'request_no',
      fixed: 'left',
      width: 170,
      render: (_text: string, _record: any) =>
        isActionAllowed('VIEW_ADMIN_REQUEST_DETAILS') ? (
          <Button
            type='link'
            className='no-pad _lr'
            onClick={() =>
              openDetailsDrawer(
                _record.id,
                _record.request_no,
                'request',
                'request closure',
                _record.workflow_status,
              )
            }
          >
            {_text}
          </Button>
        ) : (
          <>{_text}</>
        ),
    },
    {
      title: <Trans>Employee</Trans>,
      key: 'employee',
      dataIndex: 'employee',
      render: (_text: { [x: string]: any }, _record: any) =>
        _text?.legal_name || _text?.name || '',
    },
    {
      title: <Trans>From Date</Trans>,
      key: 'start_date',
      dataIndex: 'start_date',
    },
    {
      title: <Trans>To Date</Trans>,
      key: 'end_date',
      dataIndex: 'end_date',
    },
    {
      title: <Trans>Request Type</Trans>,
      key: 'request_type_legal_entity',
      dataIndex: 'request_type',
      render: (_text: string, _record: any, _index: number) => (
        <>{_record.request_type_legal_entity.request_type.title}</>
      ),
    },
    {
      title: <Trans>Category</Trans>,
      key: 'is_travel_type',
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
      title: <Trans>Status</Trans>,
      key: 'workflow_status',
      dataIndex: 'workflow_status',
      align: 'center',
      width: 150,
      render: (_text: string, _record: any) =>
        _record.workflow_status !== null ? (
          <StatusTag
            status={_record.workflow_status}
            onStatusClick={(_event: any) => {
              handleStatusTagClicked(
                _record.id,
                true,
                'request',
                _record.workflow_status.code === 'STALED' &&
                  _record?.request_type_legal_entity?.has_approval_rule &&
                  _record.workflow_steps_count === 0,
                attachRequestWorkflowApiCall.bind(null, _record.id),
              );
            }}
          />
        ) : (
          <></>
        ),
    },
  ];
  return columns;
};

const getEntitlementDataViewColumns = (
  employeeId: number,
  openDetailsDrawer: (
    id: number,
    itemNumber: string,
    itemType: IAdminItemTypes,
    itemSubType: any,
    workflowStatus: IWorkflowStatus,
  ) => void,
  handleStatusTagClicked: (
    id: number,
    isActionVisible: boolean,
    itemType: IItemTypes,
    showAttachedWorkflow: boolean,
    onWorkflowAttachedFn?: () => void,
  ) => void,
  isActionAllowed: (permissionCode: string, userId: number) => boolean,
  attachExpenseWorkflowApiCall: (id: number) => void,
) => {
  let columns: ColumnsType<any> = [
    {
      title: <Trans>Benefit ID#</Trans>,
      key: 'claim_number',
      dataIndex: 'claim_number',
      fixed: 'left',
      width: 170,
      render: (_text: string, _record: any) =>
        isActionAllowed('VIEW_ADMIN_BENEFIT_DETAILS', employeeId) ? (
          <Button
            type='link'
            onClick={() =>
              openDetailsDrawer(
                _record.id,
                _record.claim_number,
                'benefit',
                'benefit entitlement',
                _record.workflow_status,
              )
            }
            className='no-pad _lr'
          >
            {_text}
          </Button>
        ) : (
          <>{_text}</>
        ),
    },
    {
      title: <Trans>Receipt Date</Trans>,
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
      title: <Trans>Amount</Trans>,
      key: 'converted_amount',
      dataIndex: 'converted_amount',
      render: (_text: string, _record: any, _index: number) => (
        <Amount
          currency={_record.converted_amount_currency}
          amount={_record.converted_amount}
        />
      ),
    },
    {
      title: <Trans>Receipt/s</Trans>,
      key: 'receipt',
      dataIndex: 'receipt',
      className: 'centered-table-cell',
      render: (_text: string, _record: any, _index: number) => (
        <DocumentsViewer
          itemType='benefit'
          itemNumber={_record.claim_number}
          receipt={_record.receipt}
          documents={
            _record.supporting_documents !== undefined
              ? _record.supporting_documents
              : []
          }
          readOnly={
            !isActionAllowed('VIEW_BENEFIT_ADMIN_ATTACHED_RECEIPTS', employeeId)
          }
        />
      ),
    },
    {
      title: <Trans>Remarks</Trans>,
      key: 'purpose',
      dataIndex: 'purpose',
      className: 'centered-table-cell',
      render: (_text: string, _record: any, _index: number) => {
        return (
          <Remarks
            itemId={_record.id}
            itemType='benefit-claim'
            item_no={_record.claim_number}
            remarkCount={
              _record.total_comments !== undefined ? _record.total_comments : 0
            }
            showAddButton={isActionAllowed(
              'ACTION_ADMIN_ADD_REMARK_BENEFIT',
              employeeId,
            )}
          />
        );
      },
    },
    {
      title: <Trans>Status</Trans>,
      key: 'workflow_status',
      dataIndex: 'workflow_status',
      width: 150,
      align: 'center',
      render: (_text: string, _record: any) => (
        <StatusTag
          status={_record.workflow_status}
          onStatusClick={(_event: any) => {
            handleStatusTagClicked(
              _record.id,
              false,
              'benefit',
              _record.workflow_status.code === 'STALED' &&
                _record?.benefit_type_legal_entity?.benefit_type
                  ?.has_approval_rule &&
                _record.workflow_steps_count === 0,
              attachExpenseWorkflowApiCall.bind(null, _record.id),
            );
          }}
        />
      ),
    },
  ];

  return columns;
};

const getEntitlementExpDataViewColumns = (
  employeeId: number,
  openDetailsDrawer: (
    id: number,
    itemNumber: string,
    itemType: IAdminItemTypes,
    itemSubType: any,
    workflowStatus: IWorkflowStatus,
  ) => void,
  handleStatusTagClicked: (
    id: number,
    isActionVisible: boolean,
    itemType: IItemTypes,
    showAttachedWorkflow: boolean,
    onWorkflowAttachedFn?: () => void,
  ) => void,
  isActionAllowed: (permissionCode: string, userId: number) => boolean,
  attachExpenseWorkflowApiCall: (id: number) => void,
) => {
  let columns: ColumnsType<any> = [
    {
      title: <Trans>Expense ID#</Trans>,
      key: 'claim_number',
      dataIndex: 'claim_number',
      fixed: 'left',
      width: 170,
      render: (_text: string, _record: any) =>
        isActionAllowed('VIEW_ADMIN_EXPENSE_DETAILS', employeeId) ? (
          <Button
            type='link'
            onClick={() =>
              openDetailsDrawer(
                _record.id,
                _record.claim_number,
                'expense',
                'expense entitlement',
                _record.workflow_status,
              )
            }
            className='no-pad _lr'
          >
            {_text}
          </Button>
        ) : (
          <>{_text}</>
        ),
    },
    {
      title: <Trans>Receipt Date</Trans>,
      key: 'date',
      dataIndex: 'date',
    },
    {
      title: <Trans>Expense Type</Trans>,
      key: 'expense_type_legal_entity',
      dataIndex: 'expense_type',
      render: (_text: string, _record: any, _index: number) => (
        <>{_record.expense_type_legal_entity.expense_type.title}</>
      ),
    },
    {
      title: <Trans>Amount</Trans>,
      key: 'converted_amount',
      dataIndex: 'converted_amount',
      render: (_text: string, _record: any, _index: number) => (
        <Amount
          currency={_record.converted_amount_currency}
          amount={_record.converted_amount}
        />
      ),
    },
    {
      title: <Trans>Receipt/s</Trans>,
      key: 'receipt',
      dataIndex: 'receipt',
      className: 'centered-table-cell',
      render: (_text: string, _record: any, _index: number) => (
        <DocumentsViewer
          itemType='expense'
          itemNumber={_record.claim_number}
          receipt={_record.receipt}
          documents={
            _record.supporting_documents !== undefined
              ? _record.supporting_documents
              : []
          }
          readOnly={
            !isActionAllowed('VIEW_EXPENSE_ADMIN_ATTACHED_RECEIPTS', employeeId)
          }
        />
      ),
    },
    {
      title: <Trans>Remarks</Trans>,
      key: 'purpose',
      dataIndex: 'purpose',
      className: 'centered-table-cell',
      render: (_text: string, _record: any, _index: number) => {
        return (
          <Remarks
            itemId={_record.id}
            itemType='expense-claims'
            item_no={_record.claim_number}
            remarkCount={
              _record.total_comments !== undefined ? _record.total_comments : 0
            }
            showAddButton={isActionAllowed(
              'ACTION_ADMIN_ADD_REMARK_BENEFIT',
              employeeId,
            )}
          />
        );
      },
    },
    {
      title: <Trans>Status</Trans>,
      key: 'workflow_status',
      dataIndex: 'workflow_status',
      width: 150,
      align: 'center',
      render: (_text: string, _record: any) => (
        <StatusTag
          status={_record.workflow_status}
          onStatusClick={(_event: any) => {
            handleStatusTagClicked(
              _record.id,
              false,
              'expense',
              _record.workflow_status.code === 'STALED' &&
                _record?.expense_type_legal_entity?.expense_type
                  ?.has_approval_rule &&
                _record.workflow_steps_count === 0,
              attachExpenseWorkflowApiCall.bind(null, _record.id),
            );
          }}
        />
      ),
    },
  ];
  return columns;
};

const getExpenseDataViewColumns = (
  employeeId: number,
  openDetailsDrawer: (
    id: number,
    itemNumber: string,
    itemType: IAdminItemTypes,
    itemSubType: any,
    workflowStatus: IWorkflowStatus,
  ) => void,
  handleStatusTagClicked: (
    id: number,
    isActionVisible: boolean,
    itemType: IItemTypes,
    showAttachedWorkflow: boolean,
    onWorkflowAttachedFn?: () => void,
  ) => void,
  showResponseModal: (responseData: {
    item: 'expense' | 'request' | 'expenses_with_request';
    employee_ids: number[];
    expense_claim_ids?: number[];
    request_ids?: number[];
    flag_color_v2?: any;
  }) => void,
  pushUpdateUrl: (item: IAdminItemTypes, id: number) => void,
  isActionAllowed: (permissionCode: string, userId: number) => boolean,
  attachExpenseWorkflowApiCall: (id: number) => void,
  getViolationTitleWithIcons?: (record: any) => ReactNode | void,
) => {
  let columns: ColumnsType<any> = [
    {
      title: <Trans>Expense ID#</Trans>,
      key: 'claim_number',
      dataIndex: 'claim_number',
      fixed: 'left',
      width: 170,
      render: (_text: string, _record: any) =>
        isActionAllowed('VIEW_ADMIN_EXPENSE_DETAILS', employeeId) ? (
          <Button
            type='link'
            onClick={() =>
              openDetailsDrawer(
                _record.id,
                _record.claim_number,
                'expense',
                'expense',
                _record.workflow_status,
              )
            }
            className='no-pad _lr'
          >
            {_text}
          </Button>
        ) : (
          <>{_text}</>
        ),
    },
    {
      title: <Trans>Receipt Date</Trans>,
      key: 'date',
      dataIndex: 'date',
    },
    {
      title: <Trans>Expense Type</Trans>,
      key: 'expense_type_legal_entity',
      dataIndex: 'expense_type',
      width: 170,
      render: (_text: string, _record: any, _index: number) => {
        return (
          <>
            {_record.expense_type_legal_entity.expense_type.title}
            {Store.getState().configuration?.tenantConfig[0]
              ?.is_enabled_traffic_lights &&
              Store.getState().configuration
                ?.isEnableTrafficLightFeatureForTenantFeatures &&
              getViolationTitleWithIcons &&
              getViolationTitleWithIcons(_record)}
          </>
        );
      },
    },
    {
      title: <Trans>Amount</Trans>,
      key: 'converted_amount',
      dataIndex: 'converted_amount',
      align: 'center',
      render: (_text: string, _record: any, _index: number) => (
        <Amount
          align='right'
          currency={_record.converted_amount_currency}
          amount={_record.converted_amount}
        />
      ),
    },
    {
      title: <Trans>Category</Trans>,
      key: 'expense_type_legal_entity',
      dataIndex: 'category',
      render: (_text: string, _record: any, _index: number) => (
        <>{_record.expense_type_legal_entity.expense_type.category.title}</>
      ),
    },
    {
      title: <Trans>Receipt/s</Trans>,
      key: 'receipt',
      dataIndex: 'receipt',
      align: 'center',
      className: 'centered-table-cell',
      render: (_text: string, _record: any, _index: number) => (
        <DocumentsViewer
          itemType='expense'
          itemNumber={_record.claim_number}
          receipt={_record.receipt}
          documents={
            _record.supporting_documents !== undefined
              ? _record.supporting_documents
              : []
          }
          readOnly={
            !isActionAllowed('VIEW_EXPENSE_ADMIN_ATTACHED_RECEIPTS', employeeId)
          }
        />
      ),
    },
    {
      title: <Trans>Remarks</Trans>,
      key: 'purpose',
      dataIndex: 'purpose',
      align: 'center',
      className: 'centered-table-cell',
      render: (_text: string, _record: any, _index: number) => {
        return (
          <Remarks
            itemId={_record.id}
            itemType='expense-claims'
            item_no={_record.claim_number}
            remarkCount={
              _record.total_comments !== undefined ? _record.total_comments : 0
            }
            showAddButton={isActionAllowed(
              'ACTION_ADMIN_ADD_REMARK_EXPENSES',
              employeeId,
            )}
          />
        );
      },
    },
    {
      title: <Trans>Settlement Date</Trans>,
      key: 'workflow_status',
      dataIndex: 'workflow_status',
      align: 'center',
      render: (_text: { [x: string]: string }, _record: any) => {
        if (_text.code === 'SETTLD')
          return (
            <>
              {_text.settled_on}
              <br /> ({_text.batch_number})
            </>
          );
        else return 'NA';
      },
    },
    {
      title: <Trans>Status</Trans>,
      key: 'workflow_status',
      dataIndex: 'workflow_status',
      width: 150,
      align: 'center',
      render: (_text: string, _record: any) => (
        <StatusTag
          status={_record.workflow_status}
          onStatusClick={(_event: any) => {
            handleStatusTagClicked(
              _record.id,
              true,
              'expense',
              _record.workflow_status.code === 'STALED' &&
                _record?.expense_type_legal_entity?.expense_type
                  ?.has_approval_rule &&
                _record.workflow_steps_count === 0,
              attachExpenseWorkflowApiCall.bind(null, _record.id),
            );
          }}
        />
      ),
    },
  ];

  if (
    isActionAllowed('ACTION_ADMIN_REJECT_EXPENSES', employeeId) ||
    isActionAllowed('ACTION_ADMIN_UPDATE_EXPENSES', employeeId)
  ) {
    let column: ColumnType<any> = {
      title: <Trans>Action</Trans>,
      key: 'action',
      dataIndex: 'id',
      align: 'center',
      width: 100,
      render: (_text: string, _record: any) => {
        const actionBtn: any[] = [];
        const { code } = _record.workflow_status;
        if (isActionAllowed('ACTION_ADMIN_UPDATE_EXPENSES', employeeId)) {
          actionBtn.push({
            OnClick: (_event: any) => {
              if (code === 'APPRVD' || code === 'PENDNG' || code === 'STALED') {
                pushUpdateUrl('expense', _record.id);
              }
            },
            Disabled:
              code !== 'APPRVD' && code !== 'PENDNG' && code !== 'STALED',
            Type: 'link',
            children: (
              <span className='edit-button' title='Edit'>
                <Trans>Edit</Trans>
              </span>
            ),
            icon: EditOutlined,
          });
        }
        if (isActionAllowed('ACTION_ADMIN_REJECT_EXPENSES', employeeId)) {
          actionBtn.push({
            OnClick: (event: any) => {
              event.stopPropagation();
              showResponseModal({
                item: 'expense',
                expense_claim_ids: [_record.id],
                employee_ids: [_record.employee.id],
                flag_color_v2: _record.flag_color_v2,
              });
            },
            Disabled: _record.workflow_status.code !== 'APPRVD',
            Type: 'link',
            children: (
              <span className='reject-button' title='Reject'>
                <Trans>Reject</Trans>
              </span>
            ),
            icon: CloseOutlined,
          });
        }
        return (
          <DotMenu menuVisibility={true} actionBtn={actionBtn}>
            <MoreOutlined />
          </DotMenu>
        );
      },
    };

    columns.push(column);
  }

  return columns;
};
const getBenefitDataViewColumns = (
  employeeId: number,
  openDetailsDrawer: (
    id: number,
    itemNumber: string,
    itemType: IAdminItemTypes,
    itemSubType: any,
    workflowStatus: IWorkflowStatus,
  ) => void,
  handleStatusTagClicked: (
    id: number,
    isActionVisible: boolean,
    itemType: IItemTypes,
    showAttachedWorkflow: boolean,
    onWorkflowAttachedFn?: () => void,
  ) => void,
  showResponseModal: (responseData: {
    item: 'benefit';
    employee_ids: number[];
    benefit_claim_ids?: number[];
  }) => void,
  pushUpdateUrl: (item: IAdminItemTypes, id: number) => void,
  isActionAllowed: (permissionCode: string, userId: number) => boolean,
  attachBenefitWorkflowApiCall: (id: number) => void,
) => {
  let columns: ColumnsType<any> = [
    {
      title: <Trans>Benefit ID#</Trans>,
      key: 'claim_number',
      dataIndex: 'claim_number',
      fixed: 'left',
      width: 170,
      render: (_text: string, _record: any) =>
        isActionAllowed('VIEW_ADMIN_BENEFIT_DETAILS', employeeId) ? (
          <Button
            type='link'
            onClick={() =>
              openDetailsDrawer(
                _record.id,
                _record.claim_number,
                'benefit',
                'benefit',
                _record.workflow_status,
              )
            }
            className='no-pad _lr'
          >
            {_text}
          </Button>
        ) : (
          <>{_text}</>
        ),
    },
    {
      title: <Trans>Receipt Date</Trans>,
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
      title: <Trans>Amount</Trans>,
      key: 'converted_amount',
      dataIndex: 'converted_amount',
      align: 'center',
      render: (_text: string, _record: any, _index: number) => (
        <Amount
          align='right'
          currency={_record.converted_amount_currency}
          amount={_record.converted_amount}
        />
      ),
    },
    {
      title: <Trans>Receipt/s</Trans>,
      key: 'receipt',
      dataIndex: 'receipt',
      align: 'center',
      className: 'centered-table-cell',
      render: (_text: string, _record: any, _index: number) => (
        <DocumentsViewer
          itemType='benefit'
          itemNumber={_record.claim_number}
          receipt={_record.receipt}
          documents={
            _record.supporting_documents !== undefined
              ? _record.supporting_documents
              : []
          }
          readOnly={
            !isActionAllowed('VIEW_BENEFIT_ADMIN_ATTACHED_RECEIPTS', employeeId)
          }
        />
      ),
    },
    {
      title: <Trans>Remarks</Trans>,
      key: 'purpose',
      dataIndex: 'purpose',
      align: 'center',
      className: 'centered-table-cell',
      render: (_text: string, _record: any, _index: number) => {
        return (
          <Remarks
            itemId={_record.id}
            itemType='benefit-claim'
            item_no={_record.claim_number}
            remarkCount={
              _record.total_comments !== undefined ? _record.total_comments : 0
            }
            showAddButton={isActionAllowed(
              'ACTION_ADMIN_ADD_REMARK_BENEFITS',
              employeeId,
            )}
          />
        );
      },
    },
    {
      title: <Trans>Settlement Date</Trans>,
      key: 'workflow_status',
      dataIndex: 'workflow_status',
      align: 'center',
      render: (_text: { [x: string]: string }, _record: any) => {
        if (_text.code === 'SETTLD')
          return (
            <>
              {_text.settled_on}
              <br /> ({_text.batch_number})
            </>
          );
        else return 'NA';
      },
    },
    {
      title: <Trans>Status</Trans>,
      key: 'workflow_status',
      dataIndex: 'workflow_status',
      width: 150,
      align: 'center',
      render: (_text: string, _record: any) => (
        <StatusTag
          status={_record.workflow_status}
          onStatusClick={(_event: any) => {
            handleStatusTagClicked(
              _record.id,
              true,
              'benefit',
              _record.workflow_status.code === 'STALED' &&
                _record?.benefit_type_legal_entity?.benefit_type
                  ?.has_approval_rule &&
                _record.workflow_steps_count === 0,
              attachBenefitWorkflowApiCall.bind(null, _record.id),
            );
          }}
        />
      ),
    },
  ];

  if (
    isActionAllowed('ACTION_ADMIN_REJECT_BENEFITS', employeeId) ||
    isActionAllowed('ACTION_ADMIN_UPDATE_BENEFITS', employeeId)
  ) {
    let column: ColumnType<any> = {
      title: <Trans>Action</Trans>,
      key: 'action',
      dataIndex: 'id',
      align: 'center',
      width: 100,
      render: (_text: string, _record: any) => {
        const actionBtn: any[] = [];
        const { code } = _record.workflow_status;
        if (isActionAllowed('ACTION_ADMIN_UPDATE_BENEFITS', employeeId)) {
          actionBtn.push({
            OnClick: (_event: any) => {
              if (code === 'APPRVD' || code === 'PENDNG' || code === 'STALED') {
                pushUpdateUrl('benefit', _record.id);
              }
            },
            Disabled:
              code !== 'APPRVD' && code !== 'PENDNG' && code !== 'STALED',
            Type: 'link',
            children: (
              <span className='edit-button' title='Edit'>
                <Trans>Edit</Trans>
              </span>
            ),
            icon: EditOutlined,
          });
        }
        if (isActionAllowed('ACTION_ADMIN_REJECT_BENEFITS', employeeId)) {
          actionBtn.push({
            OnClick: (event: any) => {
              event.stopPropagation();
              showResponseModal({
                item: 'benefit',
                benefit_claim_ids: [_record.id],
                employee_ids: [_record.employee.id],
              });
            },
            Disabled: _record.workflow_status.code !== 'APPRVD',
            Type: 'link',
            children: (
              <span className='reject-button' title='Reject'>
                <Trans>Reject</Trans>
              </span>
            ),
            icon: CloseOutlined,
          });
        }
        return (
          <DotMenu menuVisibility={true} actionBtn={actionBtn}>
            <MoreOutlined />
          </DotMenu>
        );
      },
    };

    columns.push(column);
  }

  return columns;
};

const getRequestDataViewColumns = (
  employeeId: number,
  openDetailsDrawer: (
    id: number,
    itemNumber: string,
    itemType: IAdminItemTypes,
    itemSubType: any,
    workflowStatus: IWorkflowStatus,
  ) => void,
  handleStatusTagClicked: (
    id: number,
    isActionVisible: boolean,
    itemType: IItemTypes,
    showAttachedWorkflow: boolean,
    onWorkflowAttachedFn?: () => void,
  ) => void,
  showResponseModal: (responseData: {
    item: 'expense' | 'request';
    employee_ids: number[];
    expense_claim_ids?: number[];
    request_ids?: number[];
  }) => void,
  pushUpdateUrl: (item: IAdminItemTypes, id: number) => void,
  isActionAllowed: (permissionCode: string, userId: number) => boolean,
  attachRequestWorkflowApiCall: (id: number) => void,
) => {
  let columns: ColumnsType<any> = [
    {
      title: <Trans>Request ID#</Trans>,
      key: 'request_no',
      dataIndex: 'request_no',
      fixed: 'left',
      width: 170,
      render: (_text: string, _record: any) =>
        isActionAllowed('VIEW_ADMIN_REQUEST_DETAILS', employeeId) ? (
          <Button
            type='link'
            className='no-pad _lr'
            onClick={() =>
              openDetailsDrawer(
                _record.id,
                _record.request_no,
                'request',
                'request',
                _record.workflow_status,
              )
            }
          >
            {_text}
          </Button>
        ) : (
          <>{_text}</>
        ),
    },
    {
      title: <Trans>From Date</Trans>,
      key: 'start_date',
      dataIndex: 'start_date',
    },
    {
      title: <Trans>To Date</Trans>,
      key: 'end_date',
      dataIndex: 'end_date',
    },
    {
      title: <Trans>Request Type</Trans>,
      key: 'request_type_legal_entity',
      dataIndex: 'request_type',
      render: (_text: string, _record: any, _index: number) => (
        <>{_record.request_type_legal_entity.request_type.title}</>
      ),
    },
    {
      title: <Trans>Category</Trans>,
      key: 'is_travel_type',
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
      title: <Trans>Attachments</Trans>,
      key: 'attachments',
      dataIndex: 'attachments',
      className: 'centered-table-cell',
      render: (_text: string, _record: any, _index: number) => {
        return (
          <DocumentsViewer
            itemType='request'
            itemNumber={_record.request_no || ''}
            receipt={null}
            documents={
              Array.isArray(_record.attachments)
                ? _record.attachments.filter((o: any) => Boolean(o.attachment))
                : []
            }
          />
        );
      },
    },
    {
      title: <Trans>Remarks</Trans>,
      key: 'purpose',
      dataIndex: 'purpose',
      className: 'centered-table-cell',
      render: (_text: string, _record: any, _index: number) => {
        return (
          <Remarks
            itemId={_record.id}
            itemType='requests'
            item_no={_record.request_no}
            remarkCount={
              _record.total_comments !== undefined ? _record.total_comments : 0
            }
            showAddButton={isActionAllowed(
              'ACTION_ADMIN_ADD_REMARK_REQUESTS',
              employeeId,
            )}
          />
        );
      },
    },
    {
      title: <Trans>Status</Trans>,
      key: 'workflow_status',
      dataIndex: 'workflow_status',
      align: 'center',
      width: 150,
      render: (_text: string, _record: any) =>
        _record.workflow_status !== null ? (
          <StatusTag
            status={_record.workflow_status}
            onStatusClick={(_event: any) => {
              handleStatusTagClicked(
                _record.id,
                true,
                'request',
                _record.workflow_status.code === 'STALED' &&
                  _record?.request_type_legal_entity?.has_approval_rule &&
                  _record.workflow_steps_count === 0,
                attachRequestWorkflowApiCall.bind(null, _record.id),
              );
            }}
          />
        ) : (
          <></>
        ),
    },
  ];

  if (
    isActionAllowed('ACTION_ADMIN_REJECT_REQUESTS', employeeId) ||
    isActionAllowed('ACTION_ADMIN_UPDATE_REQUESTS', employeeId)
  ) {
    let column: ColumnType<any> = {
      title: <Trans>Action</Trans>,
      key: 'action',
      dataIndex: 'id',
      align: 'center',
      width: 100,
      render: (_text: string, _record: any) => {
        const actionBtn: any[] = [];
        const { code } = _record.workflow_status;
        if (isActionAllowed('ACTION_ADMIN_UPDATE_REQUESTS', employeeId)) {
          actionBtn.push({
            OnClick: (_event: any) => {
              if (code === 'APPRVD' || code === 'PENDNG' || code === 'STALED') {
                pushUpdateUrl('request', _record.id);
              }
            },
            Disabled:
              code !== 'APPRVD' && code !== 'PENDNG' && code !== 'STALED',
            Type: 'link',
            children: (
              <span className='edit-button' title='Edit'>
                <Trans>Edit</Trans>
              </span>
            ),
            icon: EditOutlined,
          });
        }
        if (isActionAllowed('ACTION_ADMIN_REJECT_REQUESTS', employeeId)) {
          actionBtn.push({
            OnClick: (event: any) => {
              event.stopPropagation();
              showResponseModal({
                item: 'request',
                request_ids: [_record.id],
                employee_ids: [_record.employee.id],
              });
            },
            Disabled: _record.workflow_status.code !== 'APPRVD',
            Type: 'link',
            children: (
              <span className='reject-button' title='Reject'>
                <Trans>Reject</Trans>
              </span>
            ),
            icon: CloseOutlined,
          });
        }
        return (
          <DotMenu menuVisibility={true} actionBtn={actionBtn}>
            <MoreOutlined />
          </DotMenu>
        );
      },
    };

    columns.push(column);
  }

  return columns;
};

const getExpensesWithRequestDataViewColumns = (
  employeeId: number,
  openDetailsDrawer: (
    id: number,
    itemNumber: string,
    itemType: IAdminItemTypes,
    itemSubType: any,
    workflowStatus: IWorkflowStatus,
  ) => void,
  handleStatusTagClicked: (
    id: number,
    isActionVisible: boolean,
    itemType: IItemTypes,
    showAttachedWorkflow: boolean,
    onWorkflowAttachedFn?: () => void,
  ) => void,
  isActionAllowed: (permissionCode: string, userId: number) => boolean,
  attachExpenseWorkflowApiCall: (id: number) => void,
) => {
  let columns: ColumnsType<any> = [
    {
      title: <Trans>Request ID#</Trans>,
      key: 'request_no',
      dataIndex: 'request_no',
      align: 'center',
      fixed: 'left',
      width: 170,
      render: (_text: string, _record: any) =>
        isActionAllowed('VIEW_ADMIN_REQUEST_DETAILS', employeeId) ? (
          <Button
            type='link'
            className='no-pad _lr'
            onClick={() =>
              openDetailsDrawer(
                _record.id,
                _record.request_no,
                'request',
                'expense with request',
                _record.workflow_status,
              )
            }
          >
            {_text}
          </Button>
        ) : (
          <>{_text}</>
        ),
    },
    {
      title: <Trans>Request Type</Trans>,
      key: 'request_type',
      dataIndex: 'request_type',
      render: (_text: string, _record: any, _index: number) => (
        <>{_record.request_type}</>
      ),
    },
    {
      title: <Trans>Estimated Claims Amount</Trans>,
      key: 'total_cost_estimation',
      dataIndex: 'total_cost_estimation',
      align: 'center',
      render: (_text: string, _record: any) => (
        <Amount
          align='right'
          currency={_record.currency}
          amount={
            _record.total_cost_estimation !== null
              ? _record.total_cost_estimation
              : 0
          }
        />
      ),
    },
    {
      title: <Trans>Number Of Claims</Trans>,
      key: 'number_of_claims',
      dataIndex: 'number_of_claims',
      align: 'center',
    },
    {
      title: <Trans>Estimation Type</Trans>,
      key: 'estimation_type',
      dataIndex: 'estimation_type',
      align: 'center',
      render: (_text: string, _record: any) =>
        _record.estimation_type !== null ? (
          _record.estimation_type?.title
        ) : (
          <></>
        ),
    },
    {
      title: <Trans>Remarks</Trans>,
      key: 'purpose',
      dataIndex: 'purpose',
      align: 'center',
      render: (_text: string, _record: any, _index: number) => {
        return (
          <Remarks
            itemId={_record.id}
            itemType='requests'
            item_no={_record.request_no}
            remarkCount={
              _record.total_comments !== undefined ? _record.total_comments : 0
            }
            showAddButton={isActionAllowed(
              'ACTION_ADMIN_ADD_REMARK_EXPENSES_WITH_REQUESTS',
              employeeId,
            )}
          />
        );
      },
    },
    {
      title: <Trans>Status</Trans>,
      key: 'workflow_status',
      dataIndex: 'workflow_status',
      align: 'center',
      width: 150,
      render: (_text: string, _record: any) =>
        _record.workflow_status !== null ? (
          <StatusTag
            status={_record.workflow_status}
            onStatusClick={(_event: any) => {
              handleStatusTagClicked(
                _record.id,
                true,
                'request',
                _record.workflow_status.code === 'STALED' &&
                  _record?.expense_type_legal_entity?.expense_type
                    ?.has_approval_rule &&
                  _record.workflow_steps_count === 0,
                attachExpenseWorkflowApiCall.bind(null, _record.id),
              );
            }}
          />
        ) : (
          <></>
        ),
    },
  ];

  return columns;
};

const getBenefitEntitlementDataViewColumns = (
  employeeId: number,
  openDetailsDrawer: (
    id: number,
    itemNumber: string,
    itemType: IAdminItemTypes,
    itemSubType: any,
    workflowStatus: IWorkflowStatus,
  ) => void,
  isActionAllowed: (permissionCode: string, userId: number) => boolean,
  editItem: any,
  viewEntitlementAdjustments: any,
  getPermissions: any,
) => {
  let columns: ColumnsType<any> = [
    {
      title: <Trans>Benefit Type</Trans>,
      key: 'benefit_type',
      dataIndex: 'benefit_type',
      render: (_text: string, _record: any, _index: number) => (
        <>{_record.benefit_type}</>
      ),
    },
    {
      title: <Trans>From Date</Trans>,
      key: 'start_date',
      dataIndex: 'start_date',
    },
    {
      title: <Trans>To Date</Trans>,
      key: 'end_date',
      dataIndex: 'end_date',
    },
    {
      title: <Trans>Total Amount</Trans>,
      key: 'amount',
      dataIndex: 'amount',
      render: (_text: string, _record: any) =>
        typeof _record.amount === 'string' ? (
          <>{_record.amount}</>
        ) : (
          <Amount
            currency={_record.currency}
            amount={_record.amount !== null ? _record.amount : 0}
          />
        ),
    },
    {
      title: <Trans>Max Claim Amount</Trans>,
      key: 'max_claim_amount',
      dataIndex: 'max_claim_amount',
      render: (_text: string, _record: any) => (
        <Amount
          currency={_record.currency}
          amount={
            _record.max_claim_amount !== null ? _record.max_claim_amount : 0
          }
        />
      ),
    },
    {
      title: <Trans>Min Claim Amount</Trans>,
      key: 'min_claim_amount',
      dataIndex: 'min_claim_amount',
      render: (_text: string, _record: any) => (
        <Amount
          currency={_record.currency}
          amount={
            _record.min_claim_amount !== null ? _record.min_claim_amount : 0
          }
        />
      ),
    },
    {
      title: <Trans>Payable Percent</Trans>,
      key: 'payable_percent',
      dataIndex: 'payable_percent',
    },
    {
      title: <Trans>Copay Value</Trans>,
      key: 'copay_value',
      dataIndex: 'copay_value',
    },
    {
      title: <Trans>Entitlement Period</Trans>,
      key: 'entitlement_period',
      dataIndex: 'entitlement_period',
      render: (_text: string, _record: any, _index: number) => (
        <>{_record?.entitlement_period?.title || '-'}</>
      ),
    },
  ];

  if (getPermissions.ACTION_BENEFIT_ADJUSTMENT) {
    columns.push({
      dataIndex: '',
      align: 'center' as 'center',
      width: 100,
      fixed: 'right' as 'right',
      title: <Trans>Action</Trans>,
      render: (_val: string, item: any) => {
        let action: any[] = [
          {
            Disabled: item?.is_lapsed || item?.amount === 'Unlimited',
            Type: 'link',
            icon: EditOutlined,
            children: <Trans>Edit</Trans>,
            OnClick: () => editItem(item.id, item),
          },
          {
            Type: 'link',
            icon: EyeOutlined,
            children: <Trans>View-adjustments</Trans>,
            OnClick: () => viewEntitlementAdjustments(item.id),
          },
        ];

        return (
          <DotMenu actionBtn={action}>
            <EllipsisOutlined />
          </DotMenu>
        );
      },
    });
  }

  return columns;
};

const getBenefitEntitlementAdjustmentViewColumns = () => {
  let columns: ColumnsType<any> = [
    {
      title: <Trans>Amount</Trans>,
      key: 'amount',
      dataIndex: 'amount',
      render: (_text: string, _record: any, _index: number) => (
        <>{_record.amount}</>
      ),
    },
    {
      title: <Trans>Action</Trans>,
      key: 'action',
      dataIndex: 'action',
      render: (_text: string, _record: any, _index: number) => (
        <>{_record.action.title}</>
      ),
    },
    {
      title: <Trans>Operation Type</Trans>,
      key: 'operation_type',
      dataIndex: 'operation_type',
      render: (_text: string, _record: any, _index: number) => (
        <>{_record.operation_type.title}</>
      ),
    },
    {
      title: <Trans>Reason</Trans>,
      key: 'reason',
      dataIndex: 'reason',
      render: (_text: string, _record: any, _index: number) => (
        <>{_record.reason}</>
      ),
    },
  ];

  return columns;
};

const getExpenseEntitlementDataViewColumns = (
  employeeId: number,
  openDetailsDrawer: (
    id: number,
    itemNumber: string,
    itemType: IAdminItemTypes,
    itemSubType: any,
    workflowStatus: IWorkflowStatus,
  ) => void,
  isActionAllowed: (permissionCode: string, userId: number) => boolean,
) => {
  let columns: ColumnsType<any> = [
    {
      title: <Trans>Expense Type</Trans>,
      key: 'expense_type',
      dataIndex: 'expense_type',
      render: (_text: string, _record: any, _index: number) => (
        <>{_record.expense_type}</>
      ),
    },
    {
      title: <Trans>From Date</Trans>,
      key: 'start_date',
      dataIndex: 'start_date',
    },
    {
      title: <Trans>To Date</Trans>,
      key: 'end_date',
      dataIndex: 'end_date',
    },
    {
      title: <Trans>Max Claim Amount</Trans>,
      key: 'max_amount',
      dataIndex: 'max_amount',
      render: (_text: string, _record: any) => (
        <Amount
          currency={_record.currency}
          amount={_record.max_amount !== null ? _record.max_amount : 0}
        />
      ),
    },
    {
      title: <Trans>Min Claim Amount</Trans>,
      key: 'min_amount',
      dataIndex: 'min_amount',
      render: (_text: string, _record: any) => (
        <Amount
          currency={_record.currency}
          amount={_record.min_amount !== null ? _record.min_amount : 0}
        />
      ),
    },
    {
      title: <Trans>Entitlement Period</Trans>,
      key: 'entitlement_period',
      dataIndex: 'entitlement_period',
      render: (_text: string, _record: any, _index: number) => (
        <>{_record?.entitlement_period?.title || '-'}</>
      ),
    },
  ];

  return columns;
};
const getCashAdvanceRequestDataViewColumns = (
  employeeId: number,
  openDetailsDrawer: (
    id: number,
    itemNumber: string,
    itemType: IAdminItemTypes,
    itemSubType: any,
    workflowStatus: IWorkflowStatus,
    cashAdvanceRequestDetails?: { [key: string]: any },
  ) => void,
  handleOnDisburseClick: (
    requestId: number,
    requestNumber: string,
    amountRequested: number,
    currency: string,
    startDate: string,
    endDate: string,
  ) => void,
  handleOnRejectClick: (
    requestId: number,
    requestNumber: string,
    amountRequested: number,
    currency: string,
  ) => void,
  setDisbursalModalVisible: (visible: boolean) => void,
  setCashAdvanceRejectionModalVisible: (visible: boolean) => void,
  isActionAllowed: (permissionCode: string, userId: number) => boolean,
) => {
  let columns: ColumnsType<any> = [
    {
      title: <Trans>Cash Advance Request ID#</Trans>,
      key: 'cash_advance_request_number',
      dataIndex: 'cash_advance_request_number',
      fixed: 'left',
      width: 170,
      render: (_text: string, _record: any) => (
        <Button
          type='link'
          className='no-pad _lr'
          onClick={() =>
            openDetailsDrawer(
              _record.id,
              _record.cash_advance_request_number,
              'cash_advance_request',
              'cash_advance_request',
              _record.status,
              {
                disbursementDate:
                  _record.disbursed_date !== null ? _record.disbursed_date : '',
                currency: _record.currency !== null ? _record.currency : '',
                disbursedAmount:
                  _record.amount_disbursed !== null
                    ? _record.amount_disbursed
                    : '',
                disbursedVia:
                  _record.disbursed_through !== null
                    ? _record.disbursed_through.title
                    : '',
                remark: _record.remark,
                status: _record.status,
                responded_by: _record.responded_by,
                responded_on: _record.responded_on,
              },
            )
          }
        >
          {_record.cash_advance_request_number}
        </Button>
      ),
    },
    {
      title: <Trans>Request ID#</Trans>,
      key: 'request_no',
      dataIndex: 'request_no',
      align: 'center',
      width: 170,
      render: (_text: string, _record: any) =>
        isActionAllowed('VIEW_ADMIN_REQUEST_DETAILS', employeeId) ? (
          <Button
            type='link'
            className='no-pad _lr'
            onClick={() =>
              openDetailsDrawer(
                _record.request.id,
                _record.request.request_no,
                'request',
                'request',
                _record.request.workflow_status,
              )
            }
          >
            {_record.request.request_no}
          </Button>
        ) : (
          <>{_record.request.request_no}</>
        ),
    },
    {
      title: <Trans>Request Type</Trans>,
      key: 'request_type',
      dataIndex: 'request_type',
      render: (_text: string, _record: any) =>
        _record.request.request_type_legal_entity.request_type.title,
    },
    {
      title: <Trans>Estimated Amount</Trans>,
      key: 'estimated_amount',
      dataIndex: 'estimated_amount',
      align: 'center',
      render: (_text: string, _record: any) => (
        <Amount
          align='right'
          currency={_record.currency}
          amount={_record.request.estimated_amount}
        />
      ),
    },
    {
      title: <Trans>Amount Requested</Trans>,
      key: 'amount_requested',
      dataIndex: 'amount_requested',
      align: 'center',
      render: (_text: string, _record: any) => (
        <Amount
          align='right'
          currency={_record.currency}
          amount={_record.amount_requested}
        />
      ),
    },
    {
      title: <Trans>Amount Disbursed</Trans>,
      key: 'amount_requested',
      dataIndex: 'amount_requested',
      align: 'center',
      render: (_text: string, _record: any) => {
        if (_record.status.code.toLowerCase() === 'PENDNG') {
          return <>Disbursal Pending</>;
        } else {
          return (
            <Amount
              align='right'
              currency={_record.currency}
              amount={_record.amount_disbursed}
            />
          );
        }
      },
    },
    {
      title: <Trans>Remarks</Trans>,
      key: 'purpose',
      dataIndex: 'purpose',
      align: 'center',
      render: (_text: string, _record: any, _index: number) => {
        return (
          <Remarks
            itemId={_record.request.id}
            itemType='requests'
            item_no={_record.request.request_no}
            remarkCount={
              _record.total_comments !== undefined ? _record.total_comments : 0
            }
            showAddButton={isActionAllowed(
              'ACTION_ADMIN_ADD_REMARK_CASH_ADVANCE_REQUESTS',
              employeeId,
            )}
          />
        );
      },
    },
    {
      title: <Trans>Status</Trans>,
      key: 'status',
      dataIndex: 'status',
      align: 'center',
      width: 150,
      render: (_text: string, _record: any, _index: number) => (
        <StatusTag status={_record.status} />
      ),
    },
  ];

  if (
    isActionAllowed(
      'ACTION_ADMIN_DISBURSE_REJECT_CASH_ADVANCE_REQUEST',
      employeeId,
    )
  ) {
    columns.push({
      title: <Trans>Action</Trans>,
      key: 'action',
      dataIndex: 'id',
      align: 'center',
      width: 100,
      render: (_text: string, _record: any) => {
        return (
          <div className='buttons'>
            <Button
              type='link'
              size='small'
              shape='circle'
              title='Disburse'
              className='disburse-button'
              icon={<CheckOutlined />}
              disabled={_record.status.code !== 'PENDNG'}
              onClick={_event => {
                setDisbursalModalVisible(true);
                handleOnDisburseClick(
                  _record.id,
                  _record.request.request_no,
                  _record.amount_requested,
                  _record.currency,
                  _record.request.start_date,
                  _record.request.end_date,
                );
              }}
            />

            <Button
              type='link'
              size='small'
              shape='circle'
              title='Reject'
              disabled={_record.status.code !== 'PENDNG'}
              className='reject-button'
              icon={<CloseOutlined />}
              onClick={_event => {
                setCashAdvanceRejectionModalVisible(true);
                handleOnRejectClick(
                  _record.id,
                  _record.cash_advance_request_number,
                  _record.amount_requested,
                  _record.currency,
                );
              }}
            />
          </div>
        );
      },
    });
  }

  return columns;
};

export {
  // Aggregated Data View Columns
  getAggregatedExpensesColumns,
  getAggregatedRequestsColumns,
  getAggregatedBenefitsColumns,
  getAggregatedBenefitEntitlementsColumns,
  getAggregatedExpenseEntitlementsColumns,
  getAggregatedCashAdvanceRequestsColumns,
  getExpenseSettlementDataViewColumns, //settlement
  getBenefitSettlementDataViewColumns,
  getBenefitEntitlementAdjustmentViewColumns,
  getRequestClosureDataViewColumns, //request closure
  // Single User Table View Columns
  getExpenseDataViewColumns,
  getBenefitDataViewColumns,
  getRequestDataViewColumns,
  getEntitlementDataViewColumns,
  getEntitlementExpDataViewColumns,
  getExpensesWithRequestDataViewColumns,
  getBenefitEntitlementDataViewColumns,
  getExpenseEntitlementDataViewColumns,
  getCashAdvanceRequestDataViewColumns,
};
