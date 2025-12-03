import React from 'react';
import { Input } from 'antd';
const { Search } = Input;
const SFFILTERSECTION: React.FC<{ onSearchClick: any }> = ({
  onSearchClick,
}) => {
  return (
    <Search
      placeholder='Search by username, email, name, employee id'
      allowClear
      enterButton
      onSearch={onSearchClick}
    />
  );
};

export default SFFILTERSECTION;
