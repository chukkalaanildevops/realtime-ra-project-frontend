/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import React, { PureComponent, ReactNode, Dispatch } from 'react';

import {
  Switch,
  withRouter,
  RouteComponentProps,
  Redirect,
  Route,
} from 'react-router-dom';

import { Alert, Layout, Spin, message } from 'antd';

import IdleTimer from 'react-idle-timer';

import {
  IappProps,
  IappState,
  TroutedConfig,
  IroutesConfigObject,
} from './app.model';

// import ReimburseLogo from '../../assets/images/branding/logo.png';

import { appPath } from './app.routes';

import {
  MenuDrawer,
  NotFound,
  Unauthorized,
  ProtectedRoute,
  ConfirmationModal,
  WorkflowDetails,
  NoInternetConnection,
  ErrorBoundary,
  // BrokenLink,
} from '../../shared/components';
import Dashboard from '../dashboard/dashboard.index';
import Draft from '../draft/draft.index';
import Admin from '../admin/admin.index';
import Setup from '../setup/setup.index';
import Settings from '../settings/settings.index';
import SetupConfiguration from '../configurations/configurations.index';
import EmployeeGroups from '../setup/component/other/employeeGroups/employeeGroupsListing/employeeGroupsListing.index';
import AddEmployeeGroups from '../setup/component/other/employeeGroups/addEmployeeGroups/addEmployeeGroups.index';
import CurrencyConversion from '../setup/component/other/currencyConversion/currencyConversion.index';
import AllowanceRate from '../setup/component/other/allowanceRate/allowanceRate.index';
import AddNewExpense from '../addNewExpense/addNewExpense.index';
import ExpenseTypeConfiguration from '../expenseTypeConfiguration/addExpenseTypeConfiguration/addExpenseTypeConfiguration.index';
import RequestTypeConfiguration from '../requestTypeConfiguration/addRequestTypeConfiguration/addRequestTypeConfiguration.index';
import BenefitTypeConfiguration from '../benefitTypeConfiguration/addBenefitTypeConfiguration/addBenefitTypeConfiguration.index';

import FileEncryption from '../fileEncryption/fileEncryption.index';
import FileEncryptionForm from '../fileEncryption/component/fileEncryptionForm/fileEncryptionForm.index';
// import FileEncryptionForm from '../fileEncryption/component/fileEncryptionForm/fileEncryptionForm.index';

import ExpenseTypeListing from '../expenseTypeConfiguration/expenseTypes/expenseTypes.index';
import ExpenseTypeLegalEntityListing from '../expenseTypeConfiguration/expenseTypeLegalEntityListing/expenseTypeLegalEntityListing.index';
import RequestTypeListing from '../requestTypeConfiguration/requestTypes/requestTypes.index';
import BenefitTypes from '../benefitTypeConfiguration/benefitTypes/benefitTypes.index';
import ClaimInspector from '../setup/component/other/claimDuplicateDetection/claimDuplicateDetection.index';
import BenefitCategories from '../setup/component/other/benefitCategories/benefitCategories.index';
import SFIntegration from '../sfIntegration/sfIntegration.index';
import JobLogs from '../sfIntegration/jobLogs/jobLogs.index';
import ReferenceObjectListing from '../referenceObject/referenceObjectListing/referenceObjectListing.index';
import AddReferenceObject from '../referenceObject/addReferenceObject/addReferenceObject.index';
import CostCentre from '../costCentreConfiguration/costCentreConfiguration.index';
import WageTypeConfiguration from '../wageTypeConfiguration/wageTypeConfiguration.index';
import GLAccount from '../glAccountConfiguration/glAccounts/glAccountConfiguration.index';
import GlAccountConfiguration from '../glAccountConfiguration/addUpdateGlAccount/addUpdateGlAccount.index';
import FileConfiguration from '../sfIntegration/fileMapping/fileMapping.index';
import JobStages from '../sfIntegration/jobTimeline/jobTimeline.index';
import RequestLegalEntityListing from '../requestTypeConfiguration/requestLegalEntityListing/requestLegalEntityListing.index';
import BenefitLegalEntityListing from '../benefitTypeConfiguration/benefitLegalEntityListing/benefitLegalEntityListing.index';
import EntityListing from '../legalEntityListing/legalEntityListing.index';
import AddRequest from '../requestTypeConfiguration/addRequest/addRequest.index';
import EntityHierarchy from '../legalEntityListing/entityHierarchy.index';
import Receipt from '../receipt/addReceipt/addReceipt.index';
import AddNewBenefit from '../benefits/addNewBenefit.index';
import RequestExpenseListing from '../submitted/requestExpensesList/requestExpensesList.index';
import SystemLabelsCustomisation from '../systemLabelsCustomisation/systemLabelsCustomisation.index';
import Outbound from '../outbound/outbound.index';
import Inbound from '../inbound/inbound.index';
import InboundJobLogs from '../inbound/components/InboundJobLogs.index';
import { Trans } from '@lingui/macro';
import ShowAllSearch from '../showAllSearch/showAllSearch.index';
import ShowAllExpensesSearch from '../../pages/showAllSearch/components/ShowAllExpensesSearch/ShowAllExpensesSearch.index';
import ShowAllRequestsSearch from '../../pages/showAllSearch/components/ShowAllRequestsSearch/ShowAllRequestsSearch.index';
import ShowAllBenefitsSearch from '../../pages/showAllSearch/components/ShowAllBenefitsSearch/ShowAllBenefitsSearch.index';
import ShowBenefitDetailsSearch from '../../pages/showAllSearch/components/ShowBenefitDetailSearch/ShowBenefitDetailsSearch.index';
import ShowExpenseDetailsSearch from '../../pages/showAllSearch/components/ShowExpenseDetailsSearch/ShowExpenseDetailsSearch.index';
import ShowRequestDetailsSearch from '../../pages/showAllSearch/components/ShowRequestDetailsSearch/ShowRequestDetailsSearch.index';
import ShowAllUsersSearch from '../../pages/showAllSearch/components/ShowAllUsersSearch/ShowAllUsersSearch.index';

