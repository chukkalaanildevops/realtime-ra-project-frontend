import { combineReducers } from 'redux';

// state interfaces
import { IinitialexpenseTypeConfigurationState } from '../../pages/expenseTypeConfiguration/expenseTypeConfiguration.model';
import { ISettingsConfigurationState } from '../../pages/configurations/configurations.model';
import { IemployeeGroupReducerInitialState } from '../../pages/setup/component/other/employeeGroups/employeeGroupsListing/employeeGroupsListing.model';
import { IaddEmployeeGroupReducerInitialState } from '../../pages/setup/component/other/employeeGroups/addEmployeeGroups/addEmployeeGroups.model';
import { IObjectReferenceState } from './referenceObject/referenceObject.model';
import { IwageTypeInitialState } from './wageType/wageType.model';
import { GL_ACCOUNT_STATE } from './glAccount/glAccount.model';
import { COST_CENTRE_STATE } from './costCentre/costCentre.model';
import { IAddNewExpenseFormReducerIntialState } from '../../pages/addNewExpense/addNewExpense.model';
import { IinitialStateAppReducer } from '../../pages/app/app.model';
import { IinitialReceiptState } from '../../pages/receipt/receipt.model';
import { IDraftState } from '../../pages/draft/draft.model';
import { AUTH_STATE } from '../redux/auth/auth.model';

// Reducers and inner function
import AppReducer from '../../pages/app/app.reducer';
import DashboardReducer, * as dashboard from '../../pages/dashboard/dashboard.reducer';
import configurationReducer, * as configuration from '../../pages/configurations/configurations.reducer';
import ExpenseTypesConfigurationReducer from '../../pages/expenseTypeConfiguration/expenseTypeConfiguration.reducer';
import RequestTypeConfigReducer, * as requestConfig from '../../pages/requestTypeConfiguration/requestTypeConfiguration.reducer';
import ObjectReferenceReducer, * as referenceObject from './referenceObject/referenceObject.reducer';
import WageTypeReducer from './wageType/wageType.reducer';
import currencyConversionReducer, * as currencyConversion from '../../pages/setup/component/other/currencyConversion/currencyConversion.reducer';
import allowanceReducer, * as allowance from '../../pages/setup/component/other/allowanceRate/allowanceRate.reducer';
import BenefitTypeConfigReducer, * as benefitConfig from '../../pages/benefitTypeConfiguration/benefitTypeConfiguration.reducer';
import claimDetectionReducer, * as claimDetection from '../../pages/setup/component/other/claimDuplicateDetection/claimDuplicateDetection.reducer';
import EmployeeGroupsListingReducer from '../../pages/setup/component/other/employeeGroups/employeeGroupsListing/employeeGroupsListing.reducer';
import AddEmployeeGroupsReducer from '../../pages/setup/component/other/employeeGroups/addEmployeeGroups/addEmployeeGroups.reducer';
import SFIntegrationReducer, * as sfIntegration from '../../pages/sfIntegration/sfIntegration.reducer';
import systemLabelsCustomisationReducer, * as systemLabelsCustomisation from '../../pages/systemLabelsCustomisation/systemLabelsCustomisation.reducer';

import CostCentreReducer, * as costCentres from './costCentre/costCentre.reducer';
import authReducer, * as auth from './auth/auth.reducer';
import GLAccountReducer, * as glAccounts from './glAccount/glAccount.reducer';

import AddNewExpenseFormReducer, * as AddNewExpenseForm from '../../pages/addNewExpense/addNewExpense.reducer';
import DashboardsReducer from '../../pages/dashboards/store/dashboards.reducer';
import SfLogsReducer from '../../pages/sfIntegration/sfLogs/sfLogs.reducer';
import FileEncryptionReducer from '../../pages/fileEncryption/store/fileEncryption.reducer';

import BenefitReducer from '../../pages/benefits/store/benefit.reducer';
import AllowanceNewReducer from '../../pages/addNewExpense/components/allowanceNew/allowanceNew.reducer';
import BenefitCategoriesReducer from '../../pages/setup/component/other/benefitCategories/store/benefitCategories.reducer';
import AddBenefitTypeConfigReducer from '../../pages/benefitTypeConfiguration/addBenefitTypeConfiguration/store/addBenefitTypeConfig.reducer';
import ReceiptReducer from '../../pages/receipt/receipt.reducer';
import outboundReducer, * as outbound from '../../pages/outbound/outbound.reducer';
import inboundReducer, * as inbound from '../../pages/inbound/inbound.reducer';

// import { Language } from '../../utils/types.utils';
import draftsReducer, * as drafts from '../../pages/draft/drafts.reducer';
import ApprovalsReducer, * as approvals from '../../pages/approvals/approvals.reducer';
import { IApprovals } from '../../pages/approvals/approvals.model';
import entityReducer, * as entities from '../../pages/legalEntityListing/legalEntityListing.reducer';
import rulesReducer, * as rules from './rule/rules.reducer';
import addUpdateRuleReducer, * as addUpdateRule from './rule/addUpdateRule/addUpdateRule.reducer';
import reportReducer, * as reports from '../../pages/reports/reports.reducer';
import submittedReducer, * as submitted from '../../pages/submitted/submitted.reducer';
import profileReducer, * as userProfile from '../../pages/userProfile/userProfile.reducer';
import RequestReducer from '../../pages/request/request.reducer';
import { IRequest } from '../../pages/request/request.model';
import { ISubmittedState } from '../../pages/submitted/submitted.model';
import AdminReducer from '../../pages/admin/admin.reducers';
import { IAdmin } from '../../pages/admin/admin.models';
import { IRequestTypeConfigState } from '../../pages/requestTypeConfiguration/requestTypeConfiguration.model';
import RolesReducer from '../../pages/setup/component/other/roles/roles.reducer';
import { IRoles } from '../../pages/setup/component/other/roles/roles.model';
import { IReportState } from '../../pages/reports/reports.model';
import { ISystemLabelsCustomisation } from '../../pages/systemLabelsCustomisation/systemLabelsCustomisation.model';
import delegateReducer, * as delegates from '../../pages/delegate/delegate.reducer';
import adminDelegateReducer from '../../pages/setup/component/other/adminDelegate/adminDelegate.reducer';
import {
  IDelegateState,
  PROXY_PERMISSIONS,
} from '../../pages/delegate/delegate.model';
import { resetAxios } from '../../utils/reimAxios.utils';
import { IAdminDelegateState } from '../../pages/setup/component/other/adminDelegate/adminDelegate.model';
import { IEmailTemplates } from '../../pages/setup/component/other/emailTemplates/emailTemplates.models';
import EmailTemplatesReducer from '../../pages/setup/component/other/emailTemplates/emailTemplates.reducer';
import policyConfigurationReducer, * as policyConfiguration from '../../pages/setup/component/other/policyConfiguration/policyConfiguration.reducer';
import { IPolicyConfiguration } from '../../pages/setup/component/other/policyConfiguration/policyConfiguration.models';
import searchBarReducer from '../components/searchBar/searchBar.reducer';
import { ISearchBarState } from '../components/searchBar/searchBar.model';
import expensesAuditReportReducer from '../../pages/auditLogs/expensesAuditReport.reducer';
import { TexpenseAuditDataType } from '../../pages/auditLogs/expensesAuditReport.model';
import entitlementRulesReducer, * as entitlementRules from './entitlementRule/entitlementRules.reducer';
import addUpdateEntitlementRuleReducer, * as addUpdateEntitlementRule from './entitlementRule/addUpdateEntitlementRule/addUpdateEntitlementRule.reducer';
import RiskScoreRangeReducer from '../../pages/setup/component/other/riskScoreRange/riskScoreRange.reducer';
import { IRiskScoreRange } from '../../pages/setup/component/other/riskScoreRange/riskScoreRange.models';

