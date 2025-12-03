import axios from '../../utils/reimAxios.utils';

export const fetchGlAccountsAPI = (id?: string) => {
  if (id) {
    return axios.get(`/gl-accounts/${id}/`);
  } else {
    return axios.get('/gl-accounts/?dropdown=true');
  }
};

export const fetchGlAccountsByPageAPI = (page = 1, pageSize?: number) => {
  return axios.get(`/gl-accounts/?page=${page}&page_size=${pageSize}`);
};

export const fetchGlAccountChoicesAPI = (choice: string) =>
  axios.get('/gl-accounts/choices/?choice=' + choice);

export const createUpdateGlAccountAPI = (body: any, id?: string) => {
  if (id) {
    return axios.put(`/gl-accounts/${id}/`, body);
  } else {
    return axios.post('/gl-accounts/', body);
  }
};

export const deleteGlAccountAPI = (id: string) =>
  axios.delete(`/gl-accounts/${id}`);

export const uploadRecordsAPI = (file: any) => {
  const formData = new FormData();
  formData.append('file', file);
  return axios.post('/gl-accounts/csv-upload/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const downloadCSVTemplateAPI = () =>
  axios.get(`/gl-accounts/sample_csv_template/`);
