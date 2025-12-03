export const ADD_UPDATE_RULE_ACTION_TYPES = {
  RESET_ADD_UPDATE_RULE_STATE: 'ADD_UPDATE_RULE/RESET_ADD_UPDATE_RULE_STATE',

  SET_ADD_UPDATE_RULE_ACTION: 'ADD_UPDATE_RULE/SET_ADD_UPDATE_RULE_ACTION',
  SET_PROCESS_TYPES: 'ADD_UPDATE_RULE/SET_PROCESS_TYPES',
  SET_SELECTED_PROCESS_TYPE: 'ADD_UPDATE_RULE/SET_SELECTED_PROCESS_TYPE',

  SET_RULE_TITLE: 'ADD_UPDATE_RULE/SET_RULE_TITLE',

  SET_TYPE_OBJECTS: 'ADD_UPDATE_RULE/SET_TYPE_OBJECTS',
  SET_TYPE_OBJECTS_STATUS: 'ADD_UPDATE_RULE/SET_TYPE_OBJECTS_STATUS',
  SET_SELECTED_TYPE_OBJECT: 'ADD_UPDATE_RULE/SET_SELECTED_TYPE_OBJECT',

  SET_OPTIONS: 'ADD_UPDATE_RULE/SET_OPTIONS',
  SET_OPERATORS: 'ADD_UPDATE_RULE/SET_OPERATORS',
  SET_ALLOWED_STEP_OWNERS: 'ADD_UPDATE_RULE/SET_ALLOWED_STEP_OWNERS',
  SET_ALLOWED_FALLBACK_STEP_OWNERS:
    'ADD_UPDATE_RULE/SET_ALLOWED_FALLBACK_STEP_OWNERS',
  SET_GENDERS: 'ADD_UPDATE_RULE/SET_GENDERS',
  SET_MARITAL_STATUS: 'ADD_UPDATE_RULE/SET_MARITAL_STATUS',
  SET_CONTRACT_TYPES: 'ADD_UPDATE_RULE/SET_CONTRACT_TYPES',
  SET_REF_OBJ_EMP_GROUPS: 'ADD_UPDATE_RULE/SET_REF_OBJ_EMP_GROUPS',
  SET_EMP_SUB_GROUPS: 'ADD_UPDATE_RULE/SET_EMP_SUB_GROUPS',
  SET_EMP_GROUPS: 'ADD_UPDATE_RULE/SET_EMP_GROUPS',
  SET_APPROVERS_CUSTOM_FIELDS: 'ADD_UPDATE_RULE/SET_APPROVERS_CUSTOM_FIELDS',
  SET_PAY_GRADES: 'ADD_UPDATE_RULE/SET_PAY_GRADES',
  SET_EMPLOYEE_IDS: 'ADD_UPDATE_RULE/SET_EMPLOYEE_IDS',
  SET_USERS: 'ADD_UPDATE_RULE/SET_USERS',
  SET_LEGAL_ENTITIES: 'ADD_UPDATE_RULE/SET_LEGAL_ENTITIES',

  INIT_RULE_CONFIG: 'ADD_UPDATE_RULE/INIT_RULE_CONFIG',
  SET_RULE_CONFIG: 'ADD_UPDATE_RULE/SET_RULE_CONFIG',
  INIT_READABLE_RULE_CONFIG: 'ADD_UPDATE_RULE/INIT_READABLE_RULE_CONFIG',
  SET_READABLE_RULE_CONFIG: 'ADD_UPDATE_RULE/SET_READABLE_RULE_CONFIG',

  INIT_CURRENT_SECTION_DATA: 'ADD_UPDATE_RULE/INIT_CURRENT_SECTION_DATA',
  POPULATE_CURRENT_SECTION_DATA:
    'ADD_UPDATE_RULE/POPULATE_CURRENT_SECTION_DATA',
  POPULATE_DEFAULT_SECTION_DATA:
    'ADD_UPDATE_RULE/POPULATE_DEFAULT_SECTION_DATA',

  SET_DRAWER_TITLE: 'ADD_UPDATE_RULE/SET_DRAWER_TITLE',
  SET_DRAWER_FOR: 'ADD_UPDATE_RULE/SET_DRAWER_FOR',
  SET_DRAWER_ACTION: 'ADD_UPDATE_RULE/SET_DRAWER_ACTION',

  SET_CURR_SEC_ENTITIES: 'ADD_UPDATE_RULE/SET_CURR_SEC_ENTITIES',
  SET_CURR_READ_SEC_ENTITIES: 'ADD_UPDATE_RULE/SET_CURR_READ_SEC_ENTITIES',

  SET_ADD_NEW_OR_CRITERIA: 'ADD_UPDATE_RULE/SET_ADD_NEW_OR_CRITERIA',
  SET_REMOVE_OR_CRITERIA: 'ADD_UPDATE_RULE/SET_REMOVE_OR_CRITERIA',
  SET_REMOVE_AND_CRITERIA: 'ADD_UPDATE_RULE/SET_REMOVE_AND_CRITERIA',
  SET_ADD_NEW_AND_CRITERIA: 'ADD_UPDATE_RULE/SET_ADD_NEW_AND_CRITERIA',
  SET_UPDATE_CRITERIA: 'ADD_UPDATE_RULE/SET_UPDATE_CRITERIA',

  SET_IS_AUTO_APPROVAL: 'ADD_UPDATE_RULE/SET_IS_AUTO_APPROVAL',

  SET_ADD_RULE_STEP: 'ADD_UPDATE_RULE/SET_ADD_RULE_STEP',
  SET_REMOVE_RULE_STEP: 'ADD_UPDATE_RULE/SET_REMOVE_RULE_STEP',
  SET_UPDATE_STEP_OWNER: 'ADD_UPDATE_RULE/SET_UPDATE_STEP_OWNER',
  SET_UPDATE_STEP_OWNER_ID: 'ADD_UPDATE_RULE/SET_UPDATE_STEP_OWNER_ID',

  SET_ADD_CUSTOM_CASE: 'ADD_UPDATE_RULE/SET_ADD_CUSTOM_CASE',
  SET_REMOVE_CUSTOM_CASE: 'ADD_UPDATE_RULE/SET_REMOVE_CUSTOM_CASE',

  MOVE_CUSTOM_CASE_UP: 'ADD_UPDATE_RULE/MOVE_CUSTOM_CASE_UP',
  MOVE_CUSTOM_CASE_DOWN: 'ADD_UPDATE_RULE/MOVE_CUSTOM_CASE_DOWN',

  SET_ADD_CUSTOM_CASE_CONDITION:
    'ADD_UPDATE_RULE/SET_ADD_CUSTOM_CASE_CONDITION',
  SET_REMOVE_CUSTOM_CASE_CONDITION:
    'ADD_UPDATE_RULE/SET_REMOVE_CUSTOM_CASE_CONDITION',
  SET_UPDATE_CUSTOM_CASE_CONDITION:
    'ADD_UPDATE_RULE/SET_UPDATE_CUSTOM_CASE_CONDITION',

  SET_SAVE_CUSTOM_SECTION: 'ADD_UPDATE_RULE/SET_SAVE_CUSTOM_SECTION',
  SET_SAVE_DEFAULT_SECTION: 'ADD_UPDATE_RULE/SET_SAVE_DEFAULT_SECTION',

  SET_REMOVE_CUSTOM_SECTION: 'ADD_UPDATE_RULE/SET_REMOVE_CUSTOM_SECTION',

  MOVE_CUSTOM_SECTION_UP: 'ADD_UPDATE_RULE/MOVE_CUSTOM_SECTION_UP',

  MOVE_CUSTOM_SECTION_DOWN: 'ADD_UPDATE_RULE/MOVE_CUSTOM_SECTION_DOWN',

  SET_CURRENT_EDITING_SECTION_INDEX:
    'ADD_UPDATE_RULE/SET_CURRENT_EDITING_SECTION_INDEX',

  CLEAN_RULE_CONFIG_BEFORE_ADD_UPDATE:
    'ADD_UPDATE_RULE/CLEAN_RULE_CONFIG_BEFORE_ADD_UPDATE',

  HANDLE_ENTITY_HEAD_VALUES_FOR_UPDATE:
    'ADD_UPDATE_RULE/HANDLE_ENTITY_HEAD_VALUES_FOR_UPDATE',

  SET_COST_CENTRES: 'ADD_UPDATE_RULE/SET_COST_CENTRES',
};

