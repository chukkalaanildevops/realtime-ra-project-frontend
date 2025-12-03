import { ColumnsType } from 'antd/lib/table';
import React, { Dispatch, memo, useEffect, useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Button, Table, Form, Input, Switch, Select, Col, Row } from 'antd';
import { EditOutlined, FullscreenOutlined } from '@ant-design/icons';
import {
  AppDrawer,
  CronBuilder,
  ElementOrSkeleton,
  ErrorBoundary,
  FilterBar,
  HeaderBarWrapper,
  RichTextEditor,
} from '../../../../../shared/components';
import { stateInterface } from '../../../../../shared/redux/rootReducer';
import {
  resetConfirmationInfo,
  setConfirmationInfo,
} from '../../../../app/app.actions';
import { IConfirmationInfo } from '../../../../app/app.model';
import {
  fetchEmailTemplates,
  setPageLoader,
  toggleEmailTemplateActiveStatus,
  updateEmailTemplate,
  fetchTriggerTypes,
} from './emailTemplates.thunk';
import './emailTemplates.index.less';
import { buildCronString } from '../../../../../utils/global.utils';
import { Trans } from '@lingui/macro';
import { setCronData } from './emailTemplates.actions';

const mapStateToProps = (state: stateInterface) => {
  const {
    isLoading,
    emailTemplates,
    formSubmissionInProgress,
    formSubmissionSuccessful,
    formErrors,
    triggerTypes,
    cronData,
  } = state.emailTemplates;
  return {
    isLoading: isLoading,
    emailTemplates: emailTemplates,
    formSubmissionInProgress: formSubmissionInProgress,
    formSubmissionSuccessful: formSubmissionSuccessful,
    formErrors: formErrors,
    triggerTypes: triggerTypes,
    cronData: cronData,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  return {
    _setLoader: (isLoading: boolean) => dispatch(setPageLoader(isLoading)),
    _fetchEmailTemplates: () => dispatch(fetchEmailTemplates()),
    _updateEmailTemplate: (templateId: number, data: { [key: string]: any }) =>
      dispatch(updateEmailTemplate(templateId, data)),
    _setConfirmationInfo: (data: IConfirmationInfo) =>
      dispatch(setConfirmationInfo(data)),
    _resetConfirmationInfo: () => dispatch(resetConfirmationInfo()),
    _toggleEmailTemplateActiveStatus: (
      templateId: number,
      data: { [key: string]: any },
    ) => dispatch(toggleEmailTemplateActiveStatus(templateId, data)),
    _fetchTriggerTypes: () => dispatch(fetchTriggerTypes()),
    _setCronData: (key: string, value: any) =>
      dispatch(setCronData(key, value)),
  };
};

const connector = connect(mapStateToProps, mapDispatchToProps);

const EmailTemplates: React.FC<ConnectedProps<typeof connector>> = props => {
  const {
    isLoading,
    emailTemplates,
    _fetchEmailTemplates,
    _updateEmailTemplate,
    _toggleEmailTemplateActiveStatus,
    triggerTypes,
    _fetchTriggerTypes,
    _setCronData,
    cronData,
  } = props;

  const [updateTemplateForm] = Form.useForm();

  const [appDrawerDetailsProps, setAppDrawerDetailsProps] = useState<{
    visible: boolean;
    isForm: boolean;
    template: { [key: string]: any } | null;
  }>({
    visible: false,
    isForm: false,
    template: null,
  });

  const [cron, setCron] = useState<string | null>(null);
  const buildAndSetCron = (
    time: string,
    daysOfWeek: string[],
    daysOfMonth: string[],
  ) => {
    let cronString = buildCronString(time, daysOfWeek, daysOfMonth);
    setCron(cronString);
  };

  const [emailTokensVisible, setEmailTokensVisible] = useState<boolean>(false);

  const [selectedTriggerType, setSelectedTriggerType] = useState<any>('');

  const columns: ColumnsType<any> = [
    {
      title: '',
      key: 'id',
      render: (_record: any) => {
        return (
          <Switch
            checked={_record.is_active}
            onChange={(checked: boolean) => {
              // let data = { ..._record, is_active: checked };
              _toggleEmailTemplateActiveStatus(_record.id, {
                is_active: checked,
              });
            }}
          ></Switch>
        );
      },
    },
    {
      title: <Trans>Title</Trans>,
      key: 'title',
      dataIndex: 'title',
    },
    {
      title: <Trans>Subject</Trans>,
      key: 'subject',
      dataIndex: 'subject',
    },
    {
      title: <Trans>Email Trigger Type</Trans>,
      key: 'trigger_type',
      dataIndex: 'trigger_type',
      render: (_text: string, _record: any) => _record.trigger_type.title,
    },
    {
      title: <Trans>Actions</Trans>,
      key: 'action',
      dataIndex: 'action',
      align: 'center',
      render: (text: string, _record: any) => {
        return (
          <div className='buttons'>
            <Button
              type='link'
              icon={<EditOutlined />}
              onClick={event => {
                setCron(_record.cron);
                setAppDrawerDetailsProps({
                  visible: true,
                  isForm: true,
                  template: _record,
                });
                updateTemplateForm.setFieldsValue({
                  title: _record.title,
                  subject: _record.subject,
                  content: _record.content,
                  cron: _record.cron,
                  recipients:
                    _record.recipients !== null
                      ? _record.recipients.join(',')
                      : '',
                  cc: _record.cc !== null ? _record.cc.join(',') : '',
                  trigger_type: _record.trigger_type.code,
                  from_email:
                    _record.from_email !== null ? _record.from_email : '',
                });
                setSelectedTriggerType(_record.trigger_type.code);
              }}
              title='Edit'
            />
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    _fetchEmailTemplates();
    _fetchTriggerTypes();
    // eslint-disable-next-line
  }, []);

  const validateEmails = (value: string, mandatory: boolean) => {
    let emailsValid = true;
    let emailRegex = new RegExp(
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
    );

    if (mandatory === true && value === undefined) {
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
    <>
      <HeaderBarWrapper
        headerCommonProps={{ title: <Trans>Email Templates</Trans> }}
      >
        <div className='email-templates-container'>
          <FilterBar enableBackBtn={true} isAddButton={false} />
          <ElementOrSkeleton type='table' isLoading={isLoading} isActive={true}>
            <Table
              columns={columns}
              dataSource={emailTemplates}
              pagination={false}
              rowKey='id'
              expandable={{
                expandedRowRender: () => null,
                rowExpandable: () => true,
                expandIcon: ({ record }) => {
                  if (record.title === 'Employee') {
                    return (
                      <FullscreenOutlined
                        style={{
                          pointerEvents: 'none',
                          color: '#a1b2c2',
                        }}
                      />
                    );
                  } else {
                    return (
                      <FullscreenOutlined
                        onClick={() => {
                          setAppDrawerDetailsProps({
                            visible: true,
                            isForm: false,
                            template: record,
                          });
                        }}
                        title='Template Details'
                      />
                    );
                  }
                },
              }}
            ></Table>
          </ElementOrSkeleton>
        </div>
        <ErrorBoundary>
          <AppDrawer
            width='60%'
            closable={true}
            onClose={() => {
              setAppDrawerDetailsProps({
                visible: false,
                isForm: false,
                template: null,
              });
              updateTemplateForm.resetFields();
            }}
            visible={appDrawerDetailsProps.visible}
            title={
              appDrawerDetailsProps.template
                ? appDrawerDetailsProps.template.title
                : ''
            }
            showOkButton={false}
            showCancelButton={false}
            getContainer='.email-templates-container'
            className='app-drawer-email'
            destroyOnClose={true}
          >
            {(appDrawerDetailsProps.isForm &&
              appDrawerDetailsProps.template !== null && (
                <Form
                  layout='vertical'
                  labelAlign='left'
                  colon={false}
                  form={updateTemplateForm}
                  onFinish={values => {
                    if (
                      values.recipients !== null &&
                      values.recipients !== undefined
                    ) {
                      let listOfRecipients: string[] = [];
                      values.recipients.split(',').forEach((email: string) => {
                        if (email.trimLeft().trimRight().length > 0) {
                          listOfRecipients.push(email.trimLeft().trimRight());
                        }
                      });
                      values.recipients = listOfRecipients;
                    } else {
                      values.recipients = [];
                    }

                    if (values.cc !== null && values.cc !== undefined) {
                      let listOfCC: string[] = [];
                      values.cc.split(',').forEach((email: string) => {
                        if (email.trimLeft().trimRight().length > 0) {
                          listOfCC.push(email.trimLeft().trimRight());
                        }
                      });
                      values.cc = listOfCC;
                    } else {
                      values.cc = [];
                    }

                    if (cron !== null) {
                      values.cron = cron;
                    }
                    if (appDrawerDetailsProps.template !== null) {
                      _updateEmailTemplate(
                        appDrawerDetailsProps.template.id,
                        values,
                      );
                      setAppDrawerDetailsProps({
                        visible: false,
                        isForm: false,
                        template: null,
                      });
                    }
                  }}
                >
                  <Form.Item label={<Trans>Title</Trans>} name='title'>
                    <Input
                      disabled={true}
                      value={appDrawerDetailsProps.template.title}
                    ></Input>
                  </Form.Item>
                  <Form.Item
                    label={<Trans>Subject</Trans>}
                    name='subject'
                    required={true}
                  >
                    <Input
                      value={appDrawerDetailsProps.template.subject}
                    ></Input>
                  </Form.Item>
                  <Form.Item
                    label={<Trans>Content</Trans>}
                    name='content'
                    required={true}
                  >
                    <RichTextEditor
                      value={appDrawerDetailsProps.template.content}
                      placeholder='Email Content'
                    />
                  </Form.Item>
                  <div className='show-tokens-button'>
                    <Button
                      type='link'
                      onClick={event => {
                        setEmailTokensVisible(!emailTokensVisible);
                      }}
                    >
                      {emailTokensVisible ? (
                        <Trans>Hide Email Tokens</Trans>
                      ) : (
                        <Trans>Show Email Tokens</Trans>
                      )}
                    </Button>
                  </div>
                  <div
                    className={
                      emailTokensVisible
                        ? 'email-tokens'
                        : 'email-tokens hidden'
                    }
                  >
                    <Table
                      dataSource={
                        appDrawerDetailsProps.template.supported_tokens
                      }
                      bordered={true}
                      rowKey='code'
                      pagination={false}
                      columns={[
                        {
                          title: <Trans>Token</Trans>,
                          key: 'token',
                          dataIndex: 'token',
                        },
                        {
                          title: <Trans>Description</Trans>,
                          key: 'description',
                          dataIndex: 'description',
                        },
                      ]}
                    ></Table>
                  </div>
                  {appDrawerDetailsProps.template.is_trigger_type_editable && (
                    <Row gutter={[22, 8]}>
                      <Col span={15}>
                        <Form.Item
                          label={<Trans>Trigger Type</Trans>}
                          name='trigger_type'
                        >
                          <Select
                            onSelect={(value: any) => {
                              setSelectedTriggerType(value);
                            }}
                          >
                            {triggerTypes?.map((item: any) => (
                              <Select.Option value={item.code} key={item.code}>
                                {item.title}
                              </Select.Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>
                    </Row>
                  )}

                  {selectedTriggerType === 'SCHEDLD' && (
                    <>
                      <Form.Item
                        name='cron'
                        rules={[
                          () => ({
                            validator(_rule, value) {
                              if (
                                (cronData?.frequency === 'DOW' &&
                                  cronData?.daysOfWeek?.length === 0) ||
                                (cronData?.frequency === 'DOM' &&
                                  cronData?.daysOfMonth?.length === 0)
                              ) {
                                return Promise.reject('Please select a value');
                              }
                              return Promise.resolve();
                            },
                          }),
                        ]}
                        validateTrigger='onBlur'
                      >
                        <CronBuilder
                          cron={appDrawerDetailsProps.template.cron}
                          generateCron={(
                            time: string,
                            daysOfWeek: string[],
                            daysOfMonth: string[],
                            frequency?: string,
                          ) => {
                            buildAndSetCron(time, daysOfWeek, daysOfMonth);
                            _setCronData('frequency', frequency);
                            _setCronData('daysOfWeek', daysOfWeek);
                            _setCronData('daysOfMonth', daysOfMonth);
                          }}
                          isNeverVisible={false}
                        />
                      </Form.Item>
                    </>
                  )}
                  <Form.Item
                    label={<Trans>Recipients</Trans>}
                    name='recipients'
                    validateTrigger='onBlur'
                    rules={[
                      ({ getFieldValue }) => ({
                        validator(rule, value) {
                          if (validateEmails(value, true) === true) {
                            return Promise.resolve();
                          } else {
                            return Promise.reject('Emails are invalid');
                          }
                        },
                      }),
                    ]}
                  >
                    <Input placeholder='Comma-separated emails of recipients' />
                  </Form.Item>
                  <Form.Item
                    label={<Trans>CC</Trans>}
                    name='cc'
                    validateTrigger='onBlur'
                    required={false}
                    rules={[
                      ({ getFieldValue }) => ({
                        validator(rule, value) {
                          if (validateEmails(value, false) === true) {
                            return Promise.resolve();
                          } else {
                            return Promise.reject('Emails are invalid');
                          }
                        },
                      }),
                    ]}
                  >
                    <Input placeholder='Comma-separated emails of cc for email' />
                  </Form.Item>
                  <Form.Item
                    label={<Trans>Sender's Email</Trans>}
                    name='from_email'
                    validateTrigger='onBlur'
                    rules={[
                      ({ getFieldValue }) => ({
                        validator(rule, value) {
                          if (validateEmails(value, true) === true) {
                            return Promise.resolve();
                          } else {
                            return Promise.reject('Email is invalid');
                          }
                        },
                      }),
                    ]}
                  >
                    <Input placeholder='Email of sender' />
                  </Form.Item>
                  <Form.Item>
                    <div className='buttons'>
                      <Button type='primary' htmlType='submit'>
                        <Trans>Save</Trans>
                      </Button>
                    </div>
                  </Form.Item>
                </Form>
              )) ||
              (!appDrawerDetailsProps.isForm &&
                appDrawerDetailsProps.template !== null && (
                  <div className='template-details'>
                    <div className='detail-field'>
                      <div className='label'>
                        <Trans>Title</Trans>
                      </div>
                      <div className='value fix-content'>
                        {appDrawerDetailsProps.template.title}
                      </div>
                    </div>
                    <div className='detail-field'>
                      <div className='label'>
                        <Trans>Email Subject</Trans>
                      </div>
                      <div className='value fix-content'>
                        {appDrawerDetailsProps.template.subject}
                      </div>
                    </div>
                    <div className='detail-field'>
                      <div className='label'>
                        <Trans>Trigger Type</Trans>
                      </div>
                      <div className='value'>
                        {appDrawerDetailsProps.template.trigger_type.title}
                      </div>
                    </div>
                    <div className='detail-field'>
                      <div className='label'>
                        <Trans>Email Content</Trans>
                      </div>
                      <div className='value'>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: appDrawerDetailsProps.template
                              .content as string,
                          }}
                        />
                      </div>
                    </div>
                    <div className='detail-field'>
                      <div className='label'>
                        <Trans>Recipients</Trans>
                      </div>
                      <div className='value'>
                        {appDrawerDetailsProps.template.recipients !== null ? (
                          <ul>
                            {appDrawerDetailsProps.template.recipients.map(
                              (item: string, index: number) => (
                                <li key={index}>{item}</li>
                              ),
                            )}
                          </ul>
                        ) : (
                          <>
                            <Trans>Not Specified</Trans>
                          </>
                        )}
                      </div>
                    </div>
                    <div className='detail-field'>
                      <div className='label'>
                        <Trans>Email CC</Trans>
                      </div>
                      <div className='value'>
                        {appDrawerDetailsProps.template.cc !== null ? (
                          <ul>
                            {appDrawerDetailsProps.template.cc.map(
                              (item: string, index: number) => (
                                <li key={index}>{item}</li>
                              ),
                            )}
                          </ul>
                        ) : (
                          <>
                            <Trans>Not Specified</Trans>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
          </AppDrawer>
        </ErrorBoundary>
      </HeaderBarWrapper>
    </>
  );
};

export default memo(connector(EmailTemplates));
