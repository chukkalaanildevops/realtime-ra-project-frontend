import React, { FC, memo } from 'react';
import { Form, Input, Select, DatePicker, Tag } from 'antd';
import {
  TchargeToCodes,
  IchargeToInnerObj,
  IvalidationError,
  Tmode,
  IexpenseTypeList,
} from '../../addNewExpense.model';
import moment, { Moment } from 'moment';
import { stringTemplating } from '../../../../utils/global.utils';
import { Trans } from '@lingui/macro';

const ExpenseType: FC<{
  getLabelName: Function;
  backendError: IvalidationError;
  JSONData: { [x: string]: any };
  expenseTypeListLoader: boolean;
  disableState: boolean;
  mode: Tmode;
  expenseClaimFetchedData: any;
  expenseTypeList: any;
}> = memo(props => {
  const {
    getLabelName,
    backendError,
    JSONData,
    expenseTypeListLoader,
    mode,
    expenseClaimFetchedData,
    expenseTypeList,
    disableState,
  } = props;
  return (
    <>
      <Form.Item
        label={getLabelName('Expense Type', 'string')}
        name='expense_type_legal_entity'
        validateTrigger='onBlur'
        className='expense-type'
        validateStatus={
          backendError.hasOwnProperty('expense_type_legal_entity')
            ? 'error'
            : 'validating'
        }
        help={
          backendError.hasOwnProperty('expense_type_legal_entity')
            ? backendError.expense_type_legal_entity[0]
            : null
        }
        rules={[
          {
            required: true,
            message: stringTemplating(
              { label: getLabelName('Expense Type', 'string') },
              JSONData.vaidationErrors.generalForm.expense_type_legal_entity
                .mandatory,
            ),
          },
        ]}
        data-cy='expenseTypeFormItemWrapper'
      >
        {/* Show all the type of general, entertainmen, mileage or petty cast configuration tied to user legal entity type */}
        <Select
          loading={expenseTypeListLoader}
          disabled={expenseTypeList.length === 0 ? true : disableState}
          showSearch={true}
          filterOption={(input: any, option: any) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          getPopupContainer={trigger => trigger.parentNode}
          data-cy='expenseTypeDropdown'
        >
          {(['UPDATE', 'CLONE'].includes(mode)
            ? Boolean(expenseClaimFetchedData?.expense_type_legal_entity)
              ? [expenseClaimFetchedData.expense_type_legal_entity]
              : []
            : expenseTypeList
          ).map((o: IexpenseTypeList) => (
            // eslint-disable-next-line no-sequences

            <Select.Option
              key={o.id}
              value={o.id}
              disabled={
                typeof o?.can_attach === 'boolean' ? !o?.can_attach : false
              }
            >
              {o.expense_type.title}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      {expenseTypeList.length === 0 &&
        expenseTypeList.length < 0 &&
        !expenseTypeListLoader &&
        mode === 'ADD' && (
          <div>
            <Trans>User is not eligible for this Expense Type</Trans>{' '}
          </div>
        )}
    </>
  );
});

const ExpenseDate: FC<{
  viewOnly: any;
  getLabelName: any;
  backendError: any;
  JSONData: any;
  mode: any;
  isAdminEdit: any;
  configuration: any;
  requestDetails?: any;
  is_resubmission_case?: boolean;
  calculateAmoutUsingConversionRate?: any;
  formData?: any;
  formType?: string;
  dateFieldChangeHandler?: any;
  scannedReceiptDate?: any;
  is_enabled_ocr?: any;
  form?: any;
  expenseClaimFetchedData: any;
}> = memo(props => {
  const {
    getLabelName,
    backendError,
    JSONData,
    configuration,
    requestDetails = null,
    isAdminEdit,
    is_resubmission_case = false,
    calculateAmoutUsingConversionRate,
    formData,
    formType,
    scannedReceiptDate,
    is_enabled_ocr,
    dateFieldChangeHandler,
    form,
    expenseClaimFetchedData,
  } = props;

  const scannedDateClickedHandler = (date: any) => {
    formData.general_form.date = moment(date, ['DD/MM/YYYY']);
    form.setFieldsValue({ date: moment(date, ['DD/MM/YYYY']) });
    formType !== 'MIL' &&
      calculateAmoutUsingConversionRate(
        'date',
        String(formData?.general_form.conversion_rate || 1),
      );
    dateFieldChangeHandler({ date: moment(date, ['DD/MM/YYYY']) }, 'date');
  };

  const disabledDate = (current: Moment): boolean => {
    let condition: boolean = false;
    try {
      if (configuration === null) return false;

      if (isAdminEdit) return current >= moment(); //disabling only future dates

      if (current) {
        if (
          configuration?.is_allow_backdated_claims &&
          configuration?.backdated_claim_period_in_days
        ) {
          if (requestDetails || expenseClaimFetchedData?.request) {
            let start_date = requestDetails
              ? moment(requestDetails.end_date, 'DD/MM/YYYY')
                  .subtract(
                    configuration?.backdated_claim_period_in_days,
                    'days',
                  )
                  .endOf('day')
              : moment(expenseClaimFetchedData?.request?.end_date, 'DD/MM/YYYY')
                  .subtract(
                    configuration?.backdated_claim_period_in_days,
                    'days',
                  )
                  .endOf('day');
            let end_date = requestDetails
              ? moment(requestDetails.end_date, 'DD/MM/YYYY')
                  .add(configuration?.backdated_claim_period_in_days, 'days')
                  .endOf('day')
              : moment(expenseClaimFetchedData?.request?.end_date, 'DD/MM/YYYY')
                  .add(configuration?.backdated_claim_period_in_days, 'days')
                  .endOf('day');
            condition = start_date >= current || current >= end_date;
          } else {
            condition =
              current <
              moment()
                .subtract(configuration?.backdated_claim_period_in_days, 'days')
                .startOf('day');
          }
        } else {
          condition =
            current <=
            moment()
              .subtract(1, 'days')
              .endOf('day');
        }
      }
    } catch (error) {
      console.error(error);
    }
    if (requestDetails || expenseClaimFetchedData?.request) {
      return condition || current >= moment();
    }
    return condition || current >= moment();
  };

  return (
    <>
      <Form.Item
        label={getLabelName('Receipt Date', 'string')}
        name='date'
        validateTrigger='onChange'
        className='date'
        validateStatus={
          backendError.hasOwnProperty('date') ||
          backendError.hasOwnProperty('receipt_date')
            ? 'error'
            : 'validating'
        }
        help={
          backendError.hasOwnProperty('date')
            ? backendError.date[0]
            : backendError.hasOwnProperty('receipt_date')
            ? backendError?.receipt_date[0]
            : null
        }
        rules={[
          {
            required: true,
            message: stringTemplating(
              { label: getLabelName('Receipt Date', 'string') },
              JSONData.vaidationErrors.generalForm.date.mandatory,
            ),
          },
        ]}
        data-cy='receiptDateFormItemWrapper'
      >
        <DatePicker
          disabledDate={disabledDate}
          format='DD/MM/YYYY'
          style={{ width: '100%' }}
          data-cy='receiptDateDatePickerInput'
          showToday={false}
          disabled={is_resubmission_case}
          onChange={() => {
            formType !== 'MIL' &&
              formType !== 'ALW' &&
              calculateAmoutUsingConversionRate(
                'date',
                String(formData?.general_form.conversion_rate || 1),
              );
          }}
        />
      </Form.Item>
      {scannedReceiptDate?.length > 0 &&
        is_enabled_ocr &&
        scannedReceiptDate.map((item: any) => (
          <Tag
            color='processing'
            className='scanned-receipt-data'
            onClick={(event: any) => {
              event.preventDefault();
              scannedDateClickedHandler(item);
            }}
          >
            {item}
          </Tag>
        ))}
    </>
  );
});

/**
 * Cost Center Form Fields
 */
const CostCentre: FC<any> = memo(props => {
  const {
    formData,
    viewOnly,
    getLabelName,
    backendError,
    JSONData,
    configuration,
    costCenterListLoader,
    mode,
    userJobInfo,
    expenseClaimFetchedData,
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
                  ? formData.general_form.cost_centre_uuid
                  : userJobInfo?.cost_centre?.uuid ||
                    formData.general_form.cost_centre_uuid
              }
              title={
                mode !== 'ADD'
                  ? expenseClaimFetchedData?.cost_centre?.title
                  : userJobInfo?.cost_centre?.title
              }
            >
              {mode !== 'ADD'
                ? expenseClaimFetchedData?.cost_centre?.title +
                  (expenseClaimFetchedData?.cost_centre?.code
                    ? ' (' + expenseClaimFetchedData?.cost_centre?.code + ')'
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

  return formData.general_form.charge_to === 'THIRD' ? (
    <Form.Item
      label={getLabelName('Third party vendor', 'string')}
      name='third_party_vendor'
      validateTrigger='onBlur'
      className='cost-centre'
      validateStatus={
        backendError.hasOwnProperty('third_party_vendor')
          ? 'error'
          : 'validating'
      }
      help={
        backendError.hasOwnProperty('third_party_vendor')
          ? backendError.third_party_vendor[0]
          : null
      }
      rules={[
        {
          required: true,
          message: stringTemplating(
            {
              label: getLabelName('Third party vendor', 'string'),
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
      label={getLabelName('Cost Centre', 'string')}
      name='cost_centre_uuid'
      validateTrigger='onBlur'
      className='cost-centre'
      validateStatus={
        backendError.hasOwnProperty('cost_centre_uuid') ? 'error' : 'validating'
      }
      help={
        backendError.hasOwnProperty('cost_centre_uuid')
          ? backendError.cost_centre_uuid[0]
          : null
      }
      rules={[
        {
          required: true,
          message: stringTemplating(
            { label: getLabelName('Cost Centre', 'string') },
            JSONData.vaidationErrors.generalForm.cost_centre_uuid.mandatory,
          ),
        },
      ]}
    >
      {viewOnly ? <Input disabled /> : returnCostCenterList()}
    </Form.Item>
  );
});

/**
 * Chanreg To Form Field
 */
const ChargeTo: FC<any> = memo(props => {
  const {
    amount,
    getLabelName,
    backendError,
    JSONData,
    viewOnly,
    configuration,
    chargeTo,
  } = props;

  const isDisableChargeTo = (code: TchargeToCodes) => {
    let retunBool = false;
    if (!configuration?.is_allow_overseas_cost_centres && code === 'OVERS')
      retunBool = true;
    else if (!configuration?.is_allow_3rd_party_vendor && code === 'THIRD')
      retunBool = true;
    else if (
      !configuration?.is_allow_internal_order_cost_centres &&
      code === 'INTER'
    )
      retunBool = true;

    if (!configuration?.is_employee_cost_centre_readonly) {
      if (
        code === 'OVERS' &&
        amount < Number(configuration?.overseas_cc_threshold_amount)
      ) {
        retunBool = true;
      }
    }

    return retunBool;
  };

  // if (configuration?.is_employee_cost_centre_readonly) {
  //   return null;
  // }

  return (
    <Form.Item
      label={getLabelName('Charge-to', 'string')}
      name='charge_to'
      validateTrigger='onBlur'
      className='charge-to'
      validateStatus={
        backendError.hasOwnProperty('charge_to') ? 'error' : 'validating'
      }
      help={
        backendError.hasOwnProperty('charge_to')
          ? backendError.charge_to[0]
          : null
      }
      rules={[
        {
          required: true,
          message: stringTemplating(
            { label: getLabelName('Charge-to', 'string') },
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
          {chargeTo.map((o: IchargeToInnerObj) => {
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
          })}
        </Select>
      )}
    </Form.Item>
  );
});

export default { ExpenseType, ExpenseDate, CostCentre, ChargeTo };
