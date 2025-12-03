/* eslint-disable array-callback-return */
import {
  customObjInterface,
  Ilabel,
  IentityList,
  IcategoryList,
  ImaximumClaimAmountPerPeriodData,
  IallowClaimsOn,
  IGLAccountList,
  IcountryListInnerObject,
  TconfigMode,
  IexpenseTypeEntityList,
  IcustomFields,
  TcustomFieldsLayout,
  IConfirmationInfo,
  TpropToRemove,
  TcustomFieldsPropertiesName,
  Ipagination,
  IresumeState,
  ITitleUpdateConfigData,
  IGenerateDetailConfigurationProps,
  IlistingFilterdata,
} from './expenseTypeConfiguration.model';
import { IwageTypeListDDCompatible } from '../../shared/redux/wageType/wageType.model';
import { Dispatch } from 'react';
import moment from 'moment';
export const UPDATE_EXPENSE_TYPE = 'UPDATE_EXPENSE_TYPE';
export const UPDATE_VIEW_STATE = 'UPDATE_VIEW_STATE';
export const UPDATE_ITEM = 'UPDATE_ITEM';
export const RESET_TO_INITIAL = 'RESET_TO_INITIAL';

export const API_CALL_REQUEST = 'API_CALL_REQUEST';
export const API_CALL_RESET = 'API_CALL_RESET';
export const API_CALL_SUCCESS = 'API_CALL_SUCCESS';
export const API_CALL_FAIL = 'API_CALL_FAIL';

/* ACTION TYPES Config Form */
export const UPDATE_EXPENSE_TYPE_CONFIG_TAB_ACTIVE_KEY =
  'UPDATE_EXPENSE_TYPE_CONFIG_TAB_ACTIVE_KEY';
export const UPDATE_EXPENSE_UPDATE_ID_AND_MODE =
  'UPDATE_EXPENSE_UPDATE_ID_AND_MODE';
export const UPDATE_EDIT_MODE_DATA = 'UPDATE_EDIT_MODE_DATA';
export const UPDATE_CUSTOM_DATA = 'UPDATE_CUSTOM_DATA';
export const UPDATE_GENERAL_DATA = 'UPDATE_GENERAL_DATA';
export const UPDATE_ENTERTAIMENT_DATA = 'UPDATE_ENTERTAIMENT_DATA';
export const UPDATE_MILEAGE_DATA = 'UPDATE_MILEAGE_DATA';
export const UPDATE_PETTY_CASH_DATA = 'UPDATE_PETTY_CASH_DATA';
export const UPDATE_ALLOWANCE_DATA = 'UPDATE_ALLOWANCE_DATA';
export const RESET_GENERAL_DATA = 'RESET_GENERAL_DATA';
export const RESET_ENTERTAIMENT_DATA = 'RESET_ENTERTAIMENT_DATA';
export const RESET_MILEAGE_DATA = 'RESET_MILEAGE_DATA';
export const UPDATE_LABEL_DATA = 'UPDATE_LABEL_DATA';
export const RESET_ALL = 'RESET_ALL';
export const CLEAR_DATA = 'CLEAR_DATA';
export const UPDATE_CATEGORY_LIST = 'UPDATE_CATEGORY_LIST';
export const UPDATE_ENTITY_LIST = 'UPDATE_ENTITY_LIST';
export const EXPENSE_TYPE_CONFIG_ALLOWANCE_ACTION_TYPES =
  'EXPENSE_TYPE_CONFIG_ALLOWANCE_ACTION_TYPES';
export const UPDATE_MAXIMUM_CLAIM_AMOUNT_PER_PERIOD_DATA_LIST =
  'UPDATE_MAXIMUM_CLAIM_AMOUNT_PER_PERIOD_DATA_LIST';
export const UPDATE_COST_CENTER_LIST = 'UPDATE_COST_CENTER_LIST';
// export const UPDATE_GL_ACCOUNT_LIST = 'UPDATE_GL_ACCOUNT_LIST';
export const UPDATE_COUNTRY_LIST = 'UPDATE_COUNTRY_LIST';
export const UPDATE_ALLOW_CLAIMS_ON_LIST = 'UPDATE_ALLOW_CLAIMS_ON_LIST';
export const UPDATE_EXPENSE_TYPE_CONFIGURATION_CREATION_DATA =
  'UPDATE_EXPENSE_TYPE_CONFIGURATION_CREATION_DATA';
export const UPDATE_EXPENSE_TYPE_CONFIGURATION_ERROR =
  'UPDATE_EXPENSE_TYPE_CONFIGURATION_ERROR';
export const UPDATE_RATE_TYPE = 'UPDATE_RATE_TYPE';
export const UPDATE_TAB_SWITCH_CONFIRMATION_VISIBILITY =
  'UPDATE_TAB_SWITCH_CONFIRMATION_VISIBILITY';
export const SHOW_LOADER = 'SHOW_LOADER';
export const HIDE_LOADER = 'HIDE_LOADER';
export const RESET_SETUP_MAXIMUM_CLAIM_AMOUNT_PER_PERIOD_SUB_OPTIONS =
  'RESET_SETUP_MAXIMUM_CLAIM_AMOUNT_PER_PERIOD_SUB_OPTIONS';
export const RESET_SET_WARNING_AMOUNT_SUB_OPTIONS =
  'RESET_SET_WARNING_AMOUNT_SUB_OPTIONS';
export const RESET_CAN_ATTACH_RECEIPT_SUB_OPTIONS =
  'RESET_CAN_ATTACH_RECEIPT_SUB_OPTIONS';
