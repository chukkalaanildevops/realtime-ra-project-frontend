/* eslint-disable no-unused-expressions */
import { Dispatch } from 'react';
import {
  setLoader,
  setCardLoader,
  setLoadingMessage,
  saveCardData,
  setError,
  setSuccess,
  setDashboardLoadDataFailed,
} from './dashboard.actions';
import { fetchCardDraftData } from '../../services/drafts';
import { fetchSubmittedData } from '../../services/submitted';

import {
  getApprovalItemsService,
  respondToApprovalItemsService,
} from '../../services/approvals';
import {
  DASHBOARD_CARD_TYPES,
  TFetchSpecificDataTypes,
} from './dashboard.model';
import {
  bulkExpenseApprovals,
  bulkBenefitApprovals,
} from '../../services/expenseClaim';
import { approveRequests } from '../../services/requestType';
import { IApprovalResponseData } from '../approvals/approvals.model';
import {
  isProxyPermissionAllowed,
  getIsBenefitEnabled,
  stateInterface,
} from '../../shared/redux/rootReducer';
import { AxiosResponse } from 'axios';

const apiStart = (isLoading = false, message = '') => {
  return async (dispatch: Dispatch<any>) => {
    dispatch(setLoader(isLoading));
    dispatch(setLoadingMessage(message));
  };
};

export const fetchDashboardCardData = (type: any, source?: any) => {
  return async (dispatch: Dispatch<any>, getState: () => stateInterface) => {
    try {
      let array: any[] = [
        // fetchCardDraftData('data', 'receipt'),
      ];
      const state = getState();
      // const proxyId = state.delegates.currentDelegateUser?.id;
      const isExpenseAllowed = isProxyPermissionAllowed(
        state,
        'ACTION_EXPENSE',
      );
      const isRequestAllowed = isProxyPermissionAllowed(
        state,
        'ACTION_REQUEST',
      );
      const isBenefitAllowed =
        getIsBenefitEnabled(state) &&
        isProxyPermissionAllowed(state, 'ACTION_BENEFIT');

      const isExpenseApprovalAllowed = isProxyPermissionAllowed(
        state,
        'ACTION_EXPENSE_APPROVAL',
      );
      const isRequestApprovalAllowed = isProxyPermissionAllowed(
        state,
        'ACTION_REQUEST_APPROVAL',
      );
      const isBenefitApprovalAllowed =
        getIsBenefitEnabled(state) &&
        isProxyPermissionAllowed(state, 'ACTION_BENEFIT_APPROVAL');
      dispatch(setDashboardLoadDataFailed(false));
      dispatch(setCardLoader(type, true));
      switch (type) {
        case 'draftExpense':
          const expenseDraft = isExpenseAllowed
            ? await fetchCardDraftData('expenses', source.token)
            : [];
          array = array.concat([expenseDraft]);
          break;
        case 'draftRequest':
          const requestDraft = isRequestAllowed
            ? await fetchCardDraftData('requests', source.token)
            : [];
          array = array.concat([requestDraft]);
          break;
        case 'draftBenefit':
          const benefitDraft = isBenefitAllowed
            ? await fetchCardDraftData('benefits', source.token)
            : [];

          array = array.concat([benefitDraft]);
          break;
        case 'pendingExpense':
          const expensePending = isExpenseApprovalAllowed
            ? await getApprovalItemsService(
                {
                  function: 'data',
                  item: 'expense',
                  page: 1,
                  status: 'PENDNG',
                  // delegation: proxyId,
                },
                source.token,
              )
            : [];
          const expenseWithRequestPending = isExpenseApprovalAllowed
            ? await getApprovalItemsService(
                {
                  function: 'data',
                  item: 'expenses_with_request',
                  page: 1,
                  status: 'PENDNG',
                  // delegation: proxyId,
                },
                source.token,
              )
            : [];
          array = array.concat([expensePending, expenseWithRequestPending]);
          break;
        case 'pendingRequest':
          const requestPending = isRequestApprovalAllowed
            ? await getApprovalItemsService(
                {
                  function: 'data',
                  item: 'request',
                  page: 1,
                  status: 'PENDNG',
                  // delegation: proxyId,
                },
                source.token,
              )
            : [];
          array = array.concat([requestPending]);
          break;
        case 'pendingBenefit':
          const benefitPending = isBenefitApprovalAllowed
            ? await getApprovalItemsService(
                {
                  function: 'data',
                  item: 'benefit',
                  page: 1,
                  status: 'PENDNG',
                  // delegation: proxyId,
                },
                source.token,
              )
            : [];
          array = array.concat([benefitPending]);
          break;
        case 'approvedExpense':
          const approvedExpense = isExpenseAllowed
            ? await fetchSubmittedData(
                'data',
                'expense',
                1,
                'APPRVD',
                undefined,
                undefined,
                source.token,
              )
            : [];
          const approvedExpenseWithRequest = isExpenseAllowed
            ? await fetchSubmittedData(
                'data',
                'expenses_with_request',
                1,
                'APPRVD',
                undefined,
                undefined,
                source.token,
              )
            : [];

          array = array.concat([approvedExpense, approvedExpenseWithRequest]);
          break;
        case 'approvedRequest':
          const requestApproved = isRequestAllowed
            ? await fetchSubmittedData(
                'data',
                'request',
                1,
                'APPRVD',
                undefined,
                undefined,
                source.token,
              )
            : [];
          array = array.concat([requestApproved]);
          break;
        case 'approvedBenefit':
          const benefitApproved = isBenefitAllowed
            ? await fetchSubmittedData(
                'data',
                'benefit',
                1,
                'APPRVD',
                undefined,
                undefined,
                source.token,
              )
            : [];
          array = array.concat([benefitApproved]);
          break;
        case 'rejectedClaims':
          const rejectedExpense = isExpenseAllowed
            ? await fetchSubmittedData(
                'data',
                'expense',
                1,
                'REJCTD',
                undefined,
                undefined,
                source.token,
              )
            : [];
          const rejectedExpenseWithRequest = isExpenseAllowed
            ? await fetchSubmittedData(
                'data',
                'expenses_with_request',
                1,
                'REJCTD',
                undefined,
                undefined,
                source.token,
              )
            : [];

          array = array.concat([rejectedExpense, rejectedExpenseWithRequest]);
          break;
        case 'rejectedRequest':
          const requestRejected = isRequestAllowed
            ? await fetchSubmittedData(
                'data',
                'request',
                1,
                'REJCTD',
                undefined,
                undefined,
                source.token,
              )
            : [];
          array = array.concat([requestRejected]);
          break;
        case 'rejectedBenefit':
          const benefitRejected = isBenefitAllowed
            ? await fetchSubmittedData(
                'data',
                'benefit',
                1,
                'REJCTD',
                undefined,
                undefined,
                source.token,
              )
            : [];
          array = array.concat([benefitRejected]);
          break;
      }
      // dispatch(resetCardData());
      let data: any = getSimplifiedMultipleResponseData(array);
      dispatch(saveCardData(data));
      dispatch(setCardLoader(type, false));
    } catch (e) {
      dispatch(setCardLoader(type, false));
      dispatch(setDashboardLoadDataFailed(true));
    }
  };
};

