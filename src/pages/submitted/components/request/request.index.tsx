/* eslint-disable react-hooks/exhaustive-deps */
import React, { Dispatch, useState, memo, useEffect } from 'react';
import {
  FilterBar,
  DotMenu,
  AppDrawer,
  NoData,
  Card,
  StatusTag,
  ErrorBoundary,
  Remarks,
  DataFilter,
  ElementOrSkeleton,
  ReceiptViewer,
} from '../../../../shared/components';
import {
  getSubmittedRequests,
  getSubmittedLoader,
  getSubmittedSuccess,
  isProxyPermissionAllowed,
  getSubmittedDefaultView,
} from '../../../../shared/redux/rootReducer';
import { connect, ConnectedProps } from 'react-redux';
import {
  Table,
  Pagination,
  Skeleton,
  // Card,
  Row,
  Col,
  Button,
  Modal,
  Input,
} from 'antd';
import {
  withdrawRequest,
  fetchSubmittedTabData,
  attachRequestWorkflow,
  deleteRequests,
} from '../../submitted.thunk';
import { Trans } from '@lingui/macro';

import {
  EllipsisOutlined,
  PlusOutlined,
  RollbackOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  PaperClipOutlined,
  UnorderedListOutlined,
  // MessageOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { viewType } from '../../../../shared/components/filterBar/filterBar.model';
import { useHistory, useLocation } from 'react-router-dom';
import { appPath } from '../../../app/app.routes';

import { actionBtnObjInterface } from '../../../../shared/components/dotMenu/dotMenu.model';

import {
  IfetchWorkFlowDataProps,
  IConfirmationInfo,
} from '../../../app/app.model';
import { IWorkflowStatus } from '../../../../shared/model';
import { fetchWorkFlowData } from '../../../app/app.thunk';
import RequestDetails from '../../../request/detail/requestDetail.index';
import { PROXY_PERMISSIONS } from '../../../delegate/delegate.model';
import {
  setConfirmationInfo,
  resetConfirmationInfo,
} from '../../../app/app.actions';

let localFilters: any;
let initialPageSize = 12;

const SubmittedRequest: React.FC<ConnectedProps<typeof connector> & {
  onSelectRow?: (list: any[]) => void;
  source?: any;
}> = ({
  records,
  source,
  isLoading,
  defaultView,
  success,
  isPermissionAllowed,
  _fetchRecords,
  _withdrawRequest,
  _fetchWorkFlowData,
  _attachWorkflow,
  _deleteRecords,
  _resetConfirmationInfo,
  _setConfirmationInfo,
}) => {
  const [editFilter, setEditFilter] = useState<any>(undefined);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [dataView, setDataView] = useState<viewType>(defaultView);
  const [isItemExpanded, setItemExpanded] = useState(false);
  const [drawerTitle, setDrawerTitle] = useState('');
  const [withdrawReason, setWithdrawReason] = useState('');
  const [isFilterVisible, setFilterVisible] = useState(false);
  const [withdrawModal, setWithdrawModal] = useState({
    id: -1,
    isModalVisible: false,
  });
  const [currentStatus, setCurrentStatus] = useState<{
    status: {
      code: string;
      title: string;
    };
    id: number;
  } | null>(null);

  const history = useHistory();
  const location: any = useLocation();
  const locationState = location.state as any;
  useEffect(() => {
    if (locationState && locationState.page && locationState.status) {
      _fetchRecords(locationState.page, { status: locationState.status });
      setEditFilter({ status: (location.state as any)?.status });
    }
  }, [locationState]);

  const closeDetailsDrawer = () => {
    setItemExpanded(false);
    setDrawerTitle('');
    setCurrentStatus(null);
  };

  const showWithdrawConfirmation = (id: number) => {
    setWithdrawModal({ id, isModalVisible: true });
  };

  const closeWithdrawConfirmation = () => {
    setWithdrawModal({ id: -1, isModalVisible: false });
    setWithdrawReason('');
  };

  const deleteRequest = (ids: number[], _localFilters: any) => {
    _deleteRecords(ids, _localFilters, pageSize);
    _resetConfirmationInfo();
  };

  const showDeleteItemBox = (ids: number[], _localFilters: any) => {
    _setConfirmationInfo({
      bodyText: 'Do you want to delete request?',
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

  const actionBtn = (
    item: any,
    type: 'card' | 'table' = 'table',
  ): actionBtnObjInterface[] => {
    let actions: actionBtnObjInterface[] = [];
    if (
      item.workflow_status.title === 'Approved' &&
      item.can_claim_expense &&
      type === 'table' &&
      isPermissionAllowed('ACTION_EXPENSE')
    ) {
      actions.push({
        Type: 'link',
        icon: PlusOutlined,
        children: <Trans>Add Expenses</Trans>,
        OnClick: () => addNewExpense(item.id),
        Disabled: item?.is_request_expired,
      });

      // Attached Expenses
      const requests = item.attached_expense_types
        ? new Array(item.attached_expense_types)
        : [];
      actions.push({
        children: <Trans>Attached Expenses</Trans>,
        Type: 'default',
        icon: UnorderedListOutlined,
        OnClick: () =>
          history.push(`${appPath.submitted.expenses.linkTo}${item.id}`),
        Disabled: requests.length === 0,
      });
    }

    if (item.workflow_status.code === 'REJCTD') {
      actions.push({
        Type: 'default',
        icon: EditOutlined,
        children: <Trans>Edit</Trans>,
        OnClick: () =>
          history.push(`${appPath.addNew.addRequest.update.linkTo}${item.id}`),
      });
      actions.push({
        Type: 'default',
        icon: DeleteOutlined,
        children: <Trans>Delete</Trans>,
        OnClick: () => showDeleteItemBox([item.id], localFilters),
      });
    } else if (item.workflow_status.code !== 'SETTLD') {
      actions.push({
        children: <Trans>Withdraw</Trans>,
        Type: 'default',
        icon: RollbackOutlined,
        OnClick: () => showWithdrawConfirmation(item.id),
      });
    }
    if (
      item.workflow_status.code === 'STALED' &&
      item.workflow_steps_count === 0 &&
      item.request_type_legal_entity?.has_approval_rule
    ) {
      actions.push({
        children: <Trans>Attach Workflow</Trans>,
        Type: 'default',
        icon: PaperClipOutlined,
        OnClick: () => _attachWorkflow(item.id, localFilters),
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
      // width: 100,
    },
    {
      dataIndex: 'end_date',
      title: () => getElemOrSkeleton(<Trans>End Date</Trans>),
      render: getElemOrSkeleton,
      // width: 100,
    },
    {
      dataIndex: 'request_type_legal_entity',
      title: () => getElemOrSkeleton(<Trans>Request Type</Trans>),
      ellipse: true,
      render: (value: any) =>
        isLoading ? getElemOrSkeleton(<Trans></Trans>) : value.title,
    },
    {
      dataIndex: '',
      title: () => getElemOrSkeleton(<Trans>Receipt/s</Trans>),
      align: 'center' as 'center',
      // width: 90,
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
      // width: 90,
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
      dataIndex: 'request_type_legal_entity',
      title: () => getElemOrSkeleton(<Trans>Category</Trans>),
      render: (val: any) =>
        getElemOrSkeleton(val?.is_travel_type ? 'Travel' : 'General'),
      // width: 140,
    },
    {
      dataIndex: 'workflow_status',
      title: () => getElemOrSkeleton(<Trans>Status</Trans>),
      align: 'center' as 'center',
      width: 150,
      render: (val: any, item: any) =>
        isLoading ? (
          getElemOrSkeleton('')
        ) : (
          <StatusTag
            status={val}
            onStatusClick={() => handleStatusTagClick(item.id)}
          />
        ),
    },
    {
      dataIndex: '',
      width: 100,
      title: () => getElemOrSkeleton(<Trans>Action</Trans>),
      align: 'center' as 'center',
      fixed: 'right' as 'right',
      render: (_val: string, item: any) =>
        isLoading ? (
          getElemOrSkeleton('')
        ) : (
          <DotMenu actionBtn={actionBtn(item)} showInMenu={true}>
            <EllipsisOutlined />
          </DotMenu>
        ),
    },
  ];

  const addNewExpense = (recordId: any) => {
    let path = appPath.submitted.expenses.addNew.linkTo;
    path = path.replace(':requestId', recordId);
    history.push(path);
  };

  const renderCards = () => (
    <div className='card-parent-container'>
      <Row gutter={[24, 24]}>
        {records?.data.map(item => (
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
            <ErrorBoundary>
              <Card
                canSelectItem={false}
                id={item.id}
                actions={actionBtn(item, 'card')}
                title={`${item.start_date} - ${item.end_date}`}
                code={item.request_no}
                type={item.request_type_legal_entity.title}
                onDetails={() => openDetailsDrawer(item)}
                status={item.workflow_status}
                handleStatusTagClick={handleStatusTagClick}
                category={
                  item.request_type_legal_entity?.is_travel_type
                    ? 'Travel'
                    : 'General'
                }
                actionText={
                  item.workflow_status?.title === 'Approved'
                    ? 'ADD EXPENSE'
                    : item.workflow_status?.title === 'Rejected'
                    ? 'EDIT'
                    : 'WITHDRAW'
                }
                hideMainAction={
                  isPermissionAllowed('ACTION_EXPENSE') &&
                  item.workflow_status?.title === 'Approved' &&
                  item.can_claim_expense
                    ? false
                    : true
                }
                onMainAction={
                  item.workflow_status?.title === 'Approved'
                    ? () => addNewExpense(item.id)
                    : item.workflow_status?.title === 'Rejected'
                    ? () =>
                        history.push(
                          `${appPath.addNew.addRequest.update.linkTo}${item.id}`,
                        )
                    : () => showWithdrawConfirmation(item.id)
                }
                receipts={
                  // eslint-disable-next-line react/jsx-no-undef
                  <ReceiptViewer
                    itemId={item.id}
                    itemType='requests'
                    itemNumber={item.request_no}
                    count={item.additional_documents}
                  />
                }
                remarks={item.total_comments}
                canClaimExpense={!item?.is_request_expired}
                request={
                  isPermissionAllowed('ACTION_EXPENSE')
                    ? item.attached_expense_types
                      ? new Array(item.attached_expense_types)
                      : []
                    : undefined
                }
                onRequestsClick={() =>
                  history.push(`${appPath.submitted.expenses.linkTo}${item.id}`)
                }
                cardType='requests'
                onRemarkAdded={onRemarkAdded}
              />
            </ErrorBoundary>
          </Col>
        ))}
      </Row>
    </div>
  );
  const handleStatusTagClick = (id: number) => {
    _fetchWorkFlowData({ id: id, type: 'request' });
  };
  const onChangePagination = (page: number, pageSize: number) => {
    _fetchRecords(
      page,
      localFilters,
      pageSize,
      locationState && locationState.status,
    );
  };

  const renderData = () => {
    if (isLoading)
      return (
        <ElementOrSkeleton
          isLoading={isLoading}
          type={dataView === 'Card' ? 'cards' : 'table'}
          tableConfiguration={{ columns: 8, rows: 10 }}
          cardsConfiguration={{ numberOfCardsPerRow: 4, rows: 3 }}
          isActive={true}
        />
      );
    if (records && records?.data.length > 0) {
      return (
        <>
          {dataView === 'Table' ? (
            <Table
              bordered
              pagination={false}
              columns={columns}
              dataSource={records?.data}
              rowKey={item => item.id}
              scroll={{ x: 1200 }}
              size='middle'
            />
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
              pageSizeOptions={['10', '12', '20', '50', '100']}
              pageSize={pageSize || 12}
              showSizeChanger={true}
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

  useEffect(() => {
    if (success && success.includes('withdraw')) {
      closeWithdrawConfirmation();
    }
  }, [success]);

  const withdrawHandler = () => {
    try {
      if (withdrawReason.trim() === '') {
        return;
      }
      _withdrawRequest(
        withdrawModal.id,
        withdrawReason,
        localFilters,
        pageSize,
      );
      setWithdrawModal({ id: -1, isModalVisible: false });
      setWithdrawReason('');
    } catch (e) {
      console.error(e);
    }
  };

  const onApplyFilters = (filters: any) => {
    localFilters = filters;
    _fetchRecords(1, filters, pageSize);
  };

  const onResetFilters = () => {
    localFilters = undefined;
    _fetchRecords(1, undefined, pageSize);
  };

  const drawerTitleComponent = (
    <>
      {`Request No. #${drawerTitle}`}
      <StatusTag
        status={currentStatus?.status as IWorkflowStatus}
        onStatusClick={handleStatusTagClick.bind(
          null,
          currentStatus?.id as number,
        )}
      />
    </>
  );
  return (
    <div className='draft-request-container'>
      <FilterBar
        isAddButton={false}
        filterView={setFilterVisible}
        canShare={true}
        viewConfig={{
          currentView: dataView,
          enableToggleView: true,
          onChangeView: (view: viewType) => setDataView(view),
        }}
      />
      <div style={{ marginBottom: 20 }}>
        <DataFilter
          page='SBMIT'
          source={source}
          includeLegalEntities
          includeStatusBar
          isVisible={isFilterVisible}
          includeDraftStatus={false}
          includeSaveFilterOption={true}
          includeItemNumber={true}
          item='request'
          onApplyFilters={onApplyFilters}
          onResetFilters={onResetFilters}
          initialFilters={editFilter}
          includeLastActionPriorToDate
          includePendingApprovalAtUserList
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
        className='request-detail-drawer  no-header-border'
      >
        <RequestDetails requestId={currentStatus?.id as number} />
      </AppDrawer>
      <Modal
        className='withdraw-modal'
        destroyOnClose={true}
        visible={withdrawModal.isModalVisible}
        onCancel={closeWithdrawConfirmation}
        getContainer='.submitted-container'
        okText='Withdraw'
        closable={false}
        onOk={withdrawHandler}
        width='600px'
        okButtonProps={{ disabled: withdrawReason.trim() === '' }}
      >
        <div className='ant-modal-confirm-body'>
          <Row gutter={12}>
            <Col flex='30px'>
              <ExclamationCircleOutlined
                style={{ color: '#faad14', fontSize: 22 }}
              />
            </Col>
            <Col className='ant-modal-confirm-title'>Confirm</Col>
          </Row>
          <div style={{ marginBottom: 12, marginLeft: 34 }}>
            Are you sure you want to withdraw?
          </div>
          <Row style={{ marginLeft: 34 }}>
            <Col flex='auto'>
              <Input
                placeholder='Enter reason for withdraw request'
                value={withdrawReason}
                onChange={e => setWithdrawReason(e.target.value)}
                onPressEnter={withdrawHandler}
                autoFocus
              />
            </Col>
          </Row>
        </div>
      </Modal>
    </div>
  );
};

const mapStateToProps = (state: any) => ({
  records: getSubmittedRequests(state),
  isLoading: getSubmittedLoader(state),
  success: getSubmittedSuccess(state),
  isPermissionAllowed: (permission: PROXY_PERMISSIONS) =>
    isProxyPermissionAllowed(state, permission),
  defaultView: getSubmittedDefaultView(state),
});

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  _fetchRecords: (
    page: number,
    filters?: any,
    pageSize?: number,
    status?: 'PENDNG' | 'APPRVD' | 'REJCTD',
  ) =>
    dispatch(fetchSubmittedTabData('request', page, filters, pageSize, status)),
  _fetchWorkFlowData: (props: IfetchWorkFlowDataProps) =>
    dispatch(fetchWorkFlowData(props)),
  _withdrawRequest: (
    id: number,
    remark: string,
    localFilters: any,
    pageSize?: number,
  ) => dispatch(withdrawRequest(id, remark, localFilters, pageSize)),
  _attachWorkflow: (id: number, localFilters: any) =>
    dispatch(attachRequestWorkflow(id, localFilters)),
  _deleteRecords: (ids: number[], _localFilters: any, pageSize?: number) =>
    dispatch(deleteRequests(ids, _localFilters, pageSize)),
  _setConfirmationInfo: (data: IConfirmationInfo) =>
    dispatch(setConfirmationInfo(data)),
  _resetConfirmationInfo: () => dispatch(resetConfirmationInfo()),
});

const connector = connect(mapStateToProps, mapDispatchToProps);
export default connector(memo(SubmittedRequest));
