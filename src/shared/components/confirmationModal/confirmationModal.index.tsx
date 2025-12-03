import React, { FC, memo, ReactNode } from 'react';
import { Modal, Button } from 'antd';
import { ModalProps } from 'antd/lib/modal/Modal';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import './confirmationModal.index.less';

const ConfirmationModal: FC<{
  visible: boolean;
  isConfirmModel?: boolean;
  onOkClick?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  onCancelClick?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  icon?: ReactNode;
  okText?: string | ReactNode | null;
  cancelText?: string | ReactNode | null;
  header?: string | ReactNode;
  body?: string | ReactNode;
  extraModelProps?: ModalProps;
}> = props => {
  const {
    visible,
    okText = 'Ok',
    onOkClick,
    cancelText = 'Cancel',
    onCancelClick,
    icon,
    header = 'Do you want to continue?',
    body,
    extraModelProps = {},
  } = props;

  return (
    <Modal
      className='confirmation-modal'
      title={null}
      visible={visible}
      footer={null}
      width={400}
      centered={true}
      closable={false}
      {...extraModelProps}
    >
      <span className='icon'>
        {icon ? (
          icon
        ) : (
          <ExclamationCircleOutlined style={{ color: '#faad14' }} />
        )}
      </span>
      {header && visible && (
        <span className='ant-modal-confirm-title'>{header}</span>
      )}
      {body && visible && (
        <div className='ant-modal-confirm-content'>{body}</div>
      )}
      {extraModelProps?.footer !== null && (
        <div className='footer'>
          {cancelText && visible && (
            <Button type='default' onClick={onCancelClick && onCancelClick}>
              {cancelText}
            </Button>
          )}
          {okText && visible && (
            <Button type='primary' onClick={onOkClick && onOkClick}>
              {okText}
            </Button>
          )}
        </div>
      )}
    </Modal>
  );
};

export default memo(ConfirmationModal);
