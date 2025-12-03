import React, { memo, FC, useState, Dispatch, useEffect } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import {
  stateInterface,
  getUser,
  getCountryCurrencyList,
} from '../../../shared/redux/rootReducer';

import { HeaderBarWrapper } from '../../../shared/components/';
import { Trans } from '@lingui/macro';
import { Upload, Row, Col, message, Space } from 'antd';
import { InboxOutlined } from '@ant-design/icons';

import { IReceipt, IreceiptPostData } from '../receipt.model';
import {
  updateReceiptList,
  resetToInitialReceiptReducer,
  apiCallReset,
  setScanDateAmount,
} from '../receipt.action';
import { createReceipt, fetchLocalCurrency, scanImage } from '../receipt.thunk';

import SingleReceipt from '../components/singleReceipt.index';
import './addReceipt.index.less';
import moment from 'moment';
import { useHistory } from 'react-router-dom';
import { appPath } from '../../app/app.routes';

import { fetchCountryCurrencyList } from '../../setup/component/other/currencyConversion/currencyConversion.thunk';
import { IConfirmationInfo } from '../../app/app.model';
import {
  resetConfirmationInfo,
  setConfirmationInfo,
} from '../../app/app.actions';

const mapStateToProps = (state: stateInterface) => {
  const {
    receiptList,
    localCurrency,
    isLoading,
    success,
    error,
    info,
    scanLoader,
    scannedAmount,
    scannedCurrency,
    scannedReceiptDate,
    scannedReceiptNumber,
    confidence,
    warning_msg,
    isHandwritten,
  } = state.receipt;
  const { tenantConfig } = state.configuration;
  return {
    receiptList,
    localCurrency,
    isLoading,
    success,
    error,
    info,
    scanLoader,
    scannedAmount,
    scannedCurrency,
    scannedReceiptDate,
    scannedReceiptNumber,
    confidence,
    warning_msg,
    isHandwritten,
    tenantConfig,
    currencyList: getCountryCurrencyList(state),
    userID: getUser(state)?.id || null,
  };
};

const mapDisapatchToProps = (dispatch: Dispatch<any>) => {
  return {
    _updateReceiptList: (list: IReceipt[]) => dispatch(updateReceiptList(list)),
    _fetchCurrencyList: () => dispatch(fetchCountryCurrencyList()),
    _resetToInitial: () => dispatch(resetToInitialReceiptReducer()),
    _apiCallReset: () => dispatch(apiCallReset()),
    _createReceipt: (receiptPostData: IreceiptPostData, callBack?: Function) =>
      dispatch(createReceipt(receiptPostData, callBack)),
    _fetchLocalCurrency: (userId: number) =>
      dispatch(fetchLocalCurrency(userId)),
    _setConfirmationInfo: (_data: IConfirmationInfo) =>
      dispatch(setConfirmationInfo(_data)),
    _resetConfirmationInfo: () => dispatch(resetConfirmationInfo()),
    _scanImage: (file: File) => dispatch(scanImage(file)),
    resetScanDateAmount: () =>
      dispatch(setScanDateAmount(null, 0, '', {}, false, null, '')),
  };
};

const connector = connect(mapStateToProps, mapDisapatchToProps);

let is_enabled_ocr = false;

