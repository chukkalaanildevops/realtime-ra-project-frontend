import axios from '../../utils/reimAxios.utils';
import { tabs } from '../../pages/submitted/submitted.model';
import { AxiosRequestConfig } from 'axios';

export const fetchSubmittedData = (
  dataType: 'data' | 'count',
  item?: tabs,
  page?: number,
  status?: 'PENDNG' | 'APPRVD' | 'REJCTD',
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
  if (status) {
    paramObj.status = status;
  }
  if (page) {
    paramObj.page = page;
  }
  if (pageSize) {
    paramObj.page_size = pageSize;
  }
  // if (proxyId) {
  //   paramObj.delegation = proxyId;
  // }
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
  return axios.get(`/submitted/v2/?${params}`, config);
};

export const attachWorkflowExpenseAPI = (id: number) =>
  axios.post(`/expense-claims/${id}/attach-workflow/`);
export const attachWorkflowBenefitAPI = (id: number) =>
  axios.post(`/benefit-claim/${id}/attach-workflow/`);

export const attachWorkflowRequestAPI = (id: number) =>
  axios.post(`/requests/${id}/attach-workflow/`);
