import {
  Button,
  Card,
  Checkbox,
  Col,
  Collapse,
  Form,
  FormProps,
  Row,
  Skeleton,
  Table,
  Tooltip,
  Space,
} from 'antd';
import { Trans } from '@lingui/macro';
import React, {
  Dispatch,
  FC,
  memo,
  ReactNode,
  useEffect,
  useState,
} from 'react';
import { connect } from 'react-redux';
import { ColumnsType } from 'antd/lib/table';
import { StatusTag } from '../../../shared/components';
import {
  GeneralFields,
  EntertainmentFields,
  CustomFields,
  PettyCashFields,
} from '../../../pages/addNewExpense/claimDetails/components';
import {
  Amount,
  AdminFieldIcon,
  NoData,
  Remarks,
  ErrorBoundary,
  DocumentsViewer,
  Remark,
} from '../../../shared/components';
import { getFormattedDate } from '../../../utils/scroll.utils';
import { timeZoneMomentDate } from '../../../utils/global.utils';
import moment, { Moment } from 'moment';

import { stateInterface } from '../../redux/rootReducer';
import { SafetyCertificateTwoTone, PaperClipOutlined } from '@ant-design/icons';
import { IWorkFlowDetails, IBEReceipt } from '../../model';

// const getPageBreak = () => {
//   return `@media print {
//     span {
//       page-break-before: always;
//     }
//     h3, h4 {
//       page-break-after: avoid;
//     }
//     pre, blockquote {
//       page-break-inside: avoid;
//     }
//   }`;
// };
const getPageMargins = () => {
  return `@page { margin: 10mm 10mm 10mm 10mm !important; }`;
};

const mapStateToProps = (state: stateInterface) => {
  const {
    expenseClaimFetchedData,
    activeTabKey,
    configuration,
  } = state.AddNewExpenseForm;

  const { workflowDataForPDFPrint } = state.app;

  const { requestDetailInstance, requestTypeConfiguration } = state.request;

  const {
    userInfo,
    formData,
    benefitEntitledConfig,
    fetchedBenefitClaimData,
    benefitDependentInfo,
  } = state.BenefitReducer;

  return {
    expenseClaimFetchedData,
    activeTabKey,
    configuration,
    workflowDataForPDFPrint,
    requestDetailInstance,
    requestTypeConfiguration,
    userInfo,
    formData,
    benefitEntitledConfig,
    fetchedBenefitClaimData,
    benefitDependentInfo,
  };
};

// eslint-disable-next-line no-unused-vars
const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  return {};
};
const connector = connect(mapStateToProps, mapDispatchToProps);
const rowGutter: [number, number] = [24, 24];

