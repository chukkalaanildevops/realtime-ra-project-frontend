import {
  FTP_ACTION_TYPES,
  SET_TRAFFIC_LIGHT_FEATURE_FOR_TENANT_FEATURES,
  SSO_ACTION_TYPES,
} from './configurations.actions';
import { ISettingsConfigurationState } from './configurations.model';

export const initialState: ISettingsConfigurationState = {
  activeKey: '1',
  error: '',
  success: '',
  ftpRecords: [],
  tenantConfig: [],
  ssoConfigRecords: [],
  nameIdFormats: [],
  loader: false,
  timeZoneList: [],
  dataSaveLoader: false,
  languagesList: [],
  testingConnection: false,
  isBenefitEnable: false,
  isAllowanceEnable: false,
  loadingMessage: '',
  isEnableTrafficLightFeatureForTenantFeatures: false,
};

export default (state = initialState, action: any) => {
  const { payload, type } = action;

  switch (type) {
    case FTP_ACTION_TYPES.SAVE_FTP_RECORDS:
      return {
        ...state,
        success: '',
        error: '',
        ftpRecords: payload,
      };
    case FTP_ACTION_TYPES.SAVE_SSO_CONFIGS:
      return {
        ...state,
        ssoConfigRecords: payload,
      };
    case FTP_ACTION_TYPES.SET_ERROR:
      return {
        ...state,
        error: payload,
      };
    case FTP_ACTION_TYPES.SET_SUCCESS:
      return {
        ...state,
        error: '',
        success: payload,
      };
    case FTP_ACTION_TYPES.SAVE_TENANT_RECORDS:
      return {
        ...state,
        tenantConfig: payload,
        isBenefitEnable: payload[0]?.is_enabled_benefits,
        isAllowanceEnable: payload[0]?.is_enabled_allowance,
      };
    case FTP_ACTION_TYPES.SAVE_NAME_ID_FORMATS:
      return {
        ...state,
        nameIdFormats: payload,
      };
    case FTP_ACTION_TYPES.SET_LOADING:
      return {
        ...state,
        loader: payload,
      };
    case FTP_ACTION_TYPES.SAVE_TIME_ZONES:
      return {
        ...state,
        timeZoneList: payload,
      };
    case SSO_ACTION_TYPES.UPDATE_ACTIVE_KEY:
      return {
        ...state,
        ...payload,
      };
    case FTP_ACTION_TYPES.SAVE_DATA_LOADER:
      return {
        ...state,
        dataSaveLoader: payload,
      };
    case FTP_ACTION_TYPES.SAVE_LANGUAGES:
      return {
        ...state,
        languagesList: payload,
      };
    case FTP_ACTION_TYPES.SET_TESTING_CONNECTION:
      return {
        ...state,
        testingConnection: payload,
      };
    case FTP_ACTION_TYPES.SAVE_LOADING_MESSAGE:
      return {
        ...state,
        loadingMessage: payload,
      };
    case SET_TRAFFIC_LIGHT_FEATURE_FOR_TENANT_FEATURES:
      return {
        ...state,
        isEnableTrafficLightFeatureForTenantFeatures: payload,
      };
    default:
      return state;
  }
};

export const getFtpConfigRecords = (state: ISettingsConfigurationState) =>
  state.ftpRecords;

export const getTenantConfigRecords = (state: ISettingsConfigurationState) =>
  state.tenantConfig;

export const getIsBenefitEnabled = (state: ISettingsConfigurationState) =>
  state.isBenefitEnable;

export const getIsAllowancesEnabled = (state: ISettingsConfigurationState) =>
  state.isAllowanceEnable;

export const getSSOConfigRecords = (state: ISettingsConfigurationState) =>
  state.ssoConfigRecords;

export const getErrorMessage = (state: ISettingsConfigurationState) =>
  state.error;

export const getSuccessMessage = (state: ISettingsConfigurationState) =>
  state.success;

export const getNameIdFormats = (state: ISettingsConfigurationState) =>
  state.nameIdFormats;

export const getLoaderStatus = (state: ISettingsConfigurationState) =>
  state.loader;

export const getTimeZones = (state: ISettingsConfigurationState) =>
  state.timeZoneList;

export const getSaveDataLoader = (state: ISettingsConfigurationState) =>
  state.dataSaveLoader;

export const getLanguages = (state: ISettingsConfigurationState) =>
  state.languagesList;
export const getTestingStatus = (state: ISettingsConfigurationState) =>
  state.testingConnection;
