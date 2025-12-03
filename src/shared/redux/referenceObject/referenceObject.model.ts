import { OBJECT_REFERENCE_TYPES } from './referenceObject.actions';

export interface IObjectReferenceState {
  objectReference: Array<IobjectReference>;
  paginationData: IpaginationData;
  restorePageNo: boolean;
  restorePageSize: boolean;
  objectReferenceListLoader: boolean;
  objectReferenceSelected: TobjectReferenceSelected;
  objectReferenceSelectedLoader: boolean;
  // objectReferenceSelectedItems: IobjectReferenceItem[];
  formData: IformData;
  itemFile?: File | null;
  listUpdate: IlistUpdate;
  isUpdateMode: boolean;
  updateId: null | string;
  error: any;
  success: string;
  info: string;
  loader: boolean;
  backend_error: any;
  canDeleted: boolean;
  referenceItemList: any;
  referenceObjectList: Array<IobjectReference>;
}

export interface IlistUpdate {
  add: string[];
  remove: string[];
}

export interface IformData {
  title: string;
  code: string;
  items: string[];
}

export type TobjectReferenceSelected = IobjectReference | null;

export interface IobjectReference {
  created_by: IuserInfo | null;
  created_on: string | null;
  modified_by: IuserInfo | null;
  modified_on: string | null;
  deleted_by: null | IuserInfo;
  deleted_on: null | string;
  is_deleted: boolean;
  id: number;
  title: string;
  code: null | string;
  source_reference_model: null | 'USR' | 'CUN' | 'CUR';
  items: IobjectReferenceItem[];
}

export interface IpaginationData {
  number_of_pages: number;
  total_records: number;
  current_page: number;
}

// export type TresponseObjectReferenceData = IobjectReference & IpaginationData;

export interface IobjectReferenceItem {
  id: number;
  reference_object: string;
  title: string;
  is_deleted: boolean;
}

export interface IuserInfo {
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

export interface IapiCallRequestReturn {
  type: typeof OBJECT_REFERENCE_TYPES.API_CALL_REQUEST;
  payload: {
    error: string;
    success: string;
    info: string;
    loader: boolean;
  };
}

export type TapiCallRequestFn = (
  isLoading?: boolean,
  info?: string,
) => IapiCallRequestReturn;

export interface IapiCallSuccessReturn {
  type: typeof OBJECT_REFERENCE_TYPES.API_CALL_SUCCESS;
  payload: {
    error: string;
    success: string;
    info: string;
    loader: boolean;
  };
}

export type TapiCallSuccessFn = (success?: string) => IapiCallSuccessReturn;

export interface IapiCallFailReturn {
  type: typeof OBJECT_REFERENCE_TYPES.API_CALL_FAIL;
  payload: {
    error: string;
    success: string;
    info: string;
    loader: boolean;
  };
}

export type TapiCallFailFn = (err?: string) => IapiCallFailReturn;

export interface IapiCallResetReturn {
  type: typeof OBJECT_REFERENCE_TYPES.API_CALL_RESET;
  payload: {
    error: string;
    success: string;
    info: string;
    loader: boolean;
  };
}

export type TapiCallResetFn = () => IapiCallResetReturn;

export interface IresetToInitialReturn {
  type: typeof OBJECT_REFERENCE_TYPES.RESET_TO_INITIAL;
  payload?: {};
}

export type TresetToInitialFn = () => IresetToInitialReturn;

export interface IsetObjectReferenceSelectedReturn {
  type: typeof OBJECT_REFERENCE_TYPES.SET_OBJECT_REFERENCE_SELECTED;
  payload: TobjectReferenceSelected;
}

export type TsetObjectReferenceSelectedFn = (
  selectedObjectReference: TobjectReferenceSelected,
) => IsetObjectReferenceSelectedReturn;

export interface IsetFormDataReturn {
  type: typeof OBJECT_REFERENCE_TYPES.SET_FORM_DATA;
  payload: IformData;
}

export type TsetFormDataFn = (formData: IformData) => IsetFormDataReturn;

export interface IresetFormDataReturn {
  type: typeof OBJECT_REFERENCE_TYPES.RESET_FORM_DATA;
}

export type TresetFormDataFn = () => IresetFormDataReturn;

export interface IsetListLoaderReturn {
  type: typeof OBJECT_REFERENCE_TYPES.SET_LIST_LOADER;
  payload: boolean;
}

export type TsetListLoaderFn = (setListLoader: boolean) => IsetListLoaderReturn;

export interface IsetUpdateIdReturn {
  type: typeof OBJECT_REFERENCE_TYPES.SET_LIST_LOADER;
  payload: string;
}

export type TsetUpdateIdFn = (id: string) => IsetUpdateIdReturn;

// export interface IsetListUpdateInnerReturn {
//   type: typeof OBJECT_REFERENCE_TYPES.SET_LIST_UPDATE;
//   payload: IlistUpdate;
// }

export type TsetListUpdateFn = (
  item: string,
  action: 'ADD' | 'REMOVE',
) => Function;

export interface IresetListUpdateReturn {
  type: typeof OBJECT_REFERENCE_TYPES.RESET_LIST_UPDATE;
}

export type TresetListUpdateFn = () => IresetListUpdateReturn;

// ----------------- normal function--------
export type TcreateListUpdateObjectFn = (
  item: string,
  action: 'ADD' | 'REMOVE',
  getState: any,
) => IlistUpdate;

export interface IsavePaginationDataReturn {
  type: typeof OBJECT_REFERENCE_TYPES.UPDATE_PAGINATION_DATA;
  payload: IpaginationData;
}

export type TsavePaginationData = (
  data: IpaginationData,
) => IsavePaginationDataReturn;

export type TremovePaginationData = (
  data: IobjectReference[],
) => IobjectReference[];

export interface IupdateItemFileReturn {
  type: typeof OBJECT_REFERENCE_TYPES.UPDATE_ITEM_FILE;
  payload: File | null;
}
export type TupdateItemFileFn = (file: File | null) => IupdateItemFileReturn;

export interface IupdateBackendErrorsReturn {
  type: typeof OBJECT_REFERENCE_TYPES.UPDATE_BACKEND_ERRORS;
  payload: any;
}
export type TupdateBackendErrorsFn = (
  errors: any,
) => IupdateBackendErrorsReturn;

export interface IupdateRestorePageNoReturn {
  type: typeof OBJECT_REFERENCE_TYPES.UPDATE_RESTORE_PAGE_NO;
  payload: boolean;
}

export interface IupdateRestorePageSizeReturn {
  type: typeof OBJECT_REFERENCE_TYPES.UPDATE_RESTORE_PAGE_SIZE;
  payload: boolean;
}
export type TupdateRestorePageNoFn = (
  data?: boolean,
) => IupdateRestorePageNoReturn;

export type TupdateRestorePageSizeFn = (
  data?: boolean,
) => IupdateRestorePageSizeReturn;
