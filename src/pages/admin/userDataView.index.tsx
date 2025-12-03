import React, { useEffect, useState, memo, Dispatch } from 'react';
import { fetchTenantConfigList } from '../configurations/configurations.thunk';

import {
  IAdminItemTypes,
  IAdminDataRequestParameters,
  ICashAdvanceRequestRespondParameters,
} from './admin.models';
import {
  NoData,
  StatusTag,
  AppDrawer,
  BrokenLink,
  ErrorBoundary,
  HeaderBarWrapper,
  ApprovalResponseCommentModal,
  DataFilter,
  ElementOrSkeleton,
  Amount,
  OptionalItem,
  ViolationDetails,
} from '../../shared/components';
import {
  IItemTypes,
  IApprovalResponseData,
} from '../approvals/approvals.model';
import {
  getExpenseDataViewColumns,
  getRequestDataViewColumns,
  getBenefitDataViewColumns,
  getEntitlementDataViewColumns,
  getBenefitEntitlementDataViewColumns,
  getBenefitEntitlementAdjustmentViewColumns,
  getEntitlementExpDataViewColumns,
  getExpenseEntitlementDataViewColumns,
  getCashAdvanceRequestDataViewColumns,
  getExpensesWithRequestDataViewColumns,
} from './tableColumns.index';
import { useHistory, useLocation } from 'react-router-dom';
import { FilterOutlined } from '@ant-design/icons';
import {
  generateQueryParamsString,
  getQueryParametersAsObject,
  timeZoneMomentDate,
  removeLastSlash,
  renderViolationsBgClass,
} from '../../utils/global.utils';
import {
  Table,
  Button,
  message,
  Row,
  Col,
  Form,
  Input,
  Radio,
  InputNumber,
  Modal,
  Pagination,
} from 'antd';
import { Trans } from '@lingui/macro';

import { appPath } from '../app/app.routes';
import { IWorkflowStatus } from '../../shared/model';
import RequestDetail from '../request/detail/requestDetail.index';
import ClaimDetails from '../addNewExpense/claimDetails/claimDetails.index';
import DisbursalModal from './components/cashAdvanceDisbursalModal/cashAdvanceDisbursalModal.index';
import CashAdvanceRejectionModal from './components/cashAdvanceRejectionModal/cashAdvanceRejectionModal.index';
import {
  getIsPresentInTargetAudience,
  stateInterface,
  getPermissions,
} from '../../shared/redux/rootReducer';
import { connect, ConnectedProps } from 'react-redux';
import {
  fetchDataGroupItems,
  // fetchDataItemsCount,
  rejectItem,
  respondToCashAdvanceRequest,
  attachExpenseWorkflowFN,
  attachRequestWorkflowFN,
  attachBenefitWorkflowFN,
  getBenefitEntitlementDetails,
  getBenefitEntitlementAdjustments,
} from './admin.thunk';
import { AxiosResponse } from 'axios';
import BenefitDetail from '../benefits/benefitDetail/benefitDetail.index';
import { fetchProfileDataAPI } from '../../services/profile';
import { sendBenefitEntitlementData } from '../../services/admin';
import {
  getExpensesForRequestService,
  getEmployeeBankDetailsService,
} from '../../services/admin';
import { fetchWorkFlowData } from '../app/app.thunk';
import { IfetchWorkFlowDataProps } from '../app/app.model';
import Store from '../../shared/redux/store/store.index';
import { setLoader, setCurrentEmployee } from './admin.actions';
import WarningIconWithTooltip from '../approvals/components/warningIconWithTooltip/warningIconWithTooltip.index';

