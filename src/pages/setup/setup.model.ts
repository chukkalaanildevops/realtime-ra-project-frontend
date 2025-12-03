export interface IadminInnerOptions {
  label: any;
  linkTo: string;
  classNames: string;
  code: string;
}
export interface IadminOptions {
  [key: string]: IadminInnerOptions[];
}
