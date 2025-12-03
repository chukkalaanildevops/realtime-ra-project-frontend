export type TBackendErrors = IBackendErrors | null;

export interface IBackendErrors {
  [x: string]: string[];
}

export type TStatus =
  | 'DRAFTD'
  | 'PENDNG'
  | 'APPRVD'
  | 'REJCTD'
  | 'WITHDR'
  | 'UNDPRS'
  | 'SETTLD'
  | 'STALED';

export type TStatusFF =
  | 'PENDING'
  | 'DRAFT'
  | 'APPROVED'
  | 'PROCESSING'
  | 'SETTLED'
  | 'STALLED'
  | 'REJECTED';

export const STATUS_COLORS: any = {
  ALL: 'blue',
  PENDING: 'magenta',
  APPROVED: 'cyan',
  REJECTED: 'red',
  PROCESSING: 'purple',
  SETTLED: 'blue',
};

export const CARD_STATUS_COLORS: any = {
  PENDING: {
    primary: 'magenta',
    line: '#FFD6E7',
    bgColor: '#FFF1F0',
  },
  DRAFT: {
    primary: 'orange',
    line: '#ffffb8',
    bgColor: '#ffffb8',
  },
  DRAFTED: {
    primary: 'orange',
    line: '#ffffb8',
    bgColor: '#ffffb8',
  },
  APPROVED: {
    primary: 'cyan',
    line: '#B5F5EC',
    bgColor: '#E6FFFB',
  },
  PROCESSING: {
    primary: 'purple',
    line: '#DBC3FF',
    bgColor: '#EEE1FF',
  },
  SETTLED: {
    primary: 'blue',
    line: '#D6E4FF',
    bgColor: '#F0F5FF',
  },
  STALLED: {
    primary: 'blue',
    line: '#D6E4FF',
    bgColor: '#F0F5FF',
  },
  REJECTED: {
    primary: 'red',
    line: '#FFCCC7',
    bgColor: '#FFF1F0',
  },
};

/* Work Flow Details Interface START */
export interface IWorkFlowDetails {
  batch_number: string;
  created_by: CreatedByOrModifiedByOrDeletedBy | null;
  created_on: string;
  modified_by: CreatedByOrModifiedByOrDeletedBy | null;
  modified_on: string;
  on_behalf_of: CreatedByOrModifiedByOrDeletedBy | null;
  deleted_by?: CreatedByOrModifiedByOrDeletedBy | null;
  deleted_on?: null;
  is_deleted: boolean;
  id: number;
  workflow_type: IWorkflowStatus;
  workflow_status: IWorkflowStatus;
  is_completed: boolean;
  expense_claim?: number | null;
  request_no?: number | null;
  request?: null;
  rule: Rule;
  settled_on: string;
  workflow_steps: WorkflowStepsEntity[];
  benefit_claim: any;
  claim_number: string | null;
  request_number: string | null;
  employee?: { [key: string]: any };
  withdrawal_remark: string | null;
  submitted_on: string;
}
export interface CreatedByOrModifiedByOrDeletedBy {
  id: number;
  name: string;
  legal_name: string;
  email: string;
  username: string;
}
export interface IWorkflowStatus {
  code: any;
  title: any;
}
export interface Rule {
  custom?: CustomEntity[] | null;
  default: Default;
}
export interface CustomEntity {
  rule: Rule1;
  entities?: string[] | null;
  criterias?: (CriteriasEntityEntity[] | null)[] | null;
}
export interface Rule1 {
  cases?: CasesEntity[] | null;
  default_case: DefaultCase;
}
export interface CasesEntity {
  steps?: StepsEntity[] | null;
  conditions?: ConditionsEntityOrEntity[] | null;
}
export interface StepsEntity {
  owner: string;
  owner_id?: null;
}
export interface ConditionsEntityOrEntity {
  value: number;
  option: string;
  operator: string;
}
export interface DefaultCase {
  steps?: StepsEntity1[] | null;
}
export interface StepsEntity1 {
  owner: string;
  owner_id?: number | null;
}
export interface CriteriasEntityEntity {
  value: string | number | number[] | null;
  option: string;
  operator: string;
}
export interface Default {
  rule: Rule2;
}
export interface Rule2 {
  cases?: CasesEntity1[] | null;
  default_case: DefaultCase;
}
export interface CasesEntity1 {
  steps?: StepsEntity1[] | null;
  conditions?: ConditionsEntityOrEntity[] | null;
}
export interface WorkflowStepsEntity {
  created_by: number;
  created_on: string;
  modified_by: number;
  modified_on: string;
  deleted_by?: null;
  deleted_on?: null;
  is_deleted: boolean;
  id: number;
  workflow: number;
  step_number: number;
  step_owner: string;
  responders?: (RespondersEntity | null)[] | null;
  status: IWorkflowStatus;
  reason_for_skipping?: null;
  reason_for_stalling?: string | null;
  remark?: null;
  responded_by?: null;
  responded_on?: null;
  responded_on_behalf_of?: null;
  is_step_closed: boolean;
}
export interface RespondersEntity {
  id: number;
  name: string;
  email: string;
  username: string;
}
/* Work Flow Details Interface END */

