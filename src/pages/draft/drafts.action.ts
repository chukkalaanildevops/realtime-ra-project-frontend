import { IDraftCount, tabs, TDraftCountKeys } from './draft.model';

export const DRAFTS_ACTIONS = {
  SET_LOADER: 'DRAFTS_ACTIONS/SET_LOADER',
  SET_SUCCESS: 'DRAFTS_ACTIONS/SET_SUCCESS',
  SET_ERROR: 'DRAFTS_ACTIONS/SET_ERROR',
  SAVE_REQUESTS: 'DRAFTS_ACTIONS/SAVE_REQUESTS',
  SAVE_EXPENSES: 'DRAFTS_ACTIONS/SAVE_EXPENSES',
  SAVE_BENEFITS: 'DRAFTS_ACTIONS/SAVE_BENEFITS',
  SAVE_RECEIPT: 'DRAFTS_ACTIONS/SAVE_RECEIPT',
  SAVE_MESSAGE: 'DRAFTS_ACTIONS/SAVE_MESSAGE',
  SET_LOADING_MESSAGE: 'DRAFTS_ACTIONS/SET_LOADING_MESSAGE',
  RESET_TO_INITIAL: 'DRAFTS_ACTIONS/RESET_TO_INITIAL',
  SAVE_DRAFT_COUNT: 'DRAFTS_ACTIONS/SAVE_DRAFT_COUNT',
  SET_DRAFT_COUNT_FETCHING: 'DRAFTS_ACTIONS/SET_DRAFT_COUNT_FETCHING',
  SAVE_EXPENSES_WITH_REQUEST: 'DRAFTS_ACTIONS/SAVE_EXPENSES_WITH_REQUEST',
  SAVE_DRAFT_COUNT_FOR_RESET: 'DRAFTS_ACTIONS/SAVE_DRAFT_COUNT_FOR_RESET',
  SET_REQUEST_DELETE_APPROVED_STATE:
    'DRAFTS_ACTIONS/SET_REQUEST_DELETE_APPROVED_STATE',
  RESET_SPECIFIC_SUBMITTED_COUNT:
    'DRAFTS_ACTIONS/RESET_SPECIFIC_SUBMITTED_COUNT',
};

export const setLoader = (isLoading: boolean) => ({
  type: DRAFTS_ACTIONS.SET_LOADER,
  payload: isLoading,
});

export const setError = (error: any) => ({
  type: DRAFTS_ACTIONS.SET_ERROR,
  payload: error,
});

export const setSuccess = (success: string) => ({
  type: DRAFTS_ACTIONS.SET_SUCCESS,
  payload: success,
});

export const setMessage = (message: string) => ({
  type: DRAFTS_ACTIONS.SAVE_MESSAGE,
  payload: message,
});

export const saveRequests = (request: any[]) => {
  return {
    type: DRAFTS_ACTIONS.SAVE_REQUESTS,
    payload: request,
  };
};

export const saveExpenses = (expenses: any[]) => ({
  type: DRAFTS_ACTIONS.SAVE_EXPENSES,
  payload: expenses,
});

export const saveBenefits = (benefits: any[]) => ({
  type: DRAFTS_ACTIONS.SAVE_BENEFITS,
  payload: benefits,
});

export const saveReceipt = (receipts: any[]) => ({
  type: DRAFTS_ACTIONS.SAVE_RECEIPT,
  payload: receipts,
});

export const setLoadingMessage = (message: string) => ({
  type: DRAFTS_ACTIONS.SET_LOADING_MESSAGE,
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

export const resetDraftToInitial = () => ({
  type: DRAFTS_ACTIONS.RESET_TO_INITIAL,
});

export const saveDraftCount = (data: IDraftCount) => ({
  type: DRAFTS_ACTIONS.SAVE_DRAFT_COUNT,
  payload: data,
});

export const setDraftCountLoading = (isLoading: boolean) => ({
  type: DRAFTS_ACTIONS.SET_DRAFT_COUNT_FETCHING,
  payload: isLoading,
});
export const setRequestApprovedOrDeleteState = (data: boolean) => ({
  type: DRAFTS_ACTIONS.SET_REQUEST_DELETE_APPROVED_STATE,
  payload: data,
});

export const saveExpensesWithRequest = (expenses: any[]) => ({
  type: DRAFTS_ACTIONS.SAVE_EXPENSES_WITH_REQUEST,
  payload: expenses,
});

export const saveDraftCountForReset = (data: IDraftCount) => ({
  type: DRAFTS_ACTIONS.SAVE_DRAFT_COUNT_FOR_RESET,
  payload: data,
});

export const resetSpecificSubmittedCount = (key: tabs) => ({
  type: DRAFTS_ACTIONS.RESET_SPECIFIC_SUBMITTED_COUNT,
  payload: key,
});

export const getKeyNameFromDraftTabName = (tabName: tabs): TDraftCountKeys => {
  switch (tabName) {
    case 'expense':
      return 'expenses';
    case 'expenses_with_request':
      return 'expenses_with_requests';
    case 'request':
      return 'requests';
    case 'benefit':
      return 'benefits';
    case 'receipt':
      return 'receipts';
    default:
      return 'expenses';
  }
};
