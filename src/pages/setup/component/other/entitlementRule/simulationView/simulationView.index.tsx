import React, { FC, memo, Dispatch, useEffect, useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useParams } from 'react-router';
import { Table, Tag, Button, Pagination } from 'antd';
import { Trans } from '@lingui/macro';
import {
  EyeOutlined,
  SyncOutlined,
  DownloadOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import { appPath } from '../../../../../app/app.routes';
import {
  ErrorBoundary,
  FilterBar,
  AppDrawer,
  HeaderBarWrapper,
} from '../../../../../../shared/components';
import {
  getSimulatedData,
  getSimulatedDataById,
  downloadSimulatedResult,
} from '../../../../../../shared/redux/entitlementRule/entitlementRules.thunk';
import { getFormattedDate } from '../../../../../../utils/scroll.utils';
import {
  fetchSimulatedListData,
  fetchSimulatedEntitlementData,
} from '../../../../../../shared/redux/entitlementRule/entitlementRules.action';
import {
  getSimulatedDataListLoader,
  getSimulatedEntitlementDataLoader,
  getSimulatedListData,
  getSimulatedEntitementData,
} from '../../../../../../shared/redux/rootReducer';

import './simulationView.index.less';

const SimulationView: FC<ConnectedProps<typeof connector>> = ({
  isSimulatedDataListLoading,
  isSimulatedEntitlementDataLoading,
  simulatedListData,
  simulatedEntitlementData,
  _getSimulatedData,
  _getSimulatedDataById,
  _downloadSimulatedResult,
  _fetchSimulatedListData,
  _fetchSimulatedEntitlementData,
}) => {
  // let simulatedListPageSize = 10;
  // let simulatedListCurrentPage = 1;
  // let entitledListPageSize = 10;
  // let entitledListCurrentPage = 1;

  const { id } = useParams();
  const [isSimulateModalVisible, setIsSimulateModalVisible] = useState(false);
  const [selectedId, setSelectedId] = useState(0);

  const [simulatedListPageSize] = useState(10);
  const [simulatedListCurrentPage, setSimulatedListCurrentPage] = useState(1);
  const [entitledListPageSize] = useState(10);
  const [entitledListCurrentPage, setEntitledListCurrentPage] = useState(1);
  const [selectedType, setSelectedType] = useState('');

  const [simulatedDataId, setSimulatedDataId] = useState(null);

  const deleteDownload =
    simulatedEntitlementData?.data?.length === 0 ? true : false;
  const onChangePagination = (
    page: number,
    pageSize: number,
    simulatedList = false,
  ) => {
    simulatedList
      ? _getSimulatedData(parseInt(id), page, pageSize)
      : _getSimulatedDataById(selectedId, page, pageSize);
  };
  const viewSimulatedDataById = (dataId: any) => {
    _fetchSimulatedEntitlementData([]);
    setIsSimulateModalVisible(true);
    setSelectedId(dataId);
    _getSimulatedDataById(
      dataId,
      simulatedListCurrentPage,
      simulatedListPageSize,
    );
    setSimulatedDataId(dataId);
  };
  const getStatusButton = (val: any, dataId: any) => {
    return val.code === 'COMPLETED' ? (
      <Tag
        icon={<EyeOutlined />}
        color='processing'
        className='simulation-tags simulation-tags_button'
        onClick={_ => viewSimulatedDataById(dataId)}
      >
        <Trans>View</Trans>
      </Tag>
    ) : val.code === 'RUNNING' ? (
      <Tag
        icon={<SyncOutlined spin />}
        color='warning'
        className='simulation-tags'
      >
        <Trans>Processing</Trans>
      </Tag>
    ) : (
      <Tag
        icon={<CloseCircleOutlined />}
        color='error'
        className='simulation-tags'
      >
        <Trans>Error</Trans>
      </Tag>
    );
  };
  const simulatedDataList = [
    {
      key: 'SIMULATED_BY',
      title: () => <Trans>Simulated By</Trans>,
      align: 'center' as 'center',
      dataIndex: 'created_by',
      render: (_val: any) => _val.legal_name,
    },
    {
      key: 'SIMULATED_ON',
      title: () => <Trans>Simulated On</Trans>,
      align: 'center' as 'center',
      dataIndex: 'created_on',
      render: (val: any) => getFormattedDate(val) || '-',
    },
    {
      key: 'STATUS',
      title: () => <Trans>Status</Trans>,
      align: 'center' as 'center',
      dataIndex: 'status',
      render: (_val: any, item: any) => getStatusButton(_val, item.id),
    },
  ];
  const simulatedDataItemsColumns = [
    {
      key: 'EMPLOYEE_ID',
      title: () => <Trans>Employee Id</Trans>,
      dataIndex: 'employee',
      fixed: 'left' as 'left',
      width: 170,
      render: (_val: any, item: any) => {
        return item ? item.employee?.emp_id || '-' : '';
      },
    },
    {
      key: 'EMPLOYEE',
      title: () => <Trans>Employee</Trans>,
      dataIndex: 'employee',
      width: '10%',
      render: (_val: any, item: any) => {
        return item ? item.employee?.name : '';
      },
    },
    {
      key: 'AMOUNT',
      title: () => <Trans>Amount</Trans>,
      dataIndex: 'amount',
      render: (_val: any, item: any) => {
        let amount = item?.amount
          ? item.amount
          : selectedType === 'EXP'
          ? item?.is_unlimited_amount
            ? item?.is_unlimited_amount
            : '-'
          : '-';
        return amount;
      },
    },
    {
      key: 'START_DATE',
      title: () => <Trans>Start Date</Trans>,
      dataIndex: 'start_date',
      render: (val: any) => (val ? getFormattedDate(val) : '-'),
    },
    {
      key: 'END_DATE',
      title: () => <Trans>End Date</Trans>,
      dataIndex: 'end_date',
      render: (val: any) => (val ? getFormattedDate(val) : '-'),
    },
    {
      key: 'MIN_VALUE',
      title: () => <Trans>Min. Claim</Trans>,
      dataIndex: 'min_claim_amount',
      render: (_val: any, item: any) => {
        let min_claim_amount = item?.min_claim_amount
          ? item.min_claim_amount
          : selectedType === 'EXP'
          ? item?.min_amount
            ? item?.min_amount
            : '-'
          : '-';
        return min_claim_amount;
      },
    },
    {
      key: 'MAX_VALUE',
      title: () => <Trans>Max. Claim</Trans>,
      dataIndex: 'max_claim_amount',
      render: (_val: any, item: any) => {
        let max_claim_amount = item?.max_claim_amount
          ? item.max_claim_amount
          : selectedType === 'EXP'
          ? item?.max_amount
            ? item?.max_amount
            : '-'
          : '-';
        return max_claim_amount;
      },
    },
  ];
  useEffect(() => {
    if (simulatedListData?.data?.length > 0 && !selectedType) {
      setSelectedType(simulatedListData.data[0].entitlement_rule.process.code);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [simulatedListData]);

  if (selectedType === 'BEN') {
    simulatedDataItemsColumns.splice(2, 0, {
      key: 'BENEFIT_TYPE',
      title: () => <Trans>Benefit Type</Trans>,
      dataIndex: 'benefit_type',
      render: (_val: any, item: any) =>
        item ? item.entitlement_rule?.benefit_type_title : '',
    });
    simulatedDataItemsColumns.push(
      {
        key: 'COPAY',
        title: () => <Trans>Copay</Trans>,
        dataIndex: 'copay_value',
        render: (_val: any, item: any) =>
          item.copay_value > 0 ? item.copay_value : '-',
      },
      {
        key: 'PAYABLE',
        title: () => <Trans>Payable Percent</Trans>,
        dataIndex: 'payable_percent',
        render: (_val: any, item: any) =>
          item.payable_percent > 0 ? item.payable_percent + '%' : '-',
      },
    );
  }
  if (selectedType === 'EXP') {
    simulatedDataItemsColumns.splice(2, 0, {
      key: 'EXPENSE_TYPE',
      title: () => <Trans>Expense Type</Trans>,
      dataIndex: 'expense_type',
      render: (_val: any, item: any) =>
        item ? item.entitlement_rule?.expense_type_title : '',
    });
  }
  useEffect(() => {
    setSelectedType('');
    _fetchSimulatedListData([]);
    _getSimulatedData(
      parseInt(id),
      entitledListCurrentPage,
      entitledListPageSize,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <HeaderBarWrapper
      headerCommonProps={{ title: <Trans>Simulated List</Trans> }}
    >
      <div className='entitlement-rule-listing-container'>
        <FilterBar
          isAddButton={false}
          enableBackBtn={true}
          backBtnUrl={appPath.config_setup.entitlementRules.path}
        />
        <Table
          columns={simulatedDataList}
          dataSource={simulatedListData.data}
          bordered
          loading={isSimulatedDataListLoading}
          pagination={false}
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
            current={simulatedListCurrentPage || 1}
            onChange={(pageNumber: number) => {
              setSimulatedListCurrentPage(pageNumber);
              onChangePagination(pageNumber, simulatedListPageSize, true);
            }}
            hideOnSinglePage={false}
            showSizeChanger={false}
            total={simulatedListData.pagination_data?.total_records}
            showQuickJumper={{
              goButton: (
                <Button type='default'>
                  <Trans>Go</Trans>
                </Button>
              ),
            }}
          />
        </div>
        <ErrorBoundary>
          <AppDrawer
            visible={isSimulateModalVisible}
            title={<Trans>Entitlement Data</Trans>}
            destroyOnClose={true}
            closable={true}
            onClose={_ => setIsSimulateModalVisible(false)}
            showCancelButton={false}
            showOkButton={false}
            width='80%'
            getContainer='.entitlement-rule-listing-container'
          >
            <>
              <div className='simulate-download-container'>
                <Button
                  type='link'
                  onClick={_ => _downloadSimulatedResult(simulatedDataId)}
                  className='menu-button simulate-download'
                  disabled={deleteDownload}
                >
                  <DownloadOutlined style={{ marginRight: 8 }} />
                  <Trans>Download</Trans>
                </Button>
              </div>

              <Table
                columns={simulatedDataItemsColumns}
                dataSource={simulatedEntitlementData.data}
                bordered
                scroll={{ x: 1200 }}
                size='middle'
                loading={isSimulatedEntitlementDataLoading}
                pagination={false}
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
                  current={entitledListCurrentPage || 1}
                  onChange={(pageNumber: number) => {
                    setEntitledListCurrentPage(pageNumber);
                    onChangePagination(pageNumber, entitledListPageSize);
                  }}
                  hideOnSinglePage={false}
                  showSizeChanger={false}
                  showQuickJumper={{
                    goButton: (
                      <Button type='default'>
                        <Trans>Go</Trans>
                      </Button>
                    ),
                  }}
                  total={
                    simulatedEntitlementData.pagination_data?.total_records
                  }
                />
              </div>
            </>
          </AppDrawer>
        </ErrorBoundary>
      </div>
    </HeaderBarWrapper>
  );
};

const mapStateToProps = (state: any) => ({
  simulatedListData: getSimulatedListData(state),
  isSimulatedDataListLoading: getSimulatedDataListLoader(state),
  isSimulatedEntitlementDataLoading: getSimulatedEntitlementDataLoader(state),
  simulatedEntitlementData: getSimulatedEntitementData(state),
});

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  _getSimulatedData: (id: number, page: number, pageSize: number) =>
    dispatch(getSimulatedData(id, page, pageSize)),
  _getSimulatedDataById: (id: number, page: number, pageSize: number) =>
    dispatch(getSimulatedDataById(id, page, pageSize)),
  _downloadSimulatedResult: (id: any) => dispatch(downloadSimulatedResult(id)),
  _fetchSimulatedListData: (data: any) =>
    dispatch(fetchSimulatedListData(data)),
  _fetchSimulatedEntitlementData: (data: any) =>
    dispatch(fetchSimulatedEntitlementData(data)),
});

const connector = connect(mapStateToProps, mapDispatchToProps);
export default memo(connector(SimulationView));
