import { ShallowWrapper, ReactWrapper } from 'enzyme';
import rootReducer from '../shared/redux/rootReducer';
import { middlewares } from '../shared/redux/store/store.index';
import { applyMiddleware, createStore } from 'redux';

export const findByTestAttr = (
  component: ShallowWrapper | ReactWrapper,
  attr: string,
) => component.find(`[data-test='${attr}']`);

export const findByDataTest1 = (
  component: ShallowWrapper | ReactWrapper,
  attr: string,
) => component.find(`[data-test-1='${attr}']`);

export const mockStore = (initialState: any) => {
  const createStoreWithMiddleware = applyMiddleware(...middlewares)(
    createStore,
  );
  return createStoreWithMiddleware(rootReducer, initialState);
};

export const runTimer = (fun: Function, time = 100) => {
  jest.useFakeTimers();
  setTimeout(() => {
    fun();
  }, time);
  jest.runAllTimers();
};
