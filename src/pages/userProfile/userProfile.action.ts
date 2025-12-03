export const USER_PROFILE_ACTION = {
  SET_LOADING: 'USER_PROFILE_ACTION/SET_LOADING',
  SET_ERROR: 'USER_PROFILE_ACTION/SET_ERROR',
  SET_USER_DATA: 'USER_PROFILE_ACTION/SET_USER_DATA',
  SET_ROLES: 'USER_PROFILE_ACTION/SET_ROLES',
  SET_EMPLOYEE_APPROVERS_DATA:
    'USER_PROFILE_ACTION/SET_EMPLOYEE_APPROVERS_DATA',
};

export const setLoader = (isLoading: boolean) => ({
  type: USER_PROFILE_ACTION.SET_LOADING,
  payload: isLoading,
});

export const setError = (error: string) => ({
  type: USER_PROFILE_ACTION.SET_ERROR,
  payload: error,
});

export const saveUserData = (user: any) => ({
  type: USER_PROFILE_ACTION.SET_USER_DATA,
  payload: user,
});

export const setRoles = (payload: any) => ({
  type: USER_PROFILE_ACTION.SET_ROLES,
  payload: payload,
});

export const setEmployeeApproversData = (data: any) => ({
  type: USER_PROFILE_ACTION.SET_EMPLOYEE_APPROVERS_DATA,
  payload: data,
});
