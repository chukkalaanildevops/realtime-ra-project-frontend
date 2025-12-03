import React, { Dispatch, useEffect, useState } from 'react';

import './auth.index.less';
import { Input, Button, Form, message } from 'antd';
import { useHistory } from 'react-router-dom';
import { appPath } from '../app/app.routes';
import {
  getAuthToken,
  getAuthError,
  getAuthTenantConfig,
  getAuthIsEnteredTenant,
} from '../../shared/redux/rootReducer';
import { loginUser, verifyTenant } from '../../shared/redux/auth/auth.thunk';
import {
  saveTenantConfig,
  setError,
  setIsEntTenant,
} from '../../shared/redux/auth/auth.actions';
import { LoadingOutlined } from '@ant-design/icons';
import { connect, ConnectedProps } from 'react-redux';
import { AuthContainer } from './authContainer.index';
import { getQueryString } from '../../utils/scroll.utils';
import { setDocumentTitle } from '../../utils/global.utils';

export const Login: React.FC<ConnectedProps<typeof connector>> = ({
  _login,
  _setError,
  _verifyTenant,
  _setIsEntTenant,
  _resetTenantConfig,
  token,
  error,
  tenantConfig,
  isEntTenant,
}) => {
  const [form] = Form.useForm();
  const [validatingTenant, setValidatingTenant] = useState<boolean>(false);
  const [validatingCred, setValidatingCred] = useState<boolean>(false);
  const [isExternalRedirect, setIsExternalRedirect] = useState<boolean>(false);
  const [redirectionUrl, setRedirectionUrl] = useState<string>('');
  const companyId = getQueryString('companyId');
  const locallyStoredTenant = localStorage.getItem('TENANT');
  const hasTenantStored = Boolean(
    locallyStoredTenant &&
      typeof locallyStoredTenant === 'string' &&
      !companyId,
  );
  const [tenant, setTenant] = useState<string | null>(
    hasTenantStored ? locallyStoredTenant : null,
  );
  const history = useHistory();

  useEffect(() => {
    // ComponentDidMount
    setDocumentTitle(appPath.auth.login.title);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ssoRedirect = async () => {
    if (companyId !== undefined && companyId !== null) {
      setTenant(companyId);
      setIsExternalRedirect(true);
      setValidatingTenant(true);
      const redirect: any = await _verifyTenant(companyId);
      setRedirectionUrl(redirect.url);
      localStorage.setItem('TENANT', companyId);
    }
  };
  useEffect(() => {
    ssoRedirect();
    // });
    // eslint-disable-next-line
  }, [companyId]);

  useEffect(() => {
    //componentDidUpdate
    if (token === undefined || token === '') {
      const isRedirected = sessionStorage.getItem('isRedirected');
      if (isRedirected !== 'true') {
        const authType = sessionStorage.getItem('AT');
        const tenant = localStorage.getItem('TENANT') as string;
        if (authType === 'SSO') {
          setTimeout(() => {
            history.push(`${appPath.auth.login.linkTo}?companyId=${tenant}`);
            // window.location.href = `${window.location.origin}${appPath.auth.login.linkTo}?companyId=${tenant}`;
            sessionStorage.removeItem('AT');
            sessionStorage.setItem('isRedirected', 'true');
          }, 500);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const doLogin = async () => {
    try {
      setValidatingCred(true);
      const values = await form.validateFields();
      const reqObj = {
        username: values.username,
        password: values.password,
      };
      _login(reqObj, loginCallback);
    } catch (e) {
      setValidatingCred(false);
    }
  };

  const loginCallback = () => {
    setValidatingCred(false);
  };

  useEffect(() => {
    error && message.error(error, 2, _setError);
    setValidatingTenant(false);
    // eslint-disable-next-line
  }, [error]);

  useEffect(() => {
    if (token) {
      history.replace(appPath.dashboard.path);
    }
    // eslint-disable-next-line
  }, [token]);

  useEffect(() => {
    if (redirectionUrl) {
      if (!redirectionUrl.includes('/login/')) {
        setIsExternalRedirect(true);
        window.location.href = redirectionUrl;
        _setIsEntTenant(false);
      }
    }
    setValidatingTenant(false);
    setRedirectionUrl('');
    // eslint-disable-next-line
  }, [redirectionUrl]);

  useEffect(() => {
    setValidatingTenant(false);
  }, [isEntTenant]);

  const setupTenant = async () => {
    if (tenant !== null) {
      if (tenant.trim().length === 0) {
        message.error('Enter valid Organisation ID');
        return;
      }
      setValidatingTenant(true);
      const redirect: any = await _verifyTenant(tenant);
      setRedirectionUrl(redirect.url);
      localStorage.setItem('TENANT', tenant);
    }
  };

  const switchTenant = () => {
    _resetTenantConfig();
    localStorage.removeItem('TENANT');
    setTenant(null);
    _setIsEntTenant(false);
    setRedirectionUrl('');
  };

  return (
    <>
      {(tenantConfig === undefined && !isExternalRedirect && !isEntTenant && (
        <AuthContainer>
          <h1
            style={{ textAlign: 'center', marginBottom: '24px' }}
            data-testId='enterOrganisationHeader'
          >
            Sign In
          </h1>
          <label
            className='organisation-id-label'
            data-cy='organisationIDLabel'
          >
            Organisation ID
          </label>
          <Input
            className='organisation-id-input'
            placeholder='Enter Your Organisation ID'
            onChange={e => setTenant(e.target.value)}
            onPressEnter={() => {
              setupTenant();
            }}
            value={tenant || ''}
            readOnly={validatingTenant}
            data-cy='enterOrganisationInput'
            autoComplete='off'
          />
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: '24px',
            }}
          >
            <Button
              onClick={setupTenant}
              type='primary'
              loading={validatingTenant}
              data-testId='selectOrganisationContinueButton'
            >
              {validatingTenant ? 'Verifying' : 'Continue'}
            </Button>
          </div>
        </AuthContainer>
      )) ||
        (tenantConfig === undefined && isExternalRedirect && !isEntTenant && (
          <div className='redirect-message'>
            <div className='icon-message'>
              <div className='icon'>
                <LoadingOutlined />
              </div>
              <div className='message'>Redirecting you to login page</div>
            </div>
          </div>
        )) ||
        (isEntTenant && (
          <AuthContainer>
            <h1
              style={{ textAlign: 'center', marginBottom: '0px' }}
              data-cy='loginHeader'
            >
              Sign In
            </h1>
            <p
              style={{
                marginBottom: '24px',
                fontSize: '1rem',
                marginTop: '10px',
              }}
              className='text-center'
            >
              Enter your credentials for <strong>{tenant}</strong>
            </p>
            <Form form={form} layout='vertical'>
              <Form.Item
                label='Username'
                name='username'
                rules={[{ required: true, message: 'Enter Username' }]}
                data-cy='usernameFormItem'
              >
                <Input data-cy='usernameInput' autoComplete='off' />
              </Form.Item>
              <Form.Item
                label='Password'
                name='password'
                rules={[{ required: true, message: 'Enter Password' }]}
                data-cy='passwordFormItem'
              >
                <Input.Password data-cy='passwordInput' autoComplete='off' />
              </Form.Item>
              <Form.Item noStyle className='login-button-container'>
                <Button
                  onClick={doLogin}
                  type='primary'
                  htmlType='submit'
                  data-cy='loginButton'
                  loading={validatingCred}
                >
                  {validatingCred ? 'Verifying' : 'Continue'}
                </Button>
              </Form.Item>
              <Form.Item noStyle>
                <Button
                  type='link'
                  onClick={switchTenant}
                  data-testId='switchTenantButton'
                >
                  Change Organisation ID
                </Button>
              </Form.Item>
            </Form>
          </AuthContainer>
        ))}
    </>
  );
};

const mapStateToProps = (state: any) => ({
  token: getAuthToken(state),
  error: getAuthError(state),
  tenantConfig: getAuthTenantConfig(state),
  isEntTenant: getAuthIsEnteredTenant(state),
});

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  _login: (reqData: any, callback?: (isSuccess: boolean) => void) =>
    dispatch(loginUser(reqData, callback)),
  _setError: () => dispatch(setError('')),
  _verifyTenant: (tenant: string) => dispatch(verifyTenant(tenant)),
  _setIsEntTenant: (isEntTenant: boolean) =>
    dispatch(setIsEntTenant(isEntTenant)),
  _resetTenantConfig: () => dispatch(saveTenantConfig(undefined)),
});

const connector = connect(mapStateToProps, mapDispatchToProps);

export default connector(Login);
