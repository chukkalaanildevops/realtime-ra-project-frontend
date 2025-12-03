/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
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
import './ShowAllRequestsSearch.index.less';
import LoadMore from '../../loadMore.index';
import IconComponents from '../../../../shared/components/searchBar/iconComponents.index';

const ShowAllRequestsSearch: React.FC<ConnectedProps<typeof connector>> = ({
  data,
  isLoading,
  _fetchUsersFromSearchBar,
}) => {
  const history = useHistory();
  const searchValue = decodeURIComponent(getQueryString('search') || '');

  useEffect(() => {
    _fetchUsersFromSearchBar(searchValue, 'requests');
  }, [searchValue]);

  const requestDetails = (event: any, o: any) => {
    event.preventDefault();

    history.push(
      `${appPath.search.requests.details.linkTo}${o.document.request_id}/?requestNo=${o.document.request_no}`,
    );
  };

  const requestResultHtml = data?.data?.map((o: any) => {
    return (
      <Col span={24}>
        <a
          onClick={event => {
            requestDetails(event, o);
          }}
        >
          <div className='single-result'>
            <div className='content-layer'>
              <div className='employee-card'>
                <div>
                  {IconComponents.getRequestIcon(
                    o?.document?.is_travel_type ? 'TRAVEL' : 'GENERAL',
                    o.document_type,
                  )}
                </div>

                <div className='field2' title={o.document.request_type_title}>
                  {o.document.request_type_title.length > 20
                    ? `${o.document.request_type_title.slice(0, 20)}...`
                    : o.document.request_type_title}
                </div>
                {o.document.request_no && (
                  <>
                    <div className='circle'></div>
                    <div className='field3'>{o.document.request_no || ''}</div>
                  </>
                )}
                {o.document.employee && (
                  <>
                    <div className='circle'></div>
                    <div className='field3'>{o.document.employee || ''}</div>
                  </>
                )}
                {o.document.start_date && (
                  <>
                    <div className='circle'></div>
                    <div className='field4'>{`${o.document.start_date}`}</div>
                  </>
                )}
                {o.document.end_date && (
                  <>
                    <div className='circle'></div>
                    <div className='field5'>{`${o.document.end_date}`}</div>
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
      headerCommonProps={{ title: `Requests - ${searchValue}` }}
    >
      <div className='search-requests-body'>
        {isLoading ? (
          <ElementOrSkeleton isLoading={isLoading} type='page' />
        ) : (
          <>
            <div className='back-button'>
              <BackButton />
            </div>
            <div>
              <Row gutter={[10, 10]}>
                {data?.data?.length > 0 ? requestResultHtml : noData}
              </Row>
            </div>
            <div className='loadMoreBtn'>
              <LoadMore
                searchValue={searchValue}
                type='requests'
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
  data: state.searchBar.requestData,
  isLoading: state.searchBar.requestLoading,
});

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  _fetchUsersFromSearchBar: (val: string, type: string) =>
    dispatch(fetchUsersFromSearchBar(val, type)),
});

const connector = connect(mapStateToProps, mapDispatchToProps);
export default connector(ShowAllRequestsSearch);
