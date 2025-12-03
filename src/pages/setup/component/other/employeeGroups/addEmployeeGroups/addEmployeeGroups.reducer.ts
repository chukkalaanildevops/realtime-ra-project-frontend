import * as Actions from './addEmployeeGroups.action';
import * as Models from './addEmployeeGroups.model';

export const initialState: Models.IaddEmployeeGroupReducerInitialState = {
  formData: {
    title: '',
    criteria: 'INDSELU',
    entityType: '',
    relation: 'IN',
    entities: [],
    selectEmployees: [],
    file: null,
  },
  entityArr: [], //API :- http://api.dev.reimburse.asia/api/v1/legal-entities/
  entityTypesArr: [], //API :- http://api.dev.reimburse.asia/api/v1/legal-entity-types/
  entityArrLoader: false,
  entityTypesArrLoader: false,
  isUpdateMode: false,
  updateId: null,
  info: '',
  error: '',
  success: '',
  isLoading: false,
  backend_error: {},
};

const AddEmployeeGroupsReducer: Models.TEmployeeGroupsListingReducer = (
  state = initialState,
  { type, payload = {} },
) => {
  switch (type) {
    case Actions.API_CALL_REQUEST:
    case Actions.API_CALL_SUCCESS:
    case Actions.API_CALL_FAIL:
    case Actions.API_CALL_RESET:
    case Actions.SAVE_EMPLOYEE_GROUP_UPDATE_DATA:
      return {
        ...state,
        ...payload,
      };
    case Actions.UPDATE_FORM_DATA:
      return {
        ...state,
        formData: payload,
      };
    case Actions.UPDATE_ENTITY_ARR:
      return {
        ...state,
        entityArr: payload,
      };
    case Actions.UPDATE_ENTITY_TYPES_ARR:
      return {
        ...state,
        entityTypesArr: payload,
      };
    case Actions.UPDATE_ENTITY_ARR_LOADER:
      return {
        ...state,
        entityArrLoader: payload,
      };
    case Actions.UPDATE_ENTITY_TYPES_ARR_LOADER:
      return {
        ...state,
        entityTypesArrLoader: payload,
      };
    case Actions.UPDATE_BACKEND_ERROR:
      return {
        ...state,
        backend_error: payload,
      };
    case Actions.UPDATE_UPDATE_ID:
      return {
        ...state,
        updateId: payload,
        isUpdateMode: true,
        formData: {
          ...state.formData,
          criteria: '',
        },
      };
    case Actions.SAVE_EMPLOYEE_GROUP_SELECTED_EMPLOYEE:
      return {
        ...state,
        formData: {
          ...state.formData,
          selectEmployees: payload,
          file: null,
        },
      };
    case Actions.RESET_FORM:
      return {
        ...state,
        formData: initialState.formData,
        entityArr: initialState.entityArr,
      };
    case Actions.RESET_TO_INITIAL:
      return initialState;
    default:
      return {
        ...state,
      };
  }
};

export default AddEmployeeGroupsReducer;
