import React from 'react';
import './chartBox.index.less';
import StatisticsChart from '../chartType/stats.index';
import TableChart from '../chartType/table.index';
import ScatterChart from '../chartType/scatter.index';
import PieChart from '../chartType/pie.index';
import LineChart from '../chartType/line.index';

const ChartBoxContainer: React.FC<{
  data: any;
  viewAsRole: any;
}> = props => {
  const { data, viewAsRole } = props;
  const { title, id, chart_type } = data;
  return (
    <div className='chart-box'>
      {chart_type.code === 'STATS' && (
        <StatisticsChart
          title={title}
          id={id}
          key={id}
          viewAsRole={viewAsRole}
        />
      )}
      {chart_type.code === 'TABLE' && (
        <TableChart title={title} id={id} key={id} viewAsRole={viewAsRole} />
      )}
      {chart_type.code === 'SCATTER' && (
        <ScatterChart title={title} id={id} key={id} viewAsRole={viewAsRole} />
      )}
      {chart_type.code === 'PIE' && (
        <PieChart title={title} id={id} key={id} viewAsRole={viewAsRole} />
      )}

      {chart_type.code === 'LINE' && (
        <LineChart title={title} id={id} key={id} viewAsRole={viewAsRole} />
      )}
    </div>
  );
};

export default ChartBoxContainer;
