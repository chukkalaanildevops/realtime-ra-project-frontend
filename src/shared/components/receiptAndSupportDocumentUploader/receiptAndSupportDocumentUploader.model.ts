import { ReactNode } from 'react';
import { UploadProps } from 'antd/lib/upload';
import { IvalidationError } from '../../../pages/addNewExpense/addNewExpense.model';
import { FormInstance, FormProps } from 'antd/lib/form';
import { IuserFieldsForReceiptGallery } from '../../../pages/receipt/receiptGallery/receiptGallery.model';

export interface IReceiptAndSupportDocumentUploaderProps {
  formProps?: FormProps;
  formType?: string;
  currencies?: any;
  showReceiptComponent?: boolean;
  dragReceiptHereText?: string | ReactNode; //normal text or component
  uploadIcon?: ReactNode; //icon component
  uploadText?: string | ReactNode; //normal text or component
  openSavedReceiptsText?: string | ReactNode; //normal text or component
  selectedReceipt?: [File | string] | []; // previous saved file or initila pass of receipt.
  receiptFormItemProps?: any; //Form item props
  onReceiptChange?: (changeValue: [File | string] | []) => void; // Use this as onChange....

  modelTitle?: string | ReactNode; //Preview model title
  extraUploadProps?: UploadProps; //receipt upload component props(if needed)
  //supporting_document related props
  showSupportingDocument?: boolean; //wheather to show or not pass true/false.
  supportingDocumentFormItemProps?: any; //form item props
  supportingDocuments?: (string | File)[]; // previous saved file or initila pass of document file array.
  backendError?: IvalidationError; //pass backend error if any
  supportingDocumentOnChange?: (file: (File | string)[]) => void; // catch files at parent side using this function.
  form?: FormInstance; //also storing data inside form instance. eg. form.setFieldsValue('supporting_documents'); in response you will get filep[]
  disableSupportingDoc?: boolean;

  userFieldsForReceiptGallery?: IuserFieldsForReceiptGallery;
  receiptGallarySelection?: (files: any, fieldsKey: string[]) => void;
  receiptDisabledFields?:
    | ['date', 'baseCurrency', 'amount', 'receipt_number']
    | string[];
  isReceiptAllowed?: boolean;
  _scanImage?: any;
  scanLoader?: boolean;
  is_enabled_ocr?: boolean;
  ocrReceivedFromGallary?: any;
}

export interface IFileState {
  uid: string;
  name: string;
  status?: undefined;
  type: string;
  size: number;
  url: string;
  file: File;
}
