import { IAddUpdateEntitletmentRule } from './addUpdateEntitlementRule.model';
import { ADD_UPDATE_ENTITLEMENT_RULE_ACTIOIN_TYPES } from './addUpdateEntitlementRule.action';

import cloneDeep from 'lodash.clonedeep';

const initialState: IAddUpdateEntitletmentRule = {
  add_update_entitlement_rule_action: 'ADD_ENTITLEMENT_RULE',
  process_types: [],
  selected_process_type: '',
  entitlement_rule_title: '',
  entitlement_effective_from: '',
  type_objects_for_entitlement: [],
  selected_type_object_for_entitlement: null,
  options: [],
  operators: {},
  genders: [],
  marital_statuses: [],
  contract_types: [],
  ref_obj_emp_groups: [],
  emp_sub_groups: [],
  emp_groups: [],
  pay_grades: [],
  employee_ids: [],
  users: [],

  selectedBenefitTypeConfig: {},
  selectedBenefitTypeConfigError: '',

  legal_entities: [],

  entitlement_rule_config: {},
  readable_entitlement_rule_config: {},
  current_section_data: {
    criterias: [],
    entities: [],
    rule: {
      fields: {},
      is_no_entitlement: true,
    },
  },
  is_default_entitlement_touched: false,
  current_readable_section_data: {
    criterias: [],
    entities: [],
    rule: {
      fields: {},
      is_no_entitlement: true,
    },
  },

  cost_centres: [],

  custom_cases_options: [
    { code: 'COST_CENTRE_TYPE', title: 'Selected Cost Centre Type' },
    { code: 'COST_CENTRE', title: 'Selected Cost Centre' },
    { code: 'EXPENSE_CLAIM_AMOUNT', title: 'Expense Claim Amount' },
    { code: 'BENEFIT_CLAIM_AMOUNT', title: 'Benefit Claim Amount' },
    { code: 'CLAIM_CREATOR', title: 'Claim Creator' },
  ],
  custom_cases_cost_centre_types: [
    { code: 'INTER', title: 'Internal Order Cost Centre' },
    { code: 'OVERS', title: 'Overseas Cost Centre' },
    { code: 'THIRD', title: 'Third Party Vendor' },
    { code: 'EMPCC', title: 'Employee Profile Cost Centre' },
  ],
  custom_cases_cost_claim_creator_types: [
    { code: 'COST_CENTRE_HEAD', title: 'Selected CC Head 1' },
    { code: 'COST_CENTRE_HEAD_2', title: 'Selected CC Head 2' },
    { code: 'COST_CENTRE_HEAD_3', title: 'Selected CC Head 3' },
  ],
  drawer_title: '',
  drawer_for: 'DEFAULT',
  drawer_action: 'ADD',
  current_editing_section_index: null,
};

// Getters
export const getAddUpdateEntitlementRuleAction = (
  state: IAddUpdateEntitletmentRule,
) => state.add_update_entitlement_rule_action;
export const getProcessTypesForEntitlement = (
  state: IAddUpdateEntitletmentRule,
) => state.process_types;
export const getEntitlementRuleTitle = (state: IAddUpdateEntitletmentRule) =>
  state.entitlement_rule_title;
export const getEntitlementEffectiveFrom = (
  state: IAddUpdateEntitletmentRule,
) => state.entitlement_effective_from;
export const getSelectedProcessTypeForEntitlement = (
  state: IAddUpdateEntitletmentRule,
) => state.selected_process_type;
export const getTypeObjectsForEntitlement = (
  state: IAddUpdateEntitletmentRule,
) => state.type_objects_for_entitlement;
export const getSelectedTypeObjectForEntitlement = (
  state: IAddUpdateEntitletmentRule,
) => state.selected_type_object_for_entitlement;
export const getOptionsForEntitlement = (state: IAddUpdateEntitletmentRule) =>
  state.options;
export const getOperatorsForEntitlement = (state: IAddUpdateEntitletmentRule) =>
  state.operators;
export const getGendersForEntitlement = (state: IAddUpdateEntitletmentRule) =>
  state.genders;
export const getMaritalStatusesForEntitlement = (
  state: IAddUpdateEntitletmentRule,
) => state.marital_statuses;
export const getContractTypesForEntitlement = (
  state: IAddUpdateEntitletmentRule,
) => state.contract_types;
export const getRefObjEmpGroupsForEntitlement = (
  state: IAddUpdateEntitletmentRule,
) => state.ref_obj_emp_groups;
export const getEmpSubGroupsForEntitlement = (
  state: IAddUpdateEntitletmentRule,
) => state.emp_sub_groups;
export const getEmpGroupsForEntitlement = (state: IAddUpdateEntitletmentRule) =>
  state.emp_groups;
export const getPayGradesForEntitlement = (state: IAddUpdateEntitletmentRule) =>
  state.pay_grades;
