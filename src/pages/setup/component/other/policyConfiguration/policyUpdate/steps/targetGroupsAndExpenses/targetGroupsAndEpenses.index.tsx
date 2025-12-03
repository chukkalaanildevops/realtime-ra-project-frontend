/* eslint-disable no-unused-expressions */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { Dispatch, memo, useEffect, useState } from 'react';
import {
  Row,
  Col,
  Typography,
  Form,
  // Input,
  Select,
  Button,
  TreeSelect,
  Popover,
  Radio,
  Checkbox,
  Input,
} from 'antd';
import './targetGrouposAndExpenses.index.less';
import { Trans } from '@lingui/macro';
import {
  fetchAllExpanseTypes,
  fetchAllSfEmployeeGroups,
  fetchListAllEmployeeGroups,
  fetchListAllPayGrades,
  fetchListDepartments,
  fetchListDivisions,
  fetchListEntitiesCompany,
  fetchListBusinessUnits,
  fetchExpenseCategory,
  // fetchAllRequestTypes,
} from '../../../policyConfiguration.thunk';
// import MultiSelectCheckboxes from 'react-multiselect-checkboxes';
import { connect } from 'react-redux';
import {
  listAllExpenseCategoryService,
  listAllRequestTypes,
} from '../../../../../../../../services/policyConfiguration';
import { AxiosResponse } from 'axios';
import { CloseOutlined, SearchOutlined } from '@ant-design/icons';
import { ReactComponent as Vector } from '../../../../../../../../assets/images/default/Vector.svg';
import { TreeNode } from 'antd/lib/tree-select';
import TreeSelectWithSearch from './TreeSelectWithSearch';
// import { StatusTag } from '../../../../../../../../shared/components';

type SizeType = Parameters<typeof Form>[0]['size'];

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
  };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  return {
    _listEntities: () => dispatch(fetchListEntitiesCompany()),
    _listDivisions: () => dispatch(fetchListDivisions()),
    _listBusinessUnits: () => dispatch(fetchListBusinessUnits),
    _listDepartments: () => dispatch(fetchListDepartments()),
    _listAllEmployeeGroups: () => dispatch(fetchListAllEmployeeGroups()),
    _listAllPayGrades: () => dispatch(fetchListAllPayGrades()),
    _listAllSfEmployeeGroups: () => dispatch(fetchAllSfEmployeeGroups()),
    _listAllExpenseTypes: () => dispatch(fetchAllExpanseTypes()),
    _listExpenseCategory: (category: any) =>
      dispatch(fetchExpenseCategory(category)),
    // _listAllRequestTypes: () => dispatch(fetchAllRequestTypes()),
  };
};

const connector = connect(mapStateToProps, mapDispatchToProps);

