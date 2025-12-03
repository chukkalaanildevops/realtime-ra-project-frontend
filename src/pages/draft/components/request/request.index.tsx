/* eslint-disable react-hooks/exhaustive-deps */
import React, { Dispatch, useState, memo, useEffect } from 'react';
import {
  FilterBar,
  DotMenu,
  AppDrawer,
  NoData,
  StatusTag,
  ErrorBoundary,
  Remarks,
  DataFilter,
  ElementOrSkeleton,
  ReceiptViewer,
} from '../../../../shared/components';
import {
  getDraftRequests,
  getDraftsLoader,
  getRequeststate,
  getDraftDefaultView,
} from '../../../../shared/redux/rootReducer';
import { connect, ConnectedProps } from 'react-redux';
import { Table, Pagination, Skeleton, Row, Col, Checkbox, Button } from 'antd';
import {
  deleteRequests,
  sendRequestForApproval,
  fetchDraftsTabData,
} from '../../drafts.thunk';
import {
  fetchRequestTypeConfigById,
  fetchRequestDetailsById,
} from '../../../requestTypeConfiguration/requestTypeConfiguration.thunk';
import { Trans } from '@lingui/macro';

import {
  EllipsisOutlined,
  EditOutlined,
  DeleteOutlined,
  CopyOutlined,
  ExportOutlined,
} from '@ant-design/icons';
import { viewType } from '../../../../shared/components/filterBar/filterBar.model';
import { useHistory } from 'react-router-dom';
import { appPath } from '../../../app/app.routes';
import { actionBtnObjInterface } from '../../../../shared/components/dotMenu/dotMenu.model';
import { DraftCard } from '..';
import { saveRequestData } from '../../../requestTypeConfiguration/requestTypeConfiguration.action';
import {
  setConfirmationInfo,
  resetConfirmationInfo,
} from '../../../app/app.actions';
import {
  IConfirmationInfo,
  IfetchWorkFlowDataProps,
} from '../../../app/app.model';
import { setRequestApprovedOrDeleteState } from '../../drafts.action';
import { fetchWorkFlowData } from '../../../app/app.thunk';
import { IWorkflowStatus } from '../../../../shared/model';
import RequestDetails from '../../../request/detail/requestDetail.index';
let localFilters: any;
let initialPageSize = 12;

