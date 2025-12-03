/* eslint-disable no-unused-vars */
import React, { FC, memo, Dispatch, useEffect } from 'react';

import { connect, ConnectedProps } from 'react-redux';
import {
  // getConfigurationSuccessMessage,
  stateInterface,
} from '../../../shared/redux/rootReducer';

import { message, Row, Col, Form, Tooltip } from 'antd';

import { ErrorBoundary } from '../../../shared/components/';

import { GetSkeleton } from '../components/';
import {
  GeneralFields,
  EntertainmentFields,
  CustomFields,
  ReceiptSupportingDocFields,
  MileageFields,
  PettyCashFields,
  AllowanceFields,
} from './components';

import {
  fetchExpenseClaimData,
  fetchDetailConfiguration,
  fetchExpenseClaimViolationData,
} from '../addNewExpense.thunk';
import {
  resetToInitial,
  apiCallReset,
  setUpdateId,
  saveConfiguration,
  updateTabKey,
} from '../addNewExpense.actions';

import { saveConfigurationForAllowance } from '../components/allowanceNew/allowanceNew.actions';

import './claimDetails.index.less';
import { delay } from 'lodash';
import { FormProps } from 'antd/lib/form';
import { TactiveTabKey } from '../addNewExpense.model';
import {
  allowanceRecordsTableListUpdate,
  fetchDetailConfigurationForAllowance,
} from '../components/allowanceNew/allowanceNew.thunk';
import { resetToAllowanceInitial } from '../components/allowanceNew/allowanceNew.actions';
import { ReactComponent as EnforcementIcon } from '../../../assets/images/default/enforcement-icon.svg';

const mapStateToProps = (state: stateInterface) => {
  const {
    expenseClaimFetchedData,
    activeTabKey,
    configuration,
    error,
    info,
    success,
    isLoading,
    expenseClaimViolationFetchedData,
  } = state.AddNewExpenseForm;
  const {
    tenantConfig,
    isEnableTrafficLightFeatureForTenantFeatures,
  } = state.configuration;

  const {
    allowanceConfiguration,
    expenseClaimFetchedDataAllowance,
    formDataAllowance,
  } = state.AllowanceNewReducer;

  return {
    expenseClaimFetchedData,
    activeTabKey,
    configuration,
    tenantConfig,
    error,
    info,
    success,
    isLoading,
    allowanceConfiguration,
    expenseClaimFetchedDataAllowance,
    formDataAllowance,
    isEnableTrafficLightFeatureForTenantFeatures,
    expenseClaimViolationFetchedData,
  };
};
const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  return {
    _updateTabKey: (key: TactiveTabKey) => dispatch(updateTabKey(key)),
    _resetToInitial: () => dispatch(resetToInitial()),
    _resetToInitialAllowance: () => dispatch(resetToAllowanceInitial()),
    _apiCallReset: () => dispatch(apiCallReset()),
    _setUpdateId: (id: number | null) => dispatch(setUpdateId(id)),
    _fetchExpenseClaimData: (id: number, callback?: Function) =>
      dispatch(fetchExpenseClaimData(id, callback)),
    _fetchDetailConfiguration: (id: number, callback?: Function) =>
      dispatch(fetchDetailConfiguration(id, callback)),
    _saveConfiguration: (configuration: any) =>
      dispatch(saveConfiguration(configuration)),
    _saveConfigurationForAllowance: (configuration: any) =>
      dispatch(saveConfigurationForAllowance(configuration)),
    _fetchDetailConfigurationForAllowance: (id: number, callback?: Function) =>
      dispatch(fetchDetailConfigurationForAllowance(id, callback)),
    _allowanceRecordsTableListUpdateMode: (id?: any) =>
      dispatch(allowanceRecordsTableListUpdate(id)),
    _fetchExpenseClaimViolationData: (id: number) =>
      dispatch(fetchExpenseClaimViolationData(id)),
  };
};

const connector = connect(mapStateToProps, mapDispatchToProps);
const rowGutter: [number, number] = [24, 24];

type TProps = ConnectedProps<typeof connector> & {
  claimId: number | null;
  isApprovalPage?: any;
  isCreatedByVisible?: boolean;
  isAdmin?: boolean;
  isEmployee?: boolean;
  _configuration?: any;
};

