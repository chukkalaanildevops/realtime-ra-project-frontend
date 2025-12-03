import React, { FC, memo } from 'react';
import { Row, Collapse, Col, Button, Form, Select, Input } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import {
  ErrorBoundary,
  CustomizeTabName,
} from '../../../../../shared/components';
import { GetFieldStructure } from '../';
import { Trans } from '@lingui/macro';
// import { GetLabelName } from '../../../components';
import JSONData from '../../../addNewExpense.data.json';
import { GetLabelName } from '../../../components';

const EntertainmentFields: FC<{
  configuration: any;
  expenseClaimFetchedData: any;
  isUseForFormPreview?: boolean;
}> = props => {
  const { expenseClaimFetchedData, configuration, isUseForFormPreview } = props;
  const rowGutter: [number, number] = [24, 24];
  return (
    <Row gutter={rowGutter} className='entertainment-form-section'>
      <ErrorBoundary>
        {configuration?.can_have_staff_members ? (
          <Col span={24}>
            <Collapse
              expandIconPosition='right'
              defaultActiveKey={['staffAttendeeTable']}
            >
              <Collapse.Panel
                header={
                  <CustomizeTabName
                    title={<Trans>Staff Attendee Table</Trans>}
                    count={
                      typeof expenseClaimFetchedData
                        ?.entertainment_staff_members?.length === 'number'
                        ? expenseClaimFetchedData?.entertainment_staff_members
                            ?.length
                        : 1
                    }
                    icon=' . '
                  />
                }
                key='staffAttendeeTable'
              >
                {isUseForFormPreview ? (
                  <Form.List name='entertainment_staff_members'>
                    {fields => {
                      return (
                        <>
                          {fields.map(field => {
                            return (
                              <Row
                                gutter={rowGutter}
                                className='staff-attendee-table-row'
                                key={field.fieldKey}
                              >
                                <Col span={8}>
                                  <Form.Item
                                    {...field}
                                    name={[field.name, 'member']}
                                    fieldKey={[field.fieldKey, 'member'] as any}
                                    label={
                                      <GetLabelName
                                        defaultTitle='Staff Person'
                                        configuration={configuration}
                                      />
                                    }
                                    rules={[
                                      {
                                        required: true,
                                        message:
                                          JSONData.vaidationErrors
                                            .entertainmentForm
                                            .staff_attendee_table.mandatory
                                            .member,
                                      },
                                    ]}
                                  >
                                    <Select
                                      placeholder='eg. Adam'
                                      showSearch={true}
                                      filterOption={(input: any, option: any) =>
                                        option.children
                                          .toLowerCase()
                                          .indexOf(input.toLowerCase()) >= 0
                                      }
                                      getPopupContainer={(trigger: any) =>
                                        trigger.parentNode
                                      }
                                    >
                                      {[
                                        'eg. staff1 name',
                                        'eg. staff2 name',
                                      ].map((o: any, i: number) => {
                                        return (
                                          <Select.Option key={i} value={o}>
                                            {o}
                                          </Select.Option>
                                        );
                                        // }
                                      })}
                                    </Select>
                                  </Form.Item>
                                </Col>
                                <Col span={8}>
                                  <Form.Item
                                    {...field}
                                    name={[field.name, 'emp_id']}
                                    fieldKey={[field.fieldKey, 'emp_id'] as any}
                                    label={<Trans>Employee ID</Trans>}
                                    rules={[
                                      {
                                        required: true,
                                        message:
                                          JSONData.vaidationErrors
                                            .entertainmentForm
                                            .staff_attendee_table.mandatory
                                            .emp_id,
                                      },
                                    ]}
                                  >
                                    <Input
                                      autoComplete='new-password'
                                      placeholder='eg. RA10001'
                                      disabled
                                    />
                                  </Form.Item>
                                </Col>
                                <Col span={7}>
                                  <Form.Item
                                    {...field}
                                    name={[field.name, 'designation']}
                                    fieldKey={
                                      [field.fieldKey, 'designation'] as any
                                    }
                                    label={
                                      <Trans>Staff Member Designation</Trans>
                                    }
                                    rules={[
                                      {
                                        required: false,
                                        message:
                                          JSONData.vaidationErrors
                                            .entertainmentForm
                                            .staff_attendee_table.mandatory
                                            .designation,
                                      },
                                    ]}
                                  >
                                    <Input
                                      autoComplete='new-password'
                                      placeholder='eg. Manager'
                                      disabled
                                    />
                                  </Form.Item>
                                </Col>
                                {fields.length === 1 &&
                                configuration?.are_staff_members_mandatory ? null : (
                                  <Col
                                    span={1}
                                    className='delete-btn-container'
                                  >
                                    <CloseOutlined />
                                  </Col>
                                )}
                              </Row>
                            );
                          })}
                          <Row gutter={[0, 0]}>
                            <Col span={8}>
                              <Form.Item>
                                <Button
                                  className='add-btn-container'
                                  type='link'
                                  block
                                >
                                  + <Trans>Add Another Staff</Trans>
                                </Button>
                              </Form.Item>
                            </Col>
                          </Row>
                        </>
                      );
                    }}
                  </Form.List>
                ) : (
                  expenseClaimFetchedData.entertainment_staff_members.map(
                    (o: any, i: number) => (
                      <Row
                        gutter={rowGutter}
                        className='staff-attendee-table-row'
                        key={i}
                      >
                        <Col span={12}>
                          <GetFieldStructure
                            lable={
                              <GetLabelName
                                defaultTitle='Staff Person'
                                configuration={configuration}
                              />
                            }
                          >
                            {o?.legal_name || o?.member_name}
                          </GetFieldStructure>
                        </Col>
                        <Col span={12}>
                          <GetFieldStructure
                            lable={
                              <GetLabelName
                                defaultTitle='Staff Employee ID'
                                configuration={configuration}
                              />
                            }
                          >
                            {o?.emp_id}
                          </GetFieldStructure>
                        </Col>
                      </Row>
                    ),
                  )
                )}
              </Collapse.Panel>
            </Collapse>
          </Col>
        ) : null}
        {configuration?.can_have_guest_members ? (
          <Col span={24}>
            <Collapse
              expandIconPosition='right'
              defaultActiveKey={['GuestAttendeeTable']}
            >
              <Collapse.Panel
                header={
                  <CustomizeTabName
                    title={<Trans>Guest Attendee Table</Trans>}
                    icon=' . '
                    count={
                      typeof expenseClaimFetchedData
                        ?.entertainment_guest_members?.length === 'number'
                        ? expenseClaimFetchedData?.entertainment_guest_members
                            ?.length
                        : 1
                    }
                  />
                }
                key='GuestAttendeeTable'
              >
                {isUseForFormPreview ? (
                  <Form.List name='entertainment_guest_members'>
                    {fields => {
                      return (
                        <>
                          {fields.map(field => {
                            return (
                              <Row
                                gutter={rowGutter}
                                className='guest-attendee-table-row'
                                key={field.fieldKey}
                              >
                                <Col span={8}>
                                  <Form.Item
                                    {...field}
                                    name={[field.name, 'member']}
                                    fieldKey={[field.fieldKey, 'member'] as any}
                                    label={
                                      <GetLabelName
                                        defaultTitle='Guest Person'
                                        configuration={configuration}
                                      />
                                    }
                                    trigger='onBlur'
                                    rules={[
                                      {
                                        required: true,
                                        message:
                                          JSONData.vaidationErrors
                                            .entertainmentForm
                                            .guest_attendee_table.mandatory
                                            .member,
                                      },
                                    ]}
                                  >
                                    <Input
                                      autoComplete='new-password'
                                      placeholder='eg. Paul'
                                    />
                                  </Form.Item>
                                </Col>
                                <Col span={8}>
                                  <Form.Item
                                    {...field}
                                    name={[field.name, 'organisation']}
                                    fieldKey={
                                      [field.fieldKey, 'organisation'] as any
                                    }
                                    label={
                                      <GetLabelName
                                        defaultTitle='Guest Member Organisation'
                                        configuration={configuration}
                                      />
                                    }
                                    rules={[
                                      {
                                        required: true,
                                        message:
                                          JSONData.vaidationErrors
                                            .entertainmentForm
                                            .guest_attendee_table.mandatory
                                            .organisation,
                                      },
                                    ]}
                                  >
                                    <Input
                                      autoComplete='new-password'
                                      placeholder='eg. Rollig Arrays'
                                    />
                                  </Form.Item>
                                </Col>
                                <Col span={7}>
                                  <Form.Item
                                    {...field}
                                    name={[field.name, 'designation']}
                                    fieldKey={
                                      [field.fieldKey, 'designation'] as any
                                    }
                                    label={
                                      <Trans>Guest Member Designation</Trans>
                                    }
                                    rules={[
                                      {
                                        required: false,
                                        message:
                                          JSONData.vaidationErrors
                                            .entertainmentForm
                                            .guest_attendee_table.mandatory
                                            .designation,
                                      },
                                    ]}
                                  >
                                    <Input
                                      autoComplete='new-password'
                                      placeholder='eg. Manager'
                                    />
                                  </Form.Item>
                                </Col>
                                {fields.length === 1 &&
                                configuration?.are_guest_members_mandatory ? null : (
                                  <Col
                                    span={1}
                                    className='delete-btn-container'
                                  >
                                    <CloseOutlined />
                                  </Col>
                                )}
                              </Row>
                            );
                          })}
                          <Row gutter={[0, 0]}>
                            <Col span={8}>
                              <Form.Item>
                                <Button
                                  className='add-btn-container'
                                  type='link'
                                  block
                                >
                                  + <Trans>Add Another Guest</Trans>
                                </Button>
                              </Form.Item>
                            </Col>
                          </Row>
                        </>
                      );
                    }}
                  </Form.List>
                ) : (
                  expenseClaimFetchedData.entertainment_guest_members.map(
                    (o: any, i: number) => (
                      <Row
                        gutter={rowGutter}
                        className='staff-attendee-table-row'
                        key={i}
                      >
                        <Col span={12}>
                          <GetFieldStructure
                            lable={
                              <GetLabelName
                                defaultTitle='Guest Person'
                                configuration={configuration}
                              />
                            }
                          >
                            {o?.member}
                          </GetFieldStructure>
                        </Col>
                        <Col span={12}>
                          <GetFieldStructure
                            lable={
                              <GetLabelName
                                defaultTitle='Guest Member Organisation'
                                configuration={configuration}
                              />
                            }
                          >
                            {o?.organisation}
                          </GetFieldStructure>
                        </Col>
                      </Row>
                    ),
                  )
                )}
              </Collapse.Panel>
            </Collapse>
          </Col>
        ) : null}
      </ErrorBoundary>
    </Row>
  );
};

export default memo(EntertainmentFields);
