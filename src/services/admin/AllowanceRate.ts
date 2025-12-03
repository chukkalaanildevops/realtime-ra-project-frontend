import axios from '../../utils/reimAxios.utils';

export const fetchAllowanceRateList = (
  page: number,
  pageSize: number,
  filter?: any,
) => {
  // const idString = id ? id + '/' : '';
  let url = `/allowance-rate/?page=${page}&page_size=${pageSize}`;
  if (filter) {
    let params = '';
    Object.keys(filter).forEach((item: string) =>
      filter[item] ? (params += `&${item}=${filter[item]}`) : '',
    );
    url += params;
  }

  return axios.get(url);
};

export const postAllowanceRateItem = (body: any) =>
  axios.post('/allowance-rate/', body);

export const updateAllowanceRate = (id: string, body: any) =>
  axios.put('/allowance-rate/' + id + '/', body);

export const fetchAllowanceRateHistory = (id: string) =>
  axios.get(`/allowance-rate/${id}/`);

export const fetchCompanies = () => axios.get('legal-entities/?top_level=true');

export const fetchCurrencies = () =>
  axios.get('/reference-objects/items-by-title/?title=Allowance Currency');

export const fetchEligibilities = () =>
  axios.get('/reference-objects/items-by-title/?title=Allowance Eligibility');

export const fetchDestinations = () =>
  axios.get('/reference-objects/items-by-title/?title=Allowance Destination');

export const fetchTitles = () =>
  axios.get('/reference-objects/items-by-title/?title=Allowance Subrate');

export const fetchPayComponents = () =>
  axios.get('/reference-objects/items-by-title/?title=Allowance Pay Component');

export const fetchGlAccounts = (id?: string) => {
  if (id) {
    return axios.get('/gl-accounts/' + id + '/');
  } else {
    return axios.get('/gl-accounts/?dropdown=true');
  }
};

export const downloadCSVTemplateAPI = () =>
  axios.get(`/allowance-rate/csv_file/`);

export const uploadAllowanceRateCSV_API = (file: any) => {
  let formData = new FormData();
  formData.append('file', file);
  return axios.post('/allowance-rate/csv-upload/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
