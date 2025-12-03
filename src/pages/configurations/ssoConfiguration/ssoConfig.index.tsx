import React, { useState, useRef, Dispatch, useEffect } from 'react';
import { Table, Input, Form, Select, Row } from 'antd';
import {
  FullscreenOutlined,
  FullscreenExitOutlined,
  EditOutlined,
} from '@ant-design/icons';
import {
  FilterBar,
  AppDrawer,
  NoData,
  DetailsDrawerSingleInfo,
} from '../../../shared/components';

import { Item } from './ssoConfig.model';
import './ssoConfig.index.less';
import { connect, ConnectedProps } from 'react-redux';
import {
  getSSOConfigRecords,
  getNameIdFormats,
  getConfigurationSuccessMessage,
  getConfigurationErrorMessage,
} from '../../../shared/redux/rootReducer';
import {
  fetchSSOConfigList,
  createSSOConfigurationItem,
  fetchNameIdFormatList,
} from '../configurations.thunk';
import Errors from '../configurations.data.json';
import { Trans } from '@lingui/macro';

const SSOConfig: React.FC<ConnectedProps<typeof connector>> = ({
  success,
  fetchSSOList,
  ssoList,
  createSSOConfiguration,
  activeKey,
  nameIDFormatList,
  _fetchNameIdFormatList,
}) => {
  const defaultFullScreenFormData = {
    key: '',
    entityId: '',
    singleSignOnService: '',
    singleLogoutService: '',
    singleLogoutServiceBinding:
      'urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect',
    xCertificate: '',
    sSOOnly: false,
    NameIDFormat: '',
    isEditable: true,
    isRequired: true,
    consumerService: '',
  };
  const [form] = Form.useForm();
  const sSSOConfigContainerRef: any = useRef();

  /* Component States */
  const data = ssoList;
  const [editingKey, setEditingKey] = useState<string>('');
  const [fullScreenForm, setFullScreenForm] = useState<boolean>(false);
  const [fullScreenFormData, setFullScreenFormData] = useState<Item>(
    defaultFullScreenFormData,
  );
  const [descriptionVisibility, setDescriptionVisibility] = useState<boolean>(
    false,
  );
  /* Component States */

  useEffect(() => {
    fetchSSOList();
    _fetchNameIdFormatList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (success && activeKey === '1') {
      // message.destroy();
      setEditingKey('');
      setFullScreenForm(false);
      // setEditingKey('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [success]);

  const onSave = async () => {
    try {
      const values = await form.validateFields();
      const obj = {
        is_preferred: values.sSOOnly,
        settings: {
          sp: {
            NameIDFormat: values.NameIDFormat,
          },
          idp: {
            entityId: values.entityID,
            singleSignOnService: {
              url: values.singleSignOnService,
              binding: 'urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect',
            },
            singleLogoutService: {
              url: values.singleLogoutService,
              binding: values.singleLogoutServiceBinding,
            },
            x509cert: values.xCertificate,
          },
        },
      };

      const id = data && data.length > 0 ? (data[0] as any).id : '';
      createSSOConfiguration(obj, id);
    } catch (e) {}
  };

  const toggleDescriptionVisibility = (
    row: any,
    _ev: React.MouseEvent<HTMLButtonElement>,
  ) => {
    const newDescriptionVisibility = !descriptionVisibility;
    setDescriptionVisibility(newDescriptionVisibility);
    if (newDescriptionVisibility) setFullScreenFormData(row);
    else setFullScreenFormData(defaultFullScreenFormData);
  };

  const columns = [
    {
      title: <Trans>Entity Id</Trans>,
      dataIndex: 'entityId',
      key: 'entityId',
      editable: false,
      isRequired: true,
      ellipsis: true,
    },
    {
      title: <Trans>Single Sign On Service</Trans>,
      dataIndex: 'singleSignOnService',
      key: 'singleSignOnService',
      editable: false,
      isRequired: true,
      ellipsis: true,
    },
    {
      title: <Trans>Single Logout Service</Trans>,
      dataIndex: 'singleLogoutService',
      key: 'singleLogoutService',
      isRequired: true,
      editable: false,
      ellipsis: true,
    },
    {
      title: <Trans>Single Logout Service Binding</Trans>,
      dataIndex: 'singleLogoutServiceBinding',
      key: 'singleLogoutServiceBinding',
      isRequired: true,
      editable: false,
      ellipsis: true,
    },
    {
      title: <Trans>Name Id Format</Trans>,
      dataIndex: 'NameIDFormat',
      key: 'NameIDFormat',
      isRequired: true,
      editable: false,
      ellipsis: true,
    },
    {
      title: <Trans>X-509 Certificate</Trans>,
      dataIndex: 'xCertificate',
      key: 'xCertificate',
      isRequired: true,
      editable: false,
      width: '25%',
      ellipsis: true,
    },
    {
      title: <Trans>Action</Trans>,
      dataIndex: 'action',
      key: 'action',
      width: '90px',
      fixed: 'right' as 'right',
      className: 'column-action',
      render: (_: any, row: any) => {
        return (
          <>
            <EditOutlined onClick={openForm.bind(null, row)} />
          </>
        );
      },
    },
  ];

  const handleAddConfig = () => {
    const newItem: Item = {
      key: data.length + 1 + '',
      entityId: '',
      singleSignOnService: '',
      singleLogoutService: '',
      singleLogoutServiceBinding:
        'urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect',
      xCertificate: '',
      NameIDFormat: '',
      isEditable: true,
      isRequired: true,
      isNew: true,
      consumerService: '',
    };
    setEditingKey('');
    setFullScreenForm(true);
    setFullScreenFormData(newItem);
  };

  const openForm = (row: Item, _ev: React.MouseEvent<HTMLButtonElement>) => {
    if (editingKey !== '' || descriptionVisibility) {
      return;
    }
    setFullScreenForm(true);
    form.setFieldsValue({ ...row, entityID: row.entityId });
  };

  const closeFullscreenForm = (_ev: React.MouseEvent<HTMLButtonElement>) => {
    setFullScreenForm(false);
    setFullScreenFormData(defaultFullScreenFormData);
  };

  const fullScreenFormVisibility = fullScreenForm;

  const addButtonVisibility = data && data.length > 0 ? false : true;
  let tableData = [];
  if (!addButtonVisibility) {
    const item: any = data[0];
    const { sp, idp } = item.settings;
    let nameIdFormat = sp.NameIDFormat;

    if (sp.NameIDFormat === 'EMAIL') {
      nameIdFormat = 'urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress';
    } else if (sp.NameIDFormat === 'UNSFD') {
      nameIdFormat = 'urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified';
    }

    const obj = {
      entityId: idp.entityId,
      singleSignOnService: idp.singleSignOnService?.url,
      singleLogoutService: idp.singleLogoutService?.url,
      singleLogoutServiceBinding: idp.singleLogoutService?.binding,
      xCertificate: idp.x509cert,
      NameIDFormat: nameIdFormat,
    };
    tableData.push(obj);
  }

  return (
    <div ref={sSSOConfigContainerRef} className='ssoConfig-container'>
      <Form component={false}>
        <FilterBar
          isAddButton={addButtonVisibility}
          addButtonOnClickFn={handleAddConfig}
          isAddButtonDisabled={
            editingKey !== '' ||
            descriptionVisibility ||
            fullScreenFormVisibility
          }
        />
        {!addButtonVisibility ? (
          <Table
            bordered={true}
            columns={columns}
            dataSource={tableData}
            pagination={false}
            // tableLayout='fixed'
            scroll={{
              x: 1600,
            }}
            expandable={{
              expandedRowRender: () => null,
              rowExpandable: () => true,
              expandIcon: ({ record }) =>
                descriptionVisibility ? (
                  <FullscreenExitOutlined
                    onClick={toggleDescriptionVisibility.bind(null, record)}
                    title='Close Detail Information'
                  />
                ) : (
                  <FullscreenOutlined
                    onClick={toggleDescriptionVisibility.bind(null, record)}
                    title='Open Detail Information'
                  />
                ),
            }}
            rowKey='entityId'
          />
        ) : (
          <NoData />
        )}
      </Form>
      <AppDrawer
        title={<Trans>SSO Configuration</Trans>}
        width={'50%'}
        onClose={(ev: any) => closeFullscreenForm(ev)}
        visible={fullScreenFormVisibility}
        className='form-drawer'
        getContainer={
          sSSOConfigContainerRef ? sSSOConfigContainerRef.current : 'undefined'
        }
        onCancelClick={closeFullscreenForm}
        onOkClick={onSave}
        OkText={data ? <Trans>Update</Trans> : 'Create'}
      >
        <Form
          name='nest-messages'
          colon={false}
          {...{ autoComplete: 'off' }}
          form={form}
          layout='vertical'
        >
          <Form.Item
            name='entityID'
            label={<Trans>Entity Id</Trans>}
            rules={[{ required: true, message: Errors.ENTITY_ID_REQUIRED }]}
          >
            <Input defaultValue={fullScreenFormData.entityId} />
          </Form.Item>
          <Form.Item
            name='singleSignOnService'
            label={<Trans>Single Sign On Service</Trans>}
            rules={[{ required: true, message: Errors.SINGLE_SIGN_REQUIRED }]}
          >
            <Input defaultValue={fullScreenFormData.singleSignOnService} />
          </Form.Item>
          <Form.Item
            name='singleLogoutService'
            label={<Trans>Single Logout Service</Trans>}
            rules={[{ required: true, message: Errors.SINGLE_LOGOUT_REQUIRED }]}
          >
            <Input defaultValue={fullScreenFormData.singleLogoutService} />
          </Form.Item>
          <Form.Item
            name='singleLogoutServiceBinding'
            label={<Trans>Single Logout Service Binding</Trans>}
          >
            <Select defaultValue='urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect'>
              <Select.Option
                key='urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST'
                value='urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST'
              >
                urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST
              </Select.Option>
              <Select.Option
                key='urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect'
                value='urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect'
              >
                urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect
              </Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name='xCertificate'
            label={<Trans>X-509 Certificate</Trans>}
            rules={[{ required: true, message: Errors.CERTIFICATE_REQUIRED }]}
          >
            <Input.TextArea
              defaultValue={fullScreenFormData.xCertificate}
              rows={4}
            />
          </Form.Item>
          <Form.Item label={<Trans>Name Id Format</Trans>} name='NameIDFormat'>
            <Select>
              {nameIDFormatList.map(item => (
                <Select.Option key={item.code} value={item.title}>
                  {item.title}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </AppDrawer>
      <AppDrawer
        width='60%'
        data-test='appDrawer'
        title={<Trans>SSO Configuration Detail Information</Trans>}
        visible={descriptionVisibility}
        destroyOnClose={true}
        closable={true}
        onClose={e => toggleDescriptionVisibility(fullScreenFormData, e as any)}
        showCancelButton={false}
        showOkButton={false}
        getContainer='.ssoConfig-container'
      >
        <Row className='trip-details-info' gutter={[24, 24]}>
          <DetailsDrawerSingleInfo
            label={<Trans>Entity Id</Trans>}
            content={fullScreenFormData.entityId || ' - '}
            colProps={{ span: 24 }}
          />
          <DetailsDrawerSingleInfo
            label={<Trans>Single Sign On Service</Trans>}
            content={fullScreenFormData.singleSignOnService || ' - '}
            colProps={{ span: 24 }}
          />
          <DetailsDrawerSingleInfo
            label={<Trans>Single Logout Service</Trans>}
            content={fullScreenFormData.singleLogoutService || ' - '}
            colProps={{ span: 24 }}
          />
          <DetailsDrawerSingleInfo
            label={<Trans>Single Logout Service Binding</Trans>}
            content={fullScreenFormData.singleLogoutServiceBinding || ' - '}
            colProps={{ span: 24 }}
          />
          <DetailsDrawerSingleInfo
            label={<Trans>Name ID Format</Trans>}
            content={fullScreenFormData.NameIDFormat || ' - '}
            colProps={{ span: 24 }}
          />
          <DetailsDrawerSingleInfo
            label={<Trans>X-509 Certificate</Trans>}
            content={fullScreenFormData.xCertificate || ' - '}
            colProps={{ span: 24 }}
          />
        </Row>
      </AppDrawer>
    </div>
  );
};

const mapStateToProps = (state: any) => ({
  ssoList: getSSOConfigRecords(state),
  success: getConfigurationSuccessMessage(state),
  error: getConfigurationErrorMessage(state),
  activeKey: state.configuration.activeKey,
  nameIDFormatList: getNameIdFormats(state),
});

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  fetchSSOList: (id?: string) => dispatch(fetchSSOConfigList(id)),
  createSSOConfiguration: (body: any, id: string) =>
    dispatch(createSSOConfigurationItem(body, id)),
  _fetchNameIdFormatList: () => dispatch(fetchNameIdFormatList()),
});

const connector = connect(mapStateToProps, mapDispatchToProps);
export default connector(SSOConfig);
