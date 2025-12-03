/* eslint-disable react-hooks/exhaustive-deps */
import React, { Dispatch, useEffect } from 'react';

import {
  HeaderBarWrapper,
  SkeletonItem,
  ErrorBoundary,
} from '../../../shared/components';
import {
  getSFIntegrationStages,
  getSFIntegrationLoader,
  getSFIntegrationLoadingMessage,
  getCurrentJob,
} from '../../../shared/redux/rootReducer';
import { fetchStagesByJobId } from '../sfIntegration.thunk';
import { connect, ConnectedProps } from 'react-redux';

import './jobTimeline.index.less';
import { useParams } from 'react-router-dom';
import { Timeline, Button, message } from 'antd';
import { appPath } from '../../app/app.routes';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { IFileDetails } from '../sfIntegration.model';

import { timeZoneMomentDate } from '../../../utils/global.utils';
import { Trans } from '@lingui/macro';

const returnTrueIcon = () => <CheckCircleOutlined style={{ color: 'green' }} />;
const returnFalseIcon = () => <CloseCircleOutlined style={{ color: 'red' }} />;

const JobTimeline: React.FC<ConnectedProps<typeof connector>> = ({
  _fetchLogsById,
  isLoader,
  loadingMessage,
  stages,
  currentJob,
}) => {
  const params: any = useParams();
  const jobId = params.id;
  useEffect(() => {
    _fetchLogsById(jobId);
  }, [jobId]);

  useEffect(() => {
    if (isLoader && loadingMessage) {
      message.loading(loadingMessage);
    } else {
      message.destroy();
    }
  }, [isLoader, loadingMessage]);

  const currentJobTimeTaken = () => {
    let timeTaken = currentJob.time_taken;

    var m = Math.floor((timeTaken % 3600) / 60);
    var s = Math.floor((timeTaken % 3600) % 60);

    var mDisplay = m < 9 ? '0' + m : m;
    var sDisplay = s < 9 ? '0' + s : s;
    return `${mDisplay}:${sDisplay}`;
  };

  const renderTimeline = () => {
    if (isLoader) {
      return <SkeletonItem type='Form' />;
    }
    if (stages && Object.keys(stages).length > 0) {
      try {
        const {
          CONNECTION,
          FILE_DECRYPTION,
          FILE_AVAILABLE,
          FILE_IMPORTED,
          FILE_PROCESSING,
        } = stages;

        const timeline = (
          <Timeline mode='left' className='timeline'>
            <Timeline.Item
              color={CONNECTION.is_success ? 'green' : 'red'}
              label={String(
                timeZoneMomentDate(CONNECTION.created_on).format(
                  'DD/MM/YYYY HH:mm:ss',
                ),
              )}
            >
              <div className='stage-heading'>
                <Trans>Connection</Trans>
              </div>
              <div className='stage-details'>
                {CONNECTION.is_success
                  ? 'Connected to the SFTP server'
                  : `Error: ${CONNECTION.exception_msg}`}
              </div>
            </Timeline.Item>

            {FILE_AVAILABLE && Object.keys(FILE_AVAILABLE) && (
              <Timeline.Item label=' ' position='left'>
                <div className='stage-heading'>
                  <Trans>Checking File Availability</Trans>
                </div>
                <div className='stage-details'>
                  {Object.keys(FILE_AVAILABLE).map(key => (
                    <NewFileItem
                      key={key}
                      file_type={key}
                      {...FILE_AVAILABLE[key]}
                    />
                  ))}
                </div>
              </Timeline.Item>
            )}

            {FILE_IMPORTED && Object.keys(FILE_IMPORTED) && (
              <Timeline.Item label=' ' position='left'>
                <div className='stage-heading'>
                  <Trans>Importing Files</Trans>
                </div>
                <div className='stage-details'>
                  {Object.keys(FILE_IMPORTED).map(key => (
                    <NewFileItem
                      key={key}
                      file_type={key}
                      {...FILE_IMPORTED[key]}
                    />
                  ))}
                </div>
              </Timeline.Item>
            )}
            {FILE_DECRYPTION && Object.keys(FILE_DECRYPTION) && (
              <Timeline.Item label=' ' position='left'>
                <div className='stage-heading'>Decrypting Files</div>
                <div className='stage-details'>
                  {Object.keys(FILE_DECRYPTION).map(key => (
                    <NewFileItem
                      key={key}
                      file_type={key}
                      {...FILE_DECRYPTION[key]}
                    />
                  ))}
                </div>
              </Timeline.Item>
            )}
            {FILE_PROCESSING && Object.keys(FILE_PROCESSING) && (
              <Timeline.Item label=' ' position='left'>
                <div className='stage-heading'>
                  <Trans>Processing Files</Trans>
                </div>
                <div className='stage-details'>
                  {Object.keys(FILE_PROCESSING).map(key => (
                    <NewFileItem
                      key={key}
                      file_type={key}
                      {...FILE_PROCESSING[key]}
                      jobId={jobId}
                    />
                  ))}
                </div>
              </Timeline.Item>
            )}

            {/* {FILE_AVAILABLE && Object.keys(FILE_AVAILABLE) && (
              <Timeline.Item label=' ' position='left'>
                <div className='stage-heading'>Checking File Availability</div>
                <div className='stage-details'>
                  {Object.keys(FILE_AVAILABLE).map(key => (
                    <FileItem key={key} {...FILE_AVAILABLE[key]} />
                  ))}
                </div>
              </Timeline.Item>
            )} */}

            {/* {FILE_IMPORTED && Object.keys(FILE_IMPORTED) && (
              <Timeline.Item label=' ' position='left'>
                <div className='stage-heading'>Importing Files</div>
                <div className='stage-details'>
                  {Object.keys(FILE_IMPORTED).map(key => (
                    <FileItem key={key} {...FILE_IMPORTED[key]} />
                  ))}
                </div>
              </Timeline.Item>
            )} */}

            {/* {FILE_PROCESSING && Object.keys(FILE_PROCESSING) && (
              <Timeline.Item label=' ' position='left'>
                <div className='stage-heading'>Processing Files</div>
                <div className='stage-details'>
                  {Object.keys(FILE_PROCESSING).map(key => (
                    <FileItem
                      key={key}
                      {...FILE_PROCESSING[key]}
                      jobId={jobId}
                    />
                  ))}
                </div>
              </Timeline.Item>
            )} */}

            <Timeline.Item
              color={currentJob.status === 'COMPLETED' ? 'green' : 'blue'}
              label={String(
                timeZoneMomentDate(currentJob.completed_on).format(
                  'DD/MM/YYYY HH:mm:ss',
                ),
              )}
            >
              <div className='stage-heading'>
                <Trans>Job Status</Trans>
              </div>
              <div className='stage-details'>
                {currentJob.status === 'COMPLETED'
                  ? `Job completed (Total time taken: ${currentJobTimeTaken()})`
                  : `Job is running`}
              </div>
            </Timeline.Item>
          </Timeline>
        );

        return timeline;
      } catch (e) {}
    }
  };

  return (
    <ErrorBoundary>
      <HeaderBarWrapper
        headerCommonProps={{ title: <Trans>SF Integration</Trans> }}
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
        {/* <Row gutter={12} style={{ paddingBottom: '24px' }}>
          <Col>
            <BackButton
              backBtnUrl={`${appPath.settings.sfIntegration.linkTo}stages`}
            />
          </Col>
          <Col>
            <div>Past Job Execution Listing</div>
          </Col>
          <Col>
            <div style={{ fontWeight: 'bold' }}>
              Job Execution History - ({jobId})
            </div>
          </Col>
        </Row> */}

        <div className='timeline-container'>{renderTimeline()}</div>
      </HeaderBarWrapper>
    </ErrorBoundary>
  );
};

