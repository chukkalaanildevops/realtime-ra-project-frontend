export interface IheaderProps {
  title: React.ReactNode;
  serachBarComp?: boolean;
  notificationComp?: boolean;
  handleSearchChange?: (value: string | number) => void;
}
