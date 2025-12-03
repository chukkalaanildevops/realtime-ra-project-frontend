import { IAdminItemTypes } from '../../../pages/admin/admin.models';

export interface ITransactionDataFilterProps {
  page: 'ADMIN' | 'REPRT' | 'DRAFT' | 'SBMIT' | 'APRVL';
  isVisible: boolean;
  item: IAdminItemTypes | 'receipt';
  source?: any;
  includeStatusBar: boolean;
  includeDraftStatus: boolean;
  includeLegalEntities: boolean;
  includeSaveFilterOption: boolean;
  onApplyFilters?: (filters: { [key: string]: any }) => void;
  onResetFilters?: () => void;
  onSaveFilters?: (filters: { [key: string]: any }) => void;
  initialFilters?: { [key: string]: any };
  includeItemNumber?: boolean;
  includeBatchNumber?: boolean;
  isAggregate?: boolean;
  includeForRequestNumber?: boolean;
  includeSettlementDate?: boolean;
  includePendingApprovalAtUserList?: boolean;
  includeLastActionPriorToDate?: boolean;
  includeDateRange?: boolean; // default true
  includeDate?: boolean;
  includeDestinationList?: boolean;
  includeEntityList?: boolean; // default true
  statusSelectionMode?: 'multiple' | 'single'; // default multiple
  includeEmpoyeeList?: boolean;
  includeWithReceiptOption?: boolean;
  includeYearFilter?: boolean;
  includeTitle?: boolean;
  includeAmount?: boolean;
  includeCurrency?: boolean;
  includeEligibility?: boolean;
  includeSubmittedOnDate?: boolean;
}