const mapStateToProps = (state: any) => {
  return {
    stages: getSFIntegrationStages(state),
    isLoader: getSFIntegrationLoader(state),
    loadingMessage: getSFIntegrationLoadingMessage(state),
    currentJob: getCurrentJob(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  _fetchLogsById: (id: string) => dispatch(fetchStagesByJobId(id)),
});

const connector = connect(mapStateToProps, mapDispatchToProps);
export default connector(JobTimeline);

const NewFileItem: React.FC<any> = ({
  files,
  file_summary,
  file_type,
  jobId,
}) => {
  const fileMap: any = {
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
  return (
    <>
      <div
        style={{
          marginTop: '12px',
          textDecoration: 'underline',
          fontWeight: 'bold',
        }}
      >
        For {fileMap[file_type]}:
      </div>
      {files.map((fileName: any, index: number) => {
        const { stage, message } = file_summary[fileName];
        return (
          <div style={{ marginLeft: '24px' }}>
            <div>File {index + 1}: &nbsp;</div>
            {fileName}
            {stage === 'FILE_DECRYPTION' && <div> - {message}</div>}
            <FileItem key={index} {...file_summary[fileName]} jobId={jobId} />
          </div>
        );
      })}
    </>
  );
};

const FileItem: React.FC<IFileDetails> = ({
  created_on,
  exception_msg,
  is_success,
  model_to_map,
  file_name,
  stage,
  row_summary,
  jobId,
  message,
}) => {
  const fetchLog = (
    jobId: any,
    successStatus: any,
    fileName: any,
    fileType: any,
  ) => {
    let url = appPath.settings.sfIntegration.logs.linkTo;
    url = url.replace(':id', jobId);
    url = url.replace(':fileType', fileType);
    url = url.replace(':file', fileName);
    url = url.replace(':successStatus', successStatus);
    // url = `${url}?fileType=${fileType}`;
    window.open(url);
  };

  // const fileMap: any = {
  //   EMPPER: 'Employee basic information',
  //   EMPJOB: 'Employee job information',
  //   COMPAN: 'Company',
  //   BUSUNT: 'Business unit',
  //   BUSASO: 'Business unit association',
  //   DIVISN: 'Division',
  //   DIVASO: 'Division association',
  //   DEPTMT: 'Department',
  //   DEPASO: 'Department association',
  //   COSCEN: 'Cost centre',
  //   CCRASO: 'Cost centre association',
  //   EMPBNK: 'Employee bank information',
  //   PETMGR: 'Petty cash manager',
  //   PETBUD: 'Petty cash manager budget',
  //   JBRLTS: 'Employee job relationship',
  // };

  const stageMessageMap: any = {
    FILE_AVAILABLE: {
      success: 'File available',
      fail: 'File not available',
    },
    FILE_IMPORTED: {
      success: 'File imported',
      fail: 'File cannot be imported',
    },
    FILE_DECRYPTION: {
      success:
        message === 'File decryption - File not encrypted.'
          ? 'File processed'
          : 'File decrypted',
      fail: 'File cannot be decrypted',
    },
    FILE_PROCESSING: {
      success: 'File processed',
      fail: 'File processing failed',
    },
  };

  let totalRowCount = 0;
  let successCount = 0;
  let failureCount = 0;
  try {
    totalRowCount = row_summary.success_count + row_summary.failure_count;
    successCount = row_summary.success_count;
    failureCount = row_summary.failure_count;
  } catch (error) {
    totalRowCount = 0;
    successCount = 0;
    failureCount = 0;
  }

  return (
    <div style={{ marginTop: 0 }}>
      {is_success ? returnTrueIcon() : returnFalseIcon()}

      <span
        style={{ marginLeft: 12 }}
        title={
          [
            'FILE_AVAILABLE',
            'FILE_IMPORTED',
            'FILE_DECRYPTION',
            'FILE_PROCESSING',
          ]
            ? `File name: ${file_name}`
            : ''
        }
      >
        {/* {`${fileMap[model_to_map]} `} */}
        {is_success
          ? `${stageMessageMap[stage].success}`
          : `${stageMessageMap[stage].fail}`}
      </span>

      {['FILE_AVAILABLE', 'FILE_IMPORTED', 'FILE_DECRYPTION'].includes(
        stage,
      ) && (
        <div style={{ marginLeft: '26px' }}>
          {is_success ? `` : `Exception message: ${exception_msg}`}
        </div>
      )}

      {stage === 'FILE_PROCESSING' && (
        <div style={{ marginLeft: '26px' }}>
          {totalRowCount > 0 && (
            <div>
              {totalRowCount} {totalRowCount >= 2 ? 'rows ' : 'row '}
              processed <br />
              <Button
                type='link'
                onClick={() =>
                  fetchLog(jobId, 'success', file_name, model_to_map)
                }
              >
                {successCount === totalRowCount ? 'All' : successCount} rows
                passed. View Logs
              </Button>
              {failureCount > 0 && (
                <Button
                  type='link'
                  danger
                  onClick={() =>
                    fetchLog(jobId, 'failure', file_name, model_to_map)
                  }
                >
                  {failureCount} rows failed. View Logs
                </Button>
              )}
            </div>
          )}

          {totalRowCount === 0 && <div>No data in this file</div>}
        </div>
      )}
    </div>
  );
};