export const resetAddUpdateRuleState = () => ({
  type: ADD_UPDATE_RULE_ACTION_TYPES.RESET_ADD_UPDATE_RULE_STATE,
});

export const setAddUpdateRuleAction = (payload: any) => ({
  type: ADD_UPDATE_RULE_ACTION_TYPES.SET_ADD_UPDATE_RULE_ACTION,
  payload,
});

export const setProcessTypes = (payload: any) => ({
  type: ADD_UPDATE_RULE_ACTION_TYPES.SET_PROCESS_TYPES,
  payload,
});

export const setSelectedProcessType = (payload: any) => ({
  type: ADD_UPDATE_RULE_ACTION_TYPES.SET_SELECTED_PROCESS_TYPE,
  payload,
});

export const setRuleTitle = (payload: string) => ({
  type: ADD_UPDATE_RULE_ACTION_TYPES.SET_RULE_TITLE,
  payload,
});

export const setTypeObjects = (payload: any) => ({
  type: ADD_UPDATE_RULE_ACTION_TYPES.SET_TYPE_OBJECTS,
  payload,
});

export const setTypeObjectsStatus = (payload: any) => ({
  type: ADD_UPDATE_RULE_ACTION_TYPES.SET_TYPE_OBJECTS_STATUS,
  payload,
});

