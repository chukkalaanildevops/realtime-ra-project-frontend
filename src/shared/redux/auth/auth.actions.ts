import { IUserForDD } from '../../model';

export const AUTH_ACTIONS = {
  SET_LOADER: 'AUTH_ACTIONS/SET_LOADER',
  SAVE_TENANT: 'AUTH_ACTIONS/SAVE_TENANT',
  SAVE_TOKEN: 'AUTH_ACTIONS/SAVE_TOKEN',
  SAVE_ERROR: 'AUTH_ACTIONS/SAVE_ERROR',
  SAVE_SUCCESS: 'AUTH_ACTIONS/SAVE_SUCCESS',
  SAVE_LOADING_MESSAGE: 'AUTH_ACTIONS/SAVE_LOADING_MESSAGE',
  SAVE_EXPENSE_TYPES: 'AUTH_ACTIONS/SAVE_EXPENSE_TYPES',
  SAVE_TENANT_CONFIG: 'AUTH_ACTIONS/SAVE_TENANT_CONFIG',
  SAVE_USER_DATA: 'AUTH_ACTIONS/SAVE_USER_DATA',
  SAVE_USER_JOB_INFORMATION: 'AUTH_ACTIONS/SAVE_USER_JOB_INFORMATION',
  USER_LOGGED_OUT: 'USER_LOGGED_OUT',
  SAVE_USERS: 'AUTH_ACTIONS/SAVE_USERS',
  UPDATE_LOADER_FOR_USERS: 'AUTH_ACTIONS/UPDATE_LOADER_FOR_USERS',
  IS_ENTERED_TENANT: 'AUTH_ACTIONS/IS_ENTERED_TENANT',
  SAVE_REDIRECTION_URL: 'AUTH_ACTIONS/SAVE_REDIRECTION_URL',
};

export const setIsEntTenant = (isEntTenant: boolean) => ({
  type: AUTH_ACTIONS.IS_ENTERED_TENANT,
  payload: isEntTenant,
});

export const setLoader = (loading: boolean) => ({
  type: AUTH_ACTIONS.SET_LOADER,
  payload: loading,
});

export const saveTenant = (tenant: string) => ({
  type: AUTH_ACTIONS.SAVE_TENANT,
  payload: tenant,
});

export const saveToken = (token: string) => ({
  type: AUTH_ACTIONS.SAVE_TOKEN,
  payload: token,
});

export const setSuccess = (message: string) => ({
  type: AUTH_ACTIONS.SAVE_SUCCESS,
  payload: message,
});

export const setError = (message: string) => ({
  type: AUTH_ACTIONS.SAVE_ERROR,
  payload: message,
});

export const setLoadingMessage = (message: string) => ({
  type: AUTH_ACTIONS.SAVE_LOADING_MESSAGE,
  payload: message,
});

export const setExpenseTypes = (data: any) => ({
  type: AUTH_ACTIONS.SAVE_EXPENSE_TYPES,
  payload: data,
});

export const saveTenantConfig = (config: any) => ({
  type: AUTH_ACTIONS.SAVE_TENANT_CONFIG,
  payload: config,
});

export const saveUserData = (user: any) => ({
  type: AUTH_ACTIONS.SAVE_USER_DATA,
  payload: user,
});

export const saveJobInformation = (jobInfo: any) => ({
  type: AUTH_ACTIONS.SAVE_USER_JOB_INFORMATION,
  payload: jobInfo,
});

export const saveUsers = (users: IUserForDD[]) => ({
  type: AUTH_ACTIONS.SAVE_USERS,
  payload: users,
});

export const updateLoaderForUser = (loader: boolean) => ({
  type: AUTH_ACTIONS.UPDATE_LOADER_FOR_USERS,
  payload: loader,
});

export const userLogout = () => ({ type: AUTH_ACTIONS.USER_LOGGED_OUT });
