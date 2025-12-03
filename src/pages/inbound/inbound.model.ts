export interface IOutboundState {
  schedule: any[];
  pastJobExecutionData: any[];
  loadingPastJobExecutionData: boolean;
  pastJobExecutionError: any;
  loader: boolean;
  success: string;
  error: any;
  loadingMessage: string;
  ftpServers: any[];
  isDataSaving: boolean;
  inboundJobLogData: any[];
  inboundJobLogLoading: boolean;
  inboundJobLogError: any;
}
