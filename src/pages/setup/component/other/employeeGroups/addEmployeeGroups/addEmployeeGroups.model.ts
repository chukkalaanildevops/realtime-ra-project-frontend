import * as Actions from './addEmployeeGroups.action';

export interface IaddEmployeeGroupReducerInitialState {
  formData: IformData;
  entityArr: any[];
  entityTypesArr: any[];
  entityArrLoader: boolean;
  entityTypesArrLoader: boolean;
  isUpdateMode: boolean;
  updateId: null | number;
  error: string;
  success: string;
  info: string;
  isLoading: boolean;
  backend_error: any;
}

export type TEmployeeGroupsListingReducer = (
  state: IaddEmployeeGroupReducerInitialState,
  { type, payload }: TActionCreaterInterfaces,
) => IaddEmployeeGroupReducerInitialState;

export interface IformData {
  title: string;
  criteria: string;
  entityType: string;
  relation: string;
  entities: number[];
  selectEmployees: any[];
  file?: File | null;
}

export interface IpostData {
  title: string;
  criteria:
    | 'ALLEMPS'
    | 'L1DREPO'
    | 'LV2REPO'
    | 'LV3REPO'
    | 'L2DREPO'
    | 'L3DREPO'
    | 'L23DREP'
    | 'ENTITYM'
    | 'INDSELU'
    | 'CUSTOMU';
  selected_users?: number[];
  is_criteria_based: boolean;
  custom_config?: IcustomConfig[];
  file?: File;
}

export interface IcustomConfig {
  entity_type: number;
  operator: 'NOTIN' | 'IN' | 'IS' | 'ISNOT';
  entities: number[];
}

export interface RouteParams {
  id: string;
  param2?: string;
}

/**
 * Actions Related Interface and Types.
 */

export type TActionCreaterInterfaces =
  | IapiCallRequestReturn
  | IapiCallSuccessReturn
  | IapiCallFailReturn
  | IapiCallResetReturn
  | IresetToInitialReturn
  | IupdateEntityArrLoader
  | IupdateEntityTypesArrLoader
  | IupdateEntityArr
  | IupdateEntityTypesArr
  | IupdateBackendError
  | IupdateUpdateId
  | IsaveEmployeeGroupUpdateData
  | IsaveEmployeeGroupSelectedEmployee
  | IresetForm;

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
  payload?: any;
}

export type TresetToInitialFn = () => IresetToInitialReturn;

export interface IupdateEntityArrLoader {
  type: typeof Actions.UPDATE_ENTITY_ARR_LOADER;
  payload: boolean;
}

export type TupdateEntityArrLoader = (data: boolean) => IupdateEntityArrLoader;

export interface IupdateEntityTypesArrLoader {
  type: typeof Actions.UPDATE_ENTITY_TYPES_ARR_LOADER;
  payload: boolean;
}

export type TupdateEntityTypesArrLoader = (
  data: boolean,
) => IupdateEntityTypesArrLoader;

export interface IupdateEntityArr {
  type: typeof Actions.UPDATE_ENTITY_ARR;
  payload: any[];
}

export type TupdateEntityArr = (data: any[]) => IupdateEntityArr;

export interface IupdateEntityTypesArr {
  type: typeof Actions.UPDATE_ENTITY_TYPES_ARR;
  payload: any[];
}

export type TupdateEntityTypesArr = (data: any[]) => IupdateEntityTypesArr;

export interface IupdateFormData {
  type: typeof Actions.UPDATE_FORM_DATA;
  payload: IformData;
}

export type TupdateFormData = (data: IformData) => IupdateFormData;

export interface IupdateBackendError {
  type: typeof Actions.UPDATE_BACKEND_ERROR;
  payload: any;
}

export type TupdateBackendError = (data: any) => IupdateBackendError;

export interface IupdateUpdateId {
  type: typeof Actions.UPDATE_UPDATE_ID;
  payload: string;
}

export type TupdateUpdateId = (data: string) => IupdateUpdateId;

export interface IsaveEmployeeGroupUpdateData {
  type: typeof Actions.SAVE_EMPLOYEE_GROUP_UPDATE_DATA;
  payload: any;
}

export type TsaveEmployeeGroupUpdateData = (
  data: any,
) => IsaveEmployeeGroupUpdateData;

export interface IsaveEmployeeGroupSelectedEmployee {
  type: typeof Actions.SAVE_EMPLOYEE_GROUP_SELECTED_EMPLOYEE;
  payload: number[];
}

export type TsaveEmployeeGroupSelectedEmployee = (
  data: number[],
) => IsaveEmployeeGroupSelectedEmployee;

export interface IresetForm {
  type: typeof Actions.RESET_FORM;
  payload?: any;
}

export type TresetForm = () => IresetForm;