const getSimplifiedMultipleResponseData = (response: AxiosResponse[]) => {
  let data: any = {};
  response.forEach(item => {
    const url = item.config.url || '';
    if (url.includes('drafted')) {
      if (url.includes('expenses')) {
        const oldData = data[DASHBOARD_CARD_TYPES.draftExpense]?.data || [];
        const totalRecords =
          data[DASHBOARD_CARD_TYPES.draftExpense]?.total_records || 0;
        let newData = [...oldData, ...item.data.data];
        newData = newData.map((item: any) => {
          return {
            ...item,
            isEmployee: true,
          };
        });
        if (item.data.pagination_data.total_records > 12) {
          newData = newData.slice(0, 12);
          newData.push({ showAllCard: true });
        }
        data[DASHBOARD_CARD_TYPES.draftExpense] = {
          total_records: totalRecords + item.data.pagination_data.total_records,
          data: newData,
        };
      } else if (url.includes('requests')) {
        const newData = item.data.data;
        if (item.data.pagination_data.total_records > 12) {
          newData.push({ showAllCard: true });
        }
        data[DASHBOARD_CARD_TYPES.draftRequest] = {
          total_records: item.data.pagination_data.total_records,
          data: newData,
        };
      } else if (url.includes('receipt')) {
        const newData = [...item.data.data];
        if (item.data.pagination_data.total_records > 12) {
          newData.push({ showAllCard: true });
        }
        data[DASHBOARD_CARD_TYPES.savedReceipts] = {
          total_records: item.data.pagination_data.total_records,
          data: newData,
        };
      } else if (url.includes('benefits')) {
        const oldData = data[DASHBOARD_CARD_TYPES.draftBenefit]?.data || [];
        const totalRecords =
          data[DASHBOARD_CARD_TYPES.draftBenefit]?.total_records || 0;
        let newData = [...oldData, ...item.data.data];
        if (item.data.pagination_data.total_records > 12) {
          newData = newData.slice(0, 12);
          newData.push({ showAllCard: true });
        }
        data[DASHBOARD_CARD_TYPES.draftBenefit] = {
          total_records: totalRecords + item.data.pagination_data.total_records,
          data: newData,
        };
      }
    } else if (url.includes('submitted')) {
      if (
        (url.includes('expense') || url.includes('expenses_with_request')) &&
        url.includes('APPRVD')
      ) {
        const oldData = data[DASHBOARD_CARD_TYPES.approvedExpense]?.data || [];
        const totalRecords =
          data[DASHBOARD_CARD_TYPES.approvedExpense]?.total_records || 0;
        let newData = [...oldData, ...item.data.data];
        newData = newData.map((item: any) => {
          return {
            ...item,
            isEmployee: true,
          };
        });
        if (item.data.pagination_data.total_records > 12) {
          newData = newData.slice(0, 12);
          newData.push({ showAllCard: true });
        }
        data[DASHBOARD_CARD_TYPES.approvedExpense] = {
          total_records: item.data.pagination_data.total_records + totalRecords,
          data: newData,
        };
      } else if (url.includes('request') && url.includes('APPRVD')) {
        const newData = item.data.data;
        if (item.data.pagination_data.total_records > 12) {
          newData.push({ showAllCard: true });
        }
        data[DASHBOARD_CARD_TYPES.approvedRequest] = {
          total_records: item.data.pagination_data.total_records,
          data: newData,
        };
      } else if (url.includes('benefit') && url.includes('APPRVD')) {
        const oldData = data[DASHBOARD_CARD_TYPES.approvedBenefit]?.data || [];
        const totalRecords =
          data[DASHBOARD_CARD_TYPES.approvedBenefit]?.total_records || 0;
        let newData = [...oldData, ...item.data.data];
        if (item.data.pagination_data.total_records > 12) {
          newData = newData.slice(0, 12);
          newData.push({ showAllCard: true });
        }
        data[DASHBOARD_CARD_TYPES.approvedBenefit] = {
          total_records: item.data.pagination_data.total_records + totalRecords,
          data: newData,
        };
      } else if (
        (url.includes('expense') || url.includes('expenses_with_request')) &&
        url.includes('REJCTD')
      ) {
        const oldData = data[DASHBOARD_CARD_TYPES.rejectedClaims]?.data || [];
        const totalRecords =
          data[DASHBOARD_CARD_TYPES.rejectedClaims]?.total_records || 0;
        let newData = [...oldData, ...item.data.data];
        newData = newData.map((item: any) => {
          return {
            ...item,
            isEmployee: true,
          };
        });
        if (item.data.pagination_data.total_records > 12) {
          newData = newData.slice(0, 12);
          newData.push({ showAllCard: true });
        }
        data[DASHBOARD_CARD_TYPES.rejectedClaims] = {
          total_records: item.data.pagination_data.total_records + totalRecords,
          data: newData,
        };
      } else if (url.includes('request') && url.includes('REJCTD')) {
        const newData = item.data.data;
        if (item.data.pagination_data.total_records > 12) {
          newData.push({ showAllCard: true });
        }
        data[DASHBOARD_CARD_TYPES.rejectedRequest] = {
          total_records: item.data.pagination_data.total_records,
          data: newData,
        };
      } else if (url.includes('benefit') && url.includes('REJCTD')) {
        const newData = item.data.data;
        if (item.data.pagination_data.total_records > 12) {
          newData.push({ showAllCard: true });
        }
        data[DASHBOARD_CARD_TYPES.rejectedBenefit] = {
          total_records: item.data.pagination_data.total_records,
          data: newData,
        };
      }
    } else if (url.includes('workflow')) {
      let subgroups = item.data.flatMap((item: any) => item.subgroups);
      if (
        item.config.params.item === 'expense' ||
        item.config.params.item === 'expenses_with_request'
      ) {
        let items = subgroups.flatMap((item: any) => item.claims);
        items = items.map((item: any) => {
          return {
            ...item,
            isApprovalPage: true,
          };
        });
        if (data[DASHBOARD_CARD_TYPES.pendingExpense]) {
          const newData = data[DASHBOARD_CARD_TYPES.pendingExpense].data.concat(
            items,
          );
          if (newData.length > 12) {
            newData.push({ showAllCard: true });
          }
          data[DASHBOARD_CARD_TYPES.pendingExpense] = {
            data: newData,
            total_records: newData.length,
          };
        } else {
          if (items.length > 12) {
            items.push({ showAllCard: true });
          }
          data[DASHBOARD_CARD_TYPES.pendingExpense] = {
            data: items,
            total_records: items.length,
          };
        }
      } else if (item.config.params.item === 'request') {
        let items = subgroups.flatMap((item: any) => item.requests);
        if (items.length > 12) {
          items.push({ showAllCard: true });
        }
        data[DASHBOARD_CARD_TYPES.pendingRequest] = {
          data: items,
          total_records: items.length,
        };
      } else if (item.config.params.item === 'benefit') {
        let items = subgroups.flatMap((item: any) => item.claims);
        if (data[DASHBOARD_CARD_TYPES.pendingBenefit]) {
          const newData = data[DASHBOARD_CARD_TYPES.pendingBenefit].data.concat(
            items,
          );
          if (newData.length > 12) {
            newData.push({ showAllCard: true });
          }
          data[DASHBOARD_CARD_TYPES.pendingBenefit] = {
            data: newData,
            total_records: newData.length,
          };
        } else {
          if (items.length > 12) {
            items.push({ showAllCard: true });
          }
          data[DASHBOARD_CARD_TYPES.pendingBenefit] = {
            data: items,
            total_records: items.length,
          };
        }
      }
    }
  });
  return data;
};

