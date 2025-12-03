import { AxiosRequestConfig } from 'axios';
import { ICostCentreListingRequestParameters } from '../../shared/redux/costCentre/costCentre.model';
import axios from '../../utils/reimAxios.utils';

export const fetchCostCentresAPI = (id?: string) => {
  if (id) {
    return axios.get(`/cost-centres/${id}/`);
  } else {
    return axios.get('/cost-centres/?compact=True');
  }
};

export const fetchCostCentresForListingService = (
  parameters?: ICostCentreListingRequestParameters,
) => {
  if (parameters !== undefined) {
    let config: AxiosRequestConfig = {
      params: parameters,
    };

    return axios.get('/cost-centres/', config);
  }

  return axios.get('/cost-centres/');
};

export const updateCostCentreService = (
  costCentreId: number,
  data: { [key: string]: any },
) => {
  return axios.patch(`/cost-centres/${costCentreId}/`, data);
};
