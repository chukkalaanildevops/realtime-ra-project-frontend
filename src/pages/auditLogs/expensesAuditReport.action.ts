export const EXPENSE_AUDIT_ACTIONS = {
  SET_LOADING: 'EXPENSE_AUDIT_ACTIONS/SET_LOADING',
  SAVE_EXPENSE_AUDIT_DATA: 'EXPENSE_AUDIT_ACTIONS/SAVE_EXPENSE_AUDIT_DATA',
  SET_EXPENSE_AUDIT_ERROR: 'EXPENSE_AUDIT_ACTIONS/SET_EXPENSE_AUDIT_ERROR',
};

export const setLoader = (isLoading: boolean) => ({
  type: EXPENSE_AUDIT_ACTIONS.SET_LOADING,
  payload: isLoading,
});

export const saveExpenseAuditData = (data: {}) => ({
  type: EXPENSE_AUDIT_ACTIONS.SAVE_EXPENSE_AUDIT_DATA,
  payload: data,
});

export const setExpenseAuditError = (data: string) => ({
  type: EXPENSE_AUDIT_ACTIONS.SET_EXPENSE_AUDIT_ERROR,
  payload: data,
});
