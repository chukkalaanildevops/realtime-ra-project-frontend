export interface ISFIntegrationState {
  legal_entity_types: any[];
  fileToModel: any[];
  schedule: any;
  sfIntegrationJobs: any[];
  loader: boolean;
  success: string;
  error: any;
  loadingMessage: string;
  stages: IJobLogs;
  ftpServers: any[];
  isDataSubmitting?: boolean;
  fileConfig?: {
    id: number;
    file_name: string;
    model_to_map: {
      code: string;
      title: string;
    };
    column_names: {
      [key: string]: {
        custom: string;
        default: string;
        is_enabled: boolean;
        is_mandatory: boolean;
      };
    };
  };
  activeTab: string;
  fileLogs: any;
  currentJob: any;
}

export interface IFileDetails {
  is_success: boolean;
  message: string;
  exception_msg: string;
  created_on: string;
  stage: string;
  row_summary?: any;
  model_to_map: string;
  file_name: string;
  jobId: any;
}

export interface IJobLogs {
  CONNECTION: IFileDetails;
  FILE_AVAILABLE: { [filename: string]: IFileDetails };
  FILE_IMPORTED: { [filename: string]: IFileDetails };
  FILE_DECRYPTION: { [filename: string]: IFileDetails };
  FILE_CLEANING: { [filename: string]: IFileDetails };
  FILE_VALIDATION: { [filename: string]: IFileDetails };
  FILE_PROCESSING: { [filename: string]: IFileDetails };
  ROW_PROCESSING: {
    [filename: string]: {
      rows: number;
      success: number;
      failure: number;
      is_success: boolean;
      file_name: string;
      job_id: number;
      url: string;
    };
  };
  JOB_COMPLETION: IFileDetails;
}

export const FILE_NAMES: any = {
  EMPPER: 'Employee Mini Master - Personal.csv',
  EMPJOB: 'Employee Mini Master - Job.csv',
  COMPAN: 'Master Data - Company.csv',
  BUSUNT: 'Master Data - Business Unit.csv',
  BUSASO: 'Master Data - BU Association.csv',
  DIVISN: 'Master Data - Division.csv',
  DIVASO: 'Master Data - DIV Association.csv',
  DEPTMT: 'Master Data - Department.csv',
  DEPASO: 'Master Data - Dept Association.csv',
  COSCEN: 'Master Data - Cost Center.csv',
  CCRASO: 'Master Data - Cost Center Association.csv',
};
