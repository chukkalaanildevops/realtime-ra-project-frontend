export interface IOutboundState {
  schedule: any[];
  loader: boolean;
  success: string;
  error: any;
  loadingMessage: string;
  categoryRecords: any[];
  fileSplitRecords: any[];
  dateFormat: any[];
  delimiter: any[];
  ftpServers: any[];
  fileFormats: any[];
  isDataUpdating: boolean;
  activeTabKey: string;
  tabSwitchConfirmationVisibility: boolean;
  loadingLabelMappingList: boolean;
  label: Ilabel;
  labelList: any[];
  userLabelList: any[];
  info: string;
  isLoading: boolean;
}

export interface ILabelInnerObject {
  default: string;
  mapped: string;
  is_mandatory?: boolean;
}
export interface Ilabel {
  [key: string]: ILabelInnerObject;
}
