import { Dispatch } from 'react';
import moment from 'moment';
import {
  fetchProcessTypesForEntitlementAPI,
  fetchBenefitTypesLegalEntityDropdownForEntitlementAPI,
  fetchExpenseTypesLegalEntityDropdownForEntitlementAPI,
  fetchBenefitTypesForEntitlementAPI,
  fetchExpenseTypesForEntitlementAPI,
  createEntitlementRuleAPI,
  updateEntitlementRuleAPI,
  fetchEntitlementRuleByIdAPI,
  fetchAllDataForEntitlementAPI,
  fetchAllDataForEntitlementEXPAPRAPI,
  fetchGendersAPI,
  fetchMaritalStatusesAPI,
  fetchContractTypeAPI,
  fetchRefObjEmployeeGroupAPI,
  fetchEmployeeSubGroupAPI,
  fetchEmployeeGroupsAPI,
  fetchEmployeeIDsAPI,
  fetchPayGradeAPI,
  selectedExpenseTypeConfigAPI,
  selectedBenefitTypeConfigAPI,
} from '../../../../services/entitlement';

import { message } from 'antd';
import {
  cleanEntitlementRuleConfigBeforeAddUpdate,
  handleEntityHeadValuesForUpdateForEntitlement,
  setEntitlementRuleConfig,
  setEntitlementRuleTitle,
  setProcessTypesForEntitlement,
  setReadableEntitlementRuleConfig,
  setSelectedProcessTypeForEntitlement,
  setSelectedTypeObjectForEntitlement,
  setTypeObjectsForEntitlement,
  setLegalEntitiesForEntitlement,
  setOptionsForEntitlement,
  setOperatorsForEntitlement,
  setGendersForEntitlement,
  setMaritalStatusesForEntitlement,
  setContractTypesForEntitlement,
  setRefObjEmpGroupsForEntitlement,
  setEmpSubGroupsForEntitlement,
  setEmpGroupsForEntitlement,
  setEmployeeIdsForEntitlement,
  setAllowedStepOwnersForEntitlement,
  setAllowedFallbackStepOwnersForEntitlement,
  setPayGradesForEntitlement,
  addSelectedBenefitTypeConfig,
  addSelectedBenefitTypeConfigError,
  setEntitlementEffectiveFrom,
} from './addUpdateEntitlementRule.action';

export const fetchProcessTypesForEntitlement = () => {
  return async (dispatch: Dispatch<any>) => {
    try {
      const response = await fetchProcessTypesForEntitlementAPI();
      dispatch(setProcessTypesForEntitlement(response.data));
    } catch (e) {
      dispatch(setProcessTypesForEntitlement([]));
    }
  };
};

export const fetchBenefitTypesLegalEntitiesForEntitlement = ({
  typeId,
  process,
}: {
  typeId: string;
  process: string;
}) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      const response =
        process === 'BEN'
          ? await fetchBenefitTypesLegalEntityDropdownForEntitlementAPI({
              benefitTypeId: typeId,
            })
          : await fetchExpenseTypesLegalEntityDropdownForEntitlementAPI({
              expenseTypeId: typeId,
            });
      dispatch(setLegalEntitiesForEntitlement(response.data));
    } catch (e) {
      dispatch(setLegalEntitiesForEntitlement([]));
    }
  };
};

export const fetchBenefitTypesForEntitlement = ({
  processType,
}: {
  processType: string;
}) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      const response =
        processType === 'BEN'
          ? await fetchBenefitTypesForEntitlementAPI({
              processType,
            })
          : await fetchExpenseTypesForEntitlementAPI({ processType });
      dispatch(setTypeObjectsForEntitlement(response.data));
    } catch (e) {
      dispatch(setTypeObjectsForEntitlement([]));
    }
  };
};

