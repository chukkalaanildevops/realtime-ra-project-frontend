import { ReactNode } from 'react';

export interface IconfigurationDetailViewProps {
  ConfigurationComponent?: ReactNode;
  FormPreviewComponent?: any;
  customFieldsData: {
    fields: IcustomFields[];
    layout: any;
  };
  isLoadingData?: boolean;
}

export interface IcustomFields {
  [key: string]: any;
}
export interface IreturnCustomFieldStructureProps {
  custom_fields: IcustomFields;
  isLoadingData: boolean;
}
