import { TwageTypeListDDCompatible } from '../../shared/redux/wageType/wageType.model';

export interface IinitialexpenseTypeConfigurationState {
  initialExpenseCostCenterForLegalEntity: any;
  is_cc_value_updated: boolean;
  expenseTypes: ICompactExpenseType[];
  item: any;
  viewClicked: boolean;
  compactExpenseTypeLoading: boolean;
  expenseTypeDetailLoading: boolean;
  titleUpdateConfigData: ITitleUpdateConfigData;

  activeTabKey: string; //expense type config form state start
  configMode: TconfigMode;
  expenseUpdateId: string;
  expenseUpdateConfigurationId: string;
  customizeEntityUUID: string;
  general_data: generalDataInterface;
  entertaiment: Ientertaiment;
  mileage: Imileage;
  pettyCash: IpettyCash;
  allowance: Iallowance;
  mileageRatesList: ImileageRatesListInnerObject[];
  custom: IcustomFields;
  label: Ilabel;
  categoryList: IcategoryList[];
  entityList: IentityList[];
  allowanceExpenseTypes: Array<any>;
  maximumClaimAmountPerPeriodDataList: ImaximumClaimAmountPerPeriodData[];
  allowClaimsOn: IallowClaimsOn[];
  allowanceRateExpenseTypes: any;
  expense_type_allowance_rates: any;
  countryList: IcountryListInnerObject[];
  error: string;
  info: string;
  success: string;
  isLoading: boolean;
  backendError: any;
  mileage_rates: Imileage_rates_array_obj[];
  entertainment_rates: Ientertainment_rates_array_obj[];
  rate_type: string;
  tabSwitchConfirmationVisibility: boolean;
  loadingCategory: boolean;
  loadingEntity: boolean;
  loadingMaximumClaimAmountPerPeriod: boolean;
  loadingCountryList: boolean;
  loadingAllowClaimsOn: boolean;
  loadingLabelMappingList: boolean;
  loadingConfigurationData: boolean;
  cost_centres_for_legal_entity: any[];
  detailsId: string; //Expense Type Details
  expenseTypeEntityList: IexpenseTypeEntityList[];
  loadingExpenseTypeEntityList: boolean;
  addEntityModelVisibility: boolean;
  confirmationInfo: IConfirmationInfo;
  entityCostCenterLoader: boolean;
  entityCostCenterList: any[];
  pagination: Ipagination;

  //Resume state:- this will not get reset on componentWillAmount
  isSaveResumeState: boolean; // iF this is true then only saving resumeState.
  resumeState: IresumeState;
  listingFilterdata?: IlistingFilterdata;
  expandedItem: any;
}

interface ICustomArray {
  custom_fields: any;
}

export type IExpandedItem = generalDataInterface & ICustomArray;

export interface ITitleUpdateConfigData {
  id: number | null;
  title: string;
  code: string;
}

export interface ITitleAndCode {
  title: string;
  code: string;
}

export type IExpenseTypeCategory =
  | 'General'
  | 'Entertainment'
  | 'Mileage'
  | 'Petty Cash'
  | 'Allowance';

export type IExpenseTypeCategoryShort =
  | 'general'
  | 'entertainment'
  | 'mileage'
  | 'petty'
  | 'allowance';

export interface IresumeState {
  pagination?: Ipagination;
  listingFilterdata?: IlistingFilterdata;
}

export interface IlistingFilterdata {
  title?: [string] | [];
  isActive?: ['true', 'false'] | [];
  category?: ['General', 'Entertainment', 'Mileage'] | [];
}

export interface Ipagination {
  pageNo?: number;
  maxPageCount?: number;
}

export interface ICompactExpenseType {
  id: number;
  created_on: string;
  modified_on: string;
  created_by: IidNameEmailUsername;
  title: string;
  code: string;
  category: { code: string; title: string };
  global_configuration: number;
}

export interface IidNameEmailUsername {
  id: number;
  name: string;
  email: string;
  username: string;
}

