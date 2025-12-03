// import React from 'react';
// import { Provider } from 'react-redux';
// import { BrowserRouter } from 'react-router-dom';
// import { shallow, ShallowWrapper, mount } from 'enzyme';
// import { findByTestAttr, mockStore } from '../../../../utils/test.utils';
// import catalogEn from '../../../../locales/en/messages.js';

// import { initialState } from '../../../../shared/redux/referenceObject/referenceObject.reducer';
// import ReferenceObjectListing from '../../../../pages/referenceObject/referenceObjectListing/referenceObjectListing.index';
// import { I18nProvider } from '@lingui/react';

// /**
//  * This function returns shallow rendered component
//  * @function setUp
//  * @param props {object}
//  * @returns {ShallowWrapper}
//  */

// const setUp = (state?: {}): ShallowWrapper => {
//   const store = returnMockStore(state);
//   const wrapper = shallow(<ReferenceObjectListing store={store} />)
//     .dive()
//     .dive();
//   return wrapper;
// };

// const returnMockStore = (state: {} = initialState) => {
//   return mockStore({
//     employeeGroupsListing: { ...initialState, ...state },
//   });
// };

// describe('<AddReferenceObject />', () => {
//   let wrapper: ShallowWrapper = setUp();
//   describe('ADD Initial State', () => {
//     wrapper = setUp(initialState);
//     test('renders without errors', () => {
//       expect(
//         findByTestAttr(wrapper, 'referenceObjectsListingWrapper'),
//       ).toHaveLength(1);
//     });

//     test('is all components render', () => {
//       expect(
//         findByTestAttr(wrapper, 'referenceObjectsListingContainer'),
//       ).toHaveLength(1);
//       expect(findByTestAttr(wrapper, 'filterBar')).toHaveLength(1);
//       expect(
//         findByTestAttr(wrapper, 'referenceObjectsListingTable'),
//       ).toHaveLength(1);
//       expect(findByTestAttr(wrapper, 'appDrawer')).toHaveLength(1);
//       expect(findByTestAttr(wrapper, 'objectReferenceTitle')).toHaveLength(0);
//       expect(findByTestAttr(wrapper, 'objectReferenceCreatedOn')).toHaveLength(
//         0,
//       );
//       expect(findByTestAttr(wrapper, 'objectReferenceCreatedBy')).toHaveLength(
//         0,
//       );
//       expect(findByTestAttr(wrapper, 'objectReferenceCode')).toHaveLength(0);
//       expect(findByTestAttr(wrapper, 'objectReferenceCode')).toHaveLength(0);
//       expect(findByTestAttr(wrapper, 'objectReferenceItems')).toHaveLength(0);
//     });
//   });

//   //   describe('appDrawer ', () => {
//   //     const objectReferenceSelected: any = {
//   //       created_by: {
//   //         id: 1,
//   //         name: 'Tony Chan',
//   //         email: 'tonychan@mailinator.com',
//   //         username: 'tonychan@mailinator.com',
//   //       },
//   //       created_on: '26/05/2020T10:56:37.615076Z',
//   //       modified_by: {
//   //         id: 3,
//   //         name: 'Aaron Apple',
//   //         email: 'aaron_apple@gmail.com',
//   //         username: 'aaron_apple@gmail.com',
//   //       },
//   //       modified_on: '11/06/2020T11:30:13.327864Z',
//   //       deleted_by: null,
//   //       deleted_on: null,
//   //       is_deleted: false,
//   //       id: 25,
//   //       title: 'ADTestPUT',
//   //       code: null,
//   //       source_reference_model: null,
//   //       items: [
//   //         {
//   //           id: 48,
//   //           reference_object: 'ADTestPUT',
//   //           title: 'ADTest1',
//   //           is_deleted: false,
//   //         },
//   //         {
//   //           id: 49,
//   //           reference_object: 'ADTestPUT',
//   //           title: 'ADTest2',
//   //           is_deleted: false,
//   //         },
//   //       ],
//   //     };
//   //     const store = returnMockStore({
//   //       objectReferenceSelected: objectReferenceSelected,
//   //     });
//   //     const catalogs = {
//   //       en: catalogEn,
//   //       'zh-cn': catalogEn,
//   //       'zh-tw': catalogEn,
//   //     };
//   //     const mountWrapper = mount(
//   //       <Provider store={store}>
//   //         <BrowserRouter>
//   //           <I18nProvider language={'en'} catalogs={catalogs}>
//   //             <ReferenceObjectListing />
//   //           </I18nProvider>
//   //         </BrowserRouter>
//   //       </Provider>,
//   //     );
//   // test('Object-Reference-Title', () => {
//   //   expect(findByTestAttr(wrapper, 'objectReferenceTitle')).toHaveLength(1);
//   //   expect(findByTestAttr(wrapper, 'objectReferenceTitle').text()).toEqual(
//   //     objectReferenceSelected.title,
//   //   );
//   // });
//   //   });
// });

test('temporary test', () => {});
