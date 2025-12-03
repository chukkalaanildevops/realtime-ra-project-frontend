/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  FC,
  memo,
  useRef,
  useState,
  Dispatch,
  forwardRef,
  useEffect,
} from 'react';
import { connect, ConnectedProps } from 'react-redux';
import {
  stateInterface,
  // getCurrencyList,
  getCurrentDelegateUser,
} from '../../../../shared/redux/rootReducer';
import {
  Row,
  Col,
  Button,
  Form,
  DatePicker,
  Select,
  InputNumber,
  Input,
  Table,
  Alert,
  Space,
  Tooltip,
} from 'antd';
import {
  PlusOutlined,
  PaperClipOutlined,
  DeleteOutlined,
  EditOutlined,
  CopyOutlined,
  EllipsisOutlined,
  FullscreenOutlined,
  UpOutlined,
  DownOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import { FormProps, FormInstance } from 'antd/lib/form';

import {
  AppDrawer,
  Amount,
  ReceiptAndSupportDocumentUploader,
  DocumentsViewer,
  DotMenu,
  CustomFieldsForm,
} from '../../../../shared/components';

import {
  getSubmittedRequestDetails,
  isProxyPermissionAllowed,
} from '../../../../shared/redux/rootReducer';
import { PROXY_PERMISSIONS } from '../../../delegate/delegate.model';
import {
  IvalidationError,
  IAllowanceFormData,
  IallowanceRecords,
} from '../../addNewExpense.model';
import {
  fetchLocationList,
  fetchAllowanceRate,
  validationAndUpdationAllowanceDetailsThunkFn,
  fetchAllowanceConversionRate,
} from '../../addNewExpense.thunk';
import {
  updateFormData,
  setDisableSaveSendBtns,
  updateReceiptMandetoryStatus,
  updateTripDetailError,
  receiptDateFieldOnChange,
} from '../../addNewExpense.actions';
import JSONData from '../../addNewExpense.data.json';
import { Trans } from '@lingui/macro';

import './allowanceForm.index.less';
import { CommonFormFields } from '..'; //local components
import AllowanceTripDetailDrawer from '../allowanceTripDetailDrawer/allowanceTripDetailDrawer.index';
import Errors from './allowanceForm.data.json';
import moment, { Moment } from 'moment';
import Big from 'big.js';
import {
  preciseDecimal,
  stringTemplating,
} from '../../../../utils/global.utils';

const mapStateToProps = (state: stateInterface) => {
  const {
    userInfo,
    configuration,
    isAdminEdit,
    mode,
    viewOnly,
    userJobInfo,
    initialReceiptStatus,
    formData,
    expenseTypeList,
    backendError,
    selectedExpenseType,
    expenseTypeListLoader,
    expenseEntitlement,
    expenseClaimFetchedData,
    allowanceTypes,
    locationList,
    tripDetailError,
    fetchedConversionRate,
    is_resubmission_case,
    chargeTo,
    costCenterListLoader,
    costCenterList,
    receiptDateOnChange,
  } = state.AddNewExpenseForm;

  const requestDetails = getSubmittedRequestDetails(state);
  return {
    userInfo,
    configuration,
    isAdminEdit,
    mode,
    viewOnly,
    initialReceiptStatus,
    expenseEntitlement,
    formData,
    expenseTypeList,
    backendError,
    userJobInfo,
    selectedExpenseType,
    expenseTypeListLoader,
    expenseClaimFetchedData,
    locationList,
    allowanceTypes,
    requestDetails,
    tripDetailError,
    fetchedConversionRate,
    is_resubmission_case,
    chargeTo,
    costCenterListLoader,
    costCenterList,
    receiptDateOnChange,
    currentDelegateUser: getCurrentDelegateUser(state),
    isPermissionAllowed: (permission: PROXY_PERMISSIONS) =>
      isProxyPermissionAllowed(state, permission),
  };
};

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
    _validationAndUpdationAllowanceDetailsThunkFn: (
      data: any,
      updateId?: number,
      callBack?: Function,
    ) =>
      dispatch(
        validationAndUpdationAllowanceDetailsThunkFn(data, updateId, callBack),
      ),
    fetchFilteredLocations: (locationListProps: any) =>
      dispatch(fetchLocationList(locationListProps)),
    _fetchAllowanceRate: (allowanceRateProps: any) =>
      dispatch(fetchAllowanceRate(allowanceRateProps)),
    _setDisableSaveSendBtns: (data: any) =>
      dispatch(setDisableSaveSendBtns(data)),
    _updateReceiptMandetoryStatus: (data: boolean) =>
      dispatch(updateReceiptMandetoryStatus(data)),
    _updateTripDetailError: (data: any) =>
      dispatch(updateTripDetailError(data)),
    _fetchConversionRate: (
      date: string,
      target: string,
      base: string,
      callback?: Function,
      // _calledFrom?: string,
    ) => dispatch(fetchAllowanceConversionRate(date, target, base, callback)),
    _receiptDateOnChange: (data: any) =>
      dispatch(receiptDateFieldOnChange(data)),
  };
};

const connector = connect(mapStateToProps, mapDisapatchToProps, null, {
  forwardRef: true,
});
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let Amt;

