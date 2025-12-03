import axios from '../../utils/reimAxios.utils';

export const fetchOutboundScheduleAPI = () =>
  axios.get('/outbound-schedule-configuration/');

export const createOutboundScheduleAPI = (body: any) =>
  axios.post('/outbound-schedule-configuration/', body);

export const updateOutboundScheduleAPI = (body: any, id: number) =>
  axios.post(`/outbound-schedule-configuration/`, body);

export const fetchOutboundFileFormatsAPI = () =>
  axios.get('/outbound-file-format/');

export const fetchScheduleCategoryRecords = () =>
  axios.get('outbound-schedule-configuration/categories/');

export const fetchScheduleFileSplitRecords = () =>
  axios.get('outbound-schedule-configuration/file-split-options/');

export const fetchScheduleDateFormat = () =>
  axios.get('outbound-schedule-configuration/date-format/');

export const fetchScheduleDelimiter = () =>
  axios.get('outbound-schedule-configuration/delimiter/');

export const labelMappingAPI = (category: string) =>
  axios.get(
    `/outbound-schedule-configuration/label-mappings/?category=${category}`,
  );
