/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect } from 'react';
import { Row, Col, Typography, Badge } from 'antd';
import './preview.index.less';
import { Trans } from '@lingui/macro';
import { ConnectedProps, connect } from 'react-redux';
import TargetGroup from '../components/TargetGroup/targetGroup';
import { stateInterface } from '../../../../../../../../shared/redux/rootReducer';
import { Dispatch } from 'redux';

const mapStateToProps = (state: stateInterface) => {
  return {
    policyConfigurationDetail:
      state.policyConfiguration.policyConfigurationDetails,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  return {};
};

const Preview = (props: any) => {
  const { Title } = Typography;
  const {
    policyConfigurationDetail,
    policyId,
    _fetchPolicyDetailsByID,
  } = props;

  let applicableOn: any = {
    ENTITY__COMPANY: 'Company',
    ENTITY__DIVISION: 'Division',
    EMPLOYEE_GROUP: 'Employee Group',
    ENTITY__BUSINESS_UNIT: 'Business Unit',
    ENTITY__DEPARTMENT: 'Department',
    JOB_INFO_EMPLOYEE_GROUP: 'SF Employee Group',
    JOB_INFO_PAY_GRADE: 'Pay Grade',
  };

  useEffect(() => {
    setTimeout(() => {
      _fetchPolicyDetailsByID(policyId);
    }, 2000);
  }, []);

  return (
    <>
      <Title level={5}>
        <Trans>Preview</Trans>
      </Title>
      <Row className='steper-container-scrollbar'>
        <Col span={24} className='steper-container-box'>
          <>
            {policyConfigurationDetail && (
              <TargetGroup
                targetConfigurations={
                  policyConfigurationDetail?.target_configuration
                }
              />
            )}
          </>
        </Col>
      </Row>
    </>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Preview);
