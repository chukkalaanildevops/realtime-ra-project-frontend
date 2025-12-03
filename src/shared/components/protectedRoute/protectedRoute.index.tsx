import React, { memo, FC } from 'react';
import { Route, Redirect, useRouteMatch } from 'react-router-dom';
import { IprotectedRouteProps } from './protectedRoute.model';
import { getAuthToken } from '../../redux/rootReducer';
import { connect, ConnectedProps } from 'react-redux';
import { appPath } from '../../../pages/app/app.routes';
import { getQueryString } from '../../../utils/scroll.utils';

const ProtectedRoute: FC<IprotectedRouteProps &
  ConnectedProps<typeof connector>> = props => {
  const { isAuthenticated, Component, ...rest } = props;

  const companyId = getQueryString('companyId');
  const redirect = appPath.auth.login.linkTo;

  const isRootRoute = useRouteMatch({ path: appPath.root.path, exact: true });
  return (
    <>
      <Route
        {...rest}
        render={(props: any) => {
          if (isAuthenticated) {
            const isAuthorized =
              rest.isAuthorized === undefined ? true : rest.isAuthorized;
            if (isAuthorized) {
              return (
                <>
                  <Component {...props} />
                </>
              );
            } else {
              return (
                <Redirect
                  to={{
                    pathname: '/403',
                  }}
                />
              );
            }
          } else {
            return (
              <Redirect
                to={{
                  pathname: redirect,
                  search:
                    Boolean(companyId) && isRootRoute
                      ? `?companyId=${companyId}`
                      : undefined,
                }}
              />
            );
          }
        }}
      />
    </>
  );
};

const mapStateToProps = (state: any) => {
  const authenticatedStatusToken = getAuthToken(state);
  const isAuthenticatedStatus = authenticatedStatusToken;
  return {
    isAuthenticated: isAuthenticatedStatus ? true : false,
  };
};

const connector = connect(mapStateToProps);
export default connector(memo(ProtectedRoute));