export const getEmployeeIdsForEntitlement = (
  state: IAddUpdateEntitletmentRule,
) => state.employee_ids;
export const getUsersForEntitlement = (state: IAddUpdateEntitletmentRule) =>
  state.users;

export const getLegalEntitiesForEntitlement = (
  state: IAddUpdateEntitletmentRule,
) => state.legal_entities;

export const getCustomCaseOptionsForEntitlement = (
  state: IAddUpdateEntitletmentRule,
) => state.custom_cases_options;
export const getCustomCasesCostCentreTypesForEntitlement = (
  state: IAddUpdateEntitletmentRule,
) => state.custom_cases_cost_centre_types;

export const getCustomCasesClaimCreatorTypesForEntitlement = (
  state: IAddUpdateEntitletmentRule,
) => state.custom_cases_cost_claim_creator_types;

export const getDrawerTitleForEntitlement = (
  state: IAddUpdateEntitletmentRule,
) => state.drawer_title;
export const getDrawerForEntitlement = (state: IAddUpdateEntitletmentRule) =>
  state.drawer_for;
export const getDrawerActionForEntitlement = (
  state: IAddUpdateEntitletmentRule,
) => state.drawer_action;

export const getEntitlementRuleConfig = (state: IAddUpdateEntitletmentRule) => {
  return state.entitlement_rule_config;
};
export const getReadableEntitlementRuleConfig = (
  state: IAddUpdateEntitletmentRule,
) => state.readable_entitlement_rule_config;

export const getCurrentSectionDataForEntitlement = (
  state: IAddUpdateEntitletmentRule,
) => state.current_section_data;

export const getCurrentReadableSectionDataForEntitlement = (
  state: IAddUpdateEntitletmentRule,
) => state.current_readable_section_data;

export const getCurrentEditingSectionIndexForEntitlement = (
  state: IAddUpdateEntitletmentRule,
) => state.current_editing_section_index;

export const getIfDefaultCriteraForEntitlementTouched = (
  state: IAddUpdateEntitletmentRule,
) => state.is_default_entitlement_touched;

// ------------------------------

