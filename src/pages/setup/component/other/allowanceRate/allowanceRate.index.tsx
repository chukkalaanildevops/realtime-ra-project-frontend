/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, Dispatch, useRef } from 'react';
import {
  Form,
  Input,
  InputNumber,
  DatePicker,
  message,
  Select,
  Skeleton,
  Row,
  Col,
  Checkbox,
  Pagination,
  Table,
  Button,
  AutoComplete,
  Space,
} from 'antd';

import moment from 'moment';

import {
  HeaderBarWrapper,
  ErrorBoundary,
  FilterBar,
  DotMenu,
  AppDrawer,
  SkeletonItem,
  OptionalItem,
  DataFilter,
} from '../../../../../shared/components';

import {
  getPermissions,
  getAllowanceLoader,
  getAllowanceSuccessMessage,
  getAllowanceList,
  getCompanyList,
  getDestinationList,
  getTitleList,
  getEligibilityList,
  getPayComponentList,
  getGlAccountList,
  getAllowanceHistoryLoader,
  getAllowanceHistory,
  getAllowanceCurrencyList,
} from '../../../../../shared/redux/rootReducer';

import {
  FullscreenOutlined,
  EllipsisOutlined,
  //DeleteOutlined,
  EditOutlined,
  CopyOutlined,
  SearchOutlined,
} from '@ant-design/icons';

import {
  fetchAllowanceList,
  fetchCurrencyList,
  fetchCompanyList,
  fetchEligibilityList,
  fetchDestinationList,
  fetchTitleList,
  fetchPayComponentList,
  fetchGlAccountList,
  uploadAllowanceCSV,
  downloadAllowanceTemplate,
  createAllowanceRate,
  updateAllowanceRateItem,
  fetchAllowanceHistory,
} from './allowanceRate.thunk';
import { Trans } from '@lingui/macro';
import { connect, ConnectedProps } from 'react-redux';
import { appPath } from '../../../../app/app.routes';
import Errors from './allowanceRate.data.json';
import { ColumnProps } from 'antd/lib/table';
import { IItem } from './allowanceRate.model';
import { getFormattedDate } from '../../../../../utils/scroll.utils';

let filters: any = {};
let initialPageSize = 12;
let localFilters: any;

