import React from 'react';
import { Row, Col } from 'antd';

export const AuthContainer = (props: any) => {
  return (
    <Row>
      <Col xs={0} lg={12} style={{ height: '100vh' }}>
        <div
          style={{
            height: '100%',
            background: '#0050B3',
            display: 'flex',
            justifyContent: 'center',
            // border: '2px dashed white',
          }}
        >
          <div
            style={{
              // border: '1px solid red',
              backgroundImage: `url(${require('../../assets/images/default/login-background.png')})`,
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              width: '75%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            data-testId='login-bg'
          >
            <div
              style={{
                // border: '1px solid green',
                backgroundImage: `url(${require('../../assets/images/default/reimburse-logo-white-sign-in.png')})`,
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                width: '100%',
                height: '32px',
              }}
              data-testId='reim-logo'
            ></div>
            <div
              style={{
                // border: '1px solid green',
                backgroundImage: `url(${require('../../assets/images/default/reimburse-laptop.png')})`,
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                width: '100%',
                height: '55%',
              }}
              data-testId='reim-laptop'
            ></div>
            <div
              style={{
                // border: '1px solid red',
                color: 'white',
                textAlign: 'center',
                marginTop: '12px',
              }}
              data-testId='bg-text'
            >
              Expenses, Travel and Claims Add-On <br /> for SAP SuccessFactors
            </div>
          </div>
        </div>
      </Col>

      {/* Sign In / Login Form Slot */}
      <Col xs={24} lg={12} style={{ height: '100vh', background: '#fff' }}>
        <Row
          justify='space-around'
          align='middle'
          style={{ height: '100%', padding: '24px' }}
        >
          <Col style={{ height: '350px' }}>{props.children}</Col>
        </Row>
      </Col>
    </Row>
  );
};
