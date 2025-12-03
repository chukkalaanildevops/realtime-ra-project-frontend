/* eslint-disable jsx-a11y/alt-text */
import React from 'react';
import { Col, Divider, Button, Badge } from 'antd';
import { ErrorBoundary } from '../../../shared/components';
import { CheckOutlined } from '@ant-design/icons';
import { Trans } from '@lingui/macro';
const UserCard: React.FC<{
  profile: string;
  name: string;
  designation: string;
  isActive: boolean;
  emp_id: string;
  isSelected: boolean;
  onSelectUser: (id: number) => void;
  id: number;
}> = ({
  profile,
  designation,
  isActive,
  name,
  emp_id,
  isSelected,
  id,
  onSelectUser,
}) => {
  return (
    <Col xs={24} sm={12} md={12} lg={8} xl={8} xxl={6}>
      <ErrorBoundary>
        <div className={`card ${isSelected ? 'selected' : ''}`}>
          <div className='user-details'>
            {isSelected ? (
              <Badge
                count={<CheckOutlined className='badge-icon' />}
                color='blue'

                // style={{ marginLeft: -24, marginTop: 14 }}
              >
                <img
                  src={
                    profile
                      ? profile
                      : require('../../../assets/images/default/user.png')
                  }
                  className='img-profile'
                />
              </Badge>
            ) : (
              <img
                src={
                  profile
                    ? profile
                    : require('../../../assets/images/default/user.png')
                }
                className='img-profile'
              />
            )}
            <div className='user-info'>
              <div className='user-name'>{name}</div>
              <div className='user-designation'>{designation}</div>
              <div className='user-status'>
                {isActive ? 'Active' : 'In Active'}
              </div>
            </div>
          </div>
          <Divider style={{ marginTop: 12, marginBottom: 12 }} />
          <div className='lower-div'>
            <div className='label'>
              <Trans>Employee ID</Trans>
            </div>
            <div className='value'>{emp_id || '-'}</div>
            <Button
              type='link'
              className='btn-select'
              disabled={isSelected}
              onClick={() => onSelectUser(id)}
            >
              Select
            </Button>
          </div>
        </div>
      </ErrorBoundary>
    </Col>
  );
};

export default UserCard;