export interface IexpenseTypes {
  created_by: IidNameEmailUsername;
  created_on: string;
  modified_by: IidNameEmailUsername;
  modified_on: string;
  deleted_by: IidNameEmailUsername;
  deleted_on: string;
  is_deleted: boolean;
  id: number;
  category: string;
  legal_entity: string;
  title: string;
  code: string;
  is_active: boolean;
  allow_claims_on: string;
  can_attach_receipts: boolean;
  is_receipt_mandatory: boolean;
  is_display_no_receipt_attached_field: boolean;
  is_remark_for_no_receipt_mandatory: boolean;
  is_allow_supporting_documents: boolean;
  min_amount: string;
  max_amount: string;
  is_setup_maximum_claim_amount_per_period: boolean;
  period: string;
  amount_per_period: string;
  is_set_warning_amount: boolean;
  warning_amount: string;
  warning_message: string;
  is_allow_purpose: boolean;
  is_purpose_mandatory: boolean;
  is_allow_forex: boolean;
  is_forex_rate_editable_by_employee: boolean;
  forex_deviation_percentage: string;
  is_allow_backdated_claims: boolean;
  backdated_claim_period_in_days: number;
  resubmission_period_after_rejection_in_days: number;
  grace_period_in_days: number;
  is_allow_charging_to_cost_centres: boolean;
  is_default_to_entity_cost_centre: boolean;
  is_allow_allowance_rate_enabled: boolean;
  cost_centres: [
    {
      id: number;
      title: string;
      code: string;
      head: string;
      is_chargeable: boolean;
      is_active: boolean;
      effective_date: string;
    },
  ];
  is_allow_claims_against_credit_card: boolean;
  is_exclude_claims_from_finance_processing: boolean;
  is_assign_using_rules: boolean;
  instruction_text: string;
  wage_type: string;
  gl_account: string;
  custom_fields: any;
  mileage_rates: [
    {
      id: number;
      rate: string;
      as_of_date: string;
    },
  ];
  is_allow_updating_mileage_claims_calculated_amount: boolean;
  is_allow_updating_calculated_mileage: boolean;
  entertainment_rates: [
    {
      id: number;
      rate_per_staff_member: string;
      rate_per_guest_member: string;
      as_of_date: string;
      country: string;
    },
  ];
  can_have_staff_members: boolean;
  are_staff_members_mandatory: boolean;
  can_have_guest_members: boolean;
  are_guest_members_mandatory: boolean;
  is_allow_country_selection: boolean;
  is_allow_updating_entertainment_claims_calculated_amount: boolean;
  label_mapping: any;
}

/* -------------------------------------- EXPENSE TYPE END -------------------------------------- */

export interface ExpenseTypeConfigurationProps {}

export interface RouteParams {
  id: string;
  param2?: string;
}

export type TpropToRemove = TcustomFieldsPropertiesName[];
export type TcustomFieldsPropertiesName =
  | 'id'
  | 'type'
  | 'is_deleted'
  | 'options'
  | 'source'
  | 'sub_type'
  | 'title'
  | 'icon'
  | 'is_filled_by_admin'
  | 'is_required'
  | 'is_decimal_allowed'
  | 'precision'
  | 'is_range'
  | 'range_min'
  | 'range_max'
  | 'is_custom_list'
  | 'custom_list'
  | 'reference_object_id'
  | 'reference_object_title'
  | 'isReferenceObjectRequired';

export interface customObjInterface {
  id?: number;
  type: 'TIME' | 'DATE' | 'DATETIME' | 'NUMBER' | 'TEXT' | string; //madatory
  is_deleted?: boolean;
  options?: string[];
  source?: string[];
  sub_type?: string; //madatory
  title: string;
  icon?: React.ForwardRefExoticComponent<any>;
  is_filled_by_admin: boolean; //madatory
  is_required: boolean; //madatory
  is_decimal_allowed?: boolean;
  precision?: null | 1 | 2 | 3 | 4 | 5 | 6; //madatory
  is_range?: boolean; //madatory
  range_min?: number | string | null; //madatory
  range_max?: number | string | null; //madatory
  is_custom_list?: Boolean;
  custom_list?: string[] | number[] | boolean[];
  reference_object_id?: number;
  reference_object_title?: string;
  isReferenceObjectRequired?: boolean;
}

export interface IexpenseTypeDetail {
  category?: string;
  legal_entity: string[];
  title: string;
  code: string;
  is_active: boolean;
}

