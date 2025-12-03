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
  Amount,
  ElementOrSkeleton,
} from '../../../../shared/components';
import PrintPDF from '../../../../shared/components/printPDF/printPDF.index';
import {
  getReportLoader,
  getReportSuccess,
  getCashAdvanceRequestReports,
  getCashAdvanceFilters,
  getReportCount,
} from '../../../../shared/redux/rootReducer';
import { connect, ConnectedProps } from 'react-redux';
import { Table, Skeleton, Button } from 'antd';
import { PrinterOutlined } from '@ant-design/icons';

import { useHistory, useLocation } from 'react-router-dom';

import { IfetchWorkFlowDataProps } from '../../../app/app.model';
import { IWorkflowStatus } from '../../../../shared/model';
import {
  fetchWorkFlowData,
  fetchWorkFlowDataForPDFPrint,
} from '../../../app/app.thunk';

import RequestDetails from '../../../request/detail/requestDetail.index';
import ReactToPrint from 'react-to-print';
import {
  fetchReportTabData,
  exportReport,
  fetchExportedDownloadList,
} from '../../reports.thunk';
import {
  getQueryParametersAsObject,
  generateQueryParamsString,
} from '../../../../utils/global.utils';
import { Pagination } from 'antd';
import { Trans } from '@lingui/macro';

let initialPageSize = 12;

const CashAdvanceRequestReport: React.FC<ConnectedProps<typeof connector> & {
  source?: any;
  isActive?: boolean;
}> = ({
  source,
  isLoading,
  cashAdvanceRequests,
  isActive,
  reportCount,
  _fetchRecords,
  _fetchWorkFlowData,
  _exportReport,
  _downloadReports,
  _fetchWorkFlowDataForPDFPrint,
}) => {
  const history = useHistory();
  const location = useLocation();
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
    ...urlQueryParameters,
  };
  useEffect(() => {
    isActive && _fetchRecords(source, 1, localFilters, pageSize);
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

  const columns = [
    {
      dataIndex: 'cash_advance_request_number',
      title: () => getElemOrSkeleton(<Trans>Cash Advance Request No</Trans>),
      render: (val: any) => getElemOrSkeleton(val),
      fixed: true,
      width: 180,
    },
    {
      dataIndex: 'request',
      title: () => getElemOrSkeleton(<Trans>Request No</Trans>),
      fixed: true,
      width: 170,
      render: (val: any) =>
        isLoading ? (
          getElemOrSkeleton(val)
        ) : (
          <Button
            type='link'
            onClick={() => openDetailsDrawer(val)}
            className='no-pad _lr'
          >
            {val.request_no}
          </Button>
        ),
    },
    {
      dataIndex: 'request',
      title: () => getElemOrSkeleton(<Trans>Request Type</Trans>),
      ellipse: true,
      render: (value: any) =>
        isLoading
          ? getElemOrSkeleton('')
          : value?.request_type_legal_entity?.request_type?.title,
    },
    {
      dataIndex: 'amount_requested',
      title: () => getElemOrSkeleton(<Trans>Amount Requested</Trans>),
      align: 'center' as 'center',
      render: (val: any, item: any) => (
        <Amount align='right' currency={item.currency} amount={val} />
      ),
    },
    {
      dataIndex: 'amount_disbursed',
      title: () => getElemOrSkeleton(<Trans>Amount Disbursed</Trans>),
      align: 'center' as 'center',
      render: (val: any, item: any) => (
        <Amount align='right' currency={item.currency} amount={val} />
      ),
    },
    {
      dataIndex: 'request',
      title: () => getElemOrSkeleton(<Trans>Employee Name</Trans>),
      render: (val: any) =>
        isLoading
          ? getElemOrSkeleton('')
          : val?.employee?.legal_name || val?.employee?.name,
    },
    {
      dataIndex: 'request',
      title: () => getElemOrSkeleton(<Trans>Remarks</Trans>),
      align: 'center' as 'center',
      render: (val: any, item: any) =>
        isLoading ? (
          getElemOrSkeleton('')
        ) : (
          <>
            <Remarks
              remarkCount={val.total_comments}
              itemId={val.id}
              itemType='requests'
              item_no={item.request.request_no}
              showAddButton={true}
            />
          </>
        ),
    },

    {
      dataIndex: 'status',
      align: 'center' as 'center',
      width: 150,
      title: () => getElemOrSkeleton(<Trans>Status</Trans>),
      render: (val: any) =>
        isLoading ? getElemOrSkeleton('') : <StatusTag status={val} />,
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
          isLoading={isLoading}
          tableConfiguration={{ rows: 10, columns: 8 }}
        />
      );
    if (cashAdvanceRequests && cashAdvanceRequests?.data.length > 0) {
      return (
        <>
          <Table
            bordered
            pagination={false}
            columns={columns}
            dataSource={cashAdvanceRequests?.data}
            rowKey={item => item.id}
            scroll={{ x: 1200 }}
            size='middle'
          />
          {/* {cashAdvanceRequests.pagination_data.next_page && (
            <LoadMore
              item='cash_advance_request'
              nextPage={cashAdvanceRequests.pagination_data.next_page}
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
              current={cashAdvanceRequests.current_page}
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
              total={cashAdvanceRequests.pagination_data.total_records}
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
  const componentRef = useRef(null);
  const drawerTitleComponent = (
    <>
      {`Cash Advance Request. #${drawerTitle}`}
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
            _fetchWorkFlowDataForPDFPrint(
              currentStatus?.id,
              'Cash Advance Request',
            );
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
            claimType={'cash_advance_request'}
            claimTitleId={drawerTitle}
            claimStatus={currentStatus?.status}
          />
        </div>
      </div>
    </>
  );

  return (
    <div className='cash-advance-request-container'>
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
            item='cash_advance_request'
            onApplyFilters={onApplyFilters}
            onResetFilters={() => {
              localFilters = {};
              _fetchRecords(source, 1, localFilters, pageSize);
              history.push(location.pathname);
            }}
            includeEmpoyeeList
            includeItemNumber
            initialFilters={localFilters}
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
          getContainer='.cash-advance-request-container'
          className='request-detail-drawer'
        >
          <ErrorBoundary>
            <RequestDetails requestId={currentStatus?.id as number} />
          </ErrorBoundary>
        </AppDrawer>
      </ErrorBoundary>
    </div>
  );
};

const mapStateToProps = (state: any) => ({
  cashAdvanceRequests: getCashAdvanceRequestReports(state),
  isLoading: getReportLoader(state),
  success: getReportSuccess(state),
  savedFilters: getCashAdvanceFilters(state),
  reportCount: getReportCount(state),
});

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  _fetchRecords: (
    source: any,
    page: number,
    filters?: any,
    pageSize?: number,
  ) =>
    dispatch(
      fetchReportTabData(
        'cash_advance_request',
        source,
        page,
        filters,
        pageSize,
      ),
    ),
  _fetchWorkFlowData: (props: IfetchWorkFlowDataProps) =>
    dispatch(fetchWorkFlowData(props)),
  _fetchWorkFlowDataForPDFPrint: (id: any, type: any) =>
    dispatch(fetchWorkFlowDataForPDFPrint(id, type)),
  _exportReport: (source: any, filters: any) =>
    dispatch(exportReport('cash_advance_request', source, filters)),
  _downloadReports: () => dispatch(fetchExportedDownloadList()),
});

const connector = connect(mapStateToProps, mapDispatchToProps);
export default connector(memo(CashAdvanceRequestReport));
