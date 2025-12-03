/* eslint-disable react-hooks/exhaustive-deps */
import React, { Dispatch, useEffect, useState } from 'react';
import {
  HeaderBarWrapper,
  NoData,
  SkeletonItem,
  AppDrawer,
  DotMenu,
  StatusTag,
  Remarks,
  Amount,
  ErrorBoundary,
  ViolationDetails,
} from '../../../shared/components';
import './requestExpensesList.index.less';
import {
  getSubmittedLoader,
  getSubmittedLoadingMessage,
  getSubmittedRequestDetails,
  getSubmittedSuccess,
  getSubmittedError,
} from '../../../shared/redux/rootReducer';
import {
  fetchRequestDetailsById,
  deleteExpenseRequestById,
  sendExpenseForApproval,
  withdrawExpense,
  attachExpenseWorkflow,
} from '../submitted.thunk';
import { connect, ConnectedProps } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { message, Row, Col, Button, Skeleton, Modal, Input, Table } from 'antd';

import {
  PlusOutlined,
  EditOutlined,
  CopyOutlined,
  DeleteOutlined,
  EllipsisOutlined,
  ExportOutlined,
  RollbackOutlined,
  ExclamationCircleOutlined,
  PaperClipOutlined,
} from '@ant-design/icons';
import { RequestDetails } from '../components';
import { appPath } from '../../app/app.routes';
// import Table from 'antd/lib/table';
import { IWorkflowStatus } from '../../../shared/model';
import { Trans } from '@lingui/macro';
import {
  resetConfirmationInfo,
  setConfirmationInfo,
} from '../../app/app.actions';
import { setError, setSuccess } from '../../submitted/submitted.action';
import {
  IConfirmationInfo,
  IfetchWorkFlowDataProps,
} from '../../app/app.model';
import { actionBtnObjInterface } from '../../../shared/components/dotMenu/dotMenu.model';
import { fetchWorkFlowData } from '../../app/app.thunk';
import DocumentsViewer from '../../../shared/components/documentsViewer/documentsViewer.index';
import ClaimDetails from '../../addNewExpense/claimDetails/claimDetails.index';
import { renderViolationsBgClass } from '../../../utils/global.utils';
import WarningIconWithTooltip from '../../approvals/components/warningIconWithTooltip/warningIconWithTooltip.index';
import { getExpenseClaimViolationData } from '../../../services/expenseClaim';