//React-PDF

export type RenderFunction = () => JSX.Element;

export interface IPDFDocumentProps {
  className?: string | string[];
  error?: string | React.ReactElement | RenderFunction;
  externalLinkTarget?: '_self' | '_blank' | '_parent' | '_top';
  file: any;
  inputRef?: React.LegacyRef<HTMLDivElement>;
  loading?: string | React.ReactElement | RenderFunction;
  noData?: string | React.ReactElement | RenderFunction;
  onItemClick?: ({ pageNumber }: { pageNumber: string }) => void;
  onLoadError?: (error: Error) => void;
  onLoadSuccess?: (pdf: any) => void;
  onPassword?: (callback: (...args: any[]) => any) => void;
  onSourceError?: (error: Error) => void;
  onSourceSuccess?: () => void;
  options?: any;
  renderMode?: 'canvas' | 'svg' | 'none';
  rotate?: number;
  children?: React.ReactNode;
}

export interface IPDFPageItem {
  _transport: object;
  commonObjs: object;
  getAnnotations: (...args: any[]) => any;
  getTextContent: (...args: any[]) => any;
  getViewport: (...args: any[]) => any;
  render: (...args: any[]) => any;
}
export interface ITextLayerItemInternal {
  fontName: string;
  itemIndex: number;
  page: IPDFPageItem;
  rotate?: 0 | 90 | 180 | 270;
  scale?: number;
  str: string;
  transform: number[];
  width: number;
}

export interface ILoadingProcessData {
  loaded: number;
  total: number;
}

export interface ITextItem {
  str: string;
  dir: string;
  transform: number[];
  width: number;
  height: number;
  fontName: string;
}

export interface IPDFPageProps {
  className?: string | string[];
  customTextRenderer?: (layer: ITextLayerItemInternal) => JSX.Element;
  error?: string | React.ReactElement | RenderFunction;
  height?: number;
  inputRef?: React.LegacyRef<HTMLDivElement>;
  loading?: string | React.ReactElement | RenderFunction;
  noData?: string | React.ReactElement | RenderFunction;
  onLoadError?: (error: Error) => void;
  onLoadProgress?: (data: ILoadingProcessData) => void;
  onLoadSuccess?: (page: any) => void;
  onRenderError?: (error: Error) => void;
  onRenderSuccess?: () => void;
  onGetAnnotationsSuccess?: (annotations: any) => void;
  onGetAnnotationsError?: (error: Error) => void;
  onGetTextSuccess?: (items: ITextItem[]) => void;
  onGetTextError?: (error: Error) => void;
  pageIndex?: number;
  pageNumber?: number;
  renderAnnotationLayer?: boolean;
  renderInteractiveForms?: boolean;
  renderMode?: 'canvas' | 'svg' | 'none';
  renderTextLayer?: boolean;
  rotate?: number;
  scale?: number;
  width?: number;
}
//React-PDF

//Currency
export interface ICurrency {
  id: number;
  country: ICountry;
  currency: IInnerCurrency;
}
export interface ICountry {
  id: number;
  title: string;
  code2: string;
  code3: string;
}
export interface IInnerCurrency {
  id: number;
  title: string;
  code: string;
}

export interface IPaginationData<T> {
  data: T[];
  pagination_data: {
    number_of_pages: number;
    total_records: number;
  };
  current_page: number;
}

/**
 * Cordinates Interface
 */

export interface ILngLat {
  lng: number;
  lat: number;
}

export interface ICoordinates {
  source: ILngLat | null;
  destination: ILngLat | null;
}

/**
 * Receipt Interface ------------------------- Start -------------------------
 */

export interface IBEReceipt {
  created_by: CreatedByOrModifiedByOrDeletedBy | null;
  created_on: string;
  modified_by: CreatedByOrModifiedByOrDeletedBy | null;
  modified_on: string;
  deleted_by: CreatedByOrModifiedByOrDeletedBy | null;
  deleted_on: string | null;
  is_deleted: boolean;
  id: number;
  date: string;
  amount: string;
  currency: ICurrency;
  receipt_number: string;
  file: string;
  file_name: string;
  file_type: string;
  is_used: boolean;
}
/* ------------------------------ END ------------------------------ */

export interface IBESupportingDocument {
  attachment: string;
  expense_claim?: number;
  file_name: string;
  file_type: 'JPG' | 'PNG' | 'PDF' | 'JPEG' | 'JFIF';
  id: number;
  mileage_record?: null | any;
  [x: string]: any;
}

export interface IUserForDD {
  id: number;
  name: string;
  legal_name: string;
  username: string;
  emp_id?: string;
}

export interface IuserInfo {
  id: number;
  name: string;
  legal_name: string;
  email: string;
  username: string;
}

// Searchable Custom DropDown

export type TSearchableDropdownListType = string | number | IKeyValue;

export type TSearchableDropdownList = string[] | number[] | IKeyValue[];

export interface IKeyValue {
  key: string;
  value: string;
}
