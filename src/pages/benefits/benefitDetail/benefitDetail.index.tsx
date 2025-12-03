import {
  Button,
  Checkbox,
  Col,
  Form,
  Row,
  Skeleton,
  Tooltip,
  DatePicker,
  InputNumber,
  Input,
  Select,
} from 'antd';
import React, { Dispatch, FC, useEffect, useState } from 'react';
import { GetLabelName } from '../addNewBenefit.index';
import moment from 'moment';
import { connect, ConnectedProps } from 'react-redux';
import { ErrorBoundary, SkeletonItem } from '../../../shared/components';
import { stateInterface } from '../../../shared/redux/rootReducer';
import {
  fetchLoggedInUserInfo,
  fetchBenefitClaim,
  fetchUserEntitledBenefitsList,
  fetchDependentInfo,
} from '../addNewBenefit.thunk';
import './benefitDetail.index.less';
import { addUpdateBenefitFormData } from '../store/benefit.action';
import {
  CustomFields,
  ReceiptSupportingDocFields,
} from '../../addNewExpense/claimDetails/components';
import JSONData from '../addNewBenefit.data.json';
import CommonBenefitFormFieldsIndex from '../components/CommonBenefitFormFields.index';
import { InfoCircleOutlined } from '@ant-design/icons';

const mapStateToProps = (state: stateInterface) => {
  const {
    userInfo,
    formData,
    benefitDependentInfo,
    benefitEntitledConfig,
    fetchedBenefitClaimData,
    selectedBenefitTypeLoader,
    fetchedBenefitClaimDataLoader,
  } = state.BenefitReducer;

  const { expandedItem } = state.benefitConfig;
  return {
    userInfo,
    formData,
    benefitDependentInfo,
    benefitEntitledConfig,
    fetchedBenefitClaimData,
    selectedBenefitTypeLoader,
    fetchedBenefitClaimDataLoader,
    expandedItem,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  _fetchDependentInfo: (relations: any, id: any, date: any) =>
    dispatch(fetchDependentInfo(relations, id, date)),
  _fetchLoggedInUserInfo: (): any => dispatch(fetchLoggedInUserInfo()),
  _fetchUserEntitledBenefitsList: (props: any) =>
    dispatch(fetchUserEntitledBenefitsList(props)),
  _addUpdateFormData: (key: string, value: any) =>
    dispatch(addUpdateBenefitFormData(key, value)),
  _fetchBenefitClaim: (id: number) => dispatch(fetchBenefitClaim(id)),
  // _apiCallReset: () => dispatch(apiCallReset()),
});

