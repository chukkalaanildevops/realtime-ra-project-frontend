import { useState } from 'react';
import { FormInstance } from 'antd/lib/form';
import { Base } from './useEditable.model';

const useEditable = <T extends Base>(dataSource: T[], form: FormInstance) => {
  const [data, setData] = useState(dataSource);
  const [editingKey, setEditingKey] = useState('');

  const save = async (rowItem?: T) => {
    const key = editingKey;
    try {
      const row = rowItem ? rowItem : ((await form.validateFields()) as T);
      const newData = [...data];
      const index = newData.findIndex(item => key === item.key);
      row.isNew = false;
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setData(newData);
        setEditingKey('');
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey('');
      }
    } catch (errInfo) {}
  };

  const update = (record: T) => {
    form.setFieldsValue({ ...record });
    setEditingKey(record.key);
  };

  const cancel = () => {
    const key = editingKey;
    if (
      key === data[data.length - 1].key &&
      data[data.length - 1].isNew === true
    ) {
      const newData = [...data];
      newData.pop();
      setData(newData);
    }
    setEditingKey('');
  };

  const addNewItem = (isRow: boolean = true) => {
    form.resetFields();
    const newItem = { key: data.length + 2 + '', isNew: true } as T;
    if (isRow) {
      const newData = [...data, newItem];
      setData(newData);
    }
    setEditingKey(newItem.key);
  };

  return { save, setEditingKey, update, cancel, editingKey, data, addNewItem };
};

export default useEditable;
