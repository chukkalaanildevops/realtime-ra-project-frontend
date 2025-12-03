/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  memo,
  useState,
  useEffect,
  Dispatch,
  useImperativeHandle,
  MouseEvent,
} from 'react';

import {
  Form,
  Select,
  Input,
  Checkbox,
  InputNumber,
  message,
  Skeleton,
  Radio,
  Card,
  Row,
  Col,
  DatePicker,
  Button,
  Table,
} from 'antd';
import {
  getBenefitEntities,
  getBenefitTypeDeductibleComponent,
  getBenefitTypeProration,
  getBenefitTypeEntitlementPeriod,
  getBenefitTypeFrequencyUnit,
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
  getBenefitTypeDataLoading,
} from '../../../../../shared/redux/rootReducer';
import { connect, ConnectedProps } from 'react-redux';
import {
  RichTextEditor,
  ErrorBoundary,
  Loader,
  AppDrawer,
} from '../../../../../shared/components';

import './benefitConfigurationForm.index.less';
import {
  fetchEntities,
  fetchWageTypes,
  createBenefitType,
  fetchExpenseTypes,
  fetchBenefitChoices,
  fetchDependentRelations,
  fetchFlexibleBenefitCategory,
  fetchEntityCostCenterList,
  // fetchGLAccounts,
} from '../../../benefitTypeConfiguration.thunk';

import moment from 'moment';

import { fetchGlAccounts } from '../../../../../shared/redux/glAccount/glAccount.thunk';
import {
  updateCostCenterForEntity,
  returnUpdateRateTypeAction,
} from '../../../benefitTypeConfiguration.action';
import Errors from '../../../benefitTypeConfiguration.data.json';
import { Trans } from '@lingui/macro';
import { fetchCostCentres } from '../../../../../shared/redux/costCentre/costCentre.thunk';
import { BENEFIT_CHOICES } from '../../../benefitTypeConfiguration.model';

