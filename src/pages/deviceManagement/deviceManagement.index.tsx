import React from 'react';
import { HeaderBarWrapper } from '../../shared/components';
import { Trans } from '@lingui/macro';
import './deviceManagement.index.less';
import QrCodeAndTimer from './Components/qrCodeAndTimer/qrCodeAndTimer.index';
import DeviceTable from './Components/deviceTable/deviceTable.index';

// eslint-disable-next-line no-empty-pattern
const DeviceManagement: React.FC = ({}) => {
  return (
    <>
      <HeaderBarWrapper headerCommonProps={{ title: <Trans>Devices</Trans> }}>
        <div className='device-management-container'>
          <QrCodeAndTimer />
          <DeviceTable />
        </div>
      </HeaderBarWrapper>
    </>
  );
};

export default DeviceManagement;
