/* eslint-disable react-hooks/exhaustive-deps */

import React, { Dispatch, useEffect, useState } from 'react';
import { Table, Skeleton, Button } from 'antd';
import { useParams } from 'react-router-dom';
import {
  HeaderBarWrapper,
  ErrorBoundary,
  NoData,
} from '../../../shared/components';
import { fetchLogsByFileName } from '../sfIntegration.thunk';
import { connect, ConnectedProps } from 'react-redux';
import {
  getSFIntegrationLoader,
  getSFIntegrationFileJobs,
} from '../../../shared/redux/rootReducer';
import './jobLogs.index.less';

import {
  fetchRowSuccessLogs,
  fetchRowFailureLogs,
} from '../../../services/sfIntegration';
import { Trans } from '@lingui/macro';
const JobLogs: React.FC<ConnectedProps<typeof connector>> = ({
  isLoader,
  // _fetchLogsById,
  // logs,
}) => {
  const [columns, setColumns] = useState<any[]>([]);
  const [rowData, setRowData] = useState<any[]>([]);
  const [paginationData, setPaginationData] = useState<any>();
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);

  const params: any = useParams();
  const jobId = params.id;
  const fileType = params.fileType;
  const fileName = params.file;
  const successStatus = params.successStatus;

  const fileNameMap: any = {
    EMPPER: 'Employee basic information',
    EMPJOB: 'Employee job information',
    COMPAN: 'Company',
    BUSUNT: 'Business unit',
    BUSASO: 'Business unit association',
    DIVISN: 'Division',
    DIVASO: 'Division association',
    DEPTMT: 'Department',
    DEPASO: 'Department association',
    COSCEN: 'Cost centre',
    CCRASO: 'Cost centre association',
    EMPBNK: 'Employee bank information',
    PETMGR: 'Petty cash manager',
    PETBUD: 'Petty cash manager budget',
    JBRLTS: 'Employee job relationship',
    EMPDEP: 'Employee dependent information',
    JBRLT2: 'Employee job relationship2',
  };

  const fetchSuccessLogs = async (
    jobId: string,
    fileType: string,
    fileName: string,
    page: number,
  ) => {
    const response = await fetchRowSuccessLogs(jobId, fileType, fileName, page);
    setIsLoadingMore(false);
    const data = response.data.data;

    if (page === 1 && data.length > 0) {
      const firstRow = data[0].row_data;
      let rowHeaders = Object.keys(firstRow);
      rowHeaders.unshift('Row Status');
      rowHeaders.unshift('Row Number');
      const cols = rowHeaders.map((item: any) => {
        return {
          key: item,
          dataIndex: item,
          title: () => getElemOrSkeleton(item),
          render: getElemOrSkeleton,
        };
      });
      setColumns(cols);
    }

    const rows = data.map((item: any) => {
      const rowStatus = item.message.startsWith('CREATED')
        ? 'CREATED'
        : 'UPDATED';

      return {
        'Row Number': item.row_index,
        'Row Status': rowStatus,
        ...item.row_data,
      };
    });

    setPaginationData(response.data.pagination_data);

    if (page === 1) {
      setRowData(rows);
    } else {
      setRowData([...rowData, ...rows]);
    }
  };

  const fetchFailureLogs = async (
    jobId: string,
    fileType: string,
    fileName: string,
    page: number,
  ) => {
    const response = await fetchRowFailureLogs(jobId, fileType, fileName, page);
    setIsLoadingMore(false);
    const data = response.data.data;
    // setRowData(data);

    if (page === 1 && data.length > 0) {
      const firstRow = data[0].row_data;
      let rowHeaders = Object.keys(firstRow);
      rowHeaders.unshift('Validation Errors');
      rowHeaders.unshift('Exception Message');
      rowHeaders.unshift('Error Type');
      rowHeaders.unshift('Row Number');
      const cols = rowHeaders.map((item: any) => {
        return {
          key: item,
          dataIndex: item,
          title: () => getElemOrSkeleton(item),
          render: getElemOrSkeleton,
        };
      });
      setColumns(cols);
    }

    const rows = data.map((item: any) => {
      let validationErrors = '';
      let errorType = 'ERROR';
      let exceptionMsg = '-';

      if (item.message.startsWith('ERROR CREATING')) {
        errorType = 'CREATION ERROR';
        exceptionMsg = item.exception_msg;
      } else if (item.message.startsWith('ERROR CLEANING')) {
        errorType = 'CLEANING ERROR';
        exceptionMsg = item.exception_msg;
      } else if (item.message.startsWith('ERROR VALIDATING')) {
        errorType = 'VALIDATION ERROR';

        for (const field_name of Object.keys(item.validation_errors)) {
          const error_item = item.validation_errors[field_name];
          const validationError = `${field_name} - ${error_item.msg}`;
          if (validationErrors !== '') {
            validationErrors += `, `;
          }
          validationErrors += `${validationError}`;
        }
      } else {
        exceptionMsg = item.exception_msg ? item.exception_msg : '-';
      }

      return {
        'Row Number': item.row_index,
        'Error Type': errorType,
        'Exception Message': exceptionMsg,
        'Validation Errors': validationErrors ? validationErrors : '-',
        ...item.row_data,
      };
    });

    setPaginationData(response.data.pagination_data);

    if (page === 1) {
      setRowData(rows);
    } else {
      setRowData([...rowData, ...rows]);
    }
  };

  const loadMoreRows = () => {
    if (paginationData) {
      const nextPage = paginationData.next_page;
      setIsLoadingMore(true);
      if (successStatus === 'success') {
        fetchSuccessLogs(jobId, fileType, fileName, nextPage);
      } else if (successStatus === 'failure') {
        fetchFailureLogs(jobId, fileType, fileName, nextPage);
      }
    }
  };

  useEffect(() => {
    const page = 1;
    if (successStatus === 'success') {
      fetchSuccessLogs(jobId, fileType, fileName, page);
    } else if (successStatus === 'failure') {
      fetchFailureLogs(jobId, fileType, fileName, page);
    }
  }, [jobId]);

  const getElemOrSkeleton = (_text: string, _record?: any, _index?: number) => {
    return isLoader ? <Skeleton.Input size='small' active={isLoader} /> : _text;
  };

  return (
    <ErrorBoundary>
      <HeaderBarWrapper
        headerCommonProps={{ title: <Trans>SF Integration</Trans> }}
        breadcrumbCompVisibility={true}
        breadcrumbCompProps={{
          enableBackBtn: false,
          breadcrumProps: {
            routes: [
              { breadcrumbName: 'Past Job Execution Listing', path: '' },
              {
                breadcrumbName: `Rows Logs - Job ID: ${jobId} - ${
                  fileNameMap[fileType]
                } file (${fileName}) - ${
                  successStatus === 'success' ? 'Success' : 'Failed'
                } logs`,
                path: '',
              },
            ],
          },
        }}
      >
        <div className='check-logs-listing-container'>
          {/* <br /> */}
          {/* {JSON.stringify(columns, null, 2)} */}
          {/* <br /> */}
          {/* {JSON.stringify(paginationData, null, 2)} */}
          {/* <br /> */}
          {/* {JSON.stringify(rowData, null, 2)} */}
          {rowData?.length === 0 ? (
            <NoData />
          ) : (
            <>
              <div style={{ width: '100%' }}>
                <Table
                  style={{ overflowX: 'auto' }}
                  bordered
                  // dataSource={isLoader ? new Array(10).fill({}) : rowData}
                  dataSource={rowData}
                  columns={columns}
                  pagination={{
                    total: rowData.length,
                    pageSize: rowData.length,
                    hideOnSinglePage: true,
                  }}
                />
              </div>
              <br />
              {paginationData && paginationData.next_page !== null && (
                <>
                  {isLoadingMore ? (
                    <div>Loading ...</div>
                  ) : (
                    <Button type='link' onClick={() => loadMoreRows()}>
                      Load More ({paginationData.total_records - rowData.length}{' '}
                      rows remaining)
                    </Button>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </HeaderBarWrapper>
    </ErrorBoundary>
  );
};

const mapStateToProps = (state: any) => {
  return {
    logs: getSFIntegrationFileJobs(state),
    isLoader: getSFIntegrationLoader(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  _fetchLogsById: (jobId: string, modelName: string) =>
    dispatch(fetchLogsByFileName(jobId, modelName)),
});

const connector = connect(mapStateToProps, mapDispatchToProps);
export default connector(JobLogs);
