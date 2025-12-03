import React, { FC, memo, useEffect, useCallback, Dispatch } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { stateInterface } from '../../../../shared/redux/rootReducer';
import { Row, Col, Input, Form, Collapse, Button, Select } from 'antd';
import { FormInstance } from 'antd/lib/form';
import { CloseOutlined } from '@ant-design/icons';
import {
  CustomizeTabName,
  ErrorBoundary,
  Loader,
} from '../../../../shared/components';
import JSONData from '../../addNewExpense.data.json';
import { fetchStaffMembersJobInfoList } from '../../addNewExpense.thunk';
import { updateFormData } from '../../addNewExpense.actions';
import {
  IstaffMembersJobInfo,
  IstaffAttendeeTable,
  IGuestAttendeeTable,
} from '../../addNewExpense.model';
import { Trans } from '@lingui/macro';
import { stringTemplating } from '../../../../utils/global.utils';
import { delay } from 'lodash';

const mapStateToProps = (state: stateInterface) => {
  const {
    isAdminEdit,
    backendError,
    mode,
    staffMembersJobInfoListLoader,
    formData,
    viewOnly,
    configuration,
    staffMembersJobInfoList,
  } = state.AddNewExpenseForm;
  return {
    isAdminEdit,
    backendError,
    mode,
    staffMembersJobInfoListLoader,
    formData,
    viewOnly,
    configuration,
    staffMembersJobInfoList,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  return {
    _fetchStaffMembersJobInfoList: () =>
      dispatch(fetchStaffMembersJobInfoList()),
    _updateFormData: (
      key: string | string[],
      type: 'general_form' | 'entertainment_form' | 'form_data',
      data: any,
    ) => dispatch(updateFormData(key, type, data)),
  };
};

const connector = connect(mapStateToProps, mapDispatchToProps);

const EntertainmentForm: FC<ConnectedProps<typeof connector> & {
  getLabelName: Function;
  form: FormInstance;
  dateFieldChangeHandler: any;
  calculateAmoutUsingConversionRate: (
    _calledFrom: string,
    conversionRate: string,
    _amount?: number,
    _allowDaviation?: boolean,
    _taxAmount?: number,
  ) => void;
}> = props => {
  const {
    // isAdminEdit,
    mode,
    staffMembersJobInfoListLoader,
    formData,
    viewOnly,
    configuration,
    staffMembersJobInfoList,
    _fetchStaffMembersJobInfoList,
    _updateFormData,
    getLabelName,
    calculateAmoutUsingConversionRate,
  } = props;
  const rowGutter: [number, number] = [16, 16];

  const _componentDidMount_EffectFn = useCallback(() => {
    _fetchStaffMembersJobInfoList();
  }, [_fetchStaffMembersJobInfoList]);

  useEffect(_componentDidMount_EffectFn, []);

  const handleDeleteClickFieldList = (
    key: 'entertainment_staff_members' | 'entertainment_guest_members',
    field: any,
  ) => {
    try {
      const newVal = formData.entertainment_form[key];
      if (
        mode === 'UPDATE' &&
        key === 'entertainment_staff_members' &&
        (newVal[field.fieldKey] as IstaffAttendeeTable).emp_id !== null
      ) {
        newVal[field.fieldKey].is_deleted = true;
      } else if (
        mode === 'UPDATE' &&
        key === 'entertainment_guest_members' &&
        (newVal[field.fieldKey] as IGuestAttendeeTable).member !== '' &&
        (newVal[field.fieldKey] as IGuestAttendeeTable).organisation !== ''
      ) {
        newVal[field.fieldKey].is_deleted = true;
      } else {
        newVal.splice(field.fieldKey, 1);
      }

      _updateFormData(key, 'entertainment_form', newVal);
      delay(
        calculateAmoutUsingConversionRate,
        300,
        'staffOrGuestDelete',
        String(formData.general_form.conversion_rate || 1),
      );
      // remove(field.name);
    } catch (error) {
      console.error(error);
    }
  };

  const handleGuestFieldChange = (
    fieldKey: number,
    fieldName: 'member' | 'organisation' | 'designation',
    e: any,
  ) => {
    try {
      const val = formData.entertainment_form.entertainment_guest_members;
      val[fieldKey][fieldName] = e?.target?.value || e?.currentTarget?.value;
      _updateFormData('entertainment_guest_members', 'entertainment_form', val);
      delay(
        calculateAmoutUsingConversionRate,
        300,
        'guest',
        String(formData.general_form.conversion_rate || 1),
        formData.general_form.amount === null ? 0 : undefined,
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleStaffFieldsChange = (fieldKey: number, value: any) => {
    try {
      const val = formData.entertainment_form.entertainment_staff_members;
      // const isUnique: Boolean = val.some(
      //   (o: IstaffAttendeeTable) => o.member === value,
      // );
      // if (!isUnique) {
      const getMemberJobInfo: IstaffMembersJobInfo[] = staffMembersJobInfoList.filter(
        o => o.employee_id === value,
      );

      if (!val[fieldKey]) val.push([] as any);

      // val[fieldKey].designation = getMemberJobInfo[0]?.position || '';
      val[fieldKey].emp_id = getMemberJobInfo[0]?.emp_id || null;
      val[fieldKey].member = getMemberJobInfo[0]?.employee_id || null;
      // val[fieldKey].designation = getMemberJobInfo[0]?.position || '';
      // val[fieldKey].emp_id = getMemberJobInfo[0]?.emp_id || null;
      // val[fieldKey].member = getMemberJobInfo[0]?.name || '';

      _updateFormData('entertainment_staff_members', 'entertainment_form', val);
      delay(
        calculateAmoutUsingConversionRate,
        300,
        'staff',
        String(formData.general_form.conversion_rate || 1),
        formData.general_form.amount === null ? 0 : undefined,
      );
      // }
    } catch (error) {
      console.error(error);
    }
  };

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
                      formData.entertainment_form.entertainment_staff_members.filter(
                        o => !o.is_deleted,
                      ).length
                    }
                    icon=' . '
                  />
                }
                key='staffAttendeeTable'
              >
                {staffMembersJobInfoListLoader ? (
                  <Loader loadingName='Loading Staff Data' />
                ) : (
                  <Form.List name='entertainment_staff_members'>
                    {fields => {
                      let staffListLength =
                        mode === 'UPDATE'
                          ? formData.entertainment_form.entertainment_staff_members?.filter(
                              value => value?.is_deleted === false,
                            ).length
                          : fields.length;
                      return (
                        <>
                          {fields.map(field => {
                            return !formData.entertainment_form
                              .entertainment_staff_members[field.fieldKey]
                              ?.is_deleted ? (
                              <Row
                                gutter={rowGutter}
                                className='staff-attendee-table-row'
                                key={field.fieldKey}
                              >
                                <Col span={11}>
                                  <Form.Item
                                    {...field}
                                    name={[field.name, 'member']}
                                    fieldKey={[field.fieldKey, 'member'] as any}
                                    // label='Person'
                                    label={getLabelName(
                                      'Staff Person',
                                      'string',
                                    )}
                                    rules={[
                                      {
                                        required: true,
                                        message: stringTemplating(
                                          {
                                            label: getLabelName(
                                              'Staff Person',
                                              'string',
                                            ),
                                          },
                                          JSONData.vaidationErrors
                                            .entertainmentForm
                                            .staff_attendee_table.mandatory
                                            .member,
                                        ),
                                      },
                                      ({ getFieldValue }) => ({
                                        validator(_rule, value) {
                                          if (value !== null) {
                                            const isUnique: Boolean = getFieldValue(
                                              'entertainment_staff_members',
                                            ).some(
                                              (o: IstaffAttendeeTable) =>
                                                o.emp_id === value,
                                            );

                                            if (!isUnique) {
                                              return Promise.resolve();
                                            }
                                            return Promise.reject(
                                              'Person is alredy selected',
                                            );
                                          } else return Promise.resolve();
                                        },
                                      }),
                                    ]}
                                  >
                                    <Select
                                      placeholder='eg. Adam'
                                      loading={staffMembersJobInfoListLoader}
                                      onChange={value =>
                                        handleStaffFieldsChange(
                                          field.fieldKey,
                                          value,
                                        )
                                      }
                                      disabled={viewOnly}
                                      showSearch={true}
                                      filterOption={(input: any, option: any) =>
                                        (option.children || '')
                                          .toLowerCase()
                                          .indexOf(input.toLowerCase()) >= 0
                                      }
                                      getPopupContainer={(): HTMLElement =>
                                        document.getElementById(
                                          'addNewExpenseForm',
                                        ) || document.body
                                      }
                                    >
                                      {(staffMembersJobInfoList || []).map(
                                        o => {
                                          // if (
                                          //   Boolean(
                                          //     formData.entertainment_form.entertainment_staff_members.filter(
                                          //       p => p.member === o.employee_id,
                                          //     ).length,
                                          //   )
                                          // ) {
                                          //   return null;
                                          // } else {
                                          return (
                                            <Select.Option
                                              key={o.employee_id}
                                              value={o.employee_id as number}
                                              disabled={Boolean(
                                                formData.entertainment_form.entertainment_staff_members.filter(
                                                  p =>
                                                    p.member ===
                                                      o.employee_id &&
                                                    !p.is_deleted,
                                                ).length,
                                              )}
                                            >
                                              {o?.legal_name ||
                                                o?.employee__name}
                                            </Select.Option>
                                          );
                                          // }
                                        },
                                      )}
                                    </Select>
                                  </Form.Item>
                                </Col>
                                <Col span={11}>
                                  <Form.Item
                                    {...field}
                                    name={[field.name, 'emp_id']}
                                    fieldKey={[field.fieldKey, 'emp_id'] as any}
                                    // label='Employee ID'
                                    label={getLabelName(
                                      'Staff Employee ID',
                                      'string',
                                    )}
                                    rules={[
                                      {
                                        required: true,
                                        message: stringTemplating(
                                          {
                                            label: getLabelName(
                                              'Staff Employee ID',
                                              'string',
                                            ),
                                          },
                                          JSONData.vaidationErrors
                                            .entertainmentForm
                                            .staff_attendee_table.mandatory
                                            .emp_id,
                                        ),
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
                                {(staffListLength === 1 &&
                                  configuration?.are_staff_members_mandatory) ||
                                viewOnly ? null : (
                                  <Col
                                    span={2}
                                    className='delete-btn-container'
                                  >
                                    <CloseOutlined
                                      onClick={handleDeleteClickFieldList.bind(
                                        null,
                                        'entertainment_staff_members',
                                        field,
                                      )}
                                    />
                                  </Col>
                                )}
                              </Row>
                            ) : null;
                          })}
                          <Row gutter={[0, 0]}>
                            <Col span={8}>
                              <Form.Item>
                                <Button
                                  disabled={viewOnly}
                                  className='add-btn-container'
                                  type='link'
                                  onClick={() => {
                                    // add();
                                    const newRow = [
                                      ...formData.entertainment_form
                                        .entertainment_staff_members,
                                    ];
                                    if (mode === 'UPDATE') {
                                      newRow.push({
                                        emp_id: null,
                                        member: null,
                                        is_deleted: false,
                                      });
                                    } else {
                                      newRow.push({
                                        emp_id: null,
                                        member: null,
                                      });
                                    }
                                    _updateFormData(
                                      'entertainment_staff_members',
                                      'entertainment_form',
                                      newRow,
                                    );
                                  }}
                                  block
                                >
                                  +{' '}
                                  {Boolean(
                                    formData.entertainment_form
                                      .entertainment_staff_members.length,
                                  ) ? (
                                    <Trans>Add Another Staff</Trans>
                                  ) : (
                                    <Trans>Add New Staff</Trans>
                                  )}
                                </Button>
                              </Form.Item>
                            </Col>
                          </Row>
                        </>
                      );
                    }}
                  </Form.List>
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
                      formData.entertainment_form.entertainment_guest_members.filter(
                        o => !o.is_deleted,
                      ).length
                    }
                  />
                }
                key='GuestAttendeeTable'
              >
                <Form.List name='entertainment_guest_members'>
                  {fields => {
                    let guestListLength =
                      mode === 'UPDATE'
                        ? formData.entertainment_form.entertainment_guest_members?.filter(
                            value => value?.is_deleted === false,
                          ).length
                        : fields.length;
                    return (
                      <>
                        {fields.map(field => {
                          return !formData.entertainment_form
                            .entertainment_guest_members[field.fieldKey]
                            ?.is_deleted ? (
                            <Row
                              gutter={rowGutter}
                              className='guest-attendee-table-row'
                              key={field.fieldKey}
                            >
                              <Col span={11}>
                                <Form.Item
                                  {...field}
                                  name={[field.name, 'member']}
                                  fieldKey={[field.fieldKey, 'member'] as any}
                                  // label='Person'
                                  // label={getLabelName(
                                  //   <Trans>Guest Person</Trans>,
                                  // )}
                                  label={getLabelName('Guest Person', 'string')}
                                  trigger='onChange'
                                  required
                                  rules={[
                                    () => ({
                                      validator(_, value) {
                                        if (value !== undefined) {
                                          value = value?.trim();
                                        }

                                        if (!value || value === undefined) {
                                          return Promise.reject(
                                            stringTemplating(
                                              {
                                                label: getLabelName(
                                                  'Guest Person',
                                                  'string',
                                                ),
                                              },
                                              JSONData.vaidationErrors
                                                .entertainmentForm
                                                .guest_attendee_table.mandatory
                                                .member,
                                            ),
                                          );
                                        } else {
                                          if (
                                            new RegExp(
                                              /^[^@!=\-+#﹘—⸺⸻].*$/,
                                            ).test(value)
                                          ) {
                                            return Promise.resolve();
                                          }
                                          return Promise.reject(
                                            new Error(
                                              'Can not start with special character',
                                            ),
                                          );
                                        }
                                      },
                                    }),
                                  ]}
                                >
                                  <Input
                                    disabled={viewOnly}
                                    onChange={handleGuestFieldChange.bind(
                                      null,
                                      field.fieldKey,
                                      'member',
                                    )}
                                    placeholder='eg. Paul'
                                  />
                                </Form.Item>
                              </Col>
                              <Col span={11}>
                                <Form.Item
                                  {...field}
                                  name={[field.name, 'organisation']}
                                  fieldKey={
                                    [field.fieldKey, 'organisation'] as any
                                  }
                                  label={getLabelName(
                                    'Guest Member Organisation',
                                    'string',
                                  )}
                                  // label={getLabelName(
                                  //   <Trans>Guest Member Organisation</Trans>,
                                  // )}
                                  required
                                  rules={[
                                    () => ({
                                      validator(_, value) {
                                        if (value !== undefined) {
                                          value = value?.trim();
                                        }

                                        if (!value || value === undefined) {
                                          return Promise.reject(
                                            stringTemplating(
                                              {
                                                label: getLabelName(
                                                  'Guest Member Organisation',
                                                  'string',
                                                ),
                                              },
                                              JSONData.vaidationErrors
                                                .entertainmentForm
                                                .guest_attendee_table.mandatory
                                                .organisation,
                                            ),
                                          );
                                        } else {
                                          if (
                                            new RegExp(
                                              /^[^@!=\-+#﹘—⸺⸻].*$/,
                                            ).test(value)
                                          ) {
                                            return Promise.resolve();
                                          }
                                          return Promise.reject(
                                            new Error(
                                              'Can not start with special character',
                                            ),
                                          );
                                        }
                                      },
                                    }),
                                  ]}
                                >
                                  <Input
                                    disabled={viewOnly}
                                    placeholder='eg. Rolling Arrays'
                                    onChange={handleGuestFieldChange.bind(
                                      null,
                                      field.fieldKey,
                                      'organisation',
                                    )}
                                  />
                                </Form.Item>
                              </Col>
                              {(guestListLength === 1 &&
                                configuration?.are_guest_members_mandatory) ||
                              viewOnly ? null : (
                                <Col span={2} className='delete-btn-container'>
                                  <CloseOutlined
                                    onClick={handleDeleteClickFieldList.bind(
                                      null,
                                      'entertainment_guest_members',
                                      field,
                                    )}
                                    // onClick={() => {
                                    //   // remove(field.name);
                                    // }}
                                  />
                                </Col>
                              )}
                            </Row>
                          ) : null;
                        })}
                        <Row gutter={[0, 0]}>
                          <Col span={8}>
                            <Form.Item>
                              <Button
                                disabled={viewOnly}
                                className='add-btn-container'
                                type='link'
                                onClick={() => {
                                  // add();
                                  const newRow = [
                                    ...formData.entertainment_form
                                      .entertainment_guest_members,
                                  ];
                                  if (mode === 'UPDATE') {
                                    newRow.push({
                                      member: '',
                                      organisation: '',
                                      designation: '',
                                      is_deleted: false,
                                    });
                                  } else {
                                    newRow.push({
                                      member: '',
                                      organisation: '',
                                      designation: '',
                                    });
                                  }
                                  _updateFormData(
                                    'entertainment_guest_members',
                                    'entertainment_form',
                                    newRow,
                                  );
                                }}
                                block
                              >
                                +{' '}
                                {Boolean(
                                  formData.entertainment_form
                                    .entertainment_guest_members.length,
                                ) ? (
                                  <Trans>Add Another Guest</Trans>
                                ) : (
                                  <Trans>Add New Guest</Trans>
                                )}
                              </Button>
                            </Form.Item>
                          </Col>
                        </Row>
                      </>
                    );
                  }}
                </Form.List>
              </Collapse.Panel>
            </Collapse>
          </Col>
        ) : null}
      </ErrorBoundary>
    </Row>
  );
};

export default connector(memo(EntertainmentForm));
