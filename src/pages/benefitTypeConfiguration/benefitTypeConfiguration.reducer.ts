import {
  IBenefitTypeConfigState,
  IExpandedItem,
} from './benefitTypeConfiguration.model';
import { BENEFIT_TYPE_CONFIG_ACTION_TYPES } from './benefitTypeConfiguration.action';

export const initialState: IBenefitTypeConfigState = {
  entityList: [],
  flexibleBenefitCategory: [],
  dependentRelations: [],
  label: {},
  customFields: { fields: [], layout: [] },
  entityTypesList: [],
  wageTypes: [],
  // costCentre: [],
  benefitTypes: [],
  rate_type: '',
  success: '',
  error: '',
  loader: false,
  expenseTypes: [],
  loadingMessage: '',
  glAccounts: [],
  expandedItem: {} as IExpandedItem,
  isDataLoading: false,
  defaultLabels: {},
  availableAfter: [],
  availableAfterPeriodUnit: [],
  claimFor: [],
  deductibleComponent: [],
  proration: [],
  entitlementPeriod: [],
  frequencyUnit: [],
  maxClaimPerEntitlementPeriodList: [],
  entitlementType: [],
  entitlementTypeUnit: [],
  proratedBy: [],
  benefitLegalEntitiesRecords: [],
  benefitTypeData: undefined,
  titleUpdateConfigData: {
    id: null,
    title: '',
    code: '',
  },
  cost_centres_for_legal_entity: [],
  initialBenefitCostCenterForLegalEntity: [],
  entityCostCenterList: [],
  entityCostCenterLoader: false,
};

