import React, { FC, memo, useEffect, ReactNode } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import { appPath } from '../../app/app.routes';

import { connect, ConnectedProps } from 'react-redux';
import {
  stateInterface,
  getPermissions,
} from '../../../shared/redux/rootReducer';
import {
  fetchExpenseTypeListData,
  deleteExpenseTypeData,
  fetchExpenseTypeDataWithConfiguration,
  toggleIsActiveExpenseTypeConfig,
  updateTitleAndCode,
} from '../expenseTypeConfiguration.thunk';
import {
  updateViewState,
  apiCallReset,
  resetToInitial,
  saveExpenseTypeListData,
  updateConfirmationInfo,
  resetConfirmationInfo,
  setResumeStateToReducer,
  setResumeState,
  setTitleUpdateConfigData,
  updatelistingFilterData,
} from '../expenseTypeConfiguration.actions';
import {
  IConfirmationInfo,
  // Ipagination,
  IresumeState,
  ITitleUpdateConfigData,
  ITitleAndCode,
  IlistingFilterdata,
} from '../expenseTypeConfiguration.model';
import { message, Table, Skeleton, Switch } from 'antd';
import {
  EllipsisOutlined,
  ToolOutlined,
  DeleteOutlined,
  EditOutlined,
  CopyOutlined,
} from '@ant-design/icons';
import {
  AppDrawer,
  FilterBar,
  DotMenu,
  HeaderBarWrapper,
  ConfigurationDetailView,
  ConfirmationModal,
} from '../../../shared/components/';
import { ConfigDetails, TitleUpdaterDrawer } from './components/';
import ClaimPreview from '../../addNewExpense/claimDetails/claimDetails.index';

import { delay, debounce } from 'lodash';

import { useTableFilters } from '../../../shared/hooks';

import './expenseTypes.index.less';
import { Trans } from '@lingui/macro';

const mapDispatchToProps = (dispatch: React.Dispatch<any>) => {
  return {
    fetchExpenseTypeList: () => dispatch(fetchExpenseTypeListData()),
    _updateViewState: (_bool: boolean, clickedItem: any) =>
      dispatch(updateViewState(_bool, clickedItem)),
    _deleteExpenseTypeData: (id: number) => dispatch(deleteExpenseTypeData(id)),
    _fetchExpenseTypeDataWithConfiguration: (id: string) =>
      dispatch(fetchExpenseTypeDataWithConfiguration(id, null)),
    _apiCallReset: () => dispatch(apiCallReset()),
    _resetToInitial: () => dispatch(resetToInitial()),
    _toggleIsActiveExpenseTypeConfig: (id: number, _data: any) =>
      dispatch(toggleIsActiveExpenseTypeConfig(id, _data)),
    _saveExpenseTypeListData: (_data: any) =>
      dispatch(saveExpenseTypeListData(_data)),
    _updateConfirmationInfo: (_data: IConfirmationInfo) =>
      dispatch(updateConfirmationInfo(_data)),
    _resetConfirmationInfo: () => dispatch(resetConfirmationInfo()),
    _setResumeStateToReducer: () => dispatch(setResumeStateToReducer()),
    _setResumeState: (data: IresumeState = {}) =>
      dispatch(setResumeState(data)),
    _setTitleUpdateConfigData: (data: ITitleUpdateConfigData) =>
      dispatch(setTitleUpdateConfigData(data)),
    _updateTitleAndCode: (
      id: number,
      data: ITitleAndCode,
      callback?: (isSuccess: boolean) => void,
    ) => dispatch(updateTitleAndCode(id, data, callback)),
    _updatelistingFilterData: (data: IlistingFilterdata) =>
      dispatch(updatelistingFilterData(data)),
  };
};
const mapStateToProp = (state: stateInterface) => {
  const {
    expenseTypes,
    titleUpdateConfigData,
    isSaveResumeState,
    resumeState,
    pagination,
    confirmationInfo,
    viewClicked,
    item,
    error,
    success,
    isLoading,
    backendError,
    compactExpenseTypeLoading,
    expenseTypeDetailLoading,
    info,
    listingFilterdata,
    initialExpenseCostCenterForLegalEntity,
  } = state.expenseTypeConfiguration;
  return {
    expenseTypes,
    titleUpdateConfigData,
    isSaveResumeState,
    resumeState,
    pagination,
    confirmationInfo,
    viewClicked,
    item,
    error,
    success,
    isLoading,
    backendError,
    compactExpenseTypeLoading,
    expenseTypeDetailLoading,
    info,
    listingFilterdata,
    initialExpenseCostCenterForLegalEntity,
    getPermissions: getPermissions(state),
  };
};
const connector = connect(mapStateToProp, mapDispatchToProps);

