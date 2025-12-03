import {
  OBJECT_REFERENCE_TYPES,
  // removePaginationData,
} from './referenceObject.actions';
import { IObjectReferenceState } from './referenceObject.model';

export const initialState: IObjectReferenceState = {
  loader: false,
  objectReference: [
    {
      created_by: {
        id: 1,
        name: 'Tony Chan',
        legal_name: 'Tony Chan',
        email: 'tonychan@mailinator.com',
        username: 'tonychan@mailinator.com',
      },
      created_on: '26/05/2020T10:56:37.615076Z',
      modified_by: {
        id: 3,
        name: 'Aaron Apple',
        legal_name: 'Tony Chan',
        email: 'aaron_apple@gmail.com',
        username: 'aaron_apple@gmail.com',
      },
      modified_on: '11/06/2020T11:30:13.327864Z',
      deleted_by: null,
      deleted_on: null,
      is_deleted: false,
      id: 25,
      title: 'ADTestPUT',
      code: null,
      source_reference_model: null,
      items: [
        {
          id: 48,
          reference_object: 'ADTestPUT',
          title: 'ADTest1',
          is_deleted: false,
        },
        {
          id: 49,
          reference_object: 'ADTestPUT',
          title: 'ADTest2',
          is_deleted: false,
        },
      ],
    },
    {
      created_by: {
        id: 1,
        name: 'Tony Chan',
        legal_name: 'Tony Chan',
        email: 'tonychan@mailinator.com',
        username: 'tonychan@mailinator.com',
      },
      created_on: '22/04/2020T19:55:13.854944Z',
      modified_by: {
        id: 1,
        name: 'Tony Chan',
        legal_name: 'Tony Chan',
        email: 'tonychan@mailinator.com',
        username: 'tonychan@mailinator.com',
      },
      modified_on: '22/04/2020T19:55:13.856611Z',
      deleted_by: null,
      deleted_on: null,
      is_deleted: false,
      id: 7,
      title: 'CT',
      code: null,
      source_reference_model: null,
      items: [
        {
          id: 16,
          reference_object: 'CT',
          title: 'ds',
          is_deleted: false,
        },
      ],
    },
    {
      created_by: {
        id: 1,
        name: 'Tony Chan',
        legal_name: 'Tony Chan',
        email: 'tonychan@mailinator.com',
        username: 'tonychan@mailinator.com',
      },
      created_on: '06/04/2020T17:41:08.783701Z',
      modified_by: {
        id: 1,
        name: 'Tony Chan',
        legal_name: 'Tony Chan',
        email: 'tonychan@mailinator.com',
        username: 'tonychan@mailinator.com',
      },
      modified_on: '06/04/2020T17:41:08.783701Z',
      deleted_by: null,
      deleted_on: null,
      is_deleted: false,
      id: 6,
      title: 'Contract Type',
      code: 'Contract Type',
      source_reference_model: null,
      items: [
        {
          id: 15,
          reference_object: 'Contract Type',
          title: 'dsdfdds',
          is_deleted: false,
        },
        {
          id: 66,
          reference_object: 'Contract Type',
          title: 'full time',
          is_deleted: false,
        },
      ],
    },
    {
      created_by: {
        id: 1,
        name: 'Tony Chan',
        legal_name: 'Tony Chan',
        email: 'tonychan@mailinator.com',
        username: 'tonychan@mailinator.com',
      },
      created_on: '22/04/2020T20:00:49.148255Z',
      modified_by: {
        id: 1,
        name: 'Tony Chan',
        legal_name: 'Tony Chan',
        email: 'tonychan@mailinator.com',
        username: 'tonychan@mailinator.com',
      },
      modified_on: '22/04/2020T20:00:49.150437Z',
      deleted_by: null,
      deleted_on: null,
      is_deleted: false,
      id: 9,
      title: 'Data',
      code: null,
      source_reference_model: null,
      items: [
        {
          id: 18,
          reference_object: 'Data',
          title: 'fsdf',
          is_deleted: false,
        },
      ],
    },
    {
      created_by: {
        id: 1,
        name: 'Tony Chan',
        legal_name: 'Tony Chan',
        email: 'tonychan@mailinator.com',
        username: 'tonychan@mailinator.com',
      },
      created_on: '27/04/2020T10:33:22.151746Z',
      modified_by: {
        id: 1,
        name: 'Tony Chan',
        legal_name: 'Tony Chan',
        email: 'tonychan@mailinator.com',
        username: 'tonychan@mailinator.com',
      },
      modified_on: '27/04/2020T10:33:22.153587Z',
      deleted_by: null,
      deleted_on: null,
      is_deleted: false,
      id: 12,
      title: 'Dental new',
      code: null,
      source_reference_model: null,
      items: [
        {
          id: 22,
          reference_object: 'Dental new',
          title: 'sadd',
          is_deleted: false,
        },
      ],
    },
  ],
  restorePageNo: false,
  restorePageSize: false,
  paginationData: {
    number_of_pages: 0,
    total_records: 0,
    current_page: 0,
  },
  objectReferenceListLoader: false,
  objectReferenceSelected: null,
  objectReferenceSelectedLoader: false,
  // objectReferenceSelectedItems: [],
  formData: {
    title: '',
    code: '',
    items: [],
  },
  itemFile: null,
  listUpdate: {
    add: [],
    remove: [],
  },
  isUpdateMode: false,
  canDeleted: true,
  updateId: null,
  error: '',
  info: '',
  success: '',
  backend_error: {},
  referenceItemList: [],
  referenceObjectList: [],
};

