/* eslint-disable react-hooks/exhaustive-deps */
import React, { Dispatch, useEffect } from 'react';
import { Row, Col, Tabs } from 'antd';

import {
  DollarOutlined,
  GiftOutlined,
  ScanOutlined,
  UploadOutlined,
} from '@ant-design/icons';

import { DraftRequest, DraftExpense, DraftReceipt } from './components/';
import DraftBenefit from './components/benefit/benefit.index';
import {
  HeaderBarWrapper,
  ElementOrSkeleton,
  // NoData,
  ErrorBoundary,
  CustomizeTabName,
} from '../../shared/components/';
import { MenuItemType, tabs } from './draft.model';
import './draft.index.less';
import {
  getDraftsLoader,
  getDraftRequests,
  isDraftDataAvailable,
  getDraftExpenses,
  getDraftReceipts,
  getDraftBenefits,
  getDraftCount,
  getDraftCountLoader,
  getIsBenefitEnabled,
  isProxyPermissionAllowed,
} from '../../shared/redux/rootReducer';

import {
  resetDraftToInitial,
  resetSpecificSubmittedCount,
} from '../draft/drafts.action';
import { connect, ConnectedProps } from 'react-redux';
import { fetchDraftsCount, fetchDraftsTabData } from './drafts.thunk';
import { NavLink, useHistory, useLocation, useParams } from 'react-router-dom';
import { appPath } from '../app/app.routes';
import { PROXY_PERMISSIONS } from '../delegate/delegate.model';
import { Trans } from '@lingui/macro';
import axios from 'axios';

let source: any = null;

