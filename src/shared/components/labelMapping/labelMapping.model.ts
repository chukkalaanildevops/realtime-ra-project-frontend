// import { Ilabel } from '../../redux/expenseTypeConfiguration/action';

export interface ILabelMappingProps {
  isLabelDataListLoaded?: boolean;
  labelData: Ilabel;
  saveMappedLabel: (data: Ilabel) => void;
  isSFLabel?: boolean;
}
export interface Ilabel {
  [key: string]: IlabelInnerObject;
}
export interface IlabelInnerObject {
  default: string;
  mapped: string;
  is_mandatory?: boolean;
}

export interface Item {
  key: string;
  labelName: string;
  newLabelName: string;
  is_mandatory?: boolean;
}
