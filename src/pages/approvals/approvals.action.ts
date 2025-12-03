import { IApprovalPaginationData } from './approvals.model';

/* Action Types */
export const SET_ACTIVE_TAB_KEY = 'SET_ACTIVE_TAB_KEY';
export const SET_APPROVAL_ITEMS_COUNT_LOADING =
  'SET_APPROVAL_ITEMS_COUNT_LOADING';
export const UPDATE_APPROVAL_ITEMS_COUNT = 'UPDATE_APPROVAL_ITEMS_COUNT';
export const SET_APPROVAL_ITEMS_LOADING = 'SET_APPROVAL_ITEMS_LOADING';
export const SET_APPROVAL_ITEMS_DATA_FETCHING_FAILED =
  'SET_APPROVAL_ITEMS_DATA_FETCHING_FAILED';
export const UPDATE_APPROVAL_ITEMS = 'UPDATE_APPROVAL_ITEMS';
export const UPDATE_APPROVAL_PAGINATION_DATA =
  'UPDATE_APPROVAL_PAGINATION_DATA';
export const LOADING_STATUS = 'LOADING_STATUS';
/* Action Creators */

export const setActiveTabKey = (key: string) => ({
  type: SET_ACTIVE_TAB_KEY,
  payload: {
    activeTabKey: key,
  },
});
export const setLoadingStatus = (isLoading: boolean) => ({
  type: LOADING_STATUS,
  payload: { isLoading },
});

export const setApprovalItemsCountLoading = (isLoading: boolean) => ({
  type: SET_APPROVAL_ITEMS_COUNT_LOADING,
  payload: {
    approvalItemsCountLoading: isLoading,
  },
});

export const updateApprovalItemsCount = (
  pendingExpenseApprovals: number,
  pendingRequestApprovals: number,
  pendingExpensesWithRequestApprovals: number,
  pendingBenefitApprovals: number,
) => ({
  type: UPDATE_APPROVAL_ITEMS_COUNT,
  payload: {
    pendingItemsCount: {
      expenses: pendingExpenseApprovals,
      requests: pendingRequestApprovals,
      benefits: pendingBenefitApprovals,
      expensesWithRequests: pendingExpensesWithRequestApprovals,
    },
    approvalItemsCountLoading: false,
  },
});

export const setApprovalItemsLoading = (isLoading: boolean) => ({
  type: SET_APPROVAL_ITEMS_LOADING,
  payload: {
    approvalItemsLoading: isLoading,
  },
});

export const setApprovalItemsDataFetchingFailed = (hasFailed: boolean) => ({
  type: SET_APPROVAL_ITEMS_DATA_FETCHING_FAILED,
  payload: {
    serviceCallFailed: hasFailed,
    approvalItemsLoading: false,
    expenseApprovalItems: [],
    requestApprovalItems: [],
    expensesWithRequestApprovalItems: [],
    benefitApprovalItems: [],
  },
});

export const updateApprovalItems = (
  expenseApprovalItems: [],
  expensesWithRequestApprovalItems: [],
  requestApprovalItems: [],
  benefitApprovalItems: [],
) => ({
  type: UPDATE_APPROVAL_ITEMS,
  payload: {
    expenseApprovalItems: expenseApprovalItems,
    expensesWithRequestApprovalItems: expensesWithRequestApprovalItems,
    requestApprovalItems: requestApprovalItems,
    benefitApprovalItems: benefitApprovalItems,
    approvalItemsLoading: false,
    serviceCallFailed: false,
  },
});

export const updatePaginationData = (data: IApprovalPaginationData) => ({
  type: UPDATE_APPROVAL_PAGINATION_DATA,
  payload: data,
});
