import axios from '../../utils/reimAxios.utils';

export const fetchSystemLabelsCustomisationAPI = () =>
  axios.get('/system-label-customisations/');

export const updateSystemLabelsCustomisationAPI = (data: any) =>
  axios.post('/system-label-customisations/', data);
