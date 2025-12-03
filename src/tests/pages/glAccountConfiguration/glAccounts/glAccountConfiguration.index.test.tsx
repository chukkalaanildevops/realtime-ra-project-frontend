import React from 'react';
import GlAccounts from '../../../../pages/glAccountConfiguration/glAccounts/glAccountConfiguration.index';
import { mockStore, findByTestAttr } from '../../../../utils/test.utils';
// import { shallow, mount } from 'enzyme';
import { GL_ACCOUNT_STATE } from '../../../../shared/redux/glAccount/glAccount.model';
import { initialState as state } from '../../../../shared/redux/glAccount/glAccount.reducer';
import '../../../../utils/matchMedia.mock.utils';
import { Skeleton } from 'antd';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';

const initialState: { glAccount: GL_ACCOUNT_STATE } = {
  glAccount: {
    ...state,
  },
};

const setUp = (props = initialState.glAccount) => {
  const preProps = {
    ...initialState,
    glAccount: { ...initialState.glAccount, ...props },
  };
  const store = mockStore(preProps);
  return render(
    <Router>
      <Provider store={store}>
        <GlAccounts />
      </Provider>
    </Router>,
  );
};

describe('GL Account', () => {
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
  //   const wrapper = setUp({ glAccounts: [{}, {}] });
  //   expect(wrapper.find('Table').props().dataSource).toEqual([{}, {}]);
  //   // expect(wrapper.find(Skeleton).prop('active')).toBe(true);
  // });

  test('Show Success message on submit', () => {
    const wrapper = setUp({ success: 'Success Message' });
    // expect(wrapper.find('MessageApi')).toHaveLength(1);
  });
});
