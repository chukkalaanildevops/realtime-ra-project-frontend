import React from 'react';
import {
  DollarOutlined,
  UploadOutlined,
  GiftOutlined,
} from '@ant-design/icons';
import { MenuItemObj, DASHBOARD_CARD_TYPES } from '../../../../dashboard.model';
import { appPath } from '../../../../../app/app.routes';
import { NavLink } from 'react-router-dom';
import { ErrorBoundary } from '../../../../../../shared/components';

const EmptyCards = (props: any) => {
  const {
    cardLoader,
    dashboardData,
    isPermissionAllowed,
    isBenefitEnabled,
  } = props;
  //debugger;
  let array: MenuItemObj[] = [];
  if (
    !dashboardData[DASHBOARD_CARD_TYPES.draftExpense]?.total_records &&
    !dashboardData[DASHBOARD_CARD_TYPES.approvedExpense]?.total_records &&
    !cardLoader.draftExpense &&
    !cardLoader.approvedExpense
  ) {
    array.push({
      name: 'New Expense',
      icon: DollarOutlined,
      navigate: appPath.addNewExpense.add.linkTo,
      isVisible: isPermissionAllowed('ACTION_EXPENSE'),
    });
  }
  if (
    !dashboardData[DASHBOARD_CARD_TYPES.draftRequest]?.total_records &&
    !dashboardData[DASHBOARD_CARD_TYPES.approvedRequest]?.total_records &&
    !cardLoader.draftRequest &&
    !cardLoader.approvedRequest
  ) {
    array.push({
      name: 'New Request',
      icon: UploadOutlined,
      navigate: appPath.addNew.addRequest.linkTo,
      isVisible: isPermissionAllowed('ACTION_REQUEST'),
    });
  }
  if (
    !dashboardData[DASHBOARD_CARD_TYPES.draftBenefit]?.total_records &&
    !dashboardData[DASHBOARD_CARD_TYPES.approvedBenefit]?.total_records &&
    !cardLoader.draftBenefit &&
    !cardLoader.approvedBenefit
  ) {
    array.push({
      name: 'New Benefit',
      icon: GiftOutlined,
      navigate: appPath.benefit.add.benefit.linkTo,
      isVisible: isBenefitEnabled && isPermissionAllowed('ACTION_BENEFIT'),
    });
  }

  return (
    <ErrorBoundary>
      {array?.map(
        item =>
          item.isVisible && (
            <div className='placeholder-card empty' style={{ marginTop: 48 }}>
              <NavLink to={item.navigate} className='menuItemContainer'>
                <item.icon className='iconStyle' />
                <p className='titleText'>{item.name}</p>
              </NavLink>
            </div>
          ),
      )}
    </ErrorBoundary>
  );
};

export default EmptyCards;
