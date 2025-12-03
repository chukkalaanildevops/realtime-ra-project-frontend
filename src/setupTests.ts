// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/extend-expect';

import 'jest-enzyme';

// Enzyme.configure({ adapter: new Adapter(), disableLifecycleMethods: false });

jest.spyOn(global.console, 'log').mockImplementation(jest.fn());
jest.spyOn(global.console, 'debug').mockImplementation(jest.fn());
jest.spyOn(global.console, 'error').mockImplementation(jest.fn());
jest.spyOn(global.console, 'info').mockImplementation(jest.fn());

global.console = {
  ...console,
  // uncomment to ignore a specific log level
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  error: jest.fn(),
};

global.matchMedia =
  global.matchMedia ||
  function() {
    return {
      matches: false,
      addListener: function() {},
      removeListener: function() {},
    };
  };
