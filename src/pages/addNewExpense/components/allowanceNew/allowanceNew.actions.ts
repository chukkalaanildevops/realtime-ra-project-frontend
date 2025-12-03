export const ALLOWANCE_ACTIONS = {
  SAVE_SELECTED_EXPENSE_TYPE_FOR_ALLOWANCE:
    'ALLOWANCE_ACTIONS/SAVE_SELECTED_EXPENSE_TYPE_FOR_ALLOWANCE',
  SAVE_CONFIGURATION_ALLOWANCE:
    'ALLOWANCE_ACTIONS/SAVE_CONFIGURATION_ALLOWANCE',
  UPDATE_BACKEND_ERROR: 'ALLOWANCE_ACTIONS/UPDATE_BACKEND_ERROR',
  SAVE_USER_ENTITLED_EXPENSE_TYPE_LIST_ALLOWANCE:
    'ALLOWANCE_ACTIONS/SAVE_USER_ENTITLED_EXPENSE_TYPE_LIST_ALLOWANCE',
  UPDATE_EXPENSE_TYPE_LIST_LOADER_ALLOWANCE:
    'ALLOWANCE_ACTIONS/UPDATE_EXPENSE_TYPE_LIST_LOADER_ALLOWANCE',
  UPDATE_EXPENSE_CLAIM_FETCHED_DATA_ALLOWANCE:
    'ALLOWANCE_ACTIONS/UPDATE_EXPENSE_CLAIM_FETCHED_DATA_ALLOWANCE',
  RESET_TO_ALLOWANCE_INITIAL: 'ALLOWANCE_ACTIONS/RESET_TO_ALLOWANCE_INITIAL',
  RESET_FORM_DATA: 'ALLOWANCE_ACTIONS/RESET_FORM_DATA',
  ADD_UPDATE_FORM_DATA: 'ALLOWANCE_ACTIONS/ADD_UPDATE_FORM_DATA',
  ADD_UPDATE_ALLOWANCE_TRIP_FORM_DATA:
    'ALLOWANCE_ACTIONS/ADD_UPDATE_ALLOWANCE_TRIP_FORM_DATA',
  UPDATE_RECEIPT_MANDETORY_STATUS_ALLOWANCE:
    'ALLOWANCE_ACTIONS/UPDATE_RECEIPT_MANDETORY_STATUS_ALLOWANCE',
  TRIP_FORM_ON_CHANGE_STATUS: 'ALLOWANCE_ACTIONS/TRIP_FORM_ON_CHANGE_STATUS',
  SAVE_ALLOWANCE_LOCATIONS: 'ALLOWANCE_ACTIONS/SAVE_ALLOWANCE_LOCATIONS',
  SET_ALLOWANCE_RATES: 'ALLOWANCE_ACTIONS/SET_ALLOWANCE_RATES',
  SET_FETCHED_ALLOWANCE_CONVERSION_RATE:
    'ALLOWANCE_ACTIONS/SET_FETCHED_ALLOWANCE_CONVERSION_RATE',
  SAVE_EXPENSE_ENTITLEMENT_FOR_ALLOWANCE:
    'ALLOWANCE_ACTIONS/SAVE_EXPENSE_ENTITLEMENT_FOR_ALLOWANCE',
  SET_DATE_DIFFERENCE: 'ALLOWANCE_ACTIONS/SET_DATE_DIFFERENCE',
  SET_ALLOWANCE_TRIP_DETAILS_LOADER:
    'ALLOWANCE_ACTIONS/SET_ALLOWANCE_TRIP_DETAILS_LOADER',
  UPDATE_COST_CENTRE_CHARGE_TO_FOR_ALLOWANCE:
    'ALLOWANCE_ACTIONS/UPDATE_COST_CENTRE_CHARGE_TO_FOR_ALLOWANCE',
  SET_COST_CENTRE_LIST_FOR_ALLOWANCE:
    'ALLOWANCE_ACTIONS/SET_COST_CENTRE_LIST_FOR_ALLOWANCE',
  SET_COST_CENTRE_LIST_LOADER_FOR_ALLOWANCE:
    'ALLOWANCE_ACTIONS/SET_COST_CENTRE_LIST_LOADER_FOR_ALLOWANCE',
  SET_DEFAULT_APPROVED_AMOUNT: 'ALLOWANCE_ACTIONS/SET_DEFAULT_APPROVED_AMOUNT',
  SET_EDIT_BUTTON_CLICKED_STATUS_FOR_ALLOWANCE:
    'ALLOWANCE_ACTIONS/SET_EDIT_BUTTON_CLICKED_STATUS_FOR_ALLOWANCE',
  SET_UUID_FOR_ALLOWANCE: 'ALLOWANCE_ACTIONS/SET_UUID_FOR_ALLOWANCE',
  SET_DATA_FOR_EDIT_CLONE_TRIP_FORM:
    'ALLOWANCE_ACTIONS/SET_DATA_FOR_EDIT_CLONE_TRIP_FORM',
  SET_CREATE_UPDATE_RECORD_RESPONSE_DATA:
    'ALLOWANCE_ACTIONS/SET_CREATE_UPDATE_RECORD_RESPONSE_DATA',
  SET_SAVE_AND_ADD_ANOTHER_BTN_STATUS:
    'ALLOWANCE_ACTIONS/SET_SAVE_AND_ADD_ANOTHER_BTN_STATUS',
  SET_TOTAL_AMOUNT_COUNT: 'ALLOWANCE_ACTIONS/SET_TOTAL_AMOUNT_COUNT',
  UPDATE_LOADING_STATUS: 'ALLOWANCE_ACTIONS/UPDATE_LOADING_STATUS',
  SET_ALLOWANCE_RECORDS_ID: 'ALLOWANCE_ACTIONS/SET_ALLOWANCE_RECORDS_ID',
  SET_ALLOWANCE_RECORDS_DELETE_ID:
    'ALLOWANCE_ACTIONS/SET_ALLOWANCE_RECORDS_DELETE_ID',
  SET_IS_CREATED_NEW_ALLOWANCE_RECORD:
    'ALLOWANCE_ACTIONS/SET_IS_CREATED_NEW_ALLOWANCE_RECORD',
};

