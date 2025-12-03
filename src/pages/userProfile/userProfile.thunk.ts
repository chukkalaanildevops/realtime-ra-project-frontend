import { Dispatch } from 'react';
import { message } from 'antd';
import {
  saveUserData,
  setError,
  setLoader,
  setRoles,
  setEmployeeApproversData,
} from './userProfile.action';
import {
  fetchProfileDataAPI,
  fetchRolesDropdownAPI,
  updateUserRolesAPI,
  fetchEmployeeApproversDataAPI,
  fetchApproversCustomFieldsListAPI,
} from '../../services/profile';
import { getUser } from '../../shared/redux/rootReducer';

export const fetchUserProfile = (id?: number) => {
  return async (dispatch: Dispatch<any>, getState: any) => {
    try {
      dispatch(setLoader(true));
      let userId: number;
      if (id === undefined) {
        const state = getState();
        const user = getUser(state);
        userId = user?.id;
      } else {
        userId = id;
      }
      // const state = getState();
      // const user = getUser(state);
      const response = await fetchProfileDataAPI(userId);
      dispatch(saveUserData(response.data));
      dispatch(setLoader(false));
    } catch (e) {
      dispatch(setLoader(false));
      dispatch(setError('Failed to fetch profile'));
      // eslint-disable-next-line no-console
    }
  };
};

export const fetchRoles = () => {
  return async (dispatch: Dispatch<any>, getState: any) => {
    try {
      dispatch(setLoader(true));
      const response = await fetchRolesDropdownAPI();
      dispatch(setRoles(response.data));
      dispatch(setLoader(false));
    } catch (e) {
      dispatch(setLoader(false));
      dispatch(setError('Failed to fetch roles'));
      // eslint-disable-next-line no-console
    }
  };
};

export const updateUserRoles = ({
  userId,
  data,
  onSuccess,
  onFailure,
}: {
  userId: number;
  data: { roles: number[] };
  onSuccess: Function;
  onFailure: Function;
}) => {
  return async (_dispatch: Dispatch<any>, _getState: any) => {
    try {
      message.success({
        content: `Updating roles`,
        key: 'UPDATE_ROLES',
      });
      await updateUserRolesAPI({ userId, data });
      message.success({
        content: `Roles updated`,
        key: 'UPDATE_ROLES',
      });
      onSuccess();
    } catch (e) {
      if (e.response.status === 404) {
        const error_msg = e.response.data.non_field_errors[0];
        message.error({
          content: error_msg,
          key: 'UPDATE_ROLES',
        });
      } else {
        message.error({
          content: `Unable to update roles`,
          key: 'UPDATE_ROLES',
        });
      }
      onFailure();
    }
  };
};

export const fetchEmployeeApproversData = (
  page: number,
  pageSize?: number,
  employeeId?: number,
  effective_from__lte?: any,
  sort?: any,
) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(setLoader(true));
      const response = await fetchEmployeeApproversDataAPI(
        page,
        pageSize,
        employeeId,
        effective_from__lte,
        sort,
      );
      dispatch(setEmployeeApproversData(response.data));
      dispatch(setLoader(false));
    } catch (e) {
      dispatch(setLoader(false));
      dispatch(setError('Failed to fetch approvers'));
      // eslint-disable-next-line no-console
    }
  };
};
export const fetchApproversCustomFieldsList = (
  page: number,
  pageSize?: number,
  employeeId?: number,
  effective_from__lte?: any,
  sort?: any,
) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(setLoader(true));
      const response = await fetchApproversCustomFieldsListAPI(page, pageSize);
      if (response?.data?.data?.length > 0) {
        dispatch(
          fetchEmployeeApproversData(
            page,
            pageSize,
            employeeId,
            effective_from__lte,
            sort,
          ),
        );
      }
      dispatch(setLoader(false));
    } catch (e) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const data = (e as any).response?.data;
      dispatch(setLoader(false));
    }
  };
};
