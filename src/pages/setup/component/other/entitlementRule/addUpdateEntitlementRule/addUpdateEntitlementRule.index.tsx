import React, { useEffect } from 'react';
import { Trans } from '@lingui/macro';
import { Dispatch, useState } from 'react';

import {
  Button,
  Row,
  Col,
  Form,
  Input,
  Select,
  message,
  DatePicker,
} from 'antd';

import { FC, memo } from 'react';
import moment from 'moment';
import { connect, ConnectedProps } from 'react-redux';

import { useHistory } from 'react-router';

import {
  BackButton,
  HeaderBarWrapper,
} from '../../../../../../shared/components';
import EntitlementRuleSectionPreview from './entitlementRuleSectionPreview';
import EntitlementRuleDrawer from './entitlementRuleDrawer.index';

import { appPath } from '../../../../../app/app.routes';
import {
  initCurrentSectionDataForEntitlement,
  initEntitlementRuleConfig,
  initReadableEntitlementRuleConfig,
  populateCurrentSectionDataForEntitlement,
  populateDefaultSectionDataForEntitlement,
  resetAddUpdateEntitlementRuleState,
  setAddUpdateEntitlementRuleAction,
  setDrawerForForEntitlement,
  setDrawerActionForEntitlement,
  setDrawerTitleForEntitlement,
  setSelectedProcessTypeForEntitlement,
  removeCustomSectionForEntitlement,
  moveCustomSectionUpForEntitlement,
  moveCustomSectionDownForEntitlement,
  setCurrentEditingSectionIndexForEntitlement,
  setIsDefaultCriteraForEntitlementTouched,
} from '../../../../../../shared/redux/entitlementRule/addUpdateEntitlementRule/addUpdateEntitlementRule.action';

import {
  addUpdateEntitlementRule,
  fetchBenefitTypesForEntitlement,
  fetchContractTypes,
  fetchBenefitTypesLegalEntitiesForEntitlement,
  fetchEmpGroups,
  fetchEmpSubGroups,
  fetchGenders,
  fetchMaritalStatuses,
  fetchPayGrades,
  fetchEntitlementRuleByID,
  fetchProcessTypesForEntitlement,
  updateEntitlementRule,
  fetchAllDataForEntitlement,
  selectedBenefitTypeConfig,
} from '../../../../../../shared/redux/entitlementRule/addUpdateEntitlementRule/addUpdateEntitlementRule.thunk';

import {
  getAddUpdateEntitlementRuleAction,
  getEntitlementRuleConfig,
  getEntitlementRuleTitle,
  getEntitlementEffectiveFrom,
  getProcessTypesForEntitlement,
  getReadableEntitlementRuleConfig,
  getSelectedProcessTypeForEntitlement,
  getSelectedTypeObjectForEntitlement,
  getTypeObjectsForEntitlement,
  getIfDefaultCriteraForEntitlementTouched,
} from '../../../../../../shared/redux/rootReducer';
// import { getIfDefaultCriteraForEntitlementTouched } from '../../../shared/redux/entitlementRule/addUpdateEntitlementRule/addUpdateEntitlementRule.reducer';

const { Option } = Select;

