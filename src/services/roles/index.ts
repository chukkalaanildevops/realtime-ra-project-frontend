import { AxiosRequestConfig } from 'axios';
import Axios from '../../utils/reimAxios.utils';

export const fetchRolesService = () => {
  return Axios.get('/roles/');
};

export const fetchRoleDetailsService = (roleId: number) => {
  return Axios.get(`/roles/${roleId}/`);
};

export const addRoleService = (data: { [key: string]: any }) => {
  return Axios.post('/roles/', data);
};

export const updateRoleService = (
  roleId: number,
  data: { [key: string]: any },
) => {
  return Axios.put(`/roles/${roleId}/`, data);
};

export const deleteRoleService = (roleId: number) => {
  return Axios.delete(`/roles/${roleId}`);
};

export const fetchEmployeeGroupsService = () => {
  return Axios.get('/employee-groups/?compact=True');
};

export const fetchPermissionsService = () => {
  return Axios.get('/permissions/');
};

export const fetchRoleAssignmentsService = (
  roleId: number,
  page: number,
  pageSize: number,
) => {
  let config: AxiosRequestConfig = {
    params: {
      page: page,
      page_size: pageSize,
    },
  };
  return Axios.get(`roles/${roleId}/assignments/`, config);
};

export const addNewRoleAssignmentsService = (
  roleId: number,
  employees: number[],
) => {
  return Axios.post(`roles/${roleId}/assignments/`, {
    employees: employees,
  });
};

export const deleteRoleAssignmentsService = (
  roleId: number,
  employees: number[],
) => {
  let config: AxiosRequestConfig = {
    data: {
      employees: employees,
    },
  };
  return Axios.delete(`roles/${roleId}/assignments/`, config);
};