export const RESET_IS_RECEIPT_MANDATORY_SUB_OPTIONS =
  'RESET_IS_RECEIPT_MANDATORY_SUB_OPTIONS';
export const RESET_ALLOW_REMARK_SUB_OPTIONS = 'RESET_ALLOW_REMARK_SUB_OPTIONS';
export const RESET_ALLOW_FOREX_SUB_OPTIONS = 'RESET_ALLOW_FOREX_SUB_OPTIONS';
export const RESET_ALLOW_BACKDATED_CLAIMS_SUB_OPTIONS =
  'RESET_ALLOW_BACKDATED_CLAIMS_SUB_OPTIONS';
export const RESET_ALLOW_CHARGING_TO_COST_CENTRES_SUB_OPTIONS =
  'RESET_ALLOW_CHARGING_TO_COST_CENTRES_SUB_OPTIONS';
export const RESET_OVERSEAS_COST_CENTRE_SUB_OPTIONS =
  'RESET_OVERSEAS_COST_CENTRE_SUB_OPTIONS';
export const RESET_OVERSEAS_AND_LOCAL_THRESHOLD_AMOUNT =
  'RESET_OVERSEAS_AND_LOCAL_THRESHOLD_AMOUNT';
export const RESET_IS_ENTERTAINMENT_RATES_DEFINED_SUB_OPTIONS =
  'RESET_IS_ENTERTAINMENT_RATES_DEFINED_SUB_OPTIONS';
export const RESET_CAN_HAVE_STAFF_MEMBERS_SUB_OPTIONS =
  'RESET_CAN_HAVE_STAFF_MEMBERS_SUB_OPTIONS';
export const RESET_CAN_HAVE_GUEST_MEMBERS_SUB_OPTIONS =
  'RESET_CAN_HAVE_GUEST_MEMBERS_SUB_OPTIONS';
/* ACTION TYPES Config Form*/

export const UPDATE_DETAILS_ID = 'UPDATE_DETAILS_ID';
export const UPDATE_EXPENSE_TYPE_ENTITY_LIST =
  'UPDATE_EXPENSE_TYPE_ENTITY_LIST';
export const UPDATE_ADD_ENTITY_MODEL_VISIBILITY =
  'UPDATE_ADD_ENTITY_MODEL_VISIBILITY';
export const UPDATE_CONFIRMATION_INFO = 'UPDATE_CONFIRMATION_INFO';
export const RESET_CONFIRMATION_INFO = 'RESET_CONFIRMATION_INFO';

export const UPDATE_PAGINATION = 'UPDATE_PAGINATION';
export const SET_EXPENCE_TYPE_ALLOWANCE_RATES =
  'SET_EXPENCE_TYPE_ALLOWANCE_RATES';
export const UPDATE_LISTING_FILTER_DATA = 'UPDATE_LISTING_FILTER_DATA';

export const SET_RESUME_STATE_TO_REDUCER = 'SET_RESUME_STATE_TO_REDUCER';
export const SET_RESUME_STATE = 'SET_RESUME_STATE';
export const SET_IS_SAVE_RESUME_STATE_TRUE = 'SET_IS_SAVE_RESUME_STATE_TRUE';
export const SET_TITLE_UPDATE_CONFIG_DATA = 'SET_TITLE_UPDATE_CONFIG_DATA';
export const EXPENSE_TYPE_CONFIG_ALLOWANCE_RATE_ACTION_TYPES =
  'EXPENSE_TYPE_CONFIG_ALLOWANCE_RATE_ACTION_TYPES';

export const SAVE_ENTITY_COST_CENTER_LOADER = 'SAVE_ENTITY_COST_CENTER_LOADER';

export const SAVE_ENTITY_COST_CENTER = 'SAVE_ENTITY_COST_CENTER';

export const UPDATE_COST_CENTER_FOR_ENTITY = 'UPDATE_COST_CENTER_FOR_ENTITY';
export const SAVE_ENTITY = 'SAVE_ENTITY';
export const SAVE_ENTITY_TYPES = ' SAVE_ENTITY_TYPES';
export const SAVE_EXPANDED_ITEM = 'SAVE_EXPANDED_ITEM';

export const apiCallRequest = (payload: any = {}) => ({
  type: API_CALL_REQUEST,
  payload: {
    error: '',
    success: '',
    info: 'Loading Data...',
    isLoading: true,
    ...payload,
  },
});

export const apiCallSuccess = (success: string, payload: any = {}) => ({
  type: API_CALL_SUCCESS,
  payload: {
    error: '',
    success: success,
    info: '',
    isLoading: false,
    ...payload,
  },
});

export const apiCallFail = (err: string, payload: any = {}) => ({
  type: API_CALL_FAIL,
  payload: {
    error: err,
    success: '',
    info: '',
    isLoading: false,
    ...payload,
  },
});

export const apiCallReset = (payload: any = {}) => ({
  type: API_CALL_RESET,
  payload: {
    error: '',
    success: '',
    info: '',
    isLoading: false,
    ...payload,
  },
});

export const resetToInitial = () => ({
  type: RESET_TO_INITIAL,
});

export const saveExpenseTypeListData = (data: any) => ({
  type: UPDATE_EXPENSE_TYPE,
  payload: {
    expenseTypes: data,
  },
});

export const updateViewState = (data: boolean, clickedItem: any) => ({
  type: UPDATE_VIEW_STATE,
  payload: {
    viewClicked: data,
    item: clickedItem,
  },
});

