import React, {
  memo,
  FC,
  useRef,
  useEffect,
  ComponentType,
  useMemo,
} from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { Tabs, Modal, message, Button } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { appPath } from '../../app/app.routes';

import { connect, ConnectedProps } from 'react-redux';
import {
  tabKeyUpdateAction,
  updateCustomDataAction,
  updateLabelDataAction,
  updateExpenseTypeUpdateIdAndMode,
  resetAllExpenseTypeState,
  apiCallReset,
  returnClearDataAction,
  tabSwitchConfirmationVisibilityAction,
  resetConfirmationInfo,
  updateConfirmationInfo,
  setIsSaveResumeStateTrue,
  generateDetailConfigration,
} from '../expenseTypeConfiguration.actions';
import {
  fetchEntityList,
  fetchCountryList,
  fetchCategoryList,
  fetchMaximumClaimAmountPerPeriodData,
  fetchAllowClaimsOnList,
  createGlobalExpenseTypeConfiguration,
  createCustomizeExpenseTypeConfiguration,
  putExpenseTypeConfiguration,
  fetchExpenseTypeDataWithConfiguration,
  fetchLabelMappingList,
} from '../expenseTypeConfiguration.thunk';
import { fetchWageTypeListCompatibleForDD } from '../../../shared/redux/wageType/wageType.thunk';
import { fetchGlAccounts } from '../../../shared/redux/glAccount/glAccount.thunk';
import { fetchCostCentres } from '../../../shared/redux/costCentre/costCentre.thunk';
import {
  customObjInterface,
  Ilabel,
  TconfigMode,
  IputCustomizeExpenseTypeBody,
  IentityList,
  IConfirmationInfo,
  IExpenseTypeCategory,
} from '../expenseTypeConfiguration.model';
import { stateInterface } from '../../../shared/redux/rootReducer';

import './addExpenseTypeConfiguration.index.less';
import { generalStructure } from '../expenseTypeConfiguration.structure';

import {
  HeaderBarWrapper,
  CustomFields,
  LabelMapping,
  BackButton,
  ConfirmationModal,
} from '../../../shared/components/';
import ConfigForm from './components/configForm/configForm.index';
import ClaimPreview from '../../addNewExpense/claimDetails/claimDetails.index';
import { Trans } from '@lingui/macro';

const ExpenseTypeConfiguration: FC<ConnectedProps<
  typeof connector
