/* STATE INTERFACE */
export interface customObjInterface {
  type: 'TIME' | 'DATE' | 'DATETIME' | 'NUMBER' | 'TEXT' | string; //madatory
  is_deleted?: boolean;
  options?: string[];
  source?: string[];
  sub_type?: string; //madatory
  title: any;
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
  isReferenceObjectRequired?: boolean;
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

export interface generalDataInterface {
  legal_entity: string[];
  benefit_category: any[];
  dependent_relationships: any[];
  title: string;
  code: string;
  cost_centres_for_legal_entity?: any[];
  initialBenefitCostCenterForLegalEntity?: any[];
  icon?: React.ForwardRefExoticComponent<any>;
  frequency_unit?: string;
  max_claims_per_entitlement_period?: string;
  proration?: string;
  benefit_entitlement_period?: any;
  restrict_no_of_claims_per_period?: boolean;
  max_claims_for_entitlement_period?: number;
  is_allow_internal_order_cost_centres?: boolean;
  is_allow_3rd_party_vendor?: boolean;
  is_default_to_employee_cost_centre?: boolean;
  is_allow_overseas_cost_centres?: boolean;
  entitlement_type?: string;
  is_benefit_availability_constrained?: boolean;
  available_after?: string;
  resubmission_period_after_rejection_in_days?: number;
  available_after_period_unit?: string;
  available_after_period?: string;
  entitlement_period_unit?: string;
  entitlement_period?: number;
  max_claims_per_period?: number;
  local_cc_threshold_amount?: number;
  overseas_cc_threshold_amount?: number;
  max_no_of_claims_per_frequency?: number;
  no_of_frequency?: number;
  is_prorated?: boolean;
  is_allow_supporting_documents?: boolean;
  is_allow_updating_tax_amount?: boolean;
  is_auto_populate_tax_amount?: boolean;
  is_default_to_entity_cost_centre?: boolean;
  grace_period_in_days?: number;
  prorated_by?: string;
  is_unlimited_no_claims?: boolean;
  is_unlimited_amount?: boolean;
  is_only_for_confirmed_employee?: boolean;
  can_exceed_entitlement_amount?: boolean;
  can_attach_receipts?: boolean;
  is_receipt_mandatory?: boolean;
  is_display_no_receipt_attached_field?: boolean;
  is_remark_for_no_receipt_mandatory?: boolean;
  allow_remark?: boolean;
  is_allow_remark: boolean;
  is_remark_mandatory: boolean;
  allow_backdated_claims?: boolean;
  is_allow_flexible_benefit?: boolean;
  is_dependent_benefit?: boolean;
  backdated_claims_allowed_upto?: number;
  grace_period?: number;
  tax_percentage_as_of_date?: string | null;
  tax_percentages?: number;
  deductible_component?: string;
  can_claim_for?: string;
  exclude_from_finance_processing?: boolean;
  is_allow_charging_to_cost_centres?: boolean;
  cost_centres?: string[];
  gl_account?: string;
  wage_type?: string;
  is_active: boolean;
  is_assign_using_rules: boolean;
  policy_documents?: {
    policy_file_name: string;
    policy: string;
    id: number;
  }[];
  can_employee_edit_claim_amount?: boolean;
  can_be_marked_prepaid?: boolean;
  instruction_text?: string;
  custom_fields?: {
    fields?: any[];
    layout?: any[];
  };
}

interface ICustomArray {
  custom_fields: any;
}

export type IExpandedItem = generalDataInterface & ICustomArray;

export interface IcustomFieldsLayoutCol {
  title: string;
  id?: number;
}

export type TcustomFieldsLayout = IcustomFieldsLayoutCol[];

export interface IcustomFields {
  fields: customObjInterface[];
  layout: TcustomFieldsLayout[];
}

export interface IBenefitTypeConfigState {
  flexibleBenefitCategory: Array<any>;
  dependentRelations: Array<any>;
  entityList: Array<any>;
  label: Ilabel;
  customFields: IcustomFields;
  entityTypesList: Array<any>;
  error: any;
  success: string;
  loader: boolean;
  wageTypes: Array<any>;
  rate_type: string;
  // costCentre: Array<any>;
  benefitTypes: Array<any>;
  expenseTypes: Array<any>;
  loadingMessage: string;
  expandedItem: IExpandedItem;
  glAccounts: any[];
  isDataLoading: boolean;
  defaultLabels: Ilabel;
  entitlementType: any[];
  availableAfter: any[];
  availableAfterPeriodUnit: any[];
  entitlementTypeUnit: any[];
  proratedBy: any[];
  proration: any[];
  deductibleComponent: any[];
  entitlementPeriod: any[];
  frequencyUnit: any[];
  maxClaimPerEntitlementPeriodList: any[];
  claimFor: any[];
  benefitLegalEntitiesRecords: any[];
  benefitTypeData: any;
  titleUpdateConfigData: any;
  cost_centres_for_legal_entity: any[];
  entityCostCenterList: any[];
  entityCostCenterLoader: boolean;
  initialBenefitCostCenterForLegalEntity: any[];
}

export type BENEFIT_CHOICES =
  | 'entitlement_period'
  | 'frequency_unit'
  | 'entitlement_type'
  | 'available_after'
  | 'available_after_period_unit'
  | 'entitlement_period_unit'
  | 'prorated_by'
  | 'deductible_component'
  | 'claim_for'
  | 'max_claims_per_entitlement_period'
  | 'proration';
