import axios from '../../utils/reimAxios.utils';

export const fetchProcessTypesAPI = () => axios.get('/rules/process-types/');

export const fetchAllDataAPI = () => axios.get('/rules/all-data/');

// to be deprecated
export const fetchAllDataEXPAPRAPI = () =>
  axios.get('/rules/all-data/?process=EXPAPR');

export const fetchExpenseTypesAPI = ({
  processType,
}: {
  processType: string;
}) => axios.get(`/expense-types/?dropdown=true&rule_type=${processType}`);

export const fetchExpenseTypesLegalEntityDropdownAPI = ({
  expenseTypeId,
}: {
  expenseTypeId: string;
}) =>
  axios.get(`/expense-types/${expenseTypeId}/legal-entities/?dropdown=true`);

export const fetchRequestTypesAPI = ({
  processType,
}: {
  processType: string;
}) => axios.get(`/request-types/?dropdown=true&rule_type=${processType}`);

export const fetchRequestTypesLegalEntityDropdownAPI = ({
  requestTypeId,
}: {
  requestTypeId: string;
}) =>
  axios.get(`/request-types/${requestTypeId}/legal-entities/?dropdown=true`);

export const fetchEmployeeIDsAPI = () =>
  axios.get('/employee-basic-informations/?dropdown=true');
export const fetchEmployeeGroupsAPI = () =>
  axios.get('/employee-groups/?dropdown=true');

export const fetchGendersAPI = () =>
  axios.get('/reference-objects/items-by-title/?title=Gender');
export const fetchMaritalStatusesAPI = () =>
  axios.get('/reference-objects/items-by-title/?title=Marital Status');
export const fetchContractTypeAPI = () =>
  axios.get('/reference-objects/items-by-title/?title=Contract Type');
export const fetchRefObjEmployeeGroupAPI = () =>
  axios.get('/reference-objects/items-by-title/?title=Employee Group');
export const fetchEmployeeSubGroupAPI = () =>
  axios.get('/reference-objects/items-by-title/?title=Employee Sub Group');
export const fetchPayGradeAPI = () =>
  axios.get('/reference-objects/items-by-title/?title=Pay Grade');

export const createRuleAPI = (data: any) => axios.post('/rules/', data);
export const updateRuleAPI = (ruleId: number, data: any) =>
  axios.put(`/rules/${ruleId}/`, data);

export const fetchRulesAPI = (page = 1, size = 10) =>
  axios.get(`/rules/?page=${page}&page_size=${size}`);

export const fetchRulesByQueryAPI = (query: string, page = 1, size = 10) =>
  axios.get(`/rules/?page=${page}&page_size=${size}&query=${query}`);

export const fetchRuleByIdAPI = (id: number) => axios.get(`/rules/${id}/`);

export const deleteRuleAPI = (id: number) => axios.delete(`/rules/${id}/`);

export const fetchCostCentresAPI = () =>
  axios.get('/cost-centres/?dropdown=true&active_today=yes');

export const fetchBenefitTypesAPI = ({
  processType,
}: {
  processType: string;
}) => axios.get(`/benefit-types/?dropdown=true&rule_type=${processType}`);

export const fetchBenefitTypesLegalEntityDropdownAPI = ({
  benefitTypeId,
}: {
  benefitTypeId: string;
}) =>
  axios.get(`/benefit-types/${benefitTypeId}/legal-entities/?dropdown=true`);

export const fetchApproversCustomFieldsAPI = (
  page: number,
  pageSize?: number,
) =>
  axios.get(
    `/employee-approver-custom-fields/?page=${page}&page_size=${pageSize}`,
  );
