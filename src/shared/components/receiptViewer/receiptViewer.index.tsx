import React, { Dispatch, memo, useState } from 'react';
import { Carousel, Modal, Button, message } from 'antd';
import './receiptViewer.index.less';
import { PaperClipOutlined } from '@ant-design/icons';
import { isBackEndReceiptOrSupportingDocObject } from '../../../utils/global.utils';
import { fetchReceipts } from '../../../pages/app/app.thunk';

import { DownloadButton, Loader } from '..';
import { connect, ConnectedProps } from 'react-redux';

const ReceiptViewer: React.FC<{
  itemId?: number;
  itemType: any;
  itemNumber: string;
  count: any;
} & ConnectedProps<typeof connector>> = props => {
  const { itemId, itemType, itemNumber, count, _fetchReceipts } = props;
  const [receiptData, setReceiptData] = useState<any | undefined>([]);
  const [isViewerVisible, setIsViewerVisible] = useState(false);
  const [receiptLoader, setReceiptLoader] = useState<boolean>(false);
  let typeOfDownload: any = 'expense';
  const getModalTitle = () => {
    switch (itemType) {
      case 'expense-claims':
        typeOfDownload = 'expense';
        return 'Expense Claim No. #' + itemNumber;
      case 'requests':
        typeOfDownload = 'request';
        return 'Request No. #' + itemNumber;
      case 'benefit-claim':
        typeOfDownload = 'benefit';
        return 'Benefit Claim. #' + itemNumber;
      case 'receipt':
        return 'Receipt';
      case 'supportingDocuments':
        return 'Supporting Documents';
      default:
        break;
    }
  };

  const documentIconClick = () => {
    setReceiptLoader(true);
    _fetchReceipts(itemType, itemId, (records: any, error: any) => {
      message.destroy();
      if (error) {
        message.error(error);
        setReceiptLoader(false);
      } else {
        if (itemType === 'requests') {
          const newRecords = getAttachmentData(records);
          setReceiptData(newRecords);
        } else {
          setReceiptData(records);
        }
        setReceiptLoader(false);
      }
    });
  };
  const getAttachmentData = (item: any) => {
    let attachments: any[] = [];
    // eslint-disable-next-line no-unused-expressions
    item.hotel_accommodations?.forEach((hotel: any) => {
      if (hotel.attachment) {
        attachments.push({
          file_name: hotel.attachment_title || 'Attachment',
          attachment: hotel.attachment,
          file_type:
            hotel.file_type ||
            hotel.attachment.includes('pdf') ||
            hotel.attachment.includes('PDF')
              ? 'pdf'
              : 'png',
          doc_type: 'Hotel Accommodation',
        });
      }
    });

    // eslint-disable-next-line no-unused-expressions
    item.flight_details?.forEach((flight: any) => {
      if (flight.flight_ticket) {
        attachments.push({
          file_name: flight.flight_ticket_title || 'Attachment',
          attachment: flight.flight_ticket,
          file_type:
            flight.file_type ||
            flight.flight_ticket.includes('pdf') ||
            flight.flight_ticket.includes('PDF')
              ? 'pdf'
              : 'png',
          doc_type: 'Flight Details',
        });
      }
    });

    // eslint-disable-next-line no-unused-expressions
    item.additional_documents?.forEach((item: any) => {
      attachments.push({
        file_name: item.file_name || 'Attachment',
        attachment: item.file,
        file_type:
          item.file_type ||
          item.file.includes('pdf') ||
          item.file.includes('PDF')
            ? 'pdf'
            : 'png',
        doc_type: 'Additional',
      });
    });
    item.attachments = attachments;

    return { attachments, receipts: null };
  };
  // const getItemCount = () => {
  //   let allFiles = [];
  //   if (receiptData !== null && receiptData !== undefined) {
  //     if (Array.isArray(receipt)) {
  //       receipt.forEach((rec: any) => {
  //         if (rec !== null) allFiles.push(rec);
  //       });
  //     } else {
  //       allFiles.push(receipt);
  //     }
  //   }

  //   return allFiles.length;
  // };

  const getSlides = () => {
    let allFiles: any = [];
    if (receiptData) {
      if (receiptData?.receipts !== null) {
        if (Array.isArray(receiptData?.receipts)) {
          receiptData.receipts.forEach((rec: any) => {
            if (rec !== null) allFiles.push(rec);
          });
        } else {
          allFiles.push(receiptData?.receipts);
        }
      }
      if (receiptData?.attachments && receiptData?.attachments.length > 0) {
        allFiles = allFiles.concat(receiptData?.attachments);
      }
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
                    attachmentType={typeOfDownload}
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
          pointerEvents: count > 0 ? 'all' : 'none',
        }}
        // disabled={readOnly}
        className='document-count'
        onClick={event => {
          event.stopPropagation();
          setIsViewerVisible(true);
          documentIconClick();
        }}
      >
        <PaperClipOutlined />
        <span className='count'>{count}</span>
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
        {' '}
        {receiptLoader ? (
          <Loader />
        ) : (
          <Carousel
            className='documents-viewer'
            dots={{ className: 'carousel-dots' }}
            dotPosition='bottom'
          >
            {getSlides()}
          </Carousel>
        )}
      </Modal>
    </>
  );
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  _fetchReceipts: (
    type: any,
    id: any,
    callback?: (success?: any, error?: string) => void,
  ) => dispatch(fetchReceipts(type, id, callback)),
});

const connector = connect(null, mapDispatchToProps);
export default connector(memo(ReceiptViewer));
