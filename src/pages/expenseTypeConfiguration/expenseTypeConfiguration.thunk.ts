import { Dispatch } from 'react';
import {
  getExpenseTypeListAPI,
  deleteExpenseTypeAPI,
  getExpenseTypeDataAPI,
  updateExpenseTypeIsActiveAPI,
  getDetailConfiguration,
  legalEntityAPI,
  fetchExpenseConfigAllowancesAPI,
  countryListAPI,
  categoryAPI,
  maximumClaimAmountPerPeriodDataAPI,
  allowClaimsOnAPI,
  createExpenseTypeConfigurationAPI,
  addCustomizeConfigurationAPI,
  labelMappingAPI,
  updateExpenseTypeConfigurationOnly,
  getLegalEntitiesOfExpenseType,
  deleteLegalEntitiesFromExpenseType,
  addLegalEntitiesToExpenseType,
  resetToGlobalConfiguration,
  patchTitleAndCode,
  fetchEntityCostCenterListAPI,
} from '../../services/expenseTypeConfiguration';
import {
  apiCallRequest,
  apiCallSuccess,
  apiCallFail,
  saveExpenseTypeListData,
  saveExpenseTypeData,
  apiCallReset,
  saveEntityTypeData,
  saveAllowanceExpenses,
  saveCountryListtData,
  saveCategoryData,
  saveMaximumClaimAmountPerPeriodData,
  saveAllowClaimsOnList,
  saveExpenseTypeConfigurationAPIError,
  saveExpenseTypeFormData,
  saveLabelMappingList,
  updateExpenseTypeEntityList,
  saveAllowanceRateExpenses,
  saveEntityCostCenterListLoader,
  saveEntityCostCenterList,
  saveExpandedItem,
} from './expenseTypeConfiguration.actions';
import {
  TcreateExpenseTypeBody,
  IputExpenseTypeBody,
  IputCustomizeExpenseTypeBody,
  IExpenseTypeCategory,
  ITitleAndCode,
} from './expenseTypeConfiguration.model';

export const fetchExpenseTypeListData = () => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(
        apiCallRequest({
          info: '',
          isLoading: false,
          compactExpenseTypeLoading: true,
        }),
      );
      const response = await getExpenseTypeListAPI();
      const data = response.data;
      dispatch(saveExpenseTypeListData(data));
      dispatch(apiCallSuccess('', { compactExpenseTypeLoading: false }));
    } catch (e) {
      dispatch(apiCallFail(e.message, { compactExpenseTypeLoading: false }));
    }
  };
};

export const deleteExpenseTypeData = (id: number) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      // dispatch(apiCallReset());
      dispatch(apiCallRequest({ info: 'Deleting expense type' }));
      await deleteExpenseTypeAPI(id);
      // const data = response.data;
      dispatch(apiCallSuccess('Successfully deleted expense type!'));
      return Promise.resolve();
    } catch (err) {
      dispatch(apiCallFail('Failed to delete expense type!'));
      return Promise.reject();
    }
  };
};

export const toggleIsActiveExpenseTypeConfig = (id: number, _data: any) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(
        apiCallRequest({
          info: `${
            _data.is_active ? 'Activating' : 'Deactivating'
          }  expense type`,
        }),
      );
      await updateExpenseTypeIsActiveAPI(_data, id);
      dispatch(
        apiCallSuccess(
          `Expense type ${
            _data.is_active ? 'activated' : 'deactivated'
          }  successfully`,
        ),
      );
      return Promise.resolve('Configuration Saved!');
    } catch (err) {
      dispatch(
        apiCallFail(
          `Failed to ${
            _data.is_active ? 'activate' : 'deactivate'
          } expense type`,
        ),
      );
      return Promise.reject('Failed To Update Configuration!');
    }
  };
};

/**
 * This function fetch only single expense type details.
 * And stores in `expenseTypes` :: single value in array.
 * @param id - expense type id
 */
