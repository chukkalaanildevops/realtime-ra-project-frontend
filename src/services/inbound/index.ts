import axios from '../../utils/reimAxios.utils';

export const fetchInboundScheduleAPI = () =>
  axios.get('/currency-inbound-outbound-schedule/');

export const createInboundScheduleAPI = (body: any) =>
  axios.post('/currency-inbound-outbound-schedule/', body);

export const updateInboundScheduleAPI = (body: any, id: number) =>
  axios.put(`/currency-inbound-outbound-schedule/${id}/`, body);

export const pastExecutionJobDataAPI = (pageNumber: number, pageSize?: any) =>
  axios.get('/inbound-file-log/', {
    params: {
      page: pageNumber,
      page_size: pageSize,
    },
  });

export const getJobLogDataAPI = (jobId: any, successStatus: boolean) =>
  axios.get(`/inbound-file-log/${jobId}/rows?success=${successStatus}`);

export const downloadLogsAPI = (jobId: any, status: String) =>
  axios.get(`inbound-file-log/${jobId}/download${status}`);
