import { TBackendErrors, ICurrency } from '../../shared/model';
import {
  UPDATE_RECEIPT_LIST,
  UPDATE_RECEIPT_LIST_LOADER,
  RESET_TO_INITIAL_RECEIPT_REDUCER,
  API_CALL_FAIL,
  API_CALL_RESET,
  API_CALL_SUCCESS,
  API_CALL_REQUEST,
  SET_LOCAL_CURRENCY,
  UPDATE_RECEIPT_LIST_PAGINATION_DATA,
} from './receipt.action';
import { Moment } from 'moment';
//  Component
export interface IReceiptProps {}

//Reducer
export interface IinitialReceiptState {
  receiptList: IReceipt[];
  receiptListLoader: boolean;
  paginationData: IReceiptListPaginationData;
  selectedReceipt: number[];
  localCurrency?: ICurrency;
  backendErrors: TBackendErrors;
  scanLoader: boolean;
  scannedReceiptDate: any;
  scannedAmount: any;
  scannedReceiptNumber: any;
  scannedCurrency: any;
  isHandwritten: boolean;
  confidence: any;
  scannedTax: any;
  isLoading: boolean;
  success: string;
  error: string;
  info: string;
  warning_msg: string;
}

export interface IReceiptListPaginationData {
  next_page: null | number;
  number_of_pages: null | number;
  previous_page: null | number;
  total_records: null | number;
}

export interface IReceipt {
  id: number;
  date: string | Moment;
  amount: number;
  currency: any | null;
  receipt_number: string;
  file: string | File;
  file_type: string;
  is_used: boolean;
  created_on: string | null;
  modified_on: string | null;
  deleted_on?: string | null;
  created_by: CreatedByOrModifiedByOrDeletedBy | null;
  modified_by: CreatedByOrModifiedByOrDeletedBy | null;
  deleted_by?: CreatedByOrModifiedByOrDeletedBy | null;
  is_deleted: boolean;
  claim_number?: string;
  expense_type?: string;
  benefit_type?: string;
}
export interface CreatedByOrModifiedByOrDeletedBy {
  id: number;
  name: string;
  email: string;
  username: string;
}

export interface IreceiptFormData {
  date: string;
  amount: number;
  currency: number;
  receipt_number: string;
  add_to: string;
}

//Create
export interface IreceiptPostData {
  date: string;
  amount: number;
  currency: number;
  file: File;
  receipt_number: string;
  is_handwritten_detected: boolean;
}

//update
export interface IreceiptPutData {
  date: string;
  amount: number;
  currency: number;
  receipt_number: string;
}

export type TReceiptReducer = (
  state: IinitialReceiptState,
  actionProps: TactionProps | any,
) => IinitialReceiptState;

export type TactionProps =
  | IresetToInitialReceiptReducerReturn
  | IapiCallRequestReturn
  | IapiCallSuccessReturn
  | IapiCallFailReturn
  | IapiCallResetReturn
  | IupdateReceiptListReturn
  | IupdateReceiptListLoaderReturn
  | IsetLocalCurrencyReturn
  | IupdateReceiptListPaginationDataReturn;

/* resetToInitialReceiptReducer------------------------------ */
export interface IresetToInitialReceiptReducerReturn {
  type: typeof RESET_TO_INITIAL_RECEIPT_REDUCER;
  payload?: {};
}

export type TresetToInitialReceiptReducerFn = () => IresetToInitialReceiptReducerReturn;

/* API related action creatora ------------------------ */
export interface IapiCallRequestReturn {
  type: typeof API_CALL_REQUEST;
  payload: {
    error: string;
    success: string;
    info: string;
    isLoading: boolean;
  };
}

export type TapiCallRequestFn = (
  isLoading?: boolean,
  info?: string,
) => IapiCallRequestReturn;

export interface IapiCallSuccessReturn {
  type: typeof API_CALL_SUCCESS;
  payload: {
    error: string;
    success: string;
    info: string;
    isLoading: boolean;
  };
}

export type TapiCallSuccessFn = (success?: string) => IapiCallSuccessReturn;

export interface IapiCallFailReturn {
  type: typeof API_CALL_FAIL;
  payload: {
    error: string;
    success: string;
    info: string;
    isLoading: boolean;
  };
}

export type TapiCallFailFn = (err?: string) => IapiCallFailReturn;

export interface IapiCallResetReturn {
  type: typeof API_CALL_RESET;
  payload: {
    error: string;
    success: string;
    info: string;
    isLoading: boolean;
  };
}

export type TapiCallResetFn = () => IapiCallResetReturn;

/* updateReceiptList------------------------------ */
export interface IupdateReceiptListReturn {
  type: typeof UPDATE_RECEIPT_LIST;
  payload: IReceipt[];
}

export type TupdateReceiptListFn = (
  list: IReceipt[],
) => IupdateReceiptListReturn;

/* updateReceiptListLoader------------------------------ */
export interface IupdateReceiptListLoaderReturn {
  type: typeof UPDATE_RECEIPT_LIST_LOADER;
  payload: boolean;
}

export type TupdateReceiptListLoaderFn = (
  bool: boolean,
) => IupdateReceiptListLoaderReturn;

export interface IupdateReceiptListPaginationDataReturn {
  type: typeof UPDATE_RECEIPT_LIST_PAGINATION_DATA;
  payload: IReceiptListPaginationData;
}

export type TupdateReceiptListPaginationDataFn = (
  bool: IReceiptListPaginationData,
) => IupdateReceiptListPaginationDataReturn;

/* setLocalCurrency------------------------------ */
export interface IsetLocalCurrencyReturn {
  type: typeof SET_LOCAL_CURRENCY;
  payload: ICurrency;
}

export type TsetLocalCurrencyFn = (bool: ICurrency) => IsetLocalCurrencyReturn;
