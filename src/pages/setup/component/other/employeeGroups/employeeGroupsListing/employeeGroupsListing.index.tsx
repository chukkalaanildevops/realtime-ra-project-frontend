import React, { memo, FC, useEffect, Dispatch, ReactNode } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { message, Table, Skeleton, Row, Col } from 'antd';
import {
  EllipsisOutlined,
  FullscreenOutlined,
  EditTwoTone,
  DeleteTwoTone,
} from '@ant-design/icons';
import {
  AppDrawer,
  FilterBar,
  HeaderBarWrapper,
  DotMenu,
} from '../../../../../../shared/components';
import { appPath } from '../../../../../app/app.routes';
import {
  stateInterface,
  getPermissions,
} from '../../../../../../shared/redux/rootReducer';
import EmployeeList from './components/employeeList/employeeList.index';
import {
  apiCallReset,
  resetToInitial,
  updateEmployeeGroupSelected,
} from './employeeGroupsListing.action';
import {
  fetchEmployeeGroupList,
  deleteEmployeeGroup,
} from './employeeGroupsListing.thunk';
import {
  IemployeeGroup,
  TemployeeGroupSelected,
} from './employeeGroupsListing.model';
import { timeZoneMomentDate } from '../../../../../../utils/global.utils';
import { useTableFilters } from '../../../../../../shared/hooks';
import './employeeGroupsListing.index.less';
import { Trans } from '@lingui/macro';

