export type dataType = {
  data: any[];
  pagination_data: {
    number_of_pages: number;
    total_records: number;
  };
  current_page: number;
};

export interface GL_ACCOUNT_STATE {
  glAccounts: any[];
  detailedGlAccount: any;
  loader: boolean;
  detailsLoader: boolean;
  accountTypes: any[];
  loadingMessage: string;
  error: any;
  success: string;
  glAccountData: dataType;
}

export type CHOICES = 'account_type';
