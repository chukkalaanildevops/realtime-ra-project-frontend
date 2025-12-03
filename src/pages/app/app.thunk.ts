import {
  getWorkFlow,
  addRemarks,
  getRemarks,
  getReceipts,
  addApprover,
  updateApprover,
  fetchApproverCustomFieldDataAPI,
} from '../../services/app/';
import { Dispatch } from 'react';
import {
  apiCallFail,
  apiCallRequest,
  apiCallSuccess,
  setWorkflowData,
  setWorkflowDataLoader,
  setWorkflowDetailsComponentProps,
  setWorkflowDataForPDFPrint,
} from './app.actions';
import { IfetchWorkFlowDataProps, remarkType, IRemark } from './app.model';
import { fetchUsersForDD } from '../../shared/redux/auth/auth.thunk';
import { stateInterface } from '../../shared/redux/rootReducer';

export const fetchWorkFlowData = (props: IfetchWorkFlowDataProps) => {
  return async (
    dispatch: Dispatch<any>,
    _getState: () => stateInterface | any,
  ) => {
    try {
      dispatch(apiCallRequest(false));
      dispatch(setWorkflowDataLoader(true));

      const res = await getWorkFlow(props?.id, props?.type);
      const newData: any = [...res.data];
      if (newData) {
        let isApproversUpdated = false;
        // eslint-disable-next-line no-unused-expressions
        for (let i = 0; i < newData.length; i++) {
          const item = newData[i];
          for (let j = 0; j < item.workflow_steps.length; j++) {
            const data = item.workflow_steps[j];
            if (data?.employee_approver_custom_field) {
              const response = await fetchApproverCustomFieldDataAPI(
                data?.employee_approver_custom_field,
              );

              data['step_owner'] = response?.data?.title;
            }
          }
          isApproversUpdated = true;
        }
        if (isApproversUpdated) {
          dispatch(setWorkflowData(newData));
        }
      }

      const wFData = {
        id: props?.id,
        type: props?.type,
        ...(props?.workflowComponentProps || {}),
      };

      dispatch(setWorkflowDetailsComponentProps(wFData));
      dispatch(fetchUsersForDD());

      dispatch(apiCallSuccess());
      dispatch(setWorkflowDataLoader(false));
    } catch (error) {
      dispatch(apiCallFail());
      dispatch(setWorkflowDataLoader(false));
    }
  };
};

export const fetchWorkFlowDataForPDFPrint = (id: any, type: any) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(apiCallRequest(false));
      const res = await getWorkFlow(id, type);
      dispatch(setWorkflowDataForPDFPrint(res.data));
    } catch (error) {
      dispatch(apiCallFail());
    }
  };
};

export const addApproverPostAPI = (id: number, approvers: number[]) => {
  return async (dispatch: Dispatch<any>, getState: any) => {
    const { WorkflowDetailsComponentProps } = getState().app;
    try {
      dispatch(apiCallRequest(false));
      dispatch(setWorkflowDataLoader(true));
      await addApprover(id, approvers);
      dispatch(apiCallSuccess('Approvers Added Successfully'));
      dispatch(setWorkflowDataLoader(false));
      dispatch(
        fetchWorkFlowData({
          id: WorkflowDetailsComponentProps.id,
          type: WorkflowDetailsComponentProps.type,
          workflowComponentProps: WorkflowDetailsComponentProps,
        } as any),
      );
    } catch (error) {
      dispatch(
        apiCallFail(error?.response?.data?.error || 'Failed To Add Approvers'),
      );
      dispatch(setWorkflowDataLoader(false));
    }
  };
};

export const updateApproverPostAPI = (id: number, approvers: number[]) => {
  return async (dispatch: Dispatch<any>, getState: any) => {
    const { WorkflowDetailsComponentProps } = getState().app;
    try {
      dispatch(apiCallRequest(false));
      dispatch(setWorkflowDataLoader(true));
      await updateApprover(id, approvers);
      dispatch(apiCallSuccess('Approvers Updated Successfully'));
      dispatch(setWorkflowDataLoader(false));
      dispatch(
        fetchWorkFlowData({
          id: WorkflowDetailsComponentProps.id,
          type: WorkflowDetailsComponentProps.type,
          workflowComponentProps: WorkflowDetailsComponentProps,
        } as any),
      );
    } catch (error) {
      dispatch(
        apiCallFail(
          error?.response?.data?.error || 'Failed To Update Approvers',
        ),
      );
      dispatch(setWorkflowDataLoader(false));
    }
  };
};

export const addRemarkById = (
  type: remarkType,
  id: number,
  body: any,
  callback?: (success?: string, error?: string, responseError?: any) => void,
) => {
  return async () => {
    try {
      await addRemarks(type, id, body);
      callback && callback('Remark added successfully');
    } catch (error) {
      if (error || error?.response?.data) {
        callback &&
          callback(undefined, 'Failed to add remark', error?.response?.data);
      }
    }
  };
};

export const fetchRemarks = (
  type: remarkType,
  id: number,
  callback?: (success?: IRemark[], error?: string) => void,
) => {
  return async () => {
    try {
      const res = await getRemarks(type, id);
      callback && callback(res.data);
    } catch (error) {
      callback && callback(undefined, 'Failed to fetch remarks');
    }
  };
};

export const fetchReceipts = (
  type: any,
  id: any,
  callback?: (success?: any[], error?: string) => void,
) => {
  return async () => {
    try {
      const res = await getReceipts(type, id);
      callback && callback(res.data);
    } catch (error) {
      callback && callback(undefined, 'Failed to fetch receipts');
    }
  };
};
