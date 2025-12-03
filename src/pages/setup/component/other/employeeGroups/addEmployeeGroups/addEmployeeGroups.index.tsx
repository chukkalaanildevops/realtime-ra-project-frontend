import React, { FC, memo, useEffect, Dispatch } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import {
  message,
  Row,
  Col,
  Form,
  Input,
  Select,
  Button,
  Upload,
  Divider,
} from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { useHistory, useParams } from 'react-router-dom';
import { stateInterface } from '../../../../../../shared/redux/rootReducer';
import { appPath } from '../../../../../app/app.routes';
import {
  HeaderBarWrapper,
  BackButton,
} from '../../../../../../shared/components';
import Data from '../employeeGroups.data.json';
import {
  apiCallReset,
  resetForm,
  resetToInitial,
  updateFormData,
  updateUpdateId,
  updateEntityArr,
} from './addEmployeeGroups.action';
import {
  fetchLegalEntitiesUsingEntityTypeId,
  fetchLegalEntityTypes,
  saveEmployeeGroup,
  updateEmployeeGroup,
  fetchEmployeeGroupsUsingId,
} from './addEmployeeGroups.thunk';
import { fetchUsersForDD } from '../../../../../../shared/redux/auth/auth.thunk';
import { IformData, IpostData, IcustomConfig } from './addEmployeeGroups.model';
import './addEmployeeGroups.index.less';
import { Trans } from '@lingui/macro';

