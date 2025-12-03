import React from 'react';
import moment from 'moment';
import { Card, Button } from 'antd';
import {
  LeftOutlined,
  RightOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import { appPath } from '../../../../app/app.routes';
import {
  DocumentsViewer,
  Remarks,
  Amount,
  ReceiptViewer,
} from '../../../../../shared/components';
import { Trans } from '@lingui/macro';

const initial = 300;

const CardItem = (props: any) => {
  const {
    date,
    title,
    itemNumber,
    remarkType,
    receipt = null,
    attachments = [],
    total_comments,
    _onRemarkAdded,
    itemId,
    amount,
    currency,
    index,
    total,
    total_receipt = null,
    documentType,
    onNextClick,
    onPrevClick,
    footerRight = 'SUBMIT',
    footerLeft = 'View Details',
    isFooterRightEnable = true,
    footerRightAction,
    footerLeftAction,
    attachedRequestCount,
    history,
    userView,
    children,
    category,
    closeRemarkOnAdd = false,
    getViolationTitleWithIcons,
  } = props;

  const onRequestIconClick = () => {
    if (attachedRequestCount)
      history.push(`${appPath.submitted.expenses.linkTo}${itemId}`);
  };
  const renderDate = () => {
    let newTitle = date;
    if (date) {
      if (date.includes('-')) {
        const titleData = date.split('-');
        newTitle = moment(titleData[0], ['DD/MM/YYYY']).format('DD MMM');
        newTitle += ' - ';
        newTitle += moment(titleData[1], ['DD/MM/YYYY']).format('DD MMM');
      } else {
        newTitle = moment(date, ['DD/MM/YYYY']).format('DD MMM');
      }
    }

    return newTitle;
  };

  return (
    <Card
      key={itemNumber}
      className='card'
      style={{
        left: index * 4,
        top: 18 - index * 6,
        zIndex: (total - index) * 100,
        width: initial - index * 8,
      }}
    >
      {children ? (
        children
      ) : (
        <div className='card-content'>
          {getViolationTitleWithIcons && (
            <div className='icon-wrapper'>{getViolationTitleWithIcons} </div>
          )}
          <div className='date'>{renderDate()}</div>
          <div className='type'>{title}</div>
          <div className='category'>{category}</div>
          <div className='item-number'>{userView ? userView : itemNumber}</div>

          <div className='extra'>
            <div className='iconed-stats'>
              <div className='stat'>
                {/* <PaperClipOutlined className='icon' />
            <div className='number'>{dataItem}</div> */}
                {total_receipt === null ? (
                  <DocumentsViewer
                    documents={attachments}
                    receipt={receipt}
                    itemType={documentType}
                    itemNumber={itemNumber}
                  />
                ) : (
                  <ReceiptViewer
                    itemId={itemId}
                    itemType={remarkType}
                    itemNumber={itemNumber}
                    count={total_receipt}
                  />
                )}
              </div>
              <div className='stat'>
                {/* <CommentOutlined className='icon' />
            <div className='number'>0</div> */}
                <Remarks
                  remarkCount={total_comments || 0}
                  itemId={itemId}
                  itemType={remarkType}
                  item_no={itemNumber}
                  onRemarkAdded={_onRemarkAdded}
                  closeRemarkOnAdd={closeRemarkOnAdd}
                />
              </div>
              {attachedRequestCount !== undefined && (
                <div className='stat'>
                  <UnorderedListOutlined
                    // className='icon'
                    onClick={onRequestIconClick}
                  />
                  <span
                    className={
                      attachedRequestCount === 0
                        ? 'itemCount disabled'
                        : 'itemCount'
                    }
                    style={{ marginLeft: 8 }}
                  >
                    {attachedRequestCount}
                  </span>
                </div>
              )}
            </div>
            <div className='amount'>
              {amount && currency ? (
                <Amount amount={amount || 0} currency={currency} />
              ) : null}
            </div>
          </div>
          <div className='hr' />
          <div className='footer'>
            <div className='action'>
              {typeof footerLeft === 'string' ? (
                <Button
                  type='link'
                  className='view-details-button'
                  onClick={footerLeftAction}
                >
                  <Trans>View Details</Trans> <RightOutlined />
                </Button>
              ) : (
                footerLeft
              )}
            </div>
            <div className='action.right'>
              {typeof footerRight === 'string' && isFooterRightEnable ? (
                <Button
                  className='action-button'
                  type='link'
                  onClick={footerRightAction}
                >
                  {footerRight}
                </Button>
              ) : (
                footerRight
              )}
            </div>
          </div>
          {total > 1 && (
            <div className='navigators'>
              <div className='navigator'>
                <LeftOutlined onClick={onPrevClick} />
              </div>
              <div className='navigator'>
                <RightOutlined onClick={onNextClick} />
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

export default CardItem;
