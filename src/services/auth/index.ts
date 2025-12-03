import axios, { tenantAxios } from '../../utils/reimAxios.utils';
import uuid from 'react-uuid';
// import axiosTenant from 'axios';

// export const checkTenantAPI = (tenant: string) => {
//   const config = {
//     headers: {
//       'X-Client': 'reim-web',
//       'X-Correlation-Id': uuid(),
//     },
//   };
//   const key = process.env.REACT_APP_CHECK_TENANT_KEY;
//   return tenantAxios.post(
//     `/tenants/check-tenant/?p=${key}`,
//     {
//       tenant,
//     },
//     config,
//   );
// };

export const verifyTenantAPI = (tenant: string) => {
  const config = {
    headers: {
      'X-Client': 'reim-web',
      'X-Correlation-Id': uuid(),
    },
  };
  const key = process.env.REACT_APP_CHECK_TENANT_KEY;
  return tenantAxios.post(
    `/tenants/verify-tenant/?p=${key}`,
    {
      tenant,
    },
    config,
  );
};

export const getTenantConfigurationAPI = () =>
  axios.get('/tenant-configurations/');

export const validateTokenAPI = () => axios.get('/users/fetch-using-token/');

export const logoutAllDevicesAPI = () => axios.post('/auth/logout-all/');

export const logoutUserAPI = (data?: { [key: string]: any }) => {
  if (data !== undefined) {
    return axios.post('/auth/logout/', data);
  }
  return axios.post('/auth/logout/');
};

export const loginAPI = (reqData: any) => axios.post('/auth/login/', reqData);

export const initSSOAPI = () => axios.get('/sso/init-sso/');

export const fetchEmpJobInformation = (id: string) =>
  axios.get(`/users/${id}/employee-job-information/`);
