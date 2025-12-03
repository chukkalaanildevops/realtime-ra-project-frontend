import React, { FC, memo, useState, useEffect, Dispatch } from 'react';

import { connect, ConnectedProps } from 'react-redux';
import {
  stateInterface,
  getCountryCurrencyList,
} from '../../../shared/redux/rootReducer';

import {
  Button,
  Modal,
  // Checkbox,
  // Form,
  Row,
  Pagination,
} from 'antd';
import {
  SwapOutlined,
  ArrowLeftOutlined,
  FolderOpenOutlined,
} from '@ant-design/icons';

import { Trans } from '@lingui/macro';

import SingleReceipt from '../components/singleReceipt.index';

import { fetchReceiptListWithIsUsedPara } from '../receipt.thunk';
import { resetToInitialReceiptReducer } from '../receipt.action';

import { fetchCountryCurrencyList } from '../../setup/component/other/currencyConversion/currencyConversion.thunk';

import {
  ErrorBoundary,
  ElementOrSkeleton,
  PDFViewer,
} from '../../../shared/components';

import Moment from 'moment';

import './receiptGallery.index.less';
import { IReceiptGalleryProps } from './receiptGallery.model';
import Checkbox from 'antd/lib/checkbox';
// import CheckboxGroup from 'antd/lib/checkbox/Group';
import { IBEReceipt } from '../../../shared/model';
import { isPdfFile, preciseDecimal } from '../../../utils/global.utils';
// import { debounce } from 'lodash';