export const fetchExpenseTypeData = (id: string) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(
        apiCallRequest({
          info: '',
          isLoading: false,
        }),
      );
      const response = await getExpenseTypeDataAPI(id);
      const data = response.data;
      dispatch(saveExpenseTypeListData([data]));
      dispatch(apiCallSuccess(''));
    } catch (e) {
      dispatch(apiCallFail(e.message));
    }
  };
};

export const fetchExpenseTypeDataWithConfiguration = (
  id: string,
  globalConfigId: string | null = null,
  saveForForm: boolean = false,
  processDataBeforeSave?: (data: any) => any,
) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(
        apiCallRequest({
          info: !saveForForm ? 'Loading data..' : 'Processing data',
          isLoading: saveForForm, //form form true
          loadingConfigurationData: saveForForm, //form form true
          expenseTypeDetailLoading: !saveForForm, //not for form
        }),
      );
      const response = await getExpenseTypeDataAPI(id);
      const data = response.data;

      const responseConfig = await getDetailConfiguration(
        globalConfigId || response.data.global_configuration,
        true,
      );
      const dataConfig = responseConfig.data;
      dispatch(
        saveExpandedItem({
          ...dataConfig,
        }),
      );
      await fetchLabelMappingList(data.category.title);
      const proccessedData = processDataBeforeSave
        ? processDataBeforeSave({ ...dataConfig, ...data })
        : { ...dataConfig, ...data };
      if (saveForForm) dispatch(saveExpenseTypeFormData(proccessedData));
      else dispatch(saveExpenseTypeData(proccessedData));

      dispatch(
        apiCallSuccess('', {
          expenseTypeDetailLoading: false,
          loadingConfigurationData: false,
        }),
      );
    } catch (e) {
      dispatch(
        apiCallFail(e.message, {
          expenseTypeDetailLoading: false,
          loadingConfigurationData: false,
        }),
      );
    }
  };
};

/* -------------------------------------- EXPENSE TYPE END -------------------------------------- */

export const fetchEntityList = () => {
  return async (dispatch: Dispatch<any>) => {
    try {
      // dispatch(apiCallReset());
      dispatch(apiCallRequest({ isLoading: false, loadingEntity: true }));
      const response = await legalEntityAPI();
      const data = response.data;
      dispatch(saveEntityTypeData(data));
      dispatch(apiCallSuccess('', { loadingEntity: false }));
    } catch (e) {
      dispatch(apiCallFail(e.message, { loadingEntity: false }));
    }
  };
};

export const fetchExpenseConfigAllowanceTypes = (body: any, search?: any) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      const response = await fetchExpenseConfigAllowancesAPI(body, search);
      const data = response.data;
      dispatch(saveAllowanceExpenses(data));
      dispatch(saveAllowanceRateExpenses(data));
    } catch (e) {
      //dispatch(setError('Something wrong'));
    }
  };
};

export const fetchCountryList = () => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(apiCallRequest({ isLoading: false, loadingCountryList: true }));
      const response = await countryListAPI();
      const data = response.data;
      dispatch(saveCountryListtData(data));
      dispatch(apiCallSuccess('', { loadingCountryList: true }));
    } catch (e) {
      dispatch(apiCallFail(e.message, { loadingCountryList: true }));
    }
  };
};

export const fetchCategoryList = () => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(apiCallRequest({ isLoading: false, loadingCategory: true }));
      const response = await categoryAPI();
      const data = response.data;
      dispatch(saveCategoryData(data));
      dispatch(apiCallSuccess('', { loadingCategory: false }));
    } catch (e) {
      dispatch(apiCallFail(e.message, { loadingCategory: false }));
    }
  };
};

export const fetchMaximumClaimAmountPerPeriodData = () => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(
        apiCallRequest({
          isLoading: false,
          loadingMaximumClaimAmountPerPeriod: true,
        }),
      );
      const response = await maximumClaimAmountPerPeriodDataAPI();
      const data = response.data;
      dispatch(saveMaximumClaimAmountPerPeriodData(data));
      dispatch(
        apiCallSuccess('', {
          loadingMaximumClaimAmountPerPeriod: false,
        }),
      );
    } catch (e) {
      dispatch(
        apiCallFail(e.message, { loadingMaximumClaimAmountPerPeriod: false }),
      );
    }
  };
};

