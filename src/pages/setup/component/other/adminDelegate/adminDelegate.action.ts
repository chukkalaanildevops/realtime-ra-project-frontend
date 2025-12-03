import { errorObject } from './adminDelegate.model';

export const DELEGATE_ACTIONS = {
  SET_LOADER: 'DELEGATE_ACTIONS/SET_LOADER',
  SET_PROXY_PERMISSIONS: 'DELEGATE_ACTIONS/SET_PROXY_PERMISSIONS',
  SET_DELEGATIONS: 'DELEGATE_ACTIONS/SET_DELEGATIONS',
  SET_FORM_SUBMISSION_SUCCESS: 'DELEGATE_ACTIONS/SET_FORM_SUBMISSION_SUCCESS',
  SET_FORM_SUBMISSION_INPROGRESS:
    'DELEGATE_ACTIONS/SET_FORM_SUBMISSION_INPROGRESS',
  SET_ERROR_OBJECT: 'DELEGATE_ACTIONS/SET_ERROR_OBJECT',
};

export const setLoader = (isLoading: boolean) => ({
  type: DELEGATE_ACTIONS.SET_LOADER,
  payload: {
    isLoading: isLoading,
  },
});

export const setProxyPermissions = (data: any[]) => ({
  type: DELEGATE_ACTIONS.SET_PROXY_PERMISSIONS,
  payload: {
    permissions: data,
  },
});

export const setDelegations = (
  delegations: { [key: string]: any }[],
  paginationData: { [key: string]: any },
) => ({
  type: DELEGATE_ACTIONS.SET_DELEGATIONS,
  payload: {
    delegations: delegations,
    paginationData: paginationData,
  },
});

export const setFormSubmissionSuccess = (success: boolean) => ({
  type: DELEGATE_ACTIONS.SET_FORM_SUBMISSION_SUCCESS,
  payload: {
    formSubmissionSuccessful: success,
  },
});

export const setFormSubmissionInProgress = (inProgress: boolean) => ({
  type: DELEGATE_ACTIONS.SET_FORM_SUBMISSION_INPROGRESS,
  payload: {
    formSubmissionInProgress: inProgress,
  },
});

export const setErrorObject = (status?: boolean, data?: errorObject) => ({
  type: DELEGATE_ACTIONS.SET_ERROR_OBJECT,
  payload: data,
  status,
});
