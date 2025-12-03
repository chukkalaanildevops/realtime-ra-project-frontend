import React, { memo, FC, Dispatch } from 'react';
import { Row, Col } from 'antd';
import { NavLink } from 'react-router-dom';
import { HeaderBarWrapper } from '../../shared/components';
import { IadminInnerOptions, IadminOptions } from './setup.model';
import { appPath } from '../app/app.routes';
import './setup.index.less';
import { connect, ConnectedProps } from 'react-redux';

import {
  getIsBenefitEnabled,
  getTenantConfigRecords,
  getPermissions,
  stateInterface,
  getIsAllowancesEnabled,
} from '../../shared/redux/rootReducer';
import { Trans } from '@lingui/macro';
import { getTrafficLightFeatureForTenantFeature } from '../configurations/configurations.thunk';
// import { getTenantConfig } from '../../shared/redux/auth/auth.reducer';

const Admin: FC<ConnectedProps<typeof connector>> = ({
  isBenefitsEnabled,
  isAllowanceEnabled,
  getTenantConfigRecords,
  getPermissions,
  isEnableTrafficLightFeatureForTenantFeatures,
  _getTrafficLightFeatureForTenantFeature,
}) => {
  // useEffect(() => {
  //   _getTrafficLightFeatureForTenantFeature();
  // }, [_getTrafficLightFeatureForTenantFeature]);

  const tenentConfig: any = getTenantConfigRecords[0];
  const isFileEncryptionEnable = tenentConfig?.is_enabled_file_encryption;
  const isTrafficLightsEnable = tenentConfig?.is_enabled_traffic_lights;

  const adminOptions: IadminOptions = {
    Configuration: [
      {
        label: <Trans>Expense Types</Trans>,
        linkTo: `${appPath.config_setup.expenseType.linkTo}`,
        classNames: '',
        code: 'EXPENSE_TYPES',
      },
      {
        label: <Trans>Request Types</Trans>,
        linkTo: `${appPath.config_setup.requestType.linkTo}`,
        classNames: '',
        code: 'REQUEST_TYPES',
      },
    ],
    Other: [
      {
        label: <Trans>Currency Conversion</Trans>,
        linkTo: `${appPath.config_setup.currencyConversion.linkTo}`,
        classNames: '',
        code: 'CURRENCY_CONVERSION',
      },
      {
        label: <Trans>Employee Groups</Trans>,
        linkTo: `${appPath.config_setup.employeeGroups.linkTo}`,
        classNames: '',
        code: 'EMPLOYEE_GROUPS',
      },
      {
        label: <Trans>Entitlements Rules</Trans>,
        linkTo: `${appPath.config_setup.entitlementRules.linkTo}`,
        classNames: '',
        code: 'ENTITLEMENTS_RULES',
      },
      {
        label: <Trans>Email Templates</Trans>,
        linkTo: `${appPath.config_setup.emailTemplates.linkTo}`,
        classNames: '',
        code: 'EMAIL_TEMPLATES',
      },

      {
        label: <Trans>Rules</Trans>,
        linkTo: `${appPath.config_setup.rules.linkTo}`,
        classNames: '',
        code: 'RULES',
      },
      {
        label: <Trans>Roles</Trans>,
        linkTo: `${appPath.config_setup.roles.linkTo}`,
        classNames: '',
        code: 'ROLES',
      },
    ],

    Others: [
      {
        label: <Trans>Claim Inspector</Trans>,
        linkTo: `${appPath.config_setup.claimInspector.linkTo}`,
        classNames: '',
        code: 'CLAIM_INSPECTOR',
      },
      {
        label: <Trans>Delegations</Trans>,
        linkTo: `${appPath.config_setup.adminDelegations.linkTo}`,
        classNames: '',
        code: 'DELEGATIONS',
      },
    ],

    'Master Data': [
      {
        label: <Trans>Reference Objects</Trans>,
        linkTo: `${appPath.config_setup.referenceObjects.linkTo}`,
        classNames: '',
        code: 'REFERENCE_OBJECTS',
      },
      {
        label: <Trans>Cost Centres</Trans>,
        linkTo: `${appPath.config_setup.costCentre.linkTo}`,
        classNames: '',
        code: 'COST_CENTRES',
      },
      {
        label: <Trans>Wage Types</Trans>,
        linkTo: `${appPath.config_setup.wageType.linkTo}`,
        classNames: '',
        code: 'WAGE_TYPES',
      },
      {
        label: <Trans>GL Accounts</Trans>,
        linkTo: `${appPath.config_setup.glAccounts.linkTo}`,
        classNames: '',
        code: 'GL_ACCOUNTS',
      },
      {
        label: <Trans>Entity</Trans>,
        linkTo: appPath.config_setup.entityTypes.linkTo,
        classNames: '',
        code: 'ENTITY',
      },
    ],
  };

  if (isFileEncryptionEnable) {
    adminOptions.Others.push({
      label: <Trans>File Encryption</Trans>,
      linkTo: `${appPath.config_setup.fileEncryption.linkTo}expense`,
      classNames: '',
      code: 'FILE_ENCRYPTION',
    });
  }
  if (isTrafficLightsEnable && isEnableTrafficLightFeatureForTenantFeatures) {
    adminOptions.Others.push({
      label: <Trans>Policy Configuration</Trans>,
      linkTo: `${appPath.config_setup.policyConfiguration.linkTo}`,
      classNames: '',
      code: 'POLICY_CONFIGURATION',
    });
  }
  if (isTrafficLightsEnable && isEnableTrafficLightFeatureForTenantFeatures) {
    adminOptions.Others.push({
      label: <Trans>Risk Score Range</Trans>,
      linkTo: `${appPath.config_setup.riskScoreRange.linkTo}`,
      classNames: '',
      code: 'RISK_SCORE_RANGE',
    });
  }
  if (isBenefitsEnabled) {
    adminOptions.Configuration.splice(2, 0, {
      label: <Trans>Benefit Types</Trans>,
      linkTo: `${appPath.config_setup.benefitType.linkTo}`,
      classNames: '',
      code: 'BENEFIT_TYPES',
    });
    adminOptions.Others.splice(0, 0, {
      label: <Trans>Benefit Categories</Trans>,
      linkTo: appPath.config_setup.benefitCategories.linkTo,
      classNames: '',
      code: 'benefit_categories',
    });
  }

  if (isAllowanceEnabled) {
    adminOptions.Other.splice(0, 0, {
      label: <Trans>Allowance Rate</Trans>,
      linkTo: `${appPath.config_setup.allowanceRate.linkTo}`,
      classNames: '',
      code: 'ALLOWANCE_RATE',
    });
  }

  const isListItemToBeHidden = (code: string) => {
    switch (code) {
      case 'BENEFIT_TYPES':
        return (
          !isBenefitsEnabled || !getPermissions['VIEW_SETUP_BENEFIT_TYPES']
        );
      case 'EXPENSE_TYPES':
        return !getPermissions['VIEW_SETUP_EXPENSE_TYPES'];
      case 'REQUEST_TYPES':
        return !getPermissions['VIEW_SETUP_REQUEST_TYPES'];
      case 'CURRENCY_CONVERSION':
        return !getPermissions['VIEW_SETUP_CURRENCY_CONVERSIONS'];
      case 'EMPLOYEE_GROUPS':
        return !getPermissions['VIEW_SETUP_EMPLOYEE_GROUPS'];
      case 'CLAIM_INSPECTOR':
        return !getPermissions['ACTION_SETUP_CLAIM_INSPECTOR'];
      case 'RULES':
        return !getPermissions['VIEW_SETUP_RULES'];
      // case 'ENTITLEMENT_RULES':
      //   return !getPermissions['VIEW_SETUP_RULES'];
      case 'REFERENCE_OBJECTS':
        return !getPermissions['VIEW_SETUP_REFERENCE_OBJECTS'];
      case 'COST_CENTRES':
        return !getPermissions['VIEW_SETUP_COST_CENTRES'];
      case 'WAGE_TYPES':
        return !getPermissions['VIEW_SETUP_WAGE_TYPES'];
      case 'GL_ACCOUNTS':
        return !getPermissions['VIEW_SETUP_GL_ACCOUNTS'];
      case 'ENTITY':
        return !getPermissions['VIEW_SETUP_ENTITIES'];
      case 'ROLES':
        return !getPermissions['VIEW_SETUP_ROLES'];
      case 'EMAIL_TEMPLATES':
        return !getPermissions['VIEW_SETUP_EMAIL_TEMPLATES'];
    }
  };

  const isSectionHidden = (title: string) => {
    switch (title) {
      case 'Configuration':
        return (
          !getPermissions['VIEW_SETUP_EXPENSE_TYPES'] &&
          !getPermissions['VIEW_SETUP_REQUEST_TYPES'] &&
          (!isBenefitsEnabled || !getPermissions['VIEW_SETUP_BENEFIT_TYPES'])
        );
      case 'Other':
        return (
          !getPermissions['VIEW_SETUP_CURRENCY_CONVERSIONS'] &&
          !getPermissions['VIEW_SETUP_EMPLOYEE_GROUPS'] &&
          !getPermissions['ACTION_SETUP_CLAIM_INSPECTOR'] &&
          !getPermissions['VIEW_SETUP_RULES']
        );
      case 'Master Data':
        return (
          !getPermissions['VIEW_SETUP_COST_CENTRES'] &&
          !getPermissions['VIEW_SETUP_WAGE_TYPES'] &&
          !getPermissions['VIEW_SETUP_GL_ACCOUNTS'] &&
          !getPermissions['VIEW_SETUP_ENTITIES']
        );
    }
  };

  let listElem: React.ReactElement[] = [];
  for (let [key, value] of Object.entries(adminOptions)) {
    if (adminOptions.hasOwnProperty(key)) {
      if (value.length) {
        let innerListElem: any = [];
        innerListElem = value.map((o: IadminInnerOptions, i: number) => {
          if (!isListItemToBeHidden(o.code)) {
            return (
              <Col key={i} className={`${o.classNames} options`} span={24}>
                <NavLink className='custom-nav-link' to={`${o.linkTo}`}>
                  {o.label}
                </NavLink>
              </Col>
            );
          }
          return <></>;
        });
        if (!isSectionHidden(key)) {
          listElem.push(
            <Col
              xs={24}
              sm={12}
              md={8}
              lg={8}
              xl={6}
              xxl={6}
              key={key}
              className='options-container'
            >
              <Row>
                <Col
                  className={`${String(key).trim()}-container options-header`}
                  span={24}
                >
                  {key}
                </Col>
                {innerListElem}
              </Row>
            </Col>,
          );
        }
      }
    }
  }

  return (
    <>
      <HeaderBarWrapper headerCommonProps={{ title: <Trans>Setup</Trans> }}>
        <Row className='admin-container' gutter={[24, 8]}>
          {listElem}
        </Row>
      </HeaderBarWrapper>
    </>
  );
};

const mapStateToProps = (state: stateInterface) => {
  return {
    isBenefitsEnabled: getIsBenefitEnabled(state),
    isAllowanceEnabled: getIsAllowancesEnabled(state),
    getTenantConfigRecords: getTenantConfigRecords(state),
    getPermissions: getPermissions(state),
    tenantConfig: state.configuration.tenantConfig,
    isEnableTrafficLightFeatureForTenantFeatures:
      state.configuration.isEnableTrafficLightFeatureForTenantFeatures,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  return {
    _getTrafficLightFeatureForTenantFeature: () =>
      dispatch(getTrafficLightFeatureForTenantFeature()),
  };
};

const connector = connect(mapStateToProps, mapDispatchToProps);
export default memo(connector(Admin));