const AllowanceRate: React.FC<ConnectedProps<typeof connector>> = props => {
  const [form] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);
  const [newItemModalVisible, setNewItemModalVisible] = useState(false);
  const [allowanceFilters, setAllowanceFilters] = useState<any>(null);
  const [editingKey, setEditingKey] = useState('');

  const {
    isLoader,
    success,
    allowanceList,
    currencies,
    fetchCurrencies,
    companies,
    fetchCompanies,
    destinations,
    fetchDestinations,
    titles,
    fetchTitles,
    payComponents,
    fetchPayComponents,
    glAccounts,
    fetchGlAccounts,
    _uploadFile,
    getPermissions,
    _downloadFile,
    fetchAllowance,
    createAllowance,
    updateRecord,
    fetchAllowanceHistoryByID,
    allowanceHistoryLoader,
    allowanceHistory,
    eligibilities,
    fetchEligibilities,
  } = props;
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [searchValue, setSearchValue] = useState('');
  const [filteredCompany, setFilteredCompany] = useState(companies);
  const [filteredDestination, setFilteredDestination] = useState(destinations);
  const [filteredTitle, setFilteredTitle] = useState(titles);
  const [filteredEligibility, setFilteredEligibility] = useState(eligibilities);
  const [filteredCurrency, setFilteredCurrency] = useState(currencies);
  const [filteredPayComponent, setFilteredPayComponent] = useState(
    payComponents,
  );
  const [filteredGlAccount, setFilteredGlAccount] = useState(glAccounts);
  const [unlimitedAmountCheckbox, setUnlimitedAmountCheckbox] = useState<
    boolean
  >(false);
  const [amount, setAmount] = useState<number | null>(null);
  const [isFilterVisible, setFilterVisible] = useState(false);

  useEffect(() => {
    setFilteredCompany(companies);
    setFilteredDestination(destinations);
    setFilteredTitle(titles);
    setFilteredEligibility(eligibilities);
    setFilteredCurrency(currencies);
    setFilteredPayComponent(payComponents);
    setFilteredGlAccount(glAccounts);
  }, [
    companies,
    destinations,
    eligibilities,
    currencies,
    payComponents,
    glAccounts,
  ]);

  useEffect(() => {
    fetchAllowance(1, pageSize, allowanceFilters);
  }, [allowanceFilters]);

  useEffect(() => {
    if (unlimitedAmountCheckbox) {
      form.setFieldsValue({ amount: null });
    } else {
      form.setFieldsValue({ amount: amount });
    }
  }, [unlimitedAmountCheckbox]);

  useEffect(() => {
    if (success) {
      // handleReset(resetCCFilter);
      setAllowanceFilters(null);
      setTimeout(() => {
        message.success(success, 3);
      }, 100);
      setEditingKey('');
      setNewItemModalVisible(false);
    }
  }, [success]);

  useEffect(() => {
    fetchCurrencies();
    fetchCompanies();
    fetchEligibilities();
    fetchDestinations();
    fetchTitles();
    fetchPayComponents();
    fetchGlAccounts();
  }, []);

  const onTableChange = (...tableProps: any) => {
    let localFilters = tableProps[1];
    if (tableProps[2].field) {
      localFilters.ordering =
        tableProps[2].order === 'ascend'
          ? tableProps[2].field
          : '-' + tableProps[2].field;
    }
    setAllowanceFilters(tableProps[1]);
  };

  const onApplyFilters = (filters: any) => {
    localFilters = filters;
    fetchAllowance(1, pageSize, filters);
  };

  const onResetFilters = () => {
    localFilters = undefined;
    fetchAllowance(1, pageSize, undefined);
  };

  const onChangePagination = (page: number, pageSize: number) => {
    fetchAllowance(page, pageSize, localFilters);
  };

  const handleAddConfig = () => {
    form.resetFields();
    setNewItemModalVisible(true);
    setAmount(null);
  };

  const onCancel = () => {
    setNewItemModalVisible(false);
    setUnlimitedAmountCheckbox(false);
    form.resetFields();
    setEditingKey('');
  };

  const downloadTemplate = () => {
    _downloadFile();
  };
  const clone = (record: any) => {
    setNewItemModalVisible(true);
    setAmount(record?.amount);
    setUnlimitedAmountCheckbox(record?.is_full_amount_allowed);
    setValuesToForm({
      company: record?.company?.uuid,
      effective_from: moment(record?.effective_from, 'DD/MM/YYYY'),
      destination: record?.destination?.id,
      subrate_title: record?.subrate_title?.id,
      eligibility: record?.eligibility?.id,
      amount: unlimitedAmountCheckbox ? null : record.amount,
      allowance_currency: record?.allowance_currency?.id,
      is_full_amount_allowed: record?.is_full_amount_allowed,
      is_receipt_mandatory: record?.is_receipt_mandatory,
      is_update_allowed: record?.is_update_allowed,
      half_day_cutoff: record?.half_day_cutoff,
      pay_component: record?.pay_component?.id,
      gl_account: record?.gl_account?.id,
    });
  };

  const onUpdate = (record: any) => {
    setNewItemModalVisible(true);
    setAmount(record?.amount);
    setUnlimitedAmountCheckbox(record?.is_full_amount_allowed);
    setValuesToForm({
      company: record?.company?.uuid,
      effective_from: moment(record?.effective_from, 'DD/MM/YYYY'),
      destination: record?.destination?.id,
      subrate_title: record?.subrate_title?.id,
      eligibility: record?.eligibility?.id,
      amount: unlimitedAmountCheckbox ? null : record.amount,
      is_full_amount_allowed: record?.is_full_amount_allowed,
      allowance_currency: record?.allowance_currency?.id,
      is_receipt_mandatory: record?.is_receipt_mandatory,
      is_update_allowed: record?.is_update_allowed,
      half_day_cutoff: record?.half_day_cutoff,
      pay_component: record?.pay_component?.id,
      gl_account: record?.gl_account?.id,
    });
    setEditingKey(record.id);
  };

  const setValuesToForm = (record: any) => {
    form.setFieldsValue(record);
    setNewItemModalVisible(true);
  };

  const onSave = async () => {
    try {
      const values = await form.validateFields();
      values.effective_from = values.effective_from.format('DD/MM/YYYY');
      values.amount = Number(values.amount).toFixed(2);
      if (editingKey === '') {
        createAllowance(values);
      } else {
        updateRecord(editingKey, values, pageSize);
      }
    } catch (errInfo) {
      console.error('Validate Failed:', errInfo);
    }
  };

  const getOptions = (array: any[]) => {
    return (
      array &&
      array.map(item => (
        <Select.Option key={item.id} value={item.id}>
          {item.title}
        </Select.Option>
      ))
    );
  };

  const getCompanyOptions = (array: any[]) => {
    return (
      array &&
      array.map(item => (
        <Select.Option key={item.uuid} value={item.uuid}>
          {item.title}
        </Select.Option>
      ))
    );
  };

  const getGlAccountOptions = (array: any[]) => {
    return (
      array &&
      array.map(item => (
        <Select.Option key={item.id} value={item.id}>
          {item.account_number}
        </Select.Option>
      ))
    );
  };

  const onItemExpand = (record: any) => {
    setModalVisible(true);
    fetchAllowanceHistoryByID(record.id);
  };

  type CustomColProps = {
    editable?: boolean;
    isRequired?: boolean;
    inputType?: string;
  };

  const getElemOrSkeleton = (
    _text: string | React.ReactNode,
    _record?: any,
    _index?: number,
  ) => {
    return isLoader ? <Skeleton.Input size='small' active={isLoader} /> : _text;
  };

  const getColumns = (): ColProps[] => {
    const toBeRemovedIndexes: any = [];
    for (let index = 0; index < columns.length; index++) {
      const item = columns[index];
      if (
        item.key === 'options' &&
        !getPermissions.ACTION_SETUP_ALLOWANCE_RATE
      ) {
        toBeRemovedIndexes.push(index);
      }
    }
    const newColumns = columns.filter(
      (_item, index) => !toBeRemovedIndexes.includes(index),
    );
    return newColumns;
  };

  const getFilterOptions = <K extends keyof IItem>(_dataIndex: K) => {
    try {
      const options = companies
        .filter(
          item =>
            item.title.toLowerCase().indexOf(searchValue.toLowerCase()) > -1,
        )
        .map(obj => ({
          value: obj.title,
        }));
      return options;
    } catch (e) {
      return [];
    }
  };

  const handleSearch = (
    _selectedKeys: React.ReactText,
    confirm: () => void,
    _dataIndex: keyof IItem,
  ) => {
    confirm();
  };

  const handleReset = (clearFilters?: () => void) => {
    clearFilters && clearFilters();
  };

  const searchRef = useRef<any>(null);

  const getColumnSearchProps = <key extends keyof IItem>(
    dataIndex: key,
  ): ColumnProps<IItem> => ({
    filterDropdown: ({ setSelectedKeys, confirm, clearFilters }) => {
      return (
        <div style={{ padding: '10px' }}>
          <AutoComplete
            placeholder={`Search ${dataIndex.replace(/_/g, ' ')}`}
            allowClear={true}
            options={getFilterOptions(dataIndex)}
            onSelect={value => {
              setSelectedKeys([value.replace('&', '%26')]);
              handleSearch(value, confirm, dataIndex);
              filters[dataIndex] = value;
            }}
            onSearch={val => setSearchValue(val)}
            onChange={e => (e ? '' : handleReset(clearFilters))}
            autoFocus={true}
            ref={searchRef}
          >
            <Input.Search />
          </AutoComplete>
        </div>
      );
    },
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value: any, record: IItem) => {
      const item: any = record[dataIndex];
      const text = item?.title?.toLowerCase() || '';
      return text.includes(value.toLowerCase());
    },
    filteredValue: allowanceFilters?.[dataIndex] || null,
    onFilterDropdownVisibleChange: (visible: boolean) => {
      if (visible) {
        // setTimeout(() => searchRef.current?.select());
      }
    },
  });

  const handleCompanySearch = (value: string) => {
    const filtered = companies.filter(
      item => item.title.toLowerCase().indexOf(value.toLowerCase()) > -1,
    );
    setFilteredCompany(filtered);
  };
  type ColProps = ColumnProps<IItem> & CustomColProps;

  const columns: ColProps[] = [
    {
      //title: 'Company',
      title: () => getElemOrSkeleton(<Trans>Company</Trans>),
      dataIndex: 'company',
      key: 'company',
      width: '10%',
      editable: true,
      isRequired: true,
      inputType: 'alphanumeric',
      render: (company: any) => getElemOrSkeleton(company?.title),
      ...getColumnSearchProps('company'),
    },
    {
      //title: 'Effective Date',
      title: () => getElemOrSkeleton(<Trans>Effective Date</Trans>),
      dataIndex: 'effective_from',
      key: 'effective_from',
      width: '10%',
      editable: true,
      isRequired: true,
      inputType: 'date',
      align: 'center' as 'center',
      render: (effective_from: any) => getElemOrSkeleton(effective_from),
    },
    {
      //title: 'Destination',
      title: () => getElemOrSkeleton(<Trans>Destination</Trans>),
      dataIndex: 'destination',
      key: 'destination',
      width: '10%',
      editable: true,
      isRequired: true,
      inputType: 'text',
      align: 'center' as 'center',
      render: (destination: any) => getElemOrSkeleton(destination?.title),
    },
    {
      //title: 'Title',
      title: () => getElemOrSkeleton(<Trans>Title</Trans>),
      dataIndex: 'subrate_title',
      key: 'subrate_title',
      width: '10%',
      editable: true,
      isRequired: true,
      inputType: 'text',
      align: 'center' as 'center',
      render: (subrate_title: any) => getElemOrSkeleton(subrate_title?.title),
    },
    {
      //title: 'Eligibility',
      title: () => getElemOrSkeleton(<Trans>Eligibility</Trans>),
      dataIndex: 'eligibility',
      key: 'eligibility',
      width: '10%',
      editable: true,
      isRequired: true,
      inputType: 'text',
      align: 'center' as 'center',
      render: (eligibility: any) => getElemOrSkeleton(eligibility?.title),
    },
    {
      //title: 'Amount',
      title: () => getElemOrSkeleton(<Trans>Amount</Trans>),
      dataIndex: 'amount',
      key: 'amount',
      width: '10%',
      editable: true,
      isRequired: true,
      inputType: 'number' || 'string',
      align: 'center' as 'center',
      render: (amount: any) =>
        getElemOrSkeleton(
          Number(Number(amount).toFixed(2)) !== 0 &&
            Number(Number(amount).toFixed(2)) !== undefined &&
            Number(Number(amount).toFixed(2)) !== null
            ? Number(Number(amount).toFixed(2))
            : 'Unlimited',
        ),
    },
    {
      //title: 'Currency',
      title: () => getElemOrSkeleton(<Trans>Currency</Trans>),
      dataIndex: 'allowance_currency',
      key: 'allowance_currency',
      width: '10%',
      editable: true,
      isRequired: true,
      inputType: 'text',
      align: 'center' as 'center',
      render: (allowance_currency: any) =>
        getElemOrSkeleton(allowance_currency?.title),
    },
    {
      //title: 'Receipt Mandatory',
      title: () => getElemOrSkeleton(<Trans>Receipt Mandatory</Trans>),
      dataIndex: 'is_receipt_mandatory',
      key: 'is_receipt_mandatory',
      width: '10%',
      editable: true,
      isRequired: true,
      inputType: 'text',
      align: 'center' as 'center',
      render: (val: boolean) =>
        isLoader ? getElemOrSkeleton('') : val ? 'Yes' : 'No',
    },
    {
      //title: 'Allow Update',
      title: () => getElemOrSkeleton(<Trans>Allow Update</Trans>),
      dataIndex: 'is_update_allowed',
      key: 'is_update_allowed',
      width: '10%',
      editable: true,
      isRequired: true,
      inputType: 'text',
      align: 'center' as 'center',
      render: (val: boolean) =>
        isLoader ? getElemOrSkeleton('') : val ? 'Yes' : 'No',
    },
    {
      //title: 'Half Day Cut Off',
      title: () => getElemOrSkeleton(<Trans>Half Day Cut Off</Trans>),
      dataIndex: 'half_day_cutoff',
      key: 'half_day_cutoff',
      width: '10%',
      editable: true,
      isRequired: true,
      inputType: 'text',
      align: 'center' as 'center',
      render: (val: boolean) =>
        isLoader ? getElemOrSkeleton('') : val ? 'Yes' : 'No',
    },
    {
      //title: 'Pay Component',
      title: () => getElemOrSkeleton(<Trans>Pay Component</Trans>),
      dataIndex: 'pay_component',
      key: 'pay_component',
      width: '10%',
      editable: true,
      isRequired: true,
      inputType: 'alphanumeric',
      align: 'center' as 'center',
      render: (pay_component: any) => getElemOrSkeleton(pay_component?.title),
    },
    {
      //title: 'GL Account',
      title: () => getElemOrSkeleton(<Trans>GL Account</Trans>),
      dataIndex: 'gl_account',
      key: 'gl_account',
      width: '10%',
      editable: true,
      isRequired: true,
      inputType: 'number',
      align: 'center' as 'center',
      render: (gl_account: any) =>
        getElemOrSkeleton(gl_account?.account_number),
    },
    {
      //title: 'ACTION',
      title: () => getElemOrSkeleton(<Trans>Action</Trans>),
      dataIndex: 'action',
      key: 'action',
      width: '10%',
      render: (_: any, record: any) => {
        return isLoader ? (
          <Skeleton.Input size='small' active={isLoader} />
        ) : (
          <div>
            <DotMenu
              data-test='actions'
              actionBtn={[
                {
                  Type: 'link',
                  children: <Trans>Edit</Trans>,
                  icon: EditOutlined,
                  OnClick: () => {
                    onUpdate(record);
                  },
                  title: 'Edit',
                },
                {
                  OnClick: () => clone(record),
                  Type: 'link',
                  icon: CopyOutlined,
                  children: <Trans>Clone</Trans>,
                  title: 'Clone',
                },
                // {
                //   OnClick: () => delete(record),
                //   Type: 'link',
                //   icon: DeleteOutlined,
                //   children:  <Trans>Delete</Trans> ,
                //   title: 'Clone',
                // },
              ]}
            >
              <EllipsisOutlined />
            </DotMenu>
          </div>
        );
      },
    },
  ];

  return (
    <ErrorBoundary>
      <HeaderBarWrapper
        headerCommonProps={{ title: <Trans>Allowance Rate</Trans> }}
        data-test='allowanceContainer'
      >
        <div
          className='allowance-container'
          style={{ backgroundColor: 'white' }}
        >
          <FilterBar
            filterView={setFilterVisible}
            isAddButton={getPermissions.ACTION_SETUP_ALLOWANCE_RATE || true}
            addButtonOnClickFn={handleAddConfig}
            extraData={{
              showDropdown: getPermissions.ACTION_SETUP_ALLOWANCE_RATE || true,
              downloadHandle: downloadTemplate,
              uploadHandle: () => {},
            }}
            enableBackBtn={true}
            backBtnUrl={appPath.config_setup.allowanceRate.backLink}
            uploadConfig={{
              beforeUpload: file => {
                _uploadFile(file);
                return false;
              },
              showUploadList: false,
              defaultFileList: [],
            }}
          />
          <div style={{ marginBottom: 20 }}>
            <DataFilter
              page='DRAFT'
              includeLegalEntities
              includeStatusBar={false}
              includeDateRange={false}
              isVisible={isFilterVisible}
              includeDraftStatus={false}
              includeSaveFilterOption={false}
              includeDate={true}
              includeDestinationList={true}
              item={'allowance_rate'}
              onApplyFilters={onApplyFilters}
              onResetFilters={onResetFilters}
              includeEntityList={true}
              includeTitle={true}
              includeAmount={true}
              includeCurrency={true}
              includeEligibility={true}
            />
          </div>
          <>
            <Table
              columns={getColumns() as ColumnProps<any>[]}
              dataSource={allowanceList.data || []}
              bordered
              data-test='table-ar'
              rowKey={record => record.id}
              pagination={false}
              onChange={onTableChange}
              expandable={{
                expandedRowRender: () => null,
                rowExpandable: () => true,
                expandIcon: ({ record }) =>
                  isLoader ? (
                    <Skeleton.Input size='small' active={isLoader} />
                  ) : (
                    <FullscreenOutlined
                      onClick={() => {
                        onItemExpand(record);
                      }}
                      title='Details'
                    />
                  ),
              }}
            />
            <div
              style={{
                display: 'flex',
                flexDirection: 'row-reverse',
                marginTop: 12,
              }}
            >
              <Pagination
                defaultCurrent={1}
                current={allowanceList.current_page}
                onChange={(pageNumber: number, pageSize: any) => {
                  onChangePagination(pageNumber, pageSize);
                }}
                hideOnSinglePage={false}
                pageSizeOptions={['10', '12', '20', '50', '100']}
                showSizeChanger={true}
                pageSize={pageSize || 12}
                onShowSizeChange={(_current: number, size: number) => {
                  setPageSize(size);
                }}
                total={allowanceList.pagination_data?.total_records}
                showTotal={(total: number, range: number[]) => {
                  return <>{`${range[0]}-${range[1]} of ${total}`}</>;
                }}
                showQuickJumper={{
                  goButton: <Button type='default'>Go</Button>,
                }}
              />
            </div>
          </>
          <AppDrawer
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
            width='40%'
            closable={true}
            title={<Trans>Allowance Details</Trans>}
            showCancelButton={false}
            showOkButton={false}
            getContainer='.allowance-container'
          >
            {allowanceHistoryLoader ? (
              <SkeletonItem />
            ) : (
              <div>
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <OptionalItem
                      title={<Trans>Company</Trans>}
                      value={allowanceHistory.company?.title}
                    />
                  </Col>
                  <Col span={12}>
                    <OptionalItem
                      title={<Trans>Effective Date</Trans>}
                      value={getFormattedDate(allowanceHistory.effective_from)}
                    />
                  </Col>
                  <Col span={12}>
                    <OptionalItem
                      title={<Trans>Destination</Trans>}
                      value={allowanceHistory.destination?.title}
                    />
                  </Col>
                  <Col span={12}>
                    <OptionalItem
                      title={<Trans>Title</Trans>}
                      value={allowanceHistory.subrate_title?.title}
                    />
                  </Col>
                  <Col span={12}>
                    <OptionalItem
                      title={<Trans>Eligibility</Trans>}
                      value={allowanceHistory.eligibility?.title}
                    />
                  </Col>
                  <Col span={12}>
                    <OptionalItem
                      title={<Trans>Amount</Trans>}
                      value={
                        Number(Number(allowanceHistory.amount).toFixed(2)) !==
                          0 &&
                        Number(Number(allowanceHistory.amount).toFixed(2)) !==
                          undefined &&
                        Number(Number(allowanceHistory.amount).toFixed(2)) !==
                          null
                          ? Number(Number(allowanceHistory.amount).toFixed(2))
                          : 'Unlimited'
                      }
                    />
                  </Col>
                  <Col span={12}>
                    <OptionalItem
                      title={<Trans>Currency</Trans>}
                      value={allowanceHistory.allowance_currency?.title}
                    />
                  </Col>
                  <Col span={12}>
                    <OptionalItem
                      title={<Trans>Receipt Mandatory</Trans>}
                      value={
                        allowanceHistory.is_receipt_mandatory ? 'Yes' : 'No'
                      }
                    />
                  </Col>
                  <Col span={12}>
                    <OptionalItem
                      title={<Trans>Allow Update</Trans>}
                      value={allowanceHistory.is_update_allowed ? 'Yes' : 'No'}
                    />
                  </Col>
                  <Col span={12}>
                    <OptionalItem
                      title={<Trans>Half Day Cut Off</Trans>}
                      value={allowanceHistory.half_day_cutoff ? 'Yes' : 'No'}
                    />
                  </Col>
                  <Col span={12}>
                    <OptionalItem
                      title={<Trans>Pay Component</Trans>}
                      value={allowanceHistory.pay_component?.title}
                    />
                  </Col>
                  <Col span={12}>
                    <OptionalItem
                      title={<Trans>GL Account</Trans>}
                      value={allowanceHistory.gl_account?.account_number}
                    />
                  </Col>
                </Row>
              </div>
            )}
          </AppDrawer>
          <AppDrawer
            data-test='createDrawer'
            visible={newItemModalVisible}
            onClose={onCancel}
            title={
              editingKey ? (
                <Trans>Edit Item</Trans>
              ) : (
                <Trans>Add New Item</Trans>
              )
            }
            width='30%'
            onCancelClick={onCancel}
            onOkClick={onSave}
            OkText={editingKey ? <Trans>Update</Trans> : <Trans>Create</Trans>}
            getContainer='.allowance-container'
          >
            <Form
              form={form}
              data-test='allowanceForm'
              colon={false}
              layout='vertical'
            >
              <Form.Item
                label={<Trans>Company</Trans>}
                name='company'
                dependencies={['company']}
                rules={[{ required: true, message: Errors.COMPANY_REQUIRED }]}
              >
                <Select
                  data-test='company-search'
                  showSearch
                  filterOption={false}
                  onSearch={handleCompanySearch}
                  onSelect={() => setFilteredCompany(companies)}
                  //disabled={editingKey ? true : false}
                >
                  {getCompanyOptions(filteredCompany)}
                </Select>
              </Form.Item>
              <Form.Item
                label={<Trans>Effective Date</Trans>}
                name='effective_from'
                rules={[
                  { required: true, message: Errors.EFFECTIVE_DATE_REQUIRED },
                ]}
              >
                <DatePicker
                  format={'DD/MM/YYYY'}
                  style={{ width: '100%' }}
                  //disabledDate={disabledDate}
                />
              </Form.Item>
              <Form.Item
                label={<Trans>Destination</Trans>}
                name='destination'
                dependencies={['destination']}
                rules={[
                  { required: true, message: Errors.DESTINATION_REQUIRED },
                ]}
              >
                <Select
                  showSearch
                  filterOption={false}
                  onSelect={() => setFilteredDestination(destinations)}
                  //disabled={editingKey ? true : false}
                >
                  {getOptions(filteredDestination)}
                </Select>
              </Form.Item>
              <Form.Item
                label={<Trans>Title</Trans>}
                name='subrate_title'
                dependencies={['subrate_title']}
                rules={[{ required: true, message: Errors.TITLE_REQUIRED }]}
              >
                <Select
                  showSearch
                  filterOption={false}
                  onSelect={() => setFilteredTitle(titles)}
                  //disabled={editingKey ? true : false}
                >
                  {getOptions(filteredTitle)}
                </Select>
              </Form.Item>
              <Form.Item
                label={<Trans>Eligibility</Trans>}
                name='eligibility'
                dependencies={['eligibility']}
                rules={[
                  { required: true, message: Errors.ELIGIBILITY_REQUIRED },
                ]}
              >
                <Select
                  showSearch
                  filterOption={false}
                  onSelect={() => setFilteredEligibility(eligibilities)}
                  //disabled={editingKey ? true : false}
                >
                  {getOptions(filteredEligibility)}
                </Select>
              </Form.Item>
              <Row>
                <Space align='end'>
                  <Col span={22}>
                    <Form.Item
                      label={<Trans>Amount</Trans>}
                      name='amount'
                      rules={[
                        {
                          required: !unlimitedAmountCheckbox,
                          message: Errors.AMOUNT_REQUIRED,
                        },
                        {
                          validator: (_, value: any) =>
                            value !== undefined &&
                            value !== '' &&
                            value <= 0 &&
                            !unlimitedAmountCheckbox
                              ? Promise.reject(Errors.INVALID_AMOUNT)
                              : Promise.resolve(),
                        },
                      ]}
                    >
                      <InputNumber
                        style={{ width: '100%' }}
                        precision={2}
                        maxLength={15}
                        disabled={unlimitedAmountCheckbox}
                      />
                    </Form.Item>
                  </Col>
                  <Col>
                    <Form.Item
                      name='is_full_amount_allowed'
                      valuePropName='checked'
                    >
                      <Checkbox
                        onChange={value => {
                          setUnlimitedAmountCheckbox(value.target.checked);
                        }}
                      >
                        <Trans>Eligible For Unlimited Amount</Trans>
                      </Checkbox>
                    </Form.Item>
                  </Col>
                </Space>
              </Row>

              <Form.Item
                label={<Trans>Currency</Trans>}
                name='allowance_currency'
                dependencies={['allowance_currency']}
                rules={[{ required: true, message: Errors.CURRENCY_REQUIRED }]}
              >
                <Select
                  showSearch
                  filterOption={false}
                  // onSearch={handleTargetCurrencySearch}
                  onSelect={() => setFilteredCurrency(currencies)}
                  //disabled={editingKey ? true : false}
                >
                  {getOptions(filteredCurrency)}
                </Select>
              </Form.Item>
              <Form.Item
                label={<Trans>Receipt Mandatory</Trans>}
                name='is_receipt_mandatory'
                valuePropName='checked'
              >
                <Checkbox>
                  <Trans>Is Receipt Mandatory</Trans>
                </Checkbox>
              </Form.Item>
              <Form.Item
                label={<Trans>Allow Update</Trans>}
                name='is_update_allowed'
                valuePropName='checked'
              >
                <Checkbox>
                  <Trans>Is Allow Update</Trans>
                </Checkbox>
              </Form.Item>
              <Form.Item
                label={<Trans>Half Day Cut Off</Trans>}
                name='half_day_cutoff'
                valuePropName='checked'
              >
                <Checkbox>
                  <Trans>Is Half Day Cut Off</Trans>
                </Checkbox>
              </Form.Item>
              <Form.Item
                label={<Trans>Pay Component</Trans>}
                name='pay_component'
                dependencies={['pay_component']}
                // rules={[
                //   { required: true, message: Errors.PAY_COMPONENT_REQUIRED },
                // ]}
                rules={[{ required: false }]}
              >
                <Select
                  showSearch
                  filterOption={false}
                  // onSearch={handleTargetCurrencySearch}
                  onSelect={() => setFilteredPayComponent(payComponents)}
                  //disabled={editingKey ? true : false}
                >
                  {getOptions(filteredPayComponent)}
                </Select>
              </Form.Item>
              <Form.Item
                label={<Trans>Gl Account</Trans>}
                name='gl_account'
                dependencies={['gl_account']}
                rules={[
                  { required: true, message: Errors.GL_ACCOUNT_REQUIRED },
                ]}
              >
                <Select
                  showSearch
                  filterOption={false}
                  // onSearch={handleTargetCurrencySearch}
                  onSelect={() => setFilteredGlAccount(glAccounts)}
                  //disabled={editingKey ? true : false}
                >
                  {getGlAccountOptions(filteredGlAccount)}
                </Select>
              </Form.Item>
            </Form>
          </AppDrawer>
        </div>
      </HeaderBarWrapper>
    </ErrorBoundary>
  );
};

