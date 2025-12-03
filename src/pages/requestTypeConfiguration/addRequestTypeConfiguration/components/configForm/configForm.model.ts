export interface Item {
  expense_type: string;
  is_allow_multiple_claims: boolean;
  can_expense_receipt_date_be_outside_request_date: boolean;
  id: number;
  is_deleted: boolean;
  isClone: boolean;
}

export interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  dataIndex: string;
  title: any;
  inputType: 'checkbox' | 'select';
  record: Item;
  index: number;
  isRequired: boolean;
  children: React.ReactNode;
}
