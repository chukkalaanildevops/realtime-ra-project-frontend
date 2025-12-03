import { Dispatch } from 'react';
import {
  getApprovalItemCountsService,
  getApprovalItemsService,
  respondToApprovalItemsService,
  respondToBulkApprovalItemsService,
} from '../../services/approvals';
import {
  updateApprovalItemsCount,
  setActiveTabKey,
  setApprovalItemsDataFetchingFailed,
  setApprovalItemsCountLoading,
  setApprovalItemsLoading,
  updateApprovalItems,
  updatePaginationData,
  setLoadingStatus,
} from './approvals.action';
import {
  IApprovalItemsRequestParameters,
  IApprovalResponseData,
  IItemTypes,
  EactiveTabKey,
  IBulkApprovalResponseData,
} from './approvals.model';
import {
  success,
  error,
  loading,
  destroy,
} from '../../shared/components/responcePopUp/responcePopUp';
import { stateInterface } from '../../shared/redux/rootReducer';

export const fetchApprovalItemCounts = (
  parameters: IApprovalItemsRequestParameters | any = {},
  source?: any,
) => {
  return (dispatch: Dispatch<any>, getState: () => stateInterface) => {
    getApprovalItemCountsService(parameters, source?.token)
      .then((response: any) => {
        const data = response.data;
        let benefitsCount = 0;
        let expenseCount = data.expenses;
        let requestCount = data.requests;
        let requestWithExpenseCount = data.expenses_attached_to_request;

        if (parameters.hasOwnProperty('item')) {
          const { pendingItemsCount } = getState().approvals;
          switch (parameters.item) {
            case 'expense':
              expenseCount = data.expenses;
              requestCount = pendingItemsCount.requests;
              requestWithExpenseCount = pendingItemsCount.expensesWithRequests;
              break;
            case 'request':
              expenseCount = pendingItemsCount.expenses;
              requestCount = data.requests;
              requestWithExpenseCount = pendingItemsCount.expensesWithRequests;
              break;
            case 'expenses_with_request':
              expenseCount = pendingItemsCount.expenses;
              requestCount = pendingItemsCount.requests;
              requestWithExpenseCount = data.expenses_attached_to_request;
              break;
          }
        }

        if (data.hasOwnProperty('benefits')) {
          benefitsCount = data.benefits;
        }

        dispatch(
          updateApprovalItemsCount(
            expenseCount,
            requestCount,
            requestWithExpenseCount,
            benefitsCount,
          ),
        );
      })
      .catch(() => {
        dispatch(updateApprovalItemsCount(0, 0, 0, 0));
      });
  };
};

export const fetchApprovalItems = (
  parameters: IApprovalItemsRequestParameters,
  dontMergeWithPrevData: boolean = false,
  source?: any,
) => {
  return (dispatch: Dispatch<any>, getState: () => stateInterface) => {
    dispatch(setApprovalItemsLoading(true));
    getApprovalItemsService(
      {
        ...parameters,
        is_paginated: 'yes',
      },
      source?.token,
    )
      .then((response: any) => {
        const { approvals } = getState();
        if (approvals.activeTabKey === String(EactiveTabKey[parameters.item])) {
          let expenseApprovalItems: any = [];
          let expensesWithRequestApprovalItems: any = [];
          let requestApprovalItems: any = [];
          let benefitApprovalItems: any = [];

          const _dontMergeWithPrevData =
            dontMergeWithPrevData || parameters.page === 1;

          switch (parameters.item) {
            case 'expense':
              expenseApprovalItems = [
                ...(_dontMergeWithPrevData
                  ? []
                  : approvals.expenseApprovalItems),
                ...response.data.data,
              ];
              break;
            case 'expenses_with_request':
              expensesWithRequestApprovalItems = [
                ...(_dontMergeWithPrevData
                  ? []
                  : approvals.expensesWithRequestApprovalItems),
                ...response.data.data,
              ];
              break;
            case 'request':
              requestApprovalItems = [
                ...(_dontMergeWithPrevData
                  ? []
                  : approvals.requestApprovalItems),
                ...response.data.data,
              ];
              break;
            case 'benefit':
              benefitApprovalItems = [
                ...(_dontMergeWithPrevData
                  ? []
                  : approvals.benefitApprovalItems),
                ...response.data.data,
              ];
              break;
          }

          dispatch(
            updateApprovalItems(
              expenseApprovalItems,
              expensesWithRequestApprovalItems,
              requestApprovalItems,
              benefitApprovalItems,
            ),
          );
          dispatch(fetchApprovalItemCounts(parameters, source));
          dispatch(updatePaginationData(response.data.pagination_data));
        }
      })
      .catch(() => {
        dispatch(setApprovalItemsDataFetchingFailed(true));
      });
  };
};

export const setActiveTab = (
  key: string,
  queryParam: { [x: string]: any } = {},
) => {
  return async (dispatch: Dispatch<any>) => {
    let item: IItemTypes;

    switch (key) {
      case '1':
        item = 'expense';
        break;
      case '2':
        item = 'request';
        break;
      case '3':
        item = 'expenses_with_request';
        break;
      case '4':
        item = 'benefit';
        break;
      default:
        item = 'expense';
        break;
    }
    let parameters: IApprovalItemsRequestParameters = {
      page: 1,
      item: item,
      function: 'data',
      ...queryParam,
    };
    dispatch(setActiveTabKey(key));
    dispatch(fetchApprovalItems(parameters, true));
    // dispatch(fetchApprovalItemCounts(parameters));
  };
};

export const respondToApprovalItems = (
  postData: IApprovalResponseData,
  queryParam: { [x: string]: any } = {},
) => {
  return (dispatch: Dispatch<any>) => {
    dispatch(setApprovalItemsCountLoading(true));
    dispatch(setApprovalItemsLoading(true));
    respondToApprovalItemsService(postData)
      .then(() => {
        let parameters: IApprovalItemsRequestParameters = {
          item: postData.item,
          function: 'data',
          ...queryParam,
          page: 1,
        };

        dispatch(fetchApprovalItemCounts(parameters));
        dispatch(fetchApprovalItems(parameters, true));
        success('Response saved.');
      })
      .catch(error => {
        error(error?.response?.data?.error || 'Failed To Save Response');
        dispatch(setApprovalItemsCountLoading(false));
        dispatch(setApprovalItemsLoading(false));
      });
  };
};

export const respondToBulkApprovalItems = (
  postData: IBulkApprovalResponseData,
  queryParam: { [x: string]: any } = {},
) => {
  return (dispatch: Dispatch<any>) => {
    dispatch(setApprovalItemsCountLoading(true));
    dispatch(setApprovalItemsLoading(true));
    dispatch(setLoadingStatus(true));
    loading(true, 'Saving Data');
    respondToBulkApprovalItemsService(postData)
      .then(() => {
        let parameters: IApprovalItemsRequestParameters = {
          item: postData.item,
          function: 'data',
          ...queryParam,
          page: 1,
        };

        dispatch(fetchApprovalItemCounts(parameters));
        dispatch(fetchApprovalItems(parameters, true));
        dispatch(setLoadingStatus(false));
      })
      .then(() => {
        destroy();
        success('Response saved.');
      })
      .catch(err => {
        destroy();
        dispatch(setApprovalItemsCountLoading(false));
        dispatch(setApprovalItemsLoading(false));
        dispatch(setLoadingStatus(false));
        error(err?.response?.data?.error || 'Failed To Save Response');
      });
  };
};
