import {
  postReceipt,
  putReceipt,
  getReceiptList,
  getReceiptListQueryParam,
  deleteReceipt,
  scanImageAPI,
} from '../../services/receipt';
import { getLocalCurrency } from '../../services/admin/currencyConversion';
import { Dispatch } from 'react';
import { IreceiptPostData } from './receipt.model';
import { AxiosError } from 'axios';
import {
  apiCallFail,
  apiCallRequest,
  apiCallSuccess,
  updateReceiptList,
  setLocalCurrency,
  updateReceiptListLoader,
  updateReceiptListPaginationData,
  setScanLoader,
  setScanDateAmount,
} from './receipt.action';

const handleCommonError = (error: AxiosError, defaultError: string) => {
  return (dispatch: Dispatch<any>) => {
    let errMsg =
      error?.response?.data?.error && error?.response?.data?.error !== ''
        ? error?.response?.data?.error
        : error?.response?.data?.non_field_errors?.length
        ? error?.response?.data?.non_field_errors[0] || defaultError
        : error?.response?.data?.date?.length
        ? error?.response?.data?.date[0] || defaultError
        : error?.response?.data?.details?.length
        ? error?.response?.data?.details[0] || defaultError
        : defaultError;
    dispatch(apiCallFail(errMsg));
  };
};

export const fetchReceiptList = (callBack?: Function) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(apiCallRequest(false, ''));
      dispatch(updateReceiptListLoader(true));
      const res = await getReceiptList();
      dispatch(updateReceiptList(res.data?.data || res.data));
      dispatch(apiCallSuccess(''));
      dispatch(updateReceiptListLoader(false));
      callBack && callBack();
    } catch (error) {
      dispatch(updateReceiptListLoader(false));
      dispatch(handleCommonError(error, 'Failed to update receipt'));
    }
  };
};

export const fetchReceiptListWithIsUsedPara = (
  addIsUsed?: boolean,
  pageNo?: number,
  pageSize?: number,
  callBack?: Function,
) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(apiCallRequest(false, ''));
      dispatch(updateReceiptListLoader(true));
      const res = await getReceiptListQueryParam(addIsUsed, pageNo, pageSize);
      dispatch(updateReceiptList(res.data?.data || res.data));
      dispatch(updateReceiptListPaginationData(res.data?.pagination_data));
      dispatch(apiCallSuccess(''));
      dispatch(updateReceiptListLoader(false));
      callBack && callBack();
    } catch (error) {
      dispatch(updateReceiptListLoader(false));
      dispatch(handleCommonError(error, 'Failed to update receipt'));
    }
  };
};

export const fetchLocalCurrency = (userId: number, callBack?: Function) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(apiCallRequest(false, ''));
      const res = await getLocalCurrency(userId);
      dispatch(setLocalCurrency(res.data.currency));
      dispatch(apiCallSuccess(''));
      callBack && callBack();
    } catch (error) {
      dispatch(handleCommonError(error, ''));
    }
  };
};

export const createReceipt = (
  receiptPostData: IreceiptPostData,
  callBack?: Function,
) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(apiCallRequest(true, 'Saving receipt'));
      await postReceipt(receiptPostData);
      dispatch(apiCallSuccess('Successfully saved receipt'));
      callBack && callBack();
    } catch (error) {
      dispatch(handleCommonError(error, 'Failed to save receipt'));
    }
  };
};

export const updateReceipt = (
  id: number,
  receiptPostData: IreceiptPostData,
  callBack?: Function,
) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(apiCallRequest(true, 'Updating receipt'));
      await putReceipt(id, receiptPostData);
      dispatch(apiCallSuccess('Successfully updated receipt'));
      callBack && callBack();
    } catch (error) {
      dispatch(handleCommonError(error, 'Failed to update receipt'));
    }
  };
};

export const deleteReceiptUsingID = (id: number, callBack?: Function) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(apiCallRequest(true, 'Deleting receipt'));
      await deleteReceipt(id);
      dispatch(apiCallSuccess('Successfully deleted receipt'));
      callBack && callBack();
    } catch (error) {
      dispatch(handleCommonError(error, 'Failed to delete receipt'));
    }
  };
};

export const scanImage = (file: File) => {
  return (dispatch: Dispatch<any>) => {
    dispatch(setScanLoader(true));
    scanImageAPI(file)
      .then((response: any) => {
        const responseData = response.data;
        dispatch(
          setScanDateAmount(
            responseData.Date,
            responseData.Amount,
            responseData['Receipt No.'],
            responseData['currency_code'],
            responseData.is_handwritten_detected || false,
            responseData.confidence,
            responseData.warning_msg,
            responseData.Tax,
          ),
        );
        dispatch(setScanLoader(false));
      })
      .catch((_err: any) => {
        dispatch(setScanLoader(false));
      });
  };
};
