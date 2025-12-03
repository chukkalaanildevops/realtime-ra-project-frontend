import React, { Dispatch, memo, useEffect, useState } from 'react';
import { Button, Col, Input, Modal, Pagination, Row, Skeleton } from 'antd';
import Table from 'antd/lib/table';
import { connect, ConnectedProps } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import {
  Amount,
  AppDrawer,
  Card,
  DataFilter,
  DotMenu,
  ElementOrSkeleton,
  ErrorBoundary,
  FilterBar,
  NoData,
  ReceiptViewer,
  Remarks,
  StatusTag,
} from '../../../../shared/components';
import { viewType } from '../../../../shared/components/filterBar/filterBar.model';
import {
  getSubmittedBenefits,
  getSubmittedDefaultView,
  getSubmittedLoader,
  getSubmittedSuccess,
} from '../../../../shared/redux/rootReducer';
import {
  IfetchWorkFlowDataProps,
  IConfirmationInfo,
} from '../../../app/app.model';
import { fetchWorkFlowData } from '../../../app/app.thunk';
import {
  fetchSubmittedTabData,
  withdrawBenefit,
  attachBenefitWorkflow,
  // withdrawExpense,
} from '../../submitted.thunk';
import {
  EditOutlined,
  EllipsisOutlined,
  ExclamationCircleOutlined,
  PaperClipOutlined,
  RollbackOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { actionBtnObjInterface } from '../../../../shared/components/dotMenu/dotMenu.model';
import { Trans } from '@lingui/macro';
import BenefitDetail from '../../../benefits/benefitDetail/benefitDetail.index';
import { IWorkflowStatus } from '../../../../shared/model';
import { appPath } from '../../../app/app.routes';
// import { resetToInitial } from '../../../benefits/store/benefit.action';
import { deleteBenefitByIdInSubmitted } from '../../../benefits/addNewBenefit.thunk';
import {
  resetConfirmationInfo,
  setConfirmationInfo,
} from '../../../app/app.actions';

const mapStateToProps = (state: any) => ({
  records: getSubmittedBenefits(state),
  isLoading: getSubmittedLoader(state),
  success: getSubmittedSuccess(state),
  defaultView: getSubmittedDefaultView(state),
});

// eslint-disable-next-line no-unused-vars
const mapDispatchToProps = (dispatch: Dispatch<any>, ownProps: any) => ({
  _fetchRecords: (
    page: number,
    filters?: any,
    pageSize?: number,
    status?: 'PENDNG' | 'APPRVD' | 'REJCTD',
  ) =>
    dispatch(fetchSubmittedTabData('benefit', page, filters, pageSize, status)),
  _fetchWorkFlowData: (props: IfetchWorkFlowDataProps) =>
    dispatch(fetchWorkFlowData(props)),
  _withdrawBenefit: (
    id: number,
    remark: string,
    localFilters: any,
    pageSize?: number,
  ) =>
    dispatch(
      withdrawBenefit(id, remark, undefined, 'benefit', localFilters, pageSize),
    ),
  _attachWorkflow: (id: number, callback?: (isSuccess: boolean) => void) =>
    dispatch(attachBenefitWorkflow(id, callback)),
  // _resetBenefitClaimForm: () => dispatch(resetToInitial()),
  _deleteBenefitById: (id: number, localFilters: any, pageSize?: number) =>
    dispatch(
      deleteBenefitByIdInSubmitted(id, 'benefit', localFilters, pageSize),
    ),
  _setConfirmationInfo: (data: IConfirmationInfo) =>
    dispatch(setConfirmationInfo(data)),
  _resetConfirmationInfo: () => dispatch(resetConfirmationInfo()),
});

let localFilters: any;
let initialPageSize = 12;

const SubmittedBenefit: React.FC<ConnectedProps<typeof connector> & {
  onSelectRow?: (list: any[]) => void;
  source?: any;
  type: 'benefit';
}> = ({
  //   type,
  defaultView,
  source,
  records,
  isLoading,
  //   success,
  _fetchRecords,
  _fetchWorkFlowData,
  _withdrawBenefit,
  _attachWorkflow,
  // _resetBenefitClaimForm,
  _deleteBenefitById,
  _setConfirmationInfo,
  _resetConfirmationInfo,
}) => {
  const history = useHistory();
  const location: any = useLocation();
  const locationState = location.state as any;
  // useState code
  const [editFilter, setEditFilter] = useState<any>(undefined);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [dataView, setDataView] = useState<viewType>(defaultView);
  const [isFilterVisible, setFilterVisible] = useState(false);
  const [isItemExpanded, setItemExpanded] = useState(false);
  const [drawerTitle, setDrawerTitle] = useState('');
  const [currentStatus, setCurrentStatus] = useState<{
    status: {
      code: string;
      title: string;
    };
    id: number;
  } | null>(null);
  const [withdrawModal, setWithdrawModal] = useState({
    id: -1,
    isModalVisible: false,
  });
  const [withdrawReason, setWithdrawReason] = useState('');

  // useState code end

  useEffect(() => {
    if (locationState && locationState.page && locationState.status) {
      setEditFilter({ state: (location.state as any)?.status });
      _fetchRecords(locationState.page, { status: locationState.status });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationState]);

  // Table column functions

  const editItem = (id: string, _item: any) => {
    history.push(`${appPath.benefit.update.linkTo}${id}`);
    // }${id}/?is_resubmission_case=${item?.is_resubmission_case || false}`,
  };

  const showWithdrawConfirmation = (id: number) => {
    setWithdrawModal({ id, isModalVisible: true });
  };

  const closeWithdrawConfirmation = () => {
    setWithdrawModal({ id: -1, isModalVisible: false });
    setWithdrawReason('');
  };

  const handleDeleteClick = (id: number, localFilters: any) => {
    _setConfirmationInfo({
      bodyText: 'Do you want to delete Benefit?',
      cancelText: 'Cancel',
      okText: 'Delete',
      visibility: true,
      extraInfo: '',
      forWhat: '',
      headerText: 'Confirmation',
      cancelBtnFn: _resetConfirmationInfo,
      okBtnFn: () => {
        _deleteBenefitById(id, localFilters, pageSize);
        _resetConfirmationInfo();
      },
    });
  };

  const withdrawHandler = () => {
    try {
      if (
        withdrawReason.trim() === '' ||
        !new RegExp(/^[^@!=\-+#﹘—⸺⸻].*$/).test(withdrawReason)
      ) {
        return;
      }
      _withdrawBenefit(
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

  // Table column functions end

  // column for table

  const actionBtn = (item: any) => {
    let actions: actionBtnObjInterface[] = [];
    if (item.workflow_status.code === 'REJCTD') {
      actions.push({
        Type: 'default',
        icon: EditOutlined,
        children: <Trans>Edit</Trans>,
        Disabled: typeof item.is_editable === 'boolean' && !item.is_editable,
        OnClick: editItem.bind(null, item.id),
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
      item.benefit_type_legal_entity?.benefit_type.has_approval_rule
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

  const onRemarkAdded = () => {
    // _fetchRecords(1);
  };

  // filter code
  const onApplyFilters = (filters: any) => {
    localFilters = filters;
    _fetchRecords(1, filters, pageSize);
  };

  const onResetFilters = () => {
    localFilters = undefined;
    _fetchRecords(1, undefined, pageSize);
  };

  // filter code end

  // drawer code

  const drawerTitleComponent = (
    <>
      {`Benefit Claim No. #${drawerTitle}`}
      <StatusTag
        status={currentStatus?.status as IWorkflowStatus}
        onStatusClick={() => handleStatusTagClick(currentStatus?.id as number)}
      />
    </>
  );

  const openDetailsDrawer = (item: any) => {
    setItemExpanded(true);
    setDrawerTitle(item.claim_number);
    setCurrentStatus({
      status: item.workflow_status,
      id: item.id,
    });
  };

  const closeDetailsDrawer = () => {
    setItemExpanded(false);
    setDrawerTitle('');
    // _resetBenefitClaimForm();
  };

  // drawer code end

  const handleStatusTagClick = (id: number, _type?: string) => {
    _fetchWorkFlowData({ id: id, type: 'benefit' });
  };

  const columns = [
    {
      dataIndex: 'claim_number',
      title: () => getElemOrSkeleton(<Trans>Benefit Claim ID</Trans>),
      fixed: 'left' as 'left',
      ellipsis: true,
      width: 170,
      render: (val: string, row: any) =>
        isLoading ? (
          getElemOrSkeleton('')
        ) : (
          <Button
            type='link'
            onClick={() => openDetailsDrawer(row)}
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
      dataIndex: 'benefit_type_legal_entity',
      title: () => getElemOrSkeleton(<Trans>Benefit Type</Trans>),
      ellipse: true,
      render: (value: any) =>
        isLoading ? getElemOrSkeleton('') : value.benefit_type.title,
    },
    // {
    //   dataIndex: 'expense_type_legal_entity',
    //   title: () => getElemOrSkeleton('Category'),
    //   render: (val: any) => getElemOrSkeleton(val?.expense_type.category.title),
    //   // width: 140,
    // },
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
              itemType='benefit-claim'
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
              itemType='benefit-claim'
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

  // column for table end

  const onChangePagination = (page: number, pageSize: number) => {
    _fetchRecords(
      page,
      localFilters,
      pageSize,
      locationState && locationState.status,
    );
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
              type={item.benefit_type_legal_entity.benefit_type.title}
              currency={{
                amount: item.converted_amount || '',
                currency: item?.converted_amount_currency?.currency?.code || '',
              }}
              category='benefit'
              onDetails={(_type: string) => openDetailsDrawer(item)}
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
                  itemType='benefit-claim'
                  itemNumber={item.claim_number}
                  count={item.total_attachments}
                />
              }
              cardType='benefit-claim'
              // expenseType='benefit'
              onRemarkAdded={onRemarkAdded}
            />
          </Col>
        ))}
      </Row>
    </div>
  );

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
                  goButton: <Button type='default'>Go</Button>,
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
    <ErrorBoundary>
      <div className='submitted-benefit-container'>
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
            item='benefit'
            initialFilters={editFilter}
            onApplyFilters={onApplyFilters}
            onResetFilters={onResetFilters}
            includeItemNumber={true}
            includeSettlementDate={true}
            includeForRequestNumber={false}
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
          getContainer='.submitted-benefit-container'
          className='benefit-detail-drawer no-header-border'
        >
          <BenefitDetail benefitClaimId={currentStatus?.id} isAdmin={true} />
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
          okButtonProps={{
            disabled:
              withdrawReason.trim() === '' ||
              !new RegExp(/^[^@!=\-+#﹘—⸺⸻].*$/).test(withdrawReason.trim()),
          }}
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
                  placeholder='Enter reason for withdraw Benefit'
                  value={withdrawReason}
                  onChange={e => setWithdrawReason(e.target.value)}
                  onPressEnter={withdrawHandler}
                  autoFocus
                />
                {withdrawReason.trim() !== '' &&
                  !new RegExp(/^[^@!=\-+#﹘—⸺⸻].*$/).test(
                    withdrawReason.trim(),
                  ) && (
                    <div className='withdraw-modal-error'>
                      'Special characters are not allowed.'
                    </div>
                  )}
              </Col>
            </Row>
          </div>
        </Modal>
      </div>
    </ErrorBoundary>
  );
};

const connector = connect(mapStateToProps, mapDispatchToProps);
export default connector(memo(SubmittedBenefit));
