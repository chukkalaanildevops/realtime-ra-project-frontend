import { Dispatch } from 'react';
import {
  saveSchedule,
  setError,
  setLoader,
  setLoadingMessage,
  setSuccess,
  setDataSaveLoader,
  setPastExecutionJobDataLoading,
  savePastExecutionJobData,
  setPastExecutionJobError,
  setLoadingJobLogData,
  saveJobLogData,
  setJobLogError,
} from './inbound.action';

import {
  createInboundScheduleAPI,
  downloadLogsAPI,
  fetchInboundScheduleAPI,
  getJobLogDataAPI,
  pastExecutionJobDataAPI,
} from '../../services/inbound';
import { AxiosError } from 'axios';
const FileDownload = require('js-file-download');

const apiStart = (isLoader = false, message = '') => {
  return async (dispatch: Dispatch<any>) => {
    dispatch(setLoader(isLoader));
    dispatch(setLoadingMessage(message));
  };
};

export const fetchSchedules = () => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(apiStart(true));
      const data = await fetchInboundScheduleAPI();
      const scheduleData = data.data;
      dispatch(saveSchedule([scheduleData]));
      dispatch(apiStart(false, ''));
    } catch (e) {
      dispatch(apiStart(false, ''));
      // dispatch(setError('Failed to fetch schedule data'));
    }
  };
};

export const createUpdateSchedule = (body: any, id?: number) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(apiStart(false, 'Updating Schedule'));
      dispatch(setDataSaveLoader(true));
      // id
      //   ? await createInboundScheduleAPI(body)
      //   : await createInboundScheduleAPI(body);
      await createInboundScheduleAPI(body);
      dispatch(fetchSchedules());
      dispatch(apiStart(false, ''));
      dispatch(setDataSaveLoader(false));
      dispatch(setSuccess('Schedule updated successfully'));
    } catch (e) {
      dispatch(setDataSaveLoader(false));
      dispatch(apiStart(false, ''));
      const data = (e as AxiosError).response?.data;
      dispatch(setError(data || 'Failed to update schedule'));
    }
  };
};

export const listPastExecutionJobData = (
  pageNumber: number = 1,
  pageSize?: any,
) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(setPastExecutionJobDataLoading(true));

      const response = await pastExecutionJobDataAPI(pageNumber, pageSize);

      const responseData = response.data;
      dispatch(savePastExecutionJobData(responseData));
      dispatch(setPastExecutionJobDataLoading(false));
    } catch (e) {
      dispatch(setPastExecutionJobError(e));
    }
  };
};

export const getInboundJobLogData = (jobId: any, successStatus: boolean) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(setLoadingJobLogData(true));

      const response = await getJobLogDataAPI(jobId, successStatus);

      const responseData = response.data;
      dispatch(saveJobLogData(responseData));
      dispatch(setLoadingJobLogData(false));
    } catch (e) {
      dispatch(setJobLogError(e));
    }
  };
};

export const downloadLogs = (jobId: any, status: String) => {
  return async () => {
    if (status === 'true') {
      const response = await downloadLogsAPI(jobId, '?error_report=true');
      FileDownload(
        response.data,
        `pastJobExecutionErrorLogs_JobId_${jobId}.csv`,
      );
    } else {
      const response = await downloadLogsAPI(jobId, '');
      FileDownload(response.data, `pastJobExecutionLogs_JobId_${jobId}.txt`);
    }
  };
};
