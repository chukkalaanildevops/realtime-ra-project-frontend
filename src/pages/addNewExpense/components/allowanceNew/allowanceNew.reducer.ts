import { ALLOWANCE_ACTIONS } from './allowanceNew.actions';

export const initialState: any = {
  selectedExpenseTypeForAllowance: null,
  allowanceConfiguration: null,
  backendError: {},
  expenseTypeListAllowance: [],
  expenseTypeListLoaderAllowance: false,
  expenseClaimFetchedDataAllowance: null,
  initialReceiptStatus: false,
  locationList: [],
  allowanceTypes: [],
  fetchedConversionRate: 1,
  defaultApprovedAmount: 0,
  expenseEntitlement: null,
  dateDifference: 0,
  allowanceTripDetailsLoader: false,
  chargeToForAllowance: [],
  costCentreListForAllowance: [],
  costCentreListLoaderForAllowance: false,
  uuidForAllowance: null,
  dataForEditCloneTripForm: null,
  createUpdateRecordResponseData: null,
  totalAmountCount: null,
  saveAndAddAnotherBtnStatus: false,
  isLoadingAllowance: false,
  allowanceRecordsId: [],
  allowanceRecordsDeleteId: null,
  isCreatedNewAllowanceRecord: false,
  formDataAllowance: {
    expense_type_legal_entity: null,
    purpose: '',
    cost_centre_uuid: '',
    charge_to: 'LOCAL',
    third_party_vendor: '',
    custom_fields: [],
    legal_entity_uuid: null,
    allowanceTripRecords: [],
  },
  tripFormData: {
    from_date: '',
    to_date: '',
    location: null,
    allowance_rate: null,
    approved_amount: null,
    amount: null,
    receipt: [] || undefined,
    receipt_number: '',
    supporting_documents: [],
    allowance_currency: '',
    conversion_rate: 1,
    converted_amount: null,
    system_conversion_rate: null,
    library_receipt: null,
    no_of_days: 0,
  },
  tripFormOnChangeStatus: {
    amount: false,
    from_date: false,
    to_date: false,
    library_receipt: false,
    no_of_days: false,
  },
};
const AllowanceNewReducer: any = (
  state = initialState,
  actions: { type: any; payload: any },
) => {
  const { type, payload } = actions;

  switch (type) {
    // LOADERS //

    // Data Stores //

    case ALLOWANCE_ACTIONS.SAVE_SELECTED_EXPENSE_TYPE_FOR_ALLOWANCE:
      return {
        ...state,
        selectedExpenseTypeForAllowance: payload,
      };
    case ALLOWANCE_ACTIONS.SAVE_CONFIGURATION_ALLOWANCE:
      return {
        ...state,
        allowanceConfiguration: payload,
        initialReceiptStatus: payload?.is_receipt_mandatory || false,
      };
    case ALLOWANCE_ACTIONS.UPDATE_BACKEND_ERROR:
      return {
        ...state,
        backendError: payload,
      };
    case ALLOWANCE_ACTIONS.UPDATE_EXPENSE_TYPE_LIST_LOADER_ALLOWANCE:
      return {
        ...state,
        expenseTypeListLoaderAllowance: payload,
      };
    case ALLOWANCE_ACTIONS.SAVE_USER_ENTITLED_EXPENSE_TYPE_LIST_ALLOWANCE:
      return {
        ...state,
        expenseTypeListAllowance: payload,
      };
    case ALLOWANCE_ACTIONS.UPDATE_EXPENSE_CLAIM_FETCHED_DATA_ALLOWANCE:
      return {
        ...state,
        expenseClaimFetchedDataAllowance: payload,
        fetchedConversionRate: parseFloat(payload.conversion_rate),
      };
    case ALLOWANCE_ACTIONS.RESET_TO_ALLOWANCE_INITIAL:
      return initialState;
    case ALLOWANCE_ACTIONS.RESET_FORM_DATA:
      return {
        ...state,
        locationList: [],
        formDataAllowance: initialState.formDataAllowance,
        tripFormData: initialState.tripFormData,
        tripFormOnChangeStatus: initialState.tripFormOnChangeStatus,
        backendError: initialState.backendError,
        backendWarning: initialState.backendWarning,
        selectedExpenseTypeForAllowance:
          initialState.selectedExpenseTypeForAllowance,
        allowanceConfiguration: initialState.allowanceConfiguration,
        expenseClaimFetchedDataAllowance:
          initialState.expenseClaimFetchedDataAllowance,
        isLoadingAllowance: false,
        allowanceRecordsId: initialState.allowanceRecordsId,
        allowanceRecordsDeleteId: initialState.allowanceRecordsDeleteId,
      };
    case ALLOWANCE_ACTIONS.ADD_UPDATE_FORM_DATA:
      return {
        ...state,
        formDataAllowance: {
          ...state.formDataAllowance,
          ...payload,
        },
      };
    case ALLOWANCE_ACTIONS.ADD_UPDATE_ALLOWANCE_TRIP_FORM_DATA:
      return {
        ...state,
        tripFormData: {
          ...state.tripFormData,
          ...payload,
        },
      };
    case ALLOWANCE_ACTIONS.UPDATE_RECEIPT_MANDETORY_STATUS_ALLOWANCE:
      return {
        ...state,
        allowanceConfiguration: {
          ...state.allowanceConfiguration,
          is_receipt_mandatory: payload,
        },
      };
    case ALLOWANCE_ACTIONS.TRIP_FORM_ON_CHANGE_STATUS:
      return {
        ...state,
        tripFormOnChangeStatus: {
          ...state.tripFormOnChangeStatus,
          ...payload,
        },
      };
    case ALLOWANCE_ACTIONS.SAVE_ALLOWANCE_LOCATIONS:
      return {
        ...state,
        locationList: payload,
      };
    case ALLOWANCE_ACTIONS.SET_ALLOWANCE_RATES:
      return {
        ...state,
        allowanceTypes: payload,
      };
    case ALLOWANCE_ACTIONS.SET_FETCHED_ALLOWANCE_CONVERSION_RATE:
      return {
        ...state,
        fetchedConversionRate: payload,
      };
    case ALLOWANCE_ACTIONS.SAVE_EXPENSE_ENTITLEMENT_FOR_ALLOWANCE:
      return {
        ...state,
        expenseEntitlement: payload,
      };
    case ALLOWANCE_ACTIONS.SET_DATE_DIFFERENCE:
      return {
        ...state,
        dateDifference: payload,
      };
    case ALLOWANCE_ACTIONS.SET_ALLOWANCE_TRIP_DETAILS_LOADER:
      return {
        ...state,
        allowanceTripDetailsLoader: payload,
      };
    case ALLOWANCE_ACTIONS.UPDATE_COST_CENTRE_CHARGE_TO_FOR_ALLOWANCE:
      return {
        ...state,
        chargeToForAllowance: payload,
      };
    case ALLOWANCE_ACTIONS.SET_COST_CENTRE_LIST_FOR_ALLOWANCE:
      return {
        ...state,
        costCentreListForAllowance: payload,
      };
    case ALLOWANCE_ACTIONS.SET_COST_CENTRE_LIST_LOADER_FOR_ALLOWANCE:
      return {
        ...state,
        costCentreListLoaderForAllowance: payload,
      };
    case ALLOWANCE_ACTIONS.SET_DEFAULT_APPROVED_AMOUNT:
      return {
        ...state,
        defaultApprovedAmount: payload,
      };
    case ALLOWANCE_ACTIONS.SET_UUID_FOR_ALLOWANCE:
      return {
        ...state,
        uuidForAllowance: payload,
      };
    case ALLOWANCE_ACTIONS.SET_DATA_FOR_EDIT_CLONE_TRIP_FORM:
      return {
        ...state,
        dataForEditCloneTripForm: payload,
      };
    case ALLOWANCE_ACTIONS.SET_CREATE_UPDATE_RECORD_RESPONSE_DATA:
      return {
        ...state,
        createUpdateRecordResponseData: payload,
      };
    case ALLOWANCE_ACTIONS.SET_SAVE_AND_ADD_ANOTHER_BTN_STATUS:
      return {
        ...state,
        saveAndAddAnotherBtnStatus: payload,
      };
    case ALLOWANCE_ACTIONS.SET_TOTAL_AMOUNT_COUNT:
      return {
        ...state,
        totalAmountCount: payload,
      };
    case ALLOWANCE_ACTIONS.UPDATE_LOADING_STATUS:
      return {
        ...state,
        ...payload,
      };

    case ALLOWANCE_ACTIONS.SET_ALLOWANCE_RECORDS_ID:
      return {
        ...state,
        allowanceRecordsId: payload,
      };
    case ALLOWANCE_ACTIONS.SET_ALLOWANCE_RECORDS_DELETE_ID:
      return {
        ...state,
        allowanceRecordsDeleteId: payload,
      };
    case ALLOWANCE_ACTIONS.SET_IS_CREATED_NEW_ALLOWANCE_RECORD:
      return {
        ...state,
        isCreatedNewAllowanceRecord: payload,
      };

    default:
      return state;
  }
};

export default AllowanceNewReducer;
