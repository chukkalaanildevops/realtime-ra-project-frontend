import React, { FC, useEffect } from 'react';
import HeaderBarWrapper from '../headerBarWrapper/headerBarWrapper.index';
import { Result, Button } from 'antd';
import { NavLink } from 'react-router-dom';
import { setDocumentTitle } from '../../../utils/global.utils';
import { appPath } from '../../../pages/app/app.routes';

const Unauthorized: FC = () => {
  useEffect(() => {
    // ComponentDidMount
    setDocumentTitle(appPath.notFound.title);
  }, []);

  return (
    <HeaderBarWrapper hideHeaderCommon={true} headerCommonProps={{ title: '' }}>
      <Result
        status='403'
        title='403'
        subTitle='Sorry, you are not authorized to access this page.'
        extra={
          <NavLink exact to='/'>
            <Button type='primary'>Back Home</Button>
          </NavLink>
        }
      />
    </HeaderBarWrapper>
  );
};

export default Unauthorized;
