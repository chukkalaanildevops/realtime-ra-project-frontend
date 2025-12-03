export interface IRiskScoreRange {
  riskScores: { [key: string]: any }[];
  isLoading: boolean;
  serviceCallFailed: boolean;
  serviceCallError?: string;
  riskScorePermission: boolean;
}
