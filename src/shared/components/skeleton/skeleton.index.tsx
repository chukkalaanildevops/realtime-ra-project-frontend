import React from 'react';
import { Row, Col, Skeleton } from 'antd';

const SkeletonItem: React.FC<{
  type?: 'Form' | 'Default';
  isLoadingData?: boolean;
}> = props => {
  const { type = 'Default', isLoadingData = true } = props;
  switch (type) {
    case 'Default':
      return getTwoColFifteenRowSkeleton(isLoadingData);

    case 'Form':
      return getFormSkeleton(isLoadingData);

    default:
      console.error("'" + type + "'Type support does not exist");
      return <></>;
  }
};

/**
 * Function return skeleton structure.
 * 2 column and 15 rows inside each column layout
 * @param isLoadingData
 */
export const getTwoColFifteenRowSkeleton = (isLoadingData: boolean = true) => {
  const skeletonArray = new Array(15).fill(' ');
  const rowProps: {} = { gutter: [16, 16] };
  return (
    <>
      <Row {...rowProps}>
        <Col span={12}>
          {skeletonArray.map((_o: any, i: number) => (
            <span key={i}>
              <Skeleton.Input
                style={{
                  width: '100%',
                  margin: '5px',
                }}
                size='small'
                active={isLoadingData}
              />
              <Skeleton.Input
                style={{
                  width: '70%',
                  margin: '5px',
                }}
                size='small'
                active={isLoadingData}
              />
            </span>
          ))}
        </Col>
        <Col span={12}>
          {skeletonArray.map((_o: any, i: number) => (
            <span key={i}>
              <Skeleton.Input
                style={{
                  width: '100%',
                  margin: '5px',
                }}
                size='small'
                active={isLoadingData}
              />
              <Skeleton.Input
                style={{
                  width: '70%',
                  margin: '5px',
                }}
                size='small'
                active={isLoadingData}
              />
            </span>
          ))}
        </Col>
      </Row>
    </>
  );
};

/**
 * Function return skeleton structure.
 * @param isLoadingData
 */
export const getFormSkeleton = (isLoadingData: boolean = true) => {
  const skeletonArray = new Array(7).fill(' ');
  return (
    <>
      <Skeleton active={isLoadingData} paragraph={{ rows: 2 }} />
      {skeletonArray.map((_o, i: number) => (
        <Skeleton title={false} key={i} active={isLoadingData} />
      ))}
    </>
  );
};

export default SkeletonItem;
