import {
  fetchAllowanceRateList,
  uploadAllowanceRateCSV_API,
  downloadCSVTemplateAPI,
  postAllowanceRateItem,
  updateAllowanceRate,
  fetchAllowanceRateHistory,
  fetchCurrencies,
  fetchCompanies,
  fetchEligibilities,
  fetchDestinations,
  fetchTitles,
  fetchPayComponents,
  fetchGlAccounts,
} from '../../../../../services/admin/AllowanceRate';

import { Dispatch } from 'react';

import { AxiosError } from 'axios';
import { getAllowanceList } from '../../../../../shared/redux/rootReducer';

import {
  saveData,
  setError,
  setLoader,
  setLoadingMessage,
  setSuccess,
  setDataSubmitLoader,
  setAllowanceHistoryLoader,
  saveAllowanceHistory,
  saveCurrencies,
  saveCompanies,
  saveEligibilities,
  saveDestinations,
  saveTitles,
  savePayComponents,
  saveGlAccounts,
} from './allowanceRate.actions';

const FileDownload = require('js-file-download');

export const fetchAllowanceList = (
  page: number,
  pageSize: number = 12,
  filter?: any,
) => {
  return async (dispatch: Dispatch<any>) => {
    dispatch(setLoader(true));
    dispatch(setLoadingMessage('Loading Data'));
    try {
      const response = await fetchAllowanceRateList(page, pageSize, filter);
      const data = response.data;
      dispatch(saveData({ ...data, current_page: page }));
      dispatch(setLoader(false));
      dispatch(setLoadingMessage(''));
    } catch (e) {
      const data = (e as AxiosError).response?.data;
      dispatch(saveData([]));
      dispatch(setError(data));
      dispatch(setLoader(false));
      dispatch(setLoadingMessage(''));
    }
  };
};

export const createAllowanceRate = (body: any) => {
  return async (dispatch: Dispatch<any>, getState: any) => {
    dispatch(setDataSubmitLoader(true));
    dispatch(setLoadingMessage('Submitting data'));
    try {
      await postAllowanceRateItem(body);
      // const response = await postCurrencyConversionItem(body);
      // const data = response.data;
      // dispatch(saveData(data));
      dispatch(setSuccess('Allowance Rate added successfully '));
      const state = getState();
      const currentPage = getAllowanceList(state)?.current_page;
      dispatch(fetchAllowanceList(currentPage || 1));
      dispatch(setDataSubmitLoader(false));
      dispatch(setLoadingMessage(''));
    } catch (e) {
      const data = (e as AxiosError).response?.data;
      dispatch(setError(data || 'Something wrong'));
      dispatch(setDataSubmitLoader(false));
      dispatch(setLoadingMessage(''));
    }
  };
};

export const updateAllowanceRateItem = (
  id: string,
  body: any,
  pageSize?: number,
) => {
  return async (dispatch: Dispatch<any>, getState: any) => {
    dispatch(setDataSubmitLoader(true));
    dispatch(setLoadingMessage('Updating record'));
    try {
      await updateAllowanceRate(id, body);
      // const response = await updateAllowanceRate(id, body);
      // const data = response.data;
      const state = getState();
      const currentPage = getAllowanceList(state)?.current_page;
      dispatch(fetchAllowanceList(currentPage || 1, pageSize));
      dispatch(setDataSubmitLoader(false));
      dispatch(setSuccess('Allowance Rate updated successfully '));
      dispatch(setLoadingMessage(''));
    } catch (e) {
      const data = (e as AxiosError).response?.data;
      dispatch(setError(data));
      dispatch(setDataSubmitLoader(false));
      dispatch(setLoadingMessage(''));
    }
  };
};

