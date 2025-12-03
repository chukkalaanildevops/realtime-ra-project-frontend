/* eslint-disable no-unused-expressions */
/* eslint-disable array-callback-return */
import React from 'react';
import moment, { Moment } from 'moment';
import { Trans } from '@lingui/macro';

import { ColumnsType, ColumnType } from 'antd/lib/table';
import { Tag } from 'antd';
import { DeleteOutlined, EllipsisOutlined } from '@ant-design/icons';

import { DotMenu } from '../../../shared/components';

const getBasicInfoColumn = (
  onDeleteButtonClick: any,
  permissions: any,
  logDetailData: any,
) => {
  let columns: ColumnsType<any> = [
    {
      title: <Trans>Effective From</Trans>,
      key: 'effective_from',
      dataIndex: 'effective_from',
      align: 'center',
      render: (data: any) => data || '-',
    },
    {
      title: <Trans>First Name</Trans>,
      key: 'first_name',
      dataIndex: 'first_name',
      align: 'center',
      render: (data: any) => data || '-',
    },
    {
      title: <Trans>Middle Name</Trans>,
      key: 'middle_name',
      dataIndex: 'middle_name',
      align: 'center',
      render: (data: any) => data || '-',
    },
    {
      title: <Trans>Last Name</Trans>,
      key: 'last_name',
      dataIndex: 'last_name',
      align: 'center',
      render: (data: any) => data || '-',
    },
    {
      title: <Trans>Legal Name</Trans>,
      key: 'legal_name',
      dataIndex: 'legal_name',
      align: 'center',
      render: (data: any) => data || '-',
    },
    {
      title: <Trans>Username</Trans>,
      key: 'username',
      dataIndex: 'username',
      align: 'center',
      render: (data: any) => data || '-',
    },
    {
      title: <Trans>Email</Trans>,
      key: 'email',
      dataIndex: 'email',
      align: 'center',
      render: (data: any) => data || '-',
    },
    {
      title: <Trans>Date Of Birth</Trans>,
      key: 'date_of_birth',
      dataIndex: 'date_of_birth',
      render: (data: any) => data || '-',
      align: 'center',
    },
    {
      title: <Trans>Marital Status</Trans>,
      key: 'marital_status',
      dataIndex: 'marital_status',
      align: 'center',
      render: (status: any) => <span>{status?.title || '-'}</span>,
    },
    {
      title: <Trans>Gender</Trans>,
      key: 'gender',
      dataIndex: 'gender',
      align: 'center',
      render: (gender: any) => <span>{gender?.title || '-'}</span>,
    },
    {
      title: <Trans>Created On</Trans>,
      key: 'created_on',
      dataIndex: 'created_on',
      render: (text: Moment) => {
        return text
          ? moment.isMoment(text)
            ? text.format('DD/MM/YYYY')
            : moment(text, ['DD/MM/YYYY', 'DD-MM-YYYY']).format('DD/MM/YYYY') ||
              '-'
          : '-';
      },
      align: 'center',
    },
    {
      title: <Trans>Modified On</Trans>,
      key: 'modified_on',
      dataIndex: 'modified_on',
      render: (text: Moment) =>
        text
          ? moment.isMoment(text)
            ? text.format('DD/MM/YYYY')
            : moment(text, ['DD/MM/YYYY', 'DD-MM-YYYY']).format('DD/MM/YYYY') ||
              '-'
          : '-',
      align: 'center',
    },
  ];

  if (permissions.ACTION_SF_USERS_DETAILS) {
    let column: ColumnType<any> = {
      title: <Trans>Action</Trans>,
      dataIndex: '',
      key: 'action',
      align: 'center' as 'center',
      width: 10,
      fixed: 'right' as 'right',
      render: (_val: string, _item: any, _index: number) => (
        <DotMenu
          actionBtn={[
            {
              children: <Trans>Delete</Trans>,
              Type: 'default',
              icon: DeleteOutlined,
              Disabled: logDetailData?.length === 1 ? true : false,
              OnClick: () => {
                onDeleteButtonClick(_item.id, _item.employee.id);
              },
            },
          ]}
        >
          <EllipsisOutlined />
        </DotMenu>
      ),
    };
    columns.push(column);
  }
  return columns;
};
const getJobInfoColumn = (
  logData: any,
  onDeleteButtonClick: any,
  permissions: any,
  logDetailData: any,
) => {
  let columns: ColumnsType<any> = [
    {
      title: <Trans>Effective From</Trans>,
      key: 'effective_from',
      dataIndex: 'effective_from',
      align: 'center',
      render: (data: any) => data || '-',
    },
    {
      title: <Trans>Termination Date</Trans>,
      key: 'termination_date',
      dataIndex: 'termination_date',
      align: 'center',
      render: (data: any) => data || '-',
    },
    {
      title: <Trans>Hire Date</Trans>,
      key: 'hire_date',
      dataIndex: 'hire_date',
      render: (data: any) => data || '-',
      align: 'center',
    },
    {
      title: <Trans>Manager</Trans>,
      key: 'manager',
      dataIndex: 'manager',
      render: (data: any) =>
        data ? (
          <span>
            {data?.name} ({data?.username})
          </span>
        ) : (
          '-'
        ),
      align: 'center',
    },
    {
      title: <Trans>Cost Centre</Trans>,
      key: 'cost_centre',
      dataIndex: 'cost_centre',
      align: 'center',
      render: (data: any) =>
        data ? (
          <span>
            {data?.title} (Type: {data?.cost_centre_type?.title}, Active:
            {data?.is_active ? 'True' : 'False'}, Code: {data?.code})
          </span>
        ) : (
          '-'
        ),
    },
    {
      title: logData?.company?.legal_entity_type?.display_text || (
        <Trans>Company</Trans>
      ),
      key: 'company',
      dataIndex: 'company',
      align: 'center',
      render: (data: any) =>
        data ? (
          <span>
            {data?.title} ({data?.code})
          </span>
        ) : (
          '-'
        ),
    },
    {
      title: logData?.division?.legal_entity_type?.display_text || (
        <Trans>Division</Trans>
      ),
      key: 'division',
      dataIndex: 'division',
      align: 'center',
      render: (data: any) =>
        data ? (
          <span>
            {data?.title} ({data?.code})
          </span>
        ) : (
          '-'
        ),
    },
    {
      title: logData?.department?.legal_entity_type?.display_text || (
        <Trans>Department</Trans>
      ),
      key: 'department',
      dataIndex: 'department',
      align: 'center',
      render: (data: any) =>
        data?.title && data?.code ? (
          <span>
            {data?.title} ({data?.code})
          </span>
        ) : (
          '-'
        ),
    },
    {
      title: logData?.business_unit?.legal_entity_type?.display_text || (
        <Trans>Business Unit</Trans>
      ),
      key: 'business_unit',
      dataIndex: 'business_unit',
      align: 'center',
      render: (data: any) =>
        data?.title && data?.code ? (
          <span>
            {data?.title} ({data?.code})
          </span>
        ) : (
          '-'
        ),
    },
    {
      title: <Trans>Event Name</Trans>,
      key: 'reason',
      dataIndex: 'reason',
      align: 'center',
      render: (data: any) => <span>{data?.event_name || '-'}</span>,
    },
    {
      title: <Trans>Event Reason</Trans>,
      key: 'reason',
      dataIndex: 'reason',
      align: 'center',
      render: (data: any) => <span>{data?.event_reason || '-'}</span>,
    },
    {
      title: <Trans>Position</Trans>,
      key: 'position',
      dataIndex: 'position',
      align: 'center',
      render: (data: any) => data || '-',
    },
    {
      title: <Trans>Pay Grade</Trans>,
      key: 'pay_grade',
      dataIndex: 'pay_grade',
      align: 'center',
      render: (data: any) => <span>{data?.title || '-'}</span>,
    },
    {
      title: <Trans>Employee Group</Trans>,
      key: 'employee_group',
      dataIndex: 'employee_group',
      align: 'center',
      render: (data: any) => <span>{data?.title || '-'}</span>,
    },
    {
      title: <Trans>Employee Sub Group</Trans>,
      key: 'employee_sub_group',
      dataIndex: 'employee_sub_group',
      align: 'center',
      render: (data: any) => <span>{data?.title || '-'}</span>,
    },
    {
      title: <Trans>Location</Trans>,
      key: 'location',
      dataIndex: 'location',
      align: 'center',
      render: (data: any) => data || '-',
    },
    {
      title: <Trans>Contract Type</Trans>,
      key: 'contract_type',
      dataIndex: 'contract_type',
      align: 'center',
      render: (data: any) => data?.title || '-',
    },
    {
      title: <Trans>Contract Start Date</Trans>,
      key: 'contract_start_date',
      dataIndex: 'contract_start_date',
      align: 'center',
      render: (data: any) => data || '-',
    },
    {
      title: <Trans>Contract End Date</Trans>,
      key: 'contract_end_date',
      dataIndex: 'contract_end_date',
      align: 'center',
      render: (data: any) => data || '-',
    },
    {
      title: <Trans>Confirmation Date</Trans>,
      key: 'confirmation_date',
      dataIndex: 'confirmation_date',
      align: 'center',
      render: (data: any) => data || '-',
    },
    {
      title: <Trans>Geofence Enabled?</Trans>,
      key: 'is_enabled_geofence',
      dataIndex: 'is_enabled_geofence',
      align: 'center',
      render: (data: any) =>
        data ? (
          <Tag color='success'>
            <Trans>Active</Trans>
          </Tag>
        ) : (
          <Tag color='error'>
            <Trans>Inactive</Trans>
          </Tag>
        ),
    },
    {
      title: <Trans>WFH Enabled?</Trans>,
      key: 'is_enabled_wfh',
      dataIndex: 'is_enabled_wfh',
      align: 'center',
      render: (data: any) =>
        data ? (
          <Tag color='success'>
            <Trans>Active</Trans>
          </Tag>
        ) : (
          <Tag color='error'>
            <Trans>Inactive</Trans>
          </Tag>
        ),
    },
    {
      title: <Trans>Offline Enabled?</Trans>,
      key: 'is_enabled_offline',
      dataIndex: 'is_enabled_offline',
      align: 'center',
      render: (data: any) =>
        data ? (
          <Tag color='success'>
            <Trans>Active</Trans>
          </Tag>
        ) : (
          <Tag color='error'>
            <Trans>Inactive</Trans>
          </Tag>
        ),
    },
    {
      title: <Trans>QR Scan Enabled?</Trans>,
      key: 'is_enabled_qr_scan',
      dataIndex: 'is_enabled_qr_scan',
      align: 'center',
      render: (data: any) =>
        data ? (
          <Tag color='success'>
            <Trans>Active</Trans>
          </Tag>
        ) : (
          <Tag color='error'>
            <Trans>Inactive</Trans>
          </Tag>
        ),
    },
    {
      title: <Trans>Time Recording Variant</Trans>,
      key: 'time_recording_variant',
      dataIndex: 'time_recording_variant',
      align: 'center',
      render: (data: any) => <span>{data?.title || '-'}</span>,
    },
    {
      title: <Trans>Timesheet Supervisor</Trans>,
      key: 'timesheet_supervisor',
      dataIndex: 'timesheet_supervisor',
      align: 'center',
      render: (data: any) => data || '-',
    },
    {
      title: <Trans>Work Schedule</Trans>,
      key: 'work_schedule',
      dataIndex: 'work_schedule',
      align: 'center',
      render: (data: any) => data || '-',
    },
    {
      title: <Trans>Working Hours</Trans>,
      key: 'working_hours',
      dataIndex: 'working_hours',
      align: 'center',
      render: (data: any) => data || '-',
    },
    {
      title: <Trans>Created On</Trans>,
      key: 'created_on',
      dataIndex: 'created_on',
      render: (text: Moment) => {
        return text
          ? moment.isMoment(text)
            ? text.format('DD/MM/YYYY')
            : moment(text, ['DD/MM/YYYY', 'DD-MM-YYYY']).format('DD/MM/YYYY') ||
              '-'
          : '-';
      },
      align: 'center',
    },
    {
      title: <Trans>Modified On</Trans>,
      key: 'modified_on',
      dataIndex: 'modified_on',
      render: (text: Moment) =>
        text
          ? moment.isMoment(text)
            ? text.format('DD/MM/YYYY')
            : moment(text, ['DD/MM/YYYY', 'DD-MM-YYYY']).format('DD/MM/YYYY') ||
              '-'
          : '-',
      align: 'center',
    },
  ];

  if (permissions.ACTION_SF_USERS_DETAILS) {
    let column: ColumnType<any> = {
      title: <Trans>Action</Trans>,
      dataIndex: '',
      key: 'action',
      align: 'center' as 'center',
      width: 10,
      fixed: 'right' as 'right',
      render: (_val: string, _item: any, _index: number) => (
        <DotMenu
          actionBtn={[
            {
              children: <Trans>Delete</Trans>,
              Type: 'default',
              icon: DeleteOutlined,
              Disabled: logDetailData?.length === 1 ? true : false,
              OnClick: () => {
                onDeleteButtonClick(_item.id, _item.employee.id);
              },
            },
          ]}
        >
          <EllipsisOutlined />
        </DotMenu>
      ),
    };
    columns.push(column);
  }
  return columns;
};
const getBankInfoColumn = (
  onDeleteButtonClick: any,
  permissions: any,
  logDetailData: any,
) => {
  let columns: ColumnsType<any> = [
    {
      title: <Trans>Effective From</Trans>,
      key: 'effective_from',
      dataIndex: 'effective_from',
      align: 'center',
      render: (data: any) => data || '-',
    },

    {
      title: <Trans>Bank Name</Trans>,
      key: 'bank_name',
      dataIndex: 'bank_name',
      align: 'center',
      render: (data: any) => data || '-',
    },
    {
      title: <Trans>Bank Key</Trans>,
      key: 'bank_key',
      dataIndex: 'bank_key',
      align: 'center',
      render: (data: any) => data || '-',
    },
    {
      title: <Trans>Branch Name</Trans>,
      key: 'branch_name',
      dataIndex: 'branch_name',
      align: 'center',
      render: (data: any) => data || '-',
    },
    {
      title: <Trans>Swift Code</Trans>,
      key: 'swift_code',
      dataIndex: 'swift_code',
      align: 'center',
      render: (data: any) => data || '-',
    },
    {
      title: <Trans>Bank Account Number</Trans>,
      key: 'bank_account_number',
      dataIndex: 'bank_account_number',
      align: 'center',
      render: (data: any) => data || '-',
    },
    {
      title: <Trans>Account Holder Name</Trans>,
      key: 'account_holder_name',
      dataIndex: 'account_holder_name',
      render: (data: any) => data || '-',
      align: 'center',
    },
    {
      title: <Trans>Payment Detail</Trans>,
      key: 'payment_detail',
      dataIndex: 'payment_detail',
      align: 'center',
      render: (data: any) => data || '-',
    },
    {
      title: <Trans>Created On</Trans>,
      key: 'created_on',
      dataIndex: 'created_on',
      render: (text: Moment) => {
        return text
          ? moment.isMoment(text)
            ? text.format('DD/MM/YYYY')
            : moment(text, ['DD/MM/YYYY', 'DD-MM-YYYY']).format('DD/MM/YYYY') ||
              '-'
          : '-';
      },
      align: 'center',
    },
    {
      title: <Trans>Modified On</Trans>,
      key: 'modified_on',
      dataIndex: 'modified_on',
      render: (text: Moment) =>
        text
          ? moment.isMoment(text)
            ? text.format('DD/MM/YYYY')
            : moment(text, ['DD/MM/YYYY', 'DD-MM-YYYY']).format('DD/MM/YYYY') ||
              '-'
          : '-',
      align: 'center',
    },
  ];

  if (permissions.ACTION_SF_USERS_DETAILS) {
    let column: ColumnType<any> = {
      title: <Trans>Action</Trans>,
      dataIndex: '',
      key: 'action',
      align: 'center' as 'center',
      width: 10,
      fixed: 'right' as 'right',
      render: (_val: string, _item: any, _index: number) => (
        <DotMenu
          actionBtn={[
            {
              children: <Trans>Delete</Trans>,
              Type: 'default',
              icon: DeleteOutlined,
              Disabled: logDetailData?.length === 1 ? true : false,
              OnClick: () => {
                onDeleteButtonClick(_item.id, _item.employee.id);
              },
            },
          ]}
        >
          <EllipsisOutlined />
        </DotMenu>
      ),
    };
    columns.push(column);
  }
  return columns;
};
const getApproverColumn = (
  onDeleteButtonClick: any,
  permissions: any,
  logDetailData: any,
) => {
  let columns: ColumnsType<any> = [
    {
      title: <Trans>Effective From</Trans>,
      key: 'effective_from',
      dataIndex: 'effective_from',
      align: 'center',
      render: (data: any) => data || '-',
    },

    {
      title: <Trans>Approver 1</Trans>,
      key: 'approver_1',
      dataIndex: 'approver_1',
      align: 'center',
      render: (data: any) =>
        data ? (
          <span>
            Name: {data?.name || '-'}, Status:{' '}
            {data?.is_active ? 'Active' : 'INACTIVE'}, UserName:
            {data?.username || '-'}
          </span>
        ) : (
          '-'
        ),
    },
    {
      title: <Trans>Approver 2</Trans>,
      key: 'approver_2',
      dataIndex: 'approver_2',
      align: 'center',
      render: (data: any) =>
        data ? (
          <span>
            <Trans>Name</Trans>: {data?.name || '-'}, <Trans>Status</Trans>:{' '}
            {data?.is_active ? 'Active' : 'INACTIVE'}, <Trans>UserName</Trans>:
            {data?.username || '-'}
          </span>
        ) : (
          '-'
        ),
    },
    {
      title: <Trans>Approver 3</Trans>,
      key: 'approver_3',
      dataIndex: 'approver_3',
      align: 'center',
      render: (data: any) =>
        data ? (
          <span>
            <Trans>Name</Trans>: {data?.name || '-'}, <Trans>Status</Trans>:{' '}
            {data?.is_active ? 'Active' : 'INACTIVE'}, <Trans>UserName</Trans>:
            {data?.username || '-'}
          </span>
        ) : (
          '-'
        ),
    },
    {
      title: <Trans>Approver 4</Trans>,
      key: 'approver_4',
      dataIndex: 'approver_4',
      align: 'center',
      render: (data: any) =>
        data ? (
          <span>
            <Trans>Name</Trans>: {data?.name || '-'}, <Trans>Status</Trans>:{' '}
            {data?.is_active ? 'Active' : 'INACTIVE'}, <Trans>UserName</Trans>:
            {data?.username || '-'}
          </span>
        ) : (
          '-'
        ),
    },
    {
      title: <Trans>Approver 5</Trans>,
      key: 'approver_5',
      dataIndex: 'approver_5',
      align: 'center',
      render: (data: any) =>
        data ? (
          <span>
            <Trans>Name</Trans>: {data?.name || '-'}, <Trans>Status</Trans>:{' '}
            {data?.is_active ? 'Active' : 'INACTIVE'}, <Trans>UserName</Trans>:
            {data?.username || '-'}
          </span>
        ) : (
          '-'
        ),
    },
    {
      title: <Trans>Created On</Trans>,
      key: 'created_on',
      dataIndex: 'created_on',
      render: (text: Moment) => {
        return text
          ? moment.isMoment(text)
            ? text.format('DD/MM/YYYY')
            : moment(text, ['DD/MM/YYYY', 'DD-MM-YYYY']).format('DD/MM/YYYY') ||
              '-'
          : '-';
      },
      align: 'center',
    },
    {
      title: <Trans>Modified On</Trans>,
      key: 'modified_on',
      dataIndex: 'modified_on',
      render: (text: Moment) =>
        text
          ? moment.isMoment(text)
            ? text.format('DD/MM/YYYY')
            : moment(text, ['DD/MM/YYYY', 'DD-MM-YYYY']).format('DD/MM/YYYY') ||
              '-'
          : '-',
      align: 'center',
    },
  ];

  if (permissions.ACTION_SF_USERS_DETAILS) {
    let column: ColumnType<any> = {
      title: <Trans>Action</Trans>,
      dataIndex: '',
      key: 'action',
      align: 'center' as 'center',
      width: 10,
      fixed: 'right' as 'right',
      render: (_val: string, _item: any, _index: number) => (
        <DotMenu
          actionBtn={[
            {
              children: <Trans>Delete</Trans>,
              Type: 'default',
              icon: DeleteOutlined,
              Disabled: logDetailData?.length === 1 ? true : false,
              OnClick: () => {
                onDeleteButtonClick(_item.id, _item.employee.id);
              },
            },
          ]}
        >
          <EllipsisOutlined />
        </DotMenu>
      ),
    };
    columns.push(column);
  }
  return columns;
};

