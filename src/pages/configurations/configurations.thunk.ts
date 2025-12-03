import {
  fetchFtpConfigRecords,
  createUpdateFtpConfigRecord,
  fetchSSOConfiguration,
  createSSOConfiguration,
  fetchNameIdFormatListAPI,
  fetchTimeZoneListAPI,
  fetchTenantListAPI,
  createUpdateTenantConfiguration,
  fetchLanguageListAPI,
  testFtpConfigurationAPI,
  deleteFtpConfigurationAPI,
  getTrafficLightFeatureForTenantFeatureAPI,
} from '../../services/setup/setup';
import { Dispatch } from 'react';
import { message } from 'antd';
import {
  setLoader,
  saveFtpRecords,
  setError,
  setSuccess,
  saveTenantRecords,
  saveSSOConfigs,
  saveNameIdFormats,
  saveTimeZones,
  setDataLoader,
  saveLanguages,
  startTestingConnection,
  saveLoadingMessage,
  setTrafficLightFeatureForTanentFeature,
} from './configurations.actions';

export const fetchFtpConfigList = () => {
  return async (dispatch: Dispatch<any>) => {
    dispatch(setLoader(true));
    try {
      const response = await fetchFtpConfigRecords();
      const data = response.data;
      dispatch(saveFtpRecords(data));
      dispatch(setLoader(false));
    } catch (e) {
      dispatch(setLoader(false));
    }
  };
};

export const createUpdateFtpConfig = (body: any, id?: string) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(setDataLoader(true));
      dispatch(saveLoadingMessage('Updating FTP Configuration'));
      await createUpdateFtpConfigRecord(body, id);
      dispatch(setDataLoader(false));
      dispatch(saveLoadingMessage(''));
      const type = id ? 'updated' : 'created';
      dispatch(setSuccess(`FTP Config ${type} successfully`));
      dispatch(fetchFtpConfigList());
    } catch (e) {
      dispatch(saveLoadingMessage(''));
      dispatch(setDataLoader(false));
      // const data = (e as AxiosError).response?.data;
      // dispatch(setError(data ? data : 'Failed To Update Configuration'));
      message.error('Failed To Update Configuration', 3);
    }
  };
};

export const fetchSSOConfigList = (id?: string) => {
  return async (dispatch: Dispatch<any>) => {
    dispatch(setLoader(true));
    try {
      const response = await fetchSSOConfiguration(id);
      const data = response.data;
      dispatch(saveSSOConfigs(data));
      dispatch(setLoader(false));
    } catch (e) {
      dispatch(setLoader(false));
    }
  };
};

export const createSSOConfigurationItem = (body: any, id: string) => {
  return async (dispatch: Dispatch<any>) => {
    dispatch(setDataLoader(true));
    try {
      dispatch(saveLoadingMessage('Updating SSO Configuration'));
      await createSSOConfiguration(body, id);
      // const response = await createSSOConfiguration(body, id);
      dispatch(setDataLoader(false));
      dispatch(saveLoadingMessage(''));
      const type = id ? 'updated' : 'created';
      dispatch(setSuccess(`SSO Configuration ${type} successfully`));
      dispatch(fetchSSOConfigList());
    } catch (e) {
      dispatch(saveLoadingMessage(''));
      dispatch(setDataLoader(false));
      // const data = (e as AxiosError).response?.data;
      // dispatch(setError(data ? data : 'Failed To Update Configuration'));
      message.error('Failed To Update Configuration', 3);
    }
  };
};

export const fetchNameIdFormatList = () => {
  return async (dispatch: Dispatch<any>) => {
    dispatch(setLoader(true));
    try {
      const data = await fetchNameIdFormatListAPI();
      dispatch(setLoader(false));
      dispatch(saveNameIdFormats(data.data));
    } catch (e) {
      dispatch(setLoader(false));
    }
  };
};

export const fetchTimeZoneList = () => {
  return async (dispatch: Dispatch<any>) => {
    dispatch(setLoader(true));
    try {
      const data = await fetchTimeZoneListAPI();
      dispatch(setLoader(false));
      dispatch(saveTimeZones(data.data));
    } catch (e) {
      dispatch(setLoader(false));
    }
  };
};

export const fetchTenantConfigList = () => {
  return async (dispatch: Dispatch<any>) => {
    dispatch(setLoader(true));
    try {
      const response = await fetchTenantListAPI();
      const data = response.data;
      dispatch(saveTenantRecords(data));
      data[0]?.is_enabled_traffic_lights &&
        dispatch(getTrafficLightFeatureForTenantFeature());
      dispatch(setLoader(false));
    } catch (e) {
      dispatch(setLoader(false));
    }
  };
};

export const createUpdateTenantConfig = (body: any, id?: string) => {
  return async (dispatch: Dispatch<any>) => {
    dispatch(setDataLoader(true));
    try {
      dispatch(saveLoadingMessage('Updating Tenant Configuration'));
      dispatch(setSuccess(''));
      await createUpdateTenantConfiguration(body, id);
      dispatch(setDataLoader(false));
      const type = id ? 'updated' : 'created';
      dispatch(saveLoadingMessage(''));
      dispatch(setSuccess(`Tenant Config ${type} successfully`));
      dispatch(fetchTenantConfigList());
    } catch (e) {
      dispatch(saveLoadingMessage(''));
      dispatch(setDataLoader(false));
      // const data = (e as AxiosError).response?.data;
      // dispatch(setError(data ? data : 'Failed To Update Configuration'));
      message.error('Failed To Update Configuration', 3);
    }
  };
};

export const fetchLanguagesList = () => {
  return async (dispatch: Dispatch<any>) => {
    dispatch(setLoader(true));
    try {
      const response = await fetchLanguageListAPI();
      const data = response.data;
      dispatch(saveLanguages(data));
      dispatch(setLoader(false));
    } catch (e) {
      dispatch(setLoader(false));
    }
  };
};

export const testFtpConnection = (id: string) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(startTestingConnection(true));
      dispatch(setSuccess(''));
      dispatch(setError(''));
      const response = await testFtpConfigurationAPI(id);
      dispatch(setSuccess(response.data.message));
      dispatch(startTestingConnection(false));
    } catch (e) {
      dispatch(startTestingConnection(false));
      const error = e?.response?.data;
      dispatch(setError(error?.error || error?.message || 'Connection failed'));
    }
  };
};

export const deleteFtpConfiguration = (id: number, callback?: Function) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      await deleteFtpConfigurationAPI(id);
      dispatch(setSuccess('FTP configuration deleted.'));
      dispatch(fetchFtpConfigList());
      callback && callback();
    } catch (e) {
      const error = e?.response?.data;
      dispatch(
        setError(
          error?.error ||
            error?.message ||
            'Ftp connection could not be deleted',
        ),
      );
    }
  };
};
export const getTrafficLightFeatureForTenantFeature = () => {
  return async (dispatch: Dispatch<any>) => {
    try {
      let resp = await getTrafficLightFeatureForTenantFeatureAPI();

      let isActiveTrafficLight = false;
      if (resp.status === 204) {
        isActiveTrafficLight = true;
      }
      dispatch(setTrafficLightFeatureForTanentFeature(isActiveTrafficLight));
    } catch (e) {}
  };
};
