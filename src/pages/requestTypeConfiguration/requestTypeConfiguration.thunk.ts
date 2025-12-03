import {
  fetchLegalEntityTypes,
  labelMapping,
  wageTypeAPI,
  createRequestTypesAPI,
  fetchRequestTypesAPI,
  fetchLegalEntities,
  fetchRequestTypeConfigByIdAPI,
  deleteRequestTypeAPI,
  toggleRequestTypeAPI,
  updateRequestTypeAPI,
  addCustomRequestTypeConfigAPI,
  updateConfigDetailsAPI,
  fetchRequestTypeLegalEntitiesAPI,
  attachRequestTypeLegalEntitiesAPI,
  fetchRequestTypeByIdAPI,
  deleteLegalEntityAPI,
  revertGlobalConfigAPI,
  fetchExpensesAPI,
  createRequestsAPI,
  fetchRequestLegalEntityAPI,
  fetchRequestDetailsByIdAPI,
  fetchStaffMembersAPI,
  fetchExpenseTypesAgainstRequestAPI,
  updateRequestsAPI,
  fetchCostCentreAPI,
  updateRequestTypeTitleCodeAPI,
} from '../../services/requestType';
import {
  setLoader,
  saveEntityTypes,
  saveLabelMapping,
  saveWageTypes,
  saveCostCentre,
  saveRequestTypes,
  saveLegalEntities,
  setError,
  setSuccess,
  saveExpenses,
  setLoadingMessage,
  saveExpandedItem,
  setDataLoading,
  saveDefaultLabelMapping,
  saveLegalEntityRecords,
  saveRequestTypeData,
  saveReferenceData,
  saveRequestLegalEntities,
  createRequestLoadingStatus,
  saveRequestData,
  saveStaffMembers,
  saveExpenseTypesAgainstRequest,
} from './requestTypeConfiguration.action';
import { Dispatch } from 'react';
import { AxiosError } from 'axios';
import { getReferenceObjectUsingId } from '../../services/referenceObject';
import { COST_CENTRE_TYPES } from './requestTypeConfiguration.model';
import {
  getRequestTypes,
  stateInterface,
} from '../../shared/redux/rootReducer';
import {
  success,
  loading,
  destroy,
} from '../../shared/components/responcePopUp/responcePopUp';
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

export const fetchEntities = (is_top_level = true) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(apiStart(true));
      const response = await fetchLegalEntities(is_top_level);
      const data = response.data;
      dispatch(saveLegalEntities(data));
      dispatch(apiStart(false, ''));
    } catch (e) {
      dispatch(apiStart(false, ''));
    }
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

export const fetchRequestTypeList = () => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(apiStart(true));
      const response = await fetchRequestTypesAPI();
      const data = response.data;
      dispatch(saveRequestTypes(data));
      dispatch(apiStart(false, ''));
    } catch (e) {
      dispatch(apiStart(false, ''));
    }
  };
};

export const createRequestType = (body: any) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(apiStart(true, 'Submitting Data'));
      await createRequestTypesAPI(body);
      dispatch(setSuccess('Request Type Added Successfully'));
      dispatch(apiStart(false, ''));
    } catch (e) {
      dispatch(apiStart(false, ''));
      const data = (e as AxiosError).response?.data;
      dispatch(
        setError(
          data?.error ? data.error : data || 'Failed to add request type',
        ),
      );
    }
  };
};

export const fetchExpenseTypes = (body: any) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      const response = await fetchExpensesAPI(body);
      const data = response.data;
      dispatch(saveExpenses(data));
    } catch (e) {
      dispatch(setError('Something wrong'));
    }
  };
};

export const fetchRequestTypeConfigById = (
  id: string,
  withLegalEntity: boolean = false,
) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(setDataLoading(true));
      dispatch(setLoadingMessage('Loading config'));
      const response = await fetchRequestTypeConfigByIdAPI(id, withLegalEntity);
      const data = response.data;
      dispatch(saveExpandedItem(data));
      dispatch(setDataLoading(false));
      dispatch(setLoadingMessage(''));
    } catch (e) {
      dispatch(setDataLoading(false));
      dispatch(setError('Something wrong'));
      dispatch(setLoadingMessage(''));
    }
  };
};

export const deleteRequestType = (id: string) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(apiStart(true, 'Deleting Request Type'));
      await deleteRequestTypeAPI(id);
      dispatch(setSuccess('Request type deleted successfully '));
      dispatch(apiStart(false, ''));
      dispatch(fetchRequestTypeList());
    } catch (e) {
      dispatch(apiStart(false, ''));
      dispatch(setError('Failed to delete request type'));
    }
  };
};

