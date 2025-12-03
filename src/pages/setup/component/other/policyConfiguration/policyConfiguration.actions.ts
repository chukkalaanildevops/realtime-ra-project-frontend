export const SET_POLICY_CONFIGURATION = 'SET_POLICY_CONFIGURATION';
export const SET_POLICY_CONFIGURATION_STATE = 'SET_POLICY_CONFIGURATION_STATE';
export const SET_LOADER = 'SET_LOADER';
export const SET_SERVICE_CALL_FAILED = 'SET_SERVICE_CALL_FAILED';
export const SET_POLICY_CONFIGURATION_DETAILS =
  'SET_POLICY_CONFIGURATION_DETAILS';
export const SET_POLICY_CONFIGURATION_DETAILS_LOADING =
  'SET_POLICY_CONFIGURATION_DETAILS_LOADING';
// export const SET_FORM_SUBMISSION_IN_PROGRESS =
//   'SET_FORM_SUBMISSION_IN_PROGRESS';
export const SET_FORM_SUBMISSION_IN_PROGRESS =
  'SET_FORM_SUBMISSION_IN_PROGRESS';
export const SET_LIST_ENTITIES = 'SET_LIST_ENTITIES';
export const SET_LIST_ALL_EMPLOYEE_GROUPS = 'SET_LIST_ALL_EMPLOYEE_GROUPS';
export const SET_LIST_ALL_PAY_GRADES = 'SET_LIST_ALL_PAY_GRADES';
export const SET_LIST_ALL_SF_EMPLOYEE_GROUPS =
  'SET_LIST_ALL_SF_EMPLOYEE_GROUPS';
export const SET_POLICY_CONFIGURATION_CONFIRMATION =
  'SET_POLICY_CONFIGURATION_CONFIRMATION';
// export const SET_FORM_SUBMISSION_SUCCESSFUL = 'SET_FORM_SUBMISSION_SUCCESSFUL';
// export const SET_FORM_ERRORS = 'SET_FORM_ERRORS';

export const setLoader = (isLoading: boolean) => ({
  type: SET_LOADER,
  payload: {
    isLoading: isLoading,
  },
});

export const setPolicyListingPageLoader = (isLoading: boolean) => ({
  type: SET_LOADER,
  payload: {
    isPolicyPageLoading: isLoading,
  },
});

export const setPolicyConfiguration = (data: any) => {
  return {
    type: SET_POLICY_CONFIGURATION,
    payload: {
      policyConfiguration: data.data,
      pagination_data: data.pagination_data,
      isLoading: false,
      serviceCallFailed: false,
    },
  };
};

export const setPolicyConfirmationInfo = (confirmationData: any) => {
  return {
    type: SET_POLICY_CONFIGURATION_STATE,
    payload: { confirmationInfo: confirmationData },
  };
};

export const resetPolicyConfirmationInfo = () => {
  return {
    type: SET_POLICY_CONFIGURATION,
    payload: {
      policyUpdateId: [],
      confirmationInfo: { visibility: false, okBtnFn: () => {} },
    },
  };
};

export const setPolicyUpdateId = (data: []) => {
  return {
    type: SET_POLICY_CONFIGURATION,
    payload: {
      policyUpdateId: data,
    },
  };
};

export const setPolicyConfigurationDetail = (data: any) => {
  return {
    type: SET_POLICY_CONFIGURATION_STATE,
    payload: {
      policyConfigurationDetail: data,
      isLoading: false,
      serviceCallFailed: false,
    },
  };
};

export const setServiceCallFailed = (hasFailed: boolean, error?: any) => ({
  type: SET_SERVICE_CALL_FAILED,
  payload: {
    isLoading: false,
    serviceCallFailed: hasFailed,
    serviceCallError: error,
  },
});

export const setServiceCallFailedPolicyLists = (
  hasFailed: boolean,
  error?: any,
) => ({
  type: SET_SERVICE_CALL_FAILED,
  payload: {
    isPolicyPageLoading: false,
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

export const setPolicyConfigurationState = (data: { [key: string]: any }) => ({
  type: SET_POLICY_CONFIGURATION_STATE,
  payload: {
    ...data,
  },
});

// export const setFormSubmissionSuccessful = (isSuccessful: boolean) => ({
//   type: SET_FORM_SUBMISSION_SUCCESSFUL,
//   payload: {
//     formSubmissionSuccessful: isSuccessful,
//   },
// });

// export const setFormErrors = (formErrors: { [key: string]: any }[]) => ({
//   type: SET_FORM_ERRORS,
//   payload: {
//     formErrors: formErrors,
//   },
// });

export const setPolicyConfigDetails = (data: any) => ({
  type: SET_POLICY_CONFIGURATION_DETAILS,
  payload: data,
});

export const setPolicyConfigurationDetailsLoader = (isLoading: boolean) => ({
  type: SET_POLICY_CONFIGURATION_DETAILS_LOADING,
  payload: isLoading,
});

export const setListEntities = (data: any) => {
  return {
    type: SET_POLICY_CONFIGURATION_STATE,
    payload: {
      listEntities: data,
    },
  };
};

export const setListDivisions = (data: any) => {
  return {
    type: SET_POLICY_CONFIGURATION_STATE,
    payload: {
      listDivisions: data,
    },
  };
};

export const setListBusinessUnits = (data: any) => {
  return {
    type: SET_POLICY_CONFIGURATION_STATE,
    payload: {
      listBusinessUnits: data,
    },
  };
};

export const setListDepartments = (data: any) => {
  return {
    type: SET_POLICY_CONFIGURATION_STATE,
    payload: {
      listDepartments: data,
    },
  };
};

export const setListAllEmployeeGroups = (data: any) => {
  return {
    type: SET_POLICY_CONFIGURATION_STATE,
    payload: {
      listAllEmployeeGroups: data,
    },
  };
};

export const setListAllPayGrades = (data: any) => {
  return {
    type: SET_POLICY_CONFIGURATION_STATE,
    payload: {
      listAllPayGrades: data,
    },
  };
};

export const setListAllSfEmployeeGroups = (data: any) => {
  return {
    type: SET_POLICY_CONFIGURATION_STATE,
    payload: {
      listAllSfEmployeeGroups: data,
    },
  };
};

export const setListAllExpanseTypes = (data: any) => {
  return {
    type: SET_POLICY_CONFIGURATION_STATE,
    payload: {
      listExpenseTypes: data,
    },
  };
};

export const setListAllRequestType = (data: any) => {
  return {
    type: SET_POLICY_CONFIGURATION_STATE,
    payload: {
      listAllRequestTypes: data,
    },
  };
};

export const setListAllTargetTypes = (data: any) => {
  return {
    type: SET_POLICY_CONFIGURATION_STATE,
    payload: {
      listTargetTypes: data,
    },
  };
};

export const setListExpenseCategory = (data: any) => {
  return {
    type: SET_POLICY_CONFIGURATION_STATE,
    payload: {
      listExpenseCategory: data,
    },
  };
};

export const setPermission = (data: any) => {
  return {
    type: SET_POLICY_CONFIGURATION_STATE,
    payload: {
      isPermission: data,
    },
  };
};
