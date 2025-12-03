import RuleDrawer from './ruleDrawer.index';
import RuleSectionPreview from './ruleSectionPreview.index';

import { FC, memo, useState, useEffect, Dispatch } from 'react';
import React from 'react';
import {
  HeaderBarWrapper,
  BackButton,
} from '../../../../../../shared/components';
import { Trans } from '@lingui/macro';
import { appPath } from '../../../../../app/app.routes';
import './addUpdateRule.index.less';
import { Button, Row, Col, Form, Input, Select, message } from 'antd';

import { useHistory } from 'react-router-dom';

import { connect, ConnectedProps } from 'react-redux';

import {
  getAddUpdateRuleAction,
  getProcessTypes,
  getSelectedProcessType,
  getTypeObjects,
  getRuleConfig,
  getReadableRuleConfig,
  getSelectedTypeObject,
  getRuleTitle,
  getTypeObjectsStatus,
} from '../../../../../../shared/redux/rootReducer';

import {
  initRuleConfig,
  initReadableRuleConfig,
  initCurrentSectionData,
  populateCurrentSectionData,
  populateDefaultSectionData,
  setDrawerAction,
  setDrawerFor,
  setDrawerTitle,
  setSelectedProcessType,
  setCurrentEditingSectionIndex,
  removeCustomSection,
  setAddUpdateRuleAction,
  resetAddUpdateRuleState,
  moveCustomSectionUp,
  moveCustomSectionDown,
  setTypeObjectsStatus,
} from '../../../../../../shared/redux/rule/addUpdateRule/addUpdateRule.action';

import {
  fetchProcessTypes,
  fetchAllData,
  fetchGenders,
  fetchMaritalStatuses,
  fetchContractTypes,
  fetchRefObjEmpGroups,
  fetchEmpSubGroups,
  fetchEmpGroups,
  fetchEmployeeIds,
  fetchExpenseTypesLegalEntities,
  fetchRequestTypesLegalEntities,
  fetchExpenseTypes,
  fetchRequestTypes,
  addUpdateRule,
  updateRule,
  fetchRuleByID,
  fetchCostCentres,
  fetchBenefitTypes,
  fetchBenefitTypesLegalEntities,
  fetchPayGrades,
  fetchApproversCustomFields,
} from '../../../../../../shared/redux/rule/addUpdateRule/addUpdateRule.thunk';
import { setTimeout } from 'timers';
import { fetchUsersForDD } from '../../../../../../shared/redux/auth/auth.thunk';

