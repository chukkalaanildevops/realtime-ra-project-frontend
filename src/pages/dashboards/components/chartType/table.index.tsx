import { Table } from 'antd';
import React, { useEffect, useState } from 'react';
import { getDashboardChartData } from '../../../../services/dashboards';
import { Loader } from '../../../../shared/components';

const TableChart: React.FC<{
  title: string;
  id: number;
  viewAsRole: any;
}> = props => {
  const { title, id, viewAsRole } = props;

  const [tableData, setTableData] = useState<any>(null);
  const [loader, setLoader] = useState<boolean>(false);

  useEffect(() => {
    setLoader(true);
    id &&
      getDashboardChartData(id, viewAsRole).then((response: any) => {
        const responseData = response.data;
        setTableData(responseData);
        setLoader(false);
      });
  }, [id, viewAsRole]);

  let data = tableData && tableData.data;
  data =
    data &&
    data.map(
      (item: {
        'Employee Name': string;
        'Employee Username': string;
        'Total Amount': number;
      }) => {
        return {
          ...item,
          'Total Amount': Number(item['Total Amount'].toFixed(2)),
        };
      },
    );

  let columns = tableData && tableData.columns;

  const result = loader ? (
    <Loader loaderClass='loader' />
  ) : (
    <Table
      dataSource={data || []}
      columns={columns}
      pagination={false}
      scroll={{ x: true }}
    />
  );

  return (
    <div className='table'>
      <div className='title'>{title}</div>
      <div className='content'>{result}</div>
    </div>
  );
};

export default TableChart;
