import {
  TsetConfirmationInfoFn,
  TresetConfirmationInfoFn,
  TsetWorkflowDataFn,
  TresetWorkflowDataFn,
  TapiCallRequestFn,
  TapiCallSuccessFn,
  TapiCallFailFn,
  TapiCallResetFn,
  TresetToInitialFn,
  TsetWorkflowDataLoaderFn,
  IpWAData,
} from './app.model';

export const APP_REDUCER_ACTIONS = {
  SET_CONFIRMATION_INFO: 'APP/SET_CONFIRMATION_INFO',
  RESET_CONFIRMATION_INFO: 'APP/RESET_CONFIRMATION_INFO',
  SET_WORKFLOW_DATA: 'APP/SET_WORKFLOW_DATA',
  SET_WORKFLOW_DATA_FOR_PDF_PRINT: 'APP/SET_WORKFLOW_DATA_FOR_PDF_PRINT',
  SET_WORKFLOW_DATA_LOADER: 'APP/SET_WORKFLOW_DATA_LOADER',
  RESET_WORKFLOW_DATA: 'APP/RESET_WORKFLOW_DATA',

  SET_WORKFLOW_DETAILS_COMPONENT_PROPS:
    'APP/SET_WORKFLOW_DETAILS_COMPONENT_PROPS',

  RESET_TO_INITIAL: 'APP/RESET_TO_INITIAL',

  API_CALL_REQUEST: 'APP/API_CALL_REQUEST',
  API_CALL_RESET: 'APP/API_CALL_RESET',
  API_CALL_SUCCESS: 'APP/API_CALL_SUCCESS',
  API_CALL_FAIL: 'APP/API_CALL_FAIL',
  SAVE_REMARKS: 'APP/SAVE_REMARKS',
  NEW_VERSION_AVAILABLE: 'APP/NEW_VERSION_AVAILABLE',
  API_CALL_ERROR: 'APP/API_CALL_ERROR',
  RESET_ALL_DATA: 'APP/RESET_ALL_DATA',
};

export const apiCallRequest: TapiCallRequestFn = (isLoading = true, info) => ({
  type: APP_REDUCER_ACTIONS.API_CALL_REQUEST,
  payload: {
    error: '',
    success: '',
    info: info !== undefined ? info : 'Loading Data...',
    isLoading: isLoading,
  },
});

export const apiCallSuccess: TapiCallSuccessFn = success => ({
  type: APP_REDUCER_ACTIONS.API_CALL_SUCCESS,
  payload: {
    error: '',
    success: success !== undefined ? success : '',
    info: '',
    isLoading: false,
  },
});

export const apiCallFail: TapiCallFailFn = err => ({
  type: APP_REDUCER_ACTIONS.API_CALL_FAIL,
  payload: {
    error: err !== undefined ? err : 'Failed to load data.',
    success: '',
    info: '',
    isLoading: false,
  },
});

export const apiCallReset: TapiCallResetFn = () => ({
  type: APP_REDUCER_ACTIONS.API_CALL_RESET,
  payload: {
    error: '',
    success: '',
    info: '',
    isLoading: false,
  },
});

export const resetToInitial: TresetToInitialFn = () => ({
  type: APP_REDUCER_ACTIONS.RESET_TO_INITIAL,
});

export const setConfirmationInfo: TsetConfirmationInfoFn = confirmationData => ({
  type: APP_REDUCER_ACTIONS.SET_CONFIRMATION_INFO,
  payload: confirmationData,
});

export const resetConfirmationInfo: TresetConfirmationInfoFn = () => ({
  type: APP_REDUCER_ACTIONS.RESET_CONFIRMATION_INFO,
});

export const setWorkflowData: TsetWorkflowDataFn = workflowData => ({
  type: APP_REDUCER_ACTIONS.SET_WORKFLOW_DATA,
  payload: workflowData,
});

export const setWorkflowDataForPDFPrint = (workflowDataForPDFPrint: any) => ({
  type: APP_REDUCER_ACTIONS.SET_WORKFLOW_DATA_FOR_PDF_PRINT,
  payload: workflowDataForPDFPrint,
});

export const resetWorkflowData: TresetWorkflowDataFn = () => ({
  type: APP_REDUCER_ACTIONS.RESET_WORKFLOW_DATA,
});

export const setWorkflowDataLoader: TsetWorkflowDataLoaderFn = bool => ({
  type: APP_REDUCER_ACTIONS.SET_WORKFLOW_DATA_LOADER,
  payload: bool,
});

export const setWorkflowDetailsComponentProps = (props: any) => ({
  type: APP_REDUCER_ACTIONS.SET_WORKFLOW_DETAILS_COMPONENT_PROPS,
  payload: props,
});

export const saveRemarks = (remarks?: any[]) => {
  return {
    type: APP_REDUCER_ACTIONS.SAVE_REMARKS,
    payload: remarks,
  };
};

export const updatePWAData = (payload: IpWAData) => {
  return {
    type: APP_REDUCER_ACTIONS.NEW_VERSION_AVAILABLE,
    payload: payload,
  };
};

export const apiCallError = (payload?: { message: string; action?: any }) => ({
  type: APP_REDUCER_ACTIONS.API_CALL_ERROR,
  payload,
});

export const resetAllData = () => ({
  type: APP_REDUCER_ACTIONS.RESET_ALL_DATA,
});
