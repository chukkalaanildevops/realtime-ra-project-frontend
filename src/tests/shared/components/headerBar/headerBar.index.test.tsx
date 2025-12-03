import React from 'react';
// import { shallow } from 'enzyme';
// import { findByTestAttr } from '../../../../utils/test.utils';
import HeaderCommon from '../../../../shared/components/headerBar/headerBar.index';
import configureStore from 'redux-mock-store';
import { render, screen, within } from '@testing-library/react';
import { initialState as dashboardState } from '../../../../pages/dashboard/dashboard.reducer';
import { InitialState as searchBarState } from '../../../../shared/components/searchBar/searchBar.reducer';
import { initialState as authState } from '../../../../shared/redux/auth/auth.reducer';
import { initialState as configState } from '../../../../pages/configurations/configurations.reducer';
import { Provider } from 'react-redux';
/**
 * This function returns shallow rendered component
 * @function setUp
 * @param props {object}
 * @returns wrapper {Object}(DOM)
 */

const mockStore = configureStore();

const setUp = (props: any) => {
  const store = mockStore({
    dashboard: { ...dashboardState },
    searchBar: { ...searchBarState },
    auth: { ...authState },
    configuration: { ...configState },
  });
  const wrapper = render(
    <Provider store={store}>
      <HeaderCommon {...props} />
    </Provider>,
  );
  return wrapper;
};

describe('<HeaderCommon>', () => {
  test('Renders without error', () => {
    const wrapper = setUp({ title: '' });
    const component = screen.getByTestId('header-component');
    expect(component).toBeInTheDocument();
  });

  test('Title equality check', () => {
    const titleText: string = 'Testing Header Component';
    const wrapper = setUp({ title: titleText });
    const { getByText } = within(screen.getByTestId('h1-title'));
    expect(getByText('Testing Header Component')).toBeTruthy();
  });

  test('Render search bar serachBarComp=true', () => {
    const titleText: string = 'Testing Header Component';
    const serachBarComp: boolean = true;
    const wrapper = setUp({ title: titleText, serachBarComp });
    const component = screen.getByTestId('search-container');
    expect(component).toBeInTheDocument();
  });

  // test("Don't render search bar serachBarComp=true", () => {
  //   const titleText: string = 'Testing Header Component';
  //   const serachBarComp: boolean = false;
  //   const wrapper = setUp({ title: titleText, serachBarComp });
  //   const component = screen.getByTestId('search-container');
  //   expect(component).toBeInTheDocument();
  // });

  // test('Render badge container component serachBarComp=true', () => {
  //   const titleText: string = 'Testing Header Component';
  //   const notificationComp: boolean = true;
  //   const wrapper = setUp({ title: titleText, notificationComp });
  //   const component = findByTestAttr(wrapper, 'badge-container');
  //   expect(component).toHaveLength(1);
  // });

  // test("Don't render badge container component serachBarComp=true", () => {
  //   const titleText: string = 'Testing Header Component';
  //   const notificationComp: boolean = false;
  //   const wrapper = setUp({ title: titleText, notificationComp });
  //   const component = findByTestAttr(wrapper, 'badge-container');
  //   expect(component).toHaveLength(0);
  // });
});
