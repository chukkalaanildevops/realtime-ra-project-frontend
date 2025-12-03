import {
  TupdateTabKey,
  TapiCallRequestFn,
  TapiCallSuccessFn,
  TapiCallResetFn,
  TresetToInitialFn,
  TsaveUserJobInfoFn,
  TsaveUserEntitledExpenseTypeListFn,
  TupdateBackendErrorFn,
  TsaveCostCentreChageToFn,
  TsaveConfigurationFn,
  TupdateUpdateSelectedExpenseTypeFn,
  TupdateFormDataFn,
  TresetFieldOnExpenseTypeChangeFn,
  TsetUpdateIdFn,
  TupdateExpenseClaimFetchedDataFn,
  TupdateConfirmationInfoFn,
  TresetConfirmationInfoFn,
  TresetFormDataFn,
  TupdateExpenseTypeListLoaderFn,
  TsaveLoggedInUserInfoFn,
  TupdateStaffMembersJobInfoListLoaderFn,
  TupdateStaffMembersJobInfoListFn,
  TsetViewModeFn,
  TsetFormModeFn,
  TsetRequestDataFn,
  TsetFetchedConversionRateFn,
  TsetCostCenterListLoaderFn,
  TsetCostCenterListFn,
  TsetMileageRateFn,
  TsetAllowanceRateFn,
  TsetDisableSaveSendBtnsFn,
  TsetIsAdminEditFn,
  TupdateDefaultTaxAmountFn,
  TupdateIsResubmissionCaseFn,
  TsetFetchedSystemConversionRateFn,
} from './addNewExpense.model';
import {
  updateExpenseClaimFetchedDataAllowance,
  addUpdateFormData,
  saveExpenseEntitlementForAllowance,
} from './components/allowanceNew/allowanceNew.actions';
import { Dispatch } from 'react';
import moment from 'moment';
import { stateInterface } from '../../shared/redux/rootReducer';

