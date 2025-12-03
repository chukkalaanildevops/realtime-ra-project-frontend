// Actions to Request Detail Component
export const REQUEST_DETAIL_LOADING = 'REQUEST_DETAIL_LOADING';
export const REQUEST_DETAIL_FETCHING_FAILED = 'REQUEST_DETAIL_FETCHING_FAILED';
export const SET_REQUEST_DETAIL_INSTANCE = 'SET_REQUEST_DETAIL_INSTANCE';

// Action creators to Request Detail Component
export const setRequestDetailLoading = (
  isLoading: boolean
) => ({
  type: REQUEST_DETAIL_LOADING,
  payload: {
    requestDetailLoading: isLoading,
    requestDetailFetchingFailed: false
  }
});

export const setRequestDetailFetchingFailed = (
  hasFailed: boolean
) => ({
  type: REQUEST_DETAIL_FETCHING_FAILED,
  payload: {
    requestDetailLoading: false,
    requestDetailFetchingFailed: hasFailed
  }
});

export const setRequestDetailInstance = (
  requestDetailInstance: { [key: string]: any } | undefined,
  requestTypeConfiguration: { [key: string]: any } | undefined
) => ({
  type: SET_REQUEST_DETAIL_INSTANCE,
  payload: {
    requestDetailLoading: false,
    requestDetailFetchingFailed: false,
    requestDetailInstance: requestDetailInstance,
    requestTypeConfiguration: requestTypeConfiguration
  }
});

