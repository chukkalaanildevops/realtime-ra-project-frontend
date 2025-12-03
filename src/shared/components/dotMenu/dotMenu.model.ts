import React, { ReactChild, ReactFragment, ReactPortal } from 'react';

type ReactNodeType =
  | ReactChild
  | ReactFragment
  | ReactPortal
  | boolean
  | null
  | undefined;

export interface actionBtnObjInterface {
  OnClick?: (ev: React.MouseEvent<HTMLButtonElement>) => void;
  Disabled?: boolean;
  Type?: 'primary' | 'ghost' | 'dashed' | 'link' | 'default';
  children: ReactNodeType;
  icon: React.ForwardRefExoticComponent<any>;
  hide?: boolean;
  title?: any;
}

export interface DotMenuPropsInterface {
  menuVisibility?: boolean;
  actionBtn: actionBtnObjInterface[];
  dDOnClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  dDDisabled?: boolean;
  showInMenu?: boolean;
}
