export const ACTIONS = {
  SET_ENCRYPTION_LIST_LOADER: 'SET_ENCRYPTION_LIST_LOADER',
  SET_ENCRYPTION_FORM_LOADER: 'SET_ENCRYPTION_FORM_LOADER',
  SET_ENCRYPTION_LIST: 'SET_ENCRYPTION_LIST',
  SET_ENCRYPTION_DATA: 'SET_ENCRYPTION_DATA',
  SET_ENTITY_LIST: 'SET_ENTITY_LIST',
  SET_FORM_STATUS: 'SET_FORM_STATUS',
  SET_KEY_ERROR: 'SET_KEY_ERROR',
  SET_INBOUND_LIST: 'SET_INBOUND_LIST',
  SET_INBOUND_LIST_LOADER: 'SET_INBOUND_LIST_LOADER',
};

// LOADERS //

export const setEncryptionListLoader = (status: boolean) => {
  return {
    type: ACTIONS.SET_ENCRYPTION_LIST_LOADER,
    payload: status,
  };
};

export const setEncryptionFormLoader = (status: boolean) => {
  return {
    type: ACTIONS.SET_ENCRYPTION_FORM_LOADER,
    payload: status,
  };
};
// Data Stores Functions//

export const setEncryptionList = (data: any) => {
  return {
    type: ACTIONS.SET_ENCRYPTION_LIST,
    payload: data,
  };
};

export const setEncryptionData = (data: any) => {
  return {
    type: ACTIONS.SET_ENCRYPTION_DATA,
    payload: data,
  };
};

export const setEntityList = (data: any) => {
  return {
    type: ACTIONS.SET_ENTITY_LIST,
    payload: data,
  };
};

export const updateFormStatus = (status: string) => {
  return {
    type: ACTIONS.SET_FORM_STATUS,
    payload: status,
  };
};

export const updateKeyError = (error: string) => {
  return {
    type: ACTIONS.SET_KEY_ERROR,
    payload: error,
  };
};

export const setInboundList = (data: any) => {
  return {
    type: ACTIONS.SET_INBOUND_LIST,
    payload: data,
  };
};

export const setInboundLoader = (status: any) => {
  return {
    type: ACTIONS.SET_INBOUND_LIST_LOADER,
    payload: status,
  };
};
