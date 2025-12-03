type dataType = {
  data: any[];
  pagination_data: {
    number_of_pages: number;
    total_records: number;
  };
  current_page: number;
};

export interface IEntitlementRuleState {
  isLoading: boolean;
  isEntitlementRuleItemLoading: boolean;
  isRuleItemLoading: boolean;
  loadingMessage: string;
  error: string;
  entitlementRulesArray: dataType;
  entitlementRulesLoader: boolean;
  isSimulatedDataListLoading: any;
  isSimulatedEntitlementDataLoading: any;
  entitlementRuleDetails: any;
  isSimulatedDataLoading: boolean;
  simulatedEntitlementData: any;
  simulatedListData: any;
}
