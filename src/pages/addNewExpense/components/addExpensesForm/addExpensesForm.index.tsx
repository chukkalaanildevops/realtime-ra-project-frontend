/* eslint-disable no-unused-vars */
import React, {
  memo,
  FC,
  useState,
  Dispatch,
  useEffect,
  useRef,
  ReactNode,
} from 'react';

import { useHistory, useLocation, useParams } from 'react-router-dom';

import { connect, ConnectedProps } from 'react-redux';
import {
  getCountryCurrencyList,
  stateInterface,
  isProxyPermissionAllowed,
  getIsPresentInTargetAudience,
  getSubmittedRequestDetails,
} from '../../../../shared/redux/rootReducer';
import { intialState } from '../../addNewExpense.reducer';
import moment from 'moment';
import { Trans } from '@lingui/macro';

import { Form, Row, Col, Button, Result, message } from 'antd';
import { StopOutlined } from '@ant-design/icons';
import { FormProps } from 'antd/lib/form';

import { useWindowsSize } from '../../../../shared/hooks/'; //SHARED HOOKS

import {
  CustomFieldsForm,
  FilterBar,
  ReceiptAndSupportDocumentUploader,
  ErrorBoundary,
  ViolationDetails,
} from '../../../../shared/components'; //SHARED COMPONENTS
import {
  GeneralForm,
  EntertainmentForm,
  MileageForm,
  //AllowanceForm,
  GetLabelName,
  GetSkeleton,
  PettyCashForm,
} from '..'; //LOCAL COMPONENTS

import { fetchProfileDataAPI } from '../../../../services/profile';
import { AxiosResponse } from 'axios';
import { setCurrentEmployee } from '../../../admin/admin.actions';

import {
  IvalidationError,
  IexpenseTypeList,
  Iconfiguration,
  IpostData,
  IstaffAttendeeTable,
  IGuestAttendeeTable,
  TchargeToCodesForFetch,
  IgetMileageRateProps,
  TchargeToCodes,
} from '../../addNewExpense.model';
import {
  fetchDetailConfiguration,
  fetchCoversionRate,
  sendExpenseClaimGeneralCategoryForApprovals,
  updateExpenseClaim,
  fetchCostCentreList,
  fetchMileageRate,
  fetchPettyCashManagerTransactionMeta,
  fetchTaxPercentage,
  fetchExpenseClaimViolationCheckerData,
} from '../../addNewExpense.thunk';
import {
  updateUpdateSelectedExpenseType,
  updateFormData,
  resetFormData,
  updateDefaultTaxAmount,
  updateBackendError,
  receiptDateFieldOnChange,
  updateTaxPercentageStatus,
  updateGetFormDataStatus,
  setIsViolationModalData,
} from '../../addNewExpense.actions';
import {
  setConfirmationInfo,
  resetConfirmationInfo,
} from '../../../app/app.actions';
import { IConfirmationInfo } from '../../../app/app.model';
import { appPath } from '../../../app/app.routes';
import JSONData from '../../addNewExpense.data.json';
import { delay, debounce } from 'lodash';

import PettyCashInfoContainer from '../pettyCashInfoContainer/pettyCashInfoContainer.index';

import Big from 'big.js';
import { PROXY_PERMISSIONS } from '../../../delegate/delegate.model';
import {
  getQueryParametersAsObject,
  scrollToElem,
  stringTemplating,
} from '../../../../utils/global.utils';
import Store from '../../../../shared/redux/store/store.index';
import { scanImage } from '../../../receipt/receipt.thunk';
import { setScanDateAmount } from '../../../receipt/receipt.action';
import { fetchRequestDetailsById } from '../../../submitted/submitted.thunk';

const isActionAllowed = (permissionCode: string, userId: number): boolean => {
  return getIsPresentInTargetAudience(Store.getState(), permissionCode, userId);
};

let restrictUser = true;

const mapStateToProps = (state: stateInterface) => {
  const {
    formData,
    isAdminEdit,
    disableSaveSendBtns,
    viewOnly,
    isForRequest,
    requestId,
    mode,
    updateId,
    configuration,
    expenseTypeList,
    backendError,
    activeTabKey,
    selectedExpenseType,
    userJobInfo,
    isLoading,
    expenseClaimFetchedData,
    allowanceTypes,
    taxPercentage,
    receiptDateOnChange,
    taxPercentageChange,
    getFormDataCalled,
    taxPercentageStatus,
    violationModalData,
  } = state.AddNewExpenseForm;
  const { scanLoader, isHandwritten, confidence, warning_msg } = state.receipt;
  const {
    tenantConfig,
    isEnableTrafficLightFeatureForTenantFeatures,
  } = state.configuration;
  const { currentEmployee } = state.admin;
  const requestDetails = getSubmittedRequestDetails(state);

  return {
    formData,
    isAdminEdit,
    disableSaveSendBtns,
    viewOnly,
    isForRequest,
    requestId,
    mode,
    updateId,
    configuration,
    expenseTypeList,
    requestDetails,
    allowanceTypes,
    backendError,
    activeTabKey,
    selectedExpenseType,
    userJobInfo,
    isLoading,
    expenseClaimFetchedData,
    scanLoader,
    isHandwritten,
    confidence,
    warning_msg,
    tenantConfig,
    taxPercentage,
    receiptDateOnChange,
    taxPercentageChange,
    getFormDataCalled,
    taxPercentageStatus,
    currentEmployee,
    currencies: getCountryCurrencyList(state), //currency list fro currency conversion reducer
    isPermissionAllowed: (permission: PROXY_PERMISSIONS) =>
      isProxyPermissionAllowed(state, permission),
    isEnableTrafficLightFeatureForTenantFeatures,
    violationModalData,
  };
};

const mapDisapatchToProps = (dispatch: Dispatch<any>) => {
  return {
    _fetchDetailConfiguration: (id: number, callback?: Function) =>
      dispatch(fetchDetailConfiguration(id, callback)),
    _updateUpdateSelectedExpenseType: (selectedExpenseType: IexpenseTypeList) =>
      dispatch(updateUpdateSelectedExpenseType(selectedExpenseType)),
    _fetchCoversionRate: (
      date: string,
      target: number,
      base: number,
      callback?: Function,
      _calledFrom?: string,
    ) =>
      dispatch(fetchCoversionRate(date, base, target, callback, _calledFrom)),
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
    _sendExpenseClaimGeneralCategoryForApprovals: (
      body: IpostData,
      isForAprovals: boolean,
      callback?: Function,
    ) =>
      dispatch(
        sendExpenseClaimGeneralCategoryForApprovals(
          body,
          isForAprovals,
          callback,
        ),
      ),
    _updateExpenseClaim: (
      body: IpostData,
      id: number,
      isForAprovals: boolean,
      callback?: Function,
    ) => dispatch(updateExpenseClaim(body, id, isForAprovals, callback)),
    _resetFormData: () => dispatch(resetFormData()),
    _setConfirmationInfo: (_data: IConfirmationInfo) =>
      dispatch(setConfirmationInfo(_data)),
    _resetConfirmationInfo: () => dispatch(resetConfirmationInfo()),
    _fetchCostCentreList: (
      data: TchargeToCodesForFetch,
      legalEntityUuid?: string,
      callBack?: Function,
    ) => dispatch(fetchCostCentreList(data, legalEntityUuid, callBack)),
    _fetchMileageRate: (data: IgetMileageRateProps, callBack?: Function) =>
      dispatch(fetchMileageRate(data, callBack)),
    _updateDefaultTaxAmount: (amt: number | null) =>
      dispatch(updateDefaultTaxAmount(amt)),
    _fetchPettyCashManagerTransactionMeta: (id?: number) =>
      dispatch(fetchPettyCashManagerTransactionMeta(id)),
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
    _removeDateError: (data: any) => dispatch(updateBackendError(data)),
    _removeConversionRateError: (data: any) =>
      dispatch(updateBackendError(data)),
    _fetchRequestDetails: (id: string) => dispatch(fetchRequestDetailsById(id)),
    _receiptDateOnChange: (data: any) =>
      dispatch(receiptDateFieldOnChange(data)),
    _fetchTaxPercentage: (data: any, callBack?: any) =>
      dispatch(fetchTaxPercentage(data, callBack)),
    _updateTaxPercentageStatus: (status: any) =>
      dispatch(updateTaxPercentageStatus(status)),
    _updateGetFormDataStatus: (status: any) =>
      dispatch(updateGetFormDataStatus(status)),
    _setCurrentEmployee: (employeeData: any) =>
      dispatch(setCurrentEmployee(employeeData)),
    _onClose: () =>
      dispatch(setIsViolationModalData({ visibility: false, item: null })),
    _fetchExpenseClaimViolationCheckerData: (
      body: IpostData,
      isForAprovals: boolean,
      mode: string,
      callback?: Function,
    ) => {
      dispatch(
        fetchExpenseClaimViolationCheckerData(
          body,
          isForAprovals,
          mode,
          callback,
        ),
      );
    },
  };
};

const connector = connect(mapStateToProps, mapDisapatchToProps);

let is_enabled_ocr = false;
let isTaxAmountTouched = false;