export const fetchSpecificData = (
  type: TFetchSpecificDataTypes,
  showLoader: boolean = false,
) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(apiStart(showLoader, ''));
      dispatch(setCardLoader(type, true));
      let res: any;
      switch (type) {
        case 'draftExpense':
          res = await Promise.all([fetchCardDraftData('expenses')]);
          break;
        case 'draftRequest':
          res = await fetchCardDraftData('requests');
          break;
        case 'draftBenefit':
          res = await fetchCardDraftData('benefits');
          break;
        case 'savedReceipts':
          console.warn('No action written onSavedReceipts');
          break;
        case 'pendingExpense':
          res = await Promise.all([
            getApprovalItemsService({
              function: 'data',
              item: 'expense',
              page: 1,
              status: 'PENDNG',
            }),
            getApprovalItemsService({
              function: 'data',
              item: 'expenses_with_request',
              page: 1,
              status: 'PENDNG',
            }),
          ]);
          // let data: any = getSimplifiedMultipleResponseData(temp_res);
          break;
        case 'pendingRequest':
          res = await getApprovalItemsService({
            function: 'data',
            item: 'request',
            page: 1,
            status: 'PENDNG',
          });
          break;
        case 'pendingBenefit':
          res = await getApprovalItemsService({
            function: 'data',
            item: 'benefit',
            page: 1,
            status: 'PENDNG',
          });
          break;
        case 'approvedExpense':
          res = await Promise.all([
            fetchSubmittedData('data', 'expense', 1, 'APPRVD', undefined),
            fetchSubmittedData(
              'data',
              'expenses_with_request',
              1,
              'APPRVD',
              undefined,
            ),
          ]);
          break;
        case 'approvedRequest':
          res = await fetchSubmittedData(
            'data',
            'request',
            1,
            'APPRVD',
            undefined,
          );
          break;
        case 'approvedBenefit':
          res = await fetchSubmittedData(
            'data',
            'benefit',
            1,
            'APPRVD',
            undefined,
          );
          break;
        case 'rejectedClaims':
          res = await Promise.all([
            fetchSubmittedData('data', 'expense', 1, 'REJCTD', undefined),
            fetchSubmittedData(
              'data',
              'expenses_with_request',
              1,
              'REJCTD',
              undefined,
            ),
          ]);
          break;
        case 'rejectedRequest':
          res = await fetchSubmittedData(
            'data',
            'request',
            1,
            'REJCTD',
            undefined,
          );
          break;
        case 'rejectedBenefit':
          res = await fetchSubmittedData(
            'data',
            'benefit',
            1,
            'REJCTD',
            undefined,
          );
          break;
      }
      let data: any = getSimplifiedMultipleResponseData(
        Array.isArray(res) ? res : [res],
      );

      dispatch(saveCardData(data));
      dispatch(setCardLoader(type, false));
    } catch (e) {
      dispatch(apiStart(false));
      dispatch(setError('Failed to sync data with the server'));
      dispatch(setCardLoader(type, false));
    }
  };
};

