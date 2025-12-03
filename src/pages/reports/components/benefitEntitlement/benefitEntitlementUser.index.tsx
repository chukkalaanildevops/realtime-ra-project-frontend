import React, { Dispatch, useState, memo, useEffect } from 'react';
import { Table, Button, message } from 'antd';
import { AxiosResponse } from 'axios';
import { fetchProfileDataAPI } from '../../../../services/profile';
import { useHistory, useLocation } from 'react-router-dom';
import { FilterOutlined } from '@ant-design/icons';
import { connect, ConnectedProps } from 'react-redux';

import { fetchWorkFlowData } from '../../../app/app.thunk';
import {
  fetchUserEntitlementRecords,
  exportReport,
  fetchExportedDownloadList,
} from '../../reports.thunk';
import {
  NoData,
  HeaderBarWrapper,
  DataFilter,
  ElementOrSkeleton,
} from '../../../../shared/components';
import {
  getEntitlementDataViewColumns,
  getBenefitEntitlementDataViewColumns,
} from '../../../admin/tableColumns.index';
import { attachBenefitWorkflowFN } from '../../../admin/admin.thunk';
import {
  generateQueryParamsString,
  getQueryParametersAsObject,
} from '../../../../utils/global.utils';
import './benefitEntitlement.index.less';
import { Trans } from '@lingui/macro';
let page = 1;
let initialPageSize = 12;
const ReportBenefitEntitlementUser: React.FC<ConnectedProps<
  typeof connector