//combining all reducers
const Reducer = combineReducers({
  app: AppReducer,
  dashboard: DashboardReducer,
  currencyConversion: currencyConversionReducer,
  allowance: allowanceReducer,
  expenseTypeConfiguration: ExpenseTypesConfigurationReducer,
  AddNewExpenseForm: AddNewExpenseFormReducer,
  DashboardsReducer: DashboardsReducer,
  SfLogsReducer: SfLogsReducer,
  FileEncryptionReducer: FileEncryptionReducer,
  BenefitReducer: BenefitReducer,
  AllowanceNewReducer: AllowanceNewReducer,
  BenefitCategoriesReducer: BenefitCategoriesReducer,
  AddBenefitTypeConfigReducer: AddBenefitTypeConfigReducer,
  configuration: configurationReducer,
  requestConfig: RequestTypeConfigReducer,
  referenceObject: ObjectReferenceReducer,
  WageType: WageTypeReducer,
  benefitConfig: BenefitTypeConfigReducer,
  claimDetection: claimDetectionReducer,
  employeeGroupsListing: EmployeeGroupsListingReducer,
  AddEmployeeGroups: AddEmployeeGroupsReducer,
  sfIntegration: SFIntegrationReducer,
  costCentre: CostCentreReducer,
  auth: authReducer,
  glAccount: GLAccountReducer,
  drafts: draftsReducer,
  entities: entityReducer,
  receipt: ReceiptReducer,
  rules: rulesReducer,
  addUpdateRule: addUpdateRuleReducer,
  reports: reportReducer,
  approvals: ApprovalsReducer,
  submitted: submittedReducer,
  userProfile: profileReducer,
  request: RequestReducer,
  admin: AdminReducer,
  roles: RolesReducer,
  labelsCustomisation: systemLabelsCustomisationReducer,
  delegates: delegateReducer,
  adminDelegates: adminDelegateReducer,
  searchBar: searchBarReducer,
  outbound: outboundReducer,
  inbound: inboundReducer,
  emailTemplates: EmailTemplatesReducer,
  policyConfiguration: policyConfigurationReducer,
  expenseAudit: expensesAuditReportReducer,
  entitlementRules: entitlementRulesReducer,
  addUpdateEntitlementRule: addUpdateEntitlementRuleReducer,
  riskScoreRange: RiskScoreRangeReducer,
});

const rootReducer = (state: any, action: any) => {
  // when a logout action is dispatched it will reset redux state
  if (action.type === 'USER_LOGGED_OUT') {
    state = undefined;
    // const TENANT: string = localStorage.getItem('TENANT') || '';
    // const AT: string = sessionStorage.getItem('AT') || '';
    // sessionStorage.clear();
    // localStorage.setItem('TENANT', TENANT); //restoring tenant for redirection
    // sessionStorage.setItem('AT', AT); //restoring Auth Type for redirection
    /* Reseting sharing data */
    window.localStorage.setItem('CREDENTIALS_FLUSH', Date.now().toString());
    window.localStorage.removeItem('CREDENTIALS_FLUSH');
    resetAxios();
  } else if (action.type === 'APP/RESET_ALL_DATA') {
    state = { auth: state.auth, delegates: state.delegates };
  }

  return Reducer(state, action);
};

export const getAppState = (state: any) => state.dashboard;
export const getAllowanceState = (state: any) => state.allowance;
export const getCCState = (state: any) => state.currencyConversion;
export const getSetupState = (state: any) => state.configuration;
export const getRequestConfigState = (state: any) => state.requestConfig;
export const getObjectReferenceState = (state: any) => state.referenceObject;
export const getBenefitConfigState = (state: any) => state.benefitConfig;
export const getClaimDetectionState = (state: any) => state.claimDetection;
export const getSFIntegrationState = (state: any) => state.sfIntegration;
export const getCostCentreState = (state: any) => state.costCentre;
export const getAuthState = (state: any) => state.auth;
export const getGlAccountState = (state: any) => state.glAccount;
export const getDraftState = (state: any) => state.drafts;
export const getEntityState = (state: any) => state.entities;
export const getRuleState = (state: any) => state.rules;
export const getAddUpdateRuleState = (state: any) => state.addUpdateRule;
export const getReportState = (state: any) => state.reports;
export const getSubmittedState = (state: any) => state.submitted;
export const getProfileState = (state: any) => state.userProfile;
export const getAddNewExpenseFormState = (state: any) =>
  state.AddNewExpenseForm;
export const getSystemLabelsCustomisationState = (state: any) =>
  state.labelsCustomisation;
export const getDelegateState = (state: any) => state.delegates;
export const getOutboundState = (state: any) => state.outbound;
export const getInboundState = (state: any) => state.inbound;
export const getApprovalsState = (state: any) => state.approvals;
export const getEntitlementRulesState = (state: any) => state.entitlementRules;
export const getAddUpdateEntitlementRuleState = (state: any) =>
  state.addUpdateEntitlementRule;
export const getPolicyConfigurationState = (state: any) =>
  state.policyConfiguration;

export const getUserData = (state: any) =>
  dashboard.getUserData(getAppState(state));
export const getDashboardLoadingMessage = (state: any) =>
  dashboard.getLoadingMessage(getAppState(state));
export const getDashboardLoader = (state: any) =>
  dashboard.getLoader(getAppState(state));
export const getDashboardSuccess = (state: any) =>
  dashboard.getSuccess(getAppState(state));
export const getDashboardError = (state: any) =>
  dashboard.getError(getAppState(state));
export const getLocalization = (state: any) =>
  dashboard.getLocalization(getAppState(state));
export const getDashboardLoadError = (state: any) =>
  dashboard.getDashboardLoadError(getAppState(state));

export const getUserCostCentre = (state: any) =>
  auth.getUserCostCentre(getAuthState(state));
export const getIsPettyCashManager = (state: any) =>
  auth.getIsPettyCashManager(getAuthState(state));
export const getIsBenefitsEnabled = (state: any) =>
  auth.getIsBenefitsEnabled(getAuthState(state));
export const getIsPettyCashEnabled = (state: any) =>
  auth.getIsPettyCashEnabled(getAuthState(state));
export const getIsAllowanceEnabled = (state: any) =>
  auth.getIsAllowanceEnabled(getAuthState(state));
export const getPermissions = (state: any) =>
  auth.getPermissions(getAuthState(state));
export const getIsPresentInTargetAudience = (
  state: any,
  permissionCode: string,
  userId: number,
) =>
  auth.getIsPresentInTargetAudience(
    getAuthState(state),
    permissionCode,
    userId,
  );

export const getCurrencyConversionList = (state: stateInterface) =>
  currencyConversion.getCurrencyConversionList(getCCState(state));

export const getCountryCurrencyList = (state: stateInterface) =>
  currencyConversion.getCountryCurrencyList(getCCState(state));

export const getCurrencyList = (state: stateInterface) =>
  currencyConversion.getCurrencyList(getCCState(state));

export const getCCError = (state: stateInterface) =>
  currencyConversion.getCCError(getCCState(state));

export const getCCSuccessMessage = (state: stateInterface) =>
  currencyConversion.getCCSuccessMessage(getCCState(state));

export const getConversionHistory = (state: stateInterface) =>
  currencyConversion.getConversionHistory(getCCState(state));

export const getCurrencyLoader = (state: stateInterface) =>
  currencyConversion.getCurrencyLoader(getCCState(state));

export const getCurrencyLoadingMessage = (state: stateInterface) =>
  currencyConversion.getLoadingMessage(getCCState(state));

