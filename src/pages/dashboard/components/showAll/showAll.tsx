import React from 'react';
import { Card, Button } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
const initial = 300;

const ShowAll: React.FC<{
  navigate: string;
  history: any;
  type: string;
  onAction: any;
  index: number;
  status?: 'PENDNG' | 'APPRVD' | 'REJCTD';
}> = ({ history, onAction, navigate, type, index, status }) => (
  <Card
    className='card'
    style={{
      left: index * 4,
      top: 18 - index * 6,
      zIndex: (3 - index) * 100,
      width: initial - index * 8,
    }}
    bodyStyle={{
      width: '100%',
      height: '100%',
    }}
  >
    <div className='card-content' style={{ width: '100%', height: '100%' }}>
      <div style={{ marginTop: '13%', width: '80%', marginLeft: '10%' }}>
        <Button
          type='link'
          onClick={() => history.push(navigate, { page: 1, status })}
          style={{ zIndex: 300, width: '100%' }}
        >
          Show All
        </Button>
      </div>
      <div className='navigators'>
        <div className='navigator'>
          <LeftOutlined onClick={() => onAction(type, 'prev')} />
        </div>
        <div className='navigator'>
          <RightOutlined onClick={() => onAction(type, 'next')} />
        </div>
      </div>
    </div>
  </Card>
);

export default ShowAll;
