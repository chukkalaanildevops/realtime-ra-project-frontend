import * as Actions from './request.action';
import * as Models from './request.model';

export const initialState: Models.IRequest = {
  requestDetailInstance: {},
  requestTypeConfiguration: {},
  requestDetailLoading: true,
  requestDetailFetchingFailed: false,
};

const RequestReducer = (
  state: Models.IRequest = initialState,
  action: { type: string; payload: any },
) => {
  switch (action.type) {
    case Actions.REQUEST_DETAIL_LOADING:
      return {
        ...state,
        ...{
          requestDetailLoading: action.payload.requestDetailLoading,
          // requestDetailFetchingFailed: false
        },
      };

    case Actions.REQUEST_DETAIL_FETCHING_FAILED:
      return {
        ...state,
        ...{
          requestDetailLoading: false,
          requestDetailFetchingFailed:
            action.payload.requestDetailFetchingFailed,
        },
      };

    case Actions.SET_REQUEST_DETAIL_INSTANCE:
      return {
        ...state,
        ...{
          requestDetailInstance: action.payload.requestDetailInstance,
          requestDetailLoading: false,
          requestDetailFetchingFailed: false,
          requestTypeConfiguration: action.payload.requestTypeConfiguration,
        },
      };

    default:
      return state;
  }
};

export default RequestReducer;
