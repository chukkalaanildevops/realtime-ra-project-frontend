import {
  customObjInterface,
  Ilabel,
  IRequestTypeModel,
} from './requestTypeConfiguration.model';

export const REQUEST_TYPE_CONFIG_ACTION_TYPES = {
  SAVE_ENTITY: 'REQUEST_TYPE_CONFIG_ACTION_TYPES/SAVE_ENTITY',
  SAVE_ENTITY_TYPES: 'REQUEST_TYPE_CONFIG_ACTION_TYPES/SAVE_ENTITY_TYPES',
  SAVE_CUSTOM_FIELDS: 'REQUEST_TYPE_CONFIG_ACTION_TYPES/SAVE_CUSTOM_FIELDS',
  SAVE_LABEL_MAPPING: 'REQUEST_TYPE_CONFIG_ACTION_TYPES/SAVE_LABEL_MAPPING',
  SAVE_WAGE_TYPES: 'REQUEST_TYPE_CONFIG_ACTION_TYPES/SAVE_WAGE_TYPES',
  SAVE_COST_CENTRE: 'REQUEST_TYPE_CONFIG_ACTION_TYPES/SAVE_COST_CENTRE',
  SAVE_LOCAL_COST_CENTRE:
    'REQUEST_TYPE_CONFIG_ACTION_TYPES/SAVE_LOCAL_COST_CENTRE',
  SAVE_REQUEST_TYPES: 'REQUEST_TYPE_CONFIG_ACTION_TYPES/SAVE_REQUEST_TYPES',
  SET_ERROR: 'REQUEST_TYPE_CONFIG_ACTION_TYPES/SET_ERROR',
  SET_LOADING: 'REQUEST_TYPE_CONFIG_ACTION_TYPES/SET_LOADING',
  SET_SUCCESS: 'REQUEST_TYPE_CONFIG_ACTION_TYPES/SET_SUCCESS',
  SAVE_EXPENSE_TYPES: 'REQUEST_TYPE_CONFIG_ACTION_TYPES/SAVE_EXPENSE_TYPES',
  SET_LOADING_MESSAGE: 'REQUEST_TYPE_CONFIG_ACTION_TYPES/SET_LOADING_MESSAGE',
  SAVE_EXPANDED_ITEM: 'REQUEST_TYPE_CONFIG_ACTION_TYPES/SAVE_EXPANDED_ITEM',
  RESET_REQUEST_DATA: 'REQUEST_TYPE_CONFIG_ACTION_TYPES/RESET_DATA',
  SET_DATA_LOADING: 'REQUEST_TYPE_CONFIG_ACTION_TYPES/SET_DATA_LOADING',
  SAVE_DEFAULT_LABEL_MAPPING:
    'REQUEST_TYPE_CONFIG_ACTION_TYPES/SAVE_DEFAULT_LABEL_MAPPING',
  RESET_LABEL_MAPPING: 'REQUEST_TYPE_CONFIG_ACTION_TYPES/RESET_LABEL_MAPPING',
  SAVE_LEGAL_ENTITIES: 'REQUEST_TYPE_CONFIG_ACTION_TYPES/SAVE_LEGAL_ENTITIES',
  SAVE_REQUEST_TYPE_DATA:
    'REQUEST_TYPE_CONFIG_ACTION_TYPES/SAVE_REQUEST_TYPE_DATA',
  RESET_MESSAGES: 'REQUEST_TYPE_CONFIG_ACTION_TYPES/RESET_MESSAGES',
  SAVE_REQUEST_DATA: 'REQUEST_TYPE_CONFIG_ACTION_TYPES/SAVE_REQUEST_DATA',
  SAVE_REFERENCE_DATA: 'REQUEST_TYPE_CONFIG_ACTION_TYPES/SAVE_REFERENCE_DATA',
  SAVE_REQUEST_LEGAL_ENTITIES:
    'REQUEST_TYPE_CONFIG_ACTION_TYPES/REQUEST_TYPE_CONFIG_ACTION_TYPES',
  SAVE_REQUEST_DETAILS: 'REQUEST_TYPE_CONFIG_ACTION_TYPES/SAVE_REQUEST_DETAILS',
  SAVE_STAFF_MEMBERS: 'REQUEST_TYPE_CONFIG_ACTION_TYPES/SAVE_STAFF_MEMBERS',
  SAVE_EXPENSE_TYPES_AGAINST_REQUEST:
    'REQUEST_TYPE_CONFIG_ACTION_TYPES/SAVE_EXPENSE_TYPES_AGAINST_REQUEST',
  RESET_ALL_REQUEST_DATA:
    'REQUEST_TYPE_CONFIG_ACTION_TYPES/RESET_ALL_REQUEST_DATA',
  SET_REQUEST_TYPE_CURRENT_PAGE:
    'REQUEST_TYPE_CONFIG_ACTION_TYPES/SET_REQUEST_TYPE_CURRENT_PAGE',
  CREATE_REQUEST_LOADING: 'CREATE_REQUEST_LOADING',
};
export const createRequestLoadingStatus = (data: any) => ({
  type: REQUEST_TYPE_CONFIG_ACTION_TYPES.CREATE_REQUEST_LOADING,
  payload: data,
});
export const saveCustomFieldsData = (data: customObjInterface[]) => ({
  type: REQUEST_TYPE_CONFIG_ACTION_TYPES.SAVE_CUSTOM_FIELDS,
  payload: data,
});

