import React from 'react';
import AddUpdateGlAccount from '../../../../pages/glAccountConfiguration/addUpdateGlAccount/addUpdateGlAccount.index';
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
        <AddUpdateGlAccount match={{ params: { id: '1' } }} />
      </Provider>
    </Router>,
  );
};

describe('<AddUpdateGlAccount />', () => {
  test('Render screen correctly', () => {
    const wrapper = setUp();
    expect(wrapper).toBeTruthy();
  });
});