export const ADD_NEW_EXPENSES_ACTIONS = {
  SAVE_LOCATIONS: 'ADD_NEW_EXPENSES_ACTIONS/SAVE_LOCATIONS',
  UPDATE_TAB_KEY: 'EXPENSE_CLAIMS/UPDATE_TAB_KEY',

  RESET_TO_INITIAL: 'EXPENSE_CLAIMS/RESET_TO_INITIAL',

  API_CALL_REQUEST: 'EXPENSE_CLAIMS/API_CALL_REQUEST',
  API_CALL_RESET: 'EXPENSE_CLAIMS/API_CALL_RESET',
  API_CALL_SUCCESS: 'EXPENSE_CLAIMS/API_CALL_SUCCESS',
  API_CALL_FAIL: 'EXPENSE_CLAIMS/API_CALL_FAIL',

  SAVE_LOGGEDIN_USER_INFO: 'EXPENSE_CLAIMS/SAVE_LOGGEDIN_USER_INFO',
  SAVE_USER_JOB_INFO: 'EXPENSE_CLAIMS/SAVE_USER_JOB_INFO',
  SAVE_USER_ENTITLED_EXPENSE_TYPE_LIST:
    'EXPENSE_CLAIMS/SAVE_USER_ENTITLED_EXPENSE_TYPE_LIST',
  UPDATE_BACKEND_ERROR: 'EXPENSE_CLAIMS/UPDATE_BACKEND_ERROR',
  UPDATE_COST_CENTRE_CHAGE_TO: 'EXPENSE_CLAIMS/UPDATE_COST_CENTRE_CHAGE_TO',
  UPDATE_CONFIGURATION: 'EXPENSE_CLAIMS/UPDATE_CONFIGURATION',
  UPDATE_SELECTED_EXPENSE_TYPE: 'EXPENSE_CLAIMS/UPDATE_SELECTED_EXPENSE_TYPE',
  UPDATE_FORM_DATA: 'EXPENSE_CLAIMS/UPDATE_FORM_DATA',
  RESET_FORM_DATA: 'EXPENSE_CLAIMS/RESET_FORM_DATA',
  UPDATE_GENERAL_FORM: 'EXPENSE_CLAIMS/UPDATE_GENERAL_FORM',
  UPDATE_ENTERTAIMENT_FORM: 'EXPENSE_CLAIMS/UPDATE_ENTERTAIMENT_FORM',
  UPDATE_MILEAGE_FORM: 'EXPENSE_CLAIMS/UPDATE_MILEAGE_FORM',
  UPDATE_LOADING_STATUS: 'EXPENSE_CLAIMS/UPDATE_LOADING_STATUS',
  UPDATE_PETTY_CASH_FORM: 'EXPENSE_CLAIMS/UPDATE_PETTY_CASH_FORM',
  UPDATE_ALLOWANCE_FORM: 'EXPENSE_CLAIMS/UPDATE_ALLOWANCE_FORM',
  RESET_FIELD_ON_EXPENSE_TYPE_CHANGE:
    'EXPENSE_CLAIMS/RESET_FIELD_ON_EXPENSE_TYPE_CHANGE',
  SET_UPDATE_ID: 'EXPENSE_CLAIMS/SET_UPDATE_ID',
  SET_FORM_MODE: 'EXPENSE_CLAIMS/SET_FORM_MODE',
  UPDATE_EXPENSE_CLAIM_FETCHED_DATA:
    'EXPENSE_CLAIMS/UPDATE_EXPENSE_CLAIM_FETCHED_DATA',

  SAVE_EXPENSE_CLAIM_VOILATION_FETCHED_DATA:
    'SAVE_EXPENSE_CLAIM_VOILATION_FETCHED_DATA',
  EXPENSE_CLAIM_VOILATION_FETCHED_DATA_LOADER:
    'EXPENSE_CLAIM_VOILATION_FETCHED_DATA_LOADER',
  UPDATE_CONFIRMATION_INFO: 'EXPENSE_CLAIMS/UPDATE_CONFIRMATION_INFO',
  RESET_CONFIRMATION_INFO: 'EXPENSE_CLAIMS/RESET_CONFIRMATION_INFO',
  UPDATE_EXPENSE_TYPE_LIST_LOADER:
    'EXPENSE_CLAIMS/UPDATE_EXPENSE_TYPE_LIST_LOADER',

  UPDATE_STAFF_MEMBERS_JOB_INFO_LIST:
    'EXPENSE_CLAIMS/UPDATE_STAFF_MEMBERS_JOB_INFO_LIST',
  UPDATE_STAFF_MEMBERS_JOB_INFO_LIST_LOADER:
    'EXPENSE_CLAIMS/UPDATE_STAFF_MEMBERS_JOB_INFO_LIST_LOADER',

  SET_VIEW_MODE: 'EXPENSE_CLAIMS/SET_VIEW_MODE',
  SET_REQUEST_DATA: 'EXPENSE_CLAIMS/SET_REQUEST_DATA',
  SET_FETCHED_CONVERSION_RATE: 'EXPENSE_CLAIMS/SET_FETCHED_CONVERSION_RATE',
  SET_FETCHED_SYSTEM_CONVERSION_RATE:
    'EXPENSE_CLAIMS/SET_FETCHED_SYSTEM_CONVERSION_RATE',
  UPDATE_TRIP_DETAIL_ERROR: 'EXPENSE_CLAIMS/UPDATE_TRIP_DETAIL_ERROR',
  RECEIPT_DATE_FIELD_ON_CHANGE: 'EXPENSE_CLAIMS/RECEIPT_DATE_FIELD_ON_CHANGE',
  SET_TRIP_DETAILS_LOADER: 'EXPENSE_CLAIMS/SET_TRIP_DETAILS_LOADER',

  //costCenterList
  SET_COST_CENTER_LIST_LOADER: 'EXPENSE_CLAIMS/SET_COST_CENTER_LIST_LOADER',
  SET_COST_CENTER_LIST: 'EXPENSE_CLAIMS/SET_COST_CENTER_LIST',

  //mileage rate
  SET_MILEAGE_RATE: 'EXPENSE_CLAIMS/SET_MILEAGE_RATE',
  SET_ALLOWANCE_RATE: 'EXPENSE_CLAIMS/SET_ALLOWANCE_RATE',
  SET_TAX_PERCENTAGE: 'EXPENSE_CLAIMS/SET_TAX_PERCENTAGE',
  SET_PETTY_CASH_MANAGER_TRANSACTION_META:
    'EXPENSE_CLAIMS/SET_PETTY_CASH_MANAGER_TRANSACTION_META',
  SET_DISABLE_SAVE_SEND_BTNS: 'EXPENSE_CLAIMS/SET_DISABLE_SAVE_SEND_BTNS',
  SET_IS_ADMIN_EDIT: 'EXPENSE_CLAIMS/SET_IS_ADMIN_EDIT',
  UPDATE_DEFAULT_TAX_AMOUNT: 'EXPENSE_CLAIMS/UPDATE_DEFAULT_TAX_AMOUNT',
  UPDATE_IS_RESUBMISSION_CASE: 'EXPENSE_CLAIMS/UPDATE_IS_RESUBMISSION_CASE',

  UPDATE_RECEIPT_MANDETORY_STATUS:
    'EXPENSE_CLAIMS/UPDATE_RECEIPT_MANDETORY_STATUS',
  SET_MILEAGE_AMOUNT: 'EXPENSE_CLAIMS/SET_MILEAGE_AMOUNT',
  SAVE_EXPENSE_ENTITLEMENT: 'EXPENSE_CLAIMS/SAVE_EXPENSE_ENTITLEMENT',
  CHANGE_TAX_PERCENTAGE_STATUS:
    'ADD_NEW_EXPENSES_ACTIONS/CHANGE_TAX_PERCENTAGE_STATUS',
  CHANGE_FORM_DATA_CALLED_STATUS:
    'ADD_NEW_EXPENSES_ACTIONS/CHANGE_FORM_DATA_CALLED_STATUS',
  SET_TAX_PERCENTAGE_STATUS:
    ' ADD_NEW_EXPENSES_ACTIONS/SET_TAX_PERCENTAGE_STATUS',
  EXPENSE_CLAIM_VOILATION_MODAL_DATA: 'EXPENSE_CLAIM_VOILATION_MODAL_DATA',
  SAVE_EXPENSE_CLAIM_VOILATION_CHECKER_DATA:
    'SAVE_EXPENSE_CLAIM_VOILATION_CHECKER_DATA',
};