// use this function in config form
// export const fetchExpenseTypeFormData = (id: string) => {
//   return async (dispatch: Dispatch<any>) => {
//     try {
//       dispatch(apiCallRequest());
//       const response = await getExpenseTypeDataAPI(id);
//       const data = response.data;
//       dispatch(saveExpenseTypeFormData(data));
//       dispatch(apiCallSuccess(''));
//     } catch (e) {
//       dispatch(apiCallFail(e.message));
//     }
//   };
// };

export const fetchAllowClaimsOnList = () => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(
        apiCallRequest({
          isLoading: false,
          loadingAllowClaimsOn: true,
        }),
      );
      const response = await allowClaimsOnAPI();
      const data = response.data;
      dispatch(saveAllowClaimsOnList(data));
      dispatch(apiCallSuccess('', { loadingAllowClaimsOn: false }));
    } catch (e) {
      dispatch(apiCallFail(e.message, { loadingAllowClaimsOn: false }));
    }
  };
};

export const fetchLabelMappingList = (category: IExpenseTypeCategory) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(
        apiCallRequest({
          isLoading: false,
          loadingLabelMappingList: true,
        }),
      );
      const response = await labelMappingAPI(category);
      const data = response.data;
      dispatch(saveLabelMappingList(data));
      dispatch(apiCallSuccess('', { loadingLabelMappingList: false }));
    } catch (e) {
      dispatch(apiCallFail(e.message, { loadingLabelMappingList: false }));
    }
  };
};

/**
 * Update customize or global config Api call
 * @param _payload
 * @param id
 */
export const createGlobalExpenseTypeConfiguration = (
  _payload: TcreateExpenseTypeBody,
  callback?: (isSuccess: boolean) => void,
) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(apiCallReset({ backendError: {} }));
      dispatch(apiCallRequest({ info: 'Saving configuration' }));
      await createExpenseTypeConfigurationAPI(_payload);
      dispatch(apiCallSuccess('Configuration saved'));
      callback && callback(true);
    } catch (err) {
      if (
        err.response.status === 400 ||
        err.response.statusText === 'Bad Request'
      ) {
        dispatch(saveExpenseTypeConfigurationAPIError(err.response.data));
      }
      dispatch(apiCallFail('Failed to save configuration'));
      callback && callback(false);
    }
  };
};

/**
 * Create customize config Api call
 * @param _payload
 * @param id
 */
export const createCustomizeExpenseTypeConfiguration = (
  _payload: IputCustomizeExpenseTypeBody,
  id: string,
  callback?: (isSuccess: boolean) => void,
) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(apiCallReset({ backendError: {} }));
      dispatch(apiCallRequest({ info: 'Saving configuration' }));
      await addCustomizeConfigurationAPI(_payload, id);
      dispatch(apiCallSuccess('Configuration saved'));
      callback && callback(true);
    } catch (err) {
      if (
        err.response.status === 400 ||
        err.response.statusText === 'Bad Request'
      ) {
        console.error('Developer Print :: ', err.response.data);
        dispatch(saveExpenseTypeConfigurationAPIError(err.response.data));
      }
      dispatch(apiCallFail('Failed to save configuration'));
      callback && callback(false);
    }
  };
};

/**
 * Update customize or global config Api call
 * @param _payload
 * @param id
 */
