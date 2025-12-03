import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { initialState as profileState } from '../../../pages/userProfile/userProfile.reducer';
import { initialState as authState } from '../../../shared/redux/auth/auth.reducer';
import { initialState as labelCustomisationState } from '../../../pages/systemLabelsCustomisation/systemLabelsCustomisation.reducer';
import { initialState as dashboardState } from '../../../pages/dashboard/dashboard.reducer';
import { InitialState as searchBarState } from '../../../shared/components/searchBar/searchBar.reducer';
import { initialState as configState } from '../../../pages/configurations/configurations.reducer';
import { Provider } from 'react-redux';
import { I18nProvider } from '@lingui/react';
import { i18n } from '@lingui/core';
import UserProfile from '../../../pages/userProfile/userProfile.index';
// import { mockStore } from '../../../utils/test.utils';
import configureStore from 'redux-mock-store';
import { render } from '@testing-library/react';
// import { shallow } from 'enzyme';

const mockStore = configureStore();

const initialState: any = {
  userProfile: { ...profileState },
  auth: { ...authState },
  labelsCustomisation: { ...labelCustomisationState },
  dashboard: { ...dashboardState },
  searchBar: { ...searchBarState },
  configuration: { ...configState },
};

const setUp = (props = initialState.userProfile) => {
  const preProps = {
    ...initialState,
    userProfile: { ...initialState.userProfile, ...props },
  };
  const store = mockStore(preProps);

  return render(
    <I18nProvider i18n={i18n}>
      <Router>
        <Provider store={store}>
          <UserProfile />
        </Provider>
      </Router>
    </I18nProvider>,
  );
};

describe('<UserProfile />', () => {
  test('Render component correctly', () => {
    const wrapper = setUp();
    expect(wrapper).toBeTruthy();
  });
});
