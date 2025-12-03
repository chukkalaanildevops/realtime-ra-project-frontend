import axios from '../../utils/reimAxios.utils';

export const expenseAuditDataAPI = (type: string, id: string) =>
  axios.get(`requests/521/history/`);

// axios.get(`${type}/${id}/history/`);
