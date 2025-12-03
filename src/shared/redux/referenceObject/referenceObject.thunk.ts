import { Dispatch } from 'react';
import {
  fetchObjectReferenceList,
  createObjectReference,
  deleteReferenceObjectUsingId,
  getReferenceObjectUsingId,
  updateReferenceObjectUsingId,
  addingReferenceObjectItem,
  removingReferenceObjectItem,
  postRefObjectCSVFile,
  fetchObjectReferenceDropdownList,
} from '../../../services/referenceObject';
import {
  apiCallRequest,
  saveObjects,
  apiCallSuccess,
  apiCallFail,
  setListLoader,
  setFormData,
  apiCallReset,
  savePaginationData,
  updateBackendErrors,
  saveReferenceObjects,
  setObjectReferenceSelected,
  setObjectReferenceSelectedLoader,
} from './referenceObject.actions';
// import { getReferenceObjects } from '../rootReducer';
import { AxiosError } from 'axios';

export const getObjectReferenceList = (page: number, size?: number) => {
  return async (dispatch: Dispatch<any>) => {
    dispatch(apiCallReset());
    // dispatch(apiCallRequest(true));
    dispatch(setListLoader(true));
    try {
      const updatedSize = size ? size : 10;
      const PageNo = page === 0 ? 1 : page;

      const response = await fetchObjectReferenceList(PageNo, updatedSize);
      const data = response.data;
      dispatch(saveObjects(data.data));
      dispatch(
        savePaginationData({ ...data.pagination_data, current_page: page }),
      );
      dispatch(apiCallSuccess());
      dispatch(setListLoader(false));
    } catch (e) {
      dispatch(apiCallFail());
      dispatch(saveObjects([]));
      dispatch(setListLoader(false));
    }
  };
};

export const createReferenceObject = (
  body: any,
  callback?: (obj: any) => void,
) => {
  return async (dispatch: Dispatch<any>, _getState: any) => {
    dispatch(apiCallReset());
    dispatch(apiCallRequest(true, 'Saving reference Object'));
    try {
      const response = await createObjectReference(body);
      const data = response.data;
      // debugger;
      // const oldRecords = getReferenceObjects(getState());
      // dispatch(saveReferenceObjects([...oldRecords, data]));
      dispatch(apiCallSuccess('Reference Object saved successfully'));
      if (callback) callback(data);
    } catch (e) {
      const data = (e as AxiosError).response?.data;
      dispatch(apiCallFail('Failed to saved reference object'));
      if (callback) callback({ error: data });
    }
  };
};

export const saveReferenceObject = (body: any, callback?: Function) => {
  return async (dispatch: Dispatch<any>) => {
    dispatch(apiCallReset());
    dispatch(apiCallRequest(true, 'Saving reference Object'));
    try {
      await createObjectReference(body);
      dispatch(apiCallSuccess('Reference Object saved successfully'));
      dispatch(updateBackendErrors({}));
      if (callback) callback(true);
    } catch (e) {
      dispatch(apiCallFail('Failed to saved reference object'));
      dispatch(updateBackendErrors(e.response.data));
      if (callback) callback(false);
    }
  };
};

export const updateReferenceObject = (
  id: number,
  body: any,
  callback?: Function,
) => {
  return async (dispatch: Dispatch<any>) => {
    dispatch(apiCallReset());
    dispatch(apiCallRequest(true, 'Updating reference Object'));
    try {
      await updateReferenceObjectUsingId(id, body);
      dispatch(apiCallSuccess('Reference Object updated successfully'));
      dispatch(updateBackendErrors({}));
      if (callback) callback(true);
    } catch (e) {
      dispatch(apiCallFail('Failed to update reference object'));
      dispatch(updateBackendErrors(e.response.data));
      if (callback) callback(false);
    }
  };
};

