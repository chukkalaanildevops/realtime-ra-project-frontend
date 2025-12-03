import { IPaginationData } from '../../../../../shared/model';

export interface IItem {
  key: string;
  from: string;
  to: string;
  effectiveFrom: string;
  isNew?: boolean;
  company: {
    id: string;
    title: string;
    code: string;
    uuid: string;
  };
}
export interface ICCState {
  allowanceList: IPaginationData<IItem>;
  companyList: any[];
  destinationList: any[];
  titleList: any[];
  eligibilityList: any[];
  currencyList: any[];
  payComponentList: any[];
  glAccountList: any[];
  error: any;
  loader: boolean;
  loadingMessage: string;
  success: string;
  isDataSubmitting: boolean;
  allowanceHistoryLoader: boolean;
  allowanceHistory: any;
}
