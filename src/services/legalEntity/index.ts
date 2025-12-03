import axios from '../../utils/reimAxios.utils';

export const fetchLegalEntitiesAPI = (id: string) =>
  axios.get(`/legal-entities/?legal_entity_type=${id}`);

export const fetchLegalEntityTypesAPI = () => axios.get('/legal-entity-types/');

export const updateLegalEntityAPI = (body: any, id: string) =>
  axios.put(`/legal-entities/${id}/`, body);

export const fetchFinancialYearsAPI = () =>
  axios.get('/legal-entities/financial-cycles/');

export const getDirectChildAPI = (id: string) =>
  axios.get(`/legal-entities/${id}/get-direct-children`);
