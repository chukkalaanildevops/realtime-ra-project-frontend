import React, { memo, FC, ReactNode } from 'react';
import { Row } from 'antd';
import { PaperClipOutlined } from '@ant-design/icons';
import {
  AppDrawer,
  DetailsDrawerSingleInfo,
  DocumentsViewer,
} from '../../../../shared/components';
import { Tmode } from '../../addNewExpense.model';
import { IuserInfo } from '../../../../shared/model';
import '../allowanceNewTripDetailDrawer/allowanceNewTripDetailDrawer.index.less';
import { GetLabelName } from '..';

interface IAllowanceTripDetailDrawerProps {
  data: any;
  onClose: (para: null) => void;
  receiptImageURL: (file: any) => string;
  mode: Tmode;
  userInfo: IuserInfo | null;
  allowanceConfiguration: any;
}

const AllowanceTripDetailsDrawer: FC<IAllowanceTripDetailDrawerProps> = props => {
  const {
    data,
    onClose,
    receiptImageURL,
    mode,
    allowanceConfiguration,
  } = props;

  const getLabelName = (
    defaultTitle: any,
    type: 'string' | 'ReactNode' | 'doc' = 'ReactNode',
  ): ReactNode => {
    if (type === 'ReactNode') {
      return (
        <GetLabelName
          defaultTitle={defaultTitle}
          configuration={allowanceConfiguration || null}
        />
      );
    } else if (type === 'string') {
      try {
        const objValue =
          allowanceConfiguration?.label_mapping[
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
            configuration={allowanceConfiguration || null}
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

  return (
    <AppDrawer
      width='50%'
      data-test='appDrawer'
      title={getLabelName('Allowance Details', 'string')}
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
            label={getLabelName('From Date', 'string')}
            content={data.from_date || ' - '}
            colProps={{}}
          />
          <DetailsDrawerSingleInfo
            label={getLabelName('To Date', 'string')}
            content={data.to_date || ' - '}
            colProps={{}}
          />
          <DetailsDrawerSingleInfo
            label={getLabelName('No. of Days', 'string')}
            content={data.no_of_days || ' - '}
            colProps={{}}
          />
          <DetailsDrawerSingleInfo
            colProps={{}}
            label={getLabelName('Location', 'string')}
            content={data.location?.title || ' - '}
          />
          <DetailsDrawerSingleInfo
            colProps={{}}
            label={getLabelName('Allowance Type', 'string')}
            content={data.allowance_rate?.subrate_title || ' - '}
          />
          <DetailsDrawerSingleInfo
            colProps={{}}
            label={getLabelName('Approved Amount', 'string')}
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
            label={getLabelName('Amount', 'string')}
            content={data.amount ? Number(data.amount) : 0}
          />
          <DetailsDrawerSingleInfo
            colProps={{}}
            label={getLabelName('Expense Currency', 'string')}
            content={data.allowance_currency ? data.allowance_currency : ''}
          />
          <DetailsDrawerSingleInfo
            colProps={{}}
            label={getLabelName('Converted Expense Amount', 'string')}
            content={
              data.converted_amount
                ? Number(Number(data.converted_amount)).toFixed(2)
                : 0
            }
          />
          <DetailsDrawerSingleInfo
            colProps={{}}
            label={getLabelName('Supporting Documents', 'doc')}
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
            label={getLabelName('Receipt', 'string')}
            content={
              (data?.receipt || []).length
                ? data.receipt.map((o: any, i: number) => (
                    <DocumentsViewer
                      itemType='expense'
                      itemNumber=''
                      receipt={[
                        o.hasOwnProperty('file')
                          ? o
                          : {
                              file: receiptImageURL(o),
                              receipt_number: o.receipt_number,
                              file_type: o.type || o.file_type,
                            },
                      ]}
                      documents={[]}
                      icon={
                        <span className='receipt-link'>
                          <PaperClipOutlined />{' '}
                          {getLabelName('Receipt', 'string')}
                        </span>
                      }
                    />
                  ))
                : ' - '
            }
          />
          <DetailsDrawerSingleInfo
            colProps={{}}
            label={getLabelName('Receipt Number', 'string')}
            content={data.receipt_number || ' - '}
          />
        </Row>
      ) : (
        'a'
      )}
    </AppDrawer>
  );
};

export default memo(AllowanceTripDetailsDrawer);