import {
  getLocalization,
  getAuthToken,
  stateInterface,
  getPermissions,
  getIsBenefitEnabled,
  getTenantConfigRecords,
  isDraftMenuAllowed,
  isSubmittedMenuAllowed,
  isApprovedMenuAllowed,
  isProxyPermissionAllowed,
  getDelegateScreenConfig,
  getUsersListForDDLoader,
  getIsPresentInTargetAudience,
} from '../../shared/redux/rootReducer';
import Store from '../../shared/redux/store/store.index';
import { connect, ConnectedProps } from 'react-redux';
import Login from '../auth/login.index';
import { restoreData } from '../../shared/redux/auth/auth.thunk';
import { getQueryString, loadScript } from '../../utils/scroll.utils';
import { saveToken } from '../../shared/redux/auth/auth.actions';
import { AddRequestForm } from '../requestTypeConfiguration/addRequest/components';
import Reports from '../reports/reports.index';
import Approvals from '../approvals/approvals.index';
import AddRule from '../setup/component/other/rule/addUpdateRule/addUpdateRule.index';
import RulesListing from '../setup/component/other/rule/ruleListing/ruleListing.index';
import Submitted from '../submitted/submitted.index';
import RequestAddNewExpense from '../submitted/addNewExpense/addNewExpense.index';
import UserProfile from '../userProfile/userProfile.index';
import OtherUserProfile from '../userProfile/otherUserProfile.index';
import RoleListing from '../setup/component/other/roles/list/roleListing.index';
import AddUpdateRole from '../setup/component/other/roles/addUpdateRole/addUpdateRole.index';
import Delegate from '../delegate/delegate.index';
import AdminDelegate from '../setup/component/other/adminDelegate/adminDelegate.index';
import DelegateUsers from '../delegateUsers/delegateUsers.index';
import EmailTemplates from '../setup/component/other/emailTemplates/emailTemplates.index';
import PolicyConfiguration from '../setup/component/other/policyConfiguration/policyConfiguration.index';
import PolicyConfigurationUpdate from '../setup/component/other/policyConfiguration/policyUpdate/policyUpdate.index';
import RedirectLogin from '../auth/redirect.index';
import deviceManagement from '../deviceManagement/deviceManagement.index';
import { apiCallReset, resetWorkflowData } from './app.actions';
import { addApproverPostAPI, updateApproverPostAPI } from './app.thunk';
import { logoutUser } from '../../shared/redux/auth/auth.thunk';
import { PROXY_PERMISSIONS } from '../delegate/delegate.model';
import PastJobExecutionLogs from '../inbound/components/pastJobExecutionLogs.index';
import { i18n } from '@lingui/core';
import {
  withStorageListener,
  withDocumentVisibilityListener,
} from '../../shared/hoc/';
import ExpensesAuditReport from '../auditLogs/expensesAuditReport.index';
import { clearSessionStorage } from '../../utils/global.utils';
import Dashboards from '../dashboards/dashboards.index';
import EntitlementRuleListing from '../setup/component/other/entitlementRule/entitlementRuleListing/entitlementRuleListing.index';
import SimulationView from '../setup/component/other/entitlementRule/simulationView/simulationView.index';
import AddEntitlementRule from '../setup/component/other/entitlementRule/addUpdateEntitlementRule/addUpdateEntitlementRule.index';
import RiskScoreRange from '../setup/component/other/riskScoreRange/riskScoreRange.index';
import { checkAppVersion } from '../../services/app';

const isActionAllowed = (permissionCode: string, userId: number): boolean => {
  return getIsPresentInTargetAudience(Store.getState(), permissionCode, userId);
};
type AppProps = IappProps &
  RouteComponentProps &
  ConnectedProps<typeof connector>;
class App extends PureComponent<AppProps, IappState> {
  idleTimer: null | IdleTimer;
  constructor(props: AppProps) {
    super(props);
    this.state = {
      isOnline: true,
      showModal: false,
      isTimedOut: false,
    };

    this.idleTimer = null;

    const isAuthenticated = getQueryString('isAuthenticated');
    if (isAuthenticated) {
      const token = getQueryString('token');
      const sId = getQueryString('sId');
      this.props._saveToken(token || '');

      if (sId !== undefined && sId !== null) {
        sessionStorage.setItem('sId', sId);
      }

      const url = window.location.href;
      const nav = url.split('/?')[0];
      window.location.href = nav;
    }
    props._restoreData(); //restoring data
  }

  /**
   * componentDidMount lifecycle method
   */
  componentDidMount() {
    loadScript();
    checkAppVersion();
    window.addEventListener('online', this.handleOnlineState.bind(this, true));
    window.addEventListener(
      'offline',
      this.handleOnlineState.bind(this, false),
    );
    window.addEventListener('beforeunload', this.beforeUnloadListener);
  }

  /**
   * componentWillUnmount lifecycle method
   */

  componentWillUnmount() {
    window.removeEventListener(
      'online',
      this.handleOnlineState.bind(this, true),
    );

    window.removeEventListener(
      'offline',
      this.handleOnlineState.bind(this, false),
    );

    window.removeEventListener('beforeunload', this.beforeUnloadListener);
  }

  beforeUnloadListener() {
    if (sessionStorage.getItem('USER_LOGGED_OUT') === 'active')
      sessionStorage.removeItem('USER_LOGGED_OUT');
  }

  handleOnlineState(isOnline: boolean) {
    this.setState({ isOnline });
  }

  _onAction() {
    this.setState({ isTimedOut: false });
  }

  _onActive() {
    this.setState({ isTimedOut: false });
  }

  _onIdle() {
    const isTimedOut = this.state.isTimedOut;
    if (!isTimedOut && this.props.isAuthenticated) {
      this.setState({ showModal: true });
      sessionStorage.removeItem('USER_DATA');
      sessionStorage.removeItem('TOKEN');
      window.localStorage.setItem('CREDENTIALS_FLUSH', Date.now().toString());
      window.localStorage.removeItem('CREDENTIALS_FLUSH');
      if (this?.idleTimer?.reset) this.idleTimer.reset();
      this.setState({ isTimedOut: true });
    }
  }

