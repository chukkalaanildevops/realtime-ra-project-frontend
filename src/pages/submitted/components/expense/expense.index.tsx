/* eslint-disable react-hooks/exhaustive-deps */
import React, { Dispatch, useState, memo, useEffect } from 'react';
import {
  FilterBar,
  DotMenu,
  AppDrawer,
  NoData,
  Card,
  StatusTag,
  Remarks,
  Amount,
  DataFilter,
  ElementOrSkeleton,
  ErrorBoundary,
  ReceiptViewer,
  ViolationDetails,
} from '../../../../shared/components';
import {
  getSubmittedExpenses,
  getSubmittedLoader,
  getSubmittedSuccess,
  getSubmittedExpensesWithRequest,
  getSubmittedDefaultView,
} from '../../../../shared/redux/rootReducer';
import { connect, ConnectedProps } from 'react-redux';
import {
  Table,
  Pagination,
  Skeleton,
  Button,
  Row,
  Col,
  Input,
  Modal,
} from 'antd';
import {
  withdrawExpense,
  fetchSubmittedTabData,
  attachExpenseWorkflow,
  deleteExpenseById,
} from '../../submitted.thunk';
import { Trans } from '@lingui/macro';

import {
  EllipsisOutlined,
  RollbackOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  PaperClipOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { viewType } from '../../../../shared/components/filterBar/filterBar.model';
import { useHistory, useLocation } from 'react-router-dom';

import {
  setConfirmationInfo,
  resetConfirmationInfo,
} from '../../../app/app.actions';
import {
  IConfirmationInfo,
  IfetchWorkFlowDataProps,
} from '../../../app/app.model';
import { IWorkflowStatus } from '../../../../shared/model';
import { fetchWorkFlowData } from '../../../app/app.thunk';
import { actionBtnObjInterface } from '../../../../shared/components/dotMenu/dotMenu.model';
import { appPath } from '../../../app/app.routes';
import ClaimDetails from '../../../addNewExpense/claimDetails/claimDetails.index';
import RequestDetails from '../../../request/detail/requestDetail.index';
import WarningIconWithTooltip from '../../../approvals/components/warningIconWithTooltip/warningIconWithTooltip.index';
import { renderViolationsBgClass } from '../../../../utils/global.utils';
let localFilters: any;
let initialPageSize = 12;

const SubmittedExpense: React.FC<ConnectedProps<typeof connector> & {
  onSelectRow?: (list: any[]) => void;
  type: 'expense' | 'expenses_with_request';
  source: any;
}> = ({
  type,
  source,
  defaultView,
  records,
  isLoading,
  success,
  _fetchRecords,
  _fetchWorkFlowData,
  _withdrawExpense,
  _attachWorkflow,
  _deleteExpenseById,
  _setConfirmationInfo,
  _resetConfirmationInfo,
  tenantConfig,
  isEnableTrafficLightFeatureForTenantFeatures,
}) => {
  const [editFilter, setEditFilter] = useState<any>(undefined);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [isViolationModal, setIsViolationModal] = useState<{
    visibility: boolean;
    item: null | any;
  }>({
    visibility: false,
    item: null,
  });
  const [isItemExpanded, setItemExpanded] = useState<{
    visibility: boolean;
    item: null | any;
  }>({
    visibility: false,
    item: null,
  });
  const [drawerTitle, setDrawerTitle] = useState<{
    type: string;
    title: string;
  }>({ type: '', title: '' });
  const [dataView, setDataView] = useState<viewType>(defaultView);
  const [currentStatus, setCurrentStatus] = useState<{
    status: {
      code: string;
      title: string;
    };
    id: number;
  } | null>(null);

  const [requestDetailData, setRequestDetailData] = useState<{
    workflow_status: {
      code: string;
      title: string;
    };
    id: number;
    request_no: string;
  } | null>(null);

  const location: any = useLocation();
  const locationState = location.state as any;
  const history = useHistory();

  useEffect(() => {
    if (locationState && locationState.page && locationState.status) {
      setEditFilter({ status: (location.state as any)?.status });
      _fetchRecords(
        locationState.page,
        { status: locationState.status },
        source,
      );
    }
  }, [locationState]);

  const [withdrawReason, setWithdrawReason] = useState('');
  const [withdrawModal, setWithdrawModal] = useState({
    id: -1,
    isModalVisible: false,
  });

  const [isFilterVisible, setFilterVisible] = useState(false);

  const handleStatusTagClick = (id: number, _type?: string) => {
    const updatedType =
      _type === 'expenses_with_request' ? 'request' : 'expense';
    _fetchWorkFlowData({ id: id, type: updatedType });
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
      {drawerTitle?.type === 'expense'
        ? `Expense Claim No. #${drawerTitle?.title} `
        : `Request No. #${drawerTitle?.title} `}
      <StatusTag
        status={currentStatus?.status as IWorkflowStatus}
        onStatusClick={handleStatusTagClick.bind(
          null,
          currentStatus?.id as number,
          drawerTitle?.type as string,
        )}
      />
    </>
  );

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

  const handleDeleteClick = (id: number, localFilters: any) => {
    _setConfirmationInfo({
      bodyText: 'Do you want to delete expense?',
      cancelText: 'Cancel',
      okText: 'Delete',
      visibility: true,
      extraInfo: '',
      forWhat: '',
      headerText: 'Confirmation',
      cancelBtnFn: _resetConfirmationInfo,
      okBtnFn: () => {
        _deleteExpenseById(id, localFilters, pageSize);
        _resetConfirmationInfo();
      },
    });
  };

  const editItem = (id: string, item: any) => {
    let request_no = '';
    if (item.request) {
      request_no = `?request_id=${item.request.id}`;
    }
    history.push(`${appPath.addNewExpense.update.linkTo}${id}/${request_no}`);
  };

  const showWithdrawConfirmation = (id: number) => {
    setWithdrawModal({ id, isModalVisible: true });
  };

  const closeWithdrawConfirmation = () => {
    setWithdrawModal({ id: -1, isModalVisible: false });
    setWithdrawReason('');
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
      _withdrawExpense(
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

  const onRemarkAdded = () => {
    // _fetchRecords(1);
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
            <Card
              actions={actionBtn(item)}
              canSelectItem={false}
              title={item.date}
              code={item.claim_number}
              requestNumber={item?.request?.request_no}
              type={item.expense_type_legal_entity.expense_type.title}
              currency={{
                amount: item.converted_amount || '',
                currency: item?.converted_amount_currency?.currency?.code || '',
              }}
              category={
                item.expense_type_legal_entity?.expense_type.category.title
              }
              onDetails={(_type: string) => openDetailsDrawer(item, _type)}
              status={item?.workflow_status}
              handleStatusTagClick={handleStatusTagClick}
              id={item.id}
              hideMainAction={true}
              // actionText={
              //   type === 'expenses_with_request' ? item.request.request_no : ''
              // }
              // onMainAction={() => setRequestDetailData(item.request)}
              remarks={item.total_comments || 0}
              receipts={
                <ReceiptViewer
                  itemId={item.id}
                  itemType='expense-claims'
                  itemNumber={item.claim_number}
                  count={item.total_attachments}
                />
              }
              cardType='expense-claims'
              expenseType={type}
              onRemarkAdded={onRemarkAdded}
              backgroundClass={renderViolationsBgClass(item)}
              getViolationTitleWithIcons={
                tenantConfig[0]?.is_enabled_traffic_lights &&
                isEnableTrafficLightFeatureForTenantFeatures &&
                getViolationTitleWithIcons(item)
              }
            />
          </Col>
        ))}
      </Row>
    </div>
  );

  const openDetailsDrawer = (item: any, _type: string) => {
    setItemExpanded({
      visibility: true,
      item: item,
    });

    let claim_number = '';
    let workflow_status = { code: '', title: '' };
    let id = 0;

    if (_type === 'expense') {
      claim_number = item.claim_number;
      workflow_status = item.workflow_status;
      id = item.id;
    } else {
      claim_number = item.request.request_no;
      workflow_status = item.request.workflow_status;
      id = item.request.id;
    }
    setDrawerTitle({ type: _type, title: claim_number });
    setCurrentStatus({
      status: workflow_status,
      id: id,
    });
  };

  const closeDetailsDrawer = () => {
    setItemExpanded({
      visibility: false,
      item: null,
    });
    setDrawerTitle({ type: '', title: '' });
    setCurrentStatus(null);
  };

  const actionBtn = (item: any) => {
    let actions: actionBtnObjInterface[] = [];
    if (item.workflow_status.code === 'REJCTD') {
      actions.push({
        Type: 'default',
        icon: EditOutlined,
        children: <Trans>Edit</Trans>,
        Disabled: typeof item.is_editable === 'boolean' && !item.is_editable,
        OnClick: editItem.bind(null, item.id, item),
      });
      actions.push({
        Type: 'default',
        icon: DeleteOutlined,
        children: <Trans>Delete</Trans>,
        OnClick: handleDeleteClick.bind(null, item.id, localFilters),
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
      item.expense_type_legal_entity?.expense_type.has_approval_rule
    ) {
      actions.push({
        children: <Trans>Attach Workflow</Trans>,
        Type: 'default',
        icon: PaperClipOutlined,
        OnClick: () =>
          _attachWorkflow(item.id, (isSuccess: boolean) => {
            if (isSuccess)
              _fetchRecords(records?.current_page || 1, localFilters, pageSize);
          }),
      });
    }
    return actions;
  };

  const getViolationTitleWithIcons = (record: any) => {
    return (
      <small className='violationIcon-container'>
        {['ORA', 'RED'].includes(record?.flag_color_v2) && (
          <Trans>Policy Violations -</Trans>
        )}
        {record?.flag_color_v2 === 'ORA' && (
          <WarningIconWithTooltip
            filled={false}
            color='ORANGE'
            id={record.id}
            onIconClick={() => {
              setIsViolationModal({
                visibility: true,
                item: record,
              });
            }}
          />
        )}
        {record?.flag_color_v2 === 'RED' && (
          <WarningIconWithTooltip
            filled={false}
            color='RED'
            id={record.id}
            onIconClick={() => {
              setIsViolationModal({ visibility: true, item: record });
            }}
          />
        )}
      </small>
    );
  };
  const onClose = () => {
    setIsViolationModal({ visibility: false, item: null });
  };
  const columns = [
    {
      dataIndex: 'claim_number',
      title: () => getElemOrSkeleton(<Trans>Expense ID</Trans>),
      fixed: 'left' as 'left',
      ellipsis: true,
      width: 170,
      render: (val: string, row: any) =>
        isLoading ? (
          getElemOrSkeleton('')
        ) : (
          <Button
            type='link'
            onClick={() => openDetailsDrawer(row, 'expense')}
            className='no-pad _lr'
          >
            {val}
          </Button>
        ),
    },
    {
      dataIndex: 'date',
      title: () => getElemOrSkeleton(<Trans>Receipt Date</Trans>),
      render: getElemOrSkeleton,
      // width: 100,
    },
    {
      dataIndex: 'expense_type_legal_entity',
      title: () => getElemOrSkeleton(<Trans>Expense Type</Trans>),
      ellipse: true,
      width:
        tenantConfig[0]?.is_enabled_traffic_lights &&
        isEnableTrafficLightFeatureForTenantFeatures
          ? 170
          : 120,
      render: (value: any, record: any) => (
        <>
          {isLoading ? (
            getElemOrSkeleton('')
          ) : (
            <>
              {value.expense_type.title}
              {tenantConfig[0]?.is_enabled_traffic_lights &&
                isEnableTrafficLightFeatureForTenantFeatures &&
                getViolationTitleWithIcons(record)}
            </>
          )}
        </>
      ),
    },
    {
      dataIndex: 'expense_type_legal_entity',
      title: () => getElemOrSkeleton(<Trans>Category</Trans>),
      render: (val: any) => getElemOrSkeleton(val?.expense_type.category.title),
      // width: 140,
    },
    {
      dataIndex: 'converted_amount_currency',
      title: () => getElemOrSkeleton(<Trans>Amount</Trans>),
      // width: 140,
      render: (val: any, item: any) =>
        isLoading ? (
          getElemOrSkeleton(val?.currency?.code)
        ) : (
          <Amount
            amount={item.converted_amount}
            currency={val?.currency?.code}
            align='right'
          />
        ),
      align: 'center' as 'center',
    },
    {
      dataIndex: 'receipt',
      title: () => getElemOrSkeleton(<Trans>Receipt/s</Trans>),
      align: 'center' as 'center',
      // width: 90,
      render: (_val: any, item: any) =>
        isLoading ? (
          getElemOrSkeleton('')
        ) : (
          <>
            <ReceiptViewer
              itemId={item.id}
              itemType='expense-claims'
              itemNumber={item.claim_number}
              count={item.total_attachments}
            />
          </>
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
              itemType='expense-claims'
              onRemarkAdded={onRemarkAdded}
              item_no={item.claim_number}
            />
          </>
        ),
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
      fixed: 'right' as 'right',
      title: () => getElemOrSkeleton(<Trans>Action</Trans>),
      align: 'center' as 'center',
      render: (_val: string, item: any) => {
        if (isLoading) return getElemOrSkeleton('');
        else {
          return (
            <DotMenu actionBtn={actionBtn(item)} showInMenu={true}>
              <EllipsisOutlined />
            </DotMenu>
          );
        }
      },
    },
  ];

  if (type === 'expenses_with_request') {
    columns.unshift({
      dataIndex: 'request',
      title: () => getElemOrSkeleton(<Trans>Request ID</Trans>),
      fixed: 'left' as 'left',
      ellipsis: true,
      width: 170,
      render: (val: any) =>
        isLoading ? (
          getElemOrSkeleton('')
        ) : (
          <Button
            type='link'
            onClick={() =>
              setRequestDetailData({
                workflow_status: {
                  code: val.workflow_status.code,
                  title: val.workflow_status.title,
                },
                id: val.id,
                request_no: val.request_no,
              })
            }
            className='no-pad _lr'
          >
            {val?.request_no}
          </Button>
        ),
    });
  }

  const onChangePagination = (page: number, pageSize: number) => {
    _fetchRecords(
      page,
      localFilters,
      pageSize,
      locationState && locationState.status,
    );
  };

  const renderData = () => {
    return (
      <ElementOrSkeleton
        isLoading={isLoading}
        type={dataView === 'Card' ? 'cards' : 'table'}
        tableConfiguration={{ columns: 8, rows: 10 }}
        cardsConfiguration={{ numberOfCardsPerRow: 4, rows: 3 }}
      >
        {records && records.data.length > 0 ? (
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
                className='expense-claims-table'
                rowClassName={(record, rowIndex) =>
                  renderViolationsBgClass(record)
                }
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
                showSizeChanger={true}
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
                  goButton: (
                    <Button type='default'>
                      <Trans>Go</Trans>
                    </Button>
                  ),
                }}
              />
            </div>
          </>
        ) : (
          <NoData />
        )}
      </ElementOrSkeleton>
    );
  };
  return (
    <div className='draft-expense-container'>
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
          item={
            type === 'expenses_with_request'
              ? 'expenses_with_request'
              : 'expense'
          }
          initialFilters={editFilter}
          onApplyFilters={onApplyFilters}
          onResetFilters={onResetFilters}
          includeItemNumber={true}
          includeSettlementDate={true}
          includeForRequestNumber={type === 'expenses_with_request'}
          includeLastActionPriorToDate
          includePendingApprovalAtUserList
        />
      </div>
      {renderData()}
      <AppDrawer
        width={'70%'}
        visible={isItemExpanded.visibility}
        destroyOnClose={true}
        closable={true}
        onClose={closeDetailsDrawer}
        title={drawerTitleComponent}
        showCancelButton={false}
        showOkButton={false}
        getContainer='.draft-expense-container'
        className=' no-header-border'
      >
        <ErrorBoundary>
          {drawerTitle?.type === 'expense' ? (
            <ClaimDetails
              claimId={isItemExpanded?.item?.id}
              isEmployee={true}
            />
          ) : (
            <RequestDetails
              requestId={isItemExpanded?.item?.request?.id}
              isEmployee={true}
            />
          )}
        </ErrorBoundary>
      </AppDrawer>
      <AppDrawer
        visible={requestDetailData !== null}
        destroyOnClose={true}
        closable={true}
        onClose={() => setRequestDetailData(null)}
        title={
          <>
            {`Request No. #${requestDetailData?.request_no}`}
            <StatusTag
              status={requestDetailData?.workflow_status as IWorkflowStatus}
              onStatusClick={handleStatusTagClick.bind(
                null,
                requestDetailData?.id as number,
                'expenses_with_request',
              )}
            />
          </>
        }
        showCancelButton={false}
        showOkButton={false}
        width='80%'
        getContainer='.draft-expense-container'
        className='request-detail-drawer  no-header-border'
      >
        <RequestDetails
          requestId={requestDetailData?.id as number}
          isEmployee={true}
        />
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
      {isViolationModal?.visibility && (
        <ViolationDetails
          visibility={isViolationModal?.visibility}
          item={isViolationModal?.item}
          isEmployee={true}
          onClose={onClose}
        />
      )}
    </div>
  );
};

