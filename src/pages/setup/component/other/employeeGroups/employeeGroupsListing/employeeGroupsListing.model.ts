import * as Actions from './employeeGroupsListing.action';

/**
 * Component Related Interface and Types.
 */

export interface IEmployeeDetails {
  created_by: IcreatedBy | null;
  created_on: string;
  modified_by: IcreatedBy | null;
  modified_on: string;
  deleted_by: IcreatedBy | null;
  deleted_on: string;
  is_deleted: boolean;
  id: number;
  effective_from: string;
  employee: IidNameEmail;
  emp_id: string;
  reason: {
    id: number;
    event_name: string;
    event_reason: string;
  };
  hire_date: string;
  is_active: boolean;
  pay_grade: IiRTI;
  employee_group: IiRTI;
  employee_sub_group: IiRTI;
  location: string;
  contract_type: null | any; //unknown type
  contract_start_date: null | any; //unknown type
  contract_end_date: null | any; //unknown type
  termination_date: null | any; //unknown type
  confirmation_date: null | any; //unknown type
  cost_centre_uuid: string;
  manager: IidNameEmail;
  uuid: string;
}

interface IidNameEmail {
  id: number;
  name: string;
  email: string;
}

interface IiRTI {
  id: number;
  reference_object: string;
  title: string;
  is_deleted: boolean;
}

export interface Iemployee {
  id: number;
  name: string;
  legal_name: string;
  email: string;
  username: string;
}

/**
 * Reducer Related Interface and Types.
 */
export interface IemployeeGroupReducerInitialState {
  employee_group_list: TemployeeGroupList;
  employee_group_selected: TemployeeGroupSelected;
  employee_group_list_loader: boolean;
  employee_list: Iemployee[];
  pagination_data: IpaginationData;
  employe_list_loader: boolean;
  error: string;
  backend_error: {};
  info: string;
  success: string;
  isLoading: boolean;
}

export interface IpaginationData {
  number_of_pages: number;
  total_records: number;
}

export type TresponseEmplListData = Iemployee & {
  total_employees_count: number;
};

export type TresponseEmplListDataArr = TresponseEmplListData[];

export type TemployeeGroupSelected = null | IemployeeGroup;

export type TemployeeGroupList = IemployeeGroup[];

export interface IemployeeGroup {
  created_by: IcreatedBy;
  created_on: null | string;
  modified_by: IcreatedBy;
  modified_on: string;
  deleted_by: null | IcreatedBy;
  deleted_on: null | string;
  is_deleted: boolean;
  id: number;
  title: string;
  criteria: {
    code:
      | 'ALLEMPS'
      | 'L1DREPO'
      | 'LV2REPO'
      | 'LV3REPO'
      | 'L2DREPO'
      | 'L3DREPO'
      | 'L23DREP'
      | 'ENTITYM'
      | 'INDSELU'
      | 'CUSTOMU'
      | string;
    title: string;
  };
  selected_users: IcreatedBy[];
  is_criteria_based: boolean;
  custom_config: any;
}

export interface IcreatedBy {
  id: number;
  name: string;
  legal_name: string;
  email: string;
  username: string;
}

export type TEmployeeGroupsListingReducer = (
  state: IemployeeGroupReducerInitialState,
  { type, payload }: TActionCreaterInterfaces,
) => IemployeeGroupReducerInitialState;

/**
 * Actions Related Interface and Types.
 */

export type TActionCreaterInterfaces =
  | IapiCallRequestReturn
  | IapiCallSuccessReturn
  | IapiCallFailReturn
  | IapiCallResetReturn
  | IresetToInitialReturn
  | IsaveEmployeeGroupListReturn
  | IupdateEmployeeGroupListLoaderVisibilityReturn
  | IupdateEmployeeGroupSelectedReturn
  | IsaveEmployeeGroupSelectedEmployeeReturn
  | IupdateEmployeeGroupSelectedEmployeeListLoaderReturn
  | IsavePaginationDataReturn;

export interface IapiCallRequestReturn {
  type: typeof Actions.API_CALL_REQUEST;
  payload: {
    error: string;
    success: string;
    info: string;
    isLoading: boolean;
  };
}

export type TapiCallRequestFn = (
  isLoading?: boolean,
  info?: string,
) => IapiCallRequestReturn;

export interface IapiCallSuccessReturn {
  type: typeof Actions.API_CALL_SUCCESS;
  payload: {
    error: string;
    success: string;
    info: string;
    isLoading: boolean;
  };
}

export type TapiCallSuccessFn = (success?: string) => IapiCallSuccessReturn;

export interface IapiCallFailReturn {
  type: typeof Actions.API_CALL_FAIL;
  payload: {
    error: string;
    success: string;
    info: string;
    isLoading: boolean;
  };
}

export type TapiCallFailFn = (err?: string) => IapiCallFailReturn;

export interface IapiCallResetReturn {
  type: typeof Actions.API_CALL_RESET;
  payload: {
    error: string;
    success: string;
    info: string;
    isLoading: boolean;
  };
}

export type TapiCallResetFn = () => IapiCallResetReturn;

export interface IresetToInitialReturn {
  type: typeof Actions.RESET_TO_INITIAL;
  payload?: {};
}

export type TresetToInitialFn = () => IresetToInitialReturn;

export interface IsaveEmployeeGroupListReturn {
  type: typeof Actions.UPDATE_EMPLOYEE_GROUP_LIST;
  payload: any;
  //   payload: TemployeeGroupList;
}

export type TsaveEmployeeGroupList = (
  data: TemployeeGroupList,
) => IsaveEmployeeGroupListReturn;

export interface IupdateEmployeeGroupListLoaderVisibilityReturn {
  type: typeof Actions.UPDATE_EMPLOYEE_GROUP_LIST_LOADER;
  payload: boolean;
}

export type TupdateEmployeeGroupListLoaderVisibility = (
  data: boolean,
) => IupdateEmployeeGroupListLoaderVisibilityReturn;

export interface IupdateEmployeeGroupSelectedReturn {
  type: typeof Actions.UPDATE_EMPLOYEE_GROUP_SELECTED;
  payload: TemployeeGroupSelected;
}

export type TupdateEmployeeGroupSelected = (
  data: TemployeeGroupSelected,
) => IupdateEmployeeGroupSelectedReturn;

export interface IsaveEmployeeGroupSelectedEmployeeReturn {
  type: typeof Actions.SAVE_EMPLOYEE_GROUP_SELECTED_EMPLOYEE;
  payload: Iemployee[];
}

export type TsaveEmployeeGroupSelectedEmployee = (
  data: Iemployee[],
) => IsaveEmployeeGroupSelectedEmployeeReturn;

export interface IupdateEmployeeGroupSelectedEmployeeListLoaderReturn {
  type: typeof Actions.SAVE_EMPLOYEE_GROUP_SELECTED_EMPLOYEE;
  payload: boolean;
}

export type TupdateEmployeeGroupSelectedEmployeeListLoader = (
  data: boolean,
) => IupdateEmployeeGroupSelectedEmployeeListLoaderReturn;

export interface IsavePaginationDataReturn {
  type: typeof Actions.UPDATE_TOTAL_EMPLOYEE_COUNT;
  payload: IpaginationData;
}

export type TsavePaginationData = (
  data: IpaginationData,
) => IsavePaginationDataReturn;
