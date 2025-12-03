/* eslint-disable react-hooks/exhaustive-deps */
import React, { Dispatch, useEffect, useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import {
  getFileToModelMapping,
  getSFIntegrationLoader,
} from '../../../shared/redux/rootReducer';
import {
  fetchFileToModelMapping,
  updateFileModelMapping,
} from '../sfIntegration.thunk';
import { Form, Table, Input, Skeleton } from 'antd';
import {
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import {
  AppDrawer,
  NoData,
  ErrorBoundary,
  DotMenu,
} from '../../../shared/components';
import { useHistory } from 'react-router-dom';
import { appPath } from '../../app/app.routes';
import { saveFileConfig, resetMessages } from '../sfIntegration.actions';
import { executeFile } from '../sfIntegration.thunk';
import { Trans } from '@lingui/macro';

const FileNameMapping: React.FC<ConnectedProps<typeof connector>> = ({
  _fetchFileToModalData,
  _updateMapping,
  _resetFileConfig,
  _resetMessages,
  _executeFile,
  fileNameToModal,
  isLoader,
}) => {
  const history = useHistory();
  // const [selectedRows, setSelectedRows] = useState<any[]>([]);
  // const [fileNameMapping, setFileNameMapping] = useState<any[]>([]);
  const [editFileMappingId, setFileMappingId] = useState<string>('');
  const [editFileMappingCode, setFileMappingCode] = useState<string>('');
  const [form] = Form.useForm();

  useEffect(() => {
    _fetchFileToModalData();

    return _resetMessages;
  }, []);

  const setEditData = (item: any) => {
    _resetFileConfig();
    history.push(
      appPath.settings.sfIntegration.fileConfiguration.linkTo + item.id + '/',
    );
  };

  const callExecuteApi = (item: any) => {
    _executeFile(item.model_to_map.code);
  };

  const getElemOrSkeleton = (_text: any, _record?: any, _index?: number) => {
    return isLoader ? <Skeleton.Input size='small' active={isLoader} /> : _text;
  };

  const columns = [
    {
      key: 'model_to_map',
      title: () => getElemOrSkeleton(<Trans>File Name</Trans>),
      dataIndex: 'model_to_map',
      render: (val: any) => getElemOrSkeleton(val?.title),
    },
    {
      key: 'file_name',
      title: () => getElemOrSkeleton(<Trans>Rename File</Trans>),
      dataIndex: 'file_name',
      render: getElemOrSkeleton,
    },
    {
      key: 'action',
      width: '100px',
      align: 'center' as 'center',
      title: () => getElemOrSkeleton(<Trans>Action</Trans>),
      render: (_: string, item: any) =>
        isLoader ? (
          getElemOrSkeleton('')
        ) : (
          <DotMenu
            showInMenu
            actionBtn={[
              {
                Type: 'link',
                icon: EditOutlined,
                children: <Trans>Edit</Trans>,
                title: 'Edit',
                OnClick: () => setEditData(item),
              },
              {
                Type: 'link',
                icon: SettingOutlined,
                children: <Trans>Execute</Trans>,
                title: 'Execute',
                OnClick: () => callExecuteApi(item),
              },
            ]}
          >
            <EllipsisOutlined />
          </DotMenu>
        ),
    },
  ];
  const renderMappingData = () => {
    if (fileNameToModal && fileNameToModal.length > 0) {
      return (
        <div>
          <Table
            dataSource={isLoader ? new Array(10).fill({}) : fileNameToModal}
            columns={columns}
            rowKey={(item, index) => (item ? item.id : index)}
            pagination={false}
            bordered
          />
        </div>
      );
    } else {
      return <NoData description='No Mapping Data' />;
    }
  };

  const onUpdateMapping = async () => {
    try {
      const values = await form.validateFields();
      const data = {
        file_name: values.file_name,
        model_to_map: editFileMappingCode,
      };
      _updateMapping(data, editFileMappingId);
      setFileMappingId('');
      setFileMappingCode('');
    } catch (e) {
      console.error(e);
    }
  };

  const closeDrawer = () => {
    setFileMappingId('');
    setFileMappingCode('');
  };

  return (
    <ErrorBoundary>
      <div className='file-name-mapping-container'>
        {renderMappingData()}{' '}
        <AppDrawer
          title=''
          visible={editFileMappingId !== ''}
          OkText='Update'
          width='30%'
          onOkClick={onUpdateMapping}
          onCancelClick={closeDrawer}
          onClose={closeDrawer}
          getContainer='.file-name-mapping-container'
        >
          <Form form={form} layout='vertical'>
            <Form.Item name='model_to_map' label={<Trans>File Name</Trans>}>
              <Input disabled />
            </Form.Item>
            <Form.Item name='file_name_disabled' label='Renamed File '>
              <Input disabled />
            </Form.Item>
            <Form.Item
              name='file_name'
              label='New Display Text'
              rules={[{ required: true, message: 'Enter Text' }]}
            >
              <Input />
            </Form.Item>
          </Form>
        </AppDrawer>
      </div>
    </ErrorBoundary>
  );
};

const mapStateToProps = (state: any) => ({
  fileNameToModal: getFileToModelMapping(state),
  isLoader: getSFIntegrationLoader(state),
});

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  _fetchFileToModalData: () => dispatch(fetchFileToModelMapping()),
  _updateMapping: (body: any, id: string) =>
    dispatch(updateFileModelMapping(body, id)),
  _resetFileConfig: () => dispatch(saveFileConfig(undefined)),
  _resetMessages: () => dispatch(resetMessages()),
  _executeFile: (code: string) => dispatch(executeFile(code)),
});

const connector = connect(mapStateToProps, mapDispatchToProps);
export default connector(FileNameMapping);
