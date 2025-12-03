export const INBOUND_ACTIONS = {
  SET_LOADING: 'INBOUND_ACTIONS/SET_LOADING',
  SAVE_SCHEDULE: 'INBOUND_ACTIONS/SAVE_SCHEDULE',
  SET_SUCCESS: 'INBOUND_ACTIONS/SET_SUCCESS',
  SET_ERROR: 'INBOUND_ACTIONS/SET_ERROR',
  RESET_MESSAGES: 'INBOUND_ACTIONS/RESET_MESSAGES',
  SET_LOADING_MESSAGE: 'INBOUND_ACTIONS/SET_LOADING_MESSAGE',
  SAVE_FTP_SERVERS: 'INBOUND_ACTIONS/SAVE_FTP_SERVERS',
  SET_DATA_SAVE_LOADER: 'INBOUND_ACTIONS/SET_DATA_SAVE_LOADER',
  SET_LOADING_PAST_EXECUTION_JOB_DATA:
    'INBOUND_ACTIONS/SET_LOADING_PAST_EXECUTION_JOB_DATA',
  SAVE_PAST_EXECUTION_JOB_DATA: 'INBOUND_ACTIONS/SAVE_PAST_EXECUTION_JOB_DATA',
  SET_PAST_EXECUTION_JOB_ERROR: 'INBOUND_ACTIONS/SET_PAST_EXECUTION_JOB_ERROR',
  SET_LOADING_JOB_LOG_DATA: 'INBOUND_ACTIONS/SET_LOADING_JOB_LOG_DATA',
  SAVE_JOB_LOG_DATA: 'INBOUND_ACTIONS/SAVE_JOB_LOG_DATA',
  SET_JOB_LOG_ERROR: 'INBOUND_ACTIONS/SET_JOB_LOG_ERROR',
};

export const setLoader = (isLoading: boolean) => ({
  type: INBOUND_ACTIONS.SET_LOADING,
  payload: isLoading,
});

export const saveSchedule = (data: any) => ({
  type: INBOUND_ACTIONS.SAVE_SCHEDULE,
  payload: data,
});

export const setSuccess = (data: string) => ({
  type: INBOUND_ACTIONS.SET_SUCCESS,
  payload: data,
});

export const setError = (data: string) => ({
  type: INBOUND_ACTIONS.SET_ERROR,
  payload: data,
});

export const resetMessages = () => ({
  type: INBOUND_ACTIONS.RESET_MESSAGES,
});

export const setLoadingMessage = (msg: string) => ({
  type: INBOUND_ACTIONS.SET_LOADING_MESSAGE,
  payload: msg,
});

// export const saveFTPServers = (data: any[]) => ({
//   type: SF_INTEGRATION_ACTIONS.SAVE_FTP_SERVERS,
//   payload: data,
// });SET_LOADING_JOB_LOG_DATASET_LOADING_JOB_LOG_DATA

export const setDataSaveLoader = (isLoading: boolean) => ({
  type: INBOUND_ACTIONS.SET_DATA_SAVE_LOADER,
  payload: isLoading,
});

export const setPastExecutionJobDataLoading = (isLoading: boolean) => ({
  type: INBOUND_ACTIONS.SET_LOADING_PAST_EXECUTION_JOB_DATA,
  payload: isLoading,
});

export const savePastExecutionJobData = (data: any) => ({
  type: INBOUND_ACTIONS.SAVE_PAST_EXECUTION_JOB_DATA,
  payload: data,
});

export const setPastExecutionJobError = (error: any) => ({
  type: INBOUND_ACTIONS.SET_PAST_EXECUTION_JOB_ERROR,
  payload: error,
});

export const setLoadingJobLogData = (isLoading: boolean) => ({
  type: INBOUND_ACTIONS.SET_LOADING_JOB_LOG_DATA,
  payload: isLoading,
});

export const saveJobLogData = (data: any) => ({
  type: INBOUND_ACTIONS.SAVE_JOB_LOG_DATA,
  payload: data,
});

export const setJobLogError = (error: any) => ({
  type: INBOUND_ACTIONS.SET_JOB_LOG_ERROR,
  payload: error,
});
