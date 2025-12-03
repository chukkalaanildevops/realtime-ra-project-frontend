/* eslint-disable react-hooks/exhaustive-deps */
import React, { Dispatch, useEffect, useState } from 'react';
import {
  getSFLegalEntities,
  getSFIntegrationLoader,
  getSFIntegrationError,
  getSFIntegrationSuccess,
  getSFIntegrationDataSubmitLoader,
} from '../../../shared/redux/rootReducer';
import {
  fetchLegalEntities,
  updateLegalEntities,
} from '../sfIntegration.thunk';
import { connect, ConnectedProps } from 'react-redux';
import { Checkbox, Table, Input, Switch, Form, Skeleton } from 'antd';
import { EditOutlined, EllipsisOutlined } from '@ant-design/icons';
import {
  AppDrawer,
  NoData,
  ErrorBoundary,
  DotMenu,
} from '../../../shared/components';
import { Trans } from '@lingui/macro';

const EntityTypeSetup: React.FC<ConnectedProps<typeof connector>> = ({
  legalEntityTypes,
  isLoader,
  error,
  success,
  fetchLegalEntityTypes,
  _updateEntityTypes,
}) => {
  // const [selectedRows, setSelectedRows] = useState<any[]>([]);
  // const [legalEntities, setLegalEntities] = useState<any[]>([]);
  const [editEntityId, setEditEntityId] = useState<string>('');
  const [form] = Form.useForm();

  useEffect(() => {
    fetchLegalEntityTypes();
  }, []);

  useEffect(() => {
    if (success) {
      setEditEntityId('');
    }
  }, [success]);
  const setEditData = (item: any) => {
    const fields = { ...item, display_text_disabled: item.display_text };
    form.setFieldsValue(fields);
    setEditEntityId(item.id);
  };
  const toggleItem = (item: any, newVal: boolean) => {
    const obj = {
      is_active: newVal,
      title: item.title,
      display_text: item.display_text,
    };
    _updateEntityTypes(obj, item.id);
  };

  const getElemOrSkeleton = (_text: any, _record?: any, _index?: number) => {
    return isLoader ? <Skeleton.Input size='small' active={isLoader} /> : _text;
  };

  const columns = [
    {
      title: () => getElemOrSkeleton(''),
      dataIndex: 'is_active',
      width: '50px',
      render: (value: boolean, record: any) =>
        isLoader ? (
          getElemOrSkeleton('')
        ) : (
          <div>
            <Switch
              checked={value}
              onChange={newVal => toggleItem(record, newVal)}
            />
          </div>
        ),
    },
    {
      key: 'title',
      title: () => getElemOrSkeleton(<Trans>Entity Type</Trans>),
      dataIndex: 'title',
      render: getElemOrSkeleton,
    },
    {
      key: 'display_text',
      title: () => getElemOrSkeleton(<Trans>Display Text</Trans>),
      dataIndex: 'display_text',
      render: getElemOrSkeleton,
    },
    {
      key: 'parent',
      title: () => getElemOrSkeleton(<Trans>Parent</Trans>),
      dataIndex: 'parent',
      render: (val: any) =>
        isLoader
          ? getElemOrSkeleton('')
          : val
          ? val?.display_text === val?.title
            ? val?.title
            : `${val?.display_text}(${val?.title})`
          : '-',
    },
    {
      key: 'is_role_enabled',
      title: () => getElemOrSkeleton(<Trans>Role Enabled</Trans>),
      dataIndex: 'is_role_enabled',
      render: (val: boolean) =>
        isLoader ? getElemOrSkeleton('') : val ? 'Yes' : 'No',
    },
    {
      key: 'is_assign_automatically',
      title: () => getElemOrSkeleton(<Trans>Assign Role Automatically</Trans>),
      dataIndex: 'is_assign_automatically',
      render: (val: boolean) =>
        isLoader ? getElemOrSkeleton('') : val ? 'Yes' : 'No',
    },
    {
      key: 'data-index',
      title: () => getElemOrSkeleton(<Trans>Action</Trans>),
      width: '100px',
      align: 'center' as 'center',
      render: (_val: string, item: any) =>
        isLoader ? (
          getElemOrSkeleton('')
        ) : (
          <DotMenu
            actionBtn={[
              {
                Type: 'link',
                icon: EditOutlined,
                children: <Trans>Edit</Trans>,
                OnClick: () => setEditData(item),
                title: 'Edit',
              },
            ]}
          >
            <EllipsisOutlined />
          </DotMenu>
        ),
    },
  ];

  const renderEntities = () => {
    if (legalEntityTypes && legalEntityTypes.length > 0) {
      return (
        <div>
          <Table
            dataSource={legalEntityTypes}
            columns={columns}
            rowKey={item => item.id}
            pagination={false}
            bordered
          />
        </div>
      );
    } else {
      return <NoData description={<Trans>No Legal Entities</Trans>} />;
    }
  };
  useEffect(() => {
    if (error) {
      if (error instanceof Object) {
        if (error.error) {
          // message.error(error.error);
        } else {
          // message.error('Failed to schedule');
          let errors = Object.keys(error).map(item => ({
            name: item,
            errors: error[item],
          }));
          form.setFields(errors);
        }
      } else if (typeof error === 'string') {
        // message.error(error || 'Something went wrong');
      }
    }
  }, [error]);

  const onUpdateLabel = async () => {
    try {
      const values = await form.validateFields();
      _updateEntityTypes(values, editEntityId);
      // setEditEntityId('');
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <ErrorBoundary>
      <div className='entity-type-setup-container'>
        {renderEntities()}
        <AppDrawer
          title={<Trans>Update Entity Type</Trans>}
          visible={editEntityId !== ''}
          OkText={<Trans>Update</Trans>}
          width='30%'
          onOkClick={onUpdateLabel}
          onCancelClick={() => setEditEntityId('')}
          onClose={() => setEditEntityId('')}
          getContainer='.entity-type-setup-container'
        >
          <Form form={form} layout='vertical'>
            <Form.Item name='title' label={<Trans>Original Text</Trans>}>
              <Input disabled />
            </Form.Item>
            <Form.Item
              name='display_text_disabled'
              label={<Trans>Current Display Text</Trans>}
            >
              <Input disabled />
            </Form.Item>
            <Form.Item
              name='display_text'
              label={<Trans>Rename Text</Trans>}
              rules={[
                { required: true, message: 'New Display Text' },
                ({ getFieldValue }) => ({
                  validator(rule: any, value: string) {
                    const existingNames = legalEntityTypes
                      .filter(item => editEntityId !== item.id)
                      .map(item => item.display_text);
                    if (!existingNames.includes(value)) {
                      return Promise.resolve();
                    }
                    return Promise.reject(`'${value}' already exist`);
                  },
                }),
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item name='is_active' valuePropName='checked'>
              <Checkbox>
                <Trans>Is Active</Trans>{' '}
              </Checkbox>
            </Form.Item>
            <Form.Item name='is_role_enabled' valuePropName='checked'>
              <Checkbox>
                <Trans>Enable Role</Trans>
              </Checkbox>
            </Form.Item>
            <Form.Item name='is_assign_automatically' valuePropName='checked'>
              <Checkbox>
                <Trans>Assign Role Automatically</Trans>
              </Checkbox>
            </Form.Item>
          </Form>
        </AppDrawer>
      </div>
    </ErrorBoundary>
  );
};

const mapStateToProps = (state: any) => ({
  legalEntityTypes: getSFLegalEntities(state),
  isLoader: getSFIntegrationLoader(state),
  error: getSFIntegrationError(state),
  success: getSFIntegrationSuccess(state),
  isDataSubmitting: getSFIntegrationDataSubmitLoader(state),
});

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  fetchLegalEntityTypes: () => dispatch(fetchLegalEntities()),
  _updateEntityTypes: (data: any, id: string) =>
    dispatch(updateLegalEntities(data, id)),
});

const connector = connect(mapStateToProps, mapDispatchToProps);
export default connector(EntityTypeSetup);
