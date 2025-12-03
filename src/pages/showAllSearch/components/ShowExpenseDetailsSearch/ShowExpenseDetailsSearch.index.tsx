// eslint-disabled-next-line
import React from 'react';
import { useParams } from 'react-router-dom';
import {
  BackButton,
  ErrorBoundary,
  HeaderBarWrapper,
} from '../../../../shared/components';
import ClaimDetails from '../../../addNewExpense/claimDetails/claimDetails.index';
import './ShowExpenseDetailsSearch.index.less';
import { getQueryString } from '../../../../utils/scroll.utils';

const ShowExpenseDetailsSearch: React.FC<any> = () => {
  const params: any = useParams();
  const id = (params as any)?.expenseId;
  const eno = getQueryString('expenseNo');

  return (
    <HeaderBarWrapper headerCommonProps={{ title: `Expense #${eno}` }}>
      <div className='search-expense-details-body'>
        <div className='back-button'>
          <BackButton />
        </div>
        <ErrorBoundary>
          <ClaimDetails claimId={id} isCreatedByVisible={true} />
        </ErrorBoundary>
      </div>
    </HeaderBarWrapper>
  );
};

export default ShowExpenseDetailsSearch;
