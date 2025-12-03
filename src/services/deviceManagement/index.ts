import axios from '../../utils/reimAxios.utils';

export const getQrOtp = () => {
  return axios.get('/device-management/get-otp/');
};

export const getDeviceList = () => {
  return axios.get(`/employee-device/`);
};

export const deleteEmployeeDevice = (id: number) =>
  axios.delete(`/employee-device/${id}/`);
