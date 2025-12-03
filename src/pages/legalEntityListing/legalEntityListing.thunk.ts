import { Dispatch } from 'react';
import {
  saveLoader,
  saveMessage,
  saveEntityData,
  saveError,
  setDataSubmitting,
  saveFinancialCycle,
  saveHierarchyData,
  saveEntityDataById,
  saveSuccess,
} from './legalEntityListing.actions';

import {
  fetchLegalEntitiesAPI,
  fetchLegalEntityTypesAPI,
  updateLegalEntityAPI,
  fetchFinancialYearsAPI,
  getDirectChildAPI,
} from '../../services/legalEntity';
import {
  stateInterface,
  getLegalEntityData,
} from '../../shared/redux/rootReducer';
// import { getQueryString } from '../../utils/scroll.utils';

const apiStart = (isLoading: boolean, loadingMessage = '') => {
  return async (dispatch: Dispatch<any>) => {
    dispatch(saveLoader(isLoading));
    dispatch(saveMessage(loadingMessage));
  };
};

export const fetchLegalEntities = (id: string) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      // dispatch(apiStart(true, 'Loading data'));
      const response = await fetchLegalEntitiesAPI(id);
      const data = {
        isLoading: false,
        data: response.data,
      };

      dispatch(saveEntityDataById(id, data));
      dispatch(apiStart(false));
    } catch (e) {
      const data = {
        isLoading: false,
        data: [],
      };

      dispatch(saveEntityDataById(id, data));
      dispatch(apiStart(false));
    }
  };
};

export const fetchLegalEntityTypes = () => {
  return async (dispatch: Dispatch<any>, getState: () => stateInterface) => {
    try {
      const entityData = getLegalEntityData(getState());
      if (entityData && Object.keys(entityData).length > 0) {
        Object.values(entityData).forEach((item: any) => {
          dispatch(fetchLegalEntities(item.id));
        });
        return;
      }
      dispatch(apiStart(true, 'Loading data'));
      const response = await fetchLegalEntityTypesAPI();
      if (response && response.data) {
        const entityTypes: any = {};
        response.data.forEach((item: any) => {
          const data = {
            type: item.display_text,
            id: item.id,
            isLoading: item.is_active ? true : false,
            isActive: item.is_active,
            data: new Array(15).fill({}),
            isParentEntity:
              !item.parent || (item.parent && item.parent.length === 0),
          };

          if (item.is_active) {
            entityTypes[item.id] = data;
          }
        });

        dispatch(saveEntityData(entityTypes));
        Object.values(entityTypes).forEach((item: any) => {
          dispatch(fetchLegalEntities(item.id));
        });
      }

      dispatch(apiStart(false));
    } catch (e) {
      dispatch(apiStart(false));
    }
  };
};

export const updateLegalEntity = (body: any, recordId: string) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(setDataSubmitting(true));
      dispatch(saveMessage('Updating entity'));
      const legalEntityTypeId = body.legal_entity_type.id;
      body.legal_entity_type = legalEntityTypeId;
      await updateLegalEntityAPI(body, recordId);
      dispatch(saveSuccess('Entity updated successfully'));
      dispatch(setDataSubmitting(false));
      dispatch(saveMessage(''));
      const data = {
        id: legalEntityTypeId,
        isLoading: true,
        data: new Array(15).fill({}),
      };
      dispatch(saveEntityDataById(legalEntityTypeId, data));
      dispatch(fetchLegalEntities(legalEntityTypeId));
    } catch (e) {
      dispatch(setDataSubmitting(false));
      dispatch(saveMessage(''));
      dispatch(saveError(e?.response?.data || 'Failed to update entity data'));
    }
  };
};

export const fetchFinancialYears = () => {
  return async (dispatch: Dispatch<any>) => {
    try {
      // dispatch(apiStart(true, 'Loading data'));
      const response = await fetchFinancialYearsAPI();
      dispatch(saveFinancialCycle(response.data));
      // dispatch(apiStart(false));
      // dispatch(fetch);
    } catch (e) {
      // dispatch(apiStart(false));
    }
  };
};

export const fetchEntityHierarchy = (id: string) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(apiStart(true, 'Loading data'));
      const response = await getDirectChildAPI(id);
      dispatch(saveHierarchyData(id, response.data));
      dispatch(apiStart(false));
      // dispatch(fetch);
    } catch (e) {
      dispatch(apiStart(false));
    }
  };
};
