import React from 'react';
import EmptyCards from './cardTypes/emptyCard/emptyCard';
import BenefitDraftCard from './cardTypes/draft/benefitDraftCard';
import ExpenseDraftCard from './cardTypes/draft/expenseDraftCard';
import RequestDraftCard from './cardTypes/draft/requestDraftCard';
import BenefitRejectedCard from './cardTypes/rejected/benefitRejectedCard';
import ExpenseRejectedCard from './cardTypes/rejected/expenseRejectedCard';
import RequestRejectedCard from './cardTypes/rejected/requestRejectedCard';
import BenefitApprovedCard from './cardTypes/approved/benefitApprovedCard';
import ExpenseApprovedCard from './cardTypes/approved/expenseApprovedCard';
import RequestApprovedCard from './cardTypes/approved/requestApprovedCard';
import PendingBenefitApprovals from './cardTypes/pendingApprovals/pendingBenefitApproval';
import PendingExpenseApprovals from './cardTypes/pendingApprovals/pendingExpenseApproval';
import PendingRequestApprovals from './cardTypes/pendingApprovals/PendingRequestApprovals';
import { generateQueryParamsString } from '../../../../utils/global.utils';
import moment from 'moment';

const CardComponent = (props: any) => {
  const {
    // variables //
    history,
    cardLoader,
    dashboardData,
    isBenefitEnabled,
    // functions //
    onAction,
    setApprovalModal,
    openDetailsDrawer,
    _fetchSpecificData,
    isPermissionAllowed,
    handleStatusTagClick,
    _sendExpensesForApproval,
    _sendRequestsForApproval,
    _sendBenefitForApproval,
    getViolationTitleWithIcons,
  } = props;

  const initialFilters = {
    page: 1,
    from_date: moment()
      .subtract(1, 'year')
      .format('DD/MM/YYYY'),
    to_date: moment()
      .add(1, 'year')
      .format('DD/MM/YYYY'),
    status: 'PENDNG',
  };

  let queryString = generateQueryParamsString(initialFilters);

  return (
    <>
      {/* pending Approvals */}

      <PendingExpenseApprovals
        history={history}
        dashboardData={dashboardData}
        cardLoader={cardLoader}
        onAction={onAction}
        setApprovalModal={setApprovalModal}
        openDetailsDrawer={openDetailsDrawer}
        _fetchSpecificData={_fetchSpecificData}
        queryString={queryString}
        getViolationTitleWithIcons={getViolationTitleWithIcons}
      />
      <PendingRequestApprovals
        history={history}
        dashboardData={dashboardData}
        cardLoader={cardLoader}
        onAction={onAction}
        setApprovalModal={setApprovalModal}
        openDetailsDrawer={openDetailsDrawer}
        _fetchSpecificData={_fetchSpecificData}
        queryString={queryString}
      />
      <PendingBenefitApprovals
        history={history}
        dashboardData={dashboardData}
        cardLoader={cardLoader}
        onAction={onAction}
        setApprovalModal={setApprovalModal}
        openDetailsDrawer={openDetailsDrawer}
        _fetchSpecificData={_fetchSpecificData}
        queryString={queryString}
      />

      {/* Drafts */}

      <ExpenseDraftCard
        history={history}
        cardLoader={cardLoader}
        dashboardData={dashboardData}
        onAction={onAction}
        openDetailsDrawer={openDetailsDrawer}
        _fetchSpecificData={_fetchSpecificData}
        _sendExpensesForApproval={_sendExpensesForApproval}
        getViolationTitleWithIcons={getViolationTitleWithIcons}
      />
      <RequestDraftCard
        history={history}
        cardLoader={cardLoader}
        dashboardData={dashboardData}
        onAction={onAction}
        openDetailsDrawer={openDetailsDrawer}
        _fetchSpecificData={_fetchSpecificData}
        _sendRequestsForApproval={_sendRequestsForApproval}
      />
      <BenefitDraftCard
        history={history}
        cardLoader={cardLoader}
        dashboardData={dashboardData}
        onAction={onAction}
        openDetailsDrawer={openDetailsDrawer}
        _fetchSpecificData={_fetchSpecificData}
        _sendBenefitForApproval={_sendBenefitForApproval}
      />

      {/* Approved */}

      <ExpenseApprovedCard
        history={history}
        dashboardData={dashboardData}
        cardLoader={cardLoader}
        onAction={onAction}
        openDetailsDrawer={openDetailsDrawer}
        _fetchSpecificData={_fetchSpecificData}
        handleStatusTagClick={handleStatusTagClick}
        getViolationTitleWithIcons={getViolationTitleWithIcons}
      />
      <RequestApprovedCard
        history={history}
        dashboardData={dashboardData}
        cardLoader={cardLoader}
        onAction={onAction}
        openDetailsDrawer={openDetailsDrawer}
        _fetchSpecificData={_fetchSpecificData}
        isPermissionAllowed={isPermissionAllowed}
        handleStatusTagClick={handleStatusTagClick}
      />
      <BenefitApprovedCard
        history={history}
        dashboardData={dashboardData}
        cardLoader={cardLoader}
        onAction={onAction}
        openDetailsDrawer={openDetailsDrawer}
        _fetchSpecificData={_fetchSpecificData}
        handleStatusTagClick={handleStatusTagClick}
      />

      {/* Rejected */}

      <ExpenseRejectedCard
        history={history}
        dashboardData={dashboardData}
        cardLoader={cardLoader}
        onAction={onAction}
        openDetailsDrawer={openDetailsDrawer}
        _fetchSpecificData={_fetchSpecificData}
        handleStatusTagClick={handleStatusTagClick}
        getViolationTitleWithIcons={getViolationTitleWithIcons}
      />
      <RequestRejectedCard
        history={history}
        dashboardData={dashboardData}
        cardLoader={cardLoader}
        onAction={onAction}
        openDetailsDrawer={openDetailsDrawer}
        _fetchSpecificData={_fetchSpecificData}
        handleStatusTagClick={handleStatusTagClick}
      />
      <BenefitRejectedCard
        history={history}
        dashboardData={dashboardData}
        cardLoader={cardLoader}
        onAction={onAction}
        openDetailsDrawer={openDetailsDrawer}
        _fetchSpecificData={_fetchSpecificData}
        handleStatusTagClick={handleStatusTagClick}
      />

      {/* Empty */}

      <EmptyCards
        dashboardData={dashboardData}
        isBenefitEnabled={isBenefitEnabled}
        cardLoader={cardLoader}
        isPermissionAllowed={isPermissionAllowed}
      />
    </>
  );
};

export default CardComponent;
