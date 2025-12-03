import React from 'react';
import { Form, Input, Select } from 'antd';
import './fileEncryptionForm.index.less';
import { Trans } from '@lingui/macro';

const FileEncryptionForm: React.FC<{
  form: any;
  entityList?: any;
  isFileSplitting: any;
  isLoading: any;
  isDisableEntity: any;
}> = props => {
  const { Option } = Select;
  const {
    form,
    entityList,
    isFileSplitting,
    isLoading,
    isDisableEntity,
  } = props;
  const publicKeyName = isFileSplitting ? 'entity_pb_key' : 'standard_pb_key';

  return (
    <div>
      <Form
        // {...fullscreenFormLayout}
        colon={false}
        form={form}
        // {...formItemLayout}
        autoComplete='off'
        layout='vertical'
        className='encryption-form'
      >
        {isFileSplitting && (
          <Form.Item
            validateTrigger='onBlur'
            label={<Trans>Entity</Trans>}
            name='legal_entity_uuid'
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select
              allowClear
              showSearch
              disabled={isLoading}
              className=''
              filterOption={(input: any, option: any) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {entityList?.map((o: any, i: number) => (
                <Option
                  disabled={isDisableEntity(o.uuid)}
                  value={o.uuid}
                  key={`${o.title}_${i}}`}
                >
                  {o.title}
                </Option>
              ))}
            </Select>
          </Form.Item>
        )}

        <Form.Item
          name={publicKeyName}
          label={<Trans>Public Key</Trans>}
          className='encryption-form-field'
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input.TextArea disabled={isLoading} autoSize={true} />
        </Form.Item>
      </Form>
    </div>
  );
};

export default FileEncryptionForm;
