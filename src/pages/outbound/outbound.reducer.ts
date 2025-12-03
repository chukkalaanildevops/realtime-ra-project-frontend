import { IOutboundState } from './outbound.model';
import { OUTBOUND_ACTIONS, SCHEDULING_ACTIONS } from './outbound.action';

export const initialState: IOutboundState = {
  error: '',
  ftpServers: [],
  categoryRecords: [],
  fileSplitRecords: [],
  dateFormat: [],
  delimiter: [],
  loader: false,
  loadingMessage: '',
  schedule: [],
  success: '',
  info: '',
  isLoading: false,
  fileFormats: [],
  isDataUpdating: false,
  activeTabKey: '1',
  tabSwitchConfirmationVisibility: false,
  loadingLabelMappingList: false,
  label: {},
  labelList: [],
  userLabelList: [],
};
export default (state = initialState, action: any) => {
  const { type, payload } = action;
  switch (type) {
    case OUTBOUND_ACTIONS.SAVE_SCHEDULE:
      return { ...state, schedule: payload };
    case OUTBOUND_ACTIONS.SAVE_SCHEDULE_CATEGORY:
      return { ...state, categoryRecords: payload };
    case OUTBOUND_ACTIONS.SAVE_SCHEDULE_FILE_SPLIT:
      return { ...state, fileSplitRecords: payload };
    case OUTBOUND_ACTIONS.SAVE_SCHEDULE_DATE_FORMAT:
      return { ...state, dateFormat: payload };
    case OUTBOUND_ACTIONS.SAVE_SCHEDULE_DELIMITER:
      return { ...state, delimiter: payload };
    case OUTBOUND_ACTIONS.SET_LOADING:
      return { ...state, loader: payload };
    case OUTBOUND_ACTIONS.SET_SUCCESS:
      return { ...state, success: payload };
    case OUTBOUND_ACTIONS.SET_ERROR:
      return { ...state, error: payload };
    case OUTBOUND_ACTIONS.RESET_MESSAGES:
      return { ...state, error: '', success: '', loader: false };
    case OUTBOUND_ACTIONS.SET_LOADING_MESSAGE:
      return { ...state, loadingMessage: payload };
    case OUTBOUND_ACTIONS.SAVE_FILE_FORMATS:
      return {
        ...state,
        fileFormats: payload,
      };
    case OUTBOUND_ACTIONS.SET_DATA_SAVE_LOADER:
      return { ...state, isDataUpdating: payload };
    case SCHEDULING_ACTIONS.UPDATE_SCHEDULING_TAB_ACTIVE_KEY:
    case SCHEDULING_ACTIONS.UPDATE_TAB_SWITCH_CONFIRMATION_VISIBILITY:
    case SCHEDULING_ACTIONS.UPDATE_LABEL_LIST:
    case SCHEDULING_ACTIONS.UPDATE_USER_LABEL_LIST:
    case SCHEDULING_ACTIONS.UPDATE_LABEL_DATA:
    case SCHEDULING_ACTIONS.API_CALL_REQUEST:
    case SCHEDULING_ACTIONS.API_CALL_SUCCESS:
    case SCHEDULING_ACTIONS.API_CALL_FAIL:
      return { ...state, ...payload };
    default:
      return state;
  }
};

export const getSchedule = (state: IOutboundState) => state.schedule;

export const getLoader = (state: IOutboundState) => state.loader;

export const getSuccess = (state: IOutboundState) => state.success;

export const getError = (state: IOutboundState) => state.error;

export const getLoadingMessage = (state: IOutboundState) =>
  state.loadingMessage;

export const getFileFormats = (state: IOutboundState) => state.fileFormats;

export const getCategoryRecords = (state: IOutboundState) =>
  state.categoryRecords;

export const getFileSplitRecords = (state: IOutboundState) =>
  state.fileSplitRecords;

export const getDateFormat = (state: IOutboundState) => state.dateFormat;

export const getDelimiter = (state: IOutboundState) => state.delimiter;

// export const getFtpServers = (state: IOutboundState) => state.ftpServers;
export const getDataSaveLoader = (state: IOutboundState) =>
  state.isDataUpdating;
