import { ADD_NEW_EXPENSES_ACTIONS } from './addNewExpense.actions';
import { IuserInfo } from '../../shared/model';
import {
  IgeneralConfig,
  IexpenseTypeDetail,
  Ientertaiment,
  Imileage,
  IcustomFields,
  Ilabel,
} from '../expenseTypeConfiguration/expenseTypeConfiguration.model';
import { Moment } from 'moment';
import { CreatedByOrModifiedByOrDeletedBy } from '../../shared/model';

export interface IaddNewExpenseProps {
  //view only mode
  enableViewOnly?: boolean;
  tabCategory?: TactiveTabKey;
  legalEntityId?: number;
  // request - expense claim
  onExpenseAddedSuccessfully?: () => void;
  isForRequest?: boolean;
  requestId?: number;
  expenseId?: number;
  updateCategory?: 'General' | 'Entertainment' | 'Mileage' | 'Petty Cash';
}

// reducer interfaces and types
export type TactiveTabKey = 'general' | 'entertainment' | 'mileage' | 'petty';
// export type TactiveTabKey =
//   | 'General'
//   | 'Entertainment'
//   | 'Mileage'
//   | 'Petty';
export interface IAddNewExpenseFormReducerIntialState {
  viewOnly: boolean;
  isAdminEdit: boolean;
  isForRequest: boolean;
  is_resubmission_case: boolean;
  requestId: number | null;
  activeTabKey: TactiveTabKey | null;
  mode: Tmode;
  updateId: null | number;
  userInfo: IuserInfo | null;
  userJobInfo: IUserJobInfo | null;
  expenseTypeList: IexpenseTypeList[];
  expenseTypeListLoader: boolean;
  selectedExpenseType: IexpenseTypeList | null;
  chargeTo: TchargeTo;
  costCenterList: IcostCenterList[];
  costCenterListLoader: boolean;
  expenseClaimFetchedData: any;
  staffMembersJobInfoList: IstaffMembersJobInfo[];
  staffMembersJobInfoListLoader: boolean;
  formData: IformData;
  fetchedConversionRate: number;
  configuration: Iconfiguration | null;
  initialReceiptStatus: boolean;
  mileageRate: number;
  defaultTax: null | number;
  confirmationInfo: IConfirmationInfo;
  disableSaveSendBtns: boolean;
  backendError: IvalidationError;
  tripDetailsLoader: boolean;
  tripDetailError: IvalidationError;
  error: string;
  info: string;
  success: string;
  isLoading: boolean;
  pettyCashManagerTransactionMeta: any;
}

//costCenterList
export interface IcostCenterList {
  id: number;
  title: string;
  uuid: string;
}

//IstaffMembersJobInfo -start
export interface IstaffMembersJobInfo {
  id: number;
  employee__name: string;
  emp_id: number;
  employee_id: number;
  legal_name?: string;
}
export interface ICurrency {
  id: number;
  country: ICountry;
  currency: ICurrency1;
}
export interface ICountry {
  id: number;
  title: string;
  code2: string;
  code3: string;
}
export interface ICurrency1 {
  id: number;
  title: string;
  code: string;
}
//IstaffMembersJobInfo -end

export interface IConfirmationInfo {
  visibility: boolean;
  headerText: string | undefined;
  bodyText: string | undefined;
  forWhat: string;
  okText: string | undefined;
  cancelText: string | undefined;
  extraInfo: any;
}

export type Tmode = 'ADD' | 'UPDATE' | 'CLONE';

export interface RouteParams {
  id?: string;
  category?: string;
  param2?: string;
}

export interface Iconfiguration
  extends IexpenseTypeDetail,
    IgeneralConfig,
    Ientertaiment,
    Imileage {
  custom_fields: IcustomFields;
  label_mapping: Ilabel;
  is_allow_purpose: boolean;
  is_purpose_mandatory: boolean;
  mileage_rates: { as_of_date: string; id: number; rate: string }[];
  entertainment_rates: {
    as_of_date: string;
    country: string;
    id: number;
    rate_per_guest_member: string;
    rate_per_staff_member: string;
  }[];
  is_entertainment_rates_defined: boolean;
  [x: string]: any;
}