export const updateIsResubmissionCase: TupdateIsResubmissionCaseFn = bool => ({
  type: ADD_NEW_EXPENSES_ACTIONS.UPDATE_IS_RESUBMISSION_CASE,
  payload: bool,
});
export const setMileageRate: TsetMileageRateFn = rate => ({
  type: ADD_NEW_EXPENSES_ACTIONS.SET_MILEAGE_RATE,
  payload: rate,
});
export const setMileageAmount = (amount: any) => ({
  type: ADD_NEW_EXPENSES_ACTIONS.SET_MILEAGE_AMOUNT,
  payload: amount,
});
export const setAllowanceRate: TsetAllowanceRateFn = data => ({
  type: ADD_NEW_EXPENSES_ACTIONS.SET_ALLOWANCE_RATE,
  payload: data,
});

export const setTaxPercentage = (data: any) => ({
  type: ADD_NEW_EXPENSES_ACTIONS.SET_TAX_PERCENTAGE,
  payload: data,
});

export const setTaxPercentageStatus = (status: any) => ({
  type: ADD_NEW_EXPENSES_ACTIONS.SET_TAX_PERCENTAGE_STATUS,
  payload: status,
});
export const setCostCenterList: TsetCostCenterListFn = list => ({
  type: ADD_NEW_EXPENSES_ACTIONS.SET_COST_CENTER_LIST,
  payload: list,
});

export const setCostCenterListLoader: TsetCostCenterListLoaderFn = bool => ({
  type: ADD_NEW_EXPENSES_ACTIONS.SET_COST_CENTER_LIST_LOADER,
  payload: bool,
});

