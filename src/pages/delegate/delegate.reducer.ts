import { IDelegateState, PROXY_PERMISSIONS } from './delegate.model';
import { DELEGATE_ACTIONS } from './delegate.action';
import { CONSTANTS } from '../../shared/redux/auth/auth.model';
import { setGlobalDelegationId } from '../../utils/reimAxios.utils';

const emptyData = {
  current_page: 1,
  data: [],
  pagination_data: {
    total_records: 0,
    number_of_pages: 1,
    next_page: 0,
  },
};

export const initialState: IDelegateState = {
  'delegated-by-me': emptyData,
  'delegated-to-me': emptyData,
  error: '',
  loader: false,
  loadingMessage: '',
  success: '',
  permissions: [],
  users: [],
  delegateUsers: [],
  isDataLoading: false,
  currentDelegateUser: undefined,
  currentDelegateUserLoader: false,
  delegateScreenConfig: undefined,
  errorObject: undefined,
  apiStatus: false,
  apiLoad: false,
  delegateUserJobInfo: undefined,
};

export default (state = initialState, action: any): IDelegateState => {
  const { type, payload, status } = action;

  switch (type) {
    case DELEGATE_ACTIONS.SET_LOADER:
      return {
        ...state,
        loader: payload,
      };
    case DELEGATE_ACTIONS.SET_LOADING_MESSAGE:
      return {
        ...state,
        loadingMessage: payload,
      };
    case DELEGATE_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: payload,
      };
    case DELEGATE_ACTIONS.SET_SUCCESS:
      return {
        ...state,
        success: payload,
      };
    case DELEGATE_ACTIONS.SAVE_DELEGATED_BY_ME:
      return {
        ...state,
        'delegated-by-me': payload,
      };
    case DELEGATE_ACTIONS.SAVE_DELEGATED_TO_ME:
      return {
        ...state,
        'delegated-to-me': payload,
      };
    case DELEGATE_ACTIONS.SAVE_PROXY_PERMISSIONS:
      return {
        ...state,
        permissions: payload,
      };
    case DELEGATE_ACTIONS.SAVE_USERS:
      return {
        ...state,
        users: payload,
      };
    case DELEGATE_ACTIONS.SET_DATA_LOADING:
      return {
        ...state,
        isDataLoading: payload,
      };
    case DELEGATE_ACTIONS.SET_API_LOADING:
      return {
        ...state,
        apiLoad: payload,
      };
    case DELEGATE_ACTIONS.SAVE_PROXY_USERS:
      return {
        ...state,
        delegateUsers: payload,
      };
    case DELEGATE_ACTIONS.SET_CURRANT_DELEGATE_LOADER:
      return {
        ...state,
        currentDelegateUserLoader: payload,
      };
    case DELEGATE_ACTIONS.SAVE_CURRENT_DELEGATE_USER:
      if (payload) {
        sessionStorage.setItem(
          CONSTANTS.DELEGATE_USER,
          JSON.stringify(payload),
        );
      } else {
        sessionStorage.removeItem(CONSTANTS.DELEGATE_USER);
      }
      setGlobalDelegationId(payload?.on_behalf_of?.id);
      return {
        ...state,
        currentDelegateUser: payload,
      };
    case DELEGATE_ACTIONS.CONFIG_SCREEN_FOR_DELEGATE_USER:
      return {
        ...state,
        delegateScreenConfig: payload,
      };
    case DELEGATE_ACTIONS.SAVE_JOB_INFORMATION:
      return {
        ...state,
        delegateUserJobInfo: payload,
      };
    case DELEGATE_ACTIONS.SET_ERROR_OBJECT:
      return { ...state, apiStatus: status, errorObject: payload };
    default:
      return state;
  }
};

export const getLoadingState = (state: IDelegateState) => state.loader;

export const getSuccess = (state: IDelegateState) => state.success;

export const getError = (state: IDelegateState) => state.error;

export const getErrorObject = (state: IDelegateState) => state.errorObject;
export const getApiStatus = (state: IDelegateState) => state.apiStatus;

export const getLoadingMessage = (state: IDelegateState) =>
  state.loadingMessage;

export const getDelegatedByMe = (state: IDelegateState) =>
  state['delegated-by-me'];

export const getDelegateToMe = (state: IDelegateState) =>
  state['delegated-to-me'];

export const getPermissions = (state: IDelegateState) => state.permissions;

export const getUsers = (state: IDelegateState) => state.users;

export const getDataLoadingState = (state: IDelegateState) =>
  state.isDataLoading;
export const getAPILoadingState = (state: IDelegateState) => state.apiLoad;
export const getProxyUsers = (state: IDelegateState) => state.delegateUsers;
export const getCurrentDelegateUser = (state: IDelegateState) =>
  state.currentDelegateUser;
export const getCurrentUserCostCentre = (state: IDelegateState) =>
  state.delegateUserJobInfo?.cost_centre;

export const isDraftMenuAllowed = (state: IDelegateState) => {
  const isDelegateUserLoginUser = !Boolean(state.currentDelegateUser);
  if (isDelegateUserLoginUser) return true;

  const delegatePermissions: any[] = isDelegateUserLoginUser
    ? []
    : state.currentDelegateUser.permissions.map((per: any) => per.code);
  return (
    delegatePermissions.includes('ACTION_BENEFIT') ||
    delegatePermissions.includes('ACTION_REQUEST') ||
    delegatePermissions.includes('ACTION_EXPENSE') ||
    delegatePermissions.includes('ACTION_RECEIPT')
  );
};

export const isSubmittedMenuAllowed = (state: IDelegateState) => {
  const isDelegateUserLoginUser = !Boolean(state.currentDelegateUser);
  if (isDelegateUserLoginUser) return true;

  const delegatePermissions: any[] = isDelegateUserLoginUser
    ? []
    : state.currentDelegateUser.permissions.map((per: any) => per.code);
  return (
    delegatePermissions.includes('ACTION_BENEFIT') ||
    delegatePermissions.includes('ACTION_REQUEST') ||
    delegatePermissions.includes('ACTION_EXPENSE')
  );
};

export const isApprovedMenuAllowed = (state: IDelegateState) => {
  const isDelegateUserLoginUser = !Boolean(state.currentDelegateUser);
  if (isDelegateUserLoginUser) return true;
  const delegatePermissions: any[] = isDelegateUserLoginUser
    ? []
    : state.currentDelegateUser.permissions.map((per: any) => per.code);
  return (
    delegatePermissions.includes('ACTION_BENEFIT_APPROVAL') ||
    delegatePermissions.includes('ACTION_REQUEST_APPROVAL') ||
    delegatePermissions.includes('ACTION_EXPENSE_APPROVAL')
  );
};

export const isProxyPermissionAllowed = (
  state: IDelegateState,
  permission: PROXY_PERMISSIONS,
) => {
  const isDelegateUserLoginUser = !Boolean(state.currentDelegateUser);
  if (isDelegateUserLoginUser) return true;

  const delegatePermissions: any[] = isDelegateUserLoginUser
    ? []
    : state.currentDelegateUser.permissions.map((per: any) => per.code);
  return delegatePermissions.includes(permission);
};

export const getDelegateConfig = (state: IDelegateState) =>
  state.delegateScreenConfig;
