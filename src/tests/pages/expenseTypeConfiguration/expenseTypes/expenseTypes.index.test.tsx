// import React from 'react';
// import { shallow } from 'enzyme';
// import { findByTestAttr, mockStore } from '../../../../utils/test.utils';
// import ExpenseTypes from '../../../../pages/expenseTypeConfiguration/expenseTypes/expenseTypes.index';
// import { initialState } from './expenseTypes.reducer.BKP';
// import { IinitialexpenseTypeConfigurationState } from '../../../../pages/expenseTypeConfiguration/expenseTypeConfiguration.model';
// import expenseTypesReducer from './expenseTypes.reducer.BKP';
// import * as Actions from '../../../../pages/expenseTypeConfiguration/expenseTypeConfiguration.actions';
// import 'jest';

// /**
//  * This function returns shallow rendered component
//  * @function setUp
//  * @param props {object}
//  * @returns wrapper {Object}(DOM)
//  */

// const setUp = (state: IinitialexpenseTypeConfigurationState = initialState) => {
//   const wrapper = shallow(<ExpenseTypes store={returnMockStore(state)} />)
//     .dive()
//     .dive();
//   return wrapper;
// };

// const returnMockStore = (
//   state: IinitialexpenseTypeConfigurationState = initialState,
// ) => {
//   const store = mockStore({
//     expenseTypesReducer: { ...state },
//   });
//   return store;
// };

// describe('<ExpenseTypes> Component Testing', () => {
//   let wrapper = setUp({ ...initialState });
//   const runForWrapper = (
//     state: IinitialexpenseTypeConfigurationState = initialState,
//   ) => {
//     wrapper = setUp({ ...state });
//   };
//   test('render without error', () => {
//     runForWrapper();
//     const component = findByTestAttr(wrapper, 'expenseTypeListingContainer');
//     expect(component.length).toBe(1);
//   });

//   describe('intial state component testing', () => {
//     runForWrapper();
//     test('HeaderBarWrapper test', () => {
//       expect(findByTestAttr(wrapper, 'headerBarWrapper')).toHaveLength(1);
//     });

//     test('expenseTypeListingContainer test', () => {
//       expect(
//         findByTestAttr(wrapper, 'expenseTypeListingContainer'),
//       ).toHaveLength(1);
//     });

//     test('filterBar test', () => {
//       expect(findByTestAttr(wrapper, 'filterBar')).toHaveLength(1);
//     });

//     test('expenseTypeListingTable test', () => {
//       expect(findByTestAttr(wrapper, 'expenseTypeListingTable')).toHaveLength(
//         1,
//       );
//     });

//     test('appDrawer test', () => {
//       expect(findByTestAttr(wrapper, 'appDrawer')).toHaveLength(1);
//     });
//   });

//   describe('Reducer testing', () => {
//     test('Default Test', () => {
//       expect(expenseTypesReducer(initialState, { type: 'NONE' })).toEqual(
//         initialState,
//       );
//     });

//     test('Updating expenseTypes', () => {
//       const _payload = {
//         expenseTypes: [
//           {
//             id: 100,
//             created_on: '21-01-2001',
//             modified_on: '21-01-2001',
//             created_by: {
//               id: 1,
//               name: 'Max',
//               email: 'Maximilian@mail.com',
//               username: 'MadMax',
//             },
//             title: 'unknown',
//             code: 'HHH',
//             legal_entity: {
//               id: 1,
//               legal_entity_type: 'Organization',
//               title: 'Rolling Arrays',
//             },
//             min_amount: '10000000000000000000000000000',
//             max_amount: '10000000000000000000000000001',
//             allow_claims_on: { code: 'FYR', title: 'Full Year' },
//             category: { code: 'mil', title: 'Mileage' },
//           },
//         ],
//       };
//       expect(
//         expenseTypesReducer(initialState, {
//           type: 'UPDATE_EXPENSE_TYPE',
//           payload: _payload,
//         }),
//       ).toEqual({ ...initialState, ..._payload });
//     });

//     test('Testing RESET_TO_INITIAL', () => {
//       expect(
//         expenseTypesReducer(initialState, {
//           type: 'RESET_TO_INITIAL',
//         }),
//       ).toEqual({ ...initialState });
//     });
//   });

//   describe('Action Creater testing', () => {
//     test('apiCallRequest type: API_CALL_REQUEST', () => {
//       const _payload = {
//         compactExpenseTypeLoading: true,
//         expenseTypeDetailLoading: true,
//       };
//       expect(Actions.apiCallRequest(_payload)).toEqual({
//         type: 'API_CALL_REQUEST',
//         payload: {
//           error: '',
//           success: '',
//           info: 'Loading Data...',
//           isLoading: true,
//           ..._payload,
//         },
//       });
//     });