export const updateTabKey: TupdateTabKey = key => ({
  type: ADD_NEW_EXPENSES_ACTIONS.UPDATE_TAB_KEY,
  payload: key,
});

export const apiCalled = (status: boolean) => ({
  type: ADD_NEW_EXPENSES_ACTIONS.UPDATE_LOADING_STATUS,
  payload: {
    isLoading: status,
  },
});

export const apiCallRequest: TapiCallRequestFn = info => ({
  type: ADD_NEW_EXPENSES_ACTIONS.API_CALL_REQUEST,
  payload: {
    error: '',
    success: '',
    info: info !== undefined ? info : 'Loading Data...',
  },
});

export const apiCallSuccess: TapiCallSuccessFn = success => ({
  type: ADD_NEW_EXPENSES_ACTIONS.API_CALL_SUCCESS,
  payload: {
    error: '',
    success: success !== undefined ? success : '',
    info: '',
  },
});

export const apiCallFail: TapiCallSuccessFn = err => ({
  type: ADD_NEW_EXPENSES_ACTIONS.API_CALL_FAIL,
  payload: {
    error: err !== undefined ? err : 'Failed to load data.',
    success: '',
    info: '',
  },
});

export const apiCallReset: TapiCallResetFn = () => ({
  type: ADD_NEW_EXPENSES_ACTIONS.API_CALL_RESET,
  payload: {
    error: '',
    success: '',
    info: '',
  },
});

export const resetToInitial: TresetToInitialFn = () => ({
  type: ADD_NEW_EXPENSES_ACTIONS.RESET_TO_INITIAL,
});

export const saveLoggedInUserInfo: TsaveLoggedInUserInfoFn = data => ({
  type: ADD_NEW_EXPENSES_ACTIONS.SAVE_LOGGEDIN_USER_INFO,
  payload: data,
});

export const saveUserJobInfo: TsaveUserJobInfoFn = data => ({
  type: ADD_NEW_EXPENSES_ACTIONS.SAVE_USER_JOB_INFO,
  payload: data,
});

export const saveUserEntitledExpenseTypeList: TsaveUserEntitledExpenseTypeListFn = data => ({
  type: ADD_NEW_EXPENSES_ACTIONS.SAVE_USER_ENTITLED_EXPENSE_TYPE_LIST,
  payload: data,
});

export const updateBackendError: TupdateBackendErrorFn = data => ({
  type: ADD_NEW_EXPENSES_ACTIONS.UPDATE_BACKEND_ERROR,
  payload: data,
});

export const updateTripDetailError = (data: any) => ({
  type: ADD_NEW_EXPENSES_ACTIONS.UPDATE_TRIP_DETAIL_ERROR,
  payload: data,
});

export const receiptDateFieldOnChange = (data: any) => ({
  type: ADD_NEW_EXPENSES_ACTIONS.RECEIPT_DATE_FIELD_ON_CHANGE,
  payload: data,
});

export const saveCostCentreChageTo: TsaveCostCentreChageToFn = data => ({
  type: ADD_NEW_EXPENSES_ACTIONS.UPDATE_COST_CENTRE_CHAGE_TO,
  payload: data,
});

export const saveConfiguration: TsaveConfigurationFn = data => ({
  type: ADD_NEW_EXPENSES_ACTIONS.UPDATE_CONFIGURATION,
  payload: data,
});

export const updateReceiptMandetoryStatus = (data: boolean) => ({
  type: ADD_NEW_EXPENSES_ACTIONS.UPDATE_RECEIPT_MANDETORY_STATUS,
  payload: data,
});

export const updateUpdateSelectedExpenseType: TupdateUpdateSelectedExpenseTypeFn = key => ({
  type: ADD_NEW_EXPENSES_ACTIONS.UPDATE_SELECTED_EXPENSE_TYPE,
  payload: key,
});

export const resetFormData: TresetFormDataFn = () => ({
  type: ADD_NEW_EXPENSES_ACTIONS.RESET_FORM_DATA,
});

