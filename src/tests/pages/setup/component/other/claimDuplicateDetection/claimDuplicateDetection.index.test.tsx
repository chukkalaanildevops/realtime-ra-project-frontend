import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { initialState as state } from '../../../../../../pages/setup/component/other/claimDuplicateDetection/claimDuplicateDetection.reducer';
// import { mockStore, findByTestAttr } from '../../../../../../utils/test.utils';
import ClaimDetectionDetector from '../../../../../../pages/setup/component/other/claimDuplicateDetection/claimDuplicateDetection.index';
// import { shallow } from 'enzyme';
import Form, { FormInstance } from 'antd/lib/form';
import { act } from 'react-dom/test-utils';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

const initialState: any = {
  claimDetection: {
    ...state,
  },
};

const setUp = (props = initialState.claimDetection) => {
  const preProps = {
    ...initialState,
    claimDetection: { ...initialState.claimDetection, ...props },
  };
  const store = mockStore(preProps);
  return render(
    <Router>
      <Provider store={store}>
        <ClaimDetectionDetector />
      </Provider>
    </Router>,
  );
};

describe('<ClaimDetection />', () => {
  test('Render Component correctly', () => {
    const wrapper = setUp();
    expect(wrapper).toBeTruthy();
  });

  // test('Check Is Active switch if value is true', () => {
  //   act(() => {
  //     const wrapper = setUp({
  //       data: { is_detection_active: true, detection_choice: { code: '' } },
  //       error: '',
  //       isLoading: false,
  //       success: '',
  //     });
  //     const form: unknown = screen.getByTestId('form').prop('form');
  //     const value = (form as FormInstance).getFieldValue('is_detection_active');
  //     // expect(value).toBe(true);
  //   });

  //   //(findByTestAttr(wrapper, 'form') as FormInstance).getFieldValue('checked'),
  // });
});