export interface IformData {
  general_form: IgenralFormData;
  entertainment_form: IentertainmentFormData;
  mileage_form: ImileageFormData;
  petty_cash_form: IpettyCashForm;
}

export interface IgenralFormData {
  legal_entity_uuid: any;
  expense_type_legal_entity: Number | null; //1
  date: Moment | string; //'3-07-2020' moment object
  currency: number | null; //58
  amount: number | null; //100
  conversion_rate: number | null; //1
  converted_amount: number; //100
  tax_amount: number; //0
  amount_before_taxes: number; //100
  purpose: string; //'stationary expenses done'
  receipt: [File | string] | []; //File
  library_receipt: null | number;
  is_no_receipt: boolean;
  no_receipt_remark: string;
  receipt_number: string;
  cost_centre_uuid: string;
  charge_to: string; //'LOCAL';
  third_party_vendor: string; //'sa';
  custom_fields: any[];
  supporting_documents: (File | string)[];
}

export interface IentertainmentFormData {
  entertainment_staff_members: IstaffAttendeeTable[];
  entertainment_guest_members: IGuestAttendeeTable[];
}

export interface IpettyCashForm {
  voucher_number?: string;
}

export interface ImileageFormData {
  mileage_records: ImileageRecords[];
}

export interface ImileageRecords {
  id?: number;
  expense_type_legal_entity?: number;
  country_currency?: number;
  receipt_number?: string;
  is_no_receipt: boolean;
  no_receipt_remark: string;
  source: string;
  destination: string;
  auto_calculated_mileage: number;
  rate: number;
  toll_charges: number;
  parking_charges: number;
  other_charges: number;
  is_a_round_trip: boolean;
  receipt: File | string;
  library_receipt: null | number;
  supporting_documents: (File | string)[];
  date: string | Moment;
  total_amount: number;
  amount: number;
  purpose: string;
  created_by?: CreatedByOrModifiedByOrDeletedBy | null;
  created_on?: string | null;
}

export interface IstaffAttendeeTable {
  emp_id: number | null;
  member: number | null;
  designation?: string;
  id?: number;
  is_deleted?: boolean;
}

export interface IGuestAttendeeTable {
  member: string;
  organisation: string;
  designation: string;
  id?: number;
  expense_claim?: number;
  is_deleted?: boolean;
}

export interface IpostData {
  expense_type_legal_entity?: Number | null; //1
  date?: Moment | string; //'3-07-2020' moment object
  currency?: number | null; //58
  amount?: number | null; //100
  conversion_rate?: number | null; //1
  converted_amount?: number; //100
  tax_amount?: number; //0
  amount_before_taxes?: number; //100
  purpose?: string; //'stationary expenses done'
  receipt?: [File | string] | []; //File
  is_no_receipt?: boolean;
  no_receipt_remark?: string;
  receipt_number?: string;
  cost_centre_uuid?: string;
  charge_to?: string; //'LOCAL';
  third_party_vendor?: string; //'sa';
  custom_fields?: any[];
  supporting_documents?: (File | string)[];
  entertainment_staff_members?: IstaffAttendeeTable[];
  entertainment_guest_members?: IGuestAttendeeTable[];
  is_receipt_deleted?: boolean; //While sending updated claim data this has to be in the payload.
  request?: number;
  deleted_supporting_documents?: number[];
}

export interface IUserJobInfo {
  created_by: IuserInfo;
  created_on: string;
  modified_by: IuserInfo;
  modified_on: string;
  deleted_by: any | null;
  deleted_on: string | null;
  is_deleted: boolean;
  id: number;
  effective_from: string;
  employee: IuserInfo;
  emp_id: string;
  top_level_legal_entity_uuid: any;
  reason: {
    id: number;
    event_name: string;
    event_reason: string;
  };
  hire_date: string;
  is_active: boolean;
  pay_grade: {
    id: number;
    reference_object: string;
    title: string;
    is_deleted: boolean;
  };
  employee_group: {
    id: number;
    reference_object: string;
    title: string;
    is_deleted: boolean;
  };
  employee_sub_group: {
    id: number;
    reference_object: string;
    title: string;
    is_deleted: boolean;
  };
  location: string;
  contract_type: {
    id: number;
    reference_object: string;
    title: string;
    is_deleted: boolean;
  };
  contract_start_date: string;
  contract_end_date: string;
  termination_date: null;
  confirmation_date: string;
  cost_centre: {
    code: string;
    id: number;
    title: string;
    uuid: string;
  };
  manager: IuserInfo;
  uuid: string;
}

