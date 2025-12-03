import Axios from '../../utils/reimAxios.utils';
import AxiosEcore from '../../utils/ecoreAxios.utils';
export const fetchRiskScoreRangeAPI = () => {
  const baseURL = Axios.defaults.baseURL?.replace('v1', 'v2');
  return Axios({
    method: 'GET',
    url: `/traffic-light-risk-score-configuration/`,
    baseURL: baseURL,
  });
};

export const updateRiskScoreRangeAPI = (body: any) => {
  const baseURL = Axios.defaults.baseURL?.replace('v1', 'v2');
  return Axios({
    method: 'POST',
    url: `/traffic-light-risk-score-configuration/update-risk-range/`,
    baseURL: baseURL,
    data: body,
  });
};

export const getUserPermission = (userId: any) => {
  return AxiosEcore.get(
    `/v2/users/${userId}/specific-permissions/?permission_codes=VIEW_SETUP,ACTION_SETUP_TRAFFIC_LIGHT_RISK_CONFIGURATION`,
  );
};
