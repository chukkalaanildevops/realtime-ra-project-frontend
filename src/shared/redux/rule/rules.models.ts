type dataType = {
  data: any[];
  pagination_data: {
    number_of_pages: number;
    total_records: number;
  };
  current_page: number;
};

export interface IRuleState {
  isLoading: boolean;
  isRuleItemLoading: boolean;
  loadingMessage: string;
  error: string;
  rulesArray: dataType;
  ruleDetails: any;
}
