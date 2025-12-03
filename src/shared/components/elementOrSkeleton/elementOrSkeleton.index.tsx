import React from 'react';
import { Card, Col, Row, Skeleton, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';

const ElementOrSkeleton: React.FC<{
  isLoading: boolean;
  isActive?: boolean;
  type?:
    | 'table'
    | 'profilelist'
    | 'simple'
    | 'page'
    | 'input'
    | 'card'
    | 'cards'
    | 'button';
  skeletonStyle?: { [key: string]: any };
  tableConfiguration?: { rows: number; columns: number };
  profileListConfiguration?: { rows: number };
  simpleConfiguration?: { rows: number };
  cardsConfiguration?: { numberOfCardsPerRow: number; rows: number };
}> = props => {
  const {
    isLoading = true,
    isActive = true,
    type = 'simple',
    skeletonStyle = {},
    tableConfiguration,
    simpleConfiguration,
    profileListConfiguration,
    cardsConfiguration,
  } = props;

  const getSimpleSkeleton = () => {
    let skeletonProps = {
      rows: 0,
    };

    if (simpleConfiguration !== undefined) {
      skeletonProps.rows = simpleConfiguration.rows;
    }

    return <Skeleton active={isActive} paragraph={skeletonProps} />;
  };

  const getTableSkeleton = () => {
    let rows = 12;
    let columns = 5;

    if (tableConfiguration !== undefined) {
      rows = tableConfiguration.rows;
      columns = tableConfiguration.columns;
    }

    let dataSource = [];

    for (let row = 0; row < rows; row++) {
      let dummyData: { [key: string]: any } = {};
      for (let col = 0; col < columns; col++) {
        dummyData['key'] = row * col;
        dummyData[String(col)] = <Skeleton.Input active={isActive} />;
      }
      dataSource.push(dummyData);
    }

    let tableColumnHeaders: ColumnsType<any> = [];
    for (let col = 0; col < columns; col++) {
      tableColumnHeaders.push({
        title: <Skeleton.Input active={isActive} />,
        key: String(col),
        dataIndex: String(col),
      });
    }

    return (
      <Table
        pagination={false}
        columns={tableColumnHeaders}
        dataSource={dataSource}
        rowKey='key'
      />
    );
  };

  const getProfileListSkeleton = () => {
    let rows = 10;

    if (profileListConfiguration !== undefined) {
      rows = profileListConfiguration.rows;
    }

    let skeletonRows = [];

    for (let row = 0; row < rows; row++) {
      skeletonRows.push(
        <Skeleton key={row} active={isActive} avatar paragraph={{ rows: 1 }} />,
      );
    }

    return <div className='skeleton profile'>{skeletonRows}</div>;
  };

  const getPageSkeleton = () => {
    let skeletonRows = [];
    for (let row = 0; row < 5; row++) {
      skeletonRows.push(<Skeleton key={row} active={isActive} />);
    }
    return <div>{skeletonRows}</div>;
  };

  const getInputSkeleton = () => {
    return <Skeleton.Input active={isActive} />;
  };

  const getButtonSkeleton = () => {
    return <Skeleton.Button active={isActive} />;
  };

  const getCardSkeleton = () => {
    return (
      <Card title={<Skeleton.Button />} style={{ marginBottom: 24 }}>
        <Skeleton paragraph={{ rows: 1 }} />
      </Card>
    );
  };

  const getCardsSkeleton = () => {
    let rows = [];
    for (let row = 0; row < (cardsConfiguration?.rows || 3); row++) {
      let cards = [];
      for (
        let col = 0;
        col < (cardsConfiguration?.numberOfCardsPerRow || 4);
        col++
      ) {
        cards.push(
          <Col
            sm={24}
            md={24 / (cardsConfiguration?.numberOfCardsPerRow || 4)}
            key={col * Math.random()}
          >
            <Card
              title={<Skeleton.Input />}
              style={{ marginBottom: 24 }}
              key={(row + 1) * (col + 1)}
            >
              <Skeleton paragraph={{ rows: 2 }} />
            </Card>
          </Col>,
        );
      }
      rows.push(
        <Row key={row} gutter={16}>
          {cards}
        </Row>,
      );
    }
    return rows;
  };

  return (
    <>
      {isLoading ? (
        <div style={skeletonStyle}>
          {(type === 'simple' && getSimpleSkeleton()) ||
            (type === 'table' && getTableSkeleton()) ||
            (type === 'profilelist' && getProfileListSkeleton()) ||
            (type === 'page' && getPageSkeleton()) ||
            (type === 'input' && getInputSkeleton()) ||
            (type === 'card' && getCardSkeleton()) ||
            (type === 'cards' && getCardsSkeleton()) ||
            (type === 'button' && getButtonSkeleton()) ||
            (type === undefined && getSimpleSkeleton())}
        </div>
      ) : (
        props.children
      )}
    </>
  );
};

export default ElementOrSkeleton;
