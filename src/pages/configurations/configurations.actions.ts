export const FTP_ACTION_TYPES = {
  GET_DATA: 'FTP_ACTION_TYPES/GET_DATA',
  SAVE_FTP_RECORDS: 'FTP_ACTION_TYPES/SAVE_FTP_RECORDS',
  SAVE_TENANT_RECORDS: 'FTP_ACTION_TYPES/SAVE_TENANT_RECORDS',
  SAVE_SSO_CONFIGS: 'FTP_ACTION_TYPES/SAVE_SSO_CONFIGS',
  SET_ERROR: 'FTP_ACTION_TYPES/SET_ERROR',
  SET_LOADING: 'FTP_ACTION_TYPES/SET_LOADING',
  SET_SUCCESS: 'FTP_ACTION_TYPES/SET_SUCCESS',
  SAVE_NAME_ID_FORMATS: 'FTP_ACTION_TYPES/SAVE_NAME_ID_FORMATS',
  SAVE_TIME_ZONES: 'FTP_ACTION_TYPES/SAVE_TIME_ZONES',
  SAVE_DATA_LOADER: 'FTP_ACTION_TYPES/SAVE_DATA_LOADER',
  SAVE_LANGUAGES: 'FTP_ACTION_TYPES/SAVE_LANGUAGES',
  SET_TESTING_CONNECTION: 'FTP_ACTION_TYPES/SET_TESTING_CONNECTION',
  SAVE_LOADING_MESSAGE: 'FTP_ACTION_TYPES/SAVE_LOADING_MESSAGE',
};

export const SSO_ACTION_TYPES = {
  UPDATE_ACTIVE_KEY: 'UPDATE_ACTIVE_KEY',
};

export const SET_TRAFFIC_LIGHT_FEATURE_FOR_TENANT_FEATURES =
  'SET_TRAFFIC_LIGHT_FEATURE_FOR_TENANT_FEATURES';

export const saveFtpRecords = (data: any[]) => ({
  type: FTP_ACTION_TYPES.SAVE_FTP_RECORDS,
  payload: data,
});

export const saveTenantRecords = (data: any[]) => ({
  type: FTP_ACTION_TYPES.SAVE_TENANT_RECORDS,
  payload: data,
});

export const saveSSOConfigs = (data: any[]) => ({
  type: FTP_ACTION_TYPES.SAVE_SSO_CONFIGS,
  payload: data,
});

export const setError = (error: string) => ({
  type: FTP_ACTION_TYPES.SET_ERROR,
  payload: error,
});

export const setSuccess = (message: string) => ({
  type: FTP_ACTION_TYPES.SET_SUCCESS,
  payload: message,
});

export const setLoader = (isLoading: boolean) => ({
  type: FTP_ACTION_TYPES.SET_LOADING,
  payload: isLoading,
});

export const saveNameIdFormats = (data: any[]) => ({
  type: FTP_ACTION_TYPES.SAVE_NAME_ID_FORMATS,
  payload: data,
});

export const saveTimeZones = (data: any[]) => ({
  type: FTP_ACTION_TYPES.SAVE_TIME_ZONES,
  payload: data,
});

export const setDataLoader = (isLoading: boolean) => ({
  type: FTP_ACTION_TYPES.SAVE_DATA_LOADER,
  payload: isLoading,
});

export const saveLanguages = (data: any[]) => ({
  type: FTP_ACTION_TYPES.SAVE_LANGUAGES,
  payload: data,
});
export const startTestingConnection = (status: boolean) => ({
  type: FTP_ACTION_TYPES.SET_TESTING_CONNECTION,
  payload: status,
});
export const saveLoadingMessage = (loadingMessage: string) => ({
  type: FTP_ACTION_TYPES.SAVE_LOADING_MESSAGE,
  payload: loadingMessage,
});
export const setTrafficLightFeatureForTanentFeature = (status: boolean) => ({
  type: SET_TRAFFIC_LIGHT_FEATURE_FOR_TENANT_FEATURES,
  payload: status,
});