const ClaimDetails: FC<TProps> = props => {
  const {
    isAdmin = false,
    activeTabKey,
    claimId,
    isApprovalPage = false,
    isEmployee = false,
    info,
    success,
    tenantConfig,
    error,
    isCreatedByVisible = false,
    expenseClaimFetchedData,
    _configuration,
    configuration,
    isEnableTrafficLightFeatureForTenantFeatures,
    expenseClaimViolationFetchedData,
    isLoading,
    _resetToInitial,
    _resetToInitialAllowance,
    _apiCallReset,
    _setUpdateId,
    _fetchExpenseClaimData,
    _fetchExpenseClaimViolationData,
    _fetchDetailConfiguration,
    _saveConfiguration,
    _updateTabKey,
    expenseClaimFetchedDataAllowance,
    allowanceConfiguration,
    _fetchDetailConfigurationForAllowance,
    _allowanceRecordsTableListUpdateMode,
    formDataAllowance,
    _saveConfigurationForAllowance,
  } = props;
  const isUseForFormPreview = Boolean(_configuration);
  const [form] = Form.useForm();

  useEffect(() => {
    if (isUseForFormPreview) {
      const categ: string = String(_configuration?.category?.title);
      categ &&
        _updateTabKey(
          (categ === 'Petty Cash' ? 'petty' : categ.toLowerCase()) as any,
        );
      _saveConfiguration(_configuration);
      _saveConfigurationForAllowance(_configuration);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_configuration]);
  useEffect(() => {
    try {
      //ComponentDidMount
      if (claimId) {
        _setUpdateId(claimId);
        if (
          tenantConfig[0]?.is_enabled_traffic_lights &&
          isEnableTrafficLightFeatureForTenantFeatures
        ) {
          _fetchExpenseClaimViolationData(claimId);
        }
        delay(() => {
          _fetchExpenseClaimData(claimId, (data: any) => {
            _fetchDetailConfiguration(
              data.expense_type_legal_entity.custom_configuration ||
                data.expense_type_legal_entity.global_configuration,
            );

            _fetchDetailConfigurationForAllowance(
              data.expense_type_legal_entity.custom_configuration
                ? data.expense_type_legal_entity.custom_configuration
                : data.expense_type_legal_entity.global_configuration,
            );
          });
        }, 250);
      } else if (isUseForFormPreview) {
        _apiCallReset();
      }

      return () => {
        //ComponentWillUnmount
        message.destroy();
        _resetToInitial();
        _resetToInitialAllowance();
      };
    } catch (error) {
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [claimId]);
  useEffect(() => {
    if (claimId) {
      _allowanceRecordsTableListUpdateMode(claimId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    message.destroy();
    if (isLoading && !!info) message.loading(info, 0);
    else if (success) message.success(success, 5, _apiCallReset);
    else if (error) message.error(error, 5, _apiCallReset);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, success, error, info]);

  const formLayout = {
    labelCol: {
      span: 24,
    },
    wrapperCol: {
      span: 24,
      offset: 0,
    },
  };
  const commonFormProps: FormProps = {
    scrollToFirstError: true,
    size: 'middle',
    layout: 'horizontal',
    colon: false,
    autoComplete: 'off',
    initialValues: {
      entertainment_staff_members: [
        {
          emp_id: 'employee 1',
          member: 'employee 1',
          designation: 'employee 1',
        },
      ],
      entertainment_guest_members: [
        {
          member: '',
          organisation: '',
          designation: '',
        },
      ],
    },
  };

  const formProps = {
    form: form,
    ...formLayout,
    ...commonFormProps,
  };
  return (
    <ErrorBoundary>
      <div className='claim-details-container view-mode'>
        {isLoading ? (
          <GetSkeleton />
        ) : (
          <GetDetailComponent
            tenantConfig={tenantConfig}
            isApprovalPage={isApprovalPage}
            expenseClaimViolationFetchedData={expenseClaimViolationFetchedData}
            isEnableTrafficLightFeatureForTenantFeatures={
              isEnableTrafficLightFeatureForTenantFeatures
            }
            expenseClaimFetchedData={
              activeTabKey !== 'allowance'
                ? expenseClaimFetchedData
                : expenseClaimFetchedDataAllowance
            }
            isCreatedByVisible={isCreatedByVisible}
            configuration={
              activeTabKey !== 'allowance'
                ? configuration
                : allowanceConfiguration
            }
            activeTabKey={activeTabKey}
            isUseForFormPreview={isUseForFormPreview}
            formProps={formProps}
            isAdmin={isAdmin}
            isEmployee={isEmployee}
            allowanceRecordsData={formDataAllowance?.allowanceTripRecords}
          />
        )}
      </div>
    </ErrorBoundary>
  );
};

/**
 * Main Grid of detail view and wrapper of all field
 * @param props
 */
const GetDetailComponent: FC<{
  isApprovalPage?: any;
  tenantConfig?: any;
  expenseClaimFetchedData: any;
  expenseClaimViolationFetchedData: any;
  isCreatedByVisible: boolean;
  configuration: any;
  activeTabKey: any;
  isUseForFormPreview?: boolean;
  formProps?: FormProps;
  isAdmin: boolean;
  isEmployee?: boolean;
  allowanceRecordsData?: any;
  isEnableTrafficLightFeatureForTenantFeatures?: boolean;
}> = props => {
  const {
    isApprovalPage,
    activeTabKey,
    configuration,
    tenantConfig,
    expenseClaimFetchedData,
    expenseClaimViolationFetchedData,
    isCreatedByVisible,
    isUseForFormPreview,
    formProps,
    isAdmin,
    isEmployee,
    allowanceRecordsData,
    isEnableTrafficLightFeatureForTenantFeatures,
  } = props;

  const addExpenseFormContainerColSize: number =
    activeTabKey === 'mileage' || activeTabKey === 'allowance' ? 24 : 14;

  const receiptColVisibility =
    Boolean(
      configuration?.can_attach_receipts === true ||
        configuration?.is_allow_supporting_documents === true,
    ) && !['mileage', 'allowance'].includes(activeTabKey || '');

  if (
    (!isUseForFormPreview && expenseClaimFetchedData === null) ||
    configuration === null
  ) {
    return null;
  }

  const getFormRelatedFields = () => {
    return (
      <>
        {/* GENERAL */}
        <GeneralFields
          activeTabKey={activeTabKey}
          configuration={configuration}
          expenseClaimFetchedData={expenseClaimFetchedData}
          isCreatedByVisible={isCreatedByVisible}
          isUseForFormPreview={isUseForFormPreview}
        />
        {/* PETTY CASH */}
        {activeTabKey === 'petty' && (
          <PettyCashFields
            configuration={configuration}
            expenseClaimFetchedData={expenseClaimFetchedData}
            isUseForFormPreview={isUseForFormPreview}
          />
        )}
        {/* ENTERTAINMENT */}
        {activeTabKey === 'entertainment' && (
          <EntertainmentFields
            configuration={configuration}
            expenseClaimFetchedData={expenseClaimFetchedData}
            isUseForFormPreview={isUseForFormPreview}
          />
        )}
        {/* MILEAGE */}
        {activeTabKey === 'mileage' && (
          <MileageFields
            configuration={configuration}
            expenseClaimFetchedData={expenseClaimFetchedData}
            // isUseForFormPreview={isUseForFormPreview}
          />
        )}
        {/* ALLOWANCE */}
        {activeTabKey === 'allowance' && (
          <AllowanceFields
            configuration={configuration}
            expenseClaimFetchedData={expenseClaimFetchedData}
            allowanceRecordsData={allowanceRecordsData}
            //isUseForFormPreview={isUseForFormPreview}
          />
        )}
      </>
    );
  };

  // const riskContainerColor =   expenseClaimFetchedData
  //   ? expenseClaimFetchedData.flag_color === 'RED'
  //     ? 'background-color-red'
  //     : expenseClaimFetchedData.flag_color === 'ORANGE'
  //     ? 'background-color-orange'
  //     : ''
  //   : ''
  // const displayRiskContainer =
  //   isApprovalPage &&
  //   (expenseClaimFetchedData.flag_color === 'RED' ||
  //     expenseClaimFetchedData.flag_color === 'ORANGE') &&
  //   tenantConfig[0]?.is_enabled_traffic_lights
  //     ? true
  //     : false;

  let displayRiskContainerExists = false;
  let displayRiskContainer = false;
  if (
    isApprovalPage &&
    tenantConfig[0]?.is_enabled_traffic_lights &&
    !isEnableTrafficLightFeatureForTenantFeatures
  ) {
    displayRiskContainerExists =
      expenseClaimFetchedData?.flag_color === 'RED' ||
      expenseClaimFetchedData?.flag_color === 'ORANGE'
        ? true
        : false;
  } else if (
    (isApprovalPage || isAdmin || isEmployee) &&
    tenantConfig[0]?.is_enabled_traffic_lights &&
    isEnableTrafficLightFeatureForTenantFeatures
  ) {
    displayRiskContainer =
      expenseClaimViolationFetchedData?.flag_color === 'RED' ||
      expenseClaimViolationFetchedData?.flag_color === 'ORA'
        ? true
        : false;
  }

  const riskContainerColor = displayRiskContainerExists
    ? expenseClaimFetchedData?.flag_color === 'RED'
      ? 'background-color-red'
      : expenseClaimFetchedData?.flag_color === 'ORANGE'
      ? 'background-color-orange'
      : ''
    : expenseClaimViolationFetchedData?.flag_color === 'RED'
    ? 'background-color-red'
    : expenseClaimViolationFetchedData?.flag_color === 'ORA'
    ? 'background-color-orange'
    : '';

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
  const violatedPoliciesLength = expenseClaimViolationFetchedData?.violated_policy_details?.data?.filter(
    (item: any) =>
      (isApprovalPage && item?.is_show_flag_to_approver) ||
      (isAdmin && item?.is_show_flag_to_finance_admin) ||
      (isEmployee && item?.is_show_flag_to_employee),
  ).length;
  return (
    <ErrorBoundary>
      {displayRiskContainerExists && (
        <div
          className={`approval-risk-container ${riskContainerColor}`}
          data-testId='approval-risk-container'
        >
          <div className='approval-risk-container__risk-score'>
            <span className='approval-risk-container__risk-score-title'>
              Risk Score:
            </span>{' '}
            <span className='approval-risk-container__risk-score-data'>
              {expenseClaimFetchedData?.flag_score}%
            </span>
          </div>
          {expenseClaimFetchedData?.flag_criterias.length > 0 && (
            <div className='approval-risk-container__risk-criteria'>
              <div className='approval-risk-container__risk-criteria-title'>
                {expenseClaimFetchedData?.flag_criterias.length} policies
                violated :
              </div>
              {expenseClaimFetchedData?.flag_criterias.map(
                (item: any, index: number) => (
                  <div className='approval-risk-container__risk-criteria-data'>
                    {index + 1}. {item.title}
                  </div>
                ),
              )}
            </div>
          )}
        </div>
      )}
      {displayRiskContainer &&
        expenseClaimViolationFetchedData?.flag_score > 0 &&
        expenseClaimViolationFetchedData?.violated_policy_details?.data.some(
          (item: any) =>
            (isApprovalPage && item?.is_show_flag_to_approver) ||
            (isAdmin && item?.is_show_flag_to_finance_admin) ||
            (isEmployee && item?.is_show_flag_to_employee),
        ) && (
          <div
            className={`approval-risk-container ${riskContainerColor}`}
            data-testId='approval-risk-container'
          >
            <div className='approval-risk-container__risk-score'>
              <span className='approval-risk-container__risk-score-title'>
                Risk Score:
              </span>{' '}
              <span className='approval-risk-container__risk-score-data'>
                {expenseClaimViolationFetchedData.flag_score}%
              </span>
            </div>
            <div className='approval-risk-container__risk-criteria'>
              <div className='approval-risk-container__risk-criteria-title'>
                {violatedPoliciesLength}
                {violatedPoliciesLength > 1
                  ? ' Policies Violated :'
                  : ' Policy Violated :'}
              </div>
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
                          {renderViolatedPolicy(item, 'employee', isEmployee)}
                        </li>
                      );
                  },
                )}
              </ul>
            </div>
          </div>
        )}

      <Row
        gutter={rowGutter}
        className={`detail-View-componet ${
          isUseForFormPreview ? 'form-preview-container' : ''
        }`}
      >
        <Col xl={addExpenseFormContainerColSize}>
          {isUseForFormPreview ? (
            <Form name='addNewExpenseForm' {...formProps}>
              {getFormRelatedFields()}
            </Form>
          ) : (
            getFormRelatedFields()
          )}
          {/* CUSTOM */}
          <CustomFields
            claimFieldsData={
              isUseForFormPreview
                ? configuration.custom_fields
                : expenseClaimFetchedData.custom_fields
            }
            configuration={configuration}
            formProps={formProps}
            isUseForFormPreview={isUseForFormPreview}
            _isAdmin={isAdmin}
          />
        </Col>
        {receiptColVisibility && (
          <Col xl={{ span: 9, offset: 0 }}>
            <ReceiptSupportingDocFields
              configuration={configuration}
              expenseClaimFetchedData={expenseClaimFetchedData}
              isUseForFormPreview={isUseForFormPreview}
              formProps={formProps}
            />
          </Col>
        )}
      </Row>
    </ErrorBoundary>
  );
};

export default memo(connector(ClaimDetails));
