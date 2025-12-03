import { IconversionRate } from './currencyConversion.model';

export const CURRENCY_CONVERSION_ACTION_TYPES = {
  GET_DATA: 'CURRENCY_CONVERSION_ACTION_TYPES/GET_DATA',
  SAVE_DATA: 'CURRENCY_CONVERSION_ACTION_TYPES/SAVE_DATA',
  SAVE_CURRENCIES: 'CURRENCY_CONVERSION_ACTION_TYPES/SAVE_CURRENCIES',
  SAVE_COUNTRY_CURRENCIES:
    'CURRENCY_CONVERSION_ACTION_TYPES/SAVE_COUNTRY_CURRENCIES',
  SET_ERROR: 'CURRENCY_CONVERSION_ACTION_TYPES/SET_ERROR',
  SET_LOADING: 'CURRENCY_CONVERSION_ACTION_TYPES/SET_LOADING',
  SET_CH_LOADING: 'CURRENCY_CONVERSION_ACTION_TYPES/SET_CH_LOADING',
  SET_DATA_SUBMITTING: 'CURRENCY_CONVERSION_ACTION_TYPES/SET_DATA_SUBMITTING',
  SET_SUCCESS: 'CURRENCY_CONVERSION_ACTION_TYPES/SET_SUCCESS',
  SAVE_CONVERSION_HISTORY:
    'CURRENCY_CONVERSION_ACTION_TYPES/SAVE_CONVERSION_HISTORY',
  RESET_MESSAGES: 'CURRENCY_CONVERSION_ACTION_TYPES/RESET_MESSAGES',
  SET_LOADING_MESSAGE: 'CURRENCY_CONVERSION_ACTION_TYPES/LOADING_MESSAGE',
  SET_CONVERSION_RATE: 'CURRENCY_CONVERSION_ACTION_TYPES/CONVERSION_RATE',
};

export const saveData = (data: any[]) => ({
  type: CURRENCY_CONVERSION_ACTION_TYPES.SAVE_DATA,
  payload: data,
});

export const saveCurrencies = (data: any[]) => ({
  type: CURRENCY_CONVERSION_ACTION_TYPES.SAVE_CURRENCIES,
  payload: data,
});

export const saveCountryCurrencies = (data: any[]) => ({
  type: CURRENCY_CONVERSION_ACTION_TYPES.SAVE_COUNTRY_CURRENCIES,
  payload: data,
});

export const setError = (error: any) => ({
  type: CURRENCY_CONVERSION_ACTION_TYPES.SET_ERROR,
  payload: error,
});

export const setSuccess = (message: string) => ({
  type: CURRENCY_CONVERSION_ACTION_TYPES.SET_SUCCESS,
  payload: message,
});

export const setLoader = (isLoading: boolean) => ({
  type: CURRENCY_CONVERSION_ACTION_TYPES.SET_LOADING,
  payload: isLoading,
});

export const setCHLoader = (isLoading: boolean) => ({
  type: CURRENCY_CONVERSION_ACTION_TYPES.SET_CH_LOADING,
  payload: isLoading,
});

export const saveConversionHistory = (data: any[]) => ({
  type: CURRENCY_CONVERSION_ACTION_TYPES.SAVE_CONVERSION_HISTORY,
  payload: data,
});

export const resetMessages = () => ({
  type: CURRENCY_CONVERSION_ACTION_TYPES.RESET_MESSAGES,
});

export const setLoadingMessage = (msg: string) => ({
  type: CURRENCY_CONVERSION_ACTION_TYPES.SET_LOADING_MESSAGE,
  payload: msg,
});

export const setConversionRate = (rate: IconversionRate) => ({
  type: CURRENCY_CONVERSION_ACTION_TYPES.SET_CONVERSION_RATE,
  payload: rate,
});

export const setDataSubmitLoader = (isLoading: boolean) => ({
  type: CURRENCY_CONVERSION_ACTION_TYPES.SET_DATA_SUBMITTING,
  payload: isLoading,
});
