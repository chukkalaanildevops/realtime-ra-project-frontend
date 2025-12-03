import React, { FC } from 'react';
import { Button } from 'antd';
import { appPath } from '../../../pages/app/app.routes';
import brandImage from '../../../assets/images/branding/reimburse logo main.png';
import brokenLinkImage from '../../../assets/images/default/no wifi icon.png';
import { Link } from 'react-router-dom';

import './noInternetConnection.index.less';
const noInternetConnection: FC<{
  isOnline?: boolean;
}> = props => {
  const { isOnline } = props;

  return (
    <div className='no-internet-connection-container'>
      <div className='no-internet-connection-header'>
        <Link to={appPath.home.linkTo} data-cy='appLogoLink'>
          <img
            alt='Branding'
            src={brandImage}
            className={'no-internet-connection-header-logo'}
          />
        </Link>
      </div>
      <div className='no-internet-connection-body'>
        <img
          alt='broken'
          src={brokenLinkImage}
          className={'no-internet-connection-body-logo'}
        ></img>
        <div className={'no-internet-connection-body-title'}>
          No Internet Connection
        </div>
        <div className={'no-internet-connection-body-description'}>
          Please check your internet connection and try again
        </div>
        <Button
          type='primary'
          size='large'
          onClick={() => {
            isOnline && window.location.reload();
          }}
        >
          Try Again
        </Button>
      </div>
      <div className='no-internet-connection-footer'></div>
    </div>
  );
};

export default noInternetConnection;
