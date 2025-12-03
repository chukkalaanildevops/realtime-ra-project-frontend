import React from 'react';
import { Table, Button, message } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import { DotMenu, NoData } from '../../../../shared/components';
import './inboundFileEncryption.less';
import { Trans } from '@lingui/macro';

const InboundFileEncryption: React.FC<{
  list: any;
  onGenerateKey: any;
  inboundListLoader: any;
}> = props => {
  const { list, onGenerateKey, inboundListLoader } = props;
  const onCopyItem = async (item: any) => {
    await navigator.clipboard.writeText(item.public_key);
    message.success('Public Key Copied');
  };
  const columns = [
    {
      key: 'created_by',
      title: <Trans>Created By</Trans>,
      width: 150,
      align: 'center' as 'center',
      dataIndex: 'created_by',
      render: (val: any) => val,
    },
    {
      key: 'public_key',
      title: <Trans>Public Key</Trans>,
      dataIndex: 'public_key',
      align: 'center' as 'center',
      ellipsis: true,
      render: (val: any) => val,
    },
    {
      dataIndex: 'Action',
      title: <Trans>Action</Trans>,
      width: 150,
      align: 'center' as 'center',
      render: (_: any, item: any) => (
        <DotMenu
          actionBtn={((): any[] => {
            const actions: any[] = [
              {
                icon: CopyOutlined,
                OnClick: () => onCopyItem(item),
                children: (
                  <>
                    <Trans>Copy</Trans>
                  </>
                ),
                Type: 'link',
              },
            ];
            return actions;
          })()}
        ></DotMenu>
      ),
    },
  ];
  return (
    <>
      <div className='generate-key-button-container'>
        <Button
          type='primary'
          className='generate-key-button'
          onClick={onGenerateKey}
          disabled={inboundListLoader}
        >
          {list.length === 0
            ? 'Generate Public Key'
            : 'Generate New Public Key'}
        </Button>
      </div>
      {list.length === 0 ? (
        <NoData />
      ) : (
        <>
          <Table
            loading={inboundListLoader}
            bordered
            pagination={false}
            columns={columns}
            dataSource={list || []}
            size='middle'
          />
        </>
      )}
    </>
  );
};

export default InboundFileEncryption;
