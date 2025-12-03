import { Dispatch } from 'react';
import {
  setDashboardListLoader,
  setLayoutListLoader,
  setDashboardList,
  setLayoutList,
} from './store/dashboards.action';

import {
  destroy,
  error,
} from '../../shared/components/responcePopUp/responcePopUp';

import {
  getDashboardList,
  getLayoutDataList,
  // getDashboardChartData,
} from '../../services/dashboards';

export const getDashboardDropdownList = () => {
  return (dispatch: Dispatch<any>) => {
    dispatch(setDashboardListLoader(true));
    getDashboardList()
      .then((response: any) => {
        dispatch(setDashboardList(response.data));
      })
      .then(() => {
        destroy();
        dispatch(setDashboardListLoader(false));
      })
      .catch(() => {
        destroy();
        dispatch(setDashboardListLoader(false));
        error('Failed to Load Dashboard List');
      });
  };
};

export const getLayoutList = (id: string) => {
  return (dispatch: Dispatch<any>) => {
    dispatch(setLayoutListLoader(true));
    getLayoutDataList(id)
      .then((response: any) => {
        dispatch(setLayoutList(response.data));
      })
      .then(() => {
        destroy();
        dispatch(setLayoutListLoader(false));
      })
      .catch(() => {
        destroy();
        dispatch(setLayoutListLoader(false));
        error('Failed to Layout Data List');
      });
  };
};

// export const getColumnData = (id: number) => {
//   return (dispatch: Dispatch<any>) => {
//     getDashboardChartData(id)
//       .then((response: any) => {
//       })
//       .catch((err: any) => {
//       });
//   };
// };