export const sendExpenseForApproval = (expenses: number[]) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(apiStart(true, 'Sending expense for approval'));
      await bulkExpenseApprovals(expenses);
      dispatch(apiStart(false));
      dispatch(setSuccess('Expenses Sent for approval'));
      dispatch(fetchSpecificData('draftExpense'));
    } catch (e) {
      dispatch(apiStart(false));
      dispatch(setError('Failed to send for approval'));
    }
  };
};

export const sendBenefitForApproval = (benefit: number[]) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(apiStart(true, 'Sending benefit for approval'));
      await bulkBenefitApprovals(benefit);
      dispatch(apiStart(false));
      dispatch(setSuccess('Benefits Sent for approval'));
      dispatch(fetchSpecificData('draftBenefit'));
    } catch (e) {
      dispatch(apiStart(false));
      dispatch(setError('Failed to send for approval'));
    }
  };
};

export const sendRequestForApproval = (request: number[]) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(apiStart(true, 'Sending request for approval'));
      await approveRequests(request);
      dispatch(apiStart(false));
      dispatch(setSuccess('Request Sent for approval'));
      dispatch(fetchSpecificData('draftRequest'));
    } catch (e) {
      dispatch(apiStart(false));
      dispatch(setError('Failed send for approval'));
    }
  };
};