export interface IexpenseTypeList {
  id: number;
  expense_type: {
    id: number;
    title: string;
    code: string;
    category: { code: string; title: string };
  };
  is_active: boolean;
  custom_configuration: number | null;
  global_configuration: number | null;
  legal_entity: {
    created_by: IuserInfo;
    created_on: string;
    modified_by: IuserInfo;
    modified_on: string;
    deleted_by: null;
    deleted_on: null;
    is_deleted: boolean;
    id: number;
    legal_entity_type: IuserInfo;
    title: string;
    code: string;
    external_system_id: null;
    financial_year: null;
    timezone: null;
    currency: {
      id: number;
      country: {
        id: number;
        title: string;
        code2: string;
        code3: string;
      };
      currency: {
        id: number;
        title: string;
        code: string;
      };
    };
    is_gst_registered: boolean;
    has_employees: boolean;
    effective_from: string;
    uuid: string;
    is_active: boolean;
  };
  can_attach?: boolean;
}

export type TchargeToCodesForFetch = 'INTER' | 'LOCAL' | 'OVERS';

export type TchargeToCodes = 'INTER' | 'LOCAL' | 'OVERS' | 'THIRD';

export interface IchargeToInnerObj {
  code: TchargeToCodes;
  title:
    | 'Local cost centre'
    | 'Overseas cost centre'
    | 'Third party vendor'
    | string;
}

export type TchargeTo = IchargeToInnerObj[];

export interface IvalidationError {
  custom_fields?: any;
  [x: string]: string[];
}

export interface IMileageTripFormData {
  amount?: null | number;
  auto_calculated_mileage?: null | number;
  date?: Moment;
  is_a_round_trip?: boolean;
  is_no_receipt?: boolean;
  no_receipt_remark?: string;
  other_charges?: null | number;
  parking_charges?: null | number;
  purpose?: string;
  rate?: number | null;
  receipt?: any;
  receipt_number?: string;
  source?: string;
  destination?: string;
  supporting_documents?: any[];
  toll_charges?: null | number;
  total_amount?: null | number;
}

export interface IgetMileageRateProps {
  date: string;
  expense_type_configuration: number;
}

export type TAddNewExpenseFormReducer = (
  state: IAddNewExpenseFormReducerIntialState,
  actions: TactionCreators,
) => IAddNewExpenseFormReducerIntialState;

export type TactionCreators =
  | IupdateTabKeyReturn
  | IapiCallRequestReturn
  | IapiCallSuccessReturn
  | IapiCallFailReturn
  | IapiCallResetReturn
  | IresetToInitialReturn
  | IsaveUserJobInfoReturn
  | IsaveUserEntitledExpenseTypeListReturn
  | IupdateBackendErrorReturn
  | IsaveCostCentreChageToReturn
  | IsaveConfigurationReturn
  | IupdateUpdateSelectedExpenseTypeReturn
  | IupdateFormDataReturn
  | IresetFieldOnExpenseTypeChangeReturn
  | IsetUpdateIdReturn
  | IupdateExpenseClaimFetchedDataReturn
  | IupdateConfirmationInfoReturn
  | IresetConfirmationInfoReturn
  | IupdateExpenseTypeListLoaderReturn
  | IsaveLoggedInUserInfoReturn
  | IupdateStaffMembersJobInfoListLoaderReturn
  | IupdateStaffMembersJobInfoListReturn
  | IsetFormModeReturn
  | IsetRequestDataReturn
  | IsetCostCenterListReturn
  | IsetCostCenterListLoaderReturn
  | IsetFetchedConversionRateReturn
  | IsetMileageRateReturn
  | IsetDisableSaveSendBtnsReturn
  | IsetIsAdminEditReturn
  | IupdateDefaultTaxAmountReturn
  | IupdateIsResubmissionCaseReturn;

