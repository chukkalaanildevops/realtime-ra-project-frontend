/* eslint-disable react-hooks/exhaustive-deps */
import React, { Dispatch, useState, memo, useEffect, useRef } from 'react';
import {
  FilterBar,
  AppDrawer,
  NoData,
  StatusTag,
  Remarks,
  Amount,
  DataFilter,
  ErrorBoundary,
  ElementOrSkeleton,
} from '../../../../shared/components';
import {
  getReportLoader,
  getBenefitReports,
  getReportSuccess,
  getReportCount,
} from '../../../../shared/redux/rootReducer';
import { connect, ConnectedProps } from 'react-redux';
import { Table, Skeleton, Button } from 'antd';
import {
  fetchReportTabData,
  exportReport,
  fetchExportedDownloadList,
} from '../../reports.thunk';

import { useHistory, useLocation } from 'react-router-dom';
import {
  setConfirmationInfo,
  resetConfirmationInfo,
} from '../../../app/app.actions';
import {
  IConfirmationInfo,
  IfetchWorkFlowDataProps,
} from '../../../app/app.model';
import { IWorkflowStatus } from '../../../../shared/model';
import {
  fetchWorkFlowData,
  fetchWorkFlowDataForPDFPrint,
} from '../../../app/app.thunk';
import DocumentsViewer from '../../../../shared/components/documentsViewer/documentsViewer.index';
import BenefitDetails from '../../../benefits/benefitDetail/benefitDetail.index';
import { tabs } from '../../reports.model';
import { Pagination } from 'antd';
import {
  getQueryParametersAsObject,
  generateQueryParamsString,
} from '../../../../utils/global.utils';
import ReactToPrint from 'react-to-print';
import PrintPDF from '../../../../shared/components/printPDF/printPDF.index';
import { PrinterOutlined } from '@ant-design/icons';
import { Trans } from '@lingui/macro';

let initialPageSize = 12;

