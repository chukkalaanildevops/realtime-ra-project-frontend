import { ReactChild, CSSProperties, ReactFragment, ReactPortal } from 'react';
import { IheaderProps } from '../headerBar/headerBar.model';
import { BreadcrumbProps } from 'antd/lib/breadcrumb/Breadcrumb';
// import { MenuDrawerProps } from '../menuDrawer/model';

export interface IMainInnerContainerProps {
  children:
    | ReactChild
    | ReactFragment
    | ReactPortal
    | boolean
    | null
    | undefined;
  hideHeaderCommon?: boolean;
  showOnlyLocal?: boolean;
  headerCommonProps: IheaderProps;
  appInnerContainer?: CSSProperties;
  containerStyle?: CSSProperties;
  // MenuDrawerProps?: MenuDrawerProps;
  breadcrumbCompProps?: IbreadcrumbProps;
  breadcrumbCompVisibility?: boolean;
  counterProps?: ICounterProps;
}

export interface IbreadcrumbProps {
  breadcrumProps?: BreadcrumbProps;
  enableBackBtn?: boolean;
  backBtnStyle?: CSSProperties;
  backBtnUrl?: string;
  isLoading?: boolean;
  onBackClick?: Function;
  separator?: string;
}

export interface ICounterProps {
  enableCounter?: boolean;
  counterValue?: string;
}
