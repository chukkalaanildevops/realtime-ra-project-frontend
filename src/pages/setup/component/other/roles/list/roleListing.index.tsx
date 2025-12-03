import React, { Dispatch, memo, useEffect, useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
  AppDrawer,
  BrokenLink,
  ElementOrSkeleton,
  ErrorBoundary,
  FilterBar,
  HeaderBarWrapper,
  SearchableMultiUserDropdown,
} from '../../../../../../shared/components';
import { stateInterface } from '../../../../../../shared/redux/rootReducer';
import { deleteRole, fetchRoles, setPageLoader } from '../roles.thunk';
import { EditOutlined, CloseOutlined } from '@ant-design/icons';
import '../roles.index.less';
import Table from 'antd/lib/table';
import { ColumnsType } from 'antd/lib/table';
import { FullscreenOutlined } from '@ant-design/icons';
import { appPath } from '../../../../../app/app.routes';
import { Avatar, Button, Form, List, message, Pagination } from 'antd';
import { IConfirmationInfo } from '../../../../../app/app.model';
import {
  setConfirmationInfo,
  resetConfirmationInfo,
} from '../../../../../app/app.actions';
import {
  addNewRoleAssignmentsService,
  deleteRoleAssignmentsService,
  fetchRoleAssignmentsService,
} from '../../../../../../services/roles';
import { AxiosResponse } from 'axios';
import { UserOutlined } from '@ant-design/icons';
import { useTableFilters } from '../../../../../../shared/hooks';
import defaultUserImage from '../../../../../../assets/images/default/user.png';
import { Trans } from '@lingui/macro';

let initialPageSize = 12;

