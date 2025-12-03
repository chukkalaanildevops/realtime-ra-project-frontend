import React from 'react';
// import { shallow, ShallowWrapper } from 'enzyme';
// import {
//   mockStore,
//   findByTestAttr,
// } from '../../../../../../../../../utils/test.utils';
import { BrowserRouter as Router } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import EmployeeList from '../../../../../../../../../pages/setup/component/other/employeeGroups/employeeGroupsListing/components/employeeList/employeeList.index';
import { IemployeeGroupReducerInitialState } from '../../../../../../../../../pages/setup/component/other/employeeGroups/employeeGroupsListing/employeeGroupsListing.model';
import { initialState } from '../../../../../../../../../pages/setup/component/other/employeeGroups/employeeGroupsListing/employeeGroupsListing.reducer';
import { I18nProvider } from '@lingui/react';
import { i18n } from '@lingui/core';

/**
 * This function returns shallow rendered component
 * @function setUp
 * @param props {object}
 * @returns wrapper {Object}(DOM)
 */

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

const setUp = (
  state: IemployeeGroupReducerInitialState = initialState,
): any => {
  const store = mockStore({
    employeeGroupsListing: { ...state },
  });
  const wrapper = render(
    <I18nProvider i18n={i18n}>
      <Provider store={store}>
        <EmployeeList />
      </Provider>
      ,
    </I18nProvider>,
  );
  return wrapper;
};

describe('<EmployeeList />', () => {
  test('Render component correctly', () => {
    const wrapper = setUp();
    expect(wrapper).toBeTruthy();
  });
});

// describe('<EmployeeList />', () => {
//   let wrapper = setUp({ ...initialState });
//   describe('COMPONENT', () => {
//     test('renders without error', () => {
//       expect(screen.getByTestId('employeeListContainer')).toBeInTheDocument();
//     });

// describe('visible component count with no employees', () => {
//   test('employe_list_loader=`true`', () => {
//     wrapper = setUp({ ...initialState, employe_list_loader: true });
//     expect(findByTestAttr(wrapper, 'employeeListContainer')).toHaveLength(
//       1,
//     );
//     expect(findByTestAttr(wrapper, 'skeleton')).toHaveLength(10);
//     expect(findByTestAttr(wrapper, 'employeeList')).toHaveLength(0);
//     expect(findByTestAttr(wrapper, 'alertElement')).toHaveLength(0);
//   });

//   test('employe_list_loader=`false`', () => {
//     wrapper = setUp({ ...initialState });
//     expect(findByTestAttr(wrapper, 'employeeListContainer')).toHaveLength(
//       1,
//     );
//     expect(findByTestAttr(wrapper, 'serachInput')).toHaveLength(0);
//     expect(findByTestAttr(wrapper, 'employeeList')).toHaveLength(0);
//     expect(findByTestAttr(wrapper, 'alertElement')).toHaveLength(1);
//     expect(findByTestAttr(wrapper, 'alertElement').props().message).toEqual(
//       `Employee group has ${0} employees`,
//     );
//   });
// });

// test('visible component count with employees', () => {
//   wrapper = setUp({
//     ...initialState,
//     employe_list_loader: false,
//     employee_list: dummyEmployeeList,
//   });
//   expect(findByTestAttr(wrapper, 'employeeListContainer')).toHaveLength(1);
//   expect(findByTestAttr(wrapper, 'serachInput')).toHaveLength(1);
//   expect(findByTestAttr(wrapper, 'employeeList')).toHaveLength(1);
//   expect(
//     findByTestAttr(
//       findByTestAttr(wrapper, 'employeeList')
//         .dive()
//         .dive(),
//       'employeeListItem',
//     ).dive(),
//   ).toHaveLength(dummyEmployeeList.length);
//   expect(findByTestAttr(wrapper, 'alertElement')).toHaveLength(1);
//   expect(findByTestAttr(wrapper, 'alertElement').props().message).toEqual(
//     `Employee group has ${dummyEmployeeList.length} employees`,
//   );
// });
//   });
// });

const dummyEmployeeList: any = [
  {
    id: 1,
    name: 'Tony Chan',
    email: 'tonychan@mailinator.com',
    username: 'tonychan@mailinator.com',
  },
];