// action  interfaces and types

export interface IupdateTabKeyReturn {
  type: typeof ADD_NEW_EXPENSES_ACTIONS.UPDATE_TAB_KEY;
  payload: TactiveTabKey;
}

export type TupdateTabKey = (key: TactiveTabKey) => IupdateTabKeyReturn;

export interface IapiCallRequestReturn {
  type: typeof ADD_NEW_EXPENSES_ACTIONS.API_CALL_REQUEST;
  payload: {
    error: string;
    success: string;
    info: string;
  };
}

export type TapiCallRequestFn = (info?: string) => IapiCallRequestReturn;

export interface IapiCallSuccessReturn {
  type: typeof ADD_NEW_EXPENSES_ACTIONS.API_CALL_SUCCESS;
  payload: {
    error: string;
    success: string;
    info: string;
  };
}

export type TapiCallSuccessFn = (success?: string) => IapiCallSuccessReturn;

export interface IapiCallFailReturn {
  type: typeof ADD_NEW_EXPENSES_ACTIONS.API_CALL_FAIL;
  payload: {
    error: string;
    success: string;
    info: string;
  };
}

export type TapiCallFailFn = (err?: string) => IapiCallFailReturn;

export interface IapiCallResetReturn {
  type: typeof ADD_NEW_EXPENSES_ACTIONS.API_CALL_RESET;
  payload: {
    error: string;
    success: string;
    info: string;
  };
}

export type TapiCallResetFn = () => IapiCallResetReturn;

export interface IresetToInitialReturn {
  type: typeof ADD_NEW_EXPENSES_ACTIONS.RESET_TO_INITIAL;
  payload?: any;
}

export type TresetToInitialFn = () => IresetToInitialReturn;

export interface IsaveLoggedInUserInfoReturn {
  type: typeof ADD_NEW_EXPENSES_ACTIONS.SAVE_LOGGEDIN_USER_INFO;
  payload?: IuserInfo;
}

export type TsaveLoggedInUserInfoFn = (
  data: IuserInfo,
) => IsaveLoggedInUserInfoReturn;

export interface IsaveUserJobInfoReturn {
  type: typeof ADD_NEW_EXPENSES_ACTIONS.SAVE_USER_JOB_INFO;
  payload?: IUserJobInfo;
}

export type TsaveUserJobInfoFn = (data: IUserJobInfo) => IsaveUserJobInfoReturn;

export interface IsaveUserEntitledExpenseTypeListReturn {
  type: typeof ADD_NEW_EXPENSES_ACTIONS.SAVE_USER_ENTITLED_EXPENSE_TYPE_LIST;
  payload?: IexpenseTypeList[];
}

export type TsaveUserEntitledExpenseTypeListFn = (
  data: IexpenseTypeList[],
) => IsaveUserEntitledExpenseTypeListReturn;

export interface IupdateBackendErrorReturn {
  type: typeof ADD_NEW_EXPENSES_ACTIONS.UPDATE_BACKEND_ERROR;
  payload: IvalidationError;
}

export type TupdateBackendErrorFn = (
  data: IvalidationError,
) => IupdateBackendErrorReturn;

export interface IsaveCostCentreChageToReturn {
  type: typeof ADD_NEW_EXPENSES_ACTIONS.UPDATE_COST_CENTRE_CHAGE_TO;
  payload: TchargeTo;
}

export type TsaveCostCentreChageToFn = (
  data: TchargeTo,
) => IsaveCostCentreChageToReturn;

export interface IsaveConfigurationReturn {
  type: typeof ADD_NEW_EXPENSES_ACTIONS.UPDATE_CONFIGURATION;
  payload: Iconfiguration;
}

export type TsaveConfigurationFn = (
  data: Iconfiguration,
) => IsaveConfigurationReturn;

