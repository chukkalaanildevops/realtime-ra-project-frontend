import {
  TAdminItemCountKeys,
  TupdateSpecificDataItemsCount,
} from './admin.models';

/* Action Types */
export const SET_ADMIN_LOADER = 'SET_ADMIN_LOADER';
export const SET_ACTIVE_ADMIN_TAB_KEY = 'SET_ACTIVE_ADMIN_TAB_KEY';
export const SET_DATA_ITEMS_COUNT_LOADING = 'SET_DATA_ITEMS_COUNT_LOADING';
export const UPDATE_DATA_ITEMS_COUNT = 'UPDATE_DATA_ITEMS_COUNT';
export const UPDATE_DATA_ITEMS_COUNT_FOR_RESET =
  'UPDATE_DATA_ITEMS_COUNT_FOR_RESET';
export const RESET_SPECIFIC_ITEMS_DATA_COUNT =
  'RESET_SPECIFIC_ITEMS_DATA_COUNT';
export const UPDATE_DATA_GROUP_ITEMS = 'UPDATE_DATA_GROUP_ITEMS';
export const SET_EXPENSES_FOR_REQUEST = 'SET_EXPENSES_FOR_REQUEST';
export const SET_CURRENT_EMPLOYEE = 'SET_CURRENT_EMPLOYEE';
export const SET_BENEFIT_ENTITLEMENT_DATA = 'SET_BENEFIT_ENTITLEMENT_DATA';
export const SET_BENEFIT_ENTITLEMENT_ADJUSTMENT_DATA =
  'SET_BENEFIT_ENTITLEMENT_ADJUSTMENT_DATA';
export const UPDATE_SPECIFIC_DATA_ITEMS_COUNT =
  'UPDATE_SPECIFIC_DATA_ITEMS_COUNT';
export const SET_ERROR = 'SET_ERROR';
export const SET_SUCCESS = 'SET_SUCCESS';
export const SET_LOADING_MESSAGE = 'SET_LOADING_MESSAGE';
export const SET_IS_OTP = 'SET_IS_OTP';

/* Action Creators */

export const setLoader = (isLoading: boolean) => ({
  type: SET_ADMIN_LOADER,
  payload: {
    isLoading: isLoading,
  },
});

export const setActiveTabKey = (key: string) => ({
  type: SET_ACTIVE_ADMIN_TAB_KEY,
  payload: {
    activeTabKey: key,
  },
});

export const setDataItemsCountLoading = (isLoading: boolean) => ({
  type: SET_DATA_ITEMS_COUNT_LOADING,
  payload: {
    dataItemsCountLoading: isLoading,
  },
});

export const updateDataItemsCount = (
  expensesCount: number,
  requestsCount: number,
  expensesWithRequestsCount: number,
  cashAdvanceRequestsCount: number,
  benefitsCount: number,
  expenseSettlementCount: number,
  requestClosuresCount: number,
  benefitSettlements: number,
  benefitEntitlement: number,
  expenseEntitlement: number,
) => ({
  type: UPDATE_DATA_ITEMS_COUNT,
  payload: {
    itemsCount: {
      expenses: expensesCount,
      requests: requestsCount,
      expensesWithRequests: expensesWithRequestsCount,
      cashAdvanceRequests: cashAdvanceRequestsCount,
      benefits: benefitsCount,
      expenseSettlements: expenseSettlementCount,
      requestClosures: requestClosuresCount,
      benefitSettlements: benefitSettlements,
      benefitEntitlement: benefitEntitlement,
      expenseEntitlement: expenseEntitlement,
    },
  },
});
export const updateDataItemsCountForReset = (
  expensesCount: number,
  requestsCount: number,
  expensesWithRequestsCount: number,
  cashAdvanceRequestsCount: number,
  benefitsCount: number,
  expenseSettlementCount: number,
  requestClosuresCount: number,
  benefitSettlements: number,
  benefitEntitlement: number,
  expenseEntitlement: number,
) => ({
  type: UPDATE_DATA_ITEMS_COUNT_FOR_RESET,
  payload: {
    itemsCountForReset: {
      expenses: expensesCount,
      requests: requestsCount,
      expensesWithRequests: expensesWithRequestsCount,
      cashAdvanceRequests: cashAdvanceRequestsCount,
      benefits: benefitsCount,
      expenseSettlements: expenseSettlementCount,
      requestClosures: requestClosuresCount,
      benefitSettlements: benefitSettlements,
      benefitEntitlement: benefitEntitlement,
      expenseEntitlement: expenseEntitlement,
    },
  },
});
export const resetSpecificDataItemsCount = () => ({
  type: RESET_SPECIFIC_ITEMS_DATA_COUNT,
});

export const updateSpecifcDataItemsCount: TupdateSpecificDataItemsCount = (
  type,
  count,
) => ({
  type: UPDATE_SPECIFIC_DATA_ITEMS_COUNT,
  payload: {
    [type]: count,
  },
});

export const updateDataGroupItems = (
  dataGroupItems: [],
  dataGroupItemsPaginationData: {},
) => ({
  type: UPDATE_DATA_GROUP_ITEMS,
  payload: {
    isLoading: false,
    dataGroupItems: dataGroupItems,
    dataGroupItemsPaginationData: dataGroupItemsPaginationData,
  },
});

export const getKeyNameFromTabName = (tabName: string): TAdminItemCountKeys => {
  switch (tabName) {
    case 'expenses':
      return 'expenses';
    case 'expenses-with-requests':
      return 'expensesWithRequests';
    case 'requests':
      return 'requests';
    case 'cash-advance-requests':
      return 'cashAdvanceRequests';
    case 'benefits':
      return 'benefits';
    default:
      return 'expenses';
  }
};

export const setExpensesForRequest = (
  request: { [key: string]: any },
  expensesForRequest: { [key: string]: any }[],
) => ({
  type: SET_EXPENSES_FOR_REQUEST,
  payload: {
    request: request,
    expensesForRequest: expensesForRequest,
  },
});

export const setCurrentEmployee = (employeeData: any) => ({
  type: SET_CURRENT_EMPLOYEE,
  payload: {
    currentEmployee: employeeData,
  },
});

export const setBenefitEntitlementData = (benefitEntitlementData: any) => ({
  type: SET_BENEFIT_ENTITLEMENT_DATA,
  payload: {
    benefitEntitlementData: benefitEntitlementData,
  },
});

export const setBenefitEntitlementAdjustmentData = (benefitEntitlementAdjustmentData: {}) => ({
  type: SET_BENEFIT_ENTITLEMENT_ADJUSTMENT_DATA,
  payload: {
    benefitEntitlementAdjustmentData: benefitEntitlementAdjustmentData,
  },
});

export const setError = (error: any) => ({
  type: SET_ERROR,
  payload: error,
});

export const setSuccess = (message: any) => ({
  type: SET_SUCCESS,
  payload: message,
});

export const setLoadingMessage = (message: any) => ({
  type: SET_LOADING_MESSAGE,
  payload: message,
});

export const setIsOTP = (isOTP: boolean) => ({
  type: SET_IS_OTP,
  payload: isOTP,
});
