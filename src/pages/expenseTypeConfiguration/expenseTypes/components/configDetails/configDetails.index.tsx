import React, { FC, ReactNode, useEffect, useState } from 'react';
import { Row, Col, Skeleton, Table } from 'antd';
import { CheckCircleTwoTone, StopOutlined } from '@ant-design/icons';
import './configDetails.index.less';
import { Trans } from '@lingui/macro';
import { NoData } from '../../../../../shared/components';
import { getCurrencyFormatting } from '../../../../../utils/global.utils';
import moment from 'moment';
// import { IentityList } from '../../../expenseTypeConfiguration.model';

const ConfigDetails: FC<{
  configData: any;
  isLoadingData?: boolean;
  isEntityList?: boolean;
}> = props => {
  const { configData, isLoadingData = false, isEntityList = false } = props;
  const rowProps: {} = { gutter: [0, 0] };
  const innerColSpanProps: {} = {
    span: 24,
    className: 'property-container',
    'data-testId': 'configuration-options',
  };
  const [mileageRatesTableData, setMileageRatesTableData] = useState([]);
  const [taxPercentagesTableData, setTaxPercentagesTableData] = useState<any>(
    [],
  );

  const entityCCColumn = [
    {
      title: <Trans>Legal Entity</Trans>,
      dataIndex: 'legal_entity',
    },
    {
      title: <Trans>Cost Center</Trans>,
      dataIndex: 'cost_centre',
    },
  ];
  let entityCCList: any[] = [];
  entityCCList = configData?.cost_centres_for_legal_entity?.map(
    (value: any) => {
      return {
        legal_entity: value.legal_entity.title,
        cost_centre: value.cost_centre.title,
      };
    },
  );
  let entityCC = isEntityList
    ? [
        entityCCList.find(
          (value: any) => configData.selectedEntity === value.legal_entity,
        ),
      ]
    : entityCCList;

  const mileageRatesColumn = [
    {
      title: <Trans>Upto Distance</Trans>,
      dataIndex: 'upto_distance',
    },
    {
      title: <Trans>Rate</Trans>,
      dataIndex: 'rate',
    },
    {
      title: <Trans>As Of Date</Trans>,
      dataIndex: 'as_of_date',
    },
  ];

  const taxPercentagesColumn = [
    {
      title: <Trans>Tax Percentage As Of Date</Trans>,
      dataIndex: 'as_of_date',
    },
    {
      title: <Trans>Tax Percentage</Trans>,
      dataIndex: 'tax_percentage',
    },
  ];

  const allowanceColumns = [
    {
      dataIndex: 'allowance_rate',
      title: () => <Trans>Allowance Rate</Trans>,
      render: (obj: any) => obj.title,
    },
  ];

  const getMileageRatesTableData = (rates: any) => {
    let dates: any = [];

    rates.map((item: any) => {
      if (!dates.includes(item.as_of_date)) {
        dates.push(item.as_of_date);
      }
      return item;
    });
    let updatesArray: any = [];
    dates.map((date: any) => {
      let mileageRates = rates.filter((item: any) => {
        return item.as_of_date === date;
      });
      // Milage Rates Sorting
      const uptoDistanceNull = mileageRates?.find(
        (item: any) => !item.upto_distance,
      );
      mileageRates = mileageRates?.filter((item: any) => {
        return item.upto_distance;
      });
      let sortedMilageRate = mileageRates.sort(function(a: any, b: any) {
        return a.upto_distance - b.upto_distance;
      });
      uptoDistanceNull && sortedMilageRate.push(uptoDistanceNull);
      updatesArray = [...updatesArray, ...sortedMilageRate];
      return date;
    });
    return updatesArray;
  };
  useEffect(() => {
    let mileageRatesTableData = configData.mileage_rates
      ? getMileageRatesTableData(configData.mileage_rates)
      : [];
    mileageRatesTableData = mileageRatesTableData.map((o: any) => ({
      //id: o.id,
      upto_distance: o.upto_distance
        ? Number(Number(o.upto_distance).toFixed(2))
        : '-',
      as_of_date: o.as_of_date,
      rate: Number(Number(o.rate).toFixed(2)),
    }));
    setMileageRatesTableData(mileageRatesTableData);
  }, [configData]);

  useEffect(() => {
    const getSortedDataUsingDate = () => {
      let tableData: any[] = configData?.tax_percentages;

      // eslint-disable-next-line no-unused-expressions
      tableData?.sort((a: any, b: any) => {
        const _a = moment.isMoment(a.as_of_date)
          ? a.as_of_date
          : moment(a.as_of_date, ['DD/MM/YYYY']);
        const _b = moment.isMoment(b.as_of_date)
          ? b.as_of_date
          : moment(b.as_of_date, ['DD/MM/YYYY']);
        return _a.valueOf() - _b.valueOf(); //ascend
      });

      tableData = tableData?.map((o: any, i: number) => {
        return {
          ...o,
          key: i,
        };
      });

      return tableData;
    };

    const sortedDatePercentage = getSortedDataUsingDate();

    const taxPercentagesTableData = sortedDatePercentage?.map((o: any) => ({
      as_of_date: o.as_of_date,
      tax_percentage: Number(Number(o.tax_percentage).toFixed(2)),
    }));
    setTaxPercentagesTableData(taxPercentagesTableData);
  }, [configData]);

  const skeletonArray: ReactNode[] = isLoadingData
    ? Array(15)
        .join()
        .split(',')
        .map((_o: any, i: number) => (
          <span key={i}>
            <Skeleton.Input
              style={{
                width: '100%',
                margin: '5px',
              }}
              size='small'
              active={isLoadingData}
            />
            <Skeleton.Input
              style={{
                width: '70%',
                margin: '5px',
              }}
              size='small'
              active={isLoadingData}
            />
          </span>
        ))
    : [];

  return (
    <div
      className='expense-type-config-details-container'
      data-testId='configDetails'
    >
      {isLoadingData ? (
        <>
          <Row {...rowProps} data-testId='SkeletonsContainer'>
            <Col span={12}>{skeletonArray}</Col>
            <Col span={12}>{skeletonArray}</Col>
          </Row>
        </>
      ) : configData instanceof Object &&
        !(configData instanceof Array) &&
        !Object.entries(configData).length ? (
        <NoData
          description='No Configuration Data'
          imageStyle={{
            height: 260,
          }}
        />
      ) : (
        <>
          <Row {...rowProps}>
            <Col span={12}>
              <Row>
                {/* {configData.category ? (
                  <Col {...innerColSpanProps} data-test-1='categoryContainer'>
                    <>
                      <span className='text-label'>Category</span>
                      <span className='text-content' data-test='categoryVal'>
                        {configData.category.title}
                      </span>
                    </>
                  </Col>
                ) : null}
                {configData.legal_entity ? (
                  <Col {...innerColSpanProps}>
                    <>
                      <span className='text-label'>Legal Entity</span>
                      <span className='text-content'>
                        {configData.legal_entity.length > 0
                          ? configData.legal_entity.map((o: IentityList) => (
                              <div>{o.title}</div>
                            ))
                          : configData.legal_entity?.title}
                      </span>
                    </>
                  </Col>
                ) : null}
                {configData.title ? (
                  <Col {...innerColSpanProps}>
                    <>
                      <span className='text-label'>Title</span>
                      <span className='text-content'>{configData.title}</span>
                    </>
                  </Col>
                ) : null}
                {configData.code ? (
                  <Col {...innerColSpanProps}>
                    <>
                      <span className='text-label'>Code</span>
                      <span className='text-content'>{configData.code}</span>
                    </>
                  </Col>
                ) : null} */}
                {configData.min_amount ? (
                  <Col {...innerColSpanProps}>
                    <>
                      <span className='text-label'>
                        <Trans>Minimum Amount</Trans>
                      </span>
                      <span className='text-content'>
                        {getCurrencyFormatting(
                          Number(Number(configData.min_amount).toFixed(2)),
                        )}
                      </span>
                    </>
                  </Col>
                ) : null}
                {configData.max_amount ? (
                  <Col {...innerColSpanProps}>
                    <>
                      <span className='text-label'>
                        <Trans>Maximum Amount</Trans>
                      </span>
                      <span className='text-content'>
                        {getCurrencyFormatting(
                          Number(Number(configData.max_amount).toFixed(2)),
                        )}
                      </span>
                    </>
                  </Col>
                ) : null}
                <Col {...innerColSpanProps}>
                  {configData.is_setup_maximum_claim_amount_per_period ? (
                    <>
                      <span className='text-label'>
                        <CheckCircleTwoTone />
                        <Trans>Setup Maximum Claim Amount Per Period</Trans>
                      </span>
                      <span className='text-content'>
                        {configData.period ? (
                          <div data-testId='maximumClaimPeriod'>
                            Maximum Claim Period : {configData.period.title}
                          </div>
                        ) : null}
                        {configData.amount_per_period ? (
                          <div>
                            {`Amount Per Period : ${getCurrencyFormatting(
                              Number(
                                Number(configData.amount_per_period).toFixed(2),
                              ),
                            )}`}
                          </div>
                        ) : null}
                      </span>
                    </>
                  ) : (
                    <>
                      <span className='text-label disable non-interactive'>
                        <StopOutlined />
                        <Trans>Setup Maximum Claim Amount Per Period</Trans>
                      </span>
                      <span className='text-content'></span>
                    </>
                  )}
                </Col>
                {configData.allow_claims_on ? (
                  <Col {...innerColSpanProps}>
                    <>
                      <span className='text-label'>
                        <Trans>Allow Claims On</Trans>
                      </span>
                      <span className='text-content'>
                        {configData.allow_claims_on.title}
                      </span>
                    </>
                  </Col>
                ) : null}
                <Col {...innerColSpanProps}>
                  {configData.is_set_warning_amount ? (
                    <>
                      <span className='text-label'>
                        <CheckCircleTwoTone />
                        <Trans>Set Warning Amount</Trans>
                      </span>
                      <span className='text-content'>
                        {configData.warning_amount ? (
                          <div>
                            {`Warning Amount : ${getCurrencyFormatting(
                              Number(
                                Number(configData.warning_amount).toFixed(2),
                              ),
                            )}`}
                          </div>
                        ) : null}
                        {configData.warning_message ? (
                          <div>
                            Warning Message :{configData.warning_message}
                          </div>
                        ) : null}
                      </span>
                    </>
                  ) : (
                    <>
                      <span className='text-label disable non-interactive'>
                        <StopOutlined />
                        <Trans>Set Warning Amount</Trans>
                      </span>
                      <span className='text-content'></span>
                    </>
                  )}
                </Col>
                {configData.can_attach_receipts ? (
                  <Col {...innerColSpanProps}>
                    {configData.can_attach_receipts ? (
                      <>
                        <span className='text-label'>
                          <CheckCircleTwoTone />
                          <Trans>Can Attach Receipts</Trans>
                        </span>
                        <span className='text-content'>
                          {configData.is_receipt_mandatory ? (
                            <>
                              <span className='text-label'>
                                <CheckCircleTwoTone />
                                <Trans>Receipt Mandatory</Trans>
                              </span>
                            </>
                          ) : (
                            <>
                              <span className='text-label disable non-interactive'>
                                <StopOutlined />
                                <Trans>Receipt Mandatory</Trans>
                              </span>
                            </>
                          )}
                          {configData.is_display_no_receipt_attached_field ? (
                            <>
                              <span className='text-label'>
                                <CheckCircleTwoTone />
                                <Trans>Display No Receipt Attached Field</Trans>
                              </span>
                            </>
                          ) : (
                            <>
                              <span className='text-label disable non-interactive'>
                                <StopOutlined />
                                <Trans>Display No Receipt Attached Field</Trans>
                              </span>
                            </>
                          )}
                          {configData.is_remark_for_no_receipt_mandatory ? (
                            <>
                              <span className='text-label'>
                                <CheckCircleTwoTone />
                                <Trans>Remark For No Receipt Mandatory</Trans>
                              </span>
                            </>
                          ) : (
                            <>
                              <span className='text-label disable non-interactive'>
                                <StopOutlined />
                                <Trans>Remark For No Receipt Mandatory</Trans>
                              </span>
                            </>
                          )}
                        </span>
                      </>
                    ) : (
                      <>
                        <span className='text-label disable non-interactive'>
                          <StopOutlined />
                          <Trans>Can Attach Receipts</Trans>
                        </span>
                        <span className='text-content'></span>
                      </>
                    )}
                  </Col>
                ) : null}
                <Col {...innerColSpanProps}>
                  {configData.is_allow_updating_no_of_days ? (
                    <>
                      <span className='text-label'>
                        <CheckCircleTwoTone />
                        <Trans>Allow Updating No Of Days</Trans>
                      </span>
                    </>
                  ) : (
                    <>
                      <span className='text-label disable non-interactive'>
                        <StopOutlined />
                        <Trans>Allow Updating No Of Days</Trans>
                      </span>
                      <span className='text-content'></span>
                    </>
                  )}
                </Col>
                <Col {...innerColSpanProps}>
                  {configData.is_allow_remark ? (
                    <>
                      <span className='text-label'>
                        <CheckCircleTwoTone />
                        <Trans>Allow Remark</Trans>
                      </span>
                      <span className='text-content'>
                        {configData.is_remark_mandatory ? (
                          <>
                            <span className='text-label'>
                              <CheckCircleTwoTone />
                              <Trans>Remark Mandatory</Trans>
                            </span>
                          </>
                        ) : (
                          <>
                            <span className='text-label disable non-interactive'>
                              <StopOutlined />
                              <Trans>Remark Mandatory</Trans>
                            </span>
                          </>
                        )}
                      </span>
                    </>
                  ) : (
                    <>
                      <span className='text-label disable non-interactive'>
                        <StopOutlined />
                        <Trans>Allow Remark</Trans>
                      </span>
                      <span className='text-content'></span>
                    </>
                  )}
                </Col>
                <Col {...innerColSpanProps}>
                  {configData.is_allow_forex ? (
                    <>
                      <span className='text-label'>
                        <CheckCircleTwoTone />
                        <Trans>Allow Forex</Trans>
                      </span>
                      <span className='text-content'>
                        {configData.is_forex_rate_editable_by_employee ? (
                          <>
                            <span className='text-label'>
                              <CheckCircleTwoTone />
                              <Trans>Forex Rate Editable By Employee</Trans>
                            </span>
                          </>
                        ) : (
                          <>
                            <span className=' disable non-interactive'>
                              <StopOutlined />
                              <Trans>Forex Rate Editable By Employee</Trans>
                            </span>
                          </>
                        )}
                        <div>
                          {`Forex Deviation Percentage : ${Number(
                            Number(
                              configData.forex_deviation_percentage,
                            ).toFixed(2),
                          )}`}
                        </div>
                      </span>
                    </>
                  ) : (
                    <>
                      <span className='text-label disable non-interactive'>
                        <StopOutlined />
                        <Trans>Allow Forex</Trans>
                      </span>
                      <span className='text-content'></span>
                    </>
                  )}
                </Col>
                <Col {...innerColSpanProps}>
                  {configData.is_allow_backdated_claims ? (
                    <>
                      <span className='text-label'>
                        <CheckCircleTwoTone />
                        <Trans>Allow Backdated Claims</Trans>
                      </span>
                      <span className='text-content'>
                        <div>
                          {`Backdated Claim Period In Days : ${configData.backdated_claim_period_in_days}`}
                        </div>
                      </span>
                    </>
                  ) : (
                    <>
                      <span className='text-label disable non-interactive'>
                        <StopOutlined />
                        <Trans>Allow Backdated Claims</Trans>
                      </span>
                      <span className='text-content'></span>
                    </>
                  )}
                </Col>
                <Col {...innerColSpanProps}>
                  <>
                    <span className='text-label'>
                      <Trans>Resubmission Period After Rejection In Days</Trans>
                    </span>
                    <span className='text-content'>
                      {Number(
                        configData.resubmission_period_after_rejection_in_days ||
                          0,
                      )}
                    </span>
                  </>
                </Col>
                <Col {...innerColSpanProps}>
                  {configData.is_allow_updating_tax_amount ? (
                    <>
                      <span className='text-label'>
                        <CheckCircleTwoTone />
                        <Trans>Allow updating tax amount</Trans>
                      </span>
                    </>
                  ) : (
                    <>
                      <span className='text-label disable non-interactive'>
                        <StopOutlined />
                        <Trans>Allow updating tax amount</Trans>
                      </span>
                      <span className='text-content'></span>
                    </>
                  )}
                </Col>
                <Col {...innerColSpanProps}>
                  {configData.is_auto_populate_tax_amount ? (
                    <>
                      <span className='text-label'>
                        <CheckCircleTwoTone />
                        <Trans>Auto Populate Tax Amount</Trans>
                      </span>
                    </>
                  ) : (
                    <>
                      <span className='text-label disable non-interactive'>
                        <StopOutlined />
                        <Trans>Auto Populate Tax Amount</Trans>
                      </span>
                      <span className='text-content'></span>
                    </>
                  )}
                </Col>
                <Col {...innerColSpanProps}>
                  {configData.is_allow_charging_to_cost_centres ? (
                    <>
                      <span className='text-label'>
                        <CheckCircleTwoTone />
                        <Trans>Allow Charging To Cost Centres</Trans>
                      </span>
                      <span className='text-content'>
                        {configData.local_cc_threshold_amount &&
                        !configData.is_default_to_entity_cost_centre &&
                        !configData.is_employee_cost_centre_readonly ? (
                          <div>
                            {`Minimum Amount To Allow Any Local Cost Centre : ${getCurrencyFormatting(
                              Number(
                                Number(
                                  configData?.local_cc_threshold_amount,
                                ).toFixed(2),
                              ),
                            )}`}
                          </div>
                        ) : null}
                      </span>
                    </>
                  ) : (
                    <>
                      <span className='text-label disable non-interactive'>
                        <StopOutlined />
                        <Trans>Allow Charging To Cost Centres</Trans>
                      </span>
                      <span className='text-content'></span>
                    </>
                  )}
                </Col>
                {configData.is_allow_charging_to_cost_centres && (
                  <Col {...innerColSpanProps}>
                    {configData.is_default_to_entity_cost_centre ? (
                      <>
                        <span className='text-label'>
                          <CheckCircleTwoTone />
                          <Trans>Custom Cost Centre</Trans>
                        </span>
                        <Table
                          columns={entityCCColumn}
                          dataSource={entityCC}
                          pagination={{
                            defaultPageSize: 5,
                          }}
                          bordered
                        />
                      </>
                    ) : (
                      <>
                        <span className='text-label disable non-interactive'>
                          <StopOutlined />
                          <Trans>Custom Cost Centre</Trans>
                        </span>
                        <span className='text-content'></span>
                      </>
                    )}
                  </Col>
                )}

                {configData.is_allow_charging_to_cost_centres &&
                  !configData.is_default_to_entity_cost_centre && (
                    <Col {...innerColSpanProps}>
                      {configData.is_employee_cost_centre_readonly ? (
                        <>
                          <span className='text-label'>
                            <CheckCircleTwoTone />
                            <Trans>Default to employee cost centre</Trans>
                          </span>
                        </>
                      ) : (
                        <>
                          <span className='text-label disable non-interactive'>
                            <StopOutlined />
                            <Trans>Default to employee cost centre</Trans>
                          </span>
                          <span className='text-content'></span>
                        </>
                      )}
                    </Col>
                  )}

                {configData.is_allow_charging_to_cost_centres &&
                  !configData.is_default_to_entity_cost_centre && (
                    <Col {...innerColSpanProps}>
                      {configData.is_allow_overseas_cost_centres ? (
                        <>
                          <span className='text-label'>
                            <CheckCircleTwoTone />
                            <Trans>Allow Overseas Cost Centres</Trans>
                          </span>
                          <span className='text-content'>
                            {configData.is_employee_cost_centre_readonly ? null : (
                              <div>
                                {`Minimum Amount To Allow Overseas Cost Centre : ${getCurrencyFormatting(
                                  Number(
                                    Number(
                                      configData?.overseas_cc_threshold_amount,
                                    ).toFixed(2),
                                  ),
                                )}`}
                              </div>
                            )}
                          </span>
                        </>
                      ) : (
                        <>
                          <span className='text-label disable non-interactive'>
                            <StopOutlined />
                            <Trans>Allow Overseas Cost Centres</Trans>
                          </span>
                          <span className='text-content'></span>
                        </>
                      )}
                    </Col>
                  )}

                {configData.is_allow_charging_to_cost_centres &&
                  !configData.is_default_to_entity_cost_centre && (
                    <Col {...innerColSpanProps}>
                      {configData.is_allow_internal_order_cost_centres ? (
                        <>
                          <span className='text-label'>
                            <CheckCircleTwoTone />
                            <Trans>Allow Internal Order Cost Centres</Trans>
                          </span>
                        </>
                      ) : (
                        <>
                          <span className='text-label disable non-interactive'>
                            <StopOutlined />
                            <Trans>Allow Internal Order Cost Centres</Trans>
                          </span>
                          <span className='text-content'></span>
                        </>
                      )}
                    </Col>
                  )}

                {configData.is_allow_charging_to_cost_centres &&
                  !configData.is_default_to_entity_cost_centre && (
                    <Col {...innerColSpanProps}>
                      {configData.is_allow_3rd_party_vendor ? (
                        <>
                          <span className='text-label'>
                            <CheckCircleTwoTone />
                            <Trans>Allow Third Party Vendor</Trans>
                          </span>
                        </>
                      ) : (
                        <>
                          <span className='text-label disable non-interactive'>
                            <StopOutlined />
                            <Trans>Allow Third Party Vendor</Trans>
                          </span>
                          <span className='text-content'></span>
                        </>
                      )}
                    </Col>
                  )}
              </Row>
            </Col>
            <Col span={12}>
              <Row>
                <Col {...innerColSpanProps}>
                  {configData.is_allow_updating_mileage_claims_calculated_amount ? (
                    <>
                      <span className='text-label'>
                        <CheckCircleTwoTone />
                        <Trans>
                          Allow Updating Mileage Claims Calculated Amount
                        </Trans>
                      </span>
                      <span className='text-content'></span>
                    </>
                  ) : (
                    <>
                      <span className='text-label disable non-interactive'>
                        <StopOutlined />
                        <Trans>
                          Allow Updating Mileage Claims Calculated Amount
                        </Trans>
                      </span>
                      <span className='text-content'></span>
                    </>
                  )}
                </Col>
                <Col {...innerColSpanProps}>
                  {configData.is_allow_updating_calculated_mileage ? (
                    <>
                      <span className='text-label'>
                        <CheckCircleTwoTone />
                        <Trans>
                          Allow Updating Mileage Claims Calculated Mileage
                        </Trans>
                      </span>
                      <span className='text-content'></span>
                    </>
                  ) : (
                    <>
                      <span className='text-label disable non-interactive'>
                        <StopOutlined />
                        <Trans>
                          Allow Updating Mileage Claims Calculated Mileage
                        </Trans>
                      </span>
                      <span className='text-content'></span>
                    </>
                  )}
                </Col>
                {configData.can_have_staff_members ? (
                  <Col {...innerColSpanProps}>
                    {configData.can_have_staff_members ? (
                      <>
                        <span className='text-label'>
                          <CheckCircleTwoTone />
                          <Trans>Can Have Staff Members</Trans>
                        </span>
                        <span className='text-content'>
                          {configData.are_staff_members_mandatory ? (
                            <span className='text-label'>
                              <CheckCircleTwoTone />
                              <Trans>Are Staff Members Mandatory</Trans>
                            </span>
                          ) : (
                            <span className='text-label disable non-interactive'>
                              <StopOutlined />
                              <Trans>Are Staff Members Mandatory</Trans>
                            </span>
                          )}
                          {configData?.entertainment_rates?.length ? (
                            <>
                              <div>
                                {`Entertainment Rates Per Staff Member : ${getCurrencyFormatting(
                                  configData.entertainment_rates[0]
                                    .rate_per_staff_member
                                    ? Number(
                                        Number(
                                          configData.entertainment_rates[0]
                                            .rate_per_staff_member,
                                        ).toFixed(2),
                                      )
                                    : 0,
                                )}`}
                              </div>
                            </>
                          ) : null}
                        </span>
                      </>
                    ) : (
                      <>
                        <span className='text-label disable non-interactive'>
                          <StopOutlined />
                          <Trans>Can Have Staff Members</Trans>
                        </span>
                        <span className='text-content'></span>
                      </>
                    )}
                  </Col>
                ) : null}
                {configData.can_have_guest_members ? (
                  <Col {...innerColSpanProps}>
                    {configData.can_have_guest_members ? (
                      <>
                        <span className='text-label'>
                          <CheckCircleTwoTone />
                          <Trans>Can Have Guest Members</Trans>
                        </span>
                        <span className='text-content'>
                          {configData.are_guest_members_mandatory ? (
                            <span className='text-label'>
                              <CheckCircleTwoTone />
                              <Trans>Are Guest Members Mandatory</Trans>
                            </span>
                          ) : (
                            <span className='text-label disable non-interactive'>
                              <StopOutlined />
                              <Trans>Are Guest Members Mandatory</Trans>
                            </span>
                          )}
                          {configData?.entertainment_rates?.length ? (
                            <div>
                              {`Entertainment Rates Per Guest Member : ${getCurrencyFormatting(
                                configData.entertainment_rates[0]
                                  .rate_per_guest_member
                                  ? Number(
                                      Number(
                                        configData.entertainment_rates[0]
                                          .rate_per_guest_member,
                                      ).toFixed(2),
                                    )
                                  : 0,
                              )}`}
                            </div>
                          ) : null}
                        </span>
                      </>
                    ) : (
                      <>
                        <span className='text-label disable non-interactive'>
                          <StopOutlined />
                          <Trans>Can Have Guest Members</Trans>
                        </span>
                        <span className='text-content'></span>
                      </>
                    )}
                  </Col>
                ) : null}
                {/* <Col {...innerColSpanProps}>
                  {configData.is_allow_country_selection ? (
                    <>
                      <span className='text-label'>
                        <CheckCircleTwoTone />
                        Allow Country Selection
                      </span>
                      <span className='text-content'></span>
                    </>
                  ) : (
                    <>
                      <span className='text-label disable non-interactive'>
                        <StopOutlined />
                        Allow Country Selection
                      </span>
                      <span className='text-content'></span>
                    </>
                  )}
                </Col> */}
                <Col {...innerColSpanProps}>
                  {configData.is_allow_updating_entertainment_claims_calculated_amount ? (
                    <>
                      <span className='text-label'>
                        <CheckCircleTwoTone />
                        <Trans>
                          Allow Updating Entertainment Claims Calculated Amount
                        </Trans>
                      </span>
                      <span className='text-content'></span>
                    </>
                  ) : (
                    <>
                      <span className='text-label disable non-interactive'>
                        <StopOutlined />
                        <Trans>
                          Allow Updating Entertainment Claims Calculated Amount
                        </Trans>
                      </span>
                      <span className='text-content'></span>
                    </>
                  )}
                </Col>

                <Col {...innerColSpanProps}>
                  {configData.is_allow_voucher_number ? (
                    <>
                      <span className='text-label'>
                        <CheckCircleTwoTone />
                        <Trans>Allow Voucher Number</Trans>
                      </span>
                      <span className='text-content'></span>
                    </>
                  ) : (
                    <>
                      <span className='text-label disable non-interactive'>
                        <StopOutlined />
                        <Trans>Allow Voucher Number</Trans>
                      </span>
                      <span className='text-content'></span>
                    </>
                  )}
                </Col>

                <Col {...innerColSpanProps}>
                  {configData.is_active ? (
                    <>
                      <span className='text-label'>
                        <CheckCircleTwoTone />
                        <Trans>Active</Trans>
                      </span>
                      <span className='text-content'></span>
                    </>
                  ) : (
                    <>
                      <span className='text-label disable non-interactive'>
                        <StopOutlined />
                        <Trans>Active</Trans>
                      </span>
                      <span className='text-content'></span>
                    </>
                  )}
                </Col>
                <Col {...innerColSpanProps}>
                  {configData.is_allow_supporting_documents ? (
                    <>
                      <span className='text-label'>
                        <CheckCircleTwoTone />
                        <Trans>Requires Supporting Documents</Trans>
                      </span>
                      <span className='text-content'></span>
                    </>
                  ) : (
                    <>
                      <span className='text-label disable non-interactive'>
                        <StopOutlined />
                        <Trans>Requires Supporting Documents</Trans>
                      </span>
                      <span className='text-content'></span>
                    </>
                  )}
                </Col>
                <Col {...innerColSpanProps}>
                  {configData.is_allow_claims_against_credit_card ? (
                    <>
                      <span className='text-label'>
                        <CheckCircleTwoTone />
                        <Trans>Allow Claims Against Credit Card</Trans>
                      </span>
                      <span className='text-content'></span>
                    </>
                  ) : (
                    <>
                      <span className='text-label disable non-interactive'>
                        <StopOutlined />
                        <Trans>Allow Claims Against Credit Card</Trans>
                      </span>
                      <span className='text-content'></span>
                    </>
                  )}
                </Col>
                <Col {...innerColSpanProps}>
                  {configData.is_exclude_claims_from_finance_processing ? (
                    <>
                      <span className='text-label'>
                        <CheckCircleTwoTone />
                        <Trans>Exclude Claims From Finance Processing</Trans>
                      </span>
                      <span className='text-content'></span>
                    </>
                  ) : (
                    <>
                      <span className='text-label disable non-interactive'>
                        <StopOutlined />
                        <Trans>Exclude Claims From Finance Processing</Trans>
                      </span>
                      <span className='text-content'></span>
                    </>
                  )}
                </Col>
                <Col {...innerColSpanProps}>
                  {configData.is_assign_using_rules ? (
                    <>
                      <span className='text-label'>
                        <CheckCircleTwoTone />
                        <Trans>Assign Using Rules</Trans>
                      </span>
                      <span className='text-content'></span>
                    </>
                  ) : (
                    <>
                      <span className='text-label disable non-interactive'>
                        <StopOutlined />
                        <Trans>Assign Using Rules</Trans>
                      </span>
                      <span className='text-content'></span>
                    </>
                  )}
                </Col>
                <Col {...innerColSpanProps}>
                  {configData.is_allow_allowance_rate_enabled ? (
                    <>
                      <span className='text-label'>
                        <CheckCircleTwoTone />
                        <Trans>Allowance Rate</Trans>
                      </span>
                      <span className='text-content'></span>
                    </>
                  ) : (
                    <>
                      <span className='text-label disable non-interactive'>
                        <StopOutlined />
                        <Trans>Allowance Rate</Trans>
                      </span>
                      <span className='text-content'></span>
                    </>
                  )}
                </Col>
                {configData.grace_period_in_days ? (
                  <Col {...innerColSpanProps}>
                    <>
                      <span className='text-label'>
                        <Trans>Grace Period In Days</Trans>
                      </span>
                      <span className='text-content'>
                        {configData.grace_period_in_days}
                      </span>
                    </>
                  </Col>
                ) : null}
                {configData.wage_type ? (
                  <Col {...innerColSpanProps}>
                    <>
                      <span className='text-label'>
                        <Trans>Wage Type</Trans>
                      </span>
                      <span className='text-content'>
                        {configData.wage_type.title}
                      </span>
                    </>
                  </Col>
                ) : null}
                {configData.gl_account ? (
                  <Col {...innerColSpanProps}>
                    <>
                      <span className='text-label'>
                        <Trans>GL Account</Trans>
                      </span>
                      <span className='text-content'>
                        {configData.gl_account.account_number}
                      </span>
                    </>
                  </Col>
                ) : null}
              </Row>
            </Col>
          </Row>
          <Row {...rowProps} className='tax-percentages-row'>
            <>
              <Col span={24} className='tax-percentages'>
                <Trans>Tax Percentage</Trans>
              </Col>
              <Col span={23} className='tax-percentages-container'>
                <Table
                  data-testId='tax-percentages-table'
                  columns={taxPercentagesColumn}
                  dataSource={taxPercentagesTableData}
                  pagination={{
                    hideOnSinglePage: true,
                  }}
                  bordered
                />
              </Col>
            </>
          </Row>
          <Row {...rowProps} className='mileage-rate-row'>
            <>
              <Col span={24} className='mileage-rate'>
                <Trans>Mileage Rates</Trans>
              </Col>
              <Col span={23} className='mileage-rate-container'>
                <Table
                  data-testId='mileage-previous-rates-table'
                  columns={mileageRatesColumn}
                  dataSource={mileageRatesTableData}
                  pagination={{
                    hideOnSinglePage: true,
                  }}
                  bordered
                />
              </Col>
            </>
          </Row>
          {configData.expense_type_allowance_rates &&
          configData.expense_type_allowance_rates.length > 0 ? (
            <Row {...rowProps} className='allowance-rate-row'>
              <>
                <Col span={24} className='allowance-rate'>
                  <b>
                    <Trans>Allowance Rates</Trans>
                  </b>
                </Col>
                <Col span={23} className='allowance-rate-container'>
                  <Table
                    data-testId='allowance-previous-rates-table'
                    columns={allowanceColumns}
                    dataSource={configData.expense_type_allowance_rates}
                    pagination={{
                      hideOnSinglePage: true,
                    }}
                    bordered
                  />
                </Col>
              </>
            </Row>
          ) : null}

          <Row {...rowProps} data-testId='instructionContainer'>
            <>
              <Col span={24} className='instruction-title'>
                <Trans>Instruction Text</Trans>
              </Col>
              <Col span={24} className='instruction-container'>
                {configData.instruction_text !== '' ? (
                  <div
                    data-testId='instructionText'
                    dangerouslySetInnerHTML={{
                      __html: configData.instruction_text as string,
                    }}
                  ></div>
                ) : (
                  'No Instruction!'
                )}
              </Col>
            </>
          </Row>
        </>
      )}
    </div>
  );
};

export default ConfigDetails;