export default (state = initialState, action: any) => {
  const { type, payload } = action;

  switch (type) {
    case ADD_UPDATE_ENTITLEMENT_RULE_ACTIOIN_TYPES.RESET_ADD_UPDATE_ENTITLEMENT_RULE_STATE:
      return resetAddUpdateEntitlementRuleState(state);

    case ADD_UPDATE_ENTITLEMENT_RULE_ACTIOIN_TYPES.SET_ADD_UPDATE_ENTITLEMENT_RULE_ACTION:
      return setAddUpdateEntitlementRuleAction(state, payload);

    case ADD_UPDATE_ENTITLEMENT_RULE_ACTIOIN_TYPES.SET_PROCESS_TYPES_FOR_ENTITLEMENT:
      return setProcessTypesForEntitlement(state, payload);

    case ADD_UPDATE_ENTITLEMENT_RULE_ACTIOIN_TYPES.SET_ENTITLEMENT_RULE_TITLE:
      return setEntitlementRuleTitle(state, payload);

    case ADD_UPDATE_ENTITLEMENT_RULE_ACTIOIN_TYPES.SET_ENTITLEMENT_EFFECTIVE_FROM:
      return setEntitlementEffectiveFrom(state, payload);

    case ADD_UPDATE_ENTITLEMENT_RULE_ACTIOIN_TYPES.SET_TYPE_OBJECTS_FOR_ENTITLEMENT:
      return setTypeObjectsForEntitlement(state, payload);

    case ADD_UPDATE_ENTITLEMENT_RULE_ACTIOIN_TYPES.SET_SELECTED_TYPE_OBJECT_FOR_ENTITLEMENT:
      return setSelectedTypeObjectForEntitlement(state, payload);

    case ADD_UPDATE_ENTITLEMENT_RULE_ACTIOIN_TYPES.SET_SELECTED_PROCESS_TYPE_FOR_ENTITLEMENT:
      return setSelectedProcessTypeForEntitlement(state, payload);

    case ADD_UPDATE_ENTITLEMENT_RULE_ACTIOIN_TYPES.SET_OPTIONS_FOR_ENTITLEMENT:
      return setOptionsForEntitlement(state, payload);

    case ADD_UPDATE_ENTITLEMENT_RULE_ACTIOIN_TYPES.SET_OPERATORS_FOR_ENTITLEMENT:
      return setOperatorsForEntitlement(state, payload);

    case ADD_UPDATE_ENTITLEMENT_RULE_ACTIOIN_TYPES.SET_ALLOWED_STEP_OWNERS_FOR_ENTITLEMENT:
      return setAllowedStepOwnersForEntitlement(state, payload);

    case ADD_UPDATE_ENTITLEMENT_RULE_ACTIOIN_TYPES.SET_ALLOWED_FALLBACK_STEP_OWNERS_FOR_ENTITLEMENT:
      return setAllowedFallbackStepOwnersForEntitlement(state, payload);

    case ADD_UPDATE_ENTITLEMENT_RULE_ACTIOIN_TYPES.SET_GENDERS_FOR_ENTITLEMENT:
      return setGendersForEntitlement(state, payload);

    case ADD_UPDATE_ENTITLEMENT_RULE_ACTIOIN_TYPES.SET_MARITAL_STATUS_FOR_ENTITLEMENT:
      return setMaritalStatusesForEntitlement(state, payload);

    case ADD_UPDATE_ENTITLEMENT_RULE_ACTIOIN_TYPES.SET_CONTRACT_TYPES_FOR_ENTITLEMENT:
      return setContractTypesForEntitlement(state, payload);

    case ADD_UPDATE_ENTITLEMENT_RULE_ACTIOIN_TYPES.SET_REF_OBJ_EMP_GROUPS_FOR_ENTITLEMENT:
      return setRefObjEmpGroupsForEntitlement(state, payload);

    case ADD_UPDATE_ENTITLEMENT_RULE_ACTIOIN_TYPES.SET_EMP_SUB_GROUPS_FOR_ENTITLEMENT:
      return setEmpSubGroupsForEntitlement(state, payload);

    case ADD_UPDATE_ENTITLEMENT_RULE_ACTIOIN_TYPES.SET_EMP_GROUPS_FOR_ENTITLEMENT:
      return setEmpGroupsForEntitlement(state, payload);

    case ADD_UPDATE_ENTITLEMENT_RULE_ACTIOIN_TYPES.SET_PAY_GRADES_FOR_ENTITLEMENT:
      return setPayGradesForEntitlement(state, payload);

    case ADD_UPDATE_ENTITLEMENT_RULE_ACTIOIN_TYPES.SET_EMPLOYEE_IDS_FOR_ENTITLEMENT:
      return setEmployeeIdsForEntitlement(state, payload);

    case ADD_UPDATE_ENTITLEMENT_RULE_ACTIOIN_TYPES.SET_USERS_FOR_ENTITLEMENT:
      return setUsersForEntitlement(state, payload);

    case ADD_UPDATE_ENTITLEMENT_RULE_ACTIOIN_TYPES.SET_LEGAL_ENTITIES_FOR_ENTITLEMENT:
      return setLegalEntitiesForEntitlement(state, payload);

    case ADD_UPDATE_ENTITLEMENT_RULE_ACTIOIN_TYPES.INIT_ENTITLEMENT_RULE_CONFIG:
      return initializeEntitlementRuleConfig(state);

    case ADD_UPDATE_ENTITLEMENT_RULE_ACTIOIN_TYPES.SET_ENTITLEMENT_RULE_CONFIG:
      return setEntitlementRuleConfig(state, payload);

    case ADD_UPDATE_ENTITLEMENT_RULE_ACTIOIN_TYPES.INIT_READABLE_ENTITLEMENT_RULE_CONFIG:
      return initializeReadableEntitlementRuleConfig(state);

    case ADD_UPDATE_ENTITLEMENT_RULE_ACTIOIN_TYPES.INIT_CURRENT_SECTION_DATA_FOR_ENTITLEMENT:
      return initializeCurrentSectionData(state, payload);

    case ADD_UPDATE_ENTITLEMENT_RULE_ACTIOIN_TYPES.SET_READABLE_ENTITLEMENT_RULE_CONFIG:
      return setReadableEntitlementRuleConfig(state, payload);

    case ADD_UPDATE_ENTITLEMENT_RULE_ACTIOIN_TYPES.POPULATE_CURRENT_SECTION_DATA_FOR_ENTITLEMENT:
      return populateCurrentSectionData(state, payload);

    case ADD_UPDATE_ENTITLEMENT_RULE_ACTIOIN_TYPES.POPULATE_DEFAULT_SECTION_DATA_FOR_ENTITLEMENT:
      return populateDefaultSectionData(state);
    case ADD_UPDATE_ENTITLEMENT_RULE_ACTIOIN_TYPES.SET_ADD_ENTITLEMENT_RULE_FIELDS:
      return addEntitlementRuleFields(state, payload);
    case ADD_UPDATE_ENTITLEMENT_RULE_ACTIOIN_TYPES.SET_IS_NO__ENTITLEMENT:
      return setIsNoEntitlement(state, payload);
    case ADD_UPDATE_ENTITLEMENT_RULE_ACTIOIN_TYPES.SET_IS_DEFAULT_CRITERIA__FOR_ENTITLEMENT_TOUCHED:
      return setIsDefaultCriteraForEntitlementTouched(state, payload);
    case ADD_UPDATE_ENTITLEMENT_RULE_ACTIOIN_TYPES.SET_DRAWER_FOR_FOR_ENTITLEMENT:
      return setDrawerFor(state, payload);

    case ADD_UPDATE_ENTITLEMENT_RULE_ACTIOIN_TYPES.SET_DRAWER_TITLE_FOR_ENTITLEMENT:
      return setDrawerTitle(state, payload);

    case ADD_UPDATE_ENTITLEMENT_RULE_ACTIOIN_TYPES.SET_DRAWER_ACTION_FOR_ENTITLEMENT:
      return setDrawerAction(state, payload);

    case ADD_UPDATE_ENTITLEMENT_RULE_ACTIOIN_TYPES.SET_CURR_SEC_ENTITIES_FOR_ENTITLEMENT:
      return setCurrSecEntities(state, payload);

    case ADD_UPDATE_ENTITLEMENT_RULE_ACTIOIN_TYPES.SET_CURR_READ_SEC_ENTITIES_FOR_ENTITLEMENT:
      return setCurrReadSecEntities(state, payload);

    case ADD_UPDATE_ENTITLEMENT_RULE_ACTIOIN_TYPES.SET_ADD_NEW_OR_CRITERIA_FOR_ENTITLEMENT:
      return addNewOrCriteria(state);

    case ADD_UPDATE_ENTITLEMENT_RULE_ACTIOIN_TYPES.SET_REMOVE_OR_CRITERIA_FOR_ENTITLEMENT:
      return removeOrCriteria(state, payload);

    case ADD_UPDATE_ENTITLEMENT_RULE_ACTIOIN_TYPES.SET_REMOVE_AND_CRITERIA_FOR_ENTITLEMENT:
      return removeAndCriteria(state, payload);

    case ADD_UPDATE_ENTITLEMENT_RULE_ACTIOIN_TYPES.SET_ADD_NEW_AND_CRITERIA_FOR_ENTITLEMENT:
      return addNewAndCriteria(state, payload);

    case ADD_UPDATE_ENTITLEMENT_RULE_ACTIOIN_TYPES.SET_UPDATE_CRITERIA_FOR_ENTITLEMENT:
      return updateCriteria(state, payload);

    case ADD_UPDATE_ENTITLEMENT_RULE_ACTIOIN_TYPES.SET_SAVE_CUSTOM_SECTION_FOR_ENTITLEMENT:
      return saveCustomSectionForEntitlement(state);

    case ADD_UPDATE_ENTITLEMENT_RULE_ACTIOIN_TYPES.SET_SAVE_DEFAULT_SECTION_FOR_ENTITLEMENT:
      return saveDefaultSectionForEntitlement(state);

    case ADD_UPDATE_ENTITLEMENT_RULE_ACTIOIN_TYPES.SET_REMOVE_CUSTOM_SECTION_FOR_ENTITLEMENT:
      return removeCustomSectionForEntitlement(state, payload);

    case ADD_UPDATE_ENTITLEMENT_RULE_ACTIOIN_TYPES.SET_CURRENT_EDITING_SECTION_INDEX:
      return setCurrentEditingSectionIndex(state, payload);

    case ADD_UPDATE_ENTITLEMENT_RULE_ACTIOIN_TYPES.CLEAN_ENTITLEMENT_RULE_CONFIG_BEFORE_ADD_UPDATE:
      return cleanEntitlementRuleConfigBeforeAddUpdate(state);

    // case ADD_UPDATE_ENTITLEMENT_RULE_ACTIOIN_TYPES.HANDLE_ENTITY_HEAD_VALUES_FOR_UPDATE:
    //     return handleEntityHeadValuesForUpdate(state);

    // case ADD_UPDATE_ENTITLEMENT_RULE_ACTIOIN_TYPES.SET_COST_CENTRES:
    //     return setCostCentresForEntitlement(state, payload);
    case ADD_UPDATE_ENTITLEMENT_RULE_ACTIOIN_TYPES.ADD_SELECTED_BENEFIT_TYPE_CONFIG:
      return addSelectedBenefitTypeConfigAction(state, payload);
    case ADD_UPDATE_ENTITLEMENT_RULE_ACTIOIN_TYPES.ADD_SELECTED_BENEFIT_TYPE_CONFIG_ERROR:
      return addSelectedBenefitTypeConfigErrorAction(state, payload);
    default:
      return state;
  }
};

