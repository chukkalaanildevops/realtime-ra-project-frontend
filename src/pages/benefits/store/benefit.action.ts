import moment from 'moment';
import { Dispatch } from 'react';
import { stateInterface } from '../../../shared/redux/rootReducer';

export const BENEFIT_ACTIONS = {
  SAVE_LOGIN_USER_INFO: 'BENEFIT_ACTIONS.SAVE_LOGIN_USER_INFO',
  RESET_TO_INITIAL: 'BENEFIT_ACTIONS.RESET_TO_INITIAL',
  RESET_FIELDS_ON_TYPE_CHANGE: 'BENEFIT_ACTIONS.RESET_FIELDS_ON_TYPE_CHANGE',
  RECEIPT_DATE_FIELD_ON_CHANGE: 'BENEFIT_ACTIONS.RECEIPT_DATE_FIELD_ON_CHANGE',
  RECEIPT_GALLERY_DATE_FIELD_ON_CHANGE: 'RECEIPT_GALLERY_DATE_FIELD_ON_CHANGE',
  SAVE_USER_JOB_INFO: 'BENEFIT_ACTIONS.SAVE_USER_JOB_INFO',
  SAVE_USER_ENTITLED_BENEFIT_LIST:
    'BENEFIT_ACTIONS.SAVE_USER_ENTITLED_BENEFIT_LIST',
  SAVE_USER_ENTITLED_BENEFIT_LIST_LOADER:
    'BENEFIT_ACTIONS.SAVE_USER_ENTITLED_BENEFIT_LIST_LOADER',
  SAVE_USER_ENTITLED_BENEFIT_CONFIG:
    'BENEFIT_ACTIONS.SAVE_USER_ENTITLED_BENEFIT_CONFIG',
  SAVE_USER_BENEFIT_COST_CENTER_CHARGE_TO:
    'BENEFIT_ACTIONS.SAVE_USER_BENEFIT_COST_CENTER_CHARGE_TO',
  SAVE_USER_BENEFIT_COST_CENTER_LIST:
    'BENEFIT_ACTIONS.SAVE_USER_BENEFIT_COST_CENTER_LIST',
  ADD_UPDATE_BENEFIT_FORM_DATA: 'BENEFIT_ACTIONS.ADD_UPDATE_BENEFIT_FORM_DATA',
  SAVE_SELECTED_BENEFIT_TYPE: 'BENEFIT_ACTIONS.SAVE_SELECTED_BENEFIT_TYPE',
  SAVE_SELECTED_BENEFIT_TYPE_LOADER:
    'BENEFIT_ACTIONS.SAVE_SELECTED_BENEFIT_TYPE_LOADER',
  UPDATE_BACKEND_ERROR: 'BENEFIT_ACTIONS.UPDATE_BACKEND_ERROR',
  UPDATE_BACKEND_WARNING: 'BENEFIT_ACTIONS.UPDATE_BACKEND_WARNING',
  SET_BENEFIT_FORM_DATA: 'BENEFIT_ACTIONS.SET_BENEFIT_FORM_DATA',
  FETCHED_BENEFIT_CLAIM_DATA: 'BENEFIT_ACTIONS.FETCHED_BENEFIT_CLAIM_DATA',
  FETCHED_BENEFIT_CLAIM_DATA_LOADER:
    'BENEFIT_ACTIONS.FETCHED_BENEFIT_CLAIM_DATA_LOADER',
  SET_DISABLE_BUTTON: 'BENEFIT_ACTIONS.SET_DISABLE_BUTTON',
  UPDATE_DEFAULT_TAX_AMOUNT: 'UPDATE_DEFAULT_TAX_AMOUNT',
  UPDATE_DEFAULT_CONVERSION_RATE: 'UPDATE_DEFAULT_CONVERSION_RATE',
  SET_TAX_PERCENTAGE: 'BENEFIT_ACTIONS/SET_TAX_PERCENTAGE',
  SET_BENEFIT_DEPENDENT_INFO: 'BENEFIT_ACTIONS/SET_BENEFIT_DEPENDENT_INFO',
  SET_BENEFIT_DEPENDENT_INFO_STATUS:
    'BENEFIT_ACTIONS/SET_BENEFIT_DEPENDENT_INFO_STATUS',
};

// LOADERS //

// Data Stores Functions//

export const addUpdateBenefitFormData: any = (key: string, value: any) => {
  let data: { [key: string]: any } = { [key]: value };
  return {
    type: BENEFIT_ACTIONS.ADD_UPDATE_BENEFIT_FORM_DATA,
    payload: data,
  };
};

