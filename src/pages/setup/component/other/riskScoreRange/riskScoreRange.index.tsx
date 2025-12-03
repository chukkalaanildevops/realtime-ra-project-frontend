import React, { Dispatch, useEffect, memo, useState, useRef } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'antd';
import {
  FilterBar,
  HeaderBarWrapper,
  NoData,
} from '../../../../../shared/components';
import { stateInterface } from '../../../../../shared/redux/rootReducer';
import { Trans } from '@lingui/macro';
import RiskScoreCard from './RiskScoreCard/riskScoreCard.index';
import Title from 'antd/lib/typography/Title';
import './riskScoreRange.index.less';
import {
  fetchRiskScoreRange,
  fetchUserPermission,
  updateRiskScoreRange,
} from './riskScoreRange.thunk';

const mapStateToProps = (state: stateInterface) => {
  const { isLoading, riskScores, riskScorePermission } = state.riskScoreRange;
  const { user } = state.auth;
  return { isLoading, riskScores, user, riskScorePermission };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  return {
    _fetchRiskScoreRange: () => dispatch(fetchRiskScoreRange()),
    _updateRiskScoreRange: (body: any) => dispatch(updateRiskScoreRange(body)),
    _fetchUserPermission: (id: any) => dispatch(fetchUserPermission(id)),
  };
};

const connector = connect(mapStateToProps, mapDispatchToProps);

const RiskScoreRange: React.FC<ConnectedProps<typeof connector> &
  RouteComponentProps> = props => {
  const {
    isLoading,
    riskScores,
    user,
    riskScorePermission,
    _fetchRiskScoreRange,
    _updateRiskScoreRange,
    _fetchUserPermission,
  } = props;
  const [minRange, setMinRange] = useState(2);
  const [midRange, setMidRange] = useState(50);
  const [maxRange, setMaxRange] = useState(100);
  const riskRangRef = useRef<any>(null);

  useEffect(() => {
    if (user.id) {
      _fetchUserPermission(user.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);
  useEffect(() => {
    _fetchRiskScoreRange();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getRiskScoreRangeValues = () => {
    let findWrn = riskScores?.filter(item => item.risk_level === 'WRN');
    if (findWrn.length) {
      setMinRange(findWrn[0].minimum);
      setMidRange(findWrn[0].maximum);
    }
    let findErr = riskScores?.filter(item => item.risk_level === 'ERR');
    if (findErr.length) {
      setMaxRange(findErr[0].maximum);
    }
  };

  useEffect(() => {
    getRiskScoreRangeValues();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [riskScores]);

  const onSaveHandleChange = () => {
    const riskRanges = riskRangRef.current.getSliderValue();
    if (riskRanges) {
      _updateRiskScoreRange(riskRanges);
    }
  };
  const onDiscardHandleChange = () => {
    riskRangRef.current.resetSliderValue();
  };

  return (
    <>
      <HeaderBarWrapper
        headerCommonProps={{ title: <Trans>Risk Score Range</Trans> }}
        breadcrumbCompVisibility={false}
        breadcrumbCompProps={{
          enableBackBtn: false,
        }}
      >
        <div className='risk-score-range-container'>
          <FilterBar enableBackBtn={true} isAddButton={false} />
          <Title level={5} style={{ marginBottom: '1.5rem' }}>
            <Trans>Risk Score Setup</Trans>
          </Title>

          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            {isLoading ? (
              <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                <RiskScoreCard isLoading={true} />
              </Col>
            ) : (
              <>
                <Col xs={24} sm={12} md={12} lg={12} xl={12} xxl={12}>
                  <RiskScoreCard
                    ref={riskRangRef}
                    minRange={minRange}
                    midRange={midRange}
                    maxRange={maxRange}
                  />
                </Col>
              </>
            )}
          </Row>

          {!isLoading && riskScores?.length === 0 && <NoData />}

          {riskScores?.length ? (
            <div className='risk-score-range-actions-wrapper'>
              <Button
                type='primary'
                onClick={onDiscardHandleChange}
                ghost
                style={{ marginRight: '10px' }}
              >
                Discard Changes
              </Button>
              <Button
                type='primary'
                disabled={!riskScorePermission}
                onClick={onSaveHandleChange}
              >
                Save Changes
              </Button>
            </div>
          ) : null}
        </div>
      </HeaderBarWrapper>
    </>
  );
};

export default memo(connector(RiskScoreRange));