export default (state = initialState, action: any) => {
  const { payload, type, item, canDeleted } = action;
  switch (type) {
    case OBJECT_REFERENCE_TYPES.API_CALL_REQUEST:
    case OBJECT_REFERENCE_TYPES.API_CALL_SUCCESS:
    case OBJECT_REFERENCE_TYPES.API_CALL_FAIL:
    case OBJECT_REFERENCE_TYPES.API_CALL_RESET:
      return {
        ...state,
        ...payload,
      };
    case OBJECT_REFERENCE_TYPES.RESET_TO_INITIAL:
      return {
        ...initialState,
        paginationData: state.paginationData,
        restorePageNo: state.restorePageNo,
        restorePageSize: state.restorePageSize,
      };
    case OBJECT_REFERENCE_TYPES.SAVE_OBJECTS:
      return {
        ...state,
        success: '',
        error: '',
        objectReference: payload,
        // objectReference: removePaginationData(payload),
      };

    case OBJECT_REFERENCE_TYPES.UPDATE_PAGINATION_DATA:
      return {
        ...state,
        paginationData: payload,
      };
    case OBJECT_REFERENCE_TYPES.SET_ERROR:
      return {
        ...state,
        error: payload,
      };
    case OBJECT_REFERENCE_TYPES.SET_SUCCESS:
      return {
        ...state,
        error: '',
        success: payload,
      };
    case OBJECT_REFERENCE_TYPES.SET_LOADING:
      return {
        ...state,
        loader: payload,
      };
    case OBJECT_REFERENCE_TYPES.SET_OBJECT_REFERENCE_SELECTED:
      return {
        ...state,
        objectReferenceSelected: payload,
      };
    case OBJECT_REFERENCE_TYPES.SET_OBJECT_REFERENCE_SELECTED_LOADER:
      return {
        ...state,
        objectReferenceSelectedLoader: payload,
      };
    case OBJECT_REFERENCE_TYPES.SET_FORM_DATA:
      return {
        ...state,
        formData: payload,
        referenceItemList: item?.length > 0 ? item : state.referenceItemList,
        canDeleted: canDeleted === undefined ? state.canDeleted : canDeleted,
      };
    case OBJECT_REFERENCE_TYPES.RESET_FORM_DATA:
      return {
        ...state,
        formData: initialState.formData,
      };
    case OBJECT_REFERENCE_TYPES.SET_LIST_LOADER:
      return {
        ...state,
        objectReferenceListLoader: payload,
      };
    case OBJECT_REFERENCE_TYPES.SET_UPDATE_ID:
      return {
        ...state,
        isUpdateMode: true,
        updateId: payload,
      };
    case OBJECT_REFERENCE_TYPES.SET_LIST_UPDATE:
      return {
        ...state,
        listUpdate: payload,
      };
    case OBJECT_REFERENCE_TYPES.RESET_LIST_UPDATE:
      return {
        ...state,
        listUpdate: {
          add: [],
          remove: [],
        },
      };
    case OBJECT_REFERENCE_TYPES.UPDATE_ITEM_FILE:
      return {
        ...state,
        itemFile: payload,
      };
    case OBJECT_REFERENCE_TYPES.UPDATE_BACKEND_ERRORS:
      return {
        ...state,
        backend_error: payload,
      };
    case OBJECT_REFERENCE_TYPES.SAVE_REFERENCE_OBJECTS:
      return {
        ...state,
        referenceObjectList: payload,
      };
    case OBJECT_REFERENCE_TYPES.UPDATE_RESTORE_PAGE_NO:
      return {
        ...state,
        restorePageNo: payload,
      };
    case OBJECT_REFERENCE_TYPES.UPDATE_RESTORE_PAGE_SIZE:
      return {
        ...state,
        restorePageSize: payload,
      };
    default:
      return state;
  }
};

export const getObjectReferenceRecords = (state: IObjectReferenceState) =>
  state.objectReference;
export const getFtpErrorMessage = (state: IObjectReferenceState) => state.error;

export const getFtpSuccessMessage = (state: IObjectReferenceState) =>
  state.success;
export const getObjectReferenceLoader = (state: IObjectReferenceState) =>
  state.loader;
export const getReferenceItemList = (state: any) => state.referenceItemList;
export const getObjectReferenceList = (state: IObjectReferenceState) =>
  state.referenceObjectList;