  redirectToLogin(forLoggedOutUser: boolean = false) {
    if (forLoggedOutUser) this.props._restoreData();
    else this.props._logoutUser();

    this.setState({ showModal: false });
    // sessionStorage.removeItem('USER_LOGGED_OUT');
    clearSessionStorage();
  }

  handleWorkflowDetailsClose() {
    this.props._resetWorkflowData();
  }

  handleWorkflowDetailsApproverAdd(
    approvers: number[],
    stepId: number,
    isAdd: boolean,
  ) {
    const {
      WorkflowDetailsComponentProps,
      _addApproverPostAPI,
      _updateApproverPostAPI,
    } = this.props;
    isAdd
      ? _addApproverPostAPI(stepId, approvers)
      : _updateApproverPostAPI(stepId, approvers);

    WorkflowDetailsComponentProps.onApproverSelection &&
      WorkflowDetailsComponentProps.onApproverSelection(
        approvers,
        stepId,
        isAdd,
      );
  }

  render() {
    const {
      confirmationInfo,
      WorkflowDetailsComponentProps,
      workflowData,
      workflowDataLoader,
      apiError,
      info,
      isBenefitEnable,
      error,
      success,
      local,
      isLoading,
      _apiCallReset,
      isLoggedInUser,
      isApprovalAllowed,
      // isDraftAllowed,
      // isSubmitAllowed,
      isPermissionAllowed,
      configScreen,
      activeUsers,
      usersLoader,
    } = this.props;
    const tenentConfigRecordJSON = sessionStorage.getItem('USER_DATA');
    const tenentConfigRecord =
      tenentConfigRecordJSON && JSON.parse(tenentConfigRecordJSON);
    // const tenentConfigRecord = this.props.getTenantConfigRecords[0];
    const tenentConfig =
      tenentConfigRecord && tenentConfigRecord['is_benefits_enabled'];
    const isBenefitEnabled = tenentConfig ? tenentConfig : false;
    const routesConfig: TroutedConfig = [
      {
        path: appPath.home.path,
        Component: Dashboard,
        exact: true,
      },
      {
        path: appPath.receipt.add.path,
        Component: Receipt,
        exact: true,
        isAuthorized: isPermissionAllowed('ACTION_RECEIPT'),
      },
      {
        path: appPath.benefit.add.path,
        Component: AddNewBenefit,
        exact: true,
        isAuthorized:
          isBenefitEnabled ||
          (this.props.getPermissions.VIEW_SETUP &&
            this.props.getPermissions.VIEW_SETUP_BENEFIT_TYPES &&
            isLoggedInUser),
      },
      {
        path: appPath.benefit.update.path,
        Component: AddNewBenefit,
        exact: true,
        isAuthorized:
          isBenefitEnabled ||
          (this.props.getPermissions.VIEW_SETUP &&
            this.props.getPermissions.VIEW_SETUP_BENEFIT_TYPES &&
            isLoggedInUser),
      },
      {
        path: appPath.addNewExpense.add.path,
        Component: AddNewExpense,
        exact: true,
        isAuthorized: isPermissionAllowed('ACTION_EXPENSE'),
      },
      {
        isAuthorized: isPermissionAllowed('ACTION_EXPENSE'),
        path: appPath.addNewExpense.redirectAdd.path,
        Component: () => (
          <Redirect to={appPath.addNewExpense.add.linkTo + 'general/'} />
        ),
        exact: true,
      },
      {
        isAuthorized: isPermissionAllowed('ACTION_EXPENSE'),
        path: appPath.addNewExpense.update.path,
        Component: AddNewExpense,
        exact: true,
      },
      {
        path: appPath.dashboard.path,
        Component: Dashboard,
        exact: true,
      },
      {
        path: appPath.insights.path,
        Component: Dashboards,
        exact: true,
        isAuthorized:
          (process.env.REACT_APP_ENVIRONMENT &&
            ['DEVELOPMENT', 'SAP_STAGING', 'QA'].includes(
              process.env.REACT_APP_ENVIRONMENT,
            )) ||
          false,
      },
      {
        // isAuthorized: isDraftAllowed,
        path: appPath.drafts.path,
        Component: Draft,
        exact: true,
      },
      {
        path: appPath.deviceManagement.path,
        Component: deviceManagement,
        exact: true,
      },
      {
        isAuthorized: this.props.getPermissions.VIEW_SETUP && isLoggedInUser,
        path: appPath.config_setup.fileEncryption.path,
        Component: FileEncryption,
        exact: true,
      },
      {
        isAuthorized: this.props.getPermissions.VIEW_SETUP && isLoggedInUser,
        path: appPath.config_setup.fileEncryption.add.path,
        Component: FileEncryptionForm,
        exact: true,
      },
      {
        isAuthorized: this.props.getPermissions.VIEW_SETUP && isLoggedInUser,
        path: appPath.config_setup.fileEncryption.update.path,
        Component: FileEncryptionForm,
        exact: true,
      },

      {
        isAuthorized:
          this.props.getPermissions.VIEW_SETUP &&
          this.props.getPermissions.VIEW_SETUP_EXPENSE_TYPES &&
          isLoggedInUser,
        path: appPath.config_setup.expenseType.path,
        Component: ExpenseTypeListing,
        exact: true,
      },
      {
        isAuthorized:
          this.props.getPermissions.VIEW_SETUP &&
          this.props.getPermissions.VIEW_SETUP_EXPENSE_TYPES &&
          this.props.getPermissions.ACTION_SETUP_EXPENSE_TYPES &&
          isLoggedInUser,
        path: appPath.config_setup.expenseType.add.path,
        Component: ExpenseTypeConfiguration,
        exact: true,
      },
      {
        isAuthorized:
          this.props.getPermissions.VIEW_SETUP &&
          this.props.getPermissions.VIEW_SETUP_EXPENSE_TYPES &&
          this.props.getPermissions.ACTION_SETUP_EXPENSE_TYPES &&
          isLoggedInUser,
        path: appPath.config_setup.expenseType.update.path,
        Component: ExpenseTypeConfiguration,
        exact: true,
      },
      {
        isAuthorized:
          this.props.getPermissions.VIEW_SETUP &&
          this.props.getPermissions.VIEW_SETUP_EXPENSE_TYPES &&
          this.props.getPermissions.ACTION_SETUP_EXPENSE_TYPES &&
          isLoggedInUser,
        path:
          appPath.config_setup.expenseType.legalEntityListing.customize.path,
        Component: ExpenseTypeConfiguration,
        exact: true,
      },
      {
        isAuthorized:
          this.props.getPermissions.VIEW_SETUP &&
          this.props.getPermissions.VIEW_SETUP_EXPENSE_TYPES &&
          isLoggedInUser,
        path: appPath.config_setup.expenseType.legalEntityListing.path,
        Component: ExpenseTypeLegalEntityListing,
        exact: true,
      },
      {
        isAuthorized:
          this.props.getPermissions.VIEW_SETUP &&
          this.props.getPermissions.VIEW_SETUP_REQUEST_TYPES &&
          isLoggedInUser,
        path: appPath.config_setup.requestType.path,
        Component: RequestTypeListing,
        exact: true,
      },
      {
        isAuthorized:
          this.props.getPermissions.VIEW_SETUP &&
          this.props.getPermissions.VIEW_SETUP_REQUEST_TYPES &&
          this.props.getPermissions.ACTION_SETUP_REQUEST_TYPES &&
          isLoggedInUser,
        path: appPath.config_setup.requestType.add.path,
        Component: RequestTypeConfiguration,
        exact: true,
      },
      {
        isAuthorized:
          this.props.getPermissions.VIEW_SETUP &&
          this.props.getPermissions.VIEW_SETUP_REQUEST_TYPES &&
          this.props.getPermissions.ACTION_SETUP_REQUEST_TYPES &&
          isLoggedInUser,
        path: appPath.config_setup.requestType.update.path,
        Component: RequestTypeConfiguration,
        exact: true,
      },
      {
        isAuthorized:
          this.props.getPermissions.VIEW_SETUP &&
          this.props.getPermissions.VIEW_SETUP_REQUEST_TYPES &&
          isLoggedInUser,
        path: appPath.config_setup.requestType.legalEntityListing.path,
        Component: RequestLegalEntityListing,
        exact: true,
      },
      {
        isAuthorized:
          this.props.getPermissions.VIEW_SETUP &&
          this.props.getPermissions.VIEW_SETUP_REQUEST_TYPES &&
          this.props.getPermissions.ACTION_SETUP_REQUEST_TYPES &&
          isLoggedInUser,
        path:
          appPath.config_setup.requestType.legalEntityListing.customize.path,
        Component: RequestTypeConfiguration,
        exact: true,
      },
      {
        path: appPath.addNew.addRequest.path,
        Component: AddRequest,
        exact: true,
        isAuthorized: isPermissionAllowed('ACTION_REQUEST'),
      },
      {
        path: appPath.addNew.addRequest.update.path,
        Component: AddRequestForm,
        exact: true,
        isAuthorized: isPermissionAllowed('ACTION_REQUEST'),
      },
      {
        isAuthorized:
          isBenefitEnabled ||
          (this.props.getPermissions.VIEW_SETUP &&
            this.props.getPermissions.VIEW_SETUP_BENEFIT_TYPES &&
            isLoggedInUser),
        path: appPath.config_setup.benefitType.path,
        Component: BenefitTypes,
        exact: true,
      },
      {
        isAuthorized:
          isBenefitEnabled ||
          (this.props.getPermissions.VIEW_SETUP &&
            this.props.getPermissions.VIEW_SETUP_BENEFIT_TYPES &&
            isLoggedInUser),
        path: appPath.config_setup.benefitType.add.path,
        Component: BenefitTypeConfiguration,
        exact: true,
      },
      {
        isAuthorized:
          isBenefitEnabled ||
          (this.props.getPermissions.VIEW_SETUP &&
            this.props.getPermissions.VIEW_SETUP_BENEFIT_TYPES &&
            isLoggedInUser),
        path: appPath.config_setup.benefitType.update.path,
        Component: BenefitTypeConfiguration,
        exact: true,
      },
      {
        isAuthorized:
          isBenefitEnabled ||
          (this.props.getPermissions.VIEW_SETUP &&
            this.props.getPermissions.VIEW_SETUP_BENEFIT_TYPES &&
            isLoggedInUser),
        path: appPath.config_setup.benefitType.legalEntityListing.path,
        Component: BenefitLegalEntityListing,
        exact: true,
      },
      {
        isAuthorized:
          isBenefitEnabled ||
          (this.props.getPermissions.VIEW_SETUP &&
            this.props.getPermissions.VIEW_SETUP_BENEFIT_TYPES &&
            isLoggedInUser),
        path:
          appPath.config_setup.benefitType.legalEntityListing.customize.path,
        Component: BenefitTypeConfiguration,
        exact: true,
      },
      {
        isAuthorized:
          this.props.getPermissions.VIEW_SETUP &&
          this.props.getPermissions.VIEW_SETUP_ROLES &&
          isLoggedInUser,
        path: appPath.config_setup.roles.path,
        Component: RoleListing,
        exact: true,
      },
      {
        isAuthorized:
          this.props.getPermissions.VIEW_SETUP &&
          this.props.getPermissions.ACTION_SETUP_ROLES &&
          isLoggedInUser,
        path: appPath.config_setup.roles.add.path,
        Component: AddUpdateRole,
        exact: true,
      },
      {
        isAuthorized:
          this.props.getPermissions.VIEW_SETUP &&
          this.props.getPermissions.ACTION_SETUP_ROLES &&
          isLoggedInUser,
        path: appPath.config_setup.roles.update.path,
        Component: AddUpdateRole,
        exact: true,
      },
      {
        // isAuthorized:
        //   this.props.getPermissions.VIEW_SETUP &&
        //   this.props.getPermissions.VIEW_SETUP_EMAIL_TEMPLATES &&
        //   isLoggedInUser,
        isAuthorized: true,
        path: appPath.config_setup.emailTemplates.path,
        Component: EmailTemplates,
        exact: true,
      },
      {
        isAuthorized: true,
        path: appPath.config_setup.riskScoreRange.path,
        Component: RiskScoreRange,
        exact: true,
      },
      {
        isAuthorized: true,
        path: appPath.config_setup.policyConfiguration.path,
        Component: PolicyConfiguration,
        exact: true,
      },
      {
        isAuthorized: true,
        path: appPath.config_setup.policyConfiguration.update.path,
        Component: PolicyConfigurationUpdate,
        exact: true,
      },
      {
        isAuthorized:
          this.props.getPermissions.VIEW_SETUP &&
          this.props.getPermissions.VIEW_SETUP_EMPLOYEE_GROUPS &&
          isLoggedInUser,
        path: appPath.config_setup.employeeGroups.path,
        Component: EmployeeGroups,
        exact: true,
      },
      {
        isAuthorized:
          this.props.getPermissions.VIEW_SETUP &&
          this.props.getPermissions.VIEW_SETUP_EMPLOYEE_GROUPS &&
          this.props.getPermissions.ACTION_SETUP_EMPLOYEE_GROUPS &&
          isLoggedInUser,
        path: appPath.config_setup.employeeGroups.add.path,
        Component: AddEmployeeGroups,
        exact: true,
      },
      {
        isAuthorized:
          this.props.getPermissions.VIEW_SETUP &&
          this.props.getPermissions.VIEW_SETUP_EMPLOYEE_GROUPS &&
          this.props.getPermissions.ACTION_SETUP_EMPLOYEE_GROUPS &&
          isLoggedInUser,
        path: appPath.config_setup.employeeGroups.update.path,
        Component: AddEmployeeGroups,
        exact: true,
      },
      {
        isAuthorized:
          this.props.getPermissions.VIEW_SETUP &&
          //this.props.getPermissions.VIEW_SETUP_ALLOWANCE_RATE &&
          isLoggedInUser,
        path: appPath.config_setup.allowanceRate.path,
        Component: AllowanceRate,
        exact: true,
      },
      {
        isAuthorized:
          this.props.getPermissions.VIEW_SETUP &&
          //this.props.getPermissions.VIEW_SETUP_ALLOWANCE_RATE &&
          isLoggedInUser,
        path: appPath.config_setup.benefitCategories.path,
        Component: BenefitCategories,
        exact: true,
      },
      {
        isAuthorized:
          this.props.getPermissions.VIEW_SETUP &&
          this.props.getPermissions.VIEW_SETUP_CURRENCY_CONVERSIONS &&
          isLoggedInUser,
        path: appPath.config_setup.currencyConversion.path,
        Component: CurrencyConversion,
        exact: true,
      },
      {
        isAuthorized:
          this.props.getPermissions.VIEW_SETUP &&
          this.props.getPermissions.VIEW_SETUP_REFERENCE_OBJECTS &&
          isLoggedInUser,
        path: appPath.config_setup.referenceObjects.path,
        Component: ReferenceObjectListing,
        exact: true,
      },
      {
        isAuthorized:
          this.props.getPermissions.VIEW_SETUP &&
          this.props.getPermissions.VIEW_SETUP_REFERENCE_OBJECTS &&
          this.props.getPermissions.ACTION_SETUP_REFERENCE_OBJECTS &&
          isLoggedInUser,
        path: appPath.config_setup.referenceObjects.add.path,
        Component: AddReferenceObject,
        exact: true,
      },
      {
        isAuthorized:
          this.props.getPermissions.VIEW_SETUP &&
          this.props.getPermissions.VIEW_SETUP_REFERENCE_OBJECTS &&
          this.props.getPermissions.ACTION_SETUP_REFERENCE_OBJECTS &&
          isLoggedInUser,
        path: appPath.config_setup.referenceObjects.update.path,
        Component: AddReferenceObject,
        exact: true,
      },
      {
        isAuthorized: this.props.getPermissions.VIEW_SETTINGS && isLoggedInUser,
        path: appPath.settings.systemLabelsCustomisation.path,
        Component: SystemLabelsCustomisation,
        exact: true,
      },
      {
        isAuthorized: this.props.getPermissions.VIEW_SETTINGS && isLoggedInUser,
        path: appPath.settings.sfIntegration.path,
        Component: SFIntegration,
        exact: true,
      },
      {
        isAuthorized: this.props.getPermissions.VIEW_SETTINGS && isLoggedInUser,
        path: appPath.settings.sfIntegration.logs.path,
        Component: JobLogs,
        exact: true,
      },
      {
        isAuthorized: this.props.getPermissions.VIEW_SETTINGS && isLoggedInUser,
        path: appPath.settings.sfIntegration.stages.path,
        Component: JobStages,
        exact: true,
      },
      {
        isAuthorized: this.props.getPermissions.VIEW_SETTINGS && isLoggedInUser,
        path: appPath.settings.sfIntegration.fileConfiguration.path,
        Component: FileConfiguration,
        exact: true,
      },
      {
        isAuthorized: this.props.getPermissions.VIEW_SETTINGS && isLoggedInUser,
        path: appPath.settings.configuration.path,
        Component: SetupConfiguration,
        exact: true,
      },
      {
        isAuthorized: this.props.getPermissions.VIEW_SETTINGS && isLoggedInUser,
        path: appPath.settings.path,
        Component: Settings,
        exact: true,
      },
      {
        isAuthorized: this.props.getPermissions.VIEW_SETUP && isLoggedInUser,
        path: appPath.config_setup.path,
        Component: Setup,
        exact: true,
      },
      {
        path: appPath.root.path,
        Component: Dashboard,
        exact: true,
      },
      {
        isAuthorized:
          this.props.getPermissions.VIEW_SETUP &&
          this.props.getPermissions.ACTION_SETUP_CLAIM_INSPECTOR &&
          isLoggedInUser,
        path: appPath.config_setup.claimInspector.path,
        Component: ClaimInspector,
        exact: true,
      },
      {
        isAuthorized:
          this.props.getPermissions.VIEW_SETUP &&
          this.props.getPermissions.VIEW_SETUP_COST_CENTRES &&
          isLoggedInUser,
        path: appPath.config_setup.costCentre.path,
        Component: CostCentre,
        exact: true,
      },
      {
        isAuthorized:
          this.props.getPermissions.VIEW_SETUP &&
          this.props.getPermissions.VIEW_SETUP_WAGE_TYPES &&
          isLoggedInUser,
        path: appPath.config_setup.wageType.path,
        Component: WageTypeConfiguration,
        exact: true,
      },
      {
        isAuthorized:
          this.props.getPermissions.VIEW_SETUP &&
          this.props.getPermissions.VIEW_SETUP_GL_ACCOUNTS &&
          isLoggedInUser,
        path: appPath.config_setup.glAccounts.path,
        Component: GLAccount,
        exact: true,
      },
      {
        isAuthorized:
          this.props.getPermissions.VIEW_SETUP &&
          this.props.getPermissions.VIEW_SETUP_GL_ACCOUNTS &&
          this.props.getPermissions.ACTION_SETUP_GL_ACCOUNTS &&
          isLoggedInUser,
        path: appPath.config_setup.glAccounts.add.path,
        Component: GlAccountConfiguration,
        exact: true,
      },
      {
        isAuthorized:
          this.props.getPermissions.VIEW_SETUP &&
          this.props.getPermissions.VIEW_SETUP_GL_ACCOUNTS &&
          this.props.getPermissions.ACTION_SETUP_GL_ACCOUNTS &&
          isLoggedInUser,
        path: appPath.config_setup.glAccounts.update.path,
        Component: GlAccountConfiguration,
        exact: true,
      },
      {
        isAuthorized:
          this.props.getPermissions.VIEW_SETUP &&
          this.props.getPermissions.VIEW_SETUP_ENTITIES &&
          isLoggedInUser,
        path: appPath.config_setup.entityTypes.path,
        Component: EntityListing,
        exact: true,
      },
      {
        isAuthorized:
          this.props.getPermissions.VIEW_SETUP &&
          this.props.getPermissions.VIEW_SETUP_ENTITIES &&
          isLoggedInUser,
        path: appPath.config_setup.entityTypes.viewHierarchy.path,
        Component: EntityHierarchy,
        exact: true,
      },

      {
        isAuthorized:
          this.props.getPermissions.VIEW_SETUP &&
          this.props.getPermissions.VIEW_SETUP_RULES &&
          isLoggedInUser,
        path: appPath.config_setup.rules.path,
        Component: RulesListing,
        exact: true,
      },
      {
        isAuthorized: isLoggedInUser,
        path: appPath.config_setup.entitlementRules.path,
        Component: EntitlementRuleListing,
        exact: true,
      },
      {
        isAuthorized: isLoggedInUser,
        path: appPath.config_setup.entitlementRules.simulate.path,
        Component: SimulationView,
        exact: true,
      },
      {
        isAuthorized:
          // this.props.getPermissions.VIEW_SETUP &&
          isLoggedInUser,
        path: appPath.config_setup.entitlementRules.add.path,
        Component: AddEntitlementRule,
        exact: true,
      },
      {
        isAuthorized:
          // this.props.getPermissions.VIEW_SETUP &&
          isLoggedInUser,
        path: appPath.config_setup.entitlementRules.update.path,
        Component: AddEntitlementRule,
        exact: true,
      },
      // adminDelegations
      {
        isAuthorized: this.props.getPermissions.VIEW_SETUP && isLoggedInUser,
        path: appPath.config_setup.adminDelegations.path,
        Component: AdminDelegate,
        exact: true,
      },
      // search_results
      {
        isAuthorized: isLoggedInUser,
        path: appPath.search.path,
        Component: ShowAllSearch,
        exact: true,
      },
      // search_users_results
      {
        isAuthorized: isLoggedInUser,
        path: appPath.search.users.path,
        Component: ShowAllUsersSearch,
        exact: true,
      },
      // search_expenses_results
      {
        isAuthorized: isLoggedInUser,
        path: appPath.search.expenses.path,
        Component: ShowAllExpensesSearch,
        exact: true,
      },
      // search_benefits_results
      {
        isAuthorized: isLoggedInUser,
        path: appPath.search.benefits.path,
        Component: ShowAllBenefitsSearch,
        exact: true,
      },
      // search_requests_results
      {
        isAuthorized: isLoggedInUser,
        path: appPath.search.requests.path,
        Component: ShowAllRequestsSearch,
        exact: true,
      },
      // search_expense_details_results
      {
        isAuthorized: isLoggedInUser,
        path: appPath.search.expenses.details.path,
        Component: ShowExpenseDetailsSearch,
        exact: true,
      },
      // search_request_details_results
      {
        isAuthorized: isLoggedInUser,
        path: appPath.search.requests.details.path,
        Component: ShowRequestDetailsSearch,
        exact: true,
      },
      // search_benefit_details_results
      {
        isAuthorized: isLoggedInUser,
        path: appPath.search.benefits.details.path,
        Component: ShowBenefitDetailsSearch,
        exact: true,
      },
      {
        isAuthorized:
          this.props.getPermissions.VIEW_SETUP &&
          this.props.getPermissions.VIEW_SETUP_RULES &&
          this.props.getPermissions.ACTION_SETUP_RULES &&
          isLoggedInUser,
        path: appPath.config_setup.rules.add.path,
        Component: AddRule,
        exact: true,
      },
      {
        isAuthorized:
          this.props.getPermissions.VIEW_SETUP &&
          this.props.getPermissions.VIEW_SETUP_RULES &&
          this.props.getPermissions.ACTION_SETUP_RULES &&
          isLoggedInUser,
        path: appPath.config_setup.rules.update.path,
        Component: AddRule,
        exact: true,
      },
      {
        isAuthorized: isApprovalAllowed,
        path: appPath.approvals.path,
        Component: Approvals,
        exact: true,
      },
      {
        // isAuthorized: isPermissionAllowed('ACTION_EXPENSE_APPROVAL'),
        path: appPath.approvals.expenses.path,
        Component: Approvals,
        exact: true,
      },
      {
        // isAuthorized: isPermissionAllowed('ACTION_REQUEST_APPROVAL'),
        path: appPath.approvals.requests.path,
        Component: Approvals,
        exact: true,
      },
      {
        // isAuthorized: isPermissionAllowed('ACTION_EXPENSE_APPROVAL'),
        path: appPath.approvals.expensesWithRequest.path,
        Component: Approvals,
        exact: true,
      },
      {
        // isAuthorized: isPermissionAllowed('ACTION_BENEFIT_APPROVAL'),
        path: appPath.approvals.benefits.path,
        Component: Approvals,
        exact: true,
      },
      {
        // isAuthorized: isSubmitAllowed,
        path: appPath.submitted.path,
        Component: Submitted,
        exact: true,
      },
      {
        isAuthorized: isPermissionAllowed('ACTION_EXPENSE'),
        path: appPath.submitted.expenses.path,
        Component: RequestExpenseListing,
        exact: true,
      },
      {
        path: appPath.expenses.path,
        Component: ExpensesAuditReport,
        exact: true,
      },
      {
        isAuthorized: isPermissionAllowed('ACTION_EXPENSE'),
        path: appPath.submitted.expenses.addNew.path,
        Component: RequestAddNewExpense,
        exact: true,
      },
      {
        isAuthorized: isPermissionAllowed('ACTION_EXPENSE'),
        path: appPath.submitted.expenses.update.path,
        Component: RequestAddNewExpense,
        exact: true,
      },
      {
        path: appPath.profile.path,
        Component: UserProfile,
        exact: true,
      },
      {
        path: appPath.profile.otherUser.path,
        Component: OtherUserProfile,
        exact: true,
      },
      {
        isAuthorized: isLoggedInUser,
        path: appPath.reports.path,
        Component: Reports,
        exact: true,
      },
      {
        isAuthorized: isLoggedInUser,
        path: appPath.reports.expense.path,
        Component: Reports,
        exact: true,
      },
      {
        isAuthorized: isLoggedInUser,
        path: appPath.reports.request.path,
        Component: Reports,
        exact: true,
      },
      {
        isAuthorized: isLoggedInUser,
        path: appPath.reports.expensesWithRequest.path,
        Component: Reports,
        exact: true,
      },
      {
        isAuthorized: isLoggedInUser,
        path: appPath.reports.cashAdvanceRequest.path,
        Component: Reports,
        exact: true,
      },
      {
        isAuthorized: isLoggedInUser,
        path: appPath.reports.benefit.path,
        Component: Reports,
        exact: true,
      },
      {
        isAuthorized: isLoggedInUser,
        path: appPath.reports.benefitEntitlement.path,
        Component: Reports,
        exact: true,
      },
      {
        isAuthorized: isLoggedInUser,
        path: appPath.reports.specialisedReport.path,
        Component: Reports,
        exact: true,
      },
      {
        isAuthorized: isLoggedInUser,
        path: appPath.reports.specialisedBenefitReport.path,
        Component: Reports,
        exact: true,
      },
      {
        isAuthorized: this.props.getPermissions.VIEW_ADMIN && isLoggedInUser,
        path: appPath.admin.path,
        Component: Admin,
        exact: true,
      },
      {
        isAuthorized: this.props.getPermissions.VIEW_ADMIN && isLoggedInUser,
        path: appPath.admin.expenseClaims.path,
        Component: Admin,
        exact: true,
      },
      {
        isAuthorized: this.props.getPermissions.VIEW_ADMIN && isLoggedInUser,
        path: appPath.admin.requests.path,
        Component: Admin,
        exact: true,
      },
      {
        isAuthorized: this.props.getPermissions.VIEW_ADMIN && isLoggedInUser,
        path: appPath.admin.cashAdvanceRequests.path,
        Component: Admin,
        exact: true,
      },
      {
        isAuthorized: this.props.getPermissions.VIEW_ADMIN && isLoggedInUser,
        path: appPath.admin.expensesWithRequests.path,
        Component: Admin,
        exact: true,
      },
      {
        isAuthorized: this.props.getPermissions.VIEW_ADMIN && isLoggedInUser,
        path: appPath.admin.benefits.path,
        Component: Admin,
        exact: true,
      },
      {
        isAuthorized: this.props.getPermissions.VIEW_ADMIN && isLoggedInUser,
        path: appPath.admin.benefitEntitlement.path,
        Component: Admin,
        exact: true,
      },
      {
        isAuthorized: this.props.getPermissions.VIEW_ADMIN && isLoggedInUser,
        path: appPath.admin.expenseEntitlement.path,
        Component: Admin,
        exact: true,
      },
      {
        path: appPath.delegate.path,
        Component: Delegate,
        exact: true,
      },
      {
        path: appPath.delegateUsers.path,
        Component: DelegateUsers,
        exact: true,
      },
      {
        path: appPath.settings.outbound.path,
        Component: Outbound,
        exact: true,
        isAuthorized: isLoggedInUser,
      },
      {
        path: appPath.settings.inbound.path,
        Component: Inbound,
        exact: true,
        isAuthorized: isLoggedInUser,
      },
      {
        path: appPath.settings.inbound.logs.path,
        Component: InboundJobLogs,
        exact: true,
        isAuthorized: isLoggedInUser,
      },
      {
        path: appPath.settings.inbound.stages.path,
        Component: PastJobExecutionLogs,
        exact: true,
        isAuthorized: isLoggedInUser,
      },
      {
        path: appPath.notFound.path,
        Component: NotFound,
        exact: true,
      },

      {
        path: appPath.unauthorized.path,
        Component: Unauthorized,
        exact: true,
      },
      {
        path: appPath.all.path,
        Component: () => <Redirect to={appPath.notFound.linkTo} />,
        exact: false,
      },
    ];

    const routesComponent: ReactNode[] = routesConfig.map(
      (o: IroutesConfigObject, _i: number) => (
        <ProtectedRoute key={_i} {...o} />
      ),
    );
    i18n.activate(local);
    const menuVisibilityCondition =
      String(this.props.location.pathname) === '/404';

    const menuVisibility: boolean =
      menuVisibilityCondition || !this.props.isAuthenticated ? false : true;

    const hasUserLoggedOutInStorage = Boolean(
      sessionStorage.getItem('USER_LOGGED_OUT') === 'true',
    );
    const showLoggedOutModal: boolean =
      (hasUserLoggedOutInStorage && this.props.tabIsActiveNow) ||
      sessionStorage.getItem('USER_LOGGED_OUT') === 'active';

    if (showLoggedOutModal) {
      sessionStorage.setItem('USER_LOGGED_OUT', 'active');
    }

    message.destroy();
    if (isLoading && !!info) message.loading(info, 0);
    else if (success) message.success(success, 5, _apiCallReset);
    else if (error) message.error(error, 5, _apiCallReset);
    return (
      <ErrorBoundary>
        <IdleTimer
          ref={ref => {
            this.idleTimer = ref;
          }}
          element={document}
          onActive={this._onActive.bind(this)}
          onIdle={this._onIdle.bind(this)}
          onAction={this._onAction.bind(this)}
          debounce={250}
          timeout={1000 * 60 * 20}
        />
        {!this.state.isOnline && (
          <NoInternetConnection isOnline={this.state.isOnline} />
        )}

        {Boolean(apiError) && apiError.message && (
          <Alert
            className='slide-in-top-notification 500'
            message={apiError.message || 'It seems server is unreachable!'}
            description={null}
            type={'error'}
            showIcon
            closable
            banner
          />
        )}
        {this.state.isOnline && (
          <ErrorBoundary>
            {configScreen ? (
              <div className='reimburse-loader dark'>
                <div style={{ fontSize: 20, color: '#fff' }}>
                  {configScreen?.message}
                </div>
                <Spin />
              </div>
            ) : (
              <Layout className='layout-container'>
                <ErrorBoundary>
                  {menuVisibility && this.state.isOnline ? (
                    <MenuDrawer />
                  ) : null}
                </ErrorBoundary>
                <div
                  className={`content ${!menuVisibility ? `full-width` : ``}`}
                >
                  <ErrorBoundary>
                    <Switch>
                      <Route
                        path={appPath.auth.login.path}
                        component={Login}
                        exact={true}
                      />
                      <Route
                        path={appPath.redirect.path}
                        component={RedirectLogin}
                        exact={true}
                      />
                      {routesComponent}
                    </Switch>
                  </ErrorBoundary>
                  <ErrorBoundary>
                    <ConfirmationModal
                      visible={confirmationInfo.visibility}
                      header={confirmationInfo.headerText}
                      body={confirmationInfo.bodyText}
                      onCancelClick={confirmationInfo.cancelBtnFn}
                      okText={confirmationInfo.okText}
                      cancelText={confirmationInfo.cancelText}
                      onOkClick={confirmationInfo.okBtnFn}
                      extraModelProps={confirmationInfo.extraModelProps}
                    />
                  </ErrorBoundary>

                  <ErrorBoundary>
                    <WorkflowDetails
                      onClose={this.handleWorkflowDetailsClose.bind(this)}
                      {...WorkflowDetailsComponentProps}
                      onApproverSelection={this.handleWorkflowDetailsApproverAdd.bind(
                        this,
                      )}
                      users={activeUsers}
                      usersLoader={usersLoader}
                      workFlowData={workflowData}
                      isActionAllowed={isActionAllowed}
                      visibility={Boolean(
                        workflowData.length > 0 || workflowDataLoader,
                      )}
                      isLoading={workflowDataLoader}
                    />
                  </ErrorBoundary>
                </div>
                <ConfirmationModal
                  visible={this.state.showModal || showLoggedOutModal}
                  header={
                    showLoggedOutModal ? (
                      <Trans>You Are Logged Out!</Trans>
                    ) : (
                      <Trans>Session Timeout !</Trans>
                    )
                  }
                  body={
                    showLoggedOutModal ? (
                      <Trans>Please Click Log In button to login again</Trans>
                    ) : (
                      <Trans>
                        You are logged out. Please Click Log In button to login
                        again
                      </Trans>
                    )
                  }
                  okText={<Trans>Log In</Trans>}
                  onOkClick={this.redirectToLogin.bind(
                    this,
                    false,
                    // showLoggedOutModal,
                  )}
                  cancelText={null}
                  extraModelProps={{
                    width: 560,
                  }}
                />
              </Layout>
            )}
          </ErrorBoundary>
        )}
      </ErrorBoundary>
    );
  }
}

