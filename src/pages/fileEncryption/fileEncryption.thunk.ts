import { Dispatch } from 'react';
import {
  success,
  destroy,
  error,
} from '../../shared/components/responcePopUp/responcePopUp';
import {
  generateKeyAPI,
  fetchLegalEntities,
  getEncryptionListAPI,
  getEncryptionDataAPI,
  createEncryptionListAPI,
  updateEncryptionListAPI,
  deleteEncryptionListAPI,
  getInboundEncryptionListAPI,
} from '../../services/fileEncryption';
import {
  setEntityList,
  setInboundList,
  setInboundLoader,
  updateFormStatus,
  setEncryptionListLoader,
  setEncryptionFormLoader,
  updateKeyError,
  setEncryptionList,
  setEncryptionData,
} from './store/fileEncryption.action';

export const getLegalEntityList = () => {
  return (dispatch: Dispatch<any>) => {
    fetchLegalEntities()
      .then((response: any) => {
        dispatch(setEntityList(response.data));
      })
      .then(() => {
        destroy();
      })
      .catch(() => {
        destroy();
        error('Failed to Load Entity List');
      });
  };
};

export const getEncryptionList = (tab: any) => {
  return (dispatch: Dispatch<any>) => {
    dispatch(setEncryptionListLoader(true));
    getEncryptionListAPI(tab)
      .then((response: any) => {
        dispatch(setEncryptionList(response.data.data));
      })
      .then(() => {
        destroy();
        dispatch(setEncryptionListLoader(false));
      })
      .catch(() => {
        destroy();
        dispatch(setEncryptionListLoader(false));
        error('Failed to Load Encryption List');
      });
  };
};

export const getEncryptionData = (id: any) => {
  return (dispatch: Dispatch<any>) => {
    getEncryptionDataAPI(id)
      .then((response: any) => {
        dispatch(setEncryptionData(response.data));
      })
      .then(() => {
        destroy();
      })
      .catch(() => {
        destroy();
        error('Failed to Load Encryption data');
      });
  };
};

export const createEncryptionData = (data: any) => {
  return (dispatch: Dispatch<any>) => {
    dispatch(setEncryptionFormLoader(true));
    createEncryptionListAPI(data)
      .then(() => {
        destroy();
        success('Data created Successful');
        dispatch(setEncryptionFormLoader(false));
        dispatch(updateFormStatus('success'));
      })
      .catch(err => {
        destroy();
        dispatch(setEncryptionFormLoader(false));
        dispatch(updateKeyError(err.response.data.detail[0]));
        error(err.response.data.detail[0]);
      });
  };
};

export const generateKeyFunction = () => {
  return (dispatch: Dispatch<any>) => {
    dispatch(setInboundLoader(true));
    generateKeyAPI()
      .then(() => {
        dispatch(getInboundList());
        dispatch(setInboundLoader(false));
      })
      .catch(err => {
        dispatch(setInboundLoader(false));
      });
  };
};

export const getInboundList = () => {
  return (dispatch: Dispatch<any>) => {
    dispatch(setEncryptionListLoader(true));
    getInboundEncryptionListAPI()
      .then((response: any) => {
        dispatch(setInboundList(response.data));
        dispatch(setEncryptionListLoader(false));
      })
      .catch(err => {
        dispatch(setEncryptionListLoader(false));
      });
  };
};
export const updateEncryptionData = (id: any, data: any) => {
  return (dispatch: Dispatch<any>) => {
    dispatch(setEncryptionFormLoader(true));

    updateEncryptionListAPI(id, data)
      .then(() => {
        destroy();
        success('Data updated Successful');
        dispatch(setEncryptionFormLoader(false));

        dispatch(updateFormStatus('success'));
      })
      .catch(err => {
        destroy();
        dispatch(setEncryptionFormLoader(false));
        dispatch(updateKeyError(err.response.data.detail[0]));
        error(err.response.data.detail[0]);
      });
  };
};

export const deleteEncryptionData = (id: any) => {
  return (dispatch: Dispatch<any>) => {
    deleteEncryptionListAPI(id)
      .then(() => {
        destroy();
        success('Data Deleted Successful');
        dispatch(updateFormStatus('success'));
      })
      .catch(() => {
        destroy();
        error('Failed to delete Data');
      });
  };
};
