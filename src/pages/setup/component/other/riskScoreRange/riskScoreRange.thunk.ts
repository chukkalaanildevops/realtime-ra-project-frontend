import { Dispatch } from 'react';
import { AxiosResponse } from 'axios';
import {
  setLoader,
  setRiskScorePermission,
  setRiskScores,
  setServiceCallFailed,
} from './riskScoreRange.actions';
import { message } from 'antd';
import {
  fetchRiskScoreRangeAPI,
  getUserPermission,
  updateRiskScoreRangeAPI,
} from '../../../../../services/riskScoreConfiguration';

export const setPageLoader = (isLoading: boolean) => {
  return async (dispatch: Dispatch<any>) => {
    dispatch(setLoader(isLoading));
  };
};

export const fetchRiskScoreRange = () => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(setLoader(true));
      const response: AxiosResponse = await fetchRiskScoreRangeAPI();
      dispatch(setRiskScores(response.data));
      dispatch(setLoader(false));
    } catch (error) {
      dispatch(setLoader(false));
    }
  };
};

export const updateRiskScoreRange = (body: any) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(setLoader(true));
      const response = await updateRiskScoreRangeAPI(body);
      message.destroy();
      dispatch(setRiskScores(response.data));
      setTimeout(() => {
        message.success('Risk Score update successfully.', 5);
      }, 0.1);
      dispatch(setLoader(false));
    } catch (error) {
      message.destroy();
      dispatch(setLoader(false));
    }
  };
};

export const fetchUserPermission = (userId: any) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      const response: AxiosResponse = await getUserPermission(userId);
      dispatch(setRiskScorePermission(response.data.has_permissions));
    } catch (error) {
      dispatch(setServiceCallFailed(true, error.response.data.error));
      dispatch(setLoader(false));
    }
  };
};
