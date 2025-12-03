import { GL_ACCOUNT_STATE } from './glAccount.model';
import { GL_ACCOUNTS_ACTIONS } from './glAccount.actions';

export const initialState: GL_ACCOUNT_STATE = {
  glAccounts: [],
  detailedGlAccount: {},
  loader: false,
  detailsLoader: false,
  accountTypes: [],
  loadingMessage: '',
  error: '',
  success: '',
  glAccountData: {
    data: [],
    pagination_data: {
      number_of_pages: 0,
      total_records: 0,
    },
    current_page: 0,
  },
};

export default (state = initialState, action: any) => {
  const { type, payload } = action;
  switch (type) {
    case GL_ACCOUNTS_ACTIONS.SET_LOADER:
      return {
        ...state,
        loader: payload,
      };
    case GL_ACCOUNTS_ACTIONS.SET_DETAILS_LOADER:
      return {
        ...state,
        detailsLoader: payload,
      };
    case GL_ACCOUNTS_ACTIONS.SAVE_GL_ACCOUNTS:
      return {
        ...state,
        glAccounts: payload,
      };
    case GL_ACCOUNTS_ACTIONS.SAVE_GL_ACCOUNTS_DATA:
      return {
        ...state,
        detailedGlAccount: payload,
      };
    case GL_ACCOUNTS_ACTIONS.SAVE_ACCOUNT_TYPES:
      return {
        ...state,
        accountTypes: payload,
      };
    case GL_ACCOUNTS_ACTIONS.SET_LOADING_MESSAGE:
      return {
        ...state,
        loadingMessage: payload,
      };
    case GL_ACCOUNTS_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: payload,
      };
    case GL_ACCOUNTS_ACTIONS.SET_SUCCESS:
      return {
        ...state,
        success: payload,
      };
    case GL_ACCOUNTS_ACTIONS.RESET_MESSAGE:
      return {
        ...state,
        loadingMessage: '',
        success: '',
        error: '',
      };
    case GL_ACCOUNTS_ACTIONS.SAVE_GL_ACCOUNTS_PAGINATION_DATA:
      return {
        ...state,
        glAccountData: payload,
      };
    default:
      return state;
  }
};

export const getGlAccounts = (state: GL_ACCOUNT_STATE) =>
  state.loader ? new Array(15).fill({}) : state.glAccounts;

export const getGlAccountLoader = (state: GL_ACCOUNT_STATE) => state.loader;

export const getGlAccountDetails = (state: GL_ACCOUNT_STATE) =>
  state.detailedGlAccount;

export const getGlAccountDetailsLoader = (state: GL_ACCOUNT_STATE) =>
  state.detailsLoader;

export const getGlAccountTypes = (state: GL_ACCOUNT_STATE) =>
  state.accountTypes;

export const getLoadingMessage = (state: GL_ACCOUNT_STATE) =>
  state.loadingMessage;

export const getSuccessMessage = (state: GL_ACCOUNT_STATE) => state.success;

export const getErrorMessage = (state: GL_ACCOUNT_STATE) => state.error;

export const getGlAccountPaginationData = (state: GL_ACCOUNT_STATE) =>
  state.loader
    ? { ...state.glAccountData, data: new Array(15).fill({}) }
    : state.glAccountData;
