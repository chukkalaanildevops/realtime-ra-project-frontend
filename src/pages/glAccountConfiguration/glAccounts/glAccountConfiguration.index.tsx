/* eslint-disable react-hooks/exhaustive-deps */
import React, { Dispatch, useEffect, useState } from 'react';
import {
  HeaderBarWrapper,
  AppDrawer,
  SkeletonItem,
  OptionalItem,
  DotMenu,
  FilterBar,
  NoData,
  ErrorBoundary,
} from '../../../shared/components';
import {
  //getGlAccounts,
  getGlAccountLoader,
  getGlAccountDetails,
  getGlAccountDetailsLoader,
  getGlSuccessMessage,
  getGlErrorMessage,
  //getGlLoadingMessage,
  getGlAccountPaginationData,
  getPermissions,
} from '../../../shared/redux/rootReducer';
import {
  fetchGlAccounts,
  deleteGlAccount,
  uploadGlAccountRecords,
  fetchGlAccountByPage,
  downloadGlAccountTemplate,
} from '../../../shared/redux/glAccount/glAccount.thunk';
import { connect, ConnectedProps } from 'react-redux';
import {
  Table,
  Skeleton,
  Row,
  Col,
  message,
  Modal,
  Pagination,
  Button,
} from 'antd';
import { Trans } from '@lingui/macro';
import {
  FullscreenOutlined,
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import { ColumnProps } from 'antd/lib/table';
import './glAccountConfiguration.index.less';
import { getFormattedDate } from '../../../utils/scroll.utils';
import { appPath } from '../../app/app.routes';
import { useHistory } from 'react-router-dom';
import { resetMessages } from '../../../shared/redux/glAccount/glAccount.actions';
// import { UploadChangeParam } from 'antd/lib/upload';
// import { UploadFile } from 'antd/lib/upload/interface';
let pageSize = 10;
let page = 1;

const CostCenterConfig: React.FC<ConnectedProps<typeof connector>> = ({
  _fetchGlAccounts,
  _deleteGlAccount,
  _resetMessages,
  _uploadFile,
  _fetchGlAccountByPage,
  _downloadFile,
  getPermissions,
  //glAccounts,
  glAccountDetails,
  detailsLoader,
  isLoading,
  //loadingMessage,
  error,
  success,
  glAccountPaginationData,
}) => {
  const history = useHistory();
  const [isItemExpanded, setExpandItem] = useState(false);
  const [errorsArray, setErrors] = useState<any[]>([]);

  useEffect(() => {
    pageSize = 10;
    _fetchGlAccountByPage(1, pageSize);
  }, []);

  // useEffect(() => {
  //   if (isLoading && loadingMessage) {
  //     message.loading(loadingMessage);
  //   } else {
  //     !success && message.destroy();
  //   }
  // }, [isLoading, loadingMessage, success]);
  useEffect(() => {
    success && message.success(success, 2, () => _resetMessages());
  }, [success]);

  useEffect(() => {
    try {
      if (error) {
        if (typeof error === 'string') {
          message.error(error, 3, () => _resetMessages());
        } else if (error instanceof Array) {
          setErrors(error);
        }
      } else {
        setErrors([]);
      }
    } catch (e) {}
  }, [error]);

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

  const deleteRecord = (id: string) => {
    _deleteGlAccount(id, page, pageSize);
  };

  const updateClick = (record: any) => {
    _resetMessages();
    history.push(
      `${appPath.config_setup.glAccounts.update.linkTo}${record.id}`,
    );
  };
  const columns: ColumnProps<any>[] = [
    {
      key: 'ACCOUNT_NUMBER',
      dataIndex: 'account_number',
      title: () => getElemOrSkeleton(<Trans>Account Number</Trans>),
      render: getElemOrSkeleton,
    },
    {
      key: 'ACCOUNT_TYPE',
      dataIndex: 'account_type',
      title: () => getElemOrSkeleton(<Trans>Account Type</Trans>),
      render: (value: any) => getElemOrSkeleton(value?.title),
    },
    {
      key: 'ACTION',
      title: () => getElemOrSkeleton(<Trans>Action</Trans>),
      dataIndex: '',
      width: '100px',
      align: 'center',
      render: (_value: any, record: any) =>
        isLoading ? (
          getElemOrSkeleton('')
        ) : (
          <>
            <DotMenu
              actionBtn={[
                {
                  children: <Trans>Update</Trans>,
                  icon: EditOutlined,
                  Type: 'link',
                  OnClick: () => updateClick(record),
                },
                {
                  OnClick: () => deleteRecord(record.id),
                  children: <Trans>Delete</Trans>,
                  icon: DeleteOutlined,
                  Type: 'link',
                },
              ]}
            >
              <EllipsisOutlined />
            </DotMenu>
          </>
        ),
    },
  ];

  const getColumns = () => {
    const toBeRemovedIndexes: any = [];
    for (let index = 0; index < columns.length; index++) {
      const item = columns[index];
      if (item.key === 'ACTION' && !getPermissions.ACTION_SETUP_GL_ACCOUNTS) {
        toBeRemovedIndexes.push(index);
      }
    }
    const newColumns = columns.filter(
      (_item, index) => !toBeRemovedIndexes.includes(index),
    );
    return newColumns;
  };

  const onItemExpand = (record: any) => {
    setExpandItem(true);
    _fetchGlAccounts(record.id);
  };

  const closeDetailsDrawer = () => {
    setExpandItem(false);
  };

  // const uploadGlAccounts = (files: UploadChangeParam<UploadFile<any>>) => {
  //   _uploadFile(files.file);
  // };

  const errorColumns = [
    {
      dataIndex: 'row_index',
      title: 'Row No',
      width: '80px',
    },
    {
      dataIndex: 'errors',
      title: 'Errors',
      render: (val: any) => {
        const keys = Object.keys(val);
        return keys.map(key => (
          <div>
            <span style={{ fontWeight: 600 }}>{key} : </span> {val[key].msg}
          </div>
        ));
      },
    },
  ];

  const onChangePagination = (page: number, pageSize: number) => {
    _fetchGlAccountByPage(page, pageSize);
  };

  const downloadTemplate = () => {
    _downloadFile();
  };

  return (
    <ErrorBoundary>
      <HeaderBarWrapper
        headerCommonProps={{ title: <Trans>GL Accounts</Trans> }}
      >
        <div className='gl-account-configuration-container'>
          <FilterBar
            isAddButton={getPermissions.ACTION_SETUP_GL_ACCOUNTS}
            addButtonOnClickFn={() => {
              _resetMessages();
              history.push(appPath.config_setup.glAccounts.add.linkTo);
            }}
            enableBackBtn={true}
            uploadConfig={{
              accept: '.csv',
              // beforeUpload: _file => false,
              beforeUpload: file => {
                _uploadFile(file);
                return false;
              },
              showUploadList: false,
              defaultFileList: [],
            }}
            extraData={{
              showDropdown: getPermissions.ACTION_SETUP_GL_ACCOUNTS,
              downloadHandle: downloadTemplate,
              uploadHandle: () => {},
            }}
          />

          {glAccountPaginationData.data &&
          glAccountPaginationData.data.length === 0 &&
          glAccountPaginationData.current_page === 1 ? (
            <NoData />
          ) : (
            <>
              <Table
                columns={getColumns()}
                dataSource={glAccountPaginationData.data}
                bordered
                pagination={false}
                expandable={{
                  expandedRowRender: () => null,
                  rowExpandable: () => true,
                  expandIcon: ({ record }) =>
                    isLoading ? (
                      <Skeleton.Input size='small' active={isLoading} />
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
                  current={glAccountPaginationData.current_page}
                  onChange={(pageNumber: number) => {
                    page = pageNumber;
                    onChangePagination(pageNumber, pageSize);
                  }}
                  hideOnSinglePage={false}
                  showSizeChanger={true}
                  pageSizeOptions={['10', '20', '50', '100']}
                  pageSize={pageSize || 10}
                  onShowSizeChange={(_current: number, size: number) => {
                    pageSize = size;
                  }}
                  total={
                    glAccountPaginationData.pagination_data &&
                    glAccountPaginationData.pagination_data.total_records
                  }
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
          )}

          <Modal
            visible={errorsArray.length > 0}
            onOk={_resetMessages}
            onCancel={_resetMessages}
            cancelButtonProps={{ style: { display: 'none' } }}
            bodyStyle={{ paddingTop: 0, paddingBottom: 0 }}
            title={
              <div style={{ display: 'flex' }}>
                <CloseCircleOutlined style={{ fontSize: 18, color: 'red' }} />
                <span style={{ marginLeft: 12 }}>{<Trans>Errors</Trans>}</span>
              </div>
            }
          >
            <Table
              columns={errorColumns}
              dataSource={errorsArray}
              pagination={false}
            />
          </Modal>

          <AppDrawer
            visible={isItemExpanded}
            destroyOnClose={true}
            closable={true}
            onClose={closeDetailsDrawer}
            title={<Trans>GL Account Details</Trans>}
            showCancelButton={false}
            showOkButton={false}
            getContainer='.gl-account-configuration-container'
          >
            {detailsLoader ? (
              <SkeletonItem />
            ) : (
              <div>
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <OptionalItem
                      title={<Trans>Title</Trans>}
                      value={glAccountDetails.account_number}
                    />

                    <OptionalItem
                      title={<Trans>Created On</Trans>}
                      value={getFormattedDate(glAccountDetails.created_on)}
                    />
                  </Col>
                  <Col span={12}>
                    <OptionalItem
                      title={<Trans>Code</Trans>}
                      value={glAccountDetails.account_type?.code}
                    />
                    <OptionalItem
                      title={<Trans>Code Title</Trans>}
                      value={glAccountDetails.account_type?.title}
                    />
                  </Col>
                </Row>
              </div>
            )}
          </AppDrawer>
        </div>
      </HeaderBarWrapper>
    </ErrorBoundary>
  );
};

const mapStateToProps = (state: any) => ({
  //glAccounts: getGlAccounts(state),
  isLoading: getGlAccountLoader(state),
  glAccountDetails: getGlAccountDetails(state),
  detailsLoader: getGlAccountDetailsLoader(state),
  success: getGlSuccessMessage(state),
  error: getGlErrorMessage(state),
  //loadingMessage: getGlLoadingMessage(state),
  glAccountPaginationData: getGlAccountPaginationData(state),
  getPermissions: getPermissions(state),
});

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  _fetchGlAccounts: (id?: string) => dispatch(fetchGlAccounts(id)),
  _fetchGlAccountByPage: (page?: number, pageSize?: number) =>
    dispatch(fetchGlAccountByPage(page, pageSize)),
  _deleteGlAccount: (id: string, page?: number, pageSize?: number) =>
    dispatch(deleteGlAccount(id, page, pageSize)),
  _resetMessages: () => dispatch(resetMessages()),
  _uploadFile: (file: any) => dispatch(uploadGlAccountRecords(file)),
  _downloadFile: () => dispatch(downloadGlAccountTemplate()),
});

const connector = connect(mapStateToProps, mapDispatchToProps);

export default connector(CostCenterConfig);
