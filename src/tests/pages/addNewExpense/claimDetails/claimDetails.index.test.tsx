import React from 'react';
// import { mount, ReactWrapper } from 'enzyme';
// import { mockStore, findByTestAttr } from '../../../../utils/test.utils';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { intialState as addNewExpenseFormState } from '../../../../pages/addNewExpense/addNewExpense.reducer';
import { initialState as configurationState } from '../../../../pages/configurations/configurations.reducer';
import { initialState as allowanceNewState } from '../../../../pages/addNewExpense/components/allowanceNew/allowanceNew.reducer';
import ClaimDetails from '../../../../pages/addNewExpense/claimDetails/claimDetails.index';
import AddNewExpenseFormReducer from '../../../../../src//pages/addNewExpense/addNewExpense.reducer';
import { BrowserRouter as Router } from 'react-router-dom';
import { render } from '@testing-library/react';
import { ADD_NEW_EXPENSES_ACTIONS } from '../../../../pages/addNewExpense/addNewExpense.actions';

const initialState = {
  AddNewExpenseForm: { ...addNewExpenseFormState },
  configuration: { ...configurationState },
  AllowanceNewReducer: { ...allowanceNewState },
};

const defaultProps = {
  claimId: null,
  isApprovalPage: false,
  isCreatedByVisible: false,
  isAdmin: false,
  _configuration: null,
  isEmployee: false,
};

const setUp = (props: any = initialState, compProps: any = defaultProps) => {
  const preProps = {
    ...initialState,
    AddNewExpenseForm: {
      ...initialState.AddNewExpenseForm,
      ...props.AddNewExpenseForm,
    },
    configuration: {
      ...initialState.configuration,
      ...props.configuration,
    },
  };
  const mockStore = configureStore();
  // const store = mockStore(preProps);

  const preCompProps = {
    ...defaultProps,
    ...compProps,
  };

  const wrapper = render(
    <Router>
      <Provider store={mockStore(preProps)}>
        <ClaimDetails {...preCompProps} />
      </Provider>
    </Router>,
  );
  return wrapper;
};

describe('Testing ClaimDetails Component', () => {
  let wrapper: any;

  test('should render initial layout', () => {
    wrapper = setUp();
    expect(wrapper.asFragment()).toMatchSnapshot();
  });

  // test('should render GetDetailComponent by default', () => {
  //   wrapper = setUp();
  //   expect(wrapper.getByText('GetDetailComponent')).toBeInTheDocument();
  // });

  test('should render GetSkeleton Component', () => {
    wrapper = setUp({
      AddNewExpenseForm: {
        isLoading: true,
      },
    });
    expect(wrapper.getByTestId('skeleton-container')).toBeInTheDocument();
  });

  describe('Testing Traffic Light v2', () => {
    test('should render Policy violation', () => {
      const expenseClaimViolationFetchedData =
        addNewExpenseFormState?.expenseClaimViolationFetchedData;
      expect(
        AddNewExpenseFormReducer(addNewExpenseFormState, {
          type:
            ADD_NEW_EXPENSES_ACTIONS.SAVE_EXPENSE_CLAIM_VOILATION_FETCHED_DATA,
          payload: expenseClaimViolationFetchedData,
        }),
      ).toEqual({
        ...addNewExpenseFormState,
        expenseClaimViolationFetchedData: expenseClaimViolationFetchedData,
      });
    });

    // test('should render approval-risk-container', () => {
    //   wrapper = setUp(
    //     {
    //       AddNewExpenseForm: {
    //         isLoading: false,
    //         expenseClaimViolationFetchedData: {
    //           flag_score: '67.00',
    //           flag_color: 'ORA',
    //           violated_policy_details: {
    //             data: [
    //               {
    //                 policy_id: 5,
    //                 policy_title: 'Override Receipt-mandatory Check',
    //                 msg_for_approver: 'target configuration 2',
    //                 msg_for_employee: '',
    //                 msg_for_finance_admin: '',
    //                 is_show_flag_to_approver: true,
    //                 is_show_flag_to_employee: true,
    //                 is_show_flag_to_finance_admin: true,
    //               },
    //             ],
    //           },
    //         },
    //         configuration: {},
    //         activeTabKey: {},
    //       },
    //       configuration: {
    //         tenantConfig: [{ is_enabled_traffic_lights: true }],
    //         isEnableTrafficLightFeatureForTenantFeatures: true,
    //       },
    //     },
    //     { isApprovalPage: true, isAdmin: true, isEmployee: true },
    //   );
    //   // const getDetailComp = wrapper.find('GetDetailCompoent');
    //   // expect(wrapper.getByText('approval-risk-container')).toBeInTheDocument();
    //   // expect(wrapper.find('GetDetailComponent')).toMatchSnapshot();
    // });
    // });
  });

  // describe('Testing GetDetailComponent', () => {
  //   test('should render null for default props', () => {
  //     wrapper = setUp();
  //     // expect(wrapper.find('GetDetailComponent').render()).toHaveLength(0);
  //     expect(wrapper.getByText('GetDetailComponent').isEmptyRender()).toBe(true);
  //   });

  //   test('should render approval-risk-container', () => {
  //       wrapper = setUp({
  //           AddNewExpenseForm: {
  //               expenseClaimFetchedData: {
  //                   flag_color: 'RED',
  //               },
  //               configuration: {}
  //           },
  //           configuration: {
  //               tenantConfig: [{ is_enabled_traffic_lights: true }]
  //           }
  //       }, { isApprovalPage: true }
  //       )
  //       const getDetailComp = wrapper.find('GetDetailCompoent');
  //       expect(wrapper.getByText('approval-risk-container')).toBeInTheDocument();
  //       // expect(wrapper.find('GetDetailComponent')).toMatchSnapshot();
  //   })
  // });
});
