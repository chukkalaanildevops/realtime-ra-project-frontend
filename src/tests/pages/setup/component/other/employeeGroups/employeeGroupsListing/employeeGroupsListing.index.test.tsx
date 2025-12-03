import React from 'react';
import { I18nProvider } from '@lingui/react';
import { i18n } from '@lingui/core';
// import { shallow, ShallowWrapper } from 'enzyme';
// import {
//   mockStore,
//   findByTestAttr,
// } from '../../../../../../../utils/test.utils';
import { BrowserRouter as Router } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import EmployeeGroups from '../../../../../../../pages/setup/component/other/employeeGroups/employeeGroupsListing/employeeGroupsListing.index';
import EmployeeGroupsListingReducer, {
  initialState as employeeGroupsListingState,
} from '../../../../../../../pages/setup/component/other/employeeGroups/employeeGroupsListing/employeeGroupsListing.reducer';
import { initialState as authState } from '../../../../../../../shared/redux/auth/auth.reducer';
import {
  IemployeeGroupReducerInitialState,
  TemployeeGroupList,
  TemployeeGroupSelected,
  Iemployee,
} from '../../../../../../../pages/setup/component/other/employeeGroups/employeeGroupsListing/employeeGroupsListing.model';
import * as Actions from '../../../../../../../pages/setup/component/other/employeeGroups/employeeGroupsListing/employeeGroupsListing.action';
/**
 * This function returns shallow rendered component
 * @function setUp
 * @param props {object}
 * @returns {ShallowWrapper}
 */

const mockStore = configureStore();

const initialState: any = {
  employeeGroupsListing: { ...employeeGroupsListingState },
  auth: { ...authState },
};

const setUp = (state: any = initialState): any => {
  const store = mockStore({
    employeeGroupsListing: {
      ...initialState.employeeGroupsListing,
      ...state.employeeGroupsListing,
    },
    auth: {
      ...initialState.auth,
      ...state.auth,
    },
  });
  const wrapper = render(
    <I18nProvider i18n={i18n}>
      <Router>
        <Provider store={store}>
          <EmployeeGroups />
        </Provider>
      </Router>
    </I18nProvider>,
  );
  return wrapper;
};

