import { IClaimDetector } from './claimDuplicateDetection.model';
import { CLAIM_DETECTION_DUPLICATION } from './claimDuplicateDetection.actions';

export const initialState: IClaimDetector = {
  isLoading: false,
  error: '',
  success: '',
  data: null,
};

export default (state = initialState, action: any) => {
  const { type, payload } = action;

  switch (type) {
    case CLAIM_DETECTION_DUPLICATION.SET_LOADER:
      return {
        ...state,
        isLoading: payload,
      };
    case CLAIM_DETECTION_DUPLICATION.SET_SUCCESS:
      return {
        ...state,
        success: payload,
      };
    case CLAIM_DETECTION_DUPLICATION.SET_ERROR:
      return {
        ...state,
        error: payload,
      };
    case CLAIM_DETECTION_DUPLICATION.SAVE_CLAIM_DETECTOR:
      return {
        ...state,
        data: payload,
      };
    default:
      return state;
  }
};

export const getLoader = (state: IClaimDetector) => state.isLoading;
export const getSuccess = (state: IClaimDetector) => state.success;
export const getError = (state: IClaimDetector) => state.error;
export const getClaimDetector = (state: IClaimDetector) => state.data;