export default (state = initialState, action: any) => {
  const { type, payload } = action;
  switch (type) {
    case BENEFIT_TYPE_CONFIG_ACTION_TYPES.SAVE_ENTITY:
      return {
        ...state,
        entityList: payload,
      };
    case BENEFIT_TYPE_CONFIG_ACTION_TYPES.UPDATE_COST_CENTER_FOR_ENTITY:
      let updatedData = state.cost_centres_for_legal_entity;
      updatedData[payload.index].cost_centre = payload.uuid;
      return {
        ...state,
        cost_centres_for_legal_entity: updatedData,
      };
    case BENEFIT_TYPE_CONFIG_ACTION_TYPES.SAVE_ENTITY_COST_CENTER:
      let resultList: any[] = [];

      if (payload.length > 0) {
        resultList = payload.map((value: any) => {
          let result = state.cost_centres_for_legal_entity.find(
            ccEntity => ccEntity.legal_entity === value.legal_entity.title,
          );
          if (result) {
            return {
              ...result,
            };
          } else {
            return {
              legal_entity: value.legal_entity.title,
              cost_centre: '',
            };
          }
        });
      }

      return {
        ...state,
        entityCostCenterList: payload,
        cost_centres_for_legal_entity: resultList,
      };
    case BENEFIT_TYPE_CONFIG_ACTION_TYPES.SAVE_ENTITY_COST_CENTER_LOADER:
      return {
        ...state,
        entityCostCenterLoader: payload,
      };
    case BENEFIT_TYPE_CONFIG_ACTION_TYPES.SAVE_FLEXIBLE_BENEFIT_CATEGORY:
      return {
        ...state,
        flexibleBenefitCategory: payload,
      };
    case BENEFIT_TYPE_CONFIG_ACTION_TYPES.SAVE_DEPENDENT_RELATIONS:
      return {
        ...state,
        dependentRelations: payload,
      };

    case BENEFIT_TYPE_CONFIG_ACTION_TYPES.SAVE_CUSTOM_FIELDS:
      return {
        ...state,
        customFields: payload,
      };
    case BENEFIT_TYPE_CONFIG_ACTION_TYPES.SAVE_LABEL_MAPPING:
      return {
        ...state,
        label: payload,
      };
    case BENEFIT_TYPE_CONFIG_ACTION_TYPES.SAVE_ENTITY_TYPES:
      return {
        ...state,
        entityTypesList: payload,
      };
    case BENEFIT_TYPE_CONFIG_ACTION_TYPES.SAVE_MAX_CLAIM_PER_ENTITLEMENT_PERIOD:
      return {
        ...state,
        maxClaimPerEntitlementPeriodList: payload,
      };
    case BENEFIT_TYPE_CONFIG_ACTION_TYPES.SET_ERROR:
      return {
        ...state,
        error: payload,
      };
    case BENEFIT_TYPE_CONFIG_ACTION_TYPES.SET_SUCCESS:
      return {
        ...state,
        success: payload,
      };
    case BENEFIT_TYPE_CONFIG_ACTION_TYPES.SET_LOADING:
      return {
        ...state,
        loader: payload,
      };
    case BENEFIT_TYPE_CONFIG_ACTION_TYPES.SAVE_WAGE_TYPES:
      return {
        ...state,
        wageTypes: payload,
      };
    // case BENEFIT_TYPE_CONFIG_ACTION_TYPES.SAVE_COST_CENTRE:
    //   return {
    //     ...state,
    //     costCentre: payload,
    //   };
    case BENEFIT_TYPE_CONFIG_ACTION_TYPES.SAVE_BENEFIT_TYPES:
      return {
        ...state,
        benefitTypes: payload,
      };
    case BENEFIT_TYPE_CONFIG_ACTION_TYPES.SAVE_EXPENSE_TYPES:
      return {
        ...state,
        expenseTypes: payload,
      };
    case BENEFIT_TYPE_CONFIG_ACTION_TYPES.SET_LOADING_MESSAGE:
      return {
        ...state,
        loadingMessage: payload,
      };
    case BENEFIT_TYPE_CONFIG_ACTION_TYPES.SAVE_EXPANDED_ITEM:
      let modifiedCCLegalEntity = [];
      let initialData = payload?.cost_centres_for_legal_entity || [];
      if (
        payload?.cost_centres_for_legal_entity &&
        payload.cost_centres_for_legal_entity.length > 0
      ) {
        const ccLegalEntity = payload?.cost_centres_for_legal_entity || [];
        modifiedCCLegalEntity = ccLegalEntity.map((value: any) => {
          return {
            legal_entity: value.legal_entity.title,
            cost_centre: value.cost_centre.uuid,
          };
        });
        delete payload.cost_centres_for_legal_entity;
      }
      if (
        payload?.is_dependent_benefit &&
        payload?.dependent_relationships.length > 0
      ) {
        const idsList = payload.dependent_relationships.map(
          (value: any) => value.id,
        );
        payload.dependent_relationships = idsList;
      }
      return {
        ...state,
        expandedItem: payload,
        initialBenefitCostCenterForLegalEntity: initialData,
        cost_centres_for_legal_entity: modifiedCCLegalEntity,
        label: payload.label_mapping,
        defaultLabels: payload.label_mapping,
        customFields: payload.custom_fields,
      };
    case BENEFIT_TYPE_CONFIG_ACTION_TYPES.RESET_BENEFIT_DATA:
      return {
        ...initialState,
        loader: state.loader,
        loadingMessage: state.loadingMessage,
        benefitTypes: state.benefitTypes,
      };
    case BENEFIT_TYPE_CONFIG_ACTION_TYPES.SAVE_GL_ACCOUNTS:
      return {
        ...state,
        glAccounts: payload,
      };
    case BENEFIT_TYPE_CONFIG_ACTION_TYPES.SET_DATA_LOADING:
      return {
        ...state,
        isDataLoading: payload,
      };
    case BENEFIT_TYPE_CONFIG_ACTION_TYPES.SAVE_DEFAULT_LABEL_MAPPING:
      return {
        ...state,
        defaultLabels: payload,
      };
    case BENEFIT_TYPE_CONFIG_ACTION_TYPES.RESET_LABEL_MAPPING:
      return {
        ...state,
        label: state.defaultLabels,
      };
    case BENEFIT_TYPE_CONFIG_ACTION_TYPES.SAVE_ENTITLEMENT_TYPE:
      return {
        ...state,
        entitlementType: payload,
      };
    case BENEFIT_TYPE_CONFIG_ACTION_TYPES.SAVE_ENTITLEMENT_PERIOD_UNIT:
      return {
        ...state,
        entitlementTypeUnit: payload,
      };
    case BENEFIT_TYPE_CONFIG_ACTION_TYPES.SAVE_AVAILABLE_AFTER:
      return {
        ...state,
        availableAfter: payload,
      };
    case BENEFIT_TYPE_CONFIG_ACTION_TYPES.SAVE_AVAILABLE_AFTER_PERIOD_UNIT:
      return {
        ...state,
        availableAfterPeriodUnit: payload,
      };
    case BENEFIT_TYPE_CONFIG_ACTION_TYPES.SAVE_CLAIM_FOR:
      return {
        ...state,
        claimFor: payload,
      };
    case BENEFIT_TYPE_CONFIG_ACTION_TYPES.SAVE_DEDUCTIBLE_COMPONENT:
      return {
        ...state,
        deductibleComponent: payload,
      };
    case BENEFIT_TYPE_CONFIG_ACTION_TYPES.SAVE_PRORATION:
      return {
        ...state,
        proration: payload,
      };
    case BENEFIT_TYPE_CONFIG_ACTION_TYPES.SAVE_ENTITLEMENT_PERIOD:
      return {
        ...state,
        entitlementPeriod: payload,
      };
    case BENEFIT_TYPE_CONFIG_ACTION_TYPES.SAVE_FREQUENCY_UNIT:
      return {
        ...state,
        frequencyUnit: payload,
      };
    case BENEFIT_TYPE_CONFIG_ACTION_TYPES.SAVE_PRORATED_BY:
      return {
        ...state,
        proratedBy: payload,
      };
    case BENEFIT_TYPE_CONFIG_ACTION_TYPES.SAVE_LEGAL_ENTITIES:
      return {
        ...state,
        benefitLegalEntitiesRecords: payload,
      };
    case BENEFIT_TYPE_CONFIG_ACTION_TYPES.SAVE_BENEFIT_TYPE_DATA:
      return {
        ...state,
        benefitTypeData: payload,
      };
    case BENEFIT_TYPE_CONFIG_ACTION_TYPES.RESET_MESSAGES:
      return {
        ...state,
        success: '',
        error: '',
        loadingMessage: '',
      };
    case BENEFIT_TYPE_CONFIG_ACTION_TYPES.SET_TITLE_UPDATE_CONFIG_DATA:
      return {
        ...state,
        titleUpdateConfigData: payload,
      };
    case BENEFIT_TYPE_CONFIG_ACTION_TYPES.UPDATE_RATE_TYPE:
      return {
        ...state,
        rate_type: payload,
      };
    default:
      return state;
  }
};