const getEmployeeApproverCustomFieldsColumn = (
  onDeleteButtonClick: any,
  permissions: any,
  employeeApproversCFData: any,
  approversCustomFieldsListData: any,
) => {
  let DynamicColumns: ColumnsType<any> = [];
  let columns: ColumnsType<any> = [
    {
      title: <Trans>Effective From</Trans>,
      key: 'effective_from',
      dataIndex: 'effective_from',
      align: 'center',
      render: (data: any) => data || '-',
    },
  ];
  if (approversCustomFieldsListData?.length > 0) {
    let titleList: any = [];

    approversCustomFieldsListData.map((item: any) => {
      titleList.push(item?.title);
    });

    titleList.map((titleName: any) => {
      DynamicColumns.push({
        title: titleName,
        key: titleName,
        dataIndex: titleName,
        align: 'center',
        render: (data: any) =>
          data?.approver ? (
            <span>
              <Trans>Name</Trans>: {data?.approver?.name || '-'},{' '}
              <Trans>Status</Trans>:{' '}
              {data?.approver?.is_active ? 'Active' : 'INACTIVE'},{' '}
              <Trans>UserName</Trans>:{data?.approver?.username || '-'}
            </span>
          ) : (
            '-'
          ),
      });
    });
    columns = [
      ...columns,
      ...DynamicColumns,
      {
        title: <Trans>Created On</Trans>,
        key: 'created_on',
        dataIndex: 'created_on',
        render: (text: Moment) => {
          return text
            ? moment.isMoment(text)
              ? text.format('DD/MM/YYYY')
              : moment(text, ['DD/MM/YYYY', 'DD-MM-YYYY']).format(
                  'DD/MM/YYYY',
                ) || '-'
            : '-';
        },
        align: 'center',
      },
      {
        title: <Trans>Modified On</Trans>,
        key: 'modified_on',
        dataIndex: 'modified_on',
        render: (text: Moment) =>
          text
            ? moment.isMoment(text)
              ? text.format('DD/MM/YYYY')
              : moment(text, ['DD/MM/YYYY', 'DD-MM-YYYY']).format(
                  'DD/MM/YYYY',
                ) || '-'
            : '-',
        align: 'center',
      },
    ];
  }
  if (permissions.ACTION_SF_USERS_DETAILS) {
    let column: ColumnType<any> = {
      title: <Trans>Action</Trans>,
      dataIndex: '',
      key: 'action',
      align: 'center' as 'center',
      width: 10,
      fixed: 'right' as 'right',
      render: (_val: string, _item: any, _index: number) => (
        <DotMenu
          actionBtn={[
            {
              children: <Trans>Delete</Trans>,
              Type: 'default',
              icon: DeleteOutlined,
              Disabled: employeeApproversCFData?.length === 1 ? true : false,
              OnClick: () => {
                onDeleteButtonClick(_item.id, _item.employee.id);
              },
            },
          ]}
        >
          <EllipsisOutlined />
        </DotMenu>
      ),
    };
    columns.push(column);
  }
  return columns;
};

