export interface COST_CENTRE_STATE {
  costCentres: any[];
  detailedCostCentre: any;
  loader: boolean;
  detailsLoader: boolean;
  paginationData: { [key: string]: any };
  serviceCallFailed: boolean;
}

export interface ICostCentreListingRequestParameters {
  page?: number;
  page_size?: number;
  is_active?: string;
  is_chargeable?: string;
  type?: string;
  q?: string;
}
