import { Dispatch } from 'react';
import {
  fetchProcessTypesAPI,
  fetchAllDataAPI,
  fetchAllDataEXPAPRAPI,
  fetchExpenseTypesAPI,
  fetchExpenseTypesLegalEntityDropdownAPI,
  fetchRequestTypesAPI,
  fetchRequestTypesLegalEntityDropdownAPI,
  fetchGendersAPI,
  fetchMaritalStatusesAPI,
  fetchContractTypeAPI,
  fetchRefObjEmployeeGroupAPI,
  fetchEmployeeSubGroupAPI,
  fetchEmployeeGroupsAPI,
  fetchEmployeeIDsAPI,
  createRuleAPI,
  fetchRuleByIdAPI,
  updateRuleAPI,
  fetchCostCentresAPI,
  fetchBenefitTypesAPI,
  fetchBenefitTypesLegalEntityDropdownAPI,
  fetchPayGradeAPI,
  fetchApproversCustomFieldsAPI,
} from '../../../../services/rules';

import {
  setProcessTypes,
  setTypeObjects,
  setOptions,
  setOperators,
  setGenders,
  setMaritalStatuses,
  setContractTypes,
  setRefObjEmpGroups,
  setEmpSubGroups,
  setEmpGroups,
  setEmployeeIds,
  setLegalEntities,
  setAllowedStepOwners,
  setAllowedFallbackStepOwners,
  cleanRuleConfigBeforeAddUpdate,
  setSelectedProcessType,
  setSelectedTypeObject,
  setRuleTitle,
  setRuleConfig,
  setReadableRuleConfig,
  handleEntityHeadValuesForUpdate,
  setCostCentres,
  setPayGrades,
  setApproversCustomFields,
} from './addUpdateRule.action';
import { message } from 'antd';

export const fetchProcessTypes = () => {
  return async (dispatch: Dispatch<any>) => {
    try {
      const response = await fetchProcessTypesAPI();
      dispatch(setProcessTypes(response.data));
    } catch (e) {
      dispatch(setProcessTypes([]));
    }
  };
};

export const fetchAllData = (process: string | null = null) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      let response;
      if (process === 'EXPAPR') {
        // to be deprecated
        response = await fetchAllDataEXPAPRAPI();
      } else {
        response = await fetchAllDataAPI();
      }
      dispatch(setOptions(response.data['options']));
      dispatch(setOperators(response.data['operators']));
      dispatch(setAllowedStepOwners(response.data['allowed_step_owners']));
      dispatch(
        setAllowedFallbackStepOwners(
          response.data['allowed_fallback_step_owners'],
        ),
      );
    } catch (e) {
      dispatch(setOptions([]));
      dispatch(setOperators([]));
      dispatch(setAllowedStepOwners([]));
      dispatch(setAllowedFallbackStepOwners([]));
    }
  };
};

export const fetchGenders = () => {
  return async (dispatch: Dispatch<any>) => {
    try {
      const response = await fetchGendersAPI();
      dispatch(setGenders(response.data));
    } catch (e) {
      dispatch(setGenders([]));
    }
  };
};

export const fetchMaritalStatuses = () => {
  return async (dispatch: Dispatch<any>) => {
    try {
      const response = await fetchMaritalStatusesAPI();
      dispatch(setMaritalStatuses(response.data));
    } catch (e) {
      dispatch(setMaritalStatuses([]));
    }
  };
};

export const fetchContractTypes = () => {
  return async (dispatch: Dispatch<any>) => {
    try {
      const response = await fetchContractTypeAPI();
      dispatch(setContractTypes(response.data));
    } catch (e) {
      dispatch(setContractTypes([]));
    }
  };
};

export const fetchRefObjEmpGroups = () => {
  return async (dispatch: Dispatch<any>) => {
    try {
      const response = await fetchRefObjEmployeeGroupAPI();
      dispatch(setRefObjEmpGroups(response.data));
    } catch (e) {
      dispatch(setRefObjEmpGroups([]));
    }
  };
};

export const fetchEmpSubGroups = () => {
  return async (dispatch: Dispatch<any>) => {
    try {
      const response = await fetchEmployeeSubGroupAPI();
      dispatch(setEmpSubGroups(response.data));
    } catch (e) {
      dispatch(setEmpSubGroups([]));
    }
  };
};

export const fetchEmpGroups = () => {
  return async (dispatch: Dispatch<any>) => {
    try {
      const response = await fetchEmployeeGroupsAPI();
      dispatch(setEmpGroups(response.data));
    } catch (e) {
      dispatch(setEmpGroups([]));
    }
  };
};

export const fetchEmployeeIds = () => {
  return async (dispatch: Dispatch<any>) => {
    try {
      const response = await fetchEmployeeIDsAPI();
      dispatch(setEmployeeIds(response.data));
    } catch (e) {
      dispatch(setEmployeeIds([]));
    }
  };
};

export const fetchExpenseTypesLegalEntities = ({
  expenseTypeId,
}: {
  expenseTypeId: string;
}) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      const response = await fetchExpenseTypesLegalEntityDropdownAPI({
        expenseTypeId,
      });
      dispatch(setLegalEntities(response.data));
    } catch (e) {
      dispatch(setLegalEntities([]));
    }
  };
};

