import * as Models from './riskScoreRange.models';
import * as Actions from './riskScoreRange.actions';

export const initialState: Models.IRiskScoreRange = {
  isLoading: true,
  riskScores: [],
  serviceCallFailed: false,
  riskScorePermission: false,
};

const RiskScoreRangeReducer = (
  state: Models.IRiskScoreRange = initialState,
  action: { type: string; payload: any },
) => {
  switch (action.type) {
    case Actions.SET_LOADER:
      return {
        ...state,
        ...action.payload,
      };

    case Actions.SET_RISK_SCORES:
      return {
        ...state,
        ...action.payload,
      };

    case Actions.SET_SERVICE_CALL_FAILED:
      return {
        ...state,
        ...action.payload,
      };

    default:
      return state;
  }
};

export default RiskScoreRangeReducer;
