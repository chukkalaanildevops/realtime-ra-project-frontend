import { ReactType } from 'react';

export interface IprotectedRouteProps {
  // isAuthenticated: boolean;
  path: string;
  Component: ReactType;
  exact: boolean;
  isAuthorized?: boolean;
}
