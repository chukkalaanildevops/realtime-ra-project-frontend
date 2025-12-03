import { DASHBOARDS_ACTIONS } from './dashboards.action';

const initialState: any = {
  dashboardList: [],
  dashboardListLoader: false,
  layoutDataList: [],
  layoutDataListLoader: false,
};
const DashboardsReducer: any = (
  state = initialState,
  actions: { type: any; payload: any },
) => {
  const { type, payload } = actions;

  switch (type) {
    // LOADERS //

    case DASHBOARDS_ACTIONS.SET_DASHBOARD_LIST_LOADER:
      return {
        ...state,
        dashboardListLoader: payload,
      };
    case DASHBOARDS_ACTIONS.SET_LAYOUT_LIST_LOADER:
      return {
        ...state,
        layoutDataListLoader: payload,
      };

    // Data Stores //
    case DASHBOARDS_ACTIONS.SET_DASHBOARD_LIST:
      return {
        ...state,
        dashboardList: payload,
      };
    case DASHBOARDS_ACTIONS.SET_LAYOUT_LIST:
      return {
        ...state,
        layoutDataList: payload,
      };
    default:
      return state;
  }
};

export default DashboardsReducer;
