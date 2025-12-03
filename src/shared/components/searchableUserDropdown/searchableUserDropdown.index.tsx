import { message, Select, Form } from 'antd';
import { AxiosResponse } from 'axios';
import React, { ReactText, useEffect, useState } from 'react';
import { ElementOrSkeleton } from '..';
import { fetchUsersService } from '../../../services/users';
import { SearchOutlined } from '@ant-design/icons';
import './searchableUserDropdown.index.less';
import Axios from 'axios';

let CancelToken = Axios.CancelToken;
let CancelRequest: Function;

const SearchableUserDropdown: React.FC<{
  isFormField: boolean;
  fieldName?: string;
  value?: number | null | undefined;
  onChange?: (value: any) => void;
  selectedUser?: { [key: string]: any };
  placeholder?: string;
  isDisable?: boolean;
}> = props => {
  const {
    isFormField,
    fieldName,
    value,
    onChange,
    selectedUser,
    placeholder,
    isDisable = false,
  } = props;

  const [users, setUsers] = useState<{ [key: string]: any }[]>(
    selectedUser !== undefined && selectedUser !== null ? [selectedUser] : [],
  );
  const [dropdownProps, setDropdownProps] = useState<{
    isLoading: boolean;
    value: number | null;
  }>({
    isLoading: false,
    value: value !== null && value !== undefined ? value : null,
  });

  const fetchUsers = async (q: string) => {
    if (q.trim().length > 0) {
      try {
        // eslint-disable-next-line no-unused-expressions
        CancelRequest?.('cancelled');
        CancelToken = Axios.CancelToken;

        const response: AxiosResponse = await fetchUsersService(true, true, q, {
          cancelToken: new CancelToken(function executor(c) {
            CancelRequest = c;
          }),
        });
        if (selectedUser !== undefined && selectedUser !== null) {
          setUsers([...response.data, ...[selectedUser]]);
        } else {
          setUsers(response.data);
        }
      } catch (error) {
        if (error.message !== 'cancelled')
          message.error(error.response.data.error);
      }
    }
  };

  const { Option } = Select;
  const options = users.map((user: { [key: string]: any }) => {
    return (
      <Option value={user.id} key={user.id}>
        {user?.legal_name || user?.name} ({user.username})
      </Option>
    );
  });

  return (
    <ElementOrSkeleton
      isLoading={dropdownProps.isLoading}
      isActive={true}
      type='input'
    >
      {isFormField ? (
        <Form.Item name={fieldName} noStyle>
          <Select
            loading={dropdownProps.isLoading}
            showSearch={true}
            allowClear={true}
            filterOption={false}
            notFoundContent={null}
            value={
              dropdownProps.value !== null ? dropdownProps.value : undefined
            }
            onSelect={value => {
              setDropdownProps({
                isLoading: false,
                value: parseInt(value.toString()),
              });
              if (onChange !== undefined) {
                onChange(value);
              }
            }}
            disabled={isDisable}
            onSearch={(value: string) => fetchUsers(value)}
            placeholder={placeholder ? placeholder : 'Search Employee eg. Ann'}
          >
            {options}
          </Select>
        </Form.Item>
      ) : (
        <Select
          loading={dropdownProps.isLoading}
          showSearch={true}
          allowClear={true}
          filterOption={false}
          notFoundContent={null}
          value={dropdownProps.value !== null ? dropdownProps.value : undefined}
          onSelect={value => {
            setDropdownProps({
              isLoading: false,
              value: parseInt(value.toString()),
            });
            if (onChange !== undefined) {
              onChange(value);
            }
          }}
          disabled={isDisable}
          onSearch={(value: string) => fetchUsers(value)}
          placeholder={placeholder ? placeholder : 'Search Employee eg. Ann'}
        >
          {options}
        </Select>
      )}
    </ElementOrSkeleton>
  );
};

