/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { Component, Dispatch } from 'react';
import {
  ElementOrSkeleton,
  OptionalItem,
} from '../../../../../../../../../shared/components';
import { Trans } from '@lingui/macro';
import { connect } from 'react-redux';
import {
  Badge,
  Typography,
  Col,
  Row,
  Divider,
  Switch,
  TreeSelect,
  Form,
  Input,
  Select,
} from 'antd';
import Text from 'antd/lib/typography/Text';
import './targetGroup.less';
import { fetchTargetGroupService } from '../../../../../../../../../services/policyConfiguration';
import { AxiosResponse } from 'axios';
import cloneDeep from 'lodash.clonedeep';
import { ecoreUrl } from './ecoreUtils';
import moment from 'moment';
import { useParams } from 'react-router-dom';
import { stateInterface } from '../../../../../../../../../shared/redux/rootReducer';
import {
  fetchAllTargetTypes,
  fetchPolicyConfigurationDetail,
} from '../../../../policyConfiguration.thunk';
import PreviewTreeSelectWithSearch from './PreviewTreeSelectWithSearch';

function withParams(Component: any) {
  return (props: any) => <Component {...props} params={useParams()} />;
}
const mapStateToProps = (state: stateInterface) => {
  const { listTargetTypes } = state.policyConfiguration;
  return {
    listTargetTypes: listTargetTypes,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  return {
    _listAllTargetTypes: () => dispatch(fetchAllTargetTypes()),
  };
};
const connector = connect(mapStateToProps, mapDispatchToProps);
interface IObjectKeys {
  [key: string]: any;
}
export const targetLabelValues: IObjectKeys = {
  ENTITY__COMPANY: 'Company',
  ENTITY__DIVISION: 'Division',
  ENTITY__DEPARTMENT: 'Department',
  ENTITY__BUSINESS_UNIT: 'Business Unit',
  EMPLOYEE_GROUP: 'Employee Group',
  JOB_INFO_PAY_GRADE: 'Pay Grade',
  JOB_INFO_EMPLOYEE_GROUP: 'SF Employee Group',
  GEN: 'General',
  MIL: 'Mileage',
  ALW: 'Allowance',
  ENT: 'Entertainment',
  PTC: 'Petty Cash',
  APPROVER: 'Approver',
  EMPLOYEE: 'Employee',
  FINANCE_ADMIN: 'Admin',
};
export const requestTargetLabelValues: IObjectKeys = {
  GEN: 'General',
  TRA: 'Travel',
};

class TargetGroup extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      UpdateTargetConfigurations: [],
      isLoading: true,
      targetGroupList: [],
      entityNames: {},
      selectExpenseCategory: '',
      searchExpenseValues: '',
      selectRequestCategory: '',
      searchRequestValues: '',
    };
  }

  componentDidMount() {
    this.props._listAllTargetTypes();
    const { targetConfigurations } = this.props;
    const { id }: any = this.props.params;
    if (
      this.props.targetConfigurations !== targetConfigurations ||
      id === undefined
    ) {
      targetConfigurations?.data?.forEach((group: any, index: number) =>
        this.getTargetGroupLists(group, index),
      );
      if (targetConfigurations?.data.length === 0) {
        this.setState({ isLoading: false });
      }
    }
  }

  componentDidUpdate(prevProps: Readonly<any>): void {
    const { targetConfigurations, listTargetTypes } = this.props;
    if (prevProps.targetConfigurations !== targetConfigurations) {
      targetConfigurations?.data?.forEach((group: any, index: number) =>
        this.getTargetGroupLists(group, index),
      );
      if (targetConfigurations?.data.length === 0) {
        this.setState({ isLoading: false });
      }
    }

    if (prevProps?.listTargetTypes !== listTargetTypes) {
      let defaultLists = {
        EMPLOYEE_GROUP: {
          title: 'Employee Group',
          display_text: 'Employee Group',
        },
        JOB_INFO_EMPLOYEE_GROUP: {
          title: 'SF Employee Group',
          display_text: 'SF Employee Group',
        },
        JOB_INFO_PAY_GRADE: { title: 'Pay Grade', display_text: 'Pay Grade' },
      };
      let objLists: any = {};
      listTargetTypes.forEach((item: any) => {
        if (item.title === 'Company') {
          objLists['ENTITY__COMPANY'] = item;
        }
        if (item.title === 'Division') {
          objLists['ENTITY__DIVISION'] = item;
        }
        if (item.title === 'Business Unit') {
          objLists['ENTITY__BUSINESS_UNIT'] = item;
        }
        if (item.title === 'Department') {
          objLists['ENTITY__DEPARTMENT'] = item;
        }
      });
      objLists = { ...objLists, ...defaultLists };
      // setEntityNames(objLists);

      this.setState({ entityNames: objLists });
    }
  }

  renderFlagMembersFilter(group: any) {
    let members: string[] = [];
    if (group.is_show_flag_to_approver)
      members.push(targetLabelValues.APPROVER);
    if (group.is_show_flag_to_employee)
      members.push(targetLabelValues.EMPLOYEE);
    if (group.is_show_flag_to_finance_admin)
      members.push(targetLabelValues.FINANCE_ADMIN);
    return members;
  }

  createApplicableOnUrl(applicable_on: any, title: string, ids: string) {
    const applicableToObj: IObjectKeys = {
      isGetRequest: false,
      url: '',
      employee_group_ids: '',
      isResponseObj: false,
    };
    if (
      targetLabelValues[applicable_on] ===
        targetLabelValues.JOB_INFO_PAY_GRADE ||
      targetLabelValues[applicable_on] ===
        targetLabelValues.JOB_INFO_EMPLOYEE_GROUP
    ) {
      applicableToObj.isGetRequest = true;
      applicableToObj.url = `${ecoreUrl.REFERENCE_OBJECTS}?title=${title}&item_ids=${ids}&page=1&page_size=999`;
    } else if (
      targetLabelValues[applicable_on] === targetLabelValues.EMPLOYEE_GROUP
    ) {
      applicableToObj.isGetRequest = false;
      applicableToObj.url = `${ecoreUrl.EMPLOYEE_GROUPS}`;
      applicableToObj.employee_group_ids = ids;
    } else {
      applicableToObj.isGetRequest = true;
      applicableToObj.isResponseObj = true;
      applicableToObj.url = `${
        ecoreUrl.LEGAL_ENTITIES
      }?uuids=${ids}&effective_on=${moment().format(
        'MM/DD/YYYY',
      )}&page=1&page_size=999`;
    }
    return applicableToObj;
  }

  async getTargetGroupLists(group: any, groupIndex: number) {
    const { targetConfigurations } = this.props;
    const ids: string = group?.applicable_to?.join(',');
    let title: string = targetLabelValues[group?.applicable_on];
    title = title === 'SF Employee Group' ? 'Employee Group' : title;
    let body: IObjectKeys = {};
    try {
      let applicableToObj = this.createApplicableOnUrl(
        group?.applicable_on,
        title,
        ids,
      );
      const {
        url,
        isGetRequest,
        employee_group_ids,
        isResponseObj,
      } = applicableToObj;

      body.employee_group_ids = employee_group_ids;
      let response: AxiosResponse = await fetchTargetGroupService(
        url,
        isGetRequest,
        body,
      );
      if (isResponseObj) {
        response.data = response?.data?.data.map((entity: any) => entity.title);
      }
      group.filtered_applicable_to = response.data;
      // let newData = Object.assign({}, targetConfigurations);

      // const data = newData?.data?.map((item: any) => {
      // const data = newData?.data[groupIndex]?.expense_categories?.map((ele: any) => {
      // ele?.types?.map((e: any) => {
      // return {
      //   data: ele?.name,
      //   key: ele?.name,
      //   title: ele?.name,
      //   type: 'parent',
      //   value: ele?.name,
      //   children: ele?.types?.map((e: any) => {
      //     return {
      //       data: e?.id,
      //       key: e?.id,
      //       title: e?.title,
      //       type: 'child',
      //       value: e,
      //     };
      //   }),
      // };
      // })
      // });
      // });
      // newData[groupIndex] = {
      //   ...newData[groupIndex],
      //   expense_categories: newData?.data?.map((item: any) => {
      //     return item?.expense_categories?.map((ele: any) => {
      //       return {
      //         data: ele?.name,
      //         key: ele?.name,
      //         title: ele?.name,
      //         type: 'parent',
      //         value: ele?.name,
      //         children: ele?.types?.map((e: any) => {
      //           return {
      //             data: e?.id,
      //             key: e?.id,
      //             title: e?.title,
      //             type: 'child',
      //             value: e,
      //           };
      //         }),
      //       };
      //     });
      //   }),
      // };

      // newData.data[
      //   groupIndex
      // ].expense_categories = data;

      let targetConfigurationsClone = cloneDeep(targetConfigurations);
      targetConfigurationsClone.data[groupIndex] = group;
      this.setState({ UpdateTargetConfigurations: targetConfigurationsClone });
    } catch (error) {
      console.error(error);
    }
    if (targetConfigurations?.data.length === groupIndex + 1) {
      this.setState({ isLoading: false });
    }
  }

  render() {
    const { Title } = Typography;
    const {
      UpdateTargetConfigurations,
      isLoading,
      selectExpenseCategory,
      searchExpenseValues,
      selectRequestCategory,
      searchRequestValues,
    } = this.state;
    const { id } = this.props?.params;

    return (
      <ElementOrSkeleton isActive={true} isLoading={isLoading} type='page'>
        <Row>
          {UpdateTargetConfigurations?.data?.map(
            (group: any, index: number) => {
              return (
                <Col span={24} key={index}>
                  <Title level={5}>For Target Group {index + 1}</Title>
                  <Row style={{ padding: '10px' }}>
                    <Col span={24}>
                      <div style={{ fontWeight: 600, paddingBottom: '4px' }}>
                        <Trans>Target Group Details & Expense Details</Trans>
                      </div>
                      <Row>
                        <Col span={24} className='steper-container-box'>
                          <Row
                            align='middle'
                            style={{ marginBottom: '30px' }}
                            gutter={[2, 14]}
                          >
                            <Col span={6}>
                              <div>{<Trans>Target Group</Trans>}</div>
                            </Col>
                            <Col span={18}>
                              <div className='text-box text-box-small'>
                                {this.state.entityNames?.[group?.applicable_on]
                                  ?.display_text
                                  ? this.state.entityNames?.[
                                      group?.applicable_on
                                    ]?.display_text
                                  : ''}
                              </div>
                            </Col>

                            <Col span={6} style={{ marginTop: '18px' }}>
                              <div>
                                {
                                  <Trans>
                                    {this.state.entityNames?.[
                                      group?.applicable_on
                                    ]?.display_text
                                      ? this.state.entityNames?.[
                                          group?.applicable_on
                                        ]?.display_text
                                      : ''}
                                  </Trans>
                                }
                              </div>
                            </Col>
                            <Col span={18} style={{ marginTop: '18px' }}>
                              <span
                                style={{
                                  color: '#000',
                                  position: 'absolute',
                                  top: '-22px',
                                  right: '25px',
                                }}
                              >
                                {`${group?.filtered_applicable_to?.length} Selected`}
                              </span>
                              <TreeSelect
                                showArrow
                                className='tree-select-options'
                                showSearch
                                value={group?.filtered_applicable_to}
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
                                    this.state.entityNames?.[
                                      group?.applicable_on
                                    ]?.display_text
                                      ? this.state.entityNames?.[
                                          group?.applicable_on
                                        ]?.display_text
                                      : ''
                                  }`}
                                >
                                  {group?.filtered_applicable_to?.map(
                                    (item: any) => {
                                      return (
                                        <TreeSelect.TreeNode
                                          key={item}
                                          value={item}
                                          title={item}
                                        />
                                      );
                                    },
                                  )}
                                </TreeSelect.TreeNode>
                              </TreeSelect>
                            </Col>
                          </Row>

                          {group?.request_categories &&
                            group?.request_categories?.length !== 0 && (
                              <>
                                <Row align='middle' gutter={[2, 8]}>
                                  <Col span={6}>
                                    <div>
                                      {<Trans>Request Categories</Trans>}
                                    </div>
                                  </Col>
                                  <Col span={18}>
                                    <span
                                      style={{
                                        color: '#000',
                                        position: 'absolute',
                                        top: '-22px',
                                        right: '25px',
                                      }}
                                    >
                                      {`${group?.request_categories?.length} Selected`}
                                    </span>
                                    <TreeSelect
                                      showArrow
                                      className='tree-select-options'
                                      showSearch
                                      value={group?.request_categories?.map(
                                        (item: any) => {
                                          return requestTargetLabelValues[
                                            item?.name
                                          ];
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
                                        title={'Selected Request Categories'}
                                      >
                                        {group?.request_categories?.map(
                                          (item: any) => {
                                            return (
                                              <TreeSelect.TreeNode
                                                key={
                                                  requestTargetLabelValues[
                                                    item?.name
                                                  ]
                                                }
                                                value={
                                                  requestTargetLabelValues[
                                                    item?.name
                                                  ]
                                                }
                                                title={
                                                  requestTargetLabelValues[
                                                    item?.name
                                                  ]
                                                }
                                              />
                                            );
                                          },
                                        )}
                                      </TreeSelect.TreeNode>
                                    </TreeSelect>
                                  </Col>
                                </Row>
                                <Row>
                                  <Col
                                    span={6}
                                    style={{
                                      marginTop: '18px',
                                      marginBottom: '36px',
                                    }}
                                  >
                                    <div>{<Trans>Request Types</Trans>}</div>
                                  </Col>
                                  <Col
                                    span={18}
                                    style={{
                                      textAlign: 'end',
                                      marginBottom: '36px',
                                    }}
                                  >
                                    <span
                                      style={{
                                        marginRight: '25px',
                                        color: '#000',
                                      }}
                                    >{`${group?.request_types?.length} Selected`}</span>
                                    <PreviewTreeSelectWithSearch
                                      value={group?.request_types}
                                      policyData={group?.request_categories}
                                      selectedCount={group?.request_types}
                                    />
                                  </Col>
                                </Row>
                              </>
                            )}

                          <Row align='middle' gutter={[2, 8]}>
                            <Col span={6}>
                              <div>{<Trans>Expense Categories</Trans>}</div>
                            </Col>
                            <Col span={18}>
                              <span
                                style={{
                                  color: '#000',
                                  position: 'absolute',
                                  top: '-22px',
                                  right: '25px',
                                }}
                              >
                                {`${group?.expense_categories?.length} Selected`}
                              </span>
                              <TreeSelect
                                showArrow
                                className='tree-select-options'
                                showSearch
                                value={group?.expense_categories?.map(
                                  (item: any) => {
                                    return item?.name;
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
                                  title={'Selected Expense Categories'}
                                >
                                  {group?.expense_categories?.map(
                                    (item: any) => {
                                      return (
                                        <TreeSelect.TreeNode
                                          key={item?.name}
                                          value={item?.name}
                                          title={targetLabelValues[item?.name]}
                                        />
                                      );
                                    },
                                  )}
                                </TreeSelect.TreeNode>
                              </TreeSelect>
                            </Col>
                          </Row>
                          <Row>
                            <Col span={6} style={{ marginTop: '18px' }}>
                              <div>{<Trans>Expense Types</Trans>}</div>
                            </Col>
                            <Col span={18} style={{ textAlign: 'end' }}>
                              <span
                                style={{
                                  marginRight: '25px',
                                  color: '#000',
                                }}
                              >{`${group?.claim_types?.length} Selected`}</span>
                              <PreviewTreeSelectWithSearch
                                value={group?.claim_types}
                                policyData={group?.expense_categories}
                                selectedCount={group?.claim_types}
                              />
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                      {/* Rules & conditions section */}
                      <Title level={5} style={{ marginTop: '25px' }}>
                        <Trans>Rules & Conditions</Trans>
                      </Title>
                      <Row>
                        <Col span={24} className='steper-container-box'>
                          <Row
                            align='middle'
                            style={{ marginBottom: '30px' }}
                            gutter={[2, 14]}
                          >
                            <Col span={8}>
                              <OptionalItem
                                title={<Trans>Flagged Members</Trans>}
                                value={this.renderFlagMembersFilter(group)?.map(
                                  (value: any, index: number) => (
                                    <>
                                      {value}
                                      {this.renderFlagMembersFilter(group)
                                        ?.length ===
                                      index + 1 ? null : (
                                        <span className='pipeIcon'> | </span>
                                      )}
                                    </>
                                  ),
                                )}
                              />
                            </Col>
                            <Col span={12}>
                              <OptionalItem
                                title={<Trans>Risk Severity</Trans>}
                                value={group?.weightage === 10 ? 'High' : 'Low'}
                              />
                            </Col>
                          </Row>
                          <Row gutter={[10, 12]}>
                            <Col span={24}>
                              <div style={{ fontWeight: 600 }}>
                                <Trans>Messages for Flagged Members</Trans>
                              </div>
                            </Col>
                            {group?.is_show_flag_to_approver && (
                              <Col span={8}>
                                <OptionalItem
                                  title={<Trans>Approver</Trans>}
                                  value={group.msg_for_approver}
                                />
                              </Col>
                            )}
                            {group?.is_show_flag_to_finance_admin && (
                              <Col span={8}>
                                <OptionalItem
                                  title={<Trans>Admin</Trans>}
                                  value={group.msg_for_finance_admin}
                                />
                              </Col>
                            )}
                            {group?.is_show_flag_to_employee && (
                              <Col span={8}>
                                <OptionalItem
                                  title={
                                    <Trans>
                                      Employee
                                      <span className='pipeIcon'> | </span>
                                      <Trans> Policy Enforcement : </Trans>
                                      <Switch
                                        className='enforcement-switch'
                                        size='small'
                                        defaultChecked={group?.is_enforcement}
                                        disabled={true}
                                      />
                                    </Trans>
                                  }
                                  value={group.msg_for_employee}
                                />
                              </Col>
                            )}
                          </Row>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  {UpdateTargetConfigurations?.data.length !== index + 1 && (
                    <Divider />
                  )}
                </Col>
              );
            },
          )}
        </Row>
      </ElementOrSkeleton>
    );
  }
}

export default connector(withParams(TargetGroup));
