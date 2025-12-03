import React, { Dispatch, useEffect } from 'react';
import { ErrorBoundary, FilterBar } from '../../../../shared/components';
import { Form, Select, DatePicker, Button } from 'antd';
import {
  fetchBenefitTypes,
  generateSpecializedBenefitReport,
  fetchExportedDownloadList,
  fetchSpecializedReportTypes,
} from '../../reports.thunk';
import {
  getReportsBenefitTypes,
  getSpecializedReportTypes,
} from '../../../../shared/redux/rootReducer';
import { connect, ConnectedProps } from 'react-redux';
import { Trans } from '@lingui/macro';
const workflowStatuses = [
  {
    code: 'PENDNG',
    text: 'Pending',
  },
  {
    code: 'APPRVD',
    text: 'Approved',
  },
  {
    code: 'REJCTD',
    text: 'Rejected',
  },
  {
    code: 'UNDPRS',
    text: 'Processing',
  },
  {
    code: 'SETTLD',
    text: 'Settled',
  },
  {
    code: 'STALED',
    text: 'Stalled',
  },
];

const SpecializedBenefitReports: React.FC<{
  isActive?: boolean;
} & ConnectedProps<typeof connector>> = ({
  isActive,
  benefitTypes,
  specializedReportTypes,
  _fetchSpecializedReportTypes,
  _fetchBenefits,
  _generateSpecializedBenefitReport,
  _fetchSpecializedReportDownloadList,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    _fetchBenefits();
    _fetchSpecializedReportTypes();
    // eslint-disable-next-line
  }, []);

  const _downloadReports = () => {
    _fetchSpecializedReportDownloadList();
  };

  const generateReport = () => {
    const values = form.getFieldsValue();
    let from_date, to_date;
    if (values?.date) {
      [from_date, to_date] = values.date;
      from_date = from_date.format('DD/MM/YYYY');
      to_date = to_date.format('DD/MM/YYYY');
    }
    const id = values.type;
    delete values.type;
    delete values.date;

    const obj = { ...values, from_date, to_date };
    _generateSpecializedBenefitReport(id, obj);
  };

  return (
    <div className='specialized-reports-container'>
      <ErrorBoundary>
        <FilterBar
          isAddButton={false}
          showDownload={true}
          onDownload={_downloadReports}
        />
        <div className='form-container'>
          <Form layout='vertical' form={form} initialValues={{ type: 1 }}>
            <Form.Item name='type' label={<Trans>Report Type</Trans>}>
              <Select>
                {/* <Select.Option value='1'>Benefit In Kind</Select.Option> */}
                {specializedReportTypes.map(item => (
                  <Select.Option value={item.id}>{item.title}</Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name='benefit_type' label={<Trans>Benefit Type</Trans>}>
              <Select
                showSearch
                mode='multiple'
                maxTagCount={3}
                filterOption={(input: any, option: any) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
              >
                {benefitTypes.map(item => (
                  <Select.Option value={item.id}>{item.title}</Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label={<Trans>Date</Trans>} name='date'>
              <DatePicker.RangePicker
                bordered={true}
                allowClear={false}
                // suffixIcon={<DownOutlined />}
                placeholder={['From', 'To']}
                format='DD/MM/YYYY'
              />
            </Form.Item>
            <Form.Item name='status' label={<Trans>Status</Trans>}>
              <Select mode='multiple' maxTagCount={3}>
                {workflowStatuses.map(item => (
                  <Select.Option value={item.code}>{item.text}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={generateReport} type='primary'>
              <Trans>Generate</Trans>
            </Button>
          </div>
        </div>
      </ErrorBoundary>
    </div>
  );
};

const mapStateToProps = (state: any) => ({
  benefitTypes: getReportsBenefitTypes(state),
  specializedReportTypes: getSpecializedReportTypes(state),
});

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  _fetchBenefits: () => dispatch(fetchBenefitTypes()),
  _generateSpecializedBenefitReport: (id: number, filters: any) =>
    dispatch(generateSpecializedBenefitReport(id, filters)),
  _fetchSpecializedReportDownloadList: () =>
    dispatch(fetchExportedDownloadList()),
  _fetchSpecializedReportTypes: () => dispatch(fetchSpecializedReportTypes()),
});

const connector = connect(mapStateToProps, mapDispatchToProps);
export default connector(SpecializedBenefitReports);
