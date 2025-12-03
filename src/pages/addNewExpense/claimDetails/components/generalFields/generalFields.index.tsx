import React, { FC, memo } from 'react';
import { ErrorBoundary } from '../../../../../shared/components';
import { GetFieldStructure } from '..';
import { GetLabelName, CommonFormFields } from '../../../components';
import {
  Row,
  Col,
  Checkbox,
  Select,
  Form,
  Input,
  InputNumber,
  Tooltip,
  Button,
} from 'antd';
import { getCurrencyFormatting } from '../../../../../utils/global.utils';
import JSONData from '../../../addNewExpense.data.json';
import { Trans } from '@lingui/macro';
import { InfoCircleOutlined } from '@ant-design/icons';

/**
 * GetGeneralCategoryFields
 * @param props
 */
const GeneralFields: FC<{
  configuration: any;
  expenseClaimFetchedData: any;
  isCreatedByVisible: boolean;
  activeTabKey: any;
  isUseForFormPreview?: boolean;
}> = props => {
  const {
    configuration,
    expenseClaimFetchedData,
    isCreatedByVisible,
    activeTabKey,
    isUseForFormPreview,
  } = props;
  const rowGutter: [number, number] = [24, 24];
  return (
    <ErrorBoundary>
      <Row gutter={rowGutter} className='genral-form-section'>
        {isCreatedByVisible ? (
          <Col span={24}>
            <GetFieldStructure
              lable={
                <GetLabelName
                  defaultTitle='Created By'
                  configuration={configuration}
                />
              }
            >
              {expenseClaimFetchedData?.created_by?.legal_name ||
                expenseClaimFetchedData.created_by.name}
            </GetFieldStructure>
          </Col>
        ) : null}

        <Col xxl={16} xl={16} md={12} lg={12} sm={24} xs={24}>
          {isUseForFormPreview ? (
            <Form.Item
              label={
                <GetLabelName
                  defaultTitle='Expense Type'
                  configuration={configuration}
                />
              }
              name='expense_type_legal_entity'
              validateTrigger='onBlur'
              className='expense-type'
              rules={[
                {
                  required: true,
                  message:
                    JSONData.vaidationErrors.generalForm
                      .expense_type_legal_entity.mandatory,
                },
              ]}
            >
              <Select getPopupContainer={trigger => trigger.parentNode}>
                <Select.Option
                  key={configuration.title}
                  value={configuration.title}
                >
                  {configuration.title}
                </Select.Option>
              </Select>
            </Form.Item>
          ) : (
            <GetFieldStructure
              lable={
                <GetLabelName
                  defaultTitle='Expense Type'
                  configuration={configuration}
                />
              }
            >
              {
                expenseClaimFetchedData?.expense_type_legal_entity.expense_type
                  .title
              }
            </GetFieldStructure>
          )}
        </Col>
        <Col xxl={8} xl={8} md={12} lg={12} sm={24} xs={24}>
          {isUseForFormPreview ? (
            <CommonFormFields.ExpenseDate
              viewOnly={false}
              getLabelName={(name: string) => (
                <GetLabelName
                  defaultTitle={name}
                  configuration={configuration}
                />
              )}
              backendError={{}}
              JSONData={JSONData}
              mode='ADD'
              isAdminEdit={false}
              configuration={configuration}
              expenseClaimFetchedData={expenseClaimFetchedData}
            />
          ) : (
            <GetFieldStructure
              lable={
                <GetLabelName
                  defaultTitle='Receipt Date'
                  configuration={configuration}
                />
              }
            >
              {expenseClaimFetchedData?.date}
            </GetFieldStructure>
          )}
        </Col>
        {configuration?.is_allow_purpose ? (
          <Col span={24}>
            {isUseForFormPreview ? (
              <Form.Item
                label={
                  <GetLabelName
                    defaultTitle='Purpose'
                    configuration={configuration}
                  />
                }
                name='purpose'
                validateTrigger='onBlur'
                className='remark'
                rules={[
                  {
                    required: configuration?.is_purpose_mandatory,
                    message:
                      JSONData.vaidationErrors.generalForm.purpose.mandatory,
                  },
                ]}
              >
                <Input autoComplete='new-password' />
              </Form.Item>
            ) : (
              <GetFieldStructure
                lable={
                  <GetLabelName
                    defaultTitle='Purpose'
                    configuration={configuration}
                  />
                }
              >
                {expenseClaimFetchedData?.purpose || ''}
              </GetFieldStructure>
            )}
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
              {isUseForFormPreview ? (
                <Form.Item
                  label={
                    <GetLabelName
                      defaultTitle='Expense Currency'
                      configuration={configuration}
                    />
                  }
                  name='currency'
                  validateTrigger='onBlur'
                  className='expense-currency'
                  rules={[
                    {
                      required: configuration?.is_allow_forex,
                      message:
                        JSONData.vaidationErrors.generalForm.currency.mandatory,
                    },
                  ]}
                >
                  <Select
                    disabled={!configuration?.is_allow_forex}
                    showSearch={true}
                    filterOption={(input: any, option: any) =>
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                    getPopupContainer={trigger => trigger.parentNode}
                  >
                    {[].map((o: any) => (
                      <Select.Option key={o.id} value={o.id}>
                        {`${o.currency.title} (${o.currency.code})`}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              ) : (
                <GetFieldStructure
                  lable={
                    <GetLabelName
                      defaultTitle='Expense Currency'
                      configuration={configuration}
                    />
                  }
                >
                  {expenseClaimFetchedData?.currency.currency.title}
                </GetFieldStructure>
              )}
            </Col>
            <Col
              sm={24}
              xl={12}
              xxl={!configuration?.is_allow_forex ? 12 : 8}
              span={!configuration?.is_allow_forex ? 12 : 8}
              lg={12}
            >
              {isUseForFormPreview ? (
                <Form.Item
                  label={
                    <GetLabelName
                      defaultTitle='Expense Amount'
                      configuration={configuration}
                    />
                  }
                  name='amount'
                  validateTrigger='onChange'
                  className='expense-amount'
                  rules={[
                    {
                      required: true,
                      message:
                        JSONData.vaidationErrors.generalForm.amount.mandatory,
                    },
                    () => ({
                      validator(_rule, value) {
                        if (
                          value &&
                          !configuration?.is_forex_rate_editable_by_employee
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
                    disabled={
                      !configuration?.is_allow_updating_entertainment_claims_calculated_amount &&
                      activeTabKey === 'entertainment'
                    }
                    precision={2}
                    min={0}
                    maxLength={15}
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              ) : (
                <GetFieldStructure
                  lable={
                    <GetLabelName
                      defaultTitle='Expense Amount'
                      configuration={configuration}
                    />
                  }
                >
                  {activeTabKey === 'allowance'
                    ? getCurrencyFormatting(
                        Number(
                          Number(
                            expenseClaimFetchedData?.converted_amount,
                          ).toFixed(2),
                        ),
                      )
                    : getCurrencyFormatting(
                        Number(
                          Number(expenseClaimFetchedData?.amount).toFixed(2),
                        ),
                      )}
                </GetFieldStructure>
              )}
            </Col>
            {configuration?.is_allow_forex &&
              !['mileage', 'allowance'].includes(activeTabKey) && (
                <Col xl={12} xxl={8} span={8} lg={12} sm={24}>
                  {isUseForFormPreview ? (
                    <Form.Item
                      label={
                        <div className='default-value-btn-parent'>
                          <GetLabelName
                            defaultTitle='Conversion Rate'
                            configuration={configuration}
                          />
                          <Tooltip
                            title={1}
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
                      validateTrigger='onBlur'
                      className='conversion-rate'
                      rules={[
                        {
                          required: true,
                          message:
                            JSONData.vaidationErrors.generalForm.conversion_rate
                              .mandatory,
                        },
                      ]}
                      valuePropName='value'
                    >
                      <InputNumber
                        precision={10}
                        maxLength={15}
                        style={{ width: '100%' }}
                        disabled={
                          !configuration?.is_forex_rate_editable_by_employee
                        }
                        {...(configuration?.is_forex_rate_editable_by_employee
                          ? {
                              min: Number(
                                1 -
                                  Number(
                                    ((Number(
                                      configuration?.forex_deviation_percentage,
                                    ) || 0) /
                                      100) *
                                      1,
                                  ),
                              ),
                              max: Number(
                                1 +
                                  Number(
                                    ((Number(
                                      configuration?.forex_deviation_percentage,
                                    ) || 0) /
                                      100) *
                                      1,
                                  ),
                              ),
                            }
                          : {})}
                      />
                    </Form.Item>
                  ) : (
                    <GetFieldStructure
                      lable={
                        <div className='default-value-btn-parent'>
                          <GetLabelName
                            defaultTitle='Conversion Rate'
                            configuration={configuration}
                          />
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
                    >
                      {Number(
                        expenseClaimFetchedData?.conversion_rate || 1,
                      ).toFixed(5) || 1}
                    </GetFieldStructure>
                  )}
                </Col>
              )}
            {configuration?.is_allow_forex &&
              !['mileage', 'allowance'].includes(activeTabKey) && (
                <Col xl={12} xxl={8} span={8} lg={12} sm={24}>
                  {isUseForFormPreview ? (
                    <Form.Item
                      label={
                        <GetLabelName
                          defaultTitle='Converted Expense Amount'
                          configuration={configuration}
                        />
                      }
                    >
                      <div className='prefix-currency'>
                        <span className='prefix-value' title='Currency'>
                          CUR
                        </span>
                        <span className='prefix-main-element'>
                          <Form.Item
                            name='converted_amount'
                            validateTrigger='onChange'
                            trigger='onBlur'
                            className='converted-expense-amount'
                            rules={[
                              {
                                required: false,
                              },
                              () => ({
                                validator(_rule, value) {
                                  if (
                                    value &&
                                    configuration?.is_forex_rate_editable_by_employee
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
                  ) : (
                    <GetFieldStructure
                      lable={
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            whiteSpace: 'initial',
                          }}
                        >
                          <span>
                            <GetLabelName
                              defaultTitle='Converted Expense Amount'
                              configuration={configuration}
                            />
                          </span>

                          <InfoCircleOutlined
                            style={{
                              color: '#1890ff',
                              fontSize: 17,
                              marginTop: '5px',
                            }}
                            title={
                              'Converted Amount is subjected to conversion rates as per the receipt date'
                            }
                          />
                        </div>
                      }
                    >
                      {getCurrencyFormatting(
                        Number(
                          Number(
                            expenseClaimFetchedData?.converted_amount,
                          ).toFixed(2),
                        ),
                      )}
                    </GetFieldStructure>
                  )}
                </Col>
              )}
            {!['mileage', 'allowance'].includes(activeTabKey) && (
              <Col
                xl={12}
                xxl={!configuration?.is_allow_forex ? 12 : 8}
                span={!configuration?.is_allow_forex ? 12 : 8}
                lg={12}
                sm={24}
              >
                {isUseForFormPreview ? (
                  <Form.Item
                    label={
                      <div className='default-value-btn-parent'>
                        <GetLabelName
                          defaultTitle='Tax Amount'
                          configuration={configuration}
                        />
                        <Tooltip
                          title={0}
                          trigger='click'
                          placement='top'
                          className='default-value-link-btn'
                          overlayClassName='default-value-tooltip'
                        >
                          <Button type='link'>Default</Button>
                        </Tooltip>
                      </div>
                    }
                  >
                    <div className='prefix-currency'>
                      <span className='prefix-value' title='Currency'>
                        CUR
                      </span>
                      <span className='prefix-main-element'>
                        <Form.Item
                          name='tax_amount'
                          validateTrigger='onBlur'
                          className='tax-amount'
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
                ) : (
                  <GetFieldStructure
                    lable={
                      <div className='default-value-btn-parent'>
                        <GetLabelName
                          defaultTitle='Tax Amount'
                          configuration={configuration}
                        />
                        <Tooltip
                          title={Number(
                            expenseClaimFetchedData?.system_tax_amount,
                          ).toFixed(2)}
                          trigger='click'
                          placement='top'
                          className='default-value-link-btn'
                          overlayClassName='default-value-tooltip'
                        >
                          <Button type='link'>Default</Button>
                        </Tooltip>
                      </div>
                    }
                  >
                    {getCurrencyFormatting(
                      Number(
                        Number(expenseClaimFetchedData?.tax_amount).toFixed(2),
                      ),
                    )}
                  </GetFieldStructure>
                )}
              </Col>
            )}
            {!['mileage', 'allowance'].includes(activeTabKey) && (
              <Col
                xl={12}
                xxl={!configuration?.is_allow_forex ? 12 : 8}
                span={!configuration?.is_allow_forex ? 12 : 8}
                lg={12}
                sm={24}
              >
                {isUseForFormPreview ? (
                  <Form.Item
                    label={
                      <GetLabelName
                        defaultTitle='Amount Before Taxes'
                        configuration={configuration}
                      />
                    }
                  >
                    <div className='prefix-currency'>
                      <span className='prefix-value' title='Currency'>
                        CUR
                      </span>
                      <span className='prefix-main-element'>
                        <Form.Item
                          name='amount_before_taxes'
                          validateTrigger='onBlur'
                          className='amount-before-taxes'
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
                ) : (
                  <GetFieldStructure
                    lable={
                      <GetLabelName
                        defaultTitle='Amount Before Taxes'
                        configuration={configuration}
                      />
                    }
                  >
                    {getCurrencyFormatting(
                      Number(
                        Number(
                          expenseClaimFetchedData?.amount_before_taxes,
                        ).toFixed(2),
                      ),
                    )}
                  </GetFieldStructure>
                )}
              </Col>
            )}
          </Row>
        </Col>
        {configuration?.can_attach_receipts &&
        !['mileage', 'allowance'].includes(activeTabKey) ? (
          <>
            <Col span={24}>
              <Row gutter={rowGutter}>
                <Col
                  span={
                    configuration?.is_display_no_receipt_attached_field
                      ? 16
                      : 24
                  }
                >
                  {isUseForFormPreview ? (
                    <Form.Item
                      label={
                        <GetLabelName
                          defaultTitle='Receipt Number'
                          configuration={configuration}
                        />
                      }
                      name='receipt_number'
                      validateTrigger='onBlur'
                      className='receipt-number'
                      required
                      rules={[
                        // {
                        //   required:
                        //     !formData.general_form.is_no_receipt &&
                        //     configuration?.is_receipt_mandatory,
                        //   message:
                        //     JSONData.vaidationErrors.generalForm.receipt_number
                        //       .mandatory,
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
                                `Receipt Number is required`,
                              );
                            } else {
                              if (
                                new RegExp(/^[^@!=\-+#﹘—⸺⸻].*$/).test(value)
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
                        autoComplete='new-password'
                        style={{ width: '100%' }}
                        // disabled={formData.general_form.configurationis_no_receipt}
                      />
                    </Form.Item>
                  ) : (
                    <GetFieldStructure
                      lable={
                        <GetLabelName
                          defaultTitle='Receipt Number'
                          configuration={configuration}
                        />
                      }
                    >
                      {expenseClaimFetchedData?.receipt
                        ? expenseClaimFetchedData?.receipt[0]?.receipt_number
                        : ''}
                    </GetFieldStructure>
                  )}
                </Col>
                {configuration?.is_display_no_receipt_attached_field &&
                activeTabKey !== 'allowance' ? (
                  <Col span={8} offset={0}>
                    {isUseForFormPreview ? (
                      <Form.Item
                        label=' '
                        name='is_no_receipt'
                        validateTrigger='onBlur'
                        className='no-receipt-checkbox'
                        rules={[
                          {
                            required: false,
                          },
                        ]}
                        valuePropName='checked'
                      >
                        <Checkbox
                        // disabled={formData.general_form.receipt.length > 0}
                        >
                          <GetLabelName
                            defaultTitle='No Receipt'
                            configuration={configuration}
                          />
                        </Checkbox>
                      </Form.Item>
                    ) : (
                      <GetFieldStructure lable=' ' noBg={true}>
                        <Checkbox
                          disabled={true}
                          checked={Boolean(
                            expenseClaimFetchedData?.is_no_receipt,
                          )}
                        >
                          <GetLabelName
                            defaultTitle='No Receipt'
                            configuration={configuration}
                          />
                        </Checkbox>
                      </GetFieldStructure>
                    )}
                  </Col>
                ) : null}
              </Row>
            </Col>
            {expenseClaimFetchedData?.is_no_receipt &&
              !['mileage', 'allowance'].includes(activeTabKey) && (
                <Col span={24}>
                  {isUseForFormPreview ? (
                    <Form.Item
                      label={
                        <GetLabelName
                          defaultTitle='No Receipt Remark'
                          configuration={configuration}
                        />
                      }
                      name='no_receipt_remark'
                      validateTrigger='onBlur'
                      className='no-receipt-remark'
                      // rules={[
                      //   {
                      //     required:
                      //       configuration?.is_remark_for_no_receipt_mandatory &&
                      //       formData.general_form.is_no_receipt,
                      //     message:
                      //       JSONData.vaidationErrors.generalForm
                      //         .no_receipt_remark.mandatory,
                      //   },
                      // ]}
                    >
                      <Input
                        autoComplete='new-password'
                        // disabled={
                        //   formData.general_form.receipt.length > 0 ||
                        //   !!formData?.general_form?.receipt_number ||
                        //   !formData.general_form.is_no_receipt
                        // }
                      />
                    </Form.Item>
                  ) : (
                    <GetFieldStructure
                      lable={
                        <GetLabelName
                          defaultTitle='No Receipt Remark'
                          configuration={configuration}
                        />
                      }
                    >
                      {expenseClaimFetchedData?.no_receipt_remark || ''}
                    </GetFieldStructure>
                  )}
                </Col>
              )}
          </>
        ) : null}
        {configuration?.is_allow_charging_to_cost_centres ? (
          <Col span={24}>
            <Row gutter={rowGutter}>
              {!configuration?.is_default_to_employee_cost_centre ? (
                <Col span={12}>
                  {isUseForFormPreview ? (
                    <CommonFormFields.ChargeTo
                      getLabelName={(name: string) => (
                        <GetLabelName
                          defaultTitle={name}
                          configuration={configuration}
                        />
                      )}
                      backendError={{}}
                      JSONData={JSONData}
                      viewOnly={false}
                      configuration={configuration}
                      chargeTo={[
                        {
                          code: 'LOCAL',
                          title: <Trans>Local cost centre</Trans>,
                        },
                        {
                          code: 'OVERS',
                          title: <Trans>Overseas cost centre</Trans>,
                        },
                        {
                          code: 'INTER',
                          title: <Trans>Internal order cost centre</Trans>,
                        },
                        {
                          code: 'THIRD',
                          title: <Trans>Third party vendor</Trans>,
                        },
                      ]}
                      isAdminEdit={false}
                    />
                  ) : (
                    <GetFieldStructure
                      lable={
                        <GetLabelName
                          defaultTitle='Charge-to'
                          configuration={configuration}
                        />
                      }
                    >
                      {expenseClaimFetchedData?.charge_to?.title || ''}
                    </GetFieldStructure>
                  )}
                </Col>
              ) : null}
              {!isUseForFormPreview &&
              expenseClaimFetchedData?.charge_to?.code === 'THIRD' ? (
                <Col
                  {...(!configuration?.is_default_to_employee_cost_centre
                    ? { span: 12 }
                    : { span: 24 })}
                >
                  {isUseForFormPreview ? null : (
                    <GetFieldStructure
                      lable={
                        <GetLabelName
                          defaultTitle='Third party vendor'
                          configuration={configuration}
                        />
                      }
                    >
                      {expenseClaimFetchedData?.third_party_vendor || ''}
                    </GetFieldStructure>
                  )}
                </Col>
              ) : (
                <Col
                  {...(!configuration?.is_default_to_employee_cost_centre
                    ? { span: 12 }
                    : { span: 24 })}
                >
                  {isUseForFormPreview ? (
                    <CommonFormFields.CostCentre
                      formData={{ general_form: { cost_centre_uuid: '' } }}
                      viewOnly={false}
                      getLabelName={(name: string) => (
                        <GetLabelName
                          defaultTitle={name}
                          configuration={configuration}
                        />
                      )}
                      backendError={{}}
                      JSONData={JSONData}
                      configuration={configuration}
                      costCenterListLoader={false}
                      mode='ADD'
                      userJobInfo={{}}
                      expenseClaimFetchedData={expenseClaimFetchedData}
                      costCenterList={[]}
                      isAdminEdit={false}
                    />
                  ) : (
                    <GetFieldStructure
                      lable={
                        <GetLabelName
                          defaultTitle='Cost Centre'
                          configuration={configuration}
                        />
                      }
                    >
                      {(expenseClaimFetchedData?.cost_centre?.title || '') +
                        ' ( ' +
                        (expenseClaimFetchedData?.cost_centre?.code || '') +
                        ' ) '}
                    </GetFieldStructure>
                  )}
                </Col>
              )}
            </Row>
          </Col>
        ) : null}
      </Row>
    </ErrorBoundary>
  );
};

export default memo(GeneralFields);
