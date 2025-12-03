import axios from '../../utils/reimAxios.utils';

export const getDashboardList = () => {
  return axios.get('/dashboards/');
};

export const getLayoutDataList = (id: string) => {
  return axios.get(`/dashboards/${id}/`);
};

export const getDashboardChartData = (id: number, viewAsRole: any) => {
  return axios.get(`/dashboard-charts/${id}/data/?view_as_role=${viewAsRole}`);
};
