import React, { FC, memo, Dispatch, useEffect } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { stateInterface } from '../../../shared/redux/rootReducer';
import { Form, Row, Col, Button, Input, Skeleton } from 'antd';
import { Trans } from '@lingui/macro';
import {
  setFormData,
  resetFormData,
  setAddMode,
  setUpdateMode,
  resetBackendError,
} from '../../../shared/redux/wageType/wageType.actions';
import { IformData } from '../../../shared/redux/wageType/wageType.model';
import {
  createWageType,
  fetchWageTypeUsingId,
  modifyWageTypeUsingId,
  fetchWageTypeList,
} from '../../../shared/redux/wageType/wageType.thunk';
import Data from '../wageTypeConfiguration.data.json';

const mapStateToProps = (state: stateInterface) => {
  const {
    wageTypeList,
    singleWageTypeLoader,
    formData,
    isAddMode,
    isUpdateMode,
    updateId,
    backend_error,
  } = state.WageType;
  return {
    wageTypeList,
    singleWageTypeLoader,
    formData,
    isAddMode,
    isUpdateMode,
    updateId,
    backend_error,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  return {
    _setFormData: (formData: IformData) => dispatch(setFormData(formData)),
    _resetFormData: () => dispatch(resetFormData()),
    _createWageType: (data: IformData, callback?: Function) =>
      dispatch(createWageType(data, callback)),
    _modifyWageTypeUsingId: (
      id: number,
      data: IformData,
      callback?: Function,
    ) => dispatch(modifyWageTypeUsingId(id, data, callback)),
    _setAddMode: (data: boolean) => dispatch(setAddMode(data)),
    _setUpdateMode: (data: boolean) => dispatch(setUpdateMode(data)),
    _fetchWageTypeUsingId: (id: number) => dispatch(fetchWageTypeUsingId(id)),
    _fetchWageTypeList: (page: number = 1, size: number) =>
      dispatch(fetchWageTypeList(page, size)),
    _resetBackendError: () => dispatch(resetBackendError()),
  };
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type Tprops = ConnectedProps<typeof connector> & {
  pageNo: number;
  size: number;
};

const AddUpdateForm: FC<Tprops> = props => {
  const {
    wageTypeList,
    singleWageTypeLoader,
    isAddMode,
    backend_error,
    formData,
    isUpdateMode,
    updateId,
    pageNo,
    size,
    _setFormData,
    _resetFormData,
    _createWageType,
    _setAddMode,
    _setUpdateMode,
    _fetchWageTypeUsingId,
    _modifyWageTypeUsingId,
    _fetchWageTypeList,
    _resetBackendError,
  } = props;
  const [form] = Form.useForm();
  const handleClearForm = () => {
    _resetFormData();
    _resetBackendError();
    form.resetFields();
  };

  useEffect(() => {
    return () => {
      _resetFormData();
      _resetBackendError();
      form.resetFields();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isUpdateMode) {
      if (wageTypeList.length) {
        const updateWageTypeObj = wageTypeList.filter(
          o => o.id === Number(updateId),
        );
        if (updateWageTypeObj.length && updateWageTypeObj[0].title) {
          _setFormData({
            title: updateWageTypeObj[0].title,
          });
        } else _fetchWageTypeUsingId(Number(updateId));
      } else _fetchWageTypeUsingId(Number(updateId));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUpdateMode]);

  useEffect(() => {
    form.setFieldsValue(formData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData]);

  const handleFormFieldsValueChanges = (
    _changedValues: any,
    _values: any,
  ): void => {
    _setFormData(_values);
  };

  const commonCallBack = () => {
    setTimeout(() => {
      _fetchWageTypeList(pageNo, size);
      handleClearForm();
    }, 1000);
  };

  const onFinish = () => {
    form
      .validateFields()
      .then(async () => {
        if (isAddMode) {
          await _createWageType(formData, () => {
            //callback
            _setAddMode(false);
            commonCallBack();
          });
        } else {
          await _modifyWageTypeUsingId(Number(updateId), formData, () => {
            //callback
            _setUpdateMode(false);
            commonCallBack();
          });
        }
      })
      .catch(_err => {
        console.error(_err);
      });
  };

  return (
    <div className='wage-type-form-container'>
      <Skeleton active={singleWageTypeLoader} loading={singleWageTypeLoader}>
        <Form
          form={form}
          initialValues={formData}
          layout='vertical'
          size='middle'
          autoComplete='off'
          scrollToFirstError={true}
          onValuesChange={handleFormFieldsValueChanges}
          onFinish={onFinish}
        >
          <Row gutter={12}>
            <Col span={24}>
              <Form.Item
                name='title'
                className='title'
                label={<Trans>Title</Trans>}
                required
                rules={[
                  () => ({
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
                        return Promise.reject(
                          new Error('Can not start with special character'),
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
                <Input data-test='formTitleInput' placeholder='eg. Payment' />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24} className='form-action-btn-container'>
              <Form.Item>
                {isAddMode ? (
                  <Button
                    data-test='formClearButton'
                    ghost
                    type='primary'
                    onClick={handleClearForm}
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
                >
                  {!isAddMode ? <Trans>Update</Trans> : <Trans>Save</Trans>}
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Skeleton>
    </div>
  );
};

export default memo(connector(AddUpdateForm));
