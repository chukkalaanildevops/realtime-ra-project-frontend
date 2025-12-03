/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import {
  Row,
  Col,
  Form,
  Typography,
  Select,
  Input,
  Checkbox,
  Radio,
  Switch,
  TreeSelect,
} from 'antd';
import './rulesAndConditions.index.less';
import { StatusTag } from '../../../../../../../../shared/components';
import { Trans } from '@lingui/macro';
import Text from 'antd/lib/typography/Text';
type SizeType = Parameters<typeof Form>[0]['size'];
const { Option } = Select;

const RulesAndConditions = (props: any) => {
  const {
    rulesPolicyConfigurationState,
    setRulesPolicyConfigurationState,
    policyConfiguration,
    setPolicyConfiguration,
    policyConfigurationDetail,
    entityNames,
  } = props;

  useEffect(() => {
    setRulesPolicyConfigurationState(policyConfiguration);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [policyConfiguration]);

  let applicableOn: any = {
    ENTITY__COMPANY: 'Company',
    ENTITY__DIVISION: 'Division',
    EMPLOYEE_GROUP: 'Employee Group',
    ENTITY__BUSINESS_UNIT: 'Business Unit',
    ENTITY__DEPARTMENT: 'Department',
    JOB_INFO_EMPLOYEE_GROUP: 'SF Employee Group',
    JOB_INFO_PAY_GRADE: 'Pay Grade',
  };

  const { Title } = Typography;

  const handleChangeValue = (index: number, key: string, value: any) => {
    let newData: any = Object.assign([], rulesPolicyConfigurationState);
    newData[index] = { ...newData[index], [key]: value };
    if (key === 'is_show_flag_to_employee' && !value) {
      newData[index] = { ...newData[index], is_enforcement: value };
    }
    if (key === 'applicable_on')
      newData[index] = { ...newData[index], applicable_to: [] };
    setRulesPolicyConfigurationState(newData);
  };

  return (
    <>
      <Title level={5}>{<Trans>Rules & Conditions</Trans>}</Title>
      <Row>
        {rulesPolicyConfigurationState?.map(
          (policyData: any, policyIndex: number) => (
            <Col key={policyIndex} span={24} className='steper-container-box'>
              <Title level={5}>For Target Group {policyIndex + 1}</Title>
              <Row>
                <Col span={24} className='steper-container-box'>
                  <Row align='middle' gutter={[1, 20]}>
                    <Col span={6}>
                      <div>{<Trans>Target Group</Trans>}</div>
                    </Col>
                    <Col span={14}>
                      <div className='text-box text-box-small'>
                        {entityNames[policyData?.applicable_on]?.display_text
                          ? `${
                              entityNames[policyData?.applicable_on]
                                ?.display_text
                            }`
                          : ''}
                      </div>
                    </Col>
                    <Col span={4} />
                    <Col span={6} style={{ marginTop: '10px' }}>
                      <div>
                        {
                          <Trans>
                            {entityNames[policyData?.applicable_on]
                              ?.display_text
                              ? `${
                                  entityNames[policyData?.applicable_on]
                                    ?.display_text
                                }`
                              : ''}
                          </Trans>
                        }{' '}
                        :
                      </div>
                    </Col>
                    <Col
                      span={14}
                      style={{ textAlign: 'end', marginTop: '10px' }}
                    >
                      <span
                        style={{
                          color: '#000',
                          position: 'absolute',
                          top: '-22px',
                          right: '25px',
                        }}
                      >
                        {`${policyData?.selected_applicable_to?.length} Selected`}
                      </span>
                      <TreeSelect
                        showArrow
                        className='tree-select-options'
                        showSearch
                        value={policyData?.selected_applicable_to?.map(
                          (item: any) => {
                            return item?.children;
                          },
                        )}
                        treeCheckable={true}
                        maxTagCount='responsive'
                        placeholder='Select'
                        treeDefaultExpandAll
                        style={{ width: '100%' }}
                      >
                        <TreeSelect.TreeNode
                          key={''}
                          value={''}
                          title={`Selected ${
                            entityNames[policyData?.applicable_on]?.display_text
                              ? `${
                                  entityNames[policyData?.applicable_on]
                                    ?.display_text
                                }`
                              : ''
                          }`}
                        >
                          {policyData?.selected_applicable_to?.map(
                            (item: any) => {
                              return (
                                <TreeSelect.TreeNode
                                  key={item?.children}
                                  value={item?.children}
                                  title={item?.children}
                                />
                              );
                            },
                          )}
                        </TreeSelect.TreeNode>
                      </TreeSelect>
                    </Col>
                    <Col span={4} />
                    <Col span={24}>
                      <div style={{ marginTop: '15px' }}>
                        <Title level={5}>
                          {<Trans>Risk score Configuration</Trans>}
                        </Title>
                      </div>
                    </Col>
                    <Col span={6}>
                      <div>{<Trans>Select Risk Severity</Trans>} :</div>
                    </Col>
                    <Col span={14}>
                      <Radio.Group
                        className='radio-buttons'
                        onChange={e => {
                          handleChangeValue(
                            policyIndex,
                            'weightage',
                            e.target.value,
                          );
                        }}
                        defaultValue={
                          policyData?.weightage ? policyData?.weightage : 1
                        }
                      >
                        <Radio value={1}>Low</Radio>
                        <Radio value={10}>High</Radio>
                      </Radio.Group>
                    </Col>
                  </Row>

                  <Row
                    align='middle'
                    gutter={[1, 15]}
                    style={{ marginTop: '20px' }}
                  >
                    <Col span={24}>
                      <Title
                        level={5}
                        style={{ fontSize: '14px', fontWeight: 500 }}
                      >
                        {
                          <Trans>
                            Whom Should Be Flagged When Policy Is Violated ?
                          </Trans>
                        }
                      </Title>
                    </Col>
                    <Col span={6}>
                      <Checkbox
                        style={{
                          color: policyData.is_show_flag_to_approver
                            ? '#0090FF'
                            : '',
                        }}
                        onChange={() => {
                          handleChangeValue(
                            policyIndex,
                            'is_show_flag_to_approver',
                            !policyData.is_show_flag_to_approver,
                          );
                        }}
                        checked={policyData.is_show_flag_to_approver}
                      >
                        {<Trans>Approver*</Trans>}
                      </Checkbox>
                    </Col>
                    <Col span={2}>
                      <Text disabled={!policyData.is_show_flag_to_approver}>
                        {<Trans>Message</Trans>} :
                      </Text>
                    </Col>
                    <Col span={14}>
                      <Input
                        id='msg_for_approver'
                        value={policyData.msg_for_approver}
                        onChange={e =>
                          handleChangeValue(
                            policyIndex,
                            'msg_for_approver',
                            e.target.value,
                          )
                        }
                        disabled={!policyData.is_show_flag_to_approver}
                        placeholder={policyConfigurationDetail?.title}
                      />
                    </Col>

                    <Col span={6}>
                      <Checkbox
                        style={{
                          color: policyData.is_show_flag_to_finance_admin
                            ? '#0090FF'
                            : '',
                        }}
                        onChange={() => {
                          handleChangeValue(
                            policyIndex,
                            'is_show_flag_to_finance_admin',
                            !policyData.is_show_flag_to_finance_admin,
                          );
                        }}
                        disabled={false}
                        checked={policyData.is_show_flag_to_finance_admin}
                      >
                        {<Trans>Admin</Trans>}
                      </Checkbox>
                    </Col>

                    <Col span={2}>
                      <Text
                        disabled={!policyData.is_show_flag_to_finance_admin}
                      >
                        {<Trans>Message</Trans>} :
                      </Text>
                    </Col>

                    <Col span={14}>
                      <Input
                        id='msg_for_finance_admin'
                        disabled={!policyData.is_show_flag_to_finance_admin}
                        value={policyData.msg_for_finance_admin}
                        onChange={e =>
                          handleChangeValue(
                            policyIndex,
                            'msg_for_finance_admin',
                            e.target.value,
                          )
                        }
                        placeholder={policyConfigurationDetail?.title}
                      />
                    </Col>

                    <Col span={6}>
                      <Checkbox
                        style={{
                          color: policyData?.is_show_flag_to_employee
                            ? '#0090FF'
                            : '',
                        }}
                        onChange={() => {
                          handleChangeValue(
                            policyIndex,
                            'is_show_flag_to_employee',
                            !policyData.is_show_flag_to_employee,
                          );
                        }}
                        disabled={false}
                        checked={policyData.is_show_flag_to_employee}
                      >
                        {<Trans>Employee</Trans>}
                      </Checkbox>
                    </Col>
                    <Col span={2}>
                      <Text disabled={!policyData.is_show_flag_to_employee}>
                        {<Trans>Message</Trans>} :
                      </Text>
                    </Col>
                    <Col span={14}>
                      <Input
                        id='msg_for_employee'
                        disabled={!policyData.is_show_flag_to_employee}
                        value={policyData.msg_for_employee}
                        onChange={e =>
                          handleChangeValue(
                            policyIndex,
                            'msg_for_employee',
                            e.target.value,
                          )
                        }
                        placeholder={policyConfigurationDetail?.title}
                      />
                    </Col>
                  </Row>
                  <Row style={{ marginTop: '20px' }}>
                    {policyData.is_show_flag_to_employee && (
                      <>
                        <Col span={3}>
                          <Trans>Policy Enforcement :</Trans>
                        </Col>
                        <Col span={10}>
                          <Switch
                            defaultChecked={policyData?.is_enforcement}
                            onChange={e =>
                              handleChangeValue(
                                policyIndex,
                                'is_enforcement',
                                policyData.is_show_flag_to_employee === false
                                  ? false
                                  : !policyData.is_enforcement,
                              )
                            }
                          />
                        </Col>
                      </>
                    )}
                  </Row>
                </Col>
              </Row>
            </Col>
          ),
        )}
      </Row>
    </>
  );
};

export default RulesAndConditions;
