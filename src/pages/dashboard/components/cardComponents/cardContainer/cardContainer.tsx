import React from 'react';
import { Typography } from 'antd';
const { Text } = Typography;
const initial = 300;

const CardContainer: React.FC<{
  title?: string;
  count?: number;
  cardCount: number;
}> = ({ count, title, cardCount, children }) => {
  return (
    <div className='actionable-card'>
      <div className='statistics'>
        <Text className='title'>{title + ' . '}</Text>
        <Text className='count'>{count}</Text>
      </div>
      <div
        className='card-stack'
        style={{
          width: initial + cardCount * 5,
        }}
      >
        {children}
      </div>
    </div>
  );
};
export default CardContainer;
