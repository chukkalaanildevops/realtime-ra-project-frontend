/* eslint-disable react-hooks/exhaustive-deps */

import React, { Dispatch, useEffect, useState } from 'react';
import { Table, message, Switch, Skeleton, Button } from 'antd';
import {
  FilterBar,
  AppDrawer,
  ConfigurationDetailView,
  ConfirmationModal,
  NoData,
  ErrorBoundary,
} from '../../../shared/components/';
import { appPath } from '../../app/app.routes';
import { NavLink, useHistory } from 'react-router-dom';
import {
  getBenefitTypes,
  getBenefitTypeLoader,
  getBenefitTypeLoadingMessage,
  getBenefitTypeExpandedItem,
  getBenefitTypeSuccessMessage,
  getBenefitTypeErrorMessage,
  getBenefitTypeDataLoading,
  getPermissions,
  getBenefitTitleUpdateConfig,
} from '../../../shared/redux/rootReducer';
import {
  fetchBenefitTypeList,
  // fetchBenefitTypeById,
  deleteBenefitType,
  toggleBenefitType,
  fetchBenefitTypeConfigById,
  updateTitleAndCode,
} from '../benefitTypeConfiguration.thunk';
import { connect, ConnectedProps } from 'react-redux';
import { HeaderBarWrapper, DotMenu } from '../../../shared/components';
import {
  EllipsisOutlined,
  EditOutlined,
  DeleteOutlined,
  ToolOutlined,
  CopyOutlined,
} from '@ant-design/icons';
// import { AppDrawer } from '../../components/appDrawer';

import {
  saveExpandedItem,
  resetData,
  saveBenefitTypes,
  setSuccess,
  setTitleUpdateConfigData,
} from '../benefitTypeConfiguration.action';
import ConfigDetails from './components/configDetails/configDetails.index';

import './benefitTypes.index.less';
import { Trans } from '@lingui/macro';
import { actionBtnObjInterface } from '../../../shared/components/dotMenu/dotMenu.model';
import { TitleUpdaterDrawer } from './components';
import { useTableFilters } from '../../../shared/hooks';
import BenefitDetailIndex from '../../benefits/benefitDetail/benefitDetail.index';

