import React, { Dispatch, useState, memo, useEffect } from 'react';
import {
  FilterBar,
  AppDrawer,
  NoData,
  StatusTag,
  DataFilter,
  ErrorBoundary,
  ElementOrSkeleton,
} from '../../../../shared/components';
import defaultUserImage from '../../../../assets/images/default/user.png';
import { connect, ConnectedProps } from 'react-redux';
import { Table, Button, Input, Avatar } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

import {
  fetchReportTabData,
  exportReport,
  fetchExportedDownloadList,
} from '../../reports.thunk';
import { useHistory } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import {
  setConfirmationInfo,
  resetConfirmationInfo,
} from '../../../app/app.actions';
import {
  IConfirmationInfo,
  IfetchWorkFlowDataProps,
} from '../../../app/app.model';
import { IWorkflowStatus } from '../../../../shared/model';
import { fetchWorkFlowData } from '../../../app/app.thunk';
import BenefitDetails from '../../../benefits/benefitDetail/benefitDetail.index';
import { tabs } from '../../reports.model';
import { Pagination } from 'antd';
import {
  getQueryParametersAsObject,
  generateQueryParamsString,
} from '../../../../utils/global.utils';
import { getAggregatedBenefitEntitlementsColumns } from '../../../admin/tableColumns.index';
import './benefitEntitlement.index.less';
import { Trans } from '@lingui/macro';

