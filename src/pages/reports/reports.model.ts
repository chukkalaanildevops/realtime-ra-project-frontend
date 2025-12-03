import { ColumnProps } from 'antd/lib/table';

export type REPORT_OF = 'Expenses' | 'Request' | 'benefits';

export type dataType = {
  data: any[];
  pagination_data: {
    number_of_pages: number;
    total_records: number;
    next_page: number;
  };
  current_page: number;
};
export interface IReportState {
  isLoader: boolean;
  success: string;
  error: string;
  request: dataType;
  expense: dataType;
  loadingMessage: string;
  benefit: dataType;
  benefit_entitlement: dataType;
  benefit_entitlement_users: any[];
  expenses_with_request: dataType;
  cash_advance_request: dataType;
  reportCount: IReportCount;
  isReportCountLoading: boolean;
  benefit_entitlement_users_pagination_data: any;
  loadingMore: boolean;
  reportsList: any[];
  expenseFilters: any[];
  requestFilters: any[];
  cashAdvanceFilters: any[];
  expenseRequestFilters: any[];
  expenseTypes: any[];
  benefitTypes: any[];
  specializedReportTypes: any[];
}

export interface TAB_ITEM_PROPS {
  reportOf: REPORT_OF;
  columns: any[];
  data: dataType;
  entities?: any[];
  onChangePagination: (page: number) => void;
}

// export const STATUS_COLORS: any = {
//   ALL: 'blue',
//   PENDING: 'magenta',
//   APPROVED: 'cyan',
//   REJECTED: 'red',
//   PROCESSING: 'purple',
//   SETTLED: 'blue',
// };

export interface IFilterProps {
  category?: { title: string; id: number }[];
  entities?: any[];
}

export interface ISavedFilter {
  [name: string]: {
    date?: string;
    category?: string;
    organization?: string;
    employees?: string;
    type?: string;
    withReceipt?: string;
    status: string[];
  };
}

export interface IReportCount {
  expenses?: number;
  requests?: number;
  benefits?: number;
  cash_advance_requests?: number;
  expenses_with_requests?: number;
  benefit_entitlements?: number;
}

export type tabs =
  | 'expense'
  | 'request'
  | 'expenses_with_request'
  | 'cash_advance_request'
  | 'benefit'
  | 'benefit_entitlement';
