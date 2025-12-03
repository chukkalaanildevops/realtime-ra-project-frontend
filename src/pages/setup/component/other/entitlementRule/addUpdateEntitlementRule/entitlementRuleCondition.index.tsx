import { FC, memo, useState, useEffect, Dispatch } from 'react';
import React from 'react';
import { Select, Input, Button } from 'antd';
import { ConnectedProps, connect } from 'react-redux';

import {
  getOptionsForEntitlement,
  getOperatorsForEntitlement,
  getGendersForEntitlement,
  getMaritalStatusesForEntitlement,
  getContractTypesForEntitlement,
  getRefObjEmpGroupsForEntitlement,
  getEmpSubGroupsForEntitlement,
  getEmpGroupsForEntitlement,
  getEmployeeIdsForEntitlement,
  getUsersForEntitlement,
  getPayGradesForEntitlement,
} from '../../../../../../shared/redux/rootReducer';

import {
  updateCriteriaForEntitlement,
  removeAndCriteriaForEntitlement,
} from '../../../../../../shared/redux/entitlementRule/addUpdateEntitlementRule/addUpdateEntitlementRule.action';

const { Option } = Select;

const mapStateToProps = (
  state: any,
  ownProps: {
    criteriaIndex: number;
    conditionIndex: number;
    conditionItem: any;
  },
) => ({
  options: getOptionsForEntitlement(state),
  operators: getOperatorsForEntitlement(state),
  genders: getGendersForEntitlement(state),
  maritalStatuses: getMaritalStatusesForEntitlement(state),
  contractTypes: getContractTypesForEntitlement(state),
  refObjEmpGroups: getRefObjEmpGroupsForEntitlement(state),
  empSubGroups: getEmpSubGroupsForEntitlement(state),
  empGroups: getEmpGroupsForEntitlement(state),
  payGrades: getPayGradesForEntitlement(state),
  employeeIds: getEmployeeIdsForEntitlement(state),
  users: getUsersForEntitlement(state),
  criteriaIndex: ownProps.criteriaIndex,
  conditionIndex: ownProps.conditionIndex,
  conditionItem: ownProps.conditionItem,
});

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  updateCriteria: ({
    criteriaIndex,
    conditionIndex,
    updateType,
    updateValue,
    isNumberType,
    readableValue,
  }: {
    criteriaIndex: number;
    conditionIndex: number;
    updateType: 'OPTION' | 'OPERATOR' | 'VALUE';
    updateValue: any;
    isNumberType: boolean;
    readableValue: any;
  }) =>
    dispatch(
      updateCriteriaForEntitlement({
        criteriaIndex,
        conditionIndex,
        updateType,
        updateValue,
        isNumberType,
        readableValue,
      }),
    ),
  removeAndCriteria: ({
    criteriaIndex,
    toBeRemovedIndex,
  }: {
    criteriaIndex: number;
    toBeRemovedIndex: number;
  }) =>
    dispatch(
      removeAndCriteriaForEntitlement({ criteriaIndex, toBeRemovedIndex }),
    ),
});

const EntitlementRuleCondition: FC<ConnectedProps<
  typeof connector
