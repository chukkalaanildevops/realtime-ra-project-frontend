// import React from 'react';
// import { COST_CENTRE_STATE } from '../../../shared/redux/costCentre/costCentre.model';
// import { initialState as state } from '../../../shared/redux/costCentre/costCentre.reducer';
// import { mockStore } from '../../../utils/test.utils';
// import { shallow } from 'enzyme';
// import { FilterOutlined } from '@ant-design/icons';
// import CostCentreConfig from '../../../pages/costCentreConfiguration/costCentreConfiguration.index';

// const initialState: { costCentre: COST_CENTRE_STATE } = {
//   costCentre: {
//     ...state,
//   },
// };

// const setUp = (props = initialState.costCentre) => {
//   const preProps = {
//     ...initialState,
//     costCentre: { ...initialState.costCentre, ...props },
//   };
//   const store = mockStore(preProps);
//   return shallow(<CostCentreConfig store={store} />)
//     .childAt(0)
//     .dive();
// };

// describe('<CostCentreConfig />', () => {
//   test('Render component correctly', () => {
//     const wrapper = setUp();
//     expect(wrapper).toBeTruthy();
//   });

//   test('Render empty component if there are no cost centres', () => {
//     const wrapper = setUp({ costCentres: [] });
//     expect(wrapper.find('Empty').length).toBe(1);
//   });

//   test('Table component should not be render if there are no cost centres', () => {
//     const wrapper = setUp({ costCentres: [] });
//     expect(wrapper.find('Table').length).toBe(0);
//   });

//   test('Render table component if there are records', () => {
//     const wrapper = setUp({ costCentres: [{}] });
//     expect(wrapper.find('Table').length).toBe(1);
//   });

//   test('Render number of rows passed', () => {
//     const wrapper = setUp({ costCentres: [{}, {}, {}, {}] });
//     expect(wrapper.find('Table').prop('dataSource').length).toBe(4);
//   });

//   test('Open filter options on filter icon press', () => {
//     // const wrapper = setUp({
//     //   costCentres: [{ active: true }, { active: false }, { active: true }],
//     // });
//     const wrapper = setUp({ costCentres: [{}] });
//     wrapper.find(FilterOutlined).prop('onClick')();
//     expect(wrapper.find('Modal').length).toBe(1);
//   });
// });

test('temporary test', () => {});
