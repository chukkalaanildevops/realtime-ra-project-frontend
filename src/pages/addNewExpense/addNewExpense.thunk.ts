import {
  // getLoggedInUserInfo,
  getUserJobInfo,
  getUserEntitledExpenseTypeList,
  postExpenseClaimGeneral,
  getCostCentreChargeTo,
  getExpenseClaimData,
  putExpenseClaimGeneral,
  getLoggedInUserInfo,
  getStaffMembersJobInfoList,
  getUserEntitledExpenseTypeListUsingRequestId,
  validateTripDetails,
  validateAllowanceDetails,
  getCostCentreList,
  getMileageRate,
  fetchPettyCashManagerTransactionMetaAPI,
  updateTripDetails,
  updateAllowanceDetails,
  fetchFilteredLocations,
  getAllowanceRate,
  getTaxPercentage,
  getExpenseClaimViolationData,
  getExpenseClaimViolationChecker,
} from '../../services/expenseClaim';
import { getDetailConfiguration } from '../../services/expenseTypeConfiguration';
import { getPlacesDistanceAPI } from '../../services/geoLocation';
import {
  apiCallRequest,
  apiCallSuccess,
  apiCallFail,
  apiCalled,
  // saveLoggedInUserInfo,
  saveUserJobInfo,
  saveUserEntitledExpenseTypeList,
  updateBackendError,
  saveCostCentreChageTo,
  saveConfiguration,
  updateFormData,
  saveExpenseClaimData,
  updateUpdateSelectedExpenseType,
  updateExpenseTypeListLoader,
  saveLoggedInUserInfo,
  updateStaffMembersJobInfoListLoader,
  updateStaffMembersJobInfoList,
  setFetchedConversionRate,
  setSystemFetchedConversionRate,
  updateTabKey,
  updateTripDetailError,
  setTripDetailsLoader,
  setCostCenterListLoader,
  setCostCenterList,
  setMileageAmount,
  setPettyCashManagerTransactionMeta,
  saveLocations,
  setAllowanceRate,
  setTaxPercentage,
  setTaxPercentageStatus,
  saveExpenseClaimDataViolationData,
  setExpenseClaimDataViolationDataLoader,
  setIsViolationModalData,
  saveExpenseClaimDataViolationCheckerData,
} from './addNewExpense.actions';

import {
  setSelectedExpenseTypeForAllowance,
  saveExpenseTypeListAllowance,
  updateExpenseTypeListLoaderAllowance,
  saveCostCentreChargeToForAllowance,
} from './components/allowanceNew/allowanceNew.actions';
import { Dispatch } from 'react';
import DATA from './addNewExpense.data.json';
import {
  IgetUserEntitledExpenseTypeListprops,
  IgetUserEntitledExpenseTypeListUsingRequestIdprops,
  IexpenseTypeList,
  TchargeToCodesForFetch,
  IgetMileageRateProps,
} from './addNewExpense.model';
import {
  destroy,
  error,
} from '../../shared/components/responcePopUp/responcePopUp';
import {
  getConversionRate,
  getAllowanceConversionRate,
} from '../../services/admin/currencyConversion';
import { message } from 'antd';

//import { getConversionRate } from '../../services/admin/currencyConversion';
import { AxiosError, AxiosResponse } from 'axios';
import { stateInterface } from '../../shared/redux/rootReducer';
import moment from 'moment';
import { apiCallReset } from '../../shared/redux/wageType/wageType.actions';
import { preciseDecimal } from '../../utils/global.utils';
import { fetchCostCentreListAllowance } from './components/allowanceNew/allowanceNew.thunk';

const handleCommonError = (err: AxiosError, defaultError: string) => {
  return (dispatch: Dispatch<any>) => {
    let errMsg =
      err?.response?.data?.error && err?.response?.data?.error !== ''
        ? err?.response?.data?.error
        : err?.response?.data?.hasOwnProperty('receipt_date')
        ? err?.response?.data?.receipt_date
        : defaultError;
    dispatch(apiCalled(false));
    destroy();
    error(errMsg);
  };
};

