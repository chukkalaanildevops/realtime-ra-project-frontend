import React, { FC, memo } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { ErrorBoundary, HeaderBarWrapper } from '../../shared/components';
import {
  getCurrentDelegateUser,
  getUser,
  stateInterface,
} from '../../shared/redux/rootReducer';
import './dashboards.index.less';
import { Trans } from '@lingui/macro';
import Widget from './components/Widgets/Widget.index';
import { Button } from 'antd';
import MainContainer from './components/container/mainContainer/mainContainer.index';
import ExpenseTypeData from './components/expensetypedata/expenseTypeData.index';

const Dashboards: FC<Tprops> = props => {
  const { userData } = props;
  let userName = userData?.first_name;
  return (
    <ErrorBoundary>
      <HeaderBarWrapper headerCommonProps={{ title: <Trans>Insights</Trans> }}>
        <div className='Dashboard'>
          <div className='container-1'>
            <div>
              <h2>Hey {userName || ''} ,</h2>
              <p>Here’s what’s happening with your Reimbursement .</p>
            </div>
            <span>
              <Button>Export</Button>
            </span>
          </div>
          <div className='widgets'>
            <Widget />
          </div>
          <div>
            <MainContainer />
          </div>
        </div>
      </HeaderBarWrapper>
    </ErrorBoundary>
  );
};

const mapStateToProps = (state: stateInterface) => {
  return {
    delegationUser: getCurrentDelegateUser(state),
    userData: getUser(state),
  };
};
const connector = connect(mapStateToProps);
type Tprops = ConnectedProps<typeof connector>;
export default connector(memo(Dashboards));
