import { customObjInterface, Ilabel } from './benefitTypeConfiguration.model';

export const BENEFIT_TYPE_CONFIG_ACTION_TYPES = {
  SAVE_ENTITY: 'BENEFIT_TYPE_CONFIG_ACTION_TYPES/SAVE_ENTITY',
  SAVE_ENTITY_COST_CENTER:
    'BENEFIT_TYPE_CONFIG_ACTION_TYPES/SAVE_ENTITY_COST_CENTER',
  SAVE_ENTITY_COST_CENTER_LOADER:
    'BENEFIT_TYPE_CONFIG_ACTION_TYPES/SAVE_ENTITY_COST_CENTER_LOADER',
  SAVE_FLEXIBLE_BENEFIT_CATEGORY:
    'BENEFIT_TYPE_CONFIG_ACTION_TYPES/SAVE_FLEXIBLE_BENEFIT_CATEGORY',
  UPDATE_RATE_TYPE: 'UPDATE_RATE_TYPE',

  SAVE_ENTITY_TYPES: 'BENEFIT_TYPE_CONFIG_ACTION_TYPES/SAVE_ENTITY_TYPES',
  SAVE_CUSTOM_FIELDS: 'BENEFIT_TYPE_CONFIG_ACTION_TYPES/SAVE_CUSTOM_FIELDS',
  SAVE_LABEL_MAPPING: 'BENEFIT_TYPE_CONFIG_ACTION_TYPES/SAVE_LABEL_MAPPING',
  SAVE_WAGE_TYPES: 'BENEFIT_TYPE_CONFIG_ACTION_TYPES/SAVE_WAGE_TYPES',
  SAVE_COST_CENTRE: 'BENEFIT_TYPE_CONFIG_ACTION_TYPES/SAVE_COST_CENTRE',
  SAVE_BENEFIT_TYPES: 'BENEFIT_TYPE_CONFIG_ACTION_TYPES/SAVE_BENEFIT_TYPES',
  SET_ERROR: 'BENEFIT_TYPE_CONFIG_ACTION_TYPES/SET_ERROR',
  SET_LOADING: 'BENEFIT_TYPE_CONFIG_ACTION_TYPES/SET_LOADING',
  SET_SUCCESS: 'BENEFIT_TYPE_CONFIG_ACTION_TYPES/SET_SUCCESS',
  SAVE_ENTITLEMENT_PERIOD:
    'BENEFIT_TYPE_CONFIG_ACTION_TYPES.SAVE_ENTITLEMENT_PERIOD',
  SAVE_FREQUENCY_UNIT: 'BENEFIT_TYPE_CONFIG_ACTION_TYPES.SAVE_FREQUENCY_UNIT',
  SAVE_MAX_CLAIM_PER_ENTITLEMENT_PERIOD:
    'BENEFIT_TYPE_CONFIG_ACTION_TYPES.SAVE_MAX_CLAIM_PER_ENTITLEMENT_PERIOD',
  SAVE_EXPENSE_TYPES: 'BENEFIT_TYPE_CONFIG_ACTION_TYPES/SAVE_EXPENSE_TYPES',
  SET_LOADING_MESSAGE: 'BENEFIT_TYPE_CONFIG_ACTION_TYPES/SET_LOADING_MESSAGE',
  SAVE_EXPANDED_ITEM: 'BENEFIT_TYPE_CONFIG_ACTION_TYPES/SAVE_EXPANDED_ITEM',
  RESET_BENEFIT_DATA: 'BENEFIT_TYPE_CONFIG_ACTION_TYPES/RESET_DATA',
  SAVE_GL_ACCOUNTS: 'BENEFIT_TYPE_CONFIG_ACTION_TYPES/SAVE_GL_ACCOUNTS',
  SET_DATA_LOADING: 'BENEFIT_TYPE_CONFIG_ACTION_TYPES/SET_DATA_LOADING',
  SAVE_DEFAULT_LABEL_MAPPING:
    'BENEFIT_TYPE_CONFIG_ACTION_TYPES/SAVE_DEFAULT_LABEL_MAPPING',
  RESET_LABEL_MAPPING: 'BENEFIT_TYPE_CONFIG_ACTION_TYPES/RESET_LABEL_MAPPING',
  SAVE_ENTITLEMENT_TYPE:
    'BENEFIT_TYPE_CONFIG_ACTION_TYPES/SAVE_ENTITLEMENT_TYPE',
  SAVE_AVAILABLE_AFTER: 'BENEFIT_TYPE_CONFIG_ACTION_TYPES/SAVE_AVAILABLE_AFTER',
  SAVE_AVAILABLE_AFTER_PERIOD_UNIT:
    'BENEFIT_TYPE_CONFIG_ACTION_TYPES/SAVE_AVAILABLE_AFTER_PERIOD_UNIT',
  SAVE_ENTITLEMENT_PERIOD_UNIT:
    'BENEFIT_TYPE_CONFIG_ACTION_TYPES/SAVE_ENTITLEMENT_PERIOD_UNIT',
  SAVE_PRORATED_BY: 'BENEFIT_TYPE_CONFIG_ACTION_TYPES/SAVE_PRORATED_BY',
  SAVE_DEDUCTIBLE_COMPONENT:
    'BENEFIT_TYPE_CONFIG_ACTION_TYPES/SAVE_DEDUCTIBLE_COMPONENT',
  SAVE_PRORATION: 'BENEFIT_TYPE_CONFIG_ACTION_TYPES/SAVE_PRORATION',
  SAVE_CLAIM_FOR: 'BENEFIT_TYPE_CONFIG_ACTION_TYPES/SAVE_CLAIM_FOR',
  SAVE_LEGAL_ENTITIES: 'BENEFIT_TYPE_CONFIG_ACTION_TYPES/SAVE_LEGAL_ENTITIES',
  SAVE_BENEFIT_TYPE_DATA:
    'BENEFIT_TYPE_CONFIG_ACTION_TYPES/SAVE_BENEFIT_TYPE_DATA',
  RESET_MESSAGES: 'BENEFIT_TYPE_CONFIG_ACTION_TYPES/RESET_MESSAGES',
  SET_TITLE_UPDATE_CONFIG_DATA:
    'BENEFIT_TYPE_CONFIG_ACTION_TYPES.SET_TITLE_UPDATE_CONFIG_DATA',
  UPDATE_COST_CENTER_FOR_ENTITY:
    'BENEFIT_TYPE_CONFIG_ACTION_TYPES/UPDATE_COST_CENTER_FOR_ENTITY',
  SAVE_DEPENDENT_RELATIONS:
    'BENEFIT_TYPE_CONFIG_ACTION_TYPES/SAVE_DEPENDENT_RELATIONS',
};

