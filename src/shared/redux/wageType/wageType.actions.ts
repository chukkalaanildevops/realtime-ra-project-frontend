import {
  TsaveWageTypeListFn,
  TapiCallRequestFn,
  TapiCallSuccessFn,
  TapiCallFailFn,
  TapiCallResetFn,
  TsetWageTypeListLoaderFn,
  TresetToInitialFn,
  TsetSelectedWageTypeFn,
  TsetFormDataFn,
  TresetFormDataFn,
  TsetAddModeFn,
  TsetUpdateModeFn,
  TsetUpdateIdFn,
  TsetSingleWageTypeLoaderFn,
  TsetBackendErrorFn,
  TresetBackendErrorFn,
  TsetSelectedWageTypeHistoryFn,
  TsetSelectedWageTypeHistoryLoaderFn,
  TsaveWageTypeListPaginatoDataFn,
  TsaveWageTypeDDCompatibleListFn,
  TsetWageTypeListDDCompatibleLoaderFn,
} from './wageType.model';

export const ActionType = {
  API_CALL_REQUEST: 'API_CALL_REQUEST',
  API_CALL_SUCCESS: 'API_CALL_SUCCESS',
  API_CALL_FAIL: 'API_CALL_FAIL',
  API_CALL_RESET: 'API_CALL_RESET',
  RESET_TO_INITIAL: 'RESET_TO_INITIAL',
  SET_WAGE_TYPE_LIST: 'SET_WAGE_TYPE_LIST',
  SET_WAGE_TYPE_LIST_LOADER: 'SET_WAGE_TYPE_LIST_LOADER',
  SET_SELECTED_WAGE_TYPE: 'SET_SELECTED_WAGE_TYPE',
  SET_FORM_DATA: 'SET_FORM_DATA',
  RESET_FORM_DATA: 'RESET_FORM_DATA',
  SET_ADD_MODE: 'SET_ADD_MODE',
  SET_UPDATE_MODE: 'SET_UPDATE_MODE',
  SET_UPDATE_ID: 'SET_UPDATE_ID',
  SET_SINGLE_WAGE_TYPE_LOADER: 'SET_SINGLE_WAGE_TYPE_LOADER',
  SET_BACKEND_ERROR: 'SET_BACKEND_ERROR',
  RESET_BACKEND_ERROR: 'RESET_BACKEND_ERROR',
  SET_SELECTED_WAGE_TYPE_HISTORY: 'SET_SELECTED_WAGE_TYPE_HISTORY',
  SET_SELECTED_WAGE_TYPE_HISTORY_LOADER:
    'SET_SELECTED_WAGE_TYPE_HISTORY_LOADER',
  SET_PAGINATION_DATA: 'SET_PAGINATION_DATA',
  SET_WAGE_TYPE_DD_COMPATIBLE_LIST_LOADER:
    'SET_WAGE_TYPE_DD_COMPATIBLE_LIST_LOADER',
  SET_WAGE_TYPE_DD_COMPATIBLE_LIST: 'SET_WAGE_TYPE_DD_COMPATIBLE_LIST',
};

/**
 * Actions Creators
 */

export const apiCallRequest: TapiCallRequestFn = (isLoading = true, info) => ({
  type: ActionType.API_CALL_REQUEST,
  payload: {
    error: '',
    success: '',
    info: info !== undefined ? info : 'Loading Data...',
    isLoading: isLoading,
  },
});

export const apiCallSuccess: TapiCallSuccessFn = success => ({
  type: ActionType.API_CALL_SUCCESS,
  payload: {
    error: '',
    success: success !== undefined ? success : '',
    info: '',
    isLoading: false,
  },
});

export const apiCallFail: TapiCallFailFn = err => ({
  type: ActionType.API_CALL_FAIL,
  payload: {
    error: err !== undefined ? err : 'Failed to load data.',
    success: '',
    info: '',
    isLoading: false,
  },
});

export const apiCallReset: TapiCallResetFn = () => ({
  type: ActionType.API_CALL_RESET,
  payload: {
    error: '',
    success: '',
    info: '',
    isLoading: false,
  },
});

export const resetToInitial: TresetToInitialFn = () => ({
  type: ActionType.RESET_TO_INITIAL,
});

export const saveWageTypeList: TsaveWageTypeListFn = list => ({
  type: ActionType.SET_WAGE_TYPE_LIST,
  payload: list,
});

export const setWageTypeListLoader: TsetWageTypeListLoaderFn = bool => ({
  type: ActionType.SET_WAGE_TYPE_LIST_LOADER,
  payload: bool,
});

export const saveWageTypeDDCompatibleList: TsaveWageTypeDDCompatibleListFn = list => ({
  type: ActionType.SET_WAGE_TYPE_DD_COMPATIBLE_LIST,
  payload: list,
});

export const setWageTypeListDDCompatibleLoader: TsetWageTypeListDDCompatibleLoaderFn = bool => ({
  type: ActionType.SET_WAGE_TYPE_DD_COMPATIBLE_LIST_LOADER,
  payload: bool,
});

export const setSelectedWageType: TsetSelectedWageTypeFn = wageType => ({
  type: ActionType.SET_SELECTED_WAGE_TYPE,
  payload: wageType,
});

export const setFormData: TsetFormDataFn = formData => ({
  type: ActionType.SET_FORM_DATA,
  payload: formData,
});

export const resetFormData: TresetFormDataFn = () => ({
  type: ActionType.RESET_FORM_DATA,
});

export const setAddMode: TsetAddModeFn = data => ({
  type: ActionType.SET_ADD_MODE,
  payload: data,
});

export const setUpdateMode: TsetUpdateModeFn = data => ({
  type: ActionType.SET_UPDATE_MODE,
  payload: data,
});

export const setUpdateId: TsetUpdateIdFn = data => ({
  type: ActionType.SET_UPDATE_ID,
  payload: data,
});

export const setSingleWageTypeLoader: TsetSingleWageTypeLoaderFn = data => ({
  type: ActionType.SET_SINGLE_WAGE_TYPE_LOADER,
  payload: data,
});

export const setBackendError: TsetBackendErrorFn = data => ({
  type: ActionType.SET_BACKEND_ERROR,
  payload: data,
});

export const resetBackendError: TresetBackendErrorFn = () => ({
  type: ActionType.RESET_BACKEND_ERROR,
});

export const setSelectedWageTypeHistory: TsetSelectedWageTypeHistoryFn = data => ({
  type: ActionType.SET_SELECTED_WAGE_TYPE_HISTORY,
  payload: data,
});

export const setSelectedWageTypeHistoryLoader: TsetSelectedWageTypeHistoryLoaderFn = data => ({
  type: ActionType.SET_SELECTED_WAGE_TYPE_HISTORY_LOADER,
  payload: data,
});

export const saveWageTypeListPaginatoData: TsaveWageTypeListPaginatoDataFn = data => ({
  type: ActionType.SET_PAGINATION_DATA,
  payload: data,
});
