export const SET_LOADER = 'SET_LOADER';
export const SET_RISK_SCORES = 'SET_RISK_SCORES';
export const SET_SERVICE_CALL_FAILED = 'SET_SERVICE_CALL_FAILED';

export const setLoader = (isLoading: boolean) => ({
  type: SET_LOADER,
  payload: {
    isLoading: isLoading,
  },
});

export const setRiskScores = (riskScores: { [key: string]: any }[]) => ({
  type: SET_LOADER,
  payload: {
    riskScores: riskScores,
  },
});

export const setServiceCallFailed = (hasFailed: boolean, error?: string) => ({
  type: SET_SERVICE_CALL_FAILED,
  payload: {
    isLoading: false,
    serviceCallFailed: hasFailed,
    serviceCallError: error,
  },
});

export const setRiskScorePermission = (data: any) => {
  return {
    type: SET_RISK_SCORES,
    payload: {
      riskScorePermission: data,
    },
  };
};
