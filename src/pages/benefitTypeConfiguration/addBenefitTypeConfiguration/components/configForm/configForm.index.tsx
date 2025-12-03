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
  InputNumber,
  Radio,
  Col,
  Row,
  message,
  Skeleton,
} from 'antd';
import {
  getBenefitEntities,
  getBenefitWageTypes,
  getBenefitTypeErrorMessage,
  getBenefitTypeSuccessMessage,
  getBenefitExpenseTypes,
  getBenefitTypeLoader,
  getBenefitTypeExpandedItem,
  getGlAccounts,
  getCostCentre,
  getBenefitTypeEntitlementTypes,
  getBenefitTypeEntitlementPeriodUnit,
  getBenefitTypeAvailableAfter,
  getBenefitTypeAvailableAfterPeriod,
  getBenefitTypeCanClaimFor,
  getBenefitTypeProratedBy,
  getBenefitTypeDeductibleComponent,
} from '../../../../../shared/redux/rootReducer';
import { connect, ConnectedProps } from 'react-redux';
import {
  RichTextEditor,
  ErrorBoundary,
} from '../../../../../shared/components';

// import {
//   ENTITLEMENT_TYPES,
//   AVAILABLE_AFTER,
//   ENTITLEMENT_PERIOD,
//   DEDUCTIBLE_COMPONENT,
//   CAN_CLAIM_FOR,
// } from './configForm.model';
import './benefitConfigurationForm.index.less';
import {
  fetchEntities,
  fetchWageTypes,
  createBenefitType,
  fetchExpenseTypes,
  fetchBenefitChoices,
  // fetchGLAccounts,
} from '../../../benefitTypeConfiguration.thunk';

import { fetchGlAccounts } from '../../../../../shared/redux/glAccount/glAccount.thunk';

import { DeleteOutlined, PaperClipOutlined } from '@ant-design/icons';

import ReceiptSelector from '../../../../../shared/components/receiptSelector/receiptSelector.index';
import { UploadFile, UploadChangeParam } from 'antd/lib/upload/interface';
import Errors from '../../../benefitTypeConfiguration.data.json';
import { Trans } from '@lingui/macro';
import { fetchCostCentres } from '../../../../../shared/redux/costCentre/costCentre.thunk';
import { BENEFIT_CHOICES } from '../../../benefitTypeConfiguration.model';

