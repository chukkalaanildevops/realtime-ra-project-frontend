import React, { useEffect, useState } from 'react';
import { Select, DatePicker, Button, Row, Col } from 'antd';
import './filters.index.less';
import { DownOutlined } from '@ant-design/icons';
import { SearchableMultiUserDropdown } from '../../../../../../../shared/components';
import moment from 'moment';
import { Trans } from '@lingui/macro';

const DataFilter: React.FC<{
  isVisible: boolean;
  onApplyFilters: (filters: { [key: string]: any }) => void;
  onResetFilters: () => void;
  initialFilters?: { [key: string]: any };
}> = props => {
  const { isVisible, onApplyFilters, onResetFilters, initialFilters } = props;
  const { RangePicker } = DatePicker;
  const [selectedDelegateByUsers, setSelectedDelegateByUsers] = useState<
    number[]
  >([]);
  const [selectedDelegateToUsers, setSelectedDelegateToUsers] = useState<
    number[]
  >([]);
  const [delegationFromDate, setDelegationFromDate] = useState<string | null>(
    null,
  );
  const [delegationToDate, setDelegationToDate] = useState<string | null>(null);
  const [status, setStatus] = useState<string[]>([]);
  const [activeOrNot, setActiveOrNot] = useState<string>('');
  const [dateRange, setDateRange] = useState<
    [moment.Moment, moment.Moment | null] | null
  >(null);

  useEffect(() => {
    if (initialFilters !== undefined) {
      if (initialFilters.delegated_by !== undefined) {
        if (typeof initialFilters.delegated_by === 'number') {
          setSelectedDelegateByUsers([initialFilters.delegated_by]);
        } else {
          setSelectedDelegateByUsers(initialFilters.delegated_by);
        }
      }
      if (initialFilters.delegated_to !== undefined) {
        if (typeof initialFilters.delegated_to === 'number') {
          setSelectedDelegateToUsers([initialFilters.delegated_to]);
        } else {
          setSelectedDelegateToUsers(initialFilters.delegated_to);
        }
      }
      if (initialFilters.status !== undefined) {
        setStatus(initialFilters.status);
      }
      if (initialFilters.is_active !== undefined) {
        setActiveOrNot(initialFilters.is_active);
      }

      let fromDate = null;
      let toDate = null;

      if (initialFilters.from_date !== undefined) {
        fromDate = moment(initialFilters.from_date, 'DD/MM/YYYY');
        setDelegationFromDate(initialFilters.from_date);
      }
      if (initialFilters.to_date !== undefined) {
        toDate = moment(initialFilters.to_date, 'DD/MM/YYYY');
        setDelegationToDate(initialFilters.to_date);
      }
      if (fromDate !== null) {
        setDateRange([fromDate, toDate]);
      }
    }
    // eslint-disable-next-line
  }, []);

  const getDelegatedUsers = (delegateType: string) => {
    return (
      <Col span={8}>
        <div className='filter-option'>
          <div className='label'>{`Delegated ${delegateType}`}</div>
          <div className='picker'>
            <SearchableMultiUserDropdown
              bordered={false}
              preSelectedValues={
                delegateType === 'by'
                  ? selectedDelegateByUsers
                  : selectedDelegateToUsers
              }
              placeholder=''
              onSelect={(value: number) => {
                if (delegateType === 'by') {
                  setSelectedDelegateByUsers(selectedDelegateByUsers =>
                    selectedDelegateByUsers.concat(value),
                  );
                } else if (delegateType === 'to') {
                  setSelectedDelegateToUsers(selectedDelegateToUsers =>
                    selectedDelegateToUsers.concat(value),
                  );
                }
              }}
              onDeselect={(value: number) => {
                if (delegateType === 'by') {
                  setSelectedDelegateByUsers(selectedDelegateByUsers =>
                    selectedDelegateByUsers.filter(
                      (item: number) => item !== value,
                    ),
                  );
                } else if (delegateType === 'to') {
                  setSelectedDelegateToUsers(selectedDelegateToUsers =>
                    selectedDelegateToUsers.filter(
                      (item: number) => item !== value,
                    ),
                  );
                }
              }}
            />
          </div>
        </div>
      </Col>
    );
  };

  const getStatus = () => {
    const { Option } = Select;

    return (
      <div className='filter-option'>
        <div className='label'>
          <Trans>Status</Trans>
        </div>
        <div className='picker'>
          <Select
            bordered={false}
            allowClear={true}
            value={status}
            mode='multiple'
            suffixIcon={<DownOutlined />}
            onChange={value => {
              setStatus(value);
            }}
          >
            <Option key='PENDNG' value='PENDNG'>
              <Trans>Pending</Trans>
            </Option>
            <Option key='APPRVD' value='APPRVD'>
              <Trans>Approved</Trans>
            </Option>
            <Option key='REJCTD' value='REJCTD'>
              <Trans>Rejected</Trans>
            </Option>
            <Option key='EXPRED' value='EXPRED'>
              <Trans>Expired</Trans>
            </Option>
          </Select>
        </div>
      </div>
    );
  };

  const getActiveOrNot = () => {
    const { Option } = Select;

    return (
      <div className='filter-option'>
        <div className='label'>
          <Trans>Active</Trans>
        </div>
        <div className='picker'>
          <Select
            bordered={false}
            allowClear={true}
            value={activeOrNot}
            onChange={value => {
              setActiveOrNot(value);
            }}
          >
            <Option key='yes' value='yes'>
              <Trans>Yes</Trans>
            </Option>
            <Option key='no' value='no'>
              <Trans>No</Trans>
            </Option>
          </Select>
        </div>
      </div>
    );
  };

  const getFilterData = () => {
    let filters: { [key: string]: any } = {};

    if (selectedDelegateByUsers?.length > 0) {
      filters.delegated_by = selectedDelegateByUsers;
    }
    if (selectedDelegateToUsers?.length > 0) {
      filters.delegated_to = selectedDelegateToUsers;
    }
    if (delegationFromDate) {
      filters.from_date = delegationFromDate;
    }
    if (delegationToDate) {
      filters.to_date = delegationToDate;
    }
    if (status?.length > 0) {
      filters.status = status.join(',');
    }
    if (activeOrNot) {
      filters.is_active = activeOrNot;
    }
    return filters;
  };

  return (
    <div
      className={
        isVisible ? 'filter-delegation active' : 'filter-delegation hidden'
      }
    >
      <Row gutter={16}>
        {getDelegatedUsers('by')}
        {getDelegatedUsers('to')}
      </Row>
      <Row gutter={16}>
        <Col span={8}>
          <div className='filter-option'>
            <div className='label'>
              <Trans>Delegation Date</Trans>
            </div>
            <div className='picker'>
              <RangePicker
                size='small'
                bordered={false}
                allowClear={true}
                allowEmpty={[false, true]}
                suffixIcon={<DownOutlined />}
                placeholder={['From', 'To']}
                format='DD/MM/YYYY'
                value={
                  dateRange !== null && dateRange.length > 0 ? dateRange : null
                }
                onChange={(dates, dateStrings) => {
                  if (dateStrings.length > 0) {
                    let fromDate = null;
                    let toDate = null;
                    if (dateStrings[0].length > 0) {
                      setDelegationFromDate(dateStrings[0]);
                      fromDate = moment(dateStrings[0], 'DD/MM/YYYY');
                    } else {
                      setDelegationFromDate(null);
                    }
                    if (dateStrings[1].length > 0) {
                      setDelegationToDate(dateStrings[1]);
                      toDate = moment(dateStrings[1], 'DD/MM/YYYY');
                    } else {
                      setDelegationToDate(null);
                    }

                    if (fromDate !== null) {
                      setDateRange([fromDate, toDate]);
                    } else {
                      setDateRange(null);
                    }
                  } else {
                    setDelegationFromDate(null);
                    setDelegationToDate(null);
                    setDateRange(null);
                  }
                }}
              />
            </div>
          </div>
        </Col>
        <Col span={8}>{getStatus()}</Col>
        <Col span={8}>{getActiveOrNot()}</Col>
      </Row>
      <div className='buttons'>
        <div className='apply-filter-button'>
          <Button
            type='primary'
            onClick={event => {
              let filters: { [key: string]: any } = getFilterData();
              onApplyFilters(filters);
            }}
          >
            <Trans>Filter</Trans>
          </Button>
        </div>

        <div className='reset-filter-button'>
          <Button
            type='default'
            onClick={event => {
              setSelectedDelegateByUsers([]);
              setSelectedDelegateToUsers([]);
              setDelegationFromDate(null);
              setDelegationToDate(null);
              setDateRange(null);
              setStatus([]);
              setActiveOrNot('');
              onResetFilters();
            }}
          >
            <Trans>Reset</Trans>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DataFilter;