export const saveExpenseTypeData = (data: any) => ({
  type: UPDATE_ITEM,
  payload: {
    item: data,
  },
});
export const setExpenseTypeAllowanceRates = (data: any) => ({
  type: SET_EXPENCE_TYPE_ALLOWANCE_RATES,
  payload: data,
});
/* -------------------------------------- EXPENSE TYPE END -------------------------------------- */

export const returnUpdateRateTypeAction = (_val: string) => ({
  type: UPDATE_RATE_TYPE,
  payload: {
    rate_type: _val,
  },
});

export const returnClearDataAction = () => ({
  type: CLEAR_DATA,
});

export const resetAllExpenseTypeState = () => ({
  type: RESET_ALL,
});

export const updateExpenseTypeUpdateIdAndMode = (
  data: string,
  mode?: TconfigMode,
) => {
  return {
    type: UPDATE_EXPENSE_UPDATE_ID_AND_MODE,
    payload: {
      expenseUpdateId: data,
      configMode: mode,
    },
  };
};

export const updateCustomDataAction = (data: customObjInterface[]) => {
  return {
    type: UPDATE_CUSTOM_DATA,
    payload: data,
  };
};

export const tabKeyUpdateAction = (data: string) => {
  return {
    type: UPDATE_EXPENSE_TYPE_CONFIG_TAB_ACTIVE_KEY,
    payload: { activeTabKey: data },
  };
};

export const updateLabelDataAction = (data: Ilabel) => {
  return {
    type: UPDATE_LABEL_DATA,
    payload: { label: data },
  };
};

export const updateFormDataInState = (
  _key: string,
  _type: string,
  _value: string | boolean | number | string[] | null | undefined,
) => {
  let _payload: any = {};
  if (_key) {
    _payload[_key] = _value;
  }
  let actionType = UPDATE_GENERAL_DATA;

  if (_type === 'general') actionType = UPDATE_GENERAL_DATA;
  else if (_type === 'mileage') actionType = UPDATE_MILEAGE_DATA;
  else if (_type === 'entertaiment') actionType = UPDATE_ENTERTAIMENT_DATA;
  else if (_type === 'pettyCash') actionType = UPDATE_PETTY_CASH_DATA;
  else if (_type === 'allowance') actionType = UPDATE_ALLOWANCE_DATA;
  return {
    type: actionType,
    payload: _payload,
  };
};

export const returnResetGeneralDataAction = {
  type: RESET_GENERAL_DATA,
};

/* API call success, saving response */

export const saveEntityTypeData = (data: IentityList[]) => ({
  type: UPDATE_ENTITY_LIST,
  payload: {
    entityList: data,
  },
});

export const saveAllowanceExpenses = (data: any[]) => ({
  type: EXPENSE_TYPE_CONFIG_ALLOWANCE_ACTION_TYPES,
  payload: {
    allowanceExpenseTypes: data,
  },
});

export const saveAllowanceRateExpenses = (data: any[]) => ({
  type: EXPENSE_TYPE_CONFIG_ALLOWANCE_RATE_ACTION_TYPES,
  payload: {
    allowanceRateExpenseTypes: data,
  },
});

export const saveCountryListtData = (data: IcountryListInnerObject[]) => ({
  type: UPDATE_COUNTRY_LIST,
  payload: {
    countryList: data,
  },
});

export const saveCategoryData = (data: IcategoryList[]) => ({
  type: UPDATE_CATEGORY_LIST,
  payload: {
    categoryList: data,
  },
});

export const saveMaximumClaimAmountPerPeriodData = (
  data: ImaximumClaimAmountPerPeriodData[],
) => ({
  type: UPDATE_MAXIMUM_CLAIM_AMOUNT_PER_PERIOD_DATA_LIST,
  payload: {
    maximumClaimAmountPerPeriodDataList: data,
  },
});

export const saveAllowClaimsOnList = (data: IallowClaimsOn[]) => ({
  type: UPDATE_ALLOW_CLAIMS_ON_LIST,
  payload: {
    allowClaimsOn: data,
  },
});

export const saveExpenseTypeConfigurationAPIError = (data: any) => ({
  type: UPDATE_EXPENSE_TYPE_CONFIGURATION_ERROR,
  payload: {
    backendError: data,
  },
});

export const saveLabelMappingList = (data: any) => {
  return {
    type: UPDATE_LABEL_DATA,
    payload: {
      label: { ...data },
    },
  };
};

export const tabSwitchConfirmationVisibilityAction = (visibility: boolean) => {
  return {
    type: UPDATE_TAB_SWITCH_CONFIRMATION_VISIBILITY,
    payload: {
      tabSwitchConfirmationVisibility: visibility,
    },
  };
};

export const resetSetupMaximumClaimAmountPerPeriodSubOptions = () => ({
  type: RESET_SETUP_MAXIMUM_CLAIM_AMOUNT_PER_PERIOD_SUB_OPTIONS,
});

export const resetSetWarningAmountSubOptions = () => ({
  type: RESET_SET_WARNING_AMOUNT_SUB_OPTIONS,
});

export const resetCanAttachReceiptSubOptions = () => ({
  type: RESET_CAN_ATTACH_RECEIPT_SUB_OPTIONS,
});

export const resetIsReceiptMandatorySubOptions = () => ({
  type: RESET_IS_RECEIPT_MANDATORY_SUB_OPTIONS,
});

export const resetAllowRemarkSubOptions = () => ({
  type: RESET_ALLOW_REMARK_SUB_OPTIONS,
});

export const resetAllowForexSubOptions = () => ({
  type: RESET_ALLOW_FOREX_SUB_OPTIONS,
});

export const resetAllowBackdatedClaimsSubOptions = () => ({
  type: RESET_ALLOW_BACKDATED_CLAIMS_SUB_OPTIONS,
});

