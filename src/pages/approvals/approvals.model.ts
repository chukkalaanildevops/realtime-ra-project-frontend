/* Component related interfaces */

export interface IApprovals {
  activeTabKey: string;
  pendingItemsCount: {
    expenses: number;
    requests: number;
    expensesWithRequests: number;
    benefits: number;
  };
  expenseApprovalItems: [];
  requestApprovalItems: [];
  expensesWithRequestApprovalItems: [];
  benefitApprovalItems: [];
  selectAllCheckboxChecked: boolean;
  selectedEmployeeIds: [];
  serviceCallFailed: boolean;
  approvalItemsLoading: boolean;
  approvalItemsCountLoading: boolean;
  paginationData: IApprovalPaginationData;
  isLoading: boolean;
}

export interface IApprovalPaginationData {
  next_page: null | number;
  number_of_pages: null | number;
  previous_page: null | number;
  total_records: null | number;
}

export enum EactiveTabKey {
  'expense' = 1,
  'request',
  'expenses_with_request',
  'benefit',
}

export interface IApprovalItemsRequestParameters {
  page: number;
  item: 'expense' | 'request' | 'benefit' | 'expenses_with_request';
  for_employee?: number | undefined;
  function: 'data' | 'count';
  // delegation: number;
  [key: string]: any;
  employee?: number;
  // status?: string;
  from_date?: string;
  to_date?: string;
  min_amount?: string;
  max_amount?: string;
  expense_type?: string;
  request_type?: string;
  category?: string;
  has_receipt?: number;
}

export interface IApprovalResponseData {
  action: 'approve' | 'reject';
  item: 'expense' | 'request' | 'benefit' | 'expenses_with_request';
  employee_ids?: number[];
  for_employee?: number;
  expense_claim_ids?: number[];
  request_ids?: number[];
  benefit_claim_ids?: number[];
  response_comment?: string;
  is_bulk?: boolean;
  isApprovalPage?: boolean;
  isAdmin?: boolean;
  flag_color_v2?: any;
}

export interface IBulkApprovalResponseData {
  action: 'approve' | 'reject';
  item: 'expense' | 'request' | 'benefit' | 'expenses_with_request';
  items: {
    id: number;
    comment?: string;
  }[];
}

export type IItemTypes =
  | 'expense'
  | 'request'
  | 'expenses_with_request'
  | 'benefit';