export const getConversionRate = (state: stateInterface) =>
  currencyConversion.getConversionRate(getCCState(state));

export const getCurrencyDataSubmitting = (state: stateInterface) =>
  currencyConversion.getCurrencyDataSubmitting(getCCState(state));

export const getAllowanceList = (state: stateInterface) =>
  allowance.getAllowanceList(getAllowanceState(state));

export const getAllowanceSuccessMessage = (state: stateInterface) =>
  allowance.getAllowanceSuccessMessage(getAllowanceState(state));

export const getAllowanceLoader = (state: stateInterface) =>
  allowance.getAllowanceLoader(getAllowanceState(state));

export const getCompanyList = (state: stateInterface) =>
  allowance.getCompanyList(getAllowanceState(state));

export const getDestinationList = (state: stateInterface) =>
  allowance.getDestinationList(getAllowanceState(state));

export const getTitleList = (state: stateInterface) =>
  allowance.getTitleList(getAllowanceState(state));

export const getEligibilityList = (state: stateInterface) =>
  allowance.getEligibilityList(getAllowanceState(state));

// export const getAllowanceCurrencyList = (state: stateInterface) =>
//   allowance.getAllowanceCurrencyList(getAllowanceState(state));

export const getAllowanceCurrencyList = (state: stateInterface) =>
  allowance.getAllowanceCurrencyList(getAllowanceState(state));

export const getPayComponentList = (state: stateInterface) =>
  allowance.getPayComponentList(getAllowanceState(state));

export const getGlAccountList = (state: stateInterface) =>
  allowance.getGlAccountList(getAllowanceState(state));

export const getAllowanceDataSubmitting = (state: stateInterface) =>
  allowance.getAllowanceDataSubmitting(getAllowanceState(state));

export const getAllowanceHistory = (state: stateInterface) =>
  allowance.getAllowanceHistory(getAllowanceState(state));

export const getAllowanceHistoryLoader = (state: stateInterface) =>
  allowance.getAllowanceHistoryLoader(getAllowanceState(state));

export const getFtpConfigRecords = (state: stateInterface) =>
  configuration.getFtpConfigRecords(getSetupState(state));

export const getTenantConfigRecords = (state: stateInterface) =>
  configuration.getTenantConfigRecords(getSetupState(state));

export const getIsBenefitEnabled = (state: stateInterface) =>
  configuration.getIsBenefitEnabled(getSetupState(state));

export const getIsAllowancesEnabled = (state: stateInterface) =>
  configuration.getIsAllowancesEnabled(getSetupState(state));

export const getSSOConfigRecords = (state: stateInterface) =>
  configuration.getSSOConfigRecords(getSetupState(state));

export const getConfigurationSuccessMessage = (state: stateInterface) =>
  configuration.getSuccessMessage(getSetupState(state));

export const getConfigurationErrorMessage = (state: stateInterface) =>
  configuration.getErrorMessage(getSetupState(state));

export const getNameIdFormats = (state: stateInterface) =>
  configuration.getNameIdFormats(getSetupState(state));

export const getFTPLoader = (state: stateInterface) =>
  configuration.getLoaderStatus(getSetupState(state));

export const getTimeZones = (state: stateInterface) =>
  configuration.getTimeZones(getSetupState(state));

export const getSaveDataLoader = (state: stateInterface) =>
  configuration.getSaveDataLoader(getSetupState(state));

export const getLanguages = (state: stateInterface) =>
  configuration.getLanguages(getSetupState(state));
export const getConnectionTestingStatus = (state: stateInterface) =>
  configuration.getTestingStatus(getSetupState(state));

export const getLabels = (state: stateInterface) =>
  requestConfig.getLabels(getRequestConfigState(state));

export const getCustomField = (state: stateInterface) =>
  requestConfig.getCustomField(getRequestConfigState(state));

export const getEntities = (state: stateInterface) =>
  requestConfig.getEntities(getRequestConfigState(state));

export const getEntityTypes = (state: stateInterface) =>
  requestConfig.getEntityTypes(getRequestConfigState(state));

export const getWageTypes = (state: stateInterface) =>
  requestConfig.getWageTypes(getRequestConfigState(state));

export const getRequestTypes = (state: stateInterface) =>
  requestConfig.getRequestTypes(getRequestConfigState(state));

export const getRequestTypeSuccessMessage = (state: stateInterface) =>
  requestConfig.getSuccessMessage(getRequestConfigState(state));

export const getRequestTypeLoader = (state: stateInterface) =>
  requestConfig.getLoadingStatus(getRequestConfigState(state));

export const getRequestTypeErrorMessage = (state: stateInterface) =>
  requestConfig.getErrorMessage(getRequestConfigState(state));

export const getRequestTypeLoadingMessage = (state: stateInterface) =>
  requestConfig.getLoadingMessage(getRequestConfigState(state));

export const getReferenceObjects = (state: stateInterface) =>
  referenceObject.getObjectReferenceRecords(getObjectReferenceState(state));

export const getReferenceObjectDropdownList = (state: stateInterface) =>
  referenceObject.getObjectReferenceList(getObjectReferenceState(state));

export const getExpenseTypes = (state: stateInterface) =>
  requestConfig.getExpenseTypes(getRequestConfigState(state));

export const getRequestTypeExpandedItem = (state: stateInterface) =>
  requestConfig.getExpandedItem(getRequestConfigState(state));

export const getRequestTypeDataLoading = (state: stateInterface) =>
  requestConfig.getDataLoading(getRequestConfigState(state));

export const getRequestTypeLegalEntityRecords = (state: stateInterface) =>
  requestConfig.getRequestLegalRecords(getRequestConfigState(state));

export const getRequestTypeData = (state: stateInterface) =>
  requestConfig.getRequestTypeData(getRequestConfigState(state));

export const getUpdateRequestTypeData = (state: stateInterface) =>
  requestConfig.getUpdateRequestData(getRequestConfigState(state));

export const getRequestReferenceData = (state: stateInterface) =>
  requestConfig.getReferenceData(getRequestConfigState(state));

export const getRequestLegalEntities = (state: stateInterface) =>
  requestConfig.getRequestLegalEntities(getRequestConfigState(state));

export const getRequestLegalEntitiesLoadingStatus = (state: stateInterface) =>
  requestConfig.getRequestLegalEntitiesLoadingStatus(
    getRequestConfigState(state),
  );

export const getstaffMemberLoadingStatus = (state: stateInterface) =>
  requestConfig.getstaffMemberLoadingStatus(getRequestConfigState(state));

export const getcreateRequestLoadingStatus = (state: stateInterface) =>
  requestConfig.getcreateRequestLoadingStatus(getRequestConfigState(state));
export const getRequestDetails = (state: stateInterface) =>
  requestConfig.getRequestDetails(getRequestConfigState(state));

export const getStaffMembers = (state: stateInterface) =>
  requestConfig.getStaffMembers(getRequestConfigState(state));

export const getExpenseTypesForRequest = (state: stateInterface) =>
  requestConfig.getExpenseTypesForRequest(getRequestConfigState(state));

export const getRequestCurrentPage = (state: stateInterface) =>
  requestConfig.getCurrentPage(getRequestConfigState(state));

export const getRequestLocalCostCentres = (state: stateInterface) =>
  requestConfig.getLocalCostCentre(getRequestConfigState(state));

export const getRequestOverseasCostCentres = (state: stateInterface) =>
  requestConfig.getOverseasCostCentre(getRequestConfigState(state));

export const getRequestInternalCostCentres = (state: stateInterface) =>
  requestConfig.getInternalCostCentre(getRequestConfigState(state));
