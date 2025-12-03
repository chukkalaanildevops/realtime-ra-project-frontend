/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ColumnsType, TableProps } from 'antd/lib/table';
import React, { Dispatch, memo, useEffect, useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { appPath } from '../../../../app/app.routes';
import {
  Button,
  Table,
  Pagination,
  Tag,
  Row,
  Col,
  Select,
  Radio,
  RadioChangeEvent,
  Modal,
  Typography,
  Divider,
  Switch,
  Form,
  TreeSelect,
} from 'antd';
import {
  CloseCircleOutlined,
  EditOutlined,
  EyeOutlined,
  FilterOutlined,
  SearchOutlined,
} from '@ant-design/icons';

// import { UserOutlined } from '@ant-design/icons';
import Input from 'antd/lib/input';

import {
  ElementOrSkeleton,
  ErrorBoundary,
  FilterBar,
  HeaderBarWrapper,
  StatusTag,
} from '../../../../../shared/components';

import {
  getPolicyConfiguration,
  getPolicyConfigurationDetails,
  getPolicyConfigurationDetailsLoader,
  stateInterface,
} from '../../../../../shared/redux/rootReducer';
import {
  resetConfirmationInfo,
  setConfirmationInfo,
} from '../../../../app/app.actions';
import { IConfirmationInfo } from '../../../../app/app.model';
import {
  fetchAllExpanseTypes,
  fetchAllSfEmployeeGroups,
  fetchExpenseCategory,
  fetchListAllEmployeeGroups,
  fetchListAllPayGrades,
  fetchListBusinessUnits,
  fetchListDepartments,
  fetchListDivisions,
  fetchListEntitiesCompany,
  fetchPolicyConfigDetails,
  fetchPolicyConfigDetailsForView,
  fetchPolicyConfiguration,
  fetchUserPermission,
  setPageLoader,
  updatePolicyConfiguration,
} from './policyConfiguration.thunk';
import './policyConfiguration.index.less';
// import { buildCronString } from '../../../../../utils/global.utils';
import { Trans } from '@lingui/macro';
import Text from 'antd/lib/typography/Text';

import { ISearchFilter } from './policyConfiguration.models';
import TargetGroup from './policyUpdate/steps/components/TargetGroup/targetGroup';
import _debounce from 'lodash/debounce';
import AdvanceFilter from './AdvanceFilter/AdvanceFilter.index';

const mapStateToProps = (state: stateInterface) => {
  const {
    isPolicyPageLoading,
    policyConfiguration,
    formSubmissionInProgress,
    formSubmissionSuccessful,
    formErrors,
    pagination_data,
    isPermission,
  } = state.policyConfiguration;
  const { user } = state.auth;
  return {
    isLoading: isPolicyPageLoading,
    policyConfiguration: policyConfiguration,
    pagination_data: pagination_data,
    formSubmissionInProgress: formSubmissionInProgress,
    formSubmissionSuccessful: formSubmissionSuccessful,
    formErrors: formErrors,
    policyConfigurationDetails: getPolicyConfigurationDetails(state),
    policyConfigurationDetailsLoader: getPolicyConfigurationDetailsLoader(
      state,
    ),
    user,
    isPermission,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  return {
    _setLoader: (isLoading: boolean) => dispatch(setPageLoader(isLoading)),
    _fetchPolicyConfiguration: (
      searchfilter: ISearchFilter,
      isLoadingRequire: boolean = true,
    ) => dispatch(fetchPolicyConfiguration(searchfilter, isLoadingRequire)),
    _setConfirmationInfo: (data: IConfirmationInfo) =>
      dispatch(setConfirmationInfo(data)),
    _resetConfirmationInfo: () => dispatch(resetConfirmationInfo()),
    _fetchPolicyDetailsByID: (id: string) =>
      dispatch(fetchPolicyConfigDetailsForView(id)),
    _updatePolicyConfiguration: (id: any, data: any, messageType: any) =>
      dispatch(updatePolicyConfiguration(id, data, messageType)),
    _fetchUserPermission: (id: any) => dispatch(fetchUserPermission(id)),

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
  };
};

const connector = connect(mapStateToProps, mapDispatchToProps);

const filterByTypeOptions = [
  { label: 'All', value: '' },
  { label: 'Standard', value: 'standard' },
  { label: 'Custom', value: 'custom' },
];

const initialAdvanceFilter = {
  applicable_on: '',
  applicable_to: [],
  expense_types: [],
};

const PolicyConfiguration: React.FC<ConnectedProps<
  typeof connector
>> = props => {
  const {
    isLoading,
    policyConfiguration,
    _fetchPolicyConfiguration,
    _fetchPolicyDetailsByID,
    policyConfigurationDetailsLoader,
    policyConfigurationDetails,
    _updatePolicyConfiguration,
    user,
    _fetchUserPermission,
    isPermission,
    _listEntities,
    _listDepartments,
    _listDivisions,
    _listBusinessUnits,
    _listAllEmployeeGroups,
    _listAllPayGrades,
    _listAllSfEmployeeGroups,
    _listAllExpenseTypes,
  } = props;
  const [modalVisible, setModalVisible] = useState(false);
  const { Title } = Typography;
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [searchPolicyType, setSearchPolicyType] = useState('');
  const [searchStatus, setSearchStatus] = useState('all');
  const [searchSortBy, setSearchSortBy] = useState('title');
  const [openFilterModal, setOpenFilterModal] = useState(false);

  const [searchApplicableOn, setSearchApplicableOn] = useState('');
  const [weightage, setWeightage] = useState<any>('');
  const [isEnforcement, setIsEnforcement] = useState<any>('');
  const [searchApplicableTo, setSearchApplicableTo] = useState([]);
  const [searchExpenseTypes, setSearchExpenseTypes] = useState([]);
  const [defaultSorter, setDefaultSorter] = useState('ascend');
  const [applyFilterCount, setApplyFilterCount] = useState([]);

  const [selectWeightage, setSelectWeightage] = useState<any>('');
  const [applicableOn, setApplicableOn] = useState('');
  const [expenseTypes, setExpenseTypes] = useState([]);
  const [selectIsEnforcement, setSelectIsEnforcement] = useState<any>('');
  const [applicableTo, setApplicableTo] = useState([]);

  useEffect(() => {
    if (user.id) {
      _fetchUserPermission(user.id);
    }
  }, [user]);

  useEffect(() => {
    _listEntities();
    _listDepartments();
    _listDivisions();
    _listBusinessUnits();
    _listAllEmployeeGroups();
    _listAllPayGrades();
    _listAllSfEmployeeGroups();
    _listAllExpenseTypes();
  }, []);

  const onChangePagination = (page: number, pageSize: number) => {
    setCurrentPage(page);
    setPageSize(pageSize);
    fetchPolicyConfigurationFilterData(page, pageSize);
  };
  const { push } = useHistory();
  const routeToUpdate = (record: any) => {
    push(
      appPath.config_setup.policyConfiguration.update.linkTo + '/' + record?.id,
    );
  };

  const onSwitchChange = async (e: any, value: any, index: Number) => {
    await _updatePolicyConfiguration(
      value?.id,
      {
        is_active: e,
      },
      'status',
    );
    setTimeout(() => {
      fetchPolicyConfigurationFilterData(
        currentPage,
        pageSize,
        searchPolicyType,
        search,
        searchSortBy,
        searchStatus,
        false,
      );
    }, 1000);
    // setPolicyConfigDetails
  };

  const columns: any = [
    {
      title: <Trans>Policy Name & Description</Trans>,
      key: 'policy_name',
      dataIndex: 'policy_name',
      width: '35%',
      defaultSortOrder: 'ascend',
      sorter: true,
      sortOrder: defaultSorter,
      onHeaderCell: () => ({
        onClick: () => {
          setDefaultSorter(defaultSorter === 'ascend' ? 'descend' : 'ascend');
        },
        sortDirections: ['descend', 'ascend', null],
      }),
      render: (value: string, _record: any, i: number) => {
        return (
          <div>
            <strong>{_record?.title}</strong>
            <p>{_record?.description}</p>
          </div>
        );
      },
    },
    {
      title: <Trans>Policy Type</Trans>,
      key: 'policy_type',
      dataIndex: 'policy_type',
      width: '15%',

      render: (value: boolean, _record: any, i: number) => {
        return _record?.is_standard ? <p>Standard</p> : <p>Custom</p>;
      },
    },
    {
      title: <Trans>Status</Trans>,
      key: 'status',
      dataIndex: 'status',
      width: '10%',
      align: 'center',
      render: (value: boolean, _record: any, index: number) => {
        return (
          <>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-around',
                alignItems: 'center',
              }}
            >
              <div
                className={`switch-button status ${
                  _record?.is_active ? 'ACTIVE' : 'INACTIVE'
                }`}
                style={{
                  padding: '2px 10px',
                  width: '120px',
                }}
              >
                {isPermission ? (
                  <Switch
                    size='small'
                    checked={_record?.is_active}
                    onChange={(e: any) => onSwitchChange(e, _record, index)}
                    style={{ marginRight: '10px' }}
                  />
                ) : null}

                {_record?.is_active ? 'Active' : 'Inactive'}
              </div>
            </div>
          </>
        );
      },
    },
    {
      title: <Trans>Actions</Trans>,
      key: 'action',
      dataIndex: 'action',
      // fixed: 'right' as 'right',
      width: '10%',
      align: 'center',
      render: (_text: string, _record: any) => {
        return (
          <div className='buttons'>
            {isPermission ? (
              <Button
                type='link'
                icon={<EditOutlined style={{ color: '#475467' }} />}
                title='Edit'
                onClick={() => routeToUpdate(_record)}
              />
            ) : null}
            <Button
              type='link'
              icon={<EyeOutlined style={{ color: '#475467' }} />}
              title='View'
              onClick={() => onItemView(_record)}
            />
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    fetchPolicyConfigurationFilterData(currentPage, pageSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchSortBy, currentPage, pageSize, defaultSorter]);

  const fetchPolicyConfigurationFilterData = (
    page = currentPage,
    curentPageSize = pageSize,
    policy_type = searchPolicyType,
    searchData = search,
    sort_by = searchSortBy,
    status = searchStatus,
    isLoading = true,
    applicable_on = searchApplicableOn,
    applicable_to = searchApplicableTo,
    expense_types = searchExpenseTypes,
    searchWeightage = weightage,
    search_is_enforcement = isEnforcement,
  ) => {
    _fetchPolicyConfiguration(
      {
        page,
        pageSize: curentPageSize,
        policy_type,
        search: searchData,
        sort_by,
        status,
        applicable_on,
        weightage: searchWeightage,
        is_enforcement: search_is_enforcement,
        applicable_to: applicable_to.join(','),
        expense_types: expense_types.join(','),
      },
      isLoading,
    );
  };
  const fetchPolicyConfigurationAdvanceFilterData = (
    applicable_on = searchApplicableOn,
    applicable_to = searchApplicableTo,
    expense_types = searchExpenseTypes,
    searchWeightage = weightage,
    search_is_enforcement = isEnforcement,
  ) => {
    _fetchPolicyConfiguration(
      {
        page: currentPage,
        pageSize: pageSize,
        policy_type: searchPolicyType,
        search: search,
        sort_by: searchSortBy,
        status: searchStatus,
        weightage: searchWeightage,
        is_enforcement: search_is_enforcement,
        applicable_on,
        applicable_to: applicable_to.join(','),
        expense_types: expense_types.join(','),
      },
      isLoading,
    );
  };

  const [value3, setValue3] = useState('View All');

  const options = [
    { label: 'View All', value: 'all' },
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
  ];

  const selectOptions = [];

  for (let i = 10; i < 36; i++) {
    selectOptions.push({
      value: i.toString(36) + i,
      label: i.toString(36) + i,
    });
  }

  const handleChange = (value: string | string[]) => {};

  const onChange3 = ({ target: { value } }: RadioChangeEvent) => {
    setValue3(value);
  };

  const onItemView = (record: any) => {
    _fetchPolicyDetailsByID(record.id);
    setModalVisible(true);
  };

  const renderFlagMembers = (group: any) => {
    let members: string = '';
    if (group.is_show_flag_to_approver) members = ' Approver |';
    if (group.is_show_flag_to_employee) members += ' Employee |';
    if (group.is_show_flag_to_finance_admin) members += ' Admin |';
    return members.slice(0, members.length - 1);
  };

  const renderExpenseCategory = (group: any) => {
    let expenseValue = group?.expense_Categories
      ?.map((category: any) => ` ${category?.name} |`)
      .join('');
    return expenseValue.slice(0, expenseValue.length - 1);
  };
  const onChangeTable: TableProps<any>['onChange'] = (
    pagination: any,
    filters: any,
    sorter: any,
    extra: any,
  ) => {
    if (sorter && sorter.field === 'policy_name') {
      let searchValue = defaultSorter === 'descend' ? 'title' : '-title';
      setSearchSortBy(searchValue);
    }
  };

  // useEffect(() => {
  //   fetchPolicyConfigurationFilterData(currentPage,pageSize, searchPolicyType,search,searchSortBy,searchStatus)
  // }, [searchSortBy])

  const debounceFn = React.useCallback(
    _debounce(text => {
      fetchPolicyConfigurationFilterData(
        1,
        pageSize,
        searchPolicyType,
        text,
        searchSortBy,
        searchStatus,
        true,
        searchApplicableOn,
        searchApplicableTo,
        searchExpenseTypes,
      );
    }, 500),
    [
      pageSize,
      searchPolicyType,
      searchSortBy,
      searchStatus,
      searchApplicableOn,
      searchApplicableTo,
      searchExpenseTypes,
    ],
  );

  return (
    <ErrorBoundary>
      <HeaderBarWrapper
        headerCommonProps={{ title: <Trans>Policy Configuration</Trans> }}
        breadcrumbCompVisibility={false}
        breadcrumbCompProps={{
          enableBackBtn: false,
          // breadcrumProps: {
          //   separator: '>',
          //   routes: [
          //     {
          //       path: '/setup',
          //       breadcrumbName: `Setup`,
          //     },
          //     {
          //       path: appPath.config_setup.policyConfiguration.path,
          //       breadcrumbName: `Policy Configuration`,
          //     },
          //   ],
          // },
        }}
        // counterProps={{
        //   enableCounter: true,
        //   counterValue: '100 Policy',
        // }}
      >
        <div className='policy-configuration-container'>
          <FilterBar enableBackBtn={true} isAddButton={false} />
          <Row
            gutter={12}
            align='middle'
            justify='start'
            style={{ marginBottom: '2rem' }}
          >
            <Col span={6}>
              <Text>{<Trans>Search Policy</Trans>}</Text>
              <Input
                placeholder='Policy Name'
                prefix={<SearchOutlined />}
                suffix={
                  search ? (
                    <CloseCircleOutlined
                      onClick={() => {
                        setSearch('');
                        debounceFn('');
                      }}
                    />
                  ) : null
                }
                size={'small'}
                value={search}
                onChange={e => {
                  setSearch(e.target.value);
                  debounceFn(e.target.value);
                }}
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '10px',
                }}
              />
            </Col>
            <Col span={4}>
              <Text>{<Trans>Filter By Type</Trans>}</Text>
              <Select
                className='select-filter-type-dropdown'
                size={'small'}
                value={searchPolicyType}
                style={{ width: '100%' }}
                options={filterByTypeOptions}
                onChange={e => {
                  setSearchPolicyType(e);
                  fetchPolicyConfigurationFilterData(1, pageSize, e);
                }}
              />
            </Col>
            <Col span={8}>
              <Text>{<Trans>View by Status</Trans>}</Text>
              <div
                style={{ width: '100%', display: 'flex', alignItems: 'center' }}
              >
                <Radio.Group
                  className='policy-view-status'
                  options={options}
                  onChange={e => {
                    setSearchStatus(e.target.value);
                    fetchPolicyConfigurationFilterData(
                      1,
                      pageSize,
                      searchPolicyType,
                      search,
                      searchSortBy,
                      e.target.value,
                    );
                  }}
                  value={searchStatus}
                  optionType='button'
                />
                <div
                  style={{
                    marginLeft: '10px',
                    marginTop: '3px',
                    border: 0,
                    cursor: 'pointer',
                  }}
                  onClick={() => setOpenFilterModal(!openFilterModal)}
                >
                  <FilterOutlined
                    style={{
                      color:
                        applyFilterCount?.length !== 0 ? '#1890ff' : '#68737d',
                      fontSize: '17px',
                    }}
                  />
                </div>
              </div>
            </Col>
          </Row>

          {!openFilterModal && applyFilterCount?.length !== 0 && (
            <div style={{ color: '#1890ff' }}>
              Filters Applied : {applyFilterCount?.length}
            </div>
          )}

          {openFilterModal && (
            <>
              <div
                className={
                  openFilterModal
                    ? 'data-filter-container active'
                    : 'data-filter-container hidden'
                }
              >
                <AdvanceFilter
                  setApplicableTo={setApplicableTo}
                  applicableTo={applicableTo}
                  setSelectIsEnforcement={setSelectIsEnforcement}
                  selectIsEnforcement={selectIsEnforcement}
                  expenseTypes={expenseTypes}
                  setExpenseTypes={setExpenseTypes}
                  setApplicableOn={setApplicableOn}
                  applicableOn={applicableOn}
                  setSelectWeightage={setSelectWeightage}
                  selectWeightage={selectWeightage}
                  setSearchApplicable_on={setSearchApplicableOn}
                  weightage={weightage}
                  setWeightage={setWeightage}
                  setIsEnforcementData={setIsEnforcement}
                  is_enforcement={isEnforcement}
                  setApplyFilterCount={setApplyFilterCount}
                  applyFilterCount={applyFilterCount}
                  setSearchApplicable_to={setSearchApplicableTo}
                  setSearchExpense_types={setSearchExpenseTypes}
                  fetchPolicyConfigurationAdvanceFilterData={
                    fetchPolicyConfigurationAdvanceFilterData
                  }
                  setOpenFilterModal={setOpenFilterModal}
                />
              </div>
            </>
          )}

          <ElementOrSkeleton type='table' isLoading={isLoading} isActive={true}>
            <Table
              columns={columns}
              pagination={false}
              dataSource={policyConfiguration}
              // rowKey='id'
              // expandable={{
              //   expandedRowRender: () => null,
              //   rowExpandable: () => true,
              //   expandIcon: () => <FullscreenOutlined />,
              // }}
              rowKey={item => item.id}
              onChange={onChangeTable}
              // scroll={{ x: 1200 }}
              size='middle'
            ></Table>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row-reverse',
                marginTop: 12,
              }}
            >
              <Pagination
                defaultCurrent={1}
                current={currentPage}
                onChange={(pageNumber: number, pageSize: any) => {
                  onChangePagination(pageNumber, pageSize);
                }}
                hideOnSinglePage={false}
                showSizeChanger={true}
                pageSizeOptions={['10', '12', '20', '50', '100']}
                pageSize={pageSize}
                onShowSizeChange={(_current: number, size: number) => {
                  setPageSize(size);
                }}
                total={props.pagination_data.total_records}
                showTotal={(total: number, range: number[]) => {
                  return <>{`${range[0]}-${range[1]} of ${total}`}</>;
                }}
                showQuickJumper={{
                  goButton: (
                    <Button type='default'>
                      <Trans>Go</Trans>
                    </Button>
                  ),
                }}
              />
            </div>
          </ElementOrSkeleton>
        </div>
      </HeaderBarWrapper>

      <Modal
        width={1070}
        style={{ top: 25, left: 100 }}
        visible={modalVisible}
        closable={true}
        onCancel={() => {
          setModalVisible(false);
          // setCurrentPage(1);
          // setModalPageSize(initialPageSize);
        }}
        footer={false}
        // getContainer='.finance-admin-container'
        destroyOnClose={true}
        bodyStyle={{
          overflowY: 'auto',
          maxHeight: 'calc(100vh - 50px)',
        }}
      >
        <ElementOrSkeleton
          isActive={true}
          isLoading={policyConfigurationDetailsLoader}
          type='page'
        >
          <Row gutter={[0, 20]}>
            <Col span={24}>
              <Row>
                <Col span={3}>
                  <Title level={5}>
                    <Trans>Policy Status</Trans>:
                  </Title>
                </Col>
                <Col span={2}>
                  <StatusTag
                    status={{
                      code: policyConfigurationDetails?.is_active
                        ? 'ACTIVE'
                        : 'INACTIVE',
                      title: policyConfigurationDetails?.is_active
                        ? 'Active'
                        : 'Inactive',
                    }}
                  />
                </Col>
                {isPermission ? (
                  <Col span={3} offset={14}>
                    <div className='modal-edit-btn'>
                      <Button
                        type='text'
                        icon={<EditOutlined />}
                        title='Edit'
                        style={{ color: '#344054', fontWeight: 500 }}
                        onClick={() =>
                          routeToUpdate(policyConfigurationDetails)
                        }
                      >
                        <Trans>Edit Policy</Trans>
                      </Button>
                    </div>
                  </Col>
                ) : null}
              </Row>
            </Col>
            <Col span={24}>
              <Row gutter={[4, 14]}>
                <Col span={24}>
                  <Title level={5}>
                    <Trans>Policy Details</Trans>
                  </Title>
                </Col>
                <Col span={3} style={{ color: '#344054' }}>
                  <Trans>Policy Name</Trans>:
                </Col>
                <Col span={21}>
                  <div>{policyConfigurationDetails?.title}</div>
                </Col>
                <Col span={3} style={{ color: '#344054' }}>
                  <Trans>Policy Code</Trans> :
                </Col>
                <Col span={21}>
                  <div>{policyConfigurationDetails?.code}</div>
                </Col>
                <Col span={3} style={{ color: '#344054' }}>
                  <Trans>Description</Trans>:
                </Col>
                <Col span={21}>
                  <div>{policyConfigurationDetails?.description}</div>
                </Col>
              </Row>
            </Col>
            <Divider />
            <Col span={24}>
              {policyConfigurationDetails && (
                <TargetGroup
                  targetConfigurations={
                    policyConfigurationDetails?.target_configuration
                  }
                />
              )}
            </Col>
          </Row>
        </ElementOrSkeleton>
      </Modal>

      <Modal
        style={{
          top: 25,
          left: 100,
          borderRadius: 10,
        }}
        className='advance-filter-popup'
        // visible={openFilterModal}
        closable={true}
        centered
        onCancel={() => {
          setOpenFilterModal(false);
        }}
        footer={false}
        title={
          <div style={{ display: 'flex' }}>
            <div>Advance Filter</div>{' '}
            {applyFilterCount?.length !== 0 && (
              <div style={{ position: 'absolute', right: '50px' }}>
                Applied Filters : {applyFilterCount?.length}
              </div>
            )}
          </div>
        }
      >
        <AdvanceFilter
          expenseTypes={expenseTypes}
          setExpenseTypes={setExpenseTypes}
          setApplicableOn={setApplicableOn}
          applicableOn={applicableOn}
          setSelectWeightage={setSelectWeightage}
          selectWeightage={selectWeightage}
          setSelectIsEnforcement={setSelectIsEnforcement}
          selectIsEnforcement={selectIsEnforcement}
          setApplicableTo={setApplicableTo}
          applicableTo={applicableTo}
          setSearchApplicable_on={setSearchApplicableOn}
          weightage={weightage}
          setWeightage={setWeightage}
          setIsEnforcementData={setIsEnforcement}
          is_enforcement={isEnforcement}
          setApplyFilterCount={setApplyFilterCount}
          applyFilterCount={applyFilterCount}
          setSearchApplicable_to={setSearchApplicableTo}
          setSearchExpense_types={setSearchExpenseTypes}
          fetchPolicyConfigurationAdvanceFilterData={
            fetchPolicyConfigurationAdvanceFilterData
          }
          setOpenFilterModal={setOpenFilterModal}
        />
      </Modal>
    </ErrorBoundary>
  );
};

export default memo(connector(PolicyConfiguration));
