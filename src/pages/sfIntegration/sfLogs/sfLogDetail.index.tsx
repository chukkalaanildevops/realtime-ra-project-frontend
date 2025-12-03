import React, { Dispatch, FC, useEffect, useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import {
  ElementOrSkeleton,
  ErrorBoundary,
  NoData,
} from '../../../shared/components';
import { getPermissions } from '../../../shared/redux/rootReducer';
import {
  getBasicInfoColumn,
  getJobInfoColumn,
  getBankInfoColumn,
  getApproverColumn,
  getEmployeeApproverCustomFieldsColumn,
  getDependentInfoColumn,
} from './tableColumns.index';
import {
  getLogDetailList,
  deleteEmployeeBasicInfo,
  deleteEmployeeJobInfo,
  deleteEmployeeApprovers,
  deleteEmployeeBankDetails,
  fetchApproversCustomFieldsList,
  fetchEmployeeApproversCFData,
  deleteEmployeeApproversCustomField,
  fetchDependenInfoCFList,
  fetchEmployeeDependentInfoData,
  deleteEmployeeDependentInfo,
} from './sfLogs.thunk';
import {
  setConfirmationInfo,
  resetConfirmationInfo,
} from '../../app/app.actions';
import { Button, Col, Pagination, Row, Table, Tabs } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import './sfLogs.index.less';
import { Trans } from '@lingui/macro';
import moment from 'moment';
import {
  setEmployeeApproversCFData,
  setApproversCustomFieldsListData,
  setEmployeeDependentInfoListData,
  setDependentInfoCFListData,
} from './sfLogs.actions';

const rowGutter: [number, number] = [24, 24];
const LOGDETAILPAGE: React.FC<ConnectedProps<typeof connector> & {
  user: any;
}> = ({
  user,
  logDetailData,
  logDetailDataListLoader,
  permissions,
  _setConfirmationInfo,
  _resetConfirmationInfo,
  _getLogDetailList,
  _deleteEmployeeBasicInfo,
  _deleteEmployeeJobInfo,
  _deleteEmployeeApprovers,
  _deleteEmployeeBankDetails,
  employeeApproversCFData,
  employeeApproversCFListLoader,
  approversCustomFieldsListData,
  _fetchApproversCustomFieldsList,
  _fetchEmployeeApproversCFData,
  _setApproversCustomFieldsListData,
  _setEmployeeApproversCFData,
  _deleteEmployeeApproversCustomField,
  _fetchDependenInfoCFList,
  _fetchEmployeeDependentInfoData,
  _deleteEmployeeDependentInfo,
  dependentInfoCFListData,
  employeeDependentInfoListData,
  dependentInfoListLoader,
  _setDependentInfoCFListData,
  _setEmployeeDependentInfoListData,
}) => {
  const [tab, setTab] = useState<any>('EMPBASIC');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [dependentPage, setDependentPage] = useState(1);
  const [dependentPageSize, setDependentPageSize] = useState(12);

  useEffect(() => {
    _setApproversCustomFieldsListData({});
    _setEmployeeApproversCFData({});
    setPage(1);
    setPageSize(12);
    _setDependentInfoCFListData({});
    _setEmployeeDependentInfoListData({});
    setDependentPage(1);
    setDependentPageSize(12);
    _getLogDetailList(user.id, tab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (approversCustomFieldsListData?.data && tab === 'EMPAPPROVER') {
      approversCustomFieldsListData?.data?.length === 0 &&
        _getLogDetailList(user.id, tab);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [approversCustomFieldsListData]);

  const handleTabClick = (key: string) => {
    if (key !== 'EMPAPPROVER') {
      _setApproversCustomFieldsListData({});
      _setEmployeeApproversCFData({});
      setPage(1);
      setPageSize(12);
    }

    if (key !== 'EMPDEPENDENT') {
      _setDependentInfoCFListData({});
      _setEmployeeDependentInfoListData({});
      setDependentPage(1);
      setDependentPageSize(12);
    }

    setTab(key);
    key === 'EMPAPPROVER' &&
      _fetchApproversCustomFieldsList(
        page,
        pageSize,
        user?.id,
        moment().format('YYYY/MM/DD'),
        '-effective_from',
      );

    key === 'EMPDEPENDENT' &&
      _fetchDependenInfoCFList(
        dependentPage,
        dependentPageSize,
        user?.id,
        moment().format('YYYY/MM/DD'),
        '-effective_from',
      );

    if (key !== 'EMPAPPROVER' && key !== 'EMPDEPENDENT') {
      _getLogDetailList(user.id, key);
    }
  };
  const onDeleteButtonClick = (id: any, empId: any) => {
    _setConfirmationInfo({
      bodyText: 'Do you want to delete record?',
      cancelText: 'Cancel',
      okText: 'Delete',
      visibility: true,
      extraInfo: '',
      forWhat: '',
      headerText: 'Confirmation',
      cancelBtnFn: _resetConfirmationInfo,
      okBtnFn: () => {
        switch (tab) {
          case 'EMPBASIC':
            _deleteEmployeeBasicInfo(id, empId, tab);

            break;
          case 'EMPJOB':
            _deleteEmployeeJobInfo(id, empId, tab);
            break;
          case 'EMPBANK':
            _deleteEmployeeBankDetails(id, empId, tab);
            break;
          case 'EMPAPPROVER':
            approversCustomFieldsListData?.data?.length > 0
              ? _deleteEmployeeApproversCustomField(
                  id,
                  1,
                  12,
                  empId,
                  moment().format('YYYY/MM/DD'),
                  '-effective_from',
                  approversCustomFieldsListData?.data,
                  () => {
                    setPage(1);
                    setPageSize(12);
                  },
                )
              : _deleteEmployeeApprovers(id, empId, tab);
            break;
          case 'EMPDEPENDENT':
            _deleteEmployeeDependentInfo(
              id,
              1,
              12,
              empId,
              moment().format('YYYY/MM/DD'),
              '-effective_from',
              dependentInfoCFListData?.data,
              () => {
                setDependentPage(1);
                setDependentPageSize(12);
              },
            );
            break;
          default:
            break;
        }
        _resetConfirmationInfo();
      },
    });
  };

  const onChangePagination = (page: number, pageSize?: any) => {
    _fetchEmployeeApproversCFData(
      page,
      pageSize,
      user?.id,
      moment().format('YYYY/MM/DD'),
      '-effective_from',
      approversCustomFieldsListData?.data,
    );
  };

  const onChangeDependentPagination = (page: number, pageSize?: any) => {
    _fetchEmployeeDependentInfoData(
      page,
      pageSize,
      user?.id,
      moment().format('YYYY/MM/DD'),
      '-effective_from',
      dependentInfoCFListData?.data,
    );
  };

  const getTableData = (key: any) => {
    let columns: ColumnsType<any> = [];
    switch (key) {
      case 'EMPBASIC':
        columns = [
          ...getBasicInfoColumn(
            onDeleteButtonClick,
            permissions,
            logDetailData,
          ),
        ];
        break;
      case 'EMPJOB':
        columns = [
          ...getJobInfoColumn(
            logDetailData[0],
            onDeleteButtonClick,
            permissions,
            logDetailData,
          ),
        ];
        break;
      case 'EMPBANK':
        columns = [
          ...getBankInfoColumn(onDeleteButtonClick, permissions, logDetailData),
        ];
        break;
      case 'EMPAPPROVER':
        approversCustomFieldsListData?.data?.length > 0
          ? (columns = [
              ...getEmployeeApproverCustomFieldsColumn(
                onDeleteButtonClick,
                permissions,
                employeeApproversCFData?.data,
                approversCustomFieldsListData?.data,
              ),
            ])
          : (columns = [
              ...getApproverColumn(
                onDeleteButtonClick,
                permissions,
                logDetailData,
              ),
            ]);

        break;
      case 'EMPDEPENDENT':
        columns = [
          ...getDependentInfoColumn(
            onDeleteButtonClick,
            permissions,
            dependentInfoCFListData?.data,
          ),
        ];
        break;
      default:
        break;
    }
    return (
      <>
        <ElementOrSkeleton
          isLoading={
            employeeApproversCFListLoader
              ? employeeApproversCFListLoader
              : dependentInfoListLoader
              ? dependentInfoListLoader
              : logDetailDataListLoader
          }
          type={'table'}
          tableConfiguration={{ columns: 8, rows: 1 }}
        >
          {approversCustomFieldsListData?.data?.length > 0 ? (
            <>
              <Table
                dataSource={employeeApproversCFData?.data}
                columns={columns}
                pagination={false}
                scroll={{
                  x: true,
                }}
                bordered
                rowKey={record => record.id}
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
                  current={page}
                  onChange={(page: number, pageSize: any) => {
                    onChangePagination(page, pageSize);
                    setPage(page);
                    setPageSize(pageSize);
                  }}
                  hideOnSinglePage={false}
                  pageSizeOptions={['10', '12', '20', '50', '100']}
                  showSizeChanger={true}
                  pageSize={pageSize || 12}
                  onShowSizeChange={(size: number) => {
                    setPageSize(size);
                  }}
                  total={
                    employeeApproversCFData?.pagination_data?.total_records
                  }
                  showTotal={(total: number, range: number[]) => {
                    return <>{`${range[0]}-${range[1]} of ${total}`}</>;
                  }}
                  showQuickJumper={{
                    goButton: <Button type='default'>Go</Button>,
                  }}
                />
              </div>
            </>
          ) : tab === 'EMPDEPENDENT' ? (
            <>
              <Table
                dataSource={employeeDependentInfoListData?.data}
                columns={columns}
                pagination={false}
                scroll={{
                  x: true,
                }}
                bordered
                rowKey={record => record.id}
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
                  current={dependentPage}
                  onChange={(page: number, pageSize: any) => {
                    onChangeDependentPagination(page, pageSize);
                    setDependentPage(page);
                    setDependentPageSize(pageSize);
                  }}
                  hideOnSinglePage={false}
                  pageSizeOptions={['10', '12', '20', '50', '100']}
                  showSizeChanger={true}
                  pageSize={dependentPageSize || 12}
                  onShowSizeChange={(size: number) => {
                    setDependentPageSize(size);
                  }}
                  total={
                    employeeDependentInfoListData?.pagination_data
                      ?.total_records
                  }
                  showTotal={(total: number, range: number[]) => {
                    return <>{`${range[0]}-${range[1]} of ${total}`}</>;
                  }}
                  showQuickJumper={{
                    goButton: <Button type='default'>Go</Button>,
                  }}
                />
              </div>
            </>
          ) : logDetailData?.length > 0 ? (
            <Table
              dataSource={
                logDetailDataListLoader ? new Array(10).fill({}) : logDetailData
              }
              columns={columns}
              pagination={false}
              scroll={{
                x: true,
              }}
              bordered
            />
          ) : (
            <NoData />
          )}
        </ElementOrSkeleton>
      </>
    );
  };
  return (
    <ErrorBoundary>
      <>
        <Row gutter={rowGutter} className={`detail-View-componet`}>
          <Col xxl={8} xl={8} md={8} lg={8} sm={24} xs={24}>
            <GetFieldStructure label={<Trans>Username</Trans>}>
              {user.username || '-'}
            </GetFieldStructure>
          </Col>
          <Col xxl={8} xl={8} md={8} lg={8} sm={24} xs={24}>
            <GetFieldStructure label={<Trans>Employee ID</Trans>}>
              {user.emp_id || '-'}
            </GetFieldStructure>
          </Col>
          <Col xxl={8} xl={8} md={8} lg={8} sm={24} xs={24}>
            <GetFieldStructure label={<Trans>Legal Name</Trans>}>
              {user.legal_name || '-'}
            </GetFieldStructure>
          </Col>
          <Col xxl={24} xl={24} md={24} lg={24} sm={24} xs={24}>
            <GetFieldStructure label={<Trans>Roles</Trans>}>
              {user?.roles?.map((value: any) => {
                return `${value.title}(${value.code}) , `;
              }) || '-'}
            </GetFieldStructure>
          </Col>
        </Row>
        <Row gutter={rowGutter} className='sf-detail-tabs-container'>
          <Col xs={24}>
            <Tabs
              activeKey={tab}
              onChange={handleTabClick}
              className='sf-log-detail-tab'
            >
              <Tabs.TabPane key='EMPBASIC' tab={<Trans>Basic Info</Trans>}>
                {getTableData('EMPBASIC')}
              </Tabs.TabPane>
              <Tabs.TabPane key='EMPJOB' tab={<Trans>Job Info</Trans>}>
                {getTableData('EMPJOB')}
              </Tabs.TabPane>
              <Tabs.TabPane key='EMPBANK' tab={<Trans>Bank Info</Trans>}>
                {getTableData('EMPBANK')}
              </Tabs.TabPane>
              <Tabs.TabPane key='EMPAPPROVER' tab={<Trans>Approvers</Trans>}>
                {getTableData('EMPAPPROVER')}
              </Tabs.TabPane>
              <Tabs.TabPane
                key='EMPDEPENDENT'
                tab={<Trans>Dependent Info</Trans>}
              >
                {getTableData('EMPDEPENDENT')}
              </Tabs.TabPane>
            </Tabs>
          </Col>
        </Row>
      </>
    </ErrorBoundary>
  );
};

const mapStateToProps = (state: any) => {
  const {
    logDetailData,
    logDetailDataListLoader,
    approversCustomFieldsListData,
    employeeApproversCFData,
    employeeApproversCFListLoader,
    dependentInfoCFListData,
    employeeDependentInfoListData,
    dependentInfoListLoader,
  } = state.SfLogsReducer;
  return {
    logDetailData,
    logDetailDataListLoader,
    permissions: getPermissions(state),
    approversCustomFieldsListData,
    employeeApproversCFData,
    employeeApproversCFListLoader,
    dependentInfoCFListData,
    employeeDependentInfoListData,
    dependentInfoListLoader,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  _getLogDetailList: (pageNumber: any, type: any) =>
    dispatch(getLogDetailList(pageNumber, type)),
  _deleteEmployeeBasicInfo: (id: number, userId: any, type: any) =>
    dispatch(deleteEmployeeBasicInfo(id, userId, type)),
  _deleteEmployeeJobInfo: (id: number, userId: any, type: any) =>
    dispatch(deleteEmployeeJobInfo(id, userId, type)),
  _deleteEmployeeApprovers: (id: number, userId: any, type: any) =>
    dispatch(deleteEmployeeApprovers(id, userId, type)),
  _deleteEmployeeBankDetails: (id: number, userId: any, type: any) =>
    dispatch(deleteEmployeeBankDetails(id, userId, type)),
  _setConfirmationInfo: (data: any) => dispatch(setConfirmationInfo(data)),
  _resetConfirmationInfo: () => dispatch(resetConfirmationInfo()),
  _fetchApproversCustomFieldsList: (
    page: number,
    pageSize?: number,
    employeeId?: number,
    effective_from__lte?: any,
    sort?: any,
  ) =>
    dispatch(
      fetchApproversCustomFieldsList(
        page,
        pageSize,
        employeeId,
        effective_from__lte,
        sort,
      ),
    ),
  _fetchEmployeeApproversCFData: (
    page: number,
    pageSize?: number,
    employeeId?: number,
    effective_from__lte?: any,
    sort?: any,
    approversCustomFieldsListData?: any,
  ) =>
    dispatch(
      fetchEmployeeApproversCFData(
        page,
        pageSize,
        employeeId,
        effective_from__lte,
        sort,
        approversCustomFieldsListData,
      ),
    ),
  _setApproversCustomFieldsListData: (data: any) =>
    dispatch(setApproversCustomFieldsListData(data)),
  _setEmployeeApproversCFData: (data: any) =>
    dispatch(setEmployeeApproversCFData(data)),
  _deleteEmployeeApproversCustomField: (
    id: number,
    page: number,
    pageSize?: number,
    employeeId?: number,
    effective_from__lte?: any,
    sort?: any,
    approversCustomFieldsListData?: any,
    callback?: Function,
  ) =>
    dispatch(
      deleteEmployeeApproversCustomField(
        id,
        page,
        pageSize,
        employeeId,
        effective_from__lte,
        sort,
        approversCustomFieldsListData,
        callback,
      ),
    ),

  _fetchDependenInfoCFList: (
    page: number,
    pageSize?: number,
    employeeId?: number,
    effective_from__lte?: any,
    sort?: any,
  ) =>
    dispatch(
      fetchDependenInfoCFList(
        page,
        pageSize,
        employeeId,
        effective_from__lte,
        sort,
      ),
    ),
  _fetchEmployeeDependentInfoData: (
    page: number,
    pageSize?: number,
    employeeId?: number,
    effective_from__lte?: any,
    sort?: any,
    dependentInfoCFListData?: any,
  ) =>
    dispatch(
      fetchEmployeeDependentInfoData(
        page,
        pageSize,
        employeeId,
        effective_from__lte,
        sort,
        dependentInfoCFListData,
      ),
    ),
  _setDependentInfoCFListData: (data: any) =>
    dispatch(setDependentInfoCFListData(data)),
  _setEmployeeDependentInfoListData: (data: any) =>
    dispatch(setEmployeeDependentInfoListData(data)),
  _deleteEmployeeDependentInfo: (
    id: number,
    page: number,
    pageSize?: number,
    employeeId?: number,
    effective_from__lte?: any,
    sort?: any,
    dependentInfoCFListData?: any,
    callback?: Function,
  ) =>
    dispatch(
      deleteEmployeeDependentInfo(
        id,
        page,
        pageSize,
        employeeId,
        effective_from__lte,
        sort,
        dependentInfoCFListData,
        callback,
      ),
    ),
});
const connector = connect(mapStateToProps, mapDispatchToProps);
export default connector(LOGDETAILPAGE);

const GetFieldStructure: FC<{
  label: any;
  noBg?: boolean;
  hideChild?: boolean;
}> = props => {
  return (
    <div className={`detail-field ${props?.noBg ? 'no-bg' : ''}`}>
      <div className='field-label'>{props.label}</div>
      {props.hideChild ? null : (
        <div className='field-value'>{props.children}</div>
      )}
    </div>
  );
};
