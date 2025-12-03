/* eslint-disable no-unused-expressions */
import React, { useEffect, useRef, useState } from 'react';
import { TreeSelect, Input, Checkbox } from 'antd';
import {
  SortAscendingOutlined,
  SortDescendingOutlined,
} from '@ant-design/icons';

const TreeSelectWithSearch = ({
  policyData,
  selectedCount,
  policyIndex,
  handleChangeTypes,
  value,
  allTypes,
}: any) => {
  const [searchValue, setSearchValue] = useState('');
  const [filteredData, setFilteredData] = useState(policyData);
  const [sortOrder, setSortOrder] = useState('asc');
  const [categoriesTypes, setCategoriesTypes] = useState<any>([]);

  useEffect(() => {
    setFilteredData(policyData);
  }, [policyData]);

  useEffect(() => {
    const typesArr: any[] = [];
    for (const key in allTypes) {
      allTypes[key].map((ele: any) => {
        typesArr.push(ele.id);
      });
    }
    setCategoriesTypes(typesArr);
  }, [allTypes]);

  const inputRef = useRef<any>(null);

  const sortTreeData = (treeData: any, order: string) => {
    return treeData
      .map((node: any) => {
        const children = sortTreeData(node.children || [], order);
        return {
          ...node,
          children,
        };
      })
      .sort((a: any, b: any) => {
        if (order === 'asc') {
          return a.title.localeCompare(b.title);
        } else {
          return b.title.localeCompare(a.title);
        }
      });
  };

  const handleSortOrderChange = (e: any) => {
    const newSortOrder = e;
    setSortOrder(newSortOrder);

    const sortedTreeData = sortTreeData(filteredData, newSortOrder);
    setFilteredData(sortedTreeData);
  };

  return (
    <div>
      <TreeSelect
        showSearch
        ref={inputRef}
        className='select-options-tag'
        searchValue={searchValue}
        value={value}
        treeData={filteredData}
        onDropdownVisibleChange={() => setSearchValue('')}
        treeCheckable={true}
        maxTagCount='responsive'
        treeNodeFilterProp='title'
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
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: 8,
                    justifyContent: 'space-between',
                    marginTop: 20,
                    padding: 5,
                  }}
                >
                  <Checkbox
                    onChange={e => {
                      return handleChangeTypes(
                        policyIndex,
                        e.target.checked ? categoriesTypes : [],
                      );
                    }}
                  >
                    Select All
                    <span style={{ color: '#0090FF' }}>
                      {' '}
                      {categoriesTypes?.length}{' '}
                    </span>
                    Types
                  </Checkbox>
                  <span>
                    Selected Types :
                    <span style={{ color: '#0090FF' }}>
                      {' '}
                      {selectedCount[policyIndex]}
                    </span>
                  </span>
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
        placeholder='Select'
        style={{ width: '100%' }}
        onChange={(ele: any, list: any, extra: any) => {
          handleChangeTypes(policyIndex, ele, extra);
        }}
      />
    </div>
  );
};

export default TreeSelectWithSearch;
