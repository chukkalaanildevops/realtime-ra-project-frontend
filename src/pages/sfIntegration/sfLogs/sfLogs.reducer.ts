import { LOG_ACTIONS } from './sfLogs.actions';

export const initialState: any = {
  logList: [],
  logListLoader: false,
  logDetailData: [],
  logDetailDataListLoader: false,
  approversCustomFieldsListData: {},
  employeeApproversCFData: {},
  employeeApproversCFListLoader: false,
  dependentInfoCFListData: {},
  employeeDependentInfoListData: {},
  dependentInfoListLoader: false,
};
const SfLogsReducer: any = (
  state = initialState,
  actions: { type: any; payload: any },
) => {
  const { type, payload } = actions;

  switch (type) {
    // LOADERS //

    case LOG_ACTIONS.SET_LOG_LIST_LOADER:
      return {
        ...state,
        logListLoader: payload,
      };
    case LOG_ACTIONS.SET_LOG_DETAIL_DATA_LOADER:
      return {
        ...state,
        logDetailDataListLoader: payload,
      };

    // Data Stores //
    case LOG_ACTIONS.SET_LOG_LIST:
      return {
        ...state,
        logList: payload,
      };
    case LOG_ACTIONS.SET_LOG_DETAIL_DATA:
      return {
        ...state,
        logDetailData: payload,
      };
    case LOG_ACTIONS.SET_EMPLOYEE_APPROVERS_CF_DATA:
      return {
        ...state,
        employeeApproversCFData: payload,
      };
    case LOG_ACTIONS.SET_EMPLOYEE_APPROVERS_CF_LIST_LOADER:
      return {
        ...state,
        employeeApproversCFListLoader: payload,
      };
    case LOG_ACTIONS.SET_APPROVERS_CUSTOM_FIELDS_LIST_DATA:
      return {
        ...state,
        approversCustomFieldsListData: payload,
      };
    case LOG_ACTIONS.SET_EMPLOYEE_DEPENDENT_INFO_LIST_DATA:
      return {
        ...state,
        employeeDependentInfoListData: payload,
      };
    case LOG_ACTIONS.SET_DEPENDENT_INFO_LIST_LOADER:
      return {
        ...state,
        dependentInfoListLoader: payload,
      };
    case LOG_ACTIONS.SET_DEPENDENT_INFO_CF_LIST_DATA:
      return {
        ...state,
        dependentInfoCFListData: payload,
      };

    default:
      return state;
  }
};

export default SfLogsReducer;
