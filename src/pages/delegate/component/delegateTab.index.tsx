import React, { useEffect, useImperativeHandle, useState } from 'react';
import {
  FilterBar,
  ElementOrSkeleton,
  NoData,
  AppDrawer,
  StatusTag,
  DotMenu,
} from '../../../shared/components';
import { dataType } from '../../reports/reports.model';
import {
  Form,
  Table,
  Pagination,
  Select,
  DatePicker,
  message,
  Button,
  Switch,
  Row,
  Col,
  Checkbox,
} from 'antd';
import Store from '../../../shared/redux/store/store.index';
import { actionBtnObjInterface } from '../../../shared/components/dotMenu/dotMenu.model';
import { Trans } from '@lingui/macro';
import {
  EditOutlined,
  DeleteOutlined,
  EllipsisOutlined,
  CloseOutlined,
  CheckOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import { IConfirmationInfo } from '../../app/app.model';

let pageSize = 12;

const DelegateTab: React.FC<{
  delegation: 'TO_ME' | 'BY_ME';
  data: dataType;
  isLoading: boolean;
  apiStatus: boolean;
  apiLoad: boolean;
  onChangePagination: (page: number, pageSize: number) => void;
  users: any[];
  errorObject: any;
  permissions: any[];
  setErrorObject: (status: boolean) => void;
  onCreateUpdateDelegate?: (values: any, id?: number) => void;
  deleteDelegate: (id: number) => void;
  onChangeWSwitch: (id: number, isActive: boolean) => void;
  respondDelegate: (id: number, status: 'approved' | 'rejected') => void;
  setConfirmationInfo: (data: IConfirmationInfo) => void;
  resetConfirmationInfo: () => void;
  ref?: any;
}> = React.forwardRef(
  (
    {
      delegation,
      data,
      users,
      isLoading,
      apiLoad,
      apiStatus,
      errorObject,
      onChangePagination,
      setErrorObject,
      permissions,
      onCreateUpdateDelegate,
      deleteDelegate,
      onChangeWSwitch,
      respondDelegate,
      setConfirmationInfo,
      resetConfirmationInfo,
    },
    ref,
  ) => {
    useImperativeHandle(ref, () => ({
      closeDrawer() {
        onDrawerClosed();
      },
      resetConfirmationModal() {
        resetConfirmationInfo();
      },
    }));

    const [form] = Form.useForm();
    const [appDrawerProps, setAppDrawerProps] = useState<{
      visible: boolean;
      type?: 'details' | 'form' | null;
      delegationInstance?: { [key: string]: any } | null;
    }>({
      visible: false,
      type: null,
      delegationInstance: null,
    });

    const [usersLoading, setUsersLoading] = useState<boolean>(true);
    const [userOptions, setUserOptions] = useState<{ [key: string]: any }[]>(
      [],
    );

    useEffect(() => {
      setUserOptions(
        users.map((user: any) => ({
          label: `${user?.legal_name || user.name} (${user.username})`,
          value: user.id,
        })),
      );
      if (appDrawerProps.delegationInstance !== null) {
        form.setFieldsValue({
          employee: appDrawerProps.delegationInstance?.employee.id,
        });
      }
      users.length > 0 && setUsersLoading(false);
      // eslint-disable-next-line
    }, [users]);

    useEffect(() => {
      if (appDrawerProps.visible && !errorObject && apiStatus) {
        setAppDrawerProps({
          visible: false,
          type: null,
          delegationInstance: null,
        });
        setSelectedPermissions([]);
        setErrorObject(false);
      }
    }, [appDrawerProps.visible, errorObject, apiStatus, setErrorObject]);
    const columns = [
      {
        key: 'IS_ACTIVE',
        dataIndex: 'is_active',
        width: 100,
        align: 'center' as 'center',
        render: (value: boolean, record: any) => (
          <Switch
            checked={value}
            onChange={newVal => toggleItem(record.id, newVal)}
            disabled={
              record.status?.code !== 'APPRVD' || delegation === 'TO_ME'
            }
          />
        ),
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
          <Button
            type='link'
            onClick={() =>
              setAppDrawerProps({
                visible: true,
                type: 'details',
                delegationInstance: record,
              })
            }
          >
            {val.length}
          </Button>
        ),
        align: 'center' as 'center',
      },
      {
        dataIndex: 'status',
        render: (val: any, item: any) => <StatusTag status={val} />,
        title: <Trans>Status</Trans>,
        align: 'center' as 'center',
      },
      {
        dataIndex: 'action',
        title: <Trans>Action</Trans>,
        width: 120,
        align: 'center' as 'center',
        render: (val: any, record: any) => {
          let actions: actionBtnObjInterface[] = [];
          if (delegation === 'BY_ME') {
            actions = [
              {
                OnClick: () => editDelegation(record),
                children: <Trans>Update</Trans>,
                Type: 'link',
                icon: EditOutlined,
                Disabled:
                  record.status.code === 'APPRVD' ||
                  record.status.code === 'EXPRED' ||
                  record.status.code === 'REJCTD',
              },
              {
                children: <Trans>Delete</Trans>,
                Type: 'link',
                OnClick: () => deleteDelegation(record.id),
                icon: DeleteOutlined,
                Disabled:
                  record.status.code === 'EXPRED' ||
                  record.status.code === 'REJCTD',
              },
            ];
          } else {
            return (
              <Row gutter={24}>
                <Col span={12}>
                  <Button
                    disabled={
                      record.status.code === 'APPRVD' ||
                      record.status.code === 'EXPRED' ||
                      record.status.code === 'REJCTD'
                    }
                    shape='circle'
                    title={`${(<Trans>Accept Delegation</Trans>)}`}
                    icon={<CheckOutlined style={{ color: '#fff' }} />}
                    size='small'
                    className={`action-button approve ${record.status?.code}`}
                    onClick={() => {
                      setConfirmationInfo({
                        bodyText: 'Do you want to accept the delegation?',
                        cancelText: <Trans>Cancel</Trans>,
                        okText: 'Accept',
                        visibility: true,
                        extraInfo: '',
                        forWhat: '',
                        headerText: 'Confirmation',
                        cancelBtnFn: resetConfirmationInfo,
                        okBtnFn: () => {
                          resetConfirmationInfo();
                          respondDelegate(record.id, 'approved');
                        },
                      });
                    }}
                  />
                </Col>
                <Col span={12}>
                  <Button
                    shape='circle'
                    title='Reject Delegation'
                    disabled={
                      record.status.code === 'APPRVD' ||
                      record.status.code === 'EXPRED' ||
                      record.status.code === 'REJCTD'
                    }
                    icon={<CloseOutlined style={{ color: '#fff' }} />}
                    className={`action-button reject ${record.status?.code}`}
                    size='small'
                    onClick={() => {
                      setConfirmationInfo({
                        bodyText: 'Do you want to reject the delegation?',
                        cancelText: 'Cancel',
                        okText: 'Reject',
                        visibility: true,
                        extraInfo: '',
                        forWhat: '',
                        headerText: 'Confirmation',
                        cancelBtnFn: resetConfirmationInfo,
                        okBtnFn: () => {
                          resetConfirmationInfo();
                          respondDelegate(record.id, 'rejected');
                        },
                      });
                    }}
                  />
                </Col>
              </Row>
            );
          }
          return (
            <DotMenu actionBtn={actions}>
              <EllipsisOutlined />
            </DotMenu>
          );
        },
      },
    ];

    const addBtnClick = () => {
      setAppDrawerProps({
        visible: true,
        type: 'form',
        delegationInstance: null,
      });
      form.resetFields();
      form.setFieldsValue({ permissions: permissions.map(item => item.id) });
    };

    const editDelegation = (delegationInstance: { [key: string]: any }) => {
      let dates = [moment(delegationInstance.start_date, 'DD/MM/YYYY')];
      if (delegationInstance.end_date !== null) {
        dates.push(moment(delegationInstance.end_date, 'DD/MM/YYYY'));
      }
      setUserOptions([
        {
          label: `${delegationInstance?.employee?.legal_name ||
            delegationInstance.employee.name} (${
            delegationInstance.employee.username
          })`,
          value: delegationInstance.employee.id,
        },
      ]);

      form.setFieldsValue({
        employee: delegationInstance.employee.id,
        date: dates,
        permissions: delegationInstance.permissions.map((item: any) => item.id),
      });
      setAppDrawerProps({
        visible: true,
        type: 'form',
        delegationInstance: delegationInstance,
      });
      setSelectedPermissions(
        delegationInstance.permissions.map((item: any) => item.id),
      );
    };

    const deleteDelegation = (delegationId: number) => {
      setConfirmationInfo({
        bodyText: 'Do you want to delete the delegation?',
        cancelText: 'Cancel',
        okText: 'Delete',
        visibility: true,
        extraInfo: '',
        forWhat: '',
        headerText: 'Confirmation',
        cancelBtnFn: resetConfirmationInfo,
        okBtnFn: () => {
          resetConfirmationInfo();
          deleteDelegate(delegationId);
        },
      });
    };

    const toggleItem = (recordId: number, isActive: boolean) => {
      onChangeWSwitch(recordId, isActive);
    };

    if (delegation === 'TO_ME') {
      columns.shift();
    }

    const createOrUpdateDelegate = async () => {
      try {
        const values = await form.validateFields();
        const [start_date, end_date] = values.date;
        const userId = Store.getState().auth.user.id;

        if (!userId) return message.error('Something is wrong');
        if (selectedPermissions.length < 1)
          return message.error('Minimum one permission is required');
        const body = {
          employee: values.employee,
          permissions: selectedPermissions,
          is_active: true,
          on_behalf_of: userId,
          start_date: start_date.format('DD/MM/YYYY'),
          end_date: end_date?.format('DD/MM/YYYY'),
        };
        onCreateUpdateDelegate &&
          onCreateUpdateDelegate(body, appDrawerProps.delegationInstance?.id);
      } catch (e) {}
    };

    const onDrawerClosed = () => {
      setAppDrawerProps({
        visible: false,
        type: null,
      });
      setSelectedPermissions([]);
      setErrorObject(false);
    };

    const [selectedPermissions, setSelectedPermissions] = useState<number[]>(
      [],
    );
    return (
      <ElementOrSkeleton isLoading={isLoading} isActive={true} type='table'>
        <div>
          {delegation === 'BY_ME' && (
            <FilterBar isAddButton={true} addButtonOnClickFn={addBtnClick} />
          )}
        </div>
        {data.data.length === 0 ? (
          <NoData />
        ) : (
          <>
            <Table
              pagination={false}
              dataSource={data.data}
              columns={columns}
              bordered
              rowKey='id'
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
                current={data.current_page}
                onChange={(pageNumber: number, pageSize: any) => {
                  onChangePagination(pageNumber, pageSize);
                }}
                hideOnSinglePage={false}
                pageSizeOptions={['10', '12', '20', '50', '100']}
                pageSize={pageSize || 12}
                showSizeChanger={true}
                onShowSizeChange={(_current: number, size: number) => {
                  pageSize = size;
                }}
                total={data.pagination_data.total_records}
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
        )}
        <AppDrawer
          visible={appDrawerProps.visible}
          title={
            appDrawerProps.type === 'form' ? (
              appDrawerProps.delegationInstance !== null ? (
                <Trans>Update Delegation</Trans>
              ) : (
                <Trans>Add Delegation</Trans>
              )
            ) : (
              `Delegation Details For ${appDrawerProps?.delegationInstance
                ?.on_behalf_of?.legal_name ||
                appDrawerProps.delegationInstance?.on_behalf_of
                  ?.name} and ${appDrawerProps.delegationInstance?.employee
                ?.legal_name ||
                appDrawerProps.delegationInstance?.employee.name}`
            )
          }
          width='40%'
          closable={true}
          destroyOnClose={true}
          onOkClick={createOrUpdateDelegate}
          OkText={
            appDrawerProps.delegationInstance !== null ? (
              <Trans>Update</Trans>
            ) : (
              <Trans>Create</Trans>
            )
          }
          isLoading={apiLoad}
          getContainer='.delegate-container'
          onCancelClick={onDrawerClosed}
          onClose={onDrawerClosed}
          showCancelButton={appDrawerProps.type === 'form'}
          showOkButton={appDrawerProps.type === 'form'}
        >
          {appDrawerProps.type === 'form' ? (
            <Form form={form} layout='vertical'>
              <Form.Item
                name='employee'
                label={<Trans>Delegate To</Trans>}
                hasFeedback
                rules={[{ required: true, message: 'Delegate To is required' }]}
                validateStatus={
                  errorObject && errorObject.type === 'employee' ? 'error' : ''
                }
                help={
                  errorObject && errorObject.type === 'employee'
                    ? errorObject.message[0]
                    : null
                }
              >
                <Select
                  showSearch
                  filterOption={(input: any, option: any) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                  loading={usersLoading}
                  notFoundContent={null}
                  onChange={_ => setErrorObject(false)}
                  disabled={appDrawerProps.delegationInstance !== null}
                >
                  {userOptions.map((option: any) => (
                    <Select.Option key={option.value} value={option.value}>
                      {option.label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              {/* {errorObject && errorObject.type === 'employee' && (
                <Alert message={errorObject.message[0]} type='error' showIcon />
              )} */}

              <Form.Item
                name='date'
                label={<Trans>Date</Trans>}
                hasFeedback
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
                  onChange={_ => setErrorObject(false)}
                />
              </Form.Item>
              <Form.Item
                name='permissions'
                label={<Trans>Permissions</Trans>}
                rules={[{ required: true, message: 'Permissions required' }]}
              >
                <>
                  {permissions.map((item: any) => (
                    <Checkbox
                      checked={selectedPermissions.includes(item.id)}
                      className='permission-checkbox'
                      onChange={event => {
                        if (event.target.checked === true) {
                          setSelectedPermissions(selectedPermissions => [
                            ...selectedPermissions,
                            item.id,
                          ]);
                        } else {
                          if (selectedPermissions.length > 1) {
                            setSelectedPermissions(selectedPermissions =>
                              selectedPermissions.filter(
                                permissionId => permissionId !== item.id,
                              ),
                            );
                          } else {
                            message.error('Minimum one permission is required');
                          }
                        }
                      }}
                    >
                      {item.title}
                    </Checkbox>
                  ))}
                </>
              </Form.Item>
            </Form>
          ) : (
            <>
              <Row gutter={16} className='fields'>
                <Col span={12}>
                  <div className='detail-field'>
                    <div className='field-label'>
                      <Trans>On Behalf Of</Trans>
                    </div>
                    <div className='field-value'>
                      {appDrawerProps.delegationInstance?.on_behalf_of
                        ?.legal_name ||
                        appDrawerProps.delegationInstance?.on_behalf_of.name}
                    </div>
                  </div>
                </Col>
                <Col span={12}>
                  <div className='detail-field'>
                    <div className='field-label'>
                      <Trans>Period</Trans>
                    </div>
                    <div className='field-value'>
                      {appDrawerProps.delegationInstance?.start_date} -{' '}
                      {appDrawerProps.delegationInstance?.end_date}
                    </div>
                  </div>
                </Col>
              </Row>
              <Row gutter={16} className='fields'>
                <Col span={12}>
                  <div className='detail-field'>
                    <div className='field-label'>
                      <Trans>Is Active</Trans>
                    </div>
                    <div className='field-value'>
                      {appDrawerProps.delegationInstance?.is_active
                        ? 'Yes'
                        : 'No'}
                    </div>
                  </div>
                </Col>
                <Col span={12}>
                  <div className='detail-field'>
                    <div className='field-label'>
                      <Trans>Status</Trans>
                    </div>
                    <div className='field-value'>
                      {appDrawerProps.delegationInstance?.status.title}
                    </div>
                  </div>
                </Col>
              </Row>
              <div className='detail-field'>
                <div className='field-label'>
                  <Trans>Permissions</Trans>
                </div>
                <ul className='permissions'>
                  {appDrawerProps.delegationInstance?.permissions.map(
                    (item: any) => (
                      <li className='permission' key={item.id}>
                        {item.title}
                      </li>
                    ),
                  )}
                </ul>
              </div>
            </>
          )}
        </AppDrawer>
      </ElementOrSkeleton>
    );
  },
);

export default DelegateTab;