export const getLabels = (state: IBenefitTypeConfigState) => state.label;
export const getCustomField = (state: IBenefitTypeConfigState) =>
  state.customFields;
export const getEntities = (state: IBenefitTypeConfigState) => state.entityList;
export const getEntityTypes = (state: IBenefitTypeConfigState) =>
  state.entityTypesList;
export const getWageTypes = (state: IBenefitTypeConfigState) => state.wageTypes;
// export const getCostCentre = (state: IBenefitTypeConfigState) =>
//   state.costCentre;
export const getBenefitTypes = (state: IBenefitTypeConfigState) =>
  state.benefitTypes;
export const getSuccessMessage = (state: IBenefitTypeConfigState) =>
  state.success;
export const getErrorMessage = (state: IBenefitTypeConfigState) => state.error;
export const getExpenseTypes = (state: IBenefitTypeConfigState) =>
  state.expenseTypes;
export const getLoadingStatus = (state: IBenefitTypeConfigState) =>
  state.loader;
export const getLoadingMessage = (state: IBenefitTypeConfigState) =>
  state.loadingMessage;
export const getExpandedItem = (state: IBenefitTypeConfigState) =>
  state.expandedItem;
export const getBenefitTypesGlAccounts = (state: IBenefitTypeConfigState) =>
  state.glAccounts;
export const getDataLoading = (state: IBenefitTypeConfigState) =>
  state.isDataLoading;
export const getEntitlementTypes = (state: IBenefitTypeConfigState) =>
  state.entitlementType;
export const getEntitlementPeriodUnit = (state: IBenefitTypeConfigState) =>
  state.entitlementTypeUnit;
export const getAvailableAfter = (state: IBenefitTypeConfigState) =>
  state.availableAfter;
export const getAvailableAfterPeriod = (state: IBenefitTypeConfigState) =>
  state.availableAfterPeriodUnit;
export const getDeductibleComponent = (state: IBenefitTypeConfigState) =>
  state.deductibleComponent;
export const getProration = (state: IBenefitTypeConfigState) => state.proration;
export const getEntitlementPeriod = (state: IBenefitTypeConfigState) =>
  state.entitlementPeriod;
export const getFrequencyUnit = (state: IBenefitTypeConfigState) =>
  state.frequencyUnit;
export const getmaxClaimPerEntitlementPeriodList = (
  state: IBenefitTypeConfigState,
) => state.maxClaimPerEntitlementPeriodList;
export const getCanClaimFor = (state: IBenefitTypeConfigState) =>
  state.claimFor;
export const getProratedBy = (state: IBenefitTypeConfigState) =>
  state.proratedBy;
export const getBenefitLegalRecords = (state: IBenefitTypeConfigState) =>
  state.benefitLegalEntitiesRecords;
export const getBenefitTypeData = (state: IBenefitTypeConfigState) =>
  state.benefitTypeData;
export const getTitleUpdateConfig = (state: IBenefitTypeConfigState) =>
  state.titleUpdateConfigData;
