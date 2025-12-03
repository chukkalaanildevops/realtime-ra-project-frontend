import React from 'react';
import './topClaimedAmount.index.less';
import jsonData from './data.json';
import { Calendar, DatePicker, Table } from 'antd';
import { DollarTwoTone } from '@ant-design/icons';

const TopClaimedAmount = () => {
  const columns = [
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (text: any, record: any) => (
        <div>
          <a href={record.claim_no} target='_blank' rel='noopener noreferrer'>
            {record.claim_no}
          </a>
          <h4>{record?.category}</h4>
          <h5>{record?.expense_type}</h5>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (text: any, record: any) => (
        <div
          style={{
            color: getStatusTextColor(record.status),
          }}
        >
          {record.status}
        </div>
      ),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (text: any, record: any) => (
        <div>
          <h6>{record.claimed_on}</h6>
          <h3>{record?.amount}</h3>
        </div>
      ),
    },
  ];

  const getStatusTextColor = (status: any) => {
    switch (status) {
      case 'Pending':
        return '#eb2f96';
      case 'Approved':
        return '#08979c';
      case 'Rejected':
        return '#ff1744';
      case 'Settled':
        return '#0000ff';
      case 'Stalled':
        return '#68737d';
      default:
        return '#000000';
    }
  };

  const dataSource = jsonData.data.map((item, index) => ({
    key: index,
    type: item,
    claim_no: item.claim_no,
    expense_type: item.expense_type,
    claimed_on: item.claimed_on,
    category: item.category,
    status: item.status,
    amount: item.amount,
  }));

  return (
    <div className='main'>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h3>Top Claimed Amount</h3>
        <div>
          <DatePicker
            bordered={false}
            style={{ height: '5px', width: '125px' }}
          />
        </div>
      </div>
      <div>
        <br />
        <div>
          <Table
            pagination={false}
            dataSource={dataSource}
            columns={columns}
            style={{ maxHeight: 550, overflow: 'auto' }}
          />
        </div>
      </div>
    </div>
  );
};

export default TopClaimedAmount;