const TargetGroupsAndEpenses = (props: any) => {
  const {
    listEntities,
    listDivisions,
    listBusinessUnits,
    listDepartments,
    listAllEmployeeGroups,
    listAllPayGrades,
    listAllSfEmployeeGroups,
    listExpenseTypes,
    setPolicyConfiguration,
    policyConfiguration,
    handleAddNewGroup,
    handleRemoveGroup,
    listTargetTypes,
    entityNames,
  } = props;

  let requestTypesList: any = {
    GEN: 'General',
    TRA: ' Travel',
  };

  const [componentSize, setComponentSize] = useState<SizeType | 'default'>(
    'default',
  );

  const onFormLayoutChange = ({ size }: { size: SizeType }) => {
    setComponentSize(size);
  };
  const { Title } = Typography;
  const [selectedExpenseCount, setSelectedExpenseCount] = useState([0]);
  const [selectedRequestCount, setSelectedRequestCount] = useState([0]);
  const [isOpenPopover, setIsOpenPopover] = useState(false);
  const [isRequestList, setIsRequestList] = useState<any>([2]);
  const [checkOptionsList, setCheckOptionsList] = useState<any>([]);
  const [treeListEntities, setTreeListEntities] = useState([]);
  const [treeListDivisions, setTreeListDivisions] = useState([]);
  const [treeListBusinessUnits, setTreeListBusinessUnits] = useState([]);
  const [treeListDepartments, setTreeListDepartments] = useState([]);
  const [treeListAllEmployeeGroups, setTreeListAllEmployeeGroups] = useState(
    [],
  );
  const [treeListAllPayGrades, setTreeListAllPayGrades] = useState([]);
  const [
    treeListAllSfEmployeeGroups,
    setTreeListAllSfEmployeeGroups,
  ] = useState([]);
  const [treeListExpenseTypes, setTreeListExpenseTypes] = useState([]);

  const [searchValue, setSearchValue] = useState('');
  const [filteredData, setFilteredData] = useState<any>([]);

  useEffect(() => {
    let selected_count: any = [];
    let selected_request_count: any = [];
    policyConfiguration.forEach((ele: any, i: any) => {
      let count = 0;
      for (const key in ele.selected_claim_types) {
        count = count + ele.selected_claim_types[key].length;
      }
      selected_count = [...selected_count, count];
    });
    setSelectedExpenseCount(selected_count);
    policyConfiguration.forEach((ele: any, i: any) => {
      let requestCount = 0;
      for (const key in ele.selected_request_types) {
        requestCount = requestCount + ele.selected_request_types[key].length;
      }
      selected_request_count = [...selected_request_count, requestCount];
    });
    setSelectedRequestCount(selected_request_count);
  }, [policyConfiguration]);

  useEffect(() => {}, []);
  const handleChangeValue = (
    index: number,
    key: string,
    value: any,
    data: any,
  ) => {
    let newData = Object.assign([], policyConfiguration);
    newData[index] = {
      ...newData[index],
      [key]: value,
      selected_applicable_to: data,
    };
    if (key === 'applicable_on')
      newData[index] = { ...newData[index], applicable_to: [] };
    setPolicyConfiguration(newData);
  };

  const onExpenseCategoryChange = async (index: number, option: any) => {
    let code = option.join(',');
    let isNewCategoryAdded = false;

    if (option.length > policyConfiguration[index].expenseCategory.length) {
      isNewCategoryAdded = true;
    }

    if (code) {
      const response: AxiosResponse = await listAllExpenseCategoryService(code);
      let listExpenseTypesLists = response.data;

      let expenseTypeObj: any = {};
      listExpenseTypes.forEach((item: any) => {
        expenseTypeObj[item?.code] = item?.title;
      });

      const tempData = [];
      let selectedData: any = [];
      let filteredData: any = {};
      let value: any = [policyConfiguration[index]?.claim_types];
      let expenseTypesData: any;
      for (const key in listExpenseTypesLists) {
        let optionData = {
          title: expenseTypeObj[key],
          value: key,
          key: key,
          data: key,
          type: 'parent',
          children: listExpenseTypesLists[key].map((ele: any) => {
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
        selectedData = [
          ...selectedData,
          ...listExpenseTypesLists[key].map((item: any) => item?.id),
        ];

        // value = [
        //   ...policyConfiguration[index].claim_types,
        //   ...listExpenseTypesLists[key].map((item: any) => item?.id),
        // ];

        listExpenseTypesLists[key]?.map((item: any) => value.push(item?.id));

        expenseTypesData = {
          ...policyConfiguration[index].selected_claim_types,
          ...response.data,
        };
      }
      for (const opt of option) {
        if (expenseTypesData[opt]) {
          filteredData[opt] = await expenseTypesData[opt].filter((item: any) =>
            value?.includes(item.id),
          );
        }
      }

      let selectedClaimTypes = policyConfiguration[index].claim_types;

      let claimTypes: any = [];
      let selected_claim_types: any = {};
      if (isNewCategoryAdded) {
        for (const key in filteredData) {
          let ids = filteredData[key].map((item: any) => item.id);
          claimTypes = [...claimTypes, ...ids];
        }
      } else {
        for (const key in filteredData) {
          let selectedItems: any = [];
          filteredData[key].forEach((item: any) => {
            const isInclude = selectedClaimTypes.includes(item.id);
            if (isInclude) {
              selectedItems = [...selectedItems, item];
            }
          });
          selected_claim_types = {
            ...selected_claim_types,
            [key]: selectedItems,
          };
        }
        for (const key in selected_claim_types) {
          let ids = selected_claim_types[key].map((item: any) => item.id);
          claimTypes = [...claimTypes, ...ids];
        }
      }
      let newData = Object.assign([], policyConfiguration);
      newData[index] = {
        ...newData[index],
        expenseTypesListOptions: tempData,
        expenseCategory: option,
        claim_types: claimTypes,
        expenseTypes: response.data,
        selected_claim_types: isNewCategoryAdded
          ? filteredData
          : selected_claim_types,
      };
      setPolicyConfiguration(newData);
    } else {
      let newData = Object.assign([], policyConfiguration);
      newData[index] = {
        ...newData[index],
        expenseTypesListOptions: [],
        expenseCategory: option,
        claim_types: [],
        expenseTypes: [],
        selected_claim_types: {},
      };
      setPolicyConfiguration(newData);
    }
  };

  const onRequestCategoryChange = async (index: any, option: any) => {
    let code = option.join(',');
    let isNewCategoryAdded = false;

    if (option.length > policyConfiguration[index]?.requestCategory?.length) {
      isNewCategoryAdded = true;
    }

    if (code) {
      const response: AxiosResponse = await listAllRequestTypes(code);
      let listRequestTypesLists = response.data;

      let requestTypeObj: any = {};
      ['GEN', 'TRA'].forEach((item: any) => {
        requestTypeObj[item] = requestTypesList[item];
      });

      const tempData = [];
      let selectedData: any = [];
      let filteredData: any = {};
      let value: any = [policyConfiguration[index]?.request_types];
      let requestTypesData: any;
      for (const key in listRequestTypesLists) {
        let optionData = {
          title: requestTypeObj[key],
          value: key,
          key: key,
          data: key,
          type: 'parent',
          children: listRequestTypesLists[key]?.map((ele: any) => {
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
        selectedData = [
          ...selectedData,
          ...listRequestTypesLists[key]?.map((item: any) => item?.id),
        ];

        listRequestTypesLists[key]?.map((item: any) => value.push(item?.id));

        // value = [
        //   // ...policyConfiguration[index]?.request_types,
        //   ...listRequestTypesLists[key]?.map((item: any) => item?.id),
        // ];

        requestTypesData = {
          ...policyConfiguration[index]?.selected_request_types,
          ...response?.data,
        };
      }
      for (const opt of option) {
        if (requestTypesData[opt]) {
          filteredData[opt] = await requestTypesData[opt].filter((item: any) =>
            value?.includes(item.id),
          );
        }
      }

      let selectedRequestTypes = policyConfiguration[index]?.request_types;

      let requestTypes: any = [];
      let selected_request_types: any = {};
      if (isNewCategoryAdded) {
        for (const key in filteredData) {
          let ids = filteredData[key]?.map((item: any) => item?.id);
          requestTypes = [...requestTypes, ...ids];
        }
      } else {
        for (const key in filteredData) {
          let selectedItems: any = [];
          // eslint-disable-next-line no-unused-expressions
          filteredData[key]?.forEach((item: any) => {
            const isInclude = selectedRequestTypes.includes(item?.id);
            if (isInclude) {
              selectedItems = [...selectedItems, item];
            }
          });
          selected_request_types = {
            ...selected_request_types,
            [key]: selectedItems,
          };
        }
        for (const key in selected_request_types) {
          let ids = selected_request_types[key]?.map((item: any) => item?.id);
          requestTypes = [...requestTypes, ...ids];
        }
      }
      let newData = Object.assign([], policyConfiguration);
      newData[index] = {
        ...newData[index],
        requestTypesListOptions: tempData,
        requestCategory: option,
        request_types: requestTypes,
        requestTypes: response.data,
        selected_request_types: isNewCategoryAdded
          ? filteredData
          : selected_request_types,
      };
      setPolicyConfiguration(newData);
    } else {
      let newData = Object.assign([], policyConfiguration);
      newData[index] = {
        ...newData[index],
        requestTypesListOptions: [],
        requestCategory: option,
        request_types: [],
        requestTypes: [],
        selected_request_types: {},
      };
      setPolicyConfiguration(newData);
    }
  };

  const handleChangeExpenseTypes = (index: number, value: any, data: any) => {
    let newData = Object.assign([], policyConfiguration);

    let filteredData: any = {};
    let expenseTypesData = policyConfiguration[index]?.expenseTypes;
    for (let key in expenseTypesData) {
      filteredData[key] = expenseTypesData[key].filter((obj: any) =>
        value.includes(obj.id),
      );
    }

    newData[index] = {
      ...newData[index],
      claim_types: value,
      selected_claim_types: filteredData,
    };
    setPolicyConfiguration(newData);
  };

  const handleChangeRequestTypes = (index: number, value: any, data: any) => {
    let newData = Object.assign([], policyConfiguration);

    let filteredData: any = {};
    let requestTypesData = policyConfiguration[index]?.requestTypes;
    for (let key in requestTypesData) {
      filteredData[key] = requestTypesData[key]?.filter((obj: any) =>
        value.includes(obj.id),
      );
    }

    newData[index] = {
      ...newData[index],
      request_types: value,
      selected_request_types: filteredData,
    };
    setPolicyConfiguration(newData);
  };

  useEffect(() => {
    const newData = policyConfiguration?.map((item: any) => {
      let ele = item;
      if (item?.request_types?.length || item?.requestCheck === undefined) {
        ele.requestCheck = true;
      }
      return ele;
    });
    setPolicyConfiguration(newData);
  }, []);

  const handleSelectApplicableTo = async (e: any, index: any) => {
    let newData = Object.assign([], policyConfiguration);
    newData[index] = {
      ...newData[index],
      requestCheck: e.includes(0),
      claimCheck: e.includes(1),
    };
    await setPolicyConfiguration(newData);
  };

  function removeRequestTypes(data: any) {
    const filterPolicyConfiguration = data?.filter((item: any) => {
      if (item?.requestCheck === false) {
        delete item?.request_types;
      }
      return item;
    });
    return filterPolicyConfiguration;
  }

  function removeElementFromArray(arr: any, val: any) {
    const index = arr.indexOf(val);
    if (index > -1) {
      arr.splice(index, 1);
    }
  }

  const handleRemoveExpenseTypes = (
    policyIndex: number,
    type: any,
    data: any,
  ) => {
    let new_claim_types = Object.assign(
      [],
      policyConfiguration[policyIndex]?.claim_types,
    );
    removeElementFromArray(new_claim_types, data?.id);
    let new_selected_val = Object.assign(
      {},
      policyConfiguration[policyIndex]?.selected_claim_types,
    );
    if (new_selected_val[type]) {
      new_selected_val[type] = new_selected_val[type].filter(
        (item: any) => item?.id !== data?.id,
      );
    }

    let newData = Object.assign([], policyConfiguration);
    newData[policyIndex] = {
      ...newData[policyIndex],
      claim_types: new_claim_types,
      selected_claim_types: new_selected_val,
    };
    setPolicyConfiguration(newData);
  };

  const handleRemoveRequestTypes = (
    policyIndex: number,
    type: any,
    data: any,
  ) => {
    let new_request_types = Object.assign(
      [],
      policyConfiguration[policyIndex]?.request_types,
    );
    removeElementFromArray(new_request_types, data?.id);
    let new_selected_val = Object.assign(
      {},
      policyConfiguration[policyIndex]?.selected_request_types,
    );
    if (new_selected_val[type]) {
      new_selected_val[type] = new_selected_val[type].filter(
        (item: any) => item?.id !== data?.id,
      );
    }

    let newData = Object.assign([], policyConfiguration);
    newData[policyIndex] = {
      ...newData[policyIndex],
      request_types: new_request_types,
      selected_request_types: new_selected_val,
    };
    setPolicyConfiguration(newData);
  };

  const content = (
    <div>
      <div style={{ display: 'flex' }}>
        <Vector
          style={{
            margin: '5px 10px',
            width: '16px',
            height: '16px',
          }}
        />
        <p style={{ marginBottom: '0', marginRight: '15px', maxWidth: '85%' }}>
          Target Groups are the groups that are intended to have this policy
        </p>
      </div>
      <CloseOutlined
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          cursor: 'pointer',
        }}
        onClick={() => setIsOpenPopover(false)}
      />
    </div>
  );

  const terms: any = document.querySelector('#page-container');

  terms.addEventListener('scroll', function() {
    if (isOpenPopover) setIsOpenPopover(false);
  });
  terms.addEventListener('click', function() {
    if (isOpenPopover) setIsOpenPopover(false);
  });

  useEffect(() => {
    const array: any = [
      {
        data: 'Select All',
        key: 'Select All',
        title: 'Select All',
        type: 'parent',
        value: listEntities?.map((item: any) => item),
        children: listEntities?.map((item: any) => {
          return {
            data: item,
            key: item.id,
            title: item?.title,
            type: 'child',
            value: item?.uuid,
          };
        }),
      },
    ];
    setTreeListEntities(array);
  }, [listEntities]);
  useEffect(() => {
    const array: any = [
      {
        data: 'Select All',
        key: 'Select All',
        title: 'Select All',
        type: 'parent',
        value: listDivisions?.map((item: any) => item),
        children: listDivisions?.map((item: any) => {
          return {
            data: item,
            key: item.id,
            title: item?.title,
            type: 'child',
            value: item?.uuid,
          };
        }),
      },
    ];
    setTreeListDivisions(array);
  }, [listDivisions]);
  useEffect(() => {
    const array: any = [
      {
        data: 'Select All',
        key: 'Select All',
        title: 'Select All',
        type: 'parent',
        value: listBusinessUnits?.map((item: any) => item),
        children: listBusinessUnits?.map((item: any) => {
          return {
            data: item,
            key: item.id,
            title: item?.title,
            type: 'child',
            value: item?.uuid,
          };
        }),
      },
    ];
    setTreeListBusinessUnits(array);
  }, [listBusinessUnits]);
  useEffect(() => {
    const array: any = [
      {
        data: 'Select All',
        key: 'Select All',
        title: 'Select All',
        type: 'parent',
        value: listDepartments?.map((item: any) => item),
        children: listDepartments?.map((item: any) => {
          return {
            data: item,
            key: item.id,
            title: item?.title,
            type: 'child',
            value: item?.uuid,
          };
        }),
      },
    ];
    setTreeListDepartments(array);
  }, [listDepartments]);
  useEffect(() => {
    const array: any = [
      {
        data: 'Select All',
        key: 'Select All',
        title: 'Select All',
        type: 'parent',
        value: listAllEmployeeGroups?.map((item: any) => item),
        children: listAllEmployeeGroups?.map((item: any) => {
          return {
            data: item,
            key: item.id,
            title: item?.title,
            type: 'child',
            value: item?.id.toString(),
          };
        }),
      },
    ];
    setTreeListAllEmployeeGroups(array);
  }, [listAllEmployeeGroups]);
  useEffect(() => {
    const array: any = [
      {
        data: 'Select All',
        key: 'Select All',
        title: 'Select All',
        type: 'parent',
        value: listAllPayGrades?.map((item: any) => item),
        children: listAllPayGrades?.map((item: any) => {
          return {
            data: item,
            key: item.id,
            title: item?.title,
            type: 'child',
            value: item.id.toString(),
          };
        }),
      },
    ];
    setTreeListAllPayGrades(array);
  }, [listAllPayGrades]);

  useEffect(() => {
    const array: any = [
      {
        data: 'Select All',
        key: 'Select All',
        title: 'Select All',
        type: 'parent',
        value: listAllSfEmployeeGroups?.map((item: any) => item),
        children: listAllSfEmployeeGroups?.map((item: any) => {
          return {
            data: item,
            key: item.id,
            title: item?.title,
            type: 'child',
            value: item?.id.toString(),
          };
        }),
      },
    ];
    setTreeListAllSfEmployeeGroups(array);
  }, [listAllSfEmployeeGroups]);
  useEffect(() => {
    const array: any = [
      {
        data: 'Select All',
        key: 'Select All',
        title: 'Select All',
        type: 'parent',
        value: 'Select All',
        children: listExpenseTypes?.map((item: any) => {
          return {
            data: item,
            key: item.code,
            title: item?.title,
            type: 'child',
            value: item?.code,
          };
        }),
      },
    ];
    setTreeListExpenseTypes(array);
  }, [listExpenseTypes]);

  return (
    <>
      <Title level={5} className='d-flex'>
        <Trans>Target Groups & Expense Details</Trans>
        <Popover
          placement='right'
          content={content}
          trigger='click'
          visible={isOpenPopover}
          onVisibleChange={() => setIsOpenPopover(true)}
        >
          <Vector
            style={{
              margin: '4px 0 0 15px',
              width: '16px',
              height: '16px',
              cursor: 'pointer',
            }}
          />
        </Popover>

        <Button
          type='link'
          style={{ marginLeft: 'auto' }}
          onClick={() => handleAddNewGroup()}
        >
          + Add Target Group
        </Button>
      </Title>
      <Row>
        {policyConfiguration?.map((policyData: any, policyIndex: number) => (
          <Col
            id='box1'
            key={policyIndex}
            span={24}
            className='steper-container-box'
            style={{ margin: '10px 0' }}
          >
            <Title level={5} className='d-flex'>
              Target Group {policyIndex + 1}
              {policyConfiguration.length > 1 && (
                <Button
                  type='link'
                  danger
                  style={{ marginLeft: 'auto' }}
                  onClick={() => handleRemoveGroup(policyIndex)}
                >
                  Remove
                </Button>
              )}
            </Title>
            <Row>
              <Col span={24} className='steper-container-box'>
                <Form
                  labelCol={{ span: 16 }}
                  wrapperCol={{ span: 20 }}
                  layout='horizontal'
                  initialValues={{ size: componentSize }}
                  onValuesChange={onFormLayoutChange}
                  size={componentSize as SizeType}
                >
                  <Row style={{ marginTop: '30px' }}>
                    <Col span={6}>
                      <div>{<Trans>Select Target Group*</Trans>}</div>
                    </Col>
                    <Col span={14}>
                      <Select
                        style={{ width: '100%' }}
                        showSearch
                        optionFilterProp='children'
                        value={policyData?.applicable_on}
                        onChange={(ele: any, data: any) => {
                          handleChangeValue(
                            policyIndex,
                            'applicable_on',
                            ele,
                            data,
                          );
                        }}
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
                        {/* <Select.Option value={''}>Select</Select.Option>
                          <Select.Option value={'ENTITY__COMPANY'}>
                            Company
                          </Select.Option>
                          <Select.Option value={'ENTITY__DIVISION'}>
                            Division
                          </Select.Option> */}
                        <Select.Option value={'EMPLOYEE_GROUP'}>
                          Employee Group
                        </Select.Option>
                        {/* <Select.Option value={'ENTITY__BUSINESS_UNIT'}>
                            Business Unit
                          </Select.Option>
                          <Select.Option value={'ENTITY__DEPARTMENT'}>
                            Department
                          </Select.Option> */}
                        <Select.Option value={'JOB_INFO_EMPLOYEE_GROUP'}>
                          SF Employee Group
                        </Select.Option>
                        <Select.Option value={'JOB_INFO_PAY_GRADE'}>
                          Pay Grade
                        </Select.Option>
                      </Select>
                    </Col>
                    <Col span={4} />
                  </Row>

                  {policyData?.applicable_on === 'ENTITY__COMPANY' && (
                    <>
                      <Row style={{ marginTop: '30px' }}>
                        <Col span={6}>
                          <div>
                            {
                              <Trans>
                                {' '}
                                {entityNames[policyData?.applicable_on]
                                  ?.display_text
                                  ? `Select ${
                                      entityNames[policyData?.applicable_on]
                                        ?.display_text
                                    }*`
                                  : ''}
                              </Trans>
                            }
                          </div>
                        </Col>
                        <Col span={14}>
                          <span
                            style={{
                              color: '#000',
                              position: 'absolute',
                              top: '-22px',
                              right: '25px',
                            }}
                          >{`${policyData?.applicable_to?.length} Selected`}</span>
                          <TreeSelect
                            showSearch
                            value={policyData?.applicable_to}
                            maxTagCount='responsive'
                            className='select-options-tag'
                            treeData={treeListEntities}
                            treeCheckable={true}
                            // maxTagCount={0}
                            treeNodeFilterProp='title'
                            treeDefaultExpandAll={true}
                            maxTagPlaceholder={(e: any) => {
                              return <span>...</span>;
                            }}
                            placeholder='Select'
                            style={{ width: '100%' }}
                            onChange={(
                              ele: any,
                              selectedNodes: React.ReactNode[],
                              extra: any,
                            ) => {
                              let result;
                              let length = false;
                              result = extra?.allCheckedNodes?.map(
                                (node: any, i: number) => {
                                  if (node?.children?.length) {
                                    length = true;
                                    return node?.node?.props?.value?.map(
                                      (item: any) => {
                                        return {
                                          children: item?.title,
                                          data: item,
                                          key: item?.title,
                                          value: item?.title,
                                          tryAgain: false,
                                        };
                                      },
                                    );
                                  } else {
                                    return {
                                      children: node?.node?.props?.title,
                                      data: node?.node?.props?.data,
                                      key: node?.node?.props?.title,
                                      value: node?.node?.props?.title,
                                      tryAgain: false,
                                    };
                                  }
                                },
                              );
                              handleChangeValue(
                                policyIndex,
                                'applicable_to',
                                ele,
                                length ? result[0] : result,
                              );
                            }}
                          />
                        </Col>
                        <Col span={4} />
                      </Row>
                    </>
                  )}

                  {policyData?.applicable_on === 'JOB_INFO_PAY_GRADE' && (
                    <Row style={{ marginTop: '30px' }}>
                      <Col span={6}>
                        <div>{<Trans>Select Pay Grade*</Trans>}</div>
                      </Col>
                      <Col span={14}>
                        <span
                          style={{
                            color: '#000',
                            position: 'absolute',
                            top: '-22px',
                            right: '25px',
                          }}
                        >{`${policyData?.applicable_to?.length} Selected`}</span>
                        <TreeSelect
                          showSearch
                          value={policyData?.applicable_to}
                          maxTagCount='responsive'
                          className='select-options-tag'
                          treeData={treeListAllPayGrades}
                          treeCheckable={true}
                          // maxTagCount={0}
                          treeNodeFilterProp='title'
                          treeDefaultExpandAll={true}
                          maxTagPlaceholder={(e: any) => {
                            return <span>...</span>;
                          }}
                          placeholder='Select'
                          style={{ width: '100%' }}
                          onChange={(
                            ele: any,
                            selectedNodes: React.ReactNode[],
                            extra: any,
                          ) => {
                            let result;
                            let length = false;
                            result = extra?.allCheckedNodes?.map(
                              (node: any, i: number) => {
                                if (node?.children?.length) {
                                  length = true;
                                  return node?.node?.props?.value?.map(
                                    (item: any) => {
                                      return {
                                        children: item?.title,
                                        data: item,
                                        key: item?.title,
                                        value: item?.title,
                                        tryAgain: false,
                                      };
                                    },
                                  );
                                } else {
                                  return {
                                    children: node?.node?.props?.title,
                                    data: node?.node?.props?.data,
                                    key: node?.node?.props?.title,
                                    value: node?.node?.props?.title,
                                    tryAgain: false,
                                  };
                                }
                              },
                            );
                            handleChangeValue(
                              policyIndex,
                              'applicable_to',
                              ele,
                              length ? result[0] : result,
                            );
                          }}
                        />
                      </Col>
                      <Col span={4} />
                    </Row>
                  )}

                  {policyData?.applicable_on === 'EMPLOYEE_GROUP' && (
                    <Row style={{ marginTop: '30px' }}>
                      <Col span={6}>
                        <div>{<Trans>Select Employee Group*</Trans>}</div>
                      </Col>
                      <Col span={14}>
                        <span
                          style={{
                            color: '#000',
                            position: 'absolute',
                            top: '-22px',
                            right: '25px',
                          }}
                        >{`${policyData?.applicable_to?.length} Selected`}</span>
                        <TreeSelect
                          showSearch
                          value={policyData?.applicable_to}
                          maxTagCount='responsive'
                          className='select-options-tag'
                          treeData={treeListAllEmployeeGroups}
                          treeCheckable={true}
                          // maxTagCount={0}
                          treeNodeFilterProp='title'
                          treeDefaultExpandAll={true}
                          maxTagPlaceholder={(e: any) => {
                            return <span>...</span>;
                          }}
                          placeholder='Select'
                          style={{ width: '100%' }}
                          onChange={(
                            ele: any,
                            selectedNodes: React.ReactNode[],
                            extra: any,
                          ) => {
                            let result;
                            let length = false;
                            result = extra?.allCheckedNodes?.map(
                              (node: any, i: number) => {
                                if (node?.children?.length) {
                                  length = true;
                                  return node?.node?.props?.value?.map(
                                    (item: any) => {
                                      return {
                                        children: item?.title,
                                        data: item,
                                        key: item?.title,
                                        value: item?.title,
                                        tryAgain: false,
                                      };
                                    },
                                  );
                                } else {
                                  return {
                                    children: node?.node?.props?.title,
                                    data: node?.node?.props?.data,
                                    key: node?.node?.props?.title,
                                    value: node?.node?.props?.title,
                                    tryAgain: false,
                                  };
                                }
                              },
                            );
                            handleChangeValue(
                              policyIndex,
                              'applicable_to',
                              ele,
                              length ? result[0] : result,
                            );
                          }}
                        />
                      </Col>
                      <Col span={4} />
                    </Row>
                  )}

                  {policyData?.applicable_on === 'JOB_INFO_EMPLOYEE_GROUP' && (
                    <Row style={{ marginTop: '30px' }}>
                      <Col span={6}>
                        <div>{<Trans>Select SF Employee Group*</Trans>}</div>
                      </Col>
                      <Col span={14}>
                        <span
                          style={{
                            color: '#000',
                            position: 'absolute',
                            top: '-22px',
                            right: '25px',
                          }}
                        >{`${policyData?.applicable_to?.length} Selected`}</span>
                        <TreeSelect
                          showSearch
                          value={policyData?.applicable_to}
                          maxTagCount='responsive'
                          className='select-options-tag'
                          treeData={treeListAllSfEmployeeGroups}
                          treeCheckable={true}
                          // maxTagCount={0}
                          treeNodeFilterProp='title'
                          treeDefaultExpandAll={true}
                          maxTagPlaceholder={(e: any) => {
                            return <span>...</span>;
                          }}
                          placeholder='Select'
                          style={{ width: '100%' }}
                          onChange={(
                            ele: any,
                            selectedNodes: React.ReactNode[],
                            extra: any,
                          ) => {
                            let result;
                            let length = false;
                            result = extra?.allCheckedNodes?.map(
                              (node: any, i: number) => {
                                if (node?.children?.length) {
                                  length = true;
                                  return node?.node?.props?.value?.map(
                                    (item: any) => {
                                      return {
                                        children: item?.title,
                                        data: item,
                                        key: item?.title,
                                        value: item?.title,
                                        tryAgain: false,
                                      };
                                    },
                                  );
                                } else {
                                  return {
                                    children: node?.node?.props?.title,
                                    data: node?.node?.props?.data,
                                    key: node?.node?.props?.title,
                                    value: node?.node?.props?.title,
                                    tryAgain: false,
                                  };
                                }
                              },
                            );
                            handleChangeValue(
                              policyIndex,
                              'applicable_to',
                              ele,
                              length ? result[0] : result,
                            );
                          }}
                        />
                      </Col>
                      <Col span={4} />
                    </Row>
                  )}
                  {policyData?.applicable_on === 'ENTITY__DIVISION' && (
                    <Row style={{ marginTop: '30px' }}>
                      <Col span={6}>
                        <div>
                          {
                            <Trans>
                              {' '}
                              {entityNames[policyData?.applicable_on]
                                ?.display_text
                                ? `Select ${
                                    entityNames[policyData?.applicable_on]
                                      ?.display_text
                                  }*`
                                : ''}
                            </Trans>
                          }
                        </div>
                      </Col>
                      <Col span={14}>
                        <span
                          style={{
                            color: '#000',
                            position: 'absolute',
                            top: '-22px',
                            right: '25px',
                          }}
                        >{`${policyData?.applicable_to?.length} Selected`}</span>
                        <TreeSelect
                          showSearch
                          value={policyData?.applicable_to}
                          maxTagCount='responsive'
                          className='select-options-tag'
                          treeData={treeListDivisions}
                          treeCheckable={true}
                          // maxTagCount={0}
                          treeNodeFilterProp='title'
                          treeDefaultExpandAll={true}
                          maxTagPlaceholder={(e: any) => {
                            return <span>...</span>;
                          }}
                          placeholder='Select'
                          style={{ width: '100%' }}
                          onChange={(
                            ele: any,
                            selectedNodes: React.ReactNode[],
                            extra: any,
                          ) => {
                            let result;
                            let length = false;
                            result = extra?.allCheckedNodes?.map(
                              (node: any, i: number) => {
                                if (node?.children?.length) {
                                  length = true;
                                  return node?.node?.props?.value?.map(
                                    (item: any) => {
                                      return {
                                        children: item?.title,
                                        data: item,
                                        key: item?.title,
                                        value: item?.title,
                                        tryAgain: false,
                                      };
                                    },
                                  );
                                } else {
                                  return {
                                    children: node?.node?.props?.title,
                                    data: node?.node?.props?.data,
                                    key: node?.node?.props?.title,
                                    value: node?.node?.props?.title,
                                    tryAgain: false,
                                  };
                                }
                              },
                            );
                            handleChangeValue(
                              policyIndex,
                              'applicable_to',
                              ele,
                              length ? result[0] : result,
                            );
                          }}
                        />
                      </Col>
                      <Col span={4} />
                    </Row>
                  )}

                  {policyData?.applicable_on === 'ENTITY__DEPARTMENT' && (
                    <Row style={{ marginTop: '30px' }}>
                      <Col span={6}>
                        <div>
                          {
                            <Trans>
                              {' '}
                              {entityNames[policyData?.applicable_on]
                                ?.display_text
                                ? `Select ${
                                    entityNames[policyData?.applicable_on]
                                      ?.display_text
                                  }*`
                                : ''}
                            </Trans>
                          }
                        </div>
                      </Col>
                      <Col span={14}>
                        <span
                          style={{
                            color: '#000',
                            position: 'absolute',
                            top: '-22px',
                            right: '25px',
                          }}
                        >{`${policyData?.applicable_to?.length} Selected`}</span>
                        <TreeSelect
                          showSearch
                          value={policyData?.applicable_to}
                          maxTagCount='responsive'
                          className='select-options-tag'
                          treeData={treeListDepartments}
                          treeCheckable={true}
                          // maxTagCount={0}
                          treeNodeFilterProp='title'
                          treeDefaultExpandAll={true}
                          maxTagPlaceholder={(e: any) => {
                            return <span>...</span>;
                          }}
                          placeholder='Select'
                          style={{ width: '100%' }}
                          onChange={(
                            ele: any,
                            selectedNodes: React.ReactNode[],
                            extra: any,
                          ) => {
                            let result;
                            let length = false;
                            result = extra?.allCheckedNodes?.map(
                              (node: any, i: number) => {
                                if (node?.children?.length) {
                                  length = true;
                                  return node?.node?.props?.value?.map(
                                    (item: any) => {
                                      return {
                                        children: item?.title,
                                        data: item,
                                        key: item?.title,
                                        value: item?.title,
                                        tryAgain: false,
                                      };
                                    },
                                  );
                                } else {
                                  return {
                                    children: node?.node?.props?.title,
                                    data: node?.node?.props?.data,
                                    key: node?.node?.props?.title,
                                    value: node?.node?.props?.title,
                                    tryAgain: false,
                                  };
                                }
                              },
                            );
                            handleChangeValue(
                              policyIndex,
                              'applicable_to',
                              ele,
                              length ? result[0] : result,
                            );
                          }}
                        />
                      </Col>
                      <Col span={4} />
                    </Row>
                  )}

                  {policyData?.applicable_on === 'ENTITY__BUSINESS_UNIT' && (
                    <Row style={{ marginTop: '30px' }}>
                      <Col span={6}>
                        <div>
                          {
                            <Trans>
                              {' '}
                              {entityNames[policyData?.applicable_on]
                                ?.display_text
                                ? `Select ${
                                    entityNames[policyData?.applicable_on]
                                      ?.display_text
                                  }*`
                                : ''}
                            </Trans>
                          }
                        </div>
                      </Col>
                      <Col span={14}>
                        <span
                          style={{
                            color: '#000',
                            position: 'absolute',
                            top: '-22px',
                            right: '25px',
                          }}
                        >{`${policyData?.applicable_to?.length} Selected`}</span>
                        <TreeSelect
                          showSearch
                          value={policyData?.applicable_to}
                          maxTagCount='responsive'
                          className='select-options-tag'
                          treeData={treeListBusinessUnits}
                          treeCheckable={true}
                          // maxTagCount={0}
                          treeNodeFilterProp='title'
                          treeDefaultExpandAll={true}
                          maxTagPlaceholder={(e: any) => {
                            return <span>...</span>;
                          }}
                          placeholder='Select'
                          style={{ width: '100%' }}
                          onChange={(
                            ele: any,
                            selectedNodes: React.ReactNode[],
                            extra: any,
                          ) => {
                            let result;
                            let length = false;
                            result = extra?.allCheckedNodes?.map(
                              (node: any, i: number) => {
                                if (node?.children?.length) {
                                  length = true;
                                  return node?.node?.props?.value?.map(
                                    (item: any) => {
                                      return {
                                        children: item?.title,
                                        data: item,
                                        key: item?.title,
                                        value: item?.title,
                                        tryAgain: false,
                                      };
                                    },
                                  );
                                } else {
                                  return {
                                    children: node?.node?.props?.title,
                                    data: node?.node?.props?.data,
                                    key: node?.node?.props?.title,
                                    value: node?.node?.props?.title,
                                    tryAgain: false,
                                  };
                                }
                              },
                            );
                            handleChangeValue(
                              policyIndex,
                              'applicable_to',
                              ele,
                              length ? result[0] : result,
                            );
                          }}
                        />
                      </Col>
                      <Col span={4} />
                    </Row>
                  )}
                  <Row style={{ marginBottom: '25px', marginTop: '20px' }}>
                    <Col span={6}>
                      <Trans>Applicable To</Trans>
                    </Col>
                    <Col span={14}>
                      <Checkbox.Group
                        className='request-list-options'
                        onChange={(e: any) =>
                          handleSelectApplicableTo(e, policyIndex)
                        }
                        defaultValue={
                          policyData?.requestCheck === true ? [0, 1] : [1]
                        }
                        style={{ width: '100%' }}
                      >
                        <Row>
                          <Col span={24} style={{ margin: '0 0 24px 0' }}>
                            <Checkbox
                              defaultChecked={policyData?.requestCheck}
                              value={0}
                            >
                              Request
                            </Checkbox>
                          </Col>
                          <Col span={24} style={{ margin: '0 0 24px 0' }}>
                            <Checkbox
                              className='request-list-option-expense-type'
                              defaultChecked={policyData?.claimCheck}
                              // disabled
                              value={1}
                            >
                              Expense Claim*
                            </Checkbox>
                          </Col>
                        </Row>
                      </Checkbox.Group>
                    </Col>
                  </Row>
                  {policyData?.requestCheck && (
                    <>
                      <Row style={{ marginTop: '30px' }}>
                        <Col span={6}>
                          <div>{<Trans>Choose Request Categories*</Trans>}</div>
                        </Col>
                        <Col span={14}>
                          <span
                            style={{
                              color: '#000',
                              position: 'absolute',
                              top: '-22px',
                              right: '25px',
                            }}
                          >{`${policyData?.requestCategory?.length} Selected`}</span>
                          <TreeSelect
                            className='select-options-tag'
                            showSearch
                            value={policyData?.requestCategory}
                            onChange={(ele, treeNode) => {
                              onRequestCategoryChange(policyIndex, ele);
                            }}
                            treeCheckable={true}
                            maxTagCount='responsive'
                            placeholder='Select'
                            treeDefaultExpandAll
                            style={{ width: '100%' }}
                          >
                            <TreeSelect.TreeNode
                              key={''}
                              value={''}
                              title={'Select All'}
                            >
                              <TreeSelect.TreeNode
                                key={'GEN'}
                                value={'GEN'}
                                title={'General'}
                              />
                              <TreeSelect.TreeNode
                                key={'TRA'}
                                value={'TRA'}
                                title={'Travel'}
                              />
                            </TreeSelect.TreeNode>
                          </TreeSelect>
                        </Col>
                        <Col span={4} />
                      </Row>
                      {policyData?.requestCategory.length ? (
                        <Row
                          className='expense-category'
                          style={{ marginTop: '30px', marginBottom: '30px' }}
                        >
                          <Col span={6}>
                            <div>{<Trans>Choose Request Types</Trans>}</div>
                          </Col>
                          <Col span={14}>
                            <span
                              style={{
                                color: '#000',
                                position: 'absolute',
                                top: '-22px',
                                right: '25px',
                              }}
                            >{`${policyData?.request_types?.length} Selected`}</span>
                            <TreeSelectWithSearch
                              value={policyData?.request_types}
                              policyData={policyData?.requestTypesListOptions}
                              selectedCount={selectedRequestCount}
                              policyIndex={policyIndex}
                              allTypes={policyData?.requestTypes}
                              handleChangeTypes={handleChangeRequestTypes}
                            />
                            {/* <TreeSelect
                              className='select-options-tag'
                              showSearch
                              value={policyData?.request_types}
                              treeData={policyData?.requestTypesListOptions}
                              treeCheckable={true}
                              maxTagCount={0}
                              treeNodeFilterProp='title'
                              treeDefaultExpandAll={true}
                              maxTagPlaceholder={(e: any) => {
                                return (
                                  <span>
                                    Selected {''}{' '}
                                    {selectedRequestCount[policyIndex]}
                                  </span>
                                );
                              }}
                              placeholder='Select'
                              style={{ width: '100%' }}
                              onChange={(ele: any, list: any, extra: any) => {
                                handleChangeRequestTypes(policyIndex, ele, extra);
                              }}
                            /> */}
                          </Col>
                          <Col span={4} />
                        </Row>
                      ) : null}
                    </>
                  )}
                  {/* {policyData?.request_types?.length !== 0 &&
                    policyData?.requestCheck && (
                      <>
                        <div className='expense-types-lists-box'>
                          {Object.keys(policyData?.selected_request_types).map(
                            (item: any) => (
                              <>
                                {policyData?.selected_request_types[item]
                                  ?.length ? (
                                  <Row>
                                    <Col span={24}>
                                      <Title
                                        level={5}
                                        className='d-flex expense-types-title'
                                      >
                                        <Trans>
                                          {['GEN', 'TRA']?.map((ele: any) => {
                                            if (ele === item) {
                                              return requestTypesList[ele];
                                            }
                                          })}
                                        </Trans>
                                        <span>
                                          &nbsp;
                                          {
                                            policyData?.selected_request_types[
                                              item
                                            ]?.length
                                          }{' '}
                                          Types&nbsp;
                                        </span>
                                        <Trans>out of</Trans>
                                        <span>
                                          &nbsp;
                                          {
                                            policyData?.requestTypes[item]
                                              .length
                                          }{' '}
                                          Added
                                        </span>
                                      </Title>
                                    </Col>
                                  </Row>
                                ) : null}
                                {policyData?.selected_request_types[item]
                                  ?.length ? (
                                  <Row
                                    gutter={[12, 12]}
                                    className='expense-types-item-row'
                                  >
                                    {policyData?.selected_request_types[
                                      item
                                    ].map((eitem: any) => (
                                      <Col span={6} className='gutter-row'>
                                        <div
                                          className={
                                            'expense-type-item background-' +
                                            item
                                          }
                                        >
                                          <p>
                                            {eitem?.code} - {eitem?.title}
                                          </p>
                                          <CloseOutlined
                                            onClick={() =>
                                              handleRemoveRequestTypes(
                                                policyIndex,
                                                item,
                                                eitem,
                                              )
                                            }
                                            style={{
                                              marginLeft: 'auto',
                                              cursor: 'pointer',
                                            }}
                                          />
                                        </div>
                                      </Col>
                                    ))}
                                  </Row>
                                ) : null}
                              </>
                            ),
                          )}
                        </div>
                      </>
                    )} */}
                  {policyData?.claimCheck ? (
                    <>
                      <Row
                        className='expense-category'
                        style={{ marginTop: '30px' }}
                      >
                        <Col span={6}>
                          <div>{<Trans>Choose Expense Categories*</Trans>}</div>
                        </Col>
                        <Col span={14}>
                          <span
                            style={{
                              color: '#000',
                              position: 'absolute',
                              top: '-22px',
                              right: '25px',
                            }}
                          >{`${policyData?.expenseCategory?.length} Selected`}</span>
                          <TreeSelect
                            showSearch
                            value={policyData?.expenseCategory}
                            maxTagCount='responsive'
                            className='select-options-tag'
                            treeData={treeListExpenseTypes}
                            treeCheckable={true}
                            // maxTagCount={0}
                            treeNodeFilterProp='title'
                            treeDefaultExpandAll={true}
                            maxTagPlaceholder={(e: any) => {
                              return <span>...</span>;
                            }}
                            placeholder='Select'
                            style={{ width: '100%' }}
                            onChange={ele => {
                              onExpenseCategoryChange(policyIndex, ele);
                            }}
                          />
                        </Col>
                        <Col span={4} />
                      </Row>
                      {policyData?.expenseCategory.length ? (
                        <>
                          <Row
                            className='expense-category'
                            style={{ marginTop: '30px', marginBottom: '30px' }}
                          >
                            <Col span={6}>
                              <div>{<Trans>Choose Expense Types</Trans>}</div>
                            </Col>
                            <Col span={14}>
                              <span
                                style={{
                                  color: '#000',
                                  position: 'absolute',
                                  top: '-22px',
                                  right: '25px',
                                }}
                              >{`${policyData?.claim_types?.length} Selected`}</span>
                              <TreeSelectWithSearch
                                value={policyData?.claim_types}
                                allTypes={policyData?.expenseTypes}
                                policyData={policyData?.expenseTypesListOptions}
                                selectedCount={selectedExpenseCount}
                                policyIndex={policyIndex}
                                handleChangeTypes={handleChangeExpenseTypes}
                              />
                              {/* <TreeSelect
                                showSearch
                                // open={true}
                                // defaultOpen={true}
                                className='select-options-tag'
                                value={policyData?.claim_types}
                                treeData={filteredData}
                                treeCheckable={true} // Set to false to use the search bar
                                maxTagCount={0}
                                treeNodeFilterProp='title'
                                dropdownRender={(menu: any) => {
                                  return (
                                    <>
                                      <div style={{ padding: 8 }}>
                                        <Input
                                          placeholder={`Search Types`}
                                          value={searchValue}
                                          onChange={(e: any) => {
                                            // handleSearch(e.target.value,policyData?.expenseTypesListOptions)
                                            // let value = e.target.value;
                                            // setSearchValue(value);

                                            // // Filter the treeData based on the search value
                                            // if (value) {
                                            //   const filteredTreeData = filterTreeData(policyData?.expenseTypesListOptions, value);
                                            //   setFilteredData(filteredTreeData);
                                            // } else {
                                            //   setFilteredData(policyData?.expenseTypesListOptions);
                                            // }
                                          }}
                                        />
                                      </div>
                                      {menu}
                                    </>
                                  );
                                }}
                                treeDefaultExpandAll={true}
                                maxTagPlaceholder={(e: any) => {
                                  return (
                                    <span>
                                      Selected {''} {selectedExpenseCount[policyIndex]}
                                    </span>
                                  );
                                }}
                                placeholder='Select'
                                style={{ width: '100%' }}
                                onChange={(ele: any, list: any, extra: any) => {
                                  handleChangeExpenseTypes(policyIndex, ele, extra);
                                }}
                              /> */}
                              {/* <TreeSelect
                                showSearch
                                className='select-options-tag'
                                value={policyData?.claim_types}
                                treeData={policyData?.expenseTypesListOptions}
                                treeCheckable={true}
                                maxTagCount={0}
                                treeNodeFilterProp='title'
                                treeDefaultExpandAll={true}
                                maxTagPlaceholder={(e: any) => {
                                  return (
                                    <span>
                                      Selected {''}{' '}
                                      {selectedExpenseCount[policyIndex]}
                                    </span>
                                  );
                                }}
                                placeholder='Select'
                                style={{ width: '100%' }}
                                onChange={(ele: any, list: any, extra: any) => {
                                  handleChangeExpenseTypes(
                                    policyIndex,
                                    ele,
                                    extra,
                                  );
                                }}
                              /> */}
                            </Col>
                            <Col span={4} />
                          </Row>
                          {/* <div className='expense-types-lists-box'>
                            {Object.keys(policyData?.selected_claim_types).map(
                              (item: any) => (
                                <>
                                  {policyData?.selected_claim_types[item]
                                    .length ? (
                                    <Row>
                                      <Col span={24}>
                                        <Title
                                          level={5}
                                          className='d-flex expense-types-title'
                                        >
                                          <Trans
                                            id={
                                              listExpenseTypes?.filter(
                                                (k: any) => k.code === item,
                                                // eslint-disable-next-line no-useless-concat
                                              )?.[0]?.title || '' + ' : '
                                            }
                                          />
                                          <span>
                                            &nbsp;
                                            {
                                              policyData?.selected_claim_types[
                                                item
                                              ].length
                                            }{' '}
                                            Types&nbsp;
                                          </span>
                                          <Trans>out of</Trans>
                                          <span>
                                            &nbsp;
                                            {
                                              policyData?.expenseTypes[item]
                                                .length
                                            }{' '}
                                            Added
                                          </span>
                                        </Title>
                                      </Col>
                                    </Row>
                                  ) : null}
                                  {policyData?.selected_claim_types[item]
                                    .length ? (
                                    <Row
                                      gutter={[12, 12]}
                                      className='expense-types-item-row'
                                    >
                                      {policyData?.selected_claim_types[
                                        item
                                      ].map((eitem: any) => (
                                        <Col span={6} className='gutter-row'>
                                          <div
                                            className={
                                              'expense-type-item background-' +
                                              item
                                            }
                                          >
                                            <p>
                                              {eitem?.code} - {eitem?.title}
                                            </p>
                                            <CloseOutlined
                                              onClick={() =>
                                                handleRemoveExpenseTypes(
                                                  policyIndex,
                                                  item,
                                                  eitem,
                                                )
                                              }
                                              style={{
                                                marginLeft: 'auto',
                                                cursor: 'pointer',
                                              }}
                                            />
                                          </div>
                                        </Col>
                                      ))}
                                    </Row>
                                  ) : null}
                                </>
                              ),
                            )}
                          </div> */}
                        </>
                      ) : null}
                    </>
                  ) : null}
                </Form>
              </Col>
            </Row>
          </Col>
        ))}
      </Row>
    </>
  );
};

export default memo(connector(TargetGroupsAndEpenses));
