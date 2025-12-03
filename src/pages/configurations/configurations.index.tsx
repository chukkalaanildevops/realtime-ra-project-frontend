/* eslint-disable react-hooks/exhaustive-deps */
import React, { memo, useEffect } from 'react';
import { Tabs, message } from 'antd';
import { connect, ConnectedProps } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import { HeaderBarWrapper, BackButton } from '../../shared/components';
import FTPConfig from './ftpConfiguration/ftpConfig.index';
import TenantConfig from './tenantConfiguration/tenantConfig.index';
import SSOConfig from './ssoConfiguration/ssoConfig.index';
import {
  stateInterface,
  getConfigurationSuccessMessage,
  getConfigurationErrorMessage,
} from '../../shared/redux/rootReducer';
import {
  SSO_ACTION_TYPES,
  setSuccess,
  setError,
} from './configurations.actions';
import { appPath } from '../app/app.routes';
import { Trans } from '@lingui/macro';

const Configurations: React.FC<ConnectedProps<typeof connector>> = props => {
  const {
    activeKey,
    dispatch,
    success,
    error,
    dataSaveLoader,
    loadingMessage,
  } = props;
  let { push } = useHistory();
  const { tab } = useParams();
  useEffect(() => {
    /* ComponentDidMount */
    let key = '1';
    if (tab === 'sso') {
      key = '1';
    } else if (tab === 'ftp') {
      key = '3';
    } else if (tab === 'global') {
      key = '2';
    }
    dispatch({
      type: SSO_ACTION_TYPES.UPDATE_ACTIVE_KEY,
      payload: {
        activeKey: key,
      },
    });
    return () => {
      /* ComponentWillUnmount */
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  useEffect(() => {
    if (dataSaveLoader && loadingMessage) {
      message.loading(loadingMessage);
    } else {
      // message.destroy();
    }
  }, [dataSaveLoader, loadingMessage]);

  useEffect(() => {
    setTimeout(() => {
      if (success) {
        message.success(success, 3, () => dispatch(setSuccess('')));
      }
    }, 100);
  }, [success]);

  useEffect(() => {
    error &&
      typeof error === 'string' &&
      message.error(error, () => dispatch(setError('')));
  }, [error]);

  useEffect(() => {
    return () => message.destroy();
  }, []);

  const handleTabClick = (key: string, _event: any) => {
    switch (key) {
      case '1':
        push(`${appPath.settings.configuration.linkTo}sso`);
        break;
      case '2':
        push(`${appPath.settings.configuration.linkTo}global`);
        break;
      case '3':
        push(`${appPath.settings.configuration.linkTo}ftp`);
        break;
    }
  };

  return (
    <>
      <HeaderBarWrapper
        headerCommonProps={{ title: <Trans>System Configurations</Trans> }}
      >
        <Tabs
          onTabClick={handleTabClick}
          size='large'
          activeKey={activeKey}
          renderTabBar={(_props: any, DefaultTabBar: React.ComponentType) => (
            <div className='tabs-with-back-button-container'>
              <BackButton
                backBtnUrl={appPath.settings.configuration.backLink}
              />
              <DefaultTabBar {..._props} />
            </div>
          )}
        >
          <Tabs.TabPane tab={<Trans>SSO Configurations</Trans>} key='1'>
            <SSOConfig />
          </Tabs.TabPane>
          <Tabs.TabPane tab={<Trans>Tenant Configuration</Trans>} key='2'>
            <TenantConfig />
          </Tabs.TabPane>
          <Tabs.TabPane tab={<Trans>FTP Configuration</Trans>} key='3'>
            <FTPConfig />
          </Tabs.TabPane>
        </Tabs>
      </HeaderBarWrapper>
    </>
  );
};

const mapStateToProps = (state: stateInterface) => {
  const { activeKey, dataSaveLoader, loadingMessage } = state.configuration;
  const success = getConfigurationSuccessMessage(state);
  const error = getConfigurationErrorMessage(state);

  return { activeKey, success, error, dataSaveLoader, loadingMessage };
};

const connector = connect(mapStateToProps);

export default connector(memo(Configurations));
