import React, { FC, memo, useEffect, useMemo, useState } from 'react';
import moment, { Moment } from 'moment';
import {
  Row,
  Col,
  Select,
  Form,
  Button,
  Input,
  DatePicker,
  // Dropdown,
  // Menu,
  InputNumber,
  Tag,
  Tooltip,
} from 'antd';
import {
  DeleteOutlined,
  CaretUpOutlined,
  CaretDownOutlined,
  EyeOutlined,
  // DownOutlined,
  // DollarCircleOutlined,
  // FileOutlined,
} from '@ant-design/icons';
import {
  DocumentsViewer,
  DownloadButton,
  ErrorBoundary,
  Loader,
  PDFViewer,
} from '../../../shared/components';
import { TBackendErrors } from '../../../shared/model';
import { IReceipt } from '../receipt.model';

import './singleReceipt.index.less';
// import { FormInstance } from 'antd/lib/form';
import {
  isPdfFile,
  isBackEndReceiptOrSupportingDocObject,
} from '../../../utils/global.utils';
import { ButtonProps } from 'antd/lib/button';
import { Trans } from '@lingui/macro';

interface ISingleReceiptProps {
  receiptData: IReceipt;
  receiptAccordianVisibility: boolean;
  handleAccordianHeaderClick: (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
    id: number,
  ) => void;
  handleSaveClick?: (id: number, values: any) => void;
  handleSaveClickError?: (id: number, values?: any) => void;
  handleDeleteClick?: (id: number) => void;
  backendError?: TBackendErrors;
  currencyList: any[];
  isUsingForListing?: boolean;
  isUseForGallery?: boolean;
  // form: FormInstance;
  scanLoader?: boolean;
  scannedCurrency?: any;
  scannedAmount?: any;
  scannedReceiptDate?: any;
  scannedReceiptNumber?: any;
  confidence?: any;
  warning_msg?: string;
  is_enabled_ocr?: any;
}