export const MileageAmountError = (error: any, body: any) => {
  if (
    (error?.response?.data?.amount ||
      error?.response?.data?.converted_amount) &&
    body?.mileage_records
  ) {
    message.destroy();
    message.error(
      (error?.response?.data?.amount && error?.response?.data?.amount[0]) ||
        (error?.response?.data?.converted_amount &&
          error?.response?.data?.converted_amount[0]),
    );
  }
};

export const AllowanceTotalAmountError = (error: any, body: any) => {
  if (
    (error?.response?.data?.amount ||
      error?.response?.data?.converted_amount) &&
    body?.allowance_records
  ) {
    message.destroy();
    message.error(
      (error.response?.data?.amount && error?.response?.data?.amount[0]) ||
        (error.response?.data?.converted_amount &&
          error.response?.data?.converted_amount[0]),
    );
  }
};

/**
 * Api call to get logged in user info
 */
export const fetchLoggedInUserInfo = () => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(apiCalled(true));
      const res = await getLoggedInUserInfo();
      dispatch(saveLoggedInUserInfo(res.data));
      dispatch(apiCalled(false));
      return Promise.resolve(res.data);
    } catch (error) {
      dispatch(apiCalled(false));
      handleCommonError(error, 'Failed to load user information');
      return Promise.reject();
    }
  };
};

/**
 * Api call to get user job information
 * @param {number} userId : we are fetchin user
 */
export const fetchUserJobInfo = (userId: number) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(apiCalled(true));
      dispatch(apiCallRequest(DATA.apiMessages.fetchUserJobInfo.loadingInfo));
      const res = await getUserJobInfo(userId);
      let resData = null;
      if (res.data.length) {
        res?.data?.detail?.length &&
          dispatch(apiCallFail(res?.data?.detail[0]));
      } else {
        resData = res.data;
        dispatch(saveUserJobInfo(resData));
        dispatch(apiCallSuccess(DATA.apiMessages.fetchUserJobInfo.Success));
      }
      dispatch(apiCalled(false));
    } catch (error) {
      dispatch(apiCalled(false));
      dispatch(
        handleCommonError(error, DATA.apiMessages.fetchUserJobInfo.Fail),
      );
    }
  };
};

/**
 * Api call to get expense type list entitled with passed userId
 * @param userId
 * @param category :: category to get that specific category data.
 */
export const fetchUserEntitledExpenseTypeList = (
  props: IgetUserEntitledExpenseTypeListprops,
) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(apiCalled(true));
      dispatch(
        apiCallRequest(
          DATA.apiMessages.fetchUserEntitledExpenseTypeList.loadingInfo,
        ),
      );
      dispatch(updateExpenseTypeListLoader(true));
      dispatch(updateExpenseTypeListLoaderAllowance(true));

      const res = await getUserEntitledExpenseTypeList(props);

      const ActivateList: IexpenseTypeList[] = res.data.filter(
        (o: IexpenseTypeList) => o.is_active,
      );

      dispatch(saveUserEntitledExpenseTypeList(ActivateList));
      dispatch(saveExpenseTypeListAllowance(ActivateList));
      dispatch(
        apiCallSuccess(
          DATA.apiMessages.fetchUserEntitledExpenseTypeList.Success,
        ),
      );
      dispatch(apiCalled(false));
      dispatch(updateExpenseTypeListLoader(false));
      dispatch(updateExpenseTypeListLoaderAllowance(false));
    } catch (error) {
      dispatch(
        handleCommonError(
          error,
          DATA.apiMessages.fetchUserEntitledExpenseTypeList.Fail,
        ),
      );
      dispatch(apiCalled(false));
      dispatch(updateExpenseTypeListLoader(false));
      dispatch(updateExpenseTypeListLoaderAllowance(false));
    }
  };
};

/**
 * Api call to get expense type list using request id
 * @param requestId
 * @param category :: category to get that specific category data.
 */