const AddNewExpenseForm: FC<ConnectedProps<typeof connector> & {
  onExpenseAddedSuccessfully?: () => void;
  onExpensesWithRequestUpdatedSuccessfully?: boolean;
}> = props => {
  const {
    configuration,
    //disableSaveSendBtns,
    mode,
    viewOnly,
    isForRequest,
    requestId,
    requestDetails,
    updateId,
    activeTabKey,
    selectedExpenseType,
    userJobInfo,
    formData,
    isAdminEdit,
    isLoading,
    expenseTypeList,
    expenseClaimFetchedData,
    currencies,
    backendError,
    confidence,
    isHandwritten,
    warning_msg,
    scanLoader,
    tenantConfig,
    _fetchDetailConfiguration,
    _updateUpdateSelectedExpenseType,
    _fetchCoversionRate,
    _updateFormData,
    _sendExpenseClaimGeneralCategoryForApprovals,
    _updateExpenseClaim,
    _setConfirmationInfo,
    _resetConfirmationInfo,
    _resetFormData,
    _fetchCostCentreList,
    _fetchPettyCashManagerTransactionMeta,
    onExpenseAddedSuccessfully,
    onExpensesWithRequestUpdatedSuccessfully,
    // _fetchMileageRate,
    _updateDefaultTaxAmount,
    isPermissionAllowed,
    _scanImage,
    _setScanDateAmount,
    _removeDateError,
    _removeConversionRateError,
    _fetchRequestDetails,
    _receiptDateOnChange,
    _fetchTaxPercentage,
    _setCurrentEmployee,
    currentEmployee,
    taxPercentage,
    taxPercentageChange,
    receiptDateOnChange,
    _updateTaxPercentageStatus,
    taxPercentageStatus,
    isEnableTrafficLightFeatureForTenantFeatures,
    violationModalData,
    _onClose,
    _fetchExpenseClaimViolationCheckerData,
  } = props;
  const windowSize = useWindowsSize();

  const params: any = useParams();
  const expenseClaimId = params.id;
  const history = useHistory();
  const location: any = useLocation();

  useEffect(() => {
    if (isForRequest) {
      requestId && _fetchRequestDetails(String(requestId));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isForRequest]);
  const [validationError, setValidationError] = useState<IvalidationError>({});
  const [
    ReceiptAndSupportDocumentUploaderVisibility,
    setReceiptAndSupportDocumentUploaderVisibility,
  ] = useState<boolean>(false);
  const [isAmountTouched, setAmountTouched] = useState<boolean>(
    mode === 'ADD' ? false : true,
  ); // while editing/cloning this will be true all time
  // const [isTaxAmountTouched, setTaxAmountTouched] = useState<boolean>(false);
  const [showMileageCustomField, setShowMileageCustomField] = useState<boolean>(
    false,
  );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [showAllowanceCustomField, setShowAllowanceCustomField] = useState<
    boolean
  >(false);
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  const [receiptGalleryDateChange, setReceiptGalleryDateChange] = useState<
    boolean
  >(false);
  const [getLocalCcLegalEntityUuid, setLocalCcLegalEntityUuid] = useState<
    string | null
  >(null);
  const [getReceiptGalleryData, setReceiptGalleryData] = useState<null | {
    keysArr: any;
    file: any;
    keys: any; // filtered keys
    data: any; // filtered key's data
  }>(null);

  let fromAdmin = getQueryParametersAsObject().mode === 'admin';
  let employeeId = fromAdmin
    ? expenseClaimFetchedData?.employee?.id
    : undefined;
  const isReceiptAllowed = isPermissionAllowed('ACTION_RECEIPT'); //ACTION_RECEIPT
  const [form] = Form.useForm();
  const customFieldRef = useRef<any>(null);
  const [isTrafficLightEnable, setIsTrafficLightEnable] = useState(false);

  const generalFormFields = [
    'expense_type_legal_entity',
    'date',
    'currency',
    'amount',
    'conversion_rate',
    'converted_amount',
    'tax_amount',
    'amount_before_taxes',
    'purpose',
    'receipt',
    'is_no_receipt',
    'no_receipt_remark',
    'cost_centre_uuid',
    'charge_to',
    'third_party_vendor',
    'custom_fields',
    'supporting_documents',
    'receipt_number',
  ];

  const formLayout = {
    labelCol: {
      span: 24,
    },
    wrapperCol: {
      span: 24,
      offset: 0,
    },
  };

  const commonFormProps: FormProps = {
    scrollToFirstError: true,
    size: 'middle',
    layout: 'horizontal',
    colon: false,
    autoComplete: 'off',
  };

  useEffect(() => {
    if (
      tenantConfig[0]?.is_enabled_traffic_lights &&
      isEnableTrafficLightFeatureForTenantFeatures
    ) {
      setIsTrafficLightEnable(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    // eslint-disable-next-line react-hooks/exhaustive-deps
    tenantConfig[0]?.is_enabled_traffic_lights,
    isEnableTrafficLightFeatureForTenantFeatures,
  ]);

  useEffect(() => {
    if (!formData.general_form.date && backendError.hasOwnProperty('date')) {
      _removeDateError({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.general_form.date]);
  useEffect(() => {
    if (
      !configuration?.is_display_no_receipt_attached_field &&
      formData.general_form.is_no_receipt
    ) {
      _updateFormData('is_no_receipt', 'general_form', false);
      _updateFormData('no_receipt_remark', 'general_form', '');
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
      (expenseClaimFetchedData?.expense_type_legal_entity
        ?.global_configuration ||
        expenseClaimFetchedData?.expense_type_legal_entity
          ?.custom_configuration) &&
      formData?.general_form?.date &&
      !receiptDateOnChange
    ) {
      // _updateTaxPercentageStatus(true)
      _fetchTaxPercentage({
        expense_type_configuration: expenseClaimFetchedData
          ?.expense_type_legal_entity?.custom_configuration
          ? expenseClaimFetchedData?.expense_type_legal_entity
              ?.custom_configuration
          : expenseClaimFetchedData?.expense_type_legal_entity
              ?.global_configuration,
        date: moment(formData?.general_form?.date).format('YYYY-MM-DD'),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData?.general_form?.date]);

  // useEffect(() => {
  //   if (receiptGalleryDateChange) {
  //     calculateAmoutUsingConversionRate(
  //       'updatePhase',
  //       String(formData.general_form.conversion_rate || 1),
  //       getReceiptGalleryData?.keysArr.includes('amount')
  //         ? Number(getReceiptGalleryData?.file?.amount)
  //         : undefined,
  //     );
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [taxPercentage, receiptGalleryDateChange]);
  // useEffect(() => {
  //   mode === 'UPDATE' &&
  //     getFormDataCalled &&
  //     _updateFormData(
  //       'tax_amount',
  //       'general_form',
  //       formData?.general_form?.tax_amount,
  //     );

  //   getFormDataCalled && _updateGetFormDataStatus(false);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [getFormDataCalled]);
  useEffect(() => {
    // taxPercentageChange
    if (!taxPercentageStatus) {
      if (mode === 'UPDATE') {
        if (taxPercentageChange) {
          calculateAmoutUsingConversionRate(
            'updatePhase',
            String(formData.general_form.conversion_rate || 1),
          );
          _updateTaxPercentageStatus(false);
        }
      } else {
        calculateAmoutUsingConversionRate(
          'updatePhase',
          String(formData.general_form.conversion_rate || 1),
        );
        _updateTaxPercentageStatus(false);
      }
    }

    // _updateDefaultTaxAmount(taxPercentage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taxPercentage, taxPercentageStatus]);
  const handleConfirmationModelOkBtn = (type: string) => {
    try {
      if (type === 'EXPENSE_CLAIM_SEND_FOR_APPROVALS') {
        history.push(`${appPath.submitted.linkTo}expense`);
      } else if (type === 'EXPENSE_CLAIM_CREATED_AND_SAVED_IN_DRAFTS')
        history.push(`${appPath.drafts.linkTo}expense`);

      _resetConfirmationInfo();
    } catch (error) {
      console.error(error);
    }
  };

  const handleConfirmationModelCancelBtn = () => {
    if (activeTabKey === 'petty') {
      _fetchPettyCashManagerTransactionMeta();
    }
    _resetFormData();
    _resetConfirmationInfo();
  };

  useEffect(() => {
    try {
      if (configuration === null)
        setReceiptAndSupportDocumentUploaderVisibility(false);
      else {
        setReceiptAndSupportDocumentUploaderVisibility(
          (configuration?.can_attach_receipts === true ||
            configuration?.is_allow_supporting_documents === true) &&
            !['mileage', 'allowance'].includes(activeTabKey || ''),
        );
      }
    } catch (error) {
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [configuration]);

  /**
   * This function return GetLabelName component
   * @param defaultTitle
   */
  const getLabelName = (
    defaultTitle: string,
    type: 'string' | 'ReactNode' = 'ReactNode',
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
          <h5 className='ant-upload-hint'>
            <Trans>Format</Trans> : JPG , JPEG , PNG , JFIF , PDF <br />{' '}
            <Trans>Maximum File Size</Trans> : 20 MB
          </h5>
        </>
      );
    }
  };

  /**
   * This effect use to update formField value on change of formData store.
   */
  const _formData_useEffectFn = () => {
    try {
      form.setFieldsValue({
        ...formData.general_form,
        ...formData.entertainment_form,
        ...formData.petty_cash_form,
      });
      if (formData.general_form.is_no_receipt) {
        form.validateFields(['receipt', 'receipt_number']);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(_formData_useEffectFn, [formData]);

  const _customFieldSetValues_useEffectFn = () => {
    try {
      if (
        customFieldRef?.current?.setValues &&
        expenseClaimFetchedData?.custom_fields?.length > 0 &&
        configuration !== null
      ) {
        // eslint-disable-next-line no-unused-expressions
        customFieldRef?.current?.setValues(
          expenseClaimFetchedData?.custom_fields,
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(_customFieldSetValues_useEffectFn, [
    customFieldRef,
    expenseClaimFetchedData,
    configuration,
  ]);

  const _selectedExpenseType_useEffectFn = () => {
    try {
      const configId = selectedExpenseType?.custom_configuration
        ? selectedExpenseType?.custom_configuration
        : selectedExpenseType?.global_configuration;

      configId &&
        _fetchDetailConfiguration(
          configId as number,
          (configData: Iconfiguration) => {
            if (!viewOnly) {
              if (mode === 'ADD') {
                form.resetFields();
                // eslint-disable-next-line no-unused-expressions
                customFieldRef?.current?.clearCustomFieldForm();
                updateInitialFormValuesBasedOnConfiguration(
                  configData,
                  selectedExpenseType,
                );

                // if (activeTabKey === 'mileage') {
                //   //fetch Mileage rate
                //   let _date;
                //   if (
                //     formData.general_form.date &&
                //     moment.isMoment(formData.general_form.date)
                //   )
                //     _date = formData.general_form.date.format('YYYY-MM-DD');
                //   else _date = moment().format('YYYY-MM-DD');

                //   _fetchMileageRate({
                //     date: _date,
                //     expense_type_configuration: configId,
                //   });
                // }
                if (configData?.is_allow_charging_to_cost_centres) {
                  if (selectedExpenseType && selectedExpenseType.legal_entity) {
                    _fetchCostCentreList(
                      'LOCAL',
                      selectedExpenseType.legal_entity.uuid,
                    );
                  } else {
                    _fetchCostCentreList('LOCAL');
                  }
                }
                _updateFormData('receipt_number', 'general_form', '');
              }
            }
          },
        );
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(_selectedExpenseType_useEffectFn, [selectedExpenseType]);

  const fetchEmployeeProfile = async () => {
    try {
      if (employeeId !== undefined) {
        const response: AxiosResponse = await fetchProfileDataAPI(employeeId);
        _setCurrentEmployee(response.data);
      }
    } catch (error) {
      message.error(error.response.data.error);
    }
  };

  useEffect(() => {
    fetchEmployeeProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employeeId]);

  /**
   * date change handler
   * calling from `handleValuesChange` function.
   */
  const dateFieldChangeHandler = (
    changedValues: any,
    key: string,
    callback?: any,
  ) => {
    const isSameBaseCurrency =
      formData.general_form.currency ===
      selectedExpenseType?.legal_entity?.currency?.id;
    _receiptDateOnChange(true);
    if (configuration !== null) {
      if (!isSameBaseCurrency && configuration?.is_allow_forex) {
        currencyFieldChangeHandler(
          { currency: formData.general_form.currency },
          'date',
          changedValues,
        );
      } else {
        if (
          changedValues?.date &&
          (selectedExpenseType?.global_configuration ||
            selectedExpenseType?.custom_configuration)
        ) {
          _updateTaxPercentageStatus(true);
          _fetchTaxPercentage(
            {
              expense_type_configuration: selectedExpenseType?.custom_configuration
                ? selectedExpenseType?.custom_configuration
                : selectedExpenseType?.global_configuration,
              date: changedValues?.date?.format('YYYY-MM-DD'),
            },
            callback,
          );
        }
      }
      isTaxAmountTouched = false;
      // if (activeTabKey === 'mileage') {
      //   const configNo = selectedExpenseType?.custom_configuration
      //     ? selectedExpenseType?.custom_configuration
      //     : selectedExpenseType?.global_configuration;
      //   if (
      //     Boolean(changedValues[key]) &&
      //     moment.isMoment(changedValues[key]) &&
      //     Boolean(configNo)
      //   )
      //     _fetchMileageRate({
      //       date: changedValues[key].format('YYYY-MM-DD'),
      //       expense_type_configuration: configNo as number,
      //     });
      // }
    }
  };

  const setWarningValidationError = (changedValues: any, fieldName: string) => {
    if (changedValues[fieldName] && configuration?.is_set_warning_amount) {
      // this code is here to set and unset amount warning.
      if (
        changedValues[fieldName] > Number(configuration?.warning_amount) &&
        changedValues[fieldName] <=
          (Number(configuration?.max_amount) || Number.MAX_SAFE_INTEGER)
      ) {
        // value beetween warning and max amount then inside this.
        !validationError.hasOwnProperty(fieldName) &&
          setValidationError((prevState: IvalidationError) => {
            const state = { ...prevState };
            state[fieldName] = [configuration?.warning_message as string];
            return state;
          });
      } else {
        // value is not beetween warning and max amount then inside this and delete key from state.
        validationError.hasOwnProperty(fieldName) &&
          setValidationError((prevState: IvalidationError) => {
            const state = { ...prevState };
            delete state[fieldName];
            return state;
          });
      }
    }
  };

  /**
   * amount change handler
   * calling from `handleValuesChange` function.
   */
  const amountFieldChangeHandler = (changedValues: any, key: string) => {
    // setTaxAmountTouched(false);
    // isTaxAmountTouched = false;
    if (!configuration?.is_allow_forex) {
      setWarningValidationError(changedValues, 'amount');
    }
    if (
      Number(changedValues.amount) <
      Number(configuration?.local_cc_threshold_amount)
    ) {
      const entityUuid =
        formData?.legal_entity_uuid && mode === 'UPDATE'
          ? formData?.legal_entity_uuid
          : userJobInfo?.top_level_legal_entity_uuid;
      setLocalCcLegalEntityUuid(entityUuid);
    } else {
      setLocalCcLegalEntityUuid(null);
    }
    calculateAmoutUsingConversionRate(
      'input-box',
      String(formData.general_form.conversion_rate || 1),
      changedValues[key],
    );
    if (mode === 'ADD') setAmountTouched(true);
  };

  /**
   * expense_type_legal_entity change handler
   * calling from `handleValuesChange` function.
   */
  const expenseTypeLegalEntityFieldChangeHandler = (
    changedValues: any,
    _key: string,
  ) => {
    const matchExpenseTypeObject: IexpenseTypeList[] = expenseTypeList.filter(
      (o: IexpenseTypeList) =>
        o.id === changedValues?.expense_type_legal_entity,
    );
    if (matchExpenseTypeObject.length) {
      _resetFormData(); //reset form values on type change.
      _updateUpdateSelectedExpenseType(matchExpenseTypeObject[0]); // other changes in Effect function -> _selectedExpenseType_useEffectFn
      setValidationError({});
      if (mode === 'ADD') setAmountTouched(false);
    }
  };

  /**
   * currency change handler
   * calling from `handleValuesChange` function.
   */
  const currencyFieldChangeHandler = (
    changedValues: any,
    key: string,
    changedDate?: any,
  ) => {
    const date = form.getFieldValue('date');
    if (moment.isMoment(date)) {
      const changedCurr = currencies.filter(
        (o: any) => o.id === changedValues.currency,
      );

      // setTaxAmountTouched(false);
      isTaxAmountTouched = false;
      _fetchCoversionRate(
        form.getFieldValue('date').format('DD-MM-YYYY'),
        selectedExpenseType?.legal_entity?.currency?.currency?.id as number,
        changedCurr[0]?.currency.id, //changedValues.currency,
        (callFrom: any, conversionRate: any) => {
          if (
            ((changedDate?.date && selectedExpenseType?.global_configuration) ||
              (changedDate?.date &&
                selectedExpenseType?.custom_configuration)) &&
            key === 'date'
          ) {
            _updateTaxPercentageStatus(true);
            _fetchTaxPercentage(
              {
                expense_type_configuration: selectedExpenseType?.custom_configuration
                  ? selectedExpenseType?.custom_configuration
                  : selectedExpenseType?.global_configuration,
                date: changedDate?.date?.format('YYYY-MM-DD'),
              },
              changedValues?.amount
                ? calculateAmoutUsingConversionRate(
                    callFrom,
                    conversionRate,
                    changedValues?.amount,
                  )
                : calculateAmoutUsingConversionRate(callFrom, conversionRate),
            );
          } else {
            changedValues?.amount
              ? calculateAmoutUsingConversionRate(
                  callFrom,
                  conversionRate,
                  changedValues?.amount,
                )
              : calculateAmoutUsingConversionRate(callFrom, conversionRate);
          }
        },
        key,
      );
      _removeConversionRateError({});
      return changedValues['currency'];
    } else {
      form.validateFields(['date']);
      //message.error('Please select date before changing currency', 5);
      return formData.general_form.currency;
    }
  };

  /**
   * convertedAmount change handler
   * calling from `handleValuesChange` function.
   */
  const convertedAmountFieldChangeHandler = () => {
    if (configuration?.is_forex_rate_editable_by_employee) {
      calculateAmoutUsingConversionRate(
        'none',
        String(formData.general_form.conversion_rate || 1),
        undefined,
        true,
      );
    }
  };

  /**
   * is_no_receipt change handler
   * calling from `handleValuesChange` function.
   */
  const isNoReceiptFieldChangeHandler = (changedValues: any, key: string) => {
    if (changedValues[key]) {
      _updateFormData('receipt_number', 'general_form', '');
    } else {
      _updateFormData('no_receipt_remark', 'general_form', '');
    }
  };

  /**
   * charge_to change handler
   * calling from `handleValuesChange` function.
   */
  const chargeToFieldChangeHandler = (changedValues: any, key: string) => {
    if (
      changedValues[key] !== formData.general_form.charge_to &&
      changedValues[key] !== 'THIRD'
    ) {
      _updateFormData(
        ['cost_centre_uuid', 'third_party_vendor'],
        'general_form',
        ['', ''],
      );
      if (
        changedValues[key] === 'LOCAL' &&
        Number(formData.general_form.amount) <
          Number(configuration?.local_cc_threshold_amount)
      ) {
        const entityUuid =
          formData?.legal_entity_uuid && mode === 'UPDATE'
            ? formData?.legal_entity_uuid
            : userJobInfo?.top_level_legal_entity_uuid;
        _fetchCostCentreList(changedValues[key], entityUuid);
      } else {
        _fetchCostCentreList(changedValues[key]);
      }

      if (changedValues[key] !== 'LOCAL') setLocalCcLegalEntityUuid(null);
    }
    form.resetFields(['cost_centre_uuid']);
  };

  /**
   * Form onChange function.
   * @param changedValues
   * @param _allValues
   */
  const handleValuesChange = (_changedValues: any, _allValues: any) => {
    try {
      const key: string = Object.keys(_changedValues)[0];
      const changedValues = { [key]: _changedValues[key] };

      switch (key) {
        case 'date':
          dateFieldChangeHandler(changedValues, key);
          break;

        case 'amount':
          isTaxAmountTouched = false;
          amountFieldChangeHandler(changedValues, key);
          return;

        case 'expense_type_legal_entity':
          expenseTypeLegalEntityFieldChangeHandler(changedValues, key);
          break;

        case 'currency':
          changedValues[key] = currencyFieldChangeHandler(changedValues, key);
          break;

        case 'conversion_rate':
          // setTaxAmountTouched(false);
          // isTaxAmountTouched = false;
          calculateAmoutUsingConversionRate(
            'conversion-rate',
            String(changedValues[key] || 1),
          );
          break;

        case 'converted_amount':
          convertedAmountFieldChangeHandler();
          break;

        case 'is_no_receipt':
          isNoReceiptFieldChangeHandler(changedValues, key);
          break;

        case 'charge_to':
          chargeToFieldChangeHandler(changedValues, key);
          break;

        case 'tax_amount':
          // !isTaxAmountTouched && setTaxAmountTouched(true);
          isTaxAmountTouched = true;
          calculateAmoutUsingConversionRate(
            'tax',
            String(formData.general_form.conversion_rate || 1),
            undefined,
            undefined,
            changedValues[key],
          );
          return;

        case 'entertainment_staff_members':
          // delay(
          //   calculateAmoutUsingConversionRate,
          //   500,
          //   String(formData.general_form.conversion_rate || 1),
          // );
          return; // to prevent redux update here( change handle is in entertainment component)

        case 'entertainment_guest_members':
          // delay(
          //   calculateAmoutUsingConversionRate,
          //   500,
          //   String(formData.general_form.conversion_rate || 1),
          // );
          return; // to prevent redux update here( change handle is in entertainment component)
      }

      if (['voucher_number'].includes(key)) {
        _updateFormData(key, 'petty_cash_form', changedValues[key]);
      } else if (generalFormFields.includes(key)) {
        _updateFormData(key, 'general_form', changedValues[key]);
      } else {
        _updateFormData(key, 'entertainment_form', changedValues[key]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const ccThresholdValidations = debounce(
    (
      amount: number,
      configData: any = configuration,
      _charge_to?: TchargeToCodes,
    ) => {
      //here we are just changing charge-to and fetching list according to the charge-to.
      // check out charge-to component from commonFormField. where i'm disabling local & overseas charge-to fields.
      if (
        configData?.is_allow_charging_to_cost_centres &&
        !configData?.is_employee_cost_centre_readonly
      ) {
        if ((_charge_to || formData.general_form.charge_to) === 'LOCAL') {
          if (amount < Number(configData?.local_cc_threshold_amount)) {
            //reset
            if (userJobInfo?.top_level_legal_entity_uuid) {
              if (
                getLocalCcLegalEntityUuid !==
                userJobInfo?.top_level_legal_entity_uuid
              ) {
                // not same legal entity
                const entityUuid =
                  formData?.legal_entity_uuid && mode === 'UPDATE'
                    ? formData?.legal_entity_uuid
                    : userJobInfo?.top_level_legal_entity_uuid;
                _fetchCostCentreList('LOCAL', entityUuid, (data: any) => {
                  let uuid =
                    mode === 'UPDATE'
                      ? data.find(
                          (item: any) =>
                            item.uuid ===
                            expenseClaimFetchedData?.cost_centre?.uuid,
                        )
                        ? expenseClaimFetchedData?.cost_centre?.uuid
                        : data[data.length - 1].uuid
                      : userJobInfo?.cost_centre?.uuid;
                  _updateFormData(['cost_centre_uuid'], 'general_form', [uuid]);
                });
                setLocalCcLegalEntityUuid(entityUuid);
              }
            } else {
              _updateFormData(['cost_centre_uuid'], 'general_form', [
                userJobInfo?.cost_centre?.uuid,
              ]);
              console.error(
                'DEV ERROR: Unable to get uuid of selected type legal entity',
              );
            }
          } else if (
            amount >= Number(configData?.local_cc_threshold_amount) &&
            getLocalCcLegalEntityUuid !== null &&
            formData.general_form.charge_to === 'LOCAL'
          ) {
            _fetchCostCentreList('LOCAL', undefined, (data: any) => {
              let uuid =
                data.find(
                  (item: any) =>
                    item.uuid === expenseClaimFetchedData?.cost_centre?.uuid,
                ) && mode === 'UPDATE'
                  ? expenseClaimFetchedData?.cost_centre?.uuid
                  : userJobInfo?.cost_centre?.uuid;

              _updateFormData(['cost_centre_uuid'], 'general_form', [uuid]);
            });
            setLocalCcLegalEntityUuid(null);
          }
        } else if (
          configData?.is_allow_overseas_cost_centres &&
          formData.general_form.charge_to === 'OVERS' &&
          amount < Number(configData?.overseas_cc_threshold_amount)
        ) {
          _fetchCostCentreList('LOCAL', undefined, (data: any) => {
            let uuid =
              data.find(
                (item: any) => item.uuid === currentEmployee?.cost_centre?.uuid,
              ) &&
              mode === 'UPDATE' &&
              isAdminEdit
                ? currentEmployee?.cost_centre?.uuid
                : userJobInfo?.cost_centre?.uuid;
            _updateFormData(['charge_to', 'cost_centre_uuid'], 'general_form', [
              'LOCAL',
              uuid,
            ]);
          });
        }
      }
    },
    500,
  );

  /**
   * This function is the call back of conversion rate api thunk function.
   * This function caculat other field value which are depende on conversion rate
   * @param conversionRate
   * @param _amount
   */
  const calculateAmoutUsingConversionRate = (
    _calledFrom: string,
    conversionRate: string,
    _amount?: number,
    _allowDaviation: boolean = false,
    _taxAmount: number = formData.general_form.tax_amount,
  ) => {
    try {
      let amount =
        typeof _amount === 'number' ? _amount : formData?.general_form?.amount;
      if (typeof amount !== 'number') {
        if (
          activeTabKey === 'entertainment' &&
          !configuration?.is_allow_updating_entertainment_claims_calculated_amount &&
          configuration?.is_entertainment_rates_defined
        ) {
          amount = 0;
        }
      }
      if (typeof amount === 'number') {
        amount = Number(amount);
        let convertedAmount = Number(form.getFieldValue('converted_amount'));
        let amountBeforeTaxes;

        let staffOrGuestCount = 0;

        formData.entertainment_form.entertainment_staff_members.forEach(
          (o: any) => {
            if (!o.is_deleted) staffOrGuestCount++;
          },
        );

        formData.entertainment_form.entertainment_guest_members.forEach(
          (o: any) => {
            if (!o.is_deleted) staffOrGuestCount++;
          },
        );

        if (
          activeTabKey === 'entertainment' &&
          (['guest', 'staff', 'staffOrGuestDelete'].includes(_calledFrom) ||
            (_calledFrom === 'date' && staffOrGuestCount > 0))
        ) {
          if (configuration?.is_entertainment_rates_defined) {
            // Amount calculation using staff rate
            let staffTotalAmount = 0;
            let staffRate = 0;

            let receiptDate = form.getFieldValue('date')
              ? form.getFieldValue('date').toDate()
              : moment().toDate();

            for (let i = 0; i < configuration.entertainment_rates.length; i++) {
              let day = configuration?.entertainment_rates[i]?.as_of_date
                .split('/')
                .map((ele: any) => parseInt(ele));
              let asOfDate = new Date(day[2], day[1] - 1, day[0]);
              if (receiptDate >= asOfDate) {
                staffRate = Number(
                  configuration.entertainment_rates[i].rate_per_staff_member ||
                    0,
                );

                break;
              }
            }

            let canUpdateExpenseAmount: boolean;

            formData.entertainment_form.entertainment_staff_members.forEach(
              (o: IstaffAttendeeTable) => {
                canUpdateExpenseAmount = isAmountTouched
                  ? mode === 'ADD'
                    ? Boolean(o.member)
                    : !o.is_deleted
                  : Boolean(o.member);
                if (canUpdateExpenseAmount) {
                  staffTotalAmount = Number(
                    Big(staffTotalAmount)
                      .add(staffRate)
                      .round(2)
                      .valueOf(),
                  );
                }
              },
            );

            // Amount calculation using guest rate
            let guestTotalAmount = 0;
            let guestRate = 0;

            for (let i = 0; i < configuration.entertainment_rates.length; i++) {
              let day = configuration?.entertainment_rates[i]?.as_of_date
                .split('/')
                .map((ele: any) => parseInt(ele));
              let asOfDate = new Date(day[2], day[1] - 1, day[0]);
              if (receiptDate >= asOfDate) {
                guestRate = Number(
                  configuration.entertainment_rates[i].rate_per_guest_member ||
                    0,
                );
                break;
              }
            }

            formData.entertainment_form.entertainment_guest_members.forEach(
              (o: IGuestAttendeeTable) => {
                canUpdateExpenseAmount = isAmountTouched
                  ? mode === 'ADD'
                    ? Boolean(o.member)
                    : !o.is_deleted
                  : Boolean(o.member);
                if (canUpdateExpenseAmount) {
                  guestTotalAmount = Number(
                    Big(guestTotalAmount)
                      .add(guestRate)
                      .round(2)
                      .valueOf(),
                  );
                }
              },
            );
            if (_calledFrom !== 'input-box') {
              amount = Number(
                Big(guestTotalAmount)
                  .add(staffTotalAmount)
                  .round(2)
                  .valueOf(),
              );
            }
          }
        }

        // converted amount calculation using conversion rate and configuration.
        convertedAmount = Number(
          Big(amount)
            .times(Number(conversionRate))
            .round(2)
            .valueOf(),
        );

        let taxAmount: any = Number(_taxAmount);

        if (configuration?.is_allow_updating_tax_amount && isTaxAmountTouched) {
          amountBeforeTaxes = Number(
            Big(convertedAmount)
              .minus(taxAmount)
              .round(2)
              .valueOf(),
          );
        } else {
          const amountBeforeTaxes_denominator = Number(
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
          taxAmount = Number(
            Big(convertedAmount)
              .minus(amountBeforeTaxes)
              .round(2)
              .valueOf(),
          );

          //['ADD', 'CLONE'].includes(mode) &&

          if (
            [
              'input-box',
              'currency',
              'staff',
              'guest',
              'staffOrGuestDelete',
              'updatePhase',
              'gallerySelection',
              'conversion-rate',
            ].includes(_calledFrom)
          ) {
            _updateDefaultTaxAmount(taxAmount);
          }
          if (!configuration?.is_auto_populate_tax_amount) {
            taxAmount = 0;
            amountBeforeTaxes = convertedAmount;
          }
        }
        if (_calledFrom !== 'tax') {
          ccThresholdValidations(
            // configuration?.is_forex_rate_editable_by_employee
            //   ? convertedAmount
            //   : amount,
            convertedAmount || 0,
          );
        }
        const updateFormNames = [
          'amount',
          'tax_amount',
          'converted_amount',
          'amount_before_taxes',
        ];
        const updateFormData = [
          amount,
          taxAmount,
          convertedAmount,
          amountBeforeTaxes,
        ];

        _updateFormData(updateFormNames, 'general_form', updateFormData);
        if (configuration?.is_allow_forex)
          setWarningValidationError(
            { converted_amount: convertedAmount },
            'converted_amount',
          );
        delay(form.validateFields, 100, [
          'amount',
          'converted_amount',
          'tax_amount',
          'amount_before_taxes',
        ]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * Get post data and put data for save for draft and send for approvals button
   */

  const getPostAndPutData = async () => {
    setShowMileageCustomField(false);
    setShowAllowanceCustomField(false);
    try {
      await form.validateFields(); //main form check

      const customFieldForm = customFieldRef?.current?.getCustomFieldFormInstance();

      if (customFieldForm) {
        try {
          await customFieldForm.validateFields();
          const postData: any = {
            ...formData.general_form,
            date: moment.isMoment(formData.general_form.date)
              ? formData.general_form.date.format('DD/MM/YYYY')
              : formData.general_form.date,
            receipt: (formData.general_form.receipt[0] || '') as any,
            custom_fields: customFieldRef?.current?.getpostData(mode),
            is_handwritten_detected: isHandwritten || false,
          };

          if (mode === 'UPDATE') {
            if (
              configuration?.is_allow_charging_to_cost_centres &&
              configuration?.is_default_to_entity_cost_centre
            ) {
              postData.cost_centre_uuid =
                expenseClaimFetchedData?.cost_centre?.uuid;
            }
          } else {
            if (
              configuration?.is_allow_charging_to_cost_centres &&
              configuration?.is_default_to_entity_cost_centre
            ) {
              postData.cost_centre_uuid = configuration?.le_cost_centre?.uuid;
            }
          }

          if (expenseClaimFetchedData?.request)
            postData.request = expenseClaimFetchedData?.request?.id;

          if (!configuration?.can_attach_receipts) {
            delete postData.is_no_receipt;
            delete postData.no_receipt_remark;
            delete postData.receipt;
            delete postData.receipt_number;
          } else {
            if (formData.general_form.receipt.length > 0) {
              delete postData.is_no_receipt;
              delete postData.no_receipt_remark;
            }
            if (formData.general_form.is_no_receipt) {
              delete postData.receipt;
              delete postData.receipt_number;
            }
            // if (
            //   typeof formData.general_form.receipt[0] === 'string' &&
            //   !configuration.is_receipt_mandatory &&
            //   expenseClaimFetchedData.mileage_records.length === 0
            // ) {
            //   delete postData.receipt;
            // }
          }

          if (configuration?.is_allow_charging_to_cost_centres) {
            if (formData.general_form.charge_to === 'THIRD')
              delete postData.cost_centre_uuid;
            else delete postData.third_party_vendor;
          } else {
            delete postData.charge_to;
            delete postData.cost_centre_uuid;
          }

          if (!configuration?.is_allow_forex) {
            delete postData.converted_amount;
          }

          if (!configuration?.is_allow_supporting_documents)
            delete postData.supporting_documents;

          if (!configuration?.is_allow_purpose) delete postData.purpose;

          if (activeTabKey === 'entertainment') {
            // postData
            if (configuration?.can_have_guest_members) {
              postData.entertainment_guest_members =
                formData.entertainment_form.entertainment_guest_members;
            }
            if (configuration?.can_have_staff_members) {
              postData.entertainment_staff_members =
                formData.entertainment_form.entertainment_staff_members;
            }
          }

          if (isForRequest) {
            postData['request'] = requestId as number;
          }

          if (mode === 'ADD' || mode === 'CLONE') {
            // Add Mode
            delete postData?.is_receipt_deleted;
          } else {
            // Update Mode
            // keep ony file objects.( not url )
            if (configuration?.is_allow_supporting_documents) {
              const remainingDoc: number[] = [];
              if (postData.supporting_documents.length > 0)
                postData.supporting_documents = postData.supporting_documents?.filter(
                  (o: any) => {
                    if (o.hasOwnProperty('uid')) return true;

                    remainingDoc.push((o as any).id);
                    return false;
                  },
                );

              postData['deleted_supporting_documents'] =
                remainingDoc.length > 0
                  ? expenseClaimFetchedData.supporting_documents
                      .filter((o: any) => !remainingDoc.includes(o.id))
                      .map((o: any) => o.id)
                  : expenseClaimFetchedData.supporting_documents.length === 0
                  ? []
                  : expenseClaimFetchedData.supporting_documents.map(
                      (o: any) => o.id,
                    );
            }

            postData.is_receipt_deleted = false;
            if (
              expenseClaimFetchedData?.receipt &&
              expenseClaimFetchedData?.receipt[0]?.file
            ) {
              if (!postData?.receipt) {
                // user removed uploaded file
                postData.is_receipt_deleted = true;
                delete postData.receipt;
                delete postData.receipt_number;
              } else if (
                postData?.receipt === expenseClaimFetchedData?.receipt[0]?.file
              ) {
                // Same file
                delete postData.receipt;
              }
              // else {
              //   // user uploaded new file
              //   delete postData.receipt;
              // }
            } else {
              if (!postData?.receipt) {
                // user don't upload any new file
                delete postData.receipt;
              }
            }

            // if (isAdminEdit) postData.isadmin = true;
          }
          if (
            !postData?.library_receipt ||
            postData?.library_receipt === null
          ) {
            // if receipt is not added from gallery.
            delete postData.library_receipt;
          } else {
            // receipt added from gallery and remove receipt key
            delete postData.receipt;
          }

          if (
            activeTabKey === 'petty' &&
            formData.petty_cash_form.voucher_number
          ) {
            postData['voucher_number'] =
              formData.petty_cash_form.voucher_number;
          }

          if (activeTabKey === 'mileage') {
            delete postData.supporting_documents;
            delete postData.receipt;
            delete postData.library_receipt;
            delete postData.receipt_number;
            delete postData.is_no_receipt;
            delete postData.no_receipt_remark;
            delete postData.amount_before_taxes;
            delete postData.tax_amount;
            postData.amount = 0;

            if (mode === 'UPDATE') {
              // expenseClaimFetchedData.mileage_records
              postData.deleted_mileage_records = [];

              expenseClaimFetchedData.mileage_records.forEach((o: any) => {
                const isdeleted = formData.mileage_form.mileage_records.some(
                  (p: any) => {
                    return Boolean(p.id === o.id);
                  },
                );
                if (!isdeleted) postData.deleted_mileage_records.push(o.id);
              });

              postData.mileage_records = formData.mileage_form.mileage_records.filter(
                (o: any) => {
                  return !Boolean(o?.id);
                },
              );
            } else {
              postData.mileage_records = formData.mileage_form.mileage_records;
            }

            formData.mileage_form.mileage_records.forEach((o: any) => {
              postData.amount = Number(
                Big(Number(postData.amount) || 0)
                  .add(Number(o.total_amount))
                  .round(2)
                  .valueOf(),
              );
            });

            postData.mileage_records = postData.mileage_records.map(
              (o: any, i: number) => {
                const position = Number(i) + 1;
                if (!o.hasOwnProperty('library_receipt')) {
                  if (Boolean(o.receipt))
                    postData['receipt_' + position] = o.receipt;
                } else if (o.hasOwnProperty('library_receipt')) {
                  postData['library_receipt_' + position] = o.library_receipt;
                }

                if (Boolean(o.supporting_documents?.length))
                  postData['supporting_documents_' + position] =
                    o.supporting_documents;
                const resultObj: any = {
                  date: o.date,
                  country_currency: o.country_currency,
                  amount: o.amount,
                  source: o.source,
                  destination: o.destination,
                  auto_calculated_mileage: o.auto_calculated_mileage,
                  is_mileage_auto: o.is_mileage_auto,
                  rate: o.rate,
                  purpose: o.purpose,
                  receipt_number: o.receipt_number,
                  toll_charges: Number(o.toll_charges).toFixed(2),
                  parking_charges: Number(o.parking_charges).toFixed(2),
                  other_charges: Number(o.other_charges).toFixed(2),
                  is_a_round_trip: o.is_a_round_trip,
                  total_amount: o.total_amount,
                  is_handwritten_detected: o.is_handwritten_detected,
                  is_no_receipt: o.is_no_receipt,
                  ...(o.is_no_receipt
                    ? { no_receipt_remark: o.no_receipt_remark || '' }
                    : ''),
                };
                if (!o.is_mileage_auto) {
                  resultObj.manually_entered_mileage =
                    o.manually_entered_mileage;
                }
                return resultObj;
              },
            );
          }

          if (activeTabKey === 'allowance') {
            delete postData.supporting_documents;
            delete postData.receipt;
            delete postData.library_receipt;
            delete postData.receipt_number;
            delete postData.is_no_receipt;
            delete postData.no_receipt_remark;
            delete postData.amount_before_taxes;
            delete postData.tax_amount;
            delete postData.conversion_rate;
            delete postData.converted_amount;
            delete postData.legal_entity_uuid;

            if (mode === 'UPDATE') {
              postData.deleted_allowance_records = [];

              expenseClaimFetchedData.allowance_records.forEach((o: any) => {
                const isdeleted = formData.allowance_form.allowance_records.some(
                  (p: any) => {
                    return Boolean(p.id === o.id);
                  },
                );
                if (!isdeleted) postData.deleted_allowance_records.push(o.id);
              });

              postData.allowance_records = formData.allowance_form.allowance_records.filter(
                (o: any) => {
                  return !Boolean(o?.id);
                },
              );
            } else {
              postData.allowance_records =
                formData.allowance_form.allowance_records;
            }

            const sumBy = (arr: any, key: any) => {
              let sum = 0;

              arr.forEach((element: any) => {
                sum = Number(
                  Big(sum)
                    .add(Number(element[key] || 0))
                    .valueOf(),
                );
              });

              return Number(
                Big(sum)
                  .round(2)
                  .valueOf(),
              );
            };
            const totalAmount = sumBy(
              formData.allowance_form.allowance_records,
              'amount',
            );
            const totalConvertedAmount = sumBy(
              formData.allowance_form.allowance_records,
              'converted_amount',
            );
            postData.amount = totalAmount;
            postData.converted_amount = totalConvertedAmount;

            postData.allowance_records = postData.allowance_records.map(
              (o: any, i: number) => {
                const position = Number(i) + 1;
                if (!o.hasOwnProperty('library_receipt')) {
                  if (Boolean(o.receipt))
                    postData['receipt_' + position] = o.receipt;
                } else if (o.hasOwnProperty('library_receipt')) {
                  postData['library_receipt_' + position] = o.library_receipt;
                }

                if (Boolean(o.supporting_documents?.length))
                  postData['supporting_documents_' + position] =
                    o.supporting_documents;

                return {
                  date: o.date,
                  location: o.location.id,
                  amount: o.amount,
                  allowance_rate: o.allowance_rate.id,
                  conversion_rate: o.conversion_rate,
                  system_conversion_rate: o.system_conversion_rate,
                  converted_amount: o.converted_amount,
                  receipt_number:
                    o.receipt_number === null ? '' : o.receipt_number,
                };
              },
            );
          }
          if (
            selectedExpenseType?.expense_entitlement ||
            expenseClaimFetchedData?.expense_entitlement
          ) {
            postData.expense_entitlement =
              selectedExpenseType?.expense_entitlement?.id ||
              expenseClaimFetchedData?.expense_entitlement;
          }
          if (activeTabKey === 'mileage') {
            postData.converted_amount = postData.amount;
          }
          return Promise.resolve(postData);
        } catch (error) {
          console.warn(error);
          setShowMileageCustomField(true);
          setShowAllowanceCustomField(true);
          // customFieldForm.scrollToField(error.errorFields[0].name[0]);
          scrollToElem(`#customForm .${error.errorFields[0].name[0]}`);
          return Promise.reject(error);
        }
      }
      return Promise.reject('Failed');
    } catch (error) {
      console.warn(error);
      // form.scrollToField(error.errorFields[0].name[0]);
      scrollToElem(`#addNewExpenseForm .${error.errorFields[0].name[0]}`);
      return Promise.reject(error);
    }
  };

  /**
   * add/update claim callbacks function'
   */
  const addExpenseClaimCallback = (isForRequest: boolean, type: string) => {
    if (isForRequest) {
      return () => {
        // customFieldRef.current.clearCustomFieldForm();
        form.resetFields();
        _resetFormData();
        _setScanDateAmount(null, 0, '', {}, null, '');

        if (onExpensesWithRequestUpdatedSuccessfully) {
          history.goBack();
        } else {
          onExpenseAddedSuccessfully && onExpenseAddedSuccessfully();
        }
      };
    } else {
      return () => {
        // customFieldRef.current.clearCustomFieldForm();
        form.resetFields();
        _resetFormData();
        _setScanDateAmount(null, 0, '', {}, null, '');
        if (type === 'drafts') {
          postCallback('EXPENSE_CLAIM_CREATED_AND_SAVED_IN_DRAFTS');
        } else {
          postCallback('EXPENSE_CLAIM_SEND_FOR_APPROVALS');
        }
      };
    }
  };

  const updateExpenseClaimCallback = (isForRequest: boolean, type: string) => {
    if (isForRequest) {
      return () => {
        // customFieldRef.current.clearCustomFieldForm();
        form.resetFields();
        _resetFormData();
        _setScanDateAmount(null, 0, '', {}, null, '');

        if (onExpensesWithRequestUpdatedSuccessfully) {
          history.push(`/${type}/expenses-with-request`);
        } else {
          onExpenseAddedSuccessfully && onExpenseAddedSuccessfully();
        }
      };
    } else {
      return () => {
        setTimeout(() => {
          _setScanDateAmount(null, 0, '', {}, null, '');

          if (isAdminEdit) history.goBack();
          else
            history.push(
              type === 'drafts'
                ? `${appPath.drafts.linkTo}expense`
                : `${appPath.submitted.linkTo}expense`,
            );
        }, 2000);
      };
    }
  };

  /**
   * Save as draft 'Button'
   */
  const handleSaveAsDrafts = async (isTrafficLightEnable: boolean) => {
    try {
      const postData = await getPostAndPutData();
      if (mode === 'ADD' || mode === 'CLONE') {
        // Add Mode
        if (isTrafficLightEnable && !isAdminEdit) {
          _fetchExpenseClaimViolationCheckerData(
            postData,
            false,
            mode,
            addExpenseClaimCallback(isForRequest, 'drafts'),
          );
        } else {
          _sendExpenseClaimGeneralCategoryForApprovals(
            postData,
            false,
            addExpenseClaimCallback(isForRequest, 'drafts'),
          );
        }
      } else {
        // Update Mode
        if (isTrafficLightEnable && !isAdminEdit) {
          _fetchExpenseClaimViolationCheckerData(
            { ...postData, instance_id: updateId },
            false,
            mode,
            updateExpenseClaimCallback(isForRequest, 'drafts'),
          );
        } else {
          _updateExpenseClaim(
            postData,
            updateId as number,
            false,
            updateExpenseClaimCallback(isForRequest, 'drafts'),
          );
        }
      }
      isTaxAmountTouched = false;
    } catch (error) {
      console.error(error);
    }
  };
  let setTaxAmount = (status: any) => {
    isTaxAmountTouched = status;
  };
  const postCallback = (type: string) => {
    try {
      _setConfirmationInfo({
        forWhat: type,
        extraInfo: '',
        okText: 'No',
        cancelText: 'Yes',
        visibility: true,
        headerText: 'Do you want to add another claim?',
        bodyText: '',
        okBtnFn: handleConfirmationModelOkBtn.bind(null, type),
        cancelBtnFn: handleConfirmationModelCancelBtn,
      });
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * Send Approval
   */
  const handleOnFinish = async (isTrafficLightEnable: boolean) => {
    try {
      const postData = await getPostAndPutData();
      if (mode === 'ADD' || mode === 'CLONE') {
        if (isTrafficLightEnable) {
          _fetchExpenseClaimViolationCheckerData(
            postData,
            true,
            mode,
            addExpenseClaimCallback(isForRequest, 'submitted'),
          );
        } else {
          _sendExpenseClaimGeneralCategoryForApprovals(
            postData,
            true,
            addExpenseClaimCallback(isForRequest, 'submitted'),
          );
        }
      } else {
        // Update Mode
        if (isTrafficLightEnable) {
          _fetchExpenseClaimViolationCheckerData(
            { ...postData, instance_id: updateId },
            true,
            mode,
            updateExpenseClaimCallback(isForRequest, 'submitted'),
          );
        } else {
          _updateExpenseClaim(
            postData,
            updateId as number,
            true,
            updateExpenseClaimCallback(isForRequest, 'submitted'),
          );
        }
      }
      isTaxAmountTouched = false;
    } catch (error) {
      console.error(error);
    }
  };

  const receiptGallarySelectionFn = (file: any, keysArr: string[]) => {
    const data: any[] = [];
    const keys: any[] = [];
    keysArr.forEach((o: string) => {
      if (file.hasOwnProperty(o)) {
        if (o === 'date') {
          data.push(moment(file[o], 'DD/MM/YYYYY'));
          keys.push(o);
        } else if (o === 'amount') {
          data.push(Number(file[o]));
          keys.push(o);
          _setScanDateAmount(null, 0, '', {}, confidence, warning_msg);
        } else if (o === 'currency') {
          data.push(file[o].id);
          keys.push(o);
        } else if (o === 'receipt_number') {
          data.push(file[o]);
          keys.push(o);
        }
      }
    });
    keys.push('library_receipt');
    data.push(file.id);
    _updateFormData(keys, 'general_form', data);
    _updateTaxPercentageStatus(true);
    form.validateFields([
      'amount',
      'currency',
      'receipt_number',
      'date',
      'converted_amount',
      'conversion_rate',
      'tax_amount',
      'amount_before_taxes',
    ]);
    setReceiptGalleryData({
      keysArr,
      file,
      keys,
      data,
    });
  };

  useEffect(() => {
    if (getReceiptGalleryData && formData.general_form.library_receipt) {
      if (getReceiptGalleryData.keys.includes('currency')) {
        if (configuration?.is_allow_forex) {
          if (getReceiptGalleryData.keys.includes('date')) {
            currencyFieldChangeHandler(
              {
                currency:
                  getReceiptGalleryData.data[
                    getReceiptGalleryData.keys.indexOf('currency')
                  ],
              },
              'date',
              {
                date: moment(
                  getReceiptGalleryData.data[
                    getReceiptGalleryData.keys.indexOf('date')
                  ],
                  'DD/MM/YYYYY',
                ),
              },
            );
          } else {
            currencyFieldChangeHandler(
              {
                currency:
                  getReceiptGalleryData.data[
                    getReceiptGalleryData.keys.indexOf('currency')
                  ],
              },
              'gallerySelection',
            );
          }
        } else if (getReceiptGalleryData.keys.includes('amount')) {
          calculateAmoutUsingConversionRate(
            'gallerySelection',
            String(formData.general_form.conversion_rate || 1),
            getReceiptGalleryData.keysArr.includes('amount')
              ? Number(getReceiptGalleryData.file?.amount)
              : undefined,
          );
        }
      } else {
        if (getReceiptGalleryData.keys.includes('amount')) {
          calculateAmoutUsingConversionRate(
            'gallerySelection',
            String(formData.general_form.conversion_rate || 1),
            getReceiptGalleryData.keysArr.includes('amount')
              ? Number(getReceiptGalleryData.file?.amount)
              : undefined,
          );
        }
      }
      if (getReceiptGalleryData.keys.includes('date')) {
        // _updateTaxPercentageStatus(true);
        _fetchTaxPercentage({
          expense_type_configuration: selectedExpenseType?.custom_configuration
            ? selectedExpenseType?.custom_configuration
            : selectedExpenseType?.global_configuration,
          date: moment(getReceiptGalleryData?.file?.date, 'DD/MM/YYYY').format(
            'YYYY-MM-DD',
          ),
        });
        setReceiptGalleryDateChange(true);
      }
      setReceiptGalleryData(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.general_form.library_receipt, getReceiptGalleryData]);

  /**
   * This function is callback function of fetchDetailConfiguration.
   * This only occure on success of getting config.
   * @param config_data :: configuration data.
   */

  const updateInitialFormValuesBasedOnConfiguration = (
    config_data: Iconfiguration,
    _selectedExpenseType?: IexpenseTypeList | null,
  ) => {
    try {
      const amountVal = null;
      const conversionRate = 1;
      const convertedAmount = amountVal
        ? Number(
            Big(amountVal)
              .times(conversionRate)
              .round(2)
              .valueOf(),
          )
        : 0;
      let amountBeforeTaxes, taxAmount;
      const amountBeforeTaxes_denominator = Number(
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

      taxAmount = Number(
        Big(convertedAmount)
          .minus(amountBeforeTaxes)
          .round(2)
          .valueOf(),
      );
      _updateDefaultTaxAmount(taxAmount);
      if (!config_data?.is_auto_populate_tax_amount) {
        taxAmount = 0;
        amountBeforeTaxes = convertedAmount;
      }

      const currency =
        selectedExpenseType !== null
          ? selectedExpenseType?.legal_entity?.currency?.id
          : _selectedExpenseType !== null
          ? _selectedExpenseType?.legal_entity?.currency?.id
          : '';

      const costCenter = config_data?.is_allow_charging_to_cost_centres
        ? config_data?.is_employee_cost_centre_readonly
          ? userJobInfo?.cost_centre?.uuid
          : ''
        : '';
      ccThresholdValidations(
        // config_data?.is_forex_rate_editable_by_employee
        //   ? convertedAmount
        //   : amountVal || 0,
        convertedAmount || 0,
        config_data,
        'LOCAL',
      );

      const currentDate = moment().format('DD/MM/YYYY');

      const updateGeneralFormDataObj = {
        date:
          activeTabKey === 'mileage' || activeTabKey === 'allowance'
            ? requestDetails
              ? moment(requestDetails?.end_date, 'DD/MM/YYYY') >
                moment(currentDate, 'DD/MM/YYYY')
                ? moment(currentDate, 'DD/MM/YYYY')
                : moment(requestDetails?.end_date, 'DD/MM/YYYY')
              : moment()
            : '',
        amount: amountVal,
        conversion_rate: conversionRate,
        converted_amount: convertedAmount,
        currency: currency,
        amount_before_taxes: amountBeforeTaxes,
        tax_amount: taxAmount,
        cost_centre_uuid: costCenter,
        purpose: intialState.formData.general_form.purpose,
        receipt: intialState.formData.general_form.receipt,
        is_no_receipt: intialState.formData.general_form.is_no_receipt,
        receipt_number: intialState.formData.general_form.receipt_number,
        no_receipt_remark: intialState.formData.general_form.no_receipt_remark,
        charge_to: intialState.formData.general_form.charge_to,
        third_party_vendor:
          intialState.formData.general_form.third_party_vendor,
        custom_fields: intialState.formData.general_form.custom_fields,
        supporting_documents:
          intialState.formData.general_form.supporting_documents,
      };

      _updateFormData(
        Object.entries(updateGeneralFormDataObj).map(o => o[0]),
        'general_form',
        Object.entries(updateGeneralFormDataObj).map(o => o[1]),
      );

      const staffAttendeeTableData = config_data?.are_staff_members_mandatory
        ? [{ member: null, emp_id: '', designation: '' }]
        : [];

      const guestAttendeeTableData = config_data?.are_guest_members_mandatory
        ? [{ member: '', organisation: '', designation: '' }]
        : [];
      _updateFormData(
        ['entertainment_staff_members', 'entertainment_guest_members'],
        'entertainment_form',
        [staffAttendeeTableData, guestAttendeeTableData],
      );
    } catch (error) {
      console.error(error);
    }
  };

  const formProps = {
    form: form,
    ...formLayout,
    onValuesChange: viewOnly ? undefined : handleValuesChange,
    ...commonFormProps,
  };

  const claimNumberVisibility: boolean = mode === 'UPDATE';
  const generalFormVisibility: boolean =
    activeTabKey !== 'mileage' && activeTabKey !== 'allowance';
  const pettyCashFormVisibility: boolean = activeTabKey === 'petty';
  const customFieldsFormVisibility: boolean =
    activeTabKey !== 'mileage' && activeTabKey !== 'allowance';
  const entertainmentFormVisibility: boolean =
    activeTabKey === 'entertainment' && configuration !== null;
  const mileageFormVisibility: boolean = activeTabKey === 'mileage';
  //const allowanceFormVisibility: boolean = activeTabKey === 'allowance';
  const addExpenseFormContainerColSize: number =
    activeTabKey === 'mileage' || activeTabKey === 'allowance' ? 24 : 15;

  if (isAdminEdit && expenseClaimFetchedData) {
    const code = expenseClaimFetchedData?.workflow_status?.code;
    const permission = isActionAllowed(
      'ACTION_ADMIN_UPDATE_EXPENSES',
      expenseClaimFetchedData?.employee?.id,
    );
    restrictUser =
      permission &&
      (code === 'APPRVD' || code === 'PENDNG' || code === 'STALED');
  } else {
    restrictUser = true;
  }

  return (
    <>
      {!restrictUser ? (
        <ErrorBoundary>
          <Result
            title='Action Not Allowed'
            subTitle='You are not allowed to update this request'
            icon={<StopOutlined style={{ color: '#dce6f1' }} />}
          />
        </ErrorBoundary>
      ) : (
        <ErrorBoundary>
          {!viewOnly && (
            <FilterBar
              tips={
                !configuration?.instruction_text
                  ? ['No Instructions']
                  : [configuration?.instruction_text]
              }
              isAddButton={false}
              enableBackBtn={isAdminEdit}
              backBtnUrl={location?.state?.backButtonUrl || undefined}
            />
          )}
          {isLoading ? <GetSkeleton /> : null}

          {pettyCashFormVisibility && (
            <PettyCashInfoContainer id={employeeId} fromAdmin={fromAdmin} />
          )}

          <Row
            gutter={[24, 24]}
            className={`add-expense-form-container ${activeTabKey} ${
              isLoading ? `hide` : ''
            } ${viewOnly ? 'view-mode' : ''}`}
          >
            <Col xl={addExpenseFormContainerColSize}>
              {/* <Col span={24} xl={15}> */}
              {claimNumberVisibility ? (
                <Row gutter={[16, 16]} className='claim-number-conatiner'>
                  <Col span={8} className='claim-number'>
                    <div className='claim-number-label'>
                      <Trans>Expense Claim No.</Trans>
                    </div>
                    <div className='claim-number-value'>
                      {expenseClaimFetchedData?.claim_number || ''}
                    </div>
                  </Col>
                </Row>
              ) : null}
              <Form name='addNewExpenseForm' {...formProps}>
                {/* --------------------------- GENERAL FORM COMPONENT --------------------------- */}
                {generalFormVisibility ? (
                  <GeneralForm
                    getLabelName={getLabelName}
                    form={form}
                    isForRequest={isForRequest}
                    requestId={String(requestId)}
                    validationError={validationError}
                    calculateAmoutUsingConversionRate={
                      calculateAmoutUsingConversionRate
                    }
                    setTaxAmount={setTaxAmount}
                    currencyFieldChangeHandler={currencyFieldChangeHandler}
                    amountFieldChangeHandler={amountFieldChangeHandler}
                    dateFieldChangeHandler={dateFieldChangeHandler}
                    expenseClaimId={expenseClaimId}
                  />
                ) : null}

                {pettyCashFormVisibility && configuration !== null ? (
                  <PettyCashForm
                    getLabelName={getLabelName}
                    backendError={backendError}
                    isAdminEdit={isAdminEdit}
                    configuration={configuration}
                    dateFieldChangeHandler={dateFieldChangeHandler}
                  />
                ) : null}
                {/* --------------------------- ENTERTAINMENT FORM COMPONENT --------------------------- */}
                {entertainmentFormVisibility ? (
                  <EntertainmentForm
                    getLabelName={getLabelName}
                    form={form}
                    calculateAmoutUsingConversionRate={
                      calculateAmoutUsingConversionRate
                    }
                    dateFieldChangeHandler={dateFieldChangeHandler}
                  />
                ) : null}
                {/* --------------------------- MILEAGE FORM COMPONENT --------------------------- */}
                {mileageFormVisibility ? (
                  <MileageForm
                    formInstance={form}
                    getLabelName={getLabelName}
                    validationError={validationError}
                    isForRequest={isForRequest}
                    requestId={String(requestId)}
                    expenseFormProps={commonFormProps}
                    ref={customFieldRef}
                    showCustomField={showMileageCustomField}
                    ccThresholdValidations={ccThresholdValidations}
                    expenseClaimId={expenseClaimId}
                    _scanImage={_scanImage}
                    setTaxAmount={setTaxAmount}
                    scanLoader={scanLoader}
                    is_enabled_ocr={is_enabled_ocr}
                    _setScanDateAmount={_setScanDateAmount}
                  />
                ) : null}
                {/* --------------------------- ALLOWANCE FORM COMPONENT --------------------------- */}
                {/* {allowanceFormVisibility ? (
                  <AllowanceForm
                    formInstance={form}
                    getLabelName={getLabelName}
                    validationError={validationError}
                    requestId={String(requestId)}
                    expenseFormProps={commonFormProps}
                    ref={customFieldRef}
                    showCustomField={showAllowanceCustomField}
                    ccThresholdValidations={ccThresholdValidations}
                  />
                ) : null} */}
              </Form>
              {/* --------------------------- CUSTOM FIELDS FORM COMPONENT --------------------------- */}
              {customFieldsFormVisibility ? (
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
              ) : null}
              {/* --------------------------- RECEIPT & SUPPORTING DOC COMPONENT --------------------------- */}
              {(windowSize.width as number) < 1200
                ? getReceiptAndSupportDocumentUploaderStructure({
                    ReceiptAndSupportDocumentUploaderVisibility,
                    form,
                    formProps,
                    configuration,
                    formData,
                    getLabelName,
                    _updateFormData,
                    viewOnly,
                    isAdminEdit,
                    selectedExpenseType,
                    receiptGallarySelectionFn,
                    mode,
                    backendError,
                    isReceiptAllowed,
                    currencies,
                    _scanImage,
                    scanLoader,
                    confidence,
                    warning_msg,
                    is_enabled_ocr,
                    _setScanDateAmount,
                  })
                : null}
              {/* --------------------------- FORM ACTION BUTTONS --------------------------- */}
              {viewOnly ? null : (
                <Row className='button-container text-right' gutter={[22, 8]}>
                  <Col span={4.5}>
                    <Button
                      type='primary'
                      ghost
                      onClick={() => handleSaveAsDrafts(isTrafficLightEnable)}
                      disabled={
                        activeTabKey === 'mileage'
                          ? !Boolean(
                              formData.mileage_form.mileage_records.length,
                            )
                          : activeTabKey === 'allowance'
                          ? !Boolean(
                              formData.allowance_form.allowance_records.length,
                            )
                          : configuration === null
                      }
                    >
                      {mode === 'UPDATE' ? (
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
                  {isAdminEdit ? null : (
                    <Col span={4.5}>
                      <Button
                        htmlType='submit'
                        type='primary'
                        onClick={() => handleOnFinish(isTrafficLightEnable)}
                        disabled={
                          activeTabKey === 'mileage'
                            ? !Boolean(
                                formData.mileage_form.mileage_records.length,
                              )
                            : activeTabKey === 'allowance'
                            ? !Boolean(
                                formData.allowance_form.allowance_records
                                  .length,
                              )
                            : configuration === null
                        }
                      >
                        <Trans>Send for Approval</Trans>
                      </Button>
                    </Col>
                  )}
                </Row>
              )}
            </Col>
            {/* --------------------------- RECEIPT & SUPPORTING DOC COMPONENT --------------------------- */}
            {(windowSize.width as number) >= 1200
              ? getReceiptAndSupportDocumentUploaderStructure({
                  ReceiptAndSupportDocumentUploaderVisibility,
                  form,
                  formProps,
                  configuration,
                  formData,
                  getLabelName,
                  _updateFormData,
                  viewOnly,
                  isAdminEdit,
                  selectedExpenseType,
                  receiptGallarySelectionFn,
                  mode,
                  backendError,
                  isReceiptAllowed,
                  currencies,
                  _scanImage,
                  scanLoader,
                  confidence,
                  warning_msg,
                  is_enabled_ocr,
                  _setScanDateAmount,
                })
              : null}
          </Row>
        </ErrorBoundary>
      )}
      {violationModalData?.visibility && (
        <ViolationDetails
          visibility={violationModalData?.visibility}
          item={violationModalData?.item}
          isEmployee={true}
          showFooter={true}
          onClose={_onClose}
          onSubmit={() => {
            if (violationModalData.isForAprovals) {
              handleOnFinish(false);
            } else {
              handleSaveAsDrafts(false);
            }
            _onClose();
          }}
          isAddExpense={true}
        />
      )}
    </>
  );
};

export const getReceiptAndSupportDocumentUploaderStructure = ({
  ReceiptAndSupportDocumentUploaderVisibility,
  form,
  formProps,
  configuration,
  formData,
  getLabelName,
  _updateFormData,
  viewOnly,
  isAdminEdit,
  selectedExpenseType,
  receiptGallarySelectionFn,
  //mode,
  backendError,
  isReceiptAllowed,
  currencies,
  _scanImage,
  scanLoader,
  confidence,
  warning_msg,
  is_enabled_ocr,
  _setScanDateAmount,
}: any) => {
  if (ReceiptAndSupportDocumentUploaderVisibility) {
    const receiptDisabledFields = configuration?.is_allow_forex
      ? []
      : ['currency'];

    // if (mode === 'UPDATE') {
    //   receiptDisabledFields.push('date');
    // }

    if (
      configuration?.category?.code === 'ENT' &&
      !configuration?.is_allow_updating_entertainment_claims_calculated_amount
    ) {
      receiptDisabledFields.push('amount');
    }

    const foreignCurrencyObjArr = currencies.filter(
      (o: any) => o.id === formData.general_form.currency,
    );
    const foreignCurrency = foreignCurrencyObjArr.length
      ? foreignCurrencyObjArr[0]
      : undefined;

    return (
      <Col xl={{ span: 9, offset: 0 }}>
        <ReceiptAndSupportDocumentUploader
          form={form}
          formProps={formProps}
          currencies={currencies}
          showReceiptComponent={configuration?.can_attach_receipts}
          receiptFormItemProps={{
            label: getLabelName('Receipt', 'string'),
            rules: [
              {
                required:
                  (configuration?.is_receipt_mandatory &&
                    !formData.general_form.is_no_receipt) ||
                  Boolean(formData.general_form?.receipt_number),
                message: stringTemplating(
                  { label: getLabelName('Receipt', 'string') },
                  JSONData.vaidationErrors.generalForm.receipt.mandatory,
                ),
              },
            ],
          }}
          extraUploadProps={{
            disabled:
              formData.general_form.is_no_receipt || viewOnly || isAdminEdit,
          }}
          selectedReceipt={formData.general_form.receipt}
          onReceiptChange={(changeValue: [File | string] | []) => {
            const keys: any[] = ['receipt'];
            const data: any[] = [changeValue];
            if (
              changeValue.length === 0 &&
              formData.general_form.library_receipt !== null
            ) {
              keys.push('library_receipt');
              data.push(null);
            }
            _updateFormData(keys, 'general_form', data);
          }}
          backendError={backendError}
          showSupportingDocument={configuration?.is_allow_supporting_documents}
          supportingDocumentFormItemProps={{
            label: getLabelName('Supporting Documents', 'doc'),
          }}
          disableSupportingDoc={viewOnly}
          supportingDocuments={formData.general_form.supporting_documents}
          supportingDocumentOnChange={(file: (File | string)[]) =>
            _updateFormData('supporting_documents', 'general_form', file)
          }
          receiptGallarySelection={receiptGallarySelectionFn}
          userFieldsForReceiptGallery={{
            date: formData.general_form.date,
            baseCurrency: selectedExpenseType?.legal_entity.currency,
            foreignCurrency: foreignCurrency,
            amount: formData.general_form.amount,
            receipt_number: formData.general_form.receipt_number,
          }}
          receiptDisabledFields={receiptDisabledFields}
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
      </Col>
    );
  } else return null;
};

export default connector(memo(AddNewExpenseForm));
