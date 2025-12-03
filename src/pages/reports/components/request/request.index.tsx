/* eslint-disable react-hooks/exhaustive-deps */
import React, { Dispatch, useState, memo, useEffect, useRef } from 'react';
import {
  FilterBar,
  AppDrawer,
  NoData,
  StatusTag,
  ErrorBoundary,
  Remarks,
  DataFilter,
  ElementOrSkeleton,
} from '../../../../shared/components';
import {
  getReportLoader,
  getRequestReports,
  getReportSuccess,
  getCashAdvanceRequestReports,
  getReportCount,
} from '../../../../shared/redux/rootReducer';
import { connect, ConnectedProps } from 'react-redux';
import { Table, Skeleton, Button } from 'antd';
import PrintPDF from '../../../../shared/components/printPDF/printPDF.index';
import { useHistory, useLocation } from 'react-router-dom';
import { IfetchWorkFlowDataProps } from '../../../app/app.model';
import { IWorkflowStatus } from '../../../../shared/model';
import {
  fetchWorkFlowData,
  fetchWorkFlowDataForPDFPrint,
} from '../../../app/app.thunk';
import RequestDetails from '../../../request/detail/requestDetail.index';
import DocumentsViewer from '../../../../shared/components/documentsViewer/documentsViewer.index';
import {
  fetchReportTabData,
  exportReport,
  fetchExportedDownloadList,
} from '../../reports.thunk';
import {
  getQueryParametersAsObject,
  generateQueryParamsString,
} from '../../../../utils/global.utils';
// import moment from 'moment';
import { Pagination } from 'antd';
import ReactToPrint from 'react-to-print';
import { PrinterOutlined } from '@ant-design/icons';
import { Trans } from '@lingui/macro';

let initialPageSize = 12;

