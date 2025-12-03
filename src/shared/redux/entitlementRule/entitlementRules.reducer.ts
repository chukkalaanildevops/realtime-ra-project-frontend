import { IEntitlementRuleState } from './entitlementRules.models';
import { ENTITLEMENT_RULES_ACTION_TYPES } from './entitlementRules.action';

const initialState: IEntitlementRuleState = {
  error: '',
  isLoading: false,
  isEntitlementRuleItemLoading: false,
  loadingMessage: '',
  entitlementRulesArray: {
    current_page: 0,
    data: [],
    pagination_data: {
      number_of_pages: 0,
      total_records: 0,
    },
  },
  entitlementRulesLoader: false,
  isRuleItemLoading: false,
  entitlementRuleDetails: undefined,
  isSimulatedDataListLoading: false,
  isSimulatedEntitlementDataLoading: false,
  simulatedEntitlementData: [],
  simulatedListData: [],
  isSimulatedDataLoading: false,
};

export default (state = initialState, action: any) => {
  const { type, payload } = action;

  switch (type) {
    case ENTITLEMENT_RULES_ACTION_TYPES.SET_LOADING:
      return {
        ...state,
        isLoading: payload,
      };
    case ENTITLEMENT_RULES_ACTION_TYPES.SET_ENTITLEMENT_RULE_ITEM_LOADING:
      return {
        ...state,
        isRuleItemLoading: payload,
      };
    case ENTITLEMENT_RULES_ACTION_TYPES.SET_LOADING_MESSAGE:
      return {
        ...state,
        loadingMessage: payload,
      };
    case ENTITLEMENT_RULES_ACTION_TYPES.SET_ERROR:
      return {
        ...state,
        error: payload,
      };
    case ENTITLEMENT_RULES_ACTION_TYPES.SAVE_ENTITLEMENT_RULES:
      return {
        ...state,
        entitlementRulesArray: payload,
      };

    case ENTITLEMENT_RULES_ACTION_TYPES.SET_ENTITLEMENT_RULES_LOADER:
      return {
        ...state,
        entitlementRulesLoader: payload,
      };
    case ENTITLEMENT_RULES_ACTION_TYPES.SAVE_ENTITLEMENT_RULE_BY_ID:
      return {
        ...state,
        entitlementRuleDetails: payload,
      };
    case ENTITLEMENT_RULES_ACTION_TYPES.SET_SIMULATED_DATA_LOADER:
      return {
        ...state,
        isSimulatedDataLoading: payload,
      };

    case ENTITLEMENT_RULES_ACTION_TYPES.SET_SIMULATED_LIST_DATA_LOADER:
      return {
        ...state,
        isSimulatedEntitlementDataLoading: payload,
      };
    case ENTITLEMENT_RULES_ACTION_TYPES.SET_SIMULATED_LIST_LOADER:
      return {
        ...state,
        isSimulatedDataListLoading: payload,
      };
    case ENTITLEMENT_RULES_ACTION_TYPES.FETCH_SIMULATED_ENTITLEMENT_DATA:
      return {
        ...state,
        simulatedEntitlementData: payload,
      };
    case ENTITLEMENT_RULES_ACTION_TYPES.FETCH_SIMULATED_LIST_DATA:
      return {
        ...state,
        simulatedListData: payload,
      };
    default:
      return state;
  }
};

export const getIsLoading = (state: IEntitlementRuleState) => state.isLoading;

export const getIsRuleItemLoading = (state: IEntitlementRuleState) =>
  state.isRuleItemLoading;

export const getIsEntitlementRuleItemLoading = (state: IEntitlementRuleState) =>
  state.isEntitlementRuleItemLoading;

export const getLoadingMessage = (state: IEntitlementRuleState) =>
  state.loadingMessage;

export const getErrorMessage = (state: IEntitlementRuleState) => state.error;

export const getEntitlementRulesData = (state: IEntitlementRuleState) =>
  state.isLoading
    ? {
        data: new Array(10).fill({}),
        current_page: 1,
        pagination_data: {
          number_of_pages: 0,
          total_records: 10,
        },
      }
    : state.entitlementRulesArray;

export const getEntitlementRuleDetails = (state: IEntitlementRuleState) =>
  state.entitlementRuleDetails;

export const getIsSimulatedDataLoading = (state: IEntitlementRuleState) =>
  state.isSimulatedDataLoading;

export const getSimulatedEntitementData = (state: IEntitlementRuleState) =>
  state.simulatedEntitlementData;

export const getSimulatedListData = (state: IEntitlementRuleState) =>
  state.simulatedListData;

export const getSimulatedDataListLoader = (state: IEntitlementRuleState) =>
  state.isSimulatedDataListLoading;
export const getSimulatedEntitlementDataLoader = (
  state: IEntitlementRuleState,
) => state.isSimulatedEntitlementDataLoading;
