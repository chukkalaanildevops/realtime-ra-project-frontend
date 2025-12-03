import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { Login } from '../../../pages/auth/login.index';

const mockStore = configureStore();

const routeComponentPropsMock = {
  history: {} as any,
  location: {} as any,
  match: {} as any,
};

const LoginComp = (
  <Provider store={mockStore()}>
    <Login {...routeComponentPropsMock} />
  </Provider>
);

describe('Testing login Component', () => {
  test('should render initial layout', () => {
    const { asFragment } = render(LoginComp);
    expect(asFragment()).toMatchSnapshot();
  });

  test('component rendered correctly', () => {
    render(LoginComp);
    expect(screen.getByText(/Sign In/i)).toBeInTheDocument();
  });

  // test('Continue button click should trigger', () => {
  //   const onClick = jest.fn();
  //   render(LoginComp);
  //   const button = screen.getByTestId('selectOrganisationContinueButton')
  //   fireEvent.click(button)
  //   expect(onClick).toHaveBeenCalled();
  // });
});
