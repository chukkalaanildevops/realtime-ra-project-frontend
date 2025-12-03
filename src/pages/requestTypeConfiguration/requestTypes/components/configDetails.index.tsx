import React from 'react';
import {
  SkeletonItem,
  BooleanItem,
  OptionalItem,
  ErrorBoundary,
} from '../../../../shared/components';
import { IExpandedItem } from '../../requestTypeConfiguration.model';
import { Row, Col, Table } from 'antd';
import './configDetails.index.less';
import { Trans } from '@lingui/macro';

const ConfigDetails: React.FC<{
  isDataLoading: boolean;
  configData: IExpandedItem;
}> = ({ configData, isDataLoading }) => {
  const expenseColumns = [
    {
      dataIndex: 'expense_type',
      title: () => <Trans>Expense Type</Trans>,
      render: (obj: any) => obj.title,
    },
    {
      dataIndex: 'exclude_from_cash_advance',
      title: <Trans>Exclude From Cash Advance</Trans>,
      render: (val: boolean) => (val ? 'Yes' : 'No'),
    },
    {
      dataIndex: 'is_allow_multiple_claims',
      title: <Trans>Allow Multiple Claims</Trans>,
      render: (val: boolean) => (val ? 'Yes' : 'No'),
    },
    {
      dataIndex: 'can_expense_receipt_date_be_outside_request_date',
      title: <Trans>Expense Receipt Date Can Be Outside Request Date</Trans>,
      render: (val: boolean) => (val ? 'Yes' : 'No'),
    },
  ];

  return (
    <div className='request-type-config-details-container'>
      {isDataLoading ? (
        <SkeletonItem />
      ) : (
        <ErrorBoundary>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              {/* {configData.legal_entity && (
                <Col span={24}>
                  <>
                    <div className='text-label'>
                       <Trans>Legal Entity</Trans>
                    </div>
                    <div className='text-content'>
                      {(configData.legal_entity as any).title}
                    </div>
                  </>
                </Col>
              )}
              {configData.code && (
                <Col span={24}>
                  <>
                    <div className='text-label'>
                       <Trans>Code</Trans>
                    </div>
                    <div className='text-content'>{configData.code}</div>
                  </>
                </Col>
              )} */}
              <Col span={24} style={{ paddingLeft: 0 }}>
                <BooleanItem
                  title={<Trans>Is Travel type</Trans>}
                  value={configData.is_travel_type}
                />
                <BooleanItem
                  title={<Trans>Is Include Hotel Accommodation</Trans>}
                  value={configData.is_include_hotel_accommodation}
                />
                <BooleanItem
                  title={<Trans>Is Filled By Admin</Trans>}
                  value={configData.is_hotel_accommodation_filled_by_admin}
                  normal
                />
                <BooleanItem
                  title={<Trans>Is Include Flight Booking</Trans>}
                  value={configData.is_include_flight_booking}
                />
                <BooleanItem
                  title={<Trans>Is Filled By Admin</Trans>}
                  value={configData.is_flight_booking_filled_by_admin}
                  normal
                />
                <BooleanItem
                  title={<Trans>Is Include Travel Insurance</Trans>}
                  value={configData.is_include_travel_insurance}
                />
                <BooleanItem
                  title={<Trans>Is Filled By Admin</Trans>}
                  value={configData.is_travel_insurance_filled_by_admin}
                  normal
                />
              </Col>
              <Col span={24} style={{ paddingLeft: '0px' }}>
                <BooleanItem
                  title={<Trans>Allow Adding Guest Members To Requests</Trans>}
                  value={configData.is_allow_adding_staff_members_to_requests}
                />
                <BooleanItem
                  title={<Trans>Are Guest Members Mandatory</Trans>}
                  value={configData.are_guest_members_mandatory}
                  normal
                />
              </Col>
              <Col span={24} style={{ paddingLeft: 0 }}>
                <BooleanItem
                  title={<Trans>Auto Settle Request After A Period</Trans>}
                  value={configData.is_auto_settle_request_after_a_period}
                />
                <OptionalItem
                  title={<Trans>Number Of Days From Request End Date</Trans>}
                  value={configData.number_of_days_from_request_end_date}
                />
              </Col>
              <BooleanItem
                title={<Trans>Enable Cash Advance</Trans>}
                value={configData.is_enable_cash_advance}
              />
              <BooleanItem
                title={<Trans>Allow Overlapping Requests</Trans>}
                value={configData.is_allow_overlapping_requests}
              />
              <BooleanItem
                title={<Trans>Assign Using Rules</Trans>}
                value={configData.is_assign_using_rules}
              />
              <Col span={24} style={{ paddingLeft: '0px' }}>
                <BooleanItem
                  title={<Trans>Allow Charging To Cost Centre</Trans>}
                  value={configData.is_allow_charging_to_cost_centres}
                />
                <BooleanItem
                  title={<Trans>Make Employee Cost Centre Read-only</Trans>}
                  value={configData.is_employee_cost_centre_readonly}
                  normal
                />
                <BooleanItem
                  title={<Trans>Allow Overseas Cost Centres</Trans>}
                  value={configData.is_allow_overseas_cost_centres}
                  normal
                />
                <BooleanItem
                  title={<Trans>Allow Internal Order Cost Centres</Trans>}
                  value={configData.is_allow_internal_order_cost_centres}
                  normal
                />

                <BooleanItem
                  title={<Trans>Allow 3rd Party Vendor</Trans>}
                  value={configData.is_allow_3rd_party_vendor}
                  normal
                />
                {/* <BooleanItem
                  title={ <Trans>Allow Multiple Cost Centre Selection</Trans>}
                  value={configData.is_allow_multiple_cost_centre_selection}
                  normal
                /> */}
                {configData.cost_centres &&
                configData.cost_centres.length > 0 ? (
                  <Col span={24} style={{ paddingLeft: '24px' }}>
                    <>
                      {/* <BooleanItem
                            title='Default To Employee Cost Centre'
                            value={true}
                          /> */}
                      <div className='text-label'>
                        <Trans>Cost Centre</Trans>
                      </div>
                      {configData.cost_centres?.map((cc: any) => (
                        <div
                          className='text-content'
                          style={{ display: 'block' }}
                        >
                          {cc.title}
                        </div>
                      ))}
                    </>
                  </Col>
                ) : null}
              </Col>
            </Col>
            <Col span={12}>
              {/* {configData.title && (
                <Col span={24}>
                  <>
                    <div className='text-label'>
                       <Trans>Title</Trans>
                    </div>
                    <div className='text-content'>{configData.title}</div>
                  </>
                </Col>
              )} */}
              <Col span={24} style={{ paddingLeft: 0 }}>
                <BooleanItem
                  title={<Trans>Is Allow Remark</Trans>}
                  value={configData.is_allow_remark}
                />
                <BooleanItem
                  title={<Trans>Is Remark Mandatory</Trans>}
                  value={configData.is_remark_mandatory}
                  normal
                />
              </Col>
              <Col span={24} style={{ paddingLeft: '0px' }}>
                <BooleanItem
                  title={<Trans>Is Allow Backdated Requests</Trans>}
                  value={configData.is_allow_backdated_requests}
                />
                <OptionalItem
                  title={<Trans>Backdated Request Period In Days</Trans>}
                  value={configData.backdated_request_period_in_days}
                />
                <BooleanItem
                  title={<Trans>Allow Request Expiry</Trans>}
                  value={configData.is_enable_request_expiry_period}
                />
                <OptionalItem
                  title={<Trans>Request Expiry Period In Days</Trans>}
                  value={configData.request_expiry_period}
                />
              </Col>

              <BooleanItem
                title={<Trans>Can Employee Claim Allowances</Trans>}
                value={configData.can_employee_claim_allowances}
              />
              <OptionalItem
                title={<Trans>Grace Period In Days</Trans>}
                value={configData.grace_period_in_days}
              />

              <BooleanItem
                title={<Trans>Is Allow Overlapping Requests</Trans>}
                value={configData.is_allow_overlapping_requests}
              />

              <Col span={24} style={{ paddingLeft: '0px' }}>
                <BooleanItem
                  title={<Trans>Allow Expense Claim Estimation</Trans>}
                  value={configData.is_allow_expense_claim_estimation}
                />
                <OptionalItem
                  title={<Trans>Estimation Type</Trans>}
                  value={
                    (configData?.estimation_type as any)?.title || 'Not Defined'
                  }
                />
                <BooleanItem
                  title={<Trans>Is Estimation Mandatory</Trans>}
                  value={configData.is_estimation_mandatory}
                />
              </Col>
              <Col span={24} style={{ paddingLeft: '0px' }}>
                <BooleanItem
                  title={<Trans>Allow Adding Staff Members To Requests</Trans>}
                  value={configData.is_allow_adding_staff_members_to_requests}
                />
                <BooleanItem
                  title={<Trans>Are Staff Members Mandatory</Trans>}
                  value={configData.are_staff_members_mandatory}
                  normal
                />
              </Col>
              <BooleanItem
                title={<Trans>Is Allow Claims Against Request</Trans>}
                value={configData.is_allow_claims_against_request}
              />
            </Col>
          </Row>
          {configData.allow_claims_against_request_options &&
          configData.allow_claims_against_request_options.length > 0 ? (
            <Row>
              <Col span={24} style={{ padding: '8px' }}>
                <div className='text-label'>
                  <Trans>Allowed Expense Types</Trans>
                </div>
                <Table
                  columns={expenseColumns}
                  dataSource={configData.allow_claims_against_request_options}
                  pagination={false}
                />
              </Col>
            </Row>
          ) : null}

          <Row>
            <>
              <Col span={24} style={{ padding: '8px' }}>
                <div className='text-label'>
                  <Trans>Instructions</Trans>
                </div>
              </Col>
              <Col span={24}>
                {configData.instruction_text !== '' ? (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: configData.instruction_text as string,
                    }}
                    className='instruction'
                  ></div>
                ) : (
                  <div className='instruction'>
                    <Trans>No Instruction Text.</Trans>
                  </div>
                )}
              </Col>
            </>
          </Row>
        </ErrorBoundary>
      )}
    </div>
  );
};

export default ConfigDetails;
