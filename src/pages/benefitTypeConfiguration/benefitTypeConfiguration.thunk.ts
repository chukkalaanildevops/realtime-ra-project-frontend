import {
  fetchLegalEntityTypes,
  labelMapping,
  wageTypeAPI,
  createBenefitTypesAPI,
  fetchBenefitTypesAPI,
  fetchLegalEntities,
  fetchFlexibleCategory,
  fetchBenefitTypeByIdAPI,
  deleteBenefitTypeAPI,
  toggleBenefitTypeAPI,
  updateBenefitTypeAPI,
  fetchBenefitChoicesAPI,
  addCustomBenefitTypeConfigAPI,
  attachBenefitTypeLegalEntitiesAPI,
  deleteLegalEntityAPI,
  fetchBenefitTypeLegalEntitiesAPI,
  revertGlobalConfigAPI,
  updateConfigDetailsAPI,
  fetchBenefitTypeConfigByIdAPI,
  patchTitleAndCode,
  fetchEntityCostCenterListAPI,
  fetchDependentRelationsAPI,
  // fetchGLAccountsAPI,
} from '../../services/benefitType';
import {
  setLoader,
  saveEntityTypes,
  saveLabelMapping,
  saveWageTypes,
  saveBenefitTypes,
  saveLegalEntities,
  saveFlexibleBenefitCategory,
  saveDependentRelations,
  setError,
  setSuccess,
  saveExpenses,
  setLoadingMessage,
  saveExpandedItem,
  setDataLoading,
  saveDefaultLabelMapping,
  // saveAvailableAfter,
  // saveAvailableAfterUnit,
  // saveClaimFor,
  saveDeductibleComponent,
  // saveEntitlementPeriodUnit,
  // saveEntitlementTypes,
  // saveProratedBy,
  saveLegalEntityRecords,
  saveBenefitTypeData,
  saveEntitlementPeriod,
  saveFrequencyUnit,
  saveProration,
  saveMaxClaimPerEntitlementPeriod,
  saveEntityCostCenterList,
  saveEntityCostCenterListLoader,
} from './benefitTypeConfiguration.action';
import { Dispatch } from 'react';
import { AxiosError } from 'axios';
import { getExpenseTypeListAPI } from '../../services/expenseTypeConfiguration';
import { BENEFIT_CHOICES } from './benefitTypeConfiguration.model';
const LOADING_DATA = 'Loading Data...';

const apiStart = (isLoader: boolean, message = LOADING_DATA) => {
  return async (dispatch: Dispatch<any>) => {
    dispatch(setLoader(isLoader));
    dispatch(setLoadingMessage(message));
  };
};
export const fetchEntityTypes = () => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(apiStart(true));
      const response = await fetchLegalEntityTypes();
      const data = response.data;
      dispatch(saveEntityTypes(data));
      dispatch(apiStart(false, ''));
    } catch (e) {
      dispatch(apiStart(false, ''));
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
export const fetchEntities = () => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(apiStart(true));
      const response = await fetchLegalEntities();
      const data = response.data;
      dispatch(saveLegalEntities(data));
      dispatch(apiStart(false, ''));
    } catch (e) {
      dispatch(apiStart(false, ''));
    }
  };
};
export const fetchFlexibleBenefitCategory = (
  pageNumber: any,
  pageSize: any,
) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      const response = await fetchFlexibleCategory(pageNumber, pageSize);
      const data = response.data;
      dispatch(saveFlexibleBenefitCategory(data.data));
    } catch (e) {}
  };
};

export const fetchDependentRelations = () => {
  return async (dispatch: Dispatch<any>) => {
    try {
      const response = await fetchDependentRelationsAPI();
      const data = response.data;
      dispatch(saveDependentRelations(data));
    } catch (e) {}
  };
};
export const fetchLabelMapping = () => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(apiStart(true));
      const response = await labelMapping();
      const data = response.data;
      dispatch(saveDefaultLabelMapping(data));
      dispatch(saveLabelMapping(data));
      dispatch(apiStart(false, ''));
    } catch (e) {
      dispatch(apiStart(false, ''));
    }
  };
};

export const fetchWageTypes = () => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(apiStart(true));
      const response = await wageTypeAPI();
      const data = response.data;
      dispatch(saveWageTypes(data));
      dispatch(apiStart(false, ''));
    } catch (e) {
      dispatch(apiStart(false, ''));
    }
  };
};

// export const fetchCostCentre = () => {
//   return async (dispatch: Dispatch<any>) => {
//     try {
//       dispatch(apiStart(true));
//       const response = await costCenterListAPI();
//       const data = response.data;
//       dispatch(saveCostCentre(data));
//       dispatch(apiStart(false, ''));
//     } catch (e) {
//       dispatch(apiStart(false, ''));
//     }
//   };
// };

