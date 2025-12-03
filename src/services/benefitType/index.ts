import axios from '../../utils/reimAxios.utils';

export const fetchLegalEntityTypes = () => {
  return axios.get('/legal-entity-types/');
};
export const fetchEntityCostCenterListAPI = (data: any) => {
  return axios.post('/cost-centres/entity-cost-centres/', data, {
    headers: { 'Content-Type': 'application/json' },
  });
};
export const fetchLegalEntities = () => {
  return axios.get('/legal-entities/?top_level=true');
};

export const fetchFlexibleCategory = (page: number, pageSize: number) => {
  return axios.get(`/benefit-category/?page=${page}&page_size=${pageSize}`);
};
export const fetchDependentRelationsAPI = () => {
  return axios.get(`/employee-dependent-infos/retrieve-all-relationship/`);
};
export const labelMapping = () => {
  return axios.get('/benefit-types/label-mapping/');
};

export const wageTypeAPI = () => {
  return axios.get('/wage-types/?dropdown=true');
};

export const fetchBenefitTypesAPI = () => {
  return axios.get('/benefit-types/?dropdown=true');
};

export const createBenefitTypesAPI = (body: any) => {
  return axios.post('/benefit-types/', body, {
    headers: { 'Content-Type': 'application/json' },
  });
};

export const fetchBenefitTypeByIdAPI = (id: string) => {
  return axios.get(`/benefit-types/${id}/`);
};

export const deleteBenefitTypeAPI = (id: string) => {
  return axios.delete(`/benefit-types/${id}/`);
};

export const updateBenefitTypeAPI = (id: string, body: any) => {
  return axios.put(`/benefit-types/${id}/`, body);
};

export const fetchBenefitChoicesAPI = (choice: string) => {
  return axios.get('/benefit-types/choices/?choice=' + choice);
};

export const deleteLegalEntityAPI = (id: string) =>
  axios.delete(`/benefit-type-legal-entities/${id}/`);

export const revertGlobalConfigAPI = (id: string) =>
  axios.put(`/benefit-type-legal-entities/${id}/revert-to-global/`);

export const toggleBenefitTypeAPI = (id: string, isActive: boolean) => {
  return axios.put(`/benefit-types/${id}/mark-active/`, {
    is_active: isActive,
  });
};

export const attachBenefitTypeLegalEntitiesAPI = (
  id: string,
  legal_entities: string[],
) =>
  axios.post(`/benefit-types/${id}/add-legal-entity/`, {
    legal_entity: legal_entities,
  });

export const addCustomBenefitTypeConfigAPI = (id: string, body: any) => {
  return axios.put(`/benefit-types/${id}/`, body);
};

export const updateConfigDetailsAPI = (id: string, body: any) =>
  axios.put(`/benefit-type-configurations/${id}/`, body);

export const fetchBenefitTypeLegalEntitiesAPI = (id: string) =>
  axios.get(`/benefit-types/${id}/legal-entities/`);

export const fetchBenefitTypeConfigByIdAPI = (id: string) =>
  axios.get(`/benefit-type-configurations/${id}/?with_legal_entity=true`);

export const patchTitleAndCode = (id: number, payload: any) =>
  axios.patch(
    `/benefit-types/${id}/update-benefit-type-title-and-code/`,
    payload,
    {
      headers: { 'content-type': 'application/json' },
    },
  );
