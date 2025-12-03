import { Dispatch } from 'react';
import { message } from 'antd';
import { AxiosResponse, AxiosError } from 'axios';
import {
  setActiveTabKey,
  updateDataItemsCount,
  updateDataItemsCountForReset,
  setDataItemsCountLoading,
  updateDataGroupItems,
  setLoader,
  setExpensesForRequest,
  setBenefitEntitlementData,
  setBenefitEntitlementAdjustmentData,
  setError,
  setSuccess,
  setLoadingMessage,
  setIsOTP,
} from './admin.actions';
import {
  getDataForAdminViewService,
  getExpensesForRequestService,
  rejectItemService,
  respondToCashAdvanceRequestService,
  attachBenefitWorkflow,
  attachRequestWorkflow,
  attachExpenseWorkflow,
  getBenefitEntitlementData,
  getBenefitEntitlementAdjustmentsData,
  downloadAdjustmentCSV_API,
  uploadBenefitEntitlementCSV_API,
} from '../../services/admin';
import { fetchOutboundScheduleAPI } from '../../services/outbound';
import {
  IAdminDataRequestParameters,
  ICashAdvanceRequestRespondParameters,
} from './admin.models';
import { IApprovalResponseData } from '../approvals/approvals.model';
import { getQueryParametersAsObject } from '../../utils/global.utils';
import { stateInterface } from '../../shared/redux/rootReducer';

const FileDownload = require('js-file-download');

export const fetchDataItemsCount = (
  parameters?: IAdminDataRequestParameters,
  activeTab?: string,
  source?: any,
) => {
  return async (dispatch: Dispatch<any>, getState: () => stateInterface) => {
    try {
      dispatch(setDataItemsCountLoading(true));

      const response: AxiosResponse = await getDataForAdminViewService(
        {
          function: 'count',
          ...parameters,
        },
        // source.token,
      );
      let data = response.data;
      const { itemsCount } = getState().admin;
      const expenseCount =
        activeTab && activeTab === 'expenses'
          ? itemsCount.expenses
          : data.expenses;
      const requestCount =
        activeTab && activeTab === 'requests'
          ? itemsCount.requests
          : data.requests;
      const expensesWithRequestsCount =
        activeTab && activeTab === 'expenses-with-requests'
          ? itemsCount.expensesWithRequests
          : data.expenses_with_requests;
      const cashAdvanceRequestsCount =
        activeTab && activeTab === 'cash-advance-requests'
          ? itemsCount.cashAdvanceRequests
          : data.cash_advance_requests;
      const benefitsCount =
        activeTab && activeTab === 'benefits'
          ? itemsCount.benefits
          : data.benefits;
      const expenseSettlementsCount =
        activeTab && activeTab === 'expense-settlement'
          ? itemsCount.expenseSettlements
          : data.approved_expenses;
      const requestClosuresCount =
        activeTab && activeTab === 'request-posting'
          ? itemsCount.requestClosures
          : data.approved_requests;
      const benefitSettlementCount =
        activeTab && activeTab === 'benefit-settlement'
          ? itemsCount.benefitSettlements
          : data.approved_benifits;
      const benefitEntitlementCount =
        activeTab && activeTab === 'benefit-entitlement'
          ? itemsCount.benefitEntitlement
          : data.benefit_entitlement;
      const expenseEntitlementCount =
        activeTab && activeTab === 'expense-entitlement'
          ? itemsCount.expenseEntitlement
          : data.expense_entitlement;
      dispatch(
        updateDataItemsCount(
          expenseCount,
          requestCount,
          expensesWithRequestsCount,
          cashAdvanceRequestsCount,
          benefitsCount,
          expenseSettlementsCount,
          requestClosuresCount,
          benefitSettlementCount,
          benefitEntitlementCount,
          expenseEntitlementCount,
        ),
      );
      activeTab &&
        dispatch(
          updateDataItemsCountForReset(
            data.expenses,
            data.requests,
            data.expenses_with_requests,
            data.cash_advance_requests,
            data.benefits,
            data.approved_expenses,
            data.approved_requests,
            data.approved_benifits,
            data.benefit_entitlement,
            data.expense_entitlement,
          ),
        );
      dispatch(setDataItemsCountLoading(false));
    } catch (error) {
      dispatch(updateDataItemsCount(0, 0, 0, 0, 0, 0, 0, 0, 0, 0));
      dispatch(setDataItemsCountLoading(false));
    }
  };
};

export const setActiveTab = (key: string) => {
  return async (dispatch: Dispatch<any>) => {
    dispatch(setActiveTabKey(key));
  };
};

export const fetchDataGroupItems = (
  parameters: IAdminDataRequestParameters,
  source?: any,
) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(setLoader(true));
      const response: AxiosResponse = await getDataForAdminViewService(
        parameters,
        // source.token,
      );

      let dataGroupItems = response.data.data;
      let paginationData = response.data.pagination_data;

      dispatch(updateDataGroupItems(dataGroupItems, paginationData));
    } catch (error) {
      message.error(error.response.data.error);
    }
  };
};

export const rejectItem = (
  postData: IApprovalResponseData,
  dataPageParameters?: IAdminDataRequestParameters,
) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      await rejectItemService(postData);
      message.success('Response saved.');
      if (dataPageParameters !== undefined) {
        dispatch(fetchDataGroupItems(dataPageParameters));
      }
    } catch (error) {
      message.error(error.response.data.error);
    }
  };
};

