import React from 'react';
import { Drawer, Button } from 'antd';
import { IDrawerProps } from './appDrawer.modal';
import './appDrawer.index.less';
import { Trans } from '@lingui/macro';

export const AppDrawer: React.FC<IDrawerProps> = ({
  showCancelButton = true,
  showOkButton = true,
  OkText = <Trans>Create</Trans>,
  cancelText = <Trans>Cancel</Trans>,
  onCancelClick = () => {},
  onOkClick = () => {},
  footer = null,
  width = '60%',
  maskClosable = true,
  keyboard = false,
  isLoading = false,
  children,
  headerStyle = { fontSize: '32px', fontWeight: 'bold' },
  isBoldTitle = true,
  ...rest
}) => {
  return (
    <Drawer
      footer={footer}
      width={width}
      maskClosable={maskClosable}
      keyboard={keyboard}
      headerStyle={headerStyle}
      closable={false}
      destroyOnClose={true}
      getContainer='#root'
      {...rest}
      className={'app-component-drawer ' + rest.className}
      title={isBoldTitle ? <strong>{rest.title}</strong> : rest.title}
      data-testid='appDrawer'
    >
      {children}
      <div className='buttonWrapper'>
        {showCancelButton && (
          <Button
            className='bottomButtons'
            data-test='backButton'
            type='primary'
            ghost
            disabled={isLoading}
            onClick={onCancelClick}
          >
            {cancelText}
          </Button>
        )}
        {showOkButton && (
          <Button
            className='bottomButtons'
            data-test='okButton'
            type='primary'
            loading={isLoading}
            onClick={onOkClick}
          >
            {OkText}
          </Button>
        )}
      </div>
    </Drawer>
  );
};
