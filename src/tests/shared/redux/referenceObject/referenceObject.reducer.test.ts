import {
  OBJECT_REFERENCE_TYPES,
  apiCallRequest,
  apiCallFail,
  apiCallSuccess,
  apiCallReset,
  setObjectReferenceSelected,
  resetToInitial,
  saveObjects,
  setError,
  setSuccess,
  setLoader,
  setFormData,
  resetFormData,
  setListLoader,
  setUpdateId,
  setListUpdate,
  resetListUpdate,
  createListUpdateObject,
} from '../../../../shared/redux/referenceObject/referenceObject.actions';
import refObjReducer, {
  initialState,
} from '../../../../shared/redux/referenceObject/referenceObject.reducer';

const objectReferenceListData = [
  {
    created_by: {
      id: 1,
      name: 'Tony Chan',
      legal_name: 'Tony Chan',
      email: 'tonychan@mailinator.com',
      username: 'tonychan@mailinator.com',
    },
    created_on: '26/05/2020T10:56:37.615076Z',
    modified_by: {
      id: 3,
      name: 'Aaron Apple',
      legal_name: 'Aaron Apple',
      email: 'aaron_apple@gmail.com',
      username: 'aaron_apple@gmail.com',
    },
    modified_on: '11/06/2020T11:30:13.327864Z',
    deleted_by: null,
    deleted_on: null,
    is_deleted: false,
    id: 25,
    title: 'ADTestPUT',
    code: null,
    source_reference_model: null,
    items: [
      {
        id: 48,
        reference_object: 'ADTestPUT',
        title: 'ADTest1',
        is_deleted: false,
      },
      {
        id: 49,
        reference_object: 'ADTestPUT',
        title: 'ADTest2',
        is_deleted: false,
      },
    ],
  },
  {
    created_by: {
      id: 1,
      name: 'Tony Chan',
      legal_name: 'Tony Chan',
      email: 'tonychan@mailinator.com',
      username: 'tonychan@mailinator.com',
    },
    created_on: '22/04/2020T19:55:13.854944Z',
    modified_by: {
      id: 1,
      name: 'Tony Chan',
      legal_name: 'Tony Chan',
      email: 'tonychan@mailinator.com',
      username: 'tonychan@mailinator.com',
    },
    modified_on: '22/04/2020T19:55:13.856611Z',
    deleted_by: null,
    deleted_on: null,
    is_deleted: false,
    id: 7,
    title: 'CT',
    code: null,
    source_reference_model: null,
    items: [
      {
        id: 16,
        reference_object: 'CT',
        title: 'ds',
        is_deleted: false,
      },
    ],
  },
  {
    created_by: {
      id: 1,
      name: 'Tony Chan',
      legal_name: 'Tony Chan',
      email: 'tonychan@mailinator.com',
      username: 'tonychan@mailinator.com',
    },
    created_on: '06/04/2020T17:41:08.783701Z',
    modified_by: {
      id: 1,
      name: 'Tony Chan',
      legal_name: 'Tony Chan',
      email: 'tonychan@mailinator.com',
      username: 'tonychan@mailinator.com',
    },
    modified_on: '06/04/2020T17:41:08.783701Z',
    deleted_by: null,
    deleted_on: null,
    is_deleted: false,
    id: 6,
    title: 'Contract Type',
    code: 'Contract Type',
    source_reference_model: null,
    items: [
      {
        id: 15,
        reference_object: 'Contract Type',
        title: 'dsdfdds',
        is_deleted: false,
      },
      {
        id: 66,
        reference_object: 'Contract Type',
        title: 'full time',
        is_deleted: false,
      },
    ],
  },
  {
    created_by: {
      id: 1,
      name: 'Tony Chan',
      legal_name: 'Tony Chan',
      email: 'tonychan@mailinator.com',
      username: 'tonychan@mailinator.com',
    },
    created_on: '22/04/2020T20:00:49.148255Z',
    modified_by: {
      id: 1,
      name: 'Tony Chan',
      legal_name: 'Tony Chan',
      email: 'tonychan@mailinator.com',
      username: 'tonychan@mailinator.com',
    },
    modified_on: '22/04/2020T20:00:49.150437Z',
    deleted_by: null,
    deleted_on: null,
    is_deleted: false,
    id: 9,
    title: 'Data',
    code: null,
    source_reference_model: null,
    items: [
      {
        id: 18,
        reference_object: 'Data',
        title: 'fsdf',
        is_deleted: false,
      },
    ],
  },
  {
    created_by: {
      id: 1,
      name: 'Tony Chan',
      legal_name: 'Tony Chan',
      email: 'tonychan@mailinator.com',
      username: 'tonychan@mailinator.com',
    },
    created_on: '27/04/2020T10:33:22.151746Z',
    modified_by: {
      id: 1,
      name: 'Tony Chan',
      legal_name: 'Tony Chan',
      email: 'tonychan@mailinator.com',
      username: 'tonychan@mailinator.com',
    },
    modified_on: '27/04/2020T10:33:22.153587Z',
    deleted_by: null,
    deleted_on: null,
    is_deleted: false,
    id: 12,
    title: 'Dental new',
    code: null,
    source_reference_model: null,
    items: [
      {
        id: 22,
        reference_object: 'Dental new',
        title: 'sadd',
        is_deleted: false,
      },
    ],
  },
];

