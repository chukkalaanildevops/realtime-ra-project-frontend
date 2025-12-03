import React, { memo, useState } from 'react';
import { Upload, Checkbox, Space } from 'antd';
import { InboxOutlined } from '@ant-design/icons';

import './receiptSelector.index.less';
import { UploadProps } from 'antd/lib/upload';
import { Trans } from '@lingui/macro';

const { Dragger } = Upload;

const ReceiptSelector: React.FC<{
  isReceiptMandatory?: boolean;
  displayNoReceiptAttachedField?: boolean;
  receiptLabel?: any;
} & UploadProps> = ({
  isReceiptMandatory = true,
  displayNoReceiptAttachedField = true,
  receiptLabel = <Trans>Receipt</Trans>,
  ...restProps
}) => {
  const [isNoReceiptChecked, updateNoReceiptChecked] = useState<boolean>(false);
  // const onChangeHandler = (_info: any) => {
  /* const { status } = _info.file;
    if (status !== 'uploading') {
    }
    if (status === 'done') {
      message.success(`${_info.file.name} file uploaded successfully.`);
    } else if (status === 'error') {
      message.error(`${_info.file.name} file upload failed.`);
    } */
  // };
  const noReceiptCheckboxChangeHandler = (event: any) => {
    if (event.target) updateNoReceiptChecked(event.target.checked);
  };
  const mandatory = isReceiptMandatory ? '(Mandatory)' : '';
  return (
    <div className='receipt-container'>
      <div className='receipt-top-container'>
        <label className='receipt-label'>
          {`${receiptLabel} ${mandatory}`}
        </label>

        {displayNoReceiptAttachedField && (
          <Checkbox
            className='no-receipt-checkbox'
            checked={isNoReceiptChecked}
            defaultChecked={isNoReceiptChecked}
            onChange={noReceiptCheckboxChangeHandler}
          >
            <Trans>No Receipt</Trans>
          </Checkbox>
        )}
      </div>
      <div className='dragger-container'>
        <Dragger name='file' multiple={true} {...restProps}>
          <p className='ant-upload-drag-icon'>
            <InboxOutlined />
          </p>
          <p className='ant-upload-text'>
            <Trans>Drag and drop your files</Trans>
          </p>
          <Space direction='vertical' size='middle'>
            <p className='ant-upload-hint'>
              <Trans>Add a file from your computer</Trans>
            </p>
            <p className='ant-upload-hint'>
              <Trans>Format</Trans> : JPG , JPEG , PNG , JFIF , PDF <br />{' '}
              <Trans>Maximum File Size</Trans> : 20 MB
            </p>
          </Space>
        </Dragger>
      </div>
    </div>
  );
};

export default memo(ReceiptSelector);
