import React from 'react';
import { EditableTableProps, EditableCellProps } from './editableTable.model';
import {
  Table,
  Button,
  Input,
  InputNumber,
  Form,
  DatePicker,
  Upload,
} from 'antd';
import { FormItemProps } from 'antd/lib/form';
import { Base } from '../../hooks/useEditable/useEditable.model';
import { Trans } from '@lingui/macro';

const getComponent = (type: 'text' | 'number' | 'date' | 'password') => {
  switch (type) {
    case 'text':
      return <Input autoComplete='off' />;
    case 'number':
      return (
        <InputNumber
          min={0}
          precision={2}
          max={999999}
          style={{ width: '100%' }}
          type='number'
        />
      );
    case 'date':
      return <DatePicker format='DD/MM/YYYY' />;
    case 'password':
      return <Input.Password />;
  }
};

const EditableCell = <T extends Base>({
  editing,
  dataIndex,
  title,
  inputType,
  children,
  isRequired,
  errorMsg,
  ...restProps
}: EditableCellProps<T>) => {
  // const {
  //   editing,
  //   dataIndex,
  //   title,
  //   inputType,
  //   record,
  //   index,
  //   children,
  //   isRequired,
  //   errorMsg,
  //   ...restProps
  // } = props;
  // const inputNode = inputType === 'password' ? <Input.Password /> : <Input />;
  const inputNode = getComponent(inputType);
  const formInputProps: FormItemProps = {
    children: null,
  };

  if (errorMsg) {
    formInputProps.validateStatus = 'error';
    formInputProps.help = errorMsg;
  }

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ width: '100%' }}
          {...formInputProps}
          rules={[
            {
              required: isRequired,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const EditableTable: React.FC<EditableTableProps<any>> = ({
  onAddItem,
  onUpload,
  ...restProps
}) => {
  // const { editableCell, onAddItem, ...restProps } = props;
  const pagination = restProps.pagination ? restProps.pagination : false;
  return (
    <div>
      {' '}
      <Table
        bordered
        components={{
          body: {
            cell: EditableCell as any,
          },
        }}
        pagination={pagination}
        {...restProps}
      ></Table>
      {onAddItem && (
        <Button
          type='link'
          size='large'
          onClick={onAddItem}
          // disabled={editingKey !== ''}
        >
          Add New{' '}
        </Button>
      )}
      {onUpload && (
        <Upload accept='.csv'>
          <Button type='link' size='large' onClick={onUpload}>
            <Trans>Upload</Trans>
          </Button>
        </Upload>
      )}
    </div>
  );
};

export default EditableTable;