export const saveLoggedInUserInfo: any = (data: any) => ({
  type: BENEFIT_ACTIONS.SAVE_LOGIN_USER_INFO,
  payload: data,
});

export const fetchedBenfitClaimData: any = (data: any) => ({
  type: BENEFIT_ACTIONS.FETCHED_BENEFIT_CLAIM_DATA,
  payload: data,
});

export const fetchedBenfitClaimDataLoader: any = (data: any) => ({
  type: BENEFIT_ACTIONS.FETCHED_BENEFIT_CLAIM_DATA_LOADER,
  payload: data,
});

export const saveBenefitTypeLoader: any = (data: any) => ({
  type: BENEFIT_ACTIONS.SAVE_SELECTED_BENEFIT_TYPE_LOADER,
  payload: data,
});

export const setTaxPercentage = (data: any) => ({
  type: BENEFIT_ACTIONS.SET_TAX_PERCENTAGE,
  payload: data,
});

export const updateBackendError: any = (data: any) => ({
  type: BENEFIT_ACTIONS.UPDATE_BACKEND_ERROR,
  payload: data,
});
export const updateBackendWarning: any = (data: any) => ({
  type: BENEFIT_ACTIONS.UPDATE_BACKEND_WARNING,
  payload: data,
});
export const setSelectedBenefitType: any = (data: any) => ({
  type: BENEFIT_ACTIONS.SAVE_SELECTED_BENEFIT_TYPE,
  payload: data,
});

export const resetToInitial: any = () => ({
  type: BENEFIT_ACTIONS.RESET_TO_INITIAL,
});
export const resetOnTypeChange: any = () => ({
  type: BENEFIT_ACTIONS.RESET_FIELDS_ON_TYPE_CHANGE,
});

export const receiptDateFieldOnChange: any = (data: any) => ({
  type: BENEFIT_ACTIONS.RECEIPT_DATE_FIELD_ON_CHANGE,
  payload: data,
});

export const receiptGalleryDateFieldOnChange: any = (data: any) => ({
  type: BENEFIT_ACTIONS.RECEIPT_GALLERY_DATE_FIELD_ON_CHANGE,
  payload: data,
});

export const saveUserJobInfo: any = (data: any) => ({
  type: BENEFIT_ACTIONS.SAVE_USER_JOB_INFO,
  payload: data,
});

export const saveUserEntitledBenefitList: any = (data: any) => ({
  type: BENEFIT_ACTIONS.SAVE_USER_ENTITLED_BENEFIT_LIST,
  payload: data,
});

export const saveUserEntitledBenefitListLoader: any = (data: any) => ({
  type: BENEFIT_ACTIONS.SAVE_USER_ENTITLED_BENEFIT_LIST_LOADER,
  payload: data,
});

export const saveUserEntitledBenefitConfiguration: any = (data: any) => ({
  type: BENEFIT_ACTIONS.SAVE_USER_ENTITLED_BENEFIT_CONFIG,
  payload: data,
});

export const saveBenefitCostCentreChageTo: any = (data: any) => ({
  type: BENEFIT_ACTIONS.SAVE_USER_BENEFIT_COST_CENTER_CHARGE_TO,
  payload: data,
});

export const saveBenefitCostCentreList: any = (data: any) => ({
  type: BENEFIT_ACTIONS.SAVE_USER_BENEFIT_COST_CENTER_LIST,
  payload: data,
});

export const setBenefitFormData: any = (data: any) => ({
  type: BENEFIT_ACTIONS.SET_BENEFIT_FORM_DATA,
  payload: data,
});
export const setIsButtonDisable: any = (data: any) => ({
  type: BENEFIT_ACTIONS.SET_DISABLE_BUTTON,
  payload: data,
});
export const updateDefaultTaxAmount: any = (amt: any) => {
  return {
    type: BENEFIT_ACTIONS.UPDATE_DEFAULT_TAX_AMOUNT,
    payload: amt,
  };
};
export const updateDefaultConversionRate: any = (rate: any) => {
  return {
    type: BENEFIT_ACTIONS.UPDATE_DEFAULT_CONVERSION_RATE,
    payload: rate,
  };
};
export const fetchDependentInfos: any = (list: any) => {
  return {
    type: BENEFIT_ACTIONS.SET_BENEFIT_DEPENDENT_INFO,
    payload: list,
  };
};

