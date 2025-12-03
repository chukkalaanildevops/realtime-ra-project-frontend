/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, Dispatch, useRef } from 'react';
import {
  Form,
  Input,
  AutoComplete,
  InputNumber,
  DatePicker,
  message,
  Select,
  Skeleton,
  Modal,
  Pagination,
  Table,
  Button,
} from 'antd';

import moment from 'moment';

import {
  HeaderBarWrapper,
  FilterBar,
  AppDrawer,
  DotMenu,
  ErrorBoundary,
} from '../../../../../shared/components';
import './currencyConversion.index.less';
import {
  SearchOutlined,
  FullscreenOutlined,
  EllipsisOutlined,
  EditOutlined,
  CopyOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import { ColumnProps } from 'antd/lib/table';

import {
  fetchCCList,
  createCurrencyConversion,
  fetchCurrencyList,
  updateCurrencyConversionItem,
  fetchConversionHistory,
  downloadCurrencyConversionTemplate,
  uploadCurrencyConversionCSV,
  uploadFromFTP,
} from './currencyConversion.thunk';
import { IItemStructure } from './currencyConversion.model';
import { connect, ConnectedProps } from 'react-redux';
import {
  getCurrencyList,
  getCCError,
  getCCSuccessMessage,
  getConversionHistory,
  getCurrencyLoader,
  getCurrencyLoadingMessage,
  getCurrencyDataSubmitting,
  getCurrencyConversionList,
  getPermissions,
} from '../../../../../shared/redux/rootReducer';
import Errors from './currencyConversion.data.json';
import { appPath } from '../../../../app/app.routes';
import { Trans } from '@lingui/macro';
// import { UploadChangeParam } from 'antd/lib/upload';
// import { UploadFile } from 'antd/lib/upload/interface';
import { resetMessages } from './currencyConversion.actions';
// import currencyConversionReducer from './currencyConversion.reducer';
let filters: any = {};
let initialPageSize = 12;
// import Pagination from 'antd/lib/pagination';

const CurrencyConversion: React.FC<ConnectedProps<
  typeof connector
>> = props => {
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState('');
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [searchValue, setSearchValue] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [newItemModalVisible, setNewItemModalVisible] = useState(false);
  const [errorsArray, setErrors] = useState<any[]>([]);
  const [ccFilters, setCcFilters] = useState<any>(null);
  // const [targetFilter, setTargetFilter] = useState<any>(null);

  const {
    ccList,
    fetchCC,
    createCC,
    currencies,
    fetchCurrencies,
    _downloadFile,
    _uploadFile,
    error,
    updateRecord,
    success,
    fetchConversionHistoryByID,
    conversionHistory,
    // isDataSubmitting,
    isLoader,
    currencyHistoryLoader,
    // loadingMessage,
    _resetMessages,
    _uploadFromFTP,
    getPermissions,
  } = props;

  // const data = ccList;

  const [filteredBaseCurrencies, setFilteredBaseCurrencies] = useState(
    currencies,
  );
  const [filteredTargetCurrencies, setFilteredTargetCurrencies] = useState(
    currencies,
  );

  useEffect(() => {
    setFilteredBaseCurrencies(currencies);
    setFilteredTargetCurrencies(currencies);
  }, [currencies]);

  useEffect(() => {
    try {
      if (error) {
        if (error instanceof Array) {
          setErrors(error);
        } else if (error instanceof Object) {
          const errors = Object.keys(error).map(item => ({
            name: item,
            errors: error[item],
          }));
          form.setFields(errors);
        } else if (typeof error === 'string') {
          message.error(error || 'Something went wrong', 3, _resetMessages);
        }
      } else {
        setErrors([]);
      }
    } catch (e) {}
  }, [error]);

  // useEffect(() => {
  //   if ((isLoader || isDataSubmitting) && loadingMessage) {
  //     message.loading(loadingMessage);
  //   } else {
  //     message.destroy();
  //   }
  // }, [loadingMessage, isLoader]);

  const setValuesToForm = (record: any) => {
    try {
      form.setFieldsValue({
        ...record,
        base_currency: record.base_currency.id,
        target_currency: record.target_currency.id,
        effective_from: moment(record.effective_from, 'DD/MM/YYYY'),
      });
      setNewItemModalVisible(true);
    } catch (e) {}
  };

  const clone = (record: any) => {
    const newRecord = { ...record };
    newRecord.effective_from = moment();
    setValuesToForm(newRecord);
  };

  const onUpdate = (record: any) => {
    setValuesToForm(record);
    setEditingKey(record.id);
  };

  useEffect(() => {
    // fetchCC(1);
    fetchCurrencies();
  }, []);

  const errorColumns = [
    {
      dataIndex: 'row',
      title: <Trans>Row No</Trans>,
      width: '80px',
    },
    {
      dataIndex: 'data_errors',
      title: <Trans>Errors</Trans>,
      render: (val: any) => {
        const keys = Object.keys(val);
        return keys.map(key => (
          <div>
            <span style={{ fontWeight: 600 }}>{key} : </span> {val[key]}
          </div>
        ));
      },
    },
  ];

  const onCancel = () => {
    setNewItemModalVisible(false);
    form.resetFields();
    setEditingKey('');
  };
  const onSave = async () => {
    try {
      const values = await form.validateFields();
      values.effective_from = values.effective_from.format('DD/MM/YYYY');
      if (editingKey === '') {
        createCC(values);
      } else {
        updateRecord(editingKey, values, pageSize);
      }
    } catch (errInfo) {
      console.error('Validate Failed:', errInfo);
    }
  };
  const getFilterOptions = <K extends keyof IItemStructure>(_dataIndex: K) => {
    try {
      const options = currencies
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

  useEffect(() => {
    fetchCC(1, pageSize, ccFilters);
  }, [ccFilters]);

  const searchRef = useRef<any>(null);
  // let resetCCFilter: any = null;

  const getColumnSearchProps = <key extends keyof IItemStructure>(
    dataIndex: key,
  ): ColumnProps<IItemStructure> => ({
    filterDropdown: ({ setSelectedKeys, confirm, clearFilters }) => {
      // resetCCFilter = clearFilters;
      return (
        <div style={{ padding: '10px' }}>
          <AutoComplete
            placeholder={`Search ${dataIndex.replace(/_/g, ' ')}`}
            allowClear={true}
            options={getFilterOptions(dataIndex)}
            onSelect={value => {
              setSelectedKeys([value]);
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
    onFilter: (value: any, record: IItemStructure) => {
      const item: any = record[dataIndex];
      const text = item?.title?.toLowerCase() || '';
      return text.includes(value.toLowerCase());
    },
    filteredValue: ccFilters?.[dataIndex] || null,
    onFilterDropdownVisibleChange: (visible: boolean) => {
      if (visible) {
        // setTimeout(() => searchRef.current?.select());
      }
    },
  });

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

  const getElemOrSkeletonCh = (
    _text: string | React.ReactNode,
    _record?: any,
    _index?: number,
  ) => {
    return currencyHistoryLoader ? (
      <Skeleton.Input size='small' active={currencyHistoryLoader} />
    ) : (
      _text
    );
  };

  type ColProps = ColumnProps<IItemStructure> & CustomColProps;

  const columns: ColProps[] = [
    {
      // title: 'Base Currency',
      title: () => getElemOrSkeleton(<Trans>Base Currency</Trans>),
      dataIndex: 'base_currency',
      key: 'base_currency',
      width: '28%',
      editable: true,
      isRequired: true,
      inputType: 'text',
      render: (base_currency: any) => getElemOrSkeleton(base_currency?.title),
      ...getColumnSearchProps('base_currency'),
    },
    {
      // title: 'Target Currency',
      title: () => getElemOrSkeleton(<Trans>Target Currency</Trans>),
      dataIndex: 'target_currency',
      key: 'target_currency',
      width: '28%',
      editable: true,
      isRequired: true,
      inputType: 'text',
      render: (target_currency: any) =>
        getElemOrSkeleton(target_currency?.title),
      ...getColumnSearchProps('target_currency'),
    },
    {
      title: () => getElemOrSkeleton(<Trans>Rate</Trans>),
      dataIndex: 'rate',
      key: 'rate',
      width: '18%',
      isRequired: true,
      editable: true,
      inputType: 'number',
      render: getElemOrSkeleton,
      sorter: (a: IItemStructure, b: IItemStructure) => a.rate - b.rate,
      sortDirections: ['descend', 'ascend'],
      sortOrder:
        ccFilters?.ordering === '-rate'
          ? 'descend'
          : ccFilters?.ordering === 'rate'
          ? 'ascend'
          : undefined,
    },
    {
      title: () => getElemOrSkeleton(<Trans>As Of Date</Trans>),
      dataIndex: 'effective_from',
      key: 'effective_from',
      width: '18%',
      isRequired: true,
      editable: true,
      inputType: 'date',
      render: getElemOrSkeleton,
    },
    {
      title: () => getElemOrSkeleton(<Trans>Action</Trans>),
      dataIndex: 'options',
      key: 'options',
      width: 90,
      align: 'center' as 'center',
      render: (_: any, record: IItemStructure) => {
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
                  OnClick: () => onUpdate(record),
                  title: 'Edit',
                },
                {
                  OnClick: () => clone(record),
                  Type: 'link',
                  icon: CopyOutlined,
                  children: <Trans>Clone</Trans>,
                  title: 'Clone',
                },
              ]}
            >
              <EllipsisOutlined />
            </DotMenu>
          </div>
        );
      },
    },
  ];

  const getColumns = (): ColProps[] => {
    const toBeRemovedIndexes: any = [];
    for (let index = 0; index < columns.length; index++) {
      const item = columns[index];
      if (
        item.key === 'options' &&
        !getPermissions.ACTION_SETUP_CURRENCY_CONVERSIONS
      ) {
        toBeRemovedIndexes.push(index);
      }
    }
    const newColumns = columns.filter(
      (_item, index) => !toBeRemovedIndexes.includes(index),
    );
    return newColumns;
  };

  const handleSearch = (
    _selectedKeys: React.ReactText,
    confirm: () => void,
    _dataIndex: keyof IItemStructure,
  ) => {
    confirm();
  };

  const handleReset = (clearFilters?: () => void) => {
    clearFilters && clearFilters();
  };

  const handleAddConfig = () => {
    form.resetFields();
    setNewItemModalVisible(true);
  };
  useEffect(() => {
    if (success) {
      // handleReset(resetCCFilter);
      setCcFilters(null);
      setTimeout(() => {
        message.success(success, 3);
      }, 100);
      setEditingKey('');
      setNewItemModalVisible(false);
    }
  }, [success]);

  // const handleUpload = (files: UploadChangeParam<UploadFile<any>>) => {
  //   _uploadFile(files.file);
  // };

  const downloadTemplate = () => {
    _downloadFile();
  };

  const viewCols = [
    {
      dataIndex: 'rate',
      title: <Trans>Rate</Trans>,
      key: 'id',
      render: getElemOrSkeletonCh,
    },
    {
      dataIndex: 'effective_from',
      title: <Trans>As of date</Trans>,
      key: 'id',
      render: getElemOrSkeletonCh,
    },
  ];

  const getCurrencyOptions = (array: any[]) => {
    return (
      array &&
      array.map(item => (
        <Select.Option key={item.id} value={item.id}>
          {item.title}
        </Select.Option>
      ))
    );
  };

  const onItemExpand = (record: any) => {
    setModalVisible(true);
    fetchConversionHistoryByID(record.uuid);
  };

  const disabledDate = (current: any) => {
    return moment()
      .endOf('day')
      .isBefore(current);
  };

  const handleTargetCurrencySearch = (value: string) => {
    const filtered = currencies.filter(
      item => item.title.toLowerCase().indexOf(value.toLowerCase()) > -1,
    );
    setFilteredTargetCurrencies(filtered);
  };

  const handleBaseCurrencySearch = (value: string) => {
    const filtered = currencies.filter(
      item => item.title.toLowerCase().indexOf(value.toLowerCase()) > -1,
    );
    setFilteredBaseCurrencies(filtered);
  };

  const onChangePagination = (page: number, pageSize: number) => {
    fetchCC(page, pageSize, ccFilters);
  };

  const onTableChange = (...tableProps: any) => {
    let localFilters = tableProps[1];
    if (tableProps[2].field) {
      localFilters.ordering =
        tableProps[2].order === 'ascend'
          ? tableProps[2].field
          : '-' + tableProps[2].field;
    }
    setCcFilters(tableProps[1]);
  };
  return (
    <ErrorBoundary>
      <HeaderBarWrapper
        headerCommonProps={{ title: <Trans>Currency Conversion</Trans> }}
        data-test='currencyConversionContainer'
      >
        <div className='currency-conversion-container'>
          <FilterBar
            isAddButton={getPermissions.ACTION_SETUP_CURRENCY_CONVERSIONS}
            addButtonOnClickFn={handleAddConfig}
            extraData={{
              showDropdown: getPermissions.ACTION_SETUP_CURRENCY_CONVERSIONS,
              downloadHandle: downloadTemplate,
              //uploadHandle: handleUpload,
              uploadHandle: () => {},
              uploadFromFTP: _uploadFromFTP,
            }}
            enableBackBtn={true}
            backBtnUrl={appPath.config_setup.currencyConversion.backLink}
            uploadConfig={{
              // beforeUpload: _file => false,
              beforeUpload: file => {
                _uploadFile(file);
                return false;
              },
              showUploadList: false,
              defaultFileList: [],
            }}
          />

          {/* {!ccList.data || ccList.data?.length === 0 && Object.keys(ccFilters).length===0 ? (
            <NoData />
          ) : ( */}
          <>
            <Table
              columns={getColumns() as ColumnProps<any>[]}
              dataSource={ccList.data || []}
              bordered
              data-test='table-cc'
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
                      onClick={() => onItemExpand(record)}
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
                current={ccList.current_page}
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
                total={ccList.pagination_data?.total_records}
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
          </>
          {/* )} */}

          <Modal
            visible={errorsArray.length > 0}
            onOk={_resetMessages}
            onCancel={_resetMessages}
            cancelButtonProps={{ style: { display: 'none' } }}
            bodyStyle={{ paddingTop: 0, paddingBottom: 0 }}
            title={
              <div style={{ display: 'flex' }}>
                <CloseCircleOutlined style={{ fontSize: 18, color: 'red' }} />
                <span style={{ marginLeft: 12 }}>Errors</span>
              </div>
            }
          >
            <div style={{ marginTop: 12 }}>
              <Table
                columns={errorColumns}
                dataSource={errorsArray}
                pagination={false}
              />
            </div>
          </Modal>

          <AppDrawer
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
            width='40%'
            closable={true}
            title={
              conversionHistory && conversionHistory.length > 0 ? (
                <>
                  <>{conversionHistory[0].base_currency?.title}</>
                  <>To</>
                  <>{conversionHistory[0].target_currency?.title}</>
                </>
              ) : (
                <Trans>Conversion History</Trans>
              )
            }
            showCancelButton={false}
            showOkButton={false}
            getContainer='.currency-conversion-container'
          >
            <Table
              bordered
              rowKey={record => record.id}
              columns={viewCols as ColumnProps<any>[]}
              dataSource={
                currencyHistoryLoader
                  ? new Array(10).fill({})
                  : conversionHistory
              }
              pagination={false}
              // loading={currencyHistoryLoader}
            />
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
            getContainer='.currency-conversion-container'
          >
            <Form
              form={form}
              data-test='ccForm'
              colon={false}
              layout='vertical'
            >
              <Form.Item
                label={<Trans>Base Currency</Trans>}
                name='base_currency'
                dependencies={['target_currency']}
                rules={[
                  { required: true, message: Errors.BASE_CURRENCY_REQUIRED },

                  {
                    validator: (_, value: string) =>
                      value && value === form.getFieldValue('target_currency')
                        ? Promise.reject(Errors.SAME_CURRENCY)
                        : Promise.resolve(),
                  },
                ]}
              >
                <Select
                  data-test='base-currency-search'
                  showSearch
                  filterOption={false}
                  onSearch={handleBaseCurrencySearch}
                  onSelect={() => setFilteredBaseCurrencies(currencies)}
                  disabled={editingKey ? true : false}
                >
                  {getCurrencyOptions(filteredBaseCurrencies)}
                </Select>
              </Form.Item>
              <Form.Item
                label={<Trans>Target Currency</Trans>}
                name='target_currency'
                dependencies={['base_currency']}
                rules={[
                  { required: true, message: Errors.TARGET_CURRENCY_REQUIRED },
                  {
                    validator: (_, value: string) =>
                      value && value === form.getFieldValue('base_currency')
                        ? Promise.reject(Errors.SAME_CURRENCY)
                        : Promise.resolve(),
                  },
                ]}
              >
                <Select
                  showSearch
                  filterOption={false}
                  onSearch={handleTargetCurrencySearch}
                  onSelect={() => setFilteredTargetCurrencies(currencies)}
                  disabled={editingKey ? true : false}
                >
                  {getCurrencyOptions(filteredTargetCurrencies)}
                </Select>
              </Form.Item>
              <Form.Item
                label={<Trans>Conversion Rate</Trans>}
                name='rate'
                rules={[
                  { required: true, message: Errors.CONVERSION_RATE_REQUIRED },
                  {
                    validator: (_, value: any) =>
                      value !== undefined && value !== '' && value <= 0
                        ? Promise.reject(Errors.INVALID_RATE)
                        : Promise.resolve(),
                  },
                ]}
              >
                <InputNumber type='number' style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item
                label={<Trans>As Of Date</Trans>}
                name='effective_from'
                rules={[
                  { required: true, message: Errors.AS_OF_DATE_REQUIRED },
                ]}
              >
                <DatePicker
                  format={'DD/MM/YYYY'}
                  style={{ width: '100%' }}
                  disabledDate={disabledDate}
                />
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
    ccList: getCurrencyConversionList(state),
    currencies: getCurrencyList(state),
    error: getCCError(state),
    success: getCCSuccessMessage(state),
    conversionHistory: getConversionHistory(state),
    isLoader: getCurrencyLoader(state),
    loadingMessage: getCurrencyLoadingMessage(state),
    isDataSubmitting: getCurrencyDataSubmitting(state),
    getPermissions: getPermissions(state),
    currencyHistoryLoader: state.currencyConversion.CurrencyHistoryLoader,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  return {
    fetchCC: (page: number, pageSize?: number, filter?: any) =>
      dispatch(fetchCCList(page, pageSize, filter)),
    createCC: (body: any) => dispatch(createCurrencyConversion(body)),
    fetchCurrencies: () => dispatch(fetchCurrencyList()),
    updateRecord: (id: string, body: any, pageSize?: number) =>
      dispatch(updateCurrencyConversionItem(id, body, pageSize)),
    fetchConversionHistoryByID: (id: string) =>
      dispatch(fetchConversionHistory(id)),
    _downloadFile: () => dispatch(downloadCurrencyConversionTemplate()),
    _uploadFile: (file: any) => dispatch(uploadCurrencyConversionCSV(file)),
    _resetMessages: () => dispatch(resetMessages()),
    _uploadFromFTP: () => dispatch(uploadFromFTP()),
  };
};

const connector = connect(mapStateToProps, mapDispatchToProps);
export default connector(CurrencyConversion);
