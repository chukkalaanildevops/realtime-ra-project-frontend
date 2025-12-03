export const GL_ACCOUNTS_ACTIONS = {
  SAVE_GL_ACCOUNTS: 'GL_ACCOUNTS_ACTIONS/SAVE_GL_ACCOUNTS',
  SAVE_GL_ACCOUNTS_DATA: 'GL_ACCOUNTS_ACTIONS/SAVE_GL_ACCOUNTS_DATA',
  SET_LOADER: 'GL_ACCOUNTS_ACTIONS/SET_LOADER',
  SET_DETAILS_LOADER: 'GL_ACCOUNTS_ACTIONS/SET_DETAILS_LOADER',
  SAVE_ACCOUNT_TYPES: 'GL_ACCOUNTS_ACTIONS/SAVE_ACCOUNT_TYPES',
  SET_LOADING_MESSAGE: 'GL_ACCOUNTS_ACTIONS/SET_LOADING_MESSAGE',
  SET_SUCCESS: 'GL_ACCOUNTS_ACTIONS/SET_SUCCESS',
  SET_ERROR: 'GL_ACCOUNTS_ACTIONS/SET_ERROR',
  RESET_MESSAGE: 'GL_ACCOUNTS_ACTIONS/RESET_MESSAGE',
  SAVE_GL_ACCOUNTS_PAGINATION_DATA:
    'GL_ACCOUNTS_ACTIONS/SAVE_GL_ACCOUNTS_PAGINATION_DATA',
};

export const saveGlAccounts = (data: any[]) => ({
  type: GL_ACCOUNTS_ACTIONS.SAVE_GL_ACCOUNTS,
  payload: data,
});

export const saveGlAccountById = (data: any) => ({
  type: GL_ACCOUNTS_ACTIONS.SAVE_GL_ACCOUNTS_DATA,
  payload: data,
});

export const setLoader = (loader: boolean) => ({
  type: GL_ACCOUNTS_ACTIONS.SET_LOADER,
  payload: loader,
});

export const setDetailsLoader = (loader: boolean) => ({
  type: GL_ACCOUNTS_ACTIONS.SET_DETAILS_LOADER,
  payload: loader,
});

export const saveAccountTypes = (data: any[]) => ({
  type: GL_ACCOUNTS_ACTIONS.SAVE_ACCOUNT_TYPES,
  payload: data,
});

export const setLoadingMessage = (message: string) => ({
  type: GL_ACCOUNTS_ACTIONS.SET_LOADING_MESSAGE,
  payload: message,
});

export const setSuccess = (message: string) => ({
  type: GL_ACCOUNTS_ACTIONS.SET_SUCCESS,
  payload: message,
});

export const setError = (message: any) => ({
  type: GL_ACCOUNTS_ACTIONS.SET_ERROR,
  payload: message,
});

export const resetMessages = () => ({
  type: GL_ACCOUNTS_ACTIONS.RESET_MESSAGE,
});

export const saveGlAccountPaginationData = (data: any) => ({
  type: GL_ACCOUNTS_ACTIONS.SAVE_GL_ACCOUNTS_PAGINATION_DATA,
  payload: data,
});
