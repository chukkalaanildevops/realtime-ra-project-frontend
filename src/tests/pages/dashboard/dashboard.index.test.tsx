import React from 'react';
// import { mockStore, findByTestAttr } from '../../../utils/test.utils';
// import { shallow, ShallowWrapper } from 'enzyme';
import { BrowserRouter as Router } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { render, fireEvent, screen } from '@testing-library/react';
import Dashboard from '../../../pages/dashboard/dashboard.index';
import { initialState as dashboardState } from '../../../pages/dashboard/dashboard.reducer';
import { initialState as delegateState } from '../../../pages/delegate/delegate.reducer';
import { initialState as authState } from '../../../shared/redux/auth/auth.reducer';
import { initialState as configState } from '../../../pages/configurations/configurations.reducer';
import { InitialState as searchBarState } from '../../../shared/components/searchBar/searchBar.reducer';
import { I18nProvider } from '@lingui/react';
import { i18n } from '@lingui/core';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

const initialState: any = {
  dashboard: { ...dashboardState },
  delegates: { ...delegateState },
  auth: { ...authState },
  configuration: { ...configState },
  searchBar: { ...searchBarState },
};

const setUp = (state: any = initialState) => {
  const store = mockStore(state);
  const wrapper = render(
    <I18nProvider i18n={i18n}>
      <Router>
        {/* <Provider store={store}> */}
        <Dashboard store={store} />
        {/* </Provider> */}
      </Router>
      ,
    </I18nProvider>,
  );
  return wrapper;
};

describe('Testing Dashboard Component', () => {
  let wrapper: any;

  const setBeforeEach = (isDashboardDataLoadFailed: boolean = false): void => {
    const storeVal = {
      ...initialState,
      isDashboardDataLoadFailed: isDashboardDataLoadFailed,
    };
    wrapper = setUp(storeVal);
  };

  // test('should render intial layout', () => {
  //   setBeforeEach();
  //   expect(wrapper.asFragment()).toMatchSnapshot();
  // });

  // test('Navlink path should be matched', () => {
  //   setBeforeEach();
  //   const navLink = wrapper.getByText(/Hi,/i);
  //   fireEvent.click(navLink);
  //   expect(window.location.href).toContain('/profile/');
  // });

  // test('actionable-cards-container should render BrokenLink', () => {
  //   setBeforeEach(true);
  //   expect(screen.getByText(/Try Again/i)).toBeInTheDocument();
  // });

  test('actionable-cards-container should render actionable-cards', () => {
    setBeforeEach();
    //expect(screen.getByTestId('actionable-cards')).toBeInTheDocument();
  });

  // describe('Testing scroll buttons', () => {
  //   setBeforeEach();
  //   const mockCallback = jest.fn();

  //   test('right scroll button should trigger', () => {
  //     const scrollRight = wrapper.getByTestId('scroll-right')
  //     fireEvent.click(scrollRight)
  //     expect(mockCallback).toHaveBeenCalled();
  //   });

  //   test('left scroll button should trigger', () => {
  //     const scrollLeft = wrapper.getByTestId('scroll-left')
  //     fireEvent.click(scrollLeft)
  //     expect(mockCallback).toHaveBeenCalled();
  //   });
  // });
});