describe('<EmployeeGroups />', () => {
  let wrapper: any = setUp();
  // describe('Component', () => {
  // describe('InitialState', () => {
  //   wrapper = setUp();
  //   // test('Renders Without Error', () => {
  //   //   expect(screen.getByTestId('employeeGroupsWrapper')).toBeInTheDocument();
  //   // });

  //   test('Rendered component check', () => {
  //     expect(screen.getByTestId('employeeGroupsWrapper')).toBeInTheDocument();
  //     const filterBarProps = screen.getByTestId(
  //       'filterBar',
  //     ).props() as any;
  //     expect(filterBarProps.isAddButton).toBeTruthy();
  //     expect(filterBarProps.enableBackBtn).toBeTruthy();
  //     expect(filterBarProps.uploadButtonHandler).toBeFalsy();
  //     expect(filterBarProps.isLoading).toBe(
  //       initialState.employee_group_list_loader,
  //     );
  //     expect(screen.getByTestId'expenseTypeListingTable')).toBeInTheDocument()
  //     expect(screen.getByTestId('appDrawer')).toBeInTheDocument();
  //   });
  // });
  // });
  describe('ACTIONS', () => {
    test('apiCallReqiest', () => {
      expect(Actions.apiCallRequest()).toEqual({
        type: Actions.API_CALL_REQUEST,
        payload: {
          error: '',
          success: '',
          info: 'Loading Data...',
          isLoading: true,
        },
      });
    });
    test('apiCallSuccess', () => {
      expect(Actions.apiCallSuccess()).toEqual({
        type: Actions.API_CALL_SUCCESS,
        payload: {
          error: '',
          success: '',
          info: '',
          isLoading: false,
        },
      });
    });
    test('apiCallFail', () => {
      expect(Actions.apiCallFail()).toEqual({
        type: Actions.API_CALL_FAIL,
        payload: {
          error: 'Failed to load data.',
          success: '',
          info: '',
          isLoading: false,
        },
      });
    });
    test('apiCallReset', () => {
      expect(Actions.apiCallReset()).toEqual({
        type: Actions.API_CALL_RESET,
        payload: {
          error: '',
          success: '',
          info: '',
          isLoading: false,
        },
      });
    });
    test('resetToInitial', () => {
      expect(Actions.resetToInitial()).toEqual({
        type: Actions.RESET_TO_INITIAL,
      });
    });
    test('saveEmployeeGroupList', () => {
      expect(Actions.saveEmployeeGroupList(employeeGroupList)).toEqual({
        type: Actions.UPDATE_EMPLOYEE_GROUP_LIST,
        payload: employeeGroupList,
      });
    });
    test('saveEmployeeGroupList', () => {
      expect(Actions.saveEmployeeGroupList(employeeGroupList)).toEqual({
        type: Actions.UPDATE_EMPLOYEE_GROUP_LIST,
        payload: employeeGroupList,
      });
    });
    test('updateEmployeeGroupListLoaderVisibility', () => {
      const data: boolean = true;
      expect(Actions.updateEmployeeGroupListLoaderVisibility(data)).toEqual({
        type: Actions.UPDATE_EMPLOYEE_GROUP_LIST_LOADER,
        payload: data,
      });
    });
    test('updateEmployeeGroupSelected', () => {
      const data: TemployeeGroupSelected = employeeGroupList[0];
      expect(Actions.updateEmployeeGroupSelected(data)).toEqual({
        type: Actions.UPDATE_EMPLOYEE_GROUP_SELECTED,
        payload: data,
      });
    });
    test('saveEmployeeGroupSelectedEmployee', () => {
      const data: Iemployee[] = [
        {
          id: 1,
          name: 'john',
          legal_name: 'john',
          email: 'john@wohn.com',
          username: 'john wohn',
        },
      ];
      expect(Actions.saveEmployeeGroupSelectedEmployee(data)).toEqual({
        type: Actions.SAVE_EMPLOYEE_GROUP_SELECTED_EMPLOYEE,
        payload: data,
      });
    });
    test('updateEmployeeGroupSelectedEmployeeListLoader', () => {
      const data: boolean = false;
      expect(
        Actions.updateEmployeeGroupSelectedEmployeeListLoader(data),
      ).toEqual({
        type: Actions.UPDATE_EMPLOYEE_GROUP_SELECTED_EMPLOYEE_LIST_LOADER,
        payload: data,
      });
    });
    // end Actions
  });
  describe('REDUCER', () => {
    // test('Initial State', () => {
    //   expect(
    //     EmployeeGroupsListingReducer(undefined as any, { type: 'NO_ACTION' }),
    //   ).toEqual(initialState);
    // });
    test('Actions.UPDATE_EMPLOYEE_GROUP_LIST', () => {
      expect(
        EmployeeGroupsListingReducer(initialState, {
          type: Actions.UPDATE_EMPLOYEE_GROUP_LIST,
          payload: employeeGroupList,
        }),
      ).toEqual({ ...initialState, employee_group_list: employeeGroupList });
    });
    test('Actions.UPDATE_EMPLOYEE_GROUP_LIST_LOADER', () => {
      expect(
        EmployeeGroupsListingReducer(initialState, {
          type: Actions.UPDATE_EMPLOYEE_GROUP_LIST_LOADER,
          payload: true,
        }),
      ).toEqual({ ...initialState, employee_group_list_loader: true });
    });
    test('Actions.UPDATE_EMPLOYEE_GROUP_SELECTED', () => {
      expect(
        EmployeeGroupsListingReducer(initialState, {
          type: Actions.UPDATE_EMPLOYEE_GROUP_SELECTED,
          payload: employeeGroupList[0],
        }),
      ).toEqual({
        ...initialState,
        employee_group_selected: employeeGroupList[0],
      });
    });
    test('Actions.SAVE_EMPLOYEE_GROUP_SELECTED_EMPLOYEE', () => {
      const employeeList = [
        {
          id: 1,
          name: 'Don',
          email: 'Don@gon.com',
          username: 'Don Gon',
        },
      ];
      expect(
        EmployeeGroupsListingReducer(initialState, {
          type: Actions.SAVE_EMPLOYEE_GROUP_SELECTED_EMPLOYEE,
          payload: employeeList,
        }),
      ).toEqual({
        ...initialState,
        employee_list: employeeList,
      });
    });
    test('Actions.UPDATE_EMPLOYEE_GROUP_SELECTED_EMPLOYEE_LIST_LOADER', () => {
      expect(
        EmployeeGroupsListingReducer(initialState, {
          type: Actions.UPDATE_EMPLOYEE_GROUP_SELECTED_EMPLOYEE_LIST_LOADER,
          payload: true,
        }),
      ).toEqual({
        ...initialState,
        employe_list_loader: true,
      });
    });
    // test('Actions.RESET_TO_INITIAL', () => {
    //   expect(
    //     EmployeeGroupsListingReducer(initialState, {
    //       type: Actions.RESET_TO_INITIAL,
    //     }),
    //   ).toEqual({
    //     ...initialState,
    //   });
    // });
  });
});

const employeeGroupList: TemployeeGroupList = [
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
    id: 0,
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
    id: 0,
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
    id: 0,
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
    id: 0,
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
];
