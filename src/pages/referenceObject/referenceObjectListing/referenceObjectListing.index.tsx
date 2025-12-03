import React, {
  memo,
  FC,
  useEffect,
  Dispatch,
  ReactNode,
  FocusEvent,
  useState,
} from 'react';
import { connect, ConnectedProps } from 'react-redux';
import {
  message,
  Table,
  Skeleton,
  Row,
  Col,
  Button,
  Form,
  Input,
  Pagination,
} from 'antd';
import {
  EllipsisOutlined,
  FullscreenOutlined,
  EditTwoTone,
  DeleteTwoTone,
  PlusOutlined,
  MinusCircleOutlined,
} from '@ant-design/icons';
import {
  AppDrawer,
  FilterBar,
  HeaderBarWrapper,
  DotMenu,
  ElementOrSkeleton,
} from '../../../shared/components';
import { appPath } from '../../app/app.routes';
import {
  stateInterface,
  getPermissions,
} from '../../../shared/redux/rootReducer';
import {
  apiCallReset,
  resetToInitial,
  setObjectReferenceSelected,
  setFormData,
  setListUpdate,
  resetFormData,
  resetListUpdate,
  updateItemFile,
  updateBackendErrors,
  // setObjectReferenceSelectedLoader,
  updateRestorePageNo,
  updateRestorePageSize,
} from '../../../shared/redux/referenceObject/referenceObject.actions';
import {
  TobjectReferenceSelected,
  IformData,
} from '../../../shared/redux/referenceObject/referenceObject.model';
import {
  getObjectReferenceList,
  deleteReferenceObject,
  addReferenceObjectItems,
  removeReferenceObjectItems,
  uploadRefObjectCSVFile,
  fetchReferenceObjectUsingId,
} from '../../../shared/redux/referenceObject/referenceObject.thunk';

import { getQueryParametersAsObject } from '../../../utils/global.utils';
import { useHistory, useLocation } from 'react-router-dom';

import Data from '../referenceObject.data.json';
import './referenceObjectListing.index.less';
import { Trans } from '@lingui/macro';

let pageSize = 10;

