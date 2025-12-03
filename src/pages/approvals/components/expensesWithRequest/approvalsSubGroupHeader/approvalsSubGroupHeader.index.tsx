import React from 'react';
import './approvalsSubGroupHeader.index.less';
import { Amount } from '../../../../../shared/components';
import { IBulkApprovalResponseData } from '../../../approvals.model';
import { GroupedItemResponseButton } from '../../approvalResponseButton/approvalResponseButton.index';
import { Button } from 'antd';
import { IWorkflowStatus } from '../../../../../shared/model';
import WarningIconWithTooltip from '../../warningIconWithTooltip/warningIconWithTooltip.index';

interface IProps {
  type: string;
  count: number;
  total: number;
  currency: string;
  tenantConfig: any;
  typeFlag: any;
  employeeId: number;
  requestId: number;
  requestNumber: string;
  workflow_status: any;
  expenseClaimIds: number[];
  respondToBulkApprovalItems: (data: IBulkApprovalResponseData) => {};
  disabled: boolean;
  openDetailsDrawer: (
    itemId: number,
    itemNumber: string,
    itemType: 'expense' | 'request' | 'benefit',
    workflowStatus: IWorkflowStatus,
  ) => void;
  allItemsInfo: any[];
  isEnableTrafficLightFeatureForTenantFeatures: any;
  typeFlagV2: any;
}

const ApprovalsSubGroupHeader: React.FC<IProps> = ({
  type = undefined,
  count = 0,
  total = 0,
  typeFlag = {},
  currency = undefined,
  employeeId = 0,
  tenantConfig = null,
  requestId = 0,
  requestNumber = '',
  expenseClaimIds = [],
  workflow_status = undefined,
  respondToBulkApprovalItems,
  disabled = false,
  openDetailsDrawer,
  allItemsInfo,
  isEnableTrafficLightFeatureForTenantFeatures,
  typeFlagV2 = {},
}) => {
  const renderSubGroupHeaderIcons = () => {
    let colorTypeFlag: any;
    if (tenantConfig[0]?.is_enabled_traffic_lights) {
      colorTypeFlag = isEnableTrafficLightFeatureForTenantFeatures
        ? typeFlagV2
        : typeFlag;
    }
    return (
      <>
        {colorTypeFlag?.is_orange && (
          <WarningIconWithTooltip
            text={colorTypeFlag.orange_flag_text}
            color='ORANGE'
            id={employeeId}
          />
        )}
        {colorTypeFlag?.is_red && (
          <WarningIconWithTooltip
            text={colorTypeFlag.red_flag_text}
            color='RED'
            id={employeeId}
          />
        )}
      </>
    );
  };
  return (
    <div className='subgroup-item-header'>
      <div className='type'>
        <Button
          type='link'
          className='request-number-link'
          onClick={event => {
            event.stopPropagation();
            openDetailsDrawer(
              requestId,
              requestNumber,
              'request',
              workflow_status,
            );
          }}
        >
          {requestNumber}
        </Button>
        <span>{type}</span>
      </div>
      <div className='extra'>
        {tenantConfig[0]?.is_enabled_traffic_lights &&
          renderSubGroupHeaderIcons()}
        {/* {typeFlag.is_orange &&
          tenantConfig[0]?.is_enabled_traffic_lights &&
          process.env.REACT_APP_ENVIRONMENT &&
          ['DEVELOPMENT', 'SAP_STAGING', 'QA'].includes(
            process.env.REACT_APP_ENVIRONMENT,
          ) && (
            <WarningIconWithTooltip
              text={typeFlag.orange_flag_text}
              color='ORANGE'
              id={employeeId}
            />
          )}
        {typeFlag.is_red &&
          tenantConfig[0]?.is_enabled_traffic_lights &&
          process.env.REACT_APP_ENVIRONMENT &&
          ['DEVELOPMENT', 'SAP_STAGING', 'QA'].includes(
            process.env.REACT_APP_ENVIRONMENT,
          ) && (
            <WarningIconWithTooltip
              text={typeFlag.red_flag_text}
              color='RED'
              id={employeeId}
            />
          )} */}
        <div className='item count'>
          <span>{count}</span>
        </div>
        <div className='item'>
          <Amount amount={total} currency={currency} align='center' />
        </div>
        <div className='item'>
          <GroupedItemResponseButton
            action='approve'
            title='Approve'
            isButtonFilled={false}
            disabled={disabled}
            responseData={{
              action: 'approve',
              item: 'expenses_with_request',
              // employee_ids: [employeeId],
              items: expenseClaimIds.map(o => ({ id: o, comment: '' })),
            }}
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
            isButtonFilled={false}
            disabled={disabled}
            responseData={{
              action: 'reject',
              item: 'expenses_with_request',
              // employee_ids: [employeeId],
              items: expenseClaimIds.map(o => ({ id: o, comment: '' })),
            }}
            allItemsInfo={allItemsInfo}
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

export default ApprovalsSubGroupHeader;
