import { Dispatch } from 'react';
import { AxiosResponse } from 'axios';
import {
  fetchRequestDetailsByIdAPI,
  fetchRequestTypeConfigByIdAPI,
} from '../../services/requestType';
import {
  setRequestDetailInstance,
  setRequestDetailLoading,
  setRequestDetailFetchingFailed,
} from './request.action';
import { message } from 'antd';

export const fetchRequestDetailsById = (requestId: number) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(setRequestDetailLoading(true));

      const requestDetailResponse: AxiosResponse = await fetchRequestDetailsByIdAPI(
        String(requestId),
      );

      const requestDetail = requestDetailResponse.data;
      const requestTypeConfigId =
        requestDetail?.request_type_legal_entity?.custom_configuration ||
        requestDetail?.request_type_legal_entity?.global_configuration;

      const requestTypeConfigResponse: AxiosResponse = await fetchRequestTypeConfigByIdAPI(
        requestTypeConfigId,
      );

      dispatch(
        setRequestDetailInstance(requestDetail, requestTypeConfigResponse.data),
      );
      dispatch(setRequestDetailLoading(false));
      dispatch(setRequestDetailFetchingFailed(false));
    } catch (error) {
      message.error('Request details could not be fetched');

      dispatch(setRequestDetailFetchingFailed(true));
      dispatch(setRequestDetailLoading(false));
    }
  };
};
