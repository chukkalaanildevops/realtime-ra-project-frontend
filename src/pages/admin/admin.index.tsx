import React, { Dispatch, memo, useEffect } from 'react';
import { HeaderBarWrapper, CustomizeTabName } from '../../shared/components';
import { setActiveTab, fetchDataItemsCount } from './admin.thunk';
import './admin.index.less';
import { Tabs } from 'antd';
import { appPath } from '../app/app.routes';
import { connect, ConnectedProps } from 'react-redux';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import {
  stateInterface,
  getIsBenefitEnabled,
  getIsPettyCashEnabled,
  getIsAllowanceEnabled,
  getPermissions,
} from '../../shared/redux/rootReducer';
import UserDataView from './userDataView.index';
import { LoadingOutlined } from '@ant-design/icons';
import AggregatedDataView from './aggregatedView.index';
import ExpenseSettlementOrClosure from './expenseSettlementOrClosure.index';
import {
  generateQueryParamsString,
  getQueryParametersAsObject,
  removeParamsFromObject,
} from '../../utils/global.utils';
import {
  IAdminDataRequestParameters,
  IAdminItemTypes,
  TupdateSpecificDataItemsCount,
} from './admin.models';
import {
  updateSpecifcDataItemsCount,
  resetSpecificDataItemsCount,
} from './admin.actions';
import moment from 'moment';
import BenefitSettlementOrClosure from './BenefitSettlementOrClosure.index';
import { Trans } from '@lingui/macro';
import axios from 'axios';

let source: any = null;

