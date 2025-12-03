import { AUTH_STATE, CONSTANTS } from './auth.model';
import { AUTH_ACTIONS } from './auth.actions';
import {
  setGlobalTenant,
  setGlobalToken,
} from '../../../utils/reimAxios.utils';
import {
  setGlobalTenant as setGlobalTenantEcore,
  setGlobalToken as setGlobalTokenEcore,
} from '../../../utils/ecoreAxios.utils';
// import { startTestingConnection } from '../../../pages/setupConfigurations/setupConfigurations.actions';

export const initialState: AUTH_STATE = {
  loading: false,
  isEntTenant: false,
  tenant: '',
  token: '',
  error: '',
  loadingMessage: '',
  success: '',
  tenantConfig: undefined,
  user: undefined,
  areUsersFetched: false,
  users: [],
  activeUsers: [],
  usersLoader: false,
  jobInfo: undefined,
  expenseTypes: [],
};

export default (state = initialState, action: any) => {
  const { type, payload } = action;

  switch (type) {
    case AUTH_ACTIONS.SET_LOADER:
      return { ...state, loading: payload };
    case AUTH_ACTIONS.IS_ENTERED_TENANT:
      return { ...state, isEntTenant: payload };
    case AUTH_ACTIONS.SAVE_REDIRECTION_URL:
      return { ...state, redirection_url: payload };
    case AUTH_ACTIONS.SAVE_TENANT: {
      localStorage.setItem(CONSTANTS.TENANT, payload);
      setGlobalTenant(payload);
      setGlobalTenantEcore(payload);
      return { ...state, tenant: payload };
    }

    case AUTH_ACTIONS.SAVE_TOKEN: {
      setGlobalToken(payload);
      setGlobalTokenEcore(payload);
      sessionStorage.setItem(CONSTANTS.TOKEN, payload);
      return { ...state, token: payload };
    }

    case AUTH_ACTIONS.SAVE_SUCCESS:
      return { ...state, success: payload };
    case AUTH_ACTIONS.SAVE_ERROR:
      return { ...state, error: payload };
    case AUTH_ACTIONS.SAVE_LOADING_MESSAGE:
      return { ...state, loadingMessage: payload };
    case AUTH_ACTIONS.SAVE_EXPENSE_TYPES:
      return { ...state, expenseTypes: payload };
    case AUTH_ACTIONS.SAVE_TENANT_CONFIG:
      return { ...state, ...state.tenantConfig, tenantConfig: payload };
    case AUTH_ACTIONS.SAVE_USER_DATA: {
      if (payload) {
        const userData = { ...payload };
        delete userData.permissions;
        sessionStorage.setItem(CONSTANTS.USER_DATA, JSON.stringify(userData));
      } else {
        sessionStorage.removeItem(CONSTANTS.USER_DATA);
      }
      return { ...state, user: payload };
    }
    case AUTH_ACTIONS.SAVE_USER_JOB_INFORMATION:
      return {
        ...state,
        jobInfo: payload,
      };
    case AUTH_ACTIONS.SAVE_USERS:
      return {
        ...state,
        users: payload,
        activeUsers: payload.filter((o: any) => o.is_active),
      };
    case AUTH_ACTIONS.UPDATE_LOADER_FOR_USERS:
      return {
        ...state,
        usersLoader: payload,
        areUsersFetched: payload || state.areUsersFetched,
      };

    default:
      return state;
  }
};

export const getAuthLoader = (state: AUTH_STATE) => state.loading;

export const getTenant = (state: AUTH_STATE) => state.tenant;

export const getToken = (state: AUTH_STATE) => state.token;

export const getSuccess = (state: AUTH_STATE) => state.success;

export const getError = (state: AUTH_STATE) => state.error;

export const getLoadingMessage = (state: AUTH_STATE) => state.loadingMessage;

export const getExpenseTypesData = (state: AUTH_STATE) => state.expenseTypes;

export const getTenantConfig = (state: AUTH_STATE) => state.tenantConfig;

export const getIsEnteredTenant = (state: AUTH_STATE) => state.isEntTenant;

