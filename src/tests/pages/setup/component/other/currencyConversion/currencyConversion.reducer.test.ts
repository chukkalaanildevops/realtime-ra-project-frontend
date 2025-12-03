import reducer, {
  initialState,
} from '../../../../../../pages/setup/component/other/currencyConversion/currencyConversion.reducer';
import {
  saveData,
  saveCurrencies,
  saveConversionHistory,
  setSuccess,
} from '../../../../../../pages/setup/component/other/currencyConversion/currencyConversion.actions';

describe('Currency Conversion Reducer', () => {
  it('Should return default state', () => {
    const newState = reducer(undefined, {});
    expect(newState).toEqual(initialState);
  });

  it('Should return currency conversion list', () => {
    const data = [
      { id: 1, title: 'Item 1' },
      { id: 2, title: 'Item 2' },
    ];
    const newState = reducer(undefined, saveData(data));
    expect(newState).toEqual({
      ...initialState,
      currencyConversionList: data,
      error: '',
      success: '',
    });
  });

  it('Should return currency list', () => {
    const data = [
      { id: 1, title: 'Item 1' },
      { id: 2, title: 'Item 2' },
    ];
    const newState = reducer(undefined, saveCurrencies(data));
    expect(newState).toEqual({ ...initialState, currencyList: data });
  });

  it('Should return currency conversion history list', () => {
    const data = [
      { id: 1, title: 'Item 1' },
      { id: 2, title: 'Item 2' },
    ];
    const newState = reducer(undefined, saveConversionHistory(data));
    expect(newState).toEqual({ ...initialState, conversionHistory: data });
  });

  it('Should set success message', () => {
    const message = 'Success';
    const newState = reducer(undefined, setSuccess(message));
    expect(newState).toEqual({ ...initialState, success: message });
  });
});
