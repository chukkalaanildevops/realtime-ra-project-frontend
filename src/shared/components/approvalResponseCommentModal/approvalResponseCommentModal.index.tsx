import React, { Dispatch, useEffect, useState } from 'react';
import { Modal, Input, Skeleton } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { IApprovalResponseData } from '../../../pages/approvals/approvals.model';
import { IAdminDataRequestParameters } from '../../../pages/admin/admin.models';
import { Form } from 'antd';
import { Trans } from '@lingui/macro';
import { fetchExpenseClaimViolationData } from '../../../pages/addNewExpense/addNewExpense.thunk';
import { stateInterface } from '../../redux/rootReducer';
import { ConnectedProps, connect } from 'react-redux';
import WarningIconWithTooltip from '../../../pages/approvals/components/warningIconWithTooltip/warningIconWithTooltip.index';
import { saveExpenseClaimDataViolationData } from '../../../pages/addNewExpense/addNewExpense.actions';

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
const ApprovalResponseCommentModal: React.FC<ConnectedProps<
  typeof connector
> & {
  visible: boolean;
  action: string;
  responseData: IApprovalResponseData;
  onConfirmOk: (
    responseData: IApprovalResponseData,
    dataPageParameters?: IAdminDataRequestParameters,
  ) => void;
  setModalVisible: (isVisible: boolean) => void;
  dataPageParameters?: IAdminDataRequestParameters;
}> = props => {
  const {
    tenantConfig,
    isEnableTrafficLightFeatureForTenantFeatures,
    expenseClaimViolationFetchedData,
    responseData,
    expenseClaimViolationFetchedDataLoader,
    _fetchExpenseClaimViolationData,
    resetExpenseClaimViolationData,
  } = props;
  const [okButtonDisabled, setOkButtonDisabled] = useState(
    props.action === 'reject',
  );
  const [responseComment, setResponseComment] = useState<string | null>(null);
  useEffect(() => {
    resetExpenseClaimViolationData(null);
    if (
      tenantConfig[0]?.is_enabled_traffic_lights &&
      isEnableTrafficLightFeatureForTenantFeatures &&
      props.visible &&
      responseData?.expense_claim_ids &&
      ['ORA', 'RED'].includes(responseData?.flag_color_v2)
    ) {
      let claimsId = parseInt(responseData?.expense_claim_ids?.join(''));
      _fetchExpenseClaimViolationData(claimsId);
    }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.visible]);

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
        (responseData.isApprovalPage && item?.is_show_flag_to_approver) ||
        (responseData.isAdmin && item?.is_show_flag_to_finance_admin),
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
              (responseData.isApprovalPage && item?.is_show_flag_to_approver) ||
              (responseData.isAdmin && item?.is_show_flag_to_finance_admin),
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
                        responseData.isApprovalPage &&
                        item?.is_show_flag_to_approver
                      )
                        return (
                          <li key={item?.policy_id}>
                            {renderViolatedPolicy(item, 'approver')}
                          </li>
                        );
                      else if (
                        responseData.isAdmin &&
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
    <Modal
      width={600}
      centered={true}
      closable={false}
      visible={props.visible}
      cancelText='Cancel'
      okText='Save Response'
      destroyOnClose={true}
      className='single-item-response-modal'
      okButtonProps={{
        disabled: okButtonDisabled,
      }}
      onOk={() => {
        if (responseComment !== null && responseComment.length > 0) {
          props.responseData.response_comment = responseComment;
        }
        if (props.dataPageParameters !== undefined) {
          props.onConfirmOk(props.responseData, props.dataPageParameters);
        } else {
          props.onConfirmOk(props.responseData);
        }
        props.setModalVisible(false);
      }}
      onCancel={() => {
        props.setModalVisible(false);
      }}
      afterClose={() => {
        setResponseComment(null);
        setOkButtonDisabled(props.action === 'reject');
      }}
    >
      <div className='wrapper'>
        <div className='modal-header'>
          <ExclamationCircleOutlined
            style={{ color: '#faad14', fontSize: '22' }}
          />
          <span className='modal-title'>
            <Trans>Confirm</Trans>
          </span>
        </div>
        {tenantConfig[0]?.is_enabled_traffic_lights &&
          isEnableTrafficLightFeatureForTenantFeatures &&
          renderPolicyViolations()}
        <div className='field'>
          <div
            className={
              props.action === 'reject' ? 'required message' : 'message'
            }
          >
            <Trans>Remark</Trans>
          </div>
          <Form>
            <Form.Item
              name='remark'
              required={props.action === 'reject'}
              rules={[
                () => ({
                  validator(_, value) {
                    if (value !== undefined) {
                      value = value?.trim();
                    }

                    if (
                      (!value || value === undefined) &&
                      props.action === 'reject'
                    ) {
                      return Promise.reject('Remark is mandatory');
                    } else {
                      if (new RegExp(/^[^@!=\-+#﹘—⸺⸻].*$/).test(value)) {
                        return Promise.resolve();
                      }
                      if (!value || value === undefined) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error('Can not start with special character'),
                      );
                    }
                  },
                }),
              ]}
            >
              <Input
                placeholder='Remark/Comment'
                onChange={event => {
                  if (event.target.value !== undefined) {
                    if (
                      event.target.value.trim().length > 0 &&
                      new RegExp(/^[^@!=\-+#﹘—⸺⸻].*$/).test(
                        event.target.value.trim(),
                      )
                    ) {
                      setResponseComment(event.target.value);
                      setOkButtonDisabled(false);
                    } else {
                      setResponseComment(null);
                      if (props.action === 'reject') {
                        setOkButtonDisabled(true);
                      }
                      if (
                        props.action === 'approve' &&
                        !new RegExp(/^[^@!=\-+#﹘—⸺⸻].*$/).test(
                          event.target.value.trim(),
                        )
                      ) {
                        setOkButtonDisabled(true);
                      }
                      if (
                        props.action === 'approve' &&
                        event.target.value.trim().length === 0
                      ) {
                        setOkButtonDisabled(false);
                      }
                    }
                  }
                }}
              />
            </Form.Item>
          </Form>
        </div>
      </div>
    </Modal>
  );
};
const mapStateToProps = (state: stateInterface) => {
  const {
    expenseClaimViolationFetchedData,
    expenseClaimViolationFetchedDataLoader,
  } = state.AddNewExpenseForm;
  const {
    tenantConfig,
    isEnableTrafficLightFeatureForTenantFeatures,
  } = state.configuration;
  return {
    expenseClaimViolationFetchedData,
    expenseClaimViolationFetchedDataLoader,
    tenantConfig,
    isEnableTrafficLightFeatureForTenantFeatures,
  };
};
const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  return {
    _fetchExpenseClaimViolationData: (id: number) =>
      dispatch(fetchExpenseClaimViolationData(id)),
    resetExpenseClaimViolationData: (data: any) =>
      dispatch(saveExpenseClaimDataViolationData(data)),
  };
};
const connector = connect(mapStateToProps, mapDispatchToProps);

export default connector(ApprovalResponseCommentModal);
