import { Dispatch } from 'react';
import { setLoadingMessage } from '../../../pages/dashboard/dashboard.actions';
import {
  getSimulatedDataAPI,
  getSimulatedDataByIdAPI,
  fetchEntitlementRulesAPI,
  fetchEntitlementRuleByIdAPI,
  deleteEntitlementRuleAPI,
  executeBenefitEntitlementRuleAPI,
  executeExpenseEntitlementRuleAPI,
  simulateEntitlementRuleAPI,
  downloadCSVResultsAPI,
} from '../../../services/entitlement';
import { setLoader } from '../referenceObject/referenceObject.actions';
import {
  setEntitlementRulesLoader,
  saveEntitlementRuleById,
  saveEntitlementRules,
  setEntitlementRuleItemLoader,
  setSimulatedDataListLoader,
  setSimulatedDataLoader,
  setSimulatedListLoader,
  fetchSimulatedListData,
  fetchSimulatedEntitlementData,
} from './entitlementRules.action';
import { success } from '../../components/responcePopUp/responcePopUp';
import { message } from 'antd';
import { setSelectedProcessTypeForEntitlement } from './addUpdateEntitlementRule/addUpdateEntitlementRule.action';
const FileDownload = require('js-file-download');

const apiStart = (isLoader: boolean, message = '') => {
  return async (dispatch: Dispatch<any>) => {
    dispatch(setLoader(isLoader));
    dispatch(setLoadingMessage(message));
  };
};

export const fetchEntitlementRules = (
  page?: number,
  size?: number,
  query?: any,
) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(setEntitlementRulesLoader(true));
      dispatch(apiStart(true, 'Loading data'));
      const response = await fetchEntitlementRulesAPI(page, size, query);
      dispatch(saveEntitlementRules({ ...response.data, current_page: page }));
      dispatch(setEntitlementRulesLoader(false));

      dispatch(apiStart(false));
    } catch (e) {
      dispatch(apiStart(false));
      dispatch(setEntitlementRulesLoader(false));
    }
  };
};

export const fetchEntitlementById = (id: number, callback?: any) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(setEntitlementRuleItemLoader(true));
      const response = await fetchEntitlementRuleByIdAPI(id);
      dispatch(
        setSelectedProcessTypeForEntitlement(response.data.process.code),
      );

      dispatch(setEntitlementRuleItemLoader(false));
      dispatch(saveEntitlementRuleById(response.data));
      callback && callback();
    } catch (e) {
      dispatch(setEntitlementRuleItemLoader(false));
    }
  };
};

export const deleteEntitlementRule = (id: number, page?: number) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(apiStart(true, 'Deleting rule'));
      await deleteEntitlementRuleAPI(id);
      const response = await fetchEntitlementRulesAPI(page);
      // dispatch(saveRules(response.data));   //old
      dispatch(saveEntitlementRules({ ...response.data, current_page: page }));
      dispatch(apiStart(false));
    } catch (e) {
      dispatch(apiStart(false));
      if (e?.response?.data?.error) {
        message.destroy();
        message.error(e?.response?.data?.error);
      }
    }
  };
};

export const executeEntitlementRule = (id: number, code?: any) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(apiStart(true, 'Deleting rule'));
      code === 'BEN'
        ? await executeBenefitEntitlementRuleAPI(id)
        : await executeExpenseEntitlementRuleAPI(id);
      dispatch(apiStart(false));
    } catch (e) {
      dispatch(apiStart(false));
    }
  };
};

export const simulateEntitlementRule = (id: number, data: any) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(setSimulatedDataLoader(true));
      const response = await simulateEntitlementRuleAPI(id, data);
      dispatch(setSimulatedDataLoader(false));
      success(response.data);
    } catch (e) {
      dispatch(setSimulatedDataLoader(false));
    }
  };
};
export const getSimulatedData = (
  id: number,
  page: number,
  pageSize: number,
) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(setSimulatedListLoader(true));
      const response = await getSimulatedDataAPI(id, page, pageSize);
      dispatch(fetchSimulatedListData(response.data));
      dispatch(setSimulatedListLoader(false));
      // success(response.data);
    } catch (e) {
      dispatch(setSimulatedListLoader(false));
    }
  };
};
export const getSimulatedDataById = (
  id: number,
  page: number,
  pageSize: number,
) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(setSimulatedDataListLoader(true));
      const response = await getSimulatedDataByIdAPI(id, page, pageSize);
      dispatch(fetchSimulatedEntitlementData(response.data || []));
      dispatch(setSimulatedDataListLoader(false));
      // success(response.data);
    } catch (e) {
      dispatch(setSimulatedDataListLoader(false));
    }
  };
};

export const downloadSimulatedResult = (id: any) => {
  return async () => {
    if (id) {
      const response = await downloadCSVResultsAPI(id);
      FileDownload(response.data, 'Simulated_list.csv');
    }
  };
};
