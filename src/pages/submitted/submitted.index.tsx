/* eslint-disable react-hooks/exhaustive-deps */
import React, { Dispatch, useEffect } from 'react';
import { Row, Col, Tabs, message } from 'antd';
import { DollarOutlined, UploadOutlined } from '@ant-design/icons';
import { SubmittedExpense, SubmittedRequest } from './components';
import {
  HeaderBarWrapper,
  ElementOrSkeleton,
  CustomizeTabName,
} from '../../shared/components';
import { MenuItemType, tabs } from './submitted.model';
import './submitted.index.less';
import {
  getSubmittedLoader,
  getSubmittedLoadingMessage,
  getSubmittedSuccess,
  getSubmittedError,
  getSubmittedCount,
  getSubmittedCountLoader,
  isProxyPermissionAllowed,
  getIsBenefitEnabled,
  getCurrentDelegateUser,
  getPermissions,
} from '../../shared/redux/rootReducer';
import {
  setError,
  setSuccess,
  resetSubmittedToInitial,
  resetSpecificSubmittedCount,
} from './submitted.action';
import { connect, ConnectedProps } from 'react-redux';
import { fetchSubmittedCount, fetchSubmittedTabData } from './submitted.thunk';
import { NavLink, useHistory, useLocation, useParams } from 'react-router-dom';
import { appPath } from '../app/app.routes';
import { PROXY_PERMISSIONS } from '../delegate/delegate.model';
import SubmittedBenefit from './components/benefit/benefit.index';
import { Trans } from '@lingui/macro';
import axios from 'axios';

let source: any = null;

