import axios from '../../utils/reimAxios.utils';

export const fetchUserLangAPI = (userID: any) =>
  axios.get(`/users/${userID}/get-user-language/`);

export const setUserLangAPI = (lang: any, id: number) =>
  axios.patch(`/users/${id}/update-user-language/`, { language: lang });
