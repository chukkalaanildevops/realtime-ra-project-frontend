// eslint-disabled-next-line
import React from 'react';
import { useParams } from 'react-router-dom';
import {
  BackButton,
  ErrorBoundary,
  HeaderBarWrapper,
} from '../../../../shared/components';

import './ShowBenefitDetailsSearch.index.less';
import { getQueryString } from '../../../../utils/scroll.utils';
import BenefitDetail from '../../../benefits/benefitDetail/benefitDetail.index';

const ShowBenefitDetailsSearch: React.FC<any> = () => {
  const params: any = useParams();
  const id = (params as any)?.benefitId;
  const bno = getQueryString('benefitNo');

  return (
    <HeaderBarWrapper headerCommonProps={{ title: `Benefit #${bno}` }}>
      <div className='search-benefit-details-body'>
        <div className='back-button'>
          <BackButton />
        </div>
        <ErrorBoundary>
          <BenefitDetail benefitClaimId={id} isAdmin={true} />
        </ErrorBoundary>
      </div>
    </HeaderBarWrapper>
  );
};

export default ShowBenefitDetailsSearch;
