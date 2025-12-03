/* eslint-disable react-hooks/rules-of-hooks */
import React, { FC, memo, useState, useEffect, Dispatch } from 'react';
import moment from 'moment';
import { connect, ConnectedProps } from 'react-redux';
import {
  stateInterface,
  getCountryCurrencyList,
  getSubmittedRequestDetails,
} from '../../../../shared/redux/rootReducer';
import {
  Form,
  Input,
  Select,
  // DatePicker,
  Row,
  Col,
  InputNumber,
  Checkbox,
  Tooltip,
  Button,
  Tag,
} from 'antd';
import { ErrorBoundary } from '../../../../shared/components';
import { FormInstance } from 'antd/lib/form';
// import moment, { Moment } from 'moment';
import { IvalidationError } from '../../addNewExpense.model';
import JSONData from '../../addNewExpense.data.json';
import { CommonFormFields } from '../';
import { stringTemplating } from '../../../../utils/global.utils';
import { fetchRequestDetailsById } from '../../../submitted/submitted.thunk';

import { updateFormData } from '../../addNewExpense.actions';
import { InfoCircleOutlined } from '@ant-design/icons';

// import { fetchExpenseClaimData } from '../../addNewExpense.thunk';

const mapStateToProps = (state: stateInterface) => {
  const {
    configuration,
    isAdminEdit,
    costCenterListLoader,
    costCenterList,
    activeTabKey,
    mode,
    viewOnly,
    userJobInfo,
    chargeTo,
    formData,
    expenseTypeList,
    backendError,
    selectedExpenseType,
    expenseTypeListLoader,
    expenseClaimFetchedData,
    defaultTax,
    is_resubmission_case,
  } = state.AddNewExpenseForm;

  const {
    scannedTax,
    scannedAmount,
    scannedCurrency,
    scannedReceiptDate,
    scannedReceiptNumber,
  } = state.receipt;
  const { tenantConfig } = state.configuration;

  const requestDetails = getSubmittedRequestDetails(state);

  return {
    configuration,
    isAdminEdit,
    costCenterListLoader,
    costCenterList,
    activeTabKey,
    mode,
    requestDetails,
    viewOnly,
    chargeTo,
    formData,
    expenseTypeList,
    backendError,
    userJobInfo,
    selectedExpenseType,
    expenseTypeListLoader,
    expenseClaimFetchedData,
    defaultTax,
    is_resubmission_case,
    scannedTax,
    scannedAmount,
    scannedCurrency,
    scannedReceiptDate,
    scannedReceiptNumber,
    tenantConfig,
    currencies: getCountryCurrencyList(state), //currency list fro currency conversion reducer
  };
};

const mapDisapatchToProps = (dispatch: Dispatch<any>) => ({
  _fetchRequestDetails: (id: string) => dispatch(fetchRequestDetailsById(id)),
  _updateFormData: (
    key: string | string[],
    type:
      | 'general_form'
      | 'entertainment_form'
      | 'form_data'
      | 'petty_cash_form'
      | 'allowance_form',
    data: any,
  ) => dispatch(updateFormData(key, type, data)),
});

let is_enabled_ocr = false;

