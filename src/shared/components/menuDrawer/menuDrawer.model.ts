export type MenuDrawerProps = {
  values?: any;
  // userData: any;
  // activePage: string;
  // history: { push: Function };
};

export type MenuItemType = {
  title: any;
  icon: any;
  navigate?: string;
  key?: string;
  code?: string;
  onClick?: () => void;
  isVisible?: boolean;
  isSubmenu?: boolean;
  child?: any;
};
