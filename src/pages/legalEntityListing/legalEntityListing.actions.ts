export const ENTITY_TYPES_LISTING = {
  SET_LOADER: 'ENTITY_TYPES_LISTING/SET_LOADER',
  SET_LOADING_MESSAGE: 'ENTITY_TYPES_LISTING/SET_LOADING_MESSAGE',
  SAVE_COMPANIES: 'ENTITY_TYPES_LISTING/SAVE_COMPANIES',
  SAVE_ORGANIZATIONS: 'ENTITY_TYPES_LISTING/SAVE_ORGANIZATIONS',
  SAVE_DIVISIONS: 'ENTITY_TYPES_LISTING/SAVE_DIVISIONS',
  SAVE_DEPARTMENTS: 'ENTITY_TYPES_LISTING/SAVE_COMPANIES',
  SAVE_ENTITY_DATA: 'ENTITY_TYPES_LISTING/SAVE_ENTITY_DATA',
  SET_SUCCESS: 'ENTITY_TYPES_LISTING/SET_SUCCESS',
  SET_ERROR: 'ENTITY_TYPES_LISTING/SET_ERROR',
  SET_DATA_SUBMITTING: 'ENTITY_TYPES_LISTING/SET_DATA_SUBMITTING',
  SAVE_FINANCIAL_YEAR: 'ENTITY_TYPES_LISTING/SAVE_FINANCIAL_YEAR',
  SAVE_HIERARCHY_DATA: 'ENTITY_TYPES_LISTING/SAVE_HIERARCHY_DATA',
  SAVE_ENTITY_DATA_BY_ID: 'ENTITY_TYPES_LISTING/SAVE_ENTITY_DATA_BY_ID',
};

export const saveLoader = (isLoading: boolean) => ({
  type: ENTITY_TYPES_LISTING.SET_LOADER,
  payload: isLoading,
});

export const saveMessage = (message: string) => ({
  type: ENTITY_TYPES_LISTING.SET_LOADING_MESSAGE,
  payload: message,
});

export const saveCompanies = (data: any[]) => ({
  type: ENTITY_TYPES_LISTING.SAVE_COMPANIES,
  payload: data,
});

export const saveOrganizations = (data: any[]) => ({
  type: ENTITY_TYPES_LISTING.SAVE_ORGANIZATIONS,
  payload: data,
});

export const saveDepartments = (data: any[]) => ({
  type: ENTITY_TYPES_LISTING.SAVE_DEPARTMENTS,
  payload: data,
});

export const saveDivisions = (data: any[]) => ({
  type: ENTITY_TYPES_LISTING.SAVE_DIVISIONS,
  payload: data,
});

export const saveEntityData = (body: any) => ({
  type: ENTITY_TYPES_LISTING.SAVE_ENTITY_DATA,
  payload: body,
});

export const saveSuccess = (success: string) => ({
  type: ENTITY_TYPES_LISTING.SET_SUCCESS,
  payload: success,
});

export const saveError = (error: any) => ({
  type: ENTITY_TYPES_LISTING.SET_ERROR,
  payload: error,
});

export const setDataSubmitting = (isLoading: boolean) => ({
  type: ENTITY_TYPES_LISTING.SET_DATA_SUBMITTING,
  payload: isLoading,
});

export const saveFinancialCycle = (data: any[]) => ({
  type: ENTITY_TYPES_LISTING.SAVE_FINANCIAL_YEAR,
  payload: data,
});

export const saveHierarchyData = (id: string, data: any[]) => ({
  type: ENTITY_TYPES_LISTING.SAVE_HIERARCHY_DATA,
  payload: {
    id,
    data,
  },
});

export const saveEntityDataById = (id: string, data: any) => ({
  type: ENTITY_TYPES_LISTING.SAVE_ENTITY_DATA_BY_ID,
  payload: {
    id,
    data,
  },
});