export const saveEntityCostCenterList = (data: any[]) => ({
  type: BENEFIT_TYPE_CONFIG_ACTION_TYPES.SAVE_ENTITY_COST_CENTER,
  payload: data,
});

export const updateCostCenterForEntity = (uuid: any, index: any) => ({
  type: BENEFIT_TYPE_CONFIG_ACTION_TYPES.UPDATE_COST_CENTER_FOR_ENTITY,
  payload: {
    uuid,
    index,
  },
});
export const saveEntityCostCenterListLoader = (data: any) => ({
  type: BENEFIT_TYPE_CONFIG_ACTION_TYPES.SAVE_ENTITY_COST_CENTER_LOADER,
  payload: data,
});
export const saveCustomFieldsData = (data: customObjInterface[]) => ({
  type: BENEFIT_TYPE_CONFIG_ACTION_TYPES.SAVE_CUSTOM_FIELDS,
  payload: data,
});

export const saveEntityTypes = (data: any[]) => ({
  type: BENEFIT_TYPE_CONFIG_ACTION_TYPES.SAVE_ENTITY_TYPES,
  payload: data,
});
export const setTitleUpdateConfigData = (payload: any) => {
  return {
    type: BENEFIT_TYPE_CONFIG_ACTION_TYPES.SET_TITLE_UPDATE_CONFIG_DATA,
    payload: payload,
  };
};
export const saveLegalEntities = (data: any[]) => ({
  type: BENEFIT_TYPE_CONFIG_ACTION_TYPES.SAVE_ENTITY,
  payload: data,
});
export const saveFlexibleBenefitCategory = (data: any[]) => ({
  type: BENEFIT_TYPE_CONFIG_ACTION_TYPES.SAVE_FLEXIBLE_BENEFIT_CATEGORY,
  payload: data,
});
export const saveDependentRelations = (data: any[]) => ({
  type: BENEFIT_TYPE_CONFIG_ACTION_TYPES.SAVE_DEPENDENT_RELATIONS,
  payload: data,
});

export const saveLabelMapping = (data: Ilabel) => ({
  type: BENEFIT_TYPE_CONFIG_ACTION_TYPES.SAVE_LABEL_MAPPING,
  payload: data,
});

export const saveWageTypes = (data: Array<any>) => ({
  type: BENEFIT_TYPE_CONFIG_ACTION_TYPES.SAVE_WAGE_TYPES,
  payload: data,
});

export const saveCostCentre = (data: any[]) => ({
  type: BENEFIT_TYPE_CONFIG_ACTION_TYPES.SAVE_COST_CENTRE,
  payload: data,
});

export const saveBenefitTypes = (data: any[]) => ({
  type: BENEFIT_TYPE_CONFIG_ACTION_TYPES.SAVE_BENEFIT_TYPES,
  payload: data,
});

export const setError = (error: string) => ({
  type: BENEFIT_TYPE_CONFIG_ACTION_TYPES.SET_ERROR,
  payload: error,
});

export const setSuccess = (message: string) => ({
  type: BENEFIT_TYPE_CONFIG_ACTION_TYPES.SET_SUCCESS,
  payload: message,
});

