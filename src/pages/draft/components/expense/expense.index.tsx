/* eslint-disable react-hooks/exhaustive-deps */
import React, { Dispatch, useState, memo, useEffect } from 'react';
import {
  FilterBar,
  DotMenu,
  AppDrawer,
  NoData,
  StatusTag,
  Remarks,
  Amount,
  DataFilter,
  ReceiptViewer,
  ElementOrSkeleton,
  ErrorBoundary,
  ViolationDetails,
} from '../../../../shared/components';
import {
  getDraftExpenses,
  getDraftsLoader,
  getDraftExpensesWithRequest,
  getDraftDefaultView,
} from '../../../../shared/redux/rootReducer';
import { connect, ConnectedProps } from 'react-redux';
import {
  // Tag,
  Table,
  Pagination,
  Skeleton,
  Button,
  Row,
  Col,
  Checkbox,
} from 'antd';
import {
  sendExpenseForApproval,
  fetchDraftsTabData,
  deleteExpenseById,
  deleteExpenses,
} from '../../drafts.thunk';
import { Trans } from '@lingui/macro';

import {
  EllipsisOutlined,
  EditOutlined,
  DeleteOutlined,
  CopyOutlined,
  ExportOutlined,
} from '@ant-design/icons';
import { viewType } from '../../../../shared/components/filterBar/filterBar.model';
import { useHistory } from 'react-router-dom';
import { appPath } from '../../../app/app.routes';
import { fetchWorkFlowData } from '../../../app/app.thunk';
import { DraftCard } from '..';
import { getFormattedDate } from '../../../../utils/scroll.utils';
import ClaimDetails from '../../../addNewExpense/claimDetails/claimDetails.index';
import {
  setConfirmationInfo,
  resetConfirmationInfo,
} from '../../../app/app.actions';
import {
  IConfirmationInfo,
  IfetchWorkFlowDataProps,
} from '../../../app/app.model';
import { IWorkflowStatus } from '../../../../shared/model';
import { ColumnsType } from 'antd/lib/table';
import RequestDetails from '../../../request/detail/requestDetail.index';
import WarningIconWithTooltip from '../../../approvals/components/warningIconWithTooltip/warningIconWithTooltip.index';
import { renderViolationsBgClass } from '../../../../utils/global.utils';
import { getExpenseClaimViolationData } from '../../../../services/expenseClaim';

let localFilters: any;
let initialPageSize = 12;

