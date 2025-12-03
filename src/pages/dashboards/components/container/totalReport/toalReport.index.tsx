import React, { useEffect, useState } from 'react';
import './totalReport.index.less';
import { Row, Col, Card, DatePicker, Calendar } from 'antd';
import { Pie } from '@ant-design/charts';
import data from './data.json';
import { CalendarFilled, CalendarOutlined } from '@ant-design/icons';

type BoxType = keyof typeof data;
type BoxStatus = keyof typeof data['Expense'];

interface BoxData {
  [box: string]: {
    [status: string]: number;
  };
}

const COLORS = [
  '#292929',
  '#eb2f96',
  '#08979c',
  '#ff1744',
  '#0000ff',
  '#68737d',
];

const TotalReport = () => {
  const [selectedBox, setSelectedBox] = useState<BoxType | null>('Expense');
  const [boxTotals, setBoxTotals] = useState<{ [box: string]: number }>({});
  const [clickedBox, setClickedBox] = useState<BoxType | null>('Expense');

  const handleBoxClick = (box: BoxType) => {
    setSelectedBox(box);
    setClickedBox(box);
  };

  useEffect(() => {
    const calculateBoxTotals = () => {
      const calculatedTotals: { [box: string]: any } = {};
      Object.keys(data).forEach(box => {
        const boxData = data[box as BoxType];
        const totalValue = Object.values(boxData).reduce(
          (total: any, value) => total + value,
          0,
        );
        calculatedTotals[box] = totalValue;
      });
      setBoxTotals(calculatedTotals);
    };

    calculateBoxTotals();
  }, []);

  const selectedData = selectedBox ? data[selectedBox] : null;
  const selectedBoxTotal = selectedBox ? boxTotals[selectedBox] : 0;

  return (
    <div className='containerNew'>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h3>Total Report</h3>
        <div style={{ marginBottom: '20px' }}>
          <DatePicker
            bordered={false}
            style={{ height: '5px', width: '125px' }}
          />
        </div>
      </div>

      <div>
        <Row gutter={[10, 10]}>
          <Col span={5}>
            {selectedData && (
              <Pie
                data={Object.entries(selectedData).map(([status, value]) => ({
                  type: status,
                  value,
                }))}
                height={110}
                width={200}
                innerRadius={1.5}
                angleField='value'
                colorField='type'
                radius={0.5}
                legend={false}
                tooltip={false}
                label={false}
                statistic={undefined}
                color={COLORS}
              />
            )}
          </Col>

          <Col span={17}>
            <Row gutter={[16, 16]}>
              {Object.keys(data).map(box => {
                const spacedBoxName = box.replace(/([a-z])([A-Z])/g, '$1 $2');
                return (
                  <Col span={6} key={box}>
                    <div
                      style={{
                        fontSize: '13px',
                        cursor: 'pointer',
                        marginTop: '20px',
                        fontWeight: clickedBox === box ? 'bold' : 'normal',
                      }}
                      onClick={() => handleBoxClick(box as BoxType)}
                    >
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <div
                          style={{
                            height: '50px',
                            width: '1px',
                            backgroundColor:
                              clickedBox === box ? 'blue' : '#0000001A',
                            transition: 'background-color 0.3s',
                          }}
                          className={clickedBox === box ? 'active-box' : ''}
                        ></div>
                        <div>
                          <div>{boxTotals[box]}</div>
                          <div>{spacedBoxName}</div>
                        </div>
                      </div>
                    </div>
                  </Col>
                );
              })}
            </Row>
          </Col>
        </Row>
        <div style={{ marginTop: '-5px', fontWeight: 'bolder' }}>
          {clickedBox && (
            <div>
              <div style={{ marginLeft: '180px' }}>
                Total {clickedBox} : {boxTotals[clickedBox]}
              </div>
            </div>
          )}
        </div>
        <Col span={18}>
          <div className='six-boxes-table'>
            {selectedData && (
              <Row gutter={[16, 16]}>
                {Object.keys(selectedData).map(status => (
                  <Col span={8} key={status}>
                    <Card className='six-boxes'>
                      <div className='six-boxes-title'>{status} </div>
                      <div className='six-boxes-value'>
                        {selectedData[status as BoxStatus]}
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>
            )}
          </div>
        </Col>
      </div>
    </div>
  );
};

export default TotalReport;
