import React from 'react';
// import { mount, ReactWrapper } from 'enzyme';
import AddUpdateRole from '../../../../../../pages/setup/component/other/roles/addUpdateRole/addUpdateRole.index';
// import { mockStore } from '../../../../../../utils/test.utils';
import { BrowserRouter as Router } from 'react-router-dom';
import { render } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { I18nProvider } from '@lingui/react';
import { i18n } from '@lingui/core';
import { initialState as rolesState } from '../../../../../../pages/setup/component/other/roles/roles.reducer';
import { initialState as dashboardState } from '../../../../../../pages/dashboard/dashboard.reducer';
import { InitialState as searchBarState } from '../../../../../../shared/components/searchBar/searchBar.reducer';
import { initialState as authState } from '../../../../../../shared/redux/auth/auth.reducer';
import { initialState as configState } from '../../../../../../pages/configurations/configurations.reducer';

const mockStore = configureStore();

const initialState = {
  roles: { ...rolesState },
  dashboard: { ...dashboardState },
  searchBar: { ...searchBarState },
  auth: { ...authState },
  configuration: { ...configState },
};

const store = mockStore(initialState);

describe('Testing appUpdateRole component', () => {
  let wrapper: any;

  beforeEach(() => {
    wrapper = render(
      <I18nProvider i18n={i18n}>
        <Router>
          <Provider store={store}>
            <AddUpdateRole />
          </Provider>
        </Router>
      </I18nProvider>,
    );
  });

  test('should render initial layout', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
