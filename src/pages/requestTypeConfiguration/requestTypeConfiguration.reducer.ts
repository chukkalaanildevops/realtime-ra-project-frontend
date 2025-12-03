import {
  IRequestTypeConfigState,
  IExpandedItem,
} from './requestTypeConfiguration.model';
import { REQUEST_TYPE_CONFIG_ACTION_TYPES } from './requestTypeConfiguration.action';

export const initialState: IRequestTypeConfigState = {
  entityList: [],
  label: {},
  customFields: { fields: [], layout: [] },
  entityTypesList: [],
  wageTypes: [],
  requestTypes: [],
  success: '',
  error: '',
  loader: false,
  expenseTypes: [],
  loadingMessage: '',
  expandedItem: {} as IExpandedItem,
  isDataLoading: false,
  defaultLabels: {},
  requestLegalEntitiesRecords: [],
  requestTypeData: undefined,
  referenceData: {},
  requestLegalEntities: [],
  requestLegalEntitiesLoading: false,
  staffMemberLoading: false,
  currentPage: 1,
  createRequestLoadingStatus: false,
  internal_cost_centres: [],
  local_cost_centres: [],
  overseas_cost_centres: [],
};

export default (state = initialState, action: any) => {
  const { type, payload, status } = action;
  switch (type) {
    case REQUEST_TYPE_CONFIG_ACTION_TYPES.CREATE_REQUEST_LOADING:
      return {
        ...state,
        createRequestLoadingStatus: payload,
      };
    case REQUEST_TYPE_CONFIG_ACTION_TYPES.SAVE_ENTITY:
      return {
        ...state,
        entityList: payload,
      };
    case REQUEST_TYPE_CONFIG_ACTION_TYPES.SAVE_CUSTOM_FIELDS:
      return {
        ...state,
        customFields: payload,
      };
    case REQUEST_TYPE_CONFIG_ACTION_TYPES.SAVE_LABEL_MAPPING:
      return {
        ...state,
        label: payload,
      };
    case REQUEST_TYPE_CONFIG_ACTION_TYPES.SAVE_ENTITY_TYPES:
      return {
        ...state,
        entityTypesList: payload,
      };
    case REQUEST_TYPE_CONFIG_ACTION_TYPES.SET_ERROR:
      return {
        ...state,
        error: payload,
      };
    case REQUEST_TYPE_CONFIG_ACTION_TYPES.SET_SUCCESS:
      return {
        ...state,
        success: payload,
      };
    case REQUEST_TYPE_CONFIG_ACTION_TYPES.SET_LOADING:
      return {
        ...state,
        loader: payload,
      };
    case REQUEST_TYPE_CONFIG_ACTION_TYPES.SAVE_WAGE_TYPES:
      return {
        ...state,
        wageTypes: payload,
      };
    case REQUEST_TYPE_CONFIG_ACTION_TYPES.SAVE_COST_CENTRE:
      let ccKey: string = '';
      const ccType = payload.type;
      if (ccType === 'INTER') {
        ccKey = 'internal_cost_centres';
      } else if (ccType === 'OVERS') {
        ccKey = 'overseas_cost_centres';
      } else {
        ccKey = 'local_cost_centres';
      }
      return {
        ...state,
        [ccKey]: payload.data,
      };
    case REQUEST_TYPE_CONFIG_ACTION_TYPES.SAVE_LOCAL_COST_CENTRE:
      return {
        ...state,
        local_cost_centres_test: payload,
      };
    case REQUEST_TYPE_CONFIG_ACTION_TYPES.SAVE_REQUEST_TYPES:
      return {
        ...state,
        requestTypes: payload,
      };
    case REQUEST_TYPE_CONFIG_ACTION_TYPES.SAVE_EXPENSE_TYPES:
      return {
        ...state,
        expenseTypes: payload,
      };
    case REQUEST_TYPE_CONFIG_ACTION_TYPES.SET_LOADING_MESSAGE:
      return {
        ...state,
        loadingMessage: payload,
      };
    case REQUEST_TYPE_CONFIG_ACTION_TYPES.SAVE_EXPANDED_ITEM:
      return {
        ...state,
        expandedItem: payload,
        label: payload.label_mapping,
        defaultLabels: payload.label_mapping,
        customFields: payload.custom_fields,
      };
    case REQUEST_TYPE_CONFIG_ACTION_TYPES.RESET_REQUEST_DATA:
      return {
        ...initialState,
        loader: state.loader,
        loadingMessage: state.loadingMessage,
        requestTypes: state.requestTypes,
        currentPage: state.currentPage,
      };
    case REQUEST_TYPE_CONFIG_ACTION_TYPES.SET_DATA_LOADING:
      return {
        ...state,
        isDataLoading: payload,
      };
    case REQUEST_TYPE_CONFIG_ACTION_TYPES.SAVE_DEFAULT_LABEL_MAPPING:
      return {
        ...state,
        defaultLabels: payload,
      };
    case REQUEST_TYPE_CONFIG_ACTION_TYPES.RESET_LABEL_MAPPING:
      return {
        ...state,
        label: state.defaultLabels,
      };
    case REQUEST_TYPE_CONFIG_ACTION_TYPES.SAVE_LEGAL_ENTITIES:
      return {
        ...state,
        requestLegalEntitiesRecords: payload,
      };
    case REQUEST_TYPE_CONFIG_ACTION_TYPES.SAVE_REQUEST_TYPE_DATA:
      return {
        ...state,
        requestTypeData: payload,
      };
    case REQUEST_TYPE_CONFIG_ACTION_TYPES.RESET_MESSAGES:
      return {
        ...state,
        success: '',
        error: '',
        loadingMessage: '',
      };
    case REQUEST_TYPE_CONFIG_ACTION_TYPES.SAVE_REQUEST_DATA:
      return {
        ...state,
        updateRequestData: payload,
      };
    case REQUEST_TYPE_CONFIG_ACTION_TYPES.SAVE_REFERENCE_DATA:
      return {
        ...state,
        referenceData: {
          ...state.referenceData,
          [payload.id]: payload.data,
        },
      };
    case REQUEST_TYPE_CONFIG_ACTION_TYPES.SAVE_REQUEST_LEGAL_ENTITIES:
      return {
        ...state,
        requestLegalEntitiesLoading: status,
        requestLegalEntities: payload,
      };
    case REQUEST_TYPE_CONFIG_ACTION_TYPES.SAVE_STAFF_MEMBERS:
      return {
        ...state,
        staffMembers: payload,
        staffMemberLoading: status,
      };
    case REQUEST_TYPE_CONFIG_ACTION_TYPES.SAVE_EXPENSE_TYPES_AGAINST_REQUEST:
      return {
        ...state,
        expenseTypesForRequest: payload,
      };
    case REQUEST_TYPE_CONFIG_ACTION_TYPES.RESET_ALL_REQUEST_DATA:
      return {
        ...state,
        referenceData: undefined,
        updateRequestData: undefined,
        success: '',
        error: '',
        loadingMessage: '',
        staffMembers: [],
      };
    case REQUEST_TYPE_CONFIG_ACTION_TYPES.SET_REQUEST_TYPE_CURRENT_PAGE:
      return {
        ...state,
        currentPage: payload,
      };
    default:
      return state;
  }
};

