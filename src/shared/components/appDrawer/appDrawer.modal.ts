import { DrawerProps } from 'antd/lib/drawer';

export interface AppDrawerProps {
  showCancelButton?: boolean;
  cancelText?: React.ReactNode | string;
  onCancelClick?: (event: any) => void;
  showOkButton?: boolean;
  isLoading?: boolean;
  OkText?: React.ReactNode | string;
  onOkClick?: (event: any) => void;
  isBoldTitle?: boolean;
}

export type IDrawerProps = AppDrawerProps & DrawerProps;