export const saveLocations = (data: any[]) => ({
  type: ADD_NEW_EXPENSES_ACTIONS.SAVE_LOCATIONS,
  payload: data,
});
export const saveExpenseEntitlement = (entitlementID: any) => ({
  type: ADD_NEW_EXPENSES_ACTIONS.SAVE_EXPENSE_ENTITLEMENT,
  payload: entitlementID,
});
/**
 * This function works as action creator to update form related data.
 * Can return general form, entertainmen form and form data action creator for single and multiple keys.
 * @param {string | string[]}key
 * @param {'general_form' | 'entertainment_form'} type
 * @param {any} data
 */
export const updateFormData: TupdateFormDataFn = (key, type, data) => {
  let actionType = ADD_NEW_EXPENSES_ACTIONS.UPDATE_FORM_DATA;
  try {
    if (type === 'general_form')
      actionType = ADD_NEW_EXPENSES_ACTIONS.UPDATE_GENERAL_FORM;
    // else if (type === 'mileage') actionType = UPDATE_MILEAGE_FORM;
    else if (type === 'entertainment_form')
      actionType = ADD_NEW_EXPENSES_ACTIONS.UPDATE_ENTERTAIMENT_FORM;
    else if (type === 'mileage_form')
      actionType = ADD_NEW_EXPENSES_ACTIONS.UPDATE_MILEAGE_FORM;
    else if (type === 'petty_cash_form')
      actionType = ADD_NEW_EXPENSES_ACTIONS.UPDATE_PETTY_CASH_FORM;
    else if (type === 'allowance_form')
      actionType = ADD_NEW_EXPENSES_ACTIONS.UPDATE_ALLOWANCE_FORM;
    else
      return {
        type: actionType,
        payload: data,
      };

    let payload: any = {};
    typeof key !== 'string'
      ? key.forEach((o: string, i: number) => {
          payload[o] = data[i];
        })
      : (payload[key] = data);

    return {
      type: actionType,
      payload: payload,
    };
  } catch (error) {
    console.error(error);
    return {
      type: actionType,
      payload: {},
    };
  }
};

export const resetFieldOnExpenseTypeChange: TresetFieldOnExpenseTypeChangeFn = () => ({
  type: ADD_NEW_EXPENSES_ACTIONS.RESET_FIELD_ON_EXPENSE_TYPE_CHANGE,
});

export const setUpdateId: TsetUpdateIdFn = updateId => ({
  type: ADD_NEW_EXPENSES_ACTIONS.SET_UPDATE_ID,
  payload: updateId,
});

