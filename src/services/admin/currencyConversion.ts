import axios from '../../utils/reimAxios.utils';

export const fetchCurrencyConversionList = (
  page: number,
  pageSize: number,
  filter?: any,
) => {
  // const idString = id ? id + '/' : '';
  let url = `/currency-conversions/?page=${page}&page_size=${pageSize}`;
  if (filter) {
    let params = '';
    Object.keys(filter).forEach((item: string, index) =>
      filter[item] ? (params += `&${item}=${filter[item]}`) : '',
    );
    url += params;
  }

  return axios.get(url);
};

export const postCurrencyConversionItem = (body: any) =>
  axios.post('/currency-conversions/', body);

export const uploadCurrencyConversionCSV_API = (file: any) => {
  let formData = new FormData();
  formData.append('file', file);
  return axios.post('/currency-conversions/csv-upload/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const fetchCurrencies = () => axios.get('/currencies/');

export const fetchCountryCurrencies = () =>
  axios.get('/country-currencies/?show_all=true');

export const updateCurrencyConversion = (id: string, body: any) =>
  axios.put('/currency-conversions/' + id + '/', body);

export const fetchCurrencyConversionHistory = (id: string) =>
  axios.get(`/currency-conversions/${id}/?show_all=true`);

export const downloadCSVTemplateAPI = () =>
  axios.get(`/currency-conversions/sample_csv_template/`);

export const getConversionRate = (
  date: string,
  base: number,
  target: number,
) => {
  return axios.get(
    `/currency-conversions/conversion-rate/?date=${date}&target=${base}&base=${target}`,
  );
};

export const getAllowanceConversionRate = (
  date: string,
  target: string,
  base: string,
) => {
  return axios.get(
    `/currency-conversions/conversion-rate-code/?date=${date}&target=${target}&base=${base}`,
  );
};

export const getLocalCurrency = (userId: number) =>
  axios.get(`/users/${userId}/local-currency/`);

export const uploadFromFTP_API = () =>
  axios.post('/currency-conversions/upload-from-ftp/');
