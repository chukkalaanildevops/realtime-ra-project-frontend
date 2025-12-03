/* eslint-disable react-hooks/exhaustive-deps */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { Dispatch, useEffect, useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { fetchIntegrationJobs } from '../sfIntegration.thunk';
import {
  getSFIntegrationJobs,
  getSFIntegrationLoader,
} from '../../../shared/redux/rootReducer';
import { Table, Tag, Button, Skeleton } from 'antd';
import { useHistory } from 'react-router-dom';
import { appPath } from '../../app/app.routes';
import { NoData } from '../../../shared/components';
import { useTableFilters } from '../../../shared/hooks';

import moment from 'moment';
import { timeZoneMomentDate } from '../../../utils/global.utils';
import Pagination from 'antd/lib/pagination';
import { Trans } from '@lingui/macro';

const PastJobExecution: React.FC<ConnectedProps<typeof connector>> = ({
  integrationJobs,
  isLoader,
  _fetchIntegrationJobs,
}) => {
  const history = useHistory();
  const {
    getDateSortFilterProps,
    getNumberSortFilterProps,
    getCheckBoxFilterProps,
  } = useTableFilters();
  const [page, setPage] = useState(1);
  const [PageSize, setPageSize] = useState(10);
  const jobs: any = isLoader ? new Array(15).fill({}) : integrationJobs;
  const renderTimeTaken = (val: number) => {
    // var h = Math.floor(val / 3600);
    var m = Math.floor((val % 3600) / 60);
    var s = Math.floor((val % 3600) % 60);

    // var hDisplay = h < 9 ? '0' + h : h;

    var mDisplay = m < 9 ? '0' + m : m;

    var sDisplay = s < 9 ? '0' + s : s;
    // return `${hDisplay} : ${mDisplay} : ${sDisplay}`;
    return `${mDisplay} : ${sDisplay}`;
  };

  const renderStatus = (val: string) => {
    if (val === 'COMPLETED') {
      return (
        <Tag color='success'>
          <Trans>Completed</Trans>
        </Tag>
      );
    } else if (val === 'PROCESSING') {
      return (
        <Tag color='processing'>
          <Trans>Processing</Trans>
        </Tag>
      );
    } else if (val === 'RUNNING') {
      return (
        <Tag color='processing'>
          <Trans>Running</Trans>
        </Tag>
      );
    } else if (val === 'FAILED') {
      return (
        <Tag color='error'>
          <Trans>Failed</Trans>
        </Tag>
      );
    } else if (val === 'TIMEDOUT') {
      return (
        <Tag color='error'>
          <Trans>Timed Out</Trans>
        </Tag>
      );
    }
  };

  const checkLogs = (item: any) => {
    history.push(`${appPath.settings.sfIntegration.stages.linkTo}${item.id}`);
  };

  const getElemOrSkeleton = (_text: any, _record?: any, _index?: number) => {
    return isLoader ? <Skeleton.Input size='small' active={isLoader} /> : _text;
  };

  const columns = [
    {
      key: 'id',
      dataIndex: 'id',
      title: () => getElemOrSkeleton(<Trans>Job Id</Trans>),
      render: getElemOrSkeleton,
      ...getNumberSortFilterProps('id'),
    },
    {
      key: 'started_on',
      dataIndex: 'started_on',
      title: () => getElemOrSkeleton(<Trans>Execution Started On</Trans>),
      // render: (val: string) => getElemOrSkeleton(getFormattedDate(val)),
      render: (val: string) =>
        getElemOrSkeleton(
          String(timeZoneMomentDate(val).format('DD/MM/YYYY HH:mm:ss')),
        ),
      ...getDateSortFilterProps('started_on'),
    },
    {
      key: 'triggered_by',
      dataIndex: 'triggered_by',
      title: () => getElemOrSkeleton(<Trans>Triggered By</Trans>),
      render: (item: any) =>
        getElemOrSkeleton(
          item !== null ? item?.legal_name || item?.name : 'System',
        ),
    },
    {
      key: 'time_taken',
      dataIndex: 'time_taken',
      title: () => getElemOrSkeleton(<Trans>Time Taken</Trans>),
      render: (val: number) =>
        isLoader ? getElemOrSkeleton(val?.toString()) : renderTimeTaken(val),
    },
    {
      key: 'files_succeeded',
      dataIndex: 'files_summary',
      title: () => getElemOrSkeleton(<Trans>Successful</Trans>),
      render: (val: any) => getElemOrSkeleton(val?.succeeded_count),
    },
    {
      key: 'files_partially_succeeded',
      dataIndex: 'files_summary',
      title: () => getElemOrSkeleton(<Trans>Processed With Errors</Trans>),
      render: (val: any) => getElemOrSkeleton(val?.partially_succeeded_count),
    },
    {
      key: 'files_failed',
      dataIndex: 'files_summary',
      title: () => getElemOrSkeleton(<Trans>Failed</Trans>),
      render: (val: any) => getElemOrSkeleton(val?.failed_count),
    },
    {
      key: 'status',
      dataIndex: 'status',
      align: 'center' as 'center',
      title: () => getElemOrSkeleton(<Trans>Status</Trans>),
      render: (val: string, item: any) => {
        const startedOn = item.started_on;
        const status = item.status;

        if (status === 'RUNNING') {
          const diffInHours = moment
            .utc()
            .diff(timeZoneMomentDate(startedOn), 'hours');
          if (diffInHours > 2) {
            val = 'TIMEDOUT';
          }
        }
        return isLoader ? getElemOrSkeleton(val) : renderStatus(val);
      },
      ...getCheckBoxFilterProps(
        [
          {
            text: <Trans>Completed</Trans>,
            value: 'COMPLETED',
          },
          {
            text: <Trans>Failed</Trans>,
            value: 'FAILED',
          },
        ],
        'status',
      ),
    },
    {
      key: 'action',
      dataIndex: 'action',
      align: 'center' as 'center',
      title: () => getElemOrSkeleton(<Trans>Action</Trans>),
      render: (_: string, item: any) =>
        isLoader ? (
          <Skeleton.Input active={isLoader} size='small' />
        ) : (
          <Button
            type='link'
            style={{ paddingLeft: 0, paddingRight: 0 }}
            onClick={() => checkLogs(item)}
          >
            <Trans>Check Logs</Trans>
          </Button>
        ),
    },
  ];

  useEffect(() => {
    _fetchIntegrationJobs(page, PageSize);
  }, []);

  useEffect(() => {
    _fetchIntegrationJobs(page, PageSize);
  }, [page, PageSize]);

  return (
    <div>
      {jobs.length === 0 ? (
        <NoData />
      ) : (
        <>
          <Table
            dataSource={jobs.data}
            columns={columns}
            pagination={false}
            bordered
          />
          <div
            style={{
              display: 'flex',
              flexDirection: 'row-reverse',
              marginTop: 12,
            }}
          >
            <Pagination
              defaultCurrent={1}
              current={jobs.current_page}
              onChange={(pageNumber: number) => {
                setPage(pageNumber);
                // changePage(pageNumber, PageSize);
              }}
              hideOnSinglePage={false}
              showSizeChanger={true}
              pageSizeOptions={['10', '15', '25', '50', '100']}
              pageSize={PageSize || 10}
              onShowSizeChange={(_current: number, size: number) => {
                setPageSize(size);
              }}
              total={jobs.pagination_data && jobs.pagination_data.total_records}
              showQuickJumper={{
                goButton: <Button type='default'>Go</Button>,
              }}
            />
          </div>
        </>
      )}
    </div>
  );
};

const mapStateToProps = (state: any) => ({
  integrationJobs: getSFIntegrationJobs(state),
  isLoader: getSFIntegrationLoader(state),
});

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  _fetchIntegrationJobs: (page: number, pageSize: number) =>
    dispatch(fetchIntegrationJobs(page, pageSize)),
});

const connector = connect(mapStateToProps, mapDispatchToProps);
export default connector(PastJobExecution);
