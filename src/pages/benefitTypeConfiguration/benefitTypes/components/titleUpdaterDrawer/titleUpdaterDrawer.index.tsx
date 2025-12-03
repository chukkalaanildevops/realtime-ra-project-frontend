import React, { memo, FC, useEffect } from 'react';

import { Button, Form, Input } from 'antd';

import { AppDrawer } from '../../../../../shared/components';

// import { IBackendErrors } from '../../../../../shared/model';
// import {
//   ITitleAndCode,
//   ITitleUpdateConfigData,
// } from '../../../expenseTypeConfiguration.model';
import { initialState } from '../../../benefitTypeConfiguration.reducer';

import Errors from '../../../../expenseTypeConfiguration/expenseTypeConfiguration.data.json';

import './titleUpdaterDrawer.index.less';
import { Trans } from '@lingui/macro';

const TitleUpdaterDrawer: FC<{
  titleUpdateConfigData: any;
  backendError?: any;
  _setTitleUpdateConfigData: (data: any) => void;
  _updateTitleAndCode: (
    id: number,
    data: any,
    callback?: (isSuccess: boolean) => void,
  ) => void;
}> = props => {
  const {
    titleUpdateConfigData,
    _setTitleUpdateConfigData,
    _updateTitleAndCode,
  } = props;
  const [form] = Form.useForm();
  useEffect(() => {
    try {
      form.setFieldsValue(titleUpdateConfigData);
    } catch (e) {}
  }, [form, titleUpdateConfigData]);
  const updateDisabled =
    form.getFieldValue('code') === titleUpdateConfigData.code &&
    form.getFieldValue('title') === titleUpdateConfigData.title;
  return (
    <>
      <AppDrawer
        data-test='appDrawer-title-updated'
        title={<Trans>Update Title And Code</Trans>}
        visible={titleUpdateConfigData.id !== null}
        destroyOnClose={true}
        maskClosable={true}
        closable={true}
        onClose={() => {
          form.resetFields();
          _setTitleUpdateConfigData(initialState.titleUpdateConfigData);
        }}
        showCancelButton={false}
        showOkButton={false}
        // getContainer='.expense-type-listing-container'
        className='expense-type-configuration-title-updater'
        width='40%'
      >
        <Form
          form={form}
          layout='vertical'
          colon={false}
          {...{ autoComplete: 'off' }}
          size='middle'
          scrollToFirstError={true}
          onFinish={value => {
            _updateTitleAndCode(
              titleUpdateConfigData.id as number,
              value as any,
              (isSuccess: boolean) => {
                if (isSuccess) {
                  form.resetFields();
                  _setTitleUpdateConfigData(initialState.titleUpdateConfigData);
                }
              },
            );
          }}
          className='title-code-updater-container'
          initialValues={{
            title: titleUpdateConfigData.title || '',
            code: titleUpdateConfigData.code || '',
          }}
        >
          <Form.Item
            validateTrigger='onChange'
            label={<Trans>Title</Trans>}
            className='title'
            name='title'
            data-test='title'
            required
            rules={[
              // { required: true, message: Errors.TITLE_REQUIRED },
              // {
              //   pattern: new RegExp(/^[0-9 A-Za-z_-]+$/),
              //   message: 'Special characters are not allowed.',
              // },
              () => ({
                validator(_, value) {
                  if (value !== undefined) {
                    value = value.trim();
                  }

                  if (!value || value === undefined) {
                    return Promise.reject(Errors.TITLE_REQUIRED);
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
            // validateStatus={
            //   backendError.hasOwnProperty('title') ? 'error' : 'validating'
            // }
            // help={
            //   backendError.hasOwnProperty('title') ? backendError.title[0] : null
            // }
          >
            <Input
              autoComplete='new-password'
              placeholder={titleUpdateConfigData.title || ''}
            />
          </Form.Item>
          <Form.Item
            validateTrigger='onChange'
            label={<Trans>Code</Trans>}
            className='code'
            name='code'
            required
            rules={[
              // { required: true, message: Errors.CODE_REQUIRED },
              // {
              //   pattern: new RegExp(/^[0-9 A-Za-z_-]+$/),
              //   message: 'Special characters are not allowed.',
              // },
              () => ({
                validator(_, value) {
                  if (value !== undefined) {
                    value = value.trim();
                  }

                  if (!value || value === undefined) {
                    return Promise.reject(Errors.CODE_REQUIRED);
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
            // validateStatus={
            //   backendError.hasOwnProperty('code') ? 'error' : 'validating'
            // }
            // help={
            //   backendError.hasOwnProperty('code') ? backendError.code[0] : null
            // }
          >
            <Input
              autoComplete='new-password'
              placeholder={titleUpdateConfigData.code || ''}
            />
          </Form.Item>
          <Form.Item>
            <div className='title-updater-action-btn-container'>
              <Button
                onClick={() => {
                  form.resetFields();
                  _setTitleUpdateConfigData(initialState.titleUpdateConfigData);
                }}
              >
                <Trans>Cancel</Trans>
              </Button>
              <Button
                type='primary'
                htmlType='submit'
                disabled={updateDisabled}
              >
                <Trans>Update</Trans>
              </Button>
            </div>
          </Form.Item>
        </Form>
      </AppDrawer>
    </>
  );
};

export default memo(TitleUpdaterDrawer);
