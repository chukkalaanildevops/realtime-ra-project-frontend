import axios from '../../utils/reimAxios.utils';
import { generateQueryParamsString } from '../../utils/global.utils';

const BASE_URL = '/proxies/';

export const fetchDelegatedRecordsAPI = (queryParameters: {
  [key: string]: any;
}) =>
  axios.get(BASE_URL, {
    params: queryParameters,
    paramsSerializer: params => generateQueryParamsString(params),
  });

export const addNewDelegateAPI = (data: any) => axios.post(BASE_URL, data);

export const updateDelegateAPI = (data: any, id: number) =>
  axios.put(`${BASE_URL}${id}/`, data);

export const fetchProxyPermissionsAPI = () =>
  axios.get(`/permissions/?proxy=true`);

export const deleteDelegateAPI = (id: number) =>
  axios.delete(`${BASE_URL}${id}/`);

export const toggleDelegationActiveStatusAPI = (
  id: number,
  isActive: boolean,
) => axios.patch(`${BASE_URL}${id}/mark-active/`, { is_active: isActive });
