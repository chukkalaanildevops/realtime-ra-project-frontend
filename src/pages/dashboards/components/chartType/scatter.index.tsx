import React, { useEffect, useState } from 'react';
import { getDashboardChartData } from '../../../../services/dashboards';
import { Scatter } from '@ant-design/charts';
import { Loader } from '../../../../shared/components';

const ScatterChart: React.FC<{
  title: string;
  id: number;
  viewAsRole: any;
}> = props => {
  const { title, id, viewAsRole } = props;

  const [scatterData, setScatterData] = useState<any>(null);
  const [loader, setLoader] = useState<boolean>(false);

  useEffect(() => {
    setLoader(true);
    id &&
      getDashboardChartData(id, viewAsRole).then((response: any) => {
        const responseData = response.data;
        setScatterData(responseData);
        setLoader(false);
      });
  }, [id, viewAsRole]);

  let data = scatterData
    ? scatterData.data.length > 0
      ? scatterData.data
      : []
    : [];

  data =
    data &&
    data.map(
      (item: {
        'Employee Name': string;
        'Employee Username': string;
        'Number Of Claims': number;
        'Total Amount': number;
      }) => {
        return {
          ...item,
          'Total Amount': Number(item['Total Amount'].toFixed(2)),
        };
      },
    );

  var config = {
    appendPadding: 30,
    data: data || [],
    xField: (scatterData && scatterData.xField) || 'Total Amount',
    yField: (scatterData && scatterData.yField) || 'Number Of Claims',
    colorField: (scatterData && scatterData.colorField) || 'Cost Centre Title',
    shape: 'circle',
    tooltip: {
      fields: ['Total Amount', 'Number Of Claims', 'Cost Centre Title'],
    },
  };

  const result = loader ? (
    <Loader loaderClass='loader' />
  ) : (
    <h1>
      <Scatter {...config} />
      {/* <div className='chart-footer'>
        <span>X - {(scatterData && scatterData.xField) || 'Total Amount'}</span>
        <span>
          Y - {(scatterData && scatterData.yField) || 'Number Of Claims'}
        </span>
      </div> */}
    </h1>
  );

  return (
    <div className='scatter'>
      <div className='title'>{title}</div>
      <div className='content'>{result}</div>
    </div>
  );
};

export default ScatterChart;
