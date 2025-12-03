import { TableProps } from 'antd/lib/table';
import React from 'react';
import { Base } from '../../hooks/useEditable/useEditable.model';
export interface EditableTableCustomProps<T> {
  onAddItem?: (event: React.MouseEvent) => void;
  onUpload?: (event: React.MouseEvent) => void;
}

export type EditableTableProps<T> = EditableTableCustomProps<T> & TableProps<T>;

type RecordType<T extends Base> = {
  record: T;
};

export interface EditableCellProps<T>
  extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: 'number' | 'text' | 'password';
  record: T;
  index: number;
  isRequired: boolean;
  errorMsg: string;
  children: React.ReactNode;
}