>> = props => {
  const {
    activeTabKey,
    expenseUpdateId,
    custom,
    label,
    tabSwitchConfirmationVisibility,
    loadingLabelMappingList,
    configMode,
    backendError,
    error,
    success,
    info,
    isLoading,
    loadingConfigurationData,
    expenseUpdateConfigurationId,
    confirmationInfo,
    general_data,
    entertaiment,
    mileage,
    categoryList,
    entityList,
    allowClaimsOn,
    maximumClaimAmountPerPeriodDataList,
    // costCenterList,
    wageTypeListDDCompatible,
    GLAccountList,
    countryList,
    pettyCash,
    _fetchEntity,
    _tabKeyUpdate,
    _updateCustomData,
    _updateLabelData,
    _fetchCostCentres,
    _fetchGlAccounts,
    _fetchWageTypeListCompatibleForDD,
    _fetchCountryList,
    _fetchCategory,
    _fetchMaximumClaimAmountPerPeriod,
    _fetchAllowClaimsOn,
    _createGlobalExpenseTypeConfiguration,
    _putExpenseTypeConfiguration,
    _updateExpenseTypeUpdateIdAndMode,
    _fetchExpenseTypeDataWithConfiguration,
    _fetchLabelMappingList,
    _resetAllExpenseTypeState,
    _returnClearDataAction,
    _tabSwitchConfirmationVisibilityAction,
    _apiCallReset,
    _createCustomizeExpenseTypeConfiguration,
    _updateConfirmationInfo,
    _resetConfirmationInfo,
    _setIsSaveResumeStateTrue,
  } = props;

  const isUpdateMode = configMode !== 'ADD';
  const clearBtnVisbility = !isUpdateMode;
  const history = useHistory();
  const location: any = useLocation();
  const params: any = useParams();

  useEffect(() => {
    /* ComponentDidMount */
    _apiCallReset();
    const callAll = () => {
      // check for modes. ADD, UPDATE, CUSTOMIZE ADD, CUSTOMIZE UPDATE, CLONE
      if (params.hasOwnProperty('id')) {
        const _id = params.id;
        if (_id) {
          let mode: TconfigMode = 'UPDATE';
          const query = new URLSearchParams(location.search);
          if (query.has('mode')) {
            const conf_id: string | null = String(query.get('conf_id')) || null;
            const queryMode: string = String(query.get('mode'));
            const queryEntity: string = String(query.get('entity'));
            if (queryMode === 'ca') {
              mode = 'CUSTOMIZE_ADD';
              _fetchExpenseTypeDataWithConfiguration(_id, conf_id, true, data =>
                processDataBeforeSave(data, mode, queryEntity, conf_id),
              );
            } else if (queryMode === 'cu') {
              mode = 'CUSTOMIZE_UPDATE';
              _fetchExpenseTypeDataWithConfiguration(_id, conf_id, true, data =>
                processDataBeforeSave(data, mode, queryEntity, conf_id),
              );
            }
          } else {
            // UPDATE
            _fetchExpenseTypeDataWithConfiguration(_id, null, true);
          }
          _updateExpenseTypeUpdateIdAndMode(_id, mode);
        }
      } else {
        if (location?.state?.hasOwnProperty('expense_type_id')) {
          // CLONE
          _fetchExpenseTypeDataWithConfiguration(
            location.state.expense_type_id,
            null,
            true,
            data => processDataBeforeSave(data, 'CLONE'),
          );
        } else {
          //ADD
          _fetchLabelMappingList('General');
        }
      }
      _fetchCategory();
      _fetchEntity();
      _fetchMaximumClaimAmountPerPeriod();
      _fetchCostCentres();
      _fetchGlAccounts();
      _fetchWageTypeListCompatibleForDD();
      _fetchCountryList();
      _fetchAllowClaimsOn();
    };
    callAll();
    return () => {
      /* ComponentWillUnmount */
      _resetAllExpenseTypeState();
      message.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const processDataBeforeSave = (
    data: any,
    mode: TconfigMode | 'CLONE',
    queryEntity?: string,
    custom_config_id?: string | null,
  ): any => {
    if (mode === 'CUSTOMIZE_ADD' || mode === 'CUSTOMIZE_UPDATE') {
      let customFields = data.custom_fields;
      if (mode === 'CUSTOMIZE_ADD') {
        customFields.fields = customFields.fields.filter(
          (o: any) => !o.is_deleted,
        );
      }
      const update_config = custom_config_id
        ? custom_config_id
        : data.global_configuration;

      const legal_entity =
        data.legal_entity.length > 0
          ? data.legal_entity.filter((o: IentityList) => o.uuid === queryEntity)
          : data.legal_entity;

      return {
        ...data,
        legal_entity: legal_entity,
        global_configuration: update_config,
        custom_fields: customFields,
      };
    } else if (mode === 'CLONE') {
      return {
        ...data,
        legal_entity: [],
        title: '',
        code: '',
        custom_fields: {
          fields: data.custom_fields.fields.filter(
            (o: customObjInterface) => !o.is_deleted,
          ),
          layout: data.custom_fields.layout,
        },
      };
    } else {
      return data;
    }
  };

  const { confirm } = Modal;
  const layoutRef = useRef(null);
  const configFormRef = useRef<HTMLElement | any>(null);

  const handleConfirmationModelOkBtn = async () => {
    _resetConfirmationInfo();
    if (confirmationInfo.forWhat === 'CLEAR_CONFIGURATION') {
      if (configFormRef !== null && configFormRef.current) {
        configFormRef.current!.onClearBtnHandler(); //this line clear all form data(reset form fields).
      }
      _returnClearDataAction(); //reset store
    }
  };

  const handleTabClick = (key: string, event: any) => {
    event.preventDefault();
    if (key === activeTabKey && tabSwitchConfirmationVisibility) {
      confirm({
        title: <Trans>Do you want to switch tab?</Trans>,
        icon: <ExclamationCircleOutlined />,
        content: 'Current changes will be lost.',
        okText: 'Stay here',
        cancelText: 'Switch Tab',
        centered: true,
        getContainer: layoutRef && layoutRef.current,
        onOk() {},
        onCancel() {
          _tabKeyUpdate(key);
          _tabSwitchConfirmationVisibilityAction(false);
        },
      });
    } else {
      _tabKeyUpdate(key);
    }
  };

  const saveCustomFieldsInStoreFn = (data: customObjInterface[]) => {
    _updateCustomData(data);
  };

  const saveMappedLabel = (data: Ilabel) => {
    _updateLabelData(data);
  };

  const returnBackURL = (): string => {
    let backURL: string = '';
    switch (configMode) {
      case 'ADD':
        backURL = appPath.config_setup.expenseType.add.backLink;
        break;
      case 'CUSTOMIZE_ADD':
        backURL = `${appPath.config_setup.expenseType.legalEntityListing.customize.backLink}${expenseUpdateId}`;
        break;
      case 'UPDATE':
        backURL = appPath.config_setup.expenseType.update.backLink;
        break;
      case 'CUSTOMIZE_UPDATE':
        backURL = `${appPath.config_setup.expenseType.legalEntityListing.customize.backLink}${expenseUpdateId}`;
        break;
    }
    return backURL;
  };

  const callBackFnAfterPostApiCall = (isSuccess: boolean) => {
    if (isSuccess) {
      _setIsSaveResumeStateTrue();
      history.push(returnBackURL());
    }
  };

  const saveExpenseTypeConfiguration = (postData: any) => {
    if (configMode === 'ADD') {
      _createGlobalExpenseTypeConfiguration(
        postData,
        callBackFnAfterPostApiCall,
      );
    } else if (configMode === 'CUSTOMIZE_ADD') {
      _createCustomizeExpenseTypeConfiguration(
        postData,
        expenseUpdateId,
        callBackFnAfterPostApiCall,
      );
    } else if (configMode === 'CUSTOMIZE_UPDATE' || configMode === 'UPDATE') {
      _putExpenseTypeConfiguration(
        postData,
        expenseUpdateConfigurationId,
        callBackFnAfterPostApiCall,
      );
    }
  };

  const handleSaveBtnClick = (
    _event: React.MouseEvent<HTMLElement, MouseEvent>,
  ) => {
    if (configFormRef !== null && configFormRef.current) {
      Promise.all([configFormRef.current!.onSubmitHandler()])
        .then(() => {})
        .catch((_err: any) => {
          _tabKeyUpdate('1');
        });
    }
  };

  const handleClearBtnClick = () => {
    _updateConfirmationInfo({
      forWhat: 'CLEAR_CONFIGURATION',
      extraInfo: '',
      okText: <Trans>Clear</Trans>,
      cancelText: 'Cancel',
      visibility: true,
      headerText: 'You want clear all data?',
      bodyText: '',
    });
  };

  const getConfigurationAsBackend = useMemo(() => {
    try {
      const param = {
        isUpdateMode,
        custom,
        label,
        general_data,
        entertaiment,
        mileage,
        categoryList,
        entityList,
        allowClaimsOn,
        maximumClaimAmountPerPeriodDataList,
        // costCenterList,
        wageTypeListDDCompatible,
        GLAccountList,
        countryList,
        pettyCash,
      };
      return generateDetailConfigration(param);
    } catch (e) {
      return null;
    }
  }, [
    isUpdateMode,
    custom,
    label,
    general_data,
    entertaiment,
    mileage,
    categoryList,
    entityList,
    allowClaimsOn,
    maximumClaimAmountPerPeriodDataList,
    wageTypeListDDCompatible,
    GLAccountList,
    countryList,
    pettyCash,
  ]);

  useEffect(() => {
    message.destroy();
    if (isLoading) message.loading(info, 0);
    else if (success) message.success(success, 5, _apiCallReset);
    else if (error) message.error(error, 5, _apiCallReset);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, success, error, info]);

  return (
    <>
      <HeaderBarWrapper
        headerCommonProps={{ title: <Trans>Expense Type Configuration</Trans> }}
      >
        <div
          className='ExpenseTypeConfiguration-container'
          data-test='ExpenseTypeConfiguration'
        >
          <Tabs
            onTabClick={handleTabClick}
            size='large'
            activeKey={activeTabKey}
            renderTabBar={(_props: any, DefaultTabBar: ComponentType) => (
              <div className='tabs-with-back-button-container'>
                <BackButton
                  backBtnUrl={returnBackURL()}
                  onBackClick={() => {
                    _setIsSaveResumeStateTrue();
                  }}
                />
                <DefaultTabBar {..._props} />
              </div>
            )}
          >
            <Tabs.TabPane
              tab={<Trans>Configuration</Trans>}
              key='1'
              data-test='tab_1'
            >
              <ConfigForm
                saveExpenseTypeConfiguration={saveExpenseTypeConfiguration}
                isUpdateMode={isUpdateMode}
                ref={configFormRef}
              />
            </Tabs.TabPane>
            <Tabs.TabPane
              tab={<Trans>Custom Fields</Trans>}
              key='2'
              data-test='tab_2'
            >
              <CustomFields
                errors={
                  backendError.custom_fields ? backendError.custom_fields : {}
                }
                formStructure={generalStructure.custom}
                saveCustomFields={saveCustomFieldsInStoreFn as any}
                savedCustomFields={custom}
                isUpdateMode={isUpdateMode}
                updateTabSwitchConfirmationVisibility={
                  _tabSwitchConfirmationVisibilityAction
                }
                title={<Trans id='<Expense Type> Form' />}
                isRemoveDeletedField={Boolean(
                  configMode === 'ADD' || configMode === 'CUSTOMIZE_ADD',
                )}
              />
            </Tabs.TabPane>
            <Tabs.TabPane
              tab={<Trans>Label Mapping</Trans>}
              key='3'
              data-test='tab_3'
            >
              <LabelMapping
                isLabelDataListLoaded={loadingLabelMappingList}
                labelData={label}
                saveMappedLabel={saveMappedLabel}
              />
            </Tabs.TabPane>
            <Tabs.TabPane
              tab={<Trans>Form Preview</Trans>}
              key='4'
              data-test='tab_4'
            >
              <ClaimPreview
                claimId={null}
                _configuration={getConfigurationAsBackend}
              />
            </Tabs.TabPane>
          </Tabs>
          <div className='tab-footer'>
            {clearBtnVisbility && (
              <Button
                type='primary'
                ghost
                data-test='clear'
                onClick={handleClearBtnClick}
                style={{ padding: '0 3rem', margin: '0 1rem' }}
              >
                <Trans>Clear</Trans>
              </Button>
            )}
            <Button
              type='primary'
              htmlType='submit'
              data-test='submit'
              disabled={isLoading || loadingConfigurationData}
              onClick={handleSaveBtnClick}
              style={{ padding: '0 3rem', margin: '0 1rem' }}
            >
              <Trans>Save Configuration</Trans>
            </Button>
          </div>

          <ConfirmationModal
            visible={confirmationInfo.visibility}
            header={confirmationInfo.headerText}
            body={confirmationInfo.bodyText}
            onCancelClick={() => _resetConfirmationInfo()}
            okText={confirmationInfo.okText}
            cancelText={confirmationInfo.cancelText}
            onOkClick={handleConfirmationModelOkBtn}
          />
        </div>
      </HeaderBarWrapper>
    </>
  );
};

const mapStateToProps = (state: stateInterface) => {
  const {
    activeTabKey,
    expenseUpdateId,
    general_data,
    entertaiment,
    mileage,
    custom,
    label,
    tabSwitchConfirmationVisibility,
    loadingLabelMappingList,
    error,
    success,
    info,
    isLoading,
    loadingConfigurationData,
    backendError,
    configMode,
    expenseUpdateConfigurationId,
    confirmationInfo,
    categoryList,
    entityList,
    allowClaimsOn,
    maximumClaimAmountPerPeriodDataList,
    countryList,
    pettyCash,
  } = state.expenseTypeConfiguration;
  const { costCentres: costCenterList } = state.costCentre;
  const { glAccounts: GLAccountList } = state.glAccount;
  const { wageTypeListDDCompatible } = state.WageType;
  return {
    activeTabKey,
    expenseUpdateId,
    general_data,
    entertaiment,
    mileage,
    custom,
    label,
    tabSwitchConfirmationVisibility,
    loadingLabelMappingList,
    error,
    success,
    info,
    isLoading,
    loadingConfigurationData,
    backendError,
    configMode,
    expenseUpdateConfigurationId,
    confirmationInfo,
    categoryList,
    entityList,
    allowClaimsOn,
    maximumClaimAmountPerPeriodDataList,
    costCenterList,
    wageTypeListDDCompatible,
    GLAccountList,
    countryList,
    pettyCash,
  };
};

const mapDispatchToProps = (dispatch: React.Dispatch<any>) => {
  return {
    _apiCallReset: () => dispatch(apiCallReset()),
    _updateExpenseTypeUpdateIdAndMode: (_id: string, mode: TconfigMode) =>
      dispatch(updateExpenseTypeUpdateIdAndMode(_id, mode)),
    _fetchExpenseTypeDataWithConfiguration: (
      _id: string,
      globalConfigId: string | null = null,
      saveForForm: boolean,
      processDataBeforeSave?: (data: any) => any,
    ) =>
      dispatch(
        fetchExpenseTypeDataWithConfiguration(
          _id,
          globalConfigId,
          saveForForm,
          processDataBeforeSave,
        ),
      ),
    _fetchCategory: () => dispatch(fetchCategoryList()),
    _fetchLabelMappingList: (category: IExpenseTypeCategory) =>
      dispatch(fetchLabelMappingList(category)),
    _fetchEntity: () => dispatch(fetchEntityList()),
    _fetchMaximumClaimAmountPerPeriod: () =>
      dispatch(fetchMaximumClaimAmountPerPeriodData()),
    _fetchCostCentres: () => dispatch(fetchCostCentres()),
    _fetchGlAccounts: () => dispatch(fetchGlAccounts()),
    _fetchWageTypeListCompatibleForDD: () =>
      dispatch(fetchWageTypeListCompatibleForDD()),
    _fetchCountryList: () => dispatch(fetchCountryList()),
    _fetchAllowClaimsOn: () => dispatch(fetchAllowClaimsOnList()),
    _createGlobalExpenseTypeConfiguration: (
      postData: any,
      callback?: (isSuccess: boolean) => void,
    ) => dispatch(createGlobalExpenseTypeConfiguration(postData, callback)),
    _createCustomizeExpenseTypeConfiguration: (
      postData: IputCustomizeExpenseTypeBody,
      id: string,
      callback?: (isSuccess: boolean) => void,
    ) =>
      dispatch(createCustomizeExpenseTypeConfiguration(postData, id, callback)),
    _putExpenseTypeConfiguration: (
      postData: any,
      id: string,
      callback?: (isSuccess: boolean) => void,
    ) => dispatch(putExpenseTypeConfiguration(postData, id, callback)),
    _tabKeyUpdate: (key: string) => dispatch(tabKeyUpdateAction(key)),
    _updateCustomData: (data: customObjInterface[]) =>
      dispatch(updateCustomDataAction(data)),
    _updateLabelData: (data: Ilabel) => dispatch(updateLabelDataAction(data)),
    _resetAllExpenseTypeState: () => dispatch(resetAllExpenseTypeState()),
    _returnClearDataAction: () => dispatch(returnClearDataAction()),
    _tabSwitchConfirmationVisibilityAction: (_bool: boolean) =>
      dispatch(tabSwitchConfirmationVisibilityAction(_bool)),
    _updateConfirmationInfo: (_data: IConfirmationInfo) =>
      dispatch(updateConfirmationInfo(_data)),
    _resetConfirmationInfo: () => dispatch(resetConfirmationInfo()),
    _setIsSaveResumeStateTrue: () => dispatch(setIsSaveResumeStateTrue()),
  };
};

const connector = connect(mapStateToProps, mapDispatchToProps);

export default connector(memo(ExpenseTypeConfiguration));