const BenefitTypeListing: React.FC<ConnectedProps<typeof connector>> = ({
  titleUpdateConfigData,
  _fetchBenefitTypes,
  _fetchBenefitTypeDetails,
  _setTitleUpdateConfigData,
  _deleteBenefitType,
  _toggleBenefitType,
  _resetBenefitItem,
  _resetData,
  _saveBenefitTypes,
  _setSuccess,
  _updateTitleAndCode,
  getPermissions,
  benefitTypesData,
  isLoading,
  loadingMessage,
  expandedItem,
  initialBenefitCostCenterForLegalEntity,
  success,
  error,
  isDataLoading,
}) => {
  const [isItemExpanded, expandItem] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<
    string | undefined
  >(undefined);
  const history = useHistory();
  const benefitTypes = isLoading ? new Array(15).fill({}) : benefitTypesData;
  const onItemExpand = (record: any) => {
    expandItem(true);
    _fetchBenefitTypeDetails(record.global_configuration);
  };
  const deleteBenefitType = (id: string) => {
    setShowDeleteConfirm(id);
  };
  const resetBenefitTypeData = (record: any) => {
    _resetData();
    history.push(
      `${appPath.config_setup.benefitType.update.linkTo}${record.global_configuration}`,
    );
  };
  const { getSearchProps, getCheckBoxFilterProps } = useTableFilters();

  useEffect(() => {
    _fetchBenefitTypes();
    _resetData();
  }, []);

  useEffect(() => {
    if (success) {
      message.success(success);
      _setSuccess();
    }
  }, [success]);

  useEffect(() => {
    if (error && typeof error == 'string') {
      error && message.error(error);
    }
  }, [error]);

  const toggleItem = async (id: string, isActive: boolean) => {
    const res: any = await _toggleBenefitType(id, isActive);
    if (res)
      if (res === 'Configuration Saved!')
        _saveBenefitTypes(
          benefitTypes.map(o =>
            o.id === id ? { ...o, is_active: isActive } : o,
          ),
        );
  };

  const cloneRequestType = (id: string) => {
    history.push(appPath.config_setup.benefitType.add.linkTo, {
      type: 'clone',
      id,
    });
  };

  const getElemOrSkeleton = (
    _text: string | React.ReactNode,
    _record?: any,
    _index?: number,
  ) => {
    return isLoading ? (
      <Skeleton.Input size='small' active={isLoading} />
    ) : (
      _text
    );
  };

  const renderTitle = (
    _text: string | React.ReactNode,
    _record?: any,
    _index?: number,
  ) => {
    return (
      <Button
        type='link'
        onClick={() =>
          history.push(
            appPath.config_setup.benefitType.legalEntityListing.linkTo +
              _record.id,
          )
        }
      >
        {_text}
      </Button>
    );
  };

  const columns = [
    {
      key: 'IS_ACTIVE',
      title: () => getElemOrSkeleton(''),
      dataIndex: 'is_active',
      width: 100,
      align: 'center' as 'center',
      render: (value: boolean, record: any) =>
        isLoading ? (
          <Skeleton.Input size='small' active={isLoading} />
        ) : (
          <div>
            <Switch
              checked={value}
              onChange={newVal => toggleItem(record.id, newVal)}
            />
          </div>
        ),
      ...getCheckBoxFilterProps(
        [
          {
            text: 'Active',
            value: 'true',
          },
          {
            text: 'Deactive',
            value: 'false',
          },
        ],
        'is_active',
      ),
    },
    {
      key: 'TITLE',
      dataIndex: 'title',
      title: () => getElemOrSkeleton(<Trans>Title</Trans>),
      ...getSearchProps(
        'title',
        (_val: boolean, _record?: any, _index?: number) => {
          return getElemOrSkeleton(
            <NavLink
              className='custom-nav-link'
              to={`${appPath.config_setup.benefitType.legalEntityListing.linkTo}${_record?.item?.id}`}
            >
              {_val}
            </NavLink>,
          );
        },
      ),
      render: isLoading ? getElemOrSkeleton : renderTitle,
    },
    {
      key: 'CODE',
      dataIndex: 'code',
      title: () => getElemOrSkeleton(<Trans>Code</Trans>),
      render: getElemOrSkeleton,
    },
    {
      key: 'ACTION',
      title: () => getElemOrSkeleton(<Trans>Action</Trans>),
      dataIndex: 'action',
      width: 90,
      align: 'center' as 'center',
      render: (_text: any, record: any) =>
        isLoading ? (
          <Skeleton.Input size='small' active={isLoading} />
        ) : (
          <DotMenu
            actionBtn={((): actionBtnObjInterface[] => {
              let actions: actionBtnObjInterface[] = [
                {
                  OnClick: () => resetBenefitTypeData(record),
                  children: <Trans>Update</Trans>,
                  Type: 'default',
                  icon: EditOutlined,
                },
                {
                  OnClick: () => {
                    _setTitleUpdateConfigData({
                      id: record.id,
                      title: record.title,
                      code: record.code,
                    });
                  },
                  Disabled: false,
                  Type: 'default',
                  children: <Trans>Update Title</Trans>,
                  icon: EditOutlined,
                },

                {
                  children: <Trans>View Configuration</Trans>,
                  Type: 'default',
                  OnClick: () => onItemExpand(record),
                  icon: ToolOutlined,
                },
                {
                  children: <Trans>Clone</Trans>,
                  Type: 'default',
                  OnClick: () => cloneRequestType(record.global_configuration),
                  icon: CopyOutlined,
                },
                {
                  children: <Trans>Delete</Trans>,
                  Type: 'default',
                  OnClick: () => deleteBenefitType(record.id),
                  icon: DeleteOutlined,
                },
              ];
              if (!getPermissions.ACTION_SETUP_BENEFIT_TYPES) {
                actions = [
                  {
                    children: <Trans>View Configuration</Trans>,
                    Type: 'link',
                    OnClick: () => onItemExpand(record),
                    icon: ToolOutlined,
                  },
                ];
              }
              return actions;
            })()}
          >
            <EllipsisOutlined />
          </DotMenu>
        ),
    },
  ];

  const getColumns = () => {
    const toBeRemovedIndexes: any = [];
    for (let index = 0; index < columns.length; index++) {
      const item = columns[index];
      if (
        item.key === 'IS_ACTIVE' &&
        !getPermissions.ACTION_SETUP_BENEFIT_TYPES
      ) {
        toBeRemovedIndexes.push(index);
      }
    }
    const newColumns = columns.filter(
      (_item, index) => !toBeRemovedIndexes.includes(index),
    );
    return newColumns;
  };

  const closeDetailsDrawer = () => {
    _resetBenefitItem();
    expandItem(false);
  };

  useEffect(() => {
    if (isLoading && loadingMessage) {
      message.loading(loadingMessage);
    } else {
      message.destroy();
    }
  }, [isLoading, loadingMessage]);
  return (
    <ErrorBoundary>
      <HeaderBarWrapper
        headerCommonProps={{ title: <Trans>Benefit Types</Trans> }}
      >
        <div
          style={{ display: 'block' }}
          className='benefit-type-listing-container'
        >
          <FilterBar
            isAddButton={getPermissions.ACTION_SETUP_BENEFIT_TYPES}
            addButtonOnClickFn={() => {
              _resetData();
              history.push(appPath.config_setup.benefitType.add.linkTo);
            }}
            enableBackBtn={true}
            backBtnUrl={appPath.config_setup.benefitType.backLink}
            filterShown={false}
          />

          {benefitTypes.length === 0 ? (
            <NoData description={<Trans>No Benefit Type</Trans>}></NoData>
          ) : (
            <Table
              columns={getColumns()}
              dataSource={benefitTypes}
              bordered
              rowKey={item => item.id}
              pagination={{ hideOnSinglePage: true }}
            />
          )}
          {/* {Object.keys(expandedItem).length > 0 && ( */}
          <AppDrawer
            visible={isItemExpanded}
            onClose={closeDetailsDrawer}
            title={expandedItem.title}
            showCancelButton={false}
            showOkButton={false}
            closable={true}
            onOkClick={closeDetailsDrawer}
            getContainer='.benefit-type-listing-container'
          >
            <ConfigurationDetailView
              ConfigurationComponent={
                <ConfigDetails
                  isDataLoading={isDataLoading}
                  configData={{
                    ...expandedItem,
                    initialBenefitCostCenterForLegalEntity,
                  }}
                />
              }
              customFieldsData={expandedItem.custom_fields}
              isLoadingData={isDataLoading}
              FormPreviewComponent={() => (
                <BenefitDetailIndex
                  benefitClaimId={undefined}
                  _configuration={expandItem || {}}
                />
              )}
            />
          </AppDrawer>
          <TitleUpdaterDrawer
            _setTitleUpdateConfigData={_setTitleUpdateConfigData}
            titleUpdateConfigData={titleUpdateConfigData}
            _updateTitleAndCode={_updateTitleAndCode}
          />
          <ConfirmationModal
            visible={showDeleteConfirm !== undefined}
            onCancelClick={() => setShowDeleteConfirm(undefined)}
            onOkClick={() => {
              _deleteBenefitType(showDeleteConfirm || '');
              setShowDeleteConfirm(undefined);
            }}
            okText='Delete'
            isConfirmModel={true}
            header={<Trans>Do you want to delete benefit type</Trans>}
            extraModelProps={{ destroyOnClose: true }}
          />
          {/* )} */}
          {/* </Skeleton> */}
        </div>
      </HeaderBarWrapper>
    </ErrorBoundary>
  );
};

