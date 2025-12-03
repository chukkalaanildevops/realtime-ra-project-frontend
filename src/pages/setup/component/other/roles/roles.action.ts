export const SET_LOADER = 'SET_LOADER';
export const SET_SERVICE_CALL_FAILED = 'SET_SERVICE_CALL_FAILED';
export const UPDATE_ROLES = 'UPDATE_ROLES';
export const SET_ROLE_DETAILS = 'SET_ROLE_DETAILS';
export const SET_FORM_SUBMISSION_IN_PROGRESS =
  'SET_FORM_SUBMISSION_IN_PROGRESS';
export const SET_FORM_SUBMISSION_SUCCESSFUL = 'SET_FORM_SUBMISSION_SUCCESSFUL';
export const SET_FORM_ERRORS = 'SET_FORM_ERRORS';

export const setLoader = (isLoading: boolean) => ({
  type: SET_LOADER,
  payload: {
    isLoading: isLoading,
  },
});

export const updateRoles = (roles: { [key: string]: any }[]) => ({
  type: UPDATE_ROLES,
  payload: {
    roles: roles,
    isLoading: false,
    serviceCallFailed: false,
    formSubmissionInProgress: false,
    formSubmissionSuccessful: false,
  },
});

export const setServiceCallFailed = (hasFailed: boolean, error?: string) => ({
  type: SET_SERVICE_CALL_FAILED,
  payload: {
    isLoading: false,
    serviceCallFailed: hasFailed,
    serviceCallError: error,
  },
});

export const setRoleDetails = (roleDetails: { [key: string]: any }) => ({
  type: SET_ROLE_DETAILS,
  payload: {
    isLoading: false,
    roleDetails: roleDetails,
    serviceCallFailed: false,
  },
});

export const setFormSubmissionInProgress = (inProgress: boolean) => ({
  type: SET_FORM_SUBMISSION_IN_PROGRESS,
  payload: {
    formSubmissionInProgress: inProgress,
  },
});

export const setFormSubmissionSuccessful = (isSuccessful: boolean) => ({
  type: SET_FORM_SUBMISSION_SUCCESSFUL,
  payload: {
    formSubmissionSuccessful: isSuccessful,
  },
});

export const setFormErrors = (formErrors: { [key: string]: any }[]) => ({
  type: SET_FORM_ERRORS,
  payload: {
    formErrors: formErrors,
  },
});
