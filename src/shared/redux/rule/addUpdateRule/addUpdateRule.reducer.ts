import { IAddUpdateRule } from './addUpdateRule.model';
import { ADD_UPDATE_RULE_ACTION_TYPES } from './addUpdateRule.action';
import cloneDeep from 'lodash.clonedeep';

const initialState: IAddUpdateRule = {
  add_update_rule_action: 'ADD_RULE',
  process_types: [],
  selected_process_type: '',
  rule_title: '',
  type_objects: [],
  type_objects_status: false,
  selected_type_object: null,
  options: [],
  operators: {},
  genders: [],
  marital_statuses: [],
  contract_types: [],
  ref_obj_emp_groups: [],
  emp_sub_groups: [],
  emp_groups: [],
  approvers_custom_fields: [],
  pay_grades: [],
  employee_ids: [],
  users: [],
  legal_entities: [],
  allowed_step_owners: [],
  allowed_fallback_step_owners: [],
  rule_config: {},
  readable_rule_config: {},
  cost_centres: [],
  current_section_data: {},
  current_readable_section_data: {},
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
    // { code: 'ENTITY_HEAD', title: 'Entity Head' },
  ],
  drawer_title: '',
  drawer_for: 'DEFAULT',
  drawer_action: 'ADD',
  current_editing_section_index: null,
};

// --- Getters ---
export const getAddUpdateRuleAction = (state: IAddUpdateRule) =>
  state.add_update_rule_action;
export const getProcessTypes = (state: IAddUpdateRule) => state.process_types;
export const getRuleTitle = (state: IAddUpdateRule) => state.rule_title;
export const getSelectedProcessType = (state: IAddUpdateRule) =>
  state.selected_process_type;
export const getTypeObjects = (state: IAddUpdateRule) => state.type_objects;
export const getTypeObjectsStatus = (state: IAddUpdateRule) =>
  state.type_objects_status;
export const getSelectedTypeObject = (state: IAddUpdateRule) =>
  state.selected_type_object;
export const getOptions = (state: IAddUpdateRule) => state.options;
export const getOperators = (state: IAddUpdateRule) => state.operators;

export const getCostCentres = (state: IAddUpdateRule) => state.cost_centres;
export const getGenders = (state: IAddUpdateRule) => state.genders;
export const getMaritalStatuses = (state: IAddUpdateRule) =>
  state.marital_statuses;
export const getContractTypes = (state: IAddUpdateRule) => state.contract_types;
export const getRefObjEmpGroups = (state: IAddUpdateRule) =>
  state.ref_obj_emp_groups;
export const getEmpSubGroups = (state: IAddUpdateRule) => state.emp_sub_groups;
export const getEmpGroups = (state: IAddUpdateRule) => state.emp_groups;
export const getApproversCustomFields = (state: IAddUpdateRule) =>
  state.approvers_custom_fields;
export const getPayGrades = (state: IAddUpdateRule) => state.pay_grades;
export const getEmployeeIds = (state: IAddUpdateRule) => state.employee_ids;
export const getUsers = (state: IAddUpdateRule) => state.users;
export const getLegalEntities = (state: IAddUpdateRule) => state.legal_entities;
export const getAllowedStepOwners = (state: IAddUpdateRule) =>
  state.allowed_step_owners;
export const getAllowedFallbackStepOwners = (state: IAddUpdateRule) =>
  state.allowed_fallback_step_owners;
export const getCustomCaseOptions = (state: IAddUpdateRule) =>
  state.custom_cases_options;
export const getCustomCasesCostCentreTypes = (state: IAddUpdateRule) =>
  state.custom_cases_cost_centre_types;
export const getCustomCasesClaimCreatorTypes = (state: IAddUpdateRule) =>
  state.custom_cases_cost_claim_creator_types;

export const getDrawerTitle = (state: IAddUpdateRule) => state.drawer_title;
export const getDrawerFor = (state: IAddUpdateRule) => state.drawer_for;
export const getDrawerAction = (state: IAddUpdateRule) => state.drawer_action;

export const getRuleConfig = (state: IAddUpdateRule) => {
  return state.rule_config;
};
export const getReadableRuleConfig = (state: IAddUpdateRule) =>
  state.readable_rule_config;
export const getCurrentSectionData = (state: IAddUpdateRule) =>
  state.current_section_data;
export const getCurrentReadableSectionData = (state: IAddUpdateRule) =>
  state.current_readable_section_data;

export const getCurrentEditingSectionIndex = (state: IAddUpdateRule) =>
  state.current_editing_section_index;
// ---------------

