import { ILegalEntityState } from './legalEntityListing.model';
import { ENTITY_TYPES_LISTING } from './legalEntityListing.actions';

const initialState: ILegalEntityState = {
  companies: [],
  departments: [],
  divisions: [],
  organizations: [],
  isLoading: false,
  loadingMessage: '',
  entityData: {},
  error: '',
  success: '',
  financialYear: [],
  isDataSubmitting: false,
  entityHierarchy: {},
};

export default (
  state = initialState,
  action: { type: string; payload: any },
) => {
  const { payload, type } = action;
  switch (type) {
    case ENTITY_TYPES_LISTING.SAVE_COMPANIES:
      return {
        ...state,
        companies: payload,
      };
    case ENTITY_TYPES_LISTING.SAVE_DEPARTMENTS:
      return {
        ...state,
        departments: payload,
      };
    case ENTITY_TYPES_LISTING.SAVE_DIVISIONS:
      return {
        ...state,
        divisions: payload,
      };
    case ENTITY_TYPES_LISTING.SAVE_ORGANIZATIONS:
      return {
        ...state,
        organizations: payload,
      };
    case ENTITY_TYPES_LISTING.SET_LOADER:
      return {
        ...state,
        isLoading: payload,
      };
    case ENTITY_TYPES_LISTING.SET_LOADING_MESSAGE:
      return {
        ...state,
        loadingMessage: payload,
      };
    case ENTITY_TYPES_LISTING.SAVE_ENTITY_DATA:
      return {
        ...state,
        entityData: payload,
      };
    case ENTITY_TYPES_LISTING.SET_SUCCESS:
      return {
        ...state,
        success: payload,
      };
    case ENTITY_TYPES_LISTING.SET_ERROR:
      return {
        ...state,
        error: payload,
      };
    case ENTITY_TYPES_LISTING.SET_DATA_SUBMITTING:
      return {
        ...state,
        isDataSubmitting: payload,
      };
    case ENTITY_TYPES_LISTING.SAVE_FINANCIAL_YEAR:
      return {
        ...state,
        financialYear: payload,
      };
    case ENTITY_TYPES_LISTING.SAVE_HIERARCHY_DATA:
      return {
        ...state,
        entityHierarchy: {
          ...state.entityHierarchy,
          [payload.id]: payload.data,
        },
      };
    case ENTITY_TYPES_LISTING.SAVE_ENTITY_DATA_BY_ID:
      return {
        ...state,
        entityData: {
          ...state.entityData,
          [payload.id]: {
            ...state.entityData[payload.id],
            ...payload.data,
          },
        },
      };
    default:
      return state;
  }
};

export const getLoadingState = (state: ILegalEntityState) => state.isLoading;

export const getLoadingMessage = (state: ILegalEntityState) =>
  state.loadingMessage;

export const getCompanies = (state: ILegalEntityState) => state.companies;

export const getOrganizations = (state: ILegalEntityState) =>
  state.organizations;

export const getDepartments = (state: ILegalEntityState) => state.departments;

export const getDivisions = (state: ILegalEntityState) => state.divisions;

export const getEntityData = (state: ILegalEntityState) => state.entityData;

export const getEntitySuccess = (state: ILegalEntityState) => state.success;

export const getEntityError = (state: ILegalEntityState) => state.error;

export const isEntitySubmitting = (state: ILegalEntityState) =>
  state.isDataSubmitting;

export const getFinancialYears = (state: ILegalEntityState) =>
  state.financialYear;

export const getEntityHierarchy = (state: ILegalEntityState) =>
  state.entityHierarchy;
