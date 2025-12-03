import { ALLOWANCE_RATE_ACTION_TYPES } from './allowanceRate.actions';
import { ICCState, IItem } from './allowanceRate.model';
import { IPaginationData } from '../../../../../shared/model';

const defaultData: IPaginationData<IItem> = {
  current_page: 0,
  data: [],
  pagination_data: {
    number_of_pages: 0,
    total_records: 0,
  },
};
const item = {} as IItem;
export const initialState: ICCState = {
  allowanceList: defaultData,
  companyList: [],
  destinationList: [],
  titleList: [],
  eligibilityList: [],
  currencyList: [],
  payComponentList: [],
  glAccountList: [],
  error: '',
  loader: false,
  loadingMessage: '',
  success: '',
  isDataSubmitting: false,
  allowanceHistoryLoader: false,
  allowanceHistory: {},
};

export default (state = initialState, action: any) => {
  const { payload, type } = action;

  switch (type) {
    case ALLOWANCE_RATE_ACTION_TYPES.SAVE_DATA:
      return {
        ...state,
        success: '',
        error: '',
        allowanceList: payload,
      };
    case ALLOWANCE_RATE_ACTION_TYPES.SET_ERROR:
      return {
        ...state,
        error: payload,
      };
    case ALLOWANCE_RATE_ACTION_TYPES.SET_LOADING:
      return {
        ...state,
        loader: payload,
      };
    case ALLOWANCE_RATE_ACTION_TYPES.SET_LOADING_MESSAGE:
      return {
        ...state,
        loadingMessage: payload,
      };
    case ALLOWANCE_RATE_ACTION_TYPES.SET_SUCCESS:
      return {
        ...state,
        error: '',
        success: payload,
      };
    case ALLOWANCE_RATE_ACTION_TYPES.SET_DATA_SUBMITTING:
      return {
        ...state,
        isDataSubmitting: payload,
      };
    case ALLOWANCE_RATE_ACTION_TYPES.SET_ALLOWANCEHISTORY_LOADING:
      return {
        ...state,
        AllowanceHistoryLoader: payload,
      };
    case ALLOWANCE_RATE_ACTION_TYPES.SAVE_ALLOWANCE_HISTORY:
      return {
        ...state,
        allowanceHistory: payload,
      };
    case ALLOWANCE_RATE_ACTION_TYPES.SAVE_CURRENCIES:
      return {
        ...state,
        currencyList: payload,
      };
    case ALLOWANCE_RATE_ACTION_TYPES.SAVE_COMPANIES:
      return {
        ...state,
        companyList: payload,
      };
    case ALLOWANCE_RATE_ACTION_TYPES.SAVE_ELIGIBILITIES:
      return {
        ...state,
        eligibilityList: payload,
      };
    case ALLOWANCE_RATE_ACTION_TYPES.SAVE_DESTINATIONS:
      return {
        ...state,
        destinationList: payload,
      };
    case ALLOWANCE_RATE_ACTION_TYPES.SAVE_TITLES:
      return {
        ...state,
        titleList: payload,
      };
    case ALLOWANCE_RATE_ACTION_TYPES.SAVE_GLACCOUNTS:
      return {
        ...state,
        glAccountList: payload,
      };
    case ALLOWANCE_RATE_ACTION_TYPES.SAVE_PAYCOMPONENTS:
      return {
        ...state,
        payComponentList: payload,
      };
    default:
      return state;
  }
};

export const getAllowanceList = (state: ICCState) =>
  state.loader
    ? { ...defaultData, data: new Array(12).fill(item) }
    : state.allowanceList;

export const getAllowanceError = (state: ICCState) => state.error;

export const getAllowanceLoader = (state: ICCState) => state.loader;

export const getLoadingMessage = (state: ICCState) => state.loadingMessage;

export const getAllowanceSuccessMessage = (state: ICCState) => state.success;

export const getCompanyList = (state: ICCState) => state.companyList;

export const getDestinationList = (state: ICCState) => state.destinationList;

export const getTitleList = (state: ICCState) => state.titleList;

export const getEligibilityList = (state: ICCState) => state.eligibilityList;

export const getPayComponentList = (state: ICCState) => state.payComponentList;

export const getGlAccountList = (state: ICCState) => state.glAccountList;

export const getAllowanceDataSubmitting = (state: ICCState) =>
  state.isDataSubmitting;

export const getAllowanceHistoryLoader = (state: ICCState) =>
  state.allowanceHistoryLoader;

export const getAllowanceHistory = (state: ICCState) => state.allowanceHistory;

export const getAllowanceCurrencyList = (state: ICCState) => state.currencyList;
