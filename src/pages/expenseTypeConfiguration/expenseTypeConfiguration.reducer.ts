import * as Actions from './expenseTypeConfiguration.actions';
import {
  IExpandedItem,
  IinitialexpenseTypeConfigurationState,
} from './expenseTypeConfiguration.model';
// import moment from 'moment';

export const initialState: IinitialexpenseTypeConfigurationState = {
  initialExpenseCostCenterForLegalEntity: [],
  expandedItem: {} as IExpandedItem,
  cost_centres_for_legal_entity: [],
  is_cc_value_updated: false,
  expenseTypes: [
    {
      id: 1,
      created_on: '26/06/2020T09:28:41.046414Z',
      modified_on: '26/06/2020T09:28:41.046442Z',
      created_by: {
        id: 3,
        name: 'Aaron Apple',
        email: 'aaron_apple@gmail.com',
        username: 'aaron_apple@gmail.com',
      },
      title: 'Medical Expenses',
      code: 'MEDICAL',
      category: { code: 'GEN', title: 'General' },
      global_configuration: 1,
    },
    {
      id: 2,
      created_on: '26/06/2020T09:28:41.046414Z',
      modified_on: '26/06/2020T09:28:41.046442Z',
      created_by: {
        id: 3,
        name: 'Aaron Apple',
        email: 'aaron_apple@gmail.com',
        username: 'aaron_apple@gmail.com',
      },
      title: 'Medical Expenses',
      code: 'MEDICAL',
      category: { code: 'GEN', title: 'General' },
      global_configuration: 1,
    },
    {
      id: 3,
      created_on: '26/06/2020T09:28:41.046414Z',
      modified_on: '26/06/2020T09:28:41.046442Z',
      created_by: {
        id: 3,
        name: 'Aaron Apple',
        email: 'aaron_apple@gmail.com',
        username: 'aaron_apple@gmail.com',
      },
      title: 'Medical Expenses',
      code: 'MEDICAL',
      category: { code: 'GEN', title: 'General' },
      global_configuration: 1,
    },
    {
      id: 4,
      created_on: '26/06/2020T09:28:41.046414Z',
      modified_on: '26/06/2020T09:28:41.046442Z',
      created_by: {
        id: 3,
        name: 'Aaron Apple',
        email: 'aaron_apple@gmail.com',
        username: 'aaron_apple@gmail.com',
      },
      title: 'Medical Expenses',
      code: 'MEDICAL',
      category: { code: 'GEN', title: 'General' },
      global_configuration: 1,
    },
  ],
  item: {},
  viewClicked: false,
  compactExpenseTypeLoading: false,
  expenseTypeDetailLoading: false,
  titleUpdateConfigData: {
    id: null,
    title: '',
    code: '',
  },

  activeTabKey: '1',
  configMode: 'ADD',
  expenseUpdateId: '',
  expenseUpdateConfigurationId: '',
  customizeEntityUUID: '',
  general_data: {
    initialExpenseCostCenterForLegalEntity: '',
    category: 'General',
    legal_entity: [],
    title: '',
    code: '',
    is_active: false,
    allow_claims_on: 'Full week',
    can_attach_receipts: false,
    is_receipt_mandatory: false,
    is_display_no_receipt_attached_field: false,
    is_remark_for_no_receipt_mandatory: false,
    is_allow_supporting_documents: false,
    min_amount: null,
    max_amount: null,
    is_setup_maximum_claim_amount_per_period: false,
    period: '',
    expandedItem: {} as IExpandedItem,
    // period: 'Financial Year', //backend expecting code on post
    amount_per_period: 0,
    is_set_warning_amount: false,
    warning_amount: 0,
    warning_message: '',
    is_allow_purpose: false,
    is_purpose_mandatory: false,
    is_allow_forex: false,
    is_forex_rate_editable_by_employee: false,
    forex_deviation_percentage: 0,
    is_allow_backdated_claims: false,
    backdated_claim_period_in_days: 0,
    resubmission_period_after_rejection_in_days: 0,
    is_default_to_entity_cost_centre: false,
    grace_period_in_days: 0,
    tax_percentage_as_of_date: null,
    tax_percentages: 0,
    is_allow_updating_tax_amount: false,
    is_auto_populate_tax_amount: true,
    is_allow_charging_to_cost_centres: false,
    cost_centres: [],

    local_cc_threshold_amount: 0,
    overseas_cc_threshold_amount: 0,
    is_employee_cost_centre_readonly: false,
    is_allow_overseas_cost_centres: false,
    is_allow_3rd_party_vendor: false,
    is_allow_claims_against_credit_card: false,
    is_exclude_claims_from_finance_processing: false,
    is_assign_using_rules: false,
    instruction_text: '',
    wage_type: '', //backend expecting id on post
    gl_account: '',
  },
  entertaiment: {
    // entertainment_rate_as_of_date: moment().format('DD/MM/YYYY'),
    entertainment_rate_as_of_date: null,
    entertainment_rate_country: '',
    can_have_staff_members: false,
    rate_per_staff_member: undefined,
    are_staff_members_mandatory: false,
    can_have_guest_members: false,
    rate_per_guest_member: undefined,
    are_guest_members_mandatory: false,
    is_allow_country_selection: false,
    is_allow_updating_entertainment_claims_calculated_amount: false,
    is_entertainment_rates_defined: false,
  },
  mileage: {
    mileage_rate: undefined,
    mileage_rate_as_of_date: null,
    // mileage_rate_as_of_date: moment().format('DD/MM/YYYY'),
    is_allow_updating_mileage_claims_calculated_amount: false,
    is_allow_updating_calculated_mileage: false,
    mileage_rates: [{ upto_distance: null, rate: null }],
    total_mileage_rates: [],
  },
  pettyCash: {
    is_allow_voucher_number: false,
  },
  allowance: {
    expense_type_allowance_rates: [],
    is_allow_allowance_rate_enabled: false,
    is_allow_updating_no_of_days: false,
  },
  mileageRatesList: [],
  custom: { fields: [], layout: [] },
  label: {},
  categoryList: [],
  entityList: [],
  allowanceExpenseTypes: [],
  allowanceRateExpenseTypes: [],
  maximumClaimAmountPerPeriodDataList: [],
  allowClaimsOn: [],
  countryList: [],
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
  loadingCountryList: false,
  loadingLabelMappingList: false,
  loadingConfigurationData: false,
  detailsId: '',
  expense_type_allowance_rates: [],
  expenseTypeEntityList: [
    {
      id: 10,
      expense_type: 5,
      is_active: true,
      custom_configuration: null,
      global_configuration: 8,
      legal_entity: {
        created_by: {
          id: 3,
          name: 'Aaron Apple',
          email: 'aaron_apple@gmail.com',
          username: 'aaron_apple@gmail.com',
        },
        created_on: '02/06/2020T11:58:14.905161Z',
        modified_by: {
          id: 3,
          name: 'Aaron Apple',
          email: 'aaron_apple@gmail.com',
          username: 'aaron_apple@gmail.com',
        },
        modified_on: '03/06/2020T06:00:27.237505Z',
        deleted_by: null,
        deleted_on: null,
        is_deleted: false,
        id: 22,
        legal_entity_type: {
          id: 4,
          title: 'Division',
          display_text: 'Division',
          is_active: true,
        },
        title: 'Zoom Vietnam-DIV4',
        code: 'ZOOM-DIV4',
        external_system_id: null,
        financial_year: null,
        timezone: null,
        is_gst_registered: false,
        has_employees: false,
        effective_from: '15/11/2000',
        uuid: '0eee7d28-dcdf-4ac0-b40d-45b192f46877',
        is_active: true,
      },
    },
    {
      id: 11,
      expense_type: 5,
      is_active: true,
      custom_configuration: null,
      global_configuration: 8,
      legal_entity: {
        created_by: {
          id: 3,
          name: 'Aaron Apple',
          email: 'aaron_apple@gmail.com',
          username: 'aaron_apple@gmail.com',
        },
        created_on: '02/06/2020T11:58:14.806391Z',
        modified_by: {
          id: 3,
          name: 'Aaron Apple',
          email: 'aaron_apple@gmail.com',
          username: 'aaron_apple@gmail.com',
        },
        modified_on: '30/06/2020T03:51:15.779212Z',
        deleted_by: null,
        deleted_on: null,
        is_deleted: false,
        id: 11,
        legal_entity_type: {
          id: 3,
          title: 'Business Unit',
          display_text: 'Business Team',
          is_active: true,
        },
        title: 'Zoom Malaysia-BU3',
        code: 'ZOOM-BU3',
        external_system_id: null,
        financial_year: null,
        timezone: null,
        is_gst_registered: false,
        has_employees: false,
        effective_from: '12/01/2010',
        uuid: 'ab1003cc-8da3-4648-a62e-ee59425fe1a9',
        is_active: true,
      },
    },
    {
      id: 12,
      expense_type: 5,
      is_active: true,
      custom_configuration: null,
      global_configuration: 8,
      legal_entity: {
        created_by: {
          id: 3,
          name: 'Aaron Apple',
          email: 'aaron_apple@gmail.com',
          username: 'aaron_apple@gmail.com',
        },
        created_on: '02/06/2020T11:58:14.853179Z',
        modified_by: {
          id: 3,
          name: 'Aaron Apple',
          email: 'aaron_apple@gmail.com',
          username: 'aaron_apple@gmail.com',
        },
        modified_on: '30/06/2020T03:51:15.861489Z',
        deleted_by: null,
        deleted_on: null,
        is_deleted: false,
        id: 16,
        legal_entity_type: {
          id: 5,
          title: 'Department',
          display_text: 'Department',
          is_active: true,
        },
        title: 'Zoom Malaysia-DP3',
        code: 'ZOOM-DP3',
        external_system_id: null,
        financial_year: null,
        timezone: null,
        is_gst_registered: false,
        has_employees: false,
        effective_from: '12/01/2010',
        uuid: '280eee0a-36dd-4fc4-987a-844003b2856f',
        is_active: true,
      },
    },
    {
      id: 13,
      expense_type: 5,
      is_active: true,
      custom_configuration: null,
      global_configuration: 8,
      legal_entity: {
        created_by: {
          id: 3,
          name: 'Aaron Apple',
          email: 'aaron_apple@gmail.com',
          username: 'aaron_apple@gmail.com',
        },
        created_on: '02/06/2020T11:58:14.839859Z',
        modified_by: {
          id: 3,
          name: 'Aaron Apple',
          email: 'aaron_apple@gmail.com',
          username: 'aaron_apple@gmail.com',
        },
        modified_on: '30/06/2020T03:51:15.835742Z',
        deleted_by: null,
        deleted_on: null,
        is_deleted: false,
        id: 14,
        legal_entity_type: {
          id: 5,
          title: 'Department',
          display_text: 'Department',
          is_active: true,
        },
        title: 'Zoom India-DP1',
        code: 'ZOOM-DP1',
        external_system_id: null,
        financial_year: null,
        timezone: null,
        is_gst_registered: false,
        has_employees: false,
        effective_from: '12/01/2000',
        uuid: 'f8d60e4a-0e5a-470c-9eb3-eb0d2ae40c06',
        is_active: true,
      },
    },
    {
      id: 14,
      expense_type: 5,
      is_active: true,
      custom_configuration: null,
      global_configuration: 8,
      legal_entity: {
        created_by: {
          id: 1,
          name: 'Tony Chan',
          email: 'tonychan@mailinator.com',
          username: 'tonychan@mailinator.com',
        },
        created_on: '20/04/2020T07:37:59.699665Z',
        modified_by: {
          id: 1,
          name: 'Tony Chan',
          email: 'tonychan@mailinator.com',
          username: 'tonychan@mailinator.com',
        },
        modified_on: '20/04/2020T07:37:59.699698Z',
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
        effective_from: '25/05/2020',
        uuid: 'd3c9a167-a912-49d4-a316-fe9e7f0a0350',
        is_active: true,
      },
    },
  ],
  loadingExpenseTypeEntityList: false,
  addEntityModelVisibility: false,
  confirmationInfo: {
    visibility: false,
    headerText: undefined,
    bodyText: undefined,
    forWhat: '',
    okText: undefined,
    cancelText: undefined,
    extraInfo: null,
  },
  pagination: {
    pageNo: 1,
    maxPageCount: 1, // not in use
  },
  isSaveResumeState: false,
  resumeState: {},
  listingFilterdata: {
    title: [],
    isActive: [],
    category: [],
  },
  entityCostCenterLoader: false,
  entityCostCenterList: [],
};

