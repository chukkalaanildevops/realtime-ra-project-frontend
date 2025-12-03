import axios from '../../utils/reimAxios.utils';

export const getPlacesAPI = (Place: any) => {
  return axios.get(`/geolocations/?action=places&q=${Place}`, {
    headers: {
      'secret-key': process.env.REACT_APP_GEO_LOCATION_KEY,
    },
  });
};

export const getPlacesDistanceAPI = (Data: any) => {
  return axios.get(
    `/geolocations/?action=distance&&origin=${Data.source}&destination=${Data.destination}
  `,
    {
      headers: {
        'secret-key': process.env.REACT_APP_GEO_LOCATION_KEY,
      },
    },
  );
};