const { Option } = Select;
const mapStateToProps = (state: any) => ({
  addUpdateRuleAction: getAddUpdateRuleAction(state),
  selectedTypeObject: getSelectedTypeObject(state),
  processTypes: getProcessTypes(state),
  selectedProcessType: getSelectedProcessType(state),
  typeObjects: getTypeObjects(state),
  typeObjectsStatus: getTypeObjectsStatus(state),
  ruleConfig: getRuleConfig(state),
  ruleTitle: getRuleTitle(state),
  readableRuleConfig: getReadableRuleConfig(state),
});

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  setAddUpdateRuleAction: (payload: any) =>
    dispatch(setAddUpdateRuleAction(payload)),
  resetAddUpdateRuleState: () => dispatch(resetAddUpdateRuleState()),
  fetchProcessTypes: () => dispatch(fetchProcessTypes()),
  fetchAllData: (process: string | null) => dispatch(fetchAllData(process)),
  fetchGenders: () => dispatch(fetchGenders()),
  fetchMaritalStatuses: () => dispatch(fetchMaritalStatuses()),
  fetchContractTypes: () => dispatch(fetchContractTypes()),
  fetchRefObjEmpGroups: () => dispatch(fetchRefObjEmpGroups()),
  fetchEmpSubGroups: () => dispatch(fetchEmpSubGroups()),
  fetchEmpGroups: () => dispatch(fetchEmpGroups()),
  fetchEmployeeIds: () => dispatch(fetchEmployeeIds()),
  fetchApproversCustomFields: (page: number, pageSize?: number) =>
    dispatch(fetchApproversCustomFields(page, pageSize)),
  fetchUsersForDD: () => dispatch(fetchUsersForDD()),
  fetchCostCentres: () => dispatch(fetchCostCentres()),
  fetchExpenseTypesLegalEntities: ({
    expenseTypeId,
  }: {
    expenseTypeId: string;
  }) => dispatch(fetchExpenseTypesLegalEntities({ expenseTypeId })),
  fetchRequestTypesLegalEntities: ({
    requestTypeId,
  }: {
    requestTypeId: string;
  }) => dispatch(fetchRequestTypesLegalEntities({ requestTypeId })),
  fetchExpenseTypes: ({ processType }: { processType: string }) =>
    dispatch(fetchExpenseTypes({ processType })),
  fetchRequestTypes: ({ processType }: { processType: string }) =>
    dispatch(fetchRequestTypes({ processType })),
  initRuleConfig: () => dispatch(initRuleConfig()),
  initReadableRuleConfig: () => dispatch(initReadableRuleConfig()),
  initCurrentSectionData: (sectionType: string) =>
    dispatch(initCurrentSectionData(sectionType)),
  populateCurrentSectionData: (payload: number) =>
    dispatch(populateCurrentSectionData(payload)),
  populateDefaultSectionData: () => dispatch(populateDefaultSectionData()),
  setDrawerAction: (payload: string) => dispatch(setDrawerAction(payload)),
  setDrawerFor: (payload: string) => dispatch(setDrawerFor(payload)),
  setDrawerTitle: (payload: string) => dispatch(setDrawerTitle(payload)),
  setCurrentEditingSectionIndex: (payload: number | null) =>
    dispatch(setCurrentEditingSectionIndex(payload)),
  setSelectedProcessType: (payload: string) =>
    dispatch(setSelectedProcessType(payload)),
  removeCustomSection: ({ toBeRemovedIndex }: { toBeRemovedIndex: number }) =>
    dispatch(removeCustomSection({ toBeRemovedIndex })),
  addUpdateRule: ({
    type,
    title,
    onSuccess,
    onFailure,
  }: {
    type: number;
    title: string;
    onSuccess: Function;
    onFailure: Function;
  }) =>
    dispatch(
      addUpdateRule({
        type,
        title,
        onSuccess,
        onFailure,
      }),
    ),
  fetchRuleByID: (id: number) => dispatch(fetchRuleByID(id)),
  updateRule: ({
    ruleId,
    type,
    title,
    onSuccess,
    onFailure,
  }: {
    ruleId: number;
    type: number;
    title: string;
    onSuccess: Function;
    onFailure: Function;
  }) =>
    dispatch(
      updateRule({
        ruleId,
        type,
        title,
        onSuccess,
        onFailure,
      }),
    ),
  moveCustomSectionUp: (index: number) => dispatch(moveCustomSectionUp(index)),
  moveCustomSectionDown: (index: number) =>
    dispatch(moveCustomSectionDown(index)),
  fetchBenefitTypes: ({ processType }: { processType: string }) =>
    dispatch(fetchBenefitTypes({ processType })),
  fetchBenefitTypesLegalEntities: ({
    benefitTypeId,
  }: {
    benefitTypeId: string;
  }) => dispatch(fetchBenefitTypesLegalEntities({ benefitTypeId })),
  fetchPayGrades: () => dispatch(fetchPayGrades()),
  _setTypeObjectsStatus: (data: any) => dispatch(setTypeObjectsStatus(data)),
});

