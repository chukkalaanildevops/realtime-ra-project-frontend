import { Trans } from '@lingui/macro';
import { Pagination, Table, Tag, Button } from 'antd';
import React, { useEffect, useState } from 'react';
import { Dispatch } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { DotMenu, ElementOrSkeleton } from '../../../shared/components';
import { useTableFilters } from '../../../shared/hooks';
import { timeZoneMomentDate } from '../../../utils/global.utils';
import { appPath } from '../../app/app.routes';
import { downloadLogs, listPastExecutionJobData } from '../inbound.thunk';
import {
  EditOutlined,
  EllipsisOutlined,
  DownloadOutlined,
} from '@ant-design/icons';

let initialPageSize = 25;

const PastJobExecution: React.FC<ConnectedProps<typeof connector>> = ({
  _fetchListOfPastJobExecutionData,
  _downlaodLogs,
  pastJobExecutionData,
  loadingPastJobExecutionData,
}) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  useEffect(() => {
    _fetchListOfPastJobExecutionData(1, pageSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    getDateSortFilterProps,
    getNumberSortFilterProps,
    // getCheckBoxFilterProps,
  } = useTableFilters();

  const history = useHistory();

  const onClickCheckLogs = (e: any, id: any) => {
    e.preventDefault();
    history.push(`${appPath.settings.inbound.stages.linkTo}${id}`);
  };

  const onClickDownloadLogs = (e: any, id: any, status: String) => {
    e.preventDefault();
    _downlaodLogs(id, status);
  };

  const renderCheckLogs = (item: any) => {
    return (
      <DotMenu
        showInMenu
        actionBtn={[
          {
            Type: 'link',
            icon: EditOutlined,
            children: <Trans>Check Logs</Trans>,
            title: <Trans>Check Logs</Trans>,
            OnClick: (e: any) => onClickCheckLogs(e, item.id),
          },
          {
            Type: 'link',
            icon: DownloadOutlined,
            children: <Trans>File</Trans>,
            title: <Trans>Logs</Trans>,
            Disabled: item.file_name !== null ? false : true,
            OnClick: (e: any) => onClickDownloadLogs(e, item.id, 'false'),
          },
          {
            Type: 'link',
            icon: DownloadOutlined,
            children: <Trans>Error File</Trans>,
            title: <Trans>Error Logs</Trans>,
            Disabled: item.error_file_name !== null ? false : true,
            OnClick: (e: any) => onClickDownloadLogs(e, item.id, 'true'),
          },
        ]}
      >
        <EllipsisOutlined />
      </DotMenu>
    );
  };

  const columns = [
    {
      dataIndex: 'id',
      title: <Trans>Job Id</Trans>,
      align: 'center' as 'center',
      render: (val: any) => val,
      ...getNumberSortFilterProps('id'),
    },
    {
      dataIndex: 'started_on',
      title: <Trans>Execution Started On</Trans>,
      render: (val: any) =>
        String(timeZoneMomentDate(val).format('DD/MM/YYYY HH:mm:ss')),
      ...getDateSortFilterProps('started_on'),
    },
    {
      dataIndex: 'triggered_by',
      title: <Trans>Triggered By</Trans>,
      render: (item: any) => (item !== null ? item.legal_name : 'System'),
    },
    {
      dataIndex: '',
      title: <Trans>Time Taken</Trans>,
      align: 'center' as 'center',
      render: (item: any) => renderTimeTaken(item),
    },
    {
      dataIndex: 'category',
      title: <Trans>File Name</Trans>,
      render: (item: any) => item.title,
    },
    {
      dataIndex: 'completed_on',
      title: <Trans>Status</Trans>,
      align: 'center' as 'center',
      render: (val: any) =>
        val !== null ? (
          <Tag color='success'>
            <Trans>Completed</Trans>
          </Tag>
        ) : (
          <Tag color='processing'>
            <Trans>Running</Trans>
          </Tag>
        ),
    },
    {
      dataIndex: '',
      title: <Trans>Action</Trans>,
      align: 'center' as 'center',
      render: (item: any) => renderCheckLogs(item),
    },
  ];

  const changePage = (page: any, pageSize: any) => {
    _fetchListOfPastJobExecutionData(page, pageSize);
  };

  const tableData = (
    <>
      <Table
        dataSource={pastJobExecutionData.data}
        columns={columns}
        bordered
        pagination={false}
        scroll={{ x: 1200 }}
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
          current={currentPage}
          onChange={(pageNumber: any, pageSize: any) => {
            changePage(pageNumber, pageSize);
            setCurrentPage(pageNumber);
          }}
          hideOnSinglePage={false}
          pageSizeOptions={['10', '20', '25', '50', '100']}
          pageSize={pageSize || 25}
          showSizeChanger={true}
          onShowSizeChange={(_current: number, size: number) => {
            setPageSize(size);
          }}
          total={pastJobExecutionData?.pagination_data?.total_records}
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

  return loadingPastJobExecutionData ? (
    <ElementOrSkeleton isLoading={loadingPastJobExecutionData} type='table' />
  ) : (
    tableData
  );
};

export const renderTimeTaken = (item: any) => {
  const sMinutes = timeZoneMomentDate(item.started_on).minutes();
  const cMinutes = timeZoneMomentDate(item.completed_on).minutes();
  const sSeconds = timeZoneMomentDate(item.started_on).seconds();
  const cSeconds = timeZoneMomentDate(item.completed_on).seconds();

  let sTotal;
  let mTotal;

  if (cSeconds - sSeconds < 0) {
    sTotal = 60 - (cSeconds - sSeconds);
    mTotal = cMinutes - sMinutes - 1;
  } else {
    sTotal = cSeconds - sSeconds;
    mTotal = cMinutes - sMinutes;
  }

  let mDisplay = mTotal < 9 ? '0' + mTotal : mTotal;
  let sDisplay = sTotal < 9 ? '0' + sTotal : sTotal;

  return `${mDisplay} : ${sDisplay}`;
};

const mapStateToProps = (state: any) => ({
  pastJobExecutionData: state.inbound.pastJobExecutionData,
  loadingPastJobExecutionData: state.inbound.loadingPastJobExecutionData,
});

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  _fetchListOfPastJobExecutionData: (pageNumber: number, pageSize?: any) =>
    dispatch(listPastExecutionJobData(pageNumber, pageSize)),
  _downlaodLogs: (id: any, status: String) =>
    dispatch(downloadLogs(id, status)),
});

export const connector = connect(mapStateToProps, mapDispatchToProps);
export default connector(PastJobExecution);