export const setSelectedExpenseTypeForAllowance: any = (data: any) => ({
  type: ALLOWANCE_ACTIONS.SAVE_SELECTED_EXPENSE_TYPE_FOR_ALLOWANCE,
  payload: data,
});

export const saveConfigurationForAllowance: any = (data: any) => ({
  type: ALLOWANCE_ACTIONS.SAVE_CONFIGURATION_ALLOWANCE,
  payload: data,
});

export const updateBackendError: any = (data: any) => ({
  type: ALLOWANCE_ACTIONS.UPDATE_BACKEND_ERROR,
  payload: data,
});

export const saveExpenseTypeListAllowance: any = (data: any) => ({
  type: ALLOWANCE_ACTIONS.SAVE_USER_ENTITLED_EXPENSE_TYPE_LIST_ALLOWANCE,
  payload: data,
});

export const updateExpenseTypeListLoaderAllowance: any = (data: any) => ({
  type: ALLOWANCE_ACTIONS.UPDATE_EXPENSE_TYPE_LIST_LOADER_ALLOWANCE,
  payload: data,
});

export const updateExpenseClaimFetchedDataAllowance: any = (data: any) => ({
  type: ALLOWANCE_ACTIONS.UPDATE_EXPENSE_CLAIM_FETCHED_DATA_ALLOWANCE,
  payload: data,
});

export const resetToAllowanceInitial: any = () => ({
  type: ALLOWANCE_ACTIONS.RESET_TO_ALLOWANCE_INITIAL,
});
export const resetAllowanceFormData: any = () => ({
  type: ALLOWANCE_ACTIONS.RESET_FORM_DATA,
});

export const addUpdateFormData: any = (key: string, value: any) => {
  let data: { [key: string]: any } = { [key]: value };
  return {
    type: ALLOWANCE_ACTIONS.ADD_UPDATE_FORM_DATA,
    payload: data,
  };
};

export const addUpdateAllowanceTripFormData: any = (
  key: string,
  value: any,
) => {
  let data: { [key: string]: any } = { [key]: value };
  return {
    type: ALLOWANCE_ACTIONS.ADD_UPDATE_ALLOWANCE_TRIP_FORM_DATA,
    payload: data,
  };
};

export const updateReceiptMandetoryStatusAllowance = (data: boolean) => ({
  type: ALLOWANCE_ACTIONS.UPDATE_RECEIPT_MANDETORY_STATUS_ALLOWANCE,
  payload: data,
});