// Benefit type selector
export const getBenefitLabels = (state: stateInterface) =>
  benefitConfig.getLabels(getBenefitConfigState(state));

export const getBenefitCustomField = (state: stateInterface) =>
  benefitConfig.getCustomField(getBenefitConfigState(state));

export const getBenefitEntities = (state: stateInterface) =>
  benefitConfig.getEntities(getBenefitConfigState(state));

export const getBenefitEntityTypes = (state: stateInterface) =>
  benefitConfig.getEntityTypes(getBenefitConfigState(state));

export const getBenefitWageTypes = (state: stateInterface) =>
  benefitConfig.getWageTypes(getBenefitConfigState(state));

// export const getBenefitCostCentre = (state: stateInterface) =>
//   costCentres.getCostCentres(getCostCentreState(state));

export const getBenefitTypes = (state: stateInterface) =>
  benefitConfig.getBenefitTypes(getBenefitConfigState(state));

export const getBenefitTypeSuccessMessage = (state: stateInterface) =>
  benefitConfig.getSuccessMessage(getBenefitConfigState(state));

export const getBenefitTypeLoader = (state: stateInterface) =>
  benefitConfig.getLoadingStatus(getBenefitConfigState(state));

export const getBenefitTypeErrorMessage = (state: stateInterface) =>
  benefitConfig.getErrorMessage(getBenefitConfigState(state));

export const getBenefitTypeLoadingMessage = (state: stateInterface) =>
  benefitConfig.getLoadingMessage(getBenefitConfigState(state));

export const getBenefitExpenseTypes = (state: stateInterface) =>
  benefitConfig.getExpenseTypes(getBenefitConfigState(state));

export const getBenefitTypeExpandedItem = (state: stateInterface) =>
  benefitConfig.getExpandedItem(getBenefitConfigState(state));

// export const getBenefitTypesGlAccounts = (state: stateInterface) =>
//   benefitConfig.getBenefitTypesGlAccounts(getBenefitConfigState(state));

export const getBenefitTypeAvailableAfter = (state: stateInterface) =>
  benefitConfig.getAvailableAfter(getBenefitConfigState(state));

export const getBenefitTypeAvailableAfterPeriod = (state: stateInterface) =>
  benefitConfig.getAvailableAfterPeriod(getBenefitConfigState(state));

export const getBenefitTypeEntitlementTypes = (state: stateInterface) =>
  benefitConfig.getEntitlementTypes(getBenefitConfigState(state));

export const getBenefitTypeEntitlementPeriodUnit = (state: stateInterface) =>
  benefitConfig.getEntitlementPeriodUnit(getBenefitConfigState(state));

export const getBenefitTypeCanClaimFor = (state: stateInterface) =>
  benefitConfig.getCanClaimFor(getBenefitConfigState(state));

export const getBenefitTypeProratedBy = (state: stateInterface) =>
  benefitConfig.getProratedBy(getBenefitConfigState(state));

export const getBenefitTypeDeductibleComponent = (state: stateInterface) =>
  benefitConfig.getDeductibleComponent(getBenefitConfigState(state));

export const getBenefitTypeProration = (state: stateInterface) =>
  benefitConfig.getProration(getBenefitConfigState(state));

export const getBenefitTypeEntitlementPeriod = (state: stateInterface) =>
  benefitConfig.getEntitlementPeriod(getBenefitConfigState(state));

export const getBenefitTypeFrequencyUnit = (state: stateInterface) =>
  benefitConfig.getFrequencyUnit(getBenefitConfigState(state));

export const getBenefitmaxClaimPerEntitlementPeriodList = (
  state: stateInterface,
) =>
  benefitConfig.getmaxClaimPerEntitlementPeriodList(
    getBenefitConfigState(state),
  );

export const getBenefitTypeDataLoading = (state: stateInterface) =>
  benefitConfig.getDataLoading(getBenefitConfigState(state));
export const getBenefitTitleUpdateConfig = (state: stateInterface) =>
  benefitConfig.getTitleUpdateConfig(getBenefitConfigState(state));
export const getBenefitTypeLegalEntityRecords = (state: stateInterface) =>
  benefitConfig.getBenefitLegalRecords(getBenefitConfigState(state));

export const getBenefitTypeData = (state: stateInterface) =>
  benefitConfig.getBenefitTypeData(getBenefitConfigState(state));

//Claim detector
export const getClaimDetection = (state: stateInterface) =>
  claimDetection.getClaimDetector(getClaimDetectionState(state));

//SF Integration
export const getSFLegalEntities = (state: stateInterface) =>
  sfIntegration.getLegalEntities(getSFIntegrationState(state));

export const getFileToModelMapping = (state: stateInterface) =>
  sfIntegration.getFileToModelMapping(getSFIntegrationState(state));
export const getSFIntegrationSchedule = (state: stateInterface) =>
  sfIntegration.getSchedule(getSFIntegrationState(state));
export const getSFIntegrationJobs = (state: stateInterface) =>
  sfIntegration.getSFIntegrationJobs(getSFIntegrationState(state));

export const getSFIntegrationLoader = (state: stateInterface) =>
  sfIntegration.getLoader(getSFIntegrationState(state));

export const getSFIntegrationSuccess = (state: stateInterface) =>
  sfIntegration.getSuccess(getSFIntegrationState(state));
export const getSFIntegrationError = (state: stateInterface) =>
  sfIntegration.getError(getSFIntegrationState(state));

export const getSFIntegrationLoadingMessage = (state: stateInterface) =>
  sfIntegration.getLoadingMessage(getSFIntegrationState(state));

export const getSFIntegrationStages = (state: stateInterface) =>
  sfIntegration.getStages(getSFIntegrationState(state));

export const getCurrentJob = (state: stateInterface) =>
  sfIntegration.getCurrentJob(getSFIntegrationState(state));

export const getFileConfiguration = (state: stateInterface) =>
  sfIntegration.getFileConfiguration(getSFIntegrationState(state));

export const getSFIntegrationActiveTab = (state: stateInterface) =>
  sfIntegration.getActiveTab(getSFIntegrationState(state));

export const getSFIntegrationFileJobs = (state: stateInterface) =>
  sfIntegration.getFileLogs(getSFIntegrationState(state));

export const getSFIntegrationDataSubmitLoader = (state: stateInterface) =>
  sfIntegration.getDataSubmittingLoader(getSFIntegrationState(state));
// COst Centres
export const getCostCentre = (state: stateInterface) =>
  costCentres.getCostCentres(getCostCentreState(state));

export const getCostCentreLoader = (state: stateInterface) =>
  costCentres.getCostCentreLoader(getCostCentreState(state));

export const getCostCentreDetails = (state: stateInterface) =>
  costCentres.getCostCentreDetails(getCostCentreState(state));

export const getCostCentreDetailsLoader = (state: stateInterface) =>
  costCentres.getCostCentreDetailsLoader(getCostCentreState(state));

export const getCostCentresPaginationData = (state: stateInterface) =>
  costCentres.getCostCentresPaginationData(getCostCentreState(state));

export const getAuthToken = (state: stateInterface) =>
  auth.getToken(getAuthState(state));

export const getAuthTenant = (state: stateInterface) =>
  auth.getTenant(getAuthState(state));
export const getAuthLoader = (state: stateInterface) =>
  auth.getAuthLoader(getAuthState(state));
export const getAuthSuccess = (state: stateInterface) =>
  auth.getSuccess(getAuthState(state));

export const getAuthError = (state: stateInterface) =>
  auth.getError(getAuthState(state));

export const getAuthLoadingMessage = (state: stateInterface) =>
  auth.getLoadingMessage(getAuthState(state));

