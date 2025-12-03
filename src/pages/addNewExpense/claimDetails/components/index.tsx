import React, { FC, ReactNode, memo } from 'react';
import ReceiptSupportingDocFields from './receiptSupportingDocFields/receiptSupportingDocFields.index';
import GeneralFields from './generalFields/generalFields.index';
import EntertainmentFields from './entertainmentFields/entertainmentFields.index';
import CustomFields from './customFields/customFields.index';
import MileageFields from './mileageFields/mileageFields.index';
import AllowanceFields from './allowanceFields/allowanceFields.index';
import { GetLabelName } from '../../components/';
import { Form, Input } from 'antd';
//import { Trans } from '@lingui/macro';

/**
 * GetFieldStructure
 * @param props
 */
const GetFieldStructure: FC<{
  lable: ReactNode;
  noBg?: boolean;
  hideChild?: boolean;
}> = props => {
  return (
    <div className={`detail-field ${props?.noBg ? 'no-bg' : ''}`}>
      <div className='field-label'>{props.lable}</div>
      {props.hideChild ? null : (
        <div className='field-value'>{props.children}</div>
      )}
    </div>
  );
};

const PettyCashFieldsComponent: FC<{
  configuration: any;
  expenseClaimFetchedData: any;
  isUseForFormPreview?: boolean;
}> = ({ configuration, expenseClaimFetchedData, isUseForFormPreview }) => {
  if (!configuration?.is_allow_voucher_number) return null;
  return (
    <div className='petty-cash-form-section'>
      {isUseForFormPreview ? (
        <Form.Item
          label={
            <GetLabelName
              defaultTitle='Voucher Number'
              configuration={configuration}
            />
          }
          name='voucher_number'
          className='voucher-number'
        >
          <Input autoComplete='new-password' />
        </Form.Item>
      ) : configuration.is_allow_voucher_number ? (
        <>
          <GetFieldStructure
            lable={
              <GetLabelName
                defaultTitle='Voucher Number'
                configuration={configuration}
              />
            }
          >
            {expenseClaimFetchedData?.voucher_number || ''}
          </GetFieldStructure>
        </>
      ) : null}
    </div>
  );
};

const PettyCashFields = memo(PettyCashFieldsComponent);

export {
  GeneralFields,
  EntertainmentFields,
  CustomFields,
  MileageFields,
  ReceiptSupportingDocFields,
  GetFieldStructure,
  PettyCashFields,
  AllowanceFields,
};
