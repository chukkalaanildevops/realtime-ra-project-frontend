import { FC, memo, Dispatch, useEffect } from 'react';
import React from 'react';
import { ConnectedProps, connect } from 'react-redux';

import { Row, Col } from 'antd';
import './pettyCashInfoContainer.index.less';

import { Amount } from '../../../../shared/components';

import { fetchPettyCashManagerTransactionMeta } from '../../addNewExpense.thunk';

import { getPettyCashManagerTransactionMeta } from '../../../../shared/redux/rootReducer';
import { Trans } from '@lingui/macro';

const mapStateToProps = (state: any, _ownProps: any) => ({
  managerMeta: getPettyCashManagerTransactionMeta(state),
});

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  fetchPettyCashManagerTransactionMeta: (id?: number) =>
    dispatch(fetchPettyCashManagerTransactionMeta(id)),
});

const PettyCashInfoContainer: FC<ConnectedProps<typeof connector> & {
  id?: number;
  fromAdmin?: boolean;
}> = props => {
  const componentDidMount = () => {
    if ((props.fromAdmin && props.id) || (!props.fromAdmin && !props.id))
      props.fetchPettyCashManagerTransactionMeta(props.id);
  };

  useEffect(() => {
    componentDidMount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.id]);

  return (
    <div>
      <Row className='petty-cash-container'>
        {/* <Col xs={24} lg={3} className='cell'>
          <div>Transaction #</div>
          <div className='cell--value'>
            {props.managerMeta ? props.managerMeta.transaction_no : '-'}
          </div>
        </Col>

        <Col xs={24} lg={3} className='cell'>
          <div>Transaction Date</div>
          <div className='cell--value'>
            {props.managerMeta ? props.managerMeta.transaction_date : '-'}
          </div>
        </Col>

        <Col xs={24} lg={3} className='cell'>
          <div>Transaction Amount</div>
          <div className='cell--value'>
            <Amount
              currency={props.managerMeta?.country_currency?.currency.code}
              amount={props.managerMeta?.amount}
            />
          </div>
        </Col> */}

        <Col xs={24} lg={5} className='cell'>
          <div>
            <Trans>Petty Cash Given</Trans>
          </div>
          <div className='cell--value'>
            <Amount
              currency={props.managerMeta?.country_currency?.currency.code}
              amount={props.managerMeta?.total_topups}
            />
          </div>
        </Col>

        <Col xs={24} lg={5} className='cell'>
          <div>
            <Trans>Total Reimbursed</Trans>
          </div>
          <div className='cell--value'>
            <Amount
              currency={props.managerMeta?.country_currency?.currency.code}
              amount={props.managerMeta?.total_reimbursed}
            />
          </div>
        </Col>

        <Col xs={24} lg={5} className='cell'>
          <div>
            <Trans>Cash On Hand</Trans>
          </div>
          <div className='cell--value'>
            <Amount
              currency={props.managerMeta?.country_currency?.currency.code}
              amount={props.managerMeta?.cash_in_hand}
            />
          </div>
        </Col>

        <Col xs={24} lg={5} className='cell'>
          <div>
            <Trans>Est. Payment Date</Trans>
          </div>
          <div className='cell--value'>
            {props.managerMeta ? props.managerMeta.estimated_payment_date : '-'}
          </div>
        </Col>

        <Col xs={24} lg={4} className='cell'>
          <div>
            <Trans>Employee</Trans>
          </div>
          <div className='cell--value'>
            {props.managerMeta
              ? props.managerMeta?.petty_cash_manager?.legal_name ||
                props.managerMeta?.petty_cash_manager?.name
              : '-'}
          </div>
        </Col>
      </Row>
    </div>
  );
};

const connector = connect(mapStateToProps, mapDispatchToProps);
export default memo(connector(PettyCashInfoContainer));
