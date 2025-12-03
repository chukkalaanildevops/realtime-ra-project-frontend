/* eslint-disable react-hooks/exhaustive-deps */
import React, { memo, useEffect, Dispatch } from 'react';
import { ModalProps } from 'antd/lib/modal';
import './violationDetails.index.less';
import { Button, Modal, Skeleton, Tooltip } from 'antd';
import { ErrorBoundary } from '..';
import { fetchExpenseClaimViolationData } from '../../../pages/addNewExpense/addNewExpense.thunk';
import { stateInterface } from '../../redux/rootReducer';
import { ConnectedProps, connect } from 'react-redux';
import WarningIconWithTooltip from '../../../pages/approvals/components/warningIconWithTooltip/warningIconWithTooltip.index';
import { saveExpenseClaimDataViolationData } from '../../../pages/addNewExpense/addNewExpense.actions';
import { ReactComponent as EnforcementIcon } from '../../../assets/images/default/enforcement-icon.svg';
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
type TProps = ConnectedProps<typeof connector> & {
  item?: any;
  visibility: boolean;
  isApprovalPage?: boolean;
  isAdmin?: boolean;
  isEmployee?: boolean;
  boldHeader?: boolean;
  isLoading?: boolean;
  modalProps?: ModalProps;
  onClose: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  // eslint-disable-next-line no-empty-pattern
  onSubmit?: ([]: any) => void;
  showFooter?: boolean;
  isAddExpense?: boolean;
};
const ViolationDetails: React.FC<TProps> = props => {
  const {
    expenseClaimViolationFetchedData,
    expenseClaimViolationFetchedDataLoader,
    _fetchExpenseClaimViolationData,
    _resetExpenseClaimViolationData,
    visibility,
    item,
    isApprovalPage = false,
    isAdmin = false,
    isEmployee = false,
    onClose,
    onSubmit,
    showFooter,
    expenseClaimViolationCheckerData,
    violationModalData,
    isAddExpense = false,
  } = props;

  useEffect(() => {
    _resetExpenseClaimViolationData(null);
    item && item?.id && _fetchExpenseClaimViolationData(item?.id);
  }, [item]);
  const riskContainerColor =
    expenseClaimViolationFetchedData?.flag_color === 'RED'
      ? 'border-color-red'
      : expenseClaimViolationFetchedData?.flag_color === 'ORA'
      ? 'border-color-orange'
      : 'border-color-black';
  const renderViolatedPolicy = (
    item: any,
    msgFlagKey: string,
    isEmployee: boolean = false,
  ) => {
    return (
      <div
        style={{
          display: 'flex',
          gap: '10px',
        }}
      >
        {item[`msg_for_${msgFlagKey}`]
          ? item[`msg_for_${msgFlagKey}`]
          : item?.policy_title}{' '}
        {item?.is_enforcement && item?.is_show_flag_to_employee && isEmployee && (
          <Tooltip
            title={'Mandatory Resolve'}
            overlayClassName='enforcement-tooltip-card'
            // color='ORANGE'
            key={item?.policy_id}
            placement='right'
          >
            <EnforcementIcon
              style={{
                display: 'inline-block',
                marginTop: '2px',
              }}
            />
          </Tooltip>
        )}
      </div>
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
      (isApprovalPage && item?.is_show_flag_to_approver) ||
      (isAdmin && item?.is_show_flag_to_finance_admin) ||
      (isEmployee && item?.is_show_flag_to_employee),
  )?.length;

  const getModalTitle = () => {
    let modalTitle: any;
    let modalSubTitle: any;
    if (expenseClaimViolationFetchedData?.expense_claim !== null) {
      // modalTitle =
      //   isAddExpense && !violationModalData?.isForAprovals
      //     ? 'Claim Draft'
      //     : showFooter
      //     ? 'Claim Submission'
      //     : 'Violations Details';
      modalTitle = showFooter
        ? 'Claim Submission'
        : 'Policy Violations Details';

      modalSubTitle = showFooter ? (
        <div>
          Are you sure you want to{' '}
          {isAddExpense && !violationModalData?.isForAprovals
            ? 'save'
            : 'submit'}
          {item?.claim_number && (
            <>
              {''} the {''}
              <strong>Expense Claim . #{item?.claim_number}</strong>
            </>
          )}
          {''} ?
        </div>
      ) : (
        <div>
          For Expense Claim . <strong>#{item?.claim_number}</strong>
        </div>
      );
    }
    if (modalTitle)
      return (
        <>
          <strong>{modalTitle}</strong>
          <div style={{ padding: '5px' }}>
            <small>{modalSubTitle}</small>
          </div>
        </>
      );
  };

  return (
    <ErrorBoundary>
      <Modal
        className='policy-violation-modal'
        title={
          <GetSkeletonOnLoading
            isLoading={expenseClaimViolationFetchedDataLoader}
          >
            {getModalTitle()}
          </GetSkeletonOnLoading>
        }
        visible={visibility}
        onCancel={onClose}
        centered={true}
        footer={null}
        destroyOnClose={true}
      >
        <GetSkeletonOnLoading
          isLoading={expenseClaimViolationFetchedDataLoader}
        >
          {expenseClaimViolationFetchedData?.flag_score > 0 &&
            expenseClaimViolationFetchedData?.violated_policy_details?.data?.some(
              (item: any) =>
                (isApprovalPage && item?.is_show_flag_to_approver) ||
                (isAdmin && item?.is_show_flag_to_finance_admin) ||
                (isEmployee && item?.is_show_flag_to_employee),
            ) && (
              <div
                className={`approval-risk-container ${riskContainerColor}`}
                data-testId='approval-risk-container'
              >
                <div className='approval-risk-container__risk-criteria-title-container'>
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
                        ? 'Risk Score : Low'
                        : 'Risk Score : High'}
                    </span>
                    &nbsp;-&nbsp;
                    <span className='approval-risk-container__risk-score-data'>
                      {expenseClaimViolationFetchedData.flag_score}%
                    </span>
                  </div>
                </div>
                <div className='approval-risk-container__risk-criteria'>
                  <ul>
                    {expenseClaimViolationFetchedData?.violated_policy_details?.data?.map(
                      (item: any) => {
                        if (isApprovalPage && item?.is_show_flag_to_approver)
                          return (
                            <li key={item?.policy_id}>
                              {renderViolatedPolicy(item, 'approver')}
                            </li>
                          );
                        else if (isAdmin && item?.is_show_flag_to_finance_admin)
                          return (
                            <li key={item?.policy_id}>
                              {renderViolatedPolicy(item, 'finance_admin')}
                            </li>
                          );
                        else if (isEmployee && item?.is_show_flag_to_employee)
                          return (
                            <li key={item?.policy_id}>
                              {renderViolatedPolicy(
                                item,
                                'employee',
                                isEmployee,
                              )}
                            </li>
                          );
                      },
                    )}
                  </ul>
                </div>
              </div>
            )}
          {isAddExpense &&
            expenseClaimViolationCheckerData?.length > 0 &&
            expenseClaimViolationCheckerData?.some(
              (item: any) => isEmployee && item?.is_show_flag_to_employee,
            ) && (
              <div
                className={`approval-risk-container ${riskContainerColor}`}
                data-testId='approval-risk-container'
              >
                <div className='approval-risk-container__risk-criteria-title-container'>
                  <div className='approval-risk-container__risk-criteria-title'>
                    {expenseClaimViolationCheckerData?.length}
                    {expenseClaimViolationCheckerData?.length > 1
                      ? ' Policies Violated :'
                      : ' Policy Violated :'}
                  </div>
                </div>
                <div className='approval-risk-container__risk-criteria'>
                  <ul>
                    {expenseClaimViolationCheckerData?.map((item: any) => {
                      if (isEmployee && item?.is_show_flag_to_employee)
                        return (
                          <li key={item?.policy_id}>
                            {renderViolatedPolicy(item, 'employee', isEmployee)}
                          </li>
                        );
                    })}
                  </ul>
                </div>
              </div>
            )}
          {expenseClaimViolationCheckerData?.some(
            (item: any) => item.is_enforcement,
          ) && (
            <div className='enforcement-wrapper'>
              {/* <span className='enforcement-icon'>
                <ExclamationCircleFilled />
              </span>{' '} */}
              <EnforcementIcon />
              You must resolve the mandatory violations before{' '}
              {isAddExpense && !violationModalData?.isForAprovals
                ? 'saving'
                : 'submitting'}{' '}
              the claim
            </div>
          )}

          {showFooter && (
            <div className='policy-violation-action-wrapper'>
              <div style={{ fontWeight: 600 }}>
                {/* Do you still want to submit? */}
              </div>
              <div>
                {!expenseClaimViolationCheckerData?.some(
                  (item: any) => item.is_enforcement,
                ) && (
                  <Button
                    shape='round'
                    style={{ margin: '4px', width: '90px' }}
                    onClick={onClose}
                  >
                    No
                  </Button>
                )}
                <Button
                  onClick={onSubmit}
                  type='primary'
                  shape='round'
                  style={{ margin: '4px', width: '90px' }}
                  disabled={expenseClaimViolationCheckerData?.some(
                    (item: any) => item.is_enforcement,
                  )}
                >
                  Yes
                </Button>
              </div>
            </div>
          )}
        </GetSkeletonOnLoading>
      </Modal>
    </ErrorBoundary>
  );
};
const mapStateToProps = (state: stateInterface) => {
  const {
    expenseClaimViolationFetchedData,
    expenseClaimViolationFetchedDataLoader,
    expenseClaimViolationCheckerData,
    violationModalData,
  } = state.AddNewExpenseForm;
  return {
    expenseClaimViolationFetchedData,
    expenseClaimViolationFetchedDataLoader,
    expenseClaimViolationCheckerData,
    violationModalData,
  };
};
const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  return {
    _fetchExpenseClaimViolationData: (id: number) =>
      dispatch(fetchExpenseClaimViolationData(id)),
    _resetExpenseClaimViolationData: (data: any) =>
      dispatch(saveExpenseClaimDataViolationData(data)),
  };
};
const connector = connect(mapStateToProps, mapDispatchToProps);
export default memo(connector(ViolationDetails));