const ExpenseTypeListing: FC<ConnectedProps<typeof connector>> = props => {
  const {
    expenseTypes,
    titleUpdateConfigData,
    isSaveResumeState,
    confirmationInfo,
    viewClicked,
    item,
    error,
    success,
    isLoading,
    backendError,
    compactExpenseTypeLoading,
    expenseTypeDetailLoading,
    info,
    getPermissions,
    initialExpenseCostCenterForLegalEntity,
    fetchExpenseTypeList,
    _updateViewState,
    _deleteExpenseTypeData,
    _fetchExpenseTypeDataWithConfiguration,
    _apiCallReset,
    _resetToInitial,
    _toggleIsActiveExpenseTypeConfig,
    _saveExpenseTypeListData,
    _updateConfirmationInfo,
    _resetConfirmationInfo,
    _setResumeStateToReducer,
    _setResumeState,
    _setTitleUpdateConfigData,
    _updateTitleAndCode,
  } = props;

  const { getSearchProps, getCheckBoxFilterProps } = useTableFilters();
  const history = useHistory();

  const handleConfirmationModelOkBtn = async () => {
    try {
      if (confirmationInfo.forWhat === 'DELETE_EXPENSE_TYPE') {
        _resetConfirmationInfo();
        await _deleteExpenseTypeData(confirmationInfo.extraInfo); //API Delete Call
        delay(() => {
          fetchExpenseTypeList(); //API Get Call
        }, 500);
      }
    } catch (error) {
      console.error('DEV ERROR', error);
    }
  };

  const handleExpandClick = async (
    _id: string,
    _e: React.MouseEvent<HTMLElement, MouseEvent>,
  ) => {
    (window as any).reimAPICancelToken();
    _updateViewState(!viewClicked, _id);
    await _fetchExpenseTypeDataWithConfiguration(_id);
  };

  const _data = expenseTypes.map((o: any, i: number) => {
    return {
      key: i,
      is_active: o.is_active || false,
      title: o.title,
      code: o.code,
      category: o.category.title,
      attached_to_request: o.attached_to_request?.map(
        (item: any) => item.title,
      ),
      item: o,
    };
  });

  const getElemOrSkeleton = (
    _text: any | ReactNode,
    _record?: any,
    _index?: number,
  ) => {
    return compactExpenseTypeLoading ? (
      <Skeleton.Input size='small' active={compactExpenseTypeLoading} />
    ) : (
      _text
    );
  };

  const columns = [
    {
      title: () => getElemOrSkeleton(''),
      dataIndex: 'is_active',
      width: 80,
      align: 'center' as 'center',
      render: (_val: boolean, _record?: any, _index?: number) =>
        getElemOrSkeleton(
          <Switch
            defaultChecked={_val}
            checked={_val}
            onChange={async (_checked: boolean) => {
              const _id: number = _record.item.id;
              const isActiveData = {
                is_active: _checked,
              };
              const res: any = await _toggleIsActiveExpenseTypeConfig(
                _id,
                isActiveData,
              );
              if (res)
                if (res === 'Configuration Saved!')
                  _saveExpenseTypeListData(
                    expenseTypes.map(o =>
                      o.id === _id ? { ...o, ...isActiveData } : o,
                    ),
                  );
            }}
          />,
          _record,
          _index,
        ),
      key: 'IS_ACTIVE',
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
      title: () => getElemOrSkeleton(<Trans>Title</Trans>),
      dataIndex: 'title',
      key: 'TITLE',
      ...getSearchProps(
        'title',
        (_val: boolean, _record?: any, _index?: number) =>
          getElemOrSkeleton(
            <NavLink
              className='custom-nav-link'
              to={`${appPath.config_setup.expenseType.legalEntityListing.linkTo}${_record.item.id}`}
            >
              {_val}
            </NavLink>,
          ),
      ),
    },
    {
      title: () => getElemOrSkeleton(<Trans>Code</Trans>),
      dataIndex: 'code',
      render: getElemOrSkeleton,
      key: 'CODE',
    },
    {
      title: () => getElemOrSkeleton(<Trans>Request Types</Trans>),
      dataIndex: 'attached_to_request',
      render: (_text: string, _record: any, _item: any, _index: number) => {
        return (
          <>
            {_record.attached_to_request &&
            _record.attached_to_request.length > 0 ? (
              <ul>
                {_record.attached_to_request.map((title: any) => (
                  <li>{title}</li>
                ))}
              </ul>
            ) : (
              <> - </>
            )}
          </>
        );
      },
      key: 'attached_to_request',
    },
    {
      title: () => getElemOrSkeleton(<Trans>Category</Trans>),
      dataIndex: 'category',
      render: getElemOrSkeleton,
      key: 'CATEGORY',
      ...getCheckBoxFilterProps(
        [
          {
            text: <Trans>General</Trans>,
            value: 'General',
          },
          {
            text: <Trans>Entertainment</Trans>,
            value: 'Entertainment',
          },
          {
            text: <Trans>Mileage</Trans>,
            value: 'Mileage',
          },
          {
            text: <Trans>Petty Cash</Trans>,
            value: 'Petty Cash',
          },
          {
            text: <Trans>Allowance</Trans>,
            value: 'Allowance',
          },
        ],
        'category',
      ),
    },
    {
      title: () => getElemOrSkeleton(<Trans>Action</Trans>),
      width: 90,
      align: 'center' as 'center',
      render: (_text: string, _record: any, _index: number) => {
        const menuItems: any = [
          {
            OnClick: () => {
              history.push(
                `${appPath.config_setup.expenseType.update.linkTo}${_record.item.id}`,
              );
            },
            Disabled: false,
            Type: 'default',
            children: (
              <>
                <Trans>Update</Trans>
              </>
            ),
            icon: EditOutlined,
            key: 'UPDATE_EXPENSE',
          },
          {
            OnClick: () => {
              _setTitleUpdateConfigData({
                id: _record.item.id,
                title: _record.title,
                code: _record.code,
              });
            },
            Disabled: false,
            Type: 'default',
            children: <Trans>Update Title</Trans>,
            icon: EditOutlined,
            key: 'UPDATE_TITLE_AND_CODE',
          },
          {
            OnClick: handleExpandClick.bind(null, _record.item.id),
            Disabled: false,
            Type: 'default',
            children: <Trans>View Configuration</Trans>,
            icon: ToolOutlined,
            key: 'VIEW_CONFIGURATION',
          },
          {
            OnClick: () => {
              history.push(appPath.config_setup.expenseType.add.linkTo, {
                mode: 'clone',
                expense_type_id: _record.item.id,
              });
            },
            Disabled: false,
            Type: 'default',
            children: (
              <>
                <Trans>Clone</Trans>
              </>
            ),
            icon: CopyOutlined,
            key: 'CLONE_EXPENSE_TYPE',
          },
          {
            OnClick: () => {
              _updateConfirmationInfo({
                forWhat: 'DELETE_EXPENSE_TYPE',
                extraInfo: _record.item.id,
                okText: 'Delete',
                cancelText: <Trans>Cancel</Trans>,
                visibility: true,
                headerText: 'You want to delete this expense type?',
                bodyText: '',
              });
            },
            Disabled: false,
            Type: 'default',
            children: <Trans>Delete</Trans>,
            icon: DeleteOutlined,
            key: 'DELETE_EXPENSE_TYPE',
          },
        ];
        const getMenuItems = () => {
          const toBeRemovedIndexes: any = [];
          for (let index = 0; index < menuItems.length; index++) {
            const item = menuItems[index];
            if (
              [
                'UPDATE_EXPENSE',
                'CLONE_EXPENSE_TYPE',
                'DELETE_EXPENSE_TYPE',
              ].includes(item.key) &&
              !getPermissions.ACTION_SETUP_EXPENSE_TYPES
            ) {
              toBeRemovedIndexes.push(index);
            }
          }
          const newMenuItems = menuItems.filter(
            (_item: any, index: number) => !toBeRemovedIndexes.includes(index),
          );
          return newMenuItems;
        };
        return compactExpenseTypeLoading ? (
          <Skeleton.Input size='small' active={compactExpenseTypeLoading} />
        ) : (
          <DotMenu menuVisibility={true} actionBtn={getMenuItems()}>
            <EllipsisOutlined />
          </DotMenu>
        );
      },
      key: 'ACTION',
    },
  ];

  const getColumns = () => {
    const toBeRemovedIndexes: any = [];
    for (let index = 0; index < columns.length; index++) {
      const item = columns[index];
      if (
        item.key === 'IS_ACTIVE' &&
        !getPermissions.ACTION_SETUP_EXPENSE_TYPES
      ) {
        toBeRemovedIndexes.push(index);
      }
    }
    const newColumns = columns.filter(
      (_item, index) => !toBeRemovedIndexes.includes(index),
    );
    return newColumns;
  };

  // debounce ComponendDidUpdate
  useEffect(
    debounce(() => {
      if (isSaveResumeState && !compactExpenseTypeLoading && !isLoading) {
        _setResumeStateToReducer();
      }
    }, 500),
  );

  useEffect(() => {
    /* ComponentDidMount */
    _apiCallReset();
    fetchExpenseTypeList(); //API Get Call
    return () => {
      /* ComponentWillUnmount */
      message.destroy();
      _setResumeState();
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

  return (
    <HeaderBarWrapper
      headerCommonProps={{ title: <Trans>Expense Types</Trans> }}
      data-test='headerBarWrapper'
    >
      <div
        className='expense-type-listing-container'
        data-test='expenseTypeListingContainer'
      >
        <FilterBar
          isLoading={compactExpenseTypeLoading}
          isAddButton={getPermissions.ACTION_SETUP_EXPENSE_TYPES}
          addButtonOnClickFn={() => {
            history.push(appPath.config_setup.expenseType.add.linkTo);
          }}
          isAddButtonDisabled={false}
          enableBackBtn={true}
          backBtnUrl={appPath.config_setup.expenseType.backLink}
          data-test='filterBar'
        />
        <Table
          data-test='expenseTypeListingTable'
          columns={getColumns() as any}
          dataSource={_data}
          bordered
          scroll={{
            x: true,
          }}
          rowKey={record => record.item.id}
          pagination={false}
        />

        {/* --------------------------- CONFIGRATION DETAIL DRAWER ---- START ---------------------------*/}
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
          closable={!expenseTypeDetailLoading}
          onClose={() => {
            _updateViewState(false, []);
          }}
          showCancelButton={false}
          showOkButton={false}
          getContainer='.expense-type-listing-container'
          className='types-configuration-detail-drawer'
        >
          <ConfigurationDetailView
            ConfigurationComponent={
              <ConfigDetails
                configData={{ initialExpenseCostCenterForLegalEntity, ...item }}
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
        {/* --------------------------- CONFIGRATION DETAIL DRAWER ---- END ---------------------------*/}

        {/* --------------------------- CONFIGRATION TITLE UPDATER DRAWER ---- START ---------------------------*/}
        <TitleUpdaterDrawer
          _setTitleUpdateConfigData={_setTitleUpdateConfigData}
          backendError={backendError}
          titleUpdateConfigData={titleUpdateConfigData}
          _updateTitleAndCode={_updateTitleAndCode}
        />
        {/* --------------------------- CONFIGRATION TITLE UPDATER DRAWER ---- END ---------------------------*/}

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

export default connector(memo(ExpenseTypeListing));
