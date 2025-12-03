import * as Models from './emailTemplates.models';
import * as Actions from './emailTemplates.actions';

const initialState: Models.IEmailTemplates = {
  emailTemplates: [],
  isLoading: true,
  serviceCallFailed: false,
  formSubmissionInProgress: false,
  formSubmissionSuccessful: false,
  formErrors: {},
  triggerTypes: [],
  cronData: {
    frequency: 'ED',
    daysOfWeek: [],
    daysOfMonth: [],
  },
};

const EmailTemplatesReducer = (
  state: Models.IEmailTemplates = initialState,
  action: { type: string; payload: any },
) => {
  switch (action.type) {
    case Actions.SET_LOADER:
      return {
        ...state,
        ...action.payload,
      };

    case Actions.SET_EMAIL_TEMPLATES:
      return {
        ...state,
        ...action.payload,
      };

    case Actions.SET_SERVICE_CALL_FAILED:
      return {
        ...state,
        ...action.payload,
      };

    case Actions.SET_FORM_SUBMISSION_IN_PROGRESS:
      return {
        ...state,
        ...action.payload,
      };

    case Actions.SET_FORM_SUBMISSION_SUCCESSFUL:
      return {
        ...state,
        ...action.payload,
      };

    case Actions.SET_FORM_ERRORS:
      return {
        ...state,
        ...action.payload,
      };

    case Actions.SET_TRIGGER_TYPES:
      return {
        ...state,
        ...action.payload,
      };

    case Actions.SET_CRON_DATA:
      return {
        ...state,
        cronData: {
          ...state.cronData,
          ...action.payload,
        },
      };

    default:
      return state;
  }
};

export default EmailTemplatesReducer;