export const resetAllowChargingToCostCentresSubOptions = () => ({
  type: RESET_ALLOW_CHARGING_TO_COST_CENTRES_SUB_OPTIONS,
});

export const resetOverSeasCostCentreSubOptions = () => ({
  type: RESET_OVERSEAS_COST_CENTRE_SUB_OPTIONS,
});

export const resetOverseasAndLocalThresholdAmount = () => ({
  type: RESET_OVERSEAS_AND_LOCAL_THRESHOLD_AMOUNT,
});

export const resetIsEntertainmentRatesDefinedSubOptions = () => ({
  type: RESET_IS_ENTERTAINMENT_RATES_DEFINED_SUB_OPTIONS,
});

export const resetCanHaveStaffMembersSubOptions = () => ({
  type: RESET_CAN_HAVE_STAFF_MEMBERS_SUB_OPTIONS,
});

export const resetCanHaveGuestMembersSubOptions = () => ({
  type: RESET_CAN_HAVE_GUEST_MEMBERS_SUB_OPTIONS,
});

export const saveExpenseTypeFormData = (data: any) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks

  return (dispatch: Dispatch<any>, getState: any) => {
    const { label = {} } = getState().expenseTypeConfiguration;
    let CurrentDate = moment();
    let entertainmentRates = data.entertainment_rates.filter((obj: any) => {
      let date = moment(obj.as_of_date, 'DD/MM/YYYY');
      return date <= CurrentDate;
    });

    const taxPercentage = () => {
      let sortedTaxPercentage: any = data?.tax_percentages[0] || {};
      // eslint-disable-next-line no-unused-expressions
      data?.tax_percentages?.map((item: any) => {
        if (
          moment(item.as_of_date, 'DD/MM/YYYY') >
          moment(sortedTaxPercentage.as_of_date, 'DD/MM/YYYY')
        ) {
          if (
            moment(item.as_of_date, 'DD/MM/YYYY') >
            moment(CurrentDate, 'DD/MM/YYYY')
          ) {
            if (
              moment(item.as_of_date, 'DD/MM/YYYY') <
              moment(CurrentDate, 'DD/MM/YYYY')
            ) {
              sortedTaxPercentage = item;
            }
          } else {
            sortedTaxPercentage = item;
          }
        }
      });

      return sortedTaxPercentage;
    };

    const taxPercentages = taxPercentage();

    // Milage Rates Sorting
    let mileageRates = data.mileage_rates.filter((item: any) => {
      return item.as_of_date === data.mileage_rates[0].as_of_date;
    });

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

    const allowance_id = data.expense_type_allowance_rates.map(
      (item: any) => item.allowance_rate.id,
    );
    dispatch(
      updateFormDataInState(
        'expense_type_allowance_rates',
        'allowance',
        allowance_id,
      ),
    );
    dispatch(setExpenseTypeAllowanceRates(data.expense_type_allowance_rates));
    dispatch({
      type: UPDATE_EDIT_MODE_DATA,
      payload: {
        general_data: {
          category: data.category.title, //backend expecting code on post*****
          // legal_entity: data.legal_entity.length
          //   ? data.legal_entity.map((o: IentityList) => o.title)
          //   : [], //backend expecting code on post*****
          legal_entity:
            data?.legal_entity?.length > 0
              ? data.legal_entity.map((o: IentityList) => o.title)
              : data.legal_entity?.title
              ? [data.legal_entity?.title]
              : [],
          title: data.title,
          code: data.code,
          is_active: data.is_active,
          allow_claims_on: data.allow_claims_on.title, //backend expecting code on post*****
          can_attach_receipts: data.can_attach_receipts,
          is_receipt_mandatory: data.is_receipt_mandatory,
          is_display_no_receipt_attached_field:
            data.is_display_no_receipt_attached_field,
          is_remark_for_no_receipt_mandatory:
            data.is_remark_for_no_receipt_mandatory,
          is_allow_supporting_documents: data.is_allow_supporting_documents,
          min_amount: data.min_amount
            ? Number(data.min_amount)
            : data.min_amount,
          max_amount: data.max_amount
            ? Number(data.max_amount)
            : data.max_amount,
          is_setup_maximum_claim_amount_per_period:
            data.is_setup_maximum_claim_amount_per_period,
          period: data.period.title, //backend expecting code on post*****
          amount_per_period: Number(data.amount_per_period),
          is_set_warning_amount: data.is_set_warning_amount,
          warning_amount: Number(data.warning_amount),
          warning_message: data.warning_message,
          is_allow_purpose: data.is_allow_purpose,
          is_purpose_mandatory: data.is_purpose_mandatory,
          is_allow_forex: data.is_allow_forex,
          is_forex_rate_editable_by_employee:
            data.is_forex_rate_editable_by_employee,
          forex_deviation_percentage: data.forex_deviation_percentage,
          is_allow_backdated_claims: data.is_allow_backdated_claims,
          backdated_claim_period_in_days: data.backdated_claim_period_in_days,
          resubmission_period_after_rejection_in_days:
            data.resubmission_period_after_rejection_in_days,
          is_default_to_entity_cost_centre:
            data.is_default_to_entity_cost_centre,
          grace_period_in_days: data.grace_period_in_days,
          tax_percentage_as_of_date: taxPercentages.as_of_date
            ? moment(taxPercentages.as_of_date, 'DD/MM/YYYY')
            : null,
          tax_percentages: taxPercentages.tax_percentage
            ? taxPercentages.tax_percentage
            : 0,
          tax_percentages_list: data.tax_percentages,
          is_allow_updating_tax_amount: data.is_allow_updating_tax_amount,
          is_auto_populate_tax_amount: data.is_auto_populate_tax_amount,
          is_allow_charging_to_cost_centres:
            data.is_allow_charging_to_cost_centres,
          // cost_centres: data.cost_centres.length
          //   ? data.cost_centres.map((o: IcostCenterList) => o.title)
          //   : [], //backend expecting object on post
          local_cc_threshold_amount: data?.local_cc_threshold_amount || 0,
          overseas_cc_threshold_amount: data?.overseas_cc_threshold_amount || 0,
          is_employee_cost_centre_readonly:
            data.is_employee_cost_centre_readonly,
          is_allow_internal_order_cost_centres:
            data.is_allow_internal_order_cost_centres,
          is_allow_overseas_cost_centres: data.is_allow_overseas_cost_centres,
          is_allow_3rd_party_vendor: data.is_allow_3rd_party_vendor,
          is_allow_claims_against_credit_card:
            data.is_allow_claims_against_credit_card,
          is_exclude_claims_from_finance_processing:
            data.is_exclude_claims_from_finance_processing,
          is_assign_using_rules: data.is_assign_using_rules,
          instruction_text: data.instruction_text,
          wage_type: data?.wage_type?.title || '', //backend expecting id on post call
          gl_account: data?.gl_account?.account_number || '',
        },
        entertaiment: {
          is_entertainment_rates_defined: data.is_entertainment_rates_defined,
          can_have_staff_members: data.can_have_staff_members,
          rate_per_staff_member: entertainmentRates.length
            ? entertainmentRates[0].rate_per_staff_member
            : 0,
          entertainment_rate_as_of_date: entertainmentRates.length
            ? entertainmentRates[0].as_of_date
            : null,
          are_staff_members_mandatory: data.are_staff_members_mandatory,
          can_have_guest_members: data.can_have_guest_members,
          rate_per_guest_member: entertainmentRates.length
            ? entertainmentRates[0].rate_per_guest_member
            : 0,
          entertainment_rate_country: data.entertainment_rates.length
            ? data.entertainment_rates[0].country
            : '',
          are_guest_members_mandatory: data.are_guest_members_mandatory,
          is_allow_country_selection: data.is_allow_country_selection,
          is_allow_updating_entertainment_claims_calculated_amount:
            data.is_allow_updating_entertainment_claims_calculated_amount,
        },
        mileage: {
          mileage_rate: data.mileage_rates.length
            ? data.mileage_rates[0].rate
            : 0,
          mileage_rate_as_of_date: data.mileage_rates.length
            ? data.mileage_rates[0].as_of_date
            : null,
          is_allow_updating_mileage_claims_calculated_amount:
            data.is_allow_updating_mileage_claims_calculated_amount,
          is_allow_updating_calculated_mileage:
            data.is_allow_updating_calculated_mileage,
          mileage_rates: sortedMilageRate || [],
          total_mileage_rates: data.mileage_rates,
        },
        pettyCash: {
          is_allow_voucher_number: data.is_allow_voucher_number,
        },
        allowance: {
          is_allow_allowance_rate_enabled: data.is_allow_allowance_rate_enabled,
          expense_type_allowance_rates: data.expense_type_allowance_rates.map(
            (item: any) => item.allowance_rate.id,
          ),
          is_allow_updating_no_of_days: data.is_allow_updating_no_of_days,
        },
        mileageRatesList: data.mileage_rates,
        custom: data.custom_fields,
        label: { ...label, ...data?.label_mapping },
        mileage_rates: data.mileage_rates,
        entertainment_rates: data.entertainment_rates,
        expenseUpdateConfigurationId: data.global_configuration,
      },
    });
  };
};

