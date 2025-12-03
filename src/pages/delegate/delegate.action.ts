import { screenConfig, errorObject } from './delegate.model';

export const DELEGATE_ACTIONS = {
  SET_LOADER: 'DELEGATE_ACTIONS/SET_LOADER',
  SET_DATA_LOADING: 'DELEGATE_ACTIONS/SET_DATA_LOADING',
  SET_LOADING_MESSAGE: 'DELEGATE_ACTIONS/SET_LOADING_MESSAGE',
  SET_SUCCESS: 'DELEGATE_ACTIONS/SET_SUCCESS',
  SET_ERROR: 'DELEGATE_ACTIONS/SET_ERROR',
  SAVE_DELEGATED_TO_ME: 'DELEGATE_ACTIONS/SAVE_DELEGATED_TO_ME',
  SAVE_DELEGATED_BY_ME: 'DELEGATE_ACTIONS/SAVE_DELEGATED_BY_ME',
  SAVE_PROXY_PERMISSIONS: 'DELEGATE_ACTIONS/SAVE_PROXY_PERMISSIONS',
  SAVE_USERS: 'DELEGATE_ACTIONS/SAVE_USERS',
  SAVE_PROXY_USERS: 'DELEGATE_ACTIONS/SAVE_PROXY_USERS',
  SAVE_CURRENT_DELEGATE_USER: 'DELEGATE_ACTIONS/SAVE_CURRENT_DELEGATE_USER',
  CONFIG_SCREEN_FOR_DELEGATE_USER:
    'DELEGATE_ACTIONS/CONFIG_SCREEN_FOR_DELEGATE_USER',
  SAVE_JOB_INFORMATION: 'DELEGATE_ACTIONS/SAVE_JOB_INFORMATION',
  SET_ERROR_OBJECT: 'DELEGATE_ACTIONS/SET_ERROR_OBJECT',
  SET_API_LOADING: 'DELEGATE_ACTIONS/SET_API_LOADING',
  SET_CURRANT_DELEGATE_LOADER: 'DELEGATE_ACTIONS/SET_CURRANT_DELEGATE_LOADER',
};

export const setSuccess = (message: string) => ({
  type: DELEGATE_ACTIONS.SET_SUCCESS,
  payload: message,
});

export const setError = (message: string) => ({
  type: DELEGATE_ACTIONS.SET_ERROR,
  payload: message,
});

export const setLoadingMessage = (message: string) => ({
  type: DELEGATE_ACTIONS.SET_LOADING_MESSAGE,
  payload: message,
});

export const setLoader = (loader: boolean) => ({
  type: DELEGATE_ACTIONS.SET_LOADER,
  payload: loader,
});

export const saveDelegatedToMe = (data: any) => ({
  type: DELEGATE_ACTIONS.SAVE_DELEGATED_TO_ME,
  payload: data,
});

export const saveDelegatedByMe = (data: any) => ({
  type: DELEGATE_ACTIONS.SAVE_DELEGATED_BY_ME,
  payload: data,
});

export const saveProxyPermissions = (data: any[]) => ({
  type: DELEGATE_ACTIONS.SAVE_PROXY_PERMISSIONS,
  payload: data,
});

export const saveUsers = (data: any[]) => ({
  type: DELEGATE_ACTIONS.SAVE_USERS,
  payload: data,
});

export const setDataLoading = (loader: boolean) => ({
  type: DELEGATE_ACTIONS.SET_DATA_LOADING,
  payload: loader,
});

export const setAPILoading = (loader: boolean) => ({
  type: DELEGATE_ACTIONS.SET_API_LOADING,
  payload: loader,
});

export const saveProxyUsers = (data: any[]) => ({
  type: DELEGATE_ACTIONS.SAVE_PROXY_USERS,
  payload: data,
});

export const saveCurrentDelegateUser = (data: any) => ({
  type: DELEGATE_ACTIONS.SAVE_CURRENT_DELEGATE_USER,
  payload: data,
});

export const configDelegationScreen = (data?: screenConfig) => ({
  type: DELEGATE_ACTIONS.CONFIG_SCREEN_FOR_DELEGATE_USER,
  payload: data,
});

export const saveJobInformation = (data?: any) => ({
  type: DELEGATE_ACTIONS.SAVE_JOB_INFORMATION,
  payload: data,
});

export const setErrorObject = (status?: boolean, data?: errorObject) => ({
  type: DELEGATE_ACTIONS.SET_ERROR_OBJECT,
  payload: data,
  status,
});

export const setCurrantDelegateLoader = (loader: boolean) => {
  return {
    type: DELEGATE_ACTIONS.SET_CURRANT_DELEGATE_LOADER,
    payload: loader,
  };
};
