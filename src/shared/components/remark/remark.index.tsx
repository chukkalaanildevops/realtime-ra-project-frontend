import React, { FC, memo, useState, ReactNode } from 'react';
import { Button, Modal } from 'antd';
import { MessageOutlined } from '@ant-design/icons';
import { ModalProps } from 'antd/lib/modal';
import { ErrorBoundary } from '../';

const Remark: FC<{
  remark: string;
  children?: ReactNode;
  btnClassName?: string;
  modalProps?: ModalProps;
}> = props => {
  const { remark, children, btnClassName, modalProps } = props;
  const [getVisibility, setVisibility] = useState<boolean>(false);

  return (
    <ErrorBoundary>
      <Button
        type='primary'
        style={{
          border: 'none',
          backgroundColor: 'inherit',
          color: 'inherit',
          boxShadow: 'inherit',
          padding: 4,
        }}
        onClick={() => setVisibility(true)}
        disabled={!remark}
        className={`remark-btn ${btnClassName || ''}`}
      >
        {children ? (
          children
        ) : (
          <>
            <MessageOutlined className={remark ? 'icons' : 'icons disabled'} />
            {Boolean(remark) ? (
              <span className='itemCount'>1</span>
            ) : (
              <span className='itemCount disabled'>0</span>
            )}
          </>
        )}
      </Button>
      <Modal
        onCancel={() => setVisibility(false)}
        visible={getVisibility}
        {...modalProps}
        title='Remark'
        footer={null}
      >
        <p>{remark}</p>
      </Modal>
    </ErrorBoundary>
  );
};

export default memo(Remark);
