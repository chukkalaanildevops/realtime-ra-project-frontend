import React from 'react';
// import { shallow } from 'enzyme';
import { BrowserRouter as Router } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import CurrencyConversion from '../../../../../../pages/setup/component/other/currencyConversion/currencyConversion.index';
import { initialState as authState } from '../../../../../../shared/redux/auth/auth.reducer';
import { Empty } from 'antd';
// import {
//   mockStore,
//   findByTestAttr,
//   runTimer,
// } from '../../../../../../utils/test.utils';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

const initialState: any = {
  currencyConversion: {
    currencyConversionList: [],
    currencyList: [],
    error: '',
    success: '',
    conversionHistory: [],
  },
  auth: { ...authState },
};

const ccItems = [
  {
    base_currency: 'Aruban Florin',
    effective_from: '20-04-2020',
    key: '5',
    rate: 2.98,
    target_currency: 'Algerian Dinar',
  },
];

const currencyList = [
  {
    currency: { title: 'Test', code: 'T1' },
    country: { title: 'Test', code: 'T1' },
    id: 1,
  },
  {
    currency: { title: 'Item2', code: 'T2' },
    country: { title: 'iTEM2', code: 'T2' },
    id: 2,
  },
];

const setUp = (props = initialState) => {
  const preProps = {
    currencyConversion: { ...initialState.currencyConversion, ...props },
    auth: { ...initialState.auth, ...props },
  };
  const store = mockStore(preProps);
  return render(
    <Router>
      <Provider store={store}>
        <CurrencyConversion />
      </Provider>
    </Router>,
  );
};

describe('<CurrencyConversion />', () => {
  // let wrapper: ShallowWrapper;
  // beforeEach(() => {
  //   wrapper = setUp();
  // });
  // it('Screen renders without crashing', () => {
  //   const wrapper = setUp();
  //   expect(screen.getByTestId('currencyConversionContainer')).toBeInTheDocument();
  // });
  // describe('Currencies functionality', () => {
  //   it('Render all currencies item in select menu', () => {
  //     const wrapper = setUp({ currencyList });
  //     expect(
  //       findByTestAttr(wrapper, 'base-currency-search').children(),
  //     ).toHaveLength(2);
  //   });
  //   // it('Filter currencies in select menu', () => {
  //   //   const wrapper = setUp({ currencyList });
  //   //   findByTestAttr(wrapper, 'base-currency-search').simulate(
  //   //     'search',
  //   //     'test',
  //   //   );
  //   //   runTimer(() => {
  //   //     expect(
  //   //       findByTestAttr(wrapper, 'base-currency-search').children(),
  //   //     ).toHaveLength(1);
  //   //   }, 100);
  //   // });
  // });
  // describe('Currency Conversion functionality', () => {
  //   it('Show empty element if there are no records', () => {
  //     const wrapper = setUp();
  //     expect(wrapper.getByText('Empty')).toBeTruthy();
  //   });
  // it('Show empty element if there are no records', () => {
  //   const wrapper = setUp({
  //     currencyConversionList: ccItems,
  //   });
  //   expect(findByTestAttr(wrapper, 'table-cc')).toHaveLength(1);
  // });
  // it('Show string error message if crate currency conversion failed', () => {
  //   const wrapper = setUp({
  //     error: 'Error',
  //   });
  //   runTimer(() => {
  //     expect(wrapper.update().find(message)).toHaveLength(1);
  //   }, 1000);
  // });
  // it('Show error message on form if crate currency conversion failed', () => {
  //   const wrapper = setUp({
  //     error: { rate: ['Conversion rate already exists'] },
  //   });
  //   runTimer(() => {
  //     const form = findByTestAttr(wrapper, 'ccForm');
  //     expect(form.children()).toHaveLength(4);
  //   });
  // });
  // it('Show error if base currency and target currency are same', () => {
  //   const wrapper = setUp({
  //     error: { rate: ['Conversion rate already exists'] },
  //   });
  //   runTimer(() => {
  //     const form = findByTestAttr(wrapper, 'ccForm');
  //     expect(form.children()).toHaveLength(4);
  //   });
  // });
  // it('Clone item', () => {
  //   const wrapper = setUp({ currencyConversionList: ccItems });
  //   // const dotMenu = wrapper.find(DotMenu);
  //   // const cloneButton = dotMenu.childAt(1);
  //   // cloneButton.simulate('click');
  //   expect(findByTestAttr(wrapper, 'createDrawer').prop('visible')).toBe(
  //     false,
  //   );
  // });
  // });
});

test('temporary test', () => {});