const mapStateToProps = (state: stateInterface) => {
  const { activeTabKey, dataItemsCountLoading, itemsCount } = state.admin;
  const { loader } = state.configuration;
  const { tenant } = state.auth;
  return {
    tenant: tenant,
    activeTabKey: activeTabKey,
    dataItemsCountLoading: dataItemsCountLoading,
    itemsCount: itemsCount,
    getIsBenefitEnabledLoading: loader,
    isBenefitsEnabled: getIsBenefitEnabled(state),
    isPettyCashEnabled: getIsPettyCashEnabled(state),
    isAllowanceEnabled: getIsAllowanceEnabled(state),
    permissions: getPermissions(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  return {
    _setActiveTab: (key: string) => dispatch(setActiveTab(key)),
    _fetchDataItemsCount: (
      parameters?: IAdminDataRequestParameters,
      activeTab?: string,
    ) => dispatch(fetchDataItemsCount(parameters, activeTab)),
    _updateSpecificDataItemsCount: ((type, count) =>
      dispatch(
        updateSpecifcDataItemsCount(type, count),
      )) as TupdateSpecificDataItemsCount,
    _resetSpecificDataItemsCount: () => dispatch(resetSpecificDataItemsCount()),
  };
};

const connector = connect(mapStateToProps, mapDispatchToProps);
type TProps = ConnectedProps<typeof connector>;

const Admin: React.FC<TProps> = props => {
  const {
    tenant,
    activeTabKey,
    dataItemsCountLoading,
    itemsCount,
    getIsBenefitEnabledLoading,
    isBenefitsEnabled,
    permissions,
    _setActiveTab,
    _fetchDataItemsCount,
    _updateSpecificDataItemsCount,
    // _resetSpecificDataItemsCount,
  } = props;
  const location = useLocation();
  const { push } = useHistory();
  const { replace } = useHistory();
  const params: any = useParams();
  const Tab = params.tab;
  const isBenefitTabCondition =
    Tab === 'benefits' ||
    Tab === 'benefit-settlement' ||
    Tab === 'benefit-entitlement'
      ? true
      : false;
  const isAdminCashAdvanceRequestAcitveTab =
    params.tab === 'cash-advance-requests' ||
    activeTabKey === 'cash-advance-requests';

  const urlQueryParameters = removeParamsFromObject(
    getQueryParametersAsObject(),
    ['from_date', 'to_date'],
    isAdminCashAdvanceRequestAcitveTab,
  );

  let initialFilters: { [x: string]: any };

  const defaultFilter = removeParamsFromObject(
    {
      from_date: moment()
        .subtract(1, 'year')
        .format('DD/MM/YYYY'),
      to_date: moment()
        .add(1, 'year')
        .format('DD/MM/YYYY'),
    },
    ['from_date', 'to_date'],
    isAdminCashAdvanceRequestAcitveTab,
  );

  initialFilters = {
    ...defaultFilter,
    ...urlQueryParameters,
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

  let initialFilterQueryString = generateQueryParamsString(initialFilters);

  const EXPENSE_CLAIMS_PATH = 'expenses';
  const REQUEST_PATH = 'requests';
  const EXPENSES_WITH_REQUEST_PATH = 'expenses-with-requests';
  const CASH_ADVANCE_REQUESTS_PATH = 'cash-advance-requests';
  const EXPENSE_SETTLEMENT_PATH = 'expense-settlement';
  const REQUEST_CLOSURE_PATH = 'request-posting';
  const BENEFITS_PATH = 'benefits';
  const BENEFIT_SETTLEMENT_PATH = 'benefit-settlement';
  const BENEFIT_ENTITLEMENT_PATH = 'benefit-entitlement';
  const EXPENSE_ENTITLEMENT_PATH = 'expense-entitlement';

  let visibleBenefitTabs = [];
  let visibleExpenseTabs = [];
  const showExpenseEntitlement =
    tenant === 'parkwayt' || tenant === 'parkway' ? false : true;
  // benefits
  if (isBenefitsEnabled && permissions['VIEW_ADMIN_BENEFITS']) {
    visibleBenefitTabs.push('benefits');
  }
  if (
    isBenefitsEnabled &&
    permissions['ACTION_ADMIN_EXECUTE_BENEFIT_CLAIM_SETTLEMENT']
  ) {
    visibleBenefitTabs.push('benefit-settlement');
  }
  if (isBenefitsEnabled) {
    visibleBenefitTabs.push('benefit-entitlement');
  }
  // expenses
  if (permissions['VIEW_ADMIN_EXPENSES']) {
    visibleExpenseTabs.push('expenses');
  }
  if (permissions['VIEW_ADMIN_EXPENSES_WITH_REQUESTS']) {
    visibleExpenseTabs.push('expenses-with-requests');
  }
  if (permissions['VIEW_ADMIN_REQUESTS']) {
    visibleExpenseTabs.push('requests');
  }
  if (permissions['VIEW_ADMIN_CASH_ADVANCE_REQUESTS']) {
    visibleExpenseTabs.push('cash-advance-requests');
  }
  if (permissions['ACTION_ADMIN_EXECUTE_CLAIM_SETTLEMENT']) {
    visibleExpenseTabs.push('expense-settlement');
  }
  if (permissions['ACTION_ADMIN_EXECUTE_REQUEST_POSTING']) {
    visibleExpenseTabs.push('request-posting');
  }
  if (showExpenseEntitlement) {
    visibleExpenseTabs.push('expense-entitlement');
  }
  if (
    visibleExpenseTabs.length === 0 &&
    visibleBenefitTabs.length === 0 &&
    !getIsBenefitEnabledLoading
  ) {
    push(appPath.home.linkTo);
  }
  if (isBenefitTabCondition) {
    if (!visibleBenefitTabs.includes(Tab) && visibleBenefitTabs?.length > 0) {
      push(visibleBenefitTabs[0]);
    }
  } else {
    if (!visibleExpenseTabs.includes(Tab) && visibleExpenseTabs?.length > 0) {
      push(visibleExpenseTabs[0]);
    }
  }

  useEffect(() => {
    let pathname = appPath.admin.linkTo;
    const id = params.tab;
    // let queryString = generateQueryParamsString(urlQueryParameters);
    if (urlQueryParameters.employee === undefined) {
      if (!id) {
        _setActiveTab(EXPENSE_CLAIMS_PATH);
        replace(
          `${appPath.admin.linkTo}${EXPENSE_CLAIMS_PATH}?${initialFilterQueryString}`,
        );
      } else {
        _setActiveTab(id);
        if (initialFilterQueryString.length > 1) {
          push(`${pathname}${id}?${initialFilterQueryString}`);
        }
      }
    } else {
      _setActiveTab(id ? id : EXPENSE_CLAIMS_PATH);
    }

    // eslint-disable-next-line
  }, [location.pathname, activeTabKey]);

  useEffect(() => {
    if (urlQueryParameters.employee === undefined) {
      let _initialFilters = removeParamsFromObject(
        initialFilters,
        ['from_date', 'to_date'],
        true,
      );

      if (
        Object.keys(urlQueryParameters).length > 0 ||
        params?.tab === CASH_ADVANCE_REQUESTS_PATH
      ) {
        let item: IAdminItemTypes;

        switch (activeTabKey) {
          case BENEFITS_PATH:
            item = 'benefit';
            break;
          case BENEFIT_SETTLEMENT_PATH:
            item = 'benefit';
            break;
          case BENEFIT_ENTITLEMENT_PATH:
            item = 'benefit_entitlement';
            break;
          case EXPENSE_CLAIMS_PATH:
            item = 'expense';
            break;
          case EXPENSES_WITH_REQUEST_PATH:
            item = 'expenses_with_request';
            break;
          case REQUEST_PATH:
            item = 'request';
            break;
          case CASH_ADVANCE_REQUESTS_PATH:
            item = 'cash_advance_request';
            break;
          case EXPENSE_ENTITLEMENT_PATH:
            item = 'expense_entitlement';
            break;
          case EXPENSE_SETTLEMENT_PATH:
            item = 'expense_settlement';
            break;

          case REQUEST_CLOSURE_PATH:
            item = 'request_posting';
            break;
          default:
            item = 'expense';
            break;
        }
        _fetchDataItemsCount(
          {
            function: 'count',
            item: item,
            ..._initialFilters,
          },
          params?.tab || EXPENSE_CLAIMS_PATH,
        );
      } else {
        _fetchDataItemsCount(
          {
            function: 'count',
            ..._initialFilters,
          },
          EXPENSE_CLAIMS_PATH,
        );
      }
    }
    // eslint-disable-next-line
  }, []);

  const getTabOptions = () => {
    if (isBenefitTabCondition) {
      return (
        <>
          {isBenefitsEnabled && permissions['VIEW_ADMIN_BENEFITS'] && (
            <Tabs.TabPane
              key={BENEFITS_PATH}
              tab={
                <CustomizeTabName
                  title={<Trans>Benefits</Trans>}
                  icon='.'
                  count={
                    dataItemsCountLoading ? (
                      <LoadingOutlined />
                    ) : (
                      itemsCount.benefits
                    )
                  }
                />
              }
            >
              <AggregatedDataView
                source={source}
                item='benefit'
                isActiveTab={activeTabKey === BENEFITS_PATH}
                fetchDataItemsCount={(
                  parameters?: IAdminDataRequestParameters,
                ) => _fetchDataItemsCount(parameters)}
                _updateSpecificDataItemsCount={_updateSpecificDataItemsCount}
                activeTabKey={activeTabKey}
              />
            </Tabs.TabPane>
          )}
          {isBenefitsEnabled &&
            permissions['ACTION_ADMIN_EXECUTE_BENEFIT_CLAIM_SETTLEMENT'] && (
              <Tabs.TabPane
                key={BENEFIT_SETTLEMENT_PATH}
                tab={
                  <CustomizeTabName
                    title={<Trans>Benefit Settlement</Trans>}
                    icon='.'
                    count={
                      dataItemsCountLoading ? (
                        <LoadingOutlined />
                      ) : (
                        itemsCount.benefitSettlements
                      )
                    }
                  />
                }
              >
                <BenefitSettlementOrClosure
                  source={source}
                  item='benefit_settlement'
                  defaultFilter={defaultFilter}
                  fetchDataItemsCount={(
                    parameters?: IAdminDataRequestParameters,
                  ) => _fetchDataItemsCount(parameters)}
                  _updateSpecificDataItemsCount={_updateSpecificDataItemsCount}
                  activeTabKey={activeTabKey}
                />
              </Tabs.TabPane>
            )}
          {isBenefitsEnabled && (
            <Tabs.TabPane
              key={BENEFIT_ENTITLEMENT_PATH}
              tab={
                <CustomizeTabName
                  title={<Trans>Benefit Entitlement</Trans>}
                  icon='.'
                  count={
                    dataItemsCountLoading ? (
                      <LoadingOutlined />
                    ) : (
                      itemsCount.benefitEntitlement
                    )
                  }
                />
              }
            >
              <AggregatedDataView
                source={source}
                item='benefit_entitlement'
                defaultFilter={defaultFilter}
                isActiveTab={activeTabKey === BENEFIT_ENTITLEMENT_PATH}
                fetchDataItemsCount={(
                  parameters?: IAdminDataRequestParameters,
                ) => _fetchDataItemsCount(parameters)}
                _updateSpecificDataItemsCount={_updateSpecificDataItemsCount}
                activeTabKey={activeTabKey}
              />
            </Tabs.TabPane>
          )}
          )
        </>
      );
    } else {
      return (
        <>
          {permissions['VIEW_ADMIN_EXPENSES'] && (
            <Tabs.TabPane
              key={EXPENSE_CLAIMS_PATH}
              tab={
                <CustomizeTabName
                  title={<Trans>Expenses</Trans>}
                  icon='.'
                  count={
                    dataItemsCountLoading ? (
                      <LoadingOutlined />
                    ) : (
                      itemsCount.expenses
                    )
                  }
                />
              }
            >
              <AggregatedDataView
                source={source}
                item='expense'
                defaultFilter={defaultFilter}
                isActiveTab={activeTabKey === EXPENSE_CLAIMS_PATH}
                fetchDataItemsCount={(
                  parameters?: IAdminDataRequestParameters,
                ) => _fetchDataItemsCount(parameters)}
                _updateSpecificDataItemsCount={_updateSpecificDataItemsCount}
                activeTabKey={activeTabKey}
              />
            </Tabs.TabPane>
          )}
          ​
          {permissions['VIEW_ADMIN_EXPENSES_WITH_REQUESTS'] && (
            <Tabs.TabPane
              key={EXPENSES_WITH_REQUEST_PATH}
              tab={
                <CustomizeTabName
                  title={<Trans>Expenses With Request</Trans>}
                  icon='.'
                  count={
                    dataItemsCountLoading ? (
                      <LoadingOutlined />
                    ) : (
                      itemsCount.expensesWithRequests
                    )
                  }
                />
              }
            >
              <AggregatedDataView
                source={source}
                item='expenses_with_request'
                defaultFilter={defaultFilter}
                isActiveTab={activeTabKey === EXPENSES_WITH_REQUEST_PATH}
                fetchDataItemsCount={(
                  parameters?: IAdminDataRequestParameters,
                ) => _fetchDataItemsCount(parameters)}
                _updateSpecificDataItemsCount={_updateSpecificDataItemsCount}
                activeTabKey={activeTabKey}
              />
            </Tabs.TabPane>
          )}
          ​
          {permissions['VIEW_ADMIN_REQUESTS'] && (
            <Tabs.TabPane
              key={REQUEST_PATH}
              tab={
                <CustomizeTabName
                  title={<Trans>Requests</Trans>}
                  icon='.'
                  count={
                    dataItemsCountLoading ? (
                      <LoadingOutlined />
                    ) : (
                      itemsCount.requests
                    )
                  }
                />
              }
            >
              <AggregatedDataView
                source={source}
                item='request'
                defaultFilter={defaultFilter}
                isActiveTab={activeTabKey === REQUEST_PATH}
                fetchDataItemsCount={(
                  parameters?: IAdminDataRequestParameters,
                ) => _fetchDataItemsCount(parameters)}
                _updateSpecificDataItemsCount={_updateSpecificDataItemsCount}
                activeTabKey={activeTabKey}
              />
            </Tabs.TabPane>
          )}
          ​
          {permissions['VIEW_ADMIN_CASH_ADVANCE_REQUESTS'] && (
            <Tabs.TabPane
              key={CASH_ADVANCE_REQUESTS_PATH}
              tab={
                <CustomizeTabName
                  title={<Trans>Cash Advance Requests</Trans>}
                  icon='.'
                  count={
                    dataItemsCountLoading ? (
                      <LoadingOutlined />
                    ) : (
                      itemsCount.cashAdvanceRequests
                    )
                  }
                />
              }
            >
              <AggregatedDataView
                source={source}
                item='cash_advance_request'
                isActiveTab={activeTabKey === CASH_ADVANCE_REQUESTS_PATH}
                fetchDataItemsCount={(
                  parameters?: IAdminDataRequestParameters,
                ) => _fetchDataItemsCount(parameters)}
                _updateSpecificDataItemsCount={_updateSpecificDataItemsCount}
                activeTabKey={activeTabKey}
              />
            </Tabs.TabPane>
          )}
          ​
          {permissions['ACTION_ADMIN_EXECUTE_CLAIM_SETTLEMENT'] && (
            <Tabs.TabPane
              key={EXPENSE_SETTLEMENT_PATH}
              tab={
                <CustomizeTabName
                  title={<Trans>Expense Settlement</Trans>}
                  icon='.'
                  count={
                    dataItemsCountLoading ? (
                      <LoadingOutlined />
                    ) : (
                      itemsCount.expenseSettlements
                    )
                  }
                />
              }
            >
              <ExpenseSettlementOrClosure
                source={source}
                item='expense_settlement'
                defaultFilter={defaultFilter}
                fetchDataItemsCount={(
                  parameters?: IAdminDataRequestParameters,
                ) => _fetchDataItemsCount(parameters)}
                _updateSpecificDataItemsCount={_updateSpecificDataItemsCount}
                activeTabKey={activeTabKey}
              />
            </Tabs.TabPane>
          )}
          {permissions['ACTION_ADMIN_EXECUTE_REQUEST_POSTING'] && (
            <Tabs.TabPane
              key={REQUEST_CLOSURE_PATH}
              tab={
                <CustomizeTabName
                  title={<Trans>Request Posting</Trans>}
                  icon='.'
                  count={
                    dataItemsCountLoading ? (
                      <LoadingOutlined />
                    ) : (
                      itemsCount.requestClosures
                    )
                  }
                />
              }
            >
              <ExpenseSettlementOrClosure
                source={source}
                key={REQUEST_CLOSURE_PATH}
                item='request_posting'
                defaultFilter={defaultFilter}
                fetchDataItemsCount={(
                  parameters?: IAdminDataRequestParameters,
                ) => _fetchDataItemsCount(parameters)}
                _updateSpecificDataItemsCount={_updateSpecificDataItemsCount}
                activeTabKey={activeTabKey}
              />
            </Tabs.TabPane>
          )}
          {showExpenseEntitlement && (
            <Tabs.TabPane
              key={EXPENSE_ENTITLEMENT_PATH}
              tab={
                <CustomizeTabName
                  title={<Trans>Expense Entitlement</Trans>}
                  icon='.'
                  count={
                    dataItemsCountLoading ? (
                      <LoadingOutlined />
                    ) : (
                      itemsCount.expenseEntitlement
                    )
                  }
                />
              }
            >
              <AggregatedDataView
                source={source}
                item='expense_entitlement'
                defaultFilter={defaultFilter}
                isActiveTab={activeTabKey === EXPENSE_ENTITLEMENT_PATH}
                fetchDataItemsCount={(
                  parameters?: IAdminDataRequestParameters,
                ) => _fetchDataItemsCount(parameters)}
                _updateSpecificDataItemsCount={_updateSpecificDataItemsCount}
                activeTabKey={activeTabKey}
              />
            </Tabs.TabPane>
          )}
        </>
      );
    }
  };
  return (
    <>
      {(urlQueryParameters.employee === undefined && (
        <HeaderBarWrapper headerCommonProps={{ title: <Trans>Admin</Trans> }}>
          <div className='finance-admin-container'>
            <Tabs
              activeKey={activeTabKey}
              defaultActiveKey={EXPENSE_CLAIMS_PATH}
              onTabClick={(key: string, _event: any) => {
                let queryParams = removeParamsFromObject(
                  defaultFilter,
                  ['from_date', 'to_date'],
                  key === 'cash-advance-requests',
                );
                // _resetSpecificDataItemsCount();
                push(
                  `${appPath.admin.linkTo}${key}?${generateQueryParamsString(
                    queryParams,
                  )}`,
                );
              }}
              destroyInactiveTabPane
            >
              {getTabOptions()}
            </Tabs>
          </div>
        </HeaderBarWrapper>
      )) ||
        (urlQueryParameters.employee > 0 && (
          <UserDataView
            source={source}
            defaultFilter={defaultFilter}
            employee={urlQueryParameters.employee}
          />
        ))}
    </>
  );
};

export default connector(memo(Admin));
