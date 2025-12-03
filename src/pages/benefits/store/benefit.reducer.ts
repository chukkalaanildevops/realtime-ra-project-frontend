import moment from 'moment';
import { BENEFIT_ACTIONS } from './benefit.action';

export const initialState: any = {
  userInfo: {},
  userJobInfo: {},
  benefitEntitledConfig: {},
  benefitEntitledList: [],
  benefitDependentInfo: [],
  benefitDependentInfoLoader: false,
  benefitEntitledListLoader: false,
  dashboardListLoader: false,
  layoutDataList: [],
  chargeTo: [],
  costCenterList: [],
  layoutDataListLoader: false,
  selectedBenefitType: null,
  selectedBenefitTypeLoader: false,
  backendError: {},
  backendWarning: {},
  fetchedBenefitClaimData: {},
  defaultConversionRate: null,
  fetchedBenefitClaimDataLoader: false,
  isDisableButton: false,
  defaultTax: null,
  taxPercentage: 0,
  receiptDateOnChange: false,
  receiptGalleryDateOnChange: false,
  formData: {
    benefit_type_legal_entity: null,
    benefit_entitlement: null,
    date: moment(),
    currency: null,
    amount: 0,
    conversion_rate: 1,
    converted_amount: 0,
    tax_amount: 0,
    amount_before_taxes: 0,
    purpose: '',
    receipt: [],
    library_receipt: null,
    is_no_receipt: false,
    receipt_uploaded: false,
    receipt_number: '',
    no_receipt_remark: '',
    cost_centre_uuid: '',
    charge_to: 'LOCAL',
    third_party_vendor: '',
    custom_fields: [],
    supporting_documents: [],
    benefit_category: null,
    wage_type: null,
    payable_amount: 0,
  },
};
const BenefitReducer: any = (
  state = initialState,
  actions: { type: any; payload: any },
) => {
  const { type, payload } = actions;

  switch (type) {
    // LOADERS //

    // Data Stores //
    case BENEFIT_ACTIONS.SAVE_LOGIN_USER_INFO:
      return {
        ...state,
        userInfo: payload,
      };
    case BENEFIT_ACTIONS.SAVE_USER_JOB_INFO:
      return {
        ...state,
        userJobInfo: payload,
      };
    case BENEFIT_ACTIONS.RESET_TO_INITIAL:
      return initialState;

    case BENEFIT_ACTIONS.RESET_FIELDS_ON_TYPE_CHANGE:
      return {
        ...state,
        formData: initialState.formData,
        backendError: {},
        backendWarning: {},
      };
    case BENEFIT_ACTIONS.RECEIPT_DATE_FIELD_ON_CHANGE:
      return {
        ...state,
        receiptDateOnChange: payload,
      };
    case BENEFIT_ACTIONS.RECEIPT_GALLERY_DATE_FIELD_ON_CHANGE:
      return {
        ...state,
        receiptGalleryDateOnChange: payload,
      };
    case BENEFIT_ACTIONS.SAVE_USER_ENTITLED_BENEFIT_LIST_LOADER:
      return {
        ...state,
        benefitEntitledListLoader: payload,
      };
    case BENEFIT_ACTIONS.SAVE_USER_ENTITLED_BENEFIT_LIST:
      return {
        ...state,
        benefitEntitledList: payload,
      };
    case BENEFIT_ACTIONS.SAVE_USER_ENTITLED_BENEFIT_CONFIG:
      return {
        ...state,
        benefitEntitledConfig: payload,
      };
    case BENEFIT_ACTIONS.SAVE_USER_BENEFIT_COST_CENTER_CHARGE_TO:
      return {
        ...state,
        chargeTo: payload,
      };
    case BENEFIT_ACTIONS.SAVE_USER_BENEFIT_COST_CENTER_LIST:
      return {
        ...state,
        costCenterList: payload,
      };
    case BENEFIT_ACTIONS.SAVE_SELECTED_BENEFIT_TYPE_LOADER:
      return {
        ...state,
        selectedBenefitTypeLoader: payload,
      };
    case BENEFIT_ACTIONS.SAVE_SELECTED_BENEFIT_TYPE:
      return {
        ...state,
        selectedBenefitType: payload,
      };
    case BENEFIT_ACTIONS.SET_TAX_PERCENTAGE:
      return {
        ...state,
        taxPercentage: payload,
      };
    case BENEFIT_ACTIONS.UPDATE_BACKEND_ERROR:
      return {
        ...state,
        backendError: payload,
      };
    case BENEFIT_ACTIONS.UPDATE_BACKEND_WARNING:
      return {
        ...state,
        backendWarning: payload,
      };

    case BENEFIT_ACTIONS.SET_BENEFIT_FORM_DATA:
      return {
        ...state,
        formData: payload,
      };
    case BENEFIT_ACTIONS.FETCHED_BENEFIT_CLAIM_DATA:
      return {
        ...state,
        fetchedBenefitClaimData: payload,
        defaultConversionRate: payload.system_conversion_rate,
      };
    case BENEFIT_ACTIONS.UPDATE_DEFAULT_TAX_AMOUNT:
      return {
        ...state,
        defaultTax: payload,
      };
    case BENEFIT_ACTIONS.UPDATE_DEFAULT_CONVERSION_RATE:
      return {
        ...state,
        defaultConversionRate: payload
          ? Number(Number(payload).toFixed(2))
          : payload,
      };
    case BENEFIT_ACTIONS.FETCHED_BENEFIT_CLAIM_DATA_LOADER:
      return {
        ...state,
        fetchedBenefitClaimDataLoader: payload,
      };
    case BENEFIT_ACTIONS.ADD_UPDATE_BENEFIT_FORM_DATA:
      return {
        ...state,
        formData: {
          ...state.formData,
          ...payload,
        },
      };
    case BENEFIT_ACTIONS.SET_DISABLE_BUTTON:
      return {
        ...state,
        isDisableButton: payload,
      };

    case BENEFIT_ACTIONS.SET_BENEFIT_DEPENDENT_INFO:
      return {
        ...state,
        benefitDependentInfo: payload,
      };
    case BENEFIT_ACTIONS.SET_BENEFIT_DEPENDENT_INFO_STATUS:
      return {
        ...state,
        benefitDependentInfoLoader: payload,
      };
    default:
      return state;
  }
};

export default BenefitReducer;
