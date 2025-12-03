import {
  activeDelegateAPI,
  addNewDelegateAPI,
  deleteDelegateAPI,
  fetchDelegateRecordsAPI,
  fetchProxyPermissionsAPI,
  updateDelegateAPI,
  approveRejectDelegate,
  getUsersListAPI,
  getDelegateUserByIdAPI,
} from '../../services/delegate';
import { CONSTANTS } from '../../shared/redux/auth/auth.model';

import {
  saveProxyPermissions,
  saveDelegatedToMe,
  // setError,
  setErrorObject,
  saveDelegatedByMe,
  saveProxyUsers,
  setAPILoading,
  saveCurrentDelegateUser,
  configDelegationScreen,
  saveJobInformation,
  setCurrantDelegateLoader,
} from './delegate.action';
import {
  success,
  loading,
  destroy,
  error,
} from '../../shared/components/responcePopUp/responcePopUp';
import { Dispatch } from 'react';
import { DELEGATE_TABS } from './delegate.model';
import { stateInterface } from '../../shared/redux/rootReducer';
import { resetAllData } from '../app/app.actions';
import { fetchEmpJobInformation } from '../../services/auth';

export const fetchDelegateRecords = (
  tab: DELEGATE_TABS,
  page?: number,
  _filters?: any,
  pageSize?: number,
) => {
  return (dispatch: Dispatch<any>, getState: () => stateInterface) => {
    const pageNumber = page || getState()?.delegates[tab]?.current_page;
    if (
      getState()?.delegates[tab]?.data.length === 0 ||
      getState()?.delegates[tab]?.current_page !== pageNumber
    ) {
      loading(true);
    }
    destroy();
    fetchDelegateRecordsAPI(
      'data',
      tab === 'delegated-by-me',
      pageNumber,
      pageSize,
    )
      .then(({ data }) => {
        if (data.length === 0 && pageNumber !== 1) {
          dispatch(fetchDelegateRecords(tab, (pageNumber || 2) - 1));
          return;
        }
        const current_page = pageNumber;
        if (tab === 'delegated-by-me') {
          dispatch(saveDelegatedByMe({ ...data, current_page }));
        } else {
          dispatch(saveDelegatedToMe({ ...data, current_page }));
        }
        destroy();
      })
      .catch(() => {
        destroy();
      });
  };
};

export const createDelegateRecord = (
  body: any,
  tab: DELEGATE_TABS,
  id?: number,
) => {
  return (dispatch: Dispatch<any>) => {
    loading(true, 'Saving Data');
    dispatch(setAPILoading(true));
    const response = id ? updateDelegateAPI(body, id) : addNewDelegateAPI(body);
    response
      .then(() => {
        destroy();
        dispatch(fetchDelegateRecords(tab));
        dispatch(setErrorObject(true));
        dispatch(setAPILoading(false));
      })
      .then(() => {
        success(`Record ${id ? 'Updated' : 'Created'} successfully`);
      })
      .catch(err => {
        destroy();
        dispatch(ErrorMessage(err, id));
        dispatch(setAPILoading(false));
      });
  };
};

export const deleteDelegate = (id: number, tab: DELEGATE_TABS) => {
  return (dispatch: Dispatch<any>) => {
    loading(true, 'Deleting Delegation');
    deleteDelegateAPI(id)
      .then(() => {
        destroy();
        dispatch(fetchDelegateRecords(tab));
      })
      .then(() => {
        success(`Delegation deleted`);
      })
      .catch(() => {
        destroy();
        error(`Failed to delete delegation`);
      });
  };
};

export const activeDelegate = (
  id: number,
  isActive: boolean,
  tab: DELEGATE_TABS,
) => {
  return (dispatch: Dispatch<any>) => {
    loading(true, `${isActive ? 'Activating' : 'Deactivating'} delegation`);
    activeDelegateAPI(id, isActive)
      .then(() => {
        destroy();
        dispatch(fetchDelegateRecords(tab));
      })
      .catch(() => {
        destroy();
        error(`Failed to ${isActive ? 'activate' : 'deactivate'} delegation`);
      });
  };
};

export const fetchProxyPermissions = () => {
  return (dispatch: Dispatch<any>) => {
    fetchProxyPermissionsAPI()
      .then((response: any) => {
        dispatch(saveProxyPermissions(response.data));
      })
      .catch(() => {
        error(`Failed to fetch permissions`);
      });
  };
};

export const respondDelegate = (
  id: number,
  status: 'approved' | 'rejected',
  tab: DELEGATE_TABS,
) => {
  return (dispatch: Dispatch<any>) => {
    loading(
      true,
      `${status === 'approved' ? 'Approving' : 'Rejecting'} delegation invite`,
    );
    approveRejectDelegate(id, status)
      .then(() => {
        destroy();
        dispatch(fetchDelegateRecords(tab));
        dispatch(fetchDelegateUsers());
      })
      .catch(() => {
        destroy();
        error(`Failed to ${status} delegation invite`);
      });
  };
};

export const fetchDelegateUsers = () => {
  return (dispatch: Dispatch<any>) => {
    getUsersListAPI()
      .then((response: any) => {
        dispatch(saveProxyUsers(response.data));
      })
      .catch(() => {});
  };
};

export const fetchCurrentDelegateUser = (id: number) => {
  return (dispatch: Dispatch<any>) => {
    dispatch(setCurrantDelegateLoader(true));
    dispatch(
      configDelegationScreen({
        for: '',
        message: 'Configuring screen for Delegation',
      }),
    );

    getDelegateUserByIdAPI(id)
      .then((response: any) => {
        dispatch(resetAllData());
        dispatch(saveCurrentDelegateUser(response.data[0]));
        dispatch(configDelegationScreen(undefined));
        dispatch(fetchJobInfo(id));
      })
      .catch((err: any) => {
        if (err.response.data.error === 'No Active Employee Job Information.') {
          sessionStorage.removeItem(CONSTANTS.DELEGATE_USER);
        }
        dispatch(configDelegationScreen(undefined));
      });
    dispatch(setCurrantDelegateLoader(false));
  };
};

export const fetchJobInfo = (id: number) => {
  return (dispatch: Dispatch<any>) => {
    fetchEmpJobInformation(id + '')
      .then((response: any) => {
        dispatch(saveJobInformation(response.data));
      })
      .catch(() => {});
  };
};

///////////////////// PRIVATE FUNCTION /////////////////////////

export function ErrorMessage(err: any, id: number | undefined) {
  return (dispatch: Dispatch<any>) => {
    const error = err.response.data;
    if (error) {
      if (error.employee) {
        dispatch(
          setErrorObject(true, {
            type: 'employee',
            message: error.employee,
          }),
        );
      } else if (error.end_date) {
        dispatch(
          setErrorObject(true, {
            type: 'end_date',
            message: error.end_date,
          }),
        );
      } else {
        dispatch(setErrorObject(true));
        error(`Failed to ${id ? 'Update' : 'Create'} delegation`);
      }
    } else {
      dispatch(setErrorObject(true));
      error(`Failed to ${id ? 'Update' : 'Create'} delegation`);
    }
  };
}
