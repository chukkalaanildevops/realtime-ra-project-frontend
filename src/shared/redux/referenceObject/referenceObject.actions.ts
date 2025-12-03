import * as Models from './referenceObject.model';
import { Dispatch } from 'react';

export const OBJECT_REFERENCE_TYPES = {
  SAVE_OBJECTS: 'OBJECT_REFERENCE_TYPES/SAVE_OBJECTS',
  SET_ERROR: 'OBJECT_REFERENCE_TYPES/SET_ERROR',
  SET_LOADING: 'OBJECT_REFERENCE_TYPES/SET_LOADING',
  SET_SUCCESS: 'OBJECT_REFERENCE_TYPES/SET_SUCCESS',
  API_CALL_REQUEST: 'OBJECT_REFERENCE_TYPES/API_CALL_REQUEST',
  API_CALL_SUCCESS: 'OBJECT_REFERENCE_TYPES/API_CALL_SUCCESS',
  API_CALL_FAIL: 'OBJECT_REFERENCE_TYPES/API_CALL_FAIL',
  API_CALL_RESET: 'OBJECT_REFERENCE_TYPES/API_CALL_RESET',
  RESET_TO_INITIAL: 'OBJECT_REFERENCE_TYPES/RESET_TO_INITIAL',
  SET_OBJECT_REFERENCE_SELECTED:
    'OBJECT_REFERENCE_TYPES/SET_OBJECT_REFERENCE_SELECTED',
  SET_OBJECT_REFERENCE_SELECTED_LOADER:
    'OBJECT_REFERENCE_TYPES/SET_OBJECT_REFERENCE_SELECTED_LOADER',
  SET_FORM_DATA: 'OBJECT_REFERENCE_TYPES/SET_FORM_DATA',
  RESET_FORM_DATA: 'OBJECT_REFERENCE_TYPES/RESET_FORM_DATA',
  SET_LIST_LOADER: 'OBJECT_REFERENCE_TYPES/SET_LIST_LOADER',
  SET_UPDATE_ID: 'OBJECT_REFERENCE_TYPES/SET_UPDATE_ID',
  SET_LIST_UPDATE: 'OBJECT_REFERENCE_TYPES/SET_LIST_UPDATE',
  RESET_LIST_UPDATE: 'OBJECT_REFERENCE_TYPES/RESET_LIST_UPDATE',
  UPDATE_PAGINATION_DATA: 'OBJECT_REFERENCE_TYPES/UPDATE_PAGINATION_DATA',
  UPDATE_ITEM_FILE: 'OBJECT_REFERENCE_TYPES/UPDATE_ITEM_FILE',
  UPDATE_BACKEND_ERRORS: 'OBJECT_REFERENCE_TYPES/UPDATE_BACKEND_ERRORS',
  SAVE_REFERENCE_OBJECTS: 'OBJECT_REFERENCE_TYPES/SAVE_REFERENCE_OBJECTS',
  UPDATE_RESTORE_PAGE_NO: 'OBJECT_REFERENCE_TYPES/UPDATE_RESTORE_PAGE_NO',
  UPDATE_RESTORE_PAGE_SIZE: 'OBJECT_REFERENCE_TYPES/UPDATE_RESTORE_PAGE_SIZE',
};

/**
 * Actions Creators
 */

export const apiCallRequest: Models.TapiCallRequestFn = (
  isLoading = true,
  info,
) => ({
  type: OBJECT_REFERENCE_TYPES.API_CALL_REQUEST,
  payload: {
    error: '',
    success: '',
    info: info !== undefined ? info : 'Loading Data...',
    loader: isLoading,
  },
});

export const apiCallSuccess: Models.TapiCallSuccessFn = success => ({
  type: OBJECT_REFERENCE_TYPES.API_CALL_SUCCESS,
  payload: {
    error: '',
    success: success !== undefined ? success : '',
    info: '',
    loader: false,
  },
});

export const apiCallFail: Models.TapiCallSuccessFn = err => ({
  type: OBJECT_REFERENCE_TYPES.API_CALL_FAIL,
  payload: {
    error: err !== undefined ? err : 'Failed to load data.',
    success: '',
    info: '',
    loader: false,
  },
});

export const apiCallReset: Models.TapiCallResetFn = () => ({
  type: OBJECT_REFERENCE_TYPES.API_CALL_RESET,
  payload: {
    error: '',
    success: '',
    info: '',
    loader: false,
  },
});

export const setObjectReferenceSelected: Models.TsetObjectReferenceSelectedFn = selectedObjectReference => ({
  type: OBJECT_REFERENCE_TYPES.SET_OBJECT_REFERENCE_SELECTED,
  payload: selectedObjectReference,
});

export const setObjectReferenceSelectedLoader = (isLoading: boolean) => ({
  type: OBJECT_REFERENCE_TYPES.SET_OBJECT_REFERENCE_SELECTED_LOADER,
  payload: isLoading,
});

