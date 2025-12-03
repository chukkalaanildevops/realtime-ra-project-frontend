import Axios from '../../utils/reimAxios.utils';
import { AxiosRequestConfig } from 'axios';

export const fetchUsersService = (
  dropdown: boolean = true,
  with_empid?: boolean,
  q?: string,
  _config?: AxiosRequestConfig,
  limit?: number,
) => {
  let baseUrl = '/users/';

  let params: { [key: string]: any } = {};

  if (dropdown === true) {
    params['dropdown'] = 'true';
  }

  if (q !== undefined && q.trim().length > 0) {
    params['q'] = q;
  }

  if (with_empid !== undefined && with_empid === true) {
    params['with_empid'] = 'true';
  }

  if (limit !== undefined && typeof limit === 'number') {
    params['limit'] = limit;
  }
  params['is_active'] = 'yes';
  if (Object.keys(params).length > 0) {
    let config: AxiosRequestConfig = { ..._config, params: params };
    return Axios.get(baseUrl, config);
  }
  return Axios.get(baseUrl);
};

export const fetchUsersServiceForFilters = (
  dropdown: boolean = true,
  with_empid?: boolean,
  q?: string,
  _config?: AxiosRequestConfig,
  limit?: number,
) => {
  let baseUrl = '/users/';

  let params: { [key: string]: any } = {};

  if (dropdown === true) {
    params['dropdown'] = 'true';
  }

  if (q !== undefined && q.trim().length > 0) {
    params['q'] = q;
  }

  if (with_empid !== undefined && with_empid === true) {
    params['with_empid'] = 'true';
  }

  if (limit !== undefined && typeof limit === 'number') {
    params['limit'] = limit;
  }

  if (Object.keys(params).length > 0) {
    let config: AxiosRequestConfig = { ..._config, params: params };
    return Axios.get(baseUrl, config);
  }
  return Axios.get(baseUrl);
};

export const fetchUserProfileService = (userId: number) => {
  return Axios.get(`/users/${userId}/`);
};
