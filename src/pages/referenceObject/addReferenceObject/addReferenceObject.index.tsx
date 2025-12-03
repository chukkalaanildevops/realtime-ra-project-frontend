import React, { FC, memo, useEffect, Dispatch, MouseEvent } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { message, Form, Input, Button } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { useHistory, useParams } from 'react-router-dom';
import { stateInterface } from '../../../shared/redux/rootReducer';
import { appPath } from '../../app/app.routes';
import { HeaderBarWrapper, BackButton } from '../../../shared/components';
import Data from '../referenceObject.data.json';
import {
  apiCallReset,
  resetToInitial,
  setFormData,
  setUpdateId,
  resetFormData,
  updateRestorePageNo,
  updateRestorePageSize,
} from '../../../shared/redux/referenceObject/referenceObject.actions';
import {
  saveReferenceObject,
  fetchReferenceObjectUsingId,
  updateReferenceObject,
} from '../../../shared/redux/referenceObject/referenceObject.thunk';
import { IformData } from '../../../shared/redux/referenceObject/referenceObject.model';
import './addReferenceObject.index.less';
import { Trans } from '@lingui/macro';

const mapStateToProps = (state: stateInterface) => {
  const {
    formData,
    updateId,
    canDeleted,
    isUpdateMode,
    info,
    error,
    success,
    loader,
    backend_error,
    referenceItemList,
  } = state.referenceObject;
  return {
    formData,
    updateId,
    canDeleted,
    isUpdateMode,
    info,
    error,
    success,
    loader,
    backend_error,
    referenceItemList,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  return {
    _apiCallReset: () => dispatch(apiCallReset()),
    _resetToInitial: () => dispatch(resetToInitial()),
    _setFormData: (_formData: IformData) => dispatch(setFormData(_formData)),
    _saveReferenceObject: (_formData: IformData, callback?: Function) =>
      dispatch(saveReferenceObject(_formData, callback)),
    _setUpdateId: (id: string) => dispatch(setUpdateId(id)),
    _fetchReferenceObjectUsingId: (id: number) =>
      dispatch(fetchReferenceObjectUsingId(id)),
    _updateReferenceObject: (id: number, body: any, callback?: Function) =>
      dispatch(updateReferenceObject(id, body, callback)),
    _resetFormData: () => dispatch(resetFormData()),
    _updateRestorePageNo: (data: boolean = false) =>
      dispatch(updateRestorePageNo(data)),
    _updateRestorePageSize: (data: boolean = false) =>
      dispatch(updateRestorePageSize(data)),
  };
};

const connector = connect(mapStateToProps, mapDispatchToProps);

const AddReferenceObject: FC<ConnectedProps<typeof connector>> = props => {
  const {
    formData,
    updateId,
    info,
    error,
    success,
    canDeleted,
    loader,
    backend_error,
    isUpdateMode,
    referenceItemList,
    _apiCallReset,
    _resetToInitial,
    _setFormData,
    _saveReferenceObject,
    _setUpdateId,
    _fetchReferenceObjectUsingId,
    _updateReferenceObject,
    _resetFormData,
    _updateRestorePageNo,
    _updateRestorePageSize,
  } = props;
  const [form] = Form.useForm();
  const history = useHistory();
  const params: any = useParams();

  useEffect(() => {
    form.setFieldsValue(formData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData]);

  const handleFormFieldsValueChanges = (_changedValues: any, _values: any) => {
    // form.validateFields();
    let tempFormData: IformData = formData;
    if (_values.hasOwnProperty('items')) {
      if (_values.items[_values.items.length - 1])
        tempFormData = { ...tempFormData, ..._values };
    } else {
      tempFormData = { ...tempFormData, ..._values };
    }
    _setFormData(tempFormData);
  };

  const submitDataFn = (_event: MouseEvent<HTMLButtonElement>): void => {
    form
      .validateFields()
      .then(_values => {
        if (!isUpdateMode)
          _saveReferenceObject(formData, (isSuccess: boolean) => {
            if (isSuccess) {
              _updateRestorePageNo(true);
              _updateRestorePageSize(true);
              history.push(appPath.config_setup.referenceObjects.linkTo);
            }
          });
        else
          _updateReferenceObject(
            Number(updateId),
            formData,
            (isSuccess: boolean) => {
              if (isSuccess) {
                _updateRestorePageNo(true);
                _updateRestorePageSize(true);
                history.push(appPath.config_setup.referenceObjects.linkTo);
              }
            },
          );
      })
      .catch(errorInfo => {
        console.error(errorInfo);
      });
  };

  useEffect(() => {
    /**
     * ComponentDidMount
     */
    if (params.hasOwnProperty('id')) {
      const _id = params.id;
      if (_id) {
        _setUpdateId(_id);
        _fetchReferenceObjectUsingId(Number(_id));
      }
    }
    return () => {
      /**
       * ComponentWillUnmount
       */
      message.destroy();
      // _updateRestorePageNo(true);
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
    if (loader) message.loading(info, 0);
    else if (success) message.success(success, 2, _apiCallReset);
    else if (error) message.error(error, 2, _apiCallReset);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loader, success, error, info]);
  return (
    <HeaderBarWrapper
      headerCommonProps={{
        title: isUpdateMode ? (
          <Trans>Update Reference Object</Trans>
        ) : (
          <Trans>Add Reference Object</Trans>
        ),
      }}
    >
      <div
        className='add-reference-object-container'
        data-testId='addReferenceObjectWrapper'
      >
        <div className='title-h2' data-testId='addReferenceObjectTitle'>
          <BackButton
            data-test='backButton'
            backBtnUrl={
              isUpdateMode
                ? appPath.config_setup.referenceObjects.update.backLink
                : appPath.config_setup.referenceObjects.add.backLink
            }
            onBackClick={() => _updateRestorePageNo(true)}
          />
          <Trans>Reference Object</Trans>
        </div>
        <Form
          form={form}
          initialValues={formData}
          layout='vertical'
          size='middle'
          autoComplete='off'
          scrollToFirstError={true}
          className='add-update-reference-object-form'
          onValuesChange={handleFormFieldsValueChanges}
          //   onFinish={submitDataFn}
          data-test='form'
        >
          <Form.Item
            name='title'
            className='title'
            label={<Trans>Title</Trans>}
            data-test='title'
            required
            rules={[
              // {
              //   required: true,
              //   message: Data.addReferenceObject.vaidationErrors.title.required,
              // },
              // {
              //   pattern: new RegExp(/^[0-9A-Za-z_-]+$/),
              //   message: 'Special characters are not allowed.',
              // },
              () => ({
                validator(_, value) {
                  if (value !== undefined) {
                    value = value.trim();
                  }

                  if (!value || value === undefined) {
                    return Promise.reject(
                      Data.addReferenceObject.vaidationErrors.title.required,
                    );
                  } else {
                    if (new RegExp(/^[^@!=\-+#﹘—⸺⸻].*$/).test(value)) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error('Special characters are not allowed.'),
                    );
                  }
                },
              }),
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
              disabled={!canDeleted}
              data-test='formTitleInput'
              placeholder='eg. Employees List'
            />
          </Form.Item>
          <Form.Item
            name='code'
            className='code'
            label={<Trans>Code</Trans>}
            data-test='code'
            required
            rules={[
              // {
              //   required: true,
              //   message: Data.addReferenceObject.vaidationErrors.code.required,
              // },
              // {
              //   pattern: new RegExp(/^[0-9A-Za-z_-]+$/),
              //   message: 'Special characters are not allowed.',
              // },
              () => ({
                validator(_, value) {
                  if (value !== undefined) {
                    value = value.trim();
                  }

                  if (!value || value === undefined) {
                    return Promise.reject(
                      Data.addReferenceObject.vaidationErrors.code.required,
                    );
                  } else {
                    if (new RegExp(/^[^@!=\-+#﹘—⸺⸻].*$/).test(value)) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error('Special characters are not allowed.'),
                    );
                  }
                },
              }),
            ]}
            validateStatus={
              backend_error.hasOwnProperty('code') ? 'error' : 'validating'
            }
            help={
              backend_error.hasOwnProperty('code')
                ? backend_error.code[0]
                : null
            }
          >
            <Input
              disabled={isUpdateMode}
              data-test='formCodeInput'
              placeholder='eg. EMPLST'
            />
          </Form.Item>
          <Form.Item
            label={<Trans>Items</Trans>}
            trigger='onBlur'
            className='items-field'
            data-test='items'
            required
          >
            <Form.List name='items'>
              {(fields: any[], { add, remove }: any) => {
                return (
                  <div>
                    <div
                      className={`max-5-scroll ${
                        fields.length > 5 ? `active` : ``
                      }`}
                    >
                      {fields.map((field, _index) => {
                        return (
                          <Form.Item
                            required={true}
                            key={field.key}
                            data-test='itemsList'
                          >
                            <Form.Item
                              className='reference-item-input'
                              {...field}
                              validateTrigger={['onChange']}
                              required
                              rules={[
                                // {
                                //   required: true,
                                //   whitespace: true,
                                //   message:
                                //     Data.addReferenceObject.vaidationErrors.items
                                //       .required,
                                // },
                                ({ getFieldValue }) => ({
                                  validator(_rule, value) {
                                    const matchItems = getFieldValue(
                                      'items',
                                    ).filter((o: string) => o === value);
                                    if (!value || matchItems.length < 2) {
                                      return Promise.resolve();
                                    }
                                    return Promise.reject(
                                      Data.addReferenceObject.vaidationErrors
                                        .items.unique,
                                    );
                                  },
                                }),
                                // {
                                //   pattern: new RegExp(/^[0-9A-Za-z_-]+$/),
                                //   message: 'Special characters are not allowed.',
                                // },
                                () => ({
                                  validator(_, value) {
                                    if (value !== undefined) {
                                      value = value.trim();
                                    }

                                    if (!value || value === undefined) {
                                      return Promise.reject(
                                        Data.addReferenceObject.vaidationErrors
                                          .items.required,
                                      );
                                    } else {
                                      if (
                                        new RegExp(/^[^@!=\-+#﹘—⸺⸻].*$/).test(
                                          value,
                                        )
                                      ) {
                                        return Promise.resolve();
                                      }
                                      return Promise.reject(
                                        new Error(
                                          'Special characters are not allowed.',
                                        ),
                                      );
                                    }
                                  },
                                }),
                              ]}
                              noStyle
                            >
                              {field.key <= referenceItemList.length - 1 &&
                              isUpdateMode ? (
                                <Input
                                  disabled={isUpdateMode}
                                  className='item-input extend'
                                  placeholder='eg. Item 1'
                                />
                              ) : (
                                <Input
                                  // disabled={isUpdateMode}
                                  className='item-input'
                                  placeholder='eg. Item 1'
                                />
                              )}
                              {/* <Input
                                // disabled={isUpdateMode}
                                className='item-input'
                                placeholder='eg. Item 1'
                              /> */}
                            </Form.Item>
                            {field.key > referenceItemList.length - 1 &&
                              isUpdateMode && (
                                <>
                                  {fields.length > 1 ? (
                                    <MinusCircleOutlined
                                      className='dynamic-delete-button'
                                      onClick={() => {
                                        remove(field.name);
                                      }}
                                    />
                                  ) : (
                                    <MinusCircleOutlined className='dynamic-delete-button disabled' />
                                  )}
                                </>
                              )}
                          </Form.Item>
                        );
                      })}
                    </div>
                    <Form.Item>
                      <Button
                        type='dashed'
                        data-test='addItem'
                        onClick={() => {
                          add();
                        }}
                      >
                        <PlusOutlined /> <Trans>Add Item</Trans>
                      </Button>
                    </Form.Item>
                  </div>
                );
              }}
            </Form.List>
          </Form.Item>
          <Form.Item>
            <div className='buttons'>
              {!isUpdateMode ? (
                <Button
                  data-test='formClearButton'
                  ghost
                  type='primary'
                  onClick={() => _resetFormData()}
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
                onClick={submitDataFn}
              >
                {isUpdateMode ? <Trans>Update</Trans> : <Trans>Save</Trans>}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </div>
    </HeaderBarWrapper>
  );
};

export default memo(connector(AddReferenceObject));
