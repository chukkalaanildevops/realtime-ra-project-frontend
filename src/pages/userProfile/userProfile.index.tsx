/* eslint-disable react-hooks/exhaustive-deps */
import React, { Dispatch, useEffect, useState } from 'react';
import {
  BackButton,
  HeaderBarWrapper,
  SkeletonItem,
} from '../../shared/components';
import {
  getProfileData,
  getProfileLoader,
  getProfileErrorMessage,
  getRoles,
  getSystemLabelsCustomisation,
} from '../../shared/redux/rootReducer';
import { setError, saveUserData } from './userProfile.action';
import {
  fetchUserProfile,
  fetchRoles,
  updateUserRoles,
  fetchApproversCustomFieldsList,
} from './userProfile.thunk';
import { fetchSystemLabelsCustomisation } from '../systemLabelsCustomisation/systemLabelsCustomisation.thunk';
import { connect, ConnectedProps } from 'react-redux';
import { message, Col, Row, Form, Input, Button, Select } from 'antd';
// import { SelectOutlined } from '@ant-design/icons';
import './userProfile.index.less';
import { Trans } from '@lingui/macro';
import moment from 'moment';

const { Option } = Select;

const UserProfile: React.FC<ConnectedProps<typeof connector>> = ({
  fetchSystemLabelsCustomisation,
  _fetchProfileData,
  fetchRoles,
  updateUserRoles,
  _setError,
  _clearProfile,
  error,
  isLoader,
  userProfile,
  roles,
  authUser,
  systemLabelsCustomisation,
  employeeApproversData,
  _fetchApproversCustomFieldsList,
}) => {
  let page = 1;
  let pageSize = 1;

  const [form] = Form.useForm();
  const [
    isUpdateRoleContainerHidden,
    setIsUpdateRoleContainerHidden,
  ] = useState<boolean>(true);

  const [selectedRoles, setSelectedRoles] = useState<number[]>([]);

  useEffect(() => {
    if (authUser?.id) {
      _fetchProfileData();
      fetchRoles();
      fetchSystemLabelsCustomisation();
      _fetchApproversCustomFieldsList(
        page,
        pageSize,
        authUser?.id,
        moment().format('YYYY/MM/DD'),
        '-effective_from',
      );
      return () => {
        _clearProfile();
      };
    }
  }, [authUser]);

  useEffect(() => {
    const values = {
      ...userProfile,
      is_active:
        userProfile?.is_active === true
          ? 'Active'
          : userProfile?.is_active === false
          ? 'Inactive'
          : '',
    };
    form.setFieldsValue(values);
    setSelectedRoles(values.roles?.map((item: any) => item.id));
  }, [userProfile]);

  useEffect(() => {
    if (error) {
      message.error(error, 2, _setError);
    }
  }, [error]);

  useEffect(() => {
    if (isLoader) {
      message.loading('Loading Profile', 0);
    } else {
      message.destroy();
    }
  }, [isLoader]);

  let rolesNames = userProfile?.roles.map((item: any) => item.title);
  if (rolesNames) {
    rolesNames = rolesNames.join(', ');
  }

  const onUpdateRoles = () => {
    const roles = selectedRoles;
    const userId = userProfile.employee;
    updateUserRoles({
      userId,
      data: { roles },
      onSuccess: () => {
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      },
      onFailure: () => {},
    });
  };

  return (
    <HeaderBarWrapper headerCommonProps={{ title: <Trans>My Profile</Trans> }}>
      <div className='user-profile-container'>
        <div className='back-button'>
          <BackButton />
        </div>
        <div>
          {isLoader ? (
            <SkeletonItem />
          ) : (
            <Row>
              <Col
                xs={24}
                sm={24}
                md={{ span: 20, offset: 2 }}
                lg={{ span: 16, offset: 4 }}
                xl={{ span: 12, offset: 6 }}
              >
                <Row gutter={12} align='middle'>
                  <Col flex='80px'>
                    <img
                      src={
                        userProfile?.profile_picture_url ||
                        require('../../assets/images/default/user.png')
                      }
                      alt='profile'
                      className='profile-pic'
                    />
                  </Col>
                  <Col flex='auto'>
                    <div className='user-name'>
                      {userProfile?.legal_name || userProfile?.name}
                    </div>
                    <div className='user-position'>{userProfile?.position}</div>
                  </Col>
                  {/* <Col span={6}>
                  <Button className='view-profile-button'>
                    View Full Profile
                    <SelectOutlined />
                  </Button>
                </Col> */}
                </Row>
                <Form
                  layout='vertical'
                  form={form}
                  className='form'
                  size='middle'
                >
                  <Form.Item name='is_active' label={<Trans>Status</Trans>}>
                    <Input disabled placeholder='-' />
                  </Form.Item>
                  <Form.Item name='email' label={<Trans>Email Id</Trans>}>
                    <Input disabled placeholder='-' />
                  </Form.Item>
                  <Form.Item name='emp_id' label={<Trans>Employee Id</Trans>}>
                    <Input disabled placeholder='-' />
                  </Form.Item>
                  <Form.Item name='hire_date' label={<Trans>Hire Date</Trans>}>
                    <Input disabled placeholder='-' />
                  </Form.Item>
                  <Form.Item label={<Trans>Manager</Trans>}>
                    <Input
                      disabled
                      value={
                        userProfile?.manager
                          ? `${userProfile?.manager.legal_name} (${userProfile?.manager.username})`
                          : '-'
                      }
                    />
                  </Form.Item>
                  {userProfile?.entities?.map((entity: any, index: number) => (
                    <Form.Item label={entity.entity_type} key={index}>
                      <Input disabled value={entity.entity} placeholder='-' />
                    </Form.Item>
                  ))}
                  <Form.Item label={<Trans>Cost Centre</Trans>}>
                    <Input
                      disabled
                      value={userProfile?.cost_centre?.title}
                      placeholder='-'
                    />
                  </Form.Item>
                  <Form.Item
                    label={<Trans>Roles</Trans>}
                    style={{ position: 'relative' }}
                  >
                    {/* <Button
                    type='link'
                    style={{
                      position: 'absolute',
                      top: '-32px',
                      right: '-16px',
                    }}
                    onClick={() =>
                      setIsUpdateRoleContainerHidden(
                        !isUpdateRoleContainerHidden,
                      )
                    }
                  >
                    {isUpdateRoleContainerHidden ? `Update Role` : 'Cancel'}
                  </Button> */}
                    <>
                      {isUpdateRoleContainerHidden && (
                        <Input disabled value={rolesNames} placeholder='-' />
                      )}
                    </>
                    <>
                      {!isUpdateRoleContainerHidden && (
                        <div className='update-role-container'>
                          <Select
                            showSearch
                            mode='multiple'
                            placeholder='Select roles'
                            optionFilterProp='children'
                            defaultValue={selectedRoles}
                            onChange={(values: any) => setSelectedRoles(values)}
                          >
                            {roles?.map((item: any, index: number) => {
                              return (
                                <Option key={index} value={item.id}>
                                  {item.title}
                                </Option>
                              );
                            })}
                          </Select>
                          <div style={{ marginTop: '8px' }}>
                            <Button
                              type='primary'
                              size='small'
                              style={{ marginRight: '8px' }}
                              onClick={onUpdateRoles}
                            >
                              <Trans>Save Roles</Trans>
                            </Button>
                            <Button
                              size='small'
                              onClick={() =>
                                setIsUpdateRoleContainerHidden(true)
                              }
                            >
                              <Trans>Cancel</Trans>
                            </Button>
                          </div>
                        </div>
                      )}
                    </>
                  </Form.Item>
                  {employeeApproversData?.data?.length > 0 ? (
                    employeeApproversData?.data?.map((item: any) => {
                      const items = Object.keys(item?.approvers).map(
                        (data: any) => {
                          return item?.approvers[data];
                        },
                      );
                      return items.map((o: any, index: any) => (
                        <Form.Item label={o?.title} key={index}>
                          <Input
                            disabled
                            value={
                              o?.approver
                                ? `${o?.approver?.legal_name ||
                                    o?.approver?.name} (${
                                    o?.approver?.username
                                  })`
                                : '-'
                            }
                            placeholder='-'
                          />
                        </Form.Item>
                      ));
                    })
                  ) : (
                    <>
                      <Form.Item
                        label={
                          systemLabelsCustomisation?.approver_1
                            ? systemLabelsCustomisation.approver_1
                            : 'Approver 1'
                        }
                      >
                        <Input
                          disabled
                          value={
                            userProfile?.approvers?.approver_1
                              ? `${userProfile?.approvers?.approver_1
                                  ?.legal_name ||
                                  userProfile?.approvers?.approver_1?.name} (${
                                  userProfile?.approvers?.approver_1?.username
                                })`
                              : '-'
                          }
                        />
                      </Form.Item>
                      <Form.Item
                        label={
                          systemLabelsCustomisation?.approver_2
                            ? systemLabelsCustomisation.approver_2
                            : 'Approver 2'
                        }
                      >
                        <Input
                          disabled
                          value={
                            userProfile?.approvers?.approver_2
                              ? `${userProfile?.approvers?.approver_2
                                  ?.legal_name ||
                                  userProfile?.approvers?.approver_2?.name} (${
                                  userProfile?.approvers?.approver_2?.username
                                })`
                              : '-'
                          }
                        />
                      </Form.Item>
                      <Form.Item
                        label={
                          systemLabelsCustomisation?.approver_3
                            ? systemLabelsCustomisation.approver_3
                            : 'Approver 3'
                        }
                      >
                        <Input
                          disabled
                          value={
                            userProfile?.approvers?.approver_3
                              ? `${userProfile?.approvers?.approver_3
                                  ?.legal_name ||
                                  userProfile?.approvers?.approver_3?.name} (${
                                  userProfile?.approvers?.approver_3?.username
                                })`
                              : '-'
                          }
                        />
                      </Form.Item>
                      <Form.Item
                        label={
                          systemLabelsCustomisation?.approver_4
                            ? systemLabelsCustomisation.approver_4
                            : 'Approver 4'
                        }
                      >
                        <Input
                          disabled
                          value={
                            userProfile?.approvers?.approver_4
                              ? `${userProfile?.approvers?.approver_4
                                  ?.legal_name ||
                                  userProfile?.approvers?.approver_4?.name} (${
                                  userProfile?.approvers?.approver_4?.username
                                })`
                              : '-'
                          }
                        />
                      </Form.Item>
                      <Form.Item
                        label={
                          systemLabelsCustomisation?.approver_5
                            ? systemLabelsCustomisation.approver_5
                            : 'Approver 5'
                        }
                      >
                        <Input
                          disabled
                          value={
                            userProfile?.approvers?.approver_5
                              ? `${userProfile?.approvers?.approver_5
                                  ?.legal_name ||
                                  userProfile?.approvers?.approver_5?.name} (${
                                  userProfile?.approvers?.approver_5?.username
                                })`
                              : '-'
                          }
                        />
                      </Form.Item>
                    </>
                  )}
                </Form>
              </Col>
            </Row>
          )}
        </div>
      </div>
    </HeaderBarWrapper>
  );
};

