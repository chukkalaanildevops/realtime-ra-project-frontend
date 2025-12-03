import React, { memo, FC } from 'react';
import { Row } from 'antd';
import { PaperClipOutlined } from '@ant-design/icons';
import {
  AppDrawer,
  DetailsDrawerSingleInfo,
  DocumentsViewer,
} from '../../../../shared/components';
import { IallowanceRecords, Tmode } from '../../addNewExpense.model';
import { IuserInfo } from '../../../../shared/model';
import '../allowanceTripDetailDrawer/allowanceTripDrawer.index.less';
import { Trans } from '@lingui/macro';

interface IAllowanceTripDetailDrawerProps {
  data: null | IallowanceRecords;
  onClose: (para: null) => void;
  receiptImageURL: (file: any) => string;
  mode: Tmode;
  userInfo: IuserInfo | null;
}

const AllowanceTripDetailDrawer: FC<IAllowanceTripDetailDrawerProps> = props => {
  const { data, onClose, receiptImageURL, mode } = props;
  return (
    <AppDrawer
      width='50%'
      data-test='appDrawer'
      title='Allowance Details'
      visible={data !== null}
      destroyOnClose={true}
      closable={true}
      onClose={() => onClose(null)}
      showCancelButton={false}
      showOkButton={false}
      getContainer='.allowance-form-section'
      className={mode}
    >
      {data !== null ? (
        <Row className='trip-details-info' gutter={[24, 24]}>
          <DetailsDrawerSingleInfo
            label='Date'
            content={data.date || ' - '}
            colProps={{}}
          />
          <DetailsDrawerSingleInfo
            colProps={{}}
            label='Location'
            content={data.location?.title || ' - '}
          />
          <DetailsDrawerSingleInfo
            colProps={{}}
            label='Allowance Type'
            content={data.allowance_rate?.subrate_title || ' - '}
          />
          <DetailsDrawerSingleInfo
            colProps={{}}
            label='Approved Amount'
            content={
              data.approved_amount !== undefined &&
              data.approved_amount !== 0 &&
              data.approved_amount !== null
                ? Number(data.approved_amount)
                : 'Unlimited'
            }
          />
          <DetailsDrawerSingleInfo
            colProps={{}}
            label='Amount'
            content={data.amount ? Number(data.amount) : 0}
          />
          <DetailsDrawerSingleInfo
            colProps={{}}
            label='Currency'
            content={data.allowance_currency ? data.allowance_currency : ''}
          />
          <DetailsDrawerSingleInfo
            colProps={{}}
            label='Converted Amount'
            content={
              data.converted_amount
                ? Number(Number(data.converted_amount)).toFixed(2)
                : 0
            }
          />
          <DetailsDrawerSingleInfo
            colProps={{}}
            label={<Trans>Supporting Documents</Trans>}
            content={
              (data?.supporting_documents || []).length
                ? data.supporting_documents.map((o: any, i: number) => (
                    <DocumentsViewer
                      key={i}
                      itemType='expense'
                      itemNumber=''
                      receipt={null}
                      documents={[
                        o.hasOwnProperty('attachment')
                          ? o
                          : {
                              attachment: receiptImageURL(o),
                              file_name: o.name,
                              file_type: o.type,
                            },
                      ]}
                      icon={
                        <span className='supporting-doc-link'>
                          <PaperClipOutlined /> Supporting Document {i + 1}
                        </span>
                      }
                    />
                  ))
                : ' - '
            }
          />
          <DetailsDrawerSingleInfo
            colProps={{}}
            label={<Trans>Receipt</Trans>}
            content={
              data.receipt ? (
                <DocumentsViewer
                  itemType='expense'
                  itemNumber=''
                  receipt={{
                    file: receiptImageURL(data.receipt),
                    file_type:
                      (data.receipt as any)?.file_type ||
                      (data.receipt as any)?.type,
                    receipt_number: data.receipt_number,
                  }}
                  documents={[]}
                  icon={
                    <span className='receipt-link'>
                      <PaperClipOutlined />
                      <Trans>Receipt</Trans>
                    </span>
                  }
                />
              ) : (
                ' - '
              )
            }
          />
          <DetailsDrawerSingleInfo
            colProps={{}}
            label={<Trans>Receipt Number</Trans>}
            content={data.receipt_number || ' - '}
          />
        </Row>
      ) : (
        'a'
      )}
    </AppDrawer>
  );
};

export default memo(AllowanceTripDetailDrawer);