export const getAuthTenantConfig = (state: stateInterface) =>
  auth.getTenantConfig(getAuthState(state));

export const getAuthIsEnteredTenant = (state: stateInterface) =>
  auth.getIsEnteredTenant(getAuthState(state));

export const getUser = (state: stateInterface) =>
  auth.getUser(getAuthState(state));

export const getUsersListForDD = (state: stateInterface) =>
  auth.getUsersListForDD(getAuthState(state));

export const getUsersListForDDLoader = (state: stateInterface) =>
  auth.getUsersListForDDLoader(getAuthState(state));

export const getExpenseTypesData = (state: stateInterface) =>
  auth.getExpenseTypesData(getAuthState(state));

// GL Accounts
export const getGlAccounts = (state: stateInterface) =>
  glAccounts.getGlAccounts(getGlAccountState(state));

export const getGlAccountLoader = (state: stateInterface) =>
  glAccounts.getGlAccountLoader(getGlAccountState(state));

export const getGlAccountDetails = (state: stateInterface) =>
  glAccounts.getGlAccountDetails(getGlAccountState(state));

export const getGlAccountDetailsLoader = (state: stateInterface) =>
  glAccounts.getGlAccountDetailsLoader(getGlAccountState(state));

export const getGlAccountTypes = (state: stateInterface) =>
  glAccounts.getGlAccountTypes(getGlAccountState(state));

export const getGlLoadingMessage = (state: stateInterface) =>
  glAccounts.getLoadingMessage(getGlAccountState(state));

export const getGlSuccessMessage = (state: stateInterface) =>
  glAccounts.getSuccessMessage(getGlAccountState(state));

export const getGlErrorMessage = (state: stateInterface) =>
  glAccounts.getErrorMessage(getGlAccountState(state));

export const getGlAccountPaginationData = (state: stateInterface) =>
  glAccounts.getGlAccountPaginationData(getGlAccountState(state));

export const getSubmittedLoader = (state: stateInterface) =>
  submitted.getLoadingState(getSubmittedState(state));
export const getSubmittedLoadingMessage = (state: stateInterface) =>
  submitted.getLoadingMessage(getSubmittedState(state));
export const getSubmittedSuccess = (state: stateInterface) =>
  submitted.getSuccess(getSubmittedState(state));
export const getSubmittedError = (state: stateInterface) =>
  submitted.getError(getSubmittedState(state));
export const isSubmittedDataAvailable = (state: stateInterface) =>
  submitted.isDataAvailable(getSubmittedState(state));
export const getSubmittedRequests = (state: stateInterface) =>
  submitted.getRequests(getSubmittedState(state));

export const getSubmittedExpenses = (state: stateInterface) =>
  submitted.getExpenses(getSubmittedState(state));
export const getSubmittedBenefits = (state: stateInterface) =>
  submitted.getBenefits(getSubmittedState(state));

export const getSubmittedRequestDetails = (state: stateInterface) =>
  submitted.getRequestDetails(getSubmittedState(state));

export const getSubmittedUserDetails = (state: stateInterface) =>
  submitted.getUserDetails(getSubmittedState(state));
export const getSubmittedCount = (state: stateInterface) =>
  submitted.getSubmittedCount(getSubmittedState(state));
export const getSubmittedCountLoader = (state: stateInterface) =>
  submitted.getSubmittedCountLoader(getSubmittedState(state));
export const getSubmittedExpensesWithRequest = (state: stateInterface) =>
  submitted.getExpensesWithRequest(getSubmittedState(state));
export const getSubmittedDefaultView = (state: stateInterface) =>
  submitted.getDefaultView(getSubmittedState(state));

//Entity listing reducer
export const getEntityLoader = (state: stateInterface) =>
  entities.getLoadingState(getEntityState(state));
export const getEntityLoadingMessage = (state: stateInterface) =>
  entities.getLoadingMessage(getEntityState(state));
export const getCompanyEntity = (state: stateInterface) =>
  entities.getCompanies(getEntityState(state));
export const getOrganizationEntity = (state: stateInterface) =>
  entities.getOrganizations(getEntityState(state));
export const getDivisionEntity = (state: stateInterface) =>
  entities.getDivisions(getEntityState(state));
export const getDepartmentEntity = (state: stateInterface) =>
  entities.getDepartments(getEntityState(state));
export const getLegalEntityData = (state: stateInterface) =>
  entities.getEntityData(getEntityState(state));
export const getLegalEntitySuccess = (state: stateInterface) =>
  entities.getEntitySuccess(getEntityState(state));
export const getLegalEntityError = (state: stateInterface) =>
  entities.getEntityError(getEntityState(state));
export const isEntityDataSubmitting = (state: stateInterface) =>
  entities.isEntitySubmitting(getEntityState(state));
export const getFinancialCycle = (state: stateInterface) =>
  entities.getFinancialYears(getEntityState(state));
export const getEntityHierarchy = (state: stateInterface) =>
  entities.getEntityHierarchy(getEntityState(state));

//Rules
export const getRulesLoader = (state: stateInterface) =>
  rules.getIsLoading(getRuleState(state));
export const getRuleItemLoader = (state: stateInterface) =>
  rules.getIsRuleItemLoading(getRuleState(state));
export const getRulesLoadingMessage = (state: stateInterface) =>
  rules.getLoadingMessage(getRuleState(state));
export const getRulesError = (state: stateInterface) =>
  rules.getErrorMessage(getRuleState(state));
export const getRulesData = (state: stateInterface) =>
  rules.getRulesData(getRuleState(state));
export const getRuleDetails = (state: stateInterface) =>
  rules.getRuleDetails(getRuleState(state));

//AddUpdateRule
export const getAddUpdateRuleAction = (state: stateInterface) =>
  addUpdateRule.getAddUpdateRuleAction(getAddUpdateRuleState(state));
export const getProcessTypes = (state: stateInterface) =>
  addUpdateRule.getProcessTypes(getAddUpdateRuleState(state));
export const getSelectedProcessType = (state: stateInterface) =>
  addUpdateRule.getSelectedProcessType(getAddUpdateRuleState(state));
export const getTypeObjects = (state: stateInterface) =>
  addUpdateRule.getTypeObjects(getAddUpdateRuleState(state));
export const getTypeObjectsStatus = (state: stateInterface) =>
  addUpdateRule.getTypeObjectsStatus(getAddUpdateRuleState(state));
export const getSelectedTypeObject = (state: stateInterface) =>
  addUpdateRule.getSelectedTypeObject(getAddUpdateRuleState(state));
export const getRuleTitle = (state: stateInterface) =>
  addUpdateRule.getRuleTitle(getAddUpdateRuleState(state));
export const getOptions = (state: stateInterface) =>
  addUpdateRule.getOptions(getAddUpdateRuleState(state));
export const getOperators = (state: stateInterface) =>
  addUpdateRule.getOperators(getAddUpdateRuleState(state));
export const getGenders = (state: stateInterface) =>
  addUpdateRule.getGenders(getAddUpdateRuleState(state));
export const getMaritalStatuses = (state: stateInterface) =>
  addUpdateRule.getMaritalStatuses(getAddUpdateRuleState(state));
export const getContractTypes = (state: stateInterface) =>
  addUpdateRule.getContractTypes(getAddUpdateRuleState(state));
export const getRefObjEmpGroups = (state: stateInterface) =>
  addUpdateRule.getRefObjEmpGroups(getAddUpdateRuleState(state));
export const getEmpSubGroups = (state: stateInterface) =>
  addUpdateRule.getEmpSubGroups(getAddUpdateRuleState(state));
export const getEmpGroups = (state: stateInterface) =>
  addUpdateRule.getEmpGroups(getAddUpdateRuleState(state));
