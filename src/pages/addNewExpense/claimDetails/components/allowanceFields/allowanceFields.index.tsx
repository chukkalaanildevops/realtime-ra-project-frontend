import React, { FC, ReactNode, memo } from 'react';
import { Row, Col } from 'antd';
import { PaperClipOutlined } from '@ant-design/icons';
import {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  //Amount,
  DocumentsViewer,
  ErrorBoundary,
  //   CustomizeTabName,
} from '../../../../../shared/components';
// import { GetFieldStructure } from '../';
import moment, { Moment } from 'moment';
import Table from 'antd/lib/table';
import { GetLabelName } from '../../../components';

const AllowanceFields: FC<{
  configuration: any;
  expenseClaimFetchedData: any;
  allowanceRecordsData: any;
}> = props => {
  const {
    expenseClaimFetchedData,
    allowanceRecordsData,
    configuration,
  } = props;
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
      title: getLabelName('From Date', 'string'),
      dataIndex: 'from_date',
      key: 'from_date',
      align: 'center' as 'center',
      width: 10,
      render: (text: Moment) =>
        moment.isMoment(text)
          ? text.format('DD/MM/YYYY')
          : moment(text, ['DD/MM/YYYY', 'DD-MM-YYYY']).format('DD/MM/YYYY') ||
            '',
    },
    {
      title: getLabelName('To Date', 'string'),
      dataIndex: 'to_date',
      key: 'to_date',
      align: 'center' as 'center',
      width: 10,
      render: (text: Moment) =>
        moment.isMoment(text)
          ? text.format('DD/MM/YYYY')
          : moment(text, ['DD/MM/YYYY', 'DD-MM-YYYY']).format('DD/MM/YYYY') ||
            '',
    },
    {
      title: getLabelName('No. of Days', 'string'),
      dataIndex: 'no_of_days',
      key: 'no_of_days',
      align: 'center' as 'center',
      width: 10,
      render: (text: any) => <span className='address'>{text}</span>,
    },
    {
      title: getLabelName('Location', 'string'),
      dataIndex: 'location',
      key: 'location',
      align: 'center' as 'center',
      width: 10,
      render: (text: any) => <span className='address'>{text.title}</span>,
    },
    {
      title: getLabelName('Allowance Type', 'string'),
      dataIndex: 'allowance_rate',
      key: 'allowance_rate',
      align: 'center' as 'center',
      width: 10,
      render: (text: any) => (
        <span className='address'>{text.subrate_title}</span>
      ),
    },
    {
      title: getLabelName('Approved Amount', 'string'),
      dataIndex: 'approved_amount',
      key: 'approved_amount',
      align: 'center' as 'center',
      width: 10,
      render: (text: any) => {
        // const obj = allowanceTypes.filter(
        //   (item: any) => item.id === allowanceTypeId,
        // );
        // return (
        //   <Amount
        //     align='center'
        //     amount={text}
        //     //currency={obj[0].allowance_currency.title}
        //   />
        // );

        return (
          <div>
            <span>
              {text !== undefined && text !== 0 && text !== null
                ? Number(Number(text).toFixed(2))
                : 'Unlimited'}
            </span>
          </div>
        );
      },
    },
    {
      title: getLabelName('Amount', 'string'),
      dataIndex: 'amount',
      key: 'amount',
      align: 'center' as any,
      width: 10,
      render: (text: any) => {
        //return <Amount align='center' amount={text} />;

        return (
          <div>
            <span>{Number(Number(text).toFixed(2))}</span>
          </div>
        );
      },
    },
    {
      title: getLabelName('Expense Currency', 'string'),
      dataIndex: 'allowance_currency',
      key: 'allowance_currency',
      align: 'center' as 'center',
      width: 10,
      render: (text: any) => <span className='address'>{text}</span>,
    },
    {
      title: getLabelName('Conversion Rate', 'string'),
      dataIndex: 'conversion_rate',
      key: 'conversion_rate',
      align: 'center' as 'center',
      width: 10,
      render: (text: any) => (
        <span className='address'>{Number(text).toFixed(4)}</span>
      ),
    },
    {
      title: getLabelName('Converted Expense Amount', 'string'),
      dataIndex: 'converted_amount',
      key: 'converted_amount',
      align: 'center' as 'center',
      width: 10,
      render: (text: any) => (
        <span className='address'>{Number(Number(text).toFixed(5))}</span>
      ),
    },

    {
      title: getLabelName('Receipt/s', 'string'),
      dataIndex: 'receipt',
      key: 'receipt',
      align: 'center' as 'center',
      width: 10,
      render: (_file: File | any, _row: any) => {
        const supDoc = (_row.supporting_documents || []).map((o: any) =>
          o.hasOwnProperty('attachment')
            ? o
            : {
                attachment: receiptImageURL(o),
                file_name: o.name,
                file_type: o.type,
              },
        );
        return (
          <DocumentsViewer
            itemType='expense'
            itemNumber={expenseClaimFetchedData?.claim_number || 'N/A'}
            documents={supDoc}
            receipt={
              _file
                ? {
                    ..._file,
                    file: receiptImageURL(_file),
                    file_type: _file?.file_type || _file?.type,
                    receipt_number: _row.receipt_number,
                  }
                : null
            }
            icon={<PaperClipOutlined />}
          />
        );
      },
    },
  ];

  return (
    <Row gutter={rowGutter} className='allowance-form-section'>
      <ErrorBoundary>
        <Col span={24}>
          <Table
            scroll={{
              x: true,
            }}
            dataSource={allowanceRecordsData}
            columns={columns}
            pagination={{ hideOnSinglePage: true }}
          />
        </Col>
      </ErrorBoundary>
    </Row>
  );
};

export default memo(AllowanceFields);