const ReportRequest: React.FC<ConnectedProps<typeof connector> & {
  source?: any;
  isActive?: boolean;
  defaultFilters?: { [x: string]: any };
}> = ({
  records,
  source,
  isLoading,
  isActive,
  reportCount,
  _fetchRecords,
  _fetchWorkFlowData,
  _exportReport,
  _downloadReports,
  defaultFilters = {},
  _fetchWorkFlowDataForPDFPrint,
}) => {
  const [isItemExpanded, setItemExpanded] = useState(false);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [drawerTitle, setDrawerTitle] = useState('');
  const [isFilterVisible, setFilterVisible] = useState(false);

  const [currentStatus, setCurrentStatus] = useState<{
    status: {
      code: string;
      title: string;
    };
    id: number;
  } | null>(null);

  const urlQueryParameters = getQueryParametersAsObject();
  let localFilters = {
    ...defaultFilters,
    ...urlQueryParameters,
  };

  const componentRef = useRef(null);
  const history = useHistory();
  const location = useLocation();

  // let queryString = generateQueryParamsString(localFilters);

  const closeDetailsDrawer = () => {
    setItemExpanded(false);
    setDrawerTitle('');
    setCurrentStatus(null);
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

  const openDetailsDrawer = (item: any) => {
    setItemExpanded(true);
    setDrawerTitle(item.request_no);
    setCurrentStatus({
      status: item.workflow_status,
      id: item.id,
    });
  };

  useEffect(() => {
    if (isActive) {
      _fetchRecords(source, 1, localFilters, pageSize);
    }
  }, [isActive]);

  // useEffect(() => {
  //   return () => {
  //     // componentWillUnmount
  //     if (JSON.stringify(localFilters) !== '{}') {
  //       //reseting filters
  //       localFilters = {};
  //       _fetchRecords(1);
  //     }
  //   };
  // }, []);

  const columns = [
    {
      dataIndex: 'request_no',
      title: () => getElemOrSkeleton(<Trans>Request No</Trans>),
      fixed: 'left' as 'left',
      width: 170,
      render: (val: string, item: any) =>
        isLoading ? (
          getElemOrSkeleton(val)
        ) : (
          <Button
            type='link'
            onClick={() => openDetailsDrawer(item)}
            className='no-pad _lr'
          >
            {val}
          </Button>
        ),
    },
    {
      dataIndex: 'start_date',
      title: () => getElemOrSkeleton(<Trans>Start Date</Trans>),
      render: getElemOrSkeleton,
    },
    {
      dataIndex: 'end_date',
      title: () => getElemOrSkeleton(<Trans>End Date</Trans>),
      render: getElemOrSkeleton,
    },
    {
      dataIndex: 'employee',
      title: () => getElemOrSkeleton(<Trans>Employee Name</Trans>),
      render: (val: any) =>
        isLoading ? getElemOrSkeleton('') : val?.legal_name || val?.name,
    },
    {
      dataIndex: 'request_type_legal_entity',
      title: () => getElemOrSkeleton(<Trans>Request Type</Trans>),
      ellipse: true,
      render: (value: any) =>
        isLoading ? getElemOrSkeleton('') : value?.request_type?.title,
    },
    {
      dataIndex: '',
      title: () => getElemOrSkeleton(<Trans>Receipt/s</Trans>),
      align: 'center' as 'center',
      render: (_val: any, item: any) =>
        isLoading ? (
          getElemOrSkeleton('')
        ) : (
          <DocumentsViewer
            itemType='request'
            itemNumber={item.request_no}
            receipt={null}
            documents={item.attachments}
          />
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
          <>
            <Remarks
              remarkCount={val}
              itemId={item.id}
              itemType='requests'
              item_no={item.request_no}
            />
          </>
        ),
    },
    {
      dataIndex: 'request_type_legal_entity',
      title: () => getElemOrSkeleton(<Trans>Category</Trans>),
      render: (val: any) =>
        getElemOrSkeleton(val?.is_travel_type ? 'Travel' : 'General'),
    },
    {
      dataIndex: 'workflow_status',
      title: () => getElemOrSkeleton(<Trans>Status</Trans>),
      align: 'center' as 'center',
      width: 150,
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

  const handleStatusTagClick = (id: number) => {
    _fetchWorkFlowData({ id: id, type: 'request' });
  };

  const renderData = () => {
    if (isLoading)
      return (
        <ElementOrSkeleton
          type='table'
          tableConfiguration={{ columns: 8, rows: 10 }}
          isLoading={isLoading}
        />
      );
    if (records && records?.data.length > 0) {
      return (
        <>
          <Table
            bordered
            pagination={false}
            columns={columns}
            dataSource={records?.data}
            rowKey={item => item.id}
            scroll={{ x: 1200 }}
            size='middle'
          />
          {/* {records.pagination_data.next_page && (
            <LoadMore
              item='request'
              nextPage={records.pagination_data.next_page}
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
                _fetchRecords(source, pageNumber, localFilters, pageSize);
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
      );
    } else {
      return <NoData />;
    }
  };

  const onApplyFilters = (filters: any) => {
    localFilters = filters;
    _fetchRecords(source, 1, filters, pageSize);
    let queryParameters = generateQueryParamsString(filters);
    history.push(`${location.pathname}?${queryParameters}`);
  };
  const drawerTitleComponent = (
    <>
      {`Request No. #${drawerTitle}`}
      <StatusTag
        status={currentStatus?.status as IWorkflowStatus}
        onStatusClick={handleStatusTagClick.bind(
          null,
          currentStatus?.id as number,
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
            _fetchWorkFlowDataForPDFPrint(currentStatus?.id, 'request');
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
            claimType={'request'}
            claimTitleId={drawerTitle}
            claimStatus={currentStatus?.status}
          />
        </div>
      </div>
    </>
  );

  // if (reportCount.requests === 0) {
  //   return (
  //     <div className='no-data-wrapper'>
  //       <NoData />
  //     </div>
  //   );
  // }

  return (
    <div className='draft-request-container'>
      <ErrorBoundary>
        <FilterBar
          isAddButton={false}
          filterView={setFilterVisible}
          canExport={true}
          onExport={() => _exportReport(source.token, localFilters)}
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
            item='request'
            onApplyFilters={onApplyFilters}
            onResetFilters={() => {
              localFilters = { ...defaultFilters };
              let queryString = generateQueryParamsString(localFilters);
              _fetchRecords(source, 1, localFilters, pageSize);
              history.push(`${location.pathname}?${queryString}`);
            }}
            includeItemNumber={true}
            includeBatchNumber={true}
            includeLastActionPriorToDate
            includePendingApprovalAtUserList
            includeEntityList
            initialFilters={localFilters}
            includeEmpoyeeList
            includeSubmittedOnDate={true}
          />
        </div>
        <ErrorBoundary>{renderData()}</ErrorBoundary>
        <AppDrawer
          visible={isItemExpanded}
          destroyOnClose={true}
          closable={true}
          onClose={closeDetailsDrawer}
          title={drawerTitleComponent}
          showCancelButton={false}
          showOkButton={false}
          width='60%'
          getContainer='.draft-request-container'
          className='request-detail-drawer'
        >
          <RequestDetails requestId={currentStatus?.id as number} />
        </AppDrawer>
      </ErrorBoundary>
    </div>
  );
};

const mapStateToProps = (state: any) => ({
  records: getRequestReports(state),
  cashAdvanceRequests: getCashAdvanceRequestReports(state),
  isLoading: getReportLoader(state),
  success: getReportSuccess(state),
  reportCount: getReportCount(state),
});

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  _fetchRecords: (
    source: any,
    page: number,
    filters?: any,
    pageSize?: number,
  ) => dispatch(fetchReportTabData('request', source, page, filters, pageSize)),
  _fetchWorkFlowData: (props: IfetchWorkFlowDataProps) =>
    dispatch(fetchWorkFlowData(props)),
  _downloadReports: () => dispatch(fetchExportedDownloadList()),
  _exportReport: (source: any, filters: any) =>
    dispatch(exportReport('request', source, filters)),
  _fetchWorkFlowDataForPDFPrint: (id: any, type: any) =>
    dispatch(fetchWorkFlowDataForPDFPrint(id, type)),
});

const connector = connect(mapStateToProps, mapDispatchToProps);
export default connector(memo(ReportRequest));
