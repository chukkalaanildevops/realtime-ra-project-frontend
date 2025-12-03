import axios from '../../utils/reimAxios.utils';

export const getWageTypeList = (page: number = 1, size?: number) => {
  return axios.get(`/wage-types/?page=${page}&page_size=${size || 10}`);
};

export const getWageTypeListCompatibleForDD = () => {
  return axios.get(`/wage-types/?dropdown=true`);
};

export const getWageTypeUsingId = (id: number) => {
  return axios.get(`/wage-types/${id}/`);
};

export const getWageTypeHistoryUsingId = (id: number) => {
  return axios.get(`/wage-types/${id}/history/`);
};

export const postWageType = (body: any) => {
  return axios.post('/wage-types/', body, {
    headers: { 'content-type': 'application/json' },
  });
};

export const postWageTypeCSVFile = (body: any) => {
  return axios.post('/wage-types/csv-upload/', body, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const updateWageTypeUsingId = (id: number, body: any) => {
  return axios.put(`/wage-types/${id}/`, body, {
    headers: { 'content-type': 'application/json' },
  });
};

export const deleteWageTypeUsingId = (id: number) => {
  return axios.delete(`/wage-types/${id}/`);
};

export const downloadWageTypeCSVTemplateAPI = () =>
  axios.get('/wage-types/sample_csv_template/');