export const deleteReferenceObject = (id: number, callBack?: Function) => {
  return async (dispatch: Dispatch<any>, _getState: any) => {
    dispatch(apiCallReset());
    dispatch(apiCallRequest(true, 'Deleting reference Object'));
    try {
      await deleteReferenceObjectUsingId(id);
      dispatch(apiCallSuccess('Reference Object deleted successfully'));
      setTimeout(() => {
        // dispatch(getObjectReferenceList());
        callBack && callBack();
      }, 500);
    } catch (e) {
      dispatch(apiCallFail('Failed to delete reference object'));
    }
  };
};

export const fetchReferenceObjectUsingId = (
  id: number,
  saveInSelectedObjectReference: boolean = false,
) => {
  return async (dispatch: Dispatch<any>, _getState: any) => {
    dispatch(apiCallReset());
    dispatch(setObjectReferenceSelectedLoader(true));
    try {
      const response = await getReferenceObjectUsingId(id);
      if (saveInSelectedObjectReference) {
        dispatch(setObjectReferenceSelected(response.data));
        dispatch(setObjectReferenceSelectedLoader(false));
      } else {
        dispatch(
          setFormData(
            {
              title: response.data?.title ? response.data?.title : '',
              code: response.data?.code ? response.data?.code : '',
              items: response.data?.items.map((o: any) => o.title),
            },
            response.data?.items.map((o: any) => o.title),
            response.data?.can_be_deleted,
          ),
        );
      }
      dispatch(apiCallSuccess());
      return Promise.resolve(response.data);
    } catch (e) {
      dispatch(apiCallFail());
      dispatch(setObjectReferenceSelectedLoader(false));
    }
  };
};

export const addReferenceObjectItems = (
  id: number,
  items: { items: string[] },
) => {
  return async (dispatch: Dispatch<any>, _getState: any) => {
    dispatch(apiCallReset());
    dispatch(apiCallRequest(true, 'Adding reference object items'));
    try {
      await addingReferenceObjectItem(id, items);
      dispatch(apiCallSuccess('Reference Object items added successfully'));
    } catch (e) {
      dispatch(apiCallFail('Failed to add reference object items'));
    }
  };
};

export const removeReferenceObjectItems = (
  id: number,
  items: { items: string[] },
) => {
  return async (dispatch: Dispatch<any>, _getState: any) => {
    dispatch(apiCallReset());
    dispatch(apiCallRequest(true, 'Removing reference object items'));
    try {
      await removingReferenceObjectItem(id, items);
      dispatch(apiCallSuccess('Reference Object items removed successfully'));
    } catch (e) {
      dispatch(apiCallFail('Failed to remove reference object items'));
    }
  };
};

export const uploadRefObjectCSVFile = (file: File, callBack?: Function) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(apiCallReset());
      dispatch(apiCallRequest(false, ''));
      let formData = new FormData();
      formData.append('file', file);
      await postRefObjectCSVFile(formData);
      dispatch(apiCallSuccess('Successfully created reference objects'));
      setTimeout(() => {
        callBack && callBack();
      }, 1000);
    } catch (error) {
      const errData = error.response.data;
      let errText: string = 'Failed to create reference Object';
      // if (errData) {
      //   if (errData.hasOwnProperty('error')) {
      //     errText = errData.error;
      //   } else if (typeof errData === 'object' && Array.isArray(errData)) {
      //     errText = errData[0]?.errors?.non_field_errors?.msg
      //       ? errData[0]?.errors?.non_field_errors?.msg
      //       : errText;
      //   }
      // }
      dispatch(apiCallFail(errText));
      dispatch(updateBackendErrors(errData));
    }
  };
};

export const getObjectReferenceDropdownList = () => {
  return async (dispatch: Dispatch<any>) => {
    dispatch(apiCallReset());
    dispatch(apiCallRequest(true));
    dispatch(setListLoader(true));
    try {
      const response = await fetchObjectReferenceDropdownList();
      const data = response.data;
      dispatch(saveReferenceObjects(data));
      // dispatch(savePaginationData(data.pagination_data));
      dispatch(apiCallSuccess());
      dispatch(setListLoader(false));
    } catch (e) {
      dispatch(apiCallFail());
      dispatch(saveReferenceObjects([]));
      dispatch(setListLoader(false));
    }
  };
};
