import React, { memo, useEffect, useState } from 'react';
import {
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Row,
  Select,
} from 'antd';
import {
  getEmployeeBankDetailsService,
  getPaymentModeReferenceItemsService,
} from '../../../../services/admin';
import { AxiosResponse } from 'axios';
import './cashAdvanceDisbursalModal.index.less';
import {
  IAdminDataRequestParameters,
  ICashAdvanceRequestRespondParameters,
} from '../../admin.models';
import moment from 'moment';
import {
  getQueryParametersAsObject,
  preciseDecimal,
} from '../../../../utils/global.utils';
import { Trans } from '@lingui/macro';

let localFilters: { [key: string]: any } = {};

const DisbursalModal: React.FC<{
  isVisible: boolean | undefined;
  requestId: number | undefined;
  requestNumber: string | undefined;
  amountRequested: number | undefined;
  currency: string | undefined;
  startDate: string | undefined;
  endDate: string | undefined;
  employee: number;
  page: number;
  onClose: () => void;
  respondToCashAdvanceRequest: (
    requestId: number,
    data: ICashAdvanceRequestRespondParameters,
    requestParameters: IAdminDataRequestParameters,
  ) => void;
  setDisbursalModalVisible: (visible: boolean) => void;
}> = props => {
  const {
    isVisible = false,
    requestId,
    requestNumber,
    amountRequested,
    currency,
    startDate,
    employee,
    page,
    onClose,
    respondToCashAdvanceRequest,
    setDisbursalModalVisible,
  } = props;

  const [paymentModesLoading, setPaymentModelsLoading] = useState<boolean>(
    true,
  );
  const [paymentModes, setPaymentModes] = useState<{ [key: string]: any }[]>(
    [],
  );
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);

  const [remark, setRemark] = useState<string | null>(null);
  const [amountDisbursed, setAmountDisbursed] = useState<number>();
  const [disbursedVia, setDisbursedVia] = useState<number | null>(null);
  const [disbursementDate, setDisbursementDate] = useState<string | null>(null);
  const [employeeBankDetails, setEmployeeBankDetails] = useState<{
    [key: string]: any;
  } | null>(null);

  localFilters = getQueryParametersAsObject();

  const getPaymentModes = async () => {
    let response: AxiosResponse = await getPaymentModeReferenceItemsService();
    setPaymentModes(response.data);
    setPaymentModelsLoading(false);
  };

  const getUserBankInformation = async () => {
    let response: AxiosResponse = await getEmployeeBankDetailsService(employee);
    setEmployeeBankDetails(response.data);
  };

  useEffect(() => {
    getPaymentModes();
    employee > 0 && getUserBankInformation();
    // eslint-disable-next-line
  }, [employee]);

  useEffect(() => {
    if (amountRequested !== undefined) {
      setAmountDisbursed(parseFloat(preciseDecimal(amountRequested, 2)));
    }
  }, [amountRequested]);

  const [form] = Form.useForm();
  const { Option } = Select;

  const onClickDisburse = async () => {
    await form.validateFields();

    if (disbursedVia === null || disbursedVia === undefined) {
      message.destroy();
      message.error('Please select payment mode');
      return;
    } else if (
      amountDisbursed === undefined ||
      amountDisbursed === null ||
      amountDisbursed === 0
    ) {
      message.destroy();
      message.error('Please enter a non-zero amount to disburse');
      return;
    } else if (disbursementDate === null) {
      message.destroy();
      message.error('Please enter disbursement date');
      return;
    } else {
      setConfirmLoading(true);
      let data: ICashAdvanceRequestRespondParameters = {
        action: 'disburse',
        disbursed_amount: amountDisbursed,
        disbursed_via: disbursedVia !== null ? disbursedVia : 0,
        disbursed_date: disbursementDate,
      };
      if (remark !== null && remark.trim().length > 0) {
        data.remark = remark;
      }

      let requestParameters: IAdminDataRequestParameters = {
        ...localFilters,
        function: 'data',
        item: 'cash_advance_request',
        employee: employee,
        page: page,
      };

      if (requestId !== undefined) {
        respondToCashAdvanceRequest(requestId, data, requestParameters);
        setDisbursalModalVisible(false);
      }
    }
    form.resetFields();
    setRemark(null);
    //setAmountDisbursed(0);
    setDisbursedVia(null);
    setDisbursementDate(null);
    setConfirmLoading(false);
  };

  return (
    <Modal
      width={1000}
      centered={true}
      closable={false}
      visible={isVisible}
      okText={'Disburse'}
      cancelText='Cancel'
      keyboard={false}
      confirmLoading={confirmLoading}
      className='disbursal-form-modal'
      title={`Cash Advance Disbursal For Request No. #${requestNumber}`}
      destroyOnClose={true}
      onCancel={() => {
        form.resetFields();
        onClose();
        setAmountDisbursed(0);
        setRemark(null);
        setDisbursedVia(null);
      }}
      onOk={() => {
        onClickDisburse();
      }}
    >
      <Form form={form} layout='vertical'>
        <div className='bank-detail'>
          <h3 className='header'>
            <Trans>Bank Details</Trans>
          </h3>
          <Row gutter={16}>
            <Col className='detail-field' span={6}>
              <div className='label'>
                <Trans>Account Holder Name</Trans>
              </div>
              <div className='value'>
                {employeeBankDetails !== null
                  ? employeeBankDetails.account_holder_name
                  : '--'}
              </div>
            </Col>
            <Col className='detail-field' span={6}>
              <div className='label'>
                <Trans>Bank Name</Trans>
              </div>
              <div className='value'>
                {employeeBankDetails !== null
                  ? employeeBankDetails.bank_name
                  : '--'}
              </div>
            </Col>
            <Col className='detail-field' span={6}>
              <div className='label'>
                <Trans>Branch Name</Trans>
              </div>
              <div className='value'>
                {employeeBankDetails !== null
                  ? employeeBankDetails.branch_name
                  : '--'}
              </div>
            </Col>
            <Col className='detail-field' span={6}>
              <div className='label'>
                <Trans>Bank Key</Trans>
              </div>
              <div className='value'>
                {employeeBankDetails !== null
                  ? employeeBankDetails.bank_key
                  : '--'}
              </div>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col className='detail-field' span={6}>
              <div className='label'>
                <Trans>SWIFT Code</Trans>
              </div>
              <div className='value'>
                {employeeBankDetails !== null
                  ? employeeBankDetails.swift_code
                  : '--'}
              </div>
            </Col>
            <Col className='detail-field' span={6}>
              <div className='label'>
                <Trans>Bank Account Number</Trans>
              </div>
              <div className='value'>
                {employeeBankDetails !== null
                  ? employeeBankDetails.bank_account_number
                  : '--'}
              </div>
            </Col>
            <Col className='detail-field' span={6}>
              <div className='label'>
                <Trans>Payment Detail</Trans>
              </div>
              <div className='value'>
                {employeeBankDetails !== null
                  ? employeeBankDetails.payment_detail
                  : '--'}
              </div>
            </Col>
          </Row>
        </div>
        <Row gutter={16}>
          <Col className='detail-field' span={6}>
            <Form.Item
              label={<Trans>Disbursement Date</Trans>}
              name='disbursement_date'
              required
            >
              <DatePicker
                placeholder='Disbursement Date'
                format='DD/MM/YYYY'
                disabledDate={value => {
                  return (
                    (value &&
                      value <
                        moment(startDate, 'DD/MM/YYYY').subtract(30, 'days')) ||
                    (value && value > moment().endOf('day'))
                  );
                }}
                onChange={value => {
                  if (value !== null) {
                    setDisbursementDate(value.format('DD/MM/YYYY'));
                  }
                }}
              />
            </Form.Item>
          </Col>
          <Col className='detail-field' span={6}>
            <Form.Item
              label={<Trans>Amount Requested</Trans>}
              name='amount_requested'
            >
              <div className='prefix-currency'>
                <div className='prefix-value'>{currency}</div>
                <InputNumber
                  value={amountRequested}
                  readOnly={true}
                  maxLength={15}
                />
              </div>
            </Form.Item>
          </Col>
          <Col className='detail-field' span={6}>
            <Form.Item
              label={<Trans>Disbursement Amount</Trans>}
              name='disbursed_amount'
              required={true}
            >
              <div className='prefix-currency'>
                <div className='prefix-value'>{currency}</div>
                <InputNumber
                  min={0.1}
                  maxLength={15}
                  defaultValue={amountRequested}
                  onChange={value =>
                    setAmountDisbursed(value !== undefined ? value : 0)
                  }
                />
              </div>
            </Form.Item>
          </Col>
          <Col className='detail-field' span={6}>
            <Form.Item
              label={<Trans>Disbursed Via</Trans>}
              name='disbursed_via'
              required={true}
            >
              <Select
                aria-required={true}
                loading={paymentModesLoading}
                onChange={(value, option) => {
                  setDisbursedVia(parseInt(value.toString()));
                }}
              >
                {paymentModes.map((item: any) => (
                  <Option key={item.id} value={item.id}>
                    {item.title}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Form.Item
          label={<Trans>Remark</Trans>}
          name='remark'
          rules={[
            () => ({
              validator(_, value) {
                if (value !== undefined) {
                  value = value?.trim();
                }

                if (!value || value === undefined) {
                  return Promise.resolve();
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
            placeholder='Remark (Optional)'
            onChange={event => {
              if (event.target.value !== undefined) {
                if (event.target.value.trim().length > 0) {
                  setRemark(event.target.value);
                } else {
                  setRemark(null);
                }
              }
            }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default memo(DisbursalModal);
