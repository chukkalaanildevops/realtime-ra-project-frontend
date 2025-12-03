import { FC, memo, Dispatch } from 'react';
import React from 'react';

import RuleCondition from './ruleCondition.index';
import RuleStepRow from './ruleStepRow.index';
import CustomCaseConditionRow from './customCaseConditionRow.index';
import RuleSectionPreview from './ruleSectionPreview.index';

import { Select, Button, Tabs, Empty, Radio } from 'antd';
import { ConnectedProps, connect } from 'react-redux';

import {
  setCurrSecEntities,
  setCurrReadSecEntities,
  addNewOrCriteria,
  removeOrCriteria,
  addNewAndCriteria,
  addRuleStep,
  addCustomCase,
  addCustomCaseCondition,
  removeCustomCase,
  setIsAutoApproval,
  moveCustomCaseUp,
  moveCustomCaseDown,
} from '../../../../../../shared/redux/rule/addUpdateRule/addUpdateRule.action';

import {
  getLegalEntities,
  getCurrentSectionData,
  getCurrentReadableSectionData,
  getDrawerAction,
  getDrawerFor,
  getSelectedProcessType,
} from '../../../../../../shared/redux/rootReducer';
import { Trans } from '@lingui/macro';

const { Option } = Select;
const { TabPane } = Tabs;

const mapStateToProps = (state: any, ownProps: any) => ({
  legalEntities: getLegalEntities(state),
  currentSectionData: getCurrentSectionData(state),
  currentReadableSectionData: getCurrentReadableSectionData(state),
  drawerAction: getDrawerAction(state),
  drawerFor: getDrawerFor(state),
  selectedProcessType: getSelectedProcessType(state),
  tabActiveKey: ownProps.tabActiveKey,
  onSetTabActiveKey: ownProps.onSetTabActiveKey,
});

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  setCurrSecEntities: (payload: any) => dispatch(setCurrSecEntities(payload)),
  setCurrReadSecEntities: (payload: any) =>
    dispatch(setCurrReadSecEntities(payload)),
  addNewOrCriteria: () => dispatch(addNewOrCriteria()),
  removeOrCriteria: ({ toBeRemovedIndex }: { toBeRemovedIndex: number }) =>
    dispatch(removeOrCriteria({ toBeRemovedIndex })),
  addNewAndCriteria: ({ criteriaIndex }: { criteriaIndex: number }) =>
    dispatch(addNewAndCriteria({ criteriaIndex })),
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
  moveCustomCaseUp: (index: number) => dispatch(moveCustomCaseUp(index)),
  moveCustomCaseDown: (index: number) => dispatch(moveCustomCaseDown(index)),
});

