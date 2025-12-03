import React, { useEffect, Dispatch, memo, useState } from 'react';
import './requestDetail.index.less';
import { stateInterface } from '../../../shared/redux/rootReducer';
import { fetchRequestDetailsById } from '../request.thunk';
import { connect, ConnectedProps } from 'react-redux';
import { setRequestDetailLoading } from '../request.action';
import BrokenLink from '../../../shared/components/brokenLink/brokenLink.index';
import { Skeleton, Row, Col, Collapse, Modal, Result, Button } from 'antd';
import { IRequestDetailProps } from '../request.model';
import moment from 'moment';
import { isPdfFile } from '../../../utils/global.utils';
import {
  PDFViewer,
  Amount,
  AdminFieldIcon,
  CustomizeTabName,
} from '../../../shared/components';
import { PaperClipOutlined, SafetyCertificateTwoTone } from '@ant-design/icons';
import { getFormattedDate } from '../../../utils/scroll.utils';
import { Trans } from '@lingui/macro';
import { fetchExpenseClaimViolationData } from '../../addNewExpense/addNewExpense.thunk';
const mapStateToProps = (state: stateInterface) => {
  const {
    requestDetailLoading,
    requestDetailInstance,
    requestTypeConfiguration,
    requestDetailFetchingFailed,
  } = state.request;
  const { expenseClaimViolationFetchedData } = state.AddNewExpenseForm;
  const {
    tenantConfig,
    isEnableTrafficLightFeatureForTenantFeatures,
  } = state.configuration;
  return {
    requestDetailLoading,
    requestDetailInstance,
    requestTypeConfiguration,
    requestDetailFetchingFailed,
    tenantConfig,
    isEnableTrafficLightFeatureForTenantFeatures,
    expenseClaimViolationFetchedData,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  return {
    _setRequestDetailLoading: (isLoading: boolean) =>
      dispatch(setRequestDetailLoading(isLoading)),
    _fetchrequestDetailInstanceById: (requestId: number) =>
      dispatch(fetchRequestDetailsById(requestId)),
    _fetchExpenseClaimViolationData: (id: number) =>
      dispatch(fetchExpenseClaimViolationData(id)),
  };
};

const connector = connect(mapStateToProps, mapDispatchToProps);
type TProps = ConnectedProps<typeof connector>;

const RequestDetail: React.FC<TProps & IRequestDetailProps> = props => {
  const {
    // isAdmin = false,
    requestId,
    isCreatedByVisible = false,
    requestDetailLoading,
    requestDetailInstance,
    requestTypeConfiguration,
    requestDetailFetchingFailed,
    _setRequestDetailLoading,
    _fetchrequestDetailInstanceById,
    tenantConfig,
    isEnableTrafficLightFeatureForTenantFeatures,
    expenseClaimViolationFetchedData,
    _fetchExpenseClaimViolationData,
    isAdmin = false,
    isApprovalPage = false,
    isEmployee = false,
  } = props;

  useEffect(() => {
    if (requestId) {
      _setRequestDetailLoading(true);
      _fetchrequestDetailInstanceById(requestId);
      if (
        tenantConfig[0]?.is_enabled_traffic_lights &&
        isEnableTrafficLightFeatureForTenantFeatures
      ) {
        _fetchExpenseClaimViolationData(requestId);
      }
    }

    return () => {};
    // eslint-disable-next-line
  }, [requestId]);

  const [attachmentPath, setAttachmentPath] = useState<
    { fileName: string; file: string } | undefined
  >(undefined);

  if (requestDetailFetchingFailed === true) {
    return (
      <BrokenLink
        onTryAgain={() => {
          _setRequestDetailLoading(true);
          _fetchrequestDetailInstanceById(requestId);
        }}
      />
    );
  }
  const getMappedLabel = (key: string) => {
    let labelMapping = requestTypeConfiguration.label_mapping;
    return labelMapping[key]['mapped'];
  };

  const getTravelItineraryFields = () => {
    if (requestTypeConfiguration.is_travel_type === false) {
      return <></>;
    }

    if (requestDetailInstance.is_multi_destination_trip === true) {
      let itineraries = requestDetailInstance.travel_itineraries.map(
        (itinerary: any) => {
          return (
            <Row className='detail' gutter={16}>
              <Col sm={24} md={6}>
                <div className='field'>
                  <div className='value fill-white'>{itinerary.start_date}</div>
                </div>
              </Col>
              <Col sm={24} md={9}>
                <div className='field'>
                  <div className='value fill-white'>{itinerary.source}</div>
                </div>
              </Col>
              <Col sm={24} md={9}>
                <div className='field'>
                  <div className='value fill-white'>
                    {itinerary.destination}
                  </div>
                </div>
              </Col>
            </Row>
          );
        },
      );

      itineraries.unshift(
        <Row className='detail-header' gutter={16}>
          <Col sm={24} md={6}>
            <div className='field'>
              <div className='label' title='Start Date'>
                <Trans>Start Date</Trans>
              </div>
            </div>
          </Col>
          <Col sm={24} md={9}>
            <div className='field'>
              <div className='label' title='Depart From'>
                <Trans>Depart From</Trans>
              </div>
            </div>
          </Col>
          <Col sm={24} md={9}>
            <div className='field'>
              <div className='label' title='Arrive At'>
                <Trans>Arrive At</Trans>
              </div>
            </div>
          </Col>
        </Row>,
      );

      return (
        <div className='fields has-collapse'>
          {/* <Row className='trip-detail' gutter={16}>
            <Col xs={24} md={10}>
              <div className='field'>
                <div className='label'>Depart From</div>
                <div className='value'>
                  {requestDetailInstance.departure_from}
                </div>
              </div>
            </Col>
            <Col xs={24} md={10}>
              <div className='field'>
                <div className='label'>Arrive At</div>
                <div className='value'>{requestDetailInstance.arrival_at}</div>
              </div>
            </Col>
            <Col xs={24} md={4}>
              <div className='field'>
                <div className='label'>Multi City</div>
                <div className='value'>
                  {requestDetailInstance.is_multi_destination_trip === true
                    ? 'Yes'
                    : 'No'}
                </div>
              </div>
            </Col>
          </Row> */}
          <div className='field'>
            <div className='label' title='Multi City'>
              <Trans>Multi City</Trans>
            </div>
            <div className='value'>
              {requestDetailInstance.is_multi_destination_trip === true
                ? 'Yes'
                : 'No'}
            </div>
          </div>
          <Collapse
            defaultActiveKey='1'
            className='collapse'
            bordered={false}
            expandIconPosition='right'
          >
            <Collapse.Panel key='1' header={getMappedLabel('travel_itinerary')}>
              <div className='detail-fields'>{itineraries}</div>
            </Collapse.Panel>
          </Collapse>
        </div>
      );
    }

    return (
      <Row className='fields' gutter={16}>
        <Col xs={24} md={10}>
          <div className='field'>
            <div className='label' title='Depart From'>
              <Trans>Depart From</Trans>
            </div>
            <div className='value'>{requestDetailInstance.departure_from}</div>
          </div>
        </Col>
        <Col xs={24} md={10}>
          <div className='field'>
            <div className='label' title='Arrive At'>
              <Trans>Arrive At</Trans>
            </div>
            <div className='value'>{requestDetailInstance.arrival_at}</div>
          </div>
        </Col>
        <Col xs={24} md={4}>
          <div className='field'>
            <div className='label' title='Multi City'>
              <Trans>Multi City</Trans>
            </div>
            <div className='value'>
              {requestDetailInstance.is_multi_destination_trip === true
                ? 'Yes'
                : 'No'}
            </div>
          </div>
        </Col>
      </Row>
    );
  };

  const getExpenseClaimEstimationFields = () => {
    if (requestTypeConfiguration.estimation_type.code === 'BLK') {
      if (requestDetailInstance.bulk_estimation_amount === null) {
        return <></>;
      }

      return (
        <div className='field'>
          <div
            className='label'
            title={getMappedLabel('expense_claim_estimation')}
          >
            {getMappedLabel('expense_claim_estimation')}
          </div>
          <div className='value'>
            <Amount
              currency={requestDetailInstance.currency.currency.code}
              amount={requestDetailInstance.bulk_estimation_amount}
              noStyle={true}
            />
          </div>
        </div>
      );
    }

    if (requestDetailInstance.expense_claim_estimations.length === 0) {
      return <></>;
    }

    let expenseClaimEstimations = requestDetailInstance.expense_claim_estimations.map(
      (record: any) => {
        return (
          <Row className='detail' gutter={16}>
            <Col sm={24} md={16}>
              <div className='field'>
                <div className='value fill-white'>{record.expense_type}</div>
              </div>
            </Col>
            <Col sm={24} md={8}>
              <div className='field'>
                <div className='value fill-white'>
                  <Amount
                    currency={requestDetailInstance.currency.currency.code}
                    amount={record.estimated_amount}
                    noStyle={true}
                  />
                </div>
              </div>
            </Col>
          </Row>
        );
      },
    );

    expenseClaimEstimations.unshift(
      <Row className='detail-header' gutter={16}>
        <Col sm={24} md={16}>
          <div className='field'>
            <div className='label' title='Expense Type'>
              <Trans>Expense Type</Trans>
            </div>
          </div>
        </Col>
        <Col sm={24} md={8}>
          <div className='field'>
            <div className='label' title='Estimated Amount'>
              <Trans>Estimated Amount</Trans>
            </div>
          </div>
        </Col>
      </Row>,
    );

    const totalAmount = requestDetailInstance.expense_claim_estimations?.reduce(
      (sum: number, item: any) => sum + +(item?.estimated_amount || 0),
      0,
    );
    return (
      <div className='fields has-collapse'>
        <Collapse
          bordered={false}
          defaultActiveKey='1'
          className='collapse'
          expandIconPosition='right'
        >
          <Collapse.Panel
            key='1'
            header={
              <Row gutter={20}>
                <Col span={16}>
                  {getMappedLabel('expense_claim_estimation')}
                </Col>
                <Col span={8}>
                  <Amount
                    amount={totalAmount}
                    currency={requestDetailInstance.currency.currency.code}
                    noStyle={true}
                  />
                </Col>
              </Row>
            }
          >
            <div className='detail-fields'>{expenseClaimEstimations}</div>
          </Collapse.Panel>
        </Collapse>
      </div>
    );
  };

  const getFlightDetailsFields = () => {
    if (requestDetailInstance.flight_details.length === 0) {
      return <></>;
    }

    let flightDetails = requestDetailInstance.flight_details.map(
      (record: any) => {
        return (
          <div className='detail'>
            <Row gutter={16} align='middle'>
              <Col sm={24} md={8}>
                <div className='field'>
                  <div className='label' title='Airlines'>
                    <Trans>Airlines</Trans>
                  </div>
                  <div className='value fill-white'>{record.airlines}</div>
                </div>
              </Col>
              <Col sm={24} md={8}>
                <div className='field'>
                  <div className='label' title='Flight Number'>
                    <Trans>Flight Number</Trans>
                  </div>
                  <div className='value fill-white'>{record.flight_number}</div>
                </div>
              </Col>
            </Row>
            <Row gutter={16} align='middle'>
              <Col sm={24} md={8}>
                <div className='field'>
                  <div className='label' title='Departure Time'>
                    <Trans>Departure Time</Trans>
                  </div>
                  <div className='value fill-white'>
                    {record.departure_time}
                  </div>
                </div>
              </Col>
              <Col sm={24} md={8}>
                <div className='field'>
                  <div className='label' title='Arrival Time'>
                    <Trans>Arrival Time</Trans>
                  </div>
                  <div className='value fill-white'>{record.arrival_time}</div>
                </div>
              </Col>
              <Col sm={24} md={12} lg={4}>
                <div className='field'>
                  <div className='label' title='Ticket Cost'>
                    <Trans>Ticket Cost</Trans>
                  </div>
                  <div className='value fill-white'>
                    <Amount
                      currency={
                        requestDetailInstance?.currency?.currency?.code || ''
                      }
                      amount={record.ticket_cost}
                      noStyle={true}
                    />
                  </div>
                </div>
              </Col>
              <Col sm={24} md={12} lg={4}>
                <div className='field'>
                  <div className='label' title='Flight Ticket'>
                    <Trans>Flight Ticket</Trans>
                  </div>
                  <div className='value fill-white'>
                    <Button
                      type='link'
                      className='no-pad _all text-center'
                      disabled={!record.flight_ticket}
                      onClick={
                        record.flight_ticket
                          ? () =>
                              setAttachmentPath({
                                file: record.flight_ticket,
                                fileName:
                                  record.flight_ticket_title || 'Ticket',
                              })
                          : undefined
                      }
                    >
                      {record.flight_ticket
                        ? record.flight_ticket_title || 'Ticket'
                        : '-'}
                    </Button>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        );
      },
    );

    return (
      <div className='fields has-collapse'>
        <Collapse
          bordered={false}
          defaultActiveKey='1'
          className='collapse'
          expandIconPosition='right'
        >
          <Collapse.Panel
            key='1'
            header={
              <>
                {getMappedLabel('flight_details')}
                {requestTypeConfiguration.is_flight_booking_filled_by_admin && (
                  <AdminFieldIcon />
                )}
              </>
            }
          >
            <div className='detail-fields'>{flightDetails}</div>
          </Collapse.Panel>
        </Collapse>
      </div>
    );
  };

  const getHotelAccomodationFields = () => {
    if (requestDetailInstance.hotel_accommodations.length === 0) {
      return <></>;
    }

    let hotelAccommodations = requestDetailInstance.hotel_accommodations.map(
      (record: any) => {
        return (
          <div className='detail'>
            <Row gutter={16}>
              <Col xs={24} sm={24} md={10}>
                <div className='field'>
                  <div className='label' title='Hotel Name'>
                    <Trans>Hotel Name</Trans>
                  </div>
                  <div className='value fill-white'>{record.hotel_name}</div>
                </div>
              </Col>
              <Col xs={24} sm={24} md={10}>
                <div className='field'>
                  <div className='label' title='Hotel Address'>
                    <Trans>Hotel Address</Trans>
                  </div>
                  <div className='value fill-white'>{record.hotel_address}</div>
                </div>
              </Col>
              <Col xs={24} sm={24} md={4}>
                <div className='field'>
                  <div className='label' title='Amount'>
                    <Trans>Amount</Trans>
                  </div>
                  <div className='value fill-white'>
                    <Amount
                      currency={
                        requestDetailInstance?.currency?.currency?.code || ''
                      }
                      amount={record.amount}
                      noStyle={true}
                    />
                  </div>
                </div>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col xs={24} sm={24} md={5}>
                <div className='field'>
                  <div className='label' title='Check-In Date'>
                    <Trans>Check-In Date</Trans>
                  </div>
                  <div className='value fill-white'>{record.check_in_date}</div>
                </div>
              </Col>
              <Col xs={24} sm={24} md={5}>
                <div className='field'>
                  <div className='label' title='Check-Out Date'>
                    <Trans>Check-Out Date</Trans>
                  </div>
                  <div className='value fill-white'>
                    {record.check_out_date}
                  </div>
                </div>
              </Col>
              <Col xs={24} sm={24} md={10}>
                <div className='field'>
                  <div className='label' title={getMappedLabel('remark')}>
                    {getMappedLabel('remark')}
                  </div>
                  <div className='value fill-white'>{record.remark}</div>
                </div>
              </Col>
              <Col xs={24} sm={24} md={4}>
                <div className='field'>
                  <div className='label' title='Attachment'>
                    <Trans>Attachment</Trans>
                  </div>
                  <div className='value fill-white'>
                    <Button
                      type='link'
                      className='no-pad _all text-center'
                      disabled={!record.attachment}
                      onClick={
                        record.attachment
                          ? () =>
                              setAttachmentPath({
                                file: record.attachment,
                                fileName: record.attachment_title || 'Ticket',
                              })
                          : undefined
                      }
                    >
                      {record.attachment
                        ? record.attachment_title || 'Attachment'
                        : ''}
                    </Button>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        );
      },
    );

    return (
      <div className='fields has-collapse'>
        <Collapse
          bordered={false}
          defaultActiveKey='1'
          className='collapse'
          expandIconPosition='right'
        >
          <Collapse.Panel
            key='1'
            header={
              <>
                <Trans>Hotel Accommodations</Trans>{' '}
                {requestTypeConfiguration.is_hotel_accommodation_filled_by_admin && (
                  <AdminFieldIcon />
                )}
              </>
            }
          >
            <div className='detail-fields'>{hotelAccommodations}</div>
          </Collapse.Panel>
        </Collapse>
      </div>
    );
  };

  const getCostCentreField = () => {
    if (requestTypeConfiguration.is_allow_charging_to_cost_centres === false) {
      return <></>;
    }

    if (
      requestTypeConfiguration.is_allow_multiple_cost_centre_selection === false
    ) {
      return requestDetailInstance.charge_to.code === 'THIRD' ? (
        // <Row className='details' gutter={16}>
        <div className='field'>
          <div className='label' title={requestDetailInstance.charge_to.title}>
            {requestDetailInstance.charge_to.title}
          </div>
          <div className='value'>
            {requestDetailInstance.third_party_vendor}
          </div>
        </div>
      ) : (
        // </Row>
        <Row className='detail' gutter={16}>
          <Col sm={24} md={8}>
            <div className='field'>
              <div className='label' title='Cost Centre Name'>
                <Trans>Cost Centre Name</Trans>
              </div>
              <div className='value'>
                {requestDetailInstance.cost_centres
                  .map((record: any) => {
                    return record.title;
                  })
                  .join(', ')}
              </div>
            </div>
          </Col>
          <Col sm={24} md={8}>
            <div className='field'>
              <div className='label' title='Cost Centre Code'>
                <Trans>Cost Centre Code</Trans>
              </div>
              <div className='value'>
                {requestDetailInstance.cost_centres
                  .map((record: any) => {
                    return record.code;
                  })
                  .join(', ')}
              </div>
            </div>
          </Col>
          <Col sm={24} md={8}>
            <div className='field'>
              <div className='label' title='Cost Centre Type'>
                <Trans>Cost Centre Type</Trans>
              </div>
              <div className='value'>
                {requestDetailInstance.cost_centres
                  .map((record: any) => {
                    return record.cost_centre_type.title;
                  })
                  .join(', ')}
              </div>
            </div>
          </Col>
        </Row>
      );
    }

    let costCentres = requestDetailInstance.cost_centres.map((record: any) => {
      return (
        <Row className='detail' gutter={16}>
          <Col sm={8}>
            <div className='field'>
              <div className='value fill-white'>{record.title}</div>
            </div>
          </Col>
          <Col sm={8}>
            <div className='field'>
              <div className='value fill-white'>{record.code}</div>
            </div>
          </Col>
          <Col sm={8}>
            <div className='field'>
              <div className='value fill-white'>
                {record.cost_centre_type.title}
              </div>
            </div>
          </Col>
        </Row>
      );
    });

    costCentres.unshift(
      <Row className='detail-header' gutter={16}>
        <Col sm={8}>
          <div className='field'>
            <div className='label' title='Cost Centre Name'>
              <Trans>Cost Centre Name</Trans>
            </div>
          </div>
        </Col>
        <Col sm={8}>
          <div className='field'>
            <div className='label' title='Cost Centre Code'>
              <Trans>Cost Centre Code</Trans>
            </div>
          </div>
        </Col>
        <Col sm={8}>
          <div className='field'>
            <div className='label' title='Cost Centre Type'>
              <Trans>Cost Centre Type</Trans>
            </div>
          </div>
        </Col>
      </Row>,
    );

    return (
      <div className='fields has-collapse'>
        <Collapse
          bordered={false}
          defaultActiveKey='1'
          className='collapse'
          expandIconPosition='right'
        >
          <Collapse.Panel key='1' header={<Trans>Cost Centres</Trans>}>
            <div className='detail-fields'>{costCentres}</div>
          </Collapse.Panel>
        </Collapse>
      </div>
    );
  };

  // const renderCostWorkFlow = () => {
  //   if (
  //     requestTypeConfiguration.is_allow_multiple_cost_centre_selection &&
  //     requestDetailInstance.cost_centre_uuid_to_route_workflow
  //   ) {
  //     return (
  //       <div className='field'>
  //         <div className='label' title="">Route Workflow Cost Centre</div>
  //         <div className='value'>
  //           {requestDetailInstance.cost_centre_uuid_to_route_workflow?.title}
  //         </div>
  //       </div>
  //     );
  //   }
  // };
  const getStaffMembersFields = () => {
    if (requestDetailInstance.staff_members.length === 0) {
      return <></>;
    }

    let staffMembers = requestDetailInstance.staff_members.map(
      (record: any) => {
        return (
          <Row className='detail' gutter={16}>
            <Col sm={24} md={12}>
              <div className='field'>
                <div className='value fill-white'>
                  {record.legal_name || record.member}
                </div>
              </div>
            </Col>
            <Col sm={24} md={12}>
              <div className='field'>
                <div className='value fill-white'>
                  {record.emp_id !== null ? record.emp_id : 'NA'}
                </div>
              </div>
            </Col>
          </Row>
        );
      },
    );

    staffMembers.unshift(
      <Row className='detail-header' gutter={16}>
        <Col sm={24} md={12}>
          <div className='field'>
            <div className='label' title={getMappedLabel('staff_members')}>
              {getMappedLabel('staff_members')}
            </div>
          </div>
        </Col>
        <Col sm={24} md={12}>
          <div className='field'>
            <div className='label' title={`${(<Trans>Employee ID</Trans>)}`}>
              <Trans>Employee ID</Trans>
            </div>
          </div>
        </Col>
      </Row>,
    );

    return (
      <div className='fields has-collapse'>
        <Collapse
          bordered={false}
          defaultActiveKey='1'
          className='collapse'
          expandIconPosition='right'
        >
          <Collapse.Panel
            key='1'
            header={
              <CustomizeTabName
                title={'Staff Attendee'}
                count={
                  typeof requestDetailInstance?.staff_members?.length ===
                  'number'
                    ? requestDetailInstance?.staff_members?.length
                    : 1
                }
                icon=' . '
              />
            }
          >
            <div className='detail-fields'>{staffMembers}</div>
          </Collapse.Panel>
        </Collapse>
      </div>
    );
  };

  const getGuestMembersFields = () => {
    if (requestDetailInstance.guest_members.length === 0) {
      return <></>;
    }

    let guestMembers = requestDetailInstance.guest_members.map(
      (record: any) => {
        return (
          <Row className='detail' gutter={16}>
            <Col sm={24} md={12}>
              <div className='field'>
                <div className='value fill-white'>{record.member}</div>
              </div>
            </Col>
            <Col sm={24} md={12}>
              <div className='field'>
                <div className='value fill-white'>
                  {record.organisation !== null ? record.organisation : 'NA'}
                </div>
              </div>
            </Col>
          </Row>
        );
      },
    );

    guestMembers.unshift(
      <Row className='detail-header' gutter={16}>
        <Col sm={24} md={12}>
          <div className='field'>
            <div className='label' title={getMappedLabel('guest_members')}>
              {getMappedLabel('guest_members')}
            </div>
          </div>
        </Col>
        <Col sm={24} md={12}>
          <div className='field'>
            <div className='label' title='Guest Member Organisation'>
              <Trans>Organization</Trans>
            </div>
          </div>
        </Col>
      </Row>,
    );

    return (
      <div className='fields has-collapse'>
        <Collapse
          bordered={false}
          defaultActiveKey='1'
          className='collapse'
          expandIconPosition='right'
        >
          <Collapse.Panel
            key='1'
            header={
              <CustomizeTabName
                title={'Guest Attendee'}
                count={
                  typeof requestDetailInstance?.guest_members?.length ===
                  'number'
                    ? requestDetailInstance?.guest_members?.length
                    : 1
                }
                icon=' . '
              />
            }
          >
            <div className='detail-fields'>{guestMembers}</div>
          </Collapse.Panel>
        </Collapse>
      </div>
    );
  };

  const getCustomFields = () => {
    if (requestDetailInstance.custom_fields === null) {
      return <></>;
    }

    let customFields = requestDetailInstance.custom_fields.map(
      (record: any) => {
        let _isAdmin =
          (requestTypeConfiguration.custom_fields.fields || []).filter(
            (o: any) => record.id === o.id,
          )[0]?.is_filled_by_admin || false;

        const returnVal = (
          <div className='field'>
            <div className='label' title={record.title}>
              {record.title}{' '}
              {_isAdmin ? (
                <SafetyCertificateTwoTone
                  title={`${(<Trans>Admin Field</Trans>)}`}
                  twoToneColor='#faad14'
                  className='is-admin-icon'
                  style={{
                    verticalAlign: 'middle',
                    fontSize: '1rem',
                  }}
                />
              ) : null}
            </div>
            <div className='value'>
              {typeof record.value === 'object'
                ? record.textual_values?.join(', ')
                : record.value}
            </div>
          </div>
        );
        // if (_isAdmin) {
        // return isAdmin ? returnVal : null; //uncomment this code if you dont want to print admin fields to others
        // } else {
        return returnVal;
        // }
      },
    );

    return <>{customFields}</>;
  };

  const getCashAdvanceDetails = () => {
    if (requestDetailInstance.cash_advance_request) {
      return (
        <>
          {requestDetailInstance.cash_advance_request
            .cash_advance_request_number && (
            <div className='field'>
              <div className='label' title='Cash Advance Request No.'>
                <Trans>Cash Advance Request No</Trans>
              </div>
              <div className='value fit-content'>
                {
                  requestDetailInstance.cash_advance_request
                    .cash_advance_request_number
                }
              </div>
            </div>
          )}
          <Row gutter={24}>
            <Col span={12}>
              <div className='field'>
                <div className='label' title='Cash Advance Requested'>
                  <Trans>Cash Advance Requested</Trans>
                </div>
                <div className='value'>
                  {`${
                    requestDetailInstance.currency?.currency?.code
                  } ${requestDetailInstance.cash_advance_request
                    .amount_requested || 0}`}
                </div>
              </div>
            </Col>
            <Col span={12}>
              <div className='field'>
                <div className='label' title='Status'>
                  <Trans>Status</Trans>
                </div>
                <div className='value'>
                  {requestDetailInstance.cash_advance_request.status.title || 0}
                </div>
              </div>
            </Col>
          </Row>
          {requestDetailInstance.cash_advance_request.status.code ===
            'DISBSD' && (
            <Row gutter={16}>
              <Col span={12}>
                <div className='field'>
                  <div className='label' title='Disbursed Amount'>
                    <Trans>Disbursed Amount</Trans>
                  </div>
                  <div className='value'>
                    {requestDetailInstance.currency?.currency?.code +
                      ' ' +
                      (
                        requestDetailInstance.cash_advance_request
                          .amount_disbursed || '0'
                      ).toFixed(2)}
                  </div>
                </div>
              </Col>
              <Col span={12}>
                <div className='field'>
                  <div className='label' title='Disbursement Date'>
                    <Trans>Disbursement Date</Trans>
                  </div>
                  <div className='value'>
                    {getFormattedDate(
                      requestDetailInstance.cash_advance_request.disbursed_date,
                      'DD/MM/YYYY',
                    )}
                  </div>
                </div>
              </Col>
            </Row>
          )}
          <div className='field'>
            <div className='label' title={getMappedLabel('remark')}>
              {getMappedLabel('remark')}
            </div>
            <div className='value'>
              {requestDetailInstance.cash_advance_request.remark
                ? requestDetailInstance.cash_advance_request.remark
                : '--'}
            </div>
          </div>
        </>
      );
    } else if (requestTypeConfiguration.is_enable_cash_advance) {
      return (
        <div className='field'>
          <div className='label' title='Requested Cash Advance'>
            <Trans>Requested Cash Advance</Trans>
          </div>
          <div className='value'>
            <Amount
              currency={requestDetailInstance.currency.currency.code}
              amount={requestDetailInstance.cash_advance}
              noStyle={true}
            />
          </div>
        </div>
      );
    }
  };

  const renderViolatedPolicyDetails = () => {
    const riskContainerColor = expenseClaimViolationFetchedData
      ? expenseClaimViolationFetchedData?.flag_color === 'RED'
        ? 'background-color-red'
        : expenseClaimViolationFetchedData?.flag_color === 'ORA'
        ? 'background-color-orange'
        : ''
      : '';
    const displayRiskContainer =
      (expenseClaimViolationFetchedData?.flag_color === 'RED' ||
        expenseClaimViolationFetchedData?.flag_color === 'ORA') &&
      (isAdmin || isApprovalPage || isEmployee) &&
      tenantConfig[0]?.is_enabled_traffic_lights &&
      isEnableTrafficLightFeatureForTenantFeatures
        ? true
        : false;

    const renderViolatedPolicy = (item: any, msgFlagKey: string) => {
      return (
        <>
          {item[`msg_for_${msgFlagKey}`]
            ? item[`msg_for_${msgFlagKey}`]
            : item?.policy_title}
        </>
      );
    };
    return (
      <>
        {displayRiskContainer &&
          expenseClaimViolationFetchedData.flag_score > 0 &&
          expenseClaimViolationFetchedData?.violated_policy_details?.data?.some(
            (item: any) =>
              (isApprovalPage && item?.is_show_flag_to_approver) ||
              (isAdmin && item?.is_show_flag_to_finance_admin) ||
              (isEmployee && item?.is_show_flag_to_employee),
          ) && (
            <div
              className={`approval-risk-container ${riskContainerColor}`}
              data-testId='approval-risk-container'
            >
              <div className='approval-risk-container__risk-score'>
                <span className='approval-risk-container__risk-score-title'>
                  Risk Score:
                </span>{' '}
                <span className='approval-risk-container__risk-score-data'>
                  {expenseClaimViolationFetchedData?.flag_score}%
                </span>
              </div>
              <div className='approval-risk-container__risk-criteria'>
                <div className='approval-risk-container__risk-criteria-title'>
                  {
                    expenseClaimViolationFetchedData?.violated_policy_details?.data?.filter(
                      (item: any) =>
                        (isApprovalPage && item?.is_show_flag_to_approver) ||
                        (isAdmin && item?.is_show_flag_to_finance_admin) ||
                        (isEmployee && item?.is_show_flag_to_employee),
                    ).length
                  }{' '}
                  policies violated :
                </div>
                <ul>
                  {expenseClaimViolationFetchedData?.violated_policy_details?.data?.map(
                    (item: any) => {
                      if (isApprovalPage && item?.is_show_flag_to_approver)
                        return (
                          <li key={item?.policy_id}>
                            {renderViolatedPolicy(item, 'approver')}
                          </li>
                        );
                      else if (isAdmin && item?.is_show_flag_to_finance_admin)
                        return (
                          <li key={item?.policy_id}>
                            {renderViolatedPolicy(item, 'finance_admin')}
                          </li>
                        );
                      else if (isEmployee && item?.is_show_flag_to_employee)
                        return (
                          <li key={item?.policy_id}>
                            {renderViolatedPolicy(item, 'employee')}
                          </li>
                        );
                    },
                  )}
                </ul>
              </div>
            </div>
          )}
      </>
    );
  };

  return (
    <>
      {requestDetailLoading === true ? (
        <Skeleton />
      ) : !requestDetailInstance ? (
        <Result />
      ) : (
        <Row gutter={16}>
          <Col xs={24} sm={24} md={24} lg={16} xl={18}>
            {/* for traffic light new(v2) implementation */}
            {renderViolatedPolicyDetails()}
            <div className='transaction-item-detail request-detail'>
              {isCreatedByVisible ? (
                <div className='field'>
                  <div className='label' title='Created By'>
                    <Trans>Created By</Trans>
                  </div>
                  <div className='value'>
                    {requestDetailInstance?.created_by?.legal_name ||
                      requestDetailInstance.created_by.name}
                  </div>
                </div>
              ) : null}
              <div className='field'>
                <div className='label' title='Request No.'>
                  <Trans>Request No.</Trans>
                </div>
                <div className='value'>{requestDetailInstance.request_no}</div>
              </div>

              <div className='field'>
                <div className='label' title={getMappedLabel('request_type')}>
                  {getMappedLabel('request_type')}
                </div>
                <div className='value'>
                  {requestDetailInstance.request_type_legal_entity.title}
                </div>
              </div>

              {requestTypeConfiguration.is_allow_remark ? (
                <div className='field'>
                  <div className='label' title='Description/Purpose'>
                    <Trans>Description/Purpose</Trans>
                  </div>
                  <div className='value'>{requestDetailInstance.purpose}</div>
                </div>
              ) : (
                <></>
              )}

              <div className='fields'>
                <Row gutter={16}>
                  <Col xs={24} md={10}>
                    <div className='field'>
                      <div
                        className='label'
                        title={getMappedLabel('from_date')}
                      >
                        {getMappedLabel('from_date')}
                      </div>
                      <div className='value'>
                        {requestDetailInstance.start_date}
                      </div>
                    </div>
                  </Col>
                  <Col xs={24} md={10}>
                    <div className='field'>
                      <div className='label' title={getMappedLabel('to_date')}>
                        {getMappedLabel('to_date')}
                      </div>
                      <div className='value'>
                        {requestDetailInstance.end_date}
                      </div>
                    </div>
                  </Col>
                  <Col xs={24} md={4}>
                    <div className='field'>
                      <div className='label' title='Duration'>
                        <Trans>Duration</Trans>
                      </div>
                      <div className='value'>
                        {(() => {
                          let fromDate = moment(
                            requestDetailInstance.start_date,
                            'DD/MM/YYYY',
                          );
                          let toDate = moment(
                            requestDetailInstance.end_date,
                            'DD/MM/YYYY',
                          );
                          let difference =
                            moment(toDate).diff(fromDate, 'days') + 1;

                          return String(difference) + ' Days';
                        })()}
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>

              {getTravelItineraryFields()}

              {getHotelAccomodationFields()}

              {getFlightDetailsFields()}

              {getExpenseClaimEstimationFields()}

              {getCashAdvanceDetails()}

              {getStaffMembersFields()}

              {getGuestMembersFields()}

              {getCostCentreField()}

              {/* {renderCostWorkFlow()} */}

              {getCustomFields()}
            </div>
          </Col>
          <Col xs={24} sm={24} md={24} lg={8} xl={6}>
            {requestDetailInstance.additional_documents?.length > 0 && (
              <div className='additional-documents'>
                <Trans>Additional Documents</Trans>
              </div>
            )}
            {requestDetailInstance.additional_documents?.map(
              (file: any, i: number) => (
                <div className='document-item'>
                  <PaperClipOutlined />
                  <div className='document-name'>
                    <a href={file.file} target='_new'>
                      {file.file_name || 'Attachment#' + (i + 1)}
                    </a>
                  </div>
                </div>
              ),
            )}
          </Col>
        </Row>
      )}
      {attachmentPath && (
        <Modal
          closable={true}
          onCancel={() => setAttachmentPath(undefined)}
          footer={null}
          centered
          visible={true}
          title={attachmentPath.fileName}
          style={{ width: 'auto', height: 'auto', transformOrigin: 'unset' }}
          width='auto'
        >
          {isPdfFile(attachmentPath.file) ? (
            <PDFViewer showPdfIcon={false} file={attachmentPath.file} />
          ) : (
            <img
              alt='attachment'
              style={{ width: 450, height: 650 }}
              src={
                typeof attachmentPath.file === 'string'
                  ? attachmentPath.file
                  : window.URL.createObjectURL(attachmentPath.file)
              }
            />
          )}
        </Modal>
      )}
    </>
  );
};

export default connector(memo(RequestDetail));