const mapStateToProps = (state: stateInterface) => {
  const {
    objectReference,
    paginationData,
    objectReferenceListLoader,
    objectReferenceSelected,
    objectReferenceSelectedLoader,
    formData,
    itemFile,
    listUpdate,
    error,
    info,
    success,
    backend_error,
    loader,
    restorePageNo,
    restorePageSize,
  } = state.referenceObject;
  return {
    objectReference,
    paginationData,
    objectReferenceListLoader,
    objectReferenceSelected,
    objectReferenceSelectedLoader,
    formData,
    itemFile,
    listUpdate,
    error,
    info,
    success,
    backend_error,
    loader,
    restorePageNo,
    restorePageSize,
    getPermissions: getPermissions(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  return {
    _apiCallReset: () => dispatch(apiCallReset()),
    _resetToInitial: () => dispatch(resetToInitial()),
    _resetListUpdate: () => dispatch(resetListUpdate()),
    _getObjectReferenceList: (page: number, size?: number) =>
      dispatch(getObjectReferenceList(page, size)),
    _setObjectReferenceSelected: (data: TobjectReferenceSelected) =>
      dispatch(setObjectReferenceSelected(data)),
    _deleteReferenceObject: (id: number, callBack?: Function) =>
      dispatch(deleteReferenceObject(id, callBack)),
    _setFormData: (data: IformData) => dispatch(setFormData(data)),
    _resetFormData: () => dispatch(resetFormData()),
    _setListUpdate: (item: string, action: 'ADD' | 'REMOVE') =>
      dispatch(setListUpdate(item, action)),
    _removeReferenceObjectItems: (id: number, items: { items: string[] }) =>
      dispatch(removeReferenceObjectItems(id, items)),
    _addReferenceObjectItems: (id: number, items: { items: string[] }) =>
      dispatch(addReferenceObjectItems(id, items)),
    _uploadRefObjectCSVFile: (data: any, callBack?: Function) =>
      dispatch(uploadRefObjectCSVFile(data, callBack)),
    _updateItemFile: (file: File | null) => dispatch(updateItemFile(file)),
    _updateBackendErrors: (err: any) => dispatch(updateBackendErrors(err)),
    _fetchReferenceObjectUsingId: (
      id: number,
      saveInSelectedObjectReference: boolean = false,
    ) =>
      dispatch(fetchReferenceObjectUsingId(id, saveInSelectedObjectReference)),
    _updateRestorePageNo: (data: boolean = false) =>
      dispatch(updateRestorePageNo(data)),
    _updateRestorePageSize: (data: boolean = false) =>
      dispatch(updateRestorePageSize(data)),
  };
};
const connector = connect(mapStateToProps, mapDispatchToProps);

type Tprops = ConnectedProps<typeof connector>;

const ReferenceObjectListing: FC<Tprops> = props => {
  const {
    objectReference,
    paginationData,
    objectReferenceListLoader,
    objectReferenceSelected,
    objectReferenceSelectedLoader,
    formData,
    itemFile,
    listUpdate,
    error,
    info,
    success,
    backend_error,
    loader,
    getPermissions,
    restorePageNo,
    restorePageSize,
    _apiCallReset,
    _resetToInitial,
    _getObjectReferenceList,
    _setObjectReferenceSelected,
    _deleteReferenceObject,
    _setFormData,
    _resetFormData,
    _setListUpdate,
    _removeReferenceObjectItems,
    _addReferenceObjectItems,
    _resetListUpdate,
    _uploadRefObjectCSVFile,
    _updateItemFile,
    _updateBackendErrors,
    _fetchReferenceObjectUsingId,
    _updateRestorePageNo,
    _updateRestorePageSize,
  } = props;

  const [form] = Form.useForm();
  const [getInputVal, setInputVal] = useState<string>('');
  const [
    objectReferenceSelectedVisible,
    setObjectReferenceSelectedVisible,
  ] = useState<boolean>(false);
  // const [getPageNo, setPageNo] = useState<number>(1);
  const { push, replace } = useHistory();
  const location = useLocation();
  let pathname = location.pathname;
  const urlQueryParameters = getQueryParametersAsObject();

  // const handlePageChange = (page: number) => {
  //   // setPageNo(page);
  //   push(`${pathname}?page=${page}`);
  // };
  const saveItems = async () => {
    if (listUpdate.add.length)
      await _addReferenceObjectItems(objectReferenceSelected!.id, {
        items: listUpdate.add,
      });
    if (listUpdate.remove.length)
      await _removeReferenceObjectItems(objectReferenceSelected!.id, {
        items: listUpdate.remove,
      });
    closeAppDrawer();
    _getObjectReferenceList(paginationData.current_page);
  };

  const closeAppDrawer = () => {
    form.resetFields();
    setObjectReferenceSelectedVisible(false);
    _resetListUpdate();
    _setObjectReferenceSelected(null);
    _resetFormData();
  };

  /**
   * this function return item updation form for detail page.
   */
  const returnListForm = () => {
    const newItemValue: string = ''; //new item value

    const remove: Function = (item: string) => {
      const tempFormData: IformData = {
        ...formData,
        items: formData.items.filter(o => o !== item),
      };
      _setFormData(tempFormData);

      if (item !== newItemValue) {
        const val: string = formData.items.filter(o => o === item)[0];
        _setListUpdate(val, 'REMOVE');
      }
    };

    const add: Function = () => {
      const tempFormData: IformData = {
        ...formData,
        items: [...formData.items, newItemValue],
      };
      _setFormData(tempFormData);
    };

    const handleInputChange = (e: FocusEvent<HTMLInputElement>) => {
      const val: string = e.target.value;
      setInputVal(val);
      form.validateFields();
    };

    /**
     * Input blue event
     * Saves item in side formdata.items and the help to enable save button
     * @param e
     */
    const handleInputBlur = (e: FocusEvent<HTMLInputElement>) => {
      const val: string = e.target.value;
      if (!formData.items.includes(val)) {
        let tempFormData: IformData = formData;
        // const index: number = tempFormData.items.indexOf(newItemValue);
        // index && tempFormData.items.splice(index, 1);
        tempFormData.items = tempFormData.items.filter(o => o !== newItemValue);
        tempFormData = {
          ...tempFormData,
          items: [...tempFormData.items, val],
        };
        val && _setListUpdate(val, 'ADD');
        _setFormData(tempFormData);
        form.setFieldsValue(tempFormData);
        setInputVal('');
      }
    };

    const isSubmitDisabled: boolean =
      !getInputVal && !listUpdate.remove.length && !listUpdate.add.length;

    // if (formData.items.length === 0) add();

    const referenceItemList = objectReferenceSelected?.items || [];
    return (
      <Form
        form={form}
        initialValues={formData}
        layout='vertical'
        size='middle'
        autoComplete='off'
        scrollToFirstError={true}
        className='item-form'
        onFinish={saveItems}
      >
        <div>
          <div
            className={`max-5-scroll ${
              formData.items.length > 5 ? `active` : ``
            }`}
          >
            {formData.items.map((field, _index) => {
              if (field === newItemValue) {
                return (
                  <Form.Item
                    required={true}
                    key={field}
                    className='item-input-container'
                    trigger='onBlur'
                  >
                    <Form.Item
                      name='newItems'
                      rules={[
                        {
                          required: true,
                          whitespace: true,
                          message:
                            Data.addReferenceObject.vaidationErrors.items
                              .required,
                        },
                        () => ({
                          validator(_rule, _value) {
                            if (_value !== newItemValue) {
                              const matchItems = formData.items.filter(
                                (o: string) => o === _value,
                              );
                              if (matchItems.length) {
                                return Promise.reject(
                                  Data.addReferenceObject.vaidationErrors.items
                                    .unique,
                                );
                              }
                            }
                            return Promise.resolve();
                          },
                        }),
                      ]}
                      noStyle
                    >
                      <Input
                        disabled={false}
                        defaultValue={field}
                        value={getInputVal}
                        className={`item-input ${_index <=
                          referenceItemList.length - 1 && 'extend'}`}
                        placeholder='eg. Item 1'
                        onBlur={handleInputBlur}
                        onChange={handleInputChange}
                      />
                    </Form.Item>
                    {_index > referenceItemList.length - 1 && (
                      <>
                        {formData.items.length > 1 ? (
                          <MinusCircleOutlined
                            className={`dynamic-delete-button`}
                            onClick={() => {
                              remove(field);
                            }}
                          />
                        ) : (
                          <></>
                        )}
                      </>
                    )}
                  </Form.Item>
                );
              }
              return (
                <Form.Item
                  required={true}
                  key={field}
                  className='item-input-container'
                  trigger='onBlur'
                >
                  <Form.Item trigger='onBlur' noStyle>
                    <Input
                      disabled={true}
                      defaultValue={field}
                      className={`item-input ${_index <=
                        referenceItemList.length - 1 && 'extend'}`}
                      placeholder='eg. Iem 1'
                    />
                  </Form.Item>
                  {_index > referenceItemList.length - 1 && (
                    <>
                      {formData.items.length > 1 &&
                      getPermissions.ACTION_SETUP_REFERENCE_OBJECTS ? (
                        <MinusCircleOutlined
                          className={`dynamic-delete-button ${
                            formData.items.includes(newItemValue)
                              ? `disable interactive`
                              : ``
                          }`}
                          onClick={() => {
                            remove(field);
                          }}
                        />
                      ) : (
                        <></>
                      )}
                    </>
                  )}
                </Form.Item>
              );
            })}
          </div>
          {getPermissions.ACTION_SETUP_REFERENCE_OBJECTS && (
            <Form.Item className='form-button-container'>
              <Button
                type='dashed'
                disabled={formData.items.includes(newItemValue)}
                onClick={() => {
                  add();
                }}
              >
                <PlusOutlined />
                <Trans>Add item</Trans>
              </Button>
              <Button
                data-test='formSubmitButton'
                type='primary'
                htmlType='submit'
                disabled={isSubmitDisabled}
              >
                <Trans>Save</Trans>
              </Button>
            </Form.Item>
          )}
        </div>
      </Form>
    );
  };

  const getElemOrSkeleton = (
    _text: string | ReactNode,
    _record?: any,
    _index?: number,
  ) => {
    return objectReferenceListLoader ? (
      <Skeleton.Input size='small' active={objectReferenceListLoader} />
    ) : (
      _text
    );
  };

  const data = objectReference.map((o: any, _index: number) => ({
    title: o.title,
    code: o.code ? o.code : '-',
    createdBy: o?.created_by?.legal_name || o.created_by.name,
    createdOn: o.created_on ? o.created_on.split('T')[0] : '',
    item: o,
  }));

  const columns = [
    {
      key: 'TITLE',
      title: () => getElemOrSkeleton(<Trans>Title</Trans>),
      dataIndex: 'title',
      render: getElemOrSkeleton,
    },
    {
      key: 'CODE',
      title: () => getElemOrSkeleton(<Trans>Code</Trans>),
      dataIndex: 'code',
      render: getElemOrSkeleton,
    },
    {
      key: 'CREATED_BY',
      title: () => getElemOrSkeleton(<Trans>Created By</Trans>),
      dataIndex: 'createdBy',
      render: getElemOrSkeleton,
    },
    {
      key: 'CREATED_ON',
      title: () => getElemOrSkeleton(<Trans>Created On</Trans>),
      dataIndex: 'createdOn',
      render: getElemOrSkeleton,
    },
    {
      key: 'ACTION',
      title: () => getElemOrSkeleton(<Trans>Action</Trans>),
      width: 90,
      align: 'center' as 'center',
      render: (_text: string, _record: any, _index: number) => {
        const isDeleteDisable =
          _record.item.can_be_deleted === undefined
            ? true
            : _record.item.can_be_deleted;
        return objectReferenceListLoader ? (
          <Skeleton.Input size='small' active={objectReferenceListLoader} />
        ) : (
          <DotMenu
            menuVisibility={true}
            actionBtn={[
              {
                OnClick: () => {
                  push(
                    `${appPath.config_setup.referenceObjects.update.linkTo}${_record.item.id}`,
                  );
                },
                Disabled: false,
                Type: 'link' as 'link',
                children: (
                  <>
                    <Trans>Update</Trans>
                  </>
                ),
                icon: EditTwoTone,
              },
              {
                OnClick: () => {
                  _deleteReferenceObject(_record.item.id, () => {
                    _getObjectReferenceList(
                      paginationData.current_page,
                      pageSize,
                    );
                  });
                },
                Disabled: !isDeleteDisable,
                Type: 'link' as 'link',
                children: (
                  <>
                    <Trans>Delete</Trans>
                  </>
                ),
                icon: DeleteTwoTone,
              },
            ]}
          >
            <EllipsisOutlined />
          </DotMenu>
        );
      },
    },
  ];

  const getColumns = () => {
    const toBeRemovedIndexes: any = [];
    for (let index = 0; index < columns.length; index++) {
      const item = columns[index];
      if (
        item.key === 'ACTION' &&
        !getPermissions.ACTION_SETUP_REFERENCE_OBJECTS
      ) {
        toBeRemovedIndexes.push(index);
      }
    }
    const newColumns = columns.filter(
      (_item, index) => !toBeRemovedIndexes.includes(index),
    );
    return newColumns;
  };

  const urlChange = () => {
    if (location.pathname === appPath.config_setup.referenceObjects.linkTo) {
      if (urlQueryParameters.page /* || paginationData.current_page */) {
        const pageNo = urlQueryParameters.page;
        pageSize = urlQueryParameters.page_size || 10;
        _getObjectReferenceList(pageNo, pageSize);
      }
    }
  };

  useEffect(urlChange, [location.search]);

  useEffect(() => {
    /* ComponentDidMount */
    _apiCallReset();
    if (!urlQueryParameters.page) {
      replace(
        `${pathname}?page=${
          restorePageNo ? paginationData.current_page : 1
        }&page_size=${restorePageSize ? pageSize : 10}`,
      );
      restorePageNo &&
        _updateRestorePageNo() &&
        restorePageSize &&
        _updateRestorePageSize();
    }
    return () => {
      /* ComponentWillUnmount */
      message.destroy();
      _updateRestorePageNo();
      _updateRestorePageSize();
      _resetToInitial();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    message.destroy();
    if (loader) message.loading(info, 0);
    else if (success) message.success(success, 2, _apiCallReset);
    else if (error) message.error(error, 2, _apiCallReset);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loader, success, error, info]);

  return (
    <HeaderBarWrapper
      headerCommonProps={{ title: <Trans>Reference Objects</Trans> }}
      data-test='referenceObjectsListingWrapper'
    >
      <div
        className='reference-objects-listing-container'
        data-test='referenceObjectsListingContainer'
      >
        <FilterBar
          isLoading={objectReferenceListLoader}
          isAddButton={getPermissions.ACTION_SETUP_REFERENCE_OBJECTS}
          addButtonOnClickFn={() => {
            push(appPath.config_setup.referenceObjects.add.linkTo);
          }}
          isAddButtonDisabled={false}
          enableBackBtn={true}
          backBtnUrl={appPath.config_setup.referenceObjects.backLink}
          uploadButtonHandler={
            getPermissions.ACTION_SETUP_REFERENCE_OBJECTS ? () => {} : undefined
          }
          uploadConfig={{
            accept: '.csv',
            showUploadList: false,
            beforeUpload: file => {
              _updateItemFile(file);
              _uploadRefObjectCSVFile(file, () => {
                _getObjectReferenceList(paginationData.current_page);
              });
              return false;
            },
          }}
          CSVTableVisibility={itemFile !== null}
          CSVConfig={{
            file: itemFile as File,
            modelHeader: 'CSV File Reference Objects',
            tableHeader: [],
            errors: backend_error,
            isFirstRowAsHeader: true,
            onClose: () => {
              _updateItemFile(null);
              _updateBackendErrors([]);
            },
          }}
          data-test='filterBar'
        />
        <Table
          data-test='referenceObjectsListingTable'
          columns={getColumns()}
          dataSource={data}
          bordered
          rowKey={record => record.item.id}
          pagination={false}
          expandable={{
            expandedRowRender: () => null,
            rowExpandable: () => true,
            expandIcon: ({ record }) => {
              return objectReferenceListLoader ? (
                <Skeleton.Input
                  size='small'
                  active={objectReferenceListLoader}
                />
              ) : (
                <FullscreenOutlined
                  onClick={async () => {
                    setObjectReferenceSelectedVisible(true);
                    try {
                      // _setObjectReferenceSelected(record?.item);
                      const res: any = await _fetchReferenceObjectUsingId(
                        record.item.id,
                        true,
                      );
                      _setFormData({
                        ...formData,
                        items: res?.items.map((o: any) => o.title) || [],
                      });
                    } catch (error) {
                      console.error('DEV ERROR', error);
                    }
                  }}
                  title='Details'
                />
              );
            },
          }}
        />

        <Pagination
          showQuickJumper={{
            goButton: (
              <Button type='default'>
                <Trans>Go</Trans>
              </Button>
            ),
          }}
          onChange={(page, size) =>
            push(`${pathname}?page=${page}&page_size=${size}`)
          }
          defaultCurrent={1}
          hideOnSinglePage={false}
          pageSizeOptions={['10', '20', '50', '100']}
          showSizeChanger={true}
          pageSize={pageSize || 10}
          onShowSizeChange={(current, size) => {
            pageSize = size;
            push(`${pathname}?page=${current}&page_size=${size}`);
          }}
          current={
            paginationData.current_page
              ? typeof paginationData.current_page === 'string'
                ? parseInt(paginationData.current_page)
                : paginationData.current_page
              : 1
          }
          total={paginationData.total_records}
          showTotal={(total: number, range: number[]) => {
            return <>{`${range[0]}-${range[1]} of ${total}`}</>;
          }}
        />

        <AppDrawer
          width='40%'
          data-test='appDrawer'
          title={<Trans>Reference Object Details</Trans>}
          visible={objectReferenceSelectedVisible}
          destroyOnClose={true}
          closable={true}
          onClose={closeAppDrawer}
          showCancelButton={false}
          showOkButton={false}
          getContainer='.reference-objects-listing-container'
        >
          {objectReferenceSelectedLoader ? (
            <ElementOrSkeleton
              isLoading={objectReferenceSelectedLoader}
              type='page'
            ></ElementOrSkeleton>
          ) : (
            <Row gutter={24}>
              {objectReferenceSelected?.title ? (
                <Col span={12}>
                  <span className='text-label'>
                    <Trans>Title</Trans>
                  </span>
                  <span
                    className='text-content'
                    data-test='objectReferenceTitle'
                  >
                    {objectReferenceSelected.title}
                  </span>
                </Col>
              ) : null}
              {objectReferenceSelected?.created_on ? (
                <Col span={12}>
                  <span className='text-label'>
                    <Trans>Created On</Trans>
                  </span>
                  <span
                    className='text-content'
                    data-test='objectReferenceCreatedOn'
                  >
                    {objectReferenceSelected.created_on.split('T')[0]}
                  </span>
                </Col>
              ) : null}
              {objectReferenceSelected?.created_by?.legal_name ||
              objectReferenceSelected?.created_by?.name ? (
                <Col span={12}>
                  <span className='text-label'>
                    <Trans>Created By</Trans>
                  </span>
                  <span
                    className='text-content'
                    data-test='objectReferenceCreatedBy'
                  >
                    {objectReferenceSelected?.created_by?.legal_name ||
                      objectReferenceSelected.created_by?.name}
                  </span>
                </Col>
              ) : null}
              {objectReferenceSelected?.code ? (
                <Col span={12}>
                  <span className='text-label'>
                    <Trans>Code</Trans>
                  </span>
                  <span
                    className='text-content'
                    data-test='objectReferenceCode'
                  >
                    {objectReferenceSelected.code}
                  </span>
                </Col>
              ) : null}
              {Array.isArray(objectReferenceSelected?.items) ? (
                <Col span={24}>
                  <span className='text-label'>
                    Items ( {objectReferenceSelected?.items?.length || 0} )
                  </span>
                  <span
                    className='text-content'
                    data-test='objectReferenceItems'
                  >
                    {returnListForm()}
                  </span>
                </Col>
              ) : null}
            </Row>
          )}
        </AppDrawer>
      </div>
    </HeaderBarWrapper>
  );
};

export default connector(memo(ReferenceObjectListing));
