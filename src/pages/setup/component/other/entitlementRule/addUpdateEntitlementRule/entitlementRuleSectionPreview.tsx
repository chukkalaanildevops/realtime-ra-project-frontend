/* eslint-disable react-hooks/exhaustive-deps */
import { Table } from 'antd';
import React, { useEffect, useState } from 'react';

import { memo, FC } from 'react';

const EntitlementRuleSectionPreview: FC<{
  selectedProcessTypeForEntitlement: any;
  config: any;
  currentSectionData: any;
  action: 'CUSTOM' | 'DEFAULT';
}> = props => {
  const optionTitleMap: any = {
    GENDER: 'Gender',
    MARITAL_STATUS: 'Marital Status',
    EMP_ID: 'Employee ID',
    NAME: 'Employee Name',
    EMP_GROUP: 'Employee Group',
    EXPENSE_CLAIM_AMOUNT: 'Expense Claim Amount',
    BENEFIT_CLAIM_AMOUNT: 'Benefit Claim Amount',
    COST_CENTRE_TYPE: 'Selected Cost Centre Type',
    CLAIM_CREATOR: 'Claim Creator',
    COST_CENTRE: 'Selected Cost Centre',
    AGE: 'Age',
    FATHER: 'Father(s) age',
    MOTHER: 'Mother(s) age',
    BROTHER: 'Brother(s) age',
    SISTER: 'Sister(s) age',
    SPOUSE: 'Spouse(s) age',
    CHILD: 'Child(s) age',
    STEPCHILD: 'StepChild(s) age',
    CHILD_OF_DOMESTIC_PARTNER: 'Child Of Domestic Partner(s) age',
    REGISTERED_PARTNER: 'Registered Partner(s) age',
    DIVORCED_SPOUSE: 'Divorced Spouce(s) age',
    RELATED_PERSONS: 'Related persons(s) age',
    DOMESTIC_PARTNER: 'Domestic Partner(s) age',
    JOB_INFO_SERVICE_LENGTH: 'Service Length',
    JOB_INFO_CONTRACT_TYPE: 'Contract Type',
    JOB_INFO_EMP_SUB_GROUP: 'Employee Sub Group',
    JOB_INFO_PAY_GRADE: 'Pay Grade',
    RELATIONSHIP_AGE__FATHER: 'Father(s) age',
    RELATIONSHIP_AGE__MOTHER: 'Mother(s) age',
    RELATIONSHIP_AGE__BROTHER: 'Brother(s) age',
    RELATIONSHIP_AGE__SISTER: 'Sister(s) age',
    RELATIONSHIP_AGE__SPOUSE: 'Spouse(s) age',
    RELATIONSHIP_AGE__CHILD: 'Child(s) age',
    RELATIONSHIP_AGE__STEPCHILD: 'StepChild(s) age',
    RELATIONSHIP_AGE__CHILD_OF_DOMESTIC_PARTNER:
      'Child Of Domestic Partner(s) age',
    RELATIONSHIP_AGE__REGISTERED_PARTNER: 'Registered Partner(s) age',
    RELATIONSHIP_AGE__DIVORCED_SPOUSE: 'Divorced Spouce(s) age',
    RELATIONSHIP_AGE__RELATED_PERSONS: 'Related persons(s) age',
    RELATIONSHIP_AGE__DOMESTIC_PARTNER: 'Domestic Partner(s) age',
  };
  const EntitiesContainer = (_valueProps: any) => {
    if (
      props.currentSectionData.entities &&
      props.currentSectionData.entities.length > 0
    ) {
      return <div>{props.currentSectionData.entities.join(', ')}</div>;
    } else {
      return (
        <div style={{ color: 'red' }}>
          No entities added. Add atleast one entity.
        </div>
      );
    }
  };

  const ConditionContainer = (_valueProps: any) => {
    const { conditionItem, conditionIndex } = _valueProps;
    let conditionBox;
    if (
      !conditionItem.option ||
      !conditionItem.operator ||
      !conditionItem.value ||
      conditionItem.value.length === 0
    ) {
      conditionBox = <span style={{ color: 'red' }}>Incomplete condition</span>;
    } else {
      let operatorSentence;
      if (conditionItem.operator === 'IN') {
        operatorSentence =
          conditionItem.value.length > 1 ? ' is any of' : ' is';
      } else if (conditionItem.operator === 'NOTIN') {
        operatorSentence =
          conditionItem.value.length > 1 ? ' is not any of' : ' is not';
      } else if (conditionItem.operator === 'NOTIN') {
        operatorSentence =
          conditionItem.value.length > 1 ? ' is not any of' : ' is not';
      } else if (conditionItem.operator === 'EQ') {
        operatorSentence = ' is equal to';
      } else if (conditionItem.operator === 'NOTEQ') {
        operatorSentence = ' is not equal to';
      } else if (conditionItem.operator === 'LT') {
        operatorSentence = ' is less than';
      } else if (conditionItem.operator === 'LTE') {
        operatorSentence = ' is less than or equal to';
      } else if (conditionItem.operator === 'GT') {
        operatorSentence = ' is greater than';
      } else if (conditionItem.operator === 'GTE') {
        operatorSentence = ' is greater than or equal to';
      }

      let valueSentence;
      if (Array.isArray(conditionItem.value)) {
        valueSentence = ` ${conditionItem.value.join(', ')}`;

        if (conditionItem.option === 'COST_CENTRE_TYPE') {
          let costCentreTypes = conditionItem.value.map((value: string) => {
            if (value === 'INTER') return 'Internal Order Cost Centre';
            if (value === 'OVERS') return 'Overseas Cost Centre';
            if (value === 'THIRD') return 'Third Party Vendor';
            if (value === 'EMPCC') return 'Employee Profile Cost Centre';
            return '';
          });
          valueSentence = ` ${costCentreTypes.join(', ')}`;
        }
        if (conditionItem.option === 'CLAIM_CREATOR') {
          let costCentreTypes = conditionItem.value.map((value: string) => {
            if (value === 'COST_CENTRE_HEAD') return 'Selected CC Head 1';
            if (value === 'COST_CENTRE_HEAD_2') return 'Selected CC Head 2';
            if (value === 'COST_CENTRE_HEAD_3') return 'Selected CC Head 3';
            if (value === 'ENTITY_HEAD') return 'Entity Head';
            return '';
          });
          valueSentence = ` ${costCentreTypes.join(', ')}`;
        }
      } else {
        valueSentence = ` ${conditionItem.value} ${
          conditionItem.option === 'JOB_INFO_SERVICE_LENGTH'
            ? 'Service year(s)'
            : ''
        }`;
      }

      conditionBox = (
        <span>
          <span>{optionTitleMap[conditionItem.option]}</span>
          <span>{operatorSentence}</span>
          <span>{valueSentence}</span>
        </span>
      );
    }

    return (
      <div>
        <span style={{ fontStyle: 'italic' }}>
          {conditionIndex > 0 && 'AND '}
        </span>
        {conditionBox}
      </div>
    );
  };

  const CriteriaContainer = (_valueProps: any) => {
    return (
      <div>
        {props.currentSectionData.criterias &&
          props.currentSectionData.criterias.length === 0 && (
            <div>No conditions</div>
          )}
        {props.currentSectionData.criterias &&
          props.currentSectionData.criterias.map(
            (criteriaItem: any, criteriaIndex: number) => {
              return (
                <div key={criteriaIndex}>
                  {criteriaIndex !== 0 && (
                    <div style={{ fontStyle: 'italic' }}>OR</div>
                  )}
                  <div>
                    {criteriaItem.map(
                      (conditionItem: any, conditionIndex: number) => {
                        return (
                          <ConditionContainer
                            key={conditionIndex}
                            conditionIndex={conditionIndex}
                            conditionItem={conditionItem}
                          />
                        );
                      },
                    )}
                  </div>
                </div>
              );
            },
          )}
      </div>
    );
  };

  const [budgetTable, setbudgetTable] = useState<any>([]);

  const columns = [
    {
      title: 'Budget Title',
      dataIndex: 'budget_title',
      key: 'budget_title',
      align: 'center' as 'center',
      width: 10,
      render: (_text: any, _record: any) =>
        `${_record.budget_title}(${_record.budget_code})`,
    },
    {
      title: 'Budget Amount',
      dataIndex: 'category_budget',
      key: 'category_budget',
      align: 'center' as 'center',
      width: 10,
      render: (text: any) => <span className='address'>{text.toFixed(2)}</span>,
    },
    {
      title: 'Budget Max Amount',
      dataIndex: 'category_max_amount',
      key: 'category_max_amount',
      align: 'center' as 'center',
      width: 10,
      render: (text: any) => <span className='address'>{text.toFixed(2)}</span>,
    },
    {
      title: 'Budget Min Amount',
      dataIndex: 'category_min_amount',
      key: 'category_min_amount',
      align: 'center' as 'center',
      width: 10,
      render: (text: any) => <span className='address'>{text.toFixed(2)}</span>,
    },
  ];

  useEffect(() => {
    const budgetTable = props.currentSectionData?.rule?.fields?.flexible_benefit_category?.map(
      (o: any) => {
        const budgetTitle = props?.config?.benefit_category?.find(
          (val: any) => val.id === o.category_id,
        );

        const budgetCode = props?.config?.benefit_category?.find(
          (value: any) => value.id === budgetTitle?.id,
        );

        return {
          budget_code: budgetCode?.code,
          budget_title: budgetTitle?.title,
          category_budget: o.category_budget,
          category_min_amount: o.category_min_amount,
          category_max_amount: o.category_max_amount,
        };
      },
    );

    setbudgetTable(budgetTable);
  }, [
    // eslint-disable-next-line react-hooks/exhaustive-deps
    props.currentSectionData?.rule?.fields?.flexible_benefit_category,
    props.config.benefit_category,
  ]);

  const RulesContainer = (_valProps: any) => {
    let ruleBox;
    if (props.currentSectionData?.rule.is_no_entitlement) {
      ruleBox = <div>Is Entitlement set to False.</div>;
    } else {
      if (props?.currentSectionData?.rule.fields === {}) {
        ruleBox = (
          <div style={{ color: 'red' }}>
            Please fill all the information for rules.
          </div>
        );
      } else if (
        !props.currentSectionData?.rule.fields.amount &&
        !(
          props.config?.is_unlimited_amount ||
          props.currentSectionData?.rule.fields.is_unlimited_amount
        ) &&
        props.selectedProcessTypeForEntitlement === 'BEN'
        // ||
        // !props.currentSectionData.rule.fields.min_amount ||
        // !props.currentSectionData.rule.fields.copay_value ||
        // !props.currentSectionData.rule.fields.payable_percent
      ) {
        ruleBox = (
          <div style={{ color: 'red' }}>
            Please fill the{' '}
            <span style={{ fontWeight: 'bold' }}>
              {!props.currentSectionData?.rule?.fields?.amount &&
              !(
                props.config?.is_unlimited_amount ||
                props.currentSectionData?.rule.fields.is_unlimited_amount
              ) &&
              props.selectedProcessTypeForEntitlement === 'BEN'
                ? 'Amount, '
                : ''}
              {!props.currentSectionData?.rule?.fields?.max_amount
                ? 'Max amount '
                : ''}
              {!props.currentSectionData?.rule?.fields?.min_amount
                ? 'Min amount, '
                : ''}
              {!props.currentSectionData?.rule?.fields?.copay_value
                ? 'Copay value, '
                : ''}
              {!props.currentSectionData?.rule?.fields?.payable_percent
                ? 'Payable percent '
                : ''}
            </span>{' '}
            for rules.
          </div>
        );
      } else {
        ruleBox = (
          <div>
            <div>
              Is entitlement :{' '}
              {props.currentSectionData?.rule.is_no_entitlement
                ? 'False'
                : 'True'}
            </div>
            <div>
              {props.selectedProcessTypeForEntitlement === 'BEN' && (
                <span style={{ marginRight: 30 }}>
                  Amount :{' '}
                  {props.config?.is_unlimited_amount ||
                  props.currentSectionData?.rule.fields.is_unlimited_amount
                    ? 'Unlimited Amount'
                    : props.currentSectionData?.rule.fields.amount}
                </span>
              )}
              {props.selectedProcessTypeForEntitlement === 'EXP' &&
                (props.config?.is_unlimited_amount ||
                  props.currentSectionData?.rule.fields
                    .is_unlimited_amount) && (
                  <span style={{ marginRight: 30 }}>
                    Amount : Unlimited Amount
                  </span>
                )}
              {((props.selectedProcessTypeForEntitlement === 'EXP' &&
                (props.config?.is_unlimited_amount === false ||
                  props.currentSectionData?.rule.fields?.is_unlimited_amount ===
                    false)) ||
                props.selectedProcessTypeForEntitlement === 'BEN') && (
                <>
                  {props.currentSectionData?.rule.fields.max_amount && (
                    <span style={{ marginRight: 30 }}>
                      Max amount :{' '}
                      {props.currentSectionData?.rule.fields.max_amount}
                    </span>
                  )}
                  {props.currentSectionData?.rule.fields.min_amount && (
                    <span style={{ marginRight: 30 }}>
                      Min amount :{' '}
                      {props.currentSectionData?.rule.fields.min_amount}
                    </span>
                  )}

                  <div>
                    {props.config?.is_allow_flexible_benefit &&
                      budgetTable?.length > 0 && (
                        <Table
                          columns={columns}
                          dataSource={budgetTable}
                          pagination={{
                            hideOnSinglePage: true,
                          }}
                          bordered
                        />
                      )}
                  </div>
                </>
              )}
            </div>
            {props.selectedProcessTypeForEntitlement === 'BEN' && (
              <div>
                {(props.config?.deductible_component?.code === 'COP' ||
                  props.currentSectionData.rule.fields.copay_value ||
                  props.currentSectionData.rule.fields.copay_value !== 0) && (
                  <span style={{ marginRight: 30 }}>
                    Copay value :{' '}
                    {props.currentSectionData.rule.fields.copay_value}
                  </span>
                )}
                {(props.config?.deductible_component?.code === 'PAY' ||
                  props.currentSectionData.rule.fields.payable_percent ||
                  props.currentSectionData.rule.fields.payable_percent !==
                    0) && (
                  <span style={{ marginRight: 30 }}>
                    Payable percent :{' '}
                    {props.currentSectionData.rule.fields.payable_percent}
                  </span>
                )}
              </div>
            )}
          </div>
        );
      }
    }

    return <div>{ruleBox}</div>;
  };

  return (
    <div>
      <div
        style={{
          padding: '18px',
          border: '1px solid lightgray',
          marginBottom: '24px',
        }}
      >
        {props.action === 'CUSTOM' && (
          <div style={{ marginBottom: '12px' }}>
            <div style={{ fontWeight: 'bold' }}>Entities:</div>
            <EntitiesContainer />
          </div>
        )}

        {props.action === 'CUSTOM' && (
          <div style={{ marginBottom: '12px' }}>
            <div style={{ fontWeight: 'bold' }}>Conditions:</div>
            <CriteriaContainer />
          </div>
        )}

        <div>
          <div style={{ fontWeight: 'bold' }}>Rules:</div>
          <RulesContainer />
        </div>
      </div>
    </div>
  );
};

export default memo(EntitlementRuleSectionPreview);
