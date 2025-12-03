/* eslint-disable react-hooks/exhaustive-deps */
import React, { Dispatch, useEffect } from 'react';
import { Button, Modal } from 'antd';
// import { tabs } from '../../reports.model';
import { fetchExportedDownloadList, downloadReport } from '../../reports.thunk';
import { connect, ConnectedProps } from 'react-redux';
import { getDownloadedReportsList } from '../../../../shared/redux/rootReducer';
import { saveDownloadedReportsList } from '../../reports.action';
import { FileExcelOutlined, DownloadOutlined } from '@ant-design/icons';
import { timeZoneMomentDate } from '../../../../utils/global.utils';
import { Trans } from '@lingui/macro';

const LoadMore: React.FC<ConnectedProps<typeof connector>> = ({
  _downloadReports,
  _resetDownloadedReports,
  _download,
  reportList,
}) => {
  useEffect(() => {
    let timeout: any;
    if (reportList.length > 0) {
      timeout = setTimeout(_downloadReports, 5000);
    } else {
      clearTimeout(timeout);
    }

    return () => clearTimeout(timeout);
  }, [reportList]);
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: 12 }}>
      <Modal
        visible={Boolean(reportList.length)}
        closable
        footer={null}
        onCancel={_resetDownloadedReports}
        className='download-modal'
        getContainer='.reports-container'
        title={`Downloads . ${reportList.length}`}
      >
        {reportList.map(item => (
          <DownloadItem item={item} onDownload={_download} />
        ))}
      </Modal>
    </div>
  );
};

const mapStateToDispatch = (dispatch: Dispatch<any>) => ({
  _downloadReports: () => dispatch(fetchExportedDownloadList()),
  _resetDownloadedReports: () => dispatch(saveDownloadedReportsList([])),
  _download: (reportId: number, fileName: string) =>
    dispatch(downloadReport(reportId, fileName)),
});

const mapStateToProp = (state: any) => ({
  reportList: getDownloadedReportsList(state),
});
const connector = connect(mapStateToProp, mapStateToDispatch);

export default connector(LoadMore);

const DownloadItem = ({ item, onDownload }: { item: any; onDownload: any }) => {
  const downloadReport = () => {
    if (item.specialized_report !== null) {
      onDownload(item.id, item.file.file_name);
    } else {
      let tokens = item.file.file_name.split('.');
      if (tokens.length === 1) {
        onDownload(item.id, `${item.file.file_name}.xlsx`);
      } else {
        onDownload(item.id, item.file.file_name);
      }
    }
  };
  return (
    <div className='download-item'>
      <div className='icon-div'>
        <FileExcelOutlined
          className={item.status.code === 'FAILD' ? 'icon failed' : 'icon'}
        />
      </div>
      <div className={`container ${item.status.code}`}>
        <div className='file-name'>
          {item.status.code === 'CMLTD'
            ? item.file.file_name || 'Filename'
            : item.report_type.title}
        </div>
        <div className='timestamp'>
          {item.status.code === 'CMLTD'
            ? timeZoneMomentDate(item.generated_on)
                .format('DD MMM YY : HH:mm')
                .replace(':', 'at')
            : timeZoneMomentDate(item.created_on)
                .format('DD MMM YY : HH:mm')
                .replace(':', 'at')}
        </div>
      </div>
      <div className='status-container'>
        {item.status.code === 'CMLTD' ? (
          <Button
            type='link'
            shape='round'
            // size='large'
            className='CMLTD'
            icon={<DownloadOutlined />}
            onClick={downloadReport}
          >
            <Trans>Download</Trans>
          </Button>
        ) : (
          <Button className={item.status.code} shape='round'>
            {item.status.title}
          </Button>
        )}
      </div>
    </div>
  );
};
