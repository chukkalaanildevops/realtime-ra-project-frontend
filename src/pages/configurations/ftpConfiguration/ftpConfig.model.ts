import { Base } from '../../../shared/hooks/useEditable/useEditable.model';
export interface Item extends Base {
  user: string;
  password: string;
  ip_address: string;
  hostname: string;
  publicKey?: string;
  id: string;
}

export interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: 'number' | 'text' | 'password';
  record: Item;
  index: number;
  isRequired: boolean;
  children: React.ReactNode;
}
