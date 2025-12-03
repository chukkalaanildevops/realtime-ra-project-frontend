import { ChangeEvent } from 'react';

export type TsearchDataObject = {
  title: string;
  description: string;
  tag: string;
  url: string;
}[];
export interface IheaderProps {
  searchData?: TsearchDataObject;
  isLoadinSearchData?: boolean;
  placement?: any;
  onSearchChange?: (value: string | number) => void;
}

export interface IloadMoreProps {
  searchValue?: string;
  type?: string;
  nextPage?: number;
}

export type TonSearchChangeHandler = (value: string | number) => void;

export type TonChangeHandler = (e: ChangeEvent<HTMLInputElement>) => void;

export type dataType = {
  data: any[];
  pagination_data: {
    next_page: number;
    number_of_pages: number;
    total_records: number;
  };
  current_page: number;
};
export interface ISearchBarState {
  loading: boolean;
  data: dataType;
  error: string;

  expenseLoading: boolean;
  expenseData: dataType;
  expenseError: string;

  requestLoading: boolean;
  requestData: dataType;
  requestError: string;

  benefitData: dataType;
  benefitLoading: boolean;
  benefitError: string;

  userLoading: boolean;
  userData: dataType;
  userError: string;

  limitedResultsLoading: boolean;
  limitedResultsData: any[];
  limitedResultsError: string;

  limitedResultsExpenseLoading: boolean;
  limitedResultsExpenseData: any[];
  limitedResultsExpenseError: string;

  limitedResultsRequestLoading: boolean;
  limitedResultsRequestData: any[];
  limitedResultsRequestError: string;

  limitedResultsBenefitLoading: boolean;
  limitedResultsBenefitData: any[];
  limitedResultsBenefitError: string;

  limitedResultsProfileLoading: boolean;
  limitedResultsProfileData: any[];
  limitedResultsProfileError: string;
}
