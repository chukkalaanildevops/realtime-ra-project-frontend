export const FETCH_USERS = 'SEARCH_BAR/FETCH_USERS';

export const FETCH_EXPENSES = 'SEARCH_BAR/FETCH_EXPENSES';
export const FETCH_BENEFITS = 'SEARCH_BAR/FETCH_BENEFITS';

export const FETCH_REQUESTS = 'SEARCH_BAR/FETCH_REQUESTS';
export const FETCH_PROFILES = 'SEARCH_BAR/FETCH_PROFILES';

export const FETCH_USERS_SUCCESS = 'SEARCH_BAR/FETCH_USERS_SUCCESS';

export const FETCH_USERS_EXPENSE_SUCCESS =
  'SEARCH_BAR/FETCH_USERS_EXPENSE_SUCCESS';
export const FETCH_USERS_BENEFIT_SUCCESS =
  'SEARCH_BAR/FETCH_USERS_BENEFIT_SUCCESS';
export const FETCH_USERS_REQUEST_SUCCESS =
  'SEARCH_BAR/FETCH_USERS_REQUEST_SUCCESS';
export const FETCH_USERS_PROFILE_SUCCESS =
  'SEARCH_BAR/FETCH_USERS_PROFILE_SUCCESS';

export const FETCH_USERS_FAILURE = 'SEARCH_BAR/FETCH_USERS_FAILURE';

export const FETCH_LIMITED_USERS = 'SEARCH_BAR/FETCH_LIMITED_USERS';

export const FETCH_LIMITED_EXPENSES = 'SEARCH_BAR/FETCH_LIMITED_EXPENSES';
export const FETCH_LIMITED_BENEFITS = 'SEARCH_BAR/FETCH_LIMITED_BENEFITS';

export const FETCH_LIMITED_REQUESTS = 'SEARCH_BAR/FETCH_LIMITED_REQUESTS';
export const FETCH_LIMITED_PROFILES = 'SEARCH_BAR/FETCH_LIMITED_PROFILES';

export const FETCH_LIMITED_USERS_SUCCESS =
  'SEARCH_BAR/FETCH_LIMITED_USERS_SUCCESS';
export const FETCH_LIMITED_USERS_EXPENSE_SUCCESS =
  'SEARCH_BAR/FETCH_LIMITED_USERS_EXPENSE_SUCCESS';

export const FETCH_LIMITED_USERS_BENEFIT_SUCCESS =
  'SEARCH_BAR/FETCH_LIMITED_USERS_BENEFIT_SUCCESS';
export const FETCH_LIMITED_USERS_REQUEST_SUCCESS =
  'SEARCH_BAR/FETCH_LIMITED_USERS_REQUEST_SUCCESS';
export const FETCH_LIMITED_USERS_PROFILE_SUCCESS =
  'SEARCH_BAR/FETCH_LIMITED_USERS_PROFILE_SUCCESS';
export const FETCH_LIMITED_USERS_FAILURE =
  'SEARCH_BAR/FETCH_LIMITED_USERS_FAILURE';

export const fetchUserRequest = () => {
  return {
    type: FETCH_USERS,
  };
};

export const fetchExpenses = () => {
  return {
    type: FETCH_EXPENSES,
  };
};
export const fetchBenefits = () => {
  return {
    type: FETCH_BENEFITS,
  };
};
export const fetchRequests = () => {
  return {
    type: FETCH_REQUESTS,
  };
};

export const fetchProfiles = () => {
  return {
    type: FETCH_PROFILES,
  };
};

export const fetchUserRequestSuccess = (users: any) => {
  return {
    type: FETCH_USERS_SUCCESS,
    payload: users,
  };
};

export const fetchUserRequestForExpenseSuccess = (users: any) => {
  return {
    type: FETCH_USERS_EXPENSE_SUCCESS,
    payload: users,
  };
};
export const fetchUserRequestForRequestSuccess = (users: any) => {
  return {
    type: FETCH_USERS_REQUEST_SUCCESS,
    payload: users,
  };
};
export const fetchUserRequestForBenefitSuccess = (users: any) => {
  return {
    type: FETCH_USERS_BENEFIT_SUCCESS,
    payload: users,
  };
};
export const fetchUserRequestForProfileSuccess = (users: any) => {
  return {
    type: FETCH_USERS_PROFILE_SUCCESS,
    payload: users,
  };
};

export const fetchUserRequestFailure = (error: any) => {
  return {
    type: FETCH_USERS_FAILURE,
    payload: error,
  };
};

export const fetchLimitedUserRequest = () => {
  return {
    type: FETCH_LIMITED_USERS,
  };
};

export const fetchLimitedExpenses = () => {
  return {
    type: FETCH_LIMITED_EXPENSES,
  };
};
export const fetchLimitedBenefits = () => {
  return {
    type: FETCH_LIMITED_BENEFITS,
  };
};
export const fetchLimitedRequests = () => {
  return {
    type: FETCH_LIMITED_REQUESTS,
  };
};

export const fetchLimitedProfiles = () => {
  return {
    type: FETCH_LIMITED_PROFILES,
  };
};

export const fetchLimitedUserRequestSuccess = (users: any[]) => {
  return {
    type: FETCH_LIMITED_USERS_SUCCESS,
    payload: users,
  };
};

export const fetchLimitedUserRequestForExpensesSuccess = (users: any[]) => {
  return {
    type: FETCH_LIMITED_USERS_EXPENSE_SUCCESS,
    payload: users,
  };
};

export const fetchLimitedUserRequestForBenefitsSuccess = (users: any[]) => {
  return {
    type: FETCH_LIMITED_USERS_BENEFIT_SUCCESS,
    payload: users,
  };
};

export const fetchLimitedUserRequestForRequestsSuccess = (users: any[]) => {
  return {
    type: FETCH_LIMITED_USERS_REQUEST_SUCCESS,
    payload: users,
  };
};

export const fetchLimitedUserRequestForProfilesSuccess = (users: any[]) => {
  return {
    type: FETCH_LIMITED_USERS_PROFILE_SUCCESS,
    payload: users,
  };
};

export const fetchLimitedUserRequestFailure = (error: any) => {
  return {
    type: FETCH_LIMITED_USERS_FAILURE,
    payload: error,
  };
};
