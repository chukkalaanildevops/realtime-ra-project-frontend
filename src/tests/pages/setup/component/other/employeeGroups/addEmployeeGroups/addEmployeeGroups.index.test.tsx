import React from 'react';
// import { shallow, ShallowWrapper } from 'enzyme';
import { Form } from 'antd';
// import {
//   mockStore,
//   findByTestAttr,
// } from '../../../../../../../utils/test.utils';
import { BrowserRouter as Router } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { I18nProvider } from '@lingui/react';
import { i18n } from '@lingui/core';
import ExpenseTypeConfiguration from '../../../../../../../pages/setup/component/other/employeeGroups/addEmployeeGroups/addEmployeeGroups.index';
import { initialState as addEmployeeGroupsState } from '../../../../../../../pages/setup/component/other/employeeGroups/addEmployeeGroups/addEmployeeGroups.reducer';
import { initialState as authState } from '../../../../../../../shared/redux/auth/auth.reducer';
import { initialState as dashboardState } from '../../../../../../../pages/dashboard/dashboard.reducer';
import { InitialState as searchBarState } from '../../../../../../../shared/components/searchBar/searchBar.reducer';
import { initialState as configState } from '../../../../../../../pages/configurations/configurations.reducer';
// import * as Actions from './addEmployeeGroups.action';
// import * as Models from './addEmployeeGroups.model';
/**
 * This function returns shallow rendered component
 * @function setUp
 * @param props {object}
 * @returns {ShallowWrapper}
 */

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

const initialState: any = {
  AddEmployeeGroups: { ...addEmployeeGroupsState },
  auth: { ...authState },
  dashboard: { ...dashboardState },
  searchBar: { ...searchBarState },
  configuration: { ...configState },
};

const setUp = (state: any = {}): any => {
  const store = mockStore({
    ...initialState,
    ...state,
  });
  const wrapper = render(
    <I18nProvider i18n={i18n}>
      <Router>
        <Provider store={store}>
          <ExpenseTypeConfiguration match={{ params: {} }} />
        </Provider>
      </Router>
    </I18nProvider>,
  );
  return wrapper;
};

describe('<ExpenseTypeConfiguration>', () => {
  let wrapper: any = setUp(initialState);
  describe('COMPONENT', () => {
    test('Render without error', () => {
      //  expect(screen.getByTestId('header-component')).toBeInTheDocument();
      expect(wrapper).toBeTruthy();
    });
    // describe('initial state ADD', () => {
    // test('Form.Item count', () => {
    //   expect(wrapper.find(Form.Item)).toHaveLength(3);
    // });
    // test('Element Test', () => {
    //   expect(screen.getByTestId('formTitleInput')).toBeInTheDocument();
    //   expect(screen.getByTestId('formCriteriaSelect')).toBeInTheDocument();
    //   expect(screen.getByTestId('formClearButton')).toBeInTheDocument();
    //   expect(screen.getByTestId('formSubmitButton')).toBeInTheDocument();
    // });
    // });
  });
  describe('REDUCER', () => {});
  describe('ACTIONS', () => {});
});
