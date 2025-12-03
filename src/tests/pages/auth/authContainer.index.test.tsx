// import { shallow } from 'enzyme';
import React from 'react';
import { AuthContainer } from '../../../pages/auth/authContainer.index';
import { render, screen } from '@testing-library/react';

describe('Testing AuthContainer Component', () => {
  test('should render initial layout', () => {
    const { asFragment } = render(<AuthContainer />);
    expect(asFragment()).toMatchSnapshot();
  });

  test('component is rendered correctly', () => {
    render(<AuthContainer />);
    expect(
      screen.getByText(
        /Expenses, Travel and Claims Add-On for SAP SuccessFactors/i,
      ),
    ).toBeInTheDocument();
  });

  test('AuthContainer images should render', () => {
    render(<AuthContainer />);
    expect(screen.getByTestId('login-bg')).toBeInTheDocument();
    expect(screen.getByTestId('reim-logo')).toBeInTheDocument();
    expect(screen.getByTestId('reim-laptop')).toBeInTheDocument();
  });
});
