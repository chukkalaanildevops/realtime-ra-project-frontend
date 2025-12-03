/* eslint-disable no-unused-expressions */
import { Dispatch } from 'react';
import {
  setLoader,
  saveRequests,
  saveExpenses,
  setError,
  saveReceipt,
  saveDraftCount,
  saveBenefits,
  setDraftCountLoading,
  saveExpensesWithRequest,
  saveDraftCountForReset,
  setRequestApprovedOrDeleteState,
} from './drafts.action';
import {
  success,
  loading,
  destroy,
  error,
} from '../../shared/components/responcePopUp/responcePopUp';
import { approveRequests, deleteRequestsAPI } from '../../services/requestType';
import {
  deleteExpenseClaim,
  bulkExpenseApprovals,
  deleteMultipleExpenses,
  deleteMultipleBenefits,
  bulkBenefitApprovals,
} from '../../services/expenseClaim';
import { deleteReceipt, putReceipt } from '../../services/receipt';
import { IreceiptPutData } from '../receipt/receipt.model';
import { stateInterface } from '../../shared/redux/rootReducer';
import { fetchDraftData } from '../../services/drafts';
import { tabs } from './draft.model';

const catchError = (err: any, defaultErr: string) => {
  return () => {
    if (err.hasOwnProperty('non_field_errors')) {
      if (Array.isArray(err.non_field_errors)) {
        if (Boolean(err.non_field_errors.length)) {
          error(err.non_field_errors[0]);
          return;
        }
      }
    }
    error(defaultErr);
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
        dispatch(fetchDraftsTabData('request', 1, filters, pageSize));
      })
      .then(() => {
        destroy();
        dispatch(setLoader(false));
        success('Request deleted successfully');
        dispatch(setRequestApprovedOrDeleteState(true));
      })
      .catch(() => {
        destroy();
        dispatch(setLoader(false));
        error('Failed to delete request');
      });
  };
};

