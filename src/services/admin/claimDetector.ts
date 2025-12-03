import axios from '../../utils/reimAxios.utils';

export const createUpdateClaimDetectorAPI = (body: any, id?: string) => {
  return id
    ? axios.put(`duplication-detections/${id}/`, body)
    : axios.post('duplication-detections/', body);
};

export const fetchClaimDetectorAPI = (id = '') => {
  return axios.get(`duplication-detections/${id}`);
};
