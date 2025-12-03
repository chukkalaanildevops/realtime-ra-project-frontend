import { COST_CENTRE_STATE } from './costCentre.model';
import { COST_CENTRES_ACTIONS } from './costCentre.actions';

export const initialState: COST_CENTRE_STATE = {
  costCentres: [],
  detailedCostCentre: {},
  loader: false,
  detailsLoader: false,
  paginationData: {},
  serviceCallFailed: false
};

export default (state = initialState, action: any) => {
  const { type, payload } = action;
  switch (type) {
    case COST_CENTRES_ACTIONS.SET_LOADER:
      return {
        ...state,
        loader: payload,
      };
    case COST_CENTRES_ACTIONS.SET_DETAILS_LOADER:
      return {
        ...state,
        detailsLoader: payload,
      };
    case COST_CENTRES_ACTIONS.SET_COST_CENTRES:
      return {
        ...state,
        ...payload
      }
    case COST_CENTRES_ACTIONS.SAVE_COST_CENTRES:
      return {
        ...state,
        costCentres: payload,
      };
    case COST_CENTRES_ACTIONS.SAVE_COST_CENTRE_DATA:
      return {
        ...state,
        detailedCostCentre: payload,
      };
    case COST_CENTRES_ACTIONS.SET_SERVICE_CALL_FAILED:
      return {
        ...state,
        ...payload
      }
    default:
      return state;
  }
};

export const getCostCentres = (state: COST_CENTRE_STATE) =>
  state.loader ? new Array(15).fill({}) : state.costCentres;

export const getCostCentreLoader = (state: COST_CENTRE_STATE) => state.loader;

export const getCostCentreDetails = (state: COST_CENTRE_STATE) =>
  state.detailedCostCentre;

export const getCostCentreDetailsLoader = (state: COST_CENTRE_STATE) =>
  state.detailsLoader;

export const getCostCentresPaginationData = (state: COST_CENTRE_STATE) => state.paginationData;
