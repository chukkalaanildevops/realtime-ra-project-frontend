import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import BenefitTypes from '../../../../pages/benefitTypeConfiguration/benefitTypes/benefitTypes.index';
import { render } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
// import { mockStore, findByTestAttr } from '../../../../utils/test.utils';
// import { shallow, mount } from 'enzyme';
import { IBenefitTypeConfigState } from '../../../../pages/benefitTypeConfiguration/benefitTypeConfiguration.model';
import { initialState as benefitConfigstate } from '../../../../pages/benefitTypeConfiguration/benefitTypeConfiguration.reducer';
import { initialState as authState } from '../../../../shared/redux/auth/auth.reducer';
import '../../../../utils/matchMedia.mock.utils';
import { AUTH_STATE } from '../../../../shared/redux/auth/auth.model';
// import { Skeleton } from 'antd';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

const initialState: {
  benefitConfig: IBenefitTypeConfigState;
  auth: AUTH_STATE;
} = {
  benefitConfig: {
    ...benefitConfigstate,
  },
  auth: {
    ...authState,
  },
};

const setUp = (props = initialState.benefitConfig) => {
  const preProps = {
    ...initialState,
    benefitConfig: { ...initialState.benefitConfig, ...props },
  };

  return render(
    <Router>
      <Provider store={mockStore(preProps)}>
        <BenefitTypes />
      </Provider>
    </Router>,
  );
};

describe('Benefit Type', () => {
  test('Render component correctly', () => {
    const wrapper = setUp();
    expect(wrapper.asFragment()).toBeTruthy();
  });

  // test('Show Empty object if there is no data', () => {
  //   const wrapper = setUp();
  //   expect(wrapper.find('Empty')).toHaveLength(1);
  //   // expect(wrapper.find(Skeleton).prop('active')).toBe(true);
  // });

  // test('Test data source of table', () => {
  //   const wrapper = setUp({ benefitTypes: [{}, {}] });
  //   expect(wrapper.find('Table').props().dataSource).toEqual([{}, {}]);
  //   // expect(wrapper.find(Skeleton).prop('active')).toBe(true);
  // });

  // test('Show Success message on submit', () => {
  //   const wrapper = setUp({ success: 'Success Message' });
  //   // expect(wrapper.find('MessageApi')).toHaveLength(1);
  // });
});
