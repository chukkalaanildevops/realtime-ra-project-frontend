import { Language } from '../../utils/types.utils';
import { IDraftCount } from '../draft/draft.model';
import { ISubmittedCount } from '../submitted/submitted.model';
/**
 * Combined dashboard.model.ts in one single file
 */
export type DashboardProps = {
  values?: any;
  currentLanugage: Language;
  // history: { push: Function };
  userData: any;
  records: RecordSchema;
};
export type MenuItemObj = {
  name: string | React.ReactNode;
  icon: React.ForwardRefExoticComponent<any>;
  navigate: string;
  notifications?: number;
  isVisible: boolean;
};

export interface Local {
  [prop: string]: any;
}

export type RecordSchema = {
  [key: string]: any[];
};

export type InitialState = {
  ln: Language;
  // values: any;
  userData: object;
  // records: RecordSchema;
  // dashboardData: RecordSchema;
  isLoading: boolean;
  success: string;
  error: string;
  loadingMessage: string;
  cardData: any;
  cardLoader: any;
  isDashboardDataLoadFailed: boolean;
};

export interface IDashboardCount {
  drafts: IDraftCount;
  submitted: ISubmittedCount;
  approval: IApprovalCount;
}

export interface IApprovalCount {
  expenses: number;
  expenses_attached_to_request: number;
  requests: number;
  benefits?: number;
}

export const DASHBOARD_CARD_TYPES = {
  draftExpense: 'Expense Drafts',
  draftRequest: 'Request Drafts',
  draftBenefit: 'Benefit Drafts',
  savedReceipts: 'Saved Receipts',
  pendingExpense: 'Pending Approvals(Expenses)',
  pendingRequest: 'Pending Approvals(Requests)',
  pendingBenefit: 'Pending Approvals(Benefits)',
  approvedExpense: 'Approved Expenses',
  approvedRequest: 'Approved Requests',
  approvedBenefit: 'Approved Benefits',
  rejectedClaims: 'Rejected Claims',
  rejectedRequest: 'Rejected Requests',
  rejectedBenefit: 'Rejected Benefit',
};

export type TFetchSpecificDataTypes =
  | 'draftExpense'
  | 'draftRequest'
  | 'draftBenefit'
  | 'savedReceipts'
  | 'pendingExpense'
  | 'pendingRequest'
  | 'pendingBenefit'
  | 'approvedExpense'
  | 'approvedRequest'
  | 'approvedBenefit'
  | 'rejectedClaims'
  | 'rejectedRequest'
  | 'rejectedBenefit';