const mapStateToProps = (state: stateInterface) => {
  const { isLoading, serviceCallFailed, roles, serviceCallError } = state.roles;
  return {
    isLoading: isLoading,
    serviceCallFailed: serviceCallFailed,
    serviceCallError: serviceCallError,
    roles: roles,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  return {
    _fetchRoles: () => dispatch(fetchRoles()),
    _setLoader: (isLoading: boolean) => dispatch(setPageLoader(isLoading)),
    _deleteRole: (roleId: number) => dispatch(deleteRole(roleId)),
    _setConfirmationInfo: (data: IConfirmationInfo) =>
      dispatch(setConfirmationInfo(data)),
    _resetConfirmationInfo: () => dispatch(resetConfirmationInfo()),
  };
};

const connector = connect(mapStateToProps, mapDispatchToProps);

const RoleListing: React.FC<ConnectedProps<typeof connector>> = props => {
  const {
    isLoading,
    serviceCallError,
    serviceCallFailed,
    roles,
    _fetchRoles,
    _deleteRole,
    _setLoader,
    _setConfirmationInfo,
    _resetConfirmationInfo,
  } = props;

  const { getSearchProps, getCheckBoxFilterProps } = useTableFilters();
  const [pageSize, setPageSize] = useState(initialPageSize);
  useEffect(() => {
    _fetchRoles();
    // eslint-disable-next-line
  }, []);

  const { push } = useHistory();

  const [roleAssignmentsLoading, setRoleAssignmentLoading] = useState<boolean>(
    false,
  );
  const [selectedUsersForAssignment, setSelectedUsersForAssignment] = useState<
    number[]
  >([]);
  const [totalAssignees, setTotalAssignees] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);

  const fetchRoleAssignments = async (
    roleId: number,
    roleTitle: string,
    page: number,
    pageSize: number,
  ) => {
    try {
      setRoleAssignmentLoading(true);
      const response: AxiosResponse = await fetchRoleAssignmentsService(
        roleId,
        page,
        pageSize,
      );

      updateAppDrawerPropsForAssignments(
        true,
        `Assignments For ${roleTitle}`,
        roleId,
        roleTitle,
        response.data.data,
        response.data.pagination_data,
      );
      setRoleAssignmentLoading(false);
    } catch (error) {
      message.error('Role assignments could not be fetched.');
      setRoleAssignmentLoading(false);
    }
  };

  const [appDrawerProps, setAppDrawerProps] = useState<{
    visible: boolean;
    title: any;
    roleId: number;
    roleTitle: string;
    drawerItem: 'permission' | 'assignment';
    permissions?: { [key: string]: any }[];
    assignments?: { [key: string]: any }[];
    paginationData?: { [key: string]: any };
  } | null>(null);

  const updateAppDrawerPropsForPermissions = (
    visible: boolean,
    title: any,
    roleId: number,
    roleTitle: string,
    permissions: { [key: string]: any }[],
  ) => {
    setAppDrawerProps({
      visible: visible,
      title: title,
      roleId: roleId,
      roleTitle: roleTitle,
      drawerItem: 'permission',
      permissions: permissions,
    });
  };

  const updateAppDrawerPropsForAssignments = (
    visible: boolean,
    title: any,
    roleId: number,
    roleTitle: string,
    assignments: { [key: string]: any }[],
    paginationData: { [key: string]: any },
  ) => {
    setAppDrawerProps({
      visible: visible,
      title: title,
      roleId: roleId,
      roleTitle: roleTitle,
      drawerItem: 'assignment',
      assignments: assignments,
      paginationData: paginationData,
    });
  };

  const getRolesTable = () => {
    let columns: ColumnsType<any> = [
      {
        title: <Trans>Title</Trans>,
        key: 'title',
        dataIndex: 'title',
        ...getSearchProps('title'),
      },
      {
        title: <Trans>Description</Trans>,
        key: 'description',
        dataIndex: 'description',
        ...getSearchProps('description'),
      },
      {
        title: <Trans>System Defined</Trans>,
        key: 'is_editable',
        dataIndex: 'is_editable',
        align: 'center',
        ...getCheckBoxFilterProps(
          [
            {
              text: <Trans>Yes</Trans>,
              value: 'false',
            },
            {
              text: <Trans>No</Trans>,
              value: 'true',
            },
          ],
          'is_editable',
        ),
        render: (_text: string, _record: any) =>
          _record.is_editable ? 'No' : 'Yes',
      },
      {
        title: <Trans>Target Audience</Trans>,
        key: 'target_audience',
        dataIndex: 'target_audience',
        align: 'center',
        // ...getSearchProps('target_audience', (_text: string, _record: any) =>
        //   _record.target_audience === null
        //     ? 'Self'
        //     : _record.target_audience.title,0
        // ),
        render: (_text: string, _record: any) =>
          _record.target_audience === null
            ? 'Self'
            : _record.target_audience.title,
      },
      {
        title: <Trans>Assignees</Trans>,
        key: 'assigned_to',
        dataIndex: 'assigned_to',
        align: 'center',
        sorter: (a, b) =>
          (a?.number_of_assignees || 0) - (b?.number_of_assignees || 0),
        render: (_text: string, _record: any) => (
          <Button
            type='link'
            onClick={_event => {
              updateAppDrawerPropsForAssignments(
                true,
                `Assignments For Role ${_record.title} (${_record.number_of_assignees})`,
                _record.id,
                _record.title,
                [],
                {},
              );
              setTotalAssignees(_record.number_of_assignees);
              fetchRoleAssignments(
                _record.id,
                _record.title,
                1,
                initialPageSize,
              );
              setPageNumber(1);
              setPageSize(initialPageSize);
            }}
          >
            <span>
              {_record.number_of_assignees !== undefined
                ? _record.number_of_assignees
                : 0}{' '}
            </span>
            <UserOutlined />
          </Button>
        ),
      },
      {
        title: <Trans>Actions</Trans>,
        key: 'action',
        dataIndex: 'action',
        align: 'center',
        render: (_text: string, _record: any) => {
          if (_record.is_editable === true) {
            return (
              <div className='buttons'>
                <Button
                  type='link'
                  icon={<EditOutlined />}
                  onClick={_event => {
                    push(
                      `${appPath.config_setup.roles.update.linkTo}${_record.id}`,
                    );
                  }}
                  title='Edit'
                />
                <Button
                  type='link'
                  icon={<CloseOutlined />}
                  title='Delete'
                  onClick={_event => {
                    _setConfirmationInfo({
                      bodyText: `Do you want to delete ${_record.title} role?`,
                      cancelText: 'Cancel',
                      okText: 'Delete',
                      visibility: true,
                      headerText: 'Confirm',
                      extraInfo: '',
                      forWhat: '',
                      cancelBtnFn: _resetConfirmationInfo,
                      okBtnFn: () => {
                        _deleteRole(_record.id);
                        _resetConfirmationInfo();
                      },
                    });
                  }}
                />
              </div>
            );
          }
          return <></>;
        },
      },
    ];

    return (
      <>
        <FilterBar
          isAddButton={true}
          addButtonOnClickFn={() => {
            _setLoader(true);
            push(`${appPath.config_setup.roles.add.path}`);
          }}
          enableBackBtn={true}
          backBtnUrl={appPath.config_setup.roles.backLink}
        />
        <Table
          bordered={true}
          columns={columns}
          pagination={false}
          dataSource={roles}
          expandable={{
            expandedRowRender: () => null,
            rowExpandable: () => true,
            expandIcon: ({ record }) => {
              if (record.title === 'Employee') {
                return (
                  <FullscreenOutlined
                    style={{
                      pointerEvents: 'none',
                      color: '#a1b2c2',
                    }}
                  />
                );
              } else {
                return (
                  <FullscreenOutlined
                    onClick={() =>
                      updateAppDrawerPropsForPermissions(
                        true,
                        'Permissions For ' + record.title,
                        record.id,
                        record.title,
                        record.permissions,
                      )
                    }
                    title='Permissions'
                  />
                );
              }
            },
          }}
          rowKey='id'
          className='role-listing-table'
        />
      </>
    );
  };

  const addNewAssignments = async () => {
    if (appDrawerProps?.roleId !== undefined) {
      await addNewRoleAssignmentsService(
        appDrawerProps?.roleId,
        selectedUsersForAssignment,
      );
      message.success(
        `Role ${appDrawerProps.roleTitle} has been assigned to ${selectedUsersForAssignment?.length} employees`,
      );
      setSelectedUsersForAssignment([]);
      if (appDrawerProps?.roleTitle !== undefined) {
        fetchRoleAssignments(
          appDrawerProps?.roleId,
          appDrawerProps?.roleTitle,
          pageNumber,
          pageSize,
        );
      }
    }
  };

  const handlePageChange = (page: number, pageSize: any) => {
    if (appDrawerProps?.roleTitle !== undefined) {
      fetchRoleAssignments(
        appDrawerProps?.roleId,
        appDrawerProps?.roleTitle,
        page,
        pageSize,
      );
      setPageNumber(page);
    }
  };

  const handleRemoveEmployeeClick = async (employeeId: number) => {
    if (appDrawerProps?.roleId !== undefined) {
      await deleteRoleAssignmentsService(appDrawerProps?.roleId, [employeeId]);
      message.success(`Role ${appDrawerProps.roleTitle} has been removed for`);
      if (appDrawerProps?.roleTitle !== undefined) {
        fetchRoleAssignments(
          appDrawerProps?.roleId,
          appDrawerProps?.roleTitle,
          pageNumber,
          pageSize,
        );
      }
    }
  };

  const handleAppDrawerClose = () => {
    if (appDrawerProps?.drawerItem === 'assignment') {
      setAppDrawerProps(null);
      // _fetchRoles();
    } else {
      setAppDrawerProps(null);
    }
  };

  const usersList = appDrawerProps?.assignments?.sort((a: any, b: any) => {
    const usersNameA = a?.legal_name ? a?.legal_name : a?.name;
    const usersNameB = b?.legal_name ? b?.legal_name : b?.name;

    return usersNameA.localeCompare(usersNameB);
  });

  return (
    <HeaderBarWrapper
      headerCommonProps={{
        title: <Trans>Roles</Trans>,
      }}
    >
      <div className='roles-container'>
        <ElementOrSkeleton isLoading={isLoading} type='table'>
          {(!isLoading && !serviceCallFailed && getRolesTable()) ||
            (!isLoading && serviceCallFailed && (
              <BrokenLink
                description={serviceCallError}
                onTryAgain={() => {
                  _fetchRoles();
                }}
              />
            ))}
        </ElementOrSkeleton>
      </div>
      <ErrorBoundary>
        <AppDrawer
          width={'50%'}
          visible={appDrawerProps?.visible}
          title={appDrawerProps?.title}
          closable={true}
          getContainer='.roles-container'
          showCancelButton={false}
          showOkButton={false}
          onCancelClick={() => handleAppDrawerClose()}
          onClose={() => handleAppDrawerClose()}
          className='.app-drawer no-header-border'
        >
          {appDrawerProps?.visible &&
            appDrawerProps.drawerItem === 'permission' && (
              <ul>
                {appDrawerProps.permissions?.map((item: any) => (
                  <li>{item.title}</li>
                ))}
              </ul>
            )}
          {appDrawerProps?.visible &&
            appDrawerProps.drawerItem === 'assignment' && (
              <ElementOrSkeleton
                isLoading={roleAssignmentsLoading}
                isActive={true}
                type='profilelist'
              >
                <div className='assignments'>
                  <Form
                    layout='vertical'
                    className='assignment-form'
                    onFinish={_values => addNewAssignments()}
                  >
                    <Form.Item label={<Trans>Employees</Trans>} name='users'>
                      <SearchableMultiUserDropdown
                        placeholder='Employees'
                        preSelectedValues={selectedUsersForAssignment}
                        onSelect={value =>
                          setSelectedUsersForAssignment([
                            ...selectedUsersForAssignment,
                            value,
                          ])
                        }
                        onDeselect={value =>
                          setSelectedUsersForAssignment(
                            selectedUsersForAssignment.filter(
                              (item: any) => item !== value,
                            ),
                          )
                        }
                        valuesToExclude={appDrawerProps.assignments}
                      />
                    </Form.Item>
                    <div className='button'>
                      <Button htmlType='submit' type='primary'>
                        <Trans>Assign</Trans>
                      </Button>
                    </div>
                  </Form>
                  <div className='assignment-container'>
                    <List
                      className='employee-list'
                      data-test='employeeList'
                      itemLayout='horizontal'
                      dataSource={usersList}
                      loading={roleAssignmentsLoading}
                      renderItem={item => (
                        <List.Item data-test='employeeListItem' key={item.id}>
                          <List.Item.Meta
                            avatar={
                              <Avatar
                                className='user-pic'
                                src={defaultUserImage}
                              />
                            }
                            title={
                              <>
                                <div
                                  className='user-name'
                                  title={item?.legal_name || item?.name}
                                >
                                  {item?.legal_name || item?.name}
                                </div>
                                <div
                                  className='user-role'
                                  title={
                                    item.email !== undefined &&
                                    item.email?.length > 0
                                      ? item.email
                                      : 'Email unavailable'
                                  }
                                >
                                  {item.email !== undefined &&
                                  item.email?.length > 0
                                    ? item.email
                                    : 'Email unavailable'}
                                </div>
                                <Button
                                  className='user-remove-btn'
                                  type='link'
                                  icon={<CloseOutlined />}
                                  size='small'
                                  onClick={handleRemoveEmployeeClick.bind(
                                    null,
                                    item.id,
                                  )}
                                />
                              </>
                            }
                          />
                        </List.Item>
                      )}
                    />
                  </div>
                  <Pagination
                    onChange={handlePageChange}
                    current={pageNumber}
                    pageSize={pageSize || 12}
                    pageSizeOptions={['10', '12', '20', '50', '100']}
                    showSizeChanger={true}
                    onShowSizeChange={(_current: number, size: number) => {
                      setPageSize(size);
                    }}
                    total={totalAssignees}
                    showTotal={(total: number, range: number[]) => {
                      return <>{`${range[0]}-${range[1]} of ${total}`}</>;
                    }}
                    showQuickJumper={{
                      goButton: (
                        <Button type='default'>
                          <Trans>Go</Trans>
                        </Button>
                      ),
                    }}
                  />
                </div>
              </ElementOrSkeleton>
            )}
        </AppDrawer>
      </ErrorBoundary>
    </HeaderBarWrapper>
  );
};

export default memo(connector(RoleListing));
