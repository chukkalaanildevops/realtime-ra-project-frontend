/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, Dispatch, useRef } from 'react';
import { HeaderBarWrapper } from '../../shared/components';
import { Tabs, message } from 'antd';
import { Trans } from '@lingui/macro';
import './delegate.index.less';
import DelegateTab from './component/delegateTab.index';
import { useHistory, useParams } from 'react-router-dom';
import { appPath } from '../app/app.routes';
import { DELEGATE_TABS } from './delegate.model';
import {
  getDelegatePermissions,
  getDelegateSuccess,
  getDelegateError,
  getDelegateLoadingMessage,
  getDelegatedByMe,
  getDelegateToMe,
  getErrorObject,
  getApiStatus,
  getAPILoadingState,
  getDelegateLoader,
  getDelegatedDataLoading,
} from '../../shared/redux/rootReducer';
import {
  fetchDelegateRecords,
  deleteDelegate,
  activeDelegate,
  fetchProxyPermissions,
  createDelegateRecord,
  respondDelegate,
} from './delegate.thunk';
import { setError, setSuccess, setErrorObject } from './delegate.action';
import { connect, ConnectedProps } from 'react-redux';
import { IConfirmationInfo } from '../app/app.model';
import { setConfirmationInfo, resetConfirmationInfo } from '../app/app.actions';
import { fetchUsersForDD } from '../../shared/redux/auth/auth.thunk';

const Delegate: React.FC<ConnectedProps<typeof connector>> = ({
  _activeDelegate,
  _createUpdateDelegate,
  _deleteDelegate,
  _fetchDelegated,
  _fetchPermissions,
  _setError,
  _setSuccess,
  _fetchUsersForDD,
  _respondDelegate,
  _setErrorObject,
  _setConfirmationInfo,
  _resetConfirmationInfo,
  activeUsers,
  delegatedByMe,
  delegatedToMe,
  error,
  errorObject,
  apiStatus,
  loader,
  apiLoad,
  loadingMessage,
  permissions,
  success,
  isDataLoading,
}) => {
  const history = useHistory();
  const params: any = useParams();
  const tab = params.tab || 'delegated-by-me';
  const delegateRef = useRef<any>(null);
  useEffect(() => {
    message.destroy();
    if (loader && !!loadingMessage) message.loading(loadingMessage, 0);
    else if (success) message.success(success, 5, _setSuccess);
    else if (error) message.error(error, 5, _setError);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loader, success, error, loadingMessage]);

  useEffect(() => {
    if (success) {
      delegateRef.current.closeDrawer();
      delegateRef.current.resetConfirmationModal();
    }
  }, [success]);

  useEffect(() => {
    _fetchUsersForDD();
    _fetchPermissions();
    _fetchDelegated(tab);
  }, []);

  const onTabChange = (tabKey: string | DELEGATE_TABS, _e: any) => {
    _fetchDelegated(tabKey as DELEGATE_TABS);
    history.push(`${appPath.delegate.linkTo}${tabKey}`);
  };

  const onCreateUpdateDelegate = (values: any, id?: number) => {
    _createUpdateDelegate(values, 'delegated-by-me', id);
  };

  const onChangeSwitch = (id: number, isActive: boolean) => {
    _activeDelegate(id, isActive, tab);
  };
  const deleteDelegate = (id: number) => _deleteDelegate(id, tab);

  const respondDelegate = (id: number, status: 'approved' | 'rejected') =>
    _respondDelegate(id, status, tab);

  return (
    <HeaderBarWrapper headerCommonProps={{ title: <Trans>Delegate</Trans> }}>
      <div className='delegate-container'>
        <Tabs tabBarGutter={60} activeKey={tab} onTabClick={onTabChange}>
          <Tabs.TabPane
            key='delegated-by-me'
            tab={<Trans>My Delegations</Trans>}
          >
            <DelegateTab
              delegation='BY_ME'
              data={delegatedByMe}
              isLoading={isDataLoading}
              apiLoad={apiLoad}
              onChangePagination={(page: number, pageSize?: number) => {
                _fetchDelegated('delegated-by-me', page, pageSize);
              }}
              users={activeUsers}
              permissions={permissions}
              setErrorObject={_setErrorObject}
              onCreateUpdateDelegate={onCreateUpdateDelegate}
              ref={delegateRef}
              errorObject={errorObject}
              apiStatus={apiStatus}
              deleteDelegate={deleteDelegate}
              onChangeWSwitch={onChangeSwitch}
              respondDelegate={respondDelegate}
              setConfirmationInfo={_setConfirmationInfo}
              resetConfirmationInfo={_resetConfirmationInfo}
            />
          </Tabs.TabPane>
          <Tabs.TabPane
            key='delegated-to-me'
            tab={<Trans>Delegated To Me</Trans>}
          >
            <DelegateTab
              delegation='TO_ME'
              data={delegatedToMe}
              isLoading={isDataLoading}
              onChangePagination={(page: number, pageSize?: number) =>
                _fetchDelegated('delegated-to-me', page, pageSize)
              }
              errorObject={errorObject}
              users={activeUsers}
              permissions={permissions}
              apiStatus={apiStatus}
              apiLoad={apiLoad}
              setErrorObject={_setErrorObject}
              deleteDelegate={deleteDelegate}
              onChangeWSwitch={onChangeSwitch}
              respondDelegate={respondDelegate}
              setConfirmationInfo={_setConfirmationInfo}
              resetConfirmationInfo={_resetConfirmationInfo}
            />
          </Tabs.TabPane>
        </Tabs>
      </div>
    </HeaderBarWrapper>
  );
};

const mapStateToProps = (state: any) => ({
  permissions: getDelegatePermissions(state),
  success: getDelegateSuccess(state),
  error: getDelegateError(state),
  loader: getDelegateLoader(state),
  errorObject: getErrorObject(state),
  loadingMessage: getDelegateLoadingMessage(state),
  delegatedByMe: getDelegatedByMe(state),
  delegatedToMe: getDelegateToMe(state),
  activeUsers: state.auth.activeUsers,
  apiStatus: getApiStatus(state),
  isDataLoading: getDelegatedDataLoading(state),
  apiLoad: getAPILoadingState(state),
});

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  _fetchDelegated: (tab: DELEGATE_TABS, page?: number, pageSize?: number) =>
    dispatch(fetchDelegateRecords(tab, page, undefined, pageSize)),
  _deleteDelegate: (id: number, tab: DELEGATE_TABS) =>
    dispatch(deleteDelegate(id, tab)),
  _activeDelegate: (id: number, isActive: boolean, tab: DELEGATE_TABS) =>
    dispatch(activeDelegate(id, isActive, tab)),
  _createUpdateDelegate: (body: any, tab: DELEGATE_TABS, id?: number) =>
    dispatch(createDelegateRecord(body, tab, id)),
  _fetchPermissions: () => dispatch(fetchProxyPermissions()),
  _setErrorObject: (status?: boolean) => dispatch(setErrorObject(status)),
  _setSuccess: () => dispatch(setSuccess('')),
  _setError: () => dispatch(setError('')),
  _fetchUsersForDD: () => dispatch(fetchUsersForDD()),
  _respondDelegate: (
    id: number,
    status: 'approved' | 'rejected',
    tab: DELEGATE_TABS,
  ) => dispatch(respondDelegate(id, status, tab)),
  _setConfirmationInfo: (data: IConfirmationInfo) =>
    dispatch(setConfirmationInfo(data)),
  _resetConfirmationInfo: () => dispatch(resetConfirmationInfo()),
});

const connector = connect(mapStateToProps, mapDispatchToProps);
export default connector(Delegate);
