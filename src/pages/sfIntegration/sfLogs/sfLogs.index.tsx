import React, { Dispatch, useEffect, useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import {
  AppDrawer,
  ErrorBoundary,
  DotMenu,
  ElementOrSkeleton,
  NoData,
} from '../../../shared/components';
import LOGDETAILPAGE from './sfLogDetail.index';
import { getLogList, onDownloadClick } from './sfLogs.thunk';
import {
  EllipsisOutlined,
  EyeOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import { Button, Pagination, Table, Tag } from 'antd';
import moment from 'moment';
import './sfLogs.index.less';
import SFFILTERSECTION from './sfFilter.index';
import { Trans } from '@lingui/macro';
import {
  setApproversCustomFieldsListData,
  setEmployeeApproversCFData,
  setDependentInfoCFListData,
  setEmployeeDependentInfoListData,
} from './sfLogs.actions';

let page = 1;
const LOGS: React.FC<ConnectedProps<typeof connector>> = ({
  logList,
  logListLoader,

  _onDownloadClick,
  _getLogList,
  _setApproversCustomFieldsListData,
  _setEmployeeApproversCFData,
  _setDependentInfoCFListData,
  _setEmployeeDependentInfoListData,
}) => {
  const [openDetailDrawer, setOpenDetailDrawer] = useState(false);
  const [searchKey, setSearchKey] = useState('');
  const [user, setUser] = useState<any>({});
  useEffect(() => {
    _getLogList(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const onDownloadClick = (record: any) => {
    const year = moment().format('YYYY');
    const month = moment().format('MM');
    const Day = moment().format('DD');
    const Hour = moment().format('HH');
    const Min = moment().format('mm');
    const fileName = `${record.username}_${year}${month}${Day}${Hour}${Min}.xlsx`;
    _onDownloadClick(record?.id, fileName);
  };
  const onSearchClick = (key: any) => {
    _getLogList(1, key);
    setSearchKey(key);
  };
  const openDetailView = (record: any) => {
    setUser(record);
    setOpenDetailDrawer(true);
  };
  const closeDetailDrawer = () => {
    setOpenDetailDrawer(false);
    setUser({});
    _setApproversCustomFieldsListData({});
    _setEmployeeApproversCFData({});
    _setDependentInfoCFListData({});
    _setEmployeeDependentInfoListData({});
  };
  const changePage = (pageNumber: number) => {
    _getLogList(pageNumber, searchKey);
    page = pageNumber;
  };
  const columns = [
    {
      key: 'name',
      title: <Trans>Name</Trans>,
      dataIndex: 'name',
      align: 'center' as 'center',
      render: (data: any) => data || '-',
    },
    {
      key: 'emp_id',
      title: <Trans>Employee Id</Trans>,
      dataIndex: 'emp_id',
      align: 'center' as 'center',
      render: (data: any) => data || '-',
    },
    {
      key: 'username',
      title: <Trans>Username</Trans>,
      dataIndex: 'username',
      align: 'center' as 'center',
      render: (data: any) => data || '-',
    },
    {
      key: 'legal_name',
      title: <Trans>Legal Name</Trans>,
      dataIndex: 'legal_name',
      align: 'center' as 'center',
      render: (data: any) => data || '-',
    },
    {
      key: 'email',
      title: <Trans>Email Id</Trans>,
      dataIndex: 'email',
      align: 'center' as 'center',
      render: (data: any) => data || '-',
    },
    {
      title: <Trans>Action</Trans>,
      dataIndex: 'action',
      key: 'action',
      width: '10%',
      align: 'center' as 'center',
      render: (_: any, record: any) => {
        return (
          <div>
            <DotMenu
              data-test='actions'
              actionBtn={[
                {
                  Type: 'link',
                  icon: EyeOutlined,
                  children: 'View',
                  title: 'View',
                  OnClick: () => openDetailView(record),
                },
                {
                  Type: 'link',
                  icon: DownloadOutlined,
                  children: 'Download',
                  title: <Trans>Download</Trans>,
                  OnClick: () => onDownloadClick(record),
                },
              ]}
            >
              <EllipsisOutlined />
            </DotMenu>
          </div>
        );
      },
    },
  ];
  return (
    <ErrorBoundary>
      <div className='sf-log-container'>
        <div className='sf-log-filter-section'>
          <SFFILTERSECTION onSearchClick={onSearchClick} />
        </div>
        {logListLoader ? (
          <ElementOrSkeleton
            isLoading={logListLoader}
            type={'table'}
            tableConfiguration={{ columns: 8, rows: 10 }}
          />
        ) : (
          <>
            {logList?.data?.length > 0 ? (
              <>
                <Table
                  dataSource={
                    logListLoader ? new Array(10).fill({}) : logList.data
                  }
                  columns={columns}
                  pagination={false}
                  bordered
                />
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row-reverse',
                    marginTop: 12,
                  }}
                >
                  <Pagination
                    current={page}
                    onChange={changePage}
                    hideOnSinglePage={true}
                    pageSize={12}
                    showSizeChanger={false}
                    total={logList.pagination_data?.total_records}
                    showQuickJumper
                  />
                </div>
              </>
            ) : (
              <NoData />
            )}
          </>
        )}
        <AppDrawer
          title={
            <div className='sf-log-drawer-title'>
              <div>
                {' '}
                {user?.name}{' '}
                <span className='sf-log-drawer-title-tag'>
                  {user?.is_active ? (
                    <Tag color='success'>
                      <Trans>Active</Trans>
                    </Tag>
                  ) : (
                    <Tag color='error'>
                      <Trans>Inactive</Trans>
                    </Tag>
                  )}
                </span>
              </div>
              <Button
                className='custom-primary-btn'
                data-test='custom-primary-btn'
                icon={<DownloadOutlined />}
                onClick={() => onDownloadClick(user)}
              >
                <Trans>Download</Trans>
              </Button>
            </div>
          }
          visible={openDetailDrawer}
          destroyOnClose={true}
          width='82%'
          closable={true}
          onClose={closeDetailDrawer}
          showCancelButton={false}
          showOkButton={false}
        >
          <LOGDETAILPAGE user={user} />
        </AppDrawer>
      </div>
    </ErrorBoundary>
  );
};

const mapStateToProps = (state: any) => {
  const { logList, logListLoader } = state.SfLogsReducer;
  return { logList, logListLoader };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  _getLogList: (pageNumber: any, query?: any) =>
    dispatch(getLogList(pageNumber, query)),
  _onDownloadClick: (id: any, fileName: any) =>
    dispatch(onDownloadClick(id, fileName)),
  _setApproversCustomFieldsListData: (data: any) =>
    dispatch(setApproversCustomFieldsListData(data)),
  _setEmployeeApproversCFData: (data: any) =>
    dispatch(setEmployeeApproversCFData(data)),
  _setDependentInfoCFListData: (data: any) =>
    dispatch(setDependentInfoCFListData(data)),
  _setEmployeeDependentInfoListData: (data: any) =>
    dispatch(setEmployeeDependentInfoListData(data)),
});
const connector = connect(mapStateToProps, mapDispatchToProps);
export default connector(LOGS);