export interface IupdateUpdateSelectedExpenseTypeReturn {
  type: typeof ADD_NEW_EXPENSES_ACTIONS.UPDATE_SELECTED_EXPENSE_TYPE;
  payload: IexpenseTypeList | null;
}

export type TupdateUpdateSelectedExpenseTypeFn = (
  data: IexpenseTypeList | null,
) => IupdateUpdateSelectedExpenseTypeReturn;

export interface IupdateFormDataReturn {
  type:
    | typeof ADD_NEW_EXPENSES_ACTIONS.UPDATE_FORM_DATA
    | typeof ADD_NEW_EXPENSES_ACTIONS.UPDATE_GENERAL_FORM
    | typeof ADD_NEW_EXPENSES_ACTIONS.UPDATE_ENTERTAIMENT_FORM
    | typeof ADD_NEW_EXPENSES_ACTIONS.UPDATE_MILEAGE_FORM;
  payload: any;
}

export type TupdateFormDataFn = (
  key: string | string[],
  type:
    | 'general_form'
    | 'entertainment_form'
    | 'form_data'
    | 'mileage_form'
    | 'petty_cash_form',
  data: any,
) => IupdateFormDataReturn;

export interface IresetFieldOnExpenseTypeChangeReturn {
  type: typeof ADD_NEW_EXPENSES_ACTIONS.RESET_FIELD_ON_EXPENSE_TYPE_CHANGE;
  payload?: any;
}

export type TresetFieldOnExpenseTypeChangeFn = () => IresetFieldOnExpenseTypeChangeReturn;

export interface IsetUpdateIdReturn {
  type: typeof ADD_NEW_EXPENSES_ACTIONS.SET_UPDATE_ID;
  payload: number | null;
}

export type TsetUpdateIdFn = (updateId: number | null) => IsetUpdateIdReturn;

export interface IupdateExpenseClaimFetchedDataReturn {
  type: typeof ADD_NEW_EXPENSES_ACTIONS.UPDATE_EXPENSE_CLAIM_FETCHED_DATA;
  payload: any;
}

export type TupdateExpenseClaimFetchedDataFn = (
  data: any,
) => IupdateExpenseClaimFetchedDataReturn;

export interface IupdateConfirmationInfoReturn {
  type: typeof ADD_NEW_EXPENSES_ACTIONS.UPDATE_CONFIRMATION_INFO;
  payload: IConfirmationInfo;
}

export type TupdateConfirmationInfoFn = (
  data: IConfirmationInfo,
) => IupdateConfirmationInfoReturn;

export interface IresetConfirmationInfoReturn {
  type: typeof ADD_NEW_EXPENSES_ACTIONS.RESET_CONFIRMATION_INFO;
  payload?: any;
}

export type TresetConfirmationInfoFn = () => IresetConfirmationInfoReturn;

export interface IresetFormDataReturn {
  type: typeof ADD_NEW_EXPENSES_ACTIONS.RESET_FORM_DATA;
  payload?: any;
}

export type TresetFormDataFn = () => IresetFormDataReturn;

export interface IupdateExpenseTypeListLoaderReturn {
  type: typeof ADD_NEW_EXPENSES_ACTIONS.UPDATE_EXPENSE_TYPE_LIST_LOADER;
  payload: boolean;
}

export type TupdateExpenseTypeListLoaderFn = (
  bool: boolean,
) => IupdateExpenseTypeListLoaderReturn;

export interface IupdateStaffMembersJobInfoListLoaderReturn {
  type: typeof ADD_NEW_EXPENSES_ACTIONS.UPDATE_STAFF_MEMBERS_JOB_INFO_LIST_LOADER;
  payload: boolean;
}

export type TupdateStaffMembersJobInfoListLoaderFn = (
  bool: boolean,
) => IupdateStaffMembersJobInfoListLoaderReturn;

export interface IupdateStaffMembersJobInfoListReturn {
  type: typeof ADD_NEW_EXPENSES_ACTIONS.UPDATE_STAFF_MEMBERS_JOB_INFO_LIST;
  payload: IstaffMembersJobInfo[];
}