const mapStateToProps = (state: any) => ({
  addUpdateEntitlementRuleAction: getAddUpdateEntitlementRuleAction(state),
  selectedTypeObjectForEntitlement: getSelectedTypeObjectForEntitlement(state),
  processTypesForEntitlement: getProcessTypesForEntitlement(state),
  selectedProcessTypeForEntitlement: getSelectedProcessTypeForEntitlement(
    state,
  ),
  typeObjectsForEntitlement: getTypeObjectsForEntitlement(state),
  entitlementRuleConfig: getEntitlementRuleConfig(state),
  entitlementTitle: getEntitlementRuleTitle(state),
  entitlementEffectiveFrom: getEntitlementEffectiveFrom(state),
  readableEntitlementRuleConfig: getReadableEntitlementRuleConfig(state),
  benefitTypeConfig: state.addUpdateEntitlementRule,
  is_default_entitlement_touched: state.is_default_entitlement_touched,
  getIfDefaultCriteraForEntitlementTouched: getIfDefaultCriteraForEntitlementTouched(
    state,
  ),
});

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  setAddUpdateEntitlementAction: (payload: any) =>
    dispatch(setAddUpdateEntitlementRuleAction(payload)),
  fetchContractTypes: () => dispatch(fetchContractTypes()),
  resetAddUpdateEntitlementRuleState: () =>
    dispatch(resetAddUpdateEntitlementRuleState()),
  fetchProcessTypesForEntitlement: () =>
    dispatch(fetchProcessTypesForEntitlement()),
  fetchEmpGroups: () => dispatch(fetchEmpGroups()),
  fetchGenders: () => dispatch(fetchGenders()),
  fetchMaritalStatuses: () => dispatch(fetchMaritalStatuses()),
  fetchEmpSubGroups: () => dispatch(fetchEmpSubGroups()),
  fetchPayGrades: () => dispatch(fetchPayGrades()),
  fetchBenefitTypesLegalEntitiesForEntitlement: ({
    typeId,
    process,
  }: {
    typeId: string;
    process: string;
  }) =>
    dispatch(fetchBenefitTypesLegalEntitiesForEntitlement({ typeId, process })),
  fetchBenefitTypesForEntitlement: ({ processType }: { processType: string }) =>
    dispatch(fetchBenefitTypesForEntitlement({ processType })),
  initEntitlementRuleConfig: () => dispatch(initEntitlementRuleConfig()),
  initReadableEntitlementRuleConfig: () =>
    dispatch(initReadableEntitlementRuleConfig()),
  initCurrentSectionDataForEntitlement: (sectionType: string) =>
    dispatch(initCurrentSectionDataForEntitlement(sectionType)),
  populateCurrentSectionDataForEntitlement: (payload: number) =>
    dispatch(populateCurrentSectionDataForEntitlement(payload)),
  populateDefaultSectionDataForEntitlement: () =>
    dispatch(populateDefaultSectionDataForEntitlement()),
  setDrawerActionForEntitlement: (payload: string) =>
    dispatch(setDrawerActionForEntitlement(payload)),
  setDrawerForEntitlement: (payload: string) =>
    dispatch(setDrawerForForEntitlement(payload)),
  setDrawerTitleForEntitlement: (payload: string) =>
    dispatch(setDrawerTitleForEntitlement(payload)),
  setSelectedProcessTypeForEntitlement: (payload: string) =>
    dispatch(setSelectedProcessTypeForEntitlement(payload)),
  setCurrentEditingSectionIndexForEntitlement: (payload: number | null) =>
    dispatch(setCurrentEditingSectionIndexForEntitlement(payload)),
  fetchAllDataForEntitlement: (
    process: string | null,
    config_id: any,
    type: any,
  ) => dispatch(fetchAllDataForEntitlement(process, config_id, type)),
  removeCustomSectionForEntitlement: ({
    toBeRemovedIndex,
  }: {
    toBeRemovedIndex: number;
  }) => dispatch(removeCustomSectionForEntitlement({ toBeRemovedIndex })),
  addUpdateEntitlementRule: ({
    type,
    title,
    effective_from,
    onSuccess,
    onFailure,
  }: {
    type: number;
    title: string;
    effective_from: any;
    onSuccess: Function;
    onFailure: Function;
  }) =>
    dispatch(
      addUpdateEntitlementRule({
        type,
        title,
        effective_from,
        onSuccess,
        onFailure,
      }),
    ),
  fetchEntitlementByID: (id: number, isClone?: any) =>
    dispatch(fetchEntitlementRuleByID(id, isClone)),
  updateEntitlementRule: ({
    ruleId,
    type,
    title,
    effective_from,
    onSuccess,
    onFailure,
  }: {
    ruleId: number;
    type: number;
    title: string;
    effective_from: any;
    onSuccess: Function;
    onFailure: Function;
  }) =>
    dispatch(
      updateEntitlementRule({
        ruleId,
        type,
        title,
        effective_from,
        onSuccess,
        onFailure,
      }),
    ),
  moveCustomSectionUpForEntitlement: (index: number) =>
    dispatch(moveCustomSectionUpForEntitlement(index)),
  moveCustomSectionDownForEntitlement: (index: number) =>
    dispatch(moveCustomSectionDownForEntitlement(index)),
  _selectedBenefitTypeConfig: (typeId: number, process: string) =>
    dispatch(selectedBenefitTypeConfig(typeId, process)),
  setIsDefaultCriteraForEntitlementTouched: (is_touched: boolean) =>
    dispatch(setIsDefaultCriteraForEntitlementTouched(is_touched)),
});

