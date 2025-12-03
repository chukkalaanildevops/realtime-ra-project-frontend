import { IUserProfile } from './userProfile.model';
import { USER_PROFILE_ACTION } from './userProfile.action';

export const initialState: IUserProfile = {
  error: '',
  loader: false,
  userData: undefined,
  roles: [],
  employeeApproversData: {},
};

export default (state = initialState, action: any) => {
  const { payload, type } = action;

  switch (type) {
    case USER_PROFILE_ACTION.SET_LOADING:
      return {
        ...state,
        loader: payload,
      };
    case USER_PROFILE_ACTION.SET_ERROR:
      return {
        ...state,
        error: payload,
      };
    case USER_PROFILE_ACTION.SET_USER_DATA:
      return {
        ...state,
        userData: payload,
      };
    case USER_PROFILE_ACTION.SET_ROLES:
      return {
        ...state,
        roles: payload,
      };
    case USER_PROFILE_ACTION.SET_EMPLOYEE_APPROVERS_DATA:
      return {
        ...state,
        employeeApproversData: payload,
      };

    default:
      return state;
  }
};

export const getLoader = (state: IUserProfile) => state.loader;

export const getErrorMessage = (state: IUserProfile) => state.error;

export const getUserProfileData = (state: IUserProfile) => state.userData;

export const getRoles = (state: IUserProfile) => state.roles;