export const setSelectedTypeObject = (payload: any) => ({
  type: ADD_UPDATE_RULE_ACTION_TYPES.SET_SELECTED_TYPE_OBJECT,
  payload,
});

export const setOptions = (payload: any) => ({
  type: ADD_UPDATE_RULE_ACTION_TYPES.SET_OPTIONS,
  payload,
});

export const setOperators = (payload: any) => ({
  type: ADD_UPDATE_RULE_ACTION_TYPES.SET_OPERATORS,
  payload,
});

export const setAllowedStepOwners = (payload: any) => ({
  type: ADD_UPDATE_RULE_ACTION_TYPES.SET_ALLOWED_STEP_OWNERS,
  payload,
});

export const setAllowedFallbackStepOwners = (payload: any) => ({
  type: ADD_UPDATE_RULE_ACTION_TYPES.SET_ALLOWED_FALLBACK_STEP_OWNERS,
  payload,
});

export const setGenders = (payload: any) => ({
  type: ADD_UPDATE_RULE_ACTION_TYPES.SET_GENDERS,
  payload,
});

export const setMaritalStatuses = (payload: any) => ({
  type: ADD_UPDATE_RULE_ACTION_TYPES.SET_MARITAL_STATUS,
  payload,
});

export const setContractTypes = (payload: any) => ({
  type: ADD_UPDATE_RULE_ACTION_TYPES.SET_CONTRACT_TYPES,
  payload,
});

export const setRefObjEmpGroups = (payload: any) => ({
  type: ADD_UPDATE_RULE_ACTION_TYPES.SET_REF_OBJ_EMP_GROUPS,
  payload,
});

export const setEmpSubGroups = (payload: any) => ({
  type: ADD_UPDATE_RULE_ACTION_TYPES.SET_EMP_SUB_GROUPS,
  payload,
});

export const setEmpGroups = (payload: any) => ({
  type: ADD_UPDATE_RULE_ACTION_TYPES.SET_EMP_GROUPS,
  payload,
});

export const setApproversCustomFields = (payload: any) => ({
  type: ADD_UPDATE_RULE_ACTION_TYPES.SET_APPROVERS_CUSTOM_FIELDS,
  payload,
});

export const setPayGrades = (payload: any) => ({
  type: ADD_UPDATE_RULE_ACTION_TYPES.SET_PAY_GRADES,
  payload,
});

export const setEmployeeIds = (payload: any) => ({
  type: ADD_UPDATE_RULE_ACTION_TYPES.SET_EMPLOYEE_IDS,
  payload,
});

export const setUsers = (payload: any) => ({
  type: ADD_UPDATE_RULE_ACTION_TYPES.SET_USERS,
  payload,
});

export const setLegalEntities = (payload: any) => ({
  type: ADD_UPDATE_RULE_ACTION_TYPES.SET_LEGAL_ENTITIES,
  payload,
});

export const initRuleConfig = () => ({
  type: ADD_UPDATE_RULE_ACTION_TYPES.INIT_RULE_CONFIG,
});

export const setRuleConfig = (payload: any) => ({
  type: ADD_UPDATE_RULE_ACTION_TYPES.SET_RULE_CONFIG,
  payload,
});

