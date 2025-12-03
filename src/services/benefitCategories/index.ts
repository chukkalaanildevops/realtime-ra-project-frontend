import Axios from '../../utils/reimAxios.utils';

export const fetchBenefitCategories = (page: number, pageSize: number) => {
  return Axios.get(`/benefit-category/?page=${page}&page_size=${pageSize}`);
};
export const toggleBenefitTypeAPI = (id: number, is_active: boolean) => {
  return Axios.put(`/benefit-category/${id}/mark-active/`, {
    is_active,
  });
};

export const createBenefitCategoryAPI = (body: any) => {
  return Axios.post(`/benefit-category/`, body);
};

export const updateBenefitCategoryAPI = (id: number, body: any) => {
  return Axios.put(`/benefit-category/${id}/`, body);
};