export interface IgeneralConfig {
  allow_claims_on?: string;
  le_cost_centre?: any;
  can_attach_receipts?: boolean;
  is_receipt_mandatory?: boolean;
  is_display_no_receipt_attached_field?: boolean;
  is_remark_for_no_receipt_mandatory?: boolean;
  is_allow_supporting_documents?: boolean;
  min_amount?: number | null;
  max_amount?: number | null;
  is_setup_maximum_claim_amount_per_period?: boolean;
  period?: string;
  amount_per_period?: number;
  is_set_warning_amount?: boolean;
  warning_amount?: number;
  warning_message?: string;
  is_allow_purpose: boolean;
  is_purpose_mandatory: boolean;
  is_allow_forex?: boolean;
  is_forex_rate_editable_by_employee?: boolean;
  forex_deviation_percentage?: number;
  is_allow_backdated_claims?: boolean;
  backdated_claim_period_in_days?: number;
  resubmission_period_after_rejection_in_days?: number;
  grace_period_in_days?: number;
  tax_percentage_as_of_date: string | null;
  tax_percentages?: number;
  tax_percentages_list?: any;
  is_allow_updating_tax_amount?: boolean;
  is_auto_populate_tax_amount?: boolean;
  is_allow_charging_to_cost_centres?: boolean;
  is_default_to_entity_cost_centre?: boolean;
  cost_centres_for_legal_entity?: any[];
  cost_centres?: string[];
  is_default_to_employee_cost_centre?: boolean;
  // is_allow_overseas_cost_centres?: boolean;
  // is_allow_3rd_party_vendor?: boolean;
  local_cc_threshold_amount: number;
  overseas_cc_threshold_amount: number;
  is_employee_cost_centre_readonly?: boolean;
  is_allow_overseas_cost_centres?: boolean;
  is_allow_internal_order_cost_centres?: boolean;
  is_allow_3rd_party_vendor?: boolean;
  is_allow_claims_against_credit_card?: boolean;
  is_exclude_claims_from_finance_processing?: boolean;
  is_assign_using_rules: boolean;
  instruction_text?: any;
  wage_type?: string;
  gl_account?: string;
  expandedItem: IExpandedItem;
  initialExpenseCostCenterForLegalEntity: any;
}

export interface generalDataInterface
  extends IexpenseTypeDetail,
    IgeneralConfig {}

export interface Imileage {
  mileage_rate?: number;
  mileage_rate_as_of_date: string | null;
  is_allow_updating_mileage_claims_calculated_amount: boolean;
  mileage_rates: any[];
  total_mileage_rates: any;
  is_allow_updating_calculated_mileage: boolean;
}

export interface Iallowance {
  expense_type_allowance_rates: any[];
  is_allow_allowance_rate_enabled: boolean;
  is_allow_updating_no_of_days: boolean;
}

export interface IpettyCash {
  is_allow_voucher_number: boolean;
}

export interface Ientertaiment {
  entertainment_rate_as_of_date: string | null;
  entertainment_rate_country: string;
  can_have_staff_members: boolean;
  rate_per_staff_member?: number;
  are_staff_members_mandatory: boolean;
  can_have_guest_members: boolean;
  rate_per_guest_member?: number;
  are_guest_members_mandatory: boolean;
  is_allow_country_selection: boolean;
  is_allow_updating_entertainment_claims_calculated_amount: boolean;
  is_entertainment_rates_defined: boolean;
}

export interface ILabelInnerObject {
  default: string;
  mapped: string;
  is_mandatory?: boolean;
}
export interface Ilabel {
  [key: string]: ILabelInnerObject;
}

export type custom = {
  [index: string]: customObjInterface;
};

export interface IcostCenterList {
  id: number;
  title: string;
  code: string;
  head: string;
  is_chargeable: boolean;
  is_active: boolean;
  effective_date: string;
}

export interface IcategoryList {
  code: string;
  title: string;
}

export interface ImaximumClaimAmountPerPeriodData {
  code: string;
  title: string;
}

export interface IallowClaimsOn {
  code: string;
  title: string;
}

export interface IidNameEmailUsername {
  id: number;
  name: string;
  email: string;
  username: string;
}

export interface IentityList {
  created_by: IidNameEmailUsername | null;
  created_on: string;
  modified_by: IidNameEmailUsername | null;
  modified_on: string;
  deleted_by: null | IidNameEmailUsername;
  deleted_on: string | null;
  is_deleted: boolean;
  id: number;
  legal_entity_type: {
    id: number;
    title: string;
    display_text: string;
    is_active: boolean;
  };
  title: string;
  code: null | string;
  external_system_id: null | number;
  financial_year: null | string;
  timezone: null | string;
  is_gst_registered: boolean;
  has_employees: boolean;
  effective_from: string;
  uuid: string;
  is_active: boolean;
  custom_configuration?: null | any;
}

