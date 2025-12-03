/* STATE INTERFACE */
export interface customObjInterface {
  type: 'TIME' | 'DATE' | 'DATETIME' | 'NUMBER' | 'TEXT' | 'DROPDOWN'; //madatory
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

export interface generalDataInterface {
  legal_entity: string[];
  title: string;
  code: string;
  is_travel_type?: boolean;
  is_allow_remark: boolean;
  is_allow_backdated_requests?: boolean;
  grace_period_in_days?: number;
  is_allow_claims_against_request?: boolean;
  is_allow_expense_claim_estimation?: boolean;
  is_allow_adding_staff_members_to_requests?: boolean;
  is_allow_adding_guest_members_to_requests?: boolean;
  wage_type?: string;
  is_auto_settle_request_after_a_period?: boolean;
  cost_centres?: Array<any>;
  is_assign_using_rules: boolean;
  is_active: boolean;
  instruction_text?: string;
  is_include_hotel_accommodation?: boolean;
  is_include_flight_booking?: boolean;
  is_include_travel_insurance?: boolean;
  can_employee_claim_allowances?: boolean;
  is_hotel_accommodation_filled_by_admin?: boolean;
  is_flight_booking_filled_by_admin?: boolean;
  is_travel_insurance_filled_by_admin?: boolean;
  is_remark_mandatory: boolean;
  backdated_request_period_in_days?: number;
  allow_claims_against_request_options?: any[];
  is_allow_overlapping_requests?: boolean;
  estimation_type?: string;
  is_estimation_mandatory?: boolean;
  are_staff_members_mandatory?: boolean;
  are_guest_members_mandatory?: boolean;
  request_expiry_period?: any;
  is_enable_request_expiry_period?: any;
  is_enable_cash_advance?: boolean;
  number_of_days_from_request_end_date?: number;
  is_allow_charging_to_cost_centres: boolean;
  is_allow_multiple_cost_centre_selection: boolean;
  is_allow_overseas_cost_centres: boolean;
  // is_default_to_employee_cost_centre: boolean;
  is_allow_internal_order_cost_centres: boolean;
  is_employee_cost_centre_readonly: boolean;
  is_allow_3rd_party_vendor: boolean;
  request_claimed_count?: number;
  custom_fields?: {
    fields?: any[];
    layout?: any[];
  };
}
export interface IallowClaimsOn {
  code: string;
  title: string;
}

export interface IentityList {
  created_by: {
    id: number;
    name: string;
    email: string;
    username: string;
  };
  created_on: string;
  modified_by: {
    id: number;
    name: string;
    email: string;
    username: string;
  };
  modified_on: string;
  deleted_by: {
    id: number;
    name: string;
    email: string;
    username: string;
  };
  deleted_on: string;
  is_deleted: boolean;
  id: number;
  legal_entity_type: string;
  title: string;
  code: string;
  external_system_id: string;
  financial_year: string;
  timezone: string;
  parent: {
    id: number;
    created_on: string;
    modified_on: string;
    deleted_on: string;
    is_deleted: boolean;
    title: string;
    code: string;
    external_system_id: string;
    financial_year: string;
    created_by: number;
    modified_by: number;
    deleted_by: number;
    legal_entity_type: number;
    timezone: number;
    parent: number;
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

export interface IRequestTypeConfigState {
  entityList: Array<any>;
  label: Ilabel;
  customFields: IcustomFields;
  entityTypesList: Array<any>;
  error: any;
  success: string;
  loader: boolean;
  wageTypes: Array<any>;
  // costCentre: Array<any>;
  requestTypes: Array<any>;
  expenseTypes: Array<any>;
  loadingMessage: string;
  expandedItem: IExpandedItem;
  isDataLoading: boolean;
  defaultLabels: Ilabel;
  requestLegalEntitiesRecords: any[];
  requestTypeData: any;
  updateRequestData?: RequestDetails;
  referenceData: any;
  requestLegalEntities: any[];
  requestLegalEntitiesLoading: boolean;
  staffMemberLoading: boolean;
  requestDetails?: RequestDetails;
  staffMembers?: any[];
  expenseTypesForRequest?: any[];
  currentPage: number;
  createRequestLoadingStatus: any;
  local_cost_centres: CostCentresEntity[];
  overseas_cost_centres: CostCentresEntity[];
  internal_cost_centres: CostCentresEntity[];
}

export interface RequestDetails {
  is_deleted: boolean;
  id: number;
  employee: CreatedByOrModifiedByOrEmployee;
  request_type_legal_entity: RequestTypeLegalEntity;
  request_no: string;
  start_date: string;
  end_date: string;
  departure_from: string;
  arrival_at: string;
  reason_for_travel: string;
  purpose: string;
  charge_to: CategoryOrChargeTo;
  third_party_vendor: string;
  bulk_estimation_amount?: number;
  cash_advance?: number;
  is_multi_destination_trip: boolean;
  staff_members?: StaffMembersEntity[];
  guest_members?: GuestMembersEntity[];
  custom_fields?: null;
  expense_claim_estimations: ExpenseClaimEstimations[];
  travel_itineraries?: TravelItinerariesEntity[];
  flight_details?: FlightDetailsEntity[];
  hotel_accommodations?: HotelAccommodationsEntity[];
  cost_centres?: CostCentresEntity[];
  cost_centre_uuid_to_route_workflow?: any;
  additional_documents?: {
    file_name: string;
    file: string;
    id: number;
  }[];
  workflow_status?: {
    title: string;
    code: string;
  };
}
export interface CreatedByOrModifiedByOrEmployee {
  id: number;
  name: string;
  email: string;
  username: string;
}
export interface RequestTypeLegalEntity {
  id: number;
  request_type: number;
  is_travel_type: boolean;
  title: string;
  is_active: boolean;
  custom_configuration?: number;
  global_configuration: number;
  legal_entity: LegalEntity;
}
export interface LegalEntity {
  id: number;
  legal_entity_type: string;
  title: string;
  is_active: boolean;
  uuid: string;
  code: string;
  effective_from: string;
}
export interface CategoryOrChargeTo {
  code: string;
  title: string;
}
export interface StaffMembersEntity {
  id: number;
  emp_id: string;
  employee__name: string;
  member: string;
  employee_id: number;
  organisation: string;
  designation?: null;
}
export interface GuestMembersEntity {
  id: number;
  member: string;
  organisation: string;
  designation: string;
}
export interface ExpenseClaimEstimations {
  id: number;
  expense_type_legal_entity: ExpenseTypeLegalEntity;
  estimated_amount: string;
}
export interface ExpenseTypeLegalEntity {
  id: number;
  expense_type: ExpenseType;
  is_active: boolean;
  custom_configuration?: null;
  global_configuration: number;
  legal_entity: LegalEntity;
}
export interface ExpenseType {
  id: number;
  title: string;
  code: string;
  category: CategoryOrChargeTo;
}
export interface TravelItinerariesEntity {
  id: number;
  source: string;
  destination: string;
  start_date: string;
}
export interface FlightDetailsEntity {
  id: number;
  airlines: string;
  flight_number: string;
  departure_time: string;
  arrival_time: string;
  is_file_attached: boolean;
  ticket_cost: string;
  country_currency?: {
    id: string;
    country: {
      id: string;
      title: string;
    };
    currency: {
      id: string;
      title: string;
      code: string;
    };
  };
  flight_ticket?: string | null;
  flight_ticket_title?: string | null;
}
export interface HotelAccommodationsEntity {
  id: number;
  hotel_name: string;
  hotel_address: string;
  check_in_date: string;
  check_out_date: string;
  amount: string;
  remark: string;
  is_file_attached: boolean;
  attachment: string;
  attachment_title: string | null;
  country_currency?: {
    id: string;
    country: {
      id: string;
      title: string;
    };
    currency: {
      id: string;
      title: string;
      code: string;
    };
  };
}
export interface CostCentresEntity {
  id: number;
  title: string;
  code: string;
  head: number;
  is_chargeable: boolean;
  is_active: boolean;
  uuid: string;
}

export interface IRequestTypeModel {
  is_deleted?: boolean;
  id?: string;
  request_type_legal_entity: number;
  request_no: string;
  start_date: string;
  end_date: string;
  departure_from?: string;
  arrival_at?: string;
  reason_for_travel?: string;
  purpose: string;
  charge_to: {
    code: string;
    title: string;
  };
  third_party_vendor?: string;
  bulk_estimation_amount?: number;
  is_multi_destination_trip?: boolean;
  staff_members?: [
    {
      member: string;
      organisation: string;
      designation: string;
    },
  ];
  guest_members: [
    {
      member: string;
      organisation: string;
      designation: string;
    },
  ];
  custom_fields: [];
  expense_claim_estimations?: [
    {
      expense_type_legal_entity: string;
      estimated_amount: string;
    },
  ];
  travel_itineraries?: [
    {
      source: string;
      destination: string;
      start_date: string;
    },
  ];
  flight_details?: [
    {
      airlines: string;
      flight_number: string;
      departure_time: string;
      arrival_time: string;
      ticket_cost: string;
      flight_ticket: string;
    },
  ];
  hotel_accommodations?: [
    {
      hotel_name: string;
      hotel_address: string;
      check_in_date: string;
      check_out_date: string;
      amount: string;
      remark: string;
      attachments: any;
    },
  ];
  cost_centres: [];
}

export type COST_CENTRE_TYPES = 'LOCAL' | 'INTER' | 'OVERS';
