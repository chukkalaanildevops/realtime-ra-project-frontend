import { Dispatch } from 'react';
import {
  setLoader,
  setIsEntTenant,
  setLoadingMessage,
  setError,
  saveTenantConfig,
  saveToken,
  saveTenant,
  saveUserData,
  saveJobInformation,
  userLogout,
  saveUsers,
  updateLoaderForUser,
} from './auth.actions';
import { setLocalization } from '../../../pages/dashboard/dashboard.actions';

import {
  getTenantConfigurationAPI,
  loginAPI,
  validateTokenAPI,
  logoutUserAPI,
  initSSOAPI,
  fetchEmpJobInformation,
  verifyTenantAPI,
} from '../../../services/auth';
import { fetchUserLangAPI, setUserLangAPI } from '../../../services/language';
import { CONSTANTS, AUTH_TYPES } from './auth.model';
import { fetchCurrentDelegateUser } from '../../../pages/delegate/delegate.thunk';
import {
  fetchUsersService,
  fetchUsersServiceForFilters,
} from '../../../services/users';
import { stateInterface } from '../rootReducer';

export const apiStart = (loading: boolean, message = '') => {
  return async (dispatch: Dispatch<any>) => {
    dispatch(setLoader(loading));
    dispatch(setLoadingMessage(message));
  };
};

// export const checkTenant = (tenant: string) => {
//   return async (dispatch: Dispatch<any>) => {
//     try {
//       dispatch(apiStart(true, 'Validating tenant'));
//       dispatch(setError(''));
//       const response = await checkTenantAPI(tenant);
//       const data = response.data;
//       dispatch(saveTenant(data.schema_name));
//       dispatch(fetchTenantConfiguration());
//       dispatch(apiStart(false));
//     } catch (e) {
//       dispatch(saveTenant(''));
//       const error = e as AxiosError;
//       if (error.response && error.response.status === 404) {
//         dispatch(apiStart(false));
//         dispatch(setError('Invalid tenant'));
//       } else {
//         dispatch(apiStart(false));
//         dispatch(setError('Something wrong'));
//       }
//     }
//   };
// };

export const verifyTenant = (tenant: string) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(setError(''));
      const response = await verifyTenantAPI(tenant);
      const data = response.data;
      dispatch(setIsEntTenant(true));
      dispatch(saveTenant(tenant));
      return Promise.resolve(data);
    } catch (e) {
      dispatch(saveTenant(''));
      dispatch(setIsEntTenant(false));
      return Promise.reject();
    }
  };
};

export const fetchTenantConfiguration = () => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(apiStart(true, 'Loading tenant configuration'));
      const response = await getTenantConfigurationAPI();
      const data = response.data[0];
      if (data.authentication_type.code === AUTH_TYPES.SSO) {
        dispatch(fetchSsoUrl());
      }
      const object = {
        id: data.id,
        authenticationType: data.authentication_type.code,
      };
      dispatch(saveTenantConfig(object));
      dispatch(apiStart(false));
    } catch (e) {
      dispatch(apiStart(false));
    }
  };
};

export const loginUser = (
  reqData: any,
  callback?: (isSuccess: boolean) => void,
) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(setError(''));
      dispatch(apiStart(true, 'Validating User'));
      const response = await loginAPI(reqData);
      const data = response.data;
      dispatch(fetchTenantConfiguration());
      dispatch(apiStart(false));
      dispatch(saveToken(data.token));
      dispatch(saveUserData(data.user));
      dispatch(fetchJobInfo(data.user?.id));
      dispatch(fetchLanguageForUser(data.user?.id));
      dispatch(fetchUsersForDD());
      sessionStorage.removeItem('isRedirected');
      callback && callback(true);
    } catch (e) {
      dispatch(apiStart(false));
      dispatch(setError('Login failed'));
      callback && callback(false);
    }
  };
};

