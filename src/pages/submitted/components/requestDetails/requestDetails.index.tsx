import React, { Dispatch, memo, useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Row, Col, Button } from 'antd';
import { SwapRightOutlined } from '@ant-design/icons';
import moment from 'moment';
import {
  ErrorBoundary,
  Amount,
  AppDrawer,
  StatusTag,
} from '../../../../shared/components';
import '../../submitted.index.less';
import { IWorkflowStatus } from '../../../../shared/model';
import RequestDrawerDetails from '../../../request/detail/requestDetail.index';
import { IfetchWorkFlowDataProps } from '../../../app/app.model';
import { fetchWorkFlowData } from '../../../app/app.thunk';
import Table from 'antd/lib/table';
import { Trans } from '@lingui/macro';

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  _fetchWorkFlowData: (props: IfetchWorkFlowDataProps) =>
    dispatch(fetchWorkFlowData(props)),
});

const connector = connect(undefined, mapDispatchToProps);

const RequestDetails: React.FC<ConnectedProps<typeof connector> & {
  requestDetails: any;
  showRequestDetailDrawer?: boolean;
}> = ({
  requestDetails,
  showRequestDetailDrawer = false,
  _fetchWorkFlowData,
}) => {
  const [getDrawerDetails, setDrawerDetails] = useState<any | null>(null);
  const [getTravelFlightDetails, setTravelFlightDetails] = useState<any | null>(
    null,
  );
  if (!requestDetails) {
    return null;
  }

  let duration = 0;
  if (requestDetails) {
    let startDate = moment(requestDetails.start_date, 'DD/MM/YYYY');
    let endDate = moment(requestDetails.end_date, 'DD/MM/YYYY');
    duration = endDate.diff(startDate, 'days');
    duration += 1;
  }

  return (
    <ErrorBoundary>
      <div className='request-details-container'>
        <Row gutter={24}>
          <Col flex='auto' xs={24} sm={24} md={18}>
            <Row gutter={12}>
              <Col span={5}>
                <div className='label'>
                  <Trans>Request ID#</Trans>
                </div>
                <div className='value'>
                  {showRequestDetailDrawer ? (
                    <Button
                      type='link'
                      onClick={() => setDrawerDetails(requestDetails)}
                      style={{
                        padding: 0,
                      }}
                    >
                      {requestDetails.request_no}
                    </Button>
                  ) : (
                    requestDetails.request_no
                  )}
                </div>
              </Col>
              <Col span={5}>
                <div className='label'>
                  <Trans>Request Type</Trans>
                </div>
                <div className='value'>{requestDetails?.request_type}</div>
              </Col>
              <Col span={5}>
                <div className='label'>
                  <Trans>Dates</Trans>
                </div>
                <div className='value'>{`${requestDetails?.start_date} - ${requestDetails?.end_date}`}</div>
              </Col>
              <Col span={5}>
                <div className='label'>
                  <Trans>Duration</Trans>
                </div>
                <div className='value'>
                  {duration} {duration <= 1 ? 'Day' : 'Days'}
                </div>
              </Col>
            </Row>
            <Row gutter={12} style={{ marginTop: 24 }}>
              <Col span={5}>
                <div className='label'>
                  <Trans>Cost Estimation</Trans>
                </div>
                <div className='value'>
                  <Amount
                    currency={requestDetails.currency}
                    amount={requestDetails.total_cost_estimation || 0}
                    noStyle
                  />
                </div>
              </Col>
              <Col span={5}>
                <div className='label'>
                  <Trans>Charge To</Trans>
                </div>
                <div className='value'>
                  {requestDetails?.charge_to?.title || (
                    <span style={{ marginLeft: 36 }}>-</span>
                  )}
                </div>
              </Col>
              <Col span={5}>
                <div className='label'>
                  <Trans>Cost Centre</Trans>
                </div>
                <div className='value'>
                  {requestDetails.cost_centres || (
                    <span style={{ marginLeft: 36 }}>-</span>
                  )}
                </div>
              </Col>
              {requestDetails?.travel_itineraries?.length ||
              requestDetails?.departure_from ||
              requestDetails?.arrival_at ? (
                <Col
                  span={8}
                  className={`trip-detail-parent ${
                    requestDetails?.travel_itineraries.length > 1
                      ? 'more-than-one-item'
                      : ''
                  }`}
                >
                  <div className='label'>
                    <Trans>Depart - Arrive</Trans>
                  </div>
                  <div className='value' style={{ overflow: 'auto' }}>
                    {`${
                      requestDetails?.travel_itineraries?.length
                        ? requestDetails?.travel_itineraries[0].source || ''
                        : requestDetails?.departure_from || ''
                    } `}
                    <SwapRightOutlined />
                    {` ${
                      requestDetails?.travel_itineraries?.length
                        ? requestDetails?.travel_itineraries[0].destination ||
                          ''
                        : requestDetails?.arrival_at || ''
                    }`}
                    {requestDetails?.travel_itineraries.length > 1 ? (
                      <Button
                        type='link'
                        title='Click to see more'
                        className='more-trip-details-button'
                        onClick={() => {
                          setTravelFlightDetails(
                            requestDetails?.travel_itineraries,
                          );
                        }}
                      >
                        ...{requestDetails?.travel_itineraries.length - 1} more
                      </Button>
                    ) : null}
                  </div>
                </Col>
              ) : null}
            </Row>
            {requestDetails.cash_advance_request && (
              <Row gutter={12}>
                <div
                  style={{
                    width: '100%',
                    height: 1,
                    marginTop: 12,
                    marginBottom: 12,
                    background: '#c5d6e7',
                  }}
                />
                <Col span={5}>
                  <div className='label'>
                    <Trans>Cash Advance Requested</Trans>
                  </div>
                  <div className='value'>
                    <Amount
                      currency={requestDetails.currency}
                      amount={
                        requestDetails.cash_advance_request.amount_requested ||
                        0
                      }
                      noStyle
                    />
                  </div>
                </Col>
                <Col span={5}>
                  <div className='label'>
                    <Trans>Status</Trans>
                  </div>
                  <div className='value'>
                    {requestDetails.cash_advance_request.status.title || 0}
                  </div>
                </Col>
                {requestDetails.cash_advance_request.status.code ===
                  'REJCTD' && (
                  <Col span={12}>
                    <div className='label'>
                      <Trans>Reason</Trans>
                    </div>
                    <div className='value'>
                      {requestDetails.cash_advance_request.remark}
                    </div>
                  </Col>
                )}
                {requestDetails.cash_advance_request.status.code ===
                  'DISBSD' && (
                  <>
                    <Col span={3}>
                      <div className='label'>
                        <Trans>Disbursed Amount</Trans>
                      </div>
                      <div className='value'>
                        <Amount
                          currency={requestDetails.currency}
                          amount={
                            requestDetails.cash_advance_request.amount_disbursed
                          }
                          noStyle
                        />
                      </div>
                    </Col>
                    <Col span={3}>
                      <div className='label'>
                        <Trans>Balance Amount</Trans>
                      </div>
                      <div className='value'>
                        <Amount
                          currency={requestDetails.currency}
                          amount={
                            (requestDetails.cash_advance_request
                              .amount_disbursed || 0) -
                              (requestDetails.total_expense_amounts
                                ?.total_amount || 0) <
                            0
                              ? 0
                              : (requestDetails.cash_advance_request
                                  .amount_disbursed || 0) -
                                (requestDetails.total_expense_amounts
                                  ?.total_amount || 0)
                          }
                          noStyle
                        />
                      </div>
                    </Col>
                    <Col span={7}>
                      <div className='label'>
                        <Trans>Reason</Trans>
                      </div>
                      <div className='value'>
                        {requestDetails.cash_advance_request.remark}
                      </div>
                    </Col>
                  </>
                )}
              </Row>
            )}
          </Col>
          <Col flex='20px' xs={0} sm={0} lg={1}>
            <div
              style={{
                width: 1,
                height: '100%',
                marginTop: '20%',
                backgroundColor: '#A1B2C2',
              }}
            />
          </Col>
          <Col xs={24} sm={24} md={5}>
            <div className='label'>
              <Trans>'Amount:</Trans>
            </div>
            <div>
              <div className='amount-container'>
                <div className='label amount-label'>
                  <Trans>Total</Trans>
                </div>
                <div className='amount-value'>
                  <Amount
                    currency={requestDetails.currency}
                    amount={
                      requestDetails?.total_expense_amounts?.total_amount || 0
                    }
                    noStyle
                  />
                </div>
              </div>
              <div className='amount-container'>
                <div className='label amount-label'>
                  <Trans>Tax</Trans>
                </div>
                <div className='amount-value'>
                  <Amount
                    currency={requestDetails.currency}
                    amount={
                      requestDetails?.total_expense_amounts?.total_tax_amount ||
                      0
                    }
                    noStyle
                  />
                </div>
              </div>
              <div className='amount-container'>
                <div className='label amount-label'>
                  <Trans>Net</Trans>
                </div>
                <div className='amount-value'>
                  <Amount
                    currency={requestDetails.currency}
                    amount={
                      requestDetails?.total_expense_amounts?.net_amount || 0
                    }
                    noStyle
                  />
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </div>
      {showRequestDetailDrawer ? (
        <AppDrawer
          visible={getDrawerDetails !== null}
          destroyOnClose={true}
          closable={true}
          onClose={() => setDrawerDetails(null)}
          title={
            <>
              {`Request No. #${getDrawerDetails?.request_no}`}
              <StatusTag
                status={getDrawerDetails?.workflow_status as IWorkflowStatus}
                onStatusClick={() =>
                  _fetchWorkFlowData({
                    id: getDrawerDetails?.id,
                    type: 'request',
                  })
                }
              />
            </>
          }
          showCancelButton={false}
          showOkButton={false}
          width='60%'
          getContainer='.request-details-container'
          className='request-detail-drawer  no-header-border'
        >
          <RequestDrawerDetails requestId={getDrawerDetails?.id} />
        </AppDrawer>
      ) : null}
      <AppDrawer
        key='travelFlightDetails'
        visible={getTravelFlightDetails !== null}
        destroyOnClose={true}
        closable={true}
        onClose={() => setTravelFlightDetails(null)}
        title='Travel Details'
        showCancelButton={false}
        showOkButton={false}
        width='40%'
        getContainer='.request-details-container'
        className='travel-flight-details'
      >
        <Table
          dataSource={getTravelFlightDetails}
          columns={[
            {
              title: <Trans>Date</Trans>,
              dataIndex: 'start_date',
              key: 'start_date',
            },
            {
              title: <Trans>Depart</Trans>,
              dataIndex: 'source',
              key: 'source',
            },
            {
              title: <Trans>Arrive</Trans>,
              dataIndex: 'destination',
              key: 'destination',
            },
          ]}
          pagination={{
            hideOnSinglePage: true,
            showQuickJumper: true,
          }}
        ></Table>
      </AppDrawer>
    </ErrorBoundary>
  );
};

export default connector(memo(RequestDetails));
