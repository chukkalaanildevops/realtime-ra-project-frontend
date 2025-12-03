/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
// eslint-disabled-next-line
import React, { Dispatch, useEffect } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
  BackButton,
  ElementOrSkeleton,
  HeaderBarWrapper,
} from '../../shared/components';
import { stateInterface } from '../../shared/redux/rootReducer';
import { getQueryString } from '../../utils/scroll.utils';
import { fetchUsersFromSearchBar } from '../../shared/components/searchBar/searchBar.thunk';
import { NoData } from '../../shared/components/index';
import './showAllSearch.index.less';
import { appPath } from '../app/app.routes';
import { RightOutlined } from '@ant-design/icons';
import LoadMore from './loadMore.index';
import IconComponents from '../../shared/components/searchBar/iconComponents.index';

const ShowAllSearch: React.FC<ConnectedProps<typeof connector>> = ({
  isLoading,
  data,
  _fetchUsersFromSearchBar,
}) => {
  const history = useHistory();
  const searchValue = decodeURIComponent(getQueryString('search') || '');

  useEffect(() => {
    _fetchUsersFromSearchBar(searchValue, '');
  }, [searchValue]);

  const redirectTo = (event: any, href: any) => {
    event.preventDefault();
    history.push(href);
  };

  const ListItem = (props: any) => {
    return (
      <a
        onClick={event => {
          redirectTo(event, props.href);
        }}
      >
        <div className='single-result'>
          <div className='content-layer'>
            <div className='employee-card'>
              <div>
                {props.document_type === 'USER'
                  ? IconComponents.getUserIcon(props.field1)
                  : props.document_type === 'EXPE'
                  ? IconComponents.getExpenseIcon(
                      props.category,
                      props.document_type,
                    )
                  : props.document_type === 'REQU'
                  ? IconComponents.getRequestIcon(
                      props.category,
                      props.document_type,
                    )
                  : props.document_type === 'BENE'
                  ? IconComponents.getBenefitIcon(
                      props.category,
                      props.document_type,
                    )
                  : null}
              </div>

              <div className='field2' title={props.field2}>
                {props.field2.length > 20
                  ? `${props.field2.slice(0, 20)}...`
                  : props.field2}
              </div>
              {props.field3 && (
                <>
                  <div className='circle'></div>
                  <div className='field3'>{props.field3 || ''}</div>
                </>
              )}
              {props.field4 && (
                <>
                  <div className='circle'></div>
                  <div className='field4'>{props.field4 || ''}</div>
                </>
              )}
              {props.field5 && (
                <>
                  <div className='circle'></div>
                  <div className='field5'>{props.field5 || ''}</div>
                </>
              )}
              {props.field6 && (
                <>
                  <div className='circle'></div>
                  <div className='field5'>{props.field6 || ''}</div>
                </>
              )}
            </div>
            <div>
              <RightOutlined />
            </div>
          </div>
        </div>
      </a>
    );
  };

  const singleResultHtml = data?.data?.map((o: any) => {
    if (o.document_type === 'USER') {
      return (
        <ListItem
          href={`${appPath.profile.otherUser.linkTo}${o.document.user_id}`}
          field1={o.document.profile_pic}
          field2={o?.document?.legal_name || o.document.name}
          field3={o.document.emp_id}
          document_type={o.document_type}
        />
      );
    } else if (o.document_type === 'REQU') {
      return (
        <ListItem
          href={`${appPath.search.requests.details.linkTo}${o.document.request_id}/?requestNo=${o.document.request_no}`}
          field2={o.document.request_type_title}
          field3={o.document.request_no}
          field4={o.document.employee}
          field5={o.document.start_date}
          field6={o.document.end_date}
          document_type={o.document_type}
          category={o?.document?.is_travel_type ? 'TRAVEL' : 'GENERAL'}
        />
      );
    } else if (o.document_type === 'EXPE') {
      return (
        <ListItem
          href={`${appPath.search.expenses.details.linkTo}${o.document.expense_claim_id}/?expenseNo=${o.document.claim_number}`}
          field2={o.document.expense_type_title}
          field3={o.document.claim_number}
          field4={o.document.employee}
          field5={`${o.document.converted_amount_currency} ${o.document.converted_amount}`}
          document_type={o.document_type}
          category={o?.document?.category}
        />
      );
    } else if (o.document_type === 'BENE') {
      return (
        <ListItem
          href={`${appPath.search.benefits.details.linkTo}${o.document.benefit_claim_id}/?benefitNo=${o.document.claim_number}`}
          field2={o.document.benefit_type_title}
          field3={o.document.claim_number}
          field4={o.document.employee}
          field5={`${o.document.converted_amount_currency} ${o.document.converted_amount}`}
          document_type={o.document_type}
          category={o?.document?.category}
        />
      );
    } else {
      return null;
    }
  });

  const noData = <NoData />;

  return (
    <HeaderBarWrapper
      headerCommonProps={{ title: `Search Results - ${searchValue}` }}
    >
      <div className='search-all-body'>
        {isLoading ? (
          <ElementOrSkeleton isLoading={isLoading} type='page' />
        ) : (
          <>
            <div className='back-button'>
              <BackButton />
            </div>
            <div>{data?.data?.length > 0 ? singleResultHtml : noData}</div>
            <div className='loadMoreBtn'>
              <LoadMore
                searchValue={searchValue}
                type={''}
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
  data: state.searchBar.data,
  isLoading: state.searchBar.loading,
});

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  _fetchUsersFromSearchBar: (
    val: string,
    type: string,
    pageNumber: number = 1,
  ) => dispatch(fetchUsersFromSearchBar(val, type, pageNumber)),
});

const connector = connect(mapStateToProps, mapDispatchToProps);
export default connector(ShowAllSearch);