export interface IexpenseTypeEntityList {
  id: number;
  expense_type: number;
  is_active: boolean;
  custom_configuration: number | null;
  global_configuration: number;
  legal_entity: IentityList;
}

export interface IGLAccountList {
  created_by: IidNameEmailUsername;
  created_on: string;
  modified_by: IidNameEmailUsername;
  modified_on: string;
  deleted_by: IidNameEmailUsername | null;
  deleted_on: string | null;
  is_deleted: boolean;
  id: number;
  account_number: string;
  account_type: {
    code: string;
    title: string;
  };
}

export interface ImileageRatesListInnerObject {
  id: number;
  rate: string;
  as_of_date: string;
}
export interface IcountryListInnerObject {
  id: number;
  title: string;
  code2: string;
  code3: string;
}

export interface IentertanmentRateTableData {
  id: number;
  rate_per_staff_member: number;
  rate_per_guest_member: number;
  as_of_date: string;
  country: string;
}

export interface ImileageRateTableData {
  id: number;
  as_of_date: string;
  rate: number;
}

export interface Imileage_rates_array_obj {
  id: number;
  rate: string;
  as_of_date: string;
}
export interface Ientertainment_rates_array_obj {
  id: number;
  rate_per_staff_member: string;
  rate_per_guest_member: string;
  as_of_date: string;
  country: string;
}

export interface IcustomFieldsLayoutCol {
  title: string;
  id?: number;
}

export type TcustomFieldsLayout = IcustomFieldsLayoutCol[];

export interface IcustomFields {
  fields: customObjInterface[];
  layout: TcustomFieldsLayout[];
}

export type TconfigMode =
  | 'ADD'
  | 'UPDATE'
  | 'CUSTOMIZE_ADD'
  | 'CUSTOMIZE_UPDATE';

export interface IcreatePostDataProps {
  isUpdateMode: boolean;
  general_data: generalDataInterface;
  entertaiment: Ientertaiment;
  mileage: Imileage;
  allowance: Iallowance;
  custom: IcustomFields;
  label: Ilabel;
  categoryList: IcategoryList[];
  entityList: IentityList[];
  allowClaimsOn: IallowClaimsOn[];
  maximumClaimAmountPerPeriodDataList: ImaximumClaimAmountPerPeriodData[];
  costCenterList: IcostCenterList[];
  wageTypeListDDCompatible: TwageTypeListDDCompatible;
  GLAccountList: IGLAccountList[];
  countryList: IcountryListInnerObject[];
  pettyCash: IpettyCash;
}

export interface IGenerateDetailConfigurationProps {
  isUpdateMode: boolean;
  general_data: generalDataInterface;
  entertaiment: Ientertaiment;
  mileage: Imileage;
  custom: IcustomFields;
  label: Ilabel;
  categoryList: IcategoryList[];
  entityList: IentityList[];
  allowClaimsOn: IallowClaimsOn[];
  maximumClaimAmountPerPeriodDataList: ImaximumClaimAmountPerPeriodData[];
  // costCenterList: IcostCenterList[];
  wageTypeListDDCompatible: TwageTypeListDDCompatible;
  GLAccountList: IGLAccountList[];
  countryList: IcountryListInnerObject[];
  pettyCash: IpettyCash;
}

export interface IcreateExpenseTypeBody {
  custom: IcustomFields;
  label: Ilabel;
}
export type TcreateExpenseTypeBody = IcreateExpenseTypeBody &
  generalDataInterface &
  Ientertaiment &
  Imileage;

export interface IputExpenseTypeBody
  extends IgeneralConfig,
    Ientertaiment,
    Imileage {}

export interface IputCustomizeExpenseTypeBody
  extends IgeneralConfig,
    Ientertaiment,
    Imileage {
  legal_entity: string;
}

export interface IConfirmationInfo {
  visibility: boolean;
  headerText: string | undefined;
  bodyText: string | undefined;
  forWhat: string;
  okText: any | undefined;
  cancelText: any | undefined;
  extraInfo: any;
}
