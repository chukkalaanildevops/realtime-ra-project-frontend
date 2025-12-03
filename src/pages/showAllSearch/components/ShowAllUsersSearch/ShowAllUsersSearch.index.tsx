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
import { RightOutlined } from '@ant-design/icons';
import './ShowAllUsersSearch.index.less';
import { appPath } from '../../../app/app.routes';
import LoadMore from '../../loadMore.index';

const ShowAllUsersSearch: React.FC<ConnectedProps<typeof connector>> = ({
  data,
  isLoading,
  _fetchUsersFromSearchBar,
}) => {
  const history = useHistory();
  const searchValue = decodeURIComponent(getQueryString('search') || '');

  useEffect(() => {
    _fetchUsersFromSearchBar(searchValue, 'users');
  }, [searchValue]);

  const userDetails = (event: any, o: any) => {
    event.preventDefault();

    history.push(`${appPath.profile.otherUser.linkTo}${o.document.user_id}`);
  };

  const userResultHtml = data?.data?.map((o: any) => {
    return (
      <Col span={24}>
        <a
          onClick={event => {
            userDetails(event, o);
          }}
        >
          <div className='single-result'>
            <div className='content-layer'>
              <div className='employee-card'>
                <img
                  className='img-layer'
                  alt='profile'
                  src={
                    o.document.profile_pic || '/static/media/user.f131520c.png'
                  }
                  height='40px'
                  width='40px'
                />

                <div className='field2'>
                  {o?.document?.legal_name || o.document.name || ''}
                </div>
                {o.document.emp_id && (
                  <>
                    <div className='circle'></div>
                    <div className='field3'>{o.document.emp_id || ''}</div>
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
    <HeaderBarWrapper headerCommonProps={{ title: `Users - ${searchValue}` }}>
      <div className='search-users-body'>
        {isLoading ? (
          <ElementOrSkeleton isLoading={isLoading} type='page' />
        ) : (
          <>
            <div className='back-button'>
              <BackButton />
            </div>
            <div>
              <Row gutter={[10, 10]}>
                {data?.data?.length > 0 ? userResultHtml : noData}
              </Row>
            </div>
            <div className='loadMoreBtn'>
              <LoadMore
                searchValue={searchValue}
                type='users'
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
  data: state.searchBar.userData,
  isLoading: state.searchBar.userLoading,
});

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  _fetchUsersFromSearchBar: (val: string, type: string) =>
    dispatch(fetchUsersFromSearchBar(val, type)),
});

const connector = connect(mapStateToProps, mapDispatchToProps);
export default connector(ShowAllUsersSearch);
