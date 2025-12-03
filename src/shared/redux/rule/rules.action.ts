export const RULES_ACTION_TYPES = {
  SET_LOADING: 'RULES_ACTION_TYPES/SET_LOADING',
  SET_RULE_ITEM_LOADING: 'RULES_ACTION_TYPES/SET_RULE_ITEM_LOADING',
  SET_LOADING_MESSAGE: 'RULES_ACTION_TYPES/SET_LOADING_MESSAGE',
  SAVE_RULES: 'RULES_ACTION_TYPES/SAVE_RULES',
  SET_ERROR: 'RULES_ACTION_TYPES/SET_ERROR',
  SAVE_RULE_BY_ID: 'RULES_ACTION_TYPES/SAVE_RULE_BY_ID',
};

export const setLoader = (isLoading: boolean) => ({
  type: RULES_ACTION_TYPES.SET_LOADING,
  payload: isLoading,
});

export const setRuleItemLoader = (isLoading: boolean) => ({
  type: RULES_ACTION_TYPES.SET_RULE_ITEM_LOADING,
  payload: isLoading,
});

export const setLoadingMessage = (message: string) => ({
  type: RULES_ACTION_TYPES.SET_LOADING_MESSAGE,
  payload: message,
});

export const saveRules = (data: any) => ({
  type: RULES_ACTION_TYPES.SAVE_RULES,
  payload: data,
});

export const setError = (error: string) => ({
  type: RULES_ACTION_TYPES.SET_ERROR,
  payload: error,
});

export const saveRuleById = (data: any) => ({
  type: RULES_ACTION_TYPES.SAVE_RULE_BY_ID,
  payload: data,
});
