import React, { FC, ReactNode, memo } from 'react';
import { Row, Col } from 'antd';
import { PaperClipOutlined } from '@ant-design/icons';
import {
  Amount,
  DocumentsViewer,
  ErrorBoundary,
  Remark,
  //   CustomizeTabName,
} from '../../../../../shared/components';
// import { GetFieldStructure } from '../';
//import { Trans } from '@lingui/macro';
import moment, { Moment } from 'moment';
import Table from 'antd/lib/table';
import { IBEReceipt } from '../../../../../shared/model';
import { GetLabelName } from '../../../components';

const MileageFields: FC<{
  configuration: any;
  expenseClaimFetchedData: any;
}> = props => {
  const { expenseClaimFetchedData, configuration } = props;
  const rowGutter: [number, number] = [24, 24];
  const receiptImageURL = (f: any) =>
    typeof f?.file === 'string' ? f?.file : window.URL.createObjectURL(f || '');

  const getLabelName = (
    defaultTitle: any,
    type: 'string' | 'ReactNode' | 'doc' = 'ReactNode',
  ): ReactNode => {
    if (type === 'ReactNode') {
      return (
        <GetLabelName
          defaultTitle={defaultTitle}
          configuration={configuration || null}
        />
      );
    } else if (type === 'string') {
      try {
        const objValue =
          configuration?.label_mapping[
            defaultTitle.toLowerCase().replace(/ /g, '_')
          ];
        if (objValue) {
          return objValue?.mapped;
        }
      } catch (error) {
        console.error(error);
      }
      return defaultTitle;
    } else if (type === 'doc') {
      return (
        <>
          <GetLabelName
            defaultTitle={defaultTitle}
            configuration={configuration || null}
          />
          {/* {!viewOnly ? (
                <h5 className='ant-upload-hint'>
                  Format : JPG , JPEG , PNG , JFIF , PDF <br /> Maximum File Size :
                  20 MB
                </h5>
              ) : null} */}
        </>
      );
    }
  };

  const columns = [
    {
      title: getLabelName('Trip Date', 'string'),
      dataIndex: 'date',
      key: 'date',
      fixed: true,
      render: (text: Moment) =>
        moment.isMoment(text) ? text.format('DD/MM/YYYY') : text || '',
      width: '100px',
    },
    {
      title: getLabelName('Start Place', 'string'),
      dataIndex: 'source',
      key: 'source',
      ellipsis: false,
      render: (text: any) => <span className='address'>{text}</span>,
    },
    {
      title: getLabelName('End Place', 'string'),
      dataIndex: 'destination',
      key: 'destination',
      ellipsis: false,
      render: (text: any) => <span className='address'>{text}</span>,
    },
    {
      title: getLabelName('Distance (KM)', 'string'),
      dataIndex: 'auto_calculated_mileage',
      key: 'auto_calculated_mileage',
      align: 'left' as any,
      render: (text: any) => Number(text || 0).toFixed(4),
      width: 120,
    },
    {
      title: getLabelName('Mileage Amount', 'string'),
      dataIndex: 'amount',
      key: 'amount',
      align: 'center' as any,
      width: 135,
      render: (text: any) => (
        <Amount
          align='right'
          amount={Number(Number(text || 0).toFixed(2))}
          currency={
            expenseClaimFetchedData?.converted_amount_currency?.currency
              ?.code || ''
          }
        />
      ),
    },
    {
      title: getLabelName('Parking Charges', 'string'),
      dataIndex: 'parking_charges',
      key: 'parking_charges',
      align: 'center' as any,
      width: 135,
      render: (text: any) => (
        <Amount
          align='right'
          amount={Number(Number(text || 0).toFixed(2))}
          currency={
            expenseClaimFetchedData?.converted_amount_currency?.currency
              ?.code || ''
          }
        />
      ),
    },
    {
      title: getLabelName('Toll Charges', 'string'),
      dataIndex: 'toll_charges',
      key: 'toll_charges',
      align: 'center' as any,
      width: 135,
      render: (text: any) => (
        <Amount
          align='right'
          amount={Number(Number(text || 0).toFixed(2))}
          currency={
            expenseClaimFetchedData?.converted_amount_currency?.currency
              ?.code || ''
          }
        />
      ),
    },
    {
      title: getLabelName('Other Charges', 'string'),
      dataIndex: 'other_charges',
      key: 'other_charges',
      align: 'center' as any,
      width: 135,
      render: (text: any) => (
        <Amount
          align='right'
          amount={Number(Number(text || 0).toFixed(2))}
          currency={
            expenseClaimFetchedData?.converted_amount_currency?.currency
              ?.code || ''
          }
        />
      ),
    },
    {
      title: getLabelName('Total Amount', 'string'),
      dataIndex: 'total_amount',
      key: 'total_amount',
      align: 'center' as any,
      width: 135,
      render: (text: any) => (
        <Amount
          align='right'
          amount={Number(Number(text || 0).toFixed(2))}
          currency={
            expenseClaimFetchedData?.converted_amount_currency?.currency
              ?.code || ''
          }
        />
      ),
    },
    {
      title: getLabelName('Is A Round Trip', 'string'),
      dataIndex: 'is_a_round_trip',
      key: 'is_a_round_trip',
      align: 'center' as any,
      width: 135,
      render: (text: any) => (text ? 'Yes' : 'No'),
    },
    {
      title: getLabelName('Receipt/s', 'string'),
      dataIndex: 'receipt',
      key: 'receipt',
      align: 'center' as any,
      render: (_file: File | IBEReceipt, _row: any) => {
        return (
          <DocumentsViewer
            itemType='expense'
            itemNumber={expenseClaimFetchedData?.claim_number}
            documents={_row.supporting_documents}
            receipt={_file ? { ..._file, file: receiptImageURL(_file) } : null}
            icon={<PaperClipOutlined />}
          />
        );
      },
    },
    {
      title: getLabelName('Purpose', 'string'),
      dataIndex: 'purpose',
      key: 'purpose',
      ellipsis: false,
      align: 'center' as any,
      width: '7%',
      render: (_val: string, _item: any, _index: number) => (
        <Remark remark={_val} />
      ),
    },
  ];

  return (
    <Row gutter={rowGutter} className='mileage-form-section'>
      <ErrorBoundary>
        <Col span={24}>
          <Table
            scroll={{
              x: true,
            }}
            dataSource={expenseClaimFetchedData?.mileage_records}
            columns={columns}
            pagination={{ hideOnSinglePage: true }}
          />
        </Col>
      </ErrorBoundary>
    </Row>
  );
};

export default memo(MileageFields);
