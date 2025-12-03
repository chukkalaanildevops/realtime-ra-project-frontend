import { message } from 'antd';
import { AxiosResponse } from 'axios';
import { Dispatch } from 'react';
import {
  fetchEmailTemplatesService,
  toggleEmailTemplateActiveStatusService,
  updateEmailTemplateService,
  fetchTriggerTypesData,
} from '../../../../../services/emailTemplates';
import {
  setLoader,
  setServiceCallFailed,
  setFormSubmissionInProgress,
  setFormSubmissionSuccessful,
  setFormErrors,
  setEmailTemplates,
  setTriggerTypes,
} from './emailTemplates.actions';

export const setPageLoader = (isLoading: boolean) => {
  return async (dispatch: Dispatch<any>) => {
    dispatch(setLoader(isLoading));
  };
};

export const fetchEmailTemplates = () => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(setLoader(true));
      const response: AxiosResponse = await fetchEmailTemplatesService();
      dispatch(setEmailTemplates(response.data));
    } catch (error) {
      dispatch(setServiceCallFailed(true, error.response.data.error));
    }
  };
};

export const updateEmailTemplate = (
  templateId: number,
  data: { [key: string]: any },
) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(setFormSubmissionInProgress(true));
      await updateEmailTemplateService(templateId, data);
      dispatch(setFormSubmissionInProgress(false));
      dispatch(setFormSubmissionSuccessful(true));
      dispatch(fetchEmailTemplates());
      message.success('Email template has been updated');
    } catch (error) {
      dispatch(setFormSubmissionInProgress(false));
      dispatch(setFormSubmissionSuccessful(true));
      dispatch(setFormErrors(error.response.data));
    }
  };
};

export const toggleEmailTemplateActiveStatus = (
  templateId: number,
  data: { [key: string]: any },
) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      await toggleEmailTemplateActiveStatusService(templateId, data);
      dispatch(fetchEmailTemplates());
      message.success('Email template has been updated');
    } catch (error) {
      message.error(error.response.data.error);
    }
  };
};

export const fetchTriggerTypes = () => {
  return async (dispatch: Dispatch<any>) => {
    try {
      const response: AxiosResponse = await fetchTriggerTypesData();
      dispatch(setTriggerTypes(response.data));
    } catch (error) {}
  };
};