const AddEntitlementRule: FC<ConnectedProps<typeof connector>> = props => {
  const history = useHistory();
  const [form] = Form.useForm();
  const { benefitTypeConfig } = props;
  const config = benefitTypeConfig.selectedBenefitTypeConfig;

  const [isDrawerOpen, setIsDrawerOpen] = useState<any>(false);
  const [isProcessDropdownDisabled, setIsProcessDropdownDisabled] = useState<
    any
  >(true);
  const [isTypeDropdownDisabled, setIsTypeDropdownDisabled] = useState<any>(
    true,
  );
  const [entitlementRuleIdForUpdate, setEntitlementRuleIdForUpdate] = useState<
    any
  >();

  // const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState<any>(
  //   true,
  // );
  useEffect(() => {
    if (!config.id) {
      const url = history.location.pathname;
      const isUpdateUrl = url.includes('/entitlement-rules/update/');
      if (isUpdateUrl && props.selectedTypeObjectForEntitlement) {
        const processType = form.getFieldValue('process');
        props._selectedBenefitTypeConfig(
          Number(props.selectedTypeObjectForEntitlement?.global_configuration),
          processType,
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.selectedTypeObjectForEntitlement]);
  const checkForAddOrUpdate = () => {
    const url = history.location.pathname;
    const isUpdateUrl = url.includes('/entitlement-rules/update/');
    const processType = form.getFieldValue('process');
    if (isUpdateUrl) {
      const ruleId = parseInt(url.split('/update/')[1]);
      setEntitlementRuleIdForUpdate(ruleId);
      props.setAddUpdateEntitlementAction('UPDATE_ENTITLEMENT_RULE');
      props.fetchEntitlementByID(ruleId);
      props.setIsDefaultCriteraForEntitlementTouched(true);
      fetchTypesFromDB();
      if (props.selectedTypeObjectForEntitlement) {
        props._selectedBenefitTypeConfig(
          Number(props.selectedTypeObjectForEntitlement?.global_configuration),
          processType,
        );
      }
    } else {
      props.setAddUpdateEntitlementAction('ADD_ENTITLEMENT_RULE');
      setIsProcessDropdownDisabled(false);
      props.setIsDefaultCriteraForEntitlementTouched(false);
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
        props.setAddUpdateEntitlementAction('ADD_ENTITLEMENT_RULE');
        setIsProcessDropdownDisabled(false);
        props.setIsDefaultCriteraForEntitlementTouched(true);
        // ---------------------------------------------------------

        // --- Initializations for clone case (same as UPD case) ---
        setEntitlementRuleIdForUpdate(ruleId);
        props.setAddUpdateEntitlementAction('ADD_ENTITLEMENT_RULE');
        props.fetchEntitlementByID(ruleId, true);
        fetchTypesFromDB();
        setIsProcessDropdownDisabled(true);
        form.setFieldsValue({
          effective_from: moment(new Date(), ['DD/MM/YYYY']),
        });
        // ---------------------------------------------------------
      }
    }
  };
  const loadDataFromDB = async () => {
    props.fetchProcessTypesForEntitlement();
    props.fetchGenders();
    props.fetchEmpGroups();
    props.fetchMaritalStatuses();
    props.fetchContractTypes();
    props.fetchEmpSubGroups();
    props.fetchPayGrades();
  };
  const fetchTypesFromDB = async () => {
    const processType = form.getFieldValue('process');
    processType && props.fetchBenefitTypesForEntitlement({ processType });
  };

  //--- UPDATE CASE: setting initial values //

  const update_useEffect_Fn = async () => {
    if (
      props.addUpdateEntitlementRuleAction === 'UPDATE_ENTITLEMENT_RULE' &&
      props.selectedProcessTypeForEntitlement
    ) {
      const processTypeCode = props.selectedProcessTypeForEntitlement;
      await form.setFieldsValue({ process: processTypeCode });
      (await entitlementRuleIdForUpdate) && setIsProcessDropdownDisabled(true);
      await fetchTypesFromDB();
      await form.setFieldsValue({
        type: props.selectedTypeObjectForEntitlement?.id,
        title: props.entitlementTitle,
        effective_from: moment(props.entitlementEffectiveFrom, ['DD/MM/YYYY']),
      });
    }
  };

  useEffect(() => {
    update_useEffect_Fn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    props.selectedProcessTypeForEntitlement,
    props.typeObjectsForEntitlement.length,
  ]);

  //---------------------------------------

  useEffect(() => {
    form.resetFields();
    props.resetAddUpdateEntitlementRuleState();
    props.initEntitlementRuleConfig();
    loadDataFromDB();
    setIsProcessDropdownDisabled(false);
    checkForAddOrUpdate();
    checkForClone();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onFinishEntitlementRuleForm = async (formValues: any) => {
    const { type, title, effective_from } = formValues;

    // setIsSubmitButtonDisabled(true);
    if (props.addUpdateEntitlementRuleAction === 'ADD_ENTITLEMENT_RULE') {
      props.addUpdateEntitlementRule({
        type,
        title,
        effective_from,
        onSuccess: () => {
          message.success({
            content: `${title} Entitlement Rule Created`,
            key: 'CREATE_ENTITLEMENT_RULE',
          });
          setTimeout(() => {
            // setIsSubmitButtonDisabled(false);
            history.push('/setup/entitlement-rules/');
          }, 3000);
        },
        onFailure: () => {
          // setIsSubmitButtonDisabled(false);
          message.error('Unable to create entitlement rule.');
        },
      });
    } else {
      props.updateEntitlementRule({
        ruleId: entitlementRuleIdForUpdate,
        type,
        title,
        effective_from,
        onSuccess: () => {
          message.success({
            content: `${title} Entitlement Rule Updated.`,
            key: 'CREATE_ENTITLEMENT_RULE',
          });
          setTimeout(() => {
            // setIsSubmitButtonDisabled(false);
            history.push('/setup/entitlement-rules/');
          }, 3000);
        },
        onFailure: () => {
          // setIsSubmitButtonDisabled(false);
          message.error('Unable to update entitlement rule.');
        },
      });
    }
  };

  const onAddNewCustomSection = () => {
    props.initCurrentSectionDataForEntitlement('CUSTOM');
    props.setDrawerActionForEntitlement('ADD');
    props.setDrawerForEntitlement('CUSTOM');
    props.setDrawerTitleForEntitlement('Set New Criteria');
    props.setCurrentEditingSectionIndexForEntitlement(null);
    setIsDrawerOpen(true);
  };

  const onEditCustomSection = ({
    indexToBeEdited,
  }: {
    indexToBeEdited: number;
  }) => {
    props.populateCurrentSectionDataForEntitlement(indexToBeEdited);
    props.setDrawerActionForEntitlement('EDIT');
    props.setDrawerForEntitlement('CUSTOM');
    props.setDrawerTitleForEntitlement(`Edit Criteria ${indexToBeEdited + 1}`);
    props.setCurrentEditingSectionIndexForEntitlement(indexToBeEdited);
    setIsDrawerOpen(true);
  };

  const onAddNewDefaultSection = () => {
    props.initCurrentSectionDataForEntitlement('DEFAULT');
    props.setDrawerActionForEntitlement('ADD');
    props.setDrawerForEntitlement('DEFAULT');
    props.setDrawerTitleForEntitlement('Default Criteria');
    props.setCurrentEditingSectionIndexForEntitlement(null);
    setIsDrawerOpen(true);
  };

  const onEditDefaultSection = () => {
    props.populateDefaultSectionDataForEntitlement();
    props.setDrawerActionForEntitlement('EDIT');
    props.setDrawerForEntitlement('DEFAULT');
    props.setDrawerTitleForEntitlement('Default Criteria');
    props.setCurrentEditingSectionIndexForEntitlement(null);
    setIsDrawerOpen(true);
  };

  const onProcessTypeDropdownChange = (processTypeCode: string) => {
    props.initEntitlementRuleConfig();
    props.initReadableEntitlementRuleConfig();

    props.setSelectedProcessTypeForEntitlement(processTypeCode);
    // if (['EXPAPR', 'REQAPR', 'BENAPR'].includes(processTypeCode)) {
    fetchTypesFromDB();
    setIsTypeDropdownDisabled(false);
    form.setFieldsValue({ type: null, title: '' });
  };

  const onTypeDropdownChange = async (typeId: string, option: any) => {
    let suffix = '';

    const processType = form.getFieldValue('process');
    suffix = 'Entitlement Rule';
    props.fetchBenefitTypesLegalEntitiesForEntitlement({
      typeId,
      process: processType,
    });
    const selectedTypeId = props.typeObjectsForEntitlement?.find(
      (item: any) => item.id === option.value,
    );
    props.fetchAllDataForEntitlement(
      '',
      selectedTypeId.global_configuration,
      processType,
    );
    props._selectedBenefitTypeConfig(Number(option.key), processType);
    let selectedType = props.typeObjectsForEntitlement?.find(
      (item: any) => item.id === option.value,
    );
    form.setFieldsValue({
      title: `${selectedType.title} ${suffix}`,
    });
  };

  const onCloseDrawer = () => setIsDrawerOpen(false);

  let entitlementRulePreviewContainer;
  if (props.selectedProcessTypeForEntitlement) {
    entitlementRulePreviewContainer = (
      <div>
        {props?.readableEntitlementRuleConfig?.custom?.map(
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
                  <div>
                    <Trans>Criteria</Trans> {customItemIndex + 1}
                  </div>
                  <div>
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
                        props.removeCustomSectionForEntitlement({
                          toBeRemovedIndex: customItemIndex,
                        })
                      }
                    >
                      <Trans>Remove</Trans>
                    </Button>
                  </div>
                </div>
                <EntitlementRuleSectionPreview
                  selectedProcessTypeForEntitlement={
                    props.selectedProcessTypeForEntitlement
                  }
                  config={config}
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
              {props.getIfDefaultCriteraForEntitlementTouched &&
                (!props.readableEntitlementRuleConfig.default?.rule
                  .is_no_entitlement ||
                  props.readableEntitlementRuleConfig.default?.rule.fields
                    ?.length > 0) && (
                  <Button type='link' onClick={() => onEditDefaultSection()}>
                    <Trans>Edit</Trans>
                  </Button>
                )}
            </div>
          </div>
          {!props.readableEntitlementRuleConfig.default?.rule
            .is_no_entitlement ||
          props.readableEntitlementRuleConfig.default?.rule.fields?.length >
            0 ? (
            <EntitlementRuleSectionPreview
              selectedProcessTypeForEntitlement={
                props.selectedProcessTypeForEntitlement
              }
              config={config}
              currentSectionData={props.readableEntitlementRuleConfig.default}
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
        props.addUpdateEntitlementRuleAction === 'ADD_ENTITLEMENT_RULE'
          ? { title: <Trans>Add Entitlement Rule</Trans> }
          : { title: <Trans>Update Entitlement Rule</Trans> }
      }
    >
      <div className='add-rule-container'>
        <div className='title-h2'>
          <BackButton
            data-test='backButton'
            backBtnUrl={appPath.config_setup.entitlementRules.path}
          />
        </div>
        <Form
          layout='vertical'
          form={form}
          onFinish={onFinishEntitlementRuleForm}
        >
          <Row>
            <Col xs={{ span: 24 }} xl={{ span: 12 }}>
              <Form.Item
                name='process'
                label={<Trans>Process</Trans>}
                rules={[
                  { required: true, message: 'Please select process type' },
                ]}
              >
                <Select
                  showSearch
                  style={{ width: '100%' }}
                  placeholder='Select process'
                  optionFilterProp='children'
                  disabled={isProcessDropdownDisabled}
                  value={props.selectedProcessTypeForEntitlement}
                  onChange={onProcessTypeDropdownChange}
                >
                  {props.processTypesForEntitlement?.map(
                    (item: any, index: number) => {
                      return (
                        <Option key={index} value={item.code}>
                          {item.title}
                        </Option>
                      );
                    },
                  )}
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
                  onChange={onTypeDropdownChange}
                >
                  {props.typeObjectsForEntitlement?.map(
                    (item: any, _index: number) => {
                      return (
                        <Option
                          key={item.global_configuration}
                          value={item.id}
                          disabled={item.is_entitlement_rule_exists}
                          title={
                            item.is_entitlement_rule_exists
                              ? `Rule for ${item.title} already exists`
                              : ''
                          }
                        >
                          {item.title} ({item.code})
                        </Option>
                      );
                    },
                  )}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col xs={{ span: 24 }} xl={{ span: 12 }}>
              <Form.Item
                name='title'
                label={<Trans>Entitlement rule title</Trans>}
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
                    props.addUpdateEntitlementRuleAction ===
                      'ADD_ENTITLEMENT_RULE' && isTypeDropdownDisabled
                  }
                ></Input>
              </Form.Item>
            </Col>
          </Row>

          {props.selectedProcessTypeForEntitlement ? (
            <Row>
              <Col xs={{ span: 24 }} xl={{ span: 12 }}>
                <Form.Item
                  name='effective_from'
                  label={<Trans>Effective From</Trans>}
                  rules={[
                    {
                      required: true,
                      validator(_, value) {
                        // if (value !== undefined) {
                        //   value = value?.trim();
                        // }
                        if (!value || value === undefined) {
                          return Promise.reject(
                            'Please specify effective from',
                          );
                        }
                        return Promise.resolve();
                        // else {
                        //   if (new RegExp(/^[^@!=\-+#﹘—⸺⸻].*$/).test(value)) {
                        //     return Promise.resolve();
                        //   }
                        //   if (!value || value === undefined) {
                        //     return Promise.resolve();
                        //   }
                        //   return Promise.reject(
                        //     new Error('Can not start with special character'),
                        //   );
                        // }
                      },
                    },
                  ]}
                >
                  <DatePicker
                    style={{ width: '14.5rem' }}
                    format='DD/MM/YYYY'
                    // disabledDate={current => {
                    //   return moment().add(-1, 'days') >= current;
                    // }}
                  />
                </Form.Item>
              </Col>
            </Row>
          ) : null}

          {/* <div>{JSON.stringify(props.entitlementRuleConfig, null, 2)}</div> */}
          <br />

          {entitlementRulePreviewContainer}

          <EntitlementRuleDrawer
            onCloseDrawer={onCloseDrawer}
            isDrawerOpen={isDrawerOpen}
          />

          <Form.Item>
            <Button
              type='primary'
              htmlType='submit'
              disabled={
                !props.getIfDefaultCriteraForEntitlementTouched ||
                !form.getFieldValue('title')
              }
            >
              {props.addUpdateEntitlementRuleAction ===
              'ADD_ENTITLEMENT_RULE' ? (
                <Trans>Create Entitlement Rule</Trans>
              ) : (
                <Trans>Update Entitlement Rule</Trans>
              )}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </HeaderBarWrapper>
  );
};

const connector = connect(mapStateToProps, mapDispatchToProps);
export default memo(connector(AddEntitlementRule));
