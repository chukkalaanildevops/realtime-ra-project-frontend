export const LOG_ACTIONS = {
  SET_LOG_LIST: 'LOG_ACTIONS.SET_LOG_LIST',
  SET_LOG_DETAIL_DATA: 'LOG_ACTIONS.SET_LOG_DETAIL_DATA',
  SET_LOG_DETAIL_DATA_LOADER: 'LOG_ACTIONS.SET_LOG_DETAIL_DATA_LOADER',
  SET_LOG_LIST_LOADER: 'LOG_ACTIONS.SET_LOG_LIST_LOADER',
  SET_EMPLOYEE_APPROVERS_CF_DATA: 'LOG_ACTIONS.SET_EMPLOYEE_APPROVERS_CF_DATA',
  SET_EMPLOYEE_APPROVERS_CF_LIST_LOADER:
    'LOG_ACTIONS.SET_EMPLOYEE_APPROVERS_CF_LIST_LOADER',
  SET_APPROVERS_CUSTOM_FIELDS_LIST_DATA:
    'LOG_ACTIONS.SET_APPROVERS_CUSTOM_FIELDS_LIST_DATA',
  SET_EMPLOYEE_DEPENDENT_INFO_LIST_DATA:
    'LOG_ACTIONS.SET_EMPLOYEE_DEPENDENT_INFO_LIST_DATA',
  SET_DEPENDENT_INFO_LIST_LOADER: 'LOG_ACTIONS.SET_DEPENDENT_INFO_LIST_LOADER',
  SET_DEPENDENT_INFO_CF_LIST_DATA:
    'LOG_ACTIONS.SET_DEPENDENT_INFO_CF_LIST_DATA',
};

// LOADERS //

export const setLogListLoader = (status: boolean) => {
  return {
    type: LOG_ACTIONS.SET_LOG_LIST_LOADER,
    payload: status,
  };
};
export const setLogDetailDataLoader = (status: boolean) => {
  return {
    type: LOG_ACTIONS.SET_LOG_DETAIL_DATA_LOADER,
    payload: status,
  };
};

// Data Stores Functions//

export const setLogList = (data: any) => {
  return {
    type: LOG_ACTIONS.SET_LOG_LIST,
    payload: data,
  };
};

export const setLogDetailData = (data: any) => {
  return {
    type: LOG_ACTIONS.SET_LOG_DETAIL_DATA,
    payload: data,
  };
};

export const setEmployeeApproversCFData = (data: any) => {
  return {
    type: LOG_ACTIONS.SET_EMPLOYEE_APPROVERS_CF_DATA,
    payload: data,
  };
};
export const setEmployeeApproversCFListLoader = (status: boolean) => {
  return {
    type: LOG_ACTIONS.SET_EMPLOYEE_APPROVERS_CF_LIST_LOADER,
    payload: status,
  };
};
export const setApproversCustomFieldsListData = (data: any) => {
  return {
    type: LOG_ACTIONS.SET_APPROVERS_CUSTOM_FIELDS_LIST_DATA,
    payload: data,
  };
};

export const setEmployeeDependentInfoListData = (data: any) => {
  return {
    type: LOG_ACTIONS.SET_EMPLOYEE_DEPENDENT_INFO_LIST_DATA,
    payload: data,
  };
};
export const setDependentInfoListLoader = (status: boolean) => {
  return {
    type: LOG_ACTIONS.SET_DEPENDENT_INFO_LIST_LOADER,
    payload: status,
  };
};
export const setDependentInfoCFListData = (data: any) => {
  return {
    type: LOG_ACTIONS.SET_DEPENDENT_INFO_CF_LIST_DATA,
    payload: data,
  };
};
