export const DASHBOARD_ACTIONS = {
  SET_LOCALIZATION: 'DASHBOARD_ACTIONS/SET_LOCALIZATION',
  SET_SUCCESS: 'DASHBOARD_ACTIONS/SET_SUCCESS',
  SET_ERROR: 'DASHBOARD_ACTIONS/SET_ERROR',
  SET_LOADER: 'DASHBOARD_ACTIONS/SET_LOADER',
  SAVE_CARD_DATA: 'DASHBOARD_ACTIONS/SAVE_CARD_DATA',
  SAVE_LOADING_MESSAGE: 'DASHBOARD_ACTIONS/SAVE_LOADING_MESSAGE',
  SET_DASHBOARD_LOAD_ERROR: 'DASHBOARD_ACTIONS/SET_DASHBOARD_LOAD_ERROR',
  SET_CARD_LOADER: 'DASHBOARD_ACTIONS/SET_CARD_LOADER',
  RESET_CARD_DATA: 'DASHBOARD_ACTIONS/RESET_CARD_DATA',
};

export const setLocalization = (ln: any) => {
  return {
    type: DASHBOARD_ACTIONS.SET_LOCALIZATION,
    payload: ln,
  };
};

export const setLoader = (isLoading: boolean) => ({
  type: DASHBOARD_ACTIONS.SET_LOADER,
  payload: isLoading,
});

export const setCardLoader = (key: any, value: any) => {
  const updatedData: any = {};
  updatedData[key] = value;
  return {
    type: DASHBOARD_ACTIONS.SET_CARD_LOADER,
    payload: updatedData,
  };
};

export const setSuccess = (success: string) => ({
  type: DASHBOARD_ACTIONS.SET_SUCCESS,
  payload: success,
});

export const setError = (error: string) => ({
  type: DASHBOARD_ACTIONS.SET_ERROR,
  payload: error,
});

export const saveCardData = (data: any) => ({
  type: DASHBOARD_ACTIONS.SAVE_CARD_DATA,
  payload: data,
});

export const setLoadingMessage = (message: string) => ({
  type: DASHBOARD_ACTIONS.SAVE_LOADING_MESSAGE,
  payload: message,
});

export const setDashboardLoadDataFailed = (isFailed: boolean) => ({
  type: DASHBOARD_ACTIONS.SET_DASHBOARD_LOAD_ERROR,
  payload: isFailed,
});

export const resetCardData = () => ({
  type: DASHBOARD_ACTIONS.RESET_CARD_DATA,
});
