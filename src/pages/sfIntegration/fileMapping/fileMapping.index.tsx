/* eslint-disable react-hooks/exhaustive-deps */
import React, { Dispatch, useEffect, useState } from 'react';
import {
  HeaderBarWrapper,
  BackButton,
  ErrorBoundary,
} from '../../../shared/components';

import './fileMapping.index.less';
import {
  Row,
  Col,
  Input,
  Table,
  Switch,
  Button,
  message,
  Skeleton,
} from 'antd';
import { connect, ConnectedProps } from 'react-redux';
import {
  getFileConfiguration,
  getSFIntegrationLoader,
  getSFIntegrationLoadingMessage,
  getSFIntegrationSuccess,
  getSFIntegrationError,
} from '../../../shared/redux/rootReducer';
import { useHistory, useParams } from 'react-router-dom';
import {
  fetchFileToModelMappingById,
  updateFileModelMapping,
  updateIsEnabledInFileModelMapping,
} from '../sfIntegration.thunk';
import { resetMessages } from '../sfIntegration.actions';
import { Trans } from '@lingui/macro';

const FileConfiguration: React.FC<ConnectedProps<typeof connector>> = ({
  fileConfig,
  error,
  isLoading,
  loadingMessage,
  success,
  _fetchFileConfig,
  _updateFileModelMapping,
  _resetMessage,
  _updateIsEnabledInFileModelMapping,
}) => {
  const history = useHistory();
  const [fileName, setFileName] = useState('Filename');
  const [fileConfigData, setFileConfig] = useState(fileConfig);
  const [isStatusChange, changeStatus] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [switchLoader, setSwitchLoader] = useState(false);
  const params: any = useParams();
  const id = params.id;

  useEffect(() => {
    _fetchFileConfig(id);
  }, [_fetchFileConfig, id]);

  useEffect(() => {
    if (isLoading && loadingMessage) {
      message.loading(loadingMessage);
    } else {
      message.destroy();
    }
  }, [isLoading, loadingMessage]);

  useEffect(() => {
    if (success) {
      message.success(success, 1, () => {
        _resetMessage();
        if (!isStatusChange) {
          history.goBack();
        }
      });
      setTimeout(_resetMessage, 1000);
    }
  }, [success]);

  useEffect(() => {
    error && message.error(error, 2, _resetMessage);
  }, [error]);

  useEffect(() => {
    fileConfig && setFileName(fileConfig?.file_name);
    setFileConfig(fileConfig);
  }, [fileConfig]);

  const getElemOrSkeleton = (_text: any, _record?: any, _index?: number) => {
    return isLoading && !switchLoader ? (
      <Skeleton.Input size='small' active={isLoading} />
    ) : (
      _text
    );
  };

  const updateField = (val: boolean, colName: string) => {
    const columnForUpdate = {
      ...fileConfigData?.column_names[colName],
      is_enabled: val,
    };
    const newData = {
      ...fileConfigData,
      column_names: {
        ...fileConfigData?.column_names,
        [colName]: columnForUpdate,
      },
    };
    setFileConfig(newData as any);
  };

  const updateFileName = (value: string, colName: string) => {
    const column = {
      ...fileConfigData?.column_names[colName],
      custom: value,
    };
    const newData = {
      ...fileConfigData,
      column_names: {
        ...fileConfigData?.column_names,
        [colName]: column,
      },
    };

    setFileConfig(newData as any);
  };
  const columns = [
    {
      dataIndex: 'is_enabled',
      title: () => getElemOrSkeleton(<Trans>Enabled</Trans>),
      width: '100px',
      render: (val: boolean, item: any) =>
        isLoading && !switchLoader ? (
          getElemOrSkeleton('')
        ) : (
          <Switch
            defaultChecked={val}
            // checked={val}
            disabled={item.is_mandatory || switchLoader}
            onChange={e => updateField(e, item.default)}
          />
        ),
    },
    {
      dataIndex: 'default',
      title: () => getElemOrSkeleton(<Trans>Column Names</Trans>),
      render: getElemOrSkeleton,
    },
    {
      dataIndex: 'custom',
      title: () => getElemOrSkeleton(<Trans>Rename Columns</Trans>),
      render: (val: string, item: any) =>
        isLoading && !switchLoader ? (
          getElemOrSkeleton('')
        ) : (
          <Input
            value={val}
            disabled={switchLoader}
            onChange={e => updateFileName(e.target.value, item.default)}
          />
        ),
    },
  ];

  const onCancel = () => history.goBack();

  const goBack = (status: boolean) => {
    if (status) {
      onCancel();
    }
  };

  const onUpdate = () => {
    const reqBody = {
      ...fileConfigData,
      model_to_map: fileConfig?.model_to_map.code,
      file_name: fileName,
    };
    changeStatus(false);
    _updateFileModelMapping(reqBody, id, goBack);
  };

  const dataSource: any = Object.keys(
    fileConfigData?.column_names ? fileConfigData.column_names : {},
  ).map(key => fileConfigData?.column_names[key]);

  dataSource.sort((a: any, b: any) => a.default.localeCompare(b.default));

  return (
    <ErrorBoundary>
      <HeaderBarWrapper
        headerCommonProps={{ title: <Trans>SF Integration</Trans> }}
      >
        <div className='file-configuration-container'>
          <BackButton />
          <Row justify='space-between' style={{ marginTop: '12px' }}>
            <Col span={12}>
              <div className='default-file-name'>
                {fileConfig?.model_to_map.title}
              </div>
            </Col>
            <Col span={12}>
              <div className='rename-file-wrapper'>
                <div>
                  <Trans>Rename File :</Trans>{' '}
                </div>
                <Input
                  value={fileName}
                  disabled={switchLoader}
                  onChange={e => setFileName(e.target.value)}
                />
              </div>
            </Col>
          </Row>
          <div className='table-wrapper'>
            <Table
              columns={columns}
              dataSource={
                isLoading && !switchLoader ? new Array(10).fill({}) : dataSource
              }
              pagination={false}
            />
            <Row justify='end' gutter={24}>
              <Col>
                <Button onClick={onCancel} disabled={switchLoader}>
                  <Trans>Cancel</Trans>
                </Button>
              </Col>
              <Col>
                <Button
                  type='primary'
                  onClick={onUpdate}
                  disabled={switchLoader}
                >
                  <Trans>Update</Trans>
                </Button>
              </Col>
            </Row>
          </div>
        </div>
      </HeaderBarWrapper>
    </ErrorBoundary>
  );
};

const mapStateToProps = (state: any) => ({
  fileConfig: getFileConfiguration(state),
  isLoading: getSFIntegrationLoader(state),
  loadingMessage: getSFIntegrationLoadingMessage(state),
  success: getSFIntegrationSuccess(state),
  error: getSFIntegrationError(state),
});

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  _fetchFileConfig: (id: string) => dispatch(fetchFileToModelMappingById(id)),
  _updateFileModelMapping: (body: any, id: string, callBack?: Function) =>
    dispatch(updateFileModelMapping(body, id, callBack)),
  _updateIsEnabledInFileModelMapping: (
    body: any,
    id: string,
    callBack?: Function,
  ) => dispatch(updateIsEnabledInFileModelMapping(body, id, callBack)),
  _resetMessage: () => dispatch(resetMessages()),
});

const connector = connect(mapStateToProps, mapDispatchToProps);

export default connector(FileConfiguration);
