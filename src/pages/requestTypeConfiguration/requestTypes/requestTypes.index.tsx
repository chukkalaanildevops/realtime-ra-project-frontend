/* eslint-disable react-hooks/exhaustive-deps */

import React, { Dispatch, useEffect, useState } from 'react';
import {
  Table,
  message,
  Switch,
  Skeleton,
  Button,
  Form,
  Input,
  AutoComplete,
} from 'antd';
import { appPath } from '../../app/app.routes';
import { NavLink, useHistory } from 'react-router-dom';
import {
  getRequestTypes,
  getRequestTypeLoader,
  getRequestTypeLoadingMessage,
  getRequestTypeExpandedItem,
  getRequestTypeSuccessMessage,
  getRequestTypeErrorMessage,
  getRequestTypeDataLoading,
  getLabels,
  getRequestCurrentPage,
  getPermissions,
} from '../../../shared/redux/rootReducer';
import {
  fetchRequestTypeList,
  fetchRequestTypeConfigById,
  deleteRequestType,
  toggleRequestType,
  updateRequestTypeTitleCode,
} from '../requestTypeConfiguration.thunk';
import { connect, ConnectedProps } from 'react-redux';
import {
  EllipsisOutlined,
  EditOutlined,
  DeleteOutlined,
  ToolOutlined,
  CopyOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import {
  AppDrawer,
  FilterBar,
  HeaderBarWrapper,
  DotMenu,
  ConfigurationDetailView,
  ConfirmationModal,
  NoData,
  ErrorBoundary,
} from '../../../shared/components/';
import './requestTypes.index.less';
import {
  saveExpandedItem,
  resetData,
  saveRequestTypes,
  setSuccess,
  setCurrentPage,
} from '../requestTypeConfiguration.action';
import ConfigDetails from './components/configDetails.index';
import { Trans } from '@lingui/macro';
import { AddRequestForm } from '../addRequest/components';
import { actionBtnObjInterface } from '../../../shared/components/dotMenu/dotMenu.model';
import { ColumnProps } from 'antd/lib/table';
// import Form from 'antd/lib/form/Form';
import errorMsg from '../requestTypeConfiguration.data.json';
import { useTableFilters } from '../../../shared/hooks';

const { getSearchProps, getCheckBoxFilterProps } = useTableFilters();
const RequestTypeListing: React.FC<ConnectedProps<typeof connector>> = ({
  _fetchRequestTypes,
  _fetchRequestTypeDetails,
  _deleteRequestType,
  _toggleRequestType,
  _resetRequestItem,
  _resetData,
  _saveRequestTypes,
  _setSuccess,
  _setCurrentPage,
  _updateRequestTypeTitleCode,
  getPermissions,
  requestTypesData,
  isLoading,
  loadingMessage,
  expandedItem,
  success,
  error,
  isDataLoading,
  label,
  currentPage,
}) => {
  const requestTypes = isLoading ? new Array(10).fill({}) : requestTypesData;
  const [isItemExpanded, expandItem] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<
    string | undefined
  >(undefined);
  const [filters, setFilters] = useState<any>(null);
  const [titleCode, setTitleCode] = useState<
    { title: string; code: string; id: number } | undefined
  >(undefined);

  const [formTitleCode] = Form.useForm();
  const history = useHistory();

  const onItemExpand = (record: any) => {
    expandItem(true);
    _fetchRequestTypeDetails(record.global_configuration);
  };
  const onTableChange = (...tableProps: any) => {
    setFilters(tableProps[1]);
  };
  const deleteRequestType = (id: string) => {
    setShowDeleteConfirm(id);
    // _deleteRequestType(id);
  };
  const updateRequestType = (record: any) => {
    history.push(
      `${appPath.config_setup.requestType.update.linkTo}${record.global_configuration}`,
    );
    _resetData();
  };
  useEffect(() => {
    _fetchRequestTypes();
    // resetRequestTypeData();
    // _resetData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (success) {
      setTitleCode(undefined);
      message.success(success);
      _setSuccess();
      // setFilters(null);
    }
  }, [success]);

  useEffect(() => {
    // debugger;
    if (isDataLoading && loadingMessage) {
      message.loading(loadingMessage);
    }
  }, [isDataLoading, loadingMessage]);

  // useEffect(() => {
  //   if (error && typeof error == 'string') {
  //     error && message.error(error);
  //   }
  // }, [error]);

  useEffect(() => {
    if (error) {
      // debugger;
      if (error instanceof Object) {
        if (error.error) {
          message.error(error.error);
        } else {
          let errors = Object.keys(error).map(item => ({
            name: item,
            errors: error[item] instanceof Array ? error[item] : [error[item]],
          }));
          formTitleCode.setFields(errors);
        }
      } else if (typeof error === 'string') {
        message.error(error || 'Something went wrong');
      }
    }
  }, [error]);

  const toggleItem = async (id: string, isActive: boolean) => {
    const res: any = await _toggleRequestType(id, isActive);
    if (res)
      if (res === 'Configuration Saved!')
        _saveRequestTypes(
          requestTypesData.map(o =>
            o.id === id ? { ...o, is_active: isActive } : o,
          ),
        );
  };

  const cloneRequestType = (id: string) => {
    history.push(appPath.config_setup.requestType.add.linkTo, {
      type: 'clone',
      id,
    });
  };

  const updateTitleAction = (record: any) => {
    const obj = {
      title: record.title,
      code: record.code,
      id: record.id,
    };
    setTitleCode(obj);
    formTitleCode.setFieldsValue(obj);
  };

  // const updateRequestType = (id: string) => {
  //   history.push(`${appPath.admin.requestType.update.linkTo}${id}`);
  // };

  const getElemOrSkeleton = (
    _text: string | React.ReactNode,
    _record?: any,
    _index?: number,
  ) => {
    return isLoading ? (
      <Skeleton.Input size='small' active={isLoading} />
    ) : (
      _text
    );
  };

  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  const renderTitle = (
    _text: string | React.ReactNode,
    _record?: any,
    _index?: number,
  ) => {
    return (
      <Button
        type='link'
        onClick={() =>
          history.push(
            appPath.config_setup.requestType.legalEntityListing.linkTo +
              _record.id,
          )
        }
      >
        {_text}
      </Button>
    );
  };
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  const getColumnSearchProps = (dataIndex: string): ColumnProps<any> => ({
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
            }}
            onSearch={val => setSearchValue(val)}
            onChange={e => (e ? '' : handleReset(clearFilters))}
            autoFocus={true}
          >
            <Input.Search />
          </AutoComplete>
        </div>
      );
    },
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value: any, record: any) => {
      const item: any = record[dataIndex];
      const text = item?.toLowerCase() || '';
      return text.includes(value.toLowerCase());
    },
    filteredValue: filters?.[dataIndex] || null,
    onFilterDropdownVisibleChange: (visible: boolean) => {
      if (visible) {
        // setTimeout(() => searchRef.current?.select());
      }
    },
  });
  const columns = [
    {
      key: 'IS_ACTIVE',
      title: () => getElemOrSkeleton(''),
      dataIndex: 'is_active',
      width: 100,
      align: 'center' as 'center',
      render: (value: boolean, record: any) =>
        isLoading ? (
          <Skeleton.Input size='small' active={isLoading} />
        ) : (
          <div>
            <Switch
              checked={value}
              onChange={newVal => toggleItem(record.id, newVal)}
            />
          </div>
        ),
      ...getCheckBoxFilterProps(
        [
          {
            text: 'Active',
            value: 'true',
          },
          {
            text: 'Deactive',
            value: 'false',
          },
        ],
        'is_active',
      ),
    },
    {
      dataIndex: 'title',
      title: () => getElemOrSkeleton(<Trans>Title</Trans>),
      ...getSearchProps(
        'title',
        (_val: boolean, _record?: any, _index?: number) => {
          return getElemOrSkeleton(
            <NavLink
              className='custom-nav-link'
              to={`${appPath.config_setup.requestType.legalEntityListing.linkTo}${_record?.id}`}
            >
              {_val}
            </NavLink>,
          );
        },
      ),
    },
    {
      key: 'CODE',
      dataIndex: 'code',
      title: () => getElemOrSkeleton(<Trans>Code</Trans>),
      render: getElemOrSkeleton,
    },
    {
      dataIndex: 'is_travel_type',
      title: () => getElemOrSkeleton(<Trans>Category</Trans>),
      render: (val: any) =>
        isLoading ? getElemOrSkeleton('') : val ? 'Travel' : 'General',

      ...getCheckBoxFilterProps(
        [
          {
            text: 'Travel',
            value: 'true',
          },
          {
            text: 'General',
            value: 'false',
          },
        ],
        'is_travel_type',
      ),
    },
    {
      key: 'ACTION',
      title: () => getElemOrSkeleton(<Trans>Action</Trans>),
      dataIndex: 'action',
      width: 90,
      align: 'center' as 'center',
      render: (_text: any, record: any) =>
        isLoading ? (
          <Skeleton.Input size='small' active={isLoading} />
        ) : (
          <DotMenu
            actionBtn={((): actionBtnObjInterface[] => {
              let actions: actionBtnObjInterface[] = [
                {
                  OnClick: () => updateRequestType(record),
                  children: <Trans>Update</Trans>,
                  Type: 'default',
                  icon: EditOutlined,
                },
                {
                  OnClick: () => updateTitleAction(record),
                  children: <Trans>Update Title</Trans>,
                  Type: 'default',
                  icon: EditOutlined,
                },
                {
                  children: <Trans>View Configuration</Trans>,
                  Type: 'default',
                  OnClick: () => onItemExpand(record),
                  icon: ToolOutlined,
                },
                {
                  children: <Trans>Clone</Trans>,
                  Type: 'default',
                  OnClick: () => cloneRequestType(record.global_configuration),
                  icon: CopyOutlined,
                },
                {
                  children: <Trans>Delete</Trans>,
                  Type: 'default',
                  OnClick: () => deleteRequestType(record.id),
                  icon: DeleteOutlined,
                },
              ];
              if (!getPermissions.ACTION_SETUP_REQUEST_TYPES) {
                actions = [
                  {
                    children: <Trans>View Configuration</Trans>,
                    Type: 'link',
                    OnClick: () => onItemExpand(record),
                    icon: ToolOutlined,
                  },
                ];
              }
              return actions;
            })()}
          >
            <EllipsisOutlined />
          </DotMenu>
        ),
    },
  ];

  const getFilterOptions = (key: string) => {
    try {
      const options = requestTypes
        .filter(
          item =>
            item[key].toLowerCase().indexOf(searchValue.toLowerCase()) > -1,
        )
        .map(obj => ({
          value: obj[key],
        }));
      return options;
    } catch (e) {
      return [];
    }
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

  const getColumns = () => {
    const toBeRemovedIndexes: any = [];
    for (let index = 0; index < columns.length; index++) {
      const item = columns[index];
      if (
        item.key === 'IS_ACTIVE' &&
        !getPermissions.ACTION_SETUP_REQUEST_TYPES
      ) {
        toBeRemovedIndexes.push(index);
      }
    }
    const newColumns = columns.filter(
      (_item, index) => !toBeRemovedIndexes.includes(index),
    );
    return newColumns;
  };

  const closeDetailsDrawer = () => {
    _resetRequestItem();
    expandItem(false);
  };

  const onUpdateTitleClick = async () => {
    try {
      const values = await formTitleCode.validateFields();
      _updateRequestTypeTitleCode(titleCode!.id, values);
    } catch (e) {}
  };
  useEffect(() => {
    if (isLoading && loadingMessage) {
      message.loading(loadingMessage);
    } else {
      message.destroy();
    }
  }, [isLoading, loadingMessage]);

  return (
    <ErrorBoundary>
      <HeaderBarWrapper
        headerCommonProps={{ title: <Trans>Request Types</Trans> }}
      >
        <div
          style={{ display: 'block' }}
          className='request-type-listing-container'
        >
          {/* <Skeleton active={isLoading} loading={isLoading}> */}
          <FilterBar
            isAddButton={getPermissions.ACTION_SETUP_REQUEST_TYPES}
            addButtonOnClickFn={() => {
              _resetData();
              history.push(appPath.config_setup.requestType.add.linkTo);
            }}
            enableBackBtn={true}
            backBtnUrl={appPath.config_setup.requestType.backLink}
          />

          {requestTypes.length === 0 ? (
            <NoData description={<Trans>No Request Type</Trans>}></NoData>
          ) : (
            <Table
              columns={getColumns()}
              dataSource={requestTypes}
              bordered
              onChange={onTableChange}
              // pagination={{
              //   hideOnSinglePage: true,
              //   current: currentPage,
              //   onChange: page => _setCurrentPage(page),
              // }}
              pagination={false}
              rowKey={item => item.id}
              // expandable={{
              //   expandedRowRender: () => null,
              //   rowExpandable: () => true,
              //   expandIcon: ({ record }) =>
              //     isLoading ? (
              //       <Skeleton.Input size='small' active={isLoading} />
              //     ) : (
              //       <FullscreenOutlined
              //         onClick={() => onItemExpand(record)}
              //         title='Details'
              //       />
              //     ),
              // }}
            />
          )}
          {/* {Object.keys(expandedItem).length > 0 && ( */}
          <AppDrawer
            visible={isItemExpanded}
            destroyOnClose={true}
            closable={true}
            onClose={closeDetailsDrawer}
            title={expandedItem.title}
            showCancelButton={false}
            showOkButton={false}
            getContainer='.request-type-listing-container'
          >
            <ConfigurationDetailView
              ConfigurationComponent={
                <ConfigDetails
                  isDataLoading={isDataLoading}
                  configData={expandedItem}
                />
              }
              customFieldsData={expandedItem.custom_fields}
              isLoadingData={isDataLoading}
              FormPreviewComponent={
                <AddRequestForm
                  is_travel_type={expandedItem.is_travel_type || false}
                  is_preview={true}
                  requestData={expandedItem}
                  labelData={label}
                  customFields={expandedItem.custom_fields}
                />
              }
            />
          </AppDrawer>
          <ConfirmationModal
            visible={showDeleteConfirm !== undefined}
            onCancelClick={() => setShowDeleteConfirm(undefined)}
            onOkClick={() => {
              _deleteRequestType(showDeleteConfirm || '');
              setShowDeleteConfirm(undefined);
            }}
            okText='Delete'
            isConfirmModel={true}
            header={<Trans>Do you want to delete request type</Trans>}
            extraModelProps={{ destroyOnClose: true }}
          />
          {/* )} */}
          {/* </Skeleton> */}
        </div>
        <AppDrawer
          visible={Boolean(titleCode)}
          onClose={() => setTitleCode(undefined)}
          onCancelClick={() => setTitleCode(undefined)}
          OkText={<Trans>Update</Trans>}
          title={titleCode?.title}
          width='40%'
          onOkClick={onUpdateTitleClick}
          destroyOnClose
        >
          <Form form={formTitleCode} layout='vertical'>
            <Form.Item
              label={<Trans>Title</Trans>}
              name='title'
              validateTrigger='onChange'
              required
              rules={[
                // { required: true, message: errorMsg.TITLE_REQUIRED },
                // {
                //   pattern: new RegExp(/^[0-9 A-Za-z_-]+$/),
                //   message: 'Special characters are not allowed.',
                // },
                () => ({
                  validator(_, value) {
                    if (value !== undefined) {
                      value = value.trim();
                    }

                    if (!value || value === undefined) {
                      return Promise.reject(errorMsg.TITLE_REQUIRED);
                    } else {
                      if (new RegExp(/^[^@!=\-+#﹘—⸺⸻].*$/).test(value)) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error('Special characters are not allowed.'),
                      );
                    }
                  },
                }),
              ]}
            >
              <Input autoComplete='new-password' />
            </Form.Item>
            <Form.Item
              label={<Trans>Code</Trans>}
              name='code'
              validateTrigger='onChange'
              required
              rules={[
                // { required: true, message: errorMsg.CODE_REQUIRED },
                // {
                //   pattern: new RegExp(/^[0-9 A-Za-z_-]+$/),
                //   message: 'Special characters are not allowed.',
                // },
                () => ({
                  validator(_, value) {
                    if (value !== undefined) {
                      value = value.trim();
                    }

                    if (!value || value === undefined) {
                      return Promise.reject(errorMsg.CODE_REQUIRED);
                    } else {
                      if (new RegExp(/^[^@!=\-+#﹘—⸺⸻].*$/).test(value)) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error('Special characters are not allowed.'),
                      );
                    }
                  },
                }),
              ]}
            >
              <Input autoComplete='new-password' />
            </Form.Item>
          </Form>
        </AppDrawer>
      </HeaderBarWrapper>
    </ErrorBoundary>
  );
};

const mapStateToProps = (state: any) => ({
  requestTypesData: getRequestTypes(state),
  isLoading: getRequestTypeLoader(state),
  loadingMessage: getRequestTypeLoadingMessage(state),
  expandedItem: getRequestTypeExpandedItem(state),
  success: getRequestTypeSuccessMessage(state),
  error: getRequestTypeErrorMessage(state),
  isDataLoading: getRequestTypeDataLoading(state),
  label: getLabels(state),
  currentPage: getRequestCurrentPage(state),
  getPermissions: getPermissions(state),
});

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  _fetchRequestTypes: () => dispatch(fetchRequestTypeList()),
  _fetchRequestTypeDetails: (id: string) =>
    dispatch(fetchRequestTypeConfigById(id, true)),
  _deleteRequestType: (id: string) => dispatch(deleteRequestType(id)),
  _toggleRequestType: (id: string, isActive: boolean) =>
    dispatch(toggleRequestType(id, isActive)),
  _resetRequestItem: () => dispatch(saveExpandedItem({})),
  _resetData: () => dispatch(resetData()),
  _saveRequestTypes: (data: any) => dispatch(saveRequestTypes(data)),
  _setSuccess: () => dispatch(setSuccess('')),
  _setCurrentPage: (page: number) => dispatch(setCurrentPage(page)),
  _updateRequestTypeTitleCode: (id: number, body: any) =>
    dispatch(updateRequestTypeTitleCode(id, body)),
});

const connector = connect(mapStateToProps, mapDispatchToProps);

export default connector(RequestTypeListing);