export const fetchUserEntitledExpenseTypeListUsingRequestId = (
  props: IgetUserEntitledExpenseTypeListUsingRequestIdprops,
) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(apiCalled(true));

      dispatch(
        apiCallRequest(
          DATA.apiMessages.fetchUserEntitledExpenseTypeList.loadingInfo,
        ),
      );
      dispatch(updateExpenseTypeListLoader(true));
      dispatch(updateExpenseTypeListLoaderAllowance(true));
      const res = await getUserEntitledExpenseTypeListUsingRequestId(props);
      dispatch(saveUserEntitledExpenseTypeList(res.data));
      dispatch(saveExpenseTypeListAllowance(res.data));
      dispatch(
        apiCallSuccess(
          DATA.apiMessages.fetchUserEntitledExpenseTypeList.Success,
        ),
      );
      dispatch(updateExpenseTypeListLoader(false));
      dispatch(updateExpenseTypeListLoaderAllowance(false));
      dispatch(apiCalled(false));
    } catch (error) {
      dispatch(
        handleCommonError(
          error,
          DATA.apiMessages.fetchUserEntitledExpenseTypeList.Fail,
        ),
      );
      dispatch(apiCalled(false));

      dispatch(updateExpenseTypeListLoader(false));
      dispatch(updateExpenseTypeListLoaderAllowance(false));
    }
  };
};

/**
 * Api call to get list of charge to data
 */
export const fetchCostCentreChageTo = () => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(apiCalled(true));

      dispatch(
        apiCallRequest(DATA.apiMessages.fetchCostCentreChageTo.loadingInfo),
      );
      const res = await getCostCentreChargeTo();
      dispatch(saveCostCentreChageTo(res.data));
      dispatch(saveCostCentreChargeToForAllowance(res.data));
      dispatch(apiCallSuccess(DATA.apiMessages.fetchCostCentreChageTo.Success));
      dispatch(apiCalled(false));
    } catch (error) {
      dispatch(
        handleCommonError(error, DATA.apiMessages.fetchCostCentreChageTo.Fail),
      );
      dispatch(apiCalled(false));
    }
  };
};

/**
 * Api call to get detail configuration
 */
export const fetchDetailConfiguration = (id: number, callback?: Function) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(apiCalled(true));

      dispatch(
        apiCallRequest(DATA.apiMessages.fetchDetailConfiguration.loadingInfo),
      );
      const res = await getDetailConfiguration(String(id));
      dispatch(saveConfiguration(res.data));
      dispatch(
        apiCallSuccess(DATA.apiMessages.fetchDetailConfiguration.Success),
      );
      dispatch(updateBackendError({}));
      dispatch(apiCalled(false));
      callback && callback(res.data);
    } catch (error) {
      dispatch(
        handleCommonError(
          error,
          DATA.apiMessages.fetchDetailConfiguration.Fail,
        ),
      );
      dispatch(apiCalled(false));
    }
  };
};

/**
 * Api call to get expense claim data
 */