let initialPageSize = 12;
const ReportBenefitEntitlement: React.FC<ConnectedProps<typeof connector> & {
  source?: any;
  isActive?: boolean;
  defaultFilters?: { [x: string]: any };
}> = ({
  records,
  source,
  isLoading,
  _fetchRecords,
  _exportReport,
  _fetchWorkFlowData,
  _downloadReports,
  defaultFilters = {},
}) => {
  const [isItemExpanded, setItemExpanded] = useState<{
    visibility: boolean;
    item: null | any;
  }>({
    visibility: false,
    item: null,
  });
  const [currentStatus, setCurrentStatus] = useState<{
    status: {
      code: string;
      title: string;
    };
    id: number;
  } | null>(null);
  const [drawerTitle, setDrawerTitle] = useState<{
    type: string;
    title: any;
  }>({ type: '', title: <Trans id='' /> });
  const { push } = useHistory();
  const history = useHistory();
  const location = useLocation();
  const [isFilterVisible, setFilterVisible] = useState(false);
  let type: any = 'benefit_entitlement';
  const urlQueryParameters = getQueryParametersAsObject();
  let data = records;
  let localFilters = {
    ...defaultFilters,
    ...urlQueryParameters,
  };
  useEffect(() => {
    _fetchRecords(type, source, 1, localFilters, pageSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const onApplyFilters = (filters: any) => {
    localFilters = filters;
    _fetchRecords(type, source, 1, filters, pageSize);
    let queryParameters = generateQueryParamsString(filters);
    history.push(`${location.pathname}?${queryParameters}`);
  };
  const [pageSize, setPageSize] = useState(initialPageSize);
  const closeDetailsDrawer = () => {
    setItemExpanded({
      visibility: false,
      item: null,
    });
    setDrawerTitle({ type: '', title: <Trans id='' /> });
    setCurrentStatus(null);
  };

  const handleStatusTagClick = (id: number, _type?: string) => {
    _fetchWorkFlowData({ id: id, type: 'benefit' });
  };
  const handleSearchOnEmployeeColumn = (
    _selectedKeys: any[],
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
  const drawerTitleComponent = (
    <>
      {`Benefit Claim No. #${drawerTitle.title}`}
      <StatusTag
        status={currentStatus?.status as IWorkflowStatus}
        onStatusClick={handleStatusTagClick.bind(
          null,
          currentStatus?.id as number,
          drawerTitle.type as string,
        )}
      />
    </>
  );
  const getSearchableEmployeeColumn = () => {
    let column: any = [
      {
        title: <Trans>Employee</Trans>,
        key: 'employee',
        dataIndex: 'employee',
        filterDropdown: ({
          setSelectedKeys,
          selectedKeys,
          confirm,
          clearFilters,
        }: any) => (
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
  const columns = [
    ...getSearchableEmployeeColumn(),
    ...getAggregatedBenefitEntitlementsColumns(),
  ];
  const renderData = () => {
    return (
      <ElementOrSkeleton
        type='table'
        tableConfiguration={{ columns: 8, rows: 10 }}
        isLoading={isLoading}
      >
        {data && data?.data.length > 0 ? (
          <>
            <Table
              bordered
              pagination={false}
              columns={columns}
              dataSource={data?.data}
              rowKey={item => item.id}
              scroll={{ x: 800 }}
              size='middle'
              className='aggregated-view'
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
            {/* {data.pagination_data.next_page && (
              <LoadMore
                item={type}
                nextPage={data.pagination_data.next_page}
                filters={localFilters}
              />
            )} */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'row-reverse',
                marginTop: 12,
              }}
            >
              <Pagination
                defaultCurrent={1}
                current={records.current_page}
                onChange={(pageNumber: number, pageSize: any) => {
                  _fetchRecords(
                    type,
                    source,
                    pageNumber,
                    localFilters,
                    pageSize,
                  );
                }}
                hideOnSinglePage={false}
                pageSizeOptions={['10', '12', '20', '50', '100']}
                pageSize={pageSize || 12}
                showSizeChanger={true}
                onShowSizeChange={(_current: number, size: number) => {
                  setPageSize(size);
                }}
                total={records.pagination_data.total_records}
                showTotal={(total: number, range: number[]) => {
                  return <>{`${range[0]}-${range[1]} of ${total}`}</>;
                }}
                showQuickJumper={{
                  goButton: (
                    <Button type='default'>
                      <Trans>Go</Trans>
                    </Button>
                  ),
                }}
              />
            </div>
          </>
        ) : (
          <NoData />
        )}
      </ElementOrSkeleton>
    );
  };

  return (
    <>
      <ErrorBoundary>
        <FilterBar
          isAddButton={false}
          filterView={setFilterVisible}
          canExport={true}
          isFilterActive={isFilterVisible}
          onExport={() => _exportReport(type, source.token, localFilters)}
          showDownload={true}
          onDownload={_downloadReports}
        />
        <div style={{ marginBottom: 20 }}>
          <DataFilter
            page='REPRT'
            source={source}
            isVisible={isFilterVisible}
            includeStatusBar={false}
            includeLegalEntities={false}
            includeSaveFilterOption={false}
            includeDraftStatus={false}
            item='benefit_entitlement'
            onApplyFilters={onApplyFilters}
            onResetFilters={() => {
              localFilters = { ...defaultFilters };
              let queryString = generateQueryParamsString(localFilters);
              _fetchRecords(type, source, 1, localFilters, pageSize);
              history.push(`${location.pathname}?${queryString}`);
            }}
            includeForRequestNumber={false}
            includeSettlementDate={false}
            includeLastActionPriorToDate={false}
            includeItemNumber={true}
            includePendingApprovalAtUserList={false}
            includeDateRange={false}
            includeEntityList
            initialFilters={localFilters}
            includeEmpoyeeList
          />
        </div>
        <ErrorBoundary>{renderData()}</ErrorBoundary>
        <AppDrawer
          width={'80%'}
          visible={isItemExpanded.visibility}
          destroyOnClose={true}
          closable={true}
          onClose={closeDetailsDrawer}
          title={drawerTitleComponent}
          showCancelButton={false}
          showOkButton={false}
          getContainer={'.report-benefit-container'}
        >
          <BenefitDetails
            benefitClaimId={isItemExpanded?.item?.id}
            isAdmin={true}
          />
        </AppDrawer>
      </ErrorBoundary>
    </>
  );
};

const mapStateToProps = (state: any) => {
  const { benefit_entitlement, isLoader, success, reportCount } = state.reports;
  return {
    records: benefit_entitlement,
    isLoading: isLoader,
    success,
    reportCount,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  _fetchRecords: (
    type: tabs,
    source: any,
    page: number,
    filters?: any,
    pageSize?: number,
  ) => dispatch(fetchReportTabData(type, source, page, filters, pageSize)),
  _setConfirmationInfo: (data: IConfirmationInfo) =>
    dispatch(setConfirmationInfo(data)),
  _resetConfirmationInfo: () => dispatch(resetConfirmationInfo()),
  _fetchWorkFlowData: (props: IfetchWorkFlowDataProps) =>
    dispatch(fetchWorkFlowData(props)),
  _exportReport: (type: tabs, source: any, filters: any) =>
    dispatch(exportReport(type, source, filters)),
  _downloadReports: () => dispatch(fetchExportedDownloadList()),
});

const connector = connect(mapStateToProps, mapDispatchToProps);
export default connector(memo(ReportBenefitEntitlement));
