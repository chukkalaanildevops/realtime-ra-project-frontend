/* eslint-disable react-hooks/exhaustive-deps */
import React, { Dispatch, useEffect, useState, ComponentType } from 'react';
import {
  HeaderBarWrapper,
  SkeletonItem,
  AppDrawer,
  DotMenu,
  NoData,
  BackButton,
  ElementOrSkeleton,
} from '../../shared/components';
import {
  getEntityLoader,
  getEntityLoadingMessage,
  getCompanyEntity,
  getDivisionEntity,
  getOrganizationEntity,
  getDepartmentEntity,
  getLegalEntityData,
  getTimeZones,
  getLegalEntitySuccess,
  getLegalEntityError,
  isEntityDataSubmitting,
  getFinancialCycle,
  getPermissions,
  getCountryCurrencyList,
} from '../../shared/redux/rootReducer';
import {
  // fetchLegalEntities,
  fetchLegalEntityTypes,
  updateLegalEntity,
  fetchFinancialYears,
} from './legalEntityListing.thunk';
import { connect, ConnectedProps } from 'react-redux';
import {
  message,
  Table,
  Empty,
  Tabs,
  Form,
  Input,
  Checkbox,
  Row,
  Col,
  Select,
  AutoComplete,
  Skeleton,
  Button,
} from 'antd';
import './legalEntityListing.index.less';

