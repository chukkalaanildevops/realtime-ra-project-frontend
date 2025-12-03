/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, Dispatch, useEffect } from 'react';
import {
  Layout,
  Avatar,
  Menu,
  Typography,
  Button,
  Modal,
  notification,
  Badge,
} from 'antd';
import {
  UserOutlined,
  PlusOutlined,
  GiftOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import Icon from '@mdi/react';
import {
  mdiPencil,
  mdiSendCheck,
  mdiPlaylistCheck,
  mdiLogout,
  mdiCellphoneKey,
  mdiAccountMultipleCheckOutline,
  mdiChartBar,
  mdiShieldCheckOutline,
  mdiCogOutline,
  mdiAccountOutline,
  mdiAccountSwitchOutline,
  mdiTuneVerticalVariant,
  mdiFileEditOutline,
  mdiCurrencyUsd,
  mdiReceipt,
  mdiGoogleAnalytics,
} from '@mdi/js';
import {
  getUser,
  getPermissions,
  getAuthTenant,
  getIsBenefitEnabled,
  getProxyUsers,
  getCurrentDelegateUser,
  isApprovedMenuAllowed,
  isDraftMenuAllowed,
  isSubmittedMenuAllowed,
  isProxyPermissionAllowed,
  getTenantConfigRecords,
  getAuthTenantConfig,
} from '../../redux/rootReducer';
import { connect, ConnectedProps } from 'react-redux';
import './menuDrawer.index.less';

import { ModalProps } from 'antd/lib/modal';
import { MenuClickEventHandler } from 'rc-menu/lib/interface';
import { Link, useHistory } from 'react-router-dom';
import { MenuDrawerProps, MenuItemType } from './menuDrawer.model';

import { appPath } from '../../../pages/app/app.routes';
import brandImage from '../../../assets/images/branding/logo.png';
import collapsedBrandImage from '../../../assets/images/branding/logo-small.png';
import { Trans } from '@lingui/macro';
import { logoutUser } from '../../redux/auth/auth.thunk';
import { useWindowsSize } from '../../hooks/index';
import {
  fetchDelegateUsers,
  fetchCurrentDelegateUser,
} from '../../../pages/delegate/delegate.thunk';
import {
  saveCurrentDelegateUser,
  configDelegationScreen,
} from '../../../pages/delegate/delegate.action';
import { PROXY_PERMISSIONS } from '../../../pages/delegate/delegate.model';
import {
  resetAllData,
  resetConfirmationInfo,
  setConfirmationInfo,
} from '../../../pages/app/app.actions';
import { IConfirmationInfo } from '../../../pages/app/app.model';
import { fetchTenantConfigList } from '../../../pages/configurations/configurations.thunk';
import { fetchLoggedInUserInfo } from '../../../pages/addNewExpense/addNewExpense.thunk';
import { saveUserData } from '../../redux/auth/auth.actions';
import { clearSessionStorage } from '../../../utils/global.utils';
import { deleteAllowanceRecordsWhilePageSwitch } from '../../../pages/addNewExpense/components/allowanceNew/allowanceNew.thunk';
import {
  resetPolicyConfirmationInfo,
  setPolicyConfirmationInfo,
} from '../../../pages/setup/component/other/policyConfiguration/policyConfiguration.actions';

const { Text } = Typography;
const { SubMenu } = Menu;
const { Sider } = Layout;

const MenuDrawer: React.FC<MenuDrawerProps &
  ConnectedProps<typeof connector>> = props => {
  const {
    userData,
    tenant,
    _logoutUser,
    currentDelegateUser,
    _resetDelegateUser,
    isApprovedAllowed,
    isDraftAllowed,
    isSubmittedAllowed,
    isPermissionAllowed,
    _setConfirmationInfo,
    _resetConfirmationInfo,
    tenantRecords,
    tenantConfig,
    _fetchTenants,
    allowanceRecordsId,
    _deleteAllowanceRecordsWhilePageSwitch,
    policyUpdateId,
    _setPolicyConfirmationInfo,
    _resetPolicyConfirmationInfo,
  } = props;

  const history = useHistory();
  const isDelegateUserLoginUser = !Boolean(currentDelegateUser);
  const [collapsed, setCollapsed] = useState(false);
  const [isNavModalVisible, toggleNavModalVisible] = useState(false);
  const [isProfileModalOpen, toggleProfileModal] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState<string[]>([]);
  const [selectedSubMenu, setSelectedSubMenu] = useState<string[]>([]);

  const windowSize = useWindowsSize();

  useEffect(() => {
    props._fetchUsers();
    _fetchTenants();
  }, []);

  useEffect(() => {
    if (tenantConfig && tenantConfig.slo_url) {
      window.location.href = tenantConfig.slo_url;
    }
    // eslint-disable-next-line
  }, [tenantConfig]);

  useEffect(() => {
    const width = windowSize.width || window.innerWidth;
    if (width < 900) {
      onCollapse(true);
    } else if (width > 900) {
      onCollapse(false);
    }
  }, [windowSize.width]);

  const onCollapse = (isCollapsed: boolean) => {
    setCollapsed(isCollapsed);
  };

  const url = window.location.href;

  useEffect(() => {
    if (url.includes(appPath.submitted.linkTo)) {
      setSelectedMenu(['2']);
    } else if (url.includes(appPath.drafts.linkTo)) {
      setSelectedMenu(['1']);
    } else if (url.includes(appPath.config_setup.linkTo)) {
      setSelectedMenu(['5']);
    } else if (url.includes(appPath.settings.linkTo)) {
      setSelectedMenu(['6']);
    } else if (url.includes(appPath.reports.linkTo)) {
      url.includes('benefit')
        ? setSelectedSubMenu(['42'])
        : setSelectedSubMenu(['41']);
      setSelectedMenu(['4']);
    } else if (url.includes(appPath.approvals.linkTo)) {
      setSelectedMenu(['3']);
    } else if (url.includes(appPath.admin.linkTo)) {
      url.includes('benefit')
        ? setSelectedSubMenu(['72'])
        : setSelectedSubMenu(['71']);
      setSelectedMenu(['7']);
    } else if (url.includes(appPath.deviceManagement.linkTo)) {
      setSelectedMenu(['9']);
    } else if (url.includes(appPath.insights.linkTo)) {
      setSelectedMenu(['8']);
    } else {
      setSelectedMenu([]);
    }
  }, [window.location.href]);

  const menuItems: MenuItemType[] = [
    {
      title: <Trans>Drafts</Trans>,
      icon: mdiPencil,
      navigate: `${appPath.drafts.expense.linkTo}`,
      key: '1',
      code: 'DRAFTS',
      isVisible: isDraftAllowed,
    },
    {
      title: <Trans>Submitted</Trans>,
      icon: mdiSendCheck,
      navigate: `${appPath.submitted.linkTo}expense`,
      key: '2',
      code: 'SUBMITTED',
      isVisible: isSubmittedAllowed,
    },
    {
      title: <Trans>Approvals</Trans>,
      icon: mdiPlaylistCheck,
      navigate: appPath.approvals.expenses.linkTo,
      key: '3',
      code: 'APPROVALS',
      isVisible: isApprovedAllowed,
    },
    {
      title: <Trans>Reports</Trans>,
      icon: mdiChartBar,
      // navigate: `${appPath.reports.expense.linkTo}`,
      key: '4',
      code: 'REPORTS',
      isVisible: isDelegateUserLoginUser,
      isSubmenu: true,
      child: [
        {
          title: <Trans>Expense</Trans>,
          icon: mdiCurrencyUsd,
          navigate: `${appPath.reports.expense.linkTo}`,
          key: '41',
          code: 'REPORT-EXPENSE',
          isVisible:
            props.getPermissions['VIEW_EXPENSE_REPORTS'] ||
            props.getPermissions['VIEW_EXPENSES_WITH_REQUEST_REPORTS'] ||
            props.getPermissions['VIEW_REQUEST_REPORTS'] ||
            props.getPermissions['VIEW_CASH_ADVANCE_REPORTS'] ||
            props.getPermissions['VIEW_SPECIALIZED_REPORTS'],
        },
        {
          title: <Trans>Benefit</Trans>,
          icon: GiftOutlined,
          navigate: `${appPath.reports.benefit.linkTo}`,
          key: '42',
          code: 'REPORT-BENEFIT',
          isVisible:
            props.getIsBenefitsEnabled &&
            (props.getPermissions['VIEW_BENEFIT_REPORTS'] ||
              props.getPermissions['VIEW_BENEFITS_ENTITLEMENT_REPORTS'] ||
              props.getPermissions['VIEW_BENEFITS_SPECIALIZED_REPORTS']),
        },
      ],
    },
    {
      title: <Trans>Admin</Trans>,
      icon: mdiShieldCheckOutline,
      key: '7',
      code: 'ADMIN',
      isVisible: isDelegateUserLoginUser,
      isSubmenu: true,
      child: [
        {
          title: <Trans>Expense</Trans>,
          icon: mdiCurrencyUsd,
          navigate: `${appPath.admin.expenseClaims.linkTo}`,
          key: '71',
          code: 'ADMIN-EXPENSE',
          isVisible:
            props.getPermissions['VIEW_ADMIN_EXPENSES'] ||
            props.getPermissions['VIEW_ADMIN_EXPENSES_WITH_REQUESTS'] ||
            props.getPermissions['VIEW_ADMIN_REQUESTS'] ||
            props.getPermissions['VIEW_ADMIN_CASH_ADVANCE_REQUESTS'] ||
            props.getPermissions['ACTION_ADMIN_EXECUTE_CLAIM_SETTLEMENT'] ||
            props.getPermissions['ACTION_ADMIN_EXECUTE_REQUEST_POSTING'],
        },
        {
          title: <Trans>Benefit</Trans>,
          icon: GiftOutlined,
          navigate: `${appPath.admin.benefits.linkTo}`,
          key: '72',
          code: 'ADMIN-BENEFIT',
          isVisible:
            props.getIsBenefitsEnabled &&
            (props.getPermissions['VIEW_ADMIN_BENEFITS'] ||
              props.getPermissions[
                'ACTION_ADMIN_EXECUTE_BENEFIT_CLAIM_SETTLEMENT'
              ]),
        },
      ],
    },
    {
      title: <Trans>Setup</Trans>,
      icon: mdiTuneVerticalVariant,
      navigate: appPath.config_setup.linkTo,
      key: '5',
      code: 'SETUP',
      isVisible: isDelegateUserLoginUser,
    },
    {
      title: <Trans>Settings</Trans>,
      icon: mdiCogOutline,
      navigate: appPath.settings.linkTo,
      key: '6',
      code: 'SETTINGS',
      isVisible: isDelegateUserLoginUser,
    },
    {
      title: <Trans>Devices</Trans>,
      icon: mdiCellphoneKey,
      navigate: appPath.deviceManagement.linkTo,
      key: '9',
      code: 'DEVICE MANAGEMENT',
      isVisible: isDelegateUserLoginUser,
    },
  ];
  if (
    process.env.REACT_APP_ENVIRONMENT &&
    ['DEVELOPMENT', 'SAP_STAGING', 'QA'].includes(
      process.env.REACT_APP_ENVIRONMENT,
    )
  ) {
    ![
      'valency',
      'ppbgroupt1',
      'hrdcorpt1',
      'cgct1',
      'pilruat',
      'abt1',
    ].includes(tenant) &&
      menuItems.splice(4, 0, {
        title: <Trans>Insights</Trans>,
        icon: mdiGoogleAnalytics,
        navigate: appPath.insights.linkTo,
        key: '8',
        code: 'INSIGHTS',
        isVisible: isDelegateUserLoginUser,
      });
  }

  const addNewItems: MenuItemType[] = [
    {
      title: <Trans>Expense</Trans>,
      icon: mdiCurrencyUsd,
      navigate: appPath.addNewExpense.add.linkTo,
      key: '1',
      code: 'ADD_NEW_EXPENSE',
      isVisible: isPermissionAllowed('ACTION_EXPENSE'),
    },
    {
      title: <Trans>Request</Trans>,
      icon: mdiFileEditOutline,
      navigate: `${appPath.addNew.addRequest.travel.linkTo}`,
      key: '2',
      code: 'ADD_NEW_REQUEST',
      isVisible: isPermissionAllowed('ACTION_REQUEST'),
    },
    {
      title: <Trans>Receipt</Trans>,
      icon: mdiReceipt,
      navigate: appPath.receipt.add.linkTo,
      key: '3',
      code: 'ADD_NEW_RECEIPT',
      isVisible: isPermissionAllowed('ACTION_RECEIPT'),
    },
    {
      title: <Trans>Benefit</Trans>,
      icon: GiftOutlined,
      navigate: appPath.benefit.add.benefit.linkTo,
      key: '4',
      code: 'ADD_NEW_BENEFIT',
      isVisible:
        props.getIsBenefitsEnabled && isPermissionAllowed('ACTION_BENEFIT'),
    },
  ];

  const profileItems: MenuItemType[] = [
    {
      title: <Trans>My Profile</Trans>,
      navigate: appPath.profile.linkTo,
      icon: mdiAccountOutline,
      key: 'profile',
      code: 'MY_PROFILE',
    },
    {
      title: <Trans>Delegate</Trans>,
      navigate: `${appPath.delegate.delegatedByMe.linkTo}`,
      icon: mdiAccountMultipleCheckOutline,
      key: 'delegate',
      code: 'DELEGATE',
      isVisible: isDelegateUserLoginUser,
    },
    {
      title: <Trans>Settings</Trans>,
      navigate: '404',
      icon: SettingOutlined,
      key: 'settings',
      code: 'PROFILE_SETTINGS',
      isVisible: false,
    },
    {
      title: <Trans>Switch User</Trans>,
      navigate: ``,
      icon: mdiAccountSwitchOutline,
      // icon: SyncOutlined,
      key: 'switch-users',
      code: 'SWITCH_USER',
      isVisible: props.users?.length > 0,
    },
  ];

  const getMenuItems = (items: MenuItemType[]) => {
    const toBeRemovedIndexes: any = [];
    const selectedSubmenu = selectedSubMenu && selectedSubMenu[0];
    for (let index = 0; index < items.length; index++) {
      const item = items[index];
      switch (item.code) {
        case 'SETUP':
          if (!props.getPermissions.VIEW_SETUP) {
            toBeRemovedIndexes.push(index);
          }
          break;
        case 'SETTINGS':
          if (!props.getPermissions.VIEW_SETTINGS) {
            toBeRemovedIndexes.push(index);
          }
          break;
        case 'ADD_NEW_BENEFIT':
          if (item.code === 'ADD_NEW_BENEFIT' && !props.getIsBenefitsEnabled) {
            toBeRemovedIndexes.push(index);
          }
          break;
        case 'ADMIN':
          if (!props.getPermissions.VIEW_ADMIN) {
            toBeRemovedIndexes.push(index);
          }
          break;
        case 'REPORTS':
          if (!props.getPermissions?.VIEW_REPORTS) {
            toBeRemovedIndexes.push(index);
          }
          break;
      }
    }
    items = items.filter(
      (_item, index) =>
        !toBeRemovedIndexes.includes(index) && _item.isVisible !== false,
    );
    return items.map(item =>
      item.code === 'SWITCH_USER' ? (
        renderUsers()
      ) : item.isSubmenu ? (
        <SubMenu
          // selectedKeys={selectedMenu}
          key={item.key}
          className={`app-menu-item ${item.code} ${selectedMenu &&
            ['7', '4'].includes(selectedMenu[0]) &&
            selectedMenu[0] === item.key &&
            'ant-menu-item-selected'}`}
          icon={
            typeof item.icon === 'string' ? (
              <Icon
                path={item.icon}
                className='menu-item-icon material-menu-icons'
              />
            ) : (
              <item.icon className='menu-item-icon ' />
            )
          }
          popupClassName='admin-submenu'
          title={item.title}
        >
          {item?.child?.map((children: any) => (
            <>
              {children.isVisible && (
                <Menu.Item
                  key={children.key}
                  className={`app-menu-item ${children.code} ${
                    selectedSubmenu === children.key
                      ? 'submenu-item-selected '
                      : ''
                  }`}
                >
                  {/* <Icon
                path={children.icon}
                className='menu-item-icon material-menu-icons'
              /> */}
                  <span className='menu-item-title'>{children.title}</span>
                </Menu.Item>
              )}
            </>
          ))}
        </SubMenu>
      ) : (
        <Menu.Item key={item.key} className={`app-menu-item ${item.code}`}>
          {typeof item.icon === 'string' ? (
            <Icon
              path={item.icon}
              className='menu-item-icon material-menu-icons'
            />
          ) : (
            <item.icon
              className={`menu-item-icon material-menu-icons ${item.code ===
                'ADD_NEW_BENEFIT' && 'benefit-icon'}`}
            />
          )}
          <span className='menu-item-title'>{item.title}</span>
        </Menu.Item>
      ),
    );
  };

  const openNavModal = () => {
    toggleNavModalVisible(prev => !prev);
  };

  const openProfileModal = (e: any) => {
    const nodeName = e.target?.nodeName;
    if (nodeName !== 'path' && nodeName !== 'svg') {
      toggleProfileModal(prev => !prev);
    }
  };

  const handleNavConfirmationModelCancelBtn = () => {
    try {
      _resetConfirmationInfo();
      toggleNavModalVisible(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleNavConfirmationModelOkBtn = (params: any) => {
    try {
      _resetConfirmationInfo();
      _deleteAllowanceRecordsWhilePageSwitch(allowanceRecordsId, () => {
        handleNavItemClick(params);
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleNavPolicyConfigurationConfirmationModelOkBtn = (params: any) => {
    try {
      _resetPolicyConfirmationInfo();
      // handleNavItemClick(params);
      const key = params.key;
      const clickedItem = addNewItems.find(item => item.key === key);
      localStorage.removeItem('clone_data');
      return clickedItem;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const handleNavItemClick = (params: any) => {
    const key = params.key;
    const clickedItem = addNewItems.find(item => item.key === key);
    localStorage.removeItem('clone_data');
    clickedItem?.navigate && history.push(clickedItem.navigate);
    toggleNavModalVisible(false);
  };

  const onNavItemClick: MenuClickEventHandler = params => {
    if (allowanceRecordsId?.length > 0) {
      _setConfirmationInfo({
        forWhat: 'PAGE_SWITCH',
        extraInfo: '',
        okText: 'No, Leave Page',
        cancelText: 'Yes, Stay Here',
        visibility: true,
        headerText: 'Warning',
        bodyText: 'Do you want to save your data before leaving this page?',
        cancelBtnFn: handleNavConfirmationModelCancelBtn,
        okBtnFn: handleNavConfirmationModelOkBtn.bind(null, params),
      });
    } else if (policyUpdateId?.length > 0) {
      _setPolicyConfirmationInfo({
        visibility: true,
        okBtnFn: handleNavPolicyConfigurationConfirmationModelOkBtn.bind(
          params,
        ),
        params: handleNavPolicyConfigurationConfirmationModelOkBtn(params),
      });
    } else {
      handleNavItemClick(params);
    }
  };

  const handleProfileConfirmationModelCancelBtn = () => {
    try {
      _resetConfirmationInfo();
      toggleProfileModal(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleProfileConfirmationModelOkBtn = (params: any) => {
    try {
      _resetConfirmationInfo();
      _deleteAllowanceRecordsWhilePageSwitch(allowanceRecordsId, () => {
        handleProfileItemClick(params);
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleProfileItemClick = (params: any) => {
    toggleProfileModal(false);

    const key = params.key;
    const clickedItem = profileItems.find(item => item.key === key);
    clickedItem?.navigate && history.push(clickedItem.navigate);
  };

  const onProfileItemClick: MenuClickEventHandler = params => {
    if (params.key === 'profile' || params.key === 'delegate') {
      if (allowanceRecordsId?.length > 0) {
        _setConfirmationInfo({
          forWhat: '',
          extraInfo: '',
          okText: 'No, Leave Page',
          cancelText: 'Yes, Stay Here',
          visibility: true,
          headerText: 'Warning',
          bodyText: 'Do you want to save your data before leaving this page?',
          cancelBtnFn: handleProfileConfirmationModelCancelBtn,
          okBtnFn: handleProfileConfirmationModelOkBtn.bind(null, params),
        });
      } else if (policyUpdateId?.length > 0) {
        const key = params.key;
        const clickedItem = profileItems.find(item => item.key === key);
        _setPolicyConfirmationInfo({
          visibility: true,
          okBtnFn: handleNavPolicyConfigurationConfirmationModelOkBtn.bind(
            params,
          ),
          params: clickedItem,
        });
      } else {
        handleProfileItemClick(params);
      }
    }
  };

  const handleMenuConfirmationModelCancelBtn = () => {
    try {
      _resetConfirmationInfo();
      setSelectedMenu([]);
    } catch (error) {
      console.error(error);
    }
  };

  const handleMenuConfirmationModelOkBtn = (params: any) => {
    try {
      _resetConfirmationInfo();
      _deleteAllowanceRecordsWhilePageSwitch(allowanceRecordsId, () => {
        handleMenuItemClick(params);
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleMenuItemClick = (params: any) => {
    const key = params.key;
    let clickedSubmenu: any = null;
    let selectedMenu;
    const clickedItem = menuItems.find(item => {
      if (item.isSubmenu && !clickedSubmenu) {
        clickedSubmenu = item?.child?.find((children: any) => {
          return children.key === key;
        });
        selectedMenu = item.key;
      }
      return item.key === key;
    });
    if (clickedSubmenu && selectedMenu) {
      setSelectedMenu([selectedMenu]);
    }
    const selectedItem = clickedSubmenu ? clickedSubmenu : clickedItem;
    selectedItem?.navigate && history.push(selectedItem.navigate);
  };

  const onMenuItemClick: MenuClickEventHandler = params => {
    if (allowanceRecordsId?.length > 0) {
      _setConfirmationInfo({
        forWhat: 'PAGE_SWITCH',
        extraInfo: '',
        okText: 'No, Leave Page',
        cancelText: 'Yes, Stay Here',
        visibility: true,
        headerText: 'Warning',
        bodyText: 'Do you want to save your data before leaving this page?',
        cancelBtnFn: handleMenuConfirmationModelCancelBtn,
        okBtnFn: handleMenuConfirmationModelOkBtn.bind(null, params),
      });
    } else if (policyUpdateId?.length > 0) {
      const key = params.key;
      let clickedSubmenu: any = null;
      let selectedMenu;
      const clickedItem = menuItems.find(item => {
        if (item.isSubmenu && !clickedSubmenu) {
          clickedSubmenu = item?.child?.find((children: any) => {
            return children.key === key;
          });
          selectedMenu = item.key;
        }
        return item.key === key;
      });
      if (clickedSubmenu && selectedMenu) {
        setSelectedMenu([selectedMenu]);
      }
      const selectedItem = clickedSubmenu ? clickedSubmenu : clickedItem;

      _setPolicyConfirmationInfo({
        visibility: true,
        okBtnFn: handleNavPolicyConfigurationConfirmationModelOkBtn.bind(
          params,
        ),
        params: selectedItem,
      });
    } else {
      handleMenuItemClick(params);
    }
  };

  const showNotification = () => {
    return notification.warn({
      placement: 'bottomRight',
      style: { background: '#fffbe6' },
      message: 'Delegation Is Active',
    });
  };

  const handleViewUsersConfirmationModelCancelBtn = () => {
    try {
      _resetConfirmationInfo();
    } catch (error) {
      console.error(error);
    }
  };

  const handleViewUsersConfirmationModelOkBtn = () => {
    try {
      _resetConfirmationInfo();
      _deleteAllowanceRecordsWhilePageSwitch(allowanceRecordsId, () => {
        handleViewAllUsersClick();
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleViewAllUsersClick = () => {
    toggleProfileModal(false);
    setTimeout(() => {
      history.push(appPath.delegateUsers.linkTo);
    }, 100);
  };

  const viewAllUsers = () => {
    if (allowanceRecordsId?.length > 0) {
      _setConfirmationInfo({
        forWhat: 'PAGE_SWITCH',
        extraInfo: '',
        okText: 'No, Leave Page',
        cancelText: 'Yes, Stay Here',
        visibility: true,
        headerText: 'Warning',
        bodyText: 'Do you want to save your data before leaving this page?',
        cancelBtnFn: handleViewUsersConfirmationModelCancelBtn,
        okBtnFn: handleViewUsersConfirmationModelOkBtn,
      });
    } else {
      handleViewAllUsersClick();
    }
  };

  const handleSwitchUserYouConfirmationModelCancelBtn = () => {
    try {
      _resetConfirmationInfo();
      toggleProfileModal(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSwitchUserYouConfirmationModelOkBtn = () => {
    try {
      _resetConfirmationInfo();
      _deleteAllowanceRecordsWhilePageSwitch(allowanceRecordsId, () => {
        handleSwitchUserYouClicked();
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleSwitchUserYouClicked = () => {
    _resetDelegateUser();
    history.push(appPath.dashboard.path);
  };

  const handleSwitchUsersOtherUserConfirmationModelCancelBtn = () => {
    try {
      _resetConfirmationInfo();
      toggleProfileModal(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSwitchUsersOtherUserConfirmationModelOkBtn = (item: any) => {
    try {
      _resetConfirmationInfo();
      _deleteAllowanceRecordsWhilePageSwitch(allowanceRecordsId, () => {
        handleSwitchUsersOtherUserClicked(item);
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleSwitchUsersOtherUserClicked = (item: any) => {
    props._selectDelegateUser(item.on_behalf_of.id);
    history.push(appPath.dashboard.path);
  };

  const renderUsers = () => {
    const usersToShow = 2;
    const users = props.users.slice(0, usersToShow);
    return (
      <Menu.SubMenu
        key='users'
        title={
          <span>
            <Icon
              path={mdiAccountSwitchOutline}
              className='material-menu-icons'
            />
            <span>
              <Trans>Switch Users</Trans>
            </span>
          </span>
        }
        popupClassName='users-submenu'
      >
        <Menu.Item
          key='you'
          title={userData?.legal_name || userData?.name}
          className={isDelegateUserLoginUser ? 'current-user' : ''}
          onClick={() => {
            if (allowanceRecordsId?.length > 0) {
              _setConfirmationInfo({
                forWhat: 'PAGE_SWITCH',
                extraInfo: '',
                okText: 'No, Leave Page',
                cancelText: 'Yes, Stay Here',
                visibility: true,
                headerText: 'Warning',
                bodyText:
                  'Do you want to save your data before leaving this page?',
                cancelBtnFn: handleSwitchUserYouConfirmationModelCancelBtn,
                okBtnFn: handleSwitchUserYouConfirmationModelOkBtn,
              });
            } else if (policyUpdateId?.length > 0) {
              _setPolicyConfirmationInfo({
                visibility: true,
                okBtnFn: handleSwitchUserYouConfirmationModelOkBtn,
                params: appPath.dashboard.path,
              });
            } else {
              handleSwitchUserYouClicked();
            }
          }}
        >
          <img
            src={require('../../../assets/images/default/user.png')}
            style={{ height: 30, width: 30, marginRight: 8 }}
            alt='user avatar'
          />
          You
        </Menu.Item>
        {users.map((item, i: number) => (
          <Menu.Item
            key={`${item.id}_${i}`}
            title={item?.on_behalf_of?.legal_name || item.on_behalf_of.name}
            className={
              item.on_behalf_of.id === currentDelegateUser?.on_behalf_of?.id
                ? 'current-user'
                : 'not-selected'
            }
            onClick={() => {
              if (allowanceRecordsId?.length > 0) {
                _setConfirmationInfo({
                  forWhat: 'PAGE_SWITCH',
                  extraInfo: '',
                  okText: 'No, Leave Page',
                  cancelText: 'Yes, Stay Here',
                  visibility: true,
                  headerText: 'Warning',
                  bodyText:
                    'Do you want to save your data before leaving this page?',
                  cancelBtnFn: handleSwitchUsersOtherUserConfirmationModelCancelBtn,
                  okBtnFn: handleSwitchUsersOtherUserConfirmationModelOkBtn.bind(
                    null,
                    item,
                  ),
                });
              } else if (policyUpdateId?.length > 0) {
                _setPolicyConfirmationInfo({
                  visibility: true,
                  okBtnFn: handleSwitchUsersOtherUserConfirmationModelOkBtn.bind(
                    null,
                    item,
                  ),
                  params: appPath.dashboard.path,
                });
              } else {
                handleSwitchUsersOtherUserClicked(item);
              }
            }}
          >
            <img
              src={require('../../../assets/images/default/user.png')}
              style={{ height: 30, width: 30, marginRight: 8 }}
              alt='profile'
            />
            {item?.on_behalf_of?.legal_name || item.on_behalf_of.name}
          </Menu.Item>
        ))}
        {props.users.length > usersToShow && (
          <div className='logout-button-container' style={{ padding: 12 }}>
            <Button
              size='middle'
              type='default'
              className='logout-button'
              onClick={viewAllUsers}
              data-cy='viewAllUsers'
            >
              <Trans>View All Users</Trans>
            </Button>
          </div>
        )}
      </Menu.SubMenu>
    );
  };

  const addButtonVisible =
    addNewItems.filter(item => item.isVisible === true).length > 0;

  const buttonTitle = collapsed ? undefined : <Trans>Add New</Trans>;
  const buttonShape = collapsed ? 'circle' : undefined;
  const userName = isDelegateUserLoginUser
    ? userData?.legal_name || userData?.name
    : currentDelegateUser?.on_behalf_of.legal_name ||
      currentDelegateUser?.on_behalf_of.name;

  return (
    <div
      className={
        collapsed ? 'menu-drawer-container collapsed' : 'menu-drawer-container'
      }
    >
      <Sider
        collapsible
        className='menu-sider'
        collapsed={collapsed}
        onCollapse={onCollapse}
      >
        <div
          className='user-container'
          onClick={openProfileModal}
          style={{ background: url.includes('profile') ? '#68737D' : '' }}
        >
          {currentDelegateUser ? (
            <Badge
              count={
                <UserOutlined
                  className='profile-icon'
                  onClick={showNotification}
                />
              }
            >
              <Avatar
                className={`user-avatar delegate`}
                src={
                  userData?.profile
                    ? userData?.profile
                    : require('../../../assets/images/default/user.png')
                }
              />
            </Badge>
          ) : (
            <Avatar
              className={`user-avatar ${currentDelegateUser ? 'delegate' : ''}`}
              src={
                userData?.profile
                  ? userData?.profile
                  : require('../../../assets/images/default/user.png')
              }
            />
          )}
          <Text className={collapsed ? 'username hidden' : 'username'} ellipsis>
            <div
              style={{ width: 'inherit', textAlign: 'center' }}
              title={userName}
              className='ant-typography-ellipsis ant-typography-ellipsis-single-line'
              data-cy='userProfileNameOnMenuBar'
            >
              {userName}
            </div>
          </Text>
        </div>

        {addButtonVisible && (
          <div
            className='button-container'
            style={{
              backgroundColor:
                url.includes('add-') && !url.includes('submitted')
                  ? '#68737D'
                  : '',
            }}
          >
            <Button
              type='primary'
              shape={buttonShape}
              onClick={openNavModal}
              className='add-new-button'
              size={collapsed ? 'large' : 'middle'}
              style={{
                borderRadius: collapsed ? undefined : '3px',
                width: collapsed ? '' : '120px',
              }}
            >
              <PlusOutlined />
              {buttonTitle}
            </Button>
          </div>
        )}

        <Menu
          theme='dark'
          mode='vertical'
          className='app-menu'
          onClick={onMenuItemClick}
          selectedKeys={selectedMenu}
          triggerSubMenuAction='click'
          onSelect={({ selectedKeys }: any) => {
            if (policyUpdateId.length === 0) {
              if (selectedKeys && ['41', '42'].includes(selectedKeys[0])) {
                setSelectedMenu(['4']);
                setSelectedSubMenu(selectedKeys as string[]);
              } else if (
                selectedKeys &&
                ['71', '72'].includes(selectedKeys[0])
              ) {
                setSelectedMenu(['7']);
                setSelectedSubMenu(selectedKeys as string[]);
              } else {
                setSelectedMenu(selectedKeys as string[]);
                setSelectedSubMenu([]);
              }
            }
          }}
        >
          {getMenuItems(menuItems)}
        </Menu>

        <div className='branding'>
          <Link
            to='#'
            onClick={() => {
              if (policyUpdateId.length === 0) {
                setSelectedMenu([]);
                history.push(appPath.home.linkTo);
              } else {
                _setPolicyConfirmationInfo({
                  visibility: true,
                  okBtnFn: handleSwitchUserYouConfirmationModelOkBtn,
                  params: appPath.home.linkTo,
                });
              }
            }}
            data-cy='appLogoLink'
          >
            <img
              alt='Branding'
              src={collapsed ? collapsedBrandImage : brandImage}
              className={collapsed ? 'collapsed image' : 'image'}
            />
          </Link>
        </div>
      </Sider>

      <MyModal
        top={170}
        width={180}
        onCancel={openNavModal}
        visible={isNavModalVisible}
        className='add-item-menu-modal'
      >
        <Menu
          mode='vertical'
          inlineCollapsed={false}
          onClick={onNavItemClick}
          className='sidebar-add-item-menu'
        >
          {getMenuItems(addNewItems)}
        </Menu>
      </MyModal>

      <MyModal
        top={80}
        width={180}
        visible={isProfileModalOpen}
        onCancel={openProfileModal}
        className='user-profile-menu-modal'
      >
        <Menu
          mode='vertical'
          inlineCollapsed={false}
          onClick={onProfileItemClick}
          className='sidebar-user-profile-menu'
        >
          {getMenuItems(profileItems)}
          <Menu.Divider />
          <div className='logout-button-container'>
            <Button
              size='middle'
              type='default'
              className='logout-button'
              onClick={() => {
                toggleProfileModal(false);
                const isSSO = sessionStorage.getItem('AT') === 'SSO';
                _setConfirmationInfo({
                  forWhat: '',
                  extraInfo: '',
                  okText: isSSO ? 'Logout' : 'Yes',
                  cancelText: isSSO ? 'Cancel' : 'No',
                  visibility: true,
                  headerText: tenantRecords[0]?.logout_confirmation_msg,
                  bodyText: '',
                  okBtnFn: () => {
                    _resetConfirmationInfo();
                    _logoutUser(clearSessionStorage);
                  },
                  cancelBtnFn: () => {
                    _resetConfirmationInfo();
                  },
                  extraModelProps: isSSO
                    ? {
                        width: 670,
                      }
                    : undefined,
                });
              }}
              data-cy='logoutButton'
            >
              {/* <LogoutOutlined style={{ marginRight: 8 }} /> */}
              <Icon path={mdiLogout} style={{ marginRight: 8 }} />
              <Trans>Logout</Trans>
            </Button>
          </div>
        </Menu>
      </MyModal>
    </div>
  );
};

const mapStateToProps = (state: any) => {
  const { allowanceRecordsId } = state.AllowanceNewReducer;
  const { policyUpdateId } = state.policyConfiguration;
  return {
    tenantRecords: getTenantConfigRecords(state),
    userData: getUser(state),
    getPermissions: getPermissions(state),
    getIsBenefitsEnabled: getIsBenefitEnabled(state),
    users: getProxyUsers(state),
    currentDelegateUser: getCurrentDelegateUser(state),
    isDraftAllowed: isDraftMenuAllowed(state),
    isSubmittedAllowed: isSubmittedMenuAllowed(state),
    isApprovedAllowed: isApprovedMenuAllowed(state),
    tenant: getAuthTenant(state),
    isPermissionAllowed: (permission: PROXY_PERMISSIONS) =>
      isProxyPermissionAllowed(state, permission),
    tenantConfig: getAuthTenantConfig(state),
    allowanceRecordsId,
    policyUpdateId,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  return {
    _logoutUser: (callBack?: Function) => dispatch(logoutUser(callBack)),
    _fetchLoggedInUserInfo: () => dispatch(fetchLoggedInUserInfo()),
    _saveUserData: (userData: any) => dispatch(saveUserData(userData)),
    _fetchUsers: () => dispatch(fetchDelegateUsers()),
    _selectDelegateUser: (id: number) => dispatch(fetchCurrentDelegateUser(id)),
    _resetDelegateUser: () => {
      dispatch(
        configDelegationScreen({
          for: '',
          message: 'Configuring screen for you',
        }),
      );
      setTimeout(() => {
        dispatch(saveCurrentDelegateUser(undefined));
        dispatch(configDelegationScreen(undefined));
        dispatch(resetAllData());
      }, 100);
    },
    _setConfirmationInfo: (_data: IConfirmationInfo) =>
      dispatch(setConfirmationInfo(_data)),
    _resetConfirmationInfo: () => dispatch(resetConfirmationInfo()),
    _fetchTenants: () => dispatch(fetchTenantConfigList()),
    _deleteAllowanceRecordsWhilePageSwitch: (data: any, callBack?: Function) =>
      dispatch(deleteAllowanceRecordsWhilePageSwitch(data, callBack)),
    _setPolicyConfirmationInfo: (_data: any) =>
      dispatch(setPolicyConfirmationInfo(_data)),
    _resetPolicyConfirmationInfo: () => dispatch(resetPolicyConfirmationInfo()),
  };
};

const connector = connect(mapStateToProps, mapDispatchToProps);

export default connector(MenuDrawer);

type ModalPropsType = ModalProps & { top?: number };
const MyModal: React.FC<ModalPropsType> = props => {
  const { visible, onCancel } = props;
  return (
    <Modal
      visible={visible}
      style={{ position: 'absolute', left: 40, top: props.top }}
      bodyStyle={{ padding: 10 }}
      width={props.width}
      onCancel={onCancel}
      footer={null}
      mask={false}
      closable={false}
    >
      <div>{props.children}</div>
    </Modal>
  );
};
