import React, { FC, memo, ReactNode } from 'react';

import { Button, message } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { ButtonProps } from 'antd/lib/button';
import FileDownload from 'js-file-download';

import axios from '../../../utils/reimAxios.utils';
import { AxiosResponse, AxiosError } from 'axios';

import { IBEReceipt, IBESupportingDocument } from '../../model';
//import { Trans } from '@lingui/macro';

const DownloadButton: FC<{
  file: IBEReceipt | IBESupportingDocument;
  fileCat: 'receipt' | 'supportingDoc';
  attachmentType?: 'expense' | 'request' | 'benefit';
  onSuccessDownload?: Function;
  onFailedDownload?: Function;
  downloadButtonProps?: ButtonProps;
  buttonIcon?: ReactNode;
}> = props => {
  const {
    fileCat,
    file,
    attachmentType = 'expense',
    onSuccessDownload,
    onFailedDownload,
    downloadButtonProps,
    buttonIcon = <DownloadOutlined />,
  } = props;

  const onDownload = () => {
    let url = '/download-attachments/';
    let fileName = '';
    // let fileType = '';
    if (fileCat === 'receipt') {
      url += `${file.id}/?type=${attachmentType}&doc_type=receipt`;
      fileName = file.file_name;
      //   fileType = file.file_type;
    } else if (fileCat === 'supportingDoc') {
      url += `${file.id}/?type=${attachmentType}&doc_type=supp_doc`;
      fileName = (file as IBESupportingDocument).file_name;
      //   fileType = (file as IBESupportingDocument).file_type;
    }
    axios
      .get(url, { responseType: 'blob' })
      .then((res: AxiosResponse) => {
        try {
          FileDownload(res.data, fileName);
          message.success('File Downloaded Successfully');
          onSuccessDownload && onSuccessDownload(res.data);
        } catch (error) {
          message.error('Failed To Download File');
          onFailedDownload && onFailedDownload(error);
        }
      })
      .catch((err: AxiosError) => {
        message.error('Failed To Download File');
        onFailedDownload && onFailedDownload(err);
      });
  };

  return (
    <Button
      className='download-button'
      type='link'
      {...downloadButtonProps}
      title='Download'
      onClick={onDownload}
    >
      {buttonIcon}
    </Button>
  );
};

export default memo(DownloadButton);
