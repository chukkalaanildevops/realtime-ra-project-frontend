import reducer, {
  initialState,
} from '../../../pages/configurations/configurations.reducer';
import {
  saveFtpRecords,
  saveSSOConfigs,
  saveTenantRecords,
  setSuccess,
} from '../../../pages/configurations/configurations.actions';

describe('Currency Conversion Reducer', () => {
  it('Should return default state', () => {
    const newState = reducer(undefined, {});
    expect(newState).toEqual(initialState);
  });

  it('Should return ftp record list', () => {
    const data = [
      { id: 1, title: 'FTP 1' },
      { id: 2, title: 'FTP 2' },
    ];
    const newState = reducer(undefined, saveFtpRecords(data));
    expect(newState).toEqual({
      ...initialState,
      ftpRecords: data,
    });
  });

  it('Should return sso config', () => {
    const data = [{ id: 1, title: 'SSO 1' }];
    const newState = reducer(undefined, saveSSOConfigs(data));
    expect(newState).toEqual({ ...initialState, ssoConfigRecords: data });
  });

  // it('Should return currency conversion history list', () => {
  //   const data = [
  //     { id: 1, title: 'Tenant 1' },
  //     { id: 2, title: 'Tenant 2' },
  //   ];
  //   const newState = reducer(undefined, saveTenantRecords(data));
  //   expect(newState).toEqual({ ...initialState, tenantConfig: data });
  // });

  it('Should set success message', () => {
    const message = 'Success';
    const newState = reducer(undefined, setSuccess(message));
    expect(newState).toEqual({ ...initialState, success: message });
  });
});
