export const COST_CENTRES_ACTIONS = {
  SET_COST_CENTRES: 'COST_CENTRES_ACTIONS/SET_COST_CENTRES',
  SAVE_COST_CENTRES: 'COST_CENTRES_ACTIONS/SAVE_COST_CENTRES',
  SAVE_COST_CENTRE_DATA: 'COST_CENTRES_ACTIONS/SAVE_COST_CENTRE_DATA',
  SET_LOADER: 'COST_CENTRES_ACTIONS/SET_LOADER',
  SET_DETAILS_LOADER: 'COST_CENTRES_ACTIONS/SET_DETAILS_LOADER',
  SET_SERVICE_CALL_FAILED: 'COST_CENTRES/SET_SERVICE_CALL_FAILED'
};

export const setCostCentres = (
  costCentres: [],
  paginationData: { [key: string]: any }
) => ({
  type: COST_CENTRES_ACTIONS.SET_COST_CENTRES,
  payload: {
    loader: false,
    costCentres: costCentres,
    paginationData: paginationData,
    serviceCallFailed: false
  }
});

export const saveCostCentres = (data: any[]) => ({
  type: COST_CENTRES_ACTIONS.SAVE_COST_CENTRES,
  payload: data,
});

export const saveCostCentreById = (data: any) => ({
  type: COST_CENTRES_ACTIONS.SAVE_COST_CENTRE_DATA,
  payload: data,
});

export const setLoader = (loader: boolean) => ({
  type: COST_CENTRES_ACTIONS.SET_LOADER,
  payload: loader,
});

export const setDetailsLoader = (loader: boolean) => ({
  type: COST_CENTRES_ACTIONS.SET_DETAILS_LOADER,
  payload: loader,
});

export const setServiceCallFailed = (hasFailed: boolean) => ({
  type: COST_CENTRES_ACTIONS.SET_SERVICE_CALL_FAILED,
  payload: {
    serviceCallFailed: hasFailed
  }
})