const DraftExpense: React.FC<ConnectedProps<typeof connector> & {
  onSelectRow?: (list: any[]) => void;
  type: 'expense' | 'expenses_with_request';
  source: any;
}> = ({
  type,
  source,
  records,
  isLoading,
  defaultView,
  _fetchRecords,
  onSelectRow,
  _setConfirmationInfo,
  _resetConfirmationInfo,
  _deleteExpenseById,
  _sendExpenseForApproval,
  // _fetchWorkFlowData,
  _deleteExpenses,
  isEnableTrafficLightFeatureForTenantFeatures,
  tenantConfig,
}) => {
  const [isItemExpanded, setItemExpanded] = useState<{
    visibility: boolean;
    item: null | any;
  }>({
    visibility: false,
    item: null,
  });
  const [drawerTitle, setDrawerTitle] = useState<{
    claim_number: string;
    workflow_status: {
      code: string;
      title: string;
    };
    id: number;
    type: string;
  } | null>(null);

  const [dataView, setDataView] = useState<viewType>(defaultView);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [selectedSubmittableItems, setSelectedSubmittableItems] = useState<
    number[]
  >([]);

  const [isFilterVisible, setFilterVisible] = useState(false);
  // const [expenseId, setExpenseId] = useState<number | string>();
  const [isViolationModal, setIsViolationModal] = useState<{
    visibility: boolean;
    item: null | any;
  }>({
    visibility: false,
    item: null,
  });
  const [showFooter, setShowFooter] = useState<boolean>(false);
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
  const history = useHistory();

  useEffect(() => {
    // const locationState = location.state as any;
    // if (locationState && locationState?.page) {
    //   _fetchRecords(locationState.page);
    // }
    _fetchRecords(1, undefined, pageSize, source);
  }, []);

  const editItem = (
    id: string,
    _category:
      | 'General'
      | 'Entertainment'
      | 'Mileage'
      | 'Petty Cash'
      | 'Allowance',
    item: any,
  ) => {
    history.push(
      `${
        appPath.addNewExpense.update.linkTo
      }${id}/?is_resubmission_case=${item?.is_resubmission_case || false}`,
    );
  };

  const cloneItem = (
    id: string,
    category:
      | 'General'
      | 'Entertainment'
      | 'Mileage'
      | 'Petty Cash'
      | 'Allowance',
  ) => {
    const cat = category.split(' ')[0].toLowerCase();
    history.push(`${(appPath as any).addNewExpense.add[cat].linkTo}`, {
      mode: 'clone',
      claimId: id,
      category,
    });
  };

  const handleDeleteClick = (id: number, localFilters: any) => {
    _setConfirmationInfo({
      bodyText: 'Do you want to delete expense?',
      cancelText: 'Cancel',
      okText: 'Delete',
      visibility: true,
      extraInfo: '',
      forWhat: '',
      headerText: 'Confirmation',
      cancelBtnFn: _resetConfirmationInfo,
      okBtnFn: () => {
        _deleteExpenseById(id, localFilters, pageSize);
        _resetConfirmationInfo();
      },
    });
  };

  const showDeleteItemBox = (ids: number[]) => {
    _setConfirmationInfo({
      bodyText: 'Do you want to delete expenses?',
      cancelText: 'Cancel',
      okText: 'Delete',
      visibility: true,
      extraInfo: '',
      forWhat: '',
      headerText: 'Confirmation',
      cancelBtnFn: _resetConfirmationInfo,
      okBtnFn: () => {
        _resetConfirmationInfo();
        _deleteExpenses(
          ids,
          () => {
            setSelectedItems([]);
          },
          localFilters,
        );
      },
    });
  };

  const onRemarkAdded = () => {
    // _fetchRecords(1);
  };

  const selectAll = (isChecked: boolean) => {
    if (isChecked) {
      const isSubmittable =
        records?.data.filter((item: any) => item.is_submittable) || [];
      const filteredSubmittableData = isSubmittable.map(item => item.id) || [];
      const array = records?.data.map(item => item.id) || [];
      setSelectedItems(array);
      setSelectedSubmittableItems(filteredSubmittableData);
    } else {
      setSelectedItems([]);
      setSelectedSubmittableItems([]);
    }
  };

  const onSelectCard = (checked: boolean, id: number) => {
    if (checked) {
      setSelectedItems(prev => [...prev, id]);
      setSelectedSubmittableItems(prev => [...prev, id]);
    } else {
      const array = selectedItems.filter(item => id !== item);
      const filteredArray = selectedSubmittableItems.filter(
        item => id !== item,
      );
      setSelectedSubmittableItems(filteredArray);
      setSelectedItems(array);
    }
  };

  const getSelectAllContainer = (usingFor: 'TABLE' | 'CARD') => (
    <div
      className='select-all-container'
      style={usingFor === 'TABLE' ? { marginLeft: 12 } : {}}
    >
      <Row gutter={24}>
        {selectedItems.length > 0 && (
          <>
            <Col>
              <Button
                type='primary'
                size='small'
                onClick={async () => {
                  await _sendExpenseForApproval(
                    selectedSubmittableItems,
                    localFilters,
                  );
                  selectAll(false);
                }}
              >
                <Trans>Submit</Trans>
              </Button>
            </Col>
            <Col>
              <Button
                type='link'
                size='small'
                onClick={() => showDeleteItemBox(selectedItems)}
              >
                <Trans>Delete</Trans>
              </Button>
            </Col>
          </>
        )}
      </Row>
    </div>
  );

  const renderCards = () => (
    <>
      <div className='select-all-container'>
        <Row gutter={24}>
          <Col>
            <Checkbox
              checked={selectedItems.length === records?.data.length}
              indeterminate={
                selectedItems.length !== 0 &&
                selectedItems.length < (records?.data.length || 0)
              }
              onChange={e => selectAll(e.target.checked)}
              style={{ color: '#A1B2C2' }}
            >
              <Trans>Select All</Trans>
            </Checkbox>
            <span className='selected-item-count'>
              {selectedItems.length > 0 ? `. ${selectedItems.length}` : null}
            </span>
          </Col>
          {selectedItems.length > 0 && getSelectAllContainer}
        </Row>
      </div>
      <div className='card-parent-container'>
        {getSelectAllContainer('CARD')}
        <Row gutter={[24, 24]}>
          {records?.data.map(item => {
            let actions: any = [
              {
                children: <Trans>Delete</Trans>,
                Type: 'default',
                icon: DeleteOutlined,
                OnClick: handleDeleteClick.bind(null, item.id, localFilters),
              },
              {
                children: <Trans>Send For Approval</Trans>,
                Type: 'link',
                icon: ExportOutlined,
                Disabled:
                  typeof item.is_submittable === 'boolean' &&
                  !item.is_submittable,
                OnClick: async () => {
                  if (
                    tenantConfig[0]?.is_enabled_traffic_lights &&
                    isEnableTrafficLightFeatureForTenantFeatures
                  ) {
                    const responseViolations = await getExpenseClaimViolationData(
                      item.id,
                    );
                    const data = await responseViolations?.data;
                    if (
                      Object.keys(data).length === 0 ||
                      data?.flag_color === 'GRN' ||
                      !data?.violated_policy_details?.data?.some(
                        (item: any) => item?.is_show_flag_to_employee,
                      )
                    ) {
                      setIsViolationModal({ visibility: false, item: null });
                      await _sendExpenseForApproval([item.id], localFilters);
                    } else {
                      setIsViolationModal({
                        visibility: true,
                        item,
                      });
                      setShowFooter(true);
                    }
                  } else {
                    await _sendExpenseForApproval([item.id], localFilters);
                  }
                  selectAll(false);
                },
              },
            ];
            actions =
              item.expense_type_legal_entity.expense_type.category.code ===
              'MIL'
                ? actions
                : [
                    {
                      OnClick: cloneItem.bind(
                        null,
                        item.id,
                        item.expense_type_legal_entity.expense_type.category
                          .title,
                      ),
                      children: <Trans>Clone</Trans>,
                      Type: 'default',
                      icon: CopyOutlined,
                    },
                    ...actions,
                  ];
            return (
              <Col
                className='card'
                xs={24}
                sm={12}
                md={12}
                lg={8}
                xl={8}
                xxl={6}
                key={item.id}
              >
                <DraftCard
                  actions={actions}
                  category={
                    item.expense_type_legal_entity?.expense_type.category.title
                  }
                  onChecked={checked => onSelectCard(checked, item.id)}
                  title={getFormattedDate(item.date)}
                  checked={selectedItems.includes(item.id)}
                  checkboxProps={{
                    disabled: !item.is_submittable,
                  }}
                  code={item.claim_number}
                  requestNumber={item?.request?.request_no}
                  type={item.expense_type_legal_entity.expense_type.title}
                  status={{ code: 'DRAFTD', title: 'Draft' }}
                  // handleStatusTagClick={handleStatusTagClick}
                  id={item.id}
                  currency={{
                    amount: item.converted_amount || '',
                    currency:
                      item?.converted_amount_currency?.currency?.code || '',
                  }}
                  onDetails={(type: string) => openDetailsDrawer(item, type)}
                  actionText='EDIT'
                  isActionDisabled={
                    typeof item.is_editable === 'boolean' && !item.is_editable
                  }
                  onMainAction={editItem.bind(
                    null,
                    item.id,
                    item.expense_type_legal_entity.expense_type.category.title,
                    item,
                  )}
                  receipts={
                    <ReceiptViewer
                      itemId={item.id}
                      itemType='expense-claims'
                      itemNumber={item.claim_number}
                      count={item.total_attachments}
                    />
                  }
                  remarks={item.total_comments || 0}
                  cardType='expense-claims'
                  expenseType={type}
                  onRemarkAdded={onRemarkAdded}
                  backgroundClass={renderViolationsBgClass(item)}
                  getViolationTitleWithIcons={
                    tenantConfig[0]?.is_enabled_traffic_lights &&
                    isEnableTrafficLightFeatureForTenantFeatures &&
                    getViolationTitleWithIcons(item)
                  }
                />
              </Col>
            );
          })}
        </Row>
      </div>
    </>
  );

  const openDetailsDrawer = (item: any, type: string) => {
    setItemExpanded({
      visibility: true,
      item: item,
    });

    let claim_number = '';
    let workflow_status = { code: '', title: '' };
    let id = 0;

    if (type === 'expense') {
      claim_number = item.claim_number;
      workflow_status = item.workflow_status;
      id = item.id;
    } else {
      claim_number = item.request.request_no;
      workflow_status = item.request.workflow_status;
      id = item.request.id;
    }

    setDrawerTitle({
      claim_number: claim_number,
      workflow_status: workflow_status,
      id: id,
      type: type,
    });
  };

  const closeDetailsDrawer = () => {
    setItemExpanded({
      visibility: false,
      item: null,
    });
    setDrawerTitle(null);
  };
  const getViolationTitleWithIcons = (record: any) => {
    return (
      <small className='violationIcon-container'>
        {['ORA', 'RED'].includes(record?.flag_color_v2) && (
          <Trans>Policy Violations -</Trans>
        )}
        {record?.flag_color_v2 === 'ORA' && (
          <WarningIconWithTooltip
            filled={false}
            color='ORANGE'
            id={record.id}
            onIconClick={() => {
              setShowFooter(false);
              setIsViolationModal({
                visibility: true,
                item: record,
              });
            }}
          />
        )}
        {record?.flag_color_v2 === 'RED' && (
          <WarningIconWithTooltip
            filled={false}
            color='RED'
            id={record.id}
            onIconClick={() => {
              setShowFooter(false);
              setIsViolationModal({ visibility: true, item: record });
            }}
          />
        )}
      </small>
    );
  };
  const onClose = () => {
    setShowFooter(false);
    setIsViolationModal({ visibility: false, item: null });
  };

  const columns: ColumnsType<any> = [
    {
      dataIndex: 'claim_number',
      title: () => getElemOrSkeleton(<Trans>Expense Id</Trans>),
      fixed: 'left' as 'left',
      ellipsis: true,
      width: 170,
      render: (val: string, row: any) => (
        <Button
          type='link'
          onClick={() => openDetailsDrawer(row, 'expense')}
          className='no-pad _lr'
        >
          {getElemOrSkeleton(val)}
        </Button>
      ),
    },
    {
      dataIndex: 'date',
      title: () => getElemOrSkeleton(<Trans>Receipt Date</Trans>),
      render: getElemOrSkeleton,
    },
    {
      dataIndex: 'expense_type_legal_entity',
      title: () => getElemOrSkeleton(<Trans>Expense Type</Trans>),
      width:
        tenantConfig[0]?.is_enabled_traffic_lights &&
        isEnableTrafficLightFeatureForTenantFeatures
          ? 170
          : 120,
      render: (value: any, record: any) =>
        isLoading ? (
          getElemOrSkeleton('')
        ) : (
          <>
            {isLoading ? (
              getElemOrSkeleton('')
            ) : (
              <>
                {value.expense_type.title}
                {tenantConfig[0]?.is_enabled_traffic_lights &&
                  isEnableTrafficLightFeatureForTenantFeatures &&
                  getViolationTitleWithIcons(record)}
              </>
            )}
          </>
        ),
    },
    {
      dataIndex: 'expense_type_legal_entity',
      title: () => getElemOrSkeleton(<Trans>Category</Trans>),
      render: (val: any) => getElemOrSkeleton(val?.expense_type.category.title),
    },
    {
      dataIndex: 'converted_amount_currency',
      title: () => getElemOrSkeleton(<Trans>Amount</Trans>),
      // colSpan: 2,
      width: 150,
      render: (val: any, item: any) =>
        isLoading ? (
          getElemOrSkeleton('')
        ) : (
          <Amount
            amount={item.converted_amount}
            currency={val?.currency?.code}
            align='right'
          />
        ),
      align: 'center' as 'center',
    },
    {
      dataIndex: 'receipt',
      title: () => getElemOrSkeleton(<Trans>Receipt/s</Trans>),
      align: 'center' as 'center',
      render: (_val: any, item: any) =>
        isLoading ? (
          getElemOrSkeleton('')
        ) : (
          <>
            <ReceiptViewer
              itemId={item.id}
              itemType='expense-claims'
              itemNumber={item.claim_number}
              count={item.total_attachments}
            />
          </>
        ),
    },
    {
      dataIndex: 'total_comments',
      title: () => getElemOrSkeleton(<Trans>Remarks</Trans>),
      align: 'center' as 'center',
      render: (val: any, item: any) =>
        isLoading ? (
          getElemOrSkeleton('')
        ) : (
          <Remarks
            remarkCount={val}
            itemId={item.id}
            itemType='expense-claims'
            onRemarkAdded={onRemarkAdded}
            item_no={item.claim_number}
          />
        ),
    },
    {
      dataIndex: 'status',
      align: 'center' as 'center',
      width: 150,
      title: () => getElemOrSkeleton(<Trans>Status</Trans>),
      render: (_val: string, _item: any) =>
        isLoading ? (
          getElemOrSkeleton('')
        ) : (
          <StatusTag
            status={{ code: 'DRAFTD', title: 'Draft' } as IWorkflowStatus}
          />
        ),
    },
    {
      dataIndex: '',
      align: 'center' as 'center',
      width: 100,
      fixed: 'right' as 'right',
      title: () => getElemOrSkeleton(<Trans>Action</Trans>),
      render: (_val: string, item: any) => {
        if (isLoading) return getElemOrSkeleton('');

        let action: any[] = [
          {
            Type: 'default',
            icon: EditOutlined,
            children: <Trans>Edit</Trans>,
            Disabled:
              typeof item.is_editable === 'boolean' && !item.is_editable,
            OnClick: editItem.bind(
              null,
              item.id,
              item.expense_type_legal_entity.expense_type.category.title,
              item,
            ),
          },
          {
            children: <Trans>Delete</Trans>,
            Type: 'default',
            icon: DeleteOutlined,
            OnClick: handleDeleteClick.bind(null, item.id, localFilters),
          },
          {
            children: <Trans>Send For Approval</Trans>,
            Type: 'link',
            icon: ExportOutlined,
            Disabled:
              typeof item.is_submittable === 'boolean' && !item.is_submittable,
            OnClick: async () => {
              if (
                tenantConfig[0]?.is_enabled_traffic_lights &&
                isEnableTrafficLightFeatureForTenantFeatures
              ) {
                const responseViolations = await getExpenseClaimViolationData(
                  item.id,
                );
                const data = await responseViolations?.data;
                if (
                  Object.keys(data).length === 0 ||
                  data?.flag_color === 'GRN' ||
                  !data?.violated_policy_details?.data?.some(
                    (item: any) => item?.is_show_flag_to_employee,
                  )
                ) {
                  setIsViolationModal({ visibility: false, item: null });
                  await _sendExpenseForApproval([item.id], localFilters);
                } else {
                  setIsViolationModal({
                    visibility: true,
                    item,
                  });
                  setShowFooter(true);
                }
              } else {
                await _sendExpenseForApproval([item.id], localFilters);
              }
              selectAll(false);
            },
          },
        ];

        if (
          item.expense_type_legal_entity.expense_type.category.code !== 'MIL' &&
          item.expense_type_legal_entity.expense_type.category.code !== 'ALW' &&
          type !== 'expenses_with_request'
        ) {
          action.splice(1, 0, {
            OnClick: cloneItem.bind(
              null,
              item.id,
              item.expense_type_legal_entity.expense_type.category.title,
            ),
            children: <Trans>Clone</Trans>,
            Type: 'default',
            icon: CopyOutlined,
          });
        }

        return (
          <DotMenu actionBtn={action}>
            <EllipsisOutlined />
          </DotMenu>
        );
      },
    },
  ];

  if (type === 'expenses_with_request') {
    columns.unshift({
      dataIndex: 'request',
      fixed: 'left' as 'left',
      width: 170,
      title: () => getElemOrSkeleton(<Trans>Request No</Trans>),
      render: (val: any, row: any) => (
        <Button
          type='link'
          onClick={() => openDetailsDrawer(row, 'request')}
          className='no-pad _lr'
        >
          {getElemOrSkeleton(val.request_no)}
        </Button>
      ),
    });
  }

  const onApplyFilters = (filters: any) => {
    localFilters = filters;
    _fetchRecords(1, filters, pageSize);
  };

  const onResetFilters = () => {
    localFilters = undefined;
    _fetchRecords(1, undefined, pageSize);
  };

  const onChangePagination = (page: number, pageSize: number) => {
    _fetchRecords(page, localFilters, pageSize);
    onSelectChange([]);
  };

  const onSelectChange = (selectedRowKeys: any[]) => {
    setSelectedSubmittableItems(selectedRowKeys as never);
    setSelectedItems(selectedRowKeys as never);
    onSelectRow && onSelectRow(selectedRowKeys);
  };

  const renderData = () => {
    return (
      <ElementOrSkeleton
        isLoading={isLoading}
        type={dataView === 'Card' ? 'cards' : 'table'}
        tableConfiguration={{ columns: 8, rows: 10 }}
        cardsConfiguration={{ numberOfCardsPerRow: 4, rows: 3 }}
      >
        {records && records.data.length > 0 ? (
          <>
            {dataView === 'Table' ? (
              <>
                <div
                  className='select-all-container'
                  style={{ marginLeft: 12 }}
                >
                  <Row gutter={24}>
                    <Col>
                      <Checkbox
                        checked={selectedItems.length === records?.data.length}
                        indeterminate={
                          selectedItems.length !== 0 &&
                          selectedItems.length < (records?.data.length || 0)
                        }
                        onChange={e => selectAll(e.target.checked)}
                        style={{ color: '#A1B2C2' }}
                      >
                        Select All
                      </Checkbox>
                      <span className='selected-item-count'>
                        {selectedItems.length > 0
                          ? `. ${selectedItems.length}`
                          : null}
                      </span>
                    </Col>
                    {selectedItems.length > 0 && getSelectAllContainer}
                    {getSelectAllContainer('TABLE')}
                  </Row>
                </div>

                <Table
                  bordered
                  pagination={false}
                  columns={columns}
                  dataSource={records?.data}
                  rowKey={item => item.id}
                  scroll={{ x: 1200 }}
                  rowSelection={{
                    type: 'checkbox',
                    selectedRowKeys: selectedItems,
                    onChange: onSelectChange,
                    // hideSelectAll: true,
                    getCheckboxProps: item => ({
                      disabled: !item.is_submittable,
                    }),
                  }}
                  className='expense-claims-table'
                  size='middle'
                  rowClassName={(record, rowIndex) =>
                    renderViolationsBgClass(record)
                  }
                />
              </>
            ) : (
              renderCards()
            )}
            <div
              style={{
                display: 'flex',
                flexDirection: 'row-reverse',
                marginTop: 12,
              }}
            >
              <Pagination
                defaultCurrent={1}
                current={records.current_page}
                onChange={(pageNumber: number, pageSize: any) => {
                  onChangePagination(pageNumber, pageSize);
                }}
                hideOnSinglePage={false}
                pageSizeOptions={['10', '12', '20', '50', '100']}
                pageSize={pageSize || 12}
                showSizeChanger={true}
                onShowSizeChange={(_current: number, size: number) => {
                  setPageSize(size);
                }}
                total={records.pagination_data.total_records}
                showTotal={(total: number, range: number[]) => {
                  return <>{`${range[0]}-${range[1]} of ${total}`}</>;
                }}
                showQuickJumper={{
                  goButton: (
                    <Button type='default'>
                      <Trans>Go</Trans>
                    </Button>
                  ),
                }}
              />
            </div>
          </>
        ) : (
          <NoData />
        )}
      </ElementOrSkeleton>
    );
  };

  // const handleOnClickAuditLogs = () => {
  //   let url = appPath.expenses.linkTo;
  //   url = url.replace(':id', String(expenseId));
  //   url = url.replace(':type', 'expenses');
  //   url = url + `?expenseNo=${drawerTitle?.claim_number}`;
  //   window.open(url);
  // };

  return (
    <div className='draft-expense-container'>
      <FilterBar
        isAddButton={false}
        filterView={setFilterVisible}
        viewConfig={{
          currentView: dataView,
          enableToggleView: true,
          onChangeView: (view: viewType) => setDataView(view),
        }}
      />
      <div style={{ marginBottom: 20 }}>
        <DataFilter
          page='DRAFT'
          source={source}
          includeLegalEntities
          includeStatusBar={false}
          isVisible={isFilterVisible}
          includeDraftStatus={false}
          includeSaveFilterOption={true}
          item={
            type === 'expenses_with_request'
              ? 'expenses_with_request'
              : 'expense'
          }
          onApplyFilters={onApplyFilters}
          onResetFilters={onResetFilters}
          includeItemNumber={true}
          includeForRequestNumber={type === 'expenses_with_request'}
        />
      </div>
      {renderData()}
      <AppDrawer
        width={'70%'}
        visible={isItemExpanded.visibility}
        destroyOnClose={true}
        closable={true}
        onClose={closeDetailsDrawer}
        title={
          <>
            {drawerTitle?.type === 'expense'
              ? `Expense Claim No. #${drawerTitle?.claim_number} `
              : `Request No. #${drawerTitle?.claim_number} `}
            {/* Expense Claim No. #{drawerTitle?.claim_number}{' '} */}
            <StatusTag
              status={drawerTitle?.workflow_status as IWorkflowStatus}
            />
            {/* <Button onClick={handleOnClickAuditLogs}>Audit Logs</Button> */}
          </>
        }
        showCancelButton={false}
        showOkButton={false}
        getContainer='.draft-expense-container'
        className='expens-detail-drawer no-header-border'
      >
        <ErrorBoundary>
          {drawerTitle?.type === 'expense' ? (
            <ClaimDetails
              claimId={isItemExpanded?.item?.id}
              isEmployee={true}
            />
          ) : (
            <RequestDetails
              requestId={isItemExpanded?.item?.request?.id}
              isEmployee={true}
            />
          )}
        </ErrorBoundary>
      </AppDrawer>
      {isViolationModal?.visibility && (
        <ViolationDetails
          visibility={isViolationModal?.visibility}
          item={isViolationModal?.item}
          isEmployee={true}
          showFooter={showFooter}
          onClose={onClose}
          onSubmit={() => {
            _sendExpenseForApproval([isViolationModal?.item?.id], localFilters);
            setIsViolationModal({ visibility: false, item: null });
          }}
        />
      )}
    </div>
  );
};

