import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { I18nProvider } from '@lingui/react';
import { i18n } from '@lingui/core';
// import { shallow, ShallowWrapper } from 'enzyme';
import { mockStore, findByTestAttr } from '../../../../../../utils/test.utils';
import RiskScoreRangeIndex from '../../../../../../pages/setup/component/other/riskScoreRange/riskScoreRange.index';
import RiskScoreRangeReducer, {
  initialState,
} from '../../../../../../pages/setup/component/other/riskScoreRange/riskScoreRange.reducer';
import * as Actions from '../../../../../../pages/setup/component/other/riskScoreRange/riskScoreRange.actions';
import { render, screen } from '@testing-library/react';

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
          <RiskScoreRangeIndex />
        </Provider>
      </Router>
    </I18nProvider>,
  );
  return wrapper;
};

describe('<RiskScoreRangeIndex />', () => {
  let wrapper: any = setUp();
  test('Renders Without Error', () => {
    expect(wrapper.asFragment()).toBeTruthy();

    // expect(wrapper.getByTestId('wageTypeWrapper')).toBeInTheDocument();
  });
  test('is loading', () => {
    expect(Actions.setLoader(true)).toEqual({
      type: Actions.SET_LOADER,
      payload: {
        isLoading: true,
      },
    });
  });
  test('riskscores', () => {
    const riskScoreData = initialState?.riskScores;
    expect(
      RiskScoreRangeReducer(initialState, {
        type: Actions.SET_RISK_SCORES,
        payload: riskScoreData,
      }),
    ).toEqual({ ...initialState, riskScores: riskScoreData });
  });
  test('sertvice call failed', () => {
    expect(Actions.setServiceCallFailed(true, 'error')).toEqual({
      type: Actions.SET_SERVICE_CALL_FAILED,
      payload: {
        isLoading: false,
        serviceCallFailed: true,
        serviceCallError: 'error',
      },
    });
  });
});
