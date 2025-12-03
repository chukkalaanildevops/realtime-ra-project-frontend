/* eslint-disable react-hooks/exhaustive-deps */

import React, { Dispatch, useEffect, useState } from 'react';
import { ConnectedProps, connect } from 'react-redux';
import {
  getTenantConfigRecords,
  getConfigurationErrorMessage,
  getConfigurationSuccessMessage,
  getTimeZones,
  getLanguages,
  getSaveDataLoader,
  getAuthTenant,
} from '../../../shared/redux/rootReducer';
import {
  fetchTenantConfigList,
  createUpdateTenantConfig,
  fetchTimeZoneList,
  fetchLanguagesList,
} from '../configurations.thunk';
import { Select, Form, Button, message, Switch, Input } from 'antd';
import './tenantConfig.index.less';
import { useHistory } from 'react-router-dom';
import { setSuccess } from '../configurations.actions';
import { Trans } from '@lingui/macro';
import { getQueryString } from '../../../utils/scroll.utils';
import TextArea from 'antd/lib/input/TextArea';

const TenantConfig: React.FC<ConnectedProps<typeof connector>> = ({
  _createUpdateTenant,
  _fetchTenants,
  _fetchTimeZoneList,
  _setSuccess,
  _fetchLanguages,
  tenantRecords,
  tenant,
  timeZones,
  error,
  success,
  languages,
  dataSaveLoader,
}) => {
  const [filteredTimeZones, setTimeZones] = useState(timeZones);
  const [form] = Form.useForm();
  const [switchForm] = Form.useForm();
  const [
    emailTestingCheckboxEnabled,
    setEmailTestingCheckboxEnabled,
  ] = useState<boolean>(true);
  const [
    emailTestingCheckboxChecked,
    setEmailTestingCheckboxChecked,
  ] = useState<boolean>(false);
  const history = useHistory();

  useEffect(() => {
    _fetchTenants();
    _fetchTimeZoneList();
    _fetchLanguages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (tenantRecords && tenantRecords.length > 0) {
      const record = tenantRecords[0];
      const values = {
        ...record,
        timezone: record.timezone.id,
        language: record.language.id,
        authentication_type: record.authentication_type.code,
      };
      if (
        record.test_emails !== null &&
        typeof record.test_emails !== 'string'
      ) {
        record.test_emails = (record.test_emails || []).join(',');
      } else {
        record.test_emails = undefined;
      }
      form.setFieldsValue(values);
      switchForm.setFieldsValue(record);
      setEmailTestingCheckboxChecked(record.is_email_testing_on);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tenantRecords]);

  useEffect(() => {
    error && typeof error === 'string' && message.error(error);
  }, [error]);

  useEffect(() => {
    setTimeZones(timeZones);
  }, [timeZones]);

  useEffect(() => {
    if (success && getQueryString('next') === 'sf-integration') {
      setTimeout(() => {
        _setSuccess('');
        history.goBack();
      }, 100);
    }
  }, [success]);

  useEffect(() => {
    if (dataSaveLoader) {
      message.loading('Updating record');
    } else {
      message.destroy();
    }
  }, [dataSaveLoader]);

  const updateData = async () => {
    try {
      const values = await form.validateFields();
      const switchValues = await switchForm.validateFields();
      if (emailTestingCheckboxChecked === true) {
        if (switchValues.test_emails !== undefined) {
          switchValues.test_emails = switchValues.test_emails
            .split(',')
            .filter((email: string) => email.trim().length > 0)
            .map((email: string) => email.trim());
        }
      } else {
        switchValues.test_emails = [];
      }

      const id =
        tenantRecords && tenantRecords.length > 0 ? tenantRecords[0].id : null;
      _createUpdateTenant({ ...values, ...switchValues }, id);
    } catch (e) {
      console.error(e);
    }
  };

  const renderOptions = (options: any[]) => {
    return options.map(item => (
      <Select.Option key={item.id} value={item.id}>
        {item.title}
      </Select.Option>
    ));
  };

  const onSearchTimeZones = (value: string) => {
    const values = timeZones.filter(
      item => item.title.toLowerCase().indexOf(value.toLowerCase()) > -1,
    );
    setTimeZones(values);
  };

  const validateEmails = (value: string) => {
    let emailsValid = true;
    let emailRegex = new RegExp(
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
    );

    if (value === undefined) {
      return false;
    }

    if (value !== undefined && value !== null) {
      let recipients = value
        .split(',')
        .map((email: string) => email.trimRight().trimLeft());

      if (recipients.length === 0 && recipients[0].length === 0) {
        return false;
      }

      recipients.forEach((email: string) => {
        if (
          emailsValid === true &&
          email.length > 0 &&
          emailRegex.test(email) !== true
        ) {
          emailsValid = false;
        }
      });
    }
    return emailsValid;
  };

  return (
    <div className='tenant-config-container'>
      <Form form={form} layout='vertical'>
        <Form.Item
          name='timezone'
          label={<Trans>Timezone</Trans>}
          rules={[{ required: true, message: 'Time Zone required' }]}
        >
          <Select
            showSearch={true}
            filterOption={false}
            onSearch={onSearchTimeZones}
          >
            {renderOptions(filteredTimeZones)}
          </Select>
        </Form.Item>
        <Form.Item name='language' label={<Trans>Language</Trans>}>
          <Select disabled={true}>{renderOptions(languages)}</Select>
        </Form.Item>
        <Form.Item
          name='authentication_type'
          label={<Trans>Authentication Type</Trans>}
        >
          <Select>
            <Select.Option key='SSO' value='SSO'>
              <Trans>SSO Authentication</Trans>
            </Select.Option>
            <Select.Option key='JWT' value='JWT'>
              <Trans>Basic Authentication</Trans>
            </Select.Option>
            <Select.Option key='ALL' value='ALL'>
              <Trans>All</Trans>
            </Select.Option>
          </Select>
        </Form.Item>
      </Form>
      <Form layout='vertical' form={switchForm} colon={false}>
        <Form.Item
          className='switch-field'
          name='is_enabled_email_notifications'
          valuePropName='checked'
          label={<Trans>Email Service</Trans>}
        >
          <Switch
            className='toggle-button'
            onChange={(checked: boolean, event) => {
              setEmailTestingCheckboxEnabled(checked);
              if (!checked) {
                setEmailTestingCheckboxChecked(false);
              }
            }}
          />
        </Form.Item>
        <Form.Item
          className='switch-field'
          name='is_email_testing_on'
          valuePropName='checked'
          label={<Trans>Send Emails For Testing Only</Trans>}
        >
          <Switch
            checked={emailTestingCheckboxChecked}
            disabled={!emailTestingCheckboxEnabled}
            className='toggle-button'
            onChange={(checked, event) => {
              setEmailTestingCheckboxChecked(checked);
              if (!checked) {
                let values = switchForm.getFieldsValue();
                values.test_emails = undefined;
                switchForm.setFieldsValue(values);
              }
            }}
          />
        </Form.Item>
        <Form.Item
          name='test_emails'
          validateTrigger='onBlur'
          rules={[
            ({ getFieldValue }) => ({
              validator(rule, value) {
                if (emailTestingCheckboxChecked === true) {
                  if (validateEmails(value) === true) {
                    return Promise.resolve();
                  } else {
                    return Promise.reject('Emails are invalid');
                  }
                } else {
                  return Promise.resolve();
                }
              },
            }),
          ]}
          label={<Trans>Test Email Recipients(Comma-separated emails)</Trans>}
        >
          <Input disabled={!emailTestingCheckboxChecked} />
        </Form.Item>
        <Form.Item
          className='switch-field'
          name='is_enabled_benefits'
          valuePropName='checked'
          label={<Trans>Benefits</Trans>}
        >
          <Switch className='toggle-button' />
        </Form.Item>
        <Form.Item
          className='switch-field'
          name='is_enabled_petty_cash'
          valuePropName='checked'
          label={<Trans>Petty Cash</Trans>}
        >
          <Switch className='toggle-button' />
        </Form.Item>
        {tenant !== 'parkway' && (
          <Form.Item
            className='switch-field'
            name='is_enabled_allowance'
            valuePropName='checked'
            label={<Trans>Allowance</Trans>}
          >
            <Switch className='toggle-button' />
          </Form.Item>
        )}
        <Form.Item
          className='switch-field'
          name='is_delegate_manager_on_behalf_of_employee'
          valuePropName='checked'
          label={<Trans>Enable Manager - Reportee Delegation</Trans>}
        >
          <Switch className='toggle-button' />
        </Form.Item>
        <Form.Item
          className='switch-field'
          name='is_enabled_file_splitting_for_settlement'
          valuePropName='checked'
          label={<Trans>Enable File Splitting For Settlement</Trans>}
        >
          <Switch className='toggle-button' />
        </Form.Item>
        <Form.Item
          className='switch-field'
          name='is_enabled_file_encryption'
          valuePropName='checked'
          label={<Trans>Enable File Encryption</Trans>}
        >
          <Switch className='toggle-button' />
        </Form.Item>
        <Form.Item
          className='switch-field'
          name='is_enabled_inbound_file_encryption'
          valuePropName='checked'
          label={<Trans>Enable Inbound File Encryption</Trans>}
        >
          <Switch className='toggle-button' />
        </Form.Item>
        <Form.Item
          name='logout_confirmation_msg'
          label={<Trans>Logout Confirmation Message</Trans>}
          rules={[
            { required: true, message: 'Logout Confirmation Message required' },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name='email_footer'
          label={<Trans>Email Footer</Trans>}
          rules={[{ required: true, message: 'Email Footer required' }]}
        >
          <TextArea />
        </Form.Item>
        <Button onClick={updateData} style={{ float: 'right' }} type='primary'>
          <Trans>Update</Trans>
        </Button>
      </Form>
    </div>
  );
};

const mapStateToProps = (state: any) => ({
  tenantRecords: getTenantConfigRecords(state),
  error: getConfigurationErrorMessage(state),
  success: getConfigurationSuccessMessage(state),
  timeZones: getTimeZones(state),
  languages: getLanguages(state),
  dataSaveLoader: getSaveDataLoader(state),
  tenant: getAuthTenant(state),
});

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  _fetchTenants: () => dispatch(fetchTenantConfigList()),
  _createUpdateTenant: (body: any, id?: string) =>
    dispatch(createUpdateTenantConfig(body, id)),
  _fetchTimeZoneList: () => dispatch(fetchTimeZoneList()),
  _setSuccess: (msg: string) => dispatch(setSuccess(msg)),
  _fetchLanguages: () => dispatch(fetchLanguagesList()),
});
const connector = connect(mapStateToProps, mapDispatchToProps);

export default connector(TenantConfig);
