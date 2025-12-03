import React, { FC, memo, Dispatch, useEffect, useState } from 'react';
import { ConnectedProps, connect } from 'react-redux';
import {
  stateInterface,
  getDraftReceipts,
  getDraftsLoader,
  getCountryCurrencyList,
} from '../../../../shared/redux/rootReducer';

import { Row, Pagination, Col, Button } from 'antd';
import {
  FilterBar,
  NoData,
  ElementOrSkeleton,
  DataFilter,
} from '../../../../shared/components';
import SingleReceipt from '../../../receipt/components/singleReceipt.index';

import { resetToInitialReceiptReducer } from '../../../receipt/receipt.action';
import { IReceipt, IreceiptPutData } from '../../../receipt/receipt.model';

import { fetchCountryCurrencyList } from '../../../setup/component/other/currencyConversion/currencyConversion.thunk';

import {
  setConfirmationInfo,
  resetConfirmationInfo,
} from '../../../app/app.actions';
import { IConfirmationInfo } from '../../../app/app.model';

import {
  deleteReceiptById,
  updateReceipt,
  fetchDraftsTabData,
} from '../../drafts.thunk';
import moment from 'moment';

import './receipts.index.less';
import { Trans } from '@lingui/macro';

const mapStateToProps = (state: stateInterface) => {
  return {
    records: getDraftReceipts(state),
    isLoading: getDraftsLoader(state),
    currencyList: getCountryCurrencyList(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  return {
    _resetToInitialReceiptReducer: () =>
      dispatch(resetToInitialReceiptReducer()),
    _fetchReceiptData: (page: number, filters?: any, pageSize?: number) =>
      dispatch(fetchDraftsTabData('receipt', page, filters, pageSize)),
    _fetchCurrencyList: () => dispatch(fetchCountryCurrencyList()),
    _deleteReceiptById: (
      id: number,
      page: number,
      localFilters: any,
      callBack?: Function,
    ) => dispatch(deleteReceiptById(id, page, localFilters, callBack)),
    _setConfirmationInfo: (data: IConfirmationInfo) =>
      dispatch(setConfirmationInfo(data)),
    _resetConfirmationInfo: () => dispatch(resetConfirmationInfo()),
    _updateReceipt: (
      id: number,
      receiptPostData: IreceiptPutData,
      page: number,
      localFilters: any,
      callBack?: Function,
    ) =>
      dispatch(
        updateReceipt(id, receiptPostData, page, localFilters, callBack),
      ),
  };
};

const connector = connect(mapStateToProps, mapDispatchToProps);
let localFilters: any;
let initialPageSize: number = 12;

const DraftReceipt: FC<ConnectedProps<typeof connector> & {
  onSelectRow?: (list: any[]) => void;
  source?: any;
}> = props => {
  const {
    records,
    source,
    currencyList,
    isLoading,
    _resetToInitialReceiptReducer,
    _fetchCurrencyList,
    _deleteReceiptById,
    _setConfirmationInfo,
    _resetConfirmationInfo,
    _updateReceipt,
    _fetchReceiptData,
  } = props;
  const [getActiveCollapse, setActiveCollapse] = useState<number | null>(null);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [isFilterVisible, setFilterVisible] = useState(false);
  // const [form] = Form.useForm();
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
      _setConfirmationInfo({
        bodyText: 'Do you want to delete receipt',
        cancelText: 'Cancel',
        okText: 'Delete',
        visibility: true,
        extraInfo: '',
        forWhat: '',
        headerText: 'Confirmation',
        cancelBtnFn: _resetConfirmationInfo,
        okBtnFn: () => {
          _deleteReceiptById(id, records.current_page, localFilters);
          _resetConfirmationInfo();
        },
      });
    } catch (error) {
      console.error('DEV ERROR', error);
    }
  };

  const handleUpateOnClick = (id: number, values: any) => {
    try {
      const getReceiptDataUsingId: IReceipt = records?.data?.filter(
        (o: IReceipt) => o.id === id,
      )[0];

      const receiptPostData: IreceiptPutData = {
        amount: Number(
          Number(
            (values?.amount || getReceiptDataUsingId?.amount).toString(),
          ).toFixed(2),
        ),
        currency: values?.currency || getReceiptDataUsingId?.currency,
        date: moment.isMoment(values.date)
          ? values?.date?.format('DD/MM/YYYY')
          : values?.date,
        receipt_number:
          values?.receipt_number || getReceiptDataUsingId?.receipt_number,
      };
      _updateReceipt(
        id,
        receiptPostData,
        records.current_page,
        localFilters,
        () => {
          setActiveCollapse(null);
        },
      );
    } catch (error) {
      console.error('DEV ERROR', error);
    }
  };

  const handleUpdateClickError = (id: number, _values?: any) => {
    try {
      setActiveCollapse(id);
    } catch (error) {
      console.error('DEV ERROR', error);
    }
  };

  const onChangePagination = (page: number, pageSize: number) => {
    _fetchReceiptData(page, localFilters, pageSize);
  };

  const onApplyFilters = (filters: any) => {
    localFilters = filters;
    _fetchReceiptData(1, localFilters, pageSize);
  };

  const onResetFilters = () => {
    localFilters = undefined;
    _fetchReceiptData(1, undefined, pageSize);
  };

  useEffect(() => {
    // ComponentDidMount
    _fetchCurrencyList();
    return () => {
      //ComponentWillUnmount
      _resetToInitialReceiptReducer();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isReceiptDataAvailable = (records?.data || []).length > 0;

  return (
    <div className='draft-receipts-container'>
      <FilterBar isAddButton={false} filterView={setFilterVisible} />

      <div style={{ marginBottom: 20 }}>
        <DataFilter
          page='DRAFT'
          source={source}
          includeLegalEntities={false}
          includeStatusBar={true}
          isVisible={isFilterVisible}
          includeDraftStatus={true}
          includeSaveFilterOption={true}
          item='receipt'
          onApplyFilters={onApplyFilters}
          onResetFilters={onResetFilters}
          includeItemNumber={false}
          includeForRequestNumber={false}
        />
      </div>

      {isLoading ? (
        <ElementOrSkeleton isLoading type='cards' />
      ) : (
        <>
          {isReceiptDataAvailable ? (
            <Row gutter={[24, 24]}>
              {records?.data.map((o: IReceipt, i: number) => (
                <SingleReceipt
                  key={'receipt_' + i + o.id}
                  receiptData={o}
                  receiptAccordianVisibility={Boolean(
                    o.id === getActiveCollapse,
                  )}
                  handleAccordianHeaderClick={handleAccordianHeaderClick}
                  handleDeleteClick={handleDeleteClick}
                  handleSaveClick={handleUpateOnClick}
                  handleSaveClickError={handleUpdateClickError}
                  currencyList={currencyList}
                  isUsingForListing={true}
                  // form={form}
                />
              ))}
            </Row>
          ) : (
            <NoData />
          )}
          <Row gutter={[24, 24]}>
            <Col span={24}>
              <Pagination
                defaultCurrent={1}
                current={records.current_page}
                onChange={(pageNumber: number, pageSize: any) => {
                  onChangePagination(pageNumber, pageSize);
                }}
                hideOnSinglePage={false}
                showSizeChanger={true}
                defaultPageSize={12}
                pageSizeOptions={['10', '12', '20', '50', '100']}
                pageSize={pageSize || 12}
                onShowSizeChange={(_current: number, size: number) => {
                  setPageSize(size);
                }}
                total={records.pagination_data.total_records}
                showTotal={(total: number, range: number[]) => {
                  return <>{`${range[0]}-${range[1]} of ${total}`}</>;
                }}
                showQuickJumper={{
                  goButton: (
                    <Button type='default'>
                      <Trans>Go</Trans>
                    </Button>
                  ),
                }}
              />
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};

export default connector(memo(DraftReceipt));
