import { ButtonProps } from 'antd/lib/button';
import { Moment } from 'moment';
import { ICurrency } from '../../../shared/model';
import { IReceipt } from '../receipt.model';

export interface IReceiptGalleryProps {
  docType: 'Receipt' | 'Supporting Document';
  //   pickMode?: 'single' | 'multi'; // no multi mode support.
  onSelection: (selectedFileObject: IReceipt[], fields?: string[]) => void;
  buttonProps?: ButtonProps;
  userFieldsForReceiptGallery?: IuserFieldsForReceiptGallery;
  disabledFields?:
    | ['date', 'baseCurrency', 'amount', 'receipt_number']
    | string[];
}

export interface IuserFieldsForReceiptGallery {
  date?: Moment;
  baseCurrency?: ICurrency;
  foreignCurrency?: ICurrency;
  amount?: number;
  receipt_number?: string;
}
