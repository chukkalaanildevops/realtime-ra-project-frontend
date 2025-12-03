import axios from '../../utils/reimAxios.utils';
import { COST_CENTRE_TYPES } from '../../pages/requestTypeConfiguration/requestTypeConfiguration.model';

export const fetchLegalEntityTypes = () => {
  return axios.get('/legal-entity-types/');
};

export const fetchLegalEntities = (is_top_level = true) => {
  let url = '/legal-entities/';
  if (is_top_level) {
    url = `${url}?top_level=true`;
  }
  return axios.get(url);
};

export const labelMapping = () => {
  return axios.get('/request-types/label-mapping/');
};

export const wageTypeAPI = () => {
  return axios.get('/wage-types/?dropdown=true');
};

export const costCenterListAPI = () => {
  return axios.get('/cost-centres/');
};

export const fetchRequestTypesAPI = () => {
  return axios.get('/request-types/?compact=True');
};

export const createRequestTypesAPI = (body: any) => {
  return axios.post('/request-types/', body);
};

export const fetchRequestTypeConfigByIdAPI = (
  id: string,
  withLegalEntity: boolean = false,
) => {
  return axios.get(
    `/request-type-configurations/${id}/?with_legal_entity=${withLegalEntity}`,
  );
};

export const deleteRequestTypeAPI = (id: string) => {
  return axios.delete(`/request-types/${id}/`);
};

export const updateRequestTypeAPI = (id: string, body: any) => {
  return axios.put(`/request-types/${id}/`, body);
};

export const addCustomRequestTypeConfigAPI = (id: string, body: any) => {
  return axios.put(`/request-types/${id}/`, body);
};

export const updateConfigDetailsAPI = (id: string, body: any) =>
  axios.put(`/request-type-configurations/${id}/`, body);

export const fetchRequestTypeLegalEntitiesAPI = (id: string) =>
  axios.get(`/request-types/${id}/legal-entities/`);

export const attachRequestTypeLegalEntitiesAPI = (
  id: string,
  legal_entities: string[],
) =>
  axios.post(`/request-types/${id}/add-legal-entity/`, {
    legal_entity: legal_entities,
  });

export const fetchRequestTypeByIdAPI = (id: string) => {
  return axios.get(`/request-types/${id}/`);
};

export const deleteLegalEntityAPI = (id: string) =>
  axios.delete(`/request-type-legal-entities/${id}/`);

export const revertGlobalConfigAPI = (id: string) =>
  axios.put(`/request-type-legal-entities/${id}/revert-to-global/`);

export const toggleRequestTypeAPI = (id: string, isActive: boolean) => {
  return axios.put(`/request-types/${id}/mark-active/`, {
    is_active: isActive,
  });
};

export const fetchExpensesAPI = (body: any) =>
  axios.post('/expense-types/filter/', body);

export const fetchRequestLegalEntityAPI = (is_travel_type: boolean) => {
  let url = `/request-type-legal-entities/?is_travel_type=${
    is_travel_type ? 1 : 0
  }`;
  return axios.get(url);
};

export const fetchRequestsAPI = () => axios.get('/requests/');

export const createRequestsAPI = (body: any, isSubmit?: boolean) => {
  let url = '/requests/?is_submit=' + isSubmit;
  return axios.post(url, body, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const updateRequestsAPI = (
  body: any,
  id: string,
  isSubmit?: boolean,
  isadmin?: boolean,
) => {
  let url = `/requests/${id}/?is_submit=${isSubmit}`;
  if (isadmin) {
    url += `&isadmin=${isadmin}`;
  }
  return axios.put(url, body, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const fetchRequestAPI = (page = 1, query = '') =>
  axios.get(`/requests/?page=${page}&query=${query}`);

export const fetchRequestDetailsByIdAPI = (id: string) =>
  axios.get(`/requests/${id}/`);

export const deleteRequestsByIdAPI = (id: string) =>
  axios.delete(`/requests/${id}/`);

export const fetchStaffMembersAPI = () =>
  axios.get('/employee-basic-informations/?dropdown=true');

export const fetchExpenseTypesAgainstRequestAPI = (
  requestId: string,
  empId?: number,
) => {
  let url = `/request-type-legal-entities/${requestId}/expenses/`;
  if (empId) {
    url += `?emp_id=${empId}`;
  }
  return axios.get(url);
};

export const fetchRequestDetailsWithExpensesByIdAPI = (requestId: string) =>
  axios.get(`/requests/${requestId}/?attached_claims=yes`);

export const approveRequests = (request_ids: number[]) =>
  axios.post('/requests/send-for-approval/', {
    request_ids,
  });

export const deleteRequestsAPI = (request_ids: number[]) =>
  axios.delete(`/requests/delete-requests/`, {
    data: { request_ids },
  });

export const withdrawRequestAPI = (id: number, remark: string) =>
  axios.post(`/requests/${id}/withdraw/`, { remark });

export const fetchCostCentreAPI = (type: COST_CENTRE_TYPES) =>
  axios.get(
    `/cost-centres/?dropdown=true&is_active=yes&is_chargeable=yes&type=${type}`,
  );

export const updateRequestTypeTitleCodeAPI = (id: number, body: any) =>
  axios.patch(`/request-types/${id}/update-title-and-code/`, body);