// Setters

const resetAddUpdateEntitlementRuleState = (
  state: IAddUpdateEntitletmentRule,
) => {
  return Object.assign(state, initialState);
};

const addSelectedBenefitTypeConfigAction = (
  state: IAddUpdateEntitletmentRule,
  payload: any,
) => {
  return { ...state, selectedBenefitTypeConfig: payload };
};

const addSelectedBenefitTypeConfigErrorAction = (
  state: IAddUpdateEntitletmentRule,
  payload: any,
) => {
  return { ...state, selectedBenefitTypeConfigError: payload };
};

const setAddUpdateEntitlementRuleAction = (
  state: IAddUpdateEntitletmentRule,
  payload: any,
) => {
  return { ...state, add_update_entitlement_rule_action: payload };
};

const setProcessTypesForEntitlement = (
  state: IAddUpdateEntitletmentRule,
  payload: any[],
) => {
  return { ...state, process_types: payload };
};

const setEntitlementRuleTitle = (
  state: IAddUpdateEntitletmentRule,
  payload: string,
) => {
  return { ...state, entitlement_rule_title: payload };
};

const setEntitlementEffectiveFrom = (
  state: IAddUpdateEntitletmentRule,
  payload: string,
) => {
  return { ...state, entitlement_effective_from: payload };
};

