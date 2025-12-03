import React from 'react';
import * as router from 'react-router';
// import { shallow, ShallowWrapper } from 'enzyme';
// import { findByTestAttr } from '../../../../utils/test.utils';
import { AppDrawer } from '../../../../shared/components/appDrawer/appDrawer.index';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { render, screen, fireEvent } from '@testing-library/react';
import { unmountComponentAtNode } from 'react-dom';
// import { Button } from 'antd';

// describe('<AppDrawer />', () => {
//   let wrapper: ShallowWrapper = shallow(<AppDrawer />);
//   test('Renders Without Errors', () => {
//     wrapper.setProps({});
//     expect(findByTestAttr(wrapper, 'appDrawer')).toHaveLength(1);
//   });
//   test('showCancelButton=true', () => {
//     const _cancelText: string = 'Exit';
//     wrapper.setProps({ showCancelButton: true, cancelText: _cancelText });
//     expect(findByTestAttr(wrapper, 'backButton')).toHaveLength(1);
//     expect(findByTestAttr(wrapper, 'backButton').type()).toEqual(Button);
//     // expect(findByTestAttr(wrapper, 'backButton').text()).toEqual(_cancelText);
//   });
//   test('showOkButton=true', () => {
//     wrapper.setProps({ showOkButton: true });
//     expect(findByTestAttr(wrapper, 'okButton')).toHaveLength(1);
//   });
// });

const mockStore = configureStore();
const navigate = jest.fn();

let container: any = null;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
  // jest.spyOn(router, 'useNavigate').mockImplementation(() => navigate);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

const AppDrawerComponent = (
  <Provider store={mockStore()}>
    <AppDrawer />
  </Provider>
);

describe('<AppDrawer />', () => {
  test('Render without errors', () => {
    const comp = render(AppDrawerComponent);
    // const textElement = screen.getByTestId('appDrawer');
    // expect(textElement).toBeInTheDocument();
    expect(screen).toMatchSnapshot();
  });
});
