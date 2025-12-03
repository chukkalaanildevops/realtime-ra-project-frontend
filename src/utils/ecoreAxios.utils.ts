import axios, { AxiosInstance, AxiosResponse } from 'axios';
import * as axiosRetry from 'retry-axios';

import { saveToken, userLogout } from '../shared/redux/auth/auth.actions';
import { apiCallError, resetAllData } from '../pages/app/app.actions';
import { saveCurrentDelegateUser } from '../pages/delegate/delegate.action';
// import Store from '../shared/redux/store/store.index';
import uuid from 'react-uuid';

let CancelToken = axios.CancelToken;
const env = process.env.REACT_APP_ENVIRONMENT || 'SAP_PRODUCTION';
// const apiVersion = process.env[`REACT_APP_${env}_API_VERSION`];

const url = false
  ? 'https://c3ba-203-115-79-221.ngrok.io/'
  : process.env[`REACT_APP_ECORE_${env}_API_BASE_URL`];

// const url = 'https://33b6-203-115-79-221.ngrok.io/';

const Instance: AxiosInstance = axios.create({
  baseURL: `${url}api/`,
});

export const tenantAxios: AxiosInstance = axios.create({
  baseURL: url,
});

Instance.interceptors.request.use(
  config => {
    // you can cancel request by writing this 'window.reimAPICancelToken('Message');'.
    // below we are adding unique cancel token for every new request.
    // 'window.reimAPICancelToken' in this we are only storing the last request call cancel referance.

    // const Auth = Store.getState()?.auth;
    // if (
    //   config.headers.common.Authorization === undefined &&
    //   Auth.token.accessToken &&
    //   Auth.token.refreshToken &&
    //   process.env.REACT_APP_IS_REIMBURSE_V2 === 'true'
    // ) {
    //   config.headers.common[
    //     'Authorization'
    //   ] = `Bearer ${Auth.token.accessToken}`;
    //   config.headers.common['REFRESH-TOKEN'] = `${Auth.token.refreshToken}`;
    //   config.headers.common['X-DTS-SCHEMA'] = `${Auth.tenant}`;
    // }
    config.headers.common['X-Client'] = 'reim-web';
    config.headers.common['X-Correlation-Id'] = uuid();
    CancelToken = axios.CancelToken;
    return {
      ...config,
      cancelToken: config.cancelToken
        ? config.cancelToken
        : new CancelToken(function executor(c) {
            // An executor function receives a cancel function as a parameter
            (window as any).reimAPICancelToken = c;
          }),
    };
  },
  error => {
    return Promise.reject(error);
  },
);

Instance.interceptors.response.use(
  response => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    let data: any = {};
    if (response.status !== 204) {
      data = response.data;
    }
    remove500Error();
    return { ...response, data: data };
  },
  error => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    let message: string = error.message || '';
    if (error.response !== undefined) {
      switch (error.response.status) {
        case 401:
          try {
            const store = require('../shared/redux/store/store.index').default;
            store.dispatch(userLogout());
            store.dispatch(saveToken(''));
          } catch (e) {
            console.error(e);
          }
          remove500Error();
          // this.dispatchLogoutForUnauthorizedUser();
          break;

        case 403:
          if (error.response.data.detail === 'PROXY_INVALID') {
            const store = require('../shared/redux/store/store.index').default;
            store.dispatch(resetAllData());
            store.dispatch(saveCurrentDelegateUser(undefined));
          }
          message = 'You are unauthorised to perform this action';
          remove500Error();
          break;

        case 404:
          message = 'Requested resource is unavailable';
          remove500Error();
          break;

        case 500:
          const method = error.config.method;
          if (method === 'get') {
            const store = require('../shared/redux/store/store.index').default;
            store.dispatch(
              apiCallError({
                message: 'Failed to fetch data',
              }),
            );
          }
          break;
        case 502:
          if (axiosRetry.getConfig(error)?.currentRetryAttempt === 2) {
            const store = require('../shared/redux/store/store.index').default;
            store.dispatch(
              apiCallError({
                message: 'Network error!',
              }),
            );
          }
      }
    } else if (axios.isCancel(error)) {
      message = error.message || '';
    } else if (error.isAxiosError && error.message === 'Network Error') {
      const store = require('../shared/redux/store/store.index').default;
      store.dispatch(
        apiCallError({
          message: 'Network error!',
        }),
      );
    } else {
      message = 'Resource server is unreachable';
    }
    return Promise.reject({ ...error, message: message });
  },
);

function remove500Error() {
  const store = require('../shared/redux/store/store.index').default;
  store.dispatch(apiCallError());
}

/**
 * @param url
 * @returns { Promise<AxiosResponse<any>> }- axios response
 */
export function axiosGet(url: string): Promise<AxiosResponse<any>> {
  return Instance.get(url);
}

/**
 * @param url {string}
 * @param body {any}
 * @returns {Promise<AxiosResponse<any>>} - axios response.
 */
export function axiosPost(url: string, body: any): Promise<AxiosResponse<any>> {
  return Instance.post(url, body);
}

/**
 * This function add/update authorizational token in axios instance header.
 * @param token
 * @returns {void}
 */
export const setGlobalToken = (token: any): void => {
  if (token) {
    if (process.env.REACT_APP_IS_REIMBURSE_V2 === 'true') {
      Instance.defaults.headers.common[
        'Authorization'
      ] = `Bearer ${token.accessToken}`;
      Instance.defaults.headers.common[
        'REFRESH-TOKEN'
      ] = `${token.refreshToken}`;
    } else {
      Instance.defaults.headers.common['Authorization'] = `Token ${token}`;
    }
  } else {
    if (process.env.REACT_APP_IS_REIMBURSE_V2 === 'true') {
      delete Instance.defaults.headers.common['Authorization'];
      delete Instance.defaults.headers['REFRESH-TOKEN'];
    } else {
      delete Instance.defaults.headers.common['Authorization'];
    }
  }
};

export const setGlobalTenant = (tenant: string) => {
  if (tenant) {
    Instance.defaults.headers.common['X-DTS-SCHEMA'] = tenant;
  } else {
    delete Instance.defaults.headers.common['X-DTS-SCHEMA'];
  }
};

export const setGlobalDelegationId = (delegationId: number): void => {
  if (delegationId) {
    Instance.defaults.headers.common['delegation'] = delegationId;
  } else {
    delete Instance.defaults.headers.common['delegation'];
  }
};

export const resetAxios = (): void => {
  delete Instance.defaults.headers.common['delegation'];
  delete Instance.defaults.headers.common['Authorization'];
  axiosRetry.detach(interceptorId);
};

Instance.defaults.raxConfig = {
  statusCodesToRetry: [[502, 502]],
  instance: Instance,
  retry: 2,
  httpMethodsToRetry: ['GET', 'DELETE', 'PUT'],
};

const interceptorId = axiosRetry.attach(Instance);

export default Instance;
