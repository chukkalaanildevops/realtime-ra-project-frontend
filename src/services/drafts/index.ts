import axios from '../../utils/reimAxios.utils';
import { tabs } from '../../pages/draft/draft.model';
import { AxiosRequestConfig } from 'axios';

export const fetchDraftData = (
  dataType: 'data' | 'count',
  item?: tabs,
  page?: number,
  filters?: any,
  pageSize?: number,
  cancelToken?: any,
) => {
  let paramObj: any = {
    function: dataType,
  };
  if (item) {
    paramObj.item = item;
  }
  if (page) {
    paramObj.page = page;
  }
  if (pageSize) {
    paramObj.page_size = pageSize;
  }
  if (filters) {
    paramObj = { ...paramObj, ...filters };
  }

  let params = '';
  Object.keys(paramObj).forEach(
    (item: string, index) =>
      (params += `${index === 0 ? '' : '&'}${item}=${paramObj[item]}`),
  );
  let config: AxiosRequestConfig = {
    cancelToken,
  };
  return axios.get(`/drafts/v2/?${params}`, config);
  // return axios.get(`/receipts/?${params}`);
};

export const fetchCardDraftData = (item: any, cancelToken?: any) => {
  let config: AxiosRequestConfig = {
    cancelToken,
  };
  return axios.get(`quick-actions/drafted-${item}/`, config);
};
