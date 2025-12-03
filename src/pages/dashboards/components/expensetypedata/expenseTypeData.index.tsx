import React, { useState } from 'react';
import jsonData from './data.json';
import { Tabs, Table, Select, DatePicker } from 'antd';
import { ColumnType } from 'antd/es/table';

const { TabPane } = Tabs;
const { Option } = Select;

interface DataType {
  category: string;
  expense_type: string;
  no_of_claims: number;
  claimed_amount: string;
  settled_amount: string;
}

interface Data {
  expense: DataType[];
  request: DataType[];
  benefit: DataType[];
}

type TabType = keyof Data;

const ExpenseTypeData: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('expense');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const handleTabChange = (key: TabType) => {
    setActiveTab(key);
    setSelectedCategory('All');
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const getTableTitle = () => {
    if (activeTab === 'expense') return 'Expense Type';
    if (activeTab === 'request') return 'Request Type';
    return 'Benefit Type';
  };

  const getActiveCategories = () => {
    if (activeTab === 'expense') {
      return ['General', 'Entertainment', 'Petty Cash', 'Allowance'];
    }
    if (activeTab === 'request') {
      return ['Travel', 'General'];
    }
    return [];
  };

  const activeCategories = getActiveCategories();

  const columns: ColumnType<DataType>[] = [
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: getTableTitle(),
      dataIndex: 'expense_type',
      key: 'expense_type',
    },
    {
      title: 'No of Claims',
      dataIndex: 'no_of_claims',
      key: 'no_of_claims',
    },
    {
      title: 'Claimed Amount',
      dataIndex: 'claimed_amount',
      key: 'claimed_amount',
    },
    {
      title: 'Settled Amount',
      dataIndex: 'settled_amount',
      key: 'settled_amount',
    },
  ];

  const data: Data = jsonData;

  const categoryOptions = [
    <Option key='All' value='All'>
      All
    </Option>,
    ...activeCategories.map(category => (
      <Option key={category} value={category}>
        {category}
      </Option>
    )),
  ];

  const filteredData =
    activeTab === 'expense'
      ? data.expense.filter(
          item =>
            selectedCategory === 'All' || item.category === selectedCategory,
        )
      : data.request.filter(
          item =>
            selectedCategory === 'All' || item.category === selectedCategory,
        );

  return (
    <div>
      <h3>Expense Type Data</h3>
      <div>
        <div style={{ width: '100%' }}>
          <Tabs activeKey={activeTab} onChange={handleTabChange as any}>
            <TabPane tab='Expense' key='expense'>
              <div style={{ display: 'flex', float: 'right', gap: '10px' }}>
                <div style={{ float: 'right' }}>
                  <Select
                    style={{ width: 200 }}
                    placeholder='Select Category'
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                  >
                    {categoryOptions}
                  </Select>
                </div>
                <div>
                  <DatePicker
                    bordered={false}
                    style={{ height: '5px', width: '125px' }}
                  />
                </div>
              </div>
              <Table<DataType> dataSource={filteredData} columns={columns} />
            </TabPane>
            <TabPane tab='Request' key='request'>
              <div style={{ display: 'flex', float: 'right', gap: '10px' }}>
                <div style={{ float: 'right' }}>
                  <Select
                    style={{ width: 200 }}
                    placeholder='Select Category'
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                  >
                    {categoryOptions}
                  </Select>
                </div>
                <DatePicker
                  bordered={false}
                  style={{ height: '5px', width: '125px' }}
                />
              </div>
              <Table<DataType> dataSource={filteredData} columns={columns} />
            </TabPane>
            <TabPane tab='Benefit' key='benefit'>
              <DatePicker
                bordered={false}
                style={{ height: '5px', width: '125px', float: 'right' }}
              />
              <Table<DataType>
                dataSource={
                  data[activeTab as 'expense' | 'request' | 'benefit']
                }
                columns={columns}
              />
            </TabPane>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ExpenseTypeData;
