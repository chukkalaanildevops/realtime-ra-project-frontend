import { Ilabel } from './outbound.model';

export const OUTBOUND_ACTIONS = {
  SET_LOADING: 'OUTBOUND_ACTIONS/SET_LOADING',
  SAVE_SCHEDULE: 'OUTBOUND_ACTIONS/SAVE_SCHEDULE',
  SET_SUCCESS: 'OUTBOUND_ACTIONS/SET_SUCCESS',
  SET_ERROR: 'OUTBOUND_ACTIONS/SET_ERROR',
  RESET_MESSAGES: 'OUTBOUND_ACTIONS/RESET_MESSAGES',
  SET_LOADING_MESSAGE: 'OUTBOUND_ACTIONS/SET_LOADING_MESSAGE',
  SAVE_FTP_SERVERS: 'OUTBOUND_ACTIONS/SAVE_FTP_SERVERS',
  SAVE_FILE_FORMATS: 'OUTBOUND_ACTIONS/SAVE_FILE_FORMATS',
  SAVE_SCHEDULE_CATEGORY: 'OUTBOUND_ACTIONS/SAVE_SCHEDULE_CATEGORY',
  SAVE_SCHEDULE_FILE_SPLIT: 'OUTBOUND_ACTIONS/SAVE_SCHEDULE_FILE_SPLIT',
  SAVE_SCHEDULE_DATE_FORMAT: 'OUTBOUND_ACTIONS/SAVE_SCHEDULE_DATE_FORMAT',
  SAVE_SCHEDULE_DELIMITER: 'OUTBOUND_ACTIONS/SAVE_SCHEDULE_DELIMITER',
  SET_DATA_SAVE_LOADER: 'OUTBOUND_ACTIONS/SET_DATA_SAVE_LOADER',
};

export const SCHEDULING_ACTIONS = {
  UPDATE_SCHEDULING_TAB_ACTIVE_KEY:
    'SCHEDULING_ACTIONS/UPDATE_SCHEDULING_TAB_ACTIVE_KEY',
  UPDATE_TAB_SWITCH_CONFIRMATION_VISIBILITY:
    'SCHEDULING_ACTIONS/UPDATE_TAB_SWITCH_CONFIRMATION_VISIBILITY',
  UPDATE_LABEL_LIST: 'SCHEDULING_ACTIONS/UPDATE_LABEL_LIST',
  UPDATE_USER_LABEL_LIST: 'SCHEDULING_ACTIONS/UPDATE_USER_LABEL_LIST',
  UPDATE_LABEL_DATA: 'SCHEDULING_ACTIONS/UPDATE_LABEL_DATA',
  API_CALL_REQUEST: 'SCHEDULING_ACTIONS/API_CALL_REQUEST',
  API_CALL_SUCCESS: 'SCHEDULING_ACTIONS/API_CALL_SUCCESS',
  API_CALL_FAIL: 'SCHEDULING_ACTIONS/API_CALL_FAIL',
};

export const setLoader = (isLoading: boolean) => ({
  type: OUTBOUND_ACTIONS.SET_LOADING,
  payload: isLoading,
});

export const setDataLoader = (isLoading: boolean) => ({
  type: OUTBOUND_ACTIONS.SET_DATA_SAVE_LOADER,
  payload: isLoading,
});

export const saveSchedule = (data: any) => ({
  type: OUTBOUND_ACTIONS.SAVE_SCHEDULE,
  payload: data,
});

export const setSuccess = (data: string) => ({
  type: OUTBOUND_ACTIONS.SET_SUCCESS,
  payload: data,
});

export const setError = (data: string) => ({
  type: OUTBOUND_ACTIONS.SET_ERROR,
  payload: data,
});

export const resetMessages = () => ({
  type: OUTBOUND_ACTIONS.RESET_MESSAGES,
});

export const setLoadingMessage = (msg: string) => ({
  type: OUTBOUND_ACTIONS.SET_LOADING_MESSAGE,
  payload: msg,
});

export const saveCategory = (categoryRecords: any[]) => ({
  type: OUTBOUND_ACTIONS.SAVE_SCHEDULE_CATEGORY,
  payload: categoryRecords,
});

export const saveFileSplit = (fileSplitRecords: any[]) => ({
  type: OUTBOUND_ACTIONS.SAVE_SCHEDULE_FILE_SPLIT,
  payload: fileSplitRecords,
});

export const saveDateFormat = (dateFormat: any[]) => ({
  type: OUTBOUND_ACTIONS.SAVE_SCHEDULE_DATE_FORMAT,
  payload: dateFormat,
});

export const saveDelimiter = (delimiter: any[]) => ({
  type: OUTBOUND_ACTIONS.SAVE_SCHEDULE_DELIMITER,
  payload: delimiter,
});

export const saveFileFormats = (fileFormats: any[]) => ({
  type: OUTBOUND_ACTIONS.SAVE_FILE_FORMATS,
  payload: fileFormats,
});

// export const saveFTPServers = (data: any[]) => ({
//   type: SF_INTEGRATION_ACTIONS.SAVE_FTP_SERVERS,
//   payload: data,
// });

export const tabKeyUpdateAction = (data: string) => {
  return {
    type: SCHEDULING_ACTIONS.UPDATE_SCHEDULING_TAB_ACTIVE_KEY,
    payload: { activeTabKey: data },
  };
};

export const tabSwitchConfirmationVisibilityAction = (visibility: boolean) => {
  return {
    type: SCHEDULING_ACTIONS.UPDATE_TAB_SWITCH_CONFIRMATION_VISIBILITY,
    payload: {
      tabSwitchConfirmationVisibility: visibility,
    },
  };
};

export const updateLabelData = (data: Ilabel) => {
  return {
    type: SCHEDULING_ACTIONS.UPDATE_LABEL_DATA,
    payload: {
      label: data,
    },
  };
};

export const saveLabelMappingList = (list: any[]) => {
  return {
    type: SCHEDULING_ACTIONS.UPDATE_LABEL_LIST,
    payload: {
      labelList: list,
    },
  };
};

export const updateUserLabelList = (list: any[]) => {
  return {
    type: SCHEDULING_ACTIONS.UPDATE_USER_LABEL_LIST,
    payload: {
      userLabelList: list,
    },
  };
};

export const apiCallRequest = (payload: any = {}) => ({
  type: SCHEDULING_ACTIONS.API_CALL_REQUEST,
  payload: {
    error: '',
    success: '',
    info: 'Loading Data...',
    isLoading: true,
    ...payload,
  },
});

export const apiCallSuccess = (success: string, payload: any = {}) => ({
  type: SCHEDULING_ACTIONS.API_CALL_SUCCESS,
  payload: {
    error: '',
    success: success,
    info: '',
    isLoading: false,
    ...payload,
  },
});

export const apiCallFail = (err: string, payload: any = {}) => ({
  type: SCHEDULING_ACTIONS.API_CALL_FAIL,
  payload: {
    error: err,
    success: '',
    info: '',
    isLoading: false,
    ...payload,
  },
});
