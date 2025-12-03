import { TReceiptReducer, IinitialReceiptState } from './receipt.model';
import {
  UPDATE_RECEIPT_LIST,
  UPDATE_RECEIPT_LIST_LOADER,
  API_CALL_REQUEST,
  API_CALL_RESET,
  API_CALL_SUCCESS,
  API_CALL_FAIL,
  RESET_TO_INITIAL_RECEIPT_REDUCER,
  SET_LOCAL_CURRENCY,
  UPDATE_RECEIPT_LIST_PAGINATION_DATA,
  UPDATE_SCANNED_DATE_AMOUNT,
  UPDATE_SCAN_LOADER,
  UPDATE_IS_HANDWRITTEN,
} from './receipt.action';

export const initialReceiptState: IinitialReceiptState = {
  receiptList: [],
  receiptListLoader: false,
  paginationData: {
    next_page: null,
    number_of_pages: 1,
    previous_page: null,
    total_records: 5,
  },
  selectedReceipt: [],
  backendErrors: {},
  isLoading: false,
  scanLoader: false,
  scannedReceiptDate: null,
  scannedAmount: 0,
  scannedReceiptNumber: '',
  scannedCurrency: {},
  scannedTax: 0,
  isHandwritten: false,
  confidence: null,
  warning_msg: '',
  success: '',
  error: '',
  info: '',
};

const ReceiptReducer: TReceiptReducer = (
  state = initialReceiptState,
  { type, payload = {} },
) => {
  switch (type) {
    case API_CALL_REQUEST:
    case API_CALL_RESET:
    case API_CALL_SUCCESS:
    case API_CALL_FAIL:
    case UPDATE_SCANNED_DATE_AMOUNT:
      return {
        ...state,
        ...payload,
      };
    case UPDATE_RECEIPT_LIST:
      return {
        ...state,
        receiptList: payload,
      };
    case UPDATE_RECEIPT_LIST_LOADER:
      return {
        ...state,
        receiptListLoader: payload,
      };
    case UPDATE_RECEIPT_LIST_PAGINATION_DATA:
      return {
        ...state,
        paginationData: payload,
      };
    case SET_LOCAL_CURRENCY:
      return {
        ...state,
        localCurrency: payload,
      };
    case UPDATE_SCAN_LOADER:
      return {
        ...state,
        scanLoader: payload,
      };
    case RESET_TO_INITIAL_RECEIPT_REDUCER:
      return {
        ...initialReceiptState,
        scanLoader: state.scanLoader,
      };
    case UPDATE_IS_HANDWRITTEN:
      return {
        ...state,
        isHandwritten: payload,
      };
    default:
      return state;
  }
};

export default ReceiptReducer;