const mapStateToProps = (state: stateInterface) => {
  const {
    isLoading,
    serviceCallFailed,
    dataGroupItems,
    dataGroupItemsPaginationData,
    activeTabKey,
    currentEmployee,
    benefitEntitlementData,
    benefitEntitlementAdjustmentData,
  } = state.admin;
  return {
    isLoading: isLoading,
    serviceCallFailed: serviceCallFailed,
    dataGroupItems: dataGroupItems,
    dataGroupItemsPaginationData: dataGroupItemsPaginationData,
    activeTabKey,
    currentEmployee: currentEmployee,
    benefitEntitlementData: benefitEntitlementData,
    benefitEntitlementAdjustmentData: benefitEntitlementAdjustmentData,
    getPermissions: getPermissions(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  return {
    _setLoader: (isLoading: boolean) => dispatch(setLoader(isLoading)),
    // _fetchDataItemsCount: (parameters?: IAdminDataRequestParameters) =>
    //   dispatch(fetchDataItemsCount(parameters)),
    _fetchDataGroupItems: (
      parameters: IAdminDataRequestParameters,
      source?: any,
    ) => dispatch(fetchDataGroupItems(parameters, source)),
    _fetchWorkFlowData: (data: IfetchWorkFlowDataProps) =>
      dispatch(fetchWorkFlowData(data)),
    _rejectItem: (
      postData: IApprovalResponseData,
      dataPageParameters?: IAdminDataRequestParameters,
    ) => dispatch(rejectItem(postData, dataPageParameters)),
    _respondToCashAdvanceRequest: (
      requestId: number,
      data: ICashAdvanceRequestRespondParameters,
      requestParameters: IAdminDataRequestParameters,
    ) =>
      dispatch(respondToCashAdvanceRequest(requestId, data, requestParameters)),
    _attachExpenseWorkflowFN: (id: number) =>
      dispatch(attachExpenseWorkflowFN(id)),
    _attachRequestWorkflowFN: (id: number) =>
      dispatch(attachRequestWorkflowFN(id)),
    _attachBenefitWorkflowFN: (id: number) =>
      dispatch(attachBenefitWorkflowFN(id)),
    _fetchTenantConfigList: () => dispatch(fetchTenantConfigList()),
    _setCurrentEmployee: (employeeData: any) =>
      dispatch(setCurrentEmployee(employeeData)),
    _getBenefitEntitlementDetails: (id: number) =>
      dispatch(getBenefitEntitlementDetails(id)),
    _getBenefitEntitlementAdjustments: (
      id: number,
      page?: any,
      pageSize?: any,
    ) => dispatch(getBenefitEntitlementAdjustments(id, page, pageSize)),
  };
};

const connector = connect(mapStateToProps, mapDispatchToProps);

let initialPageSize = 12;

const UserDataView: React.FC<ConnectedProps<typeof connector> & {
  source?: any;
  defaultFilter?: { [x: string]: any };
  employee?: any;
}> = props => {
  const {
    source,
    isLoading,
    serviceCallFailed,
    dataGroupItems,
    dataGroupItemsPaginationData,
    currentEmployee,
    benefitEntitlementData,
    benefitEntitlementAdjustmentData,
    defaultFilter = {},
    employee,
    getPermissions,
    // activeTabKey,
    _setLoader,
    // _fetchDataItemsCount,
    _fetchDataGroupItems,
    _fetchWorkFlowData,
    _rejectItem,
    _respondToCashAdvanceRequest,
    _attachExpenseWorkflowFN,
    _attachRequestWorkflowFN,
    _attachBenefitWorkflowFN,
    _fetchTenantConfigList,
    _setCurrentEmployee,
    _getBenefitEntitlementDetails,
    _getBenefitEntitlementAdjustments,
  } = props;

  const [pageSize, setPageSize] = useState(initialPageSize);
  const [modalPageSize, setModalPageSize] = useState(initialPageSize);
  let adminItemToApprovalItemMap: { [key: string]: IItemTypes } = {
    expense: 'expense',
    request: 'request',
    expenses_with_request: 'expense',
    benefit: 'benefit',
    benefit_entitlement: 'benefit',
    expense_entitlement: 'expense',
  };
  const [isViolationModal, setIsViolationModal] = useState<{
    visibility: boolean;
    item: null | any;
  }>({
    visibility: false,
    item: null,
  });
  useEffect(() => {
    _fetchTenantConfigList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { push } = useHistory();
  let location = useLocation();
  const [form] = Form.useForm();
  let pathname = location.pathname.endsWith('/')
    ? location.pathname.slice(0, -1)
    : location.pathname;

  let urlQueryParameters = getQueryParametersAsObject();
  let employeeId = employee ? employee : 0;
  let page = 1;

  if (urlQueryParameters.page !== undefined) {
    page = parseInt(urlQueryParameters.page);
  }
  if (urlQueryParameters.employee !== undefined) {
    employeeId = parseInt(urlQueryParameters.employee);
  }

  const [isEmployeeIdValid, setIsEmployeeIdValid] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [requestIsLoading, setRequestIsLoading] = useState<boolean>(false);
  const [selectedRequest, setSelectedRequest] = useState<{
    [key: string]: any;
  }>({});
  const [expensesForRequest, setExpensesForRequest] = useState<
    { [key: string]: any }[]
  >([]);

  const [employeeBankDetails, setEmployeeBankDetails] = useState<{
    [key: string]: any;
  } | null>(null);

  const getUserBankInformation = async () => {
    try {
      let response: AxiosResponse = await getEmployeeBankDetailsService(
        employeeId,
      );
      setEmployeeBankDetails(response.data);
    } catch (error) {
      setEmployeeBankDetails(null);
    }
  };

  const getItem = (): any => {
    let tab = location.pathname.split('/')[2];
    switch (tab) {
      case 'expenses':
        return 'expense';
      case 'expenses-with-requests':
        return 'expenses_with_request';
      case 'requests':
        return 'request';
      case 'cash-advance-requests':
        return 'cash_advance_request';
      case 'benefits':
        return 'benefit';
      case 'benefit-entitlement':
        return 'benefit_entitlement';
      case 'expense-entitlement':
        return 'expense_entitlement';
      default:
        return 'expense';
    }
  };

  const onChangePagination = (page: number, pageSize: number) => {
    _getBenefitEntitlementAdjustments(benefitEntitlementId, page, pageSize);
  };

  const isActionAllowed = (permissionCode: string, userId: number): boolean => {
    return getIsPresentInTargetAudience(
      Store.getState(),
      permissionCode,
      userId,
    );
  };

  const fetchEmployeeProfile = async () => {
    if (employeeId === 0) {
      setIsEmployeeIdValid(false);
    } else {
      try {
        const response: AxiosResponse = await fetchProfileDataAPI(employeeId);
        _setCurrentEmployee(response.data);
      } catch (error) {
        message.error(error.response.data.error);
      }
    }
  };

  const fetchExpensesForRequest = async (requestId: number) => {
    if (requestId !== undefined) {
      setRequestIsLoading(true);

      try {
        const response: AxiosResponse = await getExpensesForRequestService(
          requestId,
        );

        let request = response.data;
        let claims = request.claims;
        delete request['claims'];

        setSelectedRequest(request);
        setExpensesForRequest(claims);
      } catch (error) {
        message.error(error.response.data.error);
      }

      setRequestIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployeeProfile();
    employeeId > 0 && getUserBankInformation();

    setPageSize(urlQueryParameters?.page_size || 12);
    if (urlQueryParameters.request !== undefined) {
      fetchExpensesForRequest(urlQueryParameters.request);
      _setLoader(false);
    } else {
      let parameters: IAdminDataRequestParameters = {
        ...defaultFilter,
        ...urlQueryParameters,
        ...{
          function: 'data',
          employee: employeeId,
          item: getItem(),
          page: 1,
          page_size: pageSize,
        },
      };
      // localFilter = parameters;
      _fetchDataGroupItems(parameters, source);
    }
    let queryParameters = generateQueryParamsString({
      ...defaultFilter,
      ...urlQueryParameters,
      page: 1,
      employee: employeeId,
      page_size: pageSize,
    });
    push(`${location.pathname}?${queryParameters}`);

    // eslint-disable-next-line
  }, [employeeId]);

  const [filtersVisible, setFiltersVisible] = useState<boolean>(false);
  let initialFilters = { ...defaultFilter, ...urlQueryParameters };
  delete initialFilters['employee'];
  delete initialFilters['page'];
  delete initialFilters['request'];

  // State management for rejecting items modal
  const [
    responseCommentModalVisible,
    setResponseCommentModalVisible,
  ] = useState(false);
  const [approvalResponseData, setApprovalResponseData] = useState<any>({
    item: adminItemToApprovalItemMap[getItem()],
    action: 'reject',
    isAdmin: false,
  });

  const showResponseModal = (responseData: {
    item:
      | 'expense'
      | 'request'
      | 'expenses_with_request'
      | 'benefit'
      | 'benefit_entitlement'
      | 'expense_entitlement';
    employee_ids: number[];
    expense_claim_ids?: number[];
    request_ids?: number[];
    flag_color_v2?: any;
  }) => {
    setApprovalResponseData({
      action: 'reject',
      isAdmin: true,
      ...responseData,
    });
    setResponseCommentModalVisible(true);
  };

  // State management for disbursal modal

  const [disbursalModalVisible, setDisbursalModalVisible] = useState<boolean>(
    false,
  );
  const [
    editBenefitEntitlementModal,
    setEditBenefitEntitlementModal,
  ] = useState(false);
  const [
    viewBenefitEntitlementModal,
    setViewBenefitEntitlementModal,
  ] = useState(false);
  const [
    editBenefitEntitlementModalAction,
    setEditBenefitEntitlementModalAction,
  ] = useState('ADD');
  const [benefitEntitlementId, setBenefitEntitlementId] = useState<number>(0);

  const [disbursalModalProps, setDisbursalModalProps] = useState<{
    requestId: number;
    requestNumber: string;
    amountRequested: number;
    currency: string;
    startDate: string;
    endDate: string;
  } | null>(null);

  const handleOnCashAdvanceDisburseClick = (
    requestId: number,
    requestNumber: string,
    amountRequested: number,
    currency: string,
    startDate: string,
    endDate: string,
  ) => {
    setDisbursalModalProps({
      requestId: requestId,
      requestNumber: requestNumber,
      amountRequested: amountRequested,
      currency: currency,
      startDate: startDate,
      endDate: endDate,
    });
  };

  // State management for cash advance rejection modal

  const [
    cashAdvanceRejectionModalVisible,
    setCashAdvanceRejectionModalVisible,
  ] = useState<boolean>(false);
  const [
    cashAdvanceRejectionModalProps,
    setCashAdvanceRejectionModalProps,
  ] = useState<{
    requestId: number;
    requestNumber: string;
    amountRequested: number;
    currency: string;
  } | null>(null);

  const handleOnCashAdvanceRejectClick = (
    requestId: number,
    requestNumber: string,
    amountRequested: number,
    currency: string,
  ) => {
    setCashAdvanceRejectionModalProps({
      requestId: requestId,
      requestNumber: requestNumber,
      amountRequested: amountRequested,
      currency: currency,
    });
  };

  const [drawerDetailItem, setDetailDrawer] = useState<{
    visibility: boolean;
    itemType: IAdminItemTypes;
    itemSubType: any;
    itemNumber: string;
    workflowStatus: {
      code: string;
      title: any;
    };
    id: number;
    drawerTitle: string;
    width: any;
    cashAdvanceRequestDetails?: { [key: string]: any };
  } | null>(null);

  const openDetailsDrawer = (
    itemId: number,
    itemNumber: string,
    itemType: any,
    itemSubType: any,
    workflowStatus: IWorkflowStatus,
    cashAdvanceRequestDetails?: { [key: string]: any },
  ) => {
    let drawerTitle = '';
    switch (itemType) {
      case 'expense':
        drawerTitle = 'Expense Claim No. #' + itemNumber;
        break;
      case 'request':
        drawerTitle = 'Request No. #' + itemNumber;
        break;
      case 'cash_advance_request':
        drawerTitle = 'Cash Advance Request. #' + itemNumber;
        break;
      case 'benefit':
        drawerTitle = 'Benefit Claim No. #' + itemNumber;
        break;
      default:
        break;
    }

    setDetailDrawer({
      visibility: true,
      itemType: itemType,
      itemSubType: itemSubType,
      itemNumber: itemNumber,
      workflowStatus: workflowStatus,
      id: itemId,
      drawerTitle: drawerTitle,
      cashAdvanceRequestDetails: cashAdvanceRequestDetails,
      width: '70%',
    });
  };
  const closeDetailsDrawer = () => {
    setDetailDrawer(null);
  };
  const getViolationTitleWithIcons = (record: any) => {
    return (
      <small className='violationIcon-container'>
        {['ORA', 'RED'].includes(record?.flag_color_v2) && (
          <Trans>Policy Violations -</Trans>
        )}
        {record?.flag_color_v2 === 'ORA' && (
          <WarningIconWithTooltip
            filled={false}
            color='ORANGE'
            id={record.id}
            onIconClick={() => {
              setIsViolationModal({
                visibility: true,
                item: record,
              });
            }}
          />
        )}
        {record?.flag_color_v2 === 'RED' && (
          <WarningIconWithTooltip
            filled={false}
            color='RED'
            id={record.id}
            onIconClick={() => {
              setIsViolationModal({ visibility: true, item: record });
            }}
          />
        )}
      </small>
    );
  };
  const onClose = () => {
    setIsViolationModal({ visibility: false, item: null });
  };
  const getBreadcrumbName = () => {
    let item = getItem();
    let itemToBreadcrumbNameMap: { [key: string]: string } = {
      expense: 'Expenses',
      request: 'Requests',
      cash_advance_request: 'Cash Advance Requests',
      expenses_with_request: 'Expenses With Requests',
      benefit: 'Benefits',
      benefit_entitlement: 'Benefit Entitlement',
      expense_entitlement: 'Expense Entitlement',
    };
    return itemToBreadcrumbNameMap[item];
  };

  const getBreadcrumbProps = () => {
    let routes = [
      {
        path: location.pathname,
        breadcrumbName: getBreadcrumbName(),
      },
    ];

    if (isEmployeeIdValid === true) {
      employeeId > 0 &&
        routes.push({
          path: `${pathname}?employee=${employeeId}&page=1`,
          breadcrumbName: currentEmployee
            ? currentEmployee?.legal_name || currentEmployee.name
            : 'Fetching...',
        });

      if (urlQueryParameters.request !== undefined) {
        routes.push({
          path: `${location.pathname}?employee=${employeeId}&page=1&request=${urlQueryParameters.request}`,
          breadcrumbName: requestIsLoading
            ? 'Fetching...'
            : selectedRequest.request_no,
        });
      }
    }

    return { routes };
  };

  const onApproverSelectionFn = (_approvers: number[], _stepId: number) => {};

  const handleStatusTagClicked = (
    id: number,
    isActionVisible: boolean = true,
    type: IItemTypes,
    showAttachedWorkflow: boolean = false,
    onWorkflowAttachedFn?: () => void,
  ) => {
    let item = getItem();
    let itemToBreadcrumbNameMap: { [key: string]: string } = {
      expense: 'ACTION_ON_EXPENSE_WORKFLOW',
      request: 'ACTION_ON_REQUEST_WORKFLOW',
      expenses_with_request: 'ACTION_ON_EXPENSE_WITH_REQUEST_WORKFLOW',
      benefit: 'ACTION_ON_BENEFIT_WORKFLOW',
    };
    let permissions = itemToBreadcrumbNameMap[item];
    const workflowComponentProps: any = {
      isAdmin: isActionVisible,
      employeeId: employeeId,
      permissions: permissions,
      onApproverSelection: onApproverSelectionFn,
      showAttachedWorkflow: showAttachedWorkflow,
      onWorkflowAttached: onWorkflowAttachedFn,
    };
    if (!showAttachedWorkflow) {
      delete workflowComponentProps.onWorkflowAttached;
    }
    _fetchWorkFlowData({
      id: id,
      type: type,
      workflowComponentProps,
    });
  };

  const pushUpdateUrl = (item: IAdminItemTypes, id: number) => {
    switch (item) {
      case 'expense':
        push(`${appPath.addNewExpense.update.linkTo}${id}?mode=admin`, {
          backButtonUrl: `${removeLastSlash(location.pathname)}${
            location.search
          }`,
        });
        break;
      case 'request':
        push(`${appPath.addNew.addRequest.update.linkTo}${id}?mode=admin`, {
          backButtonUrl: `${removeLastSlash(location.pathname)}${
            location.search
          }`,
        });
        break;
      case 'benefit':
        push(`${appPath.benefit.update.linkTo}${id}?mode=admin`, {
          backButtonUrl: `${removeLastSlash(location.pathname)}${
            location.search
          }`,
        });
        break;
      default:
        break;
    }
  };
  const editItem = async (id: number, data: any) => {
    await _getBenefitEntitlementDetails(id);
    setEditBenefitEntitlementModal(true);
  };
  const onCancel = () => {
    setEditBenefitEntitlementModal(false);
    setEditBenefitEntitlementModalAction('ADD');
    form.resetFields();
  };
  const viewEntitlementAdjustments = async (id: number) => {
    await _getBenefitEntitlementAdjustments(id, 1, modalPageSize);
    setViewBenefitEntitlementModal(true);
    setBenefitEntitlementId(id);
  };

  const onSave = async () => {
    try {
      const values = await form.validateFields();
      const body = { ...values, action: editBenefitEntitlementModalAction };
      const data = {
        amount: body.amount,
        action: body.action,
        reason: body.reason || '',
      };
      await sendBenefitEntitlementData(benefitEntitlementData.id, data);
      onCancel();
      window.location.reload();
    } catch (err) {
      const msg = err.response.data.error || err.response.data.detail;
      message.error(msg);
      // console.error('Validate Failed:', errInfo);
    }
  };
  const getUserDataView = () => {
    if (!isEmployeeIdValid) {
      let noDataDescription =
        currentEmployee?.legal_name || currentEmployee.name !== null
          ? `You are not allowed to view records for ${currentEmployee?.legal_name ||
              currentEmployee.name}`
          : 'You are not allowed to view records for this user';

      return <NoData description={noDataDescription} />;
    }

    if (serviceCallFailed) {
      return (
        <BrokenLink
          description='Your requested data could not be fetched'
          onTryAgain={() => {
            let parameters: IAdminDataRequestParameters = {
              // ...defaultFilter,
              ...urlQueryParameters,
              function: 'data',
              item: getItem(),
              employee: employeeId,
              page: page,
              page_size: pageSize,
            };

            fetchDataGroupItems(parameters);
          }}
        />
      );
    }

    let tableProps: { [key: string]: any } = {
      bordered: true,
      scroll: {
        x: true,
      },
      pagination: {
        position: 'bottom',
        hideOnSinglePage: false,
        current:
          page !== undefined
            ? typeof page === 'string'
              ? parseInt(page)
              : page
            : 1,
        defaultPageSize: 12,
        showSizeChanger: true,
        pageSizeOptions: ['10', '12', '20', '50', '100'],
        defaultCurrent: 1,
        showQuickJumper: { goButton: <Button type='default'>Go</Button> },
        pageSize: pageSize ? pageSize : 12,
        total: dataGroupItemsPaginationData?.total_records,
        showLessItems: true,
        onShowSizeChange: (_page: number, size: number) => {
          setPageSize(size);
        },
        showTotal: (total: number, range: number[]) => {
          return <>{`${range[0]}-${range[1]} of ${total}`}</>;
        },
        onChange: (pageNumber: number, pageSize: any) => {
          let parameters: IAdminDataRequestParameters = {
            ...defaultFilter,
            ...urlQueryParameters,
            function: 'data',
            item: getItem(),
            employee: employeeId,
            page: pageNumber,
            page_size: pageSize,
          };

          let queryParameters = generateQueryParamsString({
            ...defaultFilter,
            ...urlQueryParameters,
            page: String(pageNumber),
            page_size: String(pageSize),
            employee: employeeId,
          });
          _fetchDataGroupItems(parameters, source);

          push(`${location.pathname}?${queryParameters}`);
        },
      },
      dataSource: dataGroupItems,
      rowKey: 'id',
    };

    switch (getItem()) {
      case 'expense':
        tableProps.rowKey = 'claim_number';
        tableProps.className = 'user-expenses-data';
        tableProps.columns = getExpenseDataViewColumns(
          employeeId,
          openDetailsDrawer,
          handleStatusTagClicked,
          showResponseModal,
          pushUpdateUrl,
          isActionAllowed,
          _attachExpenseWorkflowFN,
          getViolationTitleWithIcons,
        );
        tableProps.rowClassName = (record: any, rowIndex: any) =>
          renderViolationsBgClass(record);
        break;
      case 'request':
        tableProps.rowKey = 'request_no';
        tableProps.className = 'user-requests-data';
        tableProps.columns = getRequestDataViewColumns(
          employeeId,
          openDetailsDrawer,
          handleStatusTagClicked,
          showResponseModal,
          pushUpdateUrl,
          isActionAllowed,
          _attachRequestWorkflowFN,
        );
        break;
      case 'benefit':
        tableProps.rowKey = 'claim_number';
        tableProps.className = 'user-benefits-data';
        tableProps.columns = getBenefitDataViewColumns(
          employeeId,
          openDetailsDrawer,
          handleStatusTagClicked,
          showResponseModal,
          pushUpdateUrl,
          isActionAllowed,
          _attachBenefitWorkflowFN,
        );
        break;
      case 'cash_advance_request':
        tableProps.rowKey = 'cash_advance_request_number';
        tableProps.className = 'user-cash-advance-requests-data';
        tableProps.columns = getCashAdvanceRequestDataViewColumns(
          employeeId,
          openDetailsDrawer,
          handleOnCashAdvanceDisburseClick,
          handleOnCashAdvanceRejectClick,
          setDisbursalModalVisible,
          setCashAdvanceRejectionModalVisible,
          isActionAllowed,
        );
        break;
      case 'expenses_with_request':
        tableProps.rowKey = 'request_no';
        tableProps.className = 'expenses-with-requests-user-data';
        tableProps.columns = getExpensesWithRequestDataViewColumns(
          employeeId,
          openDetailsDrawer,
          handleStatusTagClicked,
          isActionAllowed,
          _attachExpenseWorkflowFN,
        );

        tableProps.expandable = {
          expandedRowRender: (record: any) => (
            <Table
              columns={getExpenseDataViewColumns(
                employeeId,
                openDetailsDrawer,
                handleStatusTagClicked,
                showResponseModal,
                pushUpdateUrl,
                isActionAllowed,
                _attachExpenseWorkflowFN,
                getViolationTitleWithIcons,
              )}
              size='middle'
              dataSource={record.claims}
              pagination={false}
              className='user-expenses-data'
              rowClassName={(record: any, rowIndex: any) =>
                renderViolationsBgClass(record)
              }
            />
          ),
          expandedRowClassName: (_record: any) => 'expanded-request-row',
          indentSize: 0,
        };
        break;
      case 'benefit_entitlement':
        tableProps.rowKey = 'id';
        tableProps.className =
          'expenses-with-requests-user-data benefit-entitlement';
        tableProps.columns = getBenefitEntitlementDataViewColumns(
          employeeId,
          openDetailsDrawer,
          isActionAllowed,
          editItem,
          viewEntitlementAdjustments,
          getPermissions,
        );
        tableProps.expandable = {
          expandedRowRender: (record: any) => (
            <Table
              columns={getEntitlementDataViewColumns(
                employeeId,
                openDetailsDrawer,
                handleStatusTagClicked,
                isActionAllowed,
                _attachExpenseWorkflowFN,
              )}
              size='middle'
              dataSource={record.benefits}
              pagination={false}
              className='user-expenses-data benefit-entitlement-user-data'
            />
          ),
          expandedRowClassName: (_record: any) => 'expanded-request-row',
          indentSize: 0,
        };
        break;

      case 'expense_entitlement':
        tableProps.rowKey = 'id';
        tableProps.className =
          'expenses-with-requests-user-data benefit-entitlement';
        tableProps.columns = getExpenseEntitlementDataViewColumns(
          employeeId,
          openDetailsDrawer,
          isActionAllowed,
        );
        tableProps.expandable = {
          expandedRowRender: (record: any) => (
            <Table
              columns={getEntitlementExpDataViewColumns(
                employeeId,
                openDetailsDrawer,
                handleStatusTagClicked,
                isActionAllowed,
                _attachExpenseWorkflowFN,
              )}
              size='middle'
              dataSource={record.expenses}
              pagination={false}
              className='user-expenses-data benefit-entitlement-user-data'
            />
          ),
          expandedRowClassName: (_record: any) => 'expanded-request-row',
          indentSize: 0,
        };
        break;
    }

    return <Table {...tableProps} size='middle' />;
  };

  const getExpensesForRequestView = () => {
    if (serviceCallFailed) {
      return (
        <BrokenLink
          description='Expenses for the request could not be fetched'
          onTryAgain={() => {
            fetchEmployeeProfile();
            fetchExpensesForRequest(urlQueryParameters.request);
          }}
        />
      );
    }

    return (
      <Table
        bordered={true}
        pagination={false}
        columns={getExpenseDataViewColumns(
          employeeId,
          openDetailsDrawer,
          handleStatusTagClicked,
          showResponseModal,
          pushUpdateUrl,
          isActionAllowed,
          _attachExpenseWorkflowFN,
        )}
        dataSource={expensesForRequest}
        rowKey='id'
        className='expenses-with-requests-user-data'
        size='middle'
      />
    );
  };

  const getUserDataOrExpensesForRequestView = () => {
    if (urlQueryParameters.request === undefined) {
      return getUserDataView();
    } else {
      return getExpensesForRequestView();
    }
  };

  const applyFilters = (filters: { [key: string]: any }) => {
    let queryParameters = generateQueryParamsString(filters);
    let parameters: IAdminDataRequestParameters = {
      ...defaultFilter,
      ...{
        function: 'data',
        item: getItem(),
        employee: employeeId,
      },
      ...filters,
      page_size: pageSize,
    };
    if (
      getItem() === 'expense_entitlement' ||
      getItem() === 'benefit_entitlement'
    ) {
      delete parameters.from_date;
      delete parameters.to_date;
    }
    _fetchDataGroupItems(parameters, source);

    if (queryParameters.length > 1) {
      push(
        `${location.pathname}?employee=${employeeId}&page=1&${queryParameters}&page_size=${pageSize}`,
      );
    } else {
      push(
        `${location.pathname}?employee=${employeeId}&page=1&page_size=${pageSize}`,
      );
    }
  };

  const resetFilters = () => {
    let item = getItem();
    if (item === 'expense_entitlement' || item === 'benefit_entitlement') {
      initialFilters = { ...defaultFilter };
    }
    let queryParameters = generateQueryParamsString(defaultFilter);
    let parameters: IAdminDataRequestParameters = {
      ...defaultFilter,
      ...{
        function: 'data',
        item: getItem(),
        employee: employeeId,
      },
      page_size: pageSize,
    };
    _fetchDataGroupItems(parameters, source);

    if (queryParameters.length > 1) {
      push(
        `${location.pathname}?employee=${employeeId}&page=1&${queryParameters}&page_size=${pageSize}`,
      );
    } else {
      push(
        `${location.pathname}?employee=${employeeId}&page=1&page_size=${pageSize}`,
      );
    }
  };

  const getBackBtnURL = (): string => {
    const urlSubType: any = {
      expense: 'expenseClaims',
      request: 'requests',
      cash_advance_request: 'cashAdvanceRequests',
      expenses_with_request: 'expensesWithRequests',
      benefit_entitlement: 'benefitEntitlement',
      expense_entitlement: 'expenseEntitlement',
      benefit: 'benefits',
    };
    const backBtnUrl: string = (appPath.admin as any)[urlSubType[getItem()]]
      .linkTo;
    const item = getItem();
    const queryObject = { ...urlQueryParameters };
    delete queryObject.page;
    delete queryObject.employee;

    let queryParameters = generateQueryParamsString(queryObject);
    const backBtnUrlWithQuery =
      item === 'expense_entitlement' || item === 'benefit_entitlement'
        ? `${backBtnUrl}/`
        : `${backBtnUrl}/?${queryParameters}`;
    return backBtnUrl ? backBtnUrlWithQuery : appPath.admin.linkTo;
  };
  let includeBatchNumberStatus = [
    'expense',
    'expenses_with_request',
    'benefit',
  ].includes(getItem());
  return (
    <>
      <HeaderBarWrapper
        headerCommonProps={{ title: <Trans>Admin</Trans> }}
        breadcrumbCompVisibility={true}
        breadcrumbCompProps={{
          enableBackBtn: true,
          breadcrumProps: getBreadcrumbProps(),
          backBtnUrl: getBackBtnURL(),
          onBackClick: () => {
            if (urlQueryParameters.request !== undefined) {
              let parameters: IAdminDataRequestParameters = {
                ...urlQueryParameters,
                ...{
                  function: 'data',
                  employee: employeeId,
                  item: getItem(),
                },
              };
              _fetchDataGroupItems(parameters, source);
            }

            // if (urlQueryParameters.request === undefined) {
            //   _fetchDataItemsCount(
            //     activeTabKey === 'cash-advance-requests'
            //       ? undefined
            //       : {
            //           function: 'count',
            //           ...defaultFilter,
            //         },
            //   );
            // } else {
            //   let parameters: IAdminDataRequestParameters = {
            //     ...urlQueryParameters,
            //     ...{
            //       function: 'data',
            //       employee: employeeId,
            //       item: getItem(),
            //     },
            //   };
            //   _fetchDataGroupItems(parameters);
            // }
          },
        }}
      >
        {isEmployeeIdValid ? (
          <>
            <div className='finance-admin-container'>
              <div className='user-data-view'>
                {urlQueryParameters.request === undefined ||
                getItem() !== 'expenses_with_request' ? (
                  <div
                    className={
                      filtersVisible ? 'active action-bar' : 'action-bar'
                    }
                  >
                    <div className={filtersVisible ? 'row active' : 'row'}>
                      <ElementOrSkeleton
                        isLoading={isLoading}
                        type='button'
                        isActive={true}
                        skeletonStyle={{
                          float: 'right',
                          marginBottom: '12px',
                        }}
                      >
                        <Button
                          type='default'
                          title='Filter'
                          className='filter-toggle-button'
                          icon={<FilterOutlined />}
                          onClick={() =>
                            setFiltersVisible(filtersVisible => !filtersVisible)
                          }
                        />
                      </ElementOrSkeleton>
                    </div>
                    <DataFilter
                      page='ADMIN'
                      item={getItem()}
                      isVisible={filtersVisible}
                      includeStatusBar={
                        getItem() === 'expense_entitlement' ||
                        getItem() === 'benefit_entitlement'
                          ? false
                          : true
                      }
                      includeDraftStatus={false}
                      includeLegalEntities={false}
                      includeSaveFilterOption={false}
                      includeBatchNumber={includeBatchNumberStatus}
                      onApplyFilters={(filters: { [key: string]: any }) => {
                        applyFilters(filters);
                      }}
                      onResetFilters={resetFilters}
                      initialFilters={initialFilters}
                      includeItemNumber={true}
                      includeForRequestNumber={
                        getItem() === 'expenses_with_request'
                      }
                      includeSettlementDate={[
                        'expense',
                        'expenses_with_request',
                        'benefit',
                      ].includes(getItem())}
                      includeLastActionPriorToDate={
                        getItem() === 'cash_advance_request' ||
                        getItem() === 'expense_entitlement' ||
                        getItem() === 'benefit_entitlement'
                          ? false
                          : true
                      }
                      includeYearFilter={
                        getItem() === 'expense_entitlement' ||
                        getItem() === 'benefit_entitlement'
                          ? true
                          : false
                      }
                      includePendingApprovalAtUserList={
                        getItem() === 'cash_advance_request' ||
                        getItem() === 'expense_entitlement' ||
                        getItem() === 'benefit_entitlement'
                          ? false
                          : true
                      }
                      includeEntityList={
                        getItem() === 'expense_entitlement' ||
                        getItem() === 'benefit_entitlement'
                          ? false
                          : true
                      }
                      includeEmpoyeeList={
                        getItem() === 'expense_entitlement' ||
                        getItem() === 'benefit_entitlement'
                          ? false
                          : true
                      }
                    />
                  </div>
                ) : (
                  <></>
                )}
                <div className='table'>
                  <ElementOrSkeleton
                    type='table'
                    isLoading={isLoading || requestIsLoading}
                    isActive={true}
                  >
                    {getUserDataOrExpensesForRequestView()}
                  </ElementOrSkeleton>
                </div>
              </div>
            </div>
            <ErrorBoundary>
              <AppDrawer
                width={'70%'}
                visible={drawerDetailItem?.visibility}
                destroyOnClose={true}
                closable={true}
                onClose={closeDetailsDrawer}
                title={
                  <>
                    <span>{drawerDetailItem?.drawerTitle}</span>
                    <span>&nbsp;</span>
                    <StatusTag
                      status={
                        drawerDetailItem?.workflowStatus as IWorkflowStatus
                      }
                      onStatusClick={
                        drawerDetailItem?.itemType !== 'cash_advance_request' &&
                        (handleStatusTagClicked.bind(
                          null,
                          drawerDetailItem?.id as number,
                          drawerDetailItem?.itemSubType ===
                            'benefit entitlement' ||
                            drawerDetailItem?.itemSubType ===
                              'expense entitlement'
                            ? false
                            : true,
                          drawerDetailItem?.itemType as
                            | 'expense'
                            | 'request'
                            | 'benefit',
                        ) as any)
                      }
                    />
                  </>
                }
                showCancelButton={false}
                showOkButton={false}
                getContainer='.finance-admin-container'
                className='detail-drawer no-header-border'
              >
                {(() => {
                  switch (drawerDetailItem?.itemType) {
                    case 'expense':
                      return (
                        <ClaimDetails
                          claimId={drawerDetailItem.id}
                          isAdmin={true}
                        />
                      );
                    case 'request':
                      return (
                        <RequestDetail
                          requestId={drawerDetailItem.id}
                          isAdmin={false}
                        />
                      );
                    case 'benefit':
                      return (
                        <BenefitDetail
                          benefitClaimId={drawerDetailItem.id}
                          isAdmin={true}
                        />
                      );
                    case 'cash_advance_request':
                      return (
                        <div className='cash-advance-request-detail'>
                          <div className='bank-detail'>
                            <h3 className='header'>
                              <Trans>Bank Details</Trans>
                            </h3>
                            {employeeBankDetails !== null ? (
                              <>
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
                              </>
                            ) : (
                              <span>
                                <Trans>
                                  Employee bank details are unavailable
                                </Trans>
                              </span>
                            )}
                          </div>
                          <div className='disbursement-details'>
                            <Row gutter={16}>
                              <Col className='detail-field' span={6}>
                                <div className='label'>
                                  <Trans>Disbursement Date</Trans>
                                </div>
                                <div className='value'>
                                  {drawerDetailItem.cashAdvanceRequestDetails
                                    ?.disbursementDate
                                    ? drawerDetailItem.cashAdvanceRequestDetails
                                        ?.disbursementDate
                                    : '--'}
                                </div>
                              </Col>
                              <Col className='detail-field' span={6}>
                                <div className='label'>
                                  <Trans>Disbursed Amount</Trans>
                                </div>
                                <div className='value'>
                                  {drawerDetailItem.cashAdvanceRequestDetails
                                    ?.disbursedAmount !== undefined ? (
                                    <Amount
                                      currency={
                                        drawerDetailItem
                                          .cashAdvanceRequestDetails.currency
                                      }
                                      amount={
                                        drawerDetailItem
                                          .cashAdvanceRequestDetails
                                          ?.disbursedAmount
                                      }
                                      noStyle={true}
                                    />
                                  ) : (
                                    '--'
                                  )}
                                </div>
                              </Col>
                              <Col className='detail-field' span={6}>
                                <div className='label'>
                                  <Trans>Disbursed Via</Trans>
                                </div>
                                <div className='value'>
                                  {drawerDetailItem.cashAdvanceRequestDetails
                                    ?.disbursedVia
                                    ? drawerDetailItem.cashAdvanceRequestDetails
                                        ?.disbursedVia
                                    : '--'}
                                </div>
                              </Col>
                              <Col className='detail-field' span={6}>
                                <div className='label'>
                                  <Trans>Remark</Trans>
                                </div>
                                <div className='value'>
                                  {drawerDetailItem.cashAdvanceRequestDetails
                                    ?.remark
                                    ? drawerDetailItem.cashAdvanceRequestDetails
                                        .remark
                                    : '--'}
                                </div>
                              </Col>
                            </Row>

                            {drawerDetailItem.cashAdvanceRequestDetails !==
                              null &&
                              drawerDetailItem.cashAdvanceRequestDetails !==
                                undefined &&
                              drawerDetailItem.cashAdvanceRequestDetails.status
                                .code !== 'PENDNG' && (
                                <Row gutter={16}>
                                  <Col className='detail-field' span={6}>
                                    <div className='label'>
                                      {drawerDetailItem
                                        .cashAdvanceRequestDetails.status
                                        .code === 'DISBSD' ? (
                                        <Trans>Approved By</Trans>
                                      ) : (
                                        'Rejected By'
                                      )}
                                    </div>
                                    <div className='value'>
                                      {drawerDetailItem
                                        .cashAdvanceRequestDetails.responded_by
                                        .legal_name ||
                                        drawerDetailItem
                                          .cashAdvanceRequestDetails
                                          .responded_by.name}
                                    </div>
                                  </Col>
                                  <Col className='detail-field' span={6}>
                                    <div className='label'>
                                      {drawerDetailItem
                                        .cashAdvanceRequestDetails.status
                                        .code === 'DISBSD' ? (
                                        <Trans>Approved On</Trans>
                                      ) : (
                                        'Rejected On'
                                      )}
                                    </div>
                                    <div className='value'>
                                      {timeZoneMomentDate(
                                        drawerDetailItem
                                          .cashAdvanceRequestDetails
                                          .responded_on,
                                      ).format('DD/MM/YYYY HH:mm')}
                                    </div>
                                  </Col>
                                </Row>
                              )}
                          </div>
                        </div>
                      );
                    default:
                      break;
                  }
                })()}
              </AppDrawer>

              <ApprovalResponseCommentModal
                action='reject'
                visible={responseCommentModalVisible}
                responseData={approvalResponseData}
                dataPageParameters={{
                  ...urlQueryParameters,
                  item: getItem(),
                  function: 'data',
                }}
                onConfirmOk={(
                  responseData: IApprovalResponseData,
                  dataPageParameters?: IAdminDataRequestParameters,
                ) => {
                  if (dataPageParameters) {
                    if (dataPageParameters.item === 'expenses_with_request') {
                      _rejectItem(responseData, dataPageParameters);
                      setTimeout(() => {
                        fetchExpensesForRequest(urlQueryParameters.request);
                      }, 1000);
                    } else {
                      _rejectItem(responseData, dataPageParameters);
                    }
                  }
                }}
                setModalVisible={(isVisible: boolean) => {
                  setResponseCommentModalVisible(isVisible);
                }}
              />

              <DisbursalModal
                isVisible={disbursalModalVisible}
                requestId={disbursalModalProps?.requestId}
                amountRequested={disbursalModalProps?.amountRequested}
                currency={disbursalModalProps?.currency}
                requestNumber={disbursalModalProps?.requestNumber}
                startDate={disbursalModalProps?.startDate}
                endDate={disbursalModalProps?.endDate}
                onClose={() => {
                  setDisbursalModalVisible(false);
                  setDisbursalModalProps(null);
                }}
                respondToCashAdvanceRequest={(
                  requestId: number,
                  data: ICashAdvanceRequestRespondParameters,
                  requestParameters: IAdminDataRequestParameters,
                ) => {
                  _respondToCashAdvanceRequest(
                    requestId,
                    data,
                    requestParameters,
                  );
                }}
                setDisbursalModalVisible={(visible: boolean) => {
                  setDisbursalModalVisible(visible);
                }}
                employee={employeeId}
                page={page}
              />

              <CashAdvanceRejectionModal
                isVisible={cashAdvanceRejectionModalVisible}
                requestId={cashAdvanceRejectionModalProps?.requestId}
                amountRequested={
                  cashAdvanceRejectionModalProps?.amountRequested
                }
                currency={cashAdvanceRejectionModalProps?.currency}
                requestNumber={cashAdvanceRejectionModalProps?.requestNumber}
                onClose={() => {
                  setCashAdvanceRejectionModalVisible(false);
                  setCashAdvanceRejectionModalProps(null);
                }}
                respondToCashAdvanceRequest={(
                  requestId: number,
                  data: ICashAdvanceRequestRespondParameters,
                  requestParameters: IAdminDataRequestParameters,
                ) => {
                  _respondToCashAdvanceRequest(
                    requestId,
                    data,
                    requestParameters,
                  );
                }}
                setCashAdvanceRejectionModalVisible={(visible: boolean) => {
                  setCashAdvanceRejectionModalVisible(visible);
                }}
                employee={employeeId}
                page={page}
              />
              <AppDrawer
                title={<Trans>Benefit-Entitlement</Trans>}
                width={'30%'}
                onClose={() => onCancel()}
                visible={editBenefitEntitlementModal}
                onCancelClick={onCancel}
                onOkClick={onSave}
                OkText={'Update'}
                getContainer='.finance-admin-container'
                className='detail-drawer no-header-border'
              >
                <Row justify='start' className='formContainer'>
                  <Col span={24} offset={0}>
                    <Form
                      // {...fullscreenFormLayout}
                      colon={false}
                      form={form}
                      // {...formItemLayout}
                      autoComplete='off'
                      layout='vertical'
                    >
                      <Row gutter={[16, 16]}>
                        <Col span={24}>
                          <OptionalItem
                            title={<Trans>Entitled Amount</Trans>}
                            value={benefitEntitlementData.entitled_amount}
                          />
                        </Col>
                        <Col span={24}>
                          <OptionalItem
                            title={<Trans>Total Claimed Amount</Trans>}
                            value={benefitEntitlementData.total_claimed}
                          />
                        </Col>
                        <Col span={24}>
                          <OptionalItem
                            title={<Trans>Remaining Amount</Trans>}
                            value={benefitEntitlementData.remaining_amount}
                          />
                        </Col>
                        <Col span={24}>
                          <Form.Item
                            name='amount'
                            validateTrigger='onChange'
                            label='Amount'
                            rules={[
                              { required: true },
                              () => ({
                                validator(_rule, value) {
                                  if (typeof value === 'number') {
                                    if (value <= 0) {
                                      return Promise.reject(
                                        'Amount should be greater than 0',
                                      );
                                    }
                                    if (value > Number.MAX_SAFE_INTEGER) {
                                      return Promise.reject(
                                        `Amount should be lesser than ${Number.MAX_SAFE_INTEGER}`,
                                      );
                                    }
                                  }
                                  return Promise.resolve();
                                },
                              }),
                            ]}
                          >
                            <InputNumber
                              autoComplete='off'
                              style={{ width: '100%' }}
                              precision={2}
                              min={1}
                              maxLength={15}
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                      <Form.Item name='action' label='' valuePropName='checked'>
                        <Radio.Group
                          value={editBenefitEntitlementModalAction}
                          onChange={e =>
                            setEditBenefitEntitlementModalAction(e.target.value)
                          }
                        >
                          <Radio value={'ADD'}>
                            <Trans>Add</Trans>
                          </Radio>
                          <Radio value={'SUB'}>
                            <Trans>Subtract</Trans>
                          </Radio>
                        </Radio.Group>
                      </Form.Item>
                      <Form.Item
                        name='reason'
                        label='Reason'
                        rules={[{ required: true }]}
                      >
                        <Input autoComplete='off' />
                      </Form.Item>
                    </Form>
                  </Col>
                </Row>
              </AppDrawer>

              <Modal
                width={800}
                visible={viewBenefitEntitlementModal}
                title={<Trans>Entitlement Adjustments</Trans>}
                closable={true}
                onCancel={() => {
                  setViewBenefitEntitlementModal(false);
                  setCurrentPage(1);
                  setModalPageSize(initialPageSize);
                }}
                centered
                footer={false}
                getContainer='.finance-admin-container'
                destroyOnClose={true}
                bodyStyle={{
                  height: '60%',
                }}
              >
                <Table
                  columns={getBenefitEntitlementAdjustmentViewColumns()}
                  size='middle'
                  dataSource={benefitEntitlementAdjustmentData?.data}
                  pagination={false}
                  className='benefit-entitlement-adjustment-data'
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
                    pageSize={modalPageSize || 12}
                    onShowSizeChange={(_current: number, size: number) => {
                      setModalPageSize(size);
                    }}
                    total={
                      benefitEntitlementAdjustmentData?.pagination_data
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
              </Modal>
            </ErrorBoundary>
          </>
        ) : (
          <NoData
            description={
              currentEmployee?.legal_name || currentEmployee.name !== undefined
                ? `You are not allowed to view records for ${currentEmployee?.legal_name ||
                    currentEmployee.name}`
                : 'You are not allowed to view records for this user'
            }
          />
        )}
      </HeaderBarWrapper>
      {isViolationModal?.visibility && (
        <ViolationDetails
          visibility={isViolationModal?.visibility}
          item={isViolationModal?.item}
          isAdmin={true}
          onClose={onClose}
        />
      )}
    </>
  );
};

export default memo(connector(UserDataView));
