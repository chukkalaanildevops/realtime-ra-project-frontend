import { viewType } from '../../shared/components/filterBar/filterBar.model';

export type MenuItemType = {
  title: any;
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
export interface IDraftState {
  isLoader: boolean;
  isRequestDeleteOrApproved: boolean;
  defaultView: viewType;
  request: dataType;
  expense: dataType;
  receipt: dataType;
  benefit?: dataType;
  draftCount: IDraftCount;
  isDraftCountLoading: boolean;
  expenses_with_request: dataType;
  draftCountForReset: IDraftCount;
}

export interface IDraftCount {
  benefits?: number;
  expenses?: number;
  receipts?: number;
  requests?: number;
  expenses_with_requests?: number;
}
export type TDraftCountKeys =
  | 'benefits'
  | 'expenses'
  | 'receipts'
  | 'requests'
  | 'expenses_with_requests';

export type tabs =
  | 'expense'
  | 'request'
  | 'benefit'
  | 'receipt'
  | 'expenses_with_request';