export const getApproversCustomFields = (state: stateInterface) =>
  addUpdateRule.getApproversCustomFields(getAddUpdateRuleState(state));
export const getPayGrades = (state: stateInterface) =>
  addUpdateRule.getPayGrades(getAddUpdateRuleState(state));
export const getEmployeeIds = (state: stateInterface) =>
  addUpdateRule.getEmployeeIds(getAddUpdateRuleState(state));
export const getUsers = (state: stateInterface) =>
  addUpdateRule.getUsers(getAddUpdateRuleState(state));
export const getLegalEntities = (state: stateInterface) =>
  addUpdateRule.getLegalEntities(getAddUpdateRuleState(state));
export const getAllowedStepOwners = (state: stateInterface) =>
  addUpdateRule.getAllowedStepOwners(getAddUpdateRuleState(state));
export const getAllowedFallbackStepOwners = (state: stateInterface) =>
  addUpdateRule.getAllowedFallbackStepOwners(getAddUpdateRuleState(state));
export const getCustomCaseOptions = (state: stateInterface) =>
  addUpdateRule.getCustomCaseOptions(getAddUpdateRuleState(state));
export const getCustomCasesCostCentreTypes = (state: stateInterface) =>
  addUpdateRule.getCustomCasesCostCentreTypes(getAddUpdateRuleState(state));
export const getCustomCasesClaimCreatorTypes = (state: stateInterface) =>
  addUpdateRule.getCustomCasesClaimCreatorTypes(getAddUpdateRuleState(state));

export const getRuleConfig = (state: stateInterface) =>
  addUpdateRule.getRuleConfig(getAddUpdateRuleState(state));
export const getReadableRuleConfig = (state: stateInterface) =>
  addUpdateRule.getReadableRuleConfig(getAddUpdateRuleState(state));
export const getCurrentSectionData = (state: stateInterface) =>
  addUpdateRule.getCurrentSectionData(getAddUpdateRuleState(state));
export const getCurrentReadableSectionData = (state: stateInterface) =>
  addUpdateRule.getCurrentReadableSectionData(getAddUpdateRuleState(state));

export const getDrawerTitle = (state: stateInterface) =>
  addUpdateRule.getDrawerTitle(getAddUpdateRuleState(state));
export const getDrawerFor = (state: stateInterface) =>
  addUpdateRule.getDrawerFor(getAddUpdateRuleState(state));
export const getDrawerAction = (state: stateInterface) =>
  addUpdateRule.getDrawerAction(getAddUpdateRuleState(state));

export const getCurrentEditingSectionIndex = (state: stateInterface) =>
  addUpdateRule.getCurrentEditingSectionIndex(getAddUpdateRuleState(state));

export const getCostCentres = (state: stateInterface) =>
  addUpdateRule.getCostCentres(getAddUpdateRuleState(state));

// Add New Expense Form
export const getPettyCashManagerTransactionMeta = (state: stateInterface) =>
  AddNewExpenseForm.getPettyCashManagerTransactionMeta(
    getAddNewExpenseFormState(state),
  );

//Reports
export const getReportLoader = (state: stateInterface) =>
  reports.getLoadingState(getReportState(state));
export const getReportLoadingMessage = (state: stateInterface) =>
  reports.getLoadingMessage(getReportState(state));
export const getReportSuccess = (state: stateInterface) =>
  reports.getSuccess(getReportState(state));
export const getReportError = (state: stateInterface) =>
  reports.getError(getReportState(state));
export const getExpenseReports = (state: stateInterface) =>
  reports.getExpenseReports(getReportState(state));
export const getRequestReports = (state: stateInterface) =>
  reports.getRequestReports(getReportState(state));
export const getBenefitReports = (state: stateInterface) =>
  reports.getBenefitReports(getReportState(state));
export const getCashAdvanceRequestReports = (state: stateInterface) =>
  reports.getCashAdvanceReports(getReportState(state));
export const getExpenseWithRequest = (state: stateInterface) =>
  reports.getExpenseWithRequestReports(getReportState(state));
export const getReportCount = (state: stateInterface) =>
  reports.getReportsCount(getReportState(state));
export const getReportCountLoading = (state: stateInterface) =>
  reports.getReportCountLoading(getReportState(state));
export const moreReportsLoading = (state: stateInterface) =>
  reports.moreReportsLoading(getReportState(state));
export const getDownloadedReportsList = (state: stateInterface) =>
  reports.getDownloadedReportsList(getReportState(state));
export const getExpenseFilters = (state: stateInterface) =>
  reports.getExpenseFilters(getReportState(state));
export const getRequestFilters = (state: stateInterface) =>
  reports.getRequestFilters(getReportState(state));
export const getExpenseWithRequestFilters = (state: stateInterface) =>
  reports.getExpenseWithRequestFilters(getReportState(state));
export const getCashAdvanceFilters = (state: stateInterface) =>
  reports.getCashAdvanceFilters(getReportState(state));
export const getReportsExpenseTypes = (state: stateInterface) =>
  reports.getExpenseTypes(getReportState(state));
export const getReportsBenefitTypes = (state: stateInterface) =>
  reports.getBenefitTypes(getReportState(state));
export const getSpecializedReportTypes = (state: stateInterface) =>
  reports.getSpecializedReportTypes(getReportState(state));
// Drafts
export const getDraftsLoader = (state: stateInterface) =>
  drafts.getLoadingState(getDraftState(state));
export const getRequeststate = (state: stateInterface) =>
  drafts.getRequeststate(getDraftState(state));
export const isDraftDataAvailable = (state: stateInterface) =>
  drafts.isDataAvailable(getDraftState(state));
export const getDraftRequests = (state: stateInterface) =>
  drafts.getRequests(getDraftState(state));

export const getDraftExpenses = (state: stateInterface) =>
  drafts.getExpenses(getDraftState(state));

export const getDraftReceipts = (state: stateInterface) =>
  drafts.getReceipts(getDraftState(state));

export const getDraftBenefits = (state: stateInterface) =>
  drafts.getBenefits(getDraftState(state));
export const getDraftCount = (state: stateInterface) =>
  drafts.getDraftCount(getDraftState(state));
export const getDraftCountLoader = (state: stateInterface) =>
  drafts.getDraftCountLoader(getDraftState(state));
export const getDraftExpensesWithRequest = (state: stateInterface) =>
  drafts.getExpensesWithRequest(getDraftState(state));
export const getDraftDefaultView = (state: stateInterface) =>
  drafts.getDefaultView(getDraftState(state));

//User profile
export const getProfileLoader = (state: stateInterface) =>
  userProfile.getLoader(getProfileState(state));
export const getProfileErrorMessage = (state: stateInterface) =>
  userProfile.getErrorMessage(getProfileState(state));
export const getProfileData = (state: stateInterface) =>
  userProfile.getUserProfileData(getProfileState(state));
export const getRoles = (state: stateInterface) =>
  userProfile.getRoles(getProfileState(state));

export const getSystemLabelsCustomisation = (state: stateInterface) =>
  systemLabelsCustomisation.getSystemLabelCustomisations(
    getSystemLabelsCustomisationState(state),
  );

//Delegates
export const getDelegatePermissions = (state: stateInterface) =>
  delegates.getPermissions(getDelegateState(state));
export const getDelegateToMe = (state: stateInterface) =>
  delegates.getDelegateToMe(getDelegateState(state));
export const getDelegatedByMe = (state: stateInterface) =>
  delegates.getDelegatedByMe(getDelegateState(state));
export const getDelegateError = (state: stateInterface) =>
  delegates.getError(getDelegateState(state));
export const getErrorObject = (state: stateInterface) =>
  delegates.getErrorObject(getDelegateState(state));
