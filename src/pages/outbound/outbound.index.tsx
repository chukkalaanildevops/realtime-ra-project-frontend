/* eslint-disable react-hooks/exhaustive-deps */
import React, { Dispatch, useEffect, ComponentType } from 'react';

import './outbound.index.less';
import {
  HeaderBarWrapper,
  BackButton,
  ErrorBoundary,
} from '../../shared/components';
import { Tabs, message } from 'antd';
import { Scheduling } from './components/components.index';
import {
  getOutboundLoader,
  getOutboundSuccess,
  getOutboundError,
  getOutboundLoadingMessage,
  getOutboundDataSaveLoader,
} from '../../shared/redux/rootReducer';
import { connect, ConnectedProps } from 'react-redux';
import { resetMessages } from './outbound.action';
import { appPath } from '../app/app.routes';
import { useHistory, useParams } from 'react-router-dom';
import { Trans } from '@lingui/macro';
const Outbound: React.FC<ConnectedProps<typeof connector>> = ({
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
    history.push(`${appPath.settings.outbound.linkTo}${key}`);
  };

  return (
    <ErrorBoundary>
      <HeaderBarWrapper headerCommonProps={{ title: <Trans>Outbound</Trans> }}>
        <div className='outbound-container'>
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
          </Tabs>
        </div>
      </HeaderBarWrapper>
    </ErrorBoundary>
  );
};

const mapStateToProps = (state: any) => ({
  loader: getOutboundLoader(state),
  success: getOutboundSuccess(state),
  error: getOutboundError(state),
  loadingMessage: getOutboundLoadingMessage(state),
  isDataSaving: getOutboundDataSaveLoader(state),
});

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  _resetMessages: () => dispatch(resetMessages()),
});
const connector = connect(mapStateToProps, mapDispatchToProps);
export default connector(Outbound);
