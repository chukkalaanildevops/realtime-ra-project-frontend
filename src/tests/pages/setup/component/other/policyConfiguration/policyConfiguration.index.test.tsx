import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { I18nProvider } from '@lingui/react';
import { i18n } from '@lingui/core';
// import { shallow, ShallowWrapper } from 'enzyme';
import { mockStore, findByTestAttr } from '../../../../../../utils/test.utils';
import PolicyConfigurationLists from '../../../../../../pages/setup/component/other/policyConfiguration/policyConfiguration.index';
import PolicyConfigurationReducer, {
  initialState,
} from '../../../../../../pages/setup/component/other/policyConfiguration/policyConfiguration.reducer';
import * as Actions from '../../../../../../pages/setup/component/other/policyConfiguration/policyConfiguration.actions';
import { render, screen } from '@testing-library/react';
import { IPolicyConfiguration } from '../../../../../../pages/setup/component/other/policyConfiguration/policyConfiguration.models';

/**
 * This function returns shallow rendered component
 * @function setUp
 * @param props {object}
 * @returns {ShallowWrapper}
 */

const setUp = (state: {} = initialState) => {
  const store = mockStore({
    WageType: { ...state },
  });
  const wrapper = render(
    <I18nProvider i18n={i18n}>
      <Router>
        <Provider store={store}>
          <PolicyConfigurationLists />
        </Provider>
      </Router>
    </I18nProvider>,
  );
  return wrapper;
};

describe('<PolicyConfigurationIndex />', () => {
  let wrapper: any = setUp();
  test('Renders Without Error', () => {
    expect(wrapper.asFragment()).toBeTruthy();

    // expect(wrapper.getByTestId('wageTypeWrapper')).toBeInTheDocument();
  });
  test('is loading', () => {
    expect(Actions.setPolicyListingPageLoader(true)).toEqual({
      type: Actions.SET_LOADER,
      payload: {
        isPolicyPageLoading: true,
      },
    });
  });
  test('policyConfigurations', () => {
    const policyConfiguarionData: IPolicyConfiguration['policyConfiguration'] =
      initialState?.policyConfiguration;

    expect(
      PolicyConfigurationReducer(initialState, {
        type: Actions.SET_POLICY_CONFIGURATION,
        payload: policyConfiguarionData,
      }),
    ).toEqual({ ...initialState, policyConfiguration: policyConfiguarionData });
  });
  test('sertvice call failed', () => {
    expect(Actions.setServiceCallFailedPolicyLists(true, 'error')).toEqual({
      type: Actions.SET_SERVICE_CALL_FAILED,
      payload: {
        isPolicyPageLoading: false,
        serviceCallFailed: true,
        serviceCallError: 'error',
      },
    });
  });
  test('Edit page', () => {
    const policyConfigurationDetails = initialState.policyConfigurationDetails;
    expect(
      PolicyConfigurationReducer(initialState, {
        type: Actions.SET_POLICY_CONFIGURATION_STATE,
        payload: policyConfigurationDetails,
      }),
    ).toEqual({
      ...initialState,
      policyConfigurationDetails: policyConfigurationDetails,
    });
  });
  test('Preview', () => {
    const policyConfigurationDetails = initialState.policyConfigurationDetails;
    expect(
      PolicyConfigurationReducer(initialState, {
        type: Actions.SET_POLICY_CONFIGURATION_STATE,
        payload: policyConfigurationDetails,
      }),
    ).toEqual({
      ...initialState,
      policyConfigurationDetails: policyConfigurationDetails,
    });
  });
});
