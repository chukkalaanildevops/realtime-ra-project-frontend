import * as Actions from './admin.actions';
import * as Models from './admin.models';

export const initialState: Models.IAdmin = {
  activeTabKey: '',
  dataItemsCountLoading: false,
  itemsCount: {
    expenses: 0,
    expensesWithRequests: 0,
    requests: 0,
    cashAdvanceRequests: 0,
    benefits: 0,
    expenseSettlements: 0,
    benefitSettlements: 0,
    requestClosures: 0,
    benefitEntitlement: 0,
    expenseEntitlement: 0,
  },
  itemsCountForReset: {
    expenses: 0,
    expensesWithRequests: 0,
    requests: 0,
    cashAdvanceRequests: 0,
    benefits: 0,
    expenseSettlements: 0,
    benefitSettlements: 0,
    requestClosures: 0,
    benefitEntitlement: 0,
    expenseEntitlement: 0,
  },
  isLoading: true,
  serviceCallFailed: false,
  dataGroupItems: [],
  dataGroupItemsPaginationData: {},
  currentEmployee: {},
  benefitEntitlementData: {},
  benefitEntitlementAdjustmentData: {},
  isOTP: false,
};

const AdminReducer = (
  state: Models.IAdmin = initialState,
  action: { type: string; payload: any },
) => {
  switch (action.type) {
    case Actions.SET_ADMIN_LOADER:
      return {
        ...state,
        ...action.payload,
      };

    case Actions.SET_ACTIVE_ADMIN_TAB_KEY:
      return {
        ...state,
        ...action.payload,
        ...{
          dataGroupItems: [],
        },
      };

    case Actions.SET_DATA_ITEMS_COUNT_LOADING:
      return {
        ...state,
        ...action.payload,
      };

    case Actions.UPDATE_SPECIFIC_DATA_ITEMS_COUNT:
      return {
        ...state,
        itemsCount: {
          ...state.itemsCount,
          ...action.payload,
        },
      };

    case Actions.UPDATE_DATA_ITEMS_COUNT:
      return {
        ...state,
        ...action.payload,
      };

    case Actions.UPDATE_DATA_ITEMS_COUNT_FOR_RESET:
      return {
        ...state,
        ...action.payload,
      };
    case Actions.RESET_SPECIFIC_ITEMS_DATA_COUNT:
      const _key: Models.TAdminItemCountKeys = Actions.getKeyNameFromTabName(
        state.activeTabKey,
      );
      return {
        ...state,
        itemsCount: {
          ...state.itemsCount,
          [_key]: state.itemsCountForReset[_key],
        },
      };

    case Actions.UPDATE_DATA_GROUP_ITEMS:
      return {
        ...state,
        ...action.payload,
      };

    case Actions.SET_EXPENSES_FOR_REQUEST:
      return {
        ...state,
        ...action.payload,
      };

    case Actions.SET_CURRENT_EMPLOYEE:
      return {
        ...state,
        ...action.payload,
      };

    case Actions.SET_BENEFIT_ENTITLEMENT_DATA:
      return {
        ...state,
        ...action.payload,
      };

    case Actions.SET_BENEFIT_ENTITLEMENT_ADJUSTMENT_DATA:
      return {
        ...state,
        ...action.payload,
      };

    case Actions.SET_IS_OTP:
      return {
        ...state,
        isOTP: action.payload,
      };

    default:
      return state;
  }
};

export default AdminReducer;