//     test('apiCallSuccess type: API_CALL_SUCCESS', () => {
//       const _payload = {
//         compactExpenseTypeLoading: false,
//         expenseTypeDetailLoading: false,
//       };
//       const successStr = 'Loaded data';
//       expect(Actions.apiCallSuccess(successStr, _payload)).toEqual({
//         type: 'API_CALL_SUCCESS',
//         payload: {
//           error: '',
//           success: successStr,
//           info: '',
//           isLoading: false,
//           ..._payload,
//         },
//       });
//     });

//     test('apiCallFail type: API_CALL_FAIL', () => {
//       const _payload = {
//         compactExpenseTypeLoading: false,
//         expenseTypeDetailLoading: false,
//       };
//       const err = 'Network Error';
//       expect(Actions.apiCallFail(err, _payload)).toEqual({
//         type: 'API_CALL_FAIL',
//         payload: {
//           error: err,
//           success: '',
//           info: '',
//           isLoading: false,
//           ..._payload,
//         },
//       });
//     });

//     test('apiCallReset type: API_CALL_RESET', () => {
//       const _payload = {
//         compactExpenseTypeLoading: false,
//         expenseTypeDetailLoading: false,
//       };
//       expect(Actions.apiCallReset(_payload)).toEqual({
//         type: 'API_CALL_RESET',
//         payload: {
//           error: '',
//           success: '',
//           info: '',
//           isLoading: false,
//           ..._payload,
//         },
//       });
//     });

//     test('resetToInitial type: RESET_TO_INITIAL', () => {
//       expect(Actions.resetToInitial()).toEqual({
//         type: 'RESET_TO_INITIAL',
//       });
//     });

//     test('saveExpenseTypeListData type: UPDATE_EXPENSE_TYPE', () => {
//       const _payload = [
//         {
//           id: 21,
//           created_on: '',
//           modified_on: '',
//           created_by: {
//             id: 1,
//             name: '',
//             email: '',
//             username: '',
//           },
//           title: '',
//           code: '',
//           legal_entity: {
//             id: 1,
//             legal_entity_type: '',
//             title: '',
//           },
//           min_amount: '0',
//           max_amount: '0',
//           allow_claims_on: { code: '', title: '' },
//           category: { code: '', title: '' },
//         },
//         {
//           id: 22,
//           created_on: '',
//           modified_on: '',
//           created_by: {
//             id: 1,
//             name: '',
//             email: '',
//             username: '',
//           },
//           title: '',
//           code: '',
//           legal_entity: {
//             id: 1,
//             legal_entity_type: '',
//             title: '',
//           },
//           min_amount: '0',
//           max_amount: '0',
//           allow_claims_on: { code: '', title: '' },
//           category: { code: '', title: '' },
//         },
//         {
//           id: 23,
//           created_on: '',
//           modified_on: '',
//           created_by: {
//             id: 1,
//             name: '',
//             email: '',
//             username: '',
//           },
//           title: '',
//           code: '',
//           legal_entity: {
//             id: 1,
//             legal_entity_type: '',
//             title: '',
//           },
//           min_amount: '0',
//           max_amount: '0',
//           allow_claims_on: { code: '', title: '' },
//           category: { code: '', title: '' },
//         },
//       ];
//       expect(Actions.saveExpenseTypeListData(_payload)).toEqual({
//         type: 'UPDATE_EXPENSE_TYPE',
//         payload: {
//           expenseTypes: _payload,
//         },
//       });
//     });

//     test('updateViewState type:UPDATE_VIEW_STATE', () => {
//       const _payload = {
//         viewClicked: true,
//         item: {
//           'expense data': 'test',
//         },
//       };
//       expect(
//         Actions.updateViewState(_payload.viewClicked, _payload.item),
//       ).toEqual({
//         type: 'UPDATE_VIEW_STATE',
//         payload: {
//           viewClicked: _payload.viewClicked,
//           item: _payload.item,
//         },
//       });
//     });

//     test('saveExpenseTypeData type:UPDATE_ITEM', () => {
//       const _payload = {
//         item: {
//           'expense data': 'test',
//         },
//       };
//       expect(Actions.saveExpenseTypeData(_payload.item)).toEqual({
//         type: 'UPDATE_ITEM',
//         payload: {
//           item: _payload.item,
//         },
//       });
//     });
//   });
// });

test('temporary test', () => {});