const mapStateToProps = (state: any) => {
  const { user } = state.auth;
  const { employeeApproversData } = state.userProfile;
  return {
    authUser: user,
    userProfile: getProfileData(state),
    isLoader: getProfileLoader(state),
    error: getProfileErrorMessage(state),
    roles: getRoles(state),
    systemLabelsCustomisation: getSystemLabelsCustomisation(state),
    employeeApproversData: employeeApproversData,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  fetchSystemLabelsCustomisation: () =>
    dispatch(fetchSystemLabelsCustomisation()),
  _fetchProfileData: () => dispatch(fetchUserProfile()),
  fetchRoles: () => dispatch(fetchRoles()),
  updateUserRoles: ({
    userId,
    data,
    onSuccess,
    onFailure,
  }: {
    userId: number;
    data: { roles: number[] };
    onSuccess: Function;
    onFailure: Function;
  }) =>
    dispatch(
      updateUserRoles({
        userId,
        data,
        onSuccess,
        onFailure,
      }),
    ),
  _setError: () => dispatch(setError('')),
  _clearProfile: () => dispatch(saveUserData(undefined)),
  _fetchApproversCustomFieldsList: (
    page: number,
    pageSize?: number,
    employeeId?: number,
    effective_from__lte?: any,
    sort?: any,
  ) =>
    dispatch(
      fetchApproversCustomFieldsList(
        page,
        pageSize,
        employeeId,
        effective_from__lte,
        sort,
      ),
    ),
});

const connector = connect(mapStateToProps, mapDispatchToProps);

export default connector(UserProfile);
