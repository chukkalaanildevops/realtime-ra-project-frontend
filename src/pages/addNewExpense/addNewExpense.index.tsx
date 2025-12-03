import React, { FC, memo, Dispatch, useEffect } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import {
  stateInterface,
  getIsPettyCashManager,
  getIsPettyCashEnabled,
  getIsAllowanceEnabled,
} from '../../shared/redux/rootReducer';

import { Tabs, message } from 'antd';
import { HeaderBarWrapper, ErrorBoundary } from '../../shared/components/';
import { AddExpensesForm } from './components';
import AllowanceFormNew from '../addNewExpense/components/allowanceNew/allowanceFormNew.index';
import {
  IaddNewExpenseProps,
  TactiveTabKey,
  IgetUserEntitledExpenseTypeListprops,
  Tmode,
  IgetUserEntitledExpenseTypeListUsingRequestIdprops,
} from './addNewExpense.model';
import {
  fetchLoggedInUserInfo,
  fetchUserEntitledExpenseTypeList,
  fetchUserEntitledExpenseTypeListUsingRequestId,
  fetchUserJobInfo,
  fetchCostCentreChageTo,
  fetchExpenseClaimData,
} from './addNewExpense.thunk';
import { fetchCountryCurrencyList } from '../setup/component/other/currencyConversion/currencyConversion.thunk';
import {
  updateTabKey,
  resetToInitial,
  apiCallReset,
  setUpdateId,
  setViewMode,
  setFormMode,
  setRequestData,
  setIsAdminEdit,
  updateIsResubmissionCase,
} from './addNewExpense.actions';

import { setConfirmationInfo, resetConfirmationInfo } from '../app/app.actions';
import { IConfirmationInfo } from '../app/app.model';

import './addNewExpense.index.less';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { Trans } from '@lingui/macro';
import { IuserInfo } from '../../shared/model';
import { getQueryString } from '../../utils/scroll.utils';
import { getQueryParametersAsObject } from '../../utils/global.utils';
import { appPath } from '../app/app.routes';
import { saveUserData } from '../../shared/redux/auth/auth.actions';
import {
  resetAllowanceFormData,
  resetToAllowanceInitial,
  setUUIDForAllowance,
  setAllowanceRecordsId,
  setAllowanceRecordsDeleteId,
} from './components/allowanceNew/allowanceNew.actions';
import { deleteAllowanceRecordsWhilePageSwitch } from './components/allowanceNew/allowanceNew.thunk';