/* API call success, saving response */

export const updateCodeToTitle = (
  categoryList: any,
  categoryListCode: string,
  maximumClaimAmountPerPeriodDataList: any,
  maximumClaimAmountPerPeriodDataListCode: string,
  allowClaimsOn: any,
  allowClaimsOnCode: string,
) => {
  const category_val = categoryList.filter(
    (o: any) => o.code === categoryListCode,
  );

  const maxClaimPP_val = maximumClaimAmountPerPeriodDataList.filter(
    (o: any) => o.code === maximumClaimAmountPerPeriodDataListCode,
  );

  const allowClaimOn_val = allowClaimsOn.filter(
    (o: any) => o.code === allowClaimsOnCode,
  );

  return {
    category: category_val[0].title,
    period: maxClaimPP_val[0].title,
    allow_claims_on: allowClaimOn_val[0].title,
  };
};

export const resetLableObject = (label: Ilabel): Ilabel => {
  let data: Ilabel = {};

  for (let [key, value] of Object.entries(label)) {
    data[key] = {
      default: value.default,
      mapped: value.default,
    };
  }

  return data;
};

export const removeIdFromCustomFieldLayout = (
  custom: IcustomFields,
): TcustomFieldsLayout[] => {
  return custom.layout.map(o => {
    return o.map(p => {
      if (p.id) {
        delete p.id;
      }
      return p;
    });
  });
};

export const removePropsFromCustomFields = (
  fields: customObjInterface[],
  propToRemove: TpropToRemove,
): customObjInterface[] => {
  return fields.map((o: customObjInterface) => {
    // delete o.id;
    // delete o.is_deleted;
    propToRemove.forEach((p: TcustomFieldsPropertiesName) => {
      o.hasOwnProperty(p) && delete o[p];
    });
    return o;
  });
};

