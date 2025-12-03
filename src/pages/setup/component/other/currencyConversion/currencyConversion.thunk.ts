import {
  fetchCurrencyConversionList,
  postCurrencyConversionItem,
  fetchCurrencies,
  updateCurrencyConversion,
  fetchCurrencyConversionHistory,
  downloadCSVTemplateAPI,
  uploadCurrencyConversionCSV_API,
  getConversionRate,
  fetchCountryCurrencies,
  uploadFromFTP_API,
} from '../../../../../services/admin/currencyConversion';
import { Dispatch } from 'react';
import {
  saveData,
  saveCurrencies,
  setError,
  setLoader,
  setSuccess,
  saveConversionHistory,
  setLoadingMessage,
  setConversionRate,
  setDataSubmitLoader,
  saveCountryCurrencies,
  setCHLoader,
} from './currencyConversion.actions';

import { AxiosError } from 'axios';
import { getCurrencyConversionList } from '../../../../../shared/redux/rootReducer';
const FileDownload = require('js-file-download');
export const fetchCCList = (
  page: number,
  pageSize: number = 12,
  filter?: any,
) => {
  return async (dispatch: Dispatch<any>) => {
    dispatch(setLoader(true));
    dispatch(setLoadingMessage('Loading Data'));
    try {
      const response = await fetchCurrencyConversionList(
        page,
        pageSize,
        filter,
      );
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

export const createCurrencyConversion = (body: any) => {
  return async (dispatch: Dispatch<any>, getState: any) => {
    dispatch(setDataSubmitLoader(true));
    dispatch(setLoadingMessage('Submitting data'));
    try {
      await postCurrencyConversionItem(body);
      // const response = await postCurrencyConversionItem(body);
      // const data = response.data;
      // dispatch(saveData(data));
      dispatch(setSuccess('Currency Conversion added successfully '));
      const state = getState();
      const currentPage = getCurrencyConversionList(state)?.current_page;
      dispatch(fetchCCList(currentPage || 1));
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

export const fetchCountryCurrencyList = () => {
  return async (dispatch: Dispatch<any>) => {
    dispatch(setLoader(true));
    try {
      const response = await fetchCountryCurrencies();
      const data = response.data;
      dispatch(saveCountryCurrencies(data));
      dispatch(setLoader(false));
    } catch (e) {
      const data = (e as AxiosError).response?.data;
      dispatch(setError(data));
      dispatch(setLoader(false));
    }
  };
};

export const fetchCoversionRate = (
  date: string,
  base: number,
  target: number,
) => {
  return async (dispatch: Dispatch<any>) => {
    dispatch(setLoader(false));
    try {
      const response = await getConversionRate(date, base, target);
      const data = response.data;
      dispatch(setConversionRate(data));
      // dispatch(setLoader(false));
    } catch (e) {
      const data = (e as AxiosError).response?.data;
      dispatch(setError(data));
      // dispatch(setLoader(false));
    }
  };
};

export const updateCurrencyConversionItem = (
  id: string,
  body: any,
  pageSize?: number,
) => {
  return async (dispatch: Dispatch<any>, getState: any) => {
    dispatch(setDataSubmitLoader(true));
    dispatch(setLoadingMessage('Updating record'));
    try {
      await updateCurrencyConversion(id, body);
      // const response = await updateCurrencyConversion(id, body);
      // const data = response.data;
      // dispatch(saveCurrencies(data));
      const state = getState();
      const currentPage = getCurrencyConversionList(state)?.current_page;
      dispatch(fetchCCList(currentPage || 1, pageSize));
      dispatch(setDataSubmitLoader(false));
      dispatch(setSuccess('Currency Conversion updated successfully '));
      dispatch(setLoadingMessage(''));
    } catch (e) {
      const data = (e as AxiosError).response?.data;
      dispatch(setError(data));
      dispatch(setDataSubmitLoader(false));
      dispatch(setLoadingMessage(''));
    }
  };
};

export const fetchConversionHistory = (id: string) => {
  return async (dispatch: Dispatch<any>) => {
    dispatch(setCHLoader(true));
    dispatch(saveConversionHistory([]));
    dispatch(setLoadingMessage('Loading conversion history'));
    try {
      const response = await fetchCurrencyConversionHistory(id);
      const data = response.data;
      dispatch(saveConversionHistory(data));
      dispatch(setCHLoader(false));
      dispatch(setLoadingMessage(''));
    } catch (e) {
      const data = (e as AxiosError).response?.data;
      dispatch(setError(data));
      dispatch(setCHLoader(false));
      dispatch(setLoadingMessage(''));
    }
  };
};

export const downloadCurrencyConversionTemplate = () => {
  return async (dispatch: Dispatch<any>) => {
    const response = await downloadCSVTemplateAPI();
    FileDownload(response.data, 'currency_conversion_template.csv');
  };
};

export const uploadCurrencyConversionCSV = (file: any) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(setLoader(true));
      dispatch(setLoadingMessage('Uploading file'));
      await uploadCurrencyConversionCSV_API(file);
      dispatch(setSuccess('File uploaded successfully'));
      dispatch(setLoader(false));
      dispatch(setLoadingMessage(''));
      dispatch(fetchCCList(1));
    } catch (e) {
      dispatch(setLoader(false));
      dispatch(setLoadingMessage(''));
      const errorResponse = (e as AxiosError).response?.data;
      // let errorString = 'Failed to upload records';
      // if (errorResponse) {
      //   const errors = errorResponse[0]?.errors;
      //   if (errors?.non_field_errors) {
      //     errorString = errors?.non_field_errors?.msg;
      //   } else {
      //     errorString = errors[Object.keys(errors)[0]]?.msg;
      //   }
      // }
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

export const uploadFromFTP = () => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(setLoader(true));
      dispatch(setLoadingMessage('Uploading'));
      await uploadFromFTP_API();

      dispatch(setLoader(false));
      dispatch(setLoadingMessage(''));
      dispatch(setSuccess('File processing.'));
    } catch (e) {
      dispatch(setLoader(false));
      dispatch(setLoadingMessage(''));
      dispatch(
        setError(e.response?.data?.details[0] || 'Failed to upload via FTP'),
      );
    }
  };
};
