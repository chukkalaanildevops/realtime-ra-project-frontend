/* eslint-disable react-hooks/exhaustive-deps */
import React, { Dispatch, useEffect, ComponentType } from 'react';

import './inbound.index.less';
import {
  HeaderBarWrapper,
  BackButton,
  ErrorBoundary,
} from '../../shared/components';
import { Tabs, message } from 'antd';
import { Scheduling } from './components/components.index';
import {
  getInboundLoader,
  getInboundSuccess,
  getInboundError,
  getInboundLoadingMessage,
  getInboundIsDataSaving,
} from '../../shared/redux/rootReducer';
import { connect, ConnectedProps } from 'react-redux';
import { resetMessages } from './inbound.action';
import { appPath } from '../app/app.routes';
import { useHistory, useParams } from 'react-router-dom';
import PastJobExecution from './components/pastJobExecution.index';
import { Trans } from '@lingui/macro';
const Inbound: React.FC<ConnectedProps<typeof connector>> = ({
  _resetMessages,
  loader,
  success,
  loadingMessage,
  isDataSaving,
}) => {
  const params: any = useParams();
  const tab = params.tab;
  const history = useHistory();

  useEffect(() => {
    (loader || isDataSaving) && loadingMessage
      ? message.loading(loadingMessage)
      : message.destroy();
  }, [loader, loadingMessage, isDataSaving]);

  useEffect(() => {
    success && message.success(success, 3, () => _resetMessages());
    if (success) {
      setTimeout(() => {
        _resetMessages();
      }, 1000);
    }
  }, [success]);

  // useEffect(() => {
  //   if (error && typeof error === 'string') {
  //     error && message.error(error, 3, () => _resetMessages());
  //   }
  // }, [error]);

  const handleTabClick = (key: string) => {
    history.push(`${appPath.settings.inbound.linkTo}${key}`);
  };

  return (
    <ErrorBoundary>
      <HeaderBarWrapper headerCommonProps={{ title: <Trans>Inbound</Trans> }}>
        <div className='inbound-container'>
          <Tabs
            renderTabBar={(_props: any, DefaultTabBar: ComponentType) => (
              <div className='tabs-with-back-button-container'>
                <BackButton />
                <DefaultTabBar {..._props} />
              </div>
            )}
            activeKey={tab}
            onChange={handleTabClick}
          >
            <Tabs.TabPane key='scheduling' tab={<Trans>Scheduling</Trans>}>
              <Scheduling />
            </Tabs.TabPane>
            <Tabs.TabPane key='stages' tab={<Trans>Past Job Execution</Trans>}>
              <PastJobExecution />
            </Tabs.TabPane>
          </Tabs>
        </div>
      </HeaderBarWrapper>
    </ErrorBoundary>
  );
};

const mapStateToProps = (state: any) => ({
  loader: getInboundLoader(state),
  success: getInboundSuccess(state),
  error: getInboundError(state),
  loadingMessage: getInboundLoadingMessage(state),
  isDataSaving: getInboundIsDataSaving(state),
});

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  _resetMessages: () => dispatch(resetMessages()),
});
const connector = connect(mapStateToProps, mapDispatchToProps);
export default connector(Inbound);