export const getLabels = (state: IRequestTypeConfigState) => state.label;
export const getCustomField = (state: IRequestTypeConfigState) =>
  state.customFields;
export const getEntities = (state: IRequestTypeConfigState) => state.entityList;
export const getEntityTypes = (state: IRequestTypeConfigState) =>
  state.entityTypesList;
export const getWageTypes = (state: IRequestTypeConfigState) => state.wageTypes;
// export const getCostCentre = (state: IRequestTypeConfigState) =>
//   state.costCentre;
export const getRequestTypes = (state: IRequestTypeConfigState) =>
  state.requestTypes;
export const getSuccessMessage = (state: IRequestTypeConfigState) =>
  state.success;
export const getErrorMessage = (state: IRequestTypeConfigState) => state.error;
export const getExpenseTypes = (state: IRequestTypeConfigState) =>
  state.expenseTypes;
export const getLoadingStatus = (state: IRequestTypeConfigState) =>
  state.loader;
export const getLoadingMessage = (state: IRequestTypeConfigState) =>
  state.loadingMessage;
export const getExpandedItem = (state: IRequestTypeConfigState) =>
  state.expandedItem;
export const getDataLoading = (state: IRequestTypeConfigState) =>
  state.isDataLoading;
export const getRequestLegalRecords = (state: IRequestTypeConfigState) =>
  state.requestLegalEntitiesRecords;
export const getRequestTypeData = (state: IRequestTypeConfigState) =>
  state.requestTypeData;
export const getUpdateRequestData = (state: IRequestTypeConfigState) =>
  state.updateRequestData;
export const getReferenceData = (state: IRequestTypeConfigState) =>
  state.referenceData;
export const getRequestLegalEntities = (state: IRequestTypeConfigState) =>
  state.requestLegalEntities;
export const getRequestLegalEntitiesLoadingStatus = (
  state: IRequestTypeConfigState,
) => state.requestLegalEntitiesLoading;
export const getRequestDetails = (state: IRequestTypeConfigState) =>
  state.requestDetails;
export const getStaffMembers = (state: IRequestTypeConfigState) =>
  state.staffMembers;
export const getstaffMemberLoadingStatus = (state: IRequestTypeConfigState) =>
  state.staffMemberLoading;
export const getExpenseTypesForRequest = (state: IRequestTypeConfigState) =>
  state.expenseTypesForRequest;
export const getcreateRequestLoadingStatus = (state: IRequestTypeConfigState) =>
  state.createRequestLoadingStatus;
export const getCurrentPage = (state: IRequestTypeConfigState) =>
  state.currentPage;
export const getLocalCostCentre = (state: IRequestTypeConfigState) =>
  state.local_cost_centres;
export const getOverseasCostCentre = (state: IRequestTypeConfigState) =>
  state.overseas_cost_centres;
export const getInternalCostCentre = (state: IRequestTypeConfigState) =>
  state.internal_cost_centres;
