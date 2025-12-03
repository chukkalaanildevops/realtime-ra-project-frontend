import * as Actions from './employeeGroupsListing.action';
import * as Models from './employeeGroupsListing.model';

export const initialState: Models.IemployeeGroupReducerInitialState = {
  employee_group_list: [
    {
      created_by: {
        id: 0,
        name: 'string',
        legal_name: 'string',
        email: 'user@example.com',
        username: 'string',
      },
      created_on: '2020-05-29T06:13:26Z',
      modified_by: {
        id: 0,
        name: 'string',
        legal_name: 'string',
        email: 'user@example.com',
        username: 'string',
      },
      modified_on: '2020-05-29T06:13:26Z',
      deleted_by: {
        id: 0,
        name: 'string',
        legal_name: 'string',
        email: 'user@example.com',
        username: 'string',
      },
      deleted_on: '2020-05-29T06:13:26Z',
      is_deleted: true,
      id: 231456,
      title: 'string',
      criteria: {
        code: 'ALL',
        title: 'All Employees',
      },
      selected_users: [
        {
          id: 0,
          name: 'string',
          legal_name: 'string',
          email: 'user@example.com',
          username: 'string',
        },
      ],
      is_criteria_based: true,
      custom_config: {},
    },
    {
      created_by: {
        id: 0,
        name: 'string',
        legal_name: 'string',
        email: 'user@example.com',
        username: 'string',
      },
      created_on: '2020-05-29T06:13:26Z',
      modified_by: {
        id: 0,
        name: 'string',
        legal_name: 'string',
        email: 'user@example.com',
        username: 'string',
      },
      modified_on: '2020-05-29T06:13:26Z',
      deleted_by: {
        id: 0,
        name: 'string',
        legal_name: 'string',
        email: 'user@example.com',
        username: 'string',
      },
      deleted_on: '2020-05-29T06:13:26Z',
      is_deleted: true,
      id: 1231542,
      title: 'string',
      criteria: {
        code: 'ALL',
        title: 'All Employees',
      },
      selected_users: [
        {
          id: 0,
          name: 'string',
          legal_name: 'string',
          email: 'user@example.com',
          username: 'string',
        },
      ],
      is_criteria_based: true,
      custom_config: {},
    },
    {
      created_by: {
        id: 0,
        name: 'string',
        legal_name: 'string',
        email: 'user@example.com',
        username: 'string',
      },
      created_on: '2020-05-29T06:13:26Z',
      modified_by: {
        id: 0,
        name: 'string',
        legal_name: 'string',
        email: 'user@example.com',
        username: 'string',
      },
      modified_on: '2020-05-29T06:13:26Z',
      deleted_by: {
        id: 0,
        name: 'string',
        legal_name: 'string',
        email: 'user@example.com',
        username: 'string',
      },
      deleted_on: '2020-05-29T06:13:26Z',
      is_deleted: true,
      id: 54325412,
      title: 'string',
      criteria: {
        code: 'ALL',
        title: 'All Employees',
      },
      selected_users: [
        {
          id: 0,
          name: 'string',
          legal_name: 'string',
          email: 'user@example.com',
          username: 'string',
        },
      ],
      is_criteria_based: true,
      custom_config: {},
    },
    {
      created_by: {
        id: 0,
        name: 'string',
        legal_name: 'string',
        email: 'user@example.com',
        username: 'string',
      },
      created_on: '2020-05-29T06:13:26Z',
      modified_by: {
        id: 0,
        name: 'string',
        legal_name: 'string',
        email: 'user@example.com',
        username: 'string',
      },
      modified_on: '2020-05-29T06:13:26Z',
      deleted_by: {
        id: 0,
        name: 'string',
        legal_name: 'string',
        email: 'user@example.com',
        username: 'string',
      },
      deleted_on: '2020-05-29T06:13:26Z',
      is_deleted: true,
      id: 1835741524,
      title: 'string',
      criteria: {
        code: 'ALL',
        title: 'All Employees',
      },
      selected_users: [
        {
          id: 0,
          name: 'string',
          legal_name: 'string',
          email: 'user@example.com',
          username: 'string',
        },
      ],
      is_criteria_based: true,
      custom_config: {},
    },
  ],
  employee_group_selected: null,
  employee_group_list_loader: false,
  employee_list: [],
  pagination_data: {
    total_records: 0,
    number_of_pages: 0,
  },
  employe_list_loader: false,
  error: '',
  backend_error: {},
  info: '',
  success: '',
  isLoading: false,
};

const EmployeeGroupsListingReducer: Models.TEmployeeGroupsListingReducer = (
  state = initialState,
  { type, payload },
) => {
  switch (type) {
    case Actions.API_CALL_REQUEST:
    case Actions.API_CALL_SUCCESS:
    case Actions.API_CALL_FAIL:
    case Actions.API_CALL_RESET:
      return {
        ...state,
        ...payload,
      };
    case Actions.UPDATE_EMPLOYEE_GROUP_LIST:
      return {
        ...state,
        employee_group_list: payload,
      };
    case Actions.UPDATE_EMPLOYEE_GROUP_LIST_LOADER:
      return {
        ...state,
        employee_group_list_loader: payload,
      };
    case Actions.UPDATE_EMPLOYEE_GROUP_SELECTED:
      return {
        ...state,
        employee_group_selected: payload,
      };
    case Actions.SAVE_EMPLOYEE_GROUP_SELECTED_EMPLOYEE:
      return {
        ...state,
        employee_list: payload,
      };
    case Actions.UPDATE_EMPLOYEE_GROUP_SELECTED_EMPLOYEE_LIST_LOADER:
      return {
        ...state,
        employe_list_loader: payload,
      };
    case Actions.UPDATE_TOTAL_EMPLOYEE_COUNT:
      return {
        ...state,
        pagination_data: payload,
      };
    case Actions.RESET_TO_INITIAL:
      return initialState;
    default:
      return state;
  }
};

export default EmployeeGroupsListingReducer;