export const saveExpenseClaimData = (data: any) => {
  return (dispatch: Dispatch<any>, getState: () => stateInterface) => {
    try {
      const { AddNewExpenseForm } = getState();
      const isViewMode = AddNewExpenseForm.viewOnly;
      const isClone = AddNewExpenseForm.mode === 'CLONE';
      const _formData = {
        general_form: {
          // expense_type_legal_entity: data.expense_type_legal_entity.id,
          expense_type_legal_entity: isViewMode
            ? data.expense_type_legal_entity.expense_type.title
            : data.expense_type_legal_entity.id,
          date: isClone ? '' : moment(data?.date, ['DD/MM/YYYY']),

          currency: isViewMode
            ? data?.currency?.currency?.title
            : data?.currency?.id || data?.converted_amount_currency?.id || null,

          amount: Number(data?.amount) || 0,

          conversion_rate: Number(data?.conversion_rate) || 1,

          converted_amount: Number(data?.converted_amount) || 0,

          tax_amount: Number(data?.tax_amount) || 0,

          amount_before_taxes: Number(data?.amount_before_taxes) || 0,

          purpose: data.purpose || '',

          receipt: isClone
            ? []
            : data?.receipt
            ? data?.receipt[0]?.file
              ? [data?.receipt[0]?.file]
              : []
            : [],

          is_no_receipt: data?.is_no_receipt,

          receipt_number: isClone
            ? ''
            : data?.receipt
            ? data?.receipt[0]?.receipt_number
              ? data?.receipt[0]?.receipt_number
              : ''
            : '',

          no_receipt_remark: data?.no_receipt_remark || '',
          cost_centre_uuid: isViewMode
            ? data?.cost_centre?.title || ''
            : data?.cost_centre?.uuid || '',

          charge_to: data?.charge_to?.code || '',

          third_party_vendor: data?.third_party_vendor || '',

          custom_fields: data?.custom_fields || [],

          supporting_documents: isClone ? [] : data?.supporting_documents || [],
        },

        entertainment_form: {
          entertainment_staff_members: data?.entertainment_staff_members.length
            ? data?.entertainment_staff_members
            : [],

          entertainment_guest_members: data?.entertainment_guest_members.length
            ? data?.entertainment_guest_members
            : [],
        },
        mileage_form: {
          mileage_records: data?.mileage_records ? data?.mileage_records : [],
        },
        allowance_form: {
          allowance_records: data?.allowance_records
            ? data?.allowance_records
            : [],
        },
        petty_cash_form: {
          ...(data?.voucher_number
            ? { voucher_number: data?.voucher_number }
            : {}),
        },
      };

      dispatch(saveExpenseEntitlement(data.expense_entitlement));
      dispatch(saveExpenseEntitlementForAllowance(data.expense_entitlement));
      dispatch(updateExpenseClaimFetchedData(data));
      dispatch(updateExpenseClaimFetchedDataAllowance(data));

      dispatch(updateFormData('', 'form_data', _formData));
      dispatch(
        updateDefaultTaxAmount(
          Number(Number(data?.system_tax_amount).toFixed(2)),
        ),
      );
      dispatch(
        addUpdateFormData(
          'expense_type_legal_entity',
          isViewMode
            ? data.expense_type_legal_entity.expense_type.title
            : data.expense_type_legal_entity.id,
        ),
      );
      dispatch(
        addUpdateFormData(
          'legal_entity_uuid',
          data.expense_type_legal_entity?.legal_entity?.uuid || null,
        ),
      );
      dispatch(addUpdateFormData('purpose', data.purpose || ''));
      dispatch(
        addUpdateFormData(
          'cost_centre_uuid',
          isViewMode
            ? data?.cost_centre?.title || ''
            : data?.cost_centre?.uuid || '',
        ),
      );
      dispatch(addUpdateFormData('charge_to', data?.charge_to?.code || ''));
      dispatch(
        addUpdateFormData('third_party_vendor', data?.third_party_vendor || ''),
      );
      dispatch(addUpdateFormData('custom_fields', data?.custom_fields || []));
      dispatch(
        addUpdateFormData(
          'allowanceTripRecords',
          data?.allowance_records ? data?.allowance_records : [],
        ),
      );
    } catch (error) {
      console.error(error);
    }
  };
};
export const updateExpenseClaimFetchedData: TupdateExpenseClaimFetchedDataFn = data => ({
  type: ADD_NEW_EXPENSES_ACTIONS.UPDATE_EXPENSE_CLAIM_FETCHED_DATA,
  payload: { ...data },
});

export const updateConfirmationInfo: TupdateConfirmationInfoFn = confirmationInfo => {
  return {
    type: ADD_NEW_EXPENSES_ACTIONS.UPDATE_CONFIRMATION_INFO,
    payload: confirmationInfo,
  };
};

export const resetConfirmationInfo: TresetConfirmationInfoFn = () => {
  return {
    type: ADD_NEW_EXPENSES_ACTIONS.RESET_CONFIRMATION_INFO,
  };
};

export const updateExpenseTypeListLoader: TupdateExpenseTypeListLoaderFn = bool => {
  return {
    type: ADD_NEW_EXPENSES_ACTIONS.UPDATE_EXPENSE_TYPE_LIST_LOADER,
    payload: bool,
  };
};

export const updateStaffMembersJobInfoList: TupdateStaffMembersJobInfoListFn = list => {
  return {
    type: ADD_NEW_EXPENSES_ACTIONS.UPDATE_STAFF_MEMBERS_JOB_INFO_LIST,
    payload: list,
  };
};

