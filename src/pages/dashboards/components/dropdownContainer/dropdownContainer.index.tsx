import React from 'react';
import { Select, Row } from 'antd';
import './dropdownContainer.index.less';
const { Option } = Select;

const DropdownContainer: React.FC<{
  setSelectedOption: any;
  dropdownList: any;
  title: any;
  selectedValue: any;
}> = props => {
  const { title, dropdownList, setSelectedOption, selectedValue } = props;

  return (
    <div className='dropdown-container'>
      <Row className='dropdown-title'>
        <label htmlFor='dashboard'>{title}</label>
      </Row>
      <Row className='dropdown-box'>
        <Select
          id='dashboard'
          style={{ width: 200 }}
          value={selectedValue}
          defaultValue={dropdownList[0]}
          onSelect={(_val: any, item: any) => {
            const selectedRole = dropdownList.filter(
              (it: any) => it.code === item.key,
            );
            setSelectedOption({
              code: selectedRole[0].code,
              title: selectedRole[0].title,
            });
          }}
        >
          {dropdownList.map((item: any) => (
            <Option key={item.code} value={item.title}>
              {item.title}
            </Option>
          ))}
        </Select>
      </Row>
    </div>
  );
};

export default DropdownContainer;
