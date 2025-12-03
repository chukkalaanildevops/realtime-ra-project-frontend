export const SF_INTEGRATION_ACTIONS = {
  SET_LOADING: 'SF_INTEGRATION_ACTIONS/SET_LOADING',
  SAVE_ENTITY_TYPES: 'SF_INTEGRATION_ACTIONS/SAVE_ENTITY_TYPES',
  SAVE_FILE_TO_MODEL_MAPPING:
    'SF_INTEGRATION_ACTIONS/SAVE_FILE_TO_MODEL_MAPPING',
  SAVE_SCHEDULE: 'SF_INTEGRATION_ACTIONS/SAVE_SCHEDULE',
  SAVE_INTEGRATION_JOBS: 'SF_INTEGRATION_ACTIONS/SAVE_INTEGRATION_JOBS',
  SET_SUCCESS: 'SF_INTEGRATION_ACTIONS/SET_SUCCESS',
  SET_ERROR: 'SF_INTEGRATION_ACTIONS/SET_ERROR',
  RESET_MESSAGES: 'SF_INTEGRATION_ACTIONS/RESET_MESSAGES',
  SET_LOADING_MESSAGE: 'SF_INTEGRATION_ACTIONS/SET_LOADING_MESSAGE',
  SAVE_STAGES: 'SF_INTEGRATION_ACTIONS/SAVE_STAGES',
  SAVE_FILE_CONFIG: 'SF_INTEGRATION_ACTIONS/SAVE_FILE_CONFIG',
  SET_ACTIVE_TAB: 'SF_INTEGRATION_ACTIONS/SET_ACTIVE_TAB',
  SAVE_FILE_LOGS: 'SF_INTEGRATION_ACTIONS/SAVE_FILE_LOGS',
  SET_DATA_SUBMITTING_LOADER:
    'SF_INTEGRATION_ACTIONS/SET_DATA_SUBMITTING_LOADER',
  SET_CURRENT_JOB: 'SF_INTEGRATION_ACTIONS/SET_CURRENT_JOB',
  // SAVE_FTP_SERVERS: 'SF_INTEGRATION_ACTIONS/SAVE_FTP_SERVERS',
};

export const setLoader = (isLoading: boolean) => ({
  type: SF_INTEGRATION_ACTIONS.SET_LOADING,
  payload: isLoading,
});

export const saveEntityTypes = (data: any[]) => ({
  type: SF_INTEGRATION_ACTIONS.SAVE_ENTITY_TYPES,
  payload: data,
});

export const saveFileToModelMapping = (data: any[]) => ({
  type: SF_INTEGRATION_ACTIONS.SAVE_FILE_TO_MODEL_MAPPING,
  payload: data,
});

export const saveSchedule = (data: any) => ({
  type: SF_INTEGRATION_ACTIONS.SAVE_SCHEDULE,
  payload: data,
});

export const saveIntegrationJobs = (data: any[]) => ({
  type: SF_INTEGRATION_ACTIONS.SAVE_INTEGRATION_JOBS,
  payload: data,
});

export const setSuccess = (data: string) => ({
  type: SF_INTEGRATION_ACTIONS.SET_SUCCESS,
  payload: data,
});

export const setError = (data: any) => ({
  type: SF_INTEGRATION_ACTIONS.SET_ERROR,
  payload: data,
});

export const resetMessages = () => ({
  type: SF_INTEGRATION_ACTIONS.RESET_MESSAGES,
});

export const setLoadingMessage = (msg: string) => ({
  type: SF_INTEGRATION_ACTIONS.SET_LOADING_MESSAGE,
  payload: msg,
});

export const saveStages = (data: any[]) => ({
  type: SF_INTEGRATION_ACTIONS.SAVE_STAGES,
  payload: data,
});

export const saveFileConfig = (data: any) => ({
  type: SF_INTEGRATION_ACTIONS.SAVE_FILE_CONFIG,
  payload: data,
});

export const setActiveTab = (data: string) => ({
  type: SF_INTEGRATION_ACTIONS.SET_ACTIVE_TAB,
  payload: data,
});
// export const saveFTPServers = (data: any[]) => ({
//   type: SF_INTEGRATION_ACTIONS.SAVE_FTP_SERVERS,
//   payload: data,
// });

export const saveFileLogs = (data: any[]) => ({
  type: SF_INTEGRATION_ACTIONS.SAVE_FILE_LOGS,
  payload: data,
});

export const setDataSubmittingLoader = (isLoading: boolean) => ({
  type: SF_INTEGRATION_ACTIONS.SET_DATA_SUBMITTING_LOADER,
  payload: isLoading,
});

export const setCurrentJob = (data: any) => ({
  type: SF_INTEGRATION_ACTIONS.SET_CURRENT_JOB,
  payload: data,
});
