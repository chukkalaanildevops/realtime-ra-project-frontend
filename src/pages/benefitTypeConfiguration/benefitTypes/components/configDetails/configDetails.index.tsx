import React, { FC, useEffect, useState } from 'react';
import {
  SkeletonItem,
  BooleanItem,
  OptionalItem,
  ErrorBoundary,
} from '../../../../../shared/components';
import { Row, Col, Table } from 'antd';

import './configDetails.index.less';
import { Trans } from '@lingui/macro';
import moment from 'moment';

const ConfigDetails: React.FC<{
  isDataLoading: boolean;
  configData: any;
  isEntityList?: boolean;
}> = ({ configData = {}, isDataLoading, isEntityList = false }) => {
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
  entityCCList = configData?.initialBenefitCostCenterForLegalEntity.map(
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

  const rowProps: {} = { gutter: [0, 0] };

  const [taxPercentagesTableData, setTaxPercentagesTableData] = useState<any>(
    [],
  );

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

  useEffect(() => {
    const getSortedDataUsingDate = () => {
      let tableData: any = configData?.tax_percentages;

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

  return (
    <div className='benefits-type-config-details-container'>
      {isDataLoading ? (
        <SkeletonItem />
      ) : (
        <ErrorBoundary>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Col span={24} style={{ paddingLeft: 0 }} className={'benefit-'}>
                <BooleanItem
                  title={<Trans>Can Be Entitled For Unlimited Claims</Trans>}
                  value={configData.is_unlimited_no_claims}
                />
              </Col>
              <Col span={24} style={{ paddingLeft: 0 }} className={'benefit-'}>
                <BooleanItem
                  title={<Trans>Restrict No Of Claims Per Period</Trans>}
                  value={configData.restrict_no_of_claims_per_period}
                />
              </Col>

              <Col span={24} style={{ paddingLeft: 0 }} className={'benefit-'}>
                <BooleanItem
                  title={<Trans>Allow Supporting Documents</Trans>}
                  value={configData.is_allow_supporting_documents}
                />
              </Col>

              <Col span={24} style={{ paddingLeft: 0 }} className={'benefit-'}>
                <BooleanItem
                  title={<Trans>Allow Updating Tax Amount</Trans>}
                  value={configData.is_allow_updating_tax_amount}
                />
              </Col>
              <Col span={24} style={{ paddingLeft: 0 }} className={'benefit-'}>
                <BooleanItem
                  title={<Trans>Allow Flexible Benefit</Trans>}
                  value={configData.is_allow_flexible_benefit}
                />
              </Col>
              <Col span={24} style={{ paddingLeft: 0 }} className={'benefit-'}>
                <BooleanItem
                  title={<Trans>Allow Dependent Relations</Trans>}
                  value={configData.is_dependent_benefit}
                />
              </Col>

              <Col span={24} style={{ paddingLeft: 0 }} className={'benefit-'}>
                <BooleanItem
                  title={<Trans>Auto Populate Tax Amount</Trans>}
                  value={configData.is_auto_populate_tax_amount}
                />
              </Col>
              <Col span={24} style={{ paddingLeft: 0 }} className={'benefit-'}>
                <BooleanItem
                  title={<Trans>Can Be Entitled For Unlimited Amount</Trans>}
                  value={configData.is_unlimited_amount}
                />
              </Col>
              <Col span={24} style={{ paddingLeft: 0 }} className={'benefit-'}>
                <BooleanItem
                  title={<Trans>Confirmed Employee Only</Trans>}
                  value={configData.is_only_for_confirmed_employee}
                />
              </Col>
              <Col span={24} style={{ paddingLeft: 0 }} className={'benefit-'}>
                <BooleanItem
                  title={<Trans>Can Attach Receipt</Trans>}
                  value={configData.can_attach_receipts}
                />
                <BooleanItem
                  title={<Trans>Is Receipt Mandatory</Trans>}
                  value={configData.is_receipt_mandatory}
                  normal
                />
                <BooleanItem
                  title={<Trans>Remark For No Receipt Mandatory</Trans>}
                  value={configData.is_remark_for_no_receipt_mandatory}
                  normal
                />
                <BooleanItem
                  title={<Trans>Display No Receipt Attached Field</Trans>}
                  normal
                  value={configData.is_display_no_receipt_attached_field}
                />
              </Col>
              <Col span={24} style={{ paddingLeft: 0 }} className={'benefit-'}>
                <BooleanItem
                  title={<Trans>Allow Purpose</Trans>}
                  value={configData.allow_remark}
                />
                <BooleanItem
                  title={<Trans>Is Purpose Mandatory</Trans>}
                  value={configData.is_remark_mandatory}
                  normal
                />
              </Col>
              <BooleanItem
                classname={'benefit-'}
                title={<Trans>Allow Charging To Cost Centre</Trans>}
                value={configData.is_allow_charging_to_cost_centres}
              />
              {!configData.is_default_to_entity_cost_centre && (
                <BooleanItem
                  title={<Trans>Default To Employee Cost Centre</Trans>}
                  value={configData.is_default_to_employee_cost_centre}
                />
              )}
              {!configData.is_default_to_employee_cost_centre && (
                <>
                  <BooleanItem
                    title={<Trans>Custom Cost Centre</Trans>}
                    value={configData.is_default_to_entity_cost_centre}
                  />
                  <Table
                    columns={entityCCColumn}
                    dataSource={entityCC}
                    pagination={{
                      defaultPageSize: 5,
                    }}
                    bordered
                    // entityCC.cost_centre.title
                  />
                </>
              )}
              {!configData.is_default_to_employee_cost_centre &&
                !configData.is_default_to_entity_cost_centre &&
                configData.is_allow_charging_to_cost_centres && (
                  <>
                    <OptionalItem
                      classname={'benefit-'}
                      title={<Trans>Local CC Threshold Amount</Trans>}
                      value={configData.local_cc_threshold_amount}
                    />
                    <BooleanItem
                      title={<Trans>Allow Charging To Overseas CC</Trans>}
                      value={configData.is_allow_overseas_cost_centres}
                    />
                    <OptionalItem
                      classname={'benefit-'}
                      title={<Trans>Overseas CC Threshold Amount</Trans>}
                      value={configData.overseas_cc_threshold_amount}
                    />
                    <BooleanItem
                      title={<Trans>Can Allow Internal Order CC</Trans>}
                      value={configData.is_allow_internal_order_cost_centres}
                    />
                    <BooleanItem
                      title={<Trans>Can Allow Third Party Vendor</Trans>}
                      value={configData.is_allow_3rd_party_vendor}
                    />
                  </>
                )}
            </Col>

            <Col span={12}>
              <OptionalItem
                classname={'benefit-'}
                title={<Trans>Allow Backdated Claims</Trans>}
                value={
                  <>
                    <Trans>Backdated Claim Period In Days</Trans>{' '}
                    {configData.backdated_claims_allowed_upto}
                  </>
                }
              />
              <OptionalItem
                classname={'benefit-'}
                title={
                  <Trans>Resubmission Period After Rejection In Days</Trans>
                }
                value={configData.resubmission_period_after_rejection_in_days}
              />

              <OptionalItem
                classname={'benefit-'}
                title={<Trans>Deductible Document</Trans>}
                value={(configData.deductible_component as any)?.title}
              />
              {(configData.frequency_unit as any)?.title && (
                <OptionalItem
                  classname={'benefit-'}
                  title={<Trans>Frequency Unit</Trans>}
                  value={(configData.frequency_unit as any)?.title}
                />
              )}
              {(configData.proration as any)?.title && (
                <OptionalItem
                  classname={'benefit-'}
                  title={<Trans>Proration</Trans>}
                  value={(configData.proration as any)?.title}
                />
              )}

              {(configData.max_claims_per_entitlement_period as any)?.title && (
                <OptionalItem
                  classname={'benefit-'}
                  title={<Trans>Maximum claims per entitlement period</Trans>}
                  value={
                    (configData.max_claims_per_entitlement_period as any)?.title
                  }
                />
              )}
              <OptionalItem
                classname={'benefit-'}
                title={<Trans>Maximum number of claims for frequency</Trans>}
                value={configData.max_claims_for_entitlement_period}
              />
              <OptionalItem
                classname={'benefit-'}
                title={<Trans>Maximum number of claims per frequency</Trans>}
                value={configData.max_no_of_claims_per_frequency}
              />
              <OptionalItem
                classname={'benefit-'}
                title={<Trans>Number of years</Trans>}
                value={configData.no_of_frequency}
              />
              <OptionalItem
                classname={'benefit-'}
                title={<Trans>Benefit Entitlement Period</Trans>}
                value={(configData.benefit_entitlement_period as any)?.title}
              />
              <OptionalItem
                classname={'benefit-'}
                title={<Trans>Grace Period In Days</Trans>}
                value={configData.grace_period_in_days}
              />
              {/* <OptionalItem classname={'benefit-'}
                title={ <Trans>Can Claim For</Trans> }
                // value={getValue(CAN_CLAIM_FOR, configData.can_claim_for)}
                value={(configData.can_claim_for as any)?.title}
              />
              <OptionalItem classname={'benefit-'}
                title={ <Trans>Grace Period In Days</Trans>}
                value={configData.grace_period}
              /> */}
              {!configData.is_allow_flexible_benefit && (
                <OptionalItem
                  classname={'benefit-'}
                  title={<Trans>Wage Type</Trans>}
                  value={(configData?.wage_type as any)?.title || 'Not Defined'}
                />
              )}
              <OptionalItem
                classname={'benefit-'}
                title={<Trans>GL Account</Trans>}
                value={
                  (configData.gl_account as any)?.account_number ||
                  'Not Defined'
                }
              />
            </Col>
            <Row {...rowProps} className='tax-percentages-row' justify='end'>
              <>
                <Col span={23} className='tax-percentages'>
                  <Trans>Tax Percentage</Trans>
                </Col>
                <Col span={23} className='tax-percentages-container'>
                  <Table
                    data-test='tax-percentages-table'
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
          </Row>
          <Row gutter={[16, 16]}>
            <>
              <Col span={24}>
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
