import React, { useState } from 'react';
import {
  MoreOutlined,
  DeleteOutlined,
  UndoOutlined,
  EditOutlined,
  ToolOutlined,
  ToolFilled,
} from '@ant-design/icons';

import './entityCard.index.less';
import { IEntityCardProps } from './entityCard.model';
import { DotMenu, ConfirmationModal } from '..';
import { Trans } from '@lingui/macro';
import { actionBtnObjInterface } from '../dotMenu/dotMenu.model';
import { Button } from 'antd';
import ErrorBoundary from '../errorBoundary/errorBoundary.index';

const EntityCard: React.FC<IEntityCardProps> = ({
  more,
  isCustomizeHidden,
  onDetailClick,
  title,
  subTitle,
  isCustomConfig,
  onDelete,
  onReset,
  onCustomize,
  isDotMenuHidden,
}) => {
  const [showRemoveConfirmModal, setShowRemoveConfirmModal] = useState(false);
  const [showResetConfirmModal, setShowResetConfirmModal] = useState(false);
  const onDeleteConfirmation = () => {
    setShowRemoveConfirmModal(true);
  };

  const onResetConfirmation = () => {
    setShowResetConfirmModal(true);
  };
  const actions: actionBtnObjInterface[] = [
    {
      children: <Trans>Remove</Trans>,
      icon: DeleteOutlined,
      OnClick: onDeleteConfirmation,
      Type: 'default',
    },
  ];
  if (!isCustomizeHidden) {
    actions.push({
      children: <Trans>Customize</Trans>,
      icon: EditOutlined,
      OnClick: onCustomize,
      Type: 'default',
    });
  }
  if (isCustomConfig) {
    actions.push({
      children: <Trans>Reset To Default</Trans>,
      icon: UndoOutlined,
      OnClick: onResetConfirmation,
      Type: 'default',
    });
  }
  return (
    <ErrorBoundary>
      <div className='entity-card-container'>
        <div className='container'>
          <div className='title-container'>
            <div className='title' title={title}>
              {title}
            </div>
            {!isDotMenuHidden && (
              <DotMenu
                actionBtn={more && more.length > 0 ? more : actions}
                showInMenu={true}
              >
                <MoreOutlined />
              </DotMenu>
            )}
          </div>
          {subTitle && <div className='sub-title'>{subTitle}</div>}
        </div>

        <div className='hr' />

        <div className='details-button'>
          <Button
            type='link'
            className='details-button'
            onClick={onDetailClick}
            title={`View ${
              isCustomConfig ? 'Customize' : 'Default'
            } Configuration`}
          >
            {isCustomConfig ? <ToolFilled /> : <ToolOutlined />}
            <span style={{ marginLeft: 6 }}>
              <Trans>View Configuration</Trans>
            </span>
          </Button>
        </div>
        <ConfirmationModal
          visible={showRemoveConfirmModal}
          onCancelClick={() => setShowRemoveConfirmModal(false)}
          onOkClick={() => {
            if (onDelete) {
              setShowRemoveConfirmModal(false);
              onDelete();
            }
          }}
          okText='Remove'
          isConfirmModel={true}
          header={<Trans>Do you want to remove entity</Trans>}
          extraModelProps={{ destroyOnClose: true }}
        />
        <ConfirmationModal
          visible={showResetConfirmModal}
          onCancelClick={() => setShowResetConfirmModal(false)}
          onOkClick={() => {
            if (onReset) {
              setShowResetConfirmModal(false);
              onReset();
            }
          }}
          okText='Reset'
          isConfirmModel={true}
          header={<Trans>Do you want to reset configuration</Trans>}
          extraModelProps={{ destroyOnClose: true }}
        />
      </div>
    </ErrorBoundary>
  );
};

export default EntityCard;
