/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useRef, useCallback, useEffect, memo } from 'react';
import { Input, Tabs, Dropdown, Menu } from 'antd';
import { IheaderProps, TonChangeHandler } from './searchBar.model';

import './searchBar.index.less';
import { ElementOrSkeleton, NoData } from '..';
import { stateInterface, getPermissions } from '../../redux/rootReducer';
import { connect, ConnectedProps } from 'react-redux';
import { Dispatch } from 'react';
import { fetchLimitedUsersFromSearchBar } from '../searchBar/searchBar.thunk';
import { useHistory } from 'react-router-dom';
import { appPath } from '../../../pages/app/app.routes';
import { RightOutlined } from '@ant-design/icons';
import { useOnClickOutside } from '../../hooks';
import {
  fetchLimitedUserRequestForExpensesSuccess,
  fetchLimitedUserRequestForProfilesSuccess,
  fetchLimitedUserRequestForRequestsSuccess,
  fetchLimitedUserRequestSuccess,
  fetchUserRequestForExpenseSuccess,
  fetchUserRequestForProfileSuccess,
  fetchUserRequestForRequestSuccess,
  fetchUserRequestSuccess,
} from './searchBar.actions';
import IconComponents from './iconComponents.index';
//import { Trans } from '@lingui/macro';

const SearchBar: React.FC<IheaderProps & ConnectedProps<typeof connector>> = ({
  isLoadinSearchData = false,
  _fetchUsersFromSearchBar,
  getPermissions,
  data,
  tenantConfig,
  isLoading,
  expenseData,
  benefitData,
  expenseDataLoading,
  benefitDataLoading,
  requestData,
  requestDataLoading,
  profileData,
  profileDataLoading,
  placement,
  _resetAllTabSearchbarData,
  _resetExpensesTabSearchbarData,
  _resetRequestsTabSearchbarData,
  _resetUsersTabSearchbarData,
  _resetLimitedSearchbarData,
  _resetLimitedExpensesSearchbarData,
  _resetLimitedRequestsSearchbarData,
  _resetLimitedUsersSearchbarData,
}) => {
  const parentRef = useRef<HTMLDivElement>(null);
  const history = useHistory();
  const { Search } = Input;
  const { TabPane } = Tabs;

  const tenentConfig = tenantConfig[0];
  const isBenefitEnabled = tenentConfig
    ? tenentConfig.is_enabled_benefits
    : false;
  const [inputText, updateInputText] = useState<string | number>('');
  const [resultDivVisibility, updateResultDivVisibility] = useState<boolean>(
    false,
  );
  // const [results, setResults] = useState<any>({});
  const [currentTab, setCurrentTab] = useState<string>('');

  const handleClickOutside = useCallback(() => {
    updateResultDivVisibility(false);
  }, []);
  useOnClickOutside(parentRef, handleClickOutside);

  useEffect(() => {
    return resetData;
  }, []);

  const resetData = () => {
    _resetAllTabSearchbarData();
    _resetExpensesTabSearchbarData();
    _resetRequestsTabSearchbarData();
    _resetUsersTabSearchbarData();

    _resetLimitedSearchbarData();
    _resetLimitedExpensesSearchbarData();
    _resetLimitedRequestsSearchbarData();
    _resetLimitedUsersSearchbarData();
  };

  // useEffect(() => {
  //   let obj: any = {};

  //   data.forEach(item => {
  //     if (obj[item.document_type]) {
  //       obj[item.document_type].push(item);
  //     } else {
  //       obj[item.document_type] = [item];
  //     }
  //   });
  //   setResults(obj);
  // }, [data]);

  const debounceCallback = useCallback((value: any, currentTab: string) => {
    updateResultDivVisibility(true);
    // if (String(value).length > 0) {
    value.trim() &&
      value.trim().length > 2 &&
      _fetchUsersFromSearchBar(String(value), currentTab);
    // }

    // if (String(value).length === 0) {
    //   // _resetAllTabSearchbarData();
    //   // _resetExpensesTabSearchbarData();
    //   // _resetRequestsTabSearchbarData();
    //   // _resetUsersTabSearchbarData();
    //   _resetLimitedSearchbarData();
    //   _resetLimitedExpensesSearchbarData();
    //   _resetLimitedRequestsSearchbarData();
    //   _resetLimitedUsersSearchbarData();
    // }
  }, []);

  const onChangeHandler: TonChangeHandler = e => {
    updateInputText(e.target.value);
    debounceCallback(e.target.value, currentTab);
  };

  const redirectTo = (event: any, href: any) => {
    event.preventDefault();
    history.push(href);
  };

  const ListItem = (props: any) => {
    return (
      <a
        onClick={event => {
          updateResultDivVisibility(false);
          setTimeout(() => {
            redirectTo(event, props.href);
          }, 300);
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

  const allTabResultHtml = data.slice(0, 5).map((o: any) => {
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

  const usersTabResultHtml = profileData?.slice(0, 5).map((o: any) => {
    return (
      <ListItem
        href={`${appPath.profile.otherUser.linkTo}${o.document.user_id}`}
        field1={o.document.profile_pic}
        field2={o?.document?.legal_name || o.document.name}
        field3={o.document.emp_id}
        document_type={o.document_type}
      />
    );
  });

  const requestsTabResultHtml = requestData?.slice(0, 5).map((o: any) => {
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
  });

  const expensesTabResultHtml = expenseData?.slice(0, 5).map((o: any) => {
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
  });

  const benefitsTabResultHtml = benefitData?.slice(0, 5).map((o: any) => {
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
  });

  const allTab = () => <>{allTabResultHtml}</>;
  const usersTab = () => <>{usersTabResultHtml}</>;
  const requestsTab = () => <>{requestsTabResultHtml}</>;
  const expensesTab = () => <>{expensesTabResultHtml}</>;
  const benefitsTab = () => <>{benefitsTabResultHtml}</>;

  const showAll = (type: any) => {
    updateResultDivVisibility(false);
    if (type === 'all') {
      history.push(`${appPath.search.path}?search=${inputText}&type=${type}`);
    } else if (type === 'users') {
      history.push(
        `${appPath.search.users.path}?search=${inputText}&type=${type}`,
      );
    } else if (type === 'expenses') {
      history.push(
        `${appPath.search.expenses.path}?search=${inputText}&type=${type}`,
      );
    } else if (type === 'requests') {
      history.push(
        `${appPath.search.requests.path}?search=${inputText}&type=${type}`,
      );
    } else if (type === 'benefits') {
      history.push(
        `${appPath.search.benefits.path}?search=${inputText}&type=${type}`,
      );
    }
  };

  const SeeAllButtonDisplay = (props: any) => (
    <>
      <div className='search-all-btn-container'>
        <a
          className='search-all-btn'
          onClick={() => {
            showAll(props.type);
          }}
        >
          {`See All ${props.title}`}
        </a>
      </div>
    </>
  );

  const noData = <NoData />;
  const menu = (
    <Menu>
      <Menu.Item>
        <div className='result-container'>
          <Tabs
            defaultActiveKey=''
            onTabClick={(key: string) => {
              setCurrentTab(key);
              debounceCallback(inputText, key);
            }}
          >
            <TabPane tab='All' key='' className='result-tabpane'>
              {isLoading ? (
                <ElementOrSkeleton
                  isLoading={isLoading}
                  type='profilelist'
                  profileListConfiguration={{ rows: 5 }}
                />
              ) : (
                <>
                  {data.length > 0 ? allTab() : noData}
                  {data.length > 0 ? (
                    <SeeAllButtonDisplay type='all' title={'Results'} />
                  ) : null}
                </>
              )}
            </TabPane>
            <TabPane tab='Expenses' key='expenses' className='result-tabpane'>
              {expenseDataLoading ? (
                <ElementOrSkeleton
                  isLoading={expenseDataLoading}
                  type='profilelist'
                  profileListConfiguration={{ rows: 5 }}
                />
              ) : (
                <>
                  {expenseData?.length > 0 ? expensesTab() : noData}
                  {expenseData?.length > 0 ? (
                    <SeeAllButtonDisplay type='expenses' title={'Expenses'} />
                  ) : null}
                </>
              )}
            </TabPane>
            <TabPane tab='Requests' key='requests' className='result-tabpane'>
              {requestDataLoading ? (
                <ElementOrSkeleton
                  isLoading={requestDataLoading}
                  type='profilelist'
                  profileListConfiguration={{ rows: 5 }}
                />
              ) : (
                <>
                  {requestData?.length > 0 ? requestsTab() : noData}
                  {requestData?.length > 0 ? (
                    <SeeAllButtonDisplay type='requests' title={'Requests'} />
                  ) : null}
                </>
              )}
            </TabPane>
            {isBenefitEnabled && getPermissions.VIEW_SETUP_BENEFIT_TYPES && (
              <TabPane tab='Benefits' key='benefits' className='result-tabpane'>
                {benefitDataLoading ? (
                  <ElementOrSkeleton
                    isLoading={benefitDataLoading}
                    type='profilelist'
                    profileListConfiguration={{ rows: 5 }}
                  />
                ) : (
                  <>
                    {benefitData?.length > 0 ? benefitsTab() : noData}
                    {benefitData?.length > 0 ? (
                      <SeeAllButtonDisplay type='benefits' title={'Benefits'} />
                    ) : null}
                  </>
                )}
              </TabPane>
            )}

            <TabPane tab='Users' key='users' className='result-tabpane'>
              {profileDataLoading ? (
                <ElementOrSkeleton
                  isLoading={profileDataLoading}
                  type='profilelist'
                  profileListConfiguration={{ rows: 5 }}
                />
              ) : (
                <>
                  {profileData?.length > 0 ? usersTab() : noData}
                  {profileData?.length > 0 ? (
                    <SeeAllButtonDisplay type='users' title={'Users'} />
                  ) : null}
                </>
              )}
            </TabPane>
          </Tabs>
        </div>
      </Menu.Item>
    </Menu>
  );

  return (
    <div ref={parentRef} className='search-bar-common-container'>
      <Dropdown
        className='search-dropdown'
        getPopupContainer={() =>
          document.getElementsByClassName(
            'search-bar-common-container',
          )[0] as HTMLDivElement
        }
        overlay={menu}
        overlayStyle={{
          width: '550px',
        }}
        placement={placement !== undefined ? placement : 'bottomLeft'}
        trigger={['click']}
        visible={resultDivVisibility}
        overlayClassName='search-bar-dd'
      >
        <Search
          placeholder='Search'
          className='serach-bar'
          value={inputText}
          loading={isLoadinSearchData}
          onClick={() => {
            updateResultDivVisibility(true);
          }}
          onChange={onChangeHandler}
        />
      </Dropdown>
    </div>
  );
};

const mapStateToProps = (state: stateInterface) => ({
  data: state.searchBar.limitedResultsData,
  isLoading: state.searchBar.limitedResultsLoading,
  expenseData: state.searchBar.limitedResultsExpenseData,
  expenseDataLoading: state.searchBar.limitedResultsExpenseLoading,
  requestData: state.searchBar.limitedResultsRequestData,
  requestDataLoading: state.searchBar.limitedResultsRequestLoading,
  benefitData: state.searchBar.limitedResultsBenefitData,
  benefitDataLoading: state.searchBar.limitedResultsBenefitLoading,
  profileData: state.searchBar.limitedResultsProfileData,
  profileDataLoading: state.searchBar.limitedResultsProfileLoading,
  getPermissions: getPermissions(state),
  tenantConfig: state.configuration.tenantConfig,
});

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  _fetchUsersFromSearchBar: (val: string, currentTab: string) =>
    dispatch(fetchLimitedUsersFromSearchBar(val, currentTab)),
  _resetAllTabSearchbarData: () => dispatch(fetchUserRequestSuccess([])),
  _resetExpensesTabSearchbarData: () =>
    dispatch(fetchUserRequestForExpenseSuccess([])),
  _resetRequestsTabSearchbarData: () =>
    dispatch(fetchUserRequestForRequestSuccess([])),
  _resetUsersTabSearchbarData: () =>
    dispatch(fetchUserRequestForProfileSuccess([])),

  _resetLimitedSearchbarData: () =>
    dispatch(fetchLimitedUserRequestSuccess([])),
  _resetLimitedExpensesSearchbarData: () =>
    dispatch(fetchLimitedUserRequestForExpensesSuccess([])),
  _resetLimitedRequestsSearchbarData: () =>
    dispatch(fetchLimitedUserRequestForRequestsSuccess([])),
  _resetLimitedUsersSearchbarData: () =>
    dispatch(fetchLimitedUserRequestForProfilesSuccess([])),
});

const connector = connect(mapStateToProps, mapDispatchToProps);
export default memo(connector(SearchBar));
