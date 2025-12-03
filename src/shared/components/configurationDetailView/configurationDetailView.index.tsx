import React, { FC, memo } from 'react';
import { Tabs, Row, Col, Skeleton } from 'antd';
import { CheckCircleTwoTone, StopOutlined } from '@ant-design/icons';
import {
  IconfigurationDetailViewProps,
  IcustomFields,
  IreturnCustomFieldStructureProps,
} from './configurationDetailView.model';
import './configurationDetailView.index.less';
import { Trans } from '@lingui/macro';
import { NoData } from '..';

const ConfigurationDetailView: FC<IconfigurationDetailViewProps> = props => {
  const {
    ConfigurationComponent,
    FormPreviewComponent,
    customFieldsData,
    isLoadingData = false,
  } = props;
  const { TabPane } = Tabs;
  const custom_fields = customFieldsData?.hasOwnProperty('fields')
    ? customFieldsData.fields
    : [];
  const _FormPreviewComponent =
    typeof FormPreviewComponent === 'object' ? (
      FormPreviewComponent
    ) : (
      <FormPreviewComponent />
    );

  return (
    <>
      <Tabs
        defaultActiveKey='1'
        className='configuration-detail-page-tabs'
        data-testId='configurationDetailPageTabs'
      >
        <TabPane
          tab={<Trans>Configurations</Trans>}
          key='1'
          data-testId='configurationDetailPageTabsPane'
          data-test-1='configurationsTab'
        >
          {ConfigurationComponent ? (
            ConfigurationComponent
          ) : (
            <ReturnEmptyComponent description='No Configuration Data' />
          )}
        </TabPane>
        <TabPane
          tab={<Trans>Custom Fields</Trans>}
          key='2'
          data-testId='configurationDetailPageTabsPane'
          data-test-1='customFieldsTab'
        >
          {custom_fields.length ? (
            custom_fields.map((o: IcustomFields, i: number) => (
              <ReturnCustomFieldStructure
                key={i}
                custom_fields={o}
                isLoadingData={isLoadingData}
              />
            ))
          ) : (
            <ReturnEmptyComponent
              description={<Trans>No Custom Fields For Type</Trans>}
            />
          )}
        </TabPane>
        <TabPane
          tab={<Trans>Form Preview</Trans>}
          key='3'
          data-testId='configurationDetailPageTabsPane'
          data-test-1='formPreviewTab'
        >
          {FormPreviewComponent ? (
            _FormPreviewComponent
          ) : (
            <ReturnEmptyComponent description='No Form Preview Available' />
          )}
        </TabPane>
      </Tabs>
    </>
  );
};

/**
 * This is stateless function component return empty data component.
 */
export const ReturnEmptyComponent: FC<{
  description?: string | React.ReactNode;
}> = props => (
  <NoData
    description={props.description ? props.description : 'No Data'}
    // imageStyle={{
    //   height: 260,
    // }}
  />
);

const correctSubType = (type: string): string => {
  switch (String(type).toLocaleUpperCase()) {
    case 'SINGLESELECT':
      return 'Single Select';
    case 'MULTISELECT':
      return 'Multi Select';
    case 'SHORTTEXT':
      return 'Short Text';
    case 'LONGTEXT':
      return 'Long Text';
    case 'NUMBER':
      return 'Number';
    case 'PERCENTAGE':
      return 'Percentage';
    default:
      console.error('SubType No Match Found!');
      return type;
  }
};

/**
 * This is stateless function component returns single custom field structure.
 * @param {IreturnCustomFieldStructureProps} props
 */
export const ReturnCustomFieldStructure: FC<IreturnCustomFieldStructureProps> = props => {
  const { custom_fields, isLoadingData } = props;

  if (isLoadingData) {
    return <Skeleton active />;
  }
  if (custom_fields?.is_deleted) {
    return null;
  }

  const rangeOptionVisibility =
    custom_fields.is_range &&
    (custom_fields.type === 'NUMBER' || custom_fields.type === 'TIME');
  const rowGutter: [number, number] = [24, 24];
  const rowJustify: any = 'start';
  return (
    <Row className='custom-field'>
      <Col
        span={24}
        className='fields-label'
      >{`${custom_fields.title} - ${custom_fields.type}`}</Col>
      <Col span={24} className='field-properties'>
        <Row gutter={rowGutter} justify={rowJustify}>
          {custom_fields.sub_type ? (
            <Col md={8}>
              <Row className='property-type'>
                <Trans>Field Type</Trans>
              </Row>
              <Row className='property-val'>
                {correctSubType(custom_fields.sub_type)}
              </Row>
            </Col>
          ) : null}
          {custom_fields.reference_object_title ? (
            <Col md={8}>
              <Row className='property-type'>
                <Trans>Source</Trans>
              </Row>
              <Row className='property-val'>
                {custom_fields.reference_object_title}
              </Row>
            </Col>
          ) : null}
          {custom_fields.is_decimal_allowed ? (
            <Col md={8}>
              <Row className='property-type'>
                <Trans>Precision</Trans>
              </Row>
              <Row className='property-val'>{custom_fields.precision}</Row>
            </Col>
          ) : null}
          <Col md={8}>
            <Row className='property-type'>
              <Trans>Validations</Trans>
            </Row>
            <Row className='property-val'>
              {custom_fields.is_required ? (
                <Col span={24}>
                  <CheckCircleTwoTone /> <Trans>Is Required</Trans>
                </Col>
              ) : (
                <Col span={24} className='disable non-interactive'>
                  <StopOutlined />
                  <Trans>Is Required</Trans>
                </Col>
              )}
              {custom_fields.is_filled_by_admin ? (
                <Col span={24}>
                  <CheckCircleTwoTone /> <Trans>Is Filled By Admin</Trans>
                </Col>
              ) : (
                <Col span={24} className='disable non-interactive'>
                  <StopOutlined />
                  <Trans>Is Filled By Admin</Trans>
                </Col>
              )}
              {rangeOptionVisibility ? (
                <Col span={24}>
                  <CheckCircleTwoTone /> <Trans>Is Range Allowed</Trans>
                </Col>
              ) : (
                <Col span={24} className='disable non-interactive'>
                  <StopOutlined />
                  <Trans>Is Range Allowed</Trans>
                </Col>
              )}
            </Row>
          </Col>
          {rangeOptionVisibility ? (
            <Col md={8}>
              <Row className='property-type'>
                <Trans>Range</Trans>
              </Row>
              <Row className='property-val'>{`${
                typeof custom_fields.range_min === 'number'
                  ? custom_fields.range_min
                  : 'NA'
              } - ${
                typeof custom_fields.range_max === 'number'
                  ? custom_fields.range_max
                  : 'NA'
              }`}</Row>
            </Col>
          ) : null}
        </Row>
      </Col>
    </Row>
  );
};

export default memo(ConfigurationDetailView);