const Submitted: React.FC<ConnectedProps<typeof connector>> = ({
  error,
  isLoader,
  loadingMessage,
  success,
  currentDelegateUserLoader,
  isSubmittedCountLoading,
  getIsBenefitEnabledLoading,
  submittedCount,
  isBenefitEnabled,
  currentDelegateUser,
  isPermissionAllowed,
  _setError,
  _setSuccess,

  _fetchSubmittedCount,
  _fetchSubmittedData,
  _resetSubmittedToInitial,
  _resetSpecificSubmittedCount,
}) => {
  const params: any = useParams();
  const tab = params.tab;
  const history = useHistory();
  const location: any = useLocation();

  let visibleTabs: tabs[] = [];
  if (!currentDelegateUserLoader) {
    if (isPermissionAllowed('ACTION_EXPENSE')) {
      visibleTabs.push('expense');
    }
    if (isPermissionAllowed('ACTION_REQUEST')) {
      visibleTabs.push('request');
    }
    if (isBenefitEnabled && isPermissionAllowed('ACTION_BENEFIT')) {
      visibleTabs.push('benefit');
    }
    if (isPermissionAllowed('ACTION_EXPENSE')) {
      visibleTabs.push('expenses-with-request' as tabs);
    }
  }

  if (visibleTabs.length === 0 && !getIsBenefitEnabledLoading) {
    history.push(appPath.home.linkTo);
  }

  if (!visibleTabs.includes(tab)) {
    history.push(visibleTabs[0]);
  }

  const _componentDidMount_EffectFn = () => {
    if (!(location.state as any)?.status) {
      let tempTab = tab;
      if (!visibleTabs.includes(tab)) {
        tempTab = visibleTabs[0];
      }
      tempTab && _fetchSubmittedCount(tempTab?.replace(/-/g, '_') as tabs);
    } else {
      _fetchSubmittedCount();
    }
    return () => _resetSubmittedToInitial();
  };
  // useEffect(_componentDidMount_EffectFn, []);

  useEffect(() => {
    _componentDidMount_EffectFn();
  }, [currentDelegateUser, source]);

  useEffect(() => {
    let CancelToken = axios.CancelToken;
    source = CancelToken.source();
  }, []);

  // UNMOUNT //
  useEffect(() => {
    if (!isSubmittedCountLoading) {
      return () => {
        source.cancel();
      };
    }
  }, []);

  useEffect(() => {
    if (isLoader && loadingMessage) {
      message.loading(loadingMessage);
    } else {
      message.destroy();
      _setError();
      _setError();
    }
  }, [isLoader, loadingMessage]);

  useEffect(() => {
    success && message.success(success, 2, _setSuccess);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [success]);

  useEffect(() => {
    error && message.error(error, 2, _setError);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  const menuItems: MenuItemType[] = [
    {
      title: 'New Expense',
      icon: DollarOutlined,
      navigate: appPath.addNewExpense.add.linkTo,
      isVisible: isPermissionAllowed('ACTION_EXPENSE'),
    },
    {
      title: 'New Request',
      icon: UploadOutlined,
      navigate: appPath.addNew.addRequest.linkTo,
      isVisible: isPermissionAllowed('ACTION_REQUEST'),
    },
    {
      title: 'New Benefit',
      icon: UploadOutlined,
      navigate: appPath.benefit.add.benefit.linkTo,
      isVisible: isBenefitEnabled && isPermissionAllowed('ACTION_BENEFIT'),
    },
  ];

  const renderEmptyDataView = () => (
    <div className='empty-view-container'>
      <div className='textContainer'>
        <p className='noExpenseText'>You have no expenses or claims !</p>
        <p className='addText'>Add</p>
      </div>
      <Row
        gutter={20}
        align='middle'
        justify='center'
        style={{ marginTop: '40px' }}
      >
        {menuItems.map(
          item =>
            item.isVisible && (
              <Col>
                <NavLink to={item.navigate} className='menuItemContainer'>
                  <item.icon className='iconStyle' />
                  <p className='titleText'>{item.title}</p>
                </NavLink>
              </Col>
            ),
        )}
      </Row>
    </div>
  );

  const handleTabClick = (key: string | tabs) => {
    if (!isLoader) {
      //  _resetSpecificSubmittedCount(tab);
      _fetchSubmittedData(key.replace(/-/g, '_') as tabs);
      history.push(`${appPath.submitted.linkTo}${key}`);
    }
  };
  const renderSubmittedData = () => {
    return (
      <div className='tabContainer'>
        <Tabs
          tabBarGutter={60}
          onTabClick={handleTabClick}
          activeKey={tab}
          destroyInactiveTabPane
        >
          {isPermissionAllowed('ACTION_EXPENSE') && (
            <Tabs.TabPane
              disabled={isLoader}
              tab={
                <CustomizeTabName
                  icon='.'
                  title={<Trans>Expenses</Trans>}
                  count={submittedCount.expenses}
                />
              }
              key='expense'
              // disabled={isLoader}
            >
              <SubmittedExpense type='expense' />
            </Tabs.TabPane>
          )}
          {isPermissionAllowed('ACTION_EXPENSE') && (
            <Tabs.TabPane
              disabled={isLoader}
              tab={
                <CustomizeTabName
                  icon='.'
                  title={<Trans>Expenses With Request</Trans>}
                  count={submittedCount.expenses_with_requests}
                />
              }
              key='expenses-with-request'
              // disabled={isLoader}
            >
              <SubmittedExpense type='expenses_with_request' />
            </Tabs.TabPane>
          )}
          {isPermissionAllowed('ACTION_REQUEST') && (
            <Tabs.TabPane
              disabled={isLoader}
              tab={
                <CustomizeTabName
                  icon='.'
                  title={<Trans>Requests</Trans>}
                  count={submittedCount.requests}
                />
              }
              // disabled={isLoader}
              key='request'
            >
              <SubmittedRequest />
            </Tabs.TabPane>
          )}
          {isBenefitEnabled && isPermissionAllowed('ACTION_BENEFIT') && (
            <Tabs.TabPane
              disabled={isLoader}
              tab={
                <CustomizeTabName
                  icon='.'
                  title={<Trans>Benefits</Trans>}
                  count={submittedCount.benefits}
                />
              }
              key='benefit'
            >
              <SubmittedBenefit />
            </Tabs.TabPane>
          )}
        </Tabs>
      </div>
    );
  };

  const renderSubmittedView = () => {
    const submittedCountAny = submittedCount as any;
    const recordCount = Object.keys(submittedCountAny).reduce(
      (count, current) => count + submittedCountAny[current],
      0,
    );
    return recordCount === 0 ? renderEmptyDataView() : renderSubmittedData();
  };

  return (
    <HeaderBarWrapper headerCommonProps={{ title: <Trans>Submitted</Trans> }}>
      <div className='submitted-container'>
        {isSubmittedCountLoading ? (
          <div className='skeleton-container'>
            <ElementOrSkeleton isLoading type='table' />
          </div>
        ) : (
          renderSubmittedView()
        )}
      </div>
    </HeaderBarWrapper>
  );
};

const mapStateToProps = (state: any) => {
  const { loader } = state.configuration;
  const { currentDelegateUserLoader } = state.delegates;

  return {
    getIsBenefitEnabledLoading: loader,
    isLoader: getSubmittedLoader(state),
    loadingMessage: getSubmittedLoadingMessage(state),
    success: getSubmittedSuccess(state),
    error: getSubmittedError(state),
    submittedCount: getSubmittedCount(state),
    isSubmittedCountLoading: getSubmittedCountLoader(state),
    currentDelegateUser: getCurrentDelegateUser(state),
    currentDelegateUserLoader,
    isPermissionAllowed: (permission: PROXY_PERMISSIONS) =>
      isProxyPermissionAllowed(state, permission),
    permissions: getPermissions(state),
    isBenefitEnabled: getIsBenefitEnabled(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  _setSuccess: () => dispatch(setSuccess('')),
  _setError: () => dispatch(setError('')),
  _resetSubmittedToInitial: () => dispatch(resetSubmittedToInitial()),
  _fetchSubmittedCount: (tab?: tabs) =>
    dispatch(fetchSubmittedCount(tab, source)),
  _fetchSubmittedData: (tab: tabs, page?: number) =>
    dispatch(
      fetchSubmittedTabData(tab, page, undefined, undefined, undefined, source),
    ),
  _resetSpecificSubmittedCount: (tab: tabs) =>
    dispatch(resetSpecificSubmittedCount(tab)),
});

const connector = connect(mapStateToProps, mapDispatchToProps);

export default connector(Submitted);