export const putExpenseTypeConfiguration = (
  _payload: IputExpenseTypeBody,
  id: string,
  callback?: (isSuccess: boolean) => void,
) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(apiCallReset({ backendError: {} }));
      dispatch(apiCallRequest({ info: 'Saving configuration' }));
      await updateExpenseTypeConfigurationOnly(_payload, id);
      dispatch(apiCallSuccess('Configuration saved'));
      callback && callback(true);
    } catch (err) {
      if (
        err.response.status === 400 ||
        err.response.statusText === 'Bad Request'
      ) {
        console.error('Developer Print :: ', err.response.data);
        dispatch(saveExpenseTypeConfigurationAPIError(err.response.data));
      }
      dispatch(apiCallFail('Failed to save configuration'));
      callback && callback(false);
    }
  };
};

/* -------------------------------------- EXPENSE TYPE CONFIGURATION FORM END -------------------------------------- */

export const addLegalEntitiesExpenseType = (id: string, data: any) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(apiCallReset());
      dispatch(apiCallRequest({ isLoading: true, info: 'Updating entity' }));
      await addLegalEntitiesToExpenseType(id, data);
      dispatch(apiCallSuccess('Successfully updated entity'));
    } catch (e) {
      dispatch(apiCallFail('Failed to remove entity'));
    }
  };
};

export const removeLegalEntitiesFromExpenseType = (
  id: string,
  callback?: Function,
) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(apiCallReset());
      dispatch(apiCallRequest({ isLoading: true, info: 'Removing entity' }));
      await deleteLegalEntitiesFromExpenseType(id);
      dispatch(apiCallSuccess('Entity removed successfully'));
      callback && callback(true);
    } catch (e) {
      if (
        e.response.data?.non_field_errors &&
        e.response.data?.non_field_errors.length
      ) {
        dispatch(apiCallFail(e.response.data?.non_field_errors[0]));
      } else {
        dispatch(apiCallFail('Failed to remove entity'));
      }
      callback && callback(false);
    }
  };
};

export const resetExpenseTypeConfigurationToGlobal = (id: string) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(apiCallReset());
      dispatch(
        apiCallRequest({ isLoading: true, info: 'Reseting configuration' }),
      );
      await resetToGlobalConfiguration(id);
      dispatch(apiCallSuccess('Reset complete'));
    } catch (e) {
      dispatch(apiCallFail('Failed to reset configuration'));
    }
  };
};

export const fetchExpenseTypeEntityList = (id: string) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      //   dispatch(apiCallReset());
      dispatch(
        apiCallRequest({
          isLoading: false,
          loadingExpenseTypeEntityList: true,
        }),
      );
      const response = await getLegalEntitiesOfExpenseType(id);
      const data = response.data;
      dispatch(updateExpenseTypeEntityList(data));
      dispatch(apiCallSuccess('', { loadingExpenseTypeEntityList: false }));
    } catch (e) {
      dispatch(apiCallFail(e.message, { loadingExpenseTypeEntityList: false }));
    }
  };
};

/**
 * To update title & code PATCH API call
 * @param _payload
 */
export const updateTitleAndCode = (
  id: number,
  _payload: ITitleAndCode,
  callback?: (isSuccess: boolean) => void,
) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(apiCallReset({ backendError: {} }));
      dispatch(apiCallRequest({ info: 'Updating Title And Code' }));
      await patchTitleAndCode(id, _payload);
      dispatch(apiCallSuccess('Successfully updated title and code'));
      dispatch(fetchExpenseTypeListData());
      callback && callback(true);
    } catch (err) {
      if (
        err.response.status === 400 ||
        err.response.statusText === 'Bad Request'
      ) {
        console.error('Developer Print :: ', err.response.data);
        dispatch(saveExpenseTypeConfigurationAPIError(err.response.data));
      }
      dispatch(apiCallFail('Failed to update title and code'));
      callback && callback(false);
    }
  };
};

export const fetchEntityCostCenterList = (entity: any) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(saveEntityCostCenterListLoader(true));
      const response = await fetchEntityCostCenterListAPI(entity);
      const data = response.data;
      dispatch(saveEntityCostCenterList(data));
      dispatch(saveEntityCostCenterListLoader(false));
    } catch (e) {
      dispatch(saveEntityCostCenterListLoader(false));
    }
  };
};