export const resetToInitial: Models.TresetToInitialFn = () => ({
  type: OBJECT_REFERENCE_TYPES.RESET_TO_INITIAL,
});

export const saveObjects = (data: any[]) => ({
  type: OBJECT_REFERENCE_TYPES.SAVE_OBJECTS,
  payload: data,
});

export const setError = (error: string) => ({
  type: OBJECT_REFERENCE_TYPES.SET_ERROR,
  payload: error,
});

export const setSuccess = (message: string) => ({
  type: OBJECT_REFERENCE_TYPES.SET_SUCCESS,
  payload: message,
});

export const setLoader = (isLoading: boolean) => ({
  type: OBJECT_REFERENCE_TYPES.SET_LOADING,
  payload: isLoading,
});

export const setFormData = (formData: any, item?: any, canDeleted?: any) => ({
  type: OBJECT_REFERENCE_TYPES.SET_FORM_DATA,
  payload: formData,
  item,
  canDeleted,
});

export const resetFormData: Models.TresetFormDataFn = () => ({
  type: OBJECT_REFERENCE_TYPES.RESET_FORM_DATA,
});

export const setListLoader: Models.TsetListLoaderFn = setListLoader => ({
  type: OBJECT_REFERENCE_TYPES.SET_LIST_LOADER,
  payload: setListLoader,
});

export const setUpdateId: Models.TsetUpdateIdFn = id => ({
  type: OBJECT_REFERENCE_TYPES.SET_UPDATE_ID,
  payload: id,
});

export const setListUpdate: Models.TsetListUpdateFn = (item, action) => {
  return async (dispatch: Dispatch<any>, getState: any) => {
    dispatch({
      type: OBJECT_REFERENCE_TYPES.SET_LIST_UPDATE,
      payload: createListUpdateObject(item, action, getState),
    });
  };
};

export const resetListUpdate: Models.TresetListUpdateFn = () => {
  return {
    type: OBJECT_REFERENCE_TYPES.RESET_LIST_UPDATE,
  };
};

export const createListUpdateObject: Models.TcreateListUpdateObjectFn = (
  item,
  action,
  getState: any,
) => {
  let listUpdateTemp: Models.IlistUpdate = {
    add: getState().referenceObject.listUpdate.add,
    remove: getState().referenceObject.listUpdate.remove,
  };
  switch (action) {
    case 'ADD':
      if (listUpdateTemp.remove.includes(item)) {
        const sameVal = listUpdateTemp.remove.filter((o: string) => o === item);
        listUpdateTemp.remove.splice(
          listUpdateTemp.remove.indexOf(sameVal[0]),
          1,
        );
      } else {
        listUpdateTemp.add.push(item);
      }
      break;
    case 'REMOVE':
      if (listUpdateTemp.add.includes(item)) {
        const sameVal = listUpdateTemp.add.filter((o: string) => o === item);
        listUpdateTemp.remove.push(sameVal[0]);
        listUpdateTemp.add.splice(listUpdateTemp.add.indexOf(sameVal[0]), 1);
      } else {
        listUpdateTemp.remove.push(item);
      }
      break;
    default:
      console.error(action);
      break;
  }

  return listUpdateTemp;
};

export const savePaginationData: Models.TsavePaginationData = data => {
  // const _payload = data.filter(o => o.hasOwnProperty('total_records'));
  return {
    type: OBJECT_REFERENCE_TYPES.UPDATE_PAGINATION_DATA,
    payload: data,
  };
};

export const removePaginationData: Models.TremovePaginationData = objectReferenceList => {
  const newRefernceObjectList = objectReferenceList.filter(
    o => !o.hasOwnProperty('total_records'),
  );
  return newRefernceObjectList;
};

export const updateItemFile: Models.TupdateItemFileFn = file => {
  return {
    type: OBJECT_REFERENCE_TYPES.UPDATE_ITEM_FILE,
    payload: file,
  };
};

export const updateBackendErrors: Models.TupdateBackendErrorsFn = errors => {
  return {
    type: OBJECT_REFERENCE_TYPES.UPDATE_BACKEND_ERRORS,
    payload: errors,
  };
};

export const saveReferenceObjects = (data: any[]) => ({
  type: OBJECT_REFERENCE_TYPES.SAVE_REFERENCE_OBJECTS,
  payload: data,
});

export const updateRestorePageNo: Models.TupdateRestorePageNoFn = (
  data = false,
) => ({
  type: OBJECT_REFERENCE_TYPES.UPDATE_RESTORE_PAGE_NO,
  payload: data,
});

export const updateRestorePageSize: Models.TupdateRestorePageSizeFn = (
  data = false,
) => ({
  type: OBJECT_REFERENCE_TYPES.UPDATE_RESTORE_PAGE_SIZE,
  payload: data,
});
