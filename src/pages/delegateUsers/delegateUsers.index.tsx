import React, { Dispatch, useEffect } from 'react';
import { HeaderBarWrapper } from '../../shared/components';
import {
  fetchDelegateUsers,
  fetchCurrentDelegateUser,
} from '../delegate/delegate.thunk';
import {
  getCurrentDelegateUser,
  getProxyUsers,
} from '../../shared/redux/rootReducer';
import { connect, ConnectedProps } from 'react-redux';
import { Row } from 'antd';
import './delegateUsers.index.less';
import UserCard from './components/userCard';
import { Trans } from '@lingui/macro';

const DelegateUsers: React.FC<ConnectedProps<typeof connector>> = ({
  _fetchDelegateUsers,
  _selectDelegateUser,
  currentDelegateUser,
  users,
}) => {
  useEffect(() => {
    _fetchDelegateUsers();
    // eslint-disable-next-line
  }, []);

  const selectDelegate = (id: number) => {
    _selectDelegateUser(id);
  };

  return (
    <HeaderBarWrapper
      headerCommonProps={{ title: <Trans>Delegated Users</Trans> }}
    >
      <div className='delegated-users-container'>
        <Row gutter={[24, 24]}>
          {users.map(item => (
            <UserCard
              profile={item.on_behalf_of.profile}
              name={item?.on_behalf_of?.legal_name || item.on_behalf_of.name}
              designation={item.on_behalf_of.position}
              isActive={true}
              emp_id={item.on_behalf_of.employee_id}
              isSelected={
                currentDelegateUser?.on_behalf_of.id === item.on_behalf_of.id
              }
              onSelectUser={() => selectDelegate(item.on_behalf_of.id)}
              id={item.id}
              key={item.id}
            />
          ))}
        </Row>
      </div>
    </HeaderBarWrapper>
  );
};

const mapStateToProps = (state: any) => {
  return {
    users: getProxyUsers(state),
    currentDelegateUser: getCurrentDelegateUser(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  _fetchDelegateUsers: () => dispatch(fetchDelegateUsers()),
  _selectDelegateUser: (id: number) => dispatch(fetchCurrentDelegateUser(id)),
});

const connector = connect(mapStateToProps, mapDispatchToProps);

export default connector(DelegateUsers);