export const approveRejectItems = (data: IApprovalResponseData) => {
  return async (dispatch: Dispatch<any>, getState: () => stateInterface) => {
    try {
      await respondToApprovalItemsService(data);
      dispatch(apiStart());
      dispatch(
        setSuccess(
          data.action === 'approve' ? 'Record approved' : 'Record rejected',
        ),
      );
      const state = getState();
      const isExpenseAllowed = isProxyPermissionAllowed(
        state,
        'ACTION_EXPENSE',
      );
      const isRequestAllowed = isProxyPermissionAllowed(
        state,
        'ACTION_REQUEST',
      );
      const isBenefitAllowed =
        getIsBenefitEnabled(state) &&
        isProxyPermissionAllowed(state, 'ACTION_BENEFIT');

      if (data.action === 'approve') {
        if (data.item === 'expense') {
          dispatch(fetchSpecificData('pendingExpense'));
          isExpenseAllowed && dispatch(fetchSpecificData('approvedExpense'));
        }
        if (data.item === 'request') {
          dispatch(fetchSpecificData('pendingRequest'));
          isRequestAllowed && dispatch(fetchSpecificData('approvedRequest'));
        }
        if (data.item === 'benefit') {
          dispatch(fetchSpecificData('pendingBenefit'));
          isBenefitAllowed && dispatch(fetchSpecificData('approvedBenefit'));
        }
      } else {
        if (data.item === 'expense') {
          dispatch(fetchSpecificData('pendingExpense'));
          isExpenseAllowed && dispatch(fetchSpecificData('rejectedClaims'));
        }
        if (data.item === 'request') {
          dispatch(fetchSpecificData('pendingRequest'));
          isRequestAllowed && dispatch(fetchSpecificData('rejectedRequest'));
        }
        if (data.item === 'benefit') {
          dispatch(fetchSpecificData('pendingBenefit'));
          isBenefitAllowed && dispatch(fetchSpecificData('rejectedBenefit'));
        }
      }
    } catch (e) {
      dispatch(apiStart());
      dispatch(
        setError(
          `${
            data.action === 'approve'
              ? 'Failed to approval record'
              : 'Failed to reject record'
          }`,
        ),
      );
    }
  };
};
