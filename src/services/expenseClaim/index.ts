import axios from '../../utils/reimAxios.utils';
import {
  IpostData,
  IgetUserEntitledExpenseTypeListprops,
  IgetUserEntitledExpenseTypeListUsingRequestIdprops,
  TchargeToCodesForFetch,
  IgetMileageRateProps,
} from '../../pages/addNewExpense/addNewExpense.model';
import { TStatus } from '../../shared/model';

export const getLoggedInUserInfo = () => axios.get('/users/fetch-using-token/');

export const getUserJobInfoList = () =>
  axios.get(`/employee-job-informations/`);

export const getUserJobInfo = (id: number) =>
  axios.get(`/users/${id}/employee-job-information/`);

export const getUserEntitledExpenseTypeList = ({
  userId,
  category,
}: IgetUserEntitledExpenseTypeListprops) =>
  axios.get(`/users/${userId}/expense-types/?category=${category}`);

// fetch expense types using request id and category
export const getUserEntitledExpenseTypeListUsingRequestId = ({
  requestId,
  category,
}: IgetUserEntitledExpenseTypeListUsingRequestIdprops) =>
  axios.get(
    // `/request-type-legal-entities/${requestId}/expenses/?category=${category}`,
    `/requests/${requestId}/eligible-expense-types/?category=${category}`,
  );

export const postExpenseClaimGeneral = (
  body: IpostData,
  isForAprovals: boolean = false,
) => {
  const url: string = isForAprovals
    ? '/expense-claims/?is_submit=true'
    : '/expense-claims/';

  return axios.post(url, getFormData(body), {
    headers: {
      'content-type': 'multipart/form-data',
    },
  });
};

export const postExpenseClaimAllowance = (
  body: IpostData,
  isForAprovals: boolean = false,
) => {
  const url: string = isForAprovals
    ? '/v2/expense-claims/?is_submit=true'
    : '/v2/expense-claims/';

  return axios.post(url, getFormData(body), {
    headers: {
      'content-type': 'multipart/form-data',
    },
  });
};

export const bulkExpenseApprovals = (bulkPostData: number[]) => {
  const body = {
    expense_claim_ids: bulkPostData,
  };
  return axios.post('/expense-claims/send-for-approval/', body);
};

export const bulkBenefitApprovals = (bulkPostData: number[]) => {
  const body = {
    benefit_claim_ids: bulkPostData,
  };
  return axios.post('/benefit-claim/send-for-approval/', body);
};

export const putExpenseClaimGeneral = (
  id: number,
  body: IpostData,
  isForAprovals: boolean = false,
  isAdminEdit: boolean = false,
) => {
  const url: string = isForAprovals
    ? `/expense-claims/${id}/?is_submit=true`
    : `/expense-claims/${id}/${isAdminEdit ? '?isadmin=true' : ''}`;
  return axios.put(url, getFormData(body), {
    headers: {
      'content-type': 'multipart/form-data',
    },
  });
};

export const putExpenseClaimAllowance = (
  id: number,
  body: IpostData,
  isForAprovals: boolean = false,
  isAdminEdit: boolean = false,
) => {
  const url: string = isForAprovals
    ? `/v2/expense-claims/${id}/?is_submit=true`
    : `/v2/expense-claims/${id}/${isAdminEdit ? '?isadmin=true' : ''}`;
  return axios.put(url, getFormData(body), {
    headers: {
      'content-type': 'multipart/form-data',
    },
  });
};

/**
 * Delete Expense CLaim
 */
export const deleteExpenseClaim = (id: number) =>
  axios.delete(`/expense-claims/${id}/`);

/**
 * Delete Multiple (bulk) Expense Claim
 */
export const deleteMultipleExpenses = (idArr: number[]) =>
  axios.post(`/expense-claims/delete/`, { expense_ids: idArr });

/**
 * Delete Multiple (bulk) Benefit Claim
 */
export const deleteMultipleBenefits = (idArr: number[]) =>
  axios.post(`/benefit-claim/delete/`, { benefit_ids: idArr });

/**
 * Change To
 */
export const getCostCentreChargeTo = () =>
  axios.get('/expense-claims/choices/?choice=charge_to');

/**
 * Cost Center List :- 'INTER' | 'LOCAL' | 'OVERS'
 */
export const getCostCentreList = (
  type: TchargeToCodesForFetch,
  legalEntityUuid?: string,
) =>
  legalEntityUuid
    ? axios.get(
        '/cost-centres/?dropdown=true&is_active=yes&is_chargeable=yes&type=' +
          type +
          '&entity_uuid=' +
          legalEntityUuid,
      )
    : axios.get(
        '/cost-centres/?dropdown=true&is_active=yes&is_chargeable=yes&type=' +
          type,
      );

/**
 * Epense Claim Data `GET`
 */
export const getExpenseClaimData = (id: number) =>
  axios.get(`/expense-claims/${id}/`);

/**
 *  Expense Claims List `GET`
 *  status = 'DRAFTD',
 */
export const getExpenseClaimList = (
  pageNo: number = 1,
  status: TStatus = 'DRAFTD',
) => axios.get(`/expense-claims/?page=${pageNo}&query=${status}`);

export const getExpenseClaimListSubmitted = (
  pageNo: number = 1,
  query: string,
) => axios.get(`/expense-claims/?page=${pageNo}&query=${query}`);

/**
 * Staff Members List
 */
export const getStaffMembersJobInfoList = () =>
  axios.get('/employee-basic-informations/?dropdown=true');