const AllowanceForm: FC<ConnectedProps<typeof connector> & {
  formInstance: FormInstance;
  getLabelName: Function;
  expenseFormProps: FormProps;
  validationError: IvalidationError;
  showCustomField?: boolean;
  ccThresholdValidations: (amount: number) => void;
  _forwardRef: any;
  requestId: string | null;
}> = props => {
  const {
    configuration,
    getLabelName,
    _forwardRef,
    showCustomField,
    expenseFormProps,
    viewOnly,
    backendError,
    expenseEntitlement,
    isAdminEdit,
    mode,
    expenseTypeList,
    selectedExpenseType,
    expenseTypeListLoader,
    expenseClaimFetchedData,
    locationList,
    allowanceTypes,
    _updateFormData,
    formData,
    fetchFilteredLocations,
    _fetchAllowanceRate,
    userInfo,
    _setDisableSaveSendBtns,
    initialReceiptStatus,
    _updateReceiptMandetoryStatus,
    requestDetails,
    formInstance,
    _validationAndUpdationAllowanceDetailsThunkFn,
    tripDetailError,
    _updateTripDetailError,
    currentDelegateUser,
    _fetchConversionRate,
    fetchedConversionRate,
    is_resubmission_case,
    chargeTo,
    costCenterListLoader,
    userJobInfo,
    costCenterList,
    ccThresholdValidations,
    receiptDateOnChange,
    _receiptDateOnChange,
    isPermissionAllowed,
    //requestId,
  } = props;

  const [getModelVisibility, setModelVisibility] = useState<boolean>(false);
  const [getLibraryReceipt, setLibraryReceipt] = useState<null | number>(null);
  const [getTripDetails, setTripDetails] = useState<null | IallowanceRecords>(
    null,
  );
  const [getCollapsableVisibility, setCollapsableVisibility] = useState<
    boolean
  >(false);
  const [date, setDate] = useState('' || {});
  const [dateOnChange, setDateOnChange] = useState<boolean>(false);
  const [locationId, setLocationId] = useState(undefined);
  const [allowanceTypeId, setAllowanceTypeId] = useState<number | null>(null);
  const [approvedAmount, setApprovedAmount] = useState<number>(0);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [amount, setAmount] = useState<number>(0);
  const [filteredLocations, setFilteredLocations] = useState(locationList);
  const [updateCloneState, setupdateCloneState] = useState<boolean>(false);
  const [amountChange, setAmountChange] = useState<boolean>(false);
  const [onClose, setOnClose] = useState<boolean>(false);
  const [cloneState, setCloneState] = useState<boolean>(false);
  const [systemConversionRate, setSystemConversionRate] = useState<
    number | undefined
  >(1);
  const [recordKey, setRecordKey] = useState(null);
  const receiptFieldRef = useRef<any>(null);

  const isReceiptAllowed = isPermissionAllowed('ACTION_RECEIPT'); //ACTION_RECEIPT

  useEffect(() => {
    if (date && selectedExpenseType?.expense_type?.title && configuration?.id) {
      fetchFilteredLocations({
        date: moment(date).format('DD/MM/YYYY'),
        employee_id:
          mode === 'UPDATE'
            ? expenseClaimFetchedData?.employee?.id
            : currentDelegateUser
            ? currentDelegateUser.on_behalf_of.id
            : userInfo?.id,
        expense_config_id: configuration?.id,
      });
    }
  }, [
    date,
    selectedExpenseType?.expense_type?.title,
    fetchFilteredLocations,
    configuration,
    currentDelegateUser,
    userInfo,
    expenseClaimFetchedData,
    mode,
  ]);

  useEffect(() => {
    if (date && locationId) {
      _fetchAllowanceRate({
        date: moment(date).format('DD/MM/YYYY'),
        location: locationId,
        expense_config_id: configuration?.id,
        employee_id:
          mode === 'UPDATE'
            ? expenseClaimFetchedData?.employee?.id
            : currentDelegateUser
            ? currentDelegateUser.on_behalf_of.id
            : userInfo?.id,
      });
    }
  }, [
    date,
    locationId,
    _fetchAllowanceRate,
    currentDelegateUser,
    userInfo,
    expenseClaimFetchedData,
    mode,
  ]);

  useEffect(() => {
    formData.general_form.date = '';
  }, []);

  useEffect(() => {
    _receiptDateOnChange(false);
  }, [selectedExpenseType]);

  useEffect(() => {
    if (selectedExpenseType && !receiptDateOnChange && mode !== 'UPDATE') {
      formData.general_form.date = '';
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedExpenseType, configuration, formData?.general_form?.date]);
  const [
    supportingDocIdsUpdateAllowance,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setSupportingDocIdsUpdateAllowance,
  ] = useState<any>([]);

  const [isTripEditMode, setTripEditMode] = useState<{
    id: number | null;
    recordType: 'NEW' | 'OLD';
  } | null>(null);

  useEffect(() => {
    setFilteredLocations(locationList);
  }, [locationList]);

  useEffect(() => {
    if (showCustomField) setCollapsableVisibility(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showCustomField]);

  const rowGutter: [number, number] = [16, 16];
  const getRecordObject = (
    value: any,
    keepReceipEvenIfReceiptPickfromGallery: boolean = false,
    dataForBE: boolean = false,
    // eslint-disable-next-line no-unused-vars
    calledFromUpdateNewAllowanceRecordInState: boolean = false,
  ) => {
    const location = locationList.filter(
      (o: any) => o.id === value.location,
    )[0];

    const allowance_rate = allowanceTypes.filter(
      (o: any) => o.id === value.allowance_rate,
    )[0];

    const isUpdate = mode === 'UPDATE';
    const returnObj: any = {
      expense_type_legal_entity:
        formData.general_form.expense_type_legal_entity,
      date: value.date ? value.date.format('DD-MM-YYYY') : '',
      amount: value.amount || 0,
      conversion_rate: value.conversion_rate,
      converted_amount: value.converted_amount,
      receipt: value?.receipt?.length ? value.receipt[0] || null : null,
      receipt_number: value.receipt_number,
      supporting_documents: value?.supporting_documents?.length
        ? value.supporting_documents || null
        : null,
      system_conversion_rate: fetchedConversionRate,
    };

    if (requestDetails || expenseClaimFetchedData?.request) {
      returnObj.request = requestDetails
        ? requestDetails?.id
        : expenseClaimFetchedData?.request?.id;
    }

    if (!dataForBE) {
      returnObj.location = { id: value.location, title: location.title };
    }

    if (!dataForBE) {
      returnObj.approved_amount = value.approved_amount;
    }

    if (!dataForBE) {
      returnObj.allowance_currency = value.allowance_currency;
    }
    if (expenseEntitlement) {
      returnObj.expense_entitlement = expenseEntitlement;
    }
    if (!dataForBE) {
      returnObj.allowance_rate = {
        id: value.allowance_rate,
        subrate_title: allowance_rate?.subrate_title?.title,
      };
    } else {
      returnObj.allowance_rate = value.allowance_rate;
    }

    if (!Boolean(returnObj.receipt)) {
      delete returnObj.receipt;
      delete returnObj.receipt_number;
    }

    // Identify whether receipt is new or old
    if (
      value.receipt &&
      typeof value.receipt[0] === 'string' &&
      !calledFromUpdateNewAllowanceRecordInState
    ) {
      delete returnObj.receipt;
    }

    if (getLibraryReceipt !== null) {
      if (!keepReceipEvenIfReceiptPickfromGallery) delete returnObj.receipt;
      returnObj.library_receipt = getLibraryReceipt;
    }

    if (
      !Boolean(value?.supporting_documents) ||
      value?.supporting_documents?.length === 0
    ) {
      delete returnObj.supporting_documents;
    }

    if (isUpdate && isTripEditMode?.id !== null && dataForBE) {
      const ogRecord = formData.allowance_form.allowance_records.filter(
        (o: any) => o.id === isTripEditMode?.id,
      )[0];
      const newRecord = { ...returnObj };
      if (ogRecord?.supporting_documents) {
        const remainingDoc: number[] = [];
        returnObj.supporting_documents = (
          newRecord.supporting_documents || []
        ).filter((o: any) => {
          if (o.hasOwnProperty('uid')) {
            if (supportingDocIdsUpdateAllowance?.includes(o.uid)) {
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

    tableData = tableData.map((o: IallowanceRecords, i: number) => {
      return {
        ...o,
        key: i,
      };
    });

    return tableData;
  };

  const updateNewAllowanceRecordInState = (value: any) => {
    const updatedRecord = formData.allowance_form.allowance_records.map(
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
      'allowance_records',
      'allowance_form',
      getSortedDataUsingDate(updatedRecord),
    );
    allowanceExpenseTripForm.resetFields();
    setAllowanceExpenseTripFormData(AllowanceExpenseTripFormValues);
    setDate('');
    setLocationId(undefined);
    setAllowanceTypeId(null);
    setupdateCloneState(false);
    setCloneState(false);
    setDateOnChange(false);
  };

  const addNewAllowanceRecordInState = (value: any) => {
    _updateFormData(
      'allowance_records',
      'allowance_form',
      getSortedDataUsingDate([
        ...getRecordObject(value, true, false, true),
        ...formData.allowance_form.allowance_records,
      ]),
    );
    allowanceExpenseTripForm.resetFields();
    setAllowanceExpenseTripFormData(AllowanceExpenseTripFormValues);
    setDate('');
    setLocationId(undefined);
    setAllowanceTypeId(null);
    setupdateCloneState(false);
    setCloneState(false);
    setDateOnChange(false);
  };

  const handleSaveClick = () => {
    setOnClose(true);
    allowanceExpenseTripForm
      .validateFields()
      .then(values => {
        _validationAndUpdationAllowanceDetailsThunkFn(
          getRecordObject(values, undefined, true)[0],
          mode === 'UPDATE' && isTripEditMode?.recordType === 'OLD'
            ? (isTripEditMode?.id as number)
            : undefined,
          async (isSuccess: boolean) => {
            if (isSuccess) {
              isTripEditMode !== null
                ? updateNewAllowanceRecordInState(values)
                : addNewAllowanceRecordInState(values);

              setTripEditMode(null);
              setModelVisibility(false);
              _updateReceiptMandetoryStatus(initialReceiptStatus);
              _updateTripDetailError({});
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              const resetdoc = receiptFieldRef?.current?.resetReceipt();
              allowanceExpenseTripForm.resetFields();
              //setAllowanceExpenseTripFormData(values);
            }
          },
        );
      })
      .catch(errorInfo => {
        console.warn(errorInfo);
      });
  };

  const onUpdate = (_item: any, _index: number) => {
    const date = moment(_item.date, 'DD/MM/YYYY');
    setDate(date);
    setLocationId(_item.location.id);
    setApprovedAmount(_item.approved_amount);
    setAmount(_item.amount);
    setAllowanceTypeId(_item.allowance_rate.id);
    setRecordKey(_item.key);

    const isUpdate = mode === 'UPDATE';
    const _rTVal = _item.id && isUpdate ? 'OLD' : 'NEW';
    setTripEditMode({
      recordType: _rTVal,
      id: isUpdate && _rTVal === 'OLD' ? _item.id : _index,
    });
    setModelVisibility(true);
    setLibraryReceipt(_item.library_receipt || null);
    setValuesToForm({
      date: moment(_item.date, 'DD/MM/YYYY'),
      location: _item.location.id,
      allowance_rate: _item.allowance_rate.id,
      approved_amount: _item.approved_amount || 0,
      amount: _item.amount || 0,
      allowance_currency: _item.allowance_currency,
      conversion_rate: _item.conversion_rate,
      converted_amount: _item.converted_amount,
      receipt:
        isUpdate && _rTVal === 'OLD'
          ? typeof _item.receipt === 'string'
            ? _item.receipt
            : _item.receipt?.file
            ? _item.receipt.file
            : _item.receipt
          : _item.receipt?.file || _item.receipt,
      receipt_number: _item.receipt_number,
      supporting_documents: _item.supporting_documents,
    });
  };

  const clone = (_item: any, _index: number) => {
    const date = moment(_item.date, 'DD/MM/YYYY');
    setDate(date);
    setLocationId(_item.location.id);
    setApprovedAmount(_item.approved_amount);
    setAllowanceTypeId(_item.allowance_rate.id);
    setSystemConversionRate(_item.system_conversion_rate);

    const isUpdate = mode === 'UPDATE';
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _rTVal = _item.id && isUpdate ? 'OLD' : 'NEW';
    setTripEditMode(null);
    setModelVisibility(true);
    setLibraryReceipt(null);
    setValuesToForm({
      date: moment(_item.date, 'DD/MM/YYYY'),
      location: _item.location.id,
      allowance_rate: _item.allowance_rate.id,
      approved_amount: _item.approved_amount || 0,
      amount: _item.amount || 0,
      allowance_currency: _item.allowance_currency,
      conversion_rate: _item.system_conversion_rate,
      converted_amount: _item.converted_amount,
      receipt: AllowanceExpenseTripFormValues.receipt,
      receipt_number: AllowanceExpenseTripFormValues.receipt_number,
      supporting_documents: [],
    });
  };

  const setValuesToForm = (record: any) => {
    setAllowanceExpenseTripFormData(prevState => ({
      ...prevState,
      receipt: record.receipt,
      supporting_documents: record.supporting_documents,
      receipt_number: record.receipt_number,
      amount: record.amount,
      conversion_rate: record.conversion_rate,
      converted_amount: record.converted_amount,
      date: record.date,
    }));
    allowanceExpenseTripForm.setFieldsValue(record);
    setModelVisibility(true);
  };

  const handleAllowanceExpenseFormValueChange = (
    changedValues: any,
    _allValues: any,
  ) => {
    const key: string = Object.keys(changedValues)[0];
    if (key === 'amount') {
      const t_state = {
        ...getAllowanceExpenseTripFormData,
        ...changedValues,
      };
      setAllowanceExpenseTripFormData(t_state);
    } else if (key === 'is_no_receipt') {
      if (changedValues[key]) {
        setAllowanceExpenseTripFormData(prevState => ({
          ...prevState,
          ...changedValues,
          receipt_number: '',
          receipt: null,
        }));
        setTimeout(() => {
          allowanceExpenseTripForm.validateFields([
            'receipt_number',
            'receipt',
          ]);
        }, 100);
      } else {
        setAllowanceExpenseTripFormData(prevState => ({
          ...prevState,
          ...changedValues,
          no_receipt_remark: '',
        }));
      }
      return;
    } else if (key === 'date') {
      Amt = null;
      setAllowanceExpenseTripFormData(prevState => ({
        ...prevState,
        ...changedValues,
      }));
    } else {
      setAllowanceExpenseTripFormData(prevState => ({
        ...prevState,
        ...changedValues,
      }));
    }
  };

  const recordsLength = formData.allowance_form.allowance_records.filter(
    (o: any) => !Boolean(o.id),
  ).length;

  const isMaxRecordAdded = recordsLength === 10;

  const initialAmountState = {
    totalAmount: 0,
    showAmtWarning: false,
    showAmtError: false,
  };
  const [getAmountState, setAmountState] = useState<{
    totalAmount: number;
    showAmtWarning: boolean;
    showAmtError: boolean;
  }>(initialAmountState);

  const calculateRHSSide = () => {
    if (Boolean(formData?.allowance_form?.allowance_records?.length)) {
      let totalAmount: any = [0];

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
        formData.allowance_form.allowance_records,
        'converted_amount',
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

  useEffect(calculateRHSSide, [
    formData.allowance_form.allowance_records,
    configuration,
  ]);

  const receiptImageURL = (f: any) =>
    f.hasOwnProperty('file') && typeof f?.file === 'string'
      ? f?.file
      : typeof f === 'string'
      ? f
      : window.URL.createObjectURL(f || '');

  const columns = [
    {
      title: <Trans>Date</Trans>,
      dataIndex: 'date',
      key: 'date',
      align: 'center' as 'center',
      width: 10,
      render: (text: Moment) =>
        moment.isMoment(text)
          ? text.format('DD/MM/YYYY')
          : moment(text, ['DD/MM/YYYY', 'DD-MM-YYYY']).format('DD/MM/YYYY') ||
            '',
    },
    {
      title: <Trans>Location</Trans>,
      dataIndex: 'location',
      key: 'location',
      align: 'center' as 'center',
      width: 10,
      render: (text: any) => <span className='address'>{text.title}</span>,
    },
    {
      title: <Trans>Allowance Type</Trans>,
      dataIndex: 'allowance_rate',
      key: 'allowance_rate',
      align: 'center' as 'center',
      width: 10,
      render: (text: any) => (
        <span className='address'>{text.subrate_title}</span>
      ),
    },
    {
      title: <Trans>Approved Amount</Trans>,
      dataIndex: 'approved_amount',
      key: 'approved_amount',
      align: 'center' as 'center',
      width: 10,
      render: (text: any) => {
        // const obj = allowanceTypes.filter(
        //   (item: any) => item.id === allowanceTypeId,
        // );
        // return (
        //   <Amount
        //     align='center'
        //     amount={text}
        //     //currency={obj[0].allowance_currency.title}
        //   />
        // );

        return (
          <div>
            <span>
              {text !== undefined && text !== 0 && text !== null
                ? Number(Number(text).toFixed(2))
                : 'Unlimited'}
            </span>
          </div>
        );
      },
    },
    {
      title: <Trans>Amount</Trans>,
      dataIndex: 'amount',
      key: 'amount',
      align: 'center' as 'center',
      width: 10,
      render: (text: any) => {
        //return <Amount align='center' amount={text} />;

        return (
          <div>
            <span>{Number(Number(text).toFixed(2))}</span>
          </div>
        );
      },
    },
    {
      title: <Trans>Currency</Trans>,
      dataIndex: 'allowance_currency',
      key: 'allowance_currency',
      align: 'center' as 'center',
      width: 10,
      render: (text: any) => <span className='address'>{text}</span>,
    },
    {
      title: <Trans>Converted Amount'</Trans>,
      dataIndex: 'converted_amount',
      key: 'converted_amount',
      align: 'center' as 'center',
      width: 10,
      render: (text: any) => (
        <span className='address'>{Number(Number(text).toFixed(2))}</span>
      ),
    },
    {
      title: <Trans>Receipt/s</Trans>,
      dataIndex: 'receipt',
      key: 'receipt',
      align: 'center' as 'center',
      width: 10,
      render: (_file: File | any, _row: any) => {
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
      title: <Trans>Action</Trans>,
      dataIndex: '',
      key: 'action',
      align: 'center' as 'center',
      width: 10,
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
                setupdateCloneState(true);
                setOnClose(false);
                setCloneState(false);
                onUpdate(_item, _index);
              },
            },
            {
              children: <Trans>Clone</Trans>,
              Type: 'link',
              icon: CopyOutlined,
              Disabled: isAdminEdit || isMaxRecordAdded,
              OnClick: () => {
                setupdateCloneState(true);
                setOnClose(false);
                setCloneState(true);
                clone(_item, _index);
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
                  let newRecords = formData.allowance_form.allowance_records;
                  if (recordState === 'OLD') {
                    newRecords = newRecords.filter(
                      (record: any) => record.id !== _item.id,
                    );
                    _updateFormData(
                      'allowance_records',
                      'allowance_form',
                      getSortedDataUsingDate(newRecords),
                    );
                  } else {
                    newRecords = newRecords.filter(
                      (record: any) => record.key !== _item.key,
                    );
                    _updateFormData(
                      'allowance_records',
                      'allowance_form',
                      getSortedDataUsingDate(newRecords),
                    );
                  }
                } else {
                  let newRecords = formData.allowance_form.allowance_records;
                  newRecords = newRecords.filter(
                    (record: any) => record.key !== _item.key,
                  );
                  _updateFormData(
                    'allowance_records',
                    'allowance_form',
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

  const AllowanceExpenseTripFormValues: IAllowanceFormData = {
    date: undefined,
    location: '',
    allowance_rate: '',
    approved_amount: null,
    amount: null,
    receipt: undefined,
    receipt_number: '',
    supporting_documents: [],
    allowance_currency: '',
    conversion_rate: null,
    converted_amount: null,
    system_conversion_rate: null,
  };

  const [
    getAllowanceExpenseTripFormData,
    setAllowanceExpenseTripFormData,
  ] = useState<IAllowanceFormData>(AllowanceExpenseTripFormValues);

  const getOptions = (array: any[]) => {
    return (
      array &&
      array.map(item => (
        <Select.Option key={item.id} value={item.id}>
          {item.title}
        </Select.Option>
      ))
    );
  };

  const getTypeOptions = (array: any[]) => {
    return (
      array &&
      array.map(item => (
        <Select.Option key={item.id} value={item.id}>
          {item.subrate_title?.title}
        </Select.Option>
      ))
    );
  };

  const calculateAmountUsingConversionRate = (conversion_rate?: number) => {
    if (configuration) {
      const _amount = allowanceExpenseTripForm.getFieldValue('amount');
      const _conversionRate = conversion_rate;
      // const _convertedAmount = formData.converted_amount;
      const convertedAmount = Number(
        Big(Number(_amount))
          .times(Number(_conversionRate))
          .round(2)
          .valueOf(),
      );

      // setAllowanceExpenseTripFormData(prevState => ({
      //   ...prevState,
      //   conversion_rate: _conversionRate,
      // }));

      allowanceExpenseTripForm.setFieldsValue({
        conversion_rate: _conversionRate,
      });
      setAllowanceExpenseTripFormData(prevState => ({
        ...prevState,
        converted_amount: convertedAmount,
      }));
      allowanceExpenseTripForm.setFieldsValue({
        converted_amount: convertedAmount,
      });
    }
  };

  useEffect(() => {
    if (
      selectedExpenseType &&
      getAllowanceExpenseTripFormData?.allowance_currency
    ) {
      _fetchConversionRate(
        moment(getAllowanceExpenseTripFormData.date).format('DD-MM-YYYY'),
        selectedExpenseType.legal_entity.currency.currency.code,
        getAllowanceExpenseTripFormData?.allowance_currency,
      );
    }
  }, [
    getAllowanceExpenseTripFormData?.allowance_currency,
    selectedExpenseType,
  ]);

  useEffect(() => {
    if (allowanceTypeId && allowanceTypes?.length) {
      const obj = allowanceTypes.find(
        (item: any) => item.id === allowanceTypeId,
      );
      allowanceExpenseTripForm.setFieldsValue({
        approved_amount: obj?.amount,
      });

      allowanceExpenseTripForm.setFieldsValue({
        allowance_currency: obj?.allowance_currency.title,
      });

      if (
        obj?.is_full_amount_allowed &&
        obj?.is_update_allowed &&
        !updateCloneState
      ) {
        allowanceExpenseTripForm.setFieldsValue({ amount: null });
      }

      if (!obj?.is_full_amount_allowed && !updateCloneState) {
        allowanceExpenseTripForm.setFieldsValue({
          amount: obj?.amount,
        });
      }
      setApprovedAmount(obj?.amount);
      setAmount(obj?.amount);

      setAllowanceExpenseTripFormData(prevState => ({
        ...prevState,
        amount: obj?.amount,
        allowance_currency: obj?.allowance_currency.title,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allowanceTypeId, allowanceTypes]);

  const addMoreButtonDisabledProps: boolean =
    configuration === null ||
    !Boolean(formData.general_form.expense_type_legal_entity) ||
    isMaxRecordAdded ||
    isAdminEdit;

  const [allowanceExpenseTripForm] = Form.useForm();
  const formCommonProps: FormProps = {
    form: allowanceExpenseTripForm,
    scrollToFirstError: true,
    size: 'middle',
    layout: 'vertical',
    colon: false,
    autoComplete: 'off',
    onValuesChange: handleAllowanceExpenseFormValueChange,
  };

  const handleAddMoreClick = () => {
    setOnClose(false);
    setAllowanceExpenseTripFormData(AllowanceExpenseTripFormValues);
    setModelVisibility(true);
    allowanceExpenseTripForm.resetFields();
    setAllowanceExpenseTripFormData(prevState => ({
      ...prevState,
      conversion_rate: 1,
    }));
    allowanceExpenseTripForm.setFieldsValue({ conversion_rate: 1 });
    setLibraryReceipt(null);
    setOnClose(false);
  };

  const receiptGallarySelectionFn = (file: any, keysArr: string[]) => {
    const data: any = {};
    keysArr.forEach((o: string) => {
      if (file.hasOwnProperty(o)) {
        if (o === 'date') {
          data[o] = moment(file[o], 'DD/MM/YYYYY');
        } else if (o === 'amount') {
          data[o] = Number(file[o]);
          Amt = data[o];
        } else if (o === 'receipt_number') {
          data[o] = file[o];
        }
      }
    });
    setLibraryReceipt(file.id);
    const t_state = {
      ...getAllowanceExpenseTripFormData,
      ...data,
      receipt: [file],
    };

    setAllowanceExpenseTripFormData(t_state);

    allowanceExpenseTripForm.setFieldsValue({
      date: data.date ? data.date : getAllowanceExpenseTripFormData.date,
      amount: allowanceTypeObj
        ? allowanceTypeObj?.is_update_allowed
          ? data.amount
            ? data.amount
            : getAllowanceExpenseTripFormData.amount
          : amount
        : data.amount
        ? data.amount
        : getAllowanceExpenseTripFormData.amount,
      receipt_number: data.receipt_number
        ? data.receipt_number
        : getAllowanceExpenseTripFormData.receipt_number,
    });
  };

  useEffect(() => {
    if (!amountChange && !onClose && !updateCloneState && allowanceTypeId) {
      calculateAmountUsingConversionRate(fetchedConversionRate || 1);
    }
  }, [
    allowanceExpenseTripForm.getFieldValue('amount'),
    fetchedConversionRate,
    allowanceTypeId,
  ]);

  useEffect(() => {
    if (
      allowanceExpenseTripForm.getFieldValue('conversion_rate') &&
      allowanceExpenseTripForm.getFieldValue('amount')
    ) {
      calculateAmountUsingConversionRate(
        allowanceExpenseTripForm.getFieldValue('conversion_rate'),
      );
    }
  }, [
    allowanceExpenseTripForm.getFieldValue('conversion_rate'),
    allowanceExpenseTripForm.getFieldValue('amount'),
  ]);
  useEffect(() => {
    if (cloneState) {
      calculateAmountUsingConversionRate(systemConversionRate);
    }
  }, [cloneState]);

  useEffect(() => {
    if (dateOnChange) {
      const result = allowanceTypes.find(
        (type: any) =>
          type.id === allowanceExpenseTripForm.getFieldValue('allowance_rate'),
      );

      const value = result ? true : false;

      if (value === false) {
        allowanceExpenseTripForm.setFieldsValue({
          location: null,
        });
        allowanceExpenseTripForm.setFieldsValue({
          allowance_rate: null,
        });
        allowanceExpenseTripForm.setFieldsValue({
          amount: null,
        });
        allowanceExpenseTripForm.setFieldsValue({
          approved_amount: null,
        });
        allowanceExpenseTripForm.setFieldsValue({
          allowance_currency: null,
        });
        allowanceExpenseTripForm.setFieldsValue({
          conversion_rate: 1,
        });
        allowanceExpenseTripForm.setFieldsValue({
          converted_amount: null,
        });
        setAllowanceTypeId(null);
      }
    }
  }, [dateOnChange, allowanceTypes]);

  const onUpdateReceiptDoc = (value: any) => {
    if (!initialReceiptStatus) {
      if (
        (value && value.length > 0) ||
        getAllowanceExpenseTripFormData.receipt_number
      ) {
        _updateReceiptMandetoryStatus(true);
      } else {
        _updateReceiptMandetoryStatus(false);
      }
    }
  };

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
              current <=
              moment()
                .subtract(configuration?.backdated_claim_period_in_days, 'days')
                .endOf('day');
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

  const allowanceTypeObj = allowanceTypes.find(
    (o: any) => o.id === allowanceTypeId,
  );

  const handleLocationSearch = (value: string) => {
    const filtered = locationList.filter(
      (item: any) => item.title.toLowerCase().indexOf(value.toLowerCase()) > -1,
    );
    setFilteredLocations(filtered);
  };

  return (
    <Row gutter={rowGutter} className='allowance-form-section'>
      {/* --------------------------- ALLOWANCE TOP GREY SECTION --------------------------- */}
      <Col span={24}>
        <Row gutter={rowGutter} className='general-fields-section'>
          {/* --------------------------- ALLOWANCE TOP GREY(LHS) SECTION --------------------------- */}
          <Col sm={12} md={14} lg={15} xl={17}>
            <Row gutter={rowGutter}>
              <Col span={18}>
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
                  formType='ALW'
                  form={formInstance}
                  expenseClaimFetchedData={expenseClaimFetchedData}
                />
              </Col>
              {configuration?.is_allow_purpose ? (
                <Col xl={8} md={24} sm={24}>
                  <Form.Item
                    label={<Trans>Purpose</Trans>}
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
              {configuration?.is_allow_charging_to_cost_centres ? (
                <>
                  {!configuration?.is_default_to_employee_cost_centre ? (
                    <Col xl={8} md={12} sm={24}>
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
                  <Col
                    xl={
                      configuration?.is_employee_cost_centre_readonly ? 18 : 8
                    }
                    md={12}
                    sm={24}
                  >
                    <CommonFormFields.CostCentre
                      amount={getAmountState.totalAmount || 0}
                      formData={formData}
                      viewOnly={viewOnly}
                      getLabelName={getLabelName}
                      backendError={backendError}
                      JSONData={JSONData}
                      configuration={configuration}
                      costCenterListLoader={costCenterListLoader}
                      mode={mode}
                      userJobInfo={userJobInfo}
                      expenseClaimFetchedData={expenseClaimFetchedData}
                      costCenterList={costCenterList}
                    />
                  </Col>
                </>
              ) : null}
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
            </Row>
          </Col>
          {/* --------------------------- ALLOWANCE TOP GREY(RHS) SECTION --------------------------- */}
          <Col sm={12} md={10} lg={9} xl={7}>
            <div className='amount-section'>
              <Row gutter={0} align='middle'>
                <Col span={11} className='lhs-label'>
                  <Trans>Total</Trans>
                </Col>
                <Col
                  span={13}
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
                    // currency={
                    //   selectedExpenseType !== null
                    //     ? selectedExpenseType.legal_entity?.currency?.currency
                    //         ?.code
                    //     : ''
                    // }
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
      {/* --------------------------- ALLOWANCE DATA TABLE & ADD MORE BUTTON SECTION --------------------------- */}
      <Col span={24}>
        <Row gutter={rowGutter}>
          {formData?.allowance_form?.allowance_records?.length > 0 ? (
            <Col span={24} className='allowance-data-table'>
              <Table
                scroll={{
                  x: true,
                }}
                dataSource={formData.allowance_form.allowance_records}
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
              <PlusOutlined /> <Trans>Add Allowance</Trans>
            </Button>
            {isMaxRecordAdded ? (
              <Alert
                message='Maximum 10 allowance details allowed to add. Save and then Update to add more records.'
                type='info'
              />
            ) : null}
            {getAmountState.showAmtError ? (
              <Alert
                message={
                  preciseDecimal(Number(configuration?.max_amount), 2) >
                  preciseDecimal(Number(configuration?.min_amount), 2)
                    ? `Total Amount should be between ${preciseDecimal(
                        Number(configuration?.min_amount),
                        2,
                      )} - ${preciseDecimal(
                        Number(configuration?.max_amount),
                        2,
                      )}`
                    : `Total Amount should be greater than or equal to ${preciseDecimal(
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
      <AppDrawer
        visible={getModelVisibility}
        destroyOnClose={true}
        closable={true}
        maskClosable={false}
        onClose={() => {
          allowanceExpenseTripForm.resetFields();
          setAllowanceExpenseTripFormData(AllowanceExpenseTripFormValues);
          setDate('');
          setLocationId(undefined);
          setAllowanceTypeId(null);
          setModelVisibility(false);
          setupdateCloneState(false);
          setTripEditMode(null);
          _updateReceiptMandetoryStatus(initialReceiptStatus);
          _updateTripDetailError({});
          setAmountChange(false);
          setOnClose(true);
          setCloneState(false);
          setDateOnChange(false);
        }}
        title={
          selectedExpenseType?.expense_type?.title
            ? `${selectedExpenseType?.expense_type?.title}`
            : ''
        }
        showCancelButton={false}
        showOkButton={false}
        getContainer='.allowance-form-section'
        width='60%'
      >
        <div className='drawer-form'>
          <Row justify='space-between'>
            {/* --------------------------- DRAWER FORM (GENERAL) COMPONENT --------------------------- */}
            <Col span={12}>
              <Form
                name='allowanceExpenseForm'
                form={allowanceExpenseTripForm}
                {...formCommonProps}
              >
                <Space direction='vertical' size='middle'>
                  <Col span={12}>
                    <Form.Item
                      label={getLabelName('Date', 'string')}
                      name='date'
                      validateTrigger='onBlur'
                      className='receipt-date'
                      validateStatus={
                        tripDetailError.hasOwnProperty('date')
                          ? 'error'
                          : 'validating'
                      }
                      help={
                        tripDetailError.hasOwnProperty('date')
                          ? tripDetailError.date[0]
                          : null
                      }
                      rules={[
                        {
                          required: true,
                          message: Errors.DATE_REQUIRED,
                        },
                      ]}
                    >
                      <DatePicker
                        format='DD/MM/YYYY'
                        disabledDate={disabledDate.bind(null, true)}
                        onChange={(date: any) => {
                          setDate(date);
                          setDateOnChange(true);
                        }}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item
                      label={<Trans>Location</Trans>}
                      name='location'
                      rules={[
                        {
                          required: true,
                          message: Errors.LOCATION_REQUIRED,
                        },
                      ]}
                    >
                      <Select
                        data-test='location-search'
                        showSearch
                        filterOption={false}
                        onSearch={handleLocationSearch}
                        disabled={locationList?.length === 0}
                        onSelect={() => setFilteredLocations(locationList)}
                        onChange={(value: any) => {
                          setLocationId(value);
                          setAllowanceTypeId(null);
                          setDateOnChange(false);
                          allowanceExpenseTripForm.setFieldsValue({
                            allowance_rate: null,
                          });
                          allowanceExpenseTripForm.setFieldsValue({
                            amount: null,
                          });
                          allowanceExpenseTripForm.setFieldsValue({
                            approved_amount: null,
                          });
                          allowanceExpenseTripForm.setFieldsValue({
                            allowance_currency: null,
                          });
                          allowanceExpenseTripForm.setFieldsValue({
                            conversion_rate: 1,
                          });
                          allowanceExpenseTripForm.setFieldsValue({
                            converted_amount: null,
                          });
                        }}
                      >
                        {getOptions(filteredLocations)}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item
                      label={<Trans>Allowance Type</Trans>}
                      name='allowance_rate'
                      rules={[
                        {
                          required: true,
                          message: Errors.ALLOWANCETYPE_REQUIRED,
                        },
                      ]}
                    >
                      <Select
                        data-test='allowancetype-search'
                        showSearch
                        filterOption={false}
                        onChange={(value: any) => {
                          setAllowanceTypeId(value);
                          _updateTripDetailError({});
                          setupdateCloneState(false);
                          setCloneState(false);
                          setAmountChange(false);
                        }}
                        disabled={!locationId}
                      >
                        {getTypeOptions(allowanceTypes)}
                      </Select>
                    </Form.Item>
                  </Col>
                  {allowanceTypeObj?.is_full_amount_allowed ? null : (
                    <Col span={24}>
                      <Form.Item
                        label={getLabelName('Approved Amount', 'string')}
                        name='approved_amount'
                        validateTrigger='onBlur'
                        className='approved_amount'
                        rules={[
                          {
                            required: true,
                            message: Errors.APPROVEDAMOUNT_REQUIRED,
                          },
                        ]}
                      >
                        <InputNumber
                          min={0}
                          precision={2}
                          style={{ width: '100%' }}
                          disabled={true}
                          maxLength={15}
                        />
                      </Form.Item>
                    </Col>
                  )}
                  <Col span={24}>
                    <Form.Item
                      label={getLabelName('Amount', 'string')}
                      name='amount'
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
                          required: true,
                          message: Errors.RECEIPTAMOUNT_REQUIRED,
                        },
                        () => ({
                          validator(_rule, value) {
                            if (
                              value &&
                              approvedAmount &&
                              !allowanceTypeObj?.is_full_amount_allowed
                            ) {
                              if (
                                Number(Number(value).toFixed(2)) >
                                Number(Number(approvedAmount).toFixed(2))
                              ) {
                                return Promise.reject(
                                  `Amount should not be greater than approved amount`,
                                );
                              }
                            }
                            if (value === 0) {
                              return Promise.reject(
                                `Amount should be greater than 0`,
                              );
                            }
                            return Promise.resolve();
                          },
                        }),
                      ]}
                    >
                      <InputNumber
                        autoComplete='new-password'
                        style={{ width: '100%' }}
                        precision={2}
                        min={0}
                        maxLength={15}
                        disabled={
                          allowanceTypeId
                            ? !allowanceTypeObj?.is_update_allowed
                            : false
                        }
                        onChange={(value: any) => {
                          allowanceExpenseTripForm.setFieldsValue({
                            amount: value,
                          });
                          calculateAmountUsingConversionRate(
                            allowanceExpenseTripForm.getFieldValue(
                              'conversion_rate',
                            ),
                          );
                          setAmountChange(true);
                        }}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item
                      label={getLabelName('Currency', 'string')}
                      name='allowance_currency'
                      validateTrigger='onBlur'
                      className='allowance_currency'
                      rules={[
                        {
                          required: true,
                          message: Errors.CURRENCY_REQUIRED,
                        },
                      ]}
                    >
                      <Input style={{ width: '100%' }} disabled={true} />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item
                      label={
                        <div className='default-value-btn-parent'>
                          <span>{<Trans>Conversion Rate</Trans>}</span>
                          <Tooltip
                            // title={
                            //   Number(
                            //     expenseClaimFetchedData?.system_conversion_rate ||
                            //       1,
                            //   ).toFixed(4) || 1
                            // }
                            title={fetchedConversionRate.toFixed(4) || 1}
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
                      rules={[
                        {
                          required: true,
                          message: Errors.CONVERSION_RATE_REQUIRED,
                        },
                        () => ({
                          validator(_rule, value) {
                            if (selectedExpenseType) {
                              if (
                                selectedExpenseType?.legal_entity.currency
                                  .currency.code ===
                                  getAllowanceExpenseTripFormData?.allowance_currency &&
                                Number(Number(value).toFixed(4)) !==
                                  Number(Number(1).toFixed(4))
                              ) {
                                return Promise.reject(
                                  `Conversion rate cannot be changed as local currency is selected`,
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
                        precision={4}
                        maxLength={15}
                        step={0.1}
                        style={{ width: '100%' }}
                        min={0}
                        onChange={(value: any) => {
                          calculateAmountUsingConversionRate(value);
                          allowanceExpenseTripForm.setFieldsValue({
                            convesion_rate: value,
                          });
                          setAllowanceExpenseTripFormData(prevState => ({
                            ...prevState,
                            conversion_rate: value,
                          }));
                        }}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item
                      label={
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                          }}
                        >
                          <span>{<Trans>Converted Expense Amount</Trans>}</span>

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
                    >
                      <div className='prefix-currency'>
                        {selectedExpenseType !== null && (
                          <span
                            className='prefix-value'
                            title={`${selectedExpenseType?.legal_entity
                              ?.currency?.currency?.title || ''} (${
                              selectedExpenseType?.legal_entity?.currency
                                ?.currency.code
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
                              value={Number(
                                getAllowanceExpenseTripFormData?.converted_amount,
                              )}
                            />
                          </Form.Item>
                        </span>
                      </div>
                    </Form.Item>
                  </Col>
                  {configuration?.can_attach_receipts ? (
                    <Col>
                      <Form.Item
                        // label={getLabelName(
                        //   <Trans>Receipt Number</Trans>,
                        //   'string',
                        // )}
                        label={<Trans>Receipt Number</Trans>}
                        name='receipt_number'
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
                        rules={[
                          {
                            required:
                              allowanceTypeObj?.is_receipt_mandatory ||
                              Boolean(
                                getAllowanceExpenseTripFormData.receipt?.length,
                              ),
                            message: Errors.RECEIPTNUMBER_REQUIRED,
                          },
                          () => ({
                            validator(_rule, value) {
                              if (value && value !== undefined) {
                                if (value.trim().length > 64) {
                                  return Promise.reject(
                                    new Error(
                                      'Ensure this field has no more than 64 characters.',
                                    ),
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
                          style={{ width: '100%' }}
                          disabled={isAdminEdit}
                        />
                      </Form.Item>
                    </Col>
                  ) : null}
                </Space>
              </Form>
            </Col>

            {/* --------------------------- DRAWER FORM (RECEIPT & SUPPORTING DOC) COMPONENT --------------------------- */}

            <Col span={10}>
              <Row gutter={rowGutter}>
                <ReceiptAndSupportDocumentUploader
                  formProps={{
                    ...formCommonProps,
                    form: allowanceExpenseTripForm,
                  }}
                  form={allowanceExpenseTripForm}
                  formType='ALW'
                  //showReceiptComponent={false}
                  showReceiptComponent={
                    configuration?.can_attach_receipts && getModelVisibility
                  }
                  ref={receiptFieldRef}
                  receiptFormItemProps={{
                    label: getLabelName('Receipt', 'string'),
                    rules: [
                      {
                        required:
                          allowanceTypeObj?.is_receipt_mandatory ||
                          Boolean(
                            getAllowanceExpenseTripFormData.receipt_number,
                          ),
                        message: Errors.RECEIPT_REQUIRED,
                      },
                    ],
                  }}
                  onReceiptChange={(changeValue: [File | string] | []) => {
                    setAllowanceExpenseTripFormData(prevState => ({
                      ...prevState,
                      receipt: changeValue.length ? changeValue : [],
                    }));
                    if (changeValue.length === 0) {
                      setLibraryReceipt(null);
                    }
                    onUpdateReceiptDoc(changeValue);
                  }}
                  selectedReceipt={
                    getAllowanceExpenseTripFormData.receipt &&
                    !Array.isArray(getAllowanceExpenseTripFormData.receipt)
                      ? [getAllowanceExpenseTripFormData.receipt]
                      : undefined
                  }
                  receiptGallarySelection={receiptGallarySelectionFn}
                  userFieldsForReceiptGallery={{
                    date: getAllowanceExpenseTripFormData.date,
                    amount: getAllowanceExpenseTripFormData.amount || 0,
                    receipt_number:
                      getAllowanceExpenseTripFormData.receipt_number,
                  }}
                  receiptDisabledFields={
                    allowanceTypeObj
                      ? !allowanceTypeObj?.is_update_allowed
                        ? ['currency', 'amount']
                        : ['currency']
                      : ['currency']
                  }
                  showSupportingDocument={
                    configuration?.is_allow_supporting_documents
                  }
                  supportingDocumentFormItemProps={{
                    label: getLabelName('Supporting Documents', 'doc'),
                  }}
                  supportingDocuments={
                    getAllowanceExpenseTripFormData.supporting_documents
                      ? Array.isArray(
                          getAllowanceExpenseTripFormData.supporting_documents,
                        )
                        ? getAllowanceExpenseTripFormData.supporting_documents
                        : [getAllowanceExpenseTripFormData.supporting_documents]
                      : undefined
                  }
                  supportingDocumentOnChange={(file: (File | string)[]) => {
                    setAllowanceExpenseTripFormData(prevState => ({
                      ...prevState,
                      supporting_documents: file,
                    }));
                  }}
                  isReceiptAllowed={isReceiptAllowed}
                />
              </Row>
            </Col>
          </Row>
          {/* --------------------------- DRAWER FORM (ACTION BUTTONS) COMPONENT --------------------------- */}
          <Form {...formCommonProps}>
            <Row gutter={rowGutter}>
              <Col span={15}>
                <Row className='button-container text-right' gutter={[22, 8]}>
                  <Col span={4.5}>
                    {isTripEditMode?.id === null && (
                      <Button
                        type='primary'
                        ghost
                        //onClick={handleSaveAndAddMore}
                        // disabled={configuration === null}
                      >
                        <Trans>Save & Add Another</Trans>
                      </Button>
                    )}
                  </Col>
                  <Col span={9}>
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
            </Row>
          </Form>
        </div>
      </AppDrawer>
      {/* </Form> */}
      <Form {...formCommonProps} form={allowanceExpenseTripForm}></Form>
      <AllowanceTripDetailDrawer
        data={getTripDetails}
        onClose={setTripDetails}
        receiptImageURL={receiptImageURL}
        mode={mode}
        userInfo={userInfo}
      />
    </Row>
  );
};

const AllowanceFormForwardRef = forwardRef((props: any, ref?: any) => (
  <AllowanceForm {...props} _forwardRef={ref} />
));

export default connector(memo(AllowanceFormForwardRef));