export const deleteExpenses = (
  expenses_id: number[],
  _type: 'expense' | 'expenses_with_request',
  successCallback?: Function,
  filters?: any,
) => {
  return (dispatch: Dispatch<any>) => {
    dispatch(setLoader(true));
    loading(true, 'Deleting expenses');
    deleteMultipleExpenses(expenses_id)
      .then(() => {
        dispatch(fetchDraftsTabData(_type, 1, filters));
        successCallback && successCallback();
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

export const deleteBenefits = (
  benefit_ids: number[],
  _type: 'benefit',
  successCallback?: Function,
  filters?: any,
) => {
  return (dispatch: Dispatch<any>) => {
    dispatch(setLoader(true));
    loading(true, 'Deleting Benefits');
    deleteMultipleBenefits(benefit_ids)
      .then(() => {
        dispatch(fetchDraftsTabData(_type, 1, filters));
        successCallback && successCallback();
      })
      .then(() => {
        destroy();
        dispatch(setLoader(false));
        success('Benefits deleted successfully');
      })
      .catch(() => {
        destroy();
        dispatch(setLoader(false));
        error('Failed to delete benefits');
      });
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
        dispatch(fetchDraftsTabData(type, 1, filters, pageSize));
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

export const deleteReceiptById = (
  id: number,
  page: number,
  filters: any,
  callBack?: Function,
) => {
  return (dispatch: Dispatch<any>) => {
    dispatch(setLoader(true));
    loading(true, 'Deleting receipt');
    deleteReceipt(id)
      .then(() => {
        dispatch(fetchDraftsTabData('receipt', page, filters));
        callBack && callBack();
      })
      .then(() => {
        destroy();
        dispatch(setLoader(false));
        success('Receipt deleted successfully');
      })
      .catch(e => {
        destroy();
        dispatch(setLoader(false));
        dispatch(catchError(e.response.data, 'Failed to delete receipt'));
      });
  };
};

export const updateReceipt = (
  id: number,
  receiptPostData: IreceiptPutData,
  page: number,
  filters: any,
  callBack?: Function,
) => {
  return (dispatch: Dispatch<any>) => {
    dispatch(setLoader(true));
    loading(true, 'Updating receipt');
    putReceipt(id, receiptPostData)
      .then(() => {
        dispatch(fetchDraftsTabData('receipt', page, filters));
        callBack && callBack();
      })
      .then(() => {
        destroy();
        dispatch(setLoader(false));
        success('Successfully updated receipt');
      })
      .catch(err => {
        destroy();
        dispatch(setLoader(false));
        if (err.response.status === 400) {
          const data = err.response.data;
          if ('non_field_errors' in data) {
            const errorMsg = data['non_field_errors'][0];
            // error(''); // without this error was not being displayed if save was click multiple times
            error(errorMsg);
          }
        } else {
          error('Failed to update receipt');
        }
      });
  };
};

export const sendRequestForApproval = (request: number[], filters: any) => {
  return (dispatch: Dispatch<any>) => {
    dispatch(setLoader(true));
    loading(true, 'Sending for approval');
    approveRequests(request)
      .then(() => {
        dispatch(fetchDraftsTabData('request', 1, filters));
        dispatch(setRequestApprovedOrDeleteState(true));
      })
      .then(() => {
        destroy();
        dispatch(setLoader(false));
        success('Request Sent for approval');
      })
      .catch(() => {
        destroy();
        dispatch(setLoader(false));
        error('Failed send for approval');
      });
  };
};

export const sendExpenseForApproval = (
  expenses: number[],
  type: 'expense' | 'expenses_with_request',
  filters: any,
) => {
  return (dispatch: Dispatch<any>) => {
    dispatch(setLoader(true));
    loading(true, 'Sending expenses for approval');
    bulkExpenseApprovals(expenses)
      .then(() => {
        dispatch(fetchDraftsTabData(type, 1, filters));
      })
      .then(() => {
        destroy();
        dispatch(setLoader(false));
        success('Expenses Sent for approval');
      })
      .catch(e => {
        destroy();
        dispatch(setLoader(false));
        if (e.response.data.has('date')) {
          error(e.response.data.date);

          dispatch(setError(e.response.data.date));
        } else {
          error('Failed send for approval');
        }
      });
  };
};

export const sendBenefitForApproval = (
  benefits: number[],
  type: 'benefit',
  filters: any,
) => {
  return (dispatch: Dispatch<any>) => {
    dispatch(setLoader(true));
    loading(true, 'Sending benefits for approval');
    bulkBenefitApprovals(benefits)
      .then(() => {
        dispatch(fetchDraftsTabData(type, 1, filters));
      })
      .then(() => {
        destroy();
        dispatch(setLoader(false));
        success('Benefits Sent for approval');
      })
      .catch(e => {
        destroy();
        dispatch(setLoader(false));
        if (e.response.data.has('date')) {
          error(e.response.data.date);

          dispatch(setError(e.response.data.date));
        } else {
          error('Failed send for approval');
        }
      });
  };
};

export const fetchDraftsCount = (fetchNext?: tabs, source?: any) => {
  return (dispatch: Dispatch<any>) => {
    dispatch(setDraftCountLoading(true));
    fetchDraftData(
      'count',
      undefined,
      undefined,
      undefined,
      undefined,
      source?.token,
    )
      .then((response: any) => {
        dispatch(saveDraftCount(response.data));
        dispatch(saveDraftCountForReset(response.data));
      })
      .then(() => {
        dispatch(setDraftCountLoading(false));
        if (fetchNext) {
          dispatch(fetchDraftsTabData(fetchNext, 1));
        }
      })
      .catch(() => {
        dispatch(setDraftCountLoading(false));
      });
  };
};

export const fetchDraftsTabData = (
  tab: tabs,
  page?: number,
  filters?: any,
  pageSize?: number,
  source?: any,
) => {
  return (dispatch: Dispatch<any>, getState: () => stateInterface) => {
    const pageNumber = page || getState()?.drafts[tab]?.current_page;

    dispatch(setLoader(true));
    loading(true, 'Loading');

    fetchDraftData('data', tab, pageNumber, filters, pageSize, source?.token)
      .then((response: any) => {
        const responseData = response.data;
        if (responseData.data.length === 0 && pageNumber !== 1) {
          dispatch(fetchDraftsTabData(tab, (pageNumber || 2) - 1));
          return;
        }
        dispatch(
          saveDraftCount({
            [`${tab}s`]: responseData.pagination_data.total_records,
          }),
        );

        const current_page = pageNumber;
        if (tab === 'expense') {
          dispatch(
            saveExpenses({ ...responseData, current_page: current_page }),
          );
        } else if (tab === 'request') {
          dispatch(
            saveRequests({ ...responseData, current_page: current_page }),
          );
        } else if (tab === 'benefit') {
          dispatch(
            saveBenefits({ ...responseData, current_page: current_page }),
          );
        } else if (tab === 'receipt') {
          dispatch(
            saveReceipt({ ...responseData, current_page: current_page }),
          );
        } else if (tab === 'expenses_with_request') {
          dispatch(
            saveExpensesWithRequest({
              ...responseData,
              current_page: current_page,
            }),
          );
        }
      })
      .then(() => {
        destroy();
        dispatch(setLoader(false));
      })
      .catch(() => {
        destroy();
        dispatch(setLoader(false));
      });
  };
};
