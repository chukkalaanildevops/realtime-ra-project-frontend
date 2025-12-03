import { actionBtnObjInterface } from '../dotMenu/dotMenu.model';

export interface IEntityCardProps {
  isCustomizeHidden?: boolean;
  title: string;
  subTitle?: string;
  more?: actionBtnObjInterface[];
  isCustomConfig: boolean;
  onDetailClick: () => void;
  onCustomize?: () => void;
  onReset?: () => void;
  onDelete?: () => void;
  isDotMenuHidden?: boolean;
}