export const updateStaffMembersJobInfoListLoader: TupdateStaffMembersJobInfoListLoaderFn = bool => {
  return {
    type: ADD_NEW_EXPENSES_ACTIONS.UPDATE_STAFF_MEMBERS_JOB_INFO_LIST_LOADER,
    payload: bool,
  };
};

export const setViewMode: TsetViewModeFn = bool => {
  return {
    type: ADD_NEW_EXPENSES_ACTIONS.SET_VIEW_MODE,
    payload: bool,
  };
};

export const setFormMode: TsetFormModeFn = mode => {
  return {
    type: ADD_NEW_EXPENSES_ACTIONS.SET_FORM_MODE,
    payload: mode,
  };
};

export const setRequestData: TsetRequestDataFn = (bool, id) => {
  return {
    type: ADD_NEW_EXPENSES_ACTIONS.SET_REQUEST_DATA,
    payload: {
      isForRequest: bool,
      requestId: id,
    },
  };
};

export const setFetchedConversionRate: TsetFetchedConversionRateFn = rate => {
  return {
    type: ADD_NEW_EXPENSES_ACTIONS.SET_FETCHED_CONVERSION_RATE,
    payload: rate,
  };
};

export const setSystemFetchedConversionRate: TsetFetchedSystemConversionRateFn = rate => {
  return {
    type: ADD_NEW_EXPENSES_ACTIONS.SET_FETCHED_SYSTEM_CONVERSION_RATE,
    payload: rate,
  };
};

export const setTripDetailsLoader = (loader: boolean) => {
  return {
    type: ADD_NEW_EXPENSES_ACTIONS.SET_TRIP_DETAILS_LOADER,
    payload: loader,
  };
};

export const setPettyCashManagerTransactionMeta = (payload: any) => {
  return {
    type: ADD_NEW_EXPENSES_ACTIONS.SET_PETTY_CASH_MANAGER_TRANSACTION_META,
    payload,
  };
};

export const setDisableSaveSendBtns: TsetDisableSaveSendBtnsFn = _bool => {
  return {
    type: ADD_NEW_EXPENSES_ACTIONS.SET_DISABLE_SAVE_SEND_BTNS,
    payload: _bool,
  };
};

export const setIsAdminEdit: TsetIsAdminEditFn = _bool => {
  return {
    type: ADD_NEW_EXPENSES_ACTIONS.SET_IS_ADMIN_EDIT,
    payload: _bool,
  };
};

export const updateDefaultTaxAmount: TupdateDefaultTaxAmountFn = amt => {
  return {
    type: ADD_NEW_EXPENSES_ACTIONS.UPDATE_DEFAULT_TAX_AMOUNT,
    payload: amt,
  };
};

export const updateTaxPercentageStatus = (status: any) => {
  return {
    type: ADD_NEW_EXPENSES_ACTIONS.CHANGE_TAX_PERCENTAGE_STATUS,
    payload: status,
  };
};

export const updateGetFormDataStatus = (status: any) => {
  return {
    type: ADD_NEW_EXPENSES_ACTIONS.CHANGE_FORM_DATA_CALLED_STATUS,
    payload: status,
  };
};
// For Traffic Light Policy Violation
export const saveExpenseClaimDataViolationData = (data: any) => {
  return {
    type: ADD_NEW_EXPENSES_ACTIONS.SAVE_EXPENSE_CLAIM_VOILATION_FETCHED_DATA,
    payload: data,
  };
};

export const setExpenseClaimDataViolationDataLoader = (loader: boolean) => {
  return {
    type: ADD_NEW_EXPENSES_ACTIONS.EXPENSE_CLAIM_VOILATION_FETCHED_DATA_LOADER,
    payload: loader,
  };
};
export const setIsViolationModalData = (data: any) => {
  return {
    type: ADD_NEW_EXPENSES_ACTIONS.EXPENSE_CLAIM_VOILATION_MODAL_DATA,
    payload: data,
  };
};

export const saveExpenseClaimDataViolationCheckerData = (data: any) => {
  return {
    type: ADD_NEW_EXPENSES_ACTIONS.SAVE_EXPENSE_CLAIM_VOILATION_CHECKER_DATA,
    payload: data,
  };
};