const setTypeObjectsForEntitlement = (
  state: IAddUpdateEntitletmentRule,
  payload: any[],
) => {
  return { ...state, type_objects_for_entitlement: payload };
};

const setSelectedTypeObjectForEntitlement = (
  state: IAddUpdateEntitletmentRule,
  payload: any,
) => {
  return { ...state, selected_type_object_for_entitlement: payload };
};

const setSelectedProcessTypeForEntitlement = (
  state: IAddUpdateEntitletmentRule,
  payload: string,
) => {
  return { ...state, selected_process_type: payload };
};

const setOptionsForEntitlement = (
  state: IAddUpdateEntitletmentRule,
  payload: any[],
) => {
  return { ...state, options: payload };
};

const setOperatorsForEntitlement = (
  state: IAddUpdateEntitletmentRule,
  payload: {},
) => {
  return { ...state, operators: payload };
};

const setAllowedStepOwnersForEntitlement = (
  state: IAddUpdateEntitletmentRule,
  payload: any[],
) => {
  return { ...state, allowed_step_owners: payload };
};

const setAllowedFallbackStepOwnersForEntitlement = (
  state: IAddUpdateEntitletmentRule,
  payload: any[],
) => {
  return { ...state, allowed_fallback_step_owners: payload };
};

const setGendersForEntitlement = (
  state: IAddUpdateEntitletmentRule,
  payload: any[],
) => {
  return { ...state, genders: payload };
};

const setMaritalStatusesForEntitlement = (
  state: IAddUpdateEntitletmentRule,
  payload: any[],
) => {
  return { ...state, marital_statuses: payload };
};

const setContractTypesForEntitlement = (
  state: IAddUpdateEntitletmentRule,
  payload: any[],
) => {
  return { ...state, contract_types: payload };
};

const setRefObjEmpGroupsForEntitlement = (
  state: IAddUpdateEntitletmentRule,
  payload: any[],
) => {
  return { ...state, ref_obj_emp_groups: payload };
};

const setEmpSubGroupsForEntitlement = (
  state: IAddUpdateEntitletmentRule,
  payload: any[],
) => {
  return { ...state, emp_sub_groups: payload };
};

const setEmpGroupsForEntitlement = (
  state: IAddUpdateEntitletmentRule,
  payload: any[],
) => {
  return { ...state, emp_groups: payload };
};

const setPayGradesForEntitlement = (
  state: IAddUpdateEntitletmentRule,
  payload: any[],
) => {
  return { ...state, pay_grades: payload };
};

const setEmployeeIdsForEntitlement = (
  state: IAddUpdateEntitletmentRule,
  payload: any[],
) => {
  return { ...state, employee_ids: payload };
};

const setUsersForEntitlement = (
  state: IAddUpdateEntitletmentRule,
  payload: any[],
) => {
  return { ...state, users: payload };
};

const setLegalEntitiesForEntitlement = (
  state: IAddUpdateEntitletmentRule,
  payload: any[],
) => {
  return { ...state, legal_entities: payload };
};

const getEntitlementRuleStructure = () => {
  return {
    custom: [],
    default: {
      rule: {
        fields: {},
        is_no_entitlement: true,
      },
    },
  };
};

const initializeEntitlementRuleConfig = (state: IAddUpdateEntitletmentRule) => {
  return {
    ...state,
    entitlement_rule_config: getEntitlementRuleStructure(),
  };
};

const setEntitlementRuleConfig = (
  state: IAddUpdateEntitletmentRule,
  payload: any,
) => {
  return {
    ...state,
    entitlement_rule_config: payload,
  };
};

const initializeReadableEntitlementRuleConfig = (
  state: IAddUpdateEntitletmentRule,
) => {
  return {
    ...state,
    readable_entitlement_rule_config: getEntitlementRuleStructure(),
  };
};

