import { FC, memo, Dispatch, useState, useEffect } from 'react';
import React from 'react';
import { Select, Input, Button } from 'antd';
import { connect, ConnectedProps } from 'react-redux';

import {
  getOperators,
  getCustomCaseOptions,
  getCustomCasesCostCentreTypes,
  getCustomCasesClaimCreatorTypes,
  getSelectedProcessType,
  getCostCentres,
} from '../../../../../../shared/redux/rootReducer';

import {
  updateCustomCaseCondition,
  removeCustomCaseCondition,
} from '../../../../../../shared/redux/rule/addUpdateRule/addUpdateRule.action';

const { Option } = Select;

const mapStateToProps = (state: any, ownProps: any) => ({
  operators: getOperators(state),
  costCentres: getCostCentres(state),
  customCaseOptions: getCustomCaseOptions(state),
  customCasesCostCentreTypes: getCustomCasesCostCentreTypes(state),
  customCasesClaimCreatorTypes: getCustomCasesClaimCreatorTypes(state),
  selectedProcessType: getSelectedProcessType(state),

  customCaseIndex: ownProps.customCaseIndex,
  customCaseConditionItem: ownProps.customCaseConditionItem,
  customCaseConditionIndex: ownProps.customCaseConditionIndex,
});

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  updateCustomCaseCondition: ({
    caseIndex,
    conditionIndex,
    updateType,
    updateValue,
    isNumberType,
    updateDisplayValue,
  }: {
    caseIndex: number;
    conditionIndex: number;
    updateType: string;
    updateValue: any;
    isNumberType: boolean;
    updateDisplayValue: string[] | null;
  }) =>
    dispatch(
      updateCustomCaseCondition({
        caseIndex,
        conditionIndex,
        updateType,
        updateValue,
        isNumberType,
        updateDisplayValue,
      }),
    ),
  removeCustomCaseCondition: ({
    caseIndex,
    toBeRemovedIndex,
  }: {
    caseIndex: number;
    toBeRemovedIndex: number;
  }) => dispatch(removeCustomCaseCondition({ caseIndex, toBeRemovedIndex })),
});

