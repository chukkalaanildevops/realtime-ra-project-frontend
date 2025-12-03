import { AxiosError } from 'axios';
import { Dispatch } from 'react';
import DATA from './addNewBenefit.data.json';
import { getQueryString } from '../../utils/scroll.utils';
// import moment from 'moment';

import {
  getUserJobInfo,
  getLoggedInUserInfo,
  getUserEntitledBenefitList,
  getUserEntitledBenefitConfiguration,
  saveBenefitClaim,
  fetchBenefitClaimData,
  deleteBenefitClaim,
  saveBenefitClaimForApproval,
  getTaxPercentage,
  fetchDependentInfoAPI,
} from '../../services/benefitClaims';
// import { getDetailConfiguration } from '../../services/expenseTypeConfiguration';
// import {
//   apiCallRequest,
//   apiCallSuccess,
//   apiCalled,
//   saveUserEntitledExpenseTypeList,
//   updateEntitledBenefitListLoader,
// } from './addNewExpense.actions';

import {
  saveUserEntitledBenefitConfiguration,
  saveUserEntitledBenefitList,
  saveLoggedInUserInfo,
  saveUserJobInfo,
  saveBenefitCostCentreChageTo,
  saveBenefitCostCentreList,
  addUpdateBenefitFormData,
  updateBackendError,
  saveBenefitTypeLoader,
  saveUserEntitledBenefitListLoader,
  saveBenefitClaimData,
  fetchedBenfitClaimData,
  fetchedBenfitClaimDataLoader,
  setIsButtonDisable,
  setTaxPercentage,
  fetchDependentInfos,
  setDependentInfoStatus,
} from './store/benefit.action';

// import {
//   IpostData,
//   IgetUserEntitledExpenseTypeListprops,
//   IgetUserEntitledExpenseTypeListUsingRequestIdprops,
//   IexpenseTypeList,
//   TchargeToCodesForFetch,
//   IgetMileageRateProps,
// } from './addNewBenefit.model';
import {
  success,
  loading,
  destroy,
  error,
} from '../../shared/components/responcePopUp/responcePopUp';
import { getConversionRate } from '../../services/admin/currencyConversion';

import { stateInterface } from '../../shared/redux/rootReducer';
import { preciseDecimal } from '../../utils/global.utils';
import {
  getCostCentreChargeTo,
  getCostCentreList,
} from '../../services/expenseClaim';
import { TchargeToCodesForFetch } from './addNewBenefit.model';
import { fetchDraftsTabData } from '../draft/drafts.thunk';
import { message } from 'antd';
import { fetchSubmittedTabData } from '../submitted/submitted.thunk';

const handleCommonError = (err: AxiosError, defaultError: string) => {
  return () => {
    let errMsg =
      err?.response?.data?.error && err?.response?.data?.error !== ''
        ? err?.response?.data?.error
        : err?.response?.data?.hasOwnProperty('receipt_date')
        ? err?.response?.data?.receipt_date
        : defaultError;
    destroy();
    error(errMsg);
  };
};

export const fetchLoggedInUserInfo = () => {
  return async (dispatch: Dispatch<any>) => {
    try {
      // destroy();
      // loading(true, 'Loading Data');
      const res = await getLoggedInUserInfo();
      dispatch(saveLoggedInUserInfo(res.data));
      // loading(false);
      // destroy();
      return Promise.resolve(res.data);
    } catch (error) {
      loading(false);
      handleCommonError(error, 'Failed to load user information');
      return Promise.reject();
    }
  };
};

export const fetchUserJobInfo = (userId: number) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      // destroy();
      // loading(true, DATA.apiMessages.fetchUserJobInfo.loadingInfo);
      const res = await getUserJobInfo(userId);
      let resData = null;
      if (res.data.length) {
        res?.data?.detail?.length &&
          handleCommonError(
            res?.data?.detail[0],
            DATA.apiMessages.fetchUserJobInfo.Fail,
          );
      } else {
        resData = res.data;
        dispatch(saveUserJobInfo(resData));
        // destroy();
        // success(DATA.apiMessages.fetchUserJobInfo.Success);
      }
    } catch (error) {
      dispatch(
        handleCommonError(error, DATA.apiMessages.fetchUserJobInfo.Fail),
      );
    }
  };
};

export const fetchUserEntitledBenefitsList = (props: any) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      // destroy();
      // loading(true, DATA.apiMessages.fetchUserEntitledBenefitsList.loadingInfo);
      dispatch(saveUserEntitledBenefitListLoader(true));
      const res = await getUserEntitledBenefitList(props);
      const ActivateList: any[] = res.data.filter((o: any) => !o.is_lapsed);
      dispatch(saveUserEntitledBenefitList(ActivateList));
      loading(false);
      // destroy();
      // success(DATA.apiMessages.fetchUserEntitledBenefitsList.Success);
      dispatch(saveUserEntitledBenefitListLoader(false));
    } catch (error) {
      dispatch(saveUserEntitledBenefitListLoader(false));

      dispatch(
        handleCommonError(
          error,
          DATA.apiMessages.fetchUserEntitledBenefitsList.Fail,
        ),
      );
    }
  };
};

