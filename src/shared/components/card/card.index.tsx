import React, { memo } from 'react';

import { Checkbox, Button, Col, Row } from 'antd';
import {
  MoreOutlined,
  // MessageOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import { DotMenu, StatusTag, Remarks, Amount } from '..';
import './card.index.less';
import moment from 'moment';
import { CARD_STATUS_COLORS } from '../../model';
import { ICardProps } from './card.model';
import { Trans } from '@lingui/macro';

const DraftCard: React.FC<ICardProps> = ({
  checkboxProps = {},
  checked,
  title,
  actions,
  code,
  requestNumber,
  type,
  currency,
  status,
  actionText = 'SUBMIT',
  isActionDisabled = false,
  receipts,
  remarks,
  canClaimExpense,
  request,
  id,
  cardType,
  expenseType,
  onRequestsClick,
  onChecked = () => {},
  onDetails,
  onMainAction,
  handleStatusTagClick,
  onRemarkAdded,
  canSelectItem = true,
  category,
  hideMainAction = false,
  backgroundClass = '',
  getViolationTitleWithIcons,
}) => {
  const statusData = CARD_STATUS_COLORS[(status?.title || '').toUpperCase()];

  const renderTitle = () => {
    let newTitle = title;
    if (title) {
      if (title.includes('-')) {
        const titleData = title.split('-');
        newTitle = moment(titleData[0], ['DD/MM/YYYY']).format('DD MMM YYYY');
        newTitle += ' - ';
        newTitle += moment(titleData[1], ['DD/MM/YYYY']).format('DD MMM YYYY');
      } else {
        newTitle = moment(title, ['DD/MM/YYYY']).format('DD MMM YYYY');
      }
    }

    return newTitle;
  };

  const onRequestIconClick = () => {
    if (request?.length === 0) {
      return;
    }
    if (onRequestsClick) {
      onRequestsClick();
    } else {
      // implement default functionality
    }
  };

  return (
    <div
      className={`card-inner ${backgroundClass}`}
      style={{ borderRadius: 4, border: '1px solid #EBF1F8', padding: 12 }}
    >
      <div
        className='heading'
        style={{ display: 'flex', justifyContent: 'space-between' }}
      >
        {canSelectItem ? (
          <Checkbox
            checked={checked}
            onChange={e => onChecked(e.target.checked)}
            {...checkboxProps}
          />
        ) : (
          <div />
        )}
        <div style={{ color: '#262626' }}>{renderTitle()}</div>
        {actions.length > 0 ? (
          <DotMenu actionBtn={actions} showInMenu={true}>
            <MoreOutlined style={{ fontSize: 18 }} />
          </DotMenu>
        ) : (
          <div />
        )}
      </div>
      <div style={{ marginTop: 12, marginBottom: 12 }}>
        <div
          className='card-status-line'
          style={{ background: statusData?.line }}
        />
        <div className='status-tag'>
          {/* <Tag
            color={statusData?.primary}
            style={{
              zIndex: 1,
              backgroundColor: statusData?.bgColor,
            }}
          >
            {status[0].toUpperCase() + status.substr(1, status.length)}
          </Tag> */}
          <StatusTag
            status={status}
            onStatusClick={
              handleStatusTagClick &&
              handleStatusTagClick.bind(null, id as number)
            }
          />
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div
          className='item-type-text' /* style={{ color: '#68737D' }} */
          title={type}
        >
          {type}
        </div>
        <div title={category} className='item-type-category'>
          {category}
        </div>
        <div
          className='item-code-text' /* style={{ color: '#262626' }} */
          title={code}
        >
          {code}
        </div>
        {expenseType === 'expenses_with_request' ? (
          <Button
            type='link'
            className='item-request-number-text'
            onClick={() => onDetails && onDetails('expenses-with-request')}
          >
            {requestNumber}
          </Button>
        ) : null}
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: 12,
          marginBottom: 12,
          alignItems: 'center',
        }}
      >
        <Row gutter={16} align='middle'>
          {/* {receipts && (
            <Col>
              <PaperClipOutlined
                className={receipts.length === 0 ? 'disabled' : ''}
              />
              <span
                className={
                  receipts.length === 0 ? 'itemCount disabled' : 'itemCount'
                }
              >
                {receipts.length}
              </span>
            </Col>
          )} */}
          {receipts && <Col>{receipts}</Col>}

          {remarks !== undefined && remarks !== null ? (
            <Col>
              {/* <MessageOutlined
                className={remarks.length === 0 ? 'disabled' : ''}
              />
              <span
                className={
                  remarks.length === 0 ? 'itemCount disabled' : 'itemCount'
                }
              >
                {remarks.length}
              </span> */}
              <Remarks
                remarkCount={remarks}
                itemId={id as number}
                itemType={cardType}
                onRemarkAdded={onRemarkAdded}
                item_no={code}
              />
            </Col>
          ) : null}
          {request && (
            <Col>
              <UnorderedListOutlined
                className={
                  request.length === 0 || !canClaimExpense ? 'disabled' : ''
                }
                onClick={onRequestIconClick}
              />
              <span
                className={
                  request.length === 0 ? 'itemCount disabled' : 'itemCount'
                }
              >
                {request.length}
              </span>
            </Col>
          )}
        </Row>

        <div>
          {currency ? (
            <Amount currency={currency.currency} amount={currency.amount} />
          ) : null}
        </div>
      </div>
      <div style={{ height: 1, background: '#F5F8FB' }} />
      <div
        className={hideMainAction ? 'footer center' : 'footer'}
        // style={{ display: 'flex', justifyContent: 'space-between' }}
      >
        {getViolationTitleWithIcons && getViolationTitleWithIcons}
        <Button type='link' onClick={() => onDetails && onDetails('expense')}>
          <Trans>View Details</Trans>
        </Button>
        {!hideMainAction && (
          <div>
            <Button
              type='link'
              disabled={isActionDisabled || (request && !canClaimExpense)}
              onClick={onMainAction}
            >
              {actionText}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
export default memo(DraftCard);
