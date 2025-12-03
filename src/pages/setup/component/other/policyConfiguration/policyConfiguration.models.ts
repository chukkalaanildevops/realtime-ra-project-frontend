export interface IPolicyConfiguration {
  policyConfiguration: { [key: string]: any }[];
  policyConfigurationDetail?: { [key: string]: any };
  pagination_data: {
    next_page: any;
    number_of_pages: number;
    previous_page: any;
    total_records: number;
  };
  isLoading: boolean;
  formSubmissionInProgress: boolean;
  formSubmissionSuccessful: boolean;
  formErrors: { [key: string]: any };
  serviceCallFailed: boolean;
  serviceCallError?: string;
  policyConfigurationDetailsLoader: boolean;
  policyConfigurationDetails: any;
  listEntities?: { [key: string]: any }[];
  listBusinessUnits: { [key: string]: any }[];
  listDivisions: { [key: string]: any }[];
  listDepartments: { [key: string]: any }[];
  listAllEmployeeGroups: { [key: string]: any }[];
  listAllPayGrades: { [key: string]: any }[];
  listAllSfEmployeeGroups: { [key: string]: any }[];
  listExpenseCategory: { [key: string]: any }[];
  listExpenseTypes: { [key: string]: any }[];
  listAllRequestTypes: { [key: string]: any }[];
  listTargetTypes: { [key: string]: any }[];
  policyUpdateId: [];
  confirmationInfo: {
    visibility: boolean;
    okBtnFn?: any;
    params: any;
  };
  isPermission: boolean;
  isPolicyPageLoading: boolean;
}

export interface ISearchFilter {
  page: number;
  pageSize: number;
  search: string;
  policy_type: string;
  status: string;
  sort_by: string;
  applicable_on: string;
  applicable_to: string;
  expense_types: string;
  weightage?: any;
  is_enforcement?: any;
}

export interface RouteParams {
  id: string;
}