const GeneralForm: FC<ConnectedProps<typeof connector> & {
  getLabelName: Function;
  form: FormInstance;
  validationError: IvalidationError;
  calculateAmoutUsingConversionRate?: any;
  currencyFieldChangeHandler?: any;
  isForRequest: boolean;
  requestId: string | null;
  amountFieldChangeHandler?: any;
  dateFieldChangeHandler?: any;
  expenseClaimId?: any;
  setTaxAmount: any;
}> = props => {
  const {
    is_resubmission_case,
    backendError,
    configuration,
    isAdminEdit,
    // costCenterListLoader,
    costCenterList,
    activeTabKey,
    mode,
    isForRequest = false,
    requestId = null,
    requestDetails,
    form,
    viewOnly,
    userJobInfo,
    chargeTo,
    formData,
    getLabelName,
    validationError,
    expenseTypeList,
    currencies,
    selectedExpenseType,
    expenseTypeListLoader,
    expenseClaimFetchedData,
    defaultTax,
    calculateAmoutUsingConversionRate,
    currencyFieldChangeHandler,
    scannedTax,
    scannedAmount,
    scannedCurrency,
    scannedReceiptDate,
    scannedReceiptNumber,
    tenantConfig,
    amountFieldChangeHandler,
    dateFieldChangeHandler,
    _fetchRequestDetails,
    _updateFormData,
    expenseClaimId,
    setTaxAmount,
  } = props;
  const rowGutter: [number, number] = [16, 16];
  const [sAmount, setSAmount] = useState<any>(0);
  const [sCurrency, setsCurrency] = useState<any>({});
  const { Option } = Select;
  const isAmountDisable =
    !configuration?.is_allow_updating_entertainment_claims_calculated_amount &&
    activeTabKey === 'entertainment';

  const isCostCenterSelectDisable =
    (!userJobInfo?.cost_centre?.is_chargeable ||
      !userJobInfo?.cost_centre?.is_active) &&
    configuration?.is_employee_cost_centre_readonly &&
    configuration?.is_default_to_entity_cost_centre
      ? true
      : false;

  useEffect(() => {
    if (configuration && configuration?.is_allow_charging_to_cost_centres) {
      if (configuration?.is_default_to_entity_cost_centre) {
        _updateFormData(
          'cost_centre_uuid',
          'general_form',
          configuration?.le_cost_centre?.uuid,
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [configuration]);

  useEffect(() => {
    if (tenantConfig.length > 0) {
      is_enabled_ocr = tenantConfig[0]?.is_enabled_ocr;
    }
  }, [tenantConfig]);
  useEffect(() => {
    if (
      scannedReceiptDate?.length === 1 &&
      scannedReceiptDate[0] !== formData.general_form.date
    ) {
      scannedDateClickedHandler(scannedReceiptDate[0], () => {
        if (scannedAmount?.length === 1) {
          setScannedCurrncyValue(scannedAmount[0]);
          scannedAmountClickedHandler(scannedAmount[0]);
        } else {
          setScannedCurrncyValue();
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scannedReceiptDate]);

  useEffect(() => {
    if (formData.general_form.date) {
      if (scannedAmount?.length === 1) {
        setScannedCurrncyValue(scannedAmount[0]);
      } else {
        setScannedCurrncyValue();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scannedCurrency]);

  useEffect(() => {
    scannedAmount?.length === 1 &&
      scannedAmount[0] !== formData.general_form.amount &&
      scannedAmountClickedHandler(scannedAmount[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scannedAmount]);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    scannedReceiptNumber?.length === 1 &&
      scannedReceiptNumber[0] !== formData.general_form.receipt_number &&
      scannedRecNumberClickedHandler(scannedReceiptNumber[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scannedReceiptNumber]);

  const scannedDateClickedHandler = (date: any, callback: any) => {
    formData.general_form.date = moment(date, ['DD/MM/YYYY']);
    form.setFieldsValue({ date: moment(date, ['DD/MM/YYYY']) });
    calculateAmoutUsingConversionRate(
      'date',
      String(formData?.general_form.conversion_rate || 1),
    );
    dateFieldChangeHandler(
      { date: moment(date, ['DD/MM/YYYY']) },
      'date',
      callback,
    );
    return true;
  };

  const setScannedCurrncyValue = (amount?: any) => {
    if (configuration?.is_allow_forex) {
      if (scannedCurrency?.currency_code) {
        const scanCurr = currencies.find(
          (o: any) => o.currency.code === scannedCurrency?.currency_code,
        );
        scanCurr ? setsCurrency(scanCurr) : setsCurrency({});
        if (
          scanCurr &&
          formData.general_form.currency !==
            scanCurr?.is_allow_updating_entertainment_claims_calculated_amount
        ) {
          form.setFieldsValue({ currency: scanCurr?.id });
          formData.general_form.currency = scanCurr?.id;
          const fields = isAmountDisable
            ? {
                currency: scanCurr?.id,
              }
            : {
                currency: scanCurr?.id,
                amount: parseFloat(amount),
              };

          currencyFieldChangeHandler(fields);
        }
      }
      // else {
      //   if (selectedExpenseType) {
      //     const currency = selectedExpenseType?.legal_entity.currency?.id;
      //     const fields = isAmountDisable
      //       ? {
      //           currency: currency,
      //         }
      //       : {
      //           currency: currency,
      //           amount: parseFloat(amount),
      //         };

      //     currency !== formData.general_form?.currency &&
      //       currency &&
      //       currencyFieldChangeHandler(fields);
      //     // currencyFieldChangeHandler(currency, amount);
      //   }
      //   setsCurrency({});
      // }
    }
  };

  const scannedAmountClickedHandler = (amount: any) => {
    if (!isAmountDisable) {
      form.setFieldsValue({ amount: parseFloat(amount) });
      setSAmount(amount);
      amountFieldChangeHandler({ amount: parseFloat(amount) }, 'amount');
    }
  };
  const scannedTaxClickedHandler = (tax: any) => {
    if (configuration?.is_allow_updating_tax_amount) {
      setTaxAmount(true);
      form.setFieldsValue({ tax_amount: parseFloat(tax) });
      calculateAmoutUsingConversionRate(
        'tax',
        String(formData.general_form.conversion_rate || 1),
        undefined,
        undefined,
        tax,
      );
    }
  };
  const scannedRecNumberClickedHandler = (recNumber: any) => {
    formData.general_form.receipt_number = recNumber;
    form.setFieldsValue({ receipt_number: recNumber });
    _updateFormData('receipt_number', 'general_form', recNumber);
  };

  useEffect(() => {
    if (isForRequest) {
      requestId && _fetchRequestDetails(requestId);
    }
  }, [_fetchRequestDetails, isForRequest, requestId]);

  const getConversionRateInputMinValue = () => {
    const minValue = Number(
      (Number(expenseClaimFetchedData?.system_conversion_rate) || 1) -
        Number(
          ((Number(configuration?.forex_deviation_percentage) || 0) / 100) *
            (Number(expenseClaimFetchedData?.system_conversion_rate) || 1),
        ),
    );
    return minValue < 0 ? 0 : minValue;
  };

  const conversionRateInputProps = configuration?.is_forex_rate_editable_by_employee
    ? {
        min: getConversionRateInputMinValue(),
        max: Number(
          (Number(expenseClaimFetchedData?.system_conversion_rate) || 1) +
            Number(
              ((Number(configuration?.forex_deviation_percentage) || 0) / 100) *
                (Number(expenseClaimFetchedData?.system_conversion_rate) || 1),
            ),
        ),
      }
    : {};

  const noReceiptRemarkHandler = (event: any) => {
    _updateFormData('is_no_receipt', 'general_form', event.target.checked);
    if (event.target.checked) {
      _updateFormData('receipt', 'general_form', []);
      _updateFormData('receipt_number', 'general_form', '');
      _updateFormData('no_receipt_remark', 'general_form', '');
    } else {
      _updateFormData('no_receipt_remark', 'general_form', '');
    }
  };
  return (
    <ErrorBoundary>
      <Row gutter={rowGutter} className='genral-form-section'>
        <Col xxl={16} xl={16} md={12} lg={12} sm={24} xs={24}>
          <CommonFormFields.ExpenseType
            getLabelName={getLabelName}
            backendError={backendError}
            JSONData={JSONData}
            mode={mode}
            disableState={Boolean(mode === 'UPDATE' || isAdminEdit)}
            expenseClaimFetchedData={expenseClaimFetchedData}
            expenseTypeList={expenseTypeList}
            expenseTypeListLoader={expenseTypeListLoader}
          />
        </Col>
        {configuration !== null ? (
          <>
            <Col xxl={8} xl={8} md={12} lg={12} sm={24} xs={24}>
              <CommonFormFields.ExpenseDate
                viewOnly={viewOnly}
                getLabelName={getLabelName}
                backendError={backendError}
                JSONData={JSONData}
                mode={mode}
                requestDetails={requestDetails}
                formData={formData}
                isAdminEdit={isAdminEdit}
                configuration={configuration}
                is_resubmission_case={is_resubmission_case}
                calculateAmoutUsingConversionRate={
                  calculateAmoutUsingConversionRate
                }
                dateFieldChangeHandler={dateFieldChangeHandler}
                scannedReceiptDate={scannedReceiptDate}
                is_enabled_ocr={is_enabled_ocr}
                form={form}
                expenseClaimFetchedData={expenseClaimFetchedData}
              />
            </Col>

            {configuration?.is_allow_purpose ? (
              <Col span={24}>
                <Form.Item
                  label={getLabelName('Purpose', 'string')}
                  name='purpose'
                  validateTrigger='onBlur'
                  className='remark'
                  validateStatus={
                    backendError.hasOwnProperty('purpose')
                      ? 'error'
                      : 'validating'
                  }
                  help={
                    backendError.hasOwnProperty('purpose')
                      ? backendError.purpose[0]
                      : null
                  }
                  rules={[
                    {
                      whitespace: configuration?.is_purpose_mandatory,
                      required: configuration?.is_purpose_mandatory,
                      message: stringTemplating(
                        {
                          label: getLabelName('Purpose', 'string'),
                        },
                        JSONData.vaidationErrors.generalForm.purpose.mandatory,
                      ),
                    },
                    () => ({
                      validator(_, value) {
                        const val = value?.trim();
                        if (val) {
                          if (!new RegExp(/^[^@!=\-+#﹘—⸺⸻].*$/).test(val)) {
                            return Promise.reject(
                              'Can not start with the special characters.',
                            );
                          }
                        }
                        return Promise.resolve();
                      },
                    }),
                  ]}
                >
                  <Input autoComplete='new-password' disabled={viewOnly} />
                </Form.Item>
              </Col>
            ) : null}
            <Col span={24}>
              <Row gutter={rowGutter}>
                <Col
                  xl={12}
                  xxl={!configuration?.is_allow_forex ? 12 : 8}
                  span={!configuration?.is_allow_forex ? 12 : 8}
                  lg={12}
                  sm={24}
                >
                  <Form.Item
                    label={getLabelName('Expense Currency', 'string')}
                    name='currency'
                    validateTrigger='onBlur'
                    className='expense-currency'
                    validateStatus={
                      backendError.hasOwnProperty('currency')
                        ? 'error'
                        : 'validating'
                    }
                    help={
                      backendError.hasOwnProperty('currency')
                        ? backendError.currency[0]
                        : null
                    }
                    rules={[
                      {
                        required: configuration?.is_allow_forex,
                        message: stringTemplating(
                          {
                            label: getLabelName('Expense Currency', 'string'),
                          },
                          JSONData.vaidationErrors.generalForm.currency
                            .mandatory,
                        ),
                      },
                    ]}
                  >
                    {viewOnly ? (
                      <Input autoComplete='new-password' disabled={true} />
                    ) : (
                      <Select
                        disabled={viewOnly || !configuration?.is_allow_forex}
                        showSearch={true}
                        filterOption={(input: any, option: any) =>
                          option.children
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        }
                        getPopupContainer={trigger => trigger.parentNode}
                      >
                        {currencies.map((o: any) => (
                          <Select.Option key={o.id} value={o.id}>
                            {`${o?.currency?.title} (${o?.currency?.code})`}
                          </Select.Option>
                        ))}
                      </Select>
                    )}
                  </Form.Item>
                  {scannedCurrency?.currency_code &&
                    is_enabled_ocr &&
                    configuration?.is_allow_forex &&
                    sCurrency?.id && (
                      <Tag
                        color='processing'
                        className='scanned-receipt-data'
                        onClick={(event: any) => {
                          event.preventDefault();
                          setScannedCurrncyValue();
                        }}
                      >
                        {`${sCurrency?.currency?.code}`}
                      </Tag>
                    )}
                </Col>
                <Col
                  sm={24}
                  xl={12}
                  xxl={!configuration?.is_allow_forex ? 12 : 8}
                  span={!configuration?.is_allow_forex ? 12 : 8}
                  lg={12}
                >
                  <Form.Item
                    label={getLabelName('Expense Amount', 'string')}
                    name='amount'
                    validateTrigger='onChange'
                    className='expense-amount'
                    validateStatus={
                      backendError.hasOwnProperty('amount')
                        ? 'error'
                        : validationError.hasOwnProperty('amount')
                        ? 'warning'
                        : 'validating'
                    }
                    help={
                      backendError.hasOwnProperty('amount')
                        ? backendError.amount[0]
                        : validationError.hasOwnProperty('amount')
                        ? validationError.amount[0]
                        : null
                    }
                    rules={[
                      {
                        required: true,
                        message: stringTemplating(
                          {
                            label: getLabelName('Expense Amount', 'string'),
                          },
                          JSONData.vaidationErrors.generalForm.amount.mandatory,
                        ),
                      },
                      () => ({
                        validator(_rule, value) {
                          if (
                            typeof value === 'number' &&
                            // !configuration?.is_forex_rate_editable_by_employee &&
                            !configuration?.is_allow_forex
                          ) {
                            if (
                              configuration?.min_amount &&
                              value < Number(configuration?.min_amount)
                            ) {
                              return Promise.reject(
                                `Value should be greater than ${Number(
                                  configuration?.min_amount,
                                )}`,
                              );
                            }
                            if (
                              configuration?.max_amount &&
                              value > Number(configuration?.max_amount)
                            ) {
                              return Promise.reject(
                                `Value should be lesser than ${Number(
                                  configuration?.max_amount,
                                )}`,
                              );
                            }
                          }
                          return Promise.resolve();
                        },
                      }),
                    ]}
                    valuePropName='value'
                  >
                    <InputNumber
                      disabled={viewOnly || isAmountDisable}
                      precision={2}
                      min={0}
                      maxLength={15}
                      style={{ width: '100%' }}
                      value={sAmount}
                      onChange={(val: any) => {
                        setSAmount(val);
                        form.setFieldsValue({ amount: val });
                      }}
                    />
                  </Form.Item>
                  {scannedAmount?.length > 0 &&
                    is_enabled_ocr &&
                    !isAmountDisable &&
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
                </Col>
                {configuration?.is_allow_forex && (
                  <Col xl={12} xxl={8} span={8} lg={12} sm={24}>
                    <Form.Item
                      label={
                        <div className='default-value-btn-parent'>
                          <span>
                            {getLabelName('Conversion Rate', 'string')}
                          </span>
                          <Tooltip
                            title={
                              Number(
                                expenseClaimFetchedData?.system_conversion_rate ||
                                  1,
                              ).toFixed(5) || 1
                            }
                            trigger='click'
                            placement='top'
                            className='default-value-link-btn'
                            overlayClassName='default-value-tooltip'
                          >
                            <Button type='link'>Default</Button>
                          </Tooltip>
                        </div>
                      }
                      name='conversion_rate'
                      // validateTrigger='onChange'
                      className='conversion-rate'
                      validateStatus={
                        backendError.hasOwnProperty('conversion_rate')
                          ? 'error'
                          : 'validating'
                      }
                      help={
                        backendError.hasOwnProperty('conversion_rate')
                          ? backendError.conversion_rate[0]
                          : null
                      }
                      rules={[
                        {
                          required: true,
                          message: stringTemplating(
                            {
                              label: getLabelName('Conversion Rate', 'string'),
                            },
                            JSONData.vaidationErrors.generalForm.conversion_rate
                              .mandatory,
                          ),
                        },
                        () => ({
                          validator(_rule, value) {
                            if (typeof value === 'number') {
                              const rangeMsg = `Rate should be between ${Number(
                                Number(conversionRateInputProps?.min).toFixed(
                                  5,
                                ),
                              )} - ${Number(
                                Number(conversionRateInputProps?.max).toFixed(
                                  5,
                                ),
                              )}`;

                              if (
                                conversionRateInputProps?.min &&
                                value <
                                  Number(
                                    Number(
                                      conversionRateInputProps?.min,
                                    ).toFixed(5),
                                  )
                              ) {
                                return Promise.reject(rangeMsg);
                              }
                              if (
                                conversionRateInputProps?.max &&
                                value >
                                  Number(
                                    Number(
                                      conversionRateInputProps?.max,
                                    ).toFixed(5),
                                  )
                              ) {
                                return Promise.reject(rangeMsg);
                              }
                            }
                            return Promise.resolve();
                          },
                        }),
                      ]}
                      valuePropName='value'
                    >
                      <InputNumber
                        precision={5}
                        step={0.1}
                        style={{ width: '100%' }}
                        disabled={
                          !configuration?.is_forex_rate_editable_by_employee ||
                          viewOnly
                        }
                        min={0}
                        maxLength={15}
                        // {...conversionRateInputProps}
                      />
                    </Form.Item>
                  </Col>
                )}
                {/* </Row>
            </Col>
          <Col span={24}>
            <Row gutter={rowGutter}>*/}
                {configuration?.is_allow_forex && (
                  <Col xl={12} xxl={8} span={8} lg={12} sm={24}>
                    <Form.Item
                      label={
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                          }}
                        >
                          <span>
                            {getLabelName('Converted Expense Amount', 'string')}
                          </span>

                          <span>
                            <InfoCircleOutlined
                              style={{
                                fontSize: 18,
                                color: '#1890ff',
                                marginRight: '3px',
                                marginTop: '3px',
                              }}
                              title={
                                'Converted Amount is subjected to conversion rates as per the receipt date'
                              }
                            />
                          </span>
                        </div>
                      }
                    >
                      <div className='prefix-currency'>
                        {selectedExpenseType !== null && (
                          <span
                            className='prefix-value'
                            title={`${selectedExpenseType?.legal_entity
                              ?.currency?.currency?.title || ''} (${
                              selectedExpenseType?.legal_entity?.currency
                                ?.country?.title
                            })`}
                          >
                            {selectedExpenseType?.legal_entity?.currency
                              ?.currency?.code || ''}
                          </span>
                        )}
                        <span className='prefix-main-element'>
                          <Form.Item
                            name='converted_amount'
                            validateTrigger='onChange'
                            trigger='onBlur'
                            className='converted-expense-amount'
                            validateStatus={
                              backendError.hasOwnProperty('converted_amount')
                                ? 'error'
                                : validationError.hasOwnProperty(
                                    'converted_amount',
                                  )
                                ? 'warning'
                                : 'validating'
                            }
                            help={
                              backendError.hasOwnProperty('converted_amount')
                                ? backendError.converted_amount[0]
                                : validationError.hasOwnProperty(
                                    'converted_amount',
                                  )
                                ? validationError.converted_amount[0]
                                : null
                            }
                            rules={[
                              {
                                required: false,
                              },
                              () => ({
                                validator(_rule, value) {
                                  if (
                                    typeof value === 'number' &&
                                    // configuration?.is_forex_rate_editable_by_employee &&
                                    configuration?.is_allow_forex
                                  ) {
                                    if (
                                      configuration?.min_amount &&
                                      value < Number(configuration?.min_amount)
                                    ) {
                                      return Promise.reject(
                                        `Amount should be greater than ${Number(
                                          configuration?.min_amount,
                                        )}`,
                                      );
                                    }
                                    if (
                                      configuration?.max_amount &&
                                      value > Number(configuration?.max_amount)
                                    ) {
                                      return Promise.reject(
                                        `Amount should be lesser than ${Number(
                                          configuration?.max_amount,
                                        )}`,
                                      );
                                    }
                                  }
                                  return Promise.resolve();
                                },
                              }),
                            ]}
                            valuePropName='value'
                          >
                            <InputNumber
                              precision={2}
                              style={{ width: '100%' }}
                              disabled={true}
                              min={0}
                              maxLength={15}
                            />
                          </Form.Item>
                        </span>
                      </div>
                    </Form.Item>
                  </Col>
                )}
                <Col
                  xl={12}
                  xxl={!configuration?.is_allow_forex ? 12 : 8}
                  span={!configuration?.is_allow_forex ? 12 : 8}
                  lg={12}
                  sm={24}
                >
                  <Form.Item
                    label={
                      configuration?.is_allow_updating_tax_amount &&
                      defaultTax !== null ? (
                        <div className='default-value-btn-parent'>
                          <span>{getLabelName('Tax Amount', 'string')}</span>
                          <Tooltip
                            title={defaultTax}
                            trigger='click'
                            placement='top'
                            className='default-value-link-btn'
                            overlayClassName='default-value-tooltip'
                          >
                            <Button type='link'>Default</Button>
                          </Tooltip>
                        </div>
                      ) : (
                        getLabelName('Tax Amount', 'string')
                      )
                    }
                  >
                    <div className='prefix-currency'>
                      {selectedExpenseType !== null && (
                        <span
                          className='prefix-value'
                          title={`${selectedExpenseType?.legal_entity?.currency
                            ?.currency?.title || ''} (${
                            selectedExpenseType?.legal_entity?.currency?.country
                              .title
                          })`}
                        >
                          {selectedExpenseType?.legal_entity?.currency?.currency
                            ?.code || ''}
                        </span>
                      )}
                      <span className='prefix-main-element'>
                        <Form.Item
                          name='tax_amount'
                          validateTrigger='onChange'
                          className='tax-amount'
                          validateStatus={
                            backendError.hasOwnProperty('tax_amount')
                              ? 'error'
                              : 'validating'
                          }
                          help={
                            backendError.hasOwnProperty('tax_amount')
                              ? backendError.tax_amount[0]
                              : null
                          }
                          rules={[
                            {
                              required: false,
                            },
                            () => ({
                              validator(_rule, value) {
                                if (typeof value === 'number') {
                                  const conAmt = Number(
                                    formData.general_form.converted_amount ||
                                      Number.MAX_SAFE_INTEGER,
                                  );
                                  if (value > conAmt) {
                                    return Promise.reject(
                                      `Tax amount should not be greater than ${conAmt}`,
                                    );
                                  }
                                }
                                return Promise.resolve();
                              },
                            }),
                          ]}
                          valuePropName='value'
                        >
                          <InputNumber
                            precision={2}
                            maxLength={15}
                            style={{ width: '100%' }}
                            disabled={
                              !configuration?.is_allow_updating_tax_amount
                            }
                            // max={
                            //   formData.general_form.converted_amount ||
                            //   Number.MAX_SAFE_INTEGER
                            // }
                          />
                        </Form.Item>
                      </span>
                    </div>
                  </Form.Item>
                  {scannedTax?.length > 0 &&
                    is_enabled_ocr &&
                    configuration?.is_allow_updating_tax_amount &&
                    // eslint-disable-next-line array-callback-return
                    scannedTax.map((item: any) => {
                      if (item.length > 0) {
                        return (
                          <Tag
                            color='processing'
                            className='scanned-receipt-data'
                            onClick={(event: any) => {
                              event.preventDefault();
                              scannedTaxClickedHandler(item);
                            }}
                          >
                            {item}
                          </Tag>
                        );
                      }
                    })}
                </Col>
                <Col
                  xl={12}
                  xxl={!configuration?.is_allow_forex ? 12 : 8}
                  span={!configuration?.is_allow_forex ? 12 : 8}
                  lg={12}
                  sm={24}
                >
                  <Form.Item
                    label={getLabelName('Amount Before Taxes', 'string')}
                  >
                    <div className='prefix-currency'>
                      {selectedExpenseType !== null && (
                        <span
                          className='prefix-value'
                          title={`${selectedExpenseType?.legal_entity?.currency
                            ?.currency?.title || ''} (${
                            selectedExpenseType?.legal_entity?.currency?.country
                              .title
                          })`}
                        >
                          {selectedExpenseType?.legal_entity?.currency?.currency
                            ?.code || ''}
                        </span>
                      )}
                      <span className='prefix-main-element'>
                        <Form.Item
                          name='amount_before_taxes'
                          validateTrigger='onBlur'
                          className='amount-before-taxes'
                          validateStatus={
                            backendError.hasOwnProperty('amount_before_taxes')
                              ? 'error'
                              : 'validating'
                          }
                          help={
                            backendError.hasOwnProperty('amount_before_taxes')
                              ? backendError.amount_before_taxes[0]
                              : null
                          }
                          rules={[
                            {
                              required: false,
                            },
                          ]}
                          valuePropName='value'
                        >
                          <InputNumber
                            precision={2}
                            style={{ width: '100%' }}
                            disabled={true}
                            min={0}
                            maxLength={15}
                          />
                        </Form.Item>
                      </span>
                    </div>
                  </Form.Item>
                </Col>
              </Row>
            </Col>
            {configuration?.can_attach_receipts ? (
              <>
                <Col span={24}>
                  <Row gutter={rowGutter}>
                    <Col
                      span={
                        configuration?.is_display_no_receipt_attached_field
                          ? 17
                          : 24
                      }
                    >
                      <Form.Item
                        label={getLabelName('Receipt Number', 'string')}
                        name='receipt_number'
                        validateTrigger='onBlur'
                        // trigger='onBlur'
                        className='receipt-number'
                        validateStatus={
                          backendError.hasOwnProperty('receipt_number')
                            ? 'error'
                            : 'validating'
                        }
                        help={
                          backendError.hasOwnProperty('receipt_number')
                            ? backendError.receipt_number[0]
                            : null
                        }
                        rules={[
                          {
                            whitespace:
                              (!formData.general_form.is_no_receipt &&
                                configuration?.is_receipt_mandatory) ||
                              Boolean(formData.general_form?.receipt?.length),
                            required:
                              (!formData.general_form.is_no_receipt &&
                                configuration?.is_receipt_mandatory) ||
                              Boolean(formData.general_form?.receipt?.length),
                            message: stringTemplating(
                              {
                                label: getLabelName('Receipt Number', 'string'),
                              },
                              JSONData.vaidationErrors.generalForm
                                .receipt_number.mandatory,
                            ),
                          },
                          {
                            pattern: new RegExp(/^[^@!=\-+#﹘—⸺⸻].*$/),
                            message: 'Special characters are not allowed.',
                          },
                        ]}
                      >
                        <Input
                          disabled={
                            formData.general_form.is_no_receipt || isAdminEdit
                          }
                          onChange={(event: any) => {
                            _updateFormData(
                              'receipt_number',
                              'general_form',
                              event.target.value,
                            );
                          }}
                        />
                      </Form.Item>
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
                    </Col>
                    {configuration?.is_display_no_receipt_attached_field ? (
                      <Col span={6} offset={1}>
                        <Form.Item
                          label=' '
                          name='is_no_receipt'
                          validateTrigger='onBlur'
                          className='no-receipt-checkbox'
                          validateStatus={
                            backendError.hasOwnProperty('is_no_receipt')
                              ? 'error'
                              : 'validating'
                          }
                          help={
                            backendError.hasOwnProperty('is_no_receipt')
                              ? backendError.is_no_receipt[0]
                              : null
                          }
                          rules={[
                            {
                              required: false,
                            },
                          ]}
                          valuePropName='checked'
                        >
                          <Checkbox
                            onChange={noReceiptRemarkHandler}
                            disabled={
                              formData.general_form.receipt.length > 0 ||
                              viewOnly ||
                              isAdminEdit
                            }
                            defaultChecked={formData.general_form.is_no_receipt}
                          >
                            {getLabelName('No Receipt', 'string')}
                          </Checkbox>
                        </Form.Item>
                      </Col>
                    ) : null}
                  </Row>
                </Col>
                {formData.general_form.is_no_receipt && (
                  <Col span={24}>
                    <Form.Item
                      label={getLabelName('No Receipt Remark', 'string')}
                      name='no_receipt_remark'
                      validateTrigger='onBlur'
                      // trigger='onBlur'
                      className='no-receipt-remark'
                      validateStatus={
                        backendError.hasOwnProperty('no_receipt_remark')
                          ? 'error'
                          : 'validating'
                      }
                      help={
                        backendError.hasOwnProperty('no_receipt_remark')
                          ? backendError.no_receipt_remark[0]
                          : null
                      }
                      rules={[
                        {
                          whitespace:
                            configuration?.is_remark_for_no_receipt_mandatory &&
                            formData.general_form.is_no_receipt,
                          required:
                            configuration?.is_remark_for_no_receipt_mandatory &&
                            formData.general_form.is_no_receipt,
                          message: stringTemplating(
                            {
                              label: getLabelName(
                                'No Receipt Remark',
                                'string',
                              ),
                            },
                            JSONData.vaidationErrors.generalForm
                              .no_receipt_remark.mandatory,
                          ),
                        },
                        () => ({
                          validator(_, value) {
                            const val = value?.trim();
                            if (val) {
                              if (
                                !new RegExp(/^[^@!=\-+#﹘—⸺⸻].*$/).test(val)
                              ) {
                                return Promise.reject(
                                  'Can not start with the special characters.',
                                );
                              }
                            }
                            return Promise.resolve();
                          },
                        }),
                      ]}
                    >
                      <Input
                        autoComplete='new-password'
                        disabled={
                          formData.general_form.receipt.length > 0 ||
                          !!formData?.general_form?.receipt_number ||
                          !formData.general_form.is_no_receipt ||
                          viewOnly ||
                          isAdminEdit
                        }
                      />
                    </Form.Item>
                  </Col>
                )}
              </>
            ) : null}

            {configuration?.is_allow_charging_to_cost_centres ? (
              <Col span={24}>
                <Row gutter={rowGutter}>
                  {!configuration?.is_default_to_entity_cost_centre ? (
                    <Col span={12}>
                      <CommonFormFields.ChargeTo
                        // amount={
                        //   configuration?.is_forex_rate_editable_by_employee
                        //     ? formData.general_form.converted_amount
                        //     : formData.general_form.amount
                        // }
                        amount={formData.general_form.converted_amount}
                        getLabelName={getLabelName}
                        backendError={backendError}
                        JSONData={JSONData}
                        viewOnly={viewOnly}
                        configuration={configuration}
                        chargeTo={chargeTo}
                      />
                    </Col>
                  ) : null}
                  {formData.general_form.charge_to === 'THIRD' ? (
                    <Col xs={12}>
                      {viewOnly ? (
                        <>
                          <label>
                            {getLabelName('Third Party Vendor', 'string')}
                          </label>
                          <Input
                            value={expenseClaimFetchedData?.third_party_vendor}
                            disabled={true}
                          />
                        </>
                      ) : (
                        <Form.Item
                          name='third_party_vendor'
                          label={getLabelName('Third Party Vendor', 'string')}
                          required={true}
                          validateStatus={
                            backendError.hasOwnProperty('third_party_vendor')
                              ? 'error'
                              : 'validating'
                          }
                          help={
                            backendError.hasOwnProperty('third_party_vendor')
                              ? backendError.third_party_vendor[0]
                              : null
                          }
                          rules={[
                            {
                              required: true,
                              message: 'Third Party Vendor is Mandatory',
                            },
                          ]}
                        >
                          <Input
                            onChange={(event: any) => {
                              _updateFormData(
                                'third_party_vendor',
                                'general_form',
                                event.target.value,
                              );
                            }}
                          />
                        </Form.Item>
                      )}
                    </Col>
                  ) : (
                    <Col
                      xl={12}
                      xxl={
                        !configuration?.is_default_to_entity_cost_centre
                          ? 12
                          : 8
                      }
                      span={
                        !configuration?.is_default_to_entity_cost_centre
                          ? 12
                          : 8
                      }
                      lg={12}
                      sm={24}
                    >
                      <Form.Item
                        label={getLabelName('Cost Centre', 'string')}
                        name='cost_centre_uuid'
                        validateTrigger='onBlur'
                        className='expense-currency'
                        validateStatus={
                          backendError.hasOwnProperty('Cost Centre')
                            ? 'error'
                            : 'validating'
                        }
                        help={
                          backendError.hasOwnProperty('cost_centre_uuid')
                            ? backendError.currency[0]
                            : null
                        }
                        rules={[
                          {
                            required:
                              configuration?.is_default_to_entity_cost_centre,
                            message: stringTemplating(
                              {
                                label: getLabelName('Cost Centre', 'string'),
                              },
                              JSONData.vaidationErrors.generalForm
                                .cost_centre_uuid.mandatory,
                            ),
                          },
                        ]}
                      >
                        {isCostCenterSelectDisable ||
                          configuration?.is_default_to_entity_cost_centre}
                        {isCostCenterSelectDisable ||
                        configuration?.is_default_to_entity_cost_centre ? (
                          <Input
                            value={
                              expenseClaimId
                                ? expenseClaimFetchedData?.cost_centre?.title ||
                                  'Default Cost Center is Either Inactive Or Not Chargeable'
                                : configuration?.le_cost_centre?.title ||
                                  'Default Cost Center is Either Inactive Or Not Chargeable'
                            }
                            disabled={true}
                          />
                        ) : configuration?.is_default_to_entity_cost_centre ? (
                          <Input
                            value={
                              configuration?.le_cost_centre?.title ||
                              'Default Cost Center is Either Inactive Or Not Chargeable'
                            }
                            disabled={true}
                          />
                        ) : (
                          <Select
                            showSearch={true}
                            disabled={
                              configuration?.is_employee_cost_centre_readonly
                            }
                            value={formData.general_form.cost_centre_uuid}
                            filterOption={(input: any, option: any) =>
                              option.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                            }
                            onChange={(value: any) => {
                              _updateFormData(
                                'cost_centre_uuid',
                                'general_form',
                                value,
                              );
                            }}
                          >
                            {costCenterList.map((o: any) => (
                              <Option key={o.id} value={o.uuid}>
                                {`${o.title} (${o.code})`}
                              </Option>
                            ))}
                          </Select>
                        )}
                      </Form.Item>
                    </Col>
                  )}
                </Row>
              </Col>
            ) : null}
          </>
        ) : null}
      </Row>
    </ErrorBoundary>
  );
};

const connector = connect(mapStateToProps, mapDisapatchToProps);

export default connector(memo(GeneralForm));