export const toggleRequestType = (id: string, isActive: boolean) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(
        apiStart(
          false,
          `${isActive ? 'Activating' : 'Deactivating'} request type`,
        ),
      );
      await toggleRequestTypeAPI(id, isActive);
      dispatch(
        setSuccess(
          `Request type ${
            isActive ? 'activated' : 'deactivated'
          }  successfully`,
        ),
      );
      dispatch(apiStart(false, ''));
      return Promise.resolve('Configuration Saved!');
    } catch (e) {
      dispatch(apiStart(false, ''));
      dispatch(
        setError(
          `Failed to ${isActive ? 'activate' : 'deactivate'}  request type`,
        ),
      );
      return Promise.reject('Failed To Update Configuration!');
    }
  };
};

export const updateRequestType = (id: string, body: any) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(apiStart(true, 'Updating Data'));
      await updateRequestTypeAPI(id, body);
      dispatch(setSuccess('Request Type Updated Successfully'));
      dispatch(apiStart(false, ''));
    } catch (e) {
      dispatch(apiStart(false, ''));
      const data = (e as AxiosError).response?.data;
      dispatch(
        setError(
          data?.error ? data.error : data || 'Failed to update request type',
        ),
      );
    }
  };
};

export const addCustomRequestTypeConfig = (configData: any, id: string) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(apiStart(true, 'Submitting configuration'));
      await addCustomRequestTypeConfigAPI(id, configData);
      dispatch(apiStart(false, ''));
      dispatch(setSuccess('Custom configuration added successfully'));
    } catch (e) {
      dispatch(apiStart(false, ''));
      const data = (e as AxiosError).response?.data;
      dispatch(
        setError(
          data?.error ? data.error : data || 'Failed to update request type',
        ),
      );
    }
  };
};

export const updateConfigDetails = (
  configData: any,
  id: string,
  history: any,
) => {
  return (dispatch: Dispatch<any>) => {
    dispatch(setLoader(true));
    loading(true, 'Updating configuration');
    updateConfigDetailsAPI(id, configData)
      .then(() => {
        destroy();
        dispatch(setLoader(false));
        success('Request Type Configuration Updated Successfully');
      })
      .then(() => {
        history.goBack();
      })
      .catch(e => {
        dispatch(apiStart(false, ''));
        const data = (e as AxiosError).response?.data;
        dispatch(
          setError(
            data?.error ? data.error : data || 'Failed to update request type',
          ),
        );
      });
  };
};

export const fetchLegalEntityRecords = (id: string) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(apiStart(true, 'Loading data'));
      const response = await fetchRequestTypeLegalEntitiesAPI(id);
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
      await attachRequestTypeLegalEntitiesAPI(id, legal_entities);
      dispatch(fetchLegalEntityRecords(id));
      dispatch(apiStart(false, ''));
    } catch (e) {
      dispatch(apiStart(false, ''));
      dispatch(setError('Failed to add legal entities'));
    }
  };
};

export const fetchRequestTypeById = (id: string) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(setDataLoading(true));
      const response = await fetchRequestTypeByIdAPI(id);
      const data = response.data;
      dispatch(saveRequestTypeData(data));
      dispatch(setDataLoading(false));
    } catch (e) {
      dispatch(setDataLoading(false));
      dispatch(setError('Failed to fetch record'));
    }
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

export const fetchReferenceObjectData = (id: number) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      const response = await getReferenceObjectUsingId(id);
      dispatch(saveReferenceData(response.data.items, id));
    } catch (e) {}
  };
};

export const createRequest = (
  body: any,
  id?: string,
  isSubmit?: boolean,
  isadmin?: boolean,
  callback?: Function,
) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(createRequestLoadingStatus(true));

      dispatch(apiStart(true, 'Submitting data'));
      const request = id
        ? updateRequestsAPI(body, id, isSubmit, isadmin)
        : createRequestsAPI(body, isSubmit);
      await request;
      callback && callback();
      dispatch(createRequestLoadingStatus(false));

      dispatch(apiStart(false, ''));

      dispatch(setSuccess('Data saved successfully'));
    } catch (e) {
      dispatch(apiStart(false, ''));
      dispatch(createRequestLoadingStatus(false));
      const data = (e as AxiosError).response?.data;
      dispatch(
        setError(data?.error ? data.error : data || 'Failed to save request'),
      );
      dispatch(
        setError(data?.details ? data?.details[0] : 'Failed to save request'),
      );
    }
  };
};

export const fetchRequestLegalEntities = (is_travel_type: boolean) => {
  return (dispatch: Dispatch<any>) => {
    dispatch(saveRequestLegalEntities(true, []));
    fetchRequestLegalEntityAPI(is_travel_type)
      .then((response: any) => {
        dispatch(saveRequestLegalEntities(false, response.data));
      })
      .catch(() => {});
  };
};