const getDependentInfoColumn = (
  onDeleteButtonClick: any,
  permissions: any,
  dependentInfoCFListData: any,
) => {
  let DynamicColumns: ColumnsType<any> = [];
  let columns: ColumnsType<any> = [
    {
      title: <Trans>Effective From</Trans>,
      key: 'effective_from',
      dataIndex: 'effective_from',
      align: 'center',
      render: (data: any) => data || '-',
    },
    {
      title: <Trans>Relationship</Trans>,
      key: 'relationship',
      dataIndex: 'relationship',
      align: 'center',
      render: (data: any) => data || '-',
    },
    {
      title: <Trans>First Name</Trans>,
      key: 'first_name',
      dataIndex: 'first_name',
      align: 'center',
      render: (data: any) => data || '-',
    },
    {
      title: <Trans>Middle Name</Trans>,
      key: 'middle_name',
      dataIndex: 'middle_name',
      align: 'center',
      render: (data: any) => data || '-',
    },
    {
      title: <Trans>Last Name</Trans>,
      key: 'last_name',
      dataIndex: 'last_name',
      align: 'center',
      render: (data: any) => data || '-',
    },
    {
      title: <Trans>Date of Birth</Trans>,
      key: 'date_of_birth',
      dataIndex: 'date_of_birth',
      align: 'center',
      render: (data: any) => data || '-',
    },
    {
      title: <Trans>Gender</Trans>,
      key: 'gender',
      dataIndex: 'gender',
      render: (data: any) => data || '-',
      align: 'center',
    },
    {
      title: <Trans>Accompanied</Trans>,
      key: 'accompained',
      dataIndex: 'accompained',
      align: 'center',
      render: (data: any) => (data ? 'Yes' : 'No' || '-'),
    },
    {
      title: <Trans>Beneficiary</Trans>,
      key: 'beneficiary',
      dataIndex: 'beneficiary',
      align: 'center',
      render: (data: any) => (data ? 'Yes' : 'No' || '-'),
    },
    {
      title: <Trans>Country of Birth</Trans>,
      key: 'country_of_birth',
      dataIndex: 'country_of_birth',
      render: (data: any) => data || '-',
      align: 'center',
    },
  ];

  let titleList: any = [];

  dependentInfoCFListData?.map((item: any) => {
    titleList.push(item?.title);
  });

  titleList?.map((titleName: any) => {
    DynamicColumns.push({
      title: titleName,
      key: titleName,
      dataIndex: titleName,
      align: 'center',
      render: (data: any) =>
        data?.dependent_info_custom_field
          ? data?.dependent_info_custom_field
          : '-',
    });
  });
  columns = [
    ...columns,
    ...DynamicColumns,
    {
      title: <Trans>Created On</Trans>,
      key: 'created_on',
      dataIndex: 'created_on',
      render: (text: Moment) => {
        return text
          ? moment.isMoment(text)
            ? text.format('DD/MM/YYYY')
            : moment(text, ['DD/MM/YYYY', 'DD-MM-YYYY']).format('DD/MM/YYYY') ||
              '-'
          : '-';
      },
      align: 'center',
    },
    {
      title: <Trans>Modified On</Trans>,
      key: 'modified_on',
      dataIndex: 'modified_on',
      render: (text: Moment) =>
        text
          ? moment.isMoment(text)
            ? text.format('DD/MM/YYYY')
            : moment(text, ['DD/MM/YYYY', 'DD-MM-YYYY']).format('DD/MM/YYYY') ||
              '-'
          : '-',
      align: 'center',
    },
  ];

  if (permissions.ACTION_SF_USERS_DETAILS) {
    let column: ColumnType<any> = {
      title: <Trans>Action</Trans>,
      dataIndex: '',
      key: 'action',
      align: 'center' as 'center',
      width: 10,
      fixed: 'right' as 'right',
      render: (_val: string, _item: any, _index: number) => (
        <DotMenu
          actionBtn={[
            {
              children: <Trans>Delete</Trans>,
              Type: 'default',
              icon: DeleteOutlined,
              OnClick: () => {
                onDeleteButtonClick(_item.id, _item.employee.id);
              },
            },
          ]}
        >
          <EllipsisOutlined />
        </DotMenu>
      ),
    };
    columns.push(column);
  }
  return columns;
};

export {
  getBasicInfoColumn,
  getJobInfoColumn,
  getBankInfoColumn,
  getApproverColumn,
  getEmployeeApproverCustomFieldsColumn,
  getDependentInfoColumn,
};
