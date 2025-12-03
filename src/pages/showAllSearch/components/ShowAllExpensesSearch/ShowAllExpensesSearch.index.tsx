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
import './ShowAllExpensesSearch.index.less';
import LoadMore from '../../loadMore.index';
import IconComponents from '../../../../shared/components/searchBar/iconComponents.index';

const ShowAllExpensesSearch: React.FC<ConnectedProps<typeof connector>> = ({
  data,
  isLoading,
  _fetchUsersFromSearchBar,
}) => {
  const history = useHistory();
  const searchValue = decodeURIComponent(getQueryString('search') || '');

  useEffect(() => {
    _fetchUsersFromSearchBar(searchValue, 'expenses');
  }, [searchValue]);

  const expenseDetails = (event: any, o: any) => {
    event.preventDefault();

    history.push(
      `${appPath.search.expenses.details.linkTo}${o.document.expense_claim_id}/?expenseNo=${o.document.claim_number}`,
    );
  };

  const expenseResultHtml = data?.data?.map((o: any) => {
    return (
      <Col span={24}>
        <a
          onClick={event => {
            expenseDetails(event, o);
          }}
        >
          <div className='single-result'>
            <div className='content-layer'>
              <div className='employee-card'>
                <div>
                  {IconComponents.getExpenseIcon(
                    o.document.category,
                    o.document_type,
                  )}
                </div>

                <div className='field2' title={o.document.expense_type_title}>
                  {o.document.expense_type_title.length > 20
                    ? `${o.document.expense_type_title.slice(0, 20)}...`
                    : o.document.expense_type_title}
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
      headerCommonProps={{ title: `Expenses - ${searchValue}` }}
    >
      <div className='search-expenses-body'>
        {isLoading ? (
          <ElementOrSkeleton isLoading={isLoading} type='page' />
        ) : (
          <>
            <div className='back-button'>
              <BackButton />
            </div>
            <div>
              <Row gutter={[10, 10]}>
                {data?.data?.length > 0 ? expenseResultHtml : noData}
              </Row>
            </div>
            <div className='loadMoreBtn'>
              <LoadMore
                searchValue={searchValue}
                type='expenses'
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
  data: state.searchBar.expenseData,
  isLoading: state.searchBar.expenseLoading,
});

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  _fetchUsersFromSearchBar: (val: string, type: string) =>
    dispatch(fetchUsersFromSearchBar(val, type)),
});

const connector = connect(mapStateToProps, mapDispatchToProps);
export default connector(ShowAllExpensesSearch);
