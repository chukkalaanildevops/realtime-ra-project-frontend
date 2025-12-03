import React, { FC, Dispatch, useEffect } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useLocation, useHistory } from 'react-router-dom';
import { saveToken, saveTenant } from '../../shared/redux/auth/auth.actions';

const RedirectLogin: FC<ConnectedProps<typeof connector>> = (props: any) => {
  const { _saveToken, _saveTenant } = props;
  const search = useLocation().search;
  const history = useHistory();
  useEffect(() => {
    _saveToken({
      accessToken: new URLSearchParams(search).get('accessToken'),
      refreshToken: new URLSearchParams(search).get('refreshToken'),
    });
    _saveTenant(new URLSearchParams(search).get('tenant'));
    history.push('/dashboard');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <section>Redirecting...</section>;
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  _saveToken: (token: any) => dispatch(saveToken(token)),
  _saveTenant: (tenent: any) => dispatch(saveTenant(tenent)),
});

const connector = connect(null, mapDispatchToProps);
export default connector(RedirectLogin);