const setReadableEntitlementRuleConfig = (
  state: IAddUpdateEntitletmentRule,
  payload: any,
) => {
  return {
    ...state,
    readable_entitlement_rule_config: payload,
  };
};

const newEmptyCustomSectionStructure = () => ({
  entities: [],
  criterias: [],
  rule: {
    fields: {},
    is_no_entitlement: true,
  },
});

const newEmptyDefaultSectionStructure = () => ({
  rule: {
    fields: {},
    is_no_entitlement: true,
  },
});

const initializeCurrentSectionData = (
  state: IAddUpdateEntitletmentRule,
  sectionType: string,
) => {
  let structure = null;
  if (sectionType === 'CUSTOM') {
    structure = newEmptyCustomSectionStructure();
  } else if (sectionType === 'DEFAULT') {
    structure = newEmptyDefaultSectionStructure();
  }
  return {
    ...state,
    current_section_data: structure,
    current_readable_section_data: structure,
  };
};

const populateCurrentSectionData = (
  state: IAddUpdateEntitletmentRule,
  indexToBeEdited: number,
) => {
  const currentSectionDataCopy = cloneDeep(
    state.entitlement_rule_config.custom[indexToBeEdited],
  );
  const currentReadableSectionDataCopy = cloneDeep(
    state.readable_entitlement_rule_config.custom[indexToBeEdited],
  );
  return {
    ...state,
    current_section_data: currentSectionDataCopy,
    current_readable_section_data: currentReadableSectionDataCopy,
  };
};

const populateDefaultSectionData = (state: IAddUpdateEntitletmentRule) => {
  const currentSectionDataCopy = cloneDeep(
    state.entitlement_rule_config.default,
  );
  const currentReadableSectionDataCopy = cloneDeep(
    state.readable_entitlement_rule_config.default,
  );
  return {
    ...state,
    current_section_data: currentSectionDataCopy,
    current_readable_section_data: currentReadableSectionDataCopy,
  };
};

const setDrawerFor = (state: IAddUpdateEntitletmentRule, payload: string) => {
  return { ...state, drawer_for: payload };
};

const setDrawerTitle = (state: IAddUpdateEntitletmentRule, payload: string) => {
  return { ...state, drawer_title: payload };
};

const setDrawerAction = (
  state: IAddUpdateEntitletmentRule,
  payload: string,
) => {
  return { ...state, drawer_action: payload };
};

const setCurrSecEntities = (
  state: IAddUpdateEntitletmentRule,
  { uuids }: { uuids: any },
) => {
  const currentSectionDataCopy = cloneDeep(state.current_section_data);
  currentSectionDataCopy.entities = uuids;
  return { ...state, current_section_data: currentSectionDataCopy };
};

const setCurrReadSecEntities = (
  state: IAddUpdateEntitletmentRule,
  { uuidTitles }: { uuidTitles: any },
) => {
  const currentReadableSectionDataCopy = cloneDeep(
    state.current_readable_section_data,
  );
  currentReadableSectionDataCopy.entities = uuidTitles;
  return {
    ...state,
    current_readable_section_data: currentReadableSectionDataCopy,
  };
};

const addNewOrCriteria = (state: IAddUpdateEntitletmentRule) => {
  const currentSectionDataCopy = cloneDeep(state.current_section_data);
  currentSectionDataCopy.criterias.push([
    { option: null, operator: null, value: null },
  ]);
  const currentReadableSectionDataCopy = cloneDeep(
    state.current_readable_section_data,
  );
  currentReadableSectionDataCopy.criterias.push([
    { option: null, operator: null, value: null },
  ]);
  return {
    ...state,
    current_section_data: currentSectionDataCopy,
    current_readable_section_data: currentReadableSectionDataCopy,
  };
};

const removeOrCriteria = (
  state: IAddUpdateEntitletmentRule,
  { toBeRemovedIndex }: { toBeRemovedIndex: number },
) => {
  const currentSectionDataCopy = cloneDeep(state.current_section_data);
  let updatedCriterias = currentSectionDataCopy.criterias.filter(
    (_item: any, index: number) => index !== toBeRemovedIndex,
  );
  currentSectionDataCopy.criterias = updatedCriterias;

  const currentReadableSectionDataCopy = cloneDeep(
    state.current_readable_section_data,
  );
  updatedCriterias = currentReadableSectionDataCopy.criterias.filter(
    (_item: any, index: number) => index !== toBeRemovedIndex,
  );
  currentReadableSectionDataCopy.criterias = updatedCriterias;
  return {
    ...state,
    current_section_data: currentSectionDataCopy,
    current_readable_section_data: currentReadableSectionDataCopy,
  };
};