export const fetchExpenseClaimData = (id: number, callback?: Function) => {
  return async (dispatch: Dispatch<any>, getState: () => stateInterface) => {
    try {
      dispatch(apiCalled(true));

      dispatch(
        apiCallRequest(DATA.apiMessages.fetchExpenseClaimData.loadingInfo),
      );
      const res = await getExpenseClaimData(id);
      const legalEntity = res?.data?.expense_type_legal_entity;
      const category: string = legalEntity.expense_type.category.title;

      dispatch(
        updateTabKey(
          category === 'Petty Cash' ? 'petty' : (category.toLowerCase() as any),
        ),
      );

      let _Date = moment(res.data.date, 'DD/MM/YYYY').format('DD-MM-YYYY'),
        _baseC = Number(res.data.currency.currency?.id),
        _targetC = Number(res.data.converted_amount_currency.currency?.id),
        isSameCurrency = _baseC === _targetC;

      if (!isSameCurrency && getState().AddNewExpenseForm.mode === 'UPDATE')
        await dispatch(fetchCoversionRate(_Date, _baseC, _targetC)); //fetch currency if selected different.

      if (legalEntity) {
        await dispatch(updateUpdateSelectedExpenseType(legalEntity)); //saving legal entity [selected]. after data save configuration api calls.
        if (getState().AddNewExpenseForm.mode === 'UPDATE') {
          await dispatch(setSelectedExpenseTypeForAllowance(legalEntity));
        }
      }
      // debugger;
      // if (getState().AddNewExpenseForm.activeTabKey === 'mileage') {
      //   dispatch(setMileageRate(Number(res?.data?.mileage_records[0]?.rate)));
      // }
      dispatch(saveExpenseClaimData(res.data));

      if (res.data.charge_to.code && res.data.charge_to.code !== 'THIRD') {
        let config = await getDetailConfiguration(
          String(res.data.expense_type_legal_entity?.global_configuration),
        );

        if (
          res.data.charge_to.code === 'LOCAL' &&
          Number(res.data?.amount) <
            Number(config.data?.local_cc_threshold_amount)
        ) {
          dispatch(
            fetchCostCentreList(
              res.data.charge_to.code,
              res.data?.expense_type_legal_entity?.legal_entity?.uuid,
            ),
          );

          if (getState().AddNewExpenseForm.activeTabKey === 'allowance') {
            dispatch(
              fetchCostCentreListAllowance(
                res.data.charge_to.code,
                res.data?.expense_type_legal_entity?.legal_entity?.uuid,
              ),
            );
          }
        } else {
          dispatch(fetchCostCentreList(res.data.charge_to.code));
          if (getState().AddNewExpenseForm.activeTabKey === 'allowance') {
            dispatch(fetchCostCentreListAllowance(res.data.charge_to.code));
          }
        }
      }
      dispatch(apiCallSuccess(DATA.apiMessages.fetchExpenseClaimData.Success));
      dispatch(apiCalled(false));

      callback && callback(res.data);
    } catch (error) {
      dispatch(
        handleCommonError(error, DATA.apiMessages.fetchExpenseClaimData.Fail),
      );
      dispatch(apiCalled(false));
    }
  };
};

/**
 * Api call to send expense claim of general category for approvals.
 */
export const sendExpenseClaimGeneralCategoryForApprovals = (
  body: any,
  isForAprovals: boolean,
  callback?: Function,
) => {
  const draftOrApprovals = isForAprovals
    ? 'expenseClaimSendForApproval'
    : 'createExpenseClaimGeneral';
  return async (dispatch: Dispatch<any>, getState: () => stateInterface) => {
    const { isForRequest } = getState().AddNewExpenseForm;
    try {
      dispatch(apiCalled(true));
      dispatch(apiCallRequest(DATA.apiMessages[draftOrApprovals].loadingInfo));
      await postExpenseClaimGeneral(body, isForAprovals);

      if (isForRequest) {
        dispatch(apiCallRequest());
      } else {
        dispatch(apiCallSuccess(DATA.apiMessages[draftOrApprovals].Success));
      }

      dispatch(updateBackendError({}));
      dispatch(apiCalled(false));

      callback && callback();
    } catch (error) {
      if (
        error?.response?.status === 400 ||
        error?.response?.statusText === 'Bad Request'
      ) {
        dispatch(updateBackendError(error.response.data));
      }

      dispatch(apiCalled(false));

      error?.response?.data?.non_field_errors &&
        dispatch(
          handleCommonError(error, error?.response?.data?.non_field_errors[0]),
        );
      MileageAmountError(error, body);
      AllowanceTotalAmountError(error, body);
      if (error?.response?.data?.is_lapsed) {
        message.destroy();
        message.error(error?.response?.data?.is_lapsed[0]);
      }
      if (error?.response?.data?.details) {
        message.destroy();
        message.error(error?.response?.data?.details[0]);
      }
    }
  };
};

