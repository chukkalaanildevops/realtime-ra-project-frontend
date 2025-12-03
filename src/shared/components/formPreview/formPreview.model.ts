import {
  generalDataInterface,
  IcustomFields,
  Ientertaiment,
  Imileage,
} from '../../../pages/expenseTypeConfiguration/expenseTypeConfiguration.model';

import {
  generalDataInterface as requestTypeData,
  // customObjInterface as requestTypeCustom,
} from '../../../pages/requestTypeConfiguration/requestTypeConfiguration.model';

type TData = generalDataInterface & requestTypeData;
export type FormDesignProps = {
  data: TData;
  customFields: IcustomFields;
  // customFields: IcustomFields & requestTypeCustom[];
  labelData: Ilabel;
  entertaiment?: Ientertaiment;
  milage?: Imileage;
};

export interface Ilabel {
  [key: string]: IlabelInnerObject;
}

export interface IlabelInnerObject {
  default: string;
  mapped: string;
  is_mandatory?: boolean;
}
