// import React from 'react';
// import { findByTestAttr, mockStore } from '../../../../utils/test.utils';
// import { initialState } from '../../../../shared/redux/referenceObject/referenceObject.reducer';
// import AddReferenceObject from '../../../../pages/referenceObject/addReferenceObject/addReferenceObject.index';
// import { render, screen } from '@testing-library/react';
// import { Provider } from 'react-redux';
// import { BrowserRouter as Router } from 'react-router-dom';

// /**
//  * This function returns shallow rendered component
//  * @function setUp
//  * @param props {object}
//  * @returns {ShallowWrapper}
//  */

// const setUp = (state: {} = initialState): any => {
//   const store = mockStore({
//     employeeGroupsListing: { ...initialState, ...state },
//   });
//   const wrapper = render(
//     <Router>
//       <Provider store={store} >
//         <AddReferenceObject match={{ params: {} }} />
//       </Provider>
//     </Router>
//   )
//   return wrapper;
// };

// describe('<AddReferenceObject />', () => {
//   let wrapper: any = setUp();
//   describe('ADD Initial State', () => {
//     wrapper = setUp(initialState);
//     test('renders without errors', () => {
//       expect(screen.getByTestId('addReferenceObjectWrapper')).toBeInTheDocument();
//     });

//     test('title test', () => {
//       expect(findByTestAttr(wrapper, 'addReferenceObjectTitle')).toHaveLength(
//         1,
//       );
//       expect(findByTestAttr(wrapper, 'addReferenceObjectTitle').text()).toEqual(
//         'Reference Object',
//       );
//       expect(findByTestAttr(wrapper, 'backButton')).toHaveLength(1);
//     });

//     // test('is all components renders', () => {
//     //   expect(findByTestAttr(wrapper, 'form')).toHaveLength(1);
//     //   expect(findByTestAttr(wrapper, 'title')).toHaveLength(1);
//     //   expect(findByTestAttr(wrapper, 'formTitleInput')).toHaveLength(1);
//     //   expect(findByTestAttr(wrapper, 'code')).toHaveLength(1);
//     //   expect(findByTestAttr(wrapper, 'formCodeInput')).toHaveLength(1);
//     //   expect(findByTestAttr(wrapper, 'items')).toHaveLength(1);
//     //   expect(findByTestAttr(wrapper, 'itemsList')).toHaveLength(0);
//     //   // expect(findByTestAttr(wrapper, 'addItem')).toHaveLength(1);
//     //   expect(findByTestAttr(wrapper, 'orDivider')).toHaveLength(1);
//     //   expect(findByTestAttr(wrapper, 'itemFileUploader')).toHaveLength(1);
//     //   expect(findByTestAttr(wrapper, 'formClearButton')).toHaveLength(1);
//     //   expect(findByTestAttr(wrapper, 'formSubmitButton')).toHaveLength(1);
//     // });

//     // test('submit button text isUpdateMode=`false`', () => {
//     //   expect(findByTestAttr(wrapper, 'formSubmitButton').html()).toContainHTML(
//     //     'Save',
//     //   );
//     //   expect(findByTestAttr(wrapper, 'formClearButton').text()).toEqual(
//     //     'Clear',
//     //   );
//     // });
//   });

//   //   describe('formData', () => {
//   //     const formData = {
//   //       title: 'testtitle',
//   //       code: 'tt',
//   //       items: ['tt1', 'tt2', 'tt3'],
//   //     };
//   //     wrapper = setUp({
//   //       formData: formData,
//   //     });

//   //     test('title check', () => {
//   //       expect(findByTestAttr(wrapper, 'formTitleInput').text()).toEqual(
//   //         formData.title,
//   //       );
//   //     });

//   //     test('code check', () => {
//   //       expect(findByTestAttr(wrapper, 'formCodeInput').text()).toEqual(
//   //         formData.code,
//   //       );
//   //     });

//   //     test('item list check', () => {
//   //       expect(findByTestAttr(wrapper, 'itemsList')).toHaveLength(
//   //         formData.items.length,
//   //       );
//   //     });
//   //   });
// });

test('temporary test', () => {});
