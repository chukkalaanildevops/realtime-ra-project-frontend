import axios from '../../utils/reimAxios.utils';
// import axios from '../../../utils/axios';

export const fetchFtpConfigRecords = () => axios.get('ftp-configurations/');

export const createUpdateFtpConfigRecord = (body: any, id?: string) => {
  if (id) {
    return axios.put(`ftp-configurations/${id}/`, body);
  } else {
    return axios.post('ftp-configurations/', body);
  }
};

// export const fetchTenantConfiguration = () => axios.get('tenants/');

export const fetchSSOConfiguration = (id?: string) => {
  const idString = id ? id + '/' : '';
  return axios.get('sso-configurations/' + idString);
};

export const createSSOConfiguration = (body: any, id: string) => {
  const idString = id ? id + '/' : '';

  if (id) {
    return axios.put('sso-configurations/' + idString, body);
  } else {
    return axios.post('sso-configurations/' + idString, body);
  }
};

export const fetchNameIdFormatListAPI = () => {
  return axios.get('sso-configurations/choices/?choice=name_id_format');
};

export const fetchTimeZoneListAPI = () => axios.get('timezones/');

export const createUpdateTenantConfiguration = (body: any, id?: string) => {
  if (id) {
    return axios.put('tenant-configurations/' + id + '/', body);
  } else {
    return axios.post('tenant-configurations/', body);
  }
};

export const fetchTenantListAPI = () => axios.get('tenant-configurations/');

export const fetchLanguageListAPI = () => axios.get('/languages/');
export const testFtpConfigurationAPI = (id: string) =>
  axios.post(`ftp-configurations/${id}/test-ftp-connection/`);

export const deleteFtpConfigurationAPI = (id: number) =>
  axios.delete(`ftp-configurations/${id}/`);

export const getTrafficLightFeatureForTenantFeatureAPI = () =>
  axios.get(`tenant-features/check-flag/?code=TRFLGT2`);
