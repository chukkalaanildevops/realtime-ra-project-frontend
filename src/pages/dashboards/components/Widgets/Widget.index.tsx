import React, { FC } from 'react';
import './widget.index.less';
import {
  DollarCircleFilled,
  DollarCircleTwoTone,
  DollarOutlined,
} from '@ant-design/icons';
import Records from './record.json';
const Widget: FC<{}> = props => {
  return (
    <>
      {Records.map(record => {
        return (
          <div className='container'>
            <div className='left'>
              <div className='title' key={record.id}>
                {record?.title}
              </div>
              <div className='amount'>{record.amount}</div>
            </div>
            <div className='dollar'>
              <DollarCircleTwoTone />
            </div>
          </div>
        );
      })}
    </>
  );
};

export default Widget;
