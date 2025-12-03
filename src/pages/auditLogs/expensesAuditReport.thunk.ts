import { Dispatch } from 'react';
import { expenseAuditDataAPI } from '../../services/expenseAudit';
import {
  saveExpenseAuditData,
  setExpenseAuditError,
  setLoader,
} from './expensesAuditReport.action';

export const getExpenseAuditData = (type: string, id: string) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      dispatch(setLoader(true));

      const response = await expenseAuditDataAPI(type, id);

      const responseData = response.data;
      dispatch(saveExpenseAuditData(responseData));
      dispatch(setLoader(false));
    } catch (e) {
      dispatch(setLoader(false));
      dispatch(setExpenseAuditError(e));
    }
  };
};
