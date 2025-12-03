import { ActionType } from './wageType.actions';

// reducer initial state interface -----------------------------------------------------------
export interface IwageTypeInitialState {
  wageTypeList: TwageTypeList;
  pagination_data: IpaginationData;
  wageTypeListLoader: boolean;
  wageTypeListDDCompatible: TwageTypeListDDCompatible;
  wageTypeListDDCompatibleLoader: boolean;
  selectedWageType: IwageType | null;
  selectedWageTypeHistory: IwageTypeHistory[] | null;
  selectedWageTypeHistoryLoader: boolean;
  singleWageTypeLoader: boolean;
  formData: IformData;
  updateId: string | null;
  isUpdateMode: boolean;
  isAddMode: boolean;
  isLoading: boolean;
  success: string;
  info: string;
  error: string;
  backend_error: any;
}

export interface IpaginationData {
  total_records: number;
  total_number_of_pages: number;
}

export interface IwageTypeHistory {
  field_name: string;
  action: string;
  old_value: string;
  new_value: string;
  created_by: string;
  created_on: string;
}

export interface IformData {
  title: string;
}

export type TwageTypeList = IwageType[];

export interface IwageTypeListDDCompatible {
  id: number;
  title: string;
}

export type TwageTypeListDDCompatible = IwageTypeListDDCompatible[];
export interface IwageType {
  created_by: IidNameEmailUsername | null;
  created_on: string | null;
  modified_by: IidNameEmailUsername | null;
  modified_on: string | null;
  deleted_by: IidNameEmailUsername | null;
  deleted_on: string | null;
  is_deleted: boolean;
  id: number;
  title: string;
}

export interface IidNameEmailUsername {
  id: number;
  name: string;
  legal_name: string;
  email: string;
  username: string;
}

export interface RouteParams {
  id: string;
  param2?: string;
}

//  Reducer function type ---------------------------------------------------------------------
export type TWageTypeReducerFN = (
  state: IwageTypeInitialState,
  action: Taction,
) => IwageTypeInitialState;

export type Taction =
  | IsaveWageTypeListReturn
  | IapiCallRequestReturn
  | IapiCallSuccessReturn
  | IapiCallFailReturn
  | IapiCallResetReturn
  | IresetToInitialReturn
  | IsetWageTypeListLoaderReturn
  | IsetSelectedWageTypeReturn
  | IsetFormDataReturn
  | IresetFormDataReturn
  | IsetAddModeReturn
  | IsetUpdateModeReturn
  | IsetUpdateIdReturn
  | IsetSingleWageTypeLoaderReturn
  | IsetBackendErrorReturn
  | IsaveWageTypeListPaginatoDataReturn
  | any;

// Action --------------------------------------------------------------------------------------

export interface IapiCallRequestReturn {
  type: typeof ActionType.API_CALL_REQUEST;
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
  type: typeof ActionType.API_CALL_SUCCESS;
  payload: {
    error: string;
    success: string;
    info: string;
    isLoading: boolean;
  };
}

export type TapiCallSuccessFn = (success?: string) => IapiCallSuccessReturn;

export interface IapiCallFailReturn {
  type: typeof ActionType.API_CALL_FAIL;
  payload: {
    error: string;
    success: string;
    info: string;
    isLoading: boolean;
  };
}

export type TapiCallFailFn = (err?: string) => IapiCallFailReturn;

export interface IapiCallResetReturn {
  type: typeof ActionType.API_CALL_RESET;
  payload: {
    error: string;
    success: string;
    info: string;
    isLoading: boolean;
  };
}

export type TapiCallResetFn = () => IapiCallResetReturn;

export interface IresetToInitialReturn {
  type: typeof ActionType.RESET_TO_INITIAL;
}

export type TresetToInitialFn = () => IresetToInitialReturn;

export interface IsaveWageTypeListReturn {
  type: typeof ActionType.SET_WAGE_TYPE_LIST;
  payload: TwageTypeList;
}

export type TsaveWageTypeListFn = (
  list: TwageTypeList,
) => IsaveWageTypeListReturn;

