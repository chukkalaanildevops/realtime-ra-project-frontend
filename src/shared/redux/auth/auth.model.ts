import { IUserForDD } from '../../model';

export interface AUTH_STATE {
  loading: boolean;
  isEntTenant: boolean;
  token: any;
  tenant: string;
  error: string;
  success: string;
  loadingMessage: string;
  tenantConfig?: {
    id: number;
    authenticationType: string;
    sso_url: string;
    slo_url: string;
  };
  user: any;
  areUsersFetched: boolean;
  users: IUserForDD[];
  activeUsers: IUserForDD[];
  usersLoader: boolean;
  jobInfo: any;
  expenseTypes: any[];
}

export const AUTH_TYPES = {
  JWT: 'JWT',
  SSO: 'SSO',
};

export const CONSTANTS = {
  TOKEN: 'TOKEN',
  TENANT: 'TENANT',
  USER_DATA: 'USER_DATA',
  DELEGATE_USER: 'DELEGATE_USER',
};
