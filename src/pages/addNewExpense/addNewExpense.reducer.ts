import moment from 'moment';
import { ADD_NEW_EXPENSES_ACTIONS } from './addNewExpense.actions';
import {
  IAddNewExpenseFormReducerIntialState,
  TAddNewExpenseFormReducer,
} from './addNewExpense.model';

export const intialState: IAddNewExpenseFormReducerIntialState = {
  viewOnly: false,
  isAdminEdit: false,
  isForRequest: false,
  is_resubmission_case: false,
  requestId: null,
  activeTabKey: null, //'general',
  mode: 'ADD',
  updateId: null,
  userInfo: null,
  userJobInfo: null,
  expenseTypeList: [],
  expenseTypeListLoader: false,
  selectedExpenseType: null,
  chargeTo: [],
  costCenterList: [],
  costCenterListLoader: false,
  expenseClaimFetchedData: null,
  expenseClaimViolationFetchedData: null,
  expenseClaimViolationFetchedDataLoader: false,
  expenseClaimViolationCheckerData: null,
  violationModalData: {},
  staffMembersJobInfoList: [],
  staffMembersJobInfoListLoader: false,
  taxPercentage: 0,
  formData: {
    legal_entity_uuid: null,
    general_form: {
      expense_type_legal_entity: null,
      date: moment(),
      currency: null,
      amount: null,
      conversion_rate: 1,
      converted_amount: 0,
      tax_amount: 0,
      amount_before_taxes: 0,
      purpose: '',
      receipt: [],
      library_receipt: null,
      is_no_receipt: false,
      receipt_number: '',
      no_receipt_remark: '',
      cost_centre_uuid: '',
      charge_to: 'LOCAL',
      third_party_vendor: '',
      custom_fields: [],
      supporting_documents: [],
    },
    entertainment_form: {
      entertainment_staff_members: [],
      entertainment_guest_members: [],
    },
    mileage_form: {
      mileage_records: [],
    },
    petty_cash_form: {},
    allowance_form: {
      allowance_records: [],
    },
  },
  fetchedConversionRate: 1,
  configuration: null,
  initialReceiptStatus: false,
  mileageRate: 0,
  mileageAmount: null,
  defaultTax: null,
  confirmationInfo: {
    visibility: false,
    headerText: undefined,
    bodyText: undefined,
    forWhat: '',
    okText: undefined,
    cancelText: undefined,
    extraInfo: null,
  },
  disableSaveSendBtns: false,
  backendError: {},
  tripDetailsLoader: false,
  tripDetailError: {},
  expenseEntitlement: null,
  error: '',
  info: '',
  success: '', //success message on something saved on server
  isLoading: false, //global loader.
  pettyCashManagerTransactionMeta: null,
  locationList: [],
  allowanceTypes: [],
  receiptDateOnChange: false,
  taxPercentageChange: false,
  getFormDataCalled: false,
  taxPercentageStatus: false,
};