export const updateExpenseClaim = (
  body: any,
  id: number,
  isForAprovals: boolean,
  callback?: Function,
) => {
  return async (dispatch: Dispatch<any>, getState: () => stateInterface) => {
    const { isForRequest, isAdminEdit } = getState().AddNewExpenseForm;
    const key = isForAprovals
      ? 'expenseClaimSendForApproval'
      : 'updateExpenseClaim';
    try {
      dispatch(apiCalled(true));

      dispatch(apiCallRequest(DATA.apiMessages[key].loadingInfo));
      await putExpenseClaimGeneral(id, body, isForAprovals, isAdminEdit);
      if (isForRequest) {
        dispatch(apiCallRequest());
      } else {
        dispatch(apiCallSuccess(DATA.apiMessages[key].Success));
      }
      dispatch(updateBackendError({}));
      dispatch(apiCalled(false));

      callback && callback();
    } catch (error) {
      if (
        error?.response?.status === 400 ||
        error?.response?.statusText === 'Bad Request'
      ) {
        dispatch(updateBackendError(error.response.data));
      }
      dispatch(apiCalled(false));
      if (!error?.response?.data)
        dispatch(handleCommonError(error, DATA.apiMessages[key].Fail));
      MileageAmountError(error, body);
      AllowanceTotalAmountError(error, body);
      if (error?.response?.data?.is_lapsed) {
        message.destroy();
        message.error(error?.response?.data?.is_lapsed[0]);
      }
      if (error?.response?.data?.details) {
        message.destroy();
        message.error(error?.response?.data?.details[0]);
      }
      // error.response.data?.custom_fields &&
      //   dispatch(
      //     handleCommonError(error, error.response.data?.custom_fields[5][0]),
      //   );
    }
  };
};

/**
 * Api call to get currency conversion rate
 */
export const fetchCoversionRate = (
  date: string,
  target: number,
  base: number,
  callback?: Function,
  _calledFrom?: string,
) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(apiCalled(true));

      dispatch(apiCallRequest(DATA.apiMessages.fetchCoversionRate.loadingInfo));
      const res = await getConversionRate(date, base, target);
      const conversionRate = Number(
        preciseDecimal(res.data.conversion_rate, 5),
      );
      dispatch(
        updateFormData('conversion_rate', 'general_form', conversionRate),
      );
      dispatch(setFetchedConversionRate(conversionRate || 1));
      dispatch(setSystemFetchedConversionRate(conversionRate || 1));
      dispatch(apiCallSuccess(DATA.apiMessages.fetchCoversionRate.Success));
      // let calledFrom =
      //   _calledFrom === 'galarySelection' ? 'galarySelection' : 'none';
      dispatch(apiCalled(false));

      callback && callback(_calledFrom, conversionRate);
    } catch (error) {
      if (
        error.response.status === 404 &&
        error.response.statusText === 'Not Found'
      ) {
        dispatch(updateFormData('conversion_rate', 'general_form', null));
        dispatch(apiCallFail(DATA.apiMessages.fetchCoversionRate.notFound));
      } else
        dispatch(
          handleCommonError(error, DATA.apiMessages.fetchCoversionRate.Fail),
        );
      dispatch(apiCalled(false));
    }
  };
};

/**
 * Api call to get currency conversion rate
 */
export const fetchStaffMembersJobInfoList = () => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(updateStaffMembersJobInfoListLoader(true));
      dispatch(apiCalled(true));

      dispatch(
        apiCallRequest(
          DATA.apiMessages.fetchStaffMembersJobInfoList.loadingInfo,
        ),
      );
      const res = await getStaffMembersJobInfoList();
      dispatch(updateStaffMembersJobInfoList(res.data?.data || res.data));
      dispatch(
        apiCallSuccess(DATA.apiMessages.fetchStaffMembersJobInfoList.Success),
      );
      dispatch(apiCalled(false));

      dispatch(updateStaffMembersJobInfoListLoader(false));
    } catch (error) {
      dispatch(
        handleCommonError(
          error,
          DATA.apiMessages.fetchStaffMembersJobInfoList.Fail,
        ),
      );
      dispatch(apiCalled(false));

      dispatch(updateStaffMembersJobInfoListLoader(false));
    }
  };
};

