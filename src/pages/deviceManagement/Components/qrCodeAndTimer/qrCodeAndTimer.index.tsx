import React, { useEffect, useState } from 'react';
import { Col, Row } from 'antd';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import QRCode from 'qrcode.react';
import './qrCodeAndTimer.index.less';
import { getQrOtp } from '../../../../services/deviceManagement/index';
import { ErrorBoundary } from '../../../../shared/components';

// eslint-disable-next-line no-empty-pattern
const QrCodeAndTimer: React.FC = ({}) => {
  const [qrData, setQrData] = useState<any>('');
  const fetchQrCodeValue = () => {
    getQrOtp().then(res => {
      const { otp, user, tenant, env } = res.data;
      setQrData(`${otp}:${user}:${tenant}:${env}`);
    });
    // setQrData('123456');
    return;
  };
  useEffect(() => {
    fetchQrCodeValue();
  }, []);
  return (
    <ErrorBoundary>
      {qrData.length ? (
        <Row className='qr-code-container'>
          <Col className='device-management-code-container'>
            <QRCode value={qrData} size={150} />
          </Col>
          <Col>
            <CountdownCircleTimer
              isPlaying
              duration={30}
              colors={'#1890FF'}
              size={80}
              strokeWidth={7}
              onComplete={() => {
                fetchQrCodeValue();
                return [true, 1000]; // repeat animation in 1.5 seconds
              }}
            >
              {({ remainingTime }) => remainingTime}
            </CountdownCircleTimer>
          </Col>
        </Row>
      ) : (
        <div className='qr-loader'></div>
      )}
    </ErrorBoundary>
  );
};

export default QrCodeAndTimer;