export const addUpdateEntitlementRule = ({
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
}) => {
  return async (dispatch: Dispatch<any>, getState: any) => {
    dispatch(cleanEntitlementRuleConfigBeforeAddUpdate());
    const ruleConfig = getState().addUpdateEntitlementRule
      .entitlement_rule_config;
    const selectedProcessType = getState().addUpdateEntitlementRule
      .selected_process_type;
    if (selectedProcessType === 'EXP') {
      // eslint-disable-next-line array-callback-return
      ruleConfig.custom.map((item: any) => {
        if (
          !item.rule.is_no_entitlement &&
          !item.rule.fields.is_unlimited_amount
        ) {
          const customRuleFields = {
            max_amount: item.rule.fields.max_amount,
            min_amount: item.rule.fields.min_amount,
            is_unlimited_amount: item.rule.fields?.is_unlimited_amount || false,
          };
          item.rule.fields = customRuleFields;
        } else {
          const customRuleFields = {
            is_unlimited_amount: item.rule.fields?.is_unlimited_amount || false,
          };
          item.rule.fields = item.rule.is_no_entitlement
            ? {}
            : customRuleFields;
        }
      });
      if (
        !ruleConfig.default.rule.is_no_entitlement &&
        !ruleConfig.default.rule.fields.is_unlimited_amount
      ) {
        ruleConfig.default.rule.fields = {
          max_amount: ruleConfig.default.rule.fields.max_amount,
          min_amount: ruleConfig.default.rule.fields.min_amount,
          is_unlimited_amount:
            ruleConfig.default.rule.fields?.is_unlimited_amount || false,
        };
      } else {
        ruleConfig.default.rule.fields = {
          is_unlimited_amount:
            ruleConfig.default.rule.fields?.is_unlimited_amount || false,
        };
      }
      ruleConfig.default.rule.fields = ruleConfig.default.rule.is_no_entitlement
        ? {}
        : ruleConfig.default.rule.fields;
    }

    message.loading({ content: 'Creating rule', key: 'CREATE_RULE' });
    const type_key_name_map: any = {
      EXP: 'expense_type',
      BEN: 'benefit_type',
    };

    const data: any = {
      process: selectedProcessType,
      effective_from: effective_from.format('YYYY-MM-DD'),
      title,
      configuration: ruleConfig,
    };

    data[type_key_name_map[selectedProcessType]] = type;
    // eslint-disable-next-line no-console

    try {
      await createEntitlementRuleAPI(data);
      onSuccess();
    } catch (error) {
      onFailure();
      // eslint-disable-next-line no-console
    }
  };
};

export const updateEntitlementRule = ({
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
}) => {
  return async (dispatch: Dispatch<any>, getState: any) => {
    dispatch(cleanEntitlementRuleConfigBeforeAddUpdate());
    const ruleConfig = getState().addUpdateEntitlementRule
      .entitlement_rule_config;
    const selectedProcessType = getState().addUpdateEntitlementRule
      .selected_process_type;

    if (selectedProcessType === 'EXP') {
      // eslint-disable-next-line array-callback-return
      ruleConfig.custom.map((item: any) => {
        if (
          !item.rule.is_no_entitlement &&
          !item.rule.fields.is_unlimited_amount
        ) {
          const customRuleFields = {
            max_amount: item.rule.fields.max_amount,
            min_amount: item.rule.fields.min_amount,
            is_unlimited_amount: item.rule.fields.is_unlimited_amount,
          };
          item.rule.fields = customRuleFields;
        } else {
          const customRuleFields = {
            is_unlimited_amount: item.rule.fields.is_unlimited_amount,
          };
          item.rule.fields = customRuleFields;
        }
      });

      if (
        !ruleConfig.default.rule.is_no_entitlement &&
        !ruleConfig.default.rule.fields.is_unlimited_amount
      ) {
        ruleConfig.default.rule.fields = {
          max_amount: ruleConfig.default.rule.fields.max_amount,
          min_amount: ruleConfig.default.rule.fields.min_amount,
          is_unlimited_amount:
            ruleConfig.default.rule.fields.is_unlimited_amount,
        };
      } else {
        ruleConfig.default.rule.fields = {
          is_unlimited_amount:
            ruleConfig.default.rule.fields.is_unlimited_amount,
        };
      }
    }
    message.loading({ content: 'Updating rule', key: 'CREATE_RULE' });
    const type_key_name_map: any = {
      EXP: 'expense_type',
      BEN: 'benefit_type',
    };

    const data: any = {
      process: selectedProcessType,
      title,
      effective_from: effective_from.format('YYYY-MM-DD'),
      configuration: ruleConfig,
    };
    data[type_key_name_map[selectedProcessType]] = type;
    // eslint-disable-next-line no-console

    try {
      await updateEntitlementRuleAPI(ruleId, data);
      onSuccess();
    } catch (error) {
      onFailure();
      // eslint-disable-next-line no-console
    }
  };
};

export const fetchEntitlementRuleByID = (id: number, isClone = false) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      const response = await fetchEntitlementRuleByIdAPI(id);
      const data = response.data;
      const process = data.benefit_type ? 'BEN' : 'EXP';
      const config_id =
        process === 'BEN'
          ? data.benefit_type.global_configuration
          : data.expense_type.global_configuration;
      let config = data.configuration;
      let readableConfig = data.readable_configuration;

      isClone &&
        dispatch(setEntitlementEffectiveFrom(moment().format('DD/MM/YYYY')));

      if (isClone) {
        config = {
          custom: data.configuration.custom.map((item: any) => {
            return {
              criterias: item.criterias,
              entities: [],
              rule: {
                fields: item.rule.fields,
                is_no_entitlement: true,
              },
            };
          }),

          default: {
            rule: {
              fields: {},
              is_no_entitlement: true,
            },
          },
        };
        readableConfig = {
          custom: data.readable_configuration.custom.map((item: any) => {
            return {
              criterias: item.criterias,
              entities: [],
              rule: {
                fields: item.rule.fields,
                is_no_entitlement: true,
              },
            };
          }),

          default: {
            rule: {
              fields: {},
              is_no_entitlement: true,
            },
          },
        };
      }

      dispatch(setEntitlementRuleConfig(config));
      dispatch(setReadableEntitlementRuleConfig(readableConfig));
      dispatch(fetchAllDataForEntitlement(null, config_id, process));
      if (!isClone) {
        dispatch(setSelectedProcessTypeForEntitlement(data.process.code));
        dispatch(setEntitlementRuleTitle(data.title));
        dispatch(setEntitlementEffectiveFrom(data.effective_from));
      }
      if ((data.benefit_type?.id || data.expense_type?.id) && !isClone) {
        const typeId = data.benefit_type?.id
          ? data.benefit_type?.id
          : data.expense_type?.id;
        const selectedObject = data.benefit_type
          ? data.benefit_type
          : data.expense_type;
        dispatch(
          fetchBenefitTypesLegalEntitiesForEntitlement({
            typeId: typeId,
            process,
          }),
        );
        dispatch(setSelectedTypeObjectForEntitlement(selectedObject));
      }
      dispatch(handleEntityHeadValuesForUpdateForEntitlement());
    } catch (e) {}
  };
};

