import {
  TupdateReceiptListFn,
  TupdateReceiptListLoaderFn,
  TresetToInitialReceiptReducerFn,
  TapiCallRequestFn,
  TapiCallSuccessFn,
  TapiCallResetFn,
  TapiCallFailFn,
  TsetLocalCurrencyFn,
  TupdateReceiptListPaginationDataFn,
} from './receipt.model';

export const RESET_TO_INITIAL_RECEIPT_REDUCER: string =
  'RECEIPT/RESET_TO_INITIAL_RECEIPT_REDUCER';
export const API_CALL_REQUEST = 'RECEIPT/API_CALL_REQUEST';
export const API_CALL_RESET = 'RECEIPT/API_CALL_RESET';
export const API_CALL_SUCCESS = 'RECEIPT/API_CALL_SUCCESS';
export const API_CALL_FAIL = 'RECEIPT/API_CALL_FAIL';

export const UPDATE_RECEIPT_LIST: string = 'RECEIPT/UPDATE_RECEIPT_LIST';
export const UPDATE_RECEIPT_LIST_LOADER: string =
  'RECEIPT/UPDATE_RECEIPT_LIST_LOADER';
export const UPDATE_RECEIPT_LIST_PAGINATION_DATA: string =
  'RECEIPT/UPDATE_RECEIPT_LIST_PAGINATION_DATA';
export const UPDATE_SELECTED_RECEIPT: string =
  'RECEIPT/UPDATE_SELECTED_RECEIPT';

export const UPDATE_SCANNED_DATE_AMOUNT: string =
  'RECEIPT/UPDATE_SCANNED_DATE_AMOUNT';

export const UPDATE_SCAN_LOADER: string = 'RECEIPT/UPDATE_SCAN_LOADER';

export const SET_LOCAL_CURRENCY: string = 'RECEIPT/SET_LOCAL_CURRENCY';
export const UPDATE_IS_HANDWRITTEN = 'RECEIPT/UPDATE_IS_HANDWRITTEN';

export const resetToInitialReceiptReducer: TresetToInitialReceiptReducerFn = () => ({
  type: RESET_TO_INITIAL_RECEIPT_REDUCER,
});

export const apiCallRequest: TapiCallRequestFn = (isLoading = true, info) => ({
  type: API_CALL_REQUEST,
  payload: {
    error: '',
    success: '',
    info: info !== undefined ? info : 'Loading Data...',
    isLoading: isLoading,
  },
});

export const apiCallSuccess: TapiCallSuccessFn = success => ({
  type: API_CALL_SUCCESS,
  payload: {
    error: '',
    success: success !== undefined ? success : 'Data loaded successfully.',
    info: '',
    isLoading: false,
  },
});

export const apiCallFail: TapiCallFailFn = err => ({
  type: API_CALL_FAIL,
  payload: {
    error: err !== undefined ? err : 'Failed to load data.',
    success: '',
    info: '',
    isLoading: false,
  },
});

export const apiCallReset: TapiCallResetFn = () => ({
  type: API_CALL_RESET,
  payload: {
    error: '',
    success: '',
    info: '',
    isLoading: false,
  },
});

export const updateReceiptList: TupdateReceiptListFn = list => ({
  type: UPDATE_RECEIPT_LIST,
  payload: list,
});

export const updateReceiptListLoader: TupdateReceiptListLoaderFn = bool => ({
  type: UPDATE_RECEIPT_LIST_LOADER,
  payload: bool,
});

export const updateReceiptListPaginationData: TupdateReceiptListPaginationDataFn = paginationData => ({
  type: UPDATE_RECEIPT_LIST_PAGINATION_DATA,
  payload: paginationData,
});

export const setLocalCurrency: TsetLocalCurrencyFn = bool => ({
  type: SET_LOCAL_CURRENCY,
  payload: bool,
});

export const setScanLoader = (status: boolean) => ({
  type: UPDATE_SCAN_LOADER,
  payload: status,
});

export const setScanDateAmount = (
  scannedDate: any,
  scannedAmount: any,
  scannedRecNumber: any,
  scannedCurrency: any,
  is_handwritten_detected: boolean,
  confidence: any,
  warning_msg: string,
  scannedTax?: any,
) => ({
  type: UPDATE_SCANNED_DATE_AMOUNT,
  payload: {
    scannedReceiptDate: scannedDate,
    scannedAmount: scannedAmount,
    scannedReceiptNumber: scannedRecNumber,
    scannedCurrency: scannedCurrency,
    isHandwritten: is_handwritten_detected,
    confidence: confidence,
    warning_msg: warning_msg,
    scannedTax: scannedTax,
  },
});

export const setIsHandwrittenStatus = (status: boolean) => ({
  type: UPDATE_IS_HANDWRITTEN,
  payload: status,
});
