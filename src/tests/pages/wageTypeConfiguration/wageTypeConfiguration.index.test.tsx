import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { I18nProvider } from '@lingui/react';
import { i18n } from '@lingui/core';
// import { shallow, ShallowWrapper } from 'enzyme';
import { mockStore, findByTestAttr } from '../../../utils/test.utils';
import WageTypeConfiguration from '../../../pages/wageTypeConfiguration/wageTypeConfiguration.index';
import { wageTypeInitialState } from '../../../shared/redux/wageType/wageType.reducer';
import { render, screen } from '@testing-library/react';
/**
 * This function returns shallow rendered component
 * @function setUp
 * @param props {object}
 * @returns {ShallowWrapper}
 */

const setUp = (state: {} = wageTypeInitialState) => {
  const store = mockStore({
    WageType: { ...state },
  });
  const wrapper = render(
    <I18nProvider i18n={i18n}>
      <Router>
        <Provider store={store}>
          <WageTypeConfiguration />
        </Provider>
      </Router>
    </I18nProvider>,
  );
  return wrapper;
};

describe('<EmployeeGroups />', () => {
  let wrapper: any = setUp();
  test('Renders Without Error', () => {
    expect(wrapper.asFragment()).toBeTruthy();
    // expect(wrapper.getByTestId('wageTypeWrapper')).toBeInTheDocument();
  });
});