const BenefitConfigurationForm: React.FC<ConnectedProps<typeof connector> & {
  onValueChange: (data: any) => any;
  onSave?: (formBody: any) => void;
  isClone: boolean;
  legal_entity?: string;
  ref?: any;
}> = React.forwardRef((props, ref: any) => {
  const {
    _returnUpdateRateTypeAction,
    rate_type,
    entityList,
    dependentRelations,
    flexibleBenefitCategory,
    cost_centres_for_legal_entity,
    _fetchEntities,
    _fetchDependentRelations,
    _fetchFlexibleBenefitCategory,
    _fetchEntityCostCenterList,
    // _fetchCostCentre,
    _fetchWageTypes,
    _fetchGLAccounts,
    _fetchBenefitTypeChoice,
    _updateCostCenterForEntity,
    frequencyUnit,
    onValueChange,
    wageTypeList,
    error,
    isLoading,
    benefitDetails,
    glAccountList,
    deductibleComponent,
    proration,
    isClone,
    idDataLoading,
    legal_entity,
    entitlementPeriod,
    entityCostCenterList,
    entityCostCenterLoader,
    maxClaimPerEntitlementPeriodList,
  } = props;
  const [form] = Form.useForm();
  const { Option } = Select;

  let drawerVisibility: boolean = rate_type !== '';
  const updateMode =
    benefitDetails && Object.keys(benefitDetails).length > 0 ? true : false;
  const ClaimsSelection = [
    { id: 1, title: 'Can Be Entitled For Unlimited Claims' },
    { id: 2, title: 'Restrict No Of Claims Per Period' },
  ];

  const onFieldChange = (_: any, _1: any) => {
    try {
      const values = form.getFieldsValue();
      onValueChange({ ...values });
    } catch (e) {}
  };
  const [entityCostCenterCheckbox, setEntityCostCenterCheckbox] = useState(
    false,
  );
  const [onUpdateSelectedEntityList, setOnUpdateSelectedEntityList] = useState<
    any[]
  >([]);
  const [selectedEntityList, setSelectedEntityList] = useState<any[]>([]);
  const [filteredBenefitCategories, setFilteredBenefitCategories] = useState<
    any[]
  >([]);

  const [
    selectedFlexibleBenefitCategoryList,
    setSelectedFlexibleBenefitCategoryList,
  ] = useState<any[]>([]);

  const [
    selectedDependentRelationList,
    setSelectedDependentRelationList,
  ] = useState<any[]>([]);

  const [selectedClaim, onChangeSelectedClaim] = useState<any>(1);
  // const [frequencyUnitCode, setFrequencyUnitCode] = useState<string>('');
  useEffect(() => {
    flexibleBenefitCategory.length > 0 &&
      !updateMode &&
      setFilteredBenefitCategoryDropdownList(selectedEntityList);
  }, [selectedEntityList, flexibleBenefitCategory]);
  useEffect(() => {
    try {
      if (entityList && entityList.length > 0 && updateMode) {
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
  }, [entityList, benefitDetails]);
  useEffect(() => {
    if (updateMode) {
      let entities = benefitDetails.legal_entity.map(
        (entity: any) => entity.uuid,
      );
      setOnUpdateSelectedEntityList(entities);
      entityCostCenterCheckbox &&
        entities.length > 0 &&
        _fetchEntityCostCenterList({
          legal_entity_uuids: entities,
        });
    } else {
      entityCostCenterCheckbox &&
        selectedEntityList.length > 0 &&
        _fetchEntityCostCenterList({
          legal_entity_uuids: selectedEntityList,
        });
    }
  }, [selectedEntityList, entityCostCenterCheckbox, benefitDetails]);
  useEffect(() => {
    if (updateMode) {
      setEntityCostCenterCheckbox(
        benefitDetails?.is_default_to_entity_cost_centre || false,
      );
    }
  }, [benefitDetails]);
  useEffect(() => {
    try {
      if (updateMode) {
        const values: any = {
          ...benefitDetails,
          // legal_entity: (benefitDetails.legal_entity as any)?.id,
          // wage_type: (benefitDetails.wage_type as any)?.id,
        };

        let CurrentDate = moment();
        const taxPercentage = () => {
          let sortedTaxPercentage: any = values?.tax_percentages[0] || {};
          // eslint-disable-next-line no-unused-expressions
          values?.tax_percentages?.map((item: any) => {
            if (
              moment(item.as_of_date, 'DD/MM/YYYY') >
              moment(sortedTaxPercentage.as_of_date, 'DD/MM/YYYY')
            ) {
              if (
                moment(item.as_of_date, 'DD/MM/YYYY') >
                moment(CurrentDate, 'DD/MM/YYYY')
              ) {
                if (
                  moment(item.as_of_date, 'DD/MM/YYYY') <
                  moment(CurrentDate, 'DD/MM/YYYY')
                ) {
                  sortedTaxPercentage = item;
                }
              } else {
                sortedTaxPercentage = item;
              }
            }
          });

          return sortedTaxPercentage;
        };
        const taxPercentages = taxPercentage();

        if (values.legal_entity instanceof Array) {
          values.legal_entity_uuid = benefitDetails.legal_entity.map(
            (item: any) => item.uuid,
          );
        } else {
          values.legal_entity_uuid = (benefitDetails.legal_entity as any).uuid;
        }

        if (values.benefit_category instanceof Array) {
          values.benefit_category = benefitDetails.benefit_category.map(
            (item: any) => item.id,
          );
          setSelectedFlexibleBenefitCategoryList(values.benefit_category);
        } else {
          values.benefit_category = (benefitDetails.benefit_category as any).id;
          setSelectedFlexibleBenefitCategoryList(values.benefit_category);
        }

        values.cost_centres = benefitDetails.cost_centres?.map(
          (cc: any) => cc.id,
        );

        values.gl_account = values.gl_account?.id ? values.gl_account?.id : '';
        values.wage_type = values.wage_type?.id ? values.wage_type?.id : '';
        values.available_after = values.available_after?.code;
        values.available_after_period_unit =
          values.available_after_period_unit?.code;
        values.can_claim_for = values.can_claim_for?.code;
        values.entitlement_period_unit = values.entitlement_period_unit?.code;
        // values.entitlement_type = values.entitlement_type?.code;
        values.prorated_by = values.prorated_by?.code;
        values.deductible_component = values.deductible_component?.code;
        values.benefit_entitlement_period =
          values.benefit_entitlement_period?.code;
        values.frequency_unit = values.frequency_unit?.code;
        values.max_claims_per_entitlement_period =
          values.max_claims_per_entitlement_period?.code;
        values.proration = values.proration?.code;
        values.tax_percentage_as_of_date = taxPercentages.as_of_date
          ? moment(taxPercentages.as_of_date, 'DD/MM/YYYY')
          : null;
        values.tax_percentages = taxPercentages.tax_percentage
          ? taxPercentages.tax_percentage
          : 0;
        delete values.legal_entity;
        if (isClone) {
          delete values.title;
          delete values.code;
        }
        form.setFieldsValue(values);
        setFilteredBenefitCategoryDropdownList(values.legal_entity_uuid);

        if (benefitDetails.is_unlimited_no_claims) {
          form.setFieldsValue({
            is_unlimited_no_claims: true,
            restrict_no_of_claims_per_period: false,
          });
          onChangeSelectedClaim(1);
        } else {
          form.setFieldsValue({
            is_unlimited_no_claims: false,
            restrict_no_of_claims_per_period: true,
          });
          onChangeSelectedClaim(2);
        }
        onFieldChange('', '');
      } else {
        form.setFieldsValue({
          deductible_component: deductibleComponent[2]?.code,
        });
      }
    } catch (e) {}
  }, [deductibleComponent, benefitDetails, flexibleBenefitCategory]);

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
    // _fetchCostCentre();
    _fetchGLAccounts();
    _fetchDependentRelations();
    _fetchFlexibleBenefitCategory(1, 9999);
    _fetchBenefitTypeChoice('entitlement_period');
    _fetchBenefitTypeChoice('frequency_unit');
    _fetchBenefitTypeChoice('deductible_component');
    _fetchBenefitTypeChoice('max_claims_per_entitlement_period');
    _fetchBenefitTypeChoice('proration');
    onEntityCostCenterCheckboxClicked();
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

        return returnObj;
      } catch (e) {}
    },
    onClearBtnHandler: () => {
      onClearBtnHandler();
    },
  }));
  const setFilteredBenefitCategoryDropdownList = (entityList: any) => {
    let filterCategory: any[] = [];

    // eslint-disable-next-line array-callback-return
    entityList.map((entity: any) => {
      const result = flexibleBenefitCategory.filter((category: any) => {
        const selectedCategory = benefitDetails?.benefit_category?.find(
          (values: any) => category.id === values.id,
        );
        if (updateMode && selectedCategory && !selectedCategory.is_active) {
          return category?.legal_entity_uuid?.uuid === entity;
        } else {
          return (
            category?.legal_entity_uuid?.uuid === entity && category.is_active
          );
        }
      });
      filterCategory = [...filterCategory, ...result];
    });
    filterCategory.length === 0 && resetFlexibleCategoryTypeFields(false);
    setFilteredBenefitCategories(filterCategory);
  };
  const onClearBtnHandler = () => {
    try {
      const legal_entity = form.getFieldValue('legal_entity');
      form.resetFields();
      setSelectedEntityList([]);
      setSelectedFlexibleBenefitCategoryList([]);
      setSelectedDependentRelationList([]);
      form.setFieldsValue({
        is_unlimited_no_claims: true,
        restrict_no_of_claims_per_period: false,
      });
      onChangeSelectedClaim(1);
      if (updateMode) {
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
      if (Boolean(list.length)) {
        return list.map((item: any) => (
          <Select.Option value={item[key]} key={item[key]}>
            {item.title}
          </Select.Option>
        ));
      }
      return [];
    } catch (e) {
      return [];
    }
  };

  const handleEntitlementPeriodChange = (value: any) => {
    if (value === 'CD') {
      onChangeSelectedClaim(2);
      form.setFieldsValue({
        is_unlimited_no_claims: false,
        restrict_no_of_claims_per_period: true,
        frequency_unit: 'YER',
        max_no_of_claims_per_frequency: 1,
      });
    } else {
      onChangeSelectedClaim(1);
      form.setFieldsValue({
        is_unlimited_no_claims: true,
        restrict_no_of_claims_per_period: false,
      });
      form.resetFields(['frequency_unit', 'max_no_of_claims_per_frequency']);
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

  const resetForex = (checked: boolean) => {
    if (!checked) {
      form.setFieldsValue({
        is_allow_forex: false,
        is_forex_rate_editable_by_employee: false,
        forex_deviation_percentage: 0,
      });
    }
  };

  const resetForexRateEmployee = (checked: boolean) => {
    if (!checked) {
      form.setFieldsValue({
        is_forex_rate_editable_by_employee: false,
        forex_deviation_percentage: 0,
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
  const resetNoReceiptAttachFields = (checked: boolean) => {
    if (!checked) {
      form.setFieldsValue({
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
  const updateBenefitTypeEntityList = (value: any) => {
    setSelectedEntityList(value);
    form.setFieldsValue({
      legal_entity_uuid: value,
    });
  };
  const onEntityCostCenterCheckboxClicked = () => {
    const isEnable = form.getFieldValue('is_default_to_entity_cost_centre');
    setEntityCostCenterCheckbox(isEnable);
  };
  const updateBenefitTypeFlexibleCategoryList = (value: any) => {
    setSelectedFlexibleBenefitCategoryList(value);
    form.setFieldsValue({
      benefit_category: value,
    });
  };
  const updateDependentRelationsList = (value: any) => {
    setSelectedDependentRelationList(value);
    form.setFieldsValue({
      dependent_relationships: value,
    });
  };

  const resetBackdateFields = (checked: boolean) => {
    if (!checked) {
      form.setFieldsValue({
        allow_backdated_claims: false,
        backdated_claims_allowed_upto: undefined,
      });
    }
  };
  const resetFlexibleCategoryTypeFields = (checked: boolean) => {
    if (!checked) {
      form.setFieldsValue({
        is_allow_flexible_benefit: false,
        benefit_category: [],
      });
    } else {
    }
  };
  const resetDependentRelationTypeFields = (checked: boolean) => {
    if (!checked) {
      form.setFieldsValue({
        is_dependent_benefit: false,
        dependent_relationships: [],
      });
    } else {
    }
  };
  const onChangeClaims = (e: any) => {
    onChangeSelectedClaim(e.target.value);
    if (e.target.value === 1) {
      form.setFieldsValue({
        is_unlimited_no_claims: true,
        restrict_no_of_claims_per_period: false,
      });
    } else {
      form.setFieldsValue({
        is_unlimited_no_claims: false,
        restrict_no_of_claims_per_period: true,
      });
    }
  };
  const AllowingTaxAmountCheckbox = (checked: boolean, title: string) => {
    if (
      !form.getFieldValue('is_auto_populate_tax_amount') &&
      !form.getFieldValue('is_allow_updating_tax_amount')
    ) {
      if (!checked) {
        title === 'updatingTaxAmount' &&
          form.setFieldsValue({
            is_allow_updating_tax_amount: true,
          });

        title === 'populateTaxAmount' &&
          form.setFieldsValue({
            is_auto_populate_tax_amount: true,
          });
        message.destroy();
        message.error(
          '`Allow Auto Populate Tax Amount` And `Allow Updating Tax Amount` Both Field Cannot Be Unchecked',
        );
      }
    }
  };
  const onLegalEntityChange = (val: any) => {
    if (val.length === 0) {
      const isEnable = form.getFieldValue('is_default_to_entity_cost_centre');
      isEnable &&
        form.setFieldsValue({
          is_default_to_entity_cost_centre: false,
        });
    }
  };
  useEffect(() => {
    form.setFieldsValue({
      cost_centres_for_legal_entity: cost_centres_for_legal_entity,
    });
  }, [cost_centres_for_legal_entity]);
  const isDisabled = updateMode && !isClone;
  const loader = !isLoading && !idDataLoading ? false : true;

  const [visible, setVisible] = useState(false);
  /**
   * This function trigger after click on milage or entertainment previous rate button.
   * @function showPreviousRates
   * @param { string } _type : entertainment | mileage.
   * @param { MouseEvent<HTMLButtonElement> } _e : event object.
   * @returns { void }
   */
  const showPreviousRates = (
    _type: string,
    _e: MouseEvent<HTMLButtonElement>,
  ): void => {
    _returnUpdateRateTypeAction(_type);
    setVisible(true);
  };

  const [taxPercentagesTableData, setTaxPercentagesTableData] = useState<any>(
    [],
  );

  let taxPercentagesColumn = [
    {
      title: <Trans>Tax Percentage As Of Date</Trans>,
      dataIndex: 'as_of_date',
    },
    {
      title: <Trans>Tax Percentage</Trans>,
      dataIndex: 'tax_percentage',
    },
  ];

  useEffect(() => {
    const getSortedDataUsingDate = () => {
      let tableData: any = benefitDetails?.tax_percentages;

      // eslint-disable-next-line no-unused-expressions
      tableData?.sort((a: any, b: any) => {
        const _a = moment.isMoment(a.as_of_date)
          ? a.as_of_date
          : moment(a.as_of_date, ['DD/MM/YYYY']);
        const _b = moment.isMoment(b.as_of_date)
          ? b.as_of_date
          : moment(b.as_of_date, ['DD/MM/YYYY']);
        return _a.valueOf() - _b.valueOf(); //ascend
      });

      tableData = tableData?.map((o: any, i: number) => {
        return {
          ...o,
          key: i,
        };
      });

      return tableData;
    };

    const sortedDatePercentage = getSortedDataUsingDate();

    const taxPercentagesTableData = sortedDatePercentage?.map((o: any) => ({
      as_of_date: o.as_of_date,
      tax_percentage: Number(Number(o.tax_percentage).toFixed(2)),
    }));

    setTaxPercentagesTableData(taxPercentagesTableData);
  }, [benefitDetails]);
  return (
    <ErrorBoundary>
      <div className='benefits-configuration-form' ref={ref}>
        <Skeleton active={loader} loading={loader}>
          <Form
            form={form}
            // {...formLayout}
            size='middle'
            colon={false}
            autoComplete='off'
            initialValues={{
              is_unlimited_no_claims: true,
              restrict_no_of_claims_per_period: false,
              is_unlimited_amount: false,
              is_allow_internal_order_cost_centres: false,
              is_allow_3rd_party_vendor: false,
              can_attach_receipts: false,
              is_receipt_mandatory: false,
              is_display_no_receipt_attached_field: false,
              is_remark_for_no_receipt_mandatory: false,
              allow_remark: false,
              is_active: false,
              is_remark_mandatory: false,
              allow_backdated_claims: false,
              is_allow_flexible_benefit: false,
              is_dependent_benefit: false,
              is_allow_forex: false,
              is_forex_rate_editable_by_employee: false,
              is_allow_charging_to_cost_centres: false,
              is_default_to_employee_cost_centre: false,
              is_default_to_entity_cost_centre: false,
              is_allow_overseas_cost_centres: false,
              is_auto_populate_tax_amount: true,
              is_allow_updating_tax_amount: false,
              is_allow_supporting_documents: false,
              instruction_text: '',
              wage_type: '',
              gl_account: '',
              deductible_component: deductibleComponent[2]?.code,
              proration: proration[2]?.code,
              benefit_entitlement_period: '',
              forex_deviation_percentage: 0,
              grace_period_in_days: 0,
              resubmission_period_after_rejection_in_days: 0,
              tax_percentages: 0,
              tax_percentage_as_of_date: null,
              frequency_unit: '',
              max_no_of_claims_per_frequency: undefined,
            }}
            onValuesChange={onFieldChange}
            layout='vertical'
          >
            <div className='field-container'>
              <div className='label-header m-t-0'>
                <Trans>Benefit Type Details</Trans>
              </div>
              <Form.Item
                validateTrigger='onBlur'
                label={<Trans>Entity</Trans>}
                name='legal_entity_uuid'
                data-test='legal_entity'
                className='entity width-50'
                rules={[
                  {
                    required: true,
                    message: Errors.LEGAL_ENTITY_REQUIRED,
                  },
                ]}
              >
                <Select
                  allowClear
                  showSearch
                  style={style}
                  mode='multiple'
                  value={selectedEntityList}
                  defaultValue={selectedEntityList}
                  maxTagCount={3}
                  disabled={isDisabled}
                  onChange={(value: any) => {
                    let val = value;
                    if (value.includes('Select All')) {
                      val = entityList.map((o: any) => o.uuid);
                    } else if (value.includes('Deselect All')) {
                      val = [];
                    }
                    onLegalEntityChange(val);
                    updateBenefitTypeEntityList(val);
                  }}
                  filterOption={(input: any, option: any) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {selectedEntityList.length === entityList.length ? (
                    <Option value='Deselect All' key='Deselect All'>
                      Deselect All
                    </Option>
                  ) : (
                    <Option value='Select All' key='Select All'>
                      Select All
                    </Option>
                  )}
                  {entityList.map((o: any, i: number) => (
                    <Option value={o.uuid} key={`${o.title}_${i}}`}>
                      {o.title}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                validateTrigger='onBlur'
                label={<Trans>Title</Trans>}
                className='title width-50'
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
                  // justifyContent: 'space-between',
                  alignItems: 'flex-end',
                }}
              >
                <Form.Item
                  validateTrigger='onBlur'
                  label={<Trans>Code</Trans>}
                  className='code width-50'
                  name='code'
                  rules={[{ required: true, message: Errors.CODE_REQUIRED }]}
                  style={{ width: '100%' }}
                >
                  <Input
                    autoComplete='new-password'
                    disabled={isDisabled}
                    style={style}
                  />
                </Form.Item>
                {/* <Form.Item
                  name='is_active'
                  valuePropName='checked'
                  className='is-Active'
                >
                  <Checkbox disabled={isDisabled}>
                     <Trans>Is Active</Trans>
                  </Checkbox>
                </Form.Item> */}
              </div>
              <Form.Item
                label={<Trans>Entitlement Period</Trans>}
                className='width-50'
                name='benefit_entitlement_period'
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Select
                  disabled={isDisabled}
                  onChange={e => handleEntitlementPeriodChange(e)}
                >
                  {getOptions(entitlementPeriod)}
                </Select>
              </Form.Item>
              <Form.Item
                label={<Trans>Proration</Trans>}
                name='proration'
                className='width-50'
                rules={[
                  {
                    required: true,
                    message: Errors.PRORATION_REQUIRED,
                  },
                ]}
              >
                <Select>{getOptions(proration)}</Select>
              </Form.Item>
              <Form.Item
                label={<Trans>Deductible Component</Trans>}
                name='deductible_component'
                className='width-50'
                rules={[
                  {
                    message: Errors.DEDUCTIBLE_COMPONENT_REQUIRED,
                  },
                ]}
              >
                <Select disabled={isDisabled}>
                  {getOptions(deductibleComponent)}
                </Select>
              </Form.Item>

              <Form.Item
                name='restrict_no_of_claims_per_period'
                className='no-height'
              >
                {' '}
              </Form.Item>
              <Form.Item name='is_unlimited_no_claims'>
                <Radio.Group
                  onChange={e => onChangeClaims(e)}
                  value={selectedClaim}
                >
                  {ClaimsSelection.map((item: any) => (
                    <Radio
                      className='label-header'
                      value={item.id}
                      disabled={
                        (form.getFieldValue('benefit_entitlement_period') ===
                          'CD' &&
                          item.id === 1) ||
                        (updateMode &&
                          item.id === 1 &&
                          benefitDetails?.benefit_entitlement_period?.code ===
                            'CD' &&
                          !isClone) ||
                        (isClone &&
                          item.id === 1 &&
                          form.getFieldValue('benefit_entitlement_period') ===
                            'CD')
                      }
                    >
                      {item.title}
                    </Radio>
                  ))}
                  {}
                </Radio.Group>
                {selectedClaim === 2 && (
                  <Form.Item
                    label={<Trans>Frequency Unit</Trans>}
                    name='frequency_unit'
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                    // initialValue={'YER'}
                    className='width-50'
                  >
                    <Select>
                      {form.getFieldValue('benefit_entitlement_period') ===
                        'CD' ||
                      (updateMode &&
                        benefitDetails?.benefit_entitlement_period?.code ===
                          'CD' &&
                        !isClone) ||
                      (isClone &&
                        form.getFieldValue('benefit_entitlement_period') ===
                          'CD')
                        ? getOptions(frequencyUnit).filter(
                            item => item.key === 'YER',
                          )
                        : getOptions(frequencyUnit)}
                    </Select>
                  </Form.Item>
                )}
                {selectedClaim === 2 ? (
                  form.getFieldValue('frequency_unit') === 'ETP' &&
                  maxClaimPerEntitlementPeriodList.length ? (
                    <Form.Item
                      name='max_claims_for_entitlement_period'
                      label={
                        <Trans>Maximum number of claims for frequency</Trans>
                      }
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                      className='width-50'
                    >
                      <InputNumber style={{ width: '100%' }} min={1} />
                    </Form.Item>
                  ) : (
                    <Form.Item
                      name='max_no_of_claims_per_frequency'
                      label={
                        <Trans>Maximum number of claims per frequency</Trans>
                      }
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                      // initialValue={1}
                      className='width-50'
                    >
                      <InputNumber
                        style={{ width: '100%' }}
                        min={1}
                        disabled={
                          form.getFieldValue('benefit_entitlement_period') ===
                            'CD' ||
                          (updateMode &&
                            benefitDetails?.benefit_entitlement_period?.code ===
                              'CD' &&
                            !isClone) ||
                          (isClone &&
                            form.getFieldValue('benefit_entitlement_period') ===
                              'CD')
                        }
                      />
                    </Form.Item>
                  )
                ) : null}
                {selectedClaim === 2 &&
                  form.getFieldValue('benefit_entitlement_period') === 'CD' && (
                    <Form.Item
                      name='no_of_frequency'
                      label={<Trans>Number of years</Trans>}
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                      className='width-50'
                    >
                      <InputNumber style={{ width: '100%' }} min={1} />
                    </Form.Item>
                  )}
              </Form.Item>

              <CheckboxItem
                className='label-header'
                name='is_unlimited_amount'
                label={<Trans>Can Be Entitled For Unlimited Amount</Trans>}
              />
              <CheckboxItem
                className='label-header'
                name='is_only_for_confirmed_employee'
                label={<Trans>Confirmed Employee Only</Trans>}
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
                      onChange={resetNoReceiptAttachFields}
                    />
                    {form.getFieldValue(
                      'is_display_no_receipt_attached_field',
                    ) && (
                      <CheckboxItem
                        name='is_remark_for_no_receipt_mandatory'
                        label={<Trans>Remark For No Receipt Mandatory</Trans>}
                      />
                    )}
                  </div>
                )}
              </Form.Item>
              <Form.Item>
                <CheckboxItem
                  label={<Trans>Allow Forex</Trans>}
                  name='is_allow_forex'
                  className='label-header'
                  noStyle
                  onChange={resetForex}
                />
                {form.getFieldValue('is_allow_forex') && (
                  <CheckboxItem
                    name='is_forex_rate_editable_by_employee'
                    label={<Trans>Is Forex Rate Editable By Employee</Trans>}
                    onChange={resetForexRateEmployee}
                  />
                )}
                {form.getFieldValue('is_forex_rate_editable_by_employee') && (
                  <Form.Item
                    label={<Trans>Deviation Percentage</Trans>}
                    name='forex_deviation_percentage'
                    className='width-50'
                  >
                    <InputNumber
                      min={0}
                      max={100}
                      step={0.01}
                      precision={2}
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
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
                  label={<Trans>Flexible Category Type</Trans>}
                  name='is_allow_flexible_benefit'
                  className='label-header'
                  disabled={
                    updateMode
                      ? true
                      : filteredBenefitCategories.length > 0
                      ? false
                      : true
                  }
                  noStyle
                  onChange={resetFlexibleCategoryTypeFields}
                />
                {form.getFieldValue('is_allow_flexible_benefit') &&
                  filteredBenefitCategories.length > 0 && (
                    <Form.Item
                      validateTrigger='onBlur'
                      name='benefit_category'
                      data-test='benefit_category'
                      className='entity width-50'
                      rules={[
                        {
                          required: true,
                          message: 'Benefit Category Required',
                        },
                      ]}
                    >
                      <Select
                        showSearch
                        style={style}
                        mode='multiple'
                        value={selectedFlexibleBenefitCategoryList}
                        defaultValue={selectedFlexibleBenefitCategoryList}
                        maxTagCount={3}
                        // disabled={isDisabled}
                        onChange={(value: any) => {
                          let val = value;
                          if (value.includes('Select All')) {
                            val = filteredBenefitCategories?.map(
                              (o: any) => o.id,
                            );
                          } else if (value.includes('Deselect All')) {
                            const claimedArray: any = [];
                            // eslint-disable-next-line no-unused-expressions
                            filteredBenefitCategories?.map((o: any) => {
                              let isSelected = selectedFlexibleBenefitCategoryList.includes(
                                o.id,
                              );
                              const isClaimedAndSelected = benefitDetails?.benefit_category?.find(
                                (values: any) =>
                                  o.id === values.id &&
                                  o.is_benefit_claim_against_category,
                              );
                              if (
                                isSelected &&
                                (!o.is_active || isClaimedAndSelected)
                              ) {
                                claimedArray.push(o.id);
                              }
                            });
                            val = [...claimedArray];
                          }
                          updateBenefitTypeFlexibleCategoryList(val);
                        }}
                        filterOption={(input: any, option: any) =>
                          option.children
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        {selectedFlexibleBenefitCategoryList.length ===
                        filteredBenefitCategories?.length ? (
                          <Option value='Deselect All' key='Deselect All'>
                            Deselect All
                          </Option>
                        ) : (
                          <Option value='Select All' key='Select All'>
                            Select All
                          </Option>
                        )}
                        {filteredBenefitCategories?.map((o: any) => {
                          const isClaimedAndSelected = benefitDetails?.benefit_category?.find(
                            (values: any) => o.id === values.id,
                          );
                          return (
                            <Option
                              value={o.id}
                              key={`${o.id}`}
                              disabled={!o.is_active || isClaimedAndSelected}
                            >
                              {o.title}
                            </Option>
                          );
                        })}
                      </Select>
                    </Form.Item>
                  )}
              </Form.Item>
              <Form.Item>
                <CheckboxItem
                  label={<Trans>Dependent Relationship</Trans>}
                  name='is_dependent_benefit'
                  className='label-header'
                  noStyle
                  onChange={resetDependentRelationTypeFields}
                  disabled={updateMode ? true : false}
                />
                {form.getFieldValue('is_dependent_benefit') && (
                  <Form.Item
                    validateTrigger='onBlur'
                    name='dependent_relationships'
                    data-test='dependent_relationships'
                    className='entity width-50'
                    rules={[
                      {
                        required: true,
                        message: 'Dependent Relationship Required',
                      },
                    ]}
                  >
                    <Select
                      showSearch
                      style={style}
                      mode='multiple'
                      value={selectedDependentRelationList}
                      defaultValue={selectedDependentRelationList}
                      maxTagCount={3}
                      // disabled={isDisabled}
                      onChange={(value: any) => {
                        let val = value;
                        if (value.includes('Select All')) {
                          val = dependentRelations?.map((o: any) => o.id);
                        } else if (value.includes('Deselect All')) {
                          const claimedArray: any = [];
                          // eslint-disable-next-line no-unused-expressions
                          dependentRelations?.map((o: any) => {
                            let isSelected = selectedDependentRelationList.includes(
                              o.id,
                            );
                            const isClaimedAndSelected = benefitDetails?.dependent_relationships?.find(
                              (values: any) => o.id === values,
                            );
                            if (isSelected && isClaimedAndSelected) {
                              claimedArray.push(o.id);
                            }
                          });
                          val = [...claimedArray];
                        }
                        updateDependentRelationsList(val);
                      }}
                      filterOption={(input: any, option: any) =>
                        option.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {selectedDependentRelationList.length ===
                      dependentRelations?.length ? (
                        <Option value='Deselect All' key='Deselect All'>
                          Deselect All
                        </Option>
                      ) : (
                        <Option value='Select All' key='Select All'>
                          Select All
                        </Option>
                      )}
                      {dependentRelations?.map((o: any) => {
                        const isClaimedAndSelected = benefitDetails?.dependent_relationships?.find(
                          (values: any) => o.id === values,
                        );
                        return (
                          <Option
                            value={o.id}
                            key={`${o.id}`}
                            disabled={isClaimedAndSelected}
                          >
                            {o.title}
                          </Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
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
                    rules={[{ required: true }]}
                    required={true}
                  >
                    <InputNumber
                      placeholder='Backdated Claim Period In Days'
                      style={{ width: '30%' }}
                      min={0}
                      max={365}
                    />
                  </Form.Item>
                )}
              </Form.Item>
              <Form.Item
                name='resubmission_period_after_rejection_in_days'
                className='width-50'
                label={
                  <Trans>Resubmission Period After Rejection In Days</Trans>
                }
                rules={[{ required: true }]}
                required={true}
              >
                <InputNumber style={{ width: '100%' }} min={0} />
              </Form.Item>
              <Form.Item
                validateTrigger='onBlur'
                label={<Trans>Tax Percentage As Of Date</Trans>}
                name='tax_percentage_as_of_date'
                className='tax-percentage-as-of-date '
                rules={[
                  {
                    required: true,
                    message: Errors.TAX_PERCENTAGE_AS_OF_DATE_REQUIRED,
                  },
                ]}
              >
                <DatePicker
                  allowClear
                  style={{ width: '50%' }}
                  format='DD/MM/YYYY'
                />
              </Form.Item>
              <Form.Item
                label={
                  <div className='custom-label'>
                    <Trans>Tax Percentage</Trans>
                    {updateMode && !isClone ? (
                      <Button
                        className='previous-rates-btn'
                        type='link'
                        onClick={showPreviousRates.bind(null, 'tax_Percentage')}
                      >
                        <span className='underline-text'>
                          <Trans>Previous Tax Rates</Trans>
                        </span>
                      </Button>
                    ) : null}
                  </div>
                }
                name='tax_percentages'
                className='width-50'
                rules={[
                  {
                    required: form.getFieldValue('tax_percentage_as_of_date')
                      ? true
                      : false,
                    message: Errors.TAX_PERCENTAGE_REQUIRED,
                  },
                ]}
              >
                <InputNumber style={{ width: '100%' }} min={0} />
              </Form.Item>
              <CheckboxItem
                className='label-header'
                name='is_allow_updating_tax_amount'
                label={<Trans>Allow Updating Tax Amount</Trans>}
                onChange={value =>
                  AllowingTaxAmountCheckbox(value, 'updatingTaxAmount')
                }
              />
              <CheckboxItem
                className='label-header'
                name='is_auto_populate_tax_amount'
                label={<Trans>Auto Populate Tax Amount</Trans>}
                onChange={value =>
                  AllowingTaxAmountCheckbox(value, 'populateTaxAmount')
                }
              />
              <Form.Item>
                <CheckboxItem
                  label={<Trans>Allow Charging To Cost Centres</Trans>}
                  name='is_allow_charging_to_cost_centres'
                  noStyle
                  className='label-header'
                />
                {form.getFieldValue('is_allow_charging_to_cost_centres') &&
                  !form.getFieldValue('is_default_to_entity_cost_centre') && (
                    <div>
                      <CheckboxItem
                        name='is_default_to_employee_cost_centre'
                        label={<Trans>Default To Employee Cost Centre</Trans>}
                        onChange={() =>
                          form.setFieldsValue({ cost_centres: [] })
                        }
                      />
                    </div>
                  )}
                {!form.getFieldValue('is_default_to_employee_cost_centre') &&
                  form.getFieldValue('is_allow_charging_to_cost_centres') && (
                    <>
                      <div>
                        <CheckboxItem
                          name='is_default_to_entity_cost_centre'
                          label={<Trans>Custom Cost Centre</Trans>}
                          onChange={() => {
                            form.setFieldsValue({ cost_centres: [] });
                            onEntityCostCenterCheckboxClicked();
                          }}
                          disabled={
                            onUpdateSelectedEntityList.length > 0 ||
                            selectedEntityList.length > 0
                              ? false
                              : true
                          }
                        />
                      </div>
                      {form.getFieldValue(
                        'is_default_to_entity_cost_centre',
                      ) && (
                        <Card title='Entity wise Cost Center' bordered>
                          {entityCostCenterLoader ? (
                            <Loader loadingName='Fetching Cost Center' />
                          ) : (
                            <div className='custom-cost-center'>
                              <Form.List name='cost_centres_for_legal_entity'>
                                {fields => {
                                  return (
                                    <>
                                      {fields.map(field => {
                                        return (
                                          <Row
                                            gutter={[16, 16]}
                                            className='upto-distance'
                                            key={field.fieldKey}
                                          >
                                            <Col span={11}>
                                              <Form.Item
                                                {...field}
                                                name={[
                                                  field.name,
                                                  'legal_entity',
                                                ]}
                                                fieldKey={
                                                  [
                                                    field.fieldKey,
                                                    'legal_entity',
                                                  ] as any
                                                }
                                                label='Entity'
                                                required
                                              >
                                                <Input
                                                  disabled={true}
                                                  type='text'
                                                />
                                              </Form.Item>
                                            </Col>
                                            <Col span={11}>
                                              <Form.Item
                                                {...field}
                                                name={[
                                                  field.name,
                                                  'cost_centre',
                                                ]}
                                                fieldKey={
                                                  [
                                                    field.fieldKey,
                                                    'cost_centre',
                                                  ] as any
                                                }
                                                label='Cost Center'
                                                required
                                                rules={[
                                                  {
                                                    required: true,
                                                    message:
                                                      'Cost Centre is required',
                                                  },
                                                ]}
                                              >
                                                <Select
                                                  showSearch={true}
                                                  filterOption={(
                                                    input: any,
                                                    option: any,
                                                  ) =>
                                                    option.children
                                                      .toLowerCase()
                                                      .indexOf(
                                                        input.toLowerCase(),
                                                      ) >= 0
                                                  }
                                                  onChange={(value: any) => {
                                                    _updateCostCenterForEntity(
                                                      value,
                                                      field.fieldKey,
                                                    );
                                                  }}
                                                >
                                                  {entityCostCenterList[
                                                    field.fieldKey
                                                  ]?.cost_centres.map(
                                                    (o: any) => (
                                                      <Option
                                                        key={o.id}
                                                        value={o.cc_uuid}
                                                      >
                                                        {o.title}
                                                      </Option>
                                                    ),
                                                  )}
                                                </Select>
                                              </Form.Item>
                                            </Col>
                                          </Row>
                                        );
                                      })}
                                    </>
                                  );
                                }}
                              </Form.List>
                            </div>
                          )}
                        </Card>
                      )}
                    </>
                  )}
                {!form.getFieldValue('is_default_to_employee_cost_centre') &&
                  !form.getFieldValue('is_default_to_entity_cost_centre') &&
                  form.getFieldValue('is_allow_charging_to_cost_centres') && (
                    <div>
                      <Form.Item
                        name='local_cc_threshold_amount'
                        label={
                          <Trans>Local Cost Center Threshold Amount</Trans>
                        }
                      >
                        <InputNumber
                          style={{ width: '50%' }}
                          min={0}
                          maxLength={15}
                        />
                      </Form.Item>
                      <Form.Item>
                        <CheckboxItem
                          name='is_allow_overseas_cost_centres'
                          label={
                            <Trans>
                              Allow Charging To Overseas Cost Center
                            </Trans>
                          }
                        />
                        {form.getFieldValue(
                          'is_allow_overseas_cost_centres',
                        ) && (
                          <Form.Item
                            name='overseas_cc_threshold_amount'
                            label={
                              <Trans>
                                Overseas Cost Center Threshold Amount
                              </Trans>
                            }
                          >
                            <InputNumber
                              style={{ width: '50%' }}
                              min={0}
                              maxLength={15}
                            />
                          </Form.Item>
                        )}
                      </Form.Item>
                      <CheckboxItem
                        name='is_allow_internal_order_cost_centres'
                        label={
                          <Trans>Can Allow Internal Order Cost Center</Trans>
                        }
                      />
                      <CheckboxItem
                        name='is_allow_3rd_party_vendor'
                        label={<Trans>Can Allow Third Party Vendor</Trans>}
                      />
                    </div>
                  )}
              </Form.Item>

              <div>
                <div className='label-header'>
                  <Trans>Other Details</Trans>
                </div>
              </div>
              <div className='width-80-per'>
                <Form.Item
                  name='instruction_text'
                  label={<Trans>Instruction Text</Trans>}
                  className='width-80-per instruction-text-section'
                  rules={[
                    () => ({
                      validator(_, value) {
                        if (!value) {
                          return Promise.resolve();
                        }
                        let text = value.replace(/(<([^>]+)>)/gi, '');
                        text = text.trim();
                        if (text) {
                          if (
                            String(text.match(/[^=@+\-!#﹘—⸺⸻].*/g)) === text
                          ) {
                            return Promise.resolve();
                          } else {
                            return Promise.reject(
                              new Error(
                                'Can not start with special characters.',
                              ),
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
                <Form.Item>
                  <CheckboxItem
                    name='is_allow_supporting_documents'
                    label={<Trans>Allow Supporting Documents</Trans>}
                  />
                  <Form.Item
                    name='grace_period_in_days'
                    label={<Trans>Grace Period In Days</Trans>}
                    style={{
                      width: 'calc(33% - 12px)',
                      marginRight: '12px',
                      display: 'inline-block',
                    }}
                    rules={[
                      { required: true, message: Errors.GRACE_PERIOD_REQUIRED },
                    ]}
                    required={true}
                  >
                    <InputNumber style={{ width: '100%' }} min={0} />
                  </Form.Item>
                  {!form.getFieldValue('is_allow_flexible_benefit') && (
                    <Form.Item
                      label={<Trans>Wage Type</Trans>}
                      name='wage_type'
                      style={{
                        width: 'calc(33% - 12px)',
                        display: 'inline-block',
                        marginLeft: '12px',
                      }}
                    >
                      <Select
                        style={style}
                        allowClear
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
                  )}

                  <Form.Item
                    label={<Trans>GL Account</Trans>}
                    name='gl_account'
                    style={{
                      width: 'calc(33% - 12px)',
                      display: 'inline-block',
                      marginLeft: '12px',
                    }}
                  >
                    <Select
                      style={style}
                      allowClear
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
            </div>
          </Form>
          {updateMode ? (
            <AppDrawer
              visible={visible}
              title={<Trans>Previous Tax Rates</Trans>}
              data-test='previous_rates_drawer'
              OkText='Close'
              showCancelButton={false}
              onOkClick={() => {
                setVisible(false);
              }}
            >
              {drawerVisibility ? (
                <Table
                  data-test='tax-percentages-table'
                  columns={taxPercentagesColumn}
                  dataSource={taxPercentagesTableData}
                  pagination={{
                    hideOnSinglePage: true,
                  }}
                  bordered
                />
              ) : null}
              <br />
            </AppDrawer>
          ) : null}
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

const mapStateToProps = (state: any) => {
  const {
    rate_type,
    dependentRelations,
    flexibleBenefitCategory,
    entityCostCenterList,
    entityCostCenterLoader,
    cost_centres_for_legal_entity,
  } = state.benefitConfig;
  return {
    rate_type,
    dependentRelations,
    flexibleBenefitCategory,
    entityCostCenterList,
    entityCostCenterLoader,
    cost_centres_for_legal_entity,
    entityList: getBenefitEntities(state),
    wageTypeList: getBenefitWageTypes(state),
    costCentreList: getCostCentre(state),
    error: getBenefitTypeErrorMessage(state),
    success: getBenefitTypeSuccessMessage(state),
    expenseTypes: getBenefitExpenseTypes(state),
    isLoading: getBenefitTypeLoader(state),
    idDataLoading: getBenefitTypeDataLoading(state),
    benefitDetails: getBenefitTypeExpandedItem(state),
    glAccountList: getGlAccounts(state),
    entitlementTypes: getBenefitTypeEntitlementTypes(state),
    entitlementPeriodUnit: getBenefitTypeEntitlementPeriodUnit(state),
    availableAfter: getBenefitTypeAvailableAfter(state),
    availableAfterUnit: getBenefitTypeAvailableAfterPeriod(state),
    canClaimFor: getBenefitTypeCanClaimFor(state),
    proratedBy: getBenefitTypeProratedBy(state),
    entitlementPeriod: getBenefitTypeEntitlementPeriod(state),
    frequencyUnit: getBenefitTypeFrequencyUnit(state),
    maxClaimPerEntitlementPeriodList:
      state.benefitConfig.maxClaimPerEntitlementPeriodList,
    deductibleComponent: getBenefitTypeDeductibleComponent(state),
    proration: getBenefitTypeProration(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  _fetchEntities: () => dispatch(fetchEntities()),
  _fetchFlexibleBenefitCategory: (pageNumber: any, pageSize: any) =>
    dispatch(fetchFlexibleBenefitCategory(pageNumber, pageSize)),
  _fetchDependentRelations: () => dispatch(fetchDependentRelations()),
  _fetchWageTypes: () => dispatch(fetchWageTypes()),
  _fetchCostCentre: () => dispatch(fetchCostCentres()),
  _createBenefitType: (body: any) => dispatch(createBenefitType(body)),
  _fetchExpenseTypes: () => dispatch(fetchExpenseTypes()),
  _fetchGLAccounts: () => dispatch(fetchGlAccounts()),
  _fetchBenefitTypeChoice: (choice: BENEFIT_CHOICES) =>
    dispatch(fetchBenefitChoices(choice)),
  _fetchEntityCostCenterList: (entities: any) =>
    dispatch(fetchEntityCostCenterList(entities)),
  _updateCostCenterForEntity: (uuid: any, index: any) =>
    dispatch(updateCostCenterForEntity(uuid, index)),
  _returnUpdateRateTypeAction: (_val: string) =>
    dispatch(returnUpdateRateTypeAction(_val)),
});

const connector = connect(mapStateToProps, mapDispatchToProps, null, {
  forwardRef: true,
});

export default memo(connector(BenefitConfigurationForm));
