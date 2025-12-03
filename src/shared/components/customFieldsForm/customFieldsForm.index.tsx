import React, {
  memo,
  ReactNode,
  CSSProperties,
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from 'react';
import {
  Row,
  Col,
  Form,
  Input,
  DatePicker,
  Select,
  InputNumber,
  TimePicker,
  message,
} from 'antd';
import { SafetyCertificateTwoTone } from '@ant-design/icons';
import { FormProps } from 'antd/lib/form';
import {
  IcustomFields,
  customObjInterface,
  TcustomFieldsLayout,
  IcustomFieldsLayoutCol,
} from '../../../pages/expenseTypeConfiguration/expenseTypeConfiguration.model';
import moment from 'moment';
import { getReferenceObjectUsingId } from '../../../services/referenceObject';
import { IobjectReference } from '../../redux/referenceObject/referenceObject.model';
import { IvalidationError } from '../../../pages/addNewExpense/addNewExpense.model';
import { Trans } from '@lingui/macro';

const CustomFieldsForm = forwardRef(
  (
    props: {
      customFields: IcustomFields;
      rowGutter?: [number, number];
      formItemStyle?: CSSProperties;
      isAdmin?: boolean;
      isViewMode?: boolean;
      formProps?: FormProps;
      backendError?: IvalidationError;
      isClone?: boolean;
    },
    ref?: any,
  ) => {
    const {
      customFields,
      rowGutter = [16, 16],
      formItemStyle = { marginBottom: 0 },
      isAdmin = false,
      isViewMode = false,
      formProps = {},
      backendError = {},
      isClone,
    } = props;

    const timeFormat: {
      [x: string]: string;
    } = {
      DATETIME: 'DD/MM/YYYY HH:mm',
      DATE: 'DD/MM/YYYY',
      TIME: 'HH:mm',
    };
    const [getInitialValues, setInitialValues] = useState<any>([]);
    const [getRefObjState, setRefObjState] = useState<any>({});
    const [commonLoader, setCommonLoader] = useState<boolean>(false);
    const [form] = Form.useForm();
    const formLayout = {
      labelCol: {
        span: 24,
      },
      wrapperCol: {
        span: 24,
        offset: 0,
      },
    };

    /**
     * Parent accesible functions
     */
    useImperativeHandle(ref, () => ({
      /**
       * Returns customf fields form instance.
       */
      getCustomFieldFormInstance() {
        return form;
      },
      /**
       * Resets form fields.
       */
      clearCustomFieldForm() {
        form.resetFields();
      },

      /**
       * this function takes all form fields data and conver that data according to the post data.
       */
      getpostData(mode: string) {
        const getAllFieldsValue: any = form.getFieldsValue();
        const postData: {
          id: string;
          value: any;
        }[] = [];
        const createObjStructureAndPushInPostData = (_id: any, _val: any) => {
          postData.push({
            id: _id,
            value: _val,
          });
        };

        customFields.fields.forEach((o: customObjInterface) => {
          if (o.id && !o?.is_deleted) {
            if (getAllFieldsValue[o.id] === undefined) {
              if (
                o.is_filled_by_admin &&
                ((mode && mode !== 'CLONE') ||
                  (isClone !== undefined && !isClone))
              ) {
                // reassigning admin field values
                const filteredField = getInitialValues.filter(
                  (g: { [x: string]: any }) => g.id === o.id,
                );

                if (filteredField.length)
                  createObjStructureAndPushInPostData(
                    o.id,
                    filteredField[0].value,
                  );
                else createObjStructureAndPushInPostData(o.id, null); // not found valid value
              } else {
                // if value of form fields are `undefined` then assign null value to them.
                createObjStructureAndPushInPostData(o.id, null);
              }
            } else if (
              o.type === 'DATETIME' ||
              o.type === 'DATE' ||
              o.type === 'TIME'
            ) {
              if (moment.isMoment(getAllFieldsValue[o.id])) {
                /* if value of form fields are of type moment then assign formated value to them. */
                createObjStructureAndPushInPostData(
                  o.id,
                  getAllFieldsValue[o.id].format(timeFormat[o.type]),
                );
              } else {
                createObjStructureAndPushInPostData(o.id, null);
              }
            } else {
              let val = getAllFieldsValue[o.id];
              if (o?.sub_type === 'SINGLESELECT') {
                val = val ? [Number(val)] : null;
              }
              createObjStructureAndPushInPostData(o.id, val);
            }
          }
        });

        return postData;
      },
      setValues: (data: any[]) => {
        if (customFields.fields.length > 0) {
          const values: any = {};
          data.forEach(item => {
            const fieldType = customFields.fields.filter(
              o => o.id === item.id,
            )[0]?.type;
            if (timeFormat.hasOwnProperty(fieldType))
              values[item.id] = item.value
                ? moment(item.value, [timeFormat[fieldType]])
                : '';
            else values[item.id] = item.value ? item.value : undefined;
          });
          form.setFieldsValue(values);
          setInitialValues(data);
        }
      },
    }));

    /**
     * Function matches correctly to the type passes in props -
     * and return appropriate element.
     * @param type :type of custo fields. i.e. TEXT, NUMBER, DROPDOWN
     * @param item : Single custom field object.
     */
    const createElementUsingType = (type: string, item: customObjInterface) => {
      const commonProps = {
        style: { width: '100%' },
      };

      const disableForAdmin = false;

      const containerElement: () => HTMLElement = () =>
        (document.getElementsByClassName('page-container')[0].children[0] ||
          document.body) as HTMLElement;
      switch (type) {
        case 'TEXT': {
          const subType =
            item.sub_type === 'LONG TEXT' || item.sub_type === 'LONGTEXT' ? (
              <Input.TextArea
                maxLength={512}
                {...commonProps}
                disabled={isViewMode || disableForAdmin}
              />
            ) : (
              <Input
                maxLength={64}
                {...commonProps}
                disabled={isViewMode || disableForAdmin}
              />
            );
          return subType;
        }

        case 'DATE':
          return (
            <DatePicker
              format='DD/MM/YYYY'
              {...commonProps}
              disabled={isViewMode || disableForAdmin}
              getPopupContainer={containerElement}
            />
          );

        case 'DROPDOWN':
          // if (!isViewMode) {
          if (item?.reference_object_id) {
            return (
              <Select
                loading={
                  getRefObjState[`${item?.reference_object_id}_loader`] ||
                  commonLoader
                }
                mode={item?.sub_type === 'MULTISELECT' ? 'multiple' : undefined}
                {...commonProps}
                disabled={isViewMode || disableForAdmin}
                showSearch={true}
                filterOption={(input: any, option: any) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
                getPopupContainer={containerElement}
              >
                {getRefObjState[`${item?.reference_object_id}_refObj`] &&
                  getRefObjState[
                    `${item?.reference_object_id}_refObj`
                  ]?.items.map((o: IobjectReference) => {
                    return (
                      <Select.Option key={o.title} value={o.id}>
                        {o.title}
                      </Select.Option>
                    );
                  })}
              </Select>
            );
          } else return <></>;

        case 'NUMBER':
          const validationProps: any = {};

          if (item?.is_range) {
            if (item?.range_max !== null) {
              validationProps['max'] = item?.range_max;
            }
            if (item?.range_min !== null) {
              validationProps['min'] = item?.range_min;
            }
          }
          const isPrecisionNull = item?.precision === null;
          if (item?.sub_type === 'PERCENTAGE') {
            validationProps['formatter'] = (value: number | string): string => {
              return value !== '' ? `${value}%` : '';
            };
            validationProps['parser'] = (value: string): number =>
              (isPrecisionNull ? value.split('.')[0] : value).replace(
                '%',
                '',
              ) as any;
          } else if (isPrecisionNull) {
            validationProps['parser'] = (value: string): number =>
              value.split('.')[0] as any;
          }
          validationProps['precision'] = item?.precision ? item?.precision : 0;
          return (
            <InputNumber
              {...validationProps}
              {...commonProps}
              disabled={isViewMode || disableForAdmin}
            />
          );

        case 'TIME':
          let placeholder = 'Select time';
          if (item?.is_range) {
            const [minVal, maxVal] = valueMinMaxTimeRangeValue(item);
            placeholder = `Select time in between ${minVal} - ${maxVal}`;
          }
          return (
            <TimePicker
              format='HH:mm'
              {...commonProps}
              placeholder={placeholder}
              disabled={isViewMode || disableForAdmin}
              getPopupContainer={containerElement}
            />
          );

        case 'DATETIME':
          return (
            <DatePicker
              format='DD/MM/YYYY HH:mm'
              showTime
              {...commonProps}
              disabled={isViewMode || disableForAdmin}
              getPopupContainer={containerElement}
            />
          );

        default:
          return <div {...commonProps} />;
      }
    };

    /**
     * This function returns matched custom field to the title.
     * @param _title : Title of custom field.
     * @param customFieldobject : Array of custom fields.
     */
    const getElementUsingTitle = (
      _title: string,
      customFieldobject: customObjInterface[],
    ): customObjInterface | null => {
      const filteredObj = customFieldobject.filter(
        (o: customObjInterface) => o.title === _title,
      );
      return filteredObj[0] || null;
    };

    /**
     * This function create design(layout) as per configuration layout.
     * @param customFields
     */
    const createCustomFields = (customFields: IcustomFields): ReactNode[] => {
      const { fields, layout } = customFields;
      const returnElement: ReactNode[] = [];

      // Removing deleted and admin fields.
      const filteredFieldsArr = fields?.filter(
        o => !o.is_deleted && (o.is_filled_by_admin ? isAdmin : true),
      );

      layout &&
        layout.forEach((rowArr: TcustomFieldsLayout) => {
          const filteredFieldsArrIds = filteredFieldsArr.map(o => o.id);
          const filteredrowArr = rowArr.filter(o =>
            filteredFieldsArrIds.includes(o.id),
          );
          filteredrowArr.forEach((colElem: IcustomFieldsLayoutCol, index) => {
            const elementObject = getElementUsingTitle(colElem.title, fields);
            if (elementObject) {
              returnElement.push(
                <Col
                  span={24 / filteredrowArr.length}
                  key={colElem.title.toLowerCase().replace(/ /g, '_')}
                >
                  <Form.Item
                    label={
                      <>
                        {colElem.title}{' '}
                        {elementObject.is_filled_by_admin ? (
                          <SafetyCertificateTwoTone
                            title={`${(<Trans>Admin Field</Trans>)}`}
                            twoToneColor='#faad14'
                            className='is-admin-icon'
                            style={{
                              verticalAlign: 'middle',
                              fontSize: '1rem',
                            }}
                          />
                        ) : null}
                      </>
                    }
                    name={
                      window.location.pathname.includes('setup')
                        ? colElem.title
                        : String(colElem.id ?? index)
                    }
                    validateTrigger='onBlur'
                    className={colElem.title.toLowerCase().replace(/ /g, '-')}
                    validateStatus={
                      backendError?.custom_fields?.hasOwnProperty(
                        String(colElem.id),
                      )
                        ? 'error'
                        : 'validating'
                    }
                    help={
                      backendError?.custom_fields?.hasOwnProperty(
                        String(colElem.id),
                      )
                        ? backendError?.custom_fields[
                            String(colElem.id) as any
                          ][0]
                        : null
                    }
                    required={elementObject.is_required}
                    rules={[
                      () => ({
                        validator(_rule, value) {
                          if (
                            (!value || value === undefined) &&
                            elementObject.is_required
                          ) {
                            return Promise.reject(`This Field is required`);
                          } else if (!value) {
                            return Promise.resolve();
                          } else {
                            if (
                              elementObject?.type === 'TIME' &&
                              elementObject?.is_range
                            ) {
                              const [
                                minVal,
                                maxVal,
                              ] = valueMinMaxTimeRangeValue(elementObject);
                              if (value) {
                                const isBetween =
                                  moment(moment(value).format('HH:mm:ss'), [
                                    'HH:mm:ss',
                                  ]).isSameOrAfter(
                                    moment(minVal, ['HH:mm:ss']),
                                  ) &&
                                  moment(moment(value).format('HH:mm:ss'), [
                                    'HH:mm:ss',
                                  ]).isSameOrBefore(
                                    moment(maxVal, ['HH:mm:ss']),
                                  );
                                if (isBetween) return Promise.resolve();
                                else
                                  return Promise.reject(
                                    `Value must be in between ${minVal} - ${maxVal}`,
                                  );
                              }
                              return Promise.reject(
                                `Value must be in between ${minVal} - ${maxVal}`,
                              );
                            } else if (elementObject?.type === 'TEXT') {
                              value = value?.trim();
                              if (
                                new RegExp(/^[^@!=\-+#﹘—⸺⸻].*\n*.*$/).test(
                                  value,
                                )
                              ) {
                                return Promise.resolve();
                              } else if (!value && !elementObject.is_required) {
                                return Promise.resolve();
                              } else if (!value && elementObject.is_required) {
                                return Promise.reject(`This Field is required`);
                              }
                              return Promise.reject(
                                new Error(
                                  'Can not start with special character',
                                ),
                              );
                            } else return Promise.resolve();
                          }
                        },
                      }),
                    ]}
                    style={formItemStyle}
                  >
                    {createElementUsingType(elementObject.type, elementObject)}
                  </Form.Item>
                </Col>,
              );
            }
          });
        });
      return returnElement;
    };

    const valueMinMaxTimeRangeValue = (elementObject: any) => {
      const minVal = elementObject?.range_min
        ? elementObject?.range_min
        : '00:00';
      const maxVal = elementObject?.range_max
        ? elementObject?.range_max
        : '23:59';
      return [minVal, maxVal];
    };

    /**
     * Fetch all Dropdowns reference objects.
     * This function creates dynamic state.
     * Creates two property for each DD in `getRefObjState`. 1. dd_Num_loader, 2.dd_Num_refObj
     * 1. dd_Num_loader :- normal loader to isdicate weather the reference object is loaded or not.
     * 2. dd_Num_refObj :- Stores downloader reference object data. use to show list in dd.
     *
     */
    const preFetchAllDropDownRefObj = async () => {
      const ddObjOnly = customFields?.fields?.filter(
        (o: customObjInterface) => o.type === 'DROPDOWN',
      );
      ddObjOnly &&
        ddObjOnly.forEach(async (obj: customObjInterface) => {
          if (obj?.reference_object_id) {
            const refrenceObjectId: number = obj?.reference_object_id;
            try {
              setCommonLoader(true);
              setRefObjState((prevState: any) => {
                prevState[`${refrenceObjectId}_loader`] = true;
                return prevState;
              });
              const response = await getReferenceObjectUsingId(
                refrenceObjectId,
              ); // get call
              setRefObjState((prevState: any) => {
                prevState[`${refrenceObjectId}_loader`] = false;
                prevState[`${refrenceObjectId}_refObj`] = response.data;
                return prevState;
              });
              setCommonLoader(true); //this is for force render
              setCommonLoader(false);
            } catch (error) {
              setRefObjState((prevState: any) => {
                prevState[`${refrenceObjectId}_loader`] = false;
                return prevState;
              });
              setCommonLoader(false);
              message.error('Failed to load data', 2);
            }
          }
        });
    };

    const componentDidMount = () => {
      preFetchAllDropDownRefObj();
      return componentWillUnmount;
    };
    const componentWillUnmount = () => {
      message.destroy();
    };
    useEffect(componentDidMount, []); //This is componentDidMount & ComponentWillUnmount Effect.

    const _customFields_EffectFn = () => {
      preFetchAllDropDownRefObj();
    };
    useEffect(_customFields_EffectFn, [customFields]);

    return (
      <Form
        scrollToFirstError
        layout='horizontal'
        colon={false}
        {...formLayout}
        {...{ autoComplete: 'off' }}
        size='middle'
        {...formProps}
        form={form}
        name='customForm'
      >
        <Row gutter={rowGutter}>{createCustomFields(customFields)}</Row>
      </Form>
    );
  },
);

export default memo(CustomFieldsForm);
