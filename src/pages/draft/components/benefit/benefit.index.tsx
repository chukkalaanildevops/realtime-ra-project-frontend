import React, { Dispatch, useState, useEffect } from 'react';
import { Button, Checkbox, Col, Pagination, Row, Skeleton, Table } from 'antd';
import {
  Amount,
  AppDrawer,
  DataFilter,
  DotMenu,
  ElementOrSkeleton,
  ErrorBoundary,
  FilterBar,
  NoData,
  ReceiptViewer,
  Remarks,
  StatusTag,
} from '../../../../shared/components';
import {
  getDraftBenefits,
  getDraftDefaultView,
  getDraftsLoader,
} from '../../../../shared/redux/rootReducer';
import {
  fetchDraftsTabData,
  sendBenefitForApproval,
  deleteBenefits,
} from '../../drafts.thunk';
import { viewType } from '../../../../shared/components/filterBar/filterBar.model';
import { connect, ConnectedProps } from 'react-redux';
import { IWorkflowStatus } from '../../../../shared/model';
import {
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
  ExportOutlined,
} from '@ant-design/icons';
import { Trans } from '@lingui/macro';
import { ColumnsType } from 'antd/lib/table';
import { appPath } from '../../../app/app.routes';
import { useHistory } from 'react-router-dom';
import {
  resetConfirmationInfo,
  setConfirmationInfo,
} from '../../../app/app.actions';
import { deleteBenefitById } from '../../../benefits/addNewBenefit.thunk';
import { IConfirmationInfo } from '../../../app/app.model';
import BenefitDetail from '../../../benefits/benefitDetail/benefitDetail.index';
import { resetToInitial } from '../../../benefits/store/benefit.action';
import { DraftCard } from '..';
import { getFormattedDate } from '../../../../utils/scroll.utils';

const mapStateToProps = (state: any) => ({
  isLoading: getDraftsLoader(state),
  records: getDraftBenefits(state),
  defaultView: getDraftDefaultView(state),
});

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  _fetchRecords: (page: number, filters?: any, pageSize?: number) =>
    dispatch(fetchDraftsTabData('benefit', page, filters, pageSize)),
  _setConfirmationInfo: (data: IConfirmationInfo) =>
    dispatch(setConfirmationInfo(data)),
  _resetConfirmationInfo: () => dispatch(resetConfirmationInfo()),
  _deleteBenefitById: (id: number, localFilters: any, pageSize?: number) =>
    dispatch(deleteBenefitById(id, 'benefit', localFilters, pageSize)),
  _sendExpenseForApproval: (expenses: number[], localFilters: any) =>
    dispatch(sendBenefitForApproval(expenses, 'benefit', localFilters)),
  _resetBenefitClaimForm: () => dispatch(resetToInitial()),
  _deleteBenefits: (
    props: number[],
    successCallback?: Function,
    filters?: any,
  ) => dispatch(deleteBenefits(props, 'benefit', successCallback, filters)),
});

let initialPageSize = 12;
let localFilters: any = null;

type Tprops = ConnectedProps<typeof connector> & {
  onSelectRow?: (list: any[]) => void;
  source?: any;
};