const removeAndCriteria = (
  state: IAddUpdateEntitletmentRule,
  {
    criteriaIndex,
    toBeRemovedIndex,
  }: { criteriaIndex: number; toBeRemovedIndex: number },
) => {
  const currentSectionDataCopy = cloneDeep(state.current_section_data);
  let updatedConditions = currentSectionDataCopy.criterias[
    criteriaIndex
  ].filter((_item: any, index: number) => index !== toBeRemovedIndex);
  currentSectionDataCopy.criterias[criteriaIndex] = updatedConditions;
  if (currentSectionDataCopy.criterias[criteriaIndex].length === 0) {
    currentSectionDataCopy.criterias = currentSectionDataCopy.criterias.filter(
      (_item: any, index: number) => index !== criteriaIndex,
    );
  }

  const currentReadableSectionDataCopy = cloneDeep(
    state.current_readable_section_data,
  );
  updatedConditions = currentReadableSectionDataCopy.criterias[
    criteriaIndex
  ].filter((_item: any, index: number) => index !== toBeRemovedIndex);
  currentReadableSectionDataCopy.criterias[criteriaIndex] = updatedConditions;
  if (currentReadableSectionDataCopy.criterias[criteriaIndex].length === 0) {
    currentReadableSectionDataCopy.criterias = currentReadableSectionDataCopy.criterias.filter(
      (_item: any, index: number) => index !== criteriaIndex,
    );
  }

  return {
    ...state,
    current_section_data: currentSectionDataCopy,
    current_readable_section_data: currentReadableSectionDataCopy,
  };
};

const addNewAndCriteria = (
  state: IAddUpdateEntitletmentRule,
  { criteriaIndex }: { criteriaIndex: number },
) => {
  const currentSectionDataCopy = cloneDeep(state.current_section_data);
  currentSectionDataCopy.criterias[criteriaIndex].push({
    option: null,
    operator: null,
    value: null,
  });
  const currentReadableSectionDataCopy = cloneDeep(
    state.current_readable_section_data,
  );
  currentReadableSectionDataCopy.criterias[criteriaIndex].push({
    option: null,
    operator: null,
    value: null,
  });

  return {
    ...state,
    current_section_data: currentSectionDataCopy,
    current_readable_section_data: currentReadableSectionDataCopy,
  };
};

const updateCriteria = (
  state: IAddUpdateEntitletmentRule,
  {
    criteriaIndex,
    conditionIndex,
    updateType,
    updateValue,
    isNumberType,
    readableValue,
  }: {
    criteriaIndex: number;
    conditionIndex: number;
    updateType: 'OPTION' | 'OPERATOR' | 'VALUE';
    updateValue: any;
    isNumberType: boolean;
    readableValue: any;
  },
) => {
  if (isNumberType) {
    updateValue =
      updateValue && !isNaN(updateValue) ? parseFloat(updateValue) : null;
  }

  const currentSectionDataCopy = cloneDeep(state.current_section_data);
  const currentReadableSectionDataCopy = cloneDeep(
    state.current_readable_section_data,
  );

  let valueKeyMap: any = {
    OPTION: 'option',
    OPERATOR: 'operator',
    VALUE: 'value',
  };
  currentSectionDataCopy.criterias[criteriaIndex][conditionIndex][
    valueKeyMap[updateType]
  ] = updateValue;
  if (updateType === 'OPTION') {
    currentSectionDataCopy.criterias[criteriaIndex][conditionIndex] = {
      ...currentSectionDataCopy.criterias[criteriaIndex][conditionIndex],
      ...{
        operator: null,
        value: null,
      },
    };
    currentReadableSectionDataCopy.criterias[criteriaIndex][conditionIndex] = {
      ...currentReadableSectionDataCopy.criterias[criteriaIndex][
        conditionIndex
      ],
      ...{
        operator: null,
        value: null,
      },
    };
  }

  if (updateType === 'VALUE' && readableValue) {
    readableValue = readableValue.map((i: any) => i.children);
    currentReadableSectionDataCopy.criterias[criteriaIndex][conditionIndex][
      'value'
    ] = readableValue;
  } else {
    currentReadableSectionDataCopy.criterias[criteriaIndex][conditionIndex][
      valueKeyMap[updateType]
    ] = updateValue;
  }

  return {
    ...state,
    current_section_data: currentSectionDataCopy,
    current_readable_section_data: currentReadableSectionDataCopy,
  };
};

const saveCustomSectionForEntitlement = (state: IAddUpdateEntitletmentRule) => {
  const entitlementRuleConfigCopy = cloneDeep(state.entitlement_rule_config);
  const readableRuleConfigCopy = cloneDeep(
    state.readable_entitlement_rule_config,
  );

  if (state.drawer_action === 'ADD') {
    entitlementRuleConfigCopy['custom'].push(state.current_section_data);
    readableRuleConfigCopy['custom'].push(state.current_readable_section_data);
  } else if (state.drawer_action === 'EDIT') {
    if (state.current_editing_section_index !== null) {
      entitlementRuleConfigCopy.custom[state.current_editing_section_index] =
        state.current_section_data;
      readableRuleConfigCopy.custom[state.current_editing_section_index] =
        state.current_readable_section_data;
    }
  }
  return {
    ...state,
    entitlement_rule_config: entitlementRuleConfigCopy,
    readable_entitlement_rule_config: readableRuleConfigCopy,
  };
};