export const fetchBenefitTypeList = () => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(apiStart(true));
      const response = await fetchBenefitTypesAPI();
      const data = response.data;
      dispatch(saveBenefitTypes(data));
      dispatch(apiStart(false, ''));
    } catch (e) {
      dispatch(apiStart(false, ''));
    }
  };
};

export const createBenefitType = (body: any) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(apiStart(true, 'Submitting Data'));
      await createBenefitTypesAPI(body);
      // const response = await createBenefitTypesAPI(body);
      // const data = response.data;
      dispatch(setSuccess('Benefit Type Added Successfully'));
      dispatch(apiStart(false, ''));
    } catch (e) {
      dispatch(apiStart(false, ''));
      const data = (e as AxiosError).response?.data;
      dispatch(
        setError(
          data?.error ? data.error[0] : data || 'Failed to create benefit type',
        ),
      );
    }
  };
};

export const fetchExpenseTypes = () => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(apiStart(true));
      const response = await getExpenseTypeListAPI();
      const data = response.data;
      dispatch(saveExpenses(data));
      dispatch(apiStart(false, ''));
    } catch (e) {
      dispatch(apiStart(false, ''));
      dispatch(setError('Something wrong'));
    }
  };
};

export const fetchBenefitTypeById = (id: string) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(apiStart(true));
      dispatch(setDataLoading(true));
      const response = await fetchBenefitTypeByIdAPI(id);
      const data = response.data;
      dispatch(saveBenefitTypeData(data));
      dispatch(apiStart(false, ''));
      dispatch(setDataLoading(false));
    } catch (e) {
      dispatch(apiStart(false, ''));
      dispatch(setDataLoading(false));
      dispatch(setError('failed to fetch benefit details'));
    }
  };
};

export const deleteBenefitType = (id: string) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(apiStart(true, 'Deleting Benefit Type'));
      await deleteBenefitTypeAPI(id);
      // const response = await deleteBenefitTypeAPI(id);
      // const data = response.data;
      // dispatch(saveExpandedItem(data));
      dispatch(setSuccess('Benefit type deleted successfully '));
      dispatch(apiStart(false, ''));
      dispatch(fetchBenefitTypeList());
    } catch (e) {
      dispatch(apiStart(false, ''));
      dispatch(setError('Failed to delete Benefit type'));
    }
  };
};

export const toggleBenefitType = (id: string, isActive: boolean) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(
        apiStart(
          false,
          `${isActive ? 'Activating' : 'Deactivating'} benefit type`,
        ),
      );
      //const response =
      await toggleBenefitTypeAPI(id, isActive);
      //  const data = response.data;

      // dispatch(saveExpandedItem(data));
      dispatch(
        setSuccess(
          `Benefit type ${
            isActive ? 'activated' : 'deactivated'
          }  successfully`,
        ),
      );
      dispatch(apiStart(false, ''));
      // dispatch(fetchBenefitTypeList());
      return Promise.resolve('Configuration Saved!');
    } catch (e) {
      dispatch(apiStart(false, ''));
      dispatch(
        setError(
          `Failed to ${isActive ? 'activated' : 'deactivated'}  benefit type`,
        ),
      );
      return Promise.reject('Failed To Update Configuration!');
    }
  };
};

export const updateBenefitType = (id: string, body: any) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(apiStart(true, 'Updating Data'));
      //const response =
      await updateBenefitTypeAPI(id, body);
      //   const data = response.data;
      dispatch(setSuccess('Benefit Type Updated Successfully'));
      dispatch(apiStart(false, ''));
    } catch (e) {
      dispatch(apiStart(false, ''));
      const data = (e as AxiosError).response?.data;
      dispatch(
        setError(
          data?.error ? data.error[0] : data || 'Failed to update benefit type',
        ),
      );
    }
  };
};

// export const fetchGLAccounts = () => {
//   return async (dispatch: Dispatch<any>) => {
//     try {
//       dispatch(apiStart(true));
//       const response = await fetchGLAccountsAPI();
//       const data = response.data;
//       dispatch(saveGLAccounts(data));
//       dispatch(apiStart(false, ''));
//     } catch (e) {
//       dispatch(apiStart(false, ''));
//       const data = (e as AxiosError).response?.data;
//       dispatch(setError(data || 'Something wrong'));
//     }
//   };
// };

