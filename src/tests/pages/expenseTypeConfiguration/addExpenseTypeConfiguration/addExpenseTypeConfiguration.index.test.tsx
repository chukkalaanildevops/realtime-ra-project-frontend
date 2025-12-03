import React from 'react';
// import { shallow, ShallowWrapper } from 'enzyme';
// import { mockStore, findByTestAttr } from '../../../../utils/test.utils';
import configureStore from 'redux-mock-store';
import ExpenseTypeConfiguration from '../../../../pages/expenseTypeConfiguration/addExpenseTypeConfiguration/addExpenseTypeConfiguration.index';
import { initialState as expenseConfigState } from '../../../../pages/expenseTypeConfiguration/expenseTypeConfiguration.reducer';
import { wageTypeInitialState } from '../../../../shared/redux/wageType/wageType.reducer';
import { initialState as glAccountState } from '../../../../shared/redux/glAccount/glAccount.reducer';
import { initialState as costCentreState } from '../../../../shared/redux/costCentre/costCentre.reducer';
import * as Actions from '../../../../pages/expenseTypeConfiguration/expenseTypeConfiguration.actions';
import * as Models from '../../../../pages/expenseTypeConfiguration/expenseTypeConfiguration.model';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
/**
 * This function returns shallow rendered component
 * @function setUp
 * @param props {object}
 * @returns wrapper {Object}(DOM)
 */

const mockStore = configureStore();

const setUp = (state: any = {}) => {
  const store = mockStore({
    expenseTypeConfiguration: { ...state.expenseTypeConfiguration },
    costCentre: { ...state.costCentre },
    glAccount: { ...state.glAccount },
    WageType: { ...state.WageType },
  });
  const wrapper = render(
    <Provider store={store}>
      <ExpenseTypeConfiguration />
    </Provider>,
  );
  return wrapper;
};

