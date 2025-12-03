import { BENEFIT_CATEGORY_ACTIONS } from './benefitCategories.actions';

const initialState: any = {
  isLoading: false,
  entityList: [],
  wageTypes: [],
  benefitCategories: [],
  totalCategory: 0,
  backendError: {},
  isFormLoading: false,
};

const BenefitCategoriesReducer: any = (
  state = initialState,
  actions: { type: any; payload: any },
) => {
  const { type, payload } = actions;

  switch (type) {
    // LOADERS //
    case BENEFIT_CATEGORY_ACTIONS.SET_IS_LOADING:
      return {
        ...state,
        isLoading: payload,
      };
    // Data Stores //
    case BENEFIT_CATEGORY_ACTIONS.SET_BENEFIT_CATEGORY_LIST:
      return {
        ...state,
        benefitCategories: payload,
      };
    case BENEFIT_CATEGORY_ACTIONS.SAVE_ENTITY:
      return {
        ...state,
        entityList: payload,
      };
    case BENEFIT_CATEGORY_ACTIONS.SAVE_WAGE_TYPES:
      return {
        ...state,
        wageTypes: payload,
      };
    case BENEFIT_CATEGORY_ACTIONS.SAVE_TOTAL_CATEGORY:
      return {
        ...state,
        totalCategory: payload,
      };
    case BENEFIT_CATEGORY_ACTIONS.SAVE_BACKEND_ERROR:
      return {
        ...state,
        backendError: payload,
      };
    case BENEFIT_CATEGORY_ACTIONS.SAVE_FORM_LOADING_STATUS:
      return {
        ...state,
        isFormLoading: payload,
      };
    default:
      return state;
  }
};

export default BenefitCategoriesReducer;
