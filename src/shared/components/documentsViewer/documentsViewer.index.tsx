import React, { ReactNode, useState } from 'react';
import { Carousel, Modal, Button } from 'antd';
import './documentsViewer.index.less';
import { PaperClipOutlined } from '@ant-design/icons';
import { isBackEndReceiptOrSupportingDocObject } from '../../../utils/global.utils';
import { DownloadButton } from '..';

const DocumentsViewer: React.FC<{
  itemType:
    | 'expense'
    | 'request'
    | 'benefit'
    | 'receipt'
    | 'supportingDocuments';
  itemNumber: string;
  receipt: { [key: string]: any } | null | { [key: string]: any }[];
  documents: { [key: string]: any }[];
  icon?: ReactNode;
  readOnly?: boolean;
}> = props => {
  const {
    itemType,
    itemNumber,
    receipt,
    documents,
    icon = <PaperClipOutlined />,
    readOnly = false,
  } = props;

  const [isViewerVisible, setIsViewerVisible] = useState(false);

  const getModalTitle = () => {
    switch (itemType) {
      case 'expense':
        return 'Expense Claim No. #' + itemNumber;
      case 'request':
        return 'Request No. #' + itemNumber;
      case 'benefit':
        return 'Benefit Claim. #' + itemNumber;
      case 'receipt':
        return 'Receipt';
      case 'supportingDocuments':
        return 'Supporting Documents';
      default:
        break;
    }
  };

  const getItemCount = () => {
    let allFiles = [];
    if (receipt !== null && receipt !== undefined) {
      if (Array.isArray(receipt)) {
        receipt.forEach((rec: any) => {
          if (rec !== null) allFiles.push(rec);
        });
      } else {
        allFiles.push(receipt);
      }
    }

    if (documents && documents.length > 0) {
      allFiles = allFiles.concat(documents);
    }

    return allFiles.length;
  };

  const getSlides = () => {
    let allFiles = [];

    if (receipt !== null) {
      if (Array.isArray(receipt)) {
        receipt.forEach((rec: any) => {
          if (rec !== null) allFiles.push(rec);
        });
      } else {
        allFiles.push(receipt);
      }
    }

    if (documents && documents.length > 0) {
      allFiles = allFiles.concat(documents);
    }
    let slides = allFiles.map((item: any, index: number) => {
      let isImage = false;
      let isReceipt = item?.hasOwnProperty('receipt_number');
      let isRequestRelatedDocument = item?.hasOwnProperty('doc_type');

      if (!item?.hasOwnProperty('file_type')) {
        return <></>;
      }

      if (
        [
          'png',
          'jpg',
          'jfif',
          'image/jpeg',
          'image/jpg',
          'image/png',
          'image/jfif',
        ].includes(item.file_type?.toLowerCase())
      ) {
        isImage = true;
      }

      let fileName = '';

      if (isReceipt) {
        fileName = `Receipt.${item.receipt_number}`;
      } else if (isRequestRelatedDocument) {
        fileName = `${item.doc_type} Document.${item.file_name}`;
      } else {
        fileName = `Supporting Document.${item.file_name}`;
      }

      if (isImage) {
        return (
          <div className='slide' key={index}>
            <div className='file'>
              <img
                src={isReceipt ? item.file : item.attachment}
                alt='Document'
                className='document'
              />
              <div className='name'>
                {fileName}{' '}
                {isBackEndReceiptOrSupportingDocObject(item) ? (
                  <DownloadButton
                    file={item as any}
                    fileCat={isReceipt ? 'receipt' : 'supportingDoc'}
                    attachmentType={
                      itemType === 'expense' ||
                      itemType === 'request' ||
                      itemType === 'benefit'
                        ? itemType
                        : undefined
                    }
                  />
                ) : null}
              </div>
            </div>
          </div>
        );
      } else {
        return (
          <div className='slide' key={index}>
            <div className={isReceipt ? 'file' : 'file pdf'}>
              <object
                data={isReceipt ? item.file : item.attachment}
                type='application/pdf'
                width='100%'
                height='600'
                className='document'
                aria-label='Document'
              />
              <div className='name'>{fileName}</div>
            </div>
          </div>
        );
      }
    });

    return slides;
  };

  return (
    <>
      <Button
        type='primary'
        style={{
          border: 'none',
          backgroundColor: 'inherit',
          color: 'inherit',
          boxShadow: 'inherit',
          padding: 4,
          pointerEvents: getItemCount() > 0 ? 'all' : 'none',
        }}
        disabled={readOnly}
        className='document-count'
        onClick={event => {
          event.stopPropagation();
          setIsViewerVisible(true);
        }}
      >
        {icon}
        <span className='count'>{getItemCount()}</span>
      </Button>
      <Modal
        title={getModalTitle()}
        width='720'
        footer={null}
        centered={true}
        visible={isViewerVisible}
        className='document-viewer-modal'
        onCancel={() => {
          setIsViewerVisible(false);
        }}
      >
        <Carousel
          className='documents-viewer'
          dots={{ className: 'carousel-dots' }}
          dotPosition='bottom'
        >
          {getSlides()}
        </Carousel>
      </Modal>
    </>
  );
};

export default DocumentsViewer;
