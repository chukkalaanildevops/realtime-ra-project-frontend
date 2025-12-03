import React, { useEffect, useState } from 'react';
import { getDashboardChartData } from '../../../../services/dashboards';
import { Pie } from '@ant-design/charts';
import { Loader } from '../../../../shared/components';

const PieChart: React.FC<{
  title: string;
  id: number;
  viewAsRole: any;
}> = props => {
  const { title, id, viewAsRole } = props;

  const [pieData, setPieData] = useState<any>(null);
  const [loader, setLoader] = useState<boolean>(false);

  useEffect(() => {
    setLoader(true);
    id &&
      getDashboardChartData(id, viewAsRole).then((response: any) => {
        const responseData = response.data;
        setPieData(responseData);
        setLoader(false);
      });
  }, [id, viewAsRole]);

  let data = pieData ? (pieData.data.length > 0 ? pieData.data : []) : [];

  data =
    data &&
    data.map(
      (item: {
        'Expense Category Code': string;
        'Expense Category Title': string;
        'Total Amount': number;
      }) => {
        return {
          ...item,
          'Total Amount': Number(item['Total Amount'].toFixed(2)),
        };
      },
    );

  let config = {
    appendPadding: 10,
    data: data || [],
    title: title,
    angleField: (pieData && pieData.angleField) || 'Total Amount',
    colorField: (pieData && pieData.colorField) || 'Cost Centre Title',
    radius: 0.9,
    label: {
      type: 'inner',
      offset: '-30%',
      content: function content(_ref: any) {
        var percent = _ref.percent;
        return ''.concat((percent * 100).toFixed(0), '%');
      },
      style: {
        fontSize: 14,
        textAlign: 'center',
      },
    },
    interactions: [{ type: 'element-active' }],
  };

  const result = loader ? (
    <Loader loaderClass='loader' />
  ) : (
    // <h1>hey PieChart - {pieData && pieData.data[0]['Total Amount']}</h1>
    <Pie {...config} />
  );

  return (
    <div className='pie'>
      <div className='title'>{title}</div>
      <div className='content'>{result}</div>
    </div>
  );
};

export default PieChart;