const mapStateToProps = (state: stateInterface) => {
  const { receiptList, receiptListLoader, paginationData } = state.receipt;
  return {
    receiptList,
    receiptListLoader,
    currencyList: getCountryCurrencyList(state),
    paginationData,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  return {
    _fetchReceiptListWithIsUsedPara: (
      addIsUsed: boolean,
      pageNo: number,
      pageSize: number,
    ) => dispatch(fetchReceiptListWithIsUsedPara(addIsUsed, pageNo, pageSize)),
    _resetToInitialReceiptReducer: () =>
      dispatch(resetToInitialReceiptReducer()),
    _fetchCountryCurrencyList: () => dispatch(fetchCountryCurrencyList()),
  };
};

const connector = connect(mapStateToProps, mapDispatchToProps);

let initialPageSize = 12;

const ReceiptGallery: FC<ConnectedProps<typeof connector> &
  IReceiptGalleryProps> = props => {
  const {
    docType,
    // pickMode = 'single',
    onSelection,
    buttonProps,
    children,
    receiptList,
    receiptListLoader,
    currencyList,
    userFieldsForReceiptGallery,
    paginationData,
    disabledFields = [],
    _fetchReceiptListWithIsUsedPara,
    _resetToInitialReceiptReducer,
    _fetchCountryCurrencyList,
  } = props;

  // const [form] = Form.useForm();
  const [getPageNo, setPageNo] = useState<number>(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [getModelvisibility, setModelvisibility] = useState<boolean>(false);
  const [getSelectedReceipts, setSelectedReceipts] = useState<IBEReceipt[]>([]);
  const [getActiveCollapse, setActiveCollapse] = useState<number | null>(null);
  const [checkBoxState, setCheckBoxState] = useState<{
    checkedList: string[];
    indeterminate: boolean;
    checkAll: boolean;
  }>({
    checkedList: ['amount', 'currency', 'date', 'receipt_number'].filter(
      o => !disabledFields.includes(o),
    ),
    indeterminate: false,
    checkAll: true,
  });

  const onChange = (_type: string, _checkedList: any) => {
    setCheckBoxState(prevState => {
      const list = prevState.checkedList.includes(_type)
        ? prevState.checkedList.filter(o => o !== _type)
        : [...prevState.checkedList, _type];
      return {
        checkedList: list,
        indeterminate: !!list.length && list.length < 4,
        checkAll: list.length === 4,
      };
    });
  };

  /* const onCheckAllChange = (e: any) => {
    setCheckBoxState({
      checkedList: e.target.checked
        ? ['amount', 'currency', 'date', 'receipt_number']
        : [],
      indeterminate: false,
      checkAll: e.target.checked,
    });
  }; */

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

  const handleAddClickFn = (id: number) => {
    if (
      (userFieldsForReceiptGallery &&
        typeof userFieldsForReceiptGallery?.amount === 'number') ||
      userFieldsForReceiptGallery?.baseCurrency ||
      userFieldsForReceiptGallery?.date ||
      userFieldsForReceiptGallery?.receipt_number
    ) {
      setSelectedReceipts(receiptList.filter(o => o.id === id) as any);
    } else {
      _resetToInitialReceiptReducer();

      onSelection &&
        onSelection(
          receiptList.filter(o => o.id === id),
          checkBoxState.checkedList,
        );
      setModelvisibility(false);
      setSelectedReceipts([]);
      setActiveCollapse(null);
      setCheckBoxState({
        checkedList: ['amount', 'currency', 'date', 'receipt_number'],
        indeterminate: false,
        checkAll: true,
      });
    }
  };

  const confirmationSaveClick = () => {
    _resetToInitialReceiptReducer();

    onSelection &&
      onSelection(getSelectedReceipts as any, checkBoxState.checkedList);
    setModelvisibility(false);
    resetStateData();
  };

  const resetStateData = () => {
    setSelectedReceipts([]);
    setActiveCollapse(null);
    // setCheckBoxState({
    //   checkedList: ['amount', 'currency', 'date', 'receipt_number'],
    //   indeterminate: false,
    //   checkAll: true,
    // });
  };

  // useEffect(() => {
  //   /* ComponentDidMount */
  //   // _fetchCountryCurrencyList(); //fetching currency list
  //   return () => {
  //     /* ComponentWillUnmount */

  //     _resetToInitialReceiptReducer();
  //   };
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);
  return (
    <div className='receipt-gallery-component'>
      <Button
        type='default'
        block
        {...buttonProps}
        className={'open-saved-receipts-btn ' + buttonProps?.className}
        onClick={() => {
          _fetchCountryCurrencyList(); //fetching currency list
          setModelvisibility(true);
          _fetchReceiptListWithIsUsedPara(false, getPageNo, pageSize); // fetching receipt list
        }}
      >
        {children ? (
          children
        ) : (
          <>
            <FolderOpenOutlined /> &nbsp;&nbsp;
            <Trans>Open Saved Receipts</Trans>
          </>
        )}
      </Button>
      <Modal
        title={
          getSelectedReceipts.length ? 'Confirm Changes' : docType + ' Gallery'
        }
        visible={getModelvisibility}
        onCancel={() => {
          setModelvisibility(false);
          _resetToInitialReceiptReducer();
          resetStateData();
        }}
        centered
        closable
        footer={null}
        destroyOnClose
        width='90%'
        style={{
          height: '90%',
        }}
        getContainer='.page-container'
        className='receipt-gallery-modal'
      >
        <ErrorBoundary>
          {getSelectedReceipts.length ? (
            <div className='receipt-confirmation'>
              <h4 className='confirmation-header'>
                <ArrowLeftOutlined
                  className='arrow-back-button'
                  onClick={() => {
                    setSelectedReceipts([]);
                  }}
                />{' '}
                Confirm which fields to override with receipt data.
              </h4>
              <div className='con-container'>
                <div className='img-preview'>
                  {isPdfFile(getSelectedReceipts[0].file || '') ? (
                    <PDFViewer
                      file={getSelectedReceipts[0].file}
                      pageProps={{ height: 360 }}
                    />
                  ) : (
                    <img
                      src={getSelectedReceipts[0].file as string}
                      alt='receipt'
                    />
                  )}
                </div>
                <div className='option-container'>
                  {/* <div className='site-checkbox-all-wrapper'>
                    <Checkbox
                      indeterminate={checkBoxState.indeterminate}
                      onChange={onCheckAllChange}
                      checked={checkBoxState.checkAll}
                    >
                      Check all
                    </Checkbox>
                  </div> */}
                  {/* <br /> */}
                  {disabledFields.includes('date') ? null : (
                    <Checkbox
                      checked={checkBoxState.checkedList.includes('date')}
                      onChange={onChange.bind(null, 'date')}
                      // disabled={disabledFields.includes('date')}
                    >
                      <span className='label-txt'> Date :</span>
                      <span className='old-val'>
                        {Moment.isMoment(userFieldsForReceiptGallery?.date)
                          ? userFieldsForReceiptGallery?.date.format(
                              'DD/MM/YYYY',
                            )
                          : 'NA'}
                      </span>{' '}
                      <SwapOutlined />{' '}
                      <span className='new-val'>
                        {getSelectedReceipts[0].date}
                      </span>
                    </Checkbox>
                  )}
                  {disabledFields.includes('amount') ? null : (
                    <Checkbox
                      checked={checkBoxState.checkedList.includes('amount')}
                      onChange={onChange.bind(null, 'amount')}
                      // disabled={disabledFields.includes('amount')}
                    >
                      <span className='label-txt'>
                        <Trans>Amount :</Trans>
                      </span>
                      <span className='old-val'>
                        {userFieldsForReceiptGallery?.amount
                          ? Number(
                              preciseDecimal(
                                userFieldsForReceiptGallery?.amount,
                                2,
                              ),
                            )
                          : 'NA'}
                      </span>{' '}
                      <SwapOutlined />{' '}
                      <span className='new-val'>
                        {Number(
                          preciseDecimal(
                            Number(getSelectedReceipts[0].amount) || 0,
                            2,
                          ),
                        )}
                      </span>
                    </Checkbox>
                  )}
                  {disabledFields.includes('currency') ? null : (
                    <Checkbox
                      checked={checkBoxState.checkedList.includes('currency')}
                      onChange={onChange.bind(null, 'currency')}
                      // disabled={disabledFields.includes('currency')}
                    >
                      <span className='label-txt'>
                        <Trans>Currency :</Trans>
                      </span>
                      <span className='old-val'>
                        {userFieldsForReceiptGallery?.foreignCurrency?.currency
                          ?.title ||
                          userFieldsForReceiptGallery?.baseCurrency?.currency
                            ?.title ||
                          'NA'}
                      </span>{' '}
                      <SwapOutlined />{' '}
                      <span className='new-val'>
                        {getSelectedReceipts[0]?.currency?.currency?.title}
                      </span>
                    </Checkbox>
                  )}
                  {disabledFields.includes('receipt_number') ? null : (
                    <Checkbox
                      checked={checkBoxState.checkedList.includes(
                        'receipt_number',
                      )}
                      onChange={onChange.bind(null, 'receipt_number')}
                      disabled={disabledFields.includes('receipt_number')}
                    >
                      <span className='label-txt'>
                        <Trans>Receipt Number :</Trans>
                      </span>
                      <span className='old-val'>
                        {userFieldsForReceiptGallery?.receipt_number || 'NA'}
                      </span>{' '}
                      <SwapOutlined />{' '}
                      <span className='new-val'>
                        {getSelectedReceipts[0]?.receipt_number}
                      </span>
                    </Checkbox>
                  )}
                  {/* <CheckboxGroup
                  options={plainOptions}
                  value={checkBoxState.checkedList}
                  onChange={onChange}
                /> */}
                  <div className='save-btn'>
                    <Button type='primary' onClick={confirmationSaveClick}>
                      <Trans>Save</Trans>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className='receipt-gallery-container'>
              {receiptListLoader ? (
                <ElementOrSkeleton
                  isLoading={true}
                  isActive={true}
                  type='profilelist'
                />
              ) : (
                <>
                  <Row gutter={[24, 24]} className='receipt-section'>
                    {receiptList.map((o: any, i: number) => (
                      <SingleReceipt
                        key={'receipt_' + i + receiptList.length}
                        receiptData={o}
                        receiptAccordianVisibility={Boolean(
                          o.id === getActiveCollapse,
                        )}
                        handleAccordianHeaderClick={handleAccordianHeaderClick}
                        handleSaveClick={handleAddClickFn}
                        currencyList={currencyList || []}
                        isUseForGallery={true}
                        // form={form}
                      />
                    ))}
                  </Row>
                  <Row className='pagination-container'>
                    <Pagination
                      defaultCurrent={1}
                      current={getPageNo}
                      total={paginationData.total_records || 0}
                      showTotal={(total: number, range: number[]) => {
                        return <>{`${range[0]}-${range[1]} of ${total}`}</>;
                      }}
                      showQuickJumper={{
                        goButton: <Button type='default'>Go</Button>,
                      }}
                      hideOnSinglePage={false}
                      pageSizeOptions={['10', '12', '20', '50', '100']}
                      showSizeChanger={true}
                      onChange={(page, _pageSize: any) => {
                        setPageNo(page);

                        _fetchReceiptListWithIsUsedPara(false, page, _pageSize);
                      }}
                      onShowSizeChange={(_current: number, size: number) => {
                        setPageSize(size);
                      }}
                      pageSize={pageSize || 12}
                    />
                  </Row>
                </>
              )}
            </div>
          )}
        </ErrorBoundary>
      </Modal>
    </div>
  );
};

export default memo(connector(ReceiptGallery));
