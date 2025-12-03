import { ActionType } from './wageType.actions';
import { IwageTypeInitialState, TWageTypeReducerFN } from './wageType.model';

export const wageTypeInitialState: IwageTypeInitialState = {
  wageTypeList: [
    {
      created_by: {
        id: 1,
        name: 'Tony Chan',
        legal_name: 'Tony Chan',
        email: 'tonychan@mailinator.com',
        username: 'tonychan@mailinator.com',
      },
      created_on: '17/04/2020T05:50:19.104729Z',
      modified_by: {
        id: 1,
        name: 'Tony Chan',
        legal_name: 'Tony Chan',
        email: 'tonychan@mailinator.com',
        username: 'tonychan@mailinator.com',
      },
      modified_on: '17/04/2020T05:50:19.104764Z',
      deleted_by: null,
      deleted_on: null,
      is_deleted: false,
      id: 1,
      title: 'Hourly Rate',
    },
    {
      created_by: {
        id: 1,
        name: 'Tony Chan',
        legal_name: 'Tony Chan',
        email: 'tonychan@mailinator.com',
        username: 'tonychan@mailinator.com',
      },
      created_on: '17/04/2020T05:51:56.579755Z',
      modified_by: {
        id: 1,
        name: 'Tony Chan',
        legal_name: 'Tony Chan',
        email: 'tonychan@mailinator.com',
        username: 'tonychan@mailinator.com',
      },
      modified_on: '17/04/2020T05:51:56.579799Z',
      deleted_by: null,
      deleted_on: null,
      is_deleted: false,
      id: 2,
      title: 'Incentive Pay',
    },
    {
      created_by: {
        id: 1,
        name: 'Tony Chan',
        legal_name: 'Tony Chan',
        email: 'tonychan@mailinator.com',
        username: 'tonychan@mailinator.com',
      },
      created_on: '17/04/2020T05:52:06.514860Z',
      modified_by: {
        id: 1,
        name: 'Tony Chan',
        legal_name: 'Tony Chan',
        email: 'tonychan@mailinator.com',
        username: 'tonychan@mailinator.com',
      },
      modified_on: '17/04/2020T05:52:06.514909Z',
      deleted_by: null,
      deleted_on: null,
      is_deleted: false,
      id: 3,
      title: 'Inconvenience Pay',
    },
    {
      created_by: {
        id: 1,
        name: 'Tony Chan',
        legal_name: 'Tony Chan',
        email: 'tonychan@mailinator.com',
        username: 'tonychan@mailinator.com',
      },
      created_on: '17/04/2020T05:52:20.164042Z',
      modified_by: {
        id: 1,
        name: 'Tony Chan',
        legal_name: 'Tony Chan',
        email: 'tonychan@mailinator.com',
        username: 'tonychan@mailinator.com',
      },
      modified_on: '17/04/2020T05:52:20.164090Z',
      deleted_by: null,
      deleted_on: null,
      is_deleted: false,
      id: 4,
      title: 'Night Shift Premium Flat Rates for 2nd Shift',
    },
    {
      created_by: {
        id: 1,
        name: 'Tony Chan',
        legal_name: 'Tony Chan',
        email: 'tonychan@mailinator.com',
        username: 'tonychan@mailinator.com',
      },
      created_on: '17/04/2020T05:52:26.037037Z',
      modified_by: {
        id: 1,
        name: 'Tony Chan',
        legal_name: 'Tony Chan',
        email: 'tonychan@mailinator.com',
        username: 'tonychan@mailinator.com',
      },
      modified_on: '17/04/2020T05:52:26.037076Z',
      deleted_by: null,
      deleted_on: null,
      is_deleted: false,
      id: 5,
      title: 'Night Shift Premium Flat Rates for 3rd Shift',
    },
    {
      created_by: {
        id: 1,
        name: 'Tony Chan',
        legal_name: 'Tony Chan',
        email: 'tonychan@mailinator.com',
        username: 'tonychan@mailinator.com',
      },
      created_on: '17/04/2020T05:52:36.850678Z',
      modified_by: {
        id: 1,
        name: 'Tony Chan',
        legal_name: 'Tony Chan',
        email: 'tonychan@mailinator.com',
        username: 'tonychan@mailinator.com',
      },
      modified_on: '17/04/2020T05:52:36.850711Z',
      deleted_by: null,
      deleted_on: null,
      is_deleted: false,
      id: 6,
      title: 'Procedure Pay',
    },
  ],
  pagination_data: { total_records: 0, total_number_of_pages: 0 },
  wageTypeListLoader: false,
  wageTypeListDDCompatible: [],
  wageTypeListDDCompatibleLoader: false,
  selectedWageType: null,
  selectedWageTypeHistory: null,
  selectedWageTypeHistoryLoader: false,
  singleWageTypeLoader: false,
  formData: {
    title: '',
  },
  updateId: null,
  isUpdateMode: false,
  isAddMode: false,
  isLoading: false,
  success: '',
  info: '',
  error: '',
  backend_error: [],
};