const mapStateToProps = (state: any) => {
  const { initialBenefitCostCenterForLegalEntity } = state.benefitConfig;
  return {
    initialBenefitCostCenterForLegalEntity,
    benefitTypesData: getBenefitTypes(state),
    isLoading: getBenefitTypeLoader(state),
    loadingMessage: getBenefitTypeLoadingMessage(state),
    expandedItem: getBenefitTypeExpandedItem(state),
    success: getBenefitTypeSuccessMessage(state),
    error: getBenefitTypeErrorMessage(state),
    isDataLoading: getBenefitTypeDataLoading(state),
    getPermissions: getPermissions(state),
    titleUpdateConfigData: getBenefitTitleUpdateConfig(state),
  };
};

// getBenefitTitleUpdateConfig

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  _fetchBenefitTypes: () => dispatch(fetchBenefitTypeList()),
  _fetchBenefitTypeDetails: (id: string) =>
    dispatch(fetchBenefitTypeConfigById(id)),
  _deleteBenefitType: (id: string) => dispatch(deleteBenefitType(id)),
  _toggleBenefitType: (id: string, isActive: boolean) =>
    dispatch(toggleBenefitType(id, isActive)),
  _resetBenefitItem: () => dispatch(saveExpandedItem({})),
  _resetData: () => dispatch(resetData()),
  _saveBenefitTypes: (data: any) => dispatch(saveBenefitTypes(data)),
  _setSuccess: () => dispatch(setSuccess('')),
  _updateTitleAndCode: (
    id: number,
    data: any,
    callback?: (isSuccess: boolean) => void,
  ) => dispatch(updateTitleAndCode(id, data, callback)),
  _setTitleUpdateConfigData: (data: any) =>
    dispatch(setTitleUpdateConfigData(data)),
});

const connector = connect(mapStateToProps, mapDispatchToProps);

export default connector(BenefitTypeListing);
