import axios from '../../utils/reimAxios.utils';

const URL = '/proxies/';
export const fetchDelegateRecordsAPI = (
  dataType: 'data' | 'count',
  isDelegateByMe: boolean,
  page?: number,
  pageSize?: number,
) => {
  let paramObj: any = {
    function: dataType,
  };
  if (page) {
    paramObj.page = page;
  }

  if (pageSize) {
    paramObj.page_size = pageSize;
  }

  let params = '';
  Object.keys(paramObj).forEach(
    (item: string, index) =>
      (params += `${index === 0 ? '' : '&'}${item}=${paramObj[item]}`),
  );

  return axios.get(
    `${URL}?${
      isDelegateByMe ? 'delegated_by_me' : 'delegated_for_me'
    }=true&${params}`,
  );
};

export const addNewDelegateAPI = (body: any) => axios.post(URL, body);

export const updateDelegateAPI = (body: any, id: number) =>
  axios.put(`${URL}${id}/`, body);

export const fetchProxyPermissionsAPI = () =>
  axios.get(`/permissions/?proxy=true`);

export const activeDelegateAPI = (id: number, isActive: boolean) =>
  axios.patch(`${URL}${id}/mark-active/`, { is_active: isActive });

export const deleteDelegateAPI = (id: number) => axios.delete(`${URL}${id}/`);

export const approveRejectDelegate = (
  id: number,
  status: 'approved' | 'rejected',
) => axios.patch(`/proxies/${id}/workflow/`, { status });

export const getUsersListAPI = () => axios.get(`/proxies/switch-users/`);

export const getDelegateUserByIdAPI = (id: number) =>
  axios.get(`/proxies/validate/?delegation=${id}`);
