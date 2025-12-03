import React, {
  FC,
  memo,
  useState,
  useEffect,
  Dispatch,
  ReactNode,
  useRef,
} from 'react';

import { customFieldsProps, IborderBoxLayout } from './customFields.model';

import {
  Select,
  Button,
  Modal,
  Form,
  Input,
  Radio,
  Checkbox,
  TimePicker,
  InputNumber,
  message,
  Row,
  Col,
} from 'antd';

import {
  CopyOutlined,
  PlusOutlined,
  MinusCircleOutlined,
  SafetyCertificateTwoTone,
} from '@ant-design/icons';

import {
  customObjInterface,
  IcustomFields,
  IcustomFieldsLayoutCol,
  TcustomFieldsLayout,
} from '../../../pages/expenseTypeConfiguration/expenseTypeConfiguration.model';

import './customFields.index.less';

import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

import moment from 'moment';

import { getReferenceObjectDropdownList } from '../../redux/rootReducer';

import {
  createReferenceObject,
  getObjectReferenceDropdownList,
} from '../../redux/referenceObject/referenceObject.thunk';

import { connect, ConnectedProps } from 'react-redux';

import { Droppable, Draggable } from './customFields.draggable';
import { Trans } from '@lingui/macro';
import Data from './customFields.data.json';
import { NoData } from '..';