export const getApiStatus = (state: stateInterface) =>
  delegates.getApiStatus(getDelegateState(state));
export const getAPILoadingState = (state: stateInterface) =>
  delegates.getAPILoadingState(getDelegateState(state));
export const getDelegateSuccess = (state: stateInterface) =>
  delegates.getSuccess(getDelegateState(state));
export const getDelegateLoader = (state: stateInterface) =>
  delegates.getLoadingState(getDelegateState(state));
export const getDelegateLoadingMessage = (state: stateInterface) =>
  delegates.getLoadingMessage(getDelegateState(state));
export const getDelegatedUsers = (state: stateInterface) =>
  delegates.getUsers(getDelegateState(state));
export const getDelegatedDataLoading = (state: stateInterface) =>
  delegates.getDataLoadingState(getDelegateState(state));
export const getProxyUsers = (state: stateInterface) =>
  delegates.getProxyUsers(getDelegateState(state));
export const getCurrentDelegateUser = (state: stateInterface) =>
  delegates.getCurrentDelegateUser(getDelegateState(state));
export const getDelegateScreenConfig = (state: stateInterface) =>
  delegates.getDelegateConfig(getDelegateState(state));
export const getDelegateUserCostCentre = (state: stateInterface) =>
  delegates.getCurrentUserCostCentre(getDelegateState(state));

//delegate permissions
export const isDraftMenuAllowed = (state: stateInterface) =>
  delegates.isDraftMenuAllowed(getDelegateState(state));
export const isSubmittedMenuAllowed = (state: stateInterface) =>
  delegates.isSubmittedMenuAllowed(getDelegateState(state));
export const isApprovedMenuAllowed = (state: stateInterface) =>
  delegates.isApprovedMenuAllowed(getDelegateState(state));
export const isProxyPermissionAllowed = (
  state: stateInterface,
  permission: PROXY_PERMISSIONS,
) => delegates.isProxyPermissionAllowed(getDelegateState(state), permission);

// Outbound
export const getOutboundError = (state: stateInterface) =>
  outbound.getError(getOutboundState(state));
export const getOutboundLoader = (state: stateInterface) =>
  outbound.getLoader(getOutboundState(state));
export const getOutboundSuccess = (state: stateInterface) =>
  outbound.getSuccess(getOutboundState(state));
export const getOutboundLoadingMessage = (state: stateInterface) =>
  outbound.getLoadingMessage(getOutboundState(state));
export const getOutboundSchedule = (state: stateInterface) =>
  outbound.getSchedule(getOutboundState(state));
export const getOutboundFileFormats = (state: stateInterface) =>
  outbound.getFileFormats(getOutboundState(state));
export const getOutboundDataSaveLoader = (state: stateInterface) =>
  outbound.getDataSaveLoader(getOutboundState(state));
export const getOutboundCategoryRecords = (state: stateInterface) =>
  outbound.getCategoryRecords(getOutboundState(state));
export const getOutboundFileSplitRecords = (state: stateInterface) =>
  outbound.getFileSplitRecords(getOutboundState(state));
export const getOutboundDateFormat = (state: stateInterface) =>
  outbound.getDateFormat(getOutboundState(state));
export const getOutboundDelimiter = (state: stateInterface) =>
  outbound.getDelimiter(getOutboundState(state));

// Inbound
export const getInboundError = (state: stateInterface) =>
  inbound.getError(getInboundState(state));
export const getInboundLoader = (state: stateInterface) =>
  inbound.getLoader(getInboundState(state));
export const getInboundSuccess = (state: stateInterface) =>
  inbound.getSuccess(getInboundState(state));
export const getInboundLoadingMessage = (state: stateInterface) =>
  inbound.getLoadingMessage(getInboundState(state));
export const getInboundSchedule = (state: stateInterface) =>
  inbound.getSchedule(getInboundState(state));
export const getInboundIsDataSaving = (state: stateInterface) =>
  inbound.getIsDataSaving(getInboundState(state));

// Approvals
export const getExpenseApprovalItems = (state: stateInterface) =>
  approvals.getExpenseApprovalItems(state);
export const getExpensesWithRequestApprovalItems = (state: stateInterface) =>
  approvals.getExpensesWithRequestApprovalItems(state);
export const getRequestApprovalItems = (state: stateInterface) =>
  approvals.getRequestApprovalItems(state);

// Entitlement Rules
export const getEntitlementRulesLoader = (state: stateInterface) =>
  entitlementRules.getIsLoading(getEntitlementRulesState(state));
export const getEntitlementRulesItemLoader = (state: stateInterface) =>
  entitlementRules.getIsEntitlementRuleItemLoading(
    getEntitlementRulesState(state),
  );

export const getIsRuleItemLoading = (state: stateInterface) =>
  entitlementRules.getIsRuleItemLoading(getEntitlementRulesState(state));
export const getEntitlementRulesError = (state: stateInterface) =>
  entitlementRules.getErrorMessage(getEntitlementRulesState(state));
export const getEntitlementRulesData = (state: stateInterface) =>
  entitlementRules.getEntitlementRulesData(getEntitlementRulesState(state));
export const getEntitlementRuleDetails = (state: stateInterface) =>
  entitlementRules.getEntitlementRuleDetails(getEntitlementRulesState(state));

// Simulate Entitlement Rule
export const getIsSimulatedDataLoading = (state: stateInterface) =>
  entitlementRules.getIsSimulatedDataLoading(getEntitlementRulesState(state));
export const getSimulatedEntitementData = (state: stateInterface) =>
  entitlementRules.getSimulatedEntitementData(getEntitlementRulesState(state));
export const getSimulatedListData = (state: stateInterface) =>
  entitlementRules.getSimulatedListData(getEntitlementRulesState(state));

export const getSimulatedDataListLoader = (state: stateInterface) =>
  entitlementRules.getSimulatedDataListLoader(getEntitlementRulesState(state));
export const getSimulatedEntitlementDataLoader = (state: stateInterface) =>
  entitlementRules.getSimulatedEntitlementDataLoader(
    getEntitlementRulesState(state),
  );

// Add-Update Entitlement Rule
export const getAddUpdateEntitlementRuleAction = (state: stateInterface) =>
  addUpdateEntitlementRule.getAddUpdateEntitlementRuleAction(
    getAddUpdateEntitlementRuleState(state),
  );
export const getProcessTypesForEntitlement = (state: stateInterface) =>
  addUpdateEntitlementRule.getProcessTypesForEntitlement(
    getAddUpdateEntitlementRuleState(state),
  );
export const getSelectedProcessTypeForEntitlement = (state: stateInterface) =>
  addUpdateEntitlementRule.getSelectedProcessTypeForEntitlement(
    getAddUpdateEntitlementRuleState(state),
  );
export const getTypeObjectsForEntitlement = (state: stateInterface) =>
  addUpdateEntitlementRule.getTypeObjectsForEntitlement(
    getAddUpdateEntitlementRuleState(state),
  );
export const getSelectedTypeObjectForEntitlement = (state: stateInterface) =>
  addUpdateEntitlementRule.getSelectedTypeObjectForEntitlement(
    getAddUpdateEntitlementRuleState(state),
  );
export const getEntitlementRuleTitle = (state: stateInterface) =>
  addUpdateEntitlementRule.getEntitlementRuleTitle(
    getAddUpdateEntitlementRuleState(state),
  );
export const getEntitlementEffectiveFrom = (state: stateInterface) =>
  addUpdateEntitlementRule.getEntitlementEffectiveFrom(
    getAddUpdateEntitlementRuleState(state),
  );

