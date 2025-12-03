/* eslint-disable react-hooks/exhaustive-deps */
import React, { Dispatch, useEffect } from 'react';
import { Tabs, message } from 'antd';

import {
  ReportExpense,
  ReportBenefit,
  ReportRequest,
  CashAdvanceRequestReport,
  DownloadModal,
  SpecializedReports,
  SpecializedBenefitReports,
  ReportBenefitEntitlement,
} from './components';

import {
  HeaderBarWrapper,
  CustomizeTabName,
  ElementOrSkeleton,
} from '../../shared/components';
import { tabs } from './reports.model';

import {
  getReportCount,
  getReportCountLoading,
  getPermissions,
  isProxyPermissionAllowed,
  getReportLoader,
  getReportLoadingMessage,
  getReportError,
  getReportSuccess,
  getIsBenefitEnabled,
} from '../../shared/redux/rootReducer';

import { setError, setSuccess } from './reports.action';
import { connect, ConnectedProps } from 'react-redux';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { appPath } from '../app/app.routes';
import { fetchReportTabData, fetchReportCount } from './reports.thunk';
import Store from '../../shared/redux/store/store.index';
import {
  getQueryParametersAsObject,
  generateQueryParamsString,
} from '../../utils/global.utils';
import moment from 'moment';
import ReportBenefitEntitlementUser from './components/benefitEntitlement/benefitEntitlementUser.index';
import './reports.index.less';
import { Trans } from '@lingui/macro';
import axios from 'axios';

let source: any = null;

const defaultFilters = {
  from_date: moment()
    .subtract(1, 'year')
    .format('DD/MM/YYYY'),
  to_date: moment()
    .add(1, 'year')
    .format('DD/MM/YYYY'),
};