const AddNewExpenseFormReducer: TAddNewExpenseFormReducer = (
  state = intialState,
  { type, payload },
) => {
  switch (type) {
    case ADD_NEW_EXPENSES_ACTIONS.UPDATE_TAB_KEY:
      return {
        ...state,
        activeTabKey: payload,
        selectedExpenseType: intialState.selectedExpenseType,
        formData: intialState.formData,
        configuration: intialState.configuration,
        backendError: intialState.backendError,
        error: intialState.error,
        info: intialState.info,
        success: intialState.success,
      };
    case ADD_NEW_EXPENSES_ACTIONS.API_CALL_REQUEST:
    case ADD_NEW_EXPENSES_ACTIONS.API_CALL_RESET:
    case ADD_NEW_EXPENSES_ACTIONS.API_CALL_SUCCESS:
    case ADD_NEW_EXPENSES_ACTIONS.API_CALL_FAIL:
    case ADD_NEW_EXPENSES_ACTIONS.UPDATE_LOADING_STATUS:
      return {
        ...state,
        ...payload,
      };
    case ADD_NEW_EXPENSES_ACTIONS.SAVE_LOGGEDIN_USER_INFO:
      return {
        ...state,
        userInfo: payload,
      };
    case ADD_NEW_EXPENSES_ACTIONS.SAVE_USER_JOB_INFO:
      return {
        ...state,
        userJobInfo: payload,
      };
    case ADD_NEW_EXPENSES_ACTIONS.UPDATE_EXPENSE_TYPE_LIST_LOADER:
      return {
        ...state,
        expenseTypeListLoader: payload,
      };
    case ADD_NEW_EXPENSES_ACTIONS.SAVE_USER_ENTITLED_EXPENSE_TYPE_LIST:
      return {
        ...state,
        expenseTypeList: payload,
      };
    case ADD_NEW_EXPENSES_ACTIONS.SET_MILEAGE_AMOUNT:
      return {
        ...state,
        mileageAmount: payload,
      };
    case ADD_NEW_EXPENSES_ACTIONS.UPDATE_BACKEND_ERROR:
      return {
        ...state,
        backendError: payload,
      };
    case ADD_NEW_EXPENSES_ACTIONS.UPDATE_COST_CENTRE_CHAGE_TO:
      return {
        ...state,
        chargeTo: payload,
      };
    case ADD_NEW_EXPENSES_ACTIONS.UPDATE_CONFIGURATION:
      return {
        ...state,
        configuration: payload,
        initialReceiptStatus: payload?.is_receipt_mandatory || false,
      };
    case ADD_NEW_EXPENSES_ACTIONS.UPDATE_RECEIPT_MANDETORY_STATUS:
      return {
        ...state,
        configuration: {
          ...state.configuration,
          is_receipt_mandatory: payload,
        },
      };
    case ADD_NEW_EXPENSES_ACTIONS.UPDATE_SELECTED_EXPENSE_TYPE:
      return {
        ...state,
        selectedExpenseType: payload,
      };
    case ADD_NEW_EXPENSES_ACTIONS.UPDATE_FORM_DATA:
      return {
        ...state,
        formData: {
          ...state.formData,
          ...payload,
        },
        getFormDataCalled: true,
      };
    case ADD_NEW_EXPENSES_ACTIONS.RESET_FORM_DATA:
      return {
        ...state,
        formData: intialState.formData,
        selectedExpenseType: intialState.selectedExpenseType,
        mode: 'ADD',
        configuration: intialState.configuration,
        expenseClaimFetchedData: intialState.expenseClaimFetchedData,
        backendError: intialState.backendError,
        error: intialState.error,
        info: intialState.info,
        success: intialState.success,
        isLoading: false,
        mileageRate: intialState.mileageRate,
      };
    case ADD_NEW_EXPENSES_ACTIONS.UPDATE_GENERAL_FORM:
      return {
        ...state,
        formData: {
          ...state.formData,
          general_form: {
            ...state.formData.general_form,
            ...payload,
          },
        },
      };
    case ADD_NEW_EXPENSES_ACTIONS.UPDATE_ENTERTAIMENT_FORM:
      return {
        ...state,
        formData: {
          ...state.formData,
          entertainment_form: {
            ...state.formData.entertainment_form,
            ...payload,
          },
        },
      };
    case ADD_NEW_EXPENSES_ACTIONS.UPDATE_MILEAGE_FORM:
      return {
        ...state,
        formData: {
          ...state.formData,
          mileage_form: {
            ...state.formData.mileage_form,
            ...payload,
          },
        },
      };
    case ADD_NEW_EXPENSES_ACTIONS.UPDATE_PETTY_CASH_FORM:
      return {
        ...state,
        formData: {
          ...state.formData,
          petty_cash_form: {
            ...state.formData.petty_cash_form,
            ...payload,
          },
        },
      };
    case ADD_NEW_EXPENSES_ACTIONS.UPDATE_ALLOWANCE_FORM:
      return {
        ...state,
        formData: {
          ...state.formData,
          allowance_form: {
            ...state.formData.allowance_form,
            ...payload,
          },
        },
      };
    case ADD_NEW_EXPENSES_ACTIONS.RESET_FIELD_ON_EXPENSE_TYPE_CHANGE:
      return {
        ...state,
        formData: {
          ...intialState.formData.general_form,
          expense_type_legal_entity:
            state.formData.general_form.expense_type_legal_entity,
          date: state.formData.general_form.date,
        },
      };
    case ADD_NEW_EXPENSES_ACTIONS.SET_UPDATE_ID:
      return {
        ...state,
        updateId: payload,
      };
    case ADD_NEW_EXPENSES_ACTIONS.SET_FORM_MODE:
      return {
        ...state,
        mode: payload,
      };
    case ADD_NEW_EXPENSES_ACTIONS.UPDATE_EXPENSE_CLAIM_FETCHED_DATA:
      return {
        ...state,
        expenseClaimFetchedData: payload,
        fetchedConversionRate: parseFloat(payload.conversion_rate),
      };
    case ADD_NEW_EXPENSES_ACTIONS.SAVE_EXPENSE_CLAIM_VOILATION_FETCHED_DATA:
      return {
        ...state,
        expenseClaimViolationFetchedData: payload,
      };

    case ADD_NEW_EXPENSES_ACTIONS.SAVE_EXPENSE_CLAIM_VOILATION_CHECKER_DATA:
      return {
        ...state,
        expenseClaimViolationCheckerData: payload,
      };
    case ADD_NEW_EXPENSES_ACTIONS.EXPENSE_CLAIM_VOILATION_FETCHED_DATA_LOADER:
      return {
        ...state,
        expenseClaimViolationFetchedDataLoader: payload,
      };
    case ADD_NEW_EXPENSES_ACTIONS.EXPENSE_CLAIM_VOILATION_MODAL_DATA:
      return {
        ...state,
        violationModalData: payload,
      };
    case ADD_NEW_EXPENSES_ACTIONS.UPDATE_CONFIRMATION_INFO:
      return {
        ...state,
        confirmationInfo: {
          ...intialState.confirmationInfo,
          ...payload,
        },
      };
    case ADD_NEW_EXPENSES_ACTIONS.RESET_CONFIRMATION_INFO:
      return {
        ...state,
        confirmationInfo: intialState.confirmationInfo,
      };
    case ADD_NEW_EXPENSES_ACTIONS.UPDATE_STAFF_MEMBERS_JOB_INFO_LIST_LOADER:
      return {
        ...state,
        staffMembersJobInfoListLoader: payload,
      };
    case ADD_NEW_EXPENSES_ACTIONS.UPDATE_STAFF_MEMBERS_JOB_INFO_LIST:
      return {
        ...state,
        staffMembersJobInfoList: payload,
      };
    case ADD_NEW_EXPENSES_ACTIONS.SET_VIEW_MODE:
      return {
        ...state,
        viewOnly: payload,
      };
    case ADD_NEW_EXPENSES_ACTIONS.SET_REQUEST_DATA:
      return {
        ...state,
        ...payload,
      };
    case ADD_NEW_EXPENSES_ACTIONS.SET_FETCHED_CONVERSION_RATE:
      return {
        ...state,
        fetchedConversionRate: payload,
      };
    case ADD_NEW_EXPENSES_ACTIONS.SET_FETCHED_SYSTEM_CONVERSION_RATE:
      return {
        ...state,
        expenseClaimFetchedData: {
          ...state.expenseClaimFetchedData,
          system_conversion_rate: payload,
        },
      };
    case ADD_NEW_EXPENSES_ACTIONS.UPDATE_TRIP_DETAIL_ERROR:
      return {
        ...state,
        tripDetailError: payload,
      };
    case ADD_NEW_EXPENSES_ACTIONS.RECEIPT_DATE_FIELD_ON_CHANGE:
      return {
        ...state,
        receiptDateOnChange: payload,
      };
    case ADD_NEW_EXPENSES_ACTIONS.SET_TRIP_DETAILS_LOADER:
      return {
        ...state,
        tripDetailsLoader: payload,
      };
    case ADD_NEW_EXPENSES_ACTIONS.SET_COST_CENTER_LIST:
      return {
        ...state,
        costCenterList: payload,
      };
    case ADD_NEW_EXPENSES_ACTIONS.SET_COST_CENTER_LIST_LOADER:
      return {
        ...state,
        costCenterListLoader: payload,
      };
    case ADD_NEW_EXPENSES_ACTIONS.SET_MILEAGE_RATE:
      return {
        ...state,
        mileageRate: payload,
      };
    case ADD_NEW_EXPENSES_ACTIONS.SET_ALLOWANCE_RATE:
      return {
        ...state,
        allowanceTypes: payload,
      };
    case ADD_NEW_EXPENSES_ACTIONS.SET_TAX_PERCENTAGE:
      return {
        ...state,
        taxPercentage: payload,
      };
    case ADD_NEW_EXPENSES_ACTIONS.SET_TAX_PERCENTAGE_STATUS:
      return {
        ...state,
        taxPercentageStatus: payload,
      };
    case ADD_NEW_EXPENSES_ACTIONS.SET_PETTY_CASH_MANAGER_TRANSACTION_META:
      return {
        ...state,
        pettyCashManagerTransactionMeta: payload,
      };
    case ADD_NEW_EXPENSES_ACTIONS.SET_DISABLE_SAVE_SEND_BTNS:
      return {
        ...state,
        disableSaveSendBtns: payload,
      };
    case ADD_NEW_EXPENSES_ACTIONS.SET_IS_ADMIN_EDIT:
      return {
        ...state,
        isAdminEdit: payload,
      };
    case ADD_NEW_EXPENSES_ACTIONS.UPDATE_DEFAULT_TAX_AMOUNT:
      return {
        ...state,
        defaultTax: payload,
      };
    case ADD_NEW_EXPENSES_ACTIONS.UPDATE_IS_RESUBMISSION_CASE:
      return {
        ...state,
        is_resubmission_case: payload,
      };
    case ADD_NEW_EXPENSES_ACTIONS.RESET_TO_INITIAL:
      return intialState;
    case ADD_NEW_EXPENSES_ACTIONS.SAVE_LOCATIONS:
      return {
        ...state,
        locationList: payload,
      };
    case ADD_NEW_EXPENSES_ACTIONS.SAVE_EXPENSE_ENTITLEMENT:
      return {
        ...state,
        expenseEntitlement: payload,
      };
    case ADD_NEW_EXPENSES_ACTIONS.CHANGE_TAX_PERCENTAGE_STATUS:
      return {
        ...state,
        taxPercentageChange: payload,
      };
    case ADD_NEW_EXPENSES_ACTIONS.CHANGE_FORM_DATA_CALLED_STATUS:
      return {
        ...state,
        getFormDataCalled: payload,
      };
    default:
      return state;
  }
};

export const getPettyCashManagerTransactionMeta = (
  state: IAddNewExpenseFormReducerIntialState,
) => state.pettyCashManagerTransactionMeta;

export default AddNewExpenseFormReducer;
