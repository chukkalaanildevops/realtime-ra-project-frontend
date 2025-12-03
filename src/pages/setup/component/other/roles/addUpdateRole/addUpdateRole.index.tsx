import React, { Dispatch, memo, useEffect, useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import {
  BackButton,
  BrokenLink,
  ElementOrSkeleton,
  HeaderBarWrapper,
  Unauthorized,
} from '../../../../../../shared/components';
import { stateInterface } from '../../../../../../shared/redux/rootReducer';
import {
  fetchRoleDetails,
  addRole,
  updateRole,
  setPageLoader,
} from '../roles.thunk';
import '../roles.index.less';
import FormItem from 'antd/lib/form/FormItem';
import {
  Button,
  Input,
  message,
  Select,
  Form,
  Checkbox,
  Row,
  Space,
} from 'antd';
import { AxiosResponse } from 'axios';
import {
  fetchEmployeeGroupsService,
  fetchPermissionsService,
} from '../../../../../../services/roles';
import { IPermission } from '../roles.model';
import { appPath } from '../../../../../app/app.routes';
import permissionsDataMap from '../permdependency.data.json';
import { Trans } from '@lingui/macro';

const mapStateToProps = (state: stateInterface) => {
  const {
    isLoading,
    roleDetails,
    serviceCallError,
    formErrors,
    formSubmissionInProgress,
    formSubmissionSuccessful,
  } = state.roles;
  return {
    isLoading: isLoading,
    serviceCallError: serviceCallError,
    roleDetails: roleDetails,
    formErrors: formErrors,
    formSubmissionInProgress: formSubmissionInProgress,
    formSubmissionSuccessful: formSubmissionSuccessful,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  return {
    _fetchRoleDetails: (roleId: number) => dispatch(fetchRoleDetails(roleId)),
    _addRole: (data: { [key: string]: any }) => dispatch(addRole(data)),
    _updateRole: (roleId: number, data: { [key: string]: any }) =>
      dispatch(updateRole(roleId, data)),
    _setLoader: (isLoading: boolean) => dispatch(setPageLoader(isLoading)),
  };
};

const connector = connect(mapStateToProps, mapDispatchToProps);

const AddUpdateRole: React.FC<ConnectedProps<typeof connector>> = props => {
  const {
    isLoading,
    serviceCallError,
    roleDetails,
    formErrors,
    formSubmissionInProgress,
    formSubmissionSuccessful,
    _fetchRoleDetails,
    _addRole,
    _updateRole,
    _setLoader,
  } = props;

  let { roleId } = useParams();

  const { push } = useHistory();
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [employeeGroups, setEmployeeGroups] = useState<
    { [key: string]: any }[] | null
  >(null);
  const [permissions, setPermissions] = useState<IPermission[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<IPermission[]>(
    [],
  );
  const [permissionsEnabled, setPermissionsEnabled] = useState<string[]>([]);
  const [permissionsLoader, setPermissionsLoader] = useState<boolean>(true);
  const [roleIsIneditable, setRoleIsIneditable] = useState(false);
  const [targetAudience, setTargetAudience] = useState<any>(null);
  const [form] = Form.useForm();

  async function getEmployeeGroups() {
    try {
      const response: AxiosResponse = await fetchEmployeeGroupsService();
      setEmployeeGroups(response.data);
    } catch (error) {
      message.error('Target audience could not be fetched');
    }
  }

  async function fetchPermissions() {
    try {
      const response: AxiosResponse = await fetchPermissionsService();
      setPermissions(response.data);
      setPermissionsLoader(false);
      _setLoader(false);
    } catch (error) {
      message.error('Permissions could not be fetched');
    }
  }

  useEffect(() => {
    if (roleId !== undefined) {
      _fetchRoleDetails(parseInt(roleId));
      setIsUpdate(true);
    }

    getEmployeeGroups();
    fetchPermissions();

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (targetAudience?.title === 'Self') {
      form.setFieldsValue({ is_exclude_self: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetAudience]);

  useEffect(() => {
    if (!isUpdate) {
      if (permissions) {
        setSelectedPermissions(permissions);
        setPermissionsEnabled(
          permissions.map((item: IPermission) => item.code),
        );
      }
    }
    // eslint-disable-next-line
  }, [permissions]);

  useEffect(() => {
    if (roleDetails !== null && roleId !== undefined) {
      setRoleIsIneditable(!roleDetails?.is_editable);
      setTargetAudience(roleDetails?.target_audience);

      form.setFieldsValue({
        title: roleDetails?.title,
        code: roleDetails?.code,
        description: roleDetails?.description,
        is_exclude_self: roleDetails?.is_exclude_self,
        is_show_only_active_employees:
          roleDetails?.is_show_only_active_employees,
        target_audience: roleDetails?.target_audience?.id,
      });
      setSelectedPermissions(roleDetails.permissions);
      let permissionsToEnable = roleDetails.permissions.map(
        (item: IPermission) => item.code,
      );
      let defaultEnabledPermissions = [
        'VIEW_SETUP',
        'VIEW_SETTINGS',
        'VIEW_ADMIN',
        'VIEW_REPORTS',
        'VIEW_USER_PROFILE',
        'ACTION_SF_USERS_DETAILS',
      ];
      permissionsToEnable = [
        ...permissionsToEnable,
        ...defaultEnabledPermissions,
      ];

      let dependentPermissionsToAdd: string[] = [];

      permissionsToEnable.forEach((item: string) => {
        if (
          roleDetails.permissions.filter(
            (permission: IPermission) => permission.code === item,
          ).length > 0
        ) {
          dependentPermissionsToAdd = [
            ...getDependentPermissions(item),
            ...dependentPermissionsToAdd,
          ];
        }
      });

      setPermissionsEnabled([
        ...permissionsToEnable,
        ...defaultEnabledPermissions,
        ...dependentPermissionsToAdd,
      ]);
    }
    // eslint-disable-next-line
  }, [roleDetails]);

  useEffect(() => {
    if (formSubmissionSuccessful) {
      push(appPath.config_setup.roles.path);
    }
    // eslint-disable-next-line
  }, [formSubmissionSuccessful]);

  const onFormFinish = (values: any) => {
    if (selectedPermissions.length === 0) {
      message.error('Permissions are mandatory');
    } else {
      values.permissions = selectedPermissions.map(
        (item: IPermission) => item.id,
      );

      if (isUpdate && roleId !== undefined) {
        _updateRole(parseInt(roleId), values);
      } else {
        _addRole(values);
      }
    }
  };

  const handlePermissionOnChange = (
    permission: IPermission,
    isChecked: boolean,
  ) => {
    let dependentPermissions = getDependentPermissions(permission.code);
    if (isChecked) {
      setSelectedPermissions(selectedPermissions => [
        ...selectedPermissions,
        permission,
      ]);

      setPermissionsEnabled(permissionsEnabled => [
        permission.code,
        ...permissionsEnabled,
        ...dependentPermissions,
      ]);
    } else {
      let leafNodes: string[] = [];
      dependentPermissions.forEach((item: string) => {
        leafNodes = [...leafNodes, ...getDependentPermissions(item)];
      });

      let permissionsToUncheckAndDisable = [
        ...dependentPermissions,
        ...leafNodes,
      ];

      setSelectedPermissions(selectedPermissions =>
        selectedPermissions
          .filter(
            (item: IPermission) =>
              !permissionsToUncheckAndDisable.includes(item.code),
          )
          .filter((item: IPermission) => item.code !== permission.code),
      );

      setPermissionsEnabled(permissionsEnabled =>
        permissionsEnabled.filter(
          (item: string) =>
            permissionsToUncheckAndDisable.includes(item) === false,
        ),
      );
    }
  };

  const getDependentPermissions = (permissionCode: string) => {
    let matchingPermissions = permissionsDataMap.filter(
      (item: any) => item.permission === permissionCode,
    );
    if (matchingPermissions.length > 0) {
      return matchingPermissions[0].dependents;
    }
    return [];
  };

  const handleTargetAudienceOnChange = (id: any) => {
    setTargetAudience(employeeGroups?.find((data: any) => data.id === id));
  };

  const isCheckboxChecked = (permission: IPermission) => {
    if (
      selectedPermissions.filter(
        (item: IPermission) => item.code === permission.code,
      ).length > 0
    ) {
      return true;
    }
    return false;
  };

  const getForm = () => {
    const { Option } = Select;

    return (
      <>
        <div className='form-title'>
          <ElementOrSkeleton
            isLoading={isLoading}
            isActive={true}
            type='simple'
          >
            <BackButton />
            {isUpdate ? roleDetails?.title : <Trans>Add New Role</Trans>}
          </ElementOrSkeleton>
        </div>
        <Form
          form={form}
          layout='vertical'
          onFinish={onFormFinish}
          onReset={_event => {
            form.resetFields();
            setSelectedPermissions(permissions);

            setPermissionsEnabled(
              permissions.map((permission: IPermission) => permission.code),
            );
          }}
          className='add-update-role-form'
        >
          <FormItem
            label={<Trans>Title</Trans>}
            name='title'
            validateStatus={
              formErrors.title !== undefined ? 'error' : undefined
            }
            help={formErrors && formErrors.title}
            rules={[
              {
                required: true,
                validator(_, value) {
                  if (value !== undefined) {
                    value = value?.trim();
                  }

                  if (!value || value === undefined) {
                    return Promise.reject('Role title is mandatory');
                  } else {
                    if (new RegExp(/^[^@!=\-+#﹘—⸺⸻].*$/).test(value)) {
                      return Promise.resolve();
                    }
                    if (!value || value === undefined) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error('Can not start with special character'),
                    );
                  }
                },
              },
            ]}
          >
            <Input placeholder='Title eg. Inventory Manager' autoFocus />
          </FormItem>

          <FormItem
            label={<Trans>Code</Trans>}
            name='code'
            validateStatus={formErrors.code !== undefined ? 'error' : undefined}
            help={formErrors && formErrors.code}
            rules={[
              {
                required: true,
                validator(_, value) {
                  if (value !== undefined) {
                    value = value?.trim();
                  }

                  if (!value || value === undefined) {
                    return Promise.reject('Role code is mandatory');
                  } else {
                    if (new RegExp(/^[^@!=\-+#﹘—⸺⸻].*$/).test(value)) {
                      return Promise.resolve();
                    }
                    if (!value || value === undefined) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error('Can not start with special character'),
                    );
                  }
                },
              },
            ]}
          >
            <Input placeholder='Title eg. InvMgr' />
          </FormItem>

          <FormItem
            label={<Trans>Description</Trans>}
            name='description'
            rules={[
              {
                required: true,
                validator(_, value) {
                  if (value !== undefined) {
                    value = value?.trim();
                  }

                  if (!value || value === undefined) {
                    return Promise.reject('Role description is mandatory');
                  } else {
                    if (new RegExp(/^[^@!=\-+#﹘—⸺⸻].*$/).test(value)) {
                      return Promise.resolve();
                    }
                    if (!value || value === undefined) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error('Can not start with special character'),
                    );
                  }
                },
              },
            ]}
          >
            <Input placeholder='eg. Role is authorized to manage inventory related transactions' />
          </FormItem>

          <FormItem
            label={<Trans>Target Audience</Trans>}
            name='target_audience'
            rules={[
              {
                required: true,
                message: 'Target audience is mandatory',
              },
            ]}
          >
            <Select
              showSearch
              filterOption={(input, option) =>
                option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              onChange={(value: any) => handleTargetAudienceOnChange(value)}
            >
              {employeeGroups &&
                employeeGroups.map((item: any) => (
                  <Option key={item.id} value={item.id} children={item.title} />
                ))}
            </Select>
          </FormItem>
          <Row>
            <Space size='large'>
              <FormItem name='is_exclude_self' valuePropName='checked'>
                <Checkbox disabled={targetAudience?.title === 'Self'}>
                  <Trans>Exclude Self</Trans>
                </Checkbox>
              </FormItem>

              <FormItem
                name='is_show_only_active_employees'
                valuePropName='checked'
              >
                <Checkbox>
                  <Trans>Active Users</Trans>
                </Checkbox>
              </FormItem>
            </Space>
          </Row>
          <FormItem label='Permissions' required={true}>
            <ElementOrSkeleton
              isLoading={permissionsLoader}
              type='simple'
              simpleConfiguration={{ rows: 50 }}
            >
              {permissions &&
                permissions.map((item: any) => {
                  return (
                    <div key={item.id} className='permission-checkbox'>
                      <Checkbox
                        key={item.id}
                        value={item.id}
                        disabled={
                          permissionsEnabled.includes(item.code) === false
                        }
                        checked={isCheckboxChecked(item)}
                        onChange={event => {
                          handlePermissionOnChange(item, event.target.checked);
                        }}
                      >
                        {item.title}
                      </Checkbox>
                    </div>
                  );
                })}
            </ElementOrSkeleton>
          </FormItem>

          <div className='buttons'>
            <Button
              htmlType='reset'
              type='link'
              disabled={formSubmissionInProgress}
            >
              <Trans>Reset</Trans>
            </Button>
            <Button
              htmlType='submit'
              type='primary'
              disabled={formSubmissionInProgress}
            >
              <Trans>Save</Trans>
            </Button>
          </div>
        </Form>
      </>
    );
  };

  return (
    <HeaderBarWrapper
      headerCommonProps={{
        title: isUpdate ? <Trans>Update Role</Trans> : <Trans>Add Role</Trans>,
      }}
    >
      <div className='roles-container'>
        <ElementOrSkeleton isLoading={isLoading} isActive={true} type='page'>
          {(serviceCallError && (
            <BrokenLink
              description='Role could not be fetched'
              onTryAgain={() => {}}
            />
          )) ||
            (!serviceCallError && isUpdate && roleIsIneditable && (
              <Unauthorized />
            )) ||
            (!serviceCallError && getForm())}
        </ElementOrSkeleton>
      </div>
    </HeaderBarWrapper>
  );
};

export default memo(connector(AddUpdateRole));
