/* eslint-disable react-hooks/exhaustive-deps */
import React, { Dispatch, useEffect } from 'react';
import { TimePicker, Button, Input, Select, Form, Row, Col } from 'antd';

import {
  getTenantConfigRecords,
  getSFIntegrationSchedule,
  getFtpConfigRecords,
  getSFIntegrationError,
  getSFIntegrationLoader,
  getSFIntegrationLoadingMessage,
  getSFIntegrationDataSubmitLoader,
} from '../../../shared/redux/rootReducer';
import { connect, ConnectedProps } from 'react-redux';
import {
  fetchSchedules,
  createUpdateSchedule,
  executeJobManually,
} from '../sfIntegration.thunk';
import moment from 'moment';
import { useHistory } from 'react-router-dom';
import { appPath } from '../../app/app.routes';
import {
  fetchTenantConfigList,
  fetchFtpConfigList,
} from '../../configurations/configurations.thunk';

import './components.index.less';
import { resetMessages } from '../sfIntegration.actions';
import { ErrorBoundary } from '../../../shared/components';
import { Trans } from '@lingui/macro';

const Scheduling: React.FC<ConnectedProps<typeof connector>> = ({
  _fetchTenantConfig,
  _fetchSchedule,
  _createUpdateSchedule,
  _runJobManually,
  _fetchFTPServers,
  _resetMessages,
  sfSchedule,
  tenantConfig,
  ftpServers,
  error,
  isDataSubmitting,
  isLoader,
  loadingMessage,
}) => {
  const [form] = Form.useForm();
  const history = useHistory();

  useEffect(() => {
    const timeZone =
      tenantConfig && tenantConfig.length > 0
        ? tenantConfig[0].timezone.title
        : '';

    form.setFieldsValue({ time_zone: timeZone });
  }, [tenantConfig]);

  // useEffect(() => {
  //   if ((isLoader || isDataSubmitting) && loadingMessage)
  //     message.loading(loadingMessage);
  // }, [isLoader, loadingMessage, isDataSubmitting]);
  useEffect(() => {
    _fetchTenantConfig();
    _fetchSchedule();
    _fetchFTPServers();
  }, []);

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

  const updateTimeZone = () => {
    history.push(
      `${appPath.settings.configuration.linkTo}global?next=sf-integration`,
    );
  };
  useEffect(() => {
    const value =
      sfSchedule && Object.keys(sfSchedule).length > 0
        ? sfSchedule.time_to_run
          ? moment(sfSchedule.time_to_run, [moment.ISO_8601, 'HH:mm'])
          : undefined
        : undefined;

    const fields = { ...sfSchedule, time_to_run: value };
    form.setFieldsValue(fields);
  }, [sfSchedule]);

  const updateScheduleTime = async () => {
    try {
      const id =
        sfSchedule && Object.keys(sfSchedule).length > 0
          ? sfSchedule.id
          : undefined;

      const values = await form.validateFields();
      const object = {
        ...values,
        title: 'SFINT',
        time_to_run: values.time_to_run?.format('HH:mm'),
      };

      _createUpdateSchedule(object, id);
    } catch (e) {}
  };

  const runJobManually = () => {
    _runJobManually();
  };

  const rules = [{ required: true, message: 'This fields is required' }];

  return (
    <ErrorBoundary>
      <div className='scheduling-container'>
        <Form form={form} layout='vertical'>
          <Form.Item noStyle>
            <Form.Item
              label={<Trans>Time Zone</Trans>}
              name='time_zone'
              style={{ marginBottom: '0px' }}
              data-test='timezone'
            >
              <Input disabled />
            </Form.Item>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button type='link' onClick={updateTimeZone}>
                <Trans>Update Timezone</Trans>
              </Button>
            </div>
          </Form.Item>
          <Form.Item
            label={<Trans>Data Directory</Trans>}
            name='data_directory'
            rules={rules}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={<Trans>Archive Directory</Trans>}
            name='archive_directory'
            rules={rules}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={<Trans>CSV Delimiter</Trans>}
            name='csv_delimiter'
            rules={rules}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={<Trans>FTP Server</Trans>}
            name='ftp_configuration'
            rules={rules}
          >
            <Select>
              {ftpServers?.map((item: any) => (
                <Select.Option value={item.id}>
                  {item.hostname || item.ip_address}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          {/* <Form.Item> */}
          <Row align='middle'>
            <Col span={20}>
              <Form.Item
                label={<Trans>Time</Trans>}
                name='time_to_run'
                rules={rules}
              >
                <TimePicker
                  format='HH:mm'
                  style={{ width: '90%' }}
                  minuteStep={10}
                />
              </Form.Item>
            </Col>
            <Col span={4} style={{ marginTop: '16px' }}>
              <Button type='primary' onClick={updateScheduleTime}>
                <Trans>Update</Trans>
              </Button>
            </Col>
          </Row>
        </Form>
        <Button type='primary' onClick={runJobManually} className='manual-job'>
          <Trans>Manually Run Job</Trans>
        </Button>
      </div>
    </ErrorBoundary>
  );
};

const mapStateToProps = (state: any) => ({
  tenantConfig: getTenantConfigRecords(state),
  sfSchedule: getSFIntegrationSchedule(state),
  ftpServers: getFtpConfigRecords(state),
  error: getSFIntegrationError(state),
  isLoader: getSFIntegrationLoader(state),
  loadingMessage: getSFIntegrationLoadingMessage(state),
  isDataSubmitting: getSFIntegrationDataSubmitLoader(state),
});

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  _fetchTenantConfig: () => dispatch(fetchTenantConfigList()),
  _fetchSchedule: () => dispatch(fetchSchedules()),
  _createUpdateSchedule: (body: any, id?: string) =>
    dispatch(createUpdateSchedule(body, id)),
  _runJobManually: () => dispatch(executeJobManually()),
  _fetchFTPServers: () => dispatch(fetchFtpConfigList()),
  _resetMessages: () => dispatch(resetMessages()),
});

export const connector = connect(mapStateToProps, mapDispatchToProps);
export default connector(Scheduling);
