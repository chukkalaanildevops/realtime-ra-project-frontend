import React, { useEffect, Dispatch, memo, useState } from 'react';
import './approvals.index.less';
import RequestDetail from '../request/detail/requestDetail.index';
import BenefitDetail from '../benefits/benefitDetail/benefitDetail.index';
import ExpenseCollapseGroup from './components/expense/collapseGroup/collapseGroup.index';
import RequestCollapseGroup from './components/request/collapseGroup/collapseGroup.index';
import BenefitCollapseGroup from './components/benefit/collapseGroup/collapseGroup.index';
import BrokenLink from '../../shared/components/brokenLink/brokenLink.index';
import ClaimDetails from '../addNewExpense/claimDetails/claimDetails.index';
import { appPath } from '../app/app.routes';
import {
  LoadingOutlined,
  RightOutlined,
  DownOutlined,
  FilterOutlined,
} from '@ant-design/icons';
import { connect, ConnectedProps } from 'react-redux';
import { fetchWorkFlowData } from '../app/app.thunk';
import { IWorkflowStatus } from '../../shared/model';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { useParams, useHistory, useLocation } from 'react-router-dom';
import { IfetchWorkFlowDataProps } from '../app/app.model';
import {
  stateInterface,
  getIsBenefitEnabled,
  isProxyPermissionAllowed,
  getCurrentDelegateUser,
} from '../../shared/redux/rootReducer';

import {
  HeaderBarWrapper,
  CustomizeTabName,
  NoData,
  ErrorBoundary,
  AppDrawer,
  StatusTag,
  ElementOrSkeleton,
  DataFilter,
} from '../../shared/components';

import { Tabs, Checkbox, Button } from 'antd';
import { fetchRequestDetailsById } from '../requestTypeConfiguration/requestTypeConfiguration.thunk';
import {
  respondToApprovalItems,
  setActiveTab,
  fetchApprovalItems,
  fetchApprovalItemCounts,
  respondToBulkApprovalItems,
} from './approvals.thunk';
import {
  IApprovalResponseData,
  IItemTypes,
  IApprovalItemsRequestParameters,
  IBulkApprovalResponseData,
} from './approvals.model';
import { ExpensesWithRequestCollapseGroup } from './components/expensesWithRequest/collapseGroup/collapseGroup.index';
import { PROXY_PERMISSIONS } from '../delegate/delegate.model';
import {
  generateQueryParamsString,
  getQueryParametersAsObject,
  isPendingStatusInQuery,
} from '../../utils/global.utils';
import moment from 'moment';
import { Trans } from '@lingui/macro';
import axios from 'axios';

let source: any = null;

