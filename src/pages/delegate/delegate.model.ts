import { dataType } from '../reports/reports.model';

export interface IDelegateState {
  loader: boolean;
  loadingMessage: string;
  success: string;
  error: string;
  apiStatus: boolean;
  apiLoad: boolean;
  permissions: any[];
  isDataLoading: boolean;
  delegateUsers: any[];
  users: any[];
  currentDelegateUser?: any;
  delegateUserJobInfo: any;
  currentDelegateUserLoader: any;
  errorObject?: errorObject;
  delegateScreenConfig?: screenConfig;
  'delegated-by-me': dataType;
  'delegated-to-me': dataType;
}

export type DELEGATE_TABS = 'delegated-by-me' | 'delegated-to-me';
export type errorObject = {
  type: string;
  message: string;
};
export type screenConfig = {
  for: string;
  message: string;
};

export type PROXY_PERMISSIONS =
  | 'ACTION_BENEFIT_APPROVAL'
  | 'ACTION_REQUEST_APPROVAL'
  | 'ACTION_EXPENSE_APPROVAL'
  | 'ACTION_EXPENSE'
  | 'ACTION_REQUEST'
  | 'ACTION_BENEFIT'
  | 'ACTION_RECEIPT';