const Reports: React.FC<ConnectedProps<typeof connector>> = ({
  error,
  isLoader,
  loadingMessage,
  success,
  permissions,
  getIsBenefitEnabledLoading,
  isReportCountLoading,
  isPermissionAllowed,
  reportCount,
  isBenefitEnabled,
  _setError,
  _setSuccess,
  _fetchReportData,
  _fetchReportCount,
}) => {
  const params: any = useParams();
  const tab = params.tab;
  const history = useHistory();
  const location = useLocation();

  const isBenefitTabCondition = [
    'benefit',
    'specialised-benefit-report',
    'benefit-entitlement',
  ].includes(tab);
  let visibleBenefitTabs = [];
  let visibleExpenseTabs = [];
  const hasViewPermission = () => {
    const specializedReportsPermission = Store.getState().auth?.user
      ?.permissions.VIEW_SPECIALIZED_REPORTS;
    if (specializedReportsPermission !== undefined) {
      return true;
    }
    return false;
  };
  useEffect(() => {
    let CancelToken = axios.CancelToken;
    source = CancelToken.source();
  }, []);

  // UNMOUNT //
  useEffect(() => {
    return () => {
      source.cancel();
    };
  }, []);

  const hasBenefitViewPermission = () => {
    const specializedBenefitReportsPermission = Store.getState().auth?.user
      ?.permissions.VIEW_BENEFITS_SPECIALIZED_REPORTS;
    if (specializedBenefitReportsPermission !== undefined) {
      return true;
    }
    return false;
  };

  if (permissions['VIEW_EXPENSE_REPORTS']) {
    visibleExpenseTabs.push('expense');
  }
  if (permissions['VIEW_REQUEST_REPORTS']) {
    visibleExpenseTabs.push('request');
  }
  if (isBenefitEnabled && permissions['VIEW_BENEFIT_REPORTS']) {
    visibleBenefitTabs.push('benefit');
  }
  if (isBenefitEnabled && permissions['VIEW_BENEFITS_ENTITLEMENT_REPORTS']) {
    visibleBenefitTabs.push('benefit-entitlement');
  }
  if (permissions['VIEW_EXPENSES_WITH_REQUEST_REPORTS']) {
    visibleExpenseTabs.push('expenses-with-request' as tabs);
  }
  if (permissions['VIEW_CASH_ADVANCE_REPORTS']) {
    visibleExpenseTabs.push('cash-advance-request' as tabs);
  }
  if (hasViewPermission() === true) {
    visibleExpenseTabs.push('specialised-report' as tabs);
  }
  if (hasBenefitViewPermission() === true && isBenefitEnabled) {
    visibleBenefitTabs.push('specialised-benefit-report' as tabs);
  }

  if (
    visibleExpenseTabs.length === 0 &&
    visibleBenefitTabs.length === 0 &&
    !getIsBenefitEnabledLoading
  ) {
    history.push(appPath.home.linkTo);
  }
  if (isBenefitTabCondition) {
    if (!visibleBenefitTabs.includes(tab) && visibleBenefitTabs?.length > 0) {
      history.push(visibleBenefitTabs[0]);
    }
  } else {
    if (!visibleExpenseTabs.includes(tab) && visibleExpenseTabs?.length > 0) {
      history.push(visibleExpenseTabs[0]);
    }
  }

  const urlQueryParameters = getQueryParametersAsObject();
  let localFilters =
    (tab as any) === 'specialised-report' ||
    (tab as any) === 'specialised-benefit-report'
      ? {}
      : {
          ...((tab as any) === 'cash-advance-request' ? {} : defaultFilters),
          ...urlQueryParameters,
        };
  let queryString = generateQueryParamsString(localFilters);
  // if (!isBenefitEnabled && tab === 'benefit') {
  //   history.push('/404');
  // }

  useEffect(() => {
    _fetchReportCount(undefined, localFilters);
    history.push(`${location.pathname}?${queryString}`);
  }, []);

  useEffect(() => {
    history.push(`${location.pathname}?${queryString}`);
  }, [location.pathname]);

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
  }, [success]);

  useEffect(() => {
    error && message.error(error, 2, _setError);
  }, [error]);

  const handleTabClick = (key: string | tabs) => {
    if (!isLoader && tab !== key) {
      history.push(`${appPath.reports.linkTo}${key}`);
    }
  };

  const renderReportData = () => {
    return (
      <div className='tabContainer finance-admin-container'>
        <Tabs
          tabBarGutter={60}
          onTabClick={handleTabClick}
          activeKey={tab}
          destroyInactiveTabPane
        >
          {isBenefitTabCondition ? (
            <>
              {isBenefitEnabled && permissions['VIEW_BENEFIT_REPORTS'] && (
                <Tabs.TabPane
                  disabled={isLoader}
                  tab={
                    <CustomizeTabName
                      icon='.'
                      title={<Trans>Benefits</Trans>}
                      count={reportCount.benefits}
                    />
                  }
                  key='benefit'
                >
                  <ReportBenefit
                    source={source}
                    isActive={tab === 'benefit'}
                    defaultFilters={defaultFilters}
                  />
                </Tabs.TabPane>
              )}

              {isBenefitEnabled &&
                permissions['VIEW_BENEFITS_ENTITLEMENT_REPORTS'] && (
                  <Tabs.TabPane
                    disabled={isLoader}
                    tab={
                      <CustomizeTabName
                        icon='.'
                        title={<Trans>Benefit Entitlement</Trans>}
                        count={reportCount.benefit_entitlements}
                      />
                    }
                    key='benefit-entitlement'
                  >
                    <ReportBenefitEntitlement
                      source={source}
                      isActive={tab === 'benefit-entitlement'}
                      defaultFilters={defaultFilters}
                    />
                  </Tabs.TabPane>
                )}

              {hasBenefitViewPermission() === true && isBenefitEnabled ? (
                <Tabs.TabPane
                  disabled={isLoader}
                  tab={
                    <CustomizeTabName
                      title={<Trans>Specialised Benefit Reports</Trans>}
                    />
                  }
                  key='specialised-benefit-report'
                >
                  <SpecializedBenefitReports
                    isActive={(tab as any) === 'specialised-benefit-report'}
                  />
                </Tabs.TabPane>
              ) : null}
            </>
          ) : (
            <>
              {permissions['VIEW_EXPENSE_REPORTS'] && (
                <Tabs.TabPane
                  disabled={isLoader}
                  tab={
                    <CustomizeTabName
                      icon='.'
                      title={<Trans>Expenses</Trans>}
                      count={reportCount.expenses}
                    />
                  }
                  key='expense'
                >
                  <ReportExpense
                    source={source}
                    isActive={tab === 'expense'}
                    defaultFilters={defaultFilters}
                  />
                </Tabs.TabPane>
              )}
              {permissions['VIEW_EXPENSES_WITH_REQUEST_REPORTS'] && (
                <Tabs.TabPane
                  disabled={isLoader}
                  tab={
                    <CustomizeTabName
                      icon='.'
                      title={<Trans>Expenses With Request</Trans>}
                      count={reportCount.expenses_with_requests}
                    />
                  }
                  key='expenses-with-request'
                >
                  <ReportExpense
                    source={source}
                    defaultFilters={defaultFilters}
                    withRequest={true}
                    isActive={(tab as any) === 'expenses-with-request'}
                  />
                </Tabs.TabPane>
              )}
              {permissions['VIEW_REQUEST_REPORTS'] && (
                <Tabs.TabPane
                  disabled={isLoader}
                  tab={
                    <CustomizeTabName
                      icon='.'
                      title={<Trans>Requests</Trans>}
                      count={reportCount.requests}
                    />
                  }
                  key='request'
                >
                  <ReportRequest
                    source={source}
                    isActive={tab === 'request'}
                    defaultFilters={defaultFilters}
                  />
                </Tabs.TabPane>
              )}
              {permissions['VIEW_CASH_ADVANCE_REPORTS'] && (
                <Tabs.TabPane
                  disabled={isLoader}
                  tab={
                    <CustomizeTabName
                      icon='.'
                      title={<Trans>Cash Advance Requests</Trans>}
                      count={reportCount.cash_advance_requests}
                    />
                  }
                  key='cash-advance-request'
                >
                  <CashAdvanceRequestReport
                    source={source}
                    isActive={(tab as any) === 'cash-advance-request'}
                  />
                </Tabs.TabPane>
              )}
              {hasViewPermission() === true ? (
                <Tabs.TabPane
                  disabled={isLoader}
                  tab={
                    <CustomizeTabName
                      title={<Trans>Specialised Reports</Trans>}
                    />
                  }
                  key='specialised-report'
                >
                  <SpecializedReports
                    isActive={(tab as any) === 'specialised-report'}
                  />
                </Tabs.TabPane>
              ) : null}
            </>
          )}
        </Tabs>
        <DownloadModal />
      </div>
    );
  };

  const renderReportView = () => {
    return renderReportData();
  };

  return (
    <>
      {(urlQueryParameters.employee === undefined && (
        <HeaderBarWrapper headerCommonProps={{ title: <Trans>Reports</Trans> }}>
          <div className='reports-container'>
            <ElementOrSkeleton
              type='table'
              tableConfiguration={{
                rows: 15,
                columns: 7,
              }}
              isLoading={isReportCountLoading}
              isActive={true}
            >
              {renderReportView()}
            </ElementOrSkeleton>
          </div>
        </HeaderBarWrapper>
      )) ||
        (urlQueryParameters.employee > 0 && (
          <ReportBenefitEntitlementUser
            defaultFilter={defaultFilters}
            employee={urlQueryParameters.employee}
          />
        ))}
    </>
  );
};

const mapStateToProps = (state: any) => {
  const { loader } = state.configuration;
  return {
    getIsBenefitEnabledLoading: loader,
    isLoader: getReportLoader(state),
    loadingMessage: getReportLoadingMessage(state),
    success: getReportSuccess(state),
    error: getReportError(state),
    reportCount: getReportCount(state),
    isReportCountLoading: getReportCountLoading(state),
    isPermissionAllowed: (permission: any) =>
      isProxyPermissionAllowed(state, permission),
    permissions: getPermissions(state),
    isBenefitEnabled: getIsBenefitEnabled(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  _setSuccess: () => dispatch(setSuccess('')),
  _setError: () => dispatch(setError('')),
  _fetchReportCount: (tab?: tabs, filters?: any) =>
    dispatch(fetchReportCount(tab, source, filters)),
  _fetchReportData: (tab: tabs, page?: number) =>
    dispatch(fetchReportTabData(tab, source, page)),
});

const connector = connect(mapStateToProps, mapDispatchToProps);

export default connector(Reports);
