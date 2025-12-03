export interface IRiskScoreCard {
  type?: string;
  riskTitle?: string;
  minRange?: number;
  maxRange?: number;
  midRange?: number;
  isLoading?: boolean;
  ref?: any;
}
