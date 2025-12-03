import axios from '../../utils/reimAxios.utils';

export const fetchProfileDataAPI = (userId: number) =>
  axios.get(`/users/${userId}/profile/`);

export const fetchRolesDropdownAPI = () => axios.get(`/roles/?dropdown=true`);

export const updateUserRolesAPI = ({
  userId,
  data,
}: {
  userId: number;
  data: { roles: number[] };
}) => axios.put(`/users/${userId}/roles/`, data);

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