const saveDefaultSectionForEntitlement = (
  state: IAddUpdateEntitletmentRule,
) => {
  const entitlementRuleConfigCopy = cloneDeep(state.entitlement_rule_config);
  const readableRuleConfigCopy = cloneDeep(
    state.readable_entitlement_rule_config,
  );

  entitlementRuleConfigCopy.default = state.current_section_data;
  readableRuleConfigCopy.default = state.current_readable_section_data;

  return {
    ...state,
    entitlement_rule_config: entitlementRuleConfigCopy,
    readable_entitlement_rule_config: readableRuleConfigCopy,
  };
};

const removeCustomSectionForEntitlement = (
  state: IAddUpdateEntitletmentRule,
  { toBeRemovedIndex }: { toBeRemovedIndex: number },
) => {
  const entitlementRuleConfigCopy = cloneDeep(state.entitlement_rule_config);
  let updated = entitlementRuleConfigCopy.custom.filter(
    (_item: any, index: number) => index !== toBeRemovedIndex,
  );
  entitlementRuleConfigCopy.custom = updated;

  const readableRuleConfigCopy = cloneDeep(
    state.readable_entitlement_rule_config,
  );
  updated = readableRuleConfigCopy.custom.filter(
    (_item: any, index: number) => index !== toBeRemovedIndex,
  );
  readableRuleConfigCopy.custom = updated;

  return {
    ...state,
    entitlement_rule_config: entitlementRuleConfigCopy,
    readable_entitlement_rule_config: readableRuleConfigCopy,
  };
};

const setCurrentEditingSectionIndex = (
  state: IAddUpdateEntitletmentRule,
  payload: number | null,
) => {
  return { ...state, current_editing_section_index: payload };
};

const cleanEntitlementRuleConfigBeforeAddUpdate = (
  state: IAddUpdateEntitletmentRule,
) => {
  let entitlementRuleConfigCopy = cloneDeep(state.entitlement_rule_config);
  return {
    ...state,
    // entitlement_rule_config: entitlementRuleConfigCopy,
    entitlement_rule_config: {
      custom: entitlementRuleConfigCopy.custom,
      default: entitlementRuleConfigCopy.default,
    },
  };
};

const addEntitlementRuleFields = (
  state: IAddUpdateEntitletmentRule,
  {
    fieldType,
    fieldValue,
  }: {
    fieldType: string;
    fieldValue: number | boolean;
  },
) => {
  const currentSectionDataCopy = cloneDeep(state.current_section_data);
  currentSectionDataCopy.rule.fields[fieldType] = fieldValue;

  const currentReadableSectionDataCopy = cloneDeep(
    state.current_readable_section_data,
  );
  currentReadableSectionDataCopy.rule.fields[fieldType] = fieldValue;

  return {
    ...state,
    current_section_data: currentSectionDataCopy,
    current_readable_section_data: currentReadableSectionDataCopy,
  };
};

const setIsNoEntitlement = (
  state: IAddUpdateEntitletmentRule,
  {
    value,
    is_unlimited_amount,
  }: {
    value: boolean;
    is_unlimited_amount: boolean;
  },
) => {
  const currentSectionDataCopy = cloneDeep(state.current_section_data);
  currentSectionDataCopy.rule.is_no_entitlement = value;

  const currentReadableSectionDataCopy = cloneDeep(
    state.current_readable_section_data,
  );
  currentReadableSectionDataCopy.rule.is_no_entitlement = value;

  if (value === true) {
    currentSectionDataCopy.rule.fields = {};
    currentReadableSectionDataCopy.rule.fields = {};
  } else {
    currentSectionDataCopy.rule.fields = {
      amount: 0,
      max_amount: 1,
      min_amount: 1,
      copay_value: 0,
      payable_percent: 0,
      is_unlimited_amount: is_unlimited_amount || false,
    };

    currentReadableSectionDataCopy.rule.fields = {
      amount: 0,
      max_amount: 1,
      min_amount: 1,
      copay_value: 0,
      payable_percent: 0,
      is_unlimited_amount: is_unlimited_amount || false,
    };
  }

  return {
    ...state,
    current_section_data: currentSectionDataCopy,
    current_readable_section_data: currentReadableSectionDataCopy,
  };
};

const setIsDefaultCriteraForEntitlementTouched = (
  state: IAddUpdateEntitletmentRule,
  value: boolean,
) => {
  return {
    ...state,
    is_default_entitlement_touched: value,
  };
};
