import { getDetailConfiguration } from '../../../../services/expenseTypeConfiguration';
import {
  saveAllowanceLocations,
  // saveLoggedInUserInfo,
  saveConfigurationForAllowance,
  setAllowanceRates,
  updateBackendError,
  setFetchedAllowanceConversionRate,
  setAllowanceTripDetailsLoader,
  addUpdateFormData,
  setCostCentreListForAllowance,
  setCostCentreListLoaderForAllowance,
  setCreateUpdateRecordResponseData,
  setDataForEditCloneTripForm,
  setTotalAmountCount,
  apiCalled,
  setAllowanceRecordsDeleteId,
  setIsCreatedNewAllowanceRecord,
} from './allowanceNew.actions';
import { Dispatch } from 'react';
import DATA from '../../../addNewExpense/components/allowanceNew/allowanceNew.data.json';

import {
  destroy,
  error,
} from '../../../../shared/components/responcePopUp/responcePopUp';

//import { getConversionRate } from '../../services/admin/currencyConversion';
import { AxiosError, AxiosResponse } from 'axios';
import { TchargeToCodesForFetch } from './allowanceNew.model';
import { stateInterface } from '../../../../shared/redux/rootReducer';
import {
  allowanceRecordsListing,
  allowanceRecordsListingUpdate,
  allowanceTotalAmountCountAddMode,
  allowanceTotalAmountCountUpdateMode,
  createAllowanceRecords,
  deleteAllowanceRecords,
  editCloneAllowanceTrip,
  fetchFilteredLocations,
  getAllowanceRate,
  getCostCentreList,
  getExpenseClaimViolationChecker,
  postExpenseClaimAllowance,
  putExpenseClaimAllowance,
  updateAllowanceRecords,
} from '../../../../services/expenseClaim';
import { getAllowanceConversionRate } from '../../../../services/admin/currencyConversion';
import { preciseDecimal } from '../../../../utils/global.utils';
import { message } from 'antd';
import {
  saveExpenseClaimDataViolationCheckerData,
  setExpenseClaimDataViolationDataLoader,
  setIsViolationModalData,
} from '../../addNewExpense.actions';

const handleCommonError = (err: AxiosError, defaultError: string) => {
  return () => {
    let errMsg =
      err?.response?.data?.error && err?.response?.data?.error !== ''
        ? err?.response?.data?.error
        : err?.response?.data?.hasOwnProperty('receipt_date')
        ? err?.response?.data?.receipt_date
        : defaultError;
    // dispatch(apiCalled(false));
    destroy();
    error(errMsg);
  };
};

export const fetchDetailConfigurationForAllowance = (
  id: number,
  callback?: Function,
) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(apiCalled(true));
      const res = await getDetailConfiguration(String(id));
      dispatch(saveConfigurationForAllowance(res.data));
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

export const fetchAllowanceLocationList = (
  locationListProps: any,
  callBack?: Function,
) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      const response = await fetchFilteredLocations(locationListProps);
      const data = response.data;
      dispatch(saveAllowanceLocations(data));
    } catch (e) {
      // const data = (e as AxiosError).response?.data;
      // dispatch(setError(data));
    }
  };
};

