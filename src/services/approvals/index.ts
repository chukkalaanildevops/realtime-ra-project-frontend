import Axios from '../../utils/reimAxios.utils';
import { AxiosRequestConfig } from 'axios';
import {
  IApprovalItemsRequestParameters,
  IApprovalResponseData,
  IBulkApprovalResponseData,
} from '../../pages/approvals/approvals.model';
import { generateQueryParamsString } from '../../utils/global.utils';

export const getApprovalItemCountsService = (
  data: IApprovalItemsRequestParameters | any = {},
  cancelToken?: any,
) => {
  const dataCopy = { ...data };

  // if (dataCopy.hasOwnProperty('item')) delete dataCopy.item;
  let config: AxiosRequestConfig = {
    params: {
      ...dataCopy,
      function: 'count',
    },
    paramsSerializer: params => generateQueryParamsString(params),
    cancelToken,
  };
  return Axios.get('/workflow/', config);
};

export const getApprovalItemsService = (
  data: IApprovalItemsRequestParameters,
  cancelToken?: any,
) => {
  let config: AxiosRequestConfig = {
    params: data,
    paramsSerializer: params => generateQueryParamsString(params),
    cancelToken,
  };

  return Axios.get('/workflow/', config);
};

export const respondToApprovalItemsService = (data: IApprovalResponseData) => {
  return Axios.post('/workflow/respond/', data);
};

export const respondToBulkApprovalItemsService = (
  data: IBulkApprovalResponseData,
) => {
  return Axios.post('/workflow/multiple-respond/', data);
};
