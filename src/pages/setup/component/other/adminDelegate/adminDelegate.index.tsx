import { Button, Table, Switch, Row, Col, Form, DatePicker } from 'antd';
import React, { Dispatch, memo, useEffect, useState } from 'react';
import {
  // PlusOutlined,
  // FilterOutlined,
  EllipsisOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { Trans } from '@lingui/macro';
import {
  generateQueryParamsString,
  getQueryParametersAsObject,
} from '../../../../../utils/global.utils';
import AdminDelegationDataFilter from './component/filters/filters.index';
import {
  AppDrawer,
  // BackButton,
  DotMenu,
  ElementOrSkeleton,
  FilterBar,
  HeaderBarWrapper,
  SearchableUserDropdown,
  StatusTag,
} from '../../../../../shared/components';
import { actionBtnObjInterface } from '../../../../../shared/components/dotMenu/dotMenu.model';
// import { getPermissions, stateInterface } from '../../shared/redux/rootReducer';
import { stateInterface } from '../../../../../shared/redux/rootReducer';
import { connect, ConnectedProps } from 'react-redux';
import { IAdminDelegateState } from './adminDelegate.model';
import {
  createOrUpdateDelegationRecord,
  deleteDelegation,
  fetchDelegationRecords,
  fetchProxyPermissions,
  toggleDelegationActiveStatus,
} from './adminDelegate.thunk';
import {
  resetConfirmationInfo,
  setConfirmationInfo,
} from '../../../../app/app.actions';
import { IConfirmationInfo } from '../../../../app/app.model';
import './adminDelegate.index.less';
import { appPath } from '../../../../app/app.routes';
import { useHistory, useLocation } from 'react-router-dom';
import PermissionList from './component/permissionList/permissionList.index';
import moment from 'moment';
import { setErrorObject } from '../../../../delegate/delegate.action';

const mapStateToProps = (state: stateInterface) => {
  const {
    isLoading,
    permissions,
    delegations,
    paginationData,
    formSubmissionSuccessful,
    formSubmissionInProgress,
    errorObject,
  } = state.adminDelegates;
  return {
    isLoading,
    permissions,
    delegations,
    paginationData,
    formSubmissionSuccessful,
    formSubmissionInProgress,
    errorObject,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  return {
    _fetchDelegations: (queryParameters?: { [key: string]: any }) =>
      dispatch(fetchDelegationRecords(queryParameters)),
    _deleteDelegation: (id: number, queryParameters: { [key: string]: any }) =>
      dispatch(deleteDelegation(id, queryParameters)),
    _createUpdateDelegate: (
      data: any,
      id?: number,
      queryParameters?: { [key: string]: any },
    ) => dispatch(createOrUpdateDelegationRecord(data, id, queryParameters)),
    _fetchProxyPermissions: () => dispatch(fetchProxyPermissions()),
    _toggleDelegationActiveStatus: (
      id: number,
      isActive: boolean,
      queryParameters?: { [key: string]: any },
    ) => dispatch(toggleDelegationActiveStatus(id, isActive, queryParameters)),
    _setConfirmationInfo: (data: IConfirmationInfo) =>
      dispatch(setConfirmationInfo(data)),
    _resetConfirmationInfo: () => dispatch(resetConfirmationInfo()),
    _setErrorObject: (status?: boolean) => dispatch(setErrorObject(status)),
  };
};

const connector = connect(mapStateToProps, mapDispatchToProps);

let pageSize = 12;

const AdminDelegate: React.FC<ConnectedProps<typeof connector> &
  IAdminDelegateState> = props => {
  const {
    isLoading,
    permissions,
    delegations,
    paginationData,
    formSubmissionSuccessful,
    formSubmissionInProgress,
    _fetchDelegations,
    _deleteDelegation,
    _createUpdateDelegate,
    _toggleDelegationActiveStatus,
    _fetchProxyPermissions,
    _setConfirmationInfo,
    _resetConfirmationInfo,
    errorObject,
    _setErrorObject,
  } = props;

  const { push } = useHistory();
  let queryParameters = getQueryParametersAsObject();

  useEffect(() => {
    if (queryParameters.status !== undefined) {
      queryParameters.status = queryParameters.status.join(',');
    }

    pageSize = queryParameters.page_size || 12;

    _fetchDelegations(queryParameters);
    _fetchProxyPermissions();

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (formSubmissionSuccessful === true) {
      form.resetFields();
      setDetailsDrawerProps(null);
    }
    // eslint-disable-next-line
  }, [formSubmissionSuccessful]);

  const location = useLocation();
  const [form] = Form.useForm();
  const [filtersVisible, setFiltersVisible] = useState<boolean>(false);
  const [detailsDrawerProps, setDetailsDrawerProps] = useState<{
    type: 'details' | 'form';
    visible: boolean;
    detailInstance: { [key: string]: any } | null;
  } | null>(null);

  // const [pageSize, setPageSize] = useState(12);

  const showPermissions = (record: { [key: string]: any }) => {
    setDetailsDrawerProps({
      type: 'details',
      visible: true,
      detailInstance: record,
    });
  };

  const onEdit = (record: { [key: string]: any }) => {
    form.setFieldsValue({
      on_behalf_of: record.on_behalf_of.id,
      employee: record.employee.id,
      permissions: record.permissions.map((item: any) => item.id),
      date: [
        moment(record.start_date, 'DD/MM/YYYY'),
        record.end_date ? moment(record.end_date, 'DD/MM/YYYY') : undefined,
      ],
    });

    setDetailsDrawerProps({
      type: 'form',
      visible: true,
      detailInstance: record,
    });
  };

  const saveDelegationRecord = () => {
    const values = form.getFieldsValue();
    const [startDate, endDate] = values.date;

    const data = { ...values };
    data['start_date'] = startDate.format('DD/MM/YYYY');

    if (endDate !== null && endDate !== undefined) {
      data['end_date'] = endDate.format('DD/MM/YYYY');
    } else {
      data['end_date'] = null;
    }

    delete data['date'];

    if (
      detailsDrawerProps !== null &&
      detailsDrawerProps.detailInstance !== null
    ) {
      _createUpdateDelegate(
        data,
        detailsDrawerProps.detailInstance.id,
        queryParameters,
      );
    } else {
      _createUpdateDelegate(data, undefined, queryParameters);
    }
  };

  const columns = [
    {
      key: 'IS_ACTIVE',
      dataIndex: 'is_active',
      width: 100,
      align: 'center' as 'center',
      render: (value: boolean, record: any) => {
        return (
          <Switch
            checked={value}
            onChange={newVal => {
              _toggleDelegationActiveStatus(record.id, newVal, queryParameters);
            }}
            disabled={record.status?.code !== 'APPRVD'}
          />
        );
      },
    },
    {
      dataIndex: 'on_behalf_of',
      render: (val: any) => val?.legal_name || val.name,
      title: <Trans>Delegated By</Trans>,
    },
    {
      dataIndex: 'employee',
      render: (val: any) => val?.legal_name || val.name,
      title: <Trans>Delegated To</Trans>,
    },
    {
      dataIndex: 'start_date',
      title: <Trans>Start Date</Trans>,
    },
    {
      dataIndex: 'end_date',
      title: <Trans>End Date</Trans>,
    },
    {
      dataIndex: 'permissions',
      title: <Trans>Permissions</Trans>,
      render: (val: any, record: any) => (
        <Button type='link' onClick={() => showPermissions(record)}>
          {val.length}
        </Button>
      ),
      align: 'center' as 'center',
    },
    {
      dataIndex: 'status',
      render: (val: any) => <StatusTag status={val} />,
      title: <Trans>Status</Trans>,
      align: 'center' as 'center',
    },
    {
      dataIndex: 'action',
      title: <Trans>Action</Trans>,
      render: (_val: any, item: any) => {
        let actions: actionBtnObjInterface[] = [];

        actions = [
          {
            OnClick: () => onEdit(item),
            children: <Trans>Update</Trans>,
            Type: 'link',
            icon: EditOutlined,
            Disabled:
              item.status.code === 'APPRVD' ||
              item.status.code === 'EXPRED' ||
              item.status.code === 'REJCTD',
          },
          {
            children: <Trans>Delete</Trans>,
            Type: 'link',
            OnClick: () => {
              const modalParams: IConfirmationInfo = {
                visibility: true,
                headerText: 'Confirmation',
                bodyText: `Are you sure you want to delete delegation for ${item
                  .employee.legal_name ||
                  item.employee.name} on behalf of ${item.on_behalf_of
                  .legal_name || item.on_behalf_of.name}?`,
                okText: 'Delete',
                cancelText: 'Cancel',
                cancelBtnFn: _resetConfirmationInfo,
                okBtnFn: () => {
                  _deleteDelegation(item.id, queryParameters);
                  _resetConfirmationInfo();
                },
                forWhat: 'Deletion',
                extraInfo: null,
              };
              _setConfirmationInfo(modalParams);
            },
            icon: DeleteOutlined,
            Disabled:
              item.status.code === 'EXPRED' || item.status.code === 'REJCTD',
          },
        ];

        return (
          <DotMenu actionBtn={actions}>
            <EllipsisOutlined />
          </DotMenu>
        );
      },
      width: 120,
      align: 'center' as 'center',
    },
  ];

  const applyFilters = (filters: { [key: string]: any }) => {
    filters = {
      ...filters,
      page_size: pageSize,
      page: 1,
    };
    _fetchDelegations(filters);
    push(
      `${
        appPath.config_setup.adminDelegations.path
      }?${generateQueryParamsString(filters)}`,
    );
  };

  const onResetFilters = () => {
    let filters: { [key: string]: any } = {
      page: 1,
      page_size: pageSize,
    };
    _fetchDelegations(filters);
    push(
      `${
        appPath.config_setup.adminDelegations.path
      }?${generateQueryParamsString(filters)}`,
    );
  };

  return (
    <HeaderBarWrapper headerCommonProps={{ title: <Trans>Delegations</Trans> }}>
      <div className='admin-delegate-container'>
        <FilterBar
          isLoading={isLoading}
          isAddButton={true}
          addButtonOnClickFn={() => {
            setDetailsDrawerProps({
              visible: true,
              type: 'form',
              detailInstance: null,
            });
          }}
          isAddButtonDisabled={false}
          enableBackBtn={true}
          backBtnUrl={appPath.config_setup.path}
          filterView={setFiltersVisible}
          data-test='filterBar'
        />

        <AdminDelegationDataFilter
          isVisible={filtersVisible}
          onApplyFilters={(filters: { [key: string]: any }) => {
            applyFilters(filters);
          }}
          onResetFilters={() => onResetFilters()}
          initialFilters={queryParameters}
        />
        <div className='delegations'>
          <ElementOrSkeleton isLoading={isLoading} isActive={true} type='table'>
            <Table
              columns={columns}
              dataSource={delegations}
              pagination={{
                position: ['bottomRight'],
                hideOnSinglePage: false,
                current:
                  queryParameters.page !== undefined
                    ? typeof queryParameters.page === 'string'
                      ? parseInt(queryParameters.page)
                      : queryParameters.page
                    : 1,
                defaultPageSize: 12,
                defaultCurrent: 1,
                showQuickJumper: {
                  goButton: (
                    <Button type='default'>
                      <Trans>Go</Trans>
                    </Button>
                  ),
                },
                pageSizeOptions: ['10', '12', '20', '50', '100'],
                pageSize: pageSize || 12,
                onShowSizeChange: (_current: number, size: number) => {
                  pageSize = size;
                },
                total: paginationData.total_records,
                showSizeChanger: true,
                showLessItems: true,
                showTotal: (total: number, range: number[]) => {
                  return <>{`${range[0]}-${range[1]} of ${total}`}</>;
                },
                onChange: (pageNumber: number) => {
                  queryParameters.page = String(pageNumber);
                  queryParameters.page_size = String(pageSize || 12);
                  _fetchDelegations(queryParameters);
                  push(
                    `${location.pathname}?${generateQueryParamsString(
                      queryParameters,
                    )}`,
                  );
                },
              }}
              rowKey='id'
            />
          </ElementOrSkeleton>
        </div>
        <AppDrawer
          width='40%'
          visible={detailsDrawerProps?.visible}
          title={
            detailsDrawerProps !== null && detailsDrawerProps.type === 'form'
              ? `${
                  detailsDrawerProps.detailInstance !== null ? 'Update' : 'Add'
                } Delegation`
              : 'Delegation Details'
          }
          showOkButton={false}
          showCancelButton={false}
          getContainer='.admin-delegate-container'
          className='delegation-drawer'
          onClose={() => {
            form.resetFields();
            setDetailsDrawerProps(null);
            _setErrorObject(false);
          }}
          onOkClick={saveDelegationRecord}
          closable={true}
        >
          {detailsDrawerProps !== null &&
            detailsDrawerProps.type === 'details' && (
              <>
                <Row gutter={16}>
                  <Col span={12}>
                    <div className='detail-field'>
                      <div className='label'>
                        <Trans>Delegated By</Trans>
                      </div>
                      <div className='value'>
                        {detailsDrawerProps !== null
                          ? detailsDrawerProps.detailInstance?.on_behalf_of
                              .legal_name ||
                            detailsDrawerProps.detailInstance?.on_behalf_of.name
                          : ''}
                      </div>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div className='detail-field'>
                      <div className='label'>
                        <Trans>Delegated To</Trans>
                      </div>
                      <div className='value'>
                        {detailsDrawerProps !== null
                          ? detailsDrawerProps.detailInstance?.employee
                              .legal_name ||
                            detailsDrawerProps.detailInstance?.employee.name
                          : ''}
                      </div>
                    </div>
                  </Col>
                </Row>
                <div className='detail-field'>
                  <div className='label'>
                    <Trans>Date</Trans>
                  </div>
                  <div className='value'>
                    {detailsDrawerProps !== null
                      ? detailsDrawerProps.detailInstance?.start_date
                      : '--'}
                    {detailsDrawerProps !== null &&
                    detailsDrawerProps.detailInstance?.end_date !== null
                      ? ` - ${detailsDrawerProps.detailInstance?.end_date}`
                      : ''}
                  </div>
                </div>
                <div className='detail-field'>
                  <div className='label'>
                    <Trans>Permissions</Trans>
                  </div>
                  <div className='value'>
                    {detailsDrawerProps !== null && (
                      <ul>
                        {detailsDrawerProps.detailInstance?.permissions.map(
                          (item: { [key: string]: any }) => (
                            <li>{item.title}</li>
                          ),
                        )}
                      </ul>
                    )}
                  </div>
                </div>
              </>
            )}
          {detailsDrawerProps !== null && detailsDrawerProps.type === 'form' && (
            <Form
              form={form}
              layout='vertical'
              onReset={() => {
                form.resetFields();
                setDetailsDrawerProps(null);
              }}
              onFinish={(values: any) => saveDelegationRecord()}
            >
              <Form.Item
                label={<Trans>Delegated By</Trans>}
                name='on_behalf_of'
                rules={[{ required: true, message: 'Delegate by is required' }]}
              >
                <SearchableUserDropdown
                  isFormField={true}
                  fieldName='on_behalf_of'
                  selectedUser={
                    detailsDrawerProps !== null &&
                    detailsDrawerProps.type === 'form'
                      ? detailsDrawerProps.detailInstance?.on_behalf_of
                      : undefined
                  }
                  isDisable={detailsDrawerProps.detailInstance !== null}
                />
              </Form.Item>
              <Form.Item
                name='employee'
                label={<Trans>Delegate To</Trans>}
                rules={[{ required: true, message: 'Delegate to is required' }]}
                validateStatus={
                  errorObject && errorObject.type === 'employee' ? 'error' : ''
                }
                help={
                  errorObject && errorObject.type === 'employee'
                    ? errorObject.message[0]
                    : null
                }
              >
                <SearchableUserDropdown
                  isFormField={true}
                  fieldName='employee'
                  selectedUser={
                    detailsDrawerProps !== null &&
                    detailsDrawerProps.type === 'form'
                      ? detailsDrawerProps.detailInstance?.employee
                      : undefined
                  }
                  onChange={_ => _setErrorObject(false)}
                  isDisable={detailsDrawerProps.detailInstance !== null}
                />
              </Form.Item>
              <Form.Item
                name='date'
                label={<Trans>Date</Trans>}
                rules={[{ message: 'Dates are required', required: true }]}
                validateStatus={
                  errorObject && errorObject.type === 'end_date' ? 'error' : ''
                }
                help={
                  errorObject && errorObject.type === 'end_date'
                    ? errorObject.message[0]
                    : null
                }
              >
                <DatePicker.RangePicker
                  format='DD/MM/YYYY'
                  allowEmpty={[false, true]}
                  onChange={_ => _setErrorObject(false)}
                />
              </Form.Item>
              <Form.Item
                name='permissions'
                label={<Trans>Permissions</Trans>}
                rules={[{ required: true, message: 'Permissions required' }]}
              >
                <PermissionList data={permissions} />
              </Form.Item>
              <div className='buttons'>
                <Button
                  type='default'
                  htmlType='reset'
                  className={formSubmissionInProgress ? 'inactive' : ''}
                >
                  <Trans>Cancel</Trans>
                </Button>
                <Button
                  type='primary'
                  htmlType='submit'
                  loading={formSubmissionInProgress}
                  className={formSubmissionInProgress ? 'inactive' : ''}
                >
                  <Trans>Save</Trans>
                </Button>
              </div>
            </Form>
          )}
        </AppDrawer>
      </div>
    </HeaderBarWrapper>
  );
};

export default memo(connector(AdminDelegate));
