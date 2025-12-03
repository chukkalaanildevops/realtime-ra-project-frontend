import React, { memo, SFC } from 'react';
import { HeaderBarWrapper } from '../../shared/components';
import { appPath } from '../app/app.routes';
import { IsetupOptions, IsetupInnerOptions } from './settings.model';
import { Col, Row } from 'antd';
import { NavLink } from 'react-router-dom';
import './settings.index.less';
import { Trans } from '@lingui/macro';

const Setup: SFC = () => {
  const adminOptions: IsetupOptions = {
    Configuration: [
      {
        label: <Trans>SSO Configuration</Trans>,
        linkTo: `${appPath.settings.configuration.linkTo}sso`,
        classNames: '',
      },
      {
        label: <Trans>Tenant Configuration</Trans>,
        linkTo: `${appPath.settings.configuration.linkTo}global`,
        classNames: '',
      },
      {
        label: <Trans>FTP Configuration</Trans>,
        linkTo: `${appPath.settings.configuration.linkTo}ftp`,
        classNames: '',
      },
    ],
    Integration: [
      {
        label: <Trans>SF Integration</Trans>,
        linkTo: `${appPath.settings.sfIntegration.linkTo}scheduling`,
        classNames: '',
      },
      {
        label: <Trans>System Labels Customisation</Trans>,
        linkTo: appPath.settings.systemLabelsCustomisation.linkTo,
        classNames: '',
      },
      {
        label: <Trans>Outbound</Trans>,
        linkTo: `${appPath.settings.outbound.linkTo}scheduling`,
        classNames: '',
      },
      {
        label: <Trans>Inbound</Trans>,
        linkTo: `${appPath.settings.inbound.linkTo}scheduling`,
        classNames: '',
      },
    ],
  };
  let listElem: React.ReactElement[] = [];
  for (let [key, value] of Object.entries(adminOptions)) {
    if (adminOptions.hasOwnProperty(key)) {
      if (value.length) {
        let innerListElem: any = [];
        innerListElem = value.map((o: IsetupInnerOptions, i: number) => (
          <Col key={i} className={`${o.classNames} options`} span={24}>
            <NavLink className='custom-nav-link' to={`${o.linkTo}`}>
              {o.label}
            </NavLink>
          </Col>
        ));
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

  return (
    <>
      <HeaderBarWrapper headerCommonProps={{ title: <Trans>Settings</Trans> }}>
        <Row className='setup-container' gutter={[24, 8]}>
          {listElem}
        </Row>
      </HeaderBarWrapper>
    </>
  );
};

export default memo(Setup);
