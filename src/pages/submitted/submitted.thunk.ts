/* eslint-disable no-unused-expressions */
import { Dispatch } from 'react';
import {
  setLoader,
  setLoadingMessage,
  saveRequests,
  saveExpenses,
  saveBenefits,
  setError,
  setSuccess,
  saveRequestDetailsById,
  saveUserDetails,
  setSubmittedCountLoading,
  saveSubmittedCount,
  saveExpensesWithRequest,
  saveSubmittedCountForReset,
} from './submitted.action';
import {
  fetchRequestDetailsWithExpensesByIdAPI,
  withdrawRequestAPI,
  deleteRequestsAPI,
} from '../../services/requestType';
import {
  deleteExpenseClaim,
  bulkExpenseApprovals,
  withdrawExpenseClaim,
  withdrawBenefitClaim,
} from '../../services/expenseClaim';

import { fetchEmpJobInformation } from '../../services/auth/index';
import { tabs } from './submitted.model';
import {
  fetchSubmittedData,
  attachWorkflowExpenseAPI,
  attachWorkflowBenefitAPI,
  attachWorkflowRequestAPI,
} from '../../services/submitted';
import { stateInterface } from '../../shared/redux/rootReducer';

import {
  success,
  loading,
  destroy,
  error,
} from '../../shared/components/responcePopUp/responcePopUp';

const apiStart = (isLoading = false, message = '') => {
  return async (dispatch: Dispatch<any>) => {
    dispatch(setLoader(isLoading));
    dispatch(setLoadingMessage(message));
  };
};

export const fetchRequestDetailsById = (id: string) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(apiStart(true, 'Loading data'));
      const response = await fetchRequestDetailsWithExpensesByIdAPI(id);
      dispatch(saveRequestDetailsById(response.data));
      dispatch(apiStart());
    } catch (e) {
      dispatch(apiStart());
    }
  };
};

export const deleteExpenseRequestById = (
  expenseId: number,
  requestId: string,
) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(apiStart(true, 'Deleting expense'));
      await deleteExpenseClaim(expenseId);
      dispatch(fetchRequestDetailsById(requestId));

      dispatch(apiStart());
    } catch (e) {
      dispatch(apiStart());
    }
  };
};

export const deleteExpenseById = (
  id: number,
  type: 'expense' | 'expenses_with_request',
  filters: any,
  pageSize?: number,
) => {
  return (dispatch: Dispatch<any>) => {
    dispatch(setLoader(true));
    loading(true, 'Deleting expenses');
    deleteExpenseClaim(id)
      .then(() => {
        dispatch(fetchSubmittedTabData(type, 1, filters, pageSize));
      })
      .then(() => {
        destroy();
        dispatch(setLoader(false));
        success('Expenses deleted successfully');
      })
      .catch(() => {
        destroy();
        dispatch(setLoader(false));
        error('Failed to delete expenses');
      });
  };
};

export const deleteRequests = (
  requests_id: number[],
  filters: any,
  pageSize?: number,
) => {
  return (dispatch: Dispatch<any>) => {
    dispatch(setLoader(true));
    loading(true, 'Deleting request');
    deleteRequestsAPI(requests_id)
      .then(() => {
        dispatch(fetchSubmittedTabData('request', 1, filters, pageSize));
      })
      .then(() => {
        destroy();
        dispatch(setLoader(false));
        success('Request deleted successfully');
      })
      .catch(() => {
        destroy();
        dispatch(setLoader(false));
        error('Failed to delete request');
      });
  };
};

export const sendExpenseForApproval = (
  expenses: number[],
  requestId: string,
) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(apiStart(true, 'Sending expenses for approval'));
      await bulkExpenseApprovals(expenses);
      dispatch(apiStart(false));
      dispatch(setSuccess('Expenses Sent for approval'));
      dispatch(fetchRequestDetailsById(requestId));
    } catch (e) {
      dispatch(apiStart(false));
      dispatch(setError('Failed to send for approval'));
    }
  };
};

export const fetchUserDetails = (userId: string) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(apiStart(true, 'fetching user details'));
      const response = await fetchEmpJobInformation(userId);
      dispatch(apiStart(false));
      dispatch(saveUserDetails(response.data));
    } catch (e) {
      dispatch(apiStart(false));
      dispatch(setError('Failed to fetch user details'));
    }
  };
};

export const withdrawRequest = (
  id: number,
  remark: string,
  filters: any,
  pageSize?: number,
) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(apiStart(true, 'Withdraw request'));
      const response = await withdrawRequestAPI(id, remark);
      dispatch(apiStart(false));
      dispatch(setSuccess(response.data?.message || 'Request withdraw'));
      dispatch(fetchSubmittedTabData('request', 1, filters, pageSize));
    } catch (e) {
      dispatch(apiStart(false));
      dispatch(setError(e.response.data.error));
    }
  };
};

