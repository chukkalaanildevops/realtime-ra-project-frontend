// import React from 'react';

export type Tdispatch = (arg0: { type: string; payload: any }) => void;

export interface IreturnWithInlineFlexClass {
  isChecked: boolean;
  dispatch: Tdispatch;
  formLayout?: {};
  _name: string;
  _className: string;
}

export interface IreturnChildProps {
  type: string;
  val: string | number | boolean;
  dispatch: Tdispatch;
}
