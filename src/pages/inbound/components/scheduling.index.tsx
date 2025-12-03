/* eslint-disable react-hooks/exhaustive-deps */
import React, { Dispatch, useEffect, useState } from 'react';
import {
  TimePicker,
  Input,
  Select,
  Form,
  message,
  Table,
  Skeleton,
} from 'antd';

import {
  getInboundSchedule,
  getFtpConfigRecords,
  getInboundError,
  getInboundLoader,
  getInboundIsDataSaving,
  getInboundSuccess,
} from '../../../shared/redux/rootReducer';
import { connect, ConnectedProps } from 'react-redux';
import { fetchSchedules, createUpdateSchedule } from '../inbound.thunk';
import moment from 'moment';

import { fetchFtpConfigList } from '../../configurations/configurations.thunk';
import {
  EditOutlined,
  EllipsisOutlined,
  FullscreenOutlined,
} from '@ant-design/icons';
import { resetMessages } from '../inbound.action';
import {
  ErrorBoundary,
  NoData,
  ElementOrSkeleton,
  FilterBar,
  AppDrawer,
  DotMenu,
} from '../../../shared/components';
import ScheduleDetails from '../../outbound/components/scheduleDetails';
import { Trans } from '@lingui/macro';

const Scheduling: React.FC<ConnectedProps<typeof connector>> = ({
  _fetchSchedule,
  _createUpdateSchedule,
  _fetchFTPServers,
  _resetMessages,
  inboundSchedule,
  ftpServers,
  isDataSaving,
  success,
  error,
  loader,
}) => {
  const [form] = Form.useForm();
  const [modalConfig, setModalConfig] = useState<{
    isVisible: boolean;
    key?: number;
    item?: any;
  }>({ isVisible: false });

  useEffect(() => {
    _fetchSchedule();
    _fetchFTPServers();
  }, []);

  useEffect(() => {
    if (success) {
      setModalConfig({ isVisible: false });
    }
  }, [success]);

  const openNewModal = () => {
    setModalConfig({ isVisible: true });
  };

  const onUpdateItem = (item: any) => {
    const value = item.time_to_run
      ? moment(item.time_to_run, [moment.ISO_8601, 'HH:mm'])
      : undefined;
    const fields = {
      ...item,
      time_to_run: value,
      ftp_configuration: item.ftp_configuration?.id,
      days_to_run: item.days_to_run?.join(','),
      recipients: item.recipients?.join(','),
    };
    form.setFieldsValue(fields);
    setModalConfig({ isVisible: true, key: 1 });
  };

  const columns = [
    {
      dataIndex: '',
      title: <Trans>Inbound Type</Trans>,
      render: () => 'Exchange Rate',
    },
    // {
    //   dataIndex: 'data_pull_directory',
    //   title: 'Data Pull Category',
    //   ellipse: true,
    // },
    // {
    //   dataIndex: 'archive_directory',
    //   title: 'Archive Directory',
    //   ellipse: true,
    // },
    {
      dataIndex: 'ftp_configuration',
      title: <Trans>FTP Configuration</Trans>,
      render: (val: any) => val?.ip_address || val.hostname,
    },
    {
      dataIndex: 'time_to_run',
      title: <Trans>Time To Run</Trans>,
    },
    {
      dataIndex: 'days_to_run',
      title: <Trans>Days To Run</Trans>,
      render: (val: any) => val?.join(' , '),
    },
    // {
    //   dataIndex: 'recipients',
    //   title: 'Recipients',
    //   render: (val: any) => val?.join(' , '),
    // },
    {
      title: <Trans>Action</Trans>,
      width: 100,
      align: 'center' as 'center',
      render: (id: any, item: any) => (
        <DotMenu
          actionBtn={[
            {
              children: <Trans>Update</Trans>,
              Type: 'link',
              icon: EditOutlined,
              OnClick: () => onUpdateItem(item),
            },
          ]}
        >
          <EllipsisOutlined />
        </DotMenu>
      ),
    },
  ];

  useEffect(() => {
    if (error) {
      if (error instanceof Object) {
        if (error.error) {
          message.error(error.error);
        } else {
          message.error('Failed to schedule');
          let errors = Object.keys(error).map(item => ({
            name: item,
            errors: error[item],
          }));
          form.setFields(errors);
        }
      } else if (typeof error === 'string') {
        message.error(error || 'Something went wrong');
      }
    }
  }, [error]);

  // useEffect(() => {
  //   const value =
  //     inboundSchedule && Object.keys(inboundSchedule).length > 0
  //       ? inboundSchedule.time_to_run
  //         ? moment(inboundSchedule.time_to_run, [moment.ISO_8601, 'HH:mm'])
  //         : undefined
  //       : undefined;

  //   const fields = {
  //     ...inboundSchedule,
  //     time_to_run: value,
  //     ftp_configuration: inboundSchedule.ftp_configuration?.id,
  //     days_to_run: inboundSchedule.days_to_run?.join(','),
  //     recipients: inboundSchedule.recipients?.join(','),
  //   };
  //   form.setFieldsValue(fields);
  // }, [inboundSchedule]);

  const updateSchedule = async () => {
    try {
      // const id =
      //   inboundSchedule && Object.keys(inboundSchedule).length > 0
      //     ? inboundSchedule.id
      //     : undefined;
      const id = modalConfig.key;
      const values = await form.validateFields();
      const object = {
        ...values,
        time_to_run: values.time_to_run?.format('HH:mm'),
        days_to_run: values.days_to_run
          ? values.days_to_run.split(',')
          : undefined,
        recipients: values.recipients
          ? values.recipients.split(',')
          : undefined,
      };
      _createUpdateSchedule(object, id);
    } catch (e) {}
  };

  const closeModal = () => {
    setModalConfig({ isVisible: false });
  };
  const onItemExpand = (record: any) => {
    setModalConfig({ isVisible: true, item: record });
  };
  const rules = [{ required: true, message: 'This fields is required' }];
  // const rules: any = [];
  if (loader)
    return (
      <ElementOrSkeleton
        type='table'
        tableConfiguration={{ columns: 10, rows: 6 }}
        isLoading={loader}
        isActive={true}
      />
    );
  // if (inboundSchedule.length === 0) {
  //   return <NoData />;
  // }
  return (
    <ErrorBoundary>
      <div className='inbound-container'>
        {inboundSchedule.length === 0 && (
          <FilterBar isAddButton={true} addButtonOnClickFn={openNewModal} />
        )}
        {inboundSchedule.length === 0 ? (
          <NoData />
        ) : (
          <Table
            dataSource={inboundSchedule}
            columns={columns}
            bordered
            pagination={{ hideOnSinglePage: true }}
            scroll={{ x: 1200 }}
            expandable={{
              expandedRowRender: () => null,
              rowExpandable: () => true,
              expandIcon: ({ record }) =>
                loader ? (
                  <Skeleton.Input size='small' active={loader} />
                ) : (
                  <FullscreenOutlined
                    onClick={() => onItemExpand(record)}
                    title='Details'
                  />
                ),
            }}
          />
        )}
        <AppDrawer
          visible={modalConfig.isVisible && !modalConfig.item}
          title={
            modalConfig.key ? (
              <Trans>Update Schedule</Trans>
            ) : (
              <Trans>Create Schedule</Trans>
            )
          }
          width='40%'
          OkText={
            modalConfig.key ? <Trans>Update</Trans> : <Trans>Create</Trans>
          }
          closable={true}
          getContainer='.inbound-container'
          onOkClick={updateSchedule}
          onCancelClick={closeModal}
          onClose={closeModal}
        >
          <div className='inbound-scheduling-container'>
            <Form form={form} layout='vertical'>
              <Form.Item
                label={<Trans>Currency Data Pull Directory</Trans>}
                name='data_pull_directory'
                rules={rules}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label={<Trans>Currency Archive Directory</Trans>}
                name='archive_directory'
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
              <Form.Item
                name='days_to_run'
                label={<Trans>Days to run(Comma separated)</Trans>}
                rules={[
                  ...rules,
                  { pattern: /^[-,0-9]+$/, message: 'Invalid Input' },
                  {
                    validator: (_, val: string) => {
                      const values = val?.split(',');
                      let isFailed = false;
                      values?.forEach(num => {
                        if (+num < 1 || +num > 31) {
                          isFailed = true;
                        }
                      });
                      if (isFailed)
                        return Promise.reject(
                          'Number should be between 1 and 31 ',
                        );
                      return Promise.resolve();
                    },
                    message: 'Number should be between 1 and 31',
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name='recipients'
                label={<Trans>Recipients(Comma separated)</Trans>}
                rules={[
                  { required: true, message: 'This field is required' },
                  {
                    pattern: /^([\w+-.%]+@[\w-.]+\.[A-Za-z]{2,4}?)+$/,
                    message: 'Invalid Input',
                  },
                ]}
              >
                <Input />
              </Form.Item>
              {/* <Row align='middle'> */}
              {/* <Col span={20}> */}
              <Form.Item
                label={<Trans>Time</Trans>}
                name='time_to_run'
                rules={rules}
              >
                <TimePicker
                  format='HH:mm'
                  style={{ width: '100%' }}
                  // minuteStep={10}
                />
              </Form.Item>
              {/* </Col> */}
              {/* <Col span={4} style={{ marginTop: '16px' }}>
                  <Button type='primary' onClick={updateScheduleTime}>
                    Update
                  </Button>
                </Col> */}
              {/* </Row> */}
            </Form>
          </div>
        </AppDrawer>
        <AppDrawer
          visible={modalConfig.isVisible && modalConfig.item}
          title={modalConfig.item?.category?.title || 'Exchange Rate'}
          width='40%'
          showOkButton={false}
          closable={true}
          getContainer='.inbound-container'
          onCancelClick={closeModal}
          onClose={closeModal}
          cancelText='Close'
        >
          <ScheduleDetails item={modalConfig.item} />
        </AppDrawer>
      </div>
    </ErrorBoundary>
  );
};

const mapStateToProps = (state: any) => ({
  // tenantConfig: getTenantConfigRecords(state),
  inboundSchedule: getInboundSchedule(state),
  ftpServers: getFtpConfigRecords(state),
  error: getInboundError(state),
  loader: getInboundLoader(state),
  isDataSaving: getInboundIsDataSaving(state),
  success: getInboundSuccess(state),
});

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  // _fetchTenantConfig: () => dispatch(fetchTenantConfigList()),
  _fetchSchedule: () => dispatch(fetchSchedules()),
  _createUpdateSchedule: (body: any, id?: number) =>
    dispatch(createUpdateSchedule(body, id)),
  _fetchFTPServers: () => dispatch(fetchFtpConfigList()),
  _resetMessages: () => dispatch(resetMessages()),
});

export const connector = connect(mapStateToProps, mapDispatchToProps);
export default connector(Scheduling);