type TProps = ConnectedProps<typeof connector> & {
  benefitClaimId?: number | null | undefined;
  isAdmin?: boolean;
  //   isApprovalPage?: any;
  //   isCreatedByVisible?: boolean;
  //   isAdmin?: boolean;
  _configuration?: any;
  custom?: any;
};
const rowGutter: [number, number] = [24, 24];
const BenefitDetail: React.FC<TProps> = props => {
  const {
    benefitClaimId,
    userInfo,
    formData,
    benefitDependentInfo,
    benefitEntitledConfig,
    fetchedBenefitClaimData,
    selectedBenefitTypeLoader,
    fetchedBenefitClaimDataLoader,
    _fetchLoggedInUserInfo,
    _fetchUserEntitledBenefitsList,
    _fetchBenefitClaim,
    _fetchDependentInfo,
    isAdmin = false,
    custom,
    expandedItem,
  } = props;
  const [claimAmount, setClaimAmount] = useState<number>();
  const [taxAmount, setTaxAmount] = useState<number>();
  const [amountBeforeTax, setAmountBeforeTax] = useState<number>();

  const [form] = Form.useForm();

  const configuration: any =
    benefitEntitledConfig?.benefit_type_configuration ?? expandedItem;
  const isUseForFormPreview = !Boolean(benefitClaimId);

  const labelMapping: any = configuration?.label_mapping;
  const benefitCategory = benefitEntitledConfig?.benefit_category;
  const initializationProcedure = async () => {
    await _fetchLoggedInUserInfo();
  };
  const formLayout = {
    labelCol: {
      span: 24,
    },
    wrapperCol: {
      span: 24,
      offset: 0,
    },
  };

  const commonFormProps: any = {
    scrollToFirstError: true,
    size: 'middle',
    layout: 'horizontal',
    colon: false,
    autoComplete: 'off',
    initialValues: {
      entertainment_staff_members: [
        {
          emp_id: 'employee 1',
          member: 'employee 1',
          designation: 'employee 1',
        },
      ],
      entertainment_guest_members: [
        {
          member: '',
          organisation: '',
          designation: '',
        },
      ],
    },
  };
  const receiptColVisibility = Boolean(
    configuration?.can_attach_receipts === true ||
      configuration?.is_allow_supporting_documents === true,
  );
  const formProps = {
    form: form,
    ...formLayout,
    ...commonFormProps,
  };
  const [
    benefitDependentRelationship,
    setBenefitDependentRelationship,
  ] = useState<any>(null);
  useEffect(() => {
    if (benefitClaimId) {
      try {
        initializationProcedure();
        _fetchBenefitClaim(Number(benefitClaimId));
      } catch (e) {}
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [benefitClaimId]);
  useEffect(() => {
    if (
      benefitEntitledConfig?.benefit_dependent_info?.length > 0 &&
      configuration.is_dependent_benefit &&
      formData?.date
    ) {
      const resultIDArrays = benefitEntitledConfig?.benefit_dependent_info.map(
        (value: any) => value.id,
      );
      _fetchDependentInfo(
        resultIDArrays,
        benefitEntitledConfig.employee,
        moment(formData.date).format('YYYY-MM-DD'),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [benefitEntitledConfig, formData.date]);
  useEffect(() => {
    if (
      benefitClaimId &&
      configuration?.is_dependent_benefit &&
      benefitDependentInfo?.length > 0
    ) {
      const selectedDependentInfo = benefitDependentInfo?.find(
        (info: any) => info.uuid === formData.dependent_uuid,
      );
      setBenefitDependentRelationship(selectedDependentInfo);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [benefitClaimId, benefitEntitledConfig, benefitDependentInfo]);

  useEffect(() => {
    userInfo?.id &&
      _fetchUserEntitledBenefitsList({
        userId: userInfo.id,
      });
  }, [userInfo, _fetchUserEntitledBenefitsList]);

  return (
    <ErrorBoundary>
      {fetchedBenefitClaimDataLoader || selectedBenefitTypeLoader ? (
        <GetSkeleton />
      ) : (
        <ErrorBoundary>
          <Row gutter={rowGutter} className={`detail-View-componet `}>
            <Col xl={configuration?.can_attach_receipts ? 14 : 24}>
              <Form name='addNewBenefitForm' {...formProps}>
                <Row gutter={rowGutter}>
                  <Col xxl={16} xl={16} md={12} lg={12} sm={24} xs={24}>
                    {isUseForFormPreview ? (
                      <Form.Item
                        label={
                          <GetLabelName
                            defaultTitle='Benefit Type'
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
                        <Select
                          getPopupContainer={trigger => trigger.parentNode}
                        >
                          <Select.Option
                            key={configuration?.title}
                            value={configuration?.title}
                          >
                            {configuration?.title}
                          </Select.Option>
                        </Select>
                      </Form.Item>
                    ) : (
                      <GetFieldStructure
                        label={
                          <GetLabelName
                            defaultTitle='Benefit Type'
                            configuration={configuration}
                          />
                        }
                      >
                        {
                          fetchedBenefitClaimData?.benefit_type_legal_entity
                            ?.benefit_type?.title
                        }
                      </GetFieldStructure>
                    )}
                  </Col>
                  <Col xxl={8} xl={8} md={12} lg={12} sm={24} xs={24}>
                    {isUseForFormPreview ? (
                      <Form.Item
                        validateTrigger='onBlur'
                        label={
                          <GetLabelName
                            defaultTitle='Benefit Date'
                            configuration={configuration}
                          />
                        }
                        rules={[]}
                      >
                        <DatePicker
                          disabledDate={current => {
                            return (
                              moment().add(-1, 'months') >= current ||
                              moment().add(1, 'months') <= current
                            );
                          }}
                          allowClear
                          style={{ width: '100%' }}
                          format='DD/MM/YYYY'
                        />
                      </Form.Item>
                    ) : (
                      <GetFieldStructure
                        label={
                          <GetLabelName
                            defaultTitle='Receipt Date'
                            configuration={configuration}
                          />
                        }
                      >
                        {}
                        {fetchedBenefitClaimData.date}
                      </GetFieldStructure>
                    )}
                  </Col>
                  {configuration?.is_allow_flexible_benefit && (
                    <Col xs={24}>
                      <GetFieldStructure
                        label={
                          labelMapping?.benefit_category ? (
                            labelMapping?.benefit_category
                          ) : (
                            <GetLabelName
                              defaultTitle='Benefit Category'
                              configuration={configuration}
                            />
                          )
                        }
                      >
                        {
                          benefitCategory?.find(
                            (category: any) =>
                              category.id ===
                              fetchedBenefitClaimData.benefit_category.id,
                          )?.title
                        }
                      </GetFieldStructure>
                    </Col>
                  )}
                  {configuration?.is_dependent_benefit && (
                    <>
                      <Col xs={12}>
                        <GetFieldStructure
                          label={
                            labelMapping?.dependent_relationships ? (
                              labelMapping?.dependent_relationships
                            ) : (
                              <GetLabelName
                                defaultTitle='Dependent Name'
                                configuration={configuration}
                              />
                            )
                          }
                        >
                          {benefitDependentRelationship?.first_name}{' '}
                          {benefitDependentRelationship?.last_name} (
                          {moment(
                            benefitDependentRelationship?.date_of_birth,
                            'DD/MM/YYYY',
                          ).fromNow(true)}
                          )
                        </GetFieldStructure>
                      </Col>
                      <Col xs={12}>
                        <GetFieldStructure
                          label={
                            labelMapping?.dependent_relationships ? (
                              labelMapping?.dependent_relationships
                            ) : (
                              <GetLabelName
                                defaultTitle='Relationship'
                                configuration={configuration}
                              />
                            )
                          }
                        >
                          {benefitDependentRelationship?.relationship?.title ||
                            ''}
                        </GetFieldStructure>
                      </Col>
                    </>
                  )}
                  {configuration?.is_dependent_benefit && <Col xs={24}></Col>}

                  {configuration?.allow_remark && (
                    <Col xs={24}>
                      {isUseForFormPreview ? (
                        <CommonBenefitFormFieldsIndex.Purpose
                          viewOnly={false}
                          JSONData={JSONData}
                          configuration={configuration}
                        />
                      ) : (
                        <GetFieldStructure
                          label={
                            <GetLabelName
                              defaultTitle='Purpose'
                              configuration={configuration}
                            />
                          }
                        >
                          {fetchedBenefitClaimData?.purpose}
                        </GetFieldStructure>
                      )}
                    </Col>
                  )}

                  <Col
                    xs={
                      configuration?.is_allow_forex &&
                      benefitEntitledConfig?.payable_percent
                        ? 8
                        : !configuration?.is_allow_forex &&
                          benefitEntitledConfig?.payable_percent
                        ? 8
                        : configuration?.is_allow_forex &&
                          !benefitEntitledConfig?.payable_percent
                        ? 8
                        : !configuration?.is_allow_forex &&
                          !benefitEntitledConfig?.payable_percent
                        ? 12
                        : 12
                    }
                  >
                    {isUseForFormPreview ? (
                      <Form.Item
                        validateTrigger='onBlur'
                        label={
                          <GetLabelName
                            defaultTitle='Currency'
                            configuration={configuration}
                          />
                        }
                        rules={[
                          {
                            required: true,
                            message:
                              JSONData.vaidationErrors.generalForm.currency
                                .mandatory,
                          },
                        ]}
                      >
                        <Input autoComplete='new-password' disabled={true} />
                      </Form.Item>
                    ) : (
                      <GetFieldStructure
                        label={
                          <GetLabelName
                            defaultTitle='Currency'
                            configuration={configuration}
                          />
                        }
                      >
                        {`${fetchedBenefitClaimData?.currency?.currency.title}(${fetchedBenefitClaimData?.currency?.currency.code})`}
                      </GetFieldStructure>
                    )}
                  </Col>
                  <Col
                    xs={
                      configuration?.is_allow_forex &&
                      benefitEntitledConfig?.payable_percent
                        ? 8
                        : !configuration?.is_allow_forex &&
                          benefitEntitledConfig?.payable_percent
                        ? 8
                        : configuration?.is_allow_forex &&
                          !benefitEntitledConfig?.payable_percent
                        ? 8
                        : !configuration?.is_allow_forex &&
                          !benefitEntitledConfig?.payable_percent
                        ? 12
                        : 12
                    }
                  >
                    {isUseForFormPreview ? (
                      <Form.Item
                        validateTrigger='onBlur'
                        label={
                          <GetLabelName
                            defaultTitle='Claim Amount'
                            configuration={configuration}
                          />
                        }
                        rules={[
                          {
                            required: true,
                            message:
                              JSONData.vaidationErrors.generalForm.amount
                                .mandatory,
                          },
                        ]}
                      >
                        <InputNumber
                          style={{ width: '100%' }}
                          precision={2}
                          min={0}
                          maxLength={15}
                          value={claimAmount}
                          onChange={value => {
                            setClaimAmount(value);
                          }}
                        />
                      </Form.Item>
                    ) : (
                      <GetFieldStructure
                        label={
                          <GetLabelName
                            defaultTitle='Claim Amount'
                            configuration={configuration}
                          />
                        }
                      >
                        {Number(fetchedBenefitClaimData.amount).toFixed(2)}
                      </GetFieldStructure>
                    )}
                  </Col>

                  {benefitEntitledConfig?.payable_percent && (
                    <Col
                      xs={
                        configuration?.is_allow_forex &&
                        benefitEntitledConfig?.payable_percent
                          ? 8
                          : !configuration?.is_allow_forex &&
                            benefitEntitledConfig?.payable_percent
                          ? 8
                          : configuration?.is_allow_forex &&
                            !benefitEntitledConfig?.payable_percent
                          ? 8
                          : !configuration?.is_allow_forex &&
                            !benefitEntitledConfig?.payable_percent
                          ? 8
                          : 12
                      }
                    >
                      {isUseForFormPreview ? (
                        <Form.Item
                          validateTrigger='onBlur'
                          label={
                            <GetLabelName
                              defaultTitle='Payable Amount'
                              configuration={configuration}
                            />
                          }
                        >
                          <InputNumber
                            style={{ width: '100%' }}
                            min={0}
                            maxLength={15}
                          />
                        </Form.Item>
                      ) : (
                        <GetFieldStructure
                          label={
                            <GetLabelName
                              defaultTitle='Payable Amount'
                              configuration={configuration}
                            />
                          }
                        >
                          {Number(
                            fetchedBenefitClaimData.amount_before_conversion,
                          ).toFixed(2)}
                        </GetFieldStructure>
                      )}
                    </Col>
                  )}

                  {configuration?.is_allow_forex && (
                    <Col
                      xs={
                        configuration?.is_allow_forex &&
                        benefitEntitledConfig?.payable_percent
                          ? 12
                          : !configuration?.is_allow_forex &&
                            benefitEntitledConfig?.payable_percent
                          ? 8
                          : configuration?.is_allow_forex &&
                            !benefitEntitledConfig?.payable_percent
                          ? 8
                          : !configuration?.is_allow_forex &&
                            !benefitEntitledConfig?.payable_percent
                          ? 8
                          : 12
                      }
                    >
                      {isUseForFormPreview ? (
                        <Form.Item
                          validateTrigger='onBlur'
                          label={
                            <GetLabelName
                              defaultTitle='Conversion Rate'
                              configuration={configuration}
                            />
                          }
                          rules={[
                            {
                              required: true,
                              message:
                                JSONData.vaidationErrors.generalForm
                                  .conversion_rate.mandatory,
                            },
                          ]}
                        >
                          <InputNumber
                            style={{ width: '100%' }}
                            min={0}
                            maxLength={15}
                          />
                        </Form.Item>
                      ) : (
                        <GetFieldStructure
                          label={
                            <div className='default-value-benefit-btn-parent'>
                              <label>
                                {
                                  <GetLabelName
                                    defaultTitle='Conversion Rate'
                                    configuration={configuration}
                                  />
                                }
                              </label>
                              <Tooltip
                                title={Number(
                                  fetchedBenefitClaimData.system_conversion_rate,
                                ).toFixed(5)}
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
                            fetchedBenefitClaimData.conversion_rate,
                          ).toFixed(5)}
                        </GetFieldStructure>
                      )}
                    </Col>
                  )}

                  {configuration?.is_allow_forex && (
                    <Col
                      xs={
                        configuration?.is_allow_forex &&
                        benefitEntitledConfig?.payable_percent
                          ? 12
                          : !configuration?.is_allow_forex &&
                            benefitEntitledConfig?.payable_percent
                          ? 8
                          : configuration?.is_allow_forex &&
                            !benefitEntitledConfig?.payable_percent
                          ? 8
                          : !configuration?.is_allow_forex &&
                            !benefitEntitledConfig?.payable_percent
                          ? 8
                          : 12
                      }
                      style={{ paddingLeft: '8px', paddingRight: '8px' }}
                    >
                      {isUseForFormPreview ? (
                        <Form.Item
                          validateTrigger='onBlur'
                          label='Converted Amount'
                          rules={[
                            {
                              required: true,
                              message:
                                JSONData.vaidationErrors.generalForm.amount
                                  .mandatory,
                            },
                          ]}
                        >
                          <InputNumber
                            style={{ width: '100%' }}
                            min={0}
                            maxLength={15}
                          />
                        </Form.Item>
                      ) : (
                        <GetFieldStructure
                          label={
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                              }}
                            >
                              <span>
                                <GetLabelName
                                  defaultTitle='Converted Amount'
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
                          {Number(
                            fetchedBenefitClaimData.converted_amount,
                          ).toFixed(2)}
                        </GetFieldStructure>
                      )}
                    </Col>
                  )}
                  <Col
                    xs={
                      configuration?.is_allow_forex &&
                      benefitEntitledConfig?.payable_percent
                        ? 12
                        : !configuration?.is_allow_forex &&
                          benefitEntitledConfig?.payable_percent
                        ? 12
                        : configuration?.is_allow_forex &&
                          !benefitEntitledConfig?.payable_percent
                        ? 8
                        : !configuration?.is_allow_forex &&
                          !benefitEntitledConfig?.payable_percent
                        ? 12
                        : 12
                    }
                    style={{ paddingLeft: '8px', paddingRight: '8px' }}
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
                                maxLength={15}
                                style={{ width: '100%' }}
                                min={0}
                                precision={2}
                                value={taxAmount}
                                disabled={true}
                                onChange={value => {
                                  setTaxAmount(value);
                                }}
                              />
                            </Form.Item>
                          </span>
                        </div>
                      </Form.Item>
                    ) : (
                      <GetFieldStructure
                        label={
                          <div className='default-value-benefit-btn-parent'>
                            <label>
                              <GetLabelName
                                defaultTitle='Tax Amount'
                                configuration={configuration}
                              />
                            </label>
                            <Tooltip
                              title={Number(
                                fetchedBenefitClaimData.system_tax_amount,
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
                        {Number(fetchedBenefitClaimData.tax_amount).toFixed(2)}
                      </GetFieldStructure>
                    )}
                  </Col>
                  <Col
                    xs={
                      configuration?.is_allow_forex &&
                      benefitEntitledConfig?.payable_percent
                        ? 12
                        : !configuration?.is_allow_forex &&
                          benefitEntitledConfig?.payable_percent
                        ? 12
                        : configuration?.is_allow_forex &&
                          !benefitEntitledConfig?.payable_percent
                        ? 8
                        : !configuration?.is_allow_forex &&
                          !benefitEntitledConfig?.payable_percent
                        ? 12
                        : 12
                    }
                    style={{ paddingLeft: '8px', paddingRight: '8px' }}
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
                              validateTrigger='onBlur'
                              rules={[
                                {
                                  required: false,
                                },
                              ]}
                            >
                              <InputNumber
                                maxLength={15}
                                style={{ width: '100%' }}
                                min={0}
                                precision={2}
                                value={amountBeforeTax}
                                disabled={true}
                                onChange={value => setAmountBeforeTax(value)}
                              />
                            </Form.Item>
                          </span>
                        </div>
                      </Form.Item>
                    ) : (
                      <GetFieldStructure
                        label={
                          <GetLabelName
                            defaultTitle='Amount Before Taxes'
                            configuration={configuration}
                          />
                        }
                      >
                        {Number(
                          fetchedBenefitClaimData.amount_before_taxes,
                        ).toFixed(2)}
                      </GetFieldStructure>
                    )}
                  </Col>
                  {configuration?.can_attach_receipts && (
                    <Col
                      xs={
                        configuration?.is_display_no_receipt_attached_field
                          ? 17
                          : 24
                      }
                    >
                      {isUseForFormPreview ? (
                        <Form.Item
                          validateTrigger='onBlur'
                          label={
                            labelMapping?.receipt_number ? (
                              labelMapping?.receipt_number.mapped
                            ) : (
                              <GetLabelName
                                defaultTitle='Receipt Number'
                                configuration={configuration}
                              />
                            )
                          }
                          rules={[
                            {
                              required: true,
                              message:
                                JSONData.vaidationErrors.generalForm
                                  .receipt_number.mandatory,
                            },
                          ]}
                        >
                          <InputNumber style={{ width: '100%' }} min={0} />
                        </Form.Item>
                      ) : (
                        <GetFieldStructure
                          label={
                            <GetLabelName
                              defaultTitle='Receipt Number'
                              configuration={configuration}
                            />
                          }
                        >
                          {fetchedBenefitClaimData?.receipt
                            ? fetchedBenefitClaimData?.receipt[0]
                                ?.receipt_number
                              ? fetchedBenefitClaimData?.receipt[0]
                                  ?.receipt_number
                              : ''
                            : ''}
                        </GetFieldStructure>
                      )}
                    </Col>
                  )}
                  {configuration?.is_display_no_receipt_attached_field && (
                    <Col xs={6} offset={1}>
                      <GetFieldStructure label=' ' noBg={true}>
                        <Checkbox
                          disabled={true}
                          checked={Boolean(
                            fetchedBenefitClaimData.is_no_receipt,
                          )}
                        >
                          {labelMapping?.no_receipt ? (
                            labelMapping?.no_receipt.mapped
                          ) : (
                            <GetLabelName
                              defaultTitle='No Receipt'
                              configuration={configuration}
                            />
                          )}
                        </Checkbox>
                      </GetFieldStructure>
                    </Col>
                  )}
                  {formData.is_no_receipt && (
                    <Col xs={24}>
                      <GetFieldStructure
                        label={
                          labelMapping?.no_receipt_remark ? (
                            labelMapping?.no_receipt_remark.mapped
                          ) : (
                            <GetLabelName
                              defaultTitle='No Receipt Remark'
                              configuration={configuration}
                            />
                          )
                        }
                      >
                        {fetchedBenefitClaimData?.no_receipt_remark}
                      </GetFieldStructure>
                    </Col>
                  )}
                  {configuration?.is_allow_charging_to_cost_centres ? (
                    <Col span={24}>
                      <Row gutter={rowGutter}>
                        {!configuration?.is_employee_cost_centre_readonly ? (
                          <Col span={12}>
                            {isUseForFormPreview ? (
                              <CommonBenefitFormFieldsIndex.ChargeTo
                                amount={formData.converted_amount}
                                JSONData={JSONData}
                                viewOnly={false}
                                formData={formData}
                                configuration={configuration}
                              />
                            ) : (
                              <GetFieldStructure
                                label={
                                  <GetLabelName
                                    defaultTitle='Charge-to'
                                    configuration={configuration}
                                  />
                                }
                              >
                                {fetchedBenefitClaimData?.charge_to?.title ||
                                  ''}
                              </GetFieldStructure>
                            )}
                          </Col>
                        ) : null}
                        {formData.charge_to === 'THIRD' ? (
                          <Col xs={12}>
                            <GetFieldStructure
                              label={
                                <GetLabelName
                                  defaultTitle='Third Party Vendor'
                                  configuration={configuration}
                                />
                              }
                            >
                              {fetchedBenefitClaimData?.third_party_vendor}
                            </GetFieldStructure>
                          </Col>
                        ) : (
                          <Col
                            span={
                              configuration?.is_employee_cost_centre_readonly
                                ? 24
                                : 12
                            }
                          >
                            {isUseForFormPreview ? (
                              <CommonBenefitFormFieldsIndex.CostCentre
                                amount={
                                  configuration?.is_forex_rate_editable_by_employee
                                    ? formData.converted_amount
                                    : formData.amount
                                }
                                formData={formData}
                                viewOnly={false}
                                JSONData={JSONData}
                                configuration={configuration}
                                benefitClaimFetchedData={
                                  fetchedBenefitClaimData
                                }
                                costCenterList={[]}
                              />
                            ) : (
                              <GetFieldStructure
                                label={
                                  <GetLabelName
                                    defaultTitle='Cost Centre'
                                    configuration={configuration}
                                  />
                                }
                              >
                                {`${fetchedBenefitClaimData?.cost_centre?.title} (${fetchedBenefitClaimData?.cost_centre?.code})` ||
                                  ''}
                              </GetFieldStructure>
                            )}
                          </Col>
                        )}
                      </Row>
                    </Col>
                  ) : null}
                </Row>
              </Form>
              {
                <CustomFields
                  claimFieldsData={
                    fetchedBenefitClaimData?.custom_fields || custom
                  }
                  configuration={configuration}
                  formProps={formProps}
                  isUseForFormPreview={isUseForFormPreview}
                  _isAdmin={isAdmin}
                />
              }
            </Col>
            {receiptColVisibility && (
              <Col xl={{ span: 9, offset: 0 }}>
                <ReceiptSupportingDocFields
                  configuration={configuration}
                  expenseClaimFetchedData={fetchedBenefitClaimData}
                  isUseForFormPreview={isUseForFormPreview}
                  formProps={formProps}
                />
              </Col>
            )}
          </Row>
        </ErrorBoundary>
      )}
    </ErrorBoundary>
  );
};

const connector = connect(mapStateToProps, mapDispatchToProps);
export default connector(BenefitDetail);

const GetSkeleton: FC = () => (
  <Row gutter={[24, 24]} className='skeleton-container'>
    <Col span={24} xl={15}>
      <SkeletonItem type='Form' />
    </Col>
    <Col xl={{ span: 9, offset: 0 }} span={24}>
      <Skeleton.Input className='receipt-skeleton' active />
      {/* <Skeleton.Input active size='small' /> */}
    </Col>
  </Row>
);

const GetFieldStructure: FC<{
  label: any;
  noBg?: boolean;
  hideChild?: boolean;
}> = props => {
  return (
    <div className={`detail-field ${props?.noBg ? 'no-bg' : ''}`}>
      <div className='field-label'>{props.label}</div>
      {props.hideChild ? null : (
        <div className='field-value'>{props.children}</div>
      )}
    </div>
  );
};
