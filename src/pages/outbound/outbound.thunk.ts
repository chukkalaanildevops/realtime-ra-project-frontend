import { Dispatch } from 'react';
import {
  saveSchedule,
  setError,
  setLoader,
  setLoadingMessage,
  setSuccess,
  saveFileFormats,
  saveCategory,
  saveFileSplit,
  setDataLoader,
  saveDateFormat,
  saveDelimiter,
  apiCallRequest,
  apiCallSuccess,
  apiCallFail,
  saveLabelMappingList,
  updateUserLabelList,
  updateLabelData,
} from './outbound.action';

import {
  createOutboundScheduleAPI,
  fetchOutboundScheduleAPI,
  fetchOutboundFileFormatsAPI,
  fetchScheduleCategoryRecords,
  fetchScheduleFileSplitRecords,
  fetchScheduleDateFormat,
  fetchScheduleDelimiter,
  labelMappingAPI,
} from '../../services/outbound';
import { AxiosError } from 'axios';

const apiStart = (isLoader = false, message = '') => {
  return async (dispatch: Dispatch<any>) => {
    dispatch(setLoader(isLoader));
    dispatch(setLoadingMessage(message));
  };
};

export const fetchScheduleCategoryList = () => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(apiStart(true));
      const data = await fetchScheduleCategoryRecords();
      dispatch(saveCategory(data.data));
      dispatch(apiStart(false, ''));
    } catch (e) {
      dispatch(apiStart(false, ''));
      dispatch(setError('Failed to fetch schedule category data'));
    }
  };
};

export const fetchScheduleFileSplitList = () => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(apiStart(true));
      const data = await fetchScheduleFileSplitRecords();
      dispatch(saveFileSplit(data.data));
      dispatch(apiStart(false, ''));
    } catch (e) {
      dispatch(apiStart(false, ''));
      dispatch(setError('Failed to fetch schedule file split data'));
    }
  };
};

export const fetchScheduleDateFormatList = () => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(apiStart(true));
      const data = await fetchScheduleDateFormat();
      dispatch(saveDateFormat(data.data));
      dispatch(apiStart(false, ''));
    } catch (e) {
      dispatch(apiStart(false, ''));
      dispatch(setError('Failed to fetch schedule date format data'));
    }
  };
};

export const fetchScheduleDelimiterList = () => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(apiStart(true));
      const data = await fetchScheduleDelimiter();
      dispatch(saveDelimiter(data.data));
      dispatch(apiStart(false, ''));
    } catch (e) {
      dispatch(apiStart(false, ''));
      dispatch(setError('Failed to fetch schedule delimiter data'));
    }
  };
};

export const fetchSchedules = () => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(apiStart(true));
      const data = await fetchOutboundScheduleAPI();
      const scheduleData = data.data;
      dispatch(saveSchedule(scheduleData));
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
      dispatch(setDataLoader(true));
      dispatch(setLoadingMessage('Updating Schedule'));
      // id
      //   ? await updateOutboundScheduleAPI(body, id)
      //   : await createOutboundScheduleAPI(body);
      await createOutboundScheduleAPI(body);
      dispatch(fetchSchedules());
      dispatch(setDataLoader(false));
      dispatch(setLoadingMessage(''));
      dispatch(setSuccess('Schedule updated successfully'));
    } catch (e) {
      dispatch(setLoadingMessage(''));
      dispatch(setDataLoader(false));
      const data = (e as AxiosError).response?.data;
      dispatch(setError(data || 'Failed to update schedule'));
    }
  };
};

export const fetchFileFormats = () => {
  return async (dispatch: Dispatch<any>) => {
    try {
      const response = await fetchOutboundFileFormatsAPI();
      dispatch(saveFileFormats(response.data));
    } catch (e) {}
  };
};

export const fetchLabelMappingList = (category: string) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(
        apiCallRequest({
          isLoading: false,
          loadingLabelMappingList: true,
        }),
      );
      const response = await labelMappingAPI(category);
      const data = response.data;
      const labelList = Object.values(data)
        .map(item => item)
        .sort((a: any, b: any) => a.default.localeCompare(b.default));
      dispatch(saveLabelMappingList(labelList));
      // eslint-disable-next-line array-callback-return
      const userlabelList = Object.values(data).filter((item: any) => {
        if (item.is_mandatory) {
          return item;
        }
      });
      dispatch(updateUserLabelList(userlabelList));
      const defaultLabelList = userlabelList.map((item: any) => item.default);
      const arrayData = Object.entries(data).filter((item: any) =>
        defaultLabelList.includes(item[1].default),
      );
      const labelData: any = {};
      for (let pair of arrayData) {
        const [key, value] = pair;
        labelData[key] = value;
      }
      dispatch(updateLabelData(labelData));
      dispatch(apiCallSuccess('', { loadingLabelMappingList: false }));
    } catch (e) {
      dispatch(apiCallFail(e.message, { loadingLabelMappingList: false }));
    }
  };
};
