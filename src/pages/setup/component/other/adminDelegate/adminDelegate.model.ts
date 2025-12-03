export interface IAdminDelegateState {
  isLoading: boolean;
  permissions: [];
  delegations: { [key: string]: any }[];
  paginationData: { [key: string]: any };
  formSubmissionSuccessful?: boolean;
  formSubmissionInProgress?: boolean;
  errorObject?: errorObject;
}

export type errorObject = {
  type: string;
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