export const validationAndUpdationTripDetailsThunkFn = (
  data: any,
  updateId?: number,
  callBack?: Function,
) => {
  return async (dispatch: Dispatch<any>, getState: () => any) => {
    try {
      dispatch(setTripDetailsLoader(true));
      dispatch(apiCalled(true));
      dispatch(apiCallRequest(''));
      if (updateId) {
        const claimID = getState().AddNewExpenseForm.updateId;
        await updateTripDetails(data, claimID, updateId);
      } else await validateTripDetails(data);
      dispatch(apiCallSuccess(''));
      dispatch(setTripDetailsLoader(false));
      dispatch(apiCalled(false));

      callBack && callBack(true);
    } catch (err) {
      dispatch(handleCommonError(err, ''));
      dispatch(apiCalled(false));
      dispatch(setTripDetailsLoader(false));
      callBack && callBack(false);
      if (
        err?.response?.status === 400 ||
        err?.response?.statusText === 'Bad Request'
      ) {
        dispatch(updateTripDetailError(err.response.data));
      }
      if (err?.response?.data?.details) {
        message.destroy();
        message.error(err?.response?.data?.details[0]);
      }
    }
  };
};

export const validationAndUpdationAllowanceDetailsThunkFn = (
  data: any,
  updateId?: number,
  callBack?: Function,
) => {
  return async (dispatch: Dispatch<any>, getState: () => any) => {
    try {
      dispatch(setTripDetailsLoader(true));
      dispatch(apiCalled(true));
      dispatch(apiCallRequest(''));
      if (updateId) {
        const claimID = getState().AddNewExpenseForm.updateId;
        await updateAllowanceDetails(data, claimID, updateId);
      } else await validateAllowanceDetails(data);
      dispatch(apiCallSuccess(''));
      dispatch(setTripDetailsLoader(false));
      dispatch(apiCalled(false));

      callBack && callBack(true);
    } catch (err) {
      dispatch(handleCommonError(err, ''));
      dispatch(apiCalled(false));
      dispatch(setTripDetailsLoader(false));
      callBack && callBack(false);
      if (
        err?.response?.status === 400 ||
        err?.response?.statusText === 'Bad Request'
      ) {
        dispatch(updateTripDetailError(err.response.data));
        if (err?.response?.data?.non_field_errors) {
          message.error(err?.response?.data?.non_field_errors[0]);
        }
      }
      if (err?.response?.data?.details) {
        message.destroy();
        message.error(err?.response?.data?.details[0]);
      }
    }
  };
};

export const fetchCostCentreList = (
  chargeTo: TchargeToCodesForFetch,
  legalEntityUuid?: string,
  callBack?: Function,
) => {
  return async (dispatch: Dispatch<any>, getState: () => stateInterface) => {
    try {
      const {
        userJobInfo,
        formData,
        expenseClaimFetchedData,
        mode,
        isAdminEdit,
      } = getState().AddNewExpenseForm;
      const { currentEmployee } = getState().admin;
      dispatch(setCostCenterList([]));
      dispatch(apiCallReset());
      dispatch(apiCalled(false));

      dispatch(setCostCenterListLoader(true));
      const res = await getCostCentreList(chargeTo, legalEntityUuid);
      let data = res.data;

      if (
        chargeTo === 'LOCAL' &&
        userJobInfo?.cost_centre &&
        !isAdminEdit
        // res.data.find(
        //   (item: any) => item.uuid === userJobInfo?.cost_centre.uuid,
        // )
      ) {
        data = [
          ...res.data.filter(
            (o: any) => o.uuid !== userJobInfo?.cost_centre.uuid,
          ),
        ];
        (mode === 'UPDATE' || mode === 'ADD' || mode === 'CLONE') &&
          data.push({
            code: userJobInfo?.cost_centre.code,
            id: userJobInfo?.cost_centre.id,
            title: userJobInfo?.cost_centre.title,
            uuid: userJobInfo?.cost_centre.uuid,
          });
      } else if (
        chargeTo === 'LOCAL' &&
        mode !== 'ADD' &&
        expenseClaimFetchedData?.cost_centre &&
        !isAdminEdit
        // res.data.find(
        //   (item: any) =>
        //     item.uuid === expenseClaimFetchedData?.cost_centre.uuid,
        // )
      ) {
        data = [
          ...res.data.filter(
            (o: any) => o.uuid !== expenseClaimFetchedData?.cost_centre.uuid,
          ),
          {
            code: expenseClaimFetchedData?.cost_centre.code,
            id: expenseClaimFetchedData?.cost_centre.id,
            title: expenseClaimFetchedData?.cost_centre.title,
            uuid: expenseClaimFetchedData?.cost_centre.uuid,
          },
        ];
      } else if (chargeTo === 'LOCAL' && mode !== 'ADD' && isAdminEdit) {
        data = [
          ...res.data.filter(
            (o: any) => o.uuid !== currentEmployee?.cost_centre.uuid,
          ),
          {
            code: currentEmployee?.cost_centre.code,
            id: currentEmployee?.cost_centre.id,
            title: currentEmployee?.cost_centre.title,
            uuid: currentEmployee?.cost_centre.uuid,
          },
        ];
      }
      setTimeout(() => {
        dispatch(setCostCenterList(data));
        dispatch(setCostCenterListLoader(false));
        if (
          chargeTo === 'LOCAL' &&
          !Boolean(formData.general_form.cost_centre_uuid)
        ) {
          if (!isAdminEdit) {
            dispatch(
              updateFormData(
                ['cost_centre_uuid', 'charge_to'],
                'general_form',
                [userJobInfo?.cost_centre?.uuid, 'LOCAL'],
              ),
            );
          } else {
            dispatch(
              updateFormData(
                ['cost_centre_uuid', 'charge_to'],
                'general_form',
                [currentEmployee?.cost_centre?.uuid, 'LOCAL'],
              ),
            );
          }
        }
        callBack && callBack(data);
      }, 1000);
    } catch (error) {
      dispatch(apiCalled(false));

      dispatch(handleCommonError(error, 'Failed to get cost centres'));
      dispatch(setCostCenterListLoader(false));
    }
  };
};

