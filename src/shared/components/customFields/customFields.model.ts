import {
  custom,
  IcustomFields,
} from '../../../pages/expenseTypeConfiguration/expenseTypeConfiguration.model';

import { ReactNode } from 'react';

export interface customFieldsProps {
  formStructure: custom;
  saveCustomFields: (ev: IcustomFields) => void;
  savedCustomFields: IcustomFields;
  isUpdateMode?: boolean;
  updateTabSwitchConfirmationVisibility?: (_bool: boolean) => void;
  errors?: { [key: string]: string };
  title: any;
  isRemoveDeletedField?: boolean;
}

export interface IborderBoxLayout {
  title?: ReactNode;
  header: ReactNode;
  colSize: Object;
  classes?: string;
  // Children: ReactNode;
}
