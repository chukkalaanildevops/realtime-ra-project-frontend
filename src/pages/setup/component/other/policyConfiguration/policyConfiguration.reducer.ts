import * as Models from './policyConfiguration.models';
import * as Actions from './policyConfiguration.actions';

export const initialState: Models.IPolicyConfiguration = {
  policyConfiguration: [],
  policyConfigurationDetail: {},
  isLoading: true,
  serviceCallFailed: false,
  formSubmissionInProgress: false,
  formSubmissionSuccessful: false,
  formErrors: {},
  policyConfigurationDetailsLoader: false,
  policyConfigurationDetails: {},
  listEntities: [],
  listDivisions: [],
  listBusinessUnits: [],
  listDepartments: [],
  listAllEmployeeGroups: [],
  listAllPayGrades: [],
  listAllSfEmployeeGroups: [],
  listExpenseTypes: [],
  listAllRequestTypes: [],
  listTargetTypes: [],
  listExpenseCategory: [],
  pagination_data: {
    next_page: null,
    number_of_pages: 0,
    previous_page: null,
    total_records: 0,
  },
  policyUpdateId: [],
  confirmationInfo: {
    visibility: false,
    okBtnFn: () => {},
    params: null,
  },
  isPermission: false,
  isPolicyPageLoading: false,
};

const PolicyConfigurationReducer = (
  state: Models.IPolicyConfiguration = initialState,
  action: { type: string; payload: any },
) => {
  switch (action.type) {
    case Actions.SET_LOADER:
      return {
        ...state,
        ...action.payload,
      };

    case Actions.SET_POLICY_CONFIGURATION:
      return {
        ...state,
        ...action.payload,
      };

    case Actions.SET_SERVICE_CALL_FAILED:
      return {
        ...state,
        ...action.payload,
      };
    case Actions.SET_POLICY_CONFIGURATION_DETAILS_LOADING:
      return {
        ...state,
        policyConfigurationDetailsLoader: action.payload,
      };
    case Actions.SET_POLICY_CONFIGURATION_DETAILS:
      return {
        ...state,
        policyConfigurationDetails: action.payload,
      };
    case Actions.SET_POLICY_CONFIGURATION_STATE:
      return {
        ...state,
        ...action.payload,
      };

    default:
      return state;
  }
};

export default PolicyConfigurationReducer;

export const getPolicyConfiguration = (state: Models.IPolicyConfiguration) =>
  state.policyConfiguration;

// export const getPolicyConfigurationLoader = (
//   state: Models.IPolicyConfiguration,
// ) => state.loader;

export const getPolicyConfigurationDetailsLoader = (
  state: Models.IPolicyConfiguration,
) => state.policyConfigurationDetailsLoader;

export const getPolicyConfigurationDetails = (
  state: Models.IPolicyConfiguration,
) => state.policyConfigurationDetails;