// let editExpenseId;
const RequestExpensesList: React.FC<ConnectedProps<typeof connector>> = ({
  _fetchRequestDetails,
  _setError,
  _setSuccess,
  _resetConfirmationInfo,
  _deleteExpenseById,
  _setConfirmationInfo,
  _fetchWorkFlowData,
  _sendForApproval,
  _withdrawExpense,
  _attachWorkflow,
  isLoading,
  loadingMessage,
  requestDetails,
  error,
  success,
  tenantConfig,
  isEnableTrafficLightFeatureForTenantFeatures,
}) => {
  const history = useHistory();
  const params: any = useParams();
  const id = params.requestId;
  const [isItemExpanded, setItemExpanded] = useState<{
    visibility: boolean;
    item: null | any;
  }>({
    visibility: false,
    item: null,
  });
  const [isViolationModal, setIsViolationModal] = useState<{
    visibility: boolean;
    item: null | any;
  }>({
    visibility: false,
    item: null,
  });
  const [drawerTitle, setDrawerTitle] = useState('');
  const [currentStatus, setCurrentStatus] = useState<{
    status: {
      code: string;
      title: string;
    };
    id: number;
  } | null>(null);
  const [showFooter, setShowFooter] = useState<boolean>(false);

  useEffect(() => {
    _fetchRequestDetails(id);
  }, []);

  const onRemarkAdded = () => {
    // _fetchRequestDetails(id);
  };
  const openDetailsDrawer = (item: any) => {
    setItemExpanded({
      visibility: true,
      item: item,
    });
    setDrawerTitle(item.claim_number);
    setCurrentStatus({
      status: item.workflow_status,
      id: item.id,
    });
  };

  useEffect(() => {
    if (isLoading && loadingMessage) {
      message.loading(loadingMessage);
    } else {
      message.destroy();
      _setSuccess();
      _setError();
    }
  }, [isLoading, loadingMessage]);

  useEffect(() => {
    success && message.success(success, 2, _setSuccess);
    if (success && success.includes('withdraw')) {
      closeWithdrawConfirmation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [success]);

  useEffect(() => {
    error && message.error(error, 3, _setError);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  const addNewExpenseClick = () => {
    let path = appPath.submitted.expenses.addNew.linkTo;
    path = path.replace(':requestId', id);
    history.push(path);
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

  let routes = [
    { path: '', breadcrumbName: 'Request' },
    { path: '', breadcrumbName: requestDetails?.request_no },
  ];
  const [withdrawModal, setWithdrawModal] = useState({
    id: -1,
    isModalVisible: false,
  });
  const [withdrawReason, setWithdrawReason] = useState('');
  const closeWithdrawConfirmation = () => {
    setWithdrawModal({ id: -1, isModalVisible: false });
    setWithdrawReason('');
  };
  const editItem = (
    expenseId: string,
    category: 'General' | 'Entertainment' | 'Mileage' | 'Petty Cash',
    is_resubmission_case: boolean = false,
  ) => {
    let path = appPath.submitted.expenses.update.linkTo;
    path = path.replace(':requestId', id);
    history.push(
      `${path}${expenseId}/?type=${category}&is_resubmission_case=${is_resubmission_case ||
        false}`,
    );
  };

  const cloneItem = (
    expense_id: string,
    category: 'General' | 'Entertainment' | 'Mileage' | 'Petty Cash',
  ) => {
    let path = appPath.submitted.expenses.addNew.linkTo;
    path = path.replace(':requestId', id);
    history.push(path, {
      mode: 'clone',
      claimId: expense_id,
      category,
    });
  };

  const handleDeleteClick = (expenseId: number) => {
    _setConfirmationInfo({
      bodyText: 'Do you want to delete expense',
      cancelText: 'Cancel',
      okText: 'Delete',
      visibility: true,
      extraInfo: '',
      forWhat: '',
      headerText: 'Confirmation',
      cancelBtnFn: _resetConfirmationInfo,
      okBtnFn: () => {
        _deleteExpenseById(expenseId, id);
        _resetConfirmationInfo();
      },
    });
  };

  const showWithdrawConfirmation = (id: number) => {
    setWithdrawModal({ id, isModalVisible: true });
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
              setShowFooter(false);
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
              setShowFooter(false);
              setIsViolationModal({ visibility: true, item: record });
            }}
          />
        )}
      </small>
    );
  };
  const onClose = () => {
    setShowFooter(false);
    setIsViolationModal({ visibility: false, item: null });
  };

  const columns = [
    {
      dataIndex: 'claim_number',
      title: () => getElemOrSkeleton(<Trans>Expense ID</Trans>),
      fixed: 'left' as 'left',
      render: (val: string, row: any) =>
        isLoading ? (
          getElemOrSkeleton('')
        ) : (
          <Button type='link' onClick={() => openDetailsDrawer(row)}>
            {val}
          </Button>
        ),
    },
    {
      dataIndex: 'date',
      title: () => getElemOrSkeleton(<Trans>Date</Trans>),
      render: getElemOrSkeleton,
    },
    {
      dataIndex: 'expense_type_legal_entity',
      title: () => getElemOrSkeleton(<Trans>Expense Type</Trans>),
      render: (val: any, record: any) => (
        <>
          {getElemOrSkeleton(val?.expense_type?.title)}
          {tenantConfig[0]?.is_enabled_traffic_lights &&
            isEnableTrafficLightFeatureForTenantFeatures &&
            getViolationTitleWithIcons(record)}
        </>
      ),
    },
    {
      dataIndex: 'converted_amount_currency',
      title: () => getElemOrSkeleton(<Trans>Amount</Trans>),
      render: (val: any, item: any) =>
        isLoading ? (
          getElemOrSkeleton(val?.currency?.code)
        ) : (
          <Amount amount={item.converted_amount} currency={val} align='right' />
        ),
      align: 'center' as 'center',
    },
    {
      dataIndex: 'expense_type_legal_entity',
      title: () => getElemOrSkeleton(<Trans>Category</Trans>),
      render: (val: any) =>
        getElemOrSkeleton(val?.expense_type?.category.title),
    },
    {
      dataIndex: 'receipt',
      title: () => getElemOrSkeleton(<Trans>Receipt/s</Trans>),
      align: 'center' as 'center',
      render: (_val: any, item: any) =>
        isLoading ? (
          getElemOrSkeleton('')
        ) : (
          <>
            <DocumentsViewer
              documents={item.supporting_documents || []}
              itemType='expense'
              itemNumber={item.claim_number}
              receipt={item.receipt || null}
            />
          </>
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
      render: (val: any, item: any) =>
        isLoading ? (
          getElemOrSkeleton('')
        ) : (
          <StatusTag
            status={val}
            onStatusClick={() => {
              if (val?.title !== 'Drafted') handleStatusTagClick(item.id);
            }}
          />
        ),
    },
    {
      dataIndex: '',
      title: () => getElemOrSkeleton(<Trans>Action</Trans>),
      align: 'center' as 'center',
      fixed: 'right' as 'right',
      render: (_val: string, item: any) => {
        if (isLoading) return getElemOrSkeleton('');

        let actions: actionBtnObjInterface[] = [];

        if (
          item.is_allow_multiple_claims &&
          item?.expense_type_legal_entity?.expense_type?.category?.code !==
            'MIL' &&
          item?.expense_type_legal_entity?.expense_type?.category?.code !==
            'ALW' &&
          // item.workflow_status.title !== 'Rejected' &&
          item.workflow_status.title === 'Drafted'
        ) {
          actions.push({
            OnClick: cloneItem.bind(null, item?.id, item?.category),
            children: <Trans>Clone</Trans>,
            Type: 'default',
            icon: CopyOutlined,
            Disabled: requestDetails.is_request_expired,
          });
        }

        if (item.workflow_status.title === 'Drafted') {
          actions = actions.concat([
            {
              Type: 'default',
              icon: EditOutlined,
              children: <Trans>Edit</Trans>,
              OnClick: editItem.bind(
                null,
                item.id,
                item?.expense_type_legal_entity?.expense_type?.category?.title,
                // item?.category,
                item?.is_resubmission_case,
              ),
              Disabled: requestDetails.is_request_expired,
            },
            {
              children: <Trans>Delete</Trans>,
              Type: 'default',
              icon: DeleteOutlined,
              OnClick: handleDeleteClick.bind(null, item.id),
            },
            {
              children: <Trans>Send For Approval</Trans>,
              Type: 'link',
              icon: ExportOutlined,
              Disabled:
                (typeof item.is_submittable === 'boolean' &&
                  !item.is_submittable) ||
                requestDetails.is_request_expired,
              // OnClick: () => _sendForApproval([item.id], id),
              OnClick: async () => {
                if (
                  tenantConfig[0]?.is_enabled_traffic_lights &&
                  isEnableTrafficLightFeatureForTenantFeatures
                ) {
                  const responseViolations = await getExpenseClaimViolationData(
                    item.id,
                  );
                  const data = await responseViolations?.data;
                  if (
                    Object.keys(data).length === 0 ||
                    data?.flag_color === 'GRN' ||
                    !data?.violated_policy_details?.data?.some(
                      (item: any) => item?.is_show_flag_to_employee,
                    )
                  ) {
                    setIsViolationModal({ visibility: false, item: null });
                    await _sendForApproval([item.id], id);
                  } else {
                    setIsViolationModal({
                      visibility: true,
                      item,
                    });
                    setShowFooter(true);
                  }
                } else {
                  await _sendForApproval([item.id], id);
                }
              },
            },
          ]);
        } else {
          if (item.workflow_status.title === 'Rejected') {
            actions.push({
              Type: 'default',
              icon: EditOutlined,
              children: <Trans>Edit</Trans>,
              Disabled:
                typeof item?.is_editable === 'boolean' &&
                !item?.is_editable &&
                requestDetails.is_request_expired,
              OnClick: editItem.bind(
                null,
                item.id,
                item?.expense_type_legal_entity?.expense_type?.category?.title,
                // item?.category,
                item?.is_resubmission_case,
              ),
            });
            actions.push({
              Type: 'default',
              icon: DeleteOutlined,
              children: <Trans>Delete</Trans>,
              OnClick: handleDeleteClick.bind(null, item.id),
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
            item.workflow_steps_count === 0
          ) {
            actions.push({
              children: <Trans>Attach Workflow</Trans>,
              Type: 'default',
              icon: PaperClipOutlined,
              OnClick: () =>
                _attachWorkflow(item.id, (isSuccess: boolean) => {
                  if (isSuccess) _fetchRequestDetails(id);
                }),
            });
          }
        }

        return (
          <DotMenu
            actionBtn={actions}
            showInMenu
            dDDisabled={!Boolean(actions.length)}
          >
            <EllipsisOutlined />
          </DotMenu>
        );
      },
    },
  ];

  const closeDetailsDrawer = () => {
    setItemExpanded({
      visibility: false,
      item: null,
    });
    setDrawerTitle('');
    setCurrentStatus(null);
  };

  const handleStatusTagClick = (id: number) => {
    _fetchWorkFlowData({ id: id, type: 'expense' });
  };

  const drawerTitleComponent = (
    <>
      <Trans>Expense Claim No. #</Trans>
      {drawerTitle}
      <StatusTag
        status={currentStatus?.status as IWorkflowStatus}
        onStatusClick={() => {
          if (currentStatus?.status?.title !== 'Drafted')
            handleStatusTagClick(currentStatus?.id as number);
        }}
      />
    </>
  );

  const withdrawHandler = () => {
    try {
      if (withdrawReason.trim() === '') {
        return;
      }
      _withdrawExpense(withdrawModal.id, withdrawReason, id);
      setWithdrawModal({ id: -1, isModalVisible: false });
      setWithdrawReason('');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <HeaderBarWrapper
      breadcrumbCompVisibility={true}
      breadcrumbCompProps={{
        enableBackBtn: true,
        breadcrumProps: {
          routes,
        },
      }}
      headerCommonProps={{ title: <Trans>Submitted</Trans> }}
    >
      <div className='request-expense-listing'>
        <RequestDetails
          requestDetails={requestDetails}
          showRequestDetailDrawer={true}
        />
        {requestDetails?.workflow_status.code === 'APPRVD' ? (
          <Row justify='end'>
            <Col>
              <Button
                type='primary'
                className='add-new-button'
                onClick={addNewExpenseClick}
                disabled={
                  !requestDetails.can_claim_expense ||
                  requestDetails.is_request_expired
                }
              >
                <PlusOutlined style={{ fontSize: 12, marginRight: 6 }} />
                <Trans>Add Expenses</Trans>
              </Button>
            </Col>
          </Row>
        ) : (
          <div className='add-new-button' />
        )}
        {requestDetails &&
        requestDetails.num_of_expense_types_attached !== 0 ? (
          <Table
            bordered
            dataSource={requestDetails?.claims}
            columns={columns}
            pagination={false}
            scroll={{
              x: true,
            }}
            className='expense-claims-table'
            rowClassName={(record, rowIndex) => renderViolationsBgClass(record)}
          />
        ) : isLoading ? (
          <SkeletonItem type='Form' />
        ) : (
          <NoData />
        )}
      </div>
      <AppDrawer
        width='60%'
        visible={isItemExpanded.visibility}
        destroyOnClose={true}
        closable={true}
        onClose={closeDetailsDrawer}
        title={drawerTitleComponent}
        showCancelButton={false}
        showOkButton={false}
        getContainer='.request-expense-listing'
        className='expense-detail-drawer no-header-border'
      >
        <ErrorBoundary>
          <ClaimDetails claimId={isItemExpanded?.item?.id} isEmployee={true} />
        </ErrorBoundary>
      </AppDrawer>
      <Modal
        className='withdraw-modal'
        destroyOnClose={true}
        visible={withdrawModal.isModalVisible}
        onCancel={closeWithdrawConfirmation}
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
            <Trans>Are you sure you want to withdraw?</Trans>
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
          showFooter={showFooter}
          onClose={onClose}
          onSubmit={() => {
            _sendForApproval([isViolationModal?.item?.id], id);
            setIsViolationModal({ visibility: false, item: null });
          }}
        />
      )}
    </HeaderBarWrapper>
  );
};

const mapStateToProps = (state: any) => ({
  isLoading: getSubmittedLoader(state),
  loadingMessage: getSubmittedLoadingMessage(state),
  requestDetails: getSubmittedRequestDetails(state),
  success: getSubmittedSuccess(state),
  error: getSubmittedError(state),
  tenantConfig: state.configuration.tenantConfig,
  isEnableTrafficLightFeatureForTenantFeatures:
    state.configuration.isEnableTrafficLightFeatureForTenantFeatures,
});

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  _fetchRequestDetails: (id: string) => dispatch(fetchRequestDetailsById(id)),
  _setSuccess: () => dispatch(setSuccess('')),
  _setError: () => dispatch(setError('')),
  _resetConfirmationInfo: () => dispatch(resetConfirmationInfo()),
  _setConfirmationInfo: (data: IConfirmationInfo) =>
    dispatch(setConfirmationInfo(data)),
  _deleteExpenseById: (id: number, requestId: string) =>
    dispatch(deleteExpenseRequestById(id, requestId)),
  _fetchWorkFlowData: (props: IfetchWorkFlowDataProps) =>
    dispatch(fetchWorkFlowData(props)),
  _sendForApproval: (expenses: number[], requestId: string) =>
    dispatch(sendExpenseForApproval(expenses, requestId)),
  _withdrawExpense: (id: number, remark: string, requestId: string) =>
    dispatch(withdrawExpense(id, remark, requestId)),
  _attachWorkflow: (id: number, callback?: (isSuccess: boolean) => void) =>
    dispatch(attachExpenseWorkflow(id, callback)),
});

const connector = connect(mapStateToProps, mapDispatchToProps);

export default connector(RequestExpensesList);
