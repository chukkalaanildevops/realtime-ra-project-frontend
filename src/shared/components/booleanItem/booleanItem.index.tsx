import React from 'react';
import { CheckCircleTwoTone, StopOutlined } from '@ant-design/icons';
import { Col } from 'antd';

import './booleanItem.index.less';

const GRAY_COLOR = '#a1b2c2';
const returnTrueIcon = () => <CheckCircleTwoTone twoToneColor='#1890ff' />;
const returnFalseIcon = () => <StopOutlined style={{ color: GRAY_COLOR }} />;

const BooleanItem: React.FC<{
  value: any;
  title: React.ReactNode;
  normal?: boolean;
  classname?: any;
}> = ({ title, value, normal, classname = '' }) => {
  const valueStyle: any = {};
  if (normal) {
    valueStyle.fontWeight = 300;
  }
  if (!value) {
    valueStyle.color = GRAY_COLOR;
  }
  return (
    <Col
      span={24}
      style={normal ? { paddingTop: 0 } : {}}
      className={classname}
    >
      <>
        <div className='text-content'>
          {value ? returnTrueIcon() : returnFalseIcon()}
        </div>
        <div className='icon-content' style={{ ...(valueStyle as object) }}>
          {title}
        </div>
      </>
    </Col>
  );
};

export default BooleanItem;