const AddRule: FC<ConnectedProps<typeof connector>> = props => {
  const history = useHistory();
  const [form] = Form.useForm();

  let page = 1;
  let pageSize = 50;

  const [isDrawerOpen, setIsDrawerOpen] = useState<any>(false);
  const [isProcessDropdownDisabled, setIsProcessDropdownDisabled] = useState<
    any
  >(false);
  const [isTypeDropdownDisabled, setIsTypeDropdownDisabled] = useState<any>(
    true,
  );
  const [ruleIdForUpdate, setRuleIdForUpdate] = useState<any>();
  const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState<any>(
    false,
  );
  const [addRule, setAddRule] = useState<boolean>(true);

  const fetchTypesFromDB = async () => {
    const processType = form.getFieldValue('process');
    if (processType === 'EXPAPR') {
      props.fetchExpenseTypes({ processType });
    } else if (processType === 'REQAPR') {
      props.fetchRequestTypes({ processType });
    } else if (processType === 'BENAPR') {
      props.fetchBenefitTypes({ processType });
    }
  };

  const onAddNewCustomSection = () => {
    props.initCurrentSectionData('CUSTOM');
    props.setDrawerAction('ADD');
    props.setDrawerFor('CUSTOM');
    props.setDrawerTitle('Set New Criteria');
    props.setCurrentEditingSectionIndex(null);
    setIsDrawerOpen(true);
  };

  const onEditCustomSection = ({
    indexToBeEdited,
  }: {
    indexToBeEdited: number;
  }) => {
    props.populateCurrentSectionData(indexToBeEdited);
    props.setDrawerAction('EDIT');
    props.setDrawerFor('CUSTOM');
    props.setDrawerTitle(`Edit Criteria ${indexToBeEdited + 1}`);
    props.setCurrentEditingSectionIndex(indexToBeEdited);
    setIsDrawerOpen(true);
  };

  const onAddNewDefaultSection = () => {
    props.initCurrentSectionData('DEFAULT');
    props.setDrawerAction('ADD');
    props.setDrawerFor('DEFAULT');
    props.setDrawerTitle('Default Criteria');
    props.setCurrentEditingSectionIndex(null);
    setIsDrawerOpen(true);
  };

  const onEditDefaultSection = () => {
    props.populateDefaultSectionData();
    props.setDrawerAction('EDIT');
    props.setDrawerFor('DEFAULT');
    props.setDrawerTitle('Default Criteria');
    props.setCurrentEditingSectionIndex(null);
    setIsDrawerOpen(true);
  };

  const onProcessTypeDropdownChange = (processTypeCode: string) => {
    props.initRuleConfig();
    props.initReadableRuleConfig();

    props.setSelectedProcessType(processTypeCode);
    if (['EXPAPR', 'REQAPR', 'BENAPR'].includes(processTypeCode)) {
      props.fetchAllData(processTypeCode);
      fetchTypesFromDB();
      setIsTypeDropdownDisabled(false);
    } else {
      setIsTypeDropdownDisabled(true);
    }
    form.setFieldsValue({ type: null, title: '' });
  };

  const onTypeDropdownChange = async (typeId: string, option: any) => {
    let suffix = '';
    if (['EXPAPR', 'REQAPR', 'BENAPR'].includes(props.selectedProcessType)) {
      suffix = 'Approvals';
    } else if (['EXPELI', 'REQELI'].includes(props.selectedProcessType)) {
      suffix = 'Entitlements';
    } else if (['BENWIT'].includes(props.selectedProcessType)) {
      suffix = 'Withdrawals';
    }
    let selectedTypeTitle = props.typeObjects?.find(
      (item: any) => item.id === option.value,
    );
    form.setFieldsValue({ title: `${selectedTypeTitle.title} ${suffix}` });

    const processType = form.getFieldValue('process');
    if (processType === 'EXPAPR') {
      props.fetchExpenseTypesLegalEntities({ expenseTypeId: typeId });
    } else if (processType === 'REQAPR') {
      props.fetchRequestTypesLegalEntities({ requestTypeId: typeId });
    } else if (processType === 'BENAPR') {
      props.fetchBenefitTypesLegalEntities({ benefitTypeId: typeId });
    }
  };

  const onCloseDrawer = () => setIsDrawerOpen(false);

  const onFinishRuleForm = async (formValues: any) => {
    const { type, title } = formValues;
    setIsSubmitButtonDisabled(true);
    if (props.addUpdateRuleAction === 'ADD_RULE') {
      props.addUpdateRule({
        type,
        title,
        onSuccess: () => {
          message.success({
            content: `${title} Rule Created`,
            key: 'CREATE_RULE',
          });
          setTimeout(() => {
            setIsSubmitButtonDisabled(false);
            history.push('/setup/rules/');
          }, 1500);
        },
        onFailure: () => {
          setIsSubmitButtonDisabled(false);
          message.error('Unable to create rule');
        },
      });
    } else {
      props.updateRule({
        ruleId: ruleIdForUpdate,
        type,
        title,
        onSuccess: () => {
          message.success({
            content: `${title} Rule Updated`,
            key: 'CREATE_RULE',
          });
          setTimeout(() => {
            setIsSubmitButtonDisabled(false);
            history.push('/setup/rules/');
          }, 1500);
        },
        onFailure: () => {
          setIsSubmitButtonDisabled(false);
          message.error('Unable to update rule');
        },
      });
    }
  };

  const loadDataFromDB = async () => {
    props.fetchProcessTypes();
    props.fetchGenders();
    props.fetchMaritalStatuses();
    props.fetchContractTypes();
    props.fetchRefObjEmpGroups();
    props.fetchEmpSubGroups();
    props.fetchEmpGroups();
    props.fetchEmployeeIds();
    props.fetchUsersForDD();
    props.fetchCostCentres();
    props.fetchPayGrades();
    props.fetchApproversCustomFields(page, pageSize);
  };

  const checkForAddOrUpdate = () => {
    const url = history.location.pathname;
    const isUpdateUrl = url.includes('/rules/update/');
    if (isUpdateUrl) {
      const ruleId = parseInt(url.split('/update/')[1]);
      setRuleIdForUpdate(ruleId);
      props.setAddUpdateRuleAction('UPDATE_RULE');
      props.fetchRuleByID(ruleId);
      fetchTypesFromDB();
      setAddRule(false);
    } else {
      setAddRule(true);
      props.setAddUpdateRuleAction('ADD_RULE');
      setIsProcessDropdownDisabled(false);
    }
  };

  const checkForClone = () => {
    let queryParams: any = history.location.search;
    if (queryParams) {
      queryParams = queryParams.substring(1);
      queryParams = queryParams.split('&');
      const queryParamMap: any = {};
      for (let index = 0; index < queryParams.length; index++) {
        let queryParam: any = queryParams[index];
        queryParam = queryParam.split('=');
        queryParamMap[queryParam[0]] = queryParam[1];
      }

      if ('clone' in queryParamMap) {
        const ruleId = queryParamMap.clone;
        const processCode = queryParamMap.process;

        form.setFieldsValue({ process: processCode });
        onProcessTypeDropdownChange(processCode);

        // --- Initializations for clone case (same as ADD case) ---
        props.setAddUpdateRuleAction('ADD_RULE');
        setIsProcessDropdownDisabled(false);
        // ---------------------------------------------------------

        // --- Initializations for clone case (same as UPD case) ---
        setRuleIdForUpdate(ruleId);
        props.fetchRuleByID(ruleId);
        fetchTypesFromDB();

        setIsProcessDropdownDisabled(true);
        // ---------------------------------------------------------
      }
    }
  };

  // --- UPDATE CASE: SETTING INITIAL VALUES ---
  if (
    props.addUpdateRuleAction === 'UPDATE_RULE' &&
    props.selectedProcessType &&
    !addRule &&
    !props.typeObjectsStatus
  ) {
    const processTypeCode = props.selectedProcessType;
    form.setFieldsValue({ process: processTypeCode });
    props._setTypeObjectsStatus(true);
    setTimeout(() => {
      setIsProcessDropdownDisabled(true);
      if (props.typeObjects.length === 0) {
        fetchTypesFromDB();
        form.setFieldsValue({
          type: props.selectedTypeObject?.id,
          title: props.ruleTitle,
        });
      } else {
        form.setFieldsValue({
          type: props.selectedTypeObject?.id,
          title: props.ruleTitle,
        });
      }
    }, 500);
  }
  // -------------------------------------------

  useEffect(() => {
    props.resetAddUpdateRuleState();
    props.initRuleConfig();
    props.initReadableRuleConfig();
    loadDataFromDB();
    checkForAddOrUpdate();
    checkForClone();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let rulePreviewContainer;
  if (props.selectedProcessType) {
    rulePreviewContainer = (
      <div>
        {props.readableRuleConfig.custom?.map(
          (customItem: any, customItemIndex: number) => {
            return (
              <div key={customItemIndex} style={{ width: '80%' }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    border: '1px solid lightgray',
                    borderBottom: '0',
                    padding: '0 18px',
                  }}
                >
                  <div>Criteria {customItemIndex + 1}</div>
                  <div>
                    {props.readableRuleConfig.custom.length > 1 && (
                      <>
                        {customItemIndex !== 0 && (
                          <Button
                            type='link'
                            onClick={() =>
                              props.moveCustomSectionUp(customItemIndex)
                            }
                          >
                            <Trans>Move Up</Trans>
                          </Button>
                        )}
                        {customItemIndex !==
                          props.readableRuleConfig.custom.length - 1 && (
                          <Button
                            type='link'
                            onClick={() =>
                              props.moveCustomSectionDown(customItemIndex)
                            }
                          >
                            <Trans>Move Down</Trans>
                          </Button>
                        )}
                      </>
                    )}
                    <Button
                      type='link'
                      onClick={() =>
                        onEditCustomSection({
                          indexToBeEdited: customItemIndex,
                        })
                      }
                    >
                      <Trans>Edit</Trans>
                    </Button>
                    <Button
                      type='link'
                      onClick={() =>
                        props.removeCustomSection({
                          toBeRemovedIndex: customItemIndex,
                        })
                      }
                    >
                      <Trans>Remove</Trans>
                    </Button>
                  </div>
                </div>
                <RuleSectionPreview
                  currentSectionData={customItem}
                  action='CUSTOM'
                />
              </div>
            );
          },
        )}
        <Button type='dashed' onClick={onAddNewCustomSection}>
          <Trans>Add new custom criteria</Trans>
        </Button>

        <div style={{ width: '80%' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              border: '1px solid lightgray',
              borderBottom: '0',
              padding: '0 18px',
              marginTop: '24px',
            }}
          >
            <div>
              <Trans>Default Criteria</Trans>
            </div>
            <div>
              {(props.readableRuleConfig.default?.rule.default_case
                .is_auto_approval ||
                props.ruleConfig.default?.rule.default_case.steps?.length >
                  0) && (
                <Button type='link' onClick={() => onEditDefaultSection()}>
                  <Trans>Edit</Trans>
                </Button>
              )}
            </div>
          </div>

          {props.readableRuleConfig.default?.rule.default_case
            .is_auto_approval ||
          props.readableRuleConfig.default?.rule.default_case.steps?.length >
            0 ? (
            <RuleSectionPreview
              currentSectionData={props.readableRuleConfig.default}
              action='DEFAULT'
            />
          ) : (
            <div
              style={{
                padding: '12px 18px',
                border: '1px solid lightgray',
                marginBottom: '24px',
              }}
            >
              Atleast one default criteria required.
              <Button type='link' onClick={onAddNewDefaultSection}>
                + Add default criteria
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <HeaderBarWrapper
      headerCommonProps={
        props.addUpdateRuleAction === 'ADD_RULE'
          ? { title: <Trans>Add Rule</Trans> }
          : { title: <Trans>Update Rule</Trans> }
      }
    >
      <div className='add-rule-container'>
        <div className='title-h2' data-test='addReferenceObjectTitle'>
          <BackButton
            data-test='backButton'
            backBtnUrl={appPath.config_setup.rules.path}
          />
        </div>
        <Form layout='vertical' form={form} onFinish={onFinishRuleForm}>
          <Row>
            <Col xs={{ span: 24 }} xl={{ span: 12 }}>
              <Form.Item
                name='process'
                label={<Trans>Process</Trans>}
                rules={[
                  { required: true, message: 'Please select the process type' },
                ]}
              >
                <Select
                  showSearch
                  style={{ width: '100%' }}
                  placeholder='Select process'
                  optionFilterProp='children'
                  disabled={isProcessDropdownDisabled}
                  value={props.selectedProcessType}
                  onChange={onProcessTypeDropdownChange}
                >
                  {props.processTypes?.map((item: any, index: number) => {
                    return (
                      <Option key={index} value={item.code}>
                        {item.title}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col xs={{ span: 24 }} xl={{ span: 12 }}>
              <Form.Item
                name='type'
                label={<Trans>Type</Trans>}
                rules={[{ required: true, message: 'Please select the type' }]}
              >
                <Select
                  showSearch
                  style={{ width: '100%' }}
                  placeholder='Select type'
                  optionFilterProp='children'
                  disabled={isTypeDropdownDisabled}
                  // value={selectedType}
                  onChange={onTypeDropdownChange}
                >
                  {props.typeObjects?.map((item: any, index: number) => {
                    return (
                      <Option
                        key={index}
                        value={item.id}
                        disabled={item.is_rule_exists}
                        title={
                          item.is_rule_exists
                            ? `Rule for ${item.title} already exists`
                            : ''
                        }
                      >
                        {item.title} ({item.code})
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col xs={{ span: 24 }} xl={{ span: 12 }}>
              <Form.Item
                name='title'
                label={<Trans>Rule title</Trans>}
                rules={[
                  {
                    required: true,
                    validator(_, value) {
                      if (value !== undefined) {
                        value = value?.trim();
                      }

                      if (!value || value === undefined) {
                        return Promise.reject('Please specify a rule title');
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
                  },
                ]}
              >
                <Input
                  disabled={
                    props.addUpdateRuleAction === 'ADD_RULE' &&
                    isTypeDropdownDisabled
                  }
                />
              </Form.Item>
            </Col>
          </Row>
          {/* <div>{JSON.stringify(props.ruleConfig, null, 2)}</div> */}
          <br />

          {rulePreviewContainer}

          <RuleDrawer
            onCloseDrawer={onCloseDrawer}
            isDrawerOpen={isDrawerOpen}
          />

          <Form.Item>
            <Button
              type='primary'
              htmlType='submit'
              disabled={
                isSubmitButtonDisabled ||
                (props.ruleConfig.default &&
                props.ruleConfig.default.rule.default_case.is_auto_approval
                  ? false
                  : props.ruleConfig.default?.rule.default_case.steps?.length >
                    0
                  ? false
                  : true)
              }
            >
              {props.addUpdateRuleAction === 'ADD_RULE' ? (
                <Trans>Create Rule</Trans>
              ) : (
                <Trans>Update Rule</Trans>
              )}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </HeaderBarWrapper>
  );
};

const connector = connect(mapStateToProps, mapDispatchToProps);
export default memo(connector(AddRule));
