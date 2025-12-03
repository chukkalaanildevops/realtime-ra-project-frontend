import React, {
  FC,
  memo,
  ReactNode,
  useEffect,
  Dispatch,
  useState,
} from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Col, Row, Skeleton, message, Table, Button, Pagination } from 'antd';
import {
  EditTwoTone,
  DeleteTwoTone,
  EllipsisOutlined,
  FullscreenOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import { Trans } from '@lingui/macro';
import { stateInterface, getPermissions } from '../../shared/redux/rootReducer';
import {
  HeaderBarWrapper,
  AppDrawer,
  DotMenu,
  FilterBar,
} from '../../shared/components';
import { appPath } from '../app/app.routes';
import {
  apiCallReset,
  resetToInitial,
  setSelectedWageType,
  setFormData,
  resetFormData,
  setAddMode,
  setUpdateMode,
  setUpdateId,
  setSelectedWageTypeHistory,
} from '../../shared/redux/wageType/wageType.actions';
import {
  fetchWageTypeList,
  deleteWageType,
  uploadWageTypeCSVFile,
  fetchWageTypeHistoryUsingId,
  downloadWageTypeCSVTemplate,
} from '../../shared/redux/wageType/wageType.thunk';
import {
  IwageType,
  IformData,
  IwageTypeHistory,
} from '../../shared/redux/wageType/wageType.model';
import { AddUpdateForm } from './components';
import './wageTypeConfiguration.index.less';

const mapStateToProps = (state: stateInterface) => {
  const {
    wageTypeList,
    pagination_data,
    wageTypeListLoader,
    selectedWageType,
    selectedWageTypeHistory,
    formData,
    isAddMode,
    isUpdateMode,
    isLoading,
    success,
    info,
    error,
    backend_error,
  } = state.WageType;
  return {
    wageTypeList,
    pagination_data,
    wageTypeListLoader,
    selectedWageType,
    selectedWageTypeHistory,
    formData,
    isAddMode,
    isUpdateMode,
    isLoading,
    success,
    info,
    error,
    backend_error,
    getPermissions: getPermissions(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  return {
    _apiCallReset: () => dispatch(apiCallReset()),
    _resetToInitial: () => dispatch(resetToInitial()),
    _fetchWageTypeList: (page: number = 1, size: number) =>
      dispatch(fetchWageTypeList(page, size)),
    _deleteWageType: (id: number, callback?: Function) =>
      dispatch(deleteWageType(id, callback)),
    _setSelectedWageType: (data: IwageType | null) =>
      dispatch(setSelectedWageType(data)),
    _setFormData: (data: IformData) => dispatch(setFormData(data)),
    _setUpdateMode: (data: boolean) => dispatch(setUpdateMode(data)),
    _setAddMode: (data: boolean) => dispatch(setAddMode(data)),
    _setUpdateId: (id: number) => dispatch(setUpdateId(id)),
    _resetFormData: () => dispatch(resetFormData()),
    _uploadWageTypeCSVFile: (data: any, callBack?: Function) =>
      dispatch(uploadWageTypeCSVFile(data, callBack)),
    _fetchWageTypeHistoryUsingId: (id: number) =>
      dispatch(fetchWageTypeHistoryUsingId(id)),
    _setSelectedWageTypeHistory: (data: IwageTypeHistory[] | null) =>
      dispatch(setSelectedWageTypeHistory(data)),
    _downloadWageTypeCSVTemplate: () => dispatch(downloadWageTypeCSVTemplate()),
  };
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type TWageTypeConfigurationProps = ConnectedProps<typeof connector>;

let pageSize = 10;

const WageTypeConfiguration: FC<TWageTypeConfigurationProps> = props => {
  const {
    wageTypeList,
    pagination_data,
    wageTypeListLoader,
    selectedWageType,
    selectedWageTypeHistory,
    isAddMode,
    isUpdateMode,
    isLoading,
    success,
    info,
    error,
    getPermissions,
    _apiCallReset,
    _fetchWageTypeList,
    _resetToInitial,
    _deleteWageType,
    _setSelectedWageType,
    _setUpdateMode,
    _setAddMode,
    _setUpdateId,
    _resetFormData,
    _uploadWageTypeCSVFile,
    _fetchWageTypeHistoryUsingId,
    _setSelectedWageTypeHistory,
    _downloadWageTypeCSVTemplate,
  } = props;

  const [getPageNo, setPageNo] = useState<number>(1);

  const drawerTitle = isAddMode ? (
    <Trans>Add Wage Type</Trans>
  ) : isUpdateMode ? (
    <Trans>Wage Type Update</Trans>
  ) : (
    <Trans>Wage Type Details</Trans>
  );

  const getElemOrSkeleton = (
    _text: string | ReactNode,
    _record?: any,
    _index?: number,
  ) => {
    return wageTypeListLoader ? (
      <Skeleton.Input size='small' active={wageTypeListLoader} />
    ) : (
      _text
    );
  };

  const data = wageTypeList.map((o: IwageType, _index: number) => ({
    title: o.title,
    createdBy: o?.created_by?.legal_name || o?.created_by?.name || '',
    createdOn: o.created_on
      ? moment
          .utc(o.created_on, ['DD/MM/YYYYTHH:mm:ss[.mmm]TZD'])
          .format('DD/MM/YYYY')
      : '',
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
        return wageTypeListLoader ? (
          <Skeleton.Input size='small' active={wageTypeListLoader} />
        ) : (
          <DotMenu
            menuVisibility={true}
            actionBtn={[
              {
                OnClick: () => {
                  _setUpdateMode(true);
                  _setUpdateId(_record.item.id);
                },
                Disabled: false,
                Type: 'link',
                children: <Trans>Update</Trans>,
                icon: EditTwoTone,
              },
              {
                OnClick: (_e: React.MouseEvent<HTMLElement, MouseEvent>) => {
                  _deleteWageType(_record.item.id, () => {
                    _fetchWageTypeList(getPageNo, pageSize);
                  });
                },
                Disabled: false,
                Type: 'link',
                children: <Trans>Delete</Trans>,
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
      if (item.key === 'ACTION' && !getPermissions.ACTION_SETUP_WAGE_TYPES) {
        toBeRemovedIndexes.push(index);
      }
    }
    const newColumns = columns.filter(
      (_item, index) => !toBeRemovedIndexes.includes(index),
    );
    return newColumns;
  };

  useEffect(() => {
    /* ComponentDidMount */
    pageSize = 10;
    _apiCallReset();
    _fetchWageTypeList(1, pageSize); //API Get Call
    return () => {
      /* ComponentWillUnmount */
      message.destroy();
      _resetToInitial();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    message.destroy();
    if (isLoading) message.loading(info, 0);
    else if (success) message.success(success, 5, _apiCallReset);
    else if (error) message.error(error, 5, _apiCallReset);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, success, error, info]);

  return (
    <HeaderBarWrapper
      headerCommonProps={{ title: <Trans>Wage Type</Trans> }}
      data-testId='wageTypeWrapper'
    >
      <div
        className='wage-type-config-container'
        data-test='wageTypeConfigContainer'
      >
        <FilterBar
          isLoading={wageTypeListLoader}
          isAddButton={getPermissions.ACTION_SETUP_WAGE_TYPES}
          addButtonOnClickFn={() => {
            _setAddMode(true);
          }}
          extraData={{
            showDropdown: getPermissions.ACTION_SETUP_WAGE_TYPES,
            downloadHandle: () => {
              _downloadWageTypeCSVTemplate();
            },
            uploadHandle: () => {},
          }}
          uploadConfig={{
            accept: '.csv',
            showUploadList: false,
            beforeUpload: file => {
              _uploadWageTypeCSVFile(file, () => {
                _fetchWageTypeList(getPageNo, pageSize);
              });
              return false;
            },
          }}
          isAddButtonDisabled={false}
          enableBackBtn={true}
          backBtnUrl={appPath.config_setup.wageType.backLink}
          data-test='filterBar'
        />
        <Table
          data-test='wageTypeConfigTable'
          columns={getColumns()}
          dataSource={data}
          bordered
          rowKey={record => record.item.id}
          pagination={false}
          expandable={{
            expandedRowRender: () => null,
            rowExpandable: () => true,
            expandIcon: ({ record }) => {
              return wageTypeListLoader ? (
                <Skeleton.Input size='small' active={wageTypeListLoader} />
              ) : (
                <FullscreenOutlined
                  onClick={() => _setSelectedWageType(record.item)}
                  title='Details'
                />
              );
            },
          }}
        />

        <Pagination
          showSizeChanger={true}
          defaultPageSize={10}
          pageSize={pageSize || 10}
          showQuickJumper={{
            goButton: (
              <Button type='default'>
                <Trans>Go</Trans>
              </Button>
            ),
          }}
          hideOnSinglePage={false}
          pageSizeOptions={['10', '20', '50', '100']}
          onShowSizeChange={(_page, size) => {
            pageSize = size;
          }}
          showTotal={(total: number, range: number[]) => {
            return <>{`${range[0]}-${range[1]} of ${total}`}</>;
          }}
          defaultCurrent={1}
          current={
            getPageNo
              ? typeof getPageNo === 'string'
                ? parseInt(getPageNo)
                : getPageNo
              : 1
          }
          onChange={(page, size) => {
            setPageNo(page);
            _fetchWageTypeList(page, size || 10);
          }}
          total={pagination_data.total_records}
        />
        <AppDrawer
          width='30%'
          data-test='appDrawer'
          title={drawerTitle}
          visible={selectedWageType !== null || isAddMode || isUpdateMode}
          destroyOnClose={true}
          closable={true}
          onClose={() => {
            if (!isAddMode && !isUpdateMode) {
              _setSelectedWageType(null);
              _setSelectedWageTypeHistory(null);
            } else {
              _resetFormData();
              if (isAddMode) _setAddMode(false);
              else _setUpdateMode(false);
            }
          }}
          showCancelButton={false}
          showOkButton={false}
          getContainer='.wage-type-config-container'
        >
          {!isAddMode && !isUpdateMode ? (
            <DetailsView
              selectedWageType={selectedWageType}
              historyOnClick={() =>
                _fetchWageTypeHistoryUsingId(Number(selectedWageType?.id))
              }
              selectedWageTypeHistory={selectedWageTypeHistory}
            />
          ) : (
            <AddUpdateForm pageNo={getPageNo} size={pageSize} />
          )}
        </AppDrawer>
      </div>
    </HeaderBarWrapper>
  );
};

export const DetailsView: FC<{
  selectedWageType: IwageType | null;
  historyOnClick: (event: React.MouseEvent<HTMLElement>) => void;
  selectedWageTypeHistory: IwageTypeHistory[] | null;
}> = props => {
  const { selectedWageType, selectedWageTypeHistory, historyOnClick } = props;
  return (
    <>
      <Row gutter={24} className='wage-type-datail-container'>
        {selectedWageType?.hasOwnProperty('title') ? (
          <Col span={24}>
            <span className='text-label'>
              <Trans>Title</Trans>
            </span>
            <span className='text-content' data-test=''>
              {selectedWageType.title}
            </span>
          </Col>
        ) : null}
        {/* {selectedWageType?.hasOwnProperty('is_deleted') ? (
          <Col span={12}>
            <span className='text-label'>Deleted</span>
            <span className='text-content' data-test=''>
              {selectedWageType.is_deleted ? 'Yes' : 'No'}
            </span>
          </Col>
        ) : null} */}
        {selectedWageType?.hasOwnProperty('created_by') ? (
          <Col span={12}>
            <span className='text-label'>
              <Trans>Created By</Trans>
            </span>
            <span className='text-content' data-test=''>
              {selectedWageType?.created_by?.legal_name ||
              selectedWageType.created_by?.name
                ? selectedWageType?.created_by?.legal_name ||
                  selectedWageType.created_by?.name
                : ` - `}
            </span>
          </Col>
        ) : null}
        {selectedWageType?.hasOwnProperty('created_on') ? (
          <Col span={12}>
            <span className='text-label'>
              <Trans>Created On</Trans>
            </span>
            <span className='text-content' data-test=''>
              {selectedWageType.created_on
                ? moment
                    .utc(selectedWageType.created_on, [
                      'DD/MM/YYYYTHH:mm:ss[.mmm]TZD',
                    ])
                    .format('DD/MM/YYYY')
                : ` - `}
            </span>
          </Col>
        ) : null}
        {selectedWageType?.hasOwnProperty('modified_by') ? (
          <Col span={12}>
            <span className='text-label'>
              <Trans>Modified By</Trans>
            </span>
            <span className='text-content' data-test=''>
              {selectedWageType?.modified_by?.legal_name ||
              selectedWageType.modified_by?.name
                ? selectedWageType?.modified_by?.legal_name ||
                  selectedWageType.modified_by?.name
                : ` - `}
            </span>
          </Col>
        ) : null}
        {selectedWageType?.hasOwnProperty('modified_on') ? (
          <Col span={12}>
            <span className='text-label'>
              <Trans>Modified On</Trans>
            </span>
            <span className='text-content' data-test=''>
              {selectedWageType.modified_on
                ? moment
                    .utc(selectedWageType.modified_on, [
                      'DD/MM/YYYYTHH:mm:ss[.mmm]TZD',
                    ])
                    .format('DD/MM/YYYY')
                : ` - `}
            </span>
          </Col>
        ) : null}
        {selectedWageType?.hasOwnProperty('deleted_by') ? (
          <Col span={12}>
            <span className='text-label'>
              <Trans>Deleted By</Trans>
            </span>
            <span className='text-content' data-test=''>
              {selectedWageType?.deleted_by?.legal_name ||
              selectedWageType.deleted_by?.name
                ? selectedWageType?.deleted_by?.legal_name ||
                  selectedWageType.deleted_by?.name
                : ` - `}
            </span>
          </Col>
        ) : null}
        {selectedWageType?.hasOwnProperty('deleted_on') ? (
          <Col span={12}>
            <span className='text-label'>
              <Trans>Deleted On</Trans>
            </span>
            <span className='text-content' data-test=''>
              {selectedWageType.deleted_on
                ? moment
                    .utc(selectedWageType.deleted_on, [
                      'DD/MM/YYYYTHH:mm:ss[.mmm]TZD',
                    ])
                    .format('DD/MM/YYYY')
                : ` - `}
            </span>
          </Col>
        ) : null}
        <Button
          type='primary'
          onClick={historyOnClick}
          className='history-btn'
          disabled={selectedWageTypeHistory !== null}
        >
          <Trans>Wage Type History</Trans>
        </Button>
        {selectedWageTypeHistory !== null &&
          selectedWageTypeHistory.map((o: IwageTypeHistory) => {
            return (
              <Col span={24}>
                <Row gutter={24} className='history'>
                  <Col span={12}>
                    <span className='text-label'>
                      <Trans>Title</Trans>{' '}
                    </span>
                    <span className='text-content' data-test=''>
                      {o.field_name ? o.field_name : ` - `}
                    </span>
                  </Col>
                  <Col span={12}>
                    <span className='text-label'>
                      <Trans>Action</Trans>{' '}
                    </span>
                    <span className='text-content' data-test=''>
                      {o.action ? o.action : ` - `}
                    </span>
                  </Col>
                  <Col span={12}>
                    <span className='text-label'>
                      <Trans>Old Value</Trans>{' '}
                    </span>
                    <span className='text-content' data-test=''>
                      {o.old_value ? o.old_value : ` - `}
                    </span>
                  </Col>
                  <Col span={12}>
                    <span className='text-label'>
                      <Trans>New Value</Trans>{' '}
                    </span>
                    <span className='text-content' data-test=''>
                      {o.new_value ? o.new_value : ` - `}
                    </span>
                  </Col>
                  <Col span={12}>
                    <span className='text-label'>
                      <Trans>Created By</Trans>{' '}
                    </span>
                    <span className='text-content' data-test=''>
                      {o.created_by ? o.created_by : ` - `}
                    </span>
                  </Col>
                  <Col span={12}>
                    <span className='text-label'>
                      <Trans>Created On</Trans>{' '}
                    </span>
                    <span className='text-content' data-test=''>
                      {o.created_on
                        ? moment
                            .utc(o.created_on, ['DD/MM/YYYYTHH:mm:ss[.mmm]TZD'])
                            .format('DD/MM/YYYY')
                        : ` - `}
                    </span>
                  </Col>
                </Row>
              </Col>
            );
          })}
      </Row>
    </>
  );
};

export default connector(memo(WageTypeConfiguration));
