import { IRuleState } from './rules.models';
import { RULES_ACTION_TYPES } from './rules.action';

const initialState: IRuleState = {
  error: '',
  isLoading: false,
  isRuleItemLoading: false,
  loadingMessage: '',
  rulesArray: {
    current_page: 0,
    data: [],
    pagination_data: {
      number_of_pages: 0,
      total_records: 0,
    },
  },
  ruleDetails: undefined,
};

export default (state = initialState, action: any) => {
  const { type, payload } = action;

  switch (type) {
    case RULES_ACTION_TYPES.SET_LOADING:
      return {
        ...state,
        isLoading: payload,
      };
    case RULES_ACTION_TYPES.SET_RULE_ITEM_LOADING:
      return {
        ...state,
        isRuleItemLoading: payload,
      };
    case RULES_ACTION_TYPES.SET_LOADING_MESSAGE:
      return {
        ...state,
        loadingMessage: payload,
      };
    case RULES_ACTION_TYPES.SET_ERROR:
      return {
        ...state,
        error: payload,
      };
    case RULES_ACTION_TYPES.SAVE_RULES:
      return {
        ...state,
        rulesArray: payload,
      };
    case RULES_ACTION_TYPES.SAVE_RULE_BY_ID:
      return {
        ...state,
        ruleDetails: payload,
      };
    default:
      return state;
  }
};

export const getIsLoading = (state: IRuleState) => state.isLoading;

export const getIsRuleItemLoading = (state: IRuleState) =>
  state.isRuleItemLoading;

export const getLoadingMessage = (state: IRuleState) => state.loadingMessage;

export const getErrorMessage = (state: IRuleState) => state.error;

export const getRulesData = (state: IRuleState) =>
  state.isLoading
    ? {
        data: new Array(10).fill({}),
        current_page: 1,
        pagination_data: {
          number_of_pages: 0,
          total_records: 10,
        },
      }
    : state.rulesArray;

export const getRuleDetails = (state: IRuleState) => state.ruleDetails;