export const initReadableRuleConfig = () => ({
  type: ADD_UPDATE_RULE_ACTION_TYPES.INIT_READABLE_RULE_CONFIG,
});

export const setReadableRuleConfig = (payload: any) => ({
  type: ADD_UPDATE_RULE_ACTION_TYPES.SET_READABLE_RULE_CONFIG,
  payload,
});

export const initCurrentSectionData = (payload: string) => ({
  type: ADD_UPDATE_RULE_ACTION_TYPES.INIT_CURRENT_SECTION_DATA,
  payload,
});

export const populateCurrentSectionData = (payload: number) => ({
  type: ADD_UPDATE_RULE_ACTION_TYPES.POPULATE_CURRENT_SECTION_DATA,
  payload,
});

export const populateDefaultSectionData = () => ({
  type: ADD_UPDATE_RULE_ACTION_TYPES.POPULATE_DEFAULT_SECTION_DATA,
});

export const setDrawerTitle = (payload: any) => ({
  type: ADD_UPDATE_RULE_ACTION_TYPES.SET_DRAWER_TITLE,
  payload,
});

export const setDrawerFor = (payload: any) => ({
  type: ADD_UPDATE_RULE_ACTION_TYPES.SET_DRAWER_FOR,
  payload,
});

export const setDrawerAction = (payload: any) => ({
  type: ADD_UPDATE_RULE_ACTION_TYPES.SET_DRAWER_ACTION,
  payload,
});

export const setCurrSecEntities = (payload: any) => ({
  type: ADD_UPDATE_RULE_ACTION_TYPES.SET_CURR_SEC_ENTITIES,
  payload,
});

export const setCurrReadSecEntities = (payload: any) => ({
  type: ADD_UPDATE_RULE_ACTION_TYPES.SET_CURR_READ_SEC_ENTITIES,
  payload,
});

export const addNewOrCriteria = () => ({
  type: ADD_UPDATE_RULE_ACTION_TYPES.SET_ADD_NEW_OR_CRITERIA,
});

export const removeOrCriteria = ({
  toBeRemovedIndex,
}: {
  toBeRemovedIndex: number;
}) => ({
  type: ADD_UPDATE_RULE_ACTION_TYPES.SET_REMOVE_OR_CRITERIA,
  payload: { toBeRemovedIndex },
});

export const removeAndCriteria = ({
  criteriaIndex,
  toBeRemovedIndex,
}: {
  criteriaIndex: number;
  toBeRemovedIndex: number;
}) => ({
  type: ADD_UPDATE_RULE_ACTION_TYPES.SET_REMOVE_AND_CRITERIA,
  payload: { criteriaIndex, toBeRemovedIndex },
});

export const addNewAndCriteria = ({
  criteriaIndex,
}: {
  criteriaIndex: number;
}) => ({
  type: ADD_UPDATE_RULE_ACTION_TYPES.SET_ADD_NEW_AND_CRITERIA,
  payload: { criteriaIndex },
});

export const updateCriteria = ({
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
}) => ({
  type: ADD_UPDATE_RULE_ACTION_TYPES.SET_UPDATE_CRITERIA,
  payload: {
    criteriaIndex,
    conditionIndex,
    updateType,
    updateValue,
    isNumberType,
    readableValue,
  },
});

export const setIsAutoApproval = ({
  isCheck,
  caseType,
  caseIndex,
}: {
  isCheck: boolean;
  caseType: 'CUSTOM' | 'DEFAULT';
  caseIndex: number | null;
}) => ({
  type: ADD_UPDATE_RULE_ACTION_TYPES.SET_IS_AUTO_APPROVAL,
  payload: { isCheck, caseType, caseIndex },
});

export const addRuleStep = ({
  caseType,
  caseIndex,
}: {
  caseType: string;
  caseIndex: number;
}) => ({
  type: ADD_UPDATE_RULE_ACTION_TYPES.SET_ADD_RULE_STEP,
  payload: { caseType, caseIndex },
});

export const removeRuleStep = ({
  caseType,
  caseIndex,
  toBeRemovedIndex,
}: {
  caseType: 'CUSTOM' | 'DEFAULT';
  caseIndex: number;
  toBeRemovedIndex: number;
}) => ({
  type: ADD_UPDATE_RULE_ACTION_TYPES.SET_REMOVE_RULE_STEP,
  payload: { caseType, caseIndex, toBeRemovedIndex },
});