export const fetchMileageRate = (
  getMileageRateProps: IgetMileageRateProps,
  callBack?: Function,
) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      // dispatch(setMileageRate(0));
      dispatch(apiCallReset());
      dispatch(apiCalled(false));

      dispatch(updateBackendError({}));
      const res = await getMileageRate(getMileageRateProps);
      dispatch(setMileageAmount(res?.data?.mileage_amount));
      callBack && callBack(res.data.mileage_amount);
    } catch (error) {
      if (
        error?.response?.status === 400 ||
        error?.response?.statusText === 'Bad Request'
      ) {
        dispatch(updateBackendError(error.response.data));
      } else {
        dispatch(handleCommonError(error, 'Failed to get mileage rates'));
      }
      dispatch(apiCalled(false));
    }
  };
};

export const fetchPettyCashManagerTransactionMeta = (id?: number) => {
  return async (dispatch: Dispatch<any>) => {
    fetchPettyCashManagerTransactionMetaAPI(id)
      .then((response: any) => {
        dispatch(setPettyCashManagerTransactionMeta(response.data));
      })
      .catch(error => console.error(error));
  };
};

export const fetchLocationList = (
  locationListProps: any,
  callBack?: Function,
) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      const response = await fetchFilteredLocations(locationListProps);
      const data = response.data;
      dispatch(saveLocations(data));
    } catch (e) {
      // const data = (e as AxiosError).response?.data;
      // dispatch(setError(data));
    }
  };
};

export const fetchAllowanceRate = (
  getAllowanceRateProps: any,
  callBack?: Function,
) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      const res = await getAllowanceRate(getAllowanceRateProps);
      dispatch(setAllowanceRate(res?.data));
      callBack && callBack(res.data);
    } catch (error) {
      if (
        error?.response?.status === 404 ||
        error?.response?.statusText === 'Bad Request'
      ) {
        dispatch(setAllowanceRate([]));
        dispatch(updateBackendError(error.response.data));
      } else {
        dispatch(handleCommonError(error, 'Failed to get allowance rates'));
      }
      dispatch(apiCalled(false));
    }
  };
};