describe('<ExpenseTypeConfiguration>', () => {
  const sampleSavedStoreState: any = {
    activeTabKey: '3',
    expenseUpdateId: '',
    general_data: {
      category: 'General',
      legal_entity: ['Rolling Arrays India'],
      title: 'test',
      code: 'TST',
      is_active: true,
      allow_claims_on: 'Full week',
      can_attach_receipts: true,
      is_receipt_mandatory: true,
      is_display_no_receipt_attached_field: true,
      is_remark_for_no_receipt_mandatory: true,
      is_allow_supporting_documents: true,
      min_amount: 100,
      max_amount: 1000,
      is_setup_maximum_claim_amount_per_period: true,
      period: 'Financial Year',
      amount_per_period: 100,
      is_set_warning_amount: true,
      warning_amount: 1000,
      warning_message: 'Warning!',
      is_allow_remark: true,
      is_remark_mandatory: true,
      is_allow_forex: true,
      is_forex_rate_editable_by_employee: true,
      forex_deviation_percentage: 100,
      is_allow_backdated_claims: true,
      backdated_claim_period_in_days: 365,
      grace_period_in_days: 365,
      is_allow_charging_to_cost_centres: true,
      cost_centres: ['Cost Centre 1'],
      is_allow_claims_against_credit_card: true,
      is_exclude_claims_from_finance_processing: true,
      is_assign_using_rules: true,
      instruction_text:
        '<h1>Test</h1><p><br></p><h2>Testing Testing Testing Testing   kZsjhzdlxA&gt;WKsz;dsxlakW&lt;mszl.</h2><h2>Testing Testing </h2><h2>Testing Testing </h2><h2>Testing Testing </h2><h2>Testing Testing </h2><h2><br></h2>',
      wage_type: 'Hourly Rate',
      gl_account: 'Accounts Payable',
    },
    entertaiment: {
      entertainment_rate_as_of_date: '24/05/2020',
      entertainment_rate_country: '',
      can_have_staff_members: false,
      rate_per_staff_member: 0,
      are_staff_members_mandatory: false,
      can_have_guest_members: false,
      rate_per_guest_member: 0,
      are_guest_members_mandatory: false,
      is_allow_country_selection: false,
      is_allow_updating_entertainment_claims_calculated_amount: false,
    },
    mileage: {
      mileage_rate: 0,
      mileage_rate_as_of_date: '24/05/2020',
      is_allow_updating_mileage_claims_calculated_amount: false,
      is_allow_updating_calculated_mileage: false,
    },
    mileageRatesList: [],
    custom: {
      fields: [
        {
          type: 'TEXT',
          title: 'text_field',
          is_filled_by_admin: true,
          is_required: true,
          sub_type: 'SHORTTEXT',
        },
        {
          type: 'NUMBER',
          title: 'Numbe_field',
          is_filled_by_admin: true,
          is_required: true,
          sub_type: 'NUMBER',
          is_range: false,
          range_min: -1,
          range_max: -1,
          is_decimal_allowed: false,
          precision: -1,
        },
      ],
      layout: [
        [
          {
            title: 'text_field',
          },
        ],
        [
          {
            title: 'Numbe_field',
          },
        ],
      ],
    },
    label: {
      expense_type: {
        default: 'Expense Type',
        mapped: 'New Expense Type',
      },
      expense_date: {
        default: 'Expense Date',
        mapped: 'Expense Date',
      },
      expense_currency: {
        default: 'Expense Currency',
        mapped: 'Expense Currency',
      },
      expense_amount: {
        default: 'Expense Amount',
        mapped: 'Expense Amount',
      },
      conversion_rate: {
        default: 'Conversion Rate',
        mapped: 'Conversion Rate',
      },
      converted_expense_amount: {
        default: 'Converted Expense Amount',
        mapped: 'Converted Expense Amount',
      },
      remark: {
        default: 'Remark',
        mapped: 'Remark',
      },
      receipt: {
        default: 'Receipt',
        mapped: 'Receipt',
      },
      receipt_number: {
        default: 'Receipt Number',
        mapped: 'Receipt Number',
      },
      no_receipt: {
        default: 'No Receipt',
        mapped: 'No Receipt',
      },
      supporting_documents: {
        default: 'Supporting Documents',
        mapped: 'Supporting Documents',
      },
      cost_centre: {
        default: 'Cost Centre',
        mapped: 'Cost Centre',
      },
      paid_by_credit_card: {
        default: 'Paid By Credit Card',
        mapped: 'Paid By Credit Card',
      },
      from: {
        default: 'From',
        mapped: 'From',
      },
      to: {
        default: 'To',
        mapped: 'To',
      },
      auto_calculated_mileage: {
        default: 'Auto-Calculated Mileage',
        mapped: 'Auto-Calculated Mileage',
      },
      mileage_rate: {
        default: 'Mileage Rate',
        mapped: 'Mileage Rate',
      },
      auto_calculated_amount: {
        default: 'Auto-Calculated Amount',
        mapped: 'Auto-Calculated Amount',
      },
      user_provided_amount: {
        default: 'User Provided Amount',
        mapped: 'User Provided Amount',
      },
      toll_charges: {
        default: 'Toll Charges',
        mapped: 'Toll Charges',
      },
      parking_charges: {
        default: 'Parking Charges',
        mapped: 'Parking Charges',
      },
      other_charges: {
        default: 'Other Charges',
        mapped: 'Other Charges',
      },
      is_a_round_trip: {
        default: 'Is A Round Trip',
        mapped: 'Is A Round Trip',
      },
      staff_members: {
        default: 'Staff Members',
        mapped: 'Staff Members',
      },
      staff_person: {
        default: 'Staff Person',
        mapped: 'Staff Person',
      },
      staff_member_organisation: {
        default: 'Staff Member Organisation',
        mapped: 'Staff Member Organisation',
      },
      staff_member_designation: {
        default: 'Staff Member Designation',
        mapped: 'Staff Member Designation',
      },
      guest_members: {
        default: 'Guest Members',
        mapped: 'Guest Members',
      },
      guest_person: {
        default: 'Guest Person',
        mapped: 'Guest Person',
      },
      guest_member_organisation: {
        default: 'Guest Member Organisation',
        mapped: 'Guest Member Organisation',
      },
      guest_member_designation: {
        default: 'Guest Member Designation',
        mapped: 'Guest Member Designation',
      },
    },
    categoryList: [
      {
        code: 'GEN',
        title: 'General',
      },
      {
        code: 'MIL',
        title: 'Mileage',
      },
      {
        code: 'ENT',
        title: 'Entertainment',
      },
    ],
    entityList: [
      {
        created_by: {
          id: 1,
          name: 'Tony Chan',
          email: 'tonychan@mailinator.com',
          username: 'tonychan@mailinator.com',
        },
        created_on: '20-04-2020T07:37:59.699665Z',
        modified_by: {
          id: 1,
          name: 'Tony Chan',
          email: 'tonychan@mailinator.com',
          username: 'tonychan@mailinator.com',
        },
        modified_on: '20-04-2020T07:37:59.699698Z',
        deleted_by: null,
        deleted_on: null,
        is_deleted: false,
        id: 1,
        legal_entity_type: {
          id: 1,
          title: 'Organisation',
          display_text: 'Organisation',
          is_active: false,
        },
        title: 'Rolling Arrays India',
        code: null,
        external_system_id: null,
        financial_year: null,
        timezone: null,
        is_gst_registered: false,
        has_employees: false,
        parents: [],
        uuid: 'klja-klsd-klja-klsd',
      },
      {
        created_by: {
          id: 1,
          name: 'Tony Chan',
          email: 'tonychan@mailinator.com',
          username: 'tonychan@mailinator.com',
        },
        created_on: '20-04-2020T07:38:14.263089Z',
        modified_by: {
          id: 1,
          name: 'Tony Chan',
          email: 'tonychan@mailinator.com',
          username: 'tonychan@mailinator.com',
        },
        modified_on: '20-04-2020T07:38:14.263124Z',
        deleted_by: null,
        deleted_on: null,
        is_deleted: false,
        id: 2,
        legal_entity_type: {
          id: 1,
          title: 'Organisation',
          display_text: 'Organisation',
          is_active: false,
        },
        title: 'Rolling Arrays Singapore',
        code: null,
        external_system_id: null,
        financial_year: null,
        timezone: null,
        is_gst_registered: false,
        has_employees: false,
        parents: [],
        uuid: 'klja-klsd-klja-klsd',
      },
    ],
    maximumClaimAmountPerPeriodDataList: [
      {
        code: 'FINYR',
        title: 'Financial Year',
      },
      {
        code: 'MONTH',
        title: 'Monthly',
      },
      {
        code: 'QUART',
        title: 'Quarterly (Based on FY)',
      },
      {
        code: 'HALFY',
        title: 'Half Yearly (Based on FY)',
      },
    ],
    allowClaimsOn: [
      {
        code: 'WDAYS',
        title: 'Weekdays',
      },
      {
        code: 'WENDS',
        title: 'Weekends',
      },
      {
        code: 'FWEEK',
        title: 'Full week',
      },
    ],
    costCenterList: [
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
    GLAccountList: [
      {
        created_by: {
          id: 1,
          name: 'Tony Chan',
          email: 'tonychan@mailinator.com',
          username: 'tonychan@mailinator.com',
        },
        created_on: '17-04-2020T05:54:33.685787Z',
        modified_by: {
          id: 1,
          name: 'Tony Chan',
          email: 'tonychan@mailinator.com',
          username: 'tonychan@mailinator.com',
        },
        modified_on: '17-04-2020T05:54:33.685834Z',
        deleted_by: null,
        deleted_on: null,
        is_deleted: false,
        id: 3,
        account_number: 'Accounts Payable',
        account_type: {
          code: 'STD',
          title: 'Standard',
        },
      },
      {
        created_by: {
          id: 1,
          name: 'Tony Chan',
          email: 'tonychan@mailinator.com',
          username: 'tonychan@mailinator.com',
        },
        created_on: '17-04-2020T05:54:20.674745Z',
        modified_by: {
          id: 1,
          name: 'Tony Chan',
          email: 'tonychan@mailinator.com',
          username: 'tonychan@mailinator.com',
        },
        modified_on: '17-04-2020T05:54:20.674777Z',
        deleted_by: null,
        deleted_on: null,
        is_deleted: false,
        id: 2,
        account_number: 'Equipment',
        account_type: {
          code: 'STD',
          title: 'Standard',
        },
      },
      {
        created_by: {
          id: 1,
          name: 'Tony Chan',
          email: 'tonychan@mailinator.com',
          username: 'tonychan@mailinator.com',
        },
        created_on: '17-04-2020T05:54:15.306196Z',
        modified_by: {
          id: 1,
          name: 'Tony Chan',
          email: 'tonychan@mailinator.com',
          username: 'tonychan@mailinator.com',
        },
        modified_on: '17-04-2020T05:54:15.306228Z',
        deleted_by: null,
        deleted_on: null,
        is_deleted: false,
        id: 1,
        account_number: 'Inventory',
        account_type: {
          code: 'STD',
          title: 'Standard',
        },
      },
    ],
    wageTypeList: [
      {
        created_by: {
          id: 1,
          name: 'Tony Chan',
          email: 'tonychan@mailinator.com',
          username: 'tonychan@mailinator.com',
        },
        created_on: '17-04-2020T05:50:19.104729Z',
        modified_by: {
          id: 1,
          name: 'Tony Chan',
          email: 'tonychan@mailinator.com',
          username: 'tonychan@mailinator.com',
        },
        modified_on: '17-04-2020T05:50:19.104764Z',
        deleted_by: null,
        deleted_on: null,
        is_deleted: false,
        id: 1,
        title: 'Hourly Rate',
      },
      {
        created_by: {
          id: 1,
          name: 'Tony Chan',
          email: 'tonychan@mailinator.com',
          username: 'tonychan@mailinator.com',
        },
        created_on: '17-04-2020T05:51:56.579755Z',
        modified_by: {
          id: 1,
          name: 'Tony Chan',
          email: 'tonychan@mailinator.com',
          username: 'tonychan@mailinator.com',
        },
        modified_on: '17-04-2020T05:51:56.579799Z',
        deleted_by: null,
        deleted_on: null,
        is_deleted: false,
        id: 2,
        title: 'Incentive Pay',
      },
      {
        created_by: {
          id: 1,
          name: 'Tony Chan',
          email: 'tonychan@mailinator.com',
          username: 'tonychan@mailinator.com',
        },
        created_on: '17-04-2020T05:52:06.514860Z',
        modified_by: {
          id: 1,
          name: 'Tony Chan',
          email: 'tonychan@mailinator.com',
          username: 'tonychan@mailinator.com',
        },
        modified_on: '17-04-2020T05:52:06.514909Z',
        deleted_by: null,
        deleted_on: null,
        is_deleted: false,
        id: 3,
        title: 'Inconvenience Pay',
      },
      {
        created_by: {
          id: 1,
          name: 'Tony Chan',
          email: 'tonychan@mailinator.com',
          username: 'tonychan@mailinator.com',
        },
        created_on: '17-04-2020T05:52:20.164042Z',
        modified_by: {
          id: 1,
          name: 'Tony Chan',
          email: 'tonychan@mailinator.com',
          username: 'tonychan@mailinator.com',
        },
        modified_on: '17-04-2020T05:52:20.164090Z',
        deleted_by: null,
        deleted_on: null,
        is_deleted: false,
        id: 4,
        title: 'Night Shift Premium Flat Rates for 2nd Shift',
      },
      {
        created_by: {
          id: 1,
          name: 'Tony Chan',
          email: 'tonychan@mailinator.com',
          username: 'tonychan@mailinator.com',
        },
        created_on: '17-04-2020T05:52:26.037037Z',
        modified_by: {
          id: 1,
          name: 'Tony Chan',
          email: 'tonychan@mailinator.com',
          username: 'tonychan@mailinator.com',
        },
        modified_on: '17-04-2020T05:52:26.037076Z',
        deleted_by: null,
        deleted_on: null,
        is_deleted: false,
        id: 5,
        title: 'Night Shift Premium Flat Rates for 3rd Shift',
      },
      {
        created_by: {
          id: 1,
          name: 'Tony Chan',
          email: 'tonychan@mailinator.com',
          username: 'tonychan@mailinator.com',
        },
        created_on: '17-04-2020T05:52:36.850678Z',
        modified_by: {
          id: 1,
          name: 'Tony Chan',
          email: 'tonychan@mailinator.com',
          username: 'tonychan@mailinator.com',
        },
        modified_on: '17-04-2020T05:52:36.850711Z',
        deleted_by: null,
        deleted_on: null,
        is_deleted: false,
        id: 6,
        title: 'Procedure Pay',
      },
    ],
    countryList: [
      {
        id: 1,
        title: 'Afghanistan',
        code2: 'AF',
        code3: 'AFG',
      },
      {
        id: 2,
        title: 'Albania',
        code2: 'AL',
        code3: 'ALB',
      },
      {
        id: 3,
        title: 'Algeria',
        code2: 'DZ',
        code3: 'DZA',
      },
      {
        id: 4,
        title: 'American Samoa',
        code2: 'AS',
        code3: 'ASM',
      },
      {
        id: 5,
        title: 'Andorra',
        code2: 'AD',
        code3: 'AND',
      },
    ],
    error: '',
    backendError: {},
    info: '',
    success: '',
    isLoading: false,
    mileage_rates: [],
    entertainment_rates: [],
    rate_type: '',
    tabSwitchConfirmationVisibility: false,
    loadingCategory: false,
    loadingEntity: false,
    loadingAllowClaimsOn: false,
    loadingMaximumClaimAmountPerPeriod: false,
    loadingCostCenter: false,
    loadingGLAccount: false,
    loadingWageType: false,
    loadingCountryList: true,
    loadingLabelMappingList: false,
    compactExpenseTypeLoading: false,
  };
  let wrapper: any;
  /**
   * This functions is useful to create custom store and passes that store to setup().
   * This function store shallow render element inside wrapper variable.
   * In params don't pass full object pass specific key:value in object.
   * @function setCategoryBeforeEach
   * @param {object} general_data
   * @param {object} entertaimentData
   * @param {object} _extraData
   * @returns {void}
   */
  const setCategoryBeforeEach = (
    general_data: any = {},
    entertaimentData: any = {},
    _extraData: any = {},
  ): void => {
    const storeVal = {
      ...expenseConfigState,
      general_data: {
        ...expenseConfigState.general_data,
        ...general_data,
      },
      entertaiment: {
        ...expenseConfigState.entertaiment,
        ...entertaimentData,
      },
      entertainment_rates: [],
      ..._extraData,
    };
    wrapper = setUp(storeVal);
  };

  // describe('Component', () => {
  // describe('<Tab/>', () => {
  //   test('renders without error', () => {
  //     setCategoryBeforeEach();
  //     expect(
  //       findByTestAttr(wrapper, 'ExpenseTypeConfiguration'),
  //     ).toHaveLength(1);
  //   });
  //   test('is rendering tab 1', () => {
  //     setCategoryBeforeEach({}, {}, { activeTabKey: '1' });
  //     expect(findByTestAttr(wrapper, 'tab_1')).toHaveLength(1);
  //   });
  //   test('is rendering tab 2', () => {
  //     setCategoryBeforeEach({}, {}, { activeTabKey: '2' });
  //     expect(findByTestAttr(wrapper, 'tab_2')).toHaveLength(1);
  //   });
  //   test('is rendering tab 3', () => {
  //     setCategoryBeforeEach({}, {}, { activeTabKey: '3' });
  //     expect(findByTestAttr(wrapper, 'tab_3')).toHaveLength(1);
  //   });
  //   test('is rendering tab 4', () => {
  //     setCategoryBeforeEach({}, {}, { activeTabKey: '4' });
  //     expect(findByTestAttr(wrapper, 'tab_4')).toHaveLength(1);
  //   });
  // });

  // describe('<Button />', () => {
  //   test('Adding New Configuration', () => {
  //     setCategoryBeforeEach();
  //     expect(findByTestAttr(wrapper, 'submit')).toHaveLength(1);
  //     expect(findByTestAttr(wrapper, 'clear')).toHaveLength(1);
  //   });
  //   test('updating Configuration', () => {
  //     setCategoryBeforeEach();
  //     wrapper.setProps({ match: { params: { id: 20 } } });
  //     expect(findByTestAttr(wrapper, 'submit')).toHaveLength(1);
  //     // expect(findByTestAttr(wrapper, 'clear')).toHaveLength(0);
  //   });
  // });
  // });

  describe('Testing Actions', () => {
    test('returnUpdateRateTypeAction:: type=`UPDATE_RATE_TYPE`', () => {
      const val: string = 'testing';
      expect(Actions.returnUpdateRateTypeAction(val)).toEqual({
        type: 'UPDATE_RATE_TYPE',
        payload: {
          rate_type: val,
        },
      });
    });

    test('returnUpdateRateTypeAction:: type=`CLEAR_DATA`', () => {
      expect(Actions.returnClearDataAction()).toEqual({
        type: 'CLEAR_DATA',
      });
    });

    test('resetAllExpenseTypeState:: type=`RESET_ALL`', () => {
      expect(Actions.resetAllExpenseTypeState()).toEqual({
        type: 'RESET_ALL',
      });
    });

    test('updateExpenseTypeUpdateIdAndMode:: type=`UPDATE_EXPENSE_UPDATE_ID_AND_MODE`', () => {
      const data: any = {
        id: 'Test',
        mode: 'ADD',
      };
      expect(
        Actions.updateExpenseTypeUpdateIdAndMode(data.id, data.mode),
      ).toEqual({
        type: 'UPDATE_EXPENSE_UPDATE_ID_AND_MODE',
        payload: {
          expenseUpdateId: data.id,
          configMode: data.mode,
        },
      });
    });

    test('updateCustomDataAction:: type=`UPDATE_CUSTOM_DATA`', () => {
      const data: Models.customObjInterface[] = [
        {
          type: 'TEXT',
          sub_type: '',
          title: 'Text',
          is_filled_by_admin: true,
          is_required: true,
          options: ['SHORTTEXT', 'LONGTEXT'],
        },
        {
          type: 'NUMBER',
          title: 'Number',
          options: ['NUMBER', 'PERCENTAGE'],
          is_decimal_allowed: true,
          precision: 6,
          is_range: true,
          sub_type: '',
          range_min: 0,
          range_max: 100,
          is_filled_by_admin: true,
          is_required: true,
        },
      ];
      expect(Actions.updateCustomDataAction(data)).toEqual({
        type: 'UPDATE_CUSTOM_DATA',
        payload: data,
      });
    });

    test('tabKeyUpdateAction:: type=`UPDATE_EXPENSE_TYPE_CONFIG_TAB_ACTIVE_KEY`', () => {
      const data: string = 'test';
      expect(Actions.tabKeyUpdateAction(data)).toEqual({
        type: 'UPDATE_EXPENSE_TYPE_CONFIG_TAB_ACTIVE_KEY',
        payload: { activeTabKey: data },
      });
    });

    test('updateLabelDataAction:: type=`UPDATE_LABEL_DATA`', () => {
      const data: Models.Ilabel = {
        test1: {
          default: 'test1',
          mapped: 'test1',
        },
        test2: {
          default: 'test2',
          mapped: 'test2',
        },
      };
      expect(Actions.updateLabelDataAction(data)).toEqual({
        type: 'UPDATE_LABEL_DATA',
        payload: { label: data },
      });
    });

    describe('updateFormDataInState::', () => {
      test('type=`UPDATE_GENERAL_DATA`', () => {
        const _key: string = 'test';
        const _type: string = 'general';
        const _value: string | boolean | number | string[] = 'Any Value';
        const actionType: string = 'UPDATE_GENERAL_DATA';
        let _payload: any = {};
        if (_key) {
          _payload[_key] = _value;
        }
        expect(Actions.updateFormDataInState(_key, _type, _value)).toEqual({
          type: actionType,
          payload: _payload,
        });
      });

      test('type=`UPDATE_MILEAGE_DATA`', () => {
        const _key: string = 'test';
        const _type: string = 'mileage';
        const _value: string | boolean | number | string[] = 'Any Value';
        const actionType: string = 'UPDATE_MILEAGE_DATA';
        let _payload: any = {};
        if (_key) {
          _payload[_key] = _value;
        }
        expect(Actions.updateFormDataInState(_key, _type, _value)).toEqual({
          type: actionType,
          payload: _payload,
        });
      });

      test('type=`UPDATE_ENTERTAIMENT_DATA`', () => {
        const _key: string = 'test';
        const _type: string = 'entertaiment';
        const _value: string | boolean | number | string[] = 'Any Value';
        const actionType: string = 'UPDATE_ENTERTAIMENT_DATA';
        let _payload: any = {};
        if (_key) {
          _payload[_key] = _value;
        }
        expect(Actions.updateFormDataInState(_key, _type, _value)).toEqual({
          type: actionType,
          payload: _payload,
        });
      });
    });

    test('returnResetGeneralDataAction:: type=``', () => {
      expect(Actions.returnResetGeneralDataAction).toEqual({
        type: 'RESET_GENERAL_DATA',
      });
    });

    test('apiCallRequest type: API_CALL_REQUEST', () => {
      const _payload = {
        data1: true,
        data2: true,
      };
      expect(Actions.apiCallRequest(_payload)).toEqual({
        type: 'API_CALL_REQUEST',
        payload: {
          error: '',
          success: '',
          info: 'Loading Data...',
          isLoading: true,
          ..._payload,
        },
      });
    });

    test('apiCallSuccess type: API_CALL_SUCCESS', () => {
      const _payload = {
        data1: false,
        data2: false,
      };
      const successStr = 'Loaded data';
      expect(Actions.apiCallSuccess(successStr, _payload)).toEqual({
        type: 'API_CALL_SUCCESS',
        payload: {
          error: '',
          success: successStr,
          info: '',
          isLoading: false,
          ..._payload,
        },
      });
    });

    test('apiCallFail type: API_CALL_FAIL', () => {
      const _payload = {
        data1: false,
        data2: false,
      };
      const err = 'Network Error';
      expect(Actions.apiCallFail(err, _payload)).toEqual({
        type: 'API_CALL_FAIL',
        payload: {
          error: err,
          success: '',
          info: '',
          isLoading: false,
          ..._payload,
        },
      });
    });

    test('apiCallReset type: API_CALL_RESET', () => {
      const _payload = {
        data1: false,
        data2: false,
      };
      expect(Actions.apiCallReset(_payload)).toEqual({
        type: 'API_CALL_RESET',
        payload: {
          error: '',
          success: '',
          info: '',
          isLoading: false,
          ..._payload,
        },
      });
    });

    test('saveEntityTypeData type:`UPDATE_ENTITY_LIST`', () => {
      const _payload: Models.IentityList[] = [
        {
          created_by: {
            id: 0,
            name: 'string',
            email: 'user@example.com',
            username: 'string',
          },
          created_on: '2020-05-24T12:36:08Z',
          modified_by: {
            id: 0,
            name: 'string',
            email: 'user@example.com',
            username: 'string',
          },
          modified_on: '2020-05-24T12:36:08Z',
          deleted_by: {
            id: 0,
            name: 'string',
            email: 'user@example.com',
            username: 'string',
          },
          deleted_on: '2020-05-24T12:36:08Z',
          is_deleted: true,
          id: 0,
          legal_entity_type: '',
          title: 'string',
          code: 'string',
          external_system_id: 'string',
          financial_year: 'JANDEC',
          timezone: 'string',
          parent: {
            id: 1,
            created_on: 'string',
            modified_on: 'string',
            deleted_on: 'string',
            is_deleted: true,
            title: 'string',
            code: 'string',
            external_system_id: 'string',
            financial_year: 'string',
            created_by: 1,
            modified_by: 1,
            deleted_by: 1,
            legal_entity_type: 1,
            timezone: 1,
            parent: 1,
          },
        },
      ];
      expect(Actions.saveEntityTypeData(_payload)).toEqual({
        type: 'UPDATE_ENTITY_LIST',
        payload: {
          entityList: _payload,
        },
      });
    });

    test('saveCountryListtData type:`UPDATE_COUNTRY_LIST`', () => {
      const _payload: Models.IcountryListInnerObject[] = [];
      expect(Actions.saveCountryListtData(_payload)).toEqual({
        type: 'UPDATE_COUNTRY_LIST',
        payload: {
          countryList: _payload,
        },
      });
    });

    test('saveCategoryData type:`UPDATE_CATEGORY_LIST`', () => {
      const _payload: Models.IcategoryList[] = [];
      expect(Actions.saveCategoryData(_payload)).toEqual({
        type: 'UPDATE_CATEGORY_LIST',
        payload: {
          categoryList: _payload,
        },
      });
    });

    test('saveMaximumClaimAmountPerPeriodData type:`UPDATE_MAXIMUM_CLAIM_AMOUNT_PER_PERIOD_DATA_LIST`', () => {
      const _payload: Models.ImaximumClaimAmountPerPeriodData[] = [];
      expect(Actions.saveMaximumClaimAmountPerPeriodData(_payload)).toEqual({
        type: 'UPDATE_MAXIMUM_CLAIM_AMOUNT_PER_PERIOD_DATA_LIST',
        payload: {
          maximumClaimAmountPerPeriodDataList: _payload,
        },
      });
    });

    test('saveAllowClaimsOnList type:`UPDATE_ALLOW_CLAIMS_ON_LIST`', () => {
      const _payload: Models.IallowClaimsOn[] = [];
      expect(Actions.saveAllowClaimsOnList(_payload)).toEqual({
        type: 'UPDATE_ALLOW_CLAIMS_ON_LIST',
        payload: {
          allowClaimsOn: _payload,
        },
      });
    });

    test('saveExpenseTypeConfigurationAPIError type:`UPDATE_EXPENSE_TYPE_CONFIGURATION_ERROR`', () => {
      const _payload: any = [];
      expect(Actions.saveExpenseTypeConfigurationAPIError(_payload)).toEqual({
        type: 'UPDATE_EXPENSE_TYPE_CONFIGURATION_ERROR',
        payload: {
          backendError: _payload,
        },
      });
    });

    test('saveLabelMappingList type:`UPDATE_LABEL_DATA`', () => {
      const _payload: any = { test: { default: 'test', mapped: 'test' } };
      expect(Actions.saveLabelMappingList(_payload)).toEqual({
        type: 'UPDATE_LABEL_DATA',
        payload: {
          label: { ..._payload },
        },
      });
    });

    test('tabSwitchConfirmationVisibilityAction type:`UPDATE_TAB_SWITCH_CONFIRMATION_VISIBILITY`', () => {
      const _payload: boolean = true;
      expect(Actions.tabSwitchConfirmationVisibilityAction(_payload)).toEqual({
        type: 'UPDATE_TAB_SWITCH_CONFIRMATION_VISIBILITY',
        payload: {
          tabSwitchConfirmationVisibility: _payload,
        },
      });
    });

    // test('saveExpenseTypeData type:`UPDATE_EDIT_MODE_DATA`', () => {
    //   const data: any = {
    //     created_by: {
    //       id: 1,
    //       name: 'Tony Chan',
    //       email: 'tonychan@mailinator.com',
    //       username: 'tonychan@mailinator.com',
    //     },
    //     created_on: '05-05-2020T10:38:42.646070Z',
    //     modified_by: {
    //       id: 1,
    //       name: 'Tony Chan',
    //       email: 'tonychan@mailinator.com',
    //       username: 'tonychan@mailinator.com',
    //     },
    //     modified_on: '05-05-2020T10:59:36.548711Z',
    //     deleted_by: null,
    //     deleted_on: null,
    //     is_deleted: false,
    //     id: 21,
    //     category: {
    //       code: 'ENT',
    //       title: 'Entertainment',
    //     },
    //     legal_entity: {
    //       id: 1,
    //       legal_entity_type: 'Organisation',
    //       title: 'Rolling Arrays India',
    //     },
    //     title: 'Entertainment Type Configuration',
    //     code: 'ENTERTAINMENT-TYPE-CONFIGURATION',
    //     is_active: false,
    //     allow_claims_on: {
    //       code: 'FWEEK',
    //       title: 'Full week',
    //     },
    //     can_attach_receipts: false,
    //     is_receipt_mandatory: false,
    //     is_display_no_receipt_attached_field: false,
    //     is_remark_for_no_receipt_mandatory: false,
    //     is_allow_supporting_documents: false,
    //     min_amount: '0.0000000000',
    //     max_amount: '0.0000000000',
    //     max_amount_without_receipt: '0.0000000000',
    //     is_setup_maximum_claim_amount_per_period: true,
    //     period: {
    //       code: 'FINYR',
    //       title: 'Financial Year',
    //     },
    //     amount_per_period: '0.0000000000',
    //     is_set_warning_amount: false,
    //     warning_amount: '0.0000000000',
    //     warning_message: '',
    //     is_allow_remark: false,
    //     is_remark_mandatory: false,
    //     is_allow_forex: false,
    //     is_forex_rate_editable_by_employee: false,
    //     forex_deviation_percentage: '0.0000000000',
    //     is_allow_backdated_claims: false,
    //     backdated_claim_period_in_days: 0,
    //     grace_period_in_days: 0,
    //     is_allow_charging_to_cost_centres: false,
    //     cost_centres: [],
    //     is_default_to_employee_cost_centre: false,
    //     is_allow_overseas_cost_centres: false,
    //     is_allow_3rd_party_vendor: false,
    //     is_allow_claims_against_credit_card: false,
    //     is_exclude_claims_from_finance_processing: false,
    //     is_assign_using_rules: false,
    //     instruction_text: '',
    //     wage_type: {
    //       created_by: {
    //         id: 1,
    //         name: 'Tony Chan',
    //         email: 'tonychan@mailinator.com',
    //         username: 'tonychan@mailinator.com',
    //       },
    //       created_on: '17-04-2020T05:50:19.104729Z',
    //       modified_by: {
    //         id: 1,
    //         name: 'Tony Chan',
    //         email: 'tonychan@mailinator.com',
    //         username: 'tonychan@mailinator.com',
    //       },
    //       modified_on: '17-04-2020T05:50:19.104764Z',
    //       deleted_by: null,
    //       deleted_on: null,
    //       is_deleted: false,
    //       id: 1,
    //       title: 'Hourly Rate',
    //     },
    //     gl_account: {
    //       created_by: {
    //         id: 1,
    //         name: 'Tony Chan',
    //         email: 'tonychan@mailinator.com',
    //         username: 'tonychan@mailinator.com',
    //       },
    //       created_on: '17-04-2020T05:54:33.685787Z',
    //       modified_by: {
    //         id: 1,
    //         name: 'Tony Chan',
    //         email: 'tonychan@mailinator.com',
    //         username: 'tonychan@mailinator.com',
    //       },
    //       modified_on: '17-04-2020T05:54:33.685834Z',
    //       deleted_by: null,
    //       deleted_on: null,
    //       is_deleted: false,
    //       id: 3,
    //       account_number: 'Accounts Payable',
    //       account_type: {
    //         code: 'STD',
    //         title: 'Standard',
    //       },
    //     },
    //     custom_fields: {
    //       fields: [],
    //       layout: [],
    //     },
    //     mileage_rates: [],
    //     is_allow_updating_mileage_claims_calculated_amount: false,
    //     entertainment_rates: [
    //       {
    //         id: 1,
    //         rate_per_staff_member: '100.0000000000',
    //         rate_per_guest_member: '400.0000000000',
    //         as_of_date: '05-05-2020',
    //         country: 'Albania',
    //       },
    //     ],
    //     can_have_staff_members: true,
    //     are_staff_members_mandatory: false,
    //     can_have_guest_members: true,
    //     are_guest_members_mandatory: true,
    //     is_allow_country_selection: true,
    //     is_allow_updating_entertainment_claims_calculated_amount: true,
    //     label_mapping: {
    //       to: {
    //         mapped: 'To',
    //         default: 'To',
    //       },
    //       from: {
    //         mapped: 'From',
    //         default: 'From',
    //       },
    //       remark: {
    //         mapped: 'Remark',
    //         default: 'Remark',
    //       },
    //       receipt: {
    //         mapped: 'Receipt',
    //         default: 'Receipt',
    //       },
    //       no_receipt: {
    //         mapped: 'No Receipt',
    //         default: 'No Receipt',
    //       },
    //       cost_centre: {
    //         mapped: 'Cost Centre',
    //         default: 'Cost Centre',
    //       },
    //       expense_date: {
    //         mapped: 'Expense Date',
    //         default: 'Expense Date',
    //       },
    //       expense_type: {
    //         mapped: 'Expense Type',
    //         default: 'Expense Type',
    //       },
    //       guest_person: {
    //         mapped: 'Guest Person',
    //         default: 'Guest Person',
    //       },
    //       mileage_rate: {
    //         mapped: 'Mileage Rate',
    //         default: 'Mileage Rate',
    //       },
    //       staff_person: {
    //         mapped: 'Staff Person',
    //         default: 'Staff Person',
    //       },
    //       toll_charges: {
    //         mapped: 'Toll Charges',
    //         default: 'Toll Charges',
    //       },
    //       guest_members: {
    //         mapped: 'Guest Members',
    //         default: 'Guest Members',
    //       },
    //       other_charges: {
    //         mapped: 'Other Charges',
    //         default: 'Other Charges',
    //       },
    //       staff_members: {
    //         mapped: 'Staff Members',
    //         default: 'Staff Members',
    //       },
    //       expense_amount: {
    //         mapped: 'Expense Amount',
    //         default: 'Expense Amount',
    //       },
    //       receipt_number: {
    //         mapped: 'Receipt Number',
    //         default: 'Receipt Number',
    //       },
    //       conversion_rate: {
    //         mapped: 'Conversion Rate',
    //         default: 'Conversion Rate',
    //       },
    //       is_a_round_trip: {
    //         mapped: 'Is A Round Trip',
    //         default: 'Is A Round Trip',
    //       },
    //       parking_charges: {
    //         mapped: 'Parking Charges',
    //         default: 'Parking Charges',
    //       },
    //       expense_currency: {
    //         mapped: 'Expense Currency',
    //         default: 'Expense Currency',
    //       },
    //       paid_by_credit_card: {
    //         mapped: 'Paid By Credit Card',
    //         default: 'Paid By Credit Card',
    //       },
    //       supporting_documents: {
    //         mapped: 'Supporting Documents',
    //         default: 'Supporting Documents',
    //       },
    //       user_provided_amount: {
    //         mapped: 'User Provided Amount',
    //         default: 'User Provided Amount',
    //       },
    //       auto_calculated_amount: {
    //         mapped: 'Auto-Calculated Amount',
    //         default: 'Auto-Calculated Amount',
    //       },
    //       auto_calculated_mileage: {
    //         mapped: 'Auto-Calculated Mileage',
    //         default: 'Auto-Calculated Mileage',
    //       },
    //       converted_expense_amount: {
    //         mapped: 'Converted Expense Amount',
    //         default: 'Converted Expense Amount',
    //       },
    //       guest_member_designation: {
    //         mapped: 'Guest Member Designation',
    //         default: 'Guest Member Designation',
    //       },
    //       staff_member_designation: {
    //         mapped: 'Staff Member Designation',
    //         default: 'Staff Member Designation',
    //       },
    //       guest_member_organisation: {
    //         mapped: 'Guest Member Organisation',
    //         default: 'Guest Member Organisation',
    //       },
    //       staff_member_organisation: {
    //         mapped: 'Staff Member Organisation',
    //         default: 'Staff Member Organisation',
    //       },
    //     },
    //   };
    //   expect(Actions.saveExpenseTypeData(data)).toEqual({
    //     type: 'UPDATE_EDIT_MODE_DATA',
    //     payload: {
    //       general_data: {
    //         category: data.category.title,
    //         legal_entity: [data.legal_entity.title],
    //         title: data.title,
    //         code: data.code,
    //         is_active: data.is_active,
    //         allow_claims_on: data.allow_claims_on.title,
    //         can_attach_receipts: data.can_attach_receipts,
    //         is_receipt_mandatory: data.is_receipt_mandatory,
    //         is_display_no_receipt_attached_field:
    //           data.is_display_no_receipt_attached_field,
    //         is_remark_for_no_receipt_mandatory:
    //           data.is_remark_for_no_receipt_mandatory,
    //         is_allow_supporting_documents:
    //           data.is_allow_supporting_documents,
    //         min_amount: Number(data.min_amount),
    //         max_amount: Number(data.max_amount),
    //         is_setup_maximum_claim_amount_per_period:
    //           data.is_setup_maximum_claim_amount_per_period,
    //         period: data.period.title,
    //         amount_per_period: Number(data.amount_per_period),
    //         is_set_warning_amount: data.is_set_warning_amount,
    //         warning_amount: Number(data.warning_amount),
    //         warning_message: data.warning_message,
    //         is_allow_remark: data.is_allow_remark,
    //         is_remark_mandatory: data.is_remark_mandatory,
    //         is_allow_forex: data.is_allow_forex,
    //         is_forex_rate_editable_by_employee:
    //           data.is_forex_rate_editable_by_employee,
    //         forex_deviation_percentage: data.forex_deviation_percentage,
    //         is_allow_backdated_claims: data.is_allow_backdated_claims,
    //         backdated_claim_period_in_days: data.backdated_claim_period_in_days,
    //         grace_period_in_days: data.grace_period_in_days,
    //         is_allow_charging_to_cost_centres:
    //           data.is_allow_charging_to_cost_centres,
    //         cost_centres: data.cost_centres.length
    //           ? data.cost_centres.map((o: Models.IcostCenterList) => o.title)
    //           : [],
    //         is_default_to_employee_cost_centre: false,
    //         is_allow_overseas_cost_centres: false,
    //         is_allow_3rd_party_vendor: false,
    //         is_allow_claims_against_credit_card:
    //           data.is_allow_claims_against_credit_card,
    //         is_exclude_claims_from_finance_processing:
    //           data.is_exclude_claims_from_finance_processing,
    //         is_assign_using_rules: data.is_assign_using_rules,
    //         instruction_text: data.instruction_text,
    //         wage_type: data.wage_type.title,
    //         gl_account: data.gl_account.account_number,
    //       },
    //       entertaiment: {
    //         can_have_staff_members: data.can_have_staff_members,
    //         rate_per_staff_member: data.entertainment_rates.length
    //           ? data.entertainment_rates[0].rate_per_staff_member
    //           : 0,
    //         entertainment_rate_as_of_date: data.entertainment_rates.length
    //           ? data.entertainment_rates[0].as_of_date
    //           : '',
    //         are_staff_members_mandatory: data.are_staff_members_mandatory,
    //         can_have_guest_members: data.can_have_staff_members,
    //         rate_per_guest_member: data.entertainment_rates.length
    //           ? data.entertainment_rates[0].rate_per_guest_member
    //           : 0,
    //         entertainment_rate_country: data.entertainment_rates.length
    //           ? data.entertainment_rates[0].country
    //           : '',
    //         are_guest_members_mandatory: data.are_guest_members_mandatory,
    //         is_allow_country_selection: data.is_allow_country_selection,
    //         is_allow_updating_entertainment_claims_calculated_amount:
    //           data.is_allow_updating_entertainment_claims_calculated_amount,
    //       },
    //       mileage: {
    //         mileageRate: data.mileage_rates.length
    //           ? data.mileage_rates[0].rate
    //           : 0,
    //         mileageRateAsOf: data.mileage_rates.length
    //           ? data.mileage_rates[0].as_of_date
    //           : '',
    //         allowUpdatingCalculatedAmount:
    //           data.is_allow_updating_mileage_claims_calculated_amount,
    //       },
    //       mileageRatesList: data.mileage_rates,
    //       custom: data.custom_fields,
    //       label: { ...data.label_mapping },
    //       mileage_rates: [...data.mileage_rates],
    //       entertainment_rates: [...data.entertainment_rates],
    //     },
    //   });
    // });

    //   test('createPostData', () => {
    //     const _payload: Models.IcreatePostDataProps = {
    //       isUpdateMode: false,
    //       general_data: sampleSavedStoreState.general_data,
    //       entertaiment: sampleSavedStoreState.entertaiment,
    //       mileage: sampleSavedStoreState.mileage,
    //       custom: sampleSavedStoreState.custom,
    //       label: sampleSavedStoreState.label,
    //       categoryList: sampleSavedStoreState.categoryList,
    //       entityList: sampleSavedStoreState.entityList,
    //       allowClaimsOn: sampleSavedStoreState.allowClaimsOn,
    //       maximumClaimAmountPerPeriodDataList:
    //         sampleSavedStoreState.maximumClaimAmountPerPeriodDataList,
    //       costCenterList: sampleSavedStoreState.costCenterList,
    //       wageTypeList: sampleSavedStoreState.wageTypeList,
    //       GLAccountList: sampleSavedStoreState.GLAccountList,
    //       countryList: sampleSavedStoreState.countryList,
    //     };
    //     let returnObj = {
    //       ..._payload.general_data,
    //       category: sampleSavedStoreState.categoryList[0].code,
    //       legal_entity: [sampleSavedStoreState.entityList[0].uuid],
    //       allow_claims_on: sampleSavedStoreState.allowClaimsOn[2].code,
    //       period:
    //         sampleSavedStoreState.maximumClaimAmountPerPeriodDataList[0].code,
    //       cost_centres: [sampleSavedStoreState.costCenterList[0].id],
    //       wage_type: sampleSavedStoreState.wageTypeList[0].id,
    //       gl_account: sampleSavedStoreState.GLAccountList[0].id,
    //       custom_fields: _payload.custom,
    //       label_mapping: _payload.label,
    //     };

    //     if (_payload.general_data.category === 'Mileage') {
    //       returnObj = {
    //         ...returnObj,
    //         ..._payload.mileage,
    //       };
    //     } else if (_payload.general_data.category === 'Entertainment') {
    //       returnObj = {
    //         ...returnObj,
    //         ..._payload.entertaiment,
    //       };
    //     }
    //     expect(Actions.createPostData(_payload)).toEqual(returnObj);
    //   });
  });
});
