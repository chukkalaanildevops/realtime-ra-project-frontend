import React from 'react';
import './approvalsSubGroupHeader.index.less';
import { Amount } from '../../../../../shared/components';
import { IBulkApprovalResponseData } from '../../../approvals.model';
import { GroupedItemResponseButton } from '../../approvalResponseButton/approvalResponseButton.index';
import WarningIconWithTooltip from '../../warningIconWithTooltip/warningIconWithTooltip.index';

interface IProps {
  type: string;
  count: number;
  total: number;
  currency: string;
  typeFlag: any;
  tenantConfig: any;
  employeeId: number;
  benefitClaimIds: number[];
  respondToBulkApprovalItems: (data: IBulkApprovalResponseData) => void;
  disabled: boolean;
  allItemsInfo: any[];
}

const ApprovalsSubGroupHeader: React.FC<IProps> = ({
  type = undefined,
  count = 0,
  total = 0,
  currency = undefined,
  employeeId = 0,
  typeFlag = {},
  tenantConfig = null,
  benefitClaimIds = [],
  respondToBulkApprovalItems,
  disabled = false,
  allItemsInfo,
}) => {
  return (
    <div className='subgroup-item-header'>
      <div className='type'>{type}</div>

      <div className='extra'>
        {typeFlag.is_orange && tenantConfig[0]?.is_enabled_traffic_lights && (
          <WarningIconWithTooltip
            text={typeFlag.orange_flag_text}
            color='ORANGE'
            id={employeeId}
          />
        )}
        {typeFlag.is_red && tenantConfig[0]?.is_enabled_traffic_lights && (
          <WarningIconWithTooltip
            text={typeFlag.red_flag_text}
            color='RED'
            id={employeeId}
          />
        )}
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
              item: 'benefit',
              // employee_ids: [employeeId],
              items: benefitClaimIds.map(o => ({ id: o, comment: '' })),
            }}
            allItemsInfo={allItemsInfo}
            onClick={(data: IBulkApprovalResponseData) =>
              respondToBulkApprovalItems(data)
            }
          />
          <GroupedItemResponseButton
            action='reject'
            title='Reject'
            isButtonFilled={false}
            disabled={disabled}
            responseData={{
              action: 'reject',
              item: 'benefit',
              // employee_ids: [employeeId],
              items: benefitClaimIds.map(o => ({ id: o, comment: '' })),
            }}
            allItemsInfo={allItemsInfo}
            onClick={(data: IBulkApprovalResponseData) =>
              respondToBulkApprovalItems(data)
            }
          />
        </div>
      </div>
    </div>
  );
};

export default ApprovalsSubGroupHeader;
