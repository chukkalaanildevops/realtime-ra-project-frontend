import React, { Dispatch, useState, memo, useEffect, useMemo } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import {
  stateInterface,
  getUsersListForDD,
  getUsersListForDDLoader,
  getDestinationList,
  getTitleList,
  getAllowanceCurrencyList,
  getEligibilityList,
  getExpenseTypesData,
} from '../../redux/rootReducer';
import { fetchUsersForDDForFilters } from '../../redux/auth/auth.thunk';
import { setExpenseTypes } from '../../redux/auth/auth.actions';
import { ITransactionDataFilterProps } from './transactionDataFilter.model';
import {
  CheckCircleOutlined,
  DownOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import {
  Button,
  DatePicker,
  Select,
  InputNumber,
  Input,
  Tag,
  Modal,
  message,
} from 'antd';
import {
  ConfirmationModal,
  CustomisedDropdown,
  SearchableDropdown,
} from '../index';
import {
  fetchSavedFiltersService,
  getExpenseTypesForFiltersService,
  getRequestTypesForFiltersService,
  saveFilterService,
  updateFilterService,
  deleteFilterService,
  getEntitlementPeriodAPI,
  fetchTopLevelLegalEntity,
  getBenefitTypesForFiltersService,
} from '../../../services/transactionDataFilter';
import moment from 'moment';
import { AxiosResponse } from 'axios';
import './transactionDataFilter.index.less';
import { removeParamsFromObject } from '../../../utils/global.utils';
import { Form } from 'antd';
import { Trans } from '@lingui/macro';

const mapStateToProps = (state: stateInterface | any) => {
  return {
    // activeUsers: state.auth.activeUsers,
    users: getUsersListForDD(state),
    usersLoader: getUsersListForDDLoader(state),
    destinations: getDestinationList(state),
    titles: getTitleList(state),
    currencies: getAllowanceCurrencyList(state),
    eligibilities: getEligibilityList(state),
    expenseTypesData: getExpenseTypesData(state),
  };
};
const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  return {
    _fetchUsersForDDForFilters: () => dispatch(fetchUsersForDDForFilters()),
    _setExpenseTypes: (data: any) => dispatch(setExpenseTypes(data)),
  };
};

const connector = connect(mapStateToProps, mapDispatchToProps);

const StatusFilterTag: React.FC<{
  isChecked: boolean;
  code: string;
  text: string;
  onClick: (code: string) => void;
}> = props => {
  return (
    <div
      className={`status-tag ${props.code}`}
      onClick={() => {
        props.onClick(props.code);
      }}
    >
      {props.isChecked ? <CheckCircleOutlined /> : <></>}
      <span>{props.text}</span>
    </div>
  );
};