export const createPostData = (props: any, configMode: TconfigMode = 'ADD') => {
  const {
    isUpdateMode,
    general_data,
    entertaiment,
    mileage,
    custom,
    label,
    categoryList,
    entityList,
    allowClaimsOn,
    expense_type_allowance_rates,
    maximumClaimAmountPerPeriodDataList,
    // costCenterList,
    wageTypeListDDCompatible,
    GLAccountList,
    countryList,
    pettyCash,
    allowance,
    cost_centres_for_legal_entity,
  } = props;

  let returnObj: any = {};

  try {
    let label_mapping_val: any = { ...label };

    const allow_claims_on = allowClaimsOn.filter(
      (o: IallowClaimsOn) => o.title === general_data.allow_claims_on,
    );

    const period_val = maximumClaimAmountPerPeriodDataList.filter(
      (o: ImaximumClaimAmountPerPeriodData) => o.title === general_data.period,
    );

    // let cost_centres_val: number[] = [];

    // costCenterList.forEach((o: IcostCenterList) => {
    //   general_data.cost_centres!.forEach(e => {
    //     if (e === o.title) cost_centres_val.push(o.id);
    //   });
    // });

    const wage_type_val = wageTypeListDDCompatible.filter(
      (o: IwageTypeListDDCompatible) => o.title === general_data.wage_type,
    );

    const gl_account_val = GLAccountList.filter(
      (o: IGLAccountList) => o.account_number === general_data.gl_account,
    );

    const entertainment_rate_country_val = countryList.filter(
      (o: IcountryListInnerObject) =>
        o.title === entertaiment.entertainment_rate_country,
    );

    const cFields = custom.fields.map((item: any) => {
      return {
        ...item,
        sub_type: item.sub_type?.toUpperCase().replace(/ /g, ''),
      };
    });

    const category_val = categoryList.filter(
      (o: IcategoryList) => o.title === general_data.category,
    );

    const legal_entity_val: string[] = [];

    entityList.forEach((o: IentityList) => {
      general_data.legal_entity.forEach((e: any) => {
        if (e === o.title) legal_entity_val.push(o.uuid);
      });
    });

    let ccLegal_entity = [];

    if (cost_centres_for_legal_entity.length > 0) {
      ccLegal_entity = cost_centres_for_legal_entity.map((data: any) => {
        const result = entityList.find(
          (entity: any) => entity.title === data.legal_entity,
        );
        if (result) {
          return {
            ...data,
            legal_entity: result.uuid,
          };
        } else {
          return data;
        }
      });
    }
    // if max_amount not entered make it null
    if (!general_data.max_amount) general_data.max_amount = null;

    returnObj = {
      ...general_data,
      local_cc_threshold_amount: Number(
        general_data?.local_cc_threshold_amount,
      ).toFixed(2),
      overseas_cc_threshold_amount: Number(
        general_data?.overseas_cc_threshold_amount,
      ).toFixed(2),
      cost_centres_for_legal_entity: ccLegal_entity,
      category: category_val.length ? category_val[0].code : '',
      legal_entity: isUpdateMode
        ? legal_entity_val[0]
        : legal_entity_val.length
        ? legal_entity_val
        : [],
      allow_claims_on: allow_claims_on.length ? allow_claims_on[0].code : '',
      period:
        period_val.length &&
        general_data.is_setup_maximum_claim_amount_per_period
          ? period_val[0].code
          : null,
      // cost_centres:
      //   cost_centres_val.length &&
      //   general_data.is_allow_charging_to_cost_centres
      //     ? cost_centres_val
      //     : [],
      wage_type: wage_type_val.length ? wage_type_val[0].id : '',
      gl_account: gl_account_val.length ? gl_account_val[0].id : '',
      custom_fields: { layout: custom.layout, fields: cFields },
      label_mapping: label_mapping_val,
      tax_percentages: general_data.tax_percentages
        ? Number(Number(general_data.tax_percentages).toFixed(2))
        : 0,
      tax_percentage_as_of_date: general_data.tax_percentage_as_of_date
        ? general_data.tax_percentage_as_of_date.format('DD/MM/YYYY')
        : null,
    };

    if (
      !returnObj.is_allow_charging_to_cost_centres ||
      returnObj.is_employee_cost_centre_readonly
    ) {
      delete returnObj.local_cc_threshold_amount;
      delete returnObj.overseas_cc_threshold_amount;
    } else {
      if (!general_data.is_allow_overseas_cost_centres) {
        delete returnObj.overseas_cc_threshold_amount;
      }
    }

    // if (returnObj.cost_centres_for_legal_entity) {
    //   delete returnObj.local_cc_threshold_amount;
    // }

    if (
      returnObj.is_employee_cost_centre_readonly &&
      returnObj.local_cc_threshold_amount &&
      returnObj.overseas_cc_threshold_amount
    ) {
      delete returnObj.cost_centres_for_legal_entity;
    }
    if (
      returnObj.is_allow_charging_to_cost_centres &&
      !returnObj.is_default_to_entity_cost_centre
    ) {
      delete returnObj.cost_centres_for_legal_entity;
    }
    if (configMode === 'ADD') {
      returnObj.custom_fields = {
        layout: removeIdFromCustomFieldLayout(custom),
        fields: removePropsFromCustomFields(cFields, [
          'id',
          'is_deleted',
          'reference_object_title',
        ]),
      };
    } else if (configMode === 'UPDATE') {
      // delete returnObj.category;
      delete returnObj.legal_entity;
      delete returnObj.code;
      delete returnObj.title;
      delete returnObj.is_active;
      returnObj.custom_fields = {
        layout: custom.layout,
        fields: removePropsFromCustomFields(cFields, [
          'reference_object_title',
        ]),
      };
    } else if (configMode === 'CUSTOMIZE_ADD') {
      // delete returnObj.category;
      // delete returnObj.legal_entity;
      delete returnObj.code;
      delete returnObj.title;
      delete returnObj.is_active;
      returnObj.custom_fields = {
        layout: removeIdFromCustomFieldLayout(custom),
        fields: removePropsFromCustomFields(cFields, [
          'id',
          'is_deleted',
          'reference_object_title',
        ]),
      };
    } else if (configMode === 'CUSTOMIZE_UPDATE') {
      // delete returnObj.category;
      // delete returnObj.legal_entity;
      delete returnObj.code;
      delete returnObj.title;
      delete returnObj.is_active;
      returnObj.custom_fields = {
        layout: custom.layout,
        fields: removePropsFromCustomFields(cFields, [
          'reference_object_title',
        ]),
      };
    }

    if (general_data.category === 'Mileage') {
      returnObj = {
        ...returnObj,
        ...mileage,
      };
    } else if (general_data.category === 'Entertainment') {
      returnObj = {
        ...returnObj,
        ...entertaiment,
        rate_per_staff_member:
          entertaiment.can_have_staff_members &&
          entertaiment.is_entertainment_rates_defined
            ? entertaiment.rate_per_staff_member
            : undefined,
        rate_per_guest_member:
          entertaiment.can_have_guest_members &&
          entertaiment.is_entertainment_rates_defined
            ? entertaiment.rate_per_guest_member
            : undefined,
        entertainment_rate_as_of_date:
          (entertaiment.can_have_guest_members ||
            entertaiment.can_have_staff_members) &&
          entertaiment.is_entertainment_rates_defined
            ? entertaiment.entertainment_rate_as_of_date
            : undefined,
        entertainment_rate_country: entertainment_rate_country_val.length
          ? entertainment_rate_country_val[0].id
          : null,
      };
    } else if (general_data.category === 'Petty Cash') {
      returnObj = {
        ...returnObj,
        ...pettyCash,
      };
    } else if (general_data.category === 'Allowance') {
      if (!allowance.is_allow_allowance_rate_enabled) {
        returnObj = {
          ...returnObj,
          is_allow_allowance_rate_enabled: false,
          expense_type_allowance_rates: allowance.expense_type_allowance_rates.map(
            (value: any) => {
              const res = {
                allowance_rate: value,
                is_deleted: true,
              };
              return res;
            },
          ),
        };
        //  delete returnObj.expense_type_allowance_rates;
      } else {
        let expense_type_allowance_rates_array = [];
        if (
          (configMode === 'UPDATE' || configMode === 'CUSTOMIZE_UPDATE') &&
          expense_type_allowance_rates.length > 0
        ) {
          const arr: any = [];
          allowance.expense_type_allowance_rates.map((value: any) => {
            const result = expense_type_allowance_rates.find(
              (val: any) => val.allowance_rate.id === value,
            );
            result
              ? arr.push({
                  allowance_rate: value,
                  is_deleted: result.is_deleted,
                })
              : arr.push({
                  allowance_rate: value,
                });
          });
          expense_type_allowance_rates.map((values: any) => {
            const result = allowance.expense_type_allowance_rates.find(
              (val: any) => values.allowance_rate.id === val,
            );
            !result &&
              arr.push({
                allowance_rate: values.allowance_rate.id,
                is_deleted: true,
              });
          });
          expense_type_allowance_rates_array = arr;
        } else {
          expense_type_allowance_rates_array = allowance.expense_type_allowance_rates.map(
            (number: any) => {
              return {
                allowance_rate: number,
              };
            },
          );
        }

        const allow_allowance_enabled =
          allowance.is_allow_allowance_rate_enabled;

        returnObj.expense_type_allowance_rates = expense_type_allowance_rates_array;
        returnObj.is_allow_allowance_rate_enabled = allow_allowance_enabled;
      }
      returnObj.is_allow_updating_no_of_days =
        allowance.is_allow_updating_no_of_days;
    }
    return returnObj;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[createPostData', error);
  }
};
/* ACTION FUNCTIONS */

/* -------------------------------------- EXPENSE TYPE CONFIGUURATION FORM END -------------------------------------- */

export const updateDetailsId = (id: string) => {
  return {
    type: UPDATE_DETAILS_ID,
    payload: id,
  };
};

export const updateExpenseTypeEntityList = (list: IexpenseTypeEntityList[]) => {
  return {
    type: UPDATE_EXPENSE_TYPE_ENTITY_LIST,
    payload: list,
  };
};

export const updateAddEntityModelVisibility = (visibility: boolean) => {
  return {
    type: UPDATE_ADD_ENTITY_MODEL_VISIBILITY,
    payload: visibility,
  };
};

export const updateConfirmationInfo = (confirmationInfo: IConfirmationInfo) => {
  return {
    type: UPDATE_CONFIRMATION_INFO,
    payload: confirmationInfo,
  };
};

export const resetConfirmationInfo = () => {
  return {
    type: RESET_CONFIRMATION_INFO,
  };
};

export const updatePagination = (pagination: Ipagination) => {
  return {
    type: UPDATE_PAGINATION,
    payload: pagination,
  };
};

export const setResumeStateToReducer = () => {
  return {
    type: SET_RESUME_STATE_TO_REDUCER,
  };
};

export const setResumeState = (payload: IresumeState = {}) => {
  return {
    type: SET_RESUME_STATE,
    payload: payload,
  };
};

export const setIsSaveResumeStateTrue = () => {
  return {
    type: SET_IS_SAVE_RESUME_STATE_TRUE,
  };
};

export const setTitleUpdateConfigData = (payload: ITitleUpdateConfigData) => {
  return {
    type: SET_TITLE_UPDATE_CONFIG_DATA,
    payload: payload,
  };
};

export const generateDetailConfigration = (
  props: IGenerateDetailConfigurationProps,
) => {
  const {
    // isUpdateMode,
    general_data,
    entertaiment,
    mileage,
    custom,
    label,
    categoryList,
    entityList,
    allowClaimsOn,
    maximumClaimAmountPerPeriodDataList,
    // costCenterList,
    wageTypeListDDCompatible,
    GLAccountList,
    countryList,
    pettyCash,
  } = props;

  let returnObj: any = {};

  try {
    const allow_claims_on = allowClaimsOn.filter(
      (o: IallowClaimsOn) => o.title === general_data.allow_claims_on,
    );

    const period_val = maximumClaimAmountPerPeriodDataList.filter(
      (o: ImaximumClaimAmountPerPeriodData) => o.title === general_data.period,
    );

    // let cost_centres_val: number[] = [];

    // costCenterList.forEach((o: IcostCenterList) => {
    //   general_data.cost_centres!.forEach(e => {
    //     if (e === o.title) cost_centres_val.push(o.id);
    //   });
    // });

    const wage_type_val = wageTypeListDDCompatible.filter(
      (o: IwageTypeListDDCompatible) => o.title === general_data.wage_type,
    );

    const gl_account_val = GLAccountList.filter(
      (o: IGLAccountList) => o.account_number === general_data.gl_account,
    );

    const entertainment_rate_country_val = countryList.filter(
      (o: IcountryListInnerObject) =>
        o.title === entertaiment.entertainment_rate_country,
    );

    const cFields = custom.fields.map(item => {
      return {
        ...item,
        sub_type: item.sub_type?.toUpperCase().replace(/ /g, ''),
      };
    });

    const category_val = categoryList.filter(
      (o: IcategoryList) => o.title === general_data.category,
    );

    const legal_entity_val: any[] = [];

    entityList.forEach((o: IentityList) => {
      general_data.legal_entity.forEach(e => {
        if (e === o.title) legal_entity_val.push(o);
      });
    });

    // if (!general_data.max_amount) delete general_data.max_amount;

    returnObj = {
      ...general_data,
      category: category_val.length ? category_val[0] : '',
      legal_entity: legal_entity_val.length ? legal_entity_val : [],
      allow_claims_on: allow_claims_on.length ? allow_claims_on[0] : '',
      period:
        period_val.length &&
        general_data.is_setup_maximum_claim_amount_per_period
          ? period_val[0]
          : null,
      // cost_centres:
      //   cost_centres_val.length &&
      //   general_data.is_allow_charging_to_cost_centres
      //     ? cost_centres_val
      //     : [],
      wage_type: wage_type_val.length ? wage_type_val[0].id : '',
      gl_account: gl_account_val.length ? gl_account_val[0].id : '',
      custom_fields: { layout: custom.layout, fields: cFields },
      label_mapping: label,
    };

    if (general_data.category === 'Mileage') {
      returnObj = {
        ...returnObj,
        ...mileage,
      };
    } else if (general_data.category === 'Entertainment') {
      returnObj = {
        ...returnObj,
        ...entertaiment,
        rate_per_staff_member:
          entertaiment.can_have_staff_members &&
          entertaiment.is_entertainment_rates_defined
            ? entertaiment.rate_per_staff_member
            : undefined,
        rate_per_guest_member:
          entertaiment.can_have_guest_members &&
          entertaiment.is_entertainment_rates_defined
            ? entertaiment.rate_per_guest_member
            : undefined,
        entertainment_rate_as_of_date:
          (entertaiment.can_have_guest_members ||
            entertaiment.can_have_staff_members) &&
          entertaiment.is_entertainment_rates_defined
            ? entertaiment.entertainment_rate_as_of_date
            : undefined,
        entertainment_rate_country: entertainment_rate_country_val.length
          ? entertainment_rate_country_val[0].id
          : null,
      };
    } else if (general_data.category === 'Petty Cash') {
      returnObj = {
        ...returnObj,
        ...pettyCash,
      };
    }
    /*
    check for this two
      "mileage_rates": [],
      "entertainment_rates": [],
     */
    return returnObj;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[createPostData', error);
  }
};

export const updatelistingFilterData = (data: IlistingFilterdata) => {
  return {
    type: UPDATE_LISTING_FILTER_DATA,
    payload: data,
  };
};

export const saveEntityCostCenterListLoader = (data: any) => ({
  type: SAVE_ENTITY_COST_CENTER_LOADER,
  payload: data,
});

export const saveEntityCostCenterList = (data: any[]) => ({
  type: SAVE_ENTITY_COST_CENTER,
  payload: data,
});

export const updateCostCenterForEntity = (
  uuid: any,
  index: any,
  isUpdateMode: any,
) => ({
  type: UPDATE_COST_CENTER_FOR_ENTITY,
  payload: {
    uuid,
    index,
    isUpdateMode,
  },
});

export const saveEntityTypes = (data: any[]) => ({
  type: SAVE_ENTITY_TYPES,
  payload: data,
});

export const saveLegalEntities = (data: any[]) => ({
  type: SAVE_ENTITY,
  payload: data,
});

export const saveExpandedItem = (data: any) => ({
  type: SAVE_EXPANDED_ITEM,
  payload: data,
});
