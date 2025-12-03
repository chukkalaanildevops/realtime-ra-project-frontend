import React from 'react';
import { Checkbox, Avatar } from 'antd';
import './approvalsGroupHeader.index.less';
import { Amount } from '../../../../../shared/components';
import { IBulkApprovalResponseData } from '../../../approvals.model';
import { GroupedItemResponseButton } from '../../approvalResponseButton/approvalResponseButton.index';
import defaultUserImage from '../../../../../assets/images/default/avatar.png';
import WarningIconWithTooltip from '../../warningIconWithTooltip/warningIconWithTooltip.index';

interface IProps {
  employeeId: number;
  employeeName: string;
  tenantConfig: any;
  profilePictureUrl: string;
  designation: string;
  numberOfBenefit: number;
  employeeFlag: any;
  currency: string;
  totalAmount: number;
  selectedRows: Array<{ [key: string]: number }>;
  toggleGroupHeaderCheckbox: (isChecked: boolean, value: number) => {};
  benefitClaimIds: number[];
  respondToBulkApprovalItems: (data: any) => {};
  disabled: boolean;
  isLoading: boolean;
  allItemsInfo: any[];
  isPendingStatus: boolean;
}

const ApprovalsGroupHeader: React.FC<IProps> = ({
  employeeId = 0,
  employeeName = undefined,
  profilePictureUrl = undefined,
  employeeFlag = {},
  designation = undefined,
  numberOfBenefit = 0,
  tenantConfig = null,
  currency = undefined,
  totalAmount = 0,
  selectedRows = [],
  toggleGroupHeaderCheckbox,
  benefitClaimIds = [],
  respondToBulkApprovalItems,
  disabled = false,
  allItemsInfo,
  isLoading,
  isPendingStatus,
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
        {employeeFlag.is_orange &&
          tenantConfig[0]?.is_enabled_traffic_lights && (
            <WarningIconWithTooltip
              filled={true}
              text={employeeFlag.orange_text}
              color='ORANGE'
              id={employeeId}
            />
          )}
        {employeeFlag.is_red && tenantConfig[0]?.is_enabled_traffic_lights && (
          <WarningIconWithTooltip
            filled={true}
            text={employeeFlag.red_text}
            color='RED'
            id={employeeId}
          />
        )}
        <div className='item'>
          <div className='value'>{numberOfBenefit}</div>
          <div className='label'>Benefit</div>
        </div>
        <div className='item'>
          <div className='value'>
            <Amount amount={totalAmount} currency={currency} align='center' />
          </div>
          <div className='label'>Total Amount</div>
        </div>
        <div className='item'>
          <GroupedItemResponseButton
            action='approve'
            title='Approve'
            isButtonFilled={true}
            disabled={disabled}
            responseData={{
              action: 'approve',
              item: 'benefit',
              // employee_ids: [employeeId],
              items: benefitClaimIds.map(o => ({ id: o, comment: '' })),
            }}
            allItemsInfo={allItemsInfo}
            isLoading={isLoading}
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
              action: 'reject',
              item: 'benefit',
              // employee_ids: [employeeId],
              items: benefitClaimIds.map(o => ({ id: o, comment: '' })),
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