const DraftRequest: React.FC<ConnectedProps<typeof connector> & {
  onSelectRow?: (list: any[]) => void;
  source?: any;
}> = ({
  records,
  source,
  isLoading,
  defaultView,
  isRequestDeleteOrApproved,
  _fetchRecords,
  _saveRequestData,
  _fetchRequestDetailsById,
  _resetConfirmationInfo,
  _setConfirmationInfo,
  _deleteRecords,
  _approveRequest,
  onSelectRow,
  _setRequestApprovedOrDeleteState,
}) => {
  const history = useHistory();
  const [dataView, setDataView] = useState<viewType>(defaultView);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [selectedSubmittableItems, setSelectedSubmittableItems] = useState<
    number[]
  >([]);
  const [isItemExpanded, setItemExpanded] = useState(false);
  const [drawerTitle, setDrawerTitle] = useState('');
  const [isFilterVisible, setFilterVisible] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<{
    status: {
      code: string;
      title: string;
    };
    id: number;
  } | null>(null);

  const showDeleteItemBox = (ids: number[], _localFilters: any) => {
    _setConfirmationInfo({
      bodyText: 'Do you want to delete request',
      cancelText: 'Cancel',
      okText: 'Delete',
      visibility: true,
      extraInfo: '',
      forWhat: '',
      headerText: 'Confirmation',
      cancelBtnFn: _resetConfirmationInfo,
      okBtnFn: () => deleteRequest(ids, _localFilters),
    });
  };

  useEffect(() => {
    // const locationState = location.state as any;
    // if (locationState && locationState.page) {
    //   _fetchRecords(locationState.page);
    // }
    _fetchRecords(1, undefined, pageSize);
  }, []);

  useEffect(() => {
    if (isRequestDeleteOrApproved) {
      setSelectedItems([]);
      _setRequestApprovedOrDeleteState(false);
    }
  }, [isRequestDeleteOrApproved]);

  const deleteRequest = (ids: number[], _localFilters: any) => {
    _deleteRecords(ids, _localFilters, pageSize);
    _resetConfirmationInfo();
  };

  const onApplyFilters = (filters: any) => {
    localFilters = filters;
    _fetchRecords(1, filters, pageSize);
  };

  const onResetFilters = () => {
    localFilters = undefined;
    _fetchRecords(1, undefined, pageSize);
  };

  const closeDetailsDrawer = () => {
    setItemExpanded(false);
    setDrawerTitle('');
    setCurrentStatus(null);
  };

  const actionBtn = (
    item: any,
    type: 'card' | 'table' = 'table',
  ): actionBtnObjInterface[] => {
    let actions: actionBtnObjInterface[] = [
      {
        children: <Trans>Clone</Trans>,
        Type: 'default',
        icon: CopyOutlined,
        OnClick: () => cloneItem(item),
      },
      {
        children: <Trans>Delete</Trans>,
        Type: 'default',
        icon: DeleteOutlined,
        OnClick: () => showDeleteItemBox([item.id], localFilters),
      },
      {
        children: <Trans>Send For Approval</Trans>,
        Type: 'link',
        icon: ExportOutlined,
        OnClick: () => _approveRequest([item.id], localFilters),
        Disabled:
          typeof item.is_submittable === 'boolean' && !item.is_submittable,
      },
    ];

    if (type === 'table') {
      actions.unshift({
        Type: 'default',
        icon: EditOutlined,
        children: <Trans>Edit</Trans>,
        OnClick: () => editItem(item.id),
        Disabled: typeof item.is_editable === 'boolean' && !item.is_editable,
      });
    }
    return actions;
  };

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

  const openDetailsDrawer = (item: any) => {
    setItemExpanded(true);
    setDrawerTitle(item.request_no);
    setCurrentStatus({
      status: item.workflow_status,
      id: item.id,
    });
  };

  const onRemarkAdded = () => {
    // _fetchRecords(1);
  };

  const editItem = (id: string) => {
    history.push(appPath.addNew.addRequest.update.linkTo + id + '/');
  };

  const cloneItem = (item: any) => {
    //_fetchRequestDetailsById(item.id);
    // const clone_state = {
    //   type: 'clone',
    //   is_travel_type: item.request_type_legal_entity.is_travel_type,
    //   item,
    // };
    history.push(`${appPath.addNew.addRequest.linkTo}`, {
      type: 'clone',
      is_travel_type: item.request_type_legal_entity.is_travel_type,
      item,
    });
    // localStorage.setItem('clone_data', JSON.stringify(clone_state));
    // history.push(`${appPath.addNew.addRequest.linkTo}`, clone_state);
  };
  const columns = [
    {
      dataIndex: 'request_no',
      title: () => getElemOrSkeleton(<Trans>Request No</Trans>),
      fixed: 'left' as 'left',
      ellipsis: true,
      width: 170,
      render: (val: string, item: any) =>
        isLoading ? (
          getElemOrSkeleton(val)
        ) : (
          <Button
            type='link'
            onClick={() => openDetailsDrawer(item)}
            className='no-pad _lr'
          >
            {val}
          </Button>
        ),
    },
    {
      dataIndex: 'start_date',
      title: () => getElemOrSkeleton(<Trans>Start Date</Trans>),
      render: getElemOrSkeleton,
    },
    {
      dataIndex: 'end_date',
      title: () => getElemOrSkeleton(<Trans>End Date</Trans>),
      render: getElemOrSkeleton,
    },
    {
      dataIndex: 'request_type_legal_entity',
      title: () => getElemOrSkeleton(<Trans>Request Type</Trans>),
      render: (value: any) => (isLoading ? getElemOrSkeleton('') : value.title),
    },
    {
      dataIndex: 'request_type_legal_entity',
      title: () => getElemOrSkeleton(<Trans>Category</Trans>),
      render: (val: any) =>
        getElemOrSkeleton(val?.is_travel_type ? 'Travel' : 'General'),
    },
    {
      dataIndex: '',
      title: () => getElemOrSkeleton(<Trans>Receipt/s</Trans>),
      align: 'center' as 'center',
      render: (_val: any, item: any) =>
        isLoading ? (
          getElemOrSkeleton('')
        ) : (
          <ReceiptViewer
            itemId={item.id}
            itemType='requests'
            itemNumber={item.request_no}
            count={item.additional_documents}
          />
        ),
    },
    {
      dataIndex: 'total_comments',
      title: () => getElemOrSkeleton(<Trans>Remarks</Trans>),
      align: 'center' as 'center',
      render: (val: any, item: any) =>
        isLoading ? (
          getElemOrSkeleton('')
        ) : (
          <>
            <Remarks
              remarkCount={val}
              itemId={item.id}
              itemType='requests'
              onRemarkAdded={onRemarkAdded}
              item_no={item.request_no}
            />
          </>
        ),
    },
    {
      dataIndex: 'status',
      title: () => getElemOrSkeleton(<Trans>Status</Trans>),
      align: 'center' as 'center',
      width: 150,
      render: (_val: string) =>
        isLoading ? (
          getElemOrSkeleton('')
        ) : (
          <StatusTag
            status={
              { code: 'DRAFTD', title: <Trans>Draft</Trans> } as IWorkflowStatus
            }
          />
        ),
    },
    {
      dataIndex: '',
      title: () => getElemOrSkeleton(<Trans>Action</Trans>),
      align: 'center' as 'center',
      width: 100,
      fixed: 'right' as 'right',
      render: (_val: string, item: any) =>
        isLoading ? (
          getElemOrSkeleton('')
        ) : (
          <DotMenu actionBtn={actionBtn(item)}>
            <EllipsisOutlined />
          </DotMenu>
        ),
    },
  ];

  const selectAll = (isChecked: boolean) => {
    if (isChecked) {
      const isSubmittable =
        records?.data.filter((item: any) => item.is_submittable) || [];
      const filteredSubmittableData = isSubmittable.map(item => item.id) || [];
      const array = records?.data.map(item => item.id) || [];
      setSelectedItems(array);
      setSelectedSubmittableItems(filteredSubmittableData);
    } else {
      setSelectedItems([]);
      setSelectedSubmittableItems([]);
    }
  };

  const onSelectCard = (checked: boolean, id: number) => {
    if (checked) {
      setSelectedItems(prev => [...prev, id]);
      setSelectedSubmittableItems(prev => [...prev, id]);
    } else {
      const array = selectedItems.filter(item => id !== item);
      const filteredArray = selectedSubmittableItems.filter(
        item => id !== item,
      );
      setSelectedSubmittableItems(filteredArray);
      setSelectedItems(array);
    }
  };

  const bulkActions = (
    <>
      <Col>
        <Button
          type='primary'
          size='small'
          onClick={() =>
            _approveRequest(selectedSubmittableItems, localFilters)
          }
        >
          <Trans>Submit</Trans>
        </Button>
      </Col>
      <Col>
        <Button
          type='link'
          size='small'
          onClick={() => showDeleteItemBox(selectedItems, localFilters)}
        >
          <Trans>Delete</Trans>
        </Button>
      </Col>
    </>
  );
  const renderCards = () => (
    <>
      <div className='select-all-container'>
        <Row gutter={24}>
          <Col>
            <Checkbox
              checked={selectedItems.length === records?.data.length}
              indeterminate={
                selectedItems.length !== 0 &&
                selectedItems.length < (records?.data.length || 0)
              }
              onChange={e => selectAll(e.target.checked)}
              style={{ color: '#A1B2C2' }}
            >
              Select All
            </Checkbox>
            <span className='selected-item-count'>
              {selectedItems.length > 0 ? `. ${selectedItems.length}` : null}
            </span>
          </Col>
          {selectedItems.length > 0 && bulkActions}
        </Row>
      </div>
      <div className='card-parent-container'>
        <Row gutter={[24, 24]}>
          {records?.data.map(item => (
            <ErrorBoundary>
              <Col
                className='card'
                xs={24}
                sm={12}
                md={12}
                lg={8}
                xl={8}
                xxl={6}
                key={item.id}
              >
                <DraftCard
                  actions={actionBtn(item, 'card')}
                  onChecked={checked => onSelectCard(checked, item.id)}
                  title={`${item.start_date} - ${item.end_date}`}
                  checked={selectedItems.includes(item.id)}
                  code={item.request_no}
                  type={item.request_type_legal_entity.title}
                  onDetails={() => openDetailsDrawer(item)}
                  status={{ code: 'DRAFTD', title: 'Draft' }}
                  category={
                    item.request_type_legal_entity?.is_travel_type
                      ? 'Travel'
                      : 'General'
                  }
                  id={item.id}
                  actionText='EDIT'
                  checkboxProps={{
                    disabled: !item.is_submittable,
                  }}
                  onMainAction={() => editItem(item.id)}
                  receipts={
                    <ReceiptViewer
                      itemId={item.id}
                      itemType='requests'
                      itemNumber={item.request_no}
                      count={item.additional_documents}
                    />
                  }
                  remarks={item.total_comments}
                  cardType='requests'
                  expenseType='request'
                  onRemarkAdded={onRemarkAdded}
                />
              </Col>
            </ErrorBoundary>
          ))}
        </Row>
      </div>
    </>
  );

  const onChangePagination = (page: number, pageSize: number) => {
    _fetchRecords(page, localFilters, pageSize);
    setSelectedItems([]);
    onSelectChange([]);
  };

  const onSelectChange = (selectedRowKeys: any[]) => {
    setSelectedSubmittableItems(selectedRowKeys as never);

    setSelectedItems(selectedRowKeys as never);
    onSelectRow && onSelectRow(selectedRowKeys);
  };

  const renderData = () => {
    if (isLoading)
      return (
        <ElementOrSkeleton
          isLoading={isLoading}
          type={dataView === 'Card' ? 'cards' : 'table'}
          tableConfiguration={{ columns: 8, rows: 10 }}
          cardsConfiguration={{ numberOfCardsPerRow: 4, rows: 3 }}
        />
      );
    if (records && records?.data.length > 0) {
      return (
        <>
          {dataView === 'Table' ? (
            <>
              <div className='select-all-container' style={{ marginLeft: 12 }}>
                <Row gutter={24}>
                  <Col>
                    <Checkbox
                      checked={selectedItems.length === records?.data.length}
                      indeterminate={
                        selectedItems.length !== 0 &&
                        selectedItems.length < (records?.data.length || 0)
                      }
                      onChange={e => selectAll(e.target.checked)}
                      style={{ color: '#A1B2C2' }}
                    >
                      <Trans>Select All</Trans>
                    </Checkbox>
                    <span className='selected-item-count'>
                      {selectedItems.length > 0
                        ? `. ${selectedItems.length}`
                        : null}
                    </span>
                  </Col>
                  {selectedItems.length > 0 && bulkActions}
                </Row>
              </div>
              <Table
                bordered
                pagination={false}
                columns={columns}
                dataSource={records?.data}
                rowKey={item => item.id}
                scroll={{ x: 1200 }}
                rowSelection={{
                  type: 'checkbox',
                  selectedRowKeys: selectedItems,
                  onChange: onSelectChange,
                  getCheckboxProps: item => ({
                    disabled: !item.is_submittable,
                  }),
                }}
                size='middle'
              />
            </>
          ) : (
            renderCards()
          )}
          <div
            style={{
              display: 'flex',
              flexDirection: 'row-reverse',
              marginTop: 12,
            }}
          >
            <Pagination
              defaultCurrent={1}
              current={records.current_page}
              onChange={(pageNumber: number, pageSize: any) => {
                onChangePagination(pageNumber, pageSize);
              }}
              hideOnSinglePage={false}
              showSizeChanger={true}
              defaultPageSize={12}
              pageSizeOptions={['10', '12', '20', '50', '100']}
              pageSize={pageSize || 12}
              onShowSizeChange={(_current: number, size: number) => {
                setPageSize(size);
              }}
              total={records.pagination_data.total_records}
              showTotal={(total: number, range: number[]) => {
                return <>{`${range[0]}-${range[1]} of ${total}`}</>;
              }}
              showQuickJumper={{
                goButton: <Button type='default'>Go</Button>,
              }}
            />
          </div>
        </>
      );
    } else {
      return <NoData />;
    }
  };

  const drawerTitleComponent = (
    <>
      {`Request No. #${drawerTitle}`}
      <StatusTag status={currentStatus?.status as IWorkflowStatus} />
    </>
  );

  return (
    <ErrorBoundary>
      <div className='draft-request-container'>
        <FilterBar
          isAddButton={false}
          filterView={setFilterVisible}
          viewConfig={{
            currentView: dataView,
            enableToggleView: true,
            onChangeView: (view: viewType) => setDataView(view),
          }}
        />
        <div style={{ marginBottom: 20 }}>
          <DataFilter
            page='DRAFT'
            source={source}
            includeLegalEntities
            includeStatusBar={false}
            isVisible={isFilterVisible}
            includeDraftStatus={false}
            includeSaveFilterOption={false}
            item='request'
            onApplyFilters={onApplyFilters}
            onResetFilters={onResetFilters}
            includeItemNumber={true}
          />
        </div>
        {renderData()}
        <AppDrawer
          visible={isItemExpanded}
          destroyOnClose={true}
          closable={true}
          onClose={closeDetailsDrawer}
          title={drawerTitleComponent}
          showCancelButton={false}
          showOkButton={false}
          width='80%'
          getContainer='.draft-request-container'
          className='request-detail-drawer no-header-border'
        >
          <RequestDetails requestId={currentStatus?.id as number} />
        </AppDrawer>
      </div>
    </ErrorBoundary>
  );
};

