import React, { ReactNode } from 'react';
import { Input } from 'antd';
import {
  FilterDropdownProps,
  ColumnFilterItem,
  SortOrder,
} from 'antd/lib/table/interface';
import { SearchOutlined } from '@ant-design/icons';
import moment from 'moment';

const useTableFilters = () => {
  /**
   * This will return props object need for search
   * @param dataIndex
   * @param renderFunction
   */
  const getSearchProps = (
    dataIndex: string,
    renderFunction?: (_val: any, _record?: any, _index?: number) => ReactNode,
  ) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }: FilterDropdownProps) => (
      <div style={{ padding: 8 }}>
        <Input
          autoFocus
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => {
            setSelectedKeys(e.target.value ? [e.target.value] : []);
            if (!e.target.value) {
              handleReset(clearFilters);
            }
          }}
          onPressEnter={() => {
            handleSearch(selectedKeys, confirm, dataIndex);
          }}
          suffix={<SearchOutlined style={{ color: '#1890ff' }} />}
          allowClear
        />
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value: any, record: any) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : '',
    render: renderFunction,
  });

  /**
   * Search Enter
   * @param _selectedKeys
   * @param confirm
   * @param _dataIndex
   */
  const handleSearch = (
    _selectedKeys: React.Key[],
    confirm: () => void,
    _dataIndex: string,
  ) => {
    confirm();
  };
  /**
   * Search reset
   * @param clearFilters
   */
  const handleReset = (clearFilters?: () => void) => {
    clearFilters && clearFilters();
  };

  /* --------------------------- Second Filter ------------------------------- */
  /**
   * Filter with checkbox options.
   * typeof check condition is String in onFilter function
   * @param filterOptionArr
   * @param onFilterFn
   */
  const getCheckBoxFilterProps = (
    filterOptionArr: ColumnFilterItem[],
    filterKey?: string,
    onFilterFn?: (_val: any, _record?: any, _index?: number) => boolean,
  ): {
    filters: ColumnFilterItem[];
    onFilter: any;
  } => ({
    filters: filterOptionArr,
    onFilter: onFilterFn
      ? onFilterFn
      : filterKey
      ? (value: string, record: any) => String(record[filterKey]) === value
      : (console.error(
          'Please provide `filterKey` to getCheckBoxFilterProps Function ',
        ),
        undefined),
  });

  /* --------------------------- Date Sorting Filter ------------------------------- */

  const getDateSortFilterProps = (
    key: string,
    dateFormat: string[] = [
      'DD/MM/YYYY',
      'DD-MM-YYYY',
      'DD/MM/YYYYTHH:mm:ss[.mmm]TZD',
    ],
  ): {
    sorter: any;
    sortDirections: SortOrder[];
    // defaultSortOrder: SortOrder;
  } => ({
    sorter: (a: any, b: any, _sortOrder?: SortOrder): number => {
      return (
        moment(a[key], dateFormat).unix() - moment(b[key], dateFormat).unix()
      );
    },
    sortDirections: ['descend', 'ascend'],
    // defaultSortOrder: 'ascend',
  });

  /* --------------------------- Number Sorting Filter ------------------------------- */

  const getNumberSortFilterProps = (
    key: string,
  ): {
    sorter: any;
    sortDirections: SortOrder[];
    // defaultSortOrder: SortOrder;
  } => ({
    sorter: (a: any, b: any, _sortOrder?: SortOrder): number => a[key] - b[key],
    sortDirections: ['descend', 'ascend'],
    // defaultSortOrder: 'ascend',
  });

  const getPaginatedSortFilterProps = (
    func: any,
    order: any,
  ): {
    defaultSortOrder: any;
    sorter: any;
    sortDirections: any;
    // defaultSortOrder: SortOrder;
  } => ({
    defaultSortOrder: order,
    sortDirections: ['ascend', 'descend', 'ascend'],
    // eslint-disable-next-line no-unused-vars
    sorter: (a: any, b: any, _sortOrder: any) => {
      func(_sortOrder);
      return 0;
    },
    // defaultSortOrder: 'ascend',
  });

  return {
    getSearchProps,
    getCheckBoxFilterProps,
    getDateSortFilterProps,
    getNumberSortFilterProps,
    getPaginatedSortFilterProps,
  };
};

export default useTableFilters;
