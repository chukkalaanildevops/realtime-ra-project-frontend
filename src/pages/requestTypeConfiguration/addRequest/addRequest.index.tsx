/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, Dispatch, useState } from 'react';
import {
  HeaderBarWrapper,
  ConfirmationModal,
  ErrorBoundary,
} from '../../../shared/components';
import { Trans } from '@lingui/macro';
import { AddRequestProps } from './addRequest.model';
import { Tabs } from 'antd';
import { AddRequestForm } from './components';
import { useHistory, useLocation, useParams } from 'react-router-dom';

import {
  saveExpandedItem,
  saveRequestData,
} from '../requestTypeConfiguration.action';
import { connect, ConnectedProps } from 'react-redux';
import {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  fetchRequestDetailsById,
  fetchRequestLegalEntities,
} from '../requestTypeConfiguration.thunk';
import {
  getRequestTypeDataLoading,
  getRequestTypeLoadingMessage,
} from '../../../shared/redux/rootReducer';
import './addRequest.index.less';
import { appPath } from '../../app/app.routes';

let tabKey = '1';
let requestId: any = undefined;
const AddRequest: React.FC<AddRequestProps &
  ConnectedProps<typeof connector>> = ({
  // children,
  _resetConfig,
  _fetchLegalEntities,
  _saveRequestData,
}) => {
  const location: any = useLocation();
  const [showTabChange, setTabChange] = useState(false);
  // const [isNavigated, setNavigated] = useState(false);
  // const cloneState = JSON.parse(localStorage.getItem('clone_data') || '{}');
  const isClone = (location?.state as any)?.type === 'clone';
  const isTravelType = (location?.state as any)?.is_travel_type;

  // const [activeKey, setActiveKey] = useState('1');
  const params: any = useParams();
  const tab = params.tab;
  const history = useHistory();

  // useEffect(() => {
  // }, [_resetConfig]);

  // useEffect(() => {
  // }, [location]);

  // useEffect(() => {
  // }, [history]);

  // useEffect(() => {
  // }, [
  //   // _resetConfig,
  //   // _fetchLegalEntities,
  //   // _saveRequestData,
  //   // location,
  //   match.params,
  //   // history,
  //   // id,
  //   // isDataLoading,
  //   // loadingMessage,
  //   children,
  // ]);

  // useEffect(() => {
  //   const isClone = (location?.state as any)?.type === 'clone';
  //   if (isClone) {
  //     const item = (location?.state as any).item;
  //     _saveRequestData(item);
  //     return _navigate();
  //   }
  // }, [location]);

  // const _navigate = (): any => {
  //   return <AddRequestForm isClone={true} />;
  // };

  useEffect(() => {
    // const id = match.params.id;
    return () => (requestId = undefined);
  }, []);

  // debugger;
  if (isClone) {
    // const item = (location?.state as any).item;
    // if (!isNavigated) {
    // _saveRequestData(item);
    // }
    // setNavigated(true);
    return (
      <AddRequestForm
        is_preview={false}
        is_travel_type={isTravelType}
        isClone={isClone}
      />
    );
  }

  const onTabChange = (key: string) => {
    if (requestId) {
      tabKey = key;
      setTabChange(true);
    } else {
      // setActiveKey(key);
      history.push(`${appPath.addNew.addRequest.linkTo}${key}`);
    }
  };

  const changeTab = () => {
    // setActiveKey(tabKey);
    history.push(`${appPath.addNew.addRequest.linkTo}${tabKey}`);
    _resetConfig();
    setTabChange(false);
    requestId = undefined;
    _fetchLegalEntities(+tabKey === 1 ? false : true);
  };

  const changeRequest = (id?: string) => {
    requestId = id;
  };

  return (
    <ErrorBoundary>
      <HeaderBarWrapper
        headerCommonProps={{ title: <Trans>Add Request</Trans> }}
      >
        <div className='add-request-container'>
          <Tabs
            // defaultActiveKey='1'
            onChange={onTabChange}
            destroyInactiveTabPane={true}
            activeKey={tab || 'travel'}
          >
            <Tabs.TabPane tab={<Trans>Travel</Trans>} key='travel'>
              <AddRequestForm
                is_travel_type={true}
                is_preview={false}
                onSelectRequestType={changeRequest}
                // ref={travelForm}
                // data={data as generalDataInterface}
                // labelData={{}}
                // customFields={custom as IcustomFields}
              />
            </Tabs.TabPane>
            <Tabs.TabPane tab={<Trans>General</Trans>} key='general'>
              <AddRequestForm
                is_travel_type={false}
                is_preview={false}
                onSelectRequestType={changeRequest}
                // ref={requestForm}
                // data={data as generalDataInterface}
                // labelData={{}}
                // customFields={custom as IcustomFields}
              />
            </Tabs.TabPane>
          </Tabs>
        </div>
        <ConfirmationModal
          data-test='confirmModal'
          visible={showTabChange}
          header='Warning'
          body='Do you want to save your data before leaving this page?'
          okText='No, Leave Page'
          cancelText='Yes, Stay Here'
          onOkClick={changeTab}
          onCancelClick={() => setTabChange(false)}
        />
      </HeaderBarWrapper>
    </ErrorBoundary>
  );
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  _resetConfig: () => dispatch(saveExpandedItem({})),
  _fetchLegalEntities: (is_travel_type: boolean) =>
    dispatch(fetchRequestLegalEntities(is_travel_type)),
  _saveRequestData: (data: any) => dispatch(saveRequestData(data)),
});

const mapStateToProps = (state: any) => ({
  isDataLoading: getRequestTypeDataLoading(state),
  loadingMessage: getRequestTypeLoadingMessage(state),
});

const connector = connect(mapStateToProps, mapDispatchToProps);

export default connector(React.memo(AddRequest));
