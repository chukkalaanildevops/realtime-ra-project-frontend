import React, { FC, memo, Dispatch, useEffect, useState } from 'react';
import { List, Avatar, Input, Pagination, Button } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { connect, ConnectedProps } from 'react-redux';
import { stateInterface } from '../../../../../../../../shared/redux/rootReducer';
import { Iemployee } from '../../employeeGroupsListing.model';
import { fetchEmployeeGroupsSelectedEmployees } from '../../employeeGroupsListing.thunk';
import DefaultAvtar from '../../../../../../../../assets/images/default/avatar.png';
import './employeeList.index.less';
import { removeEmployeeFromIndividualCatThunk } from '../../../addEmployeeGroups/addEmployeeGroups.thunk';
import { Trans } from '@lingui/macro';

const mapStateToProps = (state: stateInterface) => {
  const {
    employee_group_selected,
    employee_list,
    pagination_data,
    employe_list_loader,
  } = state.employeeGroupsListing;
  return {
    employee_group_selected,
    employee_list,
    pagination_data,
    employe_list_loader,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  return {
    _fetchEmployeeGroupsSelectedEmployees: (
      id: number,
      page: number = 1,
      search: string = '',
    ) => dispatch(fetchEmployeeGroupsSelectedEmployees(id, page, search)),
    _removeEmployeeFromIndividualCatThunk: (
      employeeGroupId: number,
      removedEmployees: number[],
    ) =>
      dispatch(
        removeEmployeeFromIndividualCatThunk(employeeGroupId, removedEmployees),
      ),
  };
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type TProps = ConnectedProps<typeof connector>;

const EmployeeList: FC<TProps> = props => {
  const {
    employee_group_selected,
    employee_list,
    employe_list_loader,
    pagination_data,
    _fetchEmployeeGroupsSelectedEmployees,
    _removeEmployeeFromIndividualCatThunk,
  } = props;

  const { Search } = Input;
  const [getPageNo, setPageNo] = useState<number>(1);
  const [getSearchPageNo, setSearchPageNo] = useState<number>(1);
  const [getSearch, setSearch] = useState<string>('');

  let employeeCount = pagination_data.total_records
    ? pagination_data.total_records
    : employee_list?.length;
  employeeCount = employeeCount ? employeeCount : 0;

  useEffect(() => {
    //ComponentDidMount
    _fetchEmployeeGroupsSelectedEmployees(
      employee_group_selected?.id as number,
      getPageNo,
      getSearch,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEmployeeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const _value = e?.target?.value;

    if (_value !== getSearch) {
      setSearch(_value);
      let pageNo = getPageNo || 1;
      if (_value === '') {
        pageNo = getPageNo || 1;
        setPageNo(pageNo);
      } else {
        pageNo = 1;
        setSearchPageNo(pageNo);
      }
      _fetchEmployeeGroupsSelectedEmployees(
        employee_group_selected?.id as number,
        pageNo,
        _value,
      );
    }
  };

  const handlePageChange = (page: number) => {
    !getSearch ? setPageNo(page) : setSearchPageNo(page);

    _fetchEmployeeGroupsSelectedEmployees(
      employee_group_selected?.id as number,
      page,
      getSearch,
    );
  };

  const handleRemoveEmployeeClick = async (
    removeEmpId: number,
    _event: React.MouseEvent<HTMLElement, MouseEvent>,
  ) => {
    await _removeEmployeeFromIndividualCatThunk(
      employee_group_selected?.id as number,
      [removeEmpId],
    );
    _fetchEmployeeGroupsSelectedEmployees(
      employee_group_selected?.id as number,
    );
  };

  return (
    <div
      className='employee-list-container'
      data-testId='employeeListContainer'
    >
      <div className='header-section'>
        <span className='heding'>
          <Trans>Group Employees</Trans>{' '}
        </span>
        <span className='emp-count'>
          <Trans>Total</Trans> : {employeeCount}{' '}
        </span>
      </div>
      <>
        <Search
          // value={getSearch}
          defaultValue={getSearch}
          title='Input search text to search'
          placeholder='Input search text to search'
          // onSearch={handleEmployeeSearch}
          onChange={handleEmployeeSearch}
          // onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          //   setSearch(e.target.value)
          // }
          enterButton={false}
          data-test='serachInput'
          size='middle'
          loading={employe_list_loader}
        />
        <List
          className='employee-list'
          data-test='employeeList'
          itemLayout='horizontal'
          dataSource={employee_list as Iemployee[]}
          loading={employe_list_loader}
          renderItem={item => (
            <List.Item data-test='employeeListItem'>
              <List.Item.Meta
                avatar={<Avatar className='user-pic' src={DefaultAvtar} />}
                title={
                  <>
                    <div
                      className='user-name'
                      title={item.legal_name || item.name}
                    >
                      {item.legal_name || item.name}
                    </div>
                    <div className='user-role' title={item.email}>
                      {item.email}
                    </div>
                    {employee_group_selected?.criteria.code === 'INDSELU' ? (
                      <Button
                        className='user-remove-btn'
                        type='link'
                        icon={<CloseOutlined />}
                        size='small'
                        onClick={handleRemoveEmployeeClick.bind(null, item.id)}
                      />
                    ) : null}
                  </>
                }
              />
            </List.Item>
          )}
        />{' '}
      </>
      <Pagination
        onChange={handlePageChange}
        current={!getSearch ? getPageNo : getSearchPageNo}
        total={employeeCount}
        pageSize={10}
        hideOnSinglePage={true}
        showSizeChanger={false}
      />
    </div>
  );
};

export default memo(connector(EmployeeList));
