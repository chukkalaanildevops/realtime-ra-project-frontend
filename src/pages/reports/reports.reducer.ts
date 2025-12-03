import { IReportState, dataType } from './reports.model';

import { REPORT_ACTION_TYPES } from './reports.action';

const initState: dataType = {
  current_page: 1,
  data: [],
  pagination_data: {
    total_records: 0,
    number_of_pages: 0,
    next_page: 0,
  },
};

const initialState: IReportState = {
  isLoader: false,
  success: '',
  error: '',
  loadingMessage: '',
  request: initState,
  expense: initState,
  benefit: initState,
  cash_advance_request: initState,
  expenses_with_request: initState,
  benefit_entitlement: initState,
  benefit_entitlement_users: [],
  benefit_entitlement_users_pagination_data: {},
  isReportCountLoading: false,
  reportCount: {
    expenses: 0,
    requests: 0,
    cash_advance_requests: 0,
    expenses_with_requests: 0,
    benefits: 0,
    benefit_entitlements: 0,
  },
  loadingMore: false,
  reportsList: [],
  cashAdvanceFilters: [],
  expenseFilters: [],
  expenseRequestFilters: [],
  requestFilters: [],
  expenseTypes: [],
  benefitTypes: [],
  specializedReportTypes: [],
};

export default (state = initialState, action: any) => {
  const { type, payload } = action;
  switch (type) {
    case REPORT_ACTION_TYPES.SET_LOADER:
      return {
        ...state,
        isLoader: payload,
      };
    case REPORT_ACTION_TYPES.SET_SUCCESS:
      return {
        ...state,
        success: payload,
      };
    case REPORT_ACTION_TYPES.SET_ERROR:
      return {
        ...state,
        error: payload,
      };

    case REPORT_ACTION_TYPES.SAVE_REQUESTS:
      let requests = [];
      if (payload.current_page > 1) {
        requests = [...payload.data];
      } else {
        requests = payload.data;
      }
      return {
        ...state,
        request: {
          ...payload,
          data: requests,
        },
      };
    case REPORT_ACTION_TYPES.SAVE_EXPENSES:
      let expenses = [];
      if (payload.current_page > 1) {
        expenses = [...payload.data];
      } else {
        expenses = payload.data;
      }
      return {
        ...state,
        expense: {
          ...payload,
          data: expenses,
        },
      };
    case REPORT_ACTION_TYPES.SET_LOADING_MESSAGE:
      return {
        ...state,
        loadingMessage: payload,
      };
    case REPORT_ACTION_TYPES.SAVE_BENEFITS:
      let benefits = [];
      if (payload.current_page > 1) {
        benefits = [...payload.data];
      } else {
        benefits = payload.data;
      }
      return {
        ...state,
        benefit: {
          ...payload,
          data: benefits,
        },
      };

    case REPORT_ACTION_TYPES.SAVE_BENEFIT_ENTITLEMENT:
      let benefitEntitlement = [];
      if (payload.current_page > 1) {
        benefitEntitlement = [...payload.data];
      } else {
        benefitEntitlement = payload.data;
      }
      return {
        ...state,
        benefit_entitlement: {
          ...payload,
          data: benefitEntitlement,
        },
      };
    case REPORT_ACTION_TYPES.SAVE_BENEFIT_ENTITLEMENT_USERS:
      return {
        ...state,
        ...payload,
      };
    case REPORT_ACTION_TYPES.SAVE_CASH_ADVANCE_REQUEST:
      let cash_advance_requests = [];
      if (payload.current_page > 1) {
        cash_advance_requests = [...payload.data];
      } else {
        cash_advance_requests = payload.data;
      }
      return {
        ...state,
        cash_advance_request: {
          ...payload,
          data: cash_advance_requests,
        },
      };
    case REPORT_ACTION_TYPES.SAVE_EXPENSES_WITH_REQUEST:
      let expenses_with_requests = [];
      if (payload.current_page > 1) {
        expenses_with_requests = [...payload.data];
      } else {
        expenses_with_requests = payload.data;
      }
      return {
        ...state,
        expenses_with_request: {
          ...payload,
          data: expenses_with_requests,
        },
      };
    case REPORT_ACTION_TYPES.SAVE_REPORT_COUNT:
      return {
        ...state,
        reportCount: {
          ...state.reportCount,
          ...payload,
        },
      };
    case REPORT_ACTION_TYPES.SET_REPORT_COUNT_FETCHING:
      return {
        ...state,
        isReportCountLoading: payload,
      };
    case REPORT_ACTION_TYPES.SET_LOADING_MORE:
      return {
        ...state,
        loadingMore: payload,
      };
    case REPORT_ACTION_TYPES.SAVE_DOWNLOAD_REPORTS_DATA:
      return {
        ...state,
        reportsList: payload,
      };
    case REPORT_ACTION_TYPES.SAVE_REPORT_CASH_REQUEST_FILTERS:
      return {
        ...state,
        cashAdvanceFilters: payload,
      };
    case REPORT_ACTION_TYPES.SAVE_REPORT_EXPENSE_FILTERS:
      return {
        ...state,
        expenseFilters: payload,
      };
    case REPORT_ACTION_TYPES.SAVE_REPORT_REQUEST_FILTERS:
      return {
        ...state,
        requestFilters: payload,
      };
    case REPORT_ACTION_TYPES.SAVE_REPORT_EXPENSE_REQUEST_FILTERS:
      return {
        ...state,
        expenseRequestFilters: payload,
      };
    case REPORT_ACTION_TYPES.SAVE_EXPENSE_TYPES:
      return {
        ...state,
        expenseTypes: payload,
      };
    case REPORT_ACTION_TYPES.SAVE_BENEFIT_TYPES:
      return {
        ...state,
        benefitTypes: payload,
      };
    case REPORT_ACTION_TYPES.SAVE_SPECIALIZED_REPORT_TYPES:
      return {
        ...state,
        specializedReportTypes: payload,
      };
    default:
      return state;
  }
};

