/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { FC, Dispatch, memo } from 'react';

import { ConnectedProps, connect } from 'react-redux';
import {
  Select,
  Button,
  Tabs,
  Empty,
  Checkbox,
  InputNumber,
  Form,
  Row,
  Col,
} from 'antd';

import EntitlementRuleCondition from './entitlementRuleCondition.index';
import EntitlementRuleSectionPreview from './entitlementRuleSectionPreview';

import {
  getCurrentSectionDataForEntitlement,
  getDrawerActionForEntitlement,
  getLegalEntitiesForEntitlement,
  getSelectedProcessTypeForEntitlement,
  getCurrentReadableSectionDataForEntitlement,
  getDrawerForEntitlement,
} from '../../../../../../shared/redux/rootReducer';

import {
  setCurrSecEntitiesForEntitlement,
  setCurrReadSecEntitiesForEntitlement,
  addNewOrCriteriaForEntitlement,
  removeOrCriteriaForEntitlement,
  addNewAndCriteriaForEntitlement,
  addEntitlementRuleFields,
  addCustomCaseForEntitlement,
  addCustomCaseConditionForEntitlement,
  removeCustomCaseForEntitlement,
  setIsNoEntitlement,
  moveCustomCaseUp,
  moveCustomCaseDown,
} from '../../../../../../shared/redux/entitlementRule/addUpdateEntitlementRule/addUpdateEntitlementRule.action';
import { Trans } from '@lingui/macro';
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import './addUpdateEntitlementRule.index.less';

const { Option } = Select;
const { TabPane } = Tabs;
const rowGutter: [number, number] = [16, 8];

const mapStateToProps = (state: any, ownProps: any) => ({
  legalEntitiesForEntitlement: getLegalEntitiesForEntitlement(state),

  currentSectionDataForEntitlement: getCurrentSectionDataForEntitlement(state),
  getCurrentReadableSectionDataForEntitlement: getCurrentReadableSectionDataForEntitlement(
    state,
  ),
  getDrawerForEntitlement: getDrawerForEntitlement(state),
  drawerActionForEntitlement: getDrawerActionForEntitlement(state),
  selectedProcessTypeForEntitlement: getSelectedProcessTypeForEntitlement(
    state,
  ),
  tabActiveKey: ownProps.tabActiveKey,
  onSetTabActiveKey: ownProps.onSetTabActiveKey,
  benefitTypeConfig: state.addUpdateEntitlementRule,
  form: ownProps.form,
});

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  setCurrSecEntitiesForEntitlement: (payload: any) =>
    dispatch(setCurrSecEntitiesForEntitlement(payload)),
  setCurrReadSecEntitiesForEntitlement: (payload: any) =>
    dispatch(setCurrReadSecEntitiesForEntitlement(payload)),
  addNewOrCriteriaForEntitlement: () =>
    dispatch(addNewOrCriteriaForEntitlement()),
  removeOrCriteriaForEntitlement: ({
    toBeRemovedIndex,
  }: {
    toBeRemovedIndex: number;
  }) => dispatch(removeOrCriteriaForEntitlement({ toBeRemovedIndex })),
  addNewAndCriteriaForEntitlement: ({
    criteriaIndex,
  }: {
    criteriaIndex: number;
  }) => dispatch(addNewAndCriteriaForEntitlement({ criteriaIndex })),
  addEntitlementRuleFields: ({
    fieldType,
    fieldValue,
  }: {
    fieldType: string;
    fieldValue: any;
  }) => dispatch(addEntitlementRuleFields({ fieldType, fieldValue })),
  addCustomCaseForEntitlement: () => dispatch(addCustomCaseForEntitlement()),
  addCustomCaseConditionForEntitlement: ({
    caseIndex,
  }: {
    caseIndex: number;
  }) => dispatch(addCustomCaseConditionForEntitlement({ caseIndex })),
  removeCustomCaseForEntitlement: ({
    toBeRemovedIndex,
  }: {
    toBeRemovedIndex: number;
  }) => dispatch(removeCustomCaseForEntitlement({ toBeRemovedIndex })),
  // setIsNoEntitlement: (value: boolean) => dispatch(setIsNoEntitlement(value)),
  setIsNoEntitlement: ({
    value,
    is_unlimited_amount,
  }: {
    value: boolean;
    is_unlimited_amount: boolean;
  }) => dispatch(setIsNoEntitlement({ value, is_unlimited_amount })),
  moveCustomCaseUp: (index: number) => dispatch(moveCustomCaseUp(index)),
  moveCustomCaseDown: (index: number) => dispatch(moveCustomCaseDown(index)),
});

