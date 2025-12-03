import { ISFIntegrationState, IJobLogs } from './sfIntegration.model';
import { SF_INTEGRATION_ACTIONS } from './sfIntegration.actions';

export const initialState: ISFIntegrationState = {
  fileToModel: [],
  legal_entity_types: [],
  schedule: {},
  sfIntegrationJobs: [],
  loader: false,
  error: '',
  success: '',
  loadingMessage: '',
  stages: {} as IJobLogs,
  ftpServers: [],
  activeTab: '1',
  fileLogs: [],
  isDataSubmitting: false,
  currentJob: {},
};

export default (state = initialState, action: any) => {
  const { type, payload } = action;
  switch (type) {
    case SF_INTEGRATION_ACTIONS.SAVE_ENTITY_TYPES:
      return { ...state, legal_entity_types: payload };
    case SF_INTEGRATION_ACTIONS.SAVE_FILE_TO_MODEL_MAPPING:
      return { ...state, fileToModel: payload };
    case SF_INTEGRATION_ACTIONS.SAVE_SCHEDULE:
      return { ...state, schedule: payload };
    case SF_INTEGRATION_ACTIONS.SAVE_INTEGRATION_JOBS:
      return { ...state, sfIntegrationJobs: payload };
    case SF_INTEGRATION_ACTIONS.SET_LOADING:
      return { ...state, loader: payload };
    case SF_INTEGRATION_ACTIONS.SET_SUCCESS:
      return { ...state, success: payload };
    case SF_INTEGRATION_ACTIONS.SET_ERROR:
      return { ...state, error: payload };
    case SF_INTEGRATION_ACTIONS.RESET_MESSAGES:
      return { ...state, error: '', success: '', loader: false };
    case SF_INTEGRATION_ACTIONS.SET_LOADING_MESSAGE:
      return { ...state, loadingMessage: payload };
    case SF_INTEGRATION_ACTIONS.SAVE_STAGES:
      return { ...state, stages: payload };
    case SF_INTEGRATION_ACTIONS.SET_CURRENT_JOB:
      return { ...state, currentJob: payload };
    case SF_INTEGRATION_ACTIONS.SAVE_FILE_CONFIG:
      return {
        ...state,
        fileConfig: payload,
      };
    case SF_INTEGRATION_ACTIONS.SET_ACTIVE_TAB:
      return {
        ...state,
        activeTab: payload,
      };
    case SF_INTEGRATION_ACTIONS.SAVE_FILE_LOGS:
      return {
        ...state,
        fileLogs: payload,
      };
    case SF_INTEGRATION_ACTIONS.SET_DATA_SUBMITTING_LOADER:
      return {
        ...state,
        isDataSubmitting: payload,
      };
    // case SF_INTEGRATION_ACTIONS.SAVE_FTP_SERVERS:
    //   return {
    //     ...state,
    //     ftpServers: payload,
    //   };
    default:
      return state;
  }
};

export const getLegalEntities = (state: ISFIntegrationState) =>
  state.loader ? new Array(15).fill({}) : state.legal_entity_types;
export const getFileToModelMapping = (state: ISFIntegrationState) =>
  state.loader ? new Array(15).fill({}) : state.fileToModel;
export const getSchedule = (state: ISFIntegrationState) => state.schedule;

export const getSFIntegrationJobs = (state: ISFIntegrationState) =>
  state.sfIntegrationJobs;

export const getLoader = (state: ISFIntegrationState) => state.loader;

export const getSuccess = (state: ISFIntegrationState) => state.success;

export const getError = (state: ISFIntegrationState) => state.error;

export const getLoadingMessage = (state: ISFIntegrationState) =>
  state.loadingMessage;

export const getStages = (state: ISFIntegrationState) => state.stages;

export const getFileConfiguration = (state: ISFIntegrationState) =>
  state.fileConfig;

export const getActiveTab = (state: ISFIntegrationState) => state.activeTab;

export const getFileLogs = (state: ISFIntegrationState) =>
  state.loader ? new Array(15).fill({}) : state.fileLogs;
// export const getFtpServers = (state: ISFIntegrationState) => state.ftpServers;
export const getDataSubmittingLoader = (state: ISFIntegrationState) =>
  state.isDataSubmitting;

export const getCurrentJob = (state: ISFIntegrationState) => state.currentJob;
