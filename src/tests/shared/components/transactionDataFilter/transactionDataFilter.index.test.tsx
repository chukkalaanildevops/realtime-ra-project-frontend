import React from 'react';
// import { shallow, ShallowWrapper } from 'enzyme';
import DataFilter from '../../../../pages/setup/component/other/adminDelegate/component/filters/filters.index';
// import { mockStore } from '../../../../utils/test.utils';
import configureStore from 'redux-mock-store';
import { render } from '@testing-library/react';
import { I18nProvider } from '@lingui/react';
import { i18n } from '@lingui/core';
import { Provider } from 'react-redux';
import { initialState as authState } from '../../../../shared/redux/auth/auth.reducer';
import { initialState as allowanceRateState } from '../../../../pages/setup/component/other/allowanceRate/allowanceRate.reducer';

const mockStore = configureStore();

const initialState = {
  auth: { ...authState },
  allowance: { ...allowanceRateState },
};

// const setUp = (props = initialState) => {
//   const preProps = {
//     ...initialState,
//     auth: {
//       ...initialState.auth,
//       ...props.auth,
//     },
//     allowance: {
//       ...initialState.allowance,
//       ...props.allowance,
//     },
//   };
//   const store = mockStore(preProps);

//   const wrapper = shallow(<DataFilter store={store} />);
//   return wrapper;
// };

const store = mockStore(initialState);

describe('Testing Filter Component', () => {
  let wrapper: any;

  beforeEach(() => {
    wrapper = render(
      <I18nProvider i18n={i18n}>
        <Provider store={store}>
          <DataFilter />
        </Provider>
      </I18nProvider>,
    );
  });

  test('should render initial layout', () => {
    //wrapper = setUp();
    expect(wrapper).toBeTruthy();
  });
});
