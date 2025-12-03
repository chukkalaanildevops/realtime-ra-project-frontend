import React, { CSSProperties } from 'react';
import { UploadProps, UploadChangeParam } from 'antd/lib/upload';
import { UploadFile } from 'antd/lib/upload/interface';
import { ICSVTableProps } from '../csvTable/csvTable.model';

export type viewType = 'Card' | 'Table';

export interface IfilterBarProps {
  isAddButton: boolean;
  addButtonText?: string;
  isAddButtonDisabled?: boolean;
  addButtonOnClickFn?: (ev: React.MouseEvent<HTMLButtonElement>) => void;
  uploadButtonHandler?: (info: UploadChangeParam<UploadFile<any>>) => void;
  uploadConfig?: UploadProps;
  isLoading?: boolean;
  enableBackBtn?: boolean;
  backBtnStyle?: CSSProperties;
  backBtnUrl?: string;
  onBackClick?: Function;
  extraData?: {
    showDropdown: boolean;
    uploadHandle: (info: UploadChangeParam<UploadFile<any>>) => void;
    downloadHandle: () => void;
    uploadFromFTP?: () => void;
  };
  CSVTableVisibility?: boolean;
  CSVConfig?: ICSVTableProps;
  filterShown?: React.FC | boolean;
  tips?: string[];
  tipsObject?: any;
  viewConfig?: {
    enableToggleView: boolean;
    currentView: viewType;
    onChangeView?: (view: viewType) => void;
  };
  canShare?: boolean;
  canExport?: boolean;
  onExport?: (val: string) => void;
  filterView?: (isVisible: boolean) => void;
  isFilterActive?: boolean;
  showDownload?: boolean;
  onDownload?: () => void;
}
