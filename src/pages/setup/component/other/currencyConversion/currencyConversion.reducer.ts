import { CURRENCY_CONVERSION_ACTION_TYPES } from './currencyConversion.actions';
import { ICCState, IItem } from './currencyConversion.model';
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
  currencyConversionList: defaultData,
  currencyList: [],
  conversionRate: null,
  error: '',
  success: '',
  conversionHistory: [],
  loader: false,
  CurrencyHistoryLoader: false,
  loadingMessage: '',
  isDataSubmitting: false,
  countryCurrencyList: [],
};

export default (state = initialState, action: any) => {
  const { payload, type } = action;

  switch (type) {
    case CURRENCY_CONVERSION_ACTION_TYPES.SAVE_DATA:
      return {
        ...state,
        success: '',
        error: '',
        currencyConversionList: payload,
      };
    case CURRENCY_CONVERSION_ACTION_TYPES.SAVE_CURRENCIES:
      return {
        ...state,
        currencyList: payload,
      };
    case CURRENCY_CONVERSION_ACTION_TYPES.SET_ERROR:
      return {
        ...state,
        error: payload,
      };
    case CURRENCY_CONVERSION_ACTION_TYPES.SET_SUCCESS:
      return {
        ...state,
        error: '',
        success: payload,
      };
    case CURRENCY_CONVERSION_ACTION_TYPES.SAVE_CONVERSION_HISTORY:
      return {
        ...state,
        conversionHistory: payload,
      };
    case CURRENCY_CONVERSION_ACTION_TYPES.SET_LOADING:
      return {
        ...state,
        loader: payload,
      };
    case CURRENCY_CONVERSION_ACTION_TYPES.RESET_MESSAGES:
      return {
        ...state,
        success: '',
        error: '',
        loadingMessage: '',
      };
    case CURRENCY_CONVERSION_ACTION_TYPES.SET_LOADING_MESSAGE:
      return {
        ...state,
        loadingMessage: payload,
      };
    case CURRENCY_CONVERSION_ACTION_TYPES.SET_CONVERSION_RATE:
      return {
        ...state,
        conversionRate: payload,
      };
    case CURRENCY_CONVERSION_ACTION_TYPES.SET_DATA_SUBMITTING:
      return {
        ...state,
        isDataSubmitting: payload,
      };
    case CURRENCY_CONVERSION_ACTION_TYPES.SAVE_COUNTRY_CURRENCIES:
      return {
        ...state,
        countryCurrencyList: payload,
      };
    case CURRENCY_CONVERSION_ACTION_TYPES.SET_CH_LOADING:
      return {
        ...state,
        CurrencyHistoryLoader: payload,
      };
    default:
      return state;
  }
};

export const getCurrencyConversionList = (state: ICCState) =>
  state.loader
    ? { ...defaultData, data: new Array(12).fill(item) }
    : state.currencyConversionList;

export const getCurrencyList = (state: ICCState) => state.currencyList;

export const getCCError = (state: ICCState) => state.error;

export const getCCSuccessMessage = (state: ICCState) => state.success;

export const getConversionHistory = (state: ICCState) =>
  state.conversionHistory;
export const getCurrencyLoader = (state: ICCState) => state.loader;

export const getLoadingMessage = (state: ICCState) => state.loadingMessage;

export const getConversionRate = (state: ICCState) => state.conversionRate;

export const getCurrencyDataSubmitting = (state: ICCState) =>
  state.isDataSubmitting;
export const getCountryCurrencyList = (state: ICCState) =>
  state.countryCurrencyList;