export type TupdateStaffMembersJobInfoListFn = (
  bool: IstaffMembersJobInfo[],
) => IupdateStaffMembersJobInfoListReturn;

export interface IsetViewModeReturn {
  type: typeof ADD_NEW_EXPENSES_ACTIONS.SET_VIEW_MODE;
  payload: boolean;
}

export type TsetViewModeFn = (bool: boolean) => IsetViewModeReturn;

export interface IsetFormModeReturn {
  type: typeof ADD_NEW_EXPENSES_ACTIONS.SET_FORM_MODE;
  payload: Tmode;
}

export type TsetFormModeFn = (mode: Tmode) => IsetFormModeReturn;

export interface IgetUserEntitledExpenseTypeListprops {
  userId: number;
  category: TactiveTabKey;
}

export interface IgetUserEntitledExpenseTypeListUsingRequestIdprops {
  requestId: number;
  category: TactiveTabKey;
}

export interface IsetRequestDataReturn {
  type: typeof ADD_NEW_EXPENSES_ACTIONS.SET_REQUEST_DATA;
  payload: {
    isForRequest: boolean;
    requestId: number;
  };
}

export type TsetRequestDataFn = (
  bool: boolean,
  id: number,
) => IsetRequestDataReturn;

export interface IsetFetchedConversionRateReturn {
  type: typeof ADD_NEW_EXPENSES_ACTIONS.SET_FETCHED_CONVERSION_RATE;
  payload: number;
}

export type TsetFetchedConversionRateFn = (
  rate: number,
) => IsetFetchedConversionRateReturn;

export interface IsetFetchedSystemConversionRateReturn {
  type: typeof ADD_NEW_EXPENSES_ACTIONS.SET_FETCHED_SYSTEM_CONVERSION_RATE;
  payload: number;
}

export type TsetFetchedSystemConversionRateFn = (
  rate: number,
) => IsetFetchedSystemConversionRateReturn;

export interface IsetCostCenterListReturn {
  type: typeof ADD_NEW_EXPENSES_ACTIONS.SET_COST_CENTER_LIST;
  payload: IcostCenterList[];
}

export type TsetCostCenterListFn = (
  list: IcostCenterList[],
) => IsetCostCenterListReturn;

export interface IsetCostCenterListLoaderReturn {
  type: typeof ADD_NEW_EXPENSES_ACTIONS.SET_COST_CENTER_LIST_LOADER;
  payload: boolean;
}

export type TsetCostCenterListLoaderFn = (
  bool: boolean,
) => IsetCostCenterListLoaderReturn;

export interface IsetMileageRateReturn {
  type: typeof ADD_NEW_EXPENSES_ACTIONS.SET_MILEAGE_RATE;
  payload: number;
}

export type TsetMileageRateFn = (rate: number) => IsetMileageRateReturn;

export interface IsetDisableSaveSendBtnsReturn {
  type: typeof ADD_NEW_EXPENSES_ACTIONS.SET_DISABLE_SAVE_SEND_BTNS;
  payload: boolean;
}

export type TsetDisableSaveSendBtnsFn = (
  rate: boolean,
) => IsetDisableSaveSendBtnsReturn;

export interface IsetIsAdminEditReturn {
  type: typeof ADD_NEW_EXPENSES_ACTIONS.SET_IS_ADMIN_EDIT;
  payload: boolean;
}

export type TsetIsAdminEditFn = (rate: boolean) => IsetIsAdminEditReturn;

export interface IupdateDefaultTaxAmountReturn {
  type: typeof ADD_NEW_EXPENSES_ACTIONS.UPDATE_DEFAULT_TAX_AMOUNT;
  payload: number | null;
}

export type TupdateDefaultTaxAmountFn = (
  amt: number | null,
) => IupdateDefaultTaxAmountReturn;

export interface IupdateIsResubmissionCaseReturn {
  type: typeof ADD_NEW_EXPENSES_ACTIONS.UPDATE_IS_RESUBMISSION_CASE;
  payload: boolean;
}

export type TupdateIsResubmissionCaseFn = (
  bool: boolean,
) => IupdateIsResubmissionCaseReturn;