let deletedList: string[] = [];
const ConfigForm: React.FC<ConnectedProps<typeof connector> & {
  onValueChange: (data: any) => any;
  onSave?: (formBody: any) => void;
  isClone: boolean;
  legal_entity?: string;
  ref?: any;
}> = React.forwardRef((props, ref: any) => {
  const {
    entityList,
    _fetchEntities,
    _fetchCostCentre,
    _fetchWageTypes,
    _fetchGLAccounts,
    _fetchBenefitTypeChoice,
    onValueChange,
    wageTypeList,
    costCentreList,
    error,
    isLoading,
    benefitDetails,
    glAccountList,
    entitlementTypes,
    entitlementPeriodUnit,
    availableAfter,
    availableAfterUnit,
    proratedBy,
    canClaimFor,
    deductibleComponent,
    isClone,
    legal_entity,
  } = props;

  const [form] = Form.useForm();

  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const [defaultFileList, setDefaultFileList] = useState<any[]>([]);

  // const [instruction, setInstruction] = useState('');

  const onFieldChange = (_: any, _1: any) => {
    try {
      const values = form.getFieldsValue();
      onValueChange({ ...values });
    } catch (e) {}
  };

  // const onChangeInstruction = (value: string) => {
  //   try {
  //     const values = form.getFieldsValue();
  //     setInstruction(value);
  //     onValueChange({ ...values, instruction_text: value });
  //   } catch (e) {
  //   }
  // };

  // useEffect(() => {
  //   setFilteredExpenses(expenseTypes);
  // }, [expenseTypes]);

  useEffect(() => {
    try {
      if (
        entityList &&
        entityList.length > 0 &&
        benefitDetails &&
        Object.keys(benefitDetails).length > 0
      ) {
        if (!isClone) {
          if (benefitDetails.legal_entity instanceof Array) {
            const entities = benefitDetails.legal_entity.map(
              (item: any) => item.uuid,
            );
            form.setFieldsValue({ legal_entity: entities });
          } else {
            const entity = (benefitDetails.legal_entity as any).uuid;
            form.setFieldsValue({ legal_entity: [entity] });
          }
        }

        if (legal_entity) {
          form.setFieldsValue({ legal_entity: [legal_entity] });
        }
      }
    } catch (e) {}
  }, [entityList, benefitDetails, legal_entity]);

  useEffect(() => {
    try {
      if (benefitDetails && Object.keys(benefitDetails).length > 0) {
        const values: any = {
          ...benefitDetails,
          // legal_entity: (benefitDetails.legal_entity as any)?.id,
          wage_type: (benefitDetails.wage_type as any)?.id,
        };

        if (values.legal_entity instanceof Array) {
          values.legal_entity = benefitDetails.legal_entity.map(
            (item: any) => item.uuid,
          );
        } else {
          values.legal_entity = (benefitDetails.legal_entity as any).uuid;
        }

        values.cost_centres = benefitDetails.cost_centres?.map(
          (cc: any) => cc.id,
        );

        values.gl_account = values.gl_account?.id;
        values.available_after = values.available_after?.code;
        values.available_after_period_unit =
          values.available_after_period_unit?.code;
        values.can_claim_for = values.can_claim_for?.code;
        values.entitlement_period_unit = values.entitlement_period_unit?.code;
        values.entitlement_type = values.entitlement_type?.code;
        values.prorated_by = values.prorated_by?.code;
        values.deductible_component = values.deductible_component?.code;

        // setInstruction(
        //   benefitDetails.instruction_text
        //     ? benefitDetails.instruction_text
        //     : '',
        // );

        if (!isClone && !legal_entity) {
          benefitDetails.policy_documents &&
            setDefaultFileList(benefitDetails.policy_documents);
        }

        // }
        delete values.legal_entity;
        if (isClone) {
          delete values.title;
          delete values.code;
        }
        form.setFieldsValue(values);
        if (legal_entity) {
          form.setFieldsValue({ legal_entity });
        }
        onFieldChange('', '');
      }
    } catch (e) {}
  }, [benefitDetails]);

  useEffect(() => {
    try {
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
    } catch (e) {}
  }, [error]);

  useEffect(() => {
    _fetchEntities();
    _fetchWageTypes();
    _fetchCostCentre();
    _fetchGLAccounts();
    _fetchBenefitTypeChoice('available_after');
    _fetchBenefitTypeChoice('available_after_period_unit');
    _fetchBenefitTypeChoice('claim_for');
    _fetchBenefitTypeChoice('deductible_component');
    _fetchBenefitTypeChoice('entitlement_period_unit');
    _fetchBenefitTypeChoice('entitlement_type');
    _fetchBenefitTypeChoice('prorated_by');
  }, []);

  useImperativeHandle(ref, () => ({
    onSubmitHandler: async () => {
      try {
        const values = await form.validateFields();

        const returnObj: {
          policy_documents?: any;
          deleted_policy_documents?: any[];
        } = {
          ...values,
        };

        if (fileList.length > 0) {
          returnObj.policy_documents = fileList.map(item => item.originFileObj);
        }
        if (benefitDetails && Object.keys(benefitDetails).length > 0) {
          returnObj.deleted_policy_documents = deletedList;
        }
        return returnObj;
      } catch (e) {}
    },
    onClearBtnHandler: () => {
      onClearBtnHandler();
    },
  }));

  const onClearBtnHandler = () => {
    try {
      const legal_entity = form.getFieldValue('legal_entity');

      form.resetFields();
      if (benefitDetails && Object.keys(benefitDetails).length > 0) {
        form.setFieldsValue({ legal_entity });
      }
      onFieldChange('', '');
    } catch (e) {}
  };

  // useEffect(() => {
  //   onFieldChange('', '');
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [instruction]);

  const style = { width: '100%' };

  const getOptions = (list: any[], key = 'code') => {
    try {
      return list.map((item: any) => (
        <Select.Option value={item[key]} key={item[key]}>
          {item.title}
        </Select.Option>
      ));
    } catch (e) {
      return [];
    }
  };

  const getGLOptions = () => {
    try {
      return glAccountList.map((item: any) => (
        <Select.Option value={item.id} key={item.id}>
          {item.account_number}
        </Select.Option>
      ));
    } catch (e) {
      return [];
    }
  };

  const daysValidator = (_: any, val: number) => {
    try {
      const available_after_period_unit = form.getFieldValue(
        'available_after_period_unit',
      );
      if (available_after_period_unit === 'DAY' && val > 365) {
        return Promise.reject(Errors.DAYS_VALIDATION);
      } else if (available_after_period_unit === 'MON' && val > 12) {
        return Promise.reject(Errors.MONTH_VALIDATION);
      } else {
        return Promise.resolve();
      }
    } catch (e) {}
  };

  const periodUnit = (
    <Form.Item
      name='available_after_period_unit'
      noStyle
      rules={[{ required: true, message: Errors.PERIOD_UNIT_REQUIRED }]}
    >
      <Select defaultValue={'DAY'}>{getOptions(availableAfterUnit)}</Select>
    </Form.Item>
  );
  const isProrateDisable = () => {
    try {
      const entitlement_period_unit = form.getFieldValue(
        'entitlement_period_unit',
      );
      const is_disabled =
        entitlement_period_unit === 'CP' ||
        entitlement_period_unit === 'LT' ||
        entitlement_period_unit === 'BA';

      if (is_disabled) {
        form.setFieldsValue({ is_prorated: false });
      }
      return is_disabled;
    } catch {}
  };

  const isEntitlementPeriodVisible = () => {
    const entitlement_period_unit = form.getFieldValue(
      'entitlement_period_unit',
    );
    return (
      entitlement_period_unit === 'CY' ||
      entitlement_period_unit === 'CS' ||
      entitlement_period_unit === 'FY' ||
      entitlement_period_unit === 'FS'
    );
  };

  const policyDocumentHandler = (info: UploadChangeParam<UploadFile<any>>) => {
    try {
      if (info.fileList.length > 5) {
        message.destroy();
        message.warning('Maximum 5 document supported');
        return;
      }
      setFileList([...info.fileList]);
    } catch (e) {}
  };

  const deleteFile = (id: string) => {
    try {
      const newFiles = fileList.filter(item => item.uid !== id);
      setFileList(newFiles);
    } catch (e) {}
  };
  const removeFile = (id: string) => {
    try {
      const newFiles = defaultFileList.filter(item => item.id !== id);
      deletedList.push(id);
      setDefaultFileList(newFiles);
    } catch (e) {}
  };

  const resetAvailabilityFields = (checked: boolean) => {
    if (!checked) {
      form.setFieldsValue({
        is_benefit_availability_constrained: false,
        available_after: undefined,
        available_after_period_unit: 'DAY',
        available_after_period: undefined,
      });
    }
  };

  const resetProrateFields = (checked: boolean) => {
    if (!checked) {
      form.setFieldsValue({
        is_prorated: false,
        prorated_by: undefined,
      });
    }
  };

  const resetReceiptFields = (checked: boolean) => {
    if (!checked) {
      form.setFieldsValue({
        can_attach_receipts: false,
        is_receipt_mandatory: false,
        is_display_no_receipt_attached_field: false,
        is_remark_for_no_receipt_mandatory: false,
      });
    }
  };

  const resetReceiptMandatoryFields = (checked: boolean) => {
    if (!checked) {
      form.setFieldsValue({
        is_receipt_mandatory: false,
        is_display_no_receipt_attached_field: false,
        is_remark_for_no_receipt_mandatory: false,
      });
    }
  };

  const resetRemarkFields = (checked: boolean) => {
    if (!checked) {
      form.setFieldsValue({
        allow_remark: false,
        is_remark_mandatory: false,
      });
    }
  };

  const resetBackdateFields = (checked: boolean) => {
    if (!checked) {
      form.setFieldsValue({
        allow_backdated_claims: false,
        backdated_claims_allowed_upto: undefined,
      });
    }
  };

  const isDisabled =
    benefitDetails && Object.keys(benefitDetails).length > 0 && !isClone;

  return (
    <ErrorBoundary>
      <div className='benefits-configuration-form' ref={ref}>
        <Skeleton active={isLoading} loading={isLoading}>
          <Form
            form={form}
            // {...formLayout}
            size='middle'
            colon={false}
            autoComplete='off'
            initialValues={{
              entitlement_type: 'BOT',
              available_after_period_unit: 'DAY',
              allow_remark: false,
              is_remark_mandatory: false,
              allow_backdated_claims: false,
              is_prorated: false,
              is_active: false,
              is_benefit_availability_constrained: false,
              is_unlimited_no_claims: false,
              is_unlimited_amount: false,
              can_exceed_entitlement_amount: false,
              can_attach_receipts: false,
              exclude_from_finance_processing: false,
              is_allow_charging_to_cost_centres: false,
              can_employee_edit_claim_amount: false,
              can_be_marked_prepaid: false,
              is_default_to_employee_cost_centre: false,
              // title: 'Fdsf',
              // code: 'fsdf',
              // grace_period: 8,
              // tax_percentage: 4,
              // legal_entity: [1],
              // max_claims_per_period: 3,
              // entitlement_period_unit: 'LT',
              // deductible_component: 'PAY',
              // can_claim_for: 'SLF',
              // wage_type: 2,
              // gl_account: 3,
            }}
            onValuesChange={onFieldChange}
            layout='vertical'
          >
            <div className='field-container'>
              <div className='label-header m-t-0'>
                <Trans>Benefit Type Details</Trans>
              </div>
              <Form.Item
                label={<Trans>Entitlement Type</Trans>}
                name='entitlement_type'
              >
                <Select disabled={isDisabled}>
                  {getOptions(entitlementTypes)}
                </Select>
              </Form.Item>
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
                  style={style}
                  mode='multiple'
                  maxTagCount={3}
                  disabled={isDisabled}
                  filterOption={(input: any, option: any) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {getOptions(entityList, 'uuid')}
                </Select>
              </Form.Item>
              <Form.Item
                validateTrigger='onBlur'
                label={<Trans>Title</Trans>}
                className='title'
                name='title'
                rules={[{ required: true, message: Errors.TITLE_REQUIRED }]}
              >
                <Input
                  autoComplete='new-password'
                  disabled={isDisabled}
                  style={style}
                />
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
                  rules={[{ required: true, message: Errors.CODE_REQUIRED }]}
                  style={{ width: '85%' }}
                >
                  <Input
                    autoComplete='new-password'
                    disabled={isDisabled}
                    style={style}
                  />
                </Form.Item>

                <Form.Item name='is_active' valuePropName='checked'>
                  <Checkbox disabled={isDisabled}>
                    <Trans>Is Active</Trans>
                  </Checkbox>
                </Form.Item>
              </div>

              <Form.Item
                validateTrigger='onBlur'
                name='is_benefit_availability_constrained'
                valuePropName='checked'
              >
                <Checkbox
                  className='label-header'
                  onChange={e => resetAvailabilityFields(e.target.checked)}
                >
                  <Trans>Is Benefit Availability Constrained</Trans>
                </Checkbox>
              </Form.Item>
              {form.getFieldValue('is_benefit_availability_constrained') && (
                <Form.Item
                  label={<Trans>Available After</Trans>}
                  name='available_after'
                  style={{
                    width: 'calc(50% - 12px)',
                    marginRight: '12px',
                    display: 'inline-block',
                  }}
                  rules={[
                    {
                      required: true,
                      message: Errors.AVAILABLE_AFTER_REQUIRED,
                    },
                  ]}
                >
                  <Select>{getOptions(availableAfter, 'code')}</Select>
                </Form.Item>
              )}
              {form.getFieldValue('is_benefit_availability_constrained') &&
                form.getFieldValue('available_after') &&
                form.getFieldValue('available_after') !== 'CNF' && (
                  <Form.Item
                    label={<Trans>Period</Trans>}
                    name='available_after_period'
                    rules={[{ validator: daysValidator }]}
                    validateTrigger='onBlur'
                    style={{
                      width: 'calc(50% - 12px)',
                      marginRight: '12px',
                      display: 'inline-block',
                    }}
                  >
                    <Input type='number' addonBefore={periodUnit} />
                  </Form.Item>
                )}
              <Form.Item
                label={<Trans>Benefit Entitlement Period</Trans>}
                name='entitlement_period_unit'
                rules={[
                  {
                    required: true,
                    message: Errors.BENEFIT_ENTITLEMENT_PERIOD_REQUIRED,
                  },
                ]}
              >
                <Select>{getOptions(entitlementPeriodUnit, 'code')}</Select>
              </Form.Item>
              {isEntitlementPeriodVisible() && (
                <Form.Item
                  label={<Trans>Entitlement Period</Trans>}
                  name='entitlement_period'
                  rules={[
                    { required: true, message: 'Entitlement period required' },
                  ]}
                >
                  <InputNumber
                    type='number'
                    style={{ width: '100%' }}
                    min={0}
                  />
                </Form.Item>
              )}
              <Form.Item
                label={<Trans>Maximum Claims Per Entitlement Period</Trans>}
                name='max_claims_per_period'
                rules={[
                  {
                    required: true,
                    message:
                      Errors.MAXIMUM_CLAIMS_PER_ENTITLEMENT_PERIOD_REQUIRED,
                  },
                ]}
              >
                <InputNumber style={{ width: '100%' }} type='number' min={0} />
              </Form.Item>
              <Form.Item>
                <CheckboxItem
                  className='label-header'
                  name='is_prorated'
                  label={<Trans>Prorate Entitlements</Trans>}
                  noStyle
                  disabled={isProrateDisable()}
                  onChange={resetProrateFields}
                />
                {form.getFieldValue('is_prorated') && (
                  <Form.Item
                    name='prorated_by'
                    rules={[
                      { required: true, message: Errors.PRORATED_BY_REQUIRED },
                    ]}
                  >
                    <Radio.Group>
                      {proratedBy.map(item => (
                        <Radio value={item.code}>{item.title}</Radio>
                      ))}
                    </Radio.Group>
                  </Form.Item>
                )}
              </Form.Item>
              <CheckboxItem
                className='label-header'
                name='is_unlimited_no_claims'
                label={<Trans>Can Be Entitled For Unlimited Claims</Trans>}
              />
              <CheckboxItem
                className='label-header'
                name='is_unlimited_amount'
                label={<Trans>Can Be Entitled For Unlimited Amount</Trans>}
              />
              <CheckboxItem
                className='label-header'
                name='can_exceed_entitlement_amount'
                label={<Trans>Can Claims Amount Exceed Entitled Amount</Trans>}
              />
              <Form.Item>
                <CheckboxItem
                  label={<Trans>Can Attach Receipt</Trans>}
                  name='can_attach_receipts'
                  className='label-header'
                  noStyle
                  onChange={resetReceiptFields}
                />
                {form.getFieldValue('can_attach_receipts') && (
                  <CheckboxItem
                    name='is_receipt_mandatory'
                    label={<Trans>Receipt Is Mandatory</Trans>}
                    onChange={resetReceiptMandatoryFields}
                  />
                )}
                {form.getFieldValue('is_receipt_mandatory') && (
                  <div>
                    <CheckboxItem
                      name='is_display_no_receipt_attached_field'
                      label={<Trans>Display No Receipt Attached Field</Trans>}
                    />
                    <CheckboxItem
                      name='is_remark_for_no_receipt_mandatory'
                      label={<Trans>Remark For No Receipt Mandatory</Trans>}
                    />
                  </div>
                )}
              </Form.Item>
              <Form.Item>
                <CheckboxItem
                  label={<Trans>Allow Purpose</Trans>}
                  name='allow_remark'
                  className='label-header'
                  noStyle
                  onChange={resetRemarkFields}
                />
                {form.getFieldValue('allow_remark') && (
                  <CheckboxItem
                    name='is_remark_mandatory'
                    label={<Trans>Purpose Is Mandatory</Trans>}
                  />
                )}
              </Form.Item>
              <Form.Item>
                <CheckboxItem
                  label={<Trans>Allow Backdated Claims</Trans>}
                  name='allow_backdated_claims'
                  className='label-header'
                  noStyle
                  onChange={resetBackdateFields}
                />
                {form.getFieldValue('allow_backdated_claims') && (
                  <Form.Item
                    name='backdated_claims_allowed_upto'
                    label={<Trans>Backdated Benefit Period In Days</Trans>}
                  >
                    <InputNumber
                      type='number'
                      placeholder='Backdated Claim Period In Days'
                      style={{ width: '30%' }}
                      min={0}
                    />
                  </Form.Item>
                )}
              </Form.Item>
              <Form.Item>
                <CheckboxItem
                  name='is_allow_claims_against_request'
                  label={<Trans>Allow Claims Against Benefit</Trans>}
                  className='label-header'
                  noStyle
                />
              </Form.Item>
              <Form.Item
                label={<Trans>Tax Percentage</Trans>}
                name='tax_percentages'
                rules={[
                  { required: true, message: Errors.TAX_PERCENTAGE_REQUIRED },
                ]}
              >
                <InputNumber type='number' style={{ width: '100%' }} min={0} />
              </Form.Item>
              <Form.Item
                label={<Trans>Deductible Component</Trans>}
                name='deductible_component'
                rules={[
                  {
                    required: true,
                    message: Errors.DEDUCTIBLE_COMPONENT_REQUIRED,
                  },
                ]}
              >
                <Select>{getOptions(deductibleComponent)}</Select>
              </Form.Item>
              <Form.Item
                label={<Trans>Can Claim For</Trans>}
                name='can_claim_for'
                rules={[
                  { required: true, message: Errors.CAN_CLAIM_FOR_REQUIRED },
                ]}
              >
                <Select>{getOptions(canClaimFor)}</Select>
              </Form.Item>
              <Form.Item>
                <CheckboxItem
                  label={<Trans>Allow Charging To Cost Centres</Trans>}
                  name='is_allow_charging_to_cost_centres'
                  noStyle
                  className='label-header'
                />
                {form.getFieldValue('is_allow_charging_to_cost_centres') && (
                  <div>
                    <CheckboxItem
                      name='is_default_to_employee_cost_centre'
                      label={<Trans>Default To Employee Cost Centre</Trans>}
                      onChange={() => form.setFieldsValue({ cost_centres: [] })}
                    />
                    <Form.Item
                      label={<Trans>Cost Centre</Trans>}
                      name='cost_centres'
                      rules={[
                        {
                          required: !form.getFieldValue(
                            'is_default_to_employee_cost_centre',
                          ),
                          message: Errors.COST_CENTRE_REQUIRED,
                        },
                      ]}
                    >
                      <Select
                        mode='multiple'
                        maxTagCount={3}
                        style={style}
                        disabled={form.getFieldValue(
                          'is_default_to_employee_cost_centre',
                        )}
                      >
                        {getOptions(costCentreList, 'id')}
                      </Select>
                    </Form.Item>
                  </div>
                )}
              </Form.Item>

              <div>
                <div className='label-header'>
                  <Trans>Other Details</Trans>
                </div>
                <CheckboxItem
                  name='can_employee_edit_claim_amount'
                  label={<Trans>Can Employee Edit Claim Amount</Trans>}
                />
                <CheckboxItem
                  name='can_be_marked_prepaid'
                  label={<Trans>Can Be Marked Prepaid</Trans>}
                />
                <CheckboxItem
                  name='exclude_from_finance_processing'
                  label={<Trans>Exclude Claims From Finance Processing</Trans>}
                />
              </div>
            </div>
            <div className='width-80-per'>
              <Form.Item>
                <Form.Item
                  name='grace_period'
                  label={<Trans>Grace Period In Days</Trans>}
                  style={{
                    width: 'calc(33% - 12px)',
                    marginRight: '12px',
                    display: 'inline-block',
                  }}
                  rules={[
                    { required: true, message: Errors.GRACE_PERIOD_REQUIRED },
                  ]}
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
                  rules={[
                    { required: true, message: Errors.WAGE_TYPE_REQUIRED },
                  ]}
                  style={{
                    width: 'calc(33% - 12px)',
                    display: 'inline-block',
                    marginLeft: '12px',
                  }}
                >
                  <Select
                    style={style}
                    showSearch
                    filterOption={(input: any, option: any) =>
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {getOptions(wageTypeList, 'id')}
                  </Select>
                </Form.Item>
                <Form.Item
                  label={<Trans>GL Account</Trans>}
                  name='gl_account'
                  rules={[
                    { required: true, message: Errors.GL_ACCOUNT_REQUIRED },
                  ]}
                  style={{
                    width: 'calc(33% - 12px)',
                    display: 'inline-block',
                    marginLeft: '12px',
                  }}
                >
                  <Select
                    style={style}
                    showSearch
                    filterOption={(input: any, option: any) =>
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {getGLOptions()}
                  </Select>
                </Form.Item>
              </Form.Item>
            </div>
            <div className='field-container'>
              <div className='label-header'>
                <Trans>Policy Details</Trans>
              </div>
              <Row gutter={16}>
                <Col span={16}>
                  <ReceiptSelector
                    displayNoReceiptAttachedField={false}
                    isReceiptMandatory={false}
                    showUploadList={false}
                    onChange={policyDocumentHandler}
                    fileList={fileList}
                    receiptLabel=''
                    accept='.pdf'
                    disabled={fileList.length >= 5}
                    beforeUpload={_file => false}
                  />
                  {/* </div> */}
                </Col>
                <Col span={8}>
                  {fileList.map(file => (
                    <div className='policy-item'>
                      <PaperClipOutlined />
                      <div className='policy-name'>{file.name}</div>
                      <DeleteOutlined onClick={() => deleteFile(file.uid)} />
                    </div>
                  ))}
                  {defaultFileList.map((file, i) => (
                    <div className='policy-item'>
                      <PaperClipOutlined />
                      <div className='policy-name'>
                        <a href={file.policy} target='_new'>
                          {file.policy_file_name || 'Attachment#' + (i + 1)}
                        </a>
                      </div>
                      <DeleteOutlined onClick={() => removeFile(file.id)} />
                    </div>
                  ))}
                </Col>
              </Row>
            </div>

            <Form.Item
              name='instruction_text'
              label={<Trans>Instruction Text</Trans>}
              className='label-header width-80-per instruction-text-section'
              rules={[
                () => ({
                  validator(_, value) {
                    let text = value.replace(/(<([^>]+)>)/gi, '');
                    text = text.trim();
                    if (text) {
                      if (String(text.match(/[^=+\-!@#﹘—⸺⸻].*/g)) === text) {
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
    </ErrorBoundary>
  );
});

const CheckboxItem: React.FC<{
  name: string;
  label: string | React.ReactNode;
  style?: React.CSSProperties;
  onChange?: (val: boolean) => void;
  className?: string;
  noStyle?: boolean;
  disabled?: boolean;
}> = props => {
  const { name, label, style, onChange, className, noStyle, disabled } = props;
  return (
    <ErrorBoundary>
      <Form.Item valuePropName='checked' name={name} noStyle={noStyle}>
        <Checkbox
          disabled={disabled}
          style={{
            ...style,
          }}
          className={className}
          onChange={e => (onChange ? onChange(e.target.checked) : undefined)}
        >
          {label}
        </Checkbox>
      </Form.Item>
    </ErrorBoundary>
  );
};

const mapStateToProps = (state: any) => ({
  entityList: getBenefitEntities(state),
  wageTypeList: getBenefitWageTypes(state),
  costCentreList: getCostCentre(state),
  error: getBenefitTypeErrorMessage(state),
  success: getBenefitTypeSuccessMessage(state),
  expenseTypes: getBenefitExpenseTypes(state),
  isLoading: getBenefitTypeLoader(state),
  benefitDetails: getBenefitTypeExpandedItem(state),
  glAccountList: getGlAccounts(state),
  entitlementTypes: getBenefitTypeEntitlementTypes(state),
  entitlementPeriodUnit: getBenefitTypeEntitlementPeriodUnit(state),
  availableAfter: getBenefitTypeAvailableAfter(state),
  availableAfterUnit: getBenefitTypeAvailableAfterPeriod(state),
  canClaimFor: getBenefitTypeCanClaimFor(state),
  proratedBy: getBenefitTypeProratedBy(state),
  deductibleComponent: getBenefitTypeDeductibleComponent(state),
});

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  _fetchEntities: () => dispatch(fetchEntities()),
  _fetchWageTypes: () => dispatch(fetchWageTypes()),
  _fetchCostCentre: () => dispatch(fetchCostCentres()),
  _createBenefitType: (body: any) => dispatch(createBenefitType(body)),
  _fetchExpenseTypes: () => dispatch(fetchExpenseTypes()),
  _fetchGLAccounts: () => dispatch(fetchGlAccounts()),
  _fetchBenefitTypeChoice: (choice: BENEFIT_CHOICES) =>
    dispatch(fetchBenefitChoices(choice)),
});

const connector = connect(mapStateToProps, mapDispatchToProps, null, {
  forwardRef: true,
});

export default memo(connector(ConfigForm));
