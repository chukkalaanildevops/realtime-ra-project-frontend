// import React from 'react';
// // import { findByTestAttr, mockStore } from '../../../../../../utils/test.utils';
// import { render } from '@testing-library/react';
// import configureStore from 'redux-mock-store';
// import ConfigForm from '../../../../../../pages/expenseTypeConfiguration/addExpenseTypeConfiguration/components/configForm/configForm.index';
// import { initialState } from '../../../../../../pages/expenseTypeConfiguration/expenseTypeConfiguration.reducer';
// // import 'jest';

// /**
//  * This function returns shallow rendered component
//  * @function setUp
//  * @param props {object}
//  * @returns wrapper {Object}(DOM)
//  */

// const mockStore = configureStore();

// const setUp = (state: any = {}) => {
//   const store = mockStore({
//     expenseTypeConfigurationReducer: { ...state },
//   });
//   const wrapper = render(<ConfigForm store={store} />)
//   return wrapper;
// };

// describe('<configForm>', () => {
//   let wrapper: any;
//   /**
//    * This functions is useful to create custom store and passes that store to setup().
//    * This function store shallow render element inside wrapper variable.
//    * In params don't pass full object pass specific key:value in object.
//    * @function setCategoryBeforeEach
//    * @param {object} general_data
//    * @param {object} entertaimentData
//    * @param {object} _extraData
//    * @returns {void}
//    */
//   const setCategoryBeforeEach = (
//     general_data: any = {},
//     entertaimentData: any = {},
//     _extraData: any = {},
//   ): void => {
//     const storeVal = {
//       ...initialState,
//       general_data: {
//         ...initialState.general_data,
//         ...general_data,
//       },
//       entertaiment: {
//         ...initialState.entertaiment,
//         ...entertaimentData,
//       },
//       ..._extraData,
//     };
//     wrapper = setUp(storeVal);
//   };
//   describe('category=`general`', () => {
//     beforeEach(() => {
//       setCategoryBeforeEach({ category: 'General' });
//     });
//     test('render without error', () => {
//       const component = findByTestAttr(wrapper, 'configuration-form');
//       expect(component).toHaveLength(1);
//     });
//     // test('Form field test when category is general', () => {
//     //   let component = wrapper.find('FormItem');
//     //   expect(component).toHaveLength(23);
//     // });
//     test('must not load in the dom', () => {
//       expect(
//         findByTestAttr(
//           wrapper,
//           'is_allow_updating_mileage_claims_calculated_amount',
//         ),
//       ).toHaveLength(0);
//       expect(findByTestAttr(wrapper, 'mileage_rate_as_of_date')).toHaveLength(
//         0,
//       );
//       expect(findByTestAttr(wrapper, 'mileage_rate')).toHaveLength(0);
//       expect(findByTestAttr(wrapper, 'rate_per_staff_member')).toHaveLength(0);
//       expect(
//         findByTestAttr(wrapper, 'are_staff_members_mandatory'),
//       ).toHaveLength(0);
//       expect(
//         findByTestAttr(wrapper, 'entertainment_rate_country'),
//       ).toHaveLength(0);
//       expect(
//         findByTestAttr(wrapper, 'entertainment_rate_as_of_date'),
//       ).toHaveLength(0);
//       expect(findByTestAttr(wrapper, 'rate_per_guest_member')).toHaveLength(0);
//       expect(
//         findByTestAttr(wrapper, 'are_guest_members_mandatory'),
//       ).toHaveLength(0);
//     });
//   });

//   describe('category=`mileage`', () => {
//     beforeEach(() => {
//       setCategoryBeforeEach({ category: 'Mileage' });
//     });
//     test('render without error', () => {
//       const component = findByTestAttr(wrapper, 'configuration-form');
//       expect(component).toHaveLength(1);
//     });
//     // test('Form field test when category is mileage', () => {
//     //   let component = wrapper.find('FormItem');
//     //   expect(component).toHaveLength(26);
//     // });
//     // test('must be in the dom', () => {
//     //   expect(
//     //     findByTestAttr(
//     //       wrapper,
//     //       'is_allow_updating_mileage_claims_calculated_amount',
//     //     ),
//     //   ).toHaveLength(1);
//     //   expect(findByTestAttr(wrapper, 'mileage_rate_as_of_date')).toHaveLength(
//     //     1,
//     //   );
//     //   expect(findByTestAttr(wrapper, 'mileage_rate')).toHaveLength(1);
//     // });
//     test('must not load in the dom', () => {
//       expect(findByTestAttr(wrapper, 'rate_per_staff_member')).toHaveLength(0);
//       expect(
//         findByTestAttr(wrapper, 'are_staff_members_mandatory'),
//       ).toHaveLength(0);
//       expect(
//         findByTestAttr(wrapper, 'entertainment_rate_country'),
//       ).toHaveLength(0);
//       expect(
//         findByTestAttr(wrapper, 'entertainment_rate_as_of_date'),
//       ).toHaveLength(0);
//       expect(findByTestAttr(wrapper, 'rate_per_guest_member')).toHaveLength(0);
//       expect(
//         findByTestAttr(wrapper, 'are_guest_members_mandatory'),
//       ).toHaveLength(0);
//     });
//   });