const RuleTabsCustom: FC<ConnectedProps<typeof connector>> = props => {
  const onEntityDropdownChange = (uuids: any[], uuidTitles: any) => {
    uuidTitles = uuidTitles.map((i: any) => i.children);
    props.setCurrSecEntities({ uuids });
    props.setCurrReadSecEntities({ uuidTitles });
  };

  const selectAllEntities = () => {
    const allUuids = props.legalEntities.map((item: any) => item.uuid);
    const allTitles = props.legalEntities.map((item: any) => item.title);
    props.setCurrSecEntities({ uuids: allUuids });
    props.setCurrReadSecEntities({ uuidTitles: allTitles });
  };

  const deSelectAllEntities = () => {
    props.setCurrSecEntities({ uuids: [] });
    props.setCurrReadSecEntities({ uuidTitles: [] });
  };

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
      <div style={{ fontWeight: 'bold' }}>
        <Trans>Custom cases:</Trans>
      </div>
      <div>
        {props.currentSectionData.rule &&
          props.currentSectionData.rule.cases.map(
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
                    {/* {customCaseIndex !== 0 && (
                      <Button
                        type='link'
                        onClick={() => props.moveCustomCaseUp(customCaseIndex)}
                      >
                        Move Up
                      </Button>
                    )}
                    {customCaseIndex !==
                      props.currentSectionData.rule.cases.length - 1 && (
                      <Button
                        type='link'
                        onClick={() =>
                          props.moveCustomCaseDown(customCaseIndex)
                        }
                      >
                        Move Down
                      </Button>
                    )} */}
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
                                  customCaseConditionItem={
                                    customCaseConditionItem
                                  }
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
                      props.addCustomCaseCondition({
                        caseIndex: customCaseIndex,
                      })
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
                        customCaseItem.is_auto_approval
                          ? 'auto-approve'
                          : 'workflow'
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

                  {!customCaseItem.is_auto_approval &&
                    props.currentSectionData.rule &&
                    customCaseItem.steps.length > 0 && (
                      <table className='rules-table'>
                        <thead>
                          <tr>
                            <th
                              className='col1'
                              style={{ width: '8%', textAlign: 'center' }}
                            >
                              <Trans>Step No.</Trans>
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

                  {!customCaseItem.is_auto_approval &&
                    props.currentSectionData.rule &&
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
                                <Trans>Step No.</Trans>
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
      </div>
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
          value={props.currentSectionData.entities}
        >
          {props.legalEntities.map((item: any, index: number) => {
            return (
              <Option key={index} value={item.uuid}>
                {item.title}
              </Option>
            );
          })}
        </Select>
      </TabPane>

      <TabPane tab='Conditions' key='2'>
        {props.currentSectionData.criterias?.length === 0 && (
          <Empty description={<span>No conditions found.</span>}>
            <Button type='link' onClick={() => props.addNewOrCriteria()}>
              + Add a new condition
            </Button>
          </Empty>
        )}

        {props.currentSectionData.criterias?.map(
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
                      <th className='col1'>
                        <Trans>Option</Trans>
                      </th>
                      <th className='col2'>
                        <Trans>Operator</Trans>
                      </th>
                      <th className='col3'>
                        <Trans>Value</Trans>
                      </th>
                      <th className='col4'>
                        <Button
                          type='link'
                          onClick={() =>
                            props.removeOrCriteria({
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
                          <RuleCondition
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
                  onClick={() => props.addNewAndCriteria({ criteriaIndex })}
                >
                  + Add an AND condition
                </Button>
              </div>
            );
          },
        )}

        {props.currentSectionData.criterias?.length > 0 && (
          <Button
            type='dashed'
            onClick={() => props.addNewOrCriteria()}
            style={{ marginTop: '24px' }}
          >
            Add an OR condtion
          </Button>
        )}
      </TabPane>

      <TabPane tab='Rules' key='3'>
        {customCasesContainer}

        <div style={{ fontWeight: 'bold' }}>
          <Trans>Default case:</Trans>
        </div>

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
              props.currentSectionData.rule.default_case.is_auto_approval
                ? 'auto-approve'
                : 'workflow'
            }
          >
            <Radio.Button value='auto-approve'>
              <Trans>Auto Approve</Trans>
            </Radio.Button>
            <Radio.Button value='workflow'>Workflow</Radio.Button>
          </Radio.Group>
        </div>

        {!props.currentSectionData.rule?.default_case.is_auto_approval &&
          props.currentSectionData.rule?.default_case.steps.length > 0 && (
            <table className='rules-table' style={{ marginTop: '24px' }}>
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

        {!props.currentSectionData.rule?.default_case.is_auto_approval &&
          props.currentSectionData.rule?.default_case.steps.length > 0 && (
            <>
              <div style={{ marginTop: '12px' }}>Fallback to:</div>
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

      <TabPane tab='Preview' key='4'>
        <RuleSectionPreview
          currentSectionData={props.currentReadableSectionData}
          action={props.drawerFor}
        />
      </TabPane>
    </Tabs>
  );
};

const connector = connect(mapStateToProps, mapDispatchToProps);
export default memo(connector(RuleTabsCustom));
