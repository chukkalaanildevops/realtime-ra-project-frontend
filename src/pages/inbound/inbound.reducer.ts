import { IOutboundState } from './inbound.model';
import { INBOUND_ACTIONS } from './inbound.action';

export const initialState: IOutboundState = {
  error: '',
  ftpServers: [],
  loader: false,
  loadingMessage: '',
  schedule: [],
  pastJobExecutionData: [],
  loadingPastJobExecutionData: false,
  pastJobExecutionError: '',
  success: '',
  isDataSaving: false,
  inboundJobLogData: [],
  inboundJobLogLoading: false,
  inboundJobLogError: '',
};
export default (state = initialState, action: any) => {
  const { type, payload } = action;
  switch (type) {
    case INBOUND_ACTIONS.SAVE_SCHEDULE:
      return { ...state, schedule: payload };
    case INBOUND_ACTIONS.SET_LOADING:
      return { ...state, loader: payload };
    case INBOUND_ACTIONS.SET_SUCCESS:
      return { ...state, success: payload };
    case INBOUND_ACTIONS.SET_ERROR:
      return { ...state, error: payload };
    case INBOUND_ACTIONS.RESET_MESSAGES:
      return { ...state, error: '', success: '', loader: false };
    case INBOUND_ACTIONS.SET_LOADING_MESSAGE:
      return { ...state, loadingMessage: payload };
    case INBOUND_ACTIONS.SET_DATA_SAVE_LOADER:
      return { ...state, isDataSaving: payload };
    case INBOUND_ACTIONS.SET_LOADING_PAST_EXECUTION_JOB_DATA:
      return { ...state, loadingPastJobExecutionData: payload };
    case INBOUND_ACTIONS.SAVE_PAST_EXECUTION_JOB_DATA:
      return { ...state, pastJobExecutionData: payload };
    case INBOUND_ACTIONS.SET_PAST_EXECUTION_JOB_ERROR:
      return { ...state, pastJobExecutionError: payload };
    case INBOUND_ACTIONS.SET_LOADING_JOB_LOG_DATA:
      return { ...state, inboundJobLogLoading: payload };
    case INBOUND_ACTIONS.SAVE_JOB_LOG_DATA:
      return { ...state, inboundJobLogData: payload };
    case INBOUND_ACTIONS.SET_JOB_LOG_ERROR:
      return { ...state, inboundJobLogError: payload };
    // case INBOUND_ACTIONS.SAVE_FTP_SERVERS:
    //   return {
    //     ...state,
    //     ftpServers: payload,
    //   };
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
// export const getFtpServers = (state: IOutboundState) => state.ftpServers;
export const getIsDataSaving = (state: IOutboundState) => state.isDataSaving;