>> = props => {
  useEffect(() => {
    const optionCode = props.conditionItem.option;
    if (optionCode !== null) {
      setAllowedOperators(props.operators[optionCode]);
    }
  }, [props.conditionItem.option, props.operators]);

  const [allowedOperators, setAllowedOperators] = useState<any>([]);

  const optionsDropdownContainerMap: any = {
    GENDER: props.genders.map((item: any, index: number) => (
      <Option key={index} value={item.id}>
        {item.title}
      </Option>
    )),
    MARITAL_STATUS: props.maritalStatuses.map((item: any, index: number) => (
      <Option key={index} value={item.id}>
        {item.title}
      </Option>
    )),
    JOB_INFO_CONTRACT_TYPE: props.contractTypes.map(
      (item: any, index: number) => (
        <Option key={index} value={item.id}>
          {item.title}
        </Option>
      ),
    ),
    JOB_INFO_EMP_GROUP: props.refObjEmpGroups.map(
      (item: any, index: number) => (
        <Option key={index} value={item.id}>
          {item.title}
        </Option>
      ),
    ),
    JOB_INFO_EMP_SUB_GROUP: props.empSubGroups.map(
      (item: any, index: number) => (
        <Option key={index} value={item.id}>
          {item.title}
        </Option>
      ),
    ),
    JOB_INFO_PAY_GRADE: props.payGrades.map((item: any, index: number) => (
      <Option key={index} value={item.id}>
        {item.title}
      </Option>
    )),
    EMP_ID: props.employeeIds.map((item: any, index: number) => (
      <Option key={index} value={item.emp_id}>
        {item.emp_id}
      </Option>
    )),
    EMP_GROUP: props.empGroups.map((item: any, index: number) => (
      <Option key={index} value={item.id}>
        {item.title}
      </Option>
    )),
    NAME: props.users.map((item: any, index: number) => (
      <Option key={index} value={item.id}>
        {item?.legal_name || item?.name} ({item.email})
      </Option>
    )),
  };

  const dropdownPlaceholderMap: any = {
    GENDER: 'Select gender(s)',
    MARITAL_STATUS: 'Select marital status(es)',
    JOB_INFO_CONTRACT_TYPE: 'Select contract type(s)',
    JOB_INFO_EMP_GROUP: 'Select employee group(s)',
    JOB_INFO_EMP_SUB_GROUP: 'Select employee sub group(s)',
    EMP_ID: 'Select employee ID(s)',
    EMP_GROUP: 'Select employee group(s)',
    NAME: 'Select employee name(s)',
  };

  const agePlaceHolderName: any = {
    AGE: 'Enter age in years',
    RELATIONSHIP_AGE__FATHER: 'Enter Father(s) age in years',
    RELATIONSHIP_AGE__MOTHER: 'Enter Mother(s) age in years',
    RELATIONSHIP_AGE__BROTHER: 'Enter Brother(s) age in years',
    RELATIONSHIP_AGE__SISTER: 'Enter Sister(s) age in years',
    RELATIONSHIP_AGE__SPOUSE: 'Enter Spouse(s) age in years',
    RELATIONSHIP_AGE__CHILD: 'Enter Child(s) age in years',
    RELATIONSHIP_AGE__STEPCHILD: 'Enter StepChild(s) age in years',
    JOB_INFO_SERVICE_LENGTH: 'Enter service length in years',
    JOB_INFO_POSITION: 'Enter Position',
    RELATIONSHIP_AGE__CHILD_OF_DOMESTIC_PARTNER:
      'Enter Child Of Domestic Partner(s) age in years',
    RELATIONSHIP_AGE__REGISTERED_PARTNER:
      'Enter Registered Partner(s) age in years',
    RELATIONSHIP_AGE__DIVORCED_SPOUSE: 'Enter Divorced Spouce(s) age in years',
    RELATIONSHIP_AGE__RELATED_PERSONS: 'Enter Related persons(s) age in years',
    RELATIONSHIP_AGE__DOMESTIC_PARTNER:
      'Enter Domestic Partner(s) age in years',
  };

  let optionsInputContainer;
  if (
    [
      'AGE',
      'RELATIONSHIP_AGE__FATHER',
      'RELATIONSHIP_AGE__MOTHER',
      'RELATIONSHIP_AGE__BROTHER',
      'RELATIONSHIP_AGE__SISTER',
      'RELATIONSHIP_AGE__SPOUSE',
      'RELATIONSHIP_AGE__CHILD',
      'RELATIONSHIP_AGE__STEPCHILD',
      'RELATIONSHIP_AGE__CHILD_OF_DOMESTIC_PARTNER',
      'RELATIONSHIP_AGE__REGISTERED_PARTNER',
      'RELATIONSHIP_AGE__DIVORCED_SPOUSE',
      'RELATIONSHIP_AGE__RELATED_PERSONS',
      'RELATIONSHIP_AGE__DOMESTIC_PARTNER',
      'JOB_INFO_SERVICE_LENGTH',
      'JOB_INFO_POSITION',
    ].includes(props.conditionItem.option)
  ) {
    optionsInputContainer = (
      <Input
        type='number'
        onChange={(event: any) =>
          props.updateCriteria({
            criteriaIndex: props.criteriaIndex,
            conditionIndex: props.conditionIndex,
            updateType: 'VALUE',
            updateValue: event.target.value,
            isNumberType:
              props.conditionItem.option === 'JOB_INFO_POSITION' ? false : true,
            readableValue: null,
          })
        }
        value={props.conditionItem.value}
        placeholder={agePlaceHolderName[props.conditionItem.option]}
      />
    );
  } else {
    optionsInputContainer = (
      <Select
        mode='multiple'
        showSearch
        style={{ width: '100%' }}
        placeholder={dropdownPlaceholderMap[props.conditionItem.option]}
        optionFilterProp='children'
        value={
          props.conditionItem.value === null ? [] : props.conditionItem.value
        }
        onChange={(values: any, readableValue: any) =>
          props.updateCriteria({
            criteriaIndex: props.criteriaIndex,
            conditionIndex: props.conditionIndex,
            updateType: 'VALUE',
            updateValue: values,
            readableValue,
            isNumberType: false,
          })
        }
      >
        {optionsDropdownContainerMap[props.conditionItem.option]}
      </Select>
    );
  }

  return (
    <tr>
      <td className='col1'>
        <Select
          showSearch
          style={{ width: '100%' }}
          placeholder='Select option'
          optionFilterProp='children'
          value={props.conditionItem.option}
          onChange={(optionCode: string) =>
            props.updateCriteria({
              criteriaIndex: props.criteriaIndex,
              conditionIndex: props.conditionIndex,
              updateType: 'OPTION',
              updateValue: optionCode,
              isNumberType: false,
              readableValue: null,
            })
          }
        >
          {props.options.map((item: any, index: number) => (
            <Option key={index} value={item.code}>
              {item.title}
            </Option>
          ))}
        </Select>
      </td>
      <td className='col2'>
        <Select
          style={{ width: '100%' }}
          placeholder='Select operator'
          optionFilterProp='children'
          value={props.conditionItem.operator}
          onChange={(operatorCode: string) =>
            props.updateCriteria({
              criteriaIndex: props.criteriaIndex,
              conditionIndex: props.conditionIndex,
              updateType: 'OPERATOR',
              updateValue: operatorCode,
              isNumberType: false,
              readableValue: null,
            })
          }
        >
          {allowedOperators?.map((item: any, index: number) => (
            <Option key={index} value={item.code}>
              {item.title}
            </Option>
          ))}
        </Select>
      </td>
      <td className='col3'>{optionsInputContainer}</td>
      <td className='col4'>
        <Button
          type='link'
          onClick={() =>
            props.removeAndCriteria({
              criteriaIndex: props.criteriaIndex,
              toBeRemovedIndex: props.conditionIndex,
            })
          }
        >
          x
        </Button>
      </td>
    </tr>
  );
};

const connector = connect(mapStateToProps, mapDispatchToProps);
export default memo(connector(EntitlementRuleCondition));
