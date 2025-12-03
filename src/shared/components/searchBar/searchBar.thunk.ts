import { Dispatch } from 'react';
import * as actions from '../searchBar/searchBar.actions';
import {
  fetchLimitedSearchResultsAPI,
  fetchSearchResultsAPI,
} from '../../../services/search';
import Axios from 'axios';
import { stateInterface } from '../../redux/rootReducer';

let CancelToken = Axios.CancelToken;
let CancelRequest: Function;

export const fetchUsersFromSearchBar = (
  val: string,
  type: string,
  pageNumber: number = 1,
) => {
  return async (dispatch: Dispatch<any>, getState: () => stateInterface) => {
    try {
      if (type === '') {
        dispatch(actions.fetchUserRequest());
      } else if (type === 'expenses') {
        dispatch(actions.fetchExpenses());
      } else if (type === 'requests') {
        dispatch(actions.fetchRequests());
      } else if (type === 'benefits') {
        dispatch(actions.fetchBenefits());
      } else {
        dispatch(actions.fetchProfiles());
      }

      let query = '';
      if (type !== '') {
        query = `showall=true&query=${val}&type=${type}`;
      } else {
        query = `showall=true&query=${val}`;
      }

      // eslint-disable-next-line no-unused-expressions
      CancelRequest?.('cancelled');
      CancelToken = Axios.CancelToken;

      const response = await fetchSearchResultsAPI(query, pageNumber, {
        cancelToken: new CancelToken(function executor(c) {
          CancelRequest = c;
        }),
      });

      const responseData = response.data;

      let newData = responseData.data;

      let dataObj: any = {
        expenses: 'expenseData',
        requests: 'requestData',
        benefits: 'benefitData',
        users: 'userData',
        all: 'data',
      };

      if (pageNumber > 1) {
        const key:
          | 'expenseData'
          | 'requestData'
          | 'userData'
          | 'data'
          | 'benefitData' = dataObj[type || 'all'];
        let previousData = getState().searchBar[key].data;
        newData = previousData.concat(responseData.data);
      }

      if (type === '') {
        dispatch(
          actions.fetchUserRequestSuccess({
            data: newData,
            pagination_data: responseData.pagination_data,
          }),
        );
      } else if (type === 'expenses') {
        dispatch(
          actions.fetchUserRequestForExpenseSuccess({
            data: newData,
            pagination_data: responseData.pagination_data,
          }),
        );
      } else if (type === 'requests') {
        dispatch(
          actions.fetchUserRequestForRequestSuccess({
            data: newData,
            pagination_data: responseData.pagination_data,
          }),
        );
      } else if (type === 'benefits') {
        dispatch(
          actions.fetchUserRequestForBenefitSuccess({
            data: newData,
            pagination_data: responseData.pagination_data,
          }),
        );
      } else {
        dispatch(
          actions.fetchUserRequestForProfileSuccess({
            data: newData,
            pagination_data: responseData.pagination_data,
          }),
        );
      }
    } catch (error) {
      if (error.message !== 'cancelled')
        dispatch(actions.fetchUserRequestFailure(error.message));
    }
  };
};

export const fetchLimitedUsersFromSearchBar = (val: string, type: string) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      if (type === '') {
        dispatch(actions.fetchLimitedUserRequest());
      } else if (type === 'expenses') {
        dispatch(actions.fetchLimitedExpenses());
      } else if (type === 'requests') {
        dispatch(actions.fetchLimitedRequests());
      } else if (type === 'benefits') {
        dispatch(actions.fetchLimitedBenefits());
      } else {
        dispatch(actions.fetchLimitedProfiles());
      }

      let query = '';
      if (type !== '') {
        query = `query=${val}&type=${type}`;
      } else {
        query = `query=${val}`;
      }
      // eslint-disable-next-line no-unused-expressions
      CancelRequest?.('cancelled');
      CancelToken = Axios.CancelToken;

      const response = await fetchLimitedSearchResultsAPI(query, {
        cancelToken: new CancelToken(function executor(c) {
          CancelRequest = c;
        }),
      });

      const responseData = response.data;

      if (type === '') {
        dispatch(actions.fetchLimitedUserRequestSuccess(responseData));
      } else if (type === 'expenses') {
        dispatch(
          actions.fetchLimitedUserRequestForExpensesSuccess(responseData),
        );
      } else if (type === 'requests') {
        dispatch(
          actions.fetchLimitedUserRequestForRequestsSuccess(responseData),
        );
      } else if (type === 'benefits') {
        dispatch(
          actions.fetchLimitedUserRequestForBenefitsSuccess(responseData),
        );
      } else {
        dispatch(
          actions.fetchLimitedUserRequestForProfilesSuccess(responseData),
        );
      }
    } catch (error) {
      if (error.message !== 'cancelled')
        dispatch(actions.fetchLimitedUserRequestFailure(error.message));
    }
  };
};
