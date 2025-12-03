import { actionBtnObjInterface } from '../dotMenu/dotMenu.model';
import { remarkType } from '../../../pages/app/app.model';
import { CheckboxProps } from 'antd/lib/checkbox/Checkbox';
import { ReactNode } from 'react';

export interface ICardProps {
  checkboxProps?: CheckboxProps;
  checked?: boolean;
  title: any;
  actions: actionBtnObjInterface[];
  type: string;
  code: string;
  requestNumber?: string;
  currency?: {
    currency: string | string;
    amount: number;
    suffix?: number | string;
  };
  onChecked?: (checked: boolean) => void;
  onDetails?: (type: string) => void;
  actionText?: string;
  isActionDisabled?: boolean;
  remarks?: number;
  // receipts?: any[];
  receipts?: React.ReactNode;
  canClaimExpense?: boolean;
  request?: any[];
  onMainAction?: () => void;
  onRequestsClick?: () => void;
  id?: number;
  cardType: remarkType;
  expenseType?: 'expense' | 'expenses_with_request' | 'request';
  onRemarkAdded: () => void;
  canSelectItem?: boolean;
  // status:
  //   | 'draft'
  //   | 'pending'
  //   | 'approved'
  //   | 'rejected'
  //   | 'processing'
  //   | 'stalled'
  //   | 'settled'
  status: { code: string; title: any };
  handleStatusTagClick?: (id: number) => void;
  category: string;
  hideMainAction?: boolean;
  backgroundClass?: string;
  getViolationTitleWithIcons?: any;
}