const WageTypeReducer: TWageTypeReducerFN = (
  state = wageTypeInitialState,
  { type, payload = {} },
) => {
  switch (type) {
    case ActionType.API_CALL_REQUEST:
    case ActionType.API_CALL_SUCCESS:
    case ActionType.API_CALL_FAIL:
    case ActionType.API_CALL_RESET:
      return {
        ...state,
        ...payload,
      };
    case ActionType.SET_WAGE_TYPE_LIST:
      return {
        ...state,
        wageTypeList: payload,
      };
    case ActionType.SET_WAGE_TYPE_LIST_LOADER:
      return {
        ...state,
        wageTypeListLoader: payload,
      };
    case ActionType.SET_WAGE_TYPE_DD_COMPATIBLE_LIST:
      return {
        ...state,
        wageTypeListDDCompatible: payload,
      };
    case ActionType.SET_WAGE_TYPE_DD_COMPATIBLE_LIST_LOADER:
      return {
        ...state,
        wageTypeListDDCompatibleLoader: payload,
      };
    case ActionType.SET_SELECTED_WAGE_TYPE:
      return {
        ...state,
        selectedWageType: payload,
      };
    case ActionType.SET_FORM_DATA:
      return {
        ...state,
        formData: payload,
      };
    case ActionType.RESET_FORM_DATA:
      return {
        ...state,
        formData: wageTypeInitialState.formData,
      };
    case ActionType.SET_ADD_MODE:
      return {
        ...state,
        isAddMode: payload,
      };
    case ActionType.SET_UPDATE_MODE:
      return {
        ...state,
        isUpdateMode: payload,
      };
    case ActionType.SET_UPDATE_ID:
      return {
        ...state,
        updateId: payload,
      };
    case ActionType.SET_SINGLE_WAGE_TYPE_LOADER:
      return {
        ...state,
        singleWageTypeLoader: payload,
      };
    case ActionType.SET_BACKEND_ERROR:
      return {
        ...state,
        backend_error: payload,
      };
    case ActionType.RESET_BACKEND_ERROR:
      return {
        ...state,
        backend_error: wageTypeInitialState.backend_error,
      };
    case ActionType.SET_SELECTED_WAGE_TYPE_HISTORY:
      return {
        ...state,
        selectedWageTypeHistory: payload,
      };
    case ActionType.SET_SELECTED_WAGE_TYPE_HISTORY_LOADER:
      return {
        ...state,
        selectedWageTypeHistoryLoader: payload,
      };
    case ActionType.SET_PAGINATION_DATA:
      return {
        ...state,
        pagination_data: payload,
      };
    case ActionType.RESET_TO_INITIAL:
      return {
        ...wageTypeInitialState,
      };
    default:
      return state;
  }
};

export default WageTypeReducer;
