import * as actions from '../searchBar/searchBar.actions';
import { ISearchBarState, dataType } from './searchBar.model';

const data: dataType = {
  data: [],
  pagination_data: {
    next_page: 0,
    number_of_pages: 0,
    total_records: 0,
  },
  current_page: 1,
};

export const InitialState: ISearchBarState = {
  loading: false,
  data: data,
  error: '',

  expenseLoading: false,
  expenseData: data,
  expenseError: '',

  requestLoading: false,
  requestData: data,
  requestError: '',

  benefitLoading: false,
  benefitData: data,
  benefitError: '',

  userLoading: false,
  userData: data,
  userError: '',

  limitedResultsLoading: false,
  limitedResultsData: [],
  limitedResultsError: '',

  limitedResultsExpenseLoading: false,
  limitedResultsExpenseData: [],
  limitedResultsExpenseError: '',

  limitedResultsBenefitLoading: false,
  limitedResultsBenefitData: [],
  limitedResultsBenefitError: '',

  limitedResultsRequestLoading: false,
  limitedResultsRequestData: [],
  limitedResultsRequestError: '',

  limitedResultsProfileLoading: false,
  limitedResultsProfileData: [],
  limitedResultsProfileError: '',
};

const searchBarReducer = (state = InitialState, action: any) => {
  const { type, payload } = action;

  switch (type) {
    case actions.FETCH_USERS:
      return {
        ...state,
        loading: true,
      };
    case actions.FETCH_EXPENSES:
      return {
        ...state,
        expenseLoading: true,
      };
    case actions.FETCH_BENEFITS:
      return {
        ...state,
        benefitLoading: true,
      };
    case actions.FETCH_REQUESTS:
      return {
        ...state,
        requestLoading: true,
      };
    case actions.FETCH_PROFILES:
      return {
        ...state,
        userLoading: true,
      };
    case actions.FETCH_USERS_SUCCESS:
      return {
        ...state,
        loading: false,
        data: payload,
        error: '',
      };
    case actions.FETCH_USERS_EXPENSE_SUCCESS:
      return {
        ...state,
        expenseLoading: false,
        expenseData: payload,
        expenseError: '',
      };
    case actions.FETCH_USERS_BENEFIT_SUCCESS:
      return {
        ...state,
        benefitLoading: false,
        benefitData: payload,
        benefitError: '',
      };
    case actions.FETCH_USERS_REQUEST_SUCCESS:
      return {
        ...state,
        requestLoading: false,
        requestData: payload,
        requestError: '',
      };
    case actions.FETCH_USERS_PROFILE_SUCCESS:
      return {
        ...state,
        userLoading: false,
        userData: payload,
        userError: '',
      };
    case actions.FETCH_USERS_FAILURE:
      return {
        ...state,
        loading: false,
        data: [],
        error: payload,
      };
    case actions.FETCH_LIMITED_USERS:
      return {
        ...state,
        limitedResultsLoading: true,
      };
    case actions.FETCH_LIMITED_EXPENSES:
      return {
        ...state,
        limitedResultsExpenseLoading: true,
      };
    case actions.FETCH_LIMITED_BENEFITS:
      return {
        ...state,
        limitedResultsBenefitLoading: true,
      };
    case actions.FETCH_LIMITED_REQUESTS:
      return {
        ...state,
        limitedResultsRequestLoading: true,
      };
    case actions.FETCH_LIMITED_PROFILES:
      return {
        ...state,
        limitedResultsProfileLoading: true,
      };
    case actions.FETCH_LIMITED_USERS_SUCCESS:
      return {
        ...state,
        limitedResultsLoading: false,
        limitedResultsData: payload,
        limitedResultsError: '',
      };
    case actions.FETCH_LIMITED_USERS_EXPENSE_SUCCESS:
      return {
        ...state,
        limitedResultsExpenseLoading: false,
        limitedResultsExpenseData: payload,
        limitedResultsExpenseError: '',
      };
    case actions.FETCH_LIMITED_USERS_BENEFIT_SUCCESS:
      return {
        ...state,
        limitedResultsBenefitLoading: false,
        limitedResultsBenefitData: payload,
        limitedResultsBenefitError: '',
      };
    case actions.FETCH_LIMITED_USERS_REQUEST_SUCCESS:
      return {
        ...state,
        limitedResultsRequestLoading: false,
        limitedResultsRequestData: payload,
        limitedResultsRequestError: '',
      };
    case actions.FETCH_LIMITED_USERS_PROFILE_SUCCESS:
      return {
        ...state,
        limitedResultsProfileLoading: false,
        limitedResultsProfileData: payload,
        limitedResultsProfileError: '',
      };
    case actions.FETCH_LIMITED_USERS_FAILURE:
      return {
        ...state,
        limitedResultsLoading: false,
        limitedResultsData: [],
        limitedResultsError: payload,
      };
    default:
      return state;
  }
};

export default searchBarReducer;
