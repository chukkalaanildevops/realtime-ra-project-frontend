export interface IAddUpdateEntitletmentRule {
  add_update_entitlement_rule_action:
    | 'ADD_ENTITLEMENT_RULE'
    | 'UPDATE_ENTITLEMENT_RULE';

  process_types: any[];
  selected_process_type: string;

  type_objects_for_entitlement: any[];
  selected_type_object_for_entitlement: any;

  entitlement_rule_title: string;
  entitlement_effective_from: string;

  options: any[];
  operators: any;
  genders: any[];
  marital_statuses: any[];
  contract_types: any[];
  ref_obj_emp_groups: any[];
  emp_sub_groups: any[];
  emp_groups: any[];
  pay_grades: any[];
  employee_ids: any[];
  users: any[];
  selectedBenefitTypeConfig: any;
  selectedBenefitTypeConfigError: string;

  legal_entities: any[];

  cost_centres: any[];
  custom_cases_options: any[];
  custom_cases_cost_centre_types: any[];
  custom_cases_cost_claim_creator_types: any[];

  entitlement_rule_config: any;
  readable_entitlement_rule_config: any;
  current_section_data: any;
  current_readable_section_data: any;
  is_default_entitlement_touched: boolean;
  drawer_title: string;
  drawer_for: 'DEFAULT' | 'CUSTOM';
  drawer_action: 'ADD' | 'EDIT';

  current_editing_section_index: number | null;
}
