import React, { useState, useEffect } from 'react';
import { customObjInterface } from '../../../pages/expenseTypeConfiguration/expenseTypeConfiguration.model';
import {
  Input,
  Form,
  DatePicker,
  Select,
  InputNumber,
  TimePicker,
  Row,
  Col,
  Checkbox,
  Table,
} from 'antd';
import { ReceiptSelector } from '../';
import { ColumnsType } from 'antd/lib/table';
import { IlabelInnerObject, FormDesignProps } from './formPreview.model';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Trans } from '@lingui/macro';

const FormPreview: React.FC<FormDesignProps> = ({
  data,
  customFields,
  labelData,
  milage,
  entertaiment,
}) => {
  const [form] = Form.useForm();
  const style = { width: '80%' };
  const [update, forceUpdate] = useState(true);
  const updateState = () => {
    forceUpdate(!update);
  };
  useEffect(() => {
    form.setFieldsValue({ expenseType: data.title });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.title]);

  const renderField = (type: any, item: customObjInterface) => {
    switch (type) {
      case 'TEXT': {
        const subType =
          item.sub_type === 'LONG TEXT' ? <Input.TextArea /> : <Input />;
        return subType;
      }

      case 'DATE':
        return <DatePicker format='DD/MM/YYYY' style={{ ...style }} />;
      case 'DROPDOWN':
        return <Select style={{ ...style }} />;
      case 'NUMBER':
        return <InputNumber style={{ ...style }} type='number' />;
      case 'TIME':
        return <TimePicker style={{ ...style }} />;
      case 'DATETIME':
        return <DatePicker format='DD/MM/YYYY' showTime style={{ ...style }} />;
      default:
        return <div />;
    }
  };

  const renderCustomFields = () => {
    const obj: any = {};
    // customFields.fields.forEach(field => {
    //   const index = field.layout ? field.layout.row : 1;
    //   if (obj[index]) {
    //     obj[index].push(field);
    //   } else {
    //     obj[index] = [field];
    //   }
    // });
    customFields.layout.forEach((outerObj, i) => {
      outerObj.forEach(innerObject => {
        const field = customFields.fields.filter(
          o => o.title === innerObject.title,
        )[0];
        if (obj[i]) {
          obj[i].push(field);
        } else {
          obj[i] = [field];
        }
      });
    });
    return Object.keys(obj as object).map((itemKey: string) => {
      const itemsArray = obj[itemKey] as Array<any>;
      const span = 24 / itemsArray.length;
      if (itemsArray.length === 1) {
        const formItem = itemsArray[0];
        const comp = renderField(formItem.type, formItem);
        return (
          <Form.Item required={formItem.is_required} label={formItem.title}>
            {comp}
          </Form.Item>
        );
      }
      return (
        <Form.Item
          label={itemsArray[0].type}
          required={itemsArray[0].is_required}
        >
          <Row gutter={8} key={itemKey}>
            {itemsArray.map((item, index) => {
              const View = renderField(item.type, item);
              return (
                <Col span={span} key={item.title + index}>
                  {index === 0 ? (
                    <Form.Item>{View}</Form.Item>
                  ) : (
                    <Form.Item
                      colon={false}
                      label={item.title}
                      required={item.is_required}
                    >
                      {View}
                    </Form.Item>
                  )}
                </Col>
              );
            })}
          </Row>
        </Form.Item>
      );
    });
    // return customFields.map(item => {
    //   const View = renderField(item.type, item);
    //   return (
    //     <Form.Item label={item.title} required={item.is_required}>
    //       {View}
    //     </Form.Item>
    //   );
    // });
  };

  const getLabel = (key: any) => {
    const labelDataKeys: string[] = Object.keys(labelData);
    let titleObj: IlabelInnerObject = {
      default: '',
      mapped: '',
    };
    labelDataKeys.forEach(item => {
      if (labelData[item].default === key) titleObj = { ...labelData[item] };
    });

    const label = titleObj.mapped || titleObj.default;
    return label ? label : key;
  };

  const milageColumns: ColumnsType<any> = [
    {
      dataIndex: 'from',
      title: getLabel('From'),
      key: 'from',
      width: '30%',
      render: (val: string) => <Input value={val} />,
    },
    {
      dataIndex: 'to',
      title: getLabel('To'),
      key: 'to',
      width: '30%',
      render: (val: string) => <Input value={val} />,
    },
    { dataIndex: 'mileage', title: 'Mileage', key: 'mileage', width: '20%' },
    {
      dataIndex: 'isRoundTrip',
      title: getLabel('Is Round Trip'),
      key: 'isRoundTrip',
      render: (val: boolean) => {
        return <Checkbox value={val} />;
      },
    },
  ];

  const milageData = [
    {
      from: 'One',
      to: 'Two',
      mileage: 45656,
      isRoundTrip: true,
    },
  ];
  const guestColumns: ColumnsType<any> = [
    {
      title: <Trans>Person Name</Trans>,
      dataIndex: 'person',
      render: (val: string) => <Input value={val} />,
      key: 'person',
    },
    {
      title: <Trans>Organization</Trans>,
      dataIndex: 'organization',
      key: 'organization',
    },
    {
      title: <Trans>Designation</Trans>,
      dataIndex: 'designation',
      key: 'designation',
    },
  ];

  const dataSource = [
    {
      person: 'Person Name',
      organization: 'RA',
      designation: 'Developer',
    },
  ];
  const renderFormDetails = () => {
    return (
      <Form
        // {...formLayout}
        initialValues={{
          // expenseType: data.title,
          expenseCurrency: 'INR',
          conversionRate: 100,
          mileageRate: milage?.mileage_rate,
          country: 'Country',
        }}
        form={form}
        onFieldsChange={updateState}
        layout='vertical'
        colon={false}
      >
        <Form.Item
          name='expenseType'
          label={getLabel(<Trans>Expense Type</Trans>)}
        >
          <Select value={data.title}>
            <Select.Option value={data.title}>{data.title}</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label={getLabel('Expense Date')} name='expenseDate'>
          <DatePicker format='DD/MM/YYYY' />
        </Form.Item>
        <Form.Item label={getLabel('Expense Amount')} name='expenseNumber'>
          <InputNumber maxLength={15} />
        </Form.Item>
        <Form.Item label={getLabel('Expense Currency')} name='expenseCurrency'>
          <Select disabled={!data.is_allow_forex}>
            <Select.Option value='INR'>INR</Select.Option>
          </Select>
        </Form.Item>
        {data.is_allow_forex && (
          <Form.Item label=' ' colon={false}>
            <Input.Group compact>
              <Form.Item
                name='conversionRate'
                label={getLabel('Conversion Rate')}
                // noStyle
                // style={{
                //   display: 'inline-block',
                //   width: 'calc(50% - 8px)',
                //   margin: '0 8px',
                // }}
              >
                <InputNumber
                  type='number'
                  disabled={!data.is_forex_rate_editable_by_employee}
                  defaultValue={100}
                />
              </Form.Item>
              <Form.Item
                label={
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span>{getLabel('Converted Expense Amount')}</span>

                    <span>
                      <InfoCircleOutlined
                        style={{ color: '#1890ff', fontSize: 18 }}
                        title={
                          'Converted Amount is subjected to conversion rates as per the receipt date'
                        }
                      />
                    </span>
                  </div>
                }
                style={{ marginLeft: '15px' }}
                // noStyle
                // style={{
                //   display: 'inline-block',
                //   width: 'calc(50% - 8px)',
                //   margin: '0 8px',
                // }}
              >
                <InputNumber disabled maxLength={15} />
              </Form.Item>
            </Input.Group>
          </Form.Item>
        )}
        {data.is_allow_remark && (
          <Form.Item
            label={getLabel('Remark')}
            name='remark'
            rules={[
              {
                required: data.is_remark_mandatory,
                message: 'This field id required',
              },
            ]}
          >
            <Input.TextArea />
          </Form.Item>
        )}

        {data.can_attach_receipts && (
          <Form.Item label=''>
            <Form.Item
              label={getLabel('Receipt Number')}
              name='receiptNumber'
              style={{ display: 'inline-block', minWidth: '80%' }}
            >
              <InputNumber type='number' style={{ width: '95%' }} />
            </Form.Item>
            {data.is_display_no_receipt_attached_field ? (
              <Form.Item
                colon={false}
                name='noReceipt'
                valuePropName='checked'
                style={{ display: 'inline-block', width: '120px' }}
              >
                <Checkbox>{getLabel('No Receipt')}</Checkbox>
              </Form.Item>
            ) : (
              <div />
            )}
          </Form.Item>
        )}

        {form.getFieldValue('noReceipt') &&
          data.is_remark_for_no_receipt_mandatory && (
            <Form.Item label={getLabel('No Receipt Attached Remark')}>
              <Input />
            </Form.Item>
          )}
        {data.is_allow_claims_against_credit_card && (
          <Form.Item label=' '>
            <Checkbox>{getLabel('Paid By Credit Card')}</Checkbox>
          </Form.Item>
        )}
        {data.category === 'Mileage' && (
          <div>
            <Form.Item label={getLabel('Mileage Rate')} name='mileageRate'>
              <InputNumber type='number' />
            </Form.Item>

            <Form.Item label=' '>
              <Table
                columns={milageColumns}
                dataSource={milageData}
                pagination={false}
              ></Table>
            </Form.Item>
            <Form.Item label={getLabel('Mileage Amount')} name='totalAmount'>
              <InputNumber
                maxLength={15}
                disabled={
                  !milage?.is_allow_updating_mileage_claims_calculated_amount
                }
              />
            </Form.Item>
            <Form.Item label={getLabel('Mileage Amount')} name='totalAmount'>
              <InputNumber
                maxLength={15}
                disabled={!milage?.is_allow_updating_calculated_mileage}
              />
            </Form.Item>

            <Form.Item label={getLabel('Toll Charges')}>
              <Row>
                <Col span={4}>
                  <Form.Item>
                    <InputNumber maxLength={15} />
                  </Form.Item>
                </Col>
                <Col span={10}>
                  <Form.Item
                    label={getLabel('Parking Ces')}
                    name='parkingCharges'
                    style={{ marginLeft: '10%' }}
                  >
                    <InputNumber maxLength={15} />
                  </Form.Item>
                </Col>
                <Col span={10}>
                  <Form.Item
                    label={getLabel('Other Charges')}
                    name='otherCharges'
                    style={{ marginLeft: '10%' }}
                  >
                    <InputNumber maxLength={15} />
                  </Form.Item>
                </Col>
              </Row>
            </Form.Item>
          </div>
        )}
        {data.is_travel_type && (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Form.Item label={getLabel('From Date')}>
              <Input />
            </Form.Item>
            <Form.Item label={getLabel('To Date')}>
              <Input />
            </Form.Item>
          </div>
        )}
        {data.is_allow_adding_staff_members_to_requests && (
          <Form.Item label={getLabel('Staff Members')}>
            <Table
              dataSource={dataSource}
              columns={guestColumns}
              pagination={false}
            />
          </Form.Item>
        )}

        {data?.is_allow_adding_guest_members_to_requests && (
          <Form.Item label={getLabel('Guest Members')}>
            <Table
              dataSource={dataSource}
              columns={guestColumns}
              pagination={false}
            />
          </Form.Item>
        )}

        {data.category === 'Entertainment' && (
          <div>
            <Form.Item label={getLabel('Country')} name='country'>
              <Select
                value='Country'
                disabled={!entertaiment?.is_allow_country_selection}
              >
                <Select.Option value='Country'>Country</Select.Option>
              </Select>
            </Form.Item>
            {entertaiment?.can_have_staff_members && (
              <Form.Item label={<Trans>Staff Details</Trans>}>
                <Table
                  dataSource={dataSource}
                  columns={guestColumns}
                  pagination={false}
                />
              </Form.Item>
            )}
            {entertaiment?.can_have_guest_members && (
              <Form.Item label={<Trans>Guest Details</Trans>}>
                <Table
                  dataSource={dataSource}
                  columns={guestColumns}
                  pagination={false}
                />
              </Form.Item>
            )}
          </div>
        )}
      </Form>
    );
  };

  const renderAttachedComponent = () => {
    return (
      <Row gutter={56}>
        <Col span={16}>
          {renderFormDetails()}
          <Form layout='vertical' colon={false}>
            {renderCustomFields()}
          </Form>
        </Col>
        <Col span={8}>
          <ReceiptSelector
            isReceiptMandatory={data.is_receipt_mandatory}
            displayNoReceiptAttachedField={false}
            receiptLabel={getLabel('Receipt')}
          />
        </Col>
      </Row>
    );
  };

  return (
    <Row gutter={15}>
      <Col span={4}>
        {data.instruction_text && (
          <div>
            <p style={{ color: '#4E555C', fontSize: '20px' }}>
              <Trans>Instruction Text</Trans>
            </p>
            <div
              dangerouslySetInnerHTML={{
                __html: data.instruction_text as string,
              }}
            ></div>
          </div>
        )}
      </Col>
      <Col span={data.instruction_text ? 20 : 24} style={{ marginTop: '20px' }}>
        <div
          style={{
            padding: '15px',
            width: data.instruction_text ? '100%' : '90%',
            margin: 'auto',
          }}
        >
          {data?.can_attach_receipts || data?.is_allow_supporting_documents ? (
            renderAttachedComponent()
          ) : (
            <div style={{ width: '60%' }}>
              {renderFormDetails()}
              <Form layout='vertical' colon={false}>
                {renderCustomFields()}
              </Form>
            </div>
          )}
        </div>
      </Col>
    </Row>
  );
};

export default FormPreview;
