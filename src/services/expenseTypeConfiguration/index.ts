import axios from '../../utils/reimAxios.utils';
import {
  TcreateExpenseTypeBody,
  IputExpenseTypeBody,
  IputCustomizeExpenseTypeBody,
  IExpenseTypeCategory,
  IExpenseTypeCategoryShort,
  ITitleAndCode,
} from '../../pages/expenseTypeConfiguration/expenseTypeConfiguration.model';

export const legalEntityAPI = () => {
  return axios.get('/legal-entities/?top_level=true');
};

export const fetchExpenseConfigAllowancesAPI = (body: any, search?: any) =>
  axios.get(`/allowance-rate/?drop_down=true&search=${search}`, body);

export const countryListAPI = () => {
  return axios.get('/countries/');
};

export const categoryAPI = () => {
  return axios.get('/expense-types/choices/?choice=category');
};

export const maximumClaimAmountPerPeriodDataAPI = () => {
  return axios.get('/expense-types/choices/?choice=period');
};

export const allowClaimsOnAPI = () => {
  return axios.get('/expense-types/choices/?choice=allow_claims_on');
};

export const labelMappingAPI = (category: IExpenseTypeCategory) => {
  let _type: IExpenseTypeCategoryShort =
    category === 'Petty Cash'
      ? 'petty'
      : (category.toLowerCase() as IExpenseTypeCategoryShort);
  // let _type: 'gen' | 'ptc' | 'ent' | 'mil' = 'gen';
  // switch (category) {
  //   case 'General':
  //     _type = 'gen';
  //     break;
  //   case 'Entertainment':
  //     _type = 'ent';
  //     break;
  //   case 'Mileage':
  //     _type = 'mil';
  //     break;
  //   case 'Petty Cash':
  //     _type = 'ptc';
  //     break;
  // }
  return axios.get('/expense-types/label-mapping/?category=' + _type);
};

/**
 * create expense types [Global]::NEW
 * @param data : Pass all Data required to crete expense type.
 */
export const createExpenseTypeConfigurationAPI = (
  data: TcreateExpenseTypeBody,
) => {
  return axios.post('/expense-types/', data, {
    headers: { 'content-type': 'application/json' },
  });
};

/**
 * To update configuration. [Global | Custom]::NEW
 * @param data : Configuration data only. Do not pass type related data!
 * @param id : configuration id.
 */
export const updateExpenseTypeConfigurationOnly = (
  data: IputExpenseTypeBody,
  id: string,
) => {
  return axios.put(`/expense-type-configurations/${id}/`, data, {
    headers: { 'content-type': 'application/json' },
  });
};

/**
 * This function used to create customize configuration. ::NEW
 * @param data
 * @param {string} id : Expense type id
 */
export const addCustomizeConfigurationAPI = (
  data: IputCustomizeExpenseTypeBody,
  id: string,
) => {
  return axios.put(`/expense-types/${id}/`, data, {
    headers: { 'content-type': 'application/json' },
  });
};

/**
 * Update is active
 * @param data
 * @param id
 */
export const updateExpenseTypeIsActiveAPI = (data: any, id: number) => {
  return axios.put(`/expense-types/${id}/mark-active/`, data, {
    headers: { 'content-type': 'application/json' },
  });
};

/**
 * Axios GET call to fetch legat entity list tied up with expense type ::NEW
 * @param {string} id : expense type id
 */
export const getLegalEntitiesOfExpenseType = (id: string) => {
  return axios.get(`/expense-types/${id}/legal-entities/`);
};

/**
 * Axios Post call to Add new legal entity ::NEW
 * @param {string} id : expense type id
 */
export const addLegalEntitiesToExpenseType = (id: string, data: any) => {
  return axios.post(`/expense-types/${id}/add-legal-entity/`, data, {
    headers: { 'content-type': 'application/json' },
  });
};

/**
 * Axios Delete call to remove legal entity from expense type ::NEW
 * @param {string} id : legal entity id
 */
export const deleteLegalEntitiesFromExpenseType = (id: string) => {
  return axios.delete(`/expense-type-legal-entities/${id}/`);
};

/**
 * Axios GET call to fetch only detail configuration data. ::NEW
 * @param {string} id : config id
 */
export const getDetailConfiguration = (
  id: string,
  withLegalEntity: boolean = false,
  expense_claim: boolean = true,
) => {
  return axios.get(
    `/expense-type-configurations/${id}/?with_legal_entity=${withLegalEntity}&expense_claim=${expense_claim}`,
  );
};

/**
 * Axios PUT call to revert customization and set global config to default. ::NEW
 * @param {string} id : legal entity id
 */
export const resetToGlobalConfiguration = (id: string) => {
  return axios.put(`/expense-type-legal-entities/${id}/revert-to-global/`);
};

/**
 * fetch single Expense type data
 * @param id
 */
export const getExpenseTypeDataAPI = (id: string) => {
  return axios.get(`/expense-types/${id}/`);
};

/**
 * Axios GET call to fetch expense type list ::NEW
 */
export const getExpenseTypeListAPI = () => {
  return axios.get('/expense-types/');
};

export const deleteExpenseTypeAPI = (id: number) => {
  return axios.delete(`/expense-types/${id}/`);
};

/**
 * API call to update title and code PATCH method
 */

export const patchTitleAndCode = (id: number, payload: ITitleAndCode) =>
  axios.patch(`/expense-types/${id}/update-title-and-code/`, payload, {
    headers: { 'content-type': 'application/json' },
  });

export const fetchEntityCostCenterListAPI = (data: any) => {
  return axios.post('/cost-centres/entity-cost-centres/', data, {
    headers: { 'Content-Type': 'application/json' },
  });
};
