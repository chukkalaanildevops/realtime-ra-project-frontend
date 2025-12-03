import { Dispatch } from 'react';
import {
  setLoader,
  setError,
  setSuccess,
  saveClaimDetector,
} from './claimDuplicateDetection.actions';
import {
  createUpdateClaimDetectorAPI,
  fetchClaimDetectorAPI,
} from '../../../../../services/admin/claimDetector';

export const createOrUpdateClaimDetection = (body: any, id?: string) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(setLoader(true));
      await createUpdateClaimDetectorAPI(body, id);
      dispatch(setSuccess('Added successfully'));
      dispatch(setLoader(false));
      dispatch(fetchClaimDetector());
    } catch (e) {
      dispatch(setLoader(false));
      dispatch(setError('Failed to add '));
    }
  };
};

export const fetchClaimDetector = () => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(setLoader(true));
      const data = await fetchClaimDetectorAPI();
      if (data.data && data.data.length > 0) {
        dispatch(saveClaimDetector(data.data[0]));
      }

      dispatch(setLoader(false));
    } catch (e) {
      dispatch(setLoader(false));
    }
  };
};
