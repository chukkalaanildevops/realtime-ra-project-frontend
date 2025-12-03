import React from 'react';
import { Checkbox, Avatar } from 'antd';
import './approvalsGroupHeader.index.less';
import { IBulkApprovalResponseData } from '../../../approvals.model';
import defaultUserImage from '../../../../../assets/images/default/avatar.png';
import { GroupedItemResponseButton } from '../../approvalResponseButton/approvalResponseButton.index';
import { Trans } from '@lingui/macro';

interface IProps {
  employeeId: number;
  employeeName: string;
  profilePictureUrl: string;
  designation: string;
  numberOfRequests: number;
  selectedRows: Array<{ [key: string]: number }>;
  toggleGroupHeaderCheckbox: (isChecked: boolean, value: number) => {};
  requestIds: number[];
  respondToBulkApprovalItems: (data: IBulkApprovalResponseData) => {};
  disabled: boolean;
  isLoading: boolean;
  isPendingStatus: boolean;
  allItemsInfo: any[];
}

const ApprovalsGroupHeader: React.FC<IProps> = ({
  employeeId = 0,
  employeeName = undefined,
  profilePictureUrl = undefined,
  designation = undefined,
  numberOfRequests = 0,
  selectedRows = [],
  toggleGroupHeaderCheckbox,
  requestIds = [],
  respondToBulkApprovalItems,
  disabled = false,
  allItemsInfo,
  isPendingStatus,
  isLoading,
}) => {
  return (
    <div className='group-item-header'>
      <div className='profile'>
        <Checkbox
          value={employeeId}
          className='select-item-checkbox'
          checked={selectedRows
            .map((record: any) => {
              return record.employee;
            })
            .includes(employeeId)}
          onClick={event => {
            event.stopPropagation();
          }}
          onChange={event => {
            toggleGroupHeaderCheckbox(event.target.checked, employeeId);
          }}
          disabled={!isPendingStatus}
        />
        <Avatar
          size={32}
          className='profile-photo'
          src={
            profilePictureUrl !== null ? profilePictureUrl : defaultUserImage
          }
        />
        <div className='profile-details'>
          <div className='name'>{employeeName}</div>
          {/* <div className='designation'>
            {designation !== null && designation !== undefined
              ? designation
              : 'NA'}
          </div> */}
        </div>
      </div>

      <div className='extra'>
        <div className='item'>
          <div className='value'>{numberOfRequests}</div>
          <div className='label'>
            <Trans>Requests</Trans>
          </div>
        </div>
        <div className='item'>
          <GroupedItemResponseButton
            action='approve'
            title='Approve'
            isButtonFilled={true}
            disabled={disabled}
            responseData={{
              item: 'request',
              action: 'approve',
              // employee_ids: [employeeId],
              items: requestIds.map(o => ({ id: o, comment: '' })),
            }}
            isLoading={isLoading}
            allItemsInfo={allItemsInfo}
            onClick={(data: IBulkApprovalResponseData) =>
              respondToBulkApprovalItems(data)
            }
          />
          <GroupedItemResponseButton
            action='reject'
            title='Reject'
            isButtonFilled={true}
            disabled={disabled}
            responseData={{
              item: 'request',
              action: 'reject',
              // employee_ids: [employeeId],
              items: requestIds.map(o => ({ id: o, comment: '' })),
            }}
            allItemsInfo={allItemsInfo}
            isLoading={isLoading}
            onClick={(data: IBulkApprovalResponseData) =>
              respondToBulkApprovalItems(data)
            }
          />
        </div>
      </div>
    </div>
  );
};

export default ApprovalsGroupHeader;
