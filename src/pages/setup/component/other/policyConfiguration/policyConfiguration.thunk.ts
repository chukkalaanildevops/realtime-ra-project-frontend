/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Dispatch } from 'react';
import { message } from 'antd';

import {
  setLoader,
  setServiceCallFailed,
  setFormSubmissionInProgress,
  // setFormSubmissionSuccessful,
  // setFormErrors,
  setPolicyConfiguration,
  setPolicyConfigurationDetailsLoader,
  setPolicyConfigDetails,
  setPolicyConfigurationDetail,
  setListEntities,
  setListDivisions,
  setListDepartments,
  setListAllEmployeeGroups,
  setListAllPayGrades,
  setListAllSfEmployeeGroups,
  setListAllExpanseTypes,
  setListBusinessUnits,
  setListExpenseCategory,
  setPermission,
  setPolicyListingPageLoader,
  setServiceCallFailedPolicyLists,
  setListAllTargetTypes,
  setListAllRequestType,
} from './policyConfiguration.actions';
import { AxiosResponse } from 'axios';
import {
  fetchPolicyConfigDetailsService,
  listAllEmployeeGroups,
  listAllExpanseTypes,
  listAllPayGrades,
  listAllSfEmployeeGroups,
  listDepartmentsService,
  listDevisionsService,
  listEntitiesService,
  listBusinessUnitsService,
  updatePolicyConfigurationService,
  listAllExpenseCategoryService,
  fetchPolicyConfigDetailsServiceForView,
  getUserPermission,
  listAllTargetTypes,
  listAllRequestTypes,
} from '../../../../../services/policyConfiguration';

export const setPageLoader = (isLoading: boolean) => {
  return async (dispatch: Dispatch<any>) => {
    dispatch(setLoader(isLoading));
  };
};

export const fetchPolicyConfiguration = (
  searchfilter: any,
  isLoadingRequire: boolean = true,
) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      if (isLoadingRequire) {
        dispatch(setPolicyListingPageLoader(true));
      }
      let searchData = Object.keys(searchfilter)
        .map(key => `${key}=${searchfilter[key]}`)
        .join('&');
      const response: AxiosResponse = await fetchPolicyConfigDetailsService(
        `?${searchData}`,
      );
      dispatch(setPolicyConfiguration(response.data));
      dispatch(setPolicyListingPageLoader(false));
    } catch (error) {
      dispatch(
        setServiceCallFailedPolicyLists(true, error.response.data.error),
      );
      dispatch(setPolicyListingPageLoader(false));
    }
  };
};

export const fetchPolicyConfigDetails = (id: string) => {
  return async (dispatch: Dispatch<any>) => {
    dispatch(setPolicyConfigurationDetailsLoader(true));
    dispatch(setPolicyConfigDetails({}));
    try {
      const response: AxiosResponse = await fetchPolicyConfigDetailsService(id);
      const data = response.data;
      dispatch(setPolicyConfigDetails(data));
      dispatch(setPolicyConfigurationDetailsLoader(false));
      dispatch(setLoader(false));
    } catch (error) {
      dispatch(setServiceCallFailed(true, error.response.data.error));
      dispatch(setPolicyConfigurationDetailsLoader(false));
      dispatch(setLoader(false));
    }
  };
};

export const fetchPolicyConfigDetailsForView = (id: string) => {
  return async (dispatch: Dispatch<any>) => {
    dispatch(setPolicyConfigurationDetailsLoader(true));
    dispatch(setPolicyConfigDetails({}));
    try {
      const response: AxiosResponse = await fetchPolicyConfigDetailsServiceForView(
        id,
      );
      const data = response.data;
      dispatch(setPolicyConfigDetails(data));
      dispatch(setPolicyConfigurationDetailsLoader(false));
      dispatch(setLoader(false));
    } catch (error) {
      dispatch(setServiceCallFailed(true, error.response.data.error));
      dispatch(setPolicyConfigurationDetailsLoader(false));
      dispatch(setLoader(false));
    }
  };
};

export const fetchPolicyConfigurationDetail = (policyConfigurationId: any) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(setPolicyConfigurationDetail(null));
      dispatch(setLoader(true));
      dispatch(setPolicyConfigurationDetailsLoader(true));
      const response: AxiosResponse = await fetchPolicyConfigDetailsServiceForView(
        policyConfigurationId,
      );
      dispatch(setPolicyConfigurationDetail(null));
      dispatch(setPolicyConfigurationDetail(response?.data));
      dispatch(setLoader(false));
      dispatch(setPolicyConfigurationDetailsLoader(false));
    } catch (error) {
      dispatch(setServiceCallFailed(true, error?.response?.data?.error));
      dispatch(setLoader(false));
    }
  };
};

