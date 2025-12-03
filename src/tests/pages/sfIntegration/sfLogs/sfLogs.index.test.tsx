import React from 'react';
import { Provider } from 'react-redux';
import { initialState as sfLogsState } from '../../../../pages/sfIntegration/sfLogs/sfLogs.reducer';
import LOGS from '../../../../pages/sfIntegration/sfLogs/sfLogs.index';
import configureStore from 'redux-mock-store';
import { render } from '@testing-library/react';
import { I18nProvider } from '@lingui/react';
import { i18n } from '@lingui/core';

const mockStore = configureStore();

const initialState = {
  sfLogsReducer: { ...sfLogsState },
};

const setUp = (props: any = initialState) => {
  const preProps = {
    ...initialState,
    sfLogsReducer: {
      ...initialState.sfLogsReducer,
      ...props.sfLogsReducer,
    },
  };

  const store = mockStore(preProps);

  const wrapper = render(
    <I18nProvider i18n={i18n}>
      <Provider store={store}>
        <LOGS />
      </Provider>
    </I18nProvider>,
  );

  return wrapper;
};

describe('Testing sfLogs Component', () => {
  let wrapper: any;

  test('should render initial layout', () => {
    wrapper = setUp();
    expect(wrapper).toMatchSnapshot();
  });
});
