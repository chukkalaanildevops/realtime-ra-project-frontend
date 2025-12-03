import React from 'react';
import { Card, Skeleton } from 'antd';
import CardContainer from '../cardContainer/cardContainer';

const CardLoader: React.FC<{
  title: string;
}> = ({ title }) => {
  return (
    <CardContainer title={title} cardCount={1}>
      <Card
        className='card'
        style={{
          left: 0,
          top: 18,
          zIndex: 200,
          width: 300,
        }}
      >
        <Skeleton active={true} loading={true}></Skeleton>
      </Card>
    </CardContainer>
  );
};
export default CardLoader;