const SingleReceipt: FC<ISingleReceiptProps> = props => {
  const {
    receiptData,
    receiptAccordianVisibility, //get true if accourdian is expanded
    backendError,
    currencyList,
    isUsingForListing = false,
    isUseForGallery = false,
    // form,
    scanLoader,
    scannedAmount,
    scannedCurrency,
    scannedReceiptDate,
    scannedReceiptNumber,
    confidence,
    warning_msg,
    is_enabled_ocr,
    handleAccordianHeaderClick,
    handleSaveClick,
    handleSaveClickError,
    handleDeleteClick = () => {},
  } = props;
  const { Option } = Select;
  const [form] = Form.useForm();

  const _isPdfFile: boolean = useMemo(
    () => isPdfFile(receiptData?.file || ''),
    [receiptData],
  );

  const [sAmount, setSAmount] = useState<any>(0);
  const [sDate, setSDate] = useState<any>(null);
  const [sRecNumber, setSRecNumber] = useState<any>('');
  const [sCurrency, setsCurrency] = useState<any>({});

  const receiptImageURL: string =
    typeof receiptData?.file === 'string'
      ? receiptData?.file
      : window.URL.createObjectURL(receiptData?.file || '');

  // const menu = (
  //   <Menu className='receipt-menu'>
  //     <Menu.ItemGroup
  //       title={
  //         <div className='receipt-menu-title'>
  //           <DollarCircleOutlined />
  //           Expense
  //         </div>
  //       }
  //     >
  //       <Menu.Item>
  //         <Button type='link'>General</Button>
  //       </Menu.Item>
  //       <Menu.Item>
  //         <Button type='link'>Entertainment</Button>
  //       </Menu.Item>
  //       <Menu.Item>
  //         <Button type='link'>Mileage</Button>
  //       </Menu.Item>
  //     </Menu.ItemGroup>
  //     <Menu.ItemGroup
  //       title={
  //         <div className='receipt-menu-title'>
  //           <FileOutlined />
  //           Request
  //         </div>
  //       }
  //     >
  //       <Menu.Item>
  //         <Button type='link'>General</Button>
  //       </Menu.Item>
  //       <Menu.Item>
  //         <Button type='link'>Travel</Button>
  //       </Menu.Item>
  //     </Menu.ItemGroup>
  //   </Menu>
  // );

  /**
   * This is to disbale dates.
   * For future date disable
   * @param current
   */
  const disabledDate = (current: Moment): boolean => {
    try {
      if (!current) {
        return false;
      }
      return current.isSameOrAfter(moment());
    } catch (error) {
      console.error('DEV ERROR', error);
    }
    return false;
  };

  /**
   * Click event handler for save button
   */
  const handleSaveButton = (id: number) => {
    try {
      form
        .validateFields()
        .then(_values => {
          handleSaveClick && handleSaveClick(id, _values);
        })
        .catch(_err => {
          handleSaveClickError && handleSaveClickError(id);
          console.error('Receipt Form', _err);
        });
    } catch (error) {
      console.error('DEV ERROR', error);
    }
  };

  const _ReceiptList_useEffect_Fn = () => {
    try {
      form.setFieldsValue({
        amount: receiptData.amount,
        currency:
          typeof receiptData?.currency === 'number'
            ? receiptData?.currency
            : (receiptData?.currency as any)?.id,
        receipt_number: receiptData.receipt_number,
        date: moment(receiptData.date, ['DD/MM/YYYY']),
        claim_number: receiptData.claim_number,
        expense_type: receiptData.expense_type,
        benefit_type: receiptData.benefit_type,
      });

      setSAmount(receiptData.amount);
      setSDate(moment(receiptData.date, ['DD/MM/YYYY']));
      setSRecNumber(receiptData.receipt_number);
    } catch (error) {
      console.error('DEV ERROR', error);
    }
  };
  useEffect(_ReceiptList_useEffect_Fn, [receiptData]);

  const returnSubmitButton = (extraProps: ButtonProps = {}) => (
    <Button
      block
      type='primary'
      onClick={handleSaveButton.bind(null, receiptData.id)}
      disabled={
        (!receiptAccordianVisibility && !isUseForGallery) || receiptData.is_used
      }
      {...extraProps}
    >
      {isUsingForListing ? 'Update' : isUseForGallery ? 'Add' : 'Save'}
    </Button>
  );

  const colProps = isUseForGallery
    ? { span: 24, xs: 24, sm: 12, md: 8, lg: 8, xl: 6, xxl: 4 }
    : { span: 24, xs: 24, sm: 24, md: 12, lg: 12, xl: 8, xxl: 6 };

  const receiptName = isUsingForListing
    ? (receiptData as any)?.file_name || 'Receipt'
    : typeof receiptData?.file === 'string'
    ? (receiptData as any)?.file_name || 'Receipt'
    : receiptData?.file?.name;

  useEffect(() => {
    scannedReceiptDate?.length === 1 &&
      scannedDateClickedHandler(scannedReceiptDate[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scannedReceiptDate]);
  useEffect(() => {
    scannedAmount?.length === 1 &&
      scannedAmountClickedHandler(scannedAmount[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scannedAmount]);
  useEffect(() => {
    scannedReceiptNumber?.length === 1 &&
      scannedRecNumberClickedHandler(scannedReceiptNumber[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scannedReceiptNumber]);
  useEffect(() => {
    scannedCurrencyClickedHandler();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scannedCurrency]);

  const scannedAmountClickedHandler = (amount: any) => {
    form.setFieldsValue({ amount: amount });
    setSAmount(amount);
  };

  const scannedRecNumberClickedHandler = (recNumber: any) => {
    form.setFieldsValue({ receipt_number: recNumber });
    setSRecNumber(recNumber);
  };

  const scannedDateClickedHandler = (date: any) => {
    form.setFieldsValue({ date: moment(date, ['DD/MM/YYYY']) });
    setSDate(moment(date, ['DD/MM/YYYY']));
  };
  const scannedCurrencyClickedHandler = () => {
    if (scannedCurrency?.currency_code) {
      const scanCurr = currencyList.find(
        (o: any) => o.currency.code === scannedCurrency?.currency_code,
      );
      scanCurr ? setsCurrency(scanCurr) : setsCurrency({});
      scanCurr && form.setFieldsValue({ currency: scanCurr.id });
    }
  };

  return (
    <Col
      {...colProps}
      /* span={24} xs={24} sm={24} md={12} lg={12} xl={8} xxl={6} */
    >
      <ErrorBoundary>
        {/* {Boolean(confidence > 0) && (
          <div style={{ marginBottom: '8px' }}>Confidence: {confidence} %</div>
        )} */}

        {Boolean(confidence !== null) && (
          <>
            {Boolean(confidence === 0) && (
              <div
                style={{
                  marginBottom: '8px',
                  color: '#FAAD14',
                  textAlign: 'center',
                }}
              >
                {warning_msg}
              </div>
            )}

            {Boolean(confidence !== 0) && Boolean(confidence <= 50) && (
              <>
                <div
                  style={{
                    marginBottom: '8px',
                    color: '#0090FF',
                    textAlign: 'center',
                  }}
                >
                  Confidence: {confidence} %
                </div>
                <div
                  style={{
                    marginBottom: '8px',
                    color: '#FAAD14',
                    textAlign: 'center',
                  }}
                >
                  {warning_msg}
                </div>{' '}
              </>
            )}
            {Boolean(confidence > 50) && (
              <div
                style={{
                  marginBottom: '8px',
                  color: '#0090FF',
                  textAlign: 'center',
                }}
              >
                Confidence: {confidence} %
              </div>
            )}
          </>
        )}
        <div className='receipt-structure'>
          <div className='top-bar'>
            <div className='left-side' title={receiptName}>
              {receiptName}
              {/* {isUsingForListing
                ? receiptData?.receipt_number
                : typeof receiptData?.file === 'string'
                ? (receiptData as any)?.file_name || 'Receipt'
                : receiptData?.file?.name} */}
            </div>

            {isUseForGallery ? null : receiptData.is_used ? (
              <div className='right-side'>
                <Tooltip
                  title={`This claim is associated with the Claim Number ${receiptData.claim_number} and can not be deleted`}
                >
                  <Button
                    type='link'
                    onClick={() => handleDeleteClick(receiptData.id)}
                    disabled={isUseForGallery || receiptData.is_used}
                  >
                    <DeleteOutlined />
                  </Button>
                </Tooltip>
              </div>
            ) : (
              <div className='right-side'>
                <Button
                  type='link'
                  onClick={() => handleDeleteClick(receiptData.id)}
                  disabled={isUseForGallery || receiptData.is_used}
                >
                  <DeleteOutlined />
                </Button>
              </div>
            )}
          </div>
          <div className='receipt-img'>
            {_isPdfFile ? (
              <PDFViewer file={receiptData?.file} pageProps={{ height: 360 }} />
            ) : (
              <img alt='Receipt' src={receiptImageURL} />
            )}
            <div className='preview-icon-container'>
              {/* <EyeOutlined onClick={() => setDocumentsViewerVisibility(true)} /> */}
              <DocumentsViewer
                itemNumber={receiptData.receipt_number}
                itemType={'receipt' as any}
                receipt={{ ...receiptData, file: receiptImageURL }}
                documents={[]}
                icon={<EyeOutlined />}
              />
              {isBackEndReceiptOrSupportingDocObject(receiptData) ? (
                <DownloadButton file={receiptData as any} fileCat='receipt' />
              ) : null}
            </div>
          </div>
          <div
            className={`receipt-form ${
              receiptAccordianVisibility ? 'showing' : 'hidden'
            }`}
          >
            <ErrorBoundary>
              {scanLoader && is_enabled_ocr ? (
                <Loader loadingName='Scanning...' />
              ) : (
                <div className='receipt-inner-container'>
                  <div className='collabsable-header'>
                    <span className='receipt-date'>
                      {!receiptAccordianVisibility
                        ? moment(
                            receiptData?.date || form.getFieldValue('date'),
                            ['DD/MM/YYYY'],
                          ).format('DD/MM/YYYY')
                        : ''}
                    </span>

                    <div
                      // type='link'
                      // disabled={!isUsingForListing}
                      // className={`accordian-icon interactive ${
                      //   !isUsingForListing ? 'disable' : ''
                      // }`}
                      className='accordian-icon'
                      // type='link'
                      onClick={e => {
                        handleAccordianHeaderClick(e, receiptData.id);
                      }}
                    >
                      {!receiptAccordianVisibility ? (
                        <CaretUpOutlined className='collapsable-icon expand' />
                      ) : (
                        <CaretDownOutlined className='collapsable-icon collapse' />
                      )}
                    </div>

                    <div className='outer-btn'>
                      {receiptAccordianVisibility ? null : returnSubmitButton()}
                    </div>
                  </div>
                  {receiptAccordianVisibility ? (
                    <div
                      className={`receipt-form collabsable-content ${
                        !receiptAccordianVisibility ? 'hide' : ''
                      }`}
                    >
                      <Form
                        form={form}
                        layout='vertical'
                        colon={false}
                        {...{ autoComplete: 'off' }}
                        size='middle'
                        scrollToFirstError={true}
                        className='receipt-form-tag'
                      >
                        <Row>
                          <Col span={12}>
                            <Form.Item
                              label={<Trans>Receipt Date</Trans>}
                              name='date'
                              data-test='date'
                              className='date'
                              validateStatus={
                                backendError?.hasOwnProperty('date')
                                  ? 'error'
                                  : 'validating'
                              }
                              help={
                                backendError?.hasOwnProperty('date')
                                  ? backendError?.date[0]
                                  : null
                              }
                              rules={[
                                {
                                  required: true,
                                  message: 'This is required.',
                                },
                              ]}
                            >
                              <DatePicker
                                disabled={
                                  isUseForGallery || receiptData.is_used
                                }
                                disabledDate={disabledDate}
                                format='DD/MM/YYYY'
                                value={sDate}
                                onChange={(val: any) => {
                                  setSDate(val);
                                  form.setFieldsValue({ date: val });
                                }}
                              />
                              {scannedReceiptDate?.length > 0 &&
                                is_enabled_ocr &&
                                scannedReceiptDate.map((item: any) => (
                                  <Tag
                                    color='processing'
                                    className='scanned-receipt-data'
                                    onClick={(event: any) => {
                                      event.preventDefault();
                                      scannedDateClickedHandler(item);
                                    }}
                                  >
                                    {item}
                                  </Tag>
                                ))}
                            </Form.Item>
                          </Col>

                          <Col span={24}>
                            <Form.Item label={<Trans>Amount</Trans>}>
                              <Input.Group compact>
                                <Form.Item
                                  noStyle
                                  name='currency'
                                  data-test='currency'
                                  className='currency'
                                  validateStatus={
                                    backendError?.hasOwnProperty('currency')
                                      ? 'error'
                                      : 'validating'
                                  }
                                  help={
                                    backendError?.hasOwnProperty('currency')
                                      ? backendError?.currency[0]
                                      : null
                                  }
                                  rules={[
                                    {
                                      required: true,
                                      message: 'Currency is required.',
                                    },
                                  ]}
                                >
                                  <Select
                                    showSearch
                                    placeholder='INR'
                                    style={{ width: '50%' }}
                                    filterOption={(input: any, option: any) =>
                                      option.children
                                        .toLowerCase()
                                        .indexOf(input.toLowerCase()) >= 0
                                    }
                                    disabled={
                                      isUseForGallery || receiptData.is_used
                                    }
                                  >
                                    {currencyList?.map((o: any, i: number) => (
                                      <Option
                                        key={i}
                                        value={o?.id}
                                        title={`${o?.currency?.code} - ${o?.country?.title}`}
                                      >
                                        {o?.currency?.code +
                                          ' - ' +
                                          o?.country?.title}
                                      </Option>
                                    ))}
                                  </Select>
                                </Form.Item>
                                <Form.Item
                                  noStyle
                                  name='amount'
                                  data-test='amount'
                                  className='amount'
                                  validateStatus={
                                    backendError?.hasOwnProperty('amount')
                                      ? 'error'
                                      : 'validating'
                                  }
                                  help={
                                    backendError?.hasOwnProperty('amount')
                                      ? backendError?.amount[0]
                                      : null
                                  }
                                  rules={[
                                    {
                                      required: true,
                                      message: 'Amount is required',
                                    },
                                  ]}
                                >
                                  <InputNumber
                                    style={{ width: '50%' }}
                                    placeholder='100.00'
                                    precision={2}
                                    min={0}
                                    maxLength={15}
                                    disabled={
                                      isUseForGallery || receiptData.is_used
                                    }
                                    value={sAmount}
                                    onChange={(val: any) => {
                                      setSAmount(val);
                                      form.setFieldsValue({ amount: val });
                                    }}
                                  />
                                </Form.Item>
                              </Input.Group>
                              <div className='currncy-amount-ocr'>
                                <div style={{ width: '50%' }}>
                                  {scannedCurrency?.currency_code &&
                                    is_enabled_ocr &&
                                    sCurrency?.id && (
                                      <Tag
                                        color='processing'
                                        className='scanned-receipt-data'
                                        onClick={(event: any) => {
                                          event.preventDefault();
                                          scannedCurrencyClickedHandler();
                                        }}
                                      >
                                        {sCurrency?.currency?.code}
                                      </Tag>
                                    )}
                                </div>
                                <div style={{ width: '50%' }}>
                                  {scannedAmount?.length > 0 &&
                                    is_enabled_ocr &&
                                    // eslint-disable-next-line array-callback-return
                                    scannedAmount.map((item: any) => {
                                      if (item.length > 0) {
                                        return (
                                          <Tag
                                            color='processing'
                                            className='scanned-receipt-data'
                                            onClick={(event: any) => {
                                              event.preventDefault();
                                              scannedAmountClickedHandler(item);
                                            }}
                                          >
                                            {item}
                                          </Tag>
                                        );
                                      }
                                    })}
                                </div>
                              </div>
                            </Form.Item>
                          </Col>
                          <Col span={24}>
                            <Form.Item
                              label={<Trans>Receipt No.</Trans>}
                              name='receipt_number'
                              data-test='receipt_number'
                              className='receipt-number'
                              validateStatus={
                                backendError?.hasOwnProperty('receipt_number')
                                  ? 'error'
                                  : 'validating'
                              }
                              help={
                                backendError?.hasOwnProperty('receipt_number')
                                  ? backendError?.receipt_number[0]
                                  : null
                              }
                              required
                              rules={[
                                // {
                                //   required: true,
                                //   message: 'This is required.',
                                // },
                                // {
                                //   pattern: new RegExp(/^[0-9A-Za-z_-]+$/),
                                //   message: 'Special characters are not allowed.',
                                // },
                                () => ({
                                  validator(_, value) {
                                    if (value !== undefined) {
                                      value = value.trim();
                                    }

                                    if (!value || value === undefined) {
                                      return Promise.reject(
                                        'This is required.',
                                      );
                                    } else {
                                      if (
                                        new RegExp(/^[^@!=\-+#﹘—⸺⸻].*$/).test(
                                          value,
                                        )
                                      ) {
                                        return Promise.resolve();
                                      }
                                      return Promise.reject(
                                        new Error(
                                          'Special characters are not allowed.',
                                        ),
                                      );
                                    }
                                  },
                                }),
                              ]}
                            >
                              <Input
                                disabled={
                                  isUseForGallery || receiptData.is_used
                                }
                                value={sRecNumber}
                                onChange={(e: any) => {
                                  setSRecNumber(e.target.value);
                                  form.setFieldsValue({
                                    receipt_number: e.target.value,
                                  });
                                }}
                              />
                              {scannedReceiptNumber?.length > 0 &&
                                is_enabled_ocr &&
                                scannedReceiptNumber.map(
                                  (item: any) =>
                                    item && (
                                      <Tag
                                        color='processing'
                                        className='scanned-receipt-data'
                                        onClick={(event: any) => {
                                          event.preventDefault();
                                          scannedRecNumberClickedHandler(item);
                                        }}
                                      >
                                        {item}
                                      </Tag>
                                    ),
                                )}
                            </Form.Item>
                          </Col>
                          {receiptData.is_used ? (
                            <>
                              <Col span={12}>
                                <Form.Item
                                  label={<Trans>Claim No.</Trans>}
                                  name='claim_number'
                                  data-test='claim_number'
                                  className='claim-number'
                                >
                                  <Input disabled />
                                </Form.Item>
                              </Col>
                              {receiptData.expense_type && (
                                <Col span={12}>
                                  <Form.Item
                                    label={<Trans>Expense Type</Trans>}
                                    name='expense_type'
                                    data-test='expense_type'
                                    className='expense-type'
                                  >
                                    <Input disabled />
                                  </Form.Item>
                                </Col>
                              )}
                              {receiptData.benefit_type && (
                                <Col span={12}>
                                  <Form.Item
                                    label={<Trans>Benefit Type</Trans>}
                                    name='benefit_type'
                                    data-test='benefit_type'
                                    className='expense-type'
                                  >
                                    <Input disabled />
                                  </Form.Item>
                                </Col>
                              )}
                            </>
                          ) : null}

                          {/* <Col span={8}>
                        <Form.Item
                          label=' '
                          name='add_to'
                          data-test='add_to'
                          className='add-to'
                          validateStatus={
                            backendError?.hasOwnProperty('add_to')
                              ? 'error'
                              : 'validating'
                          }
                          help={
                            backendError?.hasOwnProperty('add_to')
                              ? backendError?.add_to[0]
                              : null
                          }
                          rules={[
                            {
                              required: false,
                              message: 'This is required.',
                            },
                          ]}
                        >
                          <Dropdown overlay={menu}>
                            <Button
                              type='link'
                              className='ant-dropdown-link'
                              onClick={e => e.preventDefault()}
                            >
                              Add To <DownOutlined />
                            </Button>
                          </Dropdown>
                        </Form.Item>
                      </Col> */}
                          <Col span={24}>
                            <Row justify='end'>
                              <Col span={10}>
                                <Form.Item>
                                  {returnSubmitButton({ htmlType: 'submit' })}
                                </Form.Item>
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                      </Form>
                    </div>
                  ) : (
                    <div className='dummy-for-animation'></div>
                  )}
                </div>
              )}
            </ErrorBoundary>
          </div>
        </div>
      </ErrorBoundary>
    </Col>
  );
};

export default memo(SingleReceipt);