export const logoutUser = (callBack?: Function) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(apiStart(true, 'Logout'));
      const sId = sessionStorage.getItem('sId');
      let response: any;
      if (sessionStorage.getItem('TOKEN') !== null) {
        if (sId === null) {
          response = await logoutUserAPI();
        } else {
          response = await logoutUserAPI({ sId: sId });
        }
      }
      dispatch(apiStart(false));
      if (response?.data?.redirection_url) {
        // setTimeout(function(){window.location.href = response?.data?.redirection_url} , 1000);
        // window.location.href = response?.data?.redirection_url; // SSO lout redirection
        // dispatch(userLogout());
        const object = {
          slo_url: response?.data?.redirection_url,
        };
        dispatch(saveTenantConfig(object));
        if (callBack) callBack();
      } else {
        dispatch(saveToken(''));
        dispatch(saveUserData(undefined));
        dispatch(userLogout());
        if (callBack) callBack();
      }
    } catch (e) {
      dispatch(apiStart(false));
      dispatch(setError('Logout failed'));
    }
  };
};

export const validateToken = () => {
  return async (dispatch: Dispatch<any>) => {
    try {
      const response = await validateTokenAPI();
      dispatch(fetchJobInfo(response.data.id));
      dispatch(fetchLanguageForUser(response.data.id));
      dispatch(saveUserData(response.data));
      dispatch(fetchUsersForDD());
      sessionStorage.removeItem('isRedirected');
    } catch (e) {
      // dispatch(saveToken(''));
      dispatch(saveUserData(undefined));
      // setGlobalToken("")
    }
  };
};
export const fetchLanguageForUser = (userID: any) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      const response = await fetchUserLangAPI(userID);
      dispatch(setLocalization(response?.data?.language?.code));
    } catch (e) {
      // dispatch(setLocalization('en'));
    }
  };
};
export const setLanguageForUser = (lang: any, userID: any) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      await setUserLangAPI(lang, userID);
      dispatch(setLocalization(lang));
    } catch (e) {
      // dispatch(setLocalization('en'));
    }
  };
};
export const restoreData = () => {
  return (dispatch: Dispatch<any>) => {
    try {
      const token = sessionStorage.getItem(CONSTANTS.TOKEN) || '';
      dispatch(saveToken(token));
      const tenant = localStorage.getItem(CONSTANTS.TENANT) || '';
      dispatch(saveTenant(tenant));
      // const userData = sessionStorage.getItem(CONSTANTS.USER_DATA);
      // if (userData) {
      //   const user = JSON.parse(userData);
      //   dispatch(saveUserData(user));
      // }
      if (token) {
        dispatch(validateToken());
      }
      const delegateUser = sessionStorage.getItem(CONSTANTS.DELEGATE_USER);
      if (delegateUser) {
        const user = JSON.parse(delegateUser);
        if (user?.on_behalf_of?.id) {
          dispatch(fetchCurrentDelegateUser(user.on_behalf_of.id));
        }
      }
    } catch (e) {}
  };
};

export const fetchSsoUrl = () => {
  return async (dispatch: Dispatch<any>) => {
    try {
      const response = await initSSOAPI();
      const obj = {
        sso_url: response.data.url,
      };
      dispatch(saveTenantConfig(obj));
    } catch (e) {}
  };
};

export const fetchJobInfo = (id: string) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      const response = await fetchEmpJobInformation(id);
      dispatch(saveJobInformation(response.data));
    } catch (e) {}
  };
};

export const fetchUsersForDD = (forceFetch: boolean = false) => {
  return async (dispatch: Dispatch<any>, getState: () => stateInterface) => {
    try {
      const { areUsersFetched } = getState().auth;
      if (forceFetch || !areUsersFetched) {
        dispatch(updateLoaderForUser(true));
        const response = await fetchUsersService(true, true);
        dispatch(saveUsers(response.data));
        dispatch(updateLoaderForUser(false));
      }
    } catch (e) {
      dispatch(updateLoaderForUser(false));
    }
  };
};

export const fetchUsersForDDForFilters = () => {
  return async (dispatch: Dispatch<any>) => {
    try {
      const response = await fetchUsersServiceForFilters(true, true);
      dispatch(saveUsers(response.data));
    } catch (e) {}
  };
};
