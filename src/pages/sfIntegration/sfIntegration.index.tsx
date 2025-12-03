/* eslint-disable react-hooks/exhaustive-deps */
import React, { Dispatch, useEffect, ComponentType } from 'react';

import './sfIntegration.index.less';
import {
  HeaderBarWrapper,
  BackButton,
  ErrorBoundary,
} from '../../shared/components';
import { Tabs, message } from 'antd';
import {
  Scheduling,
  EntityTypeSetup,
  FileNameMapping,
  PastJobExecution,
} from './components/components.index';
import LOGS from './sfLogs/sfLogs.index';
import {
  getSFIntegrationLoader,
  getSFIntegrationSuccess,
  getSFIntegrationError,
  getSFIntegrationLoadingMessage,
  getSFIntegrationActiveTab,
  getSFIntegrationDataSubmitLoader,
} from '../../shared/redux/rootReducer';
import { connect, ConnectedProps } from 'react-redux';
import { resetMessages, setActiveTab } from './sfIntegration.actions';
import { appPath } from '../app/app.routes';
import { useHistory, useParams } from 'react-router-dom';
import { Trans } from '@lingui/macro';
const SFIntegration: React.FC<ConnectedProps<typeof connector>> = ({
  _resetMessages,
  _setActiveTab,
  error,
  loader,
  success,
  loadingMessage,
  isDataSubmitting,
}) => {
  const params: any = useParams();
  const tab = params.tab;
  const history = useHistory();

  useEffect(() => {
    (loader || isDataSubmitting) && loadingMessage
      ? message.loading(loadingMessage)
      : message.destroy();
  }, [loader, loadingMessage, isDataSubmitting]);

  useEffect(() => {
    if (success) {
      setTimeout(() => {
        success && message.success(success, 100, () => _resetMessages());
      }, 1000);
      setTimeout(() => {
        _resetMessages();
      }, 2000);
    }
  }, [success]);

  useEffect(() => {
    if (error && typeof error === 'string') {
      error && message.error(error, 3, () => _resetMessages());
    }
  }, [error]);

  const handleTabClick = (key: string) => {
    history.push(`${appPath.settings.sfIntegration.linkTo}${key}`);
  };

  return (
    <ErrorBoundary>
      <HeaderBarWrapper
        headerCommonProps={{ title: <Trans>SF Integration</Trans> }}
      >
        <div className='sf-config-container'>
          <Tabs
            renderTabBar={(_props: any, DefaultTabBar: ComponentType) => (
              <div className='tabs-with-back-button-container'>
                <BackButton
                  backBtnUrl={appPath.settings.sfIntegration.backLink}
                />
                <DefaultTabBar {..._props} />
              </div>
            )}
            activeKey={tab}
            onChange={handleTabClick}
          >
            <Tabs.TabPane key='scheduling' tab={<Trans>Scheduling</Trans>}>
              <Scheduling />
            </Tabs.TabPane>
            <Tabs.TabPane
              key='entity-setup'
              tab={<Trans>Entity Type Setup</Trans>}
            >
              <EntityTypeSetup />
            </Tabs.TabPane>
            <Tabs.TabPane
              key='file-configuration'
              tab={<Trans>File Name Mapping</Trans>}
            >
              <FileNameMapping />
            </Tabs.TabPane>
            <Tabs.TabPane key='stages' tab={<Trans>Past Job Execution</Trans>}>
              <PastJobExecution />
            </Tabs.TabPane>
            <Tabs.TabPane key='sf-logs' tab={<Trans>SF Users</Trans>}>
              <LOGS />
            </Tabs.TabPane>
          </Tabs>
        </div>
      </HeaderBarWrapper>
    </ErrorBoundary>
  );
};

const mapStateToProps = (state: any) => ({
  loader: getSFIntegrationLoader(state),
  success: getSFIntegrationSuccess(state),
  error: getSFIntegrationError(state),
  loadingMessage: getSFIntegrationLoadingMessage(state),
  activeKey: getSFIntegrationActiveTab(state),
  isDataSubmitting: getSFIntegrationDataSubmitLoader(state),
});

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  _resetMessages: () => dispatch(resetMessages()),
  _setActiveTab: (key: string) => dispatch(setActiveTab(key)),
});
const connector = connect(mapStateToProps, mapDispatchToProps);
export default connector(SFIntegration);
