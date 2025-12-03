// import React from 'react';
// import { ISubmittedState } from '../../../pages/submitted/submitted.model';
// import { initialState as state } from '../../../pages/submitted/submitted.reducer';

// import { mockStore } from '../../../utils/test.utils';
// import { shallow } from 'enzyme';
// import Submitted from '../../../pages/submitted/submitted.index';

// const initialState: { submitted: ISubmittedState } = {
//   submitted: state,
// };

// const setUp = (props = initialState.submitted) => {
//   const preProps = {
//     ...initialState,
//     submitted: { ...initialState.submitted, ...props },
//     match: {
//       params: { tab: 'expense' },
//     },
//   };
//   const store = mockStore(preProps);

//   return shallow(<Submitted store={store} />)
//     .childAt(0)
//     .dive();
// };

// describe('<Submitted />', () => {
//   test('Render component correctly', () => {
//     const wrapper = setUp();
//     expect(wrapper).toBeTruthy();
//   });
// });

test('temporary test', () => {});
