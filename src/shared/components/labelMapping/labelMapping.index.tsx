/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  FC,
  memo,
  FocusEvent,
  useState,
  ChangeEvent,
  useEffect,
} from 'react';
import { Input, Table, Form, Skeleton } from 'antd';
import { ILabelMappingProps, Item } from './labelMapping.model';

import './labelMapping.index.less';
import { Trans } from '@lingui/macro';

/**
 * This component is providing user interface and functionality to rename fields label.
 * This component is saving each input value in inner state untill the input is under focus state.
 * Once that input's blur event occur the data merge(replacing edited label name) and pass to function 'saveMappedLabel'
 * Note: We are not handling any input value state. we are only passing defaultValue to inputs.
 * @function LabelMapping
 * @param {Ilabel} labelData : store label data.
 * @param {function} saveMappedLabel : this function used to store new label data in store. siply pass new lable data as an argument.
 * @returns {React.ReactElement} LabelMapping : Component.
 */
const LabelMapping: FC<ILabelMappingProps> = props => {
  const {
    labelData,
    isLabelDataListLoaded = false,
    saveMappedLabel,
    isSFLabel,
  } = props;
  const [labelState, updateLabelState] = useState<string>('');
  const [form] = Form.useForm();

  useEffect(() => {
    form.resetFields();
  }, [labelData]);

  /**
   * This Function is occure after on change of each input inside table.
   * Take that focused input value and store inside 'labelState' state.
   * @function handleInputChange
   * @param {ChangeEvent<HTMLInputElement>} e : event object
   * @returns {void}
   */
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    updateLabelState(e.target.value);
  };

  /**
   * This function occure on focus of each input inside table.
   * This help to store intial value of input in 'labelState' state.
   * @function handleInputFocus
   * @param { string } defaultMapped : input value.
   * @param { FocusEvent<HTMLInputElement> } _e : event object
   * @returns { void }
   */
  const handleInputFocus = (
    defaultMapped: string,
    _e: FocusEvent<HTMLInputElement>,
  ) => {
    updateLabelState(defaultMapped);
  };

  /**
   * This function occure on blue of each input inside table.
   * This help to store new labelData inside store by passing new labeldata inside 'saveMappedLabel' function.
   * @function handleInputBlur
   * @param { string } defaultLabel : intial value of that label passed by 'labelData'.
   * @param { string } key : outer object key in 'labelData'.
   * @param { number } inputName : input's name attribute value.
   * @param { FocusEvent<HTMLInputElement> } _e : event object.
   * @param { boolean } is_mandatory : label is mandatory or not.
   * @returns { void }
   */
  const handleInputBlur = (
    defaultLabel: string,
    key: string,
    inputName: number,
    is_mandatory?: boolean,
  ): void => {
    if (labelState !== '') {
      // if (defaultLabel !== labelState) {
      const newLabelData = {
        ...labelData,
        [key]: {
          default: defaultLabel,
          mapped: labelState,
          is_mandatory: is_mandatory || false,
        },
      };
      saveMappedLabel(newLabelData);
      // }
    } else {
      const value = {
        [`input_${inputName}`]: labelData[key].mapped || labelData[key].default,
      };
      form.setFieldsValue(value);
    }
  };

  const columns: any[] = [
    {
      title: <Trans>Label Name</Trans>,
      dataIndex: 'labelName',
      align: 'left',
      editable: false,
      width: '40%',
    },
    {
      title: isSFLabel ? (
        <Trans>SF Label Name</Trans>
      ) : (
        <Trans>New Label Name</Trans>
      ),
      dataIndex: 'newLabelName',
      align: 'Left',
      editable: false,
      width: '50%',
      render: (text: any, record: Item, _index: number) => {
        return (
          <Form.Item
            name={`input_${_index}`}
            label=''
            style={{ margin: 0, marginBottom: 0 }}
            required
            rules={[
              () => ({
                validator(_, value) {
                  if (value !== undefined) {
                    value = value?.trim();
                  }
                  if (!value || value === undefined) {
                    return Promise.reject('Label can not be set empty!');
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
          >
            <Input
              placeholder={text}
              // placeholder="Click To Enter New Label Name"
              defaultValue={text}
              onChange={handleInputChange}
              onFocus={handleInputFocus.bind(null, text)}
              onBlur={handleInputBlur.bind(
                null,
                record.labelName,
                record.key,
                _index,
                record?.is_mandatory,
              )}
            />
          </Form.Item>
        );
      },
    },
  ];

  const data: Item[] = [];
  for (let [key, value] of Object.entries(labelData)) {
    data.push({
      key: String(key),
      labelName: value.default,
      newLabelName: value.mapped,
      is_mandatory: Boolean(value?.is_mandatory),
    });
  }

  return (
    <div className='form-design-container'>
      <div className='label-mapping-container'>
        {isLabelDataListLoaded ? (
          <Skeleton loading={isLabelDataListLoaded} />
        ) : (
          <Form form={form}>
            <Table
              columns={columns}
              dataSource={data.sort((a: any, b: any) =>
                a.labelName.localeCompare(b.labelName),
              )}
              pagination={false}
              bordered={true}
            />
          </Form>
        )}
      </div>
    </div>
  );
};

export default memo(LabelMapping);
