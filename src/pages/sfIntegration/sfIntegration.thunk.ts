import {
  fetchScheduleAPI,
  fetchFileToModelMappingAPI,
  fetchLegalEntityTypesAPI,
  updateLegalEntityTypesAPI,
  createUpdateScheduleAPI,
  updateFileModelAPI,
  fetchIntegrationJobsAPI,
  executeJobManuallyAPI,
  fetchStagesByJobIdAPI,
  fetchFileToModelMappingByIdAPI,
  fetchLogsByJobIdFileCodeAPI,
  executeFileAPI,
} from '../../services/sfIntegration';

import {
  saveFileToModelMapping,
  saveEntityTypes,
  saveSchedule,
  saveIntegrationJobs,
  setLoader,
  setError,
  setSuccess,
  setLoadingMessage,
  saveStages,
  saveFileConfig,
  saveFileLogs,
  setCurrentJob,
  // saveFTPServers,
  setDataSubmittingLoader,
} from './sfIntegration.actions';
import { Dispatch } from 'redux';
import { AxiosError } from 'axios';

const LOADING_DATA = 'Loading Data...';

const apiStart = (isLoader: boolean, message = LOADING_DATA) => {
  return async (dispatch: Dispatch<any>) => {
    dispatch(setLoader(isLoader));
    dispatch(setLoadingMessage(message));
  };
};

export const fetchLegalEntities = () => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(apiStart(true));
      const data = await fetchLegalEntityTypesAPI();
      dispatch(saveEntityTypes(data.data));
      dispatch(apiStart(false, ''));
    } catch (e) {
      dispatch(apiStart(false, ''));
      dispatch(setError('Failed to fetch legal entities'));
    }
  };
};
export const updateLegalEntities = (body: any, id: string) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(apiStart(false, 'Updating Legal Entity'));
      dispatch(setDataSubmittingLoader(true));
      await updateLegalEntityTypesAPI(body, id);
      dispatch(setDataSubmittingLoader(false));
      dispatch(setSuccess('Legal entity updated successfully'));
      dispatch(fetchLegalEntities());
    } catch (e) {
      dispatch(apiStart(false, ''));
      dispatch(setDataSubmittingLoader(false));
      const data = (e as AxiosError).response?.data;
      dispatch(
        setError(
          data?.error ? data.error : data || 'Failed to update legal entities',
        ),
      );
    }
  };
};

export const fetchFileToModelMapping = () => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(apiStart(true));
      const data = await fetchFileToModelMappingAPI();
      dispatch(saveFileToModelMapping(data.data));
      dispatch(apiStart(false, ''));
    } catch (e) {
      dispatch(apiStart(false));
      dispatch(setError('Failed to fetch file mapping'));
    }
  };
};

export const fetchSchedules = () => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(apiStart(true));
      const data = await fetchScheduleAPI();
      const scheduleData: any[] = data.data;
      const schedule = scheduleData.length > 0 ? scheduleData[0] : {};
      dispatch(saveSchedule(schedule));
      dispatch(apiStart(false, ''));
    } catch (e) {
      dispatch(apiStart(false, ''));
      dispatch(setError('Failed to fetch schedule data'));
    }
  };
};

export const createUpdateSchedule = (body: any, id?: string) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(apiStart(true, 'Updating Schedule'));
      await createUpdateScheduleAPI(body, id);
      dispatch(fetchSchedules());
      dispatch(apiStart(false, ''));
      dispatch(setSuccess('Schedule updated successfully'));
    } catch (e) {
      dispatch(apiStart(false, ''));
      // dispatch(setError('Failed to update schedule'));
      const data = (e as AxiosError).response?.data;
      dispatch(
        setError(
          data?.error ? data.error : data || 'Failed to update schedule',
        ),
      );
    }
  };
};

