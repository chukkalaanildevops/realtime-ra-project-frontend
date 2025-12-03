export const BENEFIT_CATEGORY_ACTIONS = {
  SAVE_ENTITY: 'SAVE_ENTITY',
  SET_IS_LOADING: 'SET_IS_LOADING',
  SAVE_WAGE_TYPES: 'SAVE_WAGE_TYPES',
  SAVE_BACKEND_ERROR: 'SAVE_BACKEND_ERROR',
  SAVE_FORM_LOADING_STATUS: 'SAVE_FORM_LOADING_STATUS',
  SAVE_TOTAL_CATEGORY: 'SAVE_TOTAL_CATEGORY',
  SET_BENEFIT_CATEGORY_LIST: 'SET_BENEFIT_CATEGORY_LIST',
};

export const setIsLoading: any = (isLoading: any) => ({
  type: BENEFIT_CATEGORY_ACTIONS.SET_IS_LOADING,
  payload: isLoading,
});
export const setBenefitCategoriesList: any = (list: any) => ({
  type: BENEFIT_CATEGORY_ACTIONS.SET_BENEFIT_CATEGORY_LIST,
  payload: list,
});

export const saveWageTypes = (data: Array<any>) => ({
  type: BENEFIT_CATEGORY_ACTIONS.SAVE_WAGE_TYPES,
  payload: data,
});

export const saveLegalEntities = (data: any[]) => ({
  type: BENEFIT_CATEGORY_ACTIONS.SAVE_ENTITY,
  payload: data,
});
export const saveTotalCategoryList = (data: any) => ({
  type: BENEFIT_CATEGORY_ACTIONS.SAVE_TOTAL_CATEGORY,
  payload: data,
});
export const saveBackendError = (data: any) => ({
  type: BENEFIT_CATEGORY_ACTIONS.SAVE_BACKEND_ERROR,
  payload: data,
});
export const saveFormLoadingStatus = (status: any) => ({
  type: BENEFIT_CATEGORY_ACTIONS.SAVE_FORM_LOADING_STATUS,
  payload: status,
});
