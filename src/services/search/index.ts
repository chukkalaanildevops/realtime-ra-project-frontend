import axios from '../../utils/reimAxios.utils';
import { AxiosRequestConfig } from 'axios';

export const fetchSearchResultsAPI = (
  val: string,
  pageNumber: number,
  config: AxiosRequestConfig,
) =>
  axios.get(`search-documents/?${val}`, {
    ...config,
    params: {
      page: pageNumber,
    },
  });

export const fetchLimitedSearchResultsAPI = (
  val: string,
  config: AxiosRequestConfig,
) => axios.get(`search-documents/?${val}`, config);
