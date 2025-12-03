/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  memo,
  useEffect,
  useImperativeHandle,
  forwardRef,
  MouseEvent,
  useState,
} from 'react';
import {
  Form,
  Select,
  Input,
  InputNumber,
  Checkbox,
  // Skeleton,
  DatePicker,
  Row,
  Col,
  Button,
  Table,
  message,
  Space,
  Card,
} from 'antd';
import { Trans } from '@lingui/macro';
import { ColumnProps } from 'antd/lib/table';
import { connect, ConnectedProps } from 'react-redux';
import { stateInterface } from '../../../../../shared/redux/rootReducer';

import {
  saveAllowanceExpenses,
  updateFormDataInState,
  createPostData,
  RESET_ENTERTAIMENT_DATA,
  RESET_MILEAGE_DATA,
  returnUpdateRateTypeAction,
  resetSetupMaximumClaimAmountPerPeriodSubOptions,
  resetSetWarningAmountSubOptions,
  resetCanAttachReceiptSubOptions,
  resetIsReceiptMandatorySubOptions,
  resetAllowRemarkSubOptions,
  resetAllowForexSubOptions,
  resetAllowBackdatedClaimsSubOptions,
  resetAllowChargingToCostCentresSubOptions,
  resetOverSeasCostCentreSubOptions,
  resetOverseasAndLocalThresholdAmount,
  resetCanHaveStaffMembersSubOptions,
  resetCanHaveGuestMembersSubOptions,
  resetIsEntertainmentRatesDefinedSubOptions,
  updateCostCenterForEntity,
} from '../../../expenseTypeConfiguration.actions';
import {
  // IcostCenterList,
  IcategoryList,
  ImaximumClaimAmountPerPeriodData,
  IallowClaimsOn,
  IentityList,
  IGLAccountList,
  IentertanmentRateTableData,
  Ientertainment_rates_array_obj,
} from '../../../expenseTypeConfiguration.model';
import { IwageTypeListDDCompatible } from '../../../../../shared/redux/wageType/wageType.model';
import moment from 'moment';
import {
  AppDrawer,
  ErrorBoundary,
  Loader,
  RichTextEditor,
  SkeletonItem,
} from '../../../../../shared/components/';

import Errors from '../../../expenseTypeConfiguration.data.json';
import './configForm.index.less';
import {
  fetchLabelMappingList,
  fetchExpenseConfigAllowanceTypes,
  fetchEntityCostCenterList,
} from '../../../expenseTypeConfiguration.thunk';
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
// import _default from 'antd/lib/time-picker';

type Iprops = ConnectedProps<typeof connector> & {
  saveExpenseTypeConfiguration: (postData: any) => void;
  isUpdateMode: boolean;
  ref: any;
  legal_entity?: string;
};