export const fetchAllowanceRates = (
  getAllowanceRateProps: any,
  callBack?: Function,
) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      const res = await getAllowanceRate(getAllowanceRateProps);
      dispatch(setAllowanceRates(res?.data));
      callBack && callBack(res.data);
    } catch (error) {
      if (
        error?.response?.status === 404 ||
        error?.response?.statusText === 'Bad Request'
      ) {
        dispatch(setAllowanceRates([]));
        dispatch(updateBackendError(error.response.data));
      } else {
        dispatch(handleCommonError(error, 'Failed to get allowance rates'));
      }
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
      dispatch(setFetchedAllowanceConversionRate(conversionRate || 1));
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

export const creationAndUpdationAllowanceRecordsThunkFn = (
  data: any,
  updateState: boolean,
  updateTripId: any,
  allowanceClaimId: any,
  page?: number,
  pageSize?: number,
  callBack?: Function,
) => {
  return async (dispatch: Dispatch<any>, getState: () => stateInterface) => {
    try {
      dispatch(setAllowanceTripDetailsLoader(true));
      dispatch(apiCalled(true));
      if (getState().AddNewExpenseForm.mode === 'ADD') {
        if (updateState) {
          const res = await updateAllowanceRecords(data, updateTripId);
          if (res.data) {
            dispatch(setCreateUpdateRecordResponseData(res.data));
            dispatch(
              allowanceRecordsTableList(data.pre_save_uuid, page, pageSize),
            );
            dispatch(totalAmountCountForAddMode(data.pre_save_uuid));
          }
        } else {
          const res = await createAllowanceRecords(data);
          if (res.data) {
            dispatch(setIsCreatedNewAllowanceRecord(true));
            dispatch(setCreateUpdateRecordResponseData(res.data));
            dispatch(
              allowanceRecordsTableList(data.pre_save_uuid, page, pageSize),
            );
            dispatch(totalAmountCountForAddMode(data.pre_save_uuid));
          }
        }
      } else {
        if (getState().AddNewExpenseForm.mode === 'UPDATE') {
          if (updateState) {
            const res = await updateAllowanceRecords(data, updateTripId);
            if (res.data) {
              dispatch(setCreateUpdateRecordResponseData(res.data));
              dispatch(
                allowanceRecordsTableListUpdate(
                  allowanceClaimId,
                  page,
                  pageSize,
                ),
              );
              dispatch(totalAmountCountForUpdateMode(allowanceClaimId));
            }
          } else {
            const res = await createAllowanceRecords(data);
            if (res.data) {
              dispatch(setIsCreatedNewAllowanceRecord(true));
              dispatch(setCreateUpdateRecordResponseData(res.data));
              dispatch(
                allowanceRecordsTableListUpdate(
                  allowanceClaimId,
                  page,
                  pageSize,
                ),
              );
              dispatch(totalAmountCountForUpdateMode(allowanceClaimId));
            }
          }
        }
      }

      dispatch(setAllowanceTripDetailsLoader(false));
      dispatch(apiCalled(false));

      callBack && callBack(true);
    } catch (err) {
      dispatch(handleCommonError(err, ''));
      dispatch(apiCalled(false));
      dispatch(setAllowanceTripDetailsLoader(false));
      callBack && callBack(false);
      if (
        err?.response?.status === 400 ||
        err?.response?.statusText === 'Bad Request'
      ) {
        dispatch(updateBackendError(err.response.data));
        if (err?.response?.data?.non_field_errors) {
          message.error(err?.response?.data?.non_field_errors[0]);
        }
      }
      if (err?.response?.data?.details) {
        message.destroy();
        message.error(err?.response?.data?.details[0]);
      }
      if (err?.response?.data?.date) {
        message.destroy();
        message.error(err?.response?.data?.date[0]);
      }
    }
  };
};

export const AllowanceTotalAmountError = (error: any, body: any) => {
  if (error.response.data?.amount || error.response.data?.converted_amount) {
    message.destroy();
    message.error(
      (error.response.data?.amount && error.response.data?.amount[0]) ||
        (error.response.data?.converted_amount &&
          error.response.data?.converted_amount[0]),
    );
  }
};

export const sendAllowanceExpenseClaim = (
  body: any,
  isForAprovals: boolean,
  callback?: Function,
) => {
  // const draftOrApprovals = isForAprovals
  //   ? 'expenseClaimSendForApproval'
  //   : 'createExpenseClaimGeneral';
  return async (dispatch: Dispatch<any>, getState: () => stateInterface) => {
    //const { isForRequest } = getState().AddNewExpenseForm;
    try {
      dispatch(apiCalled(true));
      await postExpenseClaimAllowance(body, isForAprovals);
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

      error.response.data?.non_field_errors &&
        dispatch(
          handleCommonError(error, error.response.data?.non_field_errors[0]),
        );

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

export const updateAllowanceExpenseClaim = (
  body: any,
  id: number,
  isForAprovals?: boolean,
  callback?: Function,
) => {
  return async (dispatch: Dispatch<any>, getState: () => stateInterface) => {
    const { isAdminEdit } = getState().AddNewExpenseForm;
    const key = isForAprovals
      ? 'expenseClaimSendForApproval'
      : 'updateExpenseClaim';
    try {
      dispatch(apiCalled(true));
      await putExpenseClaimAllowance(id, body, isForAprovals, isAdminEdit);
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
      if (!error.response.data)
        dispatch(handleCommonError(error, DATA.apiMessages[key].Fail));

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

export const fetchCostCentreListAllowance = (
  chargeTo: TchargeToCodesForFetch,
  legalEntityUuid?: string,
  callBack?: Function,
) => {
  return async (dispatch: Dispatch<any>, getState: () => stateInterface) => {
    try {
      const { userJobInfo, mode, isAdminEdit } = getState().AddNewExpenseForm;
      const { currentEmployee } = getState().admin;
      const {
        expenseClaimFetchedDataAllowance,
        formDataAllowance,
      } = getState().AllowanceNewReducer;
      dispatch(setCostCentreListForAllowance([]));

      dispatch(setCostCentreListLoaderForAllowance(true));
      const res = await getCostCentreList(chargeTo, legalEntityUuid);
      let data = res.data;
      // const userCCInList = res.data.find(
      //   (o: any) => o.uuid === userJobInfo?.cost_centre.uuid,
      // );
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
        expenseClaimFetchedDataAllowance?.cost_centre &&
        !isAdminEdit
        // res.data.find(
        //   (item: any) =>
        //     item.uuid === expenseClaimFetchedData?.cost_centre.uuid,
        // )
      ) {
        data = [
          ...res.data.filter(
            (o: any) =>
              o.uuid !== expenseClaimFetchedDataAllowance?.cost_centre.uuid,
          ),
          {
            code: expenseClaimFetchedDataAllowance?.cost_centre.code,
            id: expenseClaimFetchedDataAllowance?.cost_centre.id,
            title: expenseClaimFetchedDataAllowance?.cost_centre.title,
            uuid: expenseClaimFetchedDataAllowance?.cost_centre.uuid,
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
        dispatch(setCostCentreListForAllowance(data));
        dispatch(setCostCentreListLoaderForAllowance(false));
        if (
          chargeTo === 'LOCAL' &&
          !Boolean(formDataAllowance.cost_centre_uuid)
        ) {
          if (!isAdminEdit) {
            dispatch(
              addUpdateFormData(
                'cost_centre_uuid',
                userJobInfo?.cost_centre?.uuid,
              ),
            );
            dispatch(addUpdateFormData('charge_to', 'LOCAL'));
          } else {
            dispatch(
              addUpdateFormData(
                'cost_centre_uuid',
                currentEmployee?.cost_centre?.uuid,
              ),
            );
            dispatch(addUpdateFormData('charge_to', 'LOCAL'));
          }
        }
        callBack && callBack(data);
      }, 1000);
    } catch (error) {
      dispatch(handleCommonError(error, 'Failed to get cost centres'));
      dispatch(setCostCentreListLoaderForAllowance(false));
    }
  };
};

export const allowanceRecordsTableList = (
  uuid: any,
  page?: number,
  pageSize?: number,
) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      const allowanceRecordsTableListing = await allowanceRecordsListing(
        uuid,
        page,
        pageSize,
      );
      dispatch(
        addUpdateFormData(
          'allowanceTripRecords',
          allowanceRecordsTableListing.data,
        ),
      );
    } catch (e) {
      // const data = (e as AxiosError).response?.data;
      // dispatch(setError(data));
    }
  };
};

export const allowanceRecordsTableListUpdate = (
  id: any,
  page?: number,
  pageSize?: number,
) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      const allowanceRecordsTableListing = await allowanceRecordsListingUpdate(
        id,
        page,
        pageSize,
      );
      dispatch(
        addUpdateFormData(
          'allowanceTripRecords',
          allowanceRecordsTableListing.data,
        ),
      );
    } catch (e) {
      // const data = (e as AxiosError).response?.data;
      // dispatch(setError(data));
    }
  };
};

export const totalAmountCountForAddMode = (uuid: any) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      const totalAmountCount = await allowanceTotalAmountCountAddMode(uuid);
      dispatch(setTotalAmountCount(totalAmountCount.data));
    } catch (e) {}
  };
};