export default (state = initialState, action: any) => {
  const { type, payload } = action;
  switch (type) {
    case ADD_UPDATE_RULE_ACTION_TYPES.RESET_ADD_UPDATE_RULE_STATE:
      return resetAddUpdateRuleState(state);

    case ADD_UPDATE_RULE_ACTION_TYPES.SET_ADD_UPDATE_RULE_ACTION:
      return setAddUpdateRuleAction(state, payload);

    case ADD_UPDATE_RULE_ACTION_TYPES.SET_PROCESS_TYPES:
      return setProcessTypes(state, payload);

    case ADD_UPDATE_RULE_ACTION_TYPES.SET_RULE_TITLE:
      return setRuleTitle(state, payload);

    case ADD_UPDATE_RULE_ACTION_TYPES.SET_SELECTED_PROCESS_TYPE:
      return setSelectedProcessType(state, payload);

    case ADD_UPDATE_RULE_ACTION_TYPES.SET_TYPE_OBJECTS:
      return setTypeObjects(state, payload);

    case ADD_UPDATE_RULE_ACTION_TYPES.SET_TYPE_OBJECTS_STATUS:
      return setTypeObjectsStatus(state, payload);

    case ADD_UPDATE_RULE_ACTION_TYPES.SET_SELECTED_TYPE_OBJECT:
      return setSelectedTypeObject(state, payload);

    case ADD_UPDATE_RULE_ACTION_TYPES.SET_OPTIONS:
      return setOptions(state, payload);

    case ADD_UPDATE_RULE_ACTION_TYPES.SET_OPERATORS:
      return setOperators(state, payload);

    case ADD_UPDATE_RULE_ACTION_TYPES.SET_ALLOWED_STEP_OWNERS:
      return setAllowedStepOwners(state, payload);

    case ADD_UPDATE_RULE_ACTION_TYPES.SET_ALLOWED_FALLBACK_STEP_OWNERS:
      return setAllowedFallbackStepOwners(state, payload);

    case ADD_UPDATE_RULE_ACTION_TYPES.SET_GENDERS:
      return setGenders(state, payload);

    case ADD_UPDATE_RULE_ACTION_TYPES.SET_MARITAL_STATUS:
      return setMaritalStatuses(state, payload);

    case ADD_UPDATE_RULE_ACTION_TYPES.SET_CONTRACT_TYPES:
      return setContractTypes(state, payload);

    case ADD_UPDATE_RULE_ACTION_TYPES.SET_REF_OBJ_EMP_GROUPS:
      return setRefObjEmpGroups(state, payload);

    case ADD_UPDATE_RULE_ACTION_TYPES.SET_EMP_SUB_GROUPS:
      return setEmpSubGroups(state, payload);

    case ADD_UPDATE_RULE_ACTION_TYPES.SET_EMP_GROUPS:
      return setEmpGroups(state, payload);

    case ADD_UPDATE_RULE_ACTION_TYPES.SET_APPROVERS_CUSTOM_FIELDS:
      return setApproversCustomFields(state, payload);

    case ADD_UPDATE_RULE_ACTION_TYPES.SET_PAY_GRADES:
      return setPayGrades(state, payload);

    case ADD_UPDATE_RULE_ACTION_TYPES.SET_EMPLOYEE_IDS:
      return setEmployeeIds(state, payload);

    case ADD_UPDATE_RULE_ACTION_TYPES.SET_USERS:
      return setUsers(state, payload);

    case ADD_UPDATE_RULE_ACTION_TYPES.SET_LEGAL_ENTITIES:
      return setLegalEntities(state, payload);

    case ADD_UPDATE_RULE_ACTION_TYPES.INIT_RULE_CONFIG:
      return initializeRuleConfig(state);

    case ADD_UPDATE_RULE_ACTION_TYPES.SET_RULE_CONFIG:
      return setRuleConfig(state, payload);

    case ADD_UPDATE_RULE_ACTION_TYPES.INIT_READABLE_RULE_CONFIG:
      return initializeReadableRuleConfig(state);

    case ADD_UPDATE_RULE_ACTION_TYPES.SET_READABLE_RULE_CONFIG:
      return setReadableRuleConfig(state, payload);

    case ADD_UPDATE_RULE_ACTION_TYPES.INIT_CURRENT_SECTION_DATA:
      return initializeCurrentSectionData(state, payload);

    case ADD_UPDATE_RULE_ACTION_TYPES.POPULATE_CURRENT_SECTION_DATA:
      return populateCurrentSectionData(state, payload);

    case ADD_UPDATE_RULE_ACTION_TYPES.POPULATE_DEFAULT_SECTION_DATA:
      return populateDefaultSectionData(state);

    case ADD_UPDATE_RULE_ACTION_TYPES.SET_DRAWER_FOR:
      return setDrawerFor(state, payload);

    case ADD_UPDATE_RULE_ACTION_TYPES.SET_DRAWER_TITLE:
      return setDrawerTitle(state, payload);

    case ADD_UPDATE_RULE_ACTION_TYPES.SET_DRAWER_ACTION:
      return setDrawerAction(state, payload);

    case ADD_UPDATE_RULE_ACTION_TYPES.SET_CURR_SEC_ENTITIES:
      return setCurrSecEntities(state, payload);

    case ADD_UPDATE_RULE_ACTION_TYPES.SET_CURR_READ_SEC_ENTITIES:
      return setCurrReadSecEntities(state, payload);

    case ADD_UPDATE_RULE_ACTION_TYPES.SET_ADD_NEW_OR_CRITERIA:
      return addNewOrCriteria(state);

    case ADD_UPDATE_RULE_ACTION_TYPES.SET_REMOVE_OR_CRITERIA:
      return removeOrCriteria(state, payload);

    case ADD_UPDATE_RULE_ACTION_TYPES.SET_REMOVE_AND_CRITERIA:
      return removeAndCriteria(state, payload);

    case ADD_UPDATE_RULE_ACTION_TYPES.SET_ADD_NEW_AND_CRITERIA:
      return addNewAndCriteria(state, payload);

    case ADD_UPDATE_RULE_ACTION_TYPES.SET_UPDATE_CRITERIA:
      return updateCriteria(state, payload);

    case ADD_UPDATE_RULE_ACTION_TYPES.SET_IS_AUTO_APPROVAL:
      return setIsAutoApproval(state, payload);

    case ADD_UPDATE_RULE_ACTION_TYPES.SET_ADD_RULE_STEP:
      return addRuleStep(state, payload);

    case ADD_UPDATE_RULE_ACTION_TYPES.SET_REMOVE_RULE_STEP:
      return removeRuleStep(state, payload);

    case ADD_UPDATE_RULE_ACTION_TYPES.SET_UPDATE_STEP_OWNER:
      return updateStepOwner(state, payload);

    case ADD_UPDATE_RULE_ACTION_TYPES.SET_UPDATE_STEP_OWNER_ID:
      return updateStepOwnerId(state, payload);

    case ADD_UPDATE_RULE_ACTION_TYPES.SET_ADD_CUSTOM_CASE:
      return addCustomCase(state);

    case ADD_UPDATE_RULE_ACTION_TYPES.SET_ADD_CUSTOM_CASE_CONDITION:
      return addCustomCaseCondition(state, payload);

    case ADD_UPDATE_RULE_ACTION_TYPES.SET_REMOVE_CUSTOM_CASE:
      return removeCustomCase(state, payload);

    case ADD_UPDATE_RULE_ACTION_TYPES.SET_REMOVE_CUSTOM_CASE_CONDITION:
      return removeCustomCaseCondition(state, payload);

    case ADD_UPDATE_RULE_ACTION_TYPES.SET_UPDATE_CUSTOM_CASE_CONDITION:
      return updateCustomCaseCondition(state, payload);

    case ADD_UPDATE_RULE_ACTION_TYPES.SET_SAVE_CUSTOM_SECTION:
      return saveCustomSection(state);

    case ADD_UPDATE_RULE_ACTION_TYPES.SET_REMOVE_CUSTOM_SECTION:
      return removeCustomSection(state, payload);

    case ADD_UPDATE_RULE_ACTION_TYPES.SET_SAVE_DEFAULT_SECTION:
      return saveDefaultSection(state);

    case ADD_UPDATE_RULE_ACTION_TYPES.SET_CURRENT_EDITING_SECTION_INDEX:
      return setCurrentEditingSectionIndex(state, payload);

    case ADD_UPDATE_RULE_ACTION_TYPES.CLEAN_RULE_CONFIG_BEFORE_ADD_UPDATE:
      return cleanRuleConfigBeforeAddUpdate(state);

    case ADD_UPDATE_RULE_ACTION_TYPES.HANDLE_ENTITY_HEAD_VALUES_FOR_UPDATE:
      return handleEntityHeadValuesForUpdate(state);

    case ADD_UPDATE_RULE_ACTION_TYPES.MOVE_CUSTOM_SECTION_UP:
      return moveCustomSectionUp(state, payload);

    case ADD_UPDATE_RULE_ACTION_TYPES.MOVE_CUSTOM_SECTION_DOWN:
      return moveCustomSectionDown(state, payload);

    case ADD_UPDATE_RULE_ACTION_TYPES.MOVE_CUSTOM_CASE_UP:
      return moveCustomCaseUp(state, payload);

    case ADD_UPDATE_RULE_ACTION_TYPES.MOVE_CUSTOM_CASE_DOWN:
      return moveCustomCaseDown(state, payload);

    case ADD_UPDATE_RULE_ACTION_TYPES.SET_COST_CENTRES:
      return setCostCentres(state, payload);

    default:
      return state;
  }
};

