import { Trans } from '@lingui/macro';
import { Select } from 'antd';
import React from 'react';

const ScheduleDetails: React.FC<{ item: any }> = ({ item }) => {
  const isOneTimePayment =
    item?.category?.code === 'EOTP' || item?.category?.code === 'BOTP';

  return (
    <div className='transaction-item-detail'>
      {isOneTimePayment ? (
        <div className='field'>
          <div className='label' title='Fields to Post'>
            <Trans>Fields to Post</Trans>
          </div>
          <div className='value'>
            <Select
              defaultValue={Object.values(item?.label_mapping).map(
                (item: any) => item.default,
              )}
              disabled={true}
              mode='multiple'
              style={{ width: '100%' }}
            >
              {Object.values(item?.label_mapping).map(
                (item: any, index: number) => (
                  <Select.Option
                    value={item.default}
                    key={index}
                    disabled={Boolean(item?.is_mandatory)}
                  >
                    {item.default}
                  </Select.Option>
                ),
              )}
            </Select>
          </div>
        </div>
      ) : (
        <>
          {item?.data_push_directory && (
            <div className='field'>
              <div className='label' title='Data Push Directory'>
                <Trans>Data Push Directory</Trans>
              </div>
              <div className='value'>{item?.data_push_directory}</div>
            </div>
          )}
          {item?.data_pull_directory && (
            <div className='field'>
              <div className='label' title='Data Pull Directory'>
                <Trans>Data Pull Directory</Trans>
              </div>
              <div className='value'>{item?.data_pull_directory}</div>
            </div>
          )}
          <div className='field'>
            <div className='label' title='Archive Directory'>
              <Trans>Archive Directory</Trans>
            </div>
            <div className='value'>{item?.archive_directory}</div>
          </div>
          <div className='field'>
            <div className='label' title='FTP Server'>
              <Trans>FTP Server</Trans>
            </div>
            <div className='value'>
              {item?.ftp_configuration?.ip_address ||
                item?.ftp_configuration?.hostname}
            </div>
          </div>
        </>
      )}
      <div className='field'>
        <div className='label' title='Days to run(Comma separated)'>
          {`When To Run ${
            item?.when_to_run?.code === 'EVERDAY'
              ? ''
              : `(${item?.when_to_run?.title})`
          }`}
        </div>
        <div className='value'>
          {(function() {
            if (item?.when_to_run?.code === 'DAYMNTH')
              return item?.days_to_run?.join(' , ') || ' - ';
            else if (item?.when_to_run?.code === 'DAYWEEK')
              return item?.days_of_week_to_run?.join(' , ') || ' - ';
            else if (item?.when_to_run?.code === 'EVERDAY')
              return item?.when_to_run?.code || ' - ';
            else return '-';
          })()}
        </div>
      </div>
      <div className='field'>
        <div className='label' title='Time'>
          <Trans>Time</Trans>
        </div>
        <div className='value'>{item?.time_to_run}</div>
      </div>
      <div className='field'>
        <div className='label' title='Date Format'>
          <Trans>Date Format</Trans>
        </div>
        <div className='value'>{item?.date_format?.code}</div>
      </div>
      {item?.file_format && (
        <div className='field'>
          <div className='label' title='File Format'>
            <Trans>File Format</Trans>
          </div>
          <div className='value'>{item?.file_format?.file_format?.title}</div>
        </div>
      )}
      {!isOneTimePayment && (
        <div className='field'>
          <div className='label' title='Delimiter'>
            <Trans>Delimiter</Trans>
          </div>
          <div className='value'>{item?.delimiter?.code}</div>
        </div>
      )}
      <div className='field'>
        <div className='label' title='Split File By'>
          <Trans>Split File By</Trans>
        </div>
        <div className='value'>
          {item?.file_split_by?.display_text
            ? item?.file_split_by?.display_text
            : '-'}
        </div>
      </div>
      <div className='field'>
        <div
          className='label'
          title='Recipients
'
        >
          <Trans>Recipients</Trans>
        </div>
        <div className='detail'>
          {item?.recipients?.map((record: any) => (
            <div className='value fit-content' style={{ marginTop: 8 }}>
              {record}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScheduleDetails;