export const fetchRequestDetailsById = (id: string) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(apiStart(true, 'Loading data'));
      const response = await fetchRequestDetailsByIdAPI(id);
      dispatch(saveRequestData(response.data));
      dispatch(apiStart(false, ''));
    } catch (e) {
      dispatch(apiStart(false, ''));
      dispatch(setError('Failed to fetch request details'));
    }
  };
};

export const fetchStaffMembers = () => {
  return async (dispatch: Dispatch<any>) => {
    dispatch(saveStaffMembers(true, []));
    fetchStaffMembersAPI()
      .then((response: any) => {
        dispatch(saveStaffMembers(false, response.data));
      })
      .catch(() => {});
  };
};

export const fetchExpenseTypesAgainstRequest = (id: string, empId?: number) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      if (id) {
        const response = await fetchExpenseTypesAgainstRequestAPI(id, empId);
        dispatch(saveExpenseTypesAgainstRequest(response.data));
      }
    } catch (e) {}
  };
};

export const fetchCostCentres = (type: COST_CENTRE_TYPES) => {
  return async (dispatch: Dispatch<any>, getState: () => stateInterface) => {
    try {
      const response = await fetchCostCentreAPI(type);

      let resData = response.data;
      if (type === 'LOCAL') {
        const { updateRequestData } = getState().requestConfig;
        const { jobInfo } = getState().auth;
        const { delegateUserJobInfo } = getState().delegates;
        if (!updateRequestData && jobInfo) {
          // add mode
          if (delegateUserJobInfo) {
            resData = [
              ...response.data.filter(
                (o: any) => o.uuid !== delegateUserJobInfo?.cost_centre.uuid,
              ),
              {
                code: delegateUserJobInfo?.cost_centre.code,
                id: delegateUserJobInfo?.cost_centre.id,
                title: delegateUserJobInfo?.cost_centre.title,
                uuid: delegateUserJobInfo?.cost_centre.uuid,
              },
            ];
          } else {
            resData = [
              ...response.data.filter(
                (o: any) => o.uuid !== jobInfo?.cost_centre.uuid,
              ),
              {
                code: jobInfo?.cost_centre.code,
                id: jobInfo?.cost_centre.id,
                title: jobInfo?.cost_centre.title,
                uuid: jobInfo?.cost_centre.uuid,
              },
            ];
          }
        } else if (updateRequestData && jobInfo) {
          // update mode
          const costCentreData = updateRequestData?.cost_centres?.find(
            (o: any) => o,
          );
          if (delegateUserJobInfo) {
            resData = [
              ...response.data.filter(
                (o: any) => o.uuid !== delegateUserJobInfo?.cost_centre.uuid,
              ),
              {
                code: delegateUserJobInfo?.cost_centre.code,
                id: delegateUserJobInfo?.cost_centre.id,
                title: delegateUserJobInfo?.cost_centre.title,
                uuid: delegateUserJobInfo?.cost_centre.uuid,
              },
            ];
          } else {
            resData = [
              ...response.data.filter(
                (o: any) => o.uuid !== costCentreData?.uuid,
              ),
              {
                code: costCentreData?.code,
                id: costCentreData?.id,
                title: costCentreData?.title,
                uuid: costCentreData?.uuid,
              },
            ];
          }
        }
      }

      const data = {
        type,
        data: resData,
      };
      dispatch(saveCostCentre(data));
    } catch (e) {}
  };
};

export const updateRequestTypeTitleCode = (id: number, body: any) => {
  return async (dispatch: Dispatch<any>, getState: any) => {
    try {
      dispatch(setDataLoading(true));
      dispatch(setLoadingMessage('Updating data'));
      await updateRequestTypeTitleCodeAPI(id, body);
      dispatch(setSuccess('Data Updated Successfully'));
      const state = getState();
      const requestTypes = getRequestTypes(state);
      const updatedItem = requestTypes.find(item => item.id === id);
      const updatedIndex = requestTypes.findIndex(item => item.id === id);
      const newTypes = [...requestTypes];
      newTypes.splice(updatedIndex, 1, {
        ...updatedItem,
        ...body,
      });
      dispatch(saveRequestTypes(newTypes));
      dispatch(setDataLoading(false));
      dispatch(setLoadingMessage(''));
    } catch (e) {
      const data = (e as AxiosError).response?.data;
      dispatch(setDataLoading(false));
      dispatch(setLoadingMessage(''));
      dispatch(
        setError(data?.error ? data.error : data || 'Failed to update data'),
      );
    }
  };
};
