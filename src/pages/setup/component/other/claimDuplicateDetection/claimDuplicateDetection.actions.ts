export const CLAIM_DETECTION_DUPLICATION = {
  SET_LOADER: 'CLAIM_DETECTION_DUPLICATION/SET_LOADER',
  SET_SUCCESS: 'CLAIM_DETECTION_DUPLICATION/SET_SUCCESS',
  SET_ERROR: 'CLAIM_DETECTION_DUPLICATION/SET_ERROR',
  SAVE_CLAIM_DETECTOR: 'CLAIM_DETECTION_DUPLICATION/SAVE_CLAIM_DETECTOR',
};

export const setLoader = (isLoading: boolean) => ({
  type: CLAIM_DETECTION_DUPLICATION.SET_LOADER,
  payload: isLoading,
});

export const setSuccess = (msg: string) => ({
  type: CLAIM_DETECTION_DUPLICATION.SET_SUCCESS,
  payload: msg,
});

export const setError = (msg: string) => ({
  type: CLAIM_DETECTION_DUPLICATION.SET_ERROR,
  payload: msg,
});

export const saveClaimDetector = (data: any) => ({
  type: CLAIM_DETECTION_DUPLICATION.SAVE_CLAIM_DETECTOR,
  payload: data,
});