const mapStateToProps = (state: any, ownProps: any) => ({
  records:
    ownProps.type === 'expense'
      ? getSubmittedExpenses(state)
      : getSubmittedExpensesWithRequest(state),
  isLoading: getSubmittedLoader(state),
  success: getSubmittedSuccess(state),
  defaultView: getSubmittedDefaultView(state),
  tenantConfig: state.configuration.tenantConfig,
  isEnableTrafficLightFeatureForTenantFeatures:
    state.configuration.isEnableTrafficLightFeatureForTenantFeatures,
});

const mapDispatchToProps = (dispatch: Dispatch<any>, ownProps: any) => ({
  _fetchRecords: (
    page: number,
    filters?: any,
    pageSize?: number,
    status?: 'PENDNG' | 'APPRVD' | 'REJCTD',
    source?: any,
  ) =>
    dispatch(
      fetchSubmittedTabData(
        ownProps.type,
        page,
        filters,
        pageSize,
        status,
        source,
      ),
    ),
  _setConfirmationInfo: (data: IConfirmationInfo) =>
    dispatch(setConfirmationInfo(data)),
  _resetConfirmationInfo: () => dispatch(resetConfirmationInfo()),
  _fetchWorkFlowData: (props: IfetchWorkFlowDataProps) =>
    dispatch(fetchWorkFlowData(props)),
  _withdrawExpense: (
    id: number,
    remark: string,
    localFilters: any,
    pageSize?: number,
  ) =>
    dispatch(
      withdrawExpense(
        id,
        remark,
        undefined,
        ownProps.type,
        localFilters,
        pageSize,
      ),
    ),
  _attachWorkflow: (id: number, callback?: (isSuccess: boolean) => void) =>
    dispatch(attachExpenseWorkflow(id, callback)),
  _deleteExpenseById: (id: number, localFilters: any, pageSize?: number) =>
    dispatch(deleteExpenseById(id, ownProps.type, localFilters, pageSize)),
});

const connector = connect(mapStateToProps, mapDispatchToProps);
export default connector(memo(SubmittedExpense));