const mapStateToProps = (state: any, ownProps: any) => ({
  records:
    ownProps.type === 'expense'
      ? getDraftExpenses(state)
      : getDraftExpensesWithRequest(state),
  isLoading: getDraftsLoader(state),
  defaultView: getDraftDefaultView(state),
  tenantConfig: state.configuration.tenantConfig,
  isEnableTrafficLightFeatureForTenantFeatures:
    state.configuration.isEnableTrafficLightFeatureForTenantFeatures,
});

const mapDispatchToProps = (dispatch: Dispatch<any>, ownProps: any) => ({
  _fetchRecords: (
    page: number,
    filters?: any,
    pageSize?: number,
    source?: any,
  ) =>
    dispatch(
      fetchDraftsTabData(ownProps.type, page, filters, pageSize, source),
    ),
  _setConfirmationInfo: (data: IConfirmationInfo) =>
    dispatch(setConfirmationInfo(data)),
  _resetConfirmationInfo: () => dispatch(resetConfirmationInfo()),
  _deleteExpenseById: (id: number, localFilters: any, pageSize?: number) =>
    dispatch(deleteExpenseById(id, ownProps.type, localFilters, pageSize)),
  _sendExpenseForApproval: (expenses: number[], localFilters: any) =>
    dispatch(sendExpenseForApproval(expenses, ownProps.type, localFilters)),
  _fetchWorkFlowData: (props: IfetchWorkFlowDataProps) =>
    dispatch(fetchWorkFlowData(props)),
  _deleteExpenses: (
    props: number[],
    successCallback?: Function,
    filters?: any,
  ) => dispatch(deleteExpenses(props, ownProps.type, successCallback, filters)),
});

const connector = connect(mapStateToProps, mapDispatchToProps);
export default connector(memo(DraftExpense));