export const updateStepOwner = ({
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
}) => ({
  type: ADD_UPDATE_RULE_ACTION_TYPES.SET_UPDATE_STEP_OWNER,
  payload: { caseType, caseIndex, stepIndex, updateValue, isFallbackStepType },
});

export const updateStepOwnerId = ({
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
}) => ({
  type: ADD_UPDATE_RULE_ACTION_TYPES.SET_UPDATE_STEP_OWNER_ID,
  payload: {
    caseType,
    caseIndex,
    stepIndex,
    updateValue,
    readableValue,
    isFallbackStepType,
  },
});

export const addCustomCase = () => ({
  type: ADD_UPDATE_RULE_ACTION_TYPES.SET_ADD_CUSTOM_CASE,
});

export const addCustomCaseCondition = ({
  caseIndex,
}: {
  caseIndex: number;
}) => ({
  type: ADD_UPDATE_RULE_ACTION_TYPES.SET_ADD_CUSTOM_CASE_CONDITION,
  payload: { caseIndex },
});

export const removeCustomCase = ({
  toBeRemovedIndex,
}: {
  toBeRemovedIndex: number;
}) => ({
  type: ADD_UPDATE_RULE_ACTION_TYPES.SET_REMOVE_CUSTOM_CASE,
  payload: { toBeRemovedIndex },
});

export const removeCustomCaseCondition = ({
  caseIndex,
  toBeRemovedIndex,
}: {
  caseIndex: number;
  toBeRemovedIndex: number;
}) => ({
  type: ADD_UPDATE_RULE_ACTION_TYPES.SET_REMOVE_CUSTOM_CASE_CONDITION,
  payload: { caseIndex, toBeRemovedIndex },
});

export const updateCustomCaseCondition = ({
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
}) => ({
  type: ADD_UPDATE_RULE_ACTION_TYPES.SET_UPDATE_CUSTOM_CASE_CONDITION,
  payload: {
    caseIndex,
    conditionIndex,
    updateType,
    updateValue,
    isNumberType,
    updateDisplayValue,
  },
});

export const saveCustomSection = () => ({
  type: ADD_UPDATE_RULE_ACTION_TYPES.SET_SAVE_CUSTOM_SECTION,
});

export const removeCustomSection = ({
  toBeRemovedIndex,
}: {
  toBeRemovedIndex: number;
}) => ({
  type: ADD_UPDATE_RULE_ACTION_TYPES.SET_REMOVE_CUSTOM_SECTION,
  payload: { toBeRemovedIndex },
});

export const saveDefaultSection = () => ({
  type: ADD_UPDATE_RULE_ACTION_TYPES.SET_SAVE_DEFAULT_SECTION,
});

export const setCurrentEditingSectionIndex = (payload: number | null) => ({
  type: ADD_UPDATE_RULE_ACTION_TYPES.SET_CURRENT_EDITING_SECTION_INDEX,
  payload,
});

export const cleanRuleConfigBeforeAddUpdate = () => ({
  type: ADD_UPDATE_RULE_ACTION_TYPES.CLEAN_RULE_CONFIG_BEFORE_ADD_UPDATE,
});

export const handleEntityHeadValuesForUpdate = () => ({
  type: ADD_UPDATE_RULE_ACTION_TYPES.HANDLE_ENTITY_HEAD_VALUES_FOR_UPDATE,
});

export const moveCustomSectionUp = (index: number) => ({
  type: ADD_UPDATE_RULE_ACTION_TYPES.MOVE_CUSTOM_SECTION_UP,
  payload: index,
});

export const moveCustomSectionDown = (index: number) => ({
  type: ADD_UPDATE_RULE_ACTION_TYPES.MOVE_CUSTOM_SECTION_DOWN,
  payload: index,
});

export const moveCustomCaseUp = (index: number) => ({
  type: ADD_UPDATE_RULE_ACTION_TYPES.MOVE_CUSTOM_CASE_UP,
  payload: index,
});

export const moveCustomCaseDown = (index: number) => ({
  type: ADD_UPDATE_RULE_ACTION_TYPES.MOVE_CUSTOM_CASE_DOWN,
  payload: index,
});

export const setCostCentres = (payload: any) => ({
  type: ADD_UPDATE_RULE_ACTION_TYPES.SET_COST_CENTRES,
  payload,
});
