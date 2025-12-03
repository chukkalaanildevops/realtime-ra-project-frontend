import React, { useEffect, useState } from 'react';
import { getDashboardChartData } from '../../../../services/dashboards';
import { Line } from '@ant-design/charts';
import { Loader } from '../../../../shared/components';

const LineChart: React.FC<{
  title: string;
  id: number;
  viewAsRole: any;
}> = props => {
  const { title, id, viewAsRole } = props;

  const [lineData, setLineData] = useState<any>(null);
  const [loader, setLoader] = useState<boolean>(false);

  useEffect(() => {
    setLoader(true);
    id &&
      getDashboardChartData(id, viewAsRole).then((response: any) => {
        const responseData = response.data;
        setLineData(responseData);
        setLoader(false);
      });
  }, [id, viewAsRole]);

  let data = lineData ? (lineData.data.length > 0 ? lineData.data : []) : [];

  data =
    data &&
    data.map(
      (item: {
        'Cost Centre Code': string;
        'Cost Centre Title': string;
        'Number Of Claims': number;
        'Total Amount': number;
      }) => {
        return {
          ...item,
          'Total Amount': Number(item['Total Amount'].toFixed(2)),
        };
      },
    );

  let config = {
    data: data || [],
    seriesField: (lineData && lineData.seriesField) || 'Cost Centre Title',
    xField: (lineData && lineData.xField) || 'Expense Date',
    yField: (lineData && lineData.yField) || 'Total Amount',
  };

  const result = loader ? (
    <Loader loaderClass='loader' />
  ) : (
    <>
      <Line {...config} />
      {/* <div className='chart-footer'>
        <span>X - {(lineData && lineData.xField) || 'Expense Date'}</span>
        <span>Y - {(lineData && lineData.yField) || 'Total Amount'}</span>
      </div> */}
    </>
  );

  return (
    <div className='line'>
      <div className='title'>{title}</div>
      <div className='content'>{result}</div>
    </div>
  );
};

export default LineChart;
