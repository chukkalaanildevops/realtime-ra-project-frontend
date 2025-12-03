import Axios from '../../utils/reimAxios.utils';
import {
  IreceiptPostData,
  IreceiptPutData,
} from '../../pages/receipt/receipt.model';

/**
 * GET call to fetch all receipts
 */
export const getReceiptList = (addIsUsed: boolean = false) =>
  Axios.get(`/receipts/${addIsUsed ? '?is_used=true' : ''}`);

/**
 * GET call to fetch all receipts
 */
export const getReceiptListQueryParam = (
  addIsUsed: boolean = false,
  pageNo: number = 1,
  pageSize: number = 12,
) =>
  Axios.get(
    `/receipts/?is_used=${addIsUsed}&page=${pageNo}&page_size=${pageSize}`,
  );

/**
 * GET call to fetch receipts list
 */
export const getPaginatedReceiptList = (pageNo: number = 1) =>
  Axios.get('/receipts/?page=' + pageNo);

/**
 * Update Receipt
 * @param id
 * @param postData
 */
export const putReceipt = (id: number, postData: IreceiptPutData) => {
  return Axios.put(`/receipts/${id}/`, getFormData(postData), {
    headers: {
      'content-type': 'multipart/form-data',
    },
  });
};

/**
 * Create / Save Receipt
 * @param postData
 */
export const postReceipt = (postData: IreceiptPostData) => {
  return Axios.post('/receipts/', getFormData(postData), {
    headers: {
      'content-type': 'multipart/form-data',
    },
  });
};

export const deleteReceipt = (id: number) => Axios.delete(`/receipts/${id}/`);

const getFormData = (body: { [x: string]: any }) => {
  let formData = new FormData();
  for (let [key, value] of Object.entries(body)) {
    formData.append(key, value);
  }

  return formData;
};

export const scanImageAPI = (file: File) => {
  return Axios.post(
    '/ocr-detection/scan-receipt/',
    getFormData({ image: file }),
    {
      headers: {
        'content-type': 'multipart/form-data',
      },
    },
  );
};
