import { FC, memo, Dispatch } from 'react';
import React from 'react';

import RuleStepRow from './ruleStepRow.index';
import CustomCaseConditionRow from './customCaseConditionRow.index';
import RuleSectionPreview from './ruleSectionPreview.index';

import { Button, Tabs, Radio } from 'antd';
import { ConnectedProps, connect } from 'react-redux';

import {
  addRuleStep,
  addCustomCase,
  addCustomCaseCondition,
  removeCustomCase,
  setIsAutoApproval,
} from '../../../../../../shared/redux/rule/addUpdateRule/addUpdateRule.action';

import {
  getCurrentSectionData,
  getCurrentReadableSectionData,
  getDrawerFor,
  getSelectedProcessType,
} from '../../../../../../shared/redux/rootReducer';
import { Trans } from '@lingui/macro';

const { TabPane } = Tabs;

const mapStateToProps = (state: any, ownProps: any) => ({
  selectedProcessType: getSelectedProcessType(state),
  currentSectionData: getCurrentSectionData(state),
  currentReadableSectionData: getCurrentReadableSectionData(state),
  drawerFor: getDrawerFor(state),
  tabActiveKey: ownProps.tabActiveKey,
  onSetTabActiveKey: ownProps.onSetTabActiveKey,
});

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  addRuleStep: ({
    caseType,
    caseIndex,
  }: {
    caseType: string;
    caseIndex: number;
  }) => dispatch(addRuleStep({ caseType, caseIndex })),
  addCustomCase: () => dispatch(addCustomCase()),
  addCustomCaseCondition: ({ caseIndex }: { caseIndex: number }) =>
    dispatch(addCustomCaseCondition({ caseIndex })),
  removeCustomCase: ({ toBeRemovedIndex }: { toBeRemovedIndex: number }) =>
    dispatch(removeCustomCase({ toBeRemovedIndex })),
  setIsAutoApproval: ({
    isCheck,
    caseType,
    caseIndex,
  }: {
    isCheck: boolean;
    caseType: 'CUSTOM' | 'DEFAULT';
    caseIndex: number | null;
  }) => dispatch(setIsAutoApproval({ isCheck, caseType, caseIndex })),
});