const DataFilter: React.FC<ConnectedProps<typeof connector> &
  ITransactionDataFilterProps> = props => {
  const {
    page,
    item,
    source = {},
    isVisible,
    isAggregate = false,
    includeLegalEntities,
    includeSaveFilterOption,
    includeStatusBar,
    includeDraftStatus,
    includeItemNumber = false,
    includeBatchNumber = false,
    onApplyFilters,
    onResetFilters,
    onSaveFilters,
    initialFilters,
    includeForRequestNumber = false,
    includeSettlementDate = false,
    includePendingApprovalAtUserList = false,
    includeLastActionPriorToDate = false,
    includeSubmittedOnDate = false,
    users,
    // activeUsers,
    usersLoader,
    includeDateRange = true,
    includeEntityList = false,
    statusSelectionMode = 'multiple',
    includeEmpoyeeList = false,
    includeWithReceiptOption = true,
    includeYearFilter = false,
    _fetchUsersForDDForFilters,
    includeDate,
    includeDestinationList,
    destinations,
    titles,
    includeTitle,
    includeAmount,
    currencies,
    includeCurrency,
    eligibilities,
    includeEligibility,
    _setExpenseTypes,
    expenseTypesData,
  } = props;

  // const [minAmountForMaxInput, setMinAmountForMaxInput] = useState<number>(0);
  const [expenseTypes, setExpenseTypes] = useState<{ [key: string]: any }[]>(
    [],
  );
  const [benefitTypes, setBenefitTypes] = useState<{ [key: string]: any }[]>(
    [],
  );
  const [requestTypes, setRequestTypes] = useState<{ [key: string]: any }[]>(
    [],
  );
  const [filteredExpenseTypes, setFilteredExpenseTypes] = useState<
    { [key: string]: any }[]
  >([]);

  const [filteredBenefitTypes, setFilteredBenefitTypes] = useState<
    { [key: string]: any }[]
  >([]);

  const [filteredEntitlementPeriod, setFilteredEntitlementPeriod] = useState<
    { [key: string]: any }[]
  >([]);
  const [filteredRequestTypes, setFilteredRequestTypes] = useState<
    { [key: string]: any }[]
  >([]);

  // States for updating filters
  const [checkedStatuses, setCheckedStatuses] = useState<string[]>([]);
  const [checkedEntitlementPeriod, setCheckedEntitlementPeriod] = useState<
    string[]
  >([]);

  const [minAmount, setMinAmount] = useState<number | null>(null);
  const [maxAmount, setMaxAmount] = useState<number | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [fromDate, setFromDate] = useState<string | null>(null);
  const [toDate, setToDate] = useState<string | null>(null);
  const [withReceipt, setWithReceipt] = useState<boolean | null>(null);
  const [selectedTypes, setSelectedTypes] = useState<number[]>([]);
  const [dateRange, setDateRange] = useState<
    [moment.Moment, moment.Moment] | null
  >(null);
  const [itemNumber, setItemNumber] = useState<string | null>(null);
  const [batchNumber, setBatchNumber] = useState<string | null>(null);
  const [settlementFromDate, setSettlementFromDate] = useState<string | null>(
    null,
  );
  const [settlementToDate, setSettlementToDate] = useState<string | null>(null);
  const [settlementDateRange, setSettlementDateRange] = useState<
    [moment.Moment, moment.Moment] | null
  >(null);
  const [submittedOnDateRange, setSubmittedOnDateRange] = useState<
    [moment.Moment, moment.Moment] | null
  >(null);
  const [submittedOnFromDate, setSubmittedOnFromDate] = useState<string | null>(
    null,
  );
  const [submittedOnToDate, setSubmittedOnToDate] = useState<string | null>(
    null,
  );
  const [
    settlementDatePickerDisabled,
    setSettlementDatePickerDisabled,
  ] = useState<boolean>(false);
  const [forRequestNumberContaining, setForRequestNumberContaining] = useState<
    string | null
  >(null);

  const [savedFilters, setSavedFilters] = useState<{ [key: string]: any }[]>(
    [],
  );
  const [savedFiltersVisible, setSavedFiltersVisible] = useState<boolean>(
    false,
  );

  const [newOrUpdateFilterTitle, setNewOrUpdateFilterTitle] = useState('');
  const [saveFilterFormVisible, setSaveFilterFormVisible] = useState<boolean>(
    false,
  );

  const [selectedFilter, setSelectedFilter] = useState<{
    [key: string]: any;
  } | null>(null);
  const [filtersFormVisible, setFiltersFormVisible] = useState<boolean>(false);
  const [
    deletionConfirmationModalProps,
    setDeletionConfirmationModalProps,
  ] = useState<{
    visible: boolean;
    itemId: number | null;
    filterTitle: string | null;
  }>({
    visible: false,
    itemId: null,
    filterTitle: null,
  });

  const [pendingApprovalAtUserList, setPendingApprovalAtUserList] = useState<
    number[] | string[]
  >([]);
  const [lastActionPriorToDate, setLastActionPriorToDate] = useState<string>(
    '',
  );
  const [year, setYear] = useState<string>('');
  const [entityList, setEntityList] = useState<any[]>([]); // API Response (list)
  const [entityListLoader, setEntityListLoader] = useState<boolean>(false); // loader
  const [selectedEntityList, setSelectedEntityList] = useState<
    number[] | string[]
  >([]); // User Selection
  const [selectedDestinationList, setSelectedDestinationList] = useState<
    number[] | string[]
  >([]);
  const [selectedTitleList, setSelectedTitleList] = useState<
    number[] | string[]
  >([]);
  const [selectedCurrencyList, setSelectedCurrencyList] = useState<
    number[] | string[]
  >([]);
  const [selectedEligibilityList, setSelectedEligibilityList] = useState<
    number[] | string[]
  >([]);

  const [employee_id, setEmployeeId] = useState<number[] | string[]>([]);

  const { RangePicker } = DatePicker;

  // const memoizedUsers = useMemo(
  //   () =>
  //     activeUsers.map((o: any) => ({
  //       key: o.id,
  //       value: `${o.legal_name || o.name}${o?.emp_id ? ` (${o?.emp_id})` : ''}`,
  //     })),
  //   [activeUsers],
  // );

  const memoizedEmployees = useMemo(
    () =>
      users.map((o: any) => ({
        key: o.id,
        value: `${o.legal_name || o.name}${o?.emp_id ? ` (${o?.emp_id})` : ''}`,
      })),
    [users],
  );

  const memoizedEntityList = useMemo(
    () =>
      entityList.map((o: any) => ({
        key: o.id,
        value: `${o.title}${o?.code ? ` (${o?.code})` : ''}`,
      })),
    [entityList],
  );

  const destinationList = useMemo(
    () =>
      destinations.map((o: any) => ({
        key: o.id,
        value: `${o.title}${o?.code ? ` (${o?.code})` : ''}`,
      })),
    [destinations],
  );

  const titleList = useMemo(
    () =>
      titles.map((o: any) => ({
        key: o.id,
        value: `${o.title}${o?.code ? ` (${o?.code})` : ''}`,
      })),
    [titles],
  );

  const currencyList = useMemo(
    () =>
      currencies.map((o: any) => ({
        key: o.id,
        value: `${o.title}${o?.code ? ` (${o?.code})` : ''}`,
      })),
    [currencies],
  );

  const eligibilityList = useMemo(
    () =>
      eligibilities.map((o: any) => ({
        key: o.id,
        value: `${o.title}${o?.code ? ` (${o?.code})` : ''}`,
      })),
    [eligibilities],
  );

  const workflowStatuses = [
    {
      code: 'PENDNG',
      text: 'Pending',
    },
    {
      code: 'APPRVD',
      text: 'Approved',
    },
    {
      code: 'REJCTD',
      text: 'Rejected',
    },
    // {
    //   code: 'SETTLD',
    //   text: 'Settled',
    // },
    // {
    //   code: 'STALED',
    //   text: 'Stalled',
    // },
  ];

  if (page !== 'APRVL') {
    workflowStatuses.push(
      ...[
        {
          code: 'SETTLD',
          text: 'Settled',
        },
        {
          code: 'STALED',
          text: 'Stalled',
        },
      ],
    );
  }

  if (item === 'receipt') {
    workflowStatuses.push({
      code: 'UNCLMD',
      text: 'Unclaimed',
    });
  }

  if (includeDraftStatus) {
    workflowStatuses.unshift({
      code: 'DRAFTD',
      text: 'Drafted',
    });
  }

  const cashAdvanceStatuses = [
    {
      code: 'PENDNG',
      text: 'Pending',
    },
    {
      code: 'DISBSD',
      text: 'Disbursed',
    },
    {
      code: 'REJCTD',
      text: 'Rejected',
    },
  ];

  const statusChoices =
    item === 'cash_advance_request' ? cashAdvanceStatuses : workflowStatuses;

  // const isBenefitsActive = false;
  const isPettyCashActive = true;
  const isAllowanceActive = true;

  const expenseCategories = isPettyCashActive
    ? ['GEN', 'ENT', 'MIL', 'PTC', 'ALW']
    : ['GEN', 'ENT', 'MIL', 'ALL'] && isAllowanceActive
    ? ['GEN', 'ENT', 'MIL', 'PTC', 'ALW']
    : ['GEN', 'ENT', 'MIL', 'PTC'];

  const requestCategories =
    item === 'request_posting' ? ['TVL'] : ['GEN', 'TVL'];

  const filtersItemCategoryMap: { [key: string]: string } = {
    expense: 'EXPNSE',
    request: 'REQEST',
    cash_advance_request: 'CSHADV',
    expenses_with_request: 'EXPREQ',
    receipt: 'RECPTS',
    benefit: 'BENFIT',
    benefit_entitlement: 'BENFIT',
    expense_entitlement: 'EXPNSE',
  };

  const fetchExpenseTypes = async () => {
    try {
      let response: AxiosResponse = await getExpenseTypesForFiltersService(
        source.cancelToken,
      );
      setExpenseTypes(response.data);
      setFilteredExpenseTypes(response.data);
      _setExpenseTypes(response.data);

      if (
        initialFilters !== undefined &&
        initialFilters.expense_type !== undefined
      ) {
        if (typeof initialFilters.expense_type === 'number') {
          setSelectedTypes([initialFilters.expense_type]);
        } else {
          setSelectedTypes(initialFilters.expense_type);
        }
      } else {
        setTimeout(() => {
          setSelectedTypes(response.data.map((item: any) => item.id));
        }, 1);
      }
    } catch (error) {
      setExpenseTypes([]);
    }
  };

  const fetchEntitlementPeriod = async () => {
    try {
      let response: AxiosResponse = await getEntitlementPeriodAPI(
        source.cancelToken,
      );
      // setBenefitTypes(response.data);
      setFilteredEntitlementPeriod(response.data);
    } catch (error) {
      // setBenefitTypes([]);
    }
  };

  const fetchBenefitTypes = async () => {
    try {
      let response: AxiosResponse = await getBenefitTypesForFiltersService(
        source.cancelToken,
      );
      setBenefitTypes(response.data);
      setFilteredBenefitTypes(response.data);
      if (
        initialFilters !== undefined &&
        initialFilters.benefit_type !== undefined
      ) {
        if (typeof initialFilters.benefit_type === 'number') {
          setSelectedTypes([initialFilters.benefit_type]);
        } else if (typeof initialFilters.benefit_type === 'string') {
          setSelectedTypes([parseInt(initialFilters.benefit_type)]);
        } else {
          setSelectedTypes(initialFilters.benefit_type);
        }
      } else {
        setTimeout(() => {
          setSelectedTypes(response.data.map((item: any) => item.id));
        }, 1);
      }
    } catch (error) {
      setBenefitTypes([]);
    }
  };

  const fetchRequestTypes = async () => {
    try {
      let response: AxiosResponse = await getRequestTypesForFiltersService(
        source.cancelToken,
      );
      setRequestTypes(response.data);
      setFilteredRequestTypes(response.data);

      if (
        initialFilters !== undefined &&
        initialFilters.request_type !== undefined
      ) {
        if (typeof initialFilters.request_type === 'number') {
          setSelectedTypes([initialFilters.request_type]);
        } else {
          setSelectedTypes(initialFilters.request_type);
        }
      } else {
        setSelectedTypes(response.data.map((item: any) => item.id));
      }
    } catch (error) {
      setRequestTypes([]);
    }
  };

  const fetchEntityList = async () => {
    try {
      setEntityListLoader(true);
      let response: AxiosResponse = await fetchTopLevelLegalEntity(
        source.cancelToken,
      );
      setEntityList(response.data);

      if (
        initialFilters !== undefined &&
        initialFilters.entity_id !== undefined
      ) {
        if (Array.isArray(initialFilters.entity_id))
          setSelectedTypes(initialFilters.entity_id);
        // } else {
        //   setSelectedEntityList(response.data.map((item: any) => item.id));
      }
      setEntityListLoader(false);
    } catch (error) {
      setEntityList([]);
      setEntityListLoader(false);
    }
  };

  useEffect(() => {
    if (
      ['expense', 'expenses_with_request', 'expense_entitlement'].includes(item)
    ) {
      fetchExpenseTypes();
    } else if (
      ['request', 'cash_advance_request', 'request_posting'].includes(item)
    ) {
      fetchRequestTypes();
    } else if (['benefit', 'benefit_entitlement'].includes(item)) {
      fetchBenefitTypes();
    }
    if (['benefit_entitlement'].includes(item)) {
      fetchEntitlementPeriod();
    }

    if (includePendingApprovalAtUserList || includeEmpoyeeList) {
      _fetchUsersForDDForFilters();
    }

    if (includeEntityList) {
      fetchEntityList();
    }

    fetchSavedFilters();

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    updateFiltersFormFromObject(initialFilters);

    if (
      initialFilters !== undefined &&
      Object.keys(initialFilters).length === 0 &&
      includeDateRange
    ) {
      let fromDateObject = moment().subtract(1, 'year');
      let toDateObject = moment();

      setFromDate(fromDateObject.format('DD/MM/YYYY'));
      setToDate(toDateObject.format('DD/MM/YYYY'));
      setDateRange([fromDateObject, toDateObject]);
    }
    if (
      initialFilters !== undefined &&
      includeYearFilter &&
      year.length === 0
    ) {
      setYear(moment().format('YYYY'));
    }
    // eslint-disable-next-line
  }, [initialFilters]);

  useEffect(() => {
    if (checkedStatuses.length > 0 && !checkedStatuses.includes('SETTLD')) {
      setSettlementFromDate(null);
      setSettlementToDate(null);
      setSettlementDateRange(null);
      setSettlementDatePickerDisabled(true);
    } else if (
      checkedStatuses.length === 0 ||
      (checkedStatuses.length > 0 && checkedStatuses.includes('SETTLD'))
    ) {
      setSettlementDatePickerDisabled(false);
    }
  }, [checkedStatuses]);

  useEffect(() => {
    if (!isVisible) {
      setSavedFiltersVisible(isVisible);
      setFiltersFormVisible(isVisible);
    }
  }, [isVisible]);

  const updateFiltersFormFromObject = (filters?: any) => {
    if (filters !== undefined && Object.keys(filters).length > 0) {
      if (
        [
          'expense',
          'expenses_with_request',
          'expense_entitlement',
          'benefit',
        ].includes(item)
      ) {
        setSelectedCategories(expenseCategories);

        if (filters.category) {
          updateFilteredTypes(filters.category);
        } else {
          updateFilteredTypes(expenseCategories);
        }

        if (filters.has_receipt !== undefined) {
          setWithReceipt(filters.has_receipt === 1 ? true : false);
        } else {
          setWithReceipt(null);
        }

        if (filters.expense_type !== undefined) {
          if (typeof filters.expense_type === 'string') {
            setSelectedTypes(
              filters.expense_type
                .split(',')
                .map((typeId: string) => parseInt(typeId)),
            );
          } else {
            if (filters.expense_type === 'number') {
              setSelectedTypes([filters.expense_type]);
            } else {
              setTimeout(() => {
                setSelectedTypes(
                  filters.expense_type.map((typeId: any) => parseInt(typeId)),
                );
              }, 2);
            }
          }
        } else {
          setTimeout(() => {
            setSelectedTypes(
              expenseTypes.map((expenseType: any) => expenseType.id),
            );
          }, 1);
        }

        if (filters.benefit_type !== undefined) {
          if (typeof filters.benefit_type === 'string') {
            setTimeout(() => {
              setSelectedTypes(
                filters.benefit_type
                  .split(',')
                  .map((typeId: string) => parseInt(typeId)),
              );
            }, 1);
          } else {
            if (filters.benefit_type === 'number') {
              setSelectedTypes([filters.benefit_type]);
            } else {
              setTimeout(() => {
                setSelectedTypes(
                  filters.benefit_type.map((typeId: any) => parseInt(typeId)),
                );
              }, 1);
            }
          }
        } else {
          if (['benefit'].includes(item)) {
            setTimeout(() => {
              setSelectedTypes(
                benefitTypes.map((benefitType: any) => benefitType.id),
              );
            }, 1);
          }
        }

        setMinAmount(
          filters.min_amount !== undefined ? filters.min_amount : null,
        );

        setMaxAmount(
          filters.max_amount !== undefined ? filters.max_amount : null,
        );

        // setMinAmountForMaxInput(
        //   filters.min_amount !== undefined ? filters.min_amount : 0,
        // );

        if (includeForRequestNumber) {
          if (filters.request_no !== null && filters.request_no !== undefined) {
            setForRequestNumberContaining(filters.request_no);
          }
        }
      }

      if (
        ['request', 'cash_advance_request', 'request_posting'].includes(item)
      ) {
        setSelectedCategories(requestCategories);
        if (filters.category) {
          updateFilteredTypes(filters.category);
        } else {
          updateFilteredTypes(requestCategories);
        }

        if (filters.request_type !== undefined) {
          if (typeof filters.request_type === 'string') {
            setSelectedTypes(
              filters.request_type
                .split(',')
                .map((typeId: string) => parseInt(typeId)),
            );
          } else {
            if (typeof filters.request_type === 'number') {
              setSelectedTypes([filters.request_type]);
            } else {
              setSelectedTypes(filters.request_type);
            }
          }
        } else {
          setSelectedTypes(
            requestTypes.map((requestType: any) => requestType.id),
          );
        }
      }

      if (filters.category !== undefined) {
        if (typeof filters.category === 'string') {
          setSelectedCategories(filters.category.split(','));
        } else {
          setSelectedCategories(filters.category);
        }
      }
      if (filters.status !== undefined) {
        if (typeof filters.status === 'string') {
          filters.status?.length > 0 &&
            setCheckedStatuses(
              statusSelectionMode === 'multiple'
                ? filters.status.split(',')
                : [filters.status.split(',')[0]],
            );
        } else {
          setCheckedStatuses(
            statusSelectionMode === 'multiple'
              ? filters.status
              : [filters.status[0]],
          );
        }
      } else {
        setCheckedStatuses(
          statusSelectionMode === 'multiple'
            ? statusChoices.map((item: any) => item.code)
            : [statusChoices[0]?.code],
        );
      }
      if (filters.entitlement_period !== undefined) {
        if (typeof filters.entitlement_period === 'string') {
          filters.entitlement_period.length > 0 &&
            setCheckedEntitlementPeriod(
              statusSelectionMode === 'multiple'
                ? filters.entitlement_period.split(',')
                : [filters.entitlement_period.split(',')[0]],
            );
        } else {
          setCheckedEntitlementPeriod(
            statusSelectionMode === 'multiple'
              ? filters.entitlement_period
              : [filters.entitlement_period[0]],
          );
        }
      } else {
        setCheckedEntitlementPeriod(
          statusSelectionMode === 'multiple'
            ? filteredEntitlementPeriod.map((item: any) => item.code)
            : [filteredEntitlementPeriod[0]?.code],
        );
      }

      setFromDate(filters.from_date !== undefined ? filters.from_date : null);
      setToDate(filters.to_date !== undefined ? filters.to_date : null);

      if (filters.from_date !== undefined && filters.to_date !== undefined) {
        setDateRange([
          moment(filters.from_date, 'DD/MM/YYYY'),
          moment(filters.to_date, 'DD/MM/YYYY'),
        ]);
      } else {
        setDateRange(null);
      }

      setSettlementFromDate(
        filters.settled_on_from !== undefined ? filters.settled_on_from : null,
      );
      setSettlementToDate(
        filters.settled_on_to !== undefined ? filters.settled_on_to : null,
      );

      if (
        filters.settled_on_from !== undefined &&
        filters.settled_on_to !== undefined
      ) {
        setSettlementDateRange([
          moment(filters.settled_on_from, 'DD/MM/YYYY'),
          moment(filters.settled_on_to, 'DD/MM/YYYY'),
        ]);
      } else {
        setSettlementDateRange(null);
      }

      setSubmittedOnFromDate(
        filters.submitted_on_from !== undefined
          ? filters.submitted_on_from
          : null,
      );
      setSubmittedOnToDate(
        filters.submitted_on_to !== undefined ? filters.submitted_on_to : null,
      );

      if (
        filters.submitted_on_from !== undefined &&
        filters.submitted_on_to !== undefined
      ) {
        setSubmittedOnDateRange([
          moment(filters.submitted_on_from, 'DD/MM/YYYY'),
          moment(filters.submitted_on_to, 'DD/MM/YYYY'),
        ]);
      } else {
        setSubmittedOnDateRange(null);
      }

      if (filters.item_no !== undefined) {
        setItemNumber(filters.item_no);
      }

      if (filters.batch_no !== undefined) {
        setBatchNumber(filters.batch_no);
      }

      if (filters.pending_approval_at !== undefined) {
        if (filters.pending_approval_at.length === 1) {
          setPendingApprovalAtUserList(
            filters.pending_approval_at.map((o: any) =>
              isNaN(parseInt(o)) ? o : parseInt(o),
            ),
          );
        } else {
          setPendingApprovalAtUserList(
            Array.isArray(filters.pending_approval_at)
              ? filters.pending_approval_at
              : [filters.pending_approval_at],
          );
        }
      } else {
        setPendingApprovalAtUserList([]);
      }

      if (filters.employee_id !== undefined) {
        if (filters.employee_id.length === 1) {
          setEmployeeId(
            filters.employee_id.map((o: any) =>
              isNaN(parseInt(o)) ? o : parseInt(o),
            ),
          );
        } else {
          setEmployeeId(
            Array.isArray(filters.employee_id)
              ? filters.employee_id
              : [filters.employee_id],
          );
        }
      } else {
        setEmployeeId([]);
      }

      if (filters.last_action_prior_to !== undefined) {
        setLastActionPriorToDate(filters.last_action_prior_to || '');
      }
      if (filters.date_filter !== undefined) {
        setYear(filters.date_filter || '');
      }
      if (filters.entity_id !== undefined) {
        if (filters.entity_id.length === 1) {
          setSelectedEntityList(
            filters.entity_id.map((o: any) =>
              isNaN(parseInt(o)) ? o : parseInt(o),
            ),
          );
        } else if (typeof filters.entity_id === 'string') {
          setSelectedEntityList(
            filters.entity_id
              .split(',')
              .map((o: any) => (isNaN(parseInt(o)) ? o : parseInt(o))),
          );
        } else {
          setSelectedEntityList(
            Array.isArray(filters.entity_id)
              ? filters.entity_id
              : [filters.entity_id],
          );
        }
      } else {
        setSelectedEntityList([]);
      }
    } else {
      if (
        ['expense', 'expenses_with_request', 'expense_entitlement'].includes(
          item,
        )
      ) {
        setSelectedCategories(expenseCategories);
        setFilteredExpenseTypes(expenseTypes);
        setSelectedTypes(expenseTypes.map((item: any) => item.id));
      } else {
        if (['benefit', 'benefit_entitlement'].includes(item)) {
          setFilteredBenefitTypes(benefitTypes);
          setSelectedTypes(benefitTypes.map((item: any) => item.id));
        } else {
          setSelectedCategories(requestCategories);
          setFilteredRequestTypes(requestTypes);
          setSelectedTypes(requestTypes.map((item: any) => item.id));
        }
      }
      setWithReceipt(null);
      setCheckedStatuses(
        statusSelectionMode === 'multiple'
          ? statusChoices.map((item: any) => item.code)
          : [statusChoices[0].code],
      );
      setMinAmount(null);
      setMaxAmount(null);
      // setMinAmountForMaxInput(0);
      setFromDate(null);
      setToDate(null);
      setDateRange(null);
      setSettlementFromDate(null);
      setSettlementToDate(null);
      setSettlementDateRange(null);
      setSubmittedOnDateRange(null);
      setSubmittedOnFromDate(null);
      setSubmittedOnToDate(null);
      setLastActionPriorToDate('');
      setYear('');
      setPendingApprovalAtUserList([]);
      setSelectedEntityList([]);
      setEmployeeId([]);
    }
  };

  const getStatusFilters = () => {
    const { Option } = Select;

    const onStatusTagClicked = (code: string) => {
      if (code.toLowerCase() === 'all') {
        if (checkedStatuses.length < statusChoices.length) {
          setCheckedStatuses(() => statusChoices.map((item: any) => item.code));
        } else {
          setCheckedStatuses(() => []);
        }
      } else {
        if (statusSelectionMode === 'multiple') {
          if (checkedStatuses.includes(code)) {
            setCheckedStatuses(checkedStatuses =>
              checkedStatuses.filter((item: string) => item !== code),
            );
          } else {
            setCheckedStatuses(checkedStatuses => [
              ...checkedStatuses,
              ...[code],
            ]);
          }
        } else {
          setCheckedStatuses([code]);
        }
      }
    };
    return (
      <div className='filter-option'>
        <div className='filter-label'>
          <Trans>Status</Trans>
        </div>
        <div className='statuses'>
          <div className='tags'>
            {statusSelectionMode === 'multiple' ? (
              <StatusFilterTag
                key={99}
                code='ALL'
                text='All'
                onClick={() => {
                  onStatusTagClicked('ALL');
                }}
                isChecked={checkedStatuses.length === statusChoices.length}
              />
            ) : null}
            {statusChoices.map(
              (status: { code: string; text: string }, index: number) => {
                return (
                  <StatusFilterTag
                    key={index}
                    code={status.code}
                    text={status.text}
                    onClick={(code: string) => {
                      onStatusTagClicked(code);
                    }}
                    isChecked={checkedStatuses.includes(status.code)}
                  />
                );
              },
            )}
          </div>
          <div className='dropdown'>
            <CustomisedDropdown
              mode={statusSelectionMode}
              showSelectAll={statusSelectionMode === 'multiple'}
              bordered={false}
              placeholder='Statuses'
              onSelect={value => {
                onStatusTagClicked(String(value));
              }}
              onDeselect={value => {
                onStatusTagClicked(String(value));
              }}
              preSelectedValues={checkedStatuses}
              allValues={statusChoices.map(
                (status: { code: string; text: string }) => status.code,
              )}
              onSelectAllToggled={(values: (string | number)[]) => {
                setCheckedStatuses(values.map((v: any) => String(v)));
              }}
            >
              {statusChoices.map((status: { code: string; text: string }) =>
                status.code.toLowerCase() !== 'all' ? (
                  <Option key={status.code} value={status.code}>
                    {status.text}
                  </Option>
                ) : (
                  <></>
                ),
              )}
            </CustomisedDropdown>
          </div>
        </div>
      </div>
    );
  };
  const getEntitlementPeriodFilter = () => {
    const { Option } = Select;

    const onEntitlementPeriodClicked = (code: string) => {
      if (code.toLowerCase() === 'all') {
        if (
          checkedEntitlementPeriod.length < filteredEntitlementPeriod.length
        ) {
          setCheckedEntitlementPeriod(() =>
            filteredEntitlementPeriod.map((item: any) => item.code),
          );
        } else {
          setCheckedEntitlementPeriod(() => []);
        }
      } else {
        if (statusSelectionMode === 'multiple') {
          if (checkedEntitlementPeriod.includes(code)) {
            setCheckedEntitlementPeriod(checkedEntitlementPeriod =>
              checkedEntitlementPeriod.filter((item: string) => item !== code),
            );
          } else {
            setCheckedEntitlementPeriod(checkedEntitlementPeriod => [
              ...checkedEntitlementPeriod,
              ...[code],
            ]);
          }
        } else {
          setCheckedEntitlementPeriod([code]);
        }
      }
    };
    return (
      <div className='filter-option'>
        <div className='filter-label'>
          <Trans>Entitlement Period</Trans>
        </div>
        <div className='statuses'>
          <div className='entitelment-period-filter-dropdown-tags'>
            {statusSelectionMode === 'multiple' ? (
              <StatusFilterTag
                key={99}
                code='ALL'
                text='All'
                onClick={() => {
                  onEntitlementPeriodClicked('ALL');
                }}
                isChecked={
                  checkedEntitlementPeriod.length ===
                  filteredEntitlementPeriod.length
                }
              />
            ) : null}
            {filteredEntitlementPeriod.map((status: any, index: number) => {
              return (
                <StatusFilterTag
                  key={index}
                  code={status.code}
                  text={status.title}
                  onClick={(code: string) => {
                    onEntitlementPeriodClicked(code);
                  }}
                  isChecked={checkedEntitlementPeriod.includes(status.code)}
                />
              );
            })}
          </div>
          <div className='dropdown'>
            <CustomisedDropdown
              mode={statusSelectionMode}
              showSelectAll={statusSelectionMode === 'multiple'}
              bordered={false}
              className='entitelment-period-filter-dropdown'
              placeholder='Entitlement Period'
              onSelect={value => {
                onEntitlementPeriodClicked(String(value));
              }}
              onDeselect={value => {
                onEntitlementPeriodClicked(String(value));
              }}
              preSelectedValues={checkedEntitlementPeriod}
              allValues={filteredEntitlementPeriod.map(
                (status: any) => status.code,
              )}
              onSelectAllToggled={(values: (string | number)[]) => {
                setCheckedEntitlementPeriod(values.map((v: any) => String(v)));
              }}
            >
              {filteredEntitlementPeriod.map((status: any) => {
                return status.code.toLowerCase() !== 'all' ? (
                  <Option key={status.code} value={status.code}>
                    {status.title}
                  </Option>
                ) : (
                  <></>
                );
              })}
            </CustomisedDropdown>
          </div>
        </div>
      </div>
    );
  };

  const getDateRangeFilter = () => {
    return (
      <div className='filter-option'>
        <div className='filter-label'>
          {['expense', 'expenses_with_request', 'receipt'].includes(item) ? (
            <Trans>Receipt Date</Trans>
          ) : (
            <Trans>Date</Trans>
          )}
        </div>
        <div className='picker'>
          <RangePicker
            size='small'
            bordered={false}
            allowClear={false}
            suffixIcon={<DownOutlined />}
            placeholder={['From', 'To']}
            format='DD/MM/YYYY'
            value={dateRange}
            onChange={(_dates, dateStrings) => {
              if (dateStrings.length > 0) {
                if (dateStrings[0].length > 0) {
                  setFromDate(dateStrings[0]);
                }
                if (dateStrings[1].length > 0) {
                  setToDate(dateStrings[1]);
                }
              }
              if (dateStrings.length === 2) {
                setDateRange([
                  moment(dateStrings[0], 'DD/MM/YYYY'),
                  moment(dateStrings[1], 'DD/MM/YYYY'),
                ]);
              }
            }}
          />
        </div>
      </div>
    );
  };

  const handleTypeOnSelect = (value: string | number) => {
    if (
      selectedTypes &&
      selectedTypes.includes(parseInt(value.toString())) === false
    ) {
      setSelectedTypes(selectedTypes => [
        ...selectedTypes,
        ...[parseInt(value.toString())],
      ]);
    }
  };

  const handleTypeOnDeselect = (value: string | number) => {
    if (selectedTypes.includes(parseInt(value.toString())) === true) {
      setSelectedTypes(selectedTypes =>
        selectedTypes.filter(
          (item: number) => item !== parseInt(value.toString()),
        ),
      );
    }
  };

  const handleTypeSelectAllToggled = (values: (string | number)[]) => {
    setSelectedTypes(values.map((v: any) => parseInt(v)));
  };

  const getExpenseTypesFilter = () => {
    if (filteredExpenseTypes === undefined) {
      return <></>;
    }

    const { Option } = Select;

    let allValues: number[] = [];
    let menuItems = filteredExpenseTypes.map((item: any) => {
      allValues.push(item.id);
      return (
        <Option key={item.id} value={item.id}>
          {item.title}
        </Option>
      );
    });
    return (
      <div className='filter-option'>
        <div className='filter-label'>
          <Trans>Expense Types</Trans>
        </div>
        <div className='types'>
          <CustomisedDropdown
            bordered={false}
            placeholder='Expense Types'
            preSelectedValues={selectedTypes}
            allValues={allValues}
            onSelect={value => {
              handleTypeOnSelect(value);
            }}
            onDeselect={value => {
              handleTypeOnDeselect(value);
            }}
            onSelectAllToggled={(values: (string | number)[]) => {
              handleTypeSelectAllToggled(values);
            }}
          >
            {menuItems}
          </CustomisedDropdown>
        </div>
      </div>
    );
  };

  const getBenefitTypesFilter = () => {
    if (filteredBenefitTypes === undefined) {
      return <></>;
    }

    const { Option } = Select;

    let allValues: number[] = [];
    let menuItems = filteredBenefitTypes.map((item: any) => {
      allValues.push(item.id);
      return (
        <Option key={item.id} value={item.id}>
          {item.title}
        </Option>
      );
    });
    return (
      <div className='filter-option'>
        <div className='filter-label'>
          <Trans>Benefit Types</Trans>
        </div>
        <div className='types'>
          <CustomisedDropdown
            bordered={false}
            placeholder='Benefit Types'
            preSelectedValues={selectedTypes}
            allValues={allValues}
            onSelect={value => {
              handleTypeOnSelect(value);
            }}
            onDeselect={value => {
              handleTypeOnDeselect(value);
            }}
            onSelectAllToggled={(values: (string | number)[]) => {
              handleTypeSelectAllToggled(values);
            }}
          >
            {menuItems}
          </CustomisedDropdown>
        </div>
      </div>
    );
  };

  const getRequestTypesFilter = () => {
    if (filteredRequestTypes === undefined) {
      return <></>;
    }

    const { Option } = Select;

    let allValues: number[] = [];
    let menuItems = filteredRequestTypes.map((item: any) => {
      allValues.push(item.id);
      return (
        <Option key={item.id} value={item.id}>
          {item.title}
        </Option>
      );
    });

    return (
      <div className='filter-option'>
        <div className='filter-label'>
          <Trans>Request Types</Trans>
        </div>
        <div className='types'>
          <CustomisedDropdown
            bordered={false}
            placeholder='Request Types'
            preSelectedValues={selectedTypes}
            allValues={allValues}
            onSelect={value => {
              handleTypeOnSelect(value);
            }}
            onDeselect={value => {
              handleTypeOnDeselect(value);
            }}
            onSelectAllToggled={(values: (string | number)[]) => {
              handleTypeSelectAllToggled(values);
            }}
          >
            {menuItems}
          </CustomisedDropdown>
        </div>
      </div>
    );
  };

  const updateFilteredTypes = (newSelectedCategories: string[]) => {
    if (
      ['expense', 'expenses_with_request', 'expense_entitlement'].includes(item)
    ) {
      setExpenseTypes(expenseTypesData);
      if (
        newSelectedCategories?.length === expenseCategories?.length ||
        newSelectedCategories?.length === 0
      ) {
        setFilteredExpenseTypes(expenseTypes);
        newSelectedCategories?.length === 0
          ? setSelectedTypes([])
          : setSelectedTypes(
              expenseTypes.map((expenseType: any) => expenseType.id),
            );
      } else {
        let filteredTypes = expenseTypes.filter((expenseType: any) =>
          newSelectedCategories?.includes(expenseType?.category?.code),
        );
        setFilteredExpenseTypes(filteredTypes);
        setSelectedTypes(
          filteredTypes.map((filteredType: any) => filteredType.id),
        );
      }
    } else if (
      ['request', 'request_posting', 'cash_advance_request'].includes(item)
    ) {
      if (
        newSelectedCategories?.length === 2 ||
        newSelectedCategories?.length === 0
      ) {
        setFilteredRequestTypes(requestTypes);
        newSelectedCategories?.length === 0
          ? setSelectedTypes([])
          : setSelectedTypes(
              requestTypes.map((requestType: any) => requestType.id),
            );
      } else {
        let filteredTypes: { [key: string]: any }[] = [];
        if (
          newSelectedCategories[0] === 'GEN' ||
          newSelectedCategories.includes('GEN')
        ) {
          filteredTypes = requestTypes.filter(
            (requestType: any) => requestType.is_travel_type === false,
          );
        } else {
          filteredTypes = requestTypes.filter(
            (requestType: any) => requestType.is_travel_type === true,
          );
        }
        setFilteredRequestTypes(filteredTypes);
        setSelectedTypes(
          filteredTypes.map((filteredType: any) => filteredType.id),
        );
      }
    }
  };

  const handleCategoryOnSelect = (value: string | number) => {
    if (selectedCategories.includes(value.toString()) === false) {
      setSelectedCategories(selectedCategories => [
        ...selectedCategories,
        ...[value.toString()],
      ]);

      let newSelectedCategories = [...selectedCategories, value.toString()];
      updateFilteredTypes(newSelectedCategories);
    }
  };

  const handleCategoryOnDeselect = (value: string | number) => {
    if (selectedCategories.includes(value.toString()) === true) {
      setSelectedCategories(selectedCategories =>
        selectedCategories.filter((item: string) => item !== value.toString()),
      );
    }
    let newSelectedCategories = selectedCategories.filter(
      (category: string) => category !== value.toString(),
    );
    updateFilteredTypes(newSelectedCategories);
  };

  const handleCategorySelectAllToggled = (values: (string | number)[]) => {
    setSelectedCategories(values.map((v: any) => String(v)));

    let newSelectedCategories = values.map(value => value.toString());
    updateFilteredTypes(newSelectedCategories);
  };

  const getCategoryFilters = () => {
    const { Option } = Select;

    if (['expense', 'expenses_with_request'].includes(item)) {
      return (
        <div className='filter-option'>
          <div className='filter-label'>
            <Trans>Category</Trans>
          </div>
          <div className='category'>
            <CustomisedDropdown
              bordered={false}
              placeholder='Category'
              preSelectedValues={selectedCategories}
              allValues={expenseCategories}
              onSelect={value => {
                handleCategoryOnSelect(value);
              }}
              onDeselect={value => {
                handleCategoryOnDeselect(value);
              }}
              onSelectAllToggled={(values: (string | number)[]) => {
                handleCategorySelectAllToggled(values);
              }}
            >
              <Option key='GEN' value='GEN'>
                General
              </Option>
              <Option key='ENT' value='ENT'>
                Entertainment
              </Option>
              <Option key='MIL' value='MIL'>
                Mileage
              </Option>
              {isPettyCashActive ? (
                <Option key='PTC' value='PTC'>
                  Petty Cash
                </Option>
              ) : (
                <></>
              )}
              {isAllowanceActive ? (
                <Option key='ALW' value='ALW'>
                  Allowance
                </Option>
              ) : (
                <></>
              )}
            </CustomisedDropdown>
          </div>
        </div>
      );
    }

    if (['request', 'cash_advance_request'].includes(item)) {
      return (
        <div className='filter-option'>
          <div className='filter-label'>
            <Trans>Category</Trans>
          </div>
          <div className='category'>
            <CustomisedDropdown
              bordered={false}
              placeholder='Category'
              preSelectedValues={selectedCategories}
              allValues={requestCategories}
              onSelect={value => {
                handleCategoryOnSelect(value);
              }}
              onDeselect={value => {
                handleCategoryOnDeselect(value);
              }}
              onSelectAllToggled={(values: (string | number)[]) => {
                handleCategorySelectAllToggled(values);
              }}
            >
              {item === 'request_posting' ? null : (
                <Option key='GEN' value='GEN'>
                  General
                </Option>
              )}
              <Option key='TVL' value='TVL'>
                Travel
              </Option>
            </CustomisedDropdown>
          </div>
        </div>
      );
    }
  };

  const getAmountRangeFilter = () => {
    return (
      <div className='filter-option'>
        <div className='filter-label'>
          <Trans>Amount</Trans>
        </div>
        <div className='amount'>
          <div className='min'>
            <InputNumber
              min={0}
              maxLength={15}
              step={10}
              precision={2}
              placeholder='Min'
              value={minAmount !== null ? minAmount : undefined}
              onChange={value => {
                // setMinAmountForMaxInput(value !== undefined ? value : 0);
                setMinAmount(value !== undefined ? value : null);
              }}
              onBlur={(e: any) => {
                let value = e?.target?.value;
                value =
                  value && typeof value === 'string' ? parseInt(value) : value;
                if (value !== undefined && value !== 0 && !maxAmount) {
                  // setMinAmountForMaxInput(value !== undefined ? value : 0);
                  setMinAmount(value !== undefined ? value : null);
                }
              }}
            />
          </div>
          <div
            className={`max ${
              (maxAmount || 0) < (minAmount || 0) ? 'error-show' : 'error-hide'
            }`}
          >
            <InputNumber
              step={10}
              precision={2}
              maxLength={15}
              placeholder='Max'
              value={maxAmount !== null ? maxAmount : undefined}
              // min={minAmountForMaxInput}
              onChange={(value: any) => {
                value =
                  value && typeof value === 'string' ? parseInt(value) : value;
                if (value !== undefined && value !== 0)
                  setMaxAmount(value !== undefined ? value : null);
              }}
              onBlur={(e: any) => {
                let value = e?.target?.value;
                value =
                  value && typeof value === 'string' ? parseInt(value) : value;
                if (value !== undefined && value !== 0) {
                  setMaxAmount(value !== undefined ? value : null);
                  !minAmount && setMinAmount(0);
                }
              }}
            />
          </div>
        </div>
      </div>
    );
  };

  const getHasReceiptOption = () => {
    const { Option } = Select;
    return (
      <div className='filter-option'>
        <div className='filter-label'>
          <Trans>With Receipts</Trans>
        </div>
        <div className='has-receipt'>
          <Select
            bordered={false}
            value={
              withReceipt !== null
                ? withReceipt === true
                  ? '1'
                  : '0'
                : undefined
            }
            onChange={value => {
              if (value === '1') {
                setWithReceipt(true);
              } else if (value === '0') {
                setWithReceipt(false);
              } else {
                setWithReceipt(null);
              }
            }}
            allowClear={true}
          >
            <Option key='1' value='1'>
              Yes
            </Option>
            <Option key='0' value='0'>
              No
            </Option>
          </Select>
        </div>
      </div>
    );
  };

  const getFilterData = () => {
    let filters: { [key: string]: any } = {};

    if (
      ['expense', 'expenses_with_request', 'expense_entitlement'].includes(item)
    ) {
      if (withReceipt !== null) {
        filters.has_receipt = withReceipt ? 1 : 0;
      }

      if (fromDate !== null) {
        filters.from_date = fromDate;
      }

      if (toDate !== null) {
        filters.to_date = toDate;
      }

      if (selectedCategories.length > 0) {
        let categoryLength = isPettyCashActive ? 4 : 3;
        if (selectedCategories.length < categoryLength) {
          filters.category = selectedCategories.join(',');
        }
      }

      if (
        selectedTypes.length > 0 &&
        selectedTypes.length < expenseTypes.length
      ) {
        filters.expense_type = selectedTypes.join(',');
      }

      if (minAmount !== null) {
        filters.min_amount = minAmount;
      }
      if (maxAmount !== null) {
        filters.max_amount = maxAmount;
      }
      if (settlementFromDate !== null) {
        filters.settled_on_from = settlementFromDate;
      }
      if (settlementToDate !== null) {
        filters.settled_on_to = settlementToDate;
      }

      if (submittedOnFromDate !== null) {
        filters.submitted_on_from = submittedOnFromDate;
      }
      if (submittedOnToDate !== null) {
        filters.submitted_on_to = submittedOnToDate;
      }

      if (
        includeForRequestNumber &&
        forRequestNumberContaining !== null &&
        forRequestNumberContaining !== undefined &&
        String(forRequestNumberContaining).trim().length > 0
      ) {
        filters.request_no = String(forRequestNumberContaining);
      }
    } else if (
      ['request', 'cash_advance_request', 'request_posting'].includes(item)
    ) {
      if (fromDate !== null) {
        filters.from_date = fromDate;
      }
      if (toDate !== null) {
        filters.to_date = toDate;
      }
      if (selectedCategories.length > 0) {
        if (selectedCategories.length < 2) {
          filters.category = selectedCategories.join(',');
        }
      }
      if (
        selectedTypes.length > 0 &&
        selectedTypes.length < requestTypes.length
      ) {
        filters.request_type = selectedTypes.join(',');
      }

      if (submittedOnFromDate !== null) {
        filters.submitted_on_from = submittedOnFromDate;
      }
      if (submittedOnToDate !== null) {
        filters.submitted_on_to = submittedOnToDate;
      }
    } else if ('receipt' === item) {
      if (fromDate !== null) {
        filters.from_date = fromDate;
      }

      if (toDate !== null) {
        filters.to_date = toDate;
      }
    } else if ('benefit' === item || 'benefit_entitlement' === item) {
      if (withReceipt !== null) {
        filters.has_receipt = withReceipt ? 1 : 0;
      }

      if (fromDate !== null) {
        filters.from_date = fromDate;
      }

      if (toDate !== null) {
        filters.to_date = toDate;
      }

      if (
        selectedTypes.length > 0 &&
        selectedTypes.length < benefitTypes.length
      ) {
        filters.benefit_type = selectedTypes.join(',');
      }

      if (minAmount !== null) {
        filters.min_amount = minAmount;
      }
      if (maxAmount !== null) {
        filters.max_amount = maxAmount;
      }
      if (settlementFromDate !== null) {
        filters.settled_on_from = settlementFromDate;
      }
      if (settlementToDate !== null) {
        filters.settled_on_to = settlementToDate;
      }

      if (submittedOnFromDate !== null) {
        filters.submitted_on_from = submittedOnFromDate;
      }
      if (submittedOnToDate !== null) {
        filters.submitted_on_to = submittedOnToDate;
      }

      // if (
      //   includeForRequestNumber &&
      //   forRequestNumberContaining !== null &&
      //   forRequestNumberContaining !== undefined &&
      //   String(forRequestNumberContaining).trim().length > 0
      // ) {
      //   filters.request_no = String(forRequestNumberContaining);
      // }
    }

    if (checkedStatuses.length !== statusChoices.length) {
      filters.status = checkedStatuses.join(',');
    }
    if (checkedEntitlementPeriod.length !== filteredEntitlementPeriod.length) {
      if (checkedEntitlementPeriod[0] !== undefined) {
        filters.entitlement_period =
          checkedEntitlementPeriod.length > 0
            ? checkedEntitlementPeriod.join(',')
            : [];
      }
    }
    if (
      itemNumber !== null &&
      itemNumber !== undefined &&
      String(itemNumber).trim().length > 0
    ) {
      filters.item_no = String(itemNumber);
    }

    if (
      batchNumber !== null &&
      batchNumber !== undefined &&
      String(batchNumber).trim().length > 0
    ) {
      filters.batch_no = String(batchNumber);
    }

    if (pendingApprovalAtUserList.length) {
      // filters.pending_approval_at = pendingApprovalAtUserList.join(',');
      filters.pending_approval_at = pendingApprovalAtUserList;
    }

    if (employee_id.length) {
      filters.employee_id = employee_id;
    }

    if (lastActionPriorToDate !== '') {
      filters.last_action_prior_to = lastActionPriorToDate;
    }
    if (year !== '') {
      filters.date_filter = year;
      if (!includeDateRange) {
        delete filters.from_date;
        delete filters.to_date;
      }
    }
    if (selectedEntityList.length) {
      filters.entity_id = selectedEntityList;
    }

    if (minAmount !== null) {
      filters.min_amount = minAmount;
    }

    if (maxAmount !== null) {
      filters.max_amount = maxAmount;
    }

    if (fromDate !== null) {
      filters.from_date = fromDate;
    }

    if (toDate !== null) {
      filters.to_date = toDate;
    }

    if (selectedDestinationList.length) {
      filters.destination = selectedDestinationList;
    }

    if (selectedTitleList.length) {
      filters.title = selectedTitleList;
    }

    if (selectedCurrencyList.length) {
      filters.currency = selectedCurrencyList;
    }

    if (selectedEligibilityList.length) {
      filters.eligibility = selectedEligibilityList;
    }

    return filters;
  };

  const resetFilters = () => {
    // setMinAmountForMaxInput(0);
    setMinAmount(null);
    setMaxAmount(null);
    setFromDate(null);
    setToDate(null);
    setWithReceipt(null);
    setDateRange(null);
    setSettlementFromDate(null);
    setSettlementToDate(null);
    setSettlementDateRange(null);
    setSubmittedOnDateRange(null);
    setSubmittedOnFromDate(null);
    setSubmittedOnToDate(null);
    setItemNumber(null);
    setBatchNumber(null);
    setForRequestNumberContaining(null);
    setLastActionPriorToDate('');
    setYear('');
    setPendingApprovalAtUserList([]);
    setEmployeeId([]);
    setSelectedEntityList([]);
    setSelectedDestinationList([]);
    setSelectedTitleList([]);
    setSelectedCurrencyList([]);
    setSelectedEligibilityList([]);
    setCheckedStatuses(
      statusSelectionMode === 'multiple'
        ? statusChoices.map((item: any) => item?.code)
        : [statusChoices[0]?.code],
    );
    setCheckedEntitlementPeriod(
      statusSelectionMode === 'multiple'
        ? filteredEntitlementPeriod.map((item: any) => item?.code)
        : [filteredEntitlementPeriod[0]?.code],
    );
    if (
      ['expense', 'expenses_with_request', 'expense_entitlement'].includes(item)
    ) {
      setSelectedCategories(expenseCategories);
    } else if (
      ['request', 'cash_advance_request', 'request_posting'].includes(item)
    ) {
      setSelectedCategories(requestCategories);
    }

    if (
      ['expense', 'expenses_with_request', 'expense_entitlement'].includes(item)
    ) {
      setSelectedTypes(expenseTypes.map((item: any) => item.id));
      setFilteredExpenseTypes(expenseTypes);
    } else if (
      ['request', 'cash_advance_request', 'request_posting'].includes(item)
    ) {
      setSelectedTypes(requestTypes.map((item: any) => item.id));
      setFilteredRequestTypes(requestTypes);
    } else if (['benefit', 'benefit_entitlement'].includes(item)) {
      setSelectedTypes(benefitTypes.map((item: any) => item.id));
      setFilteredBenefitTypes(benefitTypes);
    }
  };

  const fetchSavedFilters = async () => {
    if (includeSaveFilterOption) {
      try {
        let parameters = {
          page_type: page,
          category: filtersItemCategoryMap[item],
        };
        const response: AxiosResponse = await fetchSavedFiltersService(
          parameters,
        );
        setSavedFilters(response.data);
      } catch (error) {
        setSavedFilters([]);
      }
    }
  };

  const saveFilter = async (filters: { [key: string]: any }) => {
    if (newOrUpdateFilterTitle.trim().length !== 0) {
      const isDuplicate = savedFilters.find(
        item => item.title.trim() === newOrUpdateFilterTitle.trim(),
      );

      if (isDuplicate) {
        message.error('Filter with same title already exists');
      } else {
        if (filters.category !== undefined) {
          filters.category = filters.category.split(',');
        }

        if (
          filters.request_type !== undefined &&
          typeof filters.request_type === 'string'
        ) {
          filters.request_type = filters.request_type
            .split(',')
            .map((item: string) => parseInt(item));
        }

        if (
          filters.expense_type !== undefined &&
          typeof filters.expense_type === 'string'
        ) {
          filters.expense_type = filters.expense_type
            .split(',')
            .map((item: string) => parseInt(item));
        }

        if (
          filters.benefit_type !== undefined &&
          typeof filters.benefit_type === 'string'
        ) {
          filters.benefit_type = filters.benefit_type
            .split(',')
            .map((item: string) => parseInt(item));
        }

        if (filters.status !== undefined) {
          filters.status = filters.status.split(',');
        }

        if (selectedFilter !== null) {
          await updateFilterService(
            {
              title: newOrUpdateFilterTitle,
              category: filtersItemCategoryMap[item],
              page_type: page,
              filter_config: filters,
            },
            selectedFilter.id,
          );
        } else {
          await saveFilterService({
            title: newOrUpdateFilterTitle,
            category: filtersItemCategoryMap[item],
            page_type: page,
            filter_config: {},
          });
        }
      }

      message.success(`Filter ${newOrUpdateFilterTitle} saved`);
      fetchSavedFilters();
      setNewOrUpdateFilterTitle('');
      setSaveFilterFormVisible(false);
    } else {
      message.error('Enter name for the filter');
    }
  };

  const deleteFilter = async () => {
    try {
      if (deletionConfirmationModalProps.itemId !== null) {
        await deleteFilterService(deletionConfirmationModalProps.itemId);
        fetchSavedFilters();
        setSelectedFilter(null);
        updateFiltersFormFromObject();
        resetFilters();
        if (onResetFilters !== undefined) {
          onResetFilters();
        }
        message.success(
          `Filter ${deletionConfirmationModalProps.filterTitle} has been deleted`,
        );
      }
    } catch (error) {
      message.error(error.response.data.error);
    }
  };

  const handlePendingApprovalAtUserOnChange = (value: string[] | number[]) => {
    setPendingApprovalAtUserList(value);
  };

  const getPendingApprovalAtUserList = () => {
    return (
      <div className='filter-option'>
        <div className='filter-label'>
          <Trans>Pending Approval At</Trans>
        </div>
        <div className='pending-approval-at'>
          <SearchableDropdown
            key='pendingApprovalAtUserList'
            placeholder='Search Employee'
            listTitle='Employees'
            list={memoizedEmployees}
            preSelectedValues={pendingApprovalAtUserList}
            maxSelection={50}
            showLoader={usersLoader}
            onChange={(value: any[]) => {
              handlePendingApprovalAtUserOnChange(value);
            }}
          />
        </div>
      </div>
    );
  };

  const getEmployeeList = () => {
    return (
      <div className='filter-option'>
        <div className='filter-label'>
          <Trans>Employee</Trans>
        </div>
        <div className='pending-approval-at'>
          <SearchableDropdown
            key='employeeList'
            placeholder='Search Employee'
            listTitle='Employees'
            list={memoizedEmployees}
            preSelectedValues={employee_id}
            maxSelection={10}
            showLoader={usersLoader}
            onChange={(value: any[]) => {
              setEmployeeId(value);
            }}
          />
        </div>
      </div>
    );
  };

  const getLastActionPriorToDate = () => {
    return (
      <div className='filter-option'>
        <div className='filter-label'>
          <Trans>Last Action On or Before</Trans>
        </div>
        <div className='last-action-prior-to-date'>
          <DatePicker
            bordered={false}
            mode='date'
            format='DD/MM/YYYY'
            showToday={false}
            value={
              lastActionPriorToDate !== ''
                ? moment(lastActionPriorToDate, 'DD/MM/YYYY')
                : null
            }
            onChange={(_date: any, dateString: string) => {
              setLastActionPriorToDate(dateString);
            }}
          />
        </div>
      </div>
    );
  };

  const getYearFilter = () => {
    return (
      <div className='filter-option'>
        <div className='filter-label'>
          <Trans>Year</Trans>
        </div>
        <div className='last-action-prior-to-date'>
          <DatePicker
            bordered={false}
            picker='year'
            format='YYYY'
            value={year !== '' ? moment(year, 'YYYY') : null}
            onChange={(_date: any, dateString: string) => {
              setYear(dateString);
            }}
          />
        </div>
      </div>
    );
  };

  const getEntityList = () => {
    return (
      <div className='filter-option'>
        <div className='filter-label'>
          <Trans>Company</Trans>
        </div>
        <div className='pending-approval-at'>
          <SearchableDropdown
            key='entityList'
            placeholder='Search Entity'
            listTitle='Entities'
            list={memoizedEntityList}
            preSelectedValues={selectedEntityList}
            // maxSelection={50}
            showLoader={entityListLoader}
            onChange={(value: any[]) => {
              setSelectedEntityList(value);
            }}
          />
        </div>
      </div>
    );
  };

  const getDestinationsList = () => {
    return (
      <div className='filter-option'>
        <div className='filter-label'>
          <Trans>Destination</Trans>
        </div>
        <div className='pending-approval-at'>
          <SearchableDropdown
            key='destination'
            placeholder='Search Destination'
            listTitle='Destinations'
            list={destinationList}
            preSelectedValues={selectedDestinationList}
            onChange={(value: any[]) => {
              setSelectedDestinationList(value);
            }}
          />
        </div>
      </div>
    );
  };

  const getTitlesList = () => {
    return (
      <div className='filter-option'>
        <div className='filter-label'>
          <Trans>Title</Trans>
        </div>
        <div className='pending-approval-at'>
          <SearchableDropdown
            key='title'
            placeholder='Search Title'
            listTitle='Titles'
            list={titleList}
            preSelectedValues={selectedTitleList}
            onChange={(value: any[]) => {
              setSelectedTitleList(value);
            }}
          />
        </div>
      </div>
    );
  };
  const getCurrenciesList = () => {
    return (
      <div className='filter-option'>
        <div className='filter-label'>
          <Trans>Currency</Trans>
        </div>
        <div className='pending-approval-at'>
          <SearchableDropdown
            key='currency'
            placeholder='Search Currency'
            listTitle='Currencies'
            list={currencyList}
            preSelectedValues={selectedCurrencyList}
            onChange={(value: any[]) => {
              setSelectedCurrencyList(value);
            }}
          />
        </div>
      </div>
    );
  };

  const getEligibilitiesList = () => {
    return (
      <div className='filter-option'>
        <div className='filter-label'>
          <Trans>Eligibility</Trans>
        </div>
        <div className='pending-approval-at'>
          <SearchableDropdown
            key='eligibility'
            placeholder='Search Eligibility'
            listTitle='Eligibilities'
            list={eligibilityList}
            preSelectedValues={selectedEligibilityList}
            onChange={(value: any[]) => {
              setSelectedEligibilityList(value);
            }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className='data-filter-component'>
      {includeSaveFilterOption ? (
        <div className='saved-filter-options'>
          <>
            {savedFilters.length > 0 ? (
              <>
                {savedFiltersVisible ? (
                  <>
                    {`Saved Filters. ${Object.keys(savedFilters).length}`}
                    <Button
                      type='link'
                      onClick={() =>
                        setSavedFiltersVisible(!savedFiltersVisible)
                      }
                    >
                      <Trans>Hide</Trans>
                    </Button>
                  </>
                ) : (
                  <Button
                    type='link'
                    onClick={() => setSavedFiltersVisible(!savedFiltersVisible)}
                  >
                    {`Saved Filters. ${Object.keys(savedFilters).length}`}
                  </Button>
                )}
              </>
            ) : (
              <Button
                type='link'
                onClick={() => setSavedFiltersVisible(!savedFiltersVisible)}
              >
                {`Saved Filters. ${Object.keys(savedFilters).length}`}
              </Button>
            )}
          </>
          {savedFiltersVisible ? (
            <div className='saved-filters'>
              {savedFilters.map(item => (
                <Tag
                  closable={true}
                  className={
                    selectedFilter !== null &&
                    selectedFilter.title === item.title
                      ? 'selected saved-filter-tag'
                      : 'saved-filter-tag'
                  }
                  key={item.id}
                  onClose={(e: any) => {
                    e.preventDefault();
                    setDeletionConfirmationModalProps({
                      visible: true,
                      itemId: item.id,
                      filterTitle: item.title,
                    });
                  }}
                  onClick={() => {
                    setSelectedFilter(item);
                    updateFiltersFormFromObject(item.filter_config);
                    setFiltersFormVisible(true);
                  }}
                >
                  {item.title}
                </Tag>
              ))}
              <PlusOutlined
                onClick={() => {
                  setSelectedFilter(null);
                  updateFiltersFormFromObject();
                  setFiltersFormVisible(true);
                }}
                style={{ padding: 12, background: '#E6F7FF', color: '#1890FF' }}
              />
            </div>
          ) : (
            <></>
          )}
        </div>
      ) : (
        <></>
      )}
      <div
        className={
          isVisible || filtersFormVisible
            ? 'data-filter-container active'
            : 'data-filter-container hidden'
        }
      >
        <div className='top-row'>
          {includeLegalEntities ? <></> : <></>}
          {item !== 'cash_advance_request' && includeDateRange ? (
            isAggregate ? (
              item === 'benefit_entitlement' ||
              item === 'expense_entitlement' ? (
                <></>
              ) : (
                getDateRangeFilter()
              )
            ) : (
              getDateRangeFilter()
            )
          ) : (
            <></>
          )}
          {includeDate === true && getDateRangeFilter()}
          {item !== 'benefit' ? getCategoryFilters() : <></>}
          {['expense', 'expenses_with_request', 'expense_entitlement'].includes(
            item,
          ) ? (
            getExpenseTypesFilter()
          ) : (
            <></>
          )}
          {['benefit', 'benefit_entitlement'].includes(item) ? (
            getBenefitTypesFilter()
          ) : (
            <></>
          )}
          {['benefit_entitlement'].includes(item) ? (
            getEntitlementPeriodFilter()
          ) : (
            <></>
          )}
          {['request', 'cash_advance_request', 'request_posting'].includes(
            item,
          ) ? (
            getRequestTypesFilter()
          ) : (
            <></>
          )}
          {includeEntityList === true && getEntityList()}
          {includeDestinationList === true && getDestinationsList()}
          {includeTitle === true && getTitlesList()}
          {[
            'expense',
            'expenses_with_request',
            'benefit',
            // 'cash_advance_request',
          ].includes(item) || includeAmount ? (
            getAmountRangeFilter()
          ) : (
            <></>
          )}
          {['expense', 'expenses_with_request', 'benefit'].includes(item) &&
          includeWithReceiptOption ? (
            getHasReceiptOption()
          ) : (
            <></>
          )}
          {includeCurrency === true && getCurrenciesList()}
          {includeEligibility === true && getEligibilitiesList()}
          {includeItemNumber ? (
            <>
              {(['expense', 'expenses_with_request', 'benefit'].includes(
                item,
              ) && (
                <div className='filter-option'>
                  <div className='filter-label'>
                    <Trans>Claim Number Contains</Trans>
                  </div>
                  <div className='input'>
                    <Input
                      placeholder='eg. 0045'
                      value={itemNumber !== null ? itemNumber : undefined}
                      onChange={event => setItemNumber(event.target.value)}
                    />
                  </div>
                </div>
              )) ||
                (item === 'request' && (
                  <div className='filter-option'>
                    <div className='filter-label'>
                      <Trans>Request Number Contains</Trans>
                    </div>
                    <div className='input'>
                      <Input
                        placeholder='eg. 0045'
                        value={itemNumber !== null ? itemNumber : undefined}
                        onChange={event => setItemNumber(event.target.value)}
                      />
                    </div>
                  </div>
                )) ||
                (item === 'cash_advance_request' && (
                  <div className='filter-option'>
                    <div className='filter-label'>
                      <Trans>For Request Number Containing</Trans>
                    </div>
                    <div className='input'>
                      <Input
                        placeholder='eg. 0045'
                        value={itemNumber !== null ? itemNumber : undefined}
                        onChange={event => setItemNumber(event.target.value)}
                      />
                    </div>
                  </div>
                ))}
            </>
          ) : (
            <></>
          )}
          {item === 'expenses_with_request' && includeForRequestNumber && (
            <div className='filter-option'>
              <div className='filter-label'>
                <Trans>For Request Number Containing</Trans>
              </div>
              <div className='input'>
                <Input
                  placeholder='eg. 0045'
                  value={
                    forRequestNumberContaining !== null
                      ? forRequestNumberContaining
                      : undefined
                  }
                  onChange={event =>
                    setForRequestNumberContaining(event.target.value)
                  }
                />
              </div>
            </div>
          )}
          {includeSettlementDate === true && (
            <div className='filter-option'>
              <div className='filter-label'>
                <Trans>Settlement Date</Trans>
              </div>
              <div
                className={`${
                  settlementDatePickerDisabled ? 'disabled picker' : 'picker'
                }`}
              >
                {settlementDatePickerDisabled ? (
                  <>
                    <Input
                      readOnly={true}
                      placeholder='From'
                      className='dummy'
                    />
                    <Input readOnly={true} placeholder='To' className='dummy' />
                  </>
                ) : (
                  <RangePicker
                    size='small'
                    bordered={false}
                    allowClear={true}
                    suffixIcon={<DownOutlined />}
                    placeholder={['From', 'To']}
                    format='DD/MM/YYYY'
                    value={settlementDateRange}
                    onChange={(_dates, dateStrings) => {
                      if (dateStrings.length > 0) {
                        if (dateStrings[0].length > 0) {
                          setSettlementFromDate(dateStrings[0]);
                        }
                        if (dateStrings[1].length > 0) {
                          setSettlementToDate(dateStrings[1]);
                        }
                        if (
                          dateStrings[0].length > 0 &&
                          dateStrings[1].length > 0
                        ) {
                          setSettlementDateRange([
                            moment(dateStrings[0], 'DD/MM/YYYY'),
                            moment(dateStrings[1], 'DD/MM/YYYY'),
                          ]);
                        } else {
                          setSettlementFromDate(null);
                          setSettlementToDate(null);
                          setSettlementDateRange(null);
                        }
                      } else {
                        setSettlementFromDate(null);
                        setSettlementToDate(null);
                        setSettlementDateRange(null);
                      }
                    }}
                  />
                )}
              </div>
            </div>
          )}
          {includePendingApprovalAtUserList === true ? (
            isAggregate ? (
              item === 'benefit_entitlement' ||
              item === 'expense_entitlement' ||
              item === 'cash_advance_request' ? (
                <></>
              ) : (
                getPendingApprovalAtUserList()
              )
            ) : (
              getPendingApprovalAtUserList()
            )
          ) : (
            <></>
          )}
          {includeLastActionPriorToDate === true ? (
            isAggregate ? (
              item === 'benefit_entitlement' ||
              item === 'expense_entitlement' ||
              item === 'cash_advance_request' ? (
                <></>
              ) : (
                getLastActionPriorToDate()
              )
            ) : (
              getLastActionPriorToDate()
            )
          ) : (
            <></>
          )}
          {includeYearFilter === true ? getYearFilter() : <></>}
          {includeEmpoyeeList === true && getEmployeeList()}
          {includeSubmittedOnDate === true && (
            <div className='filter-option'>
              <div className='filter-label'>
                <Trans>Submitted On</Trans>
              </div>
              <div className={`${'picker'}`}>
                <RangePicker
                  size='small'
                  bordered={false}
                  allowClear={true}
                  suffixIcon={<DownOutlined />}
                  placeholder={['From', 'To']}
                  format='DD/MM/YYYY'
                  value={submittedOnDateRange}
                  onChange={(_dates, dateStrings) => {
                    if (dateStrings.length > 0) {
                      if (dateStrings[0].length > 0) {
                        setSubmittedOnFromDate(dateStrings[0]);
                      }
                      if (dateStrings[1].length > 0) {
                        setSubmittedOnToDate(dateStrings[1]);
                      }
                      if (
                        dateStrings[0].length > 0 &&
                        dateStrings[1].length > 0
                      ) {
                        setSubmittedOnDateRange([
                          moment(dateStrings[0], 'DD/MM/YYYY'),
                          moment(dateStrings[1], 'DD/MM/YYYY'),
                        ]);
                      } else {
                        setSubmittedOnFromDate(null);
                        setSubmittedOnToDate(null);
                        setSubmittedOnDateRange(null);
                      }
                    } else {
                      setSubmittedOnFromDate(null);
                      setSubmittedOnToDate(null);
                      setSubmittedOnDateRange(null);
                    }
                  }}
                />
              </div>
            </div>
          )}
          {includeBatchNumber ? (
            <>
              {['expense', 'expenses_with_request', 'benefit'].includes(
                item,
              ) && (
                <div className='filter-option'>
                  <div className='filter-label'>
                    <Trans>Batch no. Contains</Trans>
                  </div>
                  <div className='input'>
                    <Input
                      placeholder='eg. 0045'
                      value={batchNumber !== null ? batchNumber : undefined}
                      onChange={event => setBatchNumber(event.target.value)}
                    />
                  </div>
                </div>
              )}
            </>
          ) : (
            <></>
          )}
        </div>
        <div className='bottom-row'>
          {includeStatusBar ? (
            isAggregate ? (
              item === 'benefit_entitlement' ||
              item === 'expense_entitlement' ? (
                <></>
              ) : (
                getStatusFilters()
              )
            ) : (
              getStatusFilters()
            )
          ) : (
            <></>
          )}
          <div className='buttons'>
            {includeSaveFilterOption ? (
              <Button
                className='save-filter-button'
                type='link'
                onClick={() => {
                  setSaveFilterFormVisible(true);
                  let filters: { [key: string]: any } = removeParamsFromObject(
                    getFilterData(),
                    ['from_date', 'to_date'],
                    item === 'cash_advance_request',
                  );
                  if (onApplyFilters !== undefined) {
                    onApplyFilters(filters);
                  }
                }}
              >
                <Trans>Save This Filter</Trans>
              </Button>
            ) : (
              <></>
            )}
            <Button
              className='reset-filter-button'
              type='link'
              onClick={() => {
                resetFilters();
                if (onResetFilters !== undefined) {
                  onResetFilters();
                }
              }}
            >
              <Trans>Reset</Trans>
            </Button>
            <Button
              type='primary'
              className='apply-filter-button'
              onClick={() => {
                let filters: { [key: string]: any } = removeParamsFromObject(
                  getFilterData(),
                  ['from_date', 'to_date'],
                  item === 'cash_advance_request',
                );

                if (onApplyFilters !== undefined) {
                  onApplyFilters(filters);
                }
              }}
            >
              <Trans>Filter</Trans>
            </Button>
          </div>
        </div>
      </div>
      <Modal
        visible={saveFilterFormVisible}
        closable
        onCancel={() => {
          setNewOrUpdateFilterTitle('');
          setSaveFilterFormVisible(false);
        }}
        footer={null}
        width={400}
        destroyOnClose
        className='save-filters-modal'
        title={<Trans>Enter Name For Filter</Trans>}
        getContainer='.data-filter-component'
      >
        <div className='form'>
          <Form>
            <Form.Item
              name='filter'
              rules={[
                () => ({
                  validator(_, value) {
                    if (value !== undefined) {
                      value = value?.trim();
                    }

                    if (new RegExp(/^[^@!=\-+#﹘—⸺⸻].*$/).test(value)) {
                      return Promise.resolve();
                    }
                    if (!value || value === undefined) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error('Can not start with special character'),
                    );
                  },
                }),
              ]}
            >
              <Input
                required={true}
                value={newOrUpdateFilterTitle}
                autoFocus
                onChange={e => setNewOrUpdateFilterTitle(e.target.value)}
              />
            </Form.Item>
          </Form>
          <Button
            type='primary'
            onClick={() => {
              let filters = removeParamsFromObject(
                getFilterData(),
                ['from_date', 'to_date'],
                item === 'cash_advance_request',
              );
              saveFilter(filters);
              if (onSaveFilters !== undefined) {
                onSaveFilters(filters);
              }
            }}
            className='save-filters-button'
            disabled={
              !Boolean(newOrUpdateFilterTitle.trim()) ||
              !new RegExp(/^[^@!=\-+#﹘—⸺⸻].*$/).test(
                newOrUpdateFilterTitle.trim(),
              )
            }
          >
            <Trans>Save</Trans>
          </Button>
        </div>
      </Modal>
      <ConfirmationModal
        visible={deletionConfirmationModalProps.visible}
        header='Confirm'
        body='Are you sure you want to delete this filter?'
        onCancelClick={() => {
          setDeletionConfirmationModalProps({
            visible: false,
            itemId: null,
            filterTitle: null,
          });
        }}
        okText='Yes'
        cancelText='Cancel'
        onOkClick={() => {
          deleteFilter();
          setDeletionConfirmationModalProps({
            visible: false,
            itemId: null,
            filterTitle: null,
          });
        }}
      />
    </div>
  );
};

export default memo(connector(DataFilter));