export const fetchListEntitiesCompany = () => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(setLoader(true));
      const response: AxiosResponse = await listEntitiesService();
      dispatch(setListEntities(response.data));
      dispatch(setLoader(false));
    } catch (error) {
      dispatch(setServiceCallFailed(true, error.response.data.error));
      dispatch(setLoader(false));
    }
  };
};

export const fetchListDivisions = () => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(setLoader(true));
      const response: AxiosResponse = await listDevisionsService();
      dispatch(setListDivisions(response.data));
      dispatch(setLoader(false));
    } catch (error) {
      dispatch(setServiceCallFailed(true, error.response.data.error));
      dispatch(setLoader(false));
    }
  };
};

export const fetchListBusinessUnits = () => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(setLoader(true));
      const response: AxiosResponse = await listBusinessUnitsService();
      dispatch(setListBusinessUnits(response.data));
      dispatch(setLoader(false));
    } catch (error) {
      dispatch(setServiceCallFailed(true, error.response.data.error));
      dispatch(setLoader(false));
    }
  };
};

export const fetchListDepartments = () => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(setLoader(true));
      const response: AxiosResponse = await listDepartmentsService();
      dispatch(setListDepartments(response.data));
      dispatch(setLoader(false));
    } catch (error) {
      dispatch(setServiceCallFailed(true, error.response.data.error));
      dispatch(setLoader(false));
    }
  };
};

export const fetchListAllEmployeeGroups = () => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(setLoader(true));
      const response: AxiosResponse = await listAllEmployeeGroups();
      dispatch(setListAllEmployeeGroups(response.data));
      dispatch(setLoader(false));
    } catch (error) {
      dispatch(setServiceCallFailed(true, error.response.data.error));
      dispatch(setLoader(false));
    }
  };
};

export const fetchListAllPayGrades = () => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(setLoader(true));
      const response: AxiosResponse = await listAllPayGrades();
      dispatch(setListAllPayGrades(response.data));
      dispatch(setLoader(false));
    } catch (error) {
      dispatch(setServiceCallFailed(true, error.response.data.error));
      dispatch(setLoader(false));
    }
  };
};

export const fetchAllSfEmployeeGroups = () => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(setLoader(true));
      const response: AxiosResponse = await listAllSfEmployeeGroups();

      dispatch(setListAllSfEmployeeGroups(response.data));
      dispatch(setLoader(false));
    } catch (error) {
      dispatch(setServiceCallFailed(true, error.response.data.error));
      dispatch(setLoader(false));
    }
  };
};

export const fetchAllExpanseTypes = () => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(setLoader(true));
      const response: AxiosResponse = await listAllExpanseTypes();
      dispatch(setListAllExpanseTypes(response.data));
      dispatch(setLoader(false));
    } catch (error) {
      dispatch(setServiceCallFailed(true, error.response.data.error));
      dispatch(setLoader(false));
    }
  };
};

export const fetchAllTargetTypes = () => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(setLoader(true));
      const response: AxiosResponse = await listAllTargetTypes();
      dispatch(setListAllTargetTypes(response.data || []));
      dispatch(setLoader(false));
    } catch (error) {
      dispatch(setServiceCallFailed(true, error.response.data.error));
      dispatch(setLoader(false));
    }
  };
};

export const updatePolicyConfiguration = (
  id: any,
  data: any,
  messageType: any,
) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      const response: AxiosResponse = await updatePolicyConfigurationService(
        id,
        data,
      );
      message.destroy();

      if (messageType === 'status') {
        if (data.is_active) {
          message.success('Policy activated.');
        } else {
          message.success('Policy inactivated.');
        }
      } else if (messageType === 'targetgroup-created') {
        message.success('Target Group saved successfully.');
      } else if (messageType === 'targetgroup') {
        message.success('Target Group updated successfully.');
      } else if (messageType === 'rules-created') {
        message.success('Rules saved successfully.');
      } else if (messageType === 'rules') {
        message.success('Rules updated successfully.');
      }
      return true;
    } catch (error) {
      if (error?.response?.data?.is_active?.length) {
        message.destroy();
        message.error(error?.response?.data?.is_active[0]);
        return true;
      }
    }
  };
};

export const fetchExpenseCategory = (category: any) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(setLoader(true));
      const response: AxiosResponse = await listAllExpenseCategoryService(
        category,
      );
      dispatch(setListExpenseCategory(response.data));
      dispatch(setLoader(false));
    } catch (error) {
      dispatch(setServiceCallFailed(true, error.response.data.error));
      dispatch(setLoader(false));
    }
  };
};

export const fetchUserPermission = (userId: any) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      const response: AxiosResponse = await getUserPermission(userId);
      dispatch(setPermission(response.data.has_permissions));
    } catch (error) {
      dispatch(setServiceCallFailed(true, error.response.data.error));
      dispatch(setLoader(false));
    }
  };
};
