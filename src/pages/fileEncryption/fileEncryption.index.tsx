import React, { FC, Dispatch, useState, useEffect, memo } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { Form, Modal, Tabs } from 'antd';
import { appPath } from '../app/app.routes';

import InboundFileEncryption from './component/inboundFileEncryption/inboundFileEncryption';
import FileEncryptionList from './component/fileEncryptionList/fileEncryptionList.index';
import FileEncryptionForm from './component/fileEncryptionForm/fileEncryptionForm.index';
import { stateInterface } from '../../shared/redux/rootReducer';
import {
  AppDrawer,
  BackButton,
  ElementOrSkeleton,
  ErrorBoundary,
  HeaderBarWrapper,
} from '../../shared/components';
import {
  getInboundList,
  getEncryptionData,
  getEncryptionList,
  getLegalEntityList,
  generateKeyFunction,
  createEncryptionData,
  deleteEncryptionData,
  updateEncryptionData,
} from './fileEncryption.thunk';
import {
  setEncryptionFormLoader,
  updateFormStatus,
  updateKeyError,
} from './store/fileEncryption.action';
// getEncryptionList;
import './fileEncryption.index.less';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Trans } from '@lingui/macro';
const { TabPane } = Tabs;
const { confirm } = Modal;

const mapStateToProps = (state: stateInterface) => {
  const {
    tabList,
    formStatus,
    entityList,
    pubKeyError,
    encryptionForm,
    inboundListLoader,
    encryptionDataList,
    encryptionFormLoader,
    encryptionListLoader,
    inboundEncryptionList,
  } = state.FileEncryptionReducer;
  const { tenantConfig } = state.configuration;
  return {
    tabList,
    formStatus,
    entityList,
    pubKeyError,
    tenantConfig,
    encryptionForm,
    inboundListLoader,
    encryptionDataList,
    encryptionFormLoader,
    encryptionListLoader,
    inboundEncryptionList,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  return {
    _generateKeyFunction: () => dispatch(generateKeyFunction()),
    _getInboundList: () => dispatch(getInboundList()),
    _getLegalEntityList: () => dispatch(getLegalEntityList()),
    _getEncryptionData: (id: any) => dispatch(getEncryptionData(id)),
    _getEncryptionList: (tab: string) => dispatch(getEncryptionList(tab)),
    _deleteEncryptionData: (id: number) => dispatch(deleteEncryptionData(id)),
    _createEncryptionData: (data: any) => dispatch(createEncryptionData(data)),
    _updateEncryptionData: (id: any, data: any) =>
      dispatch(updateEncryptionData(id, data)),
    _updateFormStatus: (status: string) => dispatch(updateFormStatus(status)),
    _updateKeyError: (error: string) => dispatch(updateKeyError(error)),
    _setEncryptionFormLoader: (data: any) =>
      dispatch(setEncryptionFormLoader(data)),
  };
};

const connector = connect(mapStateToProps, mapDispatchToProps);
type Tprops = ConnectedProps<typeof connector>;
const FileEncryption: FC<Tprops> = props => {
  const { push } = useHistory();
  const { tab } = useParams();
  const [form] = Form.useForm();

  const {
    //variable//
    tabList,
    formStatus,
    entityList,
    pubKeyError,
    tenantConfig,
    encryptionForm,
    inboundListLoader,
    encryptionDataList,
    encryptionFormLoader,
    encryptionListLoader,
    inboundEncryptionList,

    //functions//
    _updateKeyError,
    _getInboundList,
    _updateFormStatus,
    _getEncryptionList,
    _getEncryptionData,
    _getLegalEntityList,
    _deleteEncryptionData,
    _createEncryptionData,
    _updateEncryptionData,
    _generateKeyFunction,
    _setEncryptionFormLoader,
  } = props;
  const isFileSplitting =
    tenantConfig[0]?.is_enabled_file_splitting_for_settlement;
  const isInboundEncryptionEnabled =
    tenantConfig[0]?.is_enabled_inbound_file_encryption;
  // useStates //
  const [recordId, setRecordId] = useState('');
  const [selectedTab, setSelectedTab] = useState('0');
  const [drawerVisible, setDrawerVisible] = useState(false);

  // useEffects //
  useEffect(() => {
    if (tab === 'expense') {
      setSelectedTab('0');
      _getEncryptionList('expense');
    } else if (tab === 'benefit') {
      setSelectedTab('1');
      _getEncryptionList('benefit');
    } else if (tab === 'inbound') {
      setSelectedTab('2');
      _getInboundList();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  useEffect(() => {
    isInboundEncryptionEnabled &&
      tabList.length === 2 &&
      tabList.push({
        key: '2',
        code: 'inbound',
        title: 'Inbound',
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInboundEncryptionEnabled]);
  useEffect(() => {
    if (encryptionForm?.id) {
      form.setFieldsValue({
        file_type: encryptionForm?.file_type?.code,
        legal_entity_uuid: encryptionForm?.legal_entity?.uuid,
        ...encryptionForm,
      });
      setRecordId(encryptionForm.id);
      _setEncryptionFormLoader(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [encryptionForm]);
  useEffect(() => {
    if (pubKeyError) {
      const publicKeyName = isFileSplitting
        ? 'entity_pb_key'
        : 'standard_pb_key';

      form.setFields([{ name: publicKeyName, errors: [pubKeyError] }]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pubKeyError]);
  useEffect(() => {
    if (formStatus === 'success') {
      setDrawerVisible(false);
      _getEncryptionList(tab);
      _updateFormStatus('');
      form.resetFields();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formStatus]);
  useEffect(() => {
    _getLegalEntityList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Functions //

  const onFormCancel = () => {
    setDrawerVisible(false);
    setRecordId('');
    form.resetFields();
  };
  const onSaveForm = async () => {
    try {
      _updateKeyError('');
      const value = await form.validateFields();
      let file_type;
      if (selectedTab === '0') {
        file_type = 'EXPENSE';
      } else if (selectedTab === '1') {
        file_type = 'BENEFIT';
      }
      const body = { file_type, ...value };
      recordId
        ? _updateEncryptionData(recordId, body)
        : _createEncryptionData(body);
    } catch (errInfo) {}
  };
  const onGenerateKey = () => {
    _generateKeyFunction();
  };
  const tabChangeHandler = (key: string) => {
    switch (key) {
      case '0':
        push(`${appPath.config_setup.fileEncryption.linkTo}expense`);
        break;
      case '1':
        push(`${appPath.config_setup.fileEncryption.linkTo}benefit`);
        break;
      case '2':
        push(`${appPath.config_setup.fileEncryption.linkTo}inbound`);
        break;
    }
  };
  const isDisabledOption = (option: string) => {
    const item = encryptionDataList.find((item: any) => {
      return item.legal_entity.uuid === option;
    });
    return Boolean(item);
  };
  const editEncryptionRecord = (record: any) => {
    _getEncryptionData(record.id);
    setDrawerVisible(true);
    _setEncryptionFormLoader(true);
    form.resetFields();
  };
  const deleteEncryptionRecord = (record: any) => {
    confirm({
      title: `Delete entitlement: ${record.title}?`,
      icon: <ExclamationCircleOutlined />,
      content: '',
      async onOk() {
        await _deleteEncryptionData(record.id);
      },
      onCancel() {},
    });
  };
  return (
    <ErrorBoundary>
      <HeaderBarWrapper
        headerCommonProps={{ title: <Trans>File Encryption</Trans> }}
      >
        <div className='fileEncryption-container'>
          <Tabs
            renderTabBar={(_props: any, DefaultTabBar: any) => (
              <div className='tabs-with-back-button-container'>
                <BackButton />
                <DefaultTabBar {..._props} />
              </div>
            )}
            activeKey={selectedTab}
            onChange={tabChangeHandler}
          >
            {tabList.map((item: any) => {
              return (
                <TabPane tab={item.title} key={item.key}>
                  {encryptionListLoader ? (
                    <ElementOrSkeleton isLoading type='table' />
                  ) : (
                    <>
                      {item.key === '2' ? (
                        <InboundFileEncryption
                          list={inboundEncryptionList}
                          onGenerateKey={onGenerateKey}
                          inboundListLoader={inboundListLoader}
                        />
                      ) : (
                        <FileEncryptionList
                          list={encryptionDataList}
                          onEdit={editEncryptionRecord}
                          onDelete={deleteEncryptionRecord}
                          onAdd={setDrawerVisible}
                          isFileSplitting={isFileSplitting}
                        />
                      )}
                    </>
                  )}
                </TabPane>
              );
            })}
          </Tabs>
          <AppDrawer
            title={<Trans>File Encryption</Trans>}
            width={'50%'}
            onClose={() => onFormCancel()}
            visible={drawerVisible}
            isLoading={encryptionFormLoader}
            onCancelClick={onFormCancel}
            onOkClick={onSaveForm}
            OkText={recordId ? <Trans>Update</Trans> : <Trans>Create</Trans>}
            getContainer='.fileEncryption-container'
          >
            <FileEncryptionForm
              form={form}
              isFileSplitting={isFileSplitting}
              isLoading={encryptionFormLoader}
              isDisableEntity={isDisabledOption}
              entityList={entityList}
            />
          </AppDrawer>
        </div>
      </HeaderBarWrapper>
    </ErrorBoundary>
  );
};

export default connector(memo(FileEncryption));
