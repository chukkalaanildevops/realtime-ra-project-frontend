import { Dispatch } from 'react';
import {
  getWageTypeList,
  getWageTypeUsingId,
  getWageTypeHistoryUsingId,
  postWageType,
  postWageTypeCSVFile,
  updateWageTypeUsingId,
  deleteWageTypeUsingId,
  getWageTypeListCompatibleForDD,
  downloadWageTypeCSVTemplateAPI,
} from '../../../services/wageType/';
import {
  apiCallReset,
  apiCallRequest,
  apiCallFail,
  apiCallSuccess,
  saveWageTypeList,
  setWageTypeListLoader,
  setFormData,
  setSingleWageTypeLoader,
  setBackendError,
  setSelectedWageTypeHistory,
  setSelectedWageTypeHistoryLoader,
  saveWageTypeListPaginatoData,
  setWageTypeListDDCompatibleLoader,
  saveWageTypeDDCompatibleList,
} from './wageType.actions';

const FileDownload = require('js-file-download');

export const fetchWageTypeList = (page: number = 1, size: number) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(apiCallReset());
      dispatch(apiCallRequest(false));
      dispatch(setWageTypeListLoader(true));
      const response = await getWageTypeList(page, size);
      dispatch(saveWageTypeList(response.data.data));
      dispatch(saveWageTypeListPaginatoData(response.data.pagination_data));
      dispatch(apiCallSuccess());
      dispatch(setWageTypeListLoader(false));
    } catch (error) {
      dispatch(setWageTypeListLoader(false));
      dispatch(apiCallFail());
      dispatch(saveWageTypeList([]));
    }
  };
};

/**
 * Dropdown compatible wage type list
 */
export const fetchWageTypeListCompatibleForDD = () => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(apiCallReset());
      dispatch(apiCallRequest(false));
      dispatch(setWageTypeListDDCompatibleLoader(true));
      const response = await getWageTypeListCompatibleForDD();
      dispatch(saveWageTypeDDCompatibleList(response.data));
      dispatch(apiCallSuccess());
      dispatch(setWageTypeListDDCompatibleLoader(false));
    } catch (error) {
      dispatch(setWageTypeListDDCompatibleLoader(false));
      dispatch(apiCallFail());
      dispatch(saveWageTypeDDCompatibleList([]));
    }
  };
};

/**
 * this function fetch single wage type.
 * @function fetchWageTypeUsingId
 * @param {number} id
 */
export const fetchWageTypeUsingId = (id: number) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(apiCallReset());
      dispatch(apiCallRequest(false));
      dispatch(setSingleWageTypeLoader(true));
      const response = await getWageTypeUsingId(id);
      dispatch(setFormData({ title: response.data.title }));
      dispatch(setSingleWageTypeLoader(false));
      dispatch(apiCallSuccess());
    } catch (error) {
      dispatch(apiCallFail());
    }
  };
};

/**
 * This functio get history of single wage type
 * @function fetchWageTypeHistoryUsingId
 * @param {number} id
 */
export const fetchWageTypeHistoryUsingId = (id: number) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(apiCallReset());
      dispatch(apiCallRequest(false, 'Loading wage type history data'));
      dispatch(setSelectedWageTypeHistoryLoader(true));
      const response = await getWageTypeHistoryUsingId(id);
      dispatch(setSelectedWageTypeHistory(response.data));
      dispatch(apiCallSuccess('Successfully loaded history data'));
      dispatch(setSelectedWageTypeHistoryLoader(false));
    } catch (error) {
      dispatch(setSelectedWageTypeHistoryLoader(false));
      dispatch(apiCallFail('Failed to load history data'));
    }
  };
};

/**
 * This function creates single wage type
 * @function createWageType
 * @param {any} data
 * @param {Function} callback
 */
export const createWageType = (data: any, callback?: Function) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(apiCallReset());
      dispatch(apiCallRequest(true, 'Saving wage type'));
      await postWageType(data);
      dispatch(apiCallSuccess('Successfully saved wage type'));
      callback && callback();
    } catch (error) {
      dispatch(setBackendError({ title: [error.response.data.error] }));
      dispatch(apiCallFail('Failed to save wage type'));
    }
  };
};

/**
 * This function helps to upload csv file to create wage type
 * @function uploadWageTypeCSVFile
 * @param {any} data
 */
export const uploadWageTypeCSVFile = (file: File, callBack?: Function) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(apiCallReset());
      dispatch(apiCallRequest(true, 'uploding file'));
      let formData = new FormData();
      formData.append('file', file);
      await postWageTypeCSVFile(formData);
      dispatch(apiCallSuccess('Successfully upoaded file'));
      setTimeout(() => {
        // dispatch(fetchWageTypeList());
        callBack && callBack();
      }, 1000);
    } catch (error) {
      const errData = error.response.data;
      let errText: string = 'Failed to upload file';
      if (errData) {
        if (errData.hasOwnProperty('error')) {
          errText = errData.error;
        } else if (typeof errData === 'object' && Array.isArray(errData)) {
          errText = errData[0]?.errors?.non_field_errors?.msg
            ? errData[0]?.errors?.non_field_errors?.msg
            : errText;
        }
      }
      dispatch(apiCallFail(errText));
    }
  };
};

/**
 * This function modify single wage type
 * @function modifyWageTypeUsingId
 * @param {number} id
 * @param {any} data
 * @param {Function} callback
 */
export const modifyWageTypeUsingId = (
  id: number,
  data: any,
  callback?: Function,
) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(apiCallReset());
      dispatch(apiCallRequest(true, 'Updating wage type'));
      await updateWageTypeUsingId(id, data);
      dispatch(apiCallSuccess('Successfully updated wage type'));
      callback && callback();
    } catch (error) {
      dispatch(setBackendError({ title: [error.response.data.error] }));
      dispatch(apiCallFail('Failed to update wage type'));
    }
  };
};

/**
 * This function delete single wage type
 * @function deleteWageType
 * @param {number} id
 * @param {Function} callback
 */
export const deleteWageType = (id: number, callback?: Function) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(apiCallReset());
      dispatch(apiCallRequest(true, 'Deleting wage type'));
      await deleteWageTypeUsingId(id);
      dispatch(apiCallSuccess('Successfully deleted wage type'));
      setTimeout(() => {
        //   dispatch(fetchWageTypeList());
        callback && callback();
      }, 1000);
    } catch (error) {
      dispatch(apiCallFail('Failed to delete wage type'));
    }
  };
};

export const downloadWageTypeCSVTemplate = () => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(apiCallRequest(false, ''));
      const response = await downloadWageTypeCSVTemplateAPI();
      FileDownload(response.data, 'wage_type_template.csv');
      dispatch(apiCallReset());
    } catch (error) {
      dispatch(apiCallFail('Failed to download wage_type_template.csv'));
    }
  };
};
