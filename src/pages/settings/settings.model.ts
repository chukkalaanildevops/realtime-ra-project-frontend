export interface IsetupInnerOptions {
  label: string | React.ReactNode;
  linkTo: string;
  classNames: string;
}
export interface IsetupOptions {
  [key: string]: IsetupInnerOptions[];
}
