import React from 'react';
import RequestTypes from '../../../../pages/requestTypeConfiguration/requestTypes/requestTypes.index';
// import { mockStore, findByTestAttr } from '../../../../utils/test.utils';
// import { shallow, mount } from 'enzyme';
import { BrowserRouter as Router } from 'react-router-dom';
import { render } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { initialState as requestState } from '../../../../pages/requestTypeConfiguration/requestTypeConfiguration.reducer';
import { initialState as authState } from '../../../../shared/redux/auth/auth.reducer';
import '../../../../utils/matchMedia.mock.utils';
import thunk from 'redux-thunk';
import { Skeleton } from 'antd';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

const initialState: any = {
  requestConfig: {
    ...requestState,
  },
  auth: { ...authState },
};

const setUp = (props = initialState.requestConfig) => {
  const preProps = {
    ...initialState,
    requestConfig: { ...initialState.requestConfig, ...props },
  };
  const store = mockStore(preProps);
  return render(
    <Router>
      <Provider store={store}>
        <RequestTypes />
      </Provider>
    </Router>,
  );
};

describe('<RequestType />', () => {
  test('Render component correctly', () => {
    const wrapper = setUp();
    expect(wrapper).toBeTruthy();
  });

  // test('Show Empty object if there is no data', () => {
  //   const wrapper = setUp();
  //   expect(wrapper.find('Empty')).toHaveLength(1);
  //   // expect(wrapper.find(Skeleton).prop('active')).toBe(true);
  // });

  // test('Test data source of table', () => {
  //   const wrapper = setUp({ requestTypes: [{}, {}] });
  //   expect(wrapper.find('Table').props().dataSource).toEqual([{}, {}]);
  //   // expect(wrapper.find(Skeleton).prop('active')).toBe(true);
  // });

  test('Show Success message on submit', () => {
    const wrapper = setUp({ success: 'Success Message' });
    // expect(wrapper.find('MessageApi')).toHaveLength(1);
  });
});
