/* eslint-disable no-unused-expressions */
import {
  SortAscendingOutlined,
  SortDescendingOutlined,
} from '@ant-design/icons';
import { Input, TreeSelect } from 'antd';
import React, { useEffect, useRef, useState } from 'react';

interface IObjectKeys {
  [key: string]: any;
}
export const targetLabelValues: IObjectKeys = {
  ENTITY__COMPANY: 'Company',
  ENTITY__DIVISION: 'Division',
  ENTITY__DEPARTMENT: 'Department',
  ENTITY__BUSINESS_UNIT: 'Business Unit',
  EMPLOYEE_GROUP: 'Employee Group',
  JOB_INFO_PAY_GRADE: 'Pay Grade',
  JOB_INFO_EMPLOYEE_GROUP: 'SF Employee Group',
  GEN: 'General',
  MIL: 'Mileage',
  ALW: 'Allowance',
  ENT: 'Entertainment',
  PTC: 'Petty Cash',
  APPROVER: 'Approver',
  EMPLOYEE: 'Employee',
  FINANCE_ADMIN: 'Admin',
};

const PreviewTreeSelectWithSearch = ({ value, policyData }: any) => {
  const [searchValue, setSearchValue] = useState('');
  const [filteredData, setFilteredData] = useState(policyData);
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    setFilteredData(policyData);
  }, [policyData]);

  const inputRef = useRef<any>(null);

  const handleSortOrderChange = (e: any) => {
    const newSortOrder = e;
    setSortOrder(newSortOrder);

    if (newSortOrder === 'asc') {
      filteredData?.forEach((item: any) => {
        item?.types?.sort((a: any, b: any) =>
          a?.title?.localeCompare(b?.title),
        );
      });

      filteredData?.sort((a: any, b: any) => {
        const nameA = a?.name?.toUpperCase();
        const nameB = b?.name?.toUpperCase();
        return nameA?.localeCompare(nameB);
      });
    } else if (newSortOrder === 'desc') {
      filteredData?.forEach((item: any) => {
        item?.types?.sort((a: any, b: any) =>
          b?.title?.localeCompare(a?.title),
        );
      });

      filteredData?.sort((a: any, b: any) => {
        const nameA = a?.name?.toUpperCase();
        const nameB = b?.name?.toUpperCase();
        return nameB?.localeCompare(nameA);
      });
    }
  };

  return (
    <div>
      <TreeSelect
        ref={inputRef}
        value={value}
        treeCheckable={true}
        searchValue={searchValue}
        maxTagCount='responsive'
        treeNodeFilterProp='title'
        onDropdownVisibleChange={() => setSearchValue('')}
        showArrow
        className='tree-select-options'
        showSearch
        placeholder='Select'
        style={{ width: '100%' }}
        dropdownRender={(menu: any) => {
          return (
            <>
              <div style={{ padding: 10 }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: 8,
                    justifyContent: 'space-between',
                  }}
                >
                  <Input
                    style={{ width: '70%', borderRadius: '8px' }}
                    placeholder={`Search Types`}
                    value={searchValue}
                    onKeyDown={e => {
                      if (e.key === 'Backspace') {
                        return e.stopPropagation();
                      }
                    }}
                    onChange={(e: any) => {
                      // handleSearch(e);
                      setSearchValue(e.target.value);
                    }}
                  />
                  <div
                    onClick={() =>
                      handleSortOrderChange(
                        sortOrder === 'asc' ? 'desc' : 'asc',
                      )
                    }
                  >
                    {sortOrder === 'asc' ? (
                      <>
                        <div
                          style={{
                            display: 'flex',
                            cursor: 'pointer',
                            marginRight: '10px',
                          }}
                        >
                          <SortAscendingOutlined
                            style={{
                              alignItems: 'center',
                              display: 'flex',
                              marginRight: '5px',
                            }}
                          />
                          <span>A - Z</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div
                          style={{
                            display: 'flex',
                            cursor: 'pointer',
                            marginRight: '10px',
                          }}
                        >
                          <SortDescendingOutlined
                            style={{
                              alignItems: 'center',
                              display: 'flex',
                              marginRight: '5px',
                            }}
                          />
                          <span>A - Z</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
              {menu}
            </>
          );
        }}
        treeDefaultExpandAll={true}
        maxTagPlaceholder={(e: any) => {
          return <span>...</span>;
        }}
      >
        {filteredData?.map((item: any) => {
          return (
            <TreeSelect.TreeNode
              key={item?.name}
              value={item?.name}
              title={targetLabelValues[item?.name]}
            >
              {item?.types?.map((ele: any) => {
                return (
                  <TreeSelect.TreeNode
                    key={ele?.id}
                    value={ele?.id}
                    title={ele?.title}
                  />
                );
              })}
            </TreeSelect.TreeNode>
          );
        })}
      </TreeSelect>
    </div>
  );
};

export default PreviewTreeSelectWithSearch;
