import React, { FC, memo, useState, Dispatch, useRef } from 'react';
import { Button, Modal, Row, Col, Input, message } from 'antd';
import { MessageOutlined } from '@ant-design/icons';
import { ModalProps } from 'antd/lib/modal';
import { ErrorBoundary, ElementOrSkeleton } from '../';
import { remarkType, IRemark } from '../../../pages/app/app.model';
import { connect, ConnectedProps } from 'react-redux';
import { fetchRemarks, addRemarkById } from '../../../pages/app/app.thunk';
import './remarks.index.less';
import { getUser } from '../../redux/rootReducer';
import moment from 'moment';
import 'moment-timezone';
import { Form } from 'antd';
import { Trans } from '@lingui/macro';

const Remarks: FC<{
  remarkCount: number;
  itemId: number;
  itemType: remarkType;
  onRemarkAdded?: () => void;
  modalProps?: ModalProps;
  item_no: string;
  showAddButton?: boolean;
  closeRemarkOnAdd?: boolean;
} & ConnectedProps<typeof connector>> = ({
  remarkCount,
  itemId,
  itemType,
  children,
  modalProps,
  timezone,
  item_no,
  _fetchRemarks,
  _addRemark,
  onRemarkAdded,
  showAddButton = true,
  closeRemarkOnAdd,
}) => {
  const inputDivRef = useRef<any>(null);
  // const [currentId, setCurrentId] = useState(-1);
  const [comment, setComment] = useState('');
  const [remarks, setRemarks] = useState<IRemark[] | undefined>(undefined);
  const [remarksLoader, setRemarksLoader] = useState<boolean>(false);
  const [totalRemarks, setTotalRemarks] = useState(remarkCount);
  const [backendError, setBackendError] = useState('');
  // const [isLoading,setLoading]
  const remarkIconClick = () => {
    // message.loading('loading remarks', 0);
    setRemarksLoader(true);
    _fetchRemarks(itemType, itemId, (records, error) => {
      message.destroy();
      if (error) {
        message.error(error);
        setRemarksLoader(false);
      } else {
        setTotalRemarks(records?.length || remarkCount);
        setRemarks(records);
        inputDivRef?.current &&
          inputDivRef.current.scrollIntoView({ behavior: 'smooth' });
        setRemarksLoader(false);
      }
    });
    // setCurrentId(remarkId);
  };

  const addComment = () => {
    if (comment.trim() === '') {
      return message.error('Enter remark to add');
    }
    message.loading('adding remark', 0);
    _addRemark(
      itemType,
      itemId,
      { comment },
      (success, error, responseError) => {
        message.destroy();
        if (error && responseError) {
          message.error(error);
          if (responseError?.details) {
            setBackendError(responseError?.details[0]);
          }
        } else {
          // setRemarks(undefined);
          if (closeRemarkOnAdd) {
            setRemarks(undefined);
          } else {
            remarkIconClick();
          }
          setComment('');
          setBackendError('');
          // message.success(success);
          onRemarkAdded && onRemarkAdded();
        }
      },
    );
  };

  const isModalVisible = (remarks && remarks instanceof Array) || remarksLoader;
  return (
    <ErrorBoundary>
      <div className='remarks-container'>
        <Button
          type='primary'
          className='remark-button-with-count'
          // onClick={totalRemarks > 0 ? remarkIconClick : undefined}
          onClick={remarkIconClick}
        >
          {children ? (
            children
          ) : (
            <>
              <MessageOutlined />
              <span className='itemCount'>{totalRemarks || 0}</span>
            </>
          )}
        </Button>
        <Modal
          onCancel={() => {
            setComment('');
            setRemarks(undefined);
            setBackendError('');
          }}
          visible={isModalVisible}
          {...modalProps}
          // title={`Remarks . ${remarks?.length} ${
          //   itemType === 'expense-claims' ? 'Expense No' : 'Request No'
          // }-${item_no}`}
          title={
            <>
              <span
                style={{ fontWeight: 600 }}
              >{`Remarks . ${remarks?.length} `}</span>
              <span style={{ fontSize: 14, marginLeft: 2 }}>{`  ${
                itemType === 'expense-claims' ? 'Expense No' : 'Request No'
              } : ${item_no}`}</span>
            </>
          }
          footer={null}
          className='remark-modal'
          destroyOnClose={true}
          bodyStyle={{ padding: 0 }}
          // getContainer='.remarks-container'
        >
          {remarksLoader ? (
            <div
              style={{
                padding: '10px',
              }}
            >
              <ElementOrSkeleton
                isLoading={true}
                type='profilelist'
                profileListConfiguration={{ rows: 3 }}
              />
            </div>
          ) : (
            <div className='remark-div'>
              <div className='remarks'>
                {remarks && remarks instanceof Array
                  ? remarks.map(item => (
                      <RemarkItem
                        item={item}
                        timeZone={timezone}
                        key={item.id}
                      />
                    ))
                  : null}
                <div
                  ref={inputDivRef}
                  style={{ float: 'left', clear: 'both' }}
                ></div>
              </div>

              {showAddButton !== false && (
                <Form>
                  <Form.Item
                    name='remark'
                    validateStatus={backendError ? 'error' : 'validating'}
                    help={backendError ? backendError : null}
                    rules={[
                      () => ({
                        validator(_, value) {
                          if (value !== undefined) {
                            value = value?.trim();
                          }

                          if (new RegExp(/^[^@!=\-+#﹘—⸺⸻].*$/).test(value)) {
                            return Promise.resolve();
                          }
                          if (!value || value === undefined) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            new Error('Can not start with special character'),
                          );
                        },
                      }),
                    ]}
                  >
                    <Row style={{ padding: 24 }}>
                      <Col flex='auto'>
                        <Input.TextArea
                          placeholder='Type here to add new remark'
                          value={comment}
                          onChange={event => {
                            setComment(event.target.value);
                          }}
                          // onPressEnter={() => comment.trim() !== '' && addComment()}
                          autoSize={{ maxRows: 2, minRows: 1 }}
                        />
                      </Col>
                      <Col flex='50px'>
                        <Button
                          type='link'
                          onClick={addComment}
                          disabled={
                            comment.trim() === '' ||
                            !new RegExp(/^[^@!=\-+#﹘—⸺⸻].*$/).test(
                              comment.trim(),
                            )
                          }
                        >
                          <Trans>Add</Trans>
                        </Button>
                      </Col>
                    </Row>
                  </Form.Item>
                </Form>
              )}
            </div>
          )}
        </Modal>
      </div>
    </ErrorBoundary>
  );
};

const mapStateToProps = (state: any) => ({
  timezone: getUser(state)?.timezone?.title || 'UTC',
});

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  _fetchRemarks: (
    type: remarkType,
    id: number,
    callback?: (success?: IRemark[], error?: string) => void,
  ) => dispatch(fetchRemarks(type, id, callback)),
  _addRemark: (
    type: remarkType,
    id: number,
    body: any,
    callback?: (success?: string, error?: string, responseError?: any) => void,
  ) => dispatch(addRemarkById(type, id, body, callback)),
});

const connector = connect(mapStateToProps, mapDispatchToProps);
export default connector(memo(Remarks));
// export default Remarks;

const RemarkItem: React.FC<{ item: IRemark; timeZone: string }> = ({
  item,
  timeZone,
}) => (
  <div className='remark-item-container'>
    <div className='container'>
      <img
        src={
          item.created_by_profile_url
            ? item.created_by_profile_url
            : require('../../../assets/images/default/user.png')
        }
        alt='profile'
      />
      <div className='info-container'>
        <div className='user-name'>
          {item.created_by.legal_name || item.created_by.name}
        </div>
        <div className='comment'>{item.comment}</div>
        <div className='date-time'>
          {moment
            .utc(item.created_on, ['DD/MM/YYYYTHH:mm:ss[.mmm]TZD'])
            .tz(timeZone)
            .format('DD MMM YY : HH:mm')
            .replace(':', 'at')}
        </div>
      </div>
    </div>
  </div>
);