export const setDependentInfoStatus: any = (status: any) => {
  return {
    type: BENEFIT_ACTIONS.SET_BENEFIT_DEPENDENT_INFO_STATUS,
    payload: status,
  };
};

export const saveBenefitClaimData = (data: any) => {
  return (dispatch: Dispatch<any>, _getState: () => stateInterface) => {
    try {
      // const { AddNewExpenseForm } = getState();
      // const isViewMode = AddNewExpenseForm.viewOnly;
      // const isClone = AddNewExpenseForm.mode === 'CLONE';
      const _formData = {
        claim_number: data.claim_number,
        benefit_type_legal_entity: data.benefit_type_legal_entity.id,
        benefit_entitlement: data.benefit_entitlement,
        dependent_uuid: data.dependent_uuid,
        benefit_category: data?.benefit_category?.id
          ? data?.benefit_category?.id
          : null,
        wage_type: data?.wage_type ? data.wage_type : null,
        // expense_type_legal_entity: isViewMode
        //   ? data.expense_type_legal_entity.expense_type.title
        //   : data.expense_type_legal_entity.id,
        date: moment(data?.date, ['DD/MM/YYYY']),
        // date: isClone ? '' : moment(data?.date, ['DD/MM/YYYY']),
        purpose: data.purpose,
        currency:
          data?.currency?.id || data?.converted_amount_currency?.id || null,
        // currency: isViewMode
        // ? data?.currency?.currency?.title
        // : data?.currency?.id || data?.converted_amount_currency?.id || null,

        amount: Number(data?.amount) || 0,

        conversion_rate: Number(data?.conversion_rate) || 1,

        converted_amount: Number(data?.converted_amount) || 0,

        payable_amount: Number(data?.amount_before_conversion) || 0,

        tax_amount: Number(data?.tax_amount) || 0,

        amount_before_taxes: Number(data?.amount_before_taxes) || 0,

        // purpose: data.purpose || '',

        receipt: data?.receipt
          ? data?.receipt[0]?.file
            ? [data?.receipt[0]?.file]
            : []
          : [],

        // receipt: isClone
        // ? []
        // : data?.receipt
        // ? data?.receipt[0]?.file
        //   ? [data?.receipt[0]?.file]
        //   : []
        // : [],
        is_no_receipt: data?.is_no_receipt,

        receipt_number: data?.receipt
          ? data?.receipt[0]?.receipt_number
            ? data?.receipt[0]?.receipt_number
            : ''
          : '',
        // receipt_number: isClone
        // ? ''
        // : data?.receipt
        // ? data?.receipt[0]?.receipt_number
        //   ? data?.receipt[0]?.receipt_number
        //   : ''
        // : '',

        no_receipt_remark: data?.no_receipt_remark || '',

        cost_centre_uuid: data?.cost_centre?.uuid || '',
        // cost_centre_uuid: isViewMode
        // ? data?.cost_centre?.title || ''
        // : data?.cost_centre?.uuid || '',

        charge_to: data?.charge_to?.code || '',

        third_party_vendor: data?.third_party_vendor || '',

        custom_fields: data?.custom_fields || [],

        supporting_documents: data?.supporting_documents || [],
        // supporting_documents: isClone ? [] : data?.supporting_documents || [],

        // entertainment_form: {
        //   entertainment_staff_members: data?.entertainment_staff_members.length
        //     ? data?.entertainment_staff_members
        //     : [],

        //   entertainment_guest_members: data?.entertainment_guest_members.length
        //     ? data?.entertainment_guest_members
        //     : [],
        // },
        // mileage_form: {
        //   mileage_records: data?.mileage_records ? data?.mileage_records : [],
        // },
        // petty_cash_form: {
        //   ...(data?.voucher_number
        //     ? { voucher_number: data?.voucher_number }
        //     : {}),
        // },
      };

      // dispatch(updateExpenseClaimFetchedData(data));
      // dispatch(updateFormData('', 'form_data', _formData));
      data?.benefit_category &&
        !data?.benefit_category.is_active &&
        dispatch(
          updateBackendWarning({
            benefit_category: [
              `Benefit Category ${data.benefit_category.title} is either Inactive`,
            ],
          }),
        );
      dispatch(
        updateDefaultTaxAmount(
          Number(Number(data?.system_tax_amount).toFixed(2)),
        ),
      );
      dispatch(
        updateDefaultConversionRate(
          Number(Number(data?.system_conversion_rate).toFixed(2)),
        ),
      );

      dispatch(setBenefitFormData(_formData));
    } catch (error) {
      console.error(error);
    }
  };
};
