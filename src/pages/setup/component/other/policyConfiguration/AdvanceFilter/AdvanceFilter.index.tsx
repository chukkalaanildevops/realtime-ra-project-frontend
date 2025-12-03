/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Trans } from '@lingui/macro';
import { Button, Col, Form, Row, Select, Switch, TreeSelect } from 'antd';
import React, { Dispatch, memo, useEffect, useState } from 'react';
import {
  fetchAllExpanseTypes,
  fetchAllSfEmployeeGroups,
  fetchAllTargetTypes,
  fetchExpenseCategory,
  fetchListAllEmployeeGroups,
  fetchListAllPayGrades,
  fetchListBusinessUnits,
  fetchListDepartments,
  fetchListDivisions,
  fetchListEntitiesCompany,
} from '../policyConfiguration.thunk';
import { connect } from 'react-redux';
import { AxiosResponse } from 'axios';
import {
  listAllExpanseTypes,
  listAllExpenseCategoryService,
} from '../../../../../../services/policyConfiguration';

const mapStateToProps = (state: any) => {
  const {
    listEntities,
    listBusinessUnits,
    listDivisions,
    listDepartments,
    listAllEmployeeGroups,
    listAllPayGrades,
    listAllSfEmployeeGroups,
    listExpenseCategory,
    listExpenseTypes,
    listTargetTypes,
  } = state.policyConfiguration;
  return {
    listEntities,
    listBusinessUnits,
    listDivisions,
    listDepartments,
    listAllEmployeeGroups,
    listAllPayGrades,
    listAllSfEmployeeGroups,
    listExpenseCategory,
    listExpenseTypes,
    listTargetTypes: listTargetTypes,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  return {
    _listEntities: () => dispatch(fetchListEntitiesCompany()),
    _listDivisions: () => dispatch(fetchListDivisions()),
    _listBusinessUnits: () => dispatch(fetchListBusinessUnits()),
    _listDepartments: () => dispatch(fetchListDepartments()),
    _listAllEmployeeGroups: () => dispatch(fetchListAllEmployeeGroups()),
    _listAllPayGrades: () => dispatch(fetchListAllPayGrades()),
    _listAllSfEmployeeGroups: () => dispatch(fetchAllSfEmployeeGroups()),
    _listAllExpenseTypes: () => dispatch(fetchAllExpanseTypes()),
    _listExpenseCategory: (category: any) =>
      dispatch(fetchExpenseCategory(category)),
    _listAllTargetTypes: () => dispatch(fetchAllTargetTypes()),
  };
};

const connector = connect(mapStateToProps, mapDispatchToProps);

const AdvanceFilter = (props: any) => {
  const [expenseTypesListOptions, setExpenseTypesListOptions] = useState<any>(
    [],
  );
  // const [selectWeightage, setSelectWeightage] = useState<any>('');
  const [selectedExpenseCount, setSelectedExpenseCount] = useState([0]);
  const [entityNames, setEntityNames] = useState<any>({});
  const {
    selectWeightage,
    setSelectWeightage,
    applicableOn,
    setApplicableOn,
    setExpenseTypes,
    expenseTypes,
    selectIsEnforcement,
    setSelectIsEnforcement,
    applicableTo,
    setApplicableTo,
    listEntities,
    listDivisions,
    listBusinessUnits,
    listDepartments,
    listAllEmployeeGroups,
    listAllPayGrades,
    listAllSfEmployeeGroups,
    listExpenseTypes,
    setSearchApplicable_on,
    setSearchApplicable_to,
    setSearchExpense_types,
    fetchPolicyConfigurationAdvanceFilterData,
    setOpenFilterModal,
    listTargetTypes,
    _listAllTargetTypes,
    weightage,
    setWeightage,
    is_enforcement,
    setIsEnforcementData,
    setApplyFilterCount,
    applyFilterCount,
  } = props;

  useEffect(() => {
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
    setEntityNames(objLists);
  }, [listTargetTypes]);

  const handleApply = () => {
    setSearchApplicable_on(applicableOn);
    setSearchApplicable_to(applicableTo);
    setSearchExpense_types(expenseTypes);
    setWeightage(selectWeightage);
    setIsEnforcementData(selectIsEnforcement);
    fetchPolicyConfigurationAdvanceFilterData(
      applicableOn,
      applicableTo,
      expenseTypes,
      selectWeightage,
      selectIsEnforcement,
    );
    // setOpenFilterModal(false);
  };

  const handleClear = async () => {
    await fetchPolicyConfigurationAdvanceFilterData('', [], [], '', '');
    setApplicableOn('');
    setApplicableTo([]);
    setExpenseTypes([]);
    setSearchApplicable_on('');
    setSearchApplicable_to([]);
    setSearchExpense_types([]);
    setWeightage('');
    setIsEnforcementData('');
    setSelectWeightage('');
    setSelectIsEnforcement('');
    setApplyFilterCount([]);
    // setOpenFilterModal(false);
  };

  useEffect(() => {
    if (expenseTypes?.length === 0) {
      const filterData = applyFilterCount?.filter(
        (item: any) => item !== 'expenseType',
      );
      setApplyFilterCount(filterData);
    }
  }, [expenseTypes]);
  useEffect(() => {
    if (applicableTo?.length === 0) {
      setApplyFilterCount(
        applyFilterCount?.filter((item: any) => item !== 'applicable_to'),
      );
    }
  }, [applicableTo]);
  useEffect(() => {
    if (selectWeightage === '') {
      setApplyFilterCount(
        applyFilterCount?.filter((item: any) => item !== 'weightage'),
      );
    }
  }, [selectWeightage]);
  useEffect(() => {
    if (applicableOn === '') {
      setApplyFilterCount(
        applyFilterCount?.filter((item: any) => item !== 'applicable_on'),
      );
    }
  }, [applicableOn]);
  useEffect(() => {
    if (selectIsEnforcement === '' || selectIsEnforcement == 0) {
      setApplyFilterCount(
        applyFilterCount?.filter((item: any) => item !== 'is_enforcement'),
      );
    }
  }, [selectIsEnforcement]);

  const handleChangeValue = (key: string, value: any, data: any) => {
    if (key === 'applicable_on') {
      setApplicableTo([]);
      setApplyFilterCount(
        applyFilterCount?.filter((item: any) => item !== 'applicable_to'),
      );
      setApplicableOn(value);
      if (!applyFilterCount.includes(key)) {
        setApplyFilterCount([...applyFilterCount, key]);
      }
    }
    if (key === 'applicable_to') {
      setApplicableTo(value);
      if (!applyFilterCount.includes(key)) {
        setApplyFilterCount([...applyFilterCount, key]);
      }
    }
    if (key === 'expenseType') {
      setExpenseTypes(value);
      if (!applyFilterCount.includes(key)) {
        setApplyFilterCount([...applyFilterCount, key]);
      }
    }
    if (key === 'weightage') {
      setSelectWeightage(value);
      if (!applyFilterCount.includes(key)) {
        setApplyFilterCount([...applyFilterCount, key]);
      }
    }
    if (key === 'is_enforcement') {
      setSelectIsEnforcement(value === true ? 1 : 0);
      if (!applyFilterCount.includes(key)) {
        setApplyFilterCount([...applyFilterCount, key]);
      }
    }
  };

  useEffect(() => {
    getExpenseTypes();
    _listAllTargetTypes();
  }, []);

  const getExpenseTypes = async () => {
    const resp: AxiosResponse = await listAllExpanseTypes();
    let listExpenseTypes = resp.data;

    let code = listExpenseTypes?.map((item: any) => item.code);
    const response: AxiosResponse = await listAllExpenseCategoryService(
      code.join(','),
    );
    let listExpenseTypesLists = response.data;

    let expenseTypeObj: any = {};
    listExpenseTypes.forEach((item: any) => {
      expenseTypeObj[item?.code] = item?.title;
    });

    const tempData = [];

    for (const key in listExpenseTypesLists) {
      let optionData = {
        title: expenseTypeObj[key],
        value: key,
        key: key,
        data: key,
        type: 'parent',
        children: listExpenseTypesLists?.[key]?.map((ele: any) => {
          return {
            title: ele?.title,
            value: ele?.id,
            key: ele?.id,
            type: 'child',
            data: ele,
          };
        }),
      };
      tempData.push(optionData);
    }
    setExpenseTypesListOptions(tempData);
  };

  return (
    <>
      <div>
        <h3
          style={{
            fontWeight: 600,
          }}
        >
          Advance Filter
        </h3>
        <Row
          style={{ alignItems: 'center', rowGap: '15px', marginBottom: '15px' }}
        >
          <Col span={3}>
            <div>{<Trans>Target Groups</Trans>}</div>
          </Col>
          <Col span={8} style={{ marginRight: '45px' }}>
            <Select
              showSearch
              optionFilterProp='children'
              value={applicableOn}
              onChange={(ele: any, data: any) => {
                handleChangeValue('applicable_on', ele, data);
              }}
              style={{ width: '100%' }}
            >
              <Select.Option value={''}>Select</Select.Option>
              {listTargetTypes?.map((item: any, i: number) => {
                let value = '';
                if (item?.title === 'Company') {
                  value = 'ENTITY__COMPANY';
                } else if (item?.title === 'Division') {
                  value = 'ENTITY__DIVISION';
                } else if (item?.title === 'Business Unit') {
                  value = 'ENTITY__BUSINESS_UNIT';
                } else if (item?.title === 'Department') {
                  value = 'ENTITY__DEPARTMENT';
                } else {
                  value = '';
                }
                return (
                  <Select.Option key={i} value={value}>
                    {item?.display_text}
                  </Select.Option>
                );
              })}
              <Select.Option value={'EMPLOYEE_GROUP'}>
                Employee Group
              </Select.Option>
              <Select.Option value={'JOB_INFO_EMPLOYEE_GROUP'}>
                SF Employee Group
              </Select.Option>
              <Select.Option value={'JOB_INFO_PAY_GRADE'}>
                Pay Grade
              </Select.Option>
            </Select>
          </Col>
          {/* <Col span={1} /> */}
          {applicableOn === 'ENTITY__COMPANY' && (
            <>
              <Col span={3}>
                <div>
                  {
                    <Trans>
                      {' '}
                      {entityNames[applicableOn]?.display_text
                        ? `Select ${entityNames[applicableOn]?.display_text}`
                        : ''}
                    </Trans>
                  }
                </div>
              </Col>
              <Col span={8} style={{ marginRight: '45px' }}>
                <Select
                  id='selected'
                  value={applicableTo}
                  optionFilterProp='children'
                  onChange={(ele: any, data: any) => {
                    handleChangeValue('applicable_to', ele, data);
                  }}
                  mode='multiple'
                  placeholder='Select'
                  style={{ width: '100%' }}
                >
                  {listEntities.map((o: any) => (
                    <Select.Option key={o.id} value={`${o.uuid}`} data={o}>
                      {`${o?.title}`}
                    </Select.Option>
                  ))}
                </Select>
              </Col>
            </>
          )}
          {applicableOn === 'JOB_INFO_PAY_GRADE' && (
            <>
              <Col span={3}>
                <div>{<Trans>Select Pay Grade</Trans>}</div>
              </Col>
              <Col span={8} style={{ marginRight: '45px' }}>
                <Select
                  showSearch
                  optionFilterProp='children'
                  value={applicableTo}
                  onChange={(ele: any, data: any) => {
                    handleChangeValue('applicable_to', ele, data);
                  }}
                  mode='multiple'
                  placeholder='Select'
                  style={{ width: '100%' }}
                >
                  {listAllPayGrades.map((o: any) => (
                    <Select.Option key={o.id} value={`${o.id}`} data={o}>
                      {`${o?.title}`}
                    </Select.Option>
                  ))}
                </Select>
              </Col>
            </>
          )}
          {applicableOn === 'EMPLOYEE_GROUP' && (
            <>
              <Col span={3}>
                <div>{<Trans>Select Employee Group</Trans>}</div>
              </Col>
              <Col span={8} style={{ marginRight: '45px' }}>
                <Select
                  showSearch
                  optionFilterProp='children'
                  value={applicableTo}
                  onChange={(ele: any, data: any) => {
                    handleChangeValue('applicable_to', ele, data);
                  }}
                  mode='multiple'
                  placeholder='Select'
                  style={{ width: '100%' }}
                >
                  {listAllEmployeeGroups.map((o: any) => (
                    <Select.Option key={o.id} value={`${o.id}`} data={o}>
                      {`${o?.title}`}
                    </Select.Option>
                  ))}
                </Select>
              </Col>
            </>
          )}
          {applicableOn === 'JOB_INFO_EMPLOYEE_GROUP' && (
            <>
              <Col span={3}>
                <div>{<Trans>Select SF Employee Group</Trans>}</div>
              </Col>
              <Col span={8} style={{ marginRight: '45px' }}>
                <Select
                  showSearch
                  optionFilterProp='children'
                  value={applicableTo}
                  onChange={(ele: any, data: any) => {
                    handleChangeValue('applicable_to', ele, data);
                  }}
                  mode='multiple'
                  placeholder='Select'
                  style={{ width: '100%' }}
                >
                  {listAllSfEmployeeGroups?.map((o: any) => (
                    <Select.Option key={o.id} value={`${o.id}`} data={o}>
                      {`${o?.title}`}
                    </Select.Option>
                  ))}
                </Select>
              </Col>
            </>
          )}
          {applicableOn === 'ENTITY__DIVISION' && (
            <>
              <Col span={3}>
                <div>
                  {
                    <Trans>
                      {' '}
                      {entityNames[applicableOn]?.display_text
                        ? `Select ${entityNames[applicableOn]?.display_text}`
                        : ''}
                    </Trans>
                  }
                </div>
              </Col>
              <Col span={8} style={{ marginRight: '45px' }}>
                <Select
                  showSearch
                  optionFilterProp='children'
                  value={applicableTo}
                  onChange={(ele: any, data: any) => {
                    handleChangeValue('applicable_to', ele, data);
                  }}
                  mode='multiple'
                  placeholder='Select'
                  style={{ width: '100%' }}
                >
                  {listDivisions?.map((o: any) => (
                    <Select.Option key={o.id} value={`${o.uuid}`} data={o}>
                      {`${o?.title}`}
                    </Select.Option>
                  ))}
                </Select>
              </Col>
            </>
          )}
          {applicableOn === 'ENTITY__DEPARTMENT' && (
            <>
              <Col span={3}>
                <div>{<Trans>Select Department</Trans>}</div>
              </Col>
              <Col span={8} style={{ marginRight: '45px' }}>
                <Select
                  showSearch
                  optionFilterProp='children'
                  value={applicableTo}
                  onChange={(ele: any, data: any) => {
                    handleChangeValue('applicable_to', ele, data);
                  }}
                  mode='multiple'
                  placeholder='Select'
                  style={{ width: '100%' }}
                >
                  {listDepartments?.map((o: any) => (
                    <Select.Option key={o.id} value={`${o.uuid}`} data={o}>
                      {`${o?.title}`}
                    </Select.Option>
                  ))}
                </Select>
              </Col>
            </>
          )}
          {applicableOn === 'ENTITY__BUSINESS_UNIT' && (
            <>
              <Col span={3}>
                <div>
                  {
                    <Trans>
                      {' '}
                      {entityNames[applicableOn]?.display_text
                        ? `Select ${entityNames[applicableOn]?.display_text}`
                        : ''}
                    </Trans>
                  }
                </div>
              </Col>
              <Col span={8} style={{ marginRight: '45px' }}>
                <Select
                  showSearch
                  optionFilterProp='children'
                  value={applicableTo}
                  onChange={(ele: any, data: any) => {
                    handleChangeValue('applicable_to', ele, data);
                  }}
                  mode='multiple'
                  placeholder='Select'
                  style={{ width: '100%' }}
                >
                  {listBusinessUnits?.map((o: any) => (
                    <Select.Option key={o.id} value={`${o.uuid}`} data={o}>
                      {`${o?.title}`}
                    </Select.Option>
                  ))}
                </Select>
              </Col>
            </>
          )}
          {/* <Col span={1} /> */}
          <Col span={3}>
            <div>{<Trans>Expense Type</Trans>}</div>
          </Col>
          <Col span={8} style={{ marginRight: '45px' }}>
            <TreeSelect
              showSearch
              value={expenseTypes}
              treeData={expenseTypesListOptions}
              treeCheckable={true}
              maxTagCount={0}
              treeNodeFilterProp='title'
              treeDefaultExpandAll={true}
              maxTagPlaceholder={(e: any) => {
                return (
                  <span>
                    Selected {''} {expenseTypes.length}
                  </span>
                );
              }}
              placeholder='Select'
              style={{ width: '100%' }}
              onChange={(ele: any, list: any, extra: any) => {
                handleChangeValue('expenseType', ele, list);
              }}
            />
          </Col>
          {/* <Col span={1} /> */}
          <Col span={3}>
            <div>{<Trans>Severity Level</Trans>}</div>
          </Col>
          <Col span={8} style={{ marginRight: '45px' }}>
            <Select
              showSearch
              optionFilterProp='children'
              value={selectWeightage}
              onChange={(ele: any, data: any) => {
                handleChangeValue('weightage', ele, data);
              }}
              style={{ width: '100%' }}
            >
              <Select.Option value={''}>Select</Select.Option>
              <Select.Option value={1}>Low</Select.Option>
              <Select.Option value={10}>High</Select.Option>
            </Select>
          </Col>
          {/* <Col span={1} /> */}
        </Row>
        <Row>
          <Col span={4}>
            <Trans>Enforcement Enabled Policies :</Trans>
          </Col>
          <Col span={2}>
            <Switch
              checked={selectIsEnforcement}
              onChange={(ele: any, data: any) => {
                handleChangeValue('is_enforcement', ele, data);
              }}
            />
          </Col>
        </Row>
        <div className='policy-update-filter-action-wrapper'>
          <div>
            {applyFilterCount?.length !== 0 && (
              <div
                style={{
                  fontWeight: 600,
                  fontSize: '14px',
                  lineHeight: '21px',
                }}
              >
                Applied Filters :{' '}
                <span style={{ color: '#1890ff' }}>
                  {applyFilterCount?.length}
                </span>
              </div>
            )}
          </div>
          <div>
            <Button
              // shape='round'
              type='link'
              style={{ minWidth: '80px', margin: '2px 10px' }}
              onClick={() => handleClear()}
            >
              Reset
            </Button>
            <Button
              onClick={() => handleApply()}
              type='primary'
              // shape='round'
              style={{ minWidth: '150px', margin: '2px 10px' }}
            >
              Filter
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default memo(connector(AdvanceFilter));
