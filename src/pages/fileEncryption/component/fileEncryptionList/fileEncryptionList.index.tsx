import {
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
} from '@ant-design/icons';
import { Trans } from '@lingui/macro';
import { Table } from 'antd';
import React from 'react';
import { DotMenu, FilterBar, NoData } from '../../../../shared/components';

const FileEncryptionList: React.FC<{
  list: any;
  onDelete: any;
  onEdit: any;
  onAdd: any;
  isFileSplitting: any;
}> = props => {
  const { list, onDelete, onEdit, onAdd, isFileSplitting } = props;

  const columns = [
    {
      key: 'file_type',
      title: <Trans>File Type</Trans>,
      dataIndex: 'file_type',
      render: (val: any) => val?.title,
    },
    {
      key: 'created_by',
      title: <Trans>Created By</Trans>,
      dataIndex: 'created_by',
      render: (val: any) => val?.legal_name || '-',
    },
    {
      key: 'ACTION',
      title: <Trans>Action</Trans>,
      align: 'center' as 'center',
      dataIndex: '',
      width: '300px',
      render: (_val: any, record: any) => {
        return (
          <DotMenu
            actionBtn={[
              {
                Type: 'link',
                icon: EditOutlined,
                children: 'Edit',
                OnClick: () => onEdit(record),
              },
              {
                children: 'Delete',
                Type: 'link',
                icon: DeleteOutlined,
                OnClick: () => onDelete(record),
              },
            ]}
          >
            <EllipsisOutlined />
          </DotMenu>
        );
      },
    },
  ];
  if (isFileSplitting) {
    columns.splice(1, 0, {
      key: 'legal_entity',
      title: <Trans>Entity</Trans>,
      dataIndex: 'legal_entity',
      render: (val: any) => val?.title || '-',
    });
  }
  return (
    <>
      <FilterBar isAddButton={true} addButtonOnClickFn={() => onAdd(true)} />
      {list.length === 0 ? (
        <NoData />
      ) : (
        <Table
          bordered
          pagination={false}
          columns={columns}
          dataSource={list || []}
          size='middle'
        />
      )}
    </>
  );
};

export default FileEncryptionList;
