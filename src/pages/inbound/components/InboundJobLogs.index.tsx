import { Trans } from '@lingui/macro';
import { Table } from 'antd';
import React, { Dispatch, useEffect } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  ElementOrSkeleton,
  HeaderBarWrapper,
} from '../../../shared/components';
import { getInboundJobLogData } from '../inbound.thunk';

const InboundJobLogs: React.FC<ConnectedProps<typeof connector>> = ({
  _getInboundJobLogData,
  inboundJobLogData,
  inboundJobLogLoading,
}) => {
  const params: any = useParams();
  const jobId = params.id;
  const fileType = params.file;
  const successStatus = params.successStatus;

  useEffect(() => {
    _getInboundJobLogData(jobId, successStatus === 'success' ? true : false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columnsTrue = [
    {
      dataIndex: 'row_index',
      title: <Trans>Row Number</Trans>,
      align: 'center' as 'center',
      render: (val: any) => val,
    },
    {
      dataIndex: 'message',
      title: <Trans>Message</Trans>,
      align: 'center' as 'center',
      width: 200,
      render: (val: any) => val,
    },
    {
      dataIndex: 'row_data',
      title: <Trans>Rate</Trans>,
      align: 'center' as 'center',
      render: (val: any) => val.rate,
    },
    {
      dataIndex: 'row_data',
      title: <Trans>Multiplier</Trans>,
      align: 'center' as 'center',
      render: (val: any) => val.multiplier,
    },
    {
      dataIndex: 'row_data',
      title: <Trans>Base Currency</Trans>,
      align: 'center' as 'center',
      render: (val: any) => val.base_currency,
    },
    {
      dataIndex: 'row_data',
      title: <Trans>Effective From</Trans>,
      align: 'center' as 'center',
      width: 150,
      render: (val: any) => val.effective_from,
    },
    {
      dataIndex: 'row_data',
      title: <Trans>Target Currency</Trans>,
      align: 'center' as 'center',
      render: (val: any) => val.target_currency,
    },
  ];

  const columnsFalse = [
    {
      dataIndex: 'row_index',
      title: <Trans>Row Number</Trans>,
      align: 'center' as 'center',
      render: (val: any) => val,
    },
    {
      dataIndex: 'message',
      title: <Trans>Message</Trans>,
      align: 'center' as 'center',
      width: 200,
      render: (val: any) => val,
    },
    {
      dataIndex: 'validation_errors',
      title: <Trans>Validation Errors</Trans>,
      width: 400,
      render: (val: any) => {
        const objectKeys = Object.keys(val);
        return objectKeys.map((o, i) => {
          return <div>{`Head ${i + 1} -> ${val[o].msg}`}</div>;
        });
      },
    },
    {
      dataIndex: 'row_data',
      title: <Trans>Rate</Trans>,
      align: 'center' as 'center',
      render: (val: any) => val.rate,
    },
    {
      dataIndex: 'row_data',
      title: <Trans>Multiplier</Trans>,
      align: 'center' as 'center',
      render: (val: any) => val.multiplier,
    },
    {
      dataIndex: 'row_data',
      title: <Trans>Base Currency</Trans>,
      align: 'center' as 'center',
      render: (val: any) => val.base_currency,
    },
    {
      dataIndex: 'row_data',
      title: <Trans>Effective From</Trans>,
      align: 'center' as 'center',
      width: 150,
      render: (val: any) => val.effective_from,
    },
    {
      dataIndex: 'row_data',
      title: <Trans>Target Currency</Trans>,
      align: 'center' as 'center',
      render: (val: any) => val.target_currency,
    },
  ];

  return (
    <HeaderBarWrapper
      headerCommonProps={{ title: <Trans>Inbound</Trans> }}
      breadcrumbCompVisibility={true}
      breadcrumbCompProps={{
        enableBackBtn: false,
        breadcrumProps: {
          routes: [
            { breadcrumbName: 'Past Job Execution Listing', path: '' },
            {
              breadcrumbName: `Rows Logs - Job ID: ${jobId} - ${fileType} file - ${
                successStatus === 'success' ? 'Success' : 'Failed'
              } logs`,
              path: '',
            },
          ],
        },
      }}
    >
      {inboundJobLogLoading ? (
        <ElementOrSkeleton isLoading={inboundJobLogLoading} type='table' />
      ) : (
        <div>
          <Table
            dataSource={inboundJobLogData}
            columns={successStatus === 'success' ? columnsTrue : columnsFalse}
            bordered
            pagination={{ hideOnSinglePage: true }}
            scroll={{ x: 1200 }}
          />
        </div>
      )}
    </HeaderBarWrapper>
  );
};

const mapStateToProps = (state: any) => ({
  inboundJobLogData: state.inbound.inboundJobLogData,
  inboundJobLogLoading: state.inbound.inboundJobLogLoading,
});

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  _getInboundJobLogData: (jobId: any, successStatus: boolean) =>
    dispatch(getInboundJobLogData(jobId, successStatus)),
});

const connector = connect(mapStateToProps, mapDispatchToProps);
export default connector(InboundJobLogs);
