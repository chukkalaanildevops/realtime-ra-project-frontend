import { Dispatch } from 'react';
import {
  setLoader,
  saveGlAccountById,
  saveGlAccounts,
  setDetailsLoader,
  setLoadingMessage,
  setError,
  setSuccess,
  saveAccountTypes,
  saveGlAccountPaginationData,
} from './glAccount.actions';
import {
  //fetchGlAccountsAPI,
  fetchGlAccountChoicesAPI,
  deleteGlAccountAPI,
  createUpdateGlAccountAPI,
  uploadRecordsAPI,
  fetchGlAccountsByPageAPI,
  downloadCSVTemplateAPI,
  fetchGlAccountsAPI,
} from '../../../services/glAccount';
import { CHOICES } from './glAccount.model';
import { AxiosError } from 'axios';
const FileDownload = require('js-file-download');

const apiStart = (loading: boolean, message = '') => {
  return async (dispatch: Dispatch<any>) => {
    dispatch(setLoader(loading));
    dispatch(setLoadingMessage(message));
  };
};
export const fetchGlAccounts = (id?: string) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      id
        ? dispatch(setDetailsLoader(true))
        : dispatch(apiStart(true, 'Loading Data'));
      const data = await fetchGlAccountsAPI(id);
      if (id) {
        dispatch(saveGlAccountById(data.data));
      } else {
        dispatch(saveGlAccounts(data.data));
        dispatch(saveGlAccountPaginationData(data.data));
      }
      id ? dispatch(setDetailsLoader(false)) : dispatch(apiStart(false));
    } catch (e) {
      id ? dispatch(setDetailsLoader(false)) : dispatch(apiStart(false));
    }
  };
};

export const fetchGlAccountChoices = (choice: CHOICES) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(apiStart(true, 'Loading Data'));
      const response = await fetchGlAccountChoicesAPI(choice);
      const data = response.data;
      if (choice === 'account_type') {
        dispatch(saveAccountTypes(data));
      }
      dispatch(apiStart(false));
    } catch (e) {
      dispatch(apiStart(false));
    }
  };
};

export const createUpdateGlAccount = (body: any, id?: string) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(apiStart(true, 'Submit data'));
      await createUpdateGlAccountAPI(body, id);
      dispatch(apiStart(true));
      if (id) {
        dispatch(setSuccess('Gl account updated successfully'));
      } else {
        dispatch(setSuccess('Gl account created successfully'));
      }
    } catch (e) {
      dispatch(apiStart(false));
      const data = (e as AxiosError).response?.data;
      dispatch(setError(data || 'Failed to save data'));
    }
  };
};

export const deleteGlAccount = (
  id: string,
  page?: number,
  pageSize?: number,
) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(apiStart(true, 'Deleting record'));
      await deleteGlAccountAPI(id);
      dispatch(apiStart(false));
      const data = await fetchGlAccountsByPageAPI(page, pageSize);
      dispatch(
        saveGlAccountPaginationData({ ...data.data, current_page: page }),
      );
      dispatch(setSuccess('Gl account deleted Successfully'));
    } catch (e) {
      dispatch(apiStart(false));
      dispatch(setError('Failed to delete Gl account'));
    }
  };
};

export const uploadGlAccountRecords = (file: any) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(apiStart(true, 'Uploading file'));
      await uploadRecordsAPI(file);
      dispatch(apiStart(false));
      dispatch(setSuccess('Record uploaded successfully'));
      dispatch(fetchGlAccounts());
    } catch (e) {
      dispatch(apiStart(false));
      const errorResponse = (e as AxiosError).response?.data;
      let errorString = 'Failed to upload records';
      if (errorResponse) {
        const errors = errorResponse[0]?.errors;
        if (errors?.non_field_errors) {
          errorString = errors?.non_field_errors?.msg;
        } else {
          // errorString = errors[Object.keys(errors)[0]]?.msg;
          errorString = errorResponse;
        }
      }
      dispatch(setError(errorString || 'Failed to upload records'));
    }
  };
};

export const fetchGlAccountByPage = (page = 1, pageSize?: number) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(apiStart(true, 'Loading Data'));
      const data = await fetchGlAccountsByPageAPI(page, pageSize);

      dispatch(
        saveGlAccountPaginationData({ ...data.data, current_page: page }),
      );

      dispatch(apiStart(false));
    } catch (e) {
      dispatch(apiStart(false));
    }
  };
};

export const downloadGlAccountTemplate = () => {
  return async (dispatch: Dispatch<any>) => {
    const response = await downloadCSVTemplateAPI();
    FileDownload(response.data, 'gl_account_template.csv');
  };
};
