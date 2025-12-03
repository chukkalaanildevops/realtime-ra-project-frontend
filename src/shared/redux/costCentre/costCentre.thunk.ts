import { Dispatch } from 'react';
import { message } from 'antd';
import {
  setLoader,
  saveCostCentreById,
  saveCostCentres,
  setDetailsLoader,
  setCostCentres,
  setServiceCallFailed,
} from './costCentre.actions';
import {
  fetchCostCentresAPI,
  fetchCostCentresForListingService,
} from '../../../services/costCentre';
import { AxiosResponse } from 'axios';
import { ICostCentreListingRequestParameters } from './costCentre.model';

export const fetchCostCentres = (id?: string) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      id ? dispatch(setDetailsLoader(true)) : dispatch(setLoader(true));
      const data = await fetchCostCentresAPI(id);
      if (id) {
        dispatch(saveCostCentreById(data.data));
      } else {
        dispatch(saveCostCentres(data.data));
      }
      id ? dispatch(setDetailsLoader(false)) : dispatch(setLoader(false));
    } catch (e) {
      id ? dispatch(setDetailsLoader(false)) : dispatch(setLoader(false));
    }
  };
};

export const fetchCostCentresForListing = (
  parameters?: ICostCentreListingRequestParameters,
) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(setLoader(true));
      const response: AxiosResponse = await fetchCostCentresForListingService(
        parameters,
      );

      let costCentres = response.data.data;
      let paginationData = response.data.pagination_data;

      dispatch(setCostCentres(costCentres, paginationData));
    } catch (error) {
      message.error('Cost centres could not be fetched');
      dispatch(setServiceCallFailed(true));
      dispatch(setCostCentres([], {}));
    }
  };
};
