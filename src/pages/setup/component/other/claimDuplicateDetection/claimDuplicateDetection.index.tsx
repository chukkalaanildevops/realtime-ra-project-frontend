/* eslint-disable react-hooks/exhaustive-deps */
import React, { Dispatch, useEffect, useState } from 'react';
import { Form, Radio, Switch, Row, Col } from 'antd';
import {
  HeaderBarWrapper,
  FilterBar,
  ErrorBoundary,
} from '../../../../../shared/components';
import './claimDuplicateDetection.index.less';
import { PREFERRED_CRITERIA } from './claimDuplicateDetection.model';
import {
  createOrUpdateClaimDetection,
  fetchClaimDetector,
} from './claimDuplicateDetection.thunk';
import { connect, ConnectedProps } from 'react-redux';
import { getClaimDetection } from '../../../../../shared/redux/rootReducer';
import { appPath } from '../../../../app/app.routes';
import { Trans } from '@lingui/macro';

const ClaimDuplicateDetection: React.FC<ConnectedProps<typeof connector>> = ({
  _createUpdateClaimDetection,
  _fetchClaimDetector,
  data,
}) => {
  const [claim_form] = Form.useForm();
  const [, setUpdate] = useState(false);

  useEffect(() => {
    _fetchClaimDetector();
  }, []);

  useEffect(() => {
    try {
      if (data) {
        const values = {
          is_detection_active: data.is_detection_active,
          detection_choice: data.detection_choice.code,
        };
        claim_form.setFieldsValue(values);
        setUpdate(prev => !prev);
      }
    } catch (e) {}
  }, [data]);

  const addUpdateClaim = () => {
    try {
      const values = claim_form.getFieldsValue();
      const id = data ? data.id : '';
      _createUpdateClaimDetection(values, id);
    } catch (e) {
      console.error(e);
    }
  };
  const radioStyle = {
    display: 'block',
    height: '30px',
    lineHeight: '30px',
  };
  const onFieldsChange = (changedFields: any) => {
    if (changedFields.hasOwnProperty('is_detection_active')) {
      claim_form.setFieldsValue({
        detection_choice: '',
      });
    }
    addUpdateClaim();
    setUpdate(prev => !prev);
  };
  return (
    <ErrorBoundary>
      <HeaderBarWrapper
        headerCommonProps={{ title: <Trans>Claim Inspector</Trans> }}
      >
        <div className='container'>
          <FilterBar
            isLoading={false}
            isAddButton={false}
            enableBackBtn={true}
            backBtnUrl={appPath.config_setup.claimInspector.backLink}
            data-test='filterBar'
          />
          <Form
            layout='vertical'
            colon={false}
            onValuesChange={onFieldsChange}
            data-testId='form'
            form={claim_form}
          >
            <Form.Item className='form-item'>
              <Row align='middle' gutter={20}>
                <Col>
                  <div>
                    <Trans>Is Detection Active</Trans>
                  </div>
                </Col>
                <Col>
                  <Form.Item
                    name='is_detection_active'
                    valuePropName='checked'
                    noStyle
                  >
                    <Switch />
                  </Form.Item>
                </Col>
              </Row>
            </Form.Item>
            <Form.Item
              label={<Trans>Preferred Criteria</Trans>}
              name='detection_choice'
              className='form-item'
            >
              <Radio.Group
                disabled={!claim_form.getFieldValue('is_detection_active')}
              >
                {PREFERRED_CRITERIA.map(item => (
                  <Radio style={radioStyle} value={item.value} key={item.value}>
                    {item.title}
                  </Radio>
                ))}
              </Radio.Group>
            </Form.Item>
          </Form>
        </div>
      </HeaderBarWrapper>
    </ErrorBoundary>
  );
};

const mapStateToProps = (state: any) => ({
  data: getClaimDetection(state),
});

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  _createUpdateClaimDetection: (body: any, id?: string) =>
    dispatch(createOrUpdateClaimDetection(body, id)),
  _fetchClaimDetector: () => dispatch(fetchClaimDetector()),
});

const connector = connect(mapStateToProps, mapDispatchToProps);
export default connector(ClaimDuplicateDetection);
