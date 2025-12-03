import React, {
  memo,
  FC,
  useEffect,
  useState,
  Dispatch,
  ReactText,
} from 'react';

import { connect, ConnectedProps } from 'react-redux';

import { Table, Button, message, Modal, List } from 'antd';
import './admin.index.less';
import {
  IAdminDataRequestParameters,
  IAdminDataTabModel,
  IAdminItemTypes,
} from './admin.models';
import { useHistory, useLocation } from 'react-router-dom';
import { ColumnsType } from 'antd/lib/table';
import {
  FilterOutlined,
  ReconciliationOutlined,
  DownloadOutlined,
  Loading3QuartersOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  DashOutlined,
  MoreOutlined,
  FileSyncOutlined,
  FileDoneOutlined,
  ExceptionOutlined,
  InfoCircleOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import {
  ElementOrSkeleton,
  NoData,
  BrokenLink,
  DataFilter,
  DotMenu,
  AppDrawer,
  StatusTag,
  ViolationDetails,
} from '../../shared/components';
import RequestDetail from '../request/detail/requestDetail.index';
import ClaimDetails from '../addNewExpense/claimDetails/claimDetails.index';
import {
  generateQueryParamsString,
  getQueryParametersAsObject,
  renderViolationsBgClass,
  timeZoneMomentDate,
} from '../../utils/global.utils';
import {
  getExpenseSettlementDataViewColumns,
  getRequestClosureDataViewColumns,
} from './tableColumns.index';
import { AxiosResponse } from 'axios';
import {
  getDataForAdminViewService,
  getPreviousSettlementsService,
  downloadSettlementReportService,
  triggerSettlementService,
  downloadErrorReportService,
  uploadToSFTPService,
  getSettlementStatusService,
} from '../../services/admin';
import { actionBtnObjInterface } from '../../shared/components/dotMenu/dotMenu.model';
import { Trans } from '@lingui/macro';
import { stateInterface, getPermissions } from '../../shared/redux/rootReducer';
import {
  attachExpenseWorkflowFN,
  attachRequestWorkflowFN,
} from './admin.thunk';
import { IItemTypes } from '../approvals/approvals.model';
import { fetchWorkFlowData } from '../app/app.thunk';
import { setIsOneTimePayment } from './admin.thunk';
import { IConfirmationInfo, IfetchWorkFlowDataProps } from '../app/app.model';
import { IWorkflowStatus } from '../../shared/model';
import { resetConfirmationInfo, setConfirmationInfo } from '../app/app.actions';
import { Pagination } from 'antd';
import { fetchOutboundScheduleAPI } from '../../services/outbound';
import WarningIconWithTooltip from '../approvals/components/warningIconWithTooltip/warningIconWithTooltip.index';

let initialExpenseSettlementPageSize = 12;
let requestPostingPageSize = 12;

let totalRecords = 0;

const FileDownload = require('js-file-download');

const mapStateToProps = (state: stateInterface) => {
  return {
    tenant: state.auth.tenant,
    permissions: getPermissions(state),
    itemsCount: state.admin.itemsCount,
    isOTP: state.admin.isOTP,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  return {
    _fetchWorkFlowData: (data: IfetchWorkFlowDataProps) =>
      dispatch(fetchWorkFlowData(data)),
    _attachExpenseWorkflowFN: (id: number) =>
      dispatch(attachExpenseWorkflowFN(id)),
    _attachRequestWorkflowFN: (id: number) =>
      dispatch(attachRequestWorkflowFN(id)),
    _setConfirmationInfo: (data: IConfirmationInfo) =>
      dispatch(setConfirmationInfo(data)),
    _resetConfirmationInfo: () => dispatch(resetConfirmationInfo()),
    _setIsOneTimePayment: () => dispatch(setIsOneTimePayment()),
  };
};

const connector = connect(mapStateToProps, mapDispatchToProps);

let _pageSize = 12;
let totalApprovedCount = 0;
let settlementStatustimer: NodeJS.Timeout;

const ExpenseSettlementOrClosure: FC<IAdminDataTabModel & {
  item: 'request_posting' | 'expense_settlement';
} & ConnectedProps<typeof connector>> = props => {
  const {
    source,
    item,
    // tenant,
    defaultFilter = {},
    activeTabKey,
    permissions,
    // itemsCount,
    isOTP,
    fetchDataItemsCount,
    _updateSpecificDataItemsCount,
    _fetchWorkFlowData,
    _attachExpenseWorkflowFN,
    _attachRequestWorkflowFN,
    _setConfirmationInfo,
    _resetConfirmationInfo,
    _setIsOneTimePayment,
  } = props;

  const { push } = useHistory();
  const location = useLocation();

  const [expenseSettlementPageSize, setExpenseSettlementPageSize] = useState(
    initialExpenseSettlementPageSize,
  );
  const [pageLoading, setPageLoading] = useState<boolean>(true);
  const [settlementData, setSettlementData] = useState<
    { [key: string]: any }[]
  >([]);
  const [settlementDataLoading, setSettlementDataLoading] = useState<boolean>(
    false,
  );
  const [settlementDataNextPage, setSettlementDataNextPage] = useState<
    number | null
  >(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [serviceCallFailed, setServiceCallFailed] = useState<boolean>(false);
  const [previousSettlements, setPreviousSettlements] = useState<
    { [key: string]: any }[]
  >([]);
  const [previousSettlementsLoading, setPreviousSettlementsLoading] = useState<
    boolean
  >(true);
  const [
    previousSettlementsModalVisible,
    setPreviousSettlementsModalVisible,
  ] = useState<boolean>(false);

  const [pollIntervalID, setPollIntervalID] = useState<NodeJS.Timeout>();

  let urlQueryParameters = getQueryParametersAsObject();
  const [filtersVisible, setFiltersVisible] = useState<boolean>(true);
  let initialFilters = {
    ...defaultFilter,
    ...urlQueryParameters,
  };

  const [drawerDetailItem, setDetailDrawer] = useState<{
    visibility: boolean;
    itemType: IAdminItemTypes;
    itemSubType: any;
    itemNumber: string;
    workflowStatus: {
      code: string;
      title: string;
    };
    id: number;
    drawerTitle: string;
    cashAdvanceRequestDetails?: { [key: string]: any };
  } | null>(null);

  const [settlementSelected, setSettlementSelected] = useState<ReactText[]>([]);
  const [
    isSettlementSelectedAllClicked,
    setisSettlementSelectedAllClicked,
  ] = useState<boolean>(false); // Setting true if select all click inside instructiontext.
  const [sortByEmployee, setSortByEmployee] = useState('');
  const [isViolationModal, setIsViolationModal] = useState<{
    visibility: boolean;
    item: null | any;
  }>({
    visibility: false,
    item: null,
  });

  const predefinedSettlementStatuses = {
    completed: {
      code: 'CMLTD',
      title: 'Completed',
    },
    processing: {
      code: 'PRCSNG',
      title: 'Processing',
    },
    failed: {
      code: 'FAILD',
      title: 'Failed',
    },
  };

  const [settlemenetStatus, setSettlemenetStatus] = useState<{
    code: 'CMLTD' | string;
    title: 'Completed' | string;
  }>(predefinedSettlementStatuses.completed);

  const isSettlementCompleted =
    settlemenetStatus.title === predefinedSettlementStatuses.completed.title ||
    settlemenetStatus.title === predefinedSettlementStatuses.failed.title;

  const updateCount = (res: AxiosResponse) => {
    const pagDataKeyArr = Object.keys(res.data.pagination_data);
    let key: any = '';
    let count: any;

    if (
      pagDataKeyArr.indexOf('expenseSettlements') !== -1 ||
      item === 'expense_settlement'
    ) {
      key = 'expenseSettlements';
      count =
        res?.data?.pagination_data?.expenseSettlements ||
        res?.data?.pagination_data?.total_records ||
        0;
    } else if (
      pagDataKeyArr.indexOf('requestClosures') !== -1 ||
      item === 'request_posting'
    ) {
      key = 'requestClosures';
      count =
        res?.data?.pagination_data?.requestClosures ||
        res?.data?.pagination_data?.total_records ||
        0;
    }
    if (key !== '') {
      _updateSpecificDataItemsCount(key, count);
      totalApprovedCount =
        res?.data?.pagination_data?.approved_expenses || count;
    }
  };

  const fetchSettlementData = async (
    parameters: IAdminDataRequestParameters,
    resetDataGroups?: boolean,
  ) => {
    setSettlementDataLoading(true);

    try {
      let response: AxiosResponse = await getDataForAdminViewService(
        parameters,
        // source.token,
      );
      totalRecords = response.data.pagination_data.total_records;
      if (resetDataGroups === true) {
        setSettlementData(response.data.data);
      } else {
        if (response.data.data.length > 0) {
          setSettlementData(response.data.data);
          if (isSettlementSelectedAllClicked) {
            // selected all checkbox is cliked
            setSettlementSelected(prevState => [
              ...prevState,
              ...response.data.data.map((o: { [x: string]: any }) => o.id),
            ]);
          }
        }
      }

      updateCount(response);
      setSettlementDataNextPage(response.data.pagination_data.next_page);
      setSettlementDataLoading(false);
      setPageLoading(false);
    } catch (error) {
      setSettlementDataLoading(false);
      setServiceCallFailed(true);
      message.error('Data could not be fetched.');
    }
  };

  useEffect(() => {
    if (settlementDataNextPage !== null) {
      let parameters: IAdminDataRequestParameters = {
        function: 'data',
        item: item,
        page: settlementDataNextPage ? settlementDataNextPage : 1,
        ...initialFilters,
        // flat: 'true',
        status: 'APPRVD',
      };

      fetchSettlementData(parameters);
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    _setIsOneTimePayment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const applyFilters = (filters: { [key: string]: any }) => {
    let queryParameters = generateQueryParamsString(filters);
    if (queryParameters.length > 1) {
      push(`${location.pathname}?${queryParameters}`);
    } else {
      push(`${location.pathname}`);
    }

    let parameters: IAdminDataRequestParameters = {
      ...{
        function: 'data',
        item: item,
        page_size: _pageSize,
      },
      ...filters,
      // flat: 'true',
      status: 'APPRVD',
    };
    fetchSettlementData(parameters, true);
    customSelectDeselectAllSettlements(false); //resetting selections
  };

  const isActionAllowed = (permissionCode: string): boolean => {
    return (permissions as any)[permissionCode];
  };

  const onApproverSelectionFn = (_approvers: number[], _stepId: number) => {};

  const handleStatusTagClicked = (
    id: number,
    isActionVisible: boolean = true,
    type: IItemTypes,
    showAttachedWorkflow: boolean = false,
    onWorkflowAttachedFn?: () => void,
  ) => {
    const workflowComponentProps: any = {
      isAdmin: isActionVisible,
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

  const openDetailsDrawer = (
    itemId: number,
    itemNumber: string,
    itemType: IAdminItemTypes,
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
    });
  };

  const closeDetailsDrawer = () => {
    setDetailDrawer(null);
  };
  useEffect(() => {
    const order_by = sortByEmployee === 'ascend' ? 'asc' : 'dsc';
    let parameters: IAdminDataRequestParameters = {
      function: 'data',
      item: item,
      page: currentPage,
      ...initialFilters,
      // flat: 'true',
      status: 'APPRVD',
      sort_by_emp_name: order_by,
    };
    sortByEmployee && fetchSettlementData(parameters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortByEmployee]);
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
  const getSettlementClosureTable = () => {
    if (serviceCallFailed === true) {
      return (
        <BrokenLink
          description=''
          onTryAgain={() => {
            let parameters: IAdminDataRequestParameters = {
              function: 'data',
              item: item,
              page: settlementDataNextPage ? settlementDataNextPage : 1,
              ...initialFilters,
              // flat: 'true',
              status: 'APPRVD',
            };
            fetchSettlementData(parameters);
            fetchDataItemsCount(
              {
                function: 'count',
                item: item,
                ...initialFilters,
              },
              source,
            );
          }}
        />
      );
    }

    let columns: ColumnsType<any> = [];

    switch (item) {
      case 'expense_settlement':
        columns = [
          ...getExpenseSettlementDataViewColumns(
            openDetailsDrawer,
            handleStatusTagClicked,
            isActionAllowed,
            _attachExpenseWorkflowFN,
            isSettlementCompleted,
            settlementSelected,
            setSortByEmployee,
            sortByEmployee,
            getViolationTitleWithIcons,
          ),
        ];
        break;

      case 'request_posting':
        columns = [
          ...getRequestClosureDataViewColumns(
            openDetailsDrawer,
            handleStatusTagClicked,
            isActionAllowed,
            _attachRequestWorkflowFN,
          ),
        ];
        break;
    }

    return (
      <ElementOrSkeleton
        type='table'
        isLoading={settlementDataLoading}
        isActive={true}
      >
        {settlementData.length > 0 ? (
          <>
            <Table
              bordered={true}
              columns={columns}
              pagination={false}
              scroll={{ x: 800 }}
              className='aggregated-view'
              size='middle'
              rowKey={(record: any) => {
                return record.id;
              }}
              dataSource={settlementData}
              loading={settlementDataLoading}
              rowSelection={
                item === 'expense_settlement'
                  ? {
                      type: 'checkbox',
                      // onSelectAll: (
                      //   selected: boolean,
                      //   _selectedRows: any[],
                      //   _changeRows: any[],
                      // ) => {
                      //   setisSettlementSelectedAllClicked(selected);
                      // },
                      preserveSelectedRowKeys: true,
                      selectedRowKeys: settlementSelected,
                      onChange: (
                        selectedRowKeys: ReactText[],
                        _selectedRows: any[],
                      ) => {
                        if (isSettlementCompleted) {
                          setSettlementSelected(selectedRowKeys);
                          if (
                            selectedRowKeys.length !==
                              totalApprovedCount /* itemsCount.expenseSettlements */ &&
                            isSettlementSelectedAllClicked
                          ) {
                            setisSettlementSelectedAllClicked(false);
                          }
                        }
                      },
                    }
                  : undefined
              }
              rowClassName={(record, rowIndex) =>
                renderViolationsBgClass(record)
              }
            />
            {/* {settlementDataNextPage !== null && (
              <div className='load-more-button'>
                <Button
                  type='link'
                  onClick={_event => {
                    let parameters: IAdminDataRequestParameters = {
                      function: 'data',
                      item: item,
                      page: settlementDataNextPage,
                      ...initialFilters,
                      // flat: 'true',
                      status: 'APPRVD',
                    };

                    fetchSettlementData(parameters);
                  }}
                >
                  {`Load More Out Of ${itemsCount?.expenseSettlements}`}
                </Button>
              </div>
            )} */}
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
                onChange={(pageNumber: number, pageSize: any) => {
                  if (activeTabKey === 'expense-settlement') {
                    _pageSize = expenseSettlementPageSize;
                  }
                  if (activeTabKey === 'request-posting') {
                    _pageSize = requestPostingPageSize;
                  }
                  const order_by = sortByEmployee === 'descend' ? 'dsc' : 'asc';

                  let parameters: IAdminDataRequestParameters = {
                    function: 'data',
                    item: item,
                    page: pageNumber,
                    page_size: pageSize,
                    ...initialFilters,
                    status: 'APPRVD',
                  };
                  if (sortByEmployee && activeTabKey === 'expense-settlement') {
                    parameters = {
                      ...parameters,
                      sort_by_emp_name: order_by,
                    };
                  }
                  setCurrentPage(pageNumber);

                  fetchSettlementData(parameters);
                }}
                hideOnSinglePage={false}
                pageSizeOptions={['10', '12', '20', '50', '100']}
                pageSize={
                  (activeTabKey === 'expense-settlement' &&
                    expenseSettlementPageSize) ||
                  (activeTabKey === 'request-posting' &&
                    requestPostingPageSize) ||
                  12
                }
                showSizeChanger={true}
                onShowSizeChange={(_current: number, size: number) => {
                  if (activeTabKey === 'expense-settlement') {
                    setExpenseSettlementPageSize(size);
                  }
                  if (activeTabKey === 'request-posting') {
                    requestPostingPageSize = size;
                  }
                }}
                total={totalRecords}
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
        ) : (
          <NoData description='There are no records' />
        )}
      </ElementOrSkeleton>
    );
  };

  const successExecuteSettlementCallback = (
    resetData: boolean = false,
    isfetchedData: boolean = false,
  ) => {
    if (resetData) {
      setSettlementData([]);
      customSelectDeselectAllSettlements(false);
    }

    if (isfetchedData) {
      let parameters: IAdminDataRequestParameters = {
        function: 'data',
        item: item,
        page: 1,
        ...initialFilters,
        // flat: 'true',
        status: 'APPRVD',
      };
      fetchSettlementData(parameters, true);
      let queryParameters = generateQueryParamsString({
        ...initialFilters,
        page: 1,
      });
      push(`${location.pathname}?${queryParameters}`);
    }
  };

  const fetchSettlementStatus = async () => {
    try {
      const res: AxiosResponse = await getSettlementStatusService('EXPNSE');

      setSettlemenetStatus(res?.data?.status);

      if (
        res?.data?.status.title ===
          predefinedSettlementStatuses.completed.title ||
        res?.data?.status.title === predefinedSettlementStatuses.failed.title
      ) {
        clearInterval(settlementStatustimer);
        await successExecuteSettlementCallback(true, true);
        const resData: AxiosResponse = await fetchOutboundScheduleAPI();
        const expOTP = resData.data.filter(
          (item: any) => item.category.code === 'EOTP',
        );
        if (expOTP.length > 0) {
          message.success('Posted to SF');
        }
      }
    } catch (error) {
      console.error('DEV ERROR => ', error);
    }
  };

  const settlementStatusCheckTask = () => {
    clearInterval(settlementStatustimer);
    settlementStatustimer = setInterval(fetchSettlementStatus, 5000);
  };

  const executeSettlement = async () => {
    if (item === 'expense_settlement' || item === 'request_posting') {
      try {
        if (item === 'expense_settlement')
          setSettlemenetStatus(predefinedSettlementStatuses.processing);

        const selectedAll =
          item === 'expense_settlement' && isSettlementSelectedAllClicked
            ? // ||
              // settlementSelected.length ===
              //   totalApprovedCount) /* itemsCount.expenseSettlements */
              true
            : undefined;

        const ids =
          item === 'expense_settlement' && !selectedAll
            ? settlementSelected
            : undefined;
        await triggerSettlementService(item, ids, selectedAll);

        if (item === 'expense_settlement') {
          message.success(
            'Expense claims settlement has been initiated. Report will be available for download shortly.',
            1,
          );
          settlementStatusCheckTask();
        } else if (item === 'request_posting') {
          message.success(
            'Requests closure has been initiated. Report will be available for download shortly.',
            1,
            successExecuteSettlementCallback.bind(null, true, true),
          );
        }
      } catch (error) {
        console.error('DEV ERROR :: ', error);
        message.error('Unable To Process The Request');
        setSettlemenetStatus(predefinedSettlementStatuses.completed);
      }
    }
  };

  const fetchPreviousSettlements = async (allLogs?: any) => {
    try {
      let response: AxiosResponse = await getPreviousSettlementsService(
        (item === 'expense_settlement' ? 'expense' : 'request') as string,
        allLogs,
      );
      setPreviousSettlements(response.data);
      setPreviousSettlementsLoading(false);
    } catch (error) {
      message.error(error.response.data.error);
    }
  };

  const downloadReport = async (recordId: number, fileName: string) => {
    try {
      let response: AxiosResponse = await downloadSettlementReportService(
        recordId,
      );
      FileDownload(response.data, fileName);
    } catch (error) {
      message.error(error.response.data.error);
    }
  };

  const uploadToSFTP = async (recordId: number) => {
    try {
      const response: AxiosResponse = await uploadToSFTPService(recordId);
      message.success(response.data.message);
    } catch (error) {
      message.error(error.response.data.details);
    }
  };

  const downloadErrorReport = async (recordId: number, fileName: string) => {
    try {
      let response: AxiosResponse = await downloadErrorReportService(recordId);
      FileDownload(response.data, fileName);
    } catch (error) {
      message.error(error.response.data.error);
    }
  };

  const pollPreviousSettlements = (allLogs?: any) => {
    setPollIntervalID(
      setInterval(
        () => fetchPreviousSettlements(allLogs),
        allLogs ? 10000 : 5000,
      ),
    );
  };

  const getMenuOptionsForReport = (settlement: any) => {
    let actions: actionBtnObjInterface[] = [];

    if (settlement.file !== '' && isOTP) {
      actions.push({
        children: <Trans>Download Report</Trans>,
        Disabled: !(
          settlement.status.code === 'CMLTD' ||
          settlement.status.code === 'FAILD'
        ),
        OnClick: () => {
          downloadReport(settlement.id, settlement.file_name);
        },
        Type: 'default',
        icon: FileDoneOutlined,
      });
    } else if (!isOTP) {
      actions.push({
        children: <Trans>Download Report</Trans>,
        Disabled: settlement.status.code !== 'CMLTD',
        OnClick: () => {
          downloadReport(settlement.id, settlement.file_name);
        },
        Type: 'default',
        icon: FileDoneOutlined,
      });
    }

    if (!isOTP) {
      actions.push({
        children: <Trans>Push To FTP</Trans>,
        Disabled: settlement.status.code !== 'CMLTD',
        OnClick: () => {
          uploadToSFTP(settlement.id);
        },
        Type: 'default',
        icon: FileSyncOutlined,
      });
    }

    if (settlement.error_file !== '') {
      if (isOTP) {
        actions.push({
          children: <Trans>Error Report</Trans>,
          Disabled: !(
            settlement.status.code === 'CMLTD' ||
            settlement.status.code === 'FAILD'
          ),
          OnClick: () => {
            downloadErrorReport(settlement.id, settlement.error_file_name);
          },
          Type: 'default',
          icon: ExceptionOutlined,
        });
      } else {
        actions.push({
          children: <Trans>Error Report</Trans>,
          Disabled: settlement.status.code !== 'CMLTD',
          OnClick: () => {
            downloadErrorReport(settlement.id, settlement.error_file_name);
          },
          Type: 'default',
          icon: ExceptionOutlined,
        });
      }
    }

    return actions;
  };

  const customSelectDeselectAllSettlements = (
    isSelectAll: boolean,
    isOnAllSelectButton: boolean = false,
  ) => {
    setisSettlementSelectedAllClicked(isSelectAll && isOnAllSelectButton);
    setSettlementSelected(isSelectAll ? settlementData.map(o => o.id) : []);
  };

  const getSettlementSelectedInstruction = () => {
    try {
      const totalCount = totalApprovedCount /* itemsCount.expenseSettlements */;

      const selectedCount = isSettlementSelectedAllClicked
        ? totalCount
        : settlementSelected.length;

      const isAllSelected =
        Boolean(totalCount === settlementSelected.length) ||
        isSettlementSelectedAllClicked;

      const isMoreThanOneItem = selectedCount > 1;

      return (
        <p className='settlement-selection-instruction'>
          <span className='sub-settlement-instruction'>
            <InfoCircleOutlined />
            {`${selectedCount} item${
              isMoreThanOneItem ? 's' : ''
            } on this page ${isMoreThanOneItem ? 'are' : 'is'} selected.`}{' '}
          </span>
          {!isAllSelected && (
            <Button
              type='primary'
              className='custom-primary-btn settlement-selection-instruction-select-all-btn'
              onClick={customSelectDeselectAllSettlements.bind(
                null,
                true,
                true,
              )}
            >{`Select all ${totalCount} items in Expense Settlements.`}</Button>
          )}
        </p>
      );
    } catch (error) {
      console.error('DEV ERROR :: ', error);
      return null;
    }
  };

  return (
    <>
      <div className={`${item} settlement-items`}>
        <div className={filtersVisible ? 'active action-bar' : 'action-bar'}>
          <div className={filtersVisible ? 'row active' : 'row'}>
            {(item === 'expense_settlement' || item === 'request_posting') && (
              <>
                <ElementOrSkeleton
                  isLoading={pageLoading}
                  type='button'
                  isActive={true}
                  skeletonStyle={{
                    float: 'right',
                    marginBottom: '12px',
                    marginRight: '12px',
                  }}
                >
                  <Button
                    type='primary'
                    // ghost
                    title={
                      item === 'expense_settlement'
                        ? 'Execute Settlement'
                        : 'Execute Request Closure'
                    }
                    className='execute-task-button custom-primary-btn'
                    icon={<ReconciliationOutlined />}
                    disabled={
                      item === 'expense_settlement'
                        ? !Boolean(settlementSelected.length) ||
                          !isSettlementCompleted
                        : false
                    }
                    onClick={_event => {
                      const type =
                        item === 'expense_settlement' ? 'expenses' : 'requests';
                      // const totalItems =
                      //   item === 'expense_settlement'
                      //     ? itemsCount.expenseSettlements
                      //     : itemsCount.requestClosures;
                      const selectedCount =
                        isSettlementSelectedAllClicked ||
                        item === 'request_posting'
                          ? totalApprovedCount
                          : settlementSelected.length;
                      const isOrAre =
                        Number(selectedCount || 0) > 1 ? 'are' : 'is';
                      _setConfirmationInfo({
                        bodyText:
                          item === 'request_posting'
                            ? `Posting all available requests.`
                            : `Out of ${totalApprovedCount} ${type}, ${selectedCount} ${isOrAre} going to settle.`,
                        cancelText: 'Cancel',
                        okText: item === 'request_posting' ? 'Post' : 'Execute',
                        visibility: true,
                        extraInfo: '',
                        forWhat: '',
                        headerText: 'Confirmation',
                        cancelBtnFn: _resetConfirmationInfo,
                        okBtnFn: () => {
                          _resetConfirmationInfo();
                          executeSettlement();
                        },
                      });
                    }}
                  >
                    {item === 'expense_settlement'
                      ? 'Execute Settlements'
                      : 'Post Requests'}
                  </Button>
                </ElementOrSkeleton>

                {permissions.VIEW_ALL_SETTLEMENT_LOGS && (
                  <ElementOrSkeleton
                    isLoading={pageLoading}
                    type='button'
                    isActive={true}
                    skeletonStyle={{
                      float: 'right',
                      marginBottom: '12px',
                      marginRight: '12px',
                    }}
                  >
                    <Button
                      type='primary'
                      className='execute-task-button custom-primary-btn'
                      title='View All Logs'
                      icon={<EyeOutlined />}
                      onClick={_event => {
                        setPreviousSettlementsLoading(true);
                        setPreviousSettlementsModalVisible(true);
                        fetchPreviousSettlements(true);
                        pollPreviousSettlements(true);
                      }}
                    >
                      <Trans>View All Logs</Trans>
                    </Button>
                  </ElementOrSkeleton>
                )}

                <ElementOrSkeleton
                  isLoading={pageLoading}
                  type='button'
                  isActive={true}
                  skeletonStyle={{
                    float: 'right',
                    marginBottom: '12px',
                    marginRight: '12px',
                  }}
                >
                  <Button
                    type='default'
                    title='Download'
                    className='report-download-button'
                    icon={<DownloadOutlined />}
                    onClick={_event => {
                      setPreviousSettlementsLoading(true);
                      setPreviousSettlementsModalVisible(true);
                      fetchPreviousSettlements();
                      pollPreviousSettlements();
                    }}
                  />
                </ElementOrSkeleton>
              </>
            )}
            <ElementOrSkeleton
              isLoading={pageLoading}
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
                onClick={_event =>
                  setFiltersVisible(filtersVisible => !filtersVisible)
                }
              />
            </ElementOrSkeleton>
          </div>
          <DataFilter
            item={item === 'expense_settlement' ? 'expense' : item}
            // item={item}
            page='ADMIN'
            isVisible={filtersVisible}
            includeStatusBar={false}
            includeDraftStatus={false}
            includeLegalEntities={false}
            includeSaveFilterOption={false}
            includeWithReceiptOption={false}
            onApplyFilters={(filters: { [key: string]: any }) => {
              applyFilters(filters);
            }}
            onResetFilters={() => {
              setSettlementData([]);
              customSelectDeselectAllSettlements(false); //resetting selections
              let parameters: IAdminDataRequestParameters = {
                function: 'data',
                item: item,
                page: 1,
                ...defaultFilter,
                page_size: _pageSize,
                // flat: 'true',
                status: 'APPRVD',
              };
              fetchSettlementData(parameters);
              let queryParameters = generateQueryParamsString(defaultFilter);
              push(`${location.pathname}?${queryParameters}`);
            }}
            initialFilters={initialFilters}
            includeEmpoyeeList
            includeEntityList
          />
          {item === 'expense_settlement' &&
          Boolean(settlementSelected.length) &&
          isSettlementCompleted
            ? getSettlementSelectedInstruction()
            : null}
        </div>

        {getSettlementClosureTable()}
      </div>
      <Modal
        width={600}
        visible={previousSettlementsModalVisible}
        title={
          item === 'expense_settlement' || item === 'request_posting'
            ? 'Settlement Reports'
            : 'Closure Reports'
        }
        closable={true}
        onCancel={() => {
          setPreviousSettlementsModalVisible(false);
          setPreviousSettlements([]);
          if (pollIntervalID) {
            clearInterval(pollIntervalID);
          }
        }}
        centered
        footer={false}
        getContainer='.finance-admin-container'
        destroyOnClose={true}
        bodyStyle={{
          height: '60%',
        }}
      >
        <div className='settlement-reports'>
          <ElementOrSkeleton
            isActive={true}
            isLoading={previousSettlementsLoading}
            type='page'
          >
            <List>
              {previousSettlements.map((settlement: any, index: number) => {
                return (
                  <List.Item
                    key={index}
                    actions={[
                      <DotMenu
                        showInMenu
                        actionBtn={getMenuOptionsForReport(settlement)}
                      >
                        <MoreOutlined />
                      </DotMenu>,
                    ]}
                  >
                    <List.Item.Meta
                      avatar={
                        (((settlement?.status?.code === 'CMLTD' && !isOTP) ||
                          (settlement?.status?.code === 'CMLTD' &&
                            isOTP &&
                            settlement?.file !== '')) && (
                          <CheckCircleOutlined
                            style={{ fontSize: 18, color: '#13c2c2' }}
                          />
                        )) ||
                        ((settlement?.status?.code === 'FAILD' ||
                          (settlement?.status?.code === 'CMLTD' &&
                            isOTP &&
                            settlement?.file === '')) && (
                          <CloseCircleOutlined
                            style={{ fontSize: 18, stroke: '#ff1744' }}
                          />
                        )) ||
                        (settlement?.status?.code === 'INQUE' && (
                          <DashOutlined
                            style={{ fontSize: 18, stroke: '#ebf1f8' }}
                          />
                        )) ||
                        (settlement?.status?.code === 'GNRTG' && (
                          <Loading3QuartersOutlined
                            style={{ fontSize: 18, stroke: '#faad14' }}
                          />
                        ))
                      }
                      title={`Batch Job No. #${settlement?.batch_number}`}
                      description={
                        <div>
                          <div>
                            {timeZoneMomentDate(settlement?.started_on).format(
                              'DD MMM YY HH:mm',
                            )}{' '}
                            by{' '}
                            {settlement?.triggered_by !== null
                              ? settlement?.triggered_by?.legal_name
                                ? `${settlement?.triggered_by?.legal_name} (${settlement?.triggered_by?.username})`
                                : `${settlement?.triggered_by?.name} (${settlement?.triggered_by?.username})`
                              : 'System'}
                          </div>
                          {settlement?.is_pushed_to_ftp && (
                            <div>
                              Pushed to FTP:{' '}
                              {timeZoneMomentDate(
                                settlement?.pushed_to_ftp_completed_on,
                              ).format('DD MMM YY HH:mm')}{' '}
                              by{' '}
                              {settlement?.pushed_to_ftp_by !== null
                                ? settlement?.pushed_to_ftp_by?.legal_name
                                  ? `${settlement?.pushed_to_ftp_by?.legal_name} (${settlement?.pushed_to_ftp_by?.username})`
                                  : `${settlement?.pushed_to_ftp_by?.name} (${settlement?.pushed_to_ftp_by?.username})`
                                : 'System'}
                            </div>
                          )}
                        </div>
                      }
                    />
                  </List.Item>
                );
              })}
            </List>
          </ElementOrSkeleton>
        </div>
      </Modal>

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
              status={drawerDetailItem?.workflowStatus as IWorkflowStatus}
              onStatusClick={
                handleStatusTagClicked.bind(
                  null,
                  drawerDetailItem?.id as number,
                  true,
                  drawerDetailItem?.itemType as 'expense' | 'request',
                ) as any
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
                <ClaimDetails claimId={drawerDetailItem.id} isAdmin={true} />
              );
            case 'request':
              return (
                <RequestDetail
                  requestId={drawerDetailItem.id}
                  isAdmin={false}
                />
              );
          }
        })()}
      </AppDrawer>
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

export default memo(connector(ExpenseSettlementOrClosure));
