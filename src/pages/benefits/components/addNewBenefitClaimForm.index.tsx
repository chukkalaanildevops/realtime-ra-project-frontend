import React, {
  FC,
  useRef,
  Dispatch,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import {
  Button,
  Checkbox,
  Col,
  Tooltip,
  DatePicker,
  Form,
  FormProps,
  Input,
  InputNumber,
  Result,
  Row,
  Select,
  message,
  Tag,
} from 'antd';
import { Trans } from '@lingui/macro';
import moment, { Moment } from 'moment';
import { GetLabelName } from '../addNewBenefit.index';
import {
  FilterBar,
  CustomFieldsForm,
  ErrorBoundary,
  ReceiptAndSupportDocumentUploader,
} from '../../../shared/components';
import './addNewBenefitClaimForm.index.less';
import { connect, ConnectedProps } from 'react-redux';
import {
  isProxyPermissionAllowed,
  getCountryCurrencyList,
  stateInterface,
} from '../../../shared/redux/rootReducer';
import {
  fetchBenefitClaim,
  fetchBenefitCostCentreChageTo,
  fetchBenefitCostCentreList,
  fetchCoversionRate,
  fetchUserEntitledBenefitsConfiguration,
  sendBenefitClaim,
  sendBenefitClaimForApproval,
  fetchTaxPercentage,
  fetchDependentInfo,
} from '../addNewBenefit.thunk';
import { PROXY_PERMISSIONS } from '../../delegate/delegate.model';
import { TchargeToCodesForFetch } from '../addNewBenefit.model';
import {
  stringTemplating,
  scrollToElem,
  getQueryParametersAsObject,
} from '../../../utils/global.utils';
import JSONData from '../addNewBenefit.data.json';
import { fetchProfileDataAPI } from '../../../services/profile';
import { AxiosResponse } from 'axios';
import { setCurrentEmployee } from '../../admin/admin.actions';
import {
  addUpdateBenefitFormData,
  resetToInitial,
  resetOnTypeChange,
  setSelectedBenefitType,
  updateDefaultTaxAmount,
  updateBackendWarning,
  updateDefaultConversionRate,
  receiptDateFieldOnChange,
  receiptGalleryDateFieldOnChange,
} from '../store/benefit.action';
import Big from 'big.js';
import { appPath } from '../../app/app.routes';
import { useHistory, useLocation } from 'react-router-dom';
import Store from '../../../shared/redux/store/store.index';
import { getIsPresentInTargetAudience } from '../../../shared/redux/rootReducer';
import { InfoCircleOutlined, StopOutlined } from '@ant-design/icons';
import { useWindowsSize } from '../../../shared/hooks';
import { GetSkeleton } from '../../addNewExpense/components';
import { scanImage } from '../../receipt/receipt.thunk';
import { setScanDateAmount } from '../../receipt/receipt.action';

const { Option } = Select;
let is_enabled_ocr = false;

const mapStateToProps = (state: stateInterface) => {
  const {
    isDisableButton,
    benefitEntitledList,
    benefitEntitledListLoader,
    benefitEntitledConfig,
    chargeTo,
    defaultTax,
    userJobInfo,
    costCenterList,
    formData,
    selectedBenefitType,
    selectedBenefitTypeLoader,
    backendError,
    backendWarning,
    fetchedBenefitClaimData,
    defaultConversionRate,
    fetchedBenefitClaimDataLoader,
    taxPercentage,
    receiptDateOnChange,
    receiptGalleryDateOnChange,
    benefitDependentInfo,
    benefitDependentInfoLoader,
  } = state.BenefitReducer;
  const { currentEmployee } = state.admin;
  const { tenantConfig } = state.configuration;
  const {
    scannedTax,
    scanLoader,
    isHandwritten,
    scannedAmount,
    scannedCurrency,
    scannedReceiptDate,
    scannedReceiptNumber,
    confidence,
    warning_msg,
  } = state.receipt;
  return {
    scannedTax,
    scanLoader,
    scannedAmount,
    scannedCurrency,
    scannedReceiptDate,
    scannedReceiptNumber,
    isHandwritten,
    confidence,
    warning_msg,
    tenantConfig,
    isDisableButton,
    benefitEntitledList,
    benefitEntitledListLoader,
    defaultTax,
    benefitEntitledConfig,
    currencies: getCountryCurrencyList(state),
    chargeTo,
    userJobInfo,
    costCenterList,
    formData,
    selectedBenefitType,
    selectedBenefitTypeLoader,
    backendError,
    backendWarning,
    defaultConversionRate,
    fetchedBenefitClaimData,
    fetchedBenefitClaimDataLoader,
    isPermissionAllowed: (permission: PROXY_PERMISSIONS) =>
      isProxyPermissionAllowed(state, permission),
    taxPercentage,
    receiptDateOnChange,
    receiptGalleryDateOnChange,
    currentEmployee,
    benefitDependentInfo,
    benefitDependentInfoLoader,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  return {
    _updateBackendWarning: (data: any) => dispatch(updateBackendWarning(data)),
    _fetchUserEntitledBenefitsConfiguration: (value: any, claimDate: string) =>
      dispatch(fetchUserEntitledBenefitsConfiguration(value, claimDate)),
    _fetchCostCentreChageTo: () => dispatch(fetchBenefitCostCentreChageTo()),
    _fetchBenefitCostCentreList: (
      chargeTo: TchargeToCodesForFetch,
      legalEntityUuid?: string,
      callBack?: Function,
    ) =>
      dispatch(fetchBenefitCostCentreList(chargeTo, legalEntityUuid, callBack)),
    _sendBenefitClaim: (
      isAdminEdit: any,
      data: any,
      benefitClaimId: number,
      callback: Function,
    ) =>
      dispatch(sendBenefitClaim(isAdminEdit, data, benefitClaimId, callback)),
    _updateDefaultTaxAmount: (amt: any) =>
      dispatch(updateDefaultTaxAmount(amt)),
    _updateDefaultConversionRate: (rate: any) =>
      dispatch(updateDefaultConversionRate(rate)),
    _fetchDependentInfo: (relations: any, id: any, date: any) =>
      dispatch(fetchDependentInfo(relations, id, date)),
    _sendBenefitClaimForApproval: (
      data: any,
      benefitClaimId: number,
      callback: Function,
    ) => dispatch(sendBenefitClaimForApproval(data, benefitClaimId, callback)),
    _addUpdateFormData: (key: string, value: any) =>
      dispatch(addUpdateBenefitFormData(key, value)),
    _setSelectedBenefitType: (benefitTypeDetail: any) =>
      dispatch(setSelectedBenefitType(benefitTypeDetail)),
    _fetchCoversionRate: (
      date: string,
      target: number,
      base: number,
      callback?: Function,
      // _calledFrom?: string,
    ) => dispatch(fetchCoversionRate(date, base, target, callback)),
    // dispatch(fetchCoversionRate(date, base, target, callback, _calledFrom)),
    _fetchBenefitClaim: (id: number) => dispatch(fetchBenefitClaim(id)),
    _resetBenefitClaimForm: () => dispatch(resetToInitial()),
    _resetOnTypeChange: () => dispatch(resetOnTypeChange()),
    _fetchTaxPercentage: (data: any, callBack?: any) =>
      dispatch(fetchTaxPercentage(data, callBack)),
    _receiptDateOnChange: (data: any) =>
      dispatch(receiptDateFieldOnChange(data)),
    _receiptGalleryDateOnChange: (data: any) =>
      dispatch(receiptGalleryDateFieldOnChange(data)),
    _setCurrentEmployee: (employeeData: any) =>
      dispatch(setCurrentEmployee(employeeData)),
    _scanImage: (file: File) => dispatch(scanImage(file)),
    _setScanDateAmount: (
      date: any,
      amount: number,
      recNumber: any,
      currency: any,
      confidence: any,
      warning_msg: string,
    ) =>
      dispatch(
        setScanDateAmount(
          date,
          amount,
          recNumber,
          currency,
          false,
          confidence,
          warning_msg,
        ),
      ),
  };
};
const connector = connect(mapStateToProps, mapDispatchToProps);
type Tprops = ConnectedProps<typeof connector> & {
  benefitClaimId: any;
  viewOnly?: boolean;
  isAdminEdit?: boolean;
};

let isTaxAmountTouched = false;
let isConversionRateTouched = false;
let initialUpdateTaxAmount = false;
let restrictUser = true;
let initialLoad = true;
let convertedAmount = 0;

const isActionAllowed = (permissionCode: string, userId: number): boolean => {
  return getIsPresentInTargetAudience(Store.getState(), permissionCode, userId);
};

const AddNewBenefitClaimForm: FC<Tprops> = (props: any) => {
  const {
    ////Data////
    isHandwritten,
    confidence,
    warning_msg,
    benefitDependentInfo,
    benefitDependentInfoLoader,
    isDisableButton,
    benefitClaimId,
    viewOnly = false,
    isAdminEdit,
    fetchedBenefitClaimData,
    benefitEntitledList,
    benefitEntitledListLoader,
    benefitEntitledConfig,
    currencies,
    chargeTo,
    costCenterList,
    formData,
    defaultTax,
    defaultConversionRate,
    selectedBenefitType,
    selectedBenefitTypeLoader,
    fetchedBenefitClaimDataLoader,
    backendError,
    backendWarning,
    isPermissionAllowed,
    userJobInfo,
    scanLoader,
    tenantConfig,
    scannedTax,
    scannedAmount,
    scannedCurrency,
    scannedReceiptDate,
    scannedReceiptNumber,
    ///functions///
    _scanImage,
    _fetchDependentInfo,
    _updateBackendWarning,
    _setScanDateAmount,
    _fetchUserEntitledBenefitsConfiguration,
    _fetchCostCentreChageTo,
    _updateDefaultTaxAmount,
    _fetchBenefitCostCentreList,
    _sendBenefitClaim,
    _addUpdateFormData,
    _setSelectedBenefitType,
    _fetchCoversionRate,
    _fetchBenefitClaim,
    _sendBenefitClaimForApproval,
    _resetBenefitClaimForm,
    _updateDefaultConversionRate,
    _resetOnTypeChange,
    _fetchTaxPercentage,
    taxPercentage,
    _receiptDateOnChange,
    // receiptDateOnChange,
    _receiptGalleryDateOnChange,
    receiptGalleryDateOnChange,
    currentEmployee,
    _setCurrentEmployee,
  } = props;
  const [form] = Form.useForm();
  const configuration: any = benefitEntitledConfig?.benefit_type_configuration;
  const labelMapping: any = configuration?.label_mapping;
  const customFieldRef = useRef<any>(null);
  // const [isDisableNoReceiptCheckbox, setIsDisableNoReceiptCheckbox] = useState<
  //   Boolean
  // >(false);
  const windowSize = useWindowsSize();
  const isReceiptAllowed = isPermissionAllowed('ACTION_RECEIPT');
  const benefitCategory = benefitEntitledConfig?.benefit_category;
  const [
    benefitDependentRelationship,
    setBenefitDependentRelationship,
  ] = useState<any>(null);
  const [sCurrency, setsCurrency] = useState<any>({});

  // const [isNoReceiptSelect, setIsNoReceiptSelect] = useState<boolean>(false);

  const commonFormProps: FormProps = {
    scrollToFirstError: true,
    size: 'middle',
    layout: 'vertical',
    colon: false,
    autoComplete: 'off',
  };

  let fromAdmin = getQueryParametersAsObject().mode === 'admin';
  let employeeId = fromAdmin
    ? fetchedBenefitClaimData?.employee?.id
    : undefined;

  const history = useHistory();
  const location: any = useLocation();

  // useEffect(() => {
  //   if (Object.keys(fetchedBenefitClaimData).length) {
  //     if (fetchedBenefitClaimData.is_no_receipt) {
  //       setIsDisableNoReceiptCheckbox(true);
  //     } else {
  //       setIsDisableNoReceiptCheckbox(false);
  //     }
  //   }
  //   setIsDisableNoReceiptCheckbox(false);
  // }, [fetchedBenefitClaimData]);

  const fetchEmployeeProfile = async () => {
    try {
      if (employeeId !== undefined) {
        const response: AxiosResponse = await fetchProfileDataAPI(employeeId);
        const data = response.data;
        _setCurrentEmployee(data);
        _fetchBenefitCostCentreList('LOCAL');
      }
    } catch (error) {
      message.error(error.response.data.error);
    }
  };
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
  const dependentRelationsChangeHandler = (values: any) => {
    const selectedDependentInfo = benefitDependentInfo?.find(
      (info: any) => info.uuid === values,
    );
    setBenefitDependentRelationship(selectedDependentInfo);
    if (selectedDependentInfo) {
      _addUpdateFormData('dependent_uuid', selectedDependentInfo?.uuid);
    }
  };
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
    fetchEmployeeProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employeeId]);

  useEffect(() => {
    _resetBenefitClaimForm();
    _fetchCostCentreChageTo();

    if (!benefitClaimId) {
      _fetchBenefitCostCentreList('LOCAL');
      _addUpdateFormData('charge_to', 'LOCAL');
    } else {
      initialUpdateTaxAmount = true;
      _fetchBenefitClaim(Number(benefitClaimId));
    }
    // _updateDefaultTaxAmount(formData.system_tax_amount);
    // _updateDefaultConversionRate(formData.system_conversion_rate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [benefitClaimId]);

  useEffect(() => {
    initialLoad = true;
  }, []);
  useEffect(() => {
    if (tenantConfig.length > 0) {
      is_enabled_ocr = tenantConfig[0]?.is_enabled_ocr;
    }
  }, [tenantConfig]);
  useEffect(() => {
    if (formData.date && selectedBenefitType?.benefit_type_configuration) {
      _fetchTaxPercentage({
        date: formData.date.format('YYYY-MM-DD'),
        benefit_type_configuration:
          selectedBenefitType?.benefit_type_configuration,
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBenefitType]);

  useEffect(() => {
    if (
      (fetchedBenefitClaimData?.benefit_type_legal_entity
        ?.global_configuration ||
        selectedBenefitType?.benefit_type_configuration) &&
      formData?.date
    ) {
      _fetchTaxPercentage({
        benefit_type_configuration: selectedBenefitType?.benefit_type_configuration
          ? selectedBenefitType?.benefit_type_configuration
          : fetchedBenefitClaimData?.benefit_type_legal_entity
              ?.global_configuration,
        date: moment(formData?.date).format('YYYY-MM-DD'),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData?.date]);

  useEffect(() => {
    if (
      !configuration?.is_display_no_receipt_attached_field &&
      formData.is_no_receipt
    ) {
      _addUpdateFormData('is_no_receipt', false);
      _addUpdateFormData('no_receipt_remark', '');
    }
    if (benefitEntitledConfig?.end_date) {
      moment(benefitEntitledConfig?.end_date, ['DD/MM/YYYY']) <= moment() &&
        _addUpdateFormData('date', moment(formData?.date, ['DD/MM/YYYY']));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [configuration]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const _customFieldSetValues_useEffectFn = () => {
    try {
      if (
        customFieldRef?.current?.setValues &&
        formData?.custom_fields?.length > 0 &&
        configuration !== null
      ) {
        // eslint-disable-next-line no-unused-expressions
        customFieldRef?.current?.setValues(formData?.custom_fields);
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    form.setFieldsValue({
      ...formData,
    });
    if (benefitClaimId) {
      _customFieldSetValues_useEffectFn();
    }
  }, [_customFieldSetValues_useEffectFn, benefitClaimId, form, formData]);

  const calculateAmountUsingConversionRate = (
    conversion_rate?: number,
    scanedAmount?: any,
  ) => {
    if (configuration) {
      const _amount = scanedAmount || formData.amount;
      const _conversionRate = conversion_rate || formData.conversion_rate;
      // const _convertedAmount = formData.converted_amount;
      let _taxAmount = formData.tax_amount;
      // const _amountBeforetaxes = formData.amount_before_taxes;

      if (benefitEntitledConfig?.payable_percent) {
        const payableAmount = Number(
          Big(Number(benefitEntitledConfig?.payable_percent))
            .div(100)
            .mul(Number(_amount)),
        );

        _addUpdateFormData('payable_amount', payableAmount);
        const calculatedAmount = Number(
          Big(Number(payableAmount))
            .times(Number(_conversionRate))
            .round(2)
            .valueOf(),
        );

        convertedAmount = calculatedAmount;
      } else {
        const payableAmount = Number(_amount);
        _addUpdateFormData('payable_amount', payableAmount);

        convertedAmount = Number(
          Big(Number(payableAmount))
            .times(Number(_conversionRate))
            .round(2)
            .valueOf(),
        );
      }

      let amountBeforeTaxes: number = formData.amount_before_taxes
        ? formData.amount_before_taxes
        : 0;

      if (
        (configuration?.is_allow_updating_tax_amount && isTaxAmountTouched) ||
        initialUpdateTaxAmount
      ) {
        amountBeforeTaxes = Number(
          Big(convertedAmount)
            .minus(_taxAmount)
            .round(2)
            .valueOf(),
        );

        initialUpdateTaxAmount = false;
      } else {
        let amountBeforeTaxes_denominator = Number(
          Big(1)
            .add(
              Big(Number(taxPercentage) || 0)
                .div(100)
                .valueOf(),
            )
            .valueOf(),
        );
        amountBeforeTaxes = Number(
          Big(convertedAmount)
            .div(amountBeforeTaxes_denominator)
            .round(2)
            .valueOf(),
        );
        _taxAmount = Number(
          Big(convertedAmount)
            .minus(amountBeforeTaxes)
            .round(2)
            .valueOf(),
        );

        if (!configuration?.is_auto_populate_tax_amount) {
          amountBeforeTaxes = Number(
            Big(convertedAmount)
              .div(1)
              .round(2)
              .valueOf(),
          );
        }
      }

      if (!initialLoad && !isTaxAmountTouched) {
        configuration?.is_auto_populate_tax_amount
          ? _updateDefaultTaxAmount(_taxAmount)
          : _updateDefaultTaxAmount(_taxAmount);
      }
      if (benefitClaimId) {
        !initialLoad &&
          !isTaxAmountTouched &&
          _addUpdateFormData(
            'tax_amount',
            configuration?.is_auto_populate_tax_amount ? _taxAmount : 0,
          );
      } else {
        !isTaxAmountTouched &&
          _addUpdateFormData(
            'tax_amount',
            configuration?.is_auto_populate_tax_amount ? _taxAmount : 0,
          );
      }
      !initialLoad &&
        !isConversionRateTouched &&
        _updateDefaultConversionRate(_conversionRate);
      _addUpdateFormData('converted_amount', convertedAmount);
      !initialLoad &&
        _addUpdateFormData('amount_before_taxes', amountBeforeTaxes);
    }
  };

  useEffect(() => {
    calculateAmountUsingConversionRate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    formData.amount,
    formData.conversion_rate,
    formData.tax_amount,
    configuration,
    taxPercentage,
  ]);

  useEffect(() => {
    if (receiptGalleryDateOnChange) {
      calculateAmountUsingConversionRate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taxPercentage, receiptGalleryDateOnChange]);

  useEffect(() => {
    if (selectedBenefitType) {
      const currency = selectedBenefitType.legal_entity.currency.id;
      _addUpdateFormData('currency', currency);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBenefitType]);

  useEffect(() => {
    if (chargeTo) {
      chargeTo.map((o: any) => {
        const isDisabled = isDisableChargeTo(o.code);
        if (o.code === formData.charge_to && isDisabled) {
          chargeToChangeHandler('LOCAL');
        }
        return o;
      });
    }
    if (!configuration?.is_auto_populate_tax_amount && !initialLoad) {
      _addUpdateFormData('tax_amount', 0);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.amount]);

  useEffect(() => {
    if (costCenterList && configuration?.is_allow_charging_to_cost_centres) {
      if (!benefitClaimId) {
        const isUserCCEnable = costCenterList.find(
          (costCenter: any) =>
            costCenter.uuid === userJobInfo?.cost_centre?.uuid,
        );
        if (configuration?.is_default_to_entity_cost_centre) {
          _addUpdateFormData(
            'cost_centre_uuid',
            configuration?.le_cost_centre?.uuid,
          );
        } else if (isUserCCEnable) {
          _addUpdateFormData(
            'cost_centre_uuid',
            userJobInfo?.cost_centre?.uuid,
          );
        } else if (configuration?.is_default_to_employee_cost_centre) {
          _addUpdateFormData('cost_centre_uuid', '');
        } else {
          _addUpdateFormData('cost_centre_uuid', costCenterList[0]?.uuid);
        }
      } else {
        if (
          formData.charge_to ===
            userJobInfo?.cost_centre?.cost_centre_type?.code &&
          formData.cost_centre_uuid === userJobInfo.cost_centre.uuid &&
          !isAdminEdit
        ) {
          const isUserCCEnable = costCenterList.find(
            (costCenter: any) =>
              costCenter.uuid === userJobInfo?.cost_centre?.uuid,
          );
          if (!isUserCCEnable) {
            chargeToChangeHandler(
              userJobInfo?.cost_centre?.cost_centre_type?.code,
            );
          }
        } else if (
          formData.charge_to ===
            currentEmployee?.cost_centre?.cost_centre_type?.code &&
          formData.cost_centre_uuid === currentEmployee.cost_centre.uuid &&
          isAdminEdit
        ) {
          chargeToChangeHandler(
            currentEmployee?.cost_centre?.cost_centre_type?.code,
          );
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userJobInfo, selectedBenefitTypeLoader, costCenterList, currentEmployee]);

  const isDisableChargeTo = (code: any) => {
    let returnBool = false;
    if (configuration) {
      if (!configuration?.is_allow_overseas_cost_centres && code === 'OVERS') {
        returnBool = true;
      } else if (
        !configuration?.is_allow_3rd_party_vendor &&
        code === 'THIRD'
      ) {
        returnBool = true;
      } else if (
        !configuration?.is_allow_internal_order_cost_centres &&
        code === 'INTER'
      ) {
        returnBool = true;
      }
      if (!configuration?.is_employee_cost_centre_readonly) {
        if (
          code === 'OVERS' &&
          formData.amount < Number(configuration?.overseas_cc_threshold_amount)
        ) {
          returnBool = true;
        }
      }
    }
    return returnBool;
  };

  const redirectToDraft = () => {
    _resetBenefitClaimForm();
    _setScanDateAmount(null, 0, '', {});
    history.push(`${appPath.drafts.linkTo}benefit`);
  };

  const redirectToAdminBenefit = () => {
    _resetBenefitClaimForm();
    _setScanDateAmount(null, 0, '', {});
    history.goBack();
  };

  const redirectToSubmitted = () => {
    _setScanDateAmount(null, 0, '', {});
    history.push(`${appPath.submitted.linkTo}benefit`);
  };

  // redirect code end

  const handleSubmit = (sendAs: string) => {
    isTaxAmountTouched = false;
    isConversionRateTouched = false;
    return form
      .validateFields()
      .then(() => {
        const customFieldForm = customFieldRef?.current?.getpostData();
        const customValidation = customFieldRef?.current?.getCustomFieldFormInstance();
        let postData = { ...formData };
        customValidation.validateFields().then(() => {
          postData = {
            ...formData,
            custom_fields: customFieldForm,
            benefit_entitlement: benefitEntitledConfig?.id,
            amount: Number(formData.amount).toFixed(2),
            converted_amount: Number(Big(formData.converted_amount).round(2)),
            is_handwritten_detected: isHandwritten || false,
            payable_amount: Number(
              Big(Number(formData.payable_amount)).round(2),
            ),
          };

          if (benefitClaimId) {
            const selectedCategory = benefitCategory?.find(
              (category: any) => category.id === formData.benefit_category,
            );
            if (selectedCategory) {
              postData.wage_type = selectedCategory.wage_type.id;
            }
            // update receipt
            if (formData.is_no_receipt && postData.receipt.length < 0) {
              delete postData.receipt;
              delete postData.receipt_number;
              delete postData.library_receipt;
              postData.is_receipt_deleted = true;
            } else {
              if (
                fetchedBenefitClaimData.receipt &&
                fetchedBenefitClaimData.receipt.length &&
                formData.receipt.length
              ) {
                if (
                  fetchedBenefitClaimData.receipt[0].file !==
                  formData.receipt[0]
                ) {
                  postData.is_receipt_deleted = true;
                } else {
                  postData.is_receipt_deleted = false;
                  delete postData.receipt;
                }
              } else if (
                fetchedBenefitClaimData.receipt &&
                fetchedBenefitClaimData.receipt.length &&
                !formData.receipt.length
              ) {
                postData.is_receipt_deleted = true;
                delete postData.receipt;
                delete postData.receipt_number;
              } else {
                if (postData.receipt.length === 0) {
                  delete postData.receipt;
                  delete postData.receipt_number;
                  delete postData.library_receipt;
                }
                if (
                  !configuration.is_receipt_mandatory &&
                  !formData.receipt.length
                ) {
                  delete postData.receipt;
                  delete postData.receipt_number;
                }
              }
            }
            delete postData.receipt_uploaded;

            if (formData.receipt.length !== 0) {
              postData.is_receipt_deleted = false;
            }
            if (formData.library_receipt && !formData.is_no_receipt) {
              postData.is_receipt_deleted = false;
              delete postData.receipt;
            }
            // update receipt end

            const fetchedSupportingDocIds = fetchedBenefitClaimData.supporting_documents.map(
              (o: any) => o.id,
            );

            const newSupportingDocuments = formData.supporting_documents.filter(
              (supportingDoc: any) => supportingDoc.uid,
            );

            const oldSupportingDocsIds = formData.supporting_documents
              .filter((supportingDoc: any) => supportingDoc.id)
              .map((o: any) => o.id);

            const deletedSupportingDocsIds = fetchedSupportingDocIds.filter(
              (id: any) => !oldSupportingDocsIds.includes(id),
            );

            if (newSupportingDocuments.length) {
              postData.supporting_documents = newSupportingDocuments;
            } else {
              delete postData.supporting_documents;
            }

            postData.deleted_supporting_documents = deletedSupportingDocsIds;
          } else {
            if (configuration?.can_attach_receipts) {
              if (configuration?.is_receipt_mandatory) {
                if (formData.is_no_receipt) {
                  delete postData.library_receipt;
                  delete postData.receipt;
                  delete postData.receipt_number;
                } else {
                  if (!formData.library_receipt) {
                    delete postData.library_receipt;
                  } else {
                    delete postData.receipt;
                  }
                }
              } else {
                if (!formData.library_receipt) {
                  delete postData.library_receipt;
                } else {
                  delete postData.receipt;
                }
                if (!formData.receipt.length) {
                  postData.hasOwnProperty('receipt') && delete postData.receipt;
                }
                if (!formData.receipt_number) {
                  delete postData.receipt_number;
                }
              }
            } else {
              delete postData.library_receipt;
              delete postData.receipt;
              delete postData.receipt_number;
            }
            delete postData.receipt_uploaded;
          }
          if (!configuration?.is_allow_flexible_benefit) {
            delete postData.benefit_category;
            delete postData.wage_type;
          }
          if (!configuration?.is_dependent_benefit) {
            delete postData.dependent_uuid;
          }
          if (formData.charge_to === 'THIRD') {
            delete postData.cost_centre_uuid;
          } else {
            delete postData.third_party_vendor;
          }
          if (!configuration?.is_allow_charging_to_cost_centres) {
            delete postData.charge_to;
            delete postData.cost_centre_uuid;
          }
          postData.date = formData.date.format('DD-MM-YYYY');

          !configuration?.allow_remark && delete postData.purpose;

          if (
            !configuration?.is_allow_forex &&
            !benefitEntitledConfig?.payable_percent
          ) {
            delete postData.converted_amount;
          }

          if (sendAs === 'draft') {
            if (isAdminEdit) {
              _sendBenefitClaim(
                isAdminEdit,
                postData,
                benefitClaimId,
                redirectToAdminBenefit,
              );
            } else {
              _sendBenefitClaim(
                isAdminEdit,
                postData,
                benefitClaimId,
                redirectToDraft,
              );
            }
          } else {
            _sendBenefitClaimForApproval(
              postData,
              benefitClaimId,
              redirectToSubmitted,
            );
          }
        });
      })
      .catch(error => {
        scrollToElem(`#addNewBenefitForm .${error.errorFields[0].name[0]}`);
        return 0;
      });
  };

  const noReceiptRemarkHandler = (event: any) => {
    _addUpdateFormData('is_no_receipt', event.target.checked);
    if (event.target.checked) {
      _addUpdateFormData('receipt', []);
      _addUpdateFormData('receipt_number', '');
    } else {
      _addUpdateFormData('no_receipt_remark', '');
    }
  };

  const disabledDate = (current: Moment) => {
    let condition: boolean = false;
    const date = benefitEntitledConfig?.end_date;
    try {
      if (configuration === null) return false;

      if (isAdminEdit) return current >= moment(); //disabling only future dates
      if (current) {
        if (
          configuration?.allow_backdated_claims &&
          configuration?.backdated_claims_allowed_upto
        ) {
          condition =
            current <
            moment()
              .subtract(configuration?.backdated_claims_allowed_upto, 'days')
              .startOf('day');
        } else {
          condition =
            current <=
            moment()
              .subtract(1, 'days')
              .endOf('day');
        }
      }
    } catch (e) {
      console.error(e);
    }

    if (moment(date, ['DD/MM/YYYY']) <= moment()) {
      return current >= moment(date, ['DD/MM/YYYY']).add(1, 'days');
    } else {
      return condition || current >= moment();
    }
  };

  // currency

  const currencyChangeHandler = (value: number, scanedAmount?: any) => {
    isTaxAmountTouched = false;
    isConversionRateTouched = false;
    _addUpdateFormData('currency', value);
    const date = form.getFieldValue('date');

    if (moment.isMoment(date)) {
      const changedCurr = currencies.filter((o: any) => o.id === value);
      const benefitType = benefitEntitledList.find(
        (item: any) => item.id === formData.benefit_entitlement,
      );
      const base =
        selectedBenefitType?.legal_entity?.currency?.currency?.id ||
        benefitType?.legal_entity?.currency?.currency?.id ||
        fetchedBenefitClaimData?.benefit_type_legal_entity?.legal_entity
          ?.currency?.currency?.id;
      initialLoad = false;

      _fetchCoversionRate(
        form.getFieldValue('date').format('DD-MM-YYYY'),
        base as number,
        changedCurr[0]?.currency.id, //changedValues.currency,
        (conversionRate: any) => {
          calculateAmountUsingConversionRate(conversionRate, scanedAmount);
        },
      );
    } else {
      form.validateFields(['date']);
    }
  };
  const onDateValueChange = (value: any, callBack?: any) => {
    _addUpdateFormData('date', value);
    _receiptDateOnChange(true);
    let Curr = currencies.filter(
      (o: any) => o.id === form.getFieldValue('currency'),
    );

    const benefitType = benefitEntitledList.find(
      (item: any) => item.id === formData.benefit_entitlement,
    );
    let base =
      selectedBenefitType?.legal_entity?.currency?.currency?.id ||
      benefitType?.legal_entity?.currency?.currency?.id ||
      fetchedBenefitClaimData?.currency?.currency?.id;

    if (benefitClaimId) {
      base =
        selectedBenefitType?.legal_entity?.converted_amount_currency?.currency
          ?.id ||
        benefitType?.legal_entity?.converted_amount_currency?.currency?.id ||
        fetchedBenefitClaimData?.converted_amount_currency?.currency?.id;
    }

    _fetchCoversionRate(
      value.format('DD-MM-YYYY'),
      base as number,
      Curr[0]?.currency.id, //changedValues.currency,
      (conversionRate: any) => {
        calculateAmountUsingConversionRate(conversionRate);
        if (
          (value && selectedBenefitType?.benefit_type_configuration) ||
          (value &&
            fetchedBenefitClaimData?.benefit_type_legal_entity
              ?.global_configuration)
        ) {
          _fetchTaxPercentage(
            {
              date: value.format('YYYY-MM-DD'),
              benefit_type_configuration: selectedBenefitType?.benefit_type_configuration
                ? selectedBenefitType?.benefit_type_configuration
                : fetchedBenefitClaimData?.benefit_type_legal_entity
                    ?.global_configuration,
            },
            callBack,
          );
        } else {
          callBack();
        }
      },
    );
    _fetchUserEntitledBenefitsConfiguration(
      formData?.benefit_entitlement,
      value.format('DD/MM/YYYY'),
    );

    isTaxAmountTouched = false;
    initialLoad = false;
  };
  // currency endcharge_to

  const selectedBenefitTypeHandler = (benefitTypeId: number) => {
    _resetOnTypeChange();
    _setScanDateAmount(null, 0, '', {});
    _addUpdateFormData('benefit_entitlement', benefitTypeId);

    const selectedBenefit = benefitEntitledList.filter((o: any) => {
      return o.id === benefitTypeId;
    });

    selectedBenefit && _setSelectedBenefitType(selectedBenefit[0]);

    if (formData.date.format('DD/MM/YYY') === moment().format('DD/MM/YYYY')) {
      _fetchUserEntitledBenefitsConfiguration(
        benefitTypeId,
        formData.date.format('DD/MM/YYYY'),
      );
    } else {
      _fetchUserEntitledBenefitsConfiguration(
        benefitTypeId,
        moment().format('DD/MM/YYYY'),
      );
    }

    _fetchBenefitCostCentreList('LOCAL');
  };

  // receipt selection data

  const foreignCurrencyObjArr = currencies.filter(
    (o: any) => o.id === formData.currency,
  );
  const foreignCurrency = foreignCurrencyObjArr.length
    ? foreignCurrencyObjArr[0]
    : undefined;

  // receipt selection data end

  const receiptGallarySelectionFn = (file: any, _keysArr: string[]) => {
    const benefitType = benefitEntitledList.find(
      (item: any) => item.id === formData.benefit_entitlement,
    );
    const base =
      selectedBenefitType?.legal_entity?.currency?.currency?.id ||
      benefitType?.legal_entity?.currency?.currency?.id ||
      fetchedBenefitClaimData?.currency?.currency?.id;
    _addUpdateFormData('receipt_uploaded', false);
    _addUpdateFormData('library_receipt', file.id);
    if (
      _keysArr.includes('currency') &&
      file.currency &&
      configuration?.is_allow_forex
    ) {
      isConversionRateTouched = false;
      isTaxAmountTouched = false;
      _addUpdateFormData('currency', file.currency?.id);
    }

    if (file.amount && _keysArr.includes('amount')) {
      isTaxAmountTouched = false;
      _addUpdateFormData('amount', file.amount);
    }

    if (file.date && _keysArr.includes('date')) {
      _addUpdateFormData('date', moment(file.date, 'DD/MM/YYYY'));

      // _fetchTaxPercentage({
      //   date: moment(file.date, 'DD/MM/YYYY').format('YYYY-MM-DD'),
      //   benefit_type_configuration: selectedBenefitType?.benefit_type_configuration
      //     ? selectedBenefitType?.benefit_type_configuration
      //     : fetchedBenefitClaimData?.benefit_type_legal_entity
      //         ?.global_configuration,
      // });
      _receiptGalleryDateOnChange(true);
    }

    if (file.receipt_number && _keysArr.includes('receipt_number')) {
      _addUpdateFormData('receipt_number', file.receipt_number);
    }

    initialLoad = false;
    configuration?.is_allow_forex &&
      _keysArr.includes('currency') &&
      _fetchCoversionRate(
        moment(file.date, 'DD/MM/YYYY').format('DD-MM-YYYY'),
        base as number,
        file.currency?.currency?.id, //changedValues.currency,
        // calculateAmountUsingConversionRate,
      );
  };

  // charge To
  const chargeToChangeHandler = (value: any) => {
    _addUpdateFormData('charge_to', value);
    if (value !== 'THIRD') {
      _fetchBenefitCostCentreList(value)
        .then((item: any) => {
          const isUserCCEnable =
            !isAdminEdit &&
            item.find(
              (costCenter: any) =>
                costCenter.uuid === userJobInfo?.cost_centre?.uuid,
            );
          const isCurrentEmployee =
            isAdminEdit &&
            item.find(
              (costCenter: any) =>
                costCenter.uuid === currentEmployee?.cost_centre?.uuid,
            );
          if (isUserCCEnable) {
            _addUpdateFormData(
              'cost_centre_uuid',
              userJobInfo?.cost_centre?.uuid,
            );
          } else if (isCurrentEmployee) {
            _addUpdateFormData(
              'cost_centre_uuid',
              currentEmployee?.cost_centre?.uuid,
            );
          } else {
            _addUpdateFormData('cost_centre_uuid', item[0]?.uuid);
          }
        })
        .catch(() => {});
    }
  };

  const benefitCategoryChangeHandler = (values: any) => {
    const selectedBenefitCategory = benefitCategory?.find(
      (category: any) => category.id === values,
    );
    if (selectedBenefitCategory) {
      if (selectedBenefitCategory.is_active) {
        _updateBackendWarning({});
      } else {
        _updateBackendWarning({
          benefit_category: [
            `Benefit Category ${selectedBenefitCategory.title} is either Inactive `,
          ],
        });
      }
      _addUpdateFormData('benefit_category', selectedBenefitCategory?.id);
      _addUpdateFormData('wage_type', selectedBenefitCategory?.wage_type.id);
    }
  };
  const formProps: FormProps = {
    form: form,
    className: 'benefit-form',
    ...commonFormProps,
    // onSubmitCapture: formSubmitHandler,
  };

  useEffect(() => {
    if (
      scannedReceiptDate?.length === 1 &&
      scannedReceiptDate[0] !== formData.date
    ) {
      scannedDateClickedHandler(scannedReceiptDate[0], () => {
        if (scannedAmount?.length === 1) {
          scannedAmountClickedHandler(scannedAmount[0]);
          setScannedCurrncyValue(scannedAmount[0]);
        } else {
          setScannedCurrncyValue();
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scannedReceiptDate]);

  useEffect(() => {
    if (scannedAmount?.length === 1) {
      scannedAmountClickedHandler(scannedAmount[0]);
      setScannedCurrncyValue(scannedAmount[0]);
    } else {
      setScannedCurrncyValue();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scannedCurrency]);

  useEffect(() => {
    scannedAmount?.length === 1 &&
      scannedAmount[0] !== formData?.amount &&
      scannedAmountClickedHandler(scannedAmount[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scannedAmount]);

  useEffect(() => {
    scannedReceiptNumber?.length === 1 &&
      scannedReceiptNumber[0] !== formData.receipt_number &&
      scannedRecNumberClickedHandler(scannedReceiptNumber[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scannedReceiptNumber]);

  const scannedDateClickedHandler = (date: any, callback?: any) => {
    onDateValueChange(moment(date, ['DD/MM/YYYY']), callback);
  };

  const setScannedCurrncyValue = (amount?: any) => {
    if (configuration?.is_allow_forex) {
      if (scannedCurrency?.currency_code) {
        const scanCurr = currencies.find(
          (o: any) => o.currency.code === scannedCurrency?.currency_code,
        );
        scanCurr ? setsCurrency(scanCurr) : setsCurrency({});

        scanCurr &&
          scanCurr?.id !== formData.currency &&
          currencyChangeHandler(scanCurr?.id, amount);
      }
      // else {
      //   if (selectedBenefitType) {
      //     const currency = selectedBenefitType?.legal_entity.currency?.id;
      //     currency !== formData?.currency &&
      //       currency &&
      //       currencyChangeHandler(currency, amount);
      //   }
      //   setsCurrency({});
      // }
    }
  };

  const scannedAmountClickedHandler = (amount: any) => {
    isTaxAmountTouched = false;
    initialLoad = false;
    isConversionRateTouched = true;
    _addUpdateFormData('amount', parseFloat(amount));
  };

  const scannedRecNumberClickedHandler = (recNumber: any) => {
    _addUpdateFormData('receipt_number', recNumber);
  };
  const scannedTaxClickedHandler = (tax: any) => {
    if (configuration?.is_allow_updating_tax_amount) {
      isTaxAmountTouched = true;
      initialLoad = false;
      _addUpdateFormData('tax_amount', parseFloat(tax));
    }
  };

  const isCostCenterSelectDisable =
    (!userJobInfo?.cost_centre?.is_chargeable ||
      !userJobInfo?.cost_centre?.is_active) &&
    configuration?.is_default_to_employee_cost_centre &&
    configuration?.is_default_to_entity_cost_centre &&
    !benefitClaimId
      ? true
      : false;

  if (
    isAdminEdit &&
    !viewOnly &&
    Object.keys(fetchedBenefitClaimData).length !== 0
  ) {
    const code = fetchedBenefitClaimData?.workflow_status?.code;
    const permission = isActionAllowed(
      'ACTION_ADMIN_UPDATE_BENEFITS',
      fetchedBenefitClaimData?.employee?.id,
    );

    restrictUser =
      permission &&
      (code === 'APPRVD' || code === 'PENDNG' || code === 'STALED');
  } else {
    restrictUser = true;
  }
  const result = (
    <ErrorBoundary>
      {!viewOnly && (
        <FilterBar
          tips={
            !configuration?.instruction_text
              ? ['No Instructions']
              : [configuration?.instruction_text]
          }
          isAddButton={false}
          tipsObject={benefitEntitledConfig || {}}
          enableBackBtn={isAdminEdit}
          backBtnUrl={location?.state?.backButtonUrl || undefined}
        />
      )}
      {selectedBenefitTypeLoader && fetchedBenefitClaimDataLoader ? (
        <GetSkeleton />
      ) : (
        <Row gutter={[24, 24]} className='add-benefit-form-container'>
          <Col xl={15}>
            <Form name='addNewBenefitForm' {...formProps}>
              <Row gutter={[16, 16]}>
                {!viewOnly && configuration?.id && benefitClaimId && (
                  <Col xs={24}>
                    <Form.Item name='claim_number' label='Benefit Claim Number'>
                      <Input disabled={true} width={40} />
                    </Form.Item>
                  </Col>
                )}
                <Col xxl={16} xl={16} md={12} lg={12} sm={24} xs={24}>
                  {(viewOnly || benefitClaimId) && (
                    <>
                      <Form.Item
                        validateStatus={
                          backendError.hasOwnProperty(
                            'benefit_type_legal_entity',
                          )
                            ? 'error'
                            : 'validating'
                        }
                        help={
                          backendError.hasOwnProperty(
                            'benefit_type_legal_entity',
                          )
                            ? backendError.benefit_type_legal_entity[0]
                            : null
                        }
                      >
                        <label>
                          {labelMapping?.benefit_type
                            ? labelMapping?.benefit_type.mapped
                            : 'Benefit Type'}
                        </label>
                        <Input
                          className={`${!viewOnly ? 'benefit-type-label' : ''}`}
                          value={
                            fetchedBenefitClaimData?.benefit_type_legal_entity
                              ?.benefit_type?.title
                          }
                          disabled={true}
                        />
                      </Form.Item>
                    </>
                  )}
                  {!viewOnly && !benefitClaimId && (
                    <>
                      <Form.Item
                        className='benefit-types-dropdown'
                        name='benefit_entitlement'
                        label={
                          labelMapping?.benefit_type
                            ? labelMapping?.benefit_type.mapped
                            : 'Benefit Type'
                        }
                        required={!viewOnly}
                        validateStatus={
                          backendError.hasOwnProperty(
                            'benefit_type_legal_entity',
                          )
                            ? 'error'
                            : 'validating'
                        }
                        help={
                          backendError.hasOwnProperty(
                            'benefit_type_legal_entity',
                          )
                            ? backendError.benefit_type_legal_entity[0]
                            : null
                        }
                        rules={[
                          {
                            required: !viewOnly,
                            message: 'Benefit Type is Mandatory',
                          },
                        ]}
                      >
                        <Select
                          showSearch={true}
                          filterOption={(input: any, option: any) =>
                            option.children
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) >= 0
                          }
                          onChange={(value: number) => {
                            selectedBenefitTypeHandler(value);
                          }}
                          loading={
                            selectedBenefitTypeLoader ||
                            benefitEntitledListLoader
                          }
                          disabled={
                            benefitEntitledList.length === 0
                              ? true
                              : selectedBenefitTypeLoader ||
                                benefitEntitledListLoader ||
                                viewOnly ||
                                benefitClaimId ||
                                isAdminEdit
                          }
                        >
                          {benefitEntitledList &&
                            benefitEntitledList.map((benefitType: any) => (
                              <Option
                                key={benefitType.id}
                                value={benefitType.id}
                              >
                                {benefitType.benefit_type.title}
                              </Option>
                            ))}
                        </Select>
                      </Form.Item>
                      {benefitEntitledList.length === 0 &&
                        benefitEntitledList.length < 0 &&
                        !benefitClaimId &&
                        !benefitEntitledListLoader && (
                          <div>User is not eligible for this Benefit Type</div>
                        )}
                    </>
                  )}
                </Col>

                {configuration?.id && (
                  <>
                    <Col xxl={8} xl={8} md={12} lg={12} sm={24} xs={24}>
                      {viewOnly ? (
                        <>
                          <label>
                            {labelMapping?.receipt_date
                              ? labelMapping?.receipt_date.mapped
                              : 'Benefit Date'}
                          </label>
                          <Input
                            value={fetchedBenefitClaimData.date}
                            disabled={true}
                          />
                        </>
                      ) : (
                        <>
                          <Form.Item
                            name='date'
                            label={
                              labelMapping?.receipt_date
                                ? labelMapping?.receipt_date.mapped
                                : 'Benefit Date'
                            }
                            required={!viewOnly}
                            validateStatus={
                              backendError.hasOwnProperty('date')
                                ? 'error'
                                : 'validating'
                            }
                            help={
                              backendError.hasOwnProperty('date')
                                ? backendError.date[0]
                                : null
                            }
                            rules={[
                              {
                                required: !viewOnly,
                                message: 'Receipt Date is Mandatory',
                              },
                            ]}
                          >
                            <DatePicker
                              disabledDate={disabledDate}
                              format='DD/MM/YYYY'
                              onChange={value => {
                                value && onDateValueChange(value);
                              }}
                            />
                          </Form.Item>
                          {scannedReceiptDate?.length > 0 &&
                            is_enabled_ocr &&
                            scannedReceiptDate.map((item: any) => (
                              <Tag
                                color='processing'
                                className='scanned-receipt-data'
                                onClick={(event: any) => {
                                  event.preventDefault();
                                  item && scannedDateClickedHandler(item);
                                }}
                              >
                                {item}
                              </Tag>
                            ))}
                        </>
                      )}
                    </Col>
                    {configuration?.is_allow_flexible_benefit && (
                      <Col xs={24}>
                        {viewOnly ? (
                          <>
                            <label>
                              {labelMapping?.benefit_category
                                ? labelMapping?.benefit_category
                                : 'Benefit Category'}
                            </label>
                            <Input
                              value={
                                benefitCategory?.find(
                                  (category: any) =>
                                    category.id ===
                                    fetchedBenefitClaimData.benefit_category.id,
                                )?.title
                              }
                              disabled={true}
                            />
                          </>
                        ) : (
                          <Form.Item
                            name='benefit_category'
                            label={
                              labelMapping?.benefit_category
                                ? labelMapping?.benefit_category.mapped
                                : 'Benefit Category'
                            }
                            required={!viewOnly}
                            validateStatus={
                              backendError.hasOwnProperty('benefit_category')
                                ? 'error'
                                : backendWarning.hasOwnProperty(
                                    'benefit_category',
                                  )
                                ? 'warning'
                                : 'validating'
                            }
                            help={
                              backendError.hasOwnProperty('benefit_category')
                                ? backendError.benefit_category[0]
                                : backendWarning.hasOwnProperty(
                                    'benefit_category',
                                  )
                                ? backendWarning.benefit_category[0]
                                : null
                            }
                            rules={[
                              {
                                required: !viewOnly,
                                message: 'Benefit Category is Mandatory',
                              },
                            ]}
                          >
                            <Select
                              showSearch={true}
                              filterOption={(input: any, option: any) =>
                                option.children
                                  .toLowerCase()
                                  .indexOf(input.toLowerCase()) >= 0
                              }
                              onChange={(value: any) =>
                                benefitCategoryChangeHandler(value)
                              }
                            >
                              {benefitCategory?.map((o: any) => {
                                return (
                                  <Option key={o.id} value={o.id}>
                                    {o.title}
                                  </Option>
                                );
                              })}
                            </Select>
                          </Form.Item>
                        )}
                      </Col>
                    )}

                    {configuration?.is_dependent_benefit && (
                      <>
                        <Col xs={12}>
                          {viewOnly ? (
                            <>
                              <label>
                                {labelMapping?.dependent_relationships
                                  ? labelMapping?.dependent_relationships
                                  : 'Dependent Relationship'}
                              </label>
                              <Input
                                value={
                                  benefitCategory?.find(
                                    (category: any) =>
                                      category.uuid ===
                                      fetchedBenefitClaimData
                                        .dependent_relationships.uuid,
                                  )?.title
                                }
                                disabled={true}
                              />
                            </>
                          ) : (
                            <Form.Item
                              name='dependent_uuid'
                              label={
                                labelMapping?.dependent_uuid
                                  ? labelMapping?.dependent_uuid.mapped
                                  : 'Dependent Name'
                              }
                              required={!viewOnly}
                              validateStatus={
                                backendError.hasOwnProperty('dependent_uuid')
                                  ? 'error'
                                  : backendWarning.hasOwnProperty(
                                      'dependent_uuid',
                                    )
                                  ? 'warning'
                                  : 'validating'
                              }
                              help={
                                backendError.hasOwnProperty('dependent_uuid')
                                  ? backendError.dependent_uuid[0]
                                  : backendWarning.hasOwnProperty(
                                      'dependent_uuid',
                                    )
                                  ? backendWarning.dependent_uuid[0]
                                  : null
                              }
                              rules={[
                                {
                                  required: !viewOnly,
                                  message:
                                    'Dependent Relationship is Mandatory',
                                },
                              ]}
                            >
                              <Select
                                showSearch={true}
                                filterOption={(input: any, option: any) => {
                                  return (
                                    option?.children
                                      ?.toLowerCase()
                                      .indexOf(input.toLowerCase()) >= 0
                                  );
                                }}
                                loading={benefitDependentInfoLoader}
                                disabled={benefitDependentInfo.length === 0}
                                onChange={(value: any) =>
                                  dependentRelationsChangeHandler(value)
                                }
                              >
                                {benefitDependentInfo?.map((o: any) => {
                                  const info = `${o.first_name} ${
                                    o.last_name
                                  } (${moment(
                                    o.date_of_birth,
                                    'DD/MM/YYYY',
                                  ).fromNow(true)})`;
                                  return (
                                    <Option key={o.uuid} value={o.uuid}>
                                      {info}
                                    </Option>
                                  );
                                })}
                              </Select>
                            </Form.Item>
                          )}
                        </Col>
                        <Col xs={12}>
                          <>
                            <label>
                              {labelMapping?.dependent_relationships
                                ? labelMapping?.dependent_relationships
                                : 'Relationship'}
                            </label>
                            <Input
                              className={viewOnly ? '' : 'dependent-Label'}
                              value={
                                benefitDependentRelationship?.relationship
                                  ?.title || ''
                              }
                              disabled={true}
                            />
                          </>
                        </Col>
                      </>
                    )}
                    {configuration?.allow_remark && (
                      <Col xs={24}>
                        {viewOnly ? (
                          <>
                            <label>
                              {labelMapping?.purpose
                                ? labelMapping?.purpose.mapped
                                : 'Purpose'}
                            </label>
                            <Input
                              value={fetchedBenefitClaimData?.purpose}
                              disabled={true}
                            />
                          </>
                        ) : (
                          <Form.Item
                            name='purpose'
                            label={
                              labelMapping?.purpose
                                ? labelMapping?.purpose.mapped
                                : 'Purpose'
                            }
                            className='no-receipt-remark'
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
                            required={
                              configuration?.is_remark_mandatory || false
                            }
                            rules={[
                              {
                                required:
                                  configuration?.is_remark_mandatory || false,
                                message: 'Purpose is Mandatory',
                              },
                              () => ({
                                validator(_, value) {
                                  const val = value?.trim();
                                  if (val) {
                                    if (
                                      !new RegExp(/^[^@!=\-+#﹘—⸺⸻].*$/).test(
                                        val,
                                      )
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
                              disabled={isAdminEdit}
                              onChange={(event: any) => {
                                _addUpdateFormData(
                                  'purpose',
                                  event.target.value,
                                );
                              }}
                            />
                          </Form.Item>
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
                      {viewOnly ? (
                        <>
                          <label>
                            {labelMapping?.currency
                              ? labelMapping?.currency.mapped
                              : 'Currency'}
                          </label>
                          <Input
                            value={`${fetchedBenefitClaimData.currency.currency.title}(${fetchedBenefitClaimData.currency.currency.code})`}
                            disabled={true}
                          />
                        </>
                      ) : (
                        <>
                          <Form.Item
                            className='currency-dropdown'
                            name='currency'
                            label={
                              labelMapping?.currency
                                ? labelMapping?.currency.mapped
                                : 'Currency'
                            }
                            required={true}
                            rules={[
                              {
                                required: true,
                                message: 'Currency is Mandatory',
                              },
                            ]}
                          >
                            <Select
                              showSearch={true}
                              filterOption={(input: any, option: any) =>
                                option.children
                                  .toLowerCase()
                                  .indexOf(input.toLowerCase()) >= 0
                              }
                              disabled={!configuration?.is_allow_forex}
                              onChange={(value: number) => {
                                currencyChangeHandler(value);
                              }}
                            >
                              {currencies.map((o: any) => {
                                return (
                                  <Option key={o.id} value={o.id}>
                                    {`${o?.currency?.title} (${o?.currency?.code})`}
                                  </Option>
                                );
                              })}
                            </Select>
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
                        </>
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
                      {viewOnly ? (
                        <>
                          <label>
                            {labelMapping?.amount
                              ? labelMapping?.amount.mapped
                              : 'Claim Amount'}
                          </label>
                          <Input
                            value={Number(
                              fetchedBenefitClaimData.amount,
                            ).toFixed(2)}
                            disabled={true}
                          />
                        </>
                      ) : (
                        <>
                          <Form.Item
                            name='amount'
                            label={
                              labelMapping?.amount
                                ? labelMapping?.amount.mapped
                                : 'Claim Amount'
                            }
                            validateStatus={
                              backendError.hasOwnProperty('amount')
                                ? 'error'
                                : 'validating'
                            }
                            help={
                              backendError.hasOwnProperty('amount')
                                ? backendError.amount[0]
                                : null
                            }
                            rules={[
                              {
                                required: true,
                                message: 'Currency is Mandatory',
                              },
                            ]}
                          >
                            <InputNumber
                              precision={2}
                              maxLength={15}
                              style={{ width: '100%' }}
                              onChange={(value: any) => {
                                isTaxAmountTouched = false;
                                initialLoad = false;
                                isConversionRateTouched = true;
                                _addUpdateFormData('amount', value);
                              }}
                            />
                          </Form.Item>

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
                        </>
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
                        {viewOnly ? (
                          <>
                            <label>
                              {labelMapping?.payable_amount
                                ? labelMapping?.payable_amount.mapped
                                : 'Payable Amount'}
                            </label>
                            <Input
                              value={Number(
                                fetchedBenefitClaimData.amount_before_conversion,
                              ).toFixed(2)}
                              disabled={true}
                            />
                          </>
                        ) : (
                          <Form.Item
                            label={
                              labelMapping?.payable_amount
                                ? labelMapping?.payable_amount.mapped
                                : 'Payable Amount'
                            }
                          >
                            <div className='prefix-currency'>
                              {selectedBenefitType !== null && (
                                <span
                                  className='prefix-value'
                                  title={`${selectedBenefitType?.legal_entity
                                    ?.currency?.currency?.title || ''} (${
                                    selectedBenefitType?.legal_entity?.currency
                                      ?.country.title
                                  })`}
                                >
                                  {selectedBenefitType?.legal_entity?.currency
                                    ?.currency?.code || ''}
                                </span>
                              )}
                              <div className='prefix-main-element'>
                                <Form.Item name='payable_amount'>
                                  <InputNumber
                                    precision={2}
                                    maxLength={15}
                                    style={{ width: '100%' }}
                                    disabled={true}
                                  />
                                </Form.Item>
                              </div>
                            </div>
                          </Form.Item>
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
                        {viewOnly ? (
                          <>
                            <div className='default-value-benefit-btn-parent'>
                              <label>
                                {labelMapping?.conversion_rate
                                  ? labelMapping?.conversion_rate.mapped
                                  : 'Conversion Rate'}
                              </label>
                              <Tooltip
                                title={Number(
                                  fetchedBenefitClaimData.system_conversion_rate,
                                ).toFixed(2)}
                                trigger='click'
                                placement='top'
                                className='default-value-benefit-link-btn default-value-benefit-link-btn-detail'
                                overlayClassName='default-value-tooltip'
                              >
                                <Button type='link'>Default</Button>
                              </Tooltip>
                            </div>
                            <Input
                              value={Number(
                                fetchedBenefitClaimData.conversion_rate,
                              ).toFixed(2)}
                              disabled={true}
                            />
                          </>
                        ) : (
                          <Form.Item
                            name='conversion_rate'
                            className='benefit-conversion-rate-field'
                            label={
                              <div className='default-value-benefit-btn-parent'>
                                <span>
                                  {labelMapping?.conversion_rate
                                    ? labelMapping?.conversion_rate.mapped
                                    : 'Conversion Rate'}
                                </span>
                                <Tooltip
                                  title={
                                    Number(defaultConversionRate || 1).toFixed(
                                      5,
                                    ) || 1
                                  }
                                  trigger='click'
                                  placement='top'
                                  className='default-value-benefit-link-btn'
                                  overlayClassName='default-value-tooltip'
                                >
                                  <Button type='link'>Default</Button>
                                </Tooltip>
                              </div>
                            }
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
                                message: 'Currency is Mandatory',
                              },
                            ]}
                          >
                            <InputNumber
                              precision={5}
                              maxLength={15}
                              style={{ width: '100%' }}
                              onChange={(value: any) => {
                                initialLoad = false;
                                isConversionRateTouched = true;
                                _addUpdateFormData('conversion_rate', value);
                              }}
                              disabled={
                                !configuration?.is_forex_rate_editable_by_employee
                              }
                            />
                          </Form.Item>
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
                        {viewOnly ? (
                          <>
                            <label>
                              {labelMapping?.converted_amount
                                ? labelMapping?.converted_amount.mapped
                                : 'Converted Amount'}
                            </label>
                            <Input
                              value={Number(
                                fetchedBenefitClaimData.converted_amount,
                              ).toFixed(2)}
                              disabled={true}
                            />
                          </>
                        ) : (
                          <Form.Item
                            label={
                              <div
                                style={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                }}
                              >
                                <span>
                                  {labelMapping?.converted_amount
                                    ? labelMapping?.converted_amount.mapped
                                    : 'Converted Amount'}
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
                            <div className='prefix-currency'>
                              {selectedBenefitType !== null && (
                                <span
                                  className='prefix-value'
                                  title={`${selectedBenefitType?.legal_entity
                                    ?.currency?.currency?.title || ''} (${
                                    selectedBenefitType?.legal_entity?.currency
                                      ?.country.title
                                  })`}
                                >
                                  {selectedBenefitType?.legal_entity?.currency
                                    ?.currency?.code || ''}
                                </span>
                              )}
                              <div className='prefix-main-element'>
                                <Form.Item
                                  name='converted_amount'
                                  validateStatus={
                                    backendError.hasOwnProperty(
                                      'converted_amount',
                                    )
                                      ? 'error'
                                      : 'validating'
                                  }
                                  help={
                                    backendError.hasOwnProperty(
                                      'converted_amount',
                                    )
                                      ? backendError.converted_amount[0]
                                      : null
                                  }
                                >
                                  <InputNumber
                                    precision={2}
                                    maxLength={15}
                                    style={{ width: '100%' }}
                                    disabled={true}
                                    onChange={(value: any) => {
                                      _addUpdateFormData(
                                        'converted_amount',
                                        value,
                                      );
                                    }}
                                  />
                                </Form.Item>
                              </div>
                            </div>
                          </Form.Item>
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
                      {viewOnly ? (
                        <>
                          <div className='default-value-benefit-btn-parent'>
                            <label>
                              {labelMapping?.tax_amount
                                ? labelMapping?.tax_amount.mapped
                                : 'Tax Amount'}
                            </label>
                            <Tooltip
                              title={Number(
                                fetchedBenefitClaimData.system_tax_amount,
                              ).toFixed(2)}
                              trigger='click'
                              placement='top'
                              className='default-value-benefit-link-btn default-value-benefit-link-btn-detail'
                              overlayClassName='default-value-tooltip'
                            >
                              <Button type='link'>Default</Button>
                            </Tooltip>
                          </div>
                          <Input
                            value={Number(
                              fetchedBenefitClaimData.tax_amount,
                            ).toFixed(2)}
                            disabled={true}
                          />
                        </>
                      ) : (
                        <>
                          <Form.Item
                            label={
                              <div className='default-value-benefit-btn-parent'>
                                <span>
                                  {labelMapping?.tax_amount
                                    ? labelMapping?.tax_amount.mapped
                                    : 'Tax Amount'}
                                </span>
                                <Tooltip
                                  title={defaultTax}
                                  trigger='click'
                                  placement='top'
                                  className='default-value-benefit-link-btn'
                                  overlayClassName='default-value-tooltip'
                                >
                                  <Button type='link'>Default</Button>
                                </Tooltip>
                              </div>
                            }
                          >
                            <div className='prefix-currency'>
                              {selectedBenefitType !== null && (
                                <span
                                  className='prefix-value'
                                  title={`${selectedBenefitType?.legal_entity
                                    ?.currency?.currency?.title || ''} (${
                                    selectedBenefitType?.legal_entity?.currency
                                      ?.country.title
                                  })`}
                                >
                                  {selectedBenefitType?.legal_entity?.currency
                                    ?.currency?.code || ''}
                                </span>
                              )}
                              <div className='prefix-main-element'>
                                <Form.Item
                                  name='tax_amount'
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
                                >
                                  <InputNumber
                                    precision={2}
                                    maxLength={15}
                                    style={{ width: '100%' }}
                                    onChange={(value: any) => {
                                      isTaxAmountTouched = true;
                                      initialLoad = false;

                                      _addUpdateFormData('tax_amount', value);
                                    }}
                                    disabled={
                                      !configuration?.is_allow_updating_tax_amount
                                    }
                                  />
                                </Form.Item>
                              </div>
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
                        </>
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
                      {viewOnly ? (
                        <>
                          <label>
                            {labelMapping?.amount_before_taxes
                              ? labelMapping?.amount_before_taxes.mapped
                              : 'Amount Before Taxes'}
                          </label>
                          <Input
                            value={Number(
                              fetchedBenefitClaimData.amount_before_taxes,
                            ).toFixed(2)}
                            disabled={true}
                          />
                        </>
                      ) : (
                        <Form.Item
                          label={
                            labelMapping?.amount_before_taxes
                              ? labelMapping?.amount_before_taxes.mapped
                              : 'Amount Before Taxes'
                          }
                        >
                          <div className='prefix-currency'>
                            {selectedBenefitType !== null && (
                              <span
                                className='prefix-value'
                                title={`${selectedBenefitType?.legal_entity
                                  ?.currency?.currency?.title || ''} (${
                                  selectedBenefitType?.legal_entity?.currency
                                    ?.country.title
                                })`}
                              >
                                {selectedBenefitType?.legal_entity?.currency
                                  ?.currency?.code || ''}
                              </span>
                            )}
                            <div className='prefix-main-element'>
                              <Form.Item
                                name='amount_before_taxes'
                                validateStatus={
                                  backendError.hasOwnProperty(
                                    'amount_before_taxes',
                                  )
                                    ? 'error'
                                    : 'validating'
                                }
                                help={
                                  backendError.hasOwnProperty(
                                    'amount_before_taxes',
                                  )
                                    ? backendError.amount_before_taxes[0]
                                    : null
                                }
                              >
                                <InputNumber
                                  precision={2}
                                  maxLength={15}
                                  style={{ width: '100%' }}
                                  disabled={true}
                                  onChange={(value: any) => {
                                    _addUpdateFormData(
                                      'amount_before_taxes',
                                      value,
                                    );
                                  }}
                                />
                              </Form.Item>
                            </div>
                          </div>
                        </Form.Item>
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
                        {viewOnly ? (
                          <>
                            <label>
                              {labelMapping?.receipt_number
                                ? labelMapping?.receipt_number.mapped
                                : 'Receipt Number'}
                            </label>
                            <Input
                              value={
                                fetchedBenefitClaimData?.receipt
                                  ? fetchedBenefitClaimData?.receipt[0]
                                      ?.receipt_number
                                    ? fetchedBenefitClaimData?.receipt[0]
                                        ?.receipt_number
                                    : ''
                                  : ''
                              }
                              disabled={true}
                            />
                          </>
                        ) : (
                          <>
                            <Form.Item
                              name='receipt_number'
                              label={
                                labelMapping?.receipt_number
                                  ? labelMapping?.receipt_number.mapped
                                  : 'Receipt Number'
                              }
                              rules={[
                                {
                                  required:
                                    !formData.is_no_receipt &&
                                    (configuration?.is_receipt_mandatory ||
                                      formData.receipt?.length !== 0),
                                  message: 'Receipt Number is required',
                                },
                              ]}
                              required={
                                !formData.is_no_receipt &&
                                (configuration?.is_receipt_mandatory ||
                                  formData.receipt?.length !== 0)
                              }
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
                            >
                              <Input
                                disabled={formData.is_no_receipt || isAdminEdit}
                                onChange={(event: any) => {
                                  _addUpdateFormData(
                                    'receipt_number',
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
                          </>
                        )}
                      </Col>
                    )}

                    {configuration?.is_display_no_receipt_attached_field && (
                      <Col xs={6} offset={1}>
                        {viewOnly ? (
                          <>
                            <div className='no-receipt-checkbox'>
                              <Checkbox
                                value={fetchedBenefitClaimData.is_no_receipt}
                                disabled={true}
                              >
                                {labelMapping?.no_receipt
                                  ? labelMapping?.no_receipt.mapped
                                  : 'No Receipt'}
                              </Checkbox>
                            </div>
                          </>
                        ) : (
                          <Form.Item
                            name='is_no_receipt'
                            className='no-receipt-checkbox'
                          >
                            <Checkbox
                              onChange={noReceiptRemarkHandler}
                              disabled={
                                formData.receipt.length > 0 || isAdminEdit
                              }
                              defaultChecked={formData.is_no_receipt}
                            >
                              {labelMapping?.no_receipt
                                ? labelMapping?.no_receipt.mapped
                                : 'No Receipt'}
                            </Checkbox>
                          </Form.Item>
                        )}
                      </Col>
                    )}
                    {formData.is_no_receipt && (
                      <Col xs={24}>
                        {viewOnly ? (
                          <>
                            <label>
                              {labelMapping?.no_receipt_remark
                                ? labelMapping?.no_receipt_remark.mapped
                                : 'No Receipt Remark'}
                            </label>
                            <Input
                              value={fetchedBenefitClaimData?.no_receipt_remark}
                              disabled={true}
                            />
                          </>
                        ) : (
                          <Form.Item
                            name='no_receipt_remark'
                            className='no-receipt-remark'
                            label={
                              labelMapping?.no_receipt_remark
                                ? labelMapping?.no_receipt_remark.mapped
                                : 'No Receipt Remark'
                            }
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
                            required={
                              configuration?.is_remark_for_no_receipt_mandatory
                            }
                            rules={[
                              {
                                required:
                                  configuration?.is_remark_for_no_receipt_mandatory,
                                message: 'No receipt remark is Mandatory',
                              },
                            ]}
                          >
                            <Input
                              disabled={isAdminEdit}
                              onChange={(event: any) => {
                                _addUpdateFormData(
                                  'no_receipt_remark',
                                  event.target.value,
                                );
                              }}
                            />
                          </Form.Item>
                        )}
                      </Col>
                    )}

                    {configuration?.is_allow_charging_to_cost_centres && (
                      <>
                        {!configuration?.is_default_to_entity_cost_centre && (
                          <Col xs={12}>
                            {viewOnly ? (
                              <>
                                <label>
                                  {labelMapping?.charge_to
                                    ? labelMapping?.charge_to.mapped
                                    : 'Charge-to'}
                                </label>
                                <Input
                                  value={
                                    fetchedBenefitClaimData?.charge_to.title
                                  }
                                  disabled={true}
                                />
                              </>
                            ) : (
                              <Form.Item
                                className='charge-to-dropdown'
                                name='charge_to'
                                label={
                                  labelMapping?.charge_to
                                    ? labelMapping?.charge_to.mapped
                                    : 'Charge-to'
                                }
                                required={true}
                                validateStatus={
                                  backendError.hasOwnProperty('charge_to')
                                    ? 'error'
                                    : 'validating'
                                }
                                help={
                                  backendError.hasOwnProperty('charge_to')
                                    ? backendError.charge_to[0]
                                    : null
                                }
                                rules={[
                                  {
                                    required: true,
                                    message: 'Charge To is Mandatory',
                                  },
                                ]}
                              >
                                <Select
                                  showSearch={true}
                                  disabled={
                                    configuration?.is_default_to_employee_cost_centre ||
                                    configuration?.is_default_to_entity_cost_centre
                                  }
                                  filterOption={(input: any, option: any) =>
                                    option.children
                                      .toLowerCase()
                                      .indexOf(input.toLowerCase()) >= 0
                                  }
                                  onChange={(value: any) =>
                                    chargeToChangeHandler(value)
                                  }
                                >
                                  {chargeTo.map((o: any) => {
                                    const isDisabled = isDisableChargeTo(
                                      o.code,
                                    );
                                    return (
                                      <Option
                                        key={o.code}
                                        value={o.code}
                                        disabled={isDisabled}
                                      >
                                        {o.title}
                                      </Option>
                                    );
                                  })}
                                </Select>
                              </Form.Item>
                            )}
                          </Col>
                        )}
                        {formData.charge_to === 'THIRD' ? (
                          <Col xs={12}>
                            {viewOnly ? (
                              <>
                                <label>
                                  {labelMapping?.third_party_vendor
                                    ? labelMapping?.third_party_vendor.mapped
                                    : 'Third Party Vendor'}
                                </label>
                                <Input
                                  value={
                                    fetchedBenefitClaimData?.third_party_vendor
                                  }
                                  disabled={true}
                                />
                              </>
                            ) : (
                              <Form.Item
                                name='third_party_vendor'
                                label={
                                  labelMapping?.third_party_vendor
                                    ? labelMapping?.third_party_vendor.mapped
                                    : 'Third Party Vendor'
                                }
                                required={true}
                                validateStatus={
                                  backendError.hasOwnProperty(
                                    'third_party_vendor',
                                  )
                                    ? 'error'
                                    : 'validating'
                                }
                                help={
                                  backendError.hasOwnProperty(
                                    'third_party_vendor',
                                  )
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
                                    _addUpdateFormData(
                                      'third_party_vendor',
                                      event.target.value,
                                    );
                                  }}
                                />
                              </Form.Item>
                            )}
                          </Col>
                        ) : (
                          <Col xs={12}>
                            {viewOnly ? (
                              <>
                                <label>
                                  {labelMapping?.cost_centre
                                    ? labelMapping?.cost_centre.mapped
                                    : 'Cost Center'}
                                </label>
                                <Input
                                  value={
                                    fetchedBenefitClaimData?.cost_centre?.title
                                  }
                                  disabled={true}
                                />
                              </>
                            ) : (
                              <Form.Item
                                className='cost-center-dropdown'
                                name='cost_centre_uuid'
                                label={
                                  labelMapping?.cost_centre
                                    ? labelMapping?.cost_centre.mapped
                                    : 'Cost Center'
                                }
                                required={true}
                                rules={[
                                  {
                                    required: true,
                                    message: 'Cost Center is Mandatory',
                                  },
                                ]}
                                validateStatus={
                                  backendError.hasOwnProperty(
                                    'cost_centre_uuid',
                                  )
                                    ? 'error'
                                    : 'validating'
                                }
                                help={
                                  backendError.hasOwnProperty(
                                    'cost_centre_uuid',
                                  )
                                    ? backendError.cost_centre_uuid[0]
                                    : isCostCenterSelectDisable
                                    ? 'Default Cost Center is Either Inactive Or Not Chargeable'
                                    : null
                                }
                              >
                                {isCostCenterSelectDisable ||
                                  configuration?.is_default_to_entity_cost_centre}
                                {isCostCenterSelectDisable ||
                                configuration?.is_default_to_entity_cost_centre ? (
                                  <Input
                                    value={
                                      benefitClaimId
                                        ? fetchedBenefitClaimData?.cost_centre
                                            ?.title ||
                                          'Default Cost Center is Either Inactive Or Not Chargeable'
                                        : configuration?.le_cost_centre
                                            ?.title ||
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
                                    value={formData.cost_centre_uuid}
                                    disabled={
                                      configuration?.is_default_to_employee_cost_centre ||
                                      configuration?.is_default_to_entity_cost_centre
                                    }
                                    filterOption={(input: any, option: any) =>
                                      option.children
                                        .toLowerCase()
                                        .indexOf(input.toLowerCase()) >= 0
                                    }
                                    onChange={(value: any) => {
                                      _addUpdateFormData(
                                        'cost_centre_uuid',
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
                            )}
                          </Col>
                        )}
                      </>
                    )}
                  </>
                )}
              </Row>
            </Form>
            {configuration?.id && (
              <div className='benefit-custom-fields'>
                <CustomFieldsForm
                  isAdmin={isAdminEdit}
                  isViewMode={viewOnly}
                  ref={customFieldRef}
                  customFields={
                    configuration?.custom_fields || {
                      fields: [],
                      layout: [],
                    }
                  }
                  formProps={commonFormProps}
                  backendError={backendError}
                />
              </div>
            )}
            {(windowSize.width as number) < 1200
              ? getReceiptAndSupportDocumentUploaderStructure({
                  configuration,
                  form,
                  formProps,
                  formData,
                  scanLoader,
                  currencies,
                  viewOnly,
                  isAdminEdit,
                  backendError,
                  selectedBenefitType,
                  foreignCurrency,
                  _addUpdateFormData,
                  receiptGallarySelectionFn,
                  is_enabled_ocr,
                  isReceiptAllowed,
                  confidence,
                  warning_msg,
                  _setScanDateAmount,
                  _scanImage,
                })
              : null}
            {!viewOnly && (
              <Row className='button-container text-right' gutter={[22, 8]}>
                <Col span={4.5}>
                  <Button
                    type={isAdminEdit ? 'primary' : 'default'}
                    disabled={!configuration?.id}
                    onClick={_ => {
                      handleSubmit('draft');
                    }}
                    loading={isDisableButton}
                  >
                    {benefitClaimId ? (
                      isAdminEdit ? (
                        <Trans>Update</Trans>
                      ) : (
                        <Trans>Update Draft</Trans>
                      )
                    ) : (
                      <Trans>Save as Draft</Trans>
                    )}
                  </Button>
                </Col>
                {!isAdminEdit && (
                  <Col span={4.5}>
                    <Button
                      type='primary'
                      disabled={!configuration?.id}
                      htmlType='submit'
                      onClick={_ => handleSubmit('approval')}
                      loading={isDisableButton}
                    >
                      <Trans>Send For Approval</Trans>
                    </Button>
                  </Col>
                )}
              </Row>
            )}
          </Col>

          {(windowSize.width as number) >= 1200
            ? getReceiptAndSupportDocumentUploaderStructure({
                configuration,
                form,
                formProps,
                scanLoader,
                formData,
                currencies,
                viewOnly,
                isAdminEdit,
                backendError,
                selectedBenefitType,
                foreignCurrency,
                _addUpdateFormData,
                receiptGallarySelectionFn,
                is_enabled_ocr,
                isReceiptAllowed,
                confidence,
                warning_msg,
                _setScanDateAmount,
                _scanImage,
              })
            : null}
        </Row>
      )}
    </ErrorBoundary>
  );

  return !restrictUser ? (
    <ErrorBoundary>
      <Result
        title={<Trans>Action Not Allowed</Trans>}
        subTitle='You are not allowed to update this request'
        icon={<StopOutlined style={{ color: '#dce6f1' }} />}
      />
    </ErrorBoundary>
  ) : (
    result
  );
};

export default connector(AddNewBenefitClaimForm);

const getReceiptAndSupportDocumentUploaderStructure = ({
  // data
  configuration,
  form,
  scanLoader,
  detailPage,
  formProps,
  currencies,
  formData,
  viewOnly,
  isAdminEdit,
  backendError,
  selectedBenefitType,
  foreignCurrency,
  isReceiptAllowed,
  is_enabled_ocr,
  confidence,
  warning_msg,
  // functions
  receiptGallarySelectionFn,
  _setScanDateAmount,
  _scanImage,
  _addUpdateFormData,
}: any) => {
  const receiptDisabledFields = configuration?.is_allow_forex
    ? []
    : ['currency'];

  const getLabelName = (
    defaultTitle: any,
    type: 'string' | 'ReactNode' | 'doc' = 'ReactNode',
  ): ReactNode => {
    if (type === 'ReactNode') {
      return (
        <GetLabelName
          defaultTitle={defaultTitle}
          configuration={configuration || null}
        />
      );
    } else if (type === 'string') {
      try {
        const objValue =
          configuration?.label_mapping[
            defaultTitle.toLowerCase().replace(/ /g, '_')
          ];
        if (objValue) {
          return objValue?.mapped;
        }
      } catch (error) {
        console.error(error);
      }
      return defaultTitle;
    } else if (type === 'doc') {
      return (
        <>
          <GetLabelName
            defaultTitle={defaultTitle}
            configuration={configuration || null}
          />
          {!viewOnly ? (
            <h5 className='ant-upload-hint'>
              <Trans>Format</Trans> : JPG , JPEG , PNG , JFIF , PDF <br />{' '}
              <Trans>Maximum File Size</Trans> : 20 MB
            </h5>
          ) : null}
        </>
      );
    }
  };
  return (
    <Col xl={{ span: 9, offset: 0 }}>
      {configuration?.id && (
        <>
          <ReceiptAndSupportDocumentUploader
            form={form}
            detailPage={detailPage}
            formProps={formProps}
            currencies={currencies}
            showReceiptComponent={configuration?.can_attach_receipts}
            receiptFormItemProps={{
              // label: configuration?.label_mapping?.receipt
              //   ? configuration?.label_mapping?.receipt.mapped
              //   : 'Receipt',
              label: getLabelName('Receipt', 'string'),
              rules: [
                {
                  required: !viewOnly
                    ? (configuration?.is_receipt_mandatory &&
                        !formData.is_no_receipt) ||
                      Boolean(formData?.receipt_number)
                    : false,
                  message: stringTemplating(
                    { label: 'Receipt' },
                    JSONData.vaidationErrors.generalForm.receipt.mandatory,
                  ),
                },
              ],
            }}
            extraUploadProps={{
              disabled: formData.is_no_receipt || viewOnly || isAdminEdit,
            }}
            // extraUploadProps={{
            //   disabled:
            //     formData.general_form.is_no_receipt || viewOnly || isAdminEdit,
            // }}
            // selectedReceipt={selectedReceipt}
            selectedReceipt={formData.receipt}
            onReceiptChange={(changeValue: [File | string] | []) => {
              // const keys: any[] = ['receipt'];
              const data: any[] = [changeValue];
              // setSelectedReceipt(data[0]);
              if (data[0].length) {
                _addUpdateFormData('receipt', data[0]);
                _addUpdateFormData('receipt_uploaded', true);
              } else {
                _addUpdateFormData('receipt', []);
                _addUpdateFormData('receipt_uploaded', false);
                _addUpdateFormData('receipt_number', '');
              }
            }}
            backendError={backendError}
            showSupportingDocument={
              configuration?.is_allow_supporting_documents
            }
            supportingDocumentFormItemProps={{
              label: getLabelName('Supporting Documents', 'doc'),
            }}
            receiptDisabledFields={receiptDisabledFields}
            disableSupportingDoc={viewOnly}
            supportingDocuments={formData.supporting_documents}
            // supportingDocuments={selectedSupportingDocs}
            supportingDocumentOnChange={(file: (File | string)[]) => {
              // _updateFormData('supporting_documents', 'general_form', file);
              _addUpdateFormData('supporting_documents', file);
            }}
            receiptGallarySelection={receiptGallarySelectionFn}
            userFieldsForReceiptGallery={{
              date: formData.date,
              baseCurrency: selectedBenefitType?.legal_entity.currency,
              foreignCurrency: foreignCurrency,
              amount: formData.amount,
              receipt_number: formData.receipt_number,
            }}
            isReceiptAllowed={isReceiptAllowed}
            _scanImage={(file: any) => file && _scanImage(file[0])}
            scanLoader={scanLoader}
            is_enabled_ocr={is_enabled_ocr}
            ocrReceivedFromGallary={() => {
              _setScanDateAmount(null, 0, '', {});
            }}
            confidence={confidence}
            warning_msg={warning_msg}
          />
        </>
      )}
    </Col>
  );
};
export { getReceiptAndSupportDocumentUploaderStructure };
