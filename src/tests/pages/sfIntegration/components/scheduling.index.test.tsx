// import React from 'react';

// import Scheduling from '../../../../pages/sfIntegration/components/scheduling.index';
// import { ISFIntegrationState } from '../../../../pages/sfIntegration/sfIntegration.model';
// import { initialState as state } from '../../../../pages/sfIntegration/sfIntegration.reducer';
// import { mockStore, findByTestAttr } from '../../../../utils/test.utils';
// import { shallow } from 'enzyme';

// const initialState: {
//   sfIntegration: ISFIntegrationState;
//   setup: any;
// } = {
//   sfIntegration: {
//     ...state,
//   },
//   setup: {
//     tenantConfig: [{ time_zone: { title: 'My Testing Timezone' } }],
//     ftpRecords: [],
//   },
// };

// const setUp = (props = initialState.sfIntegration) => {
//   const preProps = {
//     ...initialState,
//     sfIntegration: { ...initialState.sfIntegration, ...props },
//   };

//   const store = mockStore(preProps);
//   return shallow(<Scheduling.WrappedComponent store={store} />)
//     .childAt(0)
//     .dive();
//   // .childAt(0);
// };

// describe('<SFIntegration -- Scheduling />', () => {
//   test('SF Integration Scheduling renders correctly', () => {
//     const wrapper = setUp();
//     expect(wrapper).toBeTruthy();
//   });
// });

test('temporary test', () => {});
