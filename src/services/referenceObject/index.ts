import axios from '../../utils/reimAxios.utils';

export const fetchObjectReferenceList = (page: number = 1, size?: number) => {
  return axios.get(`reference-objects/?page=${page}&page_size=${size}`);
};

export const createObjectReference = (body: any) => {
  return axios.post('reference-objects/', body, {
    headers: { 'content-type': 'application/json' },
  });
};

export const postRefObjectCSVFile = (body: any) => {
  return axios.post('/reference-objects/upload_reference_object/', body, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const getReferenceObjectUsingId = (id: number) => {
  return axios.get(`reference-objects/${id}/`);
};

export const updateReferenceObjectUsingId = (id: number, body: any) => {
  return axios.put(`reference-objects/${id}/`, body, {
    headers: { 'content-type': 'application/json' },
  });
};

export const deleteReferenceObjectUsingId = (id: number) => {
  return axios.delete(`reference-objects/${id}`);
};

export const getReferenceObjectItem = (id: number) => {
  return axios.post(`reference-objects/${id}/items/`);
};

export const addingReferenceObjectItem = (id: number, body: any) => {
  return axios.post(`reference-objects/${id}/add-items/`, body, {
    headers: { 'content-type': 'application/json' },
  });
};

export const removingReferenceObjectItem = (id: number, body: any) => {
  return axios.post(`reference-objects/${id}/remove-items/`, body, {
    headers: { 'content-type': 'application/json' },
  });
};

export const fetchObjectReferenceDropdownList = () => {
  return axios.get(`reference-objects/?dropdown=true`);
};
