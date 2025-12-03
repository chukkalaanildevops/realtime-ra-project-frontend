import React from 'react';
import { Col } from 'antd';
import './optionalItem.index.less';

const GRAY_COLOR = '#a1b2c2';

const OptionalItem: React.FC<{
  title: React.ReactNode;
  value: any;
  classname?: any;
}> = ({ title, value, classname = '' }) => {
  let style = {};
  if (value === 'Not Defined') {
    style = { color: GRAY_COLOR };
  }
  return (
    <Col span={24} className={classname}>
      <>
        <div
          className='text-label'
          style={value ? { ...style } : { color: GRAY_COLOR }}
        >
          {title}
        </div>
        <div
          className='text-content'
          style={value ? { ...style } : { color: GRAY_COLOR }}
        >
          {value}
        </div>
      </>
    </Col>
  );
};

export default OptionalItem;
