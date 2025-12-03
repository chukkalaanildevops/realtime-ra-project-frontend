/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-restricted-globals */
import React, { Dispatch, useEffect, useState } from 'react';
import { Row, Col, Typography, Input, message, Modal, Skeleton } from 'antd';
import { NavLink, useHistory } from 'react-router-dom';

import {
  LeftOutlined,
  RightOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import './dashboard.index.less';
import { connect, ConnectedProps } from 'react-redux';

import {
  getUser,
  getDashboardLoader,
  getDashboardLoadingMessage,
  getDashboardSuccess,
  getDashboardError,
  getDashboardLoadError,
  getIsBenefitEnabled,
  getCurrentDelegateUser,
  isProxyPermissionAllowed,
} from '../../shared/redux/rootReducer';
// import { LOCALIZATION } from '../../utils/types';

import {
  HeaderBarWrapper,
  StatusTag,
  AppDrawer,
  SearchBar,
  ViolationDetails,
} from '../../shared/components/';

import { TFetchSpecificDataTypes } from './dashboard.model';

import { sideScroll } from '../../utils/scroll.utils';
import {
  sendExpenseForApproval,
  sendRequestForApproval,
  sendBenefitForApproval,
  approveRejectItems,
  fetchSpecificData,
  fetchDashboardCardData,
} from './dashboard.thunk';
import { appPath } from '../app/app.routes';
import { setError, setSuccess, resetCardData } from './dashboard.actions';
import { fetchWorkFlowData } from '../app/app.thunk';
import { IWorkflowStatus } from '../../shared/model';
import RequestDetail from '../request/detail/requestDetail.index';
import BenefitDetail from '../benefits/benefitDetail/benefitDetail.index';
import ClaimDetails from '../addNewExpense/claimDetails/claimDetails.index';
import BrokenLink from '../../shared/components/brokenLink/brokenLink.index';
import { PROXY_PERMISSIONS } from '../delegate/delegate.model';
import { setDocumentTitle } from '../../utils/global.utils';
import {
  fetchExpenseClaimViolationData,
  fetchLoggedInUserInfo,
} from '../addNewExpense/addNewExpense.thunk';
import { saveUserData } from '../../shared/redux/auth/auth.actions';
import CardComponent from './components/cardComponents/cardComponent';
import { Trans } from '@lingui/macro';

import axios from 'axios';
import WarningIconWithTooltip from '../approvals/components/warningIconWithTooltip/warningIconWithTooltip.index';
import { saveExpenseClaimDataViolationData } from '../addNewExpense/addNewExpense.actions';
import { getExpenseClaimViolationData } from '../../services/expenseClaim';
const { Text, Title } = Typography;
let source: any = null;

const GetSkeletonOnLoading: React.FC<{
  isLoading: boolean;
  width?: string | number;
}> = props => {
  const { isLoading, width = '100%', children } = props;

  try {
    if (isLoading) {
      return <Skeleton.Input style={{ width: width }} size='small' active />;
    } else {
      return <>{children}</>;
    }
  } catch (error) {
    return <>{children}</>;
  }
};

const Dashboard: React.FC<ConnectedProps<typeof connector>> = ({
  cardData,
  cardLoader,
  userData,
  error,
  isLoading,
  loadingMessage,
  success,
  isBenefitEnabled,
  isDashboardDataLoadFailed,
  currentDelegateUserLoader,
  delegationUser,
  tenantConfig,
  isEnableTrafficLightFeatureForTenantFeatures,
  expenseClaimViolationFetchedData,
  expenseClaimViolationFetchedDataLoader,
  _fetchExpenseClaimViolationData,
  _resetExpenseClaimViolationData,
  isPermissionAllowed,
  _resetCardData,
  _fetchDashboardCardData,
  _fetchWorkFlowData,
  _fetchLoggedInUserInfo,
  _saveUserData,
  _sendExpensesForApproval,
  _sendRequestsForApproval,
  _sendBenefitForApproval,
  _setError,
  _setSuccess,
  _approveRejectItems,
  _fetchSpecificData,
}) => {
  // useStates //

  const history = useHistory();
  const [dashboardData, setDashboardData] = useState<any>({});
  const [remarkErrorMessage, setRemarkError] = useState(false);
  const [IsInitialLoad, setIsInitialLoad] = useState(true);
  const [currentCardIndex, setCurrentCardIndex] = useState<any>({});
  const [itemDetails, setItemDetails] = useState<
    | {
        itemId: number;
        itemNo: string;
        type: 'expense' | 'request' | 'benefit';
        status: IWorkflowStatus;
        isApprovalPage?: boolean;
        isAdmin?: boolean;
        isEmployee?: boolean;
      }
    | undefined
  >();
  const [approvalModal, setApprovalModal] = useState<{
    id: number;
    isModalVisible: boolean;
    type?: 'expense' | 'request' | 'expenses_with_request' | 'benefit';
    action?: 'approve' | 'reject';
    empId?: number;
    flag_color_v2?: string | undefined;
    isApprovalPage?: boolean;
    isAdmin?: boolean;
    isEmployee?: boolean;
  }>({ id: -1, isModalVisible: false });
  const [approvalMessage, setApprovalMessage] = useState('');

  const [isViolationModal, setIsViolationModal] = useState<{
    visibility: boolean;
    item: null | any;
    isApprovalPage?: boolean;
    isAdmin?: boolean;
    isEmployee?: boolean;
  }>({
    visibility: false,
    item: null,
    isApprovalPage: false,
    isAdmin: false,
    isEmployee: false,
  });
  const [showFooter, setShowFooter] = useState<boolean>(false);

  useEffect(() => {
    _resetExpenseClaimViolationData(null);
    if (
      (tenantConfig[0]?.is_enabled_traffic_lights &&
        isEnableTrafficLightFeatureForTenantFeatures &&
        approvalModal.isModalVisible &&
        approvalModal?.id &&
        approvalModal.flag_color_v2 === 'RED') ||
      approvalModal.flag_color_v2 === 'ORA'
    ) {
      let claimsId = approvalModal?.id;
      _fetchExpenseClaimViolationData(claimsId);
    }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [approvalModal.isModalVisible]);

  const setUserData = async () => {
    try {
      let _userInfo: any = await _fetchLoggedInUserInfo();
      _userInfo && _saveUserData(_userInfo);
    } catch (error) {
      console.error(error);
    }
  };
  const fetchAllData = (isTryAgain = false) => {
    const isExpenseAllowed = isPermissionAllowed('ACTION_EXPENSE');
    const isRequestApprovalAllowed = isPermissionAllowed(
      'ACTION_REQUEST_APPROVAL',
    );
    const isRequestAllowed = isPermissionAllowed('ACTION_REQUEST');
    const isBenefitAllowed = isPermissionAllowed('ACTION_BENEFIT');
    const isExpenseApprovalAllowed = isPermissionAllowed(
      'ACTION_EXPENSE_APPROVAL',
    );
    const isBenefitApprovalAllowed = isPermissionAllowed(
      'ACTION_BENEFIT_APPROVAL',
    );
    if (isBenefitEnabled) {
      if (isBenefitAllowed) {
        _fetchDashboardCardData('draftBenefit');
        _fetchDashboardCardData('approvedBenefit');
        _fetchDashboardCardData('rejectedBenefit');
      }
      if (isBenefitApprovalAllowed) {
        _fetchDashboardCardData('pendingBenefit');
      }
    }
    if (IsInitialLoad || isTryAgain) {
      if (isExpenseAllowed) {
        _fetchDashboardCardData('draftExpense');
        _fetchDashboardCardData('approvedExpense');
        _fetchDashboardCardData('rejectedClaims');
      }
      if (isExpenseApprovalAllowed) {
        _fetchDashboardCardData('pendingExpense');
      }
      if (isRequestAllowed) {
        _fetchDashboardCardData('draftRequest');
        _fetchDashboardCardData('approvedRequest');
        _fetchDashboardCardData('rejectedRequest');
      }
      if (isRequestApprovalAllowed) {
        _fetchDashboardCardData('pendingRequest');
      }
    }
    setIsInitialLoad(false);
  };
  ///  useEffects  ///

  useEffect(() => {
    Object.keys(cardData).forEach(key => {
      if (currentCardIndex[key]) {
        const firstHalf = cardData[key].data.slice(0, currentCardIndex[key]);
        const secondHalf = cardData[key].data.slice(
          currentCardIndex[key],
          cardData[key].length,
        );
        cardData[key].data = [...secondHalf, ...firstHalf];
      }
    });
    setDashboardData(cardData);
  }, [cardData]);

  useEffect(() => {
    let CancelToken = axios.CancelToken;
    source = CancelToken.source();
    setDocumentTitle(appPath.dashboard.title);
    setUserData();
  }, []);

  // UNMOUNT //
  useEffect(() => {
    return () => {
      source.cancel();
    };
  }, []);

  useEffect(() => {
    !currentDelegateUserLoader && fetchAllData();
  }, [delegationUser, isBenefitEnabled, currentDelegateUserLoader]);
  useEffect(() => {
    if (success) {
      message.success(success, 2, _setSuccess);
    }
    if (success?.includes('approved') || success?.includes('rejected')) {
      setApprovalMessage('');
      setApprovalModal({ id: -1, isModalVisible: false });
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      message.error(error, 2, _setError);
    }
  }, [error]);

  useEffect(() => {
    if (success) {
      if (isLoading && loadingMessage) {
        message.loading(loadingMessage, 0);
      } else {
        message.destroy();
      }
    }
  }, [isLoading, loadingMessage]);

  // functions //
  const closeWithdrawConfirmation = () => {
    setApprovalMessage('');
    setApprovalModal({
      id: -1,
      isModalVisible: false,
    });
  };

  const approvalHandler = () => {
    if (
      (approvalModal.action === 'reject' && approvalMessage.trim() === '') ||
      remarkErrorMessage
    ) {
      return;
    }

    let payload: any = {
      action: approvalModal!.action,
      item: approvalModal!.type,
      employee_ids: [approvalModal!.empId],
      response_comment: approvalMessage,
    };
    if (approvalModal.type === 'request') {
      payload.request_ids = [approvalModal.id];
    } else if (approvalModal.type === 'benefit') {
      payload.benefit_claim_ids = [approvalModal.id];
    } else {
      payload.expense_claim_ids = [approvalModal.id];
    }
    _approveRejectItems(payload);
    setApprovalMessage('');
    setApprovalModal({ id: -1, isModalVisible: false });
  };

  const drawerTitleComponent = itemDetails ? (
    <>
      {`${
        itemDetails?.type === 'request'
          ? 'Request No. #'
          : itemDetails?.type === 'benefit'
          ? 'Benefit No. #'
          : 'Expense No. #'
      } ${itemDetails?.itemNo}`}
      <StatusTag
        status={itemDetails!.status}
        onStatusClick={() =>
          handleStatusTagClick(itemDetails!.itemId, itemDetails!.type)
        }
      />
    </>
  ) : null;

  const handleStatusTagClick = (
    id: number,
    type: 'request' | 'expense' | 'benefit',
  ) => {
    _fetchWorkFlowData({ id, type });
  };

  const openDetailsDrawer = (
    item: any,
    type: 'request' | 'expense' | 'benefit',
  ) => {
    setItemDetails({
      itemId: item.id,
      itemNo: type === 'request' ? item.request_no : item.claim_number,
      status: item.workflow_status,
      type,
      isApprovalPage:
        tenantConfig[0]?.is_enabled_traffic_lights &&
        isEnableTrafficLightFeatureForTenantFeatures
          ? item.isApprovalPage
          : false,
      isAdmin:
        tenantConfig[0]?.is_enabled_traffic_lights &&
        isEnableTrafficLightFeatureForTenantFeatures
          ? item.isAdmin
          : false,
      isEmployee:
        tenantConfig[0]?.is_enabled_traffic_lights &&
        isEnableTrafficLightFeatureForTenantFeatures
          ? item.isEmployee
          : false,
    });
  };

  const onAction = (type: string, action: 'prev' | 'next') => {
    const data = dashboardData[type].data;
    let currentIndex = currentCardIndex[type] || 0;
    // //debugger;
    if (action === 'next') {
      currentIndex += 1;
      if (currentIndex >= data.length) {
        currentIndex = 0;
      }
      const current = data[0];
      const remData = data.slice(1, data.length);
      const newData = [...remData, current];
      setDashboardData((prev: any) => ({
        ...prev,
        [type]: { ...prev[type], data: newData },
      }));
    } else {
      currentIndex -= 1;
      if (currentIndex < 0) {
        currentIndex = data.length - 1;
      }
      //debugger;
      const first = data[data.length - 1];
      const remData = data.slice(0, data.length - 1);
      const newData = [first, ...remData];
      setDashboardData((prev: any) => ({
        ...prev,
        [type]: { ...prev[type], data: newData },
      }));
    }
    setCurrentCardIndex({
      ...currentCardIndex,
      [type]: currentIndex,
    });
  };

  const scrollTo = (direction: 'left' | 'right') => {
    const element = document.getElementsByClassName('actionable-cards')[0];
    sideScroll(element, direction, 25, 500, 20);
  };
  const getViolationTitleWithIcons = (record: any) => {
    return (
      <small className='violationIcon-container'>
        {/* {['ORA', 'RED'].includes(record?.flag_color_v2) && (
          <Trans id='Policy Violations -' />
        )} */}
        {record?.flag_color_v2 === 'ORA' && (
          <WarningIconWithTooltip
            filled={false}
            color='ORANGE'
            text={'Policy Violations'}
            id={record.id}
            onIconClick={() => {
              setShowFooter(false);
              setIsViolationModal({
                visibility: true,
                item: record,
                isApprovalPage: record.isApprovalPage,
                isAdmin: false,
                isEmployee: record.isEmployee,
              });
            }}
          />
        )}
        {record?.flag_color_v2 === 'RED' && (
          <WarningIconWithTooltip
            filled={false}
            color='RED'
            text={'Policy Violations'}
            id={record.id}
            onIconClick={() => {
              setShowFooter(false);
              setIsViolationModal({
                visibility: true,
                item: record,
                isApprovalPage: record.isApprovalPage,
                isAdmin: false,
                isEmployee: record.isEmployee,
              });
            }}
          />
        )}
      </small>
    );
  };
  const onClose = () => {
    setShowFooter(false);
    setIsViolationModal({
      visibility: false,
      item: null,
      isApprovalPage: false,
      isAdmin: false,
      isEmployee: false,
    });
  };
  // dashboardData.slice
  const renderDashboard = () => {
    if (isDashboardDataLoadFailed) {
      return (
        <BrokenLink
          onTryAgain={() => fetchAllData(true)}
          description='Failed to fetch data'
        />
      );
    }
    const sendExpensesForApproval = async (item: any) => {
      if (
        tenantConfig[0]?.is_enabled_traffic_lights &&
        isEnableTrafficLightFeatureForTenantFeatures
      ) {
        const responseViolations = await getExpenseClaimViolationData(item.id);
        const data = await responseViolations?.data;
        if (
          Object.keys(data).length === 0 ||
          data?.flag_color === 'GRN' ||
          !data?.violated_policy_details?.data?.some(
            (item: any) => item?.is_show_flag_to_employee,
          )
        ) {
          setIsViolationModal({ visibility: false, item: null });
          await _sendExpensesForApproval([item.id]);
        } else {
          setIsViolationModal({
            visibility: true,
            item,
            isEmployee: item.isEmployee,
          });
          setShowFooter(true);
        }
      } else {
        await _sendExpensesForApproval([item.id]);
      }
    };
    return (
      <div className='actionable-cards' data-testId='actionable-cards'>
        <>
          <CardComponent
            // variables //
            history={history}
            cardLoader={cardLoader}
            dashboardData={dashboardData}
            isBenefitEnabled={isBenefitEnabled}
            // functions //
            onAction={onAction}
            setApprovalModal={setApprovalModal}
            openDetailsDrawer={openDetailsDrawer}
            _fetchSpecificData={_fetchSpecificData}
            isPermissionAllowed={isPermissionAllowed}
            handleStatusTagClick={handleStatusTagClick}
            // _sendExpensesForApproval={_sendExpensesForApproval}
            _sendExpensesForApproval={sendExpensesForApproval}
            _sendRequestsForApproval={_sendRequestsForApproval}
            _sendBenefitForApproval={_sendBenefitForApproval}
            getViolationTitleWithIcons={
              tenantConfig[0]?.is_enabled_traffic_lights &&
              isEnableTrafficLightFeatureForTenantFeatures &&
              getViolationTitleWithIcons
            }
          />
        </>
        <div
          className='scroller right'
          onClick={() => scrollTo('right')}
          data-testId='scroll-right'
        >
          <RightOutlined />
        </div>
        <div
          className='scroller left'
          onClick={() => scrollTo('left')}
          data-testId='scroll-left'
        >
          <LeftOutlined />
        </div>
      </div>
    );
  };

  const closeDetailsDrawer = () => {
    setItemDetails(undefined);
  };

  const isDelegateUserLoginUser = !Boolean(delegationUser);

  let userName = '';
  if (isDelegateUserLoginUser) {
    if (userData?.first_name !== null) {
      userName = userData?.first_name;
    } else if (userData?.legal_name !== null) {
      userName = userData?.legal_name;
      if (userName) {
        userName = userName.split(' ')[0];
      }
    } else {
      userName = userData?.name;
      userName = userName.split(' ')[0];
    }
  } else {
    if (delegationUser?.on_behalf_of?.first_name !== null) {
      userName = delegationUser?.on_behalf_of?.first_name;
    } else if (delegationUser?.on_behalf_of?.legal_name !== null) {
      userName = delegationUser?.on_behalf_of?.legal_name;
      userName = userName.split(' ')[0];
    } else {
      userName = delegationUser?.on_behalf_of?.name;
      userName = userName.split(' ')[0];
    }
  }

  const renderPolicyViolations = () => {
    const riskContainerColor =
      expenseClaimViolationFetchedData?.flag_color === 'RED'
        ? 'border-color-red'
        : expenseClaimViolationFetchedData?.flag_color === 'ORA'
        ? 'border-color-orange'
        : '';
    const renderViolatedPolicy = (item: any, msgFlagKey: string) => {
      return (
        <>
          {item[`msg_for_${msgFlagKey}`]
            ? item[`msg_for_${msgFlagKey}`]
            : item?.policy_title}
        </>
      );
    };
    const riskScoreValue =
      expenseClaimViolationFetchedData?.flag_color === 'ORA'
        ? 'ORANGE'
        : expenseClaimViolationFetchedData?.flag_color === 'RED'
        ? 'RED'
        : '';

    const violatedPoliciesLength = expenseClaimViolationFetchedData?.violated_policy_details?.data?.filter(
      (item: any) =>
        (approvalModal.isApprovalPage && item?.is_show_flag_to_approver) ||
        (approvalModal.isAdmin && item?.is_show_flag_to_finance_admin),
    )?.length;
    let displayRiskContainer = ['RED', 'ORA'].includes(
      expenseClaimViolationFetchedData?.flag_color,
    );

    return (
      <GetSkeletonOnLoading isLoading={expenseClaimViolationFetchedDataLoader}>
        {displayRiskContainer &&
          expenseClaimViolationFetchedData?.flag_score > 0 &&
          expenseClaimViolationFetchedData?.violated_policy_details?.data?.some(
            (item: any) =>
              (approvalModal.isApprovalPage &&
                item?.is_show_flag_to_approver) ||
              (approvalModal.isAdmin && item?.is_show_flag_to_finance_admin),
          ) && (
            <div
              className={`approval-risk-container ${riskContainerColor}`}
              data-testId='approval-risk-container'
            >
              {' '}
              <div className='approval-risk-container__risk-criteria-title'>
                {violatedPoliciesLength}
                {violatedPoliciesLength > 1
                  ? ' Policies Violated :'
                  : ' Policy Violated :'}
              </div>
              <div
                className={`approval-risk-container__risk-score ${
                  riskScoreValue === 'ORANGE' ? 'color-orange' : 'color-red'
                }`}
              >
                <WarningIconWithTooltip
                  filled={false}
                  color={riskScoreValue}
                  id={'1'}
                />
                <span className='approval-risk-container__risk-score-title'>
                  {riskScoreValue === 'ORANGE'
                    ? 'Low Risk Score'
                    : 'High Risk Score'}
                </span>
                :&nbsp;
                <span className='approval-risk-container__risk-score-data'>
                  {expenseClaimViolationFetchedData.flag_score}%
                </span>
              </div>
              <div className='approval-risk-container__risk-criteria'>
                <ul>
                  {expenseClaimViolationFetchedData?.violated_policy_details?.data?.map(
                    (item: any) => {
                      if (
                        approvalModal.isApprovalPage &&
                        item?.is_show_flag_to_approver
                      )
                        return (
                          <li key={item?.policy_id}>
                            {renderViolatedPolicy(item, 'approver')}
                          </li>
                        );
                      else if (
                        approvalModal.isAdmin &&
                        item?.is_show_flag_to_finance_admin
                      )
                        return (
                          <li key={item?.policy_id}>
                            {renderViolatedPolicy(item, 'finance_admin')}
                          </li>
                        );
                    },
                  )}
                </ul>
              </div>
            </div>
          )}
      </GetSkeletonOnLoading>
    );
  };

  return (
    <HeaderBarWrapper
      hideHeaderCommon={true}
      showOnlyLocal={true}
      containerStyle={{ padding: 0, marginTop: 0 }}
      headerCommonProps={{ title: '' }}
    >
      <div className='dashboard'>
        <div className='search-box-container'>
          <Title level={2} className='user-name'>
            <NavLink to={appPath.profile.linkTo}>Hi, {userName || ''}</NavLink>
          </Title>
          <div className='search-box'>
            <SearchBar placement='topCenter' />
          </div>
        </div>
        <div className='actions'>
          <div className='header'>
            <Text className='text'>
              <Trans>Quick Action Items</Trans>
            </Text>
          </div>
          {/* <SmileOutlined className="smileIcon" /> */}
          <div className='actionable-cards-container'>{renderDashboard()}</div>
        </div>
      </div>
      <AppDrawer
        visible={Boolean(itemDetails)}
        destroyOnClose={true}
        closable={true}
        onClose={closeDetailsDrawer}
        title={drawerTitleComponent}
        showCancelButton={false}
        showOkButton={false}
        width='60%'
        getContainer='.dashboard'
        className='no-header-border'
      >
        {itemDetails?.type === 'expense' ? (
          <ClaimDetails
            claimId={itemDetails.itemId}
            isEmployee={itemDetails.isEmployee}
            isApprovalPage={itemDetails.isApprovalPage}
            isAdmin={itemDetails.isAdmin}
          />
        ) : itemDetails?.type === 'benefit' ? (
          <BenefitDetail benefitClaimId={itemDetails?.itemId} isAdmin={true} />
        ) : (
          itemDetails?.type === 'request' && (
            <RequestDetail requestId={itemDetails?.itemId} />
          )
        )}
      </AppDrawer>
      <Modal
        className='approval-modal'
        destroyOnClose={true}
        visible={approvalModal.isModalVisible}
        onCancel={closeWithdrawConfirmation}
        okText='Save Response'
        closable={false}
        onOk={approvalHandler}
        width='600px'
        okButtonProps={{
          disabled:
            (approvalModal.action === 'reject' &&
              approvalMessage.trim() === '') ||
            remarkErrorMessage,
        }}
      >
        <div className='ant-modal-confirm-body'>
          <Row gutter={12} style={{ marginBottom: '12px' }}>
            <Col flex='30px'>
              <ExclamationCircleOutlined
                style={{ color: '#faad14', fontSize: 22 }}
              />
            </Col>
            <Col className='ant-modal-confirm-title'>
              <Trans>Confirm</Trans>
            </Col>
          </Row>
          {tenantConfig[0]?.is_enabled_traffic_lights &&
            isEnableTrafficLightFeatureForTenantFeatures &&
            renderPolicyViolations()}
          <div style={{ marginBottom: 12 }}>
            <Trans id='Remark' />
          </div>
          <Row>
            <Col flex='auto'>
              <Input
                placeholder='Remark/Comment'
                value={approvalMessage}
                onChange={e => {
                  let value = e.target.value.trim();
                  if (value.length > 0) {
                    if (new RegExp(/^[^@!=\-+#﹘—⸺⸻].*$/).test(value)) {
                      setRemarkError(false);
                    } else {
                      setRemarkError(true);
                    }
                  } else {
                    setRemarkError(false);
                  }
                  setApprovalMessage(e.target.value);
                }}
                onPressEnter={approvalHandler}
                autoFocus
              />
              {remarkErrorMessage && approvalMessage.length > 0 && (
                <div className='confirm-error-modal'>
                  Can not start with special character
                </div>
              )}
            </Col>
          </Row>
        </div>
      </Modal>
      {isViolationModal?.visibility && (
        <ViolationDetails
          visibility={isViolationModal?.visibility}
          item={isViolationModal?.item}
          isApprovalPage={isViolationModal.isApprovalPage}
          isAdmin={isViolationModal.isAdmin}
          isEmployee={isViolationModal.isEmployee}
          showFooter={showFooter}
          onClose={onClose}
          onSubmit={() => {
            _sendExpensesForApproval([isViolationModal?.item?.id]);
            setIsViolationModal({ visibility: false, item: null });
          }}
        />
      )}
    </HeaderBarWrapper>
  );
};

const mapStateToProps = (state: any) => {
  const { cardData, cardLoader } = state.dashboard;
  const { currentDelegateUserLoader } = state.delegates;
  const {
    tenantConfig,
    isEnableTrafficLightFeatureForTenantFeatures,
  } = state.configuration;
  const {
    expenseClaimViolationFetchedData,
    expenseClaimViolationFetchedDataLoader,
  } = state.AddNewExpenseForm;
  return {
    cardData,
    cardLoader,
    userData: getUser(state),
    currentDelegateUserLoader,
    isLoading: getDashboardLoader(state),
    loadingMessage: getDashboardLoadingMessage(state),
    success: getDashboardSuccess(state),
    error: getDashboardError(state),
    isDashboardDataLoadFailed: getDashboardLoadError(state),
    isBenefitEnabled: getIsBenefitEnabled(state),
    delegationUser: getCurrentDelegateUser(state),
    isPermissionAllowed: (permission: PROXY_PERMISSIONS) =>
      isProxyPermissionAllowed(state, permission),
    tenantConfig,
    isEnableTrafficLightFeatureForTenantFeatures,
    expenseClaimViolationFetchedData,
    expenseClaimViolationFetchedDataLoader,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  // _setCancelToken: (cancleToken: any) => dispatch(setCancelToken(cancleToken)),
  _fetchDashboardCardData: (type: any) =>
    dispatch(fetchDashboardCardData(type, source)),
  _resetCardData: () => dispatch(resetCardData()),
  _fetchWorkFlowData: (props: any) => dispatch(fetchWorkFlowData(props)),
  _sendExpensesForApproval: (expenses: number[]) =>
    dispatch(sendExpenseForApproval(expenses)),
  _sendRequestsForApproval: (requests: number[]) =>
    dispatch(sendRequestForApproval(requests)),
  _sendBenefitForApproval: (benefit: number[]) =>
    dispatch(sendBenefitForApproval(benefit)),
  _setSuccess: () => dispatch(setSuccess('')),
  _setError: () => dispatch(setError('')),
  _approveRejectItems: (data: any) => dispatch(approveRejectItems(data)),
  _fetchSpecificData: (data: TFetchSpecificDataTypes) =>
    dispatch(fetchSpecificData(data)),
  _fetchLoggedInUserInfo: () => dispatch(fetchLoggedInUserInfo()),
  _saveUserData: (userData: any) => dispatch(saveUserData(userData)),
  _fetchExpenseClaimViolationData: (id: number) =>
    dispatch(fetchExpenseClaimViolationData(id)),
  _resetExpenseClaimViolationData: (data: any) =>
    dispatch(saveExpenseClaimDataViolationData(data)),
});

const connector = connect(mapStateToProps, mapDispatchToProps);
export default connector(Dashboard);
