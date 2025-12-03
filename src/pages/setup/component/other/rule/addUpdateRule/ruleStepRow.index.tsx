import { FC, memo, Dispatch } from 'react';
import React from 'react';
import { Select, Button } from 'antd';
import { ConnectedProps, connect } from 'react-redux';

import {
  removeRuleStep,
  updateStepOwner,
  updateStepOwnerId,
} from '../../../../../../shared/redux/rule/addUpdateRule/addUpdateRule.action';

import {
  getAllowedStepOwners,
  getAllowedFallbackStepOwners,
  getEmpGroups,
  getApproversCustomFields,
} from '../../../../../../shared/redux/rootReducer';

const { Option } = Select;

const mapStateToProps = (state: any) => ({
  allowedStepOwners: getAllowedStepOwners(state),
  allowedFallbackStepOwners: getAllowedFallbackStepOwners(state),
  empGroups: getEmpGroups(state),
  approversCustomFields: getApproversCustomFields(state),
});

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  removeRuleStep: (data: any) => dispatch(removeRuleStep(data)),
  updateStepOwner: (data: any) => dispatch(updateStepOwner(data)),
  updateStepOwnerId: (data: any) => dispatch(updateStepOwnerId(data)),
});

const RuleStepRow: FC<ConnectedProps<typeof connector> & {
  key?: any;
  stepItem: any;
  caseType: any;
  caseIndex: any;
  stepIndex: any;
  isFallbackStepType: any;
}> = (props: any) => {
  const {
    // variable
    stepItem,
    caseType,
    caseIndex,
    stepIndex,
    empGroups,
    allowedStepOwners,
    isFallbackStepType,
    allowedFallbackStepOwners,

    // function

    removeRuleStep,
    updateStepOwner,
    updateStepOwnerId,
    approversCustomFields,
  } = props;
  let optionsInputContainer;
  if (stepItem.owner === 'EMP_GROUP') {
    optionsInputContainer = (
      <Select
        showSearch
        style={{ width: '100%' }}
        placeholder='Select employee group(s)'
        optionFilterProp='children'
        value={stepItem.owner_id}
        onChange={(value: any, readableValue: any) =>
          updateStepOwnerId({
            caseType: caseType,
            caseIndex: caseIndex,
            stepIndex: stepIndex,
            updateValue: value,
            readableValue,
            isFallbackStepType: isFallbackStepType,
          })
        }
      >
        {empGroups &&
          empGroups.map((item: any, index: number) => (
            <Option key={index} value={item.id}>
              {item.title}
            </Option>
          ))}
      </Select>
    );
  } else if (stepItem.owner === 'MANAGER') {
    optionsInputContainer = <span>Manager of the claim creator</span>;
  } else if (
    stepItem.owner?.startsWith('APPROVER') &&
    stepItem.owner !== 'APPROVER'
  ) {
    const stepOwnerItem = allowedStepOwners.filter(
      (i: any) => i.code === stepItem.owner,
    );
    const title = stepOwnerItem[0].title;
    optionsInputContainer = <span>{title} of the claim creator</span>;
  } else if (stepItem.owner?.startsWith('COST_CENTRE_HEAD')) {
    const stepOwnerItem = allowedStepOwners.filter(
      (i: any) => i.code === stepItem.owner,
    );
    let title = stepOwnerItem[0].title;
    title = title.split(' - ')[0];
    optionsInputContainer = (
      <span>{title} of the cost centre selected in the claim</span>
    );
  } else if (stepItem.owner?.startsWith('EMPLOYEE_COST_CENTRE_HEAD')) {
    const stepOwnerItem = allowedStepOwners.filter(
      (i: any) => i.code === stepItem.owner,
    );
    let title = stepOwnerItem[0].title;
    title = title.split(' - ')[0];
    optionsInputContainer = (
      <span>{title} of the claim creator's cost centre</span>
    );
  } else if (stepItem.owner?.startsWith('ENTITY_TYPE_HEAD')) {
    const stepOwnerItem = allowedStepOwners.filter(
      (i: any) => i.code === stepItem.owner,
    );
    const title = stepOwnerItem[0]?.title;
    optionsInputContainer = <span>{title} of the claim creator</span>;
  } else if (stepItem.owner === 'DO_NOTHING') {
    optionsInputContainer = <span>Move the claim to Stalled state</span>;
  } else if (stepItem.owner === 'APPROVER') {
    optionsInputContainer = (
      <Select
        showSearch
        style={{ width: '100%' }}
        placeholder='Select Approver'
        optionFilterProp='children'
        value={stepItem.owner_id}
        onChange={(value: any, readableValue: any) =>
          updateStepOwnerId({
            caseType: caseType,
            caseIndex: caseIndex,
            stepIndex: stepIndex,
            updateValue: value,
            readableValue,
            isFallbackStepType: isFallbackStepType,
          })
        }
      >
        {approversCustomFields &&
          approversCustomFields.map((item: any, index: number) => (
            <Option key={index} value={item.id}>
              {item.title}
            </Option>
          ))}
      </Select>
    );
  }

  let allowedStepOwnerOptions;
  if (isFallbackStepType) {
    allowedStepOwnerOptions = allowedFallbackStepOwners.map(
      (item: any, index: number) => (
        <Option key={index} value={item.code}>
          {item.title}
        </Option>
      ),
    );
  } else {
    allowedStepOwnerOptions = allowedStepOwners.map(
      (item: any, index: number) => (
        <Option key={index} value={item.code}>
          {item.title}
        </Option>
      ),
    );
  }

  return (
    <tr>
      <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
        {stepIndex + 1}
      </td>
      <td>
        <Select
          showSearch
          style={{ width: '100%' }}
          placeholder='Select owner'
          optionFilterProp='children'
          value={stepItem.owner}
          onChange={(ownerCode: string) =>
            updateStepOwner({
              caseType: caseType,
              caseIndex: caseIndex,
              stepIndex: stepIndex,
              updateValue: ownerCode,
              isFallbackStepType: isFallbackStepType,
            })
          }
        >
          {allowedStepOwnerOptions}
        </Select>
      </td>
      <td style={{ verticalAlign: 'middle' }}>{optionsInputContainer}</td>
      <td>
        {!isFallbackStepType && (
          <Button
            type='link'
            onClick={() =>
              removeRuleStep({
                caseType: caseType,
                caseIndex: caseIndex,
                toBeRemovedIndex: stepIndex,
              })
            }
          >
            x
          </Button>
        )}
      </td>
    </tr>
  );
};
const connector = connect(mapStateToProps, mapDispatchToProps);
export default memo(connector(RuleStepRow));
