import * as Models from './approvals.model';
import * as Actions from './approvals.action';
import { stateInterface } from '../../shared/redux/rootReducer';

export const initialState: Models.IApprovals = {
  pendingItemsCount: {
    expenses: 0,
    requests: 0,
    benefits: 0,
    expensesWithRequests: 0,
  },
  expenseApprovalItems: [],
  expensesWithRequestApprovalItems: [],
  requestApprovalItems: [],
  benefitApprovalItems: [],
  paginationData: {
    next_page: null,
    number_of_pages: null,
    previous_page: null,
    total_records: null,
  },
  approvalItemsLoading: true,
  approvalItemsCountLoading: true,
  activeTabKey: '1',
  selectAllCheckboxChecked: false,
  selectedEmployeeIds: [],
  serviceCallFailed: false,
  isLoading: false,
};

const ApprovalsReducer = (
  state: Models.IApprovals = initialState,
  action: { type: string; payload: any },
) => {
  switch (action.type) {
    case Actions.SET_ACTIVE_TAB_KEY:
      return {
        ...state,
        ...action.payload,
      };

    case Actions.SET_APPROVAL_ITEMS_COUNT_LOADING:
      return {
        ...state,
        ...action.payload,
      };

    case Actions.UPDATE_APPROVAL_ITEMS_COUNT:
      return {
        ...state,
        ...action.payload,
      };

    case Actions.SET_APPROVAL_ITEMS_LOADING:
      return {
        ...state,
        ...action.payload,
      };

    case Actions.SET_APPROVAL_ITEMS_DATA_FETCHING_FAILED:
      return {
        ...state,
        ...action.payload,
      };

    case Actions.UPDATE_APPROVAL_ITEMS:
      return {
        ...state,
        ...action.payload,
      };

    case Actions.UPDATE_APPROVAL_PAGINATION_DATA:
      return {
        ...state,
        paginationData: {
          ...state.paginationData,
          ...action.payload,
        },
      };
    case Actions.LOADING_STATUS:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};

export default ApprovalsReducer;

export const getExpenseApprovalItems = (state: stateInterface) =>
  state.approvals.expenseApprovalItems;

export const getExpensesWithRequestApprovalItems = (state: stateInterface) =>
  state.approvals.expensesWithRequestApprovalItems;

export const getRequestApprovalItems = (state: stateInterface) =>
  state.approvals.requestApprovalItems;
