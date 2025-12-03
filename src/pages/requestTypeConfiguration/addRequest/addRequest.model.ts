export interface AddRequestProps {
  id: string;
}

export enum ACTION_TYPE {
  SAVE_DRAFT,
  ADD_ANOTHER,
  SEND_APPROVAL,
}

export interface ATTACHMENT {
  index: number;
  file: any;
  type: 'hotel' | 'flight';
}