export const fetchUserEntitledBenefitsConfiguration = (
  id: any,
  claimDate: string,
) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      destroy();
      // loading(true, DATA.apiMessages.fetchUserEntitledBenefitsList.loadingInfo);
      dispatch(saveBenefitTypeLoader(true));
      const res = await getUserEntitledBenefitConfiguration(id, claimDate);
      dispatch(saveUserEntitledBenefitConfiguration(res.data));
      dispatch(
        addUpdateBenefitFormData(
          'benefit_type_legal_entity',
          res.data?.benefit_type_legal_entity,
        ),
      );
      // loading(false);
      // destroy();
      // success(DATA.apiMessages.fetchUserEntitledBenefitsList.Success);
      dispatch(saveBenefitTypeLoader(false));
    } catch (error) {
      dispatch(saveBenefitTypeLoader(false));

      dispatch(
        handleCommonError(
          error,
          DATA.apiMessages.fetchUserEntitledBenefitsList.Fail,
        ),
      );
    }
  };
};
export const fetchDependentInfo = (
  relationship: any,
  employee_id: any,
  date: any,
) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      destroy();
      // loading(true, DATA.apiMessages.fetchUserEntitledBenefitsList.loadingInfo);
      dispatch(setDependentInfoStatus(true));
      const res = await fetchDependentInfoAPI(relationship, employee_id, date);
      dispatch(fetchDependentInfos(res.data));
      dispatch(setDependentInfoStatus(false));
    } catch (error) {
      dispatch(setDependentInfoStatus(false));
    }
  };
};
// getUserEntitledBenefitConfiguration

export const fetchBenefitCostCentreChageTo = () => {
  return async (dispatch: Dispatch<any>) => {
    try {
      // destroy();
      // loading(true, DATA.apiMessages.fetchCostCentreChageTo.loadingInfo);

      const res = await getCostCentreChargeTo();
      dispatch(saveBenefitCostCentreChageTo(res.data));
      // loading(false);
      // success(DATA.apiMessages.fetchCostCentreChageTo.Success);
      // loading(false);
    } catch (error) {
      dispatch(
        handleCommonError(error, DATA.apiMessages.fetchCostCentreChageTo.Fail),
      );
    }
  };
};

export const fetchBenefitCostCentreList = (
  chargeTo: TchargeToCodesForFetch,
  legalEntityUuid?: string,
  callBack?: Function,
) => {
  return async (dispatch: Dispatch<any>, getState: () => stateInterface) => {
    try {
      const { userJobInfo } = getState().BenefitReducer;
      const { currentEmployee } = getState().admin;
      const isAdminEdit = getQueryString('mode') === 'admin' ? true : false;
      // destroy();
      // loading(true, DATA.apiMessages.fetchCostCentreList.loadingInfo);
      const res = await getCostCentreList(chargeTo, legalEntityUuid);
      let data = res.data;
      if (chargeTo === 'LOCAL' && userJobInfo?.cost_centre && !isAdminEdit) {
        data = [
          ...res.data.filter(
            (o: any) => o.uuid !== userJobInfo?.cost_centre.uuid,
          ),
        ];
        data.push({
          code: userJobInfo?.cost_centre.code,
          id: userJobInfo?.cost_centre.id,
          title: userJobInfo?.cost_centre.title,
          uuid: userJobInfo?.cost_centre.uuid,
        });
      } else if (
        chargeTo === 'LOCAL' &&
        currentEmployee?.cost_centre &&
        isAdminEdit
      ) {
        data = [
          ...res.data.filter(
            (o: any) => o.uuid !== currentEmployee?.cost_centre.uuid,
          ),
        ];
        data.push({
          code: currentEmployee?.cost_centre.code,
          id: currentEmployee?.cost_centre.id,
          title: currentEmployee?.cost_centre.title,
          uuid: currentEmployee?.cost_centre.uuid,
        });
      }
      dispatch(saveBenefitCostCentreList(data));
      // success(DATA.apiMessages.fetchCostCentreList.Success);

      callBack && callBack();
      return data;
    } catch (error) {
      dispatch(
        handleCommonError(error, DATA.apiMessages.fetchCostCentreList.Fail),
      );
    }
  };
};