const ConfigForm = forwardRef((props: Iprops, ref: any) => {
  const {
    dispatch,
    legal_entity,
    general_data,
    mileage,
    entertaiment,
    pettyCash,
    allowance,
    categoryList,
    entityList,
    allowanceExpenseTypes,
    expense_type_allowance_rates,
    maximumClaimAmountPerPeriodDataList,
    costCenterList,
    GLAccountList,
    wageTypeListDDCompatible,
    allowanceRateExpenseTypes,
    countryList,
    allowClaimsOn,
    custom,
    label,
    isUpdateMode,
    isLoading,
    saveExpenseTypeConfiguration,
    backendError,
    rate_type,
    entertainment_rates,
    loadingCategory,
    loadingEntity,
    loadingMaximumClaimAmountPerPeriod,
    loadingGLAccount,
    wageTypeListDDCompatibleLoader,
    loadingAllowClaimsOn,
    configMode,
    loadingConfigurationData,
    entityCostCenterLoader,
    entityCostCenterList,
    cost_centres_for_legal_entity,
  } = props;
  const [form] = Form.useForm();
  const { Option } = Select;
  let drawerVisibility: boolean = rate_type !== '';
  let mileageRatesColumn: ColumnProps<any>[] = [];
  let mileageRatesTableData: any[] = [];
  let entertanmentRatesColumn: ColumnProps<IentertanmentRateTableData>[] = [];
  let entertanmentRatesTableData: IentertanmentRateTableData[] = [];
  let taxPercentagesColumn: ColumnProps<any>[] = [];

  taxPercentagesColumn = [
    {
      title: <Trans>Tax Percentage As Of Date</Trans>,
      dataIndex: 'as_of_date',
    },
    {
      title: <Trans>Tax Percentage</Trans>,
      dataIndex: 'tax_percentage',
    },
  ];

  let [taxPercentagesTableData, setTaxPercentagesTableData] = useState<any>([]);

  useEffect(() => {
    let getSortedDataUsingDate = () => {
      let tableData: any =
        general_data?.tax_percentages_list === 0
          ? []
          : general_data.tax_percentages_list;
      tableData.sort((a: any, b: any) => {
        const _a = moment.isMoment(a.as_of_date)
          ? a.as_of_date
          : moment(a.as_of_date, ['DD/MM/YYYY']);
        const _b = moment.isMoment(b.as_of_date)
          ? b.as_of_date
          : moment(b.as_of_date, ['DD/MM/YYYY']);
        return _a.valueOf() - _b.valueOf();
      });
      return tableData;
    };
    const sortedDatePercentage: any = general_data?.tax_percentages_list
      ? getSortedDataUsingDate()
      : [];
    taxPercentagesTableData = sortedDatePercentage?.map((o: any) => ({
      as_of_date: o.as_of_date,
      tax_percentage: Number(Number(o.tax_percentage).toFixed(2)),
    }));
    setTaxPercentagesTableData(taxPercentagesTableData);
  }, [general_data]);

  if (isUpdateMode) {
    mileageRatesColumn = [
      {
        title: 'Upto Distance',
        dataIndex: 'upto_distance',
      },
      {
        title: 'Rate',
        dataIndex: 'rate',
      },
      {
        title: 'As Of Date',
        dataIndex: 'as_of_date',
      },
    ];
    const getMileageRatesTableData = (rates: any) => {
      let dates: any = [];

      rates.map((item: any) => {
        if (!dates.includes(item.as_of_date)) {
          dates.push(item.as_of_date);
        }
        return item;
      });
      let updatesArray: any = [];
      dates.map((date: any) => {
        let mileageRates = rates.filter((item: any) => {
          return item.as_of_date === date;
        });
        // Milage Rates Sorting
        const uptoDistanceNull = mileageRates?.find(
          (item: any) => !item.upto_distance,
        );
        mileageRates = mileageRates?.filter((item: any) => {
          return item.upto_distance;
        });
        let sortedMilageRate = mileageRates.sort(function(a: any, b: any) {
          return a.upto_distance - b.upto_distance;
        });
        uptoDistanceNull && sortedMilageRate.push(uptoDistanceNull);
        updatesArray = [...updatesArray, ...sortedMilageRate];
        return date;
      });
      return updatesArray;
    };
    mileageRatesTableData = getMileageRatesTableData(
      mileage.total_mileage_rates,
    );
    mileageRatesTableData = mileageRatesTableData.map((o: any) => ({
      //id: o.id,
      upto_distance: o.upto_distance
        ? Number(Number(o.upto_distance).toFixed(2))
        : '-',
      as_of_date: o.as_of_date,
      rate: Number(Number(o.rate).toFixed(2)),
    }));

    entertanmentRatesColumn = [
      {
        title: 'As Of Date',
        dataIndex: 'as_of_date',
      },
      {
        title: 'Rate Per Staff Member',
        dataIndex: 'rate_per_staff_member',
      },
      {
        title: 'Rate Per Guest Member',
        dataIndex: 'rate_per_guest_member',
      },
    ];

    entertanmentRatesTableData = entertainment_rates.map(
      (o: Ientertainment_rates_array_obj) => ({
        id: o.id,
        as_of_date: o.as_of_date,
        rate_per_staff_member: Number(
          Number(o.rate_per_staff_member).toFixed(2),
        ),
        rate_per_guest_member: Number(
          Number(o.rate_per_guest_member).toFixed(2),
        ),
        country: o.country,
      }),
    );
  }

  useImperativeHandle(ref, () => ({
    onSubmitHandler: async () => {
      try {
        const values = await form.validateFields();
        console.warn('Success:', values);

        const generalData = general_data;
        if (generalData.is_assign_using_rules) {
          delete generalData.max_amount;
          delete generalData.min_amount;
        }
        const param = {
          cost_centres_for_legal_entity,
          isUpdateMode,
          general_data: generalData,
          entertaiment,
          mileage,
          custom,
          label,
          categoryList,
          entityList,
          allowClaimsOn,
          maximumClaimAmountPerPeriodDataList,
          costCenterList,
          wageTypeListDDCompatible,
          GLAccountList,
          countryList,
          pettyCash,
          allowance,
          expense_type_allowance_rates,
        };
        saveExpenseTypeConfiguration(createPostData(param, configMode));
        return Promise.resolve();
      } catch (errorInfo) {
        console.error('Failed:', errorInfo);
        return Promise.reject(errorInfo);
      }
    },
    onClearBtnHandler: () => {
      form.resetFields();
      const legal_entity = form.getFieldValue('legal_entity');
      setSelectedEntityList([]);
      if (isUpdateMode) {
        form.setFieldsValue({ legal_entity });
      }
    },
  }));

  /**
   * This function is handler of category list change event.
   * @function handleCategoryChange
   * @param { string } value : selected category from list.
   * @returns { void }
   */
  const handleCategoryChange = (value: string): void => {
    dispatch(updateFormDataInState('category', 'general', value));
    if (value === 'Mileage') {
      dispatch({ type: RESET_ENTERTAIMENT_DATA });
    } else if (value === 'Entertainment') {
      dispatch({ type: RESET_MILEAGE_DATA });
    } else {
      dispatch({ type: RESET_ENTERTAIMENT_DATA });
      dispatch({ type: RESET_MILEAGE_DATA });
    }
    dispatch(fetchLabelMappingList(value as any) as any);
  };
  /**
   * This function trigger after click on milage or entertainment previous rate button.
   * @function showPreviousRates
   * @param { string } _type : entertainment | mileage.
   * @param { MouseEvent<HTMLButtonElement> } _e : event object.
   * @returns { void }
   */
  const showPreviousRates = (
    _type: string,
    _e: MouseEvent<HTMLButtonElement>,
  ): void => {
    dispatch(returnUpdateRateTypeAction(_type));
  };

  const dropdownCustomValidator = (val: any, key: string) => {
    const condition = Array.isArray(val) ? Boolean(val.length) : Boolean(val);
    return condition ? Promise.resolve() : Promise.reject(`${key} required`);
  };
  const dateValidator = (val: any, _key: string) => {
    return moment(`${val}`, ['DD/MM/YYYY']).isValid()
      ? Promise.resolve()
      : Promise.reject(Errors.ENTER_VALID_DATE);
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

  const mileageOptionVisibility = general_data.category === 'Mileage';
  const entertainmentOptionVisibility =
    general_data.category === 'Entertainment';
  const pettyCashOptionVisibility = general_data.category === 'Petty Cash';
  const allowanceOptionVisibility = general_data.category === 'Allowance';
  const checkboxLabel = '';
  const innerCheckboxLabel = '';
  const widthFiftyPer = { width: '100%' };
  const innerRowGutter: [number, number] = [16, 16];
  const levelOneSpan = {
    xs: 24,
    sm: 20,
    md: 16,
    lg: 12,
    xl: 12,
    xxl: 6,
  };
  const levelTwoSpan = {
    xs: 24,
    sm: 24,
    md: 22,
    lg: 18,
    xl: 12,
    xxl: 12,
  };
  const levelThreeSpan = {
    xs: 24,
    sm: 24,
    md: 24,
    lg: 22,
    xl: 18,
    xxl: 18,
  };
  useEffect(() => {
    // if (!general_data.max_amount || general_data.max_amount === 0)
    //   delete general_data.max_amount;

    const _fV = {
      ...general_data,
      ...entertaiment,
      ...mileage,
      mileage_rate_as_of_date:
        typeof mileage.mileage_rate_as_of_date === 'string'
          ? moment(mileage.mileage_rate_as_of_date, 'DD/MM/YYYY')
          : null,
      entertainment_rate_as_of_date:
        typeof entertaiment.entertainment_rate_as_of_date === 'string'
          ? moment(entertaiment.entertainment_rate_as_of_date, 'DD/MM/YYYY')
          : null,
    };
    form.setFieldsValue(_fV);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [general_data, mileage, entertaiment]);

  useEffect(() => {
    if (
      !general_data.is_allow_forex ||
      !general_data.is_forex_rate_editable_by_employee
    )
      dispatch(
        updateFormDataInState('forex_deviation_percentage', 'general', 0),
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    general_data.is_allow_forex,
    general_data.is_forex_rate_editable_by_employee,
  ]);
  useEffect(() => {
    form.setFieldsValue({
      expense_type_allowance_rates: allowance.expense_type_allowance_rates,
    });
  }, [allowance]);
  const [isAddMileageRateDisabled, setIsAddMileageRateDisabled] = useState<
    boolean
  >(true);

  const mileageRates = async (mileageRates: any[]) => {
    const result = await mileageRates.map((res: any) => {
      if (res.upto_distance !== null && res.rate !== null) {
        return true;
      } else {
        return false;
      }
    });

    result.includes(false)
      ? setIsAddMileageRateDisabled(true)
      : setIsAddMileageRateDisabled(false);
  };

  const mileageRateHandler = async (
    searchableArray: any[],
    valueToCheck: any,
    index: any,
  ) => {
    // eslint-disable-next-line array-callback-return
    const val = await searchableArray.map((res: any, i: any) => {
      if (mileage.mileage_rates.length > 1) {
        if (
          (res?.upto_distance > valueToCheck ||
            res?.upto_distance === valueToCheck) &&
          i < index &&
          !res.is_deleted
        ) {
          return false;
        }
      }
    });
    return val.includes(false) ? false : true;
  };
  useEffect(() => {
    // eslint-disable-next-line array-callback-return
    mileage.mileage_rates.map((result: any) => {
      if (result.upto_distance !== null && result.rate !== null) {
        setIsAddMileageRateDisabled(false);
      } else {
        setIsAddMileageRateDisabled(true);
      }
    });
  }, [mileage.mileage_rates]);

  const handleMilageRateFieldChange = async (
    fieldKey: number,
    fieldName: 'upto_distance' | 'rate',
    value: number,
  ) => {
    try {
      const val = mileage.mileage_rates;

      if (fieldName === 'upto_distance' && value !== null) {
        const mileageValue = await mileageRateHandler(
          mileage.mileage_rates,
          value,
          fieldKey,
        );
        if (mileageValue === false) {
          return message.error(
            `Upto Distance should be greater than earlier Upto Distance Value`,
          );
        }
      }
      val[fieldKey][fieldName] = value;
      dispatch(updateFormDataInState('mileage_rates', 'mileage', val));
      await mileageRates(mileage.mileage_rates);
    } catch (error) {
      console.error(error);
    }
  };
  const handleDeleteClickFieldList = (field: any) => {
    try {
      const newVal = mileage.mileage_rates;

      if (
        isUpdateMode &&
        (newVal[field.fieldKey] as any).upto_distance !== null &&
        (newVal[field.fieldKey] as any).rate !== null
      ) {
        newVal[field.fieldKey].is_deleted = true;
      } else {
        newVal.splice(field.fieldKey, 1);
      }
      dispatch(updateFormDataInState('mileage_rates', 'mileage', newVal));

      // eslint-disable-next-line array-callback-return
      mileage.mileage_rates.map((result: any) => {
        if (result.upto_distance !== null && result.rate !== null) {
          setIsAddMileageRateDisabled(false);
        } else {
          setIsAddMileageRateDisabled(true);
        }
      });
    } catch (error) {
      console.error(error);
    }
  };
  const handleMilageRateAsOfDateFieldChange = (value: any) => {
    const date = value?.format('DD/MM/YYYY');
    let mileageRates = mileage.total_mileage_rates.filter((item: any) => {
      return item.as_of_date === date;
    });
    // Milage Rates Sorting
    const uptoDistanceNull = mileageRates?.find(
      (item: any) => !item.upto_distance,
    );
    mileageRates = mileageRates?.filter((item: any) => {
      return item.upto_distance;
    });
    let sortedMilageRate = mileageRates.sort(function(a: any, b: any) {
      return a.upto_distance - b.upto_distance;
    });
    uptoDistanceNull && sortedMilageRate.push(uptoDistanceNull);
    if (sortedMilageRate.length === 0) {
      sortedMilageRate.push({ upto_distance: null, rate: null });
    }

    dispatch(
      updateFormDataInState('mileage_rate_as_of_date', 'mileage', date || null),
    );
    dispatch(
      updateFormDataInState('mileage_rates', 'mileage', sortedMilageRate),
    );
  };
  const showLoader: boolean = isLoading || loadingConfigurationData;

  const fetchExpensesOfLegalEntity = (search?: any) => {
    const legal_entity = form.getFieldValue('legal_entity');

    if (legal_entity && (legal_entity as Array<string>)?.length !== 0) {
      const obj = {
        legal_entity_uuids: legal_entity,
      };
      dispatch(
        fetchExpenseConfigAllowanceTypes(obj as any, search as any) as any,
      );
    }
  };
  useEffect(() => {
    if (
      general_data.legal_entity.length > 0 &&
      allowance.is_allow_allowance_rate_enabled &&
      allowanceRateExpenseTypes.length > 0
    ) {
      let data: any = [];
      general_data.legal_entity.map((entity: any) => {
        data = [
          ...data,
          ...allowanceRateExpenseTypes.filter(
            (type: any) => type.company === entity,
          ),
        ];
      });
      const filteredRate = allowance.expense_type_allowance_rates.filter(
        (id: any) => {
          const result = data.find((value: any) => value.id === id);
          if (result) {
            return result;
          }
        },
      );
      dispatch(
        updateFormDataInState(
          'expense_type_allowance_rates',
          'allowance',
          filteredRate,
        ),
      );
      form.setFieldsValue({ expense_type_allowance_rates: filteredRate });
      dispatch(saveAllowanceExpenses(data));
    }
  }, [
    general_data.legal_entity,
    general_data.category,
    allowanceRateExpenseTypes,
  ]);
  useEffect(() => {
    if (allowance.is_allow_allowance_rate_enabled) {
      const legal_entity = form.getFieldValue('legal_entity');
      const obj = {
        legal_entity_uuids: legal_entity,
      };
      dispatch(fetchExpenseConfigAllowanceTypes(obj as any, '') as any);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allowance.is_allow_allowance_rate_enabled]);

  const onAllowAllowance = (val: boolean) => {
    if (val) {
      fetchExpensesOfLegalEntity('');
    } else {
      dispatch(
        updateFormDataInState('expense_type_allowance_rates', 'allowance', []),
      );
      form.setFieldsValue({ expense_type_allowance_rates: [] });
    }
  };
  const [searchedAllowanceRateList, setSearchedAllowanceRateList] = useState<
    any[]
  >([]);
  const [
    searchedSelectedAllowanceRateList,
    setSearchedSelectedAllowanceRateList,
  ] = useState<any[]>([]);
  const [searchEnable, setSearchEnable] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  useEffect(() => {
    !open && setSearchEnable(false);
  }, [open]);
  const onSearch = (value: string) => {
    let filterList = allowanceExpenseTypes.filter(
      (rate: any) => rate.title.toLowerCase() === value.toLowerCase(),
    );
    setSearchedAllowanceRateList([...filterList]);
    setSearchEnable(true);
    let filterSelectedList = allowance.expense_type_allowance_rates.filter(
      (rate: any) => {
        return filterList.find((val: any) => val.id === rate);
      },
    );
    setSearchedSelectedAllowanceRateList(filterSelectedList);
  };
  const onClickedSelectOptionForAllowanceRate = () => {
    const filteredList = searchedAllowanceRateList.filter(
      (rate: any) => !allowance.expense_type_allowance_rates.includes(rate.id),
    );
    let val = filteredList.map((o: any) => o.id);
    setSearchedSelectedAllowanceRateList(searchedAllowanceRateList);
    dispatch(
      updateFormDataInState('expense_type_allowance_rates', 'allowance', [
        ...allowance.expense_type_allowance_rates,
        ...val,
      ]),
    );
  };
  const onClickedDeselectOptionForAllowanceRate = () => {
    const val = searchedAllowanceRateList.map((o: any) => o.id);
    const filteredList = allowance.expense_type_allowance_rates.filter(
      (rate: any) => !val.includes(rate),
    );
    setSearchedSelectedAllowanceRateList([]);
    dispatch(
      updateFormDataInState('expense_type_allowance_rates', 'allowance', [
        ...filteredList,
      ]),
    );
  };
  const onchangeAllowanceSearch = (value: any) => {
    let val = value;
    if (value.includes('Select All')) {
      val = allowanceExpenseTypes.map((o: any) => o.id);
    } else if (value.includes('Deselect All')) {
      val = [];
    }
    setSearchEnable(false);
    setSearchedAllowanceRateList([]);
    setSearchedSelectedAllowanceRateList([]);
    dispatch(
      updateFormDataInState('expense_type_allowance_rates', 'allowance', val),
    );
  };
  const SelectAllOptions = () => {
    return allowance.expense_type_allowance_rates.length ===
      allowanceExpenseTypes.length ? (
      <Option value='Deselect All' key='Deselect All'>
        Deselect All
      </Option>
    ) : (
      <Option value='Select All' key='Select All'>
        Select All
      </Option>
    );
  };
  const [entityCostCenterCheckbox, setEntityCostCenterCheckbox] = useState(
    false,
  );

  const [onUpdateSelectedEntityList, setOnUpdateSelectedEntityList] = useState<
    any[]
  >([]);

  const [selectedEntityList, setSelectedEntityList] = useState<any[]>([]);

  useEffect(() => {
    try {
      if (entityList && entityList.length > 0 && isUpdateMode) {
        if (isUpdateMode) {
          if (general_data.legal_entity instanceof Array) {
            const entities = general_data.legal_entity.map(
              (item: any) => item.uuid,
            );
            form.setFieldsValue({ legal_entity: entities });
          } else {
            const entity = (general_data.legal_entity as any).uuid;
            form.setFieldsValue({ legal_entity: [entity] });
          }
        }

        if (legal_entity) {
          form.setFieldsValue({ legal_entity: [legal_entity] });
        }
      }
    } catch (e) {}
  }, [entityList, general_data.legal_entity]);

  useEffect(() => {
    if (isUpdateMode) {
      let entities = general_data.legal_entity.map((val: any) => {
        const result = entityList.find(
          (_entity: { title: any }) => _entity.title === val,
        );
        if (result) {
          return result.uuid;
        } else {
          return val;
        }
      });
      setOnUpdateSelectedEntityList(entities);
      entityCostCenterCheckbox &&
        entities.length > 0 &&
        dispatch(
          fetchEntityCostCenterList({
            legal_entity_uuids: entities,
          }) as any,
        );
    } else {
      const entity = selectedEntityList.map((val: any) => {
        const result = entityList.find(
          (_entity: { title: any }) => _entity.title === val,
        );
        if (result) {
          return result.uuid;
        } else {
          return val;
        }
      });
      entityCostCenterCheckbox &&
        selectedEntityList.length > 0 &&
        dispatch(
          fetchEntityCostCenterList({
            legal_entity_uuids: entity,
          }) as any,
        );
    }
  }, [selectedEntityList, entityCostCenterCheckbox, general_data.legal_entity]);

  useEffect(() => {
    if (isUpdateMode) {
      setEntityCostCenterCheckbox(
        general_data?.is_default_to_entity_cost_centre || false,
      );
    }
  }, [general_data]);

  useEffect(() => {
    onEntityCostCenterCheckboxClicked();
  }, []);

  const updateExpenseTypeEntityList = (value: any) => {
    setSelectedEntityList(value);
    form.setFieldsValue({
      legal_entity_uuid: value,
    });
  };

  const onEntityCostCenterCheckboxClicked = () => {
    const isEnable = form.getFieldValue('is_default_to_entity_cost_centre');
    setEntityCostCenterCheckbox(isEnable);
  };

  const onLegalEntityChange = (val: any) => {
    if (val.length === 0) {
      const isEnable = form.getFieldValue('is_default_to_entity_cost_centre');
      isEnable &&
        form.setFieldsValue({
          is_default_to_entity_cost_centre: false,
        });
    }
  };

  useEffect(() => {
    form.setFieldsValue({
      cost_centres_for_legal_entity: cost_centres_for_legal_entity,
    });
  }, [cost_centres_for_legal_entity]);

  return (
    <div
      ref={ref}
      className='configuration-form'
      data-test='configuration-form'
    >
      {/* <Skeleton
        paragraph={{ rows: 15 }}
        active={showLoader}
        loading={showLoader}
      > */}
      {showLoader ? <SkeletonItem type='Form' /> : null}
      <Form
        form={form}
        layout='horizontal'
        {...formLayout}
        colon={false}
        {...{ autoComplete: 'off' }}
        size='middle'
        scrollToFirstError={true}
        className={showLoader ? 'hide' : ''}
        initialValues={{
          is_allow_allowance_rate_enabled: false,
          is_default_to_entity_cost_centre: false,
        }}
        onValuesChange={(changedValues, _allValues) => {
          if (changedValues.hasOwnProperty('min_amount'))
            form.validateFields(['max_amount', 'warning_amount']);
          else if (changedValues.hasOwnProperty('max_amount'))
            form.validateFields(['warning_amount']);
        }}
      >
        <Row>
          <Col span={24}>
            <Row>
              <Col {...levelTwoSpan}>
                <div className='form-section only-div m-t-0'>
                  <Trans>Expense Type Details</Trans>
                </div>
                <Form.Item
                  validateTrigger='onBlur'
                  label={<Trans>Expense Category</Trans>}
                  name='category'
                  data-test='category'
                  className='category'
                  validateStatus={
                    backendError.hasOwnProperty('category')
                      ? 'error'
                      : 'validating'
                  }
                  help={
                    backendError.hasOwnProperty('category')
                      ? backendError.category[0]
                      : null
                  }
                  rules={[
                    {
                      validator: () =>
                        dropdownCustomValidator(
                          general_data.category,
                          'category',
                        ),
                    },
                  ]}
                  required
                >
                  <Select
                    allowClear
                    value={general_data.category}
                    defaultValue={general_data.category}
                    disabled={isUpdateMode}
                    onChange={handleCategoryChange}
                    style={widthFiftyPer}
                    showSearch
                    loading={loadingCategory}
                  >
                    {categoryList.map((o: IcategoryList, i: number) => {
                      return (
                        <Option key={i} value={o.title}>
                          {o.title}
                        </Option>
                      );
                    })}
                  </Select>
                </Form.Item>
                <Form.Item
                  validateTrigger='onBlur'
                  label={<Trans>Entity</Trans>}
                  name='legal_entity'
                  data-test='legal_entity'
                  className='entity'
                  validateStatus={
                    backendError.hasOwnProperty('legal_entity')
                      ? 'error'
                      : 'validating'
                  }
                  help={
                    backendError.hasOwnProperty('legal_entity')
                      ? backendError.legal_entity[0]
                      : null
                  }
                  rules={[
                    {
                      validator: () =>
                        dropdownCustomValidator(general_data, 'entity'),
                    },
                  ]}
                  required
                >
                  <Select
                    allowClear
                    showSearch
                    mode='multiple'
                    value={general_data.legal_entity}
                    defaultValue={general_data.legal_entity}
                    disabled={isUpdateMode}
                    maxTagCount={3}
                    onChange={(value: any) => {
                      let val = value;
                      if (value.includes('Select All')) {
                        val = entityList.map((o: IentityList) => o.title);
                      } else if (value.includes('Deselect All')) {
                        val = [];
                      }
                      dispatch(
                        updateFormDataInState('legal_entity', 'general', val),
                      );
                      // fetchExpensesOfLegalEntity();
                      onLegalEntityChange(val);
                      updateExpenseTypeEntityList(val);
                    }}
                    filterOption={(input: any, option: any) =>
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                    style={widthFiftyPer}
                    loading={loadingEntity}
                  >
                    {general_data.legal_entity.length === entityList.length ? (
                      <Option value='Deselect All' key='Deselect All'>
                        Deselect All
                      </Option>
                    ) : (
                      <Option value='Select All' key='Select All'>
                        Select All
                      </Option>
                    )}
                    {entityList.map((o: IentityList, i: number) => (
                      <Option value={o.title} key={`${o.title}_${i}}`}>
                        {o.title}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item
                  validateTrigger='onBlur'
                  label={<Trans>Title</Trans>}
                  className='title'
                  name='title'
                  data-test='title'
                  required
                  rules={[
                    () => ({
                      validator(_, value) {
                        if (value !== undefined) {
                          value = value?.trim();
                        }
                        if (!value || value === undefined) {
                          return Promise.reject(Errors.TITLE_REQUIRED);
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
                  validateStatus={
                    backendError.hasOwnProperty('title')
                      ? 'error'
                      : 'validating'
                  }
                  help={
                    backendError.hasOwnProperty('title')
                      ? backendError.title[0]
                      : null
                  }
                >
                  <Input
                    disabled={isUpdateMode}
                    value={general_data.title}
                    defaultValue={general_data.title}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      dispatch(
                        updateFormDataInState(
                          'title',
                          'general',
                          e.target.value,
                        ),
                      )
                    }
                    style={widthFiftyPer}
                  />
                </Form.Item>
                <Row align='middle' justify='space-between' gutter={24}>
                  <Col span={17}>
                    <Form.Item
                      validateTrigger='onBlur'
                      label='Code'
                      className='code'
                      name='code'
                      required
                      rules={[
                        () => ({
                          validator(_, value) {
                            if (value !== undefined) {
                              value = value?.trim();
                            }
                            if (!value || value === undefined) {
                              return Promise.reject(Errors.CODE_REQUIRED);
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
                      validateStatus={
                        backendError.hasOwnProperty('code')
                          ? 'error'
                          : 'validating'
                      }
                      help={
                        backendError.hasOwnProperty('code')
                          ? backendError.code[0]
                          : null
                      }
                    >
                      <Input
                        disabled={isUpdateMode}
                        value={general_data.code}
                        defaultValue={general_data.code}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          dispatch(
                            updateFormDataInState(
                              'code',
                              'general',
                              e.target.value,
                            ),
                          )
                        }
                        style={widthFiftyPer}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item
                      validateTrigger='onBlur'
                      className='is-active'
                      name='is_active'
                      label=' '
                      validateStatus={
                        backendError.hasOwnProperty('is_active')
                          ? 'error'
                          : 'validating'
                      }
                      help={
                        backendError.hasOwnProperty('is_active')
                          ? backendError.is_active[0]
                          : null
                      }
                    >
                      <Checkbox
                        disabled={isUpdateMode}
                        checked={general_data.is_active}
                        onChange={(value: any) =>
                          dispatch(
                            updateFormDataInState(
                              'is_active',
                              'general',
                              value.target.checked,
                            ),
                          )
                        }
                      >
                        <Trans>Is Active</Trans>
                      </Checkbox>
                    </Form.Item>
                  </Col>
                </Row>
                {!allowanceOptionVisibility ? (
                  <Form.Item
                    validateTrigger='onBlur'
                    label={<Trans>Allow claims on</Trans>}
                    name='allow_claims_on'
                    className='allow-claims-on'
                    validateStatus={
                      backendError.hasOwnProperty('allow_claims_on')
                        ? 'error'
                        : 'validating'
                    }
                    help={
                      backendError.hasOwnProperty('allow_claims_on')
                        ? backendError.allow_claims_on[0]
                        : null
                    }
                    rules={[
                      {
                        validator: () =>
                          dropdownCustomValidator(
                            general_data.allow_claims_on,
                            'value',
                          ),
                      },
                    ]}
                  >
                    <Select
                      allowClear
                      showSearch
                      value={general_data.allow_claims_on}
                      defaultValue={general_data.allow_claims_on}
                      onChange={(value: any) =>
                        dispatch(
                          updateFormDataInState(
                            'allow_claims_on',
                            'general',
                            value,
                          ),
                        )
                      }
                      style={widthFiftyPer}
                      loading={loadingAllowClaimsOn}
                    >
                      {allowClaimsOn.map((o: IallowClaimsOn, i: number) => (
                        <Option key={i} value={o.title}>
                          {o.title}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                ) : null}

                {!general_data.is_assign_using_rules && (
                  <>
                    <div className='form-section only-div'>
                      <Trans>Claims Amount Limit</Trans>
                    </div>
                    <Row gutter={innerRowGutter}>
                      <Col span={12}>
                        <Form.Item
                          validateTrigger='onBlur'
                          label={<Trans>Minimum Claim Amount</Trans>}
                          className='minimum-claim-amount'
                          name='min_amount'
                          validateStatus={
                            backendError.hasOwnProperty('min_amount')
                              ? 'error'
                              : 'validating'
                          }
                          help={
                            backendError.hasOwnProperty('min_amount')
                              ? backendError.min_amount[0]
                              : null
                          }
                          required
                          rules={[
                            () => ({
                              validator(_rule, _value) {
                                if (typeof _value === 'number') {
                                  if (_value > 0) {
                                    return Promise.resolve();
                                  } else {
                                    return Promise.reject(Errors.MINIMUM_VALUE);
                                  }
                                } else {
                                  return Promise.reject(
                                    Errors.MIN_AMOUNT_REQUIRED,
                                  );
                                }
                              },
                            }),
                          ]}
                        >
                          <InputNumber
                            min={0}
                            step={0.01}
                            precision={2}
                            maxLength={15}
                            defaultValue={Number(general_data.min_amount)}
                            value={Number(general_data.min_amount)}
                            style={widthFiftyPer}
                            onChange={(value: any) =>
                              dispatch(
                                updateFormDataInState(
                                  'min_amount',
                                  'general',
                                  value,
                                ),
                              )
                            }
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          validateTrigger='onClick'
                          label={<Trans>Maximum Claim Amount</Trans>}
                          className='maximum-claim-amount'
                          name='max_amount'
                          validateStatus={
                            backendError.hasOwnProperty('max_amount')
                              ? 'error'
                              : 'validating'
                          }
                          help={
                            backendError.hasOwnProperty('max_amount')
                              ? backendError.max_amount[0]
                              : null
                          }
                          rules={[
                            ({ getFieldValue }) => ({
                              validator(_rule, value) {
                                if (
                                  typeof value !== 'number' ||
                                  typeof getFieldValue('min_amount') !==
                                    'number'
                                ) {
                                  return Promise.resolve();
                                } else {
                                  if (getFieldValue('min_amount') < value) {
                                    return Promise.resolve();
                                  } else {
                                    return Promise.reject(
                                      Errors.MAXIMUM_VALUE_ERROR,
                                    );
                                  }
                                }
                              },
                            }),
                          ]}
                        >
                          <InputNumber
                            step={0.01}
                            precision={2}
                            maxLength={15}
                            defaultValue={Number(general_data.max_amount)}
                            style={widthFiftyPer}
                            value={Number(general_data.max_amount)}
                            onChange={(value: any) => {
                              value =
                                value && typeof value === 'string'
                                  ? parseInt(value)
                                  : value;
                              if (value !== undefined && value !== 0)
                                dispatch(
                                  updateFormDataInState(
                                    'max_amount',
                                    'general',
                                    value,
                                  ),
                                );
                            }}
                            onBlur={(e: any) => {
                              let value = e?.target?.value;
                              value =
                                value && typeof value === 'string'
                                  ? parseInt(value)
                                  : value;
                              if (value !== undefined && value !== 0)
                                dispatch(
                                  updateFormDataInState(
                                    'max_amount',
                                    'general',
                                    value,
                                  ),
                                );
                            }}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </>
                )}

                {!allowanceOptionVisibility ? (
                  <Form.Item
                    validateTrigger='onBlur'
                    className='maximum-claim-period custom-andatory form-section'
                    label={checkboxLabel}
                    name='is_setup_maximum_claim_amount_per_period'
                    rules={[
                      {
                        validator: (_rule, _value) => {
                          // return general_data.is_setup_maximum_claim_amount_per_period
                          return true
                            ? Promise.resolve()
                            : Promise.reject(
                                Errors.MAXIMUM_CLAIM_AMOUNT_CHECKBOX,
                              );
                        },
                      },
                    ]}
                  >
                    <Checkbox
                      className='custom-andatory-inner'
                      checked={
                        general_data.is_setup_maximum_claim_amount_per_period
                      }
                      onChange={(value: any) => {
                        dispatch(
                          updateFormDataInState(
                            'is_setup_maximum_claim_amount_per_period',
                            'general',
                            value.target.checked,
                          ),
                        );
                        if (!value.target.checked)
                          dispatch(
                            resetSetupMaximumClaimAmountPerPeriodSubOptions(),
                          );
                      }}
                    >
                      <Trans>Setup Maximum Claim Amount Per Period</Trans>
                    </Checkbox>
                  </Form.Item>
                ) : null}

                {general_data.is_setup_maximum_claim_amount_per_period ? (
                  <Row gutter={innerRowGutter}>
                    <Col span={12}>
                      <Form.Item
                        validateTrigger='onBlur'
                        label='Period'
                        name='period'
                        className='period'
                        validateStatus={
                          backendError.hasOwnProperty('period')
                            ? 'error'
                            : 'validating'
                        }
                        help={
                          backendError.hasOwnProperty('period')
                            ? backendError.period[0]
                            : null
                        }
                        rules={[
                          {
                            validator: () =>
                              dropdownCustomValidator(
                                general_data.period,
                                'period',
                              ),
                          },
                        ]}
                      >
                        <Select
                          loading={loadingMaximumClaimAmountPerPeriod}
                          allowClear
                          showSearch
                          value={general_data.period}
                          defaultValue={general_data.period}
                          onChange={(value: any) =>
                            dispatch(
                              updateFormDataInState('period', 'general', value),
                            )
                          }
                        >
                          {maximumClaimAmountPerPeriodDataList.map(
                            (
                              o: ImaximumClaimAmountPerPeriodData,
                              i: number,
                            ) => (
                              <Option key={i} value={o.title}>
                                {o.title}
                              </Option>
                            ),
                          )}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        validateTrigger='onBlur'
                        label={<Trans>Amount</Trans>}
                        name='amount_per_period'
                        className='maximum-claim-amount-per-period'
                        validateStatus={
                          backendError.hasOwnProperty('amount_per_period')
                            ? 'error'
                            : 'validating'
                        }
                        help={
                          backendError.hasOwnProperty('amount_per_period')
                            ? backendError.amount_per_period[0]
                            : null
                        }
                      >
                        <InputNumber
                          min={0}
                          step={1}
                          value={general_data.amount_per_period}
                          precision={2}
                          maxLength={15}
                          defaultValue={general_data.amount_per_period}
                          style={{ width: '100%' }}
                          onChange={(value: any) =>
                            dispatch(
                              updateFormDataInState(
                                'amount_per_period',
                                'general',
                                value,
                              ),
                            )
                          }
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                ) : null}

                <Form.Item
                  validateTrigger='onBlur'
                  className='set-warning-amount form-section'
                  name='is_set_warning_amount'
                  label={checkboxLabel}
                  validateStatus={
                    backendError.hasOwnProperty('is_set_warning_amount')
                      ? 'error'
                      : 'validating'
                  }
                  help={
                    backendError.hasOwnProperty('is_set_warning_amount')
                      ? backendError.is_set_warning_amount[0]
                      : null
                  }
                >
                  <Checkbox
                    checked={general_data.is_set_warning_amount}
                    onChange={(value: any) => {
                      dispatch(
                        updateFormDataInState(
                          'is_set_warning_amount',
                          'general',
                          value.target.checked,
                        ),
                      );
                      if (!value.target.checked)
                        dispatch(resetSetWarningAmountSubOptions());
                    }}
                  >
                    <Trans>Set Warning Amount</Trans>
                  </Checkbox>
                </Form.Item>
                {general_data.is_set_warning_amount ? (
                  <Row gutter={innerRowGutter}>
                    <Col span={12}>
                      <Form.Item
                        validateTrigger='onBlur'
                        label={<Trans>Warning Amount</Trans>}
                        name='warning_amount'
                        className='warning-amount'
                        validateStatus={
                          backendError.hasOwnProperty('warning_amount')
                            ? 'error'
                            : 'validating'
                        }
                        help={
                          backendError.hasOwnProperty('warning_amount')
                            ? backendError.warning_amount[0]
                            : null
                        }
                        rules={[
                          () => ({
                            validator(_rule, value) {
                              if (typeof value === 'number') {
                                if (
                                  typeof general_data?.max_amount === 'number'
                                ) {
                                  if (value > general_data?.max_amount) {
                                    return Promise.reject(
                                      Errors.WARNING_AMOUNT_LESSER_THAN_MAXIMUM_VALUE,
                                    );
                                  }
                                }
                                if (
                                  typeof general_data?.min_amount === 'number'
                                ) {
                                  if (value < general_data?.min_amount) {
                                    return Promise.reject(
                                      Errors.WARNING_AMOUNT_HIGHER_THAN_MINIMUM_VALUE,
                                    );
                                  }
                                }
                              }
                              return Promise.resolve();
                            },
                          }),
                        ]}
                      >
                        <InputNumber
                          min={0}
                          step={0.01}
                          precision={2}
                          maxLength={15}
                          value={general_data.warning_amount}
                          defaultValue={general_data.warning_amount}
                          style={{ width: '100%' }}
                          onChange={(value: any) =>
                            dispatch(
                              updateFormDataInState(
                                'warning_amount',
                                'general',
                                value,
                              ),
                            )
                          }
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        validateTrigger='onBlur'
                        label={<Trans>Warning Message</Trans>}
                        name='warning_message'
                        className='warning-message'
                        validateStatus={
                          backendError.hasOwnProperty('warning_message')
                            ? 'error'
                            : 'validating'
                        }
                        help={
                          backendError.hasOwnProperty('warning_message')
                            ? backendError.warning_message[0]
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
                                  Errors.WARNING_MESSAGE_REQUIRED,
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
                        <Input
                          // value={general_data.warning_message}
                          // defaultValue={general_data.warning_message}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            dispatch(
                              updateFormDataInState(
                                'warning_message',
                                'general',
                                e.target.value,
                              ),
                            )
                          }
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                ) : null}
              </Col>
            </Row>

            {allowanceOptionVisibility ? (
              <Form.Item
                validateTrigger='onBlur'
                className='can-attach-receipt form-section'
                name='is_allow_allowance_rate_enabled'
                label={checkboxLabel}
              >
                <Checkbox
                  checked={allowance.is_allow_allowance_rate_enabled}
                  name='is_allow_allowance_rate_enabled'
                  disabled={general_data.legal_entity.length === 0}
                  onChange={(value: any) => {
                    dispatch(
                      updateFormDataInState(
                        'is_allow_allowance_rate_enabled',
                        'allowance',
                        value.target.checked,
                      ),
                    );
                    onAllowAllowance(value.target.checked);
                  }}
                >
                  <Trans>Allowance Rate</Trans>
                </Checkbox>
              </Form.Item>
            ) : null}
            {allowance.is_allow_allowance_rate_enabled && (
              <>
                <Form.Item
                  validateTrigger='onBlur'
                  name='expense_type_allowance_rates'
                  data-test='expense_type_allowance_rates'
                  // rules={[
                  //   {
                  //     required: true,
                  //     message: Errors.ALLOWANCE_RATE_REQUIRED,
                  //   },
                  // ]}
                  required
                  rules={[
                    () => ({
                      validator(_, value) {
                        if (
                          !(allowance?.expense_type_allowance_rates?.length > 0)
                        ) {
                          return Promise.reject(Errors.ALLOWANCE_RATE_REQUIRED);
                        }
                        return Promise.resolve();
                      },
                    }),
                  ]}
                >
                  <div className='allowance-search'>
                    <Select
                      allowClear
                      mode='multiple'
                      value={allowance.expense_type_allowance_rates}
                      defaultValue={allowance.expense_type_allowance_rates}
                      open={open}
                      onDropdownVisibleChange={visible => setOpen(visible)}
                      maxTagCount={3}
                      onSearch={onSearch}
                      onBlur={() => {
                        setSearchEnable(false);
                        setSearchedAllowanceRateList([]);
                        setSearchedSelectedAllowanceRateList([]);
                      }}
                      filterOption={(input, option) =>
                        (option?.children ?? '').toLowerCase() ===
                        input.toLowerCase()
                      }
                      dropdownRender={menu => (
                        <div>
                          {searchEnable && (
                            <>
                              {searchedSelectedAllowanceRateList.length ===
                              searchedAllowanceRateList.length ? (
                                <div
                                  className='search-allowance-rate-select'
                                  onMouseDown={e => {
                                    e.preventDefault();
                                  }}
                                  onClick={(e: any) => {
                                    e.preventDefault();
                                    setOpen(false);
                                    onClickedDeselectOptionForAllowanceRate();
                                  }}
                                >
                                  Deselect All
                                </div>
                              ) : (
                                <div
                                  className='search-allowance-rate-select'
                                  onMouseDown={e => {
                                    e.preventDefault();
                                  }}
                                  onClick={(e: any) => {
                                    e.preventDefault();
                                    setOpen(false);
                                    onClickedSelectOptionForAllowanceRate();
                                  }}
                                >
                                  Select All
                                </div>
                              )}
                            </>
                          )}
                          {menu}
                        </div>
                      )}
                      onChange={(value: any) => {
                        onchangeAllowanceSearch(value);
                      }}
                      loading={loadingEntity}
                    >
                      {SelectAllOptions()}

                      {allowanceExpenseTypes.map((o: any) => (
                        <Option value={o.id} key={`${o.id}`}>
                          {o.title}
                        </Option>
                      ))}
                    </Select>
                  </div>
                </Form.Item>

                {/* </Form> */}
              </>
            )}

            <Row>
              <Col {...levelOneSpan}>
                <Form.Item
                  validateTrigger='onBlur'
                  className='can-attach-receipt form-section'
                  name='can_attach_receipts'
                  label={checkboxLabel}
                  validateStatus={
                    backendError.hasOwnProperty('can_attach_receipts')
                      ? 'error'
                      : 'validating'
                  }
                  help={
                    backendError.hasOwnProperty('can_attach_receipts')
                      ? backendError.can_attach_receipts[0]
                      : null
                  }
                >
                  <Checkbox
                    checked={general_data.can_attach_receipts}
                    onChange={(value: any) => {
                      dispatch(
                        updateFormDataInState(
                          'can_attach_receipts',
                          'general',
                          value.target.checked,
                        ),
                      );
                      if (!value.target.checked)
                        dispatch(resetCanAttachReceiptSubOptions());
                    }}
                  >
                    <Trans>Can Attach Receipt</Trans>
                  </Checkbox>
                </Form.Item>
                {general_data.can_attach_receipts &&
                !allowanceOptionVisibility ? (
                  <Form.Item
                    validateTrigger='onBlur'
                    className='is-receipt-mandatory'
                    name='is_receipt_mandatory'
                    label={innerCheckboxLabel}
                    validateStatus={
                      backendError.hasOwnProperty('is_receipt_mandatory')
                        ? 'error'
                        : 'validating'
                    }
                    help={
                      backendError.hasOwnProperty('is_receipt_mandatory')
                        ? backendError.is_receipt_mandatory[0]
                        : null
                    }
                  >
                    <Checkbox
                      checked={general_data.is_receipt_mandatory}
                      onChange={(value: any) => {
                        dispatch(
                          updateFormDataInState(
                            'is_receipt_mandatory',
                            'general',
                            value.target.checked,
                          ),
                        );
                        if (!value.target.checked)
                          dispatch(resetIsReceiptMandatorySubOptions());
                      }}
                    >
                      <Trans>Is Receipt Mandatory</Trans>
                    </Checkbox>
                  </Form.Item>
                ) : null}

                {general_data.is_receipt_mandatory ? (
                  <>
                    <Form.Item
                      validateTrigger='onBlur'
                      className='display-no-receipt-attached-field'
                      name='is_display_no_receipt_attached_field'
                      label={innerCheckboxLabel}
                      validateStatus={
                        backendError.hasOwnProperty(
                          'is_display_no_receipt_attached_field',
                        )
                          ? 'error'
                          : 'validating'
                      }
                      help={
                        backendError.hasOwnProperty(
                          'is_display_no_receipt_attached_field',
                        )
                          ? backendError.is_display_no_receipt_attached_field[0]
                          : null
                      }
                    >
                      <Checkbox
                        checked={
                          general_data.is_display_no_receipt_attached_field
                        }
                        onChange={(value: any) => {
                          dispatch(
                            updateFormDataInState(
                              'is_display_no_receipt_attached_field',
                              'general',
                              value.target.checked,
                            ),
                          );
                          if (!value.target.checked) {
                            dispatch(
                              updateFormDataInState(
                                'is_remark_for_no_receipt_mandatory',
                                'general',
                                false,
                              ),
                            );
                          }
                        }}
                      >
                        <Trans>Display No Receipt Attached Field</Trans>
                      </Checkbox>
                    </Form.Item>
                  </>
                ) : null}
                {general_data.is_display_no_receipt_attached_field ? (
                  <>
                    <Form.Item
                      validateTrigger='onBlur'
                      className='remark-for-no-receipt-mandatory'
                      name='is_remark_for_no_receipt_mandatory'
                      label={innerCheckboxLabel}
                      validateStatus={
                        backendError.hasOwnProperty(
                          'is_remark_for_no_receipt_mandatory',
                        )
                          ? 'error'
                          : 'validating'
                      }
                      help={
                        backendError.hasOwnProperty(
                          'is_remark_for_no_receipt_mandatory',
                        )
                          ? backendError.is_remark_for_no_receipt_mandatory[0]
                          : null
                      }
                    >
                      <Checkbox
                        checked={
                          general_data.is_remark_for_no_receipt_mandatory
                        }
                        onChange={(value: any) =>
                          dispatch(
                            updateFormDataInState(
                              'is_remark_for_no_receipt_mandatory',
                              'general',
                              value.target.checked,
                            ),
                          )
                        }
                      >
                        <Trans>Remark For No Receipt Mandatory</Trans>
                      </Checkbox>
                    </Form.Item>
                  </>
                ) : null}
                {allowanceOptionVisibility && (
                  <Form.Item
                    validateTrigger='onChange'
                    className='is-allow-updating-tax-amount form-section'
                    name='is_allow_updating_no_of_days'
                    label={checkboxLabel}
                    validateStatus={
                      backendError.hasOwnProperty(
                        'is_allow_updating_no_of_days',
                      )
                        ? 'error'
                        : 'validating'
                    }
                    help={
                      backendError.hasOwnProperty(
                        'is_allow_updating_no_of_days',
                      )
                        ? backendError.is_allow_updating_no_of_days[0]
                        : null
                    }
                  >
                    <Checkbox
                      checked={allowance.is_allow_updating_no_of_days}
                      onChange={(value: any) => {
                        dispatch(
                          updateFormDataInState(
                            'is_allow_updating_no_of_days',
                            'allowance',
                            value.target.checked,
                          ),
                        );
                      }}
                    >
                      <Trans>Allow Updating No Of Days</Trans>
                    </Checkbox>
                  </Form.Item>
                )}
                <Form.Item
                  validateTrigger='onBlur'
                  className='allow-remark form-section'
                  name='is_allow_purpose'
                  label={checkboxLabel}
                  validateStatus={
                    backendError.hasOwnProperty('is_allow_purpose')
                      ? 'error'
                      : 'validating'
                  }
                  help={
                    backendError.hasOwnProperty('is_allow_purpose')
                      ? backendError.is_allow_purpose[0]
                      : null
                  }
                >
                  <Checkbox
                    checked={general_data.is_allow_purpose}
                    onChange={(value: any) => {
                      dispatch(
                        updateFormDataInState(
                          'is_allow_purpose',
                          'general',
                          value.target.checked,
                        ),
                      );
                      if (!value.target.checked)
                        dispatch(resetAllowRemarkSubOptions());
                    }}
                  >
                    <Trans>Allow Purpose</Trans>
                  </Checkbox>
                </Form.Item>
                {general_data.is_allow_purpose ? (
                  <Form.Item
                    validateTrigger='onBlur'
                    className='is-remark-mandatory'
                    name='is_purpose_mandatory'
                    label={innerCheckboxLabel}
                    validateStatus={
                      backendError.hasOwnProperty('is_purpose_mandatory')
                        ? 'error'
                        : 'validating'
                    }
                    help={
                      backendError.hasOwnProperty('is_purpose_mandatory')
                        ? backendError.is_purpose_mandatory[0]
                        : null
                    }
                  >
                    <Checkbox
                      checked={general_data.is_purpose_mandatory}
                      onChange={(value: any) =>
                        dispatch(
                          updateFormDataInState(
                            'is_purpose_mandatory',
                            'general',
                            value.target.checked,
                          ),
                        )
                      }
                    >
                      <Trans>Is Purpose Mandatory</Trans>
                    </Checkbox>
                  </Form.Item>
                ) : null}

                <Form.Item
                  validateTrigger='onBlur'
                  className='allow-forex form-section'
                  name='is_allow_forex'
                  label={checkboxLabel}
                  validateStatus={
                    backendError.hasOwnProperty('is_allow_forex')
                      ? 'error'
                      : 'validating'
                  }
                  help={
                    backendError.hasOwnProperty('is_allow_forex')
                      ? backendError.is_allow_forex[0]
                      : null
                  }
                >
                  <Checkbox
                    checked={general_data.is_allow_forex}
                    onChange={(value: any) => {
                      dispatch(
                        updateFormDataInState(
                          'is_allow_forex',
                          'general',
                          value.target.checked,
                        ),
                      );
                      if (!value.target.checked)
                        dispatch(resetAllowForexSubOptions());
                    }}
                  >
                    <Trans>Allow Forex</Trans>
                  </Checkbox>
                </Form.Item>
                {general_data.is_allow_forex ? (
                  <>
                    <Form.Item
                      validateTrigger='onBlur'
                      className='is-forex-rate-editable-by-employee '
                      name='is_forex_rate_editable_by_employee'
                      label={innerCheckboxLabel}
                      validateStatus={
                        backendError.hasOwnProperty(
                          'is_forex_rate_editable_by_employee',
                        )
                          ? 'error'
                          : 'validating'
                      }
                      help={
                        backendError.hasOwnProperty(
                          'is_forex_rate_editable_by_employee',
                        )
                          ? backendError.is_forex_rate_editable_by_employee[0]
                          : null
                      }
                    >
                      <Checkbox
                        checked={
                          general_data.is_forex_rate_editable_by_employee
                        }
                        onChange={(value: any) =>
                          dispatch(
                            updateFormDataInState(
                              'is_forex_rate_editable_by_employee',
                              'general',
                              value.target.checked,
                            ),
                          )
                        }
                      >
                        <Trans>Is Forex Rate Editable By Employee</Trans>
                      </Checkbox>
                    </Form.Item>
                    {general_data.is_forex_rate_editable_by_employee ? (
                      <Form.Item
                        // validateTrigger='onBlur'
                        label='Deviation Percentage'
                        name='forex_deviation_percentage'
                        className='deviation-percentage '
                        validateStatus={
                          backendError.hasOwnProperty(
                            'forex_deviation_percentage',
                          )
                            ? 'error'
                            : 'validating'
                        }
                        help={
                          backendError.hasOwnProperty(
                            'forex_deviation_percentage',
                          )
                            ? backendError.forex_deviation_percentage[0]
                            : null
                        }
                        rules={[
                          () => ({
                            validator(_rule, value) {
                              if (typeof Number(value) !== 'number') {
                                return Promise.reject(
                                  Errors.DEVIATION_PERCENTAGE_REQUIRED,
                                );
                              } else {
                                if (Number(value) < 0.5) {
                                  return Promise.reject(
                                    Errors.DEVIATION_PERCENTAGE_MIN,
                                  );
                                }
                              }
                              return Promise.resolve();
                            },
                          }),
                        ]}
                      >
                        <InputNumber
                          min={0}
                          max={100}
                          step={0.01}
                          precision={2}
                          value={
                            general_data.forex_deviation_percentage || undefined
                          }
                          defaultValue={
                            general_data.forex_deviation_percentage || undefined
                          }
                          style={{ width: '100%' }}
                          formatter={value => (value ? `${value}%` : ``)}
                          parser={value => Number(value!.replace('%', ''))}
                          onChange={(value: any) =>
                            dispatch(
                              updateFormDataInState(
                                'forex_deviation_percentage',
                                'general',
                                value,
                              ),
                            )
                          }
                        />
                      </Form.Item>
                    ) : null}
                  </>
                ) : null}

                <Form.Item
                  validateTrigger='onBlur'
                  className='allow-backdated-claims form-section'
                  name='is_allow_backdated_claims'
                  label={checkboxLabel}
                  validateStatus={
                    backendError.hasOwnProperty('is_allow_backdated_claims')
                      ? 'error'
                      : 'validating'
                  }
                  help={
                    backendError.hasOwnProperty('is_allow_backdated_claims')
                      ? backendError.is_allow_backdated_claims[0]
                      : null
                  }
                >
                  <Checkbox
                    checked={general_data.is_allow_backdated_claims}
                    onChange={(value: any) => {
                      dispatch(
                        updateFormDataInState(
                          'is_allow_backdated_claims',
                          'general',
                          value.target.checked,
                        ),
                      );
                      if (!value.target.checked)
                        dispatch(resetAllowBackdatedClaimsSubOptions());
                    }}
                  >
                    <Trans>Allow Backdated Claims</Trans>
                  </Checkbox>
                </Form.Item>
                {general_data.is_allow_backdated_claims ? (
                  <Form.Item
                    validateTrigger='onBlur'
                    className='allow-backdated-claims '
                    name='backdated_claim_period_in_days'
                    label={<Trans>Backdated Claim Period In Days</Trans>}
                    validateStatus={
                      backendError.hasOwnProperty(
                        'backdated_claim_period_in_days',
                      )
                        ? 'error'
                        : 'validating'
                    }
                    help={
                      backendError.hasOwnProperty(
                        'backdated_claim_period_in_days',
                      )
                        ? backendError.backdated_claim_period_in_days[0]
                        : null
                    }
                    rules={[
                      {
                        required: true,
                        message: Errors.BACKDATED_CLAIM_PERIOD_IN_DAYS_REQUIRED,
                      },
                    ]}
                  >
                    <InputNumber
                      min={0}
                      max={365}
                      step={1}
                      precision={0}
                      value={general_data.backdated_claim_period_in_days}
                      defaultValue={general_data.backdated_claim_period_in_days}
                      style={{ width: '100%' }}
                      onChange={(value: any) =>
                        dispatch(
                          updateFormDataInState(
                            'backdated_claim_period_in_days',
                            'general',
                            value,
                          ),
                        )
                      }
                    />
                  </Form.Item>
                ) : null}
                <Form.Item
                  validateTrigger='onBlur'
                  className='resubmission-period-after-rejection-in-days'
                  name='resubmission_period_after_rejection_in_days'
                  label={
                    <Trans>Resubmission Period After Rejection In Days</Trans>
                  }
                  validateStatus={
                    backendError.hasOwnProperty(
                      'resubmission_period_after_rejection_in_days',
                    )
                      ? 'error'
                      : 'validating'
                  }
                  help={
                    backendError.hasOwnProperty(
                      'resubmission_period_after_rejection_in_days',
                    )
                      ? backendError
                          .resubmission_period_after_rejection_in_days[0]
                      : null
                  }
                  rules={[
                    {
                      required: true,
                      message:
                        Errors.RESUBMISSION_PERIOD_AFTER_REJECTION_IN_DAYS_REQUIRED,
                    },
                  ]}
                >
                  <InputNumber
                    min={0}
                    max={365}
                    step={1}
                    precision={0}
                    value={
                      general_data.resubmission_period_after_rejection_in_days
                    }
                    defaultValue={
                      general_data.resubmission_period_after_rejection_in_days
                    }
                    style={{ width: '100%' }}
                    onChange={(value: any) =>
                      dispatch(
                        updateFormDataInState(
                          'resubmission_period_after_rejection_in_days',
                          'general',
                          value,
                        ),
                      )
                    }
                  />
                </Form.Item>
                <Form.Item
                  validateTrigger='onBlur'
                  label={<Trans>Tax Percentage As Of Date</Trans>}
                  name='tax_percentage_as_of_date'
                  className='tax-percentage-as-of-date '
                  validateStatus={
                    backendError.hasOwnProperty('tax_percentage_as_of_date')
                      ? 'error'
                      : 'validating'
                  }
                  help={
                    backendError.hasOwnProperty('tax_percentage_as_of_date')
                      ? backendError.tax_percentage_as_of_date[0]
                      : null
                  }
                  rules={[
                    {
                      required: true,
                      message: Errors.TAX_PERCENTAGE_AS_OF_DATE_REQUIRED,
                    },
                  ]}
                >
                  <DatePicker
                    allowClear
                    style={widthFiftyPer}
                    format='DD/MM/YYYY'
                    value={
                      general_data.tax_percentage_as_of_date
                        ? moment(
                            general_data.tax_percentage_as_of_date,
                            'DD/MM/YYYY',
                          )
                        : undefined
                    }
                    defaultValue={
                      general_data.tax_percentage_as_of_date
                        ? moment(
                            general_data.tax_percentage_as_of_date,
                            'DD/MM/YYYY',
                          )
                        : undefined
                    }
                    onChange={(value: any) => {
                      dispatch(
                        updateFormDataInState(
                          'tax_percentage_as_of_date',
                          'general',
                          value || null,
                        ),
                      );
                    }}
                  />
                </Form.Item>
                <Form.Item
                  validateTrigger='onBlur'
                  label={
                    <div className='custom-label'>
                      <span>
                        <Trans>Tax Percentage</Trans>
                      </span>
                      {isUpdateMode ? (
                        <Button
                          className='previous-rates-btn'
                          type='link'
                          onClick={showPreviousRates.bind(
                            null,
                            'tax_Percentages',
                          )}
                        >
                          <span className='underline-text'>
                            <Trans>Previous Tax Rates</Trans>
                          </span>
                        </Button>
                      ) : null}
                    </div>
                  }
                  name='tax_percentages'
                  className='tax-percentage '
                  validateStatus={
                    backendError.hasOwnProperty('tax_percentages')
                      ? 'error'
                      : 'validating'
                  }
                  help={
                    backendError.hasOwnProperty('tax_percentages')
                      ? backendError.tax_percentages[0]
                      : null
                  }
                  rules={[
                    {
                      required: general_data.tax_percentage_as_of_date
                        ? true
                        : false,
                      message: Errors.TAX_PERCENTAGE_REQUIRED,
                    },
                  ]}
                >
                  <InputNumber
                    min={0}
                    max={100}
                    step={0.01}
                    precision={2}
                    value={general_data.tax_percentages}
                    defaultValue={general_data.tax_percentages}
                    style={{ width: '100%' }}
                    formatter={value => (value ? `${value}%` : ``)}
                    parser={value => Number(value!.replace('%', ''))}
                    onChange={(value: any) =>
                      dispatch(
                        updateFormDataInState(
                          'tax_percentages',
                          'general',
                          value,
                        ),
                      )
                    }
                  />
                </Form.Item>

                <Form.Item
                  validateTrigger='onChange'
                  className='is-allow-updating-tax-amount form-section'
                  name='is_allow_updating_tax_amount'
                  label={checkboxLabel}
                  validateStatus={
                    backendError.hasOwnProperty('is_allow_updating_tax_amount')
                      ? 'error'
                      : 'validating'
                  }
                  help={
                    backendError.hasOwnProperty('is_allow_updating_tax_amount')
                      ? backendError.is_allow_updating_tax_amount[0]
                      : null
                  }
                  rules={[
                    () => ({
                      validator(_rule, value) {
                        if (!value) {
                          if (!general_data.is_auto_populate_tax_amount) {
                            setTimeout(() => {
                              message.error(
                                Errors.NO_TAX_AUTO_POPUPATE_AND_ALLOW_UPDATE,
                                2,
                                () => {
                                  dispatch(
                                    updateFormDataInState(
                                      'is_auto_populate_tax_amount',
                                      'general',
                                      true,
                                    ),
                                  );
                                },
                              );
                            }, 100);
                          }
                        }
                        return Promise.resolve();
                      },
                    }),
                  ]}
                  valuePropName='checked'
                >
                  <Checkbox
                    checked={general_data.is_allow_updating_tax_amount}
                    onChange={(value: any) => {
                      dispatch(
                        updateFormDataInState(
                          'is_allow_updating_tax_amount',
                          'general',
                          value.target.checked,
                        ),
                      );
                    }}
                  >
                    <Trans>Allow Updating Tax Amount</Trans>
                  </Checkbox>
                </Form.Item>

                <Form.Item
                  validateTrigger='onChange'
                  className='is-auto-populate-tax-amount form-section'
                  name='is_auto_populate_tax_amount'
                  label={innerCheckboxLabel}
                  validateStatus={
                    backendError.hasOwnProperty('is_auto_populate_tax_amount')
                      ? 'error'
                      : 'validating'
                  }
                  help={
                    backendError.hasOwnProperty('is_auto_populate_tax_amount')
                      ? backendError.is_auto_populate_tax_amount[0]
                      : null
                  }
                  rules={[
                    () => ({
                      validator(_rule, value) {
                        if (!value) {
                          if (!general_data.is_allow_updating_tax_amount) {
                            setTimeout(() => {
                              message.error(
                                Errors.NO_TAX_AUTO_POPUPATE_AND_ALLOW_UPDATE,
                                2,
                                () => {
                                  dispatch(
                                    updateFormDataInState(
                                      'is_auto_populate_tax_amount',
                                      'general',
                                      true,
                                    ),
                                  );
                                },
                              );
                            }, 100);
                          }
                        }
                        return Promise.resolve();
                      },
                    }),
                  ]}
                  valuePropName='checked'
                >
                  <Checkbox
                    checked={general_data.is_auto_populate_tax_amount}
                    onChange={(value: any) =>
                      dispatch(
                        updateFormDataInState(
                          'is_auto_populate_tax_amount',
                          'general',
                          value.target.checked,
                        ),
                      )
                    }
                  >
                    <Trans>Auto Populate Tax Amount</Trans>
                  </Checkbox>
                </Form.Item>

                <Form.Item
                  validateTrigger='onBlur'
                  className='allow-charging-to-cost-centres form-section'
                  name='is_allow_charging_to_cost_centres'
                  label={checkboxLabel}
                  validateStatus={
                    backendError.hasOwnProperty(
                      'is_allow_charging_to_cost_centres',
                    )
                      ? 'error'
                      : 'validating'
                  }
                  help={
                    backendError.hasOwnProperty(
                      'is_allow_charging_to_cost_centres',
                    )
                      ? backendError.is_allow_charging_to_cost_centres[0]
                      : null
                  }
                >
                  <Checkbox
                    checked={general_data.is_allow_charging_to_cost_centres}
                    onChange={(value: any) => {
                      dispatch(
                        updateFormDataInState(
                          'is_allow_charging_to_cost_centres',
                          'general',
                          value.target.checked,
                        ),
                      );
                      if (!value.target.checked)
                        dispatch(resetAllowChargingToCostCentresSubOptions());
                    }}
                  >
                    <Trans>Allow Charging To Cost Centres</Trans>
                  </Checkbox>
                </Form.Item>
                {general_data.is_allow_charging_to_cost_centres ? (
                  <>
                    {!general_data.is_employee_cost_centre_readonly && (
                      <Form.Item
                        validateTrigger='onBlur'
                        className='is_default_to_entity_cost_centre'
                        name='is_default_to_entity_cost_centre'
                        validateStatus={
                          backendError.hasOwnProperty(
                            'is_default_to_entity_cost_centre',
                          )
                            ? 'error'
                            : 'validating'
                        }
                        help={
                          backendError.hasOwnProperty(
                            'is_default_to_entity_cost_centre',
                          )
                            ? backendError.is_default_to_entity_cost_centre[0]
                            : null
                        }
                      >
                        <div>
                          <CheckboxItem
                            label={<Trans>Custom Cost Center</Trans>}
                            name='is_default_to_entity_cost_centre'
                            onChange={(value: any) => {
                              onEntityCostCenterCheckboxClicked();
                              form.setFieldsValue({ cost_centres: [] });
                              dispatch(
                                updateFormDataInState(
                                  'is_default_to_entity_cost_centre',
                                  'general',
                                  value,
                                ),
                              );
                            }}
                            disabled={
                              onUpdateSelectedEntityList.length > 0 ||
                              selectedEntityList.length > 0
                                ? false
                                : true
                            }
                          />
                        </div>
                        {form.getFieldValue(
                          'is_default_to_entity_cost_centre',
                        ) && (
                          <div className='custom-cost-center'>
                            <Card title='Entity wise Cost Center' bordered>
                              {entityCostCenterLoader ? (
                                <Loader loadingName='Fetching Cost Center' />
                              ) : (
                                <Form.List name='cost_centres_for_legal_entity'>
                                  {fields => {
                                    return (
                                      <>
                                        {fields.map(field => {
                                          return (
                                            <Row
                                              gutter={[16, 16]}
                                              className='upto-distance'
                                              key={field.fieldKey}
                                            >
                                              <Col span={11}>
                                                <Form.Item
                                                  {...field}
                                                  name={[
                                                    field.name,
                                                    'legal_entity',
                                                  ]}
                                                  fieldKey={
                                                    [
                                                      field.fieldKey,
                                                      'legal_entity',
                                                    ] as any
                                                  }
                                                  label='Entity'
                                                  required
                                                >
                                                  <Input
                                                    disabled={true}
                                                    type='text'
                                                  />
                                                </Form.Item>
                                              </Col>
                                              <Col span={11}>
                                                <Form.Item
                                                  {...field}
                                                  name={[
                                                    field.name,
                                                    'cost_centre',
                                                  ]}
                                                  fieldKey={
                                                    [
                                                      field.fieldKey,
                                                      'cost_centre',
                                                    ] as any
                                                  }
                                                  label='Cost Center'
                                                  required
                                                  rules={[
                                                    {
                                                      required: true,
                                                      message:
                                                        'Cost Centre is required',
                                                    },
                                                  ]}
                                                >
                                                  <Select
                                                    showSearch={true}
                                                    filterOption={(
                                                      input: any,
                                                      option: any,
                                                    ) =>
                                                      option.children
                                                        .toLowerCase()
                                                        .indexOf(
                                                          input.toLowerCase(),
                                                        ) >= 0
                                                    }
                                                    onChange={(value: any) => {
                                                      dispatch(
                                                        updateCostCenterForEntity(
                                                          value,
                                                          field.fieldKey,
                                                          isUpdateMode,
                                                        ),
                                                      );
                                                    }}
                                                  >
                                                    {entityCostCenterList[
                                                      field.fieldKey
                                                    ]?.cost_centres.map(
                                                      (o: any) => (
                                                        <Option
                                                          key={o.id}
                                                          value={o.cc_uuid}
                                                        >
                                                          {o.title}
                                                        </Option>
                                                      ),
                                                    )}
                                                  </Select>
                                                </Form.Item>
                                              </Col>
                                            </Row>
                                          );
                                        })}
                                      </>
                                    );
                                  }}
                                </Form.List>
                              )}
                            </Card>
                          </div>
                        )}
                      </Form.Item>
                    )}

                    {!general_data.is_default_to_entity_cost_centre && (
                      <Form.Item
                        validateTrigger='onBlur'
                        className='is-employee-cost-centre-readonly'
                        name='is_employee_cost_centre_readonly'
                        label={checkboxLabel}
                        validateStatus={
                          backendError.hasOwnProperty(
                            'is_employee_cost_centre_readonly',
                          )
                            ? 'error'
                            : 'validating'
                        }
                        help={
                          backendError.hasOwnProperty(
                            'is_employee_cost_centre_readonly',
                          )
                            ? backendError.is_employee_cost_centre_readonly[0]
                            : null
                        }
                      >
                        <Checkbox
                          checked={
                            general_data.is_employee_cost_centre_readonly
                          }
                          onChange={(value: any) => {
                            dispatch(
                              updateFormDataInState(
                                'is_employee_cost_centre_readonly',
                                'general',
                                value.target.checked,
                              ),
                            );
                            if (value.target.checked) {
                              dispatch(
                                updateFormDataInState(
                                  'is_allow_overseas_cost_centres',
                                  'general',
                                  false,
                                ),
                              );
                              dispatch(
                                updateFormDataInState(
                                  'is_allow_internal_order_cost_centres',
                                  'general',
                                  false,
                                ),
                              );
                              dispatch(
                                updateFormDataInState(
                                  'is_allow_3rd_party_vendor',
                                  'general',
                                  false,
                                ),
                              );
                              dispatch(resetOverseasAndLocalThresholdAmount());
                            }
                          }}
                        >
                          <Trans>Default To Employee Cost Centre</Trans>
                        </Checkbox>
                      </Form.Item>
                    )}

                    {!general_data.is_default_to_entity_cost_centre &&
                      !general_data.is_employee_cost_centre_readonly && (
                        <Form.Item
                          validateTrigger='onBlur'
                          label={
                            <Trans>
                              Minimum Amount To Allow Any Local Cost Centre
                            </Trans>
                          }
                          name='local_cc_threshold_amount'
                          className='local-cc-threshold-amount'
                          validateStatus={
                            backendError.hasOwnProperty(
                              'local_cc_threshold_amount',
                            )
                              ? 'error'
                              : 'validating'
                          }
                          help={
                            backendError.hasOwnProperty(
                              'local_cc_threshold_amount',
                            )
                              ? backendError.local_cc_threshold_amount[0]
                              : null
                          }
                          required={false}
                          rules={[
                            {
                              required: true,
                              message: Errors.CC_THRESHOLD_REQUIRED,
                            },
                            () => ({
                              validator(_rule, value) {
                                if (typeof value === 'number') {
                                  if (value < (general_data.min_amount || 0)) {
                                    return Promise.reject(
                                      Errors.CC_THRESHOLD_MINIMUM_AMOUNT,
                                    );
                                  } else if (
                                    value >
                                    (general_data.max_amount ||
                                      Number.MAX_SAFE_INTEGER)
                                  ) {
                                    return Promise.reject(
                                      Errors.CC_THRESHOLD_MAXIMUM_AMOUNT,
                                    );
                                  }
                                }
                                return Promise.resolve();
                              },
                            }),
                          ]}
                        >
                          <InputNumber
                            min={0}
                            step={1}
                            precision={2}
                            value={general_data.local_cc_threshold_amount || 0}
                            defaultValue={
                              general_data.local_cc_threshold_amount || 0
                            }
                            style={{ width: '100%' }}
                            onChange={(value: any) => {
                              dispatch(
                                updateFormDataInState(
                                  'local_cc_threshold_amount',
                                  'general',
                                  value || 0,
                                ),
                              );
                            }}
                          />
                        </Form.Item>
                      )}

                    {!general_data.is_default_to_entity_cost_centre &&
                      !general_data.is_employee_cost_centre_readonly && (
                        <Form.Item
                          validateTrigger='onBlur'
                          className='is-allow-overseas-cost-centres'
                          name='is_allow_overseas_cost_centres'
                          label={checkboxLabel}
                          validateStatus={
                            backendError.hasOwnProperty(
                              'is_allow_overseas_cost_centres',
                            )
                              ? 'error'
                              : 'validating'
                          }
                          help={
                            backendError.hasOwnProperty(
                              'is_allow_overseas_cost_centres',
                            )
                              ? backendError.is_allow_overseas_cost_centres[0]
                              : null
                          }
                        >
                          <Checkbox
                            checked={
                              general_data.is_allow_overseas_cost_centres
                            }
                            onChange={(value: any) => {
                              dispatch(
                                updateFormDataInState(
                                  'is_allow_overseas_cost_centres',
                                  'general',
                                  value.target.checked,
                                ),
                              );
                              if (!value.target.checked)
                                dispatch(resetOverSeasCostCentreSubOptions());
                            }}
                            disabled={
                              general_data.is_employee_cost_centre_readonly
                            }
                          >
                            <Trans>Allow Overseas Cost Centres</Trans>
                          </Checkbox>
                        </Form.Item>
                      )}

                    {general_data.is_allow_overseas_cost_centres &&
                      !general_data.is_default_to_entity_cost_centre && (
                        <Form.Item
                          validateTrigger='onBlur'
                          label={
                            <Trans>
                              Minimum Amount To Allow Overseas Cost Centre
                            </Trans>
                          }
                          name='overseas_cc_threshold_amount'
                          className='overseas-cc-threshold-amount'
                          validateStatus={
                            backendError.hasOwnProperty(
                              'overseas_cc_threshold_amount',
                            )
                              ? 'error'
                              : 'validating'
                          }
                          help={
                            backendError.hasOwnProperty(
                              'overseas_cc_threshold_amount',
                            )
                              ? backendError.overseas_cc_threshold_amount[0]
                              : null
                          }
                          required={false}
                          rules={[
                            {
                              required: true,
                              message: Errors.CC_THRESHOLD_REQUIRED,
                            },
                            () => ({
                              validator(_rule, value) {
                                if (typeof value === 'number') {
                                  if (value < (general_data.min_amount || 0)) {
                                    return Promise.reject(
                                      Errors.CC_THRESHOLD_MINIMUM_AMOUNT,
                                    );
                                  } else if (
                                    value >
                                    (general_data.max_amount ||
                                      Number.MAX_SAFE_INTEGER)
                                  ) {
                                    return Promise.reject(
                                      Errors.CC_THRESHOLD_MAXIMUM_AMOUNT,
                                    );
                                  }
                                }
                                return Promise.resolve();
                              },
                            }),
                          ]}
                        >
                          <InputNumber
                            min={0}
                            step={1}
                            precision={2}
                            value={
                              general_data.overseas_cc_threshold_amount || 0
                            }
                            defaultValue={
                              general_data.overseas_cc_threshold_amount || 0
                            }
                            style={{ width: '100%' }}
                            onChange={(value: any) => {
                              dispatch(
                                updateFormDataInState(
                                  'overseas_cc_threshold_amount',
                                  'general',
                                  value || 0,
                                ),
                              );
                            }}
                          />
                        </Form.Item>
                      )}
                    {!general_data.is_default_to_entity_cost_centre &&
                      !general_data.is_employee_cost_centre_readonly && (
                        <Form.Item
                          validateTrigger='onBlur'
                          className='is-allow-internal-order-cost-centres'
                          name='is_allow_internal_order_cost_centres'
                          label={checkboxLabel}
                          validateStatus={
                            backendError.hasOwnProperty(
                              'is_allow_internal_order_cost_centres',
                            )
                              ? 'error'
                              : 'validating'
                          }
                          help={
                            backendError.hasOwnProperty(
                              'is_allow_internal_order_cost_centres',
                            )
                              ? backendError
                                  .is_allow_internal_order_cost_centres[0]
                              : null
                          }
                        >
                          <Checkbox
                            checked={
                              general_data.is_allow_internal_order_cost_centres
                            }
                            onChange={(value: any) => {
                              dispatch(
                                updateFormDataInState(
                                  'is_allow_internal_order_cost_centres',
                                  'general',
                                  value.target.checked,
                                ),
                              );
                            }}
                            disabled={
                              general_data.is_employee_cost_centre_readonly
                            }
                          >
                            <Trans>Allow Internal Order Cost Centres</Trans>
                          </Checkbox>
                        </Form.Item>
                      )}

                    {!general_data.is_default_to_entity_cost_centre &&
                      !general_data.is_employee_cost_centre_readonly && (
                        <Form.Item
                          validateTrigger='onBlur'
                          className='is-allow-3rd-party-vendor'
                          name='is_allow_3rd_party_vendor'
                          label={checkboxLabel}
                          validateStatus={
                            backendError.hasOwnProperty(
                              'is_allow_3rd_party_vendor',
                            )
                              ? 'error'
                              : 'validating'
                          }
                          help={
                            backendError.hasOwnProperty(
                              'is_allow_3rd_party_vendor',
                            )
                              ? backendError.is_allow_3rd_party_vendor[0]
                              : null
                          }
                        >
                          <Checkbox
                            checked={general_data.is_allow_3rd_party_vendor}
                            onChange={(value: any) => {
                              dispatch(
                                updateFormDataInState(
                                  'is_allow_3rd_party_vendor',
                                  'general',
                                  value.target.checked,
                                ),
                              );
                            }}
                            disabled={
                              general_data.is_employee_cost_centre_readonly
                            }
                          >
                            <Trans>Allow 3rd Party Vendor</Trans>
                          </Checkbox>
                        </Form.Item>
                      )}
                  </>
                ) : null}
              </Col>
            </Row>

            <Row>
              <Col {...levelTwoSpan}>
                {/* --------------- Mileage --------------- */}
                {mileageOptionVisibility ? (
                  <>
                    <div className='form-section only-div'>
                      <Trans>Mileage Details</Trans>
                    </div>
                    <Form.Item
                      validateTrigger='onBlur'
                      className='mileage-rate-as-of'
                      name='mileage_rate_as_of_date'
                      data-test='mileage_rate_as_of_date'
                      label='Mileage Rate As Of Date'
                      required
                      rules={[
                        {
                          validator: () =>
                            dateValidator(mileage.mileage_rate_as_of_date, ''),
                        },
                      ]}
                      validateStatus={
                        backendError.hasOwnProperty('mileage_rate_as_of_date')
                          ? 'error'
                          : 'validating'
                      }
                      help={
                        backendError.hasOwnProperty('mileage_rate_as_of_date')
                          ? backendError.mileage_rate_as_of_date[0]
                          : null
                      }
                    >
                      <DatePicker
                        allowClear
                        style={widthFiftyPer}
                        format='DD/MM/YYYY'
                        value={
                          mileage.mileage_rate_as_of_date
                            ? moment(
                                mileage.mileage_rate_as_of_date,
                                'DD/MM/YYYY',
                              )
                            : undefined
                        }
                        defaultValue={
                          mileage.mileage_rate_as_of_date
                            ? moment(
                                mileage.mileage_rate_as_of_date,
                                'DD/MM/YYYY',
                              )
                            : undefined
                        }
                        onChange={handleMilageRateAsOfDateFieldChange}
                      />
                    </Form.Item>

                    <Card title='Mileage Rate' bordered>
                      {isUpdateMode ? (
                        <Row justify='end'>
                          <Button
                            className='previous-rates-btn'
                            type='link'
                            onClick={showPreviousRates.bind(null, 'mileage')}
                          >
                            <div className='underline-text'>
                              <Trans>Previous Rates</Trans>
                            </div>
                          </Button>
                        </Row>
                      ) : null}
                      <Form.List name='mileage_rates'>
                        {fields => {
                          let milageRateListLength = isUpdateMode
                            ? mileage.mileage_rates?.filter(
                                value => value?.is_deleted === false,
                              ).length
                            : fields.length;
                          return (
                            <>
                              {fields.map(field => {
                                return !mileage.mileage_rates[field.fieldKey]
                                  ?.is_deleted ? (
                                  <Row
                                    gutter={[16, 16]}
                                    className='upto-distance'
                                    key={field.fieldKey}
                                  >
                                    <Col span={11}>
                                      <Form.Item
                                        {...field}
                                        name={[field.name, 'upto_distance']}
                                        fieldKey={
                                          [
                                            field.fieldKey,
                                            'upto_distance',
                                          ] as any
                                        }
                                        label='Upto Distance'
                                        trigger='onChange'
                                        rules={[
                                          {
                                            required: false,
                                          },
                                          () => ({
                                            validator(_rule, value) {
                                              if (value === 0 || value < 0) {
                                                return Promise.reject(
                                                  `Distance should be greater than 0`,
                                                );
                                              }

                                              return Promise.resolve();
                                            },
                                          }),
                                        ]}
                                      >
                                        <InputNumber
                                          // disabled={viewOnly}
                                          type='number'
                                          onChange={handleMilageRateFieldChange.bind(
                                            null,
                                            field.fieldKey,
                                            'upto_distance',
                                          )}
                                          placeholder='Upto Distance'
                                        />
                                      </Form.Item>
                                    </Col>
                                    <Col span={11}>
                                      <Form.Item
                                        {...field}
                                        name={[field.name, 'rate']}
                                        fieldKey={
                                          [field.fieldKey, 'rate'] as any
                                        }
                                        label='Rate'
                                        rules={[
                                          {
                                            required: true,
                                            message:
                                              Errors.MILEAGE_RATE_REQUIRED,
                                          },
                                          () => ({
                                            validator(_rule, value) {
                                              if (value === 0 || value < 0) {
                                                return Promise.reject(
                                                  `Rate should be greater than 0`,
                                                );
                                              }

                                              return Promise.resolve();
                                            },
                                          }),
                                        ]}
                                      >
                                        <InputNumber
                                          // disabled={viewOnly}
                                          type='number'
                                          placeholder='Rate'
                                          precision={2}
                                          onChange={handleMilageRateFieldChange.bind(
                                            null,
                                            field.fieldKey,
                                            'rate',
                                          )}
                                        />
                                      </Form.Item>
                                    </Col>
                                    {milageRateListLength === 1 ? null : (
                                      <Space align='center'>
                                        <Col
                                          span={2}
                                          className='delete-btn-container'
                                        >
                                          <CloseOutlined
                                            onClick={handleDeleteClickFieldList.bind(
                                              null,
                                              field,
                                            )}
                                          />
                                        </Col>
                                      </Space>
                                    )}
                                  </Row>
                                ) : null;
                              })}
                              <Form.Item>
                                <Button
                                  // disabled={viewOnly}
                                  className='add-btn-container'
                                  type='dashed'
                                  disabled={isAddMileageRateDisabled}
                                  onClick={() => {
                                    const newRow = [...mileage?.mileage_rates];

                                    if (isUpdateMode) {
                                      newRow.push({
                                        upto_distance: null,
                                        rate: null,
                                        //is_deleted: false,
                                      });
                                    } else {
                                      newRow.push({
                                        upto_distance: null,
                                        rate: null,
                                      });
                                    }
                                    dispatch(
                                      updateFormDataInState(
                                        'mileage_rates',
                                        'mileage',
                                        newRow,
                                      ),
                                    );
                                    setIsAddMileageRateDisabled(true);
                                  }}
                                  icon={<PlusOutlined />}
                                >
                                  <Trans>Add Another</Trans>
                                </Button>
                              </Form.Item>
                            </>
                          );
                        }}
                      </Form.List>
                    </Card>
                    <Form.Item
                      validateTrigger='onBlur'
                      className='allow-updating-calculated-amount'
                      name='is_allow_updating_mileage_claims_calculated_amount'
                      data-test='is_allow_updating_mileage_claims_calculated_amount'
                      label={checkboxLabel}
                      validateStatus={
                        backendError.hasOwnProperty(
                          'is_allow_updating_mileage_claims_calculated_amount',
                        )
                          ? 'error'
                          : 'validating'
                      }
                      help={
                        backendError.hasOwnProperty(
                          'is_allow_updating_mileage_claims_calculated_amount',
                        )
                          ? backendError
                              .is_allow_updating_mileage_claims_calculated_amount[0]
                          : null
                      }
                    >
                      <Checkbox
                        checked={
                          mileage.is_allow_updating_mileage_claims_calculated_amount
                        }
                        onChange={(value: any) =>
                          dispatch(
                            updateFormDataInState(
                              'is_allow_updating_mileage_claims_calculated_amount',
                              'mileage',
                              value.target.checked,
                            ),
                          )
                        }
                      >
                        <Trans>Allow Updating Calculated Amount?</Trans>
                      </Checkbox>
                    </Form.Item>
                    <Form.Item
                      validateTrigger='onBlur'
                      className='allow-updating-calculated-amount'
                      name='is_allow_updating_calculated_mileage'
                      data-test='is_allow_updating_calculated_mileage'
                      label={checkboxLabel}
                      validateStatus={
                        backendError.hasOwnProperty(
                          'is_allow_updating_calculated_mileage',
                        )
                          ? 'error'
                          : 'validating'
                      }
                      help={
                        backendError.hasOwnProperty(
                          'is_allow_updating_calculated_mileage',
                        )
                          ? backendError.is_allow_updating_calculated_mileage[0]
                          : null
                      }
                    >
                      <Checkbox
                        checked={mileage.is_allow_updating_calculated_mileage}
                        onChange={(value: any) =>
                          dispatch(
                            updateFormDataInState(
                              'is_allow_updating_calculated_mileage',
                              'mileage',
                              value.target.checked,
                            ),
                          )
                        }
                      >
                        <Trans>Allow Updating Calculated Mileage.</Trans>
                      </Checkbox>
                    </Form.Item>
                  </>
                ) : null}

                {/* --------------- Entertainment --------------- */}
                {entertainmentOptionVisibility ? (
                  <>
                    <div className='form-section only-div'>
                      <Trans>Attendees Details</Trans>
                    </div>
                    <Form.Item
                      validateTrigger='onBlur'
                      className='is-entertainment-rates-defined'
                      name='is_entertainment_rates_defined'
                      data-test='is_entertainment_rates_defined'
                      label={checkboxLabel}
                      validateStatus={
                        backendError.hasOwnProperty(
                          'is_entertainment_rates_defined',
                        )
                          ? 'error'
                          : 'validating'
                      }
                      help={
                        backendError.hasOwnProperty(
                          'is_entertainment_rates_defined',
                        )
                          ? backendError.is_entertainment_rates_defined[0]
                          : null
                      }
                    >
                      <Checkbox
                        checked={entertaiment.is_entertainment_rates_defined}
                        onChange={(value: any) => {
                          dispatch(
                            updateFormDataInState(
                              'is_entertainment_rates_defined',
                              'entertaiment',
                              value.target.checked,
                            ),
                          );
                          if (!value.target.checked)
                            dispatch(
                              resetIsEntertainmentRatesDefinedSubOptions(),
                            );
                        }}
                      >
                        <Trans>Set Per Person Rates</Trans>
                      </Checkbox>
                    </Form.Item>
                    <Form.Item
                      validateTrigger='onBlur'
                      className='can-have-staff-members'
                      name='can_have_staff_members'
                      data-test='can_have_staff_members'
                      label={checkboxLabel}
                      validateStatus={
                        backendError.hasOwnProperty('can_have_staff_members')
                          ? 'error'
                          : 'validating'
                      }
                      help={
                        backendError.hasOwnProperty('can_have_staff_members')
                          ? backendError.can_have_staff_members[0]
                          : null
                      }
                    >
                      <Checkbox
                        checked={entertaiment.can_have_staff_members}
                        onChange={(value: any) => {
                          dispatch(
                            updateFormDataInState(
                              'can_have_staff_members',
                              'entertaiment',
                              value.target.checked,
                            ),
                          );
                          if (!value.target.checked)
                            dispatch(resetCanHaveStaffMembersSubOptions());
                        }}
                      >
                        <Trans>Can Have Staff Members</Trans>
                      </Checkbox>
                    </Form.Item>
                    {entertaiment.can_have_staff_members ? (
                      <>
                        <Form.Item
                          validateTrigger='onBlur'
                          className='are-staff-members-mandatory'
                          name='are_staff_members_mandatory'
                          data-test='are_staff_members_mandatory'
                          label={innerCheckboxLabel}
                          validateStatus={
                            backendError.hasOwnProperty(
                              'are_staff_members_mandatory',
                            )
                              ? 'error'
                              : 'validating'
                          }
                          help={
                            backendError.hasOwnProperty(
                              'are_staff_members_mandatory',
                            )
                              ? backendError.are_staff_members_mandatory[0]
                              : null
                          }
                        >
                          <Checkbox
                            checked={entertaiment.are_staff_members_mandatory}
                            onChange={(value: any) =>
                              dispatch(
                                updateFormDataInState(
                                  'are_staff_members_mandatory',
                                  'entertaiment',
                                  value.target.checked,
                                ),
                              )
                            }
                          >
                            <Trans>Are Staff Members Mandatory</Trans>
                          </Checkbox>
                        </Form.Item>
                        {entertaiment.is_entertainment_rates_defined ? (
                          <Form.Item
                            validateTrigger='onBlur'
                            className='rate-per-staff-member '
                            name='rate_per_staff_member'
                            data-test='rate_per_staff_member'
                            label={
                              isUpdateMode ? (
                                <div className='custom-label'>
                                  <span>
                                    <Trans>Rate Per Staff Member</Trans>
                                  </span>
                                  <Button
                                    className='previous-rates-btn'
                                    type='link'
                                    onClick={showPreviousRates.bind(
                                      null,
                                      'entertainment',
                                    )}
                                  >
                                    <div className='underline-text'>
                                      <Trans>Previous Rates</Trans>
                                    </div>
                                  </Button>
                                </div>
                              ) : (
                                'Rate Per Staff Member'
                              )
                            }
                            rules={[
                              {
                                required: true,
                                message: Errors.RATE_REQUIRED,
                              },
                              () => ({
                                validator(_rule, value) {
                                  if (value <= 0) {
                                    return Promise.reject(Errors.MINIMUM_VALUE);
                                  }
                                  return Promise.resolve();
                                },
                              }),
                            ]}
                            validateStatus={
                              backendError.hasOwnProperty(
                                'rate_per_staff_member',
                              )
                                ? 'error'
                                : 'validating'
                            }
                            help={
                              backendError.hasOwnProperty(
                                'rate_per_staff_member',
                              )
                                ? backendError.rate_per_staff_member[0]
                                : null
                            }
                          >
                            <InputNumber
                              min={0}
                              step={0.01}
                              precision={2}
                              value={entertaiment.rate_per_staff_member}
                              defaultValue={entertaiment.rate_per_staff_member}
                              style={{ width: '100%' }}
                              onChange={(value: any) =>
                                dispatch(
                                  updateFormDataInState(
                                    'rate_per_staff_member',
                                    'entertaiment',
                                    value,
                                  ),
                                )
                              }
                            />
                          </Form.Item>
                        ) : null}
                      </>
                    ) : null}

                    <Form.Item
                      validateTrigger='onBlur'
                      className='can-have-guest-members'
                      name='can_have_guest_members'
                      data-test='can_have_guest_members'
                      label={checkboxLabel}
                      validateStatus={
                        backendError.hasOwnProperty('can_have_guest_members')
                          ? 'error'
                          : 'validating'
                      }
                      help={
                        backendError.hasOwnProperty('can_have_guest_members')
                          ? backendError.can_have_guest_members[0]
                          : null
                      }
                    >
                      <Checkbox
                        checked={entertaiment.can_have_guest_members}
                        onChange={(value: any) => {
                          dispatch(
                            updateFormDataInState(
                              'can_have_guest_members',
                              'entertaiment',
                              value.target.checked,
                            ),
                          );
                          if (!value.target.checked)
                            dispatch(resetCanHaveGuestMembersSubOptions());
                        }}
                      >
                        <Trans>Can Have Guest Members</Trans>
                      </Checkbox>
                    </Form.Item>
                    {entertaiment.can_have_guest_members ? (
                      <>
                        <Form.Item
                          validateTrigger='onBlur'
                          className='are-guest-members-mandatory '
                          name='are_guest_members_mandatory'
                          data-test='are_guest_members_mandatory'
                          label={innerCheckboxLabel}
                          validateStatus={
                            backendError.hasOwnProperty(
                              'are_guest_members_mandatory',
                            )
                              ? 'error'
                              : 'validating'
                          }
                          help={
                            backendError.hasOwnProperty(
                              'are_guest_members_mandatory',
                            )
                              ? backendError.are_guest_members_mandatory[0]
                              : null
                          }
                        >
                          <Checkbox
                            checked={entertaiment.are_guest_members_mandatory}
                            onChange={(value: any) =>
                              dispatch(
                                updateFormDataInState(
                                  'are_guest_members_mandatory',
                                  'entertaiment',
                                  value.target.checked,
                                ),
                              )
                            }
                          >
                            <Trans>Are Guest Members Mandatory</Trans>
                          </Checkbox>
                        </Form.Item>
                        {entertaiment.is_entertainment_rates_defined ? (
                          <Form.Item
                            validateTrigger='onBlur'
                            className='rate-per-guest-member '
                            name='rate_per_guest_member'
                            data-test='rate_per_guest_member '
                            label={
                              isUpdateMode ? (
                                <div className='custom-label'>
                                  <span>
                                    <Trans>Rate Per Guest Member</Trans>
                                  </span>
                                  <Button
                                    className='underline-text previous-rates-btn'
                                    type='link'
                                    onClick={showPreviousRates.bind(
                                      null,
                                      'entertainment',
                                    )}
                                  >
                                    <div className='underline-text'>
                                      <Trans>Previous Rates</Trans>
                                    </div>
                                  </Button>
                                </div>
                              ) : (
                                'Rate Per Guest Member'
                              )
                            }
                            rules={[
                              {
                                required: true,
                                message: Errors.RATE_REQUIRED,
                              },
                              () => ({
                                validator(_rule, value) {
                                  if (value <= 0) {
                                    return Promise.reject(Errors.MINIMUM_VALUE);
                                  }
                                  return Promise.resolve();
                                },
                              }),
                            ]}
                            validateStatus={
                              backendError.hasOwnProperty(
                                'rate_per_guest_member',
                              )
                                ? 'error'
                                : 'validating'
                            }
                            help={
                              backendError.hasOwnProperty(
                                'rate_per_guest_member',
                              )
                                ? backendError.rate_per_guest_member[0]
                                : null
                            }
                          >
                            <InputNumber
                              min={0}
                              step={0.01}
                              precision={2}
                              value={entertaiment.rate_per_guest_member}
                              defaultValue={entertaiment.rate_per_guest_member}
                              style={{ width: '100%' }}
                              onChange={(value: any) =>
                                dispatch(
                                  updateFormDataInState(
                                    'rate_per_guest_member',
                                    'entertaiment',
                                    value,
                                  ),
                                )
                              }
                            />
                          </Form.Item>
                        ) : null}
                      </>
                    ) : null}

                    {(entertaiment.can_have_guest_members ||
                      entertaiment.can_have_staff_members) &&
                      entertaiment.is_entertainment_rates_defined && (
                        <Row gutter={innerRowGutter}>
                          <Col span={12}>
                            <Form.Item
                              validateTrigger='onBlur'
                              className='entertainment-rate-as-of-date'
                              name='entertainment_rate_as_of_date'
                              data-test='entertainment_rate_as_of_date'
                              label='Entertainment Rate As Of Date'
                              required
                              rules={[
                                {
                                  validator: () =>
                                    dateValidator(
                                      entertaiment.entertainment_rate_as_of_date,
                                      '',
                                    ),
                                },
                              ]}
                              validateStatus={
                                backendError.hasOwnProperty(
                                  'entertainment_rate_as_of_date',
                                )
                                  ? 'error'
                                  : 'validating'
                              }
                              help={
                                backendError.hasOwnProperty(
                                  'entertainment_rate_as_of_date',
                                )
                                  ? backendError
                                      .entertainment_rate_as_of_date[0]
                                  : null
                              }
                            >
                              <DatePicker
                                allowClear
                                style={{ width: '100%' }}
                                format='DD/MM/YYYY'
                                value={
                                  entertaiment.entertainment_rate_as_of_date
                                    ? moment(
                                        entertaiment.entertainment_rate_as_of_date,
                                        'DD/MM/YYYY',
                                      )
                                    : undefined
                                }
                                defaultValue={
                                  entertaiment.entertainment_rate_as_of_date
                                    ? moment(
                                        entertaiment.entertainment_rate_as_of_date,
                                        'DD/MM/YYYY',
                                      )
                                    : undefined
                                }
                                onChange={(_date: any, value: string) =>
                                  dispatch(
                                    updateFormDataInState(
                                      'entertainment_rate_as_of_date',
                                      'entertaiment',
                                      value || null,
                                    ),
                                  )
                                }
                              />
                            </Form.Item>
                          </Col>
                        </Row>
                      )}
                    <Form.Item
                      validateTrigger='onBlur'
                      className='allow-updating-calculated-amount'
                      name='is_allow_updating_entertainment_claims_calculated_amount'
                      label={checkboxLabel}
                      validateStatus={
                        backendError.hasOwnProperty(
                          'is_allow_updating_entertainment_claims_calculated_amount',
                        )
                          ? 'error'
                          : 'validating'
                      }
                      help={
                        backendError.hasOwnProperty(
                          'is_allow_updating_entertainment_claims_calculated_amount',
                        )
                          ? backendError
                              .is_allow_updating_entertainment_claims_calculated_amount[0]
                          : null
                      }
                    >
                      <Checkbox
                        checked={
                          entertaiment.is_allow_updating_entertainment_claims_calculated_amount
                        }
                        onChange={(value: any) =>
                          dispatch(
                            updateFormDataInState(
                              'is_allow_updating_entertainment_claims_calculated_amount',
                              'entertaiment',
                              value.target.checked,
                            ),
                          )
                        }
                      >
                        <Trans>Allow Updating Calculated Amount</Trans>
                      </Checkbox>
                    </Form.Item>
                  </>
                ) : null}

                {/* --------------- Petty Cash --------------- */}
                {pettyCashOptionVisibility ? (
                  <>
                    <Form.Item
                      validateTrigger='onBlur'
                      className='is-allow-voucher-number form-section'
                      name='is_allow_voucher_number'
                      data-test='is_allow_voucher_number'
                      label={checkboxLabel}
                      validateStatus={
                        backendError.hasOwnProperty('is_allow_voucher_number')
                          ? 'error'
                          : 'validating'
                      }
                      help={
                        backendError.hasOwnProperty('is_allow_voucher_number')
                          ? backendError.is_allow_voucher_number[0]
                          : null
                      }
                    >
                      <Checkbox
                        checked={pettyCash.is_allow_voucher_number}
                        onChange={(value: any) => {
                          dispatch(
                            updateFormDataInState(
                              'is_allow_voucher_number',
                              'pettyCash',
                              value.target.checked,
                            ),
                          );
                        }}
                      >
                        <Trans>Allow Voucher Number</Trans>
                      </Checkbox>
                    </Form.Item>
                  </>
                ) : null}
              </Col>
            </Row>

            <Row>
              <Col {...levelOneSpan}>
                <div className='form-section only-div'>
                  <Trans>Other Details</Trans>
                </div>
                <Form.Item
                  validateTrigger='onBlur'
                  className='requires-supporting-documents'
                  name='is_allow_supporting_documents'
                  label={checkboxLabel}
                  validateStatus={
                    backendError.hasOwnProperty('is_allow_supporting_documents')
                      ? 'error'
                      : 'validating'
                  }
                  help={
                    backendError.hasOwnProperty('is_allow_supporting_documents')
                      ? backendError.is_allow_supporting_documents[0]
                      : null
                  }
                >
                  <Checkbox
                    checked={general_data.is_allow_supporting_documents}
                    onChange={(value: any) =>
                      dispatch(
                        updateFormDataInState(
                          'is_allow_supporting_documents',
                          'general',
                          value.target.checked,
                        ),
                      )
                    }
                  >
                    <Trans>Allow Supporting Documents</Trans>
                  </Checkbox>
                </Form.Item>
                {!allowanceOptionVisibility ? (
                  <Form.Item
                    validateTrigger='onBlur'
                    className='allow-claims-against-credit-card'
                    name='is_allow_claims_against_credit_card'
                    label={checkboxLabel}
                    validateStatus={
                      backendError.hasOwnProperty(
                        'is_allow_claims_against_credit_card',
                      )
                        ? 'error'
                        : 'validating'
                    }
                    help={
                      backendError.hasOwnProperty(
                        'is_allow_claims_against_credit_card',
                      )
                        ? backendError.is_allow_claims_against_credit_card[0]
                        : null
                    }
                  >
                    <Checkbox
                      checked={general_data.is_allow_claims_against_credit_card}
                      onChange={(value: any) =>
                        dispatch(
                          updateFormDataInState(
                            'is_allow_claims_against_credit_card',
                            'general',
                            value.target.checked,
                          ),
                        )
                      }
                    >
                      <Trans>Allow Claims Against Credit Card</Trans>
                    </Checkbox>
                  </Form.Item>
                ) : null}

                <Form.Item
                  validateTrigger='onBlur'
                  className='exclude-claims-from-finance-processing'
                  name='is_exclude_claims_from_finance_processing'
                  label={checkboxLabel}
                  validateStatus={
                    backendError.hasOwnProperty(
                      'is_exclude_claims_from_finance_processing',
                    )
                      ? 'error'
                      : 'validating'
                  }
                  help={
                    backendError.hasOwnProperty(
                      'is_exclude_claims_from_finance_processing',
                    )
                      ? backendError
                          .is_exclude_claims_from_finance_processing[0]
                      : null
                  }
                >
                  <Checkbox
                    checked={
                      general_data.is_exclude_claims_from_finance_processing
                    }
                    onChange={(value: any) =>
                      dispatch(
                        updateFormDataInState(
                          'is_exclude_claims_from_finance_processing',
                          'general',
                          value.target.checked,
                        ),
                      )
                    }
                  >
                    <Trans>Exclude Claims From Finance Processing</Trans>
                  </Checkbox>
                </Form.Item>
                <Form.Item
                  validateTrigger='onBlur'
                  className='assign-using-rules'
                  name='is_assign_using_rules'
                  label={checkboxLabel}
                  validateStatus={
                    backendError.hasOwnProperty('is_assign_using_rules')
                      ? 'error'
                      : 'validating'
                  }
                  help={
                    backendError.hasOwnProperty('is_assign_using_rules')
                      ? backendError.is_assign_using_rules[0]
                      : null
                  }
                >
                  <Checkbox
                    checked={general_data.is_assign_using_rules}
                    onChange={(value: any) =>
                      dispatch(
                        updateFormDataInState(
                          'is_assign_using_rules',
                          'general',
                          value.target.checked,
                        ),
                      )
                    }
                  >
                    <Trans>Assign Using Rules</Trans>
                  </Checkbox>
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col {...levelThreeSpan}>
                <Row gutter={innerRowGutter}>
                  <Col span={8}>
                    <Form.Item
                      validateTrigger='onBlur'
                      className='grace-period-in-days'
                      name='grace_period_in_days'
                      label={<Trans>Grace Period In Days</Trans>}
                      validateStatus={
                        backendError.hasOwnProperty('grace_period_in_days')
                          ? 'error'
                          : 'validating'
                      }
                      help={
                        backendError.hasOwnProperty('grace_period_in_days')
                          ? backendError.grace_period_in_days[0]
                          : null
                      }
                    >
                      <InputNumber
                        min={0}
                        max={365}
                        step={1}
                        precision={0}
                        value={general_data.grace_period_in_days}
                        defaultValue={general_data.grace_period_in_days}
                        style={widthFiftyPer}
                        onChange={(value: any) =>
                          dispatch(
                            updateFormDataInState(
                              'grace_period_in_days',
                              'general',
                              value,
                            ),
                          )
                        }
                      />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      validateTrigger='onBlur'
                      label={<Trans>Wage Type</Trans>}
                      name='wage_type'
                      className='wage-type'
                      // required
                      // rules={[
                      //   {
                      //     validator: () =>
                      //       dropdownCustomValidator(
                      //         general_data.wage_type,
                      //         'wage type',
                      //       ),
                      //   },
                      // ]}
                      validateStatus={
                        backendError.hasOwnProperty('wage_type')
                          ? 'error'
                          : 'validating'
                      }
                      help={
                        backendError.hasOwnProperty('wage_type')
                          ? backendError.wage_type[0]
                          : null
                      }
                    >
                      <Select
                        loading={wageTypeListDDCompatibleLoader}
                        allowClear
                        showSearch
                        value={general_data.wage_type}
                        defaultValue={general_data.wage_type}
                        style={widthFiftyPer}
                        onChange={(value: any) => {
                          dispatch(
                            updateFormDataInState(
                              'wage_type',
                              'general',
                              value,
                            ),
                          );
                        }}
                      >
                        {wageTypeListDDCompatible.map(
                          (o: IwageTypeListDDCompatible, i: number) => (
                            <Option key={i} value={o.title}>
                              {o.title}
                            </Option>
                          ),
                        )}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      validateTrigger='onBlur'
                      label={<Trans>GL Account</Trans>}
                      name='gl_account'
                      className='gl-account'
                      // required
                      // rules={[
                      //   {
                      //     validator: () =>
                      //       dropdownCustomValidator(
                      //         general_data.gl_account,
                      //         'GL Account',
                      //       ),
                      //   },
                      // ]}
                      validateStatus={
                        backendError.hasOwnProperty('gl_account')
                          ? 'error'
                          : 'validating'
                      }
                      help={
                        backendError.hasOwnProperty('gl_account')
                          ? backendError.gl_account[0]
                          : null
                      }
                    >
                      <Select
                        loading={loadingGLAccount}
                        allowClear
                        showSearch
                        value={general_data.gl_account}
                        defaultValue={general_data.gl_account}
                        style={widthFiftyPer}
                        onChange={(value: any) =>
                          dispatch(
                            updateFormDataInState(
                              'gl_account',
                              'general',
                              value,
                            ),
                          )
                        }
                      >
                        {GLAccountList.map((o: IGLAccountList, i: number) => (
                          <Option
                            value={o.account_number}
                            key={`${o.account_number}_${i}}`}
                          >
                            {o.account_number}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item
                  validateTrigger='onBlur'
                  label={<Trans>Instruction Text</Trans>}
                  className='instruction-text form-section'
                  name='instruction_text'
                  validateStatus={
                    backendError.hasOwnProperty('instruction_text')
                      ? 'error'
                      : 'validating'
                  }
                  help={
                    backendError.hasOwnProperty('instruction_text')
                      ? backendError.instruction_text[0]
                      : null
                  }
                  required
                  rules={[
                    () => ({
                      validator(_, value) {
                        let text = value.replace(/(<([^>]+)>)/gi, '');
                        text = text.trim();
                        if (text) {
                          if (
                            String(text.match(/[^=@+\-!#﹘—⸺⸻].*/g)) === text
                          ) {
                            return Promise.resolve();
                          } else {
                            return Promise.reject(
                              new Error(
                                'Can not start with special characters.',
                              ),
                            );
                          }
                        } else {
                          return Promise.reject(
                            Errors.INSTRUCTION_TEXT_REQUIRED,
                          );
                        }
                      },
                    }),
                  ]}
                >
                  <RichTextEditor
                    value={general_data.instruction_text}
                    inlineStyle={widthFiftyPer}
                    onChange={(e: any) =>
                      dispatch(
                        updateFormDataInState('instruction_text', 'general', e),
                      )
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
          </Col>
        </Row>
      </Form>
      {isUpdateMode ? (
        <AppDrawer
          visible={drawerVisibility}
          title={<Trans>Previous Tax Rates</Trans>}
          data-test='previous_rates_drawer'
          showCancelButton={false}
          OkText='Close'
          onOkClick={() => {
            dispatch(returnUpdateRateTypeAction(''));
          }}
        >
          {drawerVisibility ? (
            <>
              {rate_type === 'mileage' ? (
                <Table
                  data-test='mileage-previous-rates-table'
                  columns={mileageRatesColumn}
                  dataSource={mileageRatesTableData}
                  pagination={{
                    hideOnSinglePage: true,
                  }}
                  bordered
                />
              ) : null}
              {rate_type === 'entertainment' ? (
                <Table
                  data-test='entertainment-previous-rates-table'
                  columns={entertanmentRatesColumn}
                  dataSource={entertanmentRatesTableData}
                  pagination={{
                    hideOnSinglePage: true,
                  }}
                  bordered
                />
              ) : null}
              {rate_type === 'tax_Percentages' ? (
                <Table
                  data-test='tax-percentages-table'
                  columns={taxPercentagesColumn}
                  dataSource={taxPercentagesTableData}
                  pagination={{
                    hideOnSinglePage: true,
                  }}
                  bordered
                />
              ) : null}
              <br />
            </>
          ) : null}
        </AppDrawer>
      ) : null}
      {/* </Skeleton> */}
    </div>
  );
});

const CheckboxItem: React.FC<{
  name: string;
  label: string | React.ReactNode;
  style?: React.CSSProperties;
  onChange?: (val: boolean) => void;
  className?: string;
  noStyle?: boolean;
  disabled?: boolean;
}> = props => {
  const { name, label, style, onChange, className, noStyle, disabled } = props;
  return (
    <ErrorBoundary>
      <Form.Item valuePropName='checked' name={name} noStyle={noStyle}>
        <Checkbox
          disabled={disabled}
          style={{
            ...style,
          }}
          className={className}
          onChange={e => (onChange ? onChange(e.target.checked) : undefined)}
        >
          {label}
        </Checkbox>
      </Form.Item>
    </ErrorBoundary>
  );
};

const mapStateToProps = (state: stateInterface) => {
  const {
    general_data,
    entityCostCenterLoader,
    cost_centres_for_legal_entity,
    entityCostCenterList,
    mileage,
    entertaiment,
    categoryList,
    entityList,
    allowanceExpenseTypes,
    maximumClaimAmountPerPeriodDataList,
    countryList,
    allowClaimsOn,
    custom,
    label,
    error,
    info,
    success,
    isLoading,
    backendError,
    rate_type,
    mileage_rates,
    entertainment_rates,
    loadingCategory,
    loadingEntity,
    expense_type_allowance_rates,
    allowanceRateExpenseTypes,
    loadingMaximumClaimAmountPerPeriod,
    loadingCountryList,
    loadingAllowClaimsOn,
    configMode,
    loadingConfigurationData,
    pettyCash,
    allowance,
  } = state.expenseTypeConfiguration;
  const {
    wageTypeListDDCompatible,
    wageTypeListDDCompatibleLoader,
  } = state.WageType;
  const {
    glAccounts: GLAccountList,
    loader: loadingGLAccount,
  } = state.glAccount;
  const {
    costCentres: costCenterList,
    loader: loadingCostCenter,
  } = state.costCentre;
  return {
    general_data,
    entityCostCenterLoader,
    entityCostCenterList,
    cost_centres_for_legal_entity,
    mileage,
    entertaiment,
    categoryList,
    entityList,
    allowanceExpenseTypes,
    allowanceRateExpenseTypes,
    maximumClaimAmountPerPeriodDataList,
    costCenterList,
    GLAccountList,
    countryList,
    allowClaimsOn,
    custom,
    label,
    error,
    info,
    success,
    isLoading,
    backendError,
    rate_type,
    mileage_rates,
    entertainment_rates,
    expense_type_allowance_rates,
    loadingCategory,
    loadingEntity,
    loadingMaximumClaimAmountPerPeriod,
    loadingCostCenter,
    loadingGLAccount,
    loadingCountryList,
    loadingAllowClaimsOn,
    wageTypeListDDCompatible,
    wageTypeListDDCompatibleLoader,
    configMode,
    loadingConfigurationData,
    pettyCash,
    allowance,
  };
};
const connector = connect(mapStateToProps, null, null, {
  forwardRef: true,
});

export default memo(connector(ConfigForm));
