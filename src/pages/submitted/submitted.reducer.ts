import { ISubmittedState, TSubmittedCountKeys } from './submitted.model';

import { SUBMITTED_ACTIONS, getKeyNameFromTabName } from './submitted.action';

export const initialState: ISubmittedState = {
  isLoader: false,
  success: '',
  error: '',
  loadingMessage: '',
  defaultView: 'Table',
  request: {
    current_page: 1,
    data: [],
    pagination_data: {
      total_records: 0,
      number_of_pages: 0,
    },
  },
  expense: {
    data: [],
    pagination_data: {
      number_of_pages: 0,
      total_records: 0,
    },
    current_page: 1,
  },
  benefit: {
    data: [],
    pagination_data: {
      number_of_pages: 0,
      total_records: 0,
    },
    current_page: 1,
  },
  expenses_with_request: {
    data: [],
    pagination_data: {
      number_of_pages: 0,
      total_records: 0,
    },
    current_page: 1,
  },
  isSubmittedCountLoading: true,
  submittedCount: {
    expenses: 0,
    requests: 0,
    expenses_with_requests: 0,
    benefits: 0,
  },
  submittedCountForRest: {
    expenses: 0,
    requests: 0,
    expenses_with_requests: 0,
    benefits: 0,
  },
};

export default (state = initialState, action: any) => {
  const { type, payload } = action;
  switch (type) {
    case SUBMITTED_ACTIONS.SET_LOADER:
      return {
        ...state,
        isLoader: payload,
      };
    case SUBMITTED_ACTIONS.SET_SUCCESS:
      return {
        ...state,
        success: payload,
      };
    case SUBMITTED_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: payload,
      };

    case SUBMITTED_ACTIONS.SAVE_BENEFITS:
      return {
        ...state,
        benefit: payload,
      };
    case SUBMITTED_ACTIONS.SAVE_REQUESTS:
      return {
        ...state,
        request: payload,
      };
    case SUBMITTED_ACTIONS.SAVE_EXPENSES:
      return {
        ...state,
        expense: payload,
      };
    case SUBMITTED_ACTIONS.SET_LOADING_MESSAGE:
      return {
        ...state,
        loadingMessage: payload,
      };
    case SUBMITTED_ACTIONS.SAVE_REQUEST_DETAILS_BY_ID:
      return {
        ...state,
        requestDetails: payload,
      };
    case SUBMITTED_ACTIONS.RESET_TO_INITIAL:
      return initialState;
    case SUBMITTED_ACTIONS.SAVE_SUBMITTED_COUNT:
      return {
        ...state,
        submittedCount: {
          ...state.submittedCount,
          ...payload,
        },
      };
    case SUBMITTED_ACTIONS.SAVE_SUBMITTED_COUNT_FOR_RESET:
      return {
        ...state,
        submittedCountForRest: {
          ...state.submittedCountForRest,
          ...payload,
        },
      };
    case SUBMITTED_ACTIONS.SET_SUBMITTED_COUNT_FETCHING:
      return {
        ...state,
        isSubmittedCountLoading: payload,
      };
    case SUBMITTED_ACTIONS.SAVE_EXPENSES_WITH_REQUEST:
      return {
        ...state,
        expenses_with_request: payload,
      };
    case SUBMITTED_ACTIONS.RESET_SPECIFIC_SUBMITTED_COUNT:
      const _key: TSubmittedCountKeys = getKeyNameFromTabName(payload);
      return {
        ...state,
        submittedCount: {
          ...state.submittedCount,
          [_key]: state.submittedCountForRest[_key],
        },
      };
    default:
      return state;
  }
};

export const getLoadingState = (state: ISubmittedState) => state.isLoader;

export const getSuccess = (state: ISubmittedState) => state.success;

export const getError = (state: ISubmittedState) => state.error;

export const getRequests = (state: ISubmittedState) => {
  return state.request;
};

export const getBenefits = (state: ISubmittedState) => state.benefit;

export const getExpenses = (state: ISubmittedState) => state.expense;

export const getLoadingMessage = (state: ISubmittedState) =>
  state.loadingMessage;

export const isDataAvailable = (state: ISubmittedState) =>
  (state?.benefit?.data?.length || 0) +
    (state?.expense?.data?.length || 0) +
    (state?.request?.data?.length || 0) +
    (state?.request?.data?.length || 0) >
  0;

export const getRequestDetails = (state: ISubmittedState) =>
  state.requestDetails;

export const getUserDetails = (state: ISubmittedState) => state.userDetails;

export const getSubmittedCount = (state: ISubmittedState) =>
  state.submittedCount;

export const getSubmittedCountLoader = (state: ISubmittedState) =>
  state.isSubmittedCountLoading;

export const getExpensesWithRequest = (state: ISubmittedState) =>
  state.expenses_with_request;

export const getDefaultView = (state: ISubmittedState) => state.defaultView;
