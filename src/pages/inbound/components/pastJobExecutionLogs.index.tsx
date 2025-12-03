import { Trans } from '@lingui/macro';
import { Button, Timeline } from 'antd';
import React, { Dispatch, useEffect } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useParams } from 'react-router-dom';
import { HeaderBarWrapper } from '../../../shared/components';
import { timeZoneMomentDate } from '../../../utils/global.utils';
import { appPath } from '../../app/app.routes';
import { listPastExecutionJobData } from '../inbound.thunk';
import { renderTimeTaken } from './pastJobExecution.index';
import './pastJobExecutionLogs.index.less';

const PastJobExecutionLogs: React.FC<ConnectedProps<typeof connector>> = ({
  _fetchListOfPastJobExecutionData,
  pastJobExecutionData,
  // loadingPastJobExecutionData,
}) => {
  const params: any = useParams();
  const jobId = (params as any)?.id;

  useEffect(() => {
    _fetchListOfPastJobExecutionData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId]);

  const renderTimeline = () => {
    const result = pastJobExecutionData.data?.map((o: any) => {
      if (o.id === Number(jobId)) {
        let totalRowCount = 0;
        let successCount = 0;
        let failureCount = 0;
        if (o.logs.FILE_PROCESSING) {
          totalRowCount =
            o.logs.FILE_PROCESSING.CURCON.row_summary.failure_count +
            o.logs.FILE_PROCESSING.CURCON.row_summary.success_count;
          successCount =
            o.logs.FILE_PROCESSING.CURCON.row_summary.success_count;
          failureCount =
            o.logs.FILE_PROCESSING.CURCON.row_summary.failure_count;
        }

        const fetchLog = (jobId: any, file: any, successStatus: any) => {
          let url = appPath.settings.inbound.logs.linkTo;
          url = url.replace(':id', jobId);
          url = url.replace(':file', file);
          url = url.replace(':successStatus', successStatus);
          window.open(url);
        };

        const timeline = (
          <Timeline mode='left' className='past-job-execution-timeline'>
            <Timeline.Item
              color={o.logs.CONNECTION.is_success ? 'green' : 'red'}
              label={String(
                timeZoneMomentDate(o.started_on).format('DD/MM/YYYY HH:mm:ss'),
              )}
            >
              <div className='stage-heading'>
                <Trans>Connection</Trans>
              </div>
              <div className='stage-details'>
                {o.logs.CONNECTION.is_success
                  ? o.logs.CONNECTION.message
                  : o.logs.CONNECTION.exception_msg}
              </div>
            </Timeline.Item>

            {o.logs.FILE_AVAILABLE && (
              <Timeline.Item label=' ' position='left'>
                <div className='stage-heading'>
                  <Trans>Checking File Availability</Trans>
                </div>
                <div className='stage-details'>
                  {o.logs.FILE_AVAILABLE.CURCON.message}
                </div>
              </Timeline.Item>
            )}

            {o.logs.FILE_IMPORTED && (
              <Timeline.Item label=' ' position='left'>
                <div className='stage-heading'>
                  <Trans>Importing Files</Trans>
                </div>
                <div className='stage-details'>
                  {o.logs.FILE_IMPORTED.CURCON.message}
                </div>
              </Timeline.Item>
            )}

            {o.logs.FILE_PROCESSING && (
              <Timeline.Item label=' ' position='left'>
                <div className='stage-heading'>
                  <Trans>Processing Files</Trans>
                </div>
                <div className='stage-details'>
                  {o.logs.FILE_PROCESSING.CURCON.message}
                  {totalRowCount > 0 && (
                    <div>
                      {`${totalRowCount} 
                      ${totalRowCount >= 2 ? 'rows' : 'row'} processed`}
                      <br />
                      <Button
                        type='link'
                        onClick={() =>
                          fetchLog(
                            jobId,
                            o.logs.FILE_PROCESSING.CURCON.model_to_map,
                            'success',
                          )
                        }
                      >
                        {successCount === totalRowCount ? 'All' : successCount}{' '}
                        <Trans>rows passed. View Logs</Trans>
                      </Button>
                      <br />
                      {failureCount > 0 && (
                        <Button
                          type='link'
                          danger={true}
                          onClick={() =>
                            fetchLog(
                              jobId,
                              o.logs.FILE_PROCESSING.CURCON.model_to_map,
                              'failure',
                            )
                          }
                        >
                          {failureCount} <Trans>rows failed. View Logs</Trans>
                        </Button>
                      )}
                    </div>
                  )}
                  {totalRowCount === 0 && (
                    <div>
                      <Trans>No data in this file</Trans>
                    </div>
                  )}
                </div>
              </Timeline.Item>
            )}

            {o.logs.FILE_ARCHIVED && (
              <Timeline.Item label=' ' position='left'>
                <div className='stage-heading'>
                  <Trans>Archiving Files</Trans>
                </div>
                <div className='stage-details'>
                  {o.logs.FILE_ARCHIVED.CURCON.message}
                </div>
              </Timeline.Item>
            )}

            <Timeline.Item
              color={o.completed_on !== null ? 'green' : 'blue'}
              label={String(
                timeZoneMomentDate(o.completed_on).format(
                  'DD/MM/YYYY HH:mm:ss',
                ),
              )}
            >
              <div className='stage-heading'>
                <Trans>Job Status</Trans>
              </div>
              <div className='stage-details'>
                {o.completed_on !== null
                  ? `Job completed (Total time taken: ${renderTimeTaken(o)})`
                  : `Job is running`}
              </div>
            </Timeline.Item>
          </Timeline>
        );
        return timeline;
      } else return null;
    });

    return result;
  };

  return (
    <HeaderBarWrapper
      headerCommonProps={{ title: <Trans>Inbound</Trans> }}
      breadcrumbCompVisibility={true}
      breadcrumbCompProps={{
        enableBackBtn: true,
        breadcrumProps: {
          routes: [
            { breadcrumbName: 'Past Job Execution Listing', path: '' },
            {
              breadcrumbName: `Job Execution History - (${jobId})`,
              path: '',
            },
          ],
        },
      }}
    >
      <div className='inbound-past-job-execution-logs-container'>
        {renderTimeline()}
      </div>
    </HeaderBarWrapper>
  );
};

const mapStateToProps = (state: any) => ({
  pastJobExecutionData: state.inbound.pastJobExecutionData,
  loadingPastJobExecutionData: state.inbound.loadingPastJobExecutionData,
});

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  _fetchListOfPastJobExecutionData: () => dispatch(listPastExecutionJobData()),
});

export const connector = connect(mapStateToProps, mapDispatchToProps);
export default connector(PastJobExecutionLogs);