export const fetchTaxPercentage = (data: any, callBack?: Function) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(setTaxPercentageStatus(true));
      const res = await getTaxPercentage(data);
      // dispatch(updateTaxPercentageStatus(true));
      dispatch(setTaxPercentage(res?.data?.tax_percentage));
      callBack && callBack(res.data);
      dispatch(setTaxPercentageStatus(false));
    } catch (error) {
      if (
        error?.response?.status === 404 ||
        error?.response?.statusText === 'Bad Request'
      ) {
        dispatch(updateBackendError(error.response.data));
      } else {
        dispatch(handleCommonError(error, 'Failed to get tax percentage'));
      }
      dispatch(setTaxPercentageStatus(false));
      dispatch(apiCalled(false));
    }
  };
};

export const fetchAllowanceConversionRate = (
  date: string,
  target: string,
  base: string,
  callback?: Function,
  // _calledFrom?: string,
) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      const res = await getAllowanceConversionRate(date, target, base);
      const conversionRate = Number(
        preciseDecimal(res.data.conversion_rate, 4),
      );
      dispatch(setFetchedConversionRate(conversionRate || 1));
    } catch (error) {
      if (
        error.response.status === 404 &&
        error.response.statusText === 'Not Found'
      ) {
        dispatch(updateBackendError(error.response.data));
      }
    }
  };
};

export const fetchDistanceBetweenPlace = (Data: any, callBack: any) => {
  return async () => {
    try {
      const res = await getPlacesDistanceAPI(Data);
      callBack &&
        callBack(
          'OK',
          res?.data?.rows[0]?.elements[0]?.distance.value / 1000,
          res,
        );
    } catch (error) {
      handleCommonError(error, 'Failed to load user information');
    }
  };
};
// For Traffic Light Policy Violation Data
export const fetchExpenseClaimViolationData = (id: number) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(setExpenseClaimDataViolationDataLoader(true));
      const res = await getExpenseClaimViolationData(id);
      dispatch(saveExpenseClaimDataViolationData(res?.data));
      dispatch(setExpenseClaimDataViolationDataLoader(false));
      // dispatch(saveExpenseClaimDataViolationData(data?.data));
    } catch (error) {
      dispatch(setExpenseClaimDataViolationDataLoader(false));
      dispatch(handleCommonError(error, 'Failed to load user information'));
    }
  };
};

export const fetchExpenseClaimViolationCheckerData = (
  body: any,
  isForAprovals: boolean,
  mode: string,
  callback?: Function,
) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(setExpenseClaimDataViolationDataLoader(true));
      dispatch(apiCalled(true));
      const response: AxiosResponse = await getExpenseClaimViolationChecker(
        body,
      );
      if (response.status === 200 && response?.data.length === 0) {
        if (mode === 'ADD' || mode === 'CLONE') {
          dispatch(
            sendExpenseClaimGeneralCategoryForApprovals(
              body,
              isForAprovals,
              callback,
            ),
          );
        } else {
          dispatch(
            updateExpenseClaim(body, body.instance_id, isForAprovals, callback),
          );
        }
      } else {
        dispatch(
          setIsViolationModalData({
            visibility: true,
            item: response?.data,
            isForAprovals: isForAprovals,
          }),
        );

        dispatch(saveExpenseClaimDataViolationCheckerData(response?.data));
        dispatch(setExpenseClaimDataViolationDataLoader(false));
        dispatch(apiCalled(false));
      }
      dispatch(updateBackendError({}));
      dispatch(apiCalled(false));
    } catch (error) {
      dispatch(setExpenseClaimDataViolationDataLoader(false));
      if (
        error?.response?.status === 400 ||
        error?.response?.statusText === 'Bad Request'
      ) {
        dispatch(updateBackendError(error.response.data));
      }

      dispatch(apiCalled(false));

      error?.response?.data?.non_field_errors &&
        dispatch(
          handleCommonError(error, error?.response?.data?.non_field_errors[0]),
        );
      MileageAmountError(error, body);
      AllowanceTotalAmountError(error, body);
      if (error?.response?.data?.is_lapsed) {
        message.destroy();
        message.error(error?.response?.data?.is_lapsed[0]);
      }
      if (error?.response?.data?.details) {
        message.destroy();
        message.error(error?.response?.data?.details[0]);
      }
    }
  };
};
