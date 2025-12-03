import { ParseConfig } from 'papaparse';
import { ReactNode, MouseEvent } from 'react';
/*
 * ParseConfig
 * DEFAULT UNPARSE CONFIG WITH ALL OPTIONS
 * {
 *      quotes: false, //or array of booleans
 *        quoteChar: '"',
 *       escapeChar: '"',
 *       delimiter: ",",
 *       header: true,
 *       newline: "\r\n",
 *       skipEmptyLines: false, //or 'greedy',
 *       columns: null //or array of strings
 *   }
 *  ---------------------------------------
 * url: https://www.papaparse.com/docs
 */

export interface ICSVTableProps {
  file: File;
  modelHeader?: string | ReactNode;
  tableHeader: string[];
  isFirstRowAsHeader?: boolean; // if true then pass [] inside `tableHeader`
  errors?: any;
  papaConfig?: ParseConfig;
  onClose?: (e: MouseEvent<HTMLElement>) => void;
}
