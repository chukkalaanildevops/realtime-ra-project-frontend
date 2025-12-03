import React from 'react';
import RequestTypeConfiguration from '../../../../pages/requestTypeConfiguration/addRequestTypeConfiguration/addRequestTypeConfiguration.index';
// import { mockStore, findByTestAttr } from '../../../../utils/test.utils';
// import { shallow, mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { render } from '@testing-library/react';
import { I18nProvider } from '@lingui/react';
import { i18n } from '@lingui/core';
import { IRequestTypeConfigState } from '../../../../pages/requestTypeConfiguration/requestTypeConfiguration.model';
import { initialState as state } from '../../../../pages/requestTypeConfiguration/requestTypeConfiguration.reducer';

const mockStore = configureStore();

const initialState: { requestConfig: IRequestTypeConfigState } = {
  requestConfig: {
    ...state,
  },
};

const setUp = (props = initialState.requestConfig) => {
  const preProps = {
    ...initialState,
    requestConfig: { ...initialState.requestConfig, ...props },
  };
  const store = mockStore(preProps);
  return render(
    <I18nProvider i18n={i18n}>
      <Router>
        <Provider store={store}>
          <RequestTypeConfiguration />
        </Provider>
      </Router>
    </I18nProvider>,
  );
};

describe('<RequestType />', () => {
  test('Render component correctly', () => {
    const wrapper = setUp();
    expect(wrapper).toBeTruthy();
  });
});
