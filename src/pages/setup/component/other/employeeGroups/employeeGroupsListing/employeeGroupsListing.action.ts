import * as Models from './employeeGroupsListing.model';

/**
 * Action Types
 */
export const API_CALL_REQUEST: string =
  'EMPLOYEE_GROUP_LISTING/API_CALL_REQUEST';

export const API_CALL_SUCCESS: string =
  'EMPLOYEE_GROUP_LISTING/API_CALL_SUCCESS';

export const API_CALL_FAIL: string = 'EMPLOYEE_GROUP_LISTING/API_CALL_FAIL';

export const API_CALL_RESET: string = 'EMPLOYEE_GROUP_LISTING/API_CALL_RESET';

export const RESET_TO_INITIAL: string =
  'EMPLOYEE_GROUP_LISTING/RESET_TO_INITIAL';

export const UPDATE_EMPLOYEE_GROUP_LIST: string =
  'EMPLOYEE_GROUP_LISTING/UPDATE_EMPLOYEE_GROUP_LIST';

export const UPDATE_EMPLOYEE_GROUP_LIST_LOADER: string =
  'EMPLOYEE_GROUP_LISTING/UPDATE_EMPLOYEE_GROUP_LIST_LOADER';

export const UPDATE_EMPLOYEE_GROUP_SELECTED: string =
  'EMPLOYEE_GROUP_LISTING/UPDATE_EMPLOYEE_GROUP_SELECTED';

export const SAVE_EMPLOYEE_GROUP_SELECTED_EMPLOYEE: string =
  'EMPLOYEE_GROUP_LISTING/SAVE_EMPLOYEE_GROUP_SELECTED_EMPLOYEE';

export const UPDATE_EMPLOYEE_GROUP_SELECTED_EMPLOYEE_LIST_LOADER: string =
  'EMPLOYEE_GROUP_LISTING/UPDATE_EMPLOYEE_GROUP_SELECTED_EMPLOYEE_LIST_LOADER';

export const UPDATE_TOTAL_EMPLOYEE_COUNT: string =
  'EMPLOYEE_GROUP_LISTING/UPDATE_TOTAL_EMPLOYEE_COUNT';

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

export const saveEmployeeGroupList: Models.TsaveEmployeeGroupList = data => ({
  type: UPDATE_EMPLOYEE_GROUP_LIST,
  payload: data,
});

export const updateEmployeeGroupListLoaderVisibility: Models.TupdateEmployeeGroupListLoaderVisibility = data => ({
  type: UPDATE_EMPLOYEE_GROUP_LIST_LOADER,
  payload: data,
});

export const updateEmployeeGroupSelected: Models.TupdateEmployeeGroupSelected = data => ({
  type: UPDATE_EMPLOYEE_GROUP_SELECTED,
  payload: data,
});

export const saveEmployeeGroupSelectedEmployee: Models.TsaveEmployeeGroupSelectedEmployee = data => ({
  type: SAVE_EMPLOYEE_GROUP_SELECTED_EMPLOYEE,
  payload: data,
});

export const updateEmployeeGroupSelectedEmployeeListLoader: Models.TupdateEmployeeGroupSelectedEmployeeListLoader = data => ({
  type: UPDATE_EMPLOYEE_GROUP_SELECTED_EMPLOYEE_LIST_LOADER,
  payload: data,
});

export const savePaginationData: Models.TsavePaginationData = data => {
  return {
    type: UPDATE_TOTAL_EMPLOYEE_COUNT,
    payload: data,
  };
};
