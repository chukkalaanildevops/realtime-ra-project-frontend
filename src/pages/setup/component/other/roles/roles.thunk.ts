import { message } from 'antd';
import { AxiosResponse } from 'axios';
import { Dispatch } from 'react';
import {
  fetchRolesService,
  fetchRoleDetailsService,
  addRoleService,
  updateRoleService,
  deleteRoleService,
} from '../../../../../services/roles';
import {
  updateRoles,
  setLoader,
  setServiceCallFailed,
  setRoleDetails,
  setFormSubmissionInProgress,
  setFormSubmissionSuccessful,
  setFormErrors,
} from './roles.action';

export const setPageLoader = (isLoading: boolean) => {
  return async (dispatch: Dispatch<any>) => {
    dispatch(setLoader(isLoading));
  };
};

export const fetchRoles = () => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(setLoader(true));
      const response: AxiosResponse = await fetchRolesService();
      dispatch(updateRoles(response.data));
      dispatch(setLoader(false));
    } catch (error) {
      dispatch(setLoader(false));
      dispatch(setServiceCallFailed(true, error.response.data.error));
    }
  };
};

export const fetchRoleDetails = (roleId: number) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(setLoader(true));
      const response: AxiosResponse = await fetchRoleDetailsService(roleId);
      dispatch(setRoleDetails(response.data));
    } catch (error) {
      dispatch(setServiceCallFailed(true, error.response.data.error));
    }
  };
};

export const addRole = (data: { [key: string]: any }) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(setFormSubmissionInProgress(true));
      await addRoleService(data);
      dispatch(setFormSubmissionInProgress(false));
      dispatch(setFormSubmissionSuccessful(true));
      message.success('A new role has been added.');
    } catch (error) {
      dispatch(setFormSubmissionInProgress(false));
      dispatch(setFormSubmissionSuccessful(true));
      dispatch(setFormErrors(error.response.data));
    }
  };
};

export const updateRole = (roleId: number, data: { [key: string]: any }) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(setFormSubmissionInProgress(true));
      await updateRoleService(roleId, data);
      dispatch(setFormSubmissionInProgress(false));
      dispatch(setFormSubmissionSuccessful(true));
      message.success('Role has been updated');
    } catch (error) {
      dispatch(setFormSubmissionInProgress(false));
      dispatch(setFormSubmissionSuccessful(true));
      dispatch(setFormErrors(error.response.data));
    }
  };
};

export const deleteRole = (roleId: number) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      await deleteRoleService(roleId);
      message.success('Role has been deleted');
      dispatch(fetchRoles());
    } catch (error) {
      dispatch(setLoader(false));
      message.error(error.response.data.error);
    }
  };
};
