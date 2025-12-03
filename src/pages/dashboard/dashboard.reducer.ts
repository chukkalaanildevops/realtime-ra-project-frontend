import { DASHBOARD_ACTIONS } from './dashboard.actions';

import { InitialState } from './dashboard.model';
import { Language } from '../../utils/types.utils';

export const initialState: InitialState = {
  ln: Language.en,
  loadingMessage: '',
  userData: {
    name: 'Rupesh Bramhankar',
    profile: null,
  },
  error: '',
  isLoading: false,
  success: '',
  isDashboardDataLoadFailed: false,
  cardData: {},
  cardLoader: {
    draftExpense: false,
    draftRequest: false,
    draftBenefit: false,
    pendingExpense: false,
    pendingRequest: false,
    pendingBenefit: false,
    approvedExpense: false,
    approvedRequest: false,
    approvedBenefit: false,
    rejectedClaims: false,
    rejectedRequest: false,
    rejectedBenefit: false,
  },
};
export default (
  state = initialState,
  action: { type: string; payload: any },
) => {
  const { payload, type } = action;
  switch (type) {
    case DASHBOARD_ACTIONS.SET_LOCALIZATION:
      return {
        ...state,
        ln: payload,
      };
    case DASHBOARD_ACTIONS.SET_LOADER:
      return {
        ...state,
        isLoading: payload,
      };
    case DASHBOARD_ACTIONS.SET_CARD_LOADER:
      return {
        ...state,
        cardLoader: {
          ...state.cardLoader,
          ...payload,
        },
      };
    case DASHBOARD_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: payload,
      };
    case DASHBOARD_ACTIONS.SET_SUCCESS:
      return {
        ...state,
        success: payload,
      };
    case DASHBOARD_ACTIONS.SAVE_LOADING_MESSAGE:
      return {
        ...state,
        loadingMessage: payload,
      };
    case DASHBOARD_ACTIONS.SAVE_CARD_DATA:
      return {
        ...state,
        cardData: {
          ...state.cardData,
          ...payload,
        },
      };
    case DASHBOARD_ACTIONS.RESET_CARD_DATA:
      return {
        ...state,
        cardData: {},
      };
    case DASHBOARD_ACTIONS.SET_DASHBOARD_LOAD_ERROR:
      return {
        ...state,
        isDashboardDataLoadFailed: payload,
      };

    default:
      return state;
  }
};

export const getLocalization = (state: any): Language => state.ln;
// export const getValues = (state: any) => state.values;
export const getUserData = (state: any) => state.userData;
// export const getRecords = (state: any): RecordSchema => state.records;
export const getLoader = (state: InitialState) => state.isLoading;
export const getLoadingMessage = (state: InitialState) => state.loadingMessage;
export const getSuccess = (state: InitialState) => state.success;
export const getError = (state: InitialState) => state.error;
// export const get = (state:InitialState) => state.isLoading;
export const getDashboardLoadError = (state: InitialState) =>
  state.isDashboardDataLoadFailed;
