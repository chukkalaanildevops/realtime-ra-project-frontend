import React, { useState, useEffect } from 'react';
import './approvalResponseButton.index.less';
import {
  IApprovalResponseData,
  IBulkApprovalResponseData,
} from '../../approvals.model';
import { Button } from 'antd';
import {
  CheckOutlined,
  CloseOutlined,
  // ExclamationCircleOutlined,
} from '@ant-design/icons';
import ApprovalResponseCommentModal from '../../../../shared/components/approvalResponseCommentModal/approvalResponseCommentModal.index';
import BulkApprovalConfirmationModal from './bulkApprovalConfirmationModal/bulkApprovalConfirmationModal.index';
import { isPendingStatusInQuery } from '../../../../utils/global.utils';

const GroupedItemResponseButton = (props: {
  title: string;
  disabled: boolean;
  action: string;
  onClick: (data: IBulkApprovalResponseData) => void;
  isButtonFilled: boolean;
  responseData: IBulkApprovalResponseData;
  allItemsInfo: any[];
  isLoading?: boolean;
  isTrafficLightEnable?: boolean;
}) => {
  const [showModal, setShowModal] = useState(false);
  let className = props.isButtonFilled ? 'filled' : 'outlined';
  useEffect(() => {
    if (props.isLoading && showModal) {
      setShowModal(false);
    }
  }, [props.isLoading, showModal]);
  return (
    <>
      <Button
        size='small'
        shape='circle'
        title={props.title}
        disabled={props.disabled || !isPendingStatusInQuery()}
        icon={
          props.action === 'approve' ? <CheckOutlined /> : <CloseOutlined />
        }
        className={
          props.action === 'approve'
            ? `${className} approve-item-button`
            : `${className} reject-item-button`
        }
        onClick={event => {
          event.stopPropagation();
          setShowModal(true);
        }}
      />
      <span onClick={e => e.stopPropagation()}>
        <BulkApprovalConfirmationModal
          key={`BulkApprovalConfirmationModal_${props.responseData.action}_${
            props.responseData.item
          }_${props.allItemsInfo.length ? props.allItemsInfo[0].id : ''}`}
          onOk={data => {
            setShowModal(false);
            props.onClick(data);
          }}
          onCancel={() => {
            setShowModal(false);
          }}
          action={props.action}
          isLoading={props.isLoading || false}
          responseData={props.responseData}
          visibility={showModal}
          allItemsInfo={props.allItemsInfo}
          isTrafficLightEnable={props.isTrafficLightEnable}
        />
      </span>
    </>
  );
};

const SingleItemResponseButton: React.FC<{
  item: string;
  action: string;
  disabled: boolean;
  onConfirmOk: (data: IApprovalResponseData) => void;
  responseData: IApprovalResponseData;
}> = props => {
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <>
      <Button
        size='small'
        shape='circle'
        disabled={props.disabled || !isPendingStatusInQuery()}
        title={props.action === 'approve' ? 'Approve' : 'Reject'}
        className={
          props.action === 'approve'
            ? 'single-item-approval-button'
            : 'single-item-rejection-button'
        }
        icon={
          props.action === 'approve' ? <CheckOutlined /> : <CloseOutlined />
        }
        onClick={event => {
          event.stopPropagation();
          setModalVisible(true);
        }}
      />
      <ApprovalResponseCommentModal
        action={props.action}
        visible={modalVisible}
        responseData={props.responseData}
        onConfirmOk={(responseData: IApprovalResponseData) => {
          props.onConfirmOk(responseData);
        }}
        setModalVisible={(isVisible: boolean) => {
          setModalVisible(isVisible);
        }}
      />
    </>
  );
};

export { GroupedItemResponseButton, SingleItemResponseButton };
