import React, { memo, FC, ReactNode } from 'react';
import { Row } from 'antd';
import { PaperClipOutlined } from '@ant-design/icons';
import {
  AppDrawer,
  DetailsDrawerSingleInfo,
  DocumentsViewer,
} from '../../../../shared/components';
import { timeZoneMomentDate } from '../../../../utils/global.utils';
import { ImileageRecords, Tmode } from '../../addNewExpense.model';
import { IuserInfo } from '../../../../shared/model';
import moment from 'moment';
import './mileageTripDetailDrawer.index.less';
//import { Trans } from '@lingui/macro';
import { GetLabelName } from '..';

interface IMileageTripDetailDrawerProps {
  data: null | ImileageRecords;
  onClose: (para: null) => void;
  receiptImageURL: (file: any) => string;
  mode: Tmode;
  userInfo: IuserInfo | null;
  configuration: any;
}

const MileageTripDetailDrawer: FC<IMileageTripDetailDrawerProps> = props => {
  const {
    data,
    onClose,
    receiptImageURL,
    mode,
    userInfo,
    configuration,
  } = props;

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

  return (
    <AppDrawer
      width='50%'
      data-test='appDrawer'
      title={getLabelName('Trip Details', 'string')}
      visible={data !== null}
      destroyOnClose={true}
      closable={true}
      onClose={() => onClose(null)}
      showCancelButton={false}
      showOkButton={false}
      getContainer='.mileage-form-section'
      className={mode}
    >
      {data !== null ? (
        <Row className='trip-details-info' gutter={[24, 24]}>
          <DetailsDrawerSingleInfo
            label={getLabelName('Date', 'string')}
            content={data.date || ' - '}
            colProps={{}}
          />
          <DetailsDrawerSingleInfo
            colProps={{}}
            label={getLabelName('Rate', 'string')}
            content={
              data.rate
                ? Number(data.rate) > 0
                  ? Number(data.rate)
                  : 'Tier Rate'
                : 'Tier Rate'
            }
          />
          <DetailsDrawerSingleInfo
            label={getLabelName('Created By', 'string')}
            content={
              data.created_by?.name ||
              userInfo?.legal_name ||
              userInfo?.name ||
              ' - '
            }
            colProps={{}}
          />
          <DetailsDrawerSingleInfo
            label={getLabelName('Created On', 'string')}
            content={
              data.created_on
                ? timeZoneMomentDate(data.created_on).format('DD/MM/YYYY')
                : mode !== 'UPDATE'
                ? moment().format('DD/MM/YYYY')
                : ' - '
            }
            colProps={{}}
          />
          <DetailsDrawerSingleInfo
            colProps={{}}
            label={getLabelName('Start Place', 'string')}
            content={data.source || ' - '}
          />
          <DetailsDrawerSingleInfo
            colProps={{}}
            label={getLabelName('End Place', 'string')}
            content={data.destination || ' - '}
          />
          <DetailsDrawerSingleInfo
            colProps={{}}
            label={getLabelName('Distance (KM)', 'string')}
            content={
              data.auto_calculated_mileage
                ? Number(data.auto_calculated_mileage)
                : 0
            }
          />
          <DetailsDrawerSingleInfo
            colProps={{}}
            label={getLabelName('Mileage Amount', 'string')}
            content={data.amount ? Number(data.amount) : 0}
          />
          <DetailsDrawerSingleInfo
            colProps={{}}
            label={getLabelName('Toll Charges', 'string')}
            content={data.toll_charges ? Number(data.toll_charges) : 0}
          />
          <DetailsDrawerSingleInfo
            colProps={{}}
            label={getLabelName('Parking Charges', 'string')}
            content={data.parking_charges ? Number(data.parking_charges) : 0}
          />
          <DetailsDrawerSingleInfo
            colProps={{}}
            label={getLabelName('Other Charges', 'string')}
            content={data.other_charges ? Number(data.other_charges) : 0}
          />
          <DetailsDrawerSingleInfo
            colProps={{}}
            label={getLabelName('Total Amount', 'string')}
            content={data.total_amount ? Number(data.total_amount) : 0}
          />
          <DetailsDrawerSingleInfo
            colProps={{}}
            label={getLabelName('Is A Round Trip', 'string')}
            content={String(data.is_a_round_trip)}
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
                      <PaperClipOutlined /> {getLabelName('Receipt', 'string')}
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
            label={getLabelName('Receipt Number', 'string')}
            content={data.receipt_number || ' - '}
          />
          <DetailsDrawerSingleInfo
            label={getLabelName('Purpose', 'string')}
            content={data.purpose || ' - '}
            colProps={{ span: 24 }}
          />
        </Row>
      ) : null}
    </AppDrawer>
  );
};

export default memo(MileageTripDetailDrawer);