export const getLoadingState = (state: IReportState) => state.isLoader;

export const getSuccess = (state: IReportState) => state.success;

export const getError = (state: IReportState) => state.error;

export const getRequestReports = (state: IReportState) => {
  return state.isLoader
    ? {
        data: new Array(10).fill({}),
        current_page: 1,
        pagination_data: {
          number_of_pages: 0,
          total_records: 10,
          next_page: 0,
        },
      }
    : state.request;
};

export const getExpenseReports = (state: IReportState) =>
  state.isLoader
    ? {
        data: new Array(10).fill({}),
        current_page: 1,
        pagination_data: {
          number_of_pages: 0,
          total_records: 10,
          next_page: 0,
        },
      }
    : state.expense;

export const getLoadingMessage = (state: IReportState) => state.loadingMessage;
export const getReportsCount = (state: IReportState) => state.reportCount;
export const getReportCountLoading = (state: IReportState) =>
  state.isReportCountLoading;
export const getBenefitReports = (state: IReportState) => state.benefit;
export const getExpenseWithRequestReports = (state: IReportState) =>
  state.expenses_with_request;
export const getCashAdvanceReports = (state: IReportState) =>
  state.cash_advance_request;
export const moreReportsLoading = (state: IReportState) => state.loadingMore;
export const getDownloadedReportsList = (state: IReportState) =>
  state.reportsList;
export const getExpenseFilters = (state: IReportState) => state.expenseFilters;
export const getRequestFilters = (state: IReportState) => state.requestFilters;
export const getCashAdvanceFilters = (state: IReportState) =>
  state.cashAdvanceFilters;
export const getExpenseWithRequestFilters = (state: IReportState) =>
  state.expenseRequestFilters;
export const getExpenseTypes = (state: IReportState) => state.expenseTypes;
export const getBenefitTypes = (state: IReportState) => state.benefitTypes;
export const getSpecializedReportTypes = (state: IReportState) =>
  state.specializedReportTypes;
