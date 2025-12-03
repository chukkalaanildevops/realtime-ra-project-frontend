import { IDraftState, TDraftCountKeys } from './draft.model';

import { DRAFTS_ACTIONS, getKeyNameFromDraftTabName } from './drafts.action';

const initialState: IDraftState = {
  isLoader: false,
  isRequestDeleteOrApproved: false,
  defaultView: 'Table',
  request: {
    current_page: 1,
    data: [],
    pagination_data: {
      total_records: 0,
      number_of_pages: 1,
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
  receipt: {
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
  draftCount: {
    benefits: 0,
    expenses: 0,
    receipts: 0,
    requests: 0,
    expenses_with_requests: 0,
  },
  draftCountForReset: {
    benefits: 0,
    expenses: 0,
    receipts: 0,
    requests: 0,
    expenses_with_requests: 0,
  },
  isDraftCountLoading: true,
};

export default (state = initialState, action: any) => {
  const { type, payload } = action;
  switch (type) {
    case DRAFTS_ACTIONS.SET_LOADER:
      return {
        ...state,
        isLoader: payload,
      };
    case DRAFTS_ACTIONS.SET_REQUEST_DELETE_APPROVED_STATE:
      return {
        ...state,
        isRequestDeleteOrApproved: payload,
      };
    case DRAFTS_ACTIONS.SAVE_BENEFITS:
      return {
        ...state,
        benefit: payload,
      };
    case DRAFTS_ACTIONS.SAVE_REQUESTS:
      return {
        ...state,
        request: payload,
      };
    case DRAFTS_ACTIONS.SAVE_RECEIPT:
      return {
        ...state,
        receipt: payload,
      };
    case DRAFTS_ACTIONS.SAVE_EXPENSES:
      return {
        ...state,
        expense: payload,
      };
    case DRAFTS_ACTIONS.RESET_TO_INITIAL:
      return initialState;
    case DRAFTS_ACTIONS.SAVE_DRAFT_COUNT:
      return {
        ...state,
        draftCount: {
          ...state.draftCount,
          ...payload,
        },
      };
    case DRAFTS_ACTIONS.SAVE_DRAFT_COUNT_FOR_RESET:
      return {
        ...state,
        draftCountForReset: {
          ...state.draftCountForReset,
          ...payload,
        },
      };
    case DRAFTS_ACTIONS.RESET_SPECIFIC_SUBMITTED_COUNT:
      const _key: TDraftCountKeys = getKeyNameFromDraftTabName(payload);
      return {
        ...state,
        draftCount: {
          ...state.draftCount,
          [_key]: state.draftCountForReset[_key],
        },
      };
    case DRAFTS_ACTIONS.SET_DRAFT_COUNT_FETCHING:
      return {
        ...state,
        isDraftCountLoading: payload,
      };
    case DRAFTS_ACTIONS.SAVE_EXPENSES_WITH_REQUEST:
      return {
        ...state,
        expenses_with_request: payload,
      };
    default:
      return state;
  }
};

export const getLoadingState = (state: IDraftState) => state.isLoader;
export const getRequeststate = (state: IDraftState) =>
  state.isRequestDeleteOrApproved;

export const getRequests = (state: IDraftState) => {
  return state.request;
};

export const getBenefits = (state: IDraftState) => state.benefit;

export const getExpenses = (state: IDraftState) => state.expense;

export const getReceipts = (state: IDraftState) => state.receipt;

export const isDataAvailable = (state: IDraftState) =>
  (state?.benefit?.data?.length || 0) +
    (state?.expense?.data?.length || 0) +
    (state?.request?.data?.length || 0) +
    (state?.receipt?.data?.length || 0) >
  0;

export const getDraftCount = (state: IDraftState) => state.draftCount;

export const getDraftCountLoader = (state: IDraftState) =>
  state.isDraftCountLoading;

export const getExpensesWithRequest = (state: IDraftState) =>
  state.expenses_with_request;

export const getDefaultView = (state: IDraftState) => state.defaultView;