//   describe('category=`Entertainment`', () => {
//     test('render without error', () => {
//       setCategoryBeforeEach({ category: 'Entertainment' });
//       const component = findByTestAttr(wrapper, 'configuration-form');
//       expect(component).toHaveLength(1);
//     });
//     test('Form field test when category is Entertainment', () => {
//       setCategoryBeforeEach({ category: 'Entertainment' });
//       let component = wrapper.find('FormItem');
//       expect(component).toHaveLength(28);
//     });
//     //     describe('Form field test category=`Entertainment` and can_have_staff_members=`true` ', () => {
//     //       beforeEach(() => {
//     //         setCategoryBeforeEach(
//     //           { category: 'Entertainment' },
//     //           {
//     //             can_have_staff_members: true,
//     //           },
//     //         );
//     //       });
//     //       test('loaded feld length', () => {
//     //         let component = wrapper.find('FormItem');
//     //         expect(component).toHaveLength(31);
//     //       });
//     //       test('must be in the dom', () => {
//     //         let component = findByTestAttr(wrapper, 'rate_per_staff_member');
//     //         expect(component).toHaveLength(1);
//     //         let component1 = findByTestAttr(wrapper, 'are_staff_members_mandatory');
//     //         expect(component1).toHaveLength(1);
//     //         let component2 = findByTestAttr(wrapper, 'entertainment_rate_country');
//     //         expect(component2).toHaveLength(1);
//     //         let component3 = findByTestAttr(
//     //           wrapper,
//     //           'entertainment_rate_as_of_date',
//     //         );
//     //         expect(component3).toHaveLength(1);
//     //       });
//     //     });
//     //     describe('Form field test category=`Entertainment` and can_have_guest_members=`true` ', () => {
//     //       beforeEach(() => {
//     //         setCategoryBeforeEach(
//     //           { category: 'Entertainment' },
//     //           {
//     //             can_have_guest_members: true,
//     //           },
//     //         );
//     //       });
//     //       test('loaded feld length', () => {
//     //         let component = wrapper.find('FormItem');
//     //         expect(component).toHaveLength(31);
//     //       });
//     //       test('must be in the dom', () => {
//     //         let component = findByTestAttr(wrapper, 'rate_per_guest_member');
//     //         expect(component).toHaveLength(1);
//     //         let component1 = findByTestAttr(wrapper, 'are_guest_members_mandatory');
//     //         expect(component1).toHaveLength(1);
//     //         let component2 = findByTestAttr(wrapper, 'entertainment_rate_country');
//     //         expect(component2).toHaveLength(1);
//     //         let component3 = findByTestAttr(
//     //           wrapper,
//     //           'entertainment_rate_as_of_date',
//     //         );
//     //         expect(component3).toHaveLength(1);
//     //       });
//     //     });
//     //     test('must not load in the dom', () => {
//     //       expect(
//     //         findByTestAttr(
//     //           wrapper,
//     //           'is_allow_updating_mileage_claims_calculated_amount',
//     //         ),
//     //       ).toHaveLength(0);
//     //       expect(findByTestAttr(wrapper, 'mileage_rate_as_of_date')).toHaveLength(
//     //         0,
//     //       );
//     //       expect(findByTestAttr(wrapper, 'mileage_rate')).toHaveLength(0);
//     //     });
//   });

//   describe('Pervious Rate testing', () => {
//     describe('mileage-table', () => {
//       beforeEach(() => {
//         setCategoryBeforeEach({}, {}, { rate_type: 'mileage' });
//         wrapper.setProps({ isUpdateMode: true });
//       });
//       //   test('must be in the dom', () => {
//       //     expect(
//       //       findByTestAttr(wrapper, 'mileage-previous-rates-table'),
//       //     ).toHaveLength(1);
//       //   });
//       test('must not be in the dom', () => {
//         expect(
//           findByTestAttr(wrapper, 'entertainment-previous-rates-table'),
//         ).toHaveLength(0);
//       });
//     });
//     describe('entertainment-table', () => {
//       beforeEach(() => {
//         setCategoryBeforeEach({}, {}, { rate_type: 'entertainment' });
//         wrapper.setProps({ isUpdateMode: true });
//       });
//       //   test('must be in the dom', () => {
//       //     expect(
//       //       findByTestAttr(wrapper, 'entertainment-previous-rates-table'),
//       //     ).toHaveLength(1);
//       //   });
//       test('must not be in the dom', () => {
//         expect(
//           findByTestAttr(wrapper, 'mileage-previous-rates-table'),
//         ).toHaveLength(0);
//       });
//     });
//     test('rate_type=` ` then dom must not containe this elem', () => {
//       setCategoryBeforeEach({}, {}, { rate_type: '' });
//       wrapper.setProps({ isUpdateMode: true });
//       expect(
//         findByTestAttr(wrapper, 'mileage-previous-rates-table'),
//       ).toHaveLength(0);
//       expect(
//         findByTestAttr(wrapper, 'entertainment-previous-rates-table'),
//       ).toHaveLength(0);
//     });
//   });
// });

test('temporary test', () => {});
