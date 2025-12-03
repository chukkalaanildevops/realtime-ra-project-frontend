import { FC, memo } from 'react';
import React from 'react';
import { Trans } from '@lingui/macro';

const RuleSectionPreview: FC<{
  currentSectionData: any;
  action: 'CUSTOM' | 'DEFAULT';
}> = props => {
  const optionTitleMap: any = {
    GENDER: 'Gender',
    MARITAL_STATUS: 'Marital Status',
    EMP_ID: 'Employee ID',
    NAME: 'Employee Name',
    EMP_GROUP: 'Employee Group',
    JOB_INFO_POSITION: 'Job Information.Position',
    JOB_INFO_EMP_GROUP: 'Job Information.Employee Group',
    JOB_INFO_EMP_SUB_GROUP: 'Job Information.Employee Sub Group',
    JOB_INFO_CONTRACT_TYPE: 'Job Information.Contract Type',
    JOB_INFO_SERVICE_LENGTH: 'Job Information.Service Length',
    JOB_INFO_PAY_GRADE: 'Job Information.Pay Grade',

    EXPENSE_CLAIM_AMOUNT: 'Expense Claim Amount',
    BENEFIT_CLAIM_AMOUNT: 'Benefit Claim Amount',
    COST_CENTRE_TYPE: 'Selected Cost Centre Type',
    CLAIM_CREATOR: 'Claim Creator',
    COST_CENTRE: 'Selected Cost Centre',
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
          <Trans>No entities added. Add atleast one entity.</Trans>
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
      conditionBox = (
        <span style={{ color: 'red' }}>
          <Trans>Incomplete condition</Trans>
        </span>
      );
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
          conditionItem.option === 'JOB_INFO_SERVICE_LENGTH' ? 'year(s)' : ''
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
            <div>
              <Trans>No conditions</Trans>
            </div>
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

  const RuleStepContainer = (_valueProps: any) => {
    const { stepIndex, stepItem, fallbackStep } = _valueProps;
    let stepSentence;
    if (
      !stepItem.owner ||
      ((stepItem.owner === 'Employee Group' || stepItem.owner === 'Approver') &&
        !stepItem.owner_id) ||
      (fallbackStep &&
        (fallbackStep.owner === 'Employee Group' ||
          fallbackStep.owner === 'Approver') &&
        !fallbackStep.owner_id)
    ) {
      stepSentence = (
        <div>
          step {stepIndex + 1}:
          <span style={{ color: 'red' }}>
            {' '}
            <Trans>Incomplete step</Trans>
          </span>
        </div>
      );
    } else {
      stepSentence = (
        <div>
          {`Step ${stepIndex + 1}: ${stepItem.owner} ${
            stepItem.owner === 'Employee Group' || stepItem.owner === 'Approver'
              ? ` - ${stepItem.owner_id}`
              : ''
          } (else ${fallbackStep.owner} ${
            fallbackStep.owner === 'Employee Group' ||
            fallbackStep.owner === 'Approver'
              ? ` - ${fallbackStep.owner_id}`
              : ''
          })`}
        </div>
      );
    }
    return <div>{stepSentence}</div>;
  };

  const CustomCaseContainer = (_valueProps: any) => {
    const { customCaseIndex, customCaseItem } = _valueProps;
    return (
      <div>
        <div>
          {customCaseIndex >= 1 && (
            <span style={{ fontStyle: 'italic' }}>ELSE </span>
          )}
          <span style={{ fontStyle: 'italic' }}>IF</span>
        </div>
        {customCaseItem.conditions.length === 0 && (
          <div style={{ color: 'red' }}>
            <Trans>No conditions added. Add atleast one condition.</Trans>
          </div>
        )}
        {customCaseItem.conditions.map(
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
        <div style={{ fontStyle: 'italic' }}>THEN</div>
        {customCaseItem.is_auto_approval && (
          <div>
            <Trans>Auto Approve</Trans>
          </div>
        )}

        {!customCaseItem.is_auto_approval && customCaseItem.steps.length === 0 && (
          <div style={{ color: 'red' }}>
            <Trans>Add atleast one step in workflow.</Trans>
          </div>
        )}
        {!customCaseItem.is_auto_approval &&
          customCaseItem.steps.map((stepItem: any, stepIndex: number) => {
            return (
              <RuleStepContainer
                key={stepIndex}
                stepIndex={stepIndex}
                stepItem={stepItem}
                fallbackStep={customCaseItem.fallback_steps[stepIndex]}
              />
            );
          })}
      </div>
    );
  };

  const RulesContainer = (_valueProps: any) => {
    let customCasesBox;
    customCasesBox = (
      <div>
        {props.currentSectionData.rule.cases.map(
          (customCaseItem: any, customCaseIndex: number) => {
            return (
              <CustomCaseContainer
                key={customCaseIndex}
                customCaseIndex={customCaseIndex}
                customCaseItem={customCaseItem}
              />
            );
          },
        )}
      </div>
    );

    let defaultCasesBox;
    defaultCasesBox = (
      <div>
        {props.currentSectionData.rule.cases &&
          props.currentSectionData.rule.cases.length > 0 && (
            <div style={{ fontStyle: 'italic' }}>ELSE</div>
          )}
        <div>
          {props.currentSectionData.rule.default_case.is_auto_approval && (
            <div>
              <Trans>Auto Approve</Trans>
            </div>
          )}

          {!props.currentSectionData.rule.default_case.is_auto_approval &&
            props.currentSectionData.rule.default_case.steps &&
            props.currentSectionData.rule.default_case.steps.length === 0 && (
              <div style={{ color: 'red' }}>
                <Trans>Add atleast one step in workflow.</Trans>
              </div>
            )}
          {!props.currentSectionData.rule.default_case.is_auto_approval &&
            props.currentSectionData.rule.default_case.steps &&
            props.currentSectionData.rule.default_case.steps.map(
              (stepItem: any, stepIndex: number) => {
                return (
                  <RuleStepContainer
                    key={stepIndex}
                    stepIndex={stepIndex}
                    stepItem={stepItem}
                    fallbackStep={
                      props.currentSectionData.rule.default_case.fallback_steps
                        ? props.currentSectionData.rule.default_case
                            .fallback_steps[stepIndex]
                        : null
                    }
                  />
                );
              },
            )}
        </div>
      </div>
    );
    return (
      <div>
        {customCasesBox}
        {defaultCasesBox}
      </div>
    );
  };

  return (
    <div
      style={{
        padding: '18px',
        border: '1px solid lightgray',
        marginBottom: '24px',
      }}
    >
      {props.action === 'CUSTOM' && (
        <div style={{ marginBottom: '12px' }}>
          <div style={{ fontWeight: 'bold' }}>
            <Trans>Entities:</Trans>
          </div>
          <EntitiesContainer />
        </div>
      )}

      {props.action === 'CUSTOM' && (
        <div style={{ marginBottom: '12px' }}>
          <div style={{ fontWeight: 'bold' }}>
            <Trans>Conditions:</Trans>
          </div>
          <CriteriaContainer />
        </div>
      )}

      <div>
        <div style={{ fontWeight: 'bold' }}>
          <Trans>Rules:</Trans>
        </div>
        <RulesContainer />
      </div>
    </div>
  );
};
export default memo(RuleSectionPreview);