// axios.get(
//   '/employee-job-informations/?for_staff_members=true&dropdown=false',
// );

const getFormData = (body: IpostData) => {
  try {
    let formData = new FormData();
    for (let [key, value] of Object.entries(body)) {
      if (typeof value === 'object') {
        // if (key === 'receipt') {
        if (key.startsWith('receipt')) {
          formData.append(key, value);
        } else if (key.startsWith('supporting_documents')) {
          value.forEach((o: any) => {
            formData.append(key, o);
          });
        } else {
          formData.append(key, JSON.stringify(value));
        }
      } else {
        formData.append(key, value);
      }
    }

    return formData;
  } catch (error) {
    console.warn('DEV ERROR: ', error);
  }
};

export const withdrawExpenseClaim = (id: number, remark: string) =>
  axios.post(`/expense-claims/${id}/withdraw/`, { remark });

export const withdrawBenefitClaim = (id: number, remark: string) =>
  axios.post(`/benefit-claim/${id}/withdraw/`, { remark });

export const validateTripDetails = (body: any) => {
  return axios.post(
    '/expense-claims/validate-mileage-records/',
    getFormData(body),
    {
      headers: {
        'content-type': 'multipart/form-data',
      },
    },
  );
};

export const validateAllowanceDetails = (body: any) => {
  return axios.post(
    '/expense-claims/validate-allowance-records/',
    getFormData(body),
    {
      headers: {
        'content-type': 'multipart/form-data',
      },
    },
  );
};

export const updateTripDetails = (
  body: any,
  claimId: number,
  tripId: number,
) => {
  return axios.put(
    '/expense-claims/' + claimId + '/update-trip-details/',
    getFormData({ ...body, id: tripId }),
    {
      headers: {
        'content-type': 'multipart/form-data',
      },
    },
  );
};

export const updateAllowanceDetails = (
  body: any,
  claimId: number,
  tripId: number,
) => {
  return axios.put(
    '/expense-claims/' + claimId + '/update-allowance-details/',
    getFormData({ ...body, id: tripId }),
    {
      headers: {
        'content-type': 'multipart/form-data',
      },
    },
  );
};

/**
 * Mileage Rate `GET`
 */
export const getMileageRate = (data: IgetMileageRateProps) => {
  return axios.post('/expense-claims/get-mileage-amount/', data, {
    headers: {
      'content-type': 'application/json',
    },
  });
};

export const fetchPettyCashManagerTransactionMetaAPI = (id?: number) => {
  let url = id
    ? `petty-cash-managers/transaction/?empid=${id}`
    : `petty-cash-managers/transaction/`;
  return axios.get(url);
};

export const getAllowanceRate = (data: any) => {
  return axios.post('/expense-claims/get-allowance-rate/', data, {
    headers: {
      'content-type': 'application/json',
    },
  });
};

export const getTaxPercentage = (data: any) => {
  return axios.post('/expense-claims/get-tax-percentage/', data, {
    headers: {
      'content-type': 'application/json',
    },
  });
};

export const fetchLocations = () =>
  axios.get('/reference-objects/items-by-title/?title=Allowance Destination');

export const fetchFilteredLocations = (body: any) => {
  return axios.post('/expense-claims/get-filtered-destinations/', body, {
    headers: {
      'content-type': 'application/json',
    },
  });
};

export const createAllowanceRecords = (body: any) => {
  return axios.post('/allowance-records/', getFormData(body), {
    headers: {
      'content-type': 'multipart/form-data',
    },
  });
};

export const updateAllowanceRecords = (body: any, id: number) => {
  return axios.put(`/allowance-records/${id}/`, getFormData(body), {
    headers: {
      'content-type': 'multipart/form-data',
    },
  });
};

export const allowanceRecordsListing = (
  uuid: any,
  page?: number,
  pageSize?: number,
) =>
  axios.get(
    `/allowance-records/?pre-save-uuid=${uuid}&page=${page}&page_size=${pageSize}`,
  );

export const allowanceRecordsListingUpdate = (
  id: number,
  page?: number,
  pageSize?: number,
) => {
  if (page !== undefined && pageSize !== undefined) {
    return axios.get(
      `/allowance-records/?expense-claim=${id}&page=${page}&page_size=${pageSize}`,
    );
  } else {
    return axios.get(`/allowance-records/?expense-claim=${id}`);
  }
};

export const deleteAllowanceRecords = (id: number) =>
  axios.delete(`/allowance-records/${id}/`);

export const editCloneAllowanceTrip = (id: number) =>
  axios.get(`/allowance-records/${id}/`);

export const allowanceTotalAmountCountAddMode = (uuid: any) =>
  axios.get(`/allowance-records/amount/?pre-save-uuid=${uuid}`);

export const allowanceTotalAmountCountUpdateMode = (id: any) =>
  axios.get(`/allowance-records/amount/?expense-claim=${id}`);

export const getExpenseClaimViolationData = (id: number) => {
  let baseURL = axios.defaults.baseURL?.replace('v1', 'v2');
  return axios({
    method: 'GET',
    url: `/traffic-light-policy-violations/${id}/`,
    baseURL: baseURL,
  });
};
export const getExpenseClaimViolationChecker = (body: any) => {
  return axios.post(
    '/traffic-light-pre-save-policy-violations/list-violations/',
    getFormData(body),
    {
      headers: {
        'content-type': 'multipart/form-data',
      },
    },
  );
};