const mapStateToProps = (state: stateInterface) => {
  const {
    confirmationInfo,
    WorkflowDetailsComponentProps,
    workflowDataLoader,
    workflowData,
    error,
    info,
    success,
    isLoading,
    apiError,
  } = state.app;
  const { token } = state.auth;
  const { isBenefitEnable } = state.configuration;
  const authenticatedStatusToken = getAuthToken(state);
  const isAuthenticated = authenticatedStatusToken;
  return {
    token,
    isBenefitEnable,
    local: getLocalization(state),
    isAuthenticated,
    confirmationInfo,
    WorkflowDetailsComponentProps,
    workflowDataLoader,
    workflowData,
    error,
    info,
    success,
    isLoading,
    getPermissions: getPermissions(state),
    getIsBenefitsEnabled: getIsBenefitEnabled(state),
    getTenantConfigRecords: getTenantConfigRecords(state),
    apiError,
    isLoggedInUser: !Boolean(state.delegates.currentDelegateUser),
    isDraftAllowed: isDraftMenuAllowed(state),
    isSubmitAllowed: isSubmittedMenuAllowed(state),
    isApprovalAllowed: isApprovedMenuAllowed(state),
    currentDelegateUser: state.delegates.currentDelegateUser,
    isPermissionAllowed: (permission: PROXY_PERMISSIONS) =>
      isProxyPermissionAllowed(state, permission),
    configScreen: getDelegateScreenConfig(state),
    activeUsers: state.auth.activeUsers,
    usersLoader: getUsersListForDDLoader(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  _restoreData: () => dispatch(restoreData()),
  _saveToken: (token: string) => dispatch(saveToken(token)),
  _apiCallReset: () => dispatch(apiCallReset()),
  _resetWorkflowData: () => dispatch(resetWorkflowData()),
  _addApproverPostAPI: (id: number, approvers: number[]) =>
    dispatch(addApproverPostAPI(id, approvers)),
  _updateApproverPostAPI: (id: number, approvers: number[]) =>
    dispatch(updateApproverPostAPI(id, approvers)),
  _logoutUser: () => dispatch(logoutUser()),
});

const connector = connect(mapStateToProps, mapDispatchToProps);

export default withRouter(
  withDocumentVisibilityListener(withStorageListener(connector(App))),
);
