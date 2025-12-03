import React from 'react';
import { Empty, Button } from 'antd';
import brokenLinkImage from '../../../assets/images/default/broken-link.png';
import { Trans } from '@lingui/macro';

const BrokenLink = (props: {
  description?: string;
  onTryAgain: () => void;
}) => {
  return (
    <div className='broken-link-container'>
      <Empty
        style={{
          height: 240,
          display: 'flex',
          flexFlow: 'column',
          margin: 24,
        }}
        description={props.description}
        image={brokenLinkImage}
        imageStyle={{ width: 64, height: 64, margin: 'auto' }}
      >
        <Button type='ghost' onClick={() => props.onTryAgain()}>
          <Trans>Try Again</Trans>
        </Button>
      </Empty>
    </div>
  );
};

export default BrokenLink;
