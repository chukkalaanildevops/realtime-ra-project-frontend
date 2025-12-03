import React from 'react';
import { SafetyCertificateTwoTone } from '@ant-design/icons';
import { Trans } from '@lingui/macro';

const AdminFieldIcon: React.FC = () => {
  return (
    <SafetyCertificateTwoTone
      title={`${(<Trans>Admin Field</Trans>)}`}
      twoToneColor='#faad14'
      className='is-admin-icon'
      style={{
        verticalAlign: 'middle',
        fontSize: '1rem',
      }}
    />
  );
};

export default AdminFieldIcon;
