/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, Dispatch } from 'react';
import {
  HeaderBarWrapper,
  BackButton,
  ErrorBoundary,
} from '../../../shared/components';
import { useHistory, useParams } from 'react-router-dom';
import { Form, Input, message, Select, Button, Skeleton } from 'antd';

import './addUpdateGlAccount.index.less';
import { connect, ConnectedProps } from 'react-redux';
import {
  getGlAccountLoader,
  getGlLoadingMessage,
  getGlSuccessMessage,
  getGlAccountTypes,
  getGlAccountDetails,
  getGlErrorMessage,
} from '../../../shared/redux/rootReducer';

import {
  fetchGlAccountChoices,
  fetchGlAccounts,
  createUpdateGlAccount,
} from '../../../shared/redux/glAccount/glAccount.thunk';
import { CHOICES } from '../../../shared/redux/glAccount/glAccount.model';
import {
  resetMessages,
  saveGlAccountById,
} from '../../../shared/redux/glAccount/glAccount.actions';
import { Trans } from '@lingui/macro';

const GlAccountConfiguration: React.FC<ConnectedProps<typeof connector>> = ({
  _fetchGlAccountDetails,
  _fetchGlAccountChoices,
  _createUpdateAccount,
  _resetMessages,
  _saveGlAccountById,
  accountDetails,
  accountTypes,
  error,
  isLoading,
  // loadingMessage,
  success,
}) => {
  const [form] = Form.useForm();
  const history = useHistory();
  const params: any = useParams();

  useEffect(() => {
    const id = params.id;
    if (id) {
      _fetchGlAccountDetails(id);
    }
    _fetchGlAccountChoices('account_type');
  }, []);

  // useEffect(() => {
  //   if (isLoading && loadingMessage) {
  //     message.loading(loadingMessage);
  //   } else {
  //     message.destroy();
  //   }
  // }, [isLoading, loadingMessage]);

  const getElemOrSkeleton = (
    _text: string | React.ReactNode,
    _record?: any,
    _index?: number,
  ) => {
    return isLoading ? (
      <Skeleton.Input size='small' active={isLoading} />
    ) : (
      _text
    );
  };

  useEffect(() => {
    if (success) {
      message.success(success, 2, () => {
        _resetMessages();
        history.goBack();
      });
    }
  }, [success]);

  useEffect(() => {
    try {
      if (error) {
        if (error instanceof Object) {
          const errors = Object.keys(error).map(item => ({
            name: item,
            errors: error[item],
          }));
          form.setFields(errors);
        } else if (typeof error === 'string') {
          message.error(error || 'Something went wrong');
        }
        _resetMessages();
      }
    } catch (e) {}
  }, [error]);

  useEffect(() => {
    try {
      if (accountDetails && Object.keys(accountDetails).length > 0) {
        const fieldsValue = {
          ...accountDetails,
          account_type: accountDetails.account_type.code,
        };
        form.setFieldsValue(fieldsValue);
      }
    } catch (e) {}
  }, [accountDetails]);

  const resetForm = () => {
    form.resetFields();
  };

  const submitForm = async () => {
    try {
      const values = await form.validateFields();
      const id = params.id;
      _createUpdateAccount(values, id);
      form.resetFields();
      _saveGlAccountById();
    } catch (e) {}
  };

  const renderOptions = (options: any[]) => {
    return options.map(item => (
      <Select.Option value={item.code}>{item.title}</Select.Option>
    ));
  };
  return (
    <ErrorBoundary>
      <HeaderBarWrapper
        headerCommonProps={{ title: <Trans>Gl Account Configuration</Trans> }}
      >
        <div style={{ marginBottom: 16 }}>
          <BackButton />
        </div>
        <div className='gl-account-configuration'>
          <div className='form-container'>
            <Form form={form} layout='vertical' autoComplete='off'>
              <Form.Item
                validateTrigger='onBlur'
                name='account_number'
                label={<Trans>Account Number</Trans>}
                required
                rules={[
                  // { required: true, message: 'Account Number Required' },
                  {
                    max: 128,
                    message: "Account number can't exceed 128 characters",
                  },
                  // {
                  //   pattern: new RegExp(/^[0-9A-Za-z_].*$/),
                  //   message: 'Special characters are not allowed.',
                  // },
                  () => ({
                    validator(_, value) {
                      if (value !== undefined) {
                        value = value.trim();
                      }

                      if (!value || value === undefined) {
                        return Promise.reject('Account Number Required');
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
              >
                {isLoading ? (
                  getElemOrSkeleton
                ) : (
                  <Input autoComplete='new-password' />
                )}
              </Form.Item>
              <Form.Item
                name='account_type'
                label={<Trans>Account Type</Trans>}
                required
              >
                {isLoading ? (
                  getElemOrSkeleton
                ) : (
                  <Select>{renderOptions(accountTypes)}</Select>
                )}
              </Form.Item>
              <Form.Item>
                <div className='tab-footer'>
                  <Button
                    style={{ padding: '0 3rem', margin: '0 1rem' }}
                    onClick={resetForm}
                  >
                    <Trans>Clear</Trans>
                  </Button>
                  <Button
                    style={{ padding: '0 3rem' }}
                    type='primary'
                    onClick={submitForm}
                  >
                    <Trans>Save</Trans>
                  </Button>
                </div>
              </Form.Item>
            </Form>
          </div>
        </div>
      </HeaderBarWrapper>
    </ErrorBoundary>
  );
};

const mapStateToProps = (state: any) => ({
  accountTypes: getGlAccountTypes(state),
  isLoading: getGlAccountLoader(state),
  loadingMessage: getGlLoadingMessage(state),
  success: getGlSuccessMessage(state),
  error: getGlErrorMessage(state),
  accountDetails: getGlAccountDetails(state),
});

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  _fetchGlAccountDetails: (id: string) => dispatch(fetchGlAccounts(id)),
  _fetchGlAccountChoices: (choice: CHOICES) =>
    dispatch(fetchGlAccountChoices(choice)),
  _createUpdateAccount: (body: any, id: string) =>
    dispatch(createUpdateGlAccount(body, id)),
  _resetMessages: () => dispatch(resetMessages()),
  _saveGlAccountById: () => dispatch(saveGlAccountById({})),
});
const connector = connect(mapStateToProps, mapDispatchToProps);
export default connector(GlAccountConfiguration);
