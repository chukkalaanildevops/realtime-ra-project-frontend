import axios from '../../utils/reimAxios.utils';

export const fetchScheduleAPI = () => axios.get('/scheduler-jobs/');

export const fetchLegalEntityTypesAPI = () => axios.get('/legal-entity-types/');

export const fetchFileToModelMappingAPI = () =>
  axios.get('/file-to-model-mappings/');

export const updateLegalEntityTypesAPI = (body: any, id: string) =>
  axios.put(`/legal-entity-types/${id}/`, body);

export const updateFileModelAPI = (body: any, id: string) =>
  axios.put(`/file-to-model-mappings/${id}/`, body);

export const createUpdateScheduleAPI = (body: any, id?: string) => {
  if (id) {
    return axios.put(`/scheduler-jobs/${id}/`, body);
  } else {
    return axios.post('/scheduler-jobs/', body);
  }
};

export const fetchIntegrationJobsAPI = (page = 1, pageSize: number = 10) =>
  axios.get(`/sf-integration-jobs/?page=${page}&page_size=${pageSize}`);

export const executeJobManuallyAPI = () =>
  axios.post('/scheduler-jobs/execute-sf-integration/');

export const fetchStagesByJobIdAPI = (id: string) =>
  axios.get(`/sf-integration-jobs/${id}/`);

export const fetchFileToModelMappingByIdAPI = (id: string) =>
  axios.get(`/file-to-model-mappings/${id}/`);

export const fetchLogsByJobIdFileCodeAPI = (id: string, modelCode: string) =>
  axios.get(
    `/sf-integration-jobs/view-data?job_id=${id}&model_code=${modelCode}`,
  );

export const getLogListAPI = (page: any, q?: any) =>
  axios.get(`/sf-users/`, { params: { page, q } });

export const getLogListDetailAPI = (userId: any, type: any) =>
  axios.get(`/sf-users/${userId}/?item=${type}`);

export const fetchRowSuccessLogs = (
  id: string,
  file: string,
  fileName: string,
  page: number,
) =>
  axios.get(
    `/sf-integration-jobs/${id}/rows/?file=${file}&file_name=${fileName}&success=true&page=${page}`,
  );

export const fetchRowFailureLogs = (
  id: string,
  file: string,
  fileName: string,
  page: number,
) =>
  axios.get(
    `/sf-integration-jobs/${id}/rows/?file=${file}&file_name=${fileName}&page=${page}`,
  );

export const executeFileAPI = (code: string) =>
  axios.post(`/scheduler-jobs/execute-sf-integration/?file=${code}`);

export const getDownloadAPI = (id: string) =>
  axios.get(`/sf-users/${id}/download-sf-user-details/`, {
    responseType: 'blob',
    headers: {
      'content-type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    },
  });

export const deleteEmployeeBasicInfoAPI = (id: number) =>
  axios.delete(`/employee-basic-informations/${id}/`);

export const deleteEmployeeJobInfoAPI = (id: number) =>
  axios.delete(`/employee-job-informations/${id}/`);

export const deleteEmployeeApproversAPI = (id: number) =>
  axios.delete(`/employee-approvers/${id}/`);

export const deleteEmployeeBankDetailsAPI = (id: number) =>
  axios.delete(`/employee-bank-details/${id}/`);

export const fetchEmployeeApproversDataAPI = (
  page: number,
  pageSize?: number,
  employeeId?: number,
  effective_from__lte?: any,
  sort?: any,
) => {
  const baseURL = axios.defaults.baseURL?.replace('v1', 'v3');
  return axios({
    method: 'GET',
    url: `/employee-approvers/?page=${page}&page_size=${pageSize}&employee=${employeeId}&effective_from__lte=${effective_from__lte}&sort=${sort}`,
    baseURL: baseURL,
  });
};
export const fetchApproversCustomFieldsListAPI = (
  page: number,
  pageSize?: number,
) => {
  return axios.get(
    `/employee-approver-custom-fields/?page=${page}&page_size=${pageSize}`,
  );
};

export const fetchEmployeeDependentInfoDataAPI = (
  page: number,
  pageSize?: number,
  employeeId?: number,
  effective_from__lte?: any,
  sort?: any,
) => {
  const baseURL = axios.defaults.baseURL?.replace('v1', 'v3');
  return axios({
    method: 'GET',
    url: `/employee-dependent-info/?page=${page}&page_size=${pageSize}&employee=${employeeId}&effective_from__lte=${effective_from__lte}&sort=${sort}`,
    baseURL: baseURL,
  });
};
export const fetchDependentInfoCFListAPI = (
  page: number,
  pageSize?: number,
) => {
  return axios.get(
    `/employee-dependent-info-custom-fields/?page=${page}&page_size=${pageSize}`,
  );
};

export const deleteEmployeeDependentInfoAPI = (id: number) => {
  const baseURL = axios.defaults.baseURL?.replace('v1', 'v3');
  return axios({
    method: 'DELETE',
    url: `/employee-dependent-info/${id}/`,
    baseURL: baseURL,
  });
};
