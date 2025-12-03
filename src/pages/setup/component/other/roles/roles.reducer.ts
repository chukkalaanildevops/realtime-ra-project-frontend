import * as Models from './roles.model';
import * as Actions from './roles.action';

export const initialState: Models.IRoles = {
  roles: [],
  roleDetails: null,
  isLoading: true,
  serviceCallFailed: false,
  formSubmissionInProgress: false,
  formSubmissionSuccessful: false,
  formErrors: {},
};

const RolesReducer = (
  state: Models.IRoles = initialState,
  action: { type: string; payload: any },
) => {
  switch (action.type) {
    case Actions.SET_LOADER:
      return {
        ...state,
        ...action.payload,
      };

    case Actions.UPDATE_ROLES:
      return {
        ...state,
        ...action.payload,
      };

    case Actions.SET_ROLE_DETAILS:
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

    default:
      return state;
  }
};

export default RolesReducer;
