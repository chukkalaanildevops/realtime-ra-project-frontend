export interface IAddUpdateRule {
  add_update_rule_action: 'ADD_RULE' | 'UPDATE_RULE';

  process_types: any[];
  selected_process_type: string;

  type_objects: any[];
  type_objects_status: boolean;
  selected_type_object: any;

  rule_title: string;

  options: any[];
  operators: any;
  genders: any[];
  marital_statuses: any[];
  contract_types: any[];
  ref_obj_emp_groups: any[];
  emp_sub_groups: any[];
  emp_groups: any[];
  approvers_custom_fields: any[];
  pay_grades: any[];
  employee_ids: any[];
  users: any[];
  legal_entities: any[];
  allowed_step_owners: any[];
  allowed_fallback_step_owners: any[];

  cost_centres: any[];
  custom_cases_options: any[];
  custom_cases_cost_centre_types: any[];
  custom_cases_cost_claim_creator_types: any[];

  rule_config: any;
  readable_rule_config: any;
  current_section_data: any;
  current_readable_section_data: any;

  drawer_title: string;
  drawer_for: 'DEFAULT' | 'CUSTOM';
  drawer_action: 'ADD' | 'EDIT';

  current_editing_section_index: number | null;
}
