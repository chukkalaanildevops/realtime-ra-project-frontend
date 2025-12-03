import { Dispatch } from 'react';
import {
  fetchRulesAPI,
  fetchRulesByQueryAPI,
  fetchRuleByIdAPI,
  deleteRuleAPI,
} from '../../../services/rules';
import {
  saveRules,
  setLoader,
  setLoadingMessage,
  setRuleItemLoader,
  saveRuleById,
} from './rules.action';

const apiStart = (isLoader: boolean, message = '') => {
  return async (dispatch: Dispatch<any>) => {
    dispatch(setLoader(isLoader));
    dispatch(setLoadingMessage(message));
  };
};

export const fetchRules = (page?: number, size?: number) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(apiStart(true, 'Loading data'));
      const response = await fetchRulesAPI(page, size);
      dispatch(saveRules({ ...response.data, current_page: page }));
      dispatch(apiStart(false));
    } catch (e) {
      dispatch(apiStart(false));
    }
  };
};

export const fetchRulesByQuery = (
  query: string,
  page?: number,
  size?: number,
) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(apiStart(true, 'Loading data'));
      const response = await fetchRulesByQueryAPI(query, page, size);
      dispatch(saveRules({ ...response.data, current_page: page }));
      dispatch(apiStart(false));
    } catch (e) {
      dispatch(apiStart(false));
    }
  };
};

export const fetchRuleById = (id: number) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(setRuleItemLoader(true));
      const response = await fetchRuleByIdAPI(id);
      dispatch(setRuleItemLoader(false));
      dispatch(saveRuleById(response.data));
    } catch (e) {
      dispatch(setRuleItemLoader(false));
    }
  };
};

export const deleteRule = (id: number, page?: number) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(apiStart(true, 'Deleting rule'));
      await deleteRuleAPI(id);
      const response = await fetchRulesAPI(page);
      // dispatch(saveRules(response.data));   //old
      dispatch(saveRules({ ...response.data, current_page: page }));
      dispatch(apiStart(false));
    } catch (e) {
      dispatch(apiStart(false));
    }
  };
};