const mapStateToProps = (state: any) => ({
  records: getDraftRequests(state),
  isLoading: getDraftsLoader(state),
  isRequestDeleteOrApproved: getRequeststate(state),
  defaultView: getDraftDefaultView(state),
});

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  _fetchRecords: (page: number, filters?: any, pageSize?: number) =>
    dispatch(fetchDraftsTabData('request', page, filters, pageSize)),
  _saveRequestData: (data: any) => dispatch(saveRequestData(data)),
  _fetchRequestDetailsById: (id: any) => dispatch(fetchRequestDetailsById(id)),
  _fetchRequestConfig: (id: string) => dispatch(fetchRequestTypeConfigById(id)),
  _setConfirmationInfo: (data: IConfirmationInfo) =>
    dispatch(setConfirmationInfo(data)),
  _resetConfirmationInfo: () => dispatch(resetConfirmationInfo()),
  _deleteRecords: (ids: number[], _localFilters: any, pageSize?: number) =>
    dispatch(deleteRequests(ids, _localFilters, pageSize)),
  _approveRequest: (requests: number[], _localFilters: any) =>
    dispatch(sendRequestForApproval(requests, _localFilters)),
  _fetchWorkFlowData: (props: IfetchWorkFlowDataProps) =>
    dispatch(fetchWorkFlowData(props)),
  _setRequestApprovedOrDeleteState: (data: boolean) =>
    dispatch(setRequestApprovedOrDeleteState(data)),
});

const connector = connect(mapStateToProps, mapDispatchToProps);
export default connector(memo(DraftRequest));
