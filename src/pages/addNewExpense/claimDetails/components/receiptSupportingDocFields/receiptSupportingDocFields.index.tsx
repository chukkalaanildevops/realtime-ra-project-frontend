import React, { FC, memo, useState } from 'react';
import {
  DownloadButton,
  ErrorBoundary,
  PDFViewer,
  ReceiptAndSupportDocumentUploader,
} from '../../../../../shared/components';
import { Modal, Button } from 'antd';
import { EyeOutlined, PaperClipOutlined } from '@ant-design/icons';
import { GetFieldStructure } from '..';
import { Iconfiguration } from '../../../addNewExpense.model';
import { GetLabelName } from '../../../components';
import { isPdfFile } from '../../../../../utils/global.utils';
import { Trans } from '@lingui/macro';
import { FormProps } from 'antd/lib/form';
import './receiptSupportingDocFields.index.less';
import JSONData from '../../../addNewExpense.data.json';

const ReceiptSupportingDocFields: FC<{
  configuration: Iconfiguration;
  expenseClaimFetchedData: any;
  isUseForFormPreview?: boolean;
  formProps?: FormProps;
}> = props => {
  const {
    configuration,
    expenseClaimFetchedData,
    isUseForFormPreview,
    formProps,
  } = props;
  const receiptList =
    !isUseForFormPreview && expenseClaimFetchedData.receipt
      ? expenseClaimFetchedData.receipt
      : [];
  const _isPdfFile = (file: File | string): boolean => isPdfFile(file || '');
  const [getViewImage, setViewImage] = useState<{
    fileName: string;
    url: string;
    modalVisibility: boolean;
    file: File | string;
  }>({
    fileName: '',
    url: '',
    modalVisibility: false,
    file: '',
  });

  /**
   * On click of eye icon this function occure.
   * Store data needed to preview file.
   * @param file
   */
  const onPreview = (file: any) => {
    setViewImage({
      fileName: file.file_name,
      url: file.file,
      modalVisibility: true,
      file: file.file,
    });
  };

  const handleImagePreviewCancelClick = () => {
    setViewImage({
      fileName: '',
      url: '',
      modalVisibility: false,
      file: '',
    });
  };

  const getSupportingDoc = expenseClaimFetchedData?.supporting_documents || [];

  return (
    <ErrorBoundary>
      <div className='form-receipt-detail-container'>
        {!isUseForFormPreview ? (
          <>
            {configuration?.can_attach_receipts ? (
              <GetFieldStructure
                lable={
                  <GetLabelName
                    defaultTitle='Receipt'
                    configuration={configuration}
                  />
                }
              >
                <div
                  className={`preview-upload-container ${
                    receiptList?.length < 1 ? `no-images` : ``
                  }`}
                >
                  {/* Image & PDF Preview inside upload */}
                  {Boolean(receiptList?.length > 0) ? (
                    <div className='inner-preview'>
                      <div className='file-conatiner'>
                        {_isPdfFile(receiptList[0]?.file) ? (
                          <PDFViewer
                            file={receiptList[0]?.file}
                            // pageProps={{ height: 360 }}
                            // showPagination={false}
                            showPdfIcon={true}
                          />
                        ) : (
                          <img alt='Receipt' src={receiptList[0]?.file} />
                        )}
                      </div>
                      <div className='action-btn-container'>
                        <Button
                          className='preview-upload'
                          type='link'
                          onClick={onPreview.bind(null, receiptList[0])}
                        >
                          <EyeOutlined />
                        </Button>
                        <DownloadButton
                          file={receiptList[0]}
                          fileCat='receipt'
                        />
                      </div>
                    </div>
                  ) : (
                    <div className='no-receipt'>
                      <Trans>No Receipt Attached</Trans>
                    </div>
                  )}
                </div>
              </GetFieldStructure>
            ) : null}
            {configuration?.is_allow_supporting_documents ? (
              <GetFieldStructure
                lable={
                  <GetLabelName
                    defaultTitle='Supporting Documents'
                    configuration={configuration}
                  />
                }
                hideChild={Boolean(getSupportingDoc.length)}
              >
                <Trans>No Documents Attached</Trans>
              </GetFieldStructure>
            ) : null}
            <ErrorBoundary>
              <div className='supporting-doc-uploaded-list'>
                {Boolean(getSupportingDoc.length)
                  ? getSupportingDoc.map((o: any, i: number) => {
                      return (
                        <div className='file-info' key={`file_${i}`}>
                          <span className='file-icon'>
                            <PaperClipOutlined />
                          </span>
                          <span className='file-name' title={o.file_name}>
                            <a href={o.attachment} target='blank'>
                              {o.file_name}
                            </a>
                          </span>
                        </div>
                      );
                    })
                  : null}
              </div>
            </ErrorBoundary>
            <ErrorBoundary>
              <Modal
                className='image-previewer-model'
                visible={getViewImage.modalVisibility}
                title={<Trans>Receipt</Trans>}
                footer={null}
                centered={true}
                getContainer='.form-receipt-detail-container'
                onCancel={handleImagePreviewCancelClick}
              >
                {_isPdfFile(getViewImage.file) ? (
                  <PDFViewer
                    file={getViewImage.file}
                    // pageProps={{ width: 400 }}
                    showPdfIcon={false}
                  />
                ) : (
                  <img
                    alt={`${getViewImage.fileName} preview`}
                    src={getViewImage.url}
                  />
                )}
              </Modal>
            </ErrorBoundary>
          </>
        ) : (
          <ReceiptAndSupportDocumentUploader
            formProps={formProps}
            showReceiptComponent={configuration?.can_attach_receipts}
            receiptFormItemProps={{
              label: (
                <GetLabelName
                  defaultTitle='Receipt'
                  configuration={configuration}
                />
              ),
              rules: [
                {
                  required: configuration?.is_receipt_mandatory,
                  message:
                    JSONData.vaidationErrors.generalForm.receipt.mandatory,
                },
              ],
            }}
            // extraUploadProps={{
            //   disabled:
            //     formData.general_form.is_no_receipt || viewOnly || isAdminEdit,
            // }}
            // selectedReceipt={formData.general_form.receipt}
            // onReceiptChange={(changeValue: [File | string] | []) =>
            //   _updateFormData('receipt', 'general_form', changeValue)
            // }
            showSupportingDocument={
              configuration?.is_allow_supporting_documents
            }
            supportingDocumentFormItemProps={{
              label: (
                <GetLabelName
                  defaultTitle='Supporting Documents'
                  configuration={configuration}
                />
              ),
            }}
            // supportingDocuments={formData.general_form.supporting_documents}
            // supportingDocumentOnChange={(file: (File | string)[]) =>
            //   _updateFormData('supporting_documents', 'general_form', file)
            // }
          />
        )}
      </div>
    </ErrorBoundary>
  );
};

export default memo(ReceiptSupportingDocFields);