const CustomCaseConditionRow: FC<ConnectedProps<typeof connector>> = props => {
  const [selectedOption, setSelectedOption] = useState<string>(
    'COST_CENTRE_TYPE',
  );
  const [operatorCode, setOperatorCode] = useState<string>(
    'CUSTOM_CASE__COST_CENTRE_TYPE',
  );

  useEffect(() => {
    const selectedItem = props.customCaseConditionItem;
    setSelectedOption(selectedItem.option);
    setOperatorCode(`CUSTOM_CASE__${selectedItem.option}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <tr>
      {/* <td style={{ verticalAlign: 'middle' }}>Expense Claim Amount</td> */}
      <td>
        <Select
          style={{ width: '100%' }}
          placeholder='Select option'
          optionFilterProp='children'
          value={props.customCaseConditionItem.option}
          onChange={(optionCode: string) => {
            props.updateCustomCaseCondition({
              caseIndex: props.customCaseIndex,
              conditionIndex: props.customCaseConditionIndex,
              updateType: 'OPTION',
              updateValue: optionCode,
              isNumberType: false,
              updateDisplayValue: null,
            });
            switch (optionCode) {
              case 'EXPENSE_CLAIM_AMOUNT':
                setOperatorCode('CUSTOM_CASE__EXPENSE_CLAIM_AMOUNT');
                setSelectedOption('EXPENSE_CLAIM_AMOUNT');
                break;

              case 'BENEFIT_CLAIM_AMOUNT':
                setOperatorCode('CUSTOM_CASE__BENEFIT_CLAIM_AMOUNT');
                setSelectedOption('BENEFIT_CLAIM_AMOUNT');
                break;

              case 'COST_CENTRE_TYPE':
                setOperatorCode('CUSTOM_CASE__COST_CENTRE_TYPE');
                setSelectedOption('COST_CENTRE_TYPE');
                break;

              case 'CLAIM_CREATOR':
                setOperatorCode('CUSTOM_CASE__CLAIM_CREATOR');
                setSelectedOption('CLAIM_CREATOR');
                break;

              case 'COST_CENTRE':
                setOperatorCode('CUSTOM_CASE__COST_CENTRE');
                setSelectedOption('COST_CENTRE');
                break;
            }
          }}
        >
          {props.customCaseOptions &&
            props.customCaseOptions.map((item: any, index: number) => {
              let isShowOption = true;

              if (
                (item.code === 'EXPENSE_CLAIM_AMOUNT' &&
                  ['REQAPR', 'BENAPR'].includes(props.selectedProcessType)) ||
                (item.code === 'BENEFIT_CLAIM_AMOUNT' &&
                  ['EXPAPR', 'REQAPR'].includes(props.selectedProcessType))
              )
                isShowOption = false;

              if (isShowOption) {
                return (
                  <Option key={index} value={item.code}>
                    {item.title}
                  </Option>
                );
              }
              return null;
            })}
        </Select>
      </td>
      <td>
        <Select
          style={{ width: '100%' }}
          placeholder='Select operator'
          optionFilterProp='children'
          value={props.customCaseConditionItem.operator}
          onChange={(operatorCode: string) =>
            props.updateCustomCaseCondition({
              caseIndex: props.customCaseIndex,
              conditionIndex: props.customCaseConditionIndex,
              updateType: 'OPERATOR',
              updateValue: operatorCode,
              isNumberType: false,
              updateDisplayValue: null,
            })
          }
        >
          {props.operators &&
            props.operators[operatorCode].map((item: any, index: number) => (
              <Option key={index} value={item.code}>
                {item.title}
              </Option>
            ))}
        </Select>
      </td>
      <td>
        {['EXPENSE_CLAIM_AMOUNT', 'BENEFIT_CLAIM_AMOUNT'].includes(
          selectedOption,
        ) && (
          <Input
            type='number'
            placeholder='Enter amount'
            value={props.customCaseConditionItem.value}
            onChange={(event: any) =>
              props.updateCustomCaseCondition({
                caseIndex: props.customCaseIndex,
                conditionIndex: props.customCaseConditionIndex,
                updateType: 'VALUE',
                updateValue: event.target.value,
                isNumberType: true,
                updateDisplayValue: null,
              })
            }
          />
        )}

        {selectedOption === 'COST_CENTRE_TYPE' && (
          <Select
            mode='multiple'
            style={{ width: '100%' }}
            placeholder='Select cost centre type(s)'
            optionFilterProp='children'
            value={props.customCaseConditionItem.value}
            onChange={(costCentreTypeCode: string) =>
              props.updateCustomCaseCondition({
                caseIndex: props.customCaseIndex,
                conditionIndex: props.customCaseConditionIndex,
                updateType: 'VALUE',
                updateValue: costCentreTypeCode,
                isNumberType: false,
                updateDisplayValue: null,
              })
            }
          >
            {props.customCasesCostCentreTypes.map(
              (item: any, index: number) => (
                <Option key={index} value={item.code}>
                  {item.title}
                </Option>
              ),
            )}
          </Select>
        )}

        {selectedOption === 'CLAIM_CREATOR' && (
          <Select
            mode='multiple'
            style={{ width: '100%' }}
            placeholder='Select claim creator type(s)'
            optionFilterProp='children'
            value={props.customCaseConditionItem.value}
            onChange={(costCentreTypeCode: string) =>
              props.updateCustomCaseCondition({
                caseIndex: props.customCaseIndex,
                conditionIndex: props.customCaseConditionIndex,
                updateType: 'VALUE',
                updateValue: costCentreTypeCode,
                isNumberType: false,
                updateDisplayValue: null,
              })
            }
          >
            {props.customCasesClaimCreatorTypes.map(
              (item: any, index: number) => (
                <Option key={index} value={item.code}>
                  {item.title}
                </Option>
              ),
            )}
          </Select>
        )}

        {selectedOption === 'COST_CENTRE' && (
          <Select
            mode='multiple'
            style={{ width: '100%' }}
            placeholder='Select cost centre(s)'
            optionFilterProp='children'
            value={props.customCaseConditionItem.value}
            onChange={(optionValues: string[], fullOption: any) => {
              const titles: string[] = [];
              fullOption.forEach((item: any) => {
                titles.push(item.children.join(''));
              });

              props.updateCustomCaseCondition({
                caseIndex: props.customCaseIndex,
                conditionIndex: props.customCaseConditionIndex,
                updateType: 'VALUE',
                updateValue: optionValues,
                isNumberType: false,
                updateDisplayValue: titles,
              });
            }}
          >
            {props.costCentres.map((item: any, index: number) => (
              <Option key={index} value={item.uuid}>
                {item.title} ({item.code})
              </Option>
            ))}
          </Select>
        )}
      </td>
      <td>
        <Button
          type='link'
          onClick={() =>
            props.removeCustomCaseCondition({
              caseIndex: props.customCaseIndex,
              toBeRemovedIndex: props.customCaseConditionIndex,
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
export default memo(connector(CustomCaseConditionRow));
