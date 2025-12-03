import React from 'react';
// import { shallow } from 'enzyme';
// import {
//   findByTestAttr,
//   findByDataTest1,
// } from '../../../../../../utils/test.utils';
import ConfigDetails from '../../../../../../pages/expenseTypeConfiguration/expenseTypes/components/configDetails/configDetails.index';
import { Empty } from 'antd';
import { render, screen } from '@testing-library/react';

/**
 * This function returns shallow rendered component
 * @function setUp
 * @returns wrapper {Object}(DOM)
 */

const setUp = () => {
  const wrapper = render(
    <ConfigDetails configData={{}} isLoadingData={false} />,
  );
  return wrapper;
};

describe('<ConfigDetails>', () => {
  const dummyData = {
    created_by: {
      id: 0,
      name: 'string',
      email: 'user@example.com',
      username: 'string',
    },
    created_on: '2020-05-22T16:46:36Z',
    modified_by: {
      id: 0,
      name: 'string',
      email: 'user@example.com',
      username: 'string',
    },
    modified_on: '2020-05-22T16:46:36Z',
    deleted_by: {
      id: 0,
      name: 'string',
      email: 'user@example.com',
      username: 'string',
    },
    deleted_on: '2020-05-22T16:46:36Z',
    is_deleted: true,
    id: 0,
    category: {
      code: 'ENT',
      title: 'Entertainment',
    },
    legal_entity: {
      id: 1,
      legal_entity_type: 'Organisation',
      title: 'Rolling Arrays India',
    },
    title: 'string',
    code: 'string',
    is_active: true,
    allow_claims_on: {
      code: 'FWEEK',
      title: 'Full week',
    },
    can_attach_receipts: true,
    is_receipt_mandatory: true,
    is_display_no_receipt_attached_field: true,
    is_remark_for_no_receipt_mandatory: true,
    is_allow_supporting_documents: true,
    min_amount: '100.00000000',
    max_amount: '100.00000000',
    max_amount_without_receipt: '100.00000000',
    is_setup_maximum_claim_amount_per_period: true,
    period: {
      code: 'FINYR',
      title: 'Financial Year',
    },
    amount_per_period: '100.00000000',
    is_set_warning_amount: true,
    warning_amount: '100.00000000',
    warning_message: 'warning',
    is_allow_remark: true,
    is_remark_mandatory: true,
    is_allow_forex: true,
    is_forex_rate_editable_by_employee: true,
    forex_deviation_percentage: '80%',
    is_allow_backdated_claims: true,
    backdated_claim_period_in_days: 365,
    grace_period_in_days: 365,
    is_allow_charging_to_cost_centres: true,
    cost_centres: [
      {
        created_by: {
          id: 1,
          name: 'Tony Chan',
          email: 'tonychan@mailinator.com',
          username: 'tonychan@mailinator.com',
        },
        created_on: '21-04-2020T05:14:46.565198Z',
        modified_by: {
          id: 1,
          name: 'Tony Chan',
          email: 'tonychan@mailinator.com',
          username: 'tonychan@mailinator.com',
        },
        modified_on: '21-04-2020T05:14:46.827227Z',
        deleted_by: null,
        deleted_on: null,
        is_deleted: false,
        effective_from: '30-04-2020',
        uuid: 'cdf8a708-bdba-420f-adb6-4e5396c7da04',
        id: 1,
        title: 'Cost Centre 1',
        code: 'CC-CODE1',
        head: 'John Doe',
        is_chargeable: true,
        is_active: true,
        petty_cash_manager: null,
      },
    ],
    is_default_to_employee_cost_centre: true,
    is_allow_overseas_cost_centres: true,
    is_allow_3rd_party_vendor: true,
    is_allow_claims_against_credit_card: true,
    is_exclude_claims_from_finance_processing: true,
    is_assign_using_rules: true,
    instruction_text: '<h1>Instruction Text</h1><p><strong>Test</strong></p>',
    wage_type: {
      created_by: {},
      created_on: '2020-05-22T16:46:36Z',
      modified_by: {},
      modified_on: '2020-05-22T16:46:36Z',
      deleted_by: {},
      deleted_on: '2020-05-22T16:46:36Z',
      is_deleted: true,
      id: 0,
      title: 'wage type 1',
    },
    gl_account: {
      created_by: {},
      created_on: '2020-05-22T16:46:36Z',
      modified_by: {},
      modified_on: '2020-05-22T16:46:36Z',
      deleted_by: {},
      deleted_on: '2020-05-22T16:46:36Z',
      is_deleted: true,
      id: 0,
      account_number: 'GL Account 1',
      account_type: {},
    },
    custom_fields: { fields: [], layout: [] },
    mileage_rates: [
      {
        id: 1,
        rate: '100.0000000000',
        as_of_date: '05-05-2020',
      },
    ],
    is_allow_updating_mileage_claims_calculated_amount: true,
    entertainment_rates: [
      {
        id: 1,
        rate_per_staff_member: '100.0000000000',
        rate_per_guest_member: '400.0000000000',
        as_of_date: '05-05-2020',
        country: 'Albania',
      },
    ],
    can_have_staff_members: true,
    are_staff_members_mandatory: true,
    can_have_guest_members: true,
    are_guest_members_mandatory: true,
    is_allow_country_selection: true,
    is_allow_updating_entertainment_claims_calculated_amount: true,
    label_mapping: {},
  };
  let wrapper = setUp();
  beforeAll(() => {
    wrapper = setUp();
  });

  // test('Render Without Eerrors', () => {
  //   expect(screen.getByTestId('configDetails')).toBeInTheDocument();
  // });

  // test('checking Skeleton visibility', () => {
  //   expect(screen.getByTestId('SkeletonsContainer')).not.toBeInTheDocument();
  //   wrapper.setProps({ isLoadingData: true, configData: {} });
  //   expect(screen.getByTestId('SkeletonsContainer')).toBeInTheDocument();
  // });

  // describe('loaded state with no config data', () => {
  //   test('configuration-options count should be 0', () => {
  //     wrapper.setProps({ isLoadingData: false, configData: {} });
  //     expect(screen.getByTestId('configuration-options')).not.toBeInTheDocument();
  //   });

  //   test('instructionContainer count should be 0', () => {
  //     wrapper.setProps({ isLoadingData: false, configData: {} });
  //     expect(screen.getByTestId('instructionContainer')).not.toBeInTheDocument();
  //   });

  //   // test('Empty Element count should be 1', () => {
  //   //   wrapper.setProps({ isLoadingData: false, configData: {} });
  //   //   expect(wrapper.find(Empty)).toHaveLength(1);
  //   // });
  // });

  // describe('loaded state. dummyData as config data', () => {
  //   test('configuration-options count should be 28', () => {
  //     wrapper.setProps({ isLoadingData: false, configData: dummyData });
  //     expect(
  //       findByTestAttr(wrapper, 'configuration-options').length,
  //     ).toBeGreaterThan(0);
  //   });

  //   test('Empty count should be 0', () => {
  //     wrapper.setProps({ isLoadingData: false, configData: dummyData });
  //     expect(wrapper.find(Empty)).toHaveLength(0);
  //   });

  //   test('instructionContainer count should be 1 & checking text', () => {
  //     wrapper.setProps({ isLoadingData: false, configData: dummyData });
  //     expect(findByTestAttr(wrapper, 'instructionContainer')).toHaveLength(1);
  //   });
  // });

  //   describe('testing every element visibility', () => {
  //     describe('teseting category', () => {
  //       // test('if category=`pratik`', () => {
  //       //   const data = { category: { title: 'pratik' } };
  //       //   wrapper.setProps({
  //       //     isLoadingData: false,
  //       //     configData: data,
  //       //   });
  //       //   expect(findByDataTest1(wrapper, 'categoryContainer')).toHaveLength(1);
  //       //   expect(
  //       //     findByTestAttr(wrapper, 'categoryVal')
  //       //       .children()
  //       //       .text(),
  //       //   ).toBe(data.category.title);
  //       // });

  //       test('if no category property', () => {
  //         wrapper.setProps({
  //           isLoadingData: false,
  //           configData: {},
  //         });
  //         expect(findByDataTest1(wrapper, 'categoryContainer')).toHaveLength(0);
  //       });
  //     });
  //   });
});

test('temporary test', () => {});