const ReportBenefit: React.FC<ConnectedProps<typeof connector> & {
  source?: any;
  isActive?: boolean;
  defaultFilters?: { [x: string]: any };
}> = ({
  records,
  source,
  isLoading,
  isActive,
  _fetchRecords,
  _exportReport,
  _fetchWorkFlowData,
  _downloadReports,
  defaultFilters = {},
  _fetchWorkFlowDataForPDFPrint,
}) => {
  const [isItemExpanded, setItemExpanded] = useState<{
    visibility: boolean;
    item: null | any;
  }>({
    visibility: false,
    item: null,
  });
  const [drawerTitle, setDrawerTitle] = useState<{
    type: string;
    title: string;
  }>({ type: '', title: '' });
  const [currentStatus, setCurrentStatus] = useState<{
    status: {
      code: string;
      title: string;
    };
    id: number;
  } | null>(null);
  const [isFilterVisible, setFilterVisible] = useState(false);
  let type: tabs = 'benefit';
  let data = records;

  const history = useHistory();
  const location = useLocation();

  const urlQueryParameters = getQueryParametersAsObject();
  let localFilters = {
    ...defaultFilters,
    ...urlQueryParameters,
  };
  // let queryString = generateQueryParamsString(localFilters);

  useEffect(() => {
    if (isActive) {
      _fetchRecords(type, source, 1, localFilters, pageSize);
    }
  }, [isActive]);

  const handleStatusTagClick = (id: number, _type?: string) => {
    _fetchWorkFlowData({ id: id, type: 'benefit' });
  };
  const [pageSize, setPageSize] = useState(initialPageSize);
  const onApplyFilters = (filters: any) => {
    localFilters = filters;
    _fetchRecords(type, source, 1, filters, pageSize);
    let queryParameters = generateQueryParamsString(filters);
    history.push(`${location.pathname}?${queryParameters}`);
  };

  const componentRef = useRef(null);

  const drawerTitleComponent = (
    <>
      {`Benefit Claim No. #${drawerTitle.title}`}
      <StatusTag
        status={currentStatus?.status as IWorkflowStatus}
        onStatusClick={handleStatusTagClick.bind(
          null,
          currentStatus?.id as number,
          drawerTitle.type as string,
        )}
      />
      <ReactToPrint
        trigger={() => (
          <Button className='custom-primary-btn' icon={<PrinterOutlined />}>
            Print
          </Button>
        )}
        onBeforeGetContent={() => {
          return new Promise(function(resolve) {
            _fetchWorkFlowDataForPDFPrint(currentStatus?.id, 'benefit');
            setTimeout(function() {
              resolve(true);
            }, 1500);
          });
        }}
        content={() => componentRef.current}
      />
      <div style={{ display: 'none' }}>
        <div ref={componentRef}>
          <PrintPDF
            isCreatedByVisible={false}
            isAdmin={false}
            claimType={drawerTitle?.type}
            claimTitleId={drawerTitle?.title}
            claimStatus={currentStatus?.status}
          />
        </div>
      </div>
    </>
  );

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

  const openDetailsDrawer = (item: any, type: string) => {
    setItemExpanded({
      visibility: true,
      item: item,
    });

    let claim_number = '';
    let workflow_status = { code: '', title: '' };
    let id = 0;
    if (type === 'benefit') {
      claim_number = item.claim_number;
      workflow_status = item.workflow_status;
      id = item.id;
    }

    setDrawerTitle({ type: type, title: claim_number });
    setCurrentStatus({
      status: workflow_status,
      id: id,
    });
  };

  const closeDetailsDrawer = () => {
    setItemExpanded({
      visibility: false,
      item: null,
    });
    setDrawerTitle({ type: '', title: '' });
    setCurrentStatus(null);
  };

  const columns = [
    {
      dataIndex: 'claim_number',
      title: () => getElemOrSkeleton(<Trans>Benefit ID</Trans>),
      fixed: 'left' as 'left',
      width: 170,
      render: (val: string, row: any) =>
        isLoading ? (
          getElemOrSkeleton('')
        ) : (
          <Button
            type='link'
            onClick={() => openDetailsDrawer(row, 'benefit')}
            className='no-pad _lr'
          >
            {val}
          </Button>
        ),
    },
    {
      dataIndex: 'date',
      title: () => getElemOrSkeleton(<Trans>Receipt Date</Trans>),
      width: '10%',
      render: getElemOrSkeleton,
    },
    {
      dataIndex: 'employee',
      title: () => getElemOrSkeleton(<Trans>Employee Name</Trans>),
      width: '10%',
      render: (val: any) =>
        isLoading ? getElemOrSkeleton('') : val?.legal_name || val?.name,
    },
    {
      dataIndex: 'benefit_type_legal_entity',
      title: () => getElemOrSkeleton(<Trans>Benefit Type</Trans>),
      ellipse: true,
      width: '10%',
      render: (value: any) =>
        isLoading ? getElemOrSkeleton('') : value.benefit_type.title,
    },
    {
      dataIndex: 'converted_amount_currency',
      title: () => getElemOrSkeleton(<Trans>Amount</Trans>),
      // colSpan: 2,
      render: (val: any, item: any) =>
        isLoading ? (
          getElemOrSkeleton(val?.currency?.code)
        ) : (
          <Amount amount={item.converted_amount} currency={val} align='right' />
        ),
      width: '12%',
      align: 'center' as 'center',
    },
    {
      dataIndex: 'receipt',
      title: () => getElemOrSkeleton(<Trans>Receipt/s</Trans>),
      align: 'center' as 'center',
      width: '8%',
      render: (_val: any, item: any) =>
        isLoading ? (
          getElemOrSkeleton('')
        ) : (
          <DocumentsViewer
            itemType='benefit'
            itemNumber={item.claim_number}
            documents={item.supporting_documents}
            receipt={item.receipt}
          />
        ),
    },
    {
      dataIndex: 'total_comments',
      title: () => getElemOrSkeleton(<Trans>Remarks</Trans>),
      align: 'center' as 'center',
      width: '7%',
      render: (val: any, item: any) =>
        isLoading ? (
          getElemOrSkeleton('')
        ) : (
          <>
            <Remarks
              remarkCount={val}
              itemId={item.id}
              itemType='benefit-claim'
              item_no={item.claim_number}
            />
          </>
        ),
    },
    {
      dataIndex: 'workflow_status',
      width: 150,
      title: () => getElemOrSkeleton(<Trans>Status</Trans>),
      align: 'center' as 'center',
      render: (val: any, item: any) =>
        isLoading ? (
          getElemOrSkeleton('')
        ) : (
          <StatusTag
            status={val}
            onStatusClick={() => handleStatusTagClick(item.id)}
          />
        ),
    },
  ];

  const renderData = () => {
    return (
      <ElementOrSkeleton
        type='table'
        tableConfiguration={{ columns: 8, rows: 10 }}
        isLoading={isLoading}
      >
        {data && data?.data.length > 0 ? (
          <>
            <Table
              bordered
              pagination={false}
              columns={columns}
              dataSource={data?.data}
              rowKey={item => item.id}
              scroll={{ x: 1200 }}
              size='middle'
            />
            {/* {data.pagination_data.next_page && (
              <LoadMore
                item={type}
                nextPage={data.pagination_data.next_page}
                filters={localFilters}
              />
            )} */}
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
                  _fetchRecords(
                    type,
                    source,
                    pageNumber,
                    localFilters,
                    pageSize,
                  );
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
                  goButton: <Button type='default'>Go</Button>,
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

  return (
    <div className={`report-benefit-container`}>
      <ErrorBoundary>
        <FilterBar
          isAddButton={false}
          filterView={setFilterVisible}
          canExport={true}
          isFilterActive={isFilterVisible}
          onExport={() => _exportReport(type, source.token, localFilters)}
          showDownload={true}
          onDownload={_downloadReports}
        />
        <div style={{ marginBottom: 20 }}>
          <DataFilter
            page='REPRT'
            source={source}
            includeLegalEntities
            includeStatusBar
            isVisible={isFilterVisible}
            includeDraftStatus={false}
            includeSaveFilterOption={true}
            item='benefit'
            onApplyFilters={onApplyFilters}
            onResetFilters={() => {
              localFilters = { ...defaultFilters };
              let queryString = generateQueryParamsString(localFilters);
              _fetchRecords(type, source, 1, localFilters, pageSize);
              history.push(`${location.pathname}?${queryString}`);
            }}
            includeSettlementDate={true}
            includeSubmittedOnDate={true}
            includeItemNumber={true}
            includeBatchNumber={true}
            includeLastActionPriorToDate
            includePendingApprovalAtUserList
            includeEntityList
            initialFilters={localFilters}
            includeEmpoyeeList
          />
        </div>
        <ErrorBoundary>{renderData()}</ErrorBoundary>
        <AppDrawer
          width={'80%'}
          visible={isItemExpanded.visibility}
          destroyOnClose={true}
          closable={true}
          onClose={closeDetailsDrawer}
          title={drawerTitleComponent}
          showCancelButton={false}
          showOkButton={false}
          getContainer={'.report-benefit-container'}
        >
          <BenefitDetails
            benefitClaimId={isItemExpanded?.item?.id}
            isAdmin={true}
          />
        </AppDrawer>
      </ErrorBoundary>
    </div>
  );
};

const mapStateToProps = (state: any) => ({
  records: getBenefitReports(state),
  isLoading: getReportLoader(state),
  success: getReportSuccess(state),
  reportCount: getReportCount(state),
});

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  _fetchRecords: (
    type: tabs,
    source: any,
    page: number,
    filters?: any,
    pageSize?: number,
  ) => dispatch(fetchReportTabData(type, source, page, filters, pageSize)),
  _setConfirmationInfo: (data: IConfirmationInfo) =>
    dispatch(setConfirmationInfo(data)),
  _resetConfirmationInfo: () => dispatch(resetConfirmationInfo()),
  _fetchWorkFlowData: (props: IfetchWorkFlowDataProps) =>
    dispatch(fetchWorkFlowData(props)),
  _exportReport: (type: tabs, source: any, filters: any) =>
    dispatch(exportReport(type, source, filters)),
  _downloadReports: () => dispatch(fetchExportedDownloadList()),
  _fetchWorkFlowDataForPDFPrint: (id: any, type: any) =>
    dispatch(fetchWorkFlowDataForPDFPrint(id, type)),
});

const connector = connect(mapStateToProps, mapDispatchToProps);
export default connector(memo(ReportBenefit));
