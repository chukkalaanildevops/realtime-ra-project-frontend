import React, { useEffect, useState } from 'react';
import { Statistic } from 'antd';
import { getDashboardChartData } from '../../../../services/dashboards';
import { Loader } from '../../../../shared/components';

const StatisticsChart: React.FC<{
  title: string;
  id: number;
  viewAsRole: any;
}> = props => {
  const { title, id, viewAsRole } = props;

  const [statsData, setStatsData] = useState<any>(null);
  const [loader, setLoader] = useState<boolean>(false);

  useEffect(() => {
    setLoader(true);
    id &&
      getDashboardChartData(id, viewAsRole).then((response: any) => {
        const responseData = response.data;
        setStatsData(responseData);
        setLoader(false);
      });
  }, [id, viewAsRole]);

  const result = loader ? (
    <Loader loaderClass='loader' />
  ) : (
    <Statistic value={statsData && statsData.value} />
  );

  return (
    <div className='stats'>
      <div className='title'>{title}</div>
      <div className='content'>{result}</div>
    </div>
  );
};

export default StatisticsChart;
