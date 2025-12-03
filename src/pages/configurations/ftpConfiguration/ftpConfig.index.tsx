/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, Dispatch } from 'react';
import { Input, Form, Row, Col, Checkbox, Skeleton, Button } from 'antd';
import { Item } from './ftpConfig.model';

import Table from 'antd/lib/table';
// import Table, { ColumnProps } from 'antd/lib/table';
// import { useEditable } from '../../../../shared/hooks';
import './ftpConfig.index.less';
import {
  EllipsisOutlined,
  EditOutlined,
  CopyOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import {
  AppDrawer,
  DotMenu,
  FilterBar,
  NoData,
} from '../../../shared/components';
// import moment from 'moment';
import { connect, ConnectedProps } from 'react-redux';
import {
  getFtpConfigRecords,
  getFTPLoader,
  getSaveDataLoader,
  getConnectionTestingStatus,
  getConfigurationSuccessMessage,
  getConfigurationErrorMessage,
} from '../../../shared/redux/rootReducer';
import {
  fetchFtpConfigList,
  createUpdateFtpConfig,
  testFtpConnection,
  deleteFtpConfiguration,
} from '../configurations.thunk';

import Errors from '../configurations.data.json';
import { IConfirmationInfo } from '../../app/app.model';
import {
  resetConfirmationInfo,
  setConfirmationInfo,
} from '../../app/app.actions';
import { Trans } from '@lingui/macro';
const FTPConfig: React.FC<ConnectedProps<typeof connector>> = ({
  fetchFtpList,
  ftpRecordsData,
  error,
  success,
  createUpdateConfigRecord,
  activeKey,
  isLoading,
  isSaveDataLoading,
  _testConnection,
  _deleteFtpConfiguration,
  isTesting,
  _setConfirmationInfo,
  _resetConfirmationInfo,
}) => {
  const ftpRecords = isLoading ? new Array(15).fill({}) : ftpRecordsData;
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState('');
  const [newItemModalVisible, setNewItemModalVisible] = useState(false);
  const [testConnectionKey, setConnectionKey] = useState('');
  // const { save, update, cancel, addNewItem } = useEditable(originData, form);

  useEffect(() => {
    if (error) {
      // message.destroy();
      const errors = Object.keys(error).map(item => ({
        name: item,
        errors: error[item],
      }));
      form.setFields(errors);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);
  useEffect(() => {
    if (success && activeKey === '3') {
      // message.destroy();
      setEditingKey('');
      setNewItemModalVisible(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [success]);

  useEffect(() => {
    fetchFtpList();
  }, []);

  const onEdit = (record: any) => {
    setValuesToForm({ ...record });
    setEditingKey(record.id);
  };

  const clone = (record: any) => {
    record.password = '';
    setValuesToForm(record);
  };

  const setValuesToForm = (record: any) => {
    form.setFieldsValue(record);
    setNewItemModalVisible(true);
  };

  const onCancel = () => {
    setNewItemModalVisible(false);
    setEditingKey('');
    form.resetFields();
  };

  const onSave = async () => {
    try {
      const values = await form.validateFields();
      const body = { ...values };
      if (editingKey) {
        body.password = values.new_password ? values.new_password : '';
        body.ip_address = body.ip_address.length === 0 ? null : body.ip_address;
      }

      createUpdateConfigRecord(body, editingKey);
    } catch (errInfo) {}
  };

  // const isEditing = (record: Item) => record.key === editingKey;
  const getElemOrSkeleton = (_text: any, _record?: any, _index?: number) => {
    return isLoading ? (
      <Skeleton.Input size='small' active={isLoading} />
    ) : (
      _text
    );
  };

  const testConnection = (id: string) => {
    setConnectionKey(id);
    _testConnection(id);
  };

  const onDelete = (record: { [key: string]: any }) => {
    _setConfirmationInfo({
      visibility: true,
      headerText: 'Confirmation',
      bodyText: 'Are you sure you want to delete this FTP connection?',
      forWhat: 'deletion',
      extraInfo: null,
      okText: <Trans>Delete</Trans>,
      cancelText: <Trans>Cancel</Trans>,
      okBtnFn: () => {
        _deleteFtpConfiguration(record.id, () => {
          _resetConfirmationInfo();
          form.resetFields();
        });
      },
      cancelBtnFn: () => {
        _resetConfirmationInfo();
      },
    });
  };

  const columns = [
    {
      title: () => getElemOrSkeleton(<Trans>User</Trans>),
      dataIndex: 'user',
      key: 'user',
      width: '12%',
      editable: true,
      isRequired: true,
      render: getElemOrSkeleton,
    },
    {
      title: () => getElemOrSkeleton(<Trans>IP Address</Trans>),
      dataIndex: 'ip_address',
      key: 'ip_address',
      width: '12%',
      isRequired: true,
      editable: true,
      render: getElemOrSkeleton,
    },
    {
      title: () => getElemOrSkeleton(<Trans>Hostname</Trans>),
      dataIndex: 'hostname',
      key: 'hostname',
      width: '15%',
      isRequired: true,
      editable: true,
      render: getElemOrSkeleton,
    },
    {
      title: () => getElemOrSkeleton(<Trans>Public Key</Trans>),
      dataIndex: 'public_key',
      isRequired: false,
      width: '30%',
      key: 'public_key',
      editable: true,
      render: getElemOrSkeleton,
    },
    {
      title: () => getElemOrSkeleton(<Trans>Is SFTP</Trans>),
      dataIndex: 'is_sftp',
      isRequired: false,
      width: '200px',
      key: 'is_sftp',
      editable: true,
      render: (value: string) => getElemOrSkeleton(value ? 'Yes' : 'No'),
    },
    {
      title: () => getElemOrSkeleton(<Trans>Test Connection</Trans>),
      dataIndex: 'test',
      key: 'test',
      width: '12%',
      editable: true,
      align: 'center' as 'center',
      isRequired: true,
      render: (_text: string, item: any) =>
        isLoading ? (
          getElemOrSkeleton('')
        ) : (
          <Button
            type='ghost'
            size='small'
            style={{ color: '#1890FF', borderColor: '#1890FF' }}
            onClick={() => testConnection(item.id)}
            loading={testConnectionKey === item.id && isTesting}
            disabled={isTesting}
          >
            {testConnectionKey === item.id && isTesting ? 'Testing' : 'Test'}
          </Button>
        ),
    },
    {
      title: () => getElemOrSkeleton(<Trans>Action</Trans>),
      dataIndex: 'options',
      key: 'options',
      width: 90,
      align: 'center' as 'center',
      render: (_: any, record: Item) => {
        return isLoading ? (
          <Skeleton.Input size='small' active={isLoading} />
        ) : (
          <DotMenu
            actionBtn={[
              {
                Type: 'link',
                OnClick: () => onEdit(record),
                Disabled: editingKey !== '',
                children: <Trans>Edit</Trans>,
                icon: EditOutlined,
              },
              {
                Type: 'link',
                OnClick: () => clone(record),
                Disabled: editingKey !== '',
                children: <Trans>Clone</Trans>,
                icon: CopyOutlined,
              },
              {
                Type: 'link',
                OnClick: () => onDelete(record),
                Disabled: editingKey !== '',
                children: <Trans>Delete</Trans>,
                icon: DeleteOutlined,
              },
            ]}
          >
            <EllipsisOutlined />
          </DotMenu>
        );
      },
    },
  ];

  const handleAddConfig = () => {
    setNewItemModalVisible(true);
  };
  return (
    <div className='FTP-Config-Container'>
      <Form component={false}>
        <FilterBar
          data-testId='filter-bar'
          isAddButton={true}
          addButtonOnClickFn={handleAddConfig}
          isAddButtonDisabled={editingKey !== ''}
        />
        {ftpRecords && ftpRecords.length !== 0 ? (
          <Table
            bordered
            // editableCell={EditableCell}
            rowKey={record => record.id}
            columns={columns}
            dataSource={ftpRecords}
            pagination={false}
          />
        ) : (
          <NoData />
        )}
      </Form>

      <AppDrawer
        title={<Trans>FTP Configuration</Trans>}
        data-testId='ftp-config-drawer'
        width={'30%'}
        onClose={() => onCancel()}
        visible={newItemModalVisible}
        onCancelClick={onCancel}
        onOkClick={onSave}
        OkText={editingKey ? <Trans>Update</Trans> : <Trans>Create</Trans>}
        getContainer='.FTP-Config-Container'
      >
        <Row justify='start' className='formContainer'>
          <Col span={24} offset={0}>
            <Form
              // {...fullscreenFormLayout}
              colon={false}
              form={form}
              // {...formItemLayout}
              autoComplete='off'
              layout='vertical'
            >
              <Form.Item
                name='user'
                label={<Trans>User</Trans>}
                rules={[{ required: true, message: Errors.USER_REQUIRED }]}
              >
                <Input autoComplete='off' disabled={editingKey !== ''} />
              </Form.Item>
              {editingKey === '' && (
                <Form.Item
                  name='password'
                  label={<Trans>Password</Trans>}
                  rules={[
                    { required: true, message: Errors.PASSWORD_REQUIRED },
                  ]}
                >
                  <Input.Password />
                </Form.Item>
              )}
              {editingKey !== '' && (
                <Form.Item
                  name='new_password'
                  label={<Trans>New Password</Trans>}
                >
                  <Input.Password />
                </Form.Item>
              )}
              <Form.Item
                name='ip_address'
                label={<Trans>IP Address</Trans>}
                dependencies={['hostname']}
                rules={[
                  // { required: true, message: Errors.IP_ADDRESS_REQUIRED },
                  {
                    pattern: /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/,
                    message: 'Invalid IP Address',
                  },
                  ({ getFieldValue }) => ({
                    required: getFieldValue('hostname') ? false : true,
                    message: 'Either IP address or hostname required ',
                  }),
                ]}
              >
                <Input autoComplete='new-password' />
              </Form.Item>
              <Form.Item
                name='hostname'
                label={<Trans>Hostname</Trans>}
                dependencies={['ip_address']}
                // rules={[{ required: true, message: Errors.HOST_NAME_REQUIRED }]}
                rules={[
                  ({ getFieldValue }) => ({
                    required: getFieldValue('ip_address') ? false : true,
                    message: 'Either IP address or hostname required ',
                  }),
                ]}
              >
                <Input autoComplete='new-password' />
              </Form.Item>
              <Form.Item name='public_key' label={<Trans>Public Key</Trans>}>
                <Input.TextArea autoSize={true} />
              </Form.Item>
              <Form.Item name='is_sftp' label='' valuePropName='checked'>
                <Checkbox>
                  <Trans>SFTP</Trans>
                </Checkbox>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </AppDrawer>
      {/* {editingKey !== '' && (

      )} */}
    </div>
  );
};

const mapStateToProps = (state: any) => ({
  ftpRecordsData: getFtpConfigRecords(state),
  success: getConfigurationSuccessMessage(state),
  error: getConfigurationErrorMessage(state),
  activeKey: state.configuration.activeKey,
  isLoading: getFTPLoader(state),
  isSaveDataLoading: getSaveDataLoader(state),
  isTesting: getConnectionTestingStatus(state),
});

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  fetchFtpList: () => dispatch(fetchFtpConfigList()),
  createUpdateConfigRecord: (body: any, id: string) =>
    dispatch(createUpdateFtpConfig(body, id)),
  _testConnection: (id: string) => dispatch(testFtpConnection(id)),
  _deleteFtpConfiguration: (id: number, callback?: Function) =>
    dispatch(deleteFtpConfiguration(id, callback)),
  _setConfirmationInfo: (data: IConfirmationInfo) =>
    dispatch(setConfirmationInfo(data)),
  _resetConfirmationInfo: () => dispatch(resetConfirmationInfo()),
});

const connector = connect(mapStateToProps, mapDispatchToProps);

export default connector(FTPConfig);
