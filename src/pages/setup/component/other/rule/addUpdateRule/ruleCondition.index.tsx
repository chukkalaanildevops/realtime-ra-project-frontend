import { FC, memo, useState, useEffect, Dispatch } from 'react';
import React from 'react';
import { Select, Input, Button } from 'antd';
import { ConnectedProps, connect } from 'react-redux';

import {
  getOptions,
  getOperators,
  getGenders,
  getMaritalStatuses,
  getContractTypes,
  getRefObjEmpGroups,
  getEmpSubGroups,
  getEmpGroups,
  getEmployeeIds,
  // getUsers,
  getPayGrades,
} from '../../../../../../shared/redux/rootReducer';

import {
  updateCriteria,
  removeAndCriteria,
} from '../../../../../../shared/redux/rule/addUpdateRule/addUpdateRule.action';

const { Option } = Select;

const mapStateToProps = (
  state: any,
  ownProps: {
    criteriaIndex: number;
    conditionIndex: number;
    conditionItem: any;
  },
) => {
  const { users } = state.auth;
  return {
    options: getOptions(state),
    operators: getOperators(state),
    genders: getGenders(state),
    maritalStatuses: getMaritalStatuses(state),
    contractTypes: getContractTypes(state),
    refObjEmpGroups: getRefObjEmpGroups(state),
    empSubGroups: getEmpSubGroups(state),
    empGroups: getEmpGroups(state),
    payGrades: getPayGrades(state),
    employeeIds: getEmployeeIds(state),
    users: users,
    criteriaIndex: ownProps.criteriaIndex,
    conditionIndex: ownProps.conditionIndex,
    conditionItem: ownProps.conditionItem,
  };
};

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
      updateCriteria({
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
  }) => dispatch(removeAndCriteria({ criteriaIndex, toBeRemovedIndex })),
});

const RuleCondition: FC<ConnectedProps<typeof connector>> = props => {
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
        {item?.legal_name || item?.name} ({item.employee_id})
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

  let optionsInputContainer;
  if (props.conditionItem.option === 'JOB_INFO_POSITION') {
    optionsInputContainer = (
      <Input
        type='text'
        onChange={(event: any) =>
          props.updateCriteria({
            criteriaIndex: props.criteriaIndex,
            conditionIndex: props.conditionIndex,
            updateType: 'VALUE',
            updateValue: event.target.value,
            isNumberType: false,
            readableValue: null,
          })
        }
        value={props.conditionItem.value}
        placeholder='Enter position'
      />
    );
  } else if (props.conditionItem.option === 'JOB_INFO_SERVICE_LENGTH') {
    optionsInputContainer = (
      <Input
        type='number'
        onChange={(event: any) =>
          props.updateCriteria({
            criteriaIndex: props.criteriaIndex,
            conditionIndex: props.conditionIndex,
            updateType: 'VALUE',
            updateValue: event.target.value,
            isNumberType: true,
            readableValue: null,
          })
        }
        value={props.conditionItem.value}
        placeholder='Enter service length in years'
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
          {allowedOperators.map((item: any, index: number) => (
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
export default memo(connector(RuleCondition));