const SearchableMultiUserDropdown: React.FC<{
  from?: string;
  placeholder?: string;
  className?: string;
  bordered?: boolean;
  preSelectedValues: (string | number)[];
  onSelect?: (value: number) => void;
  onDeselect?: (value: number) => void;
  valuesToExclude?: any;
  onSelectAll?: any;
  onDeselectAll?: any;
}> = props => {
  const {
    from,
    placeholder,
    className,
    bordered,
    preSelectedValues,
    onSelect,
    onDeselect,
    valuesToExclude = [],
    onSelectAll,
    onDeselectAll,
  } = props;

  const [users, setUsers] = useState<{ [key: string]: any }[]>([]);
  const [selectedValues, setSelectedValues] = useState<number[] | ReactText[]>(
    preSelectedValues,
  );
  const [searchedStatus, setSearchedStatus] = useState<any>(false);
  const [selectedOptions, setSelectedOptions] = useState<
    {
      [key: string]: any;
    }[]
  >([]);

  useEffect(() => {
    from === 'role' ? fetchUsers() : fetchUsers('a');
    setSelectedValues(preSelectedValues);
    // eslint-disable-next-line
  }, [preSelectedValues]);

  const fetchUsers = async (q?: string) => {
    if (from === 'role') {
      try {
        // eslint-disable-next-line no-unused-expressions
        CancelRequest?.('cancelled');
        CancelToken = Axios.CancelToken;

        const response: AxiosResponse = q
          ? await fetchUsersService(true, true, q, {
              cancelToken: new CancelToken(function executor(c) {
                CancelRequest = c;
              }),
            })
          : await fetchUsersService(true, true);
        q ? setSearchedStatus(true) : setSearchedStatus(false);
        let _users = response?.data?.filter(
          (user: any) =>
            user.is_active &&
            !valuesToExclude
              ?.map((option: any) => option.id)
              ?.includes(user.id),
        );
        setUsers([..._users]);
      } catch (error) {
        if (error?.message !== 'cancelled')
          message.error(error?.response?.data?.error);
      }
    } else {
      if (q && q.trim().length > 0) {
        try {
          // eslint-disable-next-line no-unused-expressions
          CancelRequest?.('cancelled');
          CancelToken = Axios.CancelToken;
          const response: AxiosResponse = await fetchUsersService(
            true,
            true,
            q,
            {
              cancelToken: new CancelToken(function executor(c) {
                CancelRequest = c;
              }),
            },
          );
          let users = response?.data?.filter(
            (item: any) =>
              selectedOptions
                ?.map((option: any) => option.id)
                ?.includes(item.id) === false,
          );

          let _users = users?.filter((user: any) => user.is_active);
          setUsers([...selectedOptions, ..._users]);
        } catch (error) {
          if (error?.message !== 'cancelled')
            message.error(error?.response?.data?.error);
        }
      }
    }
  };

  const { Option } = Select;

  const usersList = users.sort((a: any, b: any) => {
    const usersNameA = a?.legal_name ? a?.legal_name : a?.name;
    const usersNameB = b?.legal_name ? b?.legal_name : b?.name;

    return usersNameA.localeCompare(usersNameB);
  });

  const options = usersList.map((user: { [key: string]: any }) => {
    return (
      <Option value={user.id} key={user.id}>
        {user?.legal_name || user?.name} ({user.username})
      </Option>
    );
  });

  return (
    <Select
      mode='multiple'
      maxTagCount={0}
      bordered={bordered !== undefined ? bordered : true}
      value={selectedValues}
      placeholder={placeholder ? placeholder : 'Search Employee eg. Ann'}
      filterOption={false}
      notFoundContent={null}
      maxTagPlaceholder={omittedValues => {
        return <span>Selected. {omittedValues.length}</span>;
      }}
      style={{ width: '100%' }}
      className={`customised-dropdown multi-select ${
        className !== undefined ? className : ''
      }`}
      suffixIcon={<SearchOutlined />}
      onSelect={(value, _option) => {
        if (value === 'Select All') {
          const selectedData = users.map(option => option.id);
          setSelectedValues([...selectedData]);
          setSelectedOptions([...users]);
          if (onSelectAll !== undefined) {
            onSelectAll(selectedData);
          }
        } else if (value === 'Deselect All') {
          setSelectedValues([]);
          setSelectedOptions([]);
          if (onDeselectAll !== undefined) {
            onDeselectAll();
          }
        } else {
          setSelectedValues(selectedValues => [
            ...selectedValues,
            parseInt(value.toString()),
          ]);

          setSelectedOptions(selectedOptions => [
            ...selectedOptions,
            ...users.filter(
              (user: any) => user.id === parseInt(value.toString()),
            ),
          ]);

          if (onSelect !== undefined) {
            onSelect(parseInt(value.toString()));
          }
        }
      }}
      onDeselect={value => {
        setSelectedValues(selectedValues =>
          selectedValues.filter(
            (item: any) => item !== parseInt(value.toString()),
          ),
        );

        setSelectedOptions(selectedOptions =>
          selectedOptions.filter(
            (option: any) => option.id !== parseInt(value.toString()),
          ),
        );

        if (onDeselect !== undefined) {
          onDeselect(parseInt(value.toString()));
        }
      }}
      showSearch={true}
      onSearch={(value: string) => {
        fetchUsers(value);
      }}
    >
      {!searchedStatus && from === 'role' ? (
        selectedValues.length === users.length ? (
          <Option value='Deselect All' key='Deselect All'>
            Deselect All
          </Option>
        ) : (
          <Option value='Select All' key='Select All'>
            Select All
          </Option>
        )
      ) : (
        <></>
      )}
      {options}
    </Select>
  );
};

export { SearchableUserDropdown, SearchableMultiUserDropdown };
