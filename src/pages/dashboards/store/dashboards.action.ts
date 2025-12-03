export const DASHBOARDS_ACTIONS = {
  SET_DASHBOARD_LIST: 'DASHBOARDS_ACTIONS.SET_DASHBOARD_LIST',
  SET_LAYOUT_LIST: 'DASHBOARDS_ACTIONS.SET_LAYOUT_LIST',
  SET_LAYOUT_LIST_LOADER: 'DASHBOARDS_ACTIONS.SET_LAYOUT_LIST_LOADER',
  SET_DASHBOARD_LIST_LOADER: 'DASHBOARDS_ACTIONS.SET_DASHBOARD_LIST_LOADER',
};

// LOADERS //

export const setDashboardListLoader = (status: boolean) => {
  return {
    type: DASHBOARDS_ACTIONS.SET_DASHBOARD_LIST_LOADER,
    payload: status,
  };
};
export const setLayoutListLoader = (status: boolean) => {
  return {
    type: DASHBOARDS_ACTIONS.SET_LAYOUT_LIST_LOADER,
    payload: status,
  };
};

// Data Stores Functions//

export const setDashboardList = (data: any) => {
  return {
    type: DASHBOARDS_ACTIONS.SET_DASHBOARD_LIST,
    payload: data,
  };
};

export const setLayoutList = (data: any) => {
  return {
    type: DASHBOARDS_ACTIONS.SET_LAYOUT_LIST,
    payload: data,
  };
};