const DraftBenefit: React.FC<Tprops> = ({
  defaultView,
  isLoading,
  source,
  records,
  onSelectRow,
  _fetchRecords,
  _setConfirmationInfo,
  _resetConfirmationInfo,
  _deleteBenefitById,
  _sendExpenseForApproval,
  _resetBenefitClaimForm,
  _deleteBenefits,
}) => {
  const history = useHistory();
  // useState
  const [dataView, setDataView] = useState<viewType>(defaultView);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [isFilterVisible, setFilterVisible] = useState(false);
  const [isItemExpanded, setItemExpanded] = useState(false);
  const [drawerTitle, setDrawerTitle] = useState('');
  const [currentStatus, setCurrentStatus] = useState<{
    status: {
      code: string;
      title: string;
    };
    id: number;
  } | null>(null);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [selectedSubmittableItems, setSelectedSubmittableItems] = useState<
    number[]
  >([]);

  // useState end

  // useEffect
  useEffect(() => {
    _fetchRecords(1, undefined, pageSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // usEffect end

  // filter code

  const onApplyFilters = (filters: any) => {
    localFilters = filters;
    _fetchRecords(records?.current_page || 1, filters, pageSize);
  };

  const onResetFilters = () => {
    localFilters = undefined;
    _fetchRecords(1, undefined, pageSize);
  };

  // filter code end

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

  const editItem = (id: string, _item: any) => {
    history.push(`${appPath.benefit.update.linkTo}${id}`);
    // }${id}/?is_resubmission_case=${item?.is_resubmission_case || false}`,
  };

  const handleDeleteClick = (id: number, localFilters: any) => {
    _setConfirmationInfo({
      bodyText: 'Do you want to delete Benefit?',
      cancelText: 'Cancel',
      okText: 'Delete',
      visibility: true,
      extraInfo: '',
      forWhat: '',
      headerText: 'Confirmation',
      cancelBtnFn: _resetConfirmationInfo,
      okBtnFn: () => {
        _deleteBenefitById(id, localFilters, pageSize);
        _resetConfirmationInfo();
      },
    });
  };

  // Drawer code

  const drawerTitleComponent = (
    <>
      {`Benefit Claim No. #${drawerTitle}`}
      <StatusTag status={currentStatus?.status as IWorkflowStatus} />
    </>
  );

  const openDetailsDrawer = (item: any) => {
    setItemExpanded(true);
    setDrawerTitle(item.claim_number);
    setCurrentStatus({
      status: item.workflow_status,
      id: item.id,
    });
  };

  const closeDetailsDrawer = () => {
    setItemExpanded(false);
    setDrawerTitle('');
    _resetBenefitClaimForm();
  };

  // Drawer code end

  // pagination functions

  const onChangePagination = (page: number, pageSize: number) => {
    _fetchRecords(page, localFilters, pageSize);
    // onSelectChange([]);
  };

  // pagination functions end

  // select all code

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

  const showDeleteItemBox = (ids: number[]) => {
    _setConfirmationInfo({
      bodyText: 'Do you want to delete benefits?',
      cancelText: 'Cancel',
      okText: 'Delete',
      visibility: true,
      extraInfo: '',
      forWhat: '',
      headerText: 'Confirmation',
      cancelBtnFn: _resetConfirmationInfo,
      okBtnFn: () => {
        _resetConfirmationInfo();
        _deleteBenefits(
          ids,
          () => {
            setSelectedItems([]);
          },
          localFilters,
        );
      },
    });
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

  const onSelectChange = (selectedRowKeys: any[]) => {
    setSelectedSubmittableItems(selectedRowKeys as never);
    setSelectedItems(selectedRowKeys as never);
    onSelectRow && onSelectRow(selectedRowKeys);
  };

  // select all code end

  const columns: ColumnsType<any> = [
    {
      dataIndex: 'claim_number',
      title: () => getElemOrSkeleton(<Trans>Benefit Claim ID</Trans>),
      fixed: 'left' as 'left',
      ellipsis: true,
      width: 170,
      render: (val: string, item: any) => (
        <Button
          type='link'
          onClick={() => openDetailsDrawer(item)}
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
      dataIndex: 'benefit_type_legal_entity',
      title: () => getElemOrSkeleton(<Trans>Benefit Type</Trans>),
      render: (value: any) =>
        isLoading ? getElemOrSkeleton('') : value.benefit_type.title,
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
              itemType='benefit-claim'
              itemNumber={item.claim_number}
              count={item.total_attachments}
            />
          </>
        ),
    },
    {
      dataIndex: 'total_comments',
      title: <Trans>Remarks</Trans>,
      align: 'center' as 'center',
      render: (val: any, item: any) =>
        isLoading ? (
          getElemOrSkeleton('')
        ) : (
          <Remarks
            remarkCount={val}
            itemId={item.id}
            itemType='benefit-claim'
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
            OnClick: editItem.bind(null, item.id, item),
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
            OnClick: () => _sendExpenseForApproval([item.id], localFilters),
          },
        ];

        return (
          <DotMenu actionBtn={action}>
            <EllipsisOutlined />
          </DotMenu>
        );
      },
    },
  ];

  const onRemarkAdded = () => {
    // _fetchRecords(1);
  };

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
              Select All
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
                OnClick: () => _sendExpenseForApproval([item.id], localFilters),
              },
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
                  category='Benefit'
                  // category={item.benefit_type_legal_entity?.benefit_type.title}
                  onChecked={checked => onSelectCard(checked, item.id)}
                  title={getFormattedDate(item.date)}
                  checked={selectedItems.includes(item.id)}
                  checkboxProps={{
                    disabled: !item.is_submittable,
                  }}
                  code={item.claim_number}
                  // requestNumber={item?.request?.request_no}
                  type={item.benefit_type_legal_entity.benefit_type.title}
                  status={{ code: 'DRAFTD', title: 'Draft' }}
                  // handleStatusTagClick={handleStatusTagClick}
                  id={item.id}
                  currency={{
                    amount: item.converted_amount || '',
                    currency:
                      item?.converted_amount_currency?.currency?.code || '',
                  }}
                  onDetails={(_type: string) => openDetailsDrawer(item)}
                  actionText='EDIT'
                  isActionDisabled={
                    typeof item.is_editable === 'boolean' && !item.is_editable
                  }
                  onMainAction={editItem.bind(null, item.id, item)}
                  receipts={
                    <ReceiptViewer
                      itemId={item.id}
                      itemType='benefit-claim'
                      itemNumber={item.claim_number}
                      count={item.total_attachments}
                    />
                  }
                  remarks={item.total_comments || 0}
                  cardType='benefit-claim'
                  // expenseType={type}
                  onRemarkAdded={onRemarkAdded}
                />
              </Col>
            );
          })}
        </Row>
      </div>
    </>
  );

  const renderData = () => {
    if (isLoading)
      return (
        <ElementOrSkeleton
          isLoading={isLoading}
          type={dataView === 'Card' ? 'cards' : 'table'}
          tableConfiguration={{ columns: 8, rows: 10 }}
          cardsConfiguration={{ numberOfCardsPerRow: 4, rows: 3 }}
        />
      );
    if (records && records?.data.length > 0) {
      return (
        <>
          {dataView === 'Table' ? (
            <>
              <div className='select-all-container' style={{ marginLeft: 12 }}>
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
                  getCheckboxProps: item => ({
                    disabled: !item.is_submittable,
                  }),
                }}
                size='middle'
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
              showSizeChanger={true}
              defaultPageSize={12}
              pageSizeOptions={['10', '12', '20', '50', '100']}
              pageSize={pageSize || 12}
              onShowSizeChange={(_current: number, size: number) => {
                setPageSize(size);
              }}
              total={records.pagination_data.total_records}
              showTotal={(total: number, range: number[]) => {
                return <>{`${range[0]}-${range[1]} of ${total}`}</>;
              }}
              showQuickJumper={{
                goButton: <Button type='default'>Go</Button>,
              }}
            />
          </div>
        </>
      );
    } else {
      return <NoData />;
    }
  };

  return (
    <ErrorBoundary>
      <div className='draft-benefit-container'>
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
            item='benefit'
            onApplyFilters={onApplyFilters}
            onResetFilters={onResetFilters}
            includeItemNumber={true}
          />
        </div>
        {renderData()}
        <AppDrawer
          visible={isItemExpanded}
          destroyOnClose={true}
          closable={true}
          onClose={closeDetailsDrawer}
          title={drawerTitleComponent}
          showCancelButton={false}
          showOkButton={false}
          width='80%'
          getContainer='.draft-benefit-container'
          className='benefit-detail-drawer no-header-border'
        >
          <BenefitDetail benefitClaimId={currentStatus?.id} isAdmin={true} />
        </AppDrawer>
      </div>
    </ErrorBoundary>
  );
};

const connector = connect(mapStateToProps, mapDispatchToProps);
export default connector(DraftBenefit);
