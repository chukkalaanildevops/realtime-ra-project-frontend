import { APP_REDUCER_ACTIONS } from './app.actions';
import { IinitialStateAppReducer, TAppReducerFn } from './app.model';

export const initialState: IinitialStateAppReducer = {
  pWAData: {
    waitingWorker: {},
    newVersionAvailable: false,
  },
  confirmationInfo: {
    visibility: false,
    headerText: undefined,
    bodyText: undefined,
    forWhat: '',
    okText: undefined,
    cancelText: undefined,
    extraInfo: null,
    cancelBtnFn: undefined,
    okBtnFn: undefined,
  },
  WorkflowDetailsComponentProps: {},
  workflowData: [],
  workflowDataForPDFPrint: [],
  workflowDataLoader: false,
  error: '',
  backendError: {},
  info: '',
  success: '', //success message on something saved on server
  isLoading: false, //global loader.
};

const AppReducer: TAppReducerFn = (
  state = initialState,
  { type, payload = {} },
) => {
  switch (type) {
    case APP_REDUCER_ACTIONS.API_CALL_REQUEST:
    case APP_REDUCER_ACTIONS.API_CALL_RESET:
    case APP_REDUCER_ACTIONS.API_CALL_SUCCESS:
    case APP_REDUCER_ACTIONS.API_CALL_FAIL:
      return {
        ...state,
        ...payload,
      };

    case APP_REDUCER_ACTIONS.SET_CONFIRMATION_INFO:
      return {
        ...state,
        confirmationInfo: {
          ...initialState.confirmationInfo,
          ...payload,
        },
      };

    case APP_REDUCER_ACTIONS.RESET_CONFIRMATION_INFO:
      return {
        ...state,
        confirmationInfo: initialState.confirmationInfo,
      };

    case APP_REDUCER_ACTIONS.SET_WORKFLOW_DETAILS_COMPONENT_PROPS:
      return {
        ...state,
        WorkflowDetailsComponentProps: payload,
      };

    case APP_REDUCER_ACTIONS.SET_WORKFLOW_DATA:
      return {
        ...state,
        workflowData: payload,
      };

    case APP_REDUCER_ACTIONS.SET_WORKFLOW_DATA_FOR_PDF_PRINT:
      return {
        ...state,
        workflowDataForPDFPrint: payload,
      };

    case APP_REDUCER_ACTIONS.SET_WORKFLOW_DATA_LOADER:
      return {
        ...state,
        workflowDataLoader: payload,
      };

    case APP_REDUCER_ACTIONS.RESET_WORKFLOW_DATA:
      return {
        ...state,
        workflowData: initialState.workflowData,
      };

    case APP_REDUCER_ACTIONS.SAVE_REMARKS:
      return {
        ...state,
        remarks: payload,
      };

    case APP_REDUCER_ACTIONS.RESET_TO_INITIAL:
      return initialState;

    case APP_REDUCER_ACTIONS.NEW_VERSION_AVAILABLE:
      return {
        ...state,
        pWAData: {
          ...state.pWAData,
          ...payload,
        },
      };
    case APP_REDUCER_ACTIONS.API_CALL_ERROR:
      return {
        ...state,
        apiError: payload,
      };

    default:
      return state;
  }
};

export default AppReducer;
