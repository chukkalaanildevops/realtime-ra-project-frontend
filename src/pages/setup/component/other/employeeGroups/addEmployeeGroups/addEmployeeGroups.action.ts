import * as Models from './addEmployeeGroups.model';

/**
 * Action Types
 */
export const API_CALL_REQUEST: string = 'EMPLOYEE_GROUP_ADD/API_CALL_REQUEST';
export const API_CALL_SUCCESS: string = 'EMPLOYEE_GROUP_ADD/API_CALL_SUCCESS';
export const API_CALL_FAIL: string = 'EMPLOYEE_GROUP_ADD/API_CALL_FAIL';
export const API_CALL_RESET: string = 'EMPLOYEE_GROUP_ADD/API_CALL_RESET';
export const RESET_TO_INITIAL: string = 'EMPLOYEE_GROUP_ADD/RESET_TO_INITIAL';
export const RESET_FORM: string = 'EMPLOYEE_GROUP_ADD/RESET_FORM';
export const UPDATE_ENTITY_ARR_LOADER: string =
  'EMPLOYEE_GROUP_ADD/UPDATE_ENTITY_ARR_LOADER';
export const UPDATE_ENTITY_TYPES_ARR_LOADER: string =
  'UPDATE_ENTITY_TYPES_ARR_LOADER';
export const UPDATE_ENTITY_ARR: string = 'EMPLOYEE_GROUP_ADD/UPDATE_ENTITY_ARR';
export const UPDATE_ENTITY_TYPES_ARR: string =
  'EMPLOYEE_GROUP_ADD/UPDATE_ENTITY_TYPES_ARR';
export const UPDATE_FORM_DATA: string = 'EMPLOYEE_GROUP_ADD/UPDATE_FORM_DATA';
export const UPDATE_BACKEND_ERROR: string =
  'EMPLOYEE_GROUP_ADD/UPDATE_BACKEND_ERROR';
export const UPDATE_UPDATE_ID: string = 'EMPLOYEE_GROUP_ADD/UPDATE_UPDATE_ID';
export const SAVE_EMPLOYEE_GROUP_UPDATE_DATA: string =
  'EMPLOYEE_GROUP_ADD/SAVE_EMPLOYEE_GROUP_UPDATE_DATA';
export const SAVE_EMPLOYEE_GROUP_SELECTED_EMPLOYEE: string =
  'EMPLOYEE_GROUP_ADD/SAVE_EMPLOYEE_GROUP_SELECTED_EMPLOYEE';

/**
 * Actions Creators
 */

export const apiCallRequest: Models.TapiCallRequestFn = (
  isLoading = true,
  info,
) => ({
  type: API_CALL_REQUEST,
  payload: {
    error: '',
    success: '',
    info: info !== undefined ? info : 'Loading Data...',
    isLoading: isLoading,
  },
});

export const apiCallSuccess: Models.TapiCallSuccessFn = success => ({
  type: API_CALL_SUCCESS,
  payload: {
    error: '',
    success: success !== undefined ? success : '',
    info: '',
    isLoading: false,
  },
});

export const apiCallFail: Models.TapiCallSuccessFn = err => ({
  type: API_CALL_FAIL,
  payload: {
    error: err !== undefined ? err : 'Failed to load data.',
    success: '',
    info: '',
    isLoading: false,
  },
});

export const apiCallReset: Models.TapiCallResetFn = () => ({
  type: API_CALL_RESET,
  payload: {
    error: '',
    success: '',
    info: '',
    isLoading: false,
  },
});

export const resetToInitial: Models.TresetToInitialFn = () => ({
  type: RESET_TO_INITIAL,
});

export const updateEntityArrLoader: Models.TupdateEntityArrLoader = data => ({
  type: UPDATE_ENTITY_ARR_LOADER,
  payload: data, //entityArrLoader
});

export const updateEntityTypesArrLoader: Models.TupdateEntityTypesArrLoader = data => ({
  type: UPDATE_ENTITY_TYPES_ARR_LOADER,
  payload: data, //entityTypesArrLoader
});

export const updateEntityArr: Models.TupdateEntityArr = data => ({
  type: UPDATE_ENTITY_ARR,
  payload: data, //entityArr
});

export const updateEntityTypesArr: Models.TupdateEntityTypesArr = data => ({
  type: UPDATE_ENTITY_TYPES_ARR,
  payload: data, //entityTypesArr
});

export const updateFormData: Models.TupdateFormData = data => ({
  type: UPDATE_FORM_DATA,
  payload: data, //formData
});

export const updateBackendError: Models.TupdateBackendError = data => ({
  type: UPDATE_BACKEND_ERROR,
  payload: data, //backend_error
});

export const updateUpdateId: Models.TupdateUpdateId = data => ({
  type: UPDATE_UPDATE_ID,
  payload: data, //updateId
});

export const saveEmployeeGroupUpdateData: Models.TsaveEmployeeGroupUpdateData = data => ({
  type: SAVE_EMPLOYEE_GROUP_UPDATE_DATA,
  payload: data,
});

export const saveEmployeeGroupSelectedEmployee: Models.TsaveEmployeeGroupSelectedEmployee = data => ({
  type: SAVE_EMPLOYEE_GROUP_SELECTED_EMPLOYEE,
  payload: data,
});

export const resetForm: Models.TresetForm = () => ({
  type: RESET_FORM,
});