export const getOptionsForEntitlement = (state: stateInterface) =>
  addUpdateEntitlementRule.getOptionsForEntitlement(
    getAddUpdateEntitlementRuleState(state),
  );
export const getOperatorsForEntitlement = (state: stateInterface) =>
  addUpdateEntitlementRule.getOperatorsForEntitlement(
    getAddUpdateEntitlementRuleState(state),
  );
export const getGendersForEntitlement = (state: stateInterface) =>
  addUpdateEntitlementRule.getGendersForEntitlement(
    getAddUpdateEntitlementRuleState(state),
  );
export const getMaritalStatusesForEntitlement = (state: stateInterface) =>
  addUpdateEntitlementRule.getMaritalStatusesForEntitlement(
    getAddUpdateEntitlementRuleState(state),
  );
export const getContractTypesForEntitlement = (state: stateInterface) =>
  addUpdateEntitlementRule.getContractTypesForEntitlement(
    getAddUpdateEntitlementRuleState(state),
  );
export const getRefObjEmpGroupsForEntitlement = (state: stateInterface) =>
  addUpdateEntitlementRule.getRefObjEmpGroupsForEntitlement(
    getAddUpdateEntitlementRuleState(state),
  );
export const getEmpSubGroupsForEntitlement = (state: stateInterface) =>
  addUpdateEntitlementRule.getEmpSubGroupsForEntitlement(
    getAddUpdateEntitlementRuleState(state),
  );
export const getEmpGroupsForEntitlement = (state: stateInterface) =>
  addUpdateEntitlementRule.getEmpGroupsForEntitlement(
    getAddUpdateEntitlementRuleState(state),
  );
export const getPayGradesForEntitlement = (state: stateInterface) =>
  addUpdateEntitlementRule.getPayGradesForEntitlement(
    getAddUpdateEntitlementRuleState(state),
  );
export const getEmployeeIdsForEntitlement = (state: stateInterface) =>
  addUpdateEntitlementRule.getEmployeeIdsForEntitlement(
    getAddUpdateEntitlementRuleState(state),
  );
export const getUsersForEntitlement = (state: stateInterface) =>
  addUpdateEntitlementRule.getUsersForEntitlement(
    getAddUpdateEntitlementRuleState(state),
  );

export const getLegalEntitiesForEntitlement = (state: stateInterface) =>
  addUpdateEntitlementRule.getLegalEntitiesForEntitlement(
    getAddUpdateEntitlementRuleState(state),
  );
export const getCustomCaseOptionsForEntitlement = (state: stateInterface) =>
  addUpdateEntitlementRule.getCustomCaseOptionsForEntitlement(
    getAddUpdateEntitlementRuleState(state),
  );
export const getCustomCasesCostCentreTypesForEntitlement = (
  state: stateInterface,
) =>
  addUpdateEntitlementRule.getCustomCasesCostCentreTypesForEntitlement(
    getAddUpdateEntitlementRuleState(state),
  );
export const getCustomCasesClaimCreatorTypesForEntitlement = (
  state: stateInterface,
) =>
  addUpdateEntitlementRule.getCustomCasesClaimCreatorTypesForEntitlement(
    getAddUpdateEntitlementRuleState(state),
  );

export const getEntitlementRuleConfig = (state: stateInterface) =>
  addUpdateEntitlementRule.getEntitlementRuleConfig(
    getAddUpdateEntitlementRuleState(state),
  );
export const getReadableEntitlementRuleConfig = (state: stateInterface) =>
  addUpdateEntitlementRule.getReadableEntitlementRuleConfig(
    getAddUpdateEntitlementRuleState(state),
  );
export const getCurrentSectionDataForEntitlement = (state: stateInterface) =>
  addUpdateEntitlementRule.getCurrentSectionDataForEntitlement(
    getAddUpdateEntitlementRuleState(state),
  );
export const getIfDefaultCriteraForEntitlementTouched = (
  state: stateInterface,
) =>
  addUpdateEntitlementRule.getIfDefaultCriteraForEntitlementTouched(
    getAddUpdateEntitlementRuleState(state),
  );
export const getCurrentReadableSectionDataForEntitlement = (
  state: stateInterface,
) =>
  addUpdateEntitlementRule.getCurrentReadableSectionDataForEntitlement(
    getAddUpdateEntitlementRuleState(state),
  );

export const getDrawerTitleForEntitlement = (state: stateInterface) =>
  addUpdateEntitlementRule.getDrawerTitleForEntitlement(
    getAddUpdateEntitlementRuleState(state),
  );
export const getDrawerForEntitlement = (state: stateInterface) =>
  addUpdateEntitlementRule.getDrawerForEntitlement(
    getAddUpdateEntitlementRuleState(state),
  );
export const getDrawerActionForEntitlement = (state: stateInterface) =>
  addUpdateEntitlementRule.getDrawerActionForEntitlement(
    getAddUpdateEntitlementRuleState(state),
  );

export const getCurrentEditingSectionIndexForEntitlement = (
  state: stateInterface,
) =>
  addUpdateEntitlementRule.getCurrentEditingSectionIndexForEntitlement(
    getAddUpdateEntitlementRuleState(state),
  );

// export const getCostCentresForEntitlement = (state: stateInterface) =>
//   addUpdateEntitlementRule.getCostCentresForEntitlement(getAddUpdateEntitlementRuleState(state));

//Policy Configuration
export const getPolicyConfiguration = (state: stateInterface) =>
  policyConfiguration.getPolicyConfiguration(
    getPolicyConfigurationState(state),
  );

export const getPolicyConfigurationDetails = (state: stateInterface) =>
  policyConfiguration.getPolicyConfigurationDetails(
    getPolicyConfigurationState(state),
  );

export const getPolicyConfigurationDetailsLoader = (state: stateInterface) =>
  policyConfiguration.getPolicyConfigurationDetailsLoader(
    getPolicyConfigurationState(state),
  );

export default rootReducer;

export interface stateInterface {
  app: IinitialStateAppReducer;
  configuration: ISettingsConfigurationState;
  expenseTypeConfiguration: IinitialexpenseTypeConfigurationState;
  employeeGroupsListing: IemployeeGroupReducerInitialState;
  AddEmployeeGroups: IaddEmployeeGroupReducerInitialState;
  referenceObject: IObjectReferenceState;
  WageType: IwageTypeInitialState;
  glAccount: GL_ACCOUNT_STATE;
  costCentre: COST_CENTRE_STATE;
  AddNewExpenseForm: IAddNewExpenseFormReducerIntialState;
  receipt: IinitialReceiptState;
  approvals: IApprovals;
  request: IRequest;
  admin: IAdmin;
  drafts: IDraftState;
  submitted: ISubmittedState;
  requestConfig: IRequestTypeConfigState;
  roles: IRoles;
  reports: IReportState;
  labelsCustomisation: ISystemLabelsCustomisation;
  delegates: IDelegateState;
  adminDelegates: IAdminDelegateState;
  searchBar: ISearchBarState;
  emailTemplates: IEmailTemplates;
  policyConfiguration: IPolicyConfiguration;
  DashboardsReducer: any;
  SfLogsReducer: any;
  FileEncryptionReducer: any;
  BenefitReducer: any;
  AllowanceNewReducer: any;
  BenefitCategoriesReducer: any;
  AddBenefitTypeConfigReducer: any;
  dashboard: any;
  currencyConversion: any;
  allowanceRate: any;
  benefitConfig: any;
  claimDetection: any;
  sfIntegration: any;
  auth: AUTH_STATE;
  entities: any;
  rules: any;
  addUpdateRule: any;
  userProfile: any;
  outbound: any;
  inbound: any;
  expenseAudit: TexpenseAuditDataType;
  riskScoreRange: IRiskScoreRange;
}
