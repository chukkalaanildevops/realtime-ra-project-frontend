/* eslint-disable no-unused-vars */
import { EditOutlined } from '@ant-design/icons';
import { Table, Switch, Form } from 'antd';
import React, { Dispatch, useEffect, useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import {
  AppDrawer,
  DotMenu,
  ElementOrSkeleton,
  FilterBar,
  HeaderBarWrapper,
} from '../../../../../shared/components';
import { useTableFilters } from '../../../../../shared/hooks';
import {
  fetchWageTypes,
  fetchEntities,
  toggleBenefitType,
  createBenefitCategory,
  updateBenefitCategory,
  fetchBenefitCategoriesList,
} from './benefitCategories.thunk';
import { saveBackendError } from './store/benefitCategories.actions';
import BenefitCategoryForm from './benefitCategoryForm/benefitCategoryForm.index';
import { Trans } from '@lingui/macro';

const BenefitCategories: React.FC<ConnectedProps<typeof connector>> = props => {
  const {
    wageTypes,
    entityList,
    isLoading,
    backendError,
    totalCategory,
    isFormLoading,
    benefitCategories,
    _fetchBenefitCategoriesList,
    _toggleBenefitCategory,
    _updateBenefitCategory,
    _createBenefitCategory,
    _saveBackendError,
    _fetchEntities,
    _fetchWageTypes,
  } = props;

  const { getCheckBoxFilterProps } = useTableFilters();
  const [drawerVisibility, setDrawerVisibility] = useState<any>(false);
  const [editItem, setEditItem] = useState<any>(undefined);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number | undefined>(10);
  const [form] = Form.useForm();

  useEffect(() => {
    _fetchEntities();
    _fetchWageTypes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    _fetchBenefitCategoriesList(pageNumber, pageSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNumber, pageSize]);

  const columns = [
    {
      key: 'IS_ACTIVE',
      dataIndex: 'is_active',
      width: 100,
      align: 'center' as 'center',
      render: (value: boolean, record: any) => (
        <div>
          <Switch
            checked={value}
            onChange={newVal => _toggleBenefitCategory(record.id, newVal)}
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
      title: <Trans>Category Title</Trans>,
    },
    {
      key: 'CODE',
      dataIndex: 'code',
      title: <Trans>Category Code</Trans>,
    },
    {
      key: 'COMPANY',
      dataIndex: 'legal_entity_uuid',
      title: <Trans>Company</Trans>,
      render: (value: boolean, record: any) => (
        <>{record.legal_entity_uuid?.title}</>
      ),
    },
    {
      key: 'PAYCOMPONENT',
      dataIndex: 'wage_type',
      title: <Trans>Pay Component</Trans>,
      render: (value: boolean, record: any) => <>{record?.wage_type?.title}</>,
    },
    {
      dataIndex: 'Action',
      title: <Trans>Action</Trans>,
      align: 'center' as 'center',
      render: (_: any, item: any) => (
        <DotMenu
          actionBtn={((): any[] => {
            const actions: any[] = [
              {
                icon: EditOutlined,
                OnClick: () => onEditItem(item),
                children: (
                  <>
                    <Trans>Edit</Trans>
                  </>
                ),
                Type: 'link',
              },
            ];
            return actions;
          })()}
        ></DotMenu>
      ),
    },
  ];

  const onCloseDrawer = () => {
    setDrawerVisibility(false);
    setEditItem(undefined);
  };

  const onEditItem = (item: any) => {
    form.resetFields();
    setDrawerVisibility(true);
    setEditItem(item);
    form.setFieldsValue({
      ...item,
      legal_entity_uuid: item.legal_entity_uuid?.uuid,
      wage_type: item.wage_type?.id,
    });
  };
  const closeDrawer = () => {
    setDrawerVisibility(false);
    setEditItem(undefined);
  };
  const onSaveItem = async () => {
    try {
      await form.validateFields();
      let values = form.getFieldsValue();
      if (!values.is_active) {
        values.is_active = false;
      }
      editItem
        ? _updateBenefitCategory(
            closeDrawer,
            editItem.id,
            values,
            pageSize,
            pageNumber,
          )
        : _createBenefitCategory(closeDrawer, values);
    } catch {}
  };
  const onFieldChange = () => {
    _saveBackendError({});
  };
  const onAddClick = () => {
    form.resetFields();
    setDrawerVisibility(true);
  };
  return (
    <>
      <HeaderBarWrapper
        headerCommonProps={{ title: <Trans>Benefit Categories</Trans> }}
      >
        <div className='benefit-Categories-container'>
          <FilterBar
            enableBackBtn={true}
            isAddButton={true}
            addButtonOnClickFn={onAddClick}
          />
          <ElementOrSkeleton type='table' isLoading={isLoading} isActive={true}>
            <Table
              columns={columns}
              dataSource={benefitCategories}
              pagination={{
                hideOnSinglePage: false,
                position: ['bottomRight'],
                defaultCurrent: 1,
                current: pageNumber,
                onChange: (page: number, size?: number) => {
                  setPageSize(size);
                  setPageNumber(page);
                },
                pageSize: pageSize || 10,
                onShowSizeChange: (page: number, size?: number) => {
                  setPageSize(size);
                  setPageNumber(page);
                },
                total: totalCategory,
                showTotal: (total: number, range: number[]) => {
                  return <>{`${range[0]}-${range[1]} of ${total}`}</>;
                },
              }}
              rowKey='id'
            ></Table>
          </ElementOrSkeleton>
          <AppDrawer
            visible={drawerVisibility}
            title={
              editItem ? (
                <Trans>Update Category</Trans>
              ) : (
                <Trans>Add new Category</Trans>
              )
            }
            onClose={onCloseDrawer}
            showCancelButton={false}
            OkText={<Trans>Save</Trans>}
            width='50%'
            closable={true}
            className='app-drawer-legal-entity-listing'
            onOkClick={onSaveItem}
            isLoading={isFormLoading}
          >
            <BenefitCategoryForm
              form={form}
              wageTypes={wageTypes}
              entityList={entityList}
              backendError={backendError}
              onFieldChange={onFieldChange}
              isUpdate={editItem ? true : false}
            />
          </AppDrawer>
        </div>
      </HeaderBarWrapper>
    </>
  );
};

const mapStateToProps = (state: any) => {
  const {
    isLoading,
    wageTypes,
    entityList,
    backendError,
    totalCategory,
    isFormLoading,
    benefitCategories,
  } = state.BenefitCategoriesReducer;
  return {
    isLoading,
    wageTypes,
    entityList,
    backendError,
    totalCategory,
    isFormLoading,
    benefitCategories,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  return {
    _fetchBenefitCategoriesList: (page?: number, pageSize?: number) =>
      dispatch(fetchBenefitCategoriesList(page, pageSize)),
    _toggleBenefitCategory: (id: any, isActive: boolean) =>
      dispatch(toggleBenefitType(id, isActive)),
    _fetchEntities: () => dispatch(fetchEntities()),
    _fetchWageTypes: () => dispatch(fetchWageTypes()),
    _createBenefitCategory: (callback: any, body: any) =>
      dispatch(createBenefitCategory(callback, body)),
    _saveBackendError: (data: any) => dispatch(saveBackendError(data)),

    _updateBenefitCategory: (
      callback: any,
      id: any,
      body: any,
      pageSize: any,
      pageNumber: any,
    ) =>
      dispatch(updateBenefitCategory(callback, id, body, pageSize, pageNumber)),
  };
};

const connector = connect(mapStateToProps, mapDispatchToProps);
export default connector(BenefitCategories);
