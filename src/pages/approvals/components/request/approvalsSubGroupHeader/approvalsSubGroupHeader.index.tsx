import React from 'react';
import './approvalsSubGroupHeader.index.less';
import { IBulkApprovalResponseData } from '../../../approvals.model';
import { GroupedItemResponseButton } from '../../approvalResponseButton/approvalResponseButton.index';

interface IProps {
  type: string;
  count: number;
  employeeId: number;
  requestIds: number[];
  respondToBulkApprovalItems: (data: IBulkApprovalResponseData) => {};
  disabled: boolean;
  allItemsInfo: any[];
}

const ApprovalsSubGroupHeader: React.FC<IProps> = ({
  type = undefined,
  count = 0,
  employeeId = 0,
  requestIds = [],
  respondToBulkApprovalItems,
  disabled = false,
  allItemsInfo,
}) => {
  return (
    <div className='subgroup-item-header'>
      <div className='type'>{type}</div>
      <div className='extra'>
        <div className='item count'>
          <span>{count}</span>
        </div>
        <div className='item'>
          <GroupedItemResponseButton
            action='approve'
            title='Approve'
            isButtonFilled={false}
            disabled={disabled}
            responseData={{
              item: 'request',
              action: 'approve',
              // employee_ids: [employeeId],
              items: requestIds.map(o => ({ id: o, comment: '' })),
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
              item: 'request',
              action: 'reject',
              // employee_ids: [employeeId],
              items: requestIds.map(o => ({ id: o, comment: '' })),
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
