export const PREFERRED_CRITERIA = [
  {
    title: 'Receipt Number',
    value: 'RN',
  },
  {
    title: 'Receipt Number + Date',
    value: 'RNDT',
  },
  {
    title: 'Receipt Number + Date + Amount',
    value: 'RNDTAT',
  },
  {
    title: 'Receipt Number + Date + Amount + Currency',
    value: 'RNDTATCU',
  },
];

export interface IClaimDetector {
  isLoading: boolean;
  success: string;
  error: string;
  data: any;
}