const RuleTabsDefault: FC<ConnectedProps<typeof connector>> = props => {
  const onAutoApproveRadioChange = ({
    event,
    caseType,
    caseIndex,
  }: {
    event: any;
    caseType: 'CUSTOM' | 'DEFAULT';
    caseIndex: number | null;
  }) => {
    const radioValue = event.target.value;
    switch (radioValue) {
      case 'auto-approve':
        props.setIsAutoApproval({ isCheck: true, caseType, caseIndex });
        break;
      case 'workflow':
        props.setIsAutoApproval({ isCheck: false, caseType, caseIndex });
    }
  };

  let customCasesContainer = null;
  // if (props.selectedProcessType === 'EXPAPR') {
  customCasesContainer = (
    <div>
      <div style={{ fontWeight: 'bold' }}>Custom cases:</div>
      {props.currentSectionData.rule?.cases.map(
        (customCaseItem: any, customCaseIndex: number) => {
          return (
            <div
              key={customCaseIndex}
              style={{
                border: '1px solid lightgray',
                padding: '8px',
                backgroundColor: '#fafafa',
                marginBottom: '8px',
              }}
            >
              <div style={{ fontWeight: 'bold' }}>
                Case {customCaseIndex + 1}:
                <Button
                  type='link'
                  onClick={() =>
                    props.removeCustomCase({
                      toBeRemovedIndex: customCaseIndex,
                    })
                  }
                >
                  <Trans>Remove</Trans>
                </Button>
              </div>
              <div>
                <Trans>Conditions</Trans>
              </div>
              {props.currentSectionData.rule &&
                customCaseItem.conditions.length > 0 && (
                  <table className='rules-table'>
                    <thead>
                      <tr>
                        <th className='col1'>
                          <Trans>Option</Trans>
                        </th>
                        <th className='col2'>
                          <Trans>Operator</Trans>
                        </th>
                        <th className='col3'>
                          <Trans>Value</Trans>
                        </th>
                        <th className='col4'></th>
                      </tr>
                    </thead>
                    <tbody>
                      {customCaseItem.conditions.map(
                        (
                          customCaseConditionItem: any,
                          customCaseConditionIndex: number,
                        ) => {
                          return (
                            <CustomCaseConditionRow
                              key={customCaseConditionIndex}
                              customCaseIndex={customCaseIndex}
                              customCaseConditionItem={customCaseConditionItem}
                              customCaseConditionIndex={
                                customCaseConditionIndex
                              }
                            />
                          );
                        },
                      )}
                    </tbody>
                  </table>
                )}
              <Button
                type='link'
                onClick={() =>
                  props.addCustomCaseCondition({ caseIndex: customCaseIndex })
                }
              >
                + Add a new AND condition
              </Button>

              <div>Rules:</div>

              <div style={{ marginBottom: '12px' }}>
                <Radio.Group
                  onChange={(event: any) =>
                    onAutoApproveRadioChange({
                      event,
                      caseType: 'CUSTOM',
                      caseIndex: customCaseIndex,
                    })
                  }
                  defaultValue={
                    props.currentSectionData.rule
                      ? props.currentSectionData.rule.cases[customCaseIndex]
                          .is_auto_approval
                        ? 'auto-approve'
                        : 'workflow'
                      : 'auto-approve'
                  }
                >
                  <Radio.Button value='auto-approve'>Auto Approve</Radio.Button>
                  <Radio.Button value='workflow'>Workflow</Radio.Button>
                </Radio.Group>
              </div>

              {props.currentSectionData.rule &&
                customCaseItem.steps.length > 0 && (
                  <table className='rules-table'>
                    <thead>
                      <tr>
                        <th
                          className='col1'
                          style={{ width: '8%', textAlign: 'center' }}
                        >
                          Step No.
                        </th>
                        <th className='col2'>Owned by</th>
                        <th className='col3'>Owner</th>
                        <th className='col4'></th>
                      </tr>
                    </thead>
                    <tbody>
                      {customCaseItem.steps.map(
                        (stepItem: any, stepIndex: number) => {
                          return (
                            <RuleStepRow
                              key={stepIndex}
                              caseType='CUSTOM'
                              caseIndex={customCaseIndex}
                              stepIndex={stepIndex}
                              stepItem={stepItem}
                              isFallbackStepType={false}
                            />
                          );
                        },
                      )}
                    </tbody>
                  </table>
                )}

              {!customCaseItem.is_auto_approval && (
                <Button
                  type='link'
                  onClick={() =>
                    props.addRuleStep({
                      caseType: 'CUSTOM',
                      caseIndex: customCaseIndex,
                    })
                  }
                >
                  + Add a new step
                </Button>
              )}

              {props.currentSectionData.rule &&
                customCaseItem.steps.length > 0 && (
                  <>
                    <div>Fallback to:</div>
                    <table className='rules-table'>
                      <thead>
                        <tr>
                          <th
                            className='col1'
                            style={{ width: '8%', textAlign: 'center' }}
                          >
                            Step No.
                          </th>
                          <th className='col2'>
                            <Trans>Owned by</Trans>
                          </th>
                          <th className='col3'>
                            <Trans>Owner</Trans>
                          </th>
                          <th className='col4'></th>
                        </tr>
                      </thead>
                      <tbody>
                        {customCaseItem.fallback_steps.map(
                          (stepItem: any, stepIndex: number) => {
                            return (
                              <RuleStepRow
                                key={stepIndex}
                                caseType='CUSTOM'
                                caseIndex={customCaseIndex}
                                stepIndex={stepIndex}
                                stepItem={stepItem}
                                isFallbackStepType={true}
                              />
                            );
                          },
                        )}
                      </tbody>
                    </table>
                  </>
                )}
            </div>
          );
        },
      )}

      <Button type='link' onClick={() => props.addCustomCase()}>
        + Add a new custom case
      </Button>

      <hr style={{ margin: '12px 0' }} />
    </div>
  );
  // }

  return (
    <Tabs
      activeKey={props.tabActiveKey}
      onChange={(key: string) => props.onSetTabActiveKey(key)}
    >
      <TabPane tab={<Trans>Rules</Trans>} key='1'>
        {customCasesContainer}

        <div style={{ fontWeight: 'bold' }}>Default case:</div>

        <div style={{ marginBottom: '12px' }}>
          <Radio.Group
            onChange={(event: any) =>
              onAutoApproveRadioChange({
                event,
                caseType: 'DEFAULT',
                caseIndex: null,
              })
            }
            defaultValue={
              props.currentSectionData.rule
                ? props.currentSectionData.rule.default_case.is_auto_approval
                  ? 'auto-approve'
                  : 'workflow'
                : 'auto-approve'
            }
          >
            <Radio.Button value='auto-approve'>
              <Trans>Auto Approve</Trans>
            </Radio.Button>
            <Radio.Button value='workflow'>
              <Trans>Workflow</Trans>
            </Radio.Button>
          </Radio.Group>
        </div>

        {props.currentSectionData.rule?.default_case.steps.length > 0 && (
          <table className='rules-table'>
            <thead>
              <tr>
                <th
                  className='col1'
                  style={{ width: '8%', textAlign: 'center' }}
                >
                  Step No.
                </th>
                <th className='col2'>
                  <Trans>Owned by</Trans>
                </th>
                <th className='col3'>
                  <Trans>Owner</Trans>
                </th>
                <th className='col4'></th>
              </tr>
            </thead>
            <tbody>
              {props.currentSectionData.rule.default_case.steps.map(
                (stepItem: any, stepIndex: number) => {
                  return (
                    <RuleStepRow
                      key={stepIndex}
                      caseType='DEFAULT'
                      caseIndex={-1}
                      stepIndex={stepIndex}
                      stepItem={stepItem}
                      isFallbackStepType={false}
                    />
                  );
                },
              )}
            </tbody>
          </table>
        )}

        {!props.currentSectionData.rule?.default_case.is_auto_approval && (
          <Button
            type='link'
            onClick={() =>
              props.addRuleStep({ caseType: 'DEFAULT', caseIndex: -1 })
            }
          >
            + Add a new step
          </Button>
        )}

        {props.currentSectionData.rule?.default_case.steps.length > 0 && (
          <>
            <div>Fallback to:</div>
            <table className='rules-table'>
              <thead>
                <tr>
                  <th
                    className='col1'
                    style={{ width: '8%', textAlign: 'center' }}
                  >
                    Step No.
                  </th>
                  <th className='col2'>
                    <Trans>Owned by</Trans>
                  </th>
                  <th className='col3'>
                    <Trans>Owner</Trans>
                  </th>
                  <th className='col4'></th>
                </tr>
              </thead>
              <tbody>
                {props.currentSectionData.rule.default_case.fallback_steps.map(
                  (stepItem: any, stepIndex: number) => {
                    return (
                      <RuleStepRow
                        key={stepIndex}
                        caseType='DEFAULT'
                        caseIndex={-1}
                        stepIndex={stepIndex}
                        stepItem={stepItem}
                        isFallbackStepType={true}
                      />
                    );
                  },
                )}
              </tbody>
            </table>
          </>
        )}
      </TabPane>

      <TabPane tab='Preview' key='2'>
        <RuleSectionPreview
          currentSectionData={props.currentReadableSectionData}
          action={props.drawerFor}
        />
      </TabPane>
    </Tabs>
  );
};

const connector = connect(mapStateToProps, mapDispatchToProps);
export default memo(connector(RuleTabsDefault));
