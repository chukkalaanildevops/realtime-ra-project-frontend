import * as API from '../../../../../../services/employeeGroups';
import * as Actions from './addEmployeeGroups.action';
import * as Models from './addEmployeeGroups.model';
import { Dispatch } from 'react';

export const fetchLegalEntitiesUsingEntityTypeId = (id: number) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      //   dispatch(Actions.apiCallReset());
      dispatch(Actions.apiCallRequest(false));
      dispatch(Actions.updateEntityArrLoader(true));
      //   const response = await API.getLegalEntities();
      const response = await API.getLegalEntitiesUsingEntityTypeId(id);
      dispatch(Actions.updateEntityArrLoader(false));
      dispatch(Actions.updateEntityArr(response.data));
      dispatch(Actions.apiCallSuccess(''));
    } catch (error) {
      dispatch(Actions.updateEntityArrLoader(false));
      dispatch(Actions.apiCallFail('Failed to load entities'));
    }
  };
};

export const fetchLegalEntityTypes = () => {
  return async (dispatch: Dispatch<any>) => {
    try {
      //   dispatch(Actions.apiCallReset());
      dispatch(Actions.apiCallRequest(false));
      dispatch(Actions.updateEntityTypesArrLoader(true));
      const response = await API.getLegalEntityTypes();
      dispatch(Actions.updateEntityTypesArrLoader(false));
      dispatch(Actions.updateEntityTypesArr(response.data));
      dispatch(Actions.apiCallSuccess(''));
    } catch (error) {
      dispatch(Actions.updateEntityTypesArrLoader(false));
      dispatch(Actions.apiCallFail('Failed to load entities'));
    }
  };
};

export const saveEmployeeGroup = (data: Models.IpostData) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(Actions.apiCallReset());
      dispatch(Actions.updateBackendError({}));
      dispatch(Actions.apiCallRequest(true, 'Saving employee group'));
      await API.postEmployeeGroup(data);
      dispatch(Actions.apiCallSuccess('Employee group saved successfully'));
    } catch (err) {
      if (
        err.response.status === 400 ||
        err.response.statusText === 'Bad Request'
      ) {
        dispatch(Actions.updateBackendError(err.response.data));
      }
      dispatch(Actions.apiCallFail('Failed to save employee group'));
    }
  };
};

export const fetchEmployeeGroupsUsingId = (id: number) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(Actions.apiCallReset());
      dispatch(Actions.apiCallRequest());
      const response = await API.getEmployeeGroupById(id);
      if (response.data?.is_criteria_based) {
        await dispatch(
          fetchLegalEntitiesUsingEntityTypeId(
            response.data?.custom_config[0].entity_type.id,
          ),
        );
      } else if (response.data.criteria.code === 'INDSELU') {
        dispatch(fetchEmployeeGroupsIndividualEmployees(response.data.id));
      }
      const updateData = {
        formData: {
          title: response.data.title,
          criteria: response.data.criteria.code,
          entityType: response.data?.is_criteria_based
            ? response.data?.custom_config[0].entity_type.id
            : '',
          relation: response.data?.is_criteria_based
            ? response.data?.custom_config[0].operator
            : 'IN',
          entities: response.data?.is_criteria_based
            ? response.data?.custom_config[0].entities.map((o: any) => o.id)
            : '',
          file: null,
          // selectEmployees: [],
        },
      };
      dispatch(Actions.saveEmployeeGroupUpdateData(updateData));
      dispatch(Actions.apiCallSuccess());
    } catch (error) {
      dispatch(Actions.apiCallFail());
    }
  };
};

export const fetchEmployeeGroupsIndividualEmployees = (id: number) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(Actions.apiCallReset());
      dispatch(Actions.apiCallRequest());
      const response = await API.getEmployeeGroupMembersNoPagination(id);
      dispatch(
        Actions.saveEmployeeGroupSelectedEmployee(
          response.data.map((o: any) => o.id),
        ),
      );
      dispatch(Actions.apiCallSuccess());
    } catch (error) {
      dispatch(Actions.apiCallFail());
    }
  };
};

export const updateEmployeeGroup = (id: number, data: Models.IpostData) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(Actions.apiCallReset());
      dispatch(Actions.updateBackendError({}));
      dispatch(Actions.apiCallRequest(true, 'Saving employee group'));
      await API.updateEmployeeGroupById(id, data);
      dispatch(Actions.apiCallSuccess('Employee group saved successfully'));
    } catch (err) {
      if (
        err.response.status === 400 ||
        err.response.statusText === 'Bad Request'
      ) {
        dispatch(Actions.updateBackendError(err.response.data));
      }
      dispatch(Actions.apiCallFail('Failed to save employee group'));
    }
  };
};

export const removeEmployeeFromIndividualCatThunk = (
  employeeGroupId: number,
  removedEmployees: number[],
) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(Actions.apiCallReset());
      dispatch(Actions.apiCallRequest(true, 'Updating employees'));
      await API.removeEmployeeFromIndividualCat(
        employeeGroupId,
        removedEmployees,
      );
      dispatch(Actions.apiCallSuccess('Successfully updated employees'));
    } catch (err) {
      dispatch(Actions.apiCallFail('Failed to update employees'));
    }
  };
};