const mapStateToProps = (state: stateInterface) => {
  const {
    employee_group_list,
    employee_group_selected,
    error,
    info,
    success,
    isLoading,
    employee_group_list_loader,
  } = state.employeeGroupsListing;
  return {
    employee_group_list,
    employee_group_selected,
    error,
    info,
    success,
    isLoading,
    employee_group_list_loader,
    getPermissions: getPermissions(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  return {
    _apiCallReset: () => dispatch(apiCallReset()),
    _resetToInitial: () => dispatch(resetToInitial()),
    _fetchEmployeeGroupList: () => dispatch(fetchEmployeeGroupList()),
    _updateEmployeeGroupSelected: (data: TemployeeGroupSelected) =>
      dispatch(updateEmployeeGroupSelected(data)),
    _deleteEmployeeGroup: (id: number) => dispatch(deleteEmployeeGroup(id)),
  };
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type Tprops = ConnectedProps<typeof connector>;

const EmployeeGroups: FC<Tprops> = props => {
  const {
    employee_group_list,
    employee_group_selected,
    error,
    info,
    success,
    isLoading,
    employee_group_list_loader,
    getPermissions,
    _apiCallReset,
    _resetToInitial,
    _fetchEmployeeGroupList,
    _updateEmployeeGroupSelected,
    _deleteEmployeeGroup,
  } = props;

  const history = useHistory();
  const {
    getSearchProps,
    getCheckBoxFilterProps,
    getDateSortFilterProps,
  } = useTableFilters();
  const getElemOrSkeleton = (
    _text: string | ReactNode,
    _record?: any,
    _index?: number,
  ) => {
    return employee_group_list_loader ? (
      <Skeleton.Input size='small' active={employee_group_list_loader} />
    ) : (
      _text
    );
  };

  const data = employee_group_list.map((o: IemployeeGroup, _index: number) => ({
    title: o.title,
    criteria: o.criteria.title,
    createdBy: o.created_by.legal_name || o.created_by.name,
    createdOn: o.created_on
      ? timeZoneMomentDate(o.created_on).format('DD/MM/YYYY')
      : '',
    item: o,
  }));

  const columns = [
    {
      key: 'TITLE',
      title: () => getElemOrSkeleton(<Trans>Title</Trans>),
      dataIndex: 'title',
      ...getSearchProps('title', getElemOrSkeleton),
    },
    {
      key: 'CRITERIA',
      title: () => getElemOrSkeleton(<Trans>Criteria</Trans>),
      dataIndex: 'criteria',
      render: getElemOrSkeleton,
      ...getCheckBoxFilterProps(
        [
          {
            text: 'All Employees',
            value: 'All Employees',
          },
          {
            text: 'Direct Reports',
            value: 'Direct Reports',
          },
          {
            text: 'Level 2 Reports',
            value: 'Level 2 Reports',
          },
          {
            text: 'Level 3 Reports',
            value: 'Level 3 Reports',
          },
          {
            text: 'L2 with Direct Reports',
            value: 'L2 with Direct Reports',
          },
          {
            text: 'L3 with Direct Reports',
            value: 'L3 with Direct Reports',
          },
          {
            text: 'L3 with L2 and Direct Reports',
            value: 'L3 with L2 and Direct Reports',
          },
          {
            text: 'Entity Members',
            value: 'Entity Members',
          },
          {
            text: 'Individually Selected Users',
            value: 'Individually Selected Users',
          },
          {
            text: 'Custom',
            value: 'Custome',
          },
        ],
        'criteria',
      ),
    },
    {
      key: 'CREATED_BY',
      title: () => getElemOrSkeleton(<Trans>Created By</Trans>),
      dataIndex: 'createdBy',
      ...getSearchProps('createdBy', getElemOrSkeleton),
    },
    {
      key: 'CREATED_ON',
      title: () => getElemOrSkeleton(<Trans>Created On</Trans>),
      dataIndex: 'createdOn',
      render: getElemOrSkeleton,
      ...getDateSortFilterProps('createdOn'),
    },
    {
      key: 'ACTION',
      title: () => getElemOrSkeleton(<Trans>Action</Trans>),
      width: 90,
      align: 'center' as 'center',
      render: (_text: string, _record: any, _index: number) => {
        const criteriaCondition =
          isPerformActionOrNot(_record.criteria) || false;
        return employee_group_list_loader ? (
          <Skeleton.Input size='small' active={employee_group_list_loader} />
        ) : (
          <DotMenu
            menuVisibility={true}
            actionBtn={[
              {
                OnClick: () => {
                  history.push(
                    `${appPath.config_setup.employeeGroups.update.linkTo}${_record.item.id}`,
                  );
                },
                Disabled: criteriaCondition || false,
                Type: 'link',
                title: criteriaCondition
                  ? 'You can not perform action on this group'
                  : undefined,
                children: (
                  <>
                    <Trans>Update</Trans>
                  </>
                ),
                icon: EditTwoTone,
              },
              {
                OnClick: (_e: React.MouseEvent<HTMLElement, MouseEvent>) => {
                  _deleteEmployeeGroup(_record.item.id);
                },
                Disabled: criteriaCondition || false,
                Type: 'link',
                children: (
                  <>
                    <Trans>Delete</Trans>
                  </>
                ),
                icon: DeleteTwoTone,
                title: criteriaCondition
                  ? 'You can not perform action on this group'
                  : undefined,
              },
            ]}
          >
            <EllipsisOutlined />
          </DotMenu>
        );
      },
    },
  ];

  const getColumns = () => {
    const toBeRemovedIndexes: any = [];
    for (let index = 0; index < columns.length; index++) {
      const item = columns[index];
      if (
        item.key === 'ACTION' &&
        !getPermissions.ACTION_SETUP_EMPLOYEE_GROUPS
      ) {
        toBeRemovedIndexes.push(index);
      }
    }
    const newColumns = columns.filter(
      (_item, index) => !toBeRemovedIndexes.includes(index),
    );
    return newColumns;
  };

  const isPerformActionOrNot = (value: string = '') => {
    return (
      value === 'All Employees' ||
      // value === 'Level 1 Reports' ||
      value === 'Direct Reports' ||
      value === 'Level 2 Reports' ||
      value === 'Level 3 Reports' ||
      value === 'L2 with Direct Reports' ||
      value === 'L3 with Direct Reports' ||
      value === 'L3 with L2 and Direct Reports' ||
      value === 'Entity Members' ||
      value === 'Self'
    );
  };

  useEffect(() => {
    /* ComponentDidMount */
    _apiCallReset();
    _fetchEmployeeGroupList(); //API Get Call
    return () => {
      /* ComponentWillUnmount */
      message.destroy();
      _resetToInitial();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    message.destroy();
    if (isLoading) message.loading(info, 0);
    else if (success) message.success(success, 2, _apiCallReset);
    else if (error) message.error(error, 2, _apiCallReset);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, success, error, info]);

  return (
    <HeaderBarWrapper
      headerCommonProps={{ title: <Trans>Employee Groups</Trans> }}
      data-test='employeeGroupsWrapper'
    >
      <div
        className='employee-groups-listing-container'
        data-testId='employeeGroupsListingContainer'
      >
        <FilterBar
          isLoading={employee_group_list_loader}
          isAddButton={getPermissions.ACTION_SETUP_EMPLOYEE_GROUPS}
          addButtonOnClickFn={() => {
            history.push(appPath.config_setup.employeeGroups.add.linkTo);
          }}
          isAddButtonDisabled={false}
          enableBackBtn={true}
          backBtnUrl={appPath.config_setup.employeeGroups.backLink}
          data-testId='filterBar'
        />
        <Table
          data-test='expenseTypeListingTable'
          columns={getColumns() as any}
          dataSource={data}
          bordered
          rowKey={record => record.item.id}
          pagination={false}
          expandable={{
            expandedRowRender: () => null,
            rowExpandable: () => true,
            expandIcon: ({ record }) => {
              return employee_group_list_loader ? (
                <Skeleton.Input
                  size='small'
                  active={employee_group_list_loader}
                />
              ) : (
                <FullscreenOutlined
                  onClick={() => _updateEmployeeGroupSelected(record.item)}
                  title='Details'
                />
              );
            },
          }}
        />
        <AppDrawer
          width='40%'
          data-test='appDrawer'
          title={<Trans>Employee Group Detail</Trans>}
          visible={employee_group_selected !== null}
          destroyOnClose={true}
          closable={true}
          onClose={() => {
            _updateEmployeeGroupSelected(null);
          }}
          bodyStyle={{ paddingLeft: 0, paddingRight: 0, paddingBottom: 0 }}
          showCancelButton={false}
          showOkButton={false}
          getContainer='.employee-groups-listing-container'
        >
          <>
            <Row className='employee-group-detail-info'>
              {employee_group_selected?.title ? (
                <Col span={12}>
                  <span className='text-label'>
                    <Trans>Title</Trans>
                  </span>
                  <span className='text-content' data-test=''>
                    {employee_group_selected.title}
                  </span>
                </Col>
              ) : null}
              {employee_group_selected?.created_on ? (
                <Col span={12}>
                  <span className='text-label'>
                    <Trans>Created On</Trans>
                  </span>
                  <span className='text-content' data-test=''>
                    {timeZoneMomentDate(
                      employee_group_selected.created_on,
                    ).format('DD/MM/YYYY')}
                  </span>
                </Col>
              ) : null}
              {employee_group_selected?.created_by?.legal_name ||
              employee_group_selected?.created_by?.name ? (
                <Col span={12}>
                  <span className='text-label'>
                    <Trans>Created By</Trans>
                  </span>
                  <span className='text-content' data-test=''>
                    {employee_group_selected?.created_by?.legal_name ||
                      employee_group_selected.created_by?.name}
                  </span>
                </Col>
              ) : null}
              {employee_group_selected?.criteria ? (
                <Col span={12}>
                  <span className='text-label'>
                    <Trans>Criteria</Trans>
                  </span>
                  <span className='text-content' data-test=''>
                    {employee_group_selected.criteria.title}
                    {employee_group_selected.criteria.code === 'CUSTOMU' && (
                      <span>
                        &nbsp; (Employees who belong to any of the following
                        {` ${employee_group_selected.custom_config[0].entity_type.title}`}
                        :{' '}
                        {` ${employee_group_selected.custom_config[0].entities
                          .map((i: any) => i.title)
                          .join(', ')}`}
                        )
                      </span>
                    )}
                  </span>
                </Col>
              ) : null}
            </Row>
            <EmployeeList />
          </>
        </AppDrawer>
      </div>
    </HeaderBarWrapper>
  );
};

export default connector(memo(EmployeeGroups));