export const allowanceTripFormOnChangeStatus: any = (
  key: string,
  value: any,
) => {
  let data: { [key: string]: any } = { [key]: value };
  return {
    type: ALLOWANCE_ACTIONS.TRIP_FORM_ON_CHANGE_STATUS,
    payload: data,
  };
};

export const saveAllowanceLocations: any = (data: any) => ({
  type: ALLOWANCE_ACTIONS.SAVE_ALLOWANCE_LOCATIONS,
  payload: data,
});

export const setAllowanceRates: any = (data: any) => ({
  type: ALLOWANCE_ACTIONS.SET_ALLOWANCE_RATES,
  payload: data,
});

export const setFetchedAllowanceConversionRate: any = (rate: any) => {
  return {
    type: ALLOWANCE_ACTIONS.SET_FETCHED_ALLOWANCE_CONVERSION_RATE,
    payload: rate,
  };
};

export const saveExpenseEntitlementForAllowance: any = (
  entitlementID: any,
) => ({
  type: ALLOWANCE_ACTIONS.SAVE_EXPENSE_ENTITLEMENT_FOR_ALLOWANCE,
  payload: entitlementID,
});

export const setDateDifference: any = (data: any) => ({
  type: ALLOWANCE_ACTIONS.SET_DATE_DIFFERENCE,
  payload: data,
});

export const setAllowanceTripDetailsLoader: any = (loader: any) => {
  return {
    type: ALLOWANCE_ACTIONS.SET_ALLOWANCE_TRIP_DETAILS_LOADER,
    payload: loader,
  };
};

export const saveCostCentreChargeToForAllowance: any = (data: any) => ({
  type: ALLOWANCE_ACTIONS.UPDATE_COST_CENTRE_CHARGE_TO_FOR_ALLOWANCE,
  payload: data,
});

export const setCostCentreListForAllowance: any = (list: any) => ({
  type: ALLOWANCE_ACTIONS.SET_COST_CENTRE_LIST_FOR_ALLOWANCE,
  payload: list,
});

export const setCostCentreListLoaderForAllowance: any = (data: any) => ({
  type: ALLOWANCE_ACTIONS.SET_COST_CENTRE_LIST_LOADER_FOR_ALLOWANCE,
  payload: data,
});

export const setDefaultApprovedAmount: any = (data: any) => ({
  type: ALLOWANCE_ACTIONS.SET_DEFAULT_APPROVED_AMOUNT,
  payload: data,
});

export const setUUIDForAllowance: any = (data: any) => ({
  type: ALLOWANCE_ACTIONS.SET_UUID_FOR_ALLOWANCE,
  payload: data,
});

export const setDataForEditCloneTripForm: any = (data: any) => ({
  type: ALLOWANCE_ACTIONS.SET_DATA_FOR_EDIT_CLONE_TRIP_FORM,
  payload: data,
});

export const setCreateUpdateRecordResponseData: any = (data: any) => ({
  type: ALLOWANCE_ACTIONS.SET_CREATE_UPDATE_RECORD_RESPONSE_DATA,
  payload: data,
});

export const setSaveAndAddAnotherButtonStatus: any = (data: boolean) => ({
  type: ALLOWANCE_ACTIONS.SET_SAVE_AND_ADD_ANOTHER_BTN_STATUS,
  payload: data,
});

export const setTotalAmountCount: any = (data: any) => ({
  type: ALLOWANCE_ACTIONS.SET_TOTAL_AMOUNT_COUNT,
  payload: data,
});

export const apiCalled: any = (status: boolean) => ({
  type: ALLOWANCE_ACTIONS.UPDATE_LOADING_STATUS,
  payload: {
    isLoadingAllowance: status,
  },
});

export const setAllowanceRecordsId: any = (data: any) => ({
  type: ALLOWANCE_ACTIONS.SET_ALLOWANCE_RECORDS_ID,
  payload: data,
});

export const setAllowanceRecordsDeleteId: any = (data: any) => ({
  type: ALLOWANCE_ACTIONS.SET_ALLOWANCE_RECORDS_DELETE_ID,
  payload: data,
});

export const setIsCreatedNewAllowanceRecord: any = (data: any) => ({
  type: ALLOWANCE_ACTIONS.SET_IS_CREATED_NEW_ALLOWANCE_RECORD,
  payload: data,
});