export const saveEntityTypes = (data: any[]) => ({
  type: REQUEST_TYPE_CONFIG_ACTION_TYPES.SAVE_ENTITY_TYPES,
  payload: data,
});

export const saveLegalEntities = (data: any[]) => ({
  type: REQUEST_TYPE_CONFIG_ACTION_TYPES.SAVE_ENTITY,
  payload: data,
});

export const saveLabelMapping = (data: Ilabel) => ({
  type: REQUEST_TYPE_CONFIG_ACTION_TYPES.SAVE_LABEL_MAPPING,
  payload: data,
});

export const saveWageTypes = (data: Array<any>) => ({
  type: REQUEST_TYPE_CONFIG_ACTION_TYPES.SAVE_WAGE_TYPES,
  payload: data,
});

export const saveCostCentre = (data: any) => ({
  type: REQUEST_TYPE_CONFIG_ACTION_TYPES.SAVE_COST_CENTRE,
  payload: data,
});

export const saveLocalCostCentre = (data: any) => ({
  type: REQUEST_TYPE_CONFIG_ACTION_TYPES.SAVE_LOCAL_COST_CENTRE,
  payload: data,
});

export const saveRequestTypes = (data: any[]) => ({
  type: REQUEST_TYPE_CONFIG_ACTION_TYPES.SAVE_REQUEST_TYPES,
  payload: data,
});

export const setError = (error: string) => ({
  type: REQUEST_TYPE_CONFIG_ACTION_TYPES.SET_ERROR,
  payload: error,
});

export const setSuccess = (message: string) => ({
  type: REQUEST_TYPE_CONFIG_ACTION_TYPES.SET_SUCCESS,
  payload: message,
});

export const setLoader = (isLoading: boolean) => ({
  type: REQUEST_TYPE_CONFIG_ACTION_TYPES.SET_LOADING,
  payload: isLoading,
});

export const saveExpenses = (data: any[]) => ({
  type: REQUEST_TYPE_CONFIG_ACTION_TYPES.SAVE_EXPENSE_TYPES,
  payload: data,
});

export const setLoadingMessage = (data: string) => ({
  type: REQUEST_TYPE_CONFIG_ACTION_TYPES.SET_LOADING_MESSAGE,
  payload: data,
});

export const saveExpandedItem = (data: any) => ({
  type: REQUEST_TYPE_CONFIG_ACTION_TYPES.SAVE_EXPANDED_ITEM,
  payload: data,
});

export const resetData = () => ({
  type: REQUEST_TYPE_CONFIG_ACTION_TYPES.RESET_REQUEST_DATA,
});

export const setDataLoading = (isLoading: boolean) => ({
  type: REQUEST_TYPE_CONFIG_ACTION_TYPES.SET_DATA_LOADING,
  payload: isLoading,
});

export const resetLabelMapping = () => ({
  type: REQUEST_TYPE_CONFIG_ACTION_TYPES.RESET_LABEL_MAPPING,
});

export const saveDefaultLabelMapping = (data: Ilabel) => ({
  type: REQUEST_TYPE_CONFIG_ACTION_TYPES.SAVE_DEFAULT_LABEL_MAPPING,
  payload: data,
});

export const saveLegalEntityRecords = (data: any[]) => ({
  type: REQUEST_TYPE_CONFIG_ACTION_TYPES.SAVE_LEGAL_ENTITIES,
  payload: data,
});

export const saveRequestTypeData = (data: any) => ({
  type: REQUEST_TYPE_CONFIG_ACTION_TYPES.SAVE_REQUEST_TYPE_DATA,
  payload: data,
});

export const resetRequestTypeMessages = () => ({
  type: REQUEST_TYPE_CONFIG_ACTION_TYPES.RESET_MESSAGES,
});

export const saveRequestData = (data: IRequestTypeModel) => ({
  type: REQUEST_TYPE_CONFIG_ACTION_TYPES.SAVE_REQUEST_DATA,
  payload: data,
});

export const saveReferenceData = (data: any[], id: number) => ({
  type: REQUEST_TYPE_CONFIG_ACTION_TYPES.SAVE_REFERENCE_DATA,
  payload: {
    data,
    id,
  },
});

export const saveRequestLegalEntities = (status: boolean, data: any[]) => ({
  type: REQUEST_TYPE_CONFIG_ACTION_TYPES.SAVE_REQUEST_LEGAL_ENTITIES,
  payload: data,
  status: status,
});

export const saveRequestDetails = (data: any) => ({
  type: REQUEST_TYPE_CONFIG_ACTION_TYPES.SAVE_REQUEST_DATA,
  payload: data,
});

export const saveStaffMembers = (status: boolean, data: any) => ({
  type: REQUEST_TYPE_CONFIG_ACTION_TYPES.SAVE_STAFF_MEMBERS,
  payload: data,
  status: status,
});

export const saveExpenseTypesAgainstRequest = (data: any) => ({
  type: REQUEST_TYPE_CONFIG_ACTION_TYPES.SAVE_EXPENSE_TYPES_AGAINST_REQUEST,
  payload: data,
});

export const resetAllRequestData = () => ({
  type: REQUEST_TYPE_CONFIG_ACTION_TYPES.RESET_ALL_REQUEST_DATA,
});

export const setCurrentPage = (page: number) => ({
  type: REQUEST_TYPE_CONFIG_ACTION_TYPES.SET_REQUEST_TYPE_CURRENT_PAGE,
  payload: page,
});
