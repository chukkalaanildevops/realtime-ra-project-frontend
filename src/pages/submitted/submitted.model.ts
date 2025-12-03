import { viewType } from '../../shared/components/filterBar/filterBar.model';

export type MenuItemType = {
  title: string;
  icon: React.ForwardRefExoticComponent<any>;
  navigate: string;
  isVisible: boolean;
};

export interface Item {
  key: string;
  expenseId: string;
  amount: number;
  expenseType: string;
  date: Date;
}

export interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: 'number' | 'text' | 'password';
  record: Item;
  index: number;
  isRequired: boolean;
  children: React.ReactNode;
}

export type Fields = 'amount' | 'date' | 'expenseType';

type dataType = {
  data: any[];
  pagination_data: {
    number_of_pages: number;
    total_records: number;
  };
  current_page: number;
};
export interface ISubmittedState {
  isLoader: boolean;
  success: string;
  error: string;
  defaultView: viewType;
  request?: dataType;
  expense?: dataType;
  benefit?: dataType;
  expenses_with_request?: dataType;
  loadingMessage: string;
  requestDetails?: any;
  userDetails?: any;
  submittedCount: ISubmittedCount;
  isSubmittedCountLoading: boolean;
  submittedCountForRest: ISubmittedCount;
}

export interface ISubmittedCount {
  expenses?: number;
  requests?: number;
  expenses_with_requests?: number;
  benefits?: number;
}
export type TSubmittedCountKeys =
  | 'expenses'
  | 'requests'
  | 'expenses_with_requests'
  | 'benefits';

export type tabs = 'expense' | 'request' | 'benefit' | 'expenses_with_request';
