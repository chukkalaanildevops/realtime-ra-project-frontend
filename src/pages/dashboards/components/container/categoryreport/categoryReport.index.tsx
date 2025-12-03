import React, { useState } from 'react';
import './categoryReport.index.less';
import { Button, DatePicker, Tabs } from 'antd';
import { Pie, measureTextWidth } from '@ant-design/plots';
import data from './data.json';

const { TabPane } = Tabs;

const COLORS = ['#6495F8', '#F7C122', '#657798', '#63DAAB'];

interface Total {
  claimed: string;
  rejected: string;
  approved: string;
  settled: string;
}

interface DataEntry {
  name: string;
  value?: number;
  amount?: number;
  claimed?: string;
  rejected?: string;
  approved?: string;
  settled?: string;
  total?: Total[];
}

interface TabContentProps {
  data: (DataEntry | { total: Total[] })[];
}

const TabContent: React.FC<TabContentProps> = ({ data }) => {
  return (
    <div className='tab-content'>
      {data.map((entry: any, index) => (
        <Button
          key={index}
          style={{
            backgroundColor: COLORS[index % COLORS.length],
            margin: '5px',
          }}
        >
          {entry.name || 'Total'} - {entry.value || ''}
        </Button>
      ))}
    </div>
  );
};

const CategoryReport: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'expense' | 'benefit' | 'request'>(
    'expense',
  );

  const handleTabChange = (tabKey: 'expense' | 'benefit' | 'request') => {
    setActiveTab(tabKey);
  };

  const chartData = data[activeTab].slice(1);

  return (
    <div className='main'>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h3>Category Report</h3>
        <div style={{ marginBottom: '20px' }}>
          <DatePicker
            bordered={false}
            style={{ height: '5px', width: '125px' }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', height: '60vh' }}>
        <Tabs activeKey={activeTab} onChange={handleTabChange as any}>
          <TabPane tab='Expense' key='expense' style={{ width: '90vh' }}>
            <div style={{ display: 'flex', marginTop: '30px' }}>
              <Pie
                data={chartData}
                angleField='value'
                colorField='name'
                radius={60}
                height={250}
                innerRadius={2}
                label={{
                  type: 'inner',
                  offset: '-30%',
                  content: '{value}',
                  style: { fill: '#FFF' },
                }}
              />
            </div>
          </TabPane>
          <TabPane tab='Benefit' key='benefit' style={{ width: '90vh' }}>
            <div style={{ display: 'flex', marginTop: '30px' }}>
              <div>
                <Pie
                  data={chartData}
                  angleField='value'
                  colorField='name'
                  radius={60}
                  innerRadius={2}
                  height={250}
                  label={{
                    type: 'inner',
                    offset: '-30%',
                    content: '{value}',
                    style: { fill: '#FFF' },
                  }}
                />
              </div>
            </div>
          </TabPane>
          <TabPane tab='Request' key='request' style={{ width: '90vh' }}>
            <div style={{ display: 'flex', marginTop: '30px' }}>
              <div>
                <Pie
                  data={chartData}
                  angleField='value'
                  colorField='name'
                  radius={60}
                  height={250}
                  innerRadius={2}
                  label={{
                    type: 'inner',
                    offset: '-30%',
                    content: '{value}',
                    style: { fill: '#FFF' },
                  }}
                />
              </div>
            </div>
          </TabPane>
        </Tabs>
      </div>
      <hr />
      <br></br>
      <div
        style={{
          display: 'flex',
          width: '100%',
          justifyContent: 'space-between',
          marginTop: '50px',
        }}
      >
        {data[activeTab][0].total?.map((entry: any, index: any) => (
          <div key={index}>
            <h3>{entry.claimed}</h3>
            <p>Claimed Amount</p>
          </div>
        ))}
        <div style={{ border: '0.5px solid #0000001A', height: '60px' }}></div>
        {data[activeTab][0].total?.map((entry: any, index: any) => (
          <div key={index}>
            <h3>{entry.rejected}</h3>
            <p>Rejected Amount</p>
          </div>
        ))}
        <div style={{ border: '0.5px solid #0000001A', height: '60px' }}></div>
        {data[activeTab][0].total?.map((entry: any, index: any) => (
          <div key={index}>
            <h3>{entry.approved}</h3>
            <p>Approved Amount</p>
          </div>
        ))}
        <div style={{ border: '0.5px solid #0000001A', height: '60px' }}></div>
        {data[activeTab][0].total?.map((entry: any, index: any) => (
          <div key={index}>
            <h3>{entry.settled}</h3>
            <p>Settled Amount</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryReport;
