import Axios from '../../utils/reimAxios.utils';
import AxiosEcore from '../../utils/ecoreAxios.utils';

export const fetchPolicyConfigDetailsService = (id: string) => {
  // return Axios.get(`/traffic-light-policy-configuration/${id}`);
  let baseURL = Axios.defaults.baseURL?.replace('v1', 'v2');
  return Axios({
    method: 'GET',
    url: `/traffic-light-policy-configurations/${id}`,
    baseURL: baseURL,
  });
};

export const fetchPolicyConfigDetailsServiceForView = (id: string) => {
  // return Axios.get(`/traffic-light-policy-configuration/${id}/`);
  let baseURL = Axios.defaults.baseURL?.replace('v1', 'v2');
  return Axios({
    method: 'GET',
    url: `/traffic-light-policy-configurations/${id}/`,
    baseURL: baseURL,
  });
};

export const fetchTargetGroupService = (
  url: string,
  isGetRequest: boolean,
  body: any,
) => {
  if (isGetRequest) {
    return AxiosEcore.get(url);
  } else {
    return AxiosEcore.post(url, body);
  }
};

export const listEntitiesService = () => {
  return AxiosEcore.get('/v1/legal-entities/?legal_entity_type=1');
};

export const listDevisionsService = () => {
  return AxiosEcore.get('/v1/legal-entities/?legal_entity_type=2');
};

export const listBusinessUnitsService = () => {
  return AxiosEcore.get('/v1/legal-entities/?legal_entity_type=3');
};

export const listDepartmentsService = () => {
  return AxiosEcore.get('/v1/legal-entities/?legal_entity_type=4');
};

export const listAllEmployeeGroups = () => {
  return AxiosEcore.get('/v1/employee-groups/?dropdown=true');
};

export const listAllPayGrades = () => {
  return AxiosEcore.get(
    '/v1/reference-objects/items-by-title/?title=Pay Grade',
  );
};

export const listAllSfEmployeeGroups = () => {
  return AxiosEcore.get(
    '/v1/reference-objects/items-by-title/?title=Employee Group',
  );
};

export const listAllExpanseTypes = () => {
  return Axios.get('/expense-types/choices/?choice=category');
};

export const listAllRequestTypes = (category: any) => {
  return Axios.get(`/request-types/?categories=${category}`);
};

export const listAllTargetTypes = () => {
  return Axios.get('/legal-entity-types/');
};

export const updatePolicyConfigurationService = (id: any, data: any) => {
  // return Axios.put(`/traffic-light-policy-configuration/${id}/`, data);
  const baseURL = Axios.defaults.baseURL?.replace('v1', 'v2');
  return Axios({
    method: 'PUT',
    url: `/traffic-light-policy-configurations/${id}/`,
    baseURL: baseURL,
    data: data,
  });
};

export const listAllExpenseCategoryService = (category: any) => {
  return Axios.get(`/expense-types/?categories=${category}`);
};

export const getUserPermission = (userId: any) => {
  return AxiosEcore.get(
    `/v2/users/${userId}/specific-permissions/?permission_codes=VIEW_SETUP,ACTION_SETUP_TRAFFIC_LIGHT_POLICY_CONFIGURATION`,
  );
};
