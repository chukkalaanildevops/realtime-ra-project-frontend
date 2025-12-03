export const SET_EMAIL_TEMPLATES = 'SET_EMAIL_TEMPLATES';
export const SET_LOADER = 'SET_LOADER';
export const SET_SERVICE_CALL_FAILED = 'SET_SERVICE_CALL_FAILED';
export const SET_FORM_SUBMISSION_IN_PROGRESS =
  'SET_FORM_SUBMISSION_IN_PROGRESS';
export const SET_FORM_SUBMISSION_SUCCESSFUL = 'SET_FORM_SUBMISSION_SUCCESSFUL';
export const SET_FORM_ERRORS = 'SET_FORM_ERRORS';
export const SET_TRIGGER_TYPES = 'SET_TRIGGER_TYPES';
export const SET_CRON_DATA = 'SET_CRON_DATA';

export const setLoader = (isLoading: boolean) => ({
  type: SET_LOADER,
  payload: {
    isLoading: isLoading,
  },
});

export const setEmailTemplates = (
  emailTemplates: { [key: string]: any }[],
) => ({
  type: SET_EMAIL_TEMPLATES,
  payload: {
    emailTemplates: emailTemplates,
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

export const setTriggerTypes = (data: any) => ({
  type: SET_TRIGGER_TYPES,
  payload: {
    triggerTypes: data,
  },
});

export const setCronData: any = (key: string, value: any) => {
  let data: { [key: string]: any } = { [key]: value };
  return {
    type: SET_CRON_DATA,
    payload: data,
  };
};
