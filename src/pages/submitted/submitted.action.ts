import { ISubmittedCount, TSubmittedCountKeys, tabs } from './submitted.model';

export const SUBMITTED_ACTIONS = {
  SET_LOADER: 'SUBMITTED_ACTIONS/SET_LOADER',
  SET_SUCCESS: 'SUBMITTED_ACTIONS/SET_SUCCESS',
  SET_ERROR: 'SUBMITTED_ACTIONS/SET_ERROR',
  SAVE_REQUESTS: 'SUBMITTED_ACTIONS/SAVE_REQUESTS',
  SAVE_EXPENSES: 'SUBMITTED_ACTIONS/SAVE_EXPENSES',
  SAVE_BENEFITS: 'SUBMITTED_ACTIONS/SAVE_BENEFITS',
  SAVE_MESSAGE: 'SUBMITTED_ACTIONS/SAVE_MESSAGE',
  SET_LOADING_MESSAGE: 'SUBMITTED_ACTIONS/SET_LOADING_MESSAGE',
  SAVE_REQUEST_DETAILS_BY_ID: 'SUBMITTED_ACTIONS/SAVE_REQUEST_DETAILS_BY_ID',
  SAVE_USER_DETAILS: 'SUBMITTED_ACTIONS/SAVE_USER_DETAILS',
  RESET_TO_INITIAL: 'SUBMITTED_ACTIONS/RESET_TO_INITIAL',
  SAVE_SUBMITTED_COUNT: 'SUBMITTED_ACTIONS/SAVE_SUBMITTED_COUNT',
  SAVE_SUBMITTED_COUNT_FOR_RESET:
    'SUBMITTED_ACTIONS/SAVE_SUBMITTED_COUNT_FOR_RESET',
  SET_SUBMITTED_COUNT_FETCHING:
    'SUBMITTED_ACTIONS/SET_SUBMITTED_COUNT_FETCHING',
  SAVE_EXPENSES_WITH_REQUEST: 'SUBMITTED_ACTIONS/SAVE_EXPENSES_WITH_REQUEST',
  RESET_SPECIFIC_SUBMITTED_COUNT:
    'SUBMITTED_ACTIONS/RESET_SPECIFIC_SUBMITTED_COUNT',
};

export const setLoader = (isLoading: boolean) => ({
  type: SUBMITTED_ACTIONS.SET_LOADER,
  payload: isLoading,
});

export const setError = (error: any) => ({
  type: SUBMITTED_ACTIONS.SET_ERROR,
  payload: error,
});

export const setSuccess = (success: string) => ({
  type: SUBMITTED_ACTIONS.SET_SUCCESS,
  payload: success,
});

export const setMessage = (message: string) => ({
  type: SUBMITTED_ACTIONS.SAVE_MESSAGE,
  payload: message,
});

export const saveRequests = (request: any[]) => ({
  type: SUBMITTED_ACTIONS.SAVE_REQUESTS,
  payload: request,
});

export const saveExpenses = (expenses: any[]) => ({
  type: SUBMITTED_ACTIONS.SAVE_EXPENSES,
  payload: expenses,
});

export const saveBenefits = (benefits: any[]) => ({
  type: SUBMITTED_ACTIONS.SAVE_BENEFITS,
  payload: benefits,
});

export const setLoadingMessage = (message: string) => ({
  type: SUBMITTED_ACTIONS.SET_LOADING_MESSAGE,
  payload: message,
});

export const returnDefaultStructureOfTypesData = (
  response: any,
  page: number,
) => ({
  data: response?.data || [],
  pagination_data: {
    number_of_pages: page,
    total_records: response?.data?.length || 0,
  },
});

export const saveRequestDetailsById = (data: any) => ({
  type: SUBMITTED_ACTIONS.SAVE_REQUEST_DETAILS_BY_ID,
  payload: data,
});

export const saveUserDetails = (userData: any) => ({
  type: SUBMITTED_ACTIONS.SAVE_USER_DETAILS,
  payload: userData,
});

export const resetSubmittedToInitial = () => ({
  type: SUBMITTED_ACTIONS.RESET_TO_INITIAL,
});

export const saveSubmittedCount = (data: ISubmittedCount) => ({
  type: SUBMITTED_ACTIONS.SAVE_SUBMITTED_COUNT,
  payload: data,
});

export const setSubmittedCountLoading = (isLoading: boolean) => ({
  type: SUBMITTED_ACTIONS.SET_SUBMITTED_COUNT_FETCHING,
  payload: isLoading,
});

export const saveExpensesWithRequest = (expenses: any[]) => ({
  type: SUBMITTED_ACTIONS.SAVE_EXPENSES_WITH_REQUEST,
  payload: expenses,
});

export const saveSubmittedCountForReset = (data: ISubmittedCount) => ({
  type: SUBMITTED_ACTIONS.SAVE_SUBMITTED_COUNT_FOR_RESET,
  payload: data,
});

export const resetSpecificSubmittedCount = (key: tabs) => ({
  type: SUBMITTED_ACTIONS.RESET_SPECIFIC_SUBMITTED_COUNT,
  payload: key,
});

export const getKeyNameFromTabName = (tabName: tabs): TSubmittedCountKeys => {
  switch (tabName) {
    case 'expense':
      return 'expenses';
    case 'expenses_with_request':
      return 'expenses_with_requests';
    case 'request':
      return 'requests';
    case 'benefit':
      return 'benefits';
    default:
      return 'expenses';
  }
};
