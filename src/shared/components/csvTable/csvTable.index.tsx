import React, {
  memo,
  FC,
  useState,
  useEffect,
  ReactNode,
  MouseEvent,
} from 'react';
import Papa from 'papaparse';
import { ICSVTableProps } from './csvTable.model';
import Modal from 'antd/lib/modal/Modal';
import { Table, Alert } from 'antd';
import './csvTable.index.less';

const CSVTable: FC<ICSVTableProps> = props => {
  const {
    file,
    modelHeader = 'CSV File Details',
    tableHeader = ['Title'],
    isFirstRowAsHeader = false,
    errors,
    papaConfig = {
      skipEmptyLines: true,
      header: props.tableHeader.length > 0,
    },
    onClose,
  } = props;

  //   const [getError, setError] = useState<string[]>([]);
  const [getModelVisiblity, setModelVisiblity] = useState<boolean>(true);
  //   const [getLoading, setLoading] = useState<boolean>(true);
  const [getTableData, setTableData] = useState<any[]>([]);
  const [getTablecolumns, setTablecolumns] = useState<any[]>([]);
  //   const [getParserResult, setParserResult] = useState<ParseResult<any>>({
  //     data: [],
  //     errors: [],
  //     meta: {} as any,
  //   });

  useEffect(() => {
    if (file) {
      Papa.parse(file, {
        ...papaConfig,
        complete: function(results, _file) {
          //   setParserResult(results);
          // debugger;
          const LowerCaseHeader = tableHeader.map(o => o.toLowerCase());
          let _data: any[] = [];
          let _column: any[] = [];
          if (tableHeader.length > 0) {
            //   {
            //   title: o,
            //   dataIndex: o.toLowerCase(),
            //   key: o.toLowerCase(),
            //   render: (text: ReactNode) => <>{text}</>,
            // }
            _column =
              tableHeader.length > 0
                ? tableHeader.map((o: string) =>
                    createColumnObj(o, (text: ReactNode) => <>{text}</>),
                  )
                : [];
            _data = results.data.map(o => {
              let response: any = {};
              const keys = Object.keys(o);
              keys.forEach((v: string) => {
                if (LowerCaseHeader.includes(v.toLowerCase())) {
                  response[v.toLowerCase()] = o[v];
                }
              });
              return response;
            });
          } else {
            if (isFirstRowAsHeader) {
              let columnHeader: string[] = [];
              results.data.forEach((o: string[], i: number) => {
                let response: any = {};
                if (i === 0) {
                  columnHeader = o.map(n => n.toLowerCase());
                  //   {
                  //   title: i,
                  //   dataIndex: i.toLowerCase(),
                  //   key: i.toLowerCase(),
                  //   render: (text: ReactNode) => <>{text}</>,
                  // }
                  _column =
                    o.length > 0
                      ? o.map((i: string) =>
                          createColumnObj(i, (text: ReactNode) => <>{text}</>),
                        )
                      : [];
                  return;
                } else {
                  columnHeader.forEach((p: string, q: number) => {
                    response[p] = o[q];
                  });
                }
                _data.push(response);
              });
            } else {
              _data = results.data.map((o: string[], i: number) => {
                let response: any = {};
                o.forEach((v: string, num: number) => {
                  if (i === 0) {
                    //       {
                    //     title: `Column ${num}`,
                    //     dataIndex: `Column ${num}`.toLowerCase(),
                    //     key: `Column ${num}`.toLowerCase(),
                    //     render: (text: ReactNode) => <>{text}</>,
                    //   }
                    _column.push(
                      createColumnObj(`Column ${num}`, (text: ReactNode) => (
                        <>{text}</>
                      )),
                    );
                  }
                  response[_column[num].dataIndex] = v;
                });
                return response;
              });
            }
          }
          setTableData(_data);
          setTablecolumns(_column);
          //   setLoading(false);
          //   setError([]);
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);

  const createColumnObj = (
    title: string,
    renderFn: (text?: ReactNode, row?: any, index?: number) => ReactNode,
  ) => ({
    title: title,
    dataIndex: title.toLowerCase(),
    key: title.toLowerCase(),
    render: renderFn,
  });

  const innerValCheck = (val: any) => (typeof val === 'string' ? true : false);

  const isGlobalError: boolean =
    errors.hasOwnProperty('errors') && errors?.errors?.length
      ? innerValCheck(errors.errors[0])
      : errors?.length
      ? innerValCheck(errors[0])
      : false;

  return (
    <>
      <Modal
        wrapClassName='csv-table-model'
        visible={getModelVisiblity}
        destroyOnClose={true}
        centered={true}
        closable={true}
        confirmLoading={true}
        maskClosable={true}
        title={modelHeader}
        onCancel={(e: MouseEvent<HTMLElement>) => {
          setModelVisiblity(false);
          onClose && onClose(e);
        }}
        footer={false}
        width={'60%'}
        getContainer='.page-container'
      >
        <Table
          bordered
          columns={getTablecolumns}
          pagination={{ hideOnSinglePage: true }}
          dataSource={getTableData}
        />
        {isGlobalError
          ? errors.errors.map((o: string, i: number) => (
              <Alert key={i} type='error' message={o} banner />
            ))
          : null}
      </Modal>
    </>
  );
};

export default memo(CSVTable);
