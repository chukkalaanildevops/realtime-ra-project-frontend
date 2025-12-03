import { IReportCount } from './reports.model';

export const REPORT_ACTION_TYPES = {
  SET_LOADER: 'REPORT_ACTION_TYPES/SET_LOADER',
  SET_SUCCESS: 'REPORT_ACTION_TYPES/SET_SUCCESS',
  SET_ERROR: 'REPORT_ACTION_TYPES/SET_ERROR',
  SAVE_REQUESTS: 'REPORT_ACTION_TYPES/SAVE_REQUESTS',
  SAVE_EXPENSES: 'REPORT_ACTION_TYPES/SAVE_EXPENSES',
  SAVE_BENEFITS: 'REPORT_ACTION_TYPES/SAVE_BENEFITS',
  SAVE_BENEFIT_ENTITLEMENT_USERS:
    'REPORT_ACTION_TYPES/SAVE_BENEFIT_ENTITLEMENT_USERS',
  SAVE_BENEFIT_ENTITLEMENT: 'REPORT_ACTION_TYPES/SAVE_BENEFIT_ENTITLEMENT',
  SAVE_EXPENSES_WITH_REQUEST: 'REPORT_ACTION_TYPES/SAVE_EXPENSES_WITH_REQUEST',
  SAVE_CASH_ADVANCE_REQUEST: 'REPORT_ACTION_TYPES/SAVE_CASH_ADVANCE_REQUEST',
  SET_LOADING_MESSAGE: 'REPORT_ACTION_TYPES/SET_LOADING_MESSAGE',
  SAVE_REPORT_COUNT: 'REPORT_ACTION_TYPES/SAVE_REPORT_COUNT',
  SET_REPORT_COUNT_FETCHING: 'REPORT_ACTION_TYPES/SET_REPORT_COUNT_FETCHING',
  SET_LOADING_MORE: 'REPORT_ACTION_TYPES/SET_LOADING_MORE',
  SAVE_DOWNLOAD_REPORTS_DATA: 'REPORT_ACTION_TYPES/SAVE_DOWNLOAD_REPORTS_DATA',
  SAVE_REPORT_EXPENSE_FILTERS:
    'REPORT_ACTION_TYPES/SAVE_REPORT_EXPENSE_FILTERS',
  SAVE_REPORT_REQUEST_FILTERS:
    'REPORT_ACTION_TYPES/SAVE_REPORT_REQUEST_FILTERS',
  SAVE_REPORT_CASH_REQUEST_FILTERS:
    'REPORT_ACTION_TYPES/SAVE_REPORT_CASH_REQUEST_FILTERS',
  SAVE_REPORT_EXPENSE_REQUEST_FILTERS:
    'REPORT_ACTION_TYPES/SAVE_REPORT_EXPENSE_REQUEST_FILTERS',
  SAVE_EXPENSE_TYPES: 'REPORT_ACTION_TYPES/SAVE_EXPENSE_TYPES',
  SAVE_BENEFIT_TYPES: 'REPORT_ACTION_TYPES/SAVE_BENEFIT_TYPES',
  SAVE_SPECIALIZED_REPORT_TYPES:
    'REPORT_ACTION_TYPES/SAVE_SPECIALIZED_REPORT_TYPES',
};

export const setLoader = (isLoading: boolean) => ({
  type: REPORT_ACTION_TYPES.SET_LOADER,
  payload: isLoading,
});

export const setError = (error: any) => ({
  type: REPORT_ACTION_TYPES.SET_ERROR,
  payload: error,
});

export const setSuccess = (success: string) => ({
  type: REPORT_ACTION_TYPES.SET_SUCCESS,
  payload: success,
});

export const setLoadingMessage = (message: string) => ({
  type: REPORT_ACTION_TYPES.SET_LOADING_MESSAGE,
  payload: message,
});

export const saveRequests = (request: any[]) => ({
  type: REPORT_ACTION_TYPES.SAVE_REQUESTS,
  payload: request,
});

export const saveExpenses = (expenses: any[]) => ({
  type: REPORT_ACTION_TYPES.SAVE_EXPENSES,
  payload: expenses,
});

export const saveBenefits = (benefits: any[]) => ({
  type: REPORT_ACTION_TYPES.SAVE_BENEFITS,
  payload: benefits,
});

export const saveBenefitEntitlement = (benefitEntitlement: any[]) => ({
  type: REPORT_ACTION_TYPES.SAVE_BENEFIT_ENTITLEMENT,
  payload: benefitEntitlement,
});
export const saveCashAdvanceRequests = (expenses: any[]) => ({
  type: REPORT_ACTION_TYPES.SAVE_CASH_ADVANCE_REQUEST,
  payload: expenses,
});

export const saveExpenseWithRequest = (expenses: any[]) => ({
  type: REPORT_ACTION_TYPES.SAVE_EXPENSES_WITH_REQUEST,
  payload: expenses,
});

export const saveReportCount = (data: IReportCount) => ({
  type: REPORT_ACTION_TYPES.SAVE_REPORT_COUNT,
  payload: data,
});

export const setReportCountLoading = (isLoading: boolean) => ({
  type: REPORT_ACTION_TYPES.SET_REPORT_COUNT_FETCHING,
  payload: isLoading,
});

export const setLoadingMore = (isLoading: boolean) => ({
  type: REPORT_ACTION_TYPES.SET_LOADING_MORE,
  payload: isLoading,
});

export const saveDownloadedReportsList = (downloadList: any[]) => ({
  type: REPORT_ACTION_TYPES.SAVE_DOWNLOAD_REPORTS_DATA,
  payload: downloadList,
});

export const saveExpenseReportFilters = (filters: any[]) => ({
  type: REPORT_ACTION_TYPES.SAVE_REPORT_EXPENSE_FILTERS,
  payload: filters,
});

export const saveRequestReportFilters = (filters: any[]) => ({
  type: REPORT_ACTION_TYPES.SAVE_REPORT_REQUEST_FILTERS,
  payload: filters,
});

export const saveCashRequestReportFilters = (filters: any[]) => ({
  type: REPORT_ACTION_TYPES.SAVE_REPORT_CASH_REQUEST_FILTERS,
  payload: filters,
});

export const saveExpenseRequestReportFilters = (filters: any[]) => ({
  type: REPORT_ACTION_TYPES.SAVE_REPORT_EXPENSE_REQUEST_FILTERS,
  payload: filters,
});

export const saveExpenseTypes = (expenses: any[]) => ({
  type: REPORT_ACTION_TYPES.SAVE_EXPENSE_TYPES,
  payload: expenses,
});

export const saveBenefitTypes = (benefits: any[]) => ({
  type: REPORT_ACTION_TYPES.SAVE_BENEFIT_TYPES,
  payload: benefits,
});

export const saveSpecializedReportTypes = (types: any[]) => ({
  type: REPORT_ACTION_TYPES.SAVE_SPECIALIZED_REPORT_TYPES,
  payload: types,
});

export const saveBenefitEntitlementUsers = (
  dataGroupItems: any[],
  dataGroupItemsPaginationData: any,
) => {
  return {
    type: REPORT_ACTION_TYPES.SAVE_BENEFIT_ENTITLEMENT_USERS,
    payload: {
      isLoading: false,
      benefit_entitlement_users: dataGroupItems,
      benefit_entitlement_users_pagination_data: dataGroupItemsPaginationData,
    },
  };
};
