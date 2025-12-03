import React from 'react';
import { Row, Col, Button } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
//import { Trans } from '@lingui/macro';

const ApproveReject: React.FC<{
  type: 'request' | 'expense' | 'expenses_with_request' | 'benefit';
  id: number;
  empId: number;
  setApprovalModal: any;
  item?: any;
}> = ({ type, id, empId, setApprovalModal, item }) => (
  <Row gutter={24}>
    <Col span={12}>
      <Button
        shape='circle'
        title={'approve'}
        icon={<CheckOutlined style={{ color: '#fff' }} />}
        style={{
          backgroundColor: '#13c2c2',
          paddingTop: '1.5px',
          paddingLeft: '0.8px',
        }}
        size='small'
        onClick={() =>
          setApprovalModal({
            id,
            isModalVisible: true,
            action: 'approve',
            type,
            empId,
            isApprovalPage: item.isApprovalPage ? item.isApprovalPage : false,
            flag_color_v2: item.flag_color_v2 ? item.flag_color_v2 : '',
            isAdmin: false,
            isEmployee: false,
          })
        }
      />
    </Col>
    <Col span={12}>
      <Button
        shape='circle'
        title={'reject'}
        icon={<CloseOutlined style={{ color: '#fff' }} />}
        style={{
          backgroundColor: '#ff1744',
          paddingTop: '1.5px',
          paddingLeft: '0.8px',
        }}
        size='small'
        onClick={() =>
          setApprovalModal({
            id,
            isModalVisible: true,
            action: 'reject',
            type,
            empId,
            isApprovalPage: item.isApprovalPage,
            isAdmin: false,
            isEmployee: false,
            flag_color_v2: item.flag_color_v2,
          })
        }
      />
    </Col>
  </Row>
);
export default ApproveReject;
