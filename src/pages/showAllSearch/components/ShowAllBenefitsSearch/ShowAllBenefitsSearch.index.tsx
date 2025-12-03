/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
// eslint-disabled-next-line
import { Col, Row } from 'antd';
import React, { Dispatch, useEffect } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
  BackButton,
  ElementOrSkeleton,
  HeaderBarWrapper,
  NoData,
} from '../../../../shared/components';
import { fetchUsersFromSearchBar } from '../../../../shared/components/searchBar/searchBar.thunk';
import { stateInterface } from '../../../../shared/redux/rootReducer';
import { getQueryString } from '../../../../utils/scroll.utils';
import { appPath } from '../../../app/app.routes';
import { RightOutlined } from '@ant-design/icons';
import './ShowAllBenefitsSearch.index.less';
import LoadMore from '../../loadMore.index';
import IconComponents from '../../../../shared/components/searchBar/iconComponents.index';

const ShowAllBenefitsSearch: React.FC<ConnectedProps<typeof connector>> = ({
  data,
  isLoading,
  _fetchUsersFromSearchBar,
}) => {
  const history = useHistory();
  const searchValue = decodeURIComponent(getQueryString('search') || '');

  useEffect(() => {
    _fetchUsersFromSearchBar(searchValue, 'benefits');
  }, [searchValue]);

  const benefitDetails = (event: any, o: any) => {
    event.preventDefault();

    history.push(
      `${appPath.search.benefits.details.linkTo}${o.document.benefit_claim_id}/?benefitNo=${o.document.claim_number}`,
    );
  };

  const benefitResultHtml = data?.data?.map((o: any) => {
    return (
      <Col span={24}>
        <a
          onClick={event => {
            benefitDetails(event, o);
          }}
        >
          <div className='single-result'>
            <div className='content-layer'>
              <div className='employee-card'>
                <div>
                  {IconComponents.getBenefitIcon(
                    o.document.category,
                    o.document_type,
                  )}
                </div>

                <div className='field2' title={o.document.benefit_type_title}>
                  {o.document.benefit_type_title.length > 20
                    ? `${o.document.benefit_type_title.slice(0, 20)}...`
                    : o.document.benefit_type_title}
                </div>
                {o.document.claim_number && (
                  <>
                    <div className='circle'></div>
                    <div className='field3'>
                      {o.document.claim_number || ''}
                    </div>
                  </>
                )}
                {o.document.employee && (
                  <>
                    <div className='circle'></div>
                    <div className='field4'>{o.document.employee}</div>
                  </>
                )}
                {o.document.converted_amount && (
                  <>
                    <div className='circle'></div>
                    <div className='field4'>{`${o.document.converted_amount_currency} ${o.document.converted_amount}`}</div>
                  </>
                )}
              </div>
              <div>
                <RightOutlined />
              </div>
            </div>
          </div>
        </a>
      </Col>
    );
  });

  const noData = <NoData />;

  return (
    <HeaderBarWrapper
      headerCommonProps={{ title: `Benefits - ${searchValue}` }}
    >
      <div className='search-benefits-body'>
        {isLoading ? (
          <ElementOrSkeleton isLoading={isLoading} type='page' />
        ) : (
          <>
            <div className='back-button'>
              <BackButton />
            </div>
            <div>
              <Row gutter={[10, 10]}>
                {data?.data?.length > 0 ? benefitResultHtml : noData}
              </Row>
            </div>
            <div className='loadMoreBtn'>
              <LoadMore
                searchValue={searchValue}
                type='benefits'
                nextPage={data?.pagination_data?.next_page}
              />
            </div>
          </>
        )}
      </div>
    </HeaderBarWrapper>
  );
};

const mapStateToProps = (state: stateInterface) => ({
  data: state.searchBar.benefitData,
  isLoading: state.searchBar.benefitLoading,
});

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  _fetchUsersFromSearchBar: (val: string, type: string) =>
    dispatch(fetchUsersFromSearchBar(val, type)),
});

const connector = connect(mapStateToProps, mapDispatchToProps);
export default connector(ShowAllBenefitsSearch);