export const fetchRequestTypesLegalEntities = ({
  requestTypeId,
}: {
  requestTypeId: string;
}) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      const response = await fetchRequestTypesLegalEntityDropdownAPI({
        requestTypeId,
      });
      dispatch(setLegalEntities(response.data));
    } catch (e) {
      dispatch(setLegalEntities([]));
    }
  };
};

export const fetchExpenseTypes = ({ processType }: { processType: string }) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      const response = await fetchExpenseTypesAPI({
        processType,
      });
      dispatch(setTypeObjects(response.data));
    } catch (e) {
      dispatch(setTypeObjects([]));
    }
  };
};

export const fetchRequestTypes = ({ processType }: { processType: string }) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      const response = await fetchRequestTypesAPI({
        processType,
      });
      dispatch(setTypeObjects(response.data));
    } catch (e) {
      dispatch(setTypeObjects([]));
    }
  };
};

export const addUpdateRule = ({
  type,
  title,
  onSuccess,
  onFailure,
}: {
  type: number;
  title: string;
  onSuccess: Function;
  onFailure: Function;
}) => {
  return async (dispatch: Dispatch<any>, getState: any) => {
    dispatch(cleanRuleConfigBeforeAddUpdate());
    const ruleConfig = getState().addUpdateRule.rule_config;
    const selectedProcessType = getState().addUpdateRule.selected_process_type;

    message.loading({ content: 'Creating rule', key: 'CREATE_RULE' });
    const type_key_name_map: any = {
      EXPAPR: 'expense_type',
      REQAPR: 'request_type',
      BENAPR: 'benefit_type',
    };

    const data: any = {
      process: selectedProcessType,
      title,
      configuration: ruleConfig,
    };

    data[type_key_name_map[selectedProcessType]] = type;
    // eslint-disable-next-line no-console

    try {
      await createRuleAPI(data);
      onSuccess();
    } catch (error) {
      onFailure();
      // eslint-disable-next-line no-console
    }
  };
};

export const updateRule = ({
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
}) => {
  return async (dispatch: Dispatch<any>, getState: any) => {
    dispatch(cleanRuleConfigBeforeAddUpdate());
    const ruleConfig = getState().addUpdateRule.rule_config;
    const selectedProcessType = getState().addUpdateRule.selected_process_type;

    message.loading({ content: 'Updating rule', key: 'CREATE_RULE' });
    const type_key_name_map: any = {
      EXPAPR: 'expense_type',
      REQAPR: 'request_type',
      BENAPR: 'benefit_type',
    };

    const data: any = {
      process: selectedProcessType,
      title,
      configuration: ruleConfig,
    };
    data[type_key_name_map[selectedProcessType]] = type;
    // eslint-disable-next-line no-console

    try {
      await updateRuleAPI(ruleId, data);
      onSuccess();
    } catch (error) {
      onFailure();
      // eslint-disable-next-line no-console
    }
  };
};

export const fetchRuleByID = (id: number) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      const response = await fetchRuleByIdAPI(id);
      const data = response.data;
      dispatch(setSelectedProcessType(data.process.code));
      dispatch(setRuleTitle(data.title));
      dispatch(setRuleConfig(data.configuration));
      dispatch(setReadableRuleConfig(data.readable_configuration));
      dispatch(fetchAllData(null));
      if (data.expense_type) {
        dispatch(
          fetchExpenseTypesLegalEntities({
            expenseTypeId: data.expense_type.id,
          }),
        );
        dispatch(setSelectedTypeObject(data.expense_type));
      } else if (data.request_type) {
        dispatch(
          fetchRequestTypesLegalEntities({
            requestTypeId: data.request_type.id,
          }),
        );
        dispatch(setSelectedTypeObject(data.request_type));
      } else if (data.benefit_type) {
        dispatch(
          fetchBenefitTypesLegalEntities({
            benefitTypeId: data.benefit_type.id,
          }),
        );
        dispatch(setSelectedTypeObject(data.benefit_type));
      }
      dispatch(handleEntityHeadValuesForUpdate());
    } catch (e) {}
  };
};

export const fetchCostCentres = () => {
  return async (dispatch: Dispatch<any>) => {
    try {
      const response = await fetchCostCentresAPI();
      dispatch(setCostCentres(response.data));
    } catch (e) {
      dispatch(setCostCentres([]));
    }
  };
};

export const fetchBenefitTypes = ({ processType }: { processType: string }) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      const response = await fetchBenefitTypesAPI({
        processType,
      });
      dispatch(setTypeObjects(response.data));
    } catch (e) {
      dispatch(setTypeObjects([]));
    }
  };
};

export const fetchBenefitTypesLegalEntities = ({
  benefitTypeId,
}: {
  benefitTypeId: string;
}) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      const response = await fetchBenefitTypesLegalEntityDropdownAPI({
        benefitTypeId,
      });
      dispatch(setLegalEntities(response.data));
    } catch (e) {
      dispatch(setLegalEntities([]));
    }
  };
};

export const fetchPayGrades = () => {
  return async (dispatch: Dispatch<any>) => {
    try {
      const response = await fetchPayGradeAPI();
      dispatch(setPayGrades(response.data));
    } catch (e) {
      dispatch(setPayGrades([]));
    }
  };
};

export const fetchApproversCustomFields = (page: number, pageSize?: number) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      const response = await fetchApproversCustomFieldsAPI(page, pageSize);
      dispatch(setApproversCustomFields(response?.data?.data));
    } catch (e) {
      dispatch(setApproversCustomFields([]));
    }
  };
};
