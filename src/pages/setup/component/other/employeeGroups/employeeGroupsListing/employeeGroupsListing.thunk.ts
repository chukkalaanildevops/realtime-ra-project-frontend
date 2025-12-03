import { Dispatch } from 'react';
import {
  apiCallRequest,
  apiCallSuccess,
  apiCallFail,
  apiCallReset,
  saveEmployeeGroupList,
  updateEmployeeGroupListLoaderVisibility,
  saveEmployeeGroupSelectedEmployee,
  updateEmployeeGroupSelectedEmployeeListLoader,
  savePaginationData,
} from './employeeGroupsListing.action';
import {
  getEmployeeGroupList,
  deleteEmployeeGroupById,
  getEmployeeGroupMembers,
} from '../../../../../../services/employeeGroups';
import { TemployeeGroupList } from './employeeGroupsListing.model';
import { AxiosResponse } from 'axios';

export const fetchEmployeeGroupList = () => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(apiCallReset());
      dispatch(apiCallRequest(false));
      dispatch(updateEmployeeGroupListLoaderVisibility(true));
      const response: AxiosResponse = await getEmployeeGroupList();
      const data: TemployeeGroupList = response.data;
      dispatch(saveEmployeeGroupList(data));
      dispatch(apiCallSuccess(''));
      dispatch(updateEmployeeGroupListLoaderVisibility(false));
    } catch (e) {
      dispatch(saveEmployeeGroupList([]));
      dispatch(apiCallFail('Failed to load employee groups.'));
      dispatch(updateEmployeeGroupListLoaderVisibility(false));
    }
  };
};

export const deleteEmployeeGroup = (id: number) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(apiCallReset());
      dispatch(apiCallRequest(true, 'Deleting employee group'));
      await deleteEmployeeGroupById(id);
      dispatch(apiCallSuccess('Successfully employee group deleted.'));
      dispatch(fetchEmployeeGroupList());
    } catch (error) {
      dispatch(apiCallFail('Failed to delete employee group.'));
    }
  };
};

export const fetchEmployeeGroupsSelectedEmployees = (
  id: number,
  page: number = 1,
  search: string = '',
) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(apiCallReset());
      dispatch(apiCallRequest(false));
      dispatch(updateEmployeeGroupSelectedEmployeeListLoader(true));
      const response = await getEmployeeGroupMembers(id, page, search);
      dispatch(saveEmployeeGroupSelectedEmployee(response.data.data));
      dispatch(savePaginationData(response.data.pagination_data));
      dispatch(updateEmployeeGroupSelectedEmployeeListLoader(false));
      dispatch(apiCallSuccess(''));
    } catch (error) {
      dispatch(apiCallFail());
      dispatch(updateEmployeeGroupSelectedEmployeeListLoader(false));
    }
  };
};