export const updateFileModelMapping = (
  body: any,
  id: string,
  callBack?: Function,
) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(apiStart(true, 'Update File Mapping'));
      await updateFileModelAPI(body, id);
      dispatch(fetchFileToModelMappingById(id));
      dispatch(apiStart(false, ''));
      dispatch(setSuccess('File model mapping updated successfully'));
      callBack && callBack(true);
    } catch (e) {
      dispatch(apiStart(false, ''));
      dispatch(setError('Failed to update file model mapping'));
      callBack && callBack(false);
    }
  };
};

export const updateIsEnabledInFileModelMapping = (
  body: any,
  id: string,
  callBack?: Function,
) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(apiStart(true, 'Updating File Mapping'));
      await updateFileModelAPI(body, id);
      // dispatch(fetchFileToModelMappingById(id));
      dispatch(apiStart(false, ''));
      dispatch(setSuccess('File model mapping updated successfully'));
      callBack && callBack(true);
    } catch (e) {
      dispatch(apiStart(false, ''));
      dispatch(setError('Failed to update file model mapping'));
      callBack && callBack(false);
    }
  };
};

export const fetchIntegrationJobs = (page: any, pageSize: number) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(apiStart(true));
      const data = await fetchIntegrationJobsAPI(page, pageSize);
      dispatch(saveIntegrationJobs({ ...data.data, current_page: page }));
      dispatch(apiStart(false));
    } catch (e) {
      dispatch(apiStart(false));
      dispatch(setError('Failed to fetch integrated jobs'));
    }
  };
};

export const executeJobManually = () => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(setSuccess(''));
      dispatch(setSuccess('Job has been scheduled'));
      await executeJobManuallyAPI();

      dispatch(fetchIntegrationJobs(1, 10));
    } catch (e) {
      dispatch(setError('Failed to execute job'));
    }
  };
};

export const fetchStagesByJobId = (id: string) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(saveStages([]));
      dispatch(setCurrentJob({}));
      dispatch(apiStart(true));
      const data = await fetchStagesByJobIdAPI(id);
      dispatch(saveStages(data.data?.logs));
      if (data.data) {
        dispatch(
          setCurrentJob({
            id: data.data.id,
            status: data.data.status,
            completed_on: data.data.completed_on,
            time_taken: data.data.time_taken,
          }),
        );
      }
      dispatch(apiStart(false, ''));
    } catch (e) {
      dispatch(apiStart(false, ''));
      dispatch(setError('Failed to fetch logs'));
    }
  };
};

// export const fetchFTPServers = () => {
//   return async (dispatch: Dispatch<any>) => {
//     try {
//       dispatch(apiStart(true));
//       const data = await fetchFtpConfigRecords();
//       dispatch(saveFTPServers(data.data));
//       dispatch(apiStart(false, ''));
//     } catch (e) {
//       dispatch(apiStart(false, ''));
//     }
//   };
// };

export const fetchFileToModelMappingById = (id: string) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(apiStart(true));
      const data = await fetchFileToModelMappingByIdAPI(id);
      dispatch(saveFileConfig(data.data));
      dispatch(apiStart(false, ''));
    } catch (e) {
      dispatch(apiStart(false));
      dispatch(setError('Failed to fetch file mapping'));
    }
  };
};

export const fetchLogsByFileName = (id: string, model: string) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(saveFileLogs([]));
      dispatch(apiStart(true));
      const data = await fetchLogsByJobIdFileCodeAPI(id, model);
      dispatch(saveFileLogs(data.data));
      dispatch(apiStart(false, ''));
    } catch (e) {
      dispatch(apiStart(false, ''));
      dispatch(setError('Failed to fetch logs'));
    }
  };
};

export const executeFile = (code: string) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(apiStart(true));
      const response = await executeFileAPI(code);
      dispatch(setSuccess(response.data.message));
      dispatch(apiStart(false, ''));
    } catch (e) {
      dispatch(apiStart(false, ''));
      dispatch(setError('Failed to fetch logs'));
    }
  };
};