const Draft: React.FC<ConnectedProps<typeof connector>> = ({
  isLoader,
  getIsBenefitEnabledLoading,
  currentDelegateUserLoader,
  isDraftCountLoading,
  _resetDraftToInitial,
  _fetchDraftCount,
  _fetchDraftData,
  draftCount,
  isBenefitEnabled,
  isPermissionAllowed,
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
    if (isPermissionAllowed('ACTION_RECEIPT')) {
      visibleTabs.push('receipt');
    }
  }

  if (visibleTabs.length === 0 && !getIsBenefitEnabledLoading) {
    history.push(appPath.home.linkTo);
  }
  if (!visibleTabs.includes(tab)) {
    history.push(visibleTabs[0]);
  }
  const _componentDidMount_EffectFn = () => {
    if ((location.state as any)?.page) {
      _fetchDraftCount();
    } else {
      let tempTab = tab;
      if (!visibleTabs.includes(tab)) {
        tempTab = visibleTabs[0];
      }
      tempTab && _fetchDraftCount(tempTab?.replace(/-/g, '_') as tabs);
    }

    return () => {
      //componentWillUnmount
      _resetDraftToInitial();
    };
  };
  useEffect(_componentDidMount_EffectFn, [source]);

  useEffect(() => {
    let CancelToken = axios.CancelToken;
    source = CancelToken.source();
  }, []);

  // UNMOUNT //
  useEffect(() => {
    if (!isDraftCountLoading) {
      return () => {
        source.cancel();
      };
    }
  }, []);
  const menuItems: MenuItemType[] = [
    {
      title: <Trans>New Expense</Trans>,
      icon: DollarOutlined,
      navigate: appPath.addNewExpense.add.linkTo,
      isVisible: isPermissionAllowed('ACTION_EXPENSE'),
    },
    {
      title: <Trans>New Request</Trans>,
      icon: UploadOutlined,
      navigate: appPath.addNew.addRequest.linkTo,
      isVisible: isPermissionAllowed('ACTION_REQUEST'),
    },
    {
      title: <Trans>New Receipt</Trans>,
      icon: ScanOutlined,
      navigate: appPath.receipt.add.linkTo,
      isVisible: isPermissionAllowed('ACTION_RECEIPT'),
    },
    {
      title: <Trans>Claim Benefit</Trans>,
      icon: GiftOutlined,
      navigate: appPath.benefit.add.benefit.linkTo,
      isVisible: isBenefitEnabled && isPermissionAllowed('ACTION_BENEFIT'),
    },
  ];

  const renderEmptyDataView = () => (
    <div className='empty-view-container'>
      <div className='textContainer'>
        <p className='noExpenseText'>
          <Trans>You have no expenses or claims !</Trans>
        </p>
        <p className='addText'>
          <Trans>Add</Trans>
        </p>
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
      // _resetSpecificSubmittedCount(tab);
      _fetchDraftData(key.replace(/-/g, '_') as tabs);
      history.push(`${appPath.drafts.linkTo}${key}`);
    }
  };

  const renderDraftsData = () => {
    return (
      <div className='tabContainer'>
        <Tabs
          tabBarGutter={60}
          activeKey={tab}
          onTabClick={handleTabClick}
          destroyInactiveTabPane
        >
          {isPermissionAllowed('ACTION_EXPENSE') && (
            <Tabs.TabPane
              disabled={isLoader}
              tab={
                <CustomizeTabName
                  icon='.'
                  title={<Trans>Expenses</Trans>}
                  count={draftCount.expenses}
                />
              }
              key='expense'
            >
              <DraftExpense type='expense' source={source} />
            </Tabs.TabPane>
          )}
          {isPermissionAllowed('ACTION_EXPENSE') && (
            <Tabs.TabPane
              disabled={isLoader}
              tab={
                <CustomizeTabName
                  icon='.'
                  title={<Trans>Expenses With Request</Trans>}
                  count={draftCount.expenses_with_requests}
                />
              }
              key='expenses-with-request'
            >
              <DraftExpense type='expenses_with_request' />
            </Tabs.TabPane>
          )}
          {isPermissionAllowed('ACTION_REQUEST') && (
            <Tabs.TabPane
              disabled={isLoader}
              tab={
                <CustomizeTabName
                  icon='.'
                  title={<Trans>Requests</Trans>}
                  count={draftCount.requests}
                />
              }
              key='request'
            >
              <DraftRequest />
            </Tabs.TabPane>
          )}
          {isBenefitEnabled && isPermissionAllowed('ACTION_BENEFIT') && (
            <Tabs.TabPane
              disabled={isLoader}
              tab={
                <CustomizeTabName
                  icon='.'
                  title={<Trans>Benefits</Trans>}
                  count={draftCount.benefits}
                />
              }
              key='benefit'
            >
              <DraftBenefit />
            </Tabs.TabPane>
          )}
          {isPermissionAllowed('ACTION_RECEIPT') && (
            <Tabs.TabPane
              disabled={isLoader}
              tab={
                <CustomizeTabName
                  icon='.'
                  title={<Trans>Receipts</Trans>}
                  count={draftCount.receipts}
                />
              }
              key='receipt'
              // disabled={isLoader}
            >
              <DraftReceipt />
            </Tabs.TabPane>
          )}
        </Tabs>
      </div>
    );
  };

  const renderDraftView = () => {
    const draftCountAny = draftCount as any;
    const recordCount = Object.keys(draftCountAny).reduce(
      (count, current) => count + draftCountAny[current],
      0,
    );
    return recordCount === 0 ? renderEmptyDataView() : renderDraftsData();
  };

  return (
    <ErrorBoundary>
      <HeaderBarWrapper headerCommonProps={{ title: <Trans>Drafts</Trans> }}>
        <div className='drafts-container'>
          {isDraftCountLoading ? (
            <div className='skeleton-container'>
              <ElementOrSkeleton isLoading type='table' />
            </div>
          ) : (
            renderDraftView()
          )}
        </div>
      </HeaderBarWrapper>
    </ErrorBoundary>
  );
};

const mapStateToProps = (state: any) => {
  const { loader } = state.configuration;
  const { currentDelegateUserLoader } = state.delegates;

  return {
    getIsBenefitEnabledLoading: loader,
    currentDelegateUserLoader,
    isLoader: getDraftsLoader(state),
    isDataAvailable: isDraftDataAvailable(state),
    requestData: getDraftRequests(state),
    expenseData: getDraftExpenses(state),
    receiptData: getDraftReceipts(state),
    benefitsData: getDraftBenefits(state),
    draftCount: getDraftCount(state),
    isDraftCountLoading: getDraftCountLoader(state),
    isBenefitEnabled: getIsBenefitEnabled(state),
    isPermissionAllowed: (permission: PROXY_PERMISSIONS) =>
      isProxyPermissionAllowed(state, permission),
  };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  _resetDraftToInitial: () => dispatch(resetDraftToInitial()),
  _fetchDraftCount: (tab?: tabs) => dispatch(fetchDraftsCount(tab, source)),
  _fetchDraftData: (tab: tabs, page?: number) =>
    dispatch(fetchDraftsTabData(tab, page, undefined, undefined, source)),
  _resetSpecificSubmittedCount: (tab: tabs) =>
    dispatch(resetSpecificSubmittedCount(tab)),
});

const connector = connect(mapStateToProps, mapDispatchToProps);

export default connector(Draft);