export interface IsetWageTypeListLoaderReturn {
  type: typeof ActionType.SET_WAGE_TYPE_LIST_LOADER;
  payload: boolean;
}

export type TsetWageTypeListLoaderFn = (
  bool: boolean,
) => IsetWageTypeListLoaderReturn;

export interface IsaveWageTypeDDCompatibleListReturn {
  type: typeof ActionType.SET_WAGE_TYPE_DD_COMPATIBLE_LIST;
  payload: TwageTypeListDDCompatible;
}

export type TsaveWageTypeDDCompatibleListFn = (
  list: TwageTypeListDDCompatible,
) => IsaveWageTypeDDCompatibleListReturn;

export interface IsetWageTypeListDDCompatibleLoaderReturn {
  type: typeof ActionType.SET_WAGE_TYPE_DD_COMPATIBLE_LIST_LOADER;
  payload: boolean;
}

export type TsetWageTypeListDDCompatibleLoaderFn = (
  bool: boolean,
) => IsetWageTypeListDDCompatibleLoaderReturn;

export interface IsetSelectedWageTypeReturn {
  type: typeof ActionType.SET_SELECTED_WAGE_TYPE;
  payload: IwageType | null;
}

export type TsetSelectedWageTypeFn = (
  wageType: IwageType | null,
) => IsetSelectedWageTypeReturn;

export interface IsetFormDataReturn {
  type: typeof ActionType.SET_FORM_DATA;
  payload: IformData;
}

export type TsetFormDataFn = (formData: IformData) => IsetFormDataReturn;

export interface IresetFormDataReturn {
  type: typeof ActionType.RESET_FORM_DATA;
}

export type TresetFormDataFn = () => IresetFormDataReturn;

export interface IsetAddModeReturn {
  type: typeof ActionType.SET_ADD_MODE;
  payload: boolean;
}

export type TsetAddModeFn = (data: boolean) => IsetAddModeReturn;

export interface IsetUpdateModeReturn {
  type: typeof ActionType.SET_UPDATE_MODE;
  payload: boolean;
}

export type TsetUpdateModeFn = (data: boolean) => IsetUpdateModeReturn;

export interface IsetUpdateIdReturn {
  type: typeof ActionType.SET_UPDATE_ID;
  payload: number;
}

export type TsetUpdateIdFn = (id: number) => IsetUpdateIdReturn;

export interface IsetSingleWageTypeLoaderReturn {
  type: typeof ActionType.SET_SINGLE_WAGE_TYPE_LOADER;
  payload: boolean;
}

export type TsetSingleWageTypeLoaderFn = (
  data: boolean,
) => IsetSingleWageTypeLoaderReturn;

export interface IsetBackendErrorReturn {
  type: typeof ActionType.SET_BACKEND_ERROR;
  payload: any;
}

export type TsetBackendErrorFn = (data: any) => IsetBackendErrorReturn;

export interface IresetBackendErrorReturn {
  type: typeof ActionType.RESET_BACKEND_ERROR;
}

export type TresetBackendErrorFn = () => IresetBackendErrorReturn;

export interface IsetSelectedWageTypeHistoryReturn {
  type: typeof ActionType.SET_SELECTED_WAGE_TYPE_HISTORY;
  payload: IwageTypeHistory[] | null;
}

export type TsetSelectedWageTypeHistoryFn = (
  data: IwageTypeHistory[] | null,
) => IsetSelectedWageTypeHistoryReturn;

export interface IsetSelectedWageTypeHistoryLoaderReturn {
  type: typeof ActionType.SET_SELECTED_WAGE_TYPE_HISTORY_LOADER;
  payload: boolean;
}

export type TsetSelectedWageTypeHistoryLoaderFn = (
  data: boolean,
) => IsetSelectedWageTypeHistoryLoaderReturn;

export interface IsaveWageTypeListPaginatoDataReturn {
  type: typeof ActionType.SET_PAGINATION_DATA;
  payload: IpaginationData;
}

export type TsaveWageTypeListPaginatoDataFn = (
  data: IpaginationData,
) => IsaveWageTypeListPaginatoDataReturn;
