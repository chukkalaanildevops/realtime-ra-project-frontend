import { message } from 'antd';
import { Dispatch } from 'react';
import {
  fetchDelegatedRecordsAPI,
  updateDelegateAPI,
  addNewDelegateAPI,
  deleteDelegateAPI,
  fetchProxyPermissionsAPI,
  toggleDelegationActiveStatusAPI,
} from '../../../../../services/adminDelegate';
import {
  setDelegations,
  setFormSubmissionInProgress,
  setFormSubmissionSuccess,
  setLoader,
  setProxyPermissions,
  setErrorObject,
} from './adminDelegate.action';

export const fetchDelegationRecords = (queryParameters?: {
  [key: string]: any;
}) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      if (queryParameters === undefined) {
        queryParameters = {
          page: 1,
          page_size: 12,
        };
      }
      dispatch(setLoader(true));
      const response = await fetchDelegatedRecordsAPI(queryParameters);
      let delegations = response.data.data;
      let paginationData = response.data.pagination_data;
      dispatch(setDelegations(delegations, paginationData));
      dispatch(setLoader(false));
    } catch (error) {
      dispatch(setLoader(false));
      message.error(error.response.data.error);
    }
  };
};

export const createOrUpdateDelegationRecord = (
  data: { [key: string]: any },
  id?: number,
  queryParameters?: { [key: string]: any },
) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(setFormSubmissionSuccess(false));
      dispatch(setFormSubmissionInProgress(true));
      const response = id
        ? await updateDelegateAPI(data, id)
        : await addNewDelegateAPI(data);
      await response.data;
      message.success(`Record ${id ? 'updated' : 'created'} successfully `);
      dispatch(fetchDelegationRecords(queryParameters));
      dispatch(setFormSubmissionSuccess(true));
      dispatch(setFormSubmissionInProgress(false));
    } catch (error) {
      dispatch(setFormSubmissionSuccess(false));
      dispatch(setFormSubmissionInProgress(false));
      dispatch(ErrorMessage(error, id));
      //message.error(error.response.data.employee);
    }
  };
};

export const deleteDelegation = (
  id: number,
  queryParameters?: { [key: string]: any },
) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      await deleteDelegateAPI(id);
      dispatch(fetchDelegationRecords(queryParameters));
      message.success('Delegation deleted');
    } catch (error) {
      message.error(error.response.data.error);
    }
  };
};

export const fetchProxyPermissions = () => {
  return async (dispatch: Dispatch<any>) => {
    try {
      const response = await fetchProxyPermissionsAPI();
      dispatch(setProxyPermissions(response.data));
    } catch (error) {
      message.error(error.response.data.error);
    }
  };
};

export const toggleDelegationActiveStatus = (
  id: number,
  isActive: boolean,
  queryParameters?: { [key: string]: any },
) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      await toggleDelegationActiveStatusAPI(id, isActive);
      message.success('Delegation status updated');
      dispatch(fetchDelegationRecords(queryParameters));
    } catch (error) {
      message.error(error.response.data.non_field_errors);
    }
  };
};

export function ErrorMessage(err: any, id: number | undefined) {
  return (dispatch: Dispatch<any>) => {
    const error = err.response.data;
    if (error) {
      if (error.employee) {
        dispatch(
          setErrorObject(true, {
            type: 'employee',
            message: error.employee,
          }),
        );
      } else if (error.end_date) {
        dispatch(
          setErrorObject(true, {
            type: 'end_date',
            message: error.end_date,
          }),
        );
      } else if (error?.on_behalf_of) {
        message.error(error?.on_behalf_of[0]);
      } else {
        dispatch(setErrorObject(true));
        error(`Failed to ${id ? 'Update' : 'Create'} delegation`);
      }
    } else {
      dispatch(setErrorObject(true));
      error(`Failed to ${id ? 'Update' : 'Create'} delegation`);
    }
  };
}
