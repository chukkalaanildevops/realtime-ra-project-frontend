import React, { FC, memo } from 'react';
import AddExpensesForm from './addExpensesForm/addExpensesForm.index';
import GeneralForm from './generalForm/generalForm.index';
import EntertainmentForm from './entertainmentForm/entertainmentForm.index';
import MileageForm from './mileageForm/mileageForm.index';
import AllowanceForm from './allowanceForm/allowanceForm.index';
import AllowanceFormNew from './allowanceNew/allowanceFormNew.index';
import { Iconfiguration } from '../addNewExpense.model';
import { Row, Col, Skeleton, Form, Input } from 'antd';
import { SkeletonItem } from '../../../shared/components';
import CommonFormFields from './commonFormFields/commonFormFields.index';
import MileageTripDetailDrawer from './mileageTripDetailDrawer/mileageTripDetailDrawer.index';
import JSONData from '../addNewExpense.data.json';
import { stringTemplating } from '../../../utils/global.utils';
//import { Trans } from '@lingui/macro';

/**
 * This function return mapped label name if found any.
 * Else returns defaultTitle passed in prop.
 * @param defaultTitle
 */
const GetLabelName: FC<{
  defaultTitle: any;
  configuration: Iconfiguration | null;
}> = props => {
  const { defaultTitle, configuration } = props;
  try {
    const objValue =
      configuration?.label_mapping[
        defaultTitle.toLowerCase().replace(/ /g, '_')
      ];

    // const objValue =
    //   configuration?.label_mapping[
    //     defaultTitle?.props?.id.toLowerCase().replace(/ /g, '_')
    //   ];

    if (objValue) {
      return <span title={defaultTitle}>{objValue?.mapped}</span>;
    }

    // if (objValue) {
    //   return <span title={defaultTitle?.props?.id}>{objValue?.mapped}</span>;
    // }
  } catch (error) {
    console.error(error);
  }
  return <span title={defaultTitle}>{defaultTitle}</span>;

  // return (
  //   <span
  //     title={defaultTitle?.props?.id ? defaultTitle?.props?.id : defaultTitle}
  //   >
  //     {defaultTitle?.props?.id ? defaultTitle?.props?.id : defaultTitle}
  //   </span>
  // );
};

/**
 * Use to show in loading state.
 */
const GetSkeleton: FC = () => (
  <Row
    gutter={[24, 24]}
    className='skeleton-container'
    data-testId='skeleton-container'
  >
    <Col span={24} xl={15}>
      <SkeletonItem type='Form' />
    </Col>
    <Col xl={{ span: 9, offset: 0 }} span={24}>
      <Skeleton.Input className='receipt-skeleton' active />
      {/* <Skeleton.Input active size='small' /> */}
    </Col>
  </Row>
);

const PettyCashFormComponent: FC<{
  getLabelName: Function;
  backendError: any;
  isAdminEdit: boolean;
  configuration: any;
  dateFieldChangeHandler: any;
}> = ({ getLabelName, backendError, isAdminEdit, configuration }) => {
  if (!configuration?.is_allow_voucher_number) return null;

  return (
    <Row gutter={[16, 16]} className='petty-cash-form-section'>
      <Col span={24}>
        <Form.Item
          label={getLabelName('Voucher Number', 'string')}
          name='voucher_number'
          validateTrigger='onChange'
          // trigger='onBlur'
          className='voucher-number'
          validateStatus={
            backendError.hasOwnProperty('voucher_number')
              ? 'error'
              : 'validating'
          }
          help={
            backendError.hasOwnProperty('voucher_number')
              ? backendError.voucher_number[0]
              : null
          }
          required
          rules={[
            () => ({
              validator(_, value) {
                if (value !== undefined) {
                  value = value?.trim();
                }

                if (!value || value === undefined) {
                  return Promise.reject(
                    stringTemplating(
                      {
                        label: getLabelName('Voucher Number', 'string'),
                      },
                      JSONData.vaidationErrors.pettyCashForm.voucherNumber
                        .mandatory,
                    ),
                  );
                } else {
                  if (new RegExp(/^[^@!=\-+#﹘—⸺⸻].*$/).test(value)) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error('Can not start with special character'),
                  );
                }
              },
            }),
          ]}
        >
          <Input autoComplete='new-password' disabled={isAdminEdit} />
        </Form.Item>
      </Col>
    </Row>
  );
};

const PettyCashForm = memo(PettyCashFormComponent);
export {
  AddExpensesForm,
  GeneralForm,
  EntertainmentForm,
  MileageForm,
  AllowanceForm,
  GetLabelName,
  GetSkeleton,
  CommonFormFields,
  MileageTripDetailDrawer,
  PettyCashForm,
  AllowanceFormNew,
};
