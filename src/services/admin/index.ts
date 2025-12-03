import Axios from '../../utils/reimAxios.utils';
import { AxiosRequestConfig } from 'axios';
import {
  IAdminDataRequestParameters,
  IAdminItemTypes,
  ICashAdvanceRequestRespondParameters,
  IBenefitEntitlementDetails,
} from '../../pages/admin/admin.models';
import { IApprovalResponseData } from '../../pages/approvals/approvals.model';
import { generateQueryParamsString } from '../../utils/global.utils';

export const getDataForAdminViewService = (
  parameters: IAdminDataRequestParameters,
  cancelToken?: any,
) => {
  let config: AxiosRequestConfig = {
    params: parameters,
    paramsSerializer: params => generateQueryParamsString(params),
    cancelToken,
  };
  return Axios.get('/finance-admin/', config);
};

export const getExpensesForRequestService = (requestId: number) => {
  return Axios.get(
    `/requests/${requestId}/?attached_claims=yes&include_drafts=no`,
  );
};

export const getPaymentModeReferenceItemsService = () => {
  return Axios.get('/reference-objects/items-by-title/?title=Payment Mode');
};

export const respondToCashAdvanceRequestService = (
  requestId: number,
  data: ICashAdvanceRequestRespondParameters,
) => {
  return Axios.post(`cash-advance-requests/${requestId}/respond/`, data);
};

export const rejectItemService = (data: IApprovalResponseData) => {
  return Axios.post('/finance-admin/reject/', data);
};

export const triggerSettlementService = (
  item: IAdminItemTypes,
  ids?: (number | string)[],
  Select_all?: boolean,
) => {
  return Axios.post('/outbound-finances/generate-report/', {
    item: item,
    ...(Boolean(Select_all) ? { select_all: String(Select_all) } : {}),
    ...(!Boolean(Select_all) && Array.isArray(ids) ? { item_ids: ids } : {}),
  });
};

export const getPreviousSettlementsService = (item: string, allLogs?: any) => {
  let url = allLogs
    ? `/outbound-finances/?item=${item}&all_logs=true`
    : `/outbound-finances/?item=${item}`;

  return Axios.get(url);
};

export const downloadSettlementReportService = (recordId: number) => {
  return Axios.get(`/outbound-finances/${recordId}/download/`, {
    responseType: 'blob',
  });
};

export const downloadErrorReportService = (recordId: number) => {
  return Axios.get(
    `/outbound-finances/${recordId}/download/?error_report=true`,
    {
      responseType: 'blob',
    },
  );
};

export const uploadToSFTPService = (recordId: number) => {
  return Axios.post(`/outbound-finance-new/${recordId}/push-to-ftp/`);
};

export const attachExpenseWorkflow = (id: number) =>
  Axios.post(`/expense-claims/${id}/attach-workflow/`);

export const attachBenefitWorkflow = (id: number) =>
  Axios.post(`/benefit-claim/${id}/attach-workflow/`);

export const attachRequestWorkflow = (id: number) =>
  Axios.post(`/requests/${id}/attach-workflow/`);

export const getEmployeeBankDetailsService = (employeeId: number) => {
  return Axios.get(`/users/${employeeId}/employee-bank-detail/`);
};

export const getSettlementStatusService = (
  category: 'EXPNSE' | 'TVLREQ' | 'BENFIT',
) => {
  return Axios.get(
    `/outbound-finance-new/settlement-status/?category=${category}`,
  );
};

export const getBenefitEntitlementData = (id: number) => {
  return Axios.get(`/benefit-entitlement/${id}/get-entitlement-details/`);
};

export const getBenefitEntitlementAdjustmentsData = (
  id: number,
  page?: number,
  pageSize?: number,
) => {
  if (page !== undefined && pageSize !== undefined) {
    return Axios.get(
      `benefit-entitlement/${id}/entitlement-adjustments/?page=${page}&page_size=${pageSize}`,
    );
  } else {
    return Axios.get(`benefit-entitlement/${id}/entitlement-adjustments/`);
  }
};

export const sendBenefitEntitlementData = (
  id: number,
  data: IBenefitEntitlementDetails,
) => {
  return Axios.post(`/benefit-entitlement/${id}/adjust-entitlement/`, data);
};

export const downloadAdjustmentCSV_API = () =>
  Axios.get(`/benefit-entitlement/get-adjustment-csv/`);

export const uploadBenefitEntitlementCSV_API = (file: any) => {
  let formData = new FormData();
  formData.append('file', file);
  return Axios.post('/benefit-entitlement/adjust-entitlement-csv/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
