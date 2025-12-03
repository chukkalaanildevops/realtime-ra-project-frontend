import React, { useState, ReactText, useEffect } from 'react';
import { Select } from 'antd';
import { CheckOutlined, DownOutlined } from '@ant-design/icons';
import './customisedDropdown.index.less';

const CustomisedDropdown: React.FC<{
  placeholder: string;
  className?: string;
  bordered?: boolean;
  allValues: (string | number)[];
  preSelectedValues: (string | number)[];
  onSelect?: (value: string | number) => void;
  onDeselect?: (value: string | number) => void;
  onSelectAllToggled?: (value: (string | number)[]) => void;
  showSelectAll?: boolean;
  isLoading?: boolean;
  mode?: 'multiple' | 'single';
}> = props => {
  const {
    placeholder,
    className,
    bordered,
    allValues,
    preSelectedValues,
    onSelect,
    onDeselect,
    onSelectAllToggled,
    showSelectAll = true,
    isLoading = false,
    mode = 'multiple',
  } = props;

  const [selectedValues, setSelectedValues] = useState<
    string[] | number[] | ReactText[]
  >(preSelectedValues);
  const [selectAllChecked, setSelectAllChecked] = useState<boolean>(false);

  useEffect(() => {
    if (preSelectedValues && preSelectedValues.length === allValues.length) {
      setSelectAllChecked(true);
    } else {
      setSelectAllChecked(false);
    }
    setSelectedValues(preSelectedValues);

    // eslint-disable-next-line
  }, [preSelectedValues, allValues]);
  return (
    <Select
      mode={mode === 'multiple' ? 'multiple' : undefined}
      loading={isLoading}
      maxTagCount={0}
      bordered={bordered !== undefined ? bordered : true}
      value={selectedValues}
      placeholder={placeholder}
      suffixIcon={<DownOutlined />}
      showSearch
      maxTagPlaceholder={omittedValues => {
        if (omittedValues.length === allValues.length) {
          return <span>All</span>;
        } else {
          return <span>Selected Items. {omittedValues.length}</span>;
        }
      }}
      className={`customised-dropdown ${className}`}
      onSelect={value => {
        if (isNaN(Number(value.toString()))) {
          setSelectedValues(selectedValues => [
            ...selectedValues,
            ...[value.toString()],
          ]);
        } else {
          setSelectedValues(selectedValues => [
            ...selectedValues,
            ...[Number(value.toString())],
          ]);
        }
        if (onSelect !== undefined) {
          if (isNaN(Number(value.toString()))) {
            onSelect(value.toString());
          } else {
            onSelect(Number(value.toString()));
          }
        }
      }}
      onDeselect={value => {
        if (isNaN(Number(value.toString()))) {
          setSelectedValues(selectedValues =>
            selectedValues.filter((item: any) => item !== value),
          );
        } else {
          setSelectedValues(selectedValues =>
            selectedValues.filter(
              (item: any) => item !== Number(value.toString()),
            ),
          );
        }
        setSelectAllChecked(false);

        if (onDeselect !== undefined) {
          if (isNaN(Number(value.toString()))) {
            onDeselect(value.toString());
          } else {
            onDeselect(Number(value.toString()));
          }
        }
      }}
      filterOption={(input, option) => {
        return (
          option?.children?.toLowerCase()?.indexOf(input?.toLowerCase()) >= 0
        );
      }}
      dropdownRender={menu => {
        return (
          <div>
            {showSelectAll && mode === 'multiple' && (
              <div
                className='select-all'
                style={{
                  display: 'flex',
                  padding: '12px',
                  flexFlow: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: selectAllChecked ? '#e6f7ff' : '#fff',
                  borderBottom: '1px solid #f5f8fb',
                }}
                onClick={() => {
                  if (selectAllChecked) {
                    setSelectedValues([]);
                    if (onSelectAllToggled !== undefined) {
                      onSelectAllToggled([]);
                    }
                  } else {
                    setSelectedValues(allValues);
                    if (onSelectAllToggled !== undefined) {
                      onSelectAllToggled(allValues);
                    }
                  }
                  setSelectAllChecked(!selectAllChecked);
                }}
              >
                <span>All</span>
                <CheckOutlined
                  style={{
                    color: selectAllChecked ? '#1890ff' : '#dce6f1',
                  }}
                />
              </div>
            )}
            {menu}
          </div>
        );
      }}
    >
      {props.children}
    </Select>
  );
};

export default CustomisedDropdown;
