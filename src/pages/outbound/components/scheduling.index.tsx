/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  Dispatch,
  useEffect,
  useState,
  ComponentType,
  useRef,
} from 'react';
import {
  Input,
  Select,
  Form,
  message,
  Table,
  Skeleton,
  Tabs,
  Modal,
} from 'antd';

import { ExclamationCircleOutlined } from '@ant-design/icons';
import {
  getOutboundSchedule,
  getFtpConfigRecords,
  getOutboundError,
  getOutboundSuccess,
  getOutboundFileFormats,
  getOutboundLoader,
  getOutboundDataSaveLoader,
  getOutboundCategoryRecords,
  getOutboundFileSplitRecords,
  getOutboundDateFormat,
  getOutboundDelimiter,
} from '../../../shared/redux/rootReducer';
import { connect, ConnectedProps } from 'react-redux';
import {
  tabKeyUpdateAction,
  tabSwitchConfirmationVisibilityAction,
  updateUserLabelList,
  updateLabelData,
} from '../outbound.action';
import { Ilabel } from '../outbound.model';
import {
  fetchSchedules,
  fetchScheduleCategoryList,
  fetchScheduleFileSplitList,
  createUpdateSchedule,
  fetchFileFormats,
  fetchScheduleDateFormatList,
  fetchScheduleDelimiterList,
  fetchLabelMappingList,
} from '../outbound.thunk';

import { fetchFtpConfigList } from '../../configurations/configurations.thunk';

import {
  ErrorBoundary,
  DotMenu,
  FilterBar,
  NoData,
  AppDrawer,
  ElementOrSkeleton,
  CronBuilder,
  LabelMapping,
} from '../../../shared/components';
import {
  EllipsisOutlined,
  EditOutlined,
  FullscreenOutlined,
} from '@ant-design/icons';
import ScheduleDetails from './scheduleDetails';
import { buildCronString } from '../../../utils/global.utils';
import { Trans } from '@lingui/macro';