const formData = {
  title: 'testTitle',
  code: 'tt',
  items: ['tt1', 'tt2'],
  // itemFile: '',
};

const updateId: string = '1';

describe('ReferenceObject Redux Test', () => {
  describe('ACTION', () => {
    test('apiCallRequest', () => {
      expect(apiCallRequest()).toEqual({
        type: OBJECT_REFERENCE_TYPES.API_CALL_REQUEST,
        payload: {
          error: '',
          success: '',
          info: 'Loading Data...',
          loader: true,
        },
      });
    });

    test('apiCallSuccess', () => {
      expect(apiCallSuccess()).toEqual({
        type: OBJECT_REFERENCE_TYPES.API_CALL_SUCCESS,
        payload: {
          error: '',
          success: '',
          info: '',
          loader: false,
        },
      });
    });

    test('apiCallFail', () => {
      expect(apiCallFail()).toEqual({
        type: OBJECT_REFERENCE_TYPES.API_CALL_FAIL,
        payload: {
          error: 'Failed to load data.',
          success: '',
          info: '',
          loader: false,
        },
      });
    });

    test('apiCallReset', () => {
      expect(apiCallReset()).toEqual({
        type: OBJECT_REFERENCE_TYPES.API_CALL_RESET,
        payload: {
          error: '',
          success: '',
          info: '',
          loader: false,
        },
      });
    });

    test('setObjectReferenceSelected', () => {
      expect(setObjectReferenceSelected(objectReferenceListData[0])).toEqual({
        type: OBJECT_REFERENCE_TYPES.SET_OBJECT_REFERENCE_SELECTED,
        payload: objectReferenceListData[0],
      });
    });

    test('resetToInitial', () => {
      expect(resetToInitial()).toEqual({
        type: OBJECT_REFERENCE_TYPES.RESET_TO_INITIAL,
      });
    });

    test('saveObjects', () => {
      expect(saveObjects(objectReferenceListData)).toEqual({
        type: OBJECT_REFERENCE_TYPES.SAVE_OBJECTS,
        payload: objectReferenceListData,
      });
    });

    test('setError', () => {
      const err: string = 'ERROR';
      expect(setError(err)).toEqual({
        type: OBJECT_REFERENCE_TYPES.SET_ERROR,
        payload: err,
      });
    });

    test('setSuccess', () => {
      const message: string = 'MESSAGE';
      expect(setSuccess(message)).toEqual({
        type: OBJECT_REFERENCE_TYPES.SET_SUCCESS,
        payload: message,
      });
    });

    test('setLoader', () => {
      const isLoading: boolean = true;
      expect(setLoader(isLoading)).toEqual({
        type: OBJECT_REFERENCE_TYPES.SET_LOADING,
        payload: isLoading,
      });
    });

    test('setFormData', () => {
      expect(setFormData(formData)).toEqual({
        type: OBJECT_REFERENCE_TYPES.SET_FORM_DATA,
        payload: formData,
      });
    });

    test('resetFormData', () => {
      expect(resetFormData()).toEqual({
        type: OBJECT_REFERENCE_TYPES.RESET_FORM_DATA,
      });
    });

    test('setListLoader', () => {
      expect(setListLoader(false)).toEqual({
        type: OBJECT_REFERENCE_TYPES.SET_LIST_LOADER,
        payload: false,
      });
    });

    test('setUpdateId', () => {
      expect(setUpdateId(updateId)).toEqual({
        type: OBJECT_REFERENCE_TYPES.SET_UPDATE_ID,
        payload: updateId,
      });
    });

    test('setListUpdate', () => {
      expect(typeof setListUpdate('item1', 'ADD')).toEqual('function');
    });

    test('resetListUpdate', () => {
      expect(resetListUpdate()).toEqual({
        type: OBJECT_REFERENCE_TYPES.RESET_LIST_UPDATE,
      });
    });

    describe('createListUpdateObject', () => {
      let item = 'TT1';
      const getState = () => {
        return {
          referenceObject: {
            listUpdate: {
              add: ['TT2'],
              remove: [],
            },
          },
        };
      };

      test('ADD', () => {
        const action = 'ADD';
        expect(createListUpdateObject(item, action, getState)).toEqual({
          add: [...getState().referenceObject.listUpdate.add, item],
          remove: getState().referenceObject.listUpdate.remove,
        });
      });

      test('REMOVE', () => {
        const action = 'REMOVE';
        expect(createListUpdateObject(item, action, getState)).toEqual({
          add: getState().referenceObject.listUpdate.add,
          remove: [...getState().referenceObject.listUpdate.remove, item],
        });
      });

      test('REMOVE :: move from add arr to remove arr', () => {
        const action = 'REMOVE';
        item = 'TT2';
        expect(createListUpdateObject(item, action, getState)).toEqual({
          add: [],
          remove: [...getState().referenceObject.listUpdate.remove, item],
        });
      });
    });

    // end
  });
  describe('REDUCER', () => {
    // start

    test('API_CALL_REQUEST', () => {
      const payload = {
        error: '',
        success: '',
        info: 'Loading Data...',
        loader: true,
      };
      expect(
        refObjReducer(initialState, {
          type: OBJECT_REFERENCE_TYPES.API_CALL_REQUEST,
          payload: payload,
        }),
      ).toEqual({
        ...initialState,
        ...payload,
      });
    });

    test('API_CALL_SUCCESS', () => {
      const payload = {
        error: '',
        success: 'Data loaded successfully.',
        info: '',
        loader: false,
      };
      expect(
        refObjReducer(initialState, {
          type: OBJECT_REFERENCE_TYPES.API_CALL_SUCCESS,
          payload: payload,
        }),
      ).toEqual({
        ...initialState,
        ...payload,
      });
    });

    test('API_CALL_FAIL', () => {
      const payload = {
        error: 'Failed to load data.',
        success: '',
        info: '',
        loader: false,
      };
      expect(
        refObjReducer(initialState, {
          type: OBJECT_REFERENCE_TYPES.API_CALL_FAIL,
          payload: payload,
        }),
      ).toEqual({
        ...initialState,
        ...payload,
      });
    });

    test('API_CALL_RESET', () => {
      const payload = {
        error: '',
        success: '',
        info: '',
        loader: false,
      };
      expect(
        refObjReducer(initialState, {
          type: OBJECT_REFERENCE_TYPES.API_CALL_RESET,
          payload: payload,
        }),
      ).toEqual({
        ...initialState,
        ...payload,
      });
    });

    test('RESET_TO_INITIAL', () => {
      expect(
        refObjReducer(initialState, {
          type: OBJECT_REFERENCE_TYPES.API_CALL_RESET,
        }),
      ).toEqual({
        ...initialState,
      });
    });

    test('SAVE_OBJECTS', () => {
      const payload = objectReferenceListData;
      expect(
        refObjReducer(initialState, {
          type: OBJECT_REFERENCE_TYPES.SAVE_OBJECTS,
          payload: payload,
        }),
      ).toEqual({
        ...initialState,
        success: '',
        error: '',
        objectReference: payload,
      });
    });

    test('SET_ERROR', () => {
      const payload = 'error';
      expect(
        refObjReducer(initialState, {
          type: OBJECT_REFERENCE_TYPES.SET_ERROR,
          payload: payload,
        }),
      ).toEqual({
        ...initialState,
        error: payload,
      });
    });

    test('SET_SUCCESS', () => {
      const payload = 'success';
      expect(
        refObjReducer(initialState, {
          type: OBJECT_REFERENCE_TYPES.SET_SUCCESS,
          payload: payload,
        }),
      ).toEqual({
        ...initialState,
        error: '',
        success: payload,
      });
    });

    test('SET_LOADING', () => {
      const payload = true;
      expect(
        refObjReducer(initialState, {
          type: OBJECT_REFERENCE_TYPES.SET_LOADING,
          payload: payload,
        }),
      ).toEqual({
        ...initialState,
        loader: payload,
      });
    });

    test('SET_OBJECT_REFERENCE_SELECTED', () => {
      const payload = objectReferenceListData[0];
      expect(
        refObjReducer(initialState, {
          type: OBJECT_REFERENCE_TYPES.SET_OBJECT_REFERENCE_SELECTED,
          payload: payload,
        }),
      ).toEqual({
        ...initialState,
        objectReferenceSelected: payload,
      });
    });

    test('SET_FORM_DATA', () => {
      const payload = formData;
      expect(
        refObjReducer(initialState, {
          type: OBJECT_REFERENCE_TYPES.SET_FORM_DATA,
          payload: payload,
        }),
      ).toEqual({
        ...initialState,
        formData: payload,
      });
    });

    test('RESET_FORM_DATA', () => {
      const payload = {
        title: '',
        code: '',
        items: [],
      };
      expect(
        refObjReducer(
          { ...initialState, formData: formData },
          {
            type: OBJECT_REFERENCE_TYPES.RESET_FORM_DATA,
            payload: payload,
          },
        ),
      ).toEqual({
        ...initialState,
        formData: payload,
      });
    });

    test('SET_LIST_LOADER', () => {
      const payload = true;
      expect(
        refObjReducer(initialState, {
          type: OBJECT_REFERENCE_TYPES.SET_LIST_LOADER,
          payload: payload,
        }),
      ).toEqual({
        ...initialState,
        objectReferenceListLoader: payload,
      });
    });

    test('SET_UPDATE_ID', () => {
      const payload = '1';
      expect(
        refObjReducer(initialState, {
          type: OBJECT_REFERENCE_TYPES.SET_UPDATE_ID,
          payload: payload,
        }),
      ).toEqual({
        ...initialState,
        isUpdateMode: true,
        updateId: payload,
      });
    });

    test('SET_UPDATE_ID', () => {
      const payload = '1';
      expect(
        refObjReducer(initialState, {
          type: OBJECT_REFERENCE_TYPES.SET_UPDATE_ID,
          payload: payload,
        }),
      ).toEqual({
        ...initialState,
        isUpdateMode: true,
        updateId: payload,
      });
    });

    test('SET_LIST_UPDATE', () => {
      const payload = {
        add: ['TT2'],
        remove: [],
      };
      expect(
        refObjReducer(initialState, {
          type: OBJECT_REFERENCE_TYPES.SET_LIST_UPDATE,
          payload: payload,
        }),
      ).toEqual({
        ...initialState,
        listUpdate: payload,
      });
    });

    test('RESET_LIST_UPDATE', () => {
      const payload = {
        add: [],
        remove: [],
      };
      expect(
        refObjReducer(initialState, {
          type: OBJECT_REFERENCE_TYPES.RESET_LIST_UPDATE,
        }),
      ).toEqual({
        ...initialState,
        listUpdate: payload,
      });
    });

    // end
  });
});
