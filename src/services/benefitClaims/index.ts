import { IpostData } from '../../pages/benefits/addNewBenefit.model';
import axios from '../../utils/reimAxios.utils';

////
export const getUserEntitledBenefitList = ({ userId }: any) =>
  axios.get(`/benefit-entitlement/${userId}/fetch-employee-entitlements/`);

////
export const getLoggedInUserInfo = () => axios.get('/users/fetch-using-token/');

////
export const getUserJobInfo = (id: number) =>
  axios.get(`/users/${id}/employee-job-information/`);

////
export const getUserEntitledBenefitConfiguration = (
  entitlementRuleId: any,
  claimDate: string,
) =>
  axios.get(
    `/benefit-entitlement/${entitlementRuleId}/fetch-configuration-entitlement/?claim_date=${claimDate}`,
  );
export const fetchDependentInfoAPI = (
  relationship: any,
  employee_id: any,
  date: any,
) =>
  axios.get(
    `/employee-dependent-infos/retrieve-relationship-info/?effective_on=${date}&relationship=${relationship.toString()}&employee_id=${employee_id}`,
  );

////

const getFormData = (body: IpostData) => {
  try {
    let formData = new FormData();
    for (let [key, value] of Object.entries(body)) {
      if (typeof value === 'object') {
        // if (key === 'receipt') {
        if (key.startsWith('receipt')) {
          formData.append(key, value[0]);
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

export const saveBenefitClaim = (
  isAdminEdit: boolean,
  body: any,
  benefitClaimId: number,
) => {
  let url = benefitClaimId
    ? isAdminEdit
      ? `/benefit-claim/${benefitClaimId}/?isadmin=true`
      : `/benefit-claim/${benefitClaimId}/`
    : `/benefit-claim/`;
  if (benefitClaimId) {
    return axios.put(url, getFormData(body), {
      headers: {
        'content-type': 'multipart/form-data',
      },
    });
  } else {
    return axios.post(url, getFormData(body), {
      headers: {
        'content-type': 'multipart/form-data',
      },
    });
  }
};

export const saveBenefitClaimForApproval = (
  body: any,
  benefitClaimId: number,
) => {
  let url = benefitClaimId
    ? `/benefit-claim/${benefitClaimId}/?is_submit=true`
    : `/benefit-claim/?is_submit=true`;
  if (benefitClaimId) {
    return axios.put(url, getFormData(body), {
      headers: {
        'content-type': 'multipart/form-data',
      },
    });
  } else {
    return axios.post(url, getFormData(body), {
      headers: {
        'content-type': 'multipart/form-data',
      },
    });
  }
};

export const fetchBenefitClaimData = (id: number) => {
  return axios.get(`/benefit-claim/${id}/`);
};

export const getTaxPercentage = (data: any) => {
  return axios.post('/benefit-claim/get-tax-percentage/', data, {
    headers: {
      'content-type': 'application/json',
    },
  });
};

export const deleteBenefitClaim = (id: number) =>
  axios.delete(`/benefit-claim/${id}/`);