const mapStateToProps = (state: any) => {
  return {
    allowanceList: getAllowanceList(state),
    getPermissions: getPermissions(state),
    isLoader: getAllowanceLoader(state),
    success: getAllowanceSuccessMessage(state),
    destinations: getDestinationList(state),
    titles: getTitleList(state),
    currencies: getAllowanceCurrencyList(state),
    companies: getCompanyList(state),
    eligibilities: getEligibilityList(state),
    payComponents: getPayComponentList(state),
    glAccounts: getGlAccountList(state),
    allowanceHistory: getAllowanceHistory(state),
    allowanceHistoryLoader: getAllowanceHistoryLoader(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  return {
    fetchAllowance: (page: number, pageSize?: number, filter?: any) =>
      dispatch(fetchAllowanceList(page, pageSize, filter)),
    createAllowance: (body: any) => dispatch(createAllowanceRate(body)),
    fetchCurrencies: () => dispatch(fetchCurrencyList()),
    fetchCompanies: () => dispatch(fetchCompanyList()),
    fetchEligibilities: () => dispatch(fetchEligibilityList()),
    fetchDestinations: () => dispatch(fetchDestinationList()),
    fetchTitles: () => dispatch(fetchTitleList()),
    fetchPayComponents: () => dispatch(fetchPayComponentList()),
    fetchGlAccounts: () => dispatch(fetchGlAccountList()),
    updateRecord: (id: string, body: any, pageSize?: number) =>
      dispatch(updateAllowanceRateItem(id, body, pageSize)),
    fetchAllowanceHistoryByID: (id: string) =>
      dispatch(fetchAllowanceHistory(id)),
    _downloadFile: () => dispatch(downloadAllowanceTemplate()),
    _uploadFile: (file: any) => dispatch(uploadAllowanceCSV(file)),
  };
};

const connector = connect(mapStateToProps, mapDispatchToProps);
export default connector(AllowanceRate);
