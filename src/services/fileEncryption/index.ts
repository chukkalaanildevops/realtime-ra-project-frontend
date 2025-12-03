import axios from '../../utils/reimAxios.utils';

export const getEncryptionListAPI = (tab: any) => {
  return axios.get(`/file-encryption/?file_type=${tab}`);
};
export const fetchLegalEntities = () => {
  return axios.get('/legal-entities/?top_level=true');
};
export const getEncryptionDataAPI = (id: any) => {
  return axios.get(`/file-encryption/${id}/`);
};

export const createEncryptionListAPI = (body: any) => {
  return axios.post(`/file-encryption/`, body);
};

export const updateEncryptionListAPI = (id: any, body: any) => {
  return axios.put(`/file-encryption/${id}/`, body);
};

export const deleteEncryptionListAPI = (id: any) => {
  return axios.delete(`/file-encryption/${id}/`);
};

export const generateKeyAPI = () => {
  return axios.post(`/inbound-file-encryption/`);
};

export const getInboundEncryptionListAPI = () => {
  return axios.get(`/inbound-file-encryption/`);
};