> & {
  defaultFilter?: { [x: string]: any };
  employee?: any;
  source?: any;
}> = ({
  dataGroupItems,
  dataGroupItemsPaginationData,
  employee,
  source,
  isLoading,
  _attachBenefitWorkflowFN,
  _fetchUserEntitlementRecords,
  _exportReport,
  _fetchWorkFlowData,
  _downloadReports,
  defaultFilter = {},
}) => {
  const { push } = useHistory();
  let location = useLocation();
  let pathname = location.pathname.endsWith('/')
    ? location.pathname.slice(0, -1)
    : location.pathname;
  const [isEmployeeIdValid, setIsEmployeeIdValid] = useState<boolean>(true);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const [selectedEmployee, setSelectedEmployee] = useState<{
    [key: string]: any;
  }>({});
  const [filtersVisible, setFiltersVisible] = useState<boolean>(false);
  let urlQueryParameters = getQueryParametersAsObject();
  let employeeId = employee ? employee : 0;

  let item = 'benefit_entitlement';
  let initialFilters = { ...defaultFilter, ...urlQueryParameters };
  if (urlQueryParameters.page !== undefined) {
    page = parseInt(urlQueryParameters.page);
  }
  if (urlQueryParameters.employee !== undefined) {
    employeeId = parseInt(urlQueryParameters.employee);
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [drawerDetailItem, setDetailDrawer] = useState<{
    visibility: boolean;
    itemType: any;
    itemSubType: any;
    itemNumber: string;
    workflowStatus: {
      code: string;
      title: string;
    };
    id: number;
    drawerTitle: string;
    cashAdvanceRequestDetails?: { [key: string]: any };
  } | null>(null);

  const openDetailsDrawer = (
    itemId: number,
    itemNumber: string,
    itemType: any,
    itemSubType: any,
    workflowStatus: any,
    cashAdvanceRequestDetails?: { [key: string]: any },
  ) => {
    let drawerTitle = '';
    switch (itemType) {
      case 'expense':
        drawerTitle = <Trans>Expense Claim No. #</Trans> + itemNumber;
        break;
      case 'request':
        drawerTitle = <Trans>Request No. #</Trans> + itemNumber;
        break;
      case 'cash_advance_request':
        drawerTitle = <Trans>Cash Advance Request. #</Trans> + itemNumber;
        break;
      case 'benefit':
        drawerTitle = <Trans>Benefit Claim No. #</Trans> + itemNumber;
        break;
      default:
        break;
    }

    setDetailDrawer({
      visibility: true,
      itemType: itemType,
      itemSubType: itemSubType,
      itemNumber: itemNumber,
      workflowStatus: workflowStatus,
      id: itemId,
      drawerTitle: drawerTitle,
      cashAdvanceRequestDetails: cashAdvanceRequestDetails,
    });
  };

  const handleStatusTagClicked = (
    id: number,
    isActionVisible: boolean = true,
    type: any,
    showAttachedWorkflow: boolean = false,
    onWorkflowAttachedFn?: () => void,
  ) => {
    const workflowComponentProps: any = {
      isAdmin: isActionVisible,
      employeeId: employeeId,
      permissions: false,
      onApproverSelection: (_approvers: number[], _stepId: number) => {},
      showAttachedWorkflow: showAttachedWorkflow,
      onWorkflowAttached: onWorkflowAttachedFn,
    };
    if (!showAttachedWorkflow) {
      delete workflowComponentProps.onWorkflowAttached;
    }
    _fetchWorkFlowData({
      id: id,
      type: type,
      workflowComponentProps,
    });
  };
  useEffect(() => {
    fetchEmployeeProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    setPageSize(urlQueryParameters?.page_size || 12);

    let parameters: any = {
      ...defaultFilter,
      ...urlQueryParameters,
      ...{
        function: 'data',
        employee: employeeId,
        item: item,
        page: 1,
        page_size: pageSize,
      },
    };
    // localFilter = parameters;
    _fetchUserEntitlementRecords(parameters);

    let queryParameters = generateQueryParamsString({
      ...defaultFilter,
      ...urlQueryParameters,
      page: 1,
      employee: employeeId,
      page_size: pageSize,
    });
    push(`${location.pathname}?${queryParameters}`);

    // eslint-disable-next-line
  }, [employeeId]);

  const getBreadcrumbProps = () => {
    let routes = [
      {
        path: location.pathname,
        breadcrumbName: 'Benefit Entitlement',
      },
    ];

    if (isEmployeeIdValid === true) {
      employeeId > 0 &&
        routes.push({
          path: `${pathname}?employee=${employeeId}&page=1`,
          breadcrumbName: selectedEmployee
            ? selectedEmployee?.legal_name || selectedEmployee.name
            : 'Fetching...',
        });
    }
    return { routes };
  };
  const editItem = () => {};
  const viewEntitlementAdjustments = () => {};
  const getPermissions = () => {};
  const fetchEmployeeProfile = async () => {
    if (employeeId === 0) {
      setIsEmployeeIdValid(false);
    } else {
      try {
        const response: AxiosResponse = await fetchProfileDataAPI(employeeId);
        setSelectedEmployee(response.data);
      } catch (error) {
        message.error(error.response.data.error);
      }
    }
  };
  const getUserDataView = () => {
    let tableProps: { [key: string]: any } = {
      bordered: true,
      scroll: {
        x: true,
      },
      rowKey: 'id',
      className: 'expenses-with-requests-user-data benefit-entitlement',
      pagination: {
        position: 'bottom',
        hideOnSinglePage: false,
        current:
          page !== undefined
            ? typeof page === 'string'
              ? parseInt(page)
              : page
            : 1,
        defaultPageSize: 12,
        showSizeChanger: true,
        pageSizeOptions: ['10', '12', '20', '50', '100'],
        defaultCurrent: 1,
        showQuickJumper: {
          goButton: (
            <Button type='default'>
              <Trans>Go</Trans>
            </Button>
          ),
        },
        pageSize: pageSize ? pageSize : 12,
        total: dataGroupItemsPaginationData?.total_records,
        showLessItems: true,
        onShowSizeChange: (_page: number, size: number) => {
          setPageSize(size);
        },
        showTotal: (total: number, range: number[]) => {
          return <>{`${range[0]}-${range[1]} of ${total}`}</>;
        },
        onChange: (pageNumber: number, pageSize: any) => {
          let parameters: any = {
            ...defaultFilter,
            ...urlQueryParameters,
            function: 'data',
            item: item,
            employee: employeeId,
            page: pageNumber,
            page_size: pageSize,
          };

          let queryParameters = generateQueryParamsString({
            ...defaultFilter,
            ...urlQueryParameters,
            page: String(pageNumber),
            page_size: String(pageSize),
            employee: employeeId,
          });
          _fetchUserEntitlementRecords(parameters);

          push(`${location.pathname}?${queryParameters}`);
        },
      },
      expandable: {
        expandedRowRender: (record: any) => (
          <Table
            columns={getEntitlementDataViewColumns(
              employeeId,
              openDetailsDrawer,
              handleStatusTagClicked,
              () => false,
              _attachBenefitWorkflowFN,
            )}
            size='middle'
            dataSource={record.benefits}
            pagination={false}
            className='user-expenses-data benefit-entitlement-user-data'
          />
        ),
        expandedRowClassName: (_record: any) => 'expanded-request-row',
        indentSize: 0,
      },
      columns: getBenefitEntitlementDataViewColumns(
        employeeId,
        openDetailsDrawer,
        () => false,
        editItem,
        viewEntitlementAdjustments,
        getPermissions,
      ),
      dataSource: dataGroupItems,
    };

    return dataGroupItems && dataGroupItems.length > 0 ? (
      <Table {...tableProps} size='middle' />
    ) : (
      <NoData />
    );
  };
  const applyFilters = (filters: { [key: string]: any }) => {
    let queryParameters = generateQueryParamsString(filters);
    let parameters = {
      ...defaultFilter,
      ...{
        function: 'data',
        item: item,
        employee: employeeId,
      },
      ...filters,
      page_size: pageSize,
    };
    // parameters?.from_date && delete parameters.from_date;
    // parameters?.to_date && delete parameters.to_date;
    _fetchUserEntitlementRecords(parameters);

    if (queryParameters.length > 1) {
      push(
        `${location.pathname}?employee=${employeeId}&page=1&${queryParameters}&page_size=${pageSize}`,
      );
    } else {
      push(
        `${location.pathname}?employee=${employeeId}&page=1&page_size=${pageSize}`,
      );
    }
  };

  const resetFilters = () => {
    initialFilters = { ...defaultFilter };
    let queryParameters = generateQueryParamsString(defaultFilter);
    let parameters = {
      ...defaultFilter,
      ...{
        function: 'data',
        item: item,
        employee: employeeId,
      },
      page_size: pageSize,
    };
    _fetchUserEntitlementRecords(parameters);

    if (queryParameters.length > 1) {
      push(
        `${location.pathname}?employee=${employeeId}&page=1&${queryParameters}&page_size=${pageSize}`,
      );
    } else {
      push(
        `${location.pathname}?employee=${employeeId}&page=1&page_size=${pageSize}`,
      );
    }
  };

  return (
    <HeaderBarWrapper
      headerCommonProps={{ title: <Trans>Reports</Trans> }}
      breadcrumbCompVisibility={true}
      breadcrumbCompProps={{
        enableBackBtn: true,
        breadcrumProps: getBreadcrumbProps(),
        backBtnUrl: `/reports/benefit-entitlement/`,
        onBackClick: () => {
          if (urlQueryParameters.request !== undefined) {
            let parameters = {
              ...urlQueryParameters,
              ...{
                function: 'data',
                employee: employeeId,
                item: item,
              },
            };
            _fetchUserEntitlementRecords(parameters);
          }
        },
      }}
    >
      <div className='finance-admin-container'>
        <div className='user-data-view'>
          {urlQueryParameters.request === undefined ? (
            <div
              className={filtersVisible ? 'active action-bar' : 'action-bar'}
            >
              <div className={filtersVisible ? 'row active' : 'row'}>
                <ElementOrSkeleton
                  isLoading={isLoading}
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
                    onClick={() =>
                      setFiltersVisible(filtersVisible => !filtersVisible)
                    }
                  />
                </ElementOrSkeleton>
              </div>
              <DataFilter
                page='ADMIN'
                source={source}
                item={'benefit_entitlement'}
                isVisible={filtersVisible}
                includeStatusBar={false}
                includeDraftStatus={false}
                includeLegalEntities={false}
                includeSaveFilterOption={false}
                onApplyFilters={(filters: { [key: string]: any }) => {
                  applyFilters(filters);
                }}
                onResetFilters={resetFilters}
                initialFilters={initialFilters}
                includeItemNumber={true}
                includeForRequestNumber={false}
                includeSettlementDate={false}
                includeLastActionPriorToDate={false}
                includeYearFilter={true}
                includePendingApprovalAtUserList
                includeDateRange={false}
                includeEntityList={false}
                includeEmpoyeeList={false}
              />
            </div>
          ) : (
            <></>
          )}
          <div className='table'>
            <ElementOrSkeleton
              type='table'
              isLoading={isLoading}
              isActive={true}
            >
              {getUserDataView()}
              {/* {getUserDataOrExpensesForRequestView()} */}
            </ElementOrSkeleton>
          </div>
        </div>
      </div>
    </HeaderBarWrapper>
  );
};

const mapStateToProps = (state: any) => {
  const {
    benefit_entitlement_users,
    benefit_entitlement_users_pagination_data,
    isLoader,
    success,
    reportCount,
  } = state.reports;
  return {
    dataGroupItems: benefit_entitlement_users,
    dataGroupItemsPaginationData: benefit_entitlement_users_pagination_data,
    isLoading: isLoader,
    success,
    reportCount,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  _fetchUserEntitlementRecords: (parameters: any) =>
    dispatch(fetchUserEntitlementRecords(parameters)),
  //   _setConfirmationInfo: (data: IConfirmationInfo) =>
  //     dispatch(setConfirmationInfo(data)),
  //   _resetConfirmationInfo: () => dispatch(resetConfirmationInfo()),
  _fetchWorkFlowData: (props: any) => dispatch(fetchWorkFlowData(props)),
  _exportReport: (type: any, source: any, filters: any) =>
    dispatch(exportReport(type, source, filters)),
  _attachBenefitWorkflowFN: (id: number) =>
    dispatch(attachBenefitWorkflowFN(id)),
  _downloadReports: () => dispatch(fetchExportedDownloadList()),
});

const connector = connect(mapStateToProps, mapDispatchToProps);
export default connector(memo(ReportBenefitEntitlementUser));
