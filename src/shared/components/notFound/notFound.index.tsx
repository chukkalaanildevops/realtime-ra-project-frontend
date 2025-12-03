import React, { FC, useEffect } from 'react';
import HeaderBarWrapper from '../headerBarWrapper/headerBarWrapper.index';
import { Result, Button } from 'antd';
import { NavLink } from 'react-router-dom';
import { setDocumentTitle } from '../../../utils/global.utils';
import { appPath } from '../../../pages/app/app.routes';
import { Trans } from '@lingui/macro';

const NotFound: FC = () => {
  useEffect(() => {
    // ComponentDidMount
    setDocumentTitle(appPath.notFound.title);
  }, []);

  return (
    <HeaderBarWrapper hideHeaderCommon={true} headerCommonProps={{ title: '' }}>
      <Result
        status='404'
        title='404'
        subTitle='Sorry, the page you visited does not exist.'
        extra={
          <NavLink exact to='/'>
            <Button type='primary'>
              <Trans>Back Home</Trans>
            </Button>
          </NavLink>
        }
      />
    </HeaderBarWrapper>
  );
};

export default NotFound;