const mapStateToProps = (state: stateInterface) => {
  const {
    activeTabKey,
    configuration,
    viewOnly,
    mode,
    error,
    expenseTypeListLoader,
    info,
    success,
    isLoading,
    userInfo,
    backendError,
  } = state.AddNewExpenseForm;
  const {
    allowanceConfiguration,
    uuidForAllowance,
    allowanceRecordsId,
  } = state.AllowanceNewReducer;
  return {
    activeTabKey,
    configuration,
    viewOnly,
    mode,
    error,
    info,
    success,
    isLoading,
    expenseTypeListLoader,
    userInfo,
    backendError,
    allowanceConfiguration,
    uuidForAllowance,
    allowanceRecordsId,
    getIsPettyCashManager: getIsPettyCashManager(state),
    getIsPettyCashEnabled: getIsPettyCashEnabled(state),
    getIsAllowanceEnabled: getIsAllowanceEnabled(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  return {
    _updateTabKey: (key: TactiveTabKey) => dispatch(updateTabKey(key)),

    _resetToInitial: () => dispatch(resetToInitial()),

    _apiCallReset: () => dispatch(apiCallReset()),

    _fetchLoggedInUserInfo: (): any => dispatch(fetchLoggedInUserInfo()),

    _fetchUserEntitledExpenseTypeList: (
      props: IgetUserEntitledExpenseTypeListprops,
    ) => dispatch(fetchUserEntitledExpenseTypeList(props)),

    _fetchUserEntitledExpenseTypeListUsingRequestId: (
      props: IgetUserEntitledExpenseTypeListUsingRequestIdprops,
    ) => dispatch(fetchUserEntitledExpenseTypeListUsingRequestId(props)),

    _fetchUserJobInfo: (userId: number) => dispatch(fetchUserJobInfo(userId)),

    _saveUserData: (userData: any) => dispatch(saveUserData(userData)),

    _fetchCurrencyList: () => dispatch(fetchCountryCurrencyList()),

    _fetchCostCentreChageTo: () => dispatch(fetchCostCentreChageTo()),

    _setUpdateId: (id: number | null) => dispatch(setUpdateId(id)),

    _fetchExpenseClaimData: (id: number, callback?: Function) =>
      dispatch(fetchExpenseClaimData(id, callback)),

    _setConfirmationInfo: (_data: IConfirmationInfo) =>
      dispatch(setConfirmationInfo(_data)),

    _resetConfirmationInfo: () => dispatch(resetConfirmationInfo()),

    _setViewMode: (bool: boolean) => dispatch(setViewMode(bool)),

    _setFormMode: (mode: Tmode) => dispatch(setFormMode(mode)),

    _setRequestData: (bool: boolean, id: number) =>
      dispatch(setRequestData(bool, id)),

    _setIsAdminEdit: (bool: boolean) => dispatch(setIsAdminEdit(bool)),
    _updateIsResubmissionCase: (bool: boolean) =>
      dispatch(updateIsResubmissionCase(bool)),
    _resetToAllowanceInitial: () => dispatch(resetToAllowanceInitial()),
    _resetAllowanceFormData: () => dispatch(resetAllowanceFormData()),
    _setUUIDForAllowance: (data: any) => dispatch(setUUIDForAllowance(data)),
    _setAllowanceRecordsId: (data: any) =>
      dispatch(setAllowanceRecordsId(data)),
    _setAllowanceRecordsDeleteId: (data: any) =>
      dispatch(setAllowanceRecordsDeleteId(data)),
    _deleteAllowanceRecordsWhilePageSwitch: (data: any, callBack?: Function) =>
      dispatch(deleteAllowanceRecordsWhilePageSwitch(data, callBack)),
  };
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type Tprops = ConnectedProps<typeof connector> & IaddNewExpenseProps;

const AddNewExpense: FC<Tprops> = props => {
  const {
    activeTabKey,
    configuration,
    enableViewOnly,
    legalEntityId,
    mode,
    isLoading,
    userInfo,
    expenseTypeListLoader,
    info,
    success,
    error,
    backendError,
    isForRequest,
    requestId,
    expenseId,
    _updateTabKey,
    _resetToInitial,
    _fetchLoggedInUserInfo,
    _fetchUserEntitledExpenseTypeList,
    _fetchUserJobInfo,
    _saveUserData,
    _fetchCurrencyList,
    _fetchCostCentreChageTo,
    _setUpdateId,
    _fetchExpenseClaimData,
    _setConfirmationInfo,
    _resetConfirmationInfo,
    _apiCallReset,
    _setViewMode,
    _setFormMode,
    _setRequestData,
    onExpenseAddedSuccessfully,
    _fetchUserEntitledExpenseTypeListUsingRequestId,
    _setIsAdminEdit,
    _updateIsResubmissionCase,
    _resetToAllowanceInitial,
    allowanceConfiguration,
    _resetAllowanceFormData,
    _setUUIDForAllowance,
    uuidForAllowance,
    _setAllowanceRecordsId,
    _setAllowanceRecordsDeleteId,
    _deleteAllowanceRecordsWhilePageSwitch,
    allowanceRecordsId,
  } = props;
  const { TabPane } = Tabs;
  const isUsingForRequest: boolean =
    Boolean(isForRequest) && Boolean(requestId);
  const history = useHistory();
  const location: any = useLocation();
  const params: any = useParams();

  const handleTabOnChange = (activeKey: string): void => {
    try {
      if (activeTabKey !== activeKey) {
        if (isUsingForRequest) {
          if (allowanceRecordsId?.length > 0) {
            _deleteAllowanceRecordsWhilePageSwitch(allowanceRecordsId, () => {
              _updateTabKey(activeKey as TactiveTabKey);
              _resetAllowanceFormData();
              _setUUIDForAllowance(null);
              _setAllowanceRecordsId([]);
              _setAllowanceRecordsDeleteId(null);
              history.replace(`${location.pathname}`);
            });
          } else {
            _updateTabKey(activeKey as TactiveTabKey);
            _resetAllowanceFormData();
            _setUUIDForAllowance(null);
            _setAllowanceRecordsId([]);
            _setAllowanceRecordsDeleteId(null);
            history.replace(`${location.pathname}`);
          }
        } else {
          if (allowanceRecordsId?.length > 0) {
            _deleteAllowanceRecordsWhilePageSwitch(allowanceRecordsId, () => {
              _setUUIDForAllowance(null);
              _setAllowanceRecordsId([]);
              _setAllowanceRecordsDeleteId(null);
              history.replace(
                appPath.addNewExpense.add.linkTo + activeKey + '/',
              );
            });
          } else {
            _setUUIDForAllowance(null);
            _setAllowanceRecordsId([]);
            _setAllowanceRecordsDeleteId(null);
            history.replace(appPath.addNewExpense.add.linkTo + activeKey + '/');
          }
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleConfirmationModelOkBtn = (activeTabName: string) => {
    try {
      handleTabOnChange(activeTabName);
      _resetConfirmationInfo();
    } catch (error) {
      console.error(error);
    }
  };

  const handleConfirmationModelCancelBtn = () => {
    try {
      _resetConfirmationInfo();
    } catch (error) {
      console.error(error);
    }
  };

  const apiCalls = async () => {
    try {
      _fetchCurrencyList();
      _fetchCostCentreChageTo();
      const _userInfo: IuserInfo = await _fetchLoggedInUserInfo();
      _userInfo && _saveUserData(_userInfo);
      _userInfo?.id && _fetchUserJobInfo(_userInfo?.id);
    } catch (error) {
      console.error(error);
    }
  };

  const _ExpenseTypeListFetching_EffectFn = () => {
    //On change of user id or tab key calling expense type list fetching api
    if (mode !== 'UPDATE') {
      if (isUsingForRequest && activeTabKey) {
        _fetchUserEntitledExpenseTypeListUsingRequestId({
          requestId: requestId as number,
          category: activeTabKey as TactiveTabKey,
        });
      } else {
        userInfo?.id &&
          activeTabKey &&
          _fetchUserEntitledExpenseTypeList({
            userId: userInfo.id,
            category: activeTabKey as TactiveTabKey,
          });
      }
    }
  };

  useEffect(_ExpenseTypeListFetching_EffectFn, [activeTabKey]);

  useEffect(_ExpenseTypeListFetching_EffectFn, [userInfo]);

  const checkAndSetCategory = () => {
    if (mode === 'ADD') {
      if (params.hasOwnProperty('category')) {
        const cat = params.category,
          isValidCategory =
            cat === 'general' ||
            cat === 'entertainment' ||
            cat === 'mileage' ||
            cat === 'petty' ||
            cat === 'allowance';
        if (isValidCategory) {
          _updateTabKey(cat as TactiveTabKey);
          if (uuidForAllowance === null) {
            _resetAllowanceFormData();
          }
        } else {
          if (isUsingForRequest) {
            _updateTabKey((activeTabKey || 'general') as TactiveTabKey);
          } else {
            history.replace(
              appPath.addNewExpense.add.linkTo +
                (activeTabKey || 'general') +
                '/',
            );
          }
        }
      } else if (isUsingForRequest) {
        _updateTabKey('general');
        history.push(`${location.pathname}`);
      }
    }
  };
  useEffect(checkAndSetCategory, [params?.category]);

  const _comonentDidMount_EffectFn = () => {
    try {
      let claimId: undefined | string | number = undefined;
      let modeVal: Tmode | undefined = undefined;
      const isViewMode: boolean = Boolean(legalEntityId && enableViewOnly);

      if (params.hasOwnProperty('id')) {
        // Update Mode
        claimId = expenseId ? expenseId : params.id;
        modeVal = 'UPDATE';
        // Seting isAdminEdit flag
        const _isAdminEdit: boolean = Boolean(
          getQueryString('mode') === 'admin',
        );
        _isAdminEdit && _setIsAdminEdit(_isAdminEdit);
        const query = getQueryParametersAsObject() || {};
        if (query.hasOwnProperty('is_resubmission_case'))
          _updateIsResubmissionCase(
            Boolean(query.is_resubmission_case.toLowerCase() === 'true'),
          );
      } else if (isViewMode) {
        // View Mode
        claimId = legalEntityId;
        enableViewOnly && _setViewMode(enableViewOnly); // view mode only
      } else if (
        location?.state?.claimId &&
        location?.state?.mode === 'clone'
      ) {
        // Clone Mode
        claimId = location?.state?.claimId;
        modeVal = 'CLONE';
      } else {
        //ADD
        modeVal = 'ADD';
        checkAndSetCategory();
      }

      if (claimId) {
        _setUpdateId(Number(claimId));
        _fetchExpenseClaimData(Number(claimId)); // You dont need to fetch configuration. It will automaticaly fetched onChange of `selectedExpenseType`.
      }

      isUsingForRequest &&
        _setRequestData(isForRequest as boolean, requestId as number);

      modeVal && _setFormMode(modeVal);
      !isViewMode && apiCalls();
    } catch (error) {
      console.error(error);
    }
    return _comonentWillUnmount_EffectFn;
  };

  const _comonentWillUnmount_EffectFn = () => {
    try {
      message.destroy();
      _resetToInitial();
      _resetToAllowanceInitial();
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(_comonentDidMount_EffectFn, []);

  useEffect(() => {
    message.destroy();
    if (!backendError) {
      if (isLoading && !!info) message.loading(info, 0);
      else if (success) message.success(success, 5, _apiCallReset);
      else if (error) message.error(error, 5, _apiCallReset);
    } else if (backendError.hasOwnProperty('request')) {
      message.error(backendError.request[0]);
    } else if (backendError.hasOwnProperty('non_field_errors')) {
      message.error(backendError.non_field_errors[0]);
    } else if (backendError.hasOwnProperty('entertainment_staff_members')) {
      message.error(backendError.entertainment_staff_members[0]);
    } else if (backendError.hasOwnProperty('entertainment_guest_members')) {
      message.error(backendError.entertainment_guest_members[0]);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, success, error, info]);

  const getMainComponent = () => (
    <div className='add-new-expense-container'>
      <ErrorBoundary>
        <Tabs
          destroyInactiveTabPane
          activeKey={activeTabKey || ''}
          onChange={(activeKey: string) => {
            if (configuration !== null || allowanceConfiguration !== null) {
              _setConfirmationInfo({
                forWhat: 'TAB_CHANGE',
                extraInfo: activeKey,
                okText: 'No, Leave Page',
                cancelText: 'Yes, Stay Here',
                visibility: true,
                headerText: 'Warning',
                bodyText:
                  'Do you want to save your data before leaving this page?',
                cancelBtnFn: handleConfirmationModelCancelBtn,
                okBtnFn: handleConfirmationModelOkBtn.bind(null, activeKey),
              });
            } else {
              !expenseTypeListLoader && handleConfirmationModelOkBtn(activeKey);
            }
          }}
        >
          {mode !== 'ADD' && activeTabKey !== 'general' ? null : (
            <TabPane
              tab={<Trans>General</Trans>}
              disabled={isLoading && expenseTypeListLoader}
              key='general'
            >
              <AddExpensesForm
                onExpenseAddedSuccessfully={onExpenseAddedSuccessfully}
              />
            </TabPane>
          )}
          {mode !== 'ADD' && activeTabKey !== 'entertainment' ? null : (
            <TabPane
              tab={<Trans>Entertainment</Trans>}
              disabled={isLoading && expenseTypeListLoader}
              key='entertainment'
            >
              <AddExpensesForm
                onExpenseAddedSuccessfully={onExpenseAddedSuccessfully}
              />
            </TabPane>
          )}
          {mode !== 'ADD' && activeTabKey !== 'mileage' ? null : (
            <TabPane
              tab={<Trans>Mileage</Trans>}
              disabled={isLoading && expenseTypeListLoader}
              key='mileage'
            >
              <AddExpensesForm
                onExpenseAddedSuccessfully={onExpenseAddedSuccessfully}
              />
            </TabPane>
          )}
          {!props.getIsPettyCashEnabled ||
          !props.getIsPettyCashManager ||
          (mode !== 'ADD' && activeTabKey !== 'petty') ? null : (
            <TabPane
              tab={<Trans>Petty Cash</Trans>}
              disabled={isLoading && expenseTypeListLoader}
              key='petty'
            >
              <AddExpensesForm
                onExpenseAddedSuccessfully={onExpenseAddedSuccessfully}
              />
            </TabPane>
          )}
          {/* {!props.getIsAllowanceEnabled ||
            (mode !== 'ADD' && activeTabKey !== 'allowance' ? null : (
              <TabPane
                tab={<Trans>Allowance</Trans>}
                disabled={isLoading}
                key='allowance'
              >
                <AddExpensesForm
                  onExpenseAddedSuccessfully={onExpenseAddedSuccessfully}
                />
              </TabPane>
            ))} */}
          {!props.getIsAllowanceEnabled ||
            (mode !== 'ADD' && activeTabKey !== 'allowance' ? null : (
              <TabPane
                tab={<Trans>Allowance</Trans>}
                disabled={isLoading && expenseTypeListLoader}
                key='allowance'
              >
                <AllowanceFormNew
                  onExpenseAddedSuccessfully={onExpenseAddedSuccessfully}
                />
              </TabPane>
            ))}
        </Tabs>
      </ErrorBoundary>
    </div>
  );

  return (
    <ErrorBoundary>
      {enableViewOnly ? (
        activeTabKey !== 'allowance' ? (
          <div className='add-new-expense-container opened-in-drawer view-only-disabled'>
            <AddExpensesForm />
          </div>
        ) : (
          <div className='add-new-expense-container opened-in-drawer view-only-disabled'>
            <AllowanceFormNew />
          </div>
        )
      ) : isUsingForRequest ? (
        getMainComponent()
      ) : (
        <HeaderBarWrapper
          headerCommonProps={{
            title:
              mode === 'UPDATE' ? (
                <Trans>Update Expense</Trans>
              ) : (
                <Trans>Add Expense</Trans>
              ),
          }}
          data-test='headerBarWrapper'
        >
          {mode === 'ADD' ? (
            getMainComponent()
          ) : activeTabKey !== 'allowance' ? (
            <div className='add-new-expense-container without-tabs'>
              <AddExpensesForm
                onExpenseAddedSuccessfully={onExpenseAddedSuccessfully}
              />
            </div>
          ) : (
            <div className='add-new-expense-container without-tabs'>
              <AllowanceFormNew
                onExpenseAddedSuccessfully={onExpenseAddedSuccessfully}
              />
            </div>
          )}
        </HeaderBarWrapper>
      )}
    </ErrorBoundary>
  );
};

export default connector(memo(AddNewExpense));
