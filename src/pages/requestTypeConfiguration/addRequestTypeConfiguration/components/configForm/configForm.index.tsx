/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  memo,
  useState,
  useEffect,
  Dispatch,
  useImperativeHandle,
} from 'react';

import {
  Form,
  Select,
  Input,
  Checkbox,
  Button,
  InputNumber,
  Col,
  Row,
  Radio,
  message,
  Skeleton,
} from 'antd';
import {
  getEntities,
  getWageTypes,
  getCostCentre,
  getRequestTypeErrorMessage,
  getRequestTypeSuccessMessage,
  getExpenseTypes,
  getRequestTypeLoader,
  getRequestTypeExpandedItem,
} from '../../../../../shared/redux/rootReducer';
import { connect, ConnectedProps } from 'react-redux';
import { RichTextEditor } from '../../../../../shared/components/';
import './configForm.index.less';
import {
  fetchEntities,
  fetchWageTypes,
  createRequestType,
  fetchExpenseTypes,
} from '../../../requestTypeConfiguration.thunk';
import Errors from '../../../requestTypeConfiguration.data.json';

import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { Trans } from '@lingui/macro';
import { fetchCostCentres } from '../../../../../shared/redux/costCentre/costCentre.thunk';

const ConfigForm: React.FC<ConnectedProps<typeof connector> & {
  onValueChange: (data: any) => any;
  onSave: (formBody: any) => void;
  isClone: boolean;
  legal_entity?: string;
  ref?: any;
}> = React.forwardRef((props, ref: any) => {
  const {
    entityList,
    _fetchEntities,
    onValueChange,
    _fetchWageTypes,
    wageTypeList,
    _fetchCostCentre,
    error,
    expenseTypes,
    _fetchExpenseTypes,
    isLoading,
    requestDetails,
    isClone,
    legal_entity,
  } = props;

  const [form] = Form.useForm();

  const [filteredExpenses, setFilteredExpenses] = useState(expenseTypes);

  // const [instruction, setInstruction] = useState('');

  const onFieldChange = (_changedField: any, _1: any) => {
    // if (changedField.legal_entity) {
    //   fetchExpensesOfLegalEntity();
    // }
    const values = form.getFieldsValue();
    onValueChange({ ...values });
  };

  const onLegalEntitySelect = (values: any) => {
    const selectAll = values.includes('select-all');
    const deselectAll = values.includes('deselect-all');
    // let list=[]
    if (selectAll) {
      const list = entityList.map(item => item.uuid);
      form.setFieldsValue({ legal_entity: list });
    } else if (deselectAll) {
      form.setFieldsValue({ legal_entity: [] });
    }
    fetchExpensesOfLegalEntity();
  };

  // const onChangeInstruction = (value: string) => {
  //   const values = form.getFieldsValue();
  //   setInstruction(value);
  //   onValueChange({ ...values, instruction_text: value });
  // };

  useEffect(() => {
    if (
      entityList &&
      entityList.length > 0 &&
      requestDetails &&
      Object.keys(requestDetails).length > 0
    ) {
      if (!isClone) {
        if (requestDetails.legal_entity instanceof Array) {
          const entities = requestDetails.legal_entity.map(
            (item: any) => item.uuid,
          );
          form.setFieldsValue({ legal_entity: entities });
        } else {
          const entity = (requestDetails.legal_entity as any).uuid;
          form.setFieldsValue({ legal_entity: [entity] });
        }
      }

      if (legal_entity) {
        form.setFieldsValue({ legal_entity: [legal_entity] });
      }
      fetchExpensesOfLegalEntity();
    }
  }, [entityList, requestDetails, legal_entity]);

  useEffect(() => {
    if (expenseTypes && expenseTypes.length > 0) {
      const selected = form.getFieldValue(
        'allow_claims_against_request_options',
      );

      if (selected) {
        const dataIds = expenseTypes.map((item: any) => item.id);
        const options = selected.filter(
          (val: any) => val && dataIds.includes(val.expense_type),
        );
        form.setFieldsValue({ allow_claims_against_request_options: options });
      }
      setFilteredExpenses(expenseTypes);
    }
  }, [expenseTypes]);

  useEffect(() => {
    if (requestDetails && Object.keys(requestDetails).length > 0) {
      const values: any = {
        ...requestDetails,
        // legal_entity: (requestDetails.legal_entity as any)?.id,
        // wage_type: (requestDetails.wage_type as any).id,
        // estimation_type: (requestDetails.estimation_type as any).code,
        allow_claims_against_request_options: [],
      };

      delete values.legal_entity;

      // values.cost_centres = requestDetails.cost_centres?.map(
      //   (cc: any) => cc.id,
      // );
      values.allow_claims_against_request_options = requestDetails.allow_claims_against_request_options?.map(
        (item: any) => ({
          id: isClone || legal_entity ? undefined : item.id,
          expense_type: item.expense_type.id,
          exclude_from_cash_advance: item.exclude_from_cash_advance,
          is_allow_multiple_claims: item.is_allow_multiple_claims,
          can_expense_receipt_date_be_outside_request_date:
            item.can_expense_receipt_date_be_outside_request_date,
          is_deleted: item.is_deleted,
          is_enable_request_expiry_period: item.is_enable_request_expiry_period,
        }),
      );
      if (isClone) {
        delete values.title;
        delete values.code;
        values.custom_fields.fields.map((Item: any) => {
          delete Item.is_deleted;
          return Item;
        });
      }
      // _fetchExpenseTypes();

      values.cost_centres = requestDetails.cost_centres?.map(
        (item: any) => item.id,
      );
      values.wage_type = (requestDetails.wage_type as any)?.id;
      values.estimation_type = (requestDetails.estimation_type as any)?.code;
      // setInstruction(
      //   requestDetails.instruction_text ? requestDetails.instruction_text : '',
      // );

      form.setFieldsValue(values);

      fetchExpensesOfLegalEntity();
      onFieldChange('', '');
      onValueChange(values);
    }
  }, [requestDetails]);

  useEffect(() => {
    if (error) {
      if (error instanceof Object) {
        const errors = Object.keys(error).map(item => ({
          name: item,
          errors: error[item],
        }));
        form.setFields(errors);
      } else if (typeof error === 'string') {
        message.error(error || 'Something went wrong');
      }
    }
  }, [error]);

  useEffect(() => {
    _fetchEntities();
    _fetchWageTypes();
    _fetchCostCentre();
  }, []);

  useImperativeHandle(ref, () => ({
    onSubmitHandler: async () => {
      try {
        const values = await form.validateFields();
        if (
          requestDetails &&
          Object.keys(requestDetails).length > 0 &&
          !isClone &&
          !legal_entity
        ) {
          if (
            requestDetails.allow_claims_against_request_options?.length !== 0
          ) {
            const newOptions = values.allow_claims_against_request_options?.map(
              (item: any) => item.id,
            );
            const options = requestDetails.allow_claims_against_request_options
              ?.map((item: any) => {
                if (!newOptions?.includes(item.id)) {
                  const oldItem = requestDetails.allow_claims_against_request_options?.find(
                    i => i.id === item.id,
                  );
                  return {
                    ...oldItem,
                    expense_type: oldItem.expense_type.id,
                    is_deleted: true,
                  };
                }
              })
              .filter(item => item);
            const request_options = [...(options as any)];
            if (values.allow_claims_against_request_options) {
              request_options.push(
                ...values.allow_claims_against_request_options,
              );
            }
            values.allow_claims_against_request_options = request_options;
          }
        }
        if (!values.is_allow_adding_staff_members_to_requests) {
          values.are_staff_members_mandatory = false;
        }
        if (!values.is_allow_adding_guest_members_to_requests) {
          values.are_guest_members_mandatory = false;
        }
        if (!values.is_travel_type) {
          values.is_include_hotel_accommodation = false;
          values.is_hotel_accommodation_filled_by_admin = false;
          values.is_include_flight_booking = false;
          values.is_flight_booking_filled_by_admin = false;
          values.is_include_travel_insurance = false;
          values.is_travel_insurance_filled_by_admin = false;
        }
        return { ...values };
      } catch (e) {}
    },
    onClearBtnHandler: () => {
      onClearBtnHandler();
    },
  }));

  const onClearBtnHandler = () => {
    const legal_entity = form.getFieldValue('legal_entity');

    form.resetFields();
    if (requestDetails && Object.keys(requestDetails).length > 0) {
      form.setFieldsValue({ legal_entity });
    }
    // setInstruction('');
    onFieldChange('', '');
  };
  // const onSubmitHandler = async () => {
  //   try {
  //     const values = await form.validateFields();
  //     onSave(values);
  //   } catch (e) {
  //   }
  // };

  const renderExpenseTypes = (id: number) => {
    const selected = form.getFieldValue('allow_claims_against_request_options');
    const selectedExpense = selected[id]?.expense_type
      ? selected[id].expense_type
      : '';
    const dataIds = selected.map((item: any) =>
      item ? item.expense_type : '',
    );
    const options = filteredExpenses.filter(val => !dataIds.includes(val.id));
    const currentOption = filteredExpenses.find(
      item => item.id === selectedExpense,
    );
    currentOption && options.push(currentOption);
    return getOptions(options);
  };

  const style = { width: '100%' };

  const getOptions = (list: any[], key = 'id') =>
    list.map((item: any) => (
      <Select.Option value={item[key]} key={item[key]}>
        {item.title}
      </Select.Option>
    ));

  const fetchExpensesOfLegalEntity = () => {
    const legal_entity = form.getFieldValue('legal_entity');
    if (legal_entity && (legal_entity as Array<string>)?.length !== 0) {
      const obj = {
        legal_entity_uuids: legal_entity,
      };
      _fetchExpenseTypes(obj);
    }
  };

  const onAllowClaimsAgainstRequest = (val: boolean) => {
    if (val) {
      // filteredExpenses.length === 0 && _fetchExpenseTypes();

      // _fetchExpenseTypes()
      fetchExpensesOfLegalEntity();
    } else {
      form.setFieldsValue({ allow_claims_against_request_options: [] });
    }
  };

  const resetTravelFields = (e: CheckboxChangeEvent) => {
    if (!e.target.checked) {
      form.setFieldsValue({
        is_include_hotel_accommodation: false,
        is_hotel_accommodation_filled_by_admin: false,
        is_include_flight_booking: false,
        is_flight_booking_filled_by_admin: false,
        is_include_travel_insurance: false,
        is_travel_insurance_filled_by_admin: false,
        is_travel_type: false,
      });
    }
  };

  const resetHotelFields = (checked: boolean) => {
    if (!checked) {
      form.setFieldsValue({
        is_include_hotel_accommodation: false,
        is_hotel_accommodation_filled_by_admin: false,
      });
    }
  };

  const resetFlightFields = (checked: boolean) => {
    if (!checked) {
      form.setFieldsValue({
        is_include_flight_booking: false,
        is_flight_booking_filled_by_admin: false,
      });
    }
  };

  const resetTravelInsuranceFields = (checked: boolean) => {
    if (!checked) {
      form.setFieldsValue({
        is_include_travel_insurance: false,
        is_travel_insurance_filled_by_admin: false,
      });
    }
  };

  const resetRemarkFields = (checked: boolean) => {
    if (!checked) {
      form.setFieldsValue({
        is_allow_remark: false,
        is_remark_mandatory: false,
      });
    }
  };

  const resetBackdatedFields = (checked: boolean) => {
    if (!checked) {
      form.setFieldsValue({
        is_allow_backdated_requests: false,
        backdated_request_period_in_days: undefined,
      });
    }
  };

  const resetEstimationFields = (checked: boolean) => {
    if (!checked) {
      form.setFieldsValue({
        is_estimation_mandatory: false,
        estimation_type: undefined,
        is_allow_expense_claim_estimation: false,
      });
    }
  };

  const resetStaffMemberFields = (checked: boolean) => {
    if (!checked) {
      form.setFieldsValue({
        is_allow_adding_staff_members_to_requests: false,
        are_staff_members_mandatory: false,
      });
    }
  };

  const resetGuestMemberFields = (checked: boolean) => {
    if (!checked) {
      form.setFieldsValue({
        is_allow_adding_guest_members_to_requests: false,
        are_guest_members_mandatory: false,
      });
    }
  };

  const resetAutoSettleFields = (checked: boolean) => {
    if (!checked) {
      form.setFieldsValue({
        is_auto_settle_request_after_a_period: false,
        number_of_days_from_request_end_date: undefined,
      });
    }
  };

  const isDisabled =
    requestDetails && Object.keys(requestDetails).length > 0 && !isClone;

  const canConfigChange =
    isDisabled && (requestDetails.request_claimed_count || 0) > 0;

  return (
    <div className='request-configuration-form' ref={ref}>
      <Skeleton active={isLoading} loading={isLoading}>
        <Form
          form={form}
          colon={false}
          autoComplete='off'
          initialValues={{
            gracePeriodInDays: 0,
            is_allow_remark: false,
            is_travel_type: false,
            is_allow_expense_claim_estimation: false,
            is_allow_adding_staff_members_to_requests: false,
            is_allow_adding_guest_members_to_requests: false,
            is_auto_settle_request_after_a_period: false,
            is_allow_claims_against_request: false,
            is_assign_using_rules: false,
            estimation_type: '',
            are_staff_members_mandatory: false,
            are_guest_members_mandatory: false,
            is_active: false,
          }}
          onValuesChange={onFieldChange}
          layout='vertical'
          size='middle'
        >
          <div className='field-container'>
            <div className='label-header m-t-0'>
              <Trans>Request Type Details</Trans>
            </div>
            <Form.Item
              validateTrigger='onBlur'
              label={<Trans>Entity</Trans>}
              name='legal_entity'
              className='entity'
              rules={[
                {
                  required: true,
                  message: Errors.LEGAL_ENTITY_REQUIRED,
                },
              ]}
            >
              <Select
                allowClear
                mode='multiple'
                maxTagCount={3}
                showSearch={true}
                style={style}
                disabled={isDisabled}
                onChange={onLegalEntitySelect}
                filterOption={(input: any, option: any) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
              >
                {form.getFieldValue('legal_entity')?.length ===
                entityList?.length ? (
                  <Select.Option value='deselect-all'>
                    Deselect All
                  </Select.Option>
                ) : (
                  <Select.Option value='select-all'>Select All</Select.Option>
                )}

                {getOptions(entityList, 'uuid')}
              </Select>
            </Form.Item>
            <Form.Item
              validateTrigger='onBlur'
              label={<Trans>Title</Trans>}
              className='title'
              name='title'
              required
              rules={[
                () => ({
                  validator(_, value) {
                    if (value !== undefined) {
                      value = value?.trim();
                    }
                    if (!value || value === undefined) {
                      return Promise.reject(Errors.TITLE_REQUIRED);
                    } else {
                      if (new RegExp(/^[^@!=\-+#﹘—⸺⸻].*$/).test(value)) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error('Can not start with special character'),
                      );
                    }
                  },
                }),
              ]}
            >
              <Input style={style} disabled={isDisabled} />
            </Form.Item>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
              }}
            >
              <Form.Item
                validateTrigger='onBlur'
                label={<Trans>Code</Trans>}
                className='code'
                name='code'
                required
                rules={[
                  () => ({
                    validator(_, value) {
                      if (value !== undefined) {
                        value = value?.trim();
                      }
                      if (!value || value === undefined) {
                        return Promise.reject(Errors.CODE_REQUIRED);
                      } else {
                        if (new RegExp(/^[^@!=\-+#﹘—⸺⸻].*$/).test(value)) {
                          return Promise.resolve();
                        } else if (!value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error('Can not start with special character'),
                        );
                      }
                    },
                  }),
                ]}
                style={{ width: '85%' }}
              >
                <Input style={style} disabled={isDisabled} />
              </Form.Item>

              <Form.Item name='is_active' valuePropName='checked'>
                <Checkbox disabled={isDisabled}>
                  <Trans>Is Active</Trans>
                </Checkbox>
              </Form.Item>
            </div>
            <Form.Item
              validateTrigger='onBlur'
              name='is_travel_type'
              valuePropName='checked'
            >
              <Checkbox
                className='label-header'
                onChange={resetTravelFields}
                disabled={canConfigChange}
              >
                <Trans>Is Travel Type</Trans>
              </Checkbox>
            </Form.Item>
            {form.getFieldValue('is_travel_type') && (
              <Form.Item name=' '>
                <Form.Item>
                  <CheckboxItem
                    name='is_include_hotel_accommodation'
                    label={<Trans>Include Hotel Accommodation</Trans>}
                    className='label-header'
                    noStyle
                    onChange={resetHotelFields}
                  />

                  {form.getFieldValue('is_include_hotel_accommodation') && (
                    <CheckboxItem
                      name='is_hotel_accommodation_filled_by_admin'
                      label={<Trans>Filled By Admin</Trans>}
                    />
                  )}
                </Form.Item>

                <Form.Item>
                  <CheckboxItem
                    name='is_include_flight_booking'
                    label={<Trans>Include Flight Booking</Trans>}
                    className='label-header'
                    noStyle
                    onChange={resetFlightFields}
                  />

                  {form.getFieldValue('is_include_flight_booking') && (
                    <CheckboxItem
                      name='is_flight_booking_filled_by_admin'
                      label={<Trans>Filled By Admin</Trans>}
                    />
                  )}
                </Form.Item>
                <Form.Item style={{ flex: 1 }}>
                  <CheckboxItem
                    name='is_include_travel_insurance'
                    label={<Trans>Include Travel Insurance</Trans>}
                    className='label-header'
                    noStyle
                    onChange={resetTravelInsuranceFields}
                  />

                  {form.getFieldValue('is_include_travel_insurance') && (
                    <CheckboxItem
                      name='is_travel_insurance_filled_by_admin'
                      label={<Trans>Filled By Admin</Trans>}
                    />
                  )}
                </Form.Item>
                <CheckboxItem
                  name='can_employee_claim_allowances'
                  label={<Trans>Employee Can Claim Allowances</Trans>}
                  className='label-header'
                  noStyle
                />
              </Form.Item>
            )}
            <Form.Item>
              <CheckboxItem
                className='label-header'
                name='is_allow_remark'
                label={<Trans>Allow Purpose</Trans>}
                noStyle
                onChange={resetRemarkFields}
              />
              {form.getFieldValue('is_allow_remark') && (
                <CheckboxItem
                  label={<Trans>Purpose Is Mandatory</Trans>}
                  name='is_remark_mandatory'
                />
              )}
            </Form.Item>
            <Form.Item>
              <CheckboxItem
                label={<Trans>Allow Backdated Requests</Trans>}
                name='is_allow_backdated_requests'
                className='label-header'
                noStyle
                onChange={resetBackdatedFields}
              />
              {form.getFieldValue('is_allow_backdated_requests') && (
                <Form.Item
                  name='backdated_request_period_in_days'
                  label={<Trans>Backdated Request Period In Days</Trans>}
                >
                  <InputNumber
                    type='number'
                    placeholder='Backdated Request Period In Days'
                    style={{ width: '30%' }}
                    min={0}
                  />
                </Form.Item>
              )}
            </Form.Item>
          </div>
          <Form.Item>
            <CheckboxItem
              name='is_allow_claims_against_request'
              label={<Trans>Allow Claims Against Request</Trans>}
              className='label-header'
              noStyle
              onChange={(value: boolean) => onAllowClaimsAgainstRequest(value)}
            />
          </Form.Item>
          {form.getFieldValue('is_allow_claims_against_request') && (
            <>
              <Form.Item noStyle className='width-80-per'>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    flexDirection: 'column',
                  }}
                >
                  <Form.List name='allow_claims_against_request_options'>
                    {(fields, { add, remove }) => {
                      return (
                        <div style={{ width: '100%' }}>
                          {fields.map((field, index) => (
                            <Row key={field.key} gutter={20}>
                              <Col span={5}>
                                <Form.Item
                                  name={[field.name, 'expense_type']}
                                  rules={[
                                    {
                                      required: true,
                                      message: Errors.EXPENSE_TYPE_REQUIRED,
                                    },
                                  ]}
                                >
                                  <Select placeholder='Expense Type'>
                                    {renderExpenseTypes(index)}
                                  </Select>
                                </Form.Item>
                              </Col>
                              <Col span={6}>
                                <Form.Item
                                  name={[
                                    field.name,
                                    'exclude_from_cash_advance',
                                  ]}
                                  valuePropName='checked'
                                >
                                  <Checkbox>
                                    <Trans>Exclude From Cash Advance</Trans>
                                  </Checkbox>
                                </Form.Item>
                              </Col>
                              <Col span={4}>
                                <Form.Item
                                  name={[
                                    field.name,
                                    'is_allow_multiple_claims',
                                  ]}
                                  valuePropName='checked'
                                >
                                  <Checkbox>
                                    <Trans>Allow Multiple Claims</Trans>
                                  </Checkbox>
                                </Form.Item>
                              </Col>
                              <Col span={8}>
                                <Form.Item
                                  name={[
                                    field.name,
                                    'can_expense_receipt_date_be_outside_request_date',
                                  ]}
                                  valuePropName='checked'
                                >
                                  <Checkbox>
                                    <Trans>
                                      Expense Receipt Date Can Be Outside
                                      Request Date
                                    </Trans>
                                  </Checkbox>
                                </Form.Item>
                              </Col>
                              {fields.length > 1 && (
                                <Col flex='none'>
                                  <MinusCircleOutlined
                                    className='dynamic-delete-button'
                                    onClick={() => {
                                      remove(field.name);
                                    }}
                                    style={{ fontSize: '16px' }}
                                  />
                                </Col>
                              )}
                            </Row>
                          ))}
                          {fields.length === 0 && add()}
                          {fields.length < filteredExpenses.length && (
                            <Form.Item>
                              <Button
                                type='dashed'
                                onClick={() => {
                                  add();
                                }}
                                icon={<PlusOutlined />}
                                // style={{ width: '10%' }}
                              >
                                <Trans>Add Another</Trans>
                              </Button>
                            </Form.Item>
                          )}
                        </div>
                      );
                    }}
                  </Form.List>
                  {/* </Form> */}
                </div>
              </Form.Item>
              <div>
                <Form.Item>
                  <CheckboxItem
                    name='is_enable_request_expiry_period'
                    label={<Trans>Allow Request Expiry</Trans>}
                    className='label-header'
                    noStyle
                  />
                </Form.Item>
                {form.getFieldValue('is_enable_request_expiry_period') && (
                  <Form.Item
                    name='request_expiry_period'
                    label={<Trans>Request Expiry Period In Days</Trans>}
                    style={{
                      width: 'calc(50% - 12px)',
                      marginRight: '12px',
                      display: 'inline-block',
                    }}
                  >
                    <InputNumber
                      type='number'
                      style={{ width: '100%' }}
                      min={0}
                    />
                  </Form.Item>
                )}
              </div>
            </>
          )}
          <div className='field-container'>
            <Form.Item
              name='is_allow_expense_claim_estimation'
              valuePropName='checked'
              // noStyle
            >
              <Checkbox
                className='label-header'
                onChange={e => resetEstimationFields(e.target.checked)}
              >
                <Trans>Allow Expense Claim Estimation</Trans>
              </Checkbox>
            </Form.Item>
            {form.getFieldValue('is_allow_expense_claim_estimation') && (
              <Form.Item label={<Trans>Estimation Type</Trans>}>
                <Form.Item
                  name='estimation_type'
                  style={{ display: 'inline-block', width: 'calc(50% - 32px)' }}
                  rules={[
                    { required: true, message: 'Estimation type required' },
                  ]}
                >
                  {/* <Select style={style}>
                <Select.Option value="BLK">Bulk</Select.Option>
                <Select.Option value="ITM">Itemised</Select.Option>
              </Select> */}
                  <Radio.Group
                    disabled={
                      canConfigChange &&
                      ((requestDetails.estimation_type as any)?.code
                        ? true
                        : false)
                    }
                  >
                    <Radio.Button value={'BLK'}>
                      <Trans>Bulk</Trans>
                    </Radio.Button>
                    <Radio.Button value={'ITM'}>
                      <Trans>Itemised</Trans>
                    </Radio.Button>
                  </Radio.Group>
                </Form.Item>
                <CheckboxItem
                  name='is_estimation_mandatory'
                  label={<Trans>Is Estimation Mandatory</Trans>}
                />
              </Form.Item>
            )}
            <Form.Item>
              <CheckboxItem
                name='is_allow_adding_staff_members_to_requests'
                label={<Trans>Allow Adding Staff Members To Requests</Trans>}
                className='label-header'
                noStyle
                onChange={resetStaffMemberFields}
              />

              {form.getFieldValue(
                'is_allow_adding_staff_members_to_requests',
              ) && (
                <CheckboxItem
                  name='are_staff_members_mandatory'
                  label={<Trans>Staff Members Are Mandatory</Trans>}
                />
              )}
            </Form.Item>
            <Form.Item>
              <CheckboxItem
                name='is_allow_adding_guest_members_to_requests'
                label={<Trans>Allow Adding Guest Members To Requests</Trans>}
                className='label-header'
                noStyle
                onChange={resetGuestMemberFields}
              />

              {form.getFieldValue(
                'is_allow_adding_guest_members_to_requests',
              ) && (
                <CheckboxItem
                  name='are_guest_members_mandatory'
                  label={<Trans>Guest Members Are Mandatory</Trans>}
                />
              )}
            </Form.Item>

            <Form.Item>
              <CheckboxItem
                name='is_auto_settle_request_after_a_period'
                label={<Trans>Auto Settle Request After A Period</Trans>}
                className='label-header'
                noStyle
                onChange={resetAutoSettleFields}
              />
              {form.getFieldValue('is_auto_settle_request_after_a_period') && (
                <Form.Item
                  label={<Trans>Number Of Days From Request End Date</Trans>}
                  name='number_of_days_from_request_end_date'
                >
                  <InputNumber type='number' style={{ width: '30%' }} min={0} />
                </Form.Item>
              )}
            </Form.Item>
            <Form.Item>
              <CheckboxItem
                label={<Trans>Allow Charging To Cost Centres</Trans>}
                name='is_allow_charging_to_cost_centres'
                noStyle
                className='label-header'
                onChange={() =>
                  form.setFieldsValue({
                    is_allow_overseas_cost_centres: false,
                    is_allow_3rd_party_vendor: false,
                    is_allow_multiple_cost_centre_selection: false,
                    is_allow_internal_order_cost_centres: false,
                    is_employee_cost_centre_readonly: false,
                  })
                }
              />
              {form.getFieldValue('is_allow_charging_to_cost_centres') && (
                <div>
                  <CheckboxItem
                    name='is_employee_cost_centre_readonly'
                    label={<Trans>Make Employee Cost Centre Read-only</Trans>}
                    onChange={() =>
                      form.setFieldsValue({
                        is_allow_overseas_cost_centres: false,
                        is_allow_3rd_party_vendor: false,
                        is_allow_multiple_cost_centre_selection: false,
                        is_allow_internal_order_cost_centres: false,
                      })
                    }
                  />
                  <CheckboxItem
                    label={<Trans>Allow Overseas Cost Centres</Trans>}
                    name='is_allow_overseas_cost_centres'
                    disabled={form.getFieldValue(
                      'is_employee_cost_centre_readonly',
                    )}
                  />
                  <CheckboxItem
                    label={<Trans>Allow Internal Order Cost Centres</Trans>}
                    name='is_allow_internal_order_cost_centres'
                    disabled={form.getFieldValue(
                      'is_employee_cost_centre_readonly',
                    )}
                  />
                  <CheckboxItem
                    label={<Trans>Allow 3rd Party Vendor</Trans>}
                    name='is_allow_3rd_party_vendor'
                    disabled={form.getFieldValue(
                      'is_employee_cost_centre_readonly',
                    )}
                  />

                  {/* <CheckboxItem
                    label='Allow Multiple Cost Centre Selection'
                    name='is_allow_multiple_cost_centre_selection'
                    disabled={form.getFieldValue(
                      'is_employee_cost_centre_readonly',
                    )}
                  /> */}
                </div>
              )}
            </Form.Item>
            <div>
              <div className='label-header'>
                <Trans>Other Details</Trans>
              </div>
              <Form.Item name='is_enable_cash_advance' valuePropName='checked'>
                <Checkbox>
                  <Trans>Enable Cash Advance</Trans>
                </Checkbox>
              </Form.Item>
              <Form.Item
                name='is_allow_overlapping_requests'
                valuePropName='checked'
              >
                <Checkbox>
                  <Trans>Allow Overlapping Requests</Trans>
                </Checkbox>
              </Form.Item>
              <Form.Item name='is_assign_using_rules' valuePropName='checked'>
                <Checkbox>
                  <Trans>Assign Using Rules</Trans>
                </Checkbox>
              </Form.Item>
              {/* <Form.Item
                label={ <Trans>Cost Centres</Trans> }
                name='cost_centres'
                rules={[
                  { required: true, message: Errors.COST_CENTRE_REQUIRED },
                ]}
              >
                <Select mode='multiple' style={style} maxTagCount={3}>
                  {getOptions(costCentreList)}
                </Select>
              </Form.Item> */}
              <Form.Item>
                <Form.Item
                  name='grace_period_in_days'
                  label={<Trans>Grace Period In Days</Trans>}
                  style={{
                    width: 'calc(50% - 12px)',
                    marginRight: '12px',
                    display: 'inline-block',
                  }}
                >
                  <InputNumber
                    type='number'
                    style={{ width: '100%' }}
                    min={0}
                  />
                </Form.Item>
                <Form.Item
                  label={<Trans>Wage Type</Trans>}
                  name='wage_type'
                  // rules={[
                  //   { required: true, message: Errors.WAGE_TYPE_REQUIRED },
                  // ]}
                  style={{
                    width: 'calc(50% - 12px)',
                    display: 'inline-block',
                    marginLeft: '12px',
                  }}
                >
                  <Select
                    filterOption={(input: any, option: any) =>
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                    showSearch
                    style={style}
                  >
                    {getOptions(wageTypeList)}
                  </Select>
                </Form.Item>
              </Form.Item>
            </div>
          </div>
          <Form.Item
            name='instruction_text'
            label={<Trans>Instruction Text</Trans>}
            className='label-header width-80-per instruction-text-section'
            rules={[
              () => ({
                validator(_, value) {
                  if (value === undefined) {
                    return Promise.resolve();
                  }
                  let text = value.replace(/(<([^>]+)>)/gi, '');
                  text = text.trim();
                  if (text) {
                    if (String(text.match(/^[^@!=\-+#﹘—⸺⸻].*$/g)) === text) {
                      return Promise.resolve();
                    } else {
                      return Promise.reject(
                        new Error('Can not start with special characters.'),
                      );
                    }
                  } else {
                    return Promise.resolve();
                  }
                },
              }),
            ]}
          >
            <RichTextEditor />
          </Form.Item>
        </Form>
      </Skeleton>
    </div>
  );
});

const CheckboxItem: React.FC<{
  name: string;
  label: React.ReactNode;
  style?: React.CSSProperties;
  onChange?: (val: boolean) => void;
  className?: string;
  noStyle?: boolean;
  disabled?: boolean;
}> = props => {
  const { name, label, style, onChange, className, noStyle, disabled } = props;
  // const message = i18nMark(label);
  return (
    <Form.Item valuePropName='checked' name={name} noStyle={noStyle}>
      <Checkbox
        style={{
          ...style,
        }}
        disabled={disabled}
        className={className}
        onChange={e => (onChange ? onChange(e.target.checked) : undefined)}
      >
        {/* <Trans id={label} values={{ label }}>
          The text is {label}
          */}
        {label}
        {/* <Trans render={(val: any) => <div>{val.translation}</div>}>
          {label}
          */}
      </Checkbox>
    </Form.Item>
  );
};

const mapStateToProps = (state: any) => ({
  entityList: getEntities(state),
  wageTypeList: getWageTypes(state),
  costCentreList: getCostCentre(state),
  error: getRequestTypeErrorMessage(state),
  success: getRequestTypeSuccessMessage(state),
  expenseTypes: getExpenseTypes(state),
  isLoading: getRequestTypeLoader(state),
  requestDetails: getRequestTypeExpandedItem(state),
});

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  _fetchEntities: () => dispatch(fetchEntities()),
  _fetchWageTypes: () => dispatch(fetchWageTypes()),
  _fetchCostCentre: () => dispatch(fetchCostCentres()),
  _createRequestType: (body: any) => dispatch(createRequestType(body)),
  _fetchExpenseTypes: (body: any) => dispatch(fetchExpenseTypes(body)),
});

const connector = connect(mapStateToProps, mapDispatchToProps, null, {
  forwardRef: true,
});

export default memo(connector(ConfigForm));