const PrintPDF: FC<{
  expenseClaimFetchedData: any;
  isCreatedByVisible: boolean;
  configuration: any;
  activeTabKey: any;
  isUseForFormPreview?: boolean;
  formProps?: FormProps;
  isAdmin: boolean;
  claimType: string;
  claimTitleId: string;
  claimStatus: any;
  workflowDataForPDFPrint: any;
  requestDetailInstance: { [key: string]: any };
  requestTypeConfiguration: { [key: string]: any };
  benefitEntitledConfig: any;
  fetchedBenefitClaimData: any;
  formData: any;
  benefitDependentInfo: any;
}> = props => {
  const {
    activeTabKey,
    configuration,
    expenseClaimFetchedData,
    isCreatedByVisible,
    isUseForFormPreview,
    benefitDependentInfo,
    formProps,
    isAdmin,
    claimType,
    claimTitleId,
    claimStatus,
    workflowDataForPDFPrint,
    requestDetailInstance,
    requestTypeConfiguration,
    benefitEntitledConfig,
    fetchedBenefitClaimData,
    formData,
  } = props;

  const addExpenseFormContainerColSize: number =
    activeTabKey === 'mileage' || activeTabKey === 'allowance' ? 24 : 14;

  const benefitConfiguration: any =
    benefitEntitledConfig?.benefit_type_configuration;
  const labelMapping: any = benefitConfiguration?.label_mapping;
  const benefitCategory = benefitEntitledConfig?.benefit_category;

  const receiptImageURL = (f: any) =>
    typeof f?.file === 'string' ? f?.file : window.URL.createObjectURL(f || '');

  const [form] = Form.useForm();
  const formLayout = {
    labelCol: {
      span: 24,
    },
    wrapperCol: {
      span: 24,
      offset: 0,
    },
  };

  const commonFormProps: any = {
    scrollToFirstError: true,
    size: 'middle',
    layout: 'horizontal',
    colon: false,
    autoComplete: 'off',
    initialValues: {
      entertainment_staff_members: [
        {
          emp_id: 'employee 1',
          member: 'employee 1',
          designation: 'employee 1',
        },
      ],
      entertainment_guest_members: [
        {
          member: '',
          organisation: '',
          designation: '',
        },
      ],
    },
  };

  const benefitformProps = {
    form: form,
    ...formLayout,
    ...commonFormProps,
  };
  const [
    benefitDependentRelationship,
    setBenefitDependentRelationship,
  ] = useState<any>(null);
  useEffect(() => {
    if (
      benefitConfiguration?.is_dependent_benefit &&
      benefitDependentInfo?.length > 0
    ) {
      const selectedDependentInfo = benefitDependentInfo?.find(
        (info: any) => info.uuid === formData.dependent_uuid,
      );
      setBenefitDependentRelationship(selectedDependentInfo);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [benefitEntitledConfig, benefitDependentInfo]);
  const columnsForMileage = [
    {
      title: <Trans>Trip Date</Trans>,
      dataIndex: 'date',
      key: 'date',
      fixed: true,
      render: (text: Moment) =>
        moment.isMoment(text) ? text.format('DD/MM/YYYY') : text || '',
      width: '100px',
    },
    {
      title: <Trans>Start Place</Trans>,
      dataIndex: 'source',
      key: 'source',
      ellipsis: false,
      render: (text: any) => <span className='address'>{text}</span>,
    },
    {
      title: <Trans>End Place</Trans>,
      dataIndex: 'destination',
      key: 'destination',
      ellipsis: false,
      render: (text: any) => <span className='address'>{text}</span>,
    },
    {
      title: <Trans>Distance (KM)</Trans>,
      dataIndex: 'auto_calculated_mileage',
      key: 'auto_calculated_mileage',
      align: 'left' as any,
      render: (text: any) => Number(text || 0).toFixed(4),
      width: 120,
    },
    {
      title: <Trans>Mileage Amount</Trans>,
      dataIndex: 'amount',
      key: 'amount',
      align: 'center' as any,
      width: 135,
      render: (text: any) => (
        <Amount
          align='right'
          amount={Number(Number(text || 0).toFixed(2))}
          currency={
            expenseClaimFetchedData?.converted_amount_currency?.currency
              ?.code || ''
          }
        />
      ),
    },
    {
      title: <Trans>Parking Charges</Trans>,
      dataIndex: 'parking_charges',
      key: 'parking_charges',
      align: 'center' as any,
      width: 135,
      render: (text: any) => (
        <Amount
          align='right'
          amount={Number(Number(text || 0).toFixed(2))}
          currency={
            expenseClaimFetchedData?.converted_amount_currency?.currency
              ?.code || ''
          }
        />
      ),
    },
    {
      title: <Trans>Toll Charges</Trans>,
      dataIndex: 'toll_charges',
      key: 'toll_charges',
      align: 'center' as any,
      width: 135,
      render: (text: any) => (
        <Amount
          align='right'
          amount={Number(Number(text || 0).toFixed(2))}
          currency={
            expenseClaimFetchedData?.converted_amount_currency?.currency
              ?.code || ''
          }
        />
      ),
    },
    {
      title: <Trans>Other Charges</Trans>,
      dataIndex: 'other_charges',
      key: 'other_charges',
      align: 'center' as any,
      width: 135,
      render: (text: any) => (
        <Amount
          align='right'
          amount={Number(Number(text || 0).toFixed(2))}
          currency={
            expenseClaimFetchedData?.converted_amount_currency?.currency
              ?.code || ''
          }
        />
      ),
    },
    {
      title: <Trans>Total Amount</Trans>,
      dataIndex: 'total_amount',
      key: 'total_amount',
      align: 'center' as any,
      width: 135,
      render: (text: any) => (
        <Amount
          align='right'
          amount={Number(Number(text || 0).toFixed(2))}
          currency={
            expenseClaimFetchedData?.converted_amount_currency?.currency
              ?.code || ''
          }
        />
      ),
    },
    {
      title: <Trans>Is A Round Trip</Trans>,
      dataIndex: 'is_a_round_trip',
      key: 'is_a_round_trip',
      align: 'center' as any,
      width: 135,
      render: (text: any) => (text ? 'Yes' : 'No'),
    },
    {
      title: <Trans>Receipt/s</Trans>,
      dataIndex: 'receipt',
      key: 'receipt',
      align: 'center' as any,
      render: (_file: File | IBEReceipt, _row: any) => {
        return (
          <DocumentsViewer
            itemType='expense'
            itemNumber={expenseClaimFetchedData?.claim_number}
            documents={_row.supporting_documents}
            receipt={_file ? { ..._file, file: receiptImageURL(_file) } : null}
            icon={<PaperClipOutlined />}
          />
        );
      },
    },
    {
      title: <Trans>Remark</Trans>,
      dataIndex: 'purpose',
      key: 'purpose',
      ellipsis: false,
      align: 'center' as any,
      width: '7%',
      render: (_val: string, _item: any, _index: number) => (
        <Remark remark={_val} />
      ),
    },
  ];

  const columnsForAllowance = [
    // {
    //   title: <Trans>Date</Trans>,
    //   dataIndex: 'date',
    //   key: 'date',
    //   align: 'center' as 'center',
    //   width: 10,
    //   render: (text: Moment) =>
    //     moment.isMoment(text)
    //       ? text.format('DD/MM/YYYY')
    //       : moment(text, ['DD/MM/YYYY', 'DD-MM-YYYY']).format('DD/MM/YYYY') ||
    //         '',
    // },
    {
      title: <Trans>From Date</Trans>,
      dataIndex: 'from_date',
      key: 'from_date',
      align: 'center' as 'center',
      width: 10,
      render: (text: Moment) =>
        moment.isMoment(text)
          ? text.format('DD/MM/YYYY')
          : moment(text, ['DD/MM/YYYY', 'DD-MM-YYYY']).format('DD/MM/YYYY') ||
            '',
    },
    {
      title: <Trans>To Date</Trans>,
      dataIndex: 'to_date',
      key: 'to_date',
      align: 'center' as 'center',
      width: 10,
      render: (text: Moment) =>
        moment.isMoment(text)
          ? text.format('DD/MM/YYYY')
          : moment(text, ['DD/MM/YYYY', 'DD-MM-YYYY']).format('DD/MM/YYYY') ||
            '',
    },
    {
      title: <Trans>No. Of Days</Trans>,
      dataIndex: 'no_of_days',
      key: 'no_of_days',
      align: 'center' as 'center',
      width: 10,
      render: (text: any) => <span className='address'>{text}</span>,
    },
    {
      title: <Trans>Location</Trans>,
      dataIndex: 'location',
      key: 'location',
      align: 'center' as 'center',
      width: 10,
      render: (text: any) => <span className='address'>{text.title}</span>,
    },
    {
      title: <Trans>Allowance Type</Trans>,
      dataIndex: 'allowance_rate',
      key: 'allowance_rate',
      align: 'center' as 'center',
      width: 10,
      render: (text: any) => (
        <span className='address'>{text.subrate_title}</span>
      ),
    },
    {
      title: <Trans>Approved Amount</Trans>,
      dataIndex: 'approved_amount',
      key: 'approved_amount',
      align: 'center' as 'center',
      width: 10,
      render: (text: any) => {
        // const obj = allowanceTypes.filter(
        //   (item: any) => item.id === allowanceTypeId,
        // );
        // return (
        //   <Amount
        //     align='center'
        //     amount={text}
        //     //currency={obj[0].allowance_currency.title}
        //   />
        // );

        return (
          <div>
            <span>
              {text !== undefined && text !== 0 && text !== null
                ? Number(Number(text).toFixed(2))
                : 'Unlimited'}
            </span>
          </div>
        );
      },
    },
    {
      title: <Trans>Amount</Trans>,
      dataIndex: 'amount',
      key: 'amount',
      align: 'center' as any,
      width: 10,
      render: (text: any) => {
        //return <Amount align='center' amount={text} />;

        return (
          <div>
            <span>{Number(Number(text).toFixed(2))}</span>
          </div>
        );
      },
    },
    {
      title: <Trans>Currency</Trans>,
      dataIndex: 'allowance_currency',
      key: 'allowance_currency',
      align: 'center' as 'center',
      width: 10,
      render: (text: any) => <span className='address'>{text}</span>,
    },
    {
      title: <Trans>Conversion Rate</Trans>,
      dataIndex: 'conversion_rate',
      key: 'conversion_rate',
      align: 'center' as 'center',
      width: 10,
      render: (text: any) => (
        <span className='address'>{Number(text).toFixed(4)}</span>
      ),
    },
    {
      title: <Trans>Converted Amount</Trans>,
      dataIndex: 'converted_amount',
      key: 'converted_amount',
      align: 'center' as 'center',
      width: 10,
      render: (text: any) => (
        <span className='address'>{Number(Number(text).toFixed(2))}</span>
      ),
    },
    {
      title: <Trans>Receipt/s</Trans>,
      dataIndex: 'receipt',
      key: 'receipt',
      align: 'center' as 'center',
      width: 10,
      render: (_file: File | any, _row: any) => {
        const supDoc = (_row.supporting_documents || []).map((o: any) =>
          o.hasOwnProperty('attachment')
            ? o
            : {
                attachment: receiptImageURL(o),
                file_name: o.name,
                file_type: o.type,
              },
        );
        return (
          <DocumentsViewer
            itemType='expense'
            itemNumber={expenseClaimFetchedData?.claim_number || 'N/A'}
            documents={supDoc}
            receipt={
              _file
                ? {
                    ..._file,
                    file: receiptImageURL(_file),
                    file_type: _file?.file_type || _file?.type,
                    receipt_number: _row.receipt_number,
                  }
                : null
            }
            icon={<PaperClipOutlined />}
          />
        );
      },
    },
    // {
    //   title: <Trans>Remark</Trans>,
    //   dataIndex: 'purpose',
    //   key: 'purpose',
    //   ellipsis: false,
    //   align: 'center' as 'center',
    //   width: 10,
    //   render: (_val: string, _item: any, _index: number) => (
    //     <Remark remark={_val} />
    //   ),
    // },
  ];

  const AttachedClaims = requestDetailInstance?.expense_claim?.filter(
    (item: any) => item.workflow_status?.title !== 'Drafted',
  );

  const columnsForAttachedClaims = [
    {
      dataIndex: 'claim_number',
      title: () => <Trans>Expense ID</Trans>,
      align: 'center' as 'center',
      width: '10%',
      render: (val: any) => val,
    },
    {
      dataIndex: 'date',
      title: () => <Trans>Receipt Date</Trans>,
      align: 'center' as 'center',
      width: '10%',
      render: (val: any) => val,
    },
    {
      dataIndex: 'employee',
      title: () => <Trans>Employee Name</Trans>,
      align: 'center' as 'center',
      width: '10%',
      render: (val: any) => val?.legal_name || val?.name,
    },
    {
      dataIndex: 'expense_type_legal_entity',
      title: () => <Trans>Expense Type</Trans>,
      align: 'center' as 'center',
      width: '10%',
      render: (val: any) => val?.expense_type?.title,
    },
    {
      dataIndex: 'expense_type_legal_entity',
      title: () => <Trans>Category</Trans>,
      align: 'center' as 'center',
      width: '10%',
      render: (val: any) => val?.expense_type?.category?.title,
    },
    {
      dataIndex: 'expense_type_legal_entity',
      title: () => <Trans>Amount</Trans>,
      render: (val: any, item: any) => (
        <Amount
          amount={item.converted_amount}
          currency={val?.legal_entity?.currency?.currency?.code}
          align='center'
        />
      ),
      align: 'center' as 'center',
      width: '10%',
    },
    {
      dataIndex: 'total_comments',
      title: () => <Trans>Remarks</Trans>,
      align: 'center' as 'center',
      width: '10%',
      render: (val: any, item: any) => (
        <Remarks
          remarkCount={val}
          itemId={item.id}
          itemType='expense-claims'
          item_no={item.claim_number}
        />
      ),
    },
    {
      dataIndex: 'workflow_status',
      width: '10%',
      title: () => <Trans>Status</Trans>,
      align: 'center' as 'center',
      render: (val: any) => <StatusTag status={val} />,
    },
  ];

  const getFormRelatedFields = () => {
    return (
      <>
        {/* GENERAL */}
        <GeneralFields
          activeTabKey={activeTabKey}
          configuration={configuration}
          expenseClaimFetchedData={expenseClaimFetchedData}
          isCreatedByVisible={isCreatedByVisible}
          isUseForFormPreview={isUseForFormPreview}
        />
        {/* PETTY CASH */}
        {activeTabKey === 'petty' && (
          <PettyCashFields
            configuration={configuration}
            expenseClaimFetchedData={expenseClaimFetchedData}
            isUseForFormPreview={isUseForFormPreview}
          />
        )}
        {/* ENTERTAINMENT */}
        {activeTabKey === 'entertainment' && (
          <EntertainmentFields
            configuration={configuration}
            expenseClaimFetchedData={expenseClaimFetchedData}
            isUseForFormPreview={isUseForFormPreview}
          />
        )}
        {/* MILEAGE */}
        {activeTabKey === 'mileage' && (
          <Row gutter={rowGutter} className='mileage-form-section'>
            <ErrorBoundary>
              <Col span={24}>
                <Table
                  scroll={{
                    x: true,
                  }}
                  dataSource={expenseClaimFetchedData?.mileage_records}
                  columns={columnsForMileage}
                  pagination={false}
                />
              </Col>
            </ErrorBoundary>
          </Row>
        )}
        {/* ALLOWANCE */}
        {activeTabKey === 'allowance' && (
          <Row gutter={rowGutter} className='allowance-form-section'>
            <ErrorBoundary>
              <Col span={24}>
                <Table
                  scroll={{
                    x: true,
                  }}
                  dataSource={expenseClaimFetchedData?.allowance_records}
                  columns={columnsForAllowance}
                  pagination={false}
                />
              </Col>
            </ErrorBoundary>
          </Row>
        )}
      </>
    );
  };

  // const getMappedLabel = (key: string) => {
  //   let labelMapping = requestTypeConfiguration.label_mapping;
  //   return labelMapping[key]['mapped'];
  // };

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
            activeKey={1}
          >
            <Collapse.Panel key='1' header={<Trans>Travel Itinerary</Trans>}>
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
    if (requestTypeConfiguration.estimation_type?.code === 'BLK') {
      if (requestDetailInstance.bulk_estimation_amount === null) {
        return <></>;
      }

      return (
        <div className='field'>
          <div className='label' title='Expense Claim Estimation'>
            <Trans>Expense Claim Estimation</Trans>
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

    if (requestDetailInstance.expense_claim_estimations?.length === 0) {
      return <></>;
    }

    let expenseClaimEstimations = requestDetailInstance.expense_claim_estimations?.map(
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

    // eslint-disable-next-line no-unused-expressions
    expenseClaimEstimations?.unshift(
      <Row className='detail-header' gutter={16}>
        <Col sm={24} md={16}>
          <div className='field'>
            <div className='label' title='Expense Type'>
              <Trans>Expense Type</Trans>
            </div>
          </div>
        </Col>
        <Col sm={10} md={10}>
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
          activeKey={1}
        >
          <Collapse.Panel
            key='1'
            header={
              <Row gutter={20}>
                <Col span={16}>
                  <Trans>Expense Claim Estimations</Trans>
                </Col>
                <Col span={8}>
                  <Amount
                    amount={totalAmount}
                    currency={requestDetailInstance?.currency?.currency?.code}
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
    if (requestDetailInstance.flight_details?.length === 0) {
      return <></>;
    }

    let flightDetails = requestDetailInstance.flight_details?.map(
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
              {/* <Col sm={24} md={12} lg={4}>
                <div className='field'>
                  <div className='label' title='Flight Ticket'>
                    Flight Ticket
                  </div>
                  <div className='value fill-white'>
                    <Button
                      type='link'
                      className='no-pad _all text-center'
                      disabled={!record.flight_ticket}
                    >
                      {record.flight_ticket
                        ? record.flight_ticket_title || 'Ticket'
                        : '-'}
                    </Button>
                  </div>
                </div>
              </Col> */}
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
          activeKey={1}
        >
          <Collapse.Panel
            key='1'
            header={
              <>
                <Trans>Flight Details</Trans>{' '}
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
    if (requestDetailInstance.hotel_accommodations?.length === 0) {
      return <></>;
    }

    let hotelAccommodations = requestDetailInstance.hotel_accommodations?.map(
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
                  <div className='label' title='Remark'>
                    <Trans>Remark</Trans>
                  </div>
                  <div className='value fill-white'>{record.remark}</div>
                </div>
              </Col>
              {/* <Col xs={24} sm={24} md={4}>
                <div className='field'>
                  <div className='label' title='Attachment'>
                    Attachment
                  </div>
                  <div className='value fill-white'>
                    <Button
                      type='link'
                      className='no-pad _all text-center'
                      disabled={!record.attachment}
                    >
                      {record.attachment
                        ? record.attachment_title || 'Attachment'
                        : ''}
                    </Button>
                  </div>
                </div>
              </Col> */}
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
          activeKey={1}
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

    let costCentres = requestDetailInstance.cost_centres?.map((record: any) => {
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

    // eslint-disable-next-line no-unused-expressions
    costCentres?.unshift(
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
          activeKey={1}
        >
          <Collapse.Panel key='1' header='Cost Centres'>
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
    if (requestDetailInstance.staff_members?.length === 0) {
      return <></>;
    }

    let staffMembers = requestDetailInstance.staff_members?.map(
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

    // eslint-disable-next-line no-unused-expressions
    staffMembers?.unshift(
      <Row className='detail-header' gutter={16}>
        <Col sm={24} md={12}>
          <div className='field'>
            <div className='label' title='Staff Member'>
              <Trans>Staff Member</Trans>
            </div>
          </div>
        </Col>
        <Col sm={24} md={12}>
          <div className='field'>
            <div className='label' title='Employee ID'>
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
          activeKey={1}
        >
          <Collapse.Panel key='1' header='Staff Members'>
            <div className='detail-fields'>{staffMembers}</div>
          </Collapse.Panel>
        </Collapse>
      </div>
    );
  };

  const getGuestMembersFields = () => {
    if (requestDetailInstance.guest_members?.length === 0) {
      return <></>;
    }

    let guestMembers = requestDetailInstance.guest_members?.map(
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

    // eslint-disable-next-line no-unused-expressions
    guestMembers?.unshift(
      <Row className='detail-header' gutter={16}>
        <Col sm={24} md={12}>
          <div className='field'>
            <div className='label' title='Guest Member'>
              <Trans>Guest Member</Trans>
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
          activeKey={1}
        >
          <Collapse.Panel key='1' header='Guest Members'>
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

    let customFields = requestDetailInstance.custom_fields?.map(
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
                  title='Admin Field'
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
            <div className='label' title='Remark'>
              <Trans>Remark</Trans>
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

  const getWorkFlowDetailsTitle = () => {
    if (workflowDataForPDFPrint.length === 0) {
      return <Skeleton.Input />;
    }

    let modalTitle;
    let workflow: IWorkFlowDetails = workflowDataForPDFPrint[0];
    if (workflow.expense_claim !== null) {
      modalTitle = `Approval Workflow For Expense Claim No. #${workflow.claim_number}`;
    } else if (workflow.request !== null) {
      modalTitle = `Approval Workflow For Request No. #${workflow.request_number}`;
    } else if (workflow.benefit_claim !== null) {
      modalTitle = `Approval Workflow For Benefit Claim No. #${workflow.claim_number}`;
    }

    modalTitle = <strong>{modalTitle}</strong>;

    return modalTitle;
  };

  const getWorkFlowDetailsTable = () => {
    if (workflowDataForPDFPrint.length === 0) {
      return <NoData />;
    }
    let workflowItems = workflowDataForPDFPrint.map(
      (item: IWorkFlowDetails, index: number) => {
        let collapseHeader: ReactNode;
        let collapseHeaderText = '';

        let submissionDate = timeZoneMomentDate(
          getFormattedDate(item.submitted_on, 'DD/MM/YYYY HH:mm'),
        ).format('DD/MM/YYYY HH:mm');

        if (item.employee !== undefined) {
          // setOnBeHalfOf(item?.employee?.id);
          if (item.employee.id === item.created_by?.id) {
            collapseHeaderText = `Submitted by ${item.employee.legal_name ||
              item.employee.name} on ${submissionDate}`;
          } else {
            collapseHeaderText = `Submitted by ${item.created_by?.legal_name ||
              item.created_by?.name} on behalf of ${item.employee.legal_name ||
              item.employee.name} on ${submissionDate}`;
          }
        } else {
          // setOnBeHalfOf(item?.on_behalf_of?.id);
          collapseHeaderText =
            item.on_behalf_of === null
              ? `Submitted by ${item.created_by?.legal_name ||
                  item.created_by?.name} on ${submissionDate}`
              : `Submitted by ${item.created_by?.legal_name ||
                  item.created_by?.name} on behalf of ${item.on_behalf_of
                  ?.legal_name ||
                  item.on_behalf_of?.name} on ${submissionDate}`;
        }

        collapseHeader = (
          <div className='workflow-collapse-header'>
            <span className='text'>{collapseHeaderText}</span>
            <span className='status'>
              <StatusTag status={item.workflow_status} />
            </span>
          </div>
        );

        const settledExtraInfo: ReactNode =
          item.workflow_status.code === 'SETTLD' ? (
            <div className='settled-message'>
              Settled On
              <span className='settled-date date'>
                {timeZoneMomentDate(item.settled_on).format('DD/MM/YYYY')}
              </span>
              With Batch No.
              <span className='settled-batch-no batch-no'>
                {item.batch_number}
              </span>
            </div>
          ) : null;

        // const attachedWorkflowButton = showAttachedWorkflow ? (
        //   <Button
        //     type='link'
        //     onClick={() => {
        //       if (onWorkflowAttached) {
        //         onWorkflowAttached();
        //         onClose({} as any);
        //       } else {
        //         message.error('Something Went Wrong.');
        //         console.error(
        //           'Developer forgot to pass `onWorkflowAttached` function',
        //         );
        //       }
        //     }}
        //   >
        //     Attach Workflow
        //   </Button>
        // ) : null;

        if (item.workflow_steps.length === 0) {
          return (
            <Collapse.Panel key='1' header={collapseHeader}>
              <div className='stalled-message'>
                Workflow is stalled because there is no attached workflow rule.
                {/* {attachedWorkflowButton} */}
              </div>
              {item.withdrawal_remark !== null ? (
                <div className='withdrawal-remark'>
                  <div className='title'>
                    <Trans>Withdrawal Remark</Trans>
                  </div>
                  <div className='text'>{item.withdrawal_remark}</div>
                </div>
              ) : (
                <></>
              )}
              {settledExtraInfo}
            </Collapse.Panel>
          );
        } else {
          return (
            <Collapse.Panel key='1' header={collapseHeader}>
              <Table
                key={index}
                dataSource={item.workflow_steps}
                columns={columns}
                pagination={false}
                rowKey='id'
              />

              {item.withdrawal_remark !== null ? (
                <div className='withdrawal-remark'>
                  <div className='title'>
                    <Trans>Withdrawal Remark</Trans>
                  </div>
                  <div className='text'>{item.withdrawal_remark}</div>
                </div>
              ) : (
                <></>
              )}

              {settledExtraInfo}
            </Collapse.Panel>
          );
        }
      },
    );

    return (
      <Collapse
        bordered={false}
        activeKey={1}
        className='workflow-collapse'
        // onChange={key => {
        //   setActiveCollapseKey(key);
        // }}
      >
        {workflowItems}
      </Collapse>
    );
  };

  const columns: ColumnsType<any> = [
    {
      title: <Trans>Name</Trans>,
      dataIndex: 'responders',
      key: 'responders',
      width: '18%',
      render: (responders: Array<any>, item: any) => {
        let respondersList: any = responders.map(
          (i: any) => `${i.legal_name || i.name} (${i.username})`,
        );
        const DISPLAY_NAMES = 2;
        const OTHERS =
          respondersList.length - DISPLAY_NAMES > 0
            ? respondersList.length - DISPLAY_NAMES
            : 0;
        respondersList = respondersList.slice(0, 2);
        respondersList = respondersList.join(', ');
        if (OTHERS > 0) {
          respondersList = `${respondersList} and ${OTHERS} ${
            OTHERS >= 1 ? 'other' : 'others'
          }.`;
        }

        if (!respondersList) {
          respondersList = '-';
        }

        let title: string = '';
        if (item.step_owner === 'Employee Group') {
          title = respondersList;
          respondersList = item.employee_group.title;
        } else {
          if (item.responders.length === 1) {
            const responder = item.responders[0];
            respondersList = responder.legal_name || responder.name;
            title = `${responder.legal_name || responder.name} (${
              responder.username
            })`;
          }
        }

        if (item.is_new_approvers_added) {
          title += ' [UPDATED]';
        }

        return <span title={title}>{respondersList}</span>;
      },
    },
    {
      title: <Trans>Role</Trans>,
      dataIndex: 'step_owner',
      key: 'step_owner',
      width: '15%',
      render: (step_owner: any, item: any) => {
        let row = null;
        if (item.is_new_approvers_added) {
          row = <span style={{ color: 'lightgray' }}>{step_owner}</span>;
        } else {
          row = <span>{step_owner}</span>;
        }

        return row;
      },
    },
    {
      title: <Trans>Remark</Trans>,
      dataIndex: 'remark',
      key: 'remark',
      width: '20%',
      render: (text: string) => <span>{text ? text : '-'}</span>,
    },
    {
      title: <Trans>Status</Trans>,
      dataIndex: 'status',
      key: 'status',
      width: '12%',
      align: 'center' as any,
      render: (status: any, item: any) => {
        let title: string = '';
        if (item.status.code === 'STALED') {
          title = item.reason_for_stalling;
        } else if (item.status.code === 'SKIPED') {
          title = item.reason_for_skipping;
        }
        return (
          <span title={title}>
            <StatusTag status={status} />
          </span>
        );
      },
    },
    {
      title: <Trans>Response</Trans>,
      dataIndex: 'response',
      key: 'status',
      width: '17%',
      render: (_status: any, item: any) => {
        let respondedOn = '--';
        if (item.responded_on !== null) {
          respondedOn = timeZoneMomentDate(
            getFormattedDate(item.responded_on, 'DD/MM/YYYY HH:mm'),
          ).format('DD/MM/YYYY HH:mm');
        }

        if (item.status.code === 'APPRVD') {
          if (item.step_owner === 'Auto-Approval') {
            return `Auto Approved on ${respondedOn}`;
          } else {
            if (item.responded_on_behalf_of !== null) {
              return `Approved by ${item.responded_by.legal_name ||
                item.responded_by.name} on behalf of ${item
                .responded_on_behalf_of.legal_name ||
                item.responded_on_behalf_of.name} on ${respondedOn}`;
            } else {
              return `Approved by ${item.responded_by.legal_name ||
                item.responded_by.name} on ${respondedOn}`;
            }
          }
        } else if (item.status.code === 'REJCTD') {
          if (item.responded_on_behalf_of !== null) {
            return `Rejected by ${item.responded_by.legal_name ||
              item.responded_by.name} on behalf of ${item.responded_on_behalf_of
              .legal_name ||
              item.responded_on_behalf_of.name} on ${respondedOn}`;
          } else {
            return `Rejected by ${item.responded_by.legal_name ||
              item.responded_by.name} on ${respondedOn}`;
          }
        }
      },
    },
  ];

  // if (isAdmin) {
  //   columns.push({
  //     title: 'Action',
  //     dataIndex: 'status',
  //     key: 'status',
  //     width: '18%',
  //     align: 'center' as any,
  //     className: isAdmin ? '' : 'hide',
  //     render: (_status: any, item: any) => {
  //       // is_step_closed - hide column
  //       const activeResponders = users.filter(o => {
  //         const resId = item.responders.map((o: any) => o.id);
  //         return resId.includes(o.id);
  //       });
  //       const isEnable = isActionAllowed(permissions, employeeId);

  //       return isAdmin ? (
  //         <span className='approver-add-button'>
  //           <Button
  //             type='link'
  //             onClick={() => {
  //               setApproversData({
  //                 id: item.id,
  //                 responders: activeResponders,
  //                 created_by: item.created_by,
  //                 mode: item?.responders?.length === 0 ? 'ADD' : 'UPDATE',
  //               });
  //               form.setFieldsValue({
  //                 approvers: activeResponders.map((o: any) => o.id),
  //               });
  //             }}
  //             icon={<UserAddOutlined />}
  //             disabled={item.is_step_closed || !isEnable}
  //           >
  //             {item.responders.length ? 'Update Approver' : 'Add Approver'}
  //           </Button>
  //         </span>
  //       ) : (
  //         '-'
  //       );
  //     },
  //   });
  // }

  const GetFieldStructure: FC<{
    label: any;
    noBg?: boolean;
    hideChild?: boolean;
  }> = props => {
    return (
      <div className={`detail-field ${props?.noBg ? 'no-bg' : ''}`}>
        <div className='field-label'>{props.label}</div>
        {props.hideChild ? null : (
          <div className='field-value'>{props.children}</div>
        )}
      </div>
    );
  };

  return (
    <>
      <style>{getPageMargins()}</style>
      {/* <style>{getPageBreak()}</style> */}
      {claimType === 'expense' && (
        <>
          <div>
            <strong>{`Expense Claim No. #${claimTitleId} `}</strong>
            <StatusTag status={claimStatus} />
          </div>
          <Row gutter={rowGutter} className={`detail-View-componet`}>
            <Col xl={addExpenseFormContainerColSize}>
              {getFormRelatedFields()}
              {/* CUSTOM */}
              <CustomFields
                claimFieldsData={expenseClaimFetchedData?.custom_fields}
                configuration={configuration}
                formProps={formProps}
                isUseForFormPreview={isUseForFormPreview}
                _isAdmin={isAdmin}
              />
            </Col>
            <Col
            //style={{ pageBreakBefore: 'always', pageBreakAfter: 'always' }}
            >
              <Card title={getWorkFlowDetailsTitle()}>
                {getWorkFlowDetailsTable()}
              </Card>
            </Col>
          </Row>
        </>
      )}
      {(claimType === 'expenses_with_request' ||
        claimType === 'request' ||
        claimType === 'cash_advance_request') && (
        <>
          <div>
            <strong>{`Request No. #${claimTitleId} `}</strong>
            <StatusTag status={claimStatus} />
          </div>
          <Row gutter={16}>
            <Col xs={24} sm={24} md={24} lg={16} xl={18}>
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
                  <div className='value'>
                    {requestDetailInstance.request_no}
                  </div>
                </div>

                <div className='field'>
                  <div className='label' title='Request Type'>
                    <Trans>Request Type</Trans>
                  </div>
                  <div className='value'>
                    {requestDetailInstance.request_type_legal_entity?.title}
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
                        <div className='label' title={'From Date'}>
                          {'From Date'}
                        </div>
                        <div className='value'>
                          {requestDetailInstance.start_date}
                        </div>
                      </div>
                    </Col>
                    <Col xs={24} md={10}>
                      <div className='field'>
                        <div className='label' title={'To Date'}>
                          {'To Date'}
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
            <Space direction='vertical' size='large'>
              <Col
              //style={{ pageBreakBefore: 'always', pageBreakAfter: 'always' }}
              >
                <Card title={getWorkFlowDetailsTitle()}>
                  {getWorkFlowDetailsTable()}
                </Card>
              </Col>

              {claimType === 'expenses_with_request' && (
                <>
                  <Col span={24}>
                    <Row gutter={16}>
                      {requestDetailInstance?.expense_claim?.length > 0 ? (
                        <Col span={24} className='attached-claims-data-table'>
                          <div>
                            <div>
                              <h2>{'Attached Claims'}</h2>
                            </div>
                            <Table
                              scroll={{
                                x: true,
                              }}
                              dataSource={AttachedClaims}
                              columns={columnsForAttachedClaims}
                              pagination={false}
                            />
                          </div>
                        </Col>
                      ) : null}
                    </Row>
                  </Col>
                </>
              )}
            </Space>
          </Row>
        </>
      )}
      {claimType === 'benefit' && (
        <>
          <div>
            <strong>{`Benefit Claim No. #${claimTitleId} `}</strong>
            <StatusTag status={claimStatus} />
          </div>
          <Row gutter={rowGutter} className={`detail-View-componet `}>
            <Col xl={benefitConfiguration?.can_attach_receipts ? 14 : 24}>
              <Form name='addNewBenefitForm' {...benefitformProps}>
                <Row gutter={rowGutter}>
                  <Col xxl={16} xl={16} md={12} lg={12} sm={24} xs={24}>
                    <GetFieldStructure
                      label={
                        labelMapping?.benefit_type ? (
                          labelMapping?.benefit_type.mapped
                        ) : (
                          <Trans>Benefit Type</Trans>
                        )
                      }
                    >
                      {
                        fetchedBenefitClaimData?.benefit_type_legal_entity
                          ?.benefit_type?.title
                      }
                    </GetFieldStructure>
                  </Col>
                  <Col xxl={8} xl={8} md={12} lg={12} sm={24} xs={24}>
                    <GetFieldStructure
                      label={
                        labelMapping?.receipt_date
                          ? labelMapping?.receipt_date.mapped
                          : 'Benefit Date'
                      }
                    >
                      {fetchedBenefitClaimData.date}
                    </GetFieldStructure>
                  </Col>
                  {benefitConfiguration?.is_allow_flexible_benefit && (
                    <Col xs={24}>
                      <GetFieldStructure
                        label={
                          labelMapping?.benefit_category
                            ? labelMapping?.benefit_category
                            : 'Benefit Category'
                        }
                      >
                        {
                          benefitCategory.find(
                            (category: any) =>
                              category?.id ===
                              fetchedBenefitClaimData.benefit_category.id,
                          )?.title
                        }
                      </GetFieldStructure>
                    </Col>
                  )}
                  {benefitConfiguration?.is_dependent_benefit && (
                    <>
                      <Col xs={12}>
                        <GetFieldStructure
                          label={
                            labelMapping?.dependent_relationships
                              ? labelMapping?.dependent_relationships
                              : 'Dependent Name'
                          }
                        >
                          {benefitDependentRelationship?.first_name}{' '}
                          {benefitDependentRelationship?.last_name} (
                          {moment(
                            benefitDependentRelationship?.date_of_birth,
                            'DD/MM/YYYY',
                          ).fromNow(true)}
                          )
                        </GetFieldStructure>
                      </Col>
                      <Col xs={12}>
                        <GetFieldStructure
                          label={
                            labelMapping?.dependent_relationships
                              ? labelMapping?.dependent_relationships
                              : 'Relationship'
                          }
                        >
                          {benefitDependentRelationship?.relationship?.title ||
                            ''}
                        </GetFieldStructure>
                      </Col>
                    </>
                  )}
                  {benefitConfiguration?.allow_remark && (
                    <Col xs={24}>
                      <GetFieldStructure
                        label={
                          labelMapping?.purpose
                            ? labelMapping?.purpose.mapped
                            : 'Purpose'
                        }
                      >
                        {fetchedBenefitClaimData?.purpose}
                      </GetFieldStructure>
                    </Col>
                  )}
                  <Col xs={benefitConfiguration?.is_allow_forex ? 8 : 12}>
                    <GetFieldStructure label={'Currency'}>
                      {`${fetchedBenefitClaimData?.currency?.currency.title}(${fetchedBenefitClaimData?.currency?.currency.code})`}
                    </GetFieldStructure>
                  </Col>
                  <Col xs={benefitConfiguration?.is_allow_forex ? 8 : 12}>
                    <GetFieldStructure label={'Claim Amount'}>
                      {Number(fetchedBenefitClaimData.amount).toFixed(2)}
                    </GetFieldStructure>
                  </Col>
                  {benefitConfiguration?.is_allow_forex && (
                    <Col xs={8}>
                      <GetFieldStructure
                        label={
                          <div className='default-value-benefit-btn-parent'>
                            <label>
                              <Trans>Conversion Rate</Trans>
                            </label>
                            <Tooltip
                              title={Number(
                                fetchedBenefitClaimData.system_conversion_rate,
                              ).toFixed(2)}
                              trigger='click'
                              placement='top'
                              className='default-value-link-btn'
                              overlayClassName='default-value-tooltip'
                            >
                              <Button type='link'>Default</Button>
                            </Tooltip>
                          </div>
                        }
                      >
                        {Number(
                          fetchedBenefitClaimData.conversion_rate,
                        ).toFixed(2)}
                      </GetFieldStructure>
                    </Col>
                  )}
                  {benefitConfiguration?.is_allow_forex && (
                    <Col xs={8}>
                      <GetFieldStructure label={'Converted Amount'}>
                        {Number(
                          fetchedBenefitClaimData.converted_amount,
                        ).toFixed(2)}
                      </GetFieldStructure>
                    </Col>
                  )}
                  <Col xs={benefitConfiguration?.is_allow_forex ? 8 : 12}>
                    <GetFieldStructure
                      label={
                        <div className='default-value-benefit-btn-parent'>
                          <label>
                            {labelMapping?.tax_amount
                              ? labelMapping?.tax_amount.mapped
                              : 'Tax Amount'}
                          </label>
                          <Tooltip
                            title={Number(
                              fetchedBenefitClaimData.system_tax_amount,
                            ).toFixed(2)}
                            trigger='click'
                            placement='top'
                            className='default-value-link-btn'
                            overlayClassName='default-value-tooltip'
                          >
                            <Button type='link'>Default</Button>
                          </Tooltip>
                        </div>
                      }
                    >
                      {Number(fetchedBenefitClaimData.tax_amount).toFixed(2)}
                    </GetFieldStructure>
                  </Col>
                  <Col xs={benefitConfiguration?.is_allow_forex ? 8 : 12}>
                    <GetFieldStructure
                      label={
                        labelMapping?.amount_before_taxes
                          ? labelMapping?.amount_before_taxes.mapped
                          : 'Amount Before Taxes'
                      }
                    >
                      {Number(
                        fetchedBenefitClaimData.amount_before_taxes,
                      ).toFixed(2)}
                    </GetFieldStructure>
                  </Col>
                  {benefitConfiguration?.can_attach_receipts && (
                    <Col
                      xs={
                        benefitConfiguration?.is_display_no_receipt_attached_field
                          ? 17
                          : 24
                      }
                    >
                      <GetFieldStructure
                        label={
                          labelMapping?.receipt_number
                            ? labelMapping?.receipt_number.mapped
                            : 'Receipt Number'
                        }
                      >
                        {fetchedBenefitClaimData?.receipt
                          ? fetchedBenefitClaimData?.receipt[0]?.receipt_number
                            ? fetchedBenefitClaimData?.receipt[0]
                                ?.receipt_number
                            : ''
                          : ''}
                      </GetFieldStructure>
                    </Col>
                  )}
                  {benefitConfiguration?.is_display_no_receipt_attached_field && (
                    <Col xs={6} offset={1}>
                      <GetFieldStructure label=' ' noBg={true}>
                        <Checkbox
                          disabled={true}
                          checked={Boolean(
                            fetchedBenefitClaimData.is_no_receipt,
                          )}
                        >
                          {labelMapping?.no_receipt
                            ? labelMapping?.no_receipt.mapped
                            : 'No Receipt'}
                        </Checkbox>
                      </GetFieldStructure>
                    </Col>
                  )}
                  {formData.is_no_receipt && (
                    <Col xs={24}>
                      <GetFieldStructure
                        label={
                          labelMapping?.no_receipt_remark
                            ? labelMapping?.no_receipt_remark.mapped
                            : 'No Receipt Remark'
                        }
                      >
                        {fetchedBenefitClaimData?.no_receipt_remark}
                      </GetFieldStructure>
                    </Col>
                  )}
                  {benefitConfiguration?.is_allow_charging_to_cost_centres && (
                    <>
                      <Col xs={12}>
                        <GetFieldStructure label={<Trans>Charge-to</Trans>}>
                          {fetchedBenefitClaimData?.charge_to.title}
                        </GetFieldStructure>
                      </Col>
                      {formData.charge_to === 'THIRD' ? (
                        <Col xs={12}>
                          <GetFieldStructure
                            label={<Trans>Third Party Vendor</Trans>}
                          >
                            {fetchedBenefitClaimData?.third_party_vendor}
                          </GetFieldStructure>
                        </Col>
                      ) : (
                        <Col xs={12}>
                          <GetFieldStructure
                            label={
                              labelMapping?.cost_centre
                                ? labelMapping?.cost_centre.mapped
                                : 'Cost Center'
                            }
                          >
                            {fetchedBenefitClaimData?.cost_centre?.title}
                          </GetFieldStructure>
                        </Col>
                      )}
                    </>
                  )}
                </Row>
              </Form>
              <CustomFields
                claimFieldsData={fetchedBenefitClaimData?.custom_fields || []}
                configuration={benefitConfiguration}
                formProps={benefitformProps}
                isUseForFormPreview={false}
                _isAdmin={isAdmin}
              />
            </Col>
            <Col
            //style={{ pageBreakBefore: 'always', pageBreakAfter: 'always' }}
            >
              <Card title={getWorkFlowDetailsTitle()}>
                {getWorkFlowDetailsTable()}
              </Card>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default memo(connector(PrintPDF));