// --- Setters ---
const resetAddUpdateRuleState = (state: IAddUpdateRule) => {
  return Object.assign(state, initialState);
};

const setAddUpdateRuleAction = (state: IAddUpdateRule, payload: any) => {
  return { ...state, add_update_rule_action: payload };
};

const setProcessTypes = (state: IAddUpdateRule, payload: any[]) => {
  return { ...state, process_types: payload };
};

const setRuleTitle = (state: IAddUpdateRule, payload: string) => {
  return { ...state, rule_title: payload };
};

const setSelectedProcessType = (state: IAddUpdateRule, payload: string) => {
  return { ...state, selected_process_type: payload };
};

const setTypeObjects = (state: IAddUpdateRule, payload: any[]) => {
  return { ...state, type_objects: payload, type_objects_status: false };
};

const setTypeObjectsStatus = (state: IAddUpdateRule, payload: any[]) => {
  return { ...state, type_objects_status: payload };
};

const setSelectedTypeObject = (state: IAddUpdateRule, payload: any) => {
  return { ...state, selected_type_object: payload };
};

const setOptions = (state: IAddUpdateRule, payload: any[]) => {
  return { ...state, options: payload };
};

const setOperators = (state: IAddUpdateRule, payload: {}) => {
  return { ...state, operators: payload };
};

const setAllowedStepOwners = (state: IAddUpdateRule, payload: any[]) => {
  return { ...state, allowed_step_owners: payload };
};

const setAllowedFallbackStepOwners = (
  state: IAddUpdateRule,
  payload: any[],
) => {
  return { ...state, allowed_fallback_step_owners: payload };
};

const setGenders = (state: IAddUpdateRule, payload: any[]) => {
  return { ...state, genders: payload };
};

const setMaritalStatuses = (state: IAddUpdateRule, payload: any[]) => {
  return { ...state, marital_statuses: payload };
};

const setContractTypes = (state: IAddUpdateRule, payload: any[]) => {
  return { ...state, contract_types: payload };
};

const setRefObjEmpGroups = (state: IAddUpdateRule, payload: any[]) => {
  return { ...state, ref_obj_emp_groups: payload };
};

const setEmpSubGroups = (state: IAddUpdateRule, payload: any[]) => {
  return { ...state, emp_sub_groups: payload };
};

const setEmpGroups = (state: IAddUpdateRule, payload: any[]) => {
  return { ...state, emp_groups: payload };
};
const setApproversCustomFields = (state: IAddUpdateRule, payload: any[]) => {
  return { ...state, approvers_custom_fields: payload };
};

const setPayGrades = (state: IAddUpdateRule, payload: any[]) => {
  return { ...state, pay_grades: payload };
};

const setEmployeeIds = (state: IAddUpdateRule, payload: any[]) => {
  return { ...state, employee_ids: payload };
};

const setUsers = (state: IAddUpdateRule, payload: any[]) => {
  return { ...state, users: payload };
};

const setLegalEntities = (state: IAddUpdateRule, payload: any[]) => {
  return { ...state, legal_entities: payload };
};

const getRuleStructure = () => {
  return {
    custom: [],
    default: {
      rule: {
        cases: [],
        default_case: {},
      },
    },
  };
};

const initializeRuleConfig = (state: IAddUpdateRule) => {
  return {
    ...state,
    rule_config: getRuleStructure(),
  };
};

const setRuleConfig = (state: IAddUpdateRule, payload: any) => {
  return {
    ...state,
    rule_config: payload,
  };
};

const initializeReadableRuleConfig = (state: IAddUpdateRule) => {
  return {
    ...state,
    readable_rule_config: getRuleStructure(),
  };
};

const setReadableRuleConfig = (state: IAddUpdateRule, payload: any) => {
  return {
    ...state,
    readable_rule_config: payload,
  };
};

