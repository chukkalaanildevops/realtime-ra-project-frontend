import React from 'react';
// import { shallow, ShallowWrapper } from 'enzyme';
import PrintPDF from '../../../../shared/components/printPDF/printPDF.index';
// import { mockStore } from '../../../../utils/test.utils';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import { intialState as addNewExpenseState } from '../../../../pages/addNewExpense/addNewExpense.reducer';
import { initialState as benefitState } from '../../../../pages/benefits/store/benefit.reducer';
import { initialState as appState } from '../../../../pages/app/app.reducer';
import { initialState as requestState } from '../../../../pages/request/request.reducer';

const mockStore = configureStore();

const initialState = {
  AddNewExpenseForm: { ...addNewExpenseState },
  BenefitReducer: { ...benefitState },
  app: { ...appState },
  request: { ...requestState },
};

const setUp = (props = initialState) => {
  const preProps = {
    ...initialState,
    AddNewExpenseForm: {
      ...initialState.AddNewExpenseForm,
      ...props.AddNewExpenseForm,
    },
    BenefitReducer: { ...initialState.BenefitReducer, ...props.BenefitReducer },
    app: { ...initialState.app, ...props.app },
    request: { ...initialState.request, ...props.request },
  };
  const store = mockStore(preProps);

  const wrapper = render(
    <Provider store={store}>
      <PrintPDF />
    </Provider>,
  );
  return wrapper;
};

describe('Testing PrintPDF Component', () => {
  let wrapper: any;

  test('should render initial layout', () => {
    wrapper = setUp();
    expect(wrapper).toBeTruthy();
  });
});