export const getUser = (state: AUTH_STATE) => state.user;

export const getUsersListForDD = (state: AUTH_STATE) => state.users;

export const getUsersListForDDLoader = (state: AUTH_STATE) => state.usersLoader;

export const getUserCostCentre = (state: AUTH_STATE) =>
  state.jobInfo?.cost_centre;

export const getIsPettyCashManager = (state: AUTH_STATE) =>
  state.user ? state.user.is_petty_cash_manager : false;
export const getIsBenefitsEnabled = (state: AUTH_STATE) =>
  state.user ? state.user.is_benefits_enabled : false;

export const getIsPettyCashEnabled = (state: AUTH_STATE) =>
  state.user ? state.user.is_petty_cash_enabled : false;

export const getIsAllowanceEnabled = (state: AUTH_STATE) =>
  state.user ? state.user.is_allowance_enabled : false;

export const getPermissions = (
  state: AUTH_STATE,
): {
  VIEW_REPORTS: boolean;
  VIEW_SETUP: boolean;
  VIEW_SETTINGS: boolean;
  VIEW_SETUP_EXPENSE_TYPES: boolean;
  ACTION_SETUP_EXPENSE_TYPES: boolean;
  VIEW_SETUP_REQUEST_TYPES: boolean;
  ACTION_SETUP_REQUEST_TYPES: boolean;
  VIEW_SETUP_BENEFIT_TYPES: boolean;
  ACTION_SETUP_BENEFIT_TYPES: boolean;
  VIEW_SETUP_CURRENCY_CONVERSIONS: boolean;
  ACTION_SETUP_CURRENCY_CONVERSIONS: boolean;
  VIEW_SETUP_ALLOWANCE_RATE: boolean;
  ACTION_SETUP_ALLOWANCE_RATE: boolean;
  VIEW_SETUP_EMPLOYEE_GROUPS: boolean;
  ACTION_SETUP_EMPLOYEE_GROUPS: boolean;
  ACTION_SETUP_CLAIM_INSPECTOR: boolean;
  VIEW_SETUP_RULES: boolean;
  ACTION_SETUP_RULES: boolean;
  VIEW_SETUP_REFERENCE_OBJECTS: boolean;
  ACTION_SETUP_REFERENCE_OBJECTS: boolean;
  VIEW_SETUP_COST_CENTRES: boolean;
  ACTION_SETUP_COST_CENTRES: boolean;
  VIEW_SETUP_WAGE_TYPES: boolean;
  ACTION_SETUP_WAGE_TYPES: boolean;
  VIEW_SETUP_GL_ACCOUNTS: boolean;
  ACTION_SETUP_GL_ACCOUNTS: boolean;
  VIEW_SETUP_ENTITIES: boolean;
  ACTION_SETUP_ENTITIES: boolean;
  VIEW_SETUP_ROLES: boolean;
  VIEW_SETUP_PROXIES: boolean;
  ACTION_SETUP_ROLES: boolean;
  ACTION_SETUP_PROXIES: boolean;
  VIEW_SETUP_EMAIL_TEMPLATES: boolean;
  ACTION_SETUP_EMAIL_TEMPLATES: boolean;
  VIEW_ADMIN: boolean;
  VIEW_ADMIN_EXPENSES: boolean;
  VIEW_ADMIN_REQUESTS: boolean;
  VIEW_ADMIN_CASH_ADVANCE_REQUESTS: boolean;
  VIEW_ADMIN_EXPENSES_WITH_REQUESTS: boolean;
  VIEW_ADMIN_BENEFITS: boolean;
  ACTION_ADMIN_ADD_REMARK_EXPENSES: boolean;
  ACTION_ADMIN_ADD_REMARK_REQUESTS: boolean;
  ACTION_ADMIN_ADD_REMARK_CASH_ADVANCE_REQUESTS: boolean;
  ACTION_ADMIN_ADD_REMARK_EXPENSES_WITH_REQUESTS: boolean;
  ACTION_ADMIN_ADD_REMARK_BENEFITS: boolean;
  ACTION_ADMIN_UPDATE_EXPENSES: boolean;
  ACTION_ADMIN_UPDATE_REQUESTS: boolean;
  ACTION_ADMIN_UPDATE_BENEFITS: boolean;
  ACTION_ADMIN_REJECT_EXPENSES: boolean;
  ACTION_ADMIN_REJECT_REQUESTS: boolean;
  ACTION_ADMIN_REJECT_BENEFITS: boolean;
  ACTION_ADMIN_EXECUTE_CLAIM_SETTLEMENT: boolean;
  ACTION_ADMIN_EXECUTE_REQUEST_POSTING: boolean;
  ACTION_ADMIN_DISBURSE_REJECT_CASH_ADVANCE_REQUEST: boolean;
  ACTION_BENEFIT_ADJUSTMENT: boolean;
  VIEW_EXPENSE_ADMIN_ATTACHED_RECEIPTS: boolean;
  VIEW_BENEFIT_ADMIN_ATTACHED_RECEIPTS: boolean;
  VIEW_ADMIN_EXPENSE_DETAILS: boolean;
  VIEW_ADMIN_BENEFIT_DETAILS: boolean;
  VIEW_EXPENSE_REPORTS: boolean;
  VIEW_REQUEST_REPORTS: boolean;
  VIEW_EXPENSES_WITH_REQUEST_REPORTS: boolean;
  VIEW_CASH_ADVANCE_REPORTS: boolean;
  VIEW_BENEFIT_REPORTS: boolean;
  VIEW_BENEFITS_ENTITLEMENT_REPORTS: boolean;
  VIEW_ADMIN_REQUEST_DETAILS: boolean;
  VIEW_SPECIALIZED_REPORTS: boolean;
  VIEW_BENEFITS_SPECIALIZED_REPORTS: boolean;
  VIEW_USER_PROFILE: boolean;
  ACTION_ADMIN_EXECUTE_BENEFIT_CLAIM_SETTLEMENT: boolean;
  VIEW_ALL_SETTLEMENT_LOGS: boolean;
  ACTION_SF_USERS_DETAILS: boolean;
} => {
  const permissionsMap: any = {
    VIEW_REPORTS: true,
    VIEW_SETUP: true,
    VIEW_SETTINGS: true,
    VIEW_SETUP_EXPENSE_TYPES: true,
    ACTION_SETUP_EXPENSE_TYPES: true,
    VIEW_SETUP_REQUEST_TYPES: true,
    ACTION_SETUP_REQUEST_TYPES: true,
    VIEW_SETUP_BENEFIT_TYPES: true,
    ACTION_SETUP_BENEFIT_TYPES: true,
    VIEW_SETUP_CURRENCY_CONVERSIONS: true,
    ACTION_SETUP_CURRENCY_CONVERSIONS: true,
    VIEW_SETUP_ALLOWANCE_RATE: true,
    ACTION_SETUP_ALLOWANCE_RATE: true,
    VIEW_SETUP_EMPLOYEE_GROUPS: true,
    ACTION_SETUP_EMPLOYEE_GROUPS: true,
    ACTION_SETUP_CLAIM_INSPECTOR: true,
    VIEW_SETUP_RULES: true,
    ACTION_SETUP_RULES: true,
    VIEW_SETUP_REFERENCE_OBJECTS: true,
    ACTION_SETUP_REFERENCE_OBJECTS: true,
    VIEW_SETUP_COST_CENTRES: true,
    ACTION_SETUP_COST_CENTRES: true,
    VIEW_SETUP_WAGE_TYPES: true,
    ACTION_SETUP_WAGE_TYPES: true,
    VIEW_SETUP_GL_ACCOUNTS: true,
    ACTION_SETUP_GL_ACCOUNTS: true,
    VIEW_SETUP_ENTITIES: true,
    ACTION_SETUP_ENTITIES: true,
    VIEW_SETUP_ROLES: true,
    VIEW_SETUP_PROXIES: true,
    ACTION_SETUP_ROLES: true,
    ACTION_SETUP_PROXIES: true,
    VIEW_SETUP_EMAIL_TEMPLATES: true,
    ACTION_SETUP_EMAIL_TEMPLATES: true,
    VIEW_ADMIN: true,
    VIEW_ADMIN_EXPENSES: true,
    VIEW_ADMIN_REQUESTS: true,
    VIEW_ADMIN_CASH_ADVANCE_REQUESTS: true,
    VIEW_ADMIN_EXPENSES_WITH_REQUESTS: true,
    VIEW_ADMIN_BENEFITS: true,
    ACTION_ADMIN_ADD_REMARK_EXPENSES: true,
    ACTION_ADMIN_ADD_REMARK_REQUESTS: true,
    ACTION_ADMIN_ADD_REMARK_CASH_ADVANCE_REQUESTS: true,
    ACTION_ADMIN_ADD_REMARK_EXPENSES_WITH_REQUESTS: true,
    ACTION_ADMIN_ADD_REMARK_BENEFITS: true,
    ACTION_ADMIN_UPDATE_EXPENSES: true,
    ACTION_ADMIN_UPDATE_REQUESTS: true,
    ACTION_ADMIN_UPDATE_BENEFITS: true,
    ACTION_ADMIN_REJECT_EXPENSES: true,
    ACTION_ADMIN_REJECT_REQUESTS: true,
    ACTION_ADMIN_REJECT_BENEFITS: true,
    ACTION_ADMIN_EXECUTE_CLAIM_SETTLEMENT: true,
    ACTION_ADMIN_EXECUTE_REQUEST_POSTING: true,
    ACTION_ADMIN_DISBURSE_REJECT_CASH_ADVANCE_REQUEST: true,
    ACTION_BENEFIT_ADJUSTMENT: true,
    VIEW_EXPENSE_ADMIN_ATTACHED_RECEIPTS: true,
    VIEW_BENEFIT_ADMIN_ATTACHED_RECEIPTS: true,
    VIEW_ADMIN_EXPENSE_DETAILS: true,
    VIEW_ADMIN_BENEFIT_DETAILS: true,
    VIEW_EXPENSE_REPORTS: true,
    VIEW_REQUEST_REPORTS: true,
    VIEW_EXPENSES_WITH_REQUEST_REPORTS: true,
    VIEW_CASH_ADVANCE_REPORTS: true,
    VIEW_BENEFIT_REPORTS: true,
    VIEW_BENEFITS_ENTITLEMENT_REPORTS: true,
    VIEW_ADMIN_REQUEST_DETAILS: true,
    VIEW_SPECIALIZED_REPORTS: true,
    VIEW_BENEFITS_SPECIALIZED_REPORTS: true,
    VIEW_USER_PROFILE: true,
    ACTION_ADMIN_EXECUTE_BENEFIT_CLAIM_SETTLEMENT: true,
    VIEW_ALL_SETTLEMENT_LOGS: true,
    ACTION_SF_USERS_DETAILS: true,
  };
  const permissionCodes = Object.keys(permissionsMap);
  if (state.user) {
    const permissions = state.user.permissions;
    if (permissions) {
      permissionCodes.forEach((permissionCode: string) => {
        permissionsMap[permissionCode] = permissionCode in permissions;
      });
    } else {
      permissionCodes.forEach((permissionCode: string) => {
        permissionsMap[permissionCode] = false;
      });
    }
  }

  return permissionsMap;
};

export const getIsPresentInTargetAudience = (
  state: AUTH_STATE,
  permissionCode: string,
  userId: number,
): boolean => {
  if (state.user) {
    const permissions = state.user.permissions;
    if (permissions) {
      const permissionItem = permissions[permissionCode];
      if (permissionItem) {
        if (permissionItem.is_audience_all_employees) {
          const isLoggedInUser = state.user.id === userId;
          if (permissionItem.is_exclude_self && isLoggedInUser) {
            return false;
          }
          return true;
        }
        return permissionItem.target_audience.includes(
          parseInt(String(userId)),
        );
      }
    }
  }
  return false;
};
