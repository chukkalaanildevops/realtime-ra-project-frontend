import { IPaginationData } from '../../../../../shared/model';

export interface IItem {
  key: string;
  from: string;
  to: string;
  conversionRate: number;
  effectiveFrom: string;
  isNew?: boolean;
}
export interface ICCState {
  currencyConversionList: IPaginationData<IItem>;
  currencyList: any[];
  conversionRate: IconversionRate | null;
  error: any;
  success: string;
  conversionHistory: any[];
  loader: boolean;
  CurrencyHistoryLoader: boolean;
  loadingMessage: string;
  isDataSubmitting: boolean;
  countryCurrencyList: any[];
}

export interface IconversionRate {
  base_currency_code: string;
  target_currency_code: string;
  conversion_rate: string;
}

export interface IItemStructure {
  key: string;
  base_currency: {
    currency: {
      id: string;
      title: string;
      code: string;
    };
    country: {
      id: string;
      title: string;
    };
  };
  target_currency: {
    currency: {
      id: string;
      title: string;
      code: string;
    };
    country: {
      id: string;
      title: string;
    };
  };
  rate: number;
  effective_from: string;
  isNew?: boolean;
}

export interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: 'number' | 'text' | 'date';
  record: IItem;
  index: number;
  isRequired: boolean;
  children: React.ReactNode;
  errorMsg: string;
}
