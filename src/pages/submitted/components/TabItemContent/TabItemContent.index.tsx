import React, { useState } from 'react';
import { Table, Button, Row, Modal } from 'antd';
import {
  UnorderedListOutlined,
  TableOutlined,
  FullscreenOutlined,
} from '@ant-design/icons';
import Col from 'antd/lib/col';
import { TableProps } from 'antd/lib/table';
import './TabItemContent.index.less';
import { Trans } from '@lingui/macro';

enum ViewType {
  Card,
  Table,
}

type TabItemContentProps = TableProps<any> & {
  onSelectRow?: (list: any[]) => void;
};

const TabItemContent: React.FC<TabItemContentProps> = props => {
  const [currentView, setCurrentView] = useState(ViewType.Table);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const { columns, dataSource } = props;

  const onSelectChange = (selectedRowKeys: any[]) => {
    setSelectedRows(selectedRowKeys as never);
    props.onSelectRow && props.onSelectRow(selectedRowKeys);
  };

  const handleOk = () => {
    setModalVisible(false);
  };

  const handleCancel = () => {
    setModalVisible(false);
  };
  const getTableView = () => {
    return (
      <div>
        <Table
          columns={columns}
          dataSource={dataSource}
          bordered
          rowSelection={{
            type: 'checkbox',
            selectedRowKeys: selectedRows,
            onChange: onSelectChange,
          }}
          expandable={{
            expandedRowRender: () => null,
            rowExpandable: () => true,
            expandIcon: () => (
              <FullscreenOutlined onClick={() => setModalVisible(true)} />
            ),
          }}
          {...props}
        />
        <Modal
          visible={modalVisible}
          title='Item Details'
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <div>
            <h3>Expanded item details will be shown here</h3>
          </div>
        </Modal>
        <div className='approval-button'>
          <Button
            type='primary'
            size='large'
            disabled={selectedRows.length <= 0}
          >
            <Trans>Send For Approval</Trans>
          </Button>
        </div>
      </div>
    );
  };

  const getCardView = () => <div>Card View</div>;

  const view = currentView === ViewType.Table ? getTableView() : getCardView();

  return (
    <div>
      <Row justify='end'>
        <Col style={{ width: 50 }}>
          <TableOutlined
            style={{
              fontSize: '20px',
              color: ViewType.Table === currentView ? '#1890FF' : '',
            }}
            onClick={() => setCurrentView(ViewType.Table)}
          />
        </Col>
        <Col style={{ width: 50 }}>
          <UnorderedListOutlined
            style={{
              fontSize: '20px',
              color: ViewType.Card === currentView ? '#1890FF' : '',
            }}
            onClick={() => setCurrentView(ViewType.Card)}
          />
        </Col>
      </Row>
      {view}
    </div>
  );
};

export default TabItemContent;
