import React, { memo, useState } from 'react';
import { Modal, Input } from 'antd';
import './cashAdvanceRejectionModal.index.less';
import { Amount } from '../../../../shared/components';
import {
  IAdminDataRequestParameters,
  ICashAdvanceRequestRespondParameters,
} from '../../admin.models';
import { getQueryParametersAsObject } from '../../../../utils/global.utils';
import { Trans } from '@lingui/macro';

let localFilters: { [key: string]: any } = {};

const CashAdvanceRejectionModal: React.FC<{
  isVisible: boolean | undefined;
  requestId: number | undefined;
  requestNumber: string | undefined;
  amountRequested: number | undefined;
  currency: string | undefined;
  employee: number;
  page: number;
  onClose: () => void;
  respondToCashAdvanceRequest: (
    requestId: number,
    data: ICashAdvanceRequestRespondParameters,
    requestParameters: IAdminDataRequestParameters,
  ) => void;
  setCashAdvanceRejectionModalVisible: (visible: boolean) => void;
}> = props => {
  const {
    isVisible = false,
    requestId,
    requestNumber,
    amountRequested,
    currency,
    employee,
    page,
    onClose,
    respondToCashAdvanceRequest,
    setCashAdvanceRejectionModalVisible,
  } = props;

  const [okButtonDisabled, setOkButtonDisabled] = useState(true);
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
  const [remark, setRemark] = useState<string | null>(null);

  localFilters = getQueryParametersAsObject();

  return (
    <Modal
      width={600}
      centered={true}
      closable={false}
      visible={isVisible}
      cancelText='Cancel'
      keyboard={false}
      okText='Save Response'
      destroyOnClose={true}
      confirmLoading={confirmLoading}
      title={
        <>
          Cash Advance Request No. #{requestNumber} for{' '}
          <Amount
            currency={currency}
            amount={amountRequested ? amountRequested : 0}
            noStyle={true}
          />
        </>
      }
      className='cash-advance-rejection-form-modal'
      okButtonProps={{
        disabled: okButtonDisabled,
      }}
      onOk={event => {
        setConfirmLoading(true);
        let data: ICashAdvanceRequestRespondParameters = {
          action: 'reject',
          remark: remark !== null ? remark : '',
        };

        let requestParameters: IAdminDataRequestParameters = {
          ...localFilters,
          function: 'data',
          item: 'cash_advance_request',
          employee: employee,
          page: page,
        };

        if (requestId !== undefined) {
          respondToCashAdvanceRequest(requestId, data, requestParameters);
          setCashAdvanceRejectionModalVisible(false);
        }
        setConfirmLoading(false);
      }}
      onCancel={() => {
        onClose();
      }}
    >
      <div className='wrapper'>
        <div className='field'>
          <div className='required message'>
            <Trans>Remark</Trans>
          </div>
          <Input
            placeholder='Remark/Comment'
            onChange={event => {
              if (event.target.value !== undefined) {
                if (event.target.value.trim().length > 0) {
                  setRemark(event.target.value);
                  setOkButtonDisabled(false);
                } else {
                  setOkButtonDisabled(true);
                }
              }
            }}
          />
        </div>
      </div>
    </Modal>
  );
};

export default memo(CashAdvanceRejectionModal);