export const fetchAllDataForEntitlement = (
  process: string | null = null,
  id: any,
  type: any,
) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      let response;
      if (process === 'EXPAPR') {
        // to be deprecated
        response = await fetchAllDataForEntitlementEXPAPRAPI();
      } else {
        response = await fetchAllDataForEntitlementAPI(id, type);
      }
      dispatch(setOptionsForEntitlement(response.data['options']));
      dispatch(setOperatorsForEntitlement(response.data['operators']));
      dispatch(
        setAllowedStepOwnersForEntitlement(
          response.data['allowed_step_owners'],
        ),
      );
      dispatch(
        setAllowedFallbackStepOwnersForEntitlement(
          response.data['allowed_fallback_step_owners'],
        ),
      );
    } catch (e) {
      dispatch(setOptionsForEntitlement([]));
      dispatch(setOperatorsForEntitlement([]));
      dispatch(setAllowedStepOwnersForEntitlement([]));
      dispatch(setAllowedFallbackStepOwnersForEntitlement([]));
    }
  };
};

export const fetchGenders = () => {
  return async (dispatch: Dispatch<any>) => {
    try {
      const response = await fetchGendersAPI();
      dispatch(setGendersForEntitlement(response.data));
    } catch (e) {
      dispatch(setGendersForEntitlement([]));
    }
  };
};

export const selectedBenefitTypeConfig = (typeId: number, process: string) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      const res =
        process === 'BEN'
          ? await selectedBenefitTypeConfigAPI(typeId)
          : await selectedExpenseTypeConfigAPI(typeId);
      dispatch(addSelectedBenefitTypeConfig(res.data));
    } catch (e) {
      dispatch(
        addSelectedBenefitTypeConfigError(
          'Failed to fetch Benefit Configuration',
        ),
      );
    }
  };
};
export const fetchMaritalStatuses = () => {
  return async (dispatch: Dispatch<any>) => {
    try {
      const response = await fetchMaritalStatusesAPI();
      dispatch(setMaritalStatusesForEntitlement(response.data));
    } catch (e) {
      dispatch(setMaritalStatusesForEntitlement([]));
    }
  };
};

export const fetchContractTypes = () => {
  return async (dispatch: Dispatch<any>) => {
    try {
      const response = await fetchContractTypeAPI();
      dispatch(setContractTypesForEntitlement(response.data));
    } catch (e) {
      dispatch(setContractTypesForEntitlement([]));
    }
  };
};

export const fetchRefObjEmpGroups = () => {
  return async (dispatch: Dispatch<any>) => {
    try {
      const response = await fetchRefObjEmployeeGroupAPI();
      dispatch(setRefObjEmpGroupsForEntitlement(response.data));
    } catch (e) {
      dispatch(setRefObjEmpGroupsForEntitlement([]));
    }
  };
};

export const fetchEmpSubGroups = () => {
  return async (dispatch: Dispatch<any>) => {
    try {
      const response = await fetchEmployeeSubGroupAPI();
      dispatch(setEmpSubGroupsForEntitlement(response.data));
    } catch (e) {
      dispatch(setEmpSubGroupsForEntitlement([]));
    }
  };
};

export const fetchEmpGroups = () => {
  return async (dispatch: Dispatch<any>) => {
    try {
      const response = await fetchEmployeeGroupsAPI();
      dispatch(setEmpGroupsForEntitlement(response.data));
    } catch (e) {
      dispatch(setEmpGroupsForEntitlement([]));
    }
  };
};

export const fetchEmployeeIds = () => {
  return async (dispatch: Dispatch<any>) => {
    try {
      const response = await fetchEmployeeIDsAPI();
      dispatch(setEmployeeIdsForEntitlement(response.data));
    } catch (e) {
      dispatch(setEmployeeIdsForEntitlement([]));
    }
  };
};

export const fetchPayGrades = () => {
  return async (dispatch: Dispatch<any>) => {
    try {
      const response = await fetchPayGradeAPI();
      dispatch(setPayGradesForEntitlement(response.data));
    } catch (e) {
      dispatch(setPayGradesForEntitlement([]));
    }
  };
};
