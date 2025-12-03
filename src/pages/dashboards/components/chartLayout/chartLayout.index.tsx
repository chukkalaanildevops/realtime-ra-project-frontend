import React from 'react';
import { Row, Col } from 'antd';
import ChartBoxContainer from '../chartBoxContainer/chartBox.index';

import './chartLayout.index.less';

const chartLayout: React.FC<{
  rows: any;
  viewAsRole: any;
}> = props => {
  const { rows = [], viewAsRole } = props;
  return (
    rows &&
    rows.map((row: any) => {
      return (
        <Row
          gutter={[18, 18]}
          className='chart-content-container'
          justify={'space-between'}
        >
          {row &&
            row.map((col: any) => {
              const dataLength =
                col.layout_size === 25
                  ? 4
                  : col.layout_size === 33
                  ? 3
                  : col.layout_size === 50
                  ? 2
                  : 1;
              const spanLength = 24 / dataLength;
              return (
                <Col className='chart-box-container' span={spanLength}>
                  <ChartBoxContainer data={col} viewAsRole={viewAsRole} />
                </Col>
              );
            })}
        </Row>
      );
    })
  );
};

export default chartLayout;
