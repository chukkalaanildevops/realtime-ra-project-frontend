import {
  Alert,
  Button,
  Col,
  DatePicker,
  Form,
  FormProps,
  Input,
  InputNumber,
  message,
  Pagination,
  Row,
  Select,
  Space,
  Table,
  Tag,
  Tooltip,
} from 'antd';
import React, {
  Dispatch,
  FC,
  memo,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react';
import uuid from 'react-uuid';
import { connect, ConnectedProps } from 'react-redux';
import Errors from '../allowanceNew/allowanceNew.data.json';
import {
  getCurrentDelegateUser,
  getSubmittedRequestDetails,
  isProxyPermissionAllowed,
  stateInterface,
} from '../../../../shared/redux/rootReducer';
import { GetLabelName, GetSkeleton } from '..';
import JSONData from '../../addNewExpense.data.json';
import '../../../addNewExpense/components/allowanceNew/allowanceNew.index.less';
import { fetchProfileDataAPI } from '../../../../services/profile';
import { AxiosResponse } from 'axios';
import { setCurrentEmployee } from '../../../admin/admin.actions';
import {
  addUpdateAllowanceTripFormData,
  addUpdateFormData,
  allowanceTripFormOnChangeStatus,
  resetAllowanceFormData,
  resetToAllowanceInitial,
  setDateDifference,
  setSelectedExpenseTypeForAllowance,
  updateBackendError,
  updateReceiptMandetoryStatusAllowance,
  setDefaultApprovedAmount,
  setUUIDForAllowance,
  setDataForEditCloneTripForm,
  setCreateUpdateRecordResponseData,
  setSaveAndAddAnotherButtonStatus,
  setAllowanceRecordsId,
  setIsCreatedNewAllowanceRecord,
} from './allowanceNew.actions';
import { FilterBar, ViolationDetails } from '../../../../shared/components';
import {
  fetchAllowanceConversionRate,
  fetchAllowanceLocationList,
  fetchAllowanceRates,
  fetchCostCentreListAllowance,
  fetchDetailConfigurationForAllowance,
  sendAllowanceExpenseClaim,
  updateAllowanceExpenseClaim,
  creationAndUpdationAllowanceRecordsThunkFn,
  deleteAllowanceRecord,
  allowanceRecordsTableList,
  allowanceRecordsTableListUpdate,
  editCloneAllowanceRecordData,
  totalAmountCountForAddMode,
  totalAmountCountForUpdateMode,
  fetchAllowanceExpenseClaimViolationCheckerData,
} from './allowanceNew.thunk';
import {
  preciseDecimal,
  scrollToElem,
  stringTemplating,
} from '../../../../utils/global.utils';
import {
  Amount,
  AppDrawer,
  CustomFieldsForm,
  DocumentsViewer,
  DotMenu,
  ReceiptAndSupportDocumentUploader,
} from '../../../../shared/components';
import {
  CopyOutlined,
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
  EllipsisOutlined,
  InfoCircleOutlined,
  FullscreenOutlined,
  PaperClipOutlined,
  PlusOutlined,
  UpOutlined,
} from '@ant-design/icons';
import Big from 'big.js';
import { Trans } from '@lingui/macro';
import moment, { Moment } from 'moment';
import AllowanceTripDetailsDrawer from '../allowanceNewTripDetailDrawer/allowanceNewTripDetailDrawer.index';
import { scanImage } from '../../../receipt/receipt.thunk';
import { setScanDateAmount } from '../../../receipt/receipt.action';
import { PROXY_PERMISSIONS } from '../../../delegate/delegate.model';
import { IConfirmationInfo } from '../../../app/app.model';
import {
  resetConfirmationInfo,
  setConfirmationInfo,
} from '../../../app/app.actions';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { appPath } from '../../../app/app.routes';
import { IchargeToInnerObj, TchargeToCodes } from '../../addNewExpense.model';
import { TchargeToCodesForFetch } from './allowanceNew.model';
import { debounce } from 'lodash';
import { getQueryParametersAsObject } from '../../../../utils/global.utils';
import { setIsViolationModalData } from '../../addNewExpense.actions';
let is_enabled_ocr = false;

const mapStateToProps = (state: stateInterface) => {
  const {
    isAdminEdit,
    mode,
    viewOnly,
    activeTabKey,
    userInfo,
    isForRequest,
    updateId,
    requestId,
    userJobInfo,
    violationModalData,
  } = state.AddNewExpenseForm;
  const {
    scanLoader,
    isHandwritten,
    scannedAmount,
    scannedCurrency,
    scannedReceiptDate,
    scannedReceiptNumber,
    confidence,
    warning_msg,
  } = state.receipt;

  const {
    selectedExpenseTypeForAllowance,
    allowanceConfiguration,
    backendError,
    expenseTypeListAllowance,
    expenseTypeListLoaderAllowance,
    expenseClaimFetchedDataAllowance,
    formDataAllowance,
    initialReceiptStatus,
    tripFormData,
    tripFormOnChangeStatus,
    locationList,
    allowanceTypes,
    fetchedConversionRate,
    expenseEntitlement,
    dateDifference,
    allowanceTripDetailsLoader,
    chargeToForAllowance,
    costCentreListForAllowance,
    costCentreListLoaderForAllowance,
    defaultApprovedAmount,
    uuidForAllowance,
    dataForEditCloneTripForm,
    createUpdateRecordResponseData,
    saveAndAddAnotherBtnStatus,
    totalAmountCount,
    isLoadingAllowance,
    allowanceRecordsId,
    allowanceRecordsDeleteId,
    isCreatedNewAllowanceRecord,
  } = state.AllowanceNewReducer;
  const {
    tenantConfig,
    isEnableTrafficLightFeatureForTenantFeatures,
  } = state.configuration;

  const requestDetails = getSubmittedRequestDetails(state);

  return {
    isAdminEdit,
    mode,
    backendError,
    selectedExpenseTypeForAllowance,
    allowanceConfiguration,
    viewOnly,
    requestDetails,
    expenseTypeListAllowance,
    expenseTypeListLoaderAllowance,
    expenseClaimFetchedDataAllowance,
    activeTabKey,
    formDataAllowance,
    initialReceiptStatus,
    tripFormData,
    tripFormOnChangeStatus,
    locationList,
    userInfo,
    allowanceTypes,
    fetchedConversionRate,
    expenseEntitlement,
    dateDifference,
    isForRequest,
    updateId,
    requestId,
    allowanceTripDetailsLoader,
    chargeToForAllowance,
    userJobInfo,
    costCentreListForAllowance,
    costCentreListLoaderForAllowance,
    defaultApprovedAmount,
    uuidForAllowance,
    dataForEditCloneTripForm,
    createUpdateRecordResponseData,
    saveAndAddAnotherBtnStatus,
    totalAmountCount,
    isLoadingAllowance,
    scanLoader,
    isHandwritten,
    scannedAmount,
    scannedCurrency,
    scannedReceiptDate,
    scannedReceiptNumber,
    confidence,
    warning_msg,
    tenantConfig,
    allowanceRecordsId,
    allowanceRecordsDeleteId,
    isCreatedNewAllowanceRecord,
    currentDelegateUser: getCurrentDelegateUser(state),
    isPermissionAllowed: (permission: PROXY_PERMISSIONS) =>
      isProxyPermissionAllowed(state, permission),
    isEnableTrafficLightFeatureForTenantFeatures,
    violationModalData,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  return {
    _setSelectedExpenseTypeForAllowance: (
      selectedExpenseTypeForAllowance: any,
    ) =>
      dispatch(
        setSelectedExpenseTypeForAllowance(selectedExpenseTypeForAllowance),
      ),
    _fetchDetailConfigurationForAllowance: (id: number, callback?: Function) =>
      dispatch(fetchDetailConfigurationForAllowance(id, callback)),
    _resetAllowanceFormData: () => dispatch(resetAllowanceFormData()),
    _addUpdateFormData: (key: string, value: any) =>
      dispatch(addUpdateFormData(key, value)),
    _addUpdateAllowanceTripFormData: (key: string, value: any) =>
      dispatch(addUpdateAllowanceTripFormData(key, value)),
    _updateReceiptMandetoryStatusAllowance: (data: boolean) =>
      dispatch(updateReceiptMandetoryStatusAllowance(data)),
    _allowanceTripFormOnChangeStatus: (key: string, value: any) =>
      dispatch(allowanceTripFormOnChangeStatus(key, value)),
    _fetchFilteredAllowanceLocations: (locationListProps: any) =>
      dispatch(fetchAllowanceLocationList(locationListProps)),
    _fetchAllowanceRates: (allowanceRateProps: any) =>
      dispatch(fetchAllowanceRates(allowanceRateProps)),
    _fetchConversionRate: (
      date: string,
      target: string,
      base: string,
      callback?: Function,
      // _calledFrom?: string,
    ) => dispatch(fetchAllowanceConversionRate(date, target, base, callback)),
    _updateBackendError: (data: any) => dispatch(updateBackendError(data)),
    _creationAndUpdationAllowanceRecordsThunkFn: (
      data: any,
      updateTripState: boolean,
      updateTripId: any,
      allowanceClaimId: any,
      page?: number,
      pageSize?: number,
      callBack?: Function,
    ) =>
      dispatch(
        creationAndUpdationAllowanceRecordsThunkFn(
          data,
          updateTripState,
          updateTripId,
          allowanceClaimId,
          page,
          pageSize,
          callBack,
        ),
      ),
    _setDateDifference: (data: any) => dispatch(setDateDifference(data)),
    _sendAllowanceExpenseClaim: (
      body: any,
      isForAprovals: boolean,
      callback?: Function,
    ) => dispatch(sendAllowanceExpenseClaim(body, isForAprovals, callback)),
    _updateAllowanceExpenseClaim: (
      body: any,
      id: number,
      isForAprovals?: boolean,
      callback?: Function,
    ) =>
      dispatch(updateAllowanceExpenseClaim(body, id, isForAprovals, callback)),
    _setConfirmationInfo: (_data: IConfirmationInfo) =>
      dispatch(setConfirmationInfo(_data)),
    _resetConfirmationInfo: () => dispatch(resetConfirmationInfo()),
    _resetToAllowanceInitial: () => dispatch(resetToAllowanceInitial()),
    _fetchCostCentreListAllowance: (
      data: TchargeToCodesForFetch,
      legalEntityUuid?: string,
      callBack?: Function,
    ) =>
      dispatch(fetchCostCentreListAllowance(data, legalEntityUuid, callBack)),
    _setDefaultApprovedAmount: (data: any) =>
      dispatch(setDefaultApprovedAmount(data)),
    _setUUIDForAllowance: (data: any) => dispatch(setUUIDForAllowance(data)),
    _deleteAllowanceRecord: (
      id: number,
      uuid?: any,
      claimId?: any,
      page?: number,
      pageSize?: number,
    ) => dispatch(deleteAllowanceRecord(id, uuid, claimId, page, pageSize)),
    _allowanceRecordsTableListAddMode: (
      uuid: any,
      page?: any,
      pageSize?: any,
    ) => dispatch(allowanceRecordsTableList(uuid, page, pageSize)),
    _allowanceRecordsTableListUpdateMode: (
      uuid: any,
      page?: any,
      pageSize?: any,
    ) => dispatch(allowanceRecordsTableListUpdate(uuid, page, pageSize)),
    _totalAmountCountForAddMode: (uuid: any) =>
      dispatch(totalAmountCountForAddMode(uuid)),
    _totalAmountCountForUpdateMode: (id: any) =>
      dispatch(totalAmountCountForUpdateMode(id)),
    _setDataForEditCloneTripForm: (data: any) =>
      dispatch(setDataForEditCloneTripForm(data)),
    _setCreateUpdateRecordResponseData: (data: any) =>
      dispatch(setCreateUpdateRecordResponseData(data)),
    _setSaveAndAddAnotherButtonStatus: (data: any) =>
      dispatch(setSaveAndAddAnotherButtonStatus(data)),
    _editCloneAllowanceRecordData: (data: any) =>
      dispatch(editCloneAllowanceRecordData(data)),
    _setCurrentEmployee: (employeeData: any) =>
      dispatch(setCurrentEmployee(employeeData)),
    _scanImage: (file: File) => dispatch(scanImage(file)),
    _setScanDateAmount: (
      date: any,
      amount: number,
      recNumber: any,
      currency: any,
      confidence: any,
      warning_msg: any,
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
    _setAllowanceRecordsId: (data: any) =>
      dispatch(setAllowanceRecordsId(data)),
    _setIsCreatedNewAllowanceRecord: (data: any) =>
      dispatch(setIsCreatedNewAllowanceRecord(data)),
    _onClose: () =>
      dispatch(setIsViolationModalData({ visibility: false, item: null })),
    _fetchAllowanceExpenseClaimViolationCheckerData: (
      body: any,
      isForAprovals: boolean,
      mode: string,
      callback?: Function,
    ) => {
      dispatch(
        fetchAllowanceExpenseClaimViolationCheckerData(
          body,
          isForAprovals,
          mode,
          callback,
        ),
      );
    },
  };
};

const connector = connect(mapStateToProps, mapDispatchToProps);

let initialPageSize = 12;

const AllowanceFormNew: FC<ConnectedProps<typeof connector> & {
  onExpenseAddedSuccessfully?: () => void;
  onExpensesWithRequestUpdatedSuccessfully?: boolean;
}> = props => {
  const {
    backendError,
    isAdminEdit,
    mode,
    _setSelectedExpenseTypeForAllowance,
    selectedExpenseTypeForAllowance,
    viewOnly,
    _fetchDetailConfigurationForAllowance,
    allowanceConfiguration,
    requestDetails,
    expenseTypeListAllowance,
    expenseTypeListLoaderAllowance,
    expenseClaimFetchedDataAllowance,
    _resetAllowanceFormData,
    _addUpdateFormData,
    _addUpdateAllowanceTripFormData,
    formDataAllowance,
    _updateReceiptMandetoryStatusAllowance,
    initialReceiptStatus,
    tripFormData,
    isPermissionAllowed,
    _allowanceTripFormOnChangeStatus,
    tripFormOnChangeStatus,
    locationList,
    _fetchFilteredAllowanceLocations,
    currentDelegateUser,
    userInfo,
    _fetchAllowanceRates,
    allowanceTypes,
    fetchedConversionRate,
    _fetchConversionRate,
    _updateBackendError,
    _creationAndUpdationAllowanceRecordsThunkFn,
    expenseEntitlement,
    _sendAllowanceExpenseClaim,
    _updateAllowanceExpenseClaim,
    isForRequest,
    updateId,
    _setConfirmationInfo,
    _resetConfirmationInfo,
    onExpenseAddedSuccessfully,
    onExpensesWithRequestUpdatedSuccessfully,
    //isHandwritten,
    requestId,
    //allowanceTripDetailsLoader,
    //_resetToAllowanceInitial,
    chargeToForAllowance,
    userJobInfo,
    _fetchCostCentreListAllowance,
    costCentreListForAllowance,
    // costCentreListLoaderForAllowance,
    defaultApprovedAmount,
    _setDefaultApprovedAmount,
    _setUUIDForAllowance,
    uuidForAllowance,
    _deleteAllowanceRecord,
    _allowanceRecordsTableListAddMode,
    _allowanceRecordsTableListUpdateMode,
    dataForEditCloneTripForm,
    _setDataForEditCloneTripForm,
    createUpdateRecordResponseData,
    saveAndAddAnotherBtnStatus,
    _setCreateUpdateRecordResponseData,
    _setSaveAndAddAnotherButtonStatus,
    _editCloneAllowanceRecordData,
    _totalAmountCountForAddMode,
    _totalAmountCountForUpdateMode,
    totalAmountCount,
    isLoadingAllowance,
    _setCurrentEmployee,
    scanLoader,
    isHandwritten,
    scannedAmount,
    scannedReceiptDate,
    scannedReceiptNumber,
    confidence,
    warning_msg,
    _scanImage,
    _setScanDateAmount,
    tenantConfig,
    allowanceRecordsId,
    allowanceRecordsDeleteId,
    _setAllowanceRecordsId,
    isCreatedNewAllowanceRecord,
    _setIsCreatedNewAllowanceRecord,
    isEnableTrafficLightFeatureForTenantFeatures,
    violationModalData,
    _onClose,
    _fetchAllowanceExpenseClaimViolationCheckerData,
  } = props;
  const { Option } = Select;
  const rowGutter: [number, number] = [16, 16];
  const [form] = Form.useForm();
  const [allowanceCommonform] = Form.useForm();
  const customFieldRef = useRef<any>(null);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [filteredLocations, setFilteredLocations] = useState(locationList);
  const [filteredAllowanceTypes, setFilteredAllowanceTypes] = useState(
    allowanceTypes,
  );
  const [getModelVisibility, setModelVisibility] = useState<boolean>(false);
  const [onClose, setOnClose] = useState<boolean>(false);
  const [updateCloneState, setupdateCloneState] = useState<boolean>(false);
  const [cloneState, setCloneState] = useState<boolean>(false);
  const [updateState, setUpdateState] = useState<boolean>(false);
  const [systemConversionRate, setSystemConversionRate] = useState<
    number | undefined
  >(1);
  const [getTripDetails, setTripDetails] = useState(null);
  const [isTripEditId, setTripEditId] = useState(null);
  const [getCollapsableVisibility, setCollapsableVisibility] = useState<
    boolean
  >(false);
  const [getLocalCcLegalEntityUuid, setLocalCcLegalEntityUuid] = useState<
    string | null
  >(null);
  const [buttonClickedStatus, setButtonClickedStatus] = useState(false);
  const [
    allowanceTripDatesDifference,
    setAllowanceTripDatesDifference,
  ] = useState(0);

  let fromAdmin = getQueryParametersAsObject().mode === 'admin';
  let employeeId = fromAdmin
    ? expenseClaimFetchedDataAllowance?.employee?.id
    : undefined;
  const locationDisable =
    locationList?.length === 0 ||
    !allowanceConfiguration?.is_allow_allowance_rate_enabled;
  const allowanceTypeDisable =
    !tripFormData.location ||
    !allowanceConfiguration?.is_allow_allowance_rate_enabled;

  const params: any = useParams();
  const expenseClaimId = params.id;
  const history = useHistory();
  const location: any = useLocation();

  useEffect(() => {
    if (mode === 'ADD') {
      const uuidAllowance = uuidForAllowance ? uuidForAllowance : uuid();
      history.push(`${location.pathname}?uuid=${uuidAllowance}`);
      _setUUIDForAllowance(uuidAllowance);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (tenantConfig.length > 0) {
      is_enabled_ocr =
        tenantConfig[0]?.is_enabled_ocr &&
        !allowanceTypeDisable &&
        !locationDisable &&
        tripFormData?.allowance_rate;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    tenantConfig,
    allowanceTypeDisable,
    locationDisable,
    tripFormData.allowance_rate,
  ]);

  useEffect(() => {
    _setIsCreatedNewAllowanceRecord(false);
    _setCreateUpdateRecordResponseData(null);
    _setSaveAndAddAnotherButtonStatus(false);
    _setDataForEditCloneTripForm(null);
    _addUpdateAllowanceTripFormData('from_date', '');
    _addUpdateAllowanceTripFormData('to_date', '');
    _addUpdateAllowanceTripFormData('location', null);
    _addUpdateAllowanceTripFormData('allowance_rate', null);
    _addUpdateAllowanceTripFormData('approved_amount', null);
    _addUpdateAllowanceTripFormData('amount', null);
    _addUpdateAllowanceTripFormData('allowance_currency', '');
    _addUpdateAllowanceTripFormData('conversion_rate', 1);
    _addUpdateAllowanceTripFormData('converted_amount', null);
    _addUpdateAllowanceTripFormData('receipt', []);
    _addUpdateAllowanceTripFormData('receipt_number', '');
    _addUpdateAllowanceTripFormData('supporting_documents', []);
    _addUpdateAllowanceTripFormData('library_receipt', null);
    setupdateCloneState(false);
    setCloneState(false);
    setUpdateState(false);
    _allowanceTripFormOnChangeStatus('from_date', false);
    _allowanceTripFormOnChangeStatus('to_date', false);
    _allowanceTripFormOnChangeStatus('no_of_days', false);
    _addUpdateAllowanceTripFormData('no_of_days', 0);
    _allowanceTripFormOnChangeStatus('library_receipt', false);
    setTripEditId(null);
    //_updateReceiptMandetoryStatusAllowance(initialReceiptStatus);
    _updateBackendError({});
    _allowanceTripFormOnChangeStatus('amount', false);
    setButtonClickedStatus(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (mode === 'ADD' && getQueryParametersAsObject().uuid) {
      _allowanceRecordsTableListAddMode(
        getQueryParametersAsObject().uuid,
        1,
        pageSize,
      );
      _totalAmountCountForAddMode(getQueryParametersAsObject().uuid);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    _setIsCreatedNewAllowanceRecord(false);
    _setCreateUpdateRecordResponseData(null);
    _setSaveAndAddAnotherButtonStatus(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formDataAllowance.allowanceTripRecords]);

  useEffect(() => {
    if (createUpdateRecordResponseData !== null) {
      setTimeout(() => {
        message.success('Saved Successfully', 10);
      }, 0.1);
      if (saveAndAddAnotherBtnStatus) {
        setModelVisibility(true);
        setOnClose(false);
      } else {
        setModelVisibility(false);
        setOnClose(true);
      }
      _setDataForEditCloneTripForm(null);
      _addUpdateAllowanceTripFormData('from_date', '');
      _addUpdateAllowanceTripFormData('to_date', '');
      _addUpdateAllowanceTripFormData('location', null);
      _addUpdateAllowanceTripFormData('allowance_rate', null);
      _addUpdateAllowanceTripFormData('approved_amount', null);
      _addUpdateAllowanceTripFormData('amount', null);
      _addUpdateAllowanceTripFormData('allowance_currency', '');
      _addUpdateAllowanceTripFormData('conversion_rate', 1);
      _addUpdateAllowanceTripFormData('converted_amount', null);
      _addUpdateAllowanceTripFormData('receipt', []);
      _addUpdateAllowanceTripFormData('receipt_number', '');
      _addUpdateAllowanceTripFormData('supporting_documents', []);
      _addUpdateAllowanceTripFormData('library_receipt', null);
      setupdateCloneState(false);
      setCloneState(false);
      setUpdateState(false);
      _allowanceTripFormOnChangeStatus('from_date', false);
      _allowanceTripFormOnChangeStatus('to_date', false);
      _allowanceTripFormOnChangeStatus('no_of_days', false);
      _addUpdateAllowanceTripFormData('no_of_days', 0);
      _allowanceTripFormOnChangeStatus('library_receipt', false);
      setTripEditId(null);
      //_updateReceiptMandetoryStatusAllowance(initialReceiptStatus);
      _updateBackendError({});
      _allowanceTripFormOnChangeStatus('amount', false);
      setButtonClickedStatus(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createUpdateRecordResponseData]);

  useEffect(() => {
    if (
      isCreatedNewAllowanceRecord &&
      createUpdateRecordResponseData !== null
    ) {
      let idArray = [createUpdateRecordResponseData?.id];
      _setAllowanceRecordsId(allowanceRecordsId.concat(idArray));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCreatedNewAllowanceRecord, createUpdateRecordResponseData]);

  useEffect(() => {
    if (allowanceRecordsDeleteId !== null) {
      let recordsIdArray = allowanceRecordsId.filter(
        (id: any) => id !== allowanceRecordsDeleteId,
      );
      _setAllowanceRecordsId(recordsIdArray);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allowanceRecordsDeleteId]);

  useEffect(() => {
    if (expenseClaimFetchedDataAllowance?.id) {
      _allowanceRecordsTableListUpdateMode(
        expenseClaimFetchedDataAllowance.id,
        1,
        pageSize,
      );
      _totalAmountCountForUpdateMode(expenseClaimFetchedDataAllowance.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expenseClaimFetchedDataAllowance]);

  useEffect(() => {
    if (dataForEditCloneTripForm !== null) {
      setModelVisibility(true);
      if (updateState) {
        onUpdate(dataForEditCloneTripForm);
      } else if (cloneState) {
        clone(dataForEditCloneTripForm);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataForEditCloneTripForm]);

  const [
    supportingDocIdsUpdateAllowance,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
    setSupportingDocIdsUpdateAllowance,
  ] = useState<any>([]);
  const [showAllowanceCustomField, setShowAllowanceCustomField] = useState<
    boolean
  >(false);
  const [isTrafficLightEnable, setIsTrafficLightEnable] = useState(false);

  const formCommonProps: FormProps = {
    form: form,
    scrollToFirstError: true,
    size: 'middle',
    layout: 'vertical',
    colon: false,
    autoComplete: 'off',
  };

  const commonFormProps: FormProps = {
    form: allowanceCommonform,
    scrollToFirstError: true,
    size: 'middle',
    layout: 'vertical',
    colon: false,
    autoComplete: 'off',
  };
  const receiptFieldRef = useRef<any>(null);

  const isReceiptAllowed = isPermissionAllowed('ACTION_RECEIPT');

  useEffect(() => {
    if (showAllowanceCustomField) setCollapsableVisibility(true);
  }, [showAllowanceCustomField]);

  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  let Amt;

  useEffect(() => {
    form.setFieldsValue({
      ...tripFormData,
    });
  }, [tripFormData, form]);

  useEffect(() => {
    allowanceCommonform.setFieldsValue({
      ...formDataAllowance,
    });
  }, [formDataAllowance, allowanceCommonform]);

  useEffect(() => {
    if (
      tripFormData?.from_date &&
      selectedExpenseTypeForAllowance?.expense_type?.title &&
      allowanceConfiguration?.id
    ) {
      _fetchFilteredAllowanceLocations({
        date: moment(tripFormData.from_date).format('DD/MM/YYYY'),
        employee_id:
          mode === 'UPDATE'
            ? expenseClaimFetchedDataAllowance?.employee?.id
            : currentDelegateUser
            ? currentDelegateUser.on_behalf_of.id
            : userInfo?.id,
        expense_config_id: allowanceConfiguration?.id,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    // eslint-disable-next-line react-hooks/exhaustive-deps
    tripFormData?.from_date,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    selectedExpenseTypeForAllowance?.expense_type?.title,
    _fetchFilteredAllowanceLocations,
    allowanceConfiguration,
    currentDelegateUser,
    userInfo,
    expenseClaimFetchedDataAllowance,
    mode,
  ]);

  useEffect(() => {
    setFilteredLocations(locationList);
  }, [locationList]);

  useEffect(() => {
    setFilteredAllowanceTypes(allowanceTypes);
  }, [allowanceTypes]);

  useEffect(() => {
    if (tripFormData?.from_date && tripFormData?.location) {
      _fetchAllowanceRates({
        date: moment(tripFormData.from_date).format('DD/MM/YYYY'),
        location: tripFormData.location,
        expense_config_id: allowanceConfiguration?.id,
        employee_id:
          mode === 'UPDATE'
            ? expenseClaimFetchedDataAllowance?.employee?.id
            : currentDelegateUser
            ? currentDelegateUser.on_behalf_of.id
            : userInfo?.id,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    // eslint-disable-next-line react-hooks/exhaustive-deps
    tripFormData?.from_date,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    tripFormData?.location,
    _fetchAllowanceRates,
    currentDelegateUser,
    userInfo,
    expenseClaimFetchedDataAllowance,
    mode,
  ]);

  useEffect(() => {
    if (allowanceTypes?.length === 1) {
      const allowanceTypeId = allowanceTypes[0].id;
      _addUpdateAllowanceTripFormData('allowance_rate', allowanceTypeId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allowanceTypes]);

  useEffect(() => {
    if (locationList?.length === 1) {
      const locationId = locationList[0].id;
      _addUpdateAllowanceTripFormData('location', locationId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationList]);

  useEffect(() => {
    if (
      tripFormData?.allowance_rate &&
      allowanceTypes?.length &&
      tripFormData?.no_of_days
    ) {
      const obj = allowanceTypes.find(
        (item: any) => item.id === tripFormData.allowance_rate,
      );

      _setDefaultApprovedAmount(obj?.amount);
      _addUpdateAllowanceTripFormData(
        'amount',
        obj?.amount * tripFormData?.no_of_days,
      );
      _addUpdateAllowanceTripFormData(
        'approved_amount',
        obj?.amount * tripFormData?.no_of_days,
      );
      _addUpdateAllowanceTripFormData(
        'allowance_currency',
        obj?.allowance_currency.title,
      );

      if (
        obj?.is_full_amount_allowed &&
        obj?.is_update_allowed &&
        !updateCloneState
      ) {
        _addUpdateAllowanceTripFormData('amount', null);
      }

      if (!obj?.is_full_amount_allowed && !updateCloneState) {
        _addUpdateAllowanceTripFormData(
          'amount',
          obj?.amount * tripFormData?.no_of_days,
        );
      }

      if (
        !obj?.is_full_amount_allowed &&
        updateCloneState &&
        !tripFormOnChangeStatus?.from_date &&
        !tripFormOnChangeStatus?.to_date &&
        !tripFormOnChangeStatus?.no_of_days
      ) {
        _addUpdateAllowanceTripFormData(
          'amount',
          tripFormData?.amount
            ? tripFormData?.amount
            : obj?.amount * tripFormData?.no_of_days,
        );
      }

      if (
        !obj?.is_full_amount_allowed &&
        updateCloneState &&
        (tripFormOnChangeStatus?.from_date ||
          tripFormOnChangeStatus?.to_date ||
          tripFormOnChangeStatus?.no_of_days)
      ) {
        _addUpdateAllowanceTripFormData(
          'amount',
          obj?.amount * tripFormData?.no_of_days,
        );
      }

      if (
        obj?.is_full_amount_allowed &&
        updateCloneState &&
        !tripFormOnChangeStatus?.from_date &&
        !tripFormOnChangeStatus?.to_date &&
        !tripFormOnChangeStatus?.no_of_days
      ) {
        _addUpdateAllowanceTripFormData(
          'amount',
          tripFormData?.amount
            ? tripFormData.amount
            : obj?.amount * tripFormData?.no_of_days,
        );
      }

      if (
        obj?.is_full_amount_allowed &&
        updateCloneState &&
        (tripFormOnChangeStatus?.from_date ||
          tripFormOnChangeStatus?.to_date ||
          tripFormOnChangeStatus?.no_of_days)
      ) {
        _addUpdateAllowanceTripFormData(
          'amount',
          obj?.amount * tripFormData?.no_of_days,
        );
      }

      if (tripFormOnChangeStatus.library_receipt) {
        _addUpdateAllowanceTripFormData(
          'amount',
          obj
            ? obj?.is_update_allowed
              ? tripFormData.amount
                ? tripFormData.amount
                : obj?.amount
              : obj?.amount
            : tripFormData.amount
            ? tripFormData.amount
            : null,
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    tripFormData.allowance_rate,
    allowanceTypes,
    tripFormData.no_of_days,
    tripFormOnChangeStatus.library_receipt,
  ]);

  const allowanceTypeObj = allowanceTypes.find(
    (o: any) => o.id === tripFormData?.allowance_rate,
  );
  const isAllowanceAmountDisable =
    tripFormData?.allowance_rate && !allowanceTypeObj?.is_update_allowed;
  useEffect(() => {
    if (selectedExpenseTypeForAllowance && tripFormData?.allowance_currency) {
      _fetchConversionRate(
        moment(tripFormData?.from_date).format('DD-MM-YYYY'),
        selectedExpenseTypeForAllowance.legal_entity?.currency?.currency?.code,
        tripFormData?.allowance_currency,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tripFormData?.allowance_currency, selectedExpenseTypeForAllowance]);

  useEffect(() => {
    if (updateCloneState) {
      setButtonClickedStatus(true);
    }
  }, [updateCloneState]);

  useEffect(() => {
    if (
      !tripFormOnChangeStatus?.amount &&
      !onClose &&
      tripFormData?.allowance_rate &&
      !buttonClickedStatus
    ) {
      calculateAmountUsingConversionRate(fetchedConversionRate || 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    // eslint-disable-next-line react-hooks/exhaustive-deps
    fetchedConversionRate,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    tripFormData?.allowance_rate,
  ]);

  useEffect(() => {
    if (tripFormData?.conversion_rate && tripFormData?.amount) {
      calculateAmountUsingConversionRate(tripFormData.conversion_rate);
    } else {
      _addUpdateAllowanceTripFormData('converted_amount', null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tripFormData?.conversion_rate, tripFormData?.amount]);

  useEffect(() => {
    if (cloneState) {
      calculateAmountUsingConversionRate(systemConversionRate);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cloneState]);

  useEffect(() => {
    if (tripFormOnChangeStatus?.from_date && allowanceTypes.length !== 1) {
      const result = allowanceTypes.find(
        (type: any) => type.id === tripFormData?.allowance_rate,
      );

      const value = result ? true : false;

      if (value === false) {
        _addUpdateAllowanceTripFormData('location', null);
        _addUpdateAllowanceTripFormData('allowance_rate', null);
        _addUpdateAllowanceTripFormData('amount', null);
        _addUpdateAllowanceTripFormData('approved_amount', null);
        _addUpdateAllowanceTripFormData('allowance_currency', null);
        _addUpdateAllowanceTripFormData('conversion_rate', 1);
        _addUpdateAllowanceTripFormData('converted_amount', null);
      }
    } else {
      const result = allowanceTypes.find(
        (type: any) => type.id === tripFormData.allowance_rate,
      );

      if (
        !tripFormOnChangeStatus.library_receipt &&
        tripFormOnChangeStatus?.from_date
      ) {
        _addUpdateAllowanceTripFormData(
          'amount',
          result?.amount === undefined ? null : result?.amount,
        );
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    tripFormOnChangeStatus.from_date,
    allowanceTypes,
    tripFormData.allowance_rate,
  ]);

  useEffect(() => {
    if (
      tripFormData.from_date !== '' &&
      tripFormData.to_date !== '' &&
      (tripFormOnChangeStatus.from_date ||
        tripFormOnChangeStatus.to_date ||
        tripFormOnChangeStatus.library_receipt)
    ) {
      let fromDateValue = moment(tripFormData.from_date, 'DD/MM/YYYY');
      let toDateValue = moment(tripFormData.to_date, 'DD/MM/YYYY');
      let datesDiffferences = toDateValue.diff(fromDateValue, 'days') + 1;
      _addUpdateAllowanceTripFormData('no_of_days', datesDiffferences);
      setAllowanceTripDatesDifference(datesDiffferences);
      //_setDateDifference(datesDiffferences);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tripFormData.from_date, tripFormData.to_date]);

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

  const onChangePagination = (page: number, pageSize: number) => {
    if (mode === 'UPDATE') {
      _allowanceRecordsTableListUpdateMode(
        expenseClaimFetchedDataAllowance?.id,
        page,
        pageSize,
      );
    } else if (mode === 'ADD') {
      _allowanceRecordsTableListAddMode(uuidForAllowance, page, pageSize);
    }
  };

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

  const addMoreButtonDisabledProps: boolean =
    allowanceConfiguration === null || isAdminEdit;

  const handleLocationSearch = (value: string) => {
    const filtered = locationList.filter(
      (item: any) => item.title.toLowerCase().indexOf(value.toLowerCase()) > -1,
    );
    setFilteredLocations(filtered);
  };

  const handleAllowanceTypeSearch = (value: string) => {
    const filtered = allowanceTypes.filter(
      (item: any) =>
        item?.subrate_title?.title.toLowerCase().indexOf(value.toLowerCase()) >
        -1,
    );
    setFilteredAllowanceTypes(filtered);
  };

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
    if (allowanceConfiguration) {
      const _amount = tripFormData?.amount;
      const _conversionRate = conversion_rate;

      const convertedAmount = Number(
        Big(Number(_amount))
          .times(Number(_conversionRate))
          .round(2)
          .valueOf(),
      );

      _addUpdateAllowanceTripFormData('conversion_rate', _conversionRate);
      _addUpdateAllowanceTripFormData('converted_amount', convertedAmount);
    }
  };

  const onUpdateReceiptDoc = (value: any) => {
    if (!initialReceiptStatus) {
      if ((value && value.length > 0) || tripFormData.receipt_number) {
        _updateReceiptMandetoryStatusAllowance(true);
      } else {
        _updateReceiptMandetoryStatusAllowance(false);
      }
    }
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

    _addUpdateAllowanceTripFormData('library_receipt', file.id);
    _addUpdateAllowanceTripFormData(
      'from_date',
      data.date ? data.date : tripFormData.from_date,
    );
    _addUpdateAllowanceTripFormData(
      'to_date',
      data.date ? data.date : tripFormData.to_date,
    );

    _addUpdateAllowanceTripFormData(
      'amount',
      data.amount ? data.amount : data.date ? null : tripFormData.amount,
    );

    _addUpdateAllowanceTripFormData(
      'receipt_number',
      data.receipt_number ? data.receipt_number : tripFormData.receipt_number,
    );
    _addUpdateAllowanceTripFormData('receipt', [file.file]);
    _allowanceTripFormOnChangeStatus('library_receipt', true);
    setButtonClickedStatus(false);
    if (data.date) {
      _allowanceTripFormOnChangeStatus('from_date', true);
      _allowanceTripFormOnChangeStatus('to_date', true);
    }
  };

  const receiptImageURL = (f: any) => {
    return f.hasOwnProperty('file') && typeof f?.file === 'string'
      ? f?.file
      : typeof f === 'string'
      ? f
      : window.URL.createObjectURL(f || '');
  };

  const onUpdate = (_item: any) => {
    _addUpdateAllowanceTripFormData(
      'from_date',
      moment(_item.from_date, 'DD/MM/YYYY'),
    );
    _addUpdateAllowanceTripFormData(
      'to_date',
      moment(_item.to_date, 'DD/MM/YYYY'),
    );
    _addUpdateAllowanceTripFormData('location', _item.location?.id);
    _addUpdateAllowanceTripFormData('allowance_rate', _item.allowance_rate?.id);
    _addUpdateAllowanceTripFormData(
      'approved_amount',
      _item.approved_amount || 0,
    );
    _addUpdateAllowanceTripFormData('amount', _item.amount || 0);
    _addUpdateAllowanceTripFormData(
      'allowance_currency',
      _item.allowance_currency,
    );
    _addUpdateAllowanceTripFormData('conversion_rate', _item.conversion_rate);
    _addUpdateAllowanceTripFormData('converted_amount', _item.converted_amount);
    _addUpdateAllowanceTripFormData(
      'receipt',
      _item?.receipt
        ? _item?.receipt[0]?.file
          ? [_item?.receipt[0]?.file]
          : []
        : [],
    );
    _addUpdateAllowanceTripFormData('receipt_number', _item.receipt_number);
    _addUpdateAllowanceTripFormData(
      'supporting_documents',
      _item.supporting_documents || [],
    );
    _addUpdateAllowanceTripFormData(
      'library_receipt',
      _item.library_receipt || null,
    );
    _addUpdateAllowanceTripFormData('no_of_days', _item.no_of_days);
    let fromDateValue = moment(_item.from_date, 'DD/MM/YYYY');
    let toDateValue = moment(_item.to_date, 'DD/MM/YYYY');
    let datesDiffferences = toDateValue.diff(fromDateValue, 'days') + 1;
    setAllowanceTripDatesDifference(datesDiffferences);
  };

  const clone = (_item: any) => {
    setSystemConversionRate(_item?.system_conversion_rate);

    _addUpdateAllowanceTripFormData(
      'from_date',
      moment(_item.from_date, 'DD/MM/YYYY'),
    );
    _addUpdateAllowanceTripFormData(
      'to_date',
      moment(_item.to_date, 'DD/MM/YYYY'),
    );
    _addUpdateAllowanceTripFormData('location', _item.location?.id);
    _addUpdateAllowanceTripFormData('allowance_rate', _item.allowance_rate?.id);
    _addUpdateAllowanceTripFormData(
      'approved_amount',
      _item.approved_amount || 0,
    );
    _addUpdateAllowanceTripFormData('amount', _item.amount || 0);
    _addUpdateAllowanceTripFormData(
      'allowance_currency',
      _item.allowance_currency,
    );
    _addUpdateAllowanceTripFormData(
      'conversion_rate',
      _item.system_conversion_rate,
    );
    _addUpdateAllowanceTripFormData('converted_amount', _item.converted_amount);
    _addUpdateAllowanceTripFormData('receipt', []);
    _addUpdateAllowanceTripFormData('receipt_number', '');
    _addUpdateAllowanceTripFormData('supporting_documents', []);
    _addUpdateAllowanceTripFormData('library_receipt', null);
    _addUpdateAllowanceTripFormData('no_of_days', _item.no_of_days);

    let fromDateValue = moment(_item.from_date, 'DD/MM/YYYY');
    let toDateValue = moment(_item.to_date, 'DD/MM/YYYY');
    let datesDiffferences = toDateValue.diff(fromDateValue, 'days') + 1;
    setAllowanceTripDatesDifference(datesDiffferences);
  };

  const getLabelName = (
    defaultTitle: any,
    type: 'string' | 'ReactNode' | 'doc' = 'ReactNode',
  ): ReactNode => {
    if (type === 'ReactNode') {
      return (
        <GetLabelName
          defaultTitle={defaultTitle}
          configuration={allowanceConfiguration || null}
        />
      );
    } else if (type === 'string') {
      try {
        const objValue =
          allowanceConfiguration?.label_mapping[
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
            configuration={allowanceConfiguration || null}
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

  const columns = [
    {
      title: getLabelName('From Date', 'string'),
      dataIndex: 'from_date',
      key: 'from_date',
      align: 'center' as 'center',
      width: 10,
      render: (text: Moment) =>
        moment.isMoment(text)
          ? text.format('DD/MM/YYYY')
          : moment(text, ['DD/MM/YYYY', 'DD-MM-YYYY']).format('DD/MM/YYYY') ||
            '',
    },
    {
      title: getLabelName('To Date', 'string'),
      dataIndex: 'to_date',
      key: 'to_date',
      align: 'center' as 'center',
      width: 10,
      render: (text: Moment) =>
        moment.isMoment(text)
          ? text.format('DD/MM/YYYY')
          : moment(text, ['DD/MM/YYYY', 'DD-MM-YYYY']).format('DD/MM/YYYY') ||
            '',
    },
    {
      title: getLabelName('No. of Days', 'string'),
      dataIndex: 'no_of_days',
      key: 'no_of_days',
      align: 'center' as 'center',
      width: 10,
      render: (text: any) => <span className='address'>{text}</span>,
    },
    {
      title: getLabelName('Location', 'string'),
      dataIndex: 'location',
      key: 'location',
      align: 'center' as 'center',
      width: 10,
      render: (text: any) => <span className='address'>{text.title}</span>,
    },
    {
      title: getLabelName('Allowance Type', 'string'),
      dataIndex: 'allowance_rate',
      key: 'allowance_rate',
      align: 'center' as 'center',
      width: 10,
      render: (text: any) => (
        <span className='address'>{text.subrate_title}</span>
      ),
    },
    {
      title: getLabelName('Approved Amount', 'string'),
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
      title: getLabelName('Amount', 'string'),
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
      title: getLabelName('Expense Currency', 'string'),
      dataIndex: 'allowance_currency',
      key: 'allowance_currency',
      align: 'center' as 'center',
      width: 10,
      render: (text: any) => <span className='address'>{text}</span>,
    },

    {
      title: getLabelName('Conversion Rate', 'string'),
      dataIndex: 'conversion_rate',
      key: 'conversion_rate',
      align: 'center' as 'center',
      width: 10,
      render: (text: any) => (
        <span className='address'>{Number(text).toFixed(4)}</span>
      ),
    },
    {
      title: getLabelName('Converted Expense Amount', 'string'),
      dataIndex: 'converted_amount',
      key: 'converted_amount',
      align: 'center' as 'center',
      width: 10,
      render: (text: any) => (
        <span className='address'>{Number(Number(text).toFixed(2))}</span>
      ),
    },
    {
      title: getLabelName('Receipt/s', 'string'),
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
        const receipt = (_file || []).map((o: any) =>
          o.hasOwnProperty('file')
            ? o
            : {
                file: receiptImageURL(o),
                file_type: _file?.file_type || _file?.type,
                receipt_number: _row.receipt_number,
              },
        );
        return (
          <DocumentsViewer
            itemType='expense'
            itemNumber={expenseClaimFetchedDataAllowance?.claim_number || 'N/A'}
            documents={supDoc}
            receipt={
              //null
              // _file
              //   ? {
              //       ..._file,
              //       file: receiptImageURL(_file),
              //       file_type: _file?.file_type || _file?.type,
              //       receipt_number: _row.receipt_number,
              //     }
              //   : null
              receipt
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
              OnClick: async () => {
                setupdateCloneState(true);
                setOnClose(false);
                setCloneState(false);
                setUpdateState(true);
                setTripEditId(_item.id);
                _editCloneAllowanceRecordData(_item.id);
              },
            },
            {
              children: <Trans>Clone</Trans>,
              Type: 'link',
              icon: CopyOutlined,
              Disabled: isAdminEdit,
              OnClick: async () => {
                setupdateCloneState(true);
                setOnClose(false);
                setCloneState(true);
                setUpdateState(false);
                setTripEditId(_item.id);
                _editCloneAllowanceRecordData(_item.id);
              },
            },
            {
              children: <Trans>Delete</Trans>,
              Type: 'link',
              icon: DeleteOutlined,
              Disabled: isAdminEdit,
              OnClick: () => {
                if (
                  mode === 'UPDATE' &&
                  formDataAllowance.allowanceTripRecords?.data?.length === 1
                ) {
                  message.error('Minimum one allowance record is required');
                } else {
                  _deleteAllowanceRecord(
                    _item.id,
                    uuidForAllowance,
                    expenseClaimFetchedDataAllowance?.id,
                    currentPage,
                    pageSize,
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

  const handleAddMoreClick = () => {
    setOnClose(false);
    setModelVisibility(true);
    setTripEditId(null);
    _addUpdateAllowanceTripFormData('from_date', '');
    _addUpdateAllowanceTripFormData('to_date', '');
    _addUpdateAllowanceTripFormData('location', null);
    _addUpdateAllowanceTripFormData('allowance_rate', null);
    _addUpdateAllowanceTripFormData('approved_amount', null);
    _addUpdateAllowanceTripFormData('amount', null);
    _addUpdateAllowanceTripFormData('allowance_currency', '');
    _addUpdateAllowanceTripFormData('conversion_rate', 1);
    _addUpdateAllowanceTripFormData('converted_amount', null);
    _addUpdateAllowanceTripFormData('receipt', []);
    _addUpdateAllowanceTripFormData('receipt_number', '');
    _addUpdateAllowanceTripFormData('supporting_documents', []);
    _addUpdateAllowanceTripFormData('library_receipt', null);
  };

  const selectedExpenseTypeHandlerAllowance = (expenseTypeId: number) => {
    _resetAllowanceFormData();
    _addUpdateFormData('expense_type_legal_entity', expenseTypeId);

    const selectedExpenseTypeAllowance = expenseTypeListAllowance.filter(
      (o: any) => {
        return o.id === expenseTypeId;
      },
    );

    selectedExpenseTypeAllowance &&
      _setSelectedExpenseTypeForAllowance(selectedExpenseTypeAllowance[0]);
  };

  useEffect(() => {
    if (mode === 'ADD') {
      if (allowanceConfiguration?.is_allow_charging_to_cost_centres) {
        if (allowanceConfiguration?.is_employee_cost_centre_readonly) {
          _addUpdateFormData(
            'cost_centre_uuid',
            userJobInfo?.cost_centre?.uuid,
          );
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allowanceConfiguration, mode]);

  const _selectedExpenseType_useEffectFn = () => {
    try {
      const configId = selectedExpenseTypeForAllowance?.custom_configuration
        ? selectedExpenseTypeForAllowance?.custom_configuration
        : selectedExpenseTypeForAllowance?.global_configuration;

      configId &&
        _fetchDetailConfigurationForAllowance(
          configId as number,
          (configData: any = allowanceConfiguration) => {
            if (!viewOnly) {
              if (mode === 'ADD') {
                //form.resetFields();
                // eslint-disable-next-line no-unused-expressions
                customFieldRef?.current?.clearCustomFieldForm();

                if (configData?.is_allow_charging_to_cost_centres) {
                  if (
                    selectedExpenseTypeForAllowance &&
                    selectedExpenseTypeForAllowance.legal_entity
                  ) {
                    if (formDataAllowance.charge_to === 'LOCAL') {
                      _fetchCostCentreListAllowance(
                        'LOCAL',
                        selectedExpenseTypeForAllowance.legal_entity.uuid,
                      );
                    }
                  } else {
                    _fetchCostCentreListAllowance('LOCAL');
                  }
                }
              }
            }
          },
        );
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(_selectedExpenseType_useEffectFn, [
    selectedExpenseTypeForAllowance,
  ]);

  const _customFieldSetValues_useEffectFn = () => {
    try {
      if (
        customFieldRef?.current?.setValues &&
        expenseClaimFetchedDataAllowance?.custom_fields?.length > 0 &&
        allowanceConfiguration !== null
      ) {
        // eslint-disable-next-line no-unused-expressions
        customFieldRef?.current?.setValues(
          expenseClaimFetchedDataAllowance?.custom_fields,
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(_customFieldSetValues_useEffectFn, [
    customFieldRef,
    expenseClaimFetchedDataAllowance,
    allowanceConfiguration,
  ]);

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

  const disabledDate = (isTripDate: boolean, current: Moment): boolean => {
    let condition: boolean = false;
    try {
      if (allowanceConfiguration === null) return false;

      if (isAdminEdit) return current >= moment(); //disabling only future dates

      if (current) {
        if (
          allowanceConfiguration?.is_allow_backdated_claims &&
          allowanceConfiguration?.backdated_claim_period_in_days
        ) {
          if (requestDetails || expenseClaimFetchedDataAllowance?.request) {
            let start_date = requestDetails
              ? moment(requestDetails.end_date, 'DD/MM/YYYY')
                  .subtract(
                    allowanceConfiguration?.backdated_claim_period_in_days,
                    'days',
                  )
                  .startOf('day')
              : moment(
                  expenseClaimFetchedDataAllowance?.request?.end_date,
                  'DD/MM/YYYY',
                )
                  .subtract(
                    allowanceConfiguration?.backdated_claim_period_in_days,
                    'days',
                  )
                  .startOf('day');
            let end_date = requestDetails
              ? moment(requestDetails.end_date, 'DD/MM/YYYY')
                  .add(
                    allowanceConfiguration?.backdated_claim_period_in_days,
                    'days',
                  )
                  .endOf('day')
              : moment(
                  expenseClaimFetchedDataAllowance?.request?.end_date,
                  'DD/MM/YYYY',
                )
                  .add(
                    allowanceConfiguration?.backdated_claim_period_in_days,
                    'days',
                  )
                  .endOf('day');

            condition = start_date >= current || current >= end_date;
          } else {
            condition =
              current <=
              moment()
                .subtract(
                  allowanceConfiguration?.backdated_claim_period_in_days,
                  'days',
                )
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

    // if (requestDetails || expenseClaimFetchedData?.request) {
    //   return condition;
    // }

    // if (isTripDate) {
    //   return condition;
    //   // ||
    //   // current >= moment(formData?.general_form?.date || '').endOf('day')
    // } else {
    //   return condition || current >= moment();
    // }

    if (requestDetails || expenseClaimFetchedDataAllowance?.request) {
      return condition || current >= moment();
    }
    return condition || current >= moment();
  };

  const disabledToDate = (isTripDate: boolean, current: Moment): boolean => {
    let condition: boolean = false;
    condition = current < tripFormData.from_date;
    return condition || current >= moment();
  };

  const calculateRHSSide = () => {
    if (
      Boolean(
        totalAmountCount?.total_amount &&
          totalAmountCount?.total_converted_amount,
      )
    ) {
      let totalAmount: any = [0];

      let showAmtWarning: boolean = false,
        showAmtError: boolean = false;

      totalAmount = Number(totalAmountCount?.total_converted_amount);

      // amount validation using config
      if (allowanceConfiguration !== null) {
        showAmtError = Boolean(
          (allowanceConfiguration?.max_amount === null
            ? false
            : totalAmount > (allowanceConfiguration?.max_amount as number)) ||
            (allowanceConfiguration?.min_amount === null
              ? false
              : totalAmount < (allowanceConfiguration?.min_amount as number)),
        );
        showAmtWarning = showAmtError
          ? false
          : totalAmount >= (allowanceConfiguration?.warning_amount as number) &&
            allowanceConfiguration?.is_set_warning_amount
          ? true
          : false;
        //_setDisableSaveSendBtns(showAmtError);
      } else {
        // _setDisableSaveSendBtns(false);
        showAmtError = showAmtWarning = false;
      }

      if (
        getAmountState.totalAmount > totalAmount &&
        formDataAllowance.cost_centre_uuid !== userJobInfo?.cost_centre?.uuid
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
      //_setDisableSaveSendBtns(false);
      // if (
      //   formDataAllowance.cost_centre_uuid !== userJobInfo?.cost_centre?.uuid
      // ) {
      //   ccThresholdValidations(initialAmountState.totalAmount || 0);
      // }
    }
  };
  useEffect(() => {
    if (
      allowanceConfiguration &&
      allowanceConfiguration?.is_allow_charging_to_cost_centres
    ) {
      if (allowanceConfiguration?.is_default_to_entity_cost_centre) {
        _addUpdateFormData(
          'cost_centre_uuid',
          allowanceConfiguration?.le_cost_centre?.uuid,
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allowanceConfiguration]);

  useEffect(calculateRHSSide, [totalAmountCount, allowanceConfiguration]);
  const getRecordObject = (
    value: any,
    keepReceipEvenIfReceiptPickfromGallery: boolean = false,
    // eslint-disable-next-line no-unused-vars
    calledFromUpdateNewAllowanceRecordInState: boolean = false,
  ) => {
    const isUpdate = mode === 'UPDATE';
    const returnObj: any = {
      expense_type_legal_entity: formDataAllowance.expense_type_legal_entity,
      date: value.from_date ? value.from_date.format('DD-MM-YYYY') : '',
      from_date: value.from_date ? value.from_date.format('DD-MM-YYYY') : '',
      to_date: value.to_date ? value.to_date.format('DD-MM-YYYY') : '',
      amount: Number(value.amount).toFixed(2) || 0,
      conversion_rate: value.conversion_rate,
      converted_amount: Number(value.converted_amount).toFixed(2),
      receipt: value?.receipt?.length ? value.receipt[0] || null : null,
      receipt_number: value.receipt_number,
      supporting_documents: value?.supporting_documents?.length
        ? value.supporting_documents || null
        : null,
      system_conversion_rate: fetchedConversionRate,
      allowance_rate: value.allowance_rate,
      no_of_days: value.no_of_days,
      approved_amount: value.approved_amount || 0,
      is_handwritten_detected: isHandwritten || false,
    };

    if (requestDetails || expenseClaimFetchedDataAllowance?.request) {
      returnObj.request = requestDetails
        ? requestDetails?.id
        : expenseClaimFetchedDataAllowance?.request?.id;
    }

    if (mode === 'ADD') {
      returnObj.pre_save_uuid = uuidForAllowance;
    } else if (mode === 'UPDATE') {
      returnObj.expense_claim = expenseClaimFetchedDataAllowance?.id;
    }

    if (updateState) {
      returnObj.id = isTripEditId;
    }

    if (expenseEntitlement) {
      returnObj.expense_entitlement = expenseEntitlement;
    }

    if (isUpdate) {
      returnObj.expense_claim = expenseClaimFetchedDataAllowance?.id;
    } else {
      returnObj.pre_save_uuid = uuidForAllowance;
    }

    if (!Boolean(returnObj.receipt)) {
      delete returnObj.receipt;
      delete returnObj.receipt_number;
    }

    // Identify whether receipt is new or old
    if (value.receipt && typeof value.receipt[0] === 'string') {
      delete returnObj.receipt;
    }

    if (tripFormData.library_receipt !== null) {
      if (!keepReceipEvenIfReceiptPickfromGallery) delete returnObj.receipt;
      returnObj.library_receipt = tripFormData.library_receipt;
    }

    if (
      !Boolean(value?.supporting_documents) ||
      value?.supporting_documents?.length === 0
    ) {
      delete returnObj.supporting_documents;
    }

    if (isTripEditId !== null && !cloneState) {
      const ogRecord = formDataAllowance.allowanceTripRecords?.data.filter(
        (o: any) => o.id === isTripEditId,
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
      if (ogRecord?.receipt?.length) {
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

  const handleSaveClick = () => {
    setOnClose(true);
    form
      .validateFields()
      .then(values => {
        _creationAndUpdationAllowanceRecordsThunkFn(
          getRecordObject(values, undefined, true)[0],
          updateState,
          isTripEditId,
          expenseClaimFetchedDataAllowance?.id,
          currentPage,
          pageSize,
          (status: any) => {
            status && _setScanDateAmount(null, 0, '', {}, null, '');
          },
        );
      })
      .catch(errorInfo => {
        console.warn(errorInfo);
      });
  };

  const recordsLength = formDataAllowance.allowanceTripRecords?.data?.length;

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
    _resetAllowanceFormData();
    _resetConfirmationInfo();
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
   * Get post data and put data for save for draft and send for approvals button
   */
  const getPostAndPutData = async () => {
    setShowAllowanceCustomField(false);
    try {
      form.validateFields(); //main form check
      await allowanceCommonform.validateFields();

      const customFieldForm = customFieldRef?.current?.getCustomFieldFormInstance();

      if (customFieldForm) {
        try {
          await customFieldForm.validateFields();
          const postData: any = {
            ...formDataAllowance,
            custom_fields: customFieldRef?.current?.getpostData(mode),
            is_handwritten_detected: isHandwritten || false,
          };

          if (mode === 'UPDATE') {
            if (
              allowanceConfiguration?.is_allow_charging_to_cost_centres &&
              allowanceConfiguration?.is_default_to_entity_cost_centre
            ) {
              postData.cost_centre_uuid =
                expenseClaimFetchedDataAllowance?.cost_centre?.uuid;
            }
          } else {
            if (
              allowanceConfiguration?.is_allow_charging_to_cost_centres &&
              allowanceConfiguration?.is_default_to_entity_cost_centre
            ) {
              postData.cost_centre_uuid =
                allowanceConfiguration?.le_cost_centre?.uuid;
            }
          }
          if (expenseClaimFetchedDataAllowance?.request)
            postData.request = expenseClaimFetchedDataAllowance?.request?.id;

          if (allowanceConfiguration?.is_allow_charging_to_cost_centres) {
            if (formDataAllowance.charge_to === 'THIRD')
              delete postData.cost_centre_uuid;
            else delete postData.third_party_vendor;
          } else {
            delete postData.charge_to;
            delete postData.cost_centre_uuid;
          }

          if (!allowanceConfiguration?.is_allow_purpose)
            delete postData.purpose;

          if (isForRequest) {
            postData['request'] = requestId as number;
          }

          delete postData.legal_entity_uuid;
          delete postData.allowanceTripRecords;

          const totalAmount = Number(totalAmountCount?.total_amount);
          const totalConvertedAmount = Number(
            totalAmountCount?.total_converted_amount,
          );
          postData.amount = totalAmount;
          postData.converted_amount = totalConvertedAmount;
          postData.currency =
            selectedExpenseTypeForAllowance?.legal_entity?.currency?.id;

          if (mode === 'UPDATE') {
            postData.expense_claim = expenseClaimFetchedDataAllowance?.id;
          } else if (mode === 'ADD') {
            postData.allowance_records = uuidForAllowance;
          }

          if (
            selectedExpenseTypeForAllowance?.expense_entitlement ||
            expenseClaimFetchedDataAllowance?.expense_entitlement
          ) {
            postData.expense_entitlement =
              selectedExpenseTypeForAllowance?.expense_entitlement?.id ||
              expenseClaimFetchedDataAllowance?.expense_entitlement;
          }

          return Promise.resolve(postData);
        } catch (error) {
          console.warn(error);
          setShowAllowanceCustomField(true);
          scrollToElem(`#customForm .${error.errorFields[0].name[0]}`);
          return Promise.reject(error);
        }
      }
      return Promise.reject('Failed');
    } catch (error) {
      console.warn(error);
      scrollToElem(`#addNewExpenseForm .${error.errorFields[0].name[0]}`);
      return Promise.reject(error);
    }
  };

  /**
   * add/update claim callbacks function for allowance'
   */
  const addExpenseClaimCallback = (isForRequest: boolean, type: string) => {
    if (isForRequest) {
      return () => {
        form.resetFields();
        allowanceCommonform.resetFields();
        _resetAllowanceFormData();
        _setUUIDForAllowance(null);
        const uuidAllowance = uuid();
        history.push(`${location.pathname}?uuid=${uuidAllowance}`);
        _setUUIDForAllowance(uuidAllowance);
        if (onExpensesWithRequestUpdatedSuccessfully) {
          history.goBack();
        } else {
          onExpenseAddedSuccessfully && onExpenseAddedSuccessfully();
        }
      };
    } else {
      return () => {
        form.resetFields();
        allowanceCommonform.resetFields();
        _resetAllowanceFormData();
        _setUUIDForAllowance(null);
        const uuidAllowance = uuid();
        history.push(`${location.pathname}?uuid=${uuidAllowance}`);
        _setUUIDForAllowance(uuidAllowance);
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
        form.resetFields();
        allowanceCommonform.resetFields();
        _resetAllowanceFormData();
        if (onExpensesWithRequestUpdatedSuccessfully) {
          history.push(`/${type}/expenses-with-request`);
        } else {
          onExpenseAddedSuccessfully && onExpenseAddedSuccessfully();
        }
      };
    } else {
      return () => {
        setTimeout(() => {
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

  const handleSaveAsDrafts = async (isTrafficLightEnable: boolean) => {
    try {
      const postData = await getPostAndPutData();

      if (mode === 'ADD' || mode === 'CLONE') {
        // Add Mode
        if (isTrafficLightEnable && !isAdminEdit) {
          _fetchAllowanceExpenseClaimViolationCheckerData(
            postData,
            false,
            mode,
            addExpenseClaimCallback(isForRequest, 'drafts'),
          );
        } else {
          _sendAllowanceExpenseClaim(
            postData,
            false,
            addExpenseClaimCallback(isForRequest, 'drafts'),
          );
        }
      } else {
        // Update Mode
        if (isTrafficLightEnable && !isAdminEdit) {
          _fetchAllowanceExpenseClaimViolationCheckerData(
            { ...postData, instance_id: updateId },
            false,
            mode,
            updateExpenseClaimCallback(isForRequest, 'drafts'),
          );
        } else {
          _updateAllowanceExpenseClaim(
            postData,
            updateId as number,
            false,
            updateExpenseClaimCallback(isForRequest, 'drafts'),
          );
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSendForApproval = async (isTrafficLightEnable: boolean) => {
    try {
      const postData = await getPostAndPutData();
      if (mode === 'ADD' || mode === 'CLONE') {
        if (isTrafficLightEnable) {
          _fetchAllowanceExpenseClaimViolationCheckerData(
            postData,
            true,
            mode,
            addExpenseClaimCallback(isForRequest, 'submitted'),
          );
        } else {
          _sendAllowanceExpenseClaim(
            postData,
            true,
            addExpenseClaimCallback(isForRequest, 'submitted'),
          );
        }
      } else {
        // Update Mode
        if (isTrafficLightEnable) {
          _fetchAllowanceExpenseClaimViolationCheckerData(
            { ...postData, instance_id: updateId },
            true,
            mode,
            updateExpenseClaimCallback(isForRequest, 'submitted'),
          );
        } else {
          _updateAllowanceExpenseClaim(
            postData,
            updateId as number,
            true,
            updateExpenseClaimCallback(isForRequest, 'submitted'),
          );
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const isDisableChargeTo = (code: TchargeToCodes) => {
    let returnBool = false;
    if (
      !allowanceConfiguration?.is_allow_overseas_cost_centres &&
      code === 'OVERS'
    )
      returnBool = true;
    else if (
      !allowanceConfiguration?.is_allow_3rd_party_vendor &&
      code === 'THIRD'
    )
      returnBool = true;
    else if (
      !allowanceConfiguration?.is_allow_internal_order_cost_centres &&
      code === 'INTER'
    )
      returnBool = true;

    if (!allowanceConfiguration?.is_employee_cost_centre_readonly) {
      if (
        code === 'OVERS' &&
        getAmountState.totalAmount <
          Number(allowanceConfiguration?.overseas_cc_threshold_amount)
      ) {
        returnBool = true;
      }
    }

    return returnBool;
  };

  const chargeToChangeHandler = (value: any) => {
    _addUpdateFormData('charge_to', value);
    if (value !== 'THIRD') {
      _addUpdateFormData('cost_centre_uuid', '');
      _addUpdateFormData('third_party_vendor', '');
      if (
        value === 'LOCAL' &&
        Number(getAmountState.totalAmount) <
          Number(allowanceConfiguration?.local_cc_threshold_amount)
      ) {
        const entityUuid =
          formDataAllowance?.legal_entity_uuid && mode === 'UPDATE'
            ? formDataAllowance?.legal_entity_uuid
            : userJobInfo?.top_level_legal_entity_uuid;
        _fetchCostCentreListAllowance(value, entityUuid);
      } else {
        _fetchCostCentreListAllowance(value);
      }

      if (value !== 'LOCAL') setLocalCcLegalEntityUuid(null);
    }
    _addUpdateFormData('cost_centre_uuid', '');
    allowanceCommonform.setFieldsValue({ cost_centre_uuid: '' });
  };

  const ccThresholdValidations = debounce(
    (
      amount: number,
      configData: any = allowanceConfiguration,
      _charge_to?: TchargeToCodes,
    ) => {
      //here we are just changing charge-to and fetching list according to the charge-to.
      // check out charge-to component from commonFormField. where i'm disabling local & overseas charge-to fields.
      if (
        configData?.is_allow_charging_to_cost_centres &&
        !configData?.is_employee_cost_centre_readonly
      ) {
        if ((_charge_to || formDataAllowance.charge_to) === 'LOCAL') {
          if (amount < Number(configData?.local_cc_threshold_amount)) {
            //reset
            if (userJobInfo?.top_level_legal_entity_uuid) {
              if (
                getLocalCcLegalEntityUuid !==
                userJobInfo?.top_level_legal_entity_uuid
              ) {
                // not same legal entity
                const entityUuid =
                  formDataAllowance?.legal_entity_uuid && mode === 'UPDATE'
                    ? formDataAllowance?.legal_entity_uuid
                    : userJobInfo?.top_level_legal_entity_uuid;
                _fetchCostCentreListAllowance(
                  'LOCAL',
                  entityUuid,
                  (data: any) => {
                    let uuid =
                      mode === 'UPDATE'
                        ? data.find(
                            (item: any) =>
                              item.uuid ===
                              expenseClaimFetchedDataAllowance?.cost_centre
                                ?.uuid,
                          )
                          ? expenseClaimFetchedDataAllowance?.cost_centre?.uuid
                          : data[data.length - 1].uuid
                        : userJobInfo?.cost_centre?.uuid;
                    _addUpdateFormData('cost_centre_uuid', uuid);
                  },
                );
                setLocalCcLegalEntityUuid(entityUuid);
              }
            } else {
              _addUpdateFormData(
                'cost_centre_uuid',
                userJobInfo?.cost_centre?.uuid,
              );
              console.error(
                'DEV ERROR: Unable to get uuid of selected type legal entity',
              );
            }
          } else if (
            amount >= Number(configData?.local_cc_threshold_amount) &&
            getLocalCcLegalEntityUuid !== null &&
            formDataAllowance.charge_to === 'LOCAL'
          ) {
            _fetchCostCentreListAllowance('LOCAL', undefined, (data: any) => {
              let uuid =
                data.find(
                  (item: any) =>
                    item.uuid ===
                    expenseClaimFetchedDataAllowance?.cost_centre?.uuid,
                ) && mode === 'UPDATE'
                  ? expenseClaimFetchedDataAllowance?.cost_centre?.uuid
                  : userJobInfo?.cost_centre?.uuid;

              _addUpdateFormData('cost_centre_uuid', uuid);
            });
            setLocalCcLegalEntityUuid(null);
          }
        } else if (
          configData?.is_allow_overseas_cost_centres &&
          formDataAllowance.charge_to === 'OVERS' &&
          amount < Number(configData?.overseas_cc_threshold_amount)
        ) {
          _addUpdateFormData('charge_to', '');
          _addUpdateFormData('cost_centre_uuid', '');
        }
      }
    },
    500,
  );

  useEffect(() => {
    if (
      scannedReceiptDate?.length === 1 &&
      scannedReceiptDate[0] !== tripFormData.from_date
    ) {
      scannedFromDateClickedHandler(scannedReceiptDate[0]);
    }
    if (
      scannedReceiptDate?.length === 1 &&
      scannedReceiptDate[0] !== tripFormData.to_date
    ) {
      scannedToDateClickedHandler(scannedReceiptDate[0]);
    }
    scannedAmount?.length === 1 &&
      scannedAmount[0] !== tripFormData.amount &&
      scannedAmountClickedHandler(scannedAmount[0]);

    scannedReceiptNumber?.length === 1 &&
      scannedReceiptNumber[0] !== tripFormData.receipt_number &&
      scannedRecNumberClickedHandler(scannedReceiptNumber[0]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scannedAmount, scannedReceiptDate, scannedReceiptNumber]);

  const scannedFromDateClickedHandler = (item: any) => {
    if (item) {
      _addUpdateAllowanceTripFormData(
        'from_date',
        moment(item, ['DD/MM/YYYY']),
      );
      _allowanceTripFormOnChangeStatus('from_date', true);
      _allowanceTripFormOnChangeStatus('library_receipt', false);
      _addUpdateAllowanceTripFormData('to_date', moment(item, ['DD/MM/YYYY']));
      setButtonClickedStatus(false);
    }
  };

  const scannedToDateClickedHandler = (item: any) => {
    if (item) {
      _addUpdateAllowanceTripFormData('to_date', moment(item, ['DD/MM/YYYY']));
      _allowanceTripFormOnChangeStatus('to_date', true);
      _allowanceTripFormOnChangeStatus('library_receipt', false);
    }
  };
  const scannedAmountClickedHandler = (item: any) => {
    if (!isAllowanceAmountDisable) {
      _addUpdateAllowanceTripFormData('amount', parseFloat(item));
      calculateAmountUsingConversionRate(tripFormData?.conversion_rate);
      _allowanceTripFormOnChangeStatus('amount', true);
    }
  };
  const scannedRecNumberClickedHandler = (item: any) => {
    _addUpdateAllowanceTripFormData('receipt_number', item);
  };

  const isCostCenterSelectDisable =
    (!userJobInfo?.cost_centre?.is_chargeable ||
      !userJobInfo?.cost_centre?.is_active) &&
    allowanceConfiguration?.is_employee_cost_centre_readonly &&
    allowanceConfiguration?.is_default_to_entity_cost_centre
      ? true
      : false;

  // const returnCostCenterList = () => {
  //   try {
  //     // if (
  //     //   allowanceConfiguration?.is_allow_charging_to_cost_centres &&
  //     //   !allowanceConfiguration?.is_employee_cost_centre_readonly
  //     // ) {
  //     //   return (
  //     //     <Select
  //     //       disabled={viewOnly}
  //     //       showSearch={true}
  //     //       filterOption={(input: any, option: any) =>
  //     //         option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
  //     //       }
  //     //       loading={costCentreListLoaderForAllowance}
  //     //       getPopupContainer={trigger => trigger.parentNode}
  //     //       onChange={(value: any) => {
  //     //         _addUpdateFormData('cost_centre_uuid', value);
  //     //       }}
  //     //     >
  //     //       {costCentreListForAllowance.map((o: any, i: number) => (
  //     //         <Select.Option
  //     //           key={`cc_${i}`}
  //     //           value={o.uuid}
  //     //           title={o.title + (o?.code ? ' (' + o?.code + ')' : '')}
  //     //         >
  //     //           {o.title + (o?.code ? ' (' + o?.code + ')' : '')}
  //     //         </Select.Option>
  //     //       ))}
  //     //     </Select>
  //     //   );
  //     // } else {
  //     //   return (
  //     //     <Select
  //     //       disabled={true}
  //     //       showSearch={true}
  //     //       filterOption={(input: any, option: any) =>
  //     //         option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
  //     //       }
  //     //       getPopupContainer={trigger => trigger.parentNode}
  //     //     >
  //     //       <Select.Option
  //     //         key='Default'
  //     //         value={
  //     //           mode !== 'ADD'
  //     //             ? formDataAllowance.cost_centre_uuid
  //     //             : userJobInfo?.cost_centre?.uuid ||
  //     //               formDataAllowance.cost_centre_uuid
  //     //         }
  //     //         title={
  //     //           mode !== 'ADD'
  //     //             ? expenseClaimFetchedDataAllowance?.cost_centre?.title
  //     //             : userJobInfo?.cost_centre?.title
  //     //         }
  //     //       >
  //     //         {mode !== 'ADD'
  //     //           ? expenseClaimFetchedDataAllowance?.cost_centre?.title +
  //     //             (expenseClaimFetchedDataAllowance?.cost_centre?.code
  //     //               ? ' (' +
  //     //                 expenseClaimFetchedDataAllowance?.cost_centre?.code +
  //     //                 ')'
  //     //               : '')
  //     //           : userJobInfo?.cost_centre?.title +
  //     //             (userJobInfo?.cost_centre?.code
  //     //               ? ' (' + userJobInfo?.cost_centre?.code + ')'
  //     //               : '')}
  //     //       </Select.Option>
  //     //     </Select>
  //     //   );
  //     // }
  //   } catch (error) {
  //     console.error(error);
  //     return <></>;
  //   }
  // };

  return (
    <>
      <FilterBar
        isAddButton={false}
        enableBackBtn={isAdminEdit}
        backBtnUrl={location?.state?.backButtonUrl || undefined}
      />
      {isLoadingAllowance && <GetSkeleton />}
      <div className={isLoadingAllowance ? 'hide' : 'show'}>
        <Row gutter={rowGutter} className='allowance-form-section'>
          {/* --------------------------- ALLOWANCE TOP GREY SECTION --------------------------- */}
          <Col span={24}>
            <Row gutter={rowGutter} className='general-fields-section'>
              {/* --------------------------- ALLOWANCE TOP GREY(LHS) SECTION --------------------------- */}
              <Col sm={12} md={14} lg={15} xl={17}>
                <Row gutter={rowGutter} className='add-expense-form-container'>
                  <Form
                    {...commonFormProps}
                    form={allowanceCommonform}
                    name='allowanceExpenseForm'
                  >
                    {!viewOnly && mode === 'UPDATE' && (
                      <Col span={12} className='claim-number-conatiner'>
                        <Form.Item label={<Trans>Expense Claim No.</Trans>}>
                          <Input
                            disabled={true}
                            width={40}
                            value={
                              expenseClaimFetchedDataAllowance?.claim_number
                            }
                          />
                        </Form.Item>
                      </Col>
                    )}

                    <Col span={12}>
                      {mode === 'UPDATE' && (
                        <>
                          <Form.Item
                            className='expense-type'
                            validateStatus={
                              backendError.hasOwnProperty(
                                'expense_type_legal_entity',
                              )
                                ? 'error'
                                : 'validating'
                            }
                            help={
                              backendError.hasOwnProperty(
                                'expense_type_legal_entity',
                              )
                                ? backendError.expense_type_legal_entity[0]
                                : null
                            }
                            label={getLabelName('Expense Type', 'string')}
                            required={true}
                          >
                            <Input
                              className={`${
                                !viewOnly ? 'allowance-type-label' : ''
                              }`}
                              value={
                                expenseClaimFetchedDataAllowance
                                  ?.expense_type_legal_entity?.expense_type
                                  ?.title
                              }
                              disabled={true}
                            />
                          </Form.Item>
                        </>
                      )}
                      {!viewOnly && mode !== 'UPDATE' && (
                        <>
                          <Form.Item
                            className='expense-type'
                            name='expense_type_legal_entity'
                            validateTrigger='onBlur'
                            label={getLabelName('Expense Type', 'string')}
                            validateStatus={
                              backendError.hasOwnProperty(
                                'expense_type_legal_entity',
                              )
                                ? 'error'
                                : 'validating'
                            }
                            help={
                              backendError.hasOwnProperty(
                                'expense_type_legal_entity',
                              )
                                ? backendError.expense_type_legal_entity[0]
                                : null
                            }
                            rules={[
                              {
                                required: true,
                                message: stringTemplating(
                                  { label: 'Expense Type' },
                                  JSONData.vaidationErrors.generalForm
                                    .expense_type_legal_entity.mandatory,
                                ),
                              },
                            ]}
                          >
                            <Select
                              className='expense-type'
                              showSearch={true}
                              filterOption={(input: any, option: any) =>
                                option.children
                                  .toLowerCase()
                                  .indexOf(input.toLowerCase()) >= 0
                              }
                              onChange={(value: number) => {
                                selectedExpenseTypeHandlerAllowance(value);
                              }}
                              loading={expenseTypeListLoaderAllowance}
                              disabled={
                                expenseTypeListAllowance.length === 0
                                  ? true
                                  : isAdminEdit || recordsLength
                              }
                            >
                              {expenseTypeListAllowance &&
                                expenseTypeListAllowance.map(
                                  (expenseType: any) => (
                                    <Option
                                      key={expenseType.id}
                                      value={expenseType.id}
                                    >
                                      {expenseType.expense_type.title}
                                    </Option>
                                  ),
                                )}
                            </Select>
                          </Form.Item>
                          {expenseTypeListAllowance.length === 0 &&
                            !expenseTypeListLoaderAllowance &&
                            mode === 'ADD' && (
                              <div>
                                {' '}
                                User is not eligible for this Expense Type{' '}
                              </div>
                            )}
                        </>
                      )}
                    </Col>
                    {allowanceConfiguration?.is_allow_purpose ? (
                      <Col span={12} style={{ marginTop: '15px' }}>
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
                          required={
                            allowanceConfiguration?.is_purpose_mandatory ||
                            false
                          }
                          rules={[
                            () => ({
                              validator(_, value) {
                                if (value !== undefined) {
                                  value = value?.trim();
                                }
                                if (
                                  (!value || value === undefined) &&
                                  allowanceConfiguration?.is_purpose_mandatory
                                ) {
                                  return Promise.reject(
                                    stringTemplating(
                                      { label: 'Purpose' },
                                      JSONData.vaidationErrors.generalForm
                                        .purpose.mandatory,
                                    ),
                                  );
                                } else if (
                                  (!value || value === undefined) &&
                                  !allowanceConfiguration?.is_purpose_mandatory
                                ) {
                                  return Promise.resolve();
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
                            disabled={viewOnly}
                            onChange={(event: any) => {
                              _addUpdateFormData('purpose', event.target.value);
                            }}
                          />
                        </Form.Item>
                      </Col>
                    ) : null}
                    <Row gutter={rowGutter}>
                      {allowanceConfiguration?.is_allow_charging_to_cost_centres ? (
                        <>
                          {!allowanceConfiguration?.is_default_to_entity_cost_centre ? (
                            <>
                              <Col
                                xl={8}
                                md={12}
                                sm={12}
                                style={{
                                  marginTop: '15px',
                                  paddingLeft: '18px',
                                }}
                              >
                                <Form.Item
                                  label={getLabelName('Charge-to', 'string')}
                                  name='charge_to'
                                  validateTrigger='onBlur'
                                  className='charge-to'
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
                                    },
                                  ]}
                                >
                                  {viewOnly ? (
                                    <input
                                      autoComplete='new-password'
                                      disabled={true}
                                    />
                                  ) : (
                                    <Select
                                      disabled={
                                        viewOnly ||
                                        allowanceConfiguration?.is_employee_cost_centre_readonly
                                      }
                                      showSearch={true}
                                      filterOption={(input: any, option: any) =>
                                        option.children
                                          .toLowerCase()
                                          .indexOf(input.toLowerCase()) >= 0
                                      }
                                      getPopupContainer={trigger =>
                                        trigger.parentNode
                                      }
                                      onChange={(value: any) => {
                                        chargeToChangeHandler(value);
                                      }}
                                    >
                                      {chargeToForAllowance.map(
                                        (o: IchargeToInnerObj) => {
                                          const isDisabled = isDisableChargeTo(
                                            o.code,
                                          );
                                          return (
                                            <Select.Option
                                              key={o.code}
                                              value={o.code}
                                              disabled={isDisabled}
                                              title={o.title}
                                            >
                                              {o.title}
                                            </Select.Option>
                                          );
                                        },
                                      )}
                                    </Select>
                                  )}
                                </Form.Item>
                              </Col>
                            </>
                          ) : null}
                          {formDataAllowance.charge_to === 'THIRD' ? (
                            <Col
                              xl={8}
                              md={12}
                              sm={12}
                              style={{ marginTop: '15px', paddingLeft: '18px' }}
                            >
                              <Form.Item
                                label={getLabelName(
                                  'Third party vendor',
                                  'string',
                                )}
                                name='third_party_vendor'
                                validateTrigger='onBlur'
                                className='cost-centre'
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
                                    message: stringTemplating(
                                      {
                                        label: 'Third party vendor',
                                      },
                                      JSONData.vaidationErrors.generalForm
                                        .third_party_vendor.mandatory,
                                    ),
                                  },
                                ]}
                              >
                                <Input
                                  autoComplete='new-password'
                                  disabled={viewOnly}
                                  onChange={(event: any) => {
                                    _addUpdateFormData(
                                      'third_party_vendor',
                                      event.target.value,
                                    );
                                  }}
                                />
                              </Form.Item>
                            </Col>
                          ) : (
                            <Col
                              xl={
                                allowanceConfiguration?.is_employee_cost_centre_readonly
                                  ? 18
                                  : 8
                              }
                              md={12}
                              sm={12}
                              style={{ marginTop: '15px', paddingLeft: '18px' }}
                            >
                              <Form.Item
                                label={getLabelName('Cost Centre', 'string')}
                                name='cost_centre_uuid'
                                validateTrigger='onBlur'
                                className='cost-centre'
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
                                    : null
                                }
                                rules={[
                                  {
                                    required: true,
                                    message: stringTemplating(
                                      { label: 'Cost Centre' },
                                      JSONData.vaidationErrors.generalForm
                                        .cost_centre_uuid.mandatory,
                                    ),
                                  },
                                ]}
                              >
                                {isCostCenterSelectDisable ||
                                  allowanceConfiguration?.is_default_to_entity_cost_centre}
                                {isCostCenterSelectDisable ||
                                allowanceConfiguration?.is_default_to_entity_cost_centre ? (
                                  <Input
                                    value={
                                      expenseClaimId
                                        ? expenseClaimFetchedDataAllowance
                                            ?.cost_centre?.title ||
                                          'Default Cost Center is Either Inactive Or Not Chargeable'
                                        : allowanceConfiguration?.le_cost_centre
                                            ?.title ||
                                          'Default Cost Center is Either Inactive Or Not Chargeable'
                                    }
                                    disabled={true}
                                  />
                                ) : allowanceConfiguration?.is_default_to_entity_cost_centre ? (
                                  <Input
                                    value={
                                      allowanceConfiguration?.le_cost_centre
                                        ?.title ||
                                      'Default Cost Center is Either Inactive Or Not Chargeable'
                                    }
                                    disabled={true}
                                  />
                                ) : (
                                  <Select
                                    showSearch={true}
                                    disabled={
                                      allowanceConfiguration?.is_employee_cost_centre_readonly
                                    }
                                    value={formDataAllowance.cost_centre_uuid}
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
                                    {costCentreListForAllowance.map(
                                      (o: any) => (
                                        <Option key={o.id} value={o.uuid}>
                                          {`${o.title} (${o.code})`}
                                        </Option>
                                      ),
                                    )}
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
                        style={{ marginTop: 18, paddingLeft: 18 }}
                        span={24}
                        className={`${
                          getCollapsableVisibility
                            ? 'show-custom-fields custom-field-container'
                            : 'hide-custom-fields custom-field-container'
                        }`}
                      >
                        <CustomFieldsForm
                          isViewMode={viewOnly}
                          isAdmin={isAdminEdit}
                          ref={customFieldRef}
                          customFields={
                            allowanceConfiguration?.custom_fields || {
                              fields: [],
                              layout: [],
                            }
                          }
                          formProps={commonFormProps}
                          backendError={backendError}
                        />
                      </Col>
                    </Row>
                  </Form>
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

              {Boolean(
                allowanceConfiguration?.custom_fields?.layout?.length,
              ) && (
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
              {formDataAllowance?.allowanceTripRecords?.data?.length > 0 ? (
                <Col span={24} className='allowance-data-table'>
                  <>
                    <Table
                      scroll={{
                        x: true,
                      }}
                      dataSource={formDataAllowance.allowanceTripRecords?.data}
                      columns={columns}
                      pagination={false}
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
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row-reverse',
                        marginTop: 12,
                      }}
                    >
                      <Pagination
                        defaultCurrent={1}
                        current={currentPage}
                        onChange={(pageNumber: any, pageSize: any) => {
                          onChangePagination(pageNumber, pageSize);
                          setCurrentPage(pageNumber);
                        }}
                        hideOnSinglePage={false}
                        pageSizeOptions={['10', '12', '20', '50', '100']}
                        showSizeChanger={true}
                        pageSize={pageSize || 12}
                        onShowSizeChange={(_current: number, size: number) => {
                          setPageSize(size);
                        }}
                        total={
                          formDataAllowance.allowanceTripRecords.pagination_data
                            ?.total_records
                        }
                        showTotal={(total: number, range: number[]) => {
                          return <>{`${range[0]}-${range[1]} of ${total}`}</>;
                        }}
                        showQuickJumper={{
                          goButton: (
                            <Button type='default'>
                              <Trans>Go</Trans>
                            </Button>
                          ),
                        }}
                      />
                    </div>
                  </>
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

                {getAmountState.showAmtError ? (
                  <Alert
                    message={
                      preciseDecimal(
                        Number(allowanceConfiguration?.max_amount),
                        2,
                      ) >
                      preciseDecimal(
                        Number(allowanceConfiguration?.min_amount),
                        2,
                      )
                        ? `Total Amount should be between ${preciseDecimal(
                            Number(allowanceConfiguration?.min_amount),
                            2,
                          )} - ${preciseDecimal(
                            Number(allowanceConfiguration?.max_amount),
                            2,
                          )}`
                        : `Total Amount should be greater than or equal to ${preciseDecimal(
                            Number(allowanceConfiguration?.min_amount),
                            2,
                          )}`
                    }
                    type='error'
                  />
                ) : null}
                {getAmountState.showAmtWarning ? (
                  <Alert
                    message={allowanceConfiguration?.warning_message}
                    type='warning'
                  />
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
              setModelVisibility(false);
              setupdateCloneState(false);
              setTripEditId(null);
              _updateReceiptMandetoryStatusAllowance(initialReceiptStatus);
              _updateBackendError({});
              _allowanceTripFormOnChangeStatus('amount', false);
              setOnClose(true);
              setCloneState(false);
              setUpdateState(false);
              _allowanceTripFormOnChangeStatus('from_date', false);
              _allowanceTripFormOnChangeStatus('to_date', false);
              _allowanceTripFormOnChangeStatus('no_of_days', false);
              _addUpdateAllowanceTripFormData('from_date', '');
              _addUpdateAllowanceTripFormData('to_date', '');
              _addUpdateAllowanceTripFormData('location', null);
              _addUpdateAllowanceTripFormData('allowance_rate', null);
              _addUpdateAllowanceTripFormData('approved_amount', null);
              _addUpdateAllowanceTripFormData('amount', null);
              _addUpdateAllowanceTripFormData('allowance_currency', '');
              _addUpdateAllowanceTripFormData('conversion_rate', 1);
              _addUpdateAllowanceTripFormData('converted_amount', null);
              _addUpdateAllowanceTripFormData('receipt', []);
              _addUpdateAllowanceTripFormData('receipt_number', '');
              _addUpdateAllowanceTripFormData('supporting_documents', []);
              _addUpdateAllowanceTripFormData('library_receipt', null);
              _addUpdateAllowanceTripFormData('no_of_days', 0);
              _allowanceTripFormOnChangeStatus('library_receipt', false);
              _setDataForEditCloneTripForm(null);
              _setCreateUpdateRecordResponseData(null);
              _setSaveAndAddAnotherButtonStatus(false);
              setButtonClickedStatus(false);
              _setScanDateAmount(null, 0, '', {}, confidence, warning_msg);
              _setIsCreatedNewAllowanceRecord(false);
            }}
            title={
              selectedExpenseTypeForAllowance?.expense_type?.title
                ? `${selectedExpenseTypeForAllowance?.expense_type?.title}`
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
                    form={form}
                    {...formCommonProps}
                  >
                    <Space direction='vertical' size='middle'>
                      <Row gutter={24}>
                        <Col span={9}>
                          <Form.Item
                            label={getLabelName('From Date', 'string')}
                            name='from_date'
                            validateTrigger='onBlur'
                            className='receipt-date'
                            validateStatus={
                              backendError.hasOwnProperty('from_date')
                                ? 'error'
                                : 'validating'
                            }
                            help={
                              backendError.hasOwnProperty('from_date')
                                ? backendError.from_date[0]
                                : null
                            }
                            rules={[
                              {
                                required: true,
                                message: Errors.FROM_DATE_REQUIRED,
                              },
                            ]}
                          >
                            <DatePicker
                              format='DD/MM/YYYY'
                              disabledDate={disabledDate.bind(null, true)}
                              onChange={(date: any) => {
                                _addUpdateAllowanceTripFormData(
                                  'from_date',
                                  date,
                                );
                                _allowanceTripFormOnChangeStatus(
                                  'from_date',
                                  true,
                                );
                                _allowanceTripFormOnChangeStatus(
                                  'library_receipt',
                                  false,
                                );
                                _addUpdateAllowanceTripFormData(
                                  'to_date',
                                  date,
                                );
                                setButtonClickedStatus(false);
                              }}
                            />
                          </Form.Item>
                          {scannedReceiptDate?.length > 0 &&
                            is_enabled_ocr &&
                            // eslint-disable-next-line array-callback-return
                            scannedReceiptDate.map((item: any) => {
                              if (item.length > 0) {
                                return (
                                  <Tag
                                    color='processing'
                                    className='scanned-receipt-data'
                                    onClick={(event: any) => {
                                      event.preventDefault();
                                      scannedFromDateClickedHandler(item);
                                    }}
                                  >
                                    {item}
                                  </Tag>
                                );
                              }
                            })}
                        </Col>
                        <Col span={9}>
                          <Form.Item
                            label={getLabelName('To Date', 'string')}
                            name='to_date'
                            validateTrigger='onBlur'
                            className='receipt-date'
                            validateStatus={
                              backendError.hasOwnProperty('to_date')
                                ? 'error'
                                : 'validating'
                            }
                            help={
                              backendError.hasOwnProperty('to_date')
                                ? backendError.to_date[0]
                                : null
                            }
                            rules={[
                              {
                                required: true,
                                message: Errors.TO_DATE_REQUIRED,
                              },
                            ]}
                          >
                            <DatePicker
                              format='DD/MM/YYYY'
                              disabledDate={disabledToDate.bind(null, true)}
                              onChange={(date: any) => {
                                _addUpdateAllowanceTripFormData(
                                  'to_date',
                                  date,
                                );
                                _allowanceTripFormOnChangeStatus(
                                  'to_date',
                                  true,
                                );
                                _allowanceTripFormOnChangeStatus(
                                  'library_receipt',
                                  false,
                                );
                              }}
                            />
                          </Form.Item>
                          {scannedReceiptDate?.length > 0 &&
                            is_enabled_ocr &&
                            // eslint-disable-next-line array-callback-return
                            scannedReceiptDate.map((item: any) => {
                              if (
                                moment(item, ['DD/MM/YYYY']).isSameOrAfter(
                                  tripFormData.from_date,
                                )
                              ) {
                                return (
                                  <Tag
                                    color='processing'
                                    className='scanned-receipt-data'
                                    onClick={(event: any) => {
                                      event.preventDefault();
                                      scannedToDateClickedHandler(item);
                                    }}
                                  >
                                    {item}
                                  </Tag>
                                );
                              }
                            })}
                        </Col>
                        <Col span={5}>
                          <Form.Item
                            label={`${
                              tripFormData.no_of_days === 0 ||
                              tripFormData.no_of_days === 1
                                ? 'No. of Days'
                                : 'No. of Days'
                            }`}
                            name='no_of_days'
                            className='receipt-date'
                            rules={[
                              () => ({
                                validator(_rule, value) {
                                  if (
                                    Number(value) >
                                    Number(allowanceTripDatesDifference)
                                  ) {
                                    return Promise.reject(
                                      `Value exceeds Date Range`,
                                    );
                                  }

                                  if (Number(value) === Number(0)) {
                                    return Promise.reject(`Value cannot be 0`);
                                  }

                                  if (!Number.isInteger(value)) {
                                    return Promise.reject(
                                      `A valid integer is required`,
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
                              value={tripFormData?.no_of_days}
                              disabled={
                                !allowanceConfiguration?.is_allow_updating_no_of_days
                              }
                              onChange={(value: any) => {
                                _addUpdateAllowanceTripFormData(
                                  'no_of_days',
                                  value,
                                );
                                _allowanceTripFormOnChangeStatus(
                                  'no_of_days',
                                  true,
                                );
                                _allowanceTripFormOnChangeStatus(
                                  'library_receipt',
                                  false,
                                );
                              }}
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                      <Col span={24}>
                        <Form.Item
                          label={getLabelName('Location', 'string')}
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
                            disabled={locationDisable}
                            onSelect={() => setFilteredLocations(locationList)}
                            onChange={(value: any) => {
                              _addUpdateAllowanceTripFormData(
                                'location',
                                value,
                              );
                              _addUpdateAllowanceTripFormData(
                                'allowance_rate',
                                null,
                              );
                              _allowanceTripFormOnChangeStatus(
                                'from_date',
                                false,
                              );
                              _allowanceTripFormOnChangeStatus(
                                'to_date',
                                false,
                              );
                              _allowanceTripFormOnChangeStatus(
                                'no_of_days',
                                false,
                              );
                              _addUpdateAllowanceTripFormData('amount', null);
                              _addUpdateAllowanceTripFormData(
                                'approved_amount',
                                null,
                              );
                              _addUpdateAllowanceTripFormData(
                                'allowance_currency',
                                null,
                              );
                              _addUpdateAllowanceTripFormData(
                                'conversion_rate',
                                1,
                              );
                              _addUpdateAllowanceTripFormData('amount', null);
                              _addUpdateAllowanceTripFormData(
                                'converted_amount',
                                null,
                              );
                              _allowanceTripFormOnChangeStatus(
                                'library_receipt',
                                false,
                              );
                              setButtonClickedStatus(false);
                            }}
                          >
                            {getOptions(filteredLocations)}
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={24}>
                        <Form.Item
                          label={getLabelName('Allowance Type', 'string')}
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
                            onSelect={() =>
                              setFilteredAllowanceTypes(allowanceTypes)
                            }
                            onSearch={handleAllowanceTypeSearch}
                            onChange={(value: any) => {
                              _addUpdateAllowanceTripFormData(
                                'allowance_rate',
                                value,
                              );
                              _updateBackendError({});
                              setupdateCloneState(false);
                              setCloneState(false);
                              _allowanceTripFormOnChangeStatus('amount', false);
                              setButtonClickedStatus(false);
                            }}
                            disabled={allowanceTypeDisable}
                          >
                            {getTypeOptions(filteredAllowanceTypes)}
                          </Select>
                        </Form.Item>
                      </Col>
                      {allowanceTypeObj?.is_full_amount_allowed ? null : (
                        <Col span={24}>
                          <Form.Item
                            label={
                              <div className='default-value-btn-parent'>
                                <span>
                                  {getLabelName('Approved Amount', 'string')}
                                </span>
                                <Tooltip
                                  title={Number(defaultApprovedAmount).toFixed(
                                    2,
                                  )}
                                  trigger='click'
                                  placement='top'
                                  className='default-value-link-btn'
                                  overlayClassName='default-value-tooltip'
                                >
                                  <Button type='link'>Default</Button>
                                </Tooltip>
                              </div>
                            }
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
                              maxLength={15}
                              precision={2}
                              style={{ width: '100%' }}
                              disabled={true}
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
                              message: Errors.RECEIPTAMOUNT_REQUIRED,
                            },
                            () => ({
                              validator(_rule, value) {
                                if (
                                  value &&
                                  tripFormData?.approved_amount &&
                                  !allowanceTypeObj?.is_full_amount_allowed
                                ) {
                                  if (
                                    Number(Number(value).toFixed(2)) >
                                    Number(
                                      Number(
                                        tripFormData.approved_amount,
                                      ).toFixed(2),
                                    )
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
                              tripFormData?.allowance_rate
                                ? !allowanceTypeObj?.is_update_allowed
                                : false
                            }
                            onChange={(value: any) => {
                              _addUpdateAllowanceTripFormData('amount', value);
                              calculateAmountUsingConversionRate(
                                tripFormData?.conversion_rate,
                              );
                              _allowanceTripFormOnChangeStatus('amount', true);
                            }}
                          />
                        </Form.Item>
                        {scannedAmount?.length > 0 &&
                          is_enabled_ocr &&
                          !isAllowanceAmountDisable &&
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
                      <Col span={24}>
                        <Form.Item
                          label={getLabelName('Expense Currency', 'string')}
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
                              <span>
                                {getLabelName('Conversion Rate', 'string')}
                              </span>
                              <Tooltip
                                // title={
                                //   Number(
                                //     expenseClaimFetchedDataAllowance?.system_conversion_rate ||
                                //       1,
                                //   ).toFixed(4) || 1
                                // }
                                title={fetchedConversionRate?.toFixed(4) || 1}
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
                                if (selectedExpenseTypeForAllowance) {
                                  if (
                                    selectedExpenseTypeForAllowance
                                      ?.legal_entity.currency.currency.code ===
                                      tripFormData?.allowance_currency &&
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
                            step={0.1}
                            style={{ width: '100%' }}
                            maxLength={15}
                            min={0}
                            onChange={(value: any) => {
                              _addUpdateAllowanceTripFormData(
                                'conversion_rate',
                                value,
                              );
                              calculateAmountUsingConversionRate(value);
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
                              <span>
                                {getLabelName(
                                  'Converted Expense Amount',
                                  'string',
                                )}
                              </span>

                              <span className='dob'>
                                <InfoCircleOutlined
                                  style={{
                                    color: '#1890ff',
                                    fontSize: 18,
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
                            {selectedExpenseTypeForAllowance !== null && (
                              <span
                                className='prefix-value'
                                title={`${selectedExpenseTypeForAllowance
                                  ?.legal_entity?.currency?.currency?.title ||
                                  ''} (${
                                  selectedExpenseTypeForAllowance?.legal_entity
                                    ?.currency?.currency.code
                                })`}
                              >
                                {selectedExpenseTypeForAllowance?.legal_entity
                                  ?.currency?.currency?.code || ''}
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
                                  value={Number(tripFormData?.converted_amount)}
                                />
                              </Form.Item>
                            </span>
                          </div>
                        </Form.Item>
                      </Col>
                      {allowanceConfiguration?.can_attach_receipts ? (
                        <Col>
                          <Form.Item
                            label={getLabelName('Receipt Number', 'string')}
                            name='receipt_number'
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
                                required:
                                  allowanceTypeObj?.is_receipt_mandatory ||
                                  Boolean(tripFormData?.receipt?.length),
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
                              onChange={(event: any) => {
                                _addUpdateAllowanceTripFormData(
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
                                item.length > 0 && (
                                  <Tag
                                    color='processing'
                                    className='scanned-receipt-data'
                                    onClick={(event: any) => {
                                      event.preventDefault();
                                      _addUpdateAllowanceTripFormData(
                                        'receipt_number',
                                        item,
                                      );
                                    }}
                                  >
                                    {item}
                                  </Tag>
                                ),
                            )}
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
                        form: form,
                      }}
                      form={form}
                      formType='ALW'
                      //showReceiptComponent={false}
                      showReceiptComponent={
                        allowanceConfiguration?.can_attach_receipts &&
                        getModelVisibility
                      }
                      ref={receiptFieldRef}
                      receiptFormItemProps={{
                        label: getLabelName('Receipt Number', 'string'),
                        rules: [
                          {
                            required:
                              allowanceTypeObj?.is_receipt_mandatory ||
                              Boolean(tripFormData?.receipt_number),
                            message: Errors.RECEIPT_REQUIRED,
                          },
                        ],
                      }}
                      onReceiptChange={(changeValue: [File | string] | []) => {
                        _addUpdateAllowanceTripFormData(
                          'receipt',
                          changeValue.length ? changeValue : [],
                        );
                        if (changeValue.length === 0) {
                          _addUpdateAllowanceTripFormData(
                            'library_receipt',
                            null,
                          );
                        }
                        onUpdateReceiptDoc(changeValue);
                      }}
                      selectedReceipt={
                        // tripFormData.receipt && !Array.isArray(tripFormData.receipt)
                        //   ? [tripFormData.receipt]
                        //   : undefined

                        tripFormData.receipt
                          ? Array.isArray(tripFormData.receipt)
                            ? tripFormData.receipt
                            : [tripFormData.receipt]
                          : undefined
                      }
                      receiptGallarySelection={receiptGallarySelectionFn}
                      userFieldsForReceiptGallery={{
                        date: tripFormData.from_date,
                        amount: tripFormData.amount || 0,
                        receipt_number: tripFormData.receipt_number,
                      }}
                      receiptDisabledFields={
                        allowanceTypeObj
                          ? !allowanceTypeObj?.is_update_allowed
                            ? ['currency', 'amount']
                            : ['currency']
                          : ['currency']
                      }
                      showSupportingDocument={
                        allowanceConfiguration?.is_allow_supporting_documents
                      }
                      supportingDocumentFormItemProps={{
                        label: getLabelName('Supporting Documents', 'doc'),
                      }}
                      supportingDocuments={
                        tripFormData.supporting_documents
                          ? Array.isArray(tripFormData.supporting_documents)
                            ? tripFormData.supporting_documents
                            : [tripFormData.supporting_documents]
                          : undefined
                      }
                      supportingDocumentOnChange={(file: (File | string)[]) => {
                        _addUpdateAllowanceTripFormData(
                          'supporting_documents',
                          file,
                        );
                      }}
                      isReceiptAllowed={isReceiptAllowed}
                      _scanImage={(file: any) => file && _scanImage(file[0])}
                      scanLoader={scanLoader}
                      is_enabled_ocr={is_enabled_ocr}
                      ocrReceivedFromGallary={() => {
                        _setScanDateAmount(null, 0, '', {}, {}, {});
                      }}
                      confidence={confidence}
                      warning_msg={warning_msg}
                    />
                  </Row>
                </Col>
              </Row>
              {/* --------------------------- DRAWER FORM (ACTION BUTTONS) COMPONENT --------------------------- */}
              <Form {...formCommonProps}>
                <Row gutter={rowGutter}>
                  <Col span={15}>
                    <Row className='save-button-container' gutter={[22, 8]}>
                      <Col span={4.5}>
                        {!updateState && !cloneState && (
                          <Button
                            type='primary'
                            //ghost
                            onClick={() => {
                              handleSaveClick();
                              _setSaveAndAddAnotherButtonStatus(true);
                            }}
                          >
                            <Trans>Save & Add Another</Trans>
                          </Button>
                        )}
                      </Col>
                      <Col span={4.5}>
                        <Button
                          type='primary'
                          onClick={() => {
                            handleSaveClick();
                            _setSaveAndAddAnotherButtonStatus(false);
                          }}
                        >
                          <Trans>Save</Trans>
                        </Button>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Form>
            </div>
          </AppDrawer>
          <Form {...formCommonProps} form={form}></Form>
          <AllowanceTripDetailsDrawer
            data={getTripDetails}
            onClose={setTripDetails}
            receiptImageURL={receiptImageURL}
            mode={mode}
            userInfo={userInfo}
            allowanceConfiguration={allowanceConfiguration}
          />
          {/* --------------------------- FORM ACTION BUTTONS --------------------------- */}
          {viewOnly ? null : (
            <Row className='button-container text-right' gutter={[22, 8]}>
              <Col span={4.5}>
                <Button
                  type='primary'
                  ghost
                  onClick={() => handleSaveAsDrafts(isTrafficLightEnable)}
                  disabled={
                    !Boolean(
                      formDataAllowance.allowanceTripRecords?.data?.length,
                    )
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
                    onClick={() => handleSendForApproval(violationModalData)}
                    disabled={
                      !Boolean(
                        formDataAllowance.allowanceTripRecords?.data?.length,
                      )
                    }
                  >
                    <Trans>Send for Approval</Trans>
                  </Button>
                </Col>
              )}
            </Row>
          )}
        </Row>
      </div>
      {violationModalData?.visibility && (
        <ViolationDetails
          visibility={violationModalData?.visibility}
          item={violationModalData?.item}
          isEmployee={true}
          showFooter={true}
          onClose={_onClose}
          onSubmit={() => {
            if (violationModalData.isForAprovals) {
              handleSendForApproval(false);
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

export default connector(memo(AllowanceFormNew));