const mapStateToProps = (state: stateInterface) => {
  const {
    pendingItemsCount,
    expenseApprovalItems,
    expensesWithRequestApprovalItems,
    requestApprovalItems,
    benefitApprovalItems,
    approvalItemsLoading,
    approvalItemsCountLoading,
    activeTabKey,
    serviceCallFailed,
    paginationData,
    isLoading,
  } = state.approvals;
  const {
    tenantConfig,
    isEnableTrafficLightFeatureForTenantFeatures,
  } = state.configuration;
  return {
    pendingItemsCount,
    tenantConfig,
    expenseApprovalItems,
    expensesWithRequestApprovalItems,
    requestApprovalItems,
    benefitApprovalItems,
    approvalItemsLoading,
    approvalItemsCountLoading,
    activeTabKey,
    serviceCallFailed,
    getIsBenefitsEnabled: getIsBenefitEnabled(state),
    currentDelegateUser: getCurrentDelegateUser(state),
    isPermissionAllowed: (permission: PROXY_PERMISSIONS) =>
      isProxyPermissionAllowed(state, permission),
    paginationData,
    isLoading,
    isEnableTrafficLightFeatureForTenantFeatures,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  return {
    _respondToApprovalItems: (
      data: IApprovalResponseData,
      queryParam: { [x: string]: any } = {},
    ) => dispatch(respondToApprovalItems(data, queryParam)),
    _respondToBulkApprovalItems: (
      data: IBulkApprovalResponseData,
      queryParam: { [x: string]: any } = {},
    ) => dispatch(respondToBulkApprovalItems(data, queryParam)),
    _setActiveTab: (key: string, queryParam?: { [x: string]: any }) =>
      dispatch(setActiveTab(key, queryParam)),
    _fetchWorkFlowData: (props: IfetchWorkFlowDataProps) =>
      dispatch(fetchWorkFlowData(props)),
    _fetchRequestDetailsById: (props: string) =>
      dispatch(fetchRequestDetailsById(props)),
    _fetchApprovalItems: (props: IApprovalItemsRequestParameters) =>
      dispatch(fetchApprovalItems(props, source)),
    _fetchApprovalItemCounts: (props?: IApprovalItemsRequestParameters) =>
      dispatch(fetchApprovalItemCounts(props, source)),
  };
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type TProps = ConnectedProps<typeof connector>;

const Approvals: React.FC<TProps> = props => {
  const {
    approvalItemsLoading,
    pendingItemsCount,
    expenseApprovalItems,
    expensesWithRequestApprovalItems,
    requestApprovalItems,
    benefitApprovalItems,
    approvalItemsCountLoading,
    activeTabKey,
    serviceCallFailed,
    currentDelegateUser,
    paginationData,
    isLoading,
    tenantConfig,
    isEnableTrafficLightFeatureForTenantFeatures,
    isPermissionAllowed,
    _respondToApprovalItems,
    _setActiveTab,
    _fetchWorkFlowData,
    _fetchRequestDetailsById,
    _fetchApprovalItems,
    _fetchApprovalItemCounts,
    _respondToBulkApprovalItems,
  } = props;

  const location = useLocation();
  const tabToTabKeyMap: { [key: string]: string } = {
    expenses: '1',
    requests: '2',
    'expenses-with-request': '3',
    benefits: '4',
  };

  const tabToItemMap: { [key: string]: IItemTypes } = {
    expenses: 'expense',
    requests: 'request',
    'expenses-with-request': 'expenses_with_request',
    benefits: 'benefit',
  };

  const { tab } = useParams<{ tab: string }>();
  const { push } = useHistory();
  const { replace } = useHistory();

  let urlQueryParameters = getQueryParametersAsObject();
  const defaultFilters = {
    page: 1,
    from_date: moment()
      .subtract(1, 'year')
      .format('DD/MM/YYYY'),
    to_date: moment()
      .add(1, 'year')
      .format('DD/MM/YYYY'),
    status: 'PENDNG',
  };
  let status = defaultFilters.status;
  // below code to avoid multiple statuses through query
  if (
    Array.isArray(urlQueryParameters?.status) &&
    urlQueryParameters?.status.length > 0
  ) {
    status = urlQueryParameters?.status[0];
  } else if (typeof urlQueryParameters?.status === 'string') {
    status = urlQueryParameters?.status;
  }

  let initialFilters = {
    ...defaultFilters,
    ...urlQueryParameters,
    status,
  };

  let queryString = generateQueryParamsString(initialFilters);

  const isPendingStatus = isPendingStatusInQuery();

  useEffect(() => {
    // componentDidMount
    let parameters: any = {
      // page: 1,
      // item: item,
      function: 'count',
      ...initialFilters,
      status: defaultFilters.status,
    };
    _fetchApprovalItemCounts(parameters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [source]);

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

  let visibleTabs: string[] = [];
  useEffect(() => {
    if (isPermissionAllowed('ACTION_EXPENSE_APPROVAL')) {
      visibleTabs.push('expenses');
    }
    if (isPermissionAllowed('ACTION_REQUEST_APPROVAL')) {
      visibleTabs.push('requests');
    }
    if (
      props.getIsBenefitsEnabled &&
      isPermissionAllowed('ACTION_BENEFIT_APPROVAL')
    ) {
      visibleTabs.push('benefits');
    }
    if (isPermissionAllowed('ACTION_EXPENSE_APPROVAL')) {
      visibleTabs.push('expenses-with-request');
    }

    if (visibleTabs.length === 0) {
      push(appPath.dashboard.linkTo);
    }
    if (!visibleTabs.includes(tab || 'expenses') && visibleTabs.length > 0) {
      push(`${visibleTabs[0]}/?${queryString}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.getIsBenefitsEnabled, tab]);

  useEffect(() => {
    const filters = {
      ...initialFilters,
      status: defaultFilters.status,
      page: defaultFilters.page,
    };
    const query = generateQueryParamsString(filters);
    if (currentDelegateUser === undefined) {
      if (tab !== undefined) {
        _setActiveTab(tabToTabKeyMap[tab], filters);
        replace(`${appPath.approvals.linkTo}${tab}/?${query}`);
      } else {
        _setActiveTab(activeTabKey, filters);
        replace(`${appPath.approvals.linkTo}expenses/?${query}`);
      }
    } else {
      let tempTab = tab || 'expenses';

      if (!visibleTabs.includes(tempTab) && visibleTabs.length > 0) {
        tempTab = visibleTabs[0];
      }
      _setActiveTab(tabToTabKeyMap[tempTab], filters);
      replace(`${appPath.approvals.linkTo}${tempTab}/?${query}`);
    }
    // eslint-disable-next-line
  }, [currentDelegateUser, tab]);

  const [selectedRows, setSelectedRows] = useState<
    Array<{ [key: string]: any }>
  >([]);

  const [openGroupKeys, setOpenGroupKeys] = useState<string[]>([]);
  const [openSubgroupKeys, setOpenSubgroupKeys] = useState<string[]>([]);
  const [filtersVisible, setFiltersVisible] = useState<boolean>(false);
  const [drawerDetailItem, setDetailDrawer] = useState<{
    visibility: boolean;
    itemType: IItemTypes;
    itemNumber: string;
    workflowStatus: {
      code: string;
      title: string;
    };
    id: number;
    drawerTitle: string;
  } | null>(null);

  const openDetailsDrawer = (
    itemId: number,
    itemNumber: string,
    itemType: IItemTypes,
    workflowStatus: IWorkflowStatus,
    record: any,
  ) => {
    let drawerTitle = '';
    switch (itemType) {
      case 'expense':
        drawerTitle = 'Expense Claim No. #' + itemNumber;
        break;
      case 'request':
        drawerTitle = 'Request No. #' + itemNumber;
        break;
      case 'benefit':
        drawerTitle = 'Benefit Claim No. #' + itemNumber;
        break;
      default:
        break;
    }
    setDetailDrawer({
      visibility: true,
      itemType: itemType,
      itemNumber: itemNumber,
      workflowStatus: workflowStatus,
      id: itemId,
      drawerTitle: drawerTitle,
    });

    if (itemType === 'request') {
      _fetchRequestDetailsById(String(itemId));
    }
  };

  const closeDetailsDrawer = () => {
    setDetailDrawer(null);
  };

  const handleStatusTagClick = (id: number, itemType: IItemTypes) => {
    _fetchWorkFlowData({ id: id, type: itemType });
  };

  const updateSelectedRowsData = (ApprovalItems: any) => {
    let updatedSelected: { [key: string]: any }[] = [];
    ApprovalItems.map((value: any) => {
      let updatedSelectedValue = selectedRows.find(
        selectedValue =>
          parseInt(selectedValue.employee) === parseInt(value.employee.id),
      );
      updatedSelectedValue && updatedSelected.push(updatedSelectedValue);
      return 0;
    });
    if (updatedSelected && updatedSelected.length !== selectedRows.length) {
      setSelectedRows(updatedSelected);
    }
  };

  const getApprovalItems = (item?: IItemTypes) => {
    let tabItem;

    if (tab !== undefined) {
      tabItem = item !== undefined ? item : tabToItemMap[tab];
    }
    switch (tabItem) {
      case 'expense':
        updateSelectedRowsData(expenseApprovalItems);
        return expenseApprovalItems;
      case 'expenses_with_request':
        updateSelectedRowsData(expensesWithRequestApprovalItems);
        return expensesWithRequestApprovalItems;
      case 'request':
        updateSelectedRowsData(requestApprovalItems);
        return requestApprovalItems;
      case 'benefit':
        updateSelectedRowsData(benefitApprovalItems);
        return benefitApprovalItems;
      default:
        return [];
    }
  };

  const toggleSelectAllCheckbox = (isChecked: boolean) => {
    if (isChecked === true) {
      let approvalItems = getApprovalItems();
      setSelectedRows(
        approvalItems.map((record: any) => {
          return { employee: record.employee.id };
        }),
      );
    } else {
      setSelectedRows([]);
    }
  };

  const toggleGroupHeaderCheckbox = (isChecked: boolean, value: number) => {
    let selectedEmployeeIds = selectedRows.map((record: any) => {
      return record.employee;
    });

    if (isChecked === true) {
      if (selectedEmployeeIds.includes(value) === false) {
        setSelectedRows(selectedRows =>
          selectedRows.concat({ employee: value }),
        );
      }
    } else {
      setSelectedRows(selectedRows =>
        selectedRows.filter((record: any) => record.employee !== value),
      );
    }
  };

  const getExpenseIdsForSelectedEmployeeId = (
    employeeId: number,
    item: IItemTypes,
  ) => {
    let approvalItems = getApprovalItems(item);
    let employeeApprovalItems: any = approvalItems.filter(
      (approvalItem: any) => approvalItem.employee.id === employeeId,
    );
    let expenseClaimIds: number[] = [];

    employeeApprovalItems.forEach((item: any) => {
      item.subgroups.forEach((subgroup: any) => {
        expenseClaimIds = expenseClaimIds.concat(
          subgroup.claims.map((claim: any) => {
            return claim.id;
          }),
        );
      });
    });

    return expenseClaimIds;
  };

  const getRequestIdsForSelectedEmployeeId = (employeeId: number) => {
    let employeeApprovalItems: any = requestApprovalItems.filter(
      (approvalItem: any) => approvalItem.employee.id === employeeId,
    );
    let requestIds: number[] = [];

    employeeApprovalItems.forEach((item: any) => {
      item.subgroups.forEach((subgroup: any) => {
        requestIds = requestIds.concat(
          subgroup.requests.map((request: any) => {
            return request.id;
          }),
        );
      });
    });

    return requestIds;
  };

  const getBenefitIdsForSelectedEmployeeId = (employeeId: number) => {
    let employeeApprovalItems: any = benefitApprovalItems.filter(
      (approvalItem: any) => approvalItem.employee.id === employeeId,
    );
    let benefitClaimIds: number[] = [];

    employeeApprovalItems.forEach((item: any) => {
      item.subgroups.forEach((subgroup: any) => {
        benefitClaimIds = benefitClaimIds.concat(
          subgroup.claims.map((claim: any) => {
            return claim.id;
          }),
        );
      });
    });

    return benefitClaimIds;
  };

  const expandAllClickHandler = (approvalItems: any) => {
    const checkVal =
      Boolean(openGroupKeys.length) || Boolean(openSubgroupKeys.length)
        ? false
        : true;
    if (checkVal) {
      const groups: string[] = [];
      const subGroups: string[] = [];
      approvalItems.forEach((item: any, index: number) => {
        item.subgroups.forEach((_subgroup: any) => {
          subGroups.push(`${_subgroup.type}-${item.employee.id}`);
        });
        groups.push(String(index));
      });
      setOpenGroupKeys(groups);
      setOpenSubgroupKeys(subGroups);
    } else {
      setOpenSubgroupKeys([]);
      setOpenGroupKeys([]);
    }
  };

  const getCollapseGroup = (item: IItemTypes) => {
    let approvalItems = getApprovalItems();
    const noDataCondition = approvalItems.length === 0;
    if (serviceCallFailed) {
      return (
        <BrokenLink
          description='It seems server is unreachable.'
          onTryAgain={() => {
            _setActiveTab(activeTabKey, initialFilters);
          }}
        />
      );
      // } else if (approvalItems.length === 0 || item === 'benefit') {
      //   return <NoData description='There are no items for approval!' />;
    } else {
      let selectAllCheckboxChecked =
        selectedRows.length > 0 && selectedRows.length === approvalItems.length;

      let selectAllCheckboxIntermediate =
        selectedRows.length > 0 && selectedRows.length !== approvalItems.length;

      let collapseGroupItemMap: { [key: string]: any } = {
        expense: ExpenseCollapseGroup,
        request: RequestCollapseGroup,
        benefit: BenefitCollapseGroup,
        expenses_with_request: ExpensesWithRequestCollapseGroup,
      };
      let CollapseGroup = collapseGroupItemMap[item];
      const isAnyExpanded =
        Boolean(openGroupKeys.length) || Boolean(openSubgroupKeys.length);
      return (
        <>
          <div className='row'>
            {noDataCondition ? null : (
              <div className='col-1'>
                <Button
                  type='link'
                  icon={isAnyExpanded ? <DownOutlined /> : <RightOutlined />}
                  className='expand-all-button'
                  title={isAnyExpanded ? 'Collapse All' : 'Expand All'}
                  onClick={expandAllClickHandler.bind(null, approvalItems)}
                  disabled={approvalItemsLoading}
                >
                  {/* {isAnyExpanded ? 'Collapse All' : 'Expand All'} */}
                </Button>
                <Checkbox
                  indeterminate={selectAllCheckboxIntermediate}
                  checked={selectAllCheckboxChecked}
                  className='select-all-checkbox'
                  onChange={(event: CheckboxChangeEvent) => {
                    toggleSelectAllCheckbox(event.target.checked);
                  }}
                  disabled={approvalItemsLoading || !isPendingStatus}
                >
                  Select All
                </Checkbox>
                {selectAllCheckboxIntermediate || selectAllCheckboxChecked ? (
                  <Button
                    className='approve-all-button'
                    onClick={() => {
                      let employeeIds = selectedRows.map(
                        (record: { [key: string]: number }) => {
                          return record.employee;
                        },
                      );

                      let responseData: IApprovalResponseData = {
                        action: 'approve',
                        item: item,
                        employee_ids: employeeIds,
                      };

                      if (
                        item === 'expense' ||
                        item === 'expenses_with_request'
                      ) {
                        let expenseClaimIds: number[] = [];

                        employeeIds.forEach((employeeId: number) => {
                          expenseClaimIds = expenseClaimIds.concat(
                            getExpenseIdsForSelectedEmployeeId(
                              employeeId,
                              item,
                            ),
                          );
                        });

                        responseData.expense_claim_ids = expenseClaimIds;
                      } else if (item === 'request') {
                        let requestIds: number[] = [];

                        employeeIds.forEach((employeeId: number) => {
                          requestIds = requestIds.concat(
                            getRequestIdsForSelectedEmployeeId(employeeId),
                          );
                        });

                        responseData.request_ids = requestIds;
                      } else if (item === 'benefit') {
                        let benefitClaimIds: number[] = [];

                        employeeIds.forEach((employeeId: number) => {
                          benefitClaimIds = benefitClaimIds.concat(
                            getBenefitIdsForSelectedEmployeeId(employeeId),
                          );
                        });

                        responseData.benefit_claim_ids = benefitClaimIds;
                      }

                      _respondToApprovalItems(responseData, initialFilters);
                    }}
                    disabled={approvalItemsLoading || !isPendingStatus}
                  >
                    Approve
                  </Button>
                ) : (
                  <></>
                )}
              </div>
            )}
            <div className='col-2'>
              <ElementOrSkeleton
                isLoading={approvalItemsLoading && approvalItemsCountLoading}
                type='button'
                isActive={true}
                skeletonStyle={{
                  float: 'right',
                  marginBottom: '12px',
                }}
              >
                <Button
                  type='default'
                  title='Filter'
                  className='filter-toggle-button'
                  icon={<FilterOutlined />}
                  onClick={() => {
                    setFiltersVisible(filtersVisible => !filtersVisible);
                  }}
                />
              </ElementOrSkeleton>
            </div>
          </div>
          <DataFilter
            item={item}
            page='APRVL'
            source={source}
            isVisible={filtersVisible}
            includeStatusBar={true}
            includeDraftStatus={false}
            includeLegalEntities={false}
            includeSaveFilterOption={true}
            onApplyFilters={(filters: { [key: string]: any }) => {
              let parameters: IApprovalItemsRequestParameters = {
                function: 'data',
                item: item,
                page: 1,
                ...filters,
              };
              _fetchApprovalItems(parameters);
              _fetchApprovalItemCounts(parameters);
              setOpenGroupKeys([]);
              setOpenSubgroupKeys([]);
              let queryString = generateQueryParamsString({
                page: 1,
                ...filters,
              });
              push(`${location.pathname}?${queryString}`);
            }}
            onResetFilters={() => {
              let parameters: IApprovalItemsRequestParameters = {
                function: 'data',
                item: item,
                // page: 1,
                ...defaultFilters,
              };
              _fetchApprovalItems(parameters);
              _fetchApprovalItemCounts(parameters);
              setOpenGroupKeys([]);
              setOpenSubgroupKeys([]);
              let queryString = generateQueryParamsString(defaultFilters);
              push(`${location.pathname}?${queryString}`);
              // push(location.pathname);
            }}
            initialFilters={initialFilters}
            includeForRequestNumber={true}
            includeItemNumber={true}
            includeLastActionPriorToDate
            includePendingApprovalAtUserList={false}
            includeEntityList
            statusSelectionMode='single'
          />
          <ElementOrSkeleton
            isLoading={approvalItemsLoading && initialFilters.page === 1}
            isActive={true}
            type='profilelist'
          >
            {noDataCondition && !approvalItemsLoading ? (
              <NoData description='There are no items for approval!' />
            ) : (
              <>
                <CollapseGroup
                  data={approvalItems}
                  selectedRows={selectedRows}
                  closeDetailsDrawer={() => closeDetailsDrawer()}
                  handleStatusTagClick={(id: number, itemType: IItemTypes) =>
                    handleStatusTagClick(id, itemType)
                  }
                  openDetailsDrawer={(
                    itemId: number,
                    itemNumber: string,
                    itemType: IItemTypes,
                    workflowStatus: IWorkflowStatus,
                    record: any,
                  ) =>
                    openDetailsDrawer(
                      itemId,
                      itemNumber,
                      itemType,
                      workflowStatus,
                      record,
                    )
                  }
                  tenantConfig={tenantConfig}
                  toggleGroupHeaderCheckbox={(
                    isChecked: boolean,
                    value: number,
                  ) => toggleGroupHeaderCheckbox(isChecked, value)}
                  respondToApprovalItems={(data: IApprovalResponseData) =>
                    _respondToApprovalItems(data, initialFilters)
                  }
                  respondToBulkApprovalItems={(
                    data: IBulkApprovalResponseData,
                  ) => _respondToBulkApprovalItems(data, initialFilters)}
                  openGroupKeys={openGroupKeys}
                  setOpenGroupKeys={(keys: []) => setOpenGroupKeys(keys)}
                  openSubgroupKeys={openSubgroupKeys}
                  setOpenSubgroupKeys={(keys: []) => setOpenSubgroupKeys(keys)}
                  isPendingStatus={isPendingStatus}
                  isLoading={isLoading}
                  isEnableTrafficLightFeatureForTenantFeatures={
                    isEnableTrafficLightFeatureForTenantFeatures
                  }
                />
                {approvalItemsLoading ? (
                  <ElementOrSkeleton
                    isLoading={approvalItemsLoading}
                    isActive={true}
                    type='profilelist'
                    // profileListConfiguration={{ rows: 1 }}
                  ></ElementOrSkeleton>
                ) : null}
                {paginationData.next_page !== null ? (
                  <div className='load-more-button'>
                    <Button
                      loading={approvalItemsLoading}
                      type='link'
                      onClick={_event => {
                        let parameters: IApprovalItemsRequestParameters = {
                          function: 'data',
                          item: item,
                          ...initialFilters,
                          page: paginationData.next_page || 1,
                        };
                        _fetchApprovalItems(parameters);
                        _fetchApprovalItemCounts(parameters);
                        let queryString = generateQueryParamsString({
                          ...initialFilters,
                          page: paginationData.next_page || 1,
                        });
                        push(`${location.pathname}?${queryString}`);
                      }}
                    >
                      Load More
                    </Button>
                  </div>
                ) : null}
              </>
            )}
          </ElementOrSkeleton>
        </>
      );
    }
  };

  return (
    <>
      <HeaderBarWrapper
        headerCommonProps={{ title: <Trans>Approval Inbox</Trans> }}
      >
        <div className='approvals-container'>
          <Tabs
            activeKey={activeTabKey}
            animated={{
              inkBar: false,
              tabPane: true,
            }}
            defaultActiveKey='1'
            destroyInactiveTabPane
            onChange={() => {
              setOpenGroupKeys([]);
              setOpenSubgroupKeys([]);
            }}
            onTabClick={(key: string) => {
              if (!approvalItemsLoading && !approvalItemsCountLoading) {
                toggleSelectAllCheckbox(false);
                let query = generateQueryParamsString(defaultFilters);
                switch (key) {
                  case '1':
                    push(`${appPath.approvals.linkTo}expenses/?${query}`);
                    break;

                  case '2':
                    push(`${appPath.approvals.linkTo}requests/?${query}`);
                    break;

                  case '3':
                    push(
                      `${appPath.approvals.linkTo}expenses-with-request/?${query}`,
                    );
                    break;

                  case '4':
                    push(`${appPath.approvals.linkTo}benefits/?${query}`);
                    break;

                  default:
                    break;
                }
              }
            }}
          >
            {isPermissionAllowed('ACTION_EXPENSE_APPROVAL') && (
              <Tabs.TabPane
                disabled={approvalItemsLoading || approvalItemsCountLoading}
                key='1'
                tab={
                  <CustomizeTabName
                    title={<Trans>Expenses</Trans>}
                    icon='.'
                    count={
                      approvalItemsCountLoading ? (
                        <LoadingOutlined style={{ width: 14, marginLeft: 6 }} />
                      ) : (
                        pendingItemsCount.expenses
                      )
                    }
                  />
                }
              >
                {activeTabKey === '1' ? getCollapseGroup('expense') : <></>}
              </Tabs.TabPane>
            )}

            {isPermissionAllowed('ACTION_REQUEST_APPROVAL') && (
              <Tabs.TabPane
                disabled={approvalItemsLoading || approvalItemsCountLoading}
                key='2'
                tab={
                  <CustomizeTabName
                    title={<Trans>Requests</Trans>}
                    icon='.'
                    count={
                      approvalItemsCountLoading ? (
                        <LoadingOutlined style={{ width: 14, marginLeft: 6 }} />
                      ) : (
                        pendingItemsCount.requests
                      )
                    }
                  />
                }
              >
                {activeTabKey === '2' ? getCollapseGroup('request') : <></>}
              </Tabs.TabPane>
            )}

            {props.getIsBenefitsEnabled &&
              isPermissionAllowed('ACTION_BENEFIT_APPROVAL') && (
                <Tabs.TabPane
                  disabled={approvalItemsLoading || approvalItemsCountLoading}
                  key='4'
                  tab={
                    <CustomizeTabName
                      title={<Trans>Benefits</Trans>}
                      icon='.'
                      count={
                        approvalItemsCountLoading ? (
                          <LoadingOutlined
                            style={{ width: 14, marginLeft: 6 }}
                          />
                        ) : (
                          pendingItemsCount.benefits
                        )
                      }
                    />
                  }
                >
                  {activeTabKey === '4' ? getCollapseGroup('benefit') : <></>}
                </Tabs.TabPane>
              )}
            {isPermissionAllowed('ACTION_EXPENSE_APPROVAL') && (
              <Tabs.TabPane
                disabled={approvalItemsLoading || approvalItemsCountLoading}
                key='3'
                tab={
                  <CustomizeTabName
                    title={<Trans>Expenses With Request</Trans>}
                    icon='.'
                    count={
                      approvalItemsCountLoading ? (
                        <LoadingOutlined style={{ width: 14, marginLeft: 6 }} />
                      ) : (
                        pendingItemsCount.expensesWithRequests
                      )
                    }
                  />
                }
              >
                {activeTabKey === '3' ? (
                  getCollapseGroup('expenses_with_request')
                ) : (
                  <></>
                )}
              </Tabs.TabPane>
            )}
          </Tabs>
        </div>
        <ErrorBoundary>
          <AppDrawer
            width={'70%'}
            visible={drawerDetailItem?.visibility}
            destroyOnClose={true}
            closable={true}
            onClose={closeDetailsDrawer}
            title={
              <>
                <span>{drawerDetailItem?.drawerTitle}</span>
                <span>&nbsp;</span>
                <StatusTag
                  status={drawerDetailItem?.workflowStatus as IWorkflowStatus}
                  onStatusClick={handleStatusTagClick.bind(
                    null,
                    drawerDetailItem?.id as number,
                    drawerDetailItem?.itemType as
                      | 'expense'
                      | 'request'
                      | 'benefit',
                  )}
                />
              </>
            }
            showCancelButton={false}
            showOkButton={false}
            getContainer='.approvals-container'
            className='detail-drawer no-header-border'
          >
            {(() => {
              switch (drawerDetailItem?.itemType) {
                case 'expense':
                  return (
                    <ClaimDetails
                      isApprovalPage={true}
                      claimId={drawerDetailItem.id}
                    />
                  );
                case 'request':
                  return <RequestDetail requestId={drawerDetailItem.id} />;
                case 'benefit':
                  return (
                    <BenefitDetail
                      benefitClaimId={drawerDetailItem?.id}
                      isAdmin={true}
                    />
                  );
                default:
                  break;
              }
            })()}
          </AppDrawer>
        </ErrorBoundary>
      </HeaderBarWrapper>
    </>
  );
};

export default connector(memo(Approvals));