export const fetchExpensesForRequest = (requestId: number) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(setLoader(true));

      const response: AxiosResponse = await getExpensesForRequestService(
        requestId,
      );
      let request = response.data;
      let expensesForRequest = request.claims.filter(
        (item: any) => item.workflow_status.code !== 'DRAFTD',
      );
      delete request.claims;

      dispatch(setExpensesForRequest(request, expensesForRequest));
    } catch (error) {
      message.error(error.response.data.error);
    }
  };
};

export const respondToCashAdvanceRequest = (
  requestId: number,
  data: ICashAdvanceRequestRespondParameters,
  requestParameters: IAdminDataRequestParameters,
) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      let response: AxiosResponse = await respondToCashAdvanceRequestService(
        requestId,
        data,
      );
      if (response.status === 200) {
        dispatch(fetchDataGroupItems(requestParameters));
        message.success('Response saved.');
      }
    } catch (error) {
      if (error?.response?.data?.details) {
        message.error(error?.response?.data?.details[0]);
      }
      //message.error(error.response.data.error);
    }
  };
};

export const attachExpenseWorkflowFN = (id: number) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(setLoader(true));
      await attachExpenseWorkflow(id);
      message.success('Workflow Attached');
      dispatch(setLoader(false));
      const urlQueryParameters = getQueryParametersAsObject();
      dispatch(
        fetchDataGroupItems({
          function: 'data',
          item: 'expense',
          ...urlQueryParameters,
        }),
      );
    } catch (e) {
      message.success('Failed To Attached Workflow');
      dispatch(setLoader(false));
    }
  };
};

export const attachBenefitWorkflowFN = (id: number) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(setLoader(true));
      await attachBenefitWorkflow(id);
      message.success('Workflow Attached');
      dispatch(setLoader(false));
      const urlQueryParameters = getQueryParametersAsObject();
      dispatch(
        fetchDataGroupItems({
          function: 'data',
          item: 'benefit',
          ...urlQueryParameters,
        }),
      );
    } catch (e) {
      message.success('Failed To Attached Workflow');
      dispatch(setLoader(false));
    }
  };
};

export const attachRequestWorkflowFN = (id: number) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(setLoader(true));
      await attachRequestWorkflow(id);
      message.success('Workflow Attached');
      dispatch(setLoader(false));
      const urlQueryParameters = getQueryParametersAsObject();
      dispatch(
        fetchDataGroupItems({
          function: 'data',
          item: 'request',
          ...urlQueryParameters,
        }),
      );
    } catch (e) {
      message.success('Failed To Attached Workflow');
      dispatch(setLoader(false));
    }
  };
};

export const getBenefitEntitlementDetails = (id: number) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      const response: AxiosResponse = await getBenefitEntitlementData(id);
      const benefitEntitlementData = response.data;
      dispatch(setBenefitEntitlementData(benefitEntitlementData));
    } catch (error) {
      message.error(error.response.data.error);
    }
  };
};

export const getBenefitEntitlementAdjustments = (
  id: number,
  page?: number,
  pageSize?: number,
) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      const response: AxiosResponse = await getBenefitEntitlementAdjustmentsData(
        id,
        page,
        pageSize,
      );
      const benefitEntitlementAdjustmentData = response.data;
      dispatch(
        setBenefitEntitlementAdjustmentData(benefitEntitlementAdjustmentData),
      );
    } catch (error) {
      message.error(error.response.data.error);
    }
  };
};

export const downloadAdjustmentCSV = () => {
  return async (dispatch: Dispatch<any>) => {
    const response = await downloadAdjustmentCSV_API();
    FileDownload(response.data, 'benefit_entitlement_adjustment.csv');
  };
};

export const uploadBenefitEntitlementCSV = (file: any) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(setLoader(true));
      dispatch(setLoadingMessage('Uploading file'));
      await uploadBenefitEntitlementCSV_API(file);
      dispatch(setSuccess('File uploaded successfully'));
      dispatch(setLoader(false));
      dispatch(setLoadingMessage(''));
      // dispatch(fetchAllowanceList(1));
    } catch (e) {
      dispatch(setLoader(false));
      dispatch(setLoadingMessage(''));
      const errorResponse = (e as AxiosError).response?.data;
      if (errorResponse) {
        if (errorResponse.errors && typeof errorResponse.errors === 'object') {
          const errorMsg = errorResponse.errors;
          dispatch(setError(errorMsg));
        } else {
          dispatch(setError(errorResponse.errors || errorResponse.error));
        }
      } else {
        dispatch(setError('Failed to upload records'));
      }
    }
  };
};

export const setIsOneTimePayment = () => {
  return async (dispatch: Dispatch<any>) => {
    try {
      const response = await fetchOutboundScheduleAPI();
      const isOTPPresent = response.data.filter(
        (item: any) =>
          item?.category?.code === 'EOTP' || item?.category?.code === 'BOTP',
      );
      if (isOTPPresent.length !== 0) {
        dispatch(setIsOTP(true));
      }
    } catch (error) {
      message.error(error.response.data.error);
    }
  };
};
