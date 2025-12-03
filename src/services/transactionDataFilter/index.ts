import Axios from '../../utils/reimAxios.utils';
import { generateQueryParamsString } from '../../utils/global.utils';
import { AxiosRequestConfig } from 'axios';

export const getExpenseTypesForFiltersService = (cancelToken?: any) => {
  let config: AxiosRequestConfig = {
    cancelToken,
  };
  return Axios.get('/expense-types/?compact=True', config);
};

export const getBenefitTypesForFiltersService = (cancelToken?: any) => {
  let config: AxiosRequestConfig = {
    cancelToken,
  };
  return Axios.get('/benefit-types/?dropdown=true', config);
};
export const getEntitlementPeriodAPI = (cancelToken?: any) => {
  let config: AxiosRequestConfig = {
    cancelToken,
  };
  return Axios.get('/benefit-types/choices/?choice=entitlement_period', config);
};
export const getRequestTypesForFiltersService = (cancelToken?: any) => {
  let config: AxiosRequestConfig = {
    cancelToken,
  };
  return Axios.get('/request-types/?compact=True', config);
};

export const fetchSavedFiltersService = (parameters: {
  [key: string]: string;
}) => {
  return Axios.get(
    `/app-saved-filters/?${generateQueryParamsString(parameters)}`,
  );
};

export const saveFilterService = (body: any) => {
  return Axios.post(`/app-saved-filters/`, body);
};

export const updateFilterService = (body: any, filterId: number) => {
  return Axios.put(`/app-saved-filters/${filterId}/`, body);
};

export const deleteFilterService = (id: number) => {
  return Axios.delete(`/app-saved-filters/${id}/`);
};

export const fetchTopLevelLegalEntity = (cancelToken?: any) => {
  let config: AxiosRequestConfig = {
    cancelToken,
  };
  return Axios.get(`/legal-entities/?top_level=true`, config);
};
