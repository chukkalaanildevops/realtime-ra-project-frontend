import React, { useState, useEffect } from 'react';
import { Table, Modal } from 'antd';
import Icon from '@mdi/react';
import { mdiTrashCanOutline } from '@mdi/js';
import './deviceTable.index.less';
import {
  deleteEmployeeDevice,
  getDeviceList,
} from '../../../../services/deviceManagement/index';
import { ElementOrSkeleton } from '../../../../shared/components';
import { Trans } from '@lingui/macro';

// eslint-disable-next-line no-empty-pattern
const DeviceTable: React.FC = ({}) => {
  const [tableData, setTableData] = useState<any>([]);
  const [isTableLoading, setTableLoading] = useState<any>(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [idToBeDelete, setIdToDelete] = useState(0);

  const handleOk = () => {
    if (idToBeDelete) {
      deleteEmployeeDevice(idToBeDelete);
      setTableData(tableData.filter((o: any) => o.id !== idToBeDelete));
    }
    setIsModalVisible(false);
  };
  useEffect(() => {
    if (tableData.length === 0) {
      setTableLoading(true);
      getDeviceList().then(res => {
        setTableData(res.data);
        setTableLoading(false);
      });
    }
    const interval = setInterval(() => {
      getDeviceList().then(res => {
        setTableData(res.data);
      });
    }, 10000);
    return () => clearInterval(interval);
  }, [tableData.length]);

  const columns = [
    {
      title: <Trans>Device Name</Trans>,
      dataIndex: 'device_name',
      key: 'device_name',
    },
    {
      title: <Trans>Status</Trans>,
      dataIndex: 'is_active',
      key: 'is_active',
      render: (item: any) => (item ? <>Active</> : <>Deactivate</>),
    },
    {
      title: <Trans>Action</Trans>,
      key: 'action',
      render: (item: any) => (
        <div
          className={`delete-icon`}
          onClick={_ => {
            setIsModalVisible(true);
            setIdToDelete(item.id);
          }}
        >
          <Icon path={mdiTrashCanOutline} className='material-menu-icons' />
        </div>
      ),
    },
  ];
  return (
    <>
      {isTableLoading ? (
        <ElementOrSkeleton isLoading type='table' />
      ) : (
        <>
          <Table columns={columns} dataSource={tableData} bordered={true} />
          <Modal
            visible={isModalVisible}
            onOk={handleOk}
            onCancel={_ => setIsModalVisible(false)}
            okText={'Yes'}
            cancelText={'No'}
          >
            <p>Are you sure want to delete this device </p>
          </Modal>
        </>
      )}
    </>
  );
};

export default DeviceTable;
