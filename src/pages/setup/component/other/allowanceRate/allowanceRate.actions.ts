export const ALLOWANCE_RATE_ACTION_TYPES = {
  SAVE_DATA: 'ALLOWANCE_RATE_ACTION_TYPES/SAVE_DATA',
  SET_ERROR: 'ALLOWANCE_RATE_ACTION_TYPES/SET_ERROR',
  SET_LOADING: 'ALLOWANCE_RATE_ACTION_TYPES/SET_LOADING',
  SET_LOADING_MESSAGE: 'ALLOWANCE_RATE_ACTION_TYPES/LOADING_MESSAGE',
  SET_SUCCESS: 'ALLOWANCE_RATE_ACTION_TYPES/SET_SUCCESS',
  SET_DATA_SUBMITTING: 'ALLOWANCE_RATE_ACTION_TYPES/SET_DATA_SUBMITTING',
  SET_ALLOWANCEHISTORY_LOADING:
    'ALLOWANCE_RATE_ACTION_TYPES/SET_ALLOWANCEHISTORY_LOADING',
  SAVE_ALLOWANCE_HISTORY: 'ALLOWANCE_RATE_ACTION_TYPES/SAVE_ALLOWANCE_HISTORY',
  SAVE_CURRENCIES: 'ALLOWANCE_RATE_ACTION_TYPES/SAVE_CURRENCIES',
  SAVE_COMPANIES: 'ALLOWANCE_RATE_ACTION_TYPES/SAVE_COMPANIES',
  SAVE_ELIGIBILITIES: 'ALLOWANCE_RATE_ACTION_TYPES/SAVE_ELIGIBILITIES',
  SAVE_DESTINATIONS: 'ALLOWANCE_RATE_ACTION_TYPES/SAVE_DESTINATIONS',
  SAVE_TITLES: 'ALLOWANCE_RATE_ACTION_TYPES/SAVE_TITLES',
  SAVE_GLACCOUNTS: 'ALLOWANCE_RATE_ACTION_TYPES/SAVE_GLACCOUNTS',
  SAVE_PAYCOMPONENTS: 'ALLOWANCE_RATE_ACTION_TYPES/SAVE_PAYCOMPONENTS',
};

export const saveData = (data: any[]) => ({
  type: ALLOWANCE_RATE_ACTION_TYPES.SAVE_DATA,
  payload: data,
});

export const setError = (error: any) => ({
  type: ALLOWANCE_RATE_ACTION_TYPES.SET_ERROR,
  payload: error,
});

export const setLoader = (isLoading: boolean) => ({
  type: ALLOWANCE_RATE_ACTION_TYPES.SET_LOADING,
  payload: isLoading,
});

export const setLoadingMessage = (msg: string) => ({
  type: ALLOWANCE_RATE_ACTION_TYPES.SET_LOADING_MESSAGE,
  payload: msg,
});

export const setSuccess = (message: string) => ({
  type: ALLOWANCE_RATE_ACTION_TYPES.SET_SUCCESS,
  payload: message,
});

export const setDataSubmitLoader = (isLoading: boolean) => ({
  type: ALLOWANCE_RATE_ACTION_TYPES.SET_DATA_SUBMITTING,
  payload: isLoading,
});

export const setAllowanceHistoryLoader = (isLoading: boolean) => ({
  type: ALLOWANCE_RATE_ACTION_TYPES.SET_ALLOWANCEHISTORY_LOADING,
  payload: isLoading,
});

export const saveAllowanceHistory = (data: any[]) => ({
  type: ALLOWANCE_RATE_ACTION_TYPES.SAVE_ALLOWANCE_HISTORY,
  payload: data,
});

export const saveCurrencies = (data: any[]) => ({
  type: ALLOWANCE_RATE_ACTION_TYPES.SAVE_CURRENCIES,
  payload: data,
});

export const saveCompanies = (data: any[]) => ({
  type: ALLOWANCE_RATE_ACTION_TYPES.SAVE_COMPANIES,
  payload: data,
});

export const saveEligibilities = (data: any[]) => ({
  type: ALLOWANCE_RATE_ACTION_TYPES.SAVE_ELIGIBILITIES,
  payload: data,
});

export const saveDestinations = (data: any[]) => ({
  type: ALLOWANCE_RATE_ACTION_TYPES.SAVE_DESTINATIONS,
  payload: data,
});

export const saveTitles = (data: any[]) => ({
  type: ALLOWANCE_RATE_ACTION_TYPES.SAVE_TITLES,
  payload: data,
});

export const saveGlAccounts = (data: any[]) => ({
  type: ALLOWANCE_RATE_ACTION_TYPES.SAVE_GLACCOUNTS,
  payload: data,
});

export const savePayComponents = (data: any[]) => ({
  type: ALLOWANCE_RATE_ACTION_TYPES.SAVE_PAYCOMPONENTS,
  payload: data,
});