const Scheduling: React.FC<ConnectedProps<typeof connector>> = ({
  _fetchSchedule,
  _fetchScheduleCategory,
  _fetchScheduleFileSplit,
  _fetchScheduleDateFormat,
  _fetchScheduleDelimiter,
  _createUpdateSchedule,
  _fetchFTPServers,
  _fetchFileFormats,
  _tabKeyUpdate,
  _tabSwitchConfirmationVisibilityAction,
  _fetchLabelMappingList,
  _updateLabelData,
  _updateUserLabelList,
  fileFormats,
  loader,
  outboundSchedule,
  ftpServers,
  categoryRecords,
  fileSplitRecords,
  dateFormat,
  delimiter,
  success,
  error,
  activeTabKey,
  tabSwitchConfirmationVisibility,
  loadingLabelMappingList,
  label,
  labelList,
  userLabelList,
}) => {
  const { confirm } = Modal;
  const layoutRef = useRef(null);
  const [form] = Form.useForm();
  const [, forceUpdate] = useState(false);
  const [modalConfig, setModalConfig] = useState<{
    isVisible: boolean;
    key?: number;
    item?: any;
  }>({ isVisible: false });

  const [isOneTimePayment, setIsOneTimePayment] = useState<any>(false);

  useEffect(() => {
    if (success) {
      setModalConfig({ isVisible: false });
    }
  }, [success]);

  useEffect(() => {
    _fetchSchedule();
    _fetchFTPServers();
    _fetchFileFormats();
    _fetchScheduleCategory();
    _fetchScheduleFileSplit();
    _fetchScheduleDateFormat();
    _fetchScheduleDelimiter();
  }, []);

  useEffect(() => {
    const defaultLabelList = userLabelList.map((label: any) => label.default);
    form.setFieldsValue({ fields_to_post: defaultLabelList });
  }, [userLabelList]);

  const [cron, setCron] = useState<{
    when_to_run: 'EVERDAY' | 'DAYWEEK' | 'DAYMNTH' | 'NEVER';
    days_of_week_to_run: string[];
    days_to_run: string[];
    time_to_run: string;
  }>({
    when_to_run: 'EVERDAY',
    days_of_week_to_run: [],
    days_to_run: [],
    time_to_run: '00:00',
  });

  const getFrequescyFromCode = (code: 'ED' | 'DOM' | 'DOW' | 'NEV') => {
    enum EFrequency {
      'ED' = 'EVERDAY',
      'DOM' = 'DAYMNTH',
      'DOW' = 'DAYWEEK',
      'NEV' = 'NEVER',
    }

    return EFrequency[code];
  };

  const buildAndSetCron = (
    time: string,
    daysOfWeek: string[],
    daysOfMonth: string[],
    frequency?: string,
  ) => {
    setCron({
      when_to_run: getFrequescyFromCode((frequency || 'ED') as any),
      days_of_week_to_run: daysOfWeek || [],
      days_to_run: daysOfMonth || [],
      time_to_run:
        getFrequescyFromCode((frequency || 'ED') as any) !== 'NEVER'
          ? time
          : '00:00',
    });
  };

  const onUpdateItem = async (item: any) => {
    let fields;
    if (item.category.code === 'EOTP' || item.category.code === 'BOTP') {
      await _fetchLabelMappingList(item.category.code);
      setIsOneTimePayment(true);
      _updateLabelData(item.label_mapping);
      const updateUserLabelList = Object.values(item.label_mapping);
      _updateUserLabelList(updateUserLabelList);
      const fields_to_post = Object.values(item.label_mapping).map(
        (data: any) => data.default,
      );
      fields = {
        ...item,
        fields_to_post: fields_to_post,
        recipients: item.recipients?.join(','),
        category: item.category.code,
        file_format: item?.file_format?.id,
        date_format: item.date_format.code,
      };
    } else {
      setIsOneTimePayment(false);
      fields = {
        ...item,
        ftp_configuration: item.ftp_configuration?.id,
        recipients: item.recipients?.join(','),
        category: item.category.code,
        file_format: item?.file_format?.id,
        file_split_by: item.file_split_by.code,
        date_format: item.date_format.code,
        delimiter: item.delimiter.code,
      };
    }
    form.setFieldsValue(fields);
    setCron({
      when_to_run: item.when_to_run.code || 'EVERDAY',
      days_of_week_to_run: item.days_of_week_to_run || [],
      days_to_run: item.days_to_run || [],
      time_to_run: item.time_to_run || '00:00',
    });
    setModalConfig({ isVisible: true, key: 1 });
  };

  const columns = [
    {
      dataIndex: 'category',
      title: <Trans>Outbound Type</Trans>,
      render: (val: any) => val.title,
    },
    // {
    //   dataIndex: 'ftp_configuration',
    //   title: <Trans>FTP Configuration</Trans>,
    //   render: (val: any) => val?.ip_address || val?.hostname,
    // },
    {
      dataIndex: 'file_format',
      title: <Trans>File Format</Trans>,
      render: (val: any) => val?.file_format?.title,
    },
    {
      dataIndex: 'time_to_run',
      title: <Trans>Time To Run</Trans>,
      width: 150,
      render: (_: any, record: any) => {
        if (
          record?.time_to_run === '00:00' &&
          record?.when_to_run?.code === 'NEVER'
        ) {
          return '-';
        } else {
          return record?.time_to_run;
        }
      },
    },
    {
      dataIndex: 'days_to_run',
      title: <Trans>When To Run</Trans>,
      render: (_: any, record: any) => {
        if (record?.when_to_run?.code === 'DAYMNTH')
          return record?.days_to_run?.join(' , ') || ' - ';
        else if (record?.when_to_run?.code === 'DAYWEEK')
          return record?.days_of_week_to_run?.join(' , ') || ' - ';
        else if (record?.when_to_run?.code === 'EVERDAY')
          return record?.when_to_run?.title || ' - ';
        else return '-';
      },
      width: 150,
    },
    {
      title: <Trans>Action</Trans>,
      width: 100,
      align: 'center' as 'center',
      render: (_id: any, item: any) => (
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

  const updateSchedule = async () => {
    try {
      const id = modalConfig.key;
      const values = await form.validateFields();
      if (isOneTimePayment) {
        const object = {
          ...values,
          ...cron,
          recipients: values.recipients
            ? values.recipients.split(',')
            : undefined,
          label_mapping: { ...label },
        };
        if (object.fields_to_post) {
          delete object.fields_to_post;
        }
        await _createUpdateSchedule(object, id);
        _tabKeyUpdate('1');
        setIsOneTimePayment(false);
      } else {
        const object = {
          ...values,
          ...cron,
          recipients: values.recipients
            ? values.recipients.split(',')
            : undefined,
        };
        _createUpdateSchedule(object, id);
      }
    } catch (e) {}
  };

  const openNewModal = () => {
    form.resetFields();
    setModalConfig({ isVisible: true });
  };

  const closeModal = () => {
    setModalConfig({ isVisible: false });
    _tabKeyUpdate('1');
    // setIsOneTimePayment(false);
  };

  const saveMappedLabel = (data: Ilabel) => {
    _updateLabelData(data);
  };

  const handleTabClick = (key: string, event: any) => {
    event.preventDefault();
    if (key !== activeTabKey && tabSwitchConfirmationVisibility) {
      confirm({
        title: 'Do you want to switch tab?',
        icon: <ExclamationCircleOutlined />,
        content: 'Current changes will be lost.',
        okText: 'Stay here',
        cancelText: 'Switch Tab',
        centered: true,
        getContainer: layoutRef && layoutRef.current,
        onOk() {},
        onCancel() {
          _tabKeyUpdate(key);
          _tabSwitchConfirmationVisibilityAction(false);
        },
      });
    } else {
      _tabKeyUpdate(key);
    }
  };

  const renderFileFormats = () => {
    const selectedCategory = form.getFieldValue('category');
    const items = fileFormats
      .filter(item => item.category.code === selectedCategory)
      .map(item => (
        <Select.Option value={item.id}>{item.file_format.title}</Select.Option>
      ));

    return items;
  };
  const isDisabledOption = (option: string) => {
    const item = outboundSchedule.find(
      (item: any) =>
        item.category.code === option ||
        (item.category.code === 'EXPGLAP' && option === 'EOTP') ||
        (item.category.code === 'EOTP' && option === 'EXPGLAP') ||
        (item.category.code === 'BOTP' && option === 'BENSETL') ||
        (item.category.code === 'BENSETL' && option === 'BOTP'),
    );
    return Boolean(item);
  };

  const onItemExpand = (record: any) => {
    setModalConfig({ isVisible: true, item: record });
  };
  const onValueChange = () => forceUpdate(prev => !prev);
  const rules = [{ required: true, message: 'This fields is required' }];
  if (loader)
    return (
      <ElementOrSkeleton
        type='table'
        tableConfiguration={{ columns: 6, rows: 8 }}
        isLoading={loader}
        isActive={true}
      />
    );

  return (
    <ErrorBoundary>
      <div className='outbound-container'>
        {outboundSchedule.length < 3 && (
          <FilterBar isAddButton={true} addButtonOnClickFn={openNewModal} />
        )}
        {outboundSchedule && outboundSchedule.length === 0 ? (
          <NoData />
        ) : (
          <Table
            dataSource={outboundSchedule}
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
          width='60%'
          OkText={
            modalConfig.key ? <Trans>Update</Trans> : <Trans>Create</Trans>
          }
          closable={true}
          getContainer='.outbound-container'
          onOkClick={updateSchedule}
          onCancelClick={closeModal}
          onClose={closeModal}
        >
          <Tabs
            onTabClick={handleTabClick}
            size='large'
            activeKey={activeTabKey}
            renderTabBar={(_props: any, DefaultTabBar: ComponentType) => (
              <div className='tabs-with-back-button-container'>
                <DefaultTabBar {..._props} style={{ width: '99%' }} />
              </div>
            )}
          >
            <Tabs.TabPane tab={<Trans>Configuration</Trans>} key='1'>
              <div className='outbound-scheduling-container'>
                <Form
                  form={form}
                  layout='vertical'
                  onValuesChange={onValueChange}
                >
                  <Form.Item
                    label={<Trans>Category</Trans>}
                    name='category'
                    rules={rules}
                  >
                    <Select
                      disabled={!!modalConfig.key}
                      onChange={value => {
                        if (
                          value.toString() === 'EOTP' ||
                          value.toString() === 'BOTP'
                        ) {
                          _fetchLabelMappingList(value.toString());
                          setIsOneTimePayment(true);
                        } else {
                          setIsOneTimePayment(false);
                        }
                      }}
                    >
                      {categoryRecords?.map((item: any) => (
                        <Select.Option
                          value={item.category_code}
                          key={item.category_code}
                          disabled={isDisabledOption(item.category_code)}
                        >
                          {item.category_title}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                  {isOneTimePayment ? (
                    <>
                      <Form.Item
                        label='Fields to Post'
                        name='fields_to_post'
                        rules={rules}
                      >
                        <Select
                          showSearch
                          mode='multiple'
                          value={userLabelList.map((item: any) => item.default)}
                          maxTagCount={3}
                          onChange={(values: any) => {
                            const newList = labelList.filter((item: any) =>
                              values.includes(item.default),
                            );
                            const selectedOptions = newList.filter(
                              (ele: any) =>
                                !userLabelList.some(
                                  (item: any) => item.default === ele.default,
                                ),
                            );
                            const deSelectedOptions = userLabelList.filter(
                              (ele: any) =>
                                newList.some(
                                  (item: any) => item.default === ele.default,
                                ),
                            );
                            let updatedUserLabelList: any[];
                            if (newList.length > userLabelList.length) {
                              updatedUserLabelList = [
                                ...userLabelList,
                                ...selectedOptions,
                              ];
                            } else {
                              updatedUserLabelList = [...deSelectedOptions];
                            }
                            _updateUserLabelList(updatedUserLabelList);
                            const updatedLabelData: any = {};
                            for (let item of updatedUserLabelList) {
                              updatedLabelData[item.default] = item;
                            }
                            _updateLabelData(updatedLabelData);
                          }}
                          style={{ width: '100%' }}
                          loading={loadingLabelMappingList}
                        >
                          {labelList.map((item: any, index: number) => (
                            <Select.Option
                              value={item.default}
                              key={index}
                              disabled={item?.is_mandatory}
                            >
                              {item.default}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </>
                  ) : (
                    <>
                      <Form.Item
                        label={<Trans>Data Push Directory</Trans>}
                        name='data_push_directory'
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
                    </>
                  )}
                  <Form.Item name='cron'>
                    <CronBuilder
                      cron={
                        buildCronString(
                          cron.time_to_run,
                          cron.days_of_week_to_run,
                          cron.days_to_run,
                          true,
                        ) || undefined
                      }
                      generateCron={buildAndSetCron}
                      isNever={cron?.when_to_run}
                      isNeverVisible={true}
                    />
                  </Form.Item>
                  <Form.Item
                    label={<Trans>Date Format</Trans>}
                    name='date_format'
                    rules={rules}
                  >
                    <Select>
                      {dateFormat?.map((item: any) => (
                        <Select.Option value={item} key={item}>
                          {item}
                        </Select.Option>
                      ))}
                    </Select>
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
                  <Form.Item
                    label={<Trans>File Format</Trans>}
                    name='file_format'
                    rules={rules}
                  >
                    <Select>{renderFileFormats()}</Select>
                  </Form.Item>
                  {!isOneTimePayment && (
                    <Form.Item
                      label={<Trans>Delimiter</Trans>}
                      name='delimiter'
                      rules={rules}
                    >
                      <Select>
                        {delimiter?.map((item: any) => (
                          <Select.Option value={item} key={item}>
                            {item}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  )}
                  {!isOneTimePayment && (
                    <Form.Item
                      label={<Trans>Split File By</Trans>}
                      name='file_split_by'
                    >
                      <Select>
                        {fileSplitRecords?.map((item: any) => (
                          <Select.Option value={item.code} key={item.code}>
                            {item.display_text}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  )}
                </Form>
              </div>
            </Tabs.TabPane>
            {isOneTimePayment && (
              <Tabs.TabPane tab='Label Mapping' key='2'>
                <LabelMapping
                  isLabelDataListLoaded={loadingLabelMappingList}
                  labelData={label}
                  saveMappedLabel={saveMappedLabel}
                  isSFLabel={true}
                />
              </Tabs.TabPane>
            )}
          </Tabs>
        </AppDrawer>
        <AppDrawer
          visible={modalConfig.isVisible && modalConfig.item}
          title={modalConfig.item?.category?.title}
          width='40%'
          showOkButton={false}
          closable={true}
          getContainer='.outbound-container'
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

const mapStateToProps = (state: any) => {
  const {
    activeTabKey,
    tabSwitchConfirmationVisibility,
    loadingLabelMappingList,
    label,
    labelList,
    userLabelList,
  } = state.outbound;
  return {
    activeTabKey,
    tabSwitchConfirmationVisibility,
    loadingLabelMappingList,
    label,
    labelList,
    userLabelList,
    outboundSchedule: getOutboundSchedule(state),
    ftpServers: getFtpConfigRecords(state),
    categoryRecords: getOutboundCategoryRecords(state),
    fileSplitRecords: getOutboundFileSplitRecords(state),
    dateFormat: getOutboundDateFormat(state),
    delimiter: getOutboundDelimiter(state),
    error: getOutboundError(state),
    success: getOutboundSuccess(state),
    fileFormats: getOutboundFileFormats(state),
    loader: getOutboundLoader(state),
    isDataSaving: getOutboundDataSaveLoader(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  _fetchSchedule: () => dispatch(fetchSchedules()),
  _fetchScheduleCategory: () => dispatch(fetchScheduleCategoryList()),
  _fetchScheduleFileSplit: () => dispatch(fetchScheduleFileSplitList()),
  _fetchScheduleDateFormat: () => dispatch(fetchScheduleDateFormatList()),
  _fetchScheduleDelimiter: () => dispatch(fetchScheduleDelimiterList()),
  _createUpdateSchedule: (body: any, id?: number) =>
    dispatch(createUpdateSchedule(body, id)),
  _fetchFTPServers: () => dispatch(fetchFtpConfigList()),
  _fetchFileFormats: () => dispatch(fetchFileFormats()),
  _tabKeyUpdate: (key: string) => dispatch(tabKeyUpdateAction(key)),
  _tabSwitchConfirmationVisibilityAction: (_bool: boolean) =>
    dispatch(tabSwitchConfirmationVisibilityAction(_bool)),
  _fetchLabelMappingList: (category: string) =>
    dispatch(fetchLabelMappingList(category)),
  _updateUserLabelList: (list: any[]) => dispatch(updateUserLabelList(list)),
  _updateLabelData: (data: Ilabel) => dispatch(updateLabelData(data)),
});

export const connector = connect(mapStateToProps, mapDispatchToProps);
export default connector(Scheduling);