const mapStateToProps = (state: stateInterface) => {
  const {
    formData,
    entityArr,
    entityTypesArr,
    isUpdateMode,
    updateId,
    info,
    error,
    success,
    isLoading,
    backend_error,
  } = state.AddEmployeeGroups;
  return {
    formData,
    entityArr,
    entityTypesArr,
    users: state.auth.activeUsers,
    usersLoader: state.auth.usersLoader,
    isUpdateMode,
    updateId,
    info,
    error,
    success,
    isLoading,
    backend_error,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  return {
    _apiCallReset: () => dispatch(apiCallReset()),
    _resetToInitial: () => dispatch(resetToInitial()),
    _resetForm: () => dispatch(resetForm()),
    _fetchLegalEntitiesUsingEntityTypeId: (id: number) =>
      dispatch(fetchLegalEntitiesUsingEntityTypeId(id)),
    _fetchLegalEntityTypes: () => dispatch(fetchLegalEntityTypes()),
    _fetchUsersForDD: () => dispatch(fetchUsersForDD()),
    _updateFormData: (data: IformData) => dispatch(updateFormData(data)),
    _saveEmployeeGroup: (data: IpostData) => dispatch(saveEmployeeGroup(data)),
    _updateEmployeeGroup: (id: number, data: IpostData) =>
      dispatch(updateEmployeeGroup(id, data)),
    _updateUpdateId: (id: string) => dispatch(updateUpdateId(id)),
    _fetchEmployeeGroupsUsingId: (id: number) =>
      dispatch(fetchEmployeeGroupsUsingId(id)),
    _updateEntityArr: (data: any[]) => dispatch(updateEntityArr(data)),
  };
};

const connector = connect(mapStateToProps, mapDispatchToProps);

const AddEmployeeGroups: FC<ConnectedProps<typeof connector>> = props => {
  const {
    formData,
    entityArr,
    entityTypesArr,
    users,
    isUpdateMode,
    usersLoader,
    updateId,
    info,
    error,
    success,
    isLoading,
    backend_error,
    _apiCallReset,
    _resetToInitial,
    _fetchLegalEntitiesUsingEntityTypeId,
    _fetchLegalEntityTypes,
    _fetchUsersForDD,
    _updateFormData,
    _updateEmployeeGroup,
    _saveEmployeeGroup,
    _updateUpdateId,
    _fetchEmployeeGroupsUsingId,
    _resetForm,
    _updateEntityArr,
  } = props;

  const params: any = useParams();
  const history = useHistory();
  const [form] = Form.useForm();
  const { Option } = Select;
  const rowGutter: [number, number] = [24, 0];
  //   const threeColSpan = {}
  const employeeSelectVisibility: boolean = formData.criteria === 'INDSELU';
  const customCriteriaCreatorVisibility: boolean =
    formData.criteria === 'CUSTOMU';

  /**
   * This function handles all form fields value change.
   * And save that changes in store.
   * @param _changedValues
   * @param _allValues
   * @returns {void}
   */
  const handleFormFieldsValueChanges = (
    _changedValues: any,
    _allValues: any,
  ): void => {
    if (!_changedValues.hasOwnProperty('file')) {
      let data = { ...formData, ..._changedValues };
      if (_changedValues?.entityType) {
        const id: number = _changedValues.entityType;
        // const id: number = entityTypesArr.filter(
        //   o => o.title === _changedValues.entityType,
        // )[0].id;

        id && _fetchLegalEntitiesUsingEntityTypeId(id);
        data = { ...data, entities: [] };
      }

      if (_allValues?.criteria !== 'CUSTOMU') {
        data = { ...data, entities: [], entityType: '', relation: 'IN' };
        _updateEntityArr([]); // entityArr
      }
      if (_allValues?.criteria !== 'INDSELU') {
        data = { ...data, selectEmployees: [] };
      }
      _updateFormData(data);
    }
  };

  /**
   * This functions invoke on form submission.
   * @param value
   * @returns {void}
   */
  const submitDataFn = (value: any): void => {
    const isCustom: boolean = value.criteria === 'CUSTOMU';
    const isIndiviudal: boolean = value.criteria === 'INDSELU';
    let postData: IpostData = {
      title: value.title,
      criteria: value.criteria,
      is_criteria_based: isCustom,
    };

    if (isCustom) {
      const customConfigObj: IcustomConfig[] = isCustom
        ? [
            {
              entity_type: value.entityType,
              operator: value.relation,
              entities: value.entities,
            },
          ]
        : [];
      postData = {
        ...postData,
        custom_config: customConfigObj,
      };
    }

    if (isIndiviudal) {
      if (formData.file === null) {
        postData = {
          ...postData,
          selected_users: value?.selectEmployees ? value?.selectEmployees : [],
        };
      } else {
        postData = {
          ...postData,
          file: formData.file,
        };
      }
    }

    if (isUpdateMode) {
      _updateEmployeeGroup(updateId as number, postData);
    } else _saveEmployeeGroup(postData);
  };

  const handleClearForm = () => {
    _resetForm();
  };

  useEffect(() => {
    form.setFieldsValue(formData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData]);

  useEffect(() => {
    /**
     * ComponentDidMount
     */
    if (params.hasOwnProperty('id')) {
      const _id = params.id;
      if (_id) {
        _updateUpdateId(_id);
        _fetchEmployeeGroupsUsingId(Number(_id));
      }
    }
    _apiCallReset();
    _fetchLegalEntityTypes(); //API Get Call
    _fetchUsersForDD(); //API Get Call
    return () => {
      /**
       * ComponentWillUnmount
       */
      message.destroy();
      _resetToInitial();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  /**
   * This help to show message
   * For eg. Api related messages, Error messages
   */
  useEffect(() => {
    message.destroy();
    if (isLoading) message.loading(info, 0);
    else if (success)
      message.success(success, 2, () => {
        if (success === 'Employee group saved successfully') {
          history.push(appPath.config_setup.employeeGroups.linkTo);
        }
        _apiCallReset();
      });
    else if (error) message.error(error, 2, _apiCallReset);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, success, error, info]);
  return (
    <HeaderBarWrapper
      headerCommonProps={{ title: <Trans>Add Employee Group</Trans> }}
      data-test='employeeGroupsWrapper'
    >
      <Row gutter={rowGutter} className='add-employee-group-container'>
        <div className='title-h2' data-test='employeeGroupTitle'>
          <BackButton
            data-test='backButton'
            backBtnUrl={
              isUpdateMode
                ? appPath.config_setup.employeeGroups.update.backLink
                : appPath.config_setup.employeeGroups.add.backLink
            }
          />
          <Trans>Employee Group</Trans>
        </div>
        <Form
          form={form}
          initialValues={formData}
          layout='vertical'
          size='middle'
          autoComplete='off'
          scrollToFirstError={true}
          onValuesChange={handleFormFieldsValueChanges}
          onFinish={submitDataFn}
        >
          <Row gutter={rowGutter}>
            <Col span={12}>
              <Form.Item
                name='title'
                className='title'
                label={<Trans>Title</Trans>}
                rules={[
                  {
                    required: true,
                    //message: Data.vaidationErrors.title.required,
                    validator(_, value) {
                      if (value !== undefined) {
                        value = value?.trim();
                      }

                      if (!value || value === undefined) {
                        return Promise.reject(
                          Data.vaidationErrors.title.required,
                        );
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
                validateStatus={
                  backend_error.hasOwnProperty('title') ? 'error' : 'validating'
                }
                help={
                  backend_error.hasOwnProperty('title')
                    ? backend_error.title[0]
                    : null
                }
              >
                <Input
                  autoComplete='new-password'
                  data-test='formTitleInput'
                  //   value={formData.title}
                  placeholder='eg. All Employees'
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={rowGutter}>
            <Col span={12}>
              <Form.Item
                name='criteria'
                className='criteria'
                label={<Trans>Criteria</Trans>}
                rules={[
                  {
                    required: true,
                    message: Data.vaidationErrors.criteria.required,
                  },
                ]}
                validateStatus={
                  backend_error.hasOwnProperty('criteria')
                    ? 'error'
                    : 'validating'
                }
                help={
                  backend_error.hasOwnProperty('criteria')
                    ? backend_error.criteria[0]
                    : null
                }
              >
                <Select
                  // value={formData.criteria}
                  data-test='formCriteriaSelect'
                  placeholder='Select criteria'
                  disabled={isUpdateMode}
                  showSearch={true}
                  filterOption={(input: any, option: any) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                  getPopupContainer={trigger => trigger.parentNode}
                >
                  {/* <Option value='ALLEMPS'>All Employees</Option>
                  <Option value='L1DREPO'>Level 1 Reports</Option>
                  <Option value='LV2REPO'>Level 2 Reports</Option>
                  <Option value='LV3REPO'>Level 3 Reports</Option> */}
                  <Option value='INDSELU'>Individually Selected Users</Option>
                  <Option value='CUSTOMU'>Custom Based Selection</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          {customCriteriaCreatorVisibility ? (
            <Row gutter={rowGutter}>
              <Col span={6}>
                <Form.Item
                  name='entityType'
                  className='entity-type'
                  label={<Trans>Entity Type</Trans>}
                  rules={[
                    {
                      required: true,
                      message: Data.vaidationErrors.entityType.required,
                    },
                  ]}
                  validateStatus={
                    backend_error.hasOwnProperty('entity_type')
                      ? 'error'
                      : 'validating'
                  }
                  help={
                    backend_error.hasOwnProperty('entity_type')
                      ? backend_error.entity_type[0]
                      : null
                  }
                >
                  <Select
                    data-test='formEntityTypeSelect'
                    placeholder='Select entity type'
                    showSearch={true}
                    filterOption={(input: any, option: any) =>
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                    getPopupContainer={trigger => trigger.parentNode}
                  >
                    {entityTypesArr.map((o, i) => (
                      <Option value={o.id} key={i}>
                        {o.title}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  name='relation'
                  className='relation'
                  label={<Trans>Relation</Trans>}
                  rules={[
                    {
                      required: true,
                      message: Data.vaidationErrors.relation.required,
                    },
                  ]}
                  validateStatus={
                    backend_error.hasOwnProperty('operator')
                      ? 'error'
                      : 'validating'
                  }
                  help={
                    backend_error.hasOwnProperty('operator')
                      ? backend_error.operator[0]
                      : null
                  }
                >
                  <Select
                    data-test='formRelationSelect'
                    // value={formData.relation}
                    placeholder='Select relation'
                    showSearch={true}
                    filterOption={(input: any, option: any) =>
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                    getPopupContainer={trigger => trigger.parentNode}
                  >
                    <Option value='IN'>In</Option>
                    <Option value='NOTIN'>Not In</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  name='entities'
                  className='entities'
                  label={<Trans>Entity</Trans>}
                  rules={[
                    {
                      required: true,
                      message: Data.vaidationErrors.entities.required,
                    },
                  ]}
                  validateStatus={
                    backend_error.hasOwnProperty('entities')
                      ? 'error'
                      : 'validating'
                  }
                  help={
                    backend_error.hasOwnProperty('entities')
                      ? backend_error.entities[0]
                      : null
                  }
                >
                  <Select
                    mode='multiple'
                    data-test='formEntitiesSelect'
                    placeholder='Select entity'
                    disabled={entityArr.length === 0}
                    showSearch={true}
                    filterOption={(input: any, option: any) =>
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                    getPopupContainer={trigger => trigger.parentNode}
                  >
                    {entityArr.map((o, i) => (
                      <Option value={o.id} key={i}>
                        {o.title}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          ) : null}
          {employeeSelectVisibility ? (
            <>
              <Row gutter={rowGutter}>
                <Col span={12}>
                  <Form.Item
                    name='selectEmployees'
                    className='select-employees'
                    label={<Trans>Select Employees</Trans>}
                    rules={[
                      {
                        required: Boolean(formData.file === null),
                        message: Data.vaidationErrors.selectEmployees.required,
                      },
                    ]}
                    validateStatus={
                      backend_error.hasOwnProperty('selected_users')
                        ? 'error'
                        : 'validating'
                    }
                    help={
                      backend_error.hasOwnProperty('selected_users')
                        ? backend_error.selected_users[0]
                        : null
                    }
                  >
                    <Select
                      data-test='formSelectEMployeesSelect'
                      // value={formData.selectEmployees}
                      mode='multiple'
                      placeholder='Select employee'
                      showSearch={true}
                      filterOption={(input: any, option: any) =>
                        option.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                      getPopupContainer={trigger => trigger.parentNode}
                      loading={usersLoader}
                      disabled={Boolean(formData.file !== null)}
                    >
                      {users.map((o, i) => (
                        <Option value={o.id} key={i}>
                          {`${o?.legal_name || o.name} (${o.username})`}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={rowGutter}>
                <Col span={12}>
                  <Divider>OR</Divider>
                </Col>
              </Row>

              <Row gutter={rowGutter}>
                <Col span={12}>
                  <Form.Item
                    name='file'
                    className='file'
                    label=''
                    validateStatus={
                      backend_error.hasOwnProperty('file')
                        ? 'error'
                        : 'validating'
                    }
                    help={
                      backend_error.hasOwnProperty('file')
                        ? backend_error.file[0]
                        : null
                    }
                  >
                    <Upload.Dragger
                      multiple={false}
                      accept='.csv'
                      fileList={
                        formData.file ? [formData.file as any] : undefined
                      }
                      beforeUpload={(_file: File, _fileList: File[]) => {
                        if (_file.type === 'text/csv') {
                          _updateFormData({ ...formData, file: _file });
                          setTimeout(() => {
                            form.validateFields(['selectEmployees']);
                          }, 100);
                        } else {
                          message.error('Unsupported file type', 2);
                        }
                        return false;
                      }}
                      onRemove={(_file: any) => {
                        _updateFormData({ ...formData, file: null });
                        return true;
                      }}
                      disabled={Boolean(formData?.selectEmployees?.length > 0)}
                    >
                      <p className='ant-upload-drag-icon'>
                        <InboxOutlined />
                      </p>
                      <p className='ant-upload-text'>
                        <Trans>
                          Click or drag csv file to this area to upload
                        </Trans>
                      </p>
                      <p className='ant-upload-hint'>
                        {/* Accepting only single csv file.
                        <br /> */}
                        <Trans
                          id='Note: Valid CSV file should contain only Employee ID
                        column, And Employee ID column must have a valid
                        employee id.'
                        />
                      </p>
                    </Upload.Dragger>
                  </Form.Item>
                </Col>
              </Row>
            </>
          ) : null}
          <Row gutter={[0, 24]}>
            <Col
              span={formData.criteria === 'CUSTOMU' ? 18 : 12}
              className='form-action-btn-container'
            >
              <Form.Item>
                {!isUpdateMode ? (
                  <Button
                    data-test='formClearButton'
                    ghost
                    type='primary'
                    onClick={handleClearForm}
                    disabled={
                      isLoading ||
                      (isUpdateMode &&
                        usersLoader &&
                        formData.criteria === 'INDSELU')
                    }
                  >
                    <Trans>Clear</Trans>
                  </Button>
                ) : (
                  <></>
                )}
                <Button
                  data-test='formSubmitButton'
                  type='primary'
                  htmlType='submit'
                  disabled={
                    isLoading ||
                    (isUpdateMode &&
                      usersLoader &&
                      formData.criteria === 'INDSELU')
                  }
                >
                  {isUpdateMode ? (
                    <Trans>{`Update`}</Trans>
                  ) : (
                    <Trans>{`Save`}</Trans>
                  )}
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Row>
    </HeaderBarWrapper>
  );
};

export default memo(connector(AddEmployeeGroups));
