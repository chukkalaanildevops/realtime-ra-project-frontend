import React, { useState } from 'react';
import './costCentreAnalytics.index.less';
import jsonData from './record.json';
import { DatePicker, List, Radio } from 'antd';
import { DollarCircleTwoTone, DollarTwoTone } from '@ant-design/icons';
const CostCentreAnalytics = () => {
  const [selectedId, setSelectedId] = useState(1);
  const handleRadioChange = (e: any) => {
    setSelectedId(e.target.value);
  };
  const selectedData =
    jsonData.maindata.find(item => item.id === selectedId)?.data || [];
  return (
    <div className='containerNew5'>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h3>Cost centre Analytics</h3>
        <div style={{ marginBottom: '20px' }}>
          <DatePicker
            bordered={false}
            style={{ height: '5px', width: '125px' }}
          />
        </div>
      </div>
      <div style={{ justifyContent: 'space-between' }}>
        <div>
          <Radio.Group
            onChange={handleRadioChange}
            value={selectedId}
            className='radio-btn'
          >
            {jsonData.maindata.map(item => (
              <Radio style={{ fontSize: '10px' }} key={item.id} value={item.id}>
                {item.title}
              </Radio>
            ))}
          </Radio.Group>
        </div>
        <div style={{ padding: '20px' }}>
          <List
            dataSource={selectedData}
            renderItem={item => (
              <List.Item className='list-divider'>
                <div>{item.title}</div>
                <div style={{ marginRight: '10px', gap: '20px' }}>
                  $ {item.amount}
                </div>
              </List.Item>
            )}
            style={{
              maxHeight: 320,
              overflow: 'auto',
              justifyContent: 'space-between',
              padding: '8px',
            }}
          />
        </div>
      </div>
    </div>
  );
};
export default CostCentreAnalytics;
