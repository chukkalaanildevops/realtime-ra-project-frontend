// eslint-disabled-next-line
import React from 'react';
import { useParams } from 'react-router-dom';
import RequestDetails from '../../../request/detail/requestDetail.index';
import { BackButton, HeaderBarWrapper } from '../../../../shared/components';
import { getQueryString } from '../../../../utils/scroll.utils';
import './ShowRequestDetailsSearch.index.less';

const ShowRequestDetailsSearch: React.FC<any> = () => {
  const params: any = useParams();
  const id = (params as any)?.requestId;
  const rno = getQueryString('requestNo');

  return (
    <HeaderBarWrapper headerCommonProps={{ title: `Request #${rno}` }}>
      <div className='search-request-details-body'>
        <div className='back-button'>
          <BackButton />
        </div>
        <RequestDetails requestId={id} isCreatedByVisible={true} />
      </div>
    </HeaderBarWrapper>
  );
};

export default ShowRequestDetailsSearch;
