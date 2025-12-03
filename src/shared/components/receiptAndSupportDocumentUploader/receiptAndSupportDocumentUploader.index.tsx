import React, {
  FC,
  memo,
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from 'react';
import {
  Upload,
  Modal,
  Button,
  Form,
  Dropdown,
  Menu,
  message,
  Space,
} from 'antd';
import { RcFile, UploadProps } from 'antd/lib/upload/interface';
import {
  DragOutlined,
  PlusOutlined,
  UploadOutlined,
  // FolderOpenOutlined,
  PaperClipOutlined,
  DeleteOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import './receiptAndSupportDocumentUploader.index.less';
import { IFileState } from './receiptAndSupportDocumentUploader.model';
import { Trans } from '@lingui/macro';
import { DownloadButton, ErrorBoundary, PDFViewer } from '../';
import ReceiptGallery from '../../../pages/receipt/receiptGallery/receiptGallery.index';
import { isPdfFile } from '../../../utils/global.utils';
import { IReceipt } from '../../../pages/receipt/receipt.model';
import { destroy, error } from '../responcePopUp/responcePopUp';
import Loader from '../loader/loader.index';

/**
 * `ReceiptAndSupportDocumentUploader` ::
 * 1) ReceiptComponent::
 * Support 1 file(image or pdf). Add, Preview, delete functionality.
 * NOTE::PDF preview is not supported.
 * 2) Support Document:: Form.Item Component
 * Support Multiple File (.png, .jpeg, .pdf). Add, Preview(in new tab), delete Functionality
 *
 * In this we are saving fields data in fomr instance using setFieldsValue.
 * NOTE:: Don't use form's `onValuesChange` to store data in redux or perform some action...
 *        Because after calling form.setFieldValue the onValueChnge of form does not occure.
 *        If you want to do some thing on change you can pass fuction inside `onReceiptChange` OR `supportingDocumentOnChange`
 */
const ReceiptAndSupportDocumentUploader: FC<any> = forwardRef(
  (props, ref?: any) => {
    const {
      formProps = {},
      formType = '',
      currencies = [],
      showReceiptComponent = false,
      uploadIcon = <DragOutlined style={{ color: '#1890FF' }} />,
      dragReceiptHereText = <Trans>Drag Receipt Here</Trans>,
      uploadText = <Trans>Upload</Trans>,
      // openSavedReceiptsText =  <Trans>Open Saved Receipts</Trans>
      modelTitle = <Trans>Receipt</Trans>,
      selectedReceipt, // Use this to replace uploaded receipt state
      receiptFormItemProps = {},
      extraUploadProps = {},
      onReceiptChange, //This function will act as onchange for receipt uploader
      showSupportingDocument = false,
      supportingDocuments, // Use this to replace uploaded supported doc inner state
      supportingDocumentFormItemProps = {},
      supportingDocumentOnChange, //This function will act as onchange for supported doc uploader
      form,
      backendError = {},
      disableSupportingDoc = false,
      userFieldsForReceiptGallery = undefined,
      receiptGallarySelection = undefined,
      receiptDisabledFields = undefined,
      isReceiptAllowed = true,
      _scanImage,
      scanLoader,
      detailPage = false,
      is_enabled_ocr,
      ocrReceivedFromGallary,
      confidence,
      warning_msg,
    } = props;

    const [getImagesList, setImagesList] = useState<IFileState[]>([]);
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
    const [getSupportingDoc, setSupportingDoc] = useState<(File | string)[]>(
      [],
    );

    const isImgAndPdf = (type: string): boolean => {
      const condition = Boolean(
        type === 'image/jpeg' ||
          type === 'image/png' ||
          type === 'image/jpg' ||
          type === 'application/pdf' ||
          type === 'image/jfif',
      );

      if (!condition) message.error('Unsupported file type', 2);

      return condition;
    };

    const commonUploadProps: UploadProps = {
      beforeUpload: (file: RcFile) => {
        if (isImgAndPdf(file.type)) {
          const _sR: any = selectedReceipt?.length
            ? [...selectedReceipt, file]
            : [file];
          setImagesList(returnFileList(_sR));
          onReceiptChange && onReceiptChange(_sR);
          setFormFieldValue('receipt', _sR);
          is_enabled_ocr && _scanImage(_sR);
        }
        return false;
      },
      multiple: false,
      // accept: '.png, .jpeg, .jpg, .pdf',
      disabled: getImagesList.length > 1,
    };

    const onReceiptGalleryPick = (_file: IReceipt[], keysArr?: string[]) => {
      const changedCurr = currencies.filter(
        (o: any) => o.id === Number(_file[0].currency?.id),
      );

      if (
        changedCurr.length !== 0 ||
        formType === 'MIL' ||
        formType === 'ALW'
      ) {
        const file: [string | File] = [_file[0].file];
        setImagesList(returnFileList(file));
        onReceiptChange && onReceiptChange(file);
        setFormFieldValue('receipt', file);

        receiptGallarySelection &&
          receiptGallarySelection(_file[0], keysArr || []);
      } else {
        destroy();
        error('Currency not present in the list');
      }
    };

    /**
     * This function modifies string or file object passed as props...
     * and returns new object same as the file object.
     * @param arr
     */
    const returnFileList = (arr: any[]) => {
      // debugger;

      const returnArr = arr.map((o: any, i: number) => ({
        uid: String(i),
        name: o?.name || o,
        status: undefined,
        type: o?.type || '',
        size: typeof o !== 'string' ? o.size : 0,
        url:
          typeof o === 'string'
            ? o
            : o.url
            ? window.URL.createObjectURL(o.file)
            : typeof o.file === 'string'
            ? o.file
            : window.URL.createObjectURL(o),
        file: o,
      }));
      return returnArr;
    };

    /**
     * On click of eye icon this function occure.
     * Store data needed to preview file.
     * @param file
     */
    const onPreview = (file: IFileState) => {
      setViewImage({
        fileName: file.name,
        url: file.url as string,
        modalVisibility: true,
        file: file.file,
      });
    };

    /**
     * removes uploaded receipt from state.
     */
    const onRemove = () => {
      setImagesList([]);
      onReceiptChange && onReceiptChange([]);
      setFormFieldValue('receipt', []);
      ocrReceivedFromGallary && ocrReceivedFromGallary();
    };

    useImperativeHandle(ref, () => ({
      resetReceipt() {
        onRemove();
      },
    }));
    /**
     * This function handle onClick on `open saved receipt`
     * No functionality.
     */
    // const handleFolderOpenClick = () => {
    // alert('WIP');
    // };

    // supporting documents.
    /**
     * This function acts as a onchange event of supporting document upload component.
     * Checks file. If find any duplicate file throw message error. else stores in state.
     * @param _file - here only FIle object is expecting to get.
     */
    const handleSupportingDocumentBeforUpload = (_file: RcFile) => {
      if (isImgAndPdf(_file.type)) {
        let sortedFileArray: any[] = [_file];
        let filteredArr = [];
        const sortedArrFileName =
          sortedFileArray[0].file_name || sortedFileArray[0].name;
        getSupportingDoc.forEach((o: string | File | any) => {
          if (typeof o === 'string') {
            if (o.match(sortedArrFileName) !== null) filteredArr.push(o);
          } else {
            if ((o?.file_name || o.name) === sortedArrFileName)
              filteredArr.push(o);
          }
        }); //Duplicate file check
        if (filteredArr.length > 0) {
          message.error(
            'The support document already contains a uploaded file name ' +
              sortedArrFileName,
            3,
          );
          sortedFileArray = [];
        }
        setSupportingDoc(prevDoc => {
          const newState = [...prevDoc, ...sortedFileArray];
          return newState;
        });
      }

      return false;
    };

    /**
     * This occure on click of delete button in supported doc list.
     *  This function removes files from supportingdoc state.
     * @param _file - this para can be string or file object.
     */
    const handleSupportDocRemove = (_file: string | File | any) => {
      let filteredprevDoc: (string | File)[] = getSupportingDoc;
      const condition = (key: string, o: any): boolean => {
        const condition1 = o[key] === _file?.file_name;
        const condition2 = o[key] === _file?.name;
        return condition1 || condition2;
      };

      filteredprevDoc = getSupportingDoc.filter((o: any) => {
        if (o?.file_name) {
          return !condition('file_name', o);
        } else if (o?.name) {
          return !condition('name', o);
        } else {
          console.error(
            'None of the above condition passed. Code needs to be modify',
          );
        }
        return true;
      });
      setSupportingDoc(filteredprevDoc);
    };

    const setFormFieldValue = (key: string, value: any) => {
      const fieldObj: any = {};
      fieldObj[key] = value;
      form && form.setFieldsValue(fieldObj);
    };

    const _selectedReceipt_EffectFN = () => {
      const val = selectedReceipt || [];
      setImagesList(returnFileList(val));
      setFormFieldValue('receipt', val);
    };
    useEffect(_selectedReceipt_EffectFN, [selectedReceipt]); // This Effect to store props receipts data in state.

    const _supportingDocuments_EffectFN = () => {
      let debounce;
      clearTimeout(debounce);
      debounce = setTimeout(() => {
        if (
          JSON.stringify(getSupportingDoc) !==
          JSON.stringify(supportingDocuments)
        ) {
          setSupportingDoc(
            supportingDocuments?.length ? supportingDocuments : [],
          );
        }
      }, 100);
    };
    useEffect(_supportingDocuments_EffectFN, [supportingDocuments]); // This Effect to store props supportingDocument data in state.

    const _getSupportingDoc_EffectFN = () => {
      if (
        JSON.stringify(getSupportingDoc) !== JSON.stringify(supportingDocuments)
      ) {
        supportingDocumentOnChange &&
          supportingDocumentOnChange(getSupportingDoc);
        setFormFieldValue('supporting_documents', getSupportingDoc);
      }
    };
    useEffect(_getSupportingDoc_EffectFN, [getSupportingDoc]); // sending uploaded support files to parent component

    const componentDidMount = () => {
      return componentWillUnmount;
    };
    const componentWillUnmount = () => {
      message.destroy();
    };
    useEffect(componentDidMount, []); //This is componentDidMount & ComponentWillUnmount Effect.

    const handleImagePreviewCancelClick = () => {
      setViewImage({
        fileName: '',
        url: '',
        modalVisibility: false,
        file: '',
      });
    };

    const handleSupportedDocRemoveClick = (o: File | string) => {
      handleSupportDocRemove(o);
    };

    const _isPdfFile = (file: File | string): boolean => isPdfFile(file || '');
    return (
      <ErrorBoundary>
        <div className='form-receipt-container'>
          <Form {...formProps}>
            {/* <div className='title-container'>{title}</div> */}
            <ErrorBoundary>
              {showReceiptComponent ? (
                <Form.Item
                  label={<Trans>Receipt</Trans>}
                  validateTrigger='onBlur'
                  trigger=''
                  validateStatus={
                    backendError.hasOwnProperty('receipt')
                      ? 'error'
                      : 'validating'
                  }
                  help={
                    backendError.hasOwnProperty('receipt')
                      ? backendError.receipt[0]
                      : null
                  }
                  style={{ maxWidth: '350px' }}
                  {...receiptFormItemProps}
                  name='receipt'
                  className='receipt'
                >
                  {scanLoader && is_enabled_ocr ? (
                    <Loader loadingName='Scanning...' />
                  ) : (
                    <>
                      {Boolean(confidence !== null) && (
                        <>
                          {Boolean(confidence === 0) && (
                            <div
                              style={{
                                marginBottom: '8px',
                                color: '#FAAD14',
                                textAlign: 'center',
                              }}
                            >
                              {warning_msg}
                            </div>
                          )}

                          {Boolean(confidence !== 0) &&
                            Boolean(confidence <= 50) && (
                              <>
                                <div
                                  style={{
                                    marginBottom: '8px',
                                    color: '#0090FF',
                                    textAlign: 'center',
                                  }}
                                >
                                  Confidence: {confidence} %
                                </div>
                                <div
                                  style={{
                                    marginBottom: '8px',
                                    color: '#FAAD14',
                                    textAlign: 'center',
                                  }}
                                >
                                  {warning_msg}
                                </div>{' '}
                              </>
                            )}
                          {Boolean(confidence > 50) && (
                            <div
                              style={{
                                marginBottom: '8px',
                                color: '#0090FF',
                                textAlign: 'center',
                              }}
                            >
                              Confidence: {confidence} %
                            </div>
                          )}
                        </>
                      )}

                      <div
                        className={`preview-upload-container ${
                          getImagesList.length < 1 ? `no-images` : ``
                        }`}
                      >
                        <Upload.Dragger
                          listType='picture-card'
                          openFileDialogOnClick={false}
                          fileList={getImagesList as any}
                          // onPreview={onPreview}
                          // onRemove={onRemove}
                          showUploadList={false}
                          {...commonUploadProps}
                          {...extraUploadProps}
                        >
                          {
                            <>
                              {detailPage ? (
                                getImagesList.length === 0 && (
                                  <div>
                                    <Trans>No Receipt Attached</Trans>{' '}
                                  </div>
                                )
                              ) : (
                                <>
                                  <p className='ant-upload-drag-icon'>
                                    {uploadIcon}
                                  </p>
                                  <p className='ant-upload-text'>
                                    {dragReceiptHereText}
                                  </p>
                                  <p className='ant-or-text'>OR</p>
                                  <Space
                                    align='center'
                                    direction='vertical'
                                    size='large'
                                  >
                                    <div className='upload-button-container'>
                                      <Upload
                                        className='upload-button'
                                        showUploadList={false}
                                        {...commonUploadProps}
                                        {...extraUploadProps}
                                      >
                                        <Button>{uploadText}</Button>
                                      </Upload>

                                      {isReceiptAllowed && (
                                        <ReceiptGallery
                                          docType='Receipt'
                                          onSelection={onReceiptGalleryPick}
                                          // pickMode='single'
                                          buttonProps={{
                                            className:
                                              'open-save-receipt-button',
                                            block: false,
                                          }}
                                          userFieldsForReceiptGallery={
                                            userFieldsForReceiptGallery
                                          }
                                          disabledFields={receiptDisabledFields}
                                        />
                                      )}
                                    </div>
                                    <p className='ant-upload-hint'>
                                      <Trans>Format</Trans> : JPG , JPEG , PNG ,
                                      JFIF , PDF <br />{' '}
                                      <Trans>Maximum File Size</Trans> : 20 MB
                                    </p>
                                  </Space>
                                </>
                              )}
                            </>
                          }
                        </Upload.Dragger>
                        {/* Image & PDF Preview inside upload */}
                        {Boolean(getImagesList.length > 0) && (
                          <div className='inner-preview'>
                            <div className='file-conatiner'>
                              {_isPdfFile(getImagesList[0]?.file) ? (
                                <PDFViewer
                                  file={getImagesList[0]?.file}
                                  // pageProps={{ height: 360 }}
                                  // showPagination={false}
                                  showPdfIcon={true}
                                />
                              ) : (
                                <img
                                  alt='Receipt'
                                  src={getImagesList[0]?.url}
                                />
                              )}
                            </div>
                            <div className='action-btn-container'>
                              <Button
                                className='preview-upload'
                                type='link'
                                onClick={onPreview.bind(null, getImagesList[0])}
                              >
                                <EyeOutlined />
                              </Button>
                              {!Boolean(extraUploadProps.disabled) && (
                                <Button
                                  className='remove-upload'
                                  type='link'
                                  onClick={onRemove}
                                >
                                  <DeleteOutlined />
                                </Button>
                              )}
                              {false ? (
                                <DownloadButton
                                  file={getImagesList[0] as any}
                                  fileCat='receipt'
                                />
                              ) : null}
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </Form.Item>
              ) : null}
            </ErrorBoundary>
            <ErrorBoundary>
              {showSupportingDocument ? (
                <Form.Item
                  label={<Trans>Suppporting Documents</Trans>}
                  validateTrigger='onBlur'
                  validateStatus={
                    backendError.hasOwnProperty('supporting_documents')
                      ? 'error'
                      : 'validating'
                  }
                  help={
                    backendError.hasOwnProperty('supporting_documents')
                      ? backendError.supporting_documents[0]
                      : null
                  }
                  style={{ maxWidth: '350px' }}
                  {...supportingDocumentFormItemProps}
                  name='supporting_documents'
                  className='supporting-documents'
                >
                  {!detailPage && (
                    <Dropdown
                      disabled={disableSupportingDoc}
                      trigger={['click']}
                      overlayClassName='supporting-documents-dropdown'
                      overlay={
                        <Menu>
                          <Menu.Item key='upload'>
                            <Upload
                              beforeUpload={handleSupportingDocumentBeforUpload}
                              multiple={true}
                              showUploadList={false}
                              //accept='.png, .jpeg, .jpg, .pdf, .jfif'
                              className='support-doc-upload'
                            >
                              <Button block className='support-doc-menu-btn'>
                                <UploadOutlined /> {uploadText}
                              </Button>
                            </Upload>
                          </Menu.Item>

                          {/* <Menu.Item key='openSavedReceipts'>
                        <ReceiptGallery
                          docType='Receipt'
                          // onSelection={onDocumentSelection}
                          pickMode='single'
                          buttonProps={{
                            type: 'default',
                            block: true,
                            className: 'support-doc-menu-btn',
                          }}
                        />
                      </Menu.Item> */}
                        </Menu>
                      }
                    >
                      <Button type='link' disabled={disableSupportingDoc}>
                        <PlusOutlined /> <Trans>Add More</Trans>
                      </Button>
                    </Dropdown>
                  )}
                </Form.Item>
              ) : null}
            </ErrorBoundary>
          </Form>
          <ErrorBoundary>
            <div className='supporting-doc-uploaded-list'>
              {getSupportingDoc.map((o: File | string, i: number) => {
                return (
                  <div className='file-info' key={`file_${i}`}>
                    <span className='file-icon'>
                      <PaperClipOutlined />
                    </span>
                    <span
                      className='file-name'
                      title={
                        typeof o === 'string'
                          ? o
                          : o.hasOwnProperty('attachment')
                          ? (o as any)?.file_name || ''
                          : o.name
                      }
                    >
                      <a
                        href={
                          typeof o === 'string'
                            ? o
                            : o.hasOwnProperty('attachment')
                            ? (o as any)?.attachment || ''
                            : window.URL.createObjectURL(o)
                        }
                        target='blank'
                      >
                        {typeof o === 'string'
                          ? o
                          : o.hasOwnProperty('attachment')
                          ? (o as any)?.file_name || ''
                          : o.name}
                      </a>
                    </span>
                    {!detailPage && (
                      <Button
                        disabled={disableSupportingDoc}
                        className='file-delete'
                        type='link'
                        icon={<DeleteOutlined />}
                        onClick={handleSupportedDocRemoveClick.bind(null, o)}
                      ></Button>
                    )}
                  </div>
                );
              })}
            </div>
          </ErrorBoundary>
          <ErrorBoundary>
            <Modal
              className='image-previewer-model'
              visible={getViewImage.modalVisibility}
              title={modelTitle}
              // title={modelTitle || getViewImage.fileName}
              footer={null}
              centered={true}
              getContainer='.form-receipt-container'
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
        </div>
      </ErrorBoundary>
    );
  },
);

export default memo(ReceiptAndSupportDocumentUploader);
