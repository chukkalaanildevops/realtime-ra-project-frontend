/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { memo, useEffect, ReactText, useState, Dispatch } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import {
  Table,
  Input,
  Avatar,
  Button,
  message,
  Dropdown,
  Menu,
  Upload,
} from 'antd';
import { Trans } from '@lingui/macro';
import {
  downloadAdjustmentCSV,
  uploadBenefitEntitlementCSV,
} from './admin.thunk';
import './admin.index.less';
import {
  IAdminDataRequestParameters,
  IAdminDataTabModel,
} from './admin.models';
import { useHistory, useLocation } from 'react-router-dom';
import { ColumnsType } from 'antd/lib/table';
import {
  SearchOutlined,
  FilterOutlined,
  DownOutlined,
  DownloadOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import {
  ElementOrSkeleton,
  NoData,
  BrokenLink,
  DataFilter,
} from '../../shared/components';
import { stateInterface, getPermissions } from '../../shared/redux/rootReducer';
import {
  generateQueryParamsString,
  getQueryParametersAsObject,
  removeParamsFromObject,
} from '../../utils/global.utils';
import defaultUserImage from '../../assets/images/default/user.png';
import {
  getAggregatedExpensesColumns,
  getAggregatedRequestsColumns,
  getAggregatedBenefitsColumns,
  getAggregatedBenefitEntitlementsColumns,
  getAggregatedExpenseEntitlementsColumns,
  getAggregatedCashAdvanceRequestsColumns,
} from './tableColumns.index';
import { AxiosResponse } from 'axios';
import { getDataForAdminViewService } from '../../services/admin';
import { Pagination } from 'antd';

const mapStateToProps = (state: stateInterface) => {
  return {
    getPermissions: getPermissions(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  return {
    _downloadAdjustmentCSV: () => dispatch(downloadAdjustmentCSV()),
    _uploadBenefitEntitlementCSV: (file: any) =>
      dispatch(uploadBenefitEntitlementCSV(file)),
  };
};

const connector = connect(mapStateToProps, mapDispatchToProps);

let initialExpensesPageSize = 12;
let initialExpensesWithRequestPageSize = 12;
let initialRequestPageSize = 12;
let initialCashAdvancedRequestPageSize = 12;
let initialBenefitPageSize = 12;
let initialBenefitSettlementsPageSize = 12;
let initialBenefitEntitlementPageSize = 12;
let initialExpenseEntitlementPageSize = 12;

let totalRecords = 0;
let _initialPageSize = 12;

const AggregatedDataView: React.FC<ConnectedProps<typeof connector> &
  IAdminDataTabModel> = props => {
  const {
    source,
    item,
    fetchDataItemsCount,
    _updateSpecificDataItemsCount,
    _downloadAdjustmentCSV,
    _uploadBenefitEntitlementCSV,
    getPermissions,
    defaultFilter = {},
    activeTabKey,
  } = props;

  const { push } = useHistory();
  const location = useLocation();

  const [pageLoading, setPageLoading] = useState<boolean>(true);
  const [_pageSize, _setPageSize] = useState(_initialPageSize);
  const [expensesPageSize, setExpensesPageSize] = useState(
    initialExpensesPageSize,
  );
  const [
    expensesWithRequestPageSize,
    setExpensesWithRequestPageSize,
  ] = useState(initialExpensesWithRequestPageSize);
  const [requestPageSize, setRequestPageSize] = useState(
    initialRequestPageSize,
  );
  const [
    cashAdvancedRequestPageSize,
    setCashAdvancedRequestPageSize,
  ] = useState(initialCashAdvancedRequestPageSize);
  const [benefitPageSize, setBenefitPageSize] = useState(
    initialBenefitPageSize,
  );
  const [benefitSettlementsPageSize, setBenefitSettlementsPageSize] = useState(
    initialBenefitSettlementsPageSize,
  );
  const [benefitEntitlementPageSize, setBenefitEntitlementPageSize] = useState(
    initialBenefitEntitlementPageSize,
  );
  const [expenseEntitlementPageSize, setExpenseEntitlementPageSize] = useState(
    initialExpenseEntitlementPageSize,
  );
  const [dataGroups, setDataGroups] = useState<{ [key: string]: any }[]>([]);
  const [dataGroupsLoading, setDataGroupsLoading] = useState<boolean>(false);
  const [dataGroupsNextPage, setDataGroupsNextPage] = useState<number | null>(
    1,
  );
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [serviceCallFailed, setServiceCallFailed] = useState<boolean>(false);

  const isAdminCashAdvanceRequestAcitveTab = item === 'cash_advance_request';

  const isBatchNumberFilter =
    item === 'expense' ||
    item === 'benefit' ||
    item === 'expenses_with_request';

  let urlQueryParameters = removeParamsFromObject(
    getQueryParametersAsObject(),
    ['from_date', 'to_date'],
    isAdminCashAdvanceRequestAcitveTab,
  );
  const [filtersVisible, setFiltersVisible] = useState<boolean>(false);

  const _defaultFilter = removeParamsFromObject(
    defaultFilter,
    ['from_date', 'to_date'],
    isAdminCashAdvanceRequestAcitveTab,
  );
  let initialFilters = {
    ..._defaultFilter,
    ...urlQueryParameters,
  };

  const downloadTemplate = () => {
    _downloadAdjustmentCSV();
  };

  const uploadConfig = {
    beforeUpload: (file: any) => {
      _uploadBenefitEntitlementCSV(file);
      return false;
    },
  };
  const renderExtraMenu = () => {
    return (
      <Menu>
        <Menu.Item key='1'>
          <Button
            type='link'
            onClick={downloadTemplate}
            style={{ color: '#68737d' }}
          >
            <DownloadOutlined style={{ marginRight: 8 }} />
            <Trans>Download</Trans>
          </Button>
        </Menu.Item>
        {getPermissions.ACTION_BENEFIT_ADJUSTMENT && (
          <Menu.Item key='2' onClick={e => e.domEvent.preventDefault()}>
            <Upload
              {...uploadConfig}
              onChange={() => {}}
              showUploadList={false}
            >
              <Button type='link' style={{ color: '#68737d' }}>
                <UploadOutlined style={{ marginRight: 8 }} />
                <Trans>Upload</Trans>
              </Button>
            </Upload>
          </Menu.Item>
        )}
      </Menu>
    );
  };

  const updateCount = (res: AxiosResponse) => {
    const pagDataKeyArr = Object.keys(res.data.pagination_data);
    let key: any = '';
    let count: any;
    if (pagDataKeyArr.indexOf('expenses') !== -1) {
      key = 'expenses';
      count = res.data.pagination_data.expenses;
    } else if (pagDataKeyArr.indexOf('requests') !== -1) {
      key = 'requests';
      count = res.data.pagination_data.requests;
    } else if (pagDataKeyArr.indexOf('expenses_with_requests') !== -1) {
      key = 'expensesWithRequests';
      count = res.data.pagination_data.expenses_with_requests;
    } else if (pagDataKeyArr.indexOf('cash_advance_requests') !== -1) {
      key = 'cashAdvanceRequests';
      count = res.data.pagination_data.cash_advance_requests;
    } else if (pagDataKeyArr.indexOf('benefits') !== -1) {
      key = 'benefits';
      count = res.data.pagination_data.benefits;
    } else if (pagDataKeyArr.indexOf('benefit_entitlements') !== -1) {
      key = 'benefitEntitlement';
      count = res.data.pagination_data.benefit_entitlements;
    } else if (pagDataKeyArr.indexOf('expenses_entitlement') !== -1) {
      key = 'expenseEntitlement';
      count = res.data.pagination_data.expenses_entitlement;
    }
    if (key !== '') _updateSpecificDataItemsCount(key, count);
  };

  const fetchDataGroups = async (
    parameters: IAdminDataRequestParameters,
    resetDataGroups?: boolean,
  ) => {
    setDataGroupsLoading(true);
    try {
      let response: AxiosResponse = await getDataForAdminViewService(
        parameters,
        // source.token,
      );

      totalRecords = response.data.pagination_data.total_records;
      if (resetDataGroups === true) {
        setDataGroups(response.data.data);
      } else {
        if (response.data.data.length > 0) {
          setDataGroups(response.data.data);
        }
      }
      updateCount(response);
      setDataGroupsNextPage(response.data.pagination_data.next_page);
      setDataGroupsLoading(false);
      setPageLoading(false);
      setServiceCallFailed(false);
    } catch (error) {
      setDataGroupsLoading(false);
      setServiceCallFailed(true);
      message.error('Data could not be fetched.');
    }
  };

  useEffect(() => {
    if (dataGroupsNextPage !== null) {
      let parameters: IAdminDataRequestParameters = {
        function: 'data',
        item: item,
        page: dataGroupsNextPage ? dataGroupsNextPage : 1,
        ...initialFilters,
      };
      fetchDataGroups(parameters);
    }
    // eslint-disable-next-line
  }, [source]);

  const getSearchableEmployeeColumn = () => {
    let column: ColumnsType<any> = [
      {
        title: <Trans>Employee</Trans>,
        key: 'employee',
        dataIndex: 'employee',
        filterDropdown: ({
          setSelectedKeys,
          selectedKeys,
          confirm,
          clearFilters,
        }) => (
          <div style={{ padding: 8 }}>
            <Input.Search
              placeholder='Search'
              autoFocus={true}
              size='small'
              onSearch={value => {
                setSelectedKeys([value]);
                handleSearchOnEmployeeColumn(selectedKeys, confirm, 'employee');
              }}
              onPressEnter={event => {
                setSelectedKeys([event.currentTarget.value]);
                handleSearchOnEmployeeColumn(selectedKeys, confirm, 'employee');
              }}
              allowClear={true}
              onChange={event => {
                if (
                  event.target.value === undefined ||
                  event.target.value.length === 0
                ) {
                  setSelectedKeys([]);
                  handleEmployeeSearchReset(clearFilters);
                }
              }}
            />
          </div>
        ),
        filterIcon: (filtered: boolean) => (
          <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
        ),
        onFilter: (value: any, record: any) => {
          const item: { [key: string]: any } = record['employee'];
          const name = item?.legal_name || item?.name;
          return name ? name.toLowerCase().includes(value.toLowerCase()) : '';
        },
        render: (_text: string, _record: any) => (
          <div className='profile'>
            <Avatar
              size={32}
              className='profile-photo'
              src={
                _record.employee.profile_picture_url === null
                  ? _record.employee.profile_picture_url
                  : defaultUserImage
              }
            />
            <div className='profile-details'>
              <div className='name'>
                {_record?.employee?.legal_name || _record.employee.name}
              </div>
              <div className='designation'>
                {_record.employee.designation !== null
                  ? _record.employee.designation
                  : 'Designation Unavailable'}
              </div>
            </div>
          </div>
        ),
      },
    ];

    return column;
  };

  const handleSearchOnEmployeeColumn = (
    _selectedKeys: ReactText[],
    confirm: () => void,
    _dataIndex: string,
  ) => {
    setTimeout(() => {
      confirm();
    }, 500);
  };

  const handleEmployeeSearchReset = (
    clearFilters: (() => void) | undefined,
  ) => {
    if (clearFilters !== undefined) clearFilters();
  };

  const getDataGroups = () => {
    if (serviceCallFailed === true) {
      return (
        <BrokenLink
          description=''
          onTryAgain={() => {
            let parameters: IAdminDataRequestParameters = {
              function: 'data',
              item: item,
              page: dataGroupsNextPage ? dataGroupsNextPage : 1,
              ...initialFilters,
            };
            fetchDataGroups(parameters);
            fetchDataItemsCount({
              function: 'count',
              item: item,
              ...initialFilters,
            });
          }}
        />
      );
    }

    let columns: ColumnsType<any> = [];

    switch (item) {
      case 'expense':
        columns = [
          ...getSearchableEmployeeColumn(),
          ...getAggregatedExpensesColumns(),
        ];
        break;

      case 'request':
        columns = [
          ...getSearchableEmployeeColumn(),
          ...getAggregatedRequestsColumns(),
        ];
        break;

      case 'expenses_with_request':
        columns = [
          ...getSearchableEmployeeColumn(),
          ...getAggregatedExpensesColumns(),
        ];
        break;

      case 'cash_advance_request':
        columns = [
          ...getSearchableEmployeeColumn(),
          ...getAggregatedCashAdvanceRequestsColumns(),
        ];
        break;

      case 'benefit':
        columns = [
          ...getSearchableEmployeeColumn(),
          ...getAggregatedBenefitsColumns(),
        ];
        break;

      case 'benefit_entitlement':
        columns = [
          ...getSearchableEmployeeColumn(),
          ...getAggregatedBenefitEntitlementsColumns(),
        ];
        break;

      case 'expense_entitlement':
        columns = [
          ...getSearchableEmployeeColumn(),
          ...getAggregatedExpenseEntitlementsColumns(),
        ];
        break;
      default:
        break;
    }

    return (
      <ElementOrSkeleton
        type='table'
        isLoading={dataGroupsLoading}
        isActive={true}
      >
        {dataGroups.length > 0 ? (
          <>
            <Table
              bordered={true}
              columns={columns}
              pagination={false}
              scroll={{ x: 800 }}
              className='aggregated-view'
              size='middle'
              rowKey={(record: any) => {
                return String(record.employee.id);
              }}
              dataSource={dataGroups}
              loading={dataGroupsLoading}
              onRow={(record, _index) => {
                return {
                  onClick: () => {
                    let pathname = location.pathname;
                    if (pathname.endsWith('/')) {
                      pathname = pathname.slice(0, -1);
                    }
                    let queryParameters = generateQueryParamsString({
                      ...urlQueryParameters,
                      employee: record.employee.id,
                      page: 1,
                    });
                    let urlToPush = `${pathname}?${queryParameters}`;
                    push(urlToPush);
                  },
                };
              }}
            />
            <div
              style={{
                display: 'flex',
                flexDirection: 'row-reverse',
                marginTop: 12,
              }}
            >
              <Pagination
                defaultCurrent={1}
                current={currentPage}
                onChange={(pageNumber: number, pageSize: any) => {
                  if (activeTabKey === 'expenses') {
                    _setPageSize(expensesPageSize);
                  }
                  if (activeTabKey === 'expenses-with-requests') {
                    _setPageSize(expensesWithRequestPageSize);
                  }
                  if (activeTabKey === 'requests') {
                    _setPageSize(requestPageSize);
                  }
                  if (activeTabKey === 'cash-advance-requests') {
                    _setPageSize(cashAdvancedRequestPageSize);
                  }
                  if (activeTabKey === 'benefits') {
                    _setPageSize(benefitPageSize);
                  }
                  if (activeTabKey === 'benefit-settlement') {
                    _setPageSize(benefitSettlementsPageSize);
                  }
                  if (activeTabKey === 'benefit-entitlement') {
                    _setPageSize(benefitEntitlementPageSize);
                  }
                  if (activeTabKey === 'expense-entitlement') {
                    _setPageSize(expenseEntitlementPageSize);
                  }
                  let parameters: IAdminDataRequestParameters = {
                    function: 'data',
                    item: item,
                    page: pageNumber,
                    page_size: pageSize,
                    ...initialFilters,
                  };
                  setCurrentPage(pageNumber);
                  fetchDataGroups(parameters);
                }}
                hideOnSinglePage={false}
                pageSizeOptions={['10', '12', '20', '50', '100']}
                pageSize={
                  (activeTabKey === 'expenses' && expensesPageSize) ||
                  (activeTabKey === 'expenses-with-requests' &&
                    expensesWithRequestPageSize) ||
                  (activeTabKey === 'requests' && requestPageSize) ||
                  (activeTabKey === 'cash-advance-requests' &&
                    cashAdvancedRequestPageSize) ||
                  (activeTabKey === 'benefits' && benefitPageSize) ||
                  (activeTabKey === 'benefit-settlement' &&
                    benefitSettlementsPageSize) ||
                  (activeTabKey === 'benefit-entitlement' &&
                    benefitEntitlementPageSize) ||
                  (activeTabKey === 'expense-entitlement' &&
                    expenseEntitlementPageSize) ||
                  12
                }
                showSizeChanger={true}
                onShowSizeChange={(_current: number, size: number) => {
                  if (activeTabKey === 'expenses') {
                    setExpensesPageSize(size);
                  }
                  if (activeTabKey === 'expenses-with-requests') {
                    setExpensesWithRequestPageSize(size);
                  }
                  if (activeTabKey === 'requests') {
                    setRequestPageSize(size);
                  }
                  if (activeTabKey === 'cash-advance-requests') {
                    setCashAdvancedRequestPageSize(size);
                  }
                  if (activeTabKey === 'benefits') {
                    setBenefitPageSize(size);
                  }
                  if (activeTabKey === 'benefit-settlement') {
                    setBenefitSettlementsPageSize(size);
                  }
                  if (activeTabKey === 'benefit-entitlement') {
                    setBenefitEntitlementPageSize(size);
                  }
                  if (activeTabKey === 'expense-entitlement') {
                    setExpenseEntitlementPageSize(size);
                  }
                }}
                total={totalRecords}
                showTotal={(total: number, range: number[]) => {
                  return <>{`${range[0]}-${range[1]} of ${total}`}</>;
                }}
                showQuickJumper={{
                  goButton: <Button type='default'>Go</Button>,
                }}
              />
            </div>
          </>
        ) : (
          <NoData description='There are no records' />
        )}
      </ElementOrSkeleton>
    );
  };

  const applyFilters = (filters: { [key: string]: any }) => {
    let queryParameters = generateQueryParamsString(filters);
    if (queryParameters.length > 1) {
      push(`${location.pathname}?${queryParameters}`);
    } else {
      push(`${location.pathname}`);
    }

    let parameters: IAdminDataRequestParameters = {
      ...{
        function: 'data',
        item: item,
        page_size: _pageSize,
      },
      ...filters,
    };
    fetchDataGroups(parameters, true);
  };

  return (
    <>
      <div className={`${item} aggregated-items`}>
        <div className={filtersVisible ? 'active action-bar' : 'action-bar'}>
          <div className={filtersVisible ? 'row active' : 'row'}>
            <ElementOrSkeleton
              isLoading={pageLoading}
              type='button'
              isActive={true}
              skeletonStyle={{
                float: 'right',
                marginBottom: '12px',
              }}
            >
              {activeTabKey === 'benefit-entitlement' && (
                <div
                  style={{
                    marginBottom: '12px',
                    marginRight: '15px',
                  }}
                >
                  <Dropdown
                    overlay={renderExtraMenu}
                    getPopupContainer={() =>
                      document.getElementsByClassName(
                        'action-bar',
                      )[0] as HTMLElement
                    }
                  >
                    <div>
                      <a onClick={e => e.preventDefault()}>
                        <Trans>More Actions</Trans> <DownOutlined />
                      </a>
                    </div>
                  </Dropdown>
                </div>
              )}
              <Button
                type='default'
                title='Filter'
                className='filter-toggle-button'
                icon={<FilterOutlined />}
                onClick={_event =>
                  setFiltersVisible(filtersVisible => !filtersVisible)
                }
              />
            </ElementOrSkeleton>
          </div>
          <DataFilter
            item={item}
            source={source}
            page='ADMIN'
            isVisible={filtersVisible}
            includeStatusBar={true}
            includeDraftStatus={false}
            includeLegalEntities={false}
            includeSaveFilterOption={true}
            includeBatchNumber={isBatchNumberFilter}
            onApplyFilters={(filters: { [key: string]: any }) => {
              applyFilters(filters);
            }}
            isAggregate={true}
            onResetFilters={() => {
              setDataGroups([]);
              let parameters: IAdminDataRequestParameters = {
                function: 'data',
                item: item,
                page: 1,
                ..._defaultFilter,
                page_size: _pageSize,
              };
              fetchDataGroups(parameters);
              let queryParameters = generateQueryParamsString(_defaultFilter);
              push(`${location.pathname}?${queryParameters}`);
            }}
            initialFilters={initialFilters}
            includeItemNumber={true}
            includeForRequestNumber={item === 'expenses_with_request'}
            includeSettlementDate={[
              'expense',
              'benefit',
              'expenses_with_request',
              'benefit',
            ].includes(item)}
            includeLastActionPriorToDate
            includePendingApprovalAtUserList
            includeEntityList
            includeEmpoyeeList
          />
        </div>

        {getDataGroups()}
      </div>
    </>
  );
};

export default memo(connector(AggregatedDataView));