interface ActionPayloadInterface {
  type: string;
  payload: any;
}

const ExpenseTypeConfigurationReducer = (
  state = initialState,
  ActionPayload: ActionPayloadInterface,
): IinitialexpenseTypeConfigurationState => {
  const type: string = ActionPayload.type as string;
  const payload: any = ActionPayload.payload as Object;
  switch (type) {
    case Actions.UPDATE_EXPENSE_TYPE:
    case Actions.UPDATE_VIEW_STATE:
    case Actions.UPDATE_ITEM:
    case Actions.API_CALL_REQUEST:
    case Actions.API_CALL_RESET:
    case Actions.API_CALL_SUCCESS:
    case Actions.API_CALL_FAIL:
    case Actions.UPDATE_EXPENSE_UPDATE_ID_AND_MODE:
    case Actions.UPDATE_EXPENSE_TYPE_CONFIG_TAB_ACTIVE_KEY:
    case Actions.UPDATE_LABEL_DATA:
    case Actions.UPDATE_CATEGORY_LIST:
    case Actions.UPDATE_ENTITY_LIST:
    case Actions.EXPENSE_TYPE_CONFIG_ALLOWANCE_ACTION_TYPES:
    case Actions.UPDATE_COST_CENTER_LIST:
    case Actions.UPDATE_MAXIMUM_CLAIM_AMOUNT_PER_PERIOD_DATA_LIST:
    case Actions.UPDATE_COUNTRY_LIST:
    case Actions.UPDATE_ALLOW_CLAIMS_ON_LIST:
    case Actions.UPDATE_EXPENSE_TYPE_CONFIGURATION_CREATION_DATA:
    case Actions.UPDATE_EXPENSE_TYPE_CONFIGURATION_ERROR:
    case Actions.UPDATE_RATE_TYPE:
    case Actions.UPDATE_TAB_SWITCH_CONFIRMATION_VISIBILITY:
    case Actions.EXPENSE_TYPE_CONFIG_ALLOWANCE_RATE_ACTION_TYPES:
      return {
        ...state,
        ...payload,
      };
    case Actions.RESET_TO_INITIAL:
      return {
        ...initialState,
        resumeState: state.resumeState,
      };
    case Actions.UPDATE_EDIT_MODE_DATA:
      return {
        ...state,
        ...payload,
      };

    case Actions.SET_EXPENCE_TYPE_ALLOWANCE_RATES:
      return {
        ...state,
        expense_type_allowance_rates: payload,
      };

    case Actions.UPDATE_CUSTOM_DATA:
      return {
        ...state,
        custom: payload,
      };
    case Actions.UPDATE_GENERAL_DATA:
      return {
        ...state,
        general_data: {
          ...state.general_data,
          ...payload,
        },
      };
    case Actions.UPDATE_ENTERTAIMENT_DATA:
      return {
        ...state,
        entertaiment: {
          ...state.entertaiment,
          ...payload,
        },
      };
    case Actions.UPDATE_PETTY_CASH_DATA:
      return {
        ...state,
        pettyCash: {
          ...state.pettyCash,
          ...payload,
        },
      };
    case Actions.UPDATE_MILEAGE_DATA:
      return {
        ...state,
        mileage: {
          ...state.mileage,
          ...payload,
        },
      };
    case Actions.UPDATE_ALLOWANCE_DATA:
      return {
        ...state,
        allowance: {
          ...state.allowance,
          ...payload,
        },
      };
    case Actions.RESET_GENERAL_DATA:
      return {
        ...state,
        general_data: initialState.general_data,
      };
    case Actions.RESET_ENTERTAIMENT_DATA:
      return {
        ...state,
        entertaiment: initialState.entertaiment,
      };
    case Actions.RESET_MILEAGE_DATA:
      return {
        ...state,
        mileage: initialState.mileage,
      };
    case Actions.CLEAR_DATA:
      return {
        ...state,
        general_data: initialState.general_data,
        mileage: initialState.mileage,
        entertaiment: initialState.entertaiment,
        custom: { fields: [], layout: [] },
        label: Actions.resetLableObject(state.label),
        activeTabKey: initialState.activeTabKey,
        error: '',
        backendError: {},
        info: '',
        success: '',
        isLoading: false,
      };
    case Actions.RESET_ALL:
      return {
        ...initialState,
        resumeState: state.resumeState,
      };
    case Actions.SET_RESUME_STATE:
      return {
        ...state,
        resumeState: {
          ...state.resumeState,
          pagination: state.pagination,
          listingFilterdata: state.listingFilterdata,
        },
      };
    case Actions.SET_RESUME_STATE_TO_REDUCER:
      return {
        ...state,
        ...state.resumeState,
        isSaveResumeState: false,
      };
    case Actions.SET_IS_SAVE_RESUME_STATE_TRUE:
      return {
        ...state,
        isSaveResumeState: true,
      };
    case Actions.RESET_SETUP_MAXIMUM_CLAIM_AMOUNT_PER_PERIOD_SUB_OPTIONS:
      return {
        ...state,
        general_data: {
          ...state.general_data,
          period: initialState.general_data.period,
          amount_per_period: initialState.general_data.amount_per_period,
        },
      };
    case Actions.RESET_SET_WARNING_AMOUNT_SUB_OPTIONS:
      return {
        ...state,
        general_data: {
          ...state.general_data,
          warning_amount: initialState.general_data.warning_amount,
          warning_message: initialState.general_data.warning_message,
        },
      };
    case Actions.RESET_CAN_ATTACH_RECEIPT_SUB_OPTIONS:
      return {
        ...state,
        general_data: {
          ...state.general_data,
          is_receipt_mandatory: initialState.general_data.is_receipt_mandatory,
          is_display_no_receipt_attached_field:
            initialState.general_data.is_display_no_receipt_attached_field,
          is_remark_for_no_receipt_mandatory:
            initialState.general_data.is_remark_for_no_receipt_mandatory,
        },
      };
    case Actions.RESET_IS_RECEIPT_MANDATORY_SUB_OPTIONS:
      return {
        ...state,
        general_data: {
          ...state.general_data,
          is_display_no_receipt_attached_field:
            initialState.general_data.is_display_no_receipt_attached_field,
          is_remark_for_no_receipt_mandatory:
            initialState.general_data.is_remark_for_no_receipt_mandatory,
        },
      };
    case Actions.RESET_ALLOW_REMARK_SUB_OPTIONS:
      return {
        ...state,
        general_data: {
          ...state.general_data,
          is_purpose_mandatory: initialState.general_data.is_purpose_mandatory,
        },
      };
    case Actions.RESET_ALLOW_FOREX_SUB_OPTIONS:
      return {
        ...state,
        general_data: {
          ...state.general_data,
          is_forex_rate_editable_by_employee:
            initialState.general_data.is_forex_rate_editable_by_employee,
          forex_deviation_percentage:
            initialState.general_data.forex_deviation_percentage,
          // tax_percentage: initialState.general_data.tax_percentage,
        },
      };
    case Actions.RESET_ALLOW_BACKDATED_CLAIMS_SUB_OPTIONS:
      return {
        ...state,
        general_data: {
          ...state.general_data,
          backdated_claim_period_in_days:
            initialState.general_data.backdated_claim_period_in_days,
        },
      };
    case Actions.RESET_ALLOW_CHARGING_TO_COST_CENTRES_SUB_OPTIONS:
      return {
        ...state,
        general_data: {
          ...state.general_data,
          is_employee_cost_centre_readonly: false,
          is_allow_overseas_cost_centres: false,
          is_allow_internal_order_cost_centres: false,
          is_allow_3rd_party_vendor: false,
          overseas_cc_threshold_amount: 0,
          local_cc_threshold_amount: 0,
          // cost_centres: initialState.general_data.cost_centres,
        },
      };
    case Actions.RESET_OVERSEAS_AND_LOCAL_THRESHOLD_AMOUNT:
      return {
        ...state,
        general_data: {
          ...state.general_data,
          overseas_cc_threshold_amount: 0,
          local_cc_threshold_amount: 0,
        },
      };
    case Actions.RESET_OVERSEAS_COST_CENTRE_SUB_OPTIONS:
      return {
        ...state,
        general_data: {
          ...state.general_data,
          overseas_cc_threshold_amount: 0,
        },
      };
    case Actions.RESET_IS_ENTERTAINMENT_RATES_DEFINED_SUB_OPTIONS:
      return {
        ...state,
        entertaiment: {
          ...state.entertaiment,
          rate_per_staff_member:
            initialState.entertaiment.rate_per_staff_member,
          rate_per_guest_member:
            initialState.entertaiment.rate_per_guest_member,
        },
      };
    case Actions.RESET_CAN_HAVE_STAFF_MEMBERS_SUB_OPTIONS:
      return {
        ...state,
        entertaiment: {
          ...state.entertaiment,
          are_staff_members_mandatory:
            initialState.entertaiment.are_staff_members_mandatory,
          rate_per_staff_member:
            initialState.entertaiment.rate_per_staff_member,
          entertainment_rate_as_of_date: state.entertaiment
            .can_have_guest_members
            ? state.entertaiment.entertainment_rate_as_of_date
            : initialState.entertaiment.entertainment_rate_as_of_date,
          entertainment_rate_country: state.entertaiment.can_have_guest_members
            ? state.entertaiment.entertainment_rate_country
            : initialState.entertaiment.entertainment_rate_country,
        },
      };
    case Actions.RESET_CAN_HAVE_GUEST_MEMBERS_SUB_OPTIONS:
      return {
        ...state,
        entertaiment: {
          ...state.entertaiment,
          are_guest_members_mandatory:
            initialState.entertaiment.are_guest_members_mandatory,
          rate_per_guest_member:
            initialState.entertaiment.rate_per_guest_member,
          entertainment_rate_as_of_date: state.entertaiment
            .can_have_staff_members
            ? state.entertaiment.entertainment_rate_as_of_date
            : initialState.entertaiment.entertainment_rate_as_of_date,
          entertainment_rate_country: state.entertaiment.can_have_staff_members
            ? state.entertaiment.entertainment_rate_country
            : initialState.entertaiment.entertainment_rate_country,
        },
      };
    case Actions.SHOW_LOADER:
      return {
        ...state,
        isLoading: true,
      };
    case Actions.HIDE_LOADER:
      return {
        ...state,
        isLoading: false,
      };
    case Actions.UPDATE_DETAILS_ID:
      return {
        ...state,
        detailsId: payload,
      };
    case Actions.UPDATE_EXPENSE_TYPE_ENTITY_LIST:
      return {
        ...state,
        expenseTypeEntityList: payload,
      };
    case Actions.UPDATE_ADD_ENTITY_MODEL_VISIBILITY:
      return {
        ...state,
        addEntityModelVisibility: payload,
      };
    case Actions.UPDATE_CONFIRMATION_INFO:
      return {
        ...state,
        confirmationInfo: {
          ...initialState.confirmationInfo,
          ...payload,
        },
      };
    case Actions.RESET_CONFIRMATION_INFO:
      return {
        ...state,
        confirmationInfo: initialState.confirmationInfo,
      };
    case Actions.UPDATE_PAGINATION:
      return {
        ...state,
        pagination: payload,
      };
    case Actions.SET_TITLE_UPDATE_CONFIG_DATA:
      return {
        ...state,
        titleUpdateConfigData: payload,
      };
    case Actions.UPDATE_LISTING_FILTER_DATA:
      return {
        ...state,
        listingFilterdata: {
          ...state.listingFilterdata,
          ...payload,
        },
      };
    case Actions.UPDATE_COST_CENTER_FOR_ENTITY:
      let updatedData = state.cost_centres_for_legal_entity;
      updatedData[payload.index].cost_centre = payload.uuid;

      if (payload.isUpdateMode) {
        updatedData[payload.index].is_cc_value_updated = true;
      }

      return {
        ...state,
        cost_centres_for_legal_entity: updatedData,
      };
    case Actions.SAVE_ENTITY_COST_CENTER:
      let resultList: any[] = [];

      if (payload.length > 0) {
        resultList = payload.map((value: any) => {
          let result = state.cost_centres_for_legal_entity.find(
            ccEntity => ccEntity.legal_entity === value.legal_entity.title,
          );
          if (result) {
            return {
              ...result,
            };
          } else {
            return {
              legal_entity: value.legal_entity.title,
              cost_centre: '',
            };
          }
        });
      }

      return {
        ...state,
        entityCostCenterList: payload,
        cost_centres_for_legal_entity: resultList,
      };
    case Actions.SAVE_ENTITY_COST_CENTER_LOADER:
      return {
        ...state,
        entityCostCenterLoader: payload,
      };
    case Actions.SAVE_ENTITY_TYPES:
      return {
        ...state,
        entityList: payload,
      };
    case Actions.SAVE_ENTITY:
      return {
        ...state,
        entityList: payload,
      };
    case Actions.SAVE_EXPANDED_ITEM:
      let modifiedCCLegalEntity = [];
      let initialData = payload?.cost_centres_for_legal_entity || [];
      if (
        payload?.cost_centres_for_legal_entity &&
        payload.cost_centres_for_legal_entity.length > 0
      ) {
        const ccLegalEntity = payload?.cost_centres_for_legal_entity || [];
        modifiedCCLegalEntity = ccLegalEntity.map((value: any) => {
          return {
            legal_entity: value.legal_entity.title,
            cost_centre: value.cost_centre.uuid,
          };
        });
      }
      return {
        ...state,
        expandedItem: payload,
        cost_centres_for_legal_entity: modifiedCCLegalEntity,
        initialExpenseCostCenterForLegalEntity: initialData,
      };
    default:
      return {
        ...state,
      };
  }
};

export default ExpenseTypeConfigurationReducer;
