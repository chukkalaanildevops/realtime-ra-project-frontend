import { EXPENSE_AUDIT_ACTIONS } from './expensesAuditReport.action';
import { TexpenseAuditDataType } from './expensesAuditReport.model';

export const initialState: TexpenseAuditDataType = {
  loader: false,
  expenseAuditData: {},
  expenseAuditError: '',
};

export default (state = initialState, action: any) => {
  const { type, payload } = action;

  switch (type) {
    case EXPENSE_AUDIT_ACTIONS.SET_LOADING:
      return {
        ...state,
        loader: payload,
      };
    case EXPENSE_AUDIT_ACTIONS.SAVE_EXPENSE_AUDIT_DATA:
      return {
        ...state,
        expenseAuditData: payload,
      };
    case EXPENSE_AUDIT_ACTIONS.SET_EXPENSE_AUDIT_ERROR:
      return {
        ...state,
        expenseAuditError: payload,
      };
    default:
      return state;
  }
};