const CustomFields: FC<customFieldsProps &
  ConnectedProps<typeof connector>> = ({
  formStructure,
  savedCustomFields,
  isUpdateMode,
  referenceObjects,
  errors = {},
  isRemoveDeletedField = false,
  saveCustomFields,
  fetchReferenceObjectsds,
  createObjectReference,
  updateTabSwitchConfirmationVisibility,
  title,
}) => {
  const { RangePicker } = TimePicker;
  // const [showFieldsModal, toggleFieldsModal] = useState(false);

  const [newCustomFieldData, setNewCustomFieldData] = useState<
    customObjInterface | undefined
  >();

  const [filteredReferenceObjects, setFilteredReferenceObjects] = useState(
    referenceObjects,
  );

  const [dragState, updateDragState] = useState<string>('');

  const [temp, setTemp] = useState<any>();

  const [val, forceUpdate] = useState(true);

  const [editTitle, setEditTitle] = useState('');

  const [form] = Form.useForm();

  const [refObjForm] = Form.useForm();

  const fieldLabelRef = useRef<Input>(null);

  /**
   * this Effect executed on change of referenceObjects
   */
  useEffect(() => {
    setFilteredReferenceObjects(referenceObjects);
  }, [referenceObjects]);

  /**
   * this Effect is used as the component did mount.
   * fetches reference object.
   */
  useEffect(() => {
    fetchReferenceObjectsds();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * this Effect is used as the component did update
   */
  useEffect(() => {
    if (Boolean(newCustomFieldData))
      fieldLabelRef && fieldLabelRef.current && fieldLabelRef.current.focus();
  }, [newCustomFieldData]);

  const correctSubType = (type?: string) => {
    switch (String(type).toLocaleUpperCase()) {
      case 'SINGLESELECT':
        return 'Single Select';
      case 'MULTISELECT':
        return 'Multi Select';
      case 'SHORTTEXT':
        return 'Short Text';
      case 'LONGTEXT':
        return 'Long Text';
      case 'NUMBER':
        return 'Number';
      case 'PERCENTAGE':
        return 'Percentage';
      default:
        return type;
    }
  };

  /**
   * this function execue on click on any fields types.
   * @param {string} type
   * @returns {void}
   */
  const selectFieldType = (type: string): void => {
    setEditTitle('');
    form.resetFields();
    const newFields = formStructure[type];
    if (newFields.options) {
      const val = newFields.options;
      const typeVal = val ? val[0] : '';
      // const correctValue = correctSubType(typeVal);
      form.setFieldsValue({ sub_type: typeVal });
    }
    if (newFields.is_range) {
      form.setFieldsValue({ range_min: undefined, range_max: undefined });
    }
    setNewCustomFieldData(newFields);
    updateTabSwitchConfirmationVisibility &&
      updateTabSwitchConfirmationVisibility(true);
  };

  /**
   * this function create custom object and pass them iside saveCustomFields to store them in redux state.
   * @returns {Promise<void>}
   */
  const onCreateField = async (_values?: customObjInterface): Promise<void> => {
    try {
      const isFormValid = await form.validateFields();

      if (!isFormValid) {
        return;
      }

      const formVal = form.getFieldsValue();
      const values = formVal ? formVal : _values;

      if (values) {
        const obj: customObjInterface = {
          type: newCustomFieldData ? newCustomFieldData.type : '',
          title: values!.title,
          is_filled_by_admin: values.is_filled_by_admin,
          is_required: values.is_required,
        };

        if (
          values.sub_type &&
          (obj.type === 'TEXT' ||
            obj.type === 'NUMBER' ||
            obj.type === 'DROPDOWN')
        ) {
          obj.sub_type = values.sub_type;
        }

        if (obj.type === 'NUMBER' && newCustomFieldData?.is_range) {
          obj.is_range =
            typeof values.range_min === 'number' ||
            typeof values.range_max === 'number'
              ? true
              : false;
          if (obj.is_range) {
            obj.range_min =
              typeof values.range_min === 'number' ? values.range_min : null;
            obj.range_max =
              typeof values.range_max === 'number' ? values.range_max : null;
          } else {
            obj.range_min = null;
            obj.range_max = null;
          }
        } else if (obj.type === 'TIME' && newCustomFieldData?.is_range) {
          obj.is_range =
            moment.isMoment(values.time_range[0]) ||
            moment.isMoment(values.time_range[1])
              ? true
              : false;
          if (obj.is_range) {
            obj.range_min = moment.isMoment(values.time_range[0])
              ? values.time_range[0].format('HH:mm')
              : '';
            obj.range_max = moment.isMoment(values.time_range[1])
              ? values.time_range[1].format('HH:mm')
              : '';
          } else {
            obj.range_min = '';
            obj.range_max = '';
          }
        } else {
          delete obj.range_min;
          delete obj.range_max;
        }

        if (newCustomFieldData?.is_decimal_allowed && obj.type === 'NUMBER') {
          obj.is_decimal_allowed = values.is_decimal_allowed;
          obj.precision = values.precision ? values.precision : null;
        }

        if (values.source && obj.type === 'DROPDOWN') {
          let getRefObjID: number | undefined;
          if (Number(values.source)) getRefObjID = Number(values.source);
          else {
            const tempID: number = referenceObjects.filter(
              o => o.title === values.source,
            )[0]?.id;
            if (tempID) getRefObjID = tempID;
            else getRefObjID = undefined;
          }
          obj.reference_object_id = getRefObjID;
        }

        let updatedFields: customObjInterface[] = [...savedCustomFields.fields];
        let layout: TcustomFieldsLayout[] = [...savedCustomFields.layout];
        if (editTitle !== '') {
          const index = savedCustomFields.fields.findIndex(
            item => item.title === editTitle,
          );
          updatedFields.splice(index, 1, {
            ...savedCustomFields.fields[index],
            ...obj,
          });

          layout.forEach((o, rI) => {
            o.forEach((i, cI) => {
              if (i.title === savedCustomFields.fields[index].title) {
                layout[rI][cI].title = obj.title;
                return;
              }
            });
          });
        } else {
          updatedFields.push(obj);
          layout.push([{ title: obj.title }]);
        }

        saveCustomFields({
          fields: updatedFields,
          layout: layout,
        });

        setNewCustomFieldData(undefined);
        setEditTitle('');
        updateTabSwitchConfirmationVisibility &&
          updateTabSwitchConfirmationVisibility(false);
      }
    } catch (e) {
      console.error(e);
    }
  };

  /**
   * this execute if user click on edit button.
   * @param {customObjInterface} item
   * @returns {void}
   */
  const editCustomField = (item: customObjInterface): void => {
    const editObj = formStructure[item.type];
    setNewCustomFieldData(editObj);
    let fieldVal = {};
    if (item.type === 'DROPDOWN') {
      fieldVal = {
        ...fieldVal,
        source: referenceObjects.filter(
          o => o.id === item.reference_object_id,
        )[0]?.title,
      };
    } else if (item.type === 'TIME') {
      let time_range = [];
      typeof item.range_min === 'string' &&
        item.range_min !== '' &&
        moment.isMoment(moment(item.range_min as string)) &&
        time_range.push(
          item.range_min
            ? returnMomentForTimeRange(String(item.range_min))
            : returnMomentForTimeRange('23:59'),
        );
      typeof item.range_max === 'string' &&
        item.range_max !== '' &&
        moment.isMoment(moment(item.range_max as string)) &&
        time_range.push(
          item.range_max
            ? returnMomentForTimeRange(String(item.range_max))
            : returnMomentForTimeRange('00:00'),
        );

      fieldVal = {
        ...fieldVal,
        time_range,
      };
    }

    form.setFieldsValue({
      ...item,
      ...fieldVal,
      sub_type: correctSubType(item.sub_type) || item.sub_type,
    });
    setEditTitle(item.title);
    updateTabSwitchConfirmationVisibility &&
      updateTabSwitchConfirmationVisibility(true);
  };

  /**
   * This is asyc function.
   * This creates make a copy of custom field.
   * @param {customObjInterface} item
   * @returns {Promise<void>}
   */
  const cloneCustomField = async (item: customObjInterface): Promise<void> => {
    setNewCustomFieldData(formStructure[item.type]);
    setEditTitle('');
    form.resetFields();
    const valueObject: customObjInterface = {
      ...item,
      title: getUniqueTitle(`${item.title}_clone`),
    };
    updateTabSwitchConfirmationVisibility &&
      updateTabSwitchConfirmationVisibility(true);
    if (valueObject.type === 'TIME') {
      let time_range = [];
      moment.isMoment(String(item.range_max)) &&
        time_range.push(
          valueObject.range_max
            ? returnMomentForTimeRange(String(valueObject.range_max))
            : returnMomentForTimeRange('00:00'),
        );
      moment.isMoment(String(item.range_min)) &&
        time_range.push(
          valueObject.range_min
            ? returnMomentForTimeRange(String(valueObject.range_min))
            : returnMomentForTimeRange('23:59'),
        );
      form.setFieldsValue({ ...valueObject, time_range });
    } else {
      form.setFieldsValue({ ...valueObject });
    }
  };

  const getUniqueTitle = (newTitle: string) => {
    let tempTitle = newTitle;
    // eslint-disable-next-line no-loop-func
    while (savedCustomFields.fields.some(o => o.title === tempTitle)) {
      tempTitle += String(Math.floor(Math.random() * 100) + 1);
    }
    return tempTitle;
  };

  /**
   * this execute if user click on edit button.
   * @param {customObjInterface} item
   * @returns {void}
   */
  const deleteCustomField = (item: customObjInterface): void => {
    try {
      let newArray: customObjInterface[] = [...savedCustomFields.fields];
      if (!isRemoveDeletedField && item.hasOwnProperty('id')) {
        newArray = savedCustomFields.fields.map(i =>
          i.title === item.title
            ? {
                ...i,
                is_deleted: true,
                title: `${i.title}_deleted${new Date().getTime()}`,
              }
            : i,
        );
      } else {
        newArray = savedCustomFields.fields.filter(i => i.title !== item.title);
      }

      let layout: TcustomFieldsLayout[] = removeObjectFromLayoutUsingTitle(
        item,
      );

      saveCustomFields({
        fields: newArray,
        layout: layout,
      });
      setNewCustomFieldData(undefined);
    } catch (error) {
      console.error('DEV ERROR', error);
    }
  };

  /**
   * this function remove element and return new layout object.
   * @param {customObjInterface} item
   * @returns {TcustomFieldsLayout[]}
   */
  const removeObjectFromLayoutUsingTitle = (
    item: customObjInterface,
  ): TcustomFieldsLayout[] => {
    let layout: TcustomFieldsLayout[] = [...savedCustomFields.layout];
    rowLoop: for (let row = 0; row < layout.length; row++) {
      for (let col = 0; col < layout[row].length; col++) {
        if (layout[row][col].title === item.title) {
          // this removes match col
          layout[row].splice(col, 1);
          if (!layout[row].length) {
            // this removes blank row
            layout.splice(row, 1);
          }
          break rowLoop;
        }
      }
    }
    return layout;
  };

  /**
   * this function executes on dropped event.
   * if drop element alredy has 3 elements. then it will not execute.
   * function is update laout object.
   * @param {string} dragItemTitle
   * @param {string} _key
   * @param {{ row: number; col: 1 | 2 | 3 }} layout  - new row, col value.
   * @param {customObjInterface[]} _droppedItem - Already exist element list inside dropped element.
   */
  const updateState = (
    dragItemTitle: string,
    layout: { row: number; col: 1 | 2 | 3 },
    _droppedItem: customObjInterface[],
    _key?: string,
  ) => {
    try {
      let layoutObj: TcustomFieldsLayout[] = [...savedCustomFields.layout];
      const newObj: customObjInterface[] = savedCustomFields.fields.filter(
        (o: customObjInterface) => o.title === dragItemTitle,
      );
      if (layoutObj[layout.row] && layoutObj[layout.row].length) {
        // if (layoutObj[layout.row].length) {
        if (layoutObj[layout.row][layout.col]) {
          // This code placed dropped element in the position passed in argument.
          // If any object already exist there then code move that element at the end.
          let removedElem;
          if (_key) {
            removedElem = layoutObj[layout.row].splice(layout.col, 1, {
              title: newObj[0].title,
              id: Number(_key),
            });
          } else {
            removedElem = layoutObj[layout.row].splice(layout.col, 1, {
              title: newObj[0].title,
            });
          }
          layoutObj.push([removedElem[0]]);
        } else {
          layoutObj = removeObjectFromLayoutUsingTitle(
            savedCustomFields.fields.filter(o => o.title === dragItemTitle)[0],
          );

          let index: number = -1;
          layoutObj.forEach((o, i) => {
            o.forEach(p => {
              if (p.title === _droppedItem[0].title) {
                index = i;
                return;
              }
            });
          });

          if (_key) {
            layoutObj[index].push({
              title: newObj[0].title,
              id: Number(_key),
            });
          } else {
            layoutObj[index].push({
              title: newObj[0].title,
            });
          }
        }
        // } else {
        //   layoutObj = removeObjectFromLayoutUsingTitle(
        //     savedCustomFields.fields.filter(o => o.title === dragItemTitle)[0],
        //   );
        //   layoutObj.push([
        //     {
        //       title: newObj[0].title,
        //     },
        //   ]);
        // }
      } else {
        layoutObj = removeObjectFromLayoutUsingTitle(
          savedCustomFields.fields.filter(o => o.title === dragItemTitle)[0],
        );

        if (_key) {
          layoutObj.push([
            {
              title: newObj[0].title,
              id: Number(_key),
            },
          ]);
        } else {
          layoutObj.push([
            {
              title: newObj[0].title,
            },
          ]);
        }
      }

      saveCustomFields({
        fields: savedCustomFields.fields,
        layout: layoutObj,
      });
    } catch (e) {
      console.error(e);
    }
  };

  /**
   * this function creates custom field elements.
   * @param {customObjInterface} item
   * @returns {ReactNode}
   */
  const renderCustomField = (customObject: IcustomFields): ReactNode => {
    let dropElemArr: ReactNode[] = [];
    let rowLength: number = customObject.fields.filter(o => !o.is_deleted)
      .length;
    try {
      for (let row = 0; row < rowLength; row++) {
        let dragElemArr: ReactNode[] = [];
        let dragSiblingArray: customObjInterface[] = [];
        if (customObject.layout[row]) {
          let colLength: number = customObject.layout[row].length;
          for (let col = 0; col < colLength; col++) {
            const layoutInnerObj: IcustomFieldsLayoutCol =
              customObject.layout[row][col];
            const customFieldObj: customObjInterface[] = customObject.fields.filter(
              (o: customObjInterface) => o.title === layoutInnerObj.title,
            );
            customFieldObj.length && dragSiblingArray.push(customFieldObj[0]);
            dragElemArr.push(
              <Draggable
                key={col}
                data={customObject.fields}
                item={customFieldObj[0]}
                updateState={updateState}
                siblingLenght={colLength}
                updateDragState={updateDragState}
                dragState={dragState}
              >
                {returnCustomFieldStructure(customFieldObj[0])}
              </Draggable>,
            );
          }
        }
        dropElemArr.push(
          <Droppable
            key={row}
            dropId={row}
            data={customObject.fields}
            droppedItem={dragSiblingArray}
            updateState={updateState}
            updateDragState={updateDragState}
            dragState={dragState}
          >
            {dragElemArr}
          </Droppable>,
        );
      }
    } catch (e) {
      console.error(e);
    }

    return dropElemArr;
  };

  /**
   * return structure of drag items.
   * @param {customObjInterface} item
   */
  const returnCustomFieldStructure = (item: customObjInterface) => {
    const ItemIcon = formStructure[item.type].icon || EditOutlined;
    const hasError = errors.hasOwnProperty(item.title);
    return (
      <>
        <div
          className={`custom-field-element-container ${editTitle ===
            item.title && `active`} ${hasError && `error`} drag`}
        >
          <div className='action-btn-container'>
            <Button
              type='link'
              title={`${(<Trans>Clone</Trans>)}`}
              onClick={() => cloneCustomField(item)}
            >
              <CopyOutlined />
            </Button>

            <Button
              type='link'
              title={`${(<Trans>Delete</Trans>)}`}
              onClick={() => deleteCustomField(item)}
            >
              <DeleteOutlined />
            </Button>
          </div>
          <div
            className='custom-field-element'
            title={`${(
              <Trans>Click to edit field. Drag to adjust layout.</Trans>
            )}`}
            onClick={() => {
              if (editTitle !== item.title) {
                editCustomField(item);
              } else {
                setNewCustomFieldData(undefined);
                setEditTitle('');
                updateTabSwitchConfirmationVisibility &&
                  updateTabSwitchConfirmationVisibility(false);
              }
            }}
          >
            <ItemIcon className='field-type-icon' />
            <span className={item.is_required ? 'required-field' : ''}>
              {item.title}
            </span>
            {item.is_filled_by_admin && (
              <SafetyCertificateTwoTone
                twoToneColor='#faad14'
                className='is-admin-icon'
              />
            )}
          </div>
          <div
            className={`custom-field-element-error ${item.title} ${
              hasError ? `active` : ``
            }`}
          >
            {hasError ? errors[item.title] : ''}
          </div>
        </div>
      </>
    );
  };

  const returnMomentForTimeRange = (time: string) => {
    return moment(`${moment().format('DD/MM/YYYY')} ${time}`, [
      'DD/MM/YYYY HH:mm',
    ]);
  };

  /**
   * This function creates and return custom field options.
   * @returns {ReactNode}
   */
  const renderCustomFieldForm = (): ReactNode => {
    if (newCustomFieldData) {
      const {
        options,
        is_filled_by_admin,
        is_required,
        is_range,
        is_decimal_allowed,
        precision,
        type,
        isReferenceObjectRequired,
      } = newCustomFieldData;

      return (
        <Form
          form={form}
          colon={false}
          initialValues={{
            is_required: false,
            is_filled_by_admin: false,
            is_decimal_allowed: false,
            sub_type: options ? options[0] : undefined,
            time_range: [
              // returnMomentForTimeRange('00:00'),
              // returnMomentForTimeRange('23:59'),
            ],
          }}
          className='form form-field-option-form'
          layout='vertical'
          onValuesChange={(changedValues, _allValues) => {
            if (
              is_range &&
              type === 'NUMBER' &&
              changedValues.hasOwnProperty('range_min')
            ) {
              form.validateFields(['range_max']);
            }
          }}
        >
          <Form.Item
            label={
              <span className='form-label'>
                <Trans>Field Label</Trans>
              </span>
            }
            name='title'
            required
            rules={[
              () => ({
                validator(_, value) {
                  if (value !== undefined) {
                    value = value?.trim();
                  }

                  if (!value || value === undefined) {
                    return Promise.reject(Data.vaidationErrors.title.required);
                  } else {
                    if (!new RegExp(/^[^@!=\-+#﹘—⸺⸻].*$/).test(value)) {
                      return Promise.reject(
                        new Error('Can not start with special character'),
                      );
                    }
                    const isTitleUnique = savedCustomFields.fields
                      .filter(o => !o.is_deleted)
                      .some(o => o.title.toLowerCase() === value.toLowerCase());
                    if (isTitleUnique && !editTitle) {
                      return Promise.reject(Data.vaidationErrors.title.unique);
                    }
                    return Promise.resolve();
                  }
                },
              }),
            ]}
          >
            <Input
              autoComplete='off'
              ref={fieldLabelRef}
              disabled={!!editTitle}
            />
          </Form.Item>

          {(is_filled_by_admin || is_required || is_decimal_allowed) && (
            <div className='form-label m-l-6'>
              <Trans>Validations</Trans>
            </div>
          )}
          {is_filled_by_admin && (
            <Form.Item
              name='is_filled_by_admin'
              valuePropName='checked'
              label=''
              className='sub-option-item'
            >
              <Checkbox defaultChecked={true}>
                <Trans>Filled by Admin</Trans>
              </Checkbox>
            </Form.Item>
          )}

          {is_required && (
            <Form.Item
              name='is_required'
              valuePropName='checked'
              label=''
              className='sub-option-item'
            >
              <Checkbox defaultChecked={false}>
                <Trans>Mandatory</Trans>
              </Checkbox>
            </Form.Item>
          )}

          {is_decimal_allowed && (
            <div className='number-config-container1'>
              <Form.Item
                label=''
                name='is_decimal_allowed'
                valuePropName='checked'
              >
                <Checkbox
                  defaultChecked={false}
                  onChange={() => forceUpdate(!val)}
                >
                  <Trans>Allow Decimal</Trans>
                </Checkbox>
              </Form.Item>
              {precision && form.getFieldValue('is_decimal_allowed') && (
                <Form.Item
                  label={
                    <span className='form-label'>
                      <Trans>Precision</Trans>
                    </span>
                  }
                  name='precision'
                  labelCol={{ offset: 2 }}
                  rules={[
                    {
                      required: true,
                      message: Data.vaidationErrors.precision.required,
                    },
                  ]}
                >
                  <Select>
                    {new Array(precision).fill('None').map((_v, i) => (
                      <Select.Option key={i} value={i + 1}>
                        {i + 1}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              )}
            </div>
          )}

          {options && (
            <Form.Item
              name='sub_type'
              label={
                <span className='form-label'>
                  <Trans>Type</Trans>
                </span>
              }
            >
              <Radio.Group
                defaultValue={options[0]}
                size='middle'
                className='radio-group'
              >
                {options.map(item => (
                  <Radio.Button
                    value={item}
                    key={item}
                    disabled={editTitle !== '' && isUpdateMode}
                    style={{ width: `${100 / options.length}%` }}
                  >
                    {item}
                  </Radio.Button>
                ))}
              </Radio.Group>
            </Form.Item>
          )}

          {isReferenceObjectRequired && (
            <Form.Item
              label={
                <span className='source-label'>
                  <span className='form-label'>
                    <Trans>Source</Trans>
                  </span>
                  <Button
                    type='link'
                    style={{ float: 'right' }}
                    title='Add a new source for field'
                    onClick={addNewSourceBtn}
                  >
                    <u>
                      <Trans>Add New</Trans>
                    </u>
                  </Button>
                </span>
              }
            >
              <Form.Item
                name='source'
                rules={[
                  {
                    required: true,
                    message: Data.vaidationErrors.source.required,
                  },
                ]}
                style={{ width: '100%' }}
                noStyle
              >
                <Select
                  showSearch
                  onSearch={onReferenceSearch}
                  filterOption={false}
                >
                  {renderOptions()}
                </Select>
              </Form.Item>
            </Form.Item>
          )}

          {is_range && (
            <Row className='range-container' justify='space-between'>
              <Col span={24} className='form-label'>
                <Trans>Value must be between</Trans>
              </Col>
              {type === 'TIME' ? (
                <>
                  <Form.Item name='time_range'>
                    <RangePicker
                      mode={['time', 'time']}
                      allowClear={false}
                      format='HH:mm'
                    />
                  </Form.Item>
                </>
              ) : (
                <>
                  <Col span={10}>
                    <Form.Item
                      name='range_min'
                      rules={[
                        () => ({
                          validator(_rule, _value) {
                            // validateFields(['range_max']);
                            return Promise.resolve();
                          },
                        }),
                      ]}
                    >
                      {
                        <InputNumber
                          style={{ width: '100%' }}
                          parser={(value: any) => value.split('.')[0] as any}
                          inputMode='numeric'
                          type='number'
                        />
                      }
                    </Form.Item>
                  </Col>
                  <Col span={3}>
                    <p className='text-center'>and</p>
                  </Col>
                  <Col span={10}>
                    <Form.Item
                      name='range_max'
                      rules={[
                        ({ getFieldValue }) => ({
                          validator(_rule, value) {
                            if (
                              typeof value !== 'number' ||
                              typeof getFieldValue('range_min') !== 'number'
                            ) {
                              return Promise.resolve();
                            } else {
                              if (getFieldValue('range_min') < value) {
                                return Promise.resolve();
                              } else {
                                return Promise.reject(
                                  Data.vaidationErrors.range_max.maxGreaterMin,
                                );
                              }
                            }
                          },
                        }),
                      ]}
                    >
                      {
                        <InputNumber
                          style={{ width: '100%' }}
                          parser={(value: any) => value.split('.')[0] as any}
                          inputMode='numeric'
                          type='number'
                        />
                      }
                    </Form.Item>
                  </Col>
                </>
              )}
            </Row>
          )}

          <Row className='option-form-btn-container'>
            <Col span={24} style={{ textAlign: 'right' }}>
              <Button
                htmlType='button'
                onClick={() => {
                  setNewCustomFieldData(undefined);
                  setEditTitle('');
                  updateTabSwitchConfirmationVisibility &&
                    updateTabSwitchConfirmationVisibility(false);
                }}
              >
                <Trans>Cancel</Trans>
              </Button>
              <Button
                type='primary'
                htmlType='submit'
                onClick={() => onCreateField()}
                style={{ margin: '0 8px' }}
              >
                {editTitle === '' ? (
                  <Trans>Create</Trans>
                ) : (
                  <Trans>Update</Trans>
                )}
              </Button>
            </Col>
          </Row>
        </Form>
      );
    }
  };

  const renderOptions = () => {
    return filteredReferenceObjects.map(item => (
      <Select.Option key={item.id} value={item.id}>
        {item.title}
      </Select.Option>
    ));
  };

  const onReferenceSearch = (value: string) => {
    const filtered = referenceObjects.filter(
      item => item.title.toLowerCase().indexOf(value.toLowerCase()) > -1,
    );

    setFilteredReferenceObjects(filtered);
  };

  const addNewSourceBtn = () => {
    let values = form.getFieldsValue();

    values.fieldVal = 'DROPDOWN';

    // setNewCustomFieldData(undefined);

    setTemp(values);
  };

  const onReferenceModalCancel = () => {
    selectReferenceObject('');
  };

  const selectReferenceObject = (source: string) => {
    let values = { ...temp };

    const type = values.fieldVal;

    setNewCustomFieldData(formStructure[type]);

    delete values.source;

    values.source = source;

    form.setFieldsValue(values);

    refObjForm.resetFields();

    setTemp(undefined);
  };

  const createReferenceObj = async () => {
    try {
      const vals = await refObjForm.validateFields();

      const items = vals.items || [];

      if (items.length === 0) {
        return message.error('Add items to list');
      }

      const body = { title: vals.title, code: vals.code, items };

      createObjectReference(body, obj => {
        if (obj.hasOwnProperty('error')) {
          if (obj.error && obj.error instanceof Object) {
            const errors = Object.keys(obj.error).map(item => ({
              name: item,
              errors: obj.error[item],
            }));

            refObjForm.setFields(errors);
          } else {
            message.error(obj.error || 'Something went wrong');
          }
        } else {
          selectReferenceObject(obj.title + '');
          fetchReferenceObjectsds();
        }
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Row className='custom-field-container' justify='space-between'>
      <BorderBoxLayout
        header={<Trans>Field Types</Trans>}
        colSize={{ xxl: 5, xl: 7, span: 24 }}
        classes='custom-field-types-container'
      >
        <p className='instruction-text'>
          <Trans>Select field type and change properties accordingly.</Trans>
          {/* Drag field at center and change properties accordingly */}
        </p>
        {Object.keys(formStructure).map(item => {
          const ItemIcon = formStructure[item].icon || EditOutlined;

          return (
            <Button
              className='fields-type-btn'
              type='default'
              value={formStructure[item].title}
              onClick={() => {
                selectFieldType(item);
              }}
              key={item}
              block
            >
              <ItemIcon style={{ color: 'inherit', marginRight: '16px' }} />
              {item}
            </Button>
          );
        })}
      </BorderBoxLayout>
      <BorderBoxLayout
        header={title}
        colSize={{ xxl: 13, xl: 9, span: 24 }}
        classes='custom-field-form-container'
      >
        {savedCustomFields.fields.length === 0 ? (
          <NoData
            description={<Trans>No Custom Field</Trans>}
            imageStyle={{
              height: 260,
            }}
          />
        ) : (
          renderCustomField(savedCustomFields)
        )}
      </BorderBoxLayout>
      <BorderBoxLayout
        header={<Trans>Properties</Trans>}
        colSize={{ xxl: 5, xl: 7, span: 24 }}
        classes='custom-field-options-container'
      >
        {renderCustomFieldForm()}
      </BorderBoxLayout>
      <Modal
        visible={temp !== undefined}
        onCancel={onReferenceModalCancel}
        closable={true}
        bodyStyle={{ padding: 10 }}
        title={<Trans>Add Reference Item</Trans>}
        footer={[
          <Button onClick={onReferenceModalCancel}>
            <Trans>Cancel</Trans>
          </Button>,
          <Button
            onClick={createReferenceObj}
            style={{ marginLeft: '20px' }}
            type='primary'
          >
            <Trans>Create</Trans>
          </Button>,
        ]}
      >
        <div>
          <Form
            form={refObjForm}
            colon={false}
            autoComplete='off'
            layout='vertical'
          >
            <Form.Item
              name='title'
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
                        Data.vaidationErrors.newDD.title.required,
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
            >
              <Input />
            </Form.Item>
            <Form.Item
              name='code'
              label={<Trans>Code</Trans>}
              required
              rules={[
                () => ({
                  validator(_, value) {
                    if (value !== undefined) {
                      value = value?.trim();
                    }

                    if (!value || value === undefined) {
                      return Promise.reject(
                        Data.vaidationErrors.newDD.code.required,
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
            >
              <Input />
            </Form.Item>
            <Form.Item label=''>
              <Form.List name='items'>
                {(fields, { add, remove }) => {
                  return (
                    <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                      {fields.map((field: any, _index: number) => (
                        <Form.Item key={field.key}>
                          <Form.Item
                            {...field}
                            validateTrigger={['onChange', 'onBlur']}
                            rules={[
                              {
                                required: true,
                                whitespace: true,
                                message:
                                  Data.vaidationErrors.newDD.itemVal.required,
                              },
                            ]}
                            noStyle
                          >
                            <Input style={{ width: '90%' }} />
                          </Form.Item>
                          {fields.length > 1 ? (
                            <MinusCircleOutlined
                              className='dynamic-delete-button'
                              style={{ margin: '0 8px' }}
                              onClick={() => {
                                remove(field.name);
                              }}
                            />
                          ) : (
                            <div />
                          )}
                        </Form.Item>
                      ))}
                      <Form.Item>
                        <Button
                          type='dashed'
                          onClick={() => {
                            add();
                          }}
                          style={{ float: 'right' }}
                        >
                          <PlusOutlined /> <Trans>Add Item</Trans>
                        </Button>
                      </Form.Item>
                    </div>
                  );
                }}
              </Form.List>
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </Row>
  );
};

const BorderBoxLayout: FC<IborderBoxLayout> = props => {
  const { title, header, colSize, children, classes = '' } = props;

  return (
    <>
      <Col {...colSize} className={`${classes}`}>
        <Col className='border-box-title' span={24}>
          {title ? title : <span>&nbsp;</span>}
        </Col>
        <Col className='border-box-header' span={24}>
          {header ? header : <span>&nbsp;</span>}
        </Col>
        <Col className='border-box-children-container' span={24}>
          {children}
        </Col>
      </Col>
    </>
  );
};

const mapStateToProps = (state: any) => ({
  referenceObjects: getReferenceObjectDropdownList(state),
});

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  fetchReferenceObjectsds: () => dispatch(getObjectReferenceDropdownList()),
  createObjectReference: (body: any, callback?: (obj: any) => void) =>
    dispatch(createReferenceObject(body, callback)),
});

const connector = connect(mapStateToProps, mapDispatchToProps);

export default connector(memo(CustomFields));
