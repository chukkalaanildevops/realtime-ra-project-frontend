import { IAdminDelegateState } from './adminDelegate.model';
import { DELEGATE_ACTIONS } from './adminDelegate.action';

const initialState: IAdminDelegateState = {
  isLoading: true,
  permissions: [],
  delegations: [],
  paginationData: {},
  formSubmissionInProgress: false,
  errorObject: undefined,
};

export default (state = initialState, action: any): IAdminDelegateState => {
  const { type, payload } = action;

  switch (type) {
    case DELEGATE_ACTIONS.SET_LOADER:
      return {
        ...state,
        ...payload,
      };

    case DELEGATE_ACTIONS.SET_PROXY_PERMISSIONS:
      return {
        ...state,
        ...payload,
      };

    case DELEGATE_ACTIONS.SET_DELEGATIONS:
      return {
        ...state,
        ...payload,
      };

    case DELEGATE_ACTIONS.SET_FORM_SUBMISSION_SUCCESS:
      return {
        ...state,
        ...payload,
      };

    case DELEGATE_ACTIONS.SET_FORM_SUBMISSION_INPROGRESS:
      return {
        ...state,
        ...payload,
      };

    case DELEGATE_ACTIONS.SET_ERROR_OBJECT:
      return { ...state, errorObject: payload };

    default:
      return state;
  }
};
