import { ACTIONS } from './fileEncryption.action';

const initialState: any = {
  encryptionListLoader: false,
  encryptionDataList: [],
  inboundEncryptionList: [],
  encryptionFormLoader: false,
  encryptionForm: {},
  tabList: [
    {
      key: '0',
      code: 'expense',
      title: 'Expense',
    },
    {
      key: '1',
      code: 'benefit',
      title: 'Benefit',
    },
  ],
  entityList: [],
  formStatus: '',
  pubKeyError: '',
  inboundListLoader: false,
};
const FileEncryptionReducer: any = (
  state = initialState,
  actions: { type: any; payload: any },
) => {
  const { type, payload } = actions;

  switch (type) {
    // LOADERS //

    case ACTIONS.SET_ENCRYPTION_LIST_LOADER:
      return {
        ...state,
        encryptionListLoader: payload,
      };
    case ACTIONS.SET_ENCRYPTION_FORM_LOADER:
      return {
        ...state,
        encryptionFormLoader: payload,
      };

    // Data Stores //
    case ACTIONS.SET_ENCRYPTION_LIST:
      return {
        ...state,
        encryptionDataList: payload,
      };
    case ACTIONS.SET_ENCRYPTION_DATA:
      return {
        ...state,
        encryptionForm: payload,
      };
    case ACTIONS.SET_ENTITY_LIST:
      return {
        ...state,
        entityList: payload,
      };
    case ACTIONS.SET_FORM_STATUS:
      return {
        ...state,
        formStatus: payload,
      };
    case ACTIONS.SET_KEY_ERROR:
      return {
        ...state,
        pubKeyError: payload,
      };
    case ACTIONS.SET_INBOUND_LIST:
      return {
        ...state,
        inboundEncryptionList: payload,
      };
    case ACTIONS.SET_INBOUND_LIST_LOADER:
      return {
        ...state,
        inboundListLoader: payload,
      };
    default:
      return state;
  }
};

export default FileEncryptionReducer;