export const sendBenefitClaim = (
  isAdminEdit: boolean,
  data: any,
  benefitClaimId: number,
  callback: Function,
) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(setIsButtonDisable(true));
      await saveBenefitClaim(isAdminEdit, data, benefitClaimId);
      dispatch(setIsButtonDisable(false));

      callback();
    } catch (e) {
      if (
        e?.response?.status === 400 ||
        e?.response?.statusText === 'Bad Request'
      ) {
        dispatch(updateBackendError(e.response.data));
      } else {
        error(e.response.data.error);
      }
      dispatch(setIsButtonDisable(false));
      if (e?.response?.data?.is_lapsed) {
        message.destroy();
        message.error(e?.response?.data?.is_lapsed[0]);
      }
      if (e?.response?.data?.details) {
        message.destroy();
        message.error(e?.response?.data?.details[0]);
      }
    }
  };
};

export const sendBenefitClaimForApproval = (
  data: any,
  benefitClaimId: number,
  callback: Function,
) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(setIsButtonDisable(true));

      await saveBenefitClaimForApproval(data, benefitClaimId);
      dispatch(setIsButtonDisable(false));

      callback();
    } catch (e) {
      if (
        e?.response?.status === 400 ||
        e?.response?.statusText === 'Bad Request'
      ) {
        dispatch(updateBackendError(e.response.data));
      }
      dispatch(setIsButtonDisable(false));
      if (e?.response?.data?.is_lapsed) {
        message.destroy();
        message.error(e?.response?.data?.is_lapsed[0]);
      }
      if (e?.response?.data?.details) {
        message.destroy();
        message.error(e?.response?.data?.details[0]);
      }
    }
  };
};

export const fetchCoversionRate = (
  date: string,
  target: number,
  base: number,
  callback?: Function,
  // _calledFrom?: string,
) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      const res = await getConversionRate(date, base, target);
      const conversionRate = Number(
        preciseDecimal(res.data.conversion_rate, 5),
      );
      dispatch(addUpdateBenefitFormData('conversion_rate', conversionRate));

      callback && callback(conversionRate);
    } catch (error) {
      if (
        error?.response?.status === 404 &&
        error?.response?.statusText === 'Not Found'
      ) {
        dispatch(addUpdateBenefitFormData('conversion_rate', null));
        dispatch(updateBackendError(error.response.data));
      }
    }
  };
};

export const fetchTaxPercentage = (data: any, callBack?: Function) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      const res = await getTaxPercentage(data);
      dispatch(setTaxPercentage(res?.data?.tax_percentage));
      callBack && callBack(res.data);
    } catch (error) {
      if (
        error?.response?.status === 404 ||
        error?.response?.statusText === 'Bad Request'
      ) {
        dispatch(updateBackendError(error.response.data));
      } else {
        dispatch(handleCommonError(error, 'Failed to get tax percentage'));
      }
    }
  };
};

export const fetchBenefitClaim = (id: number) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(fetchedBenfitClaimDataLoader(true));
      const res = await fetchBenefitClaimData(id);
      const benefitTypeId = res.data.benefit_entitlement;
      dispatch(
        fetchUserEntitledBenefitsConfiguration(benefitTypeId, res.data.date),
      );

      if (res.data?.charge_to?.code && res.data?.charge_to?.code !== 'THIRD') {
        dispatch(fetchBenefitCostCentreList(res.data?.charge_to?.code));
      }
      dispatch(fetchedBenfitClaimData(res.data));
      dispatch(saveBenefitClaimData(res.data));
      dispatch(fetchedBenfitClaimDataLoader(false));
      return;
    } catch (e) {
      dispatch(fetchedBenfitClaimDataLoader(false));
    }
  };
};

export const deleteBenefitById = (
  id: number,
  type: 'benefit',
  filters: any,
  pageSize?: number,
) => {
  return (dispatch: Dispatch<any>) => {
    loading(true, 'Deleting benefit');
    deleteBenefitClaim(id)
      .then(() => {
        dispatch(fetchDraftsTabData(type, 1, filters, pageSize));
      })
      .then(() => {
        destroy();
        success('Benefit deleted successfully');
      })
      .catch(() => {
        destroy();
        error('Failed to delete benefit');
      });
  };
};

export const deleteBenefitByIdInSubmitted = (
  id: number,
  type: 'benefit',
  filters: any,
  pageSize?: number,
) => {
  return (dispatch: Dispatch<any>) => {
    loading(true, 'Deleting benefit');
    deleteBenefitClaim(id)
      .then(() => {
        dispatch(fetchSubmittedTabData(type, 1, filters, pageSize));
      })
      .then(() => {
        destroy();
        success('Benefit deleted successfully');
      })
      .catch(() => {
        destroy();
        error('Failed to delete benefit');
      });
  };
};
