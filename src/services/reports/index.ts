import axios from '../../utils/reimAxios.utils';
import { generateQueryParamsString } from '../../utils/global.utils';
import { AxiosRequestConfig } from 'axios';

export const fetchReportsData = (
  dataType: 'data' | 'count' | 'report',
  source?: any,
  item?: string,
  page?: number,
  filters?: any,
  pageSize?: number,
  employee?: number,
) => {
  let paramObj: any = {
    function: dataType,
  };
  if (item) {
    paramObj.item = item;
  }
  if (page) {
    paramObj.page = page;
  }
  if (filters) {
    paramObj = { ...paramObj, ...filters };
  }
  if (pageSize) {
    paramObj.page_size = pageSize;
  }
  if (employee) {
    paramObj.employee = employee;
  }
  let params = '';
  Object.keys(paramObj).forEach(
    (item: string, index) =>
      (params += `${index === 0 ? '' : '&'}${item}=${paramObj[item]}`),
  );
  let config: AxiosRequestConfig = {
    cancelToken: source.token,
  };
  return axios.get(`/reports/?${params}`, config);
};

export const getDataForReportsService = (parameters: any) => {
  let config: any = {
    params: parameters,
    paramsSerializer: (params: any) => generateQueryParamsString(params),
  };
  return axios.get('/reports/', config);
};
export const fetchExportedReportsListAPI = () => axios.get('/admin-reports/');

export const downloadReportAPI = (reportId: number) =>
  axios.get(`/admin-reports/${reportId}/download/`, { responseType: 'blob' });

export const fetchSavedReportFiltersAPI = (
  pageType: 'REPRT',
  category: 'EXPNSE' | 'REQEST' | 'CSHADV' | 'EXPREQ',
) =>
  axios.get(`/app-saved-filters/?page_type=${pageType}&category=${category}`);

export const saveReportFilter = (body: any) =>
  axios.post(`/app-saved-filters/`, body);

export const updateReportFilter = (body: any, filterId: number) =>
  axios.put(`/app-saved-filters/${filterId}/`, body);

export const deleteReportFilterAPI = (id: number) =>
  axios.delete(`/app-saved-filters/${id}/`);

export const fetchExpenseTypesAPI = () => {
  return axios.get(`/expense-types/?compact=True`);
};

export const fetchBenefitTypesAPI = () => {
  return axios.get('/benefit-types/?dropdown=true');
};

export const generateSpecializedReportAPI = (id: number, filter: any) => {
  let params = '';
  Object.keys(filter).forEach((item: string, index) =>
    filter[item] !== undefined
      ? (params += `${index === 0 ? '' : '&'}${item}=${filter[item]}`)
      : '',
  );
  return axios.post(`/specialized-report/${id}/generate/?${params}`);
};

export const generateSpecializedBenefitReportAPI = (
  id: number,
  filter: any,
) => {
  let params = '';
  Object.keys(filter).forEach((item: string, index) =>
    filter[item] !== undefined
      ? (params += `${index === 0 ? '' : '&'}${item}=${filter[item]}`)
      : '',
  );
  return axios.post(`/specialized-report/${id}/benefit/?${params}`);
};

export const fetchSpecializedReportTypesAPI = () =>
  axios.get(`/specialized-report/`);