export const withdrawExpense = (
  id: number,
  remark: string,
  requestId?: string,
  type?: 'expense' | 'expenses_with_request' | 'benefit',
  filters?: any,
  pageSize?: number,
) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(apiStart(true, 'Withdraw expense'));
      const response = await withdrawExpenseClaim(id, remark);
      dispatch(apiStart(false));
      dispatch(setSuccess(response.data?.message || 'Expense withdraw'));
      if (requestId === undefined) {
        dispatch(
          fetchSubmittedTabData(type || 'expense', 1, filters, pageSize),
        );
      } else {
        dispatch(fetchRequestDetailsById(requestId));
      }
    } catch (e) {
      dispatch(apiStart(false));
      dispatch(setError(e.response.data.error));
    }
  };
};

export const withdrawBenefit = (
  id: number,
  remark: string,
  requestId?: string,
  type?: 'benefit',
  filters?: any,
  pageSize?: number,
) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(apiStart(true, 'Withdraw benefit'));
      const response = await withdrawBenefitClaim(id, remark);
      dispatch(apiStart(false));
      dispatch(setSuccess(response.data?.message || 'Benefit withdraw'));
      if (requestId === undefined) {
        dispatch(
          fetchSubmittedTabData(type || 'benefit', 1, filters, pageSize),
        );
      } else {
        dispatch(fetchRequestDetailsById(requestId));
      }
    } catch (e) {
      dispatch(apiStart(false));
      dispatch(setError(e.response.data.error));
    }
  };
};

export const fetchSubmittedCount = (fetchNext?: tabs, source?: any) => {
  return async (dispatch: Dispatch<any>, getState: () => stateInterface) => {
    try {
      // const proxyId = getState().delegates.currentDelegateUser?.id;
      dispatch(setSubmittedCountLoading(true));
      const response = await fetchSubmittedData(
        'count',
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        source?.token,
      );
      dispatch(saveSubmittedCount(response.data));
      dispatch(saveSubmittedCountForReset(response.data));
      dispatch(setSubmittedCountLoading(false));
      if (fetchNext) {
        dispatch(fetchSubmittedTabData(fetchNext, 1));
      }
    } catch (e) {
      dispatch(setSubmittedCountLoading(false));
    }
  };
};

export const fetchSubmittedTabData = (
  tab: tabs,
  page?: number,
  filters?: any,
  pageSize?: number,
  status?: 'PENDNG' | 'APPRVD' | 'REJCTD',
  source?: any,
) => {
  return async (dispatch: Dispatch<any>, getState: () => stateInterface) => {
    try {
      const pageNumber = page || getState()?.submitted[tab]?.current_page;
      dispatch(apiStart(true, ''));
      const response = await fetchSubmittedData(
        'data',
        tab,
        pageNumber,
        status,
        filters,
        pageSize,
        source?.token,
      );
      const responseData = response.data;
      if (responseData.data.length === 0 && pageNumber !== 1) {
        dispatch(fetchSubmittedTabData(tab, (pageNumber || 2) - 1));
        return;
      }
      dispatch(
        saveSubmittedCount({
          [`${tab}s`]: responseData.pagination_data.total_records,
        }),
      );
      const current_page = pageNumber;
      if (tab === 'expense') {
        dispatch(saveExpenses({ ...responseData, current_page: current_page }));
      } else if (tab === 'benefit') {
        dispatch(saveBenefits({ ...responseData, current_page: current_page }));
      } else if (tab === 'request') {
        dispatch(saveRequests({ ...responseData, current_page: current_page }));
      } else if (tab === 'expenses_with_request') {
        dispatch(
          saveExpensesWithRequest({
            ...responseData,
            current_page: current_page,
          }),
        );
      }
      dispatch(apiStart(false));
    } catch (e) {
      dispatch(apiStart());
    }
  };
};

export const attachExpenseWorkflow = (
  id: number,
  callback?: (isSuccess: boolean) => void,
) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(apiStart(true));
      await attachWorkflowExpenseAPI(id);
      dispatch(setSuccess('Workflow Attached'));
      dispatch(apiStart(false));
      callback?.(true);
    } catch (e) {
      dispatch(apiStart(false));
      callback?.(false);
    }
  };
};

export const attachBenefitWorkflow = (
  id: number,
  callback?: (isSuccess: boolean) => void,
) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(apiStart(true));
      await attachWorkflowBenefitAPI(id);
      dispatch(setSuccess('Workflow Attached'));
      dispatch(apiStart(false));
      callback?.(true);
    } catch (e) {
      dispatch(apiStart(false));
      callback?.(false);
    }
  };
};
// attachWorkflowBenefitAPI
export const attachRequestWorkflow = (id: number, filters: any) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(apiStart(true));
      await attachWorkflowRequestAPI(id);
      dispatch(setSuccess('Workflow Attached'));
      dispatch(apiStart(false));
      dispatch(fetchSubmittedTabData('request', 1, filters));
    } catch (e) {
      dispatch(apiStart(false));
    }
  };
};