export const fetchAllowanceHistory = (id: string) => {
  return async (dispatch: Dispatch<any>) => {
    dispatch(setAllowanceHistoryLoader(true));
    dispatch(saveAllowanceHistory([]));
    dispatch(setLoadingMessage('Loading allowance history'));
    try {
      const response = await fetchAllowanceRateHistory(id);
      const data = response.data;
      dispatch(saveAllowanceHistory(data));
      dispatch(setAllowanceHistoryLoader(false));
      dispatch(setLoadingMessage(''));
    } catch (e) {
      const data = (e as AxiosError).response?.data;
      dispatch(setError(data));
      dispatch(setAllowanceHistoryLoader(false));
      dispatch(setLoadingMessage(''));
    }
  };
};

export const fetchCurrencyList = () => {
  return async (dispatch: Dispatch<any>) => {
    try {
      const response = await fetchCurrencies();
      const data = response.data;
      dispatch(saveCurrencies(data));
    } catch (e) {
      const data = (e as AxiosError).response?.data;
      dispatch(setError(data));
    }
  };
};

export const fetchCompanyList = () => {
  return async (dispatch: Dispatch<any>) => {
    try {
      const response = await fetchCompanies();
      const data = response.data;
      dispatch(saveCompanies(data));
    } catch (e) {
      const data = (e as AxiosError).response?.data;
      dispatch(setError(data));
    }
  };
};

export const fetchEligibilityList = () => {
  return async (dispatch: Dispatch<any>) => {
    try {
      const response = await fetchEligibilities();
      const data = response.data;
      dispatch(saveEligibilities(data));
    } catch (e) {
      const data = (e as AxiosError).response?.data;
      dispatch(setError(data));
    }
  };
};

export const fetchDestinationList = () => {
  return async (dispatch: Dispatch<any>) => {
    try {
      const response = await fetchDestinations();
      const data = response.data;
      dispatch(saveDestinations(data));
    } catch (e) {
      const data = (e as AxiosError).response?.data;
      dispatch(setError(data));
    }
  };
};

export const fetchTitleList = () => {
  return async (dispatch: Dispatch<any>) => {
    try {
      const response = await fetchTitles();
      const data = response.data;
      dispatch(saveTitles(data));
    } catch (e) {
      const data = (e as AxiosError).response?.data;
      dispatch(setError(data));
    }
  };
};

export const fetchPayComponentList = () => {
  return async (dispatch: Dispatch<any>) => {
    try {
      const response = await fetchPayComponents();
      const data = response.data;
      dispatch(savePayComponents(data));
    } catch (e) {
      const data = (e as AxiosError).response?.data;
      dispatch(setError(data));
    }
  };
};

export const fetchGlAccountList = () => {
  return async (dispatch: Dispatch<any>) => {
    try {
      const response = await fetchGlAccounts();
      const data = response.data;
      dispatch(saveGlAccounts(data));
    } catch (e) {
      const data = (e as AxiosError).response?.data;
      dispatch(setError(data));
    }
  };
};

export const downloadAllowanceTemplate = () => {
  return async (dispatch: Dispatch<any>) => {
    const response = await downloadCSVTemplateAPI();
    FileDownload(response.data, 'allowance_rate_template.csv');
  };
};

export const uploadAllowanceCSV = (file: any) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(setLoader(true));
      dispatch(setLoadingMessage('Uploading file'));
      await uploadAllowanceRateCSV_API(file);
      dispatch(setSuccess('File uploaded successfully'));
      dispatch(setLoader(false));
      dispatch(setLoadingMessage(''));
      dispatch(fetchAllowanceList(1));
    } catch (e) {
      dispatch(setLoader(false));
      dispatch(setLoadingMessage(''));
      const errorResponse = (e as AxiosError).response?.data;
      if (errorResponse) {
        if (errorResponse.errors && typeof errorResponse.errors === 'object') {
          // const key = Object.keys(errorResponse.errors[0].data_errors)[0];
          const errorMsg = errorResponse.errors;
          dispatch(setError(errorMsg));
        } else {
          dispatch(setError(errorResponse.errors || errorResponse.error));
        }
      } else {
        dispatch(setError('Failed to upload records'));
      }
      // dispatch(setError(errorResponse?.errors || errorResponse?.error));
    }
  };
};
