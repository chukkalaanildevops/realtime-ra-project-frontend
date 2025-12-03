import {
  toggleBenefitTypeAPI,
  fetchBenefitCategories,
  createBenefitCategoryAPI,
  updateBenefitCategoryAPI,
} from '../../../../../services/benefitCategories/index';
import {
  wageTypeAPI,
  fetchLegalEntities,
} from '../../../../../services/benefitType';
import { Dispatch } from 'react';
import { message } from 'antd';

import {
  setIsLoading,
  saveWageTypes,
  saveBackendError,
  saveLegalEntities,
  saveTotalCategoryList,
  saveFormLoadingStatus,
  setBenefitCategoriesList,
} from './store/benefitCategories.actions';
import { stateInterface } from '../../../../../shared/redux/rootReducer';

export const fetchBenefitCategoriesList = (page: any, pageSize: any) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(setIsLoading(true));
      const res = await fetchBenefitCategories(page, pageSize);
      dispatch(setBenefitCategoriesList(res.data.data));
      dispatch(saveTotalCategoryList(res.data.pagination_data.total_records));
      dispatch(setIsLoading(false));
    } catch (e) {
      dispatch(setIsLoading(false));
    }
  };
};

export const toggleBenefitType = (id: number, isActive: boolean) => {
  return async (dispatch: Dispatch<any>, getState: () => stateInterface) => {
    const { benefitCategories } = getState().BenefitCategoriesReducer;
    try {
      message.loading(
        `${isActive ? 'Activating' : 'Deactivating'} benefit type`,
      );
      await toggleBenefitTypeAPI(id, isActive);
      dispatch(
        setBenefitCategoriesList(
          benefitCategories.map((o: any) =>
            o.id === id ? { ...o, is_active: isActive } : o,
          ),
        ),
      );
      message.success(
        `Benefit type ${isActive ? 'activated' : 'deactivated'}  successfully`,
      );
    } catch (e) {
      message.error(
        `Failed to ${isActive ? 'activated' : 'deactivated'}  benefit type`,
      );
    }
  };
};

export const fetchEntities = () => {
  return async (dispatch: Dispatch<any>) => {
    try {
      const response = await fetchLegalEntities();
      const data = response.data;
      dispatch(saveLegalEntities(data));
    } catch (e) {}
  };
};
export const fetchWageTypes = () => {
  return async (dispatch: Dispatch<any>) => {
    try {
      const response = await wageTypeAPI();
      const data = response.data;
      dispatch(saveWageTypes(data));
    } catch (e) {}
  };
};

export const createBenefitCategory = (callback: any, body: any) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(saveFormLoadingStatus(true));
      await createBenefitCategoryAPI(body);
      dispatch(fetchBenefitCategoriesList(1, 10));
      callback();
      dispatch(saveFormLoadingStatus(false));
    } catch (e) {
      if (
        e?.response?.status === 400 ||
        e?.response?.statusText === 'Bad Request'
      ) {
        dispatch(saveBackendError(e.response.data));
      }
      dispatch(saveFormLoadingStatus(false));
    }
  };
};
export const updateBenefitCategory = (
  callback: any,
  id: any,
  body: any,
  pageSize: any,
  pageNumber: any,
) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(saveFormLoadingStatus(true));
      await updateBenefitCategoryAPI(id, body);
      dispatch(fetchBenefitCategoriesList(pageNumber, pageSize));
      callback();
      dispatch(saveFormLoadingStatus(false));
    } catch (e) {
      if (
        e?.response?.status === 400 ||
        e?.response?.statusText === 'Bad Request'
      ) {
        dispatch(saveBackendError(e.response.data));
      }
      dispatch(saveFormLoadingStatus(false));
    }
  };
};
