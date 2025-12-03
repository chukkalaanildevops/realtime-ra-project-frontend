import { Trans } from '@lingui/macro';
import { Checkbox, Col, Form, Input, Row, Select } from 'antd';
import React from 'react';

const BenefitCategoryForm = (props: any) => {
  const {
    backendError,
    onFieldChange,
    entityList,
    isUpdate,
    wageTypes,
    form,
  } = props;
  return (
    <Form layout='vertical' form={form}>
      <Form.Item
        label={<Trans>Title</Trans>}
        name='title'
        validateStatus={
          backendError.hasOwnProperty('title') ? 'error' : 'validating'
        }
        help={
          backendError.hasOwnProperty('title') ? backendError.title[0] : null
        }
        rules={[
          {
            required: true,
            message: 'Title Required',
          },
        ]}
      >
        <Input onChange={onFieldChange} />
      </Form.Item>

      <Form.Item noStyle>
        <Row gutter={20} align='bottom'>
          <Col span={12}>
            <Form.Item
              label={<Trans>Code</Trans>}
              name='code'
              validateStatus={
                backendError.hasOwnProperty('code') ? 'error' : 'validating'
              }
              help={
                backendError.hasOwnProperty('code')
                  ? backendError.code[0]
                  : null
              }
              rules={[
                {
                  required: true,
                  message: 'Code Required',
                },
              ]}
            >
              <Input onChange={onFieldChange} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label=' '
              name='is_active'
              validateStatus={
                backendError.hasOwnProperty('is_active')
                  ? 'error'
                  : 'validating'
              }
              help={
                backendError.hasOwnProperty('is_active')
                  ? backendError.is_active[0]
                  : null
              }
              valuePropName='checked'
            >
              <Checkbox onClick={onFieldChange}>
                <Trans>Is Active</Trans>
              </Checkbox>
            </Form.Item>
          </Col>
        </Row>
      </Form.Item>
      <Form.Item
        label={<Trans>Company</Trans>}
        name='legal_entity_uuid'
        validateStatus={
          backendError.hasOwnProperty('legal_entity_uuid')
            ? 'error'
            : 'validating'
        }
        help={
          backendError.hasOwnProperty('legal_entity_uuid')
            ? backendError.legal_entity_uuid[0]
            : null
        }
        rules={[
          {
            required: true,
            message: 'Company Required',
          },
        ]}
      >
        <Select
          showSearch
          filterOption={(input: any, option: any) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          disabled={isUpdate}
          onChange={onFieldChange}
        >
          {entityList.map((item: any) => (
            <Select.Option value={item.uuid} key={item.uuid}>
              {item.title}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        label={<Trans>Pay Component</Trans>}
        name='wage_type'
        validateStatus={
          backendError.hasOwnProperty('wage_type') ? 'error' : 'validating'
        }
        help={
          backendError.hasOwnProperty('wage_type')
            ? backendError.wage_type[0]
            : null
        }
        rules={[
          {
            required: true,
            message: 'Pay Component Required',
          },
        ]}
      >
        <Select
          showSearch
          filterOption={(input: any, option: any) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          onChange={onFieldChange}
        >
          {wageTypes.map((item: any) => (
            <Select.Option value={item.id} key={item.id}>
              {item.title}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
    </Form>
  );
};
export default BenefitCategoryForm;
