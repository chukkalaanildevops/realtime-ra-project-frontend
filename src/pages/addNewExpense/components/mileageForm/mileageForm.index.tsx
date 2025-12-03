/* eslint-disable no-const-assign */
import React, {
  FC,
  memo,
  useRef,
  useState,
  useEffect,
  Dispatch,
  forwardRef,
} from 'react';
import { connect, ConnectedProps } from 'react-redux';
import {
  getSubmittedRequestDetails,
  stateInterface,
  // getCurrencyList,
  isProxyPermissionAllowed,
} from '../../../../shared/redux/rootReducer';
import { PROXY_PERMISSIONS } from '../../../delegate/delegate.model';
import {
  Form,
  Input,
  DatePicker,
  Row,
  Col,
  InputNumber,
  Checkbox,
  Button,
  Table,
  message,
  Alert,
  Tooltip,
  Select,
  Tag,
} from 'antd';
import {
  PlusOutlined,
  CopyOutlined,
  DeleteOutlined,
  EllipsisOutlined,
  PaperClipOutlined,
  UpOutlined,
  DownOutlined,
  FullscreenOutlined,
  EditOutlined,
  // EyeOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';

import { FormProps, FormInstance } from 'antd/lib/form';
import { geocodeByAddress, getLatLng } from 'react-google-places-autocomplete';
import Autocomplete from 'react-google-autocomplete';
import moment, { Moment } from 'moment';

import {
  AppDrawer,
  DotMenu,
  ReceiptAndSupportDocumentUploader,
  CustomFieldsForm,
  Amount,
  DocumentsViewer,
  Remark,
  CustomPlacesAutocomplete,
} from '../../../../shared/components';

import {
  IvalidationError,
  ImileageRecords,
  // ImileageRecords,
  IMileageTripFormData,
  IgetMileageRateProps,
} from '../../addNewExpense.model';
import {
  setMileageAmount,
  updateFormData,
  updateBackendError,
  updateTripDetailError,
  setDisableSaveSendBtns,
  updateReceiptMandetoryStatus,
} from '../../addNewExpense.actions';
import {
  fetchMileageRate,
  fetchDistanceBetweenPlace,
  validationAndUpdationTripDetailsThunkFn,
} from '../../addNewExpense.thunk';
import JSONData from '../../addNewExpense.data.json';
import { Trans } from '@lingui/macro';

import './mileageForm.index.less';
import { GetSkeleton, CommonFormFields, MileageTripDetailDrawer } from '..'; //local components
import {
  getDistance,
  preciseDecimal,
  stringTemplating,
  isGoogleApiDisabled,
} from '../../../../utils/global.utils';
import { IBEReceipt } from '../../../../shared/model';
import Big from 'big.js';
import { fetchRequestDetailsById } from '../../../submitted/submitted.thunk';
import { setIsHandwrittenStatus } from '../../../receipt/receipt.action';
let isEnableOcr = false;
const mapStateToProps = (state: stateInterface) => {
  const {
    userInfo,
    configuration,
    isAdminEdit,
    mileageRate,
    mileageAmount,
    expenseEntitlement,
    mode,
    viewOnly,
    userJobInfo,
    chargeTo,
    costCenterListLoader,
    initialReceiptStatus,
    costCenterList,
    formData,
    expenseTypeList,
    backendError,
    selectedExpenseType,
    expenseTypeListLoader,
    expenseClaimFetchedData,
    tripDetailError,
    tripDetailsLoader,
    is_resubmission_case,
  } = state.AddNewExpenseForm;
  const {
    isHandwritten,
    scannedAmount,
    scannedReceiptDate,
    scannedReceiptNumber,
    confidence,
    warning_msg,
  } = state.receipt;
  const requestDetails = getSubmittedRequestDetails(state);

  return {
    userInfo,
    configuration,
    isAdminEdit,
    mileageRate,
    mileageAmount,
    expenseEntitlement,
    isHandwritten,
    scannedAmount,
    scannedReceiptDate,
    scannedReceiptNumber,
    confidence,
    warning_msg,
    mode,
    viewOnly,
    chargeTo,
    costCenterListLoader,
    initialReceiptStatus,
    costCenterList,
    formData,
    requestDetails,
    expenseTypeList,
    backendError,
    userJobInfo,
    selectedExpenseType,
    expenseTypeListLoader,
    expenseClaimFetchedData,
    tripDetailError,
    tripDetailsLoader,
    is_resubmission_case,
    isPermissionAllowed: (permission: PROXY_PERMISSIONS) =>
      isProxyPermissionAllowed(state, permission),
    // currencies: getCurrencyList(state), //currency list fro currency conversion reducer
  };
};
const { Option } = Select;
const mapDisapatchToProps = (dispatch: Dispatch<any>) => {
  return {
    _updateFormData: (
      key: string | string[],
      type:
        | 'general_form'
        | 'entertainment_form'
        | 'form_data'
        | 'mileage_form'
        | 'allowance_form',
      data: any,
    ) => dispatch(updateFormData(key, type, data)),
    _validationAndUpdationTripDetailsThunkFn: (
      data: any,
      updateId?: number,
      callBack?: Function,
    ) =>
      dispatch(
        validationAndUpdationTripDetailsThunkFn(data, updateId, callBack),
      ),
    _setMileageAmount: (amount: any) => dispatch(setMileageAmount(amount)),
    _fetchMileageRate: (
      mileageRateProps: IgetMileageRateProps,
      callback: any,
    ) => dispatch(fetchMileageRate(mileageRateProps, callback)),
    _fetchDistanceBetweenPlace: (places: any, callback: any) =>
      dispatch(fetchDistanceBetweenPlace(places, callback)),
    _updateTripDetailError: (data: any) =>
      dispatch(updateTripDetailError(data)),
    _updateReceiptMandetoryStatus: (data: boolean) =>
      dispatch(updateReceiptMandetoryStatus(data)),
    _setDisableSaveSendBtns: (data: any) =>
      dispatch(setDisableSaveSendBtns(data)),
    _fetchRequestDetails: (id: string) => dispatch(fetchRequestDetailsById(id)),
    _updateBackendError: (error: any) => dispatch(updateBackendError(error)),
    _setIsHandwrittenStatus: (status: boolean) =>
      dispatch(setIsHandwrittenStatus(status)),
  };
};

const connector = connect(mapStateToProps, mapDisapatchToProps, null, {
  forwardRef: true,
});

let userEnteredAmt: any = null;

const MileageForm: FC<ConnectedProps<typeof connector> & {
  formInstance: FormInstance;
  getLabelName: Function;
  expenseFormProps: FormProps;
  validationError: IvalidationError;
  isForRequest: boolean;
  requestId: string | null;
  showCustomField?: boolean;
  expenseClaimId?: any;
  ccThresholdValidations: (amount: number) => void;
  _scanImage?: any;
  scanLoader?: any;
  is_enabled_ocr?: any;
  _setScanDateAmount?: any;
  _forwardRef: any;
}> = props => {
  const {
    formInstance,
    _scanImage,
    scanLoader,
    is_enabled_ocr,
    _setScanDateAmount,
    getLabelName,
    _forwardRef,
    expenseFormProps,
    showCustomField,
    mileageAmount,
    // validationError,
    backendError,
    configuration,
    isForRequest,
    requestId,
    requestDetails = null,
    initialReceiptStatus,
    isAdminEdit,
    expenseEntitlement,
    mileageRate,
    mode,
    viewOnly,
    userJobInfo,
    chargeTo,
    // costCenterListLoader,
    costCenterList,
    formData,
    expenseTypeList,
    // currencies,
    selectedExpenseType,
    expenseTypeListLoader,
    expenseClaimFetchedData,
    tripDetailError,
    tripDetailsLoader,
    userInfo,
    is_resubmission_case,
    ccThresholdValidations,
    _setMileageAmount,
    _updateFormData,
    _fetchMileageRate,
    _fetchDistanceBetweenPlace,
    _updateBackendError,
    _validationAndUpdationTripDetailsThunkFn,
    _updateTripDetailError,
    _setDisableSaveSendBtns,
    _updateReceiptMandetoryStatus,
    _fetchRequestDetails,
    _setIsHandwrittenStatus,
    isPermissionAllowed,
    expenseClaimId,
    isHandwritten,
    scannedAmount,
    scannedReceiptDate,
    scannedReceiptNumber,
    confidence,
    warning_msg,
  } = props;
  const [date, setDate] = useState('' || {});
  const [recordKey, setRecordKey] = useState(null);
  const [isAutoCompleteDisable, setIsAutoCompleteDisable] = useState(false);

  const isReceiptAllowed = isPermissionAllowed('ACTION_RECEIPT'); //ACTION_RECEIPT

  useEffect(() => {
    message.destroy();
    if (tripDetailError.non_field_errors) {
      message.error(tripDetailError.non_field_errors[0]);
    }
  }, [tripDetailError]);

  useEffect(() => {
    if (isForRequest) {
      requestId && _fetchRequestDetails(requestId);
    }
  }, [_fetchRequestDetails, isForRequest, requestId]);

  const disabledDate = (isTripDate: boolean, current: Moment): boolean => {
    let condition: boolean = false;
    try {
      if (configuration === null) return false;

      if (isAdminEdit) return current >= moment(); //disabling only future dates

      if (current) {
        if (
          configuration?.is_allow_backdated_claims &&
          configuration?.backdated_claim_period_in_days
        ) {
          if (requestDetails || expenseClaimFetchedData?.request) {
            let start_date = requestDetails
              ? moment(requestDetails.end_date, 'DD/MM/YYYY')
                  .subtract(
                    configuration?.backdated_claim_period_in_days,
                    'days',
                  )
                  .endOf('day')
              : moment(expenseClaimFetchedData?.request?.end_date, 'DD/MM/YYYY')
                  .subtract(
                    configuration?.backdated_claim_period_in_days,
                    'days',
                  )
                  .endOf('day');
            let end_date = formInstance.getFieldValue('date').endOf('day');

            condition = start_date >= current || current >= end_date;
          } else {
            condition =
              current <
              moment()
                .subtract(configuration?.backdated_claim_period_in_days, 'days')
                .startOf('day');
          }
        } else {
          condition =
            current <=
            moment()
              .subtract(1, 'days')
              .endOf('day');
        }
      }
    } catch (error) {
      console.error(error);
    }

    if (requestDetails || expenseClaimFetchedData?.request) {
      return condition;
    }

    if (isTripDate) {
      return (
        condition ||
        current >= moment(formData?.general_form?.date || '').endOf('day')
      );
    } else {
      return condition || current >= moment();
    }
  };
  useEffect(() => {
    const isAutoCompleteDisable = isGoogleApiDisabled();
    isAutoCompleteDisable && setIsAutoCompleteDisable(isAutoCompleteDisable);
  }, []);
  const handleMileageExpenseFormValueChange = (
    changedValues: any,
    _allValues?: any,
  ) => {
    const key: string = Object.keys(changedValues)[0];
    if (
      key === 'parking_charges' ||
      key === 'toll_charges' ||
      key === 'other_charges' ||
      key === 'is_a_round_trip' ||
      key === 'amount' ||
      key === 'auto_calculated_mileage'
    ) {
      setIsMileageRateCalled(() => false);
      const t_state = {
        ...getMileageExpenseTripFormData,
        Amount: mileageAmount,
        ...changedValues,
      };
      if (key === 'amount') {
        userEnteredAmt = changedValues[key];
      }
      setMileageExpenseTripFormData(t_state);
      amountCalculationFn(t_state, key);
    } else if (key === 'is_no_receipt') {
      if (changedValues[key]) {
        setMileageExpenseTripFormData((prevState: any) => ({
          ...prevState,
          ...changedValues,
          receipt_number: '',
          receipt: null,
        }));
        setTimeout(() => {
          mileageExpenseTripForm.validateFields(['receipt_number', 'receipt']);
        }, 100);
      } else {
        setMileageExpenseTripFormData((prevState: any) => ({
          ...prevState,
          ...changedValues,
          no_receipt_remark: '',
        }));
      }
      return;
    } else if (key === 'date') {
      userEnteredAmt = null;
      setMileageExpenseTripFormData((prevState: any) => ({
        ...prevState,
        date: changedValues.date,
      }));
    } else {
      setMileageExpenseTripFormData((prevState: any) => ({
        ...prevState,
        ...changedValues,
      }));
    }
  };
  /////////////////////////////////////////////////////////////////////////////////////////////////////

  const getRecordObject = (
    value: any,
    keepReceipEvenIfReceiptPickfromGallery: boolean = false,
    dataForBE: boolean = false,
    calledFromUpdateNewMileageRecordInState: boolean = false,
  ) => {
    const isUpdate = mode === 'UPDATE';
    const returnObj: any = {
      expense_type_legal_entity:
        formData.general_form.expense_type_legal_entity,
      country_currency: formData.general_form.currency,
      //---
      date: value.date ? value.date.format('DD-MM-YYYY') : '',
      source: value.source,
      destination: value.destination,
      auto_calculated_mileage: value.auto_calculated_mileage || 0,
      rate: Number(preciseDecimal(Number(value.rate), 4)) || 0,
      total_amount: value.total_amount || 0,
      amount: value.amount || 0,
      toll_charges: value.toll_charges || 0,
      parking_charges: value.parking_charges || 0,
      other_charges: value.other_charges || 0,
      is_a_round_trip: value.is_a_round_trip,
      receipt: value?.receipt?.length ? value.receipt[0] || null : null,
      purpose: value.purpose || '',
      receipt_number: value.receipt_number,
      is_no_receipt: Boolean(value.is_no_receipt),
      no_receipt_remark: value.no_receipt_remark || '',
      supporting_documents: value?.supporting_documents?.length
        ? value.supporting_documents || null
        : null,
      is_mileage_auto: getMileageExpenseTripFormData.is_mileage_auto,
      is_handwritten_detected: isHandwritten,
    };
    if (!returnObj.is_mileage_auto) {
      returnObj.manually_entered_mileage =
        getMileageExpenseTripFormData.manually_entered_mileage;
    } else {
      if (mode === 'UPDATE') {
        returnObj.manually_entered_mileage = 0;
      }
    }

    if (value.is_no_receipt || !Boolean(returnObj.receipt)) {
      delete returnObj.receipt;
      delete returnObj.receipt_number;
    }
    if (expenseEntitlement) {
      returnObj.expense_entitlement = expenseEntitlement;
    }

    if (requestDetails || expenseClaimFetchedData?.request) {
      returnObj.request = requestDetails
        ? requestDetails?.id
        : expenseClaimFetchedData?.request?.id;
    }
    // Identify whether receipt is new or old
    if (
      value.receipt &&
      typeof value.receipt[0] === 'string' &&
      !calledFromUpdateNewMileageRecordInState
    ) {
      delete returnObj.receipt;
    }

    if (getLibraryReceipt !== null) {
      if (!keepReceipEvenIfReceiptPickfromGallery) delete returnObj.receipt;
      returnObj.library_receipt = getLibraryReceipt;
    }

    if (!value?.is_no_receipt) {
      delete returnObj.no_receipt_remark;
    }
    if (
      !Boolean(value?.supporting_documents) ||
      value?.supporting_documents?.length === 0
    ) {
      delete returnObj.supporting_documents;
    }

    if (isUpdate && isTripEditMode?.id !== null && dataForBE) {
      const ogRecord = formData.mileage_form.mileage_records.filter(
        o => o.id === isTripEditMode?.id,
      )[0];
      const newRecord = { ...returnObj };
      if (ogRecord?.supporting_documents) {
        const remainingDoc: number[] = [];
        returnObj.supporting_documents = (
          newRecord.supporting_documents || []
        ).filter((o: any) => {
          if (o.hasOwnProperty('uid')) {
            if (supportingDocIdsUpdateTrip?.includes(o.uid)) {
              return false;
            }
            return true;
          } else {
            remainingDoc.push(o.id);
            return false;
          }
        });
        const deletedSupportingDoc: any[] = [];

        if (remainingDoc.length > 0) {
          ogRecord.supporting_documents.forEach((o: any) => {
            if (!remainingDoc.includes(o.id))
              o.id && deletedSupportingDoc.push(o.id);
          });
        }
        if (deletedSupportingDoc.length)
          returnObj.deleted_supporting_documents = deletedSupportingDoc;
      }

      // receipt
      if (ogRecord?.receipt) {
        returnObj.is_receipt_deleted = false;
        returnObj.is_handwritten_detected = isHandwritten || false;
        if (
          (!newRecord.receipt || newRecord.receipt === null) &&
          (!newRecord.receipt_number || newRecord.receipt_number === null)
        ) {
          returnObj.is_receipt_deleted = true;
          delete returnObj.receipt;
          delete returnObj.receipt_number;
        } else if (newRecord.receipt === (ogRecord.receipt as any).file) {
          //same file
          delete returnObj.receipt;
        }
      }
    }

    return [returnObj];
  };

  const addNewMileageRecordInState = (value: any) => {
    _updateFormData(
      'mileage_records',
      'mileage_form',
      getSortedDataUsingDate([
        ...getRecordObject(value, true),
        ...formData.mileage_form.mileage_records,
      ]),
    );
  };

  const updateNewMileageRecordInState = (value: any) => {
    const updatedRecord = formData.mileage_form.mileage_records.map(
      (o: any, i: number) => {
        if (mode === 'UPDATE' && isTripEditMode?.recordType === 'OLD') {
          if (o.id === isTripEditMode?.id)
            return {
              ...getRecordObject(value, true, false, true)[0],
              id: isTripEditMode?.id,
            };
          else return o;
        } else {
          if (i === recordKey)
            return getRecordObject(value, true, false, true)[0];
          else return o;
        }
      },
    );
    _updateFormData(
      'mileage_records',
      'mileage_form',
      getSortedDataUsingDate(updatedRecord),
    );
  };

  const handleSaveAndAddMore = () => {
    // const customFieldForm = customFieldRef?.current?.getCustomFieldFormInstance();
    // if (customFieldForm) {
    // try {
    mileageExpenseTripForm
      .validateFields()
      .then(values => {
        _validationAndUpdationTripDetailsThunkFn(
          getRecordObject(values, undefined, true)[0],
          mode === 'UPDATE' && isTripEditMode?.recordType === 'OLD'
            ? (isTripEditMode?.id as number)
            : undefined,
          async (isSuccess: boolean) => {
            if (isSuccess) {
              isTripEditMode !== null
                ? updateNewMileageRecordInState(values)
                : addNewMileageRecordInState(values);
              setTripEditMode(null);
              _setScanDateAmount(null, 0, '', {});
              _updateReceiptMandetoryStatus(initialReceiptStatus);

              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              const resetdoc = receiptFieldRef?.current?.resetReceipt();
              mileageExpenseTripForm.resetFields();
              _setMileageAmount(null);

              // formData.resetFields();
              setMileageExpenseTripFormData(values);
              setCoord({
                source: null,
                destination: null,
              });
            }
            // else {
            //   // mileageExpenseTripForm.setFieldsValue(values);
            //   setMileageExpenseTripFormData(prevState => ({
            //     ...prevState,
            //     ...values,
            //   }));
            // }
          },
        );
      })
      .catch(errorInfo => {
        console.warn(errorInfo);
      });
    // }
  };

  const handleSaveClick = () => {
    // const customFieldForm = customFieldRef?.current?.getCustomFieldFormInstance();
    // if (customFieldForm) {
    // try {
    mileageExpenseTripForm
      .validateFields()
      .then(values => {
        _validationAndUpdationTripDetailsThunkFn(
          getRecordObject(values, undefined, true)[0],
          mode === 'UPDATE' && isTripEditMode?.recordType === 'OLD'
            ? (isTripEditMode?.id as number)
            : undefined,
          async (isSuccess: boolean) => {
            if (isSuccess) {
              let formData = values.mRate
                ? {
                    rate: values.mRate,
                    ...values,
                  }
                : values;
              isTripEditMode !== null
                ? updateNewMileageRecordInState(formData)
                : addNewMileageRecordInState(formData);
              _setScanDateAmount(null, 0, '', {}, '');
              setTripEditMode(null);
              setModelVisibility(false);
              _updateReceiptMandetoryStatus(initialReceiptStatus);
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              const resetdoc = receiptFieldRef?.current?.resetReceipt();
              _updateTripDetailError({});
              _setMileageAmount(null);
              mileageExpenseTripForm.resetFields();

              setMileageExpenseTripFormData(values);
              setCoord({
                source: null,
                destination: null,
              });
              // } else {
              //   // mileageExpenseTripForm.setFieldsValue(values);
              //   setMileageExpenseTripFormData(prevState => ({
              //     ...prevState,
              //     ...values,
              //   }));
            }
          },
        );
      })
      .catch(errorInfo => {
        console.warn(errorInfo);
      });
    // }
  };

  /**
   * This function calculate and set totalAmount.
   */
  const amountCalculationFn = (formdataState: any, key?: any) => {
    const isUserAllowedToEditAmount: boolean =
      configuration?.is_allow_updating_mileage_claims_calculated_amount ||
      false;
    const isRoundTrip: boolean = formdataState.is_a_round_trip || false;

    // const userProvidedAmt = Number(formdataState.amount);

    // const amount: number = Number((distance * mileage).toFixed(10)) || 0;

    const amount: number = Number(formdataState.amount);

    const parking: number = Number(formdataState.parking_charges) || 0;

    const toll: number = Number(formdataState.toll_charges) || 0;

    const other: number = Number(formdataState.other_charges) || 0;

    let totalAmount: number = 0;
    let amt: number = 0;
    let IsRoundCalled = IsMileageRateCalled;
    if (
      key === 'parking_charges' ||
      key === 'toll_charges' ||
      key === 'other_charges' ||
      key === 'is_a_round_trip'
    ) {
      IsRoundCalled = false;
    }
    if (!isUserAllowedToEditAmount) {
      amt =
        key === 'is_a_round_trip' || IsRoundCalled
          ? isRoundTrip
            ? Number(
                Big(amount)
                  .times(2)
                  .round(2)
                  .valueOf(),
              )
            : key === 'is_a_round_trip'
            ? Number(
                Big(amount)
                  .times(0.5)
                  .round(2)
                  .valueOf(),
              )
            : amount
          : amount;
      totalAmount = Number(
        Big(amt)
          .add(parking)
          .add(toll)
          .add(other)
          .round(2)
          .valueOf(),
      );
    } else if (isUserAllowedToEditAmount) {
      if (
        userEnteredAmt === null ||
        userEnteredAmt < 0 ||
        (key === 'fetchRate' &&
          configuration?.is_allow_updating_calculated_mileage)
      ) {
        // amt = isRoundTrip ? Number((amount * 2).toFixed(10)) : amount;
        amt =
          key === 'is_a_round_trip' || IsRoundCalled
            ? isRoundTrip
              ? Number(
                  Big(amount)
                    .times(2)
                    .round(2)
                    .valueOf(),
                )
              : key === 'is_a_round_trip'
              ? Number(
                  Big(amount)
                    .times(0.5)
                    .round(2)
                    .valueOf(),
                )
              : amount
            : amount;

        totalAmount = Number(
          Big(amt)
            .add(parking)
            .add(toll)
            .add(other)
            .round(2)
            .valueOf(),
        );
      } else {
        amt = isRoundTrip
          ? Number(
              Big(userEnteredAmt)
                .times(2)
                .round(2)
                .valueOf(),
            )
          : userEnteredAmt;

        totalAmount = Number(
          Big(amt || 0)
            .add(parking)
            .add(toll)
            .add(other)
            .round(2)
            .valueOf(),
        );
      }
    }
    setIsMileageRateCalled(false);
    // IsMileageRateCalled && setIsMileageRateCalled(false);
    setMileageExpenseTripFormData((prevState: any) => ({
      ...prevState,
      total_amount: totalAmount,
      amount: amt,
    }));
  };

  useEffect(() => {
    setMileageExpenseTripFormData((prevState: any) => ({
      ...prevState,
      amount: mileageAmount,
    }));
  }, [mileageAmount]);
  const handleAddMoreClick = () => {
    mileageExpenseTripForm.resetFields();
    setModelVisibility(true);
    // mileageExpenseTripForm.setFieldsValue(mileageExpenseTripFormValues);

    setMileageExpenseTripFormData(mileageExpenseTripFormValues);
    setCoord({
      source: null,
      destination: null,
    });
    setLibraryReceipt(null);
  };

  const fetchDistanceBetweenSourceAndDestination = async () => {
    try {
      const responseHandler = (
        msg: string,
        distanceInKm: number | null,
        _response: any,
      ): void => {
        if (msg === 'OK') {
          setCallFetchMileageRate(true);
          const t_state = {
            ...getMileageExpenseTripFormData,
            auto_calculated_mileage: distanceInKm,
            auto_fetched_mileage: distanceInKm,
            is_mileage_auto: true,
          };

          setMileageExpenseTripFormData(t_state);
        } else {
          message.error(msg, 5);
        }
      };

      setIsMileageRateCalled(true);
      isAutoCompleteDisable
        ? _fetchDistanceBetweenPlace(getCoord, responseHandler)
        : getDistance(getCoord, responseHandler); //DISATANCE CALCULATOR
    } catch (err) {
      message.error(err.error_message, 5);
    }
  };

  const rowGutter: [number, number] = [16, 16];
  const [mileageExpenseTripForm] = Form.useForm();

  const formCommonProps: FormProps = {
    // form: mileageExpenseTripForm,
    scrollToFirstError: true,
    size: 'middle',
    layout: 'vertical',
    colon: false,
    autoComplete: 'off',
    onValuesChange: handleMileageExpenseFormValueChange,
    // onFinish: handleMileageExpenseFormFinish,
  };

  // useEffect(() => {
  //   let receiptDate: any;
  //   if (typeof formData?.general_form?.date === 'string') {
  //     receiptDate = formData?.general_form?.date;
  //   } else {
  //     receiptDate = moment(formData?.general_form?.date).format('YYYY-MM-DD');
  //   }

  //   const configId = selectedExpenseType?.custom_configuration
  //     ? selectedExpenseType?.custom_configuration
  //     : selectedExpenseType?.global_configuration;
  //   if (configId) {
  //     _fetchMileageRate({
  //       date: receiptDate,
  //       expense_type_configuration: configId,
  //     });
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [formData, selectedExpenseType]);

  useEffect(() => {
    _updateBackendError({});
    let receiptDate: any;
    if (selectedExpenseType) {
      if (typeof formData?.general_form?.date === 'string') {
        receiptDate = formData?.general_form?.date;
      } else {
        receiptDate = moment(formData?.general_form?.date).format('DD/MM/YYYY');
      }
      if (receiptDate && configuration) {
        let dateArray: any = [];
        configuration.mileage_rates.map((item: any) => {
          moment(item.as_of_date, 'DD/MM/YYYY') <=
            moment(receiptDate, 'DD/MM/YYYY') &&
            !dateArray?.includes(item.as_of_date) &&
            dateArray.push(item.as_of_date);
          return item;
        });

        let milageRates =
          dateArray.length > 0
            ? configuration.mileage_rates.filter((item: any) => {
                return item.as_of_date === dateArray[0];
              })
            : [];
        if (milageRates.length === 0) {
          formInstance.setFieldsValue({
            mRate: null,
          });
          _updateBackendError({
            mileage_rate: ['Mileage rates are not configured'],
          });
        } else {
          if (milageRates.length === 1) {
            formInstance.setFieldsValue({
              mRate: milageRates[0].rate,
            });
          }
          if (milageRates.length > 1) {
            formInstance.setFieldsValue({
              mRate: 'Tier Rate',
            });
          }
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedExpenseType, configuration, formData?.general_form?.date]);

  let onChangeMileageRate: number = 0;
  const returnRate = (receiptDate: Moment) => {
    for (
      let i = 0;
      i < (configuration ? configuration?.mileage_rates.length : 0);
      i++
    ) {
      let asOfDate = moment(
        configuration?.mileage_rates[i].as_of_date,
        'DD/MM/YYYY',
      );
      if (receiptDate >= asOfDate) {
        onChangeMileageRate = Number(configuration?.mileage_rates[i].rate || 0);
        break;
      }
    }
    return onChangeMileageRate;
  };

  const mileageExpenseTripFormValues: any = {
    date: undefined,
    auto_calculated_mileage: 0,
    mRate: formInstance.getFieldValue('mRate'),
    amount: mileageAmount,
    parking_charges: 0,
    toll_charges: 0,
    other_charges: 0,
    total_amount: 0,
    is_a_round_trip: false,
    no_receipt_remark: '',
    is_no_receipt: false,
    receipt: undefined,
    receipt_number: '',
    purpose: '',
    is_mileage_auto: true,
    supporting_documents: [],
  };

  const initialAmountState = {
    totalAmount: 0,
    _amount: 0,
    _parking_amount: 0,
    _toll_amount: 0,
    _other_amount: 0,
    showAmtWarning: false,
    showAmtError: false,
  };

  const [getAmountState, setAmountState] = useState<{
    totalAmount: number;
    _amount: number;
    _parking_amount: number;
    _toll_amount: number;
    _other_amount: number;
    showAmtWarning: boolean;
    showAmtError: boolean;
  }>(initialAmountState);
  const receiptFieldRef = useRef<any>(null);
  // const [, forceUpdate] = useState(false);
  const [isTripEditMode, setTripEditMode] = useState<{
    id: number | null;
    recordType: 'NEW' | 'OLD';
  } | null>(null);
  const [
    getMileageExpenseTripFormData,
    setMileageExpenseTripFormData,
  ] = useState<any>(mileageExpenseTripFormValues);
  const [getTripDetails, setTripDetails] = useState<null | ImileageRecords>(
    null,
  );
  const [callFetchMileageRate, setCallFetchMileageRate] = useState<boolean>(
    false,
  );
  const [getLibraryReceipt, setLibraryReceipt] = useState<null | number>(null);
  const [getCollapsableVisibility, setCollapsableVisibility] = useState<
    boolean
  >(false);
  const [getModelVisibility, setModelVisibility] = useState<boolean>(false);
  const [IsCloneMode, setIsCloneMode] = useState<boolean>(false);
  const [IsMileageRateCalled, setIsMileageRateCalled] = useState<boolean>(
    false,
  );
  const [isEdited, setIsEdited] = useState<boolean>(false);
  const [getCoord, setCoord] = useState<any>({
    source: null,
    destination: null,
  });
  const [tripDateChanged, setTripDateChanged] = useState<Moment | undefined>(
    undefined,
  );
  const [supportingDocIdsUpdateTrip, setSupportingDocIdsUpdateTrip] = useState<
    any
  >([]);
  useEffect(() => {
    isEnableOcr =
      is_enabled_ocr && getMileageExpenseTripFormData.auto_calculated_mileage;
  }, [getMileageExpenseTripFormData.auto_calculated_mileage, is_enabled_ocr]);
  useEffect(() => {
    let receiptDate: any;
    if (typeof formData?.general_form?.date === 'string') {
      receiptDate = formData?.general_form?.date;
    } else {
      receiptDate = moment(formData?.general_form?.date).format('YYYY-MM-DD');
    }

    const configId = selectedExpenseType?.custom_configuration
      ? selectedExpenseType?.custom_configuration
      : selectedExpenseType?.global_configuration;
    if (
      configId &&
      getMileageExpenseTripFormData.auto_calculated_mileage &&
      callFetchMileageRate &&
      getModelVisibility &&
      !IsCloneMode &&
      !isEdited
    ) {
      setIsMileageRateCalled(true);
      _fetchMileageRate(
        {
          date: receiptDate,
          expense_type_configuration: configId,
          auto_calculated_mileage:
            getMileageExpenseTripFormData.auto_calculated_mileage,
        },
        (amount: any) => {
          if (configuration?.is_allow_updating_calculated_mileage) {
            userEnteredAmt = amount;
          }
          amountCalculationFn(
            {
              ...getMileageExpenseTripFormData,
              amount: amount,
            },
            'fetchRate',
          );
          setCallFetchMileageRate(false);
        },
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    // formData.general_form.date,
    date,
    selectedExpenseType,
    getMileageExpenseTripFormData.auto_calculated_mileage,
  ]);

  const getNewlyAddedSupportingDocs = (supportingDocs: any) => {
    if (supportingDocs) {
      // eslint-disable-next-line array-callback-return
      const ids = supportingDocs.map((o: any) => {
        if (o.hasOwnProperty('uid')) return o.uid;
      });
      setSupportingDocIdsUpdateTrip(ids);
    }
  };

  const receiptImageURL = (f: any) =>
    f.hasOwnProperty('file') && typeof f?.file === 'string'
      ? f?.file
      : typeof f === 'string'
      ? f
      : window.URL.createObjectURL(f || '');

  const columns = [
    {
      title: getLabelName('Trip Date', 'string'),
      dataIndex: 'date',
      key: 'date',
      fixed: true,
      render: (text: Moment) =>
        moment.isMoment(text)
          ? text.format('DD/MM/YYYY')
          : moment(text, ['DD/MM/YYYY', 'DD-MM-YYYY']).format('DD/MM/YYYY') ||
            '',
      width: '100px',
    },
    {
      title: getLabelName('Start Place', 'string'),
      dataIndex: 'source',
      key: 'source',
      ellipsis: false,
      render: (text: any) => <span className='address'>{text}</span>,
    },
    {
      title: getLabelName('End Place', 'string'),
      dataIndex: 'destination',
      key: 'destination',
      ellipsis: false,
      render: (text: any) => <span className='address'>{text}</span>,
    },
    {
      title: getLabelName('Distance (KM)', 'string'),
      dataIndex: 'auto_calculated_mileage',
      key: 'auto_calculated_mileage',
      align: 'left' as any,
      render: (text: any) => Number(text || 0).toFixed(2),
      width: 110,
    },
    {
      title: getLabelName('Mileage Amount', 'string'),
      dataIndex: 'amount',
      key: 'amount',
      align: 'center' as any,
      width: 120,
      render: (text: any) => (
        <Amount
          align='right'
          amount={text}
          currency={
            selectedExpenseType !== null
              ? selectedExpenseType.legal_entity?.currency?.currency?.code
              : ''
          }
        />
      ),
    },
    {
      title: getLabelName('Parking Charges', 'string'),
      dataIndex: 'parking_charges',
      key: 'parking_charges',
      align: 'center' as any,
      width: 120,
      render: (text: any) => (
        <Amount
          align='right'
          amount={text}
          currency={
            selectedExpenseType !== null
              ? selectedExpenseType.legal_entity?.currency?.currency?.code
              : ''
          }
        />
      ),
    },
    {
      title: getLabelName('Toll Charges', 'string'),
      dataIndex: 'toll_charges',
      key: 'toll_charges',
      align: 'center' as any,
      width: 120,
      render: (text: any) => (
        <Amount
          align='right'
          amount={text}
          currency={
            selectedExpenseType !== null
              ? selectedExpenseType.legal_entity?.currency?.currency?.code
              : ''
          }
        />
      ),
    },
    {
      title: getLabelName('Other Charges', 'string'),
      dataIndex: 'other_charges',
      key: 'other_charges',
      align: 'center' as any,
      width: 120,
      render: (text: any) => (
        <Amount
          align='right'
          amount={text}
          currency={
            selectedExpenseType !== null
              ? selectedExpenseType.legal_entity?.currency?.currency?.code
              : ''
          }
        />
      ),
    },
    {
      title: getLabelName('Total Amount', 'string'),
      dataIndex: 'total_amount',
      key: 'total_amount',
      align: 'center' as any,
      width: 120,
      render: (text: any) => (
        <Amount
          align='right'
          amount={text}
          currency={
            selectedExpenseType !== null
              ? selectedExpenseType.legal_entity?.currency?.currency?.code
              : ''
          }
        />
      ),
    },
    {
      title: getLabelName('Is A Round Trip', 'string'),
      dataIndex: 'is_a_round_trip',
      key: 'is_a_round_trip',
      align: 'center' as any,
      width: 120,
      render: (text: any) => (text ? 'Yes' : 'No'),
    },
    {
      title: getLabelName('Receipt/s', 'string'),
      dataIndex: 'receipt',
      key: 'receipt',
      align: 'center' as any,
      render: (_file: File | IBEReceipt | any, _row: any) => {
        const supDoc = (_row.supporting_documents || []).map((o: any) =>
          o.hasOwnProperty('attachment')
            ? o
            : {
                attachment: receiptImageURL(o),
                file_name: o.name,
                file_type: o.type,
              },
        );
        return (
          <DocumentsViewer
            itemType='expense'
            itemNumber={expenseClaimFetchedData?.claim_number || 'N/A'}
            documents={supDoc}
            receipt={
              _file
                ? {
                    ..._file,
                    file: receiptImageURL(_file),
                    file_type: _file?.file_type || _file?.type,
                    receipt_number: _row.receipt_number,
                  }
                : null
            }
            icon={<PaperClipOutlined />}
          />
        );
      },
    },
    {
      title: getLabelName('Purpose', 'string'),
      dataIndex: 'purpose',
      key: 'purpose',
      ellipsis: false,
      align: 'center' as any,
      render: (_val: string, _item: any, _index: number) => (
        <Remark remark={_val} />
      ),
    },
    {
      title: <Trans>Action</Trans>,
      dataIndex: '',
      key: 'action',
      align: 'center' as any,
      width: 100,
      fixed: 'right' as 'right',
      render: (_val: string, _item: any, _index: number) => (
        <DotMenu
          actionBtn={[
            {
              children: <Trans>Edit</Trans>,
              Type: 'link',
              icon: EditOutlined,
              Disabled: isAdminEdit,
              OnClick: () => {
                setIsCloneMode(false);
                setRecordKey(_item.key);
                const isUpdate = mode === 'UPDATE';
                const _rTVal = _item.id && isUpdate ? 'OLD' : 'NEW';
                setTripEditMode({
                  recordType: _rTVal,
                  id: isUpdate && _rTVal === 'OLD' ? _item.id : _index,
                });

                (_item?.is_handwritten_detected ||
                  _item?.receipt?.is_handwritten_detected) &&
                  _setIsHandwrittenStatus(
                    _item?.is_handwritten_detected ||
                      _item?.receipt?.is_handwritten_detected,
                  );
                mileageExpenseTripForm.resetFields();
                setLibraryReceipt(_item.library_receipt || null);
                setModelVisibility(true);
                userEnteredAmt = Number(_item.amount) || 0;
                userEnteredAmt = _item.is_a_round_trip
                  ? userEnteredAmt / 2
                  : userEnteredAmt;
                configuration?.is_allow_updating_calculated_mileage &&
                  setIsEdited(true);

                getAndSetCordinates('source', _item.source, false);
                getAndSetCordinates('destination', _item.destination, false);
                getNewlyAddedSupportingDocs(_item.supporting_documents);
                const _data: any = {
                  ...removeUnwantedKeys(_item, true),
                  date: moment(_item.date, ['DD-MM-YYYY', 'DD/MM/YYYY']),
                  supporting_documents: _item.supporting_documents,
                  total_amount: Number(_item.total_amount),
                  // supporting_documents:
                  //   isUpdate && _rTVal === 'OLD'
                  //     ? _item.supporting_documents.map((o: any) => o.attachment)
                  //     : _item.supporting_documents,
                  receipt:
                    isUpdate && _rTVal === 'OLD'
                      ? typeof _item.receipt === 'string'
                        ? _item.receipt
                        : _item.receipt?.file
                        ? _item.receipt.file
                        : _item.receipt
                      : // ? _item.receipt?.file || null
                        _item.receipt?.file || _item.receipt,
                  auto_fetched_mileage:
                    _item.manually_entered_mileage &&
                    parseInt(_item.manually_entered_mileage) !== 0
                      ? _item.manually_entered_mileage
                      : _item.auto_calculated_mileage,
                };
                if (configuration?.is_allow_updating_calculated_mileage) {
                  _data.is_mileage_auto =
                    _item.manually_entered_mileage &&
                    parseInt(_item.manually_entered_mileage) !== 0
                      ? false
                      : true;
                }
                setMileageExpenseTripFormData((_prevState: any) => ({
                  ...mileageExpenseTripFormValues,
                  ..._data,
                }));
              },
            },
            {
              children: <Trans>Clone</Trans>,
              Type: 'link',
              icon: CopyOutlined,
              Disabled: isAdminEdit || isMaxRecordAdded,
              OnClick: () => {
                mileageExpenseTripForm.resetFields();
                setModelVisibility(true);
                setIsCloneMode(true);
                configuration?.is_allow_updating_calculated_mileage &&
                  setIsEdited(true);
                // mileageExpenseTripForm.setFieldsValue({
                //   ..._item,
                //   date: mileageExpenseTripFormValues.date,
                //   receipt: mileageExpenseTripFormValues.receipt,
                //   receipt_number: mileageExpenseTripFormValues.receipt_number,
                // });
                setMileageExpenseTripFormData((_prevState: any) => ({
                  ...mileageExpenseTripFormValues,
                  ..._item,
                  date: null,
                  receipt: mileageExpenseTripFormValues.receipt,
                  receipt_number: mileageExpenseTripFormValues.receipt_number,
                  supporting_documents: [],
                  auto_fetched_mileage:
                    _item.manually_entered_mileage &&
                    parseInt(_item.manually_entered_mileage) !== 0
                      ? _item.manually_entered_mileage
                      : _item.auto_calculated_mileage,
                }));
                if (mode === 'UPDATE') {
                  setIsMileageRateCalled(true);
                }
                (_item?.is_handwritten_detected ||
                  _item?.receipt?.is_handwritten_detected) &&
                  _setIsHandwrittenStatus(
                    _item?.is_handwritten_detected ||
                      _item?.receipt?.is_handwritten_detected,
                  );
                setLibraryReceipt(null);
                getAndSetCordinates('source', _item.source, false);
                getAndSetCordinates('destination', _item.destination, false);
              },
            },
            {
              children: <Trans>Delete</Trans>,
              Type: 'link',
              icon: DeleteOutlined,
              Disabled: isAdminEdit,
              OnClick: () => {
                let recordState = _item.id ? 'OLD' : 'NEW';

                if (mode === 'UPDATE') {
                  let newRecords = formData.mileage_form.mileage_records;
                  if (recordState === 'OLD') {
                    newRecords = newRecords.filter(
                      (record: any) => record.id !== _item.id,
                    );
                    _updateFormData(
                      'mileage_records',
                      'mileage_form',
                      getSortedDataUsingDate(newRecords),
                    );
                  } else {
                    newRecords = newRecords.filter(
                      (record: any) => record.key !== _item.key,
                    );
                    _updateFormData(
                      'mileage_records',
                      'mileage_form',
                      getSortedDataUsingDate(newRecords),
                    );
                  }
                } else {
                  let newRecords = formData.mileage_form.mileage_records;
                  newRecords = newRecords.filter(
                    (record: any) => record.key !== _item.key,
                  );
                  _updateFormData(
                    'mileage_records',
                    'mileage_form',
                    getSortedDataUsingDate(newRecords),
                  );
                }
              },
            },
          ]}
        >
          <EllipsisOutlined />
        </DotMenu>
      ),
    },
  ];

  const removeUnwantedKeys = (
    obj: {
      [x: string]: any;
    },
    delFilesKey: boolean = false,
  ): { [x: string]: any } => {
    const t = { ...obj };
    delete t.country_currency;
    delete t.expense_type_legal_entity;
    delete t.key;
    if (delFilesKey) {
      delete t.receipt;
      delete t.supporting_documents;
      delete t.library_receipt;
    }
    return t;
  };

  const recordsLength = formData.mileage_form.mileage_records.filter(
    (o: any) => !Boolean(o.id), ///removing previous saved records
  ).length;

  const isMaxRecordAdded = recordsLength === 10;

  const addMoreButtonDisabledProps: boolean =
    configuration === null ||
    !Boolean(formData.general_form.expense_type_legal_entity) ||
    !Boolean(formData.general_form.date) ||
    isMaxRecordAdded ||
    Boolean(backendError?.mileage_rate) ||
    // mileageRate === 0 ||
    isAdminEdit;

  useEffect(() => {
    if (showCustomField) setCollapsableVisibility(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showCustomField]);

  useEffect(() => {
    if (
      getCoord.source &&
      getCoord.destination &&
      tripDateChanged &&
      !isEdited
    ) {
      fetchDistanceBetweenSourceAndDestination();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getCoord, tripDateChanged]);

  const calculateRHSSide = () => {
    if (Boolean(formData?.mileage_form?.mileage_records?.length)) {
      let totalAmount: any = [0],
        _amount: any = [0],
        _parking_amount: any = [0],
        _toll_amount: any = [0],
        _other_amount: any = [0];

      let showAmtWarning: boolean = false,
        showAmtError: boolean = false;

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

      totalAmount = sumBy(
        formData.mileage_form.mileage_records,
        'total_amount',
      );

      _amount = Number(sumBy(formData.mileage_form.mileage_records, 'amount'));

      _parking_amount = Number(
        sumBy(formData.mileage_form.mileage_records, 'parking_charges'),
      );

      _toll_amount = Number(
        sumBy(formData.mileage_form.mileage_records, 'toll_charges'),
      );

      _other_amount = Number(
        sumBy(formData.mileage_form.mileage_records, 'other_charges'),
      );

      // amount validation using config
      if (configuration !== null) {
        showAmtError = Boolean(
          (configuration?.max_amount === null
            ? false
            : totalAmount > (configuration?.max_amount as number)) ||
            (configuration?.min_amount === null
              ? false
              : totalAmount < (configuration?.min_amount as number)),
        );
        showAmtWarning = showAmtError
          ? false
          : totalAmount >= (configuration?.warning_amount as number) &&
            configuration?.is_set_warning_amount
          ? true
          : false;

        _setDisableSaveSendBtns(showAmtError);
      } else {
        _setDisableSaveSendBtns(false);
        showAmtError = showAmtWarning = false;
      }

      if (
        getAmountState.totalAmount > totalAmount &&
        formData.general_form.cost_centre_uuid !==
          userJobInfo?.cost_centre?.uuid
      ) {
        ccThresholdValidations(totalAmount || 0);
      }

      setAmountState(prevState => ({
        ...prevState,
        totalAmount: totalAmount,
        _amount: _amount,
        _parking_amount: _parking_amount,
        _toll_amount: _toll_amount,
        _other_amount: _other_amount,
        showAmtWarning: showAmtWarning,
        showAmtError: showAmtError,
      }));
    } else {
      setAmountState(initialAmountState);
      _setDisableSaveSendBtns(false);
      if (
        formData.general_form.cost_centre_uuid !==
        userJobInfo?.cost_centre?.uuid
      ) {
        ccThresholdValidations(initialAmountState.totalAmount || 0);
      }
    }
  };

  // delay(calculateRHSSide, 500);
  useEffect(calculateRHSSide, [
    formData.mileage_form.mileage_records,
    configuration,
  ]);

  const getSortedDataUsingDate = (data?: any[]) => {
    let tableData: any[] = data || formData.mileage_form.mileage_records;

    tableData.sort((a: any, b: any) => {
      const _a = moment.isMoment(a.date)
        ? a.date
        : moment(a.date, ['DD/MM/YYYY', 'DD-MM-YYYY']);
      const _b = moment.isMoment(b.date)
        ? b.date
        : moment(b.date, ['DD/MM/YYYY', 'DD-MM-YYYY']);
      // return _a.valueOf() - _b.valueOf();    //ascend
      return _b.valueOf() - _a.valueOf(); //descend
    });

    tableData = tableData.map((o: ImileageRecords, i: number) => {
      return {
        ...o,
        key: i,
      };
    });

    return tableData;
  };

  useEffect(() => {
    formInstance.setFieldsValue({
      rate: mileageRate,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mileageRate]);

  const getAndSetCordinates = (
    type: 'source' | 'destination',
    data: string,
    resetUserEnteredAmt: boolean = true,
  ) => {
    isAutoCompleteDisable
      ? setCoord((prevState: any) => ({
          ...prevState,
          [type]: data,
        }))
      : geocodeByAddress(data)
          .then(results => {
            return getLatLng(results[0]);
          })
          .then(({ lat, lng }) => {
            setCoord((prevState: any) => ({
              ...prevState,
              [type]: {
                lng,
                lat,
              },
            }));
          });
    if (resetUserEnteredAmt) userEnteredAmt = null;
  };

  const receiptGallarySelectionFn = (file: any, keysArr: string[]) => {
    const data: any = {};
    _setIsHandwrittenStatus(file?.is_handwritten_detected);
    keysArr.forEach((o: string) => {
      if (file.hasOwnProperty(o)) {
        if (o === 'date') {
          data[o] = moment(file[o], 'DD/MM/YYYYY');
        } else if (o === 'amount') {
          data[o] = Number(file[o]);
          // setIsTripDetailsAmountFieldTouched(data[o]);
          userEnteredAmt = data[o];
        } else if (o === 'receipt_number') {
          data[o] = file[o];
        }
      }
    });
    setLibraryReceipt(file.id);
    const t_state = {
      ...getMileageExpenseTripFormData,
      ...data,
      receipt: [file],
    };
    setMileageExpenseTripFormData(t_state);
    if (data.hasOwnProperty('amount')) {
      setIsMileageRateCalled(false);

      amountCalculationFn(t_state);
    }
  };
  useEffect(() => {
    const copyState: IMileageTripFormData = {
      ...getMileageExpenseTripFormData,
      rate: returnRate(
        getMileageExpenseTripFormData.date ||
          formInstance.getFieldValue('date'),
      ),
    };
    // delete copyState.receipt;
    // delete copyState.supporting_documents;
    mileageExpenseTripForm.setFieldsValue(copyState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getMileageExpenseTripFormData]);

  useEffect(() => {
    const copyState: IMileageTripFormData = {
      ...getMileageExpenseTripFormData,
      rate: returnRate(
        getMileageExpenseTripFormData.date ||
          formInstance.getFieldValue('date'),
      ),
    };

    setMileageExpenseTripFormData(copyState);

    setTripDateChanged(getMileageExpenseTripFormData.date);
    // fetchDistanceBetweenSourceAndDestination();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getMileageExpenseTripFormData.date]);

  const _checkReceiptMandetoryStatus = (value: any) => {
    if (!initialReceiptStatus) {
      if (
        (value && value.length > 0) ||
        getMileageExpenseTripFormData.receipt?.length > 0
      ) {
        _updateReceiptMandetoryStatus(true);
      } else {
        _updateReceiptMandetoryStatus(false);
      }
    }
  };
  const onUpdateReceiptDoc = (value: any) => {
    if (!initialReceiptStatus) {
      if (
        (value && value.length > 0) ||
        getMileageExpenseTripFormData.receipt_number
      ) {
        _updateReceiptMandetoryStatus(true);
      } else {
        _updateReceiptMandetoryStatus(false);
      }
    }
  };
  useEffect(() => {
    formData.general_form.date = '';
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    let showReceiptMandetory =
      getModelVisibility &&
      getMileageExpenseTripFormData.receipt_number &&
      getMileageExpenseTripFormData.receipt_number.length > 0;
    if (showReceiptMandetory) {
      _updateReceiptMandetoryStatus(true);
    }
  }, [
    getModelVisibility,
    getMileageExpenseTripFormData,
    _updateReceiptMandetoryStatus,
  ]);

  useEffect(() => {
    if (
      scannedReceiptDate?.length === 1 &&
      scannedReceiptDate[0] !== getMileageExpenseTripFormData.date
    ) {
      scannedDateClickedHandler(scannedReceiptDate[0]);
    }

    scannedAmount?.length === 1 &&
      scannedAmount[0] !== getMileageExpenseTripFormData.amount &&
      scannedAmountClickedHandler(scannedAmount[0]);

    scannedReceiptNumber?.length === 1 &&
      scannedReceiptNumber[0] !==
        getMileageExpenseTripFormData.receipt_number &&
      scannedRecNumberClickedHandler(scannedReceiptNumber[0]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scannedAmount, scannedReceiptDate, scannedReceiptNumber]);

  const scannedDateClickedHandler = (item: any) => {
    IsCloneMode && setIsCloneMode(false);
    setIsMileageRateCalled(true);
    setDate(moment(item, ['DD-MM-YYYY', 'DD/MM/YYYY']));
    setIsEdited(false);
    handleMileageExpenseFormValueChange({
      date: moment(item, ['DD-MM-YYYY', 'DD/MM/YYYY']),
    });
  };
  const scannedAmountClickedHandler = (item: any) => {
    if (configuration?.is_allow_updating_mileage_claims_calculated_amount) {
      if (
        scannedReceiptDate?.length === 1 &&
        scannedReceiptDate[0] !== getMileageExpenseTripFormData.date
      ) {
        handleMileageExpenseFormValueChange({
          amount: parseFloat(item),
          date: moment(scannedReceiptDate[0], ['DD-MM-YYYY', 'DD/MM/YYYY']),
        });
      } else {
        handleMileageExpenseFormValueChange({
          amount: parseFloat(item),
        });
      }
    }
  };
  const scannedRecNumberClickedHandler = (item: any) => {
    _checkReceiptMandetoryStatus(item);
    handleMileageExpenseFormValueChange({
      receipt_number: item,
    });
  };
  const isCostCenterSelectDisable =
    (!userJobInfo?.cost_centre?.is_chargeable ||
      !userJobInfo?.cost_centre?.is_active) &&
    configuration?.is_employee_cost_centre_readonly &&
    configuration?.is_default_to_entity_cost_centre
      ? true
      : false;
  return (
    <Row gutter={rowGutter} className='mileage-form-section'>
      {/* --------------------------- MILEAGE TOP GREY SECTION --------------------------- */}
      <Col span={24}>
        <Row gutter={rowGutter} className='general-fields-section'>
          {/* --------------------------- MILEAGE TOP GREY(LHS) SECTION --------------------------- */}
          <Col sm={12} md={14} lg={15} xl={17}>
            <Row gutter={rowGutter}>
              <Col xl={12} lg={10} md={24} sm={24}>
                <CommonFormFields.ExpenseType
                  getLabelName={getLabelName}
                  backendError={backendError}
                  JSONData={JSONData}
                  mode={mode}
                  disableState={Boolean(
                    mode === 'UPDATE' || recordsLength || isAdminEdit,
                  )}
                  expenseClaimFetchedData={expenseClaimFetchedData}
                  expenseTypeList={expenseTypeList}
                  expenseTypeListLoader={expenseTypeListLoader}
                />
              </Col>
              <Col xl={6} lg={7} md={12} sm={24}>
                <CommonFormFields.ExpenseDate
                  viewOnly={viewOnly}
                  getLabelName={getLabelName}
                  backendError={backendError}
                  JSONData={JSONData}
                  mode={mode}
                  requestDetails={requestDetails}
                  isAdminEdit={isAdminEdit}
                  configuration={configuration}
                  is_resubmission_case={is_resubmission_case}
                  formType='MIL'
                  form={formInstance}
                  expenseClaimFetchedData={expenseClaimFetchedData}
                />
              </Col>
              <Col xl={6} lg={7} md={12} sm={24}>
                <Form.Item
                  label={getLabelName('Mileage Rate /km', 'string')}
                  name='mRate'
                  validateTrigger='onBlur'
                  className='mRate'
                  validateStatus={
                    backendError.hasOwnProperty('mileage_rate')
                      ? 'error'
                      : 'validating'
                  }
                  help={
                    backendError.hasOwnProperty('mileage_rate')
                      ? backendError.mileage_rate[0]
                      : null
                  }
                  // rules={[
                  //   () => ({
                  //     validator(_rule, value) {
                  //       if (value > 0) {
                  //         return Promise.resolve();
                  //       }
                  //       return Promise.reject(
                  //         stringTemplating(
                  //           {
                  //             label: getLabelName('Mileage Rate /km', 'string'),
                  //           },
                  //           JSONData.vaidationErrors.generalForm.rate.mandatory,
                  //         ),
                  //       );
                  //     },
                  //   }),
                  // ]}
                  valuePropName='value'
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    disabled={true}
                    precision={4}
                    // value={mileageRate || 0}
                  />
                </Form.Item>
              </Col>
              {configuration?.is_allow_purpose ? (
                <Col xl={12} md={24} sm={24}>
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
                    required={configuration?.is_purpose_mandatory || false}
                    rules={[
                      () => ({
                        validator(_, value) {
                          if (value !== undefined) {
                            value = value?.trim();
                          }
                          if (
                            (!value || value === undefined) &&
                            configuration?.is_purpose_mandatory
                          ) {
                            return Promise.reject(
                              stringTemplating(
                                { label: getLabelName('Purpose', 'string') },
                                JSONData.vaidationErrors.generalForm.purpose
                                  .mandatory,
                              ),
                            );
                          } else if (
                            (!value || value === undefined) &&
                            !configuration?.is_purpose_mandatory
                          ) {
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
                    <Input autoComplete='new-password' disabled={viewOnly} />
                  </Form.Item>
                </Col>
              ) : null}
            </Row>
            <Row gutter={rowGutter}>
              {configuration?.is_allow_charging_to_cost_centres ? (
                <>
                  {!configuration?.is_default_to_entity_cost_centre ? (
                    <Col xl={8} md={12} sm={24} style={{ margin: '15px 0' }}>
                      <CommonFormFields.ChargeTo
                        amount={getAmountState.totalAmount || 0}
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
                      xl={8}
                      span={
                        !configuration?.is_default_to_entity_cost_centre
                          ? 12
                          : 8
                      }
                      lg={12}
                      sm={24}
                      style={{ margin: '15px 0' }}
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
                </>
              ) : null}
            </Row>
            {/* --------------------------- CUSTOM FIELDS FORM COMPONENT --------------------------- */}
            <Row gutter={rowGutter}>
              <Col
                style={{ marginTop: 18 }}
                span={24}
                className={`${
                  getCollapsableVisibility
                    ? 'show-custom-fields custom-field-container'
                    : 'hide-custom-fields custom-field-container'
                }`}
              >
                {/* {false && ( */}
                <CustomFieldsForm
                  isViewMode={viewOnly}
                  isAdmin={isAdminEdit}
                  ref={_forwardRef}
                  customFields={
                    configuration?.custom_fields || {
                      fields: [],
                      layout: [],
                    }
                  }
                  formProps={expenseFormProps}
                />
                {/* )} */}
              </Col>
            </Row>
          </Col>
          {/* --------------------------- MILEAGE TOP GREY(RHS) SECTION --------------------------- */}
          <Col sm={12} md={10} lg={9} xl={7}>
            <div className='amount-section'>
              {/* <Row gutter={0} align='middle'>
                <Col span={11} className='lhs-label'>
                  Amount :
                </Col>
              </Row> */}
              <Row gutter={0} align='middle'>
                <Col span={11} className='lhs-label'>
                  <Trans>Total</Trans>
                </Col>
                <Col
                  span={13}
                  // offset={2}
                  className={
                    getAmountState.showAmtError
                      ? 'show-error'
                      : getAmountState.showAmtWarning
                      ? 'show-warning'
                      : ''
                  }
                >
                  <Amount
                    amount={getAmountState.totalAmount}
                    currency={
                      selectedExpenseType !== null
                        ? selectedExpenseType.legal_entity?.currency?.currency
                            ?.code
                        : ''
                    }
                  />
                </Col>
              </Row>
              <Row gutter={0} align='middle'>
                <Col span={11} className='lhs-label'>
                  <Trans>Mileage Amount</Trans>
                </Col>
                <Col span={13} offset={0}>
                  <Amount
                    amount={getAmountState._amount}
                    currency={
                      selectedExpenseType !== null
                        ? selectedExpenseType.legal_entity?.currency?.currency
                            ?.code
                        : ''
                    }
                  />
                </Col>
              </Row>
              <Row gutter={0} align='middle'>
                <Col span={11} className='lhs-label'>
                  <Trans>Parking</Trans>
                </Col>
                <Col span={13} offset={0}>
                  <Amount
                    amount={getAmountState._parking_amount}
                    currency={
                      selectedExpenseType !== null
                        ? selectedExpenseType.legal_entity?.currency?.currency
                            ?.code
                        : ''
                    }
                  />
                </Col>
              </Row>
              <Row gutter={0} align='middle'>
                <Col span={11} className='lhs-label'>
                  <Trans>Toll/ERP</Trans>
                </Col>
                <Col span={13} offset={0}>
                  <Amount
                    amount={getAmountState._toll_amount}
                    currency={
                      selectedExpenseType !== null
                        ? selectedExpenseType.legal_entity?.currency?.currency
                            ?.code
                        : ''
                    }
                  />
                </Col>
              </Row>
              <Row gutter={0} align='middle'>
                <Col span={11} className='lhs-label'>
                  <Trans>Other</Trans>
                </Col>
                <Col span={13} offset={0}>
                  <Amount
                    amount={getAmountState._other_amount}
                    currency={
                      selectedExpenseType !== null
                        ? selectedExpenseType.legal_entity?.currency?.currency
                            ?.code
                        : ''
                    }
                  />
                </Col>
              </Row>
            </div>
          </Col>

          {Boolean(configuration?.custom_fields?.layout?.length) && (
            <div className='collapsable-icon-container'>
              {getCollapsableVisibility ? (
                <Button
                  type='link'
                  icon={<UpOutlined />}
                  onClick={() => {
                    setCollapsableVisibility(false);
                  }}
                />
              ) : (
                <Button
                  type='link'
                  icon={<DownOutlined />}
                  onClick={() => {
                    setCollapsableVisibility(true);
                  }}
                />
              )}
            </div>
          )}
        </Row>
      </Col>
      {/* --------------------------- MILEAGE DATA TABLE & ADD MORE BUTTON SECTION --------------------------- */}
      <Col span={24}>
        <Row gutter={rowGutter}>
          {formData?.mileage_form?.mileage_records?.length > 0 ? (
            <Col span={24} className='mileage-data-table'>
              <Table
                scroll={{
                  x: true,
                }}
                dataSource={formData.mileage_form.mileage_records}
                columns={columns}
                pagination={{ hideOnSinglePage: true }}
                expandable={{
                  expandedRowRender: () => null,
                  rowExpandable: () => true,
                  expandIcon: ({ record }) => (
                    <FullscreenOutlined
                      onClick={() => setTripDetails(record)}
                      title='Details'
                    />
                  ),
                }}
              />
            </Col>
          ) : null}
          <Col span={24}>
            <Button
              type='link'
              onClick={handleAddMoreClick}
              disabled={addMoreButtonDisabledProps}
            >
              <PlusOutlined /> <Trans>Add Trip</Trans>
            </Button>
            {isMaxRecordAdded ? (
              <Alert
                message='Maximum 10 trip details allowed to add. Save and then Update to add more records.'
                type='info'
              />
            ) : null}
            {getAmountState.showAmtError ? (
              <Alert
                message={
                  preciseDecimal(Number(configuration?.max_amount), 2) >
                  preciseDecimal(Number(configuration?.min_amount), 2)
                    ? `Amount should be between ${preciseDecimal(
                        Number(configuration?.min_amount),
                        2,
                      )} - ${preciseDecimal(
                        Number(configuration?.max_amount),
                        2,
                      )}`
                    : `Amount should be greater than or equal to ${preciseDecimal(
                        Number(configuration?.min_amount),
                        2,
                      )}`
                }
                type='error'
              />
            ) : null}
            {getAmountState.showAmtWarning ? (
              <Alert message={configuration?.warning_message} type='warning' />
            ) : null}
          </Col>
        </Row>
      </Col>
      {/* --------------------------- APP DRAWER COMPONENT --------------------------- */}

      {/* <Form
        name='mileageExpenseTripForm'
        // form={mileageExpenseTripForm}
        {...formCommonProps}
      > */}
      <AppDrawer
        visible={getModelVisibility}
        destroyOnClose={true}
        closable={true}
        maskClosable={false}
        onClose={() => {
          setModelVisibility(false);
          _updateTripDetailError({});
          _updateReceiptMandetoryStatus(initialReceiptStatus);
          setTripEditMode(null);
          _setScanDateAmount(null, 0, '', {});
        }}
        title={
          selectedExpenseType?.expense_type?.title
            ? `${selectedExpenseType?.expense_type?.title} - Mileage Expense ${
                formData.general_form.date
                  ? `( ${moment(formData.general_form.date).format(
                      'DD/MM/YY',
                    ) || ''} )`
                  : ''
              }`
            : ''
        }
        showCancelButton={false}
        showOkButton={false}
        getContainer='.mileage-form-section'
        width='70%'
      >
        {tripDetailsLoader && <GetSkeleton />}
        <div className={tripDetailsLoader ? 'hide' : 'show'}>
          <Row gutter={rowGutter}>
            {/* --------------------------- DRAWER FORM (GENERAL) COMPONENT --------------------------- */}
            <Col span={15}>
              <Form
                name='mileageExpenseTripForm'
                form={mileageExpenseTripForm}
                {...formCommonProps}
              >
                <Row gutter={rowGutter}>
                  <Col span={8}>
                    <Form.Item
                      label={getLabelName('Trip Date', 'string')}
                      name='date'
                      validateTrigger='onBlur'
                      className='receipt-date'
                      validateStatus={
                        tripDetailError.hasOwnProperty('date') ||
                        tripDetailError.hasOwnProperty('receipt_date')
                          ? 'error'
                          : 'validating'
                      }
                      help={
                        tripDetailError.hasOwnProperty('date')
                          ? tripDetailError.date[0]
                          : tripDetailError.hasOwnProperty('receipt_date')
                          ? tripDetailError.receipt_date[0]
                          : null
                      }
                      rules={[
                        {
                          required: true,
                          message: stringTemplating(
                            {
                              label: getLabelName('Trip Date', 'string'),
                            },
                            JSONData.vaidationErrors.mileageForm.tripDetails
                              .date,
                          ),
                        },
                      ]}
                    >
                      <DatePicker
                        format='DD/MM/YYYY'
                        disabledDate={disabledDate.bind(null, true)}
                        // value={getMileageExpenseTripFormData.date}
                        onChange={(date: any) => {
                          IsCloneMode && setIsCloneMode(false);
                          setIsMileageRateCalled(true);
                          setDate(date);
                          setIsEdited(false);
                        }}
                      />
                    </Form.Item>
                    {scannedReceiptDate?.length > 0 &&
                      isEnableOcr &&
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
                  </Col>
                  {configuration?.is_allow_purpose ? (
                    <Col span={24}>
                      <Form.Item
                        label={getLabelName('Purpose', 'string')}
                        name='purpose'
                        validateTrigger='onBlur'
                        className='purpose'
                        validateStatus={
                          tripDetailError.hasOwnProperty('purpose')
                            ? 'error'
                            : 'validating'
                        }
                        help={
                          tripDetailError.hasOwnProperty('purpose')
                            ? tripDetailError.purpose[0]
                            : null
                        }
                        required={configuration?.is_purpose_mandatory || false}
                        rules={[
                          () => ({
                            validator(_, value) {
                              if (value !== undefined) {
                                value = value?.trim();
                              }
                              if (
                                (!value || value === undefined) &&
                                configuration?.is_purpose_mandatory
                              ) {
                                return Promise.reject(
                                  stringTemplating(
                                    {
                                      label: getLabelName('Purpose', 'string'),
                                    },
                                    JSONData.vaidationErrors.generalForm.purpose
                                      .mandatory,
                                  ),
                                );
                              } else if (
                                (!value || value === undefined) &&
                                !configuration?.is_purpose_mandatory
                              ) {
                                return Promise.resolve();
                              } else {
                                if (
                                  new RegExp(/^[^@!=\-+#﹘—⸺⸻].*$/).test(value)
                                ) {
                                  return Promise.resolve();
                                }
                                return Promise.reject(
                                  new Error(
                                    'Can not start with special character',
                                  ),
                                );
                              }
                            },
                          }),
                        ]}
                      >
                        <Input
                          autoComplete='new-password'
                          // value={getMileageExpenseTripFormData.purpose}
                        />
                      </Form.Item>
                    </Col>
                  ) : null}
                  <Col span={24}>
                    <Form.Item
                      label={getLabelName('From', 'string')}
                      name='source'
                      validateTrigger='onBlur'
                      className='from'
                      validateStatus={
                        tripDetailError.hasOwnProperty('source')
                          ? 'error'
                          : 'validating'
                      }
                      help={
                        tripDetailError.hasOwnProperty('source')
                          ? tripDetailError.source[0]
                          : null
                      }
                      required
                      rules={[
                        () => ({
                          validator(_, value) {
                            if (value !== undefined) {
                              value = value?.trim();
                            }
                            if (!value || value === undefined) {
                              return Promise.reject(
                                stringTemplating(
                                  {
                                    label: getLabelName('From', 'string'),
                                  },
                                  JSONData.vaidationErrors.mileageForm
                                    .tripDetails.from,
                                ),
                              );
                            } else {
                              if (
                                new RegExp(/^[^@!=\-+#﹘—⸺⸻].*$/).test(value)
                              ) {
                                return Promise.resolve();
                              }
                              return Promise.reject(
                                new Error(
                                  'Can not start with special character',
                                ),
                              );
                            }
                          },
                        }),
                      ]}
                    >
                      {isAutoCompleteDisable ? (
                        <CustomPlacesAutocomplete
                          defaultValue={getMileageExpenseTripFormData?.source}
                          onSelect={(value: any) => {
                            getAndSetCordinates('source', value);
                            setIsEdited(false);
                            setMileageExpenseTripFormData((prevState: any) => ({
                              ...prevState,
                              source: value,
                            }));
                          }}
                        />
                      ) : (
                        <Autocomplete
                          apiKey={process.env.REACT_APP_GOOGLE_API_KEY}
                          onPlaceSelected={place => {
                            isEdited && setIsEdited(false);
                            setMileageExpenseTripFormData((prevState: any) => ({
                              ...prevState,
                              source: place.formatted_address,
                            }));
                            getAndSetCordinates(
                              'source',
                              place.formatted_address,
                            );
                          }}
                          inputAutocompleteValue='new-password'
                          options={{ types: [] }}
                          defaultValue={getMileageExpenseTripFormData?.source}
                        />
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item
                      label={getLabelName('To', 'string')}
                      name='destination'
                      validateTrigger='onBlur'
                      className='to'
                      validateStatus={
                        tripDetailError.hasOwnProperty('destination')
                          ? 'error'
                          : 'validating'
                      }
                      help={
                        tripDetailError.hasOwnProperty('destination')
                          ? tripDetailError.destination[0]
                          : null
                      }
                      required
                      rules={[
                        () => ({
                          validator(_, value) {
                            if (value !== undefined) {
                              value = value?.trim();
                            }
                            if (!value || value === undefined) {
                              return Promise.reject(
                                stringTemplating(
                                  {
                                    label: getLabelName('To', 'string'),
                                  },
                                  JSONData.vaidationErrors.mileageForm
                                    .tripDetails.to,
                                ),
                              );
                            } else {
                              if (
                                new RegExp(/^[^@!=\-+#﹘—⸺⸻].*$/).test(value)
                              ) {
                                return Promise.resolve();
                              }
                              return Promise.reject(
                                new Error(
                                  'Can not start with special character',
                                ),
                              );
                            }
                          },
                        }),
                      ]}
                    >
                      {isAutoCompleteDisable ? (
                        <CustomPlacesAutocomplete
                          defaultValue={
                            getMileageExpenseTripFormData?.destination
                          }
                          onSelect={(value: any) => {
                            getAndSetCordinates('destination', value);
                            setIsEdited(false);
                            setMileageExpenseTripFormData((prevState: any) => ({
                              ...prevState,
                              destination: value,
                            }));
                          }}
                        />
                      ) : (
                        <Autocomplete
                          apiKey={process.env.REACT_APP_GOOGLE_API_KEY}
                          onPlaceSelected={place => {
                            isEdited && setIsEdited(false);
                            setMileageExpenseTripFormData((prevState: any) => {
                              return {
                                ...prevState,
                                destination: place.formatted_address,
                              };
                            });
                            getAndSetCordinates(
                              'destination',
                              place.formatted_address,
                            );
                          }}
                          inputAutocompleteValue='new-password'
                          options={{ types: [] }}
                          defaultValue={
                            getMileageExpenseTripFormData?.destination
                          }
                        />
                      )}
                    </Form.Item>
                  </Col>
                  {/* <Col span={24}>
                <Row gutter={rowGutter}> */}
                  <Col xxl={8} xl={12}>
                    <Form.Item
                      label={
                        configuration?.is_allow_updating_calculated_mileage ? (
                          <div className='default-value-btn-parent mileage-trip-eye-view'>
                            <span>
                              {getLabelName('Calculated Mileage', 'string')}
                            </span>

                            <Tooltip
                              title={
                                getMileageExpenseTripFormData.auto_fetched_mileage >
                                0
                                  ? parseFloat(
                                      getMileageExpenseTripFormData.auto_fetched_mileage,
                                    ).toFixed(4)
                                  : getMileageExpenseTripFormData.is_mileage_auto
                                  ? parseFloat(
                                      getMileageExpenseTripFormData.auto_calculated_mileage,
                                    ).toFixed(4)
                                  : parseFloat(
                                      getMileageExpenseTripFormData.manually_entered_mileage,
                                    ).toFixed(4)
                              }
                              trigger='click'
                              placement='top'
                              className='default-value-link-btn'
                              overlayClassName='default-value-tooltip'
                            >
                              <InfoCircleOutlined
                                style={{
                                  color: '#1890ff',
                                  fontSize: 18,
                                  marginLeft: '80px',
                                }}
                              />
                            </Tooltip>
                          </div>
                        ) : (
                          getLabelName('Auto-Calculated Mileage', 'string')
                        )
                      }
                      name='auto_calculated_mileage'
                      validateTrigger='onBlur'
                      className='Auto-Calculated-Mileage'
                      validateStatus={
                        tripDetailError.hasOwnProperty(
                          'auto_calculated_mileage',
                        )
                          ? 'error'
                          : 'validating'
                      }
                      help={
                        tripDetailError.hasOwnProperty(
                          'auto_calculated_mileage',
                        )
                          ? tripDetailError.auto_calculated_mileage[0]
                          : null
                      }
                      rules={[
                        {
                          required: true,
                          message: stringTemplating(
                            {
                              label: getLabelName(
                                'Auto-Calculated Mileage',
                                'string',
                              ),
                            },
                            JSONData.vaidationErrors.mileageForm.tripDetails
                              .AutoCalculatedMileage,
                          ),
                        },
                      ]}
                    >
                      <InputNumber
                        min={0}
                        precision={4}
                        style={{ width: '100%' }}
                        disabled={
                          !configuration?.is_allow_updating_calculated_mileage
                        }
                        onChange={(value: any) => {
                          isEdited && setIsEdited(false);
                          setIsMileageRateCalled(true);
                          setMileageExpenseTripFormData({
                            ...getMileageExpenseTripFormData,
                            is_mileage_auto: false,
                            manually_entered_mileage:
                              getMileageExpenseTripFormData.auto_fetched_mileage,
                            auto_calculated_mileage: value,
                          });
                          setCallFetchMileageRate(true);
                        }}
                        // value={
                        //   getMileageExpenseTripFormData.auto_calculated_mileage ||
                        //   0
                        // }
                      />
                    </Form.Item>
                  </Col>
                  <Col xxl={8} xl={12}>
                    <Form.Item
                      label={getLabelName('Mileage Rate', 'string')}
                      name='mRate'
                      validateTrigger='onBlur'
                      className='mileage-rate'
                      validateStatus={
                        tripDetailError.hasOwnProperty('mileage_rate')
                          ? 'error'
                          : 'validating'
                      }
                      help={
                        tripDetailError.hasOwnProperty('mileage_rate')
                          ? tripDetailError.mileage_rate[0]
                          : null
                      }
                      rules={[
                        {
                          required: true,
                          message: stringTemplating(
                            {
                              label: getLabelName('Mileage Rate', 'string'),
                            },
                            JSONData.vaidationErrors.mileageForm.tripDetails
                              .mileageRate,
                          ),
                        },
                      ]}
                    >
                      <InputNumber
                        min={0}
                        precision={4}
                        style={{ width: '100%' }}
                        disabled={true}
                        // value={getMileageExpenseTripFormData.rate || 0}
                      />
                    </Form.Item>
                  </Col>
                  <Col xxl={8} xl={12}>
                    <Form.Item
                      label={getLabelName('Mileage Amount', 'string')}
                      name='amount'
                      validateTrigger='onBlur'
                      className='amount'
                      validateStatus={
                        tripDetailError.hasOwnProperty('amount')
                          ? 'error'
                          : 'validating'
                      }
                      help={
                        tripDetailError.hasOwnProperty('amount')
                          ? tripDetailError.amount[0]
                          : null
                      }
                      rules={[
                        {
                          required: false,
                        },
                      ]}
                    >
                      <InputNumber
                        min={0}
                        precision={2}
                        maxLength={15}
                        style={{ width: '100%' }}
                        disabled={
                          !configuration?.is_allow_updating_mileage_claims_calculated_amount
                        }
                      />
                    </Form.Item>
                    {scannedAmount?.length > 0 &&
                      isEnableOcr &&
                      configuration?.is_allow_updating_mileage_claims_calculated_amount &&
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
                  {/* </Row>
                <Row gutter={rowGutter}> */}
                  <Col xxl={8} xl={12}>
                    <Form.Item
                      label={getLabelName('Parking Charges', 'string')}
                      name='parking_charges'
                      validateTrigger='onBlur'
                      className='parking-charges'
                      validateStatus={
                        tripDetailError.hasOwnProperty('parking_charges')
                          ? 'error'
                          : 'validating'
                      }
                      help={
                        tripDetailError.hasOwnProperty('parking_charges')
                          ? tripDetailError.parking_charges[0]
                          : null
                      }
                    >
                      <InputNumber
                        min={0}
                        precision={2}
                        maxLength={15}
                        style={{ width: '100%' }}
                        // value={
                        //   getMileageExpenseTripFormData.parking_charges || 0
                        // }
                      />
                    </Form.Item>
                  </Col>
                  <Col xxl={8} xl={12}>
                    <Form.Item
                      label={getLabelName('Toll Charges', 'string')}
                      name='toll_charges'
                      validateTrigger='onBlur'
                      className='toll-charges'
                      validateStatus={
                        tripDetailError.hasOwnProperty('toll_charges')
                          ? 'error'
                          : 'validating'
                      }
                      help={
                        tripDetailError.hasOwnProperty('toll_charges')
                          ? tripDetailError.toll_charges[0]
                          : null
                      }
                    >
                      <InputNumber
                        min={0}
                        precision={2}
                        maxLength={15}
                        style={{ width: '100%' }}
                        // value={getMileageExpenseTripFormData.toll_charges || 0}
                      />
                    </Form.Item>
                  </Col>
                  <Col xxl={8} xl={12}>
                    <Form.Item
                      label={getLabelName('Other Charges', 'string')}
                      name='other_charges'
                      validateTrigger='onBlur'
                      className='other-charges'
                      validateStatus={
                        tripDetailError.hasOwnProperty('other_charges')
                          ? 'error'
                          : 'validating'
                      }
                      help={
                        tripDetailError.hasOwnProperty('other_charges')
                          ? tripDetailError.other_charges[0]
                          : null
                      }
                    >
                      <InputNumber
                        min={0}
                        precision={2}
                        maxLength={15}
                        style={{ width: '100%' }}
                        // value={getMileageExpenseTripFormData.other_charges || 0}
                      />
                    </Form.Item>
                  </Col>
                  {/* </Row>
              </Col> */}
                  <Col span={8}>
                    <Form.Item
                      label={getLabelName('Total Amount', 'string')}
                      name='total_amount'
                      validateTrigger='onBlur'
                      className='total-amount'
                      validateStatus={
                        tripDetailError.hasOwnProperty('total_amount')
                          ? 'error'
                          : 'validating'
                      }
                      help={
                        tripDetailError.hasOwnProperty('total_amount')
                          ? tripDetailError.total_amount[0]
                          : null
                      }
                      rules={[
                        {
                          required: true,
                        },
                        () => ({
                          validator(_, value) {
                            if (typeof value === 'number' || value > 0) {
                              return Promise.resolve();
                            }
                            return Promise.reject(
                              'Total amount should be greater than 0',
                            );
                          },
                        }),
                      ]}
                    >
                      <InputNumber
                        min={0}
                        precision={2}
                        maxLength={15}
                        style={{ width: '100%' }}
                        disabled={true}
                        // value={getMileageExpenseTripFormData.total_amount || 0}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={16}>
                    <Form.Item
                      label=' '
                      name='is_a_round_trip'
                      validateTrigger='onBlur'
                      className='is-a-round-trip'
                      validateStatus={
                        tripDetailError.hasOwnProperty('is_a_round_trip')
                          ? 'error'
                          : 'validating'
                      }
                      help={
                        tripDetailError.hasOwnProperty('is_a_round_trip')
                          ? tripDetailError.is_a_round_trip[0]
                          : null
                      }
                      valuePropName='checked'
                    >
                      <Checkbox
                      // checked={getMileageExpenseTripFormData.is_a_round_trip}
                      >
                        {getLabelName('Is A Round Trip', 'string')}
                        <div style={{ fontSize: '12px', paddingLeft: '18px' }}>
                          (The amount will double)
                        </div>
                      </Checkbox>
                    </Form.Item>
                  </Col>
                  {configuration?.can_attach_receipts ? (
                    <>
                      <Col span={24}>
                        <Row gutter={rowGutter}>
                          <Col
                            span={
                              configuration?.is_display_no_receipt_attached_field
                                ? 15
                                : 24
                            }
                          >
                            <Form.Item
                              label={getLabelName('Receipt Number', 'string')}
                              name='receipt_number'
                              // validateTrigger='onBlur'
                              // trigger='onBlur'
                              className='receipt-number'
                              validateStatus={
                                tripDetailError.hasOwnProperty('receipt_number')
                                  ? 'error'
                                  : 'validating'
                              }
                              help={
                                tripDetailError.hasOwnProperty('receipt_number')
                                  ? tripDetailError.receipt_number[0]
                                  : null
                              }
                              required={
                                (configuration?.is_receipt_mandatory &&
                                  !getMileageExpenseTripFormData.is_no_receipt) ||
                                Boolean(
                                  getMileageExpenseTripFormData.receipt?.length,
                                )
                              }
                              rules={[
                                // {
                                //   required:
                                //     (configuration?.is_receipt_mandatory &&
                                //       !getMileageExpenseTripFormData.is_no_receipt) ||
                                //     Boolean(
                                //       getMileageExpenseTripFormData.receipt
                                //         ?.length,
                                //     ),
                                //   message: stringTemplating(
                                //     {
                                //       label: getLabelName(
                                //         'Receipt Number',
                                //         'string',
                                //       ),
                                //     },
                                //     JSONData.vaidationErrors.generalForm
                                //       .receipt_number.mandatory,
                                //   ),
                                // },
                                () => ({
                                  validator(_, value) {
                                    if (value !== undefined) {
                                      value = value?.trim();
                                    }

                                    if (
                                      (!value || value === undefined) &&
                                      ((configuration?.is_receipt_mandatory &&
                                        !getMileageExpenseTripFormData.is_no_receipt) ||
                                        Boolean(
                                          getMileageExpenseTripFormData.receipt
                                            ?.length,
                                        ))
                                    ) {
                                      return Promise.reject(
                                        stringTemplating(
                                          {
                                            label: getLabelName(
                                              'Receipt Number',
                                              'string',
                                            ),
                                          },
                                          JSONData.vaidationErrors.generalForm
                                            .receipt_number.mandatory,
                                        ),
                                      );
                                    } else {
                                      if (
                                        new RegExp(/^[^@!=\-+#﹘—⸺⸻].*$/).test(
                                          value,
                                        )
                                      ) {
                                        return Promise.resolve();
                                      } else if (!value) {
                                        return Promise.resolve();
                                      }
                                      return Promise.reject(
                                        new Error(
                                          'Can not start with special character',
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
                                disabled={
                                  getMileageExpenseTripFormData.is_no_receipt
                                }
                                onChange={e => {
                                  _checkReceiptMandetoryStatus(e.target.value);
                                }}
                                // value={
                                //   getMileageExpenseTripFormData.receipt_number
                                // }
                              />
                            </Form.Item>
                            {scannedReceiptNumber?.length > 0 &&
                              isEnableOcr &&
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
                            <Col span={8} offset={1}>
                              <Form.Item
                                label=' '
                                name='is_no_receipt'
                                validateTrigger='onBlur'
                                className='no-receipt-checkbox'
                                validateStatus={
                                  tripDetailError.hasOwnProperty(
                                    'is_no_receipt',
                                  )
                                    ? 'error'
                                    : 'validating'
                                }
                                help={
                                  tripDetailError.hasOwnProperty(
                                    'is_no_receipt',
                                  )
                                    ? tripDetailError.is_no_receipt[0]
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
                                  // value={
                                  //   getMileageExpenseTripFormData.is_no_receipt
                                  // }
                                  disabled={Boolean(
                                    (
                                      getMileageExpenseTripFormData.receipt ||
                                      []
                                    ).length,
                                  )}
                                >
                                  {getLabelName('No Receipt')}
                                </Checkbox>
                              </Form.Item>
                            </Col>
                          ) : null}
                        </Row>
                      </Col>
                      {configuration?.is_remark_for_no_receipt_mandatory && (
                        <Col span={24}>
                          <Form.Item
                            label={getLabelName('No Receipt Remark', 'string')}
                            name='no_receipt_remark'
                            validateTrigger='onBlur'
                            // trigger='onBlur'
                            className='no-receipt-remark'
                            validateStatus={
                              tripDetailError.hasOwnProperty(
                                'no_receipt_remark',
                              )
                                ? 'error'
                                : 'validating'
                            }
                            help={
                              tripDetailError.hasOwnProperty(
                                'no_receipt_remark',
                              )
                                ? tripDetailError.no_receipt_remark[0]
                                : null
                            }
                            required={
                              configuration?.is_remark_for_no_receipt_mandatory &&
                              getMileageExpenseTripFormData.is_no_receipt
                            }
                            rules={[
                              () => ({
                                validator(_, value) {
                                  if (value !== undefined) {
                                    value = value?.trim();
                                  }
                                  if (
                                    (!value || value === undefined) &&
                                    configuration?.is_remark_for_no_receipt_mandatory &&
                                    getMileageExpenseTripFormData.is_no_receipt
                                  ) {
                                    return Promise.reject(
                                      stringTemplating(
                                        {
                                          label: getLabelName(
                                            'No Receipt Remark',
                                            'string',
                                          ),
                                        },
                                        JSONData.vaidationErrors.generalForm
                                          .no_receipt_remark.mandatory,
                                      ),
                                    );
                                  } else {
                                    if (
                                      new RegExp(/^[^@!=\-+#﹘—⸺⸻].*$/).test(
                                        value,
                                      )
                                    ) {
                                      return Promise.resolve();
                                    } else if (!value) {
                                      return Promise.resolve();
                                    }
                                    return Promise.reject(
                                      new Error(
                                        'Can not start with special character',
                                      ),
                                    );
                                  }
                                },
                              }),
                            ]}
                          >
                            <Input
                              autoComplete='new-password'
                              // value={
                              //   getMileageExpenseTripFormData.no_receipt_remark
                              // }
                              disabled={
                                !getMileageExpenseTripFormData.is_no_receipt
                              }
                            />
                          </Form.Item>
                        </Col>
                      )}
                    </>
                  ) : null}
                </Row>
              </Form>
            </Col>
            {/* --------------------------- DRAWER FORM (RECEIPT & SUPPORTING DOC) COMPONENT --------------------------- */}
            <Col span={9}>
              <Row gutter={rowGutter}>
                <ReceiptAndSupportDocumentUploader
                  formProps={{
                    ...formCommonProps,
                    form: mileageExpenseTripForm,
                  }}
                  ref={receiptFieldRef}
                  form={mileageExpenseTripForm}
                  formType='MIL'
                  showReceiptComponent={configuration?.can_attach_receipts}
                  receiptFormItemProps={{
                    label: getLabelName('Receipt', 'string'),

                    validateStatus: tripDetailError.hasOwnProperty('receipt')
                      ? 'error'
                      : 'validating',
                    help: tripDetailError.hasOwnProperty('receipt')
                      ? tripDetailError.receipt[0]
                      : null,
                    rules: [
                      {
                        required:
                          configuration?.is_receipt_mandatory &&
                          !getMileageExpenseTripFormData.is_no_receipt,
                        message: stringTemplating(
                          { label: getLabelName('Receipt', 'string') },
                          JSONData.vaidationErrors.generalForm.receipt
                            .mandatory,
                        ),
                      },
                    ],
                  }}
                  extraUploadProps={{
                    disabled: getMileageExpenseTripFormData.is_no_receipt,
                  }}
                  selectedReceipt={
                    getMileageExpenseTripFormData.receipt &&
                    !Array.isArray(getMileageExpenseTripFormData.receipt)
                      ? [getMileageExpenseTripFormData.receipt]
                      : undefined
                  }
                  onReceiptChange={(changeValue: [File | string] | []) => {
                    setMileageExpenseTripFormData((prevState: any) => ({
                      ...prevState,
                      receipt: changeValue.length ? changeValue : [],
                    }));
                    if (changeValue.length === 0) {
                      setLibraryReceipt(null);
                    }
                    onUpdateReceiptDoc(changeValue);
                  }}
                  showSupportingDocument={
                    // false
                    configuration?.is_allow_supporting_documents
                  }
                  supportingDocumentFormItemProps={{
                    label: getLabelName('Supporting Documents', 'doc'),
                  }}
                  supportingDocuments={
                    getMileageExpenseTripFormData.supporting_documents
                      ? Array.isArray(
                          getMileageExpenseTripFormData.supporting_documents,
                        )
                        ? getMileageExpenseTripFormData.supporting_documents
                        : [getMileageExpenseTripFormData.supporting_documents]
                      : undefined
                  }
                  supportingDocumentOnChange={(file: (File | string)[]) => {
                    setMileageExpenseTripFormData((prevState: any) => ({
                      ...prevState,
                      supporting_documents: file,
                    }));
                  }}
                  receiptGallarySelection={receiptGallarySelectionFn}
                  userFieldsForReceiptGallery={{
                    date: getMileageExpenseTripFormData.date,
                    amount:
                      (getMileageExpenseTripFormData?.amount &&
                        Number(getMileageExpenseTripFormData.amount)) ||
                      0,
                    receipt_number:
                      getMileageExpenseTripFormData.receipt_number,
                  }}
                  receiptDisabledFields={
                    configuration?.is_allow_updating_mileage_claims_calculated_amount
                      ? ['currency']
                      : ['currency', 'amount']
                  }
                  isReceiptAllowed={isReceiptAllowed}
                  _scanImage={(file: any) => file && _scanImage(file[0])}
                  scanLoader={scanLoader}
                  is_enabled_ocr={isEnableOcr}
                  ocrReceivedFromGallary={() => {
                    _setScanDateAmount(null, 0, '', {});
                  }}
                  confidence={confidence}
                  warning_msg={warning_msg}
                />
              </Row>
            </Col>
          </Row>
          {/* --------------------------- DRAWER FORM (ACTION BUTTONS) COMPONENT --------------------------- */}
          <Form {...formCommonProps} form={mileageExpenseTripForm}>
            <Row gutter={rowGutter}>
              {viewOnly ? null : (
                <Col span={15}>
                  <Row className='button-container text-right' gutter={[22, 8]}>
                    <Col span={4.5}>
                      {isTripEditMode?.id === null && (
                        <Button
                          type='primary'
                          ghost
                          onClick={handleSaveAndAddMore}
                          // disabled={configuration === null}
                        >
                          <Trans>Save & Add Another</Trans>
                        </Button>
                      )}
                    </Col>
                    <Col span={4.5}>
                      <Button
                        type='primary'
                        onClick={handleSaveClick}
                        // disabled={true}
                      >
                        {isTripEditMode?.id !== null ? (
                          <Trans>Update</Trans>
                        ) : (
                          <Trans>Save</Trans>
                        )}
                      </Button>
                    </Col>
                  </Row>
                </Col>
              )}
            </Row>
          </Form>
        </div>
      </AppDrawer>
      {/* </Form> */}
      <Form {...formCommonProps} form={mileageExpenseTripForm}></Form>
      <MileageTripDetailDrawer
        data={getTripDetails}
        onClose={setTripDetails}
        receiptImageURL={receiptImageURL}
        mode={mode}
        userInfo={userInfo}
        configuration={configuration}
      />
    </Row>
  );
};

const MileageFormForwardRef = forwardRef((props: any, ref?: any) => (
  <MileageForm {...props} _forwardRef={ref} />
));

export default connector(memo(MileageFormForwardRef));