import {
  EditOutlined,
  EllipsisOutlined,
  PartitionOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { fetchCountryCurrencyList } from '../setup/component/other/currencyConversion/currencyConversion.thunk';
import { fetchTimeZoneList } from '../configurations/configurations.thunk';
import { saveSuccess, saveError } from './legalEntityListing.actions';
import { Trans } from '@lingui/macro';
import { useHistory, useParams } from 'react-router-dom';
import { appPath } from '../app/app.routes';
import { ColumnProps } from 'antd/lib/table';
import { actionBtnObjInterface } from '../../shared/components/dotMenu/dotMenu.model';

const EntityListing: React.FC<ConnectedProps<typeof connector>> = ({
  _fetchEntityTypes,
  _fetchCurrencies,
  _fetchTimezones,
  _saveError,
  _saveSuccess,
  _updateEntity,
  _fetchFinancialCycle,
  getPermissions,
  isLoading,
  loadingMessage,
  currencyList,
  entityData,
  timeZones,
  error,
  success,
  financialCycle,
  isDataSubmitting,
}) => {
  const [editItem, setEditItem] = useState<any>(undefined);
  const [form] = Form.useForm();
  const [searchValue, setSearchValue] = useState('');
  const [filters, setFilters] = useState<any>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number | undefined>(10);

  const params: any = useParams();
  const tab = params.tab;
  const history = useHistory();

  // useEffect(() => {
  //   if ((isLoading || isDataSubmitting) && loadingMessage) {
  //     message.loading(loadingMessage);
  //   } else {
  //     message.destroy();
  //   }
  // }, [isLoading, loadingMessage, isDataSubmitting]);

  useEffect(() => {
    if (success) {
      setEditItem(undefined);
      setFilters(null);
      setTimeout(() => {
        message.success(success, 4, _saveSuccess);
      }, 1000);
    } else {
      message.destroy();
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      if (error instanceof Object) {
        const errors = Object.keys(error).map(item => ({
          name: item,
          errors: error[item],
        }));
        form.setFields(errors);
      } else if (typeof error === 'string') {
        message.error(error || 'Something went wrong', 3, _saveError);
      }
    } else {
      message.destroy();
    }
  }, [error]);

  const onTableChange = (...tableProps: any) => {
    setFilters(tableProps[1]);
  };

  useEffect(() => {
    _fetchEntityTypes();
    _fetchCurrencies();
    _fetchTimezones();
    _fetchFinancialCycle();

    // eslint-disable-next-line
  }, []);

  const renderCurrencies = () => {
    return currencyList.map(item => (
      <Select.Option
        value={item.id}
        key={item.id}
      >{`${item.currency.title} (${item.currency.code})`}</Select.Option>
    ));
  };

  const renderOptions = (list: any, key = 'id') =>
    list.map((item: any) => (
      <Select.Option value={item[key]} key={item[key]}>
        {item.title}
      </Select.Option>
    ));

  const onEditItem = (item: any) => {
    setEditItem(item);
    form.setFieldsValue({
      ...item,
      head: item.legal_entity_type?.title,
      currency: item?.currency?.id,
      timezone: item?.timezone?.id,
      financial_year: item?.financial_year?.code,
    });
  };

  const getFilterOptions = (dataIndex: string, key: string) => {
    try {
      const options = entityData[key].data
        .filter(
          item =>
            item[dataIndex]?.toLowerCase().indexOf(searchValue.toLowerCase()) >
            -1,
        )
        .map(obj => ({
          value: obj[dataIndex],
        }));
      return options;
    } catch (e) {}
  };
  const handleSearch = (
    _selectedKeys: React.ReactText,
    confirm: () => void,
    _dataIndex: string,
  ) => {
    confirm();
  };

  const handleReset = (clearFilters?: () => void) => {
    clearFilters && clearFilters();
  };

  const getColumnSearchProps = (
    dataIndex: string,
    key: string,
  ): ColumnProps<any> => ({
    filterDropdown: ({ setSelectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: '10px' }}>
        <AutoComplete
          placeholder={`Search ${dataIndex.replace(/_/g, ' ')}`}
          allowClear={true}
          options={getFilterOptions(dataIndex, key)}
          onSelect={value => {
            setSelectedKeys([value]);
            handleSearch(value, confirm, dataIndex);
          }}
          onSearch={val => setSearchValue(val)}
          onChange={e => (e ? '' : handleReset(clearFilters))}
          autoFocus={true}
        >
          <Input.Search />
        </AutoComplete>
      </div>
    ),
    filteredValue: filters?.[dataIndex] || null,
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value: any, record: any) => {
      const item: any = record[dataIndex]?.toLowerCase();
      return item?.includes(value?.toLowerCase());
    },
    onFilterDropdownVisibleChange: (visible: boolean) => {
      if (visible) {
        // setTimeout(() => this.searchInput.select());
      }
    },
  });

  const getElemOrSkeleton = (
    key: string,
    _text: string | React.ReactNode,
    _record?: any,
    _index?: number,
  ) => {
    const isLoading = entityData[key].isLoading;
    return isLoading ? (
      <Skeleton.Input size='small' active={isLoading} />
    ) : (
      _text
    );
  };

  const columns = (key: string) => [
    {
      dataIndex: 'title',
      title: () => getElemOrSkeleton(key, <Trans>Title</Trans>),
      fixed: 'left',
      width: 200,
      ellipsis: true,
      render: (val: string) => getElemOrSkeleton(key, val),
      ...getColumnSearchProps('title', key),
    },
    {
      dataIndex: 'is_active',
      title: () => getElemOrSkeleton(key, <Trans>Is Active</Trans>),
      align: 'center' as 'center',
      render: (val: boolean) => getElemOrSkeleton(key, val ? 'Yes' : 'No'),
    },
    {
      dataIndex: 'code',
      title: () => getElemOrSkeleton(key, <Trans>Code</Trans>),
      ellipsis: true,
      render: (val: string) => getElemOrSkeleton(key, val),
    },
    {
      dataIndex: 'effective_from',
      title: () => getElemOrSkeleton(key, <Trans>As Of Date</Trans>),
      ellipsis: true,
      render: (val: string) => getElemOrSkeleton(key, val),
    },
    {
      dataIndex: 'head',
      title: () => getElemOrSkeleton(key, <Trans>Head</Trans>),
      render: (val: any) => getElemOrSkeleton(key, val?.emp_id),
    },
    {
      dataIndex: 'financial_year',
      title: () => getElemOrSkeleton(key, <Trans>Financial Year</Trans>),
      ellipsis: true,
      render: (val: any) => getElemOrSkeleton(key, val?.title),
    },
    {
      dataIndex: 'timezone',
      title: () => getElemOrSkeleton(key, <Trans>Timezone</Trans>),
      ellipsis: true,
      render: (val: any) => getElemOrSkeleton(key, val?.title),
    },
    {
      dataIndex: 'currency',
      title: () => getElemOrSkeleton(key, <Trans>Currency</Trans>),
      ellipsis: true,
      render: (val: any) => getElemOrSkeleton(key, val?.currency.title),
    },
    {
      dataIndex: 'is_gst_registered',
      title: () => getElemOrSkeleton(key, <Trans>Is GST Registered</Trans>),
      align: 'center',
      render: (val: boolean) => getElemOrSkeleton(key, val ? 'Yes' : 'No'),
    },
    {
      dataIndex: 'has_employees',
      title: () => getElemOrSkeleton(key, <Trans>Has Employees</Trans>),
      align: 'center',
      render: (val: boolean) => getElemOrSkeleton(key, val ? 'Yes' : 'No'),
    },
    {
      dataIndex: 'Action',
      title: () => getElemOrSkeleton(key, <Trans>Action</Trans>),
      align: 'center',
      render: (_: any, item: any) =>
        entityData[key].isLoading ? (
          getElemOrSkeleton(key, '')
        ) : (
          <DotMenu
            actionBtn={((): actionBtnObjInterface[] => {
              const actions: actionBtnObjInterface[] = [
                {
                  icon: PartitionOutlined,
                  OnClick: () =>
                    history.push(
                      `${appPath.config_setup.entityTypes.viewHierarchy.linkTo}${item.uuid}?title=${item.title}`,
                    ),
                  children: <Trans>View Hierarchy</Trans>,
                  Type: 'link',
                },
              ];
              if (getPermissions.ACTION_SETUP_ENTITIES) {
                actions.unshift({
                  icon: EditOutlined,
                  OnClick: () => onEditItem(item),
                  children: <Trans>Edit</Trans>,
                  Type: 'link',
                });
              }
              return actions;
            })()}
          >
            <EllipsisOutlined />
          </DotMenu>
        ),
    },
  ];

  const handleTabClick = (key: string) => {
    history.push(`${appPath.config_setup.entityTypes.linkTo}${key}`);
  };

  useEffect(() => {
    if (entityData && Object.keys(entityData).length > 0) {
      const currentKeys = Object.values(entityData).map(data =>
        getTabKey(data.type),
      );

      if (!currentKeys.includes(tab)) {
        history.replace(
          `${appPath.config_setup.entityTypes.linkTo}${currentKeys[0]}`,
        );
      }
    }
  }, [tab, entityData]);

  const renderData = () => {
    if (entityData && Object.keys(entityData).length > 0) {
      return (
        <Tabs
          activeKey={tab}
          onTabClick={handleTabClick}
          renderTabBar={(_props: any, DefaultTabBar: ComponentType) => (
            <div className='tabs-with-back-button-container'>
              <BackButton backBtnUrl={`${appPath.config_setup.path}`} />
              <DefaultTabBar {..._props} />
            </div>
          )}
        >
          {Object.keys(entityData).map((key, index) => (
            <Tabs.TabPane
              key={getTabKey(entityData[key].type)}
              tab={entityData[key].type}
              disabled={!entityData[key].isActive}
            >
              <div className='legal-entity-listing-container'>
                {entityData[key].data && entityData[key].data.length > 0 ? (
                  <Table
                    bordered
                    rowKey={item => item.id}
                    pagination={{
                      hideOnSinglePage: false,
                      position: ['bottomRight'],
                      defaultCurrent: 1,
                      current: pageNumber,
                      onChange: (page: number, size?: number) => {
                        setPageSize(size);
                        setPageNumber(page);
                      },
                      pageSize: pageSize || 10,
                      onShowSizeChange: (page: number, size?: number) => {
                        setPageSize(size);
                        setPageNumber(page);
                      },
                      total: entityData[key].data.length,
                      showTotal: (total: number, range: number[]) => {
                        return <>{`${range[0]}-${range[1]} of ${total}`}</>;
                      },
                      showQuickJumper: {
                        goButton: (
                          <Button type='default'>
                            <Trans>Go</Trans>
                          </Button>
                        ),
                      },
                    }}
                    columns={columns(key) as any}
                    onChange={onTableChange}
                    dataSource={
                      entityData[key].isLoading
                        ? new Array(10).fill({})
                        : entityData[key].data
                    }
                    scroll={{ x: 1200 }}
                  />
                ) : (
                  <NoData />
                )}
              </div>
            </Tabs.TabPane>
          ))}
        </Tabs>
      );
    } else {
      return (
        <div className='legal-entity-listing-container'>
          <Empty />
        </div>
      );
    }
  };

  const onSaveItem = () => {
    const id = editItem.id;
    const values = form.getFieldsValue();
    values.legal_entity_type = editItem.legal_entity_type;
    _updateEntity(values, id);
    setEditItem(undefined);
  };

  const getTabKey = (type: string) => {
    return type?.replace(/ /g, '-')?.toLocaleLowerCase();
  };

  return (
    <HeaderBarWrapper headerCommonProps={{ title: <Trans>Entity</Trans> }}>
      <ElementOrSkeleton
        isLoading={isLoading}
        isActive={true}
        type='table'
        tableConfiguration={{ rows: 10, columns: 8 }}
      >
        {renderData()}
      </ElementOrSkeleton>

      <AppDrawer
        visible={editItem !== undefined}
        title={editItem?.legal_entity_type?.title}
        onClose={() => setEditItem(undefined)}
        showCancelButton={false}
        OkText={<Trans>Save</Trans>}
        width='50%'
        closable={true}
        className='app-drawer-legal-entity-listing'
        onOkClick={onSaveItem}
      >
        {isDataSubmitting ? (
          <SkeletonItem />
        ) : (
          <Form layout='vertical' form={form}>
            <Form.Item label={<Trans>Title</Trans>} name='title'>
              <Input disabled={true} />
            </Form.Item>

            <Form.Item noStyle>
              <Row gutter={20} align='bottom'>
                <Col span={8}>
                  <Form.Item label={<Trans>Code</Trans>} name='code'>
                    <Input disabled={true} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label={<Trans>As of Date</Trans>}
                    name='effective_from'
                  >
                    <Input disabled={true} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label=' ' name='is_active' valuePropName='checked'>
                    <Checkbox disabled={true}>
                      <Trans>Is Active</Trans>
                    </Checkbox>
                  </Form.Item>
                </Col>
              </Row>
            </Form.Item>
            <Form.Item label={<Trans>Head</Trans>} name='head'>
              <Input disabled={true} />
            </Form.Item>
            <Form.Item noStyle>
              <Row gutter={20}>
                <Col span={8}>
                  <Form.Item
                    label={<Trans>Financial Cycle</Trans>}
                    name='financial_year'
                    required
                  >
                    <Select
                      showSearch
                      filterOption={(input: any, option: any) =>
                        option.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                      disabled={
                        !entityData[editItem?.legal_entity_type?.id]
                          ?.isParentEntity
                      }
                    >
                      {renderOptions(financialCycle, 'code')}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label={<Trans>Timezone</Trans>} name='timezone'>
                    <Select
                      showSearch
                      filterOption={(input: any, option: any) =>
                        option.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {renderOptions(timeZones)}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label={<Trans>Currency</Trans>}
                    name='currency'
                    required
                  >
                    <Select
                      showSearch
                      filterOption={(input: any, option: any) =>
                        option.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                      disabled={
                        !entityData[editItem?.legal_entity_type?.id]
                          ?.isParentEntity
                      }
                    >
                      {renderCurrencies()}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </Form.Item>
            <Row gutter={20}>
              <Col>
                <Form.Item
                  label=''
                  name='is_gst_registered'
                  valuePropName='checked'
                >
                  <Checkbox>
                    <Trans>Is GST Registered</Trans>
                  </Checkbox>
                </Form.Item>
              </Col>
              <Col>
                <Form.Item
                  label=''
                  name='has_employees'
                  valuePropName='checked'
                >
                  <Checkbox>
                    <Trans>Has Employees</Trans>
                  </Checkbox>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        )}
      </AppDrawer>
    </HeaderBarWrapper>
  );
};

const mapStateToProps = (state: any) => ({
  isLoading: getEntityLoader(state),
  loadingMessage: getEntityLoadingMessage(state),
  companies: getCompanyEntity(state),
  divisions: getDivisionEntity(state),
  organizations: getOrganizationEntity(state),
  departments: getDepartmentEntity(state),
  entityData: getLegalEntityData(state),
  currencyList: getCountryCurrencyList(state),
  timeZones: getTimeZones(state),
  success: getLegalEntitySuccess(state),
  error: getLegalEntityError(state),
  isDataSubmitting: isEntityDataSubmitting(state),
  financialCycle: getFinancialCycle(state),
  getPermissions: getPermissions(state),
});

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  _fetchEntityTypes: () => dispatch(fetchLegalEntityTypes()),
  _fetchCurrencies: () => dispatch(fetchCountryCurrencyList()),
  _fetchTimezones: () => dispatch(fetchTimeZoneList()),
  _saveSuccess: () => dispatch(saveSuccess('')),
  _saveError: () => dispatch(saveError('')),
  _updateEntity: (body: any, id: string) =>
    dispatch(updateLegalEntity(body, id)),
  _fetchFinancialCycle: () => dispatch(fetchFinancialYears()),
});

const connector = connect(mapStateToProps, mapDispatchToProps);

export default connector(EntityListing);
