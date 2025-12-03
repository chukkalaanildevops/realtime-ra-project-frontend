import React, { FC, useEffect, memo } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import {
  stateInterface,
  getPermissions,
} from '../../../shared/redux/rootReducer';
import {
  message,
  Card,
  Button,
  Skeleton,
  Col,
  Row,
  Modal,
  Select,
  Form,
} from 'antd';
import {
  MoreOutlined,
  UndoOutlined,
  ToolOutlined,
  ToolFilled,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import {
  apiCallReset,
  updateDetailsId,
  updateViewState,
  resetToInitial,
  updateAddEntityModelVisibility,
  updateConfirmationInfo,
  resetConfirmationInfo,
  setIsSaveResumeStateTrue,
} from '../expenseTypeConfiguration.actions';
import { useHistory, useParams } from 'react-router-dom';
import {
  IexpenseTypeEntityList,
  //IentityList,
  IConfirmationInfo,
} from '../expenseTypeConfiguration.model';
import {
  FilterBar,
  HeaderBarWrapper,
  AppDrawer,
  ConfigurationDetailView,
  DotMenu,
  ConfirmationModal,
} from '../../../shared/components';
import {
  fetchExpenseTypeEntityList,
  fetchExpenseTypeDataWithConfiguration,
  removeLegalEntitiesFromExpenseType,
  fetchEntityList,
  addLegalEntitiesExpenseType,
  fetchExpenseTypeData,
  resetExpenseTypeConfigurationToGlobal,
} from '../expenseTypeConfiguration.thunk';
import { ConfigDetails } from '../expenseTypes/components';
import { appPath } from '../../app/app.routes';
import ClaimPreview from '../../addNewExpense/claimDetails/claimDetails.index';

import Data from '../expenseTypeConfiguration.data.json';
import './expenseTypeLegalEntityListing.index.less';
import { Trans } from '@lingui/macro';

const mapDispatchToProps = (dispatch: React.Dispatch<any>) => {
  return {
    _apiCallReset: () => dispatch(apiCallReset()),
    _fetchExpenseTypeEntityList: (id: string) =>
      dispatch(fetchExpenseTypeEntityList(id)),
    _updateDetailsId: (id: string) => dispatch(updateDetailsId(id)),
    _updateViewState: (_bool: boolean, clickedItem: any) =>
      dispatch(updateViewState(_bool, clickedItem)),
    _fetchExpenseTypeDataWithConfiguration: (
      id: string,
      globalConfigId: string,
    ) => dispatch(fetchExpenseTypeDataWithConfiguration(id, globalConfigId)),
    _fetchExpenseTypeData: (id: string) => dispatch(fetchExpenseTypeData(id)),
    _resetToInitial: () => dispatch(resetToInitial()),
    _removeLegalEntitiesFromExpenseType: (
      id: string,
      callback: (isDeleted: boolean) => void,
    ) => dispatch(removeLegalEntitiesFromExpenseType(id, callback)),
    _updateAddEntityModelVisibility: (visibility: boolean) =>
      dispatch(updateAddEntityModelVisibility(visibility)),
    _fetchEntityList: () => dispatch(fetchEntityList()),
    _addLegalEntitiesExpenseType: (id: string, data: any) =>
      dispatch(addLegalEntitiesExpenseType(id, data)),
    _resetExpenseTypeConfigurationToGlobal: (id: string) =>
      dispatch(resetExpenseTypeConfigurationToGlobal(id)),
    _updateConfirmationInfo: (_data: IConfirmationInfo) =>
      dispatch(updateConfirmationInfo(_data)),
    _setIsSaveResumeStateTrue: () => dispatch(setIsSaveResumeStateTrue()),
    _resetConfirmationInfo: () => dispatch(resetConfirmationInfo()),
  };
};
const mapStateToProp = (state: stateInterface) => {
  const {
    expenseTypes,
    confirmationInfo,
    detailsId,
    viewClicked,
    expenseTypeEntityList,
    loadingExpenseTypeEntityList,
    expenseTypeDetailLoading,
    addEntityModelVisibility,
    entityList,
    item,
    error,
    success,
    isLoading,
    loadingEntity,
    info,
  } = state.expenseTypeConfiguration;
  return {
    expenseTypes,
    confirmationInfo,
    detailsId,
    viewClicked,
    expenseTypeEntityList,
    loadingExpenseTypeEntityList,
    expenseTypeDetailLoading,
    addEntityModelVisibility,
    entityList,
    item,
    error,
    success,
    isLoading,
    loadingEntity,
    info,
    getPermissions: getPermissions(state),
  };
};
const connector = connect(mapStateToProp, mapDispatchToProps);

const ExpenseTypeLegalEntityListing: FC<ConnectedProps<
  typeof connector
>> = props => {
  const {
    expenseTypes,
    confirmationInfo,
    detailsId,
    viewClicked,
    expenseTypeEntityList,
    loadingExpenseTypeEntityList,
    expenseTypeDetailLoading,
    addEntityModelVisibility,
    entityList,
    item,
    isLoading,
    loadingEntity,
    success,
    info,
    error,
    getPermissions,
    _apiCallReset,
    _resetToInitial,
    _fetchExpenseTypeEntityList,
    _updateDetailsId,
    _updateViewState,
    _fetchExpenseTypeDataWithConfiguration,
    _removeLegalEntitiesFromExpenseType,
    _updateAddEntityModelVisibility,
    _fetchEntityList,
    _addLegalEntitiesExpenseType,
    _fetchExpenseTypeData,
    _resetExpenseTypeConfigurationToGlobal,
    _updateConfirmationInfo,
    _resetConfirmationInfo,
    _setIsSaveResumeStateTrue,
  } = props;

  const history = useHistory();
  const params: any = useParams();

  const handleConfirmationModelOkBtn = async () => {
    _resetConfirmationInfo();
    if (confirmationInfo.forWhat === 'RESET_CUSTOMIZE_CONFIGURATION') {
      await _resetExpenseTypeConfigurationToGlobal(
        String(confirmationInfo.extraInfo),
      ); //API RESET Call
      _fetchExpenseTypeEntityList(detailsId);
    } else if (confirmationInfo.forWhat === 'REMOVE_LEGAL_ENTITY') {
      await _removeLegalEntitiesFromExpenseType(
        String(confirmationInfo.extraInfo),
        (isDeleted: boolean) => {
          isDeleted && _fetchExpenseTypeEntityList(detailsId); //API Get Call
        },
      ); //API DELETE Call
    }
  };

  const handleExpandClick = async (
    _id: string,
    _e: React.MouseEvent<HTMLElement, MouseEvent>,
  ) => {
    (window as any).reimAPICancelToken();
    _updateViewState(!viewClicked, _id);
    await _fetchExpenseTypeDataWithConfiguration(detailsId, _id);
  };

  const handleFormFinish = async (values: any) => {
    await _addLegalEntitiesExpenseType(detailsId, values);
    _updateAddEntityModelVisibility(false);
    _fetchExpenseTypeEntityList(detailsId);
  };

  useEffect(() => {
    /* ComponentDidMount */
    if (params?.id) {
      _apiCallReset();
      _fetchExpenseTypeData(params.id);
      _updateDetailsId(params.id);
      _fetchExpenseTypeEntityList(params.id); //API Get Call
    } else {
      _setIsSaveResumeStateTrue();
      history.push(
        appPath.config_setup.expenseType.legalEntityListing.customize.backLink,
      );
    }
    return () => {
      /* ComponentWillUnmount */
      message.destroy();
      _resetToInitial();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    message.destroy();
    if (isLoading) message.loading(info, 0);
    else if (success) message.success(success, 5, _apiCallReset);
    else if (error) message.error(error, 5, _apiCallReset);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, success, error, info]);

  const breadCrumbName =
    expenseTypes[0]?.title && expenseTypes[0]?.code
      ? `${expenseTypes[0].title} (${expenseTypes[0].code})`
      : '';

  const renderOptions = () => {
    const alreadyAttached = expenseTypeEntityList.map(
      item => item.legal_entity.uuid,
    );
    const items = entityList.filter(o => !alreadyAttached.includes(o.uuid));
    return items
      .filter(items => items.is_active)
      .map(item => (
        <Select.Option value={item.uuid}>{item.title}</Select.Option>
      ));
  };

  return (
    <HeaderBarWrapper
      headerCommonProps={{
        title: <Trans>Expense Type Legal Entity Details</Trans>,
      }}
      data-test='headerBarWrapper'
      breadcrumbCompVisibility={true}
      breadcrumbCompProps={{
        breadcrumProps: {
          routes: [
            {
              path: '',
              breadcrumbName: breadCrumbName,
            },
          ],
        },
        enableBackBtn: true,
        backBtnStyle: { fontSize: '1.2rem' },
        backBtnUrl:
          appPath.config_setup.expenseType.legalEntityListing.backLink,
        onBackClick: () => {
          _setIsSaveResumeStateTrue();
        },
      }}
    >
      <div
        className='expense-type-details-container'
        data-test='expenseTypeDetailsContainer'
      >
        <FilterBar
          isLoading={loadingExpenseTypeEntityList}
          isAddButton={getPermissions.ACTION_SETUP_EXPENSE_TYPES}
          addButtonText='Add New Entity'
          addButtonOnClickFn={() => {
            _updateAddEntityModelVisibility(true);
            _fetchEntityList();
          }}
          isAddButtonDisabled={false}
          enableBackBtn={false}
          data-test='filterBar'
        />
        <Row className='entity-cards-container' gutter={[24, 24]}>
          {expenseTypeEntityList.map((o: IexpenseTypeEntityList, i: number) => (
            <Col xs={24} sm={12} md={8} lg={8} xl={6} xxl={4} key={i}>
              <Card
                size='small'
                title={
                  <Skeleton
                    loading={loadingExpenseTypeEntityList}
                    active
                    avatar={false}
                    paragraph={{ rows: 1 }}
                  >
                    <div className='title' title={o.legal_entity.title}>
                      {o.legal_entity.title}
                    </div>
                    <div
                      className='legal-entity-type'
                      title={o.legal_entity.legal_entity_type.display_text}
                    >
                      {o.legal_entity.legal_entity_type.display_text}
                    </div>
                  </Skeleton>
                }
                extra={
                  getPermissions.ACTION_SETUP_EXPENSE_TYPES && (
                    <DotMenu
                      showInMenu={true}
                      menuVisibility={true}
                      actionBtn={[
                        {
                          OnClick: () => {
                            history.push(
                              `${
                                appPath.config_setup.expenseType
                                  .legalEntityListing.customize.linkTo
                              }${detailsId}?${
                                o.custom_configuration
                                  ? `mode=cu&conf_id=${o.custom_configuration}&entity=${o.legal_entity.uuid}`
                                  : `mode=ca&conf_id=${o.global_configuration}&entity=${o.legal_entity.uuid}`
                              }`,
                            );
                          },
                          Disabled: false,
                          Type: 'default',
                          children: (
                            <>
                              <Trans>Customize</Trans>
                            </>
                          ),
                          icon: EditOutlined,
                        },
                        {
                          OnClick: () => {
                            _updateConfirmationInfo({
                              forWhat: 'RESET_CUSTOMIZE_CONFIGURATION',
                              extraInfo: o.id,
                              okText: 'Reset',
                              cancelText: 'Cancel',
                              visibility: true,
                              headerText:
                                'You want to reset this configuration?',
                              bodyText: '',
                            });
                          },
                          hide: o.custom_configuration === null,
                          Type: 'default',
                          children: 'Reset To Default',
                          icon: UndoOutlined,
                        },
                        {
                          OnClick: async () => {
                            _updateConfirmationInfo({
                              forWhat: 'REMOVE_LEGAL_ENTITY',
                              extraInfo: o.id,
                              okText: 'Remove',
                              cancelText: 'Cancel',
                              visibility: true,
                              headerText:
                                'You want to remove this legal entity?',
                              bodyText: '',
                            });
                          },
                          Disabled: false,
                          Type: 'default',
                          children: 'Remove Entity',
                          icon: DeleteOutlined,
                        },
                      ]}
                    >
                      <MoreOutlined />
                    </DotMenu>
                  )
                }
              >
                <Skeleton
                  loading={loadingExpenseTypeEntityList}
                  active
                  avatar={false}
                  paragraph={false}
                >
                  <Button
                    className='view-config-btn'
                    type='link'
                    onClick={handleExpandClick.bind(
                      null,
                      o.custom_configuration
                        ? String(o.custom_configuration)
                        : String(o.global_configuration),
                    )}
                    title={
                      o.custom_configuration === null
                        ? 'View Default Configuration'
                        : 'View Customize Configuration'
                    }
                  >
                    {o.custom_configuration === null ? (
                      <ToolOutlined />
                    ) : (
                      <ToolFilled />
                    )}
                    <Trans>View Configuration</Trans>
                  </Button>
                </Skeleton>
              </Card>
            </Col>
          ))}
        </Row>

        <AppDrawer
          data-test='appDrawer'
          title={
            expenseTypeDetailLoading ? (
              <Skeleton.Input active style={{ width: '80%' }} size='small' />
            ) : (
              item?.title + '(' + item?.code + ')' || ''
            )
          }
          visible={viewClicked}
          destroyOnClose={true}
          closable={true}
          onClose={() => {
            _updateViewState(false, {});
          }}
          showCancelButton={false}
          showOkButton={false}
          getContainer='.expense-type-details-container'
          className='types-configuration-detail-drawer'
        >
          <ConfigurationDetailView
            ConfigurationComponent={
              <ConfigDetails
                configData={item}
                isLoadingData={expenseTypeDetailLoading}
              />
            }
            FormPreviewComponent={
              <ClaimPreview claimId={null} _configuration={item || {}} />
            }
            customFieldsData={item.custom_fields}
            isLoadingData={expenseTypeDetailLoading}
          />
        </AppDrawer>

        <Modal
          className='add-entity-container'
          title={<Trans>Add Entities</Trans>}
          visible={addEntityModelVisibility}
          maskClosable={false}
          onCancel={() => _updateAddEntityModelVisibility(false)}
          footer={null}
          centered={true}
          destroyOnClose={true}
          getContainer='.expense-type-details-container'
        >
          <Form name='entityAdd' layout='vertical' onFinish={handleFormFinish}>
            <Row gutter={[0, 0]}>
              <Col span={20}>
                <Form.Item
                  label=''
                  name='legal_entity'
                  rules={[
                    { required: true, message: Data.LEGAL_ENTITY_REQUIRED },
                  ]}
                >
                  <Select
                    showSearch
                    mode='multiple'
                    placeholder='Select Entity'
                    style={{ width: '100%' }}
                    loading={loadingEntity}
                    filterOption={(input: any, option: any) =>
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {renderOptions()}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={3} offset={1}>
                <Button type='link' htmlType='submit'>
                  <Trans>Add</Trans>
                </Button>
              </Col>
            </Row>
          </Form>
        </Modal>

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
  );
};

export default connector(memo(ExpenseTypeLegalEntityListing));
