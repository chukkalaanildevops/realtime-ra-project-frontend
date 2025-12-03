export interface IAdminItemCount {
  expenses: number;
  expensesWithRequests: number;
  requests: number;
  cashAdvanceRequests: number;
  benefits: number;
  expenseSettlements: number;
  benefitSettlements: number;
  benefitEntitlement?: number;
  expenseEntitlement?: number;
  requestClosures: number;
}
export type TAdminItemCountKeys =
  | 'expenses'
  | 'expensesWithRequests'
  | 'requests'
  | 'cashAdvanceRequests'
  | 'benefits'
  | 'benefitEntitlement'
  | 'expenseEntitlement';

export interface IAdmin {
  activeTabKey: string;
  dataItemsCountLoading: boolean;
  itemsCount: IAdminItemCount;
  itemsCountForReset: IAdminItemCount;
  isLoading: boolean;
  serviceCallFailed: boolean;
  dataGroupItems: { [key: string]: any }[];
  dataGroupItemsPaginationData: { [key: string]: any };
  currentEmployee: any;
  benefitEntitlementData: any;
  benefitEntitlementAdjustmentData: any;
  isOTP: boolean;
}

export type IAdminItemTypes =
  | 'expense'
  | 'request'
  | 'cash_advance_request'
  | 'expenses_with_request'
  | 'benefit'
  | 'expense_settlement'
  | 'request_posting'
  | 'benefit_entitlement'
  | 'expense_entitlement'
  | 'allowance_rate';

export interface IAdminDataRequestParameters {
  function: 'data' | 'count';
  item?: IAdminItemTypes;
  // flat?: boolean | 'true' | 'false';
  [key: string]: any;
  page?: number;
  employee?: number;
  status?: string;
  from_date?: string;
  to_date?: string;
  min_amount?: string;
  max_amount?: string;
  expense_type?: string;
  request_type?: string;
  category?: string;
  has_receipt?: number;
}

export interface IAdminDataTabModel {
  source: any;
  item: IAdminItemTypes;
  fetchDataItemsCount: (
    parameters?: IAdminDataRequestParameters,
    source?: any,
  ) => void;
  isActiveTab?: boolean;
  _updateSpecificDataItemsCount: TupdateSpecificDataItemsCount;
  defaultFilter?: { [x: string]: any };
  activeTabKey?: string;
}

export interface ICashAdvanceRequestRespondParameters {
  action: 'disburse' | 'reject';
  remark?: string;
  disbursed_amount?: number;
  disbursed_via?: number;
  disbursed_date?: string;
}

export interface IBenefitEntitlementDetails {
  amount?: number;
  action?: string | '';
  reason?: string | '';
}

export type IAdminItemTypesReducer =
  | 'expense'
  | 'request'
  | 'cashAdvanceRequests'
  | 'expensesWithRequests'
  | 'benefit'
  | 'benefitEntitlement'
  | 'expenseEntitlement';

export type TupdateSpecificDataItemsCount = (
  type: IAdminItemTypesReducer | 'expenseSettlements' | 'requestClosures',
  count: number,
) => any;
