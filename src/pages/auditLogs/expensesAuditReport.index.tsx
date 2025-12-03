import React, { Dispatch, useEffect } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  ElementOrSkeleton,
  ErrorBoundary,
  HeaderBarWrapper,
} from '../../shared/components';
import { getQueryString } from '../../utils/scroll.utils';
import { getExpenseAuditData } from './expensesAuditReport.thunk';

const ExpensesAuditReport: React.FC<ConnectedProps<typeof connector>> = ({
  expenseAuditData,
  loader,
  _getExpenseAuditData,
}) => {
  const eno = getQueryString('expenseNo');
  const params: any = useParams();
  const type = params.type;
  const id = params.id;
  useEffect(() => {
    if (eno) {
      _getExpenseAuditData(type, id);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderexpenseAuditData = () => {
    if (Object.keys(expenseAuditData).length === 0) {
      return null;
    }

    // return expenseAuditData.changes.map((o: any) => (
    //   <ul>
    //     {for(let field in o){
    //       <li>
    //       {`${expenseAuditData.field_names[field] || field} -> ${
    //         expenseAuditData.changes[1][field]
    //       }`}
    //       </li>
    //     }}
    //   </ul>
    // ));
    return <h1>Hey</h1>;
  };
  return (
    <ErrorBoundary>
      <HeaderBarWrapper headerCommonProps={{ title: `Audit Logs #${eno}` }}>
        <div className='expense-audit-container'>
          {loader ? (
            <ElementOrSkeleton isLoading={loader} type='table' />
          ) : (
            renderexpenseAuditData()
          )}
        </div>
      </HeaderBarWrapper>
    </ErrorBoundary>
  );
};

const mapStateToProps = (state: any) => ({
  expenseAuditData: state.expenseAudit.expenseAuditData,
  loader: state.expenseAudit.loader,
});

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  _getExpenseAuditData: (type: string, id: string) =>
    dispatch(getExpenseAuditData(type, id)),
});

const connector = connect(mapStateToProps, mapDispatchToProps);
export default connector(ExpensesAuditReport);

// const AuditHistory = () => {
//   return <h1>hey</h1>;
// };