export const setLoader = (isLoading: boolean) => ({
  type: BENEFIT_TYPE_CONFIG_ACTION_TYPES.SET_LOADING,
  payload: isLoading,
});

export const saveExpenses = (data: any[]) => ({
  type: BENEFIT_TYPE_CONFIG_ACTION_TYPES.SAVE_EXPENSE_TYPES,
  payload: data,
});

export const setLoadingMessage = (data: string) => ({
  type: BENEFIT_TYPE_CONFIG_ACTION_TYPES.SET_LOADING_MESSAGE,
  payload: data,
});

export const saveExpandedItem = (data: any) => ({
  type: BENEFIT_TYPE_CONFIG_ACTION_TYPES.SAVE_EXPANDED_ITEM,
  payload: data,
});

export const resetData = () => ({
  type: BENEFIT_TYPE_CONFIG_ACTION_TYPES.RESET_BENEFIT_DATA,
});

export const saveGLAccounts = (data: any[]) => ({
  type: BENEFIT_TYPE_CONFIG_ACTION_TYPES.SAVE_GL_ACCOUNTS,
  payload: data,
});

export const setDataLoading = (isLoading: boolean) => ({
  type: BENEFIT_TYPE_CONFIG_ACTION_TYPES.SET_DATA_LOADING,
  payload: isLoading,
});

export const resetLabelMapping = () => ({
  type: BENEFIT_TYPE_CONFIG_ACTION_TYPES.RESET_LABEL_MAPPING,
});

export const saveDefaultLabelMapping = (data: Ilabel) => ({
  type: BENEFIT_TYPE_CONFIG_ACTION_TYPES.SAVE_DEFAULT_LABEL_MAPPING,
  payload: data,
});

export const saveEntitlementTypes = (data: any[]) => ({
  type: BENEFIT_TYPE_CONFIG_ACTION_TYPES.SAVE_ENTITLEMENT_TYPE,
  payload: data,
});

export const saveAvailableAfter = (data: any[]) => ({
  type: BENEFIT_TYPE_CONFIG_ACTION_TYPES.SAVE_AVAILABLE_AFTER,
  payload: data,
});

export const saveAvailableAfterUnit = (data: any[]) => ({
  type: BENEFIT_TYPE_CONFIG_ACTION_TYPES.SAVE_AVAILABLE_AFTER_PERIOD_UNIT,
  payload: data,
});

export const saveEntitlementPeriodUnit = (data: any[]) => ({
  type: BENEFIT_TYPE_CONFIG_ACTION_TYPES.SAVE_ENTITLEMENT_PERIOD_UNIT,
  payload: data,
});

export const saveProratedBy = (data: any[]) => ({
  type: BENEFIT_TYPE_CONFIG_ACTION_TYPES.SAVE_PRORATED_BY,
  payload: data,
});

export const saveDeductibleComponent = (data: any[]) => ({
  type: BENEFIT_TYPE_CONFIG_ACTION_TYPES.SAVE_DEDUCTIBLE_COMPONENT,
  payload: data,
});

export const saveProration = (data: any[]) => ({
  type: BENEFIT_TYPE_CONFIG_ACTION_TYPES.SAVE_PRORATION,
  payload: data,
});
export const saveEntitlementPeriod = (data: any[]) => ({
  type: BENEFIT_TYPE_CONFIG_ACTION_TYPES.SAVE_ENTITLEMENT_PERIOD,
  payload: data,
});

export const saveFrequencyUnit = (data: any[]) => ({
  type: BENEFIT_TYPE_CONFIG_ACTION_TYPES.SAVE_FREQUENCY_UNIT,
  payload: data,
});

export const saveMaxClaimPerEntitlementPeriod = (data: any[]) => ({
  type: BENEFIT_TYPE_CONFIG_ACTION_TYPES.SAVE_MAX_CLAIM_PER_ENTITLEMENT_PERIOD,
  payload: data,
});

export const saveClaimFor = (data: any[]) => ({
  type: BENEFIT_TYPE_CONFIG_ACTION_TYPES.SAVE_CLAIM_FOR,
  payload: data,
});

export const saveLegalEntityRecords = (data: any[]) => ({
  type: BENEFIT_TYPE_CONFIG_ACTION_TYPES.SAVE_LEGAL_ENTITIES,
  payload: data,
});

export const saveBenefitTypeData = (data: any) => ({
  type: BENEFIT_TYPE_CONFIG_ACTION_TYPES.SAVE_BENEFIT_TYPE_DATA,
  payload: data,
});

export const resetBenefitTypeMessages = () => ({
  type: BENEFIT_TYPE_CONFIG_ACTION_TYPES.RESET_MESSAGES,
});

export const returnUpdateRateTypeAction = (_val: string) => ({
  type: BENEFIT_TYPE_CONFIG_ACTION_TYPES.UPDATE_RATE_TYPE,
  payload: {
    rate_type: _val,
  },
});
