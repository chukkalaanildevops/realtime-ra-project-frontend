import axios from '../../utils/reimAxios.utils';

export const fetchProcessTypesForEntitlementAPI = () =>
  axios.get(`/entitlement-rule/process-types/`);

export const fetchAllDataForEntitlementAPI = (config_id: any, process: any) =>
  axios.get(
    `entitlement-rule/all-data/?config_id=${config_id}&process=${process}`,
  );

// to be deprecated
export const fetchAllDataForEntitlementEXPAPRAPI = () =>
  axios.get('entitlement-rule/all-data/?process=EXPAPR');

export const fetchGendersAPI = () =>
  axios.get('/reference-objects/items-by-title/?title=Gender');
export const fetchMaritalStatusesAPI = () =>
  axios.get('/reference-objects/items-by-title/?title=Marital Status');
export const fetchContractTypeAPI = () =>
  axios.get('/reference-objects/items-by-title/?title=Contract Type');
export const fetchEmployeeIDsAPI = () =>
  axios.get('/employee-basic-informations/?dropdown=true');
export const fetchEmployeeGroupsAPI = () =>
  axios.get('/employee-groups/?dropdown=true');
export const fetchRefObjEmployeeGroupAPI = () =>
  axios.get('/reference-objects/items-by-title/?title=Employee Group');
export const fetchEmployeeSubGroupAPI = () =>
  axios.get('/reference-objects/items-by-title/?title=Employee Sub Group');
export const fetchPayGradeAPI = () =>
  axios.get('/reference-objects/items-by-title/?title=Pay Grade');

export const fetchEntitlementRulesAPI = (page = 1, size = 10, query = '') =>
  axios.get(`/entitlement-rule/?page=${page}&page_size=${size}&q=${query}`);

export const fetchEntitlementRuleByIdAPI = (id: number) =>
  axios.get(`/entitlement-rule/${id}/`);

export const fetchBenefitTypesLegalEntityDropdownForEntitlementAPI = ({
  benefitTypeId,
}: {
  benefitTypeId: string;
}) =>
  axios.get(`/benefit-types/${benefitTypeId}/legal-entities/?dropdown=true`);

export const fetchExpenseTypesLegalEntityDropdownForEntitlementAPI = ({
  expenseTypeId,
}: {
  expenseTypeId: string;
}) =>
  axios.get(`/expense-types/${expenseTypeId}/legal-entities/?dropdown=true`);

export const fetchBenefitTypesForEntitlementAPI = ({
  processType,
}: {
  processType: string;
}) => axios.get(`/benefit-types/?dropdown=true&rule_type=${processType}`);

export const fetchExpenseTypesForEntitlementAPI = ({
  processType,
}: {
  processType: string;
}) => axios.get(`/expense-types/?dropdown=true&rule_type=${processType}`);

export const createEntitlementRuleAPI = (data: any) =>
  axios.post('/entitlement-rule/', data);

export const updateEntitlementRuleAPI = (ruleId: number, data: any) =>
  axios.put(`/entitlement-rule/${ruleId}/`, data);

export const fetchEntitlementRulesByQueryAPI = (
  query: string,
  page = 1,
  size = 10,
) =>
  axios.get(`/entitlement-rule/?page=${page}&page_size=${size}&query=${query}`);

export const deleteEntitlementRuleAPI = (id: number) =>
  axios.delete(`/entitlement-rule/${id}/`);

export const selectedBenefitTypeConfigAPI = (typeId: number) =>
  axios.get(`/benefit-type-configurations/${typeId}/?with_legal_entity=false`);

export const selectedExpenseTypeConfigAPI = (typeId: number) =>
  axios.get(`/expense-type-configurations/${typeId}/?with_legal_entity=false`);

export const executeBenefitEntitlementRuleAPI = (id: number) =>
  axios.post(`/benefit-entitlement/${id}/execute-single-entitlement/`);

export const executeExpenseEntitlementRuleAPI = (id: number) =>
  axios.post(`/expense-entitlement/${id}/execute-single-expense-entitlement/`);

export const simulateEntitlementRuleAPI = (id: number, data: any) =>
  axios.post(`/entitlement-rule/${id}/simulate-single-entitlement/`, data);

export const getSimulatedDataAPI = (id: number, page = 1, size = 10) =>
  axios.get(
    `/entitlement-rule/${id}/simulation-history/?page=${page}&page_size=${size}`,
  );

export const getSimulatedDataByIdAPI = (id: number, page = 1, size = 10) =>
  axios.get(
    `/entitlement-rule/${id}/get-simulated-data/?page=${page}&page_size=${size}`,
  );

export const downloadCSVResultsAPI = (id: any) =>
  axios.post(`/entitlement-rule/${id}/download-simulated-data/`);