export const totalAmountCountForUpdateMode = (id: any) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      const totalAmountCount = await allowanceTotalAmountCountUpdateMode(id);
      dispatch(setTotalAmountCount(totalAmountCount.data));
    } catch (e) {}
  };
};

export const deleteAllowanceRecord = (
  id: number,
  uuid?: any,
  claimId?: any,
  page?: number,
  pageSize?: number,
) => {
  return async (dispatch: Dispatch<any>, getState: () => stateInterface) => {
    try {
      const { mode } = getState().AddNewExpenseForm;
      const response = await deleteAllowanceRecords(id);
      if (response.status === 204) {
        message.success('Deleted Successfully', 10);
        dispatch(setAllowanceRecordsDeleteId(id));
        if (mode === 'UPDATE') {
          dispatch(allowanceRecordsTableListUpdate(claimId, page, pageSize));
          dispatch(totalAmountCountForUpdateMode(claimId));
        } else if (mode === 'ADD') {
          dispatch(allowanceRecordsTableList(uuid, page, pageSize));
          dispatch(totalAmountCountForAddMode(uuid));
        }
      }
    } catch (e) {
      // const data = (e as AxiosError).response?.data;
      // dispatch(setError(data));
    }
  };
};

export const editCloneAllowanceRecordData = (id: number) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      const response = await editCloneAllowanceTrip(id);
      dispatch(setDataForEditCloneTripForm(response.data));
    } catch (e) {
      // const data = (e as AxiosError).response?.data;
      // dispatch(setError(data));
    }
  };
};

export const deleteAllowanceRecordsWhilePageSwitch = (
  allowanceRecordsIdList?: any,
  callback?: Function,
) => {
  return async () => {
    try {
      Promise.all(
        allowanceRecordsIdList.map(
          async (id: any) => await deleteAllowanceRecords(id),
        ),
      ).then(() => {
        callback && callback();
      });
    } catch (e) {}
  };
};

export const fetchAllowanceExpenseClaimViolationCheckerData = (
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
          dispatch(sendAllowanceExpenseClaim(body, isForAprovals, callback));
        } else {
          dispatch(
            updateAllowanceExpenseClaim(
              body,
              body.instance_id,
              isForAprovals,
              callback,
            ),
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
      // MileageAmountError(error, body);
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