const EntitlementRuleTabsCustom: FC<ConnectedProps<
  typeof connector
>> = props => {
  const { benefitTypeConfig, selectedProcessTypeForEntitlement, form } = props;
  const config = benefitTypeConfig.selectedBenefitTypeConfig;
  const category = config?.benefit_category;
  const onEntityDropdownChange = (uuids: any[], uuidTitles: any) => {
    uuidTitles = uuidTitles.map((i: any) => i.children);
    props.setCurrSecEntitiesForEntitlement({ uuids });
    props.setCurrReadSecEntitiesForEntitlement({ uuidTitles });
    setIsUpdatedEntities(true);
  };

  const [filteredCategoryList, setfilteredCategoryList] = useState(category);
  const selectAllEntities = () => {
    const allUuids = props.legalEntitiesForEntitlement.map(
      (item: any) => item.uuid,
    );
    const allTitles = props.legalEntitiesForEntitlement.map(
      (item: any) => item.title,
    );

    props.setCurrSecEntitiesForEntitlement({ uuids: allUuids });
    props.setCurrReadSecEntitiesForEntitlement({ uuidTitles: allTitles });
    setIsUpdatedEntities(true);
  };

  const deSelectAllEntities = () => {
    props.setCurrSecEntitiesForEntitlement({ uuids: [] });
    props.setCurrReadSecEntitiesForEntitlement({ uuidTitles: [] });
    setIsUpdatedEntities(true);
  };

  // let customCasesContainer = null;
  // if (props.selectedProcessType === 'EXPAPR') {
  // let customCasesContainer = (
  //   <div>
  //     <Button type='link' onClick={() => props.addCustomCaseForEntitlement()}>
  //       + Add a new custom case
  //     </Button>
  //   </div>
  // );
  // }
  const ruleFieldsOnChange = (val: number | boolean, type: string) => {
    props.addEntitlementRuleFields({
      fieldType: type,
      fieldValue: val,
    });
  };

  useEffect(() => {
    if (
      config?.is_allow_flexible_benefit &&
      props?.currentSectionDataForEntitlement?.rule?.is_no_entitlement
    ) {
      props.addEntitlementRuleFields({
        fieldType: 'flexible_benefit_category',
        fieldValue: [],
      });
    }
  }, [config, props.currentSectionDataForEntitlement.rule.is_no_entitlement]);
  useEffect(() => {
    form &&
      form.setFieldsValue({
        flexible_benefit_category:
          props?.currentSectionDataForEntitlement?.rule?.fields
            ?.flexible_benefit_category,
      });
  }, [
    props?.currentSectionDataForEntitlement?.rule?.fields
      ?.flexible_benefit_category,
  ]);

  useEffect(() => {
    let amount =
      props?.currentSectionDataForEntitlement?.rule?.fields.amount ||
      props?.currentSectionDataForEntitlement?.rule?.is_unlimited_amount;
    const flexibleCategory =
      props.currentSectionDataForEntitlement.rule.fields
        ?.flexible_benefit_category || [];
    const updatedFlexibleCategory = flexibleCategory.map((value: any) => {
      let budget = value.category_budget;
      let minBudget = value.category_min_amount;
      let maxBudget = value.category_max_amount;
      if (amount < budget) {
        budget = amount;
      }
      if (maxBudget > budget) {
        maxBudget = budget;
      }
      if (minBudget > maxBudget) {
        minBudget = maxBudget;
      }
      return {
        ...value,
        category_budget: budget,
        category_min_amount: minBudget,
        category_max_amount: maxBudget,
      };
    });
    props.addEntitlementRuleFields({
      fieldType: 'flexible_benefit_category',
      fieldValue: updatedFlexibleCategory,
    });
  }, [props?.currentSectionDataForEntitlement?.rule?.fields.amount]);

  const addNewRow = (fields: any) => {
    return (
      <Form.Item noStyle>
        <Button
          onClick={() => onAddAnother()}
          type='link'
          className='add-btn-container'
          disabled={filteredCategoryList?.length === fields?.length}
        >
          <PlusOutlined style={{ fontSize: 12, marginRight: 6 }} />
          <Trans>Add Category Budget</Trans>
        </Button>
      </Form.Item>
    );
  };

  const handleFlexibleBenefit = (fieldKey: number, value: any, from: any) => {
    let updatedValue = [
      ...props.currentSectionDataForEntitlement.rule.fields
        .flexible_benefit_category,
    ];
    if (from === 'category_budget') {
      if (updatedValue[fieldKey].category_max_amount > value) {
        updatedValue[fieldKey].category_max_amount = value;
      }
    }
    if (from === 'category_max_amount' || from === 'category_budget') {
      if (updatedValue[fieldKey].category_min_amount > value) {
        updatedValue[fieldKey].category_min_amount = value;
      }
    }

    updatedValue[fieldKey][from] = value;
    props.addEntitlementRuleFields({
      fieldType: 'flexible_benefit_category',
      fieldValue: updatedValue,
    });
  };

  const onAddAnother = () => {
    let newValues = [
      {
        category_id: null,
        category_budget: 1,
        category_min_amount: 1,
        category_max_amount: 1,
      },
    ];

    if (
      props.currentSectionDataForEntitlement.rule.fields
        .flexible_benefit_category
    ) {
      let newRow = [
        ...props.currentSectionDataForEntitlement.rule.fields
          .flexible_benefit_category,
      ];
      newValues = [...newRow, ...newValues];
    }
    props.addEntitlementRuleFields({
      fieldType: 'flexible_benefit_category',
      fieldValue: newValues,
    });
    // add();
  };
  const onRemoveCall = (fieldKey: any) => {
    let categories = [
      ...props.currentSectionDataForEntitlement.rule.fields
        .flexible_benefit_category,
    ];
    categories.splice(fieldKey, 1);
    props.addEntitlementRuleFields({
      fieldType: 'flexible_benefit_category',
      fieldValue: categories,
    });
  };
  const OnTabChange = async (key: any) => {
    try {
      await form.validateFields();
      props.onSetTabActiveKey(key);
    } catch (error) {
      console.warn(error);
      return Promise.reject(error);
    }
  };

  const [isUpdatedEntities, setIsUpdatedEntities] = useState(false);

  useEffect(() => {
    let selectedEntity = props?.currentSectionDataForEntitlement?.entities;
    let filterList: any = category?.filter((val: any) =>
      selectedEntity.includes(val.legal_entity_uuid),
    );
    if (
      props?.currentSectionDataForEntitlement?.entities.length === 0 &&
      filterList === 0
    ) {
      setfilteredCategoryList(category);
    } else {
      setfilteredCategoryList(filterList);
      if (
        props.currentSectionDataForEntitlement.rule.fields
          .flexible_benefit_category &&
        isUpdatedEntities
      ) {
        let selectedDataforFlexibleBenefit = [
          ...props.currentSectionDataForEntitlement.rule.fields
            .flexible_benefit_category,
        ];
        let updatedFilterdList = selectedDataforFlexibleBenefit.filter(
          (val: any) => {
            const isFind = filterList.find(
              (value: any) => value.id === val.category_id,
            );
            return isFind;
          },
        );

        props.addEntitlementRuleFields({
          fieldType: 'flexible_benefit_category',
          fieldValue: updatedFilterdList,
        });
        setIsUpdatedEntities(false);
      }
    }
  }, [props?.currentSectionDataForEntitlement?.entities]);

  return (
    <Tabs
      activeKey={props.tabActiveKey}
      onChange={(key: string) => OnTabChange(key)}
    >
      <TabPane tab='Entities' key='1'>
        <Button type='link' onClick={selectAllEntities}>
          <Trans>Select All</Trans>
        </Button>
        <Button type='link' onClick={deSelectAllEntities}>
          <Trans>Clear</Trans>
        </Button>
        <Select
          mode='multiple'
          showSearch
          style={{ width: '100%' }}
          placeholder='Select entities'
          optionFilterProp='children'
          onChange={(uuids: any[], uuidsTitle: any) =>
            onEntityDropdownChange(uuids, uuidsTitle)
          }
          value={props.currentSectionDataForEntitlement.entities}
        >
          {props.legalEntitiesForEntitlement.map((item: any, index: number) => {
            return (
              <Option key={index} value={item.uuid}>
                {item.title}
              </Option>
            );
          })}
        </Select>
      </TabPane>

      <TabPane tab='Conditions' key='2'>
        {props.currentSectionDataForEntitlement.criterias?.length === 0 && (
          <Empty description={<span>No conditions found.</span>}>
            <Button
              type='link'
              onClick={() => props.addNewOrCriteriaForEntitlement()}
            >
              + Add a new condition
            </Button>
          </Empty>
        )}

        {props.currentSectionDataForEntitlement.criterias?.map(
          (criteriaItem: any, criteriaIndex: number) => {
            return (
              <div key={criteriaIndex}>
                {criteriaIndex !== 0 && (
                  <div style={{ margin: '8px 0 8px 8px', fontWeight: 'bold' }}>
                    OR
                  </div>
                )}
                <table className='rules-table'>
                  <thead>
                    <tr>
                      <th className='col1'>Option</th>
                      <th className='col2'>Operator</th>
                      <th className='col3'>Value</th>
                      <th className='col4'>
                        <Button
                          type='link'
                          onClick={() =>
                            props.removeOrCriteriaForEntitlement({
                              toBeRemovedIndex: criteriaIndex,
                            })
                          }
                        >
                          x
                        </Button>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {criteriaItem?.map(
                      (conditionItem: any, conditionIndex: number) => {
                        return (
                          <EntitlementRuleCondition
                            key={conditionIndex}
                            conditionIndex={conditionIndex}
                            criteriaIndex={criteriaIndex}
                            conditionItem={conditionItem}
                          />
                        );
                      },
                    )}
                  </tbody>
                </table>
                <Button
                  type='link'
                  onClick={() =>
                    props.addNewAndCriteriaForEntitlement({ criteriaIndex })
                  }
                >
                  + Add an AND condition
                </Button>
              </div>
            );
          },
        )}

        {props.currentSectionDataForEntitlement.criterias?.length > 0 && (
          <Button
            type='dashed'
            onClick={() => props.addNewOrCriteriaForEntitlement()}
            style={{ marginTop: '24px' }}
          >
            Add an OR condtion
          </Button>
        )}
      </TabPane>

      <TabPane tab={<Trans>Rules</Trans>} key='3'>
        <div style={{ marginBottom: '12px' }}>
          <Checkbox
            checked={
              !props.currentSectionDataForEntitlement.rule.is_no_entitlement
            }
            onChange={(event: any) => {
              props.setIsNoEntitlement({
                value: !event.target.checked,
                is_unlimited_amount: config.is_unlimited_amount,
              });
            }}
          >
            <span style={{ fontWeight: 'bold' }}>Is Entitlement:</span>
          </Checkbox>
        </div>
        {!props.currentSectionDataForEntitlement.rule.is_no_entitlement && (
          <>
            <div style={{ width: '50%' }}>
              {selectedProcessTypeForEntitlement === 'EXP' && (
                <div style={{ marginBottom: '12px' }}>
                  <Checkbox
                    checked={
                      props.currentSectionDataForEntitlement.rule.fields
                        .is_unlimited_amount
                    }
                    onChange={(event: any) => {
                      props.setIsNoEntitlement({
                        value:
                          props.currentSectionDataForEntitlement.rule
                            .is_no_entitlement,
                        is_unlimited_amount: event.target.checked,
                      });
                    }}
                  >
                    <span style={{ fontWeight: 'bold' }}>
                      Is Unlimited Amount:
                    </span>
                  </Checkbox>
                </div>
              )}
              {selectedProcessTypeForEntitlement !== 'EXP' && (
                <>
                  {config.is_unlimited_amount ||
                  props.currentSectionDataForEntitlement.rule.fields
                    .is_unlimited_amount ? (
                    <div style={{ marginBottom: '12px' }}>
                      <div style={{ fontWeight: 'bold' }}>Amount:</div>
                      <div>Unlimited Amount Applicable</div>
                    </div>
                  ) : (
                    <div style={{ marginBottom: '12px' }}>
                      <div style={{ fontWeight: 'bold' }}>Amount:</div>
                      <InputNumber
                        style={{ width: '100%' }}
                        min={0}
                        maxLength={15}
                        // max=10
                        // step='0.01'
                        precision={2}
                        value={
                          props.currentSectionDataForEntitlement.rule.fields
                            .amount
                        }
                        onChange={(val: number) =>
                          ruleFieldsOnChange(val, 'amount')
                        }
                        disabled={config.is_unlimited_amount}
                      />
                    </div>
                  )}
                </>
              )}
              {(config.is_unlimited_amount ||
                props.currentSectionDataForEntitlement.rule.fields
                  .is_unlimited_amount) &&
              selectedProcessTypeForEntitlement === 'EXP' ? (
                <div style={{ marginBottom: '12px' }}>
                  <div>Unlimited Amount Applicable</div>
                </div>
              ) : (
                <>
                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ fontWeight: 'bold' }}>Max amount:</div>
                    <InputNumber
                      style={{ width: '100%' }}
                      min={1}
                      maxLength={15}
                      max={
                        !config.is_unlimited_amount &&
                        selectedProcessTypeForEntitlement !== 'EXP' &&
                        props.currentSectionDataForEntitlement.rule.fields
                          .amount
                      }
                      // step='0.01'
                      precision={2}
                      value={
                        props.currentSectionDataForEntitlement.rule.fields
                          .max_amount
                      }
                      onChange={(val: any) => {
                        return ruleFieldsOnChange(val, 'max_amount');
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ fontWeight: 'bold' }}>Min amount:</div>
                    <InputNumber
                      style={{ width: '100%' }}
                      min={1}
                      maxLength={15}
                      max={
                        props.currentSectionDataForEntitlement.rule.fields
                          .max_amount
                      }
                      // step='0.01'
                      precision={2}
                      value={
                        props.currentSectionDataForEntitlement.rule.fields
                          .min_amount
                      }
                      onChange={(val: number) =>
                        ruleFieldsOnChange(val, 'min_amount')
                      }
                    />
                  </div>
                </>
              )}
              {selectedProcessTypeForEntitlement !== 'EXP' && (
                <>
                  {config.deductible_component?.code === 'COP' && (
                    <div style={{ marginBottom: '12px' }}>
                      <div style={{ fontWeight: 'bold' }}>Copay value:</div>
                      <InputNumber
                        style={{ width: '100%' }}
                        min={0}
                        maxLength={15}
                        max={
                          !config.is_unlimited_amount &&
                          props.currentSectionDataForEntitlement.rule.fields
                            .amount
                        }
                        // step='0.01'
                        precision={2}
                        value={
                          props.currentSectionDataForEntitlement.rule.fields
                            .copay_value
                        }
                        onChange={(val: number) =>
                          ruleFieldsOnChange(val, 'copay_value')
                        }
                      />
                    </div>
                  )}

                  {config.deductible_component?.code === 'PAY' && (
                    <div style={{ marginBottom: '12px' }}>
                      <div style={{ fontWeight: 'bold' }}>Payable percent:</div>
                      <InputNumber
                        style={{ width: '100%' }}
                        min={0}
                        max={100}
                        // step='0.01'
                        precision={2}
                        parser={(value: any) => value.split('.')[0] as any}
                        value={
                          props.currentSectionDataForEntitlement.rule.fields
                            .payable_percent
                        }
                        onChange={(val: number) =>
                          ruleFieldsOnChange(val, 'payable_percent')
                        }
                      />
                    </div>
                  )}
                </>
              )}
            </div>

            {config.is_allow_flexible_benefit && (
              <Form form={form}>
                <Form.List
                  name='flexible_benefit_category'
                  initialValue={
                    props.currentSectionDataForEntitlement.rule.fields
                      ?.flexible_benefit_category || []
                  }
                >
                  {fields => (
                    <div className='estimation-container'>
                      {fields.map(field => (
                        <Row
                          key={field.key}
                          gutter={rowGutter}
                          className='table-row'
                        >
                          <Col span={22}>
                            <Row gutter={24}>
                              <Col span={6}>
                                <Form.Item
                                  {...fields}
                                  label={<Trans>Benefit Category</Trans>}
                                  name={[field.name, 'category_id']}
                                  fieldKey={
                                    [field.fieldKey, 'category_id'] as any
                                  }
                                  required
                                  rules={[
                                    {
                                      required: true,
                                      message: 'Benefit Category is Required',
                                    },
                                  ]}
                                >
                                  <Select
                                    showSearch
                                    filterOption={(input: any, option: any) =>
                                      option.children
                                        .toLowerCase()
                                        .indexOf(input.toLowerCase()) >= 0
                                    }
                                    onChange={(value: any) => {
                                      handleFlexibleBenefit(
                                        field.fieldKey,
                                        value,
                                        'category_id',
                                      );
                                    }}
                                  >
                                    {filteredCategoryList.map((o: any) => {
                                      let isSelectedCategory = props?.currentSectionDataForEntitlement?.rule?.fields?.flexible_benefit_category?.find(
                                        (val: any) => val.category_id === o.id,
                                      );
                                      return (
                                        <Select.Option
                                          disabled={isSelectedCategory}
                                          key={o.id}
                                          value={o.id}
                                        >
                                          {o.title}({o.code})
                                        </Select.Option>
                                      );
                                    })}
                                  </Select>
                                </Form.Item>
                              </Col>

                              <Col span={6}>
                                <Form.Item
                                  {...fields}
                                  name={[field.name, 'category_budget']}
                                  fieldKey={
                                    [field.fieldKey, 'category_budget'] as any
                                  }
                                  label={<Trans>Budget Amount</Trans>}
                                  rules={[
                                    {
                                      required: true,
                                      message: 'This field required',
                                    },
                                  ]}
                                >
                                  <InputNumber
                                    style={{ width: '100%' }}
                                    min={1}
                                    maxLength={15}
                                    max={
                                      !config.is_unlimited_amount &&
                                      props.currentSectionDataForEntitlement
                                        .rule.fields.amount
                                    }
                                    // max=10
                                    // step='0.01'
                                    precision={2}
                                    onChange={(value: any) => {
                                      handleFlexibleBenefit(
                                        field.fieldKey,
                                        value,
                                        'category_budget',
                                      );
                                    }}
                                  />
                                </Form.Item>
                              </Col>
                              <Col span={6}>
                                <Form.Item
                                  {...fields}
                                  name={[field.name, 'category_max_amount']}
                                  fieldKey={
                                    [
                                      field.fieldKey,
                                      'category_max_amount',
                                    ] as any
                                  }
                                  label={<Trans>Budget Max Amount</Trans>}
                                  rules={[
                                    {
                                      required: true,
                                      message: 'This field required',
                                    },
                                  ]}
                                >
                                  <InputNumber
                                    style={{ width: '100%' }}
                                    min={1}
                                    maxLength={15}
                                    max={
                                      props?.currentSectionDataForEntitlement
                                        ?.rule?.fields
                                        ?.flexible_benefit_category?.[
                                        field.fieldKey
                                      ]?.category_budget
                                    }
                                    // step='0.01'
                                    precision={2}
                                    onChange={(value: any) => {
                                      handleFlexibleBenefit(
                                        field.fieldKey,
                                        value,
                                        'category_max_amount',
                                      );
                                    }}
                                  />
                                </Form.Item>
                              </Col>
                              <Col span={6}>
                                <Form.Item
                                  {...fields}
                                  name={[field.name, 'category_min_amount']}
                                  fieldKey={
                                    [
                                      field.fieldKey,
                                      'category_min_amount',
                                    ] as any
                                  }
                                  label={<Trans>Budget Min Amount</Trans>}
                                  rules={[
                                    {
                                      required: true,
                                      message: 'This field required',
                                    },
                                  ]}
                                >
                                  <InputNumber
                                    style={{ width: '100%' }}
                                    min={1}
                                    maxLength={15}
                                    precision={2}
                                    max={
                                      props?.currentSectionDataForEntitlement
                                        ?.rule?.fields
                                        ?.flexible_benefit_category?.[
                                        field.fieldKey
                                      ]?.category_max_amount
                                    }
                                    onChange={(value: any) => {
                                      handleFlexibleBenefit(
                                        field.fieldKey,
                                        value,
                                        'category_min_amount',
                                      );
                                    }}
                                  />
                                </Form.Item>
                              </Col>
                            </Row>
                          </Col>
                          <Col span={2}>
                            {fields.length >= 1 && (
                              <Col flex='none'>
                                <CloseOutlined
                                  className='dynamic-delete-button'
                                  onClick={() => {
                                    onRemoveCall(field.fieldKey);
                                  }}
                                  style={{
                                    fontSize: '16px',
                                  }}
                                />
                              </Col>
                            )}
                          </Col>
                        </Row>
                      ))}

                      {addNewRow(fields)}
                    </div>
                  )}
                </Form.List>
              </Form>
            )}
          </>
        )}
      </TabPane>

      <TabPane tab='Preview' key='4'>
        <EntitlementRuleSectionPreview
          selectedProcessTypeForEntitlement={selectedProcessTypeForEntitlement}
          config={config}
          currentSectionData={props.getCurrentReadableSectionDataForEntitlement}
          action={props.getDrawerForEntitlement}
        />
      </TabPane>
    </Tabs>
  );
};

const connector = connect(mapStateToProps, mapDispatchToProps);
export default memo(connector(EntitlementRuleTabsCustom));