const newEmptyCustomSectionStructure = () => ({
  entities: [],
  criterias: [],
  rule: {
    cases: [],
    default_case: {
      is_auto_approval: true,
      steps: [],
      fallback_steps: [],
    },
  },
});

const newEmptyDefaultSectionStructure = () => ({
  rule: {
    cases: [],
    default_case: {
      is_auto_approval: true,
      steps: [],
      fallback_steps: [],
    },
  },
});

const initializeCurrentSectionData = (
  state: IAddUpdateRule,
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
  state: IAddUpdateRule,
  indexToBeEdited: number,
) => {
  const currentSectionDataCopy = cloneDeep(
    state.rule_config.custom[indexToBeEdited],
  );
  const currentReadableSectionDataCopy = cloneDeep(
    state.readable_rule_config.custom[indexToBeEdited],
  );
  return {
    ...state,
    current_section_data: currentSectionDataCopy,
    current_readable_section_data: currentReadableSectionDataCopy,
  };
};

const populateDefaultSectionData = (state: IAddUpdateRule) => {
  const currentSectionDataCopy = cloneDeep(state.rule_config.default);
  const currentReadableSectionDataCopy = cloneDeep(
    state.readable_rule_config.default,
  );
  return {
    ...state,
    current_section_data: currentSectionDataCopy,
    current_readable_section_data: currentReadableSectionDataCopy,
  };
};

const setDrawerFor = (state: IAddUpdateRule, payload: string) => {
  return { ...state, drawer_for: payload };
};

const setDrawerTitle = (state: IAddUpdateRule, payload: string) => {
  return { ...state, drawer_title: payload };
};

const setDrawerAction = (state: IAddUpdateRule, payload: string) => {
  return { ...state, drawer_action: payload };
};

const setCurrSecEntities = (
  state: IAddUpdateRule,
  { uuids }: { uuids: any },
) => {
  const currentSectionDataCopy = cloneDeep(state.current_section_data);
  currentSectionDataCopy.entities = uuids;
  return { ...state, current_section_data: currentSectionDataCopy };
};