export const fetchBenefitChoices = (choice: BENEFIT_CHOICES) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      const response = await fetchBenefitChoicesAPI(choice);
      const data = response.data;
      switch (choice) {
        case 'deductible_component':
          dispatch(saveDeductibleComponent(data));
          break;
        case 'entitlement_period':
          dispatch(saveEntitlementPeriod(data));
          break;
        case 'frequency_unit':
          dispatch(saveFrequencyUnit(data));
          break;
        case 'max_claims_per_entitlement_period':
          dispatch(saveMaxClaimPerEntitlementPeriod(data));
          break;
        case 'proration':
          dispatch(saveProration(data));
          break;
      }
    } catch (e) {}
  };
};

export const removeLegalEntity = (id: string, typeId: string) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(apiStart(true, 'Removing legal entity'));
      await deleteLegalEntityAPI(id);
      dispatch(fetchLegalEntityRecords(typeId));
      dispatch(apiStart(false, ''));
    } catch (e) {
      dispatch(apiStart(false, ''));
      dispatch(setError('Failed to remove entity'));
    }
  };
};

export const revertLegalEntity = (id: string, typeId: string) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(apiStart(true, 'Reverting changes'));
      await revertGlobalConfigAPI(id);
      dispatch(fetchLegalEntityRecords(typeId));
      dispatch(apiStart(false, ''));
    } catch (e) {
      dispatch(apiStart(false, ''));
      dispatch(setError('Failed to revert changes'));
    }
  };
};

export const fetchBenefitTypeConfigById = (id: string, entity?: any) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(apiStart(true));
      dispatch(setDataLoading(true));
      const response = await fetchBenefitTypeConfigByIdAPI(id);
      const data = entity ? { ...response.data, entity } : response.data;
      dispatch(
        saveExpandedItem({
          ...data,
          selectedEntity: entity,
        }),
      );
      dispatch(apiStart(false));
      dispatch(setDataLoading(false));
    } catch (e) {
      dispatch(apiStart(false));
      dispatch(setDataLoading(false));
      dispatch(setError('Something wrong'));
    }
  };
};

export const addCustomBenefitTypeConfig = (configData: any, id: string) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(apiStart(true, 'Submitting configuration'));
      await addCustomBenefitTypeConfigAPI(id, configData);
      dispatch(apiStart(false, ''));
      dispatch(setSuccess('Custom configuration added successfully'));
    } catch (e) {
      dispatch(apiStart(false, ''));
      const data = (e as AxiosError).response?.data;
      dispatch(
        setError(
          data?.error ? data.error[0] : data || 'Failed to add custom benefit',
        ),
      );
    }
  };
};

export const updateConfigDetails = (configData: any, id: string) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(apiStart(true, 'Updating configuration'));
      await updateConfigDetailsAPI(id, configData);
      dispatch(setSuccess('Benefit Type Configuration Updated Successfully'));
      dispatch(apiStart(false, ''));
    } catch (e) {
      dispatch(apiStart(false, ''));
      const data = (e as AxiosError).response?.data;
      dispatch(
        setError(
          data?.error
            ? data.error[0]
            : data || 'Failed to update custom benefit',
        ),
      );
    }
  };
};

export const fetchLegalEntityRecords = (id: string) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(apiStart(true, 'Fetching data'));
      const response = await fetchBenefitTypeLegalEntitiesAPI(id);
      dispatch(saveLegalEntityRecords(response.data));
      dispatch(apiStart(false, ''));
    } catch (e) {
      dispatch(apiStart(false, ''));
    }
  };
};

export const attachLegalEntities = (id: string, legal_entities: string[]) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(apiStart(true, 'Adding legal entities'));
      await attachBenefitTypeLegalEntitiesAPI(id, legal_entities);
      dispatch(fetchLegalEntityRecords(id));
      dispatch(apiStart(false, ''));
    } catch (e) {
      dispatch(apiStart(false, ''));
      dispatch(setError('Failed to add legal entities'));
    }
  };
};

export const updateTitleAndCode = (
  id: number,
  _payload: any,
  callback?: (isSuccess: boolean) => void,
) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(apiStart(true, 'Updating Title And Code'));
      await patchTitleAndCode(id, _payload);
      dispatch(apiStart(false, ''));
      dispatch(setSuccess('Successfully updated title and code'));
      dispatch(fetchBenefitTypeList());
      callback && callback(true);
    } catch (err) {
      if (
        err.response.status === 400 &&
        err.response.statusText === 'Bad Request'
      ) {
        console.error('Developer Print :: ', err.response.data);
        dispatch(setError('err.response.data'));

        // dispatch(saveExpenseTypeConfigurationAPIError(err.response.data));
      }
      dispatch(apiStart(false, ''));
      dispatch(setError('Failed to update title and code'));
      callback && callback(false);
    }
  };
};