const Receipt: FC<ConnectedProps<typeof connector>> = props => {
  const {
    userID,
    receiptList,
    currencyList,
    localCurrency,
    isLoading,
    success,
    error,
    info,
    scanLoader,
    scannedAmount,
    scannedCurrency,
    scannedReceiptDate,
    scannedReceiptNumber,
    confidence,
    warning_msg,
    isHandwritten,
    tenantConfig,
    resetScanDateAmount,
    _updateReceiptList,
    _fetchCurrencyList,
    _resetToInitial,
    _apiCallReset,
    _createReceipt,
    _fetchLocalCurrency,
    _setConfirmationInfo,
    _resetConfirmationInfo,
    _scanImage,
  } = props;
  const { push } = useHistory();
  const { Dragger } = Upload;
  // const [form] = Form.useForm();
  const rowGutter: [number, number] = [8, 8];
  const [getActiveCollapse, setActiveCollapse] = useState<number | null>(null);
  const dummyReceiptData: IReceipt = {
    id: 0,
    date: moment(),
    amount: 0,
    currency: null,
    receipt_number: '',
    file: '',
    file_type: '',
    is_used: false,
    created_on: null,
    modified_on: null,
    created_by: null,
    modified_by: null,
    deleted_on: null,
    deleted_by: null,
    is_deleted: false,
    claim_number: '',
    expense_type: '',
  };

  useEffect(() => {
    if (tenantConfig.length > 0) {
      is_enabled_ocr = tenantConfig[0]?.is_enabled_ocr;
    }
  }, [tenantConfig]);

  const isImgAndPdf = (type: string): boolean => {
    const condition = Boolean(
      type === 'image/jpeg' ||
        type === 'image/jpg' ||
        type === 'image/png' ||
        type === 'application/pdf' ||
        type === 'image/jfif',
    );

    if (!condition) message.error('Unsupported file type', 2);

    return condition;
  };

  const draggerProps = {
    name: 'file',
    multiple: false,
    showUploadList: false,
    disabled: Boolean(receiptList.length > 0),
    beforeUpload: (file: File) => {
      try {
        if (isImgAndPdf(file.type)) {
          const id: number = receiptList.length;
          _updateReceiptList([
            ...receiptList,
            {
              ...dummyReceiptData,
              id: id,
              date: moment(),
              file: file,
              file_type: file.type,
              currency: localCurrency?.id || dummyReceiptData.currency,
            },
          ]);

          setActiveCollapse(id);
        }
      } catch (error) {
        console.error('DEV ERROR', error);
      }
      return false;
    },
  };

  useEffect(() => {
    receiptList.length > 0 && is_enabled_ocr && sendImageToScan(receiptList);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [receiptList]);

  const sendImageToScan = (file: any) => {
    const getReceiptDataUsingId: IReceipt = file[0];
    const _file = getReceiptDataUsingId?.file as File;
    _scanImage(_file);
  };

  const handleSaveOnClick = (id: number, values: any) => {
    try {
      const getReceiptDataUsingId: IReceipt = receiptList.filter(
        (o: IReceipt) => o.id === id,
      )[0];

      const receiptPostData: IreceiptPostData = {
        amount: values?.amount || getReceiptDataUsingId?.amount,
        currency: values?.currency || getReceiptDataUsingId?.currency,
        date: moment.isMoment(values.date)
          ? values?.date?.format('DD/MM/YYYY')
          : values?.date,
        file: getReceiptDataUsingId?.file as File,
        receipt_number:
          values?.receipt_number || getReceiptDataUsingId?.receipt_number,
        is_handwritten_detected: isHandwritten || false,
      };
      _createReceipt(receiptPostData, () => {
        _setConfirmationInfo({
          forWhat: '',
          extraInfo: '',
          okText: 'Yes',
          cancelText: 'No',
          visibility: true,
          headerText: 'Do you want to add another receipt?',
          bodyText: '',
          okBtnFn: () => {
            _resetConfirmationInfo();
            _updateReceiptList(
              receiptList.filter((o: IReceipt) => o.id !== id),
            );
          },
          cancelBtnFn: () => {
            _resetConfirmationInfo();
            setTimeout(() => {
              push(appPath.drafts.receipt.linkTo);
            }, 200);
          },
        });
      });
    } catch (error) {
      console.error('DEV ERROR', error);
    }
  };

  const handleSaveClickError = (id: number, _values?: any) => {
    try {
      setActiveCollapse(id);
    } catch (error) {
      console.error('DEV ERROR', error);
    }
  };

  const handleAccordianHeaderClick = (
    _event: React.MouseEvent<HTMLElement, MouseEvent>,
    id: number,
  ) => {
    try {
      setActiveCollapse((pervId: number | null) => (pervId === id ? null : id));
    } catch (error) {
      console.error('DEV ERROR', error);
    }
  };

  const handleDeleteClick = (id: number) => {
    try {
      resetScanDateAmount();
      _updateReceiptList(receiptList.filter((o: IReceipt) => o.id !== id));
    } catch (error) {
      console.error('DEV ERROR', error);
    }
  };

  useEffect(() => {
    // ComponentDidMount
    userID && _fetchLocalCurrency(userID);
    _fetchCurrencyList();
    return () => {
      // ComponentWilUnmount
      _resetToInitial();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    message.destroy();
    if (isLoading && !!info) message.loading(info, 0);
    else if (success) message.success(success, 5, _apiCallReset);
    else if (error) message.error(error, 5, _apiCallReset);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, success, error, info]);
  return (
    <HeaderBarWrapper
      headerCommonProps={{
        title: <Trans>Add Receipt</Trans>,
      }}
      data-test='headerBarWrapper'
    >
      <Row gutter={rowGutter} className='receipt-conatiner'>
        <Col span={24} className='dragger-container'>
          <Dragger {...draggerProps}>
            <p className='ant-upload-drag-icon'>
              <InboxOutlined />
            </p>
            <p className='ant-upload-text'>
              <Trans>Click or drag file to this area to upload</Trans>
            </p>
            <Space align='center' direction='vertical' size='middle'>
              <p className='ant-upload-hint'>
                Support for a single upload. The files get saved in DRAFTS
                Section.
                <br /> Strictly prohibit from uploading company data or other
                confidential files.
              </p>
              <p className='ant-upload-hint'>
                <Trans>Format</Trans> : JPG , JPEG , PNG , JFIF , PDF <br />{' '}
                <Trans>Maximum File Size</Trans>: 20 MB
              </p>
            </Space>
          </Dragger>
        </Col>

        <Col span={24}>
          <Row className='receipt-list-container'>
            {receiptList.map((o: IReceipt, i: number) => (
              <SingleReceipt
                key={'receipt_' + i + receiptList.length}
                receiptData={o}
                receiptAccordianVisibility={Boolean(o.id === getActiveCollapse)}
                scanLoader={scanLoader}
                scannedCurrency={scannedCurrency}
                scannedAmount={scannedAmount}
                scannedReceiptDate={scannedReceiptDate}
                scannedReceiptNumber={scannedReceiptNumber}
                confidence={confidence}
                warning_msg={warning_msg}
                is_enabled_ocr={is_enabled_ocr}
                handleAccordianHeaderClick={handleAccordianHeaderClick}
                handleDeleteClick={handleDeleteClick}
                handleSaveClick={handleSaveOnClick}
                handleSaveClickError={handleSaveClickError}
                currencyList={currencyList}
                // form={form}
              />
            ))}
          </Row>
        </Col>
      </Row>
    </HeaderBarWrapper>
  );
};

export default connector(memo(Receipt));
