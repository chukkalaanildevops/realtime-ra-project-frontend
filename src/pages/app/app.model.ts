import React, { ComponentType, ReactNode } from 'react';
import { APP_REDUCER_ACTIONS } from './app.actions';
import { IWorkFlowDetails, TBackendErrors } from '../../shared/model';
import { ModalProps } from 'antd/lib/modal';
import { IItemTypes } from '../approvals/approvals.model';

export interface IappProps {
  tabIsActiveNow?: boolean;
}

export interface IappState {
  isOnline: boolean;
  showModal: boolean;
  isTimedOut: boolean;
}

export interface IroutesConfigObject {
  path: string;
  Component: ComponentType<any> | any;
  exact: boolean;
  isAuthorized?: boolean;
}

export type TroutedConfig = IroutesConfigObject[];

// state interfaces
export interface IinitialStateAppReducer {
  pWAData: IpWAData;
  confirmationInfo: IConfirmationInfo;
  WorkflowDetailsComponentProps: any;
  workflowData: IWorkFlowDetails[];
  workflowDataForPDFPrint: [];
  workflowDataLoader: boolean;
  error: string;
  backendError: TBackendErrors;
  info: string;
  success: string;
  isLoading: boolean;
  remarks?: IRemark[];
  apiError?: any;
}

export interface IpWAData {
  waitingWorker?: any;
  newVersionAvailable?: boolean;
}

export interface IWorkflowDetailsComponentProps {
  header?: ReactNode;
  boldHeader?: boolean;
  modelProps?: ModalProps;
  isAdmin?: boolean;
  onApproverSelection?: (
    approvers: number[],
    stepId: number,
    isAdd: boolean,
  ) => void;
  id?: number;
  type?: IItemTypes;
  showAttachedWorkflow?: boolean;
  onWorkflowAttached?: () => void;
}

export interface IConfirmationInfo {
  visibility: boolean;
  headerText: string | undefined | ReactNode;
  bodyText: string | undefined | ReactNode;
  forWhat: string;
  okText: any | undefined;
  cancelText: any | undefined;
  extraInfo: any;
  cancelBtnFn?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  okBtnFn?:
    | ((e: React.MouseEvent<HTMLElement, MouseEvent>) => void)
    | undefined;
  extraModelProps?: { [x: string]: any };
}

//Reducer function interfaces

export type TAppReducerFn = (
  state: IinitialStateAppReducer,
  payload: TappReducerPayload,
) => IinitialStateAppReducer;

export type TappReducerPayload =
  | IapiCallRequestReturn
  | IapiCallSuccessReturn
  | IapiCallFailReturn
  | IapiCallResetReturn
  | IresetToInitialReturn
  | IsetConfirmationInfoReturn
  | IresetConfirmationInfoReturn
  | IsetWorkflowDataReturn
  | IresetWorkflowDataReturn
  | IsetWorkflowDataLoaderReturn
  | IsetWorkflowDetailsComponentPropsReturn;

//action creatot function

//API RELATED

export interface IapiCallRequestReturn {
  type: typeof APP_REDUCER_ACTIONS.API_CALL_REQUEST;
  payload: {
    error: string;
    success: string;
    info: string;
    isLoading: boolean;
  };
}

export type TapiCallRequestFn = (
  isLoading?: boolean,
  info?: string,
) => IapiCallRequestReturn;

export interface IapiCallSuccessReturn {
  type: typeof APP_REDUCER_ACTIONS.API_CALL_SUCCESS;
  payload: {
    error: string;
    success: string;
    info: string;
    isLoading: boolean;
  };
}

export type TapiCallSuccessFn = (success?: string) => IapiCallSuccessReturn;

export interface IapiCallFailReturn {
  type: typeof APP_REDUCER_ACTIONS.API_CALL_FAIL;
  payload: {
    error: string;
    success: string;
    info: string;
    isLoading: boolean;
  };
}

export type TapiCallFailFn = (err?: string) => IapiCallFailReturn;

export interface IapiCallResetReturn {
  type: typeof APP_REDUCER_ACTIONS.API_CALL_RESET;
  payload: {
    error: string;
    success: string;
    info: string;
    isLoading: boolean;
  };
}

export type TapiCallResetFn = () => IapiCallResetReturn;

export interface IresetToInitialReturn {
  type: typeof APP_REDUCER_ACTIONS.RESET_TO_INITIAL;
  payload?: any;
}

export type TresetToInitialFn = () => IresetToInitialReturn;

//CONFIRMATION
export interface IsetConfirmationInfoReturn {
  type: typeof APP_REDUCER_ACTIONS.SET_CONFIRMATION_INFO;
  payload: IConfirmationInfo;
}

export type TsetConfirmationInfoFn = (
  data: IConfirmationInfo,
) => IsetConfirmationInfoReturn;

export interface IresetConfirmationInfoReturn {
  type: typeof APP_REDUCER_ACTIONS.RESET_CONFIRMATION_INFO;
  payload?: any;
}

export type TresetConfirmationInfoFn = () => IresetConfirmationInfoReturn;

//WORKFLOW
export interface IsetWorkflowDataReturn {
  type: typeof APP_REDUCER_ACTIONS.SET_WORKFLOW_DATA;
  payload: IWorkFlowDetails;
}

export type TsetWorkflowDataFn = (
  data: IWorkFlowDetails,
) => IsetWorkflowDataReturn;

export interface IresetWorkflowDataReturn {
  type: typeof APP_REDUCER_ACTIONS.RESET_WORKFLOW_DATA;
  payload?: any;
}

export type TresetWorkflowDataFn = () => IresetWorkflowDataReturn;

export interface IsetWorkflowDataLoaderReturn {
  type: typeof APP_REDUCER_ACTIONS.SET_WORKFLOW_DATA_LOADER;
  payload: boolean;
}

export type TsetWorkflowDataLoaderFn = (
  bool: boolean,
) => IsetWorkflowDataLoaderReturn;

export interface IsetWorkflowDetailsComponentPropsReturn {
  type: typeof APP_REDUCER_ACTIONS.SET_WORKFLOW_DETAILS_COMPONENT_PROPS;
  payload: IWorkflowDetailsComponentProps;
}

export type TsetWorkflowDetailsComponentPropsFn = (
  props: IWorkflowDetailsComponentProps,
) => IsetWorkflowDetailsComponentPropsReturn;

export type remarkType = 'requests' | 'expense-claims' | 'benefit-claim';

export interface IfetchWorkFlowDataProps {
  id: number;
  type: IItemTypes;
  workflowComponentProps?: IWorkflowDetailsComponentProps;
}

export interface CreatedBy {
  id: number;
  name: string;
  legal_name: string;
  email: string;
  username: string;
}

export interface ModifiedBy {
  id: number;
  name: string;
  email: string;
  username: string;
}

export interface IRemark {
  id: number;
  comment: string;
  request: number;
  created_on: string;
  modified_on: string;
  created_by: CreatedBy;
  modified_by: ModifiedBy;
  created_by_profile_url: string;
}

export type RemarkCallback = (success?: any, error?: any) => any;
