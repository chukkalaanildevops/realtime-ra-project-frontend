import React from 'react';
import { Checkbox, Avatar } from 'antd';
import './approvalsGroupHeader.index.less';
import { Amount } from '../../../../../shared/components';
import { IBulkApprovalResponseData } from '../../../approvals.model';
import { GroupedItemResponseButton } from '../../approvalResponseButton/approvalResponseButton.index';
import defaultUserImage from '../../../../../assets/images/default/avatar.png';
import WarningIconWithTooltip from '../../warningIconWithTooltip/warningIconWithTooltip.index';
import { Trans } from '@lingui/macro';

interface IProps {
  employeeId: number;
  employeeName: string;
  profilePictureUrl: string;
  designation: string;
  numberOfExpenses: number;
  employeeFlag: any;
  currency: string;
  tenantConfig: any;
  totalAmount: number;
  selectedRows: Array<{ [key: string]: number }>;
  toggleGroupHeaderCheckbox: (isChecked: boolean, value: number) => void;
  expenseClaimIds: number[];
  respondToBulkApprovalItems: (data: IBulkApprovalResponseData) => void;
  disabled: boolean;
  isLoading: boolean;
  isPendingStatus: boolean;
  allItemsInfo: any[];
  isEnableTrafficLightFeatureForTenantFeatures: any;
  employeeFlagV2: any;
}

const ApprovalsGroupHeader: React.FC<IProps> = ({
  employeeId = 0,
  employeeName = undefined,
  profilePictureUrl = undefined,
  designation = undefined,
  numberOfExpenses = 0,
  currency = undefined,
  totalAmount = 0,
  tenantConfig = null,
  selectedRows = [],
  toggleGroupHeaderCheckbox,
  expenseClaimIds = [],
  respondToBulkApprovalItems,
  disabled = false,
  employeeFlag = {},
  allItemsInfo,
  isPendingStatus,
  isLoading,
  isEnableTrafficLightFeatureForTenantFeatures,
  employeeFlagV2 = {},
}) => {
  const renderGroupHeaderIcons = () => {
    let colorEmployeeFlag: any;
    if (tenantConfig[0]?.is_enabled_traffic_lights) {
      colorEmployeeFlag = isEnableTrafficLightFeatureForTenantFeatures
        ? employeeFlagV2
        : employeeFlag;
    }
    return (
      <>
        {colorEmployeeFlag?.is_orange && (
          <WarningIconWithTooltip
            filled={true}
            text={colorEmployeeFlag.orange_text}
            color='ORANGE'
            id={employeeId}
          />
        )}
        {colorEmployeeFlag?.is_red && (
          <WarningIconWithTooltip
            filled={true}
            text={colorEmployeeFlag.red_text}
            color='RED'
            id={employeeId}
          />
        )}
      </>
    );
  };
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
        {tenantConfig[0]?.is_enabled_traffic_lights && renderGroupHeaderIcons()}
        {/* {employeeFlag.is_orange &&
          tenantConfig[0]?.is_enabled_traffic_lights &&
          process.env.REACT_APP_ENVIRONMENT &&
          ['DEVELOPMENT', 'SAP_STAGING', 'QA'].includes(
            process.env.REACT_APP_ENVIRONMENT,
          ) && (
            <WarningIconWithTooltip
              filled={true}
              text={employeeFlag.orange_text}
              color='ORANGE'
              id={employeeId}
            />
          )}
        {employeeFlag.is_red &&
          tenantConfig[0]?.is_enabled_traffic_lights &&
          process.env.REACT_APP_ENVIRONMENT &&
          ['DEVELOPMENT', 'SAP_STAGING', 'QA'].includes(
            process.env.REACT_APP_ENVIRONMENT,
          ) && (
            <WarningIconWithTooltip
              filled={true}
              text={employeeFlag.red_text}
              color='RED'
              id={employeeId}
            />
          )} */}
        <div className='item'>
          <div className='value'>{numberOfExpenses}</div>
          <div className='label'>
            <Trans>Expenses</Trans>
          </div>
        </div>
        <div className='item'>
          <div className='value'>
            <Amount amount={totalAmount} currency={currency} align='center' />
          </div>
          <div className='label'>
            <Trans>Total Amount</Trans>
          </div>
        </div>
        <div className='item'>
          <GroupedItemResponseButton
            action='approve'
            title='Approve'
            isButtonFilled={true}
            disabled={disabled}
            responseData={{
              action: 'approve',
              item: 'expenses_with_request',
              // employee_ids: [employeeId],
              items: expenseClaimIds.map(o => ({ id: o, comment: '' })),
            }}
            isLoading={isLoading}
            allItemsInfo={allItemsInfo}
            onClick={(data: IBulkApprovalResponseData) =>
              respondToBulkApprovalItems(data)
            }
            isTrafficLightEnable={
              tenantConfig[0]?.is_enabled_traffic_lights &&
              isEnableTrafficLightFeatureForTenantFeatures
            }
          />
          <GroupedItemResponseButton
            action='reject'
            title='Reject'
            isButtonFilled={true}
            disabled={disabled}
            allItemsInfo={allItemsInfo}
            isLoading={isLoading}
            responseData={{
              action: 'reject',
              item: 'expenses_with_request',
              // employee_ids: [employeeId],
              items: expenseClaimIds.map(o => ({ id: o, comment: '' })),
            }}
            onClick={(data: IBulkApprovalResponseData) =>
              respondToBulkApprovalItems(data)
            }
            isTrafficLightEnable={
              tenantConfig[0]?.is_enabled_traffic_lights &&
              isEnableTrafficLightFeatureForTenantFeatures
            }
          />
        </div>
      </div>
    </div>
  );
};

export default ApprovalsGroupHeader;