const setCurrReadSecEntities = (
  state: IAddUpdateRule,
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

const addNewOrCriteria = (state: IAddUpdateRule) => {
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
  state: IAddUpdateRule,
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
  state: IAddUpdateRule,
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
  state: IAddUpdateRule,
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
  state: IAddUpdateRule,
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

const setIsAutoApproval = (
  state: IAddUpdateRule,
  {
    isCheck,
    caseType,
    caseIndex,
  }: {
    isCheck: boolean;
    caseType: 'CUSTOM' | 'DEFAULT';
    caseIndex: number | null;
  },
) => {
  const currentSectionDataCopy = cloneDeep(state.current_section_data);
  const currentReadableSectionDataCopy = cloneDeep(
    state.current_readable_section_data,
  );

  if (caseType === 'DEFAULT') {
    currentSectionDataCopy.rule.default_case.is_auto_approval = isCheck;
    currentReadableSectionDataCopy.rule.default_case.is_auto_approval = isCheck;
    if (isCheck) {
      currentSectionDataCopy.rule.default_case.steps = [];
      currentReadableSectionDataCopy.rule.default_case.steps = [];

      currentSectionDataCopy.rule.default_case.fallback_steps = [];
      currentReadableSectionDataCopy.rule.default_case.fallback_steps = [];
    }
  } else if (caseType === 'CUSTOM' && caseIndex !== null) {
    currentSectionDataCopy.rule.cases[caseIndex].is_auto_approval = isCheck;
    currentReadableSectionDataCopy.rule.cases[
      caseIndex
    ].is_auto_approval = isCheck;
    if (isCheck) {
      currentSectionDataCopy.rule.cases[caseIndex].steps = [];
      currentReadableSectionDataCopy.rule.cases[caseIndex].steps = [];

      currentSectionDataCopy.rule.cases[caseIndex].fallback_steps = [];
      currentReadableSectionDataCopy.rule.cases[caseIndex].fallback_steps = [];
    }
  }

  return {
    ...state,
    current_section_data: currentSectionDataCopy,
    current_readable_section_data: currentReadableSectionDataCopy,
  };
};

const addRuleStep = (
  state: IAddUpdateRule,
  {
    caseType,
    caseIndex,
  }: {
    caseType: string;
    caseIndex: number;
  },
) => {
  const currentSectionDataCopy = cloneDeep(state.current_section_data);
  if (caseType === 'DEFAULT') {
    currentSectionDataCopy.rule.default_case.steps.push({
      owner: null,
      owner_id: null,
    });
    currentSectionDataCopy.rule.default_case.fallback_steps.push({
      owner: 'DO_NOTHING',
      owner_id: null,
    });
  } else {
    currentSectionDataCopy.rule.cases[caseIndex].steps.push({
      owner: null,
      owner_id: null,
    });
    currentSectionDataCopy.rule.cases[caseIndex].fallback_steps.push({
      owner: 'DO_NOTHING',
      owner_id: null,
    });
  }

  const currentReadableSectionDataCopy = cloneDeep(
    state.current_readable_section_data,
  );
  if (caseType === 'DEFAULT') {
    currentReadableSectionDataCopy.rule.default_case.steps.push({
      owner: null,
      owner_id: null,
    });
    currentReadableSectionDataCopy.rule.default_case.fallback_steps.push({
      owner: 'Move to Stalled state',
      owner_id: null,
    });
  } else {
    currentReadableSectionDataCopy.rule.cases[caseIndex].steps.push({
      owner: null,
      owner_id: null,
    });
    currentReadableSectionDataCopy.rule.cases[caseIndex].fallback_steps.push({
      owner: 'Move to Stalled state',
      owner_id: null,
    });
  }

  return {
    ...state,
    current_section_data: currentSectionDataCopy,
    current_readable_section_data: currentReadableSectionDataCopy,
  };
};

const removeRuleStep = (
  state: IAddUpdateRule,
  {
    caseType,
    caseIndex,
    toBeRemovedIndex,
  }: {
    caseType: 'CUSTOM' | 'DEFAULT';
    caseIndex: number;
    toBeRemovedIndex: number;
  },
) => {
  const currentSectionDataCopy = cloneDeep(state.current_section_data);
  if (caseType === 'DEFAULT') {
    const updated = currentSectionDataCopy.rule.default_case.steps.filter(
      (_item: any, index: number) => index !== toBeRemovedIndex,
    );
    currentSectionDataCopy.rule.default_case.steps = updated;

    const updated2 = currentSectionDataCopy.rule.default_case.fallback_steps.filter(
      (_item: any, index: number) => index !== toBeRemovedIndex,
    );
    currentSectionDataCopy.rule.default_case.fallback_steps = updated2;
  } else if (caseType === 'CUSTOM') {
    const updated = currentSectionDataCopy.rule.cases[caseIndex].steps.filter(
      (_item: any, index: number) => index !== toBeRemovedIndex,
    );
    currentSectionDataCopy.rule.cases[caseIndex].steps = updated;

    const updated2 = currentSectionDataCopy.rule.cases[
      caseIndex
    ].fallback_steps.filter(
      (_item: any, index: number) => index !== toBeRemovedIndex,
    );
    currentSectionDataCopy.rule.cases[caseIndex].fallback_steps = updated2;
  }

  const currentReadableSectionDataCopy = cloneDeep(
    state.current_readable_section_data,
  );
  if (caseType === 'DEFAULT') {
    const updated = currentReadableSectionDataCopy.rule.default_case.steps.filter(
      (_item: any, index: number) => index !== toBeRemovedIndex,
    );
    currentReadableSectionDataCopy.rule.default_case.steps = updated;

    const updated2 = currentReadableSectionDataCopy.rule.default_case.fallback_steps.filter(
      (_item: any, index: number) => index !== toBeRemovedIndex,
    );
    currentReadableSectionDataCopy.rule.default_case.fallback_steps = updated2;
  } else if (caseType === 'CUSTOM') {
    const updated = currentReadableSectionDataCopy.rule.cases[
      caseIndex
    ].steps.filter((_item: any, index: number) => index !== toBeRemovedIndex);
    currentReadableSectionDataCopy.rule.cases[caseIndex].steps = updated;

    const updated2 = currentReadableSectionDataCopy.rule.cases[
      caseIndex
    ].fallback_steps.filter(
      (_item: any, index: number) => index !== toBeRemovedIndex,
    );
    currentReadableSectionDataCopy.rule.cases[
      caseIndex
    ].fallback_steps = updated2;
  }

  return {
    ...state,
    current_section_data: currentSectionDataCopy,
    current_readable_section_data: currentReadableSectionDataCopy,
  };
};

const updateStepOwner = (
  state: IAddUpdateRule,
  {
    caseType,
    caseIndex,
    stepIndex,
    updateValue,
    isFallbackStepType,
  }: {
    caseType: 'CUSTOM' | 'DEFAULT';
    caseIndex: number;
    stepIndex: number;
    updateValue: string;
    isFallbackStepType: any;
  },
) => {
  const currentSectionDataCopy = cloneDeep(state.current_section_data);

  const updateObj = { owner: updateValue, owner_id: null };

  if (updateValue.startsWith('ENTITY_TYPE_HEAD')) {
    const stepOwnerItem = state.allowed_step_owners.filter(
      i => i.code === updateValue,
    );
    const entityTypeId = stepOwnerItem[0].entity_type_id;
    Object.assign(updateObj, {
      owner_id: entityTypeId,
    });
  }

  if (isFallbackStepType) {
    if (caseType === 'DEFAULT') {
      Object.assign(
        currentSectionDataCopy.rule.default_case.fallback_steps[stepIndex],
        updateObj,
      );
    } else if (caseType === 'CUSTOM') {
      Object.assign(
        currentSectionDataCopy.rule.cases[caseIndex].fallback_steps[stepIndex],
        updateObj,
      );
    }
  } else {
    if (caseType === 'DEFAULT') {
      Object.assign(
        currentSectionDataCopy.rule.default_case.steps[stepIndex],
        updateObj,
      );
    } else if (caseType === 'CUSTOM') {
      Object.assign(
        currentSectionDataCopy.rule.cases[caseIndex].steps[stepIndex],
        updateObj,
      );
    }
  }

  let currentReadableSectionDataCopy = cloneDeep(
    state.current_readable_section_data,
  );
  if (isFallbackStepType) {
    const stepOwnerItem = state.allowed_fallback_step_owners.filter(
      i => i.code === updateValue,
    );
    const stepOwnerTitle = stepOwnerItem[0].title;
    Object.assign(updateObj, { owner: stepOwnerTitle });

    if (caseType === 'DEFAULT') {
      Object.assign(
        currentReadableSectionDataCopy.rule.default_case.fallback_steps[
          stepIndex
        ],
        updateObj,
      );
    } else if (caseType === 'CUSTOM') {
      Object.assign(
        currentReadableSectionDataCopy.rule.cases[caseIndex].fallback_steps[
          stepIndex
        ],
        updateObj,
      );
    }
  } else {
    const stepOwnerItem = state.allowed_step_owners.filter(
      i => i.code === updateValue,
    );
    const stepOwnerTitle = stepOwnerItem[0].title;
    Object.assign(updateObj, { owner: stepOwnerTitle });

    if (caseType === 'DEFAULT') {
      Object.assign(
        currentReadableSectionDataCopy.rule.default_case.steps[stepIndex],
        updateObj,
      );
    } else if (caseType === 'CUSTOM') {
      Object.assign(
        currentReadableSectionDataCopy.rule.cases[caseIndex].steps[stepIndex],
        updateObj,
      );
    }
  }

  return {
    ...state,
    current_section_data: currentSectionDataCopy,
    current_readable_section_data: currentReadableSectionDataCopy,
  };
};

const updateStepOwnerId = (
  state: IAddUpdateRule,
  {
    caseType,
    caseIndex,
    stepIndex,
    updateValue,
    readableValue,
    isFallbackStepType,
  }: {
    caseType: 'CUSTOM' | 'DEFAULT';
    caseIndex: number;
    stepIndex: number;
    updateValue: any;
    readableValue: any;
    isFallbackStepType: any;
  },
) => {
  const currentSectionDataCopy = cloneDeep(state.current_section_data);
  const currentReadableSectionDataCopy = cloneDeep(
    state.current_readable_section_data,
  );

  if (isFallbackStepType) {
    if (caseType === 'DEFAULT') {
      currentSectionDataCopy.rule.default_case.fallback_steps[stepIndex][
        'owner_id'
      ] = updateValue;
    } else if (caseType === 'CUSTOM') {
      currentSectionDataCopy.rule.cases[caseIndex].fallback_steps[stepIndex][
        'owner_id'
      ] = updateValue;
    }

    if (caseType === 'DEFAULT') {
      currentReadableSectionDataCopy.rule.default_case.fallback_steps[
        stepIndex
      ]['owner_id'] = readableValue.children;
    } else if (caseType === 'CUSTOM') {
      currentReadableSectionDataCopy.rule.cases[caseIndex].fallback_steps[
        stepIndex
      ]['owner_id'] = readableValue.children;
    }
  } else {
    if (caseType === 'DEFAULT') {
      currentSectionDataCopy.rule.default_case.steps[stepIndex][
        'owner_id'
      ] = updateValue;
    } else if (caseType === 'CUSTOM') {
      currentSectionDataCopy.rule.cases[caseIndex].steps[stepIndex][
        'owner_id'
      ] = updateValue;
    }

    if (caseType === 'DEFAULT') {
      currentReadableSectionDataCopy.rule.default_case.steps[stepIndex][
        'owner_id'
      ] = readableValue.children;
    } else if (caseType === 'CUSTOM') {
      currentReadableSectionDataCopy.rule.cases[caseIndex].steps[stepIndex][
        'owner_id'
      ] = readableValue.children;
    }
  }

  return {
    ...state,
    current_section_data: currentSectionDataCopy,
    current_readable_section_data: currentReadableSectionDataCopy,
  };
};

const addCustomCase = (state: IAddUpdateRule) => {
  const currentSectionDataCopy = cloneDeep(state.current_section_data);
  currentSectionDataCopy.rule.cases.push({
    conditions: [{ option: 'COST_CENTRE_TYPE', operator: null, value: [] }],
    is_auto_approval: true,
    steps: [],
    fallback_steps: [],
  });

  const currentReadableSectionDataCopy = cloneDeep(
    state.current_readable_section_data,
  );
  currentReadableSectionDataCopy.rule.cases.push({
    conditions: [{ option: 'COST_CENTRE_TYPE', operator: null, value: [] }],
    is_auto_approval: true,
    steps: [],
    fallback_steps: [],
  });

  return {
    ...state,
    current_section_data: currentSectionDataCopy,
    current_readable_section_data: currentReadableSectionDataCopy,
  };
};

const addCustomCaseCondition = (
  state: IAddUpdateRule,
  {
    caseIndex,
  }: {
    caseIndex: number;
  },
) => {
  const currentSectionDataCopy = cloneDeep(state.current_section_data);
  currentSectionDataCopy.rule.cases[caseIndex].conditions.push({
    option: 'COST_CENTRE_TYPE',
    operator: null,
    value: [],
  });

  const currentReadableSectionDataCopy = cloneDeep(
    state.current_readable_section_data,
  );
  currentReadableSectionDataCopy.rule.cases[caseIndex].conditions.push({
    option: 'COST_CENTRE_TYPE',
    operator: null,
    value: [],
  });

  return {
    ...state,
    current_section_data: currentSectionDataCopy,
    current_readable_section_data: currentReadableSectionDataCopy,
  };
};

const removeCustomCase = (
  state: IAddUpdateRule,
  {
    toBeRemovedIndex,
  }: {
    toBeRemovedIndex: number;
  },
) => {
  const currentSectionDataCopy = cloneDeep(state.current_section_data);
  let updated = currentSectionDataCopy.rule.cases.filter(
    (_item: any, index: number) => index !== toBeRemovedIndex,
  );
  currentSectionDataCopy.rule.cases = updated;

  const currentReadableSectionDataCopy = cloneDeep(
    state.current_readable_section_data,
  );
  updated = currentReadableSectionDataCopy.rule.cases.filter(
    (_item: any, index: number) => index !== toBeRemovedIndex,
  );
  currentReadableSectionDataCopy.rule.cases = updated;

  return {
    ...state,
    current_section_data: currentSectionDataCopy,
    current_readable_section_data: currentReadableSectionDataCopy,
  };
};

const removeCustomCaseCondition = (
  state: IAddUpdateRule,
  {
    caseIndex,
    toBeRemovedIndex,
  }: {
    caseIndex: number;
    toBeRemovedIndex: number;
  },
) => {
  const currentSectionDataCopy = cloneDeep(state.current_section_data);
  let updated = currentSectionDataCopy.rule.cases[caseIndex].conditions.filter(
    (_item: any, index: number) => index !== toBeRemovedIndex,
  );
  currentSectionDataCopy.rule.cases[caseIndex].conditions = updated;

  const currentReadableSectionDataCopy = cloneDeep(
    state.current_readable_section_data,
  );
  updated = currentReadableSectionDataCopy.rule.cases[
    caseIndex
  ].conditions.filter(
    (_item: any, index: number) => index !== toBeRemovedIndex,
  );
  currentReadableSectionDataCopy.rule.cases[caseIndex].conditions = updated;

  return {
    ...state,
    current_section_data: currentSectionDataCopy,
    current_readable_section_data: currentReadableSectionDataCopy,
  };
};

const updateCustomCaseCondition = (
  state: IAddUpdateRule,
  {
    caseIndex,
    conditionIndex,
    updateType,
    updateValue,
    isNumberType,
    updateDisplayValue,
  }: {
    caseIndex: number;
    conditionIndex: number;
    updateType: string;
    updateValue: any;
    isNumberType: boolean;
    updateDisplayValue: string[] | null;
  },
) => {
  if (isNumberType) {
    updateValue = parseFloat(updateValue);
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

  currentSectionDataCopy.rule.cases[caseIndex].conditions[conditionIndex][
    valueKeyMap[updateType]
  ] = updateValue;

  currentReadableSectionDataCopy.rule.cases[caseIndex].conditions[
    conditionIndex
  ][valueKeyMap[updateType]] = updateDisplayValue
    ? updateDisplayValue
    : updateValue;

  if (updateType === 'OPTION') {
    currentSectionDataCopy.rule.cases[caseIndex].conditions[conditionIndex][
      'operator'
    ] = null;

    currentReadableSectionDataCopy.rule.cases[caseIndex].conditions[
      conditionIndex
    ]['operator'] = null;

    currentSectionDataCopy.rule.cases[caseIndex].conditions[conditionIndex][
      'value'
    ] = updateValue === 'EXPENSE_CLAIM_AMOUNT' ? null : [];

    currentReadableSectionDataCopy.rule.cases[caseIndex].conditions[
      conditionIndex
    ]['value'] = updateValue === 'EXPENSE_CLAIM_AMOUNT' ? null : [];
  }

  return {
    ...state,
    current_section_data: currentSectionDataCopy,
    current_readable_section_data: currentReadableSectionDataCopy,
  };
};

const saveCustomSection = (state: IAddUpdateRule) => {
  const ruleConfigCopy = cloneDeep(state.rule_config);
  const readableRuleConfigCopy = cloneDeep(state.readable_rule_config);

  if (state.drawer_action === 'ADD') {
    ruleConfigCopy['custom'].push(state.current_section_data);
    readableRuleConfigCopy['custom'].push(state.current_readable_section_data);
  } else if (state.drawer_action === 'EDIT') {
    if (state.current_editing_section_index !== null) {
      ruleConfigCopy.custom[state.current_editing_section_index] =
        state.current_section_data;
      readableRuleConfigCopy.custom[state.current_editing_section_index] =
        state.current_readable_section_data;
    }
  }
  return {
    ...state,
    rule_config: ruleConfigCopy,
    readable_rule_config: readableRuleConfigCopy,
  };
};

const saveDefaultSection = (state: IAddUpdateRule) => {
  const ruleConfigCopy = cloneDeep(state.rule_config);
  const readableRuleConfigCopy = cloneDeep(state.readable_rule_config);

  ruleConfigCopy.default = state.current_section_data;
  readableRuleConfigCopy.default = state.current_readable_section_data;

  return {
    ...state,
    rule_config: ruleConfigCopy,
    readable_rule_config: readableRuleConfigCopy,
  };
};

const removeCustomSection = (
  state: IAddUpdateRule,
  { toBeRemovedIndex }: { toBeRemovedIndex: number },
) => {
  const ruleConfigCopy = cloneDeep(state.rule_config);
  let updated = ruleConfigCopy.custom.filter(
    (_item: any, index: number) => index !== toBeRemovedIndex,
  );
  ruleConfigCopy.custom = updated;

  const readableRuleConfigCopy = cloneDeep(state.readable_rule_config);
  updated = readableRuleConfigCopy.custom.filter(
    (_item: any, index: number) => index !== toBeRemovedIndex,
  );
  readableRuleConfigCopy.custom = updated;

  return {
    ...state,
    rule_config: ruleConfigCopy,
    readable_rule_config: readableRuleConfigCopy,
  };
};

const setCurrentEditingSectionIndex = (
  state: IAddUpdateRule,
  payload: number | null,
) => {
  return { ...state, current_editing_section_index: payload };
};

const cleanRuleConfigBeforeAddUpdate = (state: IAddUpdateRule) => {
  let ruleConfigCopy = cloneDeep(state.rule_config);

  ruleConfigCopy.custom.forEach((customItem: any) => {
    // custom item cases
    customItem.rule.cases.forEach((customCaseItem: any) => {
      Object.assign(
        customCaseItem.steps,
        customCaseItem.steps.map((stepItem: any) => {
          if (stepItem.owner.startsWith('ENTITY_TYPE_HEAD')) {
            return {
              ...stepItem,
              owner: 'ENTITY_TYPE_HEAD',
            };
          }
          return stepItem;
        }),
      );
    });

    // custom item default case
    Object.assign(
      customItem.rule.default_case.steps,
      customItem.rule.default_case.steps.map((stepItem: any) => {
        if (stepItem.owner.startsWith('ENTITY_TYPE_HEAD')) {
          return {
            ...stepItem,
            owner: 'ENTITY_TYPE_HEAD',
          };
        }
        return stepItem;
      }),
    );
  });

  // default item cases
  ruleConfigCopy.default.rule.cases.forEach((customCaseItem: any) => {
    Object.assign(
      customCaseItem.steps,
      customCaseItem.steps.map((stepItem: any) => {
        if (stepItem.owner.startsWith('ENTITY_TYPE_HEAD')) {
          return {
            ...stepItem,
            owner: 'ENTITY_TYPE_HEAD',
          };
        }
        return stepItem;
      }),
    );
  });

  // default item default case
  Object.assign(
    ruleConfigCopy.default.rule.default_case.steps,
    ruleConfigCopy.default.rule.default_case.steps.map((stepItem: any) => {
      if (stepItem.owner.startsWith('ENTITY_TYPE_HEAD')) {
        return {
          ...stepItem,
          owner: 'ENTITY_TYPE_HEAD',
        };
      }
      return stepItem;
    }),
  );

  return {
    ...state,
    // rule_config: ruleConfigCopy,
    rule_config: {
      custom: ruleConfigCopy.custom,
      default: ruleConfigCopy.default,
    },
  };
};

const handleEntityHeadValuesForUpdate = (state: IAddUpdateRule) => {
  let ruleConfigCopy = cloneDeep(state.rule_config);

  ruleConfigCopy.custom.forEach((customItem: any) => {
    // custom item cases
    customItem.rule.cases.forEach((customCaseItem: any) => {
      Object.assign(
        customCaseItem.steps,
        customCaseItem.steps.map((stepItem: any) => {
          if (stepItem.owner.startsWith('ENTITY_TYPE_HEAD')) {
            return {
              ...stepItem,
              owner: `ENTITY_TYPE_HEAD_${stepItem.owner_id}`,
            };
          }
          return stepItem;
        }),
      );
    });

    // custom item default case
    Object.assign(
      customItem.rule.default_case.steps,
      customItem.rule.default_case.steps.map((stepItem: any) => {
        if (stepItem.owner.startsWith('ENTITY_TYPE_HEAD')) {
          return {
            ...stepItem,
            owner: `ENTITY_TYPE_HEAD_${stepItem.owner_id}`,
          };
        }
        return stepItem;
      }),
    );
  });

  // default item cases
  ruleConfigCopy.default.rule.cases.forEach((customCaseItem: any) => {
    Object.assign(
      customCaseItem.steps,
      customCaseItem.steps.map((stepItem: any) => {
        if (stepItem.owner.startsWith('ENTITY_TYPE_HEAD')) {
          return {
            ...stepItem,
            owner: `ENTITY_TYPE_HEAD_${stepItem.owner_id}`,
          };
        }
        return stepItem;
      }),
    );
  });

  // default item default case
  Object.assign(
    ruleConfigCopy.default.rule.default_case.steps,
    ruleConfigCopy.default.rule.default_case.steps.map((stepItem: any) => {
      if (stepItem.owner.startsWith('ENTITY_TYPE_HEAD')) {
        return {
          ...stepItem,
          owner: `ENTITY_TYPE_HEAD_${stepItem.owner_id}`,
        };
      }
      return stepItem;
    }),
  );

  return {
    ...state,
    rule_config: {
      custom: ruleConfigCopy.custom,
      default: ruleConfigCopy.default,
    },
  };
};

const moveCustomSectionUp = (state: IAddUpdateRule, index: number) => {
  const ruleConfigCopy = cloneDeep(state.rule_config);
  let mainItem = ruleConfigCopy.custom[index];
  let toBeSwappedItem = ruleConfigCopy.custom[index - 1];
  ruleConfigCopy.custom[index - 1] = mainItem;
  ruleConfigCopy.custom[index] = toBeSwappedItem;

  const readableRuleConfigCopy = cloneDeep(state.readable_rule_config);
  mainItem = readableRuleConfigCopy.custom[index];
  toBeSwappedItem = readableRuleConfigCopy.custom[index - 1];
  readableRuleConfigCopy.custom[index - 1] = mainItem;
  readableRuleConfigCopy.custom[index] = toBeSwappedItem;

  return {
    ...state,
    rule_config: ruleConfigCopy,
    readable_rule_config: readableRuleConfigCopy,
  };
};

const moveCustomSectionDown = (state: IAddUpdateRule, index: number) => {
  const ruleConfigCopy = cloneDeep(state.rule_config);
  let mainItem = ruleConfigCopy.custom[index];
  let toBeSwappedItem = ruleConfigCopy.custom[index + 1];
  ruleConfigCopy.custom[index + 1] = mainItem;
  ruleConfigCopy.custom[index] = toBeSwappedItem;

  const readableRuleConfigCopy = cloneDeep(state.readable_rule_config);
  mainItem = readableRuleConfigCopy.custom[index];
  toBeSwappedItem = readableRuleConfigCopy.custom[index + 1];
  readableRuleConfigCopy.custom[index + 1] = mainItem;
  readableRuleConfigCopy.custom[index] = toBeSwappedItem;

  return {
    ...state,
    rule_config: ruleConfigCopy,
    readable_rule_config: readableRuleConfigCopy,
  };
};

const moveCustomCaseUp = (state: IAddUpdateRule, index: number) => {
  const currentSectionDataCopy = cloneDeep(state.current_section_data);
  const casesCopy = cloneDeep(currentSectionDataCopy.rule.cases);

  let mainItem = casesCopy[index];
  let toBeSwappedItem = casesCopy[index - 1];
  casesCopy[index - 1] = mainItem;
  casesCopy[index] = toBeSwappedItem;

  currentSectionDataCopy.rule.cases = casesCopy;

  const currentReadableSectionDataCopy = cloneDeep(
    state.current_readable_section_data,
  );
  const readableCasesCopy = cloneDeep(
    state.current_readable_section_data.rule.cases,
  );

  mainItem = readableCasesCopy[index];
  toBeSwappedItem = readableCasesCopy[index - 1];
  readableCasesCopy[index - 1] = mainItem;
  readableCasesCopy[index] = toBeSwappedItem;

  currentReadableSectionDataCopy.rule.cases = readableCasesCopy;

  return {
    ...state,
    current_section_data: currentSectionDataCopy,
    current_readable_section_data: currentReadableSectionDataCopy,
  };
};

const moveCustomCaseDown = (state: IAddUpdateRule, index: number) => {
  const currentSectionDataCopy = cloneDeep(state.current_section_data);
  let mainItem = currentSectionDataCopy.rule.cases[index];
  let toBeSwappedItem = currentSectionDataCopy.rule.cases[index + 1];
  currentSectionDataCopy.rule.cases[index + 1] = mainItem;
  currentSectionDataCopy.rule.cases[index] = toBeSwappedItem;

  const currentReadableSectionDataCopy = cloneDeep(
    state.current_readable_section_data,
  );
  mainItem = currentReadableSectionDataCopy.rule.cases[index];
  toBeSwappedItem = currentReadableSectionDataCopy.rule.cases[index + 1];
  currentReadableSectionDataCopy.rule.cases[index + 1] = mainItem;
  currentReadableSectionDataCopy.rule.cases[index] = toBeSwappedItem;

  return {
    ...state,
    current_section_data: currentSectionDataCopy,
    current_readable_section_data: currentReadableSectionDataCopy,
  };
};

const setCostCentres = (state: IAddUpdateRule, payload: any[]) => {
  return { ...state, cost_centres: payload };
};
// ---------------
