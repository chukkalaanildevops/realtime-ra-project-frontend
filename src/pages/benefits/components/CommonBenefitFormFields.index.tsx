import React, { FC, memo } from 'react';
import { Form, Input, Select } from 'antd';
//import { Trans } from '@lingui/macro';
import { stringTemplating } from '../../../utils/global.utils';
import { GetLabelName } from '../addNewBenefit.index';

const CostCentre: FC<any> = memo(props => {
  const {
    formData,
    viewOnly,
    // getLabelName,
    // backendError,
    JSONData,
    configuration,
    costCenterListLoader,
    mode,
    userJobInfo,
    benefitClaimFetchedData,
    costCenterList,
  } = props;

  const returnCostCenterList = () => {
    try {
      if (
        configuration?.is_allow_charging_to_cost_centres &&
        !configuration?.is_employee_cost_centre_readonly
      ) {
        return (
          <Select
            disabled={viewOnly}
            showSearch={true}
            filterOption={(input: any, option: any) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            loading={costCenterListLoader}
            getPopupContainer={trigger => trigger.parentNode}
          >
            {costCenterList.map((o: any, i: number) => (
              <Select.Option
                key={`cc_${i}`}
                value={o.uuid}
                title={o.title + (o?.code ? ' (' + o?.code + ')' : '')}
              >
                {o.title + (o?.code ? ' (' + o?.code + ')' : '')}
              </Select.Option>
            ))}
          </Select>
        );
      } else {
        return (
          <Select
            disabled={true}
            showSearch={true}
            filterOption={(input: any, option: any) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            getPopupContainer={trigger => trigger.parentNode}
          >
            <Select.Option
              key='Default'
              value={
                mode !== 'ADD'
                  ? formData.cost_centre_uuid
                  : userJobInfo?.cost_centre?.uuid || formData.cost_centre_uuid
              }
              title={
                mode !== 'ADD'
                  ? benefitClaimFetchedData?.cost_centre?.title
                  : userJobInfo?.cost_centre?.title
              }
            >
              {mode !== 'ADD'
                ? benefitClaimFetchedData?.cost_centre?.title +
                  (benefitClaimFetchedData?.cost_centre?.code
                    ? ' (' + benefitClaimFetchedData?.cost_centre?.code + ')'
                    : '')
                : userJobInfo?.cost_centre?.title +
                  (userJobInfo?.cost_centre?.code
                    ? ' (' + userJobInfo?.cost_centre?.code + ')'
                    : '')}
            </Select.Option>
          </Select>
        );
      }
    } catch (error) {
      console.error(error);
      return <></>;
    }
  };

  return formData.charge_to === 'THIRD' ? (
    <Form.Item
      label={
        <GetLabelName
          defaultTitle='Third party vendor'
          configuration={configuration}
        />
      }
      name='third_party_vendor'
      validateTrigger='onBlur'
      className='cost-centre'
      rules={[
        {
          required: true,
          message: stringTemplating(
            {
              label: 'Third party vendor',
            },
            JSONData.vaidationErrors.generalForm.third_party_vendor.mandatory,
          ),
        },
      ]}
    >
      <Input autoComplete='new-password' disabled={viewOnly} />
    </Form.Item>
  ) : (
    <Form.Item
      label={
        <GetLabelName
          defaultTitle='Cost Centre'
          configuration={configuration}
        />
      }
      name='cost_centre_uuid'
      validateTrigger='onBlur'
      className='cost-centre'
      rules={[
        {
          required: true,
          message: stringTemplating(
            { label: 'Cost Centre' },
            JSONData.vaidationErrors.generalForm.cost_centre_uuid.mandatory,
          ),
        },
      ]}
    >
      {viewOnly ? <Input disabled /> : returnCostCenterList()}
    </Form.Item>
  );
});

const ChargeTo: FC<any> = memo(props => {
  const {
    // amount,
    // getLabelName,
    // backendError,
    JSONData,
    viewOnly,
    configuration,
    // chargeTo,
  } = props;

  //   const isDisableChargeTo = (code: TchargeToCodes) => {
  //     let retunBool = false;
  //     if (!configuration?.is_allow_overseas_cost_centres && code === 'OVERS')
  //       retunBool = true;
  //     else if (!configuration?.is_allow_3rd_party_vendor && code === 'THIRD')
  //       retunBool = true;
  //     else if (
  //       !configuration?.is_allow_internal_order_cost_centres &&
  //       code === 'INTER'
  //     )
  //       retunBool = true;

  //     if (!configuration?.is_employee_cost_centre_readonly) {
  //       if (
  //         code === 'OVERS' &&
  //         amount < Number(configuration?.overseas_cc_threshold_amount)
  //       ) {
  //         retunBool = true;
  //       }
  //     }

  //     return retunBool;
  //   };
  //   const isDisableChargeTo = true;

  return (
    <Form.Item
      label={
        <GetLabelName defaultTitle='Charge-to' configuration={configuration} />
      }
      name='charge_to'
      validateTrigger='onBlur'
      className='charge-to'
      rules={[
        {
          required: true,
          message: stringTemplating(
            { label: 'Charge-to' },
            JSONData.vaidationErrors.generalForm.charge_to.mandatory,
          ),
        },
      ]}
    >
      {viewOnly ? (
        <input autoComplete='new-password' disabled={true} />
      ) : (
        <Select
          disabled={viewOnly || configuration?.is_employee_cost_centre_readonly}
          showSearch={true}
          filterOption={(input: any, option: any) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          getPopupContainer={trigger => trigger.parentNode}
        >
          {/* {chargeTo.map((o: IchargeToInnerObj) => {
            const isDiabled = isDisableChargeTo(o.code);
            return (
              <Select.Option
                key={o.code}
                value={o.code}
                disabled={isDiabled}
                title={o.title}
              >
                {o.title}
              </Select.Option>
            );
          })} */}
        </Select>
      )}
    </Form.Item>
  );
});

const Purpose: FC<any> = memo(props => {
  const { JSONData, viewOnly, configuration } = props;

  return (
    <Form.Item
      label={
        <GetLabelName defaultTitle='Purpose' configuration={configuration} />
      }
      name='purpose'
      validateTrigger='onBlur'
      className='purpose'
      rules={[
        {
          required: true,
          message: stringTemplating(
            { label: 'Purpose' },
            JSONData.vaidationErrors.generalForm.purpose.mandatory,
          ),
        },
      ]}
    >
      {viewOnly ? (
        <input autoComplete='new-password' disabled={true} />
      ) : (
        <Select
          disabled={viewOnly || !configuration?.allow_remark}
          showSearch={true}
          filterOption={(input: any, option: any) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          getPopupContainer={trigger => trigger.parentNode}
        ></Select>
      )}
    </Form.Item>
  );
});

export default { CostCentre, ChargeTo, Purpose